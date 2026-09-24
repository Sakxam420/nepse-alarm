export type SectorType = 'All' | 'Banking' | 'Hydropower' | 'Finance' | 'Microfinance' | 'Insurance' | 'Life Insurance' | 'Non Life Insurance' | 'Development Banks' | 'Manufacturing' | 'Hotels' | 'Investment' | 'Others';

export type ChartType = 'candlestick' | 'line' | 'area';

export type Timeframe = '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';

export interface Company {
  symbol: string;
  name: string;
  sector: string;
  lastPrice?: number;
  change?: number;
  pctChange?: number;
  volume?: number;
  isFavorite?: boolean;
}

export interface PriceBar {
  id: number;
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ema12?: number | null;
  ema26?: number | null;
  ema50?: number | null;
  sma20?: number | null;
  rsi14?: number | null;
  macdLine?: number | null;
  macdSignal?: number | null;
  macdHist?: number | null;
  volumeDelta: number;
  // Bollinger Bands
  bbUpper?: number | null;
  bbMiddle?: number | null;
  bbLower?: number | null;
  dateFormatted?: string;
}

export interface PriceEnvelope {
  currentPrice: number;
  targetPrice: number;
  supportPrice: number;
  resistancePrice: number;
  projectedChangePct: number;
}

export interface BacktestStats {
  winRate: number;
  simulatedReturnPct: number;
  totalSignals: number;
  profitFactor: number;
}

export interface Prediction {
  symbol: string;
  trend: 'Bullish' | 'Bearish' | 'Neutral' | string;
  confidence: number;
  source: string;
  message: string;
  indicators: {
    rsi: number;
    macd: number;
    trend: string;
  };
  features: Record<string, number>;
  probabilities?: {
    bullish: number;
    neutral: number;
    bearish: number;
  };
  timeframeConsensus?: {
    shortTerm: 'Bullish' | 'Bearish' | 'Neutral';
    mediumTerm: 'Bullish' | 'Bearish' | 'Neutral';
    macroTrend: 'Bullish' | 'Bearish' | 'Neutral';
  };
  priceEnvelope?: PriceEnvelope;
  backtest?: BacktestStats;
}

export interface MarketIndexItem {
  name: string;
  symbol: string;
  value: number;
  change: number;
  pctChange: number;
  isIndex?: boolean;
}

export type AlertCondition =
  | 'ABOVE'
  | 'BELOW'
  | 'RSI_OVERSOLD'
  | 'RSI_OVERBOUGHT'
  | 'MACD_CROSSOVER'
  | 'PCT_CHANGE_UP'
  | 'PCT_CHANGE_DOWN';

export interface PriceAlert {
  id: string;
  symbol: string;
  condition: AlertCondition;
  targetValue: number;
  note?: string | null;
  createdAt: string;
  isActive: boolean;
  triggered?: boolean;
  triggeredAt?: string | null;
}

export interface TriggeredAlertItem {
  alertId: string;
  symbol: string;
  condition: AlertCondition;
  targetValue: number;
  currentValue: number;
  message: string;
  triggeredAt: string;
}

export interface PortfolioPosition {
  id: string;
  symbol: string;
  companyName?: string;
  sector?: string;
  buyPrice: number;
  quantity: number;
  buyDate: string;
  notes?: string | null;
  currentPrice: number;
  totalInvestment: number;
  currentValuation: number;
  unrealizedPnL: number;
  unrealizedPnLPct: number;
  dayGainLoss: number;
  pctChangeToday?: number;
  createdAt?: string;
}

export interface PortfolioSummary {
  positionCount: number;
  totalInvested: number;
  currentValuation: number;
  totalPnL: number;
  totalPnLPct: number;
  dayGainLoss: number;
  sectorAllocation: Array<{
    sector: string;
    value: number;
    percentage: number;
  }>;
}

export interface MarketMovers {
  gainers: Company[];
  losers: Company[];
  turnover: Company[];
  mostActive: Company[];
}

export interface MarketSummary {
  nepseIndex: number;
  nepseChange: number;
  nepsePctChange: number;
  totalTurnover: number;
  totalVolume: number;
  advancers: number;
  decliners: number;
  unchanged: number;
  totalListed: number;
  sectorPerformance: Array<{
    sector: string;
    avgChange: number;
    turnover: number;
    stockCount: number;
  }>;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  createdAt?: string;
  isGuest?: boolean;
}

