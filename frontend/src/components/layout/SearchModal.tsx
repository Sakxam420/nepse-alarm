import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, Star } from 'lucide-react';
import { Company } from '../../types/stock';

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
  isOpen, onClose, companies, selectedSymbol, onSelectSymbol, watchlist, onToggleFavorite,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return companies.slice(0, 20);
    const q = query.toLowerCase();
    return companies.filter(c =>
      c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
    ).slice(0, 15);
  }, [query, companies]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden fade-in"
        style={{ background: '#161b27', border: '1px solid rgba(255,255,255,0.09)' }}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <Search className="h-4 w-4 shrink-0" style={{ color: '#475569' }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by symbol or company name..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
            onKeyDown={e => {
              if (e.key === 'Escape') onClose();
              if (e.key === 'Enter' && results.length > 0) {
                onSelectSymbol(results[0].symbol);
                onClose();
              }
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-500 hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Results */}
        <div className="max-h-[380px] overflow-y-auto py-2">
          {results.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">No results found</div>
          ) : (
            results.map(company => {
              const isSelected = company.symbol === selectedSymbol;
              const isFav = watchlist.includes(company.symbol);
              return (
                <div
                  key={company.symbol}
                  onClick={() => { onSelectSymbol(company.symbol); onClose(); }}
                  className="flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors group"
                  style={{ background: isSelected ? 'rgba(79,142,247,0.08)' : 'transparent' }}
                  onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
                  onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(255,255,255,0.05)', color: isSelected ? '#7bb3ff' : '#94a3b8' }}>
                      {company.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{company.symbol}</div>
                      <div className="text-xs text-slate-400">{company.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] px-2 py-0.5 rounded-md text-slate-400" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      {company.sector}
                    </span>
                    <button
                      onClick={e => { e.stopPropagation(); onToggleFavorite(company.symbol); }}
                      className="p-1 rounded transition-colors"
                      style={{ color: isFav ? '#fbbf24' : '#475569' }}
                    >
                      <Star className={`h-3.5 w-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Hint footer */}
        <div className="px-4 py-2.5 border-t flex items-center justify-between text-[11px] text-slate-500" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <span>{results.length} of {companies.length} securities</span>
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono">↵</kbd> to select</span>
            <span><kbd className="font-mono">ESC</kbd> to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
