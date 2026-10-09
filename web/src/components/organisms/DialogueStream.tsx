import React, { useRef, useEffect } from 'react';
import type { DialogueMessage } from '@/types/stage';
import { SYSTEM_COPIES } from '@/constants/theatre';
import { ThoughtBubble, QuickSafetyPhrases } from '@/components/molecules';
import { Button, Kbd, PingDot, TextArea } from '@/components/atoms';



interface DialogueStreamProps {
  messages: DialogueMessage[];
  userInput: string;
  onChangeInput: (val: string) => void;
  onSend: () => void;
  disabled?: boolean;
  manualApproval?: boolean;
  pendingText?: string;
  pendingThought?: string;
  pendingAudio?: string[];
  onChangePendingText?: (val: string) => void;
  onReleasePending?: () => void;
  onDiscardPending?: () => void;
}

export const DialogueStream: React.FC<DialogueStreamProps> = ({
  messages,
  userInput,
  onChangeInput,
  onSend,
  disabled,
  manualApproval,
  pendingText,
  pendingThought,
  pendingAudio = [],
  onChangePendingText,
  onReleasePending,
  onDiscardPending,
}) => {

  const streamEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    streamEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pendingText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <section className="flex-1 flex flex-col albiceleste-stripes-bg h-full relative overflow-hidden" aria-label="Diálogo en vivo">
      {/* Stream Area */}
      <div
        className="flex-1 p-6 overflow-y-auto flex flex-col gap-4"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.map((msg) => (
          <article
            key={msg.id}
            className={`max-w-[85%] rounded-2xl p-4.5 transition-all shadow-lg ${
              msg.sender === 'borges'
                ? 'self-end bg-linear-to-br from-stage-card to-stage-surface border border-stage-border border-borges-albiceleste text-text-primary'
                : 'self-start bg-linear-to-br from-stage-card to-stage-surface border border-gold/30 shadow-gold/10 text-text-primary'
            }`}
          >
            {/* Header / Sender */}
            <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-white/5 font-sans text-xs">
              <div className="flex items-center gap-2">
                <PingDot
                  color={msg.sender === 'borgpt' ? 'gold' : 'celeste'}
                  size="md"
                />
                <span className={msg.sender === 'borgpt' ? 'font-display font-semibold text-gold-light' : 'text-text-primary font-sans'}>
                  {msg.sender === 'borges' ? 'Borges (en escena)' : 'BorGPT (en pantalla)'}
                </span>
              </div>
              <time className="text-[11px] text-text-tertiary font-mono">{msg.timestamp}</time>
            </div>

            {/* Inner Thought HUD (Operator only) */}
            {msg.thought && <ThoughtBubble thought={msg.thought} />}

            {/* Main Dialogue Content */}
            <div className={`whitespace-pre-wrap leading-relaxed text-sm md:text-base ${
              msg.sender === 'borges' ? 'font-body italic text-text-secondary' : 'font-body text-text-primary'
            }`}>
              {msg.text}
              {msg.isStreaming && (
                <span className="inline-block w-2 h-4 bg-gold ml-1.5 align-middle animate-blink shadow-[0_0_8px_var(--color-gold)]" aria-label="Escribiendo..." />
              )}
            </div>
          </article>
        ))}

        {/* Pending Validation HUD (Hold to Release) */}
        {manualApproval && pendingText && (
          <div className="bg-stage-card border border-arg-celeste/70 rounded-2xl p-4 shadow-xl shadow-arg-celeste/10 animate-fadeIn">
            <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-arg-celeste/20">
              <div className="flex items-center gap-2">
                <PingDot color="celeste" isPinging={true} size="md" />
                <span className="font-display font-semibold text-xs text-arg-celeste-light">
                  Respuesta retenida (podés editarla antes de lanzar)
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                {pendingAudio.length > 0 ? (
                  <span className="flex items-center gap-1.5 text-gold-light bg-gold/15 px-2 py-0.5 rounded-md border border-gold/30">
                    <span className="inline-block w-2 h-2 rounded-full bg-gold animate-pulse" />
                    <span>Voz de Borges lista ({pendingAudio.length} {pendingAudio.length === 1 ? 'oración' : 'oraciones'})</span>
                  </span>
                ) : (
                  <span className="text-text-tertiary">
                    Sintetizando voz en GPU...
                  </span>
                )}
              </div>
            </div>

            {pendingThought && (
              <div className="mb-2">
                <ThoughtBubble thought={pendingThought} />
              </div>
            )}

            {onChangePendingText ? (
              <TextArea
                variant="gold"
                value={pendingText}
                onChange={(e) => onChangePendingText(e.target.value)}
                rows={3}
                aria-label="Editar texto retenido antes de emitir"
                className="mb-3 text-sm"
              />
            ) : (
              <p className="font-body text-text-primary text-sm leading-relaxed mb-3 select-text bg-stage-bg/60 p-3 rounded-xl border border-stage-border">
                {pendingText}
              </p>
            )}

            <div className="flex items-center gap-2 pt-1">
              <Button
                variant="primary"
                size="md"
                onClick={onReleasePending}
                className="shadow-md"
              >
                <span>Lanzar</span>
                <Kbd variant="gold">
                  Espacio
                </Kbd>
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={onDiscardPending}
                className="hover:border-red-400/60 hover:text-red-300 text-xs"
              >
                Descartar
              </Button>
            </div>
          </div>
        )}


        <div ref={streamEndRef} />
      </div>

      {/* Operator Input Region (Gestalt: Región común, alta visibilidad de estado y affordance) */}
      <div className="bg-stage-surface/95 border-t border-stage-border p-3.5 backdrop-blur-sm shadow-2xl">
        <div className="max-w-4xl mx-auto flex flex-col gap-2.5">
          {/* Header de la región de entrada: Contexto + Frases de auxilio */}
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-display font-semibold text-arg-sol-light flex items-center gap-1.5">
                <span aria-hidden="true">🎭</span>
                <span>Pie del actor en escena</span>
              </span>
              <span className="text-[10px] font-mono text-text-tertiary">
                ({userInput.trim().length} car.)
              </span>
            </div>
            {/* Quick Safety Contingency Phrases */}
            <QuickSafetyPhrases onSelectPhrase={onChangeInput} disabled={disabled} />
          </div>

          {/* Caja de control unificada con relieve */}
          <div className="fileteado-frame rounded-2xl bg-stage-card p-2 flex flex-col gap-2 focus-within:ring-1 focus-within:ring-arg-celeste/60 focus-within:border-arg-celeste/80 transition-all">
            <TextArea
              ref={inputRef}
              value={userInput}
              onChange={(e) => onChangeInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder={SYSTEM_COPIES.placeholderInput}
              rows={2}
              className="bg-transparent border-0 shadow-none focus:ring-0 px-2 py-1 text-sm md:text-base resize-none"
              aria-label="Pie del actor para responder"
            />

            <div className="flex items-center justify-between pt-2 border-t border-stage-border/40 px-2">
              <div className="flex items-center gap-3 text-[11px] font-sans text-text-tertiary">
                <span className="flex items-center gap-1">
                  <Kbd className="text-text-secondary">Enter</Kbd>
                  <span>{manualApproval ? 'preparar réplica' : 'emitir a sala'}</span>
                </span>
                <span className="hidden sm:inline-block text-stage-border">•</span>
                <span className="hidden sm:flex items-center gap-1">
                  <Kbd className="text-text-secondary">Shift + Enter</Kbd>
                  <span>salto de línea</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {userInput.trim() && (
                  <button
                    type="button"
                    onClick={() => onChangeInput('')}
                    disabled={disabled}
                    className="text-[11px] font-sans text-text-tertiary hover:text-red-400 px-2 py-1 rounded transition-colors cursor-pointer"
                    title="Borrar texto del pie"
                  >
                    Limpiar
                  </button>
                )}
                <Button
                  variant="primary"
                  size="md"
                  onClick={onSend}
                  disabled={disabled || !userInput.trim()}
                  className="px-4 py-1.5 text-xs h-9 shadow-md"
                >
                  <span>{manualApproval ? 'Preparar réplica' : 'Emitir a sala'}</span>
                  <Kbd className="bg-black/30 border-transparent text-noir-950 font-bold">↵</Kbd>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};



