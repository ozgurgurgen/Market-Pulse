/**
 * FUND SOURCE MANAGER & MACRO SOURCE MANAGER
 * MarketPulse AI — Anti-Corruption Layer (ACL)
 */

import { NormalizedFund, NormalizedIndicator } from '../types';
import { TefasScrapingAdapter } from '../adapters/TefasScrapingAdapter';
import { TcmbEvdsAdapter } from '../adapters/TcmbEvdsAdapter';
import { FredMacroAdapter, FrankfurterAdapter } from '../adapters/FredAndEcbAdapters';
import { localFinanceApi } from '../adapters/LocalFinanceApiAdapter';
import { databaseFirstCacheService } from '../../services/databaseFirstCacheService';

/**
 * 1. FUND SOURCE MANAGER (Veritabanı Öncelikli Read-Through DB Cache)
 */
export class FundSourceManager {
  private static tefasAdapter = new TefasScrapingAdapter();

  public static async getFund(code: string): Promise<NormalizedFund> {
    const cleanCode = code.trim().toUpperCase();
    return databaseFirstCacheService.getOrFetchApiData<NormalizedFund>(
      `tefas:fund:${cleanCode}`,
      {
        category: 'TEFAS_FUND',
        symbol: cleanCode,
        ttlMinutes: 240, // Fon fiyatları günde 1 kez güncellenir (4 saat DB önbellek)
        sourceApi: 'tefas',
        fetcher: async () => {
          return this.tefasAdapter.fetch({ code: cleanCode });
        }
      }
    );
  }

  public static async getAllFunds(): Promise<NormalizedFund[]> {
    return databaseFirstCacheService.getOrFetchApiData<NormalizedFund[]>(
      'tefas:all_funds_catalog',
      {
        category: 'TEFAS_CATALOG',
        ttlMinutes: 180, // 3 saat DB önbellek
        sourceApi: 'local_finance_api',
        fetcher: async () => {
          if (localFinanceApi.isConfigured()) {
            const liveFunds = await localFinanceApi.getFunds(2000);
            if (Array.isArray(liveFunds) && liveFunds.length > 0) {
              return liveFunds.map((f: any) => ({
                code: f.code || f.fund_code || '',
                name: f.title || f.name || f.code || '',
                founder: f.founder || 'Portföy Yönetimi',
                category: f.fund_type === 'Hisse' ? 'HISSE_YOGUN' : 'DEGISKEN',
                categoryLabel: f.fund_type || 'Yatırım Fonu',
                price: Number(f.current_price || f.price) || 0,
                currency: 'TRY',
                riskScore: Number(f.risk_score || f.riskScore) || 5,
                horizon: 'MEDIUM',
                return1Y: Number(f.return_1y || f.return1Y) || 0,
                return3Y: Number(f.return_3y || f.return3Y) || 0,
                return5Y: Number(f.return_5y || f.return5Y) || 0,
                sharpeRatio: Number(f.sharpe_ratio || f.sharpeRatio) || 1.8,
                inflationBeat1Y: Number(f.inflationBeat1Y) || 0,
                withholdingTax: 0,
                fundSizeFormatted: f.portfolio_size ? `${(Number(f.portfolio_size) / 1000000).toFixed(1)} M ₺` : '0 ₺',
                investorCount: Number(f.investor_count) || 0,
                topHoldings: [],
                aiVerdict: 'DENGELİ BİRİKİM',
                asOf: new Date().toISOString(),
                sourceName: 'local_finance_api',
                isStale: false,
                validation: { isValid: true, validationErrors: [], sanitized: true }
              }));
            }
          }
          return [];
        }
      }
    );
  }

  public static async healthCheck() {
    return this.tefasAdapter.healthCheck();
  }
}

/**
 * 2. MACRO SOURCE MANAGER (Veritabanı Öncelikli Read-Through DB Cache)
 */
export class MacroSourceManager {
  private static tcmbAdapter = new TcmbEvdsAdapter();
  private static fredAdapter = new FredMacroAdapter();
  private static frankfurterAdapter = new FrankfurterAdapter();

  public static async getAllIndicators(): Promise<NormalizedIndicator[]> {
    return databaseFirstCacheService.getOrFetchApiData<NormalizedIndicator[]>(
      'macro:all_normalized_indicators',
      {
        category: 'MACRO_INDICATORS',
        ttlMinutes: 360, // Makro veriler haftalık/aylık açıklanır (6 saat DB önbellek)
        sourceApi: 'tcmb_evds_fred',
        fetcher: async () => {
          const [tcmb, fred, frankfurter] = await Promise.allSettled([
            this.tcmbAdapter.fetch(),
            this.fredAdapter.fetch(),
            this.frankfurterAdapter.fetch()
          ]);

          const indicators: NormalizedIndicator[] = [];

          if (tcmb.status === 'fulfilled') indicators.push(...tcmb.value);
          if (fred.status === 'fulfilled') indicators.push(...fred.value);
          if (frankfurter.status === 'fulfilled') indicators.push(...frankfurter.value);

          return indicators;
        }
      }
    );
  }

  public static async healthCheckAll() {
    const [tcmb, fred, frankfurter] = await Promise.all([
      this.tcmbAdapter.healthCheck(),
      this.fredAdapter.healthCheck(),
      this.frankfurterAdapter.healthCheck()
    ]);

    return {
      tcmb,
      fred,
      frankfurter
    };
  }
}
