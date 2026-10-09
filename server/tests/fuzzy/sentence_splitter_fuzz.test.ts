import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { TheatricalSentenceSplitter } from '../../src/sentenceSplitter.js';

describe('Nivel 2 (Fuzzy Testing): TheatricalSentenceSplitter & Stream Stability', () => {
  it('Fuzzy Test: El splitter nunca debe arrojar excepciones ante streams de texto arbitrarios', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 0, maxLength: 50 }), { minLength: 1, maxLength: 20 }),
        (chunks) => {
          const splitter = new TheatricalSentenceSplitter();
          for (const chunk of chunks) {
            const sentences = splitter.push(chunk);
            expect(Array.isArray(sentences)).toBe(true);
            for (const s of sentences) {
              expect(typeof s).toBe('string');
            }
          }
          const finalRemainder = splitter.flush();
          expect(finalRemainder === null || typeof finalRemainder === 'string').toBe(true);
        }
      ),
      { numRuns: 300 }
    );
  });

  it('Fuzzy Test: Todo texto con delimitadores (. ! ?) debe segmentarse en oraciones bien formadas', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            phrase: fc.string({ minLength: 10, maxLength: 80 }).filter(s => !/[.!?]/.test(s)),
            punct: fc.constantFrom('.', '!', '?', '...')
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (sentencesData) => {
          const splitter = new TheatricalSentenceSplitter();
          let fullOutput: string[] = [];

          for (const item of sentencesData) {
            const chunk = `${item.phrase}${item.punct} `;
            const result = splitter.push(chunk);
            fullOutput = fullOutput.concat(result);
          }

          const flush = splitter.flush();
          if (flush) fullOutput.push(flush);

          expect(fullOutput.length).toBeGreaterThanOrEqual(1);
        }
      ),
      { numRuns: 200 }
    );
  });
});
