import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Prediction } from '../../types/stock';

interface SignalConfluenceProps {
  prediction: Prediction | null;
}

type Trend = 'Bullish' | 'Bearish' | 'Neutral';

const HorizonCard = ({ label, timeframe, trend }: { label: string; timeframe: string; trend: Trend }) => {
  const isBull = trend === 'Bullish';
  const isBear = trend === 'Bearish';
  const color = isBull ? '#4ade80' : isBear ? '#f87171' : '#fbbf24';
  const bg = isBull ? 'rgba(34,197,94,0.08)' : isBear ? 'rgba(239,68,68,0.08)' : 'rgba(251,191,36,0.08)';

  return (
    <div className="flex-1 rounded-xl p-4 flex flex-col items-center gap-2 text-center" style={{ background: bg, border: `1px solid ${color}22` }}>
      <span className="text-[11px] font-medium uppercase tracking-wide" style={{ color: '#64748b' }}>{label}</span>
      <span className="text-[10px]" style={{ color: '#475569' }}>{timeframe}</span>
      <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ background: `${color}15` }}>
        {isBull && <TrendingUp className="h-4 w-4" style={{ color }} />}
        {isBear && <TrendingDown className="h-4 w-4" style={{ color }} />}
        {!isBull && !isBear && <Minus className="h-4 w-4" style={{ color }} />}
      </div>
      <span className="text-sm font-bold" style={{ color }}>{trend}</span>
    </div>
  );
};

export const SignalConfluence: React.FC<SignalConfluenceProps> = ({ prediction }) => {
  const consensus = prediction?.timeframeConsensus ?? {
    shortTerm: 'Bullish' as Trend,
    mediumTerm: 'Neutral' as Trend,
    macroTrend: 'Bullish' as Trend,
  };

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div>
        <div className="text-sm font-semibold text-white">Time Horizon Signals</div>
        <div className="text-[11px] mt-0.5" style={{ color: '#475569' }}>Short, medium, and long-term outlook</div>
      </div>

      <div className="flex gap-3">
        <HorizonCard label="Short" timeframe="~5 days" trend={consensus.shortTerm} />
        <HorizonCard label="Medium" timeframe="~20 days" trend={consensus.mediumTerm} />
        <HorizonCard label="Long" timeframe="~50 days" trend={consensus.macroTrend} />
      </div>

      <p className="text-[11px] leading-relaxed" style={{ color: '#334155' }}>
        Signals are derived from EMA, RSI, and MACD readings across different lookback windows.
      </p>
    </div>
  );
};
