import { useRef, useState } from 'react';
import { CABINA_CONFIG } from '@/constants/config';

export function useStageAudio(audioEnabled: boolean) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.95);
  const audioQueueRef = useRef<string[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const playbackSpeedRef = useRef(playbackSpeed);
  playbackSpeedRef.current = playbackSpeed;

  const b64toBlob = (b64Data: string, contentType: string) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += CABINA_CONFIG.audioChunkByteSize) {
      const slice = byteCharacters.slice(offset, offset + CABINA_CONFIG.audioChunkByteSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  };

  const playNextAudio = () => {
    if (audioQueueRef.current.length === 0) {
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    const b64 = audioQueueRef.current.shift()!;
    try {
      // F5-TTS produce audio en formato WAV PCM (audio/wav)
      const audioBlob = b64toBlob(b64, CABINA_CONFIG.audioMimeType);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.playbackRate = playbackSpeedRef.current;
      currentAudioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        playNextAudio();
      };
      audio.onerror = (e) => {
        console.error('Error al reproducir fragmento de audio en navegador:', e);
        URL.revokeObjectURL(audioUrl);
        playNextAudio();
      };
      audio.play().catch((err) => {
        console.warn('El navegador bloqueó la reproducción automática de audio (se requiere interacción de usuario):', err);
        playNextAudio();
      });
    } catch (err) {
      console.error('Error al procesar buffer de audio base64:', err);
      playNextAudio();
    }
  };

  const enqueueAudio = (b64: string) => {
    if (!audioEnabled) return;
    audioQueueRef.current.push(b64);
    if (!isPlayingAudio) {
      playNextAudio();
    }
  };

  const stopAudio = () => {
    audioQueueRef.current = [];
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    setIsPlayingAudio(false);
  };

  return {
    isPlayingAudio,
    playbackSpeed,
    setPlaybackSpeed,
    enqueueAudio,
    stopAudio,
  };
}
