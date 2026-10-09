import React from 'react';
import type { PhaseMetadata, TheatricalPhase } from '@/types/stage';
import { Card } from '@/components/atoms/Card';

interface PhaseCardProps {
  phase: PhaseMetadata;
  index: number;
  isActive: boolean;
  onSelect: (phaseId: TheatricalPhase) => void;
}

export const PhaseCard: React.FC<PhaseCardProps> = ({ phase, index, isActive, onSelect }) => {
  return (
    <Card
      interactive
      elevation={isActive ? 'elevated' : 'card'}
      onClick={() => onSelect(phase.id)}
      aria-current={isActive ? 'true' : undefined}
      className={`group w-full text-left p-3.5 relative overflow-hidden transition-all ${
        isActive
          ? 'border-gold/80 ring-1 ring-gold/40 shadow-xl shadow-gold/10 card-sol-crown bg-stage-elevated'
          : 'bg-stage-card border-stage-border hover:bg-stage-elevated/80 hover:border-arg-celeste/40 text-text-secondary'
      }`}
    >
      {isActive && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-gold/15 to-transparent pointer-events-none rounded-bl-full" />
      )}


      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
              isActive
                ? 'bg-gold text-noir-950 shadow-sm shadow-gold'
                : 'bg-stage-surface border border-stage-border-light text-text-tertiary group-hover:border-stage-border'
            }`}
          >
            {index + 1}
          </span>
          <span className={`font-display font-semibold text-xs tracking-wide ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>
            {phase.title}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <kbd className="hidden lg:inline-block stage-kbd">
            {index + 1}
          </kbd>
        </div>
      </div>

      <p className="font-body text-xs text-text-secondary leading-snug pl-7">
        {phase.description}
      </p>

      {isActive && (
        <div className="mt-2 pl-7 flex items-center gap-1.5 text-[11px] font-sans text-gold">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" aria-hidden="true"></span>
          <span>Activo</span>
        </div>
      )}
    </Card>
  );
};



