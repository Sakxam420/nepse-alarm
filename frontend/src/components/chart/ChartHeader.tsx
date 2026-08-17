import React from 'react';
import { PriceBar, Company } from '../../types/stock';
import { formatCompact, formatPercentage } from '../../utils/formatters';
import { Badge } from '../common/Badge';

interface ChartHeaderProps {
  company?: Company;
  hoveredBar: PriceBar | null;
  latestBar: PriceBar | null;
}

export const ChartHeader: React.FC<ChartHeaderProps> = ({
  company,
  hoveredBar,
  latestBar,
}) => {
  const activeBar = hoveredBar || latestBar;
  if (!activeBar) return null;

  const isBullish = activeBar.close >= activeBar.open;
  const change = activeBar.close - activeBar.open;
  const pctChange = activeBar.open > 0 ? (change / activeBar.open) * 100 : 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono py-1">
      {/* Left: Security Identity & Date */}
      <div className="flex items-center gap-2">
        <span className="font-bold text-sm text-white tracking-tight font-sans">
          {activeBar.symbol}
        </span>
        {company && <Badge variant="sector">{company.sector}</Badge>}
        <span className="text-slate-400 text-[11px] font-mono">
          [{activeBar.date}]
        </span>
      </div>

      {/* Center/Right: OHLCV Pill Matrix */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-[11px]">
        <div>
          <span className="text-slate-500 mr-1">O:</span>
          <span className="font-semibold text-slate-200">{activeBar.open.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-slate-500 mr-1">H:</span>
          <span className="font-semibold text-emerald-400">{activeBar.high.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-slate-500 mr-1">L:</span>
          <span className="font-semibold text-rose-400">{activeBar.low.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-slate-500 mr-1">C:</span>
          <span className={`font-bold ${isBullish ? 'text-emerald-400' : 'text-rose-400'}`}>
            {activeBar.close.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-slate-500 mr-1">CHG:</span>
          <span className={`font-semibold ${isBullish ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isBullish ? '+' : ''}{change.toFixed(2)} ({formatPercentage(pctChange)})
          </span>
        </div>
        <div className="hidden sm:block">
          <span className="text-slate-500 mr-1">VOL:</span>
          <span className="font-semibold text-cyan-300">{formatCompact(activeBar.volume)}</span>
        </div>
      </div>
    </div>
  );
};
