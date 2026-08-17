import { useState, useMemo } from 'react';
import { useStockData } from './hooks/useStockData';
import { useWatchlist } from './hooks/useWatchlist';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

import { TickerTape } from './components/layout/TickerTape';
import { Header, NavTab } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/layout/SearchModal';

import { StockSidebar } from './components/stock-explorer/StockSidebar';
import { StockHero } from './components/stock-explorer/StockHero';

import { FinancialChart } from './components/chart/FinancialChart';

import { PredictionCard } from './components/prediction/PredictionCard';
import { FeatureImportance } from './components/prediction/FeatureImportance';
import { SignalConfluence } from './components/prediction/SignalConfluence';
import { ModelArchitectureModal } from './components/prediction/ModelArchitectureModal';

import { KeyMetricsGrid } from './components/analytics/KeyMetricsGrid';
import { TechnicalSummaryMeter } from './components/analytics/TechnicalSummaryMeter';
import { SectorHeatmap } from './components/analytics/SectorHeatmap';

import { PriceAlertModal } from './components/alerts/PriceAlertModal';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { computePriceStats } from './utils/financialCalculations';

export default function App() {
  const { companies, selectedSymbol, setSelectedSymbol, history, prediction, loadingStock, training, triggerRetrain } = useStockData();
  const { watchlist, toggleFavorite, isFavorite } = useWatchlist();

  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [archOpen, setArchOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info', title?: string) => {
    const id = Date.now().toString();
    setToasts(p => [...p, { id, message, type, title }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  };

  useKeyboardShortcuts({
    onOpenSearch: () => setSearchOpen(true),
    onEscape: () => { setSearchOpen(false); setArchOpen(false); setAlertsOpen(false); setMobileSidebarOpen(false); },
  });

  const selectedCompany = useMemo(() => companies.find(c => c.symbol === selectedSymbol), [companies, selectedSymbol]);
  const stats = useMemo(() => computePriceStats(history), [history]);

  const handleRetrain = async () => {
    addToast(`Training AI model for ${selectedSymbol}…`, 'info', 'ML Pipeline');
    const res = await triggerRetrain(selectedSymbol);
    addToast(res.message, res.success ? 'success' : 'error', res.success ? 'Model Updated' : 'Notice');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0e1117', color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }} className="flex flex-col">
      <ToastContainer toasts={toasts} onDismiss={id => setToasts(p => p.filter(t => t.id !== id))} />

      {/* Market Index Tape */}
      <TickerTape />

      {/* Header + Navigation */}
      <Header
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAlerts={() => setAlertsOpen(true)}
        onOpenArchitecture={() => setArchOpen(true)}
        mobileMenuOpen={mobileSidebarOpen}
        onToggleMobileMenu={() => setMobileSidebarOpen(v => !v)}
        watchlistCount={watchlist.length}
      />

      {/* Page body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col gap-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* ── Left Sidebar: 3 cols ── */}
          <div className="lg:col-span-3">
            <StockSidebar
              companies={companies}
              selectedSymbol={selectedSymbol}
              onSelectSymbol={setSelectedSymbol}
              watchlist={watchlist}
              onToggleFavorite={toggleFavorite}
              mobileOpen={mobileSidebarOpen}
              onCloseMobile={() => setMobileSidebarOpen(false)}
            />
          </div>

          {/* ── Main Content: 9 cols ── */}
          <div className="lg:col-span-9 flex flex-col gap-5">
            
            {/* Stock spotlight hero */}
            <StockHero
              company={selectedCompany}
              latestBar={stats.latest}
              previousBar={stats.previous}
              prediction={prediction}
              isFavorite={isFavorite(selectedSymbol)}
              onToggleFavorite={() => toggleFavorite(selectedSymbol)}
              onOpenAlerts={() => setAlertsOpen(true)}
              onRetrain={handleRetrain}
              training={training}
            />

            {/* ── Tab View 1: OVERVIEW ── */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-5">
                {/* 4 quick stats */}
                <KeyMetricsGrid history={history} />

                {/* Chart */}
                <div className="relative">
                  {loadingStock && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl" style={{ background: 'rgba(14,17,23,0.7)', backdropFilter: 'blur(4px)' }}>
                      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl" style={{ background: '#161b27', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="h-3.5 w-3.5 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
                        <span className="text-xs text-slate-300">Loading price data…</span>
                      </div>
                    </div>
                  )}
                  <FinancialChart company={selectedCompany} history={history} />
                </div>

                {/* AI + Technical side-by-side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <PredictionCard
                    prediction={prediction}
                    training={training}
                    onRetrain={handleRetrain}
                    onOpenArchitecture={() => setArchOpen(true)}
                  />
                  <TechnicalSummaryMeter latestBar={stats.latest} />
                </div>
              </div>
            )}

            {/* ── Tab View 2: AI INSIGHTS ── */}
            {activeTab === 'ai' && (
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <PredictionCard prediction={prediction} training={training} onRetrain={handleRetrain} onOpenArchitecture={() => setArchOpen(true)} />
                  <FeatureImportance prediction={prediction} />
                  <SignalConfluence prediction={prediction} />
                </div>

                {/* Plain-English explanation card */}
                <div className="card p-5">
                  <h3 className="text-sm font-semibold text-white mb-2">How does the AI prediction work?</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                    The model runs in two stages. First, a Long Short-Term Memory (LSTM) neural network reads the last 30 trading days of price and volume data to detect patterns and momentum sequences. Then, an XGBoost decision-tree classifier combines those patterns with traditional indicators (RSI, MACD, EMA) to predict whether the stock is likely to trend <strong className="text-green-400">Bullish</strong>, <strong className="text-red-400">Bearish</strong>, or <strong className="text-amber-400">Neutral</strong> over the next few sessions.
                  </p>
                  <button
                    onClick={() => setArchOpen(true)}
                    className="mt-4 btn btn-accent text-xs"
                  >
                    View Full Architecture →
                  </button>
                </div>
              </div>
            )}

            {/* ── Tab View 3: TECHNICAL ── */}
            {activeTab === 'technical' && (
              <div className="flex flex-col gap-5">
                <TechnicalSummaryMeter latestBar={stats.latest} />
                <FinancialChart company={selectedCompany} history={history} />
              </div>
            )}

            {/* ── Tab View 4: SECTORS ── */}
            {activeTab === 'sectors' && (
              <SectorHeatmap />
            )}

          </div>
        </div>
      </main>

      <Footer />

      {/* Modals */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        companies={companies}
        selectedSymbol={selectedSymbol}
        onSelectSymbol={setSelectedSymbol}
        watchlist={watchlist}
        onToggleFavorite={toggleFavorite}
      />
      <ModelArchitectureModal isOpen={archOpen} onClose={() => setArchOpen(false)} />
      <PriceAlertModal
        isOpen={alertsOpen}
        onClose={() => setAlertsOpen(false)}
        selectedSymbol={selectedSymbol}
        currentPrice={stats.dayClose || 0}
        onAddToast={addToast}
      />
    </div>
  );
}
