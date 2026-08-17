import { MarketIndexItem } from '../types/stock';

export const NEPSE_INDICES: MarketIndexItem[] = [
  { name: 'NEPSE Index', symbol: 'NEPSE', value: 2112.45, change: 14.28, pctChange: 0.68, isIndex: true },
  { name: 'Sensitive Index', symbol: 'SENSITIVE', value: 378.92, change: 2.15, pctChange: 0.57, isIndex: true },
  { name: 'Banking Sub-Index', symbol: 'BANKING', value: 1218.40, change: -4.30, pctChange: -0.35, isIndex: true },
  { name: 'Hydropower Sub-Index', symbol: 'HYDRO', value: 2640.85, change: 38.60, pctChange: 1.48, isIndex: true },
  { name: 'Finance Sub-Index', symbol: 'FINANCE', value: 1945.10, change: 22.40, pctChange: 1.16, isIndex: true },
  { name: 'Microfinance Sub-Index', symbol: 'MICRO', value: 4120.30, change: 18.90, pctChange: 0.46, isIndex: true },
];

export const SECTOR_OVERVIEW = [
  { name: 'Hydropower', stocksCount: 89, avgRSI: 58.4, avgChange: 1.48, trend: 'Bullish' },
  { name: 'Banking', stocksCount: 20, avgRSI: 46.2, avgChange: -0.35, trend: 'Neutral' },
  { name: 'Finance', stocksCount: 15, avgRSI: 61.0, avgChange: 1.16, trend: 'Bullish' },
  { name: 'Microfinance', stocksCount: 54, avgRSI: 52.8, avgChange: 0.46, trend: 'Neutral' },
  { name: 'Life Insurance', stocksCount: 12, avgRSI: 49.5, avgChange: 0.12, trend: 'Neutral' },
  { name: 'Non-Life Insurance', stocksCount: 14, avgRSI: 48.0, avgChange: -0.22, trend: 'Neutral' },
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
  // Convert current time to Nepal Time (UTC+5:45)
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const nptDate = new Date(utc + (3600000 * 5.75));

  const day = nptDate.getDay(); // 0 = Sunday, 1 = Monday, ... 5 = Friday, 6 = Saturday
  const hours = nptDate.getHours();
  const minutes = nptDate.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  // NEPSE trading days: Sunday (0) to Thursday (4)
  const isTradingDay = day >= 0 && day <= 4;
  // Trading hours: 11:00 AM (660 mins) to 3:00 PM (900 mins)
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
