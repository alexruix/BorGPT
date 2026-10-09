# Protocolo y arquitectura de ejecución en vivo de BorGPT

> **Documento de especificación operativa y técnica**  
> **Propósito:** Definir el funcionamiento en tiempo real de **BorGPT** durante las funciones teatrales en vivo: captura de audio, detección de turnos de diálogo, modos de interacción, sincronización multimedia y plan de contingencia (fallback).

---

## 1. Visión general del ecosistema en vivo

Durante la función, **BorGPT** opera como un actor digital reactivo proyectado en la pantalla gigante del escenario. Para garantizar un ritmo dramático fluido sin interrupciones involuntarias, el sistema implementa una **arquitectura híbrida semisuperevisada**:

```mermaid
flowchart TD
    subgraph Escenario["Escenario y Actores"]
        Mic["Micrófono de escena (Actor / Público)"]
        Pedal["Pedal de pie / Botón de escena"]
    end

    subgraph Cabina["Cabina de Control (Servidor Local)"]
        STT["Speech-to-Text (Whisper / Web Speech API)"]
        Dashboard["Dashboard del Operador Técnico"]
        Orquestador["Orquestador Backend (FastAPI / Node.js)"]
    end

    subgraph Cerebro["Motor Cognitivo y RAG"]
        RAG["Base de conocimiento (docs/ & data/)"]
        LLM["Gemini 2.5 Flash / Pro (API)"]
    end

    subgraph Salida["Salidas Multimedia del Teatro"]
        TTS["Síntesis de voz (TTS clonado)"]
        Pantalla["Pantalla gigante (Avatar pixelado reactivo)"]
        QLab["QLab / OSC (Luces, audio FX y rosco)"]
    end

    Mic -->|Audio en vivo| STT
    STT -->|Texto transcrito| Orquestador
    Pedal -->|Señal de turno / Cue| Orquestador
    Dashboard -->|Control de escena / Override| Orquestador

    Orquestador -->|Prompt + Contexto RAG| LLM
    RAG -->|Recuperación documental| LLM
    LLM -->|Texto generado en streaming| Orquestador

    Orquestador -->|Audio sintetizado| TTS
    Orquestador -->|WebSocket streaming (Lip-sync)| Pantalla
    Orquestador -->|Comandos OSC| QLab
```

---

## 2. Mecanismo de escucha y detección de turnos («Gatekeeper»)

Para evitar que el micrófono abierto confunda ruidos del público o pausas dramáticas con intervenciones:

### 2.1. El disparador de turno (Trigger / Cue)
1. **Transcripción continua pasiva:** El micrófono de escena alimenta un buffer local de Speech-to-Text (STT) que transcribe el texto en segundo plano sin accionar respuestas inmediatas.
2. **Habilitación de réplica (Gatekeeper):**
   - **Opción A (Pedal escénico):** La actriz o el actor pisa un pedal inalámbrico de bajo perfil al concluir su parlamento.
   - **Opción B (Operador de cabina):** El operador técnico presiona la barra espaciadora en el Dashboard al escuchar el «pie» del guion.
   - **Opción C (Detección de silencio VAD):** En momentos de interacción abierta con el público, el sistema detecta una pausa de 800 ms tras una pregunta y abre automáticamente el turno de respuesta de BorGPT.

---

## 3. Modos de operación escénica

El sistema alterna entre 3 modos según el momento de la obra:

| Modo de escena | Tipo de interacción | Lógica de procesamiento |
| :--- | :--- | :--- |
| **1. Modo Guiado / Guion teatral** | Diálogo estructurado con Borges o la actriz. | El orquestador inyecta la escena actual de [`obra_teatro.md`](file:///c:/Users/alexr/github/BorGPT/docs/project/obra_teatro.md) como contexto inmediato. BorGPT sigue los hitos del guion, pero formula sus réplicas con cadencia oral natural e improvisación leve. |
| **2. Modo RAG puro / Interacción con el público** | Preguntas libres del público a la IA. | El sistema capta la pregunta, consulta la base de datos documental (`docs/libros/`, `docs/entrevistas/`, `docs/cultura_digital/`) y responde con total autonomía borgeana y humor crítico. |
| **3. Modo Juego / Máquina de estados** | *Pasapalabra*, *Escape room* o *Tinder*. | El backend opera como validador de reglas lógicas. Si la respuesta coincide con [`rosco_pasapalabra.md`](file:///c:/Users/alexr/github/BorGPT/docs/escenas_y_dinamicas/rosco_pasapalabra.md), actualiza los colores en pantalla y dispara el sonido de acierto vía OSC a QLab. |

---

## 4. Dashboard de control del operador técnico

Una interfaz web ligera (accesible en la red local del teatro) permite al operador supervisar y gobernar la función:

### 4.1. Funcionalidades del Dashboard
1. **Selector de escena:** Botones directos para saltar a cualquier punto de la obra (*Escena 1: Prólogo*, *Escena 4: El Rosco*, *Escena 7: La llamada de Lundkvist*).
2. **Selector de personaje / Modulación vocal:**
   - `[Borges Clásico]` $\rightarrow$ Voz pausada, sabia y vacilante.
   - `[BorGPT Omnisciente]` $\rightarrow$ Voz nítida, procesada y con datación quirúrgica.
   - `[Locutor TV]` $\rightarrow$ Voz estridente y comercial con música de fondo.
   - `[Norah Lange]` $\rightarrow$ Voz etérea y nostálgica con eco.
   - `[Herbert Simon]` $\rightarrow$ Voz formal anglosajona cibernética.
3. **Monitor de respuesta previa:** Visualización del texto generado con 500 ms de margen antes de la reproducción de audio.
4. **Botonera de efectos OSC:** Disparar aplausos, risas enlatadas, sonido de fallo/acierto del rosco o conmutación de luces estroboscópicas.

---

## 5. Protocolo de contingencia y modo offline (Fallback)

Si durante la función ocurre una desconexión a Internet o una latencia anormal en la API de Gemini:

### 5.1. Detección automática de timeout (2.0 segundos)
Si la llamada a la nube supera los 2000 ms, el sistema commuta automáticamente al **Modo Contingencia Local**.

### 5.2. Respuestas de amortiguación dramática (Buffer responses)
El servidor local reproduce un audio prealmacenado con el tono borgeano mientras reconecta en segundo plano:
- *«Caramba... he perdido por un instante el hilo de este laberinto. Repítame su frase, si es tan amable...»*
- *«El tiempo, como decía San Agustín, fluye de un modo misterioso en esta sala...»*
- *«Mire usted, una falla en la red es apenas otra forma de la perplejidad...»*

### 5.3. Botón de pánico del operador
El operador puede pulsar `[Disparar Parlamente Oficial]` para forzar la reproducción de los audios canónicos grabados de la obra, manteniendo la ilusión escénica sin romper la experiencia del espectador.
