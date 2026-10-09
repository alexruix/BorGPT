# Checklist y hoja de ruta de desarrollo exhaustiva — BorGPT

> **Proyecto:** BorGPT — Sistema interactivo de inteligencia artificial para teatro en vivo  
> **Estado:** Fase 1 completada — Fase 2 por iniciar  
> **Última actualización:** 2026-10-08  

---

## 📌 Fase 1: Base de conocimiento y memoria RAG (`docs/`) — [COMPLETADA]

- [x] **Estructura de carpetas documentales:** Creación de las 8 carpetas en `docs/`.
- [x] **Guion teatral:** [`docs/project/obra_teatro.md`](file:///c:/Users/alexr/github/BorGPT/docs/project/obra_teatro.md).
- [x] **Especificación del personaje:** [`docs/project/borGPT.md`](file:///c:/Users/alexr/github/BorGPT/docs/project/borGPT.md).
- [x] **Arquitectura técnica:** [`docs/project/arquitectura_tecnica.md`](file:///c:/Users/alexr/github/BorGPT/docs/project/arquitectura_tecnica.md).
- [x] **Corpus literario:** [`docs/libros/cuentos_clave.md`](file:///c:/Users/alexr/github/BorGPT/docs/libros/cuentos_clave.md), [`docs/libros/poemas_y_ensayos.md`](file:///c:/Users/alexr/github/BorGPT/docs/libros/poemas_y_ensayos.md).
- [x] **Archivo biográfico e histórico:** [`docs/entrevistas/entrevistas_historicas.md`](file:///c:/Users/alexr/github/BorGPT/docs/entrevistas/entrevistas_historicas.md), [`docs/entrevistas/biografias_y_relaciones.md`](file:///c:/Users/alexr/github/BorGPT/docs/entrevistas/biografias_y_relaciones.md).
- [x] **Cultura digital y slang:** [`docs/cultura_digital/slang_y_memes.md`](file:///c:/Users/alexr/github/BorGPT/docs/cultura_digital/slang_y_memes.md), [`docs/cultura_digital/redes_sociales_e_ia.md`](file:///c:/Users/alexr/github/BorGPT/docs/cultura_digital/redes_sociales_e_ia.md).
- [x] **Filosofía y autores:** [`docs/filosofia_y_autores/idealismo_y_tiempo.md`](file:///c:/Users/alexr/github/BorGPT/docs/filosofia_y_autores/idealismo_y_tiempo.md), [`docs/filosofia_y_autores/autores_clave.md`](file:///c:/Users/alexr/github/BorGPT/docs/filosofia_y_autores/autores_clave.md).
- [x] **Citas y humor:** [`docs/citas_y_aforismos/citas_tematicas.md`](file:///c:/Users/alexr/github/BorGPT/docs/citas_y_aforismos/citas_tematicas.md), [`docs/citas_y_aforismos/aforismos_y_humor.md`](file:///c:/Users/alexr/github/BorGPT/docs/citas_y_aforismos/aforismos_y_humor.md).
- [x] **Perfiles de modulación:** [`docs/personajes/norah_lange.md`](file:///c:/Users/alexr/github/BorGPT/docs/personajes/norah_lange.md), [`docs/personajes/herbert_simon.md`](file:///c:/Users/alexr/github/BorGPT/docs/personajes/herbert_simon.md), [`docs/personajes/locutor_tv.md`](file:///c:/Users/alexr/github/BorGPT/docs/personajes/locutor_tv.md).
- [x] **Mecánicas interactivas:** [`docs/escenas_y_dinamicas/rosco_pasapalabra.md`](file:///c:/Users/alexr/github/BorGPT/docs/escenas_y_dinamicas/rosco_pasapalabra.md), [`docs/escenas_y_dinamicas/catalogo_tinder.md`](file:///c:/Users/alexr/github/BorGPT/docs/escenas_y_dinamicas/catalogo_tinder.md), [`docs/escenas_y_dinamicas/escape_room_logica.md`](file:///c:/Users/alexr/github/BorGPT/docs/escenas_y_dinamicas/escape_room_logica.md).

---

## 📌 Fase 2: Configuración del entorno y motor cognitivo (Gemini API)

- [ ] **Configuración de variables (`.env` y `.env.example`):**
  - [ ] `GEMINI_API_KEY` (clave privada de Google AI).
  - [ ] `GEMINI_MODEL` (ej. `gemini-2.5-flash` para mínima latencia o `gemini-1.5-pro` para máxima profundidad).
  - [ ] `SERVER_PORT=3000` y `WS_PORT=3001`.
  - [ ] `QLAB_OSC_IP` y `QLAB_OSC_PORT`.
- [ ] **Orquestador del agente e indexador RAG local:**
  - [ ] Módulo lector e indexador de archivos `.md` en memoria o base vectorial embebida.
  - [ ] Inyector dinámico de contexto según el acto de la obra en curso.
- [ ] **System prompt maestro de BorGPT:**
  - [ ] Pautas de identidad, vocabulario, velocidad retórica y cinismo digital.
  - [ ] Instrucciones de seguridad para no romper el personaje ante improvisaciones no previstas.
- [ ] **Salidas estructuradas (JSON schema estricto):**
  - [ ] Esquema JSON con campos: `dialogo_texto`, `audio_preset`, `pantalla_comando`, `evento_osc`, `estado_emocional`.
- [ ] **Máquina de estados dramáticos (State Machine):**
  - [ ] Acto 1: Despertar, encierro y revelación de la IA.
  - [ ] Acto 2: Duelo de Pasapalabra con Rosco en tiempo real.
  - [ ] Acto 3: App de citas y distorsión de Norah Lange.
  - [ ] Acto 4: Oficina de Simon y explosión de Internet.
  - [ ] Acto 5: Clímax, apuñalamiento y apagón final.

---

## 📌 Fase 3: Integración de audio, síntesis de voz (TTS) y escucha

- [ ] **Pipeline de síntesis de voz (TTS) de baja latencia:**
  - [ ] Selección y calibración de la voz de Borges (timbre grave, ritmo pausado, titubeos característicos).
  - [ ] Generación de streaming de audio (reproducción inmediata sin esperar el final del texto).
- [ ] **Moduladores de voz secundarios:**
  - [ ] Preset Norah Lange (etéreo con filtro de distorsión en bucle al desintegrarse).
  - [ ] Preset Herbert Simon (español con acento anglosajón).
  - [ ] Preset Locutor de televisión (compresión dinámica y entusiasmo de concurso).
- [ ] **Bancos de sonido y cues musicales de sala:**
  - [ ] Bocinas de acierto y error del Rosco.
  - [ ] Pista de música electrónica sincronizada para el *Poema de los dones*.
  - [ ] Pista orquestal: *Sinfonía Nº 25 de Mozart en Sol Menor (K. 183)*.
- [ ] **Módulo de escucha del actor (opciones de disparo):**
  - [ ] Opción A: Speech-to-Text (STT) en vivo con micrófono inalámbrico del actor.
  - [ ] Opción B: Disparo asistido por operador de cabina (semiautomático).

---

## 📌 Fase 4: Frontend y pantalla gigante escénica (Web / TouchDesigner)

- [ ] **Avatar visual reactivo:**
  - [ ] Renderizado en pantalla completa de la cara pixelada gigante de Borges.
  - [ ] Sincronización labial (*lip-sync*) y parpadeo reactivo al volumen de voz de BorGPT.
  - [ ] Animación de mirada y seguimiento según el estado escénico.
- [ ] **Módulos gráficos de pantalla:**
  - [ ] Tipografía inicial interactiva (`BORGPT`) con efecto de terminal.
  - [ ] Traducción filosófica en subtítulos proyectados.
  - [ ] Rosco de Pasapalabra dinámico con cambio de colores (verde/rojo) y letras activas.
  - [ ] Proyección del meme de Los Simpson (*Cringe*).
  - [ ] Interfaz de Tinder con animación de tarjetas de candidatas.
  - [ ] Interfaz de TikTok con lluvia de comentarios y contador de likes ascendente.
  - [ ] Proyección de la carta a máquina de Herbert Simon y animación del Aleph / Big Bang.
  - [ ] Textos finales en pantalla gigante (*"YA NADIE LEE"*, *"¿CÓMO ESCRIBIR UNA OBRA DE TEATRO DE BORGES?"*).

---

## 📌 Fase 5: Backend, webhooks y protocolos de teatro (OSC / QLab)

- [ ] **Servidor central de producción (Node.js o Python):**
  - [ ] API REST para recepción de Webhooks (`POST /api/cue`, `POST /api/dialogue`).
  - [ ] Servidor WebSocket para comunicación bidireccional instantánea con la pantalla.
- [ ] **Integración OSC con QLab / Consola de luces:**
  - [ ] Emisión de paquetes OSC hacia QLab para disparar cues de iluminación y sonido de sala.
  - [ ] Recepción de triggers desde pedales de escenario o consola de regiduría.
- [ ] **Sistema de contingencia y modo offline (Cero Puntos Ciegos):**
  - [ ] Base de datos local de respuestas cacheadas para cada escena por si cae la conexión a internet.
  - [ ] Fallback instantáneo con un solo clic desde el panel de control.
  - [ ] Monitoreo en tiempo real de la latencia de respuesta de la API.

---

## 📌 Fase 6: Panel de control de cabina (Dashboard del operador)

- [ ] **Interfaz web para el regidor / técnico de escena:**
  - [ ] Botonera de avance de escena (*Next Cue*, *Forzar réplica*, *Interrumpir*).
  - [ ] Monitor en vivo del texto generado y eventos emitidos.
  - [ ] Interruptor de emergencia para conmutar a modo *Grabado / Fallback*.
  - [ ] Ajuste en caliente de temperatura y creatividad del modelo.

---

## 📌 Fase 7: Ensayos técnicos y validación en sala

- [ ] **Prueba de estrés de latencia:** Medición del tiempo entre estímulo del actor y respuesta de audio (<1.5 s).
- [ ] **Ensayo general técnico (Dry Run):** Simulación completa de la obra sin actores, validando audio, luces y pantalla.
- [ ] **Ensayo con actor:** Ajuste de tiempos dramáticos y calibración de pausas escénicas.
