import { BaseFetcher } from './BaseFetcher';
import { EconomicIndicator } from './types';

/**
 * ECB (European Central Bank) Statistical Data Warehouse Fetcher
 * Avrupa Merkez Bankası Faiz ve Eurozone Enflasyon Göstergeleri
 */
export class EcbFetcher implements BaseFetcher {
  readonly name = 'ECB Data Fetcher';
  readonly sourceApi = 'ECB' as const;

  async fetchIndicators(): Promise<EconomicIndicator[]> {
    const now = new Date().toISOString();
    const currentPeriod = now.substring(0, 7);

    const fallbackIndicators: EconomicIndicator[] = [
      {
        id: 'ind-eu-ecb-rate',
        indicator_code: 'EU_ECB_RATE',
        indicator_name: 'Avrupa Merkez Bankası (ECB) Mevduat Kolaylığı Faizi',
        region: 'EU',
        category: 'faiz',
        value: 3.25,
        previous_value: 3.50,
        change_value: -0.25,
        change_pct: -7.14,
        change_direction: 'down',
        unit: '%',
        source_api: 'ECB',
        fetched_at: now,
        period_date: currentPeriod,
        is_stale: true,
        frequency: 'Aylık',
        description: 'Euro Bölgesi resmi merkez bankası mevduat faiz oranı.'
      },
      {
        id: 'ind-eu-cpi-yoy',
        indicator_code: 'EU_CPI_YOY',
        indicator_name: 'Euro Bölgesi Uyumlaştırılmış TÜFE (HICP)',
        region: 'EU',
        category: 'enflasyon',
        value: 2.2,
        previous_value: 2.4,
        change_value: -0.2,
        change_pct: -8.33,
        change_direction: 'down',
        unit: '%',
        source_api: 'ECB',
        fetched_at: now,
        period_date: currentPeriod,
        is_stale: true,
        frequency: 'Aylık',
        description: 'Eurostat Euro Bölgesi yıllık tüketici enflasyonu.'
      }
    ];

    try {
      // ECB Data Portal (SDMX 2.1 API)
      // ECB Deposit Facility Rate (DFR)
      // Identifier: FM.D.U2.EUR.4F.KR.DFR.CHG
      const url = `https://data-api.ecb.europa.eu/service/data/FM/D.U2.EUR.4F.KR.DFR.CHG?lastNObservations=2&format=jsondata`;
      
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      
      if (!res.ok) {
         console.warn(`[ECB] API çağrısı başarısız (${res.status}). Fallback kullanılıyor.`);
         return fallbackIndicators;
      }

      const data = await res.json();
      
      // Parse SDMX JSON-stat (ECB specific format)
      // Data is usually in data.dataSets[0].series['0:0:0:0:0:0:0'].observations
      // It's a bit complex, so we will try a safe extraction
      const seriesObj = data.dataSets?.[0]?.series;
      if (!seriesObj) throw new Error("Invalid ECB SDMX data format");
      
      const seriesKey = Object.keys(seriesObj)[0];
      const observations = seriesObj[seriesKey]?.observations;
      
      if (observations) {
        // Observers are keyed by index: "0": [val], "1": [val]
        const keys = Object.keys(observations).sort((a, b) => parseInt(a) - parseInt(b));
        if (keys.length >= 2) {
           const prevIdx = keys[keys.length - 2];
           const currIdx = keys[keys.length - 1];
           
           const val = observations[currIdx][0];
           const prevVal = observations[prevIdx][0];
           
           const changeVal = val - prevVal;
           const changePct = prevVal !== 0 ? (changeVal / prevVal) * 100 : 0;
           
           fallbackIndicators[0] = {
              ...fallbackIndicators[0],
              value: Number(val.toFixed(2)),
              previous_value: Number(prevVal.toFixed(2)),
              change_value: Number(changeVal.toFixed(2)),
              change_pct: Number(changePct.toFixed(2)),
              change_direction: changeVal > 0 ? 'up' : changeVal < 0 ? 'down' : 'neutral',
              is_stale: false
           };
        }
      }
      
      return fallbackIndicators;
    } catch (e) {
      console.warn('[ECB] Hata oluştu, statik (fallback) veriler kullanılıyor.', e);
      return fallbackIndicators;
    }
  }
}
