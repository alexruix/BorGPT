import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'panic' | 'ghost' | 'outline' | 'naranja';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  type = 'button',
  ...props
}) => {
  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-3.5 py-2 text-xs',
    lg: 'px-5 py-2.5 text-sm',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'stage-button-primary',
    secondary: 'stage-button-secondary',
    panic:
      'bg-crimson-600 hover:bg-crimson-500 border border-crimson-500/80 hover:border-red-300 text-white font-sans font-semibold shadow-lg shadow-crimson-600/30 hover:shadow-crimson-500/50 hover:brightness-105 active:scale-95 transition-all rounded-lg',
    naranja:
      'bg-arg-naranja hover:bg-arg-naranja-light active:scale-98 text-noir-950 font-sans font-semibold rounded-lg shadow-sm shadow-arg-naranja/20 transition-all',
    ghost:
      'bg-transparent hover:bg-stage-card text-text-secondary hover:text-text-primary transition-all rounded-lg',
    outline:
      'bg-stage-card/50 hover:bg-stage-card border border-stage-border hover:border-stage-border-light text-text-secondary hover:text-text-primary rounded-lg transition-all active:scale-95',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
