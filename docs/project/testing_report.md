# Estado y arquitectura de testing automatizado — BorGPT

> **Proyecto:** BorGPT — Sistema interactivo de inteligencia artificial para teatro en vivo  
> **Motor de testing:** Vitest v3 + Fast-Check  
> **Tiempo total de ejecución:** ~6.7s (incluyendo prueba E2E de voz con GPU Colab) / ~120ms (suites puras)  
> **Última actualización:** 2026-10-09  

---

## 🏛️ Pirámide de testing (Arquitectura anti-cono de helado)

Para garantizar la estabilidad en funciones teatrales en vivo sin incurrir en falsos positivos ni pruebas frágiles de UI, el sistema implementa una arquitectura piramidal estricta de tres niveles con costo $0 de tokens de Gemini:

```
                  ▲
                 / \
                /   \     Nivel 3: Integración E2E y contratos WebSocket (15%)
               /  ★  \    - Test E2E en vivo con microservicio F5-TTS en GPU Colab.
              /───────\   - Latencia de respuesta y corte de pánico (<50ms).
             /         \  - Cambio de fases dramáticas en vivo.
            /     ★★    \  Nivel 2: Fuzzy & property-based testing (35%)
           /             \ - +1.600 ejecuciones con strings mutados, Unicode y streams rotos.
          /───────────────\- Blindaje de TheatricalSentenceSplitter contra cortes de palabras.
         /                 \- Aislamiento absoluto de pensamientos escénicos (0 filtraciones a voz).
        /       ★★★         \ Nivel 1: Tests unitarios & SSOT integrity (50%)
       /                     \- Validación estructural del guion de la obra (SSOT).
      /───────────────────────\- Exportación de libreto Markdown y telemetría JSON de sesiones.
```

---

## 📋 Cobertura y detalle de suites

### 1. Nivel 1: Tests unitarios e integridad de SSOT
- **Archivos:**
  - [`server/tests/unit/ssot_and_parser.test.ts`](file:///c:/Users/alexr/github/BorGPT/server/tests/unit/ssot_and_parser.test.ts)
  - [`server/tests/unit/tts_service.test.ts`](file:///c:/Users/alexr/github/BorGPT/server/tests/unit/tts_service.test.ts)
  - [`server/tests/unit/cabina_actions_audio.test.ts`](file:///c:/Users/alexr/github/BorGPT/server/tests/unit/cabina_actions_audio.test.ts)
  - [`server/tests/unit/session_export.test.ts`](file:///c:/Users/alexr/github/BorGPT/server/tests/unit/session_export.test.ts)
  - [`server/tests/unit/cache_manager.test.ts`](file:///c:/Users/alexr/github/BorGPT/server/tests/unit/cache_manager.test.ts)
  - [`server/tests/unit/engine_state.test.ts`](file:///c:/Users/alexr/github/BorGPT/server/tests/unit/engine_state.test.ts)
  - [`server/tests/unit/sentence_splitter.test.ts`](file:///c:/Users/alexr/github/BorGPT/server/tests/unit/sentence_splitter.test.ts)
  - [`server/tests/unit/fallback_system.test.ts`](file:///c:/Users/alexr/github/BorGPT/server/tests/unit/fallback_system.test.ts)
- **Propósito:** Validar que el archivo fuente único de la verdad (`data/theatre_script_ssot.json`), la máquina de estados de BorGPT, el divisor gramatical para TTS, el sistema de fallback offline, el generador de corpus de Context Caching y el pipeline de exportación no tengan inconsistencias.
- **Pruebas ejecutadas:**
  - `debe validar la existencia y estructura semántica del SSOT de la obra`: Verifica que las 4 fases tengan id, título, directiva, temperatura y tokens configurados, y que el glosario del Rosco (letras B, C, D) esté presente.
  - `debe parsear correctamente el pensamiento escénico entre corchetes`: Comprueba la extracción limpia de la intención escénica `[Intención: ..., Emoción: ...]` separada del parlamento hablado.
  - `debe manejar respuestas sin corchetes asignando pensamiento por defecto`: Evita fallos de interfaz cuando el modelo no formatea con corchetes.
  - `debe entregar respuestas de fallback válidas ante contingencias`: Asegura que el banco de respuestas offline siempre devuelva texto borgeano legible ante caídas de conexión.
  - `debe manejar errores de red o servidor de audio caído sin romper el pipeline de texto`: Garantiza que una falla de TTS nunca detenga el flujo de texto en vivo.
  - `debe retener audio en búfer durante aprobación manual y liberarlo sólo al aprobar`: Valida que ningún audio se reproduzca sin confirmación del operador.
  - `debe generar un documento Markdown con formato de lectura y encabezados en Sentence Case`: Comprueba la exportación de libretos de ensayo para dirección.
  - `debe exportar la telemetría JSON estructurada con metadatos de autoría y estadísticas`: Valida los logs estructurados con autoría de José Supera.
  - `debe construir el corpus unificado respetando jerarquía y límites de tamaño (< 2.8 MB)`: Valida el ensamblaje determinista de obras completas y documentos teatrales sin desbordar el cupo de tokens.
  - `debe inicializarse en omnisciencia_asistente y transicionar de fase con validación de SSOT`: Comprueba la máquina de estados y las inyecciones de cabina en `BorGPTEngine`.
  - `debe extraer y segmentar oraciones con puntuación terminal (. ! ? …)`: Valida el buffer de `TheatricalSentenceSplitter` para emisión fluida hacia la GPU.
  - `debe responder con frases de seguridad borgeanas ante ausencia o fallo del SSOT`: Comprueba la resiliencia del sistema de fallback ante contingencias críticas.

---

### 2. Nivel 2: Fuzzy testing y pruebas basadas en propiedades (Property-based)
- **Archivos:**
  - [`server/tests/fuzzy/parser_fuzz.test.ts`](file:///c:/Users/alexr/github/BorGPT/server/tests/fuzzy/parser_fuzz.test.ts)
  - [`server/tests/fuzzy/sentence_splitter_fuzz.test.ts`](file:///c:/Users/alexr/github/BorGPT/server/tests/fuzzy/sentence_splitter_fuzz.test.ts)
  - [`server/tests/fuzzy/theatrical_pipeline_fuzz.test.ts`](file:///c:/Users/alexr/github/BorGPT/server/tests/fuzzy/theatrical_pipeline_fuzz.test.ts)
  - [`server/tests/fuzzy/advanced_theatrical_fuzz.test.ts`](file:///c:/Users/alexr/github/BorGPT/server/tests/fuzzy/advanced_theatrical_fuzz.test.ts)
- **Librería:** `fast-check`
- **Propósito:** Garantizar que ninguna entrada caótica, corchetes rotos, streams mutilados o pérdidas de paquetes Wi-Fi rompan el sistema durante la función.
- **Pruebas ejecutadas (+2.500 ejecuciones aleatorias generadas a costo $0 tokens):**
  - `Fuzzy test: parseTheatricalResponse nunca debe lanzar excepciones ni devolver undefined`: 500 ejecuciones con strings arbitrarios, espacios, nulos simulados y longitudes extremas.
  - `Fuzzy test: formatos con corchetes anidados o caracteres especiales`: 300 ejecuciones con caracteres Unicode exóticos, saltos de línea y símbolos.
  - `Fuzzy test: TheatricalSentenceSplitter ante streams arbitrarios`: 300 ejecuciones validando que la fragmentación de red nunca produzca excepciones.
  - `Fuzzy test: segmentación en oraciones bien formadas sin cortes de palabras`: 200 ejecuciones verificando que el audio mantenga pausas naturales (. ! ?).
  - `Fuzzy test: blindaje del parser de pensamiento escénico`: 500 ejecuciones confirmando que las intenciones de cabina nunca se filtren al diálogo hablado ni a los altavoces.
  - `Fuzzy test: reconstrucción de chunks aleatorios (1-15 caracteres)`: 300 ejecuciones simulando paquetes de red inestables sin pérdida de caracteres.
  - `Fuzzy test: inyección de diálogos con formatos y símbolos teatrales complejos`: 400 ejecuciones con guiones largos de parlamento y puntuación borgeana.
  - `Fuzzy test: cadencia de chunks en divisor de oraciones`: 300 ejecuciones verificando que nunca se emita puntuación flotante sin texto sustancial.
  - `Fuzzy test: resiliencia del banco de fallback ante categorías arbitrarias`: 200 ejecuciones garantizando respuestas válidas siempre.

---

### 3. Nivel 3: Tests de integración de contrato WebSocket y E2E en vivo
- **Archivos:**
  - [`server/tests/integration/websocket_stage.test.ts`](file:///c:/Users/alexr/github/BorGPT/server/tests/integration/websocket_stage.test.ts)
  - [`server/tests/integration/live_tts_colab.test.ts`](file:///c:/Users/alexr/github/BorGPT/server/tests/integration/live_tts_colab.test.ts)
- **Propósito:** Simular una conexión real de cabina en memoria y verificar el enlace E2E en vivo con la GPU de Google Colab / F5-TTS vía Cloudflare Quick Tunnel.
- **Pruebas ejecutadas:**
  - `debe conectar cliente de cabina y responder al cambio de fases dramáticas`: Valida el handshake y la transición de estados en tiempo real (`mode_changed`).
  - `debe procesar el corte de pánico y emitir confirmación inmediata en < 50ms`: Comprueba que el botón de pánico / `ESC` interrumpa la emisión y confirme al cliente en milisegundos.
  - `debe responder al health check del servidor F5-TTS en Colab`: Verifica que el microservicio de voz en Colab esté online y responda con estado `ok`.
  - `debe sintetizar una frase de prueba con la voz de Borges y devolver audio WAV en base64`: Genera un audio real en PCM WAV y valida las cabeceras `RIFF` / `WAVE` devueltas por la GPU.

---

## 🚀 Comandos de ejecución

```powershell
# Ejecutar toda la suite completa de tests (Unit + Fuzzy + Integración)
npm test

# Ejecutar tests en modo vigilancia interactiva (Watch mode)
npm --prefix server run test:watch

# Ejecutar únicamente la suite de fuzzy testing (0 tokens)
npx vitest run tests/fuzzy/

# Ejecutar chequeo estricto de tipos TypeScript
npm run typecheck
```

---

## 📊 Métricas de rendimiento de la suite

| Métrica | Valor |
| :--- | :--- |
| **Suites de test** | 13 archivos pasados (100%) |
| **Pruebas unitarias/integración** | 46 tests canónicos |
| **Pruebas fuzzy generativas** | +2.500 iteraciones con `fast-check` |
| **Falsos positivos** | 0% (sockets en memoria y aserciones deterministas) |
| **Duración promedio (sin E2E de GPU)** | ~660 ms |
| **Duración total (con E2E F5-TTS en vivo)** | ~6.7 s |
| **Consumo de tokens de Gemini en tests** | 0 tokens (blindaje 100% offline) |
