import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MarketDataService } from './market-data.service';

@Injectable()
export class MarketDataCron {
  private readonly logger = new Logger(MarketDataCron.name);

  constructor(private readonly marketDataService: MarketDataService) {}

  /**
   * Run daily EOD sync at 4:05 PM Nepal time (10:20 UTC), Sun–Thu.
   * NEPSE trading ends at 3:00 PM, 4:05 PM ensures EOD data is finalized.
   */
  @Cron('5 20 10 * * 0-4', { timeZone: 'UTC' })
  async handlePostMarketSync() {
    this.logger.log('Cron: daily NEPSE EOD sync triggered.');
    await this.marketDataService.updateDailyMarketData();
  }

  /**
   * Re-bootstrap company list weekly (every Sunday at 2 AM Nepal time).
   * Catches any new listings or delistings on NEPSE.
   */
  @Cron('0 15 20 * * 0', { timeZone: 'UTC' })
  async handleWeeklyCompanyRefresh() {
    this.logger.log('Cron: weekly company list refresh triggered.');
    await this.marketDataService.bootstrapCompanyList();
  }
}
