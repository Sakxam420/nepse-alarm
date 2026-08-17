import React from 'react';
import { CheckCircle2, XCircle, MinusCircle } from 'lucide-react';
import { PriceBar } from '../../types/stock';
import { computeTechnicalVerdict } from '../../utils/financialCalculations';

interface TechnicalSummaryMeterProps {
  latestBar: PriceBar | null;
}

export const TechnicalSummaryMeter: React.FC<TechnicalSummaryMeterProps> = ({ latestBar }) => {
  const v = computeTechnicalVerdict(latestBar);

  const signalColor =
    v.signal.includes('BUY') ? '#4ade80' :
    v.signal.includes('SELL') ? '#f87171' : '#fbbf24';

  const barColor =
    v.score >= 60 ? '#22c55e' :
    v.score <= 40 ? '#ef4444' : '#f59e0b';

  return (
    <div className="card p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-white">Technical Analysis</div>
          <div className="text-[11px] mt-0.5" style={{ color: '#475569' }}>Indicator Scorecard</div>
        </div>
        <span
          className="text-sm font-bold px-3 py-1 rounded-lg"
          style={{ background: `${signalColor}15`, color: signalColor, border: `1px solid ${signalColor}30` }}
        >
          {v.signal}
        </span>
      </div>

      {/* Gauge bar */}
      <div>
        <div className="flex justify-between text-xs mb-2" style={{ color: '#64748b' }}>
          <span>Bearish</span>
          <span className="font-mono font-semibold text-white">{v.score}/100</span>
          <span>Bullish</span>
        </div>
        <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div
            style={{ width: `${v.score}%`, background: barColor, transition: 'width 0.7s ease' }}
            className="h-full rounded-full"
          />
        </div>
        <div className="flex gap-4 text-[11px] mt-2 font-mono" style={{ color: '#475569' }}>
          <span className="text-green-400">▲ {v.bullishCount} Bullish</span>
          <span className="text-slate-400">— {v.neutralCount} Neutral</span>
          <span className="text-red-400">▼ {v.bearishCount} Bearish</span>
        </div>
      </div>

      {/* Indicator rows */}
      <div className="flex flex-col gap-2">
        {v.items.map((item) => {
          const isBuy = item.action === 'BUY';
          const isSell = item.action === 'SELL';
          const color = isBuy ? '#4ade80' : isSell ? '#f87171' : '#fbbf24';

          return (
            <div
              key={item.name}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="flex items-center gap-2.5">
                {isBuy && <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />}
                {isSell && <XCircle className="h-4 w-4 shrink-0 text-red-400" />}
                {!isBuy && !isSell && <MinusCircle className="h-4 w-4 shrink-0 text-amber-400" />}
                <div>
                  <div className="text-xs font-semibold text-white">{item.name}</div>
                  <div className="text-[11px]" style={{ color: '#475569' }}>{item.description}</div>
                </div>
              </div>
              <span className="text-xs font-semibold ml-3 shrink-0" style={{ color }}>
                {isBuy ? 'Bullish' : isSell ? 'Bearish' : 'Neutral'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
