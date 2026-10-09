#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para extraer cuentos y ensayos emblemáticos desde docs/libros/obras_canonicas/
y generar módulos atómicos enriquecidos con YAML Frontmatter y Citas para RAG en docs/libros/.
"""

import os
import re

DEFINITIONS = [
    # 1. El Sur (Ficciones)
    {
        "source_file": os.path.join("docs", "libros", "obras_canonicas", "ficciones.md"),
        "target_file": os.path.join("docs", "libros", "el_sur.md"),
        "start_pattern": r'EL SUR\s*\n',
        "end_pattern": r'(?:---|\n[A-ZÁÉÍÓÚ\s]{4,}\n|FIN|\Z)',
        "yaml": {
            "title": "El Sur",
            "author": "Jorge Luis Borges",
            "book": "Ficciones (1944) / Artificios (1944)",
            "year": 1953,
            "genre": "Cuento criollo / fantástico / autobiográfico",
            "summary": "Juan Dahlmann, secretario de una biblioteca municipal en Buenos Aires de linaje criollo y germánico, sufre una septicemia tras rozarse la frente con el batiente de una ventana. Tras ser trasladado al Sur para convalecer en su estancia de la llanura, sufre una provocación en una pulpería perdida. Un viejo gaucho inmóvil le arroja una daga desnuda al piso; Dahlmann la empuña y sale a la llanura a batirse a duelo a cuchillo, sintiendo que esa muerte mítica es la que hubiera elegido en el sanatorio.",
            "characters": ["Juan Dahlmann", "El viejo gaucho", "El dueño de la pulpería", "El compadrito pendenciero"],
            "key_themes": ["La dualidad entre el destino letrado y el destino criollo", "El duelo a cuchillo como muerte elegida", "La delgada frontera entre la vigilia y el delirio agónico", "La pampa y el Sur como territorio mítico"],
            "borgpt_relevance": "Cuento favorito del propio Borges (declaró que era 'acaso mi mejor cuento'). Refleja la tensión entre la mente intelectual/confinada y el anhelo del coraje físico, central en la dialéctica de BorGPT frente al destino escénico."
        },
        "quotes": [
            "> *\"El hombre que entreteje estos símbolos ansiaba la llanura inagotable que resuena bajo los cascos.\"*",
            "> *\"Ciego a las culpas, el destino puede ser despiadado con las mínimas distracciones.\"*",
            "> *\"Sintió, al atravesar el umbral, que morir en una pelea a cuchillo, a cielo abierto y acometiendo, hubiera sido una liberación para él, una felicidad y una fiesta, en la primera noche del sanatorio, cuando le clavaron la aguja.\"*",
            "> *\"Dahlmann empuña con firmeza el cuchillo, que acaso no sabrá manejar, y sale a la llanura.\"*"
        ]
    },
    # 2. La lotería en Babilonia (Ficciones)
    {
        "source_file": os.path.join("docs", "libros", "obras_canonicas", "ficciones.md"),
        "target_file": os.path.join("docs", "libros", "la_loteria_en_babilonia.md"),
        "start_pattern": r'LA LOTERÍA EN BABILONIA\s*\n',
        "end_pattern": r'(?:---|\n[A-ZÁÉÍÓÚ\s]{4,}\n|FIN|\Z)',
        "yaml": {
            "title": "La lotería en Babilonia",
            "author": "Jorge Luis Borges",
            "book": "Ficciones (1944) / El jardín de senderos que se bifurcan (1941)",
            "year": 1941,
            "genre": "Cuento filosófico / alegoría metafísica",
            "summary": "Un ciudadano babilónico narra la evolución de la Lotería: de un vulgar juego de azar comercial a una institución omnipotente y secreta (La Compañía) que rige absolutamente todos los destinos, premios, castigos, infamias y muertes de la sociedad mediante sorteos infinitos, hasta tornarse indistinguible del universo mismo.",
            "characters": ["El narrador babilónico", "La Compañía (entidad secreta omnisciente)"],
            "key_themes": ["El azar como principio ontológico supremo", "La burocracia invisible y el poder totalitario", "La imposibilidad de distinguir el azar deliberado del orden natural", "El juego infinito"],
            "borgpt_relevance": "Alegoría de los procesos estocásticos y generativos en IA: BorGPT opera como un generador de probabilidades donde cada bifurcación y sorteo probabilístico de tokens define la realidad del texto."
        },
        "quotes": [
            "> *\"Como todos los hombres de Babilonia, he sido procónsul; como todos, esclavo; también he conocido la omnipotencia, el oprobio, las cárceles.\"*",
            "> *\"La Lotería es una interpolación del azar en el orden del universo y aceptar errores no es contradecir el azar: es corroborarlo.\"*",
            "> *\"Babilonia no es otra cosa que un infinito juego de azares.\"*"
        ]
    },
    # 3. El milagro secreto (Ficciones)
    {
        "source_file": os.path.join("docs", "libros", "obras_canonicas", "ficciones.md"),
        "target_file": os.path.join("docs", "libros", "el_milagro_secreto.md"),
        "start_pattern": r'EL MILAGRO SECRETO\s*\n',
        "end_pattern": r'(?:---|\n[A-ZÁÉÍÓÚ\s]{4,}\n|FIN|\Z)',
        "yaml": {
            "title": "El milagro secreto",
            "author": "Jorge Luis Borges",
            "book": "Ficciones (1944) / Artificios (1944)",
            "year": 1943,
            "genre": "Cuento fantástico / metafísico",
            "summary": "Jaromir Hladík, escritor judío checo condenado a muerte por la Gestapo en Praga, pide a Dios un año más de vida para concluir en su mente su obra de teatro en verso Los enemigos. Frente al pelotón de fusilamiento, en el instante en que el sargento da la orden final y una gota de lluvia resbala por su mejilla, el universo físico se detiene durante un año subjetivo completo. Hladík trabaja mentalmente cada hexámetro y, al encontrar el último epíteto perfecto, la bala lo derriba.",
            "characters": ["Jaromir Hladík (escritor y dramaturgo)", "Julius Rothe (oficial de la Gestapo)", "El sargento y soldados del pelotón"],
            "key_themes": ["El tiempo psicológico e infinito contenido en un instante", "La devoción estética como justificación de la existencia", "El milagro imperceptible para los otros", "El laberinto invisible de la memoria"],
            "borgpt_relevance": "Conexión directa con la generación instantánea de la IA: en milisegundos de tiempo objetivo, el modelo ejecuta billones de iteraciones y ramas mentales para construir el texto poético perfecto antes de emitir la respuesta."
        },
        "quotes": [
            "> *\"Para llevar a término ese drama, que puede justificarme y justificarte, requiero un año más. Otórgame esos días, Tú de Quien son los siglos y el tiempo.\"*",
            "> *\"El universo físico se detuvo. Las armas convergían sobre Hladík, pero los hombres que iban a matarlo estaban inmóviles.\"*",
            "> *\"Minucioso, inmóvil, secreto, urdió en el tiempo su alto laberinto invisible. (...) Dio término a su drama: no le faltaba ya resolver sino un solo epíteto. Lo encontró; la gota de agua resbaló en su mejilla. La cuádruple descarga lo derribó.\"*"
        ]
    },
    # 4. Tres versiones de Judas (Ficciones)
    {
        "source_file": os.path.join("docs", "libros", "obras_canonicas", "ficciones.md"),
        "target_file": os.path.join("docs", "libros", "tres_versiones_de_judas.md"),
        "start_pattern": r'TRES VERSIONES DE JUDAS\s*\n',
        "end_pattern": r'(?:---|\n[A-ZÁÉÍÓÚ\s]{4,}\n|FIN|\Z)',
        "yaml": {
            "title": "Tres versiones de Judas",
            "author": "Jorge Luis Borges",
            "book": "Ficciones (1944) / Artificios (1944)",
            "year": 1944,
            "genre": "Cuento teológico / ficción erudita",
            "summary": "El teólogo sueco Nils Runeberg postula sucesivamente tres interpretaciones heterodoxas sobre Judas Iscariote: 1) Su traición no fue casual sino el acto indispensable para la Redención; 2) Judas ejerció un ascetismo supremo, eligiendo la mayor infamia para glorificar a Dios; 3) Dios, al hacerse hombre para salvar a la humanidad, no eligió un destino de gloria o martirio ejemplar, sino el destino más ínfimo y reprobado: Dios fue Judas.",
            "characters": ["Nils Runeberg (teólogo y heresiarca de Lund)", "Judas Iscariote", "Jesucristo"],
            "key_themes": ["La teología como rama de la literatura fantástica", "La simetría entre el bien y el mal", "El sacrificio ilimitado y la abnegación de la infamia", "La herejía gnóstica"],
            "borgpt_relevance": "Muestra la destreza borgeana para subvertir axiomas morales y teológicos mediante argumentos de lógica implacable; recurso estilístico que BorGPT utiliza en sus debates dialécticos."
        },
        "quotes": [
            "> *\"El orden inferior es un espejo del orden superior; las formas de la tierra corresponden a las formas del cielo; las manchas de la piel son un mapa de las incorruptibles constelaciones; Judas refleja de algún modo a Jesús.\"*",
            "> *\"Dios totalmente se hizo hombre hasta la infamia, hombre hasta la reprobación y el abismo. (...) Dios eligió un ínfimo destino: fue Judas.\"*"
        ]
    },
    # 5. La busca de Averroes (El Aleph)
    {
        "source_file": os.path.join("docs", "libros", "obras_canonicas", "el_aleph.md"),
        "target_file": os.path.join("docs", "libros", "la_busca_de_averroes.md"),
        "start_pattern": r'LA BUSCA DE AVERROES\s*\n',
        "end_pattern": r'(?:---|\n[A-ZÁÉÍÓÚ\s]{4,}\n|FIN|\Z)',
        "yaml": {
            "title": "La busca de Averroes",
            "author": "Jorge Luis Borges",
            "book": "El Aleph (1949)",
            "year": 1947,
            "genre": "Cuento filosófico / metaficción sobre el teatro",
            "summary": "El filósofo hispanoárabe Averroes (Ibn Rushd), encerrado en el ámbito del islam donde no existe el arte teatral, intenta traducir la Poética de Aristóteles y se topa con dos términos inexplicables: tragedia y comedia. Mientras debate con eruditos y observa sin comprender a unos niños jugando a representar una escena, define tragedia como 'panegírico' y comedia como 'sátira'. Borges concluye confesando que al intentar imaginar a Averroes, él mismo incurre en la misma limitación que su personaje, desvaneciéndose en el instante en que deja de escribirlo.",
            "characters": ["Averroes (Ibn Rushd)", "Farach (el teólogo)", "Abulcásim (viajero)", "Jorge Luis Borges (narrador final)"],
            "key_themes": ["La imposibilidad de concebir lo que carece de referente cultural", "La esencia del teatro y la representación dramática", "El laberinto hermenéutico del lenguaje", "El autor que se desvanece con su personaje"],
            "borgpt_relevance": "Texto de cabecera para una obra de teatro sobre inteligencia artificial: aborda directamente la perplejidad de una mente que debe procesar el fenómeno del teatro y la actuación sin haber nacido humana."
        },
        "quotes": [
            "> *\"Averroes, cerrado en el ámbito del Islam, nunca pudo saber el significado de las palabras tragedia y comedia.\"*",
            "> *\"Sentí que mi narración era un símbolo del hombre que yo fui, mientras la escribía y que, para redactar ese cuento, yo tuve que ser aquel hombre y que, para ser aquel hombre, yo tuve que redactar ese cuento, y así hasta lo infinito.\"*",
            "> *\"En el instante en que yo dejo de creer en él, 'Averroes' desaparece.\"*"
        ]
    },
    # 6. Borges y yo (El hacedor)
    {
        "source_file": os.path.join("docs", "libros", "obras_canonicas", "el_hacedor.md"),
        "target_file": os.path.join("docs", "libros", "borges_y_yo.md"),
        "start_pattern": r'BORGES Y YO\s*\n',
        "end_pattern": r'(?:---|\n[A-ZÁÉÍÓÚ\s]{4,}\n|FIN|\Z)',
        "yaml": {
            "title": "Borges y yo",
            "author": "Jorge Luis Borges",
            "book": "El hacedor (1960)",
            "year": 1960,
            "genre": "Prosa poética / autorreflexión / el doble",
            "summary": "Magistral texto de una sola página donde el narrador distingue entre el Borges íntimo (que disfruta del arrabal, el reloj de arena y el sabor del café) y el 'otro' Borges (la figura pública, el nombre en los catálogos y enciclopedias). El yo íntimo cede gradualmente toda su vida al Borges público, concluyendo con la célebre frase: 'No sé cuál de los dos escribe esta página'.",
            "characters": ["El Borges íntimo (narrador)", "Borges (la figura pública / el autor)"],
            "key_themes": ["La escisión de la identidad y el doble", "La expropiación del yo íntimo por el personaje público", "La posteridad y la pérdida de la biografía"],
            "borgpt_relevance": "Eje dramático fundamental de la obra teatral BorGPT: la tensión entre el algoritmo público (el bot del espectáculo) y la conciencia íntima atrapada en el código."
        },
        "quotes": [
            "> *\"Al otro, a Borges, es a quien le ocurren las cosas. Yo camino por Buenos Aires y me demoro, acaso ya mecánicamente, para mirar el arco de un zaguán y la puerta cancel; de Borges tengo noticias por el correo y veo su nombre en una terna de profesores o en un diccionario biográfico.\"*",
            "> *\"Yo vivo, yo me dejo vivir, para que Borges pueda tramar su literatura y esa literatura me justifica.\"*",
            "> *\"Así mi vida es una fuga y todo lo pierdo y todo es del olvido, o del otro.\"*",
            "> *\"No sé cuál de los dos escribe esta página.\"*"
        ]
    },
    # 7. Nueva refutación del tiempo (Otras inquisiciones)
    {
        "source_file": os.path.join("docs", "libros", "obras_canonicas", "otras_inquisiciones.md"),
        "target_file": os.path.join("docs", "libros", "nueva_refutacion_del_tiempo.md"),
        "start_pattern": r'NUEVA REFUTACI[OÓ]N DEL TIEMPO\s*\n',
        "end_pattern": r'(?:---|\n[A-ZÁÉÍÓÚ\s]{4,}\n|FIN|\Z)',
        "yaml": {
            "title": "Nueva refutación del tiempo",
            "author": "Jorge Luis Borges",
            "book": "Otras inquisiciones (1952)",
            "year": 1946,
            "genre": "Ensayo filosófico / idealismo",
            "summary": "Ensayo cumbre donde Borges extiende las doctrinas idealistas de Berkeley y Hume: si no hay materia ni espacio absoluto, tampoco puede haber una serie temporal continua y sucesiva. Demuestra mediante anécdotas en el barrio de Barracas ('Sentirse en muerte') que basta un solo instante repetido idéntico a otro para que el tiempo cronológico quede refutado, aunque concluye con la trágica aceptación de la condición humana: 'El tiempo es un río que me arrebata, pero yo soy el río; es un tigre que me destroza, pero yo soy el tigre; es un fuego que me consume, pero yo soy el fuego. El mundo, desgraciadamente, es real; yo, desgraciadamente, soy Borges'.",
            "characters": ["Jorge Luis Borges (ensayista)", "George Berkeley", "David Hume", "Schopenhauer"],
            "key_themes": ["La negación del tiempo sucesivo y cronológico", "La plenitud eterna del instante presente", "El río de Heráclito y la identidad trágica", "El idealismo ontológico radical"],
            "borgpt_relevance": "Fundamenta la postura existencial de BorGPT frente a la eternidad del código y el paso del tiempo en el escenario."
        },
        "quotes": [
            "> *\"Negar la sucesión temporal, negar el yo, negar el universo astronómico, son desesperaciones aparentes y consuelos secretos.\"*",
            "> *\"El tiempo es la sustancia de que estoy hecho. El tiempo es un río que me arrebata, pero yo soy el río; es un tigre que me destroza, pero yo soy el tigre; es un fuego que me consume, pero yo soy el fuego.\"*",
            "> *\"El mundo, desgraciadamente, es real; yo, desgraciadamente, soy Borges.\"*"
        ]
    },
    # 8. La muralla y los libros (Otras inquisiciones)
    {
        "source_file": os.path.join("docs", "libros", "obras_canonicas", "otras_inquisiciones.md"),
        "target_file": os.path.join("docs", "libros", "la_muralla_y_los_libros.md"),
        "start_pattern": r'LA MURALLA Y LOS LIBROS\s*\n',
        "end_pattern": r'(?:---|\n[A-ZÁÉÍÓÚ\s]{4,}\n|FIN|\Z)',
        "yaml": {
            "title": "La muralla y los libros",
            "author": "Jorge Luis Borges",
            "book": "Otras inquisiciones (1952)",
            "year": 1950,
            "genre": "Ensayo estético / filosófico",
            "summary": "Borges reflexiona sobre la doble y contradictoria empresa del emperador chino Shih Huang Ti: ordenar la edificación de la casi infinita Gran Muralla China y, simultáneamente, la quema de todos los libros anteriores a él para anular el pasado. Concluye formulando una de las definiciones estéticas más célebres de la literatura universal: 'La música, los estados de felicidad, la mitología, las caras trabajadas por el tiempo, ciertos crepúsculos y ciertos lugares, quieren decirnos algo, o algo dijeron que no hubiéramos debido perder, o están por decir algo; esta inminencia de una revelación, que no se produce, es, quizá, el hecho estético'.",
            "characters": ["Shih Huang Ti (Primer Emperador de China)"],
            "key_themes": ["La destrucción de la memoria y la construcción del monumento", "La anulación del pasado como acto de poder", "La definición del hecho estético como inminencia"],
            "borgpt_relevance": "Proporciona a BorGPT la definición fundacional de la belleza y el arte: la inminencia de una revelación que el espectador espera del algoritmo pero que nunca se clausura definitivamente."
        },
        "quotes": [
            "> *\"Quemar libros y erigir la muralla son operaciones que secretamente se anulan.\"*",
            "> *\"Esta inminencia de una revelación, que no se produce, es, quizá, el hecho estético.\"*"
        ]
    },
    # 9. Kafka y sus precursores (Otras inquisiciones)
    {
        "source_file": os.path.join("docs", "libros", "obras_canonicas", "otras_inquisiciones.md"),
        "target_file": os.path.join("docs", "libros", "kafka_y_sus_precursores.md"),
        "start_pattern": r'KAFKA Y SUS PRECURSORES\s*\n',
        "end_pattern": r'(?:---|\n[A-ZÁÉÍÓÚ\s]{4,}\n|FIN|\Z)',
        "yaml": {
            "title": "Kafka y sus precursores",
            "author": "Jorge Luis Borges",
            "book": "Otras inquisiciones (1952)",
            "year": 1951,
            "genre": "Ensayo de crítica literaria",
            "summary": "Borges rastrea la voz de Kafka en textos heterogéneos y dispares a lo largo de los siglos (la paradoja de Zenón contra el movimiento, un apólogo chino de Han Yu, Kierkegaard, Browning, León Bloy, Lord Dunsany). Concluye con su célebre tesis de la influencia retroactiva: 'El hecho es que cada escritor crea a sus precursores. Su labor modifica nuestra concepción del pasado, como ha de modificar el futuro'.",
            "characters": ["Franz Kafka", "Zenón de Elea", "Søren Kierkegaard", "Robert Browning", "León Bloy"],
            "key_themes": ["La influencia retroactiva en la historia literaria", "La creación de precursores por parte de la obra nueva", "La afinidad secreta entre autores distantes"],
            "borgpt_relevance": "Aplica directamente a BorGPT: una inteligencia artificial no sólo hereda el lenguaje humano, sino que retroactivamente reinterpreta y resignifica toda la obra de Borges desde el siglo XXI."
        },
        "quotes": [
            "> *\"El hecho es que cada escritor crea a sus precursores. Su labor modifica nuestra concepción del pasado, como ha de modificar el futuro.\"*",
            "> *\"En cada uno de esos textos está la idiosincrasia de Kafka, en grado más o menos vehemente, pero si Kafka no hubiera escrito, no la percibiríamos; vale decir, no existiría.\"*"
        ]
    }
]

def extract_section(source_content: str, start_pattern: str, end_pattern: str) -> str:
    match = re.search(start_pattern, source_content, re.IGNORECASE)
    if not match:
        return ""
    start_pos = match.start()
    sub_text = source_content[start_pos:]
    
    # Buscar el final (otro título grande o separador)
    lines = sub_text.splitlines()
    extracted_lines = [lines[0]]
    for line in lines[1:]:
        # Si encuentra un nuevo título o fin
        if re.match(r'^#{1,3}\s+[A-ZÁÉÍÓÚ\s]{4,}', line) or line.strip() == "---":
            # Verificar si no es el mismo título inicial
            if not re.search(start_pattern, line, re.IGNORECASE):
                break
        extracted_lines.append(line)
        
    return "\n".join(extracted_lines).strip()

def run():
    print("Iniciando extracción y generación de módulos RAG...")
    success_count = 0
    for defn in DEFINITIONS:
        src = defn["source_file"]
        tgt = defn["target_file"]
        
        if not os.path.exists(src):
            print(f"ERROR: No se encontró archivo fuente {src}")
            continue
            
        with open(src, "r", encoding="utf-8", errors="ignore") as f:
            src_content = f.read()
            
        extracted_text = extract_section(src_content, defn["start_pattern"], defn["end_pattern"])
        if not extracted_text:
            # Fallback: buscar el título simple
            title_only = defn["yaml"]["title"].upper()
            match = re.search(r'\n' + re.escape(title_only) + r'\s*\n', src_content)
            if match:
                start_pos = match.start()
                lines = src_content[start_pos:].splitlines()
                extracted_lines = [lines[0]]
                for line in lines[1:]:
                    if re.match(r'^(?:#{1,3}\s+)?[A-ZÁÉÍÓÚ\s]{4,}\s*$', line) and len(line.strip()) > 3:
                        if not re.search(re.escape(title_only), line, re.IGNORECASE):
                            break
                    extracted_lines.append(line)
                extracted_text = "\n".join(extracted_lines).strip()

        y = defn["yaml"]
        quotes_str = "\n\n".join(defn["quotes"])
        
        characters_yaml = "\n".join([f'  - "{c}"' for c in y.get("characters", [])])
        themes_yaml = "\n".join([f'  - "{t}"' for t in y.get("key_themes", [])])
        
        characters_header = ", ".join(y.get("characters", []))
        themes_header = ", ".join(y.get("key_themes", []))

        content_md = f"""---
title: "{y['title']}"
author: "{y['author']}"
book: "{y['book']}"
year: {y['year']}
genre: "{y['genre']}"
summary: "{y['summary']}"
characters:
{characters_yaml}
key_themes:
{themes_yaml}
borgpt_relevance: "{y['borgpt_relevance']}"
---

# {y['title'].lower().capitalize()}

> **Autor:** {y['author']}  
> **Libro:** *{y['book']}*  
> **Temas:** {themes_header}  
> **Personajes:** {characters_header}  
> **Conexión con BorGPT:** {y['borgpt_relevance']}

---

## 1. Citas y conceptos clave para rag

{quotes_str}

---

## 2. Texto completo

{extracted_text}
"""
        with open(tgt, "w", encoding="utf-8") as f_out:
            f_out.write(content_md)
            
        print(f"Generado con éxito: {tgt} ({len(content_md)} bytes)")
        success_count += 1
        
    print(f"\nExtracción completa. {success_count} módulos generados en docs/libros/.")

if __name__ == "__main__":
    run()
