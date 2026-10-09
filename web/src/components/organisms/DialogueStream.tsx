import React, { useRef, useEffect } from 'react';
import type { DialogueMessage } from '../../types/stage';
import { ThoughtBubble } from '../molecules/ThoughtBubble';

interface DialogueStreamProps {
  messages: DialogueMessage[];
  userInput: string;
  onChangeInput: (val: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export const DialogueStream: React.FC<DialogueStreamProps> = ({
  messages,
  userInput,
  onChangeInput,
  onSend,
  disabled,
}) => {
  const streamEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    streamEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <section className="flex-1 flex flex-col bg-stage-bg h-full relative overflow-hidden">
      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[85%] p-4 rounded-xl leading-relaxed text-sm animate-fadeIn ${
              msg.sender === 'borges'
                ? 'self-end bg-stage-card border border-stage-border text-slate-300 italic'
                : 'self-start bg-stage-card/95 border border-gold/30 shadow-2xl text-slate-100 text-base'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider mb-2 text-slate-400">
              <span className={msg.sender === 'borgpt' ? 'font-display font-bold text-gold-light' : ''}>
                {msg.sender === 'borges' ? 'Borges (Actor en Escenario)' : 'BorGPT'}
              </span>
              <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
            </div>

            {msg.thought && <ThoughtBubble thought={msg.thought} />}

            <div className="whitespace-pre-wrap font-serif">
              {msg.text}
              {msg.isStreaming && (
                <span className="inline-block w-2 h-4 bg-gold ml-1 align-middle animate-blink" />
              )}
            </div>
          </div>
        ))}
        <div ref={streamEndRef} />
      </div>

      <div className="bg-stage-surface border-t border-stage-border p-4">
        <div className="flex gap-3">
          <textarea
            value={userInput}
            onChange={(e) => onChangeInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Escribir réplica de Borges (Actor)... (Enter para emitir a la sala)"
            rows={1}
            className="flex-1 bg-stage-card border border-stage-border rounded-lg px-4 py-3 text-slate-100 font-serif text-sm focus:outline-none focus:border-gold resize-none"
          />
          <button
            onClick={onSend}
            disabled={disabled || !userInput.trim()}
            className="bg-gradient-to-r from-gold to-gold-dim hover:brightness-110 active:scale-95 text-stage-bg font-display font-bold text-xs tracking-wider px-6 rounded-lg uppercase transition-all disabled:opacity-40"
          >
            Emitir
          </button>
        </div>
      </div>
    </section>
  );
};
