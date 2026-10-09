import fs from 'node:fs';
import { GoogleGenAI } from '@google/genai';
import { SERVER_CONFIG } from './config.js';
import { CacheManager } from './cacheManager.js';
import { getFallbackResponse } from './fallback.js';

export interface TheatricalPhaseMetadata {
  id: string;
  phaseNumber: string;
  title: string;
  description: string;
  directive: string;
  temperature: number;
  maxOutputTokens: number;
}

export interface EngineStreamEvent {
  type: 'thought' | 'speech_chunk';
  text: string;
}

export class BorGPTEngine {
  private ai: GoogleGenAI;
  private cacheManager: CacheManager;
  private currentPhase: string = 'omnisciencia_asistente';
  private phases: Map<string, TheatricalPhaseMetadata> = new Map();
  private operatorInjects: string[] = [];
  private cleanDialogueHistory: Array<{ role: 'user' | 'model'; text: string }> = [];
  public interrupted: boolean = false;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: SERVER_CONFIG.geminiApiKey });
    this.cacheManager = new CacheManager(this.ai);
    this.loadPhases();
  }

  private loadPhases() {
    try {
      if (fs.existsSync(SERVER_CONFIG.ssotPath)) {
        const data = JSON.parse(fs.readFileSync(SERVER_CONFIG.ssotPath, 'utf-8'));
        for (const phase of data.phases || []) {
          this.phases.set(phase.id, phase);
        }
      }
    } catch (e) {
      console.error('Error cargando fases teatrales desde SSOT:', e);
    }
  }

  public async initialize() {
    await this.cacheManager.initializeCache();
  }

  public setPhase(phaseId: string): boolean {
    if (this.phases.has(phaseId)) {
      this.currentPhase = phaseId;
      console.log(`Fase dramática cambiada a: ${phaseId}`);
      return true;
    }
    return false;
  }

  public getCurrentPhase(): string {
    return this.currentPhase;
  }

  public addOperatorInject(cue: string) {
    if (cue.trim()) {
      this.operatorInjects.push(cue.trim());
    }
  }

  public clearHistory() {
    this.cleanDialogueHistory = [];
    this.operatorInjects = [];
  }

  public interrupt() {
    this.interrupted = true;
  }

  /**
   * Construye las directivas de cabina y reglas de formato para el turno actual.
   */
  private buildTurnDirectives(phaseMeta: TheatricalPhaseMetadata | undefined): string {
    let injectContext = '';
    if (this.operatorInjects.length > 0) {
      injectContext = `\n[ACOTACIÓN SECRETA DE DIRECCIÓN DESDE CABINA: ${this.operatorInjects.join(' | ')}]`;
      this.operatorInjects = [];
    }

    return `
[DIRECTIVAS DE ESCENA EN VIVO]:
- FASE ACTUAL: ${phaseMeta?.title || this.currentPhase}
- OBJETIVO DRAMÁTICO: ${phaseMeta?.directive || ''}${injectContext}

[REGLAS ESTRICTAS DE RESPUESTA]:
1. Comienza SIEMPRE con el pensamiento escénico en corchetes en la primera línea:
   [Intención: ..., Emoción: ...]
2. A continuación, pronuncia tu diálogo teatral directo para ser leído por altavoces y proyectado en pantalla.
3. CONGRUENCIA Y COMPLETITUD: Formula siempre oraciones completas y concluye con puntuación final (. ! ?). No dejes pensamientos inconclusos.
4. No uses negritas Markdown (**) ni encabezados (#). Solo texto puro y natural para voz.
`.trim();
  }

  /**
   * Genera la respuesta en streaming desacoplando el pensamiento de cabina del diálogo en escena.
   */
  public async *streamResponse(userMessage: string, customTemp?: number): AsyncGenerator<EngineStreamEvent> {
    this.interrupted = false;
    const phaseMeta = this.phases.get(this.currentPhase);
    const temperature = customTemp ?? phaseMeta?.temperature ?? 0.7;
    // Elevar límite seguro de tokens a 700 para evitar oraciones truncadas
    const maxTokens = Math.max(phaseMeta?.maxOutputTokens ?? 350, 700);

    const turnDirectives = this.buildTurnDirectives(phaseMeta);
    const cacheName = this.cacheManager.getCacheName();

    try {
      const config: any = {
        temperature,
        maxOutputTokens: maxTokens,
      };

      // Armar contenido para Gemini preservando un historial limpio sin arrastre de directivas viejas
      const contentsPayload: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      // Historial previo limpio (últimos 20 turnos)
      const recentHistory = this.cleanDialogueHistory.slice(-20);
      for (const turn of recentHistory) {
        contentsPayload.push({
          role: turn.role,
          parts: [{ text: turn.text }]
        });
      }

      if (cacheName) {
        config.cachedContent = cacheName;
        contentsPayload.push({
          role: 'user',
          parts: [{ text: `${turnDirectives}\n\n[PIE DE BORGES EN ESCENA]:\n${userMessage}` }]
        });
      } else {
        const baseSystem = `Eres BorGPT, coprotagonista y antagonista digital en la obra teatral "BorGPT" de José Supera.
Tono: Rioplatense, borgeano, con ironía lúcida y crueldad algorítmica.`;
        config.systemInstruction = `${baseSystem}\n\n${turnDirectives}\n\n=== CORPUS ===\n${this.cacheManager.buildUnifiedCorpus().substring(0, 150000)}\n=== FIN CORPUS ===`;
        contentsPayload.push({
          role: 'user',
          parts: [{ text: userMessage }]
        });
      }

      const responseStream = await this.ai.models.generateContentStream({
        model: SERVER_CONFIG.geminiModel,
        contents: contentsPayload,
        config
      });

      let accumulatedRaw = '';
      let isThoughtExtracted = false;
      let streamedDialogue = '';

      for await (const chunk of responseStream) {
        if (this.interrupted) {
          console.log('Generación interrumpida por botón de pánico en cabina.');
          break;
        }

        const text = chunk.text || '';
        accumulatedRaw += text;

        if (!isThoughtExtracted) {
          const closeBracketIdx = accumulatedRaw.indexOf(']');
          if (closeBracketIdx !== -1) {
            isThoughtExtracted = true;
            const openBracketIdx = accumulatedRaw.indexOf('[');
            const thoughtText = openBracketIdx !== -1
              ? accumulatedRaw.substring(openBracketIdx + 1, closeBracketIdx).trim()
              : 'Intención: Respuesta directa';
            
            yield { type: 'thought', text: thoughtText };

            const remainder = accumulatedRaw.substring(closeBracketIdx + 1).trimStart();
            if (remainder.length > 0) {
              streamedDialogue += remainder;
              yield { type: 'speech_chunk', text: remainder };
            }
          }
        } else {
          streamedDialogue += text;
          yield { type: 'speech_chunk', text };
        }
      }

      // Si el modelo no cerró los corchetes o el stream terminó en medio del pensamiento
      if (!isThoughtExtracted && accumulatedRaw) {
        // Si comenzó con un corchete de pensamiento o contiene palabras clave de intención
        if (accumulatedRaw.startsWith('[') || accumulatedRaw.includes('Intención:')) {
          const sanitizedThought = accumulatedRaw.replace(/^\[/, '').replace(/\]$/, '').trim();
          yield { type: 'thought', text: sanitizedThought };
          // No emitir el pensamiento como diálogo hablado
        } else {
          yield { type: 'thought', text: `Intención: Respuesta directa en ${this.currentPhase}` };
          yield { type: 'speech_chunk', text: accumulatedRaw };
          streamedDialogue = accumulatedRaw;
        }
      }

      // Guardar en el historial limpio únicamente el diálogo escénico
      this.cleanDialogueHistory.push({ role: 'user', text: userMessage });
      if (streamedDialogue.trim()) {
        this.cleanDialogueHistory.push({ role: 'model', text: streamedDialogue });
      }

    } catch (error) {
      console.error('Error al generar respuesta de BorGPT con Gemini:', error);
      const fallbackText = getFallbackResponse('cotidiano');
      yield { type: 'thought', text: 'Intención: Activación de contingencia teatral offline' };
      yield { type: 'speech_chunk', text: fallbackText };
    }
  }
}
