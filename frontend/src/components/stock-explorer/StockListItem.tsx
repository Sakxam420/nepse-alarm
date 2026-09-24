import React from 'react';
import { Star, ChevronRight } from 'lucide-react';
import { Company } from '../../types/stock';

interface StockListItemProps {
  company: Company;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: (symbol: string) => void;
  onToggleFavorite: (symbol: string) => void;
}

export const StockListItem: React.FC<StockListItemProps> = React.memo(({
  company, isSelected, isFavorite, onSelect, onToggleFavorite,
}) => (
  <div
    onClick={() => onSelect(company.symbol)}
    className="stock-list-item flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer group transition-all select-none"
    style={{
      background: isSelected ? 'rgba(79,142,247,0.14)' : 'transparent',
      border: `1px solid ${isSelected ? 'rgba(79,142,247,0.3)' : 'transparent'}`,
    }}
    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
  >
    <div className="flex items-center gap-2 min-w-0">
      <button
        onClick={e => { e.stopPropagation(); onToggleFavorite(company.symbol); }}
        className="shrink-0 p-0.5 rounded hover:bg-white/10 transition-colors"
        style={{ color: isFavorite ? '#fbbf24' : '#334155' }}
        title={isFavorite ? "Remove from starred" : "Star security"}
      >
        <Star className={`h-3.5 w-3.5 ${isFavorite ? 'fill-amber-400' : ''}`} />
      </button>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold tracking-tight" style={{ color: isSelected ? '#93c5fd' : '#f1f5f9' }}>
            {company.symbol}
          </span>
          {company.sector && (
            <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 truncate max-w-[85px]">
              {company.sector}
            </span>
          )}
        </div>
        <div className="text-[11px] truncate text-slate-400 mt-0.5">{company.name}</div>
      </div>
    </div>
    <ChevronRight
      className="h-3 w-3 shrink-0 transition-opacity"
      style={{ color: isSelected ? '#93c5fd' : '#475569', opacity: isSelected ? 1 : 0 }}
    />
  </div>
));

