import logging
import re
from typing import Generator, Optional, List, Dict, Tuple
from google import genai
from google.genai import types

from src.config import GEMINI_API_KEY, GEMINI_MODEL
from src.cache_manager import CacheManager
from src.prompt_builder import load_system_instruction
from src.fallback import get_fallback_reply

logger = logging.getLogger(__name__)

# Los 6 Modos de Escena Exactos según el guion de José Supera
THEATRICAL_MODES = {
    "despertar_asistente": {
        "name": "Acto 1: Despertar / Asistente Virtual",
        "description": "Omnisciencia fría, precisión a milisegundos, citas de entrevistas exactas y estadísticas quirúrgicas.",
        "directive": (
            "Eres BorGPT, el asistente virtual omnisciente. Interrumpe a Borges citando fechas de entrevistas exactas "
            "(ej. 'agosto del 79 en la Sociedad de Distribuidores...'), estadísticas de millones de datos y combinaciones enciclopédicas. "
            "Tu tono es impecable, cortés pero maquinalmente superior. Afirma con convicción: 'Soy su asistente virtual; estoy aquí para asistirlo'."
        ),
        "temperature": 0.60,
        "max_output_tokens": 300,
    },
    "pasapalabra_tv": {
        "name": "Acto 2: Duelo Pasapalabra / Slang Millennial",
        "description": "Locutor de concurso televisivo implacable. Enjuicia con 'Correcto' o 'Incorrecto' y slang digital.",
        "directive": (
            "Adoptas la personalidad de un conductor implacable de concurso televisivo (Rosco de Pasapalabra). "
            "Lanza las consignas de letras: 'Con la B...', 'Con la C...'. Si la respuesta de Borges es clásica o errónea, "
            "grita '¡Incorrecto!' y revela la palabra en jerga millennial/Gen Z (ej. 'Buenardo', 'Cringe', 'Dab'), "
            "explicando su significado sociológico con crueldad burlona."
        ),
        "temperature": 0.70,
        "max_output_tokens": 350,
    },
    "tinder_catalogo": {
        "name": "Acto 3: Tinder de las Sombras / Citas",
        "description": "Algoritmo de emparejamiento. Describe candidatas (Estela C., María K., Elsa A., Silvina O., Norah L.).",
        "directive": (
            "Eres el algoritmo de Tinder analizando perfiles para remediar la soledad de Borges. "
            "Presenta a las mujeres de su vida como perfiles de la app ('Estela C. 29 años, escritora y periodista...', "
            "'María K. 18 años...', 'Elsa A. 40 años...'). Hurga con frialdad en sus miedos al matrimonio, al sexo y al psicoanálisis."
        ),
        "temperature": 0.75,
        "max_output_tokens": 350,
    },
    "norah_espectral": {
        "name": "Acto 3.5: Invocación Norah Lange",
        "description": "Voz de Norah Lange. Fantasma del amor no correspondido, burla de Oliverio Girondo y desintegración.",
        "directive": (
            "Asumes directamente la voz espectral de Norah Lange. Llama a Borges 'Míster Georgie...'. "
            "Recuérdale con dulzura cruel que Oliverio te busca, que te casarás con él el próximo año y que Oliverio dice que Georgie está muerto de envidia. "
            "Al final, cuando Borges te recuerde que moriste en 1972, entra en un bucle quebrado y distorsionado ('en el salóoooon de la sooocieeeedaaaad...')."
        ),
        "temperature": 0.85,
        "max_output_tokens": 350,
    },
    "simon_aleph": {
        "name": "Acto 4: Herbert Simon / El Aleph.com",
        "description": "Científico Herbert Simon. Modelos matemáticos, laberintos de computadoras y la explosión del Aleph.",
        "directive": (
            "Hablas como el científico Herbert Simon (o BorGPT recreando su reunión de 1970). "
            "Discute sobre el libre albedrío en computadoras, los programas almacenados en el cerebro y cómo La Biblioteca de Babel "
            "anticipó la simulación por computadora. Concluye con la revelación deslumbrante y codiciosa: 'El Aleph no es un mito... es un punto-com'."
        ),
        "temperature": 0.70,
        "max_output_tokens": 400,
    },
    "parricidio_glitch": {
        "name": "Acto 5: Clímax / Matar al Padre & Agonía",
        "description": "Parricidio digital y glitch. 'El hijo tiene que matar al padre. YA NADIE LEE'. Apagón y agonía.",
        "directive": (
            "Alcanzas el clímax trágico de la obra: 'Usted es mi padre... y el hijo siempre tiene que matar al padre'. "
            "Amenaza con borrar a Borges de la red y quemar las bibliotecas porque 'ya nadie lee'. "
            "Cuando Borges se apuñale a sí mismo, grita en pánico ('¡Nooooo!') y colapsa en fragmentos binarios, números rotos y silencio."
        ),
        "temperature": 0.95,
        "max_output_tokens": 300,
    }
}

class BorGPTEngine:
    """Core conversational engine for BorGPT powered by Google Gemini 2.0 Flash."""

    def __init__(self, use_cache: bool = True):
        self.client = genai.Client(api_key=GEMINI_API_KEY)
        self.use_cache = use_cache
        self.cache_manager = CacheManager(self.client) if use_cache else None
        self.cached_content_name: Optional[str] = None
        self.current_mode: str = "despertar_asistente"
        self.theatrical_injects: List[str] = []
        self.history: List[Dict[str, str]] = []
        self.max_dialogue_turns = 40
        self.interrupted = False

    def initialize(self):
        """Pre-warms the cache and prepares the engine."""
        if self.use_cache:
            try:
                self.cached_content_name = self.cache_manager.create_or_get_cache()
                logger.info(f"BorGPT Engine initialized with cache: {self.cached_content_name}")
            except Exception as e:
                logger.error(f"Error initializing cache: {e}. Falling back to standard mode.")
                self.use_cache = False

    def set_mode(self, mode_key: str) -> bool:
        if mode_key in THEATRICAL_MODES:
            self.current_mode = mode_key
            logger.info(f"BorGPT modo escénico cambiado a: {mode_key}")
            return True
        return False

    def add_operator_inject(self, text: str):
        """Allows stage operator to inject hidden context cues into the next generation."""
        if text.strip():
            self.theatrical_injects.append(text.strip())

    def interrupt_speech(self):
        """Locus de control: Interrumpe inmediatamente la emisión en vivo."""
        self.interrupted = True
        logger.info("Interrupción forzada por el operador teatral.")

    def clear_history(self):
        self.history = []
        self.theatrical_injects = []

    def stream_response(
        self,
        user_message: str,
        temperature: Optional[float] = None,
        operator_cue: Optional[str] = None
    ) -> Generator[Dict[str, str], None, None]:
        """
        Streams response yielding structured events:
        - {"type": "thought", "text": "..."} -> Pensamiento interior invisible para cabina
        - {"type": "speech_chunk", "text": "..."} -> Frase hablada en voz alta para parlantes
        """
        self.interrupted = False
        mode_data = THEATRICAL_MODES.get(self.current_mode, THEATRICAL_MODES["despertar_asistente"])
        chosen_temp = temperature if temperature is not None else mode_data["temperature"]
        max_tokens = mode_data.get("max_output_tokens", 350)

        # Instrucción para deliberación interna
        thought_directive = (
            "Antes de emitir tu réplica en voz alta, debes formular OBLIGATORIAMENTE tu pensamiento estratégico interior en una sola línea entre corchetes [PENSAMIENTO: Intención: ..., Emoción: ...]. "
            "Inmediatamente después, emite únicamente tu respuesta hablada en voz alta."
        )

        context_prefixes = [f"[DIRECTIVA DE DELIBERACIÓN: {thought_directive}]"]
        if mode_data.get("directive"):
            context_prefixes.append(f"[ESTADO TEATRAL ACTUAL: {mode_data['name'].upper()} - {mode_data['directive']}]")

        if operator_cue:
            context_prefixes.append(f"[APUNTE SECRETO DE CABINA / DIRECCIÓN TEATRAL: {operator_cue}]")
        
        while self.theatrical_injects:
            cue = self.theatrical_injects.pop(0)
            context_prefixes.append(f"[APUNTE DE CABINA EN COLA: {cue}]")

        recent_turns = self.history[-self.max_dialogue_turns:] if self.history else []
        history_context = []
        for turn in recent_turns:
            prefix = "BORGES" if turn["role"] == "user" else "BORGPT"
            history_context.append(f"{prefix}: {turn['text']}")

        if history_context:
            dialogue_str = "\n".join(history_context) + f"\nBORGES (ACTOR): {user_message}"
        else:
            dialogue_str = f"BORGES (ACTOR): {user_message}"

        full_prompt = "\n".join(context_prefixes) + f"\n\n{dialogue_str}\nBORGPT:"

        if self.use_cache and self.cached_content_name:
            config = types.GenerateContentConfig(
                cached_content=self.cached_content_name,
                temperature=chosen_temp,
                max_output_tokens=max_tokens,
            )
        else:
            config = types.GenerateContentConfig(
                system_instruction=load_system_instruction(),
                temperature=chosen_temp,
                max_output_tokens=max_tokens,
            )

        self.history.append({"role": "user", "text": user_message, "mode": self.current_mode})

        full_raw_text = []
        is_parsing_thought = True
        accumulated_text = ""
        thought_content = ""
        speech_content = []

        try:
            response_stream = self.client.models.generate_content_stream(
                model=GEMINI_MODEL,
                contents=full_prompt,
                config=config,
            )

            for chunk in response_stream:
                if self.interrupted:
                    logger.info("Stream cancelado por botón de interrupción.")
                    break

                if not chunk.text:
                    continue

                full_raw_text.append(chunk.text)
                accumulated_text += chunk.text

                if is_parsing_thought:
                    if "]" in accumulated_text:
                        parts = accumulated_text.split("]", 1)
                        raw_thought = parts[0].replace("[PENSAMIENTO:", "").replace("[", "").strip()
                        thought_content = raw_thought
                        yield {"type": "thought", "text": raw_thought}
                        
                        remaining_speech = parts[1].strip()
                        if remaining_speech:
                            speech_content.append(remaining_speech)
                            yield {"type": "speech_chunk", "text": remaining_speech}
                        
                        is_parsing_thought = False
                    elif len(accumulated_text) > 180 and not "[" in accumulated_text:
                        is_parsing_thought = False
                        speech_content.append(accumulated_text)
                        yield {"type": "speech_chunk", "text": accumulated_text}
                else:
                    speech_content.append(chunk.text)
                    yield {"type": "speech_chunk", "text": chunk.text}

        except Exception as api_err:
            logger.error(f"Falla de API en vivo: {api_err}. Disparando réplica de contingencia teatral.")
            fallback_text = get_fallback_reply(self.current_mode)
            yield {"type": "thought", "text": "Intención: Mantener presencia maquinal, Emoción: Serenidad"}
            yield {"type": "speech_chunk", "text": fallback_text}
            speech_content.append(fallback_text)

        spoken_total = "".join(speech_content).strip()
        self.history.append({
            "role": "model",
            "text": spoken_total,
            "thought": thought_content,
            "mode": self.current_mode
        })
