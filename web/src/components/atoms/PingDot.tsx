import React from 'react';

export type PingDotColor = 'emerald' | 'gold' | 'celeste' | 'red' | 'amber';

interface PingDotProps {
  color?: PingDotColor;
  isPinging?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PingDot: React.FC<PingDotProps> = ({
  color = 'emerald',
  isPinging = false,
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  const colorMap: Record<PingDotColor, { ping: string; dot: string; shadow: string }> = {
    emerald: {
      ping: 'bg-emerald-400',
      dot: 'bg-status-live',
      shadow: 'shadow-[0_0_8px_var(--color-status-live)]',
    },
    gold: {
      ping: 'bg-gold-light',
      dot: 'bg-status-voice',
      shadow: 'shadow-[0_0_10px_var(--color-status-voice)]',
    },
    celeste: {
      ping: 'bg-arg-celeste-light',
      dot: 'bg-status-think',
      shadow: 'shadow-[0_0_10px_var(--color-status-think)]',
    },
    red: {
      ping: 'bg-red-300',
      dot: 'bg-status-alert',
      shadow: 'shadow-[0_0_8px_var(--color-status-alert)]',
    },
    amber: {
      ping: 'bg-amber-300',
      dot: 'bg-arg-naranja',
      shadow: 'shadow-[0_0_8px_var(--color-arg-naranja)]',
    },
  };

  const selectedColor = colorMap[color];
  const sizeClass = sizeMap[size];

  return (
    <span className={`flex ${sizeClass} relative inline-flex shrink-0 ${className}`} aria-hidden="true">
      {isPinging && (
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${selectedColor.ping}`}
        />
      )}
      <span className={`relative inline-flex rounded-full ${sizeClass} ${selectedColor.dot} ${selectedColor.shadow}`} />
    </span>
  );
};
