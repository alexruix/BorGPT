import os
import re

TRANSCRIPTS = [
    {
        "raw_file": "antonioCarrizo_entrevista.md",
        "out_file": "docs/entrevistas/antonio_carrizo_los_grandes_1984.md",
        "title": "Entrevista de Antonio Carrizo en «Los Grandes» (1984)",
        "year": 1984,
        "interviewer": "Antonio Carrizo (Canal 11, Buenos Aires)",
        "topics": [
            "Lectura en voz alta de «Borges y yo» y el desdoblamiento del personaje",
            "La relación con su padre Jorge Guillermo Borges y la biblioteca de Palermo",
            "Sus raíces genealógicas: estirpe militar criolla y ascendencia judeo-portuguesa",
            "La ceguera como disciplina auditiva y memoria de lo leído",
            "La colaboración literaria con Adolfo Bioy Casares (Bustos Domecq)",
            "Caminatas nocturnas por Buenos Aires con Xul Solar y Carlos Mastronardi",
            "La anécdota de su nombramiento como director de la Biblioteca Nacional en 1955"
        ],
        "key_insights": """### 1. El desdoblamiento y la memoria sonora
- Borges analiza el texto de *Borges y yo*, explicando cómo el hombre íntimo va cediéndolo todo al personaje público y a la literatura.
- Explica cómo la ceguera convierte la creación en un ejercicio puramente acústico: ensayar versos y frases en voz alta durante largas caminatas o en soledad antes de dictarlas a un amanuense.

### 2. La colaboración con Bioy Casares
- Describe el nacimiento del tercer autor ("B. Bustos Domecq"): una entidad que no era ni Borges ni Bioy, con una voz propia y pedante que se les imponía y a la que debían acatar.

### 3. La noche y Buenos Aires
- El estímulo intelectual de caminar por la ciudad desierta de noche junto a Mastronardi y Xul Solar, sintiendo que detrás de las ventanas la población duerme y sueña."""
    },
    {
        "raw_file": "documental_Borges_para_millones.md",
        "out_file": "docs/entrevistas/documental_borges_para_millones_1978.md",
        "title": "Documental «Borges para millones» (1978)",
        "year": 1978,
        "interviewer": "Ricardo Wullicher / Testimonios autobiográficos de Jorge Luis Borges",
        "topics": [
            "Cosmopolitismo argentino frente al provincianismo europeo",
            "El laberinto como símbolo de perplejidad y necesidad de un orden secreto",
            "El accidente de Nochebuena de 1938 y el nacimiento de sus cuentos fantásticos",
            "La experiencia de los colores en la ceguera: el oro de los tigres y la pérdida del negro y el rojo",
            "El soneto «Everness» y la profética memoria de Dios",
            "La esperanza de la mortalidad como liberación de la desdicha"
        ],
        "key_insights": """### 1. El laberinto y el cosmos
- El laberinto no es solo confusión, sino esperanza: la existencia de una arquitectura (aunque sea monstruosa como el Minotauro) garantiza que el universo no es un mero caos sin sentido.

### 2. La invención de la narrativa fantástica (1938)
- Relato directo de la septicemia de 1938 tras golpearse con la ventana recién pintada. El temor a haber perdido la razón lo llevó a intentar un género nuevo (*Pierre Menard*) para atenuar el posible fracaso.

### 3. El color amarillo y la ceguera
- Desmiente el mito de que los ciegos viven en la oscuridad: viven en una neblina luminosa gris/azulada. El único color nítido que le queda es el amarillo (*El oro de los tigres*), que lo acompañó desde su niñez frente a las jaulas del zoológico de Palermo."""
    },
    {
        "raw_file": "edoctum_segundo.md",
        "out_file": "docs/entrevistas/encuentro_mexico_1973_segunda_parte.md",
        "title": "Encuentro literario en México - Segunda parte (1973)",
        "year": 1973,
        "interviewer": "Álvaro Gálvez y Fuentes con Arreola, Elizondo, Bleiberg y Juan García Ponce",
        "topics": [
            "La inocencia y espontaneidad del acto poético frente al artificio",
            "La poesía popular como creación anónima decantada por el tiempo",
            "Degradación del lenguaje en las masas urbanas vs. la dignidad del habla campesina",
            "La definición del tiempo (San Agustín) y la eternidad como ambición humana",
            "Cinco libros hispanoamericanos esenciales según los participantes",
            "Consejo a los jóvenes escritores: huir de las modas y leer a los clásicos"
        ],
        "key_insights": """### 1. La poesía como anterior a la prosa
- Sostiene que la lengua materna del ser humano es el verso y el canto; la prosa es un artificio posterior inventado a menudo para disimular o mentir.

### 2. Poesía popular y payadores
- Analiza la poesía gauchesca y a los payadores: el pueblo aprecia la forma métrica antes que la complejidad conceptual. La poesía verdaderamente popular es aquella que se vuelve anónima en la memoria colectiva.

### 3. El tiempo y la eternidad
- Retoma a San Agustín (*«El tiempo soy yo»*): la perplejidad metafísica de saber que somos el río que fluye, el tigre que nos destroza y el fuego que nos consume."""
    },
    {
        "raw_file": "encuentro_con_las_letras.md",
        "out_file": "docs/entrevistas/encuentro_con_las_letras_1978.md",
        "title": "Entrevista en «Encuentro con las letras» (1978)",
        "year": 1978,
        "interviewer": "Televisión Española (TVE, enero de 1978)",
        "topics": [
            "La biblioteca de su padre como el verdadero hogar y origen de Don Quijote",
            "La aspiración al anonimato como la forma máxima de la gloria",
            "La política como abstracción frente a la realidad del individuo",
            "El cuento profético «Utopía de un hombre que está cansado»",
            "La memoria como una forma de invención y de literatura fantástica",
            "Juicio sobre Samuel Beckett, Nabokov y la brevedad del cuento"
        ],
        "key_insights": """### 1. El anonimato como gloria máxima
- Borges aspira a que sus versos se incorporen al idioma castellano y que su nombre particular sea olvidado: la cumbre del arte es volverse refrán, cadencia o proverbio sin autor.

### 2. Anarquismo spenceriano e individualismo
- Reafirma su adhesión al anarquismo individualista de Herbert Spencer: los Estados y las fronteras son abstracciones; solo el individuo que sufre y piensa es real. Defiende la progresiva desaparición de los gobiernos por desuso.

### 3. La memoria como ficción
- Sostiene que los recuerdos de la infancia no son hechos objetivos sino relatos imaginarios que la mente va puliendo como pequeñas obras de arte fantásticas."""
    },
    {
        "raw_file": "RTVE_1976.md",
        "out_file": "docs/entrevistas/rtve_encuentros_artes_letras_1976.md",
        "title": "Entrevista en RTVE «Encuentros con las artes y las letras» (1976)",
        "year": 1976,
        "interviewer": "Paloma Chamorro, Marcos Ricardo Barnatán y José Luis Jover",
        "topics": [
            "Revisión de «Fervor de Buenos Aires» (1923) tras más de 50 años",
            "El conjunto de manías y símbolos borgianos: laberinto, espejo, doble, cografía divina",
            "El ultraísmo como juego juvenil superado y la limitación de las metáforas esenciales",
            "Macedonio Fernández como el primer filósofo adánico y genio oral",
            "La milonga como coraje vs. la decadencia sentimental del tango",
            "El significado oculto del cuento «La secta del Fénix»",
            "El poema «El remordimiento» escrito tras la muerte de doña Leonor Acevedo"
        ],
        "key_insights": """### 1. Las metáforas esenciales
- Rechaza el afán vanguardista de inventar metáforas arbitrarias: existen pocas afinidades eternas (el tiempo y el río, la vida y el sueño, la muerte y el sueño, las mujeres y las flores, los ojos y las estrellas).

### 2. La clave de «La secta del Fénix»
- Borges revela con naturalidad la clave hermética del cuento: el secreto universal de la secta del Fénix es simplemente el acto fisiológico de la reproducción sexual y la perpetuación de la especie.

### 3. El remordimiento filial
- Reflexión conmovedora sobre el poema *El remordimiento* (*«He cometido el peor de los pecados: no he sido feliz»*), escrito a los tres días de la muerte de su madre Leonor Acevedo."""
    }
]

def clean_transcript(text):
    # Remove youtube timestamps like 0:088 segundos, 1:051 minuto y 5 segundos, 12:34, 1:00:00
    cleaned = re.sub(r'\d+:\d+(?::\d+)?\s*(?:segundos|minuto[s]?\s*y\s*\d+\s*segundos|minutos)?', '', text)
    # Remove [Música], [Risas]
    cleaned = re.sub(r'\[(Música|Risas|Aplausos)\]', '', cleaned, flags=re.IGNORECASE)
    # Normalize multiple linebreaks and spaces
    lines = [l.strip() for l in cleaned.split('\n') if l.strip()]
    return '\n\n'.join(lines)

for item in TRANSCRIPTS:
    raw_p = os.path.join(r'c:\Users\alexr\github\BorGPT', item['raw_file'])
    out_p = os.path.join(r'c:\Users\alexr\github\BorGPT', item['out_file'])
    
    if not os.path.exists(raw_p):
        print(f"Skipping {raw_p}, not found.")
        continue
        
    with open(raw_p, 'r', encoding='utf-8') as f:
        raw_content = f.read()
        
    body_clean = clean_transcript(raw_content)
    
    topics_yaml = "\n".join([f'  - "{t}"' for t in item['topics']])
    
    md_content = f"""---
titulo: "{item['title']}"
año: {item['year']}
entrevistador: "{item['interviewer']}"
tipo: "Entrevista audiovisual histórica / Transcripción depurada"
temas_clave:
{topics_yaml}
---

# {item['title']}

Transcripción depurada y análisis conceptual de la entrevista con Jorge Luis Borges ({item['year']}), realizada por {item['interviewer']}.

---

## Núcleos conceptuales y claves borgeanas

{item['key_insights']}

---

## Transcripción depurada del diálogo

{body_clean}
"""
    with open(out_p, 'w', encoding='utf-8') as f:
        f.write(md_content)
    print(f"Generated: {out_p}")

print("All interviews processed successfully.")
