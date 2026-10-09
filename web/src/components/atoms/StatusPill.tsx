import React from 'react';

interface StatusPillProps {
  online: boolean;
  label?: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({ online, label }) => {
  return (
    <div className="flex items-center gap-2 bg-stage-card border border-stage-border px-3 py-1 rounded-full text-xs font-mono">
      <div
        className={`w-2 h-2 rounded-full ${
          online
            ? 'bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse-slow'
            : 'bg-red-500 shadow-[0_0_8px_#ef4444]'
        }`}
      />
      <span className={online ? 'text-slate-200' : 'text-slate-400'}>
        {label || (online ? 'En Línea' : 'Desconectado')}
      </span>
    </div>
  );
};
