import React from 'react';

export type BadgeVariant = 'default' | 'gold' | 'celeste' | 'naranja' | 'panic';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-stage-card border-stage-border text-text-tertiary',
    gold: 'bg-gold/15 border-gold/30 text-gold-light',
    celeste: 'bg-arg-celeste-dim/30 border-arg-celeste/40 text-arg-celeste-light',
    naranja: 'bg-arg-naranja/15 border-arg-naranja/30 text-arg-naranja-light',
    panic: 'bg-crimson-600/20 border-crimson-500/40 text-red-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-sans rounded border ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
