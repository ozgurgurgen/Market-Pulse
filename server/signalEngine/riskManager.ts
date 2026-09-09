import { Position, SignalCandidate, PortfolioRiskConfig } from './types';
import { DEFAULT_SIGNAL_ENGINE_CONFIG } from './config';

export interface RiskCheckResult {
  allowed: boolean;
  reason?: string;
  sameSectorCount: number;
  currentOpenRiskPct: number;
  candidateRiskPct: number;
  totalRiskAfter: number;
  todayPositionsCount: number;
}

/**
 * Pure Helper: Bugün açılan pozisyon sayısını say
 */
export function countPositionsOpenedToday(
  openPositions: Position[],
  referenceDateISO?: string
): number {
  if (!openPositions || openPositions.length === 0) return 0;
  const targetDateStr = (referenceDateISO || new Date().toISOString()).split('T')[0];
  return openPositions.filter((pos) => {
    if (!pos.openedAt) return false;
    return pos.openedAt.split('T')[0] === targetDateStr;
  }).length;
}

/**
 * BÖLÜM 7 — Portföy Seviyesi Risk Kısıtları Kontrolü
 * 1. Aynı sektör yoğunlaşma kısıtı (max 2)
 * 2. Toplam açık zarar maruziyeti kısıtı (max %15)
 * 3. Günlük yeni pozisyon kısıtı (max 3)
 */
export function canOpenNewPosition(
  candidate: SignalCandidate,
  openPositions: Position[] = [],
  config: PortfolioRiskConfig = DEFAULT_SIGNAL_ENGINE_CONFIG.riskConfig,
  currentDateISO?: string
): RiskCheckResult {
  // 1. Sektör Yoğunlaşma Kontrolü
  const sameSectorCount = openPositions.filter(
    (pos) => pos.sector && candidate.sector && pos.sector.toLowerCase() === candidate.sector.toLowerCase()
  ).length;

  if (sameSectorCount >= config.maxSameSectorPositions) {
    return {
      allowed: false,
      reason: `Sektör Limiti Aşıldı: "${candidate.sector}" sektöründe halihazırda ${sameSectorCount} açık pozisyon var (Maksimum: ${config.maxSameSectorPositions}).`,
      sameSectorCount,
      currentOpenRiskPct: 0,
      candidateRiskPct: 0,
      totalRiskAfter: 0,
      todayPositionsCount: 0,
    };
  }

  // 2. Toplam Açık Risk (Total Open Risk) Kontrolü
  // Formül: Risk = ((Giriş - StopLoss) / Giriş) * PozisyonBüyüklüğü%
  let currentOpenRiskPct = 0;
  for (const pos of openPositions) {
    if (pos.entryPrice > 0 && pos.stopLoss > 0 && pos.positionSizePct > 0) {
      const riskPerPos = ((pos.entryPrice - pos.stopLoss) / pos.entryPrice) * pos.positionSizePct;
      currentOpenRiskPct += Math.max(riskPerPos, 0);
    }
  }

  let candidateRiskPct = 0;
  if (candidate.entryPrice > 0 && candidate.stopLoss > 0 && candidate.positionSizePct > 0) {
    const riskDistance = (candidate.entryPrice - candidate.stopLoss) / candidate.entryPrice;
    candidateRiskPct = Math.max(riskDistance * candidate.positionSizePct, 0);
  }

  const totalRiskAfter = currentOpenRiskPct + candidateRiskPct;

  if (totalRiskAfter > config.maxTotalOpenRiskPct + 0.0001) {
    return {
      allowed: false,
      reason: `Toplam Portföy Risk Limiti Aşıldı: Mevcut risk %${(currentOpenRiskPct * 100).toFixed(1)} + Yeni risk %${(candidateRiskPct * 100).toFixed(1)} = %${(totalRiskAfter * 100).toFixed(1)} (Maksimum İzin Verilen: %${(config.maxTotalOpenRiskPct * 100).toFixed(1)}).`,
      sameSectorCount,
      currentOpenRiskPct: Number(currentOpenRiskPct.toFixed(4)),
      candidateRiskPct: Number(candidateRiskPct.toFixed(4)),
      totalRiskAfter: Number(totalRiskAfter.toFixed(4)),
      todayPositionsCount: 0,
    };
  }

  // 3. Günlük Yeni Pozisyon Açılış Limiti Kontrolü
  const todayPositionsCount = countPositionsOpenedToday(openPositions, currentDateISO);
  if (todayPositionsCount >= config.maxDailyNewPositions) {
    return {
      allowed: false,
      reason: `Günlük İşlem Limiti Aşıldı: Bugün halihazırda ${todayPositionsCount} adet yeni pozisyon açıldı (Maksimum: ${config.maxDailyNewPositions}).`,
      sameSectorCount,
      currentOpenRiskPct: Number(currentOpenRiskPct.toFixed(4)),
      candidateRiskPct: Number(candidateRiskPct.toFixed(4)),
      totalRiskAfter: Number(totalRiskAfter.toFixed(4)),
      todayPositionsCount,
    };
  }

  return {
    allowed: true,
    sameSectorCount,
    currentOpenRiskPct: Number(currentOpenRiskPct.toFixed(4)),
    candidateRiskPct: Number(candidateRiskPct.toFixed(4)),
    totalRiskAfter: Number(totalRiskAfter.toFixed(4)),
    todayPositionsCount,
  };
}
