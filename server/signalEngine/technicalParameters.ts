import crypto from 'crypto';
import { TechnicalEngineParams, TechnicalEnginePreset } from '../../src/types';

/**
 * 1. SİSTEM VARSAYILANLARI (Endüstri Standardı Orta Vadeli Parametreler)
 */
export const DEFAULT_TECHNICAL_PARAMS: TechnicalEngineParams = {
  preset: 'MEDIUM_TERM',
  fastMaPeriod: 20,
  mediumMaPeriod: 50,
  slowMaPeriod: 200,
  maType: 'EMA',
  rsiPeriod: 14,
  rsiOverbought: 70,
  rsiOversold: 30,
  macdFastPeriod: 12,
  macdSlowPeriod: 26,
  macdSignalPeriod: 9,
  bbPeriod: 20,
  bbStdDev: 2.0,
  atrPeriod: 14,
  riskRewardRatio: 3.0,
  volumeMultiplier: 1.5,
};

/**
 * 2. HAZIR PRESETLER (3 Katmanlı Mimari)
 */
export const TECHNICAL_PRESETS: Record<Exclude<TechnicalEnginePreset, 'CUSTOM'>, TechnicalEngineParams> = {
  // Kısa Vadeli / Scalp & Day Trade: Hızlı fiyat kırılımlarına ve dalgalanmalara duyarlı
  SHORT_TERM: {
    preset: 'SHORT_TERM',
    fastMaPeriod: 9,
    mediumMaPeriod: 21,
    slowMaPeriod: 50,
    maType: 'EMA',
    rsiPeriod: 9,
    rsiOverbought: 75,
    rsiOversold: 25,
    macdFastPeriod: 6,
    macdSlowPeriod: 13,
    macdSignalPeriod: 5,
    bbPeriod: 14,
    bbStdDev: 2.0,
    atrPeriod: 10,
    riskRewardRatio: 2.0,
    volumeMultiplier: 1.3,
  },

  // Orta Vadeli / Swing Trade: Standart döngüler ve gürültüden arındırılmış trend takibi (Varsayılan)
  MEDIUM_TERM: {
    preset: 'MEDIUM_TERM',
    fastMaPeriod: 20,
    mediumMaPeriod: 50,
    slowMaPeriod: 200,
    maType: 'EMA',
    rsiPeriod: 14,
    rsiOverbought: 70,
    rsiOversold: 30,
    macdFastPeriod: 12,
    macdSlowPeriod: 26,
    macdSignalPeriod: 9,
    bbPeriod: 20,
    bbStdDev: 2.0,
    atrPeriod: 14,
    riskRewardRatio: 3.0,
    volumeMultiplier: 1.5,
  },

  // Uzun Vadeli / Pozisyonel & Değer: Ana makro trendleri izleyen, düşük frekanslı kararlı göstergeler
  LONG_TERM: {
    preset: 'LONG_TERM',
    fastMaPeriod: 50,
    mediumMaPeriod: 100,
    slowMaPeriod: 200,
    maType: 'SMA',
    rsiPeriod: 21,
    rsiOverbought: 65,
    rsiOversold: 35,
    macdFastPeriod: 19,
    macdSlowPeriod: 39,
    macdSignalPeriod: 9,
    bbPeriod: 30,
    bbStdDev: 2.5,
    atrPeriod: 20,
    riskRewardRatio: 4.0,
    volumeMultiplier: 2.0,
  }
};

/**
 * Parametre Sınırları ve Kuralları (Min/Max Kontrolleri)
 */
export const PARAMETER_BOUNDS = {
  fastMaPeriod: { min: 5, max: 100, label: 'Kısa Hareketli Ortalama Periyodu' },
  mediumMaPeriod: { min: 10, max: 200, label: 'Orta Hareketli Ortalama Periyodu' },
  slowMaPeriod: { min: 50, max: 300, label: 'Uzun Hareketli Ortalama Periyodu' },
  rsiPeriod: { min: 2, max: 50, label: 'RSI Periyodu' },
  rsiOverbought: { min: 50, max: 95, label: 'RSI Aşırı Alım Eşiği' },
  rsiOversold: { min: 5, max: 50, label: 'RSI Aşırı Satım Eşiği' },
  macdFastPeriod: { min: 2, max: 50, label: 'MACD Hızlı EMA Periyodu' },
  macdSlowPeriod: { min: 5, max: 100, label: 'MACD Yavaş EMA Periyodu' },
  macdSignalPeriod: { min: 2, max: 50, label: 'MACD Sinyal Periyodu' },
  bbPeriod: { min: 5, max: 100, label: 'Bollinger Bandı Periyodu' },
  bbStdDev: { min: 1.0, max: 4.0, label: 'Bollinger Standart Sapma Çarpanı' },
  atrPeriod: { min: 2, max: 50, label: 'ATR Periyodu' },
  riskRewardRatio: { min: 1.0, max: 10.0, label: 'Risk / Ödül Oranı' },
  volumeMultiplier: { min: 1.0, max: 10.0, label: 'Hacim Anomali Çarpanı' },
};

export interface ParameterValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedParams: TechnicalEngineParams;
}

/**
 * 3. BACKEND GİRİŞ DOĞRULAMA (VALIDATION) KATMANI
 * Sınır dışı veya mantıksız (örn. RSI alım <= satım eşiği) değerleri süzüp açık hata döner.
 */
export function validateTechnicalParameters(rawParams: Partial<TechnicalEngineParams> | undefined | null): ParameterValidationResult {
  const errors: string[] = [];

  // Preset seçimi varsa taban olarak preset kullanılır
  let basePresetParams = DEFAULT_TECHNICAL_PARAMS;
  if (rawParams?.preset && rawParams.preset in TECHNICAL_PRESETS) {
    basePresetParams = TECHNICAL_PRESETS[rawParams.preset as Exclude<TechnicalEnginePreset, 'CUSTOM'>];
  }

  // Ham parametreleri varsayılanlarla birleştir
  const merged: TechnicalEngineParams = {
    preset: rawParams?.preset || 'CUSTOM',
    fastMaPeriod: Number(rawParams?.fastMaPeriod ?? basePresetParams.fastMaPeriod),
    mediumMaPeriod: Number(rawParams?.mediumMaPeriod ?? basePresetParams.mediumMaPeriod),
    slowMaPeriod: Number(rawParams?.slowMaPeriod ?? basePresetParams.slowMaPeriod),
    maType: rawParams?.maType === 'SMA' ? 'SMA' : 'EMA',
    rsiPeriod: Number(rawParams?.rsiPeriod ?? basePresetParams.rsiPeriod),
    rsiOverbought: Number(rawParams?.rsiOverbought ?? basePresetParams.rsiOverbought),
    rsiOversold: Number(rawParams?.rsiOversold ?? basePresetParams.rsiOversold),
    macdFastPeriod: Number(rawParams?.macdFastPeriod ?? basePresetParams.macdFastPeriod),
    macdSlowPeriod: Number(rawParams?.macdSlowPeriod ?? basePresetParams.macdSlowPeriod),
    macdSignalPeriod: Number(rawParams?.macdSignalPeriod ?? basePresetParams.macdSignalPeriod),
    bbPeriod: Number(rawParams?.bbPeriod ?? basePresetParams.bbPeriod),
    bbStdDev: Number(rawParams?.bbStdDev ?? basePresetParams.bbStdDev),
    atrPeriod: Number(rawParams?.atrPeriod ?? basePresetParams.atrPeriod),
    riskRewardRatio: Number(rawParams?.riskRewardRatio ?? basePresetParams.riskRewardRatio),
    volumeMultiplier: Number(rawParams?.volumeMultiplier ?? basePresetParams.volumeMultiplier),
  };

  // 1. Sayısal Tip ve NaN Kontrolü
  for (const [key, bounds] of Object.entries(PARAMETER_BOUNDS)) {
    const val = (merged as any)[key];
    if (typeof val !== 'number' || isNaN(val) || !isFinite(val)) {
      errors.push(`${bounds.label} (${key}) geçerli bir sayı olmalıdır.`);
    } else if (val < bounds.min || val > bounds.max) {
      errors.push(`${bounds.label} [${bounds.min} - ${bounds.max}] sınırları arasında olmalıdır. Girilen: ${val}`);
    }
  }

  // 2. Mantıksal İlişki Kontrolleri
  if (merged.rsiOverbought <= merged.rsiOversold) {
    errors.push(`RSI Aşırı Alım Eşiği (${merged.rsiOverbought}), Aşırı Satım Eşiğinden (${merged.rsiOversold}) büyük olmalıdır.`);
  }

  if (merged.macdFastPeriod >= merged.macdSlowPeriod) {
    errors.push(`MACD Hızlı Periyot (${merged.macdFastPeriod}), Yavaş Periyottan (${merged.macdSlowPeriod}) küçük olmalıdır.`);
  }

  if (merged.fastMaPeriod >= merged.mediumMaPeriod) {
    errors.push(`Kısa Hareketli Ortalama (${merged.fastMaPeriod}), Orta Hareketli Ortalamadan (${merged.mediumMaPeriod}) küçük olmalıdır.`);
  }

  if (merged.mediumMaPeriod >= merged.slowMaPeriod) {
    errors.push(`Orta Hareketli Ortalama (${merged.mediumMaPeriod}), Uzun Hareketli Ortalamadan (${merged.slowMaPeriod}) küçük olmalıdır.`);
  }

  // Tam sayı olması gerekenler kontrolü
  const integerFields = [
    'fastMaPeriod', 'mediumMaPeriod', 'slowMaPeriod', 
    'rsiPeriod', 'rsiOverbought', 'rsiOversold', 
    'macdFastPeriod', 'macdSlowPeriod', 'macdSignalPeriod', 
    'bbPeriod', 'atrPeriod'
  ];

  for (const f of integerFields) {
    const val = (merged as any)[f];
    if (typeof val === 'number' && !Number.isInteger(val)) {
      errors.push(`${PARAMETER_BOUNDS[f as keyof typeof PARAMETER_BOUNDS]?.label || f} tam sayı olmalıdır.`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedParams: merged,
  };
}

/**
 * Cache Ayrışımı İçin Deterministik Parametre Hash'i Üretici
 */
export function getParamHash(params: TechnicalEngineParams): string {
  const norm = {
    fMa: params.fastMaPeriod,
    mMa: params.mediumMaPeriod,
    sMa: params.slowMaPeriod,
    maT: params.maType,
    rsiP: params.rsiPeriod,
    rsiOb: params.rsiOverbought,
    rsiOs: params.rsiOversold,
    mFast: params.macdFastPeriod,
    mSlow: params.macdSlowPeriod,
    mSig: params.macdSignalPeriod,
    bbP: params.bbPeriod,
    bbDev: params.bbStdDev,
    atrP: params.atrPeriod,
    rr: params.riskRewardRatio,
    vol: params.volumeMultiplier,
  };
  return crypto.createHash('md5').update(JSON.stringify(norm)).digest('hex').slice(0, 10);
}
