import { BaseFetcher } from './BaseFetcher';
import { EconomicIndicator } from './types';

/**
 * FRED (Federal Reserve Economic Data) Fetcher
 * St. Louis Fed - ABD Faiz, Enflasyon, Tahvil Getiri Eğrisi ve İstihdam Göstergeleri
 */
export class FredFetcher implements BaseFetcher {
  readonly name = 'FRED Fetcher (St. Louis Fed)';
  readonly sourceApi = 'FRED' as const;

  private async fetchFredSeries(seriesId: string, apiKey: string, limit = 2): Promise<any[]> {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`FRED API error for ${seriesId}: ${res.statusText}`);
    const data = await res.json();
    return data.observations;
  }

  async fetchIndicators(): Promise<EconomicIndicator[]> {
    const now = new Date().toISOString();
    const currentPeriod = now.substring(0, 7); // e.g. "2026-08"

    const apiKey = process.env.FRED_API_KEY;

    // Fallback data if API key is not configured or API fails
    const fallbackIndicators: EconomicIndicator[] = [
      {
        id: 'ind-us-fed-funds-rate',
        indicator_code: 'US_FED_RATE',
        indicator_name: 'Federal Reserve Politika Faiz Oranı (Fed Funds)',
        region: 'US',
        category: 'faiz',
        value: 4.25,
        previous_value: 4.50,
        change_value: -0.25,
        change_pct: -5.56,
        change_direction: 'down',
        unit: '%',
        source_api: 'FRED',
        fetched_at: now,
        period_date: currentPeriod,
        is_stale: true,
        frequency: 'Aylık',
        description: 'Federal Açık Piyasa Komitesi (FOMC) üst bant hedef politika faizi.'
      },
      {
        id: 'ind-us-cpi-yoy',
        indicator_code: 'US_CPI_YOY',
        indicator_name: 'ABD TÜFE (CPI) Yıllık Enflasyon',
        region: 'US',
        category: 'enflasyon',
        value: 2.6,
        previous_value: 2.9,
        change_value: -0.3,
        change_pct: -10.34,
        change_direction: 'down',
        unit: '%',
        source_api: 'FRED',
        fetched_at: now,
        period_date: currentPeriod,
        is_stale: true,
        frequency: 'Aylık',
        description: 'ABD Manşet Tüketici Fiyat Endeksi yıllık artış oranı.'
      },
      {
        id: 'ind-us-10y-yield',
        indicator_code: 'US_10Y_YIELD',
        indicator_name: 'ABD 10 Yıllık Hazine Tahvil Getirisi',
        region: 'US',
        category: 'faiz',
        value: 4.18,
        previous_value: 4.35,
        change_value: -0.17,
        change_pct: -3.91,
        change_direction: 'down',
        unit: '%',
        source_api: 'FRED',
        fetched_at: now,
        period_date: currentPeriod,
        is_stale: true,
        frequency: 'Günlük',
        description: 'Küresel risksiz faiz göstergesi 10 Yıllık ABD Benchmark Hazine Bonosu.'
      },
      {
        id: 'ind-us-2y-yield',
        indicator_code: 'US_2Y_YIELD',
        indicator_name: 'ABD 2 Yıllık Hazine Tahvil Getirisi',
        region: 'US',
        category: 'faiz',
        value: 3.92,
        previous_value: 4.10,
        change_value: -0.18,
        change_pct: -4.39,
        change_direction: 'down',
        unit: '%',
        source_api: 'FRED',
        fetched_at: now,
        period_date: currentPeriod,
        is_stale: true,
        frequency: 'Günlük',
        description: 'Piyasanın kısa vadeli Fed faiz beklentilerini yansıtan 2 yıllık tahvil getirisi.'
      },
      {
        id: 'ind-us-yield-curve',
        indicator_code: 'US_YIELD_CURVE',
        indicator_name: 'ABD Tahvil Getiri Eğrisi Farkı (10Y - 2Y)',
        region: 'US',
        category: 'risk_istahi',
        value: 0.26,
        previous_value: 0.25,
        change_value: 0.01,
        change_pct: 4.0,
        change_direction: 'up',
        unit: 'puan',
        source_api: 'FRED',
        fetched_at: now,
        period_date: currentPeriod,
        is_stale: true,
        frequency: 'Günlük',
        description: 'Getiri eğrisi eğimi: Pozitif değerler normalleşmeyi, negatif değerler resesyon uyarısını gösterir.'
      },
      {
        id: 'ind-us-unemployment',
        indicator_code: 'US_UNEMPLOYMENT_RATE',
        indicator_name: 'ABD İşsizlik Oranı',
        region: 'US',
        category: 'istihdam',
        value: 4.1,
        previous_value: 4.1,
        change_value: 0.0,
        change_pct: 0.0,
        change_direction: 'neutral',
        unit: '%',
        source_api: 'FRED',
        fetched_at: now,
        period_date: currentPeriod,
        is_stale: true,
        frequency: 'Aylık',
        description: 'ABD Çalışma İstatistikleri Bürosu (BLS) resmi işsizlik oranı.'
      }
    ];

    if (!apiKey) {
      console.warn('[FRED] FRED_API_KEY eksik. Statik / Simüle verilere düşülüyor.');
      return fallbackIndicators;
    }

    try {
      const results: EconomicIndicator[] = [];

      // Helper function to safely process series
      const processSeries = async (
        seriesId: string, 
        baseInd: Partial<EconomicIndicator>, 
        calcFn?: (obs: any[]) => { value: number, previous_value: number, period: string }
      ) => {
        try {
          const limit = calcFn ? 13 : 2; // Fetch more if we need YoY calc
          const obs = await this.fetchFredSeries(seriesId, apiKey, limit);
          
          let value = 0;
          let previous = 0;
          let period = currentPeriod;

          if (calcFn) {
            const calculated = calcFn(obs);
            value = calculated.value;
            previous = calculated.previous_value;
            period = calculated.period;
          } else {
            // Ensure we have valid numbers, FRED sometimes returns "." for missing data on holidays
            const validObs = obs.filter((o: any) => o.value !== '.');
            if (validObs.length >= 2) {
              value = parseFloat(validObs[0].value);
              previous = parseFloat(validObs[1].value);
              period = validObs[0].date.substring(0, 7);
            }
          }

          const changeVal = value - previous;
          const changePct = previous !== 0 ? (changeVal / previous) * 100 : 0;
          
          results.push({
            id: baseInd.id as string,
            indicator_code: baseInd.indicator_code as string,
            indicator_name: baseInd.indicator_name as string,
            region: 'US',
            category: baseInd.category as any,
            value: Number(value.toFixed(2)),
            previous_value: Number(previous.toFixed(2)),
            change_value: Number(changeVal.toFixed(2)),
            change_pct: Number(changePct.toFixed(2)),
            change_direction: changeVal > 0 ? 'up' : changeVal < 0 ? 'down' : 'neutral',
            unit: baseInd.unit as string,
            source_api: 'FRED',
            fetched_at: now,
            period_date: period,
            is_stale: false,
            frequency: baseInd.frequency as any,
            description: baseInd.description as string
          });
        } catch (e) {
          console.warn(`[FRED] Series ${seriesId} çekilemedi, fallback kullanılacak.`, e);
          const fallback = fallbackIndicators.find(f => f.indicator_code === baseInd.indicator_code);
          if (fallback) results.push(fallback);
        }
      };

      await Promise.all([
        processSeries('FEDFUNDS', { 
          id: 'ind-us-fed-funds-rate', indicator_code: 'US_FED_RATE', indicator_name: 'Federal Reserve Politika Faiz Oranı', 
          category: 'faiz', unit: '%', frequency: 'Aylık', description: 'Federal Açık Piyasa Komitesi (FOMC) üst bant hedef politika faizi.'
        }),
        processSeries('CPIAUCSL', {
          id: 'ind-us-cpi-yoy', indicator_code: 'US_CPI_YOY', indicator_name: 'ABD TÜFE (CPI) Yıllık Enflasyon',
          category: 'enflasyon', unit: '%', frequency: 'Aylık', description: 'ABD Manşet Tüketici Fiyat Endeksi yıllık artış oranı.'
        }, (obs) => {
          // Calculate YoY from monthly index
          const validObs = obs.filter((o: any) => o.value !== '.');
          let val = 0, prev = 0, per = currentPeriod;
          if (validObs.length >= 13) {
            const currentIdx = parseFloat(validObs[0].value);
            const yearAgoIdx = parseFloat(validObs[12].value);
            const prevMonthIdx = parseFloat(validObs[1].value);
            const prevYearAgoIdx = parseFloat(validObs[13]?.value || validObs[12].value); // Approx
            
            val = ((currentIdx - yearAgoIdx) / yearAgoIdx) * 100;
            prev = ((prevMonthIdx - prevYearAgoIdx) / prevYearAgoIdx) * 100;
            per = validObs[0].date.substring(0, 7);
          }
          return { value: val, previous_value: prev, period: per };
        }),
        processSeries('DGS10', {
          id: 'ind-us-10y-yield', indicator_code: 'US_10Y_YIELD', indicator_name: 'ABD 10 Yıllık Hazine Tahvil Getirisi',
          category: 'faiz', unit: '%', frequency: 'Günlük', description: 'Küresel risksiz faiz göstergesi 10 Yıllık ABD Benchmark Hazine Bonosu.'
        }),
        processSeries('DGS2', {
          id: 'ind-us-2y-yield', indicator_code: 'US_2Y_YIELD', indicator_name: 'ABD 2 Yıllık Hazine Tahvil Getirisi',
          category: 'faiz', unit: '%', frequency: 'Günlük', description: 'Piyasanın kısa vadeli Fed faiz beklentilerini yansıtan 2 yıllık tahvil getirisi.'
        }),
        processSeries('UNRATE', {
          id: 'ind-us-unemployment', indicator_code: 'US_UNEMPLOYMENT_RATE', indicator_name: 'ABD İşsizlik Oranı',
          category: 'istihdam', unit: '%', frequency: 'Aylık', description: 'ABD Çalışma İstatistikleri Bürosu (BLS) resmi işsizlik oranı.'
        })
      ]);

      // Calculate Yield Curve based on the fetched results
      const yield10y = results.find(r => r.indicator_code === 'US_10Y_YIELD');
      const yield2y = results.find(r => r.indicator_code === 'US_2Y_YIELD');
      
      if (yield10y && yield2y) {
        const val = yield10y.value - yield2y.value;
        const prevVal = yield10y.previous_value - yield2y.previous_value;
        const changeVal = val - prevVal;
        
        results.push({
          id: 'ind-us-yield-curve',
          indicator_code: 'US_YIELD_CURVE',
          indicator_name: 'ABD Tahvil Getiri Eğrisi Farkı (10Y - 2Y)',
          region: 'US',
          category: 'risk_istahi',
          value: Number(val.toFixed(2)),
          previous_value: Number(prevVal.toFixed(2)),
          change_value: Number(changeVal.toFixed(2)),
          change_pct: prevVal !== 0 ? Number(((changeVal / prevVal) * 100).toFixed(2)) : 0,
          change_direction: changeVal > 0 ? 'up' : changeVal < 0 ? 'down' : 'neutral',
          unit: 'puan',
          source_api: 'FRED',
          fetched_at: now,
          period_date: yield10y.period_date,
          is_stale: false,
          frequency: 'Günlük',
          description: 'Getiri eğrisi eğimi: Pozitif değerler normalleşmeyi, negatif değerler resesyon uyarısını gösterir.'
        });
      }

      return results.sort((a, b) => a.indicator_code.localeCompare(b.indicator_code));
    } catch (error) {
      console.error('[FRED] Toplu veri çekme hatası:', error);
      return fallbackIndicators;
    }
  }
}
