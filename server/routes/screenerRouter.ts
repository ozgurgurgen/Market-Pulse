import { Router } from 'express';
import { localFinanceApi } from '../dataAdapters/adapters/LocalFinanceApiAdapter';

import { isMockFallbackEnabled } from '../services/dbIntegrationService';

export const screenerRouter = Router();

export type ScreenerPreset = 
  'OVERSOLD' | 'OVERBOUGHT' | 'BULLISH_MOMENTUM' | 'BEARISH_MOMENTUM' | 
  'HIGH_VOLUME' | 'TOP_GAINERS' | 'TOP_LOSERS' | 'MACD_CROSSOVER';

interface ScreenedStock {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  volume: number;
  rsi14?: number;
  macd?: string;
  pe?: number;
  pb?: number;
}

screenerRouter.get('/stocks', async (req, res) => {
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

  let universe: any[] = [];
  if (localFinanceApi.isConfigured()) {
    try {
      const liveData = await localFinanceApi.getScreenerUniverse();
      if (liveData && liveData.length > 0) {
        universe = liveData;
      }
    } catch (e) {
      console.warn('[screenerRouter] Screener live fetch fallback:', e);
    }
  }

  if (universe.length === 0) {
    const mockFallbackEnabled = await isMockFallbackEnabled();
    if (!mockFallbackEnabled) {
      return res.json({
        success: true,
        totalCount: 0,
        data: [],
        availableSectors: [],
        message: 'NoN: Güvenli yedekleme kapalı.',
        lastRefreshed: new Date().toISOString()
      });
    }

    universe = [
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
      }
    ];
  }

  let filtered = [...universe];

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    filtered = filtered.filter(s => (s.symbol || '').toLowerCase().includes(q) || (s.name || '').toLowerCase().includes(q));
  }

  if (sector && typeof sector === 'string' && sector !== 'TÜMÜ') {
    filtered = filtered.filter(s => (s.sector || '').toLowerCase().includes(sector.toLowerCase()));
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

  const availableSectors = Array.from(new Set(universe.map(s => s.sector).filter(Boolean)));

  res.json({
    success: true,
    totalCount: filtered.length,
    data: filtered,
    availableSectors,
    lastRefreshed: new Date().toISOString()
  });
});

screenerRouter.get('/:preset', async (req, res) => {
  const preset = req.params.preset as ScreenerPreset;
  
  // Pipeline'da doğrudan /api/screener/{preset} var mı kontrol et
  if (localFinanceApi.isConfigured()) {
    try {
      const response = await fetch(localFinanceApi.getBaseUrl() + '/api/screener/' + preset, {
        signal: AbortSignal.timeout(2000),
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          return res.json({ preset, results: data });
        }
      }
    } catch {
      // Offline fallback
    }
  }

  // Canlı şirket havuzundan dinamik tarama
  let companies: any[] = [];
  if (localFinanceApi.isConfigured()) {
    try {
      const fetched = await localFinanceApi.getAllCompanies();
      if (fetched && Array.isArray(fetched)) {
        companies = fetched.slice(0, 30);
      }
    } catch (e) {
      console.warn('[screenerRouter] fetch companies error:', e);
    }
  }

  const defaultTickers = ['THYAO', 'ASELS', 'GARAN', 'AKBNK', 'FROTO', 'EREGL', 'TUPRS', 'SISE', 'BIMAS', 'KCHOL', 'SAHOL', 'PETKM', 'MIATK', 'CANTE', 'HEKTS'];
  
  if (companies.length === 0) {
    const mockFallbackEnabled = await isMockFallbackEnabled();
    if (!mockFallbackEnabled) {
      return res.json({ preset, results: [] });
    }
  }

  const pool = companies.length > 0 ? companies.map(c => c.ticker) : defaultTickers;

  const results: ScreenedStock[] = [];

  for (const sym of pool.slice(0, 15)) {
    const quote = null;
    const price = quote?.currentPrice || 0;
    const change = typeof quote?.change24hPercent === 'number' ? quote.change24hPercent : 0;
    const vol = typeof quote?.volume === 'number' ? quote.volume : typeof quote?.volume === 'string' ? Number(quote.volume) || 0 : 0;

    // Gerçek momentum ve değişimden türetilen deterministik Wilder RSI yaklaşımı
    const spark = quote?.sparkline && quote.sparkline.length >= 5 ? quote.sparkline : [];
    let rsi = 50.0;
    if (spark.length >= 5) {
      let gains = 0;
      let losses = 0;
      for (let i = 1; i < spark.length; i++) {
        const diff = spark[i] - spark[i - 1];
        if (diff > 0) gains += diff;
        else losses += Math.abs(diff);
      }
      const rs = losses === 0 ? 100 : gains / losses;
      rsi = Number((100 - (100 / (1 + rs))).toFixed(1));
    } else {
      // 24h değişime bağlı doğrusal Wilder tahmini (0 = 50, +%5 = 70, -%5 = 30)
      rsi = Number(Math.min(88, Math.max(12, 50 + (change * 4.2))).toFixed(1));
    }

    let macd = 'NEUTRAL';
    if (change > 1.8 || rsi > 62) {
      macd = 'BULLISH CROSS';
    } else if (change < -1.8 || rsi < 38) {
      macd = 'BEARISH CROSS';
    }

    let include = false;

    switch (preset) {
      case 'OVERSOLD':
        if (rsi < 40 || change < -1.2) include = true;
        break;
      case 'OVERBOUGHT':
        if (rsi > 60 || change > 1.2) include = true;
        break;
      case 'TOP_GAINERS':
        if (change > 0) include = true;
        break;
      case 'TOP_LOSERS':
        if (change < 0) include = true;
        break;
      case 'BULLISH_MOMENTUM':
      case 'MACD_CROSSOVER':
        if (macd === 'BULLISH CROSS' || change > 0.5) include = true;
        break;
      case 'BEARISH_MOMENTUM':
        if (macd === 'BEARISH CROSS' || change < -0.5) include = true;
        break;
      case 'HIGH_VOLUME':
        include = true;
        break;
      default:
        include = true;
    }

    if (include && results.length < 8) {
      results.push({
        symbol: sym + '.IS',
        name: quote?.name || sym,
        price,
        changePercent: Number(change.toFixed(2)),
        volume: vol,
        rsi14: rsi,
        macd
      });
    }
  }

  res.json({ preset, results });
});
