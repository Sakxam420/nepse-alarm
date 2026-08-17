import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'cyan' | 'emerald' | 'rose' | 'amber' | 'neutral' | 'outline' | 'sector';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  const variantClasses = {
    primary: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
    cyan: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/20',
    rose: 'bg-red-500/10 text-red-400 border border-red-500/30 shadow-sm shadow-red-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    neutral: 'bg-slate-800/80 text-slate-300 border border-slate-700/50',
    outline: 'bg-transparent text-slate-400 border border-slate-700',
    sector: 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 uppercase font-mono tracking-wider',
  }[variant];

  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-md font-mono transition-colors ${sizeClasses} ${variantClasses} ${className}`}>
      {children}
    </span>
  );
};
