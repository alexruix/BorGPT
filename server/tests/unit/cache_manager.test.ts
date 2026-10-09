import { describe, it, expect } from 'vitest';
import { CacheManager } from '../../src/cacheManager.js';
import { SERVER_CONFIG } from '../../src/config.js';
import fs from 'node:fs';

describe('Nivel 1: Tests Unitarios de Gestión de Corpus y Context Caching', () => {
  it('debe construir el corpus unificado respetando jerarquía y límites de tamaño (< 2.8 MB)', () => {
    // Mock ligero de GoogleGenAI ya que buildUnifiedCorpus es una función pura de lectura de disco
    const fakeAi: any = {};
    const cacheManager = new CacheManager(fakeAi);

    const corpus = cacheManager.buildUnifiedCorpus();

    expect(corpus).toBeDefined();
    expect(typeof corpus).toBe('string');
    expect(corpus.length).toBeGreaterThan(1000);
    // Verificar que nunca exceda el límite de seguridad de 2.8 MB (~700k tokens)
    expect(corpus.length).toBeLessThanOrEqual(2800000);
    expect(corpus).toContain('# Corpus Maestro Unificado');
  });

  it('debe priorizar los documentos teatrales de docs/ y los diarios íntimos de Bioy Casares', () => {
    const fakeAi: any = {};
    const cacheManager = new CacheManager(fakeAi);

    const corpus = cacheManager.buildUnifiedCorpus();

    if (fs.existsSync(SERVER_CONFIG.docsDir)) {
      expect(corpus).toContain('<!-- DOCUMENTO:');
    }
    if (fs.existsSync(SERVER_CONFIG.bioyPath)) {
      expect(corpus).toContain('<!-- SECCIÓN: DIARIOS ÍNTIMOS BORGES - BIOY CASARES -->');
    }
  });

  it('debe manejar gracefully la falta de API key sin arrojar excepciones en initializeCache', async () => {
    const originalKey = SERVER_CONFIG.geminiApiKey;
    (SERVER_CONFIG as any).geminiApiKey = '';

    const fakeAi: any = { caches: { create: async () => ({ name: 'mock-cache' }) } };
    const cacheManager = new CacheManager(fakeAi);

    const cacheName = await cacheManager.initializeCache();
    expect(cacheName).toBeNull();
    expect(cacheManager.getCacheName()).toBeNull();

    // Restaurar clave
    (SERVER_CONFIG as any).geminiApiKey = originalKey;
  });
});
