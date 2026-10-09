import hashlib
import logging
from pathlib import Path
from typing import Optional, List
from google import genai
from google.genai import types

from src.config import (
    GEMINI_API_KEY,
    GEMINI_MODEL,
    CORPUS_FILE,
    DOCS_DIR,
    CACHE_TTL_HOURS
)
from src.prompt_builder import load_system_instruction

logger = logging.getLogger(__name__)

class CacheManager:
    """Manages creation, retrieval, checksum verification and lifecycle of Gemini Context Caching."""

    def __init__(self, client: Optional[genai.Client] = None):
        self.client = client or genai.Client(api_key=GEMINI_API_KEY)
        self._cached_content_name: Optional[str] = None

    def _compute_checksum(self, file_path: Path) -> str:
        """Computes MD5 checksum to detect if local files changed before rebuilding cache."""
        hasher = hashlib.md5()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(65536), b""):
                hasher.update(chunk)
        return hasher.hexdigest()

    def build_unified_corpus(self, output_path: Path = Path("data/corpus/corpus_maestro_unificado.md")) -> Path:
        """
        Combina y estructura automáticamente:
        1. Obras completas canónicas (1923-1972)
        2. Los diarios monumentales 'Borges' de Adolfo Bioy Casares (1931-1989) optimizados
        3. Todas las entrevistas transcritas (RTVE, Carrizo, México, etc.)
        4. Obras canónicas post-1972 (Siete Noches, El libro de arena, etc.)
        5. Fobias, aversiones, biografías de Norah Lange y perfiles de personajes
        """
        output_path.parent.mkdir(parents=True, exist_ok=True)
        logger.info(f"Construyendo corpus maestro unificado en: {output_path}")

        with open(output_path, "w", encoding="utf-8") as f_out:
            f_out.write("# Corpus Maestro Unificado de Conocimiento y Diálogos de BorGPT\n\n")

            # 1. Obras canónicas maestras
            if CORPUS_FILE.exists():
                logger.info(f"Integrando Obras Completas canónicas ({CORPUS_FILE.name})...")
                f_out.write("\n\n<!-- ==================== SECCIÓN: OBRAS COMPLETAS (1923-1972) ==================== -->\n\n")
                with open(CORPUS_FILE, "r", encoding="utf-8") as f:
                    f_out.write(f.read())

            # 2. Diarios de Bioy Casares (Versión estructurada y cronológica)
            bioy_path = Path("data/corpus/borges_bioy/borges_bioy_optimizado.md")
            if bioy_path.exists():
                logger.info(f"Integrando Diarios 'Borges' de Bioy Casares ({bioy_path.name})...")
                f_out.write("\n\n<!-- ==================== SECCIÓN: DIARIOS BORGES - BIOY CASARES (1931-1989) ==================== -->\n\n")
                with open(bioy_path, "r", encoding="utf-8") as f:
                    f_out.write(f.read())

            # 3. Todo el directorio docs/ (Entrevistas, Fobias, Norah Lange, Citas, Libros Canónicos)
            docs_dir = DOCS_DIR if DOCS_DIR.exists() else Path("docs")
            if docs_dir.exists():
                for md_file in sorted(docs_dir.rglob("*.md")):
                    # Excluir sólo el prompt de directivas que ya va en system_instruction
                    if "reglas_personalidad_y_prompt.md" in md_file.name:
                        continue
                    
                    logger.info(f"Integrando documento de conocimiento: {md_file.relative_to(docs_dir)}")
                    f_out.write(f"\n\n<!-- ==================== DOCUMENTO: {md_file.name} ==================== -->\n\n")
                    try:
                        with open(md_file, "r", encoding="utf-8") as f:
                            f_out.write(f.read())
                    except Exception as e:
                        logger.warning(f"No se pudo leer {md_file}: {e}")

        logger.info(f"Corpus Maestro Unificado generado con éxito ({output_path.stat().st_size / (1024*1024):.2f} MB).")
        return output_path

    def create_or_get_cache(self, display_name: str = "borgpt-unified-corpus-cache") -> str:
        """
        Busca un caché existente activo en la nube de Google Gemini antes de crear uno nuevo,
        ahorrando costos de upload y garantizando latencia cero al iniciar el servidor.
        """
        try:
            # 1. Inspeccionar si ya existe un caché activo con el mismo display_name
            for c in self.client.caches.list():
                if c.display_name == display_name:
                    logger.info(f"Caché activo reutilizado en Gemini Cloud: {c.name} (Expira: {c.expire_time})")
                    self._cached_content_name = c.name
                    return self._cached_content_name
        except Exception as e:
            logger.warning(f"No se pudo listar los cachés existentes: {e}")

        # 2. Si no existe, compilar el archivo maestro y subirlo
        unified_file = self.build_unified_corpus()

        logger.info(f"Subiendo corpus unificado a Gemini Files API: {unified_file}")
        uploaded_corpus = self.client.files.upload(
            file=str(unified_file),
            config=types.UploadFileConfig(
                display_name="BorGPT Master Unified Corpus (Obras + Bioy + Entrevistas + Docs)",
                mime_type="text/plain"
            )
        )

        system_instruction = load_system_instruction()
        ttl_seconds = f"{CACHE_TTL_HOURS * 3600}s"

        logger.info(f"Creando nuevo Context Cache en Gemini 2.0 Flash (TTL: {ttl_seconds})...")
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
        logger.info(f"Context Cache creado exitosamente: {self._cached_content_name}")
        return self._cached_content_name
