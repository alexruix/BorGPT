import logging
from typing import AsyncGenerator, Generator, Optional
from google import genai
from google.genai import types

from src.config import GEMINI_API_KEY, GEMINI_MODEL
from src.cache_manager import CacheManager
from src.prompt_builder import load_system_instruction

logger = logging.getLogger(__name__)

class BorGPTEngine:
    """Core conversational engine for BorGPT powered by Google Gemini 2.0 Flash."""

    def __init__(self, use_cache: bool = True):
        self.client = genai.Client(api_key=GEMINI_API_KEY)
        self.use_cache = use_cache
        self.cache_manager = CacheManager(self.client) if use_cache else None
        self.cached_content_name: Optional[str] = None
        self.history = []

    def initialize(self):
        """Pre-warms the cache and prepares the engine."""
        if self.use_cache:
            try:
                self.cached_content_name = self.cache_manager.create_or_get_cache()
                logger.info(f"BorGPT Engine initialized with cache: {self.cached_content_name}")
            except Exception as e:
                logger.error(f"Error initializing cache: {e}. Falling back to standard mode.")
                self.use_cache = False

    def stream_response(self, user_message: str, temperature: float = 0.7) -> Generator[str, None, None]:
        """Streams text chunks token-by-token for low-latency live TTS."""
        if self.use_cache and self.cached_content_name:
            config = types.GenerateContentConfig(
                cached_content=self.cached_content_name,
                temperature=temperature,
            )
        else:
            config = types.GenerateContentConfig(
                system_instruction=load_system_instruction(),
                temperature=temperature,
            )

        # Append user message to history
        self.history.append({"role": "user", "text": user_message})

        # Generate stream
        response_stream = self.client.models.generate_content_stream(
            model=GEMINI_MODEL,
            contents=user_message,
            config=config,
        )

        full_reply = []
        for chunk in response_stream:
            if chunk.text:
                full_reply.append(chunk.text)
                yield chunk.text

        complete_text = "".join(full_reply)
        self.history.append({"role": "model", "text": complete_text})
