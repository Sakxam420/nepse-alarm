import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { PortfolioPosition, PortfolioSummary } from '../types/stock';

const getApiBase = () => {
  return (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api/v1';
};

const STORAGE_PORTFOLIO_KEY = 'nepse_portfolio_positions';

export function usePortfolio() {
  const [positions, setPositions] = useState<PortfolioPosition[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PORTFOLIO_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PORTFOLIO_KEY, JSON.stringify(positions));
    } catch {}
  }, [positions]);

  const fetchPortfolio = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${getApiBase()}/portfolio`, { timeout: 3500 });
      if (Array.isArray(res.data)) {
        setPositions(res.data);
      }
    } catch {
      // Offline fallback: keep local state
    } finally {
      setLoading(false);
    }
  }, []);

  const addPosition = useCallback(
    async (symbol: string, buyPrice: number, quantity: number, buyDate?: string, notes?: string) => {
      const tempId = Date.now().toString();
      const newPos: PortfolioPosition = {
        id: tempId,
        symbol: symbol.toUpperCase(),
        buyPrice,
        quantity,
        buyDate: buyDate || new Date().toISOString().split('T')[0],
        notes: notes || null,
        currentPrice: buyPrice,
        totalInvestment: buyPrice * quantity,
        currentValuation: buyPrice * quantity,
        unrealizedPnL: 0,
        unrealizedPnLPct: 0,
        dayGainLoss: 0,
      };

      try {
        const res = await axios.post(`${getApiBase()}/portfolio`, {
          symbol: symbol.toUpperCase(),
          buyPrice,
          quantity,
          buyDate,
          notes,
        }, { timeout: 3500 });

        if (res.data && res.data.id) {
          setPositions(prev => [res.data, ...prev.filter(p => p.id !== tempId)]);
          return;
        }
      } catch {}

      // Fallback local insert
      setPositions(prev => [newPos, ...prev]);
    },
    [],
  );

  const deletePosition = useCallback(async (id: string) => {
    setPositions(prev => prev.filter(p => p.id !== id));
    try {
      await axios.delete(`${getApiBase()}/portfolio/${id}`, { timeout: 3000 });
    } catch {}
  }, []);

  // Compute portfolio metrics client-side from positions
  const summary: PortfolioSummary = {
    positionCount: positions.length,
    totalInvested: Number(positions.reduce((acc, p) => acc + p.totalInvestment, 0).toFixed(2)),
    currentValuation: Number(positions.reduce((acc, p) => acc + p.currentValuation, 0).toFixed(2)),
    totalPnL: Number(
      (
        positions.reduce((acc, p) => acc + p.currentValuation, 0) -
        positions.reduce((acc, p) => acc + p.totalInvestment, 0)
      ).toFixed(2),
    ),
    totalPnLPct:
      positions.reduce((acc, p) => acc + p.totalInvestment, 0) > 0
        ? Number(
            (
              ((positions.reduce((acc, p) => acc + p.currentValuation, 0) -
                positions.reduce((acc, p) => acc + p.totalInvestment, 0)) /
                positions.reduce((acc, p) => acc + p.totalInvestment, 0)) *
              100
            ).toFixed(2),
          )
        : 0,
    dayGainLoss: Number(positions.reduce((acc, p) => acc + p.dayGainLoss, 0).toFixed(2)),
    sectorAllocation: (() => {
      const map = new Map<string, number>();
      const totalVal = positions.reduce((acc, p) => acc + p.currentValuation, 0);
      for (const p of positions) {
        const s = p.sector || 'Other';
        map.set(s, (map.get(s) || 0) + p.currentValuation);
      }
      return Array.from(map.entries())
        .map(([sector, value]) => ({
          sector,
          value: Number(value.toFixed(2)),
          percentage: totalVal > 0 ? Number(((value / totalVal) * 100).toFixed(1)) : 0,
        }))
        .sort((a, b) => b.value - a.value);
    })(),
  };

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  return {
    positions,
    summary,
    loading,
    addPosition,
    deletePosition,
    refreshPortfolio: fetchPortfolio,
  };
}
