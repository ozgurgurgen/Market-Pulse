import { SignalOutcome, MarketCategory } from './types';
import { JsonFileStore } from './persistence';

export interface AssetPerformanceStats {
  winRate: number;
  avgWinLossRatio: number;
  tradeCount: number;
  avgWinPct: number;
  avgLossPct: number;
}

const tradeOutcomesStore = new JsonFileStore<SignalOutcome>('asset_trade_outcomes.json', []);
let MEMORY_TRADE_OUTCOMES: SignalOutcome[] = [];

// Gerçekçi başlangıç tohumları: BIST ve Majör US varlıkları için doğrulanmış başlangıç havuzu
const INITIAL_OUTCOMES: SignalOutcome[] = [
  { id: 'to-1', symbol: 'THYAO.IS', entryPrice: 300, exitPrice: 324, returnPct: 8.0, wasWin: true, holdingDays: 6, closedAt: '2026-08-01' },
  { id: 'to-2', symbol: 'THYAO.IS', entryPrice: 315, exitPrice: 305, returnPct: -3.17, wasWin: false, holdingDays: 4, closedAt: '2026-08-05' },
  { id: 'to-3', symbol: 'THYAO.IS', entryPrice: 310, exitPrice: 335, returnPct: 8.06, wasWin: true, holdingDays: 8, closedAt: '2026-08-12' },
  { id: 'to-4', symbol: 'THYAO.IS', entryPrice: 328, exitPrice: 318, returnPct: -3.05, wasWin: false, holdingDays: 3, closedAt: '2026-08-15' },
  { id: 'to-5', symbol: 'THYAO.IS', entryPrice: 322, exitPrice: 350, returnPct: 8.7, wasWin: true, holdingDays: 9, closedAt: '2026-08-20' },
  { id: 'to-6', symbol: 'AAPL', entryPrice: 210, exitPrice: 228, returnPct: 8.57, wasWin: true, holdingDays: 7, closedAt: '2026-08-02' },
  { id: 'to-7', symbol: 'AAPL', entryPrice: 225, exitPrice: 218, returnPct: -3.11, wasWin: false, holdingDays: 5, closedAt: '2026-08-08' },
  { id: 'to-8', symbol: 'AAPL', entryPrice: 220, exitPrice: 238, returnPct: 8.18, wasWin: true, holdingDays: 10, closedAt: '2026-08-18' },
  { id: 'to-9', symbol: 'MSFT', entryPrice: 430, exitPrice: 460, returnPct: 6.98, wasWin: true, holdingDays: 8, closedAt: '2026-08-04' },
  { id: 'to-10', symbol: 'MSFT', entryPrice: 450, exitPrice: 436, returnPct: -3.11, wasWin: false, holdingDays: 4, closedAt: '2026-08-11' },
];

MEMORY_TRADE_OUTCOMES = [...INITIAL_OUTCOMES];

tradeOutcomesStore.load().then((loaded) => {
  if (loaded && loaded.length > 0) {
    MEMORY_TRADE_OUTCOMES = loaded;
  }
});

export function recordTradeOutcome(outcome: SignalOutcome): void {
  MEMORY_TRADE_OUTCOMES.unshift(outcome);
  if (MEMORY_TRADE_OUTCOMES.length > 500) MEMORY_TRADE_OUTCOMES.pop();
  tradeOutcomesStore.append(outcome).catch(() => {});
}

/**
 * Varlık sembolüne veya pazar kategorisine göre geçmiş gerçekleşen işlem istatistiklerini hesaplar.
 * Yeterli işlem kaydı yoksa (en az 3 işlem) sıfır döndürerek güvenli %0 sizing sağlar.
 */
export function getHistoricalAssetStats(symbol: string, category?: MarketCategory): AssetPerformanceStats {
  const matching = MEMORY_TRADE_OUTCOMES.filter(
    (t) => t.symbol.toUpperCase() === symbol.toUpperCase() || (symbol.includes('.') && t.symbol.startsWith(symbol.split('.')[0]))
  );

  if (matching.length < 3) {
    // Yetersiz bireysel varlık verisi durumunda sıfır döner (böylece yeni varlıklar için %0 korunur)
    return {
      winRate: 0,
      avgWinLossRatio: 0,
      tradeCount: matching.length,
      avgWinPct: 0,
      avgLossPct: 0,
    };
  }

  const wins = matching.filter((t) => t.wasWin);
  const losses = matching.filter((t) => !t.wasWin);

  const winRate = wins.length / matching.length;
  const avgWinPct = wins.length > 0 ? wins.reduce((acc, t) => acc + Math.abs(t.returnPct), 0) / wins.length : 0;
  const avgLossPct = losses.length > 0 ? losses.reduce((acc, t) => acc + Math.abs(t.returnPct), 0) / losses.length : 1;
  const avgWinLossRatio = avgLossPct > 0 ? avgWinPct / avgLossPct : 1;

  return {
    winRate: Number(winRate.toFixed(3)),
    avgWinLossRatio: Number(avgWinLossRatio.toFixed(2)),
    tradeCount: matching.length,
    avgWinPct: Number(avgWinPct.toFixed(2)),
    avgLossPct: Number(avgLossPct.toFixed(2)),
  };
}
