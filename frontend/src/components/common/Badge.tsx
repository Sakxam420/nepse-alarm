import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'red' | 'blue' | 'amber' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
}) => {
  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-[11px]'
    : 'px-2.5 py-1 text-xs';

  const variantClasses: Record<string, string> = {
    green:   'bg-green-500/10 text-green-400 border border-green-500/20',
    red:     'bg-red-500/10 text-red-400 border border-red-500/20',
    blue:    'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    amber:   'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    neutral: 'bg-white/5 text-slate-300 border border-white/8',
    // legacy aliases
    emerald: 'bg-green-500/10 text-green-400 border border-green-500/20',
    rose:    'bg-red-500/10 text-red-400 border border-red-500/20',
    primary: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    cyan:    'bg-blue-500/10 text-blue-300 border border-blue-500/20',
    sector:  'bg-white/5 text-slate-300 border border-white/8',
    outline: 'bg-transparent text-slate-400 border border-white/10',
  };

  const cls = variantClasses[variant] ?? variantClasses.neutral;

  return (
    <span className={`inline-flex items-center font-medium rounded-md tracking-tight ${sizeClasses} ${cls} ${className}`}>
      {children}
    </span>
  );
};
