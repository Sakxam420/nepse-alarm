import React from 'react';
import { BarChart2 } from 'lucide-react';
import { Prediction } from '../../types/stock';

interface FeatureImportanceProps {
  prediction: Prediction | null;
}

const DEFAULT_FEATURES = [
  { label: 'Price Momentum (LSTM sequence)', value: 0.40, color: '#60a5fa' },
  { label: 'RSI (14) Momentum', value: 0.25, color: '#a78bfa' },
  { label: 'MACD Trend Expansion', value: 0.18, color: '#34d399' },
  { label: 'EMA 50 Trend Bias', value: 0.10, color: '#fbbf24' },
  { label: 'Volume Accumulation', value: 0.07, color: '#f87171' },
];

export const FeatureImportance: React.FC<FeatureImportanceProps> = ({ prediction }) => {
  let features = DEFAULT_FEATURES;
  if (prediction?.features && Object.keys(prediction.features).length > 0) {
    features = Object.entries(prediction.features).slice(0, 5).map(([label, value], i) => ({
      label,
      value: Number(value),
      color: ['#60a5fa', '#a78bfa', '#34d399', '#fbbf24', '#f87171'][i] ?? '#60a5fa',
    }));
  }

  return (
    <div className="card p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.2)' }}>
          <BarChart2 className="h-4 w-4 text-blue-400" />
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Key Factors</div>
          <div className="text-[11px]" style={{ color: '#475569' }}>What drives this prediction</div>
        </div>
      </div>

      {/* Factor bars */}
      <div className="flex flex-col gap-3">
        {features.map((f, i) => (
          <div key={i}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium" style={{ color: '#94a3b8' }}>{f.label}</span>
              <span className="font-mono font-semibold text-white">{Math.round(f.value * 100)}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div
                style={{ width: `${Math.round(f.value * 100)}%`, background: f.color, transition: 'width 0.6s ease' }}
                className="h-full rounded-full"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Note */}
      <p className="text-[11px] leading-relaxed" style={{ color: '#334155' }}>
        Higher % = stronger influence on the final trend forecast.
      </p>
    </div>
  );
};
