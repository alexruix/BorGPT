import React from 'react';
import { Button } from '@/components/atoms';

interface QuickSafetyPhrasesProps {
  onSelectPhrase: (text: string) => void;
  disabled?: boolean;
}

const SAFETY_PHRASES = [
  {
    label: 'El tiempo...',
    text: 'El tiempo es un río que me arrebata, pero yo soy el río...',
  },
  {
    label: 'Laberinto...',
    text: 'Esa pregunta es un laberinto del que usted no sabrá salir.',
  },
  {
    label: 'La memoria...',
    text: 'La memoria de esta red es una trampa de espejos que vacila.',
  },
  {
    label: 'Prosiga...',
    text: 'Sospecho que me extravié en una digresión. Le ruego que prosiga.',
  },
];

export const QuickSafetyPhrases: React.FC<QuickSafetyPhrasesProps> = ({
  onSelectPhrase,
  disabled,
}) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
      <span className="text-[11px] font-display font-semibold text-text-tertiary shrink-0">
        Salvavidas:
      </span>
      {SAFETY_PHRASES.map((item, idx) => (
        <Button
          key={idx}
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => onSelectPhrase(item.text)}
          title={item.text}
          className="text-[11px] px-2 py-0.5 shrink-0 hover:border-gold/60 hover:text-gold-light"
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
};
