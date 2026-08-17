import React, { useState, useMemo } from 'react';
import { Search, Star } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Company } from '../../types/stock';
import { Badge } from '../common/Badge';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: Company[];
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  watchlist: string[];
  onToggleFavorite: (symbol: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  companies,
  selectedSymbol,
  onSelectSymbol,
  watchlist,
  onToggleFavorite,
}) => {
  const [query, setQuery] = useState('');
  const [activeSector, setActiveSector] = useState('All');

  const sectors = useMemo(() => {
    const set = new Set(companies.map((c) => c.sector));
    return ['All', ...Array.from(set)];
  }, [companies]);

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      const matchesSearch =
        c.symbol.toLowerCase().includes(query.toLowerCase()) ||
        c.name.toLowerCase().includes(query.toLowerCase());
      const matchesSector = activeSector === 'All' || c.sector === activeSector;
      return matchesSearch && matchesSector;
    });
  }, [companies, query, activeSector]);

  const handleSelect = (symbol: string) => {
    onSelectSymbol(symbol);
    onClose();
    setQuery('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Security Lookup"
      subtitle="Search NEPSE listed companies, sectors, and symbols"
      icon={<Search className="h-5 w-5" />}
      maxWidth="xl"
    >
      <div className="flex flex-col gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Type symbol (e.g., NABIL, AHPC) or company name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 font-medium transition-all"
          />
        </div>

        {/* Sector Quick Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {sectors.map((sec) => (
            <button
              key={sec}
              onClick={() => setActiveSector(sec)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeSector === sec
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex flex-col gap-1.5 max-h-[380px] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No securities match your search criteria.
            </div>
          ) : (
            filtered.map((company) => {
              const isSelected = selectedSymbol === company.symbol;
              const isFav = watchlist.includes(company.symbol);

              return (
                <div
                  key={company.symbol}
                  onClick={() => handleSelect(company.symbol)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-white'
                      : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-850 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(company.symbol);
                      }}
                      className={`p-1 rounded hover:bg-slate-800 transition-colors ${
                        isFav ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                      }`}
                      title={isFav ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    >
                      <Star className={`h-4 w-4 ${isFav ? 'fill-amber-400' : ''}`} />
                    </button>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors">
                          {company.symbol}
                        </span>
                        <Badge variant="sector">{company.sector}</Badge>
                      </div>
                      <span className="text-xs text-slate-400 truncate max-w-sm">
                        {company.name}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 group-hover:text-cyan-300">
                      View Chart →
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Hint */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Tip: Press ESC to close</span>
          <span>Showing {filtered.length} of {companies.length} securities</span>
        </div>
      </div>
    </Modal>
  );
};
