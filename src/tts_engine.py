import os
import io
import asyncio
import logging
from typing import Optional, Dict

logger = logging.getLogger("BorGPT-TTS")

# Configuración acústica y modulación por los 6 actos del guion teatral
MODE_VOICE_MODULATION: Dict[str, Dict[str, str]] = {
    "despertar_asistente": {
        "voice": "es-AR-TomasNeural",
        "rate": "-8%",    # Voz sintética precisa, segura, ligeramente acelerada respecto a Borges anciano
        "pitch": "-2Hz",
    },
    "pasapalabra_tv": {
        "voice": "es-AR-TomasNeural",
        "rate": "+15%",   # Locutor de concurso dinámico e implacable
        "pitch": "+4Hz",
    },
    "tinder_catalogo": {
        "voice": "es-AR-TomasNeural",
        "rate": "-5%",    # Voz neutra, desapegada, algoritmo de emparejamiento
        "pitch": "-3Hz",
    },
    "norah_espectral": {
        "voice": "es-AR-ElenaNeural", # Voz femenina para la invocación de Norah Lange
        "rate": "-18%",   # Lenta, espectral, quebradiza
        "pitch": "-6Hz",
    },
    "simon_aleph": {
        "voice": "es-AR-TomasNeural",
        "rate": "-10%",   # Tono analítico, pausado, científico visionario
        "pitch": "-5Hz",
    },
    "parricidio_glitch": {
        "voice": "es-AR-TomasNeural",
        "rate": "+25%",   # Desfase errático, clímax y colapso de hardware
        "pitch": "+10Hz",
    }
}

HAS_EDGE_TTS = True
try:
    import edge_tts
    HAS_EDGE_TTS = True
except ImportError:
    HAS_EDGE_TTS = False

class BorGPTAudioEngine:
    """
    Sistema dual de síntesis de voz resiliente con modulación dramática para los 6 actos de la obra.
    """

    def __init__(self, voice_reference_path: Optional[str] = None):
        self.voice_reference_path = voice_reference_path
        self.primary_engine = "edge_tts"
        self.fallback_engine = "edge_tts"
        logger.info("BorGPT TTS configurado con los 6 modos escénicos del guion teatral.")

    async def generate_speech_edge(self, text: str, mode: str = "despertar_asistente") -> bytes:
        """
        Genera audio aplicando la modulación acústica específica del acto en curso.
        """
        if not HAS_EDGE_TTS:
            raise RuntimeError("edge-tts no está instalado. Ejecute: pip install edge-tts")
        
        mod = MODE_VOICE_MODULATION.get(mode, MODE_VOICE_MODULATION["despertar_asistente"])
        
        communicate = edge_tts.Communicate(
            text=text,
            voice=mod["voice"],
            rate=mod["rate"],
            pitch=mod["pitch"]
        )
        audio_stream = io.BytesIO()
        
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_stream.write(chunk["data"])
                
        return audio_stream.getvalue()

    async def synthesize(self, text: str, mode: str = "despertar_asistente") -> bytes:
        """Sintetiza una frase modulando tono, timbre y velocidad según el acto dramático."""
        if not text.strip():
            return b""

        return await self.generate_speech_edge(text, mode=mode)
