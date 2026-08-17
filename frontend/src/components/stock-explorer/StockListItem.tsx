import React from 'react';
import { Star, ChevronRight } from 'lucide-react';
import { Company } from '../../types/stock';
import { Badge } from '../common/Badge';

interface StockListItemProps {
  company: Company;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: (symbol: string) => void;
  onToggleFavorite: (symbol: string) => void;
}

export const StockListItem: React.FC<StockListItemProps> = ({
  company,
  isSelected,
  isFavorite,
  onSelect,
  onToggleFavorite,
}) => {
  const isHydropower = company.sector === 'Hydropower';
  const isBanking = company.sector === 'Banking';
  const sectorBadgeVariant = isHydropower ? 'cyan' : isBanking ? 'primary' : 'neutral';

  return (
    <div
      onClick={() => onSelect(company.symbol)}
      className={`group relative flex items-center justify-between p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent border-cyan-500/50 shadow-glow-cyan/20 text-white'
          : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-900/80 hover:border-slate-700/80 text-slate-300'
      }`}
    >
      {/* Left indicator bar for active item */}
      {isSelected && (
        <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-cyan-400 shadow-glow-cyan" />
      )}

      <div className="flex items-center gap-2.5 pl-1 overflow-hidden">
        {/* Star Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(company.symbol);
          }}
          className={`p-1 rounded-lg hover:bg-slate-800/80 transition-colors ${
            isFavorite ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Star to watchlist'}
          aria-label={`Favorite ${company.symbol}`}
        >
          <Star className={`h-3.5 w-3.5 ${isFavorite ? 'fill-amber-400' : ''}`} />
        </button>

        {/* Ticker & Name */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-mono font-bold text-sm tracking-tight transition-colors ${
                isSelected ? 'text-cyan-300' : 'text-white group-hover:text-cyan-400'
              }`}
            >
              {company.symbol}
            </span>
            <Badge variant={sectorBadgeVariant} size="sm">
              {company.sector.slice(0, 5)}
            </Badge>
          </div>
          <span className="text-[11px] text-slate-400 font-medium truncate max-w-[140px] sm:max-w-[170px]">
            {company.name}
          </span>
        </div>
      </div>

      {/* Right Column: Mini Arrow */}
      <div className="flex items-center gap-1 shrink-0">
        <ChevronRight
          className={`h-4 w-4 transition-transform duration-200 ${
            isSelected
              ? 'text-cyan-400 translate-x-0.5'
              : 'text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5'
          }`}
        />
      </div>
    </div>
  );
};
