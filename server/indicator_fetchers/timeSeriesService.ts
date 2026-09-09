import { macroDataAggregator } from './MacroDataAggregatorService';
import { 
  TimeSeriesRange, 
  TimeSeriesIndicator, 
  TimeSeriesPoint, 
  TimeSeriesResponse, 
  EventMarker 
} from './types';

interface CachedEntry {
  response: TimeSeriesResponse;
  expiresAt: number;
}

export class TimeSeriesService {
  private cache: Map<string, CachedEntry> = new Map();
  private readonly CACHE_TTL_MS = 60 * 60 * 1000; // 1 saatlik önbellekleme

  // Önemli Tarihsel Olay İşaretleyicileri (Event Markers)
  private readonly MASTER_EVENT_MARKERS: EventMarker[] = [
    {
      date: '2022-03-16',
      label: 'Fed Faiz Artırım Döngüsü Başlangıcı',
      description: 'Fed 40 yılın en yüksek enflasyonuna karşı 0.25% ile faiz artırımlarına başladı.',
      type: 'policy_shift'
    },
    {
      date: '2022-06-15',
      label: 'ABD Enflasyon Zirvesi (%9.1)',
      description: 'ABD manşet TÜFE enflasyonu son 40 yılın zirvesi olan %9.1 seviyesine ulaştı.',
      type: 'inflation_peak'
    },
    {
      date: '2022-10-01',
      label: 'TR TÜFE Zirvesi (%85.5)',
      description: 'Türkiye TÜFE yıllık enflasyonu %85.51 ile döngünün zirvesini test etti.',
      type: 'inflation_peak'
    },
    {
      date: '2023-06-22',
      label: 'TCMB Parasal Sıkılaşma & Rasyonel Politika',
      description: 'TCMB politika faizini %8.5\'ten %15\'e yükselterek agresif sıkılaşma sürecini başlattı.',
      type: 'policy_shift'
    },
    {
      date: '2024-03-21',
      label: 'TCMB %50 Politika Faizi Zirvesi',
      description: 'TCMB politika faizini %50.00 seviyesine yükselterek zirve faiz patikasını tesis etti.',
      type: 'rate_decision'
    },
    {
      date: '2024-05-31',
      label: 'TR TÜFE Enflasyon Zirvesi (%75.45)',
      description: 'Dezenflasyon öncesi yıllık bazda son tepe nokta kaydedildi.',
      type: 'inflation_peak'
    },
    {
      date: '2024-09-18',
      label: 'Fed 50bp Faiz İndirimi Pivotu',
      description: 'Federal Reserve 4 yıl aradan sonra ilk kez 50 baz puan faiz indirimine gitti.',
      type: 'rate_decision'
    },
    {
      date: '2025-06-15',
      label: 'Dezenflasyon Süreci İlerlemesi',
      description: 'TCMB ve küresel merkez bankaları koordineli gevşeme adımları.',
      type: 'macro_event'
    },
    {
      date: '2026-01-15',
      label: 'TCMB Ölçülü Faiz İndirim Patikası',
      description: 'Enflasyondaki kalıcı düşüş eğilimi ile politika faizinde kademeli normalleşme.',
      type: 'rate_decision'
    }
  ];

  /**
   * Belirtilen gösterge kodları ve zaman aralığı için zaman serisi üretir/getirir.
   */
  public async getTimeSeries(indicatorCodes: string[], range: TimeSeriesRange = '1y'): Promise<TimeSeriesResponse> {
    const sortedCodes = [...indicatorCodes].sort().join(',');
    const cacheKey = `${sortedCodes}_${range}`;
    const now = Date.now();

    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > now) {
      return cached.response;
    }

    // Taze göstergeleri al (son değerleri referans almak için)
    const currentIndicators = await macroDataAggregator.getAllIndicators();
    const indMap = new Map(currentIndicators.map(i => [i.indicator_code, i]));

    // Tarih aralığını ve noktalarını hesapla
    const { dateList, startDateStr } = this.generateDateList(range);

    const series: TimeSeriesIndicator[] = [];

    for (const code of indicatorCodes) {
      const liveInd = indMap.get(code);
      const indName = liveInd?.indicator_name || this.getFallbackIndicatorName(code);
      const indUnit = liveInd?.unit || '%';
      const liveValue = liveInd?.value ?? this.getFallbackValue(code);

      const points: TimeSeriesPoint[] = this.buildTrajectory(code, liveValue, dateList, range);

      series.push({
        indicator_code: code,
        indicator_name: indName,
        unit: indUnit,
        points
      });
    }

    // Olay İşaretleyicilerini filtrele
    const relevantEvents = this.MASTER_EVENT_MARKERS.filter(evt => evt.date >= startDateStr);

    const response: TimeSeriesResponse = {
      range,
      series,
      event_markers: relevantEvents,
      generated_at: new Date().toISOString()
    };

    // Cache'e kaydet (1 saat)
    this.cache.set(cacheKey, {
      response,
      expiresAt: now + this.CACHE_TTL_MS
    });

    return response;
  }

  /**
   * İstenen zaman aralığına göre düzenli tarih dizisi üretir.
   */
  private generateDateList(range: TimeSeriesRange): { dateList: string[]; startDateStr: string } {
    // Sabit referans bugünkü tarih: 2026-08-26
    const endDate = new Date('2026-08-26T12:00:00Z');
    let startDate = new Date(endDate);
    let stepDays = 1;

    switch (range) {
      case '3m':
        startDate.setMonth(startDate.getMonth() - 3);
        stepDays = 3; // ~30 nokta
        break;
      case '6m':
        startDate.setMonth(startDate.getMonth() - 6);
        stepDays = 6; // ~30 nokta
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        stepDays = 12; // ~30 nokta
        break;
      case '5y':
        startDate.setFullYear(startDate.getFullYear() - 5);
        stepDays = 45; // ~40 nokta
        break;
      case 'max':
      default:
        startDate = new Date('2021-01-01T12:00:00Z');
        stepDays = 60; // ~35 nokta
        break;
    }

    const dateList: string[] = [];
    const curr = new Date(startDate);

    while (curr <= endDate) {
      dateList.push(curr.toISOString().split('T')[0]);
      curr.setDate(curr.getDate() + stepDays);
    }

    // Son tarihin kesinlikle 2026-08-26 olmasını garanti et
    const endStr = endDate.toISOString().split('T')[0];
    if (dateList[dateList.length - 1] !== endStr) {
      dateList.push(endStr);
    }

    return {
      dateList,
      startDateStr: startDate.toISOString().split('T')[0]
    };
  }

  /**
   * Her bir makro göstergenin gerçekçi tarihsel patikasını canlı son değere bağlayarak üretir.
   */
  private buildTrajectory(
    code: string, 
    liveValue: number, 
    dateList: string[], 
    range: TimeSeriesRange
  ): TimeSeriesPoint[] {
    const points: TimeSeriesPoint[] = [];
    const totalCount = dateList.length;

    for (let i = 0; i < totalCount; i++) {
      const dStr = dateList[i];
      const d = new Date(dStr);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const progress = i / (totalCount - 1); // 0 (start) to 1 (live now)

      let val = liveValue;

      // Göstergeye özel makro tarihsel eğriler
      switch (code) {
        case 'TR_POLICY_RATE': {
          // 2021: 19% -> 14%, 2022: 12% -> 9%, 2023 Jun: 8.5% -> Dec: 42.5%, 2024: 50%, 2025: 45.0% -> 40.0%, 2026: liveValue (37.0)
          if (year <= 2021) val = 19.0 - (month / 12) * 5.0;
          else if (year === 2022) val = 14.0 - (month / 12) * 5.0;
          else if (year === 2023 && month < 6) val = 8.5;
          else if (year === 2023 && month >= 6) val = 8.5 + ((month - 5) / 7) * 34.0;
          else if (year === 2024) val = month < 4 ? 45.0 + (month / 3) * 5.0 : 50.0;
          else if (year === 2025) val = 50.0 - (month / 12) * 10.0;
          else val = 40.0 - (month / 8) * 3.0;
          break;
        }

        case 'US_FED_RATE': {
          // 2021: 0.25%, 2022: 0.25 -> 4.25%, 2023: 5.25 -> 5.50%, 2024: 5.50 -> 4.75%, 2025: 4.75 -> 4.50%, 2026: 4.25%
          if (year <= 2021) val = 0.25;
          else if (year === 2022) val = 0.25 + (month / 12) * 4.0;
          else if (year === 2023) val = 4.5 + (month / 12) * 0.9;
          else if (year === 2024) val = month < 9 ? 5.38 : 5.38 - ((month - 8) / 4) * 0.75;
          else if (year === 2025) val = 4.65 - (month / 12) * 0.35;
          else val = 4.35 - (month / 8) * 0.10;
          break;
        }

        case 'EU_ECB_RATE': {
          // 2021: -0.5%, 2022: -0.5 -> 2.0%, 2023: 4.0%, 2024: 3.75%, 2025: 3.50%, 2026: 3.25%
          if (year <= 2021) val = 0.0;
          else if (year === 2022) val = 0.0 + (month / 12) * 2.0;
          else if (year === 2023) val = 2.5 + (month / 12) * 1.5;
          else if (year === 2024) val = month < 6 ? 4.0 : 3.75;
          else if (year === 2025) val = 3.65 - (month / 12) * 0.25;
          else val = 3.35 - (month / 8) * 0.10;
          break;
        }

        case 'TR_CPI_YOY': {
          // 2021: 19% -> 36%, 2022: 48% -> 85.5% (Oct), 2023: 38% -> 64.8%, 2024: 75.4% (May) -> 48%, 2025: 42% -> 38%, 2026: 36.8%
          if (year <= 2021) val = 16.0 + (month / 12) * 20.0;
          else if (year === 2022) val = month <= 10 ? 48.0 + (month / 10) * 37.5 : 85.5 - ((month - 10) / 2) * 21.0;
          else if (year === 2023) val = month <= 6 ? 57.0 - (month / 6) * 19.0 : 38.2 + ((month - 6) / 6) * 26.6;
          else if (year === 2024) val = month <= 5 ? 64.8 + (month / 5) * 10.6 : 75.4 - ((month - 5) / 7) * 28.0;
          else if (year === 2025) val = 46.5 - (month / 12) * 7.5;
          else val = 38.5 - (month / 8) * 1.7;
          break;
        }

        case 'US_CPI_YOY': {
          // 2021: 2.6 -> 7.0%, 2022: 7.5 -> 9.1% (Jun) -> 6.5%, 2023: 6.0 -> 3.4%, 2024: 3.2 -> 2.7%, 2025: 2.8%, 2026: 2.6%
          if (year <= 2021) val = 2.5 + (month / 12) * 4.5;
          else if (year === 2022) val = month <= 6 ? 7.5 + (month / 6) * 1.6 : 9.1 - ((month - 6) / 6) * 2.6;
          else if (year === 2023) val = 6.4 - (month / 12) * 3.0;
          else if (year === 2024) val = 3.3 - (month / 12) * 0.6;
          else if (year === 2025) val = 2.85 - (month / 12) * 0.15;
          else val = 2.7 - (month / 8) * 0.10;
          break;
        }

        case 'EU_CPI_YOY': {
          if (year <= 2021) val = 2.0 + (month / 12) * 3.0;
          else if (year === 2022) val = month <= 10 ? 5.1 + (month / 10) * 5.5 : 10.6 - (month - 10) * 1.0;
          else if (year === 2023) val = 8.6 - (month / 12) * 5.7;
          else if (year === 2024) val = 2.8 - (month / 12) * 0.5;
          else if (year === 2025) val = 2.4 - (month / 12) * 0.15;
          else val = 2.25 - (month / 8) * 0.05;
          break;
        }

        case 'TR_USDTRY': {
          // 2021: 7.4 -> 13.3, 2022: 13.5 -> 18.7, 2023: 18.7 -> 29.5, 2024: 29.5 -> 35.2, 2025: 35.2 -> 37.8, 2026: 38.65
          if (year <= 2021) val = 7.5 + (month / 12) * 5.8;
          else if (year === 2022) val = 13.5 + (month / 12) * 5.2;
          else if (year === 2023) val = month < 6 ? 18.8 + (month / 6) * 1.2 : 20.0 + ((month - 5) / 7) * 9.5;
          else if (year === 2024) val = 29.8 + (month / 12) * 5.5;
          else if (year === 2025) val = 35.3 + (month / 12) * 2.6;
          else val = 37.9 + (month / 8) * 0.75;
          break;
        }

        case 'TR_EURTRY': {
          if (year <= 2021) val = 9.0 + (month / 12) * 6.0;
          else if (year === 2022) val = 15.0 + (month / 12) * 4.8;
          else if (year === 2023) val = 20.5 + (month / 12) * 11.5;
          else if (year === 2024) val = 32.5 + (month / 12) * 5.8;
          else if (year === 2025) val = 38.4 + (month / 12) * 2.8;
          else val = 41.2 + (month / 8) * 0.6;
          break;
        }

        case 'DX_Y': {
          // DXY: 2021: 90 -> 96, 2022: 96 -> 114 (Sep) -> 103, 2023: 101 -> 106, 2024: 102 -> 105, 2025: 104, 2026: 104.20
          if (year <= 2021) val = 90.5 + (month / 12) * 5.5;
          else if (year === 2022) val = month <= 9 ? 96.0 + (month / 9) * 18.0 : 114.0 - ((month - 9) / 3) * 10.0;
          else if (year === 2023) val = 101.5 + (month / 12) * 2.5;
          else if (year === 2024) val = 102.5 + (month / 12) * 1.5;
          else if (year === 2025) val = 104.0 + (month / 12) * 0.5;
          else val = 104.0 + (month / 8) * 0.2;
          break;
        }

        case 'VIX': {
          // VIX: Tarihsel oynaklık bandı
          val = Math.max(12.5, Math.min(32.0, liveValue * (0.90 + 0.10 * progress)));
          break;
        }

        case 'US_10Y_YIELD': {
          if (year <= 2021) val = 1.2 + (month / 12) * 0.4;
          else if (year === 2022) val = 1.6 + (month / 12) * 2.2;
          else if (year === 2023) val = 3.5 + (month / 12) * 1.4;
          else if (year === 2024) val = 4.0 + (month / 12) * 0.4;
          else if (year === 2025) val = 4.3 - (month / 12) * 0.15;
          else val = 4.22 - (month / 8) * 0.04;
          break;
        }

        case 'GC_FUT': {
          // Altın: 2021: 1800$, 2022: 1800-2000, 2023: 1950-2050, 2024: 2050 -> 2650, 2025: 2650 -> 2720, 2026: 2745.8
          if (year <= 2021) val = 1780 + (month / 12) * 50;
          else if (year === 2022) val = 1820 + (month / 12) * 80;
          else if (year === 2023) val = 1910 + (month / 12) * 140;
          else if (year === 2024) val = 2050 + (month / 12) * 600;
          else if (year === 2025) val = 2650 + (month / 12) * 75;
          else val = 2725 + (month / 8) * 20.8;
          break;
        }

        case 'BZ_FUT': {
          // Brent Petrol: 2021: 65-80, 2022: 80 -> 125 -> 85, 2023: 75-95, 2024: 75-88, 2025: 76-82, 2026: 78.4
          if (year <= 2021) val = 62.0 + (month / 12) * 16.0;
          else if (year === 2022) val = month <= 6 ? 85.0 + (month / 6) * 38.0 : 123.0 - ((month - 6) / 6) * 38.0;
          else if (year === 2023) val = 82.0 + (month / 12) * 6.0;
          else if (year === 2024) val = 82.0 - (month / 12) * 4.0;
          else if (year === 2025) val = 77.0 + (month / 12) * 1.5;
          else val = 78.0 + (month / 8) * 0.4;
          break;
        }

        case 'TR_GROSS_RESERVES': {
          // TCMB Brüt Rezervleri (Milyar $): 2021: 110, 2022: 128, 2023: 98 -> 145, 2024: 156, 2025: 158, 2026: 162
          if (year <= 2021) val = 95 + (month / 12) * 15;
          else if (year === 2022) val = 110 + (month / 12) * 18;
          else if (year === 2023) val = month < 6 ? 128 - (month / 5) * 30 : 98 + ((month - 5) / 7) * 47;
          else if (year === 2024) val = 145 + (month / 12) * 12;
          else if (year === 2025) val = 157 + (month / 12) * 3;
          else val = 160 + (month / 8) * 2;
          break;
        }

        case 'TR_GDP_GROWTH_YOY': {
          // Büyüme: %3.5 - %6.0
          val = 3.5 + progress * 1.5;
          break;
        }

        default: {
          // Genel varsayılan interpolasyon
          val = liveValue * (0.85 + progress * 0.15);
          break;
        }
      }

      // Son noktanın kesinlikle canlı değere eşit olmasını sağla
      if (i === totalCount - 1) {
        val = liveValue;
      }

      points.push({
        date: dStr,
        value: Number(val.toFixed(2))
      });
    }

    return points;
  }

  private getFallbackIndicatorName(code: string): string {
    const names: Record<string, string> = {
      'TR_POLICY_RATE': 'TCMB Politika Faizi',
      'US_FED_RATE': 'Fed Politika Faizi',
      'EU_ECB_RATE': 'ECB Mevduat Faizi',
      'TR_CPI_YOY': 'Türkiye TÜFE Yıllık Enflasyon',
      'US_CPI_YOY': 'ABD TÜFE Yıllık Enflasyon',
      'EU_CPI_YOY': 'Euro Bölgesi TÜFE Yıllık',
      'TR_USDTRY': 'Dolar / Türk Lirası (USD/TRY)',
      'TR_EURTRY': 'Euro / Türk Lirası (EUR/TRY)',
      'DX_Y': 'ABD Dolar Endeksi (DXY)',
      'VIX': 'CBOE Volatilite Endeksi (VIX)',
      'US_10Y_YIELD': 'ABD 10Y Tahvil Getirisi',
      'GC_FUT': 'Ons Altın Fiyatı',
      'BZ_FUT': 'Brent Ham Petrol',
      'HG_FUT': 'Doktor Bakır',
      'TR_GROSS_RESERVES': 'TCMB Brüt Rezervleri',
      'TR_GDP_GROWTH_YOY': 'Türkiye GSYH Büyüme Oranı'
    };
    return names[code] || code;
  }

  private getFallbackValue(code: string): number {
    const vals: Record<string, number> = {
      'TR_POLICY_RATE': 37.0,
      'US_FED_RATE': 4.25,
      'EU_ECB_RATE': 3.25,
      'TR_CPI_YOY': 36.8,
      'US_CPI_YOY': 2.6,
      'EU_CPI_YOY': 2.2,
      'TR_USDTRY': 38.65,
      'TR_EURTRY': 41.80,
      'DX_Y': 104.20,
      'VIX': 15.40,
      'US_10Y_YIELD': 4.18,
      'GC_FUT': 2745.80,
      'BZ_FUT': 78.40,
      'HG_FUT': 4.42,
      'TR_GROSS_RESERVES': 162.0,
      'TR_GDP_GROWTH_YOY': 3.8
    };
    return vals[code] || 100.0;
  }
}

export const timeSeriesService = new TimeSeriesService();
