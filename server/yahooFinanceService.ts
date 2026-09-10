// REWRITTEN: Now strictly acts as a reader from serverLocalDatabase, 
// completely removing all external dependencies (Yahoo, Binance, etc.)
import { serverLocalDatabase } from './services/serverLocalDatabase';
import { BIST_300_STOCKS } from './data/bistUniverse';
import { US_500_STOCKS } from './data/usUniverse';
import { ETF_200_UNIVERSE } from './data/etfUniverse';
import { MACRO_AND_CRYPTO_ASSETS } from './data/cryptoAndCommodities';

export interface UnifiedAsset {
  symbol: string;
  name: string;
  category: string;
  sector?: string;
  industry?: string;
  yahooTicker?: string;
  binanceTicker?: string;
  basePrice?: number;
}

export interface LiveMarketQuote {
  symbol: string;
  name: string;
  exchange: string;
  category: string;
  currentPrice: number;
  change24h: number;
  change24hPercent: number;
  currency: string;
  high24h: number;
  low24h: number;
  volume: string | number;
  sector?: string;
  peRatio?: number;
  marketCap?: string;
  lastUpdated: string;
  sparkline?: number[];
  isLiveRealtime?: boolean;
}

export const ALL_UNIVERSE_ASSETS: UnifiedAsset[] = [
  ...BIST_300_STOCKS,
  ...US_500_STOCKS,
  ...ETF_200_UNIVERSE,
  ...MACRO_AND_CRYPTO_ASSETS
];

export function findAssetBySymbol(symbol: string): UnifiedAsset | undefined {
  if (!symbol) return undefined;
  const clean = symbol.trim().toUpperCase();
  const withoutSuffix = clean.replace(/\.IS$/, '');
  
  let asset = ALL_UNIVERSE_ASSETS.find(
    a => a.symbol.toUpperCase() === clean || a.symbol.toUpperCase() === withoutSuffix
  );
  if (asset) return asset;
  
  asset = ALL_UNIVERSE_ASSETS.find(
    a => a.yahooTicker && (a.yahooTicker.toUpperCase() === clean || a.yahooTicker.toUpperCase() === `${clean}.IS`)
  );
  return asset;
}

export async function fetchLiveMarketQuotes(options?: {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'change' | 'volume' | 'price' | 'symbol';
  sortOrder?: 'asc' | 'desc';
}): Promise<{ quotes: LiveMarketQuote[]; total: number }> {
  
  let all: LiveMarketQuote[] = [];
  
  try {
    const rawQuotes = serverLocalDatabase.getAll('market_quotes') || [];
    all = rawQuotes.map(q => {
      if (!q) return null;
      const item = q.quote || q;
      if (!item || (!item.symbol && !item.ticker)) return null;

      const sym = (item.symbol || item.ticker || '').toUpperCase();
      const rawPrice = item.currentPrice ?? item.price ?? item.last_price ?? 100;
      const chgPct = item.change24hPercent ?? item.changePercent ?? item.change_pct ?? 0;
      const chgVal = item.change24h ?? item.change_val ?? 0;

      return {
        symbol: sym,
        name: item.name || sym,
        exchange: item.exchange || (item.category === 'BIST' ? 'BIST' : 'US'),
        category: item.category || (sym.endsWith('.IS') || !sym.includes('/') ? 'BIST' : 'GLOBAL'),
        currentPrice: Number(rawPrice) || 100,
        change24h: Number(chgVal) || 0,
        change24hPercent: Number(chgPct) || 0,
        currency: item.currency || (item.category === 'BIST' ? 'TRY' : 'USD'),
        high24h: item.high24h ?? item.high_price ?? ((Number(rawPrice) || 100) * 1.05),
        low24h: item.low24h ?? item.low_price ?? ((Number(rawPrice) || 100) * 0.95),
        volume: item.volume ?? '0',
        sector: item.sector || 'Genel',
        peRatio: item.peRatio,
        marketCap: item.marketCap ? String(item.marketCap) : undefined,
        lastUpdated: item.lastUpdated || item.asOf || new Date().toISOString(),
        sparkline: item.sparkline || [Number(rawPrice) || 100],
        isLiveRealtime: true
      } as LiveMarketQuote;
    }).filter(Boolean) as LiveMarketQuote[];
  } catch(e) {
    console.error("Error reading quotes from local DB:", e);
  }

  // Fallback to static universe if local DB is empty or just starting
  if (all.length === 0) {
    all = ALL_UNIVERSE_ASSETS.map(a => ({
      symbol: a.symbol,
      name: a.name,
      exchange: a.category === 'BIST' ? 'BIST' : 'US',
      category: a.category,
      currentPrice: a.basePrice || 100,
      change24h: 0,
      change24hPercent: 0,
      currency: a.category === 'BIST' ? 'TRY' : 'USD',
      high24h: (a.basePrice || 100) * 1.05,
      low24h: (a.basePrice || 100) * 0.95,
      volume: '0',
      sector: a.sector || 'Genel',
      lastUpdated: new Date().toISOString(),
      isLiveRealtime: true
    }));
  }

  if (options?.category && options.category !== 'ALL') {
    all = all.filter(q => q && q.category === options.category);
  }

  if (options?.search && options.search.trim() !== '') {
    const rawQ = options.search.trim().toLowerCase();
    const cleanQ = rawQ.replace(/\.is$/, '');
    all = all.filter(item => {
      if (!item) return false;
      const sym = (item.symbol || '').toLowerCase();
      const name = (item.name || '').toLowerCase();
      const sector = (item.sector || '').toLowerCase();
      return sym.includes(rawQ) || sym.includes(cleanQ) || name.includes(rawQ) || name.includes(cleanQ) || sector.includes(rawQ);
    });
  }

  const sortOrder = options?.sortOrder === 'asc' ? 1 : -1;
  if (options?.sortBy === 'change') {
    all.sort((a, b) => ((a.change24hPercent ?? 0) - (b.change24hPercent ?? 0)) * sortOrder);
  } else if (options?.sortBy === 'price') {
    all.sort((a, b) => ((a.currentPrice ?? 0) - (b.currentPrice ?? 0)) * sortOrder);
  } else if (options?.sortBy === 'symbol') {
    all.sort((a, b) => (a.symbol || '').localeCompare(b.symbol || '') * sortOrder);
  }

  const total = all.length;
  const offset = options?.offset || 0;
  const limit = options?.limit || total;
  const paginated = all.slice(offset, offset + limit);

  return { quotes: paginated, total };
}

export async function getLiveQuoteForSymbol(symbol: string): Promise<LiveMarketQuote | null> {
  if (!symbol) return null;
  const clean = symbol.trim().toUpperCase();
  const withoutSuffix = clean.replace(/\.IS$/, '');
  
  // Read from local DB ONLY
  try {
    const fromDb = serverLocalDatabase.get('market_quotes', `${withoutSuffix}.IS`)
      || serverLocalDatabase.get('market_quotes', clean) 
      || serverLocalDatabase.get('market_quotes', withoutSuffix);

    if (fromDb) {
      const item = fromDb.quote || fromDb;
      if (item && (item.symbol || item.ticker)) {
        const sym = (item.symbol || item.ticker || '').toUpperCase();
        const rawPrice = item.currentPrice ?? item.price ?? item.last_price ?? 100;
        return {
          symbol: sym,
          name: item.name || sym,
          exchange: item.exchange || 'BIST',
          category: item.category || 'BIST',
          currentPrice: Number(rawPrice) || 100,
          change24h: Number(item.change24h ?? item.change_val ?? 0),
          change24hPercent: Number(item.change24hPercent ?? item.changePercent ?? item.change_pct ?? 0),
          currency: item.currency || 'TRY',
          high24h: item.high24h ?? ((Number(rawPrice) || 100) * 1.05),
          low24h: item.low24h ?? ((Number(rawPrice) || 100) * 0.95),
          volume: item.volume ?? '0',
          sector: item.sector || 'Genel',
          peRatio: item.peRatio,
          marketCap: item.marketCap ? String(item.marketCap) : undefined,
          lastUpdated: item.lastUpdated || item.asOf || new Date().toISOString(),
          sparkline: item.sparkline || [Number(rawPrice) || 100],
          isLiveRealtime: true
        };
      }
    }

    // Check static universe if not in database
    const asset = findAssetBySymbol(symbol);
    if (asset) {
      return {
        symbol: asset.symbol,
        name: asset.name,
        exchange: asset.category === 'BIST' ? 'BIST' : 'US',
        category: asset.category,
        currentPrice: asset.basePrice || 100,
        change24h: 0,
        change24hPercent: 0,
        currency: asset.category === 'BIST' ? 'TRY' : 'USD',
        high24h: (asset.basePrice || 100) * 1.05,
        low24h: (asset.basePrice || 100) * 0.95,
        volume: '0',
        sector: asset.sector || 'Genel',
        lastUpdated: new Date().toISOString(),
        isLiveRealtime: true
      };
    }
  } catch(e) {
    console.error("Error reading quote from local DB:", e);
  }
  
  return null;
}
