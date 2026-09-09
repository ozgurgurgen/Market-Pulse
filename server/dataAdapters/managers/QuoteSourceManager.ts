/**
 * QUOTE SOURCE MANAGER (CENTRAL ACL ORCHESTRATOR)
 * MarketPulse AI — Anti-Corruption Layer (ACL)
 * 
 * Tüm fiyat sorgularını tek bir sözleşme (NormalizedQuote) üzerinden yönetir.
 * Yahoo Finance, Binance ve Yerel Fallback zincirlerini koordine eder.
 * Hiçbir zaman geçersiz, negatif veya bozuk veri üretmez.
 */

import { NormalizedQuote, AssetCategory } from '../types';
import { YahooFinanceAdapter } from '../adapters/YahooFinanceAdapter';
import { BinanceCryptoAdapter } from '../adapters/BinanceCryptoAdapter';
import { SanityChecker } from '../base/SanityChecker';
import { databaseFirstCacheService } from '../../services/databaseFirstCacheService';

export class QuoteSourceManager {
  private static yahooAdapter = new YahooFinanceAdapter();
  private static binanceAdapter = new BinanceCryptoAdapter();

  // In-memory Sparkline History Ring Buffer (12 ticks)
  private static sparklineHistory = new Map<string, number[]>();

  public static recordPriceTick(symbol: string, price: number): number[] {
    const s = symbol.toUpperCase();
    if (price <= 0 || isNaN(price)) {
      return this.sparklineHistory.get(s) || [];
    }

    let hist = this.sparklineHistory.get(s);
    if (!hist) {
      hist = [];
      this.sparklineHistory.set(s, hist);
    }

    hist.push(price);
    if (hist.length > 12) {
      hist.shift();
    }
    return [...hist];
  }

  /**
   * Tekil Fiyat Getirme (Veritabanı Öncelikli Read-Through DB Cache)
   */
  public static async getQuote(symbol: string, fallbackPrice?: number, categoryHint?: AssetCategory): Promise<NormalizedQuote> {
    const upper = symbol.trim().toUpperCase();

    // 0. VERİTABANI ÖNCELİKLİ OKUMA:
    // Eğer veritabanında (PostgreSQL veya LocalDB) mevcutsa ve süresi dolmamışsa,
    // ASLA dış API çağrısı yapılmaz, doğrudan DB'den okunur!
    const dbCachedQuote = await databaseFirstCacheService.getQuoteOrFetch(
      upper,
      fallbackPrice,
      categoryHint,
      async () => {
        // Yalnızca veritabanında yoksa veya süresi dolmuşsa burası çalışır:
        // 1. Kripto varlık ise Binance Adaptörünü önceliklendir
        if (categoryHint === 'CRYPTO' || upper.includes('BTC') || upper.includes('ETH') || upper.includes('SOL') || upper.includes('AVAX')) {
          try {
            const binanceQuote = await this.binanceAdapter.fetch({ symbol: upper, fallbackPrice });
            if (binanceQuote.price > 0 && !binanceQuote.isStale) {
              binanceQuote.sparkline = this.recordPriceTick(binanceQuote.symbol, binanceQuote.price);
              return binanceQuote;
            }
          } catch {
            // Fallback to Yahoo
          }
        }

        // 2. BIST, US, Emtia veya Genel Varlıklar için Yahoo Finance Adaptörü
        try {
          const yahooQuote = await this.yahooAdapter.fetch({
            ticker: upper.endsWith('.IS') || categoryHint === 'BIST' ? (upper.endsWith('.IS') ? upper : `${upper}.IS`) : upper,
            fallbackPrice,
            category: categoryHint as any
          });

          yahooQuote.sparkline = this.recordPriceTick(yahooQuote.symbol, yahooQuote.price);
          return yahooQuote;
        } catch (err) {
          // 3. Güvenli Fallback
          const fallback: Partial<NormalizedQuote> = {
            symbol: upper.replace('.IS', ''),
            rawSymbol: upper,
            name: upper,
            category: categoryHint || (upper.endsWith('.IS') ? 'BIST' : 'US_STOCKS'),
            price: fallbackPrice || 100,
            currency: categoryHint === 'BIST' || upper.endsWith('.IS') ? 'TRY' : 'USD',
            change24h: 0,
            changePercent: 0,
            sourceName: 'fallback_manager',
            isStale: true
          };
          const { sanitized } = SanityChecker.validateQuote(fallback, fallbackPrice);
          sanitized.sparkline = this.recordPriceTick(sanitized.symbol, sanitized.price);
          return sanitized;
        }
      }
    );

    if (dbCachedQuote) {
      return dbCachedQuote;
    }

    // Nihai güvenlik fallback'i
    const safeFallback: Partial<NormalizedQuote> = {
      symbol: upper.replace('.IS', ''),
      rawSymbol: upper,
      name: upper,
      category: categoryHint || 'BIST',
      price: fallbackPrice || 100,
      currency: categoryHint === 'BIST' ? 'TRY' : 'USD',
      change24h: 0,
      changePercent: 0,
      sourceName: 'fallback_manager',
      isStale: true
    };
    const { sanitized } = SanityChecker.validateQuote(safeFallback, fallbackPrice);
    return sanitized;
  }

  /**
   * Toplu Fiyat Getirme (Batch Processing with Concurrency)
   */
  public static async getQuotesBatch(symbols: { symbol: string; fallbackPrice?: number; category?: AssetCategory }[]): Promise<NormalizedQuote[]> {
    const results: NormalizedQuote[] = [];
    const BATCH_SIZE = 10;

    for (let i = 0; i < symbols.length; i += BATCH_SIZE) {
      const chunk = symbols.slice(i, i + BATCH_SIZE);
      const promises = chunk.map(item => this.getQuote(item.symbol, item.fallbackPrice, item.category));
      const chunkResults = await Promise.allSettled(promises);

      for (let j = 0; j < chunkResults.length; j++) {
        const res = chunkResults[j];
        if (res.status === 'fulfilled') {
          results.push(res.value);
        } else {
          const item = chunk[j];
          const fallback = SanityChecker.validateQuote({
            symbol: item.symbol,
            rawSymbol: item.symbol,
            price: item.fallbackPrice || 100,
            currency: item.category === 'BIST' ? 'TRY' : 'USD',
            category: item.category || 'BIST',
            isStale: true,
            sourceName: 'batch_fallback'
          }, item.fallbackPrice).sanitized;
          results.push(fallback);
        }
      }
    }

    return results;
  }

  /**
   * Tüm adaptörlerin sağlık durumunu sorgula
   */
  public static async healthCheckAll() {
    const yahooHealth = await this.yahooAdapter.healthCheck();
    const binanceHealth = await this.binanceAdapter.healthCheck();
    return {
      yahoo: yahooHealth,
      binance: binanceHealth
    };
  }
}
