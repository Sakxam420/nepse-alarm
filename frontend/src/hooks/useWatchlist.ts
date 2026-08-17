import { useState, useEffect } from 'react';

const STORAGE_KEY = 'nepse_ai_watchlist_v1';

export function useWatchlist(initialFavorites: string[] = ['NABIL', 'AHPC', 'GBIME']) {
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return initialFavorites;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
    } catch (e) {
      console.warn('Failed to save watchlist to localStorage', e);
    }
  }, [watchlist]);

  const toggleFavorite = (symbol: string) => {
    setWatchlist((prev) => {
      if (prev.includes(symbol)) {
        return prev.filter((s) => s !== symbol);
      } else {
        return [...prev, symbol];
      }
    });
  };

  const isFavorite = (symbol: string) => watchlist.includes(symbol);

  return { watchlist, toggleFavorite, isFavorite };
}
