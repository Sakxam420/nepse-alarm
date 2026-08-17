import React from 'react';
import { PriceBar } from '../../types/stock';
import { computePriceStats } from '../../utils/financialCalculations';
import { formatNPR, formatCompact, formatPercentage } from '../../utils/formatters';

interface KeyMetricsGridProps {
  history: PriceBar[];
}

export const KeyMetricsGrid: React.FC<KeyMetricsGridProps> = ({ history }) => {
  const stats = computePriceStats(history);

  if (!stats.latest) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Day Range Card */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800/80 flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 font-semibold">Today's Range</span>
          <span className="text-slate-500 text-[10px]">Session Low - High</span>
        </div>

        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-rose-400 font-bold">{formatNPR(stats.dayLow)}</span>
          <span className="text-emerald-400 font-bold">{formatNPR(stats.dayHigh)}</span>
        </div>

        {/* Progress Slider */}
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden relative">
          <div
            style={{ width: `${stats.pricePositionDay}%` }}
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full"
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Current: {formatNPR(stats.dayClose)}</span>
          <span className={stats.dayChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
            {formatPercentage(stats.dayPctChange)}
          </span>
        </div>
      </div>

      {/* 2. 52-Week Range Card */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800/80 flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 font-semibold">52-Week Range</span>
          <span className="text-slate-500 text-[10px]">250-Day Bounds</span>
        </div>

        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-rose-400 font-bold">{formatNPR(stats.week52Low)}</span>
          <span className="text-emerald-400 font-bold">{formatNPR(stats.week52High)}</span>
        </div>

        {/* Progress Slider */}
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden relative">
          <div
            style={{ width: `${stats.pricePosition52W}%` }}
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Position: {stats.pricePosition52W.toFixed(0)}% of range</span>
        </div>
      </div>

      {/* 3. Volume & Liquidity Card */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800/80 flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 font-semibold">Trading Liquidity</span>
          <span className="text-slate-500 text-[10px]">Shares Traded</span>
        </div>

        <div className="flex items-baseline justify-between">
          <span className="text-xl font-bold font-mono text-cyan-300">
            {formatCompact(stats.totalVolume)}
          </span>
          <span className="text-xs font-mono text-slate-400">
            30D Avg: {formatCompact(stats.avgVolume30)}
          </span>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Relative Volume</span>
          <span className="text-white font-bold">
            {((stats.totalVolume / (stats.avgVolume30 || 1)) * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* 4. Moving Average Bias Card */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800/80 flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 font-semibold">Trend Posture</span>
          <span className="text-slate-500 text-[10px]">EMA 50 Reference</span>
        </div>

        <div className="flex items-baseline justify-between">
          <span className="text-xl font-bold font-mono text-white">
            {stats.latest.ema50 ? formatNPR(stats.latest.ema50) : '—'}
          </span>
          <span
            className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              stats.latest.close >= (stats.latest.ema50 ?? stats.latest.close)
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
            }`}
          >
            {stats.latest.close >= (stats.latest.ema50 ?? stats.latest.close)
              ? 'ABOVE EMA 50'
              : 'BELOW EMA 50'}
          </span>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>EMA Spread</span>
          <span className="text-white font-bold">
            {stats.latest.ema50
              ? formatPercentage(((stats.latest.close - stats.latest.ema50) / stats.latest.ema50) * 100)
              : '0.00%'}
          </span>
        </div>
      </div>
    </div>
  );
};
