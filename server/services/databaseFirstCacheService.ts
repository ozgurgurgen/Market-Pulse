/**
 * DATABASE-FIRST READ-THROUGH API CACHE SERVICE
 * MarketPulse AI — Merkezi Veritabanı Öncelikli API Yönetim Katmanı
 * 
 * Amaç:
 * 1. Program tüm sorguları (hisseler, fonlar, makro veriler, finansal rasyolar) 
 *    ÖNCELİKLE veritabanından (PostgreSQL / Local DB) okur.
 * 2. Veritabanında veri mevcutsa ve geçerlilik süresi (TTL) dolmamışsa 
 *    DIŞ APİ ÇAĞRISI KESİNLİKLE YAPILMAZ.
 * 3. Veritabanında olmayan veya süresi dolmuş bilgi için API çağrısı yapılır,
 *    gelen sonuç anında veritabanına yazılır ve program veriyi veritabanından teslim alır.
 * 4. Bu sayede tüm kullanıcılar ortak veritabanı havuzundan beslenir, API kotaları tükenmez.
 */

import { getPostgresClient, getDatabaseIntegrationSettings } from './dbIntegrationService';
import { serverLocalDatabase } from './serverLocalDatabase';
import { NormalizedQuote, AssetCategory } from '../dataAdapters/types';

export interface DatabaseCacheMetrics {
  totalCachedQuotes: number;
  totalCachedApiKeys: number;
  totalHits: number;
  totalMisses: number;
  savingsRatioPercent: number;
  lastWriteTimestamp?: string;
  activeStorage: 'PostgreSQL' | 'LocalDB' | 'Hybrid';
}

class DatabaseFirstCacheService {
  private totalHits = 0;
  private totalMisses = 0;
  private lastWriteTimestamp = new Date().toISOString();

  // Seans Saatlerine Göre Dinamik TTL (Dakika)
  private calculateQuoteTtlMinutes(category?: string): number {
    const now = new Date();
    const day = now.getUTCDay(); // 0 = Pazar, 6 = Cumartesi
    const trHour = (now.getUTCHours() + 3) % 24;

    const isWeekend = day === 0 || day === 6;
    const isBistSession = !isWeekend && trHour >= 10 && trHour < 18;

    if (category === 'CRYPTO') {
      return 2; // Kripto 7/24 aktif: 2 dakika
    }

    if (category === 'BIST') {
      return isBistSession ? 5 : 240; // Seans sırasında 5 dk, seans kapalı/hafta sonu 4 saat
    }

    if (category === 'US_STOCKS' || category === 'ETF') {
      const isUsSession = !isWeekend && (trHour >= 16 && trHour <= 23);
      return isUsSession ? 5 : 240;
    }

    return 30; // Döviz ve Emtia için 30 dakika
  }

  /**
   * 1. MARKET QUOTE - VERİTABANI ÖNCELİKLİ OKUMA
   * Veritabanında varsa DB'den döner, yoksa API'den çeker, DB'ye yazar ve döner.
   */
  public async getQuoteOrFetch(
    symbol: string,
    fallbackPrice?: number,
    categoryHint?: AssetCategory,
    apiFetcher?: () => Promise<NormalizedQuote>
  ): Promise<NormalizedQuote | null> {
    const sym = symbol.trim().toUpperCase();
    const now = Date.now();

    // 1. Önce PostgreSQL'i kontrol et
    let pgClient: any = null;
    try {
      const settings = await getDatabaseIntegrationSettings();
      if (settings.activeProvider === 'postgresql' || settings.activeProvider === 'hybrid') {
        pgClient = await getPostgresClient();
        const res = await pgClient.query(`
          SELECT * FROM market_quotes 
          WHERE symbol = $1 AND expires_at > CURRENT_TIMESTAMP;
        `, [sym]);

        if (res.rows && res.rows.length > 0) {
          const row = res.rows[0];
          await pgClient.end();
          pgClient = null;

          this.totalHits++;
          // Veritabanından okunan veriyi NormalizedQuote sözleşmesine çevir
          const raw = row.raw_data || {};
          const cat = (row.category || categoryHint || 'BIST') as AssetCategory;
          return {
            symbol: row.symbol,
            rawSymbol: raw.rawSymbol || row.symbol,
            name: row.name || raw.name || row.symbol,
            category: cat,
            exchange: raw.exchange || (cat === 'BIST' ? 'BIST' : 'US'),
            price: Number(row.current_price) || fallbackPrice || 0,
            currency: row.currency || 'TRY',
            change24h: Number(row.change_24h) || 0,
            changePercent: Number(row.change_percent) || 0,
            high24h: row.high_24h ? Number(row.high_24h) : undefined,
            low24h: row.low_24h ? Number(row.low_24h) : undefined,
            volume: row.volume || null,
            sparkline: row.sparkline || undefined,
            peRatio: row.pe_ratio ? Number(row.pe_ratio) : undefined,
            marketCap: row.market_cap || undefined,
            asOf: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
            sourceName: 'postgres_db_cache',
            isStale: false,
            validation: {
              isValid: true,
              validationErrors: [],
              sanitized: true
            }
          };
        }
      }
    } catch (pgReadErr: any) {
      if (pgClient) {
        try { await pgClient.end(); } catch {}
        pgClient = null;
      }
    }

    // 2. PostgreSQL'de yoksa veya bağlı değilse, Yerel Veritabanına (LocalDB) bak
    const localEntry = serverLocalDatabase.get<any>('market_quotes', sym);
    if (localEntry && localEntry.expiresAt && localEntry.expiresAt > now) {
      this.totalHits++;
      return localEntry.quote as NormalizedQuote;
    }

    // 3. Veritabanında YOK veya süresi dolmuş! Dış API çağrısı yap
    this.totalMisses++;
    if (!apiFetcher) {
      return null;
    }

    try {
      const liveQuote = await apiFetcher();
      if (liveQuote && liveQuote.price > 0) {
        // 4. API'den gelen veriyi HEMEN Veritabanına kaydet (Write-Through)
        await this.saveQuoteToDatabase(sym, liveQuote, categoryHint);
        return liveQuote;
      }
    } catch (fetchErr: any) {
      console.warn(`[DB-First Cache] External API fetch failed for ${sym}:`, fetchErr?.message);
    }

    // Son çare: Süresi dolmuş da olsa yerel DB'deki son veriyi fallback olarak dön
    if (localEntry?.quote) {
      return { ...localEntry.quote, isStale: true, sourceName: 'stale_db_cache' };
    }

    return null;
  }

  /**
   * Gelen Fiyatı PostgreSQL ve Yerel DB'ye yaz
   */
  public async saveQuoteToDatabase(symbol: string, quote: NormalizedQuote, categoryHint?: AssetCategory): Promise<void> {
    const sym = symbol.trim().toUpperCase();
    const ttlMinutes = this.calculateQuoteTtlMinutes(quote.category || categoryHint);
    const expiresAtMs = Date.now() + ttlMinutes * 60 * 1000;
    const expiresAtIso = new Date(expiresAtMs).toISOString();
    const nowIso = new Date().toISOString();
    this.lastWriteTimestamp = nowIso;

    // 1. Yerel veritabanına yaz
    serverLocalDatabase.set('market_quotes', sym, {
      quote,
      expiresAt: expiresAtMs,
      updatedAt: nowIso
    });

    // 2. PostgreSQL'e yaz (UPSERT)
    let client: any = null;
    try {
      client = await getPostgresClient();
      await client.query(`
        INSERT INTO market_quotes (
          symbol, name, category, current_price, change_24h, change_percent,
          currency, high_24h, low_24h, volume, pe_ratio, market_cap,
          sparkline, raw_data, source_name, last_updated, expires_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        ON CONFLICT (symbol) DO UPDATE SET
          name = EXCLUDED.name,
          category = EXCLUDED.category,
          current_price = EXCLUDED.current_price,
          change_24h = EXCLUDED.change_24h,
          change_percent = EXCLUDED.change_percent,
          currency = EXCLUDED.currency,
          high_24h = EXCLUDED.high_24h,
          low_24h = EXCLUDED.low_24h,
          volume = EXCLUDED.volume,
          pe_ratio = EXCLUDED.pe_ratio,
          market_cap = EXCLUDED.market_cap,
          sparkline = EXCLUDED.sparkline,
          raw_data = EXCLUDED.raw_data,
          source_name = EXCLUDED.source_name,
          last_updated = EXCLUDED.last_updated,
          expires_at = EXCLUDED.expires_at;
      `, [
        sym,
        quote.name || sym,
        quote.category || categoryHint || 'BIST',
        quote.price,
        quote.change24h || 0,
        quote.changePercent || 0,
        quote.currency || 'TRY',
        quote.high24h || null,
        quote.low24h || null,
        quote.volume || null,
        quote.peRatio || null,
        quote.marketCap || null,
        JSON.stringify(quote.sparkline || []),
        JSON.stringify(quote),
        quote.sourceName || 'external_api',
        nowIso,
        expiresAtIso
      ]);
      await client.end();
    } catch (pgErr: any) {
      if (client) {
        try { await client.end(); } catch {}
      }
    }
  }

  /**
   * 2. GENEL APİ VERİLERİ (TEFAS, EVDS, FRED, KAP, FİNANSALLAR) İÇİN READ-THROUGH DB CACHE
   */
  public async getOrFetchApiData<T = any>(
    cacheKey: string,
    options: {
      category?: string;
      symbol?: string;
      ttlMinutes?: number;
      sourceApi?: string;
      fetcher: () => Promise<T>;
    }
  ): Promise<T> {
    const key = cacheKey.trim();
    const ttlMinutes = options.ttlMinutes || 60; // Varsayılan 1 saat
    const now = Date.now();

    // 1. PostgreSQL api_cache_store tablosunu kontrol et
    let pgClient: any = null;
    try {
      const settings = await getDatabaseIntegrationSettings();
      if (settings.activeProvider === 'postgresql' || settings.activeProvider === 'hybrid') {
        pgClient = await getPostgresClient();
        const res = await pgClient.query(`
          SELECT data, expires_at, hit_count 
          FROM api_cache_store 
          WHERE cache_key = $1 AND expires_at > CURRENT_TIMESTAMP;
        `, [key]);

        if (res.rows && res.rows.length > 0) {
          const row = res.rows[0];
          this.totalHits++;

          // Arka planda hit sayısını artır (fire and forget)
          pgClient.query(`UPDATE api_cache_store SET hit_count = hit_count + 1 WHERE cache_key = $1;`, [key])
            .finally(() => {
              try { pgClient?.end(); } catch {}
            });
          
          return (typeof row.data === 'string' ? JSON.parse(row.data) : row.data) as T;
        }
        await pgClient.end();
        pgClient = null;
      }
    } catch (pgErr: any) {
      if (pgClient) {
        try { await pgClient.end(); } catch {}
        pgClient = null;
      }
    }

    // 2. Yerel Veritabanına (LocalDB) bak
    const localEntry = serverLocalDatabase.get<any>('api_cache_store', key);
    if (localEntry && localEntry.expiresAt && localEntry.expiresAt > now) {
      this.totalHits++;
      return localEntry.data as T;
    }

    // 3. Veritabanında yok: Dış API'yi çağır
    this.totalMisses++;
    const freshData = await options.fetcher();

    // 4. Gelen veriyi hemen Veritabanına kaydet
    const expiresAtMs = now + ttlMinutes * 60 * 1000;
    const expiresAtIso = new Date(expiresAtMs).toISOString();
    const nowIso = new Date().toISOString();
    this.lastWriteTimestamp = nowIso;

    // Yerel DB'ye kaydet
    serverLocalDatabase.set('api_cache_store', key, {
      data: freshData,
      category: options.category || 'general',
      symbol: options.symbol || null,
      expiresAt: expiresAtMs,
      updatedAt: nowIso
    });

    // PostgreSQL'e kaydet (UPSERT)
    let writeClient: any = null;
    try {
      writeClient = await getPostgresClient();
      await writeClient.query(`
        INSERT INTO api_cache_store (
          cache_key, category, symbol, data, source_api, hit_count, created_at, updated_at, expires_at
        ) VALUES ($1, $2, $3, $4, $5, 1, $6, $6, $7)
        ON CONFLICT (cache_key) DO UPDATE SET
          data = EXCLUDED.data,
          source_api = EXCLUDED.source_api,
          updated_at = EXCLUDED.updated_at,
          expires_at = EXCLUDED.expires_at,
          hit_count = api_cache_store.hit_count + 1;
      `, [
        key,
        options.category || 'general',
        options.symbol || null,
        JSON.stringify(freshData),
        options.sourceApi || 'external_api',
        nowIso,
        expiresAtIso
      ]);
      await writeClient.end();
    } catch (writeErr: any) {
      if (writeClient) {
        try { await writeClient.end(); } catch {}
      }
    }

    return freshData;
  }

  /**
   * Veritabanı Önbellek İstatistiklerini Döndür
   */
  public async getMetrics(): Promise<DatabaseCacheMetrics> {
    let cachedQuotesCount = 0;
    let cachedApiKeysCount = 0;
    let storageType: 'PostgreSQL' | 'LocalDB' | 'Hybrid' = 'Hybrid';

    // PostgreSQL sayaçları
    let client: any = null;
    try {
      client = await getPostgresClient();
      const qRes = await client.query('SELECT count(*) as c FROM market_quotes;');
      const aRes = await client.query('SELECT count(*) as c FROM api_cache_store;');
      cachedQuotesCount = Number(qRes.rows[0]?.c) || 0;
      cachedApiKeysCount = Number(aRes.rows[0]?.c) || 0;
      await client.end();
      storageType = 'PostgreSQL';
    } catch {
      if (client) {
        try { await client.end(); } catch {}
      }
      const localQuotes = serverLocalDatabase.getAll('market_quotes') || [];
      const localApis = serverLocalDatabase.getAll('api_cache_store') || [];
      cachedQuotesCount = localQuotes.length;
      cachedApiKeysCount = localApis.length;
      storageType = 'LocalDB';
    }

    const totalRequests = this.totalHits + this.totalMisses;
    const savingsRatioPercent = totalRequests > 0 
      ? Number(((this.totalHits / totalRequests) * 100).toFixed(1))
      : 100;

    return {
      totalCachedQuotes: cachedQuotesCount,
      totalCachedApiKeys: cachedApiKeysCount,
      totalHits: this.totalHits,
      totalMisses: this.totalMisses,
      savingsRatioPercent,
      lastWriteTimestamp: this.lastWriteTimestamp,
      activeStorage: storageType
    };
  }

  /**
   * Belirli bir sembolü veya anahtarı veritabanı önbelleğinden temizle
   */
  public async evict(keyOrSymbol: string): Promise<boolean> {
    const s = keyOrSymbol.trim().toUpperCase();
    serverLocalDatabase.delete('market_quotes', s);
    serverLocalDatabase.delete('api_cache_store', keyOrSymbol);

    let client: any = null;
    try {
      client = await getPostgresClient();
      await client.query('DELETE FROM market_quotes WHERE symbol = $1;', [s]);
      await client.query('DELETE FROM api_cache_store WHERE cache_key = $1;', [keyOrSymbol]);
      await client.end();
      return true;
    } catch {
      if (client) {
        try { await client.end(); } catch {}
      }
      return true;
    }
  }
}

export const databaseFirstCacheService = new DatabaseFirstCacheService();
