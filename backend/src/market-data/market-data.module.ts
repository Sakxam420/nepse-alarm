import { Module } from '@nestjs/common';
import { MarketDataService } from './market-data.service';
import { MarketDataCron } from './market-data.cron';
import { MarketDataController } from './market-data.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [MarketDataService, MarketDataCron],
  controllers: [MarketDataController],
  exports: [MarketDataService, MarketDataCron],
})
export class MarketDataModule {}
