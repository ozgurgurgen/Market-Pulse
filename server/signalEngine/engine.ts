import {
  SignalEngineConfig,
  SignalEngineResult,
  TechnicalIndicatorsData,
  FundamentalsData,
  ValidatedNlpData,
  Position,
  SignalCandidate,
  MarketCategory,
} from './types';
import { DEFAULT_SIGNAL_ENGINE_CONFIG } from './config';
import { calculateAllCategoryScores, calculateAtrBasedTargets, calculateRSI } from './indicators';
import { detectDivergence } from './divergence';
import { calculateADX, getDynamicWeights } from './regime';
import { calculateCompositeScore, generateSignal } from './ensemble';
import { calculatePositionSize } from './positionSizer';
import { canOpenNewPosition } from './riskManager';
import { getNewsTrackerStats } from './newsTracker';
import { isSignalGenerationPaused } from './driftMonitor';

export interface EvaluateAssetInput {
  symbol: string;
  name: string;
  sector: string;
  category: MarketCategory;
  currentPrice: number;
  highs: number[];
  lows: number[];
  closes: number[];
  volumes: number[];
  rsi14Series?: number[];
  technicalData?: Partial<TechnicalIndicatorsData>;
  fundamentals?: FundamentalsData;
  nlpData?: ValidatedNlpData;
  accountEquity?: number;
  openPositions?: Position[];
  config?: SignalEngineConfig;
  newsHitRateLast90Days?: number;
  historicalWinRate?: number;
  historicalAvgWinLossRatio?: number;
}

/**
 * Sinyal Motoru v2 — Ana Değerlendirme Fonksiyonu
 * Tüm 5 bağımsız kategoriyi, ADX rejimini, divergence tespitini, ensemble kompozit skoru,
 * Çeyrek Kelly pozisyon büyüklüğünü ve portföy risk kısıtlarını uçtan uca birleştirir.
 */
export function evaluateAssetSignalV2(input: EvaluateAssetInput): SignalEngineResult {
  const config = input.config || DEFAULT_SIGNAL_ENGINE_CONFIG;
  const currentPrice = input.currentPrice || (input.closes && input.closes.length > 0 ? input.closes[input.closes.length - 1] : 0);
  const highs = input.highs || [];
  const lows = input.lows || [];
  const closes = input.closes || [];

  const defaultRR = config.defaultRiskRewardRatio || 3.0;

  // 1. Devre Kesici (Drift Kontrolü): Model sapması tespit edilmişse yeni sinyal üretimini durdur
  if (isSignalGenerationPaused()) {
    return {
      symbol: input.symbol,
      name: input.name,
      sector: input.sector,
      category: input.category,
      currentPrice,
      adx: 0,
      regime: 'NEUTRAL',
      categoryScores: {
        trend: 0,
        momentum: 0,
        volatility: 0,
        value: 0,
        news: 0,
        categoryDetails: {
          trendReason: 'Drift Koruma Modu Aktif',
          momentumReason: 'Drift Koruma Modu Aktif',
          volatilityReason: 'Drift Koruma Modu Aktif',
          valueReason: 'Drift Koruma Modu Aktif',
          newsReason: 'Drift Koruma Modu Aktif',
        },
      },
      weightsUsed: config.weightsNeutral,
      compositeScore: 0,
      dataQuality: 'INSUFFICIENT_DATA',
      signalLabel: 'İZLEMEDE KAL',
      signalType: 'WATCH',
      positionSizing: {
        recommendedPct: 0,
        recommendedAmount: 0,
        quarterKellyPct: 0,
        fullKellyPct: 0,
        isHardCapped: false,
        equityUsed: input.accountEquity || 100000,
      },
      divergence: { detected: false, details: 'Model drift nedeniyle sistem duraklatıldı' },
      riskRewardRatio: `1:${defaultRR.toFixed(1)}`,
      stopLoss: currentPrice,
      targetShortTerm: currentPrice,
      targetMidTerm: currentPrice,
      isPortfolioApproved: false,
      portfolioRejectionReason: 'Drift tespiti nedeniyle sinyal üretimi duraklatıldı',
      generatedAt: new Date().toISOString(),
    };
  }

  // 2. Dinamik Haber Hit-Rate Bağlantısı
  const effectiveNewsHitRate = input.newsHitRateLast90Days ?? getNewsTrackerStats().currentHitRate;

  // 3. Rejim Tespiti (Wilder ADX) & Dinamik Ağırlıklar
  const adx = calculateADX(highs, lows, closes);
  const { weights, regime } = getDynamicWeights(adx, config, effectiveNewsHitRate);

  // 4. Canlı Divergence (Uyumsuzluk) Tespiti — Tam RSI serisiyle
  let rsiSeries: number[] = input.rsi14Series || [];
  if ((!rsiSeries || rsiSeries.length < 7) && closes.length >= 15) {
    rsiSeries = calculateRSI(closes, 14);
  }
  const divergence = detectDivergence(
    closes.slice(Math.max(0, closes.length - 21)),
    rsiSeries.slice(Math.max(0, rsiSeries.length - 21))
  );

  // 5. 5 Bağımsız Kategori Skorları
  const currentRsi = rsiSeries.length > 0 ? rsiSeries[rsiSeries.length - 1] : input.technicalData?.rsi14;
  const categoryScores = calculateAllCategoryScores({
    technicalData: {
      price: currentPrice,
      ...input.technicalData,
      rsi14: currentRsi,
    },
    fundamentals: input.fundamentals,
    nlpData: input.nlpData,
    divergence,
    newsHitRateLast90Days: effectiveNewsHitRate,
  });

  // 6. Kompozit Skor & Sinyal Üretimi
  const compositeScore = calculateCompositeScore(categoryScores, weights);
  const signal = generateSignal(compositeScore, config.thresholds);
  const isInsufficientData = closes.length < 14 && (!input.technicalData || !input.technicalData.rsi14);
  const dataQuality: 'OK' | 'INSUFFICIENT_DATA' = isInsufficientData ? 'INSUFFICIENT_DATA' : 'OK';

  // 7. Pozisyon Büyüklüğü (Çeyrek Kelly + Sabit Tavan) — İyimser Sahte Default Yoktur
  const accountEquity = input.accountEquity || 100000;
  const winRate = typeof input.historicalWinRate === 'number' ? input.historicalWinRate : 0;
  const avgWinLoss = typeof input.historicalAvgWinLossRatio === 'number' ? input.historicalAvgWinLossRatio : 0;

  const sizing = calculatePositionSize(winRate, avgWinLoss, accountEquity, config.kellyConfig);

  // 8. Stop-Loss & Hedef Fiyatlar (ATR tabanlı deterministik hesaplama)
  const atr14 = input.technicalData?.atr14 || currentPrice * 0.032;
  const targets = calculateAtrBasedTargets(currentPrice, atr14, defaultRR);
  const stopLoss = targets.stopLoss;
  const targetShortTerm = targets.targetShortTerm;
  const targetMidTerm = targets.targetMidTerm;

  const candidate: SignalCandidate = {
    symbol: input.symbol,
    name: input.name,
    sector: input.sector,
    category: input.category,
    entryPrice: currentPrice,
    stopLoss,
    targetPrice1: targetShortTerm,
    targetPrice2: targetMidTerm,
    positionSizePct: sizing.recommendedPct,
  };

  // 9. Portföy Risk Kısıtları Kontrolü
  const riskCheck = canOpenNewPosition(candidate, input.openPositions || [], config.riskConfig);

  // 10. Risk/Ödül Oranı ve Gerçek Trade Geometrisi Expectancy Hesabı
  const riskDiff = Math.max(0.001, currentPrice - stopLoss);
  const rewardDiff = Math.max(0.001, targetMidTerm - currentPrice);
  const riskRewardRatio = `1:${(rewardDiff / riskDiff).toFixed(1)}`;

  const avgWinPct = currentPrice > 0 ? (targetMidTerm - currentPrice) / currentPrice : 0;
  const avgLossPct = currentPrice > 0 ? (currentPrice - stopLoss) / currentPrice : 0;
  const expectancyPct =
    winRate > 0 && avgWinLoss > 0
      ? Number(((winRate * avgWinPct - (1 - winRate) * avgLossPct) * 100).toFixed(2))
      : 0;

  return {
    symbol: input.symbol,
    name: input.name,
    sector: input.sector,
    category: input.category,
    currentPrice,
    adx: isNaN(adx) ? 0 : adx,
    regime,
    categoryScores,
    weightsUsed: weights,
    compositeScore,
    dataQuality,
    signalLabel: signal.label,
    signalType: signal.type,
    positionSizing: {
      recommendedPct: sizing.recommendedPct,
      recommendedAmount: sizing.recommendedAmount,
      quarterKellyPct: sizing.quarterKellyPct,
      fullKellyPct: sizing.fullKellyPct,
      isHardCapped: sizing.isHardCapped,
      equityUsed: sizing.equityUsed,
    },
    divergence,
    riskRewardRatio,
    stopLoss,
    targetShortTerm,
    targetMidTerm,
    isPortfolioApproved: riskCheck.allowed,
    portfolioRejectionReason: riskCheck.reason,
    expectedValueMetrics: {
      winRate,
      avgWinLossRatio: avgWinLoss,
      expectancyPct,
    },
    generatedAt: new Date().toISOString(),
  };
}
