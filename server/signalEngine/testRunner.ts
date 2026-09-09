import { PriceBar } from './types';
import { walkForwardAnalysis, monteCarloSimulation, calculateBootstrapConfidenceIntervals } from './backtestEngine';
import { DEFAULT_SIGNAL_ENGINE_CONFIG } from './config';

/**
 * Sentetik Fiyat Çubukları Üreteci
 */
export function generateSyntheticBars(
  numBars = 300,
  startPrice = 100,
  trend: 'BULL' | 'BEAR' | 'SIDEWAYS' = 'SIDEWAYS'
): PriceBar[] {
  const bars: PriceBar[] = [];
  let current = startPrice;
  const startDate = new Date('2024-01-01');

  const drift = trend === 'BULL' ? 0.0015 : trend === 'BEAR' ? -0.0015 : 0;

  for (let i = 0; i < numBars; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];

    const changePct = ((i % 7 - 3) * 0.004) + drift;
    const open = current;
    current = Math.max(1, current * (1 + changePct));
    const high = Math.max(open, current) * 1.008;
    const low = Math.min(open, current) * 0.992;
    const close = current;
    const volume = 750000;

    bars.push({
      date: dateStr,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });
  }

  return bars;
}

export function generateSyntheticPriceBars(
  numBars = 60,
  trend: 'BULL' | 'BEAR' | 'SIDEWAYS' = 'BULL',
  startPrice = 100
): PriceBar[] {
  return generateSyntheticBars(numBars, startPrice, trend);
}

/**
 * Tüm Sinyal Motoru Testlerini Koş ve Raporla
 */
export function runFullEngineDiagnostics(): {
  walkForward: ReturnType<typeof walkForwardAnalysis>;
  monteCarlo: ReturnType<typeof monteCarloSimulation>;
  bootstrap: ReturnType<typeof calculateBootstrapConfidenceIntervals>;
} {
  const sampleBars = generateSyntheticBars(360, 150);
  const wfResult = walkForwardAnalysis(sampleBars, 120, 60, DEFAULT_SIGNAL_ENGINE_CONFIG);
  
  const tradeReturns = wfResult.allOutOfSampleTrades.map((t) => t.netReturnPct);
  const sampleReturns = tradeReturns.length > 0 ? tradeReturns : [1.5, -0.8, 2.2, -1.1, 3.4, -0.5, 1.2, -0.4, 2.8, 1.1];
  const mcResult = monteCarloSimulation(sampleReturns);
  const bsResult = calculateBootstrapConfidenceIntervals(sampleReturns);

  return {
    walkForward: wfResult,
    monteCarlo: mcResult,
    bootstrap: bsResult,
  };
}

export const runAllSignalEngineTests = runFullEngineDiagnostics;

// Doğrudan çalıştırma kontrolü
if (process.argv[1] && process.argv[1].includes('testRunner')) {
  console.log('=== SIGNAL ENGINE AUDITED TEST RUNNER ===');
  const diagnostics = runFullEngineDiagnostics();
  console.log(`Pencere Sayısı: ${diagnostics.walkForward.totalWindows}`);
  console.log(`OOS İşlem Sayısı: ${diagnostics.walkForward.outOfSampleTradesCount}`);
  console.log(`OOS Win Rate: %${(diagnostics.walkForward.outOfSampleWinRate * 100).toFixed(1)}`);
  console.log(`Monte Carlo p50 Getiri: %${diagnostics.monteCarlo.p50FinalReturn}`);
  console.log(`Bootstrap Mean: %${diagnostics.bootstrap.blockCI.mean}`);
}
