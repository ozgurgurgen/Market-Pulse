import { WeightConfig, MarketRegime, SignalEngineConfig } from './types';
import { DEFAULT_SIGNAL_ENGINE_CONFIG } from './config';

/**
 * BÖLÜM 4 — Standart Wilder ADX (Average Directional Index) Hesaplayıcı
 * Pure function: high, low, close dizilerini alır, ADX serisini veya son ADX değerini döner.
 * Yetersiz veride veya NaN durumlarda NaN döndürür (Sahte 22 doldurma YASAK).
 */
export function calculateADXSeries(
  highs: number[],
  lows: number[],
  closes: number[],
  period = 14
): number[] {
  const n = closes?.length || 0;
  if (n <= period * 2 || !highs || !lows || !closes) {
    return new Array(n).fill(NaN);
  }

  const tr: number[] = new Array(n).fill(0);
  const plusDM: number[] = new Array(n).fill(0);
  const minusDM: number[] = new Array(n).fill(0);

  // 1. True Range ve Directional Movement
  for (let i = 1; i < n; i++) {
    const h = highs[i];
    const l = lows[i];
    const prevC = closes[i - 1];
    const prevH = highs[i - 1];
    const prevL = lows[i - 1];

    if (isNaN(h) || isNaN(l) || isNaN(prevC) || isNaN(prevH) || isNaN(prevL)) {
      tr[i] = NaN;
      plusDM[i] = NaN;
      minusDM[i] = NaN;
      continue;
    }

    tr[i] = Math.max(h - l, Math.abs(h - prevC), Math.abs(l - prevC));

    const upMove = h - prevH;
    const downMove = prevL - l;

    if (upMove > downMove && upMove > 0) {
      plusDM[i] = upMove;
    } else {
      plusDM[i] = 0;
    }

    if (downMove > upMove && downMove > 0) {
      minusDM[i] = downMove;
    } else {
      minusDM[i] = 0;
    }
  }

  // 2. Wilder's Smoothing
  const smoothedTR: number[] = new Array(n).fill(NaN);
  const smoothedPlusDM: number[] = new Array(n).fill(NaN);
  const smoothedMinusDM: number[] = new Array(n).fill(NaN);

  let sumTR = 0;
  let sumPlusDM = 0;
  let sumMinusDM = 0;

  for (let i = 1; i <= period; i++) {
    sumTR += tr[i] || 0;
    sumPlusDM += plusDM[i] || 0;
    sumMinusDM += minusDM[i] || 0;
  }

  smoothedTR[period] = sumTR;
  smoothedPlusDM[period] = sumPlusDM;
  smoothedMinusDM[period] = sumMinusDM;

  for (let i = period + 1; i < n; i++) {
    smoothedTR[i] = smoothedTR[i - 1] - smoothedTR[i - 1] / period + (tr[i] || 0);
    smoothedPlusDM[i] = smoothedPlusDM[i - 1] - smoothedPlusDM[i - 1] / period + (plusDM[i] || 0);
    smoothedMinusDM[i] = smoothedMinusDM[i - 1] - smoothedMinusDM[i - 1] / period + (minusDM[i] || 0);
  }

  // 3. +DI, -DI ve DX
  const dx: number[] = new Array(n).fill(NaN);
  for (let i = period; i < n; i++) {
    const trVal = smoothedTR[i] || 0.0001;
    const plusDI = (smoothedPlusDM[i] / trVal) * 100;
    const minusDI = (smoothedMinusDM[i] / trVal) * 100;

    const diSum = plusDI + minusDI;
    const diDiff = Math.abs(plusDI - minusDI);

    dx[i] = diSum > 0 ? (diDiff / diSum) * 100 : 0;
  }

  // 4. ADX (DX'in smoothed ortalaması)
  const adx: number[] = new Array(n).fill(NaN);
  let sumDX = 0;
  const adxStart = period * 2;

  for (let i = period; i < adxStart; i++) {
    sumDX += dx[i] || 0;
  }

  if (adxStart < n) {
    adx[adxStart] = sumDX / period;
    for (let i = adxStart + 1; i < n; i++) {
      adx[i] = (adx[i - 1] * (period - 1) + dx[i]) / period;
    }
  }

  return adx;
}

/**
 * Son Bar için ADX Değerini Hesapla
 */
export function calculateADX(
  highs: number[],
  lows: number[],
  closes: number[],
  period = 14
): number {
  if (!closes || closes.length < period * 2) {
    return NaN;
  }
  const series = calculateADXSeries(highs, lows, closes, period);
  const lastVal = series[series.length - 1];
  return isNaN(lastVal) ? NaN : Number(lastVal.toFixed(1));
}

/**
 * BÖLÜM 4 & MADDE D — Dinamik Ağırlıklandırma Fonksiyonu
 * ADX rejimine ve haber başarı oranına (newsHitRate) göre 5 kategorinin ağırlıklarını seçer.
 * Eğer newsHitRate < 0.55 ise haber ağırlığı 0'a çekilir, payı trend ve value'ya eşit paylaştırılır.
 */
export function getDynamicWeights(
  adx: number,
  config: SignalEngineConfig = DEFAULT_SIGNAL_ENGINE_CONFIG,
  newsHitRate = 0.65
): { weights: WeightConfig; regime: MarketRegime } {
  let weights: WeightConfig;
  let regime: MarketRegime;

  if (typeof adx === 'number' && !isNaN(adx) && adx > config.adxTrendThreshold) {
    weights = { ...config.weightsTrending };
    regime = 'TRENDING';
  } else if (typeof adx === 'number' && !isNaN(adx) && adx < config.adxRangeThreshold) {
    weights = { ...config.weightsRanging };
    regime = 'RANGING';
  } else {
    weights = { ...config.weightsNeutral };
    regime = 'NEUTRAL';
  }

  // MADDE D: Haber modeli başarı oranı düşükse (%55 altı) haber ağırlığını sıfırla ve yeniden dağıt
  if (newsHitRate < 0.55) {
    const redistributed = weights.news;
    weights.news = 0;
    weights.trend = Number((weights.trend + redistributed * 0.5).toFixed(4));
    weights.value = Number((weights.value + redistributed * 0.5).toFixed(4));
  }

  // Normalizasyon Garantisi: Toplam tam 1.0 olmalı (±0.0001)
  const sum = weights.trend + weights.momentum + weights.volatility + weights.value + weights.news;
  if (Math.abs(sum - 1.0) > 0.0001 && sum > 0) {
    weights = {
      trend: Number((weights.trend / sum).toFixed(4)),
      momentum: Number((weights.momentum / sum).toFixed(4)),
      volatility: Number((weights.volatility / sum).toFixed(4)),
      value: Number((weights.value / sum).toFixed(4)),
      news: Number((weights.news / sum).toFixed(4)),
    };
  }

  return { weights, regime };
}
