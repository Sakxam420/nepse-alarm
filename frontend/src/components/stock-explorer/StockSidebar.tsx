import React, { useState, useMemo } from 'react';
import { Search, X, ArrowUpDown, Filter } from 'lucide-react';
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
  companies,
  selectedSymbol,
  onSelectSymbol,
  watchlist,
  onToggleFavorite,
  mobileOpen,
  onCloseMobile,
}) => {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'all' | 'starred'>('all');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [sortAsc, setSortAsc] = useState(true);

  // Extract unique sectors
  const sectors = useMemo(() => {
    const set = new Set<string>();
    companies.forEach((c) => {
      if (c.sector) set.add(c.sector);
    });
    return Array.from(set).sort();
  }, [companies]);

  // Filtered & sorted list
  const displayed = useMemo(() => {
    let list = companies;

    // Filter starred
    if (tab === 'starred') {
      list = list.filter((c) => watchlist.includes(c.symbol));
    }

    // Filter sector
    if (selectedSector !== 'ALL') {
      list = list.filter((c) => c.sector === selectedSector);
    }

    // Search query
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (c) => c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q),
      );
    }

    // Sort by symbol
    return [...list].sort((a, b) =>
      sortAsc ? a.symbol.localeCompare(b.symbol) : b.symbol.localeCompare(a.symbol),
    );
  }, [companies, query, tab, selectedSector, sortAsc, watchlist]);

  const innerContent = (
    <div className="flex flex-col gap-2.5 h-full min-h-0">
      {/* Header bar */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Securities</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono font-semibold">
            {displayed.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSortAsc((s) => !s)}
            className="p-1 rounded hover:bg-white/5 transition-colors text-slate-400 hover:text-white"
            title={sortAsc ? 'Sort A-Z' : 'Sort Z-A'}
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative shrink-0">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search symbol or name…"
          className="w-full rounded-lg text-xs pl-8 pr-7 py-2 outline-none transition-all placeholder:text-slate-500 bg-slate-900/60 border border-white/5 focus:border-blue-500/40 text-slate-200"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Filter Tabs & Sector Selector */}
      <div className="flex flex-col gap-1.5 shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="seg-control flex-1">
            <button
              className={`seg-btn flex-1 text-center ${tab === 'all' ? 'active' : ''}`}
              onClick={() => setTab('all')}
            >
              All <span className="text-[10px] opacity-60 ml-0.5">{companies.length}</span>
            </button>
            <button
              className={`seg-btn flex-1 text-center ${tab === 'starred' ? 'active' : ''}`}
              onClick={() => setTab('starred')}
            >
              Starred <span className="text-[10px] opacity-60 ml-0.5">{watchlist.length}</span>
            </button>
          </div>

          {/* Clear filter if sector selected */}
          {selectedSector !== 'ALL' && (
            <button
              onClick={() => setSelectedSector('ALL')}
              className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-[10px] font-semibold"
              title="Reset sector filter"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sector quick dropdown */}
        <div className="relative">
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full rounded-lg text-[11px] px-2.5 py-1.5 outline-none bg-slate-900/40 border border-white/5 text-slate-400 focus:text-slate-200 focus:border-blue-500/30 cursor-pointer appearance-none"
          >
            <option value="ALL">All Sectors ({sectors.length})</option>
            {sectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <Filter className="absolute right-2.5 top-2 h-3 w-3 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Scrollable Stock List: strictly bounded within parent flex */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-0.5 flex flex-col gap-1 custom-scrollbar">
        {displayed.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            {tab === 'starred' ? 'No starred stocks yet' : 'No matching securities found'}
          </div>
        ) : (
          displayed.map((c) => (
            <StockListItem
              key={c.symbol}
              company={c}
              isSelected={selectedSymbol === c.symbol}
              isFavorite={watchlist.includes(c.symbol)}
              onSelect={(sym) => {
                onSelectSymbol(sym);
                onCloseMobile();
              }}
              onToggleFavorite={onToggleFavorite}
            />
          ))
        )}
      </div>

      {/* Footer stats */}
      <div className="text-[11px] pt-2 border-t border-white/5 flex items-center justify-between text-slate-500 shrink-0">
        <span>Showing {displayed.length} of {companies.length}</span>
        <span className="font-mono">{companies.length} active</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Desktop sidebar: fixed viewport height with internal scrollbar */}
      <aside className="hidden lg:flex flex-col h-[calc(100vh-6.2rem)] sticky top-20 p-3 card overflow-hidden shadow-xl shadow-black/20">
        {innerContent}
      </aside>

      {/* Mobile drawer: fixed drawer with internal scrollbar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] z-50 lg:hidden flex flex-col p-4 shadow-2xl transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-slate-900 border-r border-white/10 overflow-hidden h-full`}
      >
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/5">
          <span className="text-sm font-bold text-white">Select Security</span>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 min-h-0">{innerContent}</div>
      </aside>
    </>
  );
};
