import { Module } from '@nestjs/common';
import { MarketDataService } from './market-data.service';
import { MarketDataCron } from './market-data.cron';

@Module({
  providers: [MarketDataService, MarketDataCron],
  exports: [MarketDataService, MarketDataCron],
})
export class MarketDataModule {}
