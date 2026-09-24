import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { MarketSummary, MarketMovers } from '../types/stock';

const getApiBase = () => {
  return (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api/v1';
};

export function useMarketOverview() {
  const [marketSummary, setMarketSummary] = useState<MarketSummary | null>(null);
  const [movers, setMovers] = useState<MarketMovers | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMarketData = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryRes, moversRes] = await Promise.all([
        axios.get(`${getApiBase()}/stocks/market/summary`, { timeout: 3500 }),
        axios.get(`${getApiBase()}/stocks/top/movers`, { timeout: 3500 }),
      ]);

      if (summaryRes.data) {
        setMarketSummary(summaryRes.data);
      }
      if (moversRes.data) {
        setMovers(moversRes.data);
      }
    } catch {
      // Fallback synthetic data
      setMarketSummary({
        nepseIndex: 2748.24,
        nepseChange: 18.52,
        nepsePctChange: 0.68,
        totalTurnover: 4825942000,
        totalVolume: 12489000,
        advancers: 164,
        decliners: 68,
        unchanged: 12,
        totalListed: 244,
        sectorPerformance: [
          { sector: 'Hydropower', avgChange: 2.14, turnover: 1820400000, stockCount: 68 },
          { sector: 'Banking', avgChange: 0.85, turnover: 1240000000, stockCount: 20 },
          { sector: 'Finance', avgChange: 1.42, turnover: 640000000, stockCount: 15 },
          { sector: 'Life Insurance', avgChange: 0.45, turnover: 410000000, stockCount: 14 },
          { sector: 'Non Life Insurance', avgChange: -0.22, turnover: 320000000, stockCount: 14 },
          { sector: 'Hotels', avgChange: 1.88, turnover: 180000000, stockCount: 5 },
          { sector: 'Manufacturing', avgChange: -0.65, turnover: 215000000, stockCount: 8 },
        ],
      });

      setMovers({
        gainers: [
          { symbol: 'AKPL', name: 'Ankhu Khola Jalvidhyut', sector: 'Hydropower', lastPrice: 312.4, change: 28.4, pctChange: 10.0, volume: 480200 },
          { symbol: 'AHPC', name: 'Arun Valley Hydropower', sector: 'Hydropower', lastPrice: 388.0, change: 32.0, pctChange: 8.99, volume: 512000 },
          { symbol: 'API', name: 'API Power Company', sector: 'Hydropower', lastPrice: 242.0, change: 18.0, pctChange: 8.04, volume: 620000 },
          { symbol: 'HURJA', name: 'National Hydro Power', sector: 'Hydropower', lastPrice: 198.5, change: 13.5, pctChange: 7.3, volume: 390000 },
          { symbol: 'NABIL', name: 'Nabil Bank Limited', sector: 'Banking', lastPrice: 538.0, change: 24.0, pctChange: 4.67, volume: 245000 },
          { symbol: 'NICA', name: 'NIC Asia Bank Ltd.', sector: 'Banking', lastPrice: 472.0, change: 19.0, pctChange: 4.19, volume: 310000 },
        ],
        losers: [
          { symbol: 'HDL', name: 'Himalayan Distillery', sector: 'Manufacturing', lastPrice: 1360.0, change: -42.0, pctChange: -3.0, volume: 38000 },
          { symbol: 'SHIVM', name: 'Shivam Cements', sector: 'Manufacturing', lastPrice: 494.0, change: -14.0, pctChange: -2.76, volume: 92000 },
          { symbol: 'CIT', name: 'Citizen Investment Trust', sector: 'Investment', lastPrice: 2160.0, change: -48.0, pctChange: -2.17, volume: 18000 },
          { symbol: 'NLIC', name: 'Nepal Life Insurance', sector: 'Life Insurance', lastPrice: 628.0, change: -12.0, pctChange: -1.88, volume: 84000 },
          { symbol: 'CHCL', name: 'Chilime Hydropower', sector: 'Hydropower', lastPrice: 404.0, change: -6.0, pctChange: -1.46, volume: 110000 },
          { symbol: 'GBIME', name: 'Global IME Bank', sector: 'Banking', lastPrice: 276.0, change: -3.0, pctChange: -1.08, volume: 165000 },
        ],
        turnover: [
          { symbol: 'NABIL', name: 'Nabil Bank Limited', sector: 'Banking', lastPrice: 538.0, change: 24.0, pctChange: 4.67, volume: 680000 },
          { symbol: 'AHPC', name: 'Arun Valley Hydropower', sector: 'Hydropower', lastPrice: 388.0, change: 32.0, pctChange: 8.99, volume: 512000 },
          { symbol: 'NICA', name: 'NIC Asia Bank Ltd.', sector: 'Banking', lastPrice: 472.0, change: 19.0, pctChange: 4.19, volume: 410000 },
          { symbol: 'API', name: 'API Power Company', sector: 'Hydropower', lastPrice: 242.0, change: 18.0, pctChange: 8.04, volume: 620000 },
          { symbol: 'AKPL', name: 'Ankhu Khola Jalvidhyut', sector: 'Hydropower', lastPrice: 312.4, change: 28.4, pctChange: 10.0, volume: 480200 },
          { symbol: 'SHIVM', name: 'Shivam Cements', sector: 'Manufacturing', lastPrice: 494.0, change: -14.0, pctChange: -2.76, volume: 280000 },
        ],
        mostActive: [
          { symbol: 'API', name: 'API Power Company', sector: 'Hydropower', lastPrice: 242.0, change: 18.0, pctChange: 8.04, volume: 840000 },
          { symbol: 'NABIL', name: 'Nabil Bank Limited', sector: 'Banking', lastPrice: 538.0, change: 24.0, pctChange: 4.67, volume: 680000 },
          { symbol: 'AHPC', name: 'Arun Valley Hydropower', sector: 'Hydropower', lastPrice: 388.0, change: 32.0, pctChange: 8.99, volume: 512000 },
          { symbol: 'AKPL', name: 'Ankhu Khola Jalvidhyut', sector: 'Hydropower', lastPrice: 312.4, change: 28.4, pctChange: 10.0, volume: 480200 },
          { symbol: 'NICA', name: 'NIC Asia Bank Ltd.', sector: 'Banking', lastPrice: 472.0, change: 19.0, pctChange: 4.19, volume: 410000 },
          { symbol: 'GBIME', name: 'Global IME Bank', sector: 'Banking', lastPrice: 276.0, change: -3.0, pctChange: -1.08, volume: 385000 },
        ],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 45000);
    return () => clearInterval(interval);
  }, [fetchMarketData]);

  return { marketSummary, movers, loading, refresh: fetchMarketData };
}
