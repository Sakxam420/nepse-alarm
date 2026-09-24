import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { StockService } from '../stock/stock.service';

export interface CreatePositionDto {
  symbol: string;
  buyPrice: number;
  quantity: number;
  buyDate?: string;
  notes?: string;
}

@Injectable()
export class PortfolioService {
  constructor(
    private readonly db: DatabaseService,
    private readonly stockService: StockService,
  ) {}

  async getAllPositions() {
    const positions = await this.db.portfolioPosition.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const enrichedPositions = await Promise.all(
      positions.map(async (pos) => {
        let currentPrice = pos.buyPrice;
        let changeToday = 0;
        let pctChangeToday = 0;
        let companyName = pos.symbol;
        let sector = 'Other';

        try {
          const comp = await this.db.company.findUnique({ where: { symbol: pos.symbol } });
          if (comp) {
            companyName = comp.name;
            sector = comp.sector;
          }

          const latestBar = await this.db.dailyPrice.findFirst({
            where: { symbol: pos.symbol },
            orderBy: { date: 'desc' },
          });

          if (latestBar) {
            currentPrice = latestBar.close;
            // Get previous bar for day's change
            const prevBar = await this.db.dailyPrice.findFirst({
              where: { symbol: pos.symbol, date: { lt: latestBar.date } },
              orderBy: { date: 'desc' },
            });
            if (prevBar && prevBar.close > 0) {
              changeToday = currentPrice - prevBar.close;
              pctChangeToday = (changeToday / prevBar.close) * 100;
            }
          }
        } catch {
          // fallback to buyPrice
        }

        const totalInvestment = pos.buyPrice * pos.quantity;
        const currentValuation = currentPrice * pos.quantity;
        const unrealizedPnL = currentValuation - totalInvestment;
        const unrealizedPnLPct = totalInvestment > 0 ? (unrealizedPnL / totalInvestment) * 100 : 0;
        const dayGainLoss = changeToday * pos.quantity;

        return {
          id: pos.id,
          symbol: pos.symbol,
          companyName,
          sector,
          buyPrice: pos.buyPrice,
          quantity: pos.quantity,
          buyDate: pos.buyDate,
          notes: pos.notes,
          currentPrice: Number(currentPrice.toFixed(2)),
          totalInvestment: Number(totalInvestment.toFixed(2)),
          currentValuation: Number(currentValuation.toFixed(2)),
          unrealizedPnL: Number(unrealizedPnL.toFixed(2)),
          unrealizedPnLPct: Number(unrealizedPnLPct.toFixed(2)),
          dayGainLoss: Number(dayGainLoss.toFixed(2)),
          pctChangeToday: Number(pctChangeToday.toFixed(2)),
          createdAt: pos.createdAt,
        };
      }),
    );

    return enrichedPositions;
  }

  async createPosition(dto: CreatePositionDto) {
    const symbol = dto.symbol.trim().toUpperCase();
    return this.db.portfolioPosition.create({
      data: {
        symbol,
        buyPrice: Number(dto.buyPrice),
        quantity: Number(dto.quantity),
        buyDate: dto.buyDate ? new Date(dto.buyDate) : new Date(),
        notes: dto.notes?.trim() || null,
      },
    });
  }

  async deletePosition(id: string) {
    const pos = await this.db.portfolioPosition.findUnique({ where: { id } });
    if (!pos) {
      throw new NotFoundException(`Portfolio position with ID ${id} not found.`);
    }
    return this.db.portfolioPosition.delete({ where: { id } });
  }

  async getPortfolioSummary() {
    const positions = await this.getAllPositions();

    const totalInvested = positions.reduce((acc, p) => acc + p.totalInvestment, 0);
    const currentValuation = positions.reduce((acc, p) => acc + p.currentValuation, 0);
    const totalPnL = currentValuation - totalInvested;
    const totalPnLPct = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;
    const dayGainLoss = positions.reduce((acc, p) => acc + p.dayGainLoss, 0);

    // Sector allocation breakdown
    const sectorMap = new Map<string, number>();
    for (const pos of positions) {
      const existing = sectorMap.get(pos.sector) || 0;
      sectorMap.set(pos.sector, existing + pos.currentValuation);
    }

    const sectorAllocation = Array.from(sectorMap.entries()).map(([sector, value]) => ({
      sector,
      value: Number(value.toFixed(2)),
      percentage: currentValuation > 0 ? Number(((value / currentValuation) * 100).toFixed(1)) : 0,
    })).sort((a, b) => b.value - a.value);

    return {
      positionCount: positions.length,
      totalInvested: Number(totalInvested.toFixed(2)),
      currentValuation: Number(currentValuation.toFixed(2)),
      totalPnL: Number(totalPnL.toFixed(2)),
      totalPnLPct: Number(totalPnLPct.toFixed(2)),
      dayGainLoss: Number(dayGainLoss.toFixed(2)),
      sectorAllocation,
    };
  }
}
