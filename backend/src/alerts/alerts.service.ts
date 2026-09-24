import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { StockService } from '../stock/stock.service';

export interface CreateAlertDto {
  symbol: string;
  condition: 'ABOVE' | 'BELOW' | 'RSI_OVERSOLD' | 'RSI_OVERBOUGHT' | 'MACD_CROSSOVER' | 'PCT_CHANGE_UP' | 'PCT_CHANGE_DOWN';
  targetValue: number;
  note?: string;
}

export interface TriggeredAlertResult {
  alertId: string;
  symbol: string;
  condition: string;
  targetValue: number;
  currentValue: number;
  message: string;
  triggeredAt: Date;
}

@Injectable()
export class AlertsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly stockService: StockService,
  ) {}

  async getAllAlerts() {
    return this.db.alert.findMany({
      orderBy: [{ isActive: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async createAlert(dto: CreateAlertDto) {
    const symbol = dto.symbol.trim().toUpperCase();
    return this.db.alert.create({
      data: {
        symbol,
        condition: dto.condition,
        targetValue: dto.targetValue,
        note: dto.note?.trim() || null,
        isActive: true,
        triggered: false,
      },
    });
  }

  async deleteAlert(id: string) {
    const alert = await this.db.alert.findUnique({ where: { id } });
    if (!alert) {
      throw new NotFoundException(`Alert with ID ${id} not found.`);
    }
    return this.db.alert.delete({ where: { id } });
  }

  async toggleAlert(id: string) {
    const alert = await this.db.alert.findUnique({ where: { id } });
    if (!alert) {
      throw new NotFoundException(`Alert with ID ${id} not found.`);
    }
    return this.db.alert.update({
      where: { id },
      data: {
        isActive: !alert.isActive,
        triggered: alert.isActive ? alert.triggered : false, // Reset triggered flag if reactivating
      },
    });
  }

  /**
   * Evaluate all active alerts against current market data.
   * Marks matched alerts as triggered and returns the triggered items.
   */
  async evaluateActiveAlerts(): Promise<TriggeredAlertResult[]> {
    const activeAlerts = await this.db.alert.findMany({
      where: { isActive: true, triggered: false },
    });

    if (activeAlerts.length === 0) return [];

    const triggeredAlerts: TriggeredAlertResult[] = [];

    // Group alerts by symbol to minimize database queries
    const symbolMap = new Map<string, typeof activeAlerts>();
    for (const alert of activeAlerts) {
      const list = symbolMap.get(alert.symbol) || [];
      list.push(alert);
      symbolMap.set(alert.symbol, list);
    }

    for (const [symbol, alerts] of symbolMap.entries()) {
      try {
        const enrichedHistory = await this.stockService.getEnrichedPriceHistory(symbol);
        if (enrichedHistory.length === 0) continue;

        const latest = enrichedHistory[enrichedHistory.length - 1];
        const previous = enrichedHistory.length > 1 ? enrichedHistory[enrichedHistory.length - 2] : latest;

        const currentPrice = latest.close;
        const pctChangeToday = previous.close > 0 ? ((currentPrice - previous.close) / previous.close) * 100 : 0;
        const rsi = latest.rsi14 ?? 50;
        const macdHist = latest.macdHist ?? 0;
        const prevMacdHist = previous.macdHist ?? 0;

        for (const alert of alerts) {
          let isTriggered = false;
          let currentValue = currentPrice;
          let msg = '';

          switch (alert.condition) {
            case 'ABOVE':
              if (currentPrice >= alert.targetValue) {
                isTriggered = true;
                currentValue = currentPrice;
                msg = `${symbol} crossed ABOVE target Rs. ${alert.targetValue} (Current: Rs. ${currentPrice.toFixed(2)})`;
              }
              break;

            case 'BELOW':
              if (currentPrice <= alert.targetValue) {
                isTriggered = true;
                currentValue = currentPrice;
                msg = `${symbol} dropped BELOW target Rs. ${alert.targetValue} (Current: Rs. ${currentPrice.toFixed(2)})`;
              }
              break;

            case 'RSI_OVERSOLD':
              if (rsi <= alert.targetValue) {
                isTriggered = true;
                currentValue = rsi;
                msg = `${symbol} RSI Oversold at ${rsi.toFixed(1)} (Threshold: ${alert.targetValue})`;
              }
              break;

            case 'RSI_OVERBOUGHT':
              if (rsi >= alert.targetValue) {
                isTriggered = true;
                currentValue = rsi;
                msg = `${symbol} RSI Overbought at ${rsi.toFixed(1)} (Threshold: ${alert.targetValue})`;
              }
              break;

            case 'MACD_CROSSOVER':
              // Bullish cross: prev <= 0 and current > 0
              if (prevMacdHist <= 0 && macdHist > 0) {
                isTriggered = true;
                currentValue = macdHist;
                msg = `${symbol} formed Bullish MACD Golden Crossover`;
              }
              break;

            case 'PCT_CHANGE_UP':
              if (pctChangeToday >= alert.targetValue) {
                isTriggered = true;
                currentValue = pctChangeToday;
                msg = `${symbol} surged +${pctChangeToday.toFixed(2)}% today (Target: +${alert.targetValue}%)`;
              }
              break;

            case 'PCT_CHANGE_DOWN':
              if (pctChangeToday <= -alert.targetValue) {
                isTriggered = true;
                currentValue = pctChangeToday;
                msg = `${symbol} dropped ${pctChangeToday.toFixed(2)}% today (Target: -${alert.targetValue}%)`;
              }
              break;
          }

          if (isTriggered) {
            const now = new Date();
            await this.db.alert.update({
              where: { id: alert.id },
              data: {
                triggered: true,
                triggeredAt: now,
                isActive: false, // Turn off active status once triggered
              },
            });

            triggeredAlerts.push({
              alertId: alert.id,
              symbol,
              condition: alert.condition,
              targetValue: alert.targetValue,
              currentValue: Number(currentValue.toFixed(2)),
              message: msg,
              triggeredAt: now,
            });
          }
        }
      } catch (e) {
        // Continue evaluating other symbols if one encounters an error
      }
    }

    return triggeredAlerts;
  }
}
