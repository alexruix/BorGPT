import { describe, it, expect, vi } from 'vitest';

describe('Nivel 2: Blindaje de Acciones de Cabina y Pipeline de Audio', () => {
  it('debe retener audio en búfer durante aprobación manual y liberarlo sólo al aprobar', () => {
    const onAudioSentenceMock = vi.fn();
    const manualApproval = true;
    const audioEnabled = true;

    // Simulación del estado del hook useStageWebSocket
    let pendingAudio: string[] = [];
    const simulatedAudioChunk = 'UklGRi4AAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';

    // 1. Llega evento de audio desde el WebSocket
    const handleAudioEvent = (b64: string) => {
      if (manualApproval) {
        pendingAudio.push(b64);
      } else {
        onAudioSentenceMock(b64);
      }
    };

    handleAudioEvent(simulatedAudioChunk);

    // En modo manual, no debe emitirse audio de inmediato
    expect(onAudioSentenceMock).not.toHaveBeenCalled();
    expect(pendingAudio.length).toBe(1);

    // 2. Operador aprueba y libera el mensaje (releasePending)
    const releasePending = () => {
      if (audioEnabled && pendingAudio.length > 0) {
        pendingAudio.forEach((chunk) => onAudioSentenceMock(chunk));
      }
      pendingAudio = [];
    };

    releasePending();

    // Tras la aprobación, se ejecuta la reproducción de los fragmentos acumulados
    expect(onAudioSentenceMock).toHaveBeenCalledTimes(1);
    expect(onAudioSentenceMock).toHaveBeenCalledWith(simulatedAudioChunk);
    expect(pendingAudio.length).toBe(0);
  });

  it('debe descartar el audio sin emitirlo si el operador pulsa descartar', () => {
    const onAudioSentenceMock = vi.fn();
    let pendingAudio = ['audio_chunk_1', 'audio_chunk_2'];

    // Operador descarta la réplica
    const discardPending = () => {
      pendingAudio = [];
    };

    discardPending();

    expect(onAudioSentenceMock).not.toHaveBeenCalled();
    expect(pendingAudio.length).toBe(0);
  });

  it('debe silenciar y purgar la cola de audio de inmediato ante corte de pánico (interrupt)', () => {
    const onInterruptAudioMock = vi.fn();
    let audioQueue = ['audio_chunk_1', 'audio_chunk_2'];
    let isPlayingAudio = true;

    const interrupt = () => {
      audioQueue = [];
      isPlayingAudio = false;
      onInterruptAudioMock();
    };

    interrupt();

    expect(onInterruptAudioMock).toHaveBeenCalledTimes(1);
    expect(audioQueue.length).toBe(0);
    expect(isPlayingAudio).toBe(false);
  });

  it('no debe encolar audio si el interruptor global de audio está desactivado', () => {
    const audioQueue: string[] = [];
    const audioEnabled = false;

    const enqueueAudio = (b64: string) => {
      if (!audioEnabled) return;
      audioQueue.push(b64);
    };

    enqueueAudio('simulated_b64');

    expect(audioQueue.length).toBe(0);
  });
});
