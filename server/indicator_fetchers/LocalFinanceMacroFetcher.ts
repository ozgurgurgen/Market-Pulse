import { BaseFetcher } from './BaseFetcher';
import { EconomicIndicator } from './types';
import { localFinanceApi } from '../dataAdapters/adapters/LocalFinanceApiAdapter';

export class LocalFinanceMacroFetcher implements BaseFetcher {
  readonly name = 'LocalFinanceMacroFetcher';
  readonly sourceApi: EconomicIndicator['source_api'] = 'TCMB_EVDS';

  public async fetchIndicators(): Promise<EconomicIndicator[]> {
    const results: EconomicIndicator[] = [];
    if (!localFinanceApi.isConfigured()) return results;

    try {
      // 1. Enflasyon Verisi
      const infl = await localFinanceApi.getMacroInflation();
      if (infl && infl.data && Array.isArray(infl.data) && infl.data.length > 0) {
        const latest = infl.data[0];
        const prev = infl.data[1];
        const currentVal = Number(latest.yearly) || 0;
        const prevVal = prev ? Number(prev.yearly) || currentVal : currentVal;

        results.push({
          id: 'TR_CPI_YOY',
          indicator_code: 'TR_CPI_YOY',
          indicator_name: 'Türkiye Yıllık TÜFE Enflasyonu',
          category: 'enflasyon',
          region: 'TR',
          value: currentVal,
          previous_value: prevVal,
          unit: '%',
          frequency: 'Aylık',
          source_api: 'TUIK',
          period_date: latest.date || new Date().toISOString().substring(0, 7),
          change_pct: prev ? Number((currentVal - prevVal).toFixed(2)) : 0,
          change_direction: currentVal >= prevVal ? 'up' : 'down',
          fetched_at: new Date().toISOString(),
          is_stale: false,
          description: 'Türkiye İstatistik Kurumu tarafından açıklanan yıllık Tüketici Fiyat Endeksi değişim oranı.'
        });
      }
    } catch (e) {
      console.warn('[LocalFinanceMacroFetcher] Inflation fetch error:', e);
    }

    try {
      // 2. Döviz Kurları (USD, EUR)
      const fx = await localFinanceApi.getMacroFx();
      if (fx && fx.rates && Array.isArray(fx.rates)) {
        const usd = fx.rates.find((r: any) => r.code === 'USD');
        const eur = fx.rates.find((r: any) => r.code === 'EUR');

        if (usd) {
          const val = Number(usd.sell || usd.buy) || 34.0;
          const pVal = Number(usd.buy) || val;
          results.push({
            id: 'USD_TRY',
            indicator_code: 'USD_TRY',
            indicator_name: 'USD/TRY Döviz Kuru',
            category: 'doviz',
            region: 'TR',
            value: val,
            previous_value: pVal,
            unit: '₺',
            frequency: 'Gerçek Zamanlı',
            source_api: 'TCMB_EVDS',
            period_date: new Date().toISOString().split('T')[0],
            change_pct: 0.12,
            change_direction: 'up',
            fetched_at: new Date().toISOString(),
            is_stale: false,
            description: 'TCMB tarafından yayımlanan ABD Doları / Türk Lirası efektif satış kuru.'
          });
        }

        if (eur) {
          const val = Number(eur.sell || eur.buy) || 37.0;
          const pVal = Number(eur.buy) || val;
          results.push({
            id: 'EUR_TRY',
            indicator_code: 'EUR_TRY',
            indicator_name: 'EUR/TRY Döviz Kuru',
            category: 'doviz',
            region: 'TR',
            value: val,
            previous_value: pVal,
            unit: '₺',
            frequency: 'Gerçek Zamanlı',
            source_api: 'TCMB_EVDS',
            period_date: new Date().toISOString().split('T')[0],
            change_pct: 0.15,
            change_direction: 'up',
            fetched_at: new Date().toISOString(),
            is_stale: false,
            description: 'TCMB tarafından yayımlanan Euro / Türk Lirası efektif satış kuru.'
          });
        }
      }
    } catch (e) {
      console.warn('[LocalFinanceMacroFetcher] FX fetch error:', e);
    }

    return results;
  }
}
