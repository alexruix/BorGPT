import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# Gemini API configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
CACHE_TTL_HOURS = int(os.getenv("CACHE_TTL_HOURS", "24"))

# Corpus & Documentation Paths
CORPUS_FILE = BASE_DIR / "data" / "corpus" / "obras_completas_1923_1972.md"
PROMPT_FILE = BASE_DIR / "docs" / "project" / "reglas_personalidad_y_prompt.md"
INTERVIEWS_DIR = BASE_DIR / "docs" / "entrevistas"
THEATRE_PLAY_FILE = BASE_DIR / "docs" / "project" / "obra_teatro.md"

# Server configuration
SERVER_HOST = os.getenv("SERVER_HOST", "0.0.0.0")
SERVER_PORT = int(os.getenv("SERVER_PORT", "8000"))
