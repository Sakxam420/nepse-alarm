export type SectorType = 'All' | 'Banking' | 'Hydropower' | 'Finance' | 'Microfinance' | 'Insurance' | 'Manufacturing' | 'Hotels' | 'Others';

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
  rsi14?: number | null;
  macdLine?: number | null;
  macdSignal?: number | null;
  macdHist?: number | null;
  volumeDelta: number;
  // Computed client-side fields
  bbUpper?: number;
  bbMiddle?: number;
  bbLower?: number;
  dateFormatted?: string;
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
}

export interface MarketIndexItem {
  name: string;
  symbol: string;
  value: number;
  change: number;
  pctChange: number;
  isIndex?: boolean;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  condition: 'ABOVE' | 'BELOW' | 'RSI_OVERSOLD' | 'RSI_OVERBOUGHT' | 'MACD_CROSSOVER';
  targetValue: number;
  createdAt: string;
  isActive: boolean;
}
