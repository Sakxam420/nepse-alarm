import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  RefreshCw,
  Cpu,
  Info,
} from 'lucide-react';
import { Prediction } from '../../types/stock';
import { Badge } from '../common/Badge';

interface PredictionCardProps {
  prediction: Prediction | null;
  training: boolean;
  onRetrain: () => void;
  onOpenArchitecture: () => void;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  prediction,
  training,
  onRetrain,
  onOpenArchitecture,
}) => {
  const trend = prediction?.trend || 'Neutral';
  const confidence = prediction?.confidence || 50;
  const isBullish = trend === 'Bullish';
  const isBearish = trend === 'Bearish';

  const badgeVariant = isBullish ? 'emerald' : isBearish ? 'rose' : 'amber';

  const probs = prediction?.probabilities || {
    bullish: isBullish ? 70 : 15,
    neutral: isBullish ? 20 : isBearish ? 20 : 60,
    bearish: isBearish ? 65 : 10,
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl surface-card flex flex-col justify-between gap-5 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Cpu className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white tracking-tight">AI Recommendation</h3>
            <span className="text-[10px] text-slate-400 block font-mono">
              LSTM + XGBoost Engine
            </span>
          </div>
        </div>
        <Badge variant={badgeVariant} size="sm">
          {prediction?.source || 'ML ENGINE'}
        </Badge>
      </div>

      {/* Signal Verdict & Circular Progress */}
      <div className="flex items-center justify-around py-2 gap-4">
        {/* Ring */}
        <div className="relative h-24 w-24 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              className="text-slate-800"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              className={isBullish ? 'text-emerald-400' : isBearish ? 'text-rose-400' : 'text-amber-400'}
              strokeWidth="6"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * confidence) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-lg font-mono font-bold text-white">
              {confidence.toFixed(0)}%
            </span>
            <span className="text-[9px] uppercase text-slate-400 font-semibold tracking-wider">
              CONFIDENCE
            </span>
          </div>
        </div>

        {/* Big Verdict */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-wider font-mono text-slate-400">
            Expected Trend
          </span>
          <div className="flex items-center gap-1.5">
            {isBullish && <TrendingUp className="h-6 w-6 text-emerald-400" />}
            {isBearish && <TrendingDown className="h-6 w-6 text-rose-400" />}
            {!isBullish && !isBearish && <Activity className="h-5 w-5 text-amber-400" />}
            <span
              className={`text-2xl font-black tracking-tight ${
                isBullish ? 'text-emerald-400' : isBearish ? 'text-rose-400' : 'text-amber-400'
              }`}
            >
              {trend}
            </span>
          </div>
          <span className="text-xs text-slate-300 italic max-w-[200px] line-clamp-2 mt-0.5">
            "{prediction?.message}"
          </span>
        </div>
      </div>

      {/* Probabilities */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="text-emerald-400">Bullish: {probs.bullish}%</span>
          <span className="text-amber-400">Neutral: {probs.neutral}%</span>
          <span className="text-rose-400">Bearish: {probs.bearish}%</span>
        </div>
        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
          <div style={{ width: `${probs.bullish}%` }} className="bg-emerald-500 transition-all duration-500" />
          <div style={{ width: `${probs.neutral}%` }} className="bg-amber-500 transition-all duration-500" />
          <div style={{ width: `${probs.bearish}%` }} className="bg-rose-500 transition-all duration-500" />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
        <button
          onClick={onRetrain}
          disabled={training}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${training ? 'animate-spin text-emerald-400' : ''}`} />
          <span>{training ? 'Fitting Weights...' : 'Retrain Model'}</span>
        </button>

        <button
          onClick={onOpenArchitecture}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Explain AI Pipeline"
        >
          <Info className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
