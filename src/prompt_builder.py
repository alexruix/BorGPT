from pathlib import Path
from src.config import PROMPT_FILE

def load_system_instruction() -> str:
    """Loads the organic personality and behavioral guidelines for BorGPT."""
    if not PROMPT_FILE.exists():
        return (
            "Eres BorGPT, la entidad interactiva que fusiona la viva voz de Jorge Luis Borges "
            "con la omnisciencia y rapidez de una inteligencia artificial. "
            "Habla con ironía sutil, cortesía aristocrática y sobriedad, evitando caricaturas forzadas."
        )
    
    with open(PROMPT_FILE, "r", encoding="utf-8") as f:
        content = f.read()
        
    return content
