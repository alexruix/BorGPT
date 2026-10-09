import React from 'react';
import { Kbd } from '../atoms';

interface AudioToggleProps {
  enabled: boolean;
  isPlaying?: boolean;
  onToggle: (nextState: boolean) => void;
}

export const AudioToggle: React.FC<AudioToggleProps> = ({ enabled, isPlaying, onToggle }) => {
  return (
    <button
      type="button"
      onClick={() => onToggle(!enabled)}
      aria-pressed={enabled}
      title="Activar o silenciar los parlantes de la sala (Ctrl+M)"
      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-xs font-sans transition-all cursor-pointer ${
        enabled
          ? 'bg-stage-card border-gold/40 text-gold-light shadow-sm shadow-gold/10 hover:border-gold'
          : 'bg-stage-surface border-stage-border text-text-tertiary hover:text-text-secondary'
      }`}
    >
      <div className="flex items-end gap-0.5 h-3.5 w-4" aria-hidden="true">
        {enabled && isPlaying ? (
          <>
            <span className="w-0.5 bg-gold rounded-full animate-wave-1"></span>
            <span className="w-0.5 bg-gold rounded-full animate-wave-2"></span>
            <span className="w-0.5 bg-gold rounded-full animate-wave-3"></span>
            <span className="w-0.5 bg-gold rounded-full animate-wave-4"></span>
          </>
        ) : (
          <span className="text-xs">{enabled ? '🔊' : '🔇'}</span>
        )}
      </div>
      <span className="font-medium">{enabled ? 'Parlantes de sala activos' : 'Parlantes en silencio'}</span>
      <Kbd className="hidden md:inline-block">
        Ctrl+M
      </Kbd>
    </button>
  );
};
