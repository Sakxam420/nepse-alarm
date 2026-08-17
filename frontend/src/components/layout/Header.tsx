import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Menu,
  X,
  TrendingUp,
  TrendingDown,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { Company } from '../../types/stock';
import { formatNPR, formatPercentage } from '../../utils/formatters';
import { getMarketStatus } from '../../utils/mockData';
import { Badge } from '../common/Badge';

interface HeaderProps {
  selectedSymbol: string;
  selectedCompany?: Company;
  latestPrice: {
    close: number;
    open: number;
    high: number;
    low: number;
    change: number;
    pctChange: number;
  } | null;
  onOpenSearch: () => void;
  onOpenArchitecture: () => void;
  onOpenAlerts: () => void;
  backendOnline: boolean;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedSymbol,
  selectedCompany,
  latestPrice,
  onOpenSearch,
  onOpenArchitecture,
  onOpenAlerts,
  backendOnline,
  mobileMenuOpen,
  onToggleMobileMenu,
}) => {
  const [marketStatus, setMarketStatus] = useState(getMarketStatus());

  useEffect(() => {
    const timer = setInterval(() => {
      setMarketStatus(getMarketStatus());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const isPositive = latestPrice ? latestPrice.change >= 0 : true;

  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-3.5 transition-all">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity & Session Pill */}
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-glow-cyan">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5 font-sans">
                NEPSE<span className="text-cyan-400">.AI</span>
              </h1>
              <Badge variant="cyan" size="sm">BCA TERMINAL</Badge>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mt-0.5">
              <span className="flex items-center gap-1">
                <span className={`h-1.5 w-1.5 rounded-full ${marketStatus.isOpen ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                <span className={marketStatus.isOpen ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-medium'}>
                  {marketStatus.statusText}
                </span>
              </span>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="hidden sm:inline text-slate-500">{marketStatus.nextSessionTime}</span>
            </div>
          </div>
        </div>

        {/* Center: Active Security Spotlight Card (Desktop) */}
        {latestPrice && selectedCompany && (
          <div className="hidden xl:flex items-center gap-5 px-4 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-bold text-white tracking-tight">{selectedSymbol}</span>
              <Badge variant="sector">{selectedCompany.sector}</Badge>
            </div>
            <div className="h-5 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-500 uppercase block leading-none mb-0.5">LTP</span>
              <span className="text-sm font-bold text-slate-100">{formatNPR(latestPrice.close)}</span>
            </div>
            <div className="h-5 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-500 uppercase block leading-none mb-0.5">24h Delta</span>
              <span
                className={`text-sm font-bold flex items-center gap-0.5 ${
                  isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isPositive ? <TrendingUp className="h-3 w-3 inline" /> : <TrendingDown className="h-3 w-3 inline" />}
                {formatPercentage(latestPrice.pctChange)}
              </span>
            </div>
          </div>
        )}

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Button (Ctrl+K) */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all text-xs font-medium group"
            title="Search Securities (Ctrl+K)"
          >
            <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            <span className="hidden md:inline">Quick Search</span>
            <kbd className="hidden md:inline text-[10px] font-mono px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded border border-slate-700/60">
              ⌘K
            </kbd>
          </button>

          {/* Architecture Pipeline Modal Trigger */}
          <button
            onClick={onOpenArchitecture}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:text-cyan-200 transition-all text-xs font-semibold"
            title="Explain Hybrid ML Architecture"
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>AI Architecture</span>
          </button>

          {/* Price Alert Button */}
          <button
            onClick={onOpenAlerts}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-cyan-400 transition-all relative"
            title="Configure Price & Indicator Alerts"
            aria-label="Alerts"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-400 ring-2 ring-[#090d16]" />
          </button>

          {/* Backend Status Dot */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
            <span className={`h-2 w-2 rounded-full ${backendOnline ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span>{backendOnline ? 'BACKEND OK' : 'OFFLINE MODE'}</span>
          </div>

          {/* Mobile Drawer Trigger */}
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
            aria-label="Toggle Navigation Drawer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>
    </header>
  );
};
