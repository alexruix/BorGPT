import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { parseTheatricalResponse } from '../../src/parser.js';
import { TheatricalSentenceSplitter } from '../../src/sentenceSplitter.js';
import { getFallbackResponse } from '../../src/fallback.js';

describe('Nivel 2 (Fuzzy Testing Avanzado): Robustez Teatral Extrema (0 Tokens)', () => {

  describe('1. Fuzzy Test: Inyección de Diálogos con Formatos y Símbolos Teatrales Complejos', () => {
    it('debe aislar pensamientos incluso con comillas, guiones de diálogo y acotaciones complejas', () => {
      fc.assert(
        fc.property(
          fc.unicodeString({ minLength: 1, maxLength: 60 }),
          fc.unicodeString({ minLength: 1, maxLength: 200 }),
          (thought, dialogue) => {
            const raw = `[Intención: ${thought}] —${dialogue}`;
            const result = parseTheatricalResponse(raw);

            expect(result).toBeDefined();
            expect(result.thought).toBeDefined();
            expect(result.dialogue).toBeDefined();
            // El diálogo retornado no debe contener la palabra clave del pensamiento
            if (result.dialogue.startsWith('[')) {
              expect(result.dialogue).not.toContain('Intención:');
            }
          }
        ),
        { numRuns: 400 }
      );
    });
  });

  describe('2. Fuzzy Test: Cadencia de Chunks en TheatricalSentenceSplitter', () => {
    it('nunca debe emitir oraciones vacías o solo compuestas de espacios/puntuación flotante', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.oneof(
              fc.string({ minLength: 1, maxLength: 30 }),
              fc.constantFrom('.', '!', '?', '…', ',', ';', ' ', '\n', '\t')
            ),
            { minLength: 5, maxLength: 50 }
          ),
          (streamChunks) => {
            const splitter = new TheatricalSentenceSplitter();
            const emitted: string[] = [];

            for (const chunk of streamChunks) {
              const res = splitter.push(chunk);
              emitted.push(...res);
            }

            const flushed = splitter.flush();
            if (flushed) emitted.push(flushed);

            // Cada oración producida debe tener contenido de texto sustancial
            for (const s of emitted) {
              expect(typeof s).toBe('string');
              expect(s.trim().length).toBeGreaterThan(0);
            }
          }
        ),
        { numRuns: 300 }
      );
    });
  });

  describe('3. Fuzzy Test: Resiliencia del Banco de Fallback ante Categorías Arbitrarias', () => {
    it('debe devolver siempre un string borgeano válido no vacío ante cualquier input arbitrario', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 0, maxLength: 100 }),
          (arbitraryCategory) => {
            const fallback = getFallbackResponse(arbitraryCategory);
            expect(typeof fallback).toBe('string');
            expect(fallback.trim().length).toBeGreaterThan(10);
          }
        ),
        { numRuns: 200 }
      );
    });
  });

});
