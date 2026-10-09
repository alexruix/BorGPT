import React from 'react';
import { StatusPill } from '../atoms/StatusPill';
import { AudioToggle } from '../atoms/AudioToggle';
import { PanicButton } from '../atoms/PanicButton';

interface StageHeaderProps {
  online: boolean;
  audioEnabled: boolean;
  onToggleAudio: (state: boolean) => void;
  onInterrupt: () => void;
  onClear: () => void;
}

export const StageHeader: React.FC<StageHeaderProps> = ({
  online,
  audioEnabled,
  onToggleAudio,
  onInterrupt,
  onClear,
}) => {
  return (
    <header className="bg-gradient-to-b from-[#161822] to-stage-surface border-b border-stage-border px-6 py-2.5 flex items-center justify-between z-10 select-none">
      <div className="flex items-baseline gap-3">
        <h1 className="font-display font-bold text-lg tracking-widest text-gold-light drop-shadow-[0_0_12px_rgba(212,175,55,0.3)]">
          BorGPT
        </h1>
        <span className="font-mono text-[11px] text-slate-400 tracking-wider uppercase">
          Regiduría & Cabina Teatral
        </span>
      </div>

      <div className="flex items-center gap-3">
        <PanicButton onInterrupt={onInterrupt} />
        <AudioToggle enabled={audioEnabled} onToggle={onToggleAudio} />
        <StatusPill online={online} />
        <button
          onClick={onClear}
          className="text-slate-400 hover:text-slate-200 border border-stage-border hover:border-slate-500 rounded px-2.5 py-1 text-xs font-mono transition-colors"
        >
          Limpiar
        </button>
      </div>
    </header>
  );
};
