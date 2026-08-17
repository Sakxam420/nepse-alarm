import React from 'react';
import { ArrowUpRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { SECTOR_OVERVIEW } from '../../utils/mockData';

interface SectorHeatmapProps {
  onSelectSector?: (name: string) => void;
}

export const SectorHeatmap: React.FC<SectorHeatmapProps> = ({ onSelectSector }) => {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-base font-semibold text-white">NEPSE Sector Overview</h2>
        <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>Performance and momentum across market sectors</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTOR_OVERVIEW.map((sec) => {
          const isUp = sec.avgChange >= 0;
          const isNeutral = Math.abs(sec.avgChange) < 0.1;
          const changeColor = isNeutral ? '#fbbf24' : isUp ? '#4ade80' : '#f87171';
          const changeBg = isNeutral ? 'rgba(251,191,36,0.08)' : isUp ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)';

          return (
            <div
              key={sec.name}
              onClick={() => onSelectSector?.(sec.name)}
              className="card p-4 cursor-pointer group transition-all"
              style={{ '--hover-border': 'rgba(255,255,255,0.13)' } as React.CSSProperties}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {sec.name}
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: '#475569' }}>
                    {sec.stocksCount} companies
                  </div>
                </div>
                <div
                  className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg"
                  style={{ background: changeBg, color: changeColor, border: `1px solid ${changeColor}22` }}
                >
                  {isNeutral ? <Minus className="h-3 w-3" /> : isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {isUp ? '+' : ''}{sec.avgChange.toFixed(2)}%
                </div>
              </div>

              {/* RSI bar */}
              <div className="mb-3">
                <div className="flex justify-between text-[11px] mb-1" style={{ color: '#475569' }}>
                  <span>Avg RSI</span>
                  <span className="font-mono text-white">{sec.avgRSI}</span>
                </div>
                <div className="h-1.5 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div
                    style={{ width: `${sec.avgRSI}%`, background: sec.avgRSI > 65 ? '#ef4444' : sec.avgRSI < 35 ? '#22c55e' : '#60a5fa' }}
                    className="h-full rounded-full"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px]" style={{ color: '#475569' }}>
                <span className={`font-semibold ${sec.trend === 'Bullish' ? 'text-green-400' : sec.trend === 'Bearish' ? 'text-red-400' : 'text-amber-400'}`}>
                  {sec.trend}
                </span>
                <span className="flex items-center gap-0.5 group-hover:text-white transition-colors">
                  Explore <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
