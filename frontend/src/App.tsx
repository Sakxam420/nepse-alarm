import { useState, useMemo } from 'react';
import { useStockData } from './hooks/useStockData';
import { useWatchlist } from './hooks/useWatchlist';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { TickerTape } from './components/layout/TickerTape';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/layout/SearchModal';
import { StockSidebar } from './components/stock-explorer/StockSidebar';
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
import { Tabs } from './components/common/Tabs';
import { Cpu, Layers, BarChart2, RefreshCw } from 'lucide-react';
import { computePriceStats } from './utils/financialCalculations';

export default function App() {
  const {
    companies,
    selectedSymbol,
    setSelectedSymbol,
    history,
    prediction,
    loadingStock,
    training,
    backendOnline,
    triggerRetrain,
  } = useStockData();

  const { watchlist, toggleFavorite } = useWatchlist();

  // Modal States
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [architectureModalOpen, setArchitectureModalOpen] = useState(false);
  const [alertsModalOpen, setAlertsModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Active View Tab for lower section
  const [activeTab, setActiveTab] = useState<'ai_insights' | 'technical_scorecard' | 'sector_matrix'>('ai_insights');

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info', title?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Global Keyboard shortcuts (Ctrl+K, Esc)
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

  const latestPrice = useMemo(() => {
    if (!priceStats.latest) return null;
    return {
      close: priceStats.dayClose,
      open: priceStats.dayOpen,
      high: priceStats.dayHigh,
      low: priceStats.dayLow,
      change: priceStats.dayChange,
      pctChange: priceStats.dayPctChange,
    };
  }, [priceStats]);

  const handleRetrainModel = async () => {
    addToast(`Dispatching training request for ${selectedSymbol} to ML Service...`, 'info', 'ML Pipeline');
    const res = await triggerRetrain(selectedSymbol);
    if (res.success) {
      addToast(res.message, 'success', 'Model Updated');
    } else {
      addToast(res.message, 'error', 'Training Error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050811] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Toast Manager */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Top Benchmark Marquee Ribbon */}
      <TickerTape />

      {/* Primary Navigation Header */}
      <Header
        selectedSymbol={selectedSymbol}
        selectedCompany={selectedCompany}
        latestPrice={latestPrice}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenArchitecture={() => setArchitectureModalOpen(true)}
        onOpenAlerts={() => setAlertsModalOpen(true)}
        backendOnline={backendOnline}
        mobileMenuOpen={mobileSidebarOpen}
        onToggleMobileMenu={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      {/* Master Content Layout */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Securities Explorer Sidebar (Cols 1-3) */}
        <div className="lg:col-span-3 xl:col-span-3">
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

        {/* Main Body: Visualizer & Analytics (Cols 4-12) */}
        <div className="lg:col-span-9 xl:col-span-9 flex flex-col gap-6">
          
          {/* Key Metrics Quick Stats Bar */}
          <KeyMetricsGrid history={history} />

          {/* Interactive Pro Financial Chart */}
          <div className="relative">
            {loadingStock && (
              <div className="absolute inset-0 bg-[#050811]/60 backdrop-blur-xs z-20 flex items-center justify-center rounded-2xl">
                <div className="p-4 rounded-xl glass-panel-elevated flex items-center gap-3 border border-slate-700">
                  <RefreshCw className="h-5 w-5 text-cyan-400 animate-spin" />
                  <span className="text-xs font-mono text-slate-200">Syncing price series...</span>
                </div>
              </div>
            )}
            <FinancialChart company={selectedCompany} history={history} />
          </div>

          {/* Institutional Data & Analytics Multi-View Tabs */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Tabs
                tabs={[
                  { id: 'ai_insights', label: 'AI Decision & Confluence', icon: <Cpu className="h-3.5 w-3.5" /> },
                  { id: 'technical_scorecard', label: 'Indicator Scorecard', icon: <BarChart2 className="h-3.5 w-3.5" /> },
                  { id: 'sector_matrix', label: 'Sector Flow Matrix', icon: <Layers className="h-3.5 w-3.5" /> },
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
                variant="pill"
              />
            </div>

            {/* TAB 1: AI DECISION & CONFLUENCE */}
            {activeTab === 'ai_insights' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
                <PredictionCard
                  prediction={prediction}
                  selectedSymbol={selectedSymbol}
                  training={training}
                  onRetrain={handleRetrainModel}
                  onOpenArchitecture={() => setArchitectureModalOpen(true)}
                />
                <FeatureImportance prediction={prediction} />
                <SignalConfluence prediction={prediction} />
              </div>
            )}

            {/* TAB 2: TECHNICAL INDICATOR SCORECARD */}
            {activeTab === 'technical_scorecard' && (
              <div className="animate-fadeIn">
                <TechnicalSummaryMeter latestBar={priceStats.latest} />
              </div>
            )}

            {/* TAB 3: SECTOR FLOW MATRIX */}
            {activeTab === 'sector_matrix' && (
              <div className="animate-fadeIn">
                <SectorHeatmap />
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Global Footer */}
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

      {/* Academic Model Architecture Flowchart Modal */}
      <ModelArchitectureModal
        isOpen={architectureModalOpen}
        onClose={() => setArchitectureModalOpen(false)}
      />

      {/* Quantitative Price & Indicator Alert Modal */}
      <PriceAlertModal
        isOpen={alertsModalOpen}
        onClose={() => setAlertsModalOpen(false)}
        selectedSymbol={selectedSymbol}
        currentPrice={latestPrice?.close || 0}
        onAddToast={addToast}
      />

    </div>
  );
}
