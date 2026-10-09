import React, { useState, useEffect, useRef } from 'react';
import type { TheatricalAct, DialogueMessage, WsMessage } from '../types/stage';
import { StageHeader } from '../components/organisms/StageHeader';
import { ActsSidebar } from '../components/organisms/ActsSidebar';
import { DialogueStream } from '../components/organisms/DialogueStream';
import { ControlsSidebar } from '../components/organisms/ControlsSidebar';

export const StageCabinaPage: React.FC = () => {
  const [online, setOnline] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [currentAct, setCurrentAct] = useState<TheatricalAct>('despertar_asistente');
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<DialogueMessage[]>([
    {
      id: 'initial',
      sender: 'borgpt',
      text: 'Soy su asistente virtual. Estoy aquí para asistirlo en su búsqueda.',
      thought: 'Apertura de asistente virtual en penumbra escénica',
      timestamp: '00:00:00',
    },
  ]);

  const wsRef = useRef<WebSocket | null>(null);
  const audioQueueRef = useRef<string[]>([]);
  const isPlayingAudioRef = useRef(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    connectWebSocket();
    return () => {
      wsRef.current?.close();
    };
  }, []);

  const connectWebSocket = () => {
    const host = window.location.hostname === 'localhost' ? 'localhost:8000' : window.location.host;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${host}/ws/stage`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setOnline(true);
      console.log('Conectado a BorGPT Stage WebSocket');
    };

    ws.onclose = () => {
      setOnline(false);
      setTimeout(connectWebSocket, 2500);
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    ws.onmessage = (event) => {
      const data: WsMessage = JSON.parse(event.data);
      handleServerEvent(data);
    };
  };

  const handleServerEvent = (data: WsMessage) => {
    if (data.type === 'start') {
      setIsGenerating(true);
      audioQueueRef.current = [];
      setMessages((prev) => [
        ...prev,
        {
          id: `borgpt-${Date.now()}`,
          sender: 'borgpt',
          text: '',
          timestamp: new Date().toLocaleTimeString(),
          isStreaming: true,
        },
      ]);
    } else if (data.type === 'thought') {
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last && last.sender === 'borgpt') {
          last.thought = data.text;
        }
        return updated;
      });
    } else if (data.type === 'chunk') {
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last && last.sender === 'borgpt') {
          last.text += data.text || '';
        }
        return updated;
      });
    } else if (data.type === 'audio_sentence') {
      if (audioEnabled && data.audio_base64) {
        enqueueAudio(data.audio_base64);
      }
    } else if (data.type === 'end') {
      setIsGenerating(false);
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last && last.sender === 'borgpt') {
          last.isStreaming = false;
        }
        return updated;
      });
    } else if (data.type === 'interrupted') {
      setIsGenerating(false);
      audioQueueRef.current = [];
      if (currentAudioRef.current) currentAudioRef.current.pause();
      isPlayingAudioRef.current = false;
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last && last.sender === 'borgpt') {
          last.isStreaming = false;
          last.text += ' [INTERRUMPIDO EN ESCENA]';
        }
        return updated;
      });
    } else if (data.type === 'mode_changed') {
      if (data.mode) setCurrentAct(data.mode);
    }
  };

  const enqueueAudio = (b64: string) => {
    audioQueueRef.current.push(b64);
    if (!isPlayingAudioRef.current) {
      playNextAudio();
    }
  };

  const playNextAudio = () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingAudioRef.current = false;
      return;
    }

    isPlayingAudioRef.current = true;
    const b64 = audioQueueRef.current.shift()!;
    try {
      const audioBlob = b64toBlob(b64, 'audio/mp3');
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;

      audio.onended = () => playNextAudio();
      audio.onerror = () => playNextAudio();
      audio.play().catch(() => playNextAudio());
    } catch {
      playNextAudio();
    }
  };

  const b64toBlob = (b64Data: string, contentType: string) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  };

  const handleSend = () => {
    if (!userInput.trim() || isGenerating) return;

    const text = userInput.trim();
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'borges',
        text,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

    wsRef.current?.send(
      JSON.stringify({
        action: 'chat',
        message: text,
        audio: audioEnabled,
      })
    );

    setUserInput('');
  };

  const handleSelectAct = (actId: TheatricalAct) => {
    setCurrentAct(actId);
    wsRef.current?.send(
      JSON.stringify({
        action: 'set_mode',
        mode: actId,
      })
    );
  };

  const handleInterrupt = () => {
    audioQueueRef.current = [];
    if (currentAudioRef.current) currentAudioRef.current.pause();
    isPlayingAudioRef.current = false;
    wsRef.current?.send(JSON.stringify({ action: 'interrupt' }));
  };

  const handleInjectCue = (cue: string) => {
    wsRef.current?.send(JSON.stringify({ action: 'inject', text: cue }));
    alert('Apunte invisible encolado para la próxima intervención.');
  };

  const handleClear = () => {
    if (confirm('¿Desea limpiar el diálogo de escena?')) {
      setMessages([]);
      wsRef.current?.send(JSON.stringify({ action: 'clear' }));
    }
  };

  return (
    <div className="h-screen flex flex-col bg-stage-bg text-slate-100 overflow-hidden select-none">
      <StageHeader
        online={online}
        audioEnabled={audioEnabled}
        onToggleAudio={setAudioEnabled}
        onInterrupt={handleInterrupt}
        onClear={handleClear}
      />

      <main className="flex-1 flex overflow-hidden">
        <ActsSidebar currentAct={currentAct} onSelectAct={handleSelectAct} />
        <DialogueStream
          messages={messages}
          userInput={userInput}
          onChangeInput={setUserInput}
          onSend={handleSend}
          disabled={isGenerating}
        />
        <ControlsSidebar
          onQuickSend={(text) => {
            setUserInput(text);
          }}
          onInjectCue={handleInjectCue}
          disabled={isGenerating}
        />
      </main>
    </div>
  );
};
