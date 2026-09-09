import { BaseFetcher } from './BaseFetcher';
import { EconomicIndicator } from './types';

/**
 * Frankfurter API Fetcher (frankfurter.app)
 * Açık kaynak, API anahtarı gerektirmeyen resmi döviz kuru sağlayıcısı
 */
export class FrankfurterFetcher implements BaseFetcher {
  readonly name = 'Frankfurter Exchange Rate Fetcher';
  readonly sourceApi = 'FRANKFURTER' as const;

  async fetchIndicators(): Promise<EconomicIndicator[]> {
    const now = new Date().toISOString();
    const currentPeriod = '2026-08';

    let usdTry = 38.65;
    let eurTry = 41.80;
    let eurUsd = 1.082;
    let isStale = false;

    try {
      const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=TRY,EUR', {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(4000)
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.rates?.TRY) {
          usdTry = Number(data.rates.TRY);
        }
        if (data?.rates?.EUR) {
          eurUsd = Number((1 / data.rates.EUR).toFixed(4));
          eurTry = Number((usdTry * (1 / data.rates.EUR)).toFixed(4));
        }
      }
    } catch (err) {
      console.warn('[FrankfurterFetcher] Canlı kur çekimi fallback veriye geçti:', err);
      isStale = true;
    }

    const indicators: EconomicIndicator[] = [
      {
        id: 'ind-tr-usd-try',
        indicator_code: 'TR_USDTRY',
        indicator_name: 'Dolar / Türk Lirası (USD/TRY)',
        region: 'TR',
        category: 'doviz',
        value: Number(usdTry.toFixed(2)),
        previous_value: 38.40,
        change_value: Number((usdTry - 38.40).toFixed(2)),
        change_pct: Number((((usdTry - 38.40) / 38.40) * 100).toFixed(2)),
        change_direction: usdTry >= 38.40 ? 'up' : 'down',
        unit: '₺',
        source_api: 'FRANKFURTER',
        fetched_at: now,
        period_date: currentPeriod,
        is_stale: isStale,
        frequency: 'Gerçek Zamanlı',
        description: 'ABD Doları / Türk Lirası spot gösterge kuru.'
      },
      {
        id: 'ind-tr-eur-try',
        indicator_code: 'TR_EURTRY',
        indicator_name: 'Euro / Türk Lirası (EUR/TRY)',
        region: 'TR',
        category: 'doviz',
        value: Number(eurTry.toFixed(2)),
        previous_value: 41.50,
        change_value: Number((eurTry - 41.50).toFixed(2)),
        change_pct: Number((((eurTry - 41.50) / 41.50) * 100).toFixed(2)),
        change_direction: eurTry >= 41.50 ? 'up' : 'down',
        unit: '₺',
        source_api: 'FRANKFURTER',
        fetched_at: now,
        period_date: currentPeriod,
        is_stale: isStale,
        frequency: 'Gerçek Zamanlı',
        description: 'Euro / Türk Lirası spot gösterge kuru.'
      },
      {
        id: 'ind-global-eur-usd',
        indicator_code: 'GLOBAL_EURUSD',
        indicator_name: 'Euro / Dolar Paritesi (EUR/USD)',
        region: 'GLOBAL',
        category: 'doviz',
        value: Number(eurUsd.toFixed(4)),
        previous_value: 1.0850,
        change_value: Number((eurUsd - 1.0850).toFixed(4)),
        change_pct: Number((((eurUsd - 1.0850) / 1.0850) * 100).toFixed(2)),
        change_direction: eurUsd >= 1.0850 ? 'up' : 'down',
        unit: '$',
        source_api: 'FRANKFURTER',
        fetched_at: now,
        period_date: currentPeriod,
        is_stale: isStale,
        frequency: 'Gerçek Zamanlı',
        description: 'Küresel ana döviz paritesi (EUR/USD).'
      }
    ];

    return indicators;
  }
}
