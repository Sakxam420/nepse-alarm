import { useState, useMemo, useEffect } from 'react';
import { useStockData } from './hooks/useStockData';
import { useWatchlist } from './hooks/useWatchlist';
import { useAlerts } from './hooks/useAlerts';
import { usePortfolio } from './hooks/usePortfolio';
import { useMarketOverview } from './hooks/useMarketOverview';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAuth } from './hooks/useAuth';

import { TickerTape } from './components/layout/TickerTape';
import { Header, NavTab } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/layout/SearchModal';
import { AuthModal } from './components/auth/AuthModal';

import { StockSidebar } from './components/stock-explorer/StockSidebar';
import { StockHero } from './components/stock-explorer/StockHero';

import { FinancialChart } from './components/chart/FinancialChart';

import { PredictionCard } from './components/prediction/PredictionCard';
import { FeatureImportance } from './components/prediction/FeatureImportance';
import { SignalConfluence } from './components/prediction/SignalConfluence';
import { ModelArchitectureModal } from './components/prediction/ModelArchitectureModal';
import { PriceEnvelopeCard } from './components/prediction/PriceEnvelopeCard';
import { BacktestSimulatorCard } from './components/prediction/BacktestSimulatorCard';

import { KeyMetricsGrid } from './components/analytics/KeyMetricsGrid';
import { TechnicalSummaryMeter } from './components/analytics/TechnicalSummaryMeter';
import { SectorHeatmap } from './components/analytics/SectorHeatmap';

import { PriceAlertModal } from './components/alerts/PriceAlertModal';
import { PortfolioView } from './components/portfolio/PortfolioView';
import { MarketMoversView } from './components/screener/MarketMoversView';
import { StockComparisonModal } from './components/comparison/StockComparisonModal';

import { ToastContainer, ToastMessage } from './components/common/Toast';
import { computePriceStats } from './utils/financialCalculations';
import { TriggeredAlertItem } from './types/stock';

export default function App() {
  const {
    companies,
    selectedSymbol,
    setSelectedSymbol,
    history,
    prediction,
    loadingStock,
    training,
    triggerRetrain,
  } = useStockData();

  const { watchlist, toggleFavorite, isFavorite } = useWatchlist();
  const auth = useAuth();

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info', title?: string) => {
    const id = Date.now().toString();
    setToasts((p) => [...p, { id, message, type, title }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4500);
  };

  // Real-time Alarm Hook
  const {
    alerts,
    triggeredHistory,
    unreadCount,
    soundEnabled,
    toggleSound,
    addAlert,
    deleteAlert,
    toggleAlert,
    evaluateAlerts,
    clearTriggeredHistory,
  } = useAlerts({
    onAlertTriggered: (item: TriggeredAlertItem) => {
      addToast(item.message, 'success', `Alarm: ${item.symbol}`);
    },
  });

  // Paper Trading / Portfolio Hook
  const {
    positions,
    summary: portfolioSummary,
    addPosition,
    deletePosition,
  } = usePortfolio();

  // Market Movers & Screener Hook
  const { marketSummary, movers, loading: loadingMarket } = useMarketOverview();

  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [archOpen, setArchOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [comparisonOpen, setComparisonOpen] = useState(false);

  useKeyboardShortcuts({
    onOpenSearch: () => setSearchOpen(true),
    onEscape: () => {
      setSearchOpen(false);
      setArchOpen(false);
      setAlertsOpen(false);
      setComparisonOpen(false);
      setMobileSidebarOpen(false);
    },
  });

  const selectedCompany = useMemo(
    () => companies.find((c) => c.symbol === selectedSymbol),
    [companies, selectedSymbol],
  );
  const stats = useMemo(() => computePriceStats(history), [history]);

  // Periodic alert check on latest stock tick
  useEffect(() => {
    if (history.length > 0) {
      const latest = history[history.length - 1];
      const prev = history[history.length - 2] || latest;
      const changePct = prev.close > 0 ? ((latest.close - prev.close) / prev.close) * 100 : 0;

      const map = new Map();
      map.set(selectedSymbol, {
        price: latest.close,
        rsi: latest.rsi14,
        macdHist: latest.macdHist,
        changePct,
      });
      evaluateAlerts(map);
    }
  }, [history, selectedSymbol, evaluateAlerts]);

  const handleRetrain = async () => {
    addToast(`Training hybrid AI model for ${selectedSymbol}…`, 'info', 'ML Pipeline');
    const res = await triggerRetrain(selectedSymbol);
    addToast(res.message, res.success ? 'success' : 'error', res.success ? 'Model Updated' : 'Notice');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0d14',
        color: '#f1f5f9',
        fontFamily: 'Inter, -apple-system, sans-serif',
      }}
      className="flex flex-col"
    >
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />

      {/* Market Index Ribbon */}
      <TickerTape />

      {/* Header + Primary Navigation */}
      <Header
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAlerts={() => setAlertsOpen(true)}
        onOpenArchitecture={() => setArchOpen(true)}
        onOpenComparison={() => setComparisonOpen(true)}
        mobileMenuOpen={mobileSidebarOpen}
        onToggleMobileMenu={() => setMobileSidebarOpen((v) => !v)}
        unreadCount={unreadCount}
        triggeredHistory={triggeredHistory}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        watchlistCount={watchlist.length}
        user={auth.user}
        onOpenLogin={auth.openAuthModal}
        onLogout={() => {
          auth.logout();
          addToast('Signed out of session', 'info');
        }}
      />

      {/* Page Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* ── Left Column: Stock Discovery Explorer (3 cols) ── */}
          <div className="lg:col-span-3 lg:sticky lg:top-20 self-start">
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

          {/* ── Right Column: Tab View Workspace (9 cols) ── */}
          <div className="lg:col-span-9 flex flex-col gap-5 min-w-0">
            {/* Stock Spotlight Banner */}
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

            {/* ── TAB 1: OVERVIEW ── */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-5">
                {/* 4 Quick Stat KPIs */}
                <KeyMetricsGrid history={history} />

                {/* Financial Chart */}
                <div className="relative">
                  {loadingStock && (
                    <div
                      className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl"
                      style={{ background: 'rgba(10,13,20,0.7)', backdropFilter: 'blur(4px)' }}
                    >
                      <div
                        className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
                        style={{ background: '#161b27', border: '1px solid rgba(255,255,255,0.08)' }}
                      >
                        <div className="h-3.5 w-3.5 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
                        <span className="text-xs text-slate-300">Synchronizing market history…</span>
                      </div>
                    </div>
                  )}
                  <FinancialChart company={selectedCompany} history={history} />
                </div>

                {/* AI Prediction & Technical Gauge */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <PredictionCard
                    prediction={prediction}
                    training={training}
                    onRetrain={handleRetrain}
                    onOpenArchitecture={() => setArchOpen(true)}
                  />
                  <TechnicalSummaryMeter latestBar={stats.latest} />
                </div>

                {/* Projected Envelope & Backtest Simulator */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <PriceEnvelopeCard envelope={prediction?.priceEnvelope} symbol={selectedSymbol} />
                  <BacktestSimulatorCard backtest={prediction?.backtest} symbol={selectedSymbol} />
                </div>
              </div>
            )}

            {/* ── TAB 2: AI INSIGHTS & EXPLAINABILITY ── */}
            {activeTab === 'ai' && (
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <PredictionCard
                    prediction={prediction}
                    training={training}
                    onRetrain={handleRetrain}
                    onOpenArchitecture={() => setArchOpen(true)}
                  />
                  <FeatureImportance prediction={prediction} />
                  <SignalConfluence prediction={prediction} />
                </div>

                {/* Projection & Backtest row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <PriceEnvelopeCard envelope={prediction?.priceEnvelope} symbol={selectedSymbol} />
                  <BacktestSimulatorCard backtest={prediction?.backtest} symbol={selectedSymbol} />
                </div>

                {/* Deep Academic Architectural Breakdown */}
                <div className="card p-5 border border-slate-800">
                  <h3 className="text-sm font-bold text-white mb-2">
                    How does the 2-Stage Hybrid LSTM-XGBoost Architecture operate?
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-400">
                    The platform evaluates NEPSE equities in two decoupled computational stages:
                    First, a PyTorch Recurrent Neural Network (LSTM) processes the sequential 30-day sliding window of
                    normalized OHLCV prices to generate a 16-dimensional temporal trend embedding.
                    Second, an XGBoost gradient-boosted decision tree combines those temporal embeddings with engineered
                    technical indicators (RSI 14, MACD Histogram, 50-day EMA Stance, Volume Delta) to classify the
                    probable trajectory into <strong className="text-green-400">Bullish</strong>,{' '}
                    <strong className="text-red-400">Bearish</strong>, or{' '}
                    <strong className="text-amber-400">Neutral</strong> regimes with empirical confidence metrics.
                  </p>
                  <button
                    onClick={() => setArchOpen(true)}
                    className="mt-4 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-all"
                  >
                    View System Architecture & Viva Defense Guide →
                  </button>
                </div>
              </div>
            )}

            {/* ── TAB 3: TECHNICAL MATRIX ── */}
            {activeTab === 'technical' && (
              <div className="flex flex-col gap-5">
                <TechnicalSummaryMeter latestBar={stats.latest} />
                <FinancialChart company={selectedCompany} history={history} />
                <KeyMetricsGrid history={history} />
              </div>
            )}

            {/* ── TAB 4: MARKET MOVERS & SCREENER ── */}
            {activeTab === 'screener' && (
              <MarketMoversView
                summary={marketSummary}
                movers={movers}
                loading={loadingMarket}
                onSelectSymbol={setSelectedSymbol}
              />
            )}

            {/* ── TAB 5: PORTFOLIO & PAPER TRADING ── */}
            {activeTab === 'portfolio' && (
              <PortfolioView
                positions={positions}
                summary={portfolioSummary}
                companies={companies}
                onAddPosition={addPosition}
                onDeletePosition={deletePosition}
                onSelectSymbol={setSelectedSymbol}
                onAddToast={addToast}
              />
            )}

            {/* ── TAB 6: SECTOR HEATMAP ── */}
            {activeTab === 'sectors' && <SectorHeatmap />}
          </div>
        </div>
      </main>

      <Footer />

      {/* Global Modals */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        companies={companies}
        selectedSymbol={selectedSymbol}
        onSelectSymbol={setSelectedSymbol}
        watchlist={watchlist}
        onToggleFavorite={toggleFavorite}
      />

      <PriceAlertModal
        isOpen={alertsOpen}
        onClose={() => setAlertsOpen(false)}
        selectedSymbol={selectedSymbol}
        currentPrice={stats.dayClose || 0}
        alerts={alerts}
        triggeredHistory={triggeredHistory}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onAddAlert={addAlert}
        onDeleteAlert={deleteAlert}
        onToggleAlert={toggleAlert}
        onClearHistory={clearTriggeredHistory}
        onAddToast={addToast}
      />

      <StockComparisonModal
        isOpen={comparisonOpen}
        onClose={() => setComparisonOpen(false)}
        companies={companies}
        initialSymbol={selectedSymbol}
        onSelectSymbol={setSelectedSymbol}
      />

      <ModelArchitectureModal isOpen={archOpen} onClose={() => setArchOpen(false)} />

      {/* Authentication Gateway & Profile Modal */}
      <AuthModal
        isOpen={auth.isAuthModalOpen}
        onClose={auth.closeAuthModal}
        lastUser={auth.lastUser}
        onLogin={async (email, pass, rem) => {
          const ok = await auth.login(email, pass, rem);
          if (ok) addToast('Welcome back to NEPSE AI!', 'success', 'Session Active');
          return ok;
        }}
        onRegister={async (name, email, pass) => {
          const ok = await auth.register(name, email, pass);
          if (ok) addToast('Trader account created successfully!', 'success', 'Welcome');
          return ok;
        }}
        onLoginAsGuest={() => {
          auth.loginAsGuest();
          addToast('Browsing as Guest Analyst', 'info', 'Guest Session');
        }}
        onForgetLastUser={auth.forgetLastUser}
        loading={auth.loading}
        errorMessage={auth.authError}
        onClearError={() => auth.setAuthError(null)}
      />
    </div>
  );
}
