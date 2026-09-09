import { Router } from 'express';
import { 
  ScreenerStockRow, 
  LatestBalanceSheetItem, 
  AcademyTopic, 
  BalanceSheetAlertSubscription 
} from '../../src/types';
import { localFinanceApi } from '../dataAdapters/adapters/LocalFinanceApiAdapter';
import { isMockFallbackEnabled } from '../services/dbIntegrationService';

export const advancedFeaturesRouter = Router();

// In-memory subscription store with default demo records
let alertSubscriptions: BalanceSheetAlertSubscription[] = [
  {
    email: 'yatirimci@ornek.com',
    subscribedSymbols: ['THYAO', 'FROTO', 'AKBNK', 'ASELS'],
    notifyOnKapDisclosure: true,
    notifyOnScorecardUpdate: true,
    createdAt: '2026-08-20 14:30',
    isActive: true
  }
];

// ==========================================
// 1. GELİŞMİŞ HİSSE FİLTRELEME (Stock Screener)
// ==========================================
const BIST_SCREENER_UNIVERSE: ScreenerStockRow[] = [
  {
    symbol: 'THYAO',
    name: 'Türk Hava Yolları',
    sector: 'Ulaştırma & Havacılık',
    price: 318.50,
    currency: '₺',
    change24hPercent: 2.35,
    pe: 4.8,
    pb: 0.95,
    evebitda: 3.9,
    netMargin: 14.6,
    roe: 34.2,
    revenueGrowthYoY: 68.4,
    netDebtToEbitda: 0.85,
    currentRatio: 1.42,
    dividendYield: 0.0,
    scorecardScore: 15,
    marketCapTRY: 439530000000,
    signalType: 'BUY'
  },
  {
    symbol: 'FROTO',
    name: 'Ford Otomotiv',
    sector: 'Otomotiv Sanayii',
    price: 1125.00,
    currency: '₺',
    change24hPercent: 1.80,
    pe: 8.2,
    pb: 3.60,
    evebitda: 6.8,
    netMargin: 11.2,
    roe: 42.1,
    revenueGrowthYoY: 54.2,
    netDebtToEbitda: 0.62,
    currentRatio: 1.68,
    dividendYield: 5.4,
    scorecardScore: 16,
    marketCapTRY: 394770000000,
    signalType: 'STRONG_BUY'
  },
  {
    symbol: 'AKBNK',
    name: 'Akbank T.A.Ş.',
    sector: 'Bankacılık & Finans',
    price: 58.70,
    currency: '₺',
    change24hPercent: -0.45,
    pe: 3.8,
    pb: 0.88,
    evebitda: 3.2,
    netMargin: 28.4,
    roe: 38.5,
    revenueGrowthYoY: 42.0,
    netDebtToEbitda: 0.20,
    currentRatio: 1.12,
    dividendYield: 4.8,
    scorecardScore: 14,
    marketCapTRY: 305240000000,
    signalType: 'BUY'
  },
  {
    symbol: 'GARAN',
    name: 'Garanti BBVA',
    sector: 'Bankacılık & Finans',
    price: 114.50,
    currency: '₺',
    change24hPercent: 0.88,
    pe: 4.2,
    pb: 1.05,
    evebitda: 3.6,
    netMargin: 31.2,
    roe: 41.2,
    revenueGrowthYoY: 46.5,
    netDebtToEbitda: 0.15,
    currentRatio: 1.18,
    dividendYield: 3.9,
    scorecardScore: 15,
    marketCapTRY: 480900000000,
    signalType: 'STRONG_BUY'
  },
  {
    symbol: 'ASELS',
    name: 'Aselsan Elektronik',
    sector: 'Savunma Sanayii & Teknoloji',
    price: 68.40,
    currency: '₺',
    change24hPercent: 3.12,
    pe: 12.4,
    pb: 2.85,
    evebitda: 9.8,
    netMargin: 19.8,
    roe: 28.4,
    revenueGrowthYoY: 74.2,
    netDebtToEbitda: 0.45,
    currentRatio: 2.15,
    dividendYield: 0.8,
    scorecardScore: 16,
    marketCapTRY: 311900000000,
    signalType: 'STRONG_BUY'
  },
  {
    symbol: 'TUPRS',
    name: 'Tüpraş Türkiye Petrol Rafinerileri',
    sector: 'Enerji & Petrol',
    price: 174.20,
    currency: '₺',
    change24hPercent: 1.15,
    pe: 5.9,
    pb: 1.72,
    evebitda: 4.4,
    netMargin: 9.6,
    roe: 39.8,
    revenueGrowthYoY: 38.6,
    netDebtToEbitda: 0.28,
    currentRatio: 1.38,
    dividendYield: 9.2,
    scorecardScore: 15,
    marketCapTRY: 335680000000,
    signalType: 'BUY'
  },
  {
    symbol: 'BIMAS',
    name: 'BİM Birleşik Mağazalar',
    sector: 'Perakende & Tüketim',
    price: 540.00,
    currency: '₺',
    change24hPercent: 0.35,
    pe: 11.8,
    pb: 3.45,
    evebitda: 7.6,
    netMargin: 5.4,
    roe: 32.5,
    revenueGrowthYoY: 62.1,
    netDebtToEbitda: 0.35,
    currentRatio: 0.98,
    dividendYield: 2.8,
    scorecardScore: 14,
    marketCapTRY: 328000000000,
    signalType: 'WATCH'
  },
  {
    symbol: 'KCHOL',
    name: 'Koç Holding A.Ş.',
    sector: 'Holding & Yatırım',
    price: 228.00,
    currency: '₺',
    change24hPercent: 1.45,
    pe: 4.6,
    pb: 0.92,
    evebitda: 3.8,
    netMargin: 12.8,
    roe: 36.4,
    revenueGrowthYoY: 48.9,
    netDebtToEbitda: 0.72,
    currentRatio: 1.55,
    dividendYield: 3.6,
    scorecardScore: 15,
    marketCapTRY: 578200000000,
    signalType: 'STRONG_BUY'
  },
  {
    symbol: 'SISE',
    name: 'Türkiye Şişe ve Cam Fabrikaları',
    sector: 'Sanayi & İmalat',
    price: 47.10,
    currency: '₺',
    change24hPercent: -0.85,
    pe: 8.4,
    pb: 1.22,
    evebitda: 6.1,
    netMargin: 10.2,
    roe: 21.6,
    revenueGrowthYoY: 34.8,
    netDebtToEbitda: 1.85,
    currentRatio: 1.54,
    dividendYield: 1.8,
    scorecardScore: 12,
    marketCapTRY: 144360000000,
    signalType: 'WATCH'
  },
  {
    symbol: 'PGSUS',
    name: 'Pegasus Hava Taşımacılığı',
    sector: 'Ulaştırma & Havacılık',
    price: 238.50,
    currency: '₺',
    change24hPercent: 2.80,
    pe: 6.2,
    pb: 1.45,
    evebitda: 4.8,
    netMargin: 12.1,
    roe: 28.6,
    revenueGrowthYoY: 58.4,
    netDebtToEbitda: 1.45,
    currentRatio: 1.28,
    dividendYield: 0.0,
    scorecardScore: 14,
    marketCapTRY: 122400000000,
    signalType: 'BUY'
  },
  {
    symbol: 'EREGL',
    name: 'Ereğli Demir ve Çelik Fabrikaları',
    sector: 'Metal & Demir Çelik',
    price: 48.90,
    currency: '₺',
    change24hPercent: 0.20,
    pe: 9.8,
    pb: 1.15,
    evebitda: 6.8,
    netMargin: 8.5,
    roe: 18.2,
    revenueGrowthYoY: 28.5,
    netDebtToEbitda: 1.35,
    currentRatio: 1.62,
    dividendYield: 1.2,
    scorecardScore: 11,
    marketCapTRY: 171150000000,
    signalType: 'WATCH'
  },
  {
    symbol: 'TOASO',
    name: 'Tofaş Türk Otomobil Fabrikası',
    sector: 'Otomotiv Sanayii',
    price: 242.00,
    currency: '₺',
    change24hPercent: 1.05,
    pe: 7.8,
    pb: 2.90,
    evebitda: 6.2,
    netMargin: 10.4,
    roe: 38.6,
    revenueGrowthYoY: 36.4,
    netDebtToEbitda: 0.45,
    currentRatio: 1.52,
    dividendYield: 6.2,
    scorecardScore: 15,
    marketCapTRY: 121000000000,
    signalType: 'BUY'
  }
];

advancedFeaturesRouter.get('/screener/stocks', async (req, res) => {
  const { 
    search, 
    sector, 
    minPe, 
    maxPe, 
    minPb, 
    maxPb, 
    minRoe, 
    minRevenueGrowth, 
    maxNetDebtToEbitda,
    minDividendYield,
    minScorecard
  } = req.query;

  let universe = BIST_SCREENER_UNIVERSE;
  if (localFinanceApi.isConfigured()) {
    try {
      const liveData = await localFinanceApi.getScreenerUniverse();
      if (liveData && liveData.length > 0) {
        universe = liveData;
      }
    } catch (e) {
      console.warn('[advancedFeaturesRouter] Screener live fetch fallback:', e);
    }
  }

  let filtered = [...universe];

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    filtered = filtered.filter(s => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
  }

  if (sector && typeof sector === 'string' && sector !== 'TÜMÜ') {
    filtered = filtered.filter(s => s.sector.toLowerCase().includes(sector.toLowerCase()));
  }

  if (minPe) filtered = filtered.filter(s => s.pe >= Number(minPe));
  if (maxPe) filtered = filtered.filter(s => s.pe <= Number(maxPe));
  if (minPb) filtered = filtered.filter(s => s.pb >= Number(minPb));
  if (maxPb) filtered = filtered.filter(s => s.pb <= Number(maxPb));
  if (minRoe) filtered = filtered.filter(s => s.roe >= Number(minRoe));
  if (minRevenueGrowth) filtered = filtered.filter(s => s.revenueGrowthYoY >= Number(minRevenueGrowth));
  if (maxNetDebtToEbitda) filtered = filtered.filter(s => s.netDebtToEbitda <= Number(maxNetDebtToEbitda));
  if (minDividendYield) filtered = filtered.filter(s => s.dividendYield >= Number(minDividendYield));
  if (minScorecard) filtered = filtered.filter(s => s.scorecardScore >= Number(minScorecard));

  res.json({
    success: true,
    totalCount: filtered.length,
    data: filtered,
    availableSectors: ['TÜMÜ', 'Ulaştırma & Havacılık', 'Otomotiv Sanayii', 'Bankacılık & Finans', 'Savunma Sanayii & Teknoloji', 'Enerji & Petrol', 'Perakende & Tüketim', 'Holding & Yatırım', 'Sanayi & İmalat', 'Metal & Demir Çelik']
  });
});

// ==========================================
// 2. SON AÇIKLANAN FİNANSAL TABLOLAR (Latest Balance Sheets Stream)
// ==========================================
const LATEST_BALANCE_SHEETS: LatestBalanceSheetItem[] = [
  {
    id: 'bs-thyao-2026-06',
    symbol: 'THYAO',
    name: 'Türk Hava Yolları',
    sector: 'Ulaştırma & Havacılık',
    period: '2026/06 (2. Çeyrek)',
    announcedAt: '2026-08-25 18:42',
    revenueTRY: 142500000000,
    revenueYoYPct: 68.4,
    netIncomeTRY: 20800000000,
    netIncomeYoYPct: 58.2,
    netProfitFormatted: '20.80 Milyar ₺',
    netProfitGrowthYoY: 58.2,
    ebitdaTRY: 33345000000,
    ebitdaYoYPct: 72.1,
    netDebtTRY: 28340000000,
    equityTRY: 312000000000,
    scorecardScore: 15,
    quarterlyChangeVerdict: 'BEKLENTİ ÜSTÜ',
    kapLink: 'https://www.kap.org.tr'
  },
  {
    id: 'bs-froto-2026-06',
    symbol: 'FROTO',
    name: 'Ford Otomotiv',
    sector: 'Otomotiv Sanayii',
    period: '2026/06 (2. Çeyrek)',
    announcedAt: '2026-08-24 19:15',
    revenueTRY: 118400000000,
    revenueYoYPct: 54.2,
    netIncomeTRY: 13260000000,
    netIncomeYoYPct: 48.6,
    netProfitFormatted: '13.26 Milyar ₺',
    netProfitGrowthYoY: 48.6,
    ebitdaTRY: 15150000000,
    ebitdaYoYPct: 49.2,
    netDebtTRY: 9400000000,
    equityTRY: 109650000000,
    scorecardScore: 16,
    quarterlyChangeVerdict: 'BEKLENTİ ÜSTÜ',
    kapLink: 'https://www.kap.org.tr'
  },
  {
    id: 'bs-asels-2026-06',
    symbol: 'ASELS',
    name: 'Aselsan Elektronik',
    sector: 'Savunma Sanayii & Teknoloji',
    period: '2026/06 (2. Çeyrek)',
    announcedAt: '2026-08-23 18:20',
    revenueTRY: 42600000000,
    revenueYoYPct: 74.2,
    netIncomeTRY: 8430000000,
    netIncomeYoYPct: 62.4,
    netProfitFormatted: '8.43 Milyar ₺',
    netProfitGrowthYoY: 62.4,
    ebitdaTRY: 10650000000,
    ebitdaYoYPct: 70.8,
    netDebtTRY: 4800000000,
    equityTRY: 109400000000,
    scorecardScore: 16,
    quarterlyChangeVerdict: 'BEKLENTİ ÜSTÜ',
    kapLink: 'https://www.kap.org.tr'
  },
  {
    id: 'bs-garan-2026-06',
    symbol: 'GARAN',
    name: 'Garanti BBVA',
    sector: 'Bankacılık & Finans',
    period: '2026/06 (2. Çeyrek)',
    announcedAt: '2026-08-22 18:05',
    revenueTRY: 184500000000,
    revenueYoYPct: 46.5,
    netIncomeTRY: 57570000000,
    netIncomeYoYPct: 44.0,
    netProfitFormatted: '57.57 Milyar ₺',
    netProfitGrowthYoY: 44.0,
    ebitdaTRY: 66420000000,
    ebitdaYoYPct: 45.1,
    netDebtTRY: 9960000000,
    equityTRY: 458000000000,
    scorecardScore: 15,
    quarterlyChangeVerdict: 'BEKLENTİ ÜSTÜ',
    kapLink: 'https://www.kap.org.tr'
  },
  {
    id: 'bs-akbnk-2026-06',
    symbol: 'AKBNK',
    name: 'Akbank T.A.Ş.',
    sector: 'Bankacılık & Finans',
    period: '2026/06 (2. Çeyrek)',
    announcedAt: '2026-08-21 18:10',
    revenueTRY: 162000000000,
    revenueYoYPct: 42.0,
    netIncomeTRY: 46000000000,
    netIncomeYoYPct: 39.5,
    netProfitFormatted: '46.00 Milyar ₺',
    netProfitGrowthYoY: 39.5,
    ebitdaTRY: 51840000000,
    ebitdaYoYPct: 40.8,
    netDebtTRY: 10360000000,
    equityTRY: 346800000000,
    scorecardScore: 14,
    quarterlyChangeVerdict: 'BEKLENTİLERE PARALEL',
    kapLink: 'https://www.kap.org.tr'
  },
  {
    id: 'bs-tuprs-2026-06',
    symbol: 'TUPRS',
    name: 'Tüpraş Rafinerileri',
    sector: 'Enerji & Petrol',
    period: '2026/06 (2. Çeyrek)',
    announcedAt: '2026-08-20 19:40',
    revenueTRY: 215000000000,
    revenueYoYPct: 38.6,
    netIncomeTRY: 20640000000,
    netIncomeYoYPct: 31.2,
    netProfitFormatted: '20.64 Milyar ₺',
    netProfitGrowthYoY: 31.2,
    ebitdaTRY: 30100000000,
    ebitdaYoYPct: 35.4,
    netDebtTRY: 8420000000,
    equityTRY: 195000000000,
    scorecardScore: 15,
    quarterlyChangeVerdict: 'BEKLENTİLERE PARALEL',
    kapLink: 'https://www.kap.org.tr'
  },
  {
    id: 'bs-bimas-2026-06',
    symbol: 'BIMAS',
    name: 'BİM Mağazaları',
    sector: 'Perakende & Tüketim',
    period: '2026/06 (2. Çeyrek)',
    announcedAt: '2026-08-19 18:30',
    revenueTRY: 132000000000,
    revenueYoYPct: 62.1,
    netIncomeTRY: 7128000000,
    netIncomeYoYPct: 24.5,
    netProfitFormatted: '7.13 Milyar ₺',
    netProfitGrowthYoY: 24.5,
    ebitdaTRY: 10032000000,
    ebitdaYoYPct: 44.2,
    netDebtTRY: 3510000000,
    equityTRY: 95000000000,
    scorecardScore: 14,
    quarterlyChangeVerdict: 'BEKLENTİLERE PARALEL',
    kapLink: 'https://www.kap.org.tr'
  },
  {
    id: 'bs-sise-2026-06',
    symbol: 'SISE',
    name: 'Şişecam',
    sector: 'Sanayi & İmalat',
    period: '2026/06 (2. Çeyrek)',
    announcedAt: '2026-08-18 19:00',
    revenueTRY: 58400000000,
    revenueYoYPct: 34.8,
    netIncomeTRY: 5956000000,
    netIncomeYoYPct: -14.2,
    netProfitFormatted: '5.96 Milyar ₺',
    netProfitGrowthYoY: -14.2,
    ebitdaTRY: 8760000000,
    ebitdaYoYPct: 11.5,
    netDebtTRY: 16200000000,
    equityTRY: 118000000000,
    scorecardScore: 12,
    quarterlyChangeVerdict: 'ZAYIF / DÜŞÜŞ',
    kapLink: 'https://www.kap.org.tr'
  }
];

advancedFeaturesRouter.get('/financials/latest', async (req, res) => {
  let liveFinancials: any[] = [];
  if (localFinanceApi.isConfigured()) {
    try {
      liveFinancials = await localFinanceApi.getLatestFinancials() || [];
      if (liveFinancials && liveFinancials.length > 0) {
        return res.json({
          success: true,
          totalCount: liveFinancials.length,
          data: liveFinancials,
          lastRefreshed: new Date().toISOString()
        });
      }
    } catch (err) {
      console.warn('[advancedFeaturesRouter] Live financials fetch failed:', err);
    }
  }

  const mockFallbackEnabled = await isMockFallbackEnabled();
  if (!mockFallbackEnabled) {
    return res.json({
      success: true,
      totalCount: 0,
      data: [],
      message: 'NoN: Yerel API bağlantısı aktif değil ve güvenli yedekleme (mock fallback) kapalı.',
      lastRefreshed: new Date().toISOString()
    });
  }

  res.json({
    success: true,
    totalCount: LATEST_BALANCE_SHEETS.length,
    data: LATEST_BALANCE_SHEETS,
    lastRefreshed: new Date().toISOString()
  });
});

// ==========================================
// 3. TEMEL ANALİZ AKADEMİSİ (Financial Academy Topics)
// ==========================================
const ACADEMY_TOPICS: AcademyTopic[] = [
  {
    id: 'pe-ratio',
    title: 'F/K Oranı (Fiyat / Kazanç Oranı)',
    category: 'temel_oranlar',
    categoryLabel: 'Temel Değerleme Oranları',
    shortDescription: 'Bir hissenin hisse başına net kârına göre kaç katından işlem gördüğünü gösterir.',
    formula: 'F/K = Hisse Fiyatı / Hisse Başına Kâr (HBK) ya da Piyasa Değeri / Yıllık Net Kâr',
    interpretationGuide: 'Düşük F/K şirketin ucuz olabileceğini veya piyasanın şirketin geleceğine dair düşük büyüme beklediğini gösterir. Sektör ortalaması ve tarihsel F/K ile karşılaştırılmalıdır.',
    idealRange: 'BIST Sanayi için 5x - 12x arası makul kabul edilir. Hızlı büyüyen teknoloji şirketlerinde 20x+ görülebilir.',
    practicalExample: 'THYAO yıllık 100 TL hisse başı kar üretiyorsa ve hisse 500 TL ise F/K = 5.0x’tir.',
    commonMistakes: [
      'Tek seferlik arsa satışı veya vergi geliriyle şişen net kâra aldanıp F/K’yı çok düşük zannetmek',
      'Farklı sektördeki iki hisseyi (örn. Banka vs Yazılım) doğrudan F/K ile kıyaslamak'
    ],
    proTip: 'Enflasyonist dönemlerde TMS 29 etkisini ve esas faaliyet kârından gelen sürdürülebilir kâr payını mutlaka kontrol edin.',
    iconName: 'PieChart'
  },
  {
    id: 'pb-ratio',
    title: 'PD/DD (Piyasa Değeri / Defter Değeri)',
    category: 'temel_oranlar',
    categoryLabel: 'Temel Değerleme Oranları',
    shortDescription: 'Şirketin borsa değerinin, bilançodaki özkaynaklarına (net varlıklarına) oranını ifade eder.',
    formula: 'PD/DD = Piyasa Değeri / Toplam Özkaynaklar',
    interpretationGuide: '1.0 altındaki değerler şirketin net varlıklarının değerinden daha ucuza satıldığını ima edebilir.',
    idealRange: 'Varlık ağırlıklı sanayi ve bankalarda 0.8x - 2.0x aralığı normaldir.',
    practicalExample: 'Akbank özkaynağı 350 Milyar TL, piyasa değeri 305 Milyar TL ise PD/DD = 0.87x (İskontolu).',
    commonMistakes: [
      'Yüksek teknoloji veya hizmet şirketlerinde maddi varlık az olduğu için yüksek PD/DD çıkmasını aşırı pahalı sanmak'
    ],
    proTip: 'Yüksek Özkaynak Kârlılığı (ROE) üreten şirketlerin daha yüksek PD/DD ile fiyatlanması doğaldır.',
    iconName: 'Scale'
  },
  {
    id: 'evebitda-ratio',
    title: 'FD/FAVÖK (Firma Değeri / FAVÖK)',
    category: 'temel_oranlar',
    categoryLabel: 'Temel Değerleme Oranları',
    shortDescription: 'Şirketin borçluluğunu da hesaba katarak ana operasyonel nakit yaratma gücüne göre değerlemesidir.',
    formula: 'Firma Değeri (FD) = Piyasa Değeri + Net Borç; FD / FAVÖK',
    interpretationGuide: 'Finansman yapısından ve vergi farklılıklarından arındırılmış en saf operasyonel çarpanlardan biridir.',
    idealRange: '4x - 8x arası cazip ve dengeli seviyelerdir.',
    practicalExample: 'FROTO FD/FAVÖK 6.8x ile küresel otomotiv üreticileri medyanı (7.5x) altında işlem görüyor.',
    commonMistakes: [
      'Net borcu negatif (kasada net nakit olan) şirketlerde FD’nin piyasa değerinden küçük çıkacağını unutmak'
    ],
    proTip: 'Satın alma ve birleşmelerde (M&A) kurumsal fonların en çok baktığı birincil çarpandır.',
    iconName: 'TrendingUp'
  },
  {
    id: 'scorecard-18',
    title: '18 Kriterli Şirket Karnesi Metodolojisi',
    category: 'bilanco_okuma',
    categoryLabel: 'Bilanço ve Karne Okuma',
    shortDescription: 'Kârlılık (6), Büyüme (6) ve Borçluluk (6) olmak üzere 18 nesnel filtreden oluşan şirket sağlık testi.',
    formula: 'Karne Skoru = Toplam Geçilen Kriter Sayısı / 18',
    interpretationGuide: '14/18 ve üzeri alan şirketler sağlam mali yapı ve yüksek büyüme kalitesine işaret eder.',
    idealRange: '13-18 Puan: Güçlü ve Güvenli; 8-12 Puan: Orta; 0-7 Puan: Yüksek Risk / Zayıf.',
    practicalExample: 'ASELS 16/18 puan alarak savunma sektöründe kârlılık ve likiditede tam not almıştır.',
    commonMistakes: [
      'Sadece tek bir kaleme bakıp şirketin borç çevirme riskini göz ardı etmek'
    ],
    proTip: 'Karnede Borçluluk skorunun 4 ve üzeri olması, yüksek faiz ortamında şirketin ayakta kalma garantisidir.',
    iconName: 'Award'
  },
  {
    id: 'tms29-inflation',
    title: 'TMS 29 Enflasyon Muhasebesi ve Bilanço Etkisi',
    category: 'bilanco_okuma',
    categoryLabel: 'Bilanço ve Karne Okuma',
    shortDescription: 'Yüksek enflasyon döneminde parasal ve parasal olmayan varlıkların düzeltilmesi standardıdır.',
    interpretationGuide: 'Parasal varlık (nakit) tutanlar net parasal kayıp yazarken; parasal borçla duran varlık finanse edenler kazanç elde eder.',
    idealRange: 'Enflasyon üzeri reel FAVÖK büyümesi üreten şirketler pozitiftir.',
    practicalExample: 'Stok devir hızı yüksek perakende ve ihracatçı şirketler TMS 29 etkisini daha kolay yönetir.',
    commonMistakes: [
      'Enflasyon düzeltmesi kaynaklı bir defalık net parasal kazanç/kayıpları operasyonel kârla karıştırmak'
    ],
    proTip: 'TMS 29 sonrasında Esas Faaliyet Kârı ve FAVÖK marjındaki reel değişime odaklanın.',
    iconName: 'Coins'
  },
  {
    id: 'dupont-analysis',
    title: 'DuPont Analizi (ROE Ayrıştırması)',
    category: 'degerleme_modelleri',
    categoryLabel: 'Değerleme ve Finansal Analiz Modelleri',
    shortDescription: 'Özkaynak Kârlılığını (ROE) Net Kâr Marjı x Aktif Devir Hızı x Kaldıraç Çarpanı olarak 3 parçaya böler.',
    formula: 'ROE = (Net Kâr / Satışlar) x (Satışlar / Toplam Varlıklar) x (Toplam Varlıklar / Özkaynaklar)',
    interpretationGuide: 'Şirketin kârlılığının yüksek marjdan mı, hızlı mal satmaktan mı, yoksa aşırı borçlanmaktan mı geldiğini netleştirir.',
    idealRange: 'Yüksek marj + yüksek devir hızı kaynaklı ROE en kaliteli büyümedir.',
    practicalExample: 'THYAO ROE’sinin %34 olmasında yüksek aktif devir hızı ve filo doluluk oranı belirleyicidir.',
    commonMistakes: [
      'Sırf kaldıraç (yüksek borç) yüzünden yapay olarak yükselen ROE’yi başarılı sanmak'
    ],
    proTip: 'DuPont analizinde Kaldıraç Çarpanı 3.5x üzerindeyse dikkatli olunmalıdır.',
    iconName: 'Layers'
  }
,
  {
    id: 'current-ratio',
    title: 'Cari Oran (Current Ratio)',
    category: 'likidite_oranlari',
    categoryLabel: 'Likidite ve Borç Ödeme Gücü',
    shortDescription: 'Şirketin kısa vadeli borçlarını, dönen varlıklarıyla ödeyebilme kapasitesidir.',
    formula: 'Cari Oran = Dönen Varlıklar / Kısa Vadeli Yabancı Kaynaklar',
    interpretationGuide: '1.5 ve üzeri genellikle güvenli kabul edilir. 1.0 altı ise nakit sıkışıklığı sinyali olabilir.',
    idealRange: 'Sanayi şirketleri için 1.5x - 2.0x, perakende için 1.0x civarı normaldir.',
    practicalExample: 'BİM gibi peşin satan perakendecilerde 1.0x bile yeterliyken, vadeli satan bir sanayi firmasında 1.5x aranır.',
    commonMistakes: [
      'Stok devir hızına bakmadan sadece Cari Oranın yüksek olmasına güvenip şirketi likit sanmak'
    ],
    proTip: 'Cari oranın 3.0x üzerine çıkması, şirketin nakdini veya stoklarını verimli kullanamadığının (atıl bıraktığının) işareti olabilir.',
    iconName: 'Droplets'
  },
  {
    id: 'acid-test',
    title: 'Asit-Test (Likidite) Oranı',
    category: 'likidite_oranlari',
    categoryLabel: 'Likidite ve Borç Ödeme Gücü',
    shortDescription: 'Stokların hızlı paraya çevrilemeyeceği varsayımıyla, en likit varlıkların kısa vadeli borçları karşılama gücüdür.',
    formula: 'Asit-Test = (Dönen Varlıklar - Stoklar) / Kısa Vadeli Yabancı Kaynaklar',
    interpretationGuide: 'Genellikle 1.0 ve üzeri idealdir. Şirketin elindeki nakit ve alacaklarla acil borçları ödeyip ödeyemeyeceğini gösterir.',
    idealRange: 'Çoğu sektör için 1.0x idealdir.',
    practicalExample: 'Otomotiv veya gayrimenkul gibi stokların yavaş eridiği sektörlerde Asit-Test oranı, Cari Orana göre çok daha gerçeği yansıtır.',
    commonMistakes: [
      'Hizmet sektöründeki bir şirketle sanayi şirketini aynı Asit-Test oranında kıyaslamak (Hizmette stok zaten yoktur).'
    ],
    proTip: 'Asit-Test oranı 1 in çok altındaysa, şirket vadesi gelen borcunu ödemek için elindeki malı (stokları) zararına satmak zorunda kalabilir.',
    iconName: 'Beaker'
  },
  {
    id: 'net-debt-ebitda',
    title: 'Net Borç / FAVÖK',
    category: 'borcluluk',
    categoryLabel: 'Borçluluk ve Risk',
    shortDescription: 'Şirketin tüm net borcunu, mevcut operasyonel kârıyla kaç yılda sıfırlayabileceğini gösterir.',
    formula: 'Net Borç / FAVÖK = (Kısa + Uzun Finansal Borçlar - Nakit) / Yıllıklandırılmış FAVÖK',
    interpretationGuide: 'Borç çevirme kapasitesinin en kritik göstergesidir. Yükseldikçe iflas veya bedelli sermaye artırımı riski artar.',
    idealRange: '2.5x ve altı güvenli, 3.5x üzeri riskli, 5.0x üzeri çok risklidir.',
    practicalExample: 'TÜPRAŞ (TUPRS) gibi güçlü şirketlerde bu oran genellikle sıfıra yakın veya negatiftir (Kasada net nakit vardır).',
    commonMistakes: [
      'FAVÖK düşüş trendindeyken eski (geçmiş 12 ay) FAVÖK ile oranı hesaplayıp riskin düşük olduğunu sanmak'
    ],
    proTip: 'Net Borç / FAVÖK oranı 3 ü geçen şirketlerde faiz giderleri, net kârı tamamen yok edebilir (kâr erimesi).',
    iconName: 'AlertTriangle'
  },
  {
    id: 'gross-net-margin',
    title: 'Brüt ve Net Kâr Marjı',
    category: 'karlilik',
    categoryLabel: 'Kârlılık ve Verimlilik',
    shortDescription: 'Satışlardan elde edilen gelirin, maliyetler ve giderler düştükten sonra ne kadarının şirkete kaldığıdır.',
    formula: 'Brüt Marj = (Brüt Kâr / Hasılat); Net Marj = (Net Kâr / Hasılat)',
    interpretationGuide: 'Brüt marj üretimdeki (maliyet) hakimiyeti, net marj ise tüm giderler (yönetim, finansman, vergi) sonrası başarıyı gösterir.',
    idealRange: 'Yazılımda %40+, Sanayide %15-20, Perakendede %3-5 (sektöre göre çok değişir).',
    practicalExample: 'Yazılım şirketleri (örn. LOGO) %80 brüt marjla çalışırken, zincir marketler (BIMAS) %15 brüt marjla çalışıp sürümden kazanır.',
    commonMistakes: [
      'Vergi geliri veya tek seferlik satışla artan Net Marjı, şirketin ana işi çok kârlıymış gibi yorumlamak'
    ],
    proTip: 'Esas Faaliyet Kârı Marjı her zaman Net Kâr Marjından daha güvenilir ve sürdürülebilirdir.',
    iconName: 'Percent'
  },
  {
    id: 'inventory-turnover',
    title: 'Stok ve Alacak Devir Hızı',
    category: 'karlilik',
    categoryLabel: 'Kârlılık ve Verimlilik',
    shortDescription: 'Şirketin deposundaki malı ne kadar hızlı sattığını ve sattığı malın parasını ne kadar hızlı tahsil ettiğini ölçer.',
    formula: 'Stok Devir = SMM / Ortalama Stok; Alacak Devir = Net Satışlar / Ortalama Ticari Alacak',
    interpretationGuide: 'Yüksek devir hızı şirketin verimli çalıştığını, nakit döngüsünün güçlü olduğunu gösterir.',
    idealRange: 'Sektör ortalamasından daha yüksek olması istenir.',
    practicalExample: 'Enflasyon ortamında stok devir hızını isteyerek yavaşlatan şirketler (stokçuluk/hedge) kâr marjını geçici olarak artırabilir.',
    commonMistakes: [
      'Mevsimsel şirketlerde tek bir çeyrek verisiyle devir hızı hesaplayıp şirketi yavaş/hızlı zannetmek'
    ],
    proTip: 'Alacak tahsil süresi uzuyorsa (devir hızı düşüyorsa), şirket satışları artırıyor görünse de gizli bir nakit krizi (tahsilat sorunu) yaşıyor olabilir.',
    iconName: 'RefreshCw'
  },
  {
    id: 'peg-ratio',
    title: 'PEG Rasyosu (Fiyat / Kazanç / Büyüme)',
    category: 'temel_oranlar',
    categoryLabel: 'Temel Değerleme Oranları',
    shortDescription: 'Fiyat/Kazanç (F/K) oranının, şirketin net kâr büyüme oranına bölünmesiyle bulunur.',
    formula: 'PEG = F/K Oranı / Beklenen Yıllık Kâr Büyüme Oranı (%)',
    interpretationGuide: 'Yüksek F/K ile fiyatlanan şirketlerin, eğer çok hızlı büyüyorlarsa aslında "ucuz" olabileceğini gösteren efsanevi metriktir (Peter Lynch).',
    idealRange: '1.0 altı ucuz (büyümesine göre kelepir), 1.0 adil, 1.5 ve üzeri pahalıdır.',
    practicalExample: 'F/K sı 20 olan bir teknoloji şirketi her yıl %40 büyüyorsa PEG = 0.5 olur ve oldukça ucuz sayılır.',
    commonMistakes: [
      'Geçmiş yıllardaki (tesadüfi) büyümeyi gelecekte de aynı kalacak varsayarak PEG hesaplamak'
    ],
    proTip: 'Büyüme oranı enflasyonun altındaysa PEG hesaplamak yanıltıcı olur; şirket reel olarak küçülüyordur.',
    iconName: 'Rocket'
  },
  {
    id: 'free-cash-flow',
    title: 'Serbest Nakit Akımı (FCF)',
    category: 'degerleme_modelleri',
    categoryLabel: 'Değerleme ve Finansal Analiz Modelleri',
    shortDescription: 'Tüm operasyonel giderler ve zorunlu yatırımlar (CAPEX) yapıldıktan sonra şirketin kasasında kalan "gerçek, dağıtılabilir nakit".',
    formula: 'FCF = İşletme Faaliyetlerinden Sağlanan Nakit - Yatırım Harcamaları (CAPEX)',
    interpretationGuide: 'Net kâr muhasebeseldir (maniple edilebilir), Serbest Nakit ise gerçektir. Temettünün yegâne sürdürülebilir kaynağıdır.',
    idealRange: 'FCF / Net Kâr > 0.8 (Kârın en az %80 i nakde dönmeli)',
    practicalExample: 'Bir şirket milyarlarca lira "Net Kâr" açıklayıp Serbest Nakit Akımı negatifse, o kâr tamamen borca veya stoka gömülmüş demektir; temettü ödeyemez.',
    commonMistakes: [
      'Hızlı büyüyen şirketlerde agresif fabrika yatırımları nedeniyle FCF negatif çıkmasını "şirket para kaybediyor" diye yanlış yorumlamak'
    ],
    proTip: 'Firma Değeri / Serbest Nakit Akımı çarpanı, birçok profesyonel için F/K dan çok daha güvenilir bir değerleme kriteridir.',
    iconName: 'Banknote'
  }
];

advancedFeaturesRouter.get('/academy/topics', (req, res) => {
  const { category, search } = req.query;
  let result = [...ACADEMY_TOPICS];

  if (category && typeof category === 'string' && category !== 'TÜMÜ') {
    result = result.filter(t => t.category === category);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    result = result.filter(t => t.title.toLowerCase().includes(q) || t.shortDescription.toLowerCase().includes(q) || t.interpretationGuide.toLowerCase().includes(q));
  }

  res.json({
    success: true,
    totalCount: result.length,
    data: result
  });
});

// ==========================================
// 4. BİLANÇO E-POSTA & BİLDİRİM ABONELİĞİ (Notification System)
// ==========================================
advancedFeaturesRouter.get('/notifications/subscriptions', (req, res) => {
  res.json({
    success: true,
    count: alertSubscriptions.length,
    data: alertSubscriptions
  });
});

advancedFeaturesRouter.post('/notifications/subscribe', (req, res) => {
  const { email, symbols, notifyOnKap, notifyOnScorecard } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Geçerli bir e-posta adresi giriniz.' });
  }

  const existingIdx = alertSubscriptions.findIndex(s => s.email.toLowerCase() === email.toLowerCase());
  
  const symbolsList = Array.isArray(symbols) && symbols.length > 0 ? symbols : ['THYAO', 'FROTO', 'AKBNK'];

  const record: BalanceSheetAlertSubscription = {
    email: email.trim().toLowerCase(),
    subscribedSymbols: symbolsList,
    notifyOnKapDisclosure: notifyOnKap !== false,
    notifyOnScorecardUpdate: notifyOnScorecard !== false,
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    isActive: true
  };

  if (existingIdx >= 0) {
    alertSubscriptions[existingIdx] = record;
  } else {
    alertSubscriptions.push(record);
  }

  res.json({
    success: true,
    message: `${record.email} adresine [${record.subscribedSymbols.join(', ')}] hisselerinin bilanço ve KAP bildirim alarmı başarıyla tanımlandı.`,
    data: record
  });
});

advancedFeaturesRouter.post('/notifications/test-alert', (req, res) => {
  const { symbol, email } = req.body;
  const targetSymbol = symbol || 'THYAO';
  const targetEmail = email || 'kullanici@finans.com';

  res.json({
    success: true,
    message: `[TEST BAŞARILI] ${targetEmail} adresine "${targetSymbol} 2026/06 Çeyreklik Bilanço Açıklandı (%68 Satış Büyümesi & 15/18 Karne)" e-posta simülasyonu gönderildi.`,
    sentPayload: {
      to: targetEmail,
      subject: `🚨 ${targetSymbol} Bilanço Bildirimi: Beklenti Üzeri Net Kâr Açıklandı`,
      preview: `${targetSymbol} Kamuyu Aydınlatma Platformu'na (KAP) 2. çeyrek finansal sonuçlarını iletti. Finansal Karne Skoru: 15/18.`
    }
  });
});
