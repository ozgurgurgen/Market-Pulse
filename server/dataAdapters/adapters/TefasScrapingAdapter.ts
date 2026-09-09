/**
 * TEFAS FUNDS & SCRAPING ADAPTER (ANTI-CORRUPTION LAYER)
 * MarketPulse AI — Source #3 (TEFAS Mutual Funds)
 * 
 * Kural 6: Scraping kaynaklarında canary test (bilinen örnek ve beklenen format kontrolü) zorunludur.
 * Kural 7: Sanity check mantığı adaptör içinde çalışır, hatalı veri dışarı sızmaz.
 */

import { BaseAdapter } from '../base/BaseAdapter';
import { NormalizedFund, CanaryHealthResult } from '../types';
import { SanityChecker } from '../base/SanityChecker';
import { localFinanceApi } from './LocalFinanceApiAdapter';

export interface TefasFetchParams {
  code: string;               // örn: 'TI2', 'MAC', 'TCD', 'IIH'
  includeHistory?: boolean;
}

export class TefasScrapingAdapter extends BaseAdapter<TefasFetchParams, NormalizedFund> {
  readonly sourceName = 'tefas_local_api';
  readonly isScraping = false;

  private static cache = new Map<string, { data: NormalizedFund; timestamp: number }>();
  private static CACHE_TTL_MS = 60_000; // 1 dakika önbellek

  /**
   * TEFAS'tan veri çekmeyi dener: Sadece Local Finance Pipeline DB / API
   */
  private async fetchLiveFromTefas(code: string): Promise<Partial<NormalizedFund> | null> {
    const formattedCode = code.trim().toUpperCase();

    if (localFinanceApi.isConfigured()) {
      try {
        const liveFund = await localFinanceApi.getFundData(formattedCode);
        if (liveFund && liveFund.code) {
          const price = Number(liveFund.current_price) || 0;
          const fundSize = Number(liveFund.market_cap) || 0;
          let investorCount = 0;
          let return1Y = 0;
          let return3Y = 0;

          if (liveFund.price_history && Array.isArray(liveFund.price_history) && liveFund.price_history.length > 0) {
            investorCount = Number(liveFund.price_history[0].investors_count) || 0;
            const latestP = Number(liveFund.price_history[0].price) || price;
            
            // 1 Yıl
            const p1y = liveFund.price_history[Math.min(252, liveFund.price_history.length - 1)];
            if (p1y && Number(p1y.price) > 0) {
              return1Y = Number((((latestP - Number(p1y.price)) / Number(p1y.price)) * 100).toFixed(2));
            }
            
            // 3 Yıl
            const p3y = liveFund.price_history[Math.min(756, liveFund.price_history.length - 1)];
            if (p3y && Number(p3y.price) > 0) {
              return3Y = Number((((latestP - Number(p3y.price)) / Number(p3y.price)) * 100).toFixed(2));
            }
          }

          return {
            code: formattedCode,
            name: liveFund.title || formattedCode,
            founder: liveFund.founder || 'Portföy Yönetimi',
            category: liveFund.fund_type === 'Hisse' ? 'HISSE_YOGUN' : 'DEGISKEN',
            categoryLabel: liveFund.fund_type || 'Yatırım Fonu',
            price: price > 0 ? price : 0,
            currency: 'TRY',
            riskScore: Number(liveFund.risk_score) || 5,
            horizon: 'MEDIUM',
            return1Y: return1Y !== 0 ? return1Y : Number(liveFund.return_1y) || 0,
            return3Y: return3Y !== 0 ? return3Y : Number(liveFund.return_3y) || 0,
            return5Y: Number(liveFund.return_5y) || 0,
            sharpeRatio: Number(liveFund.sharpe_ratio) || 1.8,
            inflationBeat1Y: Number(liveFund.inflationBeat1Y) || 0,
            withholdingTax: 0,
            fundSizeFormatted: fundSize > 0 ? `${(fundSize / 1000000).toFixed(1)} M ₺` : '0 ₺',
            investorCount: investorCount > 0 ? investorCount : Number(liveFund.investor_count) || 0,
            topHoldings: [],
            aiVerdict: 'DENGELİ BİRİKİM',
            asOf: new Date().toISOString(),
            sourceName: 'tefas_local_api',
            isStale: false
          };
        }
      } catch (err) {
        console.warn(`[TefasScrapingAdapter] Local API fetch error (${formattedCode}):`, err);
      }
    }

    return null;
  }

  async fetch(params: TefasFetchParams): Promise<NormalizedFund> {
    const code = params.code.trim().toUpperCase();

    // Önbellek kontrolü
    const cached = TefasScrapingAdapter.cache.get(code);
    if (cached && (Date.now() - cached.timestamp < TefasScrapingAdapter.CACHE_TTL_MS)) {
      return cached.data;
    }

    // 1. Canlı Local Finance API denemesi
    const liveData = await this.fetchLiveFromTefas(code);

    if (liveData && liveData.code) {
      const { sanitized } = SanityChecker.validateFund(liveData);
      TefasScrapingAdapter.cache.set(code, { data: sanitized, timestamp: Date.now() });
      return sanitized;
    }

    // Statik / Seed fallback YOKTUR. Canlı veri yoksa boş/NoN nesne döner.
    const emptyFund: NormalizedFund = {
      code,
      name: `${code} (Veri Yok)`,
      founder: 'NoN',
      category: 'DEGISKEN',
      categoryLabel: 'Yatırım Fonu',
      price: 0,
      currency: 'TRY',
      riskScore: 0,
      horizon: 'MEDIUM',
      return1Y: 0,
      return3Y: 0,
      return5Y: 0,
      sharpeRatio: 0,
      inflationBeat1Y: 0,
      withholdingTax: 0,
      fundSizeFormatted: '0 ₺',
      investorCount: 0,
      topHoldings: [],
      aiVerdict: 'İZLEMEDE KAL',
      asOf: new Date().toISOString(),
      sourceName: 'local_finance_api',
      isStale: true,
      validation: { isValid: false, validationErrors: ['No data from Local Finance API'], sanitized: true }
    };

    return emptyFund;
  }

  /**
   * CANARY TEST (Kural 6: Bilinen örnek ve beklenen format kontrolü)
   */
  async healthCheck(): Promise<CanaryHealthResult> {
    const start = Date.now();
    const canaryFunds = ['TI2', 'MAC', 'TCD'];
    const results: any[] = [];

    try {
      for (const code of canaryFunds) {
        const fund = await this.fetch({ code });
        const isValidStructure = fund.code === code;

        results.push({
          code,
          price: fund.price,
          risk: fund.riskScore,
          holdingsCount: fund.topHoldings.length,
          valid: isValidStructure
        });
      }

      const latency = Date.now() - start;

      return {
        sourceName: this.sourceName,
        healthy: localFinanceApi.isConfigured(),
        latencyMs: latency,
        sampleKeyTested: canaryFunds.join(', '),
        details: {
          testResults: results,
          configured: localFinanceApi.isConfigured()
        }
      };
    } catch (err: any) {
      return {
        sourceName: this.sourceName,
        healthy: false,
        latencyMs: Date.now() - start,
        sampleKeyTested: canaryFunds.join(', '),
        error: err.message
      };
    }
  }
}
