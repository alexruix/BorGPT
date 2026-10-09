#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para segmentar, depurar y estructurar el corpus monolítico de Obras Completas
de Jorge Luis Borges en módulos canónicos optimizados para RAG (BorGPT).
"""

import os
import re
import unicodedata

def clean_ocr_noise(text: str) -> str:
    """Limpia números de página aislados, encabezados de cornisa repetitivos y artefactos de OCR."""
    lines = text.splitlines()
    cleaned_lines = []
    
    # Patrones de cornisa repetitiva
    header_patterns = [
        re.compile(r'^\s*JORGE\s+LUIS\s+BORGES[\s—\-_–]*OBRAS\s+COMPLETAS\s*$', re.IGNORECASE),
        re.compile(r'^\s*(FERVOR DE BUENOS AIRES|LUNA DE ENFRENTE|CUADERNO SAN MART[IÍ]N|EVARISTO CARRIEGO|DISCUSI[OÓ]N|HISTORIA UNIVERSAL DE LA INFAMIA|HISTORIA DE LA ETERNIDAD|FICCIONES|EL ALEPH|OTRAS INQUISICIONES|EL HACEDOR|EL OTRO,?\s+EL MISMO|PARA LAS SEIS CUERDAS|ELOGIO DE LA SOMBRA|EL INFORME DE BRODIE|EL ORO DE LOS TIGRES)\s*$', re.IGNORECASE),
        re.compile(r'^\s*<!--.*?-->\s*$'),
        re.compile(r'^\s*[\*_~]*\s*(\d{1,4}|[ivxlcdm]+)\s*[\*_~]*\s*$', re.IGNORECASE), # Números de página aislados
        re.compile(r'^\s*[\(\[]\s*(\d{1,4}|!|\?)\s*[\)\]]\s*$')
    ]
    
    for line in lines:
        stripped = line.strip()
        
        # Omitir líneas vacías consecutivas en exceso
        if not stripped:
            if cleaned_lines and cleaned_lines[-1] != "":
                cleaned_lines.append("")
            continue
            
        # Comprobar si coincide con algún patrón de ruido de cornisa
        is_noise = False
        for pattern in header_patterns:
            if pattern.match(stripped):
                is_noise = True
                break
                
        if not is_noise:
            cleaned_lines.append(line)
            
    return "\n".join(cleaned_lines).strip()

def normalize_title(title: str) -> str:
    """Convierte un título a sentence case."""
    words = title.strip().split()
    if not words:
        return ""
    # Capitalizar primera palabra, dejar en minúsculas el resto excepto nombres propios
    first = words[0].capitalize()
    rest = []
    proper_nouns = {"Buenos", "Aires", "San", "Martín", "Carriego", "Evaristo", "Aleph", "Brodie", "Borges", "Groddeck", "Spencer", "Shakespeare", "Dante", "Quevedo", "Schopenhauer"}
    for w in words[1:]:
        clean_w = re.sub(r'[^\w]', '', w)
        if clean_w in proper_nouns:
            rest.append(w.capitalize())
        else:
            rest.append(w.lower())
    return " ".join([first] + rest)

def split_corpus(corpus_path: str, output_dir: str):
    """Segmenta las Obras Completas en libros canónicos individuales."""
    with open(corpus_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    # Definición canónica de los 16 libros con sus años y géneros
    canonical_books = [
        {
            "id": "fervor_de_buenos_aires",
            "search_pattern": r'(?:^|\n)(?:#{1,6}\s*)?Fervor de Buenos Aires\s*\((?:1923|1969)\)',
            "title": "Fervor de Buenos Aires",
            "year": 1923,
            "genre": "Poesía / Vanguardia / Ultraísmo",
            "summary": "Primer poemario de Jorge Luis Borges. Canta a las calles del arrabal porteño, los patios, el poniente, la Recoleta y la serenidad de una ciudad íntima y mitológica."
        },
        {
            "id": "luna_de_enfrente",
            "search_pattern": r'(?:^|\n)(?:#{1,6}\s*)?Luna de enfrente\s*\((?:1925|1969)\)',
            "title": "Luna de enfrente",
            "year": 1925,
            "genre": "Poesía",
            "summary": "Segundo poemario borgeano centrado en la pampa, el arrabal, el amor juvenil y la mitología criolla rioplatense."
        },
        {
            "id": "cuaderno_san_martin",
            "search_pattern": r'(?:^|\n)(?:#{1,6}\s*)?Cuaderno San Mart[íi]n\s*\((?:1929|1969)\)',
            "title": "Cuaderno San Martín",
            "year": 1929,
            "genre": "Poesía",
            "summary": "Poemario financiado con el Segundo Premio Municipal; incluye textos emblemáticos como la Fundación mítica de Buenos Aires y El paseo de Julio."
        },
        {
            "id": "evaristo_carriego",
            "search_pattern": r'(?:^|\n)(?:#{1,6}\s*)?Evaristo Carriego\s*\((?:1930|1955)\)',
            "title": "Evaristo Carriego",
            "year": 1930,
            "genre": "Ensayo biográfico / Mitología porteña",
            "summary": "Biografía lírica e indagación sobre el poeta de Palermo, los guapos, el tango, el truco y las esquinas porteñas."
        },
        {
            "id": "discusion",
            "search_pattern": r'(?:^|\n)(?:#{1,6}\s*)?Discusi[oó]n\s*\((?:1932|1957)\)',
            "title": "Discusión",
            "year": 1932,
            "genre": "Ensayos críticos y filosóficos",
            "summary": "Colección de ensayos fundamentales: El escritor argentino y la tradición, Una vindicación de la cábala, Las perpetuas carreras de Aquiles y la tortuga y La poesía gnóstica."
        },
        {
            "id": "historia_universal_de_la_infamia",
            "search_pattern": r'(?:^|\n)(?:#{1,6}\s*)?Historia universal de la infamia\s*\((?:1935|1954)\)',
            "title": "Historia universal de la infamia",
            "year": 1935,
            "genre": "Cuentos / Biografías apócrifas",
            "summary": "Primer libro de relatos de ficción borgeanos: biografías barrocas de impostores y piratas (Billy the Kid, Lazarus Morell, Monk Eastman) y Hombre de la esquina rosada."
        },
        {
            "id": "historia_de_la_eternidad",
            "search_pattern": r'(?:^|\n)(?:#{1,6}\s*)?Historia de la eternidad\s*\((?:1936|1953)\)',
            "title": "Historia de la eternidad",
            "year": 1936,
            "genre": "Ensayos metafísicos",
            "summary": "Meditaciones sobre el tiempo, Platón, Plotino, las aporías del infinito, La doctrina de los ciclos y la traducción de Las 1001 Noches."
        },
        {
            "id": "ficciones",
            "search_pattern": r'(?:^|\n)(?:#{1,6}\s*)?Ficciones\s*\((?:1944|1956)\)',
            "title": "Ficciones",
            "year": 1944,
            "genre": "Cuentos fantásticos y metafísicos",
            "summary": "Obra cumbre de la narrativa del siglo XX. Incluye El jardín de senderos que se bifurcan y Artificios: Tlön, Las ruinas circulares, La lotería en Babilonia, La biblioteca de Babel, Funes el memorioso, El Sur."
        },
        {
            "id": "el_aleph",
            "search_pattern": r'(?:^|\n)(?:#{1,6}\s*)?El Aleph\s*\((?:1949|1952)\)',
            "title": "El Aleph",
            "year": 1949,
            "genre": "Cuentos fantásticos",
            "summary": "Colección magistral de relatos: El inmortal, El muerto, Los teólogos, La casa de Asterión, La otra muerte, Emma Zunz, Deutsches Requiem, La busca de Averroes, El Zahir y El Aleph."
        },
        {
            "id": "otras_inquisiciones",
            "search_pattern": r'(?:^|\n)(?:#{1,6}\s*)?Otras inquisiciones\s*\((?:1952|1960)\)',
            "title": "Otras inquisiciones",
            "year": 1952,
            "genre": "Ensayos filosóficos y literarios",
            "summary": "Ensayos cumbres sobre Quevedo, Coleridge, Pascal, Kafka y sus precursores, El pudor de la historia, El tiempo y Nueva refutación del tiempo."
        },
        {
            "id": "el_hacedor",
            "search_pattern": r'(?:^|\n)(?:#{1,6}\s*)?El hacedor\s*\((?:1960)\)',
            "title": "El hacedor",
            "year": 1960,
            "genre": "Prosas breves y poemas",
            "summary": "Textos esenciales de madurez: Borges y yo, Dreamtigers, Poema de los dones, El testigo, Diálogo de muertos, Alusión a la muerte del coronel Francisco Borges."
        },
        {
            "id": "el_otro_el_mismo",
            "search_pattern": r'(?:^|\n)(?:#{1,6}\s*)?El otro,?\s+el mismo\s*\((?:1964|1969)\)',
            "title": "El otro, el mismo",
            "year": 1964,
            "genre": "Poesía",
            "summary": "Poemario capital que incluye Poema de los dones, El Golem, Arte poética, Límites, Junín, Emanuel Swedenborg y sonetos a Spinoza."
        },
        {
            "id": "para_las_seis_cuerdas",
            "search_pattern": r'(?:^|\n)(?:#{1,6}\s*)?Para las seis cuerdas\s*\((?:1965|1970)\)',
            "title": "Para las seis cuerdas",
            "year": 1965,
            "genre": "Milongas y poemas criollos",
            "summary": "Milongas compuestas para guitarras sobre compadritos, cuchilleros y el coraje orillero: Milonga de Jacinto Chiclana, Milonga de don Nicanor Paredes, etc."
        },
        {
            "id": "elogio_de_la_sombra",
            "search_pattern": r'(?:^|\n)(?:#{1,6}\s*)?Elogio de la sombra\s*\((?:1969)\)',
            "title": "Elogio de la sombra",
            "year": 1969,
            "genre": "Poesía y prosa poética",
            "summary": "Poemario de la ceguera y la serenidad: Elogio de la sombra, Fragmentos de un evangelio apócrifo, Cambridge, Heráclito y Etnografía."
        },
        {
            "id": "el_informe_de_brodie",
            "search_pattern": r'(?:^|\n)(?:#{1,6}\s*)?El informe de Brodie\s*\((?:1970)\)',
            "title": "El informe de Brodie",
            "year": 1970,
            "genre": "Cuentos realistas y directos",
            "summary": "Relatos directos de estilo llano: La intrusa, El indigno, Historia de Rosendo Juárez, El encuentro, Juan Muraña, El evangelio según Marcos, El informe de Brodie."
        },
        {
            "id": "el_oro_de_los_tigres",
            "search_pattern": r'(?:^|\n)(?:#{1,6}\s*)?El oro de los tigres\s*\((?:1972)\)',
            "title": "El oro de los tigres",
            "year": 1972,
            "genre": "Poemas y prosas",
            "summary": "Último libro del tomo de 1974: El oro de los tigres, El palacio, El sueño, Tankas y reflexiones sobre la luz, la memoria y el color amarillo."
        }
    ]

    # Encontrar las posiciones de inicio de cada libro
    book_positions = []
    for book in canonical_books:
        match = re.search(book["search_pattern"], content, re.IGNORECASE)
        if match:
            book_positions.append((match.start(), book))
        else:
            print(f"ADVERTENCIA: No se encontró patrón para {book['title']}")

    # Ordenar por posición en el texto
    book_positions.sort(key=lambda x: x[0])
    
    os.makedirs(output_dir, exist_ok=True)
    created_files = []

    for i in range(len(book_positions)):
        start_idx, book_info = book_positions[i]
        end_idx = book_positions[i+1][0] if i + 1 < len(book_positions) else len(content)
        
        raw_text = content[start_idx:end_idx]
        cleaned_text = clean_ocr_noise(raw_text)
        
        file_name = f"{book_info['id']}.md"
        file_path = os.path.join(output_dir, file_name)
        
        # Generar Frontmatter YAML
        frontmatter = f"""---
title: "{book_info['title']}"
author: "Jorge Luis Borges"
year: {book_info['year']}
genre: "{book_info['genre']}"
summary: "{book_info['summary']}"
borgpt_relevance: "Módulo canónico del corpus de BorGPT para contextualización temática y estilística durante la obra de teatro y consultas interactivas."
---

# {book_info['title']}

> **Autor:** Jorge Luis Borges  
> **Año original:** {book_info['year']}  
> **Género:** {book_info['genre']}  
> **Sinopsis:** {book_info['summary']}

---

## Contenido del libro

{cleaned_text}
"""
        with open(file_path, "w", encoding="utf-8") as f_out:
            f_out.write(frontmatter)
            
        created_files.append((file_name, len(cleaned_text.splitlines()), len(cleaned_text)))
        print(f"Generado con éxito: {file_name} ({len(cleaned_text)} bytes, {len(cleaned_text.splitlines())} líneas)")

    print(f"\nProceso finalizado. Total de libros generados: {len(created_files)}")

if __name__ == "__main__":
    corpus_path = os.path.join("data", "corpus", "obras_completas_1923_1972.md")
    output_dir = os.path.join("docs", "libros", "obras_canonicas")
    split_corpus(corpus_path, output_dir)
