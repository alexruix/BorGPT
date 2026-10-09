# Checklist y hoja de ruta de desarrollo exhaustiva — BorGPT

> **Proyecto:** BorGPT — Sistema interactivo de inteligencia artificial para teatro en vivo  
> **Estado:** Fases 1, 2, 3 (TTS calibrado por fases) y 6 (Consola moderna React/Vite con SSOT y locus de control) completadas  
> **Última actualización:** 2026-10-09  

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

## 📌 Fase 2: Configuración del entorno y motor cognitivo (Gemini 2.0 Flash en TypeScript) — [COMPLETADA]

- [x] **Configuración de variables (`.env` y `.env.example`):**
  - [x] `GEMINI_API_KEY`, `GEMINI_MODEL=gemini-2.0-flash`, `CACHE_TTL_HOURS=24`, `SERVER_HOST=0.0.0.0`, `SERVER_PORT=8000`.
- [x] **Orquestador Enterprise en TypeScript y Gemini Context Caching:**
  - [x] [`server/src/cacheManager.ts`](file:///c:/Users/alexr/github/BorGPT/server/src/cacheManager.ts): Unificación automática de Obras Completas + Diarios de Bioy Casares + `docs/` con el SDK oficial `@google/genai`.
  - [x] Detección y reutilización de caché activo en la nube de Google para arranque instantáneo (0,1s).
- [x] **System prompt maestro y modos de conciencia:**
  - [x] Directivas de longitud adaptativa, simetría verbal, titubeo ciego y crueldad digital.
  - [x] Modos teatrales dinámicos: *1. Asistente omnisciente*, *2. Duelo de jerga y Pasapalabra*, *3. Desglose de sombras y amores*, *4. Parricidio y colapso*.
- [x] **Optimización de tokens y recursos:**
  - [x] Ventana deslizante de diálogo (`max_dialogue_turns = 30`).
  - [x] Límite dinámico de tokens de salida por modo (`300 - 350 tokens`).

---

## 📌 Fase 3: Integración de audio y síntesis de voz (TTS) — [COMPLETADA]

- [x] **Pipeline de síntesis de voz (TTS) de baja latencia:**
  - [x] Síntesis en cliente y servidor con modulación por fase teatral directamente desde el SSOT (`data/theatre_script_ssot.json`).
  - [x] Modulación dinámica de velocidad (`-10%` a `+25%`) y tono (`-4Hz` a `+8Hz`) según intensidad dramática.
  - [x] Streaming de audio en Base64 por WebSocket directo al navegador con pre-buffering.
  - [x] Decodificación y cola de reproducción de audio desacoplada en [`web/src/hooks/useStageAudio.ts`](file:///c:/Users/alexr/github/BorGPT/web/src/hooks/useStageAudio.ts).

---

## 📌 Fase 4: Frontend y consola de regiduría de cabina (React / Vite) — [COMPLETADA]

- [x] **Consola profesional SPA en `web/`:**
  - [x] Arquitectura de Atomic Design pura (`atoms`, `molecules`, `organisms`, `pages`).
  - [x] Design System *Made in Argentina* (70% Noche Porteña, 20% Albiceleste/San Martín, 10% Sol de Mayo) con fileteado porteño y ribbon de la Selección.
  - [x] Accesibilidad A11Y (WCAG 2.1 AA/AAA) con soporte total de teclado y *prefers-reduced-motion*.
  - [x] Principios de Gestalt y heurísticas en la barra unificada de pie de escena.
  - [x] Locus de control absoluto con modo *Retener antes de emitir* (`Hold to release`) activo por defecto y atajo de disparo por barra espaciadora.
  - [x] Botón de pánico y corte inmediato de voz (`ESC`).
  - [x] Guía interactiva modal de atajos de cabina (`?`).

---

## 📌 Fase 5: Backend Enterprise TypeScript, WebSockets y resiliencia — [COMPLETADA]

- [x] **Servidor central Node.js / TypeScript + WebSockets:**
  - [x] [`server/src/server.ts`](file:///c:/Users/alexr/github/BorGPT/server/src/server.ts): Streaming en tiempo real en `/ws/stage` y health check `/health`.
- [x] **Sistema de resiliencia y fallback offline:**
  - [x] [`server/src/fallback.ts`](file:///c:/Users/alexr/github/BorGPT/server/src/fallback.ts): Banco de respuestas de contingencia categorizadas por temática ante fallas de red.
- [x] **Pirámide de testing automatizada (Vitest + Fast-Check):**
  - [x] Unit tests, Fuzzy property tests (800 iteraciones) e integración de WebSocket en `< 70 ms`.

---

## 📌 Fase 6: Ensayos técnicos y validación en sala — [PRÓXIMO PASO]

- [ ] **Medición de latencia en sala:** Medición del tiempo de respuesta y emisión de audio (<500 ms con pre-buffering).
- [ ] **Ensayo general técnico con actor (Dry run):** Simulación completa de las 4 fases de la obra con el regidor en cabina.
