import React from 'react';
import { SlidersHorizontal, Info } from 'lucide-react';
import { Prediction } from '../../types/stock';

interface FeatureImportanceProps {
  prediction: Prediction | null;
}

export const FeatureImportance: React.FC<FeatureImportanceProps> = ({ prediction }) => {
  const defaultFeatures: Record<string, number> = {
    'LSTM Sequence Embedding': 0.38,
    'RSI (14) Momentum': 0.24,
    'MACD Histogram Divergence': 0.18,
    'EMA 50 Bias': 0.12,
    'Volume Delta': 0.08,
  };

  const features = prediction?.features && Object.keys(prediction.features).length > 0
    ? prediction.features
    : defaultFeatures;

  const featureColors: Record<string, string> = {
    'LSTM Sequence Embedding': 'bg-cyan-500',
    'LSTM Hidden State': 'bg-cyan-500',
    'RSI 14 Momentum': 'bg-amber-500',
    'RSI (14) Momentum': 'bg-amber-500',
    'RSI 14': 'bg-amber-500',
    'MACD Hist': 'bg-pink-500',
    'MACD Divergence': 'bg-pink-500',
    'MACD Histogram Divergence': 'bg-pink-500',
    'EMA 50 Bias': 'bg-purple-500',
    'Volume Delta': 'bg-blue-500',
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl glass-panel border border-slate-800/80 flex flex-col justify-between gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white tracking-tight">Feature Contribution (XAI)</h3>
            <span className="text-[10px] text-slate-500 font-mono block">
              XGBoost Information Gain Weights
            </span>
          </div>
        </div>
      </div>

      {/* Feature Progress Bars */}
      <div className="flex flex-col gap-3 py-1">
        {Object.entries(features).map(([name, weight]) => {
          const pct = Math.round(weight * 100);
          const barColor = featureColors[name] || 'bg-cyan-500';

          return (
            <div key={name} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-medium">{name}</span>
                <span className="text-slate-400 font-bold">{pct}%</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  style={{ width: `${pct}%` }}
                  className={`h-full ${barColor} rounded-full transition-all duration-1000`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanation Footer */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
        <Info className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
        <span>Weights indicate relative importance in final classification.</span>
      </div>
    </div>
  );
};
