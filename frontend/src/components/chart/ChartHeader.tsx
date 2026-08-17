import React from 'react';
import { PriceBar, Company } from '../../types/stock';
import { formatCompact } from '../../utils/formatters';

interface ChartHeaderProps {
  company?: Company;
  hoveredBar: PriceBar | null;
  latestBar: PriceBar | null;
}

export const ChartHeader: React.FC<ChartHeaderProps> = ({
  hoveredBar,
  latestBar,
}) => {
  const activeBar = hoveredBar || latestBar;
  if (!activeBar) return null;

  const isBullish = activeBar.close >= activeBar.open;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono py-1">
      {/* Date */}
      <span className="text-slate-400 font-medium">
        {activeBar.date}
      </span>

      {/* Clean OHLC readout */}
      <div className="flex items-center gap-3 sm:gap-4 text-[11px]">
        <span className="text-slate-400">
          Open: <strong className="text-slate-200">{activeBar.open.toFixed(2)}</strong>
        </span>
        <span className="text-slate-400">
          High: <strong className="text-slate-200">{activeBar.high.toFixed(2)}</strong>
        </span>
        <span className="text-slate-400">
          Low: <strong className="text-slate-200">{activeBar.low.toFixed(2)}</strong>
        </span>
        <span className="text-slate-400">
          Close: <strong className={isBullish ? 'text-emerald-400' : 'text-rose-400'}>{activeBar.close.toFixed(2)}</strong>
        </span>
        <span className="text-slate-400 hidden sm:inline">
          Vol: <strong className="text-slate-300">{formatCompact(activeBar.volume)}</strong>
        </span>
      </div>
    </div>
  );
};
