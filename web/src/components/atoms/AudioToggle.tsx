import React from 'react';

interface AudioToggleProps {
  enabled: boolean;
  onToggle: (nextState: boolean) => void;
}

export const AudioToggle: React.FC<AudioToggleProps> = ({ enabled, onToggle }) => {
  return (
    <label className="flex items-center gap-2 bg-stage-card border border-stage-border px-3 py-1 rounded text-xs font-mono text-slate-300 cursor-pointer hover:border-slate-500 transition-colors">
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => onToggle(e.target.checked)}
        className="rounded bg-stage-bg border-slate-700 text-gold focus:ring-0 cursor-pointer"
      />
      <span>🔊 Voz en Sala</span>
    </label>
  );
};
