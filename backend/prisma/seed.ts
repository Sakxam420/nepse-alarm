import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const companies = [
  { symbol: 'NABIL', name: 'Nabil Bank Limited', sector: 'Banking', basePrice: 450 },
  { symbol: 'GBIME', name: 'Global IME Bank Limited', sector: 'Banking', basePrice: 260 },
  { symbol: 'AHPC', name: 'Arun Valley Hydropower Development Co. Ltd.', sector: 'Hydropower', basePrice: 320 },
  { symbol: 'AKPL', name: 'Ankhu Khola Jalvidhyut Self-Reliant Co.', sector: 'Hydropower', basePrice: 190 },
];

async function main() {
  console.log('Seeding database with companies and historical daily prices...');

  // Create companies
  for (const comp of companies) {
    await prisma.company.upsert({
      where: { symbol: comp.symbol },
      update: { name: comp.name, sector: comp.sector },
      create: { symbol: comp.symbol, name: comp.name, sector: comp.sector },
    });
  }

  // Generate historical daily prices (e.g. last 90 trading days)
  const today = new Date();
  const daysToGenerate = 90;

  for (const comp of companies) {
    console.log(`Generating 90 days of prices for ${comp.symbol}...`);
    let currentPrice = comp.basePrice;
    
    // We want a mix of bullish and consolidation phases
    for (let i = daysToGenerate; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Skip Saturdays (NEPSE is closed Fridays and Saturdays, or just Saturdays - let's skip Saturdays for simplicity)
      if (date.getDay() === 6) continue; // 6 is Saturday

      // Random price walk
      const volatility = 0.02; // 2% daily volatility
      const changePercent = (Math.random() - 0.48) * volatility; // slight upward bias
      const change = currentPrice * changePercent;
      const open = Number((currentPrice + (Math.random() - 0.5) * currentPrice * 0.005).toFixed(2));
      const close = Number((currentPrice + change).toFixed(2));
      const high = Number((Math.max(open, close) + Math.random() * currentPrice * 0.01).toFixed(2));
      const low = Number((Math.min(open, close) - Math.random() * currentPrice * 0.01).toFixed(2));
      const volume = Number((Math.random() * 50000 + 10000).toFixed(0));

      currentPrice = close;

      await prisma.dailyPrice.upsert({
        where: {
          symbol_date: {
            symbol: comp.symbol,
            date: new Date(date.toDateString()),
          },
        },
        update: {},
        create: {
          symbol: comp.symbol,
          date: new Date(date.toDateString()),
          open,
          high,
          low,
          close,
          volume: parseFloat(volume.toString()),
        },
      });
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
