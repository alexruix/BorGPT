# Checklist y hoja de ruta de desarrollo exhaustiva — BorGPT

> **Proyecto:** BorGPT — Sistema interactivo de inteligencia artificial para teatro en vivo  
> **Estado:** Fases 1, 2, 3 (TTS base) y 6 (Dashboard de cabina) operativas — Fases 4 (Pantalla y Avatar) y 5 (OSC/QLab) en curso  
> **Última actualización:** 2026-10-08  

---

## 📌 Fase 1: Base de conocimiento y memoria RAG (`docs/` y `data/corpus/`) — [COMPLETADA]

- [x] **Estructura de carpetas documentales:** Creación de las 8 carpetas en `docs/`.
- [x] **Guion teatral:** [`docs/project/obra_teatro.md`](file:///c:/Users/alexr/github/BorGPT/docs/project/obra_teatro.md).
- [x] **Especificación del personaje:** [`docs/project/borGPT.md`](file:///c:/Users/alexr/github/BorGPT/docs/project/borGPT.md).
- [x] **Directivas anti-caricatura y voz:** [`docs/project/reglas_personalidad_y_prompt.md`](file:///c:/Users/alexr/github/BorGPT/docs/project/reglas_personalidad_y_prompt.md).
- [x] **Corpus literario canónico (18 libros):** Obras completas 1923-1972, *Siete noches*, *El libro de arena*, *La cifra*, etc.
- [x] **Diarios completos de Bioy Casares (1931-1989):** Extracción y optimización cronológica de 3.953 páginas en [`data/corpus/borges_bioy/borges_bioy_optimizado.md`](file:///c:/Users/alexr/github/BorGPT/data/corpus/borges_bioy/borges_bioy_optimizado.md).
- [x] **Archivo biográfico e histórico oral:** Entrevistas íntegras de RTVE 1976 y 1980 (Soler Serrano), Antonio Carrizo (1984), México (1973), etc.
- [x] **Fobias, manías y aversiones:** [`docs/filosofia_y_autores/fobias_aversiones_y_obsesiones.md`](file:///c:/Users/alexr/github/BorGPT/docs/filosofia_y_autores/fobias_aversiones_y_obsesiones.md) (Fútbol/Mundial 78, espejos de Serrano, cópula, anarquismo spenceriano).
- [x] **Perfiles de modulación:** [`docs/personajes/norah_lange.md`](file:///c:/Users/alexr/github/BorGPT/docs/personajes/norah_lange.md), [`docs/personajes/herbert_simon.md`](file:///c:/Users/alexr/github/BorGPT/docs/personajes/herbert_simon.md), [`docs/personajes/locutor_tv.md`](file:///c:/Users/alexr/github/BorGPT/docs/personajes/locutor_tv.md).

---

## 📌 Fase 2: Configuración del entorno y motor cognitivo (Gemini 2.0 Flash) — [COMPLETADA]

- [x] **Configuración de variables (`.env` y `.env.example`):**
  - [x] `GEMINI_API_KEY`, `GEMINI_MODEL=gemini-2.0-flash`, `CACHE_TTL_HOURS=24`, `SERVER_HOST=0.0.0.0`, `SERVER_PORT=8000`.
- [x] **Orquestador del agente y Gemini Context Caching:**
  - [x] [`src/cache_manager.py`](file:///c:/Users/alexr/github/BorGPT/src/cache_manager.py): Unificación automática de Obras Completas + Diarios de Bioy Casares + `docs/`.
  - [x] Detección y reutilización de caché activo en la nube de Google para arranque instantáneo (0,1s).
- [x] **System prompt maestro y modos de conciencia:**
  - [x] Directivas de longitud adaptativa, simetría verbal, titubeo ciego y crueldad digital.
  - [x] Modos teatrales dinámicos: *Cotidiano*, *Norah Lange*, *Metafísico*, *Glitch de Muerte*.
- [x] **Optimización de tokens y recursos:**
  - [x] Ventana deslizante de diálogo (`max_dialogue_turns = 10`).
  - [x] Límite dinámico de tokens de salida por modo (`250 - 450 tokens`).

---

## 📌 Fase 3: Integración de audio y síntesis de voz (TTS) — [EN GRAN PARTE COMPLETADA]

- [x] **Pipeline dual de síntesis de voz (TTS) de baja latencia:**
  - [x] [`src/tts_engine.py`](file:///c:/Users/alexr/github/BorGPT/src/tts_engine.py): Motor dual con soporte de clonación local (F5-TTS) y fallback de alta disponibilidad gratuito (Edge-TTS `es-AR-TomasNeural` calibrado a -12% velocidad y -4Hz de tono).
  - [x] Streaming de audio en Base64 por WebSocket directo al navegador.
- [ ] **Moduladores de voz secundarios específicos:**
  - [ ] Preset Herbert Simon (español con acento anglosajón).
  - [ ] Preset Locutor de televisión (compresión dinámica para Pasapalabra).
- [ ] **Bancos de sonido y cues musicales de sala:**
  - [ ] Bocinas de acierto y error del Rosco.
  - [ ] Pista electrónica sincronizada para el *Poema de los dones*.

---

## 📌 Fase 4: Frontend y pantalla gigante escénica (Web / TouchDesigner) — [PENDIENTE]

- [ ] **Avatar visual reactivo:**
  - [ ] Renderizado de la cara pixelada gigante de Borges con sincronización labial (*lip-sync*) y parpadeo reactivo.
- [ ] **Módulos gráficos de pantalla:**
  - [ ] Rosco de Pasapalabra dinámico con cambio de colores (verde/rojo).
  - [ ] Interfaz de Tinder teatral y lluvia de likes de TikTok.
  - [ ] Animación de la carta de Herbert Simon y explosión del Aleph.

---

## 📌 Fase 5: Backend y protocolos de teatro (OSC / QLab) — [EN CURSO]

- [x] **Servidor central FastAPI + WebSockets:**
  - [x] [`src/server.py`](file:///c:/Users/alexr/github/BorGPT/src/server.py): Endpoints REST `/api/chat`, streaming en tiempo real en `/ws/stage` y health check `/health`.
- [ ] **Emisión OSC para QLab y luces:**
  - [ ] Disparo de cues OSC hacia consolas de luces y sonido de sala.

---

## 📌 Fase 6: Panel de control de cabina (Dashboard del operador) — [COMPLETADA]

- [x] **Consola web para el regidor de escena:**
  - [x] [`src/static/dashboard.html`](file:///c:/Users/alexr/github/BorGPT/src/static/dashboard.html): Interfaz oscura para cabina con tipografías clásicas.
  - [x] Selector de modos de conciencia en 1 clic (*Cotidiano*, *Norah Lange*, *Metafísico*, *Glitch*).
  - [x] Disparadores rápidos de escenas (Fútbol, Espejos, Norah, Máquina, Muerte).
  - [x] Inyección de apuntes secretos invisibles desde cabina.
  - [x] Interruptor y reproductor de audio integrado para parlantes de cabina o sala.

---

## 📌 Fase 7: Ensayos técnicos y validación en sala — [PRÓXIMO PASO]

- [ ] **Prueba de estrés de latencia:** Medición del tiempo entre réplica y audio en vivo (<500 ms).
- [ ] **Ensayo general técnico (Dry Run):** Simulación completa de las escenas con el dashboard.
