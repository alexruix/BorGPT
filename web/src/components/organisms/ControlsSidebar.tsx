import React, { useState } from 'react';
import { SCRIPT_CUES, SYSTEM_COPIES } from '@/constants/theatre';
import { Button, Badge, Kbd, TextArea } from '@/components/atoms';

interface ControlsSidebarProps {
  onQuickSend: (text: string) => void;
  onInjectCue: (cue: string) => void;
  disabled?: boolean;
}

export const ControlsSidebar: React.FC<ControlsSidebarProps> = ({
  onQuickSend,
  onInjectCue,
  disabled,
}) => {
  const [injectText, setInjectText] = useState('');
  const [injectedFeedback, setInjectedFeedback] = useState(false);
  const [activeCueIdx, setActiveCueIdx] = useState<number | null>(null);

  const handleCueClick = (cueText: string, idx: number) => {
    setActiveCueIdx(idx);
    onQuickSend(cueText);
  };

  const handleInject = () => {
    if (!injectText.trim()) return;
    onInjectCue(injectText.trim());
    setInjectText('');
    setInjectedFeedback(true);
    setTimeout(() => setInjectedFeedback(false), 2500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleInject();
    }
  };

  const nextSuggestedIdx = activeCueIdx !== null && activeCueIdx + 1 < SCRIPT_CUES.length ? activeCueIdx + 1 : null;

  return (
    <aside
      className="w-88 bg-stage-surface/95 border-l border-stage-border p-4 flex flex-col gap-4 overflow-y-auto z-10 select-none"
      aria-label="Panel de regiduría y apuntes de escena"
    >
      {/* Script Cues */}
      <div>
        <div className="flex items-center justify-between border-b border-stage-border pb-1.5 mb-2.5">
          <span className="font-display text-xs text-gold-light font-semibold">
            Pies de entrada rápidos
          </span>
          <Badge variant="default">
            {SCRIPT_CUES.length} pies
          </Badge>
        </div>

        <div className="flex flex-col gap-2">
          {SCRIPT_CUES.map((cue, idx) => {
            const isSelected = activeCueIdx === idx;
            const isNext = nextSuggestedIdx === idx;

            return (
              <button
                key={idx}
                type="button"
                disabled={disabled}
                onClick={() => handleCueClick(cue.text, idx)}
                title={cue.text}
                className={`group fileteado-frame p-3 rounded-xl text-left disabled:opacity-40 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-gold/90 bg-stage-elevated ring-1 ring-gold/50 card-sol-crown'
                    : isNext
                    ? 'border-arg-celeste/70 bg-stage-card ring-1 ring-arg-celeste/40'
                    : 'bg-stage-card hover:bg-stage-elevated hover:border-arg-celeste/40 text-text-secondary'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className={`font-display font-semibold text-xs transition-colors ${
                    isSelected ? 'text-gold-light' : isNext ? 'text-arg-celeste-light' : 'text-text-primary group-hover:text-arg-celeste-light'
                  }`}>
                    {cue.label}
                  </div>
                  {isNext && (
                    <span className="text-[10px] font-sans text-arg-celeste-light bg-arg-celeste/20 px-1.5 py-0.2 rounded border border-arg-celeste/40">
                      Siguiente
                    </span>
                  )}
                  {isSelected && (
                    <span className="text-[10px] font-sans text-gold-light bg-gold/20 px-1.5 py-0.2 rounded border border-gold/40">
                      Emitido
                    </span>
                  )}
                </div>
                <div className="font-body italic text-xs text-text-secondary leading-snug">
                  "{cue.text}"
                </div>
              </button>
            );
          })}
        </div>
      </div>


      {/* Secret Cabin Prompter / Injection */}
      <div className="mt-auto bg-stage-card border border-arg-naranja/40 rounded-xl p-3.5 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-arg-naranja font-display text-xs font-semibold">
            <span aria-hidden="true">🎙️</span>
            <span>Apuntador</span>
          </div>
          {injectedFeedback && (
            <span className="text-[11px] font-sans text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded animate-fadeIn">
              ✓ Apuntado
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <TextArea
            variant="naranja"
            value={injectText}
            onChange={(e) => setInjectText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={SYSTEM_COPIES.placeholderInject}
            rows={2}
            aria-label="Apunte de dirección de cabina"
          />
          <Button
            variant="naranja"
            size="sm"
            onClick={handleInject}
            disabled={disabled || !injectText.trim()}
            className="w-full justify-between"
          >
            <span>Apuntar</span>
            <Kbd className="bg-black/30 border-transparent text-noir-950 font-bold">
              Ctrl + Enter
            </Kbd>
          </Button>
        </div>
      </div>
    </aside>
  );
};





