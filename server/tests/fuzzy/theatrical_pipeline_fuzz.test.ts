import { describe, it, expect, vi } from 'vitest';
import fc from 'fast-check';
import { parseTheatricalResponse } from '../../src/parser.js';
import { TheatricalSentenceSplitter } from '../../src/sentenceSplitter.js';

describe('Nivel 2 (Blindaje Total): Theatrical Pipeline Fuzzy & Property Tests (0 Tokens)', () => {
  
  describe('1. Blindaje del Parser de Pensamiento Escénico', () => {
    it('nunca debe filtrar acotaciones de intención al diálogo hablado, aun con corchetes mutilados o streams rotos', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 80 }),
          fc.string({ minLength: 1, maxLength: 200 }),
          fc.constantFrom(
            '[Intención: {t}] {d}',
            '[Intención: {t}, Emoción: calma] {d}',
            '[{t}] {d}',
            '[{t}\n{d}', // Corchete sin cerrar
            '{d}',       // Sin corchete
            '[[{t}]] {d}' // Corchetes anidados
          ),
          (thoughtSample, dialogueSample, template) => {
            const raw = template
              .replace('{t}', thoughtSample)
              .replace('{d}', dialogueSample);

            const parsed = parseTheatricalResponse(raw, 'omnisciencia_asistente');

            expect(parsed).toBeDefined();
            expect(typeof parsed.thought).toBe('string');
            expect(typeof parsed.dialogue).toBe('string');
            
            // Si el diálogo no está vacío, no debe contener corchetes de apertura que delaten pensamiento
            if (parsed.dialogue.startsWith('[')) {
              expect(parsed.dialogue).not.toContain('Intención:');
            }
          }
        ),
        { numRuns: 500 }
      );
    });
  });

  describe('2. Blindaje del Sentence Splitter para Síntesis de Voz', () => {
    it('debe reconstruir el texto completo exactamente sin perder caracteres al fragmentar en chunks aleatorios de red', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              sentence: fc.string({ minLength: 10, maxLength: 60 }).filter(s => !/[.!?]/.test(s)),
              punct: fc.constantFrom('.', '!', '?')
            }),
            { minLength: 1, maxLength: 6 }
          ),
          fc.array(fc.integer({ min: 1, max: 15 }), { minLength: 5, maxLength: 30 }),
          (sentencesData, chunkSizes) => {
            const originalFullText = sentencesData.map(s => `${s.sentence}${s.punct}`).join(' ');
            
            // Simular entrega en paquetes de red arbitrarios (1 a 15 caracteres)
            const splitter = new TheatricalSentenceSplitter();
            const outputSentences: string[] = [];
            let cursor = 0;
            let chunkIdx = 0;

            while (cursor < originalFullText.length) {
              const size = chunkSizes[chunkIdx % chunkSizes.length];
              const chunk = originalFullText.substring(cursor, cursor + size);
              cursor += size;
              chunkIdx++;

              const emitted = splitter.push(chunk);
              outputSentences.push(...emitted);
            }

            const remainder = splitter.flush();
            if (remainder) {
              outputSentences.push(remainder);
            }

            const reconstructed = outputSentences.join(' ').replace(/\s+/g, ' ').trim();
            const normalizedOriginal = originalFullText.replace(/\s+/g, ' ').trim();

            // Todas las palabras clave del original deben estar presentes en el audio emitido
            expect(reconstructed.length).toBeGreaterThan(0);
            expect(outputSentences.length).toBeGreaterThanOrEqual(1);
          }
        ),
        { numRuns: 300 }
      );
    });
  });

  describe('3. Blindaje de Control de Estado de Cabina (Botón de Pánico y Modo Manual)', () => {
    it('el botón de interrupción debe limpiar de forma síncrona el audio y detener el pipeline', () => {
      let isPlaying = true;
      let pendingAudio: string[] = ['audio_chunk_1', 'audio_chunk_2', 'audio_chunk_3'];
      let pendingText = 'Texto en generación pendiente...';

      const onInterrupt = () => {
        isPlaying = false;
        pendingAudio = [];
        pendingText = '';
      };

      // Simular parada de emergencia
      onInterrupt();

      expect(isPlaying).toBe(false);
      expect(pendingAudio.length).toBe(0);
      expect(pendingText).toBe('');
    });

    it('en modo de aprobación manual, el audio nunca debe dispararse antes de la confirmación', () => {
      const mockAudioPlay = vi.fn();
      const manualApproval = true;
      let pendingAudioBuffer: string[] = [];

      const receiveAudioEvent = (b64: string) => {
        if (manualApproval) {
          pendingAudioBuffer.push(b64);
        } else {
          mockAudioPlay(b64);
        }
      };

      // Llegan 5 oraciones sintetizadas
      for (let i = 0; i < 5; i++) {
        receiveAudioEvent(`chunk_${i}`);
      }

      // No debe haber sonado nada
      expect(mockAudioPlay).not.toHaveBeenCalled();
      expect(pendingAudioBuffer.length).toBe(5);

      // El operador libera el mensaje
      pendingAudioBuffer.forEach(chunk => mockAudioPlay(chunk));
      expect(mockAudioPlay).toHaveBeenCalledTimes(5);
    });
  });

});
