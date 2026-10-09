import asyncio
import base64
import json
import logging
import re
from pathlib import Path
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, FileResponse
from pydantic import BaseModel

from src.config import SERVER_HOST, SERVER_PORT, ALLOWED_ORIGINS, STAGE_SECRET_KEY
from src.engine import BorGPTEngine, THEATRICAL_MODES
from src.tts_engine import BorGPTAudioEngine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("BorGPT-Server")

app = FastAPI(
    title="BorGPT Stage Server & Operator Console",
    description="Backend API, WebSocket streaming and Dual Sentence-by-Sentence TTS server for BorGPT live theatre performance.",
    version="1.4.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = BorGPTEngine(use_cache=True)
audio_engine = BorGPTAudioEngine()

class ChatRequest(BaseModel):
    message: str
    temperature: float = 0.7
    mode: str = "cotidiano"
    operator_cue: str = ""
    synthesize_audio: bool = True

class ChatResponse(BaseModel):
    thought: str
    reply: str
    mode: str
    audio_base64: str = ""

@app.on_event("startup")
async def startup_event():
    logger.info("Initializing BorGPT Gemini Engine & Cache...")
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, engine.initialize)
    logger.info("BorGPT ready for theatrical live performance.")

@app.get("/", response_class=HTMLResponse)
async def serve_dashboard():
    dashboard_path = Path(__file__).parent / "static" / "dashboard.html"
    if dashboard_path.exists():
        return FileResponse(dashboard_path)
    return HTMLResponse("<h1>BorGPT Dashboard</h1><p>dashboard.html not found</p>")

@app.get("/health")
async def health():
    return {
        "status": "online",
        "engine": "Gemini 2.0 Flash",
        "cache_active": engine.use_cache and engine.cached_content_name is not None,
        "current_mode": engine.current_mode,
        "available_modes": list(THEATRICAL_MODES.keys()),
        "audio_primary": audio_engine.primary_engine,
        "audio_fallback": audio_engine.fallback_engine
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    try:
        if req.mode:
            engine.set_mode(req.mode)
        
        thought_text = ""
        speech_chunks = []
        
        for event in engine.stream_response(req.message, temperature=req.temperature, operator_cue=req.operator_cue):
            if event["type"] == "thought":
                thought_text = event["text"]
            elif event["type"] == "speech_chunk":
                speech_chunks.append(event["text"])
        
        spoken_text = "".join(speech_chunks)
        audio_b64 = ""
        if req.synthesize_audio and spoken_text.strip():
            audio_bytes = await audio_engine.synthesize(spoken_text, mode=engine.current_mode)
            if audio_bytes:
                audio_b64 = base64.b64encode(audio_bytes).decode("utf-8")

        return ChatResponse(
            thought=thought_text,
            reply=spoken_text,
            mode=engine.current_mode,
            audio_base64=audio_b64
        )
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws/stage")
async def websocket_stage_endpoint(websocket: WebSocket):
    """
    Realtime WebSocket streaming text and ultra-low-latency sentence-by-sentence audio chunks (<150ms TTFT).
    """
    await websocket.accept()
    logger.info("Theatrical WebSocket client connected.")
    try:
        while True:
            data_str = await websocket.receive_text()
            data = json.loads(data_str)
            action = data.get("action", "chat")

            if action == "set_mode":
                new_mode = data.get("mode", "cotidiano")
                engine.set_mode(new_mode)
                await websocket.send_json({"type": "mode_changed", "mode": new_mode})
                continue

            elif action == "interrupt":
                engine.interrupt_speech()
                await websocket.send_json({"type": "interrupted"})
                continue

            elif action == "inject":
                cue = data.get("text", "")
                engine.add_operator_inject(cue)
                logger.info(f"Operator secret cue injected: {cue}")
                await websocket.send_json({"type": "inject_received", "cue": cue})
                continue

            elif action == "clear":
                engine.clear_history()
                logger.info("Dialogue history cleared by operator.")
                await websocket.send_json({"type": "history_cleared"})
                continue

            elif action == "chat":
                user_msg = data.get("message", "")
                temp = data.get("temperature", None)
                cue = data.get("cue", None)
                want_audio = data.get("audio", True)

                if not user_msg:
                    continue

                active_mode = engine.current_mode
                await websocket.send_json({
                    "type": "start", 
                    "message": user_msg, 
                    "mode": active_mode
                })
                
                thought_str = ""
                full_speech_chunks = []
                sentence_buffer = ""
                sentence_index = 0

                # Regex para detectar fin de frase u oración natural
                sentence_split_pattern = re.compile(r'([.!?…;\n]+|\b,\s+)')

                for event in engine.stream_response(user_msg, temperature=temp, operator_cue=cue):
                    if engine.interrupted:
                        break

                    if event["type"] == "thought":
                        thought_str = event["text"]
                        await websocket.send_json({"type": "thought", "text": thought_str})

                    elif event["type"] == "speech_chunk":
                        chunk_text = event["text"]
                        full_speech_chunks.append(chunk_text)
                        sentence_buffer += chunk_text

                        # Emitir chunk de texto al dashboard
                        await websocket.send_json({"type": "chunk", "text": chunk_text})

                        # Streaming de audio frase a frase
                        if want_audio:
                            # Si detecta punto, signo de interrogación, exclamación o coma larga
                            if any(punct in sentence_buffer for punct in [".", "!", "?", "…", ";", "\n"]) and len(sentence_buffer.strip()) >= 15:
                                to_synthesize = sentence_buffer.strip()
                                sentence_buffer = ""
                                sentence_index += 1
                                
                                try:
                                    audio_bytes = await audio_engine.synthesize(to_synthesize, mode=active_mode)
                                    if audio_bytes:
                                        audio_b64 = base64.b64encode(audio_bytes).decode("utf-8")
                                        await websocket.send_json({
                                            "type": "audio_sentence",
                                            "sentence_idx": sentence_index,
                                            "text": to_synthesize,
                                            "audio_base64": audio_b64
                                        })
                                except Exception as err:
                                    logger.error(f"Error sintetizando frase {sentence_index}: {err}")

                # Si quedó texto remanente en el buffer al finalizar
                if want_audio and sentence_buffer.strip() and not engine.interrupted:
                    sentence_index += 1
                    try:
                        audio_bytes = await audio_engine.synthesize(sentence_buffer.strip(), mode=active_mode)
                        if audio_bytes:
                            audio_b64 = base64.b64encode(audio_bytes).decode("utf-8")
                            await websocket.send_json({
                                "type": "audio_sentence",
                                "sentence_idx": sentence_index,
                                "text": sentence_buffer.strip(),
                                "audio_base64": audio_b64
                            })
                    except Exception as err:
                        logger.error(f"Error sintetizando frase final: {err}")

                complete_spoken = "".join(full_speech_chunks).strip()

                await websocket.send_json({
                    "type": "end",
                    "thought": thought_str,
                    "full_text": complete_spoken,
                    "mode": active_mode
                })

    except WebSocketDisconnect:
        logger.info("Theatrical WebSocket client disconnected.")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        try:
            await websocket.send_json({"type": "error", "error": str(e)})
        except:
            pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.server:app", host=SERVER_HOST, port=SERVER_PORT, reload=True)
