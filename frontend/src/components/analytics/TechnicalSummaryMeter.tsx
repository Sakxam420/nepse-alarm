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
    <div className="p-5 sm:p-6 rounded-2xl surface-card flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Gauge className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white tracking-tight">Technical Indicator Scorecard</h3>
            <span className="text-[10px] text-slate-400 block font-mono">
              Quantitative Technical Consensus
            </span>
          </div>
        </div>
        <Badge variant={getVerdictVariant(verdict.signal)} size="md">
          {verdict.signal}
        </Badge>
      </div>

      {/* Aggregate Score Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-medium">Technical Strength Index</span>
          <span className="text-white font-mono font-bold">{verdict.score} / 100</span>
        </div>
        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
          <div
            style={{ width: `${verdict.score}%` }}
            className={`h-full rounded-full transition-all duration-700 ${
              verdict.score >= 60
                ? 'bg-emerald-500'
                : verdict.score <= 40
                ? 'bg-rose-500'
                : 'bg-amber-500'
            }`}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>Bearish (0)</span>
          <span>Neutral (50)</span>
          <span>Bullish (100)</span>
        </div>
      </div>

      {/* Evaluated Indicators List */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
          Evaluated Indicators ({verdict.bullishCount} Bullish • {verdict.neutralCount} Neutral • {verdict.bearishCount} Bearish)
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {verdict.items.map((item) => {
            const isBuy = item.action === 'BUY';
            const isSell = item.action === 'SELL';

            return (
              <div
                key={item.name}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  {isBuy && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
                  {isSell && <XCircle className="h-4 w-4 text-rose-400 shrink-0" />}
                  {!isBuy && !isSell && <MinusCircle className="h-4 w-4 text-amber-400 shrink-0" />}
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">{item.name}</span>
                    <span className="text-[11px] text-slate-400">{item.description}</span>
                  </div>
                </div>

                <Badge
                  variant={isBuy ? 'emerald' : isSell ? 'rose' : 'amber'}
                  size="sm"
                >
                  {item.action === 'BUY' ? 'Bullish' : item.action === 'SELL' ? 'Bearish' : 'Neutral'}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
