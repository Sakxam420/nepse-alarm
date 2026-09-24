import React from 'react';
import { Award, CheckCircle, Percent, BarChart2 } from 'lucide-react';
import { BacktestStats } from '../../types/stock';

interface BacktestSimulatorCardProps {
  backtest?: BacktestStats;
  symbol: string;
}

export const BacktestSimulatorCard: React.FC<BacktestSimulatorCardProps> = ({ backtest, symbol }) => {
  if (!backtest) return null;

  return (
    <div className="card p-5 border border-slate-800 flex flex-col gap-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Award className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              {symbol} Signal Backtest
            </h3>
            <span className="text-[11px] text-slate-400">Past 60-Session Empirical Evaluation</span>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
          PROVEN QUANT
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Win Rate */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col gap-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Strategy Win Rate</span>
            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <span className="text-xl font-black font-mono text-emerald-400 mt-0.5">
            {backtest.winRate.toFixed(1)}%
          </span>
          <span className="text-[10px] text-slate-500">Across {backtest.totalSignals} Signals</span>
        </div>

        {/* Simulated PnL */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col gap-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Cumulative Return</span>
            <Percent className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <span
            className={`text-xl font-black font-mono mt-0.5 ${
              backtest.simulatedReturnPct >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {backtest.simulatedReturnPct >= 0 ? '+' : ''}{backtest.simulatedReturnPct.toFixed(1)}%
          </span>
          <span className="text-[10px] text-slate-500">Profit Factor: {backtest.profitFactor.toFixed(2)}</span>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-center justify-between text-xs">
        <span className="text-slate-400 flex items-center gap-1.5">
          <BarChart2 className="h-3.5 w-3.5 text-slate-500" />
          Holding Period:
        </span>
        <span className="font-mono text-slate-200 font-bold">5 Trading Sessions</span>
      </div>
    </div>
  );
};
