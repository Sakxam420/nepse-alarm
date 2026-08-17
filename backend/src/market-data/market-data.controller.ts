import { Controller, Post, Get, HttpCode } from '@nestjs/common';
import { MarketDataService } from './market-data.service';

@Controller('api/v1/admin')
export class MarketDataController {
  constructor(private readonly marketDataService: MarketDataService) {}

  /**
   * POST /api/v1/admin/sync
   * Manually trigger an EOD data sync from NEPSE.
   * Useful for testing and to force a sync on Render after wakeup.
   */
  @Post('sync')
  @HttpCode(200)
  async triggerSync() {
    await this.marketDataService.updateDailyMarketData();
    return { success: true, message: 'EOD sync triggered.' };
  }

  /**
   * POST /api/v1/admin/bootstrap
   * Re-seed the company catalog from the NEPSE company list API.
   */
  @Post('bootstrap')
  @HttpCode(200)
  async triggerBootstrap() {
    const result = await this.marketDataService.bootstrapCompanyList();
    return { success: true, ...result };
  }

  /**
   * GET /api/v1/admin/health
   * Simple health check — returns 200 if backend is alive.
   * Used to wake up Render from idle state.
   */
  @Get('health')
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
