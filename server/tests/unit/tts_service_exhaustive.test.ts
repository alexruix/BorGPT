import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TTSService } from '../../src/ttsService.js';

describe('Nivel 1: Tests Unitarios Exhaustivos de TTSService', () => {
  const service = TTSService.getInstance();
  const originalUrl = service.getUrl();

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    service.setUrl(originalUrl);
  });

  it('debe manejar URLs con o sin barra final asegurando el endpoint /tts correcto', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ audio_base64: 'UklGRi4AAABXQVZF' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    // Caso 1: URL sin barra final
    service.setUrl('https://borges-tts.trycloudflare.com');
    await service.synthesize('Prueba de audio 1');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://borges-tts.trycloudflare.com/tts',
      expect.anything()
    );

    // Caso 2: URL con barra final
    service.setUrl('https://borges-tts.trycloudflare.com/');
    await service.synthesize('Prueba de audio 2');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://borges-tts.trycloudflare.com/tts',
      expect.anything()
    );
  });

  it('debe retornar null sin llamar a fetch si el texto está vacío o contiene sólo espacios', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    service.setUrl('https://borges-tts.trycloudflare.com');

    expect(await service.synthesize('')).toBeNull();
    expect(await service.synthesize('    ')).toBeNull();
    expect(await service.synthesize('\n\t  ')).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('debe retornar null sin llamar a fetch si ttsUrl no está configurada', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    service.setUrl('');
    const result = await service.synthesize('Texto válido pero sin URL');

    expect(result).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('debe capturar respuestas HTTP no exitosas (404, 500, 502) retornando null sin arrojar excepciones', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
      statusText: 'Bad Gateway',
    });
    vi.stubGlobal('fetch', fetchMock);

    service.setUrl('https://borges-tts.trycloudflare.com');
    const result = await service.synthesize('Hola Borges');

    expect(result).toBeNull();
  });

  it('debe capturar fallos de red / timeout de fetch retornando null sin romper la ejecución', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('Connection timed out'));
    vi.stubGlobal('fetch', fetchMock);

    service.setUrl('https://borges-tts.trycloudflare.com');
    const result = await service.synthesize('Texto bajo contingencia');

    expect(result).toBeNull();
  });
});
