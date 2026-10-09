import React from 'react';

interface ThoughtBubbleProps {
  thought: string;
}

export const ThoughtBubble: React.FC<ThoughtBubbleProps> = ({ thought }) => {
  if (!thought) return null;

  return (
    <div className="bg-thought-bg border border-dashed border-thought-border rounded-md px-3 py-2 mb-3 font-mono text-xs text-thought-gold leading-relaxed flex items-start gap-2 shadow-sm animate-fadeIn">
      <span className="text-sm">🧠</span>
      <div>
        <span className="font-bold uppercase tracking-wider text-[10px] text-amber-500 block mb-0.5">
          Deliberación Interior de Cabina:
        </span>
        <span>{thought}</span>
      </div>
    </div>
  );
};
