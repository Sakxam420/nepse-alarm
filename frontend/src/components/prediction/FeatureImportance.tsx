import React from 'react';
import { SlidersHorizontal, Info } from 'lucide-react';
import { Prediction } from '../../types/stock';

interface FeatureImportanceProps {
  prediction: Prediction | null;
}

export const FeatureImportance: React.FC<FeatureImportanceProps> = ({ prediction }) => {
  const defaultFeatures: Record<string, number> = {
    'Price Momentum (LSTM)': 0.40,
    'RSI (14) Momentum': 0.25,
    'MACD Trend Expansion': 0.18,
    'EMA 50 Bias': 0.10,
    'Trading Volume Delta': 0.07,
  };

  const features = prediction?.features && Object.keys(prediction.features).length > 0
    ? prediction.features
    : defaultFeatures;

  return (
    <div className="p-5 sm:p-6 rounded-2xl surface-card flex flex-col justify-between gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white tracking-tight">Key Factors Driving Prediction</h3>
            <span className="text-[10px] text-slate-400 block font-mono">
              Explainable AI (XAI) Weights
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="flex flex-col gap-3 py-1">
        {Object.entries(features).map(([name, weight]) => {
          const pct = Math.round(weight * 100);

          return (
            <div key={name} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">{name}</span>
                <span className="text-slate-400 font-mono font-bold">{pct}%</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  style={{ width: `${pct}%` }}
                  className="h-full bg-blue-500 rounded-full transition-all duration-700"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-slate-400">
        <Info className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        <span>Higher percentage indicates stronger impact on the forecast.</span>
      </div>
    </div>
  );
};
