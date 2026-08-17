import React from 'react';
import { Company, PriceBar, Prediction } from '../../types/stock';
import { formatNPR, formatPercentage } from '../../utils/formatters';
import { Star, TrendingUp, TrendingDown, Bell, RefreshCw } from 'lucide-react';
import { Badge } from '../common/Badge';

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
  company,
  latestBar,
  previousBar,
  prediction,
  isFavorite,
  onToggleFavorite,
  onOpenAlerts,
  onRetrain,
  training,
}) => {
  if (!company || !latestBar) return null;

  const prevClose = previousBar?.close ?? latestBar.open;
  const change = latestBar.close - prevClose;
  const pctChange = prevClose > 0 ? (change / prevClose) * 100 : 0;
  const isPositive = change >= 0;

  const trend = prediction?.trend || 'Neutral';
  const confidence = prediction?.confidence || 50;
  const isBullish = trend === 'Bullish';
  const isBearish = trend === 'Bearish';

  return (
    <div className="p-5 sm:p-6 rounded-2xl surface-card flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all">
      {/* Left: Stock info & Big Price */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleFavorite}
            className={`p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors ${
              isFavorite ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 hover:text-slate-300'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Star to watchlist'}
          >
            <Star className={`h-4 w-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>
          
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans">
                {company.symbol}
              </h2>
              <Badge variant="neutral" size="sm">
                {company.sector}
              </Badge>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {company.name}
            </span>
          </div>
        </div>

        {/* Big Price & Change */}
        <div className="flex items-baseline gap-3 mt-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
            {formatNPR(latestBar.close)}
          </span>
          <span
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg ${
              isPositive
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {isPositive ? '+' : ''}{change.toFixed(2)} ({formatPercentage(pctChange)})
          </span>
        </div>
      </div>

      {/* Right: Clean AI Signal Card & Quick Actions */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
        
        {/* Clean AI Pill */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800/90">
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              isBullish ? 'bg-emerald-400 animate-pulse' : isBearish ? 'bg-rose-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white uppercase tracking-wide">
                AI Signal: {trend}
              </span>
              <span className="text-[11px] font-mono font-semibold text-slate-400">
                ({confidence.toFixed(0)}% Conf.)
              </span>
            </div>
            <span className="text-[10px] text-slate-400 truncate max-w-[220px]">
              {prediction?.message || 'Analyzing market series...'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAlerts}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            <Bell className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Set Alert</span>
          </button>

          <button
            onClick={onRetrain}
            disabled={training}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors disabled:opacity-50"
            title="Retrain AI Model"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${training ? 'animate-spin text-emerald-400' : ''}`} />
            <span className="hidden sm:inline">{training ? 'Training...' : 'Retrain'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
