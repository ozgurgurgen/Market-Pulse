import { BaseFetcher } from './BaseFetcher';
import { EconomicIndicator } from './types';
import yfAny from 'yahoo-finance2';

const YFClass = (yfAny as any).default || yfAny;
const yfClient = new YFClass({ suppressNotices: ['yahooSurvey'] });

/**
 * Yahoo Finance Macro & Commodities Fetcher
 * BIST 100, S&P 500, VIX Volatilite Endeksi, Brent Petrol, Altın, Bakır ve DXY
 */
export class YahooFinanceMacroFetcher implements BaseFetcher {
  readonly name = 'Yahoo Finance Macro Fetcher';
  readonly sourceApi = 'YAHOO_FINANCE' as const;

  async fetchIndicators(): Promise<EconomicIndicator[]> {
    const now = new Date().toISOString();
    const currentPeriod = '2026-08';

    // Varsayılan / Fallback değerler
    const defaultData: Record<string, { name: string; region: any; category: any; value: number; prev: number; unit: string; desc: string; freq: any }> = {
      'XU100.IS': { name: 'BIST 100 Endeksi', region: 'TR', category: 'risk_istahi', value: 10120.50, prev: 9980.20, unit: 'Puan', desc: 'Borsa İstanbul 100 Fiyat Gösterge Endeksi.', freq: 'Gerçek Zamanlı' },
      '^VIX': { name: 'CBOE Volatilite Endeksi (VIX / Korku Endeksi)', region: 'GLOBAL', category: 'risk_istahi', value: 15.40, prev: 16.20, unit: 'Puan', desc: 'S&P 500 opsiyonlarından türetilen 30 günlük zımni piyasa oynaklığı.', freq: 'Gerçek Zamanlı' },
      '^GSPC': { name: 'S&P 500 Endeksi', region: 'US', category: 'risk_istahi', value: 5890.20, prev: 5850.10, unit: 'Puan', desc: 'ABD en büyük 500 şirketinin piyasa değeri ağırlıklı endeksi.', freq: 'Gerçek Zamanlı' },
      'BZ=F': { name: 'Brent Ham Petrol Vadeli Fiyatı', region: 'GLOBAL', category: 'emtia', value: 78.40, prev: 79.20, unit: '$/Varil', desc: 'Küresel enerji ve lojistik maliyet göstergesi Brent petrol.', freq: 'Gerçek Zamanlı' },
      'GC=F': { name: 'Ons Altın (Spot / Vadeli)', region: 'GLOBAL', category: 'emtia', value: 2745.80, prev: 2720.50, unit: '$/Ons', desc: 'Küresel güvenli liman ve enflasyon koruma göstergesi.', freq: 'Gerçek Zamanlı' },
      'HG=F': { name: 'Bakır (Doktor Bakır / Küresel Sanayi)', region: 'GLOBAL', category: 'emtia', value: 4.42, prev: 4.38, unit: '$/Lbs', desc: 'Küresel sanayi ve imalat sanayi öncü talep barometresi.', freq: 'Gerçek Zamanlı' },
      'DX-Y.NYB': { name: 'ABD Dolar Endeksi (DXY)', region: 'GLOBAL', category: 'doviz', value: 104.20, prev: 104.60, unit: 'Puan', desc: 'Doların 6 majör küresel para birimi sepetine karşı gücü.', freq: 'Gerçek Zamanlı' },
    };

    const symbols = Object.keys(defaultData);
    const indicators: EconomicIndicator[] = [];

    for (const sym of symbols) {
      const meta = defaultData[sym];
      let val = meta.value;
      let prevVal = meta.prev;
      let isStale = false;

      try {
        const quote = await yfClient.quote(sym);
        if (quote && typeof quote.regularMarketPrice === 'number') {
          val = quote.regularMarketPrice;
          prevVal = quote.regularMarketPreviousClose || meta.prev;
        }
      } catch (err) {
        // Fallback to default
        isStale = true;
      }

      const changeVal = Number((val - prevVal).toFixed(2));
      const changePct = Number((((val - prevVal) / prevVal) * 100).toFixed(2));

      indicators.push({
        id: `ind-${sym.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        indicator_code: sym.replace('^', '').replace('=F', '_FUT').replace('.NYB', '').replace('.IS', ''),
        indicator_name: meta.name,
        region: meta.region,
        category: meta.category,
        value: Number(val.toFixed(2)),
        previous_value: Number(prevVal.toFixed(2)),
        change_value: changeVal,
        change_pct: changePct,
        change_direction: changeVal > 0 ? 'up' : changeVal < 0 ? 'down' : 'neutral',
        unit: meta.unit,
        source_api: 'YAHOO_FINANCE',
        fetched_at: now,
        period_date: currentPeriod,
        is_stale: isStale,
        frequency: meta.freq,
        description: meta.desc,
      });
    }

    return indicators;
  }
}
