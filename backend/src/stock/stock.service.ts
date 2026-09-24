import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

export interface CompanyWithMarketData {
  symbol: string;
  name: string;
  sector: string;
  lastPrice: number;
  change: number;
  pctChange: number;
  volume: number;
}

@Injectable()
export class StockService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Retrieves all companies enriched with their latest market quote (lastPrice, change, pctChange, volume).
   */
  async getAllCompanies(): Promise<CompanyWithMarketData[]> {
    const companies = await this.db.company.findMany({
      orderBy: { symbol: 'asc' },
    });

    // Query recent price records (last 2 dates per symbol) in batch
    const recentPrices = await this.db.dailyPrice.findMany({
      orderBy: { date: 'desc' },
      take: companies.length * 3,
    });

    // Group price bars by symbol
    const pricesBySymbol = new Map<string, Array<{ close: number; volume: number; date: Date }>>();
    for (const p of recentPrices) {
      const list = pricesBySymbol.get(p.symbol) || [];
      if (list.length < 2) {
        list.push({ close: p.close, volume: p.volume, date: p.date });
        pricesBySymbol.set(p.symbol, list);
      }
    }

    return companies.map((c) => {
      const bars = pricesBySymbol.get(c.symbol);
      let lastPrice = 0;
      let change = 0;
      let pctChange = 0;
      let volume = 0;

      if (bars && bars.length > 0) {
        lastPrice = bars[0].close;
        volume = bars[0].volume;
        if (bars.length > 1 && bars[1].close > 0) {
          change = lastPrice - bars[1].close;
          pctChange = (change / bars[1].close) * 100;
        }
      }

      return {
        symbol: c.symbol,
        name: c.name,
        sector: c.sector,
        lastPrice: Number(lastPrice.toFixed(2)),
        change: Number(change.toFixed(2)),
        pctChange: Number(pctChange.toFixed(2)),
        volume,
      };
    });
  }

  async getCompanyDetails(symbol: string) {
    const comp = await this.db.company.findUnique({
      where: { symbol: symbol.toUpperCase() },
    });
    if (!comp) {
      throw new NotFoundException(`Company with symbol ${symbol} not found.`);
    }
    return comp;
  }

  async getPriceHistory(symbol: string) {
    await this.getCompanyDetails(symbol);
    return this.db.dailyPrice.findMany({
      where: { symbol: symbol.toUpperCase() },
      orderBy: { date: 'asc' },
    });
  }

  /**
   * Computes technical indicators: EMA 12/26/50, SMA 20, RSI 14, MACD, Bollinger Bands, Volume Delta.
   */
  async getEnrichedPriceHistory(symbol: string) {
    const history = await this.getPriceHistory(symbol);
    if (history.length === 0) return [];

    const closes = history.map((h) => h.close);
    const volumes = history.map((h) => h.volume);

    // Compute Moving Averages
    const ema12 = this.calculateEMA(closes, 12);
    const ema26 = this.calculateEMA(closes, 26);
    const ema50 = this.calculateEMA(closes, 50);
    const sma20 = this.calculateSMA(closes, 20);
    const rsi14 = this.calculateRSI(closes, 14);

    // MACD calculations
    const macdLine: (number | null)[] = [];
    for (let i = 0; i < closes.length; i++) {
      if (ema12[i] !== null && ema26[i] !== null) {
        macdLine.push((ema12[i] as number) - (ema26[i] as number));
      } else {
        macdLine.push(null);
      }
    }
    const macdSignal = this.calculateEMAOfSeries(macdLine, 9);
    const macdHist: (number | null)[] = [];
    for (let i = 0; i < closes.length; i++) {
      if (macdLine[i] !== null && macdSignal[i] !== null) {
        macdHist.push((macdLine[i] as number) - (macdSignal[i] as number));
      } else {
        macdHist.push(null);
      }
    }

    // Bollinger Bands (20 periods, 2 std deviations)
    const bbUpper: (number | null)[] = [];
    const bbMiddle: (number | null)[] = [];
    const bbLower: (number | null)[] = [];

    for (let i = 0; i < closes.length; i++) {
      if (i < 19) {
        bbUpper.push(null);
        bbMiddle.push(null);
        bbLower.push(null);
      } else {
        const slice = closes.slice(i - 19, i + 1);
        const mean = slice.reduce((a, b) => a + b, 0) / 20;
        const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / 20;
        const stdDev = Math.sqrt(variance);

        bbMiddle.push(Number(mean.toFixed(2)));
        bbUpper.push(Number((mean + stdDev * 2).toFixed(2)));
        bbLower.push(Number((mean - stdDev * 2).toFixed(2)));
      }
    }

    return history.map((price, idx) => {
      const prevVolume = idx > 0 ? volumes[idx - 1] : price.volume;
      const volumeDelta = price.volume - prevVolume;

      return {
        ...price,
        ema12: ema12[idx] !== null ? Number((ema12[idx] as number).toFixed(2)) : null,
        ema26: ema26[idx] !== null ? Number((ema26[idx] as number).toFixed(2)) : null,
        ema50: ema50[idx] !== null ? Number((ema50[idx] as number).toFixed(2)) : null,
        sma20: sma20[idx] !== null ? Number((sma20[idx] as number).toFixed(2)) : null,
        rsi14: rsi14[idx] !== null ? Number((rsi14[idx] as number).toFixed(2)) : null,
        macdLine: macdLine[idx] !== null ? Number((macdLine[idx] as number).toFixed(2)) : null,
        macdSignal: macdSignal[idx] !== null ? Number((macdSignal[idx] as number).toFixed(2)) : null,
        macdHist: macdHist[idx] !== null ? Number((macdHist[idx] as number).toFixed(2)) : null,
        bbUpper: bbUpper[idx],
        bbMiddle: bbMiddle[idx],
        bbLower: bbLower[idx],
        volumeDelta: Number(volumeDelta.toFixed(0)),
      };
    });
  }

  /**
   * Returns top gainers, top losers, top turnover, and top volume.
   */
  async getTopMovers() {
    const all = await this.getAllCompanies();
    const active = all.filter((c) => c.lastPrice > 0 && c.volume > 0);

    const gainers = [...active].sort((a, b) => b.pctChange - a.pctChange).slice(0, 6);
    const losers = [...active].sort((a, b) => a.pctChange - b.pctChange).slice(0, 6);
    const turnover = [...active]
      .sort((a, b) => b.lastPrice * b.volume - a.lastPrice * a.volume)
      .slice(0, 6);
    const mostActive = [...active].sort((a, b) => b.volume - a.volume).slice(0, 6);

    return { gainers, losers, turnover, mostActive };
  }

  /**
   * Returns high-level market statistics and sector performance.
   */
  async getMarketSummary() {
    const all = await this.getAllCompanies();
    const active = all.filter((c) => c.lastPrice > 0);

    let advancers = 0;
    let decliners = 0;
    let unchanged = 0;
    let totalTurnover = 0;
    let totalVolume = 0;

    const sectorAgg = new Map<string, { totalPct: number; count: number; turnover: number }>();

    for (const c of active) {
      if (c.pctChange > 0.05) advancers++;
      else if (c.pctChange < -0.05) decliners++;
      else unchanged++;

      const turnover = c.lastPrice * c.volume;
      totalTurnover += turnover;
      totalVolume += c.volume;

      const current = sectorAgg.get(c.sector) || { totalPct: 0, count: 0, turnover: 0 };
      current.totalPct += c.pctChange;
      current.count += 1;
      current.turnover += turnover;
      sectorAgg.set(c.sector, current);
    }

    const sectorPerformance = Array.from(sectorAgg.entries())
      .map(([sector, data]) => ({
        sector,
        avgChange: data.count > 0 ? Number((data.totalPct / data.count).toFixed(2)) : 0,
        turnover: Number(data.turnover.toFixed(0)),
        stockCount: data.count,
      }))
      .sort((a, b) => b.avgChange - a.avgChange);

    // Compute approximate NEPSE index from weighted movements
    const indexBase = 2650;
    const avgMarketChange =
      active.length > 0
        ? active.reduce((acc, c) => acc + c.pctChange, 0) / active.length
        : 0;
    const nepseIndex = Number((indexBase * (1 + avgMarketChange / 100)).toFixed(2));
    const nepseChange = Number((nepseIndex - indexBase).toFixed(2));

    return {
      nepseIndex,
      nepseChange,
      nepsePctChange: Number(avgMarketChange.toFixed(2)),
      totalTurnover: Number(totalTurnover.toFixed(0)),
      totalVolume,
      advancers,
      decliners,
      unchanged,
      totalListed: all.length,
      sectorPerformance,
    };
  }

  /**
   * Computes risk metrics, 52-week stats, and returns for a specific stock.
   */
  async getStockStats(symbol: string) {
    const history = await this.getPriceHistory(symbol);
    if (history.length === 0) {
      throw new NotFoundException(`No price history available for ${symbol}.`);
    }

    const closes = history.map((h) => h.close);
    const highs = history.map((h) => h.high);
    const lows = history.map((h) => h.low);
    const volumes = history.map((h) => h.volume);

    const high52 = Math.max(...highs);
    const low52 = Math.min(...lows);
    const latestClose = closes[closes.length - 1];
    const firstClose = closes[0];

    const returnPct = firstClose > 0 ? ((latestClose - firstClose) / firstClose) * 100 : 0;
    const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;

    // Daily returns volatility calculation
    const dailyReturns: number[] = [];
    for (let i = 1; i < closes.length; i++) {
      if (closes[i - 1] > 0) {
        dailyReturns.push((closes[i] - closes[i - 1]) / closes[i - 1]);
      }
    }
    const meanReturn = dailyReturns.length > 0 ? dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length : 0;
    const variance =
      dailyReturns.length > 0
        ? dailyReturns.reduce((a, b) => a + Math.pow(b - meanReturn, 2), 0) / dailyReturns.length
        : 0;
    const dailyVol = Math.sqrt(variance);
    const annualizedVol = dailyVol * Math.sqrt(240) * 100; // 240 trading days/year

    return {
      symbol: symbol.toUpperCase(),
      latestClose: Number(latestClose.toFixed(2)),
      high52: Number(high52.toFixed(2)),
      low52: Number(low52.toFixed(2)),
      returnPct: Number(returnPct.toFixed(2)),
      annualizedVolatility: Number(annualizedVol.toFixed(2)),
      avgVolume: Number(avgVolume.toFixed(0)),
      tradingDaysRecorded: history.length,
    };
  }

  // Helper math methods
  private calculateSMA(data: number[], period: number): (number | null)[] {
    const sma: (number | null)[] = new Array(data.length).fill(null);
    if (data.length < period) return sma;

    let sum = 0;
    for (let i = 0; i < period; i++) sum += data[i];
    sma[period - 1] = sum / period;

    for (let i = period; i < data.length; i++) {
      sum += data[i] - data[i - period];
      sma[i] = sum / period;
    }
    return sma;
  }

  private calculateEMA(data: number[], period: number): (number | null)[] {
    const ema: (number | null)[] = new Array(data.length).fill(null);
    if (data.length < period) return ema;

    let sum = 0;
    for (let i = 0; i < period; i++) sum += data[i];
    let currentEma = sum / period;
    ema[period - 1] = currentEma;

    const multiplier = 2 / (period + 1);
    for (let i = period; i < data.length; i++) {
      currentEma = (data[i] - currentEma) * multiplier + currentEma;
      ema[i] = currentEma;
    }
    return ema;
  }

  private calculateEMAOfSeries(data: (number | null)[], period: number): (number | null)[] {
    const ema: (number | null)[] = new Array(data.length).fill(null);
    const firstValidIdx = data.findIndex((val) => val !== null);
    if (firstValidIdx === -1 || data.length - firstValidIdx < period) return ema;

    let sum = 0;
    for (let i = firstValidIdx; i < firstValidIdx + period; i++) {
      sum += data[i] as number;
    }
    let currentEma = sum / period;
    ema[firstValidIdx + period - 1] = currentEma;

    const multiplier = 2 / (period + 1);
    for (let i = firstValidIdx + period; i < data.length; i++) {
      const val = data[i];
      if (val === null) {
        ema[i] = null;
      } else {
        currentEma = (val - currentEma) * multiplier + currentEma;
        ema[i] = currentEma;
      }
    }
    return ema;
  }

  private calculateRSI(data: number[], period: number): (number | null)[] {
    const rsi: (number | null)[] = new Array(data.length).fill(null);
    if (data.length <= period) return rsi;

    let avgGain = 0;
    let avgLoss = 0;

    for (let i = 1; i <= period; i++) {
      const change = data[i] - data[i - 1];
      if (change > 0) avgGain += change;
      else avgLoss += Math.abs(change);
    }

    avgGain /= period;
    avgLoss /= period;

    let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsi[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + rs);

    for (let i = period + 1; i < data.length; i++) {
      const change = data[i] - data[i - 1];
      const gain = change > 0 ? change : 0;
      const loss = change < 0 ? Math.abs(change) : 0;

      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;

      rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      rsi[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + rs);
    }

    return rsi;
  }
}
