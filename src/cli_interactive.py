import sys
import os
from src.engine import BorGPTEngine

def main():
    print("=" * 60)
    print("  BorGPT — Terminal de Diálogo Interactivo (Gemini 2.0 Flash)")
    print("=" * 60)
    print("Iniciando motor y verificando Context Caching...")
    
    engine = BorGPTEngine(use_cache=True)
    engine.initialize()
    
    print("\nBorGPT listo. Escribe tu pregunta o réplica teatral.")
    print("Escribe 'salir' o presiona Ctrl+C para terminar.\n")
    
    while True:
        try:
            user_input = input("\n[Tú / Actor]: ").strip()
            if not user_input:
                continue
            if user_input.lower() in ["salir", "exit", "quit"]:
                print("\nBorGPT: Que el olvido nos sea propicio... Hasta luego.")
                break
                
            print("\n[BorGPT]: ", end="", flush=True)
            for chunk in engine.stream_response(user_input):
                print(chunk, end="", flush=True)
            print()
            
        except KeyboardInterrupt:
            print("\n\nSesión interrumpida.")
            break
        except Exception as e:
            print(f"\n[Error]: {e}")

if __name__ == "__main__":
    main()
