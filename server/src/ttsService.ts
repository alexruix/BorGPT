import { SERVER_CONFIG } from './config.js';

export interface TTSRequest {
  text: string;
}

export interface TTSResponse {
  audio_base64?: string;
  error?: string;
}

export class TTSService {
  private static instance: TTSService;
  private ttsUrl: string;

  private constructor() {
    this.ttsUrl = process.env.TTS_API_URL || '';
  }

  public static getInstance(): TTSService {
    if (!TTSService.instance) {
      TTSService.instance = new TTSService();
    }
    return TTSService.instance;
  }

  public setUrl(url: string) {
    this.ttsUrl = url;
  }

  public getUrl(): string {
    return this.ttsUrl;
  }

  /**
   * Envía una oración a sintetizar en el servidor F5-TTS (Google Colab / Local).
   * Devuelve el audio en base64 para transmitir directamente por WebSocket.
   */
  public async synthesize(text: string): Promise<string | null> {
    const cleanText = text.trim();
    if (!cleanText || !this.ttsUrl) {
      return null;
    }

    try {
      const endpoint = this.ttsUrl.endsWith('/') ? `${this.ttsUrl}tts` : `${this.ttsUrl}/tts`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: cleanText }),
      });

      if (!response.ok) {
        console.error(`Error HTTP ${response.status} en servicio TTS (${this.ttsUrl})`);
        return null;
      }

      const data = (await response.json()) as TTSResponse;
      return data.audio_base64 || null;
    } catch (error) {
      console.error('Error de conexión con el microservicio F5-TTS en Colab:', error);
      return null;
    }
  }
}
