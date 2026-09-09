import { SignalEngineConfig } from './types';

/**
 * Sinyal Motoru v2 — Merkezi Yapılandırma Objesi
 * Tüm katsayılar, ağırlıklar, eşikler ve risk limitleri burada tanımlanır.
 * Walk-Forward Optimizasyonu ve Monte Carlo analizleri bu yapılandırmayı parametrik olarak günceller.
 */
export const DEFAULT_SIGNAL_ENGINE_CONFIG: SignalEngineConfig = {
  version: '2.1.0-audited-robust',
  
  // Rejim bazlı ağırlıklandırma (Toplamları daima 1.0)
  weightsTrending: {
    trend: 0.45,
    momentum: 0.15,
    volatility: 0.10,
    value: 0.20,
    news: 0.10,
  },
  weightsRanging: {
    trend: 0.15,
    momentum: 0.30,
    volatility: 0.25,
    value: 0.20,
    news: 0.10,
  },
  weightsNeutral: {
    trend: 0.30,
    momentum: 0.20,
    volatility: 0.15,
    value: 0.20,
    news: 0.15,
  },

  // Sinyal eşik puanları (-100 .. +100 arası kompozit skor)
  thresholds: {
    strongBuyThreshold: 60,  // > 60 -> GÜÇLÜ TERCİH
    buyThreshold: 30,        // 30..60 -> KADEMELİ AL
    exitThreshold: -30,      // < -30 -> UZAK DUR / ÇIK
  },

  // Kelly Kriteri ve Sermaye Tavanı
  kellyConfig: {
    hardCapPct: 0.08,        // Sermayenin maksimum %8'i tek hisseye
    kellyMultiplier: 0.25,   // Çeyrek Kelly (risk yumuşatma)
  },

  // Portföy Seviyesi Risk Kısıtları
  riskConfig: {
    maxSameSectorPositions: 2,  // Aynı sektörden max 2 pozisyon
    maxTotalOpenRiskPct: 0.15,   // Portföy toplam açık zarara maruz risk max %15
    maxDailyNewPositions: 3,     // Günde max 3 yeni pozisyon açılışı
  },

  minDataPointsRequired: 30,
  adxTrendThreshold: 25,       // ADX > 25 -> Trend Rejimi
  adxRangeThreshold: 20,       // ADX < 20 -> Yatay/Salınım Rejimi
  baseSlippage: 0.001,         // %0.10 baz kayma (10 bps)
  baseCommission: 0.0005,      // %0.05 BIST/aracı kurum komisyonu (5 bps)
  defaultRiskRewardRatio: 3.0, // Varsayılan Risk/Ödül Oranı (1:3.0)
};

/**
 * Parametre klonlama ve güncelleme yardımcısı
 */
export function createCustomEngineConfig(overrides?: Partial<SignalEngineConfig>): SignalEngineConfig {
  return {
    ...DEFAULT_SIGNAL_ENGINE_CONFIG,
    ...overrides,
    weightsTrending: { ...DEFAULT_SIGNAL_ENGINE_CONFIG.weightsTrending, ...overrides?.weightsTrending },
    weightsRanging: { ...DEFAULT_SIGNAL_ENGINE_CONFIG.weightsRanging, ...overrides?.weightsRanging },
    weightsNeutral: { ...DEFAULT_SIGNAL_ENGINE_CONFIG.weightsNeutral, ...overrides?.weightsNeutral },
    thresholds: { ...DEFAULT_SIGNAL_ENGINE_CONFIG.thresholds, ...overrides?.thresholds },
    kellyConfig: { ...DEFAULT_SIGNAL_ENGINE_CONFIG.kellyConfig, ...overrides?.kellyConfig },
    riskConfig: { ...DEFAULT_SIGNAL_ENGINE_CONFIG.riskConfig, ...overrides?.riskConfig },
  };
}
