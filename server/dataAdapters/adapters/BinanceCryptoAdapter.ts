/**
 * BINANCE CRYPTO ADAPTER (ANTI-CORRUPTION LAYER)
 * MarketPulse AI — Source #2 (Crypto Assets)
 */

import { BaseAdapter } from '../base/BaseAdapter';
import { NormalizedQuote, CanaryHealthResult } from '../types';
import { SanityChecker } from '../base/SanityChecker';

export interface BinanceFetchParams {
  symbol: string;             // örn: 'BTC', 'ETH', 'SOL', 'AVAX'
  fallbackPrice?: number;
}

export class BinanceCryptoAdapter extends BaseAdapter<BinanceFetchParams, NormalizedQuote> {
  readonly sourceName = 'binance';
  readonly isScraping = false;

  private static symbolMapping: Record<string, string> = {
    'BTC': 'BTCUSDT',
    'ETH': 'ETHUSDT',
    'SOL': 'SOLUSDT',
    'AVAX': 'AVAXUSDT',
    'BNB': 'BNBUSDT',
    'XRP': 'XRPUSDT',
    'ADA': 'ADAUSDT',
    'DOT': 'DOTUSDT',
    'LINK': 'LINKUSDT',
    'NEAR': 'NEARUSDT'
  };

  async fetch(params: BinanceFetchParams): Promise<NormalizedQuote> {
    const rawCode = params.symbol.toUpperCase().replace('-USD', '').replace('USDT', '');
    const pair = BinanceCryptoAdapter.symbolMapping[rawCode] || `${rawCode}USDT`;

    try {
      const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${pair}`);
      if (!response.ok) {
        throw new Error(`Binance HTTP error: ${response.status}`);
      }

      const data = await response.json();
      const rawPrice = parseFloat(data.lastPrice);
      const rawChangePct = parseFloat(data.priceChangePercent);
      const rawChange = parseFloat(data.priceChange);
      const volume = parseFloat(data.volume);

      const unvalidated: Partial<NormalizedQuote> = {
        symbol: rawCode,
        rawSymbol: pair,
        name: `${rawCode} / USD Tether`,
        category: 'CRYPTO',
        exchange: 'BINANCE',
        price: rawPrice,
        currency: 'USD',
        change24h: rawChange,
        changePercent: rawChangePct,
        high24h: parseFloat(data.highPrice),
        low24h: parseFloat(data.lowPrice),
        volume: isNaN(volume) ? null : volume,
        asOf: new Date().toISOString(),
        sourceName: this.sourceName,
        isStale: false
      };

      const { sanitized } = SanityChecker.validateQuote(unvalidated, params.fallbackPrice);
      return sanitized;
    } catch (err: any) {
      this.logError(`Binance fiyat çekme hatası (${pair}): ${err.message}`);
      
      const fallbackUnvalidated: Partial<NormalizedQuote> = {
        symbol: rawCode,
        rawSymbol: pair,
        name: rawCode,
        category: 'CRYPTO',
        exchange: 'BINANCE',
        price: params.fallbackPrice || 0,
        currency: 'USD',
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

  async healthCheck(): Promise<CanaryHealthResult> {
    const start = Date.now();
    const canarySymbol = 'BTC';
    try {
      const quote = await this.fetch({ symbol: canarySymbol, fallbackPrice: 65000 });
      const latency = Date.now() - start;

      const healthy = quote.price > 1000 && quote.currency === 'USD' && quote.symbol === 'BTC';

      return {
        sourceName: this.sourceName,
        healthy,
        latencyMs: latency,
        sampleKeyTested: canarySymbol,
        details: {
          price: quote.price,
          currency: quote.currency,
          sanitized: quote.validation.sanitized
        }
      };
    } catch (err: any) {
      return {
        sourceName: this.sourceName,
        healthy: false,
        latencyMs: Date.now() - start,
        sampleKeyTested: canarySymbol,
        error: err.message
      };
    }
  }
}
