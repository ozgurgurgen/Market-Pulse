import { PriceBar, SignalEngineConfig, WeightConfig, SignalThresholds } from './types';
import { DEFAULT_SIGNAL_ENGINE_CONFIG, createCustomEngineConfig } from './config';
import { calculateTrendScore, calculateMomentumScore, calculateVolatilityScore, calculateValueScore, calculateNewsScore, calculateEMA, calculateSMA, calculateRSI, calculateATR, calculateAtrBasedTargets } from './indicators';
import { calculateADX, getDynamicWeights } from './regime';
import { calculateCompositeScore, generateSignal } from './ensemble';
import { detectDivergence } from './divergence';

export const RISK_FREE_RATES = {
  TRY: 0.40,   // BIST hisseleri için yıllık risksiz getiri oranı (%40)
  USD: 0.045,  // Kripto / USD varlıklar için ABD risksiz getiri oranı (%4.5)
};

/**
 * Deterministik / Tohumlu Sözde Rastgele Sayı Üreteci (Mulberry32)
 */
export function createMulberry32(seed = 42): () => number {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface BacktestTrade {
  entryDate: string;
  exitDate: string;
  symbol: string;
  signalType: string;
  compositeScore: number;
  entryPrice: number;
  effectiveEntryPrice: number;
  exitPrice: number;
  effectiveExitPrice: number;
  grossReturnPct: number;
  netReturnPct: number;
  stopLoss: number;
  takeProfit: number;
  holdingDays: number;
  isWin: boolean;
  exitReason: 'TARGET' | 'STOP_LOSS' | 'TIME_EXIT' | 'SIGNAL_FLIP';
}

/**
 * Para Birimine Göre Yıllıklandırılmış Sharpe Oranı Hesaplayıcı
 */
export function calculateSharpeRatio(
  returnsPct: number[],
  assetCurrency: 'TRY' | 'USD' = 'TRY',
  tradesPerYear = 36
): number {
  if (!returnsPct || returnsPct.length < 2) return 0;
  const rf = RISK_FREE_RATES[assetCurrency];
  const meanReturn = returnsPct.reduce((a, b) => a + b, 0) / returnsPct.length;
  const variance = returnsPct.reduce((s, r) => s + Math.pow(r - meanReturn, 2), 0) / (returnsPct.length - 1);
  const stdDev = Math.sqrt(variance);
  if (stdDev <= 0) return 0;

  // Yıllıklandırılmış getiri ve volatilite
  const annualizedReturnPct = meanReturn * tradesPerYear;
  const annualizedStdDevPct = stdDev * Math.sqrt(tradesPerYear);
  const sharpe = (annualizedReturnPct - (rf * 100)) / annualizedStdDevPct;
  return Number(sharpe.toFixed(2));
}

/**
 * Standart vs Blok Bootstrap ile %95 Güven Aralığı Hesaplayıcı (Tohumlu PRNG ile Deterministik)
 */
export function calculateBootstrapConfidenceIntervals(
  tradeReturns: number[],
  blockSize = 5,
  alpha = 0.05,
  nBootstrap = 10000,
  seed = 42
): {
  standardCI: { lower: number; upper: number; mean: number };
  blockCI: { lower: number; upper: number; mean: number; blockSize: number };
} {
  if (!tradeReturns || tradeReturns.length === 0) {
    return {
      standardCI: { lower: 0, upper: 0, mean: 0 },
      blockCI: { lower: 0, upper: 0, mean: 0, blockSize },
    };
  }

  const rng = createMulberry32(seed);
  const n = tradeReturns.length;

  // 1. Standart (I.I.D.) Bootstrap
  const stdMeans: number[] = [];
  for (let i = 0; i < nBootstrap; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      const idx = Math.floor(rng() * n);
      sum += tradeReturns[idx];
    }
    stdMeans.push(sum / n);
  }
  stdMeans.sort((a, b) => a - b);
  const stdLower = stdMeans[Math.max(0, Math.min(stdMeans.length - 1, Math.floor((alpha / 2) * nBootstrap)))];
  const stdUpper = stdMeans[Math.max(0, Math.min(stdMeans.length - 1, Math.floor((1 - alpha / 2) * nBootstrap)))];
  const stdMean = stdMeans.reduce((a, b) => a + b, 0) / nBootstrap;

  // 2. Blok Bootstrap (Ardışık İşlem Korelasyonunu / Kayıp Kümelenmesini Koruyan Yöntem)
  const blockMeans: number[] = [];
  const effectiveBlockSize = Math.max(2, Math.min(blockSize, Math.floor(n / 2)));
  const nBlocks = Math.max(1, Math.floor(n / effectiveBlockSize));

  for (let i = 0; i < nBootstrap; i++) {
    const sampled: number[] = [];
    for (let b = 0; b < nBlocks; b++) {
      const startIdx = Math.floor(rng() * (n - effectiveBlockSize + 1));
      for (let k = 0; k < effectiveBlockSize; k++) {
        sampled.push(tradeReturns[startIdx + k]);
      }
    }
    const mean = sampled.reduce((a, b) => a + b, 0) / sampled.length;
    blockMeans.push(mean);
  }
  blockMeans.sort((a, b) => a - b);
  const blockLower = blockMeans[Math.max(0, Math.min(blockMeans.length - 1, Math.floor((alpha / 2) * nBootstrap)))];
  const blockUpper = blockMeans[Math.max(0, Math.min(blockMeans.length - 1, Math.floor((1 - alpha / 2) * nBootstrap)))];
  const blockMean = blockMeans.reduce((a, b) => a + b, 0) / nBootstrap;

  return {
    standardCI: { lower: Number(stdLower.toFixed(3)), upper: Number(stdUpper.toFixed(3)), mean: Number(stdMean.toFixed(3)) },
    blockCI: { lower: Number(blockLower.toFixed(3)), upper: Number(blockUpper.toFixed(3)), mean: Number(blockMean.toFixed(3)), blockSize: effectiveBlockSize },
  };
}

export interface WindowBacktestResult {
  windowIndex: number;
  trainRange: { start: string; end: string };
  testRange: { start: string; end: string };
  optimizedThresholds: SignalThresholds;
  optimizedWeights: WeightConfig;
  inSampleTradesCount: number;
  inSampleWinRate: number;
  inSampleNetReturnPct: number;
  outOfSampleTradesCount: number;
  outOfSampleWinRate: number;
  outOfSampleNetReturnPct: number;
  outOfSampleMaxDrawdown: number;
  trades: BacktestTrade[];
}

export interface WalkForwardAggregateResult {
  totalWindows: number;
  outOfSampleTradesCount: number;
  outOfSampleWinRate: number;
  outOfSampleAvgReturnPct: number;
  outOfSampleProfitFactor: number;
  outOfSampleMaxDrawdown: number;
  outOfSampleSharpeRatio: number;
  inSampleAvgReturnPct: number;
  overfittingDiffPct: number;
  isOverfittingDetected: boolean;
  overfittingWarning?: string;
  windows: WindowBacktestResult[];
  allOutOfSampleTrades: BacktestTrade[];
}

export interface MonteCarloPercentiles {
  iterations: number;
  p5FinalReturn: number;
  p50FinalReturn: number;
  p95FinalReturn: number;
  p5MaxDrawdown: number;
  p50MaxDrawdown: number;
  p95MaxDrawdown: number;
  riskOfRuinPct: number; // Sermayenin %30'undan fazlasını kaybetme olasılığı
}

/**
 * BÖLÜM 8.3 — Gerçekçi Maliyet Modeli
 */
export function calculateEffectivePrices(
  signalPrice: number,
  exitPrice: number,
  normalizedLiquidityScore = 1.0,
  baseSlippage = 0.001,
  baseCommission = 0.0005
): { effectiveEntryPrice: number; effectiveExitPrice: number; totalCostPct: number } {
  // Düşük likidite = Daha yüksek slippage
  const effectiveLiquidity = Math.max(normalizedLiquidityScore, 0.2);
  const slippagePct = baseSlippage * (1 / effectiveLiquidity);
  const commissionPct = baseCommission;

  const effectiveEntryPrice = signalPrice * (1 + slippagePct + commissionPct);
  const effectiveExitPrice = exitPrice * (1 - slippagePct - commissionPct);
  const totalCostPct = ((effectiveEntryPrice - signalPrice) + (exitPrice - effectiveExitPrice)) / signalPrice;

  return {
    effectiveEntryPrice: Number(effectiveEntryPrice.toFixed(4)),
    effectiveExitPrice: Number(effectiveExitPrice.toFixed(4)),
    totalCostPct: Number((totalCostPct * 100).toFixed(3)),
  };
}

/**
 * Bar Serisi Üzerinde Simülasyon Çalıştır
 */
export function runSingleWindowBacktest(
  bars: PriceBar[],
  config: SignalEngineConfig,
  enableCostModel = true,
  normalizedLiquidity = 1.0,
  startIndex = 25
): { trades: BacktestTrade[]; winRate: number; totalNetReturn: number; maxDrawdown: number } {
  if (!bars || bars.length < startIndex + 5) {
    return { trades: [], winRate: 0, totalNetReturn: 0, maxDrawdown: 0 };
  }

  const closes = bars.map((b) => b.close);
  const highs = bars.map((b) => b.high);
  const lows = bars.map((b) => b.low);
  const volumes = bars.map((b) => b.volume);

  const ema20 = calculateEMA(closes, 20);
  const ema50 = calculateEMA(closes, 50);
  const sma200 = calculateSMA(closes, Math.min(200, Math.floor(closes.length * 0.8)));
  const rsi14 = calculateRSI(closes, 14);
  const atr14 = calculateATR(highs, lows, closes, 14);

  const defaultRR = config.defaultRiskRewardRatio || 3.0;

  const trades: BacktestTrade[] = [];
  let currentPosition: {
    entryIndex: number;
    entryDate: string;
    entryPrice: number;
    stopLoss: number;
    target1: number;
    target2: number;
    compositeScore: number;
  } | null = null;

  for (let i = startIndex; i < bars.length; i++) {
    const currentBar = bars[i];
    const adx = calculateADX(highs.slice(0, i + 1), lows.slice(0, i + 1), closes.slice(0, i + 1));
    const { weights } = getDynamicWeights(adx, config);

    // 5 Kategori Hesaplaması
    const trendScore = calculateTrendScore({
      price: currentBar.close,
      ema20: ema20[i],
      ema50: ema50[i],
      sma200: sma200[i],
      macdHistogram: (!isNaN(ema20[i]) && !isNaN(ema50[i])) ? (ema20[i] - ema50[i]) : 0,
      previousMacdHistogram: (!isNaN(ema20[i - 1]) && !isNaN(ema50[i - 1])) ? (ema20[i - 1] - ema50[i - 1]) : 0,
    });

    const divergence = detectDivergence(closes.slice(Math.max(0, i - 20), i + 1), rsi14.slice(Math.max(0, i - 20), i + 1));
    const momentumScore = calculateMomentumScore({ price: currentBar.close, rsi14: rsi14[i] }, divergence);
    const volatilityScore = calculateVolatilityScore({
      price: currentBar.close,
      bollingerBandWidth: 0.08,
      bollingerBandWidthHistory: [0.12, 0.10, 0.09, 0.08, 0.08, 0.09, 0.07, 0.08, 0.08, 0.09, 0.08, 0.08],
      volume20Avg: volumes.slice(Math.max(0, i - 20), i).reduce((a, b) => a + b, 0) / 20,
      currentVolume: currentBar.volume,
    });
    const valueScore = calculateValueScore({ stockPE: 8.5, sectorMedianPE: 12.0, stockPB: 1.8, sectorMedianPB: 2.5, ebitdaGrowthYoY: 15 });
    // Backtest için nötr haber skoru
    const newsScore = calculateNewsScore({ validationStatus: 'ACCEPT', sentimentScore: 50, independentSourcesCount: 0 });

    const compositeScore = calculateCompositeScore(
      { trend: trendScore, momentum: momentumScore, volatility: volatilityScore, value: valueScore, news: newsScore },
      weights
    );

    const signal = generateSignal(compositeScore, config.thresholds);

    // Açık Pozisyon Yönetimi
    if (currentPosition) {
      const holdingDays = i - currentPosition.entryIndex;
      let isExit = false;
      let exitReason: 'TARGET' | 'STOP_LOSS' | 'TIME_EXIT' | 'SIGNAL_FLIP' = 'TIME_EXIT';
      let exitPrice = currentBar.close;

      if (currentBar.low <= currentPosition.stopLoss) {
        isExit = true;
        exitReason = 'STOP_LOSS';
        exitPrice = currentPosition.stopLoss;
      } else if (currentBar.high >= currentPosition.target1) {
        isExit = true;
        exitReason = 'TARGET';
        exitPrice = currentPosition.target1;
      } else if (signal.type === 'SELL') {
        isExit = true;
        exitReason = 'SIGNAL_FLIP';
        exitPrice = currentBar.close;
      } else if (holdingDays >= 20) {
        isExit = true;
        exitReason = 'TIME_EXIT';
        exitPrice = currentBar.close;
      }

      if (isExit) {
        const costs = enableCostModel
          ? calculateEffectivePrices(currentPosition.entryPrice, exitPrice, normalizedLiquidity, config.baseSlippage, config.baseCommission)
          : { effectiveEntryPrice: currentPosition.entryPrice, effectiveExitPrice: exitPrice };

        const grossReturnPct = ((exitPrice - currentPosition.entryPrice) / currentPosition.entryPrice) * 100;
        const netReturnPct = ((costs.effectiveExitPrice - costs.effectiveEntryPrice) / costs.effectiveEntryPrice) * 100;

        trades.push({
          entryDate: currentPosition.entryDate,
          exitDate: currentBar.date,
          symbol: 'VARLIK',
          signalType: 'BUY',
          compositeScore: currentPosition.compositeScore,
          entryPrice: currentPosition.entryPrice,
          effectiveEntryPrice: costs.effectiveEntryPrice,
          exitPrice,
          effectiveExitPrice: costs.effectiveExitPrice,
          grossReturnPct: Number(grossReturnPct.toFixed(2)),
          netReturnPct: Number(netReturnPct.toFixed(2)),
          holdingDays,
          isWin: netReturnPct > 0,
          exitReason,
          stopLoss: currentPosition.stopLoss,
          takeProfit: currentPosition.target1,
        });

        currentPosition = null;
      }
    } else {
      // Yeni Pozisyon Açılış Sinyali
      if (signal.type === 'STRONG_BUY' || signal.type === 'BUY') {
        const entryPrice = currentBar.close;
        const currentAtr = atr14[i] && atr14[i] > 0 && !isNaN(atr14[i]) ? atr14[i] : entryPrice * 0.03;
        const atrTargets = calculateAtrBasedTargets(entryPrice, currentAtr, defaultRR);
        const stopLoss = atrTargets.stopLoss;
        const target1 = atrTargets.targetShortTerm;
        const target2 = atrTargets.targetMidTerm;

        currentPosition = {
          entryIndex: i,
          entryDate: currentBar.date,
          entryPrice,
          stopLoss,
          target1,
          target2,
          compositeScore,
        };
      }
    }
  }

  // İstatistikleri Hesapla
  const wins = trades.filter((t) => t.isWin).length;
  const winRate = trades.length > 0 ? Number((wins / trades.length).toFixed(3)) : 0;
  
  let equity = 1.0;
  let peak = 1.0;
  let maxDrawdown = 0;

  for (const t of trades) {
    equity *= 1 + t.netReturnPct / 100;
    if (equity > peak) peak = equity;
    const dd = (peak - equity) / peak;
    if (dd > maxDrawdown) maxDrawdown = dd;
  }

  const totalNetReturn = Number(((equity - 1.0) * 100).toFixed(2));

  return {
    trades,
    winRate,
    totalNetReturn,
    maxDrawdown: Number((maxDrawdown * 100).toFixed(2)),
  };
}

/**
 * BÖLÜM 8.1 — Parametre Optimizasyonu (Train Window Üzerinde)
 * SADECE trainWindow verisine bakar, testWindow verisine asla erişmez (Data Leakage Önlemi).
 */
export function optimizeParametersOnTrainWindow(trainBars: PriceBar[]): {
  thresholds: SignalThresholds;
  weights: WeightConfig;
  bestExpectancy: number;
} {
  const candidateThresholds: SignalThresholds[] = [
    { strongBuyThreshold: 55, buyThreshold: 25, exitThreshold: -30 },
    { strongBuyThreshold: 60, buyThreshold: 30, exitThreshold: -30 },
    { strongBuyThreshold: 65, buyThreshold: 35, exitThreshold: -25 },
  ];

  let bestThresholds = candidateThresholds[1];
  let bestExpectancy = -999;

  for (const th of candidateThresholds) {
    const testConfig = createCustomEngineConfig({ thresholds: th });
    const res = runSingleWindowBacktest(trainBars, testConfig, true);
    
    // Expectancy = (WinRate * AvgWin) - (LossRate * AvgLoss)
    const wins = res.trades.filter((t) => t.isWin);
    const losses = res.trades.filter((t) => !t.isWin);
    const avgWin = wins.length > 0 ? wins.reduce((s, t) => s + t.netReturnPct, 0) / wins.length : 0;
    const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((s, t) => s + t.netReturnPct, 0) / losses.length) : 0;
    const expectancy = (res.winRate * avgWin) - ((1 - res.winRate) * avgLoss);

    if (expectancy > bestExpectancy) {
      bestExpectancy = expectancy;
      bestThresholds = th;
    }
  }

  return {
    thresholds: bestThresholds,
    weights: DEFAULT_SIGNAL_ENGINE_CONFIG.weightsTrending,
    bestExpectancy,
  };
}

/**
 * BÖLÜM 8.1 — Walk-Forward Analiz Motoru
 */
export function walkForwardAnalysis(
  historicalData: PriceBar[],
  windowBars = 120, // ~6 aylık işlem günü
  stepBars = 60,    // ~3 aylık kaydırma
  customConfig?: SignalEngineConfig
): WalkForwardAggregateResult {
  const totalBars = historicalData?.length || 0;
  const windows: WindowBacktestResult[] = [];
  const allOutOfSampleTrades: BacktestTrade[] = [];

  if (totalBars < windowBars + stepBars) {
    return {
      totalWindows: 0,
      outOfSampleTradesCount: 0,
      outOfSampleWinRate: 0,
      outOfSampleAvgReturnPct: 0,
      outOfSampleProfitFactor: 1.0,
      outOfSampleMaxDrawdown: 0,
      outOfSampleSharpeRatio: 0,
      inSampleAvgReturnPct: 0,
      overfittingDiffPct: 0,
      isOverfittingDetected: false,
      windows: [],
      allOutOfSampleTrades: [],
    };
  }

  let inSampleReturnsSum = 0;
  let outSampleReturnsSum = 0;
  let windowIdx = 0;

  for (let start = 0; start + windowBars + stepBars <= totalBars; start += stepBars) {
    const trainBars = historicalData.slice(start, start + windowBars);
    const testBars = historicalData.slice(start + windowBars, start + windowBars + stepBars);

    // 1. Train window üzerinde parametreleri optimize et (Out of sample'ı GÖRMEDEN)
    const opt = optimizeParametersOnTrainWindow(trainBars);
    const trainConfig = createCustomEngineConfig({
      thresholds: opt.thresholds,
      baseSlippage: customConfig?.baseSlippage,
      baseCommission: customConfig?.baseCommission,
      defaultRiskRewardRatio: customConfig?.defaultRiskRewardRatio,
    });

    // 2. Train (In-Sample) Testi
    const inSampleRes = runSingleWindowBacktest(trainBars, trainConfig, true);
    
    // 3. Test (Out-of-Sample) Testi — Eğitim penceresinin son 25 barını gösterge ısınması için kullan
    const warmup = 25;
    const testBarsWithWarmup = historicalData.slice(start + windowBars - warmup, start + windowBars + stepBars);
    const outSampleRes = runSingleWindowBacktest(testBarsWithWarmup, trainConfig, true, 1.0, warmup);

    inSampleReturnsSum += inSampleRes.totalNetReturn;
    outSampleReturnsSum += outSampleRes.totalNetReturn;
    allOutOfSampleTrades.push(...outSampleRes.trades);

    windows.push({
      windowIndex: windowIdx++,
      trainRange: { start: trainBars[0]?.date || '', end: trainBars[trainBars.length - 1]?.date || '' },
      testRange: { start: testBars[0]?.date || '', end: testBars[testBars.length - 1]?.date || '' },
      optimizedThresholds: opt.thresholds,
      optimizedWeights: opt.weights,
      inSampleTradesCount: inSampleRes.trades.length,
      inSampleWinRate: inSampleRes.winRate,
      inSampleNetReturnPct: inSampleRes.totalNetReturn,
      outOfSampleTradesCount: outSampleRes.trades.length,
      outOfSampleWinRate: outSampleRes.winRate,
      outOfSampleNetReturnPct: outSampleRes.totalNetReturn,
      outOfSampleMaxDrawdown: outSampleRes.maxDrawdown,
      trades: outSampleRes.trades,
    });
  }

  const outOfSampleTradesCount = allOutOfSampleTrades.length;
  const outWins = allOutOfSampleTrades.filter((t) => t.isWin).length;
  const outOfSampleWinRate = outOfSampleTradesCount > 0 ? Number((outWins / outOfSampleTradesCount).toFixed(3)) : 0;
  const outOfSampleAvgReturnPct = windows.length > 0 ? Number((outSampleReturnsSum / windows.length).toFixed(2)) : 0;
  const inSampleAvgReturnPct = windows.length > 0 ? Number((inSampleReturnsSum / windows.length).toFixed(2)) : 0;

  // Profit Factor Hesabı
  const grossGains = allOutOfSampleTrades.filter((t) => t.netReturnPct > 0).reduce((s, t) => s + t.netReturnPct, 0);
  const grossLosses = Math.abs(allOutOfSampleTrades.filter((t) => t.netReturnPct < 0).reduce((s, t) => s + t.netReturnPct, 0));
  const outOfSampleProfitFactor = grossLosses > 0 ? Number((grossGains / grossLosses).toFixed(2)) : Number(grossGains.toFixed(2));

  // Max Drawdown Hesabı
  let maxDD = 0;
  for (const w of windows) {
    if (w.outOfSampleMaxDrawdown > maxDD) maxDD = w.outOfSampleMaxDrawdown;
  }

  // BÖLÜM 10.5 — Overfitting Tespiti
  const overfittingDiffPct = Number((inSampleAvgReturnPct - outOfSampleAvgReturnPct).toFixed(2));
  const isOverfittingDetected = inSampleAvgReturnPct > 0 && overfittingDiffPct >= 20.0;
  const overfittingWarning = isOverfittingDetected
    ? `OLASI OVERFITTING TESPİT EDİLDİ: In-sample getiri (%${inSampleAvgReturnPct}) out-of-sample getiriden (%${outOfSampleAvgReturnPct}) %${overfittingDiffPct} daha yüksek.`
    : undefined;

  return {
    totalWindows: windows.length,
    outOfSampleTradesCount,
    outOfSampleWinRate,
    outOfSampleAvgReturnPct,
    outOfSampleProfitFactor,
    outOfSampleMaxDrawdown: maxDD,
    outOfSampleSharpeRatio: Number((outOfSampleAvgReturnPct / (maxDD || 10)).toFixed(2)),
    inSampleAvgReturnPct,
    overfittingDiffPct,
    isOverfittingDetected,
    overfittingWarning,
    windows,
    allOutOfSampleTrades,
  };
}

/**
 * BÖLÜM 8.2 — Monte Carlo Simülasyonu (Tohumlu PRNG ile Deterministik 1000 İterasyon)
 */
export function monteCarloSimulation(
  tradeReturnsPct: number[],
  startingCapital = 100000,
  iterations = 1000,
  seed = 42
): MonteCarloPercentiles {
  if (!tradeReturnsPct || tradeReturnsPct.length === 0) {
    return {
      iterations: 0,
      p5FinalReturn: 0,
      p50FinalReturn: 0,
      p95FinalReturn: 0,
      p5MaxDrawdown: 0,
      p50MaxDrawdown: 0,
      p95MaxDrawdown: 0,
      riskOfRuinPct: 0,
    };
  }

  const rng = createMulberry32(seed);
  const finalReturns: number[] = [];
  const maxDrawdowns: number[] = [];
  let ruinCount = 0;

  for (let iter = 0; iter < iterations; iter++) {
    // Bootstrap sampling with replacement via seeded PRNG
    const sampledTrades: number[] = [];
    for (let j = 0; j < tradeReturnsPct.length; j++) {
      const randIdx = Math.floor(rng() * tradeReturnsPct.length);
      sampledTrades.push(tradeReturnsPct[randIdx]);
    }

    let equity = startingCapital;
    let peak = startingCapital;
    let maxDD = 0;

    for (const retPct of sampledTrades) {
      equity *= 1 + retPct / 100;
      if (equity > peak) peak = equity;
      const dd = (peak - equity) / peak;
      if (dd > maxDD) maxDD = dd;
    }

    const finalReturnPct = ((equity - startingCapital) / startingCapital) * 100;
    finalReturns.push(finalReturnPct);
    maxDrawdowns.push(maxDD * 100);

    if (maxDD >= 0.30) {
      ruinCount++;
    }
  }

  finalReturns.sort((a, b) => a - b);
  maxDrawdowns.sort((a, b) => a - b);

  const getPercentile = (arr: number[], p: number) => {
    const idx = Math.min(Math.floor((p / 100) * arr.length), arr.length - 1);
    return Number(arr[idx].toFixed(2));
  };

  return {
    iterations,
    p5FinalReturn: getPercentile(finalReturns, 5),
    p50FinalReturn: getPercentile(finalReturns, 50),
    p95FinalReturn: getPercentile(finalReturns, 95),
    p5MaxDrawdown: getPercentile(maxDrawdowns, 5),
    p50MaxDrawdown: getPercentile(maxDrawdowns, 50),
    p95MaxDrawdown: getPercentile(maxDrawdowns, 95),
    riskOfRuinPct: Number(((ruinCount / iterations) * 100).toFixed(1)),
  };
}
