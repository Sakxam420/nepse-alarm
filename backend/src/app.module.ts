import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './database/database.module';
import { MarketDataModule } from './market-data/market-data.module';
import { StockModule } from './stock/stock.module';
import { PredictionModule } from './prediction/prediction.module';
import { AlertsModule } from './alerts/alerts.module';
import { PortfolioModule } from './portfolio/portfolio.module';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DatabaseModule,
    MarketDataModule,
    StockModule,
    PredictionModule,
    AlertsModule,
    PortfolioModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
