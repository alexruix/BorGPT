import os
import sys
import re
from pathlib import Path

# Intentar importar librerías de extracción de PDF de alto rendimiento
try:
    import pypdf
    PDF_LIB = "pypdf"
except ImportError:
    try:
        import fitz  # PyMuPDF
        PDF_LIB = "pymupdf"
    except ImportError:
        PDF_LIB = None

def clean_text(text: str) -> str:
    """Limpia saltos de línea rotos, números de página huérfanos y espacios múltiples."""
    if not text:
        return ""
    # Quitar números de página huérfanos
    text = re.sub(r'^\s*\d+\s*$', '', text, flags=re.MULTILINE)
    # Unir palabras cortadas con guion al final de línea
    text = re.sub(r'(\w+)-\n(\w+)', r'\1\2', text)
    # Limpiar espacios en blanco excesivos
    text = re.sub(r'[ \t]+', ' ', text)
    # Limpiar saltos de línea triples
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def convert_pdf_to_md(pdf_path: str, output_dir: str = "data/corpus/borges_bioy"):
    """
    Convierte un PDF monumental (+3000 páginas) a Markdown estructurado y dividido en tomos por años.
    """
    if PDF_LIB is None:
        print("ERROR: Necesitas instalar 'pypdf' o 'pymupdf' para procesar el PDF.")
        print("Ejecuta: pip install pypdf pymupdf")
        return

    pdf_file = Path(pdf_path)
    if not pdf_file.exists():
        print(f"ERROR: No se encontró el archivo PDF en: {pdf_path}")
        return

    out_path = Path(output_dir)
    out_path.mkdir(parents=True, exist_ok=True)

    print(f"=== Procesando '{pdf_file.name}' ({PDF_LIB}) ===")
    print(f"Destino: {out_path.resolve()}\n")

    full_md_path = out_path / "borges_bioy_completo.md"
    
    total_pages = 0
    pages_processed = 0

    if PDF_LIB == "pymupdf":
        doc = fitz.open(pdf_file)
        total_pages = len(doc)
        print(f"Total de páginas detectadas: {total_pages}")
        
        with open(full_md_path, "w", encoding="utf-8") as f_out:
            f_out.write(f"# Borges - Adolfo Bioy Casares\n\n")
            f_out.write(f"> Transcripción y extracción completa de los diarios (1931-1989).\n\n---\n\n")
            
            for page_idx in range(total_pages):
                page = doc[page_idx]
                raw_text = page.get_text("text")
                cleaned = clean_text(raw_text)
                
                if cleaned:
                    f_out.write(f"\n\n<!-- Página {page_idx + 1} -->\n\n{cleaned}")
                
                pages_processed += 1
                if pages_processed % 100 == 0 or pages_processed == total_pages:
                    print(f"Progreso: {pages_processed}/{total_pages} páginas procesadas ({(pages_processed/total_pages)*100:.1f}%)")

    elif PDF_LIB == "pypdf":
        reader = pypdf.PdfReader(pdf_file)
        total_pages = len(reader.pages)
        print(f"Total de páginas detectadas: {total_pages}")
        
        with open(full_md_path, "w", encoding="utf-8") as f_out:
            f_out.write(f"# Borges - Adolfo Bioy Casares\n\n")
            f_out.write(f"> Transcripción y extracción completa de los diarios (1931-1989).\n\n---\n\n")
            
            for page_idx in range(total_pages):
                page = reader.pages[page_idx]
                raw_text = page.extract_text()
                cleaned = clean_text(raw_text)
                
                if cleaned:
                    f_out.write(f"\n\n<!-- Página {page_idx + 1} -->\n\n{cleaned}")
                
                pages_processed += 1
                if pages_processed % 100 == 0 or pages_processed == total_pages:
                    print(f"Progreso: {pages_processed}/{total_pages} páginas procesadas ({(pages_processed/total_pages)*100:.1f}%)")

    print(f"\n ¡Conversión completada con éxito!")
    print(f"Archivo generado: {full_md_path.resolve()}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python scripts/convert_borges_bioy_pdf.py <ruta_al_archivo_pdf>")
        print("Ejemplo: python scripts/convert_borges_bioy_pdf.py data/raw/Borges_Bioy_Casares.pdf")
    else:
        convert_pdf_to_md(sys.argv[1])
