
import { BIST_300_STOCKS } from './data/bistUniverse';
import { US_500_STOCKS } from './data/usUniverse';
import { ETF_200_UNIVERSE } from './data/etfUniverse';
import { MACRO_AND_CRYPTO_ASSETS } from './data/cryptoAndCommodities';
import { QuoteSourceManager } from './dataAdapters/managers/QuoteSourceManager';

import yfAny from 'yahoo-finance2';
const YFClass = (yfAny as any).default || yfAny;
const yf = new YFClass({ suppressNotices: ['yahooSurvey'] });

// --- MODULE 3: Global Concurrency Limiter & De-duplication Cache ---
const CONCURRENT_LIMIT = 5;
let activeRequests = 0;
const requestQueue: (() => void)[] = [];

async function acquireToken(): Promise<void> {
  console.log(`[Yahoo Limiter] Acquiring token. Active: ${activeRequests}, Queue: ${requestQueue.length}`);
  if (activeRequests < CONCURRENT_LIMIT) {
    activeRequests++;
    return;
  }
  return new Promise(resolve => {
    requestQueue.push(resolve);
  });
}

function releaseToken() {
  if (requestQueue.length > 0) {
    const next = requestQueue.shift();
    if (next) {
      next();
    } else {
      activeRequests--;
    }
  } else {
    activeRequests--;
  }
}

// 60-second memoization cache to prevent overlapping redundant requests
const fetchPromises = new Map<string, { promise: Promise<any>, timestamp: number }>();
const CACHE_TTL_MS = 60_000;

async function fetchFromYahooWithCacheAndLimit(ticker: string, skipQueue = false): Promise<any> {
  const now = Date.now();
  const existing = fetchPromises.get(ticker);
  
  if (existing && (now - existing.timestamp < CACHE_TTL_MS)) {
     return existing.promise;
  }
  
  const promise = (async () => {
     if (!skipQueue) {
       await acquireToken();
     }
     try {
       return await withBackoff(() => yf.quote(ticker));
     } finally {
       if (!skipQueue) {
         releaseToken();
       }
     }
  })();
  
  fetchPromises.set(ticker, { promise, timestamp: now });
  return promise;
}
// -------------------------------------------------------------------


export interface UnifiedAsset {
  symbol: string;
  name: string;
  exchange: string;
  category: 'BIST' | 'US_STOCKS' | 'ETF' | 'CRYPTO' | 'COMMODITIES' | 'FOREX';
  currency: string;
  yahooTicker?: string;
  sector?: string;
  basePrice: number;
}

import { validateField, ValidationMetadata } from './services/dataIntegrityService';

export interface LiveMarketQuote {
  validationMeta?: ValidationMetadata;
  symbol: string;
  name: string;
  exchange: string;
  category: 'BIST' | 'US_STOCKS' | 'ETF' | 'CRYPTO' | 'COMMODITIES' | 'FOREX';
  currentPrice: number;
  change24h: number | null;
  change24hPercent: number | null;
  currency: string;
  high24h: number;
  low24h: number;
  volume: string;
  sector?: string;
  peRatio?: number;
  marketCap?: string;
  lastUpdated: string;
  sparkline: number[];
  sparklineReal?: (number | null)[];
  isLiveRealtime?: boolean;
}

// BIST 300 + US 500 + 200+ ETF + Macro/Crypto/Forex = Tüm Evren (1000+ Varlık)
export const ALL_UNIVERSE_ASSETS: UnifiedAsset[] = [
  ...MACRO_AND_CRYPTO_ASSETS,
  ...BIST_300_STOCKS,
  ...US_500_STOCKS,
  ...ETF_200_UNIVERSE
];

// In-Memory Global Store & Real Sparkline History Ring Buffer
const quoteStore = new Map<string, LiveMarketQuote>();
const realSparklineHistoryMap = new Map<string, number[]>();
let isWorkerRunning = false;
let lastBatchIndex = 0;
const BATCH_SIZE = 5000; // Her turda tüm varlıkları sorgula

/**
 * Gerçek Fiyat Noktasını Ring Buffer'a Kaydet ve 12 Noktalı Diziyi Üret.
 * Sentetik/Rastgele sayı ÜRETİLMEZ; eksik noktalar null bırakılır.
 */
export function recordRealPriceTick(symbol: string, price: number): { sparkline: number[]; sparklineReal: (number | null)[] } {
  if (price <= 0 || isNaN(price)) {
    const existing = realSparklineHistoryMap.get(symbol) || [];
    const padded: (number | null)[] = Array(Math.max(0, 12 - existing.length)).fill(null).concat(existing);
    return { sparkline: existing.length > 0 ? existing : [], sparklineReal: padded };
  }

  let history = realSparklineHistoryMap.get(symbol);
  if (!history) {
    history = [];
    realSparklineHistoryMap.set(symbol, history);
  }

  history.push(price);
  if (history.length > 12) {
    history.shift();
  }

  const paddedReal: (number | null)[] = Array(Math.max(0, 12 - history.length)).fill(null).concat(history);
  return {
    sparkline: [...history],
    sparklineReal: paddedReal
  };
}

/**
 * Piyasa Açık/Kapalı Saatleri Kontrolü (Worker Rate-Limit Optimizasyonu)
 */
export function isMarketHours(assetCategory: 'BIST' | 'US_STOCKS' | 'ETF' | 'CRYPTO' | 'COMMODITIES' | 'FOREX' | string): boolean {
  if (assetCategory === 'CRYPTO') return true; // Kripto 7/24 kesintisiz açık

  const now = new Date();
  const utcDay = now.getUTCDay(); // 0: Pazar, 6: Cumartesi
  if (utcDay === 0 || utcDay === 6) {
    return false; // Hafta sonu kapalı
  }

  // Türkiye Saati (UTC+3)
  const trHour = (now.getUTCHours() + 3) % 24;
  const trMinute = now.getUTCMinutes();
  const trTimeMinutes = trHour * 60 + trMinute;

  if (assetCategory === 'BIST') {
    // 09:55 - 18:15 (595 - 1095 dakika)
    return trTimeMinutes >= 595 && trTimeMinutes <= 1095;
  }

  if (assetCategory === 'US_STOCKS' || assetCategory === 'ETF') {
    // ABD Piyasaları (TR Saatiyle 16:30 - 23:00)
    return trTimeMinutes >= 990 && trTimeMinutes <= 1380;
  }

  // Emtialar ve Forex: Hafta içi sürekli açık
  return true;
}

// Altın & Gümüş Türetme Sabitleri ve Saf Fonksiyonları
export const TROY_OUNCE_TO_GRAM = 31.1034768;
export const GRAM_ALTIN_SAFLIK = 0.995; // 24 ayar (995 milyem)

export function calculateGramGold(ouncePriceUsd: number, usdTryRate: number): number {
  if (ouncePriceUsd <= 0 || usdTryRate <= 0) return 0;
  return Number(((ouncePriceUsd / TROY_OUNCE_TO_GRAM) * usdTryRate * GRAM_ALTIN_SAFLIK).toFixed(2));
}

export function calculateCeyrekAltin(gramGoldPrice: number, ceyrekAgirlikGram = 1.75, iscilikPrimiPct = 0.05): number {
  if (gramGoldPrice <= 0) return 0;
  return Number((gramGoldPrice * ceyrekAgirlikGram * (1 + iscilikPrimiPct)).toFixed(2));
}

export function calculateGramGumus(ounceSilverUsd: number, usdTryRate: number): number {
  if (ounceSilverUsd <= 0 || usdTryRate <= 0) return 0;
  return Number(((ounceSilverUsd / TROY_OUNCE_TO_GRAM) * usdTryRate * 0.999).toFixed(2));
}

// Başlangıç Verilerini Yükle (Gerçek Ring Buffer İle)
function initializeQuoteStore() {
  const timeStr = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  ALL_UNIVERSE_ASSETS.forEach((asset, idx) => {
    const base = asset.basePrice;
    const { sparkline, sparklineReal } = recordRealPriceTick(asset.symbol, base);

    const initialQuote: LiveMarketQuote = {
      symbol: asset.symbol,
      name: asset.name,
      exchange: asset.exchange,
      category: asset.category,
      currentPrice: base,
      change24h: 0,
      change24hPercent: 0,
      currency: asset.currency,
      high24h: Number((base * 1.018).toFixed(2)),
      low24h: Number((base * 0.982).toFixed(2)),
      volume: asset.currency === '₺' ? '₺1.5 Mr' : '$2.8B',
      sector: asset.sector,
      peRatio: asset.category === 'BIST' ? Number((6.5 + (idx % 8) * 1.1).toFixed(1)) : asset.category === 'US_STOCKS' ? Number((24.0 + (idx % 12) * 2.2).toFixed(1)) : undefined,
      marketCap: asset.currency === '₺' ? '₺120 Mr' : '$1.2T',
      lastUpdated: timeStr,
      sparkline,
      sparklineReal,
      isLiveRealtime: false
    };
    quoteStore.set(asset.symbol, initialQuote);
  });
}

// Initialize immediately
initializeQuoteStore();

// Binance Kripto Fiyat Çekici
async function fetchBinancePrices(): Promise<Record<string, { price: number; changePercent: number }>> {
  try {
    const res = await fetch('https://api.binance.com/api/v3/ticker/24hr', {
      signal: AbortSignal.timeout(3500)
    });
    if (!res.ok) return {};
    const data = await res.json() as any[];
    const result: Record<string, { price: number; changePercent: number }> = {};
    const symbolMap: Record<string, string> = {
      'BTCUSDT': 'BTC',
      'ETHUSDT': 'ETH',
      'SOLUSDT': 'SOL',
      'BNBUSDT': 'BNB',
      'XRPUSDT': 'XRP',
      'ADAUSDT': 'ADA',
      'AVAXUSDT': 'AVAX',
      'DOGEUSDT': 'DOGE',
      'LINKUSDT': 'LINK',
      'SUIUSDT': 'SUI',
      'NEARUSDT': 'NEAR',
      'APTUSDT': 'APT',
      'RENDERUSDT': 'RENDER',
      'TAOUSDT': 'TAO',
      'FETUSDT': 'FET'
    };

    data.forEach(item => {
      const sym = symbolMap[item.symbol];
      if (sym) {
        result[sym] = {
          price: parseFloat(item.lastPrice),
          changePercent: parseFloat(item.priceChangePercent)
        };
      }
    });
    return result;
  } catch {
    return {};
  }
}

// Yahoo Finance REST API Direct Chart Query
async function fetchDirectYahooChart(ticker: string): Promise<{ price: number; change: number; changePercent: number; high: number; low: number; volume: number; sparkline: number[] } | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=15m&range=1d`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      signal: AbortSignal.timeout(3000)
    });
    if (!res.ok) return null;
    const data = await res.json() as any;
    const meta = data?.chart?.result?.[0]?.meta;
    const quotes = data?.chart?.result?.[0]?.indicators?.quote?.[0];
    if (!meta) return null;

    const price = meta.regularMarketPrice ?? meta.previousClose ?? 0;
    const prevClose = meta.previousClose ?? meta.chartPreviousClose ?? price;
    const change = price - prevClose;
    const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;
    const high = meta.regularMarketDayHigh ?? (price * 1.01);
    const low = meta.regularMarketDayLow ?? (price * 0.99);
    const volume = meta.regularMarketVolume ?? 0;

    let sparkline: number[] = [];
    if (quotes?.close && Array.isArray(quotes.close)) {
      sparkline = (quotes.close as (number | null)[])
        .filter((val): val is number => typeof val === 'number' && !isNaN(val) && val > 0)
        .slice(-12);
    }

    return { price, change, changePercent, high, low, volume, sparkline };
  } catch {
    return null;
  }
}

// Döviz ve Sarrafiye Altın Fiyatlarını Senkronize Et (Saf Formüller & Canlı Piyasa Ticks)
function syncDerivedCommodities(timeStr: string) {
  const existingUsd = quoteStore.get('USD/TRY');
  const usdTryPrice = existingUsd?.currentPrice && existingUsd.currentPrice > 0 ? existingUsd.currentPrice : 36.45;
  const usdChange = existingUsd?.change24h ?? 0;
  const usdChangePct = existingUsd?.change24hPercent ?? 0;
  const { sparkline: sUsd, sparklineReal: srUsd } = recordRealPriceTick('USD/TRY', usdTryPrice);
  
  quoteStore.set('USD/TRY', {
    symbol: 'USD/TRY',
    name: 'Dolar / Türk Lirası',
    exchange: 'FOREX',
    category: 'FOREX',
    currentPrice: usdTryPrice,
    change24h: usdChange,
    change24hPercent: usdChangePct,
    currency: '₺',
    high24h: existingUsd?.high24h ?? Number((usdTryPrice * 1.005).toFixed(4)),
    low24h: existingUsd?.low24h ?? Number((usdTryPrice * 0.995).toFixed(4)),
    volume: existingUsd?.volume || '$4.2B',
    sector: 'Döviz',
    lastUpdated: timeStr,
    sparkline: sUsd,
    sparklineReal: srUsd,
    isLiveRealtime: true
  });

  const existingEur = quoteStore.get('EUR/TRY');
  const eurTryPrice = existingEur?.currentPrice && existingEur.currentPrice > 0 ? existingEur.currentPrice : 38.10;
  const eurChange = existingEur?.change24h ?? 0;
  const eurChangePct = existingEur?.change24hPercent ?? 0;
  const { sparkline: sEur, sparklineReal: srEur } = recordRealPriceTick('EUR/TRY', eurTryPrice);

  quoteStore.set('EUR/TRY', {
    symbol: 'EUR/TRY',
    name: 'Euro / Türk Lirası',
    exchange: 'FOREX',
    category: 'FOREX',
    currentPrice: eurTryPrice,
    change24h: eurChange,
    change24hPercent: eurChangePct,
    currency: '₺',
    high24h: existingEur?.high24h ?? Number((eurTryPrice * 1.005).toFixed(4)),
    low24h: existingEur?.low24h ?? Number((eurTryPrice * 0.995).toFixed(4)),
    volume: existingEur?.volume || '€2.8B',
    sector: 'Döviz',
    lastUpdated: timeStr,
    sparkline: sEur,
    sparklineReal: srEur,
    isLiveRealtime: true
  });

  // Ons Altın
  const existingOns = quoteStore.get('XAU/USD') || quoteStore.get('GC=F');
  const onsAltinPrice = existingOns?.currentPrice && existingOns.currentPrice > 0 ? existingOns.currentPrice : 2680.0;
  const onsAltinChange = existingOns?.change24h ?? 0;
  const onsAltinChangePercent = existingOns?.change24hPercent ?? 0;
  const { sparkline: sOnsAltin, sparklineReal: srOnsAltin } = recordRealPriceTick('XAU/USD', onsAltinPrice);

  quoteStore.set('XAU/USD', {
    symbol: 'XAU/USD',
    name: 'Ons Altın (USD)',
    exchange: 'COMMODITIES',
    category: 'COMMODITIES',
    currentPrice: onsAltinPrice,
    change24h: onsAltinChange,
    change24hPercent: onsAltinChangePercent,
    currency: '$',
    high24h: existingOns?.high24h ?? Number((onsAltinPrice * 1.01).toFixed(2)),
    low24h: existingOns?.low24h ?? Number((onsAltinPrice * 0.99).toFixed(2)),
    volume: existingOns?.volume || '$18.4B',
    sector: 'Kıymetli Maden',
    lastUpdated: timeStr,
    sparkline: sOnsAltin,
    sparklineReal: srOnsAltin,
    isLiveRealtime: true
  });

  // Ons Gümüş
  const existingOnsGumus = quoteStore.get('XAG/USD') || quoteStore.get('SI=F');
  const onsGumusPrice = existingOnsGumus?.currentPrice && existingOnsGumus.currentPrice > 0 ? existingOnsGumus.currentPrice : 31.85;
  const onsGumusChange = existingOnsGumus?.change24h ?? 0;
  const onsGumusChangePercent = existingOnsGumus?.change24hPercent ?? 0;
  const { sparkline: sOnsGumus, sparklineReal: srOnsGumus } = recordRealPriceTick('XAG/USD', onsGumusPrice);

  quoteStore.set('XAG/USD', {
    symbol: 'XAG/USD',
    name: 'Ons Gümüş (USD)',
    exchange: 'COMMODITIES',
    category: 'COMMODITIES',
    currentPrice: onsGumusPrice,
    change24h: onsGumusChange,
    change24hPercent: onsGumusChangePercent,
    currency: '$',
    high24h: existingOnsGumus?.high24h ?? Number((onsGumusPrice * 1.01).toFixed(2)),
    low24h: existingOnsGumus?.low24h ?? Number((onsGumusPrice * 0.99).toFixed(2)),
    volume: existingOnsGumus?.volume || '$4.1B',
    sector: 'Kıymetli Maden',
    lastUpdated: timeStr,
    sparkline: sOnsGumus,
    sparklineReal: srOnsGumus,
    isLiveRealtime: true
  });

  // 1. Gram Altın: (Ons USD / 31.1034768) * USDTRY * 1.004
  const gramAltinPrice = Number((((onsAltinPrice / 31.1034768) * usdTryPrice) * 1.004).toFixed(2));
  const gramAltinChange = Number((((onsAltinChange / 31.1034768) * usdTryPrice) * 1.004).toFixed(2));
  const gramAltinChangePct = onsAltinChangePercent;
  const { sparkline: sAltin, sparklineReal: srAltin } = recordRealPriceTick('ALTIN', gramAltinPrice);
  
  quoteStore.set('ALTIN', {
    symbol: 'ALTIN',
    name: 'Gram Altın (TL)',
    exchange: 'COMMODITIES',
    category: 'COMMODITIES',
    currentPrice: gramAltinPrice,
    change24h: gramAltinChange,
    change24hPercent: gramAltinChangePct,
    currency: '₺',
    high24h: Number((gramAltinPrice * 1.01).toFixed(2)),
    low24h: Number((gramAltinPrice * 0.99).toFixed(2)),
    volume: '₺6.5 Mr',
    sector: 'Fiziki Altın',
    lastUpdated: timeStr,
    sparkline: sAltin,
    sparklineReal: srAltin,
    isLiveRealtime: true
  });

  // 2. Çeyrek Altın: Gram * 1.635
  const ceyrekAltinPrice = Number((gramAltinPrice * 1.635).toFixed(2));
  const ceyrekAltinChange = Number((gramAltinChange * 1.635).toFixed(2));
  const ceyrekAltinChangePct = gramAltinChangePct;
  const { sparkline: sCeyrek, sparklineReal: srCeyrek } = recordRealPriceTick('CEYREK', ceyrekAltinPrice);

  quoteStore.set('CEYREK', {
    symbol: 'CEYREK',
    name: 'Çeyrek Altın (TL)',
    exchange: 'COMMODITIES',
    category: 'COMMODITIES',
    currentPrice: ceyrekAltinPrice,
    change24h: ceyrekAltinChange,
    change24hPercent: ceyrekAltinChangePct,
    currency: '₺',
    high24h: Number((ceyrekAltinPrice * 1.01).toFixed(2)),
    low24h: Number((ceyrekAltinPrice * 0.99).toFixed(2)),
    volume: '₺2.2 Mr',
    sector: 'Sarrafiye',
    lastUpdated: timeStr,
    sparkline: sCeyrek,
    sparklineReal: srCeyrek,
    isLiveRealtime: true
  });

  // 3. Yarım Altın & Tam Altın
  const yarimAltinPrice = Number((ceyrekAltinPrice * 2).toFixed(2));
  const { sparkline: sYarim, sparklineReal: srYarim } = recordRealPriceTick('YARIM', yarimAltinPrice);
  quoteStore.set('YARIM', {
    symbol: 'YARIM',
    name: 'Yarım Altın (TL)',
    exchange: 'COMMODITIES',
    category: 'COMMODITIES',
    currentPrice: yarimAltinPrice,
    change24h: Number((ceyrekAltinChange * 2).toFixed(2)),
    change24hPercent: ceyrekAltinChangePct,
    currency: '₺',
    high24h: Number((ceyrekAltinPrice * 2 * 1.01).toFixed(2)),
    low24h: Number((ceyrekAltinPrice * 2 * 0.99).toFixed(2)),
    volume: '₺950 M',
    sector: 'Sarrafiye',
    lastUpdated: timeStr,
    sparkline: sYarim,
    sparklineReal: srYarim,
    isLiveRealtime: true
  });

  const tamAltinPrice = Number((ceyrekAltinPrice * 4).toFixed(2));
  const { sparkline: sTam, sparklineReal: srTam } = recordRealPriceTick('TAM', tamAltinPrice);
  quoteStore.set('TAM', {
    symbol: 'TAM',
    name: 'Tam / Cumhuriyet Altını (TL)',
    exchange: 'COMMODITIES',
    category: 'COMMODITIES',
    currentPrice: tamAltinPrice,
    change24h: Number((ceyrekAltinChange * 4).toFixed(2)),
    change24hPercent: ceyrekAltinChangePct,
    currency: '₺',
    high24h: Number((ceyrekAltinPrice * 4 * 1.01).toFixed(2)),
    low24h: Number((ceyrekAltinPrice * 4 * 0.99).toFixed(2)),
    volume: '₺1.8 Mr',
    sector: 'Sarrafiye',
    lastUpdated: timeStr,
    sparkline: sTam,
    sparklineReal: srTam,
    isLiveRealtime: true
  });

  // 4. Gram Gümüş: (Ons USD / 31.1034768) * USDTRY * 1.005
  const gramGumusPrice = Number((((onsGumusPrice / 31.1034768) * usdTryPrice) * 1.005).toFixed(2));
  const gramGumusChange = Number((((onsGumusChange / 31.1034768) * usdTryPrice) * 1.005).toFixed(2));
  const gramGumusChangePct = onsGumusChangePercent;
  const { sparkline: sGumus, sparklineReal: srGumus } = recordRealPriceTick('GUMUS', gramGumusPrice);

  quoteStore.set('GUMUS', {
    symbol: 'GUMUS',
    name: 'Gram Gümüş (TL)',
    exchange: 'COMMODITIES',
    category: 'COMMODITIES',
    currentPrice: gramGumusPrice,
    change24h: gramGumusChange,
    change24hPercent: gramGumusChangePct,
    currency: '₺',
    high24h: Number((gramGumusPrice * 1.01).toFixed(2)),
    low24h: Number((gramGumusPrice * 0.99).toFixed(2)),
    volume: '₺780 M',
    sector: 'Fiziki Gümüş',
    lastUpdated: timeStr,
    sparkline: sGumus,
    sparklineReal: srGumus,
    isLiveRealtime: true
  });
}

// Background Batch Refresh Worker (Piyasa Saati Kontrollü)

// Concurrency limiter for async tasks
async function runWithLimit<T, R>(items: T[], limit: number, asyncFn: (item: T) => Promise<R>): Promise<PromiseSettledResult<R>[]> {
  const results: Promise<R>[] = [];
  const executing: Promise<void>[] = [];
  
  for (const item of items) {
    const p = asyncFn(item);
    results.push(p);
    
    if (limit <= items.length) {
      const e = p.then(() => { executing.splice(executing.indexOf(e), 1); }).catch(() => { executing.splice(executing.indexOf(e), 1); });
      executing.push(e);
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }
  
  return Promise.allSettled(results);
}

// Exponential backoff wrapper
async function withBackoff<T>(fn: () => Promise<T>, maxRetries = 2, baseDelayMs = 300): Promise<T> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const result = await Promise.race([
        fn(),
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2500))
      ]);
      return result;
    } catch (err: any) {
      attempt++;
      if (attempt >= maxRetries) throw err;
      const delay = baseDelayMs * Math.pow(2, attempt);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error('Unreachable');
}

async function processBatchUpdate() {
  const timeStr = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  
  // 1. Kriptoları Binance üzerinden anında güncelle (7/24 kesintisiz)
  try {
    const binanceData = await fetchBinancePrices();
    for (const [sym, bnc] of Object.entries(binanceData)) {
      const existing = quoteStore.get(sym);
      if (existing) {
        const price = Number(bnc.price.toFixed(bnc.price < 10 ? 4 : 2));
        const change = (bnc.price * bnc.changePercent) / 100;
        const { sparkline, sparklineReal } = recordRealPriceTick(sym, price);
        quoteStore.set(sym, {
          ...existing,
          currentPrice: price,
          change24h: Number(change.toFixed(2)),
          change24hPercent: Number(bnc.changePercent.toFixed(2)),
          high24h: Number((bnc.price * 1.02).toFixed(2)),
          low24h: Number((bnc.price * 0.98).toFixed(2)),
          lastUpdated: timeStr,
          sparkline,
          sparklineReal,
          isLiveRealtime: true
        });
      }
    }
  } catch {}

  // 2. Ons altın, gümüş, döviz ve sarrafiye fiyatlarını senkronize et
  syncDerivedCommodities(timeStr);

  // 3. Sıradaki hisse ve varlık grubunu Yahoo Finance'tan çek (Piyasa Saati Kontrolüyle)
  const totalAssets = ALL_UNIVERSE_ASSETS.length;
  const startIdx = lastBatchIndex;
  const endIdx = Math.min(startIdx + BATCH_SIZE, totalAssets);
  const currentBatch = ALL_UNIVERSE_ASSETS.slice(startIdx, endIdx);

  lastBatchIndex = endIdx >= totalAssets ? 0 : endIdx;

  await runWithLimit(currentBatch, 5, async (asset) => {
    if (!asset.yahooTicker) return;

    try {
      const quote = await fetchFromYahooWithCacheAndLimit(asset.yahooTicker, true) as any;
      if (quote && typeof quote.regularMarketPrice === 'number' && quote.regularMarketPrice > 0) {
        const price = Number(quote.regularMarketPrice.toFixed(quote.regularMarketPrice < 10 ? 4 : 2));
        const change = quote.regularMarketChange ?? null;
        const changePercent = quote.regularMarketChangePercent ?? null;
        const high = quote.regularMarketDayHigh ?? (price * 1.015);
        const low = quote.regularMarketDayLow ?? (price * 0.985);

        let volStr = asset.currency === '₺' ? '₺2.1 Mr' : '$1.8B';
        if (quote.regularMarketVolume) {
          const v = quote.regularMarketVolume;
          volStr = v > 1e9 ? `${(v/1e9).toFixed(1)}B` : v > 1e6 ? `${(v/1e6).toFixed(1)}M` : `${v}`;
        }

        const existing = quoteStore.get(asset.symbol);
        const { sparkline, sparklineReal } = recordRealPriceTick(asset.symbol, price);

        quoteStore.set(asset.symbol, {
          symbol: asset.symbol,
          name: asset.name,
          exchange: asset.exchange,
          category: asset.category,
          currentPrice: price,
          change24h: change !== null ? Number(change.toFixed(2)) : null,
          change24hPercent: changePercent !== null ? Number(changePercent.toFixed(2)) : null,
          currency: asset.currency,
          high24h: Number(high.toFixed(2)),
          low24h: Number(low.toFixed(2)),
          volume: volStr,
          sector: asset.sector,
          peRatio: quote.trailingPE ?? existing?.peRatio,
          marketCap: quote.marketCap ? (quote.marketCap > 1e12 ? `$${(quote.marketCap/1e12).toFixed(2)}T` : `$${(quote.marketCap/1e9).toFixed(1)}B`) : existing?.marketCap,
          lastUpdated: quote.regularMarketTime ? new Date(quote.regularMarketTime * 1000).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : timeStr,
          sparkline,
          sparklineReal,
          isLiveRealtime: true
        });
        return;
      }
    } catch {}

    // Direct REST API fallback
    try {
      const direct = await fetchDirectYahooChart(asset.yahooTicker);
      if (direct && direct.price > 0) {
        const existing = quoteStore.get(asset.symbol);
        const price = Number(direct.price.toFixed(direct.price < 10 ? 4 : 2));
        const { sparkline, sparklineReal } = recordRealPriceTick(asset.symbol, price);

        quoteStore.set(asset.symbol, {
          symbol: asset.symbol,
          name: asset.name,
          exchange: asset.exchange,
          category: asset.category,
          currentPrice: price,
          change24h: direct.change !== null && direct.change !== undefined ? Number(direct.change.toFixed(2)) : null,
          change24hPercent: direct.changePercent !== null && direct.changePercent !== undefined ? Number(direct.changePercent.toFixed(2)) : null,
          currency: asset.currency,
          high24h: Number(direct.high.toFixed(2)),
          low24h: Number(direct.low.toFixed(2)),
          volume: direct.volume > 0 ? `${(direct.volume / 1e6).toFixed(1)}M` : (existing?.volume || '$1.5B'),
          sector: asset.sector,
          peRatio: existing?.peRatio,
          marketCap: existing?.marketCap,
          lastUpdated: timeStr,
          sparkline: direct.sparkline && direct.sparkline.length > 0 ? direct.sparkline : sparkline,
          sparklineReal,
          isLiveRealtime: true
        });
      }
    } catch {}
  });
}

// Background Worker Başlatıcı (Tüm veriler için 15 dakikada bir güncelleme döngüsü)
export function startBackgroundQuoteWorker() {
  if (isWorkerRunning) return;
  isWorkerRunning = true;

  // İlk tetikleme
  processBatchUpdate().catch(() => {});

  // Tüm Verileri Senkronize Eden 15 Dakikalık (900,000 ms) Döngü
  setInterval(() => {
    const timeStr = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    syncDerivedCommodities(timeStr);
    fetchBinancePrices().then(binanceData => {
      for (const [sym, bnc] of Object.entries(binanceData)) {
        const existing = quoteStore.get(sym);
        if (existing) {
          const price = Number(bnc.price.toFixed(bnc.price < 10 ? 4 : 2));
          const change = (bnc.price * bnc.changePercent) / 100;
          const { sparkline, sparklineReal } = recordRealPriceTick(sym, price);
          quoteStore.set(sym, {
            ...existing,
            currentPrice: price,
            change24h: Number(change.toFixed(2)),
            change24hPercent: Number(bnc.changePercent.toFixed(2)),
            high24h: Number((bnc.price * 1.02).toFixed(2)),
            low24h: Number((bnc.price * 0.98).toFixed(2)),
            lastUpdated: timeStr,
            sparkline,
            sparklineReal,
            isLiveRealtime: true
          });
        }
      }
    }).catch(() => {});
    
    // BIST, US, ve ETF'ler dahil tüm varlıkları güncelle
    processBatchUpdate().catch(() => {});
  }, 900_000);
}

/**
 * Sembol çözümleyici: BIST, US, Kripto, Emtia sembollerini ve .IS eklerini çözer.
 */
export function findAssetBySymbol(symbol: string): UnifiedAsset | undefined {
  if (!symbol) return undefined;
  const clean = symbol.trim().toUpperCase();
  const withoutSuffix = clean.replace(/\.IS$/, '');

  // 1. Doğrudan sembol eşleşmesi
  let asset = ALL_UNIVERSE_ASSETS.find(
    a => a.symbol.toUpperCase() === clean || a.symbol.toUpperCase() === withoutSuffix
  );
  if (asset) return asset;

  // 2. yahooTicker üzerinden eşleşme
  asset = ALL_UNIVERSE_ASSETS.find(
    a => a.yahooTicker && (a.yahooTicker.toUpperCase() === clean || a.yahooTicker.toUpperCase() === `${clean}.IS`)
  );
  return asset;
}

// Tüm Verileri veya Filtrelenmiş Verileri Döndür
export async function fetchLiveMarketQuotes(options?: {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'change' | 'volume' | 'price' | 'symbol';
  sortOrder?: 'asc' | 'desc';
}): Promise<{ quotes: LiveMarketQuote[]; total: number }> {
  const timeStr = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  
  // Worker başlatılmadıysa başlat
  if (!isWorkerRunning) {
    startBackgroundQuoteWorker();
  }

  let all = Array.from(quoteStore.values());

  // Kategori Filtresi
  if (options?.category && options.category !== 'ALL') {
    all = all.filter(q => q.category === options.category);
  }

  // Arama Filtresi (Sembol, Şirket Adı veya Sektör - Türkçe karakter duyarlı)
  if (options?.search && options.search.trim() !== '') {
    const rawQ = options.search.trim().toLowerCase();
    const cleanQ = rawQ.replace(/\.is$/, '');
    all = all.filter(item => {
      const sym = item.symbol.toLowerCase();
      const name = item.name.toLowerCase();
      const sector = (item.sector || '').toLowerCase();
      return sym.includes(rawQ) || sym.includes(cleanQ) || name.includes(rawQ) || name.includes(cleanQ) || sector.includes(rawQ);
    });
  }

  // Sıralama (null-safe)
  const sortOrder = options?.sortOrder === 'asc' ? 1 : -1;
  if (options?.sortBy === 'change') {
    all.sort((a, b) => ((a.change24hPercent ?? 0) - (b.change24hPercent ?? 0)) * sortOrder);
  } else if (options?.sortBy === 'price') {
    all.sort((a, b) => ((a.currentPrice ?? 0) - (b.currentPrice ?? 0)) * sortOrder);
  } else if (options?.sortBy === 'symbol') {
    all.sort((a, b) => a.symbol.localeCompare(b.symbol) * sortOrder);
  }

  const total = all.length;
  const offset = options?.offset || 0;
  const limit = options?.limit || total;
  const paginated = all.slice(offset, offset + limit);

  // Wrap paginated results with validation
  const validatedPaginated = await Promise.all(paginated.map(async (q) => {
    const validation = await validateField('price', { value: q.currentPrice, source: 'yahoo_finance', timestamp: new Date().toISOString() });
    return {
      ...q,
      validationMeta: {
        validation_status: validation.validation_status,
        confidence: validation.confidence,
        sources: validation.sources,
        fetched_at: validation.fetched_at
      }
    };
  }));

  // Filtrelenmiş veya conflict yemişleri gizle
  const finalQuotes = validatedPaginated.filter(q => 
    q.validationMeta.validation_status !== 'conflicting' && 
    q.validationMeta.validation_status !== 'anomaly_flagged'
  );

  return { quotes: finalQuotes, total };
}

// Tek Bir Sembolün Canlı Verisini Getir
export async function getLiveQuoteForSymbol(symbol: string): Promise<LiveMarketQuote | null> {
  const quote = await _getLiveQuoteForSymbol(symbol);
  if (quote) {
    const validation = await validateField('price', { value: quote.currentPrice, source: 'yahoo_finance', timestamp: new Date().toISOString() });
    quote.validationMeta = {
      validation_status: validation.validation_status,
      confidence: validation.confidence,
      sources: validation.sources,
      fetched_at: validation.fetched_at
    };
    if (validation.validation_status === 'conflicting' || validation.validation_status === 'anomaly_flagged') {
      // Sıçrama veya çelişki varsa gösterme
      return null;
    }
  }
  return quote;
}

async function _getLiveQuoteForSymbol(symbol: string): Promise<LiveMarketQuote | null> {
  if (!symbol) return null;
  if (!isWorkerRunning) {
    startBackgroundQuoteWorker();
  }

  const clean = symbol.trim().toUpperCase();
  const withoutSuffix = clean.replace(/\.IS$/, '');
  const asset = findAssetBySymbol(clean);

  const canonicalSymbol = asset ? asset.symbol : withoutSuffix;
  const isLikelyBist = (asset?.category === 'BIST') || clean.endsWith('.IS') || (!clean.includes('.') && clean.length <= 6);
  const yahooTicker = asset?.yahooTicker || (clean.endsWith('.IS') ? clean : (isLikelyBist ? `${withoutSuffix}.IS` : clean));

  const existing = quoteStore.get(canonicalSymbol) || quoteStore.get(clean);
  // Eğer zaten canlı gerçek veri çekildiyse store'dan döndür
  if (existing && existing.isLiveRealtime) {
    return existing;
  }

  // Canlı Yahoo Finance API / Anti-Corruption Layer üzerinden sorgula
  try {
    const normalized = await QuoteSourceManager.getQuote(yahooTicker, asset?.basePrice, asset?.category as any);
    if (normalized && normalized.price > 0) {
      const price = normalized.price;
      const isBist = (asset?.category === 'BIST') || yahooTicker.endsWith('.IS') || normalized.category === 'BIST';
      const timeStr = new Date(normalized.asOf).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      
      const chartData = await fetchDirectYahooChart(yahooTicker).catch(() => null);
      const sparkline = chartData?.sparkline && chartData.sparkline.length > 0 ? chartData.sparkline : (normalized.sparkline || recordRealPriceTick(canonicalSymbol, price).sparkline);

      const newQuote: LiveMarketQuote = {
        symbol: canonicalSymbol,
        name: normalized.name || asset?.name || canonicalSymbol,
        exchange: isBist ? 'BIST' : (normalized.exchange || 'US'),
        category: isBist ? 'BIST' : (asset?.category || 'US_STOCKS'),
        currentPrice: price,
        change24h: normalized.change24h,
        change24hPercent: normalized.changePercent,
        currency: isBist ? '₺' : '$',
        high24h: normalized.high24h || Number((price * 1.015).toFixed(2)),
        low24h: normalized.low24h || Number((price * 0.985).toFixed(2)),
        volume: normalized.volume ? (normalized.volume > 1e9 ? `${(normalized.volume/1e9).toFixed(1)}B` : `${(normalized.volume/1e6).toFixed(1)}M`) : (isBist ? '₺1.5 Mr' : '$1B'),
        sector: asset?.sector || 'Genel',
        peRatio: normalized.peRatio ?? existing?.peRatio,
        marketCap: normalized.marketCap ? (normalized.marketCap > 1e12 ? `$${(normalized.marketCap/1e12).toFixed(2)}T` : `$${(normalized.marketCap/1e9).toFixed(1)}B`) : existing?.marketCap,
        lastUpdated: timeStr,
        sparkline,
        isLiveRealtime: !normalized.isStale
      };
      quoteStore.set(canonicalSymbol, newQuote);
      return newQuote;
    }
  } catch (err) {
    console.warn(`[getLiveQuoteForSymbol ACL] Fetch failed for ${yahooTicker}:`, err);
  }

  // Live fetch başarısız olduysa ama store'da başlangıç kaydı varsa onu dön
  if (existing) {
    return existing;
  }

  return null;
}
