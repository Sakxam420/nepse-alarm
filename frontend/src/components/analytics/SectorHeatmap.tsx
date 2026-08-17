import React from 'react';
import { SECTOR_OVERVIEW } from '../../utils/mockData';
import { Layers, ArrowUpRight } from 'lucide-react';
import { Badge } from '../common/Badge';

interface SectorHeatmapProps {
  onSelectSector?: (sectorName: string) => void;
}

export const SectorHeatmap: React.FC<SectorHeatmapProps> = ({ onSelectSector }) => {
  return (
    <div className="p-5 sm:p-6 rounded-2xl glass-panel border border-slate-800/80 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white tracking-tight">Sector Heatmap & Flow</h3>
            <span className="text-[10px] text-slate-500 font-mono block">
              Relative Performance Across NEPSE Sectors
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Sectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SECTOR_OVERVIEW.map((sec) => {
          const isPositive = sec.avgChange >= 0;
          return (
            <div
              key={sec.name}
              onClick={() => onSelectSector?.(sec.name)}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-850 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                    {sec.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                    {sec.stocksCount} Listed Securities
                  </span>
                </div>
                <Badge variant={isPositive ? 'emerald' : 'rose'} size="sm">
                  {isPositive ? '+' : ''}{sec.avgChange.toFixed(2)}%
                </Badge>
              </div>

              <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800/60">
                <span className="text-slate-400">Avg RSI: {sec.avgRSI}</span>
                <span className="flex items-center gap-1 text-slate-400 group-hover:text-cyan-400">
                  <span>Explore</span>
                  <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
