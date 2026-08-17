import React, { useState, useEffect } from 'react';
import { TrendingUp, Search, Bell, Menu, X, BarChart2, Cpu, Activity, Globe } from 'lucide-react';
import { getMarketStatus } from '../../utils/mockData';

export type NavTab = 'overview' | 'ai' | 'technical' | 'sectors';

interface HeaderProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  onOpenSearch: () => void;
  onOpenAlerts: () => void;
  onOpenArchitecture: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  watchlistCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onChangeTab,
  onOpenSearch,
  onOpenAlerts,
  onOpenArchitecture,
  mobileMenuOpen,
  onToggleMobileMenu,
}) => {
  const [market, setMarket] = useState(getMarketStatus());
  useEffect(() => {
    const t = setInterval(() => setMarket(getMarketStatus()), 60_000);
    return () => clearInterval(t);
  }, []);

  const tabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview',  label: 'Overview',   icon: <BarChart2 className="h-3.5 w-3.5" /> },
    { id: 'ai',        label: 'AI Insights', icon: <Cpu className="h-3.5 w-3.5" /> },
    { id: 'technical', label: 'Technical',   icon: <Activity className="h-3.5 w-3.5" /> },
    { id: 'sectors',   label: 'Sectors',     icon: <Globe className="h-3.5 w-3.5" /> },
  ];

  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{ background: 'rgba(14,17,23,0.9)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255,255,255,0.07)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(79,142,247,0.15)', border: '1px solid rgba(79,142,247,0.25)' }}>
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">
              NEPSE<span className="text-blue-400">.AI</span>
            </span>
          </div>

          {/* Nav tabs — desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onChangeTab(tab.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                    color: isActive ? '#f1f5f9' : '#64748b',
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Market pill */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${market.isOpen ? 'bg-green-400 pulse-dot' : 'bg-slate-500'}`} />
            <span className={market.isOpen ? 'text-green-400' : 'text-slate-400'}>
              {market.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>

          {/* Search */}
          <button onClick={onOpenSearch} className="btn text-xs gap-2">
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden lg:inline text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>⌘K</kbd>
          </button>

          {/* AI Specs */}
          <button onClick={onOpenArchitecture} className="hidden sm:flex btn btn-accent text-xs gap-1.5">
            <Cpu className="h-3.5 w-3.5" />
            <span>AI Model</span>
          </button>

          {/* Alerts */}
          <button onClick={onOpenAlerts} className="btn p-2 text-xs" style={{ width: 36, height: 36, justifyContent: 'center' }} title="Price Alerts">
            <Bell className="h-3.5 w-3.5" />
          </button>

          {/* Mobile hamburger */}
          <button onClick={onToggleMobileMenu} className="md:hidden btn p-2 text-xs" style={{ width: 36, height: 36, justifyContent: 'center' }}>
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { onChangeTab(tab.id); onToggleMobileMenu(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0"
                style={{
                  background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                  color: isActive ? '#f1f5f9' : '#64748b',
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
