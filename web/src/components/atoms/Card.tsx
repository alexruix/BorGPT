import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
  elevation?: 'surface' | 'card' | 'elevated';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  interactive = false,
  elevation = 'card',
  className = '',
  ...props
}) => {
  const elevationStyles = {
    surface: 'bg-stage-surface border border-stage-border',
    card: 'bg-stage-card fileteado-frame rounded-xl',
    elevated: 'bg-stage-elevated fileteado-frame rounded-xl shadow-xl',
  };

  const interactiveStyles = interactive ? 'stage-card-interactive cursor-pointer' : '';

  return (
    <div
      className={`${elevationStyles[elevation]} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
