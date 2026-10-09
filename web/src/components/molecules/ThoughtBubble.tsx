import React from 'react';

interface ThoughtBubbleProps {
  thought: string;
}

export const ThoughtBubble: React.FC<ThoughtBubbleProps> = ({ thought }) => {
  if (!thought) return null;

  return (
    <div
      role="region"
      aria-label="Acotación e intención escénica de BorGPT"
      className="bg-thought-bg border border-thought-border rounded-lg p-3 mb-3 font-mono text-xs text-gold-light shadow-inner backdrop-blur-xs animate-fadeIn"
    >
      <div className="flex items-center gap-2 mb-1.5 border-b border-thought-border/40 pb-1">
        <span className="flex h-2 w-2 relative" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-light opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
        </span>
        <span className="font-semibold text-xs text-gold">
          Acotación e intención escénica (solo cabina)
        </span>
      </div>
      <p className="leading-relaxed text-xs text-gold-light font-mono select-text">
        {thought}
      </p>
    </div>
  );
};


