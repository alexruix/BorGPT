import React from 'react';
import type { ActMetadata, TheatricalAct } from '../../types/stage';

interface ActCardProps {
  act: ActMetadata;
  isActive: boolean;
  onSelect: (actId: TheatricalAct) => void;
}

export const ActCard: React.FC<ActCardProps> = ({ act, isActive, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(act.id)}
      className={`w-full text-left p-2.5 rounded-lg border transition-all relative overflow-hidden ${
        isActive
          ? `bg-stage-elevated ${act.colorClass} shadow-lg`
          : 'bg-stage-card border-stage-border hover:bg-stage-elevated/70 hover:border-slate-600'
      }`}
    >
      <div className="flex items-center justify-between font-serif font-semibold text-sm text-slate-100">
        <span>{act.title}</span>
        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border border-slate-700 bg-stage-bg/60 text-slate-400">
          {act.badge}
        </span>
      </div>
      <p className="font-serif text-xs text-slate-400 mt-1 line-clamp-2 leading-tight">
        {act.description}
      </p>
    </button>
  );
};
