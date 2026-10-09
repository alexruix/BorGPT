import re
from pathlib import Path

def optimize_bioy_corpus(input_path: str, output_path: str):
    """
    Optimiza el archivo de diarios de Bioy Casares para maximizar la recuperación de Gemini RAG:
    1. Remueve marcas de OCR y etiquetas rotas (<!-- Página X -->, ePub tags, etc.).
    2. Convierte las fechas de las entradas ('Lunes, 12 de enero', '1947', etc.) en encabezados Markdown de nivel 2 y 3.
    3. Resuelve cortes de palabras y saltos de línea irregulares en nombres de autores.
    4. Enfatiza los diálogos de Borges para que el modelo identifique de inmediato sus juicios estéticos íntimos.
    """
    in_file = Path(input_path)
    out_file = Path(output_path)

    if not in_file.exists():
        print(f"No existe el archivo {in_file}")
        return

    print(f"Optimizando {in_file.name} para Gemini RAG...")

    with open(in_file, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Eliminar páginas <!-- Página X -->
    content = re.sub(r'<!--\s*Página\s*\d+\s*-->', '', content)

    # 2. Corregir nombres descompuestos por OCR (ej: B\nORGES\n, S\nILVINA\n, etc.)
    content = re.sub(r'\bB\s*\n\s*ORGES\b', 'BORGES', content)
    content = re.sub(r'\bB\s*\n\s*IOY\b', 'BIOY', content)
    content = re.sub(r'\bS\s*\n\s*ILVINA\b', 'SILVINA', content)
    content = re.sub(r'\bO\s*\n\s*CAMPO\b', 'OCAMPO', content)

    # 3. Limpiar referencias de notas huérfanas [1], [2], etc. para evitar ruidos de tokens
    content = re.sub(r'\[\d+\]', '', content)

    # 4. Formatear años en encabezados ## Año (ej: "1931-1946", "1947", "1948", etc.)
    content = re.sub(r'\n\s*(\b19\d\d(?:-19\d\d)?\b)\s*\n', r'\n\n## Diarios del año \1\n\n', content)

    # 5. Formatear días de diario como subtítulos ### Día, Fecha (ej: "Lunes, 12 de enero.")
    dias_semana = r'(?:Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo|Enero|Febrero|Marzo|Abril|Mayo|Junio|Julio|Agosto|Septiembre|Octubre|Noviembre|Diciembre)'
    content = re.sub(
        rf'\n\s*({dias_semana}[^.\n]+?\.)\s*',
        r'\n\n### \1\n\n',
        content
    )

    # 6. Normalizar saltos de línea y espaciados
    content = re.sub(r'\n{3,}', '\n\n', content)
    content = re.sub(r'[ \t]+', ' ', content)

    # Header inicial
    header = """---
title: "Borges (Diarios 1931-1989)"
author: "Adolfo Bioy Casares / Edición Daniel Martino"
genre: "Diarios íntimos, conversaciones y crítica literaria"
summary: "El testimonio definitivo de la amistad entre Jorge Luis Borges y Adolfo Bioy Casares. Contiene medio siglo de cenas cotidianas, ironías sobre escritores contemporáneos, reflexiones literarias privadas, anécdotas con Silvina Ocampo y la voz íntima y desinhibida de Borges."
---

# Borges - Adolfo Bioy Casares (Diarios 1931-1989)

"""

    final_text = header + content.strip()

    with open(out_file, "w", encoding="utf-8") as f:
        f.write(final_text)

    print(f" Optimización completada!")
    print(f"Nuevo tamaño: {out_file.stat().st_size / (1024*1024):.2f} MB")
    print(f"Líneas: {len(final_text.splitlines())}")

if __name__ == "__main__":
    optimize_bioy_corpus(
        "data/corpus/borges_bioy/borges_bioy_completo.md",
        "data/corpus/borges_bioy/borges_bioy_optimizado.md"
    )
