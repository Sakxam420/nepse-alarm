import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as https from 'https';

// We dynamically import @rumess/nepse-api since it's a CJS module
// and disable TLS verification (NEPSE portal has self-signed cert issues)
let nepseInstance: any = null;
async function getNepse() {
  if (nepseInstance) return nepseInstance;
  const { Nepse } = await import('@rumess/nepse-api');
  const n = new Nepse();
  n.setTLSVerification(false);
  nepseInstance = n;
  return n;
}

@Injectable()
export class MarketDataService implements OnModuleInit {
  private readonly logger = new Logger(MarketDataService.name);

  constructor(private readonly db: DatabaseService) {}

  /**
   * On startup: if the company table is empty, bootstrap from the live NEPSE company list.
   */
  async onModuleInit() {
    const count = await this.db.company.count();
    if (count === 0) {
      this.logger.log('Company table is empty — bootstrapping from NEPSE company list...');
      await this.bootstrapCompanyList();
    } else {
      this.logger.log(`Company table already has ${count} entries. Skipping bootstrap.`);
    }
  }

  /**
   * Pull the full company catalog from NEPSE and upsert into DB.
   * This runs once on first boot and can be called manually via the API.
   */
  async bootstrapCompanyList(): Promise<{ inserted: number; errors: number }> {
    this.logger.log('Fetching full company list from NEPSE portal...');
    let inserted = 0;
    let errors = 0;

    try {
      const nepse = await getNepse();
      const companyList: any[] = await nepse.getCompanyList();

      if (!Array.isArray(companyList) || companyList.length === 0) {
        throw new Error('Empty or invalid company list from NEPSE API.');
      }

      this.logger.log(`Received ${companyList.length} companies from NEPSE. Upserting to DB...`);

      for (const company of companyList) {
        try {
          const symbol: string = (company.symbol || company.companyCode || '').trim().toUpperCase();
          const name: string = (company.companyName || company.name || symbol).trim();
          const sector: string = (company.sectorName || company.sector || 'Other').trim();

          if (!symbol) continue;

          await this.db.company.upsert({
            where: { symbol },
            update: { name, sector },
            create: { symbol, name, sector },
          });
          inserted++;
        } catch (e) {
          errors++;
          this.logger.warn(`Failed to upsert company: ${JSON.stringify(company)} — ${e.message}`);
        }
      }

      this.logger.log(`Company bootstrap complete: ${inserted} upserted, ${errors} errors.`);
    } catch (error) {
      this.logger.error(`Company bootstrap failed: ${error.message}. Will use static fallback seed.`);
      // Fall back to inserting static well-known companies if NEPSE API is unreachable
      await this.insertStaticFallbackCompanies();
    }

    return { inserted, errors };
  }

  /**
   * Fetch today's EOD market data from NEPSE and persist into DB.
   * Skips Saturdays (NEPSE holiday). Called by the daily cron job.
   */
  async updateDailyMarketData(): Promise<void> {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun, 6=Sat

    if (dayOfWeek === 6) {
      this.logger.log('Saturday — NEPSE closed. Skipping sync.');
      return;
    }

    this.logger.log('Starting daily EOD sync from NEPSE live market data...');

    try {
      const nepse = await getNepse();
      const liveMarket: any[] = await nepse.getLiveMarket();

      if (!Array.isArray(liveMarket) || liveMarket.length === 0) {
        throw new Error('Empty or invalid live market data from NEPSE API.');
      }

      this.logger.log(`Received ${liveMarket.length} price records. Processing...`);
      const targetDate = new Date(today.toDateString());
      let saved = 0;
      let skipped = 0;

      for (const record of liveMarket) {
        try {
          const symbol: string = (
            record.symbol ||
            record.companySymbol ||
            record.ticker ||
            ''
          ).trim().toUpperCase();

          if (!symbol) { skipped++; continue; }

          const close = parseFloat(record.closingPrice || record.closePrice || record.close || record.lastTradedPrice || 0);
          if (isNaN(close) || close <= 0) { skipped++; continue; }

          const open  = parseFloat(record.openPrice  || record.open  || close);
          const high  = parseFloat(record.highPrice   || record.maxPrice || record.high  || close);
          const low   = parseFloat(record.lowPrice    || record.minPrice || record.low   || close);
          const volume = parseFloat(record.totalSharesTraded || record.shareTraded || record.volume || 0);

          // Ensure company exists in our catalog
          const exists = await this.db.company.findUnique({ where: { symbol } });
          if (!exists) {
            await this.db.company.create({
              data: {
                symbol,
                name: record.companyName || symbol,
                sector: record.sectorName || 'Other',
              },
            });
          }

          await this.db.dailyPrice.upsert({
            where: { symbol_date: { symbol, date: targetDate } },
            update: { open, high, low, close, volume },
            create: { symbol, date: targetDate, open, high, low, close, volume },
          });
          saved++;
        } catch (e) {
          skipped++;
          this.logger.warn(`Skipped record: ${e.message}`);
        }
      }

      this.logger.log(`EOD sync complete: ${saved} saved, ${skipped} skipped.`);
    } catch (error) {
      this.logger.error(`NEPSE live market API failed: ${error.message}. No simulated data will be written to preserve data integrity.`);
      // We intentionally do NOT write simulated data here — real prices or nothing.
    }
  }

  /**
   * Static fallback: inserts ~50 high-liquidity NEPSE companies when live API is unreachable.
   * Better than nothing — at least core stocks are available.
   */
  private async insertStaticFallbackCompanies() {
    const staticList = [
      // Banking
      { symbol: 'NABIL',  name: 'Nabil Bank Limited',            sector: 'Banking' },
      { symbol: 'GBIME',  name: 'Global IME Bank Limited',        sector: 'Banking' },
      { symbol: 'NICA',   name: 'NIC Asia Bank Ltd.',             sector: 'Banking' },
      { symbol: 'EBL',    name: 'Everest Bank Limited',           sector: 'Banking' },
      { symbol: 'HBL',    name: 'Himalayan Bank Limited',         sector: 'Banking' },
      { symbol: 'KBL',    name: 'Kumari Bank Limited',            sector: 'Banking' },
      { symbol: 'MBL',    name: 'Machhapuchchhre Bank Limited',   sector: 'Banking' },
      { symbol: 'MEGA',   name: 'Mega Bank Nepal Ltd.',           sector: 'Banking' },
      { symbol: 'NBL',    name: 'Nepal Bank Limited',             sector: 'Banking' },
      { symbol: 'NIB',    name: 'Nepal Investment Bank Ltd.',     sector: 'Banking' },
      { symbol: 'NMB',    name: 'NMB Bank Limited',              sector: 'Banking' },
      { symbol: 'PCBL',   name: 'Prime Commercial Bank Ltd.',     sector: 'Banking' },
      { symbol: 'PRVU',   name: 'Prabhu Bank Limited',           sector: 'Banking' },
      { symbol: 'SANIMA', name: 'Sanima Bank Limited',           sector: 'Banking' },
      { symbol: 'SBI',    name: 'Nepal SBI Bank Limited',         sector: 'Banking' },
      { symbol: 'SCB',    name: 'Standard Chartered Bank Nepal',  sector: 'Banking' },
      { symbol: 'SBL',    name: 'Sunrise Bank Limited',           sector: 'Banking' },
      { symbol: 'ADBL',   name: 'Agriculture Development Bank',   sector: 'Banking' },
      { symbol: 'BOKL',   name: 'Bank of Kathmandu Limited',      sector: 'Banking' },
      { symbol: 'CBL',    name: 'Century Commercial Bank',        sector: 'Banking' },
      { symbol: 'CCBL',   name: 'Civil Bank Limited',             sector: 'Banking' },
      { symbol: 'RBBL',   name: 'Rastriya Banijya Bank Ltd.',     sector: 'Banking' },
      // Hydropower
      { symbol: 'AHPC',   name: 'Arun Valley Hydropower',         sector: 'Hydropower' },
      { symbol: 'AKPL',   name: 'Ankhu Khola Jalvidhyut',         sector: 'Hydropower' },
      { symbol: 'CHCL',   name: 'Chilime Hydropower Co.',         sector: 'Hydropower' },
      { symbol: 'API',    name: 'API Power Co. Ltd.',             sector: 'Hydropower' },
      { symbol: 'BHPL',   name: 'Butwal Power Company Ltd.',      sector: 'Hydropower' },
      { symbol: 'DORDI',  name: 'Dordi Khola Jalabidhyut',        sector: 'Hydropower' },
      { symbol: 'GHL',    name: 'Ghalemdi Hydro Ltd.',            sector: 'Hydropower' },
      { symbol: 'HURJA',  name: 'Hurja Power Company',            sector: 'Hydropower' },
      { symbol: 'KPCL',   name: 'Kali Gandaki Jalvidhyut',        sector: 'Hydropower' },
      { symbol: 'NHDL',   name: 'National Hydropower Co.',        sector: 'Hydropower' },
      { symbol: 'PPL',    name: 'Panchakanya Hydropower Ltd.',    sector: 'Hydropower' },
      { symbol: 'RHPL',   name: 'Ridi Hydropower Dev. Co.',       sector: 'Hydropower' },
      { symbol: 'SAHAS',  name: 'Sahas Urja Ltd.',                sector: 'Hydropower' },
      { symbol: 'SHEL',   name: 'Shree Hydropower',               sector: 'Hydropower' },
      { symbol: 'UMRH',   name: 'Upper Marsyangdi Hydro',         sector: 'Hydropower' },
      { symbol: 'UPCL',   name: 'Upper Phewa Hydropower',         sector: 'Hydropower' },
      { symbol: 'BARUN',  name: 'Barun Hydropower Co.',           sector: 'Hydropower' },
      { symbol: 'RURU',   name: 'Ruru Power Co. Ltd.',            sector: 'Hydropower' },
      { symbol: 'SPDL',   name: 'Sanima Mai Hydropower',          sector: 'Hydropower' },
      { symbol: 'UMHL',   name: 'Upper Modi Hydro Ltd.',          sector: 'Hydropower' },
      { symbol: 'SSHL',   name: 'Solu Small Hydro',               sector: 'Hydropower' },
      { symbol: 'MKJC',   name: 'Madi Khola Jalavidhyut',        sector: 'Hydropower' },
      { symbol: 'TPC',    name: 'Terhathum Power Co.',            sector: 'Hydropower' },
      { symbol: 'DHPL',   name: 'Dhaulagiri Hydro Power',         sector: 'Hydropower' },
      // Insurance
      { symbol: 'NLIC',   name: 'Nepal Life Insurance Co.',       sector: 'Insurance' },
      { symbol: 'LICN',   name: 'Life Insurance Corp Nepal',      sector: 'Insurance' },
      { symbol: 'ALICL',  name: 'Asian Life Insurance',           sector: 'Insurance' },
      { symbol: 'GLICL',  name: 'Gurans Life Insurance',          sector: 'Insurance' },
      { symbol: 'HGI',    name: 'Himalayan General Insurance',    sector: 'Insurance' },
      { symbol: 'JLIC',   name: 'Jyoti Life Insurance',           sector: 'Insurance' },
      { symbol: 'LGIL',   name: 'Lumbini General Insurance',      sector: 'Insurance' },
      { symbol: 'NICL',   name: 'Nepal Insurance Co. Ltd.',       sector: 'Insurance' },
      { symbol: 'PLIC',   name: 'Prime Life Insurance',           sector: 'Insurance' },
      { symbol: 'PRIN',   name: 'Prabhu Insurance Ltd.',          sector: 'Insurance' },
      { symbol: 'SGIC',   name: 'Sagarmatha Insurance Co.',       sector: 'Insurance' },
      { symbol: 'SLICL',  name: 'Surya Life Insurance',           sector: 'Insurance' },
      { symbol: 'UIC',    name: 'United Insurance Co.',           sector: 'Insurance' },
      { symbol: 'AICL',   name: 'Agriculture Insurance',          sector: 'Insurance' },
      { symbol: 'NLICL',  name: 'National Life Insurance',        sector: 'Insurance' },
      { symbol: 'IGI',    name: 'IME General Insurance',          sector: 'Insurance' },
      // Finance
      { symbol: 'CIT',    name: 'Citizen Investment Trust',       sector: 'Finance' },
      { symbol: 'CFCL',   name: 'Central Finance Co. Ltd.',       sector: 'Finance' },
      { symbol: 'ICFC',   name: 'ICFC Finance Ltd.',              sector: 'Finance' },
      { symbol: 'MFIL',   name: 'Manjushree Finance Ltd.',        sector: 'Finance' },
      { symbol: 'SFCL',   name: 'Synergy Finance Company',        sector: 'Finance' },
      { symbol: 'TFC',    name: 'Tourist Finance Co.',            sector: 'Finance' },
      { symbol: 'NIFRA',  name: 'Nepal Infrastructure Bank',      sector: 'Finance' },
      // Manufacturing
      { symbol: 'HDL',    name: 'Himalayan Distillery Ltd.',      sector: 'Manufacturing' },
      { symbol: 'SHIVM',  name: 'Shivam Cements Ltd.',            sector: 'Manufacturing' },
      { symbol: 'BNT',    name: 'Bottlers Nepal (Balaju) Ltd.',   sector: 'Manufacturing' },
      { symbol: 'SHL',    name: 'Shangrila Development Bank',     sector: 'Manufacturing' },
      // Hotels
      { symbol: 'OHL',    name: 'Oriental Hotels Ltd.',           sector: 'Hotels' },
      { symbol: 'TDL',    name: 'Taragaon Regency Hotels',        sector: 'Hotels' },
      // Microfinance
      { symbol: 'CBBL',   name: 'Chhimek Laghubitta Bittiya',     sector: 'Microfinance' },
      { symbol: 'FOWAD',  name: 'Fowad Microfinance',             sector: 'Microfinance' },
      { symbol: 'LLBS',   name: 'Laxmi Laghubitta Bittiya',       sector: 'Microfinance' },
      { symbol: 'MERO',   name: 'Mero Microfinance Ltd.',         sector: 'Microfinance' },
      { symbol: 'NADEP',  name: 'Nirdhan Utthan Bank Ltd.',       sector: 'Microfinance' },
      { symbol: 'NESDO',  name: 'Nesdo Sambridha Laghubitta',     sector: 'Microfinance' },
      { symbol: 'NICLBSL',name:'NIC Asia Laghubitta',             sector: 'Microfinance' },
      { symbol: 'NUBL',   name: 'Nerude Laghubitta Bittiya',      sector: 'Microfinance' },
      { symbol: 'SLBL',   name: 'Sana Kisan Bikas Bank Ltd.',     sector: 'Microfinance' },
      { symbol: 'SWMF',   name: 'Swabalamban Laghubitta',         sector: 'Microfinance' },
      { symbol: 'RSDC',   name: 'Rural Microfinance Dev. Centre', sector: 'Microfinance' },
      { symbol: 'SAMAJ',  name: 'Samaj Laghubitta Bittiya',       sector: 'Microfinance' },
      { symbol: 'USLB',   name: 'United Laghubitta Bittiya',      sector: 'Microfinance' },
      // Development Banks
      { symbol: 'KSBBL',  name: 'Kamana Sewa Bikas Bank',         sector: 'Development Banks' },
      { symbol: 'LBBL',   name: 'Lumbini Bikas Bank Ltd.',        sector: 'Development Banks' },
      { symbol: 'MNBBL',  name: 'Muktinath Bikas Bank Ltd.',      sector: 'Development Banks' },
      { symbol: 'SBBL',   name: 'Saptakoshi Dev Bank Ltd.',       sector: 'Development Banks' },
      { symbol: 'SWBBL',  name: 'Siddhartha Womens Bank Ltd.',    sector: 'Development Banks' },
      { symbol: 'GRDBL',  name: 'Green Development Bank',         sector: 'Development Banks' },
      { symbol: 'JBBL',   name: 'Jyoti Bikas Bank Ltd.',          sector: 'Development Banks' },
      { symbol: 'MNBBL',  name: 'Muktinath Bikas Bank',           sector: 'Development Banks' },
    ];

    for (const company of staticList) {
      try {
        await this.db.company.upsert({
          where: { symbol: company.symbol },
          update: { name: company.name, sector: company.sector },
          create: company,
        });
      } catch { /* ignore individual errors */ }
    }
    this.logger.log(`Inserted ${staticList.length} static fallback companies.`);
  }
}
