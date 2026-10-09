import logging
from pathlib import Path
from typing import Optional
from google import genai
from google.genai import types

from src.config import (
    GEMINI_API_KEY,
    GEMINI_MODEL,
    CORPUS_FILE,
    INTERVIEWS_DIR,
    CACHE_TTL_HOURS
)
from src.prompt_builder import load_system_instruction

logger = logging.getLogger(__name__)

class CacheManager:
    """Manages creation, retrieval and lifecycle of Gemini Context Caching for the Borgean corpus."""

    def __init__(self, client: Optional[genai.Client] = None):
        self.client = client or genai.Client(api_key=GEMINI_API_KEY)
        self._cached_content_name: Optional[str] = None

    def create_or_get_cache(self, display_name: str = "borgpt-corpus-cache") -> str:
        """Uploads corpus and creates a persistent Context Cache in Gemini."""
        if self._cached_content_name:
            try:
                cached = self.client.caches.get(name=self._cached_content_name)
                logger.info(f"Using existing cached content: {cached.name}")
                return cached.name
            except Exception:
                logger.warning("Existing cache invalidated. Recreating...")

        # 1. Upload the canonical corpus
        if not CORPUS_FILE.exists():
            raise FileNotFoundError(f"Corpus file not found at: {CORPUS_FILE}")

        logger.info(f"Uploading corpus to Gemini Files API: {CORPUS_FILE}")
        uploaded_corpus = self.client.files.upload(
            file=str(CORPUS_FILE),
            config=types.UploadFileConfig(
                display_name="Borges Obras Completas (1923-1972)",
                mime_type="text/plain"
            )
        )

        system_instruction = load_system_instruction()
        ttl_seconds = f"{CACHE_TTL_HOURS * 3600}s"

        logger.info(f"Creating Context Cache (TTL: {ttl_seconds})...")
        cached_content = self.client.caches.create(
            model=GEMINI_MODEL,
            config=types.CreateCachedContentConfig(
                contents=[uploaded_corpus],
                system_instruction=system_instruction,
                display_name=display_name,
                ttl=ttl_seconds,
            )
        )

        self._cached_content_name = cached_content.name
        logger.info(f"Context Cache created successfully: {self._cached_content_name}")
        return self._cached_content_name
