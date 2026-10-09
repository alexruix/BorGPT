import React from 'react';

interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: 'default' | 'panic' | 'gold' | 'celeste';
  className?: string;
}

export const Kbd: React.FC<KbdProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'stage-kbd',
    panic: 'stage-kbd text-red-200 border-red-500/40 bg-black/40',
    gold: 'stage-kbd text-gold-light border-gold/40 bg-black/40',
    celeste: 'stage-kbd text-arg-celeste-light border-arg-celeste/40 bg-black/40',
  };

  return (
    <kbd className={`${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </kbd>
  );
};
