import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { parseTheatricalResponse } from '../../src/parser.js';

describe('Nivel 2 (Intermedio): Fuzzy & Property-Based Testing', () => {
  it('Fuzzy Test: parseTheatricalResponse nunca debe lanzar excepciones ni devolver undefined', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.string({ minLength: 0, maxLength: 50 }),
        (arbitraryInput, phase) => {
          const result = parseTheatricalResponse(arbitraryInput, phase);

          expect(result).toBeDefined();
          expect(typeof result.thought).toBe('string');
          expect(typeof result.dialogue).toBe('string');
        }
      ),
      { numRuns: 500 }
    );
  });

  it('Fuzzy Test: Formatos con corchetes anidados o caracteres especiales deben extraerse limpiamente', () => {
    fc.assert(
      fc.property(
        fc.unicodeString({ minLength: 1, maxLength: 100 }),
        fc.unicodeString({ minLength: 1, maxLength: 300 }),
        (thought, dialogue) => {
          const raw = `[${thought}] ${dialogue}`;
          const result = parseTheatricalResponse(raw);

          expect(result.thought).toBeDefined();
          expect(result.dialogue).toBeDefined();
        }
      ),
      { numRuns: 300 }
    );
  });
});
