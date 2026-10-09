import json
import sys
from pathlib import Path

def validate_ssot():
    ssot_path = Path(__file__).resolve().parent.parent / "data" / "theatre_script_ssot.json"
    if not ssot_path.exists():
        print(f"Error: No se encontró {ssot_path}")
        sys.exit(1)

    with open(ssot_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Validar secciones clave
    required_keys = ["version", "project", "designTokens", "phases", "scriptCues", "systemMessages", "fallbackResponses"]
    for k in required_keys:
        if k not in data:
            print(f"Error: Clave obligatoria faltante en SSOT: '{k}'")
            sys.exit(1)

    # Validar fases
    phases = data.get("phases", [])
    if len(phases) != 4:
        print(f"Warning: Se esperaban 4 fases dramáticas, encontradas {len(phases)}")

    for p in phases:
        for field in ["id", "title", "directive", "temperature", "maxOutputTokens", "voice"]:
            if field not in p:
                print(f"Error: Fase '{p.get('id')}' carece del campo '{field}'")
                sys.exit(1)

    # Validar pies
    cues = data.get("scriptCues", [])
    if not cues:
        print("Error: No hay pies de guion definidos en scriptCues")
        sys.exit(1)

    print(f"[OK] SSOT validado exitosamente: {len(phases)} fases, {len(cues)} pies, {len(data['fallbackResponses'])} categorias de contingencia.")

if __name__ == "__main__":
    validate_ssot()

