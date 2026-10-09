import React from 'react';
import { Button, PingDot, Kbd } from '../atoms';

interface PanicButtonProps {
  onInterrupt: () => void;
  disabled?: boolean;
}

export const PanicButton: React.FC<PanicButtonProps> = ({ onInterrupt, disabled }) => {
  return (
    <Button
      variant="panic"
      size="sm"
      onClick={onInterrupt}
      disabled={disabled}
      aria-label="Cortar voz y respuesta de inmediato (tecla Escape)"
      title="Corta la voz de BorGPT y frena la respuesta en vivo (Escape)"
    >
      <PingDot color="red" isPinging={true} size="md" />
      <span>Cortar voz</span>
      <Kbd variant="panic" className="hidden sm:inline-block">
        ESC
      </Kbd>
    </Button>
  );
};
