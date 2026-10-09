import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TTSService } from '../../src/ttsService.js';

describe('Nivel 2: Cliente de Síntesis de Voz F5-TTS (Colab / Local)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('debe devolver null de forma silenciosa y segura si no hay TTS_API_URL configurada', async () => {
    const tts = TTSService.getInstance();
    tts.setUrl('');

    const result = await tts.synthesize('Hola Borges');
    expect(result).toBeNull();
  });

  it('debe comunicarse con el endpoint de Colab y devolver el audio base64', async () => {
    const tts = TTSService.getInstance();
    tts.setUrl('https://borgpt-colab.trycloudflare.com');

    const fakeAudioBase64 = 'UklGRi4AAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';

    // Mock de fetch global
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ audio_base64: fakeAudioBase64 }),
    } as Response);

    const result = await tts.synthesize('El Aleph es un punto que contiene todos los puntos.');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://borgpt-colab.trycloudflare.com/tts',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'El Aleph es un punto que contiene todos los puntos.' }),
      })
    );
    expect(result).toBe(fakeAudioBase64);
  });

  it('debe manejar errores de red o servidor caído sin romper el pipeline de texto', async () => {
    const tts = TTSService.getInstance();
    tts.setUrl('https://borgpt-colab.trycloudflare.com');

    global.fetch = vi.fn().mockRejectedValue(new Error('Network connection timeout'));

    const result = await tts.synthesize('Texto con error');
    expect(result).toBeNull();
  });
});
