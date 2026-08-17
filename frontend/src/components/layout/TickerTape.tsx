import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { NEPSE_INDICES } from '../../utils/mockData';
import { formatNumber } from '../../utils/formatters';

export const TickerTape: React.FC = () => {
  // Duplicate array to enable seamless marquee looping
  const tickerItems = [...NEPSE_INDICES, ...NEPSE_INDICES];

  return (
    <div className="bg-[#070b14] border-b border-slate-900/80 py-2 px-4 overflow-hidden select-none relative z-20">
      <div className="ticker-mask flex overflow-hidden">
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
          {tickerItems.map((item, idx) => {
            const isPositive = item.change >= 0;
            return (
              <div key={`${item.symbol}-${idx}`} className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400 font-semibold">{item.name}</span>
                <span className="text-white font-bold">{formatNumber(item.value, 2)}</span>
                <span
                  className={`flex items-center text-[11px] font-semibold ${
                    isPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3 inline mr-0.5" />
                  ) : (
                    <TrendingDown className="h-3 w-3 inline mr-0.5" />
                  )}
                  {isPositive ? '+' : ''}
                  {item.change.toFixed(2)} ({isPositive ? '+' : ''}
                  {item.pctChange.toFixed(2)}%)
                </span>
                <span className="text-slate-800 ml-4">•</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
