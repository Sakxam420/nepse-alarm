import React from 'react';
import { Target, Shield, ArrowUpRight, ArrowDownRight, Compass } from 'lucide-react';
import { PriceEnvelope } from '../../types/stock';

interface PriceEnvelopeCardProps {
  envelope?: PriceEnvelope;
  symbol: string;
}

export const PriceEnvelopeCard: React.FC<PriceEnvelopeCardProps> = ({ envelope, symbol }) => {
  if (!envelope) return null;

  const isUp = envelope.projectedChangePct >= 0;

  return (
    <div className="card p-5 border border-slate-800 flex flex-col gap-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              {symbol} 5-Day Projected Price Cone
            </h3>
            <span className="text-[11px] text-slate-400">Monte Carlo & Volatility Band</span>
          </div>
        </div>
        <div
          className={`flex items-center gap-1 font-mono text-xs font-bold px-2 py-0.5 rounded ${
            isUp ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' : 'bg-rose-950 text-rose-400 border border-rose-800/40'
          }`}
        >
          {isUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {isUp ? '+' : ''}{envelope.projectedChangePct}%
        </div>
      </div>

      {/* Target Price Highlight */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
        <div>
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Expected Target</span>
          <span className="text-xl font-bold font-mono text-white mt-0.5 block">
            Rs. {envelope.targetPrice.toFixed(2)}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400">
          <Target className="h-5 w-5" />
        </div>
      </div>

      {/* Resistance & Support Levels */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
            <span>Resistance Ceiling</span>
          </div>
          <span className="text-sm font-bold font-mono text-emerald-400 mt-1 block">
            Rs. {envelope.resistancePrice.toFixed(2)}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Shield className="h-3.5 w-3.5 text-rose-400" />
            <span>Support Floor</span>
          </div>
          <span className="text-sm font-bold font-mono text-rose-400 mt-1 block">
            Rs. {envelope.supportPrice.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Note */}
      <p className="text-[11px] text-slate-500 leading-relaxed">
        The envelope calculates probability bounds from historical 30-day volatility distribution and model trend confidence.
      </p>
    </div>
  );
};
