import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding NEPSE database from NEPSE live API / static catalog ---');

  let companyList: any[] = [];
  try {
    const { Nepse } = await import('@rumess/nepse-api');
    const nepse = new Nepse();
    nepse.setTLSVerification(false);
    console.log('Fetching live company list from @rumess/nepse-api...');
    companyList = await nepse.getCompanyList();
    console.log(`Successfully fetched ${companyList.length} companies from NEPSE API.`);
  } catch (err: any) {
    console.warn(`Could not connect directly to NEPSE live API (${err.message}). Using comprehensive static catalog.`);
  }

  // If API returned list, upsert all of them
  if (Array.isArray(companyList) && companyList.length > 0) {
    let count = 0;
    for (const c of companyList) {
      const symbol = (c.symbol || c.companyCode || '').trim().toUpperCase();
      const name = (c.companyName || c.name || symbol).trim();
      const sector = (c.sectorName || c.sector || 'Other').trim();
      if (!symbol) continue;

      await prisma.company.upsert({
        where: { symbol },
        update: { name, sector },
        create: { symbol, name, sector },
      });
      count++;
    }
    console.log(`Seeded ${count} companies from live NEPSE API.`);
  } else {
    // Comprehensive catalog of NEPSE listed companies across sectors
    const catalog = [
      // Commercial Banks
      { symbol: 'NABIL', name: 'Nabil Bank Limited', sector: 'Banking' },
      { symbol: 'GBIME', name: 'Global IME Bank Limited', sector: 'Banking' },
      { symbol: 'NICA', name: 'NIC Asia Bank Ltd.', sector: 'Banking' },
      { symbol: 'EBL', name: 'Everest Bank Limited', sector: 'Banking' },
      { symbol: 'HBL', name: 'Himalayan Bank Limited', sector: 'Banking' },
      { symbol: 'KBL', name: 'Kumari Bank Limited', sector: 'Banking' },
      { symbol: 'MBL', name: 'Machhapuchchhre Bank Limited', sector: 'Banking' },
      { symbol: 'NBL', name: 'Nepal Bank Limited', sector: 'Banking' },
      { symbol: 'NMB', name: 'NMB Bank Limited', sector: 'Banking' },
      { symbol: 'PCBL', name: 'Prime Commercial Bank Ltd.', sector: 'Banking' },
      { symbol: 'PRVU', name: 'Prabhu Bank Limited', sector: 'Banking' },
      { symbol: 'SANIMA', name: 'Sanima Bank Limited', sector: 'Banking' },
      { symbol: 'SBI', name: 'Nepal SBI Bank Limited', sector: 'Banking' },
      { symbol: 'SCB', name: 'Standard Chartered Bank Nepal', sector: 'Banking' },
      { symbol: 'SBL', name: 'Siddhartha Bank Limited', sector: 'Banking' },
      { symbol: 'ADBL', name: 'Agriculture Development Bank Ltd.', sector: 'Banking' },
      { symbol: 'CZBIL', name: 'Citizens Bank International Ltd.', sector: 'Banking' },
      { symbol: 'LSL', name: 'Laxmi Sunrise Bank Limited', sector: 'Banking' },
      { symbol: 'NIMB', name: 'Nepal Investment Mega Bank Ltd.', sector: 'Banking' },
      
      // Development Banks
      { symbol: 'KSBBL', name: 'Kamana Sewa Bikas Bank Ltd.', sector: 'Development Banks' },
      { symbol: 'LBBL', name: 'Lumbini Bikas Bank Ltd.', sector: 'Development Banks' },
      { symbol: 'MNBBL', name: 'Muktinath Bikas Bank Ltd.', sector: 'Development Banks' },
      { symbol: 'GBBL', name: 'Garima Bikas Bank Ltd.', sector: 'Development Banks' },
      { symbol: 'JBBL', name: 'Jyoti Bikas Bank Ltd.', sector: 'Development Banks' },
      { symbol: 'SHINE', name: 'Shine Resunga Development Bank', sector: 'Development Banks' },
      { symbol: 'MLBL', name: 'Mahalaxmi Bikas Bank Ltd.', sector: 'Development Banks' },
      { symbol: 'SINDHU', name: 'Sindhu Bikas Bank Ltd.', sector: 'Development Banks' },
      { symbol: 'CORBL', name: 'Corporate Development Bank Ltd.', sector: 'Development Banks' },
      { symbol: 'GRDBL', name: 'Green Development Bank Ltd.', sector: 'Development Banks' },

      // Hydropower
      { symbol: 'AHPC', name: 'Arun Valley Hydropower Development Co.', sector: 'Hydropower' },
      { symbol: 'AKPL', name: 'Ankhu Khola Jalvidhyut Co. Ltd.', sector: 'Hydropower' },
      { symbol: 'API', name: 'API Power Company Ltd.', sector: 'Hydropower' },
      { symbol: 'BPCL', name: 'Butwal Power Company Ltd.', sector: 'Hydropower' },
      { symbol: 'CHCL', name: 'Chilime Hydropower Co. Ltd.', sector: 'Hydropower' },
      { symbol: 'HDHPC', name: 'Himal Dolakha Hydropower Co. Ltd.', sector: 'Hydropower' },
      { symbol: 'HURJA', name: 'National Hydro Power Company', sector: 'Hydropower' },
      { symbol: 'KPCL', name: 'Kalika Power Company Ltd.', sector: 'Hydropower' },
      { symbol: 'MEN', name: 'Mountain Energy Nepal Ltd.', sector: 'Hydropower' },
      { symbol: 'NGPL', name: 'Ngadi Group Power Ltd.', sector: 'Hydropower' },
      { symbol: 'NHDL', name: 'Nepal Hydro Developer Ltd.', sector: 'Hydropower' },
      { symbol: 'RADHI', name: 'Radhi Bidyut Company Ltd.', sector: 'Hydropower' },
      { symbol: 'RHPC', name: 'Rairang Hydropower Dev. Co. Ltd.', sector: 'Hydropower' },
      { symbol: 'RHPL', name: 'Rasuwagadhi Hydropower Co. Ltd.', sector: 'Hydropower' },
      { symbol: 'RURU', name: 'Ruru Jalbidhyut Pariyojana Ltd.', sector: 'Hydropower' },
      { symbol: 'SAHAS', name: 'Sahas Urja Ltd.', sector: 'Hydropower' },
      { symbol: 'SHPC', name: 'Sanima Mai Hydropower Ltd.', sector: 'Hydropower' },
      { symbol: 'SJCL', name: 'Sanjen Jalvidhyut Company Ltd.', sector: 'Hydropower' },
      { symbol: 'SPDL', name: 'Synergy Power Development Ltd.', sector: 'Hydropower' },
      { symbol: 'SSHL', name: 'Shiva Shree Hydropower Ltd.', sector: 'Hydropower' },
      { symbol: 'UMHL', name: 'United Modi Hydropower Ltd.', sector: 'Hydropower' },
      { symbol: 'UMRH', name: 'Upper Tamakoshi Hydropower Ltd.', sector: 'Hydropower' },
      { symbol: 'UPCL', name: 'Universal Power Company Ltd.', sector: 'Hydropower' },
      { symbol: 'BARUN', name: 'Barun Hydropower Co. Ltd.', sector: 'Hydropower' },
      { symbol: 'DHPL', name: 'Dibyashwori Hydropower Ltd.', sector: 'Hydropower' },
      { symbol: 'GHL', name: 'Ghalemdi Hydro Limited', sector: 'Hydropower' },
      { symbol: 'GLH', name: 'Greenlife Hydropower Ltd.', sector: 'Hydropower' },
      { symbol: 'GVL', name: 'Grameen Bikas Laghubitta (Hydro)', sector: 'Hydropower' },
      { symbol: 'HPPL', name: 'Himalayan Power Partner Ltd.', sector: 'Hydropower' },
      { symbol: 'KKHC', name: 'Khanikhola Hydropower Co. Ltd.', sector: 'Hydropower' },
      { symbol: 'LEC', name: 'Liberty Energy Company Ltd.', sector: 'Hydropower' },
      { symbol: 'MKJC', name: 'Mailung Khola Jalvidhyut Co. Ltd.', sector: 'Hydropower' },
      { symbol: 'MHNL', name: 'Mountain Hydro Nepal Ltd.', sector: 'Hydropower' },
      { symbol: 'PPCL', name: 'Panchakanya Mai Hydropower Ltd.', sector: 'Hydropower' },
      { symbol: 'PMHPL', name: 'Panchthar Power Company Ltd.', sector: 'Hydropower' },
      { symbol: 'SHEL', name: 'Singati Hydro Energy Ltd.', sector: 'Hydropower' },
      { symbol: 'TPC', name: 'Terhathum Power Company Ltd.', sector: 'Hydropower' },
      { symbol: 'UNHPL', name: 'Union Hydropower Limited', sector: 'Hydropower' },
      { symbol: 'UPPER', name: 'Upper Tamakoshi Hydropower Ltd.', sector: 'Hydropower' },
      { symbol: 'DORDI', name: 'Dordi Khola Jal Bidyut Company', sector: 'Hydropower' },
      { symbol: 'BHPL', name: 'Balephi Hydropower Limited', sector: 'Hydropower' },
      { symbol: 'HATH', name: 'Hathway Investment Nepal Ltd.', sector: 'Investment' },
      { symbol: 'SMJC', name: 'Sagarmatha Jalbidhyut Company', sector: 'Hydropower' },
      { symbol: 'MAKAR', name: 'Makar Jitumaya Suri Hydropower', sector: 'Hydropower' },
      { symbol: 'MAHILA', name: 'Mahila Laghubitta Bittiya Sanstha', sector: 'Microfinance' },
      { symbol: 'MKHL', name: 'Mai Khola Hydropower Limited', sector: 'Hydropower' },
      { symbol: 'TAMOR', name: 'Sanima Middle Tamor Hydropower', sector: 'Hydropower' },
      { symbol: 'BHUGOL', name: 'Bhugol Energy Development Co.', sector: 'Hydropower' },
      { symbol: 'ANLB', name: 'Asha Laghubitta Bittiya Sanstha', sector: 'Microfinance' },
      { symbol: 'BEDC', name: 'Bindhyabasini Energy Dev. Co.', sector: 'Hydropower' },

      // Insurance & Life Insurance
      { symbol: 'NLIC', name: 'Nepal Life Insurance Co. Ltd.', sector: 'Life Insurance' },
      { symbol: 'LICN', name: 'Life Insurance Corporation (Nepal)', sector: 'Life Insurance' },
      { symbol: 'ALICL', name: 'Asian Life Insurance Co. Ltd.', sector: 'Life Insurance' },
      { symbol: 'HLI', name: 'Himalayan Life Insurance Ltd.', sector: 'Life Insurance' },
      { symbol: 'RNLI', name: 'Reliable Nepal Life Insurance Ltd.', sector: 'Life Insurance' },
      { symbol: 'SNLI', name: 'Sun Nepal Life Insurance Ltd.', sector: 'Life Insurance' },
      { symbol: 'SJLIC', name: 'SuryaJyoti Life Insurance Co.', sector: 'Life Insurance' },
      { symbol: 'CLI', name: 'Citizen Life Insurance Co. Ltd.', sector: 'Life Insurance' },
      { symbol: 'SALICO', name: 'Sagarmatha Lumbini Insurance', sector: 'Non Life Insurance' },
      { symbol: 'SICL', name: 'Shikhar Insurance Co. Ltd.', sector: 'Non Life Insurance' },
      { symbol: 'NIL', name: 'Neco Insurance Co. Ltd.', sector: 'Non Life Insurance' },
      { symbol: 'NICL', name: 'Nepal Insurance Co. Ltd.', sector: 'Non Life Insurance' },
      { symbol: 'PRIN', name: 'Prabhu Insurance Ltd.', sector: 'Non Life Insurance' },
      { symbol: 'RBCL', name: 'Rastriya Beema Company Ltd.', sector: 'Non Life Insurance' },
      { symbol: 'IGI', name: 'IGI Prudential Insurance Ltd.', sector: 'Non Life Insurance' },
      { symbol: 'HGI', name: 'Himalayan Reinsurance Limited', sector: 'Non Life Insurance' },
      { symbol: 'NRN', name: 'NRN Infrastructure & Dev. Ltd.', sector: 'Investment' },

      // Hotels and Tourism
      { symbol: 'OHL', name: 'Oriental Hotels Ltd. (Radisson)', sector: 'Hotels And Tourism' },
      { symbol: 'SHL', name: 'Soaltee Hotel Limited', sector: 'Hotels And Tourism' },
      { symbol: 'TRH', name: 'Taragaon Regency Hotel (Hyatt)', sector: 'Hotels And Tourism' },
      { symbol: 'CGH', name: 'Chandragiri Hills Limited', sector: 'Hotels And Tourism' },
      { symbol: 'KDL', name: 'Kalinchowk Darshan Limited', sector: 'Hotels And Tourism' },
      { symbol: 'CITY', name: 'City Hotel Limited', sector: 'Hotels And Tourism' },

      // Manufacturing and Processing
      { symbol: 'HDL', name: 'Himalayan Distillery Ltd.', sector: 'Manufacturing And Processing' },
      { symbol: 'SHIVM', name: 'Shivam Cements Ltd.', sector: 'Manufacturing And Processing' },
      { symbol: 'GCIL', name: 'Ghorahi Cement Industry Ltd.', sector: 'Manufacturing And Processing' },
      { symbol: 'SARBTM', name: 'Sarbottam Cement Limited', sector: 'Manufacturing And Processing' },
      { symbol: 'SONA', name: 'Sonapur Minerals and Oil Ltd.', sector: 'Manufacturing And Processing' },
      { symbol: 'BNT', name: 'Bottlers Nepal (Terai) Ltd.', sector: 'Manufacturing And Processing' },
      { symbol: 'BNL', name: 'Bottlers Nepal (Balaju) Ltd.', sector: 'Manufacturing And Processing' },
      { symbol: 'UNL', name: 'Unilever Nepal Limited', sector: 'Manufacturing And Processing' },

      // Finance & Investment
      { symbol: 'CIT', name: 'Citizen Investment Trust', sector: 'Investment' },
      { symbol: 'NIFRA', name: 'Nepal Infrastructure Bank Ltd.', sector: 'Investment' },
      { symbol: 'HIDCL', name: 'Hydroelectricity Investment & Dev.', sector: 'Investment' },
      { symbol: 'CHDC', name: 'CEDB Hydropower Development Co.', sector: 'Investment' },
      { symbol: 'ICFC', name: 'ICFC Finance Limited', sector: 'Finance' },
      { symbol: 'MFIL', name: 'Manjushree Finance Limited', sector: 'Finance' },
      { symbol: 'GFCL', name: 'Goodwill Finance Co. Ltd.', sector: 'Finance' },
      { symbol: 'GUFL', name: 'Gurkhas Finance Ltd.', sector: 'Finance' },
      { symbol: 'CFCL', name: 'Central Finance Co. Ltd.', sector: 'Finance' },
      { symbol: 'BFC', name: 'Best Finance Company Ltd.', sector: 'Finance' },
      { symbol: 'RLFL', name: 'Reliance Finance Ltd.', sector: 'Finance' },
      { symbol: 'SIFC', name: 'Shree Investment Finance Co. Ltd.', sector: 'Finance' },
      { symbol: 'PROFL', name: 'Progressive Finance Ltd.', sector: 'Finance' },
      { symbol: 'PFL', name: 'Pokhara Finance Ltd.', sector: 'Finance' },

      // Microfinance
      { symbol: 'CBBL', name: 'Chhimek Laghubitta Bittiya Sanstha', sector: 'Microfinance' },
      { symbol: 'SKBBL', name: 'Sana Kisan Bikas Laghubitta', sector: 'Microfinance' },
      { symbol: 'NUBL', name: 'Nirdhan Utthan Laghubitta', sector: 'Microfinance' },
      { symbol: 'DDBL', name: 'Deprosc Laghubitta Bittiya Sanstha', sector: 'Microfinance' },
      { symbol: 'FOWAD', name: 'Forward Microfinance Laghubitta', sector: 'Microfinance' },
      { symbol: 'MERO', name: 'Mero Microfinance Bittiya Sanstha', sector: 'Microfinance' },
      { symbol: 'NICLBSL', name: 'NIC Asia Laghubitta Bittiya', sector: 'Microfinance' },
      { symbol: 'NESDO', name: 'NESDO Sambridha Laghubitta', sector: 'Microfinance' },
      { symbol: 'SWBBL', name: 'Swabalamban Laghubitta Bittiya', sector: 'Microfinance' },
      { symbol: 'SMATA', name: 'Samata Gharelu Laghubitta', sector: 'Microfinance' },
      { symbol: 'GMFBS', name: 'Ganapati Laghubitta Bittiya', sector: 'Microfinance' },
      { symbol: 'ILBS', name: 'Infinity Laghubitta Bittiya', sector: 'Microfinance' },
      { symbol: 'JBLB', name: 'Jiban Bikas Laghubitta', sector: 'Microfinance' },
      { symbol: 'RSDC', name: 'RSDC Laghubitta Bittiya Sanstha', sector: 'Microfinance' },
      { symbol: 'SABSL', name: 'Sabaiko Laghubitta Bittiya Sanstha', sector: 'Microfinance' },
      { symbol: 'SMB', name: 'Support Microfinance Bittiya', sector: 'Microfinance' },
      { symbol: 'UNLB', name: 'Unnati Sahakarya Laghubitta', sector: 'Microfinance' },
      { symbol: 'USLB', name: 'Upakar Laghubitta Bittiya Sanstha', sector: 'Microfinance' },
      { symbol: 'VLBS', name: 'Vijaya Laghubitta Bittiya Sanstha', sector: 'Microfinance' },
      { symbol: 'WIN', name: 'Win Nepal Laghubitta Bittiya', sector: 'Microfinance' },
      { symbol: 'CYCL', name: 'CYC Nepal Laghubitta Bittiya', sector: 'Microfinance' },
      { symbol: 'ALBSL', name: 'Aarambha Chautari Laghubitta', sector: 'Microfinance' },
      { symbol: 'HLBSL', name: 'Himalayan Laghubitta Bittiya', sector: 'Microfinance' },

      // Others & Telecom
      { symbol: 'NTC', name: 'Nepal Telecom (Nepal Doorsanchar)', sector: 'Others' },
      { symbol: 'NRM', name: 'Nepal Republic Media Limited', sector: 'Others' },
      { symbol: 'MKCL', name: 'Muktinath Krishi Company Ltd.', sector: 'Others' },
    ];

    for (const c of catalog) {
      await prisma.company.upsert({
        where: { symbol: c.symbol },
        update: { name: c.name, sector: c.sector },
        create: c,
      });
    }
    console.log(`Seeded ${catalog.length} companies from fallback catalog.`);
  }

  // Now seed historical price bars for key active benchmark stocks
  const benchmarkSymbols = [
    'NABIL', 'GBIME', 'NICA', 'EBL', 'HBL', 'KBL', 'MBL', 'NBL', 'NMB', 'PCBL',
    'PRVU', 'SANIMA', 'SBI', 'SCB', 'SBL', 'ADBL', 'AHPC', 'AKPL', 'API', 'BPCL',
    'CHCL', 'HDHPC', 'HURJA', 'KPCL', 'NHDL', 'RHPL', 'RURU', 'SAHAS', 'SHPC', 'UMRH',
    'BARUN', 'NLIC', 'LICN', 'ALICL', 'CIT', 'NIFRA', 'HDL', 'SHIVM', 'SONA', 'OHL',
    'SHL', 'NTC', 'CBBL', 'DDBL', 'FOWAD', 'MERO'
  ];

  // Also include first 30 in database
  const first30 = await prisma.company.findMany({ take: 30 });
  const allTargetSymbols = Array.from(new Set([...benchmarkSymbols, ...first30.map(c => c.symbol)]));
  const seededCompanies = await prisma.company.findMany({
    where: { symbol: { in: allTargetSymbols } },
  });

  const today = new Date();

  console.log(`Generating price history (60 trading days) for ${seededCompanies.length} active securities...`);
  for (const comp of seededCompanies) {
    let basePrice = 350;
    if (comp.symbol === 'NABIL') basePrice = 538;
    if (comp.symbol === 'NICA') basePrice = 472;
    if (comp.symbol === 'GBIME') basePrice = 276;
    if (comp.symbol === 'NTC') basePrice = 875;
    if (comp.symbol === 'HDL') basePrice = 1360;
    if (comp.symbol === 'SHIVM') basePrice = 494;
    if (comp.symbol === 'CIT') basePrice = 2160;
    if (comp.symbol === 'NLIC') basePrice = 628;
    if (comp.symbol === 'CHCL') basePrice = 404;
    if (comp.symbol === 'AHPC') basePrice = 388;
    if (comp.symbol === 'AKPL') basePrice = 312;
    if (comp.symbol === 'API') basePrice = 242;

    let price = basePrice;
    for (let i = 60; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      if (date.getDay() === 6) continue; // skip Saturday

      const pct = (Math.random() - 0.48) * 0.025;
      price = Math.max(price + price * pct, 50);
      const open = Number((price + (Math.random() - 0.5) * price * 0.005).toFixed(2));
      const close = Number(price.toFixed(2));
      const high = Number((Math.max(open, close) + Math.random() * price * 0.01).toFixed(2));
      const low = Number((Math.min(open, close) - Math.random() * price * 0.01).toFixed(2));
      const volume = Number((Math.random() * 40000 + 8000).toFixed(0));

      const targetDate = new Date(date.toDateString());
      await prisma.dailyPrice.upsert({
        where: {
          symbol_date: {
            symbol: comp.symbol,
            date: targetDate,
          },
        },
        update: { open, high, low, close, volume },
        create: {
          symbol: comp.symbol,
          date: targetDate,
          open,
          high,
          low,
          close,
          volume,
        },
      });
    }
  }

  console.log('--- Seeding completed successfully! ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
