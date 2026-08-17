import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MarketDataService } from './market-data.service';

@Injectable()
export class MarketDataCron {
  private readonly logger = new Logger(MarketDataCron.name);

  constructor(private readonly marketDataService: MarketDataService) {}

  /**
   * Run daily post-market synchronization at 4 PM (16:00) Sunday-Thursday.
   * NEPSE trading ends at 3 PM, so 4 PM ensures the final daily EOD sheet is compiled.
   */
  @Cron('0 0 16 * * 0-4')
  async handlePostMarketSync() {
    this.logger.log('Cron Job Triggered: Syncing daily market prices...');
    await this.marketDataService.updateDailyMarketData();
  }

  /**
   * Run a secondary fallback trigger at start-up to make sure we have data for the current day.
   */
  async triggerImmediateSync() {
    this.logger.log('Starting bootstrap EOD sync check...');
    await this.marketDataService.updateDailyMarketData();
  }
}
