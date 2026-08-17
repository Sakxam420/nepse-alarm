import React from 'react';
import { PriceBar } from '../../types/stock';
import { computeTechnicalVerdict } from '../../utils/financialCalculations';
import { CheckCircle2, XCircle, MinusCircle, Gauge } from 'lucide-react';
import { Badge } from '../common/Badge';

interface TechnicalSummaryMeterProps {
  latestBar: PriceBar | null;
}

export const TechnicalSummaryMeter: React.FC<TechnicalSummaryMeterProps> = ({ latestBar }) => {
  const verdict = computeTechnicalVerdict(latestBar);

  const getVerdictVariant = (sig: string): 'emerald' | 'rose' | 'amber' => {
    if (sig.includes('BUY')) return 'emerald';
    if (sig.includes('SELL')) return 'rose';
    return 'amber';
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl glass-panel border border-slate-800/80 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Gauge className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white tracking-tight">Technical Indicator Scorecard</h3>
            <span className="text-[10px] text-slate-500 font-mono block">
              Multi-Indicator Consensus Engine
            </span>
          </div>
        </div>
        <Badge variant={getVerdictVariant(verdict.signal)} size="md">
          {verdict.signal}
        </Badge>
      </div>

      {/* Aggregate Score Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 font-medium">Quantitative Health Score</span>
          <span className="text-cyan-300 font-bold text-sm">{verdict.score} / 100</span>
        </div>
        <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden flex border border-slate-800 p-0.5">
          <div
            style={{ width: `${verdict.score}%` }}
            className={`h-full rounded-full transition-all duration-1000 ${
              verdict.score >= 60
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-glow-emerald'
                : verdict.score <= 40
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 shadow-glow-rose'
                : 'bg-gradient-to-r from-amber-500 to-cyan-400'
            }`}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>0 (Strong Sell)</span>
          <span>50 (Neutral)</span>
          <span>100 (Strong Buy)</span>
        </div>
      </div>

      {/* Indicator Breakdown Table */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
          Evaluated Indicators ({verdict.bullishCount} Buy • {verdict.neutralCount} Neutral • {verdict.bearishCount} Sell)
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {verdict.items.map((item) => {
            const isBuy = item.action === 'BUY';
            const isSell = item.action === 'SELL';

            return (
              <div
                key={item.name}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  {isBuy && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
                  {isSell && <XCircle className="h-4 w-4 text-rose-400 shrink-0" />}
                  {!isBuy && !isSell && <MinusCircle className="h-4 w-4 text-amber-400 shrink-0" />}
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">{item.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.description}</span>
                  </div>
                </div>

                <Badge
                  variant={isBuy ? 'emerald' : isSell ? 'rose' : 'amber'}
                  size="sm"
                >
                  {item.action}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
