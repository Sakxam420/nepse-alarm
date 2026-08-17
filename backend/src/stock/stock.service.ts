import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class StockService {
  constructor(private readonly db: DatabaseService) {}

  async getAllCompanies() {
    return this.db.company.findMany({
      orderBy: { symbol: 'asc' },
    });
  }

  async getCompanyDetails(symbol: string) {
    const comp = await this.db.company.findUnique({
      where: { symbol },
    });
    if (!comp) {
      throw new NotFoundException(`Company with symbol ${symbol} not found.`);
    }
    return comp;
  }

  async getPriceHistory(symbol: string) {
    await this.getCompanyDetails(symbol); // check existence
    return this.db.dailyPrice.findMany({
      where: { symbol },
      orderBy: { date: 'asc' },
    });
  }

  /**
   * Computes technical indicators for a given series of prices.
   * Returns array of prices enriched with RSI, MACD, EMA, SMA, and Volume Delta.
   */
  async getEnrichedPriceHistory(symbol: string) {
    const history = await this.getPriceHistory(symbol);
    if (history.length === 0) return [];

    const closes = history.map((h) => h.close);
    const volumes = history.map((h) => h.volume);

    // Compute indicators
    const ema12 = this.calculateEMA(closes, 12);
    const ema26 = this.calculateEMA(closes, 26);
    const ema50 = this.calculateEMA(closes, 50);
    const rsi14 = this.calculateRSI(closes, 14);
    
    // MACD calculations
    const macdLine: number[] = [];
    for (let i = 0; i < closes.length; i++) {
      if (ema12[i] !== null && ema26[i] !== null) {
        macdLine.push(ema12[i] - ema26[i]);
      } else {
        macdLine.push(null);
      }
    }
    const macdSignal = this.calculateEMAOfSeries(macdLine, 9);
    const macdHist: number[] = [];
    for (let i = 0; i < closes.length; i++) {
      if (macdLine[i] !== null && macdSignal[i] !== null) {
        macdHist.push(macdLine[i] - macdSignal[i]);
      } else {
        macdHist.push(null);
      }
    }

    return history.map((price, idx) => {
      const prevVolume = idx > 0 ? volumes[idx - 1] : price.volume;
      const volumeDelta = price.volume - prevVolume;

      return {
        ...price,
        ema12: ema12[idx] !== null ? Number(ema12[idx].toFixed(2)) : null,
        ema26: ema26[idx] !== null ? Number(ema26[idx].toFixed(2)) : null,
        ema50: ema50[idx] !== null ? Number(ema50[idx].toFixed(2)) : null,
        rsi14: rsi14[idx] !== null ? Number(rsi14[idx].toFixed(2)) : null,
        macdLine: macdLine[idx] !== null ? Number(macdLine[idx].toFixed(2)) : null,
        macdSignal: macdSignal[idx] !== null ? Number(macdSignal[idx].toFixed(2)) : null,
        macdHist: macdHist[idx] !== null ? Number(macdHist[idx].toFixed(2)) : null,
        volumeDelta: Number(volumeDelta.toFixed(0)),
      };
    });
  }

  // EMA Calculation helper
  private calculateEMA(data: number[], period: number): (number | null)[] {
    const ema: (number | null)[] = new Array(data.length).fill(null);
    if (data.length < period) return ema;

    // Simple SMA for first data point
    let sum = 0;
    for (let i = 0; i < period; i++) {
      sum += data[i];
    }
    let currentEma = sum / period;
    ema[period - 1] = currentEma;

    const multiplier = 2 / (period + 1);
    for (let i = period; i < data.length; i++) {
      currentEma = (data[i] - currentEma) * multiplier + currentEma;
      ema[i] = currentEma;
    }
    return ema;
  }

  // EMA of a series containing nulls (like MACD line)
  private calculateEMAOfSeries(data: (number | null)[], period: number): (number | null)[] {
    const ema: (number | null)[] = new Array(data.length).fill(null);
    
    // Find first non-null index
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

  // RSI 14 Calculation helper
  private calculateRSI(data: number[], period: number): (number | null)[] {
    const rsi: (number | null)[] = new Array(data.length).fill(null);
    if (data.length <= period) return rsi;

    let avgGain = 0;
    let avgLoss = 0;

    // First RSI calculation
    for (let i = 1; i <= period; i++) {
      const change = data[i] - data[i - 1];
      if (change > 0) {
        avgGain += change;
      } else {
        avgLoss += Math.abs(change);
      }
    }

    avgGain /= period;
    avgLoss /= period;

    let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsi[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + rs);

    // Wilders smoothing techniques
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
