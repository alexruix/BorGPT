import { describe, it, expect } from 'vitest';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

describe('Nivel 3 (Cúspide): Test de Integración E2E en Vivo con Microservicio F5-TTS en Colab', () => {
  const ttsUrl = process.env.TTS_API_URL;

  it('debe tener configurada la URL del microservicio TTS en .env', () => {
    expect(ttsUrl).toBeDefined();
    expect(ttsUrl).toMatch(/^https:\/\/.*trycloudflare\.com/);
  });

  it('debe responder al health check del servidor F5-TTS en Colab', async () => {
    if (!ttsUrl) return;

    const response = await fetch(`${ttsUrl}/health`);
    expect(response.status).toBe(200);

    const data = (await response.json()) as { status: string; model: string };
    expect(data.status).toBe('online');
    expect(data.model).toContain('F5-TTS');
  }, 15000);

  it('debe sintetizar una frase de prueba con la voz de Borges y devolver audio WAV en base64', async () => {
    if (!ttsUrl) return;

    const testText = 'El tiempo es la sustancia de que estoy hecho.';

    const response = await fetch(`${ttsUrl}/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: testText }),
    });

    expect(response.status).toBe(200);

    const result = (await response.json()) as { audio_base64?: string };
    expect(result.audio_base64).toBeDefined();
    expect(typeof result.audio_base64).toBe('string');
    expect(result.audio_base64!.length).toBeGreaterThan(1000); // Buffer de audio válido

    // Verificar cabecera RIFF / WAV en el base64 decodificado
    const audioBuffer = Buffer.from(result.audio_base64!, 'base64');
    const header = audioBuffer.toString('ascii', 0, 4);
    expect(header).toBe('RIFF');
  }, 30000);
});
