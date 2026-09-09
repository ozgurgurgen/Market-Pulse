/**
 * BÖLÜM 9 & MADDE C — Drift Detection (Kendi Kendini İzleme) Modülü
 * Canlı sinyal performansının backtest beklentisinden saptığını tespit eder ve otomatik koruma sağlar.
 * Tek Gerçeklik Kaynağı (Single Source of Truth) olarak yapılandırılmıştır.
 */

import { SignalOutcome, ExpectedStats, DriftResult } from './types';
import { JsonFileStore } from './persistence';

export interface DriftCheckResult {
  driftDetected: boolean;
  action: 'CONTINUE' | 'PAUSE_NEW_SIGNALS';
  liveWinRate: number;
  expectedWinRate: number;
  threshold: number;
  message: string;
  evaluatedAt: string;
}

export interface ModelDriftLogEntry extends DriftCheckResult {
  id: string;
  sampleSize: number;
}

// Doğrulanmış Walk-Forward & Çeyrek Kelly Çıktısı (98 işlem, %11.22 WR, bootstrap StdDev: 0.032)
export const DEFAULT_EXPECTED_STATS: ExpectedStats = {
  winRate: 0.1122,
  winRateStdDev: 0.032,
  avgReturn: -2.02,
  profitFactor: 0.365,
};

const driftLogsStore = new JsonFileStore<ModelDriftLogEntry>('model_drift_logs.json', []);
const outcomesStore = new JsonFileStore<SignalOutcome>('live_signal_outcomes.json', []);

let MODEL_DRIFT_LOGS: ModelDriftLogEntry[] = [];
let LIVE_SIGNAL_OUTCOMES: SignalOutcome[] = [];
let isSignalGenerationPausedState = false;

// İlk kalıcılık yüklemesi
driftLogsStore.load().then((logs) => {
  if (logs && logs.length > 0) {
    MODEL_DRIFT_LOGS = logs;
    const latest = logs[0];
    if (latest && latest.action === 'PAUSE_NEW_SIGNALS') {
      isSignalGenerationPausedState = true;
    }
  }
});

outcomesStore.load().then((outcomes) => {
  if (outcomes && outcomes.length > 0) {
    LIVE_SIGNAL_OUTCOMES = outcomes;
  }
});

/**
 * Canlı win-rate'i backtest istatistiksel beklentisinin 2 standart sapma altına düşüş açısından denetler.
 */
export function checkMonitorDrift(
  lastNLiveSignals: SignalOutcome[] = LIVE_SIGNAL_OUTCOMES,
  backtestExpectedStats: ExpectedStats = DEFAULT_EXPECTED_STATS
): DriftCheckResult {
  const expectedWinRate = backtestExpectedStats.winRate ?? DEFAULT_EXPECTED_STATS.winRate;
  const stdDev = backtestExpectedStats.winRateStdDev ?? DEFAULT_EXPECTED_STATS.winRateStdDev;
  const defaultThreshold = expectedWinRate - (2 * stdDev);

  if (!lastNLiveSignals || lastNLiveSignals.length === 0) {
    return {
      driftDetected: false,
      action: 'CONTINUE',
      liveWinRate: expectedWinRate,
      expectedWinRate: expectedWinRate,
      threshold: Number(defaultThreshold.toFixed(3)),
      message: 'Henüz yeterli canlı sinyal sonucu birikmedi. Sistem normal modda çalışıyor.',
      evaluatedAt: new Date().toISOString(),
    };
  }

  const sampleSize = lastNLiveSignals.length;
  const wins = lastNLiveSignals.filter((s) => s.wasWin).length;
  const liveWinRate = wins / sampleSize;
  const threshold = expectedWinRate - (2 * stdDev);

  let result: DriftCheckResult;

  if (liveWinRate < threshold) {
    isSignalGenerationPausedState = true;
    result = {
      driftDetected: true,
      action: 'PAUSE_NEW_SIGNALS',
      liveWinRate: Number(liveWinRate.toFixed(3)),
      expectedWinRate,
      threshold: Number(threshold.toFixed(3)),
      message: `⚠️ DİKKAT: Model Sapması Tespit Edildi! Canlı kazanma oranı (%${(liveWinRate * 100).toFixed(1)}), backtest beklentisinin (%${(expectedWinRate * 100).toFixed(1)}) 2 standart sapma altına (Eşik: %${(threshold * 100).toFixed(1)}) düştü. Yeni sinyal üretimi otomatik duraklatıldı.`,
      evaluatedAt: new Date().toISOString(),
    };
  } else {
    isSignalGenerationPausedState = false;
    result = {
      driftDetected: false,
      action: 'CONTINUE',
      liveWinRate: Number(liveWinRate.toFixed(3)),
      expectedWinRate,
      threshold: Number(threshold.toFixed(3)),
      message: `Model istikrarlı. Canlı kazanma oranı (%${(liveWinRate * 100).toFixed(1)}) normal aralıkta (Beklenen: %${(expectedWinRate * 100).toFixed(1)}).`,
      evaluatedAt: new Date().toISOString(),
    };
  }

  // Log kaydı
  const logEntry: ModelDriftLogEntry = {
    ...result,
    id: `drift-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    sampleSize,
  };
  MODEL_DRIFT_LOGS.unshift(logEntry);
  if (MODEL_DRIFT_LOGS.length > 100) MODEL_DRIFT_LOGS.pop();

  driftLogsStore.append(logEntry).catch(() => {});

  return result;
}

export function recordSignalOutcome(outcome: SignalOutcome): void {
  LIVE_SIGNAL_OUTCOMES.unshift(outcome);
  if (LIVE_SIGNAL_OUTCOMES.length > 500) LIVE_SIGNAL_OUTCOMES.pop();

  outcomesStore.append(outcome).catch(() => {});
  
  // Her yeni sonuçta drift denetimini otomatik tetikle
  checkMonitorDrift(LIVE_SIGNAL_OUTCOMES);
}

export function getRecordedSignalOutcomes(): SignalOutcome[] {
  return [...LIVE_SIGNAL_OUTCOMES];
}

export function getModelDriftLogs(): ModelDriftLogEntry[] {
  return [...MODEL_DRIFT_LOGS];
}

export function getDriftLogs(): DriftResult[] {
  return MODEL_DRIFT_LOGS.map((log) => ({
    driftDetected: log.driftDetected,
    action: log.action === 'PAUSE_NEW_SIGNALS' ? 'PAUSE_NEW_SIGNALS' : 'NORMAL',
    liveWinRate: log.liveWinRate,
    expectedWinRate: log.expectedWinRate,
    threshold: log.threshold,
    message: log.message,
    evaluatedAt: log.evaluatedAt,
  }));
}

export function isSignalGenerationPaused(): boolean {
  return isSignalGenerationPausedState;
}

export function resetSignalGenerationPause(): void {
  isSignalGenerationPausedState = false;
}

// Bütünleşik Alias
export const checkModelDrift = checkMonitorDrift;
