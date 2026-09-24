import { Controller, Get, Param } from '@nestjs/common';
import { StockService } from './stock.service';

@Controller('api/v1/stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  async getCompanies() {
    return this.stockService.getAllCompanies();
  }

  @Get('top/movers')
  async getTopMovers() {
    return this.stockService.getTopMovers();
  }

  @Get('market/summary')
  async getMarketSummary() {
    return this.stockService.getMarketSummary();
  }

  @Get(':symbol/stats')
  async getStats(@Param('symbol') symbol: string) {
    return this.stockService.getStockStats(symbol.toUpperCase());
  }

  @Get(':symbol/history')
  async getHistory(@Param('symbol') symbol: string) {
    return this.stockService.getPriceHistory(symbol.toUpperCase());
  }

  @Get(':symbol/enriched')
  async getEnriched(@Param('symbol') symbol: string) {
    return this.stockService.getEnrichedPriceHistory(symbol.toUpperCase());
  }
}
