import React from 'react';
import { PriceBar } from '../../types/stock';
import { computePriceStats } from '../../utils/financialCalculations';

const fmtK = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v.toFixed(0);
const fmtP = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;

interface MetricCardProps {
  label: string;
  sub?: string;
  children: React.ReactNode;
}
const MetricCard = ({ label, sub, children }: MetricCardProps) => (
  <div className="card p-4 flex flex-col gap-2.5">
    <div>
      <div className="text-xs font-medium text-slate-400">{label}</div>
      {sub && <div className="text-[11px]" style={{ color: '#334155' }}>{sub}</div>}
    </div>
    {children}
  </div>
);

interface RangeBarProps {
  low: number;
  high: number;
  current: number;
  color?: string;
}
const RangeBar = ({ low, high, current, color = '#60a5fa' }: RangeBarProps) => {
  const range = high - low || 1;
  const pct = Math.min(Math.max(((current - low) / range) * 100, 0), 100);
  return (
    <div>
      <div className="h-1.5 w-full rounded-full relative" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div style={{ width: `${pct}%`, background: color }} className="h-full rounded-full transition-all duration-500" />
      </div>
      <div className="flex justify-between text-[11px] font-mono mt-1" style={{ color: '#475569' }}>
        <span>{low.toFixed(0)}</span>
        <span className="text-white">{current.toFixed(2)}</span>
        <span>{high.toFixed(0)}</span>
      </div>
    </div>
  );
};

interface KeyMetricsGridProps {
  history: PriceBar[];
}

export const KeyMetricsGrid: React.FC<KeyMetricsGridProps> = ({ history }) => {
  const s = computePriceStats(history);
  if (!s.latest) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-4"><div className="skeleton h-16 rounded-lg" /></div>
        ))}
      </div>
    );
  }

  const volVsAvg = s.avgVolume30 > 0 ? (s.totalVolume / s.avgVolume30) * 100 : 100;
  const trendUp = s.latest.close >= (s.latest.ema50 ?? s.latest.close);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Today's Range */}
      <MetricCard label="Today's Range" sub={`Day High / Low`}>
        <RangeBar low={s.dayLow} high={s.dayHigh} current={s.dayClose} color="#22c55e" />
      </MetricCard>

      {/* 52-Week Range */}
      <MetricCard label="52-Week Range" sub={`${s.pricePosition52W.toFixed(0)}% of range`}>
        <RangeBar low={s.week52Low} high={s.week52High} current={s.dayClose} color="#60a5fa" />
      </MetricCard>

      {/* Volume */}
      <MetricCard label="Volume" sub={`30D Avg: ${fmtK(s.avgVolume30)}`}>
        <div className="flex items-end gap-2">
          <span className="text-xl font-bold font-mono text-white">{fmtK(s.totalVolume)}</span>
          <span
            className="text-xs font-semibold mb-0.5"
            style={{ color: volVsAvg >= 100 ? '#4ade80' : '#94a3b8' }}
          >
            {fmtP(volVsAvg - 100)} vs avg
          </span>
        </div>
      </MetricCard>

      {/* EMA Bias */}
      <MetricCard label="50-Day Trend" sub={s.latest.ema50 ? `EMA: ${s.latest.ema50.toFixed(0)}` : '—'}>
        <div>
          <span
            className="inline-block text-xs font-semibold px-2.5 py-1 rounded-lg"
            style={{
              background: trendUp ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              color: trendUp ? '#4ade80' : '#f87171',
              border: `1px solid ${trendUp ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
            }}
          >
            {trendUp ? '↑ Above EMA 50' : '↓ Below EMA 50'}
          </span>
          {s.latest.ema50 && (
            <p className="text-[11px] mt-1.5 font-mono" style={{ color: '#475569' }}>
              {fmtP(((s.latest.close - s.latest.ema50) / s.latest.ema50) * 100)} deviation
            </p>
          )}
        </div>
      </MetricCard>
    </div>
  );
};
