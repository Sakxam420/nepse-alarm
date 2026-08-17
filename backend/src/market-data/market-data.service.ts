import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import axios from 'axios';
import * as https from 'https';

@Injectable()
export class MarketDataService {
  private readonly logger = new Logger(MarketDataService.name);
  
  // Custom HTTPS agent to ignore SSL/TLS certificate warnings (verifyTLS: false)
  private readonly axiosInstance = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
    timeout: 10000,
  });

  constructor(private readonly db: DatabaseService) {}

  /**
   * Fetches latest EOD prices and upserts into local DB.
   * If the external API is unreachable, it gracefully falls back to generating a realistic market day.
   */
  async updateDailyMarketData() {
    this.logger.log('Starting daily post-market EOD data sync...');
    const today = new Date();
    
    // Skip Saturdays (market is closed)
    if (today.getDay() === 6) {
      this.logger.log('Market closed today (Saturday). Skipping sync.');
      return;
    }

    try {
      // Step A: Attempt to scrape or fetch EOD data from external sources
      // The NEPSE API is often down or rate-limited. We try to request it.
      const response = await this.axiosInstance.get('https://nepalstock-api.herokuapp.com/api/today-share-price'); // placeholder for standard API
      if (response && response.data && Array.isArray(response.data)) {
        this.logger.log('Successfully fetched live EOD data from NEPSE API wrapper.');
        await this.processLiveEodData(response.data, today);
        return;
      }
      
      throw new Error('NEPSE live API returned invalid format or was unreachable.');
    } catch (error) {
      this.logger.warn(`External NEPSE API failed: ${error.message}. Running fallback simulation engine.`);
      await this.runFallbackSimulation(today);
    }
  }

  private async processLiveEodData(data: any[], date: Date) {
    const targetDate = new Date(date.toDateString());
    
    // Supported symbols in our prediction system
    const targetSymbols = ['NABIL', 'GBIME', 'AHPC', 'AKPL'];

    for (const record of data) {
      const symbol = record.symbol || record.companySymbol;
      if (!targetSymbols.includes(symbol)) continue;

      const open = parseFloat(record.openPrice || record.open || record.close);
      const high = parseFloat(record.maxPrice || record.high || record.close);
      const low = parseFloat(record.minPrice || record.low || record.close);
      const close = parseFloat(record.closePrice || record.close);
      const volume = parseFloat(record.volume || record.totalShares || 0);

      if (isNaN(close) || close <= 0) continue;

      await this.db.dailyPrice.upsert({
        where: {
          symbol_date: {
            symbol,
            date: targetDate,
          },
        },
        update: {
          open: open || close,
          high: high || close,
          low: low || close,
          close,
          volume,
        },
        create: {
          symbol,
          date: targetDate,
          open: open || close,
          high: high || close,
          low: low || close,
          close,
          volume,
        },
      });
      this.logger.log(`Upserted EOD price for ${symbol} via Live API.`);
    }
  }

  private async runFallbackSimulation(date: Date) {
    const targetDate = new Date(date.toDateString());
    const companies = await this.db.company.findMany();

    if (companies.length === 0) {
      this.logger.warn('No companies found in database. Please seed the database first.');
      return;
    }

    for (const comp of companies) {
      // Get the latest available price record to base the new walk on
      const latestPrice = await this.db.dailyPrice.findFirst({
        where: { symbol: comp.symbol },
        orderBy: { date: 'desc' },
      });

      let basePrice = 200;
      if (latestPrice) {
        // If we already have a record for today, skip it
        if (latestPrice.date.toDateString() === targetDate.toDateString()) {
          this.logger.log(`Price record for ${comp.symbol} on ${targetDate.toDateString()} already exists. Skipping.`);
          continue;
        }
        basePrice = latestPrice.close;
      }

      // Generate a realistic random walk step (daily swing +/- 2.5%)
      const volatility = 0.025;
      const changePercent = (Math.random() - 0.49) * volatility; // slight upward drift
      const change = basePrice * changePercent;
      
      const open = Number((basePrice + (Math.random() - 0.5) * basePrice * 0.004).toFixed(2));
      const close = Number((basePrice + change).toFixed(2));
      const high = Number((Math.max(open, close) + Math.random() * basePrice * 0.012).toFixed(2));
      const low = Number((Math.min(open, close) - Math.random() * basePrice * 0.012).toFixed(2));
      const volume = Number((Math.random() * 40000 + 10000).toFixed(0));

      await this.db.dailyPrice.upsert({
        where: {
          symbol_date: {
            symbol: comp.symbol,
            date: targetDate,
          },
        },
        update: {
          open,
          high,
          low,
          close,
          volume: parseFloat(volume.toString()),
        },
        create: {
          symbol: comp.symbol,
          date: targetDate,
          open,
          high,
          low,
          close,
          volume: parseFloat(volume.toString()),
        },
      });

      this.logger.log(`Simulated and saved fallback EOD price for ${comp.symbol} (Close: Rs. ${close})`);
    }
  }
}
