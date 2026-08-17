import { PriceBar } from '../types/stock';

/**
 * Calculates 20-period Bollinger Bands (Upper, Middle, Lower) with 2 standard deviations.
 */
export function calculateBollingerBands(history: PriceBar[], period: number = 20, multiplier: number = 2): PriceBar[] {
  if (history.length === 0) return [];

  return history.map((bar, idx) => {
    if (idx < period - 1) {
      return { ...bar };
    }

    const slice = history.slice(idx - period + 1, idx + 1);
    const sum = slice.reduce((acc, curr) => acc + curr.close, 0);
    const mean = sum / period;

    const variance = slice.reduce((acc, curr) => acc + Math.pow(curr.close - mean, 2), 0) / period;
    const stdDev = Math.sqrt(variance);

    return {
      ...bar,
      bbMiddle: Number(mean.toFixed(2)),
      bbUpper: Number((mean + multiplier * stdDev).toFixed(2)),
      bbLower: Number((mean - multiplier * stdDev).toFixed(2)),
    };
  });
}

/**
 * Computes key price statistics: 52-week High/Low, Day Range, Average Volume, Price Change.
 */
export function computePriceStats(history: PriceBar[]) {
  if (history.length === 0) {
    return {
      latest: null,
      previous: null,
      dayHigh: 0,
      dayLow: 0,
      dayOpen: 0,
      dayClose: 0,
      dayChange: 0,
      dayPctChange: 0,
      week52High: 0,
      week52Low: 0,
      avgVolume30: 0,
      totalVolume: 0,
      pricePosition52W: 50,
      pricePositionDay: 50,
    };
  }

  const latest = history[history.length - 1];
  const previous = history.length > 1 ? history[history.length - 2] : latest;
  const dayChange = latest.close - previous.close;
  const dayPctChange = previous.close > 0 ? (dayChange / previous.close) * 100 : 0;

  // 52-week (up to 250 trading days) High / Low
  const recentWindow = history.slice(-250);
  const week52High = Math.max(...recentWindow.map(h => h.high));
  const week52Low = Math.min(...recentWindow.map(h => h.low));

  // 30-day average volume
  const volSlice = history.slice(-30);
  const avgVolume30 = volSlice.reduce((acc, curr) => acc + curr.volume, 0) / volSlice.length;

  const priceRange52W = week52High - week52Low || 1;
  const pricePosition52W = Math.min(Math.max(((latest.close - week52Low) / priceRange52W) * 100, 0), 100);

  const dayRange = latest.high - latest.low || 1;
  const pricePositionDay = Math.min(Math.max(((latest.close - latest.low) / dayRange) * 100, 0), 100);

  return {
    latest,
    previous,
    dayHigh: latest.high,
    dayLow: latest.low,
    dayOpen: latest.open,
    dayClose: latest.close,
    dayChange,
    dayPctChange,
    week52High,
    week52Low,
    avgVolume30,
    totalVolume: latest.volume,
    pricePosition52W,
    pricePositionDay,
  };
}

export interface TechnicalVerdict {
  signal: 'STRONG BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG SELL';
  bullishCount: number;
  neutralCount: number;
  bearishCount: number;
  score: number; // 0 to 100
  items: Array<{
    name: string;
    value: string;
    action: 'BUY' | 'SELL' | 'NEUTRAL';
    description: string;
  }>;
}

/**
 * Analyzes multiple indicators to provide an aggregate quantitative scorecard.
 */
export function computeTechnicalVerdict(latestBar: PriceBar | null): TechnicalVerdict {
  if (!latestBar) {
    return {
      signal: 'NEUTRAL',
      bullishCount: 0,
      neutralCount: 0,
      bearishCount: 0,
      score: 50,
      items: [],
    };
  }

  const items: TechnicalVerdict['items'] = [];
  let bullish = 0;
  let bearish = 0;
  let neutral = 0;

  // 1. RSI (14)
  const rsi = latestBar.rsi14 ?? 50;
  if (rsi < 35) {
    items.push({ name: 'RSI (14)', value: rsi.toFixed(1), action: 'BUY', description: 'Oversold / Value rebound territory' });
    bullish++;
  } else if (rsi > 65) {
    items.push({ name: 'RSI (14)', value: rsi.toFixed(1), action: 'SELL', description: 'Overbought / Resistance risk' });
    bearish++;
  } else {
    items.push({ name: 'RSI (14)', value: rsi.toFixed(1), action: 'NEUTRAL', description: 'Consolidation phase' });
    neutral++;
  }

  // 2. MACD Histogram
  const macdHist = latestBar.macdHist ?? 0;
  if (macdHist > 0.5) {
    items.push({ name: 'MACD Hist', value: `+${macdHist.toFixed(2)}`, action: 'BUY', description: 'Positive momentum expansion' });
    bullish++;
  } else if (macdHist < -0.5) {
    items.push({ name: 'MACD Hist', value: macdHist.toFixed(2), action: 'SELL', description: 'Negative divergence acceleration' });
    bearish++;
  } else {
    items.push({ name: 'MACD Hist', value: macdHist.toFixed(2), action: 'NEUTRAL', description: 'Histogram near baseline' });
    neutral++;
  }

  // 3. EMA 12 vs EMA 26 Cross
  if (latestBar.ema12 && latestBar.ema26) {
    if (latestBar.ema12 > latestBar.ema26) {
      items.push({ name: 'EMA 12/26', value: 'Bullish Cross', action: 'BUY', description: 'Fast EMA tracking above Slow EMA' });
      bullish++;
    } else {
      items.push({ name: 'EMA 12/26', value: 'Bearish Cross', action: 'SELL', description: 'Fast EMA lagging below Slow EMA' });
      bearish++;
    }
  }

  // 4. Price vs EMA 50
  if (latestBar.ema50) {
    if (latestBar.close > latestBar.ema50) {
      items.push({ name: 'EMA 50 Trend', value: `Above (${latestBar.ema50.toFixed(0)})`, action: 'BUY', description: 'Holding above 50-day medium trendline' });
      bullish++;
    } else {
      items.push({ name: 'EMA 50 Trend', value: `Below (${latestBar.ema50.toFixed(0)})`, action: 'SELL', description: 'Trading below 50-day medium trendline' });
      bearish++;
    }
  }

  // 5. Volume Delta
  const volDelta = latestBar.volumeDelta;
  if (volDelta > 0 && latestBar.close >= latestBar.open) {
    items.push({ name: 'Volume Flow', value: `+${volDelta.toLocaleString()}`, action: 'BUY', description: 'Accumulation on rising volume' });
    bullish++;
  } else if (volDelta > 0 && latestBar.close < latestBar.open) {
    items.push({ name: 'Volume Flow', value: `+${volDelta.toLocaleString()}`, action: 'SELL', description: 'High-volume distribution/selling' });
    bearish++;
  } else {
    items.push({ name: 'Volume Flow', value: `${volDelta.toLocaleString()}`, action: 'NEUTRAL', description: 'Standard volume circulation' });
    neutral++;
  }

  const totalSignals = bullish + bearish + neutral || 1;
  const score = Math.round(((bullish * 100) + (neutral * 50)) / totalSignals);

  let signal: TechnicalVerdict['signal'] = 'NEUTRAL';
  if (score >= 75) signal = 'STRONG BUY';
  else if (score >= 60) signal = 'BUY';
  else if (score <= 25) signal = 'STRONG SELL';
  else if (score <= 40) signal = 'SELL';

  return {
    signal,
    bullishCount: bullish,
    neutralCount: neutral,
    bearishCount: bearish,
    score,
    items,
  };
}
