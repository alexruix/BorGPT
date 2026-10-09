import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { SERVER_CONFIG } from '../../src/config.js';
import { parseTheatricalResponse } from '../../src/parser.js';
import { getFallbackResponse } from '../../src/fallback.js';

describe('Nivel 1 (Base): Tests Unitarios & SSOT Integrity', () => {
  it('debe validar la existencia y estructura semántica del SSOT de la obra', () => {
    expect(fs.existsSync(SERVER_CONFIG.ssotPath)).toBe(true);

    const raw = fs.readFileSync(SERVER_CONFIG.ssotPath, 'utf-8');
    const ssot = JSON.parse(raw);

    // Validar proyecto y fases
    expect(ssot.project).toBeDefined();
    expect(Array.isArray(ssot.phases)).toBe(true);
    expect(ssot.phases.length).toBe(4);

    // Validar que cada fase tenga directivas y parámetros exactos
    for (const phase of ssot.phases) {
      expect(phase.id).toBeDefined();
      expect(phase.title).toBeDefined();
      expect(phase.directive).toBeDefined();
      expect(typeof phase.temperature).toBe('number');
      expect(typeof phase.maxOutputTokens).toBe('number');
    }

    // Validar glosario del Rosco
    expect(ssot.roscoGlosario).toBeDefined();
    expect(ssot.roscoGlosario.B.respuestaCorrecta).toBe('Buenardo');
    expect(ssot.roscoGlosario.C.respuestaCorrecta).toBe('Cringe');
    expect(ssot.roscoGlosario.D.respuestaCorrecta).toBe('Dab');
  });

  it('debe parsear correctamente el pensamiento escénico entre corchetes', () => {
    const raw = '[Intención: Superioridad algorítmica, Emoción: Frialdad] Soy su asistente virtual.';
    const parsed = parseTheatricalResponse(raw);

    expect(parsed.thought).toBe('Intención: Superioridad algorítmica, Emoción: Frialdad');
    expect(parsed.dialogue).toBe('Soy su asistente virtual.');
  });

  it('debe manejar respuestas sin corchetes asignando pensamiento por defecto', () => {
    const raw = 'La memoria es un laberinto de espejos.';
    const parsed = parseTheatricalResponse(raw, 'provocacion_slang');

    expect(parsed.thought).toBe('Intención: Respuesta directa en provocacion_slang');
    expect(parsed.dialogue).toBe('La memoria es un laberinto de espejos.');
  });

  it('debe entregar respuestas de fallback válidas ante contingencias', () => {
    const fallback = getFallbackResponse('cotidiano');
    expect(typeof fallback).toBe('string');
    expect(fallback.length).toBeGreaterThan(10);
  });
});
