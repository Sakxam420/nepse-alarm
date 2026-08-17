import React from 'react';
import { Layers, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Prediction } from '../../types/stock';
import { Badge } from '../common/Badge';

interface SignalConfluenceProps {
  prediction: Prediction | null;
}

export const SignalConfluence: React.FC<SignalConfluenceProps> = ({ prediction }) => {
  const consensus = prediction?.timeframeConsensus || {
    shortTerm: 'Bullish',
    mediumTerm: 'Neutral',
    macroTrend: 'Bullish',
  };

  const renderIcon = (trend: string) => {
    if (trend === 'Bullish') return <TrendingUp className="h-4 w-4 text-emerald-400" />;
    if (trend === 'Bearish') return <TrendingDown className="h-4 w-4 text-rose-400" />;
    return <Minus className="h-4 w-4 text-amber-400" />;
  };

  const getVariant = (trend: string): 'emerald' | 'rose' | 'amber' => {
    if (trend === 'Bullish') return 'emerald';
    if (trend === 'Bearish') return 'rose';
    return 'amber';
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl surface-card flex flex-col justify-between gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white tracking-tight">Time Horizon Consensus</h3>
            <span className="text-[10px] text-slate-400 block font-mono">
              Short, Medium & Long-term Signals
            </span>
          </div>
        </div>
      </div>

      {/* 3 Horizon Cards */}
      <div className="grid grid-cols-3 gap-2.5 py-1">
        {/* Short Term */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center text-center gap-1.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
            Short (5D)
          </span>
          <div className="p-1.5 rounded-lg bg-slate-800">
            {renderIcon(consensus.shortTerm)}
          </div>
          <Badge variant={getVariant(consensus.shortTerm)} size="sm">
            {consensus.shortTerm}
          </Badge>
        </div>

        {/* Medium Term */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center text-center gap-1.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
            Medium (20D)
          </span>
          <div className="p-1.5 rounded-lg bg-slate-800">
            {renderIcon(consensus.mediumTerm)}
          </div>
          <Badge variant={getVariant(consensus.mediumTerm)} size="sm">
            {consensus.mediumTerm}
          </Badge>
        </div>

        {/* Macro Trend */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center text-center gap-1.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
            Macro (50D)
          </span>
          <div className="p-1.5 rounded-lg bg-slate-800">
            {renderIcon(consensus.macroTrend)}
          </div>
          <Badge variant={getVariant(consensus.macroTrend)} size="sm">
            {consensus.macroTrend}
          </Badge>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 text-center">
        <span>Consensus is bullish across short & long horizons.</span>
      </div>
    </div>
  );
};
