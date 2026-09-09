import { DivergenceResult } from './types';

export interface PivotPoint {
  index: number;
  value: number;
  type: 'low' | 'high';
}

/**
 * Pure Pivot Bulucu
 * Bir nokta pivot-low sayılır eğer solundaki ve sağındaki minGapDays kadar günün hepsinden düşükse.
 * Pivot-high için tam tersi.
 */
export function findPivots(
  series: number[],
  lookback = 20,
  minGapDays = 3
): PivotPoint[] {
  if (!series || series.length < (minGapDays * 2 + 1)) {
    return [];
  }

  const pivots: PivotPoint[] = [];
  const startIndex = Math.max(minGapDays, series.length - lookback);
  const endIndex = series.length - minGapDays - 1;

  for (let i = startIndex; i <= endIndex; i++) {
    const current = series[i];
    if (typeof current !== 'number' || isNaN(current)) continue;

    // Check Pivot Low
    let isLow = true;
    for (let j = 1; j <= minGapDays; j++) {
      const left = series[i - j];
      const right = series[i + j];
      if (isNaN(left) || isNaN(right) || left <= current || right <= current) {
        isLow = false;
        break;
      }
    }

    if (isLow) {
      pivots.push({ index: i, value: current, type: 'low' });
      continue;
    }

    // Check Pivot High
    let isHigh = true;
    for (let j = 1; j <= minGapDays; j++) {
      const left = series[i - j];
      const right = series[i + j];
      if (isNaN(left) || isNaN(right) || left >= current || right >= current) {
        isHigh = false;
        break;
      }
    }

    if (isHigh) {
      pivots.push({ index: i, value: current, type: 'high' });
    }
  }

  return pivots;
}

/**
 * BÖLÜM 3 — Divergence (Uyumsuzluk) Tespit Algoritması
 * Fiyat ve RSI arasındaki pozitif (boğa) ve negatif (ayı) uyumsuzlukları kesin kurallarla tespit eder.
 */
export function detectDivergence(
  priceCloses: number[],
  rsiValues: number[],
  lookback = 20,
  minGapDays = 3
): DivergenceResult {
  if (
    !priceCloses ||
    !rsiValues ||
    priceCloses.length < (minGapDays * 2 + 1) ||
    rsiValues.length < (minGapDays * 2 + 1)
  ) {
    return { detected: false, details: 'Yetersiz veri serisi' };
  }

  const pricePivots = findPivots(priceCloses, lookback, minGapDays);
  const rsiPivots = findPivots(rsiValues, lookback, minGapDays);

  const priceLows = pricePivots.filter((p) => p.type === 'low').slice(-2);
  const rsiLows = rsiPivots.filter((p) => p.type === 'low').slice(-2);

  // Pozitif Uyumsuzluk (Boğa): Fiyat daha düşük dip yaparken, RSI daha yüksek dip yapar
  if (priceLows.length === 2 && rsiLows.length === 2) {
    const priceDirection = priceLows[1].value - priceLows[0].value;
    const rsiDirection = rsiLows[1].value - rsiLows[0].value;

    if (priceDirection < 0 && rsiDirection > 0) {
      const priceRelChange = Math.abs(priceDirection / (priceLows[0].value || 1));
      const rsiRelChange = Math.abs(rsiDirection / (rsiLows[0].value || 1));
      const strength = Number((rsiRelChange - priceRelChange).toFixed(3));

      return {
        detected: true,
        type: 'positive',
        strength: Math.max(strength, 0.1),
        details: `Pozitif Uyumsuzluk: Fiyat dip (${priceLows[0].value.toFixed(1)} -> ${priceLows[1].value.toFixed(1)}) düşerken RSI dip (${rsiLows[0].value.toFixed(1)} -> ${rsiLows[1].value.toFixed(1)}) yükseldi.`,
      };
    }
  }

  // Negatif Uyumsuzluk (Ayı): Fiyat daha yüksek tepe yaparken, RSI daha düşük tepe yapar
  const priceHighs = pricePivots.filter((p) => p.type === 'high').slice(-2);
  const rsiHighs = rsiPivots.filter((p) => p.type === 'high').slice(-2);

  if (priceHighs.length === 2 && rsiHighs.length === 2) {
    const priceDirection = priceHighs[1].value - priceHighs[0].value;
    const rsiDirection = rsiHighs[1].value - rsiHighs[0].value;

    if (priceDirection > 0 && rsiDirection < 0) {
      const priceRelChange = Math.abs(priceDirection / (priceHighs[0].value || 1));
      const rsiRelChange = Math.abs(rsiDirection / (rsiHighs[0].value || 1));
      const strength = Number((rsiRelChange - priceRelChange).toFixed(3));

      return {
        detected: true,
        type: 'negative',
        strength: Math.max(strength, 0.1),
        details: `Negatif Uyumsuzluk: Fiyat tepe (${priceHighs[0].value.toFixed(1)} -> ${priceHighs[1].value.toFixed(1)}) yükselirken RSI tepe (${rsiHighs[0].value.toFixed(1)} -> ${rsiHighs[1].value.toFixed(1)}) geriledi.`,
      };
    }
  }

  return { detected: false, details: 'Uyumsuzluk tespit edilmedi' };
}
