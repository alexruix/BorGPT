import React, { useState } from 'react';

const SCRIPT_CUES = [
  { label: '🎭 Réplica Inicial de Borges', text: 'Me han olvidado... Un ciego es un prisionero y la ceguera es cómplice del olvido.' },
  { label: '📚 Queja de Citas y Fechas', text: '¿Por qué tiene que citar fechas y edición? ¿Usted me copia?' },
  { label: '📺 Duelo de Pasapalabra', text: 'No voy a aceptar ser puesto a prueba en Pasapalabra.' },
  { label: '💔 El Dolor del Nobel Negado', text: '¿Qué sabe usted de mi dolor, criatura infame?' },
  { label: '👰 Invocación de Norah Lange', text: 'Norah, usted... ¿Qué hace usted aquí?' },
  { label: '🗡️ Clímax del Puñal', text: '¡No soy Borges! Yo siempre estuve hecho de fragmentos en la red.' },
];

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

  const handleInject = () => {
    if (!injectText.trim()) return;
    onInjectCue(injectText.trim());
    setInjectText('');
  };

  return (
    <aside className="w-80 bg-stage-surface border-l border-stage-border p-4 flex flex-col gap-4 overflow-y-auto">
      <div>
        <div className="font-display text-xs tracking-wider text-gold-light uppercase border-b border-stage-border pb-1.5 mb-2.5">
          Disparadores del Guion
        </div>
        <div className="flex flex-col gap-1.5">
          {SCRIPT_CUES.map((cue, idx) => (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => onQuickSend(cue.text)}
              className="bg-stage-card border border-stage-border hover:bg-stage-elevated hover:border-gold text-slate-300 hover:text-white text-xs font-serif p-2 rounded text-left transition-colors disabled:opacity-50"
            >
              {cue.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="font-display text-xs tracking-wider text-gold-light uppercase border-b border-stage-border pb-1.5 mb-2.5">
          Apunte Secreto de Cabina
        </div>
        <div className="flex flex-col gap-2">
          <textarea
            value={injectText}
            onChange={(e) => setInjectText(e.target.value)}
            placeholder="Inyectar apunte invisible (ej: 'Insiste con el meme de Los Simpson')"
            rows={3}
            className="w-full bg-stage-card border border-stage-border rounded p-2 text-xs font-mono text-amber-300 placeholder-slate-600 focus:outline-none focus:border-amber-500 resize-none"
          />
          <button
            onClick={handleInject}
            disabled={disabled || !injectText.trim()}
            className="bg-stage-elevated border border-amber-600 text-amber-300 hover:bg-amber-600/20 text-xs font-mono py-1.5 rounded uppercase tracking-wider transition-colors disabled:opacity-40"
          >
            Encolar Apunte Invisible
          </button>
        </div>
      </div>
    </aside>
  );
};
