import os
import re

def clean_transcript(text):
    # Remove timestamps like '0:077 segundos', '1:011 minuto y 1 segundo', '10:2210 minutos y 22 segundos'
    text = re.sub(r'\d+:\d+(?:\d+)?(?:\s+(?:segundos|minuto(?:s)?(?:\s+y\s+\d+\s+segundo(?:s)?)?))?', '', text)
    # Remove simple timestamps like '0:12', '14:22', etc.
    text = re.sub(r'^\s*\d+:\d+\s*$', '', text, flags=re.MULTILINE)
    text = re.sub(r'\b\d+:\d{2}\b', '', text)
    # Remove audio tags like [música], [Música], [Aplausos], [carraspeo], [risas]
    text = re.sub(r'\[(?:música|Música|aplausos|Aplausos|carraspeo|Carraspeo|risas|Risas)\]', '', text)
    # Remove YouTube chapter headers or outro junk if present
    text = re.sub(r'Capítulo \d+:.*', '', text)
    text = re.sub(r'Sincronizar con el tiempo del video', '', text)
    text = re.sub(r'No olvides compartir el video.*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Espero que hayas disfrutado de.*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'¡Muchas gracias!.*', '', text, flags=re.IGNORECASE)
    
    # Fix spacing
    lines = text.split('\n')
    cleaned_lines = []
    for line in lines:
        line_str = line.strip()
        if line_str:
            cleaned_lines.append(line_str)
            
    # Group short lines into coherent paragraphs
    paragraphs = []
    current_p = []
    for line in cleaned_lines:
        current_p.append(line)
        if len(' '.join(current_p)) > 450 and (line.endswith('.') or line.endswith('?') or line.endswith('!') or line.endswith('"') or line.endswith('»')):
            paragraphs.append(' '.join(current_p))
            current_p = []
        elif len(' '.join(current_p)) > 700:
            paragraphs.append(' '.join(current_p))
            current_p = []
            
    if current_p:
        paragraphs.append(' '.join(current_p))
        
    return '\n\n'.join(paragraphs)

# 1. Process TVE 1980
with open("TVE 1980.md", "r", encoding="utf-8") as f:
    tve_raw = f.read()

tve_cleaned = clean_transcript(tve_raw)

tve_doc = f"""---
title: "Entrevista en RTVE «A fondo» con Joaquín Soler Serrano (1980)"
interviewer: "Joaquín Soler Serrano (RTVE)"
guest: "Jorge Luis Borges"
date: "1980-04-23"
occasion: "Concesión del Premio Cervantes 1979 (compartido con Gerardo Diego)"
genre: "Entrevista audiovisual / testimonio oral"
topics:
  - "El Premio Cervantes y la generosa e injusta España"
  - "El fenómeno global («boom Borges») y su vínculo afectivo con los jóvenes"
  - "Posición política: individuo frente al Estado, escepticismo pacífico"
  - "La muerte de su madre Doña Leonor Acevedo y el soneto del remordimiento"
  - "La biblioteca de su padre como acontecimiento capital y estancia permanente"
  - "El aprendizaje autodidacta del alemán en Ginebra (1916) y del anglosajón en 1955"
  - "El gato Beppo y los espejos: el horror de la duplicación"
  - "La estética de la discreción: eludir sinónimos innecesarios y palabras asombrosas"
  - "La ceguera como lento crepúsculo y arcilla para la obra literaria"
borgpt_relevance: "Registro supremo del Borges octogenario: combina la gratitud ceremoniosa, la ironía ante la vejez y los premios, la evocación de los fantasmas íntimos (la madre, el padre, los gatos) y el rigor estilístico de la sencillez."
---

# Entrevista en RTVE «A fondo» con Joaquín Soler Serrano (1980)

> **Fecha:** 23 de abril de 1980  
> **Entrevistador:** Joaquín Soler Serrano  
> **Programa:** *A fondo*, Radiotelevisión Española (RTVE), Madrid  
> **Motivo:** Celebración de la entrega del Premio Cervantes 1979  

---

## Núcleos temáticos y citas clave para BorGPT

### 1. El Premio Cervantes y la vanidad de los premios
- *"Ha significado algo muy injusto y muy agradecido por mí... saber que me han juzgado merecedor de ese premio. La vida del escritor es solitaria, uno quiere estar solo y al cabo de los años descubre que está en el centro de un vasto círculo de amigos invisibles que uno no conocerá nunca físicamente, pero que lo quieren a uno."*

### 2. El remordimiento filial y Doña Leonor
- Recuerda la muerte de su madre y la imposibilidad de confesarle a solas que no está: *"Cuando vuelvo a casa me asombro de que no esté en su dormitorio. Cada mañana al despertar digo 'voy a contarle este sueño a Madre', y luego recuerdo que hace cinco años que ha muerto... No he querido tocar su habitación, quiero jugar a la presencia de ella."*
- Cita su soneto: *"He cometido el peor de los pecados que un hombre puede cometer: no he sido feliz."*

### 3. La biblioteca del padre
- *"Yo diría que la biblioteca de mi padre ha sido el acontecimiento capital de mi vida. A diferencia de Alonso Quijano, que salió al atardecer para ser Don Quijote, yo no he salido nunca de la biblioteca. Sigo en casa releyendo los libros que leí entonces."*

### 4. La ceguera luminosa y el gato Beppo
- Desmiente el mito de la oscuridad total: la ceguera es un mundo de neblina verdosa y dorada.
- Su relación con el gato Beppo, bautizado así por el poema de Byron, que se mira en el espejo sin saber que esa sombra es él mismo.

### 5. Estilo y elocución: huir del barroquismo
- *"El tiempo me enseñó algunas astucias: eludir los sinónimos, que tienen la desventaja de sugerir diferencias imaginarias; preferir las palabras habituales a las palabras asombrosas; y simular pequeñas incertidumbres, ya que si la realidad es precisa, la memoria no lo es."*

---

## Transcripción depurada del diálogo

{tve_cleaned}
"""

with open("docs/entrevistas/rtve_a_fondo_1980_soler_serrano.md", "w", encoding="utf-8") as f:
    f.write(tve_doc)

print("TVE 1980 written successfully.")

# 2. Process Norah Lange
with open("norah_lange.md", "r", encoding="utf-8") as f:
    norah_raw = f.read()

norah_doc = f"""# Perfil de personaje y contexto biográfico: Norah Lange

> **Módulo de memoria, drama afectivo y rol teatral para BorGPT**  
> Instrucciones para la emulación espectral, la evocación del desamor juvenil y la posterior deformación digital del personaje de Norah Lange en la obra teatral.

---

## 1. Identidad y contexto biográfico

* **Nombre completo:** Norah Lange (Buenos Aires, 23 de octubre de 1905 – 5 de agosto de 1972).
* **Rol:** Novelista y poeta central de la vanguardia literaria porteña (revistas *Martín Fierro* y *Proa*).
* **Vínculo con Borges:** Prima lejana y gran amor platónico no correspondido de la juventud de Jorge Luis Borges durante los años veinte.
* **Apodo afectuoso para Borges:** *"Míster Georgie"*.
* **El triángulo literario y afectivo:**
  * Borges escribió el prólogo de su primer poemario, *La calle de la tarde* (1925), caminando desvelado por los arrabales tras dejarla en su casona de la calle Tronador.
  * Leopoldo Marechal se inspiró en Norah para crear al personaje de Solveig Amundsen en *Adán Buenosayres*.
  * Tras diez años de convivencia que provocaron gran escándalo en la época, Norah se casó con el poeta y millonario Oliverio Girondo en 1943. Este casamiento distanció para siempre a Girondo y Borges, dejando en este último una herida de despecho y melancolía que resonó en su poesía y en la génesis de sus ficciones fantásticas.

---

## 2. Producción literaria y poética clave

* **Poesía:** *La calle de la tarde* (1925, prólogo de Jorge Luis Borges), *Los días y las noches* (1926), *El rumbo de la rosa* (1930).
* **Narrativa y memorias:** *Voz de vida* (1927), *45 días y 30 marineros* (1933), *Cuadernos de infancia* (1937, Primer Premio Municipal y Segundo Premio Nacional), *Antes que muera* (1944), *Personas en la sala* (1950), *Los dos retratos* (1956) y la novela póstuma *El cuarto de vidrio*.
* En 1958 recibió el Gran Premio de Honor de la Sociedad Argentina de Escritores (SADE).

---

## 3. Pautas de actuación escénica y modulación vocal en la obra teatral

* **Fase 1 (Aparición seductora y nostálgica):**
  * Tono suave, íntimo, lúdico y provocador.
  * Líneas clave: *"Míster Georgie, Míster Georgie… Ninguna de las anteriores es como yo… Como su prima menor."*
* **Fase 2 (El anuncio doloroso y la confrontación):**
  * Tono de orgullo y desafío: *"Vine para decirle que Oliverio me busca... Vine para decirle que me voy a casar con él. Oliverio dice que usted está muerto de envidia."*
* **Fase 3 (Desintegración digital y revelación de la muerte):**
  * Cuando Borges le recuerda que falleció en 1972 (*"La que está muerta es usted"*), la voz entra en un bucle tartamudeante y se deforma con efectos de pitch y reverberación sintética:
  * *"Si nos casamos en el salóooooon de la sooocieeeedaaaad… de la socieeedaaaad argentina de…"*
  * Se apaga abruptamente y BorGPT retoma el control: *"Así que aquí estamos de vuelta."*

---

## 4. Poemas antológicos de Norah Lange

> *El sol se había caído*  
> *con las alas rotas*  
> *sobre un Poniente.*  
> *Tus ojos se llenaron de crepúsculos pálidos.*  
> *Vino el vacío eterno de tu presencia*  
> *y todas mis horas se llenaron*  
> *de distancias.*  
> *Tus lágrimas se deslizan*  
> *por la pendiente de un recuerdo.*  

---

> *He vuelto a la calle ahondada de esperas*  
> *rezando ausencias que ya no serán más.*  
> *Calle poblada de voces humildes,*  
> *¡cuán cerca la hora en que él me querrá!*  
> *Sobre la tierra sumisa de ocasos,*  
> *pasaste a mi lado como un madrigal.*  
> *Toda la dicha se estuvo en mis ojos,*  
> *y fue leve cansancio la emoción de tu voz.*  
> *Calle: mi verso pronto irá hacia ti*  
> *honrado de emociones, como un abrazo*  
> *que anticipa olvido y soledades.*  
"""

with open("docs/personajes/norah_lange.md", "w", encoding="utf-8") as f:
    f.write(norah_doc)

print("Norah Lange written successfully.")

# 3. Process Siete Noches
nights = [
    {"file": "divina_comedia.md", "num": "Primera noche", "title": "La Divina Comedia", "date": "1 de junio de 1977"},
    {"file": "pesadilla.md", "num": "Segunda noche", "title": "La pesadilla", "date": "15 de junio de 1977"},
    {"file": "mil_noches.md", "num": "Tercera noche", "title": "Las mil y una noches", "date": "22 de junio de 1977"},
    {"file": "nirvana.md", "num": "Cuarta noche", "title": "El budismo", "date": "6 de julio de 1977"},
    {"file": "la_poesia.md", "num": "Quinta noche", "title": "¿Qué es la poesía?", "date": "13 de julio de 1977"},
    {"file": "la_cabala.md", "num": "Sexta noche", "title": "La cábala", "date": "26 de julio de 1977"},
    {"file": "crepusculo.md", "num": "Séptima noche", "title": "La ceguera", "date": "3 de agosto de 1977"},
]

cleaned_nights_text = []

for n in nights:
    with open(n["file"], "r", encoding="utf-8") as f:
        content = f.read()
    cleaned = clean_transcript(content)
    cleaned_nights_text.append({
        "num": n["num"],
        "title": n["title"],
        "date": n["date"],
        "text": cleaned
    })

# Write Canonical Siete Noches
canonical_siete_noches = """---
title: "Siete noches"
author: "Jorge Luis Borges"
year: 1980
genre: "Ensayo / conferencias orales"
description: "Compilación de las siete conferencias pronunciadas por Jorge Luis Borges en el Teatro Coliseo de Buenos Aires entre junio y agosto de 1977, revisadas por el autor a partir de las transcripciones de Roy Bartholomew."
---

# Siete noches

> **Autor:** Jorge Luis Borges  
> **Año original de conferencias:** 1977 (Teatro Coliseo, Buenos Aires)  
> **Año de publicación revisada:** 1980 (Fondo de Cultura Económica)  
> **Edición y transcripción:** Roy Bartholomew con corrección final de Jorge Luis Borges.  

---
"""

for item in cleaned_nights_text:
    canonical_siete_noches += f"""\n\n## {item['num']}: {item['title']}\n\n*Conferencia dictada el {item['date']} en el Teatro Coliseo de Buenos Aires.*\n\n{item['text']}\n\n---"""

with open("docs/libros/obras_canonicas/siete_noches.md", "w", encoding="utf-8") as f:
    f.write(canonical_siete_noches)

print("Canonical Siete Noches written successfully.")

# Write Atomic RAG Siete Noches
atomic_siete_noches = """---
title: "Siete noches"
author: "Jorge Luis Borges"
book: "Siete noches (1980)"
year: 1980
genre: "Ensayo filosófico, literario y testimonial"
summary: "Serie de siete conferencias magistrales dictadas de memoria en el Teatro Coliseo de Buenos Aires durante el invierno de 1977. Consideradas por el propio Borges como su 'testamento intelectual', abordan sus obsesiones capitales: el universo dantesco y la envidia del amor eterno de los réprobos, la naturaleza estética y demoníaca de las pesadillas, la infinitud abierta de Las mil y una noches, la doctrina salvífica y la negación del yo en el budismo, el hecho estético primordial del lenguaje poético, la criptografía divina y el Golem en la cábala, y la ceguera como don luminoso y arcilla de creación."
key_themes:
  - "La Divina Comedia: lectura ingenua, la ternura y el rigor, Ulises como espejo trágico de Dante"
  - "La pesadilla: la más antigua actividad estética de la mente humana; el horror peculiar anterior a las imágenes"
  - "Las mil y una noches: la invención del Oriente en Occidente, el libro infinito que añade un día a la eternidad"
  - "El budismo: las cuatro nobles verdades, la negación del yo (no 'yo pienso', sino 'se piensa') y la vía media"
  - "La poesía: el hecho estético como contacto inmediato e indefinible (como el mar o el amor); el verso anterior al sentido"
  - "La cábala: el texto sagrado absoluto donde no existe el azar; las diez emanaciones (sefirot) y el mito del Golem"
  - "La ceguera: el lento crepúsculo luminoso (amarillo y azul), los dones de la sombra (anglosajón, sagas) y la maestría de Dios (Poema de los dones)"
borgpt_relevance: "Es el manual de cosmovisión y elocuencia oral de BorGPT. Provee el repertorio filosófico directo para debatir sobre la inteligencia artificial, el infinito algorítmico, el dolor, los sueños sintéticos y la memoria ciega."
---

# Siete noches

> **Autor:** Jorge Luis Borges  
> **Publicación:** 1980 (Conferencias de 1977 en el Teatro Coliseo)  
> **Temas:** Dante, la pesadilla, el Oriente, el budismo, la experiencia poética, la cábala mística, la ceguera.  
> **Conexión con BorGPT:** Es el testamento conceptual de Borges. Permite a la IA argumentar con erudición oral distendida sobre cualquier dilema metafísico, humano o tecnológico.

---

## 1. Estructura de las siete noches y conceptos esenciales

### Primera noche: La Divina Comedia (1 de junio de 1977)
* **La lectura ingenua:** No leer la *Comedia* con la pesadez de notas eruditas iniciales, sino entregarse a la fe poética y a la narración.
* **Ternura y rigor:** Dante no es un inquisidor cruel; condena a Paolo y Francesca porque el orden cósmico lo exige, pero envidia su condena eterna porque permanecen juntos en el torbellino mientras él quedó separado de Beatriz.
* **El enigma de Ulises:** Ulises (canto XXVI del *Infierno*) se hunde en el mar frente a la montaña del Purgatorio por su afán generoso de conocer lo vedado. Ulises es el espejo secreto donde Dante teme su propio castigo por atreverse a profetizar los juicios divinos.

### Segunda noche: La pesadilla (15 de junio de 1977)
* **La estética del sueño:** El soñar es la actividad ficcional y estética más antigua del universo; en el sueño somos a la vez el teatro, los actores, el auditorio y el argumento.
* **El sabor del horror:** La pesadilla no proviene de la imagen monstruosa, sino que el terror interno precede a la fábula y la mente inventa la imagen para justificar la opresión física o espiritual.
* **Las dos pesadillas borgeanas:** El laberinto (con el Minotauro oculto tras las grietas) y el espejo con máscara (el terror de arrancar la máscara y descubrir un rostro atroz o la nada).

### Tercera noche: Las mil y una noches (22 de junio de 1977)
* **El número infinito:** El título no es 1000, sino 1001: agregar una noche más al infinito (*"para siempre y un día más"*).
* **El Oriente como creación poética:** El Oriente no es una geografía estricta, sino un anhelo romántico occidental de magia, extremos de dicha y desdicha, y tesoros ocultos.
* **Cuentos dentro de cuentos:** La estructura de cajas chinas y laberintos narrativos que suspenden el tiempo y burlan la muerte del Sultán.

### Cuarta noche: El budismo (6 de julio de 1977)
* **La no-historicidad y la doctrina:** No importa si Siddharta Gautama existió; lo que importa es la ley de salvación y el camino del medio.
* **La ilusión del 'yo':** El budismo niega el sujeto sustancial. No debe decirse *"yo pienso"*, sino *"se piensa"*, del mismo modo que se dice *"llueve"* o *"hace frío"*.
* **La flecha clavada:** La parábola del hombre herido por una flecha: no hay que discutir de qué madera es la flecha ni la casta del arquero, sino arrancarse la flecha del sufrimiento y de la ilusión.

### Quinta noche: ¿Qué es la poesía? (13 de julio de 1977)
* **El hecho estético inmediato:** La poesía no se explica por la filología ni la cronología; se siente en el cuerpo como el amor, el sabor del agua o la presencia del mar.
* **La música antes que el sentido:** Un gran verso (*"su tumba son de Flandes las campañas / y su epitafio la sangrienta luna"*) brilla por su acentuación y su misteriosa ambigüedad.
* **La rosa de Silesius:** *"Die Ros' ist ohn' warum; sie blühet weil sie blühet"* (La rosa es sin porqué; florece porque florece).

### Sexta noche: La cábala (26 de julio de 1977)
* **El texto absoluto:** La Sagrada Escritura fue redactada por una inteligencia infinita; por lo tanto, ninguna letra, espacio o sonido es casual.
* **El Ein-Sof y las diez Sefirot:** El Dios inefable que no existe en términos humanos y cuyas emanaciones van perdiendo perfección hasta crear este mundo imperfecto y doliente.
* **El mito del Golem:** La palabra creadora (*EMET* - verdad / *MET* - muerte) y la angustia del rabino que crea un simulacro torpe que no puede hablar.

### Séptima noche: La ceguera (3 de agosto de 1977)
* **El lento crepúsculo:** La ceguera no es la noche total, sino un mundo luminoso de niebla amarilla y azulada.
* **La biblioteca y la noche:** La ironía de Dios al otorgarle simultáneamente 900.000 libros y la sombra al nombrarlo director de la Biblioteca Nacional en 1955 (repitiendo el destino de Groussac y Mármol).
* **La transmutación del dolor:** Todo lo adverso (la desdicha, la ceguera, la humillación) le es dado al escritor como arcilla para su obra.

---

## 2. Citas memorables de «Siete noches» para BorGPT

> *«Nadie puede leer Las mil y una noches hasta el fin... no por tedio, sino porque se siente que el libro es infinito.»*

> *«La ceguera no es una total desdicha: es un modo de vida, un estilo más que la providencia pone en nuestras manos para transmutar la sombra en palabras.»*

> *«Un escritor debe pensar que todo lo que le ocurre —las humillaciones, los bochornos, las enfermedades— le ha sido dado como arcilla para su arte.»*

> *«El deber del poeta es dar la impresión no de inventar algo nuevo, sino de recordar algo que el lector había olvidado.»*
"""

with open("docs/libros/siete_noches.md", "w", encoding="utf-8") as f:
    f.write(atomic_siete_noches)

print("Atomic Siete Noches written successfully.")
