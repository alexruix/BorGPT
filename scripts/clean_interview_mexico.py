import re

raw_path = r'c:\Users\alexr\github\BorGPT\eductum_encuentro.md'
out_path = r'c:\Users\alexr\github\BorGPT\docs\entrevistas\encuentro_mexico_1973_galvez_fuentes.md'

with open(raw_path, 'r', encoding='utf-8') as f:
    raw = f.read()

lines = [l.strip() for l in raw.split('\n') if l.strip()]
filtered = [l for l in lines if not re.match(r'^\d+:\d+$', l)]
body = '\n\n'.join(filtered)

header = """---
titulo: "Encuentro literario en México (1973)"
participantes:
  - "Jorge Luis Borges"
  - "Álvaro Gálvez y Fuentes ('El Bachiller')"
  - "Juan José Arreola"
  - "Salvador Elizondo"
  - "Germán Bleiberg"
  - "Adriano González León"
año: 1973
tipo: "Mesa redonda / Conferencia televisada"
temas_clave:
  - "La imposibilidad y ripio de la novela vs. la perfección del cuento breve"
  - "El exceso de libros impresos y el retorno a la poesía oral y medios sonoros"
  - "La separación entre convicciones políticas y creación poética"
  - "La flexibilidad del idioma: inglés y alemán frente a los adverbios españoles"
  - "El rechazo a las academias y diccionarios normativos"
---

# Encuentro literario en México (1973)

Mesa redonda histórica televisada en México, conducida por Álvaro Gálvez y Fuentes («El Bachiller»), con la participación de Jorge Luis Borges, Juan José Arreola, Salvador Elizondo, Germán Bleiberg y Adriano González León.

---

## Núcleos conceptuales y citas borgeanas fundamentales

### 1. La novela frente al cuento breve
> *«Una novela exige siempre ripios, elementos de transición, explicaciones de cómo los personajes se trasladan de un sitio a otro... En cambio, en el cuento y en el poema cada verso y cada frase pueden y deben ser necesarios y esenciales.»*
- Borges defiende la primacía estética de la brevedad concentrada: la épica antigua no requería la pesadez de la psicología descriptiva moderna.

### 2. La imprenta, el libro y el porvenir de la poesía
> *«Quizá la imprenta fue un error que llenó el mundo de libros innecesarios. En la antigüedad la poesía era ante todo un hecho oral, una voz compartida en el aire. Es muy posible que en el futuro los hombres vuelvan a escucharse y prescindan del objeto físico del libro.»*
- Postura esencial para **BorGPT**: concebir el texto no como objeto impreso estático, sino como voz, memoria y diálogo oral interactivo.

### 3. El arte frente a la política y las masas
> *«No existen las masas ni los países en abstracto: lo que existe son los individuos que sufren, piensan y sueñan. Mis opiniones políticas son meras opiniones de un ciudadano perplejo y son tan ajenas a mi poesía como el color de mis ojos.»*
- Regla cardinal para la emulación de Borges: desestimar las consignas doctrinarias y enfocar cualquier dilema ético o político desde el individuo y la perplejidad metafísica.

### 4. Las lenguas y la tiranía de las academias
> *«Las academias de la lengua suelen ser un error burocrático: pretenden legislar sobre algo vivo como el habla de los hombres. El inglés y el alemán tienen la hermosa facultad de componer palabras; en español nos vemos a menudo atrapados por los pesados adverbios en '-mente'.»*

---

## Transcripción depurada de la conferencia

"""

with open(out_path, 'w', encoding='utf-8') as f:
    f.write(header + body + '\n')

print("Procesamiento completado con éxito.")
