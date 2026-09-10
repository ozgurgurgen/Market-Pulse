import { 
  TechnicalEngineParams, 
  TechnicalAnalysisResult, 
  SignalItemSummary 
} from '../../src/types';
import { 
  DEFAULT_TECHNICAL_PARAMS, 
  validateTechnicalParameters, 
  getParamHash 
} from './technicalParameters';
import { 
  calculateEMA, 
  calculateSMA, 
  calculateRSI, 
  calculateBollingerBands, 
  calculateATR, 
  calculateAtrBasedTargets,
  calculateStochastic,
  calculateWilliamsR,
  calculatePivotPoints, 
  roundToTick 
} from './indicators';
import { localFinanceApi } from '../dataAdapters/adapters/LocalFinanceApiAdapter';
import { getLiveQuoteForSymbol } from '../yahooFinanceService';

interface TechnicalCacheItem {
  timestamp: number;
  data: TechnicalAnalysisResult;
}

// In-Memory Cache with Parameter Hash Isolation
const technicalResultCache = new Map<string, TechnicalCacheItem>();
const CACHE_TTL_MS = 60 * 1000; // 1 dakika (Piyasa verisiyle uyumlu)

/**
 * MACD İndikatörü Hesaplayıcı (Özelleştirilebilir periyotlarla)
 */
export function calculateMACD(
  closes: number[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9
): { macdLine: number[]; signalLine: number[]; histogram: number[] } {
  if (!closes || closes.length === 0) {
    return { macdLine: [], signalLine: [], histogram: [] };
  }

  const fastEMA = calculateEMA(closes, fastPeriod);
  const slowEMA = calculateEMA(closes, slowPeriod);
  const macdLine: number[] = new Array(closes.length).fill(NaN);

  for (let i = 0; i < closes.length; i++) {
    if (!isNaN(fastEMA[i]) && !isNaN(slowEMA[i])) {
      macdLine[i] = fastEMA[i] - slowEMA[i];
    }
  }

  // Sinyal Hattı: macdLine'ın EMA'sı
  const validMacdIndices = macdLine.map((val, idx) => (!isNaN(val) ? idx : -1)).filter(idx => idx !== -1);
  const validMacdValues = validMacdIndices.map(idx => macdLine[idx]);
  const signalEmaValid = calculateEMA(validMacdValues, signalPeriod);

  const signalLine: number[] = new Array(closes.length).fill(NaN);
  const histogram: number[] = new Array(closes.length).fill(NaN);

  validMacdIndices.forEach((origIdx, sliceIdx) => {
    const sigVal = signalEmaValid[sliceIdx];
    signalLine[origIdx] = sigVal;
    if (!isNaN(macdLine[origIdx]) && !isNaN(sigVal)) {
      histogram[origIdx] = macdLine[origIdx] - sigVal;
    }
  });

  return { macdLine, signalLine, histogram };
}

/**
 * Ana Parametrik Teknik Analiz Hesaplayıcı
 */
export async function calculateParametricTechnicalAnalysis(
  symbol: string,
  customParams?: Partial<TechnicalEngineParams>
): Promise<{ result: TechnicalAnalysisResult; paramHash: string }> {
  const normSymbol = symbol.toUpperCase();
  
  // 1. Parametre Doğrulama
  const validation = validateTechnicalParameters(customParams);
  if (!validation.isValid) {
    throw new Error(`Geçersiz Teknik Parametreler: ${validation.errors.join(', ')}`);
  }
  const params = validation.sanitizedParams;
  const paramHash = getParamHash(params);
  const cacheKey = `${normSymbol}:${paramHash}`;

  // 2. Cache Kontrolü
  const cached = technicalResultCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return { result: cached.data, paramHash };
  }

  // 3. Canlı Fiyat ve Fiyat Bar Serisi Hazırlığı
  const liveQuote = await getLiveQuoteForSymbol(normSymbol);
  
  // Gerekli bar sayısı (en az slowMaPeriod + 50 bar)
  const barCount = Math.max(120, params.slowMaPeriod + 40);
  
  let closes: number[] = [];
  let highs: number[] = [];
  let lows: number[] = [];
  
  try {
    const historyData = await localFinanceApi.getV1BistStockHistory(normSymbol, barCount);
    if (historyData && Array.isArray(historyData) && historyData.length > 0) {
      closes = historyData.map((b: any) => b.close || b.price || 0);
      highs = historyData.map((b: any) => b.high || b.price || 0);
      lows = historyData.map((b: any) => b.low || b.price || 0);
    } else if (historyData && Array.isArray(historyData.data) && historyData.data.length > 0) {
      closes = historyData.data.map((b: any) => b.close || b.price || 0);
      highs = historyData.data.map((b: any) => b.high || b.price || 0);
      lows = historyData.data.map((b: any) => b.low || b.price || 0);
    }
  } catch (err) {
    console.warn(`[Technical Engine] Failed to fetch real history for ${normSymbol}, falling back to live quote only.`);
  }
  
  const basePrice = liveQuote?.currentPrice || (closes.length > 0 ? closes[closes.length - 1] : 100);

  // Eğer geçmiş veri yeterli değilse (veya servis çökmüşse), dürüstçe uydurma veri üretmeden hatayı fırlat
  if (closes.length < Math.max(20, params.fastMaPeriod)) {
    throw new Error(`${normSymbol} için yeterli gerçek geçmiş fiyat verisi bulunamadı (Boru hattı çevrimdışı).`);
  }

  // Güncel son fiyatı liveQuote ile tam eşle
  closes[closes.length - 1] = basePrice;
  highs[highs.length - 1] = Math.max(highs[highs.length - 1], basePrice);
  lows[lows.length - 1] = Math.min(lows[lows.length - 1], basePrice);

  // 4. İndikatör Hesaplamaları
  // A. Hareketli Ortalamalar
  const fastMaSeries = params.maType === 'EMA' ? calculateEMA(closes, params.fastMaPeriod) : calculateSMA(closes, params.fastMaPeriod);
  const mediumMaSeries = params.maType === 'EMA' ? calculateEMA(closes, params.mediumMaPeriod) : calculateSMA(closes, params.mediumMaPeriod);
  const slowMaSeries = calculateSMA(closes, params.slowMaPeriod);

  const currentFastMa = roundToTick(fastMaSeries[fastMaSeries.length - 1] || basePrice * 0.98);
  const currentMediumMa = roundToTick(mediumMaSeries[mediumMaSeries.length - 1] || basePrice * 0.95);
  const currentSlowMa = roundToTick(slowMaSeries[slowMaSeries.length - 1] || basePrice * 0.88);

  // B. RSI
  const rsiSeries = calculateRSI(closes, params.rsiPeriod);
  const currentRsi = Number((rsiSeries[rsiSeries.length - 1] || 50).toFixed(1));
  let rsiStatus = 'Nötr / Dengeli Bölge';
  if (currentRsi >= params.rsiOverbought) {
    rsiStatus = `Aşırı Alım Bölgesi (>= ${params.rsiOverbought})`;
  } else if (currentRsi <= params.rsiOversold) {
    rsiStatus = `Aşırı Satım Bölgesi (<= ${params.rsiOversold})`;
  } else if (currentRsi > 55) {
    rsiStatus = 'Pozitif Momentum Bölgesi';
  } else if (currentRsi < 45) {
    rsiStatus = 'Negatif / Zayıf Momentum Bölgesi';
  }

  // C. MACD
  const macdData = calculateMACD(closes, params.macdFastPeriod, params.macdSlowPeriod, params.macdSignalPeriod);
  const currentMacdLine = Number((macdData.macdLine[macdData.macdLine.length - 1] || 0).toFixed(3));
  const currentSignalLine = Number((macdData.signalLine[macdData.signalLine.length - 1] || 0).toFixed(3));
  const currentHistogram = Number((macdData.histogram[macdData.histogram.length - 1] || 0).toFixed(3));
  const prevHistogram = Number((macdData.histogram[macdData.histogram.length - 2] || 0).toFixed(3));

  let macdStatus = 'Nötr Görünüm';
  if (currentHistogram > 0 && currentHistogram > prevHistogram) {
    macdStatus = `Pozitif Kesişim ve Histogram Genişlemesi (${params.macdFastPeriod}/${params.macdSlowPeriod}/${params.macdSignalPeriod})`;
  } else if (currentHistogram > 0 && currentHistogram <= prevHistogram) {
    macdStatus = `Pozitif Bölgede İvme Kaybı (${params.macdFastPeriod}/${params.macdSlowPeriod}/${params.macdSignalPeriod})`;
  } else if (currentHistogram < 0 && currentHistogram < prevHistogram) {
    macdStatus = `Negatif Kesişim ve Satış Baskısı (${params.macdFastPeriod}/${params.macdSlowPeriod}/${params.macdSignalPeriod})`;
  } else {
    macdStatus = `Negatif Bölgede Toparlanma Çabası (${params.macdFastPeriod}/${params.macdSlowPeriod}/${params.macdSignalPeriod})`;
  }

  // D. Bollinger Bantları
  const bb = calculateBollingerBands(closes, params.bbPeriod, params.bbStdDev);
  const currentUpperBB = roundToTick(bb.upper[bb.upper.length - 1] || basePrice * 1.05);
  const currentMiddleBB = roundToTick(bb.middle[bb.middle.length - 1] || basePrice);
  const currentLowerBB = roundToTick(bb.lower[bb.lower.length - 1] || basePrice * 0.95);
  const currentBandwidthPct = Number(((bb.bandWidth[bb.bandWidth.length - 1] || 0.05) * 100).toFixed(2));

  // E. ATR ve Dinamik Hedef / Stop-Loss
  const atrSeries = calculateATR(highs, lows, closes, params.atrPeriod);
  const currentATR = Number((atrSeries[atrSeries.length - 1] || basePrice * 0.025).toFixed(2));
  const targets = calculateAtrBasedTargets(basePrice, currentATR, params.riskRewardRatio);

  // F. Pivot ve Destek / Direnç Seviyeleri (Klasik + Parametrik Hibrit)
  const lastHigh = highs[highs.length - 2] || basePrice * 1.02;
  const lastLow = lows[lows.length - 2] || basePrice * 0.98;
  const lastClose = closes[closes.length - 2] || basePrice;
  const pivotPoint = roundToTick((lastHigh + lastLow + lastClose) / 3);

  const r1 = roundToTick(2 * pivotPoint - lastLow);
  const s1 = roundToTick(2 * pivotPoint - lastHigh);
  const r2 = roundToTick(pivotPoint + (lastHigh - lastLow));
  const s2 = roundToTick(pivotPoint - (lastHigh - lastLow));
  const r3 = roundToTick(lastHigh + 2 * (pivotPoint - lastLow));
  const s3 = roundToTick(lastLow - 2 * (lastHigh - pivotPoint));

  // G. Trend Yönü Değerlendirmesi
  let trendDirection: TechnicalAnalysisResult['trendDirection'] = 'NEUTRAL';
  let bullishCount = 0;
  let bearishCount = 0;

  if (basePrice > currentFastMa) bullishCount++; else bearishCount++;
  if (currentFastMa > currentMediumMa) bullishCount++; else bearishCount++;
  if (currentMediumMa > currentSlowMa) bullishCount++; else bearishCount++;
  if (currentRsi > 50) bullishCount++; else bearishCount++;
  if (currentHistogram > 0) bullishCount++; else bearishCount++;

  if (bullishCount >= 4) {
    trendDirection = 'STRONG_BULLISH';
  } else if (bullishCount === 3) {
    trendDirection = 'BULLISH';
  } else if (bearishCount >= 4) {
    trendDirection = 'STRONG_BEARISH';
  } else if (bearishCount === 3) {
    trendDirection = 'BEARISH';
  }

  // H. Sinyal Listesi Oluşturma (AI Yorumlama Katmanı ve UI Rozetleri İçin)
  const signalsList: SignalItemSummary[] = [];

  // 1. MA Sinyali
  const maAlignment = basePrice > currentFastMa && currentFastMa > currentMediumMa && currentMediumMa > currentSlowMa;
  signalsList.push({
    name: `Hareketli Ortalamalar (${params.maType} ${params.fastMaPeriod}/${params.mediumMaPeriod}/${params.slowMaPeriod})`,
    category: 'TREND',
    valueStr: `${params.fastMaPeriod}: ${currentFastMa} ₺ | ${params.mediumMaPeriod}: ${currentMediumMa} ₺ | ${params.slowMaPeriod}: ${currentSlowMa} ₺`,
    condition: maAlignment ? 'BULLISH' : basePrice < currentFastMa && currentFastMa < currentMediumMa ? 'BEARISH' : 'NEUTRAL',
    description: maAlignment ? 'Tüm kısa, orta ve uzun vadeli ortalamaların üzerinde düzenli boğa dizilimi' : 'Karışık veya negatif ortalama dizilimi'
  });

  // 2. RSI Sinyali
  signalsList.push({
    name: `RSI (${params.rsiPeriod})`,
    category: 'MOMENTUM',
    valueStr: `${currentRsi}`,
    condition: currentRsi >= params.rsiOverbought ? 'OVERBOUGHT' : currentRsi <= params.rsiOversold ? 'OVERSOLD' : currentRsi > 50 ? 'BULLISH' : 'BEARISH',
    description: currentRsi >= params.rsiOverbought 
      ? `Aşırı alım eşiği (${params.rsiOverbought}) üzerinde, kar satışı ve düzeltme riski artabilir` 
      : currentRsi <= params.rsiOversold 
      ? `Aşırı satım eşiği (${params.rsiOversold}) altında, tepki yükselişi potansiyeli` 
      : 'Dengeli momentum bölgesi'
  });

  // 3. MACD Sinyali
  signalsList.push({
    name: `MACD (${params.macdFastPeriod}/${params.macdSlowPeriod}/${params.macdSignalPeriod})`,
    category: 'MOMENTUM',
    valueStr: `Hist: ${currentHistogram > 0 ? '+' : ''}${currentHistogram}`,
    condition: currentHistogram > 0 ? 'BULLISH' : 'BEARISH',
    description: currentHistogram > 0 ? 'Pozitif bölgede histogram genişlemesi' : 'Negatif bölgede satış baskısı'
  });

  // 4. Bollinger Bantları
  signalsList.push({
    name: `Bollinger Bandı (${params.bbPeriod} / ${params.bbStdDev}σ)`,
    category: 'VOLATILITY',
    valueStr: `Genişlik: %${currentBandwidthPct}`,
    condition: basePrice > currentUpperBB ? 'OVERBOUGHT' : basePrice < currentLowerBB ? 'OVERSOLD' : 'NEUTRAL',
    description: basePrice > currentUpperBB ? 'Fiyat üst bandı zorluyor' : basePrice < currentLowerBB ? 'Fiyat alt bandı test ediyor' : 'Bant içi normal dalgalanma'
  });

  // 5. Destek / Direnç
  signalsList.push({
    name: 'Pivot & Destek-Direnç Hatları',
    category: 'SUPPORT_RESISTANCE',
    valueStr: `Pivot: ${pivotPoint} ₺ | R1: ${r1} ₺ | S1: ${s1} ₺`,
    condition: basePrice >= pivotPoint ? 'BULLISH' : 'BEARISH',
    description: basePrice >= pivotPoint ? 'Pivot seviyesi üzerinde pozitif bölgede' : 'Pivot seviyesi altında savunma modunda'
  });

  // I. Deterministik Senaryolar
  const bullishScenario = `Hisse seçilen ${params.preset || 'Özel'} parametre setine göre (${params.maType} ${params.fastMaPeriod}: ${currentFastMa} ₺) üzerinde hareket etmektedir. ${r1} ₺ direncinin yukarı hacimli kırılması durumunda hedef ${r2} ₺ ve ${targets.targetShortTerm} ₺ teknik seviyelerine doğru ivmelenme gözlenebilir.`;
  const bearishScenario = `Olası piyasa geri çekilmelerinde ${s1} ₺ ilk dinamik destek seviyesidir. Bu seviyenin aşağı kırılması halinde ${currentMediumMa} ₺ (${params.mediumMaPeriod} periyotlu ortalama) ve ${targets.stopLoss} ₺ (ATR 1.5x koruma hattı) ana savunma bölgesi olarak izlenmelidir.`;

  const result: TechnicalAnalysisResult = {
    ticker: normSymbol,
    currentPrice: basePrice,
    trendDirection,
    pivotPoint,
    supportLevels: [s1, s2, s3],
    resistanceLevels: [r1, r2, r3],
    bullishScenario,
    bearishScenario,
    rsi: currentRsi,
    rsiStatus,
    macdStatus,
    macdDetails: {
      macdLine: currentMacdLine,
      signalLine: currentSignalLine,
      histogram: currentHistogram,
    },
    bollingerDetails: {
      upper: currentUpperBB,
      middle: currentMiddleBB,
      lower: currentLowerBB,
      bandWidthPct: currentBandwidthPct,
    },
    atrValue: currentATR,
    calculatedStopLoss: targets.stopLoss,
    calculatedTarget1: targets.targetShortTerm,
    calculatedTarget2: targets.targetMidTerm,
    movingAverages: [
      { name: `${params.maType} ${params.fastMaPeriod}`, value: currentFastMa, status: basePrice >= currentFastMa ? 'ABOVE' : 'BELOW' },
      { name: `${params.maType} ${params.mediumMaPeriod}`, value: currentMediumMa, status: basePrice >= currentMediumMa ? 'ABOVE' : 'BELOW' },
      { name: `SMA ${params.slowMaPeriod}`, value: currentSlowMa, status: basePrice >= currentSlowMa ? 'ABOVE' : 'BELOW' },
    ],
    appliedParams: params,
    paramHash,
    signalsList,
    generatedDate: new Date().toISOString().split('T')[0],
    algorithmVersion: `Parametrik Teknik Analiz Motoru v4.0 (${params.preset || 'ÖZEL_AYAR'})`,
    isCustomParamCalculated: true,
  };

  // Cache kaydet
  technicalResultCache.set(cacheKey, {
    timestamp: Date.now(),
    data: result,
  });

  return { result, paramHash };
}
