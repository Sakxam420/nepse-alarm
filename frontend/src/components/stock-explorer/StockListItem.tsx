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
  return (
    <div
      onClick={() => onSelect(company.symbol)}
      className={`group relative flex items-center justify-between p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'bg-slate-850 border-emerald-500/50 text-white shadow-sm'
          : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700/80 text-slate-300'
      }`}
    >
      <div className="flex items-center gap-2.5 overflow-hidden">
        {/* Star */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(company.symbol);
          }}
          className={`p-1 rounded-md transition-colors ${
            isFavorite ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Star to watchlist'}
        >
          <Star className={`h-3.5 w-3.5 ${isFavorite ? 'fill-amber-400' : ''}`} />
        </button>

        {/* Ticker & Name */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-mono font-bold text-sm tracking-tight transition-colors ${
                isSelected ? 'text-emerald-400' : 'text-white group-hover:text-emerald-300'
              }`}
            >
              {company.symbol}
            </span>
            <Badge variant="neutral" size="sm">
              {company.sector.slice(0, 5)}
            </Badge>
          </div>
          <span className="text-[11px] text-slate-400 font-medium truncate max-w-[140px] sm:max-w-[170px]">
            {company.name}
          </span>
        </div>
      </div>

      <ChevronRight
        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
          isSelected ? 'text-emerald-400' : 'text-slate-600 group-hover:text-slate-400'
        }`}
      />
    </div>
  );
};
