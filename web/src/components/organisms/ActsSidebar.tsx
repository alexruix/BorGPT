import React from 'react';
import type { TheatricalPhase } from '@/types/stage';
import { PLAY_PHASES } from '@/constants/theatre';
import { PhaseCard } from '@/components/molecules/PhaseCard';
import { Badge } from '@/components/atoms/Badge';


interface ActsSidebarProps {
  currentPhase: TheatricalPhase;
  onSelectPhase: (phase: TheatricalPhase) => void;
}

export const ActsSidebar: React.FC<ActsSidebarProps> = ({ currentPhase, onSelectPhase }) => {
  return (
    <aside
      className="w-84 bg-stage-surface/95 border-r border-stage-border p-4 flex flex-col gap-3 overflow-y-auto z-10 select-none"
      aria-label="Panel de progresión y actos"
    >
      <div className="flex items-center justify-between border-b border-stage-border pb-2">
        <span className="font-display text-xs text-gold-light font-semibold">
          Actos y fases dramáticas
        </span>
        <Badge variant="default">
          {PLAY_PHASES.length} fases
        </Badge>
      </div>

      <div className="flex flex-col gap-2.5">
        {PLAY_PHASES.map((phase, idx) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            index={idx}
            isActive={currentPhase === phase.id}
            onSelect={onSelectPhase}
          />
        ))}
      </div>

      <div className="mt-auto pt-3 border-t border-stage-border/60">
        <div className="bg-stage-card/60 fileteado-gold rounded-xl p-3 text-xs font-sans text-text-tertiary leading-relaxed">
          <div className="flex items-center gap-1.5 text-gold-light font-display font-semibold text-xs mb-1">
            <span aria-hidden="true">🎭</span>
            <span>Avatar único</span>
          </div>
          BorGPT modula su crueldad sin cambiar de personaje en pantalla.
        </div>
      </div>
    </aside>
  );
};




