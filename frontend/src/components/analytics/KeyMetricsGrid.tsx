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
      {/* 1. Day Range */}
      <div className="p-4 rounded-xl surface-card flex flex-col justify-between gap-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Today's Range</span>
          <span className="text-slate-400 text-[11px] font-mono">
            {formatNPR(stats.dayLow)} – {formatNPR(stats.dayHigh)}
          </span>
        </div>

        {/* Range Bar */}
        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden relative">
          <div
            style={{ width: `${stats.pricePositionDay}%` }}
            className="h-full bg-emerald-500 rounded-full"
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Low</span>
          <span>Close: {formatNPR(stats.dayClose)}</span>
          <span>High</span>
        </div>
      </div>

      {/* 2. 52-Week Range */}
      <div className="p-4 rounded-xl surface-card flex flex-col justify-between gap-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">52-Week Range</span>
          <span className="text-slate-400 text-[11px] font-mono">
            {formatNPR(stats.week52Low)} – {formatNPR(stats.week52High)}
          </span>
        </div>

        {/* Range Bar */}
        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden relative">
          <div
            style={{ width: `${stats.pricePosition52W}%` }}
            className="h-full bg-blue-500 rounded-full"
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>52W Low</span>
          <span>{stats.pricePosition52W.toFixed(0)}% of range</span>
          <span>52W High</span>
        </div>
      </div>

      {/* 3. Trading Volume */}
      <div className="p-4 rounded-xl surface-card flex flex-col justify-between gap-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-medium">Trading Volume</span>
          <span className="font-mono text-[11px]">30D Avg: {formatCompact(stats.avgVolume30)}</span>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <span className="text-xl font-bold font-mono text-white">
            {formatCompact(stats.totalVolume)} shares
          </span>
          <span className="text-xs font-mono text-emerald-400 font-medium">
            {((stats.totalVolume / (stats.avgVolume30 || 1)) * 100).toFixed(0)}% vs avg
          </span>
        </div>
      </div>

      {/* 4. Medium-Term Trend */}
      <div className="p-4 rounded-xl surface-card flex flex-col justify-between gap-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-medium">50-Day Moving Average</span>
          <span className="font-mono text-[11px]">{stats.latest.ema50 ? formatNPR(stats.latest.ema50) : '—'}</span>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {stats.latest.close >= (stats.latest.ema50 ?? stats.latest.close)
              ? 'Bullish (Above 50 MA)'
              : 'Bearish (Below 50 MA)'}
          </span>
          <span className="text-xs font-mono text-slate-400">
            {stats.latest.ema50
              ? formatPercentage(((stats.latest.close - stats.latest.ema50) / stats.latest.ema50) * 100)
              : '0.0%'}
          </span>
        </div>
      </div>
    </div>
  );
};
