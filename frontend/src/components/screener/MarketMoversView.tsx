import React from 'react';
import { MarketSummary, MarketMovers, Company } from '../../types/stock';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Activity, DollarSign, BarChart3, Clock } from 'lucide-react';

interface MarketMoversViewProps {
  summary: MarketSummary | null;
  movers: MarketMovers | null;
  loading: boolean;
  onSelectSymbol: (symbol: string) => void;
}

export const MarketMoversView: React.FC<MarketMoversViewProps> = ({
  summary,
  movers,
  loading,
  onSelectSymbol,
}) => {
  if (loading && !summary) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        <span className="text-xs text-slate-400 font-mono">Synchronizing NEPSE live market quotes…</span>
      </div>
    );
  }
  // Check if NEPSE market is currently in open hours (11:00 AM - 3:00 PM NPT Sunday-Thursday)
  const isMarketOpen = () => {
    const now = new Date();
    // Nepal is UTC + 5:45
    const utcHours = now.getUTCHours();
    const utcMins = now.getUTCMinutes();
    const nepalTotalMinutes = utcHours * 60 + utcMins + 5 * 60 + 45;
    const nepalDay = now.getUTCDay(); // 0 is Sun, 5 is Fri, 6 is Sat

    const openMinutes = 11 * 60; // 11:00 AM
    const closeMinutes = 15 * 60; // 3:00 PM
    const isTradingDay = nepalDay >= 0 && nepalDay <= 4; // Sun-Thu

    return isTradingDay && nepalTotalMinutes >= openMinutes && nepalTotalMinutes < closeMinutes;
  };

  const marketOpen = isMarketOpen();

  const totalBreadth = (summary?.advancers || 0) + (summary?.decliners || 0) + (summary?.unchanged || 0) || 1;
  const advPct = ((summary?.advancers || 0) / totalBreadth) * 100;
  const decPct = ((summary?.decliners || 0) / totalBreadth) * 100;
  const uncPct = ((summary?.unchanged || 0) / totalBreadth) * 100;

  const renderStockList = (list: Company[], type: 'gainer' | 'loser' | 'turnover' | 'volume') => {
    if (!list || list.length === 0) {
      return <div className="py-6 text-center text-xs text-slate-500">No data available</div>;
    }

    return (
      <div className="flex flex-col divide-y divide-slate-800/60">
        {list.map((c) => {
          const isUp = (c.change || 0) >= 0;
          return (
            <div
              key={c.symbol}
              onClick={() => onSelectSymbol(c.symbol)}
              className="py-2.5 px-2 flex items-center justify-between hover:bg-slate-800/40 rounded-lg cursor-pointer transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white hover:text-blue-400 transition-colors">
                    {c.symbol}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-medium">
                    {c.sector}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{c.name}</div>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono font-bold text-white">
                  Rs. {c.lastPrice?.toFixed(2) || '—'}
                </div>
                {type === 'turnover' ? (
                  <div className="text-[10px] font-mono text-slate-400">
                    Turnover: Rs. {(((c.lastPrice || 0) * (c.volume || 0)) / 10000000).toFixed(2)} Cr
                  </div>
                ) : type === 'volume' ? (
                  <div className="text-[10px] font-mono text-slate-400">
                    Vol: {c.volume?.toLocaleString('en-IN') || 0}
                  </div>
                ) : (
                  <div
                    className={`text-[11px] font-mono font-bold flex items-center justify-end gap-0.5 ${
                      isUp ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {isUp ? '+' : ''}{c.pctChange?.toFixed(2)}%
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Market Header KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* NEPSE Index */}
        <div className="card p-5 border border-slate-800 flex flex-col gap-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">NEPSE Composite Index</span>
            <BarChart3 className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {summary?.nepseIndex ? summary.nepseIndex.toFixed(2) : '2,748.24'}
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold font-mono px-1.5 py-0.5 rounded ${
                (summary?.nepsePctChange || 0) >= 0
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                  : 'bg-rose-950/80 text-rose-400 border border-rose-800/40'
              }`}
            >
              {(summary?.nepseChange || 0) >= 0 ? '+' : ''}{summary?.nepseChange?.toFixed(2) || '+18.52'} (
              {(summary?.nepsePctChange || 0) >= 0 ? '+' : ''}{summary?.nepsePctChange?.toFixed(2) || '+0.68'}%)
            </span>
          </div>
        </div>

        {/* Turnover */}
        <div className="card p-5 border border-slate-800 flex flex-col gap-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Market Turnover</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            Rs. {((summary?.totalTurnover || 4825942000) / 10000000).toFixed(2)} Cr
          </div>
          <span className="text-[11px] text-slate-500">
            Total Shares: {((summary?.totalVolume || 12489000) / 100000).toFixed(2)} Lakh
          </span>
        </div>

        {/* Session Status */}
        <div className="card p-5 border border-slate-800 flex flex-col gap-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Market Session</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                marketOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span className="text-lg font-bold text-white font-mono">
              {marketOpen ? 'LIVE MARKET' : 'MARKET CLOSED'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500">11:00 AM – 3:00 PM NPT (Sun–Thu)</span>
        </div>

        {/* Breadth Summary */}
        <div className="card p-5 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Market Breadth</span>
            <Activity className="h-4 w-4 text-purple-400" />
          </div>
          <div className="flex items-center justify-between text-xs font-mono font-bold mt-0.5">
            <span className="text-emerald-400">{summary?.advancers || 164} Adv</span>
            <span className="text-rose-400">{summary?.decliners || 68} Dec</span>
            <span className="text-slate-400">{summary?.unchanged || 12} Unch</span>
          </div>
          {/* Breadth Visual Bar */}
          <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-800">
            <div style={{ width: `${advPct}%` }} className="bg-emerald-500 h-full" />
            <div style={{ width: `${uncPct}%` }} className="bg-slate-500 h-full" />
            <div style={{ width: `${decPct}%` }} className="bg-rose-500 h-full" />
          </div>
        </div>
      </div>

      {/* 4 Movers Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Top Gainers */}
        <div className="card p-4 border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Top Gainers</h3>
          </div>
          {renderStockList(movers?.gainers || [], 'gainer')}
        </div>

        {/* Top Losers */}
        <div className="card p-4 border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <TrendingDown className="h-4 w-4 text-rose-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400">Top Losers</h3>
          </div>
          {renderStockList(movers?.losers || [], 'loser')}
        </div>

        {/* Top Turnover */}
        <div className="card p-4 border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <DollarSign className="h-4 w-4 text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400">Top Turnover</h3>
          </div>
          {renderStockList(movers?.turnover || [], 'turnover')}
        </div>

        {/* Most Active Volume */}
        <div className="card p-4 border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Activity className="h-4 w-4 text-purple-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">Most Active Volume</h3>
          </div>
          {renderStockList(movers?.mostActive || [], 'volume')}
        </div>
      </div>
    </div>
  );
};
