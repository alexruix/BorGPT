import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'naranja' | 'gold';
  className?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ variant = 'default', className = '', rows = 2, ...props }, ref) => {
    const variantStyles = {
      default:
        'bg-stage-card border border-stage-border focus:border-arg-celeste rounded-xl px-4 py-2.5 text-text-primary font-body text-sm placeholder-text-tertiary shadow-inner focus:ring-1 focus:ring-arg-celeste/40',
      naranja:
        'bg-stage-card border border-arg-naranja/50 focus:border-arg-naranja rounded-lg p-2.5 text-xs font-mono text-arg-naranja-light placeholder-text-tertiary shadow-inner focus:ring-1 focus:ring-arg-naranja/40',
      gold:
        'bg-stage-card border border-gold/50 focus:border-gold rounded-xl p-3 text-sm font-body text-gold-light placeholder-text-tertiary shadow-inner focus:ring-1 focus:ring-gold/40',
    };

    return (
      <textarea
        ref={ref}
        rows={rows}
        className={`w-full focus:outline-none resize-none transition-all ${variantStyles[variant]} ${className}`}
        {...props}
      />
    );
  }
);

TextArea.displayName = 'TextArea';
