/**
 * Ekonomik Göstergeler ve Makro İstihbarat Veri Modelleri
 */

export type IndicatorRegion = 'TR' | 'GLOBAL' | 'US' | 'EU';

export type IndicatorCategory = 
  | 'faiz' 
  | 'enflasyon' 
  | 'istihdam' 
  | 'doviz' 
  | 'risk_istahi' 
  | 'emtia' 
  | 'buyume'
  | 'para_ve_likidite';

export type CorrelationType = 'pozitif' | 'negatif' | 'kosullu';
export type ImpactStrength = 'zayıf' | 'orta' | 'güçlü';

export interface EconomicIndicator {
  id: string;
  indicator_code: string;
  indicator_name: string;
  region: IndicatorRegion;
  category: IndicatorCategory;
  value: number;
  previous_value?: number;
  change_value?: number;
  change_pct?: number;
  change_direction?: 'up' | 'down' | 'neutral';
  unit: string;
  source_api: 'TCMB_EVDS' | 'FRED' | 'ECB' | 'FRANKFURTER' | 'YAHOO_FINANCE' | 'TUIK' | 'ALPHA_VANTAGE';
  fetched_at: string;
  period_date: string;
  is_stale: boolean;
  is_delayed?: boolean;
  frequency?: 'Günlük' | 'Aylık' | 'Çeyreklik' | 'Gerçek Zamanlı';
  description?: string;
}

export interface IndicatorAssetImpact {
  id: string;
  indicator_code: string;
  indicator_name: string;
  asset_symbol: string;
  asset_name?: string;
  correlation_type: CorrelationType;
  strength: ImpactStrength;
  lag_days: number;
  rationale: string;
  is_ai_generated: boolean;
}

export interface SectorOutlook {
  sektor: string;
  egilim: 'pozitif' | 'negatif' | 'notr';
  gerekce: string;
  guven_seviyesi: 'düşük' | 'orta' | 'yüksek';
  destekleyen_gosterge_sayisi: number;
}

export interface AIMacroCommentaryOutput {
  analiz_tarihi: string;
  kullanilan_gostergeler: string[];
  eksik_veri: string[];
  makro_rejim_ozeti: string;
  sektor_gorunumu: SectorOutlook[];
  uyari: string;
}

export interface AIMacroCommentaryRecord {
  id: string;
  generated_at: string;
  input_indicators: {
    timestamp: string;
    indicators: Array<{
      code: string;
      name: string;
      value: number;
      unit: string;
      period: string;
    }>;
  };
  output_json: AIMacroCommentaryOutput;
  validation_passed: boolean;
  validation_errors?: string[];
  model_used: string;
}

export type TimeSeriesRange = '3m' | '6m' | '1y' | '5y' | 'max';

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface TimeSeriesIndicator {
  indicator_code: string;
  indicator_name: string;
  unit: string;
  points: TimeSeriesPoint[];
}

export interface EventMarker {
  date: string;
  label: string;
  description?: string;
  type?: 'rate_decision' | 'inflation_peak' | 'policy_shift' | 'macro_event';
}

export interface TimeSeriesResponse {
  range: TimeSeriesRange;
  series: TimeSeriesIndicator[];
  event_markers?: EventMarker[];
  generated_at: string;
}
