import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Menu,
  X,
  Cpu,
  TrendingUp,
  BarChart3,
  Layers,
  SlidersHorizontal,
} from 'lucide-react';
import { getMarketStatus } from '../../utils/mockData';

export type MainNavTab = 'overview' | 'ai_insights' | 'technical' | 'sectors';

interface HeaderProps {
  activeTab: MainNavTab;
  onChangeTab: (tab: MainNavTab) => void;
  onOpenSearch: () => void;
  onOpenArchitecture: () => void;
  onOpenAlerts: () => void;
  watchlistCount?: number;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onChangeTab,
  onOpenSearch,
  onOpenArchitecture,
  onOpenAlerts,
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

  const navItems = [
    { id: 'overview' as MainNavTab, label: 'Overview & Chart', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'ai_insights' as MainNavTab, label: 'AI Intelligence', icon: <Cpu className="h-4 w-4" /> },
    { id: 'technical' as MainNavTab, label: 'Technical Scorecard', icon: <SlidersHorizontal className="h-4 w-4" /> },
    { id: 'sectors' as MainNavTab, label: 'Sector Matrix', icon: <Layers className="h-4 w-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0b0f19]/90 backdrop-blur-lg border-b border-slate-800/80 px-4 sm:px-6 py-3 transition-all">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand & Market Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white tracking-tight font-sans">
                NEPSE<span className="text-emerald-400">.AI</span>
              </span>
            </div>
          </div>

          {/* Clean Market Status Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono">
            <span className={`h-1.5 w-1.5 rounded-full ${marketStatus.isOpen ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span className={marketStatus.isOpen ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
              {marketStatus.statusText}
            </span>
          </div>
        </div>

        {/* Center: Clean Navigation Bar (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 border border-slate-800/80">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-slate-800 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Search, Architecture Modal & Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all text-xs font-medium group"
          >
            <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-white" />
            <span className="hidden sm:inline">Search Stock</span>
            <kbd className="hidden md:inline text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded border border-slate-700">
              ⌘K
            </kbd>
          </button>

          {/* Model Architecture Guide */}
          <button
            onClick={onOpenArchitecture}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white transition-all text-xs font-medium"
            title="View Academic ML Architecture"
          >
            <Cpu className="h-3.5 w-3.5 text-emerald-400" />
            <span>AI Specs</span>
          </button>

          {/* Alerts Trigger */}
          <button
            onClick={onOpenAlerts}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Price Alerts"
            aria-label="Alerts"
          >
            <Bell className="h-4 w-4" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
            aria-label="Toggle Navigation Drawer"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Tab Bar */}
      <div className="flex lg:hidden items-center gap-1 overflow-x-auto pt-2 pb-0.5 no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
