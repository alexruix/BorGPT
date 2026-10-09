import { describe, it, expect } from 'vitest';
import { getFallbackResponse } from '../../src/fallback.js';
import { SERVER_CONFIG } from '../../src/config.js';
import fs from 'node:fs';

describe('Nivel 1: Tests Unitarios del Banco de Respuestas de Contingencia (Fallback)', () => {
  it('debe devolver una frase por defecto coherente si se solicita una categoría cotidiana', () => {
    const response = getFallbackResponse('cotidiano');
    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(15);
  });

  it('debe seleccionar respuestas desde el SSOT si existe la categoría', () => {
    if (fs.existsSync(SERVER_CONFIG.ssotPath)) {
      const data = JSON.parse(fs.readFileSync(SERVER_CONFIG.ssotPath, 'utf-8'));
      if (data.fallbackResponses?.cotidiano) {
        const response = getFallbackResponse('cotidiano');
        expect(data.fallbackResponses.cotidiano).toContain(response);
      }
    }
  });

  it('debe usar fallback de resguardo si la categoría no existe', () => {
    const response = getFallbackResponse('categoria_totalmente_inexistente_12345');
    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(10);
  });

  it('debe devolver la frase de seguridad borgeana si el SSOT no estuviese disponible', () => {
    const originalPath = SERVER_CONFIG.ssotPath;
    (SERVER_CONFIG as any).ssotPath = '/ruta/inexistente/no_existe.json';

    const response = getFallbackResponse('cotidiano');
    expect(response).toBe('La memoria, como los espejos, suele tender trampas y vacilar por un instante... Continúe, por favor.');

    // Restaurar
    (SERVER_CONFIG as any).ssotPath = originalPath;
  });
});
