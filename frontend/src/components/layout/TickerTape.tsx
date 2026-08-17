import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { NEPSE_INDICES } from '../../utils/mockData';

const fmt = (v: number) => v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const TickerTape: React.FC = () => {
  const items = [...NEPSE_INDICES, ...NEPSE_INDICES];

  return (
    <div
      className="overflow-hidden select-none"
      style={{ background: '#0b0e14', borderBottom: '1px solid rgba(255,255,255,0.05)', height: 34 }}
    >
      <div className="ticker-mask h-full flex items-center overflow-hidden">
        <div className="flex items-center gap-6 whitespace-nowrap animate-marquee">
          {items.map((item, idx) => {
            const pos = item.change >= 0;
            return (
              <div key={`${item.symbol}-${idx}`} className="flex items-center gap-2">
                <span className="text-[11px] font-medium" style={{ color: '#64748b' }}>{item.name}</span>
                <span className="text-[11px] font-semibold text-white font-mono">{fmt(item.value)}</span>
                <span className={`flex items-center gap-0.5 text-[11px] font-semibold ${pos ? 'text-green-400' : 'text-red-400'}`}>
                  {pos ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {pos ? '+' : ''}{fmt(item.change)}
                </span>
                <span style={{ color: '#1e293b' }}>|</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
