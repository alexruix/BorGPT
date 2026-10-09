# Arquitectura técnica y estrategia de despliegue escénico

> **Proyecto:** BorGPT — Producción teatral e instalación interactiva  
> **Definición de stack:** Gemini API (`.env` con Google API Key) + Base documental Markdown (.md) + Webhooks / WebSockets  
> **Objetivo:** Garantizar estabilidad, baja latencia, control de versiones y sincronización multimedia en tiempo real durante funciones en vivo.

---

## 1. Visión general de la arquitectura

El sistema de **BorGPT** opera como una aplicación autónoma de producción escénica. Se conecta directamente a la **Gemini API** mediante credenciales seguras configuradas en un archivo `.env` local (`GEMINI_API_KEY`), orquestando la lógica conversacional, la recuperación documental en Markdown y la interacción en tiempo real con el hardware y software del teatro.

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                          SISTEMA DE PRODUCCIÓN ESCÉNICA BORGPT                           │
│                                                                                          │
│   ┌───────────────────────────┐                 ┌────────────────────────────────────┐   │
│   │ Repositorio local (.md)   │                 │ Servidor de escena (Node/Python)   │   │
│   │ - docs/libros/            │────────────────►│ - Carga de variables (.env)        │   │
│   │ - docs/entrevistas/       │                 │ - Orquestador de estados de obra   │   │
│   │ - docs/project/           │                 │ - Cliente SDK / Gemini API Key     │   │
│   └───────────────────────────┘                 └─────────────────┬──────────────────┘   │
│                                                                   │                      │
│                    ┌──────────────────────────────────────────────┼─────────────────┐    │
│                    ▼ Webhooks / WebSockets                        ▼ Gemini API      ▼    │
│   ┌─────────────────────────────────────────┐   ┌────────────────────────────────────┐   │
│   │ CONTROL DE ESCENARIO                    │   │ MOTOR COGNITIVO EN VIVO            │   │
│   │ - QLab / OSC (luces, audio y cues)      │   │ - Generación en streaming          │   │
│   │ - Pantalla gigante (TouchDesigner / web)│   │ - Salidas estructuradas (JSON)     │   │
│   │ - Avatar pixelado reactivo              │   │ - Disparadores de efectos          │   │
│   └─────────────────────────────────────────┘   └────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Componentes fundamentales

### 2.1. Configuración de credenciales y entorno (`.env`)
La autenticación con el motor de inteligencia artificial se realiza exclusivamente de forma programática:
- Archivo `.env` en la raíz del proyecto para alojar la clave privada:
  ```env
  GEMINI_API_KEY=AIzaSy...
  GEMINI_MODEL=gemini-2.5-flash
  SERVER_PORT=3000
  QLAB_OSC_PORT=53000
  ```
- Carga segura de variables de entorno sin exponer credenciales en el repositorio.

---

### 2.2. Base de conocimiento versionada en Markdown (`.md`)
Todo el corpus literario, biográfico y contextual de la obra reside directamente en el repositorio:
- **`docs/libros/`**: Cuentos, ensayos, poemas y textos de referencia de Jorge Luis Borges.
- **`docs/entrevistas/`**: Transcripciones de reportajes, conferencias y declaraciones públicas.
- **`docs/project/`**: Guiones (`obra_teatro.md`), diseño de personaje (`borGPT.md`) y especificaciones técnicas.
- **Ventajas:**
  - Control de versiones exhaustivo con Git.
  - Indexación y segmentación (*chunking*) a medida para alimentar el contexto del modelo (RAG local).
  - Facilidad de actualización y edición directa por parte del equipo artístico y técnico.

---

### 2.3. Integración escénica en tiempo real (webhooks, WebSockets y OSC)
BorGPT se integra con el ecosistema técnico del teatro para actuar como un elemento sincronizado:

1. **Recepción de eventos escénicos (inbound webhooks):**
   - El operador técnico, pedales de pie o disparadores escénicos envían señales HTTP al backend:
     `POST /api/stage/cue` con la instrucción del cambio de acto o estímulo actoral.
   - El servidor actualiza el contexto dramático y sincroniza la respuesta.

2. **Disparo de acciones multimedia (outbound webhooks / OSC):**
   - El backend emite comandos hacia **QLab**, **TouchDesigner** o motores visuales web:
     - **Rosco de Pasapalabra:** Marcar letras en verde/rojo y accionar audios de error/acierto.
     - **Proyecciones y memes:** Mostrar imágenes (*Cringe*, Tinder, TikTok) según el flujo del diálogo.
     - **Iluminación:** Conmutar luces LED y efectos estroboscópicos cuando inicia la música electrónica.

3. **Streaming y reactividad visual (WebSockets):**
   - Envío de tokens en streaming a la pantalla principal para animar en tiempo real la boca y ojos del avatar pixelado de Borges mientras habla.

---

### 2.4. Estabilidad y gestión de contingencia en vivo
- **Servidor dedicado en sala:** Ejecución en red local para minimizar latencias de transporte hacia hardware escénico.
- **Estrategia de fallback:** Respuestas prealmacenadas y transiciones pregrabadas ante eventuales fluctuaciones de conectividad externa, asegurando continuidad total de la función.
- **Tiempos de respuesta controlados:** Parámetros de generación optimizados para mantener el ritmo dramático y los silencios teatrales requeridos.

---

## 3. Estructura del repositorio

```
/BorGPT
│
├── .env                       # Variables de entorno y API Key de Gemini
│
├── docs/
│   ├── libros/                # Corpus literario y ensayos (.md)
│   ├── entrevistas/           # Entrevistas y declaraciones (.md)
│   └── project/               # Documentación del proyecto (.md)
│       ├── obra_teatro.md     # Guion de la obra
│       ├── borGPT.md          # Especificación del personaje
│       └── arquitectura_tecnica.md # Arquitectura del sistema
│
├── src/                       # Código fuente de la aplicación
│   ├── agent/                 # Configuración de prompts y cliente Gemini SDK
│   ├── rag/                   # Procesamiento e indexación de archivos .md
│   ├── stage/                 # Control de webhooks, OSC y WebSockets
│   └── server.js/.py          # Servidor principal de producción
```
