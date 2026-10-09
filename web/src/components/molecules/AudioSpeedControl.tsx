import React from 'react';

interface AudioSpeedControlProps {
  speed: number;
  onChangeSpeed: (newSpeed: number) => void;
}

const SPEED_PRESETS = [
  { label: '0.85x (Pausado)', value: 0.85 },
  { label: '0.95x (Borges)', value: 0.95 },
  { label: '1.0x (Normal)', value: 1.0 },
  { label: '1.15x (Ágil)', value: 1.15 },
];

export const AudioSpeedControl: React.FC<AudioSpeedControlProps> = ({ speed, onChangeSpeed }) => {
  return (
    <div className="flex items-center gap-1.5 bg-stage-surface border border-stage-border px-2 py-1 rounded-lg text-xs font-sans">
      <span className="text-text-tertiary text-[11px]" title="Velocidad y tempo de habla del actor digital">
        Tempo:
      </span>
      <div className="flex items-center gap-1">
        {SPEED_PRESETS.map((preset) => {
          const isActive = Math.abs(speed - preset.value) < 0.03;
          return (
            <button
              key={preset.value}
              type="button"
              onClick={() => onChangeSpeed(preset.value)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                isActive
                  ? 'bg-gold/20 text-gold-light border border-gold/40 font-bold'
                  : 'text-text-tertiary hover:text-text-secondary hover:bg-white/5'
              }`}
              title={`Ajustar cadencia a ${preset.label}`}
            >
              {preset.value}x
            </button>
          );
        })}
      </div>
    </div>
  );
};
