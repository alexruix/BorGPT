import React from 'react';

interface PanicButtonProps {
  onInterrupt: () => void;
  disabled?: boolean;
}

export const PanicButton: React.FC<PanicButtonProps> = ({ onInterrupt, disabled }) => {
  return (
    <button
      onClick={onInterrupt}
      disabled={disabled}
      title="Corta la voz y el streaming de inmediato en escena"
      className="bg-gradient-to-r from-red-700 to-red-900 border border-red-500 text-white px-3 py-1.5 rounded text-xs font-mono font-bold tracking-wider uppercase shadow-lg shadow-red-900/50 hover:brightness-125 active:scale-95 transition-all disabled:opacity-50"
    >
      ⛔ Interrumpir
    </button>
  );
};
