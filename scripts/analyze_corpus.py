import re
import os
import sys

def analyze_corpus(corpus_path):
    with open(corpus_path, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()
    
    print(f"Total characters: {len(text)}")
    print(f"Total lines: {len(text.splitlines())}")

    # List of expected canonical books
    books = [
        "Fervor de Buenos Aires",
        "Luna de enfrente",
        "Cuaderno San Martín",
        "Evaristo Carriego",
        "Discusión",
        "Historia universal de la infamia",
        "Historia de la eternidad",
        "Ficciones",
        "El Aleph",
        "Otras inquisiciones",
        "El hacedor",
        "El otro, el mismo",
        "Para las seis cuerdas",
        "Elogio de la sombra",
        "El informe de Brodie",
        "El oro de los tigres"
    ]

    for book in books:
        # Search case-insensitively
        matches = list(re.finditer(re.escape(book), text, re.IGNORECASE))
        print(f"Book '{book}': found {len(matches)} occurrences")

if __name__ == "__main__":
    corpus_file = os.path.join("data", "corpus", "obras_completas_1923_1972.md")
    analyze_corpus(corpus_file)
