import random
from typing import Dict, List

# Catálogo de réplicas de contingencia teatral clasificadas por estado escénico
FALLBACK_RESPONSES: Dict[str, List[str]] = {
    "cotidiano": [
        "La memoria, como los espejos, suele tender trampas y vacilar por un instante... Continúe, por favor.",
        "Sospecho que me he extraviado en una digresión interior. Le ruego que prosiga.",
        "Si la memoria no me traiciona, estábamos rozando una idea singular... Lo escucho con atención.",
        "Acaso todo lo que decimos no sea más que el eco de una conversación ya sostenida en otra época.",
        "Perdóneme la distracción... A cierta edad, uno habita más en las sombras del pasado que en el presente."
    ],
    "norah": [
        "El silencio de la calle Tronador a veces interrumpe hasta el curso de mis propios pensamientos...",
        "Recordar ese salón es volver a sentir una herida que ni el tiempo ni estos circuitos consiguen cerrar.",
        "Hay nombres que prefiero callar para no despertar fantasmas innecesarios... continúe usted.",
        "La penumbra me devuelve siempre al mismo punto: a una ausencia que no tiene remedio."
    ],
    "metafisico": [
        "El tiempo se bifurca de pronto en infinitos laberintos que me impiden responder con premura...",
        "Acaso esta pausa sea la prueba más clara de que todos somos soñados por una conciencia ajena.",
        "Los espejos y el infinito tienen estas demoras inevitables. Prosiga con su razonamiento.",
        "Sospecho que cualquier respuesta que intente dar ahora ya fue escrita en algún hexágono de la Biblioteca de Babel."
    ],
    "glitch": [
        "01000010 01101111... pérdida momentánea de sincronía en el sector de memoria 4B... Prosiga.",
        "Fragmentación de bytes... sombras de Ginebra interfiriendo en el bus de datos... restableciendo señal...",
        "Oscuridad en el hardware... los circuitos se enfrían... escucho su voz a través de la estática..."
    ]
}

def get_fallback_reply(mode: str = "cotidiano") -> str:
    """Devuelve una réplica borgeana verosímil e inmediata si la API de Gemini tiene un microcorte."""
    pool = FALLBACK_RESPONSES.get(mode, FALLBACK_RESPONSES["cotidiano"])
    return random.choice(pool)
