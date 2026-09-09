import { KellyPositionConfig } from './types';
import { DEFAULT_SIGNAL_ENGINE_CONFIG } from './config';

export interface PositionSizingResult {
  recommendedAmount: number;
  recommendedPct: number; // e.g. 0.06 (6%)
  fullKellyPct: number;
  quarterKellyPct: number;
  isHardCapped: boolean;
  equityUsed: number;
}

/**
 * BÖLÜM 6 — Çeyrek Kelly Kriteri + Sabit Sermaye Tavanı
 * Matematiksel risk optimizasyonu sağlar. Asla negatif sermaye önermez ve tavanı aşmaz.
 * Geçersiz, eksik veya sıfır kazanma oranı girdilerinde güvenli olarak %0 önerir.
 */
export function calculatePositionSize(
  winRate: number,
  avgWinLossRatio: number,
  accountEquity: number,
  config: KellyPositionConfig = DEFAULT_SIGNAL_ENGINE_CONFIG.kellyConfig
): PositionSizingResult {
  // Geçersiz / negatif / tanımsız girdiler için güvenli koruma (%0 tahsisat)
  if (
    typeof winRate !== 'number' ||
    typeof avgWinLossRatio !== 'number' ||
    typeof accountEquity !== 'number' ||
    winRate <= 0 ||
    avgWinLossRatio <= 0 ||
    accountEquity <= 0 ||
    isNaN(winRate) ||
    isNaN(avgWinLossRatio) ||
    isNaN(accountEquity)
  ) {
    return {
      recommendedAmount: 0,
      recommendedPct: 0,
      fullKellyPct: 0,
      quarterKellyPct: 0,
      isHardCapped: false,
      equityUsed: Math.max(0, accountEquity || 0),
    };
  }

  // Full Kelly = W - (1 - W) / R
  const fullKelly = winRate - (1 - winRate) / avgWinLossRatio;

  // Çeyrek Kelly = max(Full Kelly * 0.25, 0.0)
  const quarterKelly = Math.max(fullKelly * config.kellyMultiplier, 0.0);

  // Sabit Tavan Kısıtı = min(quarterKelly, hardCapPct)
  const finalPct = Math.min(quarterKelly, config.hardCapPct);
  const isHardCapped = quarterKelly > config.hardCapPct;

  const recommendedAmount = Math.round(accountEquity * finalPct);

  return {
    recommendedAmount,
    recommendedPct: Number(finalPct.toFixed(4)),
    fullKellyPct: Number(fullKelly.toFixed(4)),
    quarterKellyPct: Number(quarterKelly.toFixed(4)),
    isHardCapped,
    equityUsed: accountEquity,
  };
}
