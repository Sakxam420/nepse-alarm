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

export const StockListItem: React.FC<StockListItemProps> = ({
  company, isSelected, isFavorite, onSelect, onToggleFavorite,
}) => (
  <div
    onClick={() => onSelect(company.symbol)}
    className="flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer group transition-colors"
    style={{
      background: isSelected ? 'rgba(79,142,247,0.1)' : 'transparent',
      border: `1px solid ${isSelected ? 'rgba(79,142,247,0.25)' : 'transparent'}`,
    }}
    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
  >
    <div className="flex items-center gap-2.5 min-w-0">
      <button
        onClick={e => { e.stopPropagation(); onToggleFavorite(company.symbol); }}
        className="shrink-0 transition-colors"
        style={{ color: isFavorite ? '#fbbf24' : '#334155' }}
      >
        <Star className={`h-3.5 w-3.5 ${isFavorite ? 'fill-amber-400' : ''}`} />
      </button>
      <div className="min-w-0">
        <div className="text-sm font-semibold truncate" style={{ color: isSelected ? '#7bb3ff' : '#e2e8f0' }}>
          {company.symbol}
        </div>
        <div className="text-[11px] truncate" style={{ color: '#475569' }}>{company.name}</div>
      </div>
    </div>
    <ChevronRight
      className="h-3.5 w-3.5 shrink-0 transition-opacity"
      style={{ color: isSelected ? '#7bb3ff' : '#334155', opacity: isSelected ? 1 : 0 }}
    />
  </div>
);
