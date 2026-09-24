import React, { useState, useEffect, useRef } from 'react';
import {
  TrendingUp,
  Search,
  Bell,
  Menu,
  X,
  BarChart2,
  Cpu,
  Activity,
  Globe,
  Briefcase,
  Layers,
  Scale,
  Volume2,
  VolumeX,
  CheckCircle2,
} from 'lucide-react';
import { getMarketStatus } from '../../utils/mockData';
import { TriggeredAlertItem } from '../../types/stock';

export type NavTab = 'overview' | 'ai' | 'technical' | 'screener' | 'portfolio' | 'sectors';

interface HeaderProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  onOpenSearch: () => void;
  onOpenAlerts: () => void;
  onOpenArchitecture: () => void;
  onOpenComparison: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  unreadCount?: number;
  triggeredHistory?: TriggeredAlertItem[];
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  watchlistCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onChangeTab,
  onOpenSearch,
  onOpenAlerts,
  onOpenArchitecture,
  onOpenComparison,
  mobileMenuOpen,
  onToggleMobileMenu,
  unreadCount = 0,
  triggeredHistory = [],
  soundEnabled = true,
  onToggleSound,
}) => {
  const [market, setMarket] = useState(getMarketStatus());
  const [notificationOpen, setNotificationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setMarket(getMarketStatus()), 60_000);
    return () => clearInterval(t);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <BarChart2 className="h-3.5 w-3.5" /> },
    { id: 'ai', label: 'AI Insights', icon: <Cpu className="h-3.5 w-3.5" /> },
    { id: 'technical', label: 'Technical', icon: <Activity className="h-3.5 w-3.5" /> },
    { id: 'screener', label: 'Market Movers', icon: <Layers className="h-3.5 w-3.5" /> },
    { id: 'portfolio', label: 'Portfolio Tracker', icon: <Briefcase className="h-3.5 w-3.5" /> },
    { id: 'sectors', label: 'Sectors', icon: <Globe className="h-3.5 w-3.5" /> },
  ];

  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{ background: 'rgba(14,17,23,0.92)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255,255,255,0.08)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 shrink-0 cursor-pointer" onClick={() => onChangeTab('overview')}>
            <div
              className="h-7 w-7 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/10"
              style={{ background: 'rgba(79,142,247,0.18)', border: '1px solid rgba(79,142,247,0.3)' }}
            >
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight flex items-center gap-1">
              NEPSE<span className="text-blue-400 font-mono">ALARM</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-blue-600/30 text-blue-300 font-bold uppercase tracking-wider ml-1">
                AI
              </span>
            </span>
          </div>

          {/* Nav tabs — desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onChangeTab(tab.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: isActive ? '#f1f5f9' : '#64748b',
                    border: isActive ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
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
          {/* Market open pill */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${market.isOpen ? 'bg-emerald-400 pulse-dot' : 'bg-slate-500'}`} />
            <span className={market.isOpen ? 'text-emerald-400' : 'text-slate-400'}>
              {market.isOpen ? 'Market Open' : 'Closed'}
            </span>
          </div>

          {/* Compare Modal Button */}
          <button
            onClick={onOpenComparison}
            className="hidden sm:flex btn text-xs gap-1.5"
            title="Compare NEPSE Stocks Side-by-Side"
          >
            <Scale className="h-3.5 w-3.5 text-blue-400" />
            <span>Compare</span>
          </button>

          {/* Search Button */}
          <button onClick={onOpenSearch} className="btn text-xs gap-2">
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd
              className="hidden lg:inline text-[10px] font-mono px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              ⌘K
            </kbd>
          </button>

          {/* Audio Chime Mute/Unmute */}
          {onToggleSound && (
            <button
              onClick={onToggleSound}
              className={`btn p-2 text-xs transition-colors ${
                soundEnabled ? 'text-emerald-400' : 'text-slate-500'
              }`}
              style={{ width: 36, height: 36, justifyContent: 'center' }}
              title={soundEnabled ? 'Sound Alerts: Active' : 'Sound Alerts: Muted'}
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
          )}

          {/* Notification Bell Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                setNotificationOpen(p => !p);
              }}
              className="btn p-2 text-xs relative"
              style={{ width: 36, height: 36, justifyContent: 'center' }}
              title="Price Alarms & Triggers"
            >
              <Bell className="h-3.5 w-3.5 text-slate-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Bell Dropdown Popover */}
            {notificationOpen && (
              <div
                className="absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl z-50 p-4 border flex flex-col gap-3"
                style={{
                  background: '#161b27',
                  borderColor: 'rgba(255,255,255,0.1)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                }}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Bell className="h-4 w-4 text-blue-400" />
                    <span className="text-xs font-bold text-white">Triggered Alarms</span>
                  </div>
                  <button
                    onClick={() => {
                      setNotificationOpen(false);
                      onOpenAlerts();
                    }}
                    className="text-[11px] text-blue-400 hover:underline font-semibold"
                  >
                    Manage Alarms →
                  </button>
                </div>

                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                  {triggeredHistory.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No active alarm triggers yet.
                    </div>
                  ) : (
                    triggeredHistory.slice(0, 5).map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white">{item.symbol}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{item.triggeredAt}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-0.5">{item.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <button
                  onClick={() => {
                    setNotificationOpen(false);
                    onOpenAlerts();
                  }}
                  className="w-full py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
                >
                  Configure New Alarms
                </button>
              </div>
            )}
          </div>

          {/* AI Architecture Modal */}
          <button onClick={onOpenArchitecture} className="hidden sm:flex btn btn-accent text-xs gap-1.5">
            <Cpu className="h-3.5 w-3.5" />
            <span>AI Architecture</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden btn p-2 text-xs"
            style={{ width: 36, height: 36, justifyContent: 'center' }}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden border-t px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onChangeTab(tab.id);
                  onToggleMobileMenu();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0"
                style={{
                  background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: isActive ? '#f1f5f9' : '#64748b',
                  border: isActive ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
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
