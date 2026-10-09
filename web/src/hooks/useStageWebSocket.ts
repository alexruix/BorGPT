import { useEffect, useRef, useState, useCallback } from 'react';
import type { TheatricalPhase, DialogueMessage, WsMessage } from '@/types/stage';
import { CABINA_CONFIG } from '@/constants/config';
import { SYSTEM_COPIES } from '@/constants/theatre';

interface UseStageWebSocketProps {
  audioEnabled: boolean;
  manualApproval: boolean;
  onAudioSentence: (b64: string) => void;
  onInterruptAudio: () => void;
}

export function useStageWebSocket({
  audioEnabled,
  manualApproval,
  onAudioSentence,
  onInterruptAudio,
}: UseStageWebSocketProps) {
  const [online, setOnline] = useState(false);
  const [disconnectReason, setDisconnectReason] = useState<string>('Iniciando conexión...');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<TheatricalPhase>('omnisciencia_asistente');
  const [pendingText, setPendingText] = useState('');
  const [pendingThought, setPendingThought] = useState('');
  const [pendingAudio, setPendingAudio] = useState<string[]>([]);
  const [messages, setMessages] = useState<DialogueMessage[]>([
    {
      id: 'initial',
      sender: 'borgpt',
      text: SYSTEM_COPIES.initialDialogue,
      thought: SYSTEM_COPIES.initialThought,
      timestamp: '00:00:00',
    },
  ]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const isUnmountedRef = useRef(false);

  // Store volatile callbacks/state in refs so connectWebSocket does not rebuild on every render
  const manualApprovalRef = useRef(manualApproval);
  manualApprovalRef.current = manualApproval;

  const onAudioSentenceRef = useRef(onAudioSentence);
  onAudioSentenceRef.current = onAudioSentence;

  const onInterruptAudioRef = useRef(onInterruptAudio);
  onInterruptAudioRef.current = onInterruptAudio;

  const connectWebSocket = useCallback(() => {
    if (isUnmountedRef.current) return;
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    // Connect using current host (Vite dev proxy forwards /ws to backend port 8000 automatically)
    const host = window.location.host;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${host}/ws/stage`;

    setDisconnectReason(`Conectando a ${wsUrl}...`);

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (isUnmountedRef.current) return;
        setOnline(true);
        setDisconnectReason('');
      };

      ws.onclose = (event) => {
        if (isUnmountedRef.current) return;
        setOnline(false);
        const reason = event.code === 1006
          ? `Servidor no responde en ${host} (¿Iniciaste 'npm run dev:server' o 'npm run dev:all'?)`
          : `Conexión cerrada (Código: ${event.code})`;
        setDisconnectReason(reason);

        // Schedule single controlled reconnect
        if (reconnectTimerRef.current) {
          window.clearTimeout(reconnectTimerRef.current);
        }
        reconnectTimerRef.current = window.setTimeout(() => {
          if (!isUnmountedRef.current) {
            connectWebSocket();
          }
        }, CABINA_CONFIG.wsReconnectIntervalMs);
      };

      ws.onerror = () => {
        if (isUnmountedRef.current) return;
        setOnline(false);
        setDisconnectReason(`Fallo de conexión con ${wsUrl}`);
      };

      ws.onmessage = (event) => {
        const data: WsMessage = JSON.parse(event.data);

        if (data.type === 'start') {
          setIsGenerating(true);
          if (manualApprovalRef.current) {
            setPendingText('');
            setPendingThought('');
            setPendingAudio([]);
          } else {
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
          }
        } else if (data.type === 'thought') {
          if (manualApprovalRef.current) {
            setPendingThought(data.text || '');
          } else {
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              if (last && last.sender === 'borgpt') {
                last.thought = data.text;
              }
              return updated;
            });
          }
        } else if (data.type === 'chunk') {
          if (manualApprovalRef.current) {
            setPendingText((prev) => prev + (data.text || ''));
          } else {
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              if (last && last.sender === 'borgpt') {
                last.text += data.text || '';
              }
              return updated;
            });
          }
        } else if (data.type === 'audio_sentence') {
          if (data.audio_base64) {
            if (manualApprovalRef.current) {
              setPendingAudio((prev) => [...prev, data.audio_base64!]);
            } else {
              onAudioSentenceRef.current(data.audio_base64);
            }
          }
        } else if (data.type === 'end') {
          setIsGenerating(false);
          if (!manualApprovalRef.current) {
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              if (last && last.sender === 'borgpt') {
                last.isStreaming = false;
              }
              return updated;
            });
          }
        } else if (data.type === 'interrupted') {
          setIsGenerating(false);
          setPendingText('');
          setPendingAudio([]);
          onInterruptAudioRef.current();
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.sender === 'borgpt') {
              last.isStreaming = false;
              last.text += ` ${SYSTEM_COPIES.interruptedTag}`;
            }
            return updated;
          });
        } else if (data.type === 'mode_changed') {
          if (data.mode) setCurrentPhase(data.mode);
        }
      };
    } catch (error) {
      console.error('Error al inicializar WebSocket:', error);
      setOnline(false);
      setDisconnectReason('Error al inicializar cliente WebSocket');
    }
  }, []);

  useEffect(() => {
    isUnmountedRef.current = false;
    connectWebSocket();

    return () => {
      isUnmountedRef.current = true;
      if (reconnectTimerRef.current) {
        window.clearTimeout(reconnectTimerRef.current);
      }
      wsRef.current?.close();
    };
  }, [connectWebSocket]);

  const sendUserMessage = (text: string) => {
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
  };

  const setPhase = (phaseId: TheatricalPhase) => {
    setCurrentPhase(phaseId);
    wsRef.current?.send(
      JSON.stringify({
        action: 'set_phase',
        phase: phaseId,
      })
    );
  };

  const interrupt = () => {
    setPendingText('');
    setPendingThought('');
    setPendingAudio([]);
    setIsGenerating(false);
    onInterruptAudio();
    wsRef.current?.send(JSON.stringify({ action: 'interrupt' }));
  };

  const injectPrompt = (cue: string) => {
    wsRef.current?.send(JSON.stringify({ action: 'inject', text: cue }));
  };

  const clearHistory = () => {
    setMessages([]);
    setPendingText('');
    setPendingThought('');
    setPendingAudio([]);
    wsRef.current?.send(JSON.stringify({ action: 'clear' }));
  };

  const releasePending = () => {
    if (!pendingText) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `borgpt-${Date.now()}`,
        sender: 'borgpt',
        text: pendingText,
        thought: pendingThought || undefined,
        timestamp: new Date().toLocaleTimeString(),
        isStreaming: false,
      },
    ]);

    if (audioEnabled && pendingAudio.length > 0) {
      pendingAudio.forEach((b64) => onAudioSentence(b64));
    }

    setPendingText('');
    setPendingThought('');
    setPendingAudio([]);
  };

  const discardPending = () => {
    setPendingText('');
    setPendingThought('');
    setPendingAudio([]);
  };

  return {
    online,
    disconnectReason,
    isGenerating,
    currentPhase,
    messages,
    pendingText,
    pendingThought,
    pendingAudio,
    setPendingText,
    sendUserMessage,
    setPhase,
    interrupt,
    injectPrompt,
    clearHistory,
    releasePending,
    discardPending,
  };
}

