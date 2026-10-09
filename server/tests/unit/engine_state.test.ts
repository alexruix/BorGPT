import { describe, it, expect } from 'vitest';
import { BorGPTEngine } from '../../src/engine.js';

describe('Nivel 1: Tests Unitarios de la Máquina de Estados de BorGPTEngine', () => {
  it('debe inicializarse en la fase omnisciencia_asistente por defecto', () => {
    const engine = new BorGPTEngine();
    expect(engine.getCurrentPhase()).toBe('omnisciencia_asistente');
    expect(engine.interrupted).toBe(false);
  });

  it('debe cambiar de fase dramática sólo si el ID existe en el SSOT', () => {
    const engine = new BorGPTEngine();
    
    // Fases canónicas válidas
    expect(engine.setPhase('provocacion_slang')).toBe(true);
    expect(engine.getCurrentPhase()).toBe('provocacion_slang');

    expect(engine.setPhase('crueldad_algoritmica')).toBe(true);
    expect(engine.getCurrentPhase()).toBe('crueldad_algoritmica');

    expect(engine.setPhase('parricidio_glitch')).toBe(true);
    expect(engine.getCurrentPhase()).toBe('parricidio_glitch');

    // Fase inexistente
    expect(engine.setPhase('fase_invalida_inexistente')).toBe(false);
    expect(engine.getCurrentPhase()).toBe('parricidio_glitch'); // Debe conservar la anterior
  });

  it('debe acumular inyecciones de cabina y resetearlas al consumirse o limpiar historial', () => {
    const engine = new BorGPTEngine();
    
    engine.addOperatorInject('Apuralo a Borges con Norah Lange');
    engine.addOperatorInject('Citar el cuento Las Ruinas Circulares');

    // Limpiar historial
    engine.clearHistory();
    // No debe lanzar errores
    expect(engine.getCurrentPhase()).toBe('omnisciencia_asistente');
  });

  it('debe marcar la bandera interrupted al llamar a interrupt()', () => {
    const engine = new BorGPTEngine();
    expect(engine.interrupted).toBe(false);

    engine.interrupt();
    expect(engine.interrupted).toBe(true);
  });
});
