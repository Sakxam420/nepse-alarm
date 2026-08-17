import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowDownAZ, X } from 'lucide-react';
import { Company } from '../../types/stock';
import { StockListItem } from './StockListItem';
import { Tabs } from '../common/Tabs';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter and sort companies
  const filteredCompanies = useMemo(() => {
    return companies
      .filter((c) => {
        const matchesSearch =
          c.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.name.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesFilter = true;
        if (activeFilter === 'Favorites') {
          matchesFilter = watchlist.includes(c.symbol);
        } else if (activeFilter !== 'All') {
          matchesFilter = c.sector === activeFilter;
        }

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        if (sortOrder === 'asc') return a.symbol.localeCompare(b.symbol);
        return b.symbol.localeCompare(a.symbol);
      });
  }, [companies, searchQuery, activeFilter, sortOrder, watchlist]);

  const filterTabs = [
    { id: 'All', label: 'All', badge: companies.length },
    { id: 'Favorites', label: 'Starred', badge: watchlist.length },
    { id: 'Hydropower', label: 'Hydro' },
    { id: 'Banking', label: 'Banking' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-[#050811]/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-80 sm:w-88 lg:w-full flex flex-col gap-3.5 p-4 rounded-2xl glass-panel border border-slate-800/80 bg-[#090d16]/95 lg:bg-transparent transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-cyan-400" />
            <h2 className="font-bold text-sm text-white tracking-tight">Securities Explorer</h2>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Sort Toggle */}
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors text-xs font-mono"
              title={`Sort ${sortOrder === 'asc' ? 'Z-A' : 'A-Z'}`}
            >
              <ArrowDownAZ className="h-3.5 w-3.5" />
            </button>
            {/* Mobile Close */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search Field */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Filter symbols..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 transition font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-500 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <Tabs
          tabs={filterTabs}
          activeTab={activeFilter}
          onChange={(tab) => setActiveFilter(tab)}
          variant="pill"
        />

        {/* Stock List Scroll Area */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1.5 max-h-[580px] lg:max-h-[660px]">
          {filteredCompanies.length === 0 ? (
            <div className="py-12 px-4 text-center rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs">
              {activeFilter === 'Favorites'
                ? 'No starred securities in your watchlist. Star a security to pin it here.'
                : 'No matching securities found.'}
            </div>
          ) : (
            filteredCompanies.map((company) => (
              <StockListItem
                key={company.symbol}
                company={company}
                isSelected={selectedSymbol === company.symbol}
                isFavorite={watchlist.includes(company.symbol)}
                onSelect={(sym) => {
                  onSelectSymbol(sym);
                  onCloseMobile();
                }}
                onToggleFavorite={onToggleFavorite}
              />
            ))
          )}
        </div>

        {/* Sidebar Summary Footer */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>{filteredCompanies.length} displayed</span>
          <span>{watchlist.length} pinned</span>
        </div>
      </aside>
    </>
  );
};
