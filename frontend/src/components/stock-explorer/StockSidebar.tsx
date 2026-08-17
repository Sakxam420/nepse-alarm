import React, { useState, useMemo } from 'react';
import { Search, X, ArrowUpDown } from 'lucide-react';
import { Company } from '../../types/stock';
import { StockListItem } from './StockListItem';

interface StockSidebarProps {
  companies: Company[];
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  watchlist: string[];
  onToggleFavorite: (symbol: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const StockSidebar: React.FC<StockSidebarProps> = ({
  companies, selectedSymbol, onSelectSymbol,
  watchlist, onToggleFavorite, mobileOpen, onCloseMobile,
}) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'starred'>('all');
  const [sortAsc, setSortAsc] = useState(true);

  const displayed = useMemo(() => {
    let list = [...companies];
    if (filter === 'starred') list = list.filter(c => watchlist.includes(c.symbol));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(c => c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
    }
    list.sort((a, b) => sortAsc ? a.symbol.localeCompare(b.symbol) : b.symbol.localeCompare(a.symbol));
    return list;
  }, [companies, query, filter, sortAsc, watchlist]);

  const inner = (
    <div className="flex flex-col gap-3 h-full">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white">Securities</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSortAsc(s => !s)}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            style={{ color: '#475569' }}
            title="Toggle sort order"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5" style={{ color: '#475569' }} />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Filter stocks..."
          className="w-full rounded-xl text-sm pl-8 pr-7 py-2 outline-none transition-colors"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            color: '#f1f5f9',
            fontSize: 13,
          }}
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-2.5 top-2.5" style={{ color: '#475569' }}>
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div className="seg-control">
        <button className={`seg-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          All <span className="text-[10px] opacity-50 ml-1">{companies.length}</span>
        </button>
        <button className={`seg-btn ${filter === 'starred' ? 'active' : ''}`} onClick={() => setFilter('starred')}>
          Starred <span className="text-[10px] opacity-50 ml-1">{watchlist.length}</span>
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto -mr-1 pr-1 flex flex-col gap-0.5">
        {displayed.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">
            {filter === 'starred' ? 'No starred stocks yet' : 'No results'}
          </div>
        ) : (
          displayed.map(c => (
            <StockListItem
              key={c.symbol}
              company={c}
              isSelected={selectedSymbol === c.symbol}
              isFavorite={watchlist.includes(c.symbol)}
              onSelect={sym => { onSelectSymbol(sym); onCloseMobile(); }}
              onToggleFavorite={onToggleFavorite}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="text-[11px] pt-2 border-t" style={{ color: '#475569', borderColor: 'rgba(255,255,255,0.06)' }}>
        {displayed.length} of {companies.length} securities
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={onCloseMobile} />
      )}

      {/* Desktop sidebar (static) */}
      <aside className="hidden lg:flex flex-col h-full p-4 card" style={{ minHeight: 500 }}>
        {inner}
      </aside>

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-80 z-40 lg:hidden flex flex-col p-4 transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: '#161b27', borderRight: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-white">Securities</span>
          <button onClick={onCloseMobile} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: '#475569' }}>
            <X className="h-4 w-4" />
          </button>
        </div>
        {inner}
      </aside>
    </>
  );
};
