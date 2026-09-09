import {
  CategoryScores,
  WeightConfig,
  SignalThresholds,
  SignalLabel,
  SignalTypeCode,
} from './types';
import { DEFAULT_SIGNAL_ENGINE_CONFIG } from './config';
import { clamp } from './indicators';

/**
 * BÖLÜM 5 — Kompozit Skor Hesaplayıcı
 * 5 bağımsız kategorinin ağırlıklı ortalamasını alır (-100 .. +100)
 */
export function calculateCompositeScore(
  scores: CategoryScores,
  weights: WeightConfig
): number {
  const composite =
    (scores.trend || 0) * (weights.trend || 0) +
    (scores.momentum || 0) * (weights.momentum || 0) +
    (scores.volatility || 0) * (weights.volatility || 0) +
    (scores.value || 0) * (weights.value || 0) +
    (scores.news || 0) * (weights.news || 0);

  return Math.round(clamp(composite, -100, 100));
}

/**
 * BÖLÜM 5 — Sinyal Üretim Fonksiyonu
 * Eşik puanlarına göre dürüst, olasılıksal sinyal etiketini ve tipini döner.
 */
export function generateSignal(
  compositeScore: number,
  thresholds: SignalThresholds = DEFAULT_SIGNAL_ENGINE_CONFIG.thresholds
): { label: SignalLabel; type: SignalTypeCode } {
  if (compositeScore > thresholds.strongBuyThreshold) {
    return { label: 'GÜÇLÜ TERCİH', type: 'STRONG_BUY' };
  } else if (compositeScore >= thresholds.buyThreshold) {
    return { label: 'KADEMELİ AL', type: 'BUY' };
  } else if (compositeScore >= thresholds.exitThreshold) {
    return { label: 'İZLEMEDE KAL', type: 'WATCH' };
  } else {
    return { label: 'UZAK DUR / ÇIK', type: 'SELL' };
  }
}
