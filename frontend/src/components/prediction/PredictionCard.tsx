import React from 'react';
import { TrendingUp, TrendingDown, Activity, RefreshCw, Info, Cpu } from 'lucide-react';
import { Prediction } from '../../types/stock';

interface PredictionCardProps {
  prediction: Prediction | null;
  training: boolean;
  onRetrain: () => void;
  onOpenArchitecture: () => void;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  prediction, training, onRetrain, onOpenArchitecture,
}) => {
  const trend = prediction?.trend ?? 'Neutral';
  const confidence = prediction?.confidence ?? 50;
  const isBullish = trend === 'Bullish';
  const isBearish = trend === 'Bearish';

  const probs = prediction?.probabilities ?? {
    bullish: isBullish ? 68 : 16,
    neutral: isBullish ? 22 : isBearish ? 22 : 60,
    bearish: isBearish ? 62 : 12,
  };

  const trendColor = isBullish ? '#4ade80' : isBearish ? '#f87171' : '#fbbf24';
  const ringOffset = 251.2 - (251.2 * confidence / 100);

  return (
    <div className="card p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(79,142,247,0.12)', border: '1px solid rgba(79,142,247,0.2)' }}>
            <Cpu className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">AI Forecast</div>
            <div className="text-[11px]" style={{ color: '#475569' }}>LSTM + XGBoost</div>
          </div>
        </div>
        <span
          className="text-[11px] font-medium px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {prediction?.source ?? 'ML Engine'}
        </span>
      </div>

      {/* Radial dial + verdict */}
      <div className="flex items-center gap-6">
        {/* Ring */}
        <div className="relative h-[88px] w-[88px] shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="transparent" />
            <circle
              cx="50" cy="50" r="40"
              stroke={trendColor}
              strokeWidth="8"
              strokeDasharray="251.2"
              strokeDashoffset={ringOffset}
              strokeLinecap="round"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-white font-mono">{confidence.toFixed(0)}%</span>
            <span className="text-[9px] uppercase tracking-wide" style={{ color: '#475569' }}>conf.</span>
          </div>
        </div>

        {/* Trend */}
        <div>
          <div className="text-[11px] uppercase tracking-wider mb-1" style={{ color: '#475569' }}>Expected Direction</div>
          <div className="flex items-center gap-2 mb-1.5">
            {isBullish && <TrendingUp className="h-5 w-5" style={{ color: trendColor }} />}
            {isBearish && <TrendingDown className="h-5 w-5" style={{ color: trendColor }} />}
            {!isBullish && !isBearish && <Activity className="h-5 w-5" style={{ color: trendColor }} />}
            <span className="text-xl font-bold" style={{ color: trendColor }}>{trend}</span>
          </div>
          <p className="text-xs leading-relaxed max-w-[180px]" style={{ color: '#94a3b8' }}>
            {prediction?.message ?? 'Analyzing historical patterns…'}
          </p>
        </div>
      </div>

      {/* Probability bar */}
      <div>
        <div className="flex justify-between text-[11px] font-mono mb-1.5" style={{ color: '#64748b' }}>
          <span className="text-green-400">{probs.bullish}% Bull</span>
          <span className="text-slate-400">{probs.neutral}% Neutral</span>
          <span className="text-red-400">{probs.bearish}% Bear</span>
        </div>
        <div className="h-1.5 w-full rounded-full overflow-hidden flex" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div style={{ width: `${probs.bullish}%`, background: '#22c55e' }} className="transition-all duration-700" />
          <div style={{ width: `${probs.neutral}%`, background: '#64748b' }} className="transition-all duration-700" />
          <div style={{ width: `${probs.bearish}%`, background: '#ef4444' }} className="transition-all duration-700" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <button
          onClick={onRetrain}
          disabled={training}
          className="btn flex-1 justify-center text-xs disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${training ? 'animate-spin text-blue-400' : ''}`} />
          {training ? 'Training…' : 'Retrain Model'}
        </button>
        <button onClick={onOpenArchitecture} className="btn text-xs px-3" title="View ML Architecture">
          <Info className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
