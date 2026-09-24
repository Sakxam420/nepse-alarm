import { MarketIndexItem, PriceBar } from '../types/stock';

export const NEPSE_INDICES: MarketIndexItem[] = [
  { name: 'NEPSE Index', symbol: 'NEPSE', value: 2748.24, change: 18.52, pctChange: 0.68, isIndex: true },
  { name: 'Sensitive Index', symbol: 'SENSITIVE', value: 488.92, change: 3.15, pctChange: 0.65, isIndex: true },
  { name: 'Banking Sub-Index', symbol: 'BANKING', value: 1418.40, change: 11.20, pctChange: 0.85, isIndex: true },
  { name: 'Hydropower Sub-Index', symbol: 'HYDRO', value: 3140.85, change: 65.40, pctChange: 2.14, isIndex: true },
  { name: 'Finance Sub-Index', symbol: 'FINANCE', value: 2445.10, change: 34.20, pctChange: 1.42, isIndex: true },
  { name: 'Life Insurance', symbol: 'LIFE_INS', value: 11220.30, change: 50.10, pctChange: 0.45, isIndex: true },
];

export const SECTOR_OVERVIEW = [
  { name: 'Hydropower', stocksCount: 89, avgRSI: 58.4, avgChange: 2.14, trend: 'Bullish' },
  { name: 'Banking', stocksCount: 20, avgRSI: 51.2, avgChange: 0.85, trend: 'Bullish' },
  { name: 'Finance', stocksCount: 15, avgRSI: 61.0, avgChange: 1.42, trend: 'Bullish' },
  { name: 'Microfinance', stocksCount: 54, avgRSI: 52.8, avgChange: 0.46, trend: 'Neutral' },
  { name: 'Life Insurance', stocksCount: 12, avgRSI: 49.5, avgChange: 0.45, trend: 'Neutral' },
  { name: 'Non-Life Insurance', stocksCount: 14, avgRSI: 48.0, avgChange: -0.22, trend: 'Neutral' },
  { name: 'Hotels', stocksCount: 6, avgRSI: 62.4, avgChange: 1.88, trend: 'Bullish' },
  { name: 'Manufacturing', stocksCount: 8, avgRSI: 44.5, avgChange: -0.65, trend: 'Bearish' },
];

/**
 * Returns current NEPSE market operating status.
 * Trading hours: Sun-Thu, 11:00 AM - 3:00 PM NPT (UTC+5:45).
 */
export function getMarketStatus(): {
  isOpen: boolean;
  statusText: string;
  nextSessionTime: string;
} {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const nptDate = new Date(utc + 3600000 * 5.75);

  const day = nptDate.getDay();
  const hours = nptDate.getHours();
  const minutes = nptDate.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  const isTradingDay = day >= 0 && day <= 4;
  const isTradingHours = timeInMinutes >= 660 && timeInMinutes <= 900;
  const isPreOpen = isTradingDay && timeInMinutes >= 630 && timeInMinutes < 660;

  if (isTradingDay && isTradingHours) {
    return {
      isOpen: true,
      statusText: 'MARKET OPEN',
      nextSessionTime: 'Closes at 3:00 PM NPT',
    };
  }

  if (isPreOpen) {
    return {
      isOpen: false,
      statusText: 'PRE-OPEN SESSION',
      nextSessionTime: 'Continuous trading at 11:00 AM',
    };
  }

  return {
    isOpen: false,
    statusText: 'MARKET CLOSED',
    nextSessionTime: 'Next session at 11:00 AM NPT',
  };
}

/**
 * Generates mathematically consistent synthetic price history for smooth offline fallback.
 */
export function generateMockHistory(symbol: string): PriceBar[] {
  let basePrice = 450;
  if (symbol.includes('NABIL')) basePrice = 538;
  else if (symbol.includes('GBIME')) basePrice = 276;
  else if (symbol.includes('NICA')) basePrice = 472;
  else if (symbol.includes('AHPC')) basePrice = 388;
  else if (symbol.includes('AKPL')) basePrice = 312;
  else if (symbol.includes('HDL')) basePrice = 1360;

  const today = new Date();
  const bars: PriceBar[] = [];
  let price = basePrice * 0.88;

  for (let i = 60; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (d.getDay() === 6) continue; // Skip Saturday

    const changePct = (Math.sin(i * 0.3) * 0.015) + (Math.random() - 0.47) * 0.02;
    price = Math.max(price * (1 + changePct), 40);

    const open = Number((price * (1 + (Math.random() - 0.5) * 0.006)).toFixed(2));
    const close = Number(price.toFixed(2));
    const high = Number((Math.max(open, close) * (1 + Math.random() * 0.012)).toFixed(2));
    const low = Number((Math.min(open, close) * (1 - Math.random() * 0.012)).toFixed(2));
    const volume = Math.floor(Math.random() * 120000 + 25000);

    bars.push({
      id: 60 - i + 1,
      symbol: symbol.toUpperCase(),
      date: d.toISOString().split('T')[0],
      open,
      high,
      low,
      close,
      volume,
      volumeDelta: 0,
    });
  }

  // Calculate simple EMA, RSI, MACD on generated bars
  const closes = bars.map(b => b.close);
  for (let idx = 0; idx < bars.length; idx++) {
    const prevVol = idx > 0 ? bars[idx - 1].volume : bars[idx].volume;
    bars[idx].volumeDelta = bars[idx].volume - prevVol;

    // Approximated indicators
    if (idx >= 12) {
      const slice12 = closes.slice(idx - 11, idx + 1);
      bars[idx].ema12 = Number((slice12.reduce((a, b) => a + b, 0) / 12).toFixed(2));
    }
    if (idx >= 26) {
      const slice26 = closes.slice(idx - 25, idx + 1);
      bars[idx].ema26 = Number((slice26.reduce((a, b) => a + b, 0) / 26).toFixed(2));
    }
    if (idx >= 50) {
      const slice50 = closes.slice(idx - 49, idx + 1);
      bars[idx].ema50 = Number((slice50.reduce((a, b) => a + b, 0) / 50).toFixed(2));
    }
    if (bars[idx].ema12 && bars[idx].ema26) {
      bars[idx].macdLine = Number(((bars[idx].ema12 as number) - (bars[idx].ema26 as number)).toFixed(2));
      bars[idx].macdSignal = Number(((bars[idx].macdLine as number) * 0.8).toFixed(2));
      bars[idx].macdHist = Number(((bars[idx].macdLine as number) - (bars[idx].macdSignal as number)).toFixed(2));
    }
    bars[idx].rsi14 = Number((50 + Math.sin(idx * 0.4) * 16).toFixed(1));
  }

  return bars;
}
