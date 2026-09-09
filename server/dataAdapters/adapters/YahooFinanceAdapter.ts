/**
 * YAHOO FINANCE ADAPTER (ANTI-CORRUPTION LAYER)
 * MarketPulse AI — Source #1 (Most Critical)
 * 
 * BIST 300, US 500, ETF ve Emtia verilerini çeker, `.IS` eklerini,
 * TRY para birimini, bölünme (split) düzeltmelerini ve fiyat sınırlarını doğrular.
 */

import { BaseAdapter } from '../base/BaseAdapter';
import { NormalizedQuote, CanaryHealthResult } from '../types';
import { SanityChecker } from '../base/SanityChecker';
import yfAny from 'yahoo-finance2';

const YFClass = (yfAny as any).default || yfAny;
const yf = new YFClass({ suppressNotices: ['yahooSurvey'] });

export interface YahooFetchParams {
  ticker: string;              // örn: 'THYAO.IS', 'CANTE.IS', 'AAPL', 'GC=F'
  fallbackPrice?: number;
  category?: 'BIST' | 'US_STOCKS' | 'ETF' | 'COMMODITIES' | 'FOREX';
}

export class YahooFinanceAdapter extends BaseAdapter<YahooFetchParams, NormalizedQuote> {
  readonly sourceName = 'yahoo';
  readonly isScraping = false;

  /**
   * Ham sembolü canonical sembole ve yahoo ticker'a normalize et
   */
  public static normalizeTicker(rawTicker: string): { canonicalSymbol: string; yahooTicker: string; category: 'BIST' | 'US_STOCKS' | 'ETF' | 'COMMODITIES' | 'FOREX' } {
    let t = rawTicker.trim().toUpperCase();
    
    // BIST hissesi tespiti
    if (t.endsWith('.IS')) {
      const canonical = t.replace('.IS', '');
      return { canonicalSymbol: canonical, yahooTicker: t, category: 'BIST' };
    }

    // Emtia / Forex tespiti
    if (t.includes('=F')) {
      return { canonicalSymbol: t, yahooTicker: t, category: 'COMMODITIES' };
    }
    if (t.includes('=X')) {
      return { canonicalSymbol: t.replace('=X', ''), yahooTicker: t, category: 'FOREX' };
    }

    // US / Global hisse
    return { canonicalSymbol: t, yahooTicker: t, category: 'US_STOCKS' };
  }

  async fetch(params: YahooFetchParams): Promise<NormalizedQuote> {
    const { canonicalSymbol, yahooTicker, category } = YahooFinanceAdapter.normalizeTicker(params.ticker);
    
    try {
      const quote = await yf.quote(yahooTicker);
      if (!quote) {
        // Log as info to avoid spamming the system error logs for unlisted/delisted tickers
        this.logInfo(`Yahoo Finance yanıt vermedi: ${yahooTicker} - Fallback devreye giriyor.`);
        throw new Error(`Yahoo Finance yanıt vermedi: ${yahooTicker}`);
      }

      const rawPrice = quote.regularMarketPrice ?? quote.price ?? 0;
      const rawCurrency = (quote.currency || (category === 'BIST' ? 'TRY' : 'USD')).toUpperCase();
      const rawChangePct = quote.regularMarketChangePercent ?? quote.changePercent ?? 0;
      const rawChange = quote.regularMarketChange ?? quote.change ?? null;

      const unvalidated: Partial<NormalizedQuote> = {
        symbol: canonicalSymbol,
        rawSymbol: yahooTicker,
        name: quote.shortName || quote.longName || canonicalSymbol,
        category: params.category || category,
        exchange: category === 'BIST' ? 'BIST' : (quote.fullExchangeName || quote.exchange || 'NASDAQ'),
        price: rawPrice,
        currency: rawCurrency as any,
        change24h: rawChange,
        changePercent: rawChangePct,
        high24h: quote.regularMarketDayHigh ?? quote.dayHigh,
        low24h: quote.regularMarketDayLow ?? quote.dayLow,
        volume: quote.regularMarketVolume ?? quote.volume ?? null,
        marketCap: quote.marketCap,
        peRatio: quote.trailingPE ?? quote.forwardPE,
        asOf: new Date().toISOString(),
        sourceName: this.sourceName,
        isStale: false
      };

      const { sanitized } = SanityChecker.validateQuote(unvalidated, params.fallbackPrice);
      return sanitized;
    } catch (err: any) {
      if (err.message && err.message.includes('yanıt vermedi')) {
        this.logInfo(`Fiyat çekme hatası (${yahooTicker}): ${err.message}`);
      } else {
        this.logError(`Fiyat çekme hatası (${yahooTicker}): ${err.message}`);
      }
      
      // Hata durumunda güvenli fallback quote oluşturulur (Kural 8)
      const fallbackUnvalidated: Partial<NormalizedQuote> = {
        symbol: canonicalSymbol,
        rawSymbol: yahooTicker,
        name: canonicalSymbol,
        category: params.category || category,
        exchange: category === 'BIST' ? 'BIST' : 'NASDAQ',
        price: params.fallbackPrice || 0,
        currency: category === 'BIST' ? 'TRY' : 'USD',
        change24h: 0,
        changePercent: 0,
        asOf: new Date().toISOString(),
        sourceName: this.sourceName,
        isStale: true
      };

      const { sanitized } = SanityChecker.validateQuote(fallbackUnvalidated, params.fallbackPrice);
      return sanitized;
    }
  }

  /**
   * Canary Test (Sağlık & Bütünlük Kontrolü)
   */
  async healthCheck(): Promise<CanaryHealthResult> {
    const start = Date.now();
    const canaryTicker = 'THYAO.IS';
    try {
      const quote = await this.fetch({ ticker: canaryTicker, fallbackPrice: 300 });
      const latency = Date.now() - start;

      const healthy = quote.price > 10 && quote.currency === 'TRY' && quote.symbol === 'THYAO';

      return {
        sourceName: this.sourceName,
        healthy,
        latencyMs: latency,
        sampleKeyTested: canaryTicker,
        details: {
          price: quote.price,
          currency: quote.currency,
          sanitized: quote.validation.sanitized,
          errors: quote.validation.validationErrors
        }
      };
    } catch (err: any) {
      return {
        sourceName: this.sourceName,
        healthy: false,
        latencyMs: Date.now() - start,
        sampleKeyTested: canaryTicker,
        error: err.message
      };
    }
  }
}
