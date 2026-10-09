import { describe, it, expect } from 'vitest';
import { TheatricalSentenceSplitter } from '../../src/sentenceSplitter.js';

describe('Nivel 1: Tests Unitarios Canónicos de TheatricalSentenceSplitter', () => {
  it('debe extraer oraciones que terminan en punto (.)', () => {
    const splitter = new TheatricalSentenceSplitter();
    const result = splitter.push('La ceguera no es una tiniebla total. Es una forma de la soledad.');

    expect(result.length).toBe(2);
    expect(result[0]).toBe('La ceguera no es una tiniebla total.');
    expect(result[1]).toBe('Es una forma de la soledad.');
    expect(splitter.flush()).toBeNull();
  });

  it('debe soportar signos de exclamación (!), interrogación (?) y puntos suspensivos (…)', () => {
    const splitter = new TheatricalSentenceSplitter();
    const r1 = splitter.push('¡Incorrecto! ¿Acaso no recuerda ese verano en Adrogué? Todo se desvanece… ');

    expect(r1.length).toBe(3);
    expect(r1[0]).toBe('¡Incorrecto!');
    expect(r1[1]).toBe('¿Acaso no recuerda ese verano en Adrogué?');
    expect(r1[2]).toBe('Todo se desvanece…');
  });

  it('debe acumular fragmentos parciales hasta que se forme una oración completa', () => {
    const splitter = new TheatricalSentenceSplitter();
    
    // Entrega paulatina simulando streaming de tokens
    expect(splitter.push('No he leído jamás ')).toEqual([]);
    expect(splitter.push('un libro porque ese libro ')).toEqual([]);
    expect(splitter.push('fuera antiguo. ')).toEqual(['No he leído jamás un libro porque ese libro fuera antiguo.']);
    
    expect(splitter.flush()).toBeNull();
  });

  it('debe dividir por comas o punto y coma si la frase es excesivamente larga (>120 caracteres)', () => {
    const splitter = new TheatricalSentenceSplitter();
    const longChunk = 'En un lugar de la memoria donde el tiempo no transcurre según las leyes de la física clásica sino según la poesía, el laberinto se abre sin fin';
    
    const result = splitter.push(longChunk);
    expect(result.length).toBe(1);
    expect(result[0]).toContain('poesía,');

    const remainder = splitter.flush();
    expect(remainder).toBe('el laberinto se abre sin fin');
  });

  it('debe devolver el texto remanente con flush() al terminar el stream', () => {
    const splitter = new TheatricalSentenceSplitter();
    splitter.push('Una frase final sin punto');

    const flushed = splitter.flush();
    expect(flushed).toBe('Una frase final sin punto');
    expect(splitter.flush()).toBeNull();
  });

  it('debe limpiar el buffer completamente al invocar reset()', () => {
    const splitter = new TheatricalSentenceSplitter();
    splitter.push('Texto que quedará descartado');
    splitter.reset();

    expect(splitter.flush()).toBeNull();
  });
});
