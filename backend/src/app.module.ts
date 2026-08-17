import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './database/database.module';
import { MarketDataModule } from './market-data/market-data.module';
import { StockModule } from './stock/stock.module';
import { PredictionModule } from './prediction/prediction.module';
import { DatabaseService } from './database/database.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DatabaseModule,
    MarketDataModule,
    StockModule,
    PredictionModule,
  ],
})
export class AppModule {}
