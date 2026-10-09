import React from 'react';
import { PingDot, type PingDotColor } from '../atoms';

interface StatusPillProps {
  online: boolean;
  disconnectReason?: string;
  isGenerating?: boolean;
  isPlayingAudio?: boolean;
}

export const StatusPill: React.FC<StatusPillProps> = ({
  online,
  disconnectReason,
  isGenerating,
  isPlayingAudio,
}) => {
  let statusText = 'Sin conexión';
  let dotColor: PingDotColor = 'red';
  let isPinging = false;
  let textColor = 'text-red-400';

  if (online) {
    if (isPlayingAudio) {
      statusText = 'Hablando en sala';
      dotColor = 'gold';
      isPinging = true;
      textColor = 'text-gold-light';
    } else if (isGenerating) {
      statusText = 'Pensando respuesta...';
      dotColor = 'celeste';
      isPinging = true;
      textColor = 'text-arg-celeste-light';
    } else {
      statusText = 'En espera';
      dotColor = 'emerald';
      isPinging = false;
      textColor = 'text-emerald-400';
    }
  }

  const tooltipText = !online && disconnectReason ? disconnectReason : undefined;

  return (
    <div
      role="status"
      aria-live="polite"
      title={tooltipText}
      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full text-xs font-sans select-none border transition-all ${
        !online
          ? 'bg-red-950/40 border-red-500/40 cursor-help'
          : 'bg-stage-card/90 border-stage-border'
      }`}
    >
      <PingDot color={dotColor} isPinging={isPinging} size="md" />
      <span className={`font-medium ${textColor}`}>{statusText}</span>
      {!online && disconnectReason && (
        <span className="hidden md:inline-block max-w-50 truncate text-[10px] text-red-300/80 font-mono pl-1 border-l border-red-500/30">
          {disconnectReason}
        </span>
      )}
    </div>
  );
};
