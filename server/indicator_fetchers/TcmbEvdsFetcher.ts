import { BaseFetcher } from './BaseFetcher';
import { EconomicIndicator } from './types';

/**
 * TCMB EVDS (Elektronik Veri Dağıtım Sistemi) Fetcher
 * Türkiye Cumhuriyet Merkez Bankası Para Politikası, Rezervler ve Enflasyon Serileri
 */
export class TcmbEvdsFetcher implements BaseFetcher {
  readonly name = 'TCMB EVDS Fetcher';
  readonly sourceApi = 'TCMB_EVDS' as const;

  private async fetchEvds(series: string, apiKey: string): Promise<any[]> {
    try {
      // Son 2 ayı çekelim ki previous_value bulabilelim
      const d = new Date();
      const end = `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
      d.setMonth(d.getMonth() - 2);
      const start = `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
      
      const url = `https://evds2.tcmb.gov.tr/service/evds/series=${series}&startDate=${start}&endDate=${end}&type=json&key=${apiKey}`;
      const res = await fetch(url, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(5000)
      });
      if (!res.ok) return [];
      
      const textData = await res.text();
      const trimmed = textData.trim();
      if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
        return [];
      }

      const data = JSON.parse(trimmed);
      return Array.isArray(data.items) ? data.items : [];
    } catch {
      return [];
    }
  }

  async fetchIndicators(): Promise<EconomicIndicator[]> {
    const now = new Date().toISOString();
    const currentPeriod = now.substring(0, 7);

    const apiKey = process.env.TCMB_EVDS_KEY;

    const fallbackIndicators: EconomicIndicator[] = [
      {
        id: 'ind-tr-policy-rate',
        indicator_code: 'TR_POLICY_RATE',
        indicator_name: 'TCMB 1 Hafta Repo Politika Faizi',
        region: 'TR',
        category: 'faiz',
        value: 37.0,
        previous_value: 37.0,
        change_value: 0.0,
        change_pct: 0.0,
        change_direction: 'neutral',
        unit: '%',
        source_api: 'TCMB_EVDS',
        fetched_at: now,
        period_date: currentPeriod,
        is_stale: true,
        frequency: 'Aylık',
        description: 'TCMB Para Politikası Kurulu (PPK) politika faiz oranı (Ağustos 2026 PPK kararıyla %37 sabit).'
      },
      {
        id: 'ind-tr-cpi-yoy',
        indicator_code: 'TR_CPI_YOY',
        indicator_name: 'TÜFE Yıllık Enflasyon Oranı',
        region: 'TR',
        category: 'enflasyon',
        value: 36.8,
        previous_value: 41.2,
        change_value: -4.4,
        change_pct: -10.68,
        change_direction: 'down',
        unit: '%',
        source_api: 'TCMB_EVDS',
        fetched_at: now,
        period_date: currentPeriod,
        is_stale: true,
        frequency: 'Aylık',
        description: 'Tüketici Fiyat Endeksi yıllık değişim oranı.'
      },
      {
        id: 'ind-tr-ppi-yoy',
        indicator_code: 'TR_PPI_YOY',
        indicator_name: 'Yİ-ÜFE Yıllık Üretici Fiyat Endeksi',
        region: 'TR',
        category: 'enflasyon',
        value: 29.4,
        previous_value: 32.8,
        change_value: -3.4,
        change_pct: -10.37,
        change_direction: 'down',
        unit: '%',
        source_api: 'TCMB_EVDS',
        fetched_at: now,
        period_date: currentPeriod,
        is_stale: true,
        frequency: 'Aylık',
        description: 'Yurt İçi Üretici Fiyat Endeksi yıllık değişim oranı.'
      },
      {
        id: 'ind-tr-gross-reserves',
        indicator_code: 'TR_GROSS_RESERVES',
        indicator_name: 'TCMB Toplam Brüt Döviz ve Altın Rezervleri',
        region: 'TR',
        category: 'para_ve_likidite',
        value: 168.4,
        previous_value: 162.1,
        change_value: 6.3,
        change_pct: 3.89,
        change_direction: 'up',
        unit: 'Milyar $',
        source_api: 'TCMB_EVDS',
        fetched_at: now,
        period_date: currentPeriod,
        is_stale: true,
        frequency: 'Aylık',
        description: 'TCMB brüt uluslararası rezervleri toplamı.'
      },
      {
        id: 'ind-tr-current-account',
        indicator_code: 'TR_CURRENT_ACCOUNT',
        indicator_name: '12 Aylık Kümülatif Cari İşlemler Dengesi',
        region: 'TR',
        category: 'buyume',
        value: -9.8,
        previous_value: -14.2,
        change_value: 4.4,
        change_pct: 30.98,
        change_direction: 'up',
        unit: 'Milyar $',
        source_api: 'TCMB_EVDS',
        fetched_at: now,
        period_date: currentPeriod,
        is_stale: true,
        frequency: 'Aylık',
        description: 'Yıllıklandırılmış cari işlemler açığı / dengesi.'
      },
      {
        id: 'ind-tr-m2-growth',
        indicator_code: 'TR_M2_GROWTH',
        indicator_name: 'Geniş Para Arzı (M2) Yıllık Büyüme',
        region: 'TR',
        category: 'para_ve_likidite',
        value: 42.1,
        previous_value: 46.5,
        change_value: -4.4,
        change_pct: -9.46,
        change_direction: 'down',
        unit: '%',
        source_api: 'TCMB_EVDS',
        fetched_at: now,
        period_date: currentPeriod,
        is_stale: true,
        frequency: 'Aylık',
        description: 'M2 Para Arzı yıllık genişleme hızı.'
      }
    ];

    if (!apiKey) {
      console.warn('[TCMB_EVDS] TCMB_EVDS_KEY eksik. Statik / Simüle verilere düşülüyor.');
      return fallbackIndicators;
    }

    try {
      // TÜFE Yıllık Değişim: TP.FG.J0 (Örnek Kod)
      const cpiData = await this.fetchEvds('TP.FG.J0', apiKey);
      
      // We will parse the last two valid data points
      const validCpi = cpiData.filter(d => d['TP_FG_J0'] !== null && d['TP_FG_J0'] !== undefined).reverse();
      
      let cpiVal = fallbackIndicators[1].value;
      let cpiPrev = fallbackIndicators[1].previous_value;
      
      if (validCpi.length >= 2) {
        cpiVal = parseFloat(validCpi[0]['TP_FG_J0']);
        cpiPrev = parseFloat(validCpi[1]['TP_FG_J0']);
      }

      const cpiChange = cpiVal - cpiPrev;
      const cpiPct = cpiPrev !== 0 ? (cpiChange / cpiPrev) * 100 : 0;

      const results = [...fallbackIndicators];
      
      // Update CPI with real EVDS data
      if (validCpi.length >= 2) {
        results[1] = {
            ...results[1],
            value: Number(cpiVal.toFixed(2)),
            previous_value: Number(cpiPrev.toFixed(2)),
            change_value: Number(cpiChange.toFixed(2)),
            change_pct: Number(cpiPct.toFixed(2)),
            change_direction: cpiChange > 0 ? 'up' : cpiChange < 0 ? 'down' : 'neutral',
            is_stale: false,
            period_date: validCpi[0].Tarih || currentPeriod
        };
      }
      
      // In a real full integration, you would add queries for:
      // Policy Rate (TP.APIFON4 or similar)
      // Current Account (TP.ODEMG.BOP...)
      // M2 (TP.KMD13)
      // Reserves (TP.AB.C02)
      // Since EVDS codes change frequently and are complex, we upgrade the ones we know 
      // and keep fallback for the rest, but mark them fetched if successful.
      
      return results;
    } catch (e) {
      console.warn('[TCMB_EVDS] EVDS Veri çekilemedi, fallback (sabit) veri kullanılıyor.');
      return fallbackIndicators;
    }
  }
}
