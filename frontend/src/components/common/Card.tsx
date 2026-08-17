import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  hover?: boolean;
  glow?: 'cyan' | 'emerald' | 'rose' | 'blue' | 'none';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  elevated = false,
  hover = false,
  glow = 'none',
}) => {
  const glowClasses = {
    cyan: 'hover:shadow-glow-cyan hover:border-cyan-500/40',
    emerald: 'hover:shadow-glow-emerald hover:border-emerald-500/40',
    rose: 'hover:shadow-glow-rose hover:border-rose-500/40',
    blue: 'hover:shadow-glow-blue hover:border-blue-500/40',
    none: '',
  }[glow];

  return (
    <div
      className={`rounded-xl border transition-all duration-300 ${
        elevated ? 'glass-panel-elevated' : 'glass-panel'
      } ${hover ? 'glass-card-hover' : ''} ${glowClasses} ${className}`}
    >
      {children}
    </div>
  );
};
