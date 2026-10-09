import asyncio
import json
import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.config import SERVER_HOST, SERVER_PORT
from src.engine import BorGPTEngine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("BorGPT-Server")

app = FastAPI(
    title="BorGPT Stage Server",
    description="Backend API and WebSocket streaming server for BorGPT live theatre performance.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = BorGPTEngine(use_cache=True)

class ChatRequest(BaseModel):
    message: str
    temperature: float = 0.7

class ChatResponse(BaseModel):
    reply: str

@app.on_event("startup")
async def startup_event():
    logger.info("Initializing BorGPT Gemini Engine & Cache...")
    # Initialize cache in background thread to avoid blocking startup
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, engine.initialize)
    logger.info("BorGPT ready for theatrical live performance.")

@app.get("/health")
async def health():
    return {
        "status": "online",
        "engine": "Gemini 2.0 Flash",
        "cache_active": engine.use_cache and engine.cached_content_name is not None
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    try:
        reply_chunks = []
        for chunk in engine.stream_response(req.message, temperature=req.temperature):
            reply_chunks.append(chunk)
        return ChatResponse(reply="".join(reply_chunks))
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws/stage")
async def websocket_stage_endpoint(websocket: WebSocket):
    """Realtime WebSocket endpoint for the live operator dashboard, mic STT and visual avatar."""
    await websocket.accept()
    logger.info("Theatrical WebSocket client connected.")
    try:
        while True:
            data_str = await websocket.receive_text()
            data = json.loads(data_str)
            user_msg = data.get("message", "")
            temp = data.get("temperature", 0.7)

            if not user_msg:
                continue

            # Stream response chunk by chunk over WebSocket
            await websocket.send_json({"type": "start", "message": user_msg})
            
            full_response = []
            for chunk in engine.stream_response(user_msg, temperature=temp):
                full_response.append(chunk)
                await websocket.send_json({"type": "chunk", "text": chunk})
            
            await websocket.send_json({
                "type": "end",
                "full_text": "".join(full_response)
            })

    except WebSocketDisconnect:
        logger.info("Theatrical WebSocket client disconnected.")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await websocket.send_json({"type": "error", "error": str(e)})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.server:app", host=SERVER_HOST, port=SERVER_PORT, reload=True)
