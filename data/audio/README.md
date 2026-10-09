# Audio de referencia de Jorge Luis Borges para F5-TTS

Este directorio contiene las muestras de audio de referencia (`.wav`) utilizadas para clonar la voz de **Jorge Luis Borges** en el microservicio de síntesis de voz (`F5-TTS`).

---

## Requisitos del audio de referencia

1. **Duración óptima:** Entre 6 y 12 segundos continuos.
2. **Calidad:** 
   - Formato WAV (mono o estéreo, 22.05 kHz o 24/44.1 kHz).
   - Audio limpio, sin música de fondo, risas superpuestas ni eco excesivo de sala.
3. **Contenido:** Cadencia natural, pausada y característica de Borges (por ejemplo, fragmentos de entrevistas de *A Fondo* con Joaquín Soler Serrano o conferencias en Harvard / Biblioteca Nacional).

---

## Archivo recomendado por defecto

- **Nombre:** `data/audio/borges_reference.wav`
- **Transcripción exacta (`ref_text`):**
  > *"El universo, que otros llaman la biblioteca, se compone de un número indefinido y tal vez infinito de galerías hexagonales."*

---

## Cómo cargarlo en Google Colab

1. Al abrir el notebook [`notebooks/BorGPT_F5_TTS_Server.ipynb`](../../notebooks/BorGPT_F5_TTS_Server.ipynb) en Colab, arrastra tu archivo `borges_reference.wav` a la barra lateral izquierda (panel de archivos).
2. Si no tienes un audio propio a mano, el notebook descargará automáticamente un fragmento público pre-procesado de entrevista de Borges listo para usar.
