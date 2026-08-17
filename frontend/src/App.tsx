import { useState, useMemo } from 'react';
import { useStockData } from './hooks/useStockData';
import { useWatchlist } from './hooks/useWatchlist';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { TickerTape } from './components/layout/TickerTape';
import { Header, MainNavTab } from './components/layout/Header';
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
import { PanelLeftClose, PanelLeftOpen, RefreshCw } from 'lucide-react';

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

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<MainNavTab>('overview');

  // Sidebar visibility toggle on desktop
  const [sidebarVisible, setSidebarVisible] = useState(true);

  // Modal States
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [architectureModalOpen, setArchitectureModalOpen] = useState(false);
  const [alertsModalOpen, setAlertsModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Toast messages
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info', title?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Keyboard Shortcuts (Ctrl+K, Esc)
  useKeyboardShortcuts({
    onOpenSearch: () => setSearchModalOpen(true),
    onEscape: () => {
      setSearchModalOpen(false);
      setArchitectureModalOpen(false);
      setAlertsModalOpen(false);
      setMobileSidebarOpen(false);
    },
  });

  const selectedCompany = useMemo(() => {
    return companies.find((c) => c.symbol === selectedSymbol);
  }, [companies, selectedSymbol]);

  const priceStats = useMemo(() => {
    return computePriceStats(history);
  }, [history]);

  const handleRetrainModel = async () => {
    addToast(`Training hybrid model for ${selectedSymbol}...`, 'info', 'ML Pipeline');
    const res = await triggerRetrain(selectedSymbol);
    if (res.success) {
      addToast(res.message, 'success', 'Model Updated');
    } else {
      addToast(res.message, 'error', 'Training Notice');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-200">
      
      {/* Toast Manager */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Top Ticker Ribbon */}
      <TickerTape />

      {/* Clean Navigation Header */}
      <Header
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenArchitecture={() => setArchitectureModalOpen(true)}
        onOpenAlerts={() => setAlertsModalOpen(true)}
        watchlistCount={watchlist.length}
        mobileMenuOpen={mobileSidebarOpen}
        onToggleMobileMenu={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      {/* Main Page Layout */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        
        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Collapsible Left Sidebar (Cols 1-3) */}
          {sidebarVisible && (
            <div className="lg:col-span-3 xl:col-span-3 transition-all">
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
          )}

          {/* Main Content Workspace (Cols 4-12 or full 12 if collapsed) */}
          <div className={`${sidebarVisible ? 'lg:col-span-9 xl:col-span-9' : 'lg:col-span-12'} flex flex-col gap-6 transition-all`}>
            
            {/* Desktop Sidebar Toggle & Breadcrumb */}
            <div className="hidden lg:flex items-center justify-between">
              <button
                onClick={() => setSidebarVisible(!sidebarVisible)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                {sidebarVisible ? <PanelLeftClose className="h-3.5 w-3.5" /> : <PanelLeftOpen className="h-3.5 w-3.5" />}
                <span>{sidebarVisible ? 'Hide Sidebar' : 'Show Stocks'}</span>
              </button>

              <div className="text-xs font-mono text-slate-500">
                Viewing: <strong className="text-slate-300">{selectedSymbol}</strong> ({selectedCompany?.name || 'Loading'})
              </div>
            </div>

            {/* Clean Stock Hero Banner */}
            <StockHero
              company={selectedCompany}
              latestBar={priceStats.latest}
              previousBar={priceStats.previous}
              prediction={prediction}
              isFavorite={isFavorite(selectedSymbol)}
              onToggleFavorite={() => toggleFavorite(selectedSymbol)}
              onOpenAlerts={() => setAlertsModalOpen(true)}
              onRetrain={handleRetrainModel}
              training={training}
            />

            {/* VIEW 1: OVERVIEW & CHART (Default) */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-6">
                {/* 4 Clean Key Metrics */}
                <KeyMetricsGrid history={history} />

                {/* Main Interactive Chart */}
                <div className="relative">
                  {loadingStock && (
                    <div className="absolute inset-0 bg-[#0b0f19]/60 backdrop-blur-xs z-20 flex items-center justify-center rounded-2xl">
                      <div className="p-3 rounded-xl surface-card flex items-center gap-2.5">
                        <RefreshCw className="h-4 w-4 text-emerald-400 animate-spin" />
                        <span className="text-xs font-mono text-slate-200">Loading price history...</span>
                      </div>
                    </div>
                  )}
                  <FinancialChart company={selectedCompany} history={history} />
                </div>

                {/* 2-Column AI & Indicator Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PredictionCard
                    prediction={prediction}
                    training={training}
                    onRetrain={handleRetrainModel}
                    onOpenArchitecture={() => setArchitectureModalOpen(true)}
                  />
                  <TechnicalSummaryMeter latestBar={priceStats.latest} />
                </div>
              </div>
            )}

            {/* VIEW 2: AI INTELLIGENCE & XAI */}
            {activeTab === 'ai_insights' && (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <PredictionCard
                    prediction={prediction}
                    training={training}
                    onRetrain={handleRetrainModel}
                    onOpenArchitecture={() => setArchitectureModalOpen(true)}
                  />
                  <FeatureImportance prediction={prediction} />
                  <SignalConfluence prediction={prediction} />
                </div>

                <div className="surface-card p-6 flex flex-col gap-3">
                  <h3 className="font-bold text-sm text-white">Understanding the Hybrid LSTM-XGBoost Model</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    The prediction engine uses a two-stage machine learning architecture. In Stage 1, a Long Short-Term Memory (LSTM) recurrent neural network processes sequential 30-day price sequences (OHLCV) to extract latent trend memory embeddings. In Stage 2, these embeddings are combined with tabular technical momentum indicators (RSI, MACD, and Moving Average divergences) and evaluated through an XGBoost decision tree classifier to forecast trend direction with probabilistic confidence scores.
                  </p>
                </div>
              </div>
            )}

            {/* VIEW 3: TECHNICAL SCORECARD */}
            {activeTab === 'technical' && (
              <div className="flex flex-col gap-6">
                <TechnicalSummaryMeter latestBar={priceStats.latest} />
                <FinancialChart company={selectedCompany} history={history} />
              </div>
            )}

            {/* VIEW 4: SECTOR MATRIX */}
            {activeTab === 'sectors' && (
              <div className="flex flex-col gap-6">
                <SectorHeatmap />
              </div>
            )}

          </div>

        </div>

      </main>

      {/* Clean Global Footer */}
      <Footer />

      {/* Search & Lookup Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        companies={companies}
        selectedSymbol={selectedSymbol}
        onSelectSymbol={setSelectedSymbol}
        watchlist={watchlist}
        onToggleFavorite={toggleFavorite}
      />

      {/* Model Architecture Modal */}
      <ModelArchitectureModal
        isOpen={architectureModalOpen}
        onClose={() => setArchitectureModalOpen(false)}
      />

      {/* Price Alert Modal */}
      <PriceAlertModal
        isOpen={alertsModalOpen}
        onClose={() => setAlertsModalOpen(false)}
        selectedSymbol={selectedSymbol}
        currentPrice={priceStats.dayClose || 0}
        onAddToast={addToast}
      />

    </div>
  );
}
