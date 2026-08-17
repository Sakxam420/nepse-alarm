import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  RefreshCw,
  Cpu,
  Layers,
} from 'lucide-react';
import { Prediction } from '../../types/stock';
import { Badge } from '../common/Badge';

interface PredictionCardProps {
  prediction: Prediction | null;
  selectedSymbol: string;
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

  const glowClass = isBullish
    ? 'glow-text-emerald'
    : isBearish
    ? 'glow-text-rose'
    : 'glow-text-amber';

  const badgeVariant = isBullish ? 'emerald' : isBearish ? 'rose' : 'amber';

  // Probabilities calculation
  const probs = prediction?.probabilities || {
    bullish: isBullish ? 70 : 15,
    neutral: isBullish ? 20 : isBearish ? 20 : 60,
    bearish: isBearish ? 65 : 10,
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl glass-panel border border-slate-800/80 flex flex-col justify-between gap-5 relative overflow-hidden">
      {/* Top Ambient Glow */}
      <div
        className={`absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none ${
          isBullish ? 'bg-emerald-500' : isBearish ? 'bg-rose-500' : 'bg-amber-500'
        }`}
      />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Cpu className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white tracking-tight">AI Decision Support</h3>
            <span className="text-[10px] text-slate-500 font-mono block">
              Hybrid LSTM-XGBoost Engine
            </span>
          </div>
        </div>
        <Badge variant={badgeVariant} size="sm">
          {prediction?.source || 'ML ENGINE'}
        </Badge>
      </div>

      {/* Main Signal Spotlight */}
      <div className="flex flex-col items-center justify-center py-2 text-center gap-3">
        {/* Radial Confidence Ring */}
        <div className="relative h-28 w-28 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              className="text-slate-800"
              strokeWidth="7"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              className={isBullish ? 'text-emerald-400' : isBearish ? 'text-rose-400' : 'text-amber-400'}
              strokeWidth="7"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * confidence) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold tracking-wider">
              CONFIDENCE
            </span>
            <span className="text-xl font-mono font-black text-white">
              {confidence.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Verdict Badge */}
        <div>
          <span className="text-[11px] text-slate-400 font-mono block uppercase tracking-wider mb-0.5">
            MODEL VERDICT
          </span>
          <div className={`text-2xl font-black uppercase tracking-tight flex items-center justify-center gap-1.5 ${glowClass}`}>
            {isBullish && <TrendingUp className="h-6 w-6 text-emerald-400" />}
            {isBearish && <TrendingDown className="h-6 w-6 text-rose-400" />}
            {!isBullish && !isBearish && <Activity className="h-5 w-5 text-amber-400" />}
            <span>{trend}</span>
          </div>
        </div>

        {/* Context message */}
        <p className="text-xs text-slate-300 italic max-w-[300px] leading-relaxed bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/80">
          "{prediction?.message || 'Analyzing market sequences...'}"
        </p>
      </div>

      {/* Probability Distribution Spectrum */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Bull: {probs.bullish}%</span>
          <span>Neutral: {probs.neutral}%</span>
          <span>Bear: {probs.bearish}%</span>
        </div>
        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
          <div
            style={{ width: `${probs.bullish}%` }}
            className="bg-emerald-500 transition-all duration-700"
            title={`Bullish Probability: ${probs.bullish}%`}
          />
          <div
            style={{ width: `${probs.neutral}%` }}
            className="bg-amber-500 transition-all duration-700"
            title={`Neutral Probability: ${probs.neutral}%`}
          />
          <div
            style={{ width: `${probs.bearish}%` }}
            className="bg-rose-500 transition-all duration-700"
            title={`Bearish Probability: ${probs.bearish}%`}
          />
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
        <button
          onClick={onRetrain}
          disabled={training}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${training ? 'animate-spin text-cyan-400' : ''}`} />
          <span>{training ? 'Fitting Weights...' : 'Retrain Pipeline'}</span>
        </button>

        <button
          onClick={onOpenArchitecture}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
          title="View Model Flowchart & Weights"
        >
          <Layers className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
