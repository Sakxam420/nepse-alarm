import React from 'react';
import { TrendingUp, TrendingDown, Star, Bell, RefreshCw } from 'lucide-react';
import { Company, PriceBar, Prediction } from '../../types/stock';

const fmtPrice = (v: number) => `Rs. ${v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtPct = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;

interface StockHeroProps {
  company?: Company;
  latestBar: PriceBar | null;
  previousBar: PriceBar | null;
  prediction: Prediction | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenAlerts: () => void;
  onRetrain: () => void;
  training: boolean;
}

export const StockHero: React.FC<StockHeroProps> = ({
  company, latestBar, previousBar, prediction,
  isFavorite, onToggleFavorite, onOpenAlerts, onRetrain, training,
}) => {
  if (!company || !latestBar) {
    return (
      <div className="card p-5">
        <div className="skeleton h-8 w-40 mb-3" />
        <div className="skeleton h-12 w-56 mb-2" />
        <div className="skeleton h-5 w-32" />
      </div>
    );
  }

  const prevClose = previousBar?.close ?? latestBar.open;
  const change = latestBar.close - prevClose;
  const pctChange = prevClose > 0 ? (change / prevClose) * 100 : 0;
  const isUp = change >= 0;

  const trend = prediction?.trend ?? 'Neutral';
  const confidence = prediction?.confidence ?? 50;
  const isBullish = trend === 'Bullish';
  const isBearish = trend === 'Bearish';

  const trendColor = isBullish ? '#4ade80' : isBearish ? '#f87171' : '#fbbf24';
  const trendBg = isBullish ? 'rgba(34,197,94,0.08)' : isBearish ? 'rgba(239,68,68,0.08)' : 'rgba(251,191,36,0.08)';

  return (
    <div className="card p-5 sm:p-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        
        {/* Left: Company info & price */}
        <div className="flex flex-col gap-3">
          {/* Company header */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onToggleFavorite}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: isFavorite ? '#fbbf24' : '#475569', background: isFavorite ? 'rgba(251,191,36,0.1)' : 'transparent' }}
            >
              <Star className={`h-4 w-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">{company.symbol}</h1>
                <span
                  className="text-[11px] font-medium px-2 py-0.5 rounded-md"
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}
                >
                  {company.sector}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{company.name}</p>
            </div>
          </div>

          {/* Big price */}
          <div className="flex items-end gap-3">
            <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-mono">
              {fmtPrice(latestBar.close)}
            </span>
            <div className={isUp ? 'up-pill' : 'down-pill'} style={{ marginBottom: 4 }}>
              {isUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              {isUp ? '+' : ''}{change.toFixed(2)} · {fmtPct(pctChange)}
            </div>
          </div>

          {/* Sub-stats */}
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>H <strong className="text-white font-mono">{latestBar.high.toFixed(2)}</strong></span>
            <span>L <strong className="text-white font-mono">{latestBar.low.toFixed(2)}</strong></span>
            <span>O <strong className="text-white font-mono">{latestBar.open.toFixed(2)}</strong></span>
            <span>Vol <strong className="text-white font-mono">{latestBar.volume.toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Right: AI signal + actions */}
        <div className="flex flex-col gap-3 sm:items-end">
          {/* AI Signal */}
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: trendBg, border: `1px solid ${trendColor}22` }}
          >
            <div className="flex flex-col">
              <span className="text-[11px] font-medium uppercase tracking-wide" style={{ color: trendColor }}>
                AI Signal · {confidence.toFixed(0)}% Confidence
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {isBullish && <TrendingUp className="h-5 w-5" style={{ color: trendColor }} />}
                {isBearish && <TrendingDown className="h-5 w-5" style={{ color: trendColor }} />}
                <span className="text-base font-bold" style={{ color: trendColor }}>{trend}</span>
              </div>
              <span className="text-[11px] text-slate-400 max-w-[220px] mt-0.5 leading-relaxed">
                {prediction?.message ?? 'Loading signal...'}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button onClick={onOpenAlerts} className="btn text-xs">
              <Bell className="h-3.5 w-3.5" />
              Set Alert
            </button>
            <button
              onClick={onRetrain}
              disabled={training}
              className="btn text-xs disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${training ? 'animate-spin text-blue-400' : ''}`} />
              {training ? 'Training...' : 'Retrain AI'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
