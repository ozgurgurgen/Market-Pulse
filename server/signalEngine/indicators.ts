import { TechnicalIndicatorsData, FundamentalsData, ValidatedNlpData, DivergenceResult, CategoryScores } from './types';
import { DEFAULT_SIGNAL_ENGINE_CONFIG } from './config';

/**
 * Pure helper to clamp numbers within min and max
 */
export function clamp(val: number, min: number, max: number): number {
  if (typeof val !== 'number' || isNaN(val)) return 0;
  return Math.min(Math.max(val, min), max);
}

/**
 * Pure EMA Calculation over an array of numbers
 */
export function calculateEMA(values: number[], period: number): number[] {
  if (!values || values.length === 0 || period <= 0) return [];
  const k = 2 / (period + 1);
  const emaArray: number[] = new Array(values.length).fill(NaN);
  
  if (values.length < period) {
    return emaArray;
  }

  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += values[i];
  }
  let prevEma = sum / period;
  emaArray[period - 1] = prevEma;

  for (let i = period; i < values.length; i++) {
    const currentVal = values[i];
    const currentEma = currentVal * k + prevEma * (1 - k);
    emaArray[i] = currentEma;
    prevEma = currentEma;
  }

  return emaArray;
}

/**
 * Pure SMA Calculation over an array of numbers
 */
export function calculateSMA(values: number[], period: number): number[] {
  if (!values || values.length === 0 || period <= 0) return [];
  const smaArray: number[] = new Array(values.length).fill(NaN);
  let rollingSum = 0;

  for (let i = 0; i < values.length; i++) {
    rollingSum += values[i];
    if (i >= period) {
      rollingSum -= values[i - period];
      smaArray[i] = rollingSum / period;
    } else if (i === period - 1) {
      smaArray[i] = rollingSum / period;
    }
  }

  return smaArray;
}

/**
 * Pure ATR Calculation over High, Low, Close series
 */
export function calculateATR(
  highs: number[],
  lows: number[],
  closes: number[],
  period = 14
): number[] {
  if (!highs || !lows || !closes || closes.length === 0) return [];
  const tr: number[] = new Array(closes.length);
  tr[0] = highs[0] - lows[0];
  for (let i = 1; i < closes.length; i++) {
    const hl = highs[i] - lows[i];
    const hc = Math.abs(highs[i] - closes[i - 1]);
    const lc = Math.abs(lows[i] - closes[i - 1]);
    tr[i] = Math.max(hl, hc, lc);
  }
  return calculateEMA(tr, period);
}

/**
 * Pure Bollinger Bands Calculation
 */
export function calculateBollingerBands(
  closes: number[],
  period = 20,
  stdDevMultiplier = 2
): { middle: number[]; upper: number[]; lower: number[]; bandWidth: number[] } {
  if (!closes || closes.length === 0) return { middle: [], upper: [], lower: [], bandWidth: [] };
  const middle = calculateSMA(closes, period);
  const upper: number[] = new Array(closes.length).fill(NaN);
  const lower: number[] = new Array(closes.length).fill(NaN);
  const bandWidth: number[] = new Array(closes.length).fill(NaN);

  for (let i = period - 1; i < closes.length; i++) {
    const slice = closes.slice(i - period + 1, i + 1);
    const mean = middle[i];
    if (isNaN(mean)) continue;
    const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
    const stdDev = Math.sqrt(variance);
    upper[i] = mean + stdDevMultiplier * stdDev;
    lower[i] = mean - stdDevMultiplier * stdDev;
    bandWidth[i] = mean > 0 ? (upper[i] - lower[i]) / mean : 0;
  }

  return { middle, upper, lower, bandWidth };
}

/**
 * Round price to appropriate tick precision
 */
export function roundToTick(price: number): number {
  if (typeof price !== 'number' || isNaN(price)) return 0;
  if (price < 1) return Number(price.toFixed(4));
  if (price < 10) return Number(price.toFixed(3));
  return Number(price.toFixed(2));
}

/**
 * Saf ATR Tabanlı Stop-Loss & Hedef Fiyat Hesaplayıcı
 * LLM'e halüsinasyon yaptırılmaz, kod tarafında deterministik hesaplanır.
 */
export function calculateAtrBasedTargets(
  currentPrice: number,
  atr14: number,
  riskRewardRatio: number = DEFAULT_SIGNAL_ENGINE_CONFIG.defaultRiskRewardRatio || 3.0
): { stopLoss: number; targetShortTerm: number; targetMidTerm: number; riskReward: string } {
  if (currentPrice <= 0 || isNaN(currentPrice)) {
    return { stopLoss: 0, targetShortTerm: 0, targetMidTerm: 0, riskReward: `1:${riskRewardRatio.toFixed(1)}` };
  }
  const effectiveAtr = atr14 > 0 && !isNaN(atr14) ? atr14 : currentPrice * 0.03;
  const stopLoss = Math.max(0.01, currentPrice - effectiveAtr * 1.5);
  const riskDistance = Math.max(0.01, currentPrice - stopLoss);
  const targetShortTerm = currentPrice + riskDistance * riskRewardRatio;
  const targetMidTerm = currentPrice + riskDistance * riskRewardRatio * 2;
  return {
    stopLoss: roundToTick(stopLoss),
    targetShortTerm: roundToTick(targetShortTerm),
    targetMidTerm: roundToTick(targetMidTerm),
    riskReward: `1:${riskRewardRatio.toFixed(1)}`,
  };
}

/**
 * Pure RSI Calculation (Wilder's Smoothing)
 * Period öncesi ısınma barları NaN döndürür (Sahte 50 nötr doldurma YASAK).
 */
export function calculateRSI(closes: number[], period = 14): number[] {
  if (!closes || closes.length === 0) return [];
  const rsi: number[] = new Array(closes.length).fill(NaN);
  if (closes.length <= period) return rsi;
  
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  if (avgLoss === 0) {
    rsi[period] = 100;
  } else {
    const rs = avgGain / avgLoss;
    rsi[period] = 100 - (100 / (1 + rs));
  }

  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? Math.abs(diff) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    if (avgLoss === 0) {
      rsi[i] = 100;
    } else {
      const rs = avgGain / avgLoss;
      rsi[i] = 100 - (100 / (1 + rs));
    }
  }

  return rsi;
}

/**
 * BÖLÜM 2.1 — TREND Skoru (-100 .. +100)
 * EMA20 / EMA50 / SMA200 dizilimi ve MACD Histogram momentum teyidi
 */
export function calculateTrendScore(data: TechnicalIndicatorsData | null | undefined): number {
  if (!data || typeof data.price !== 'number' || isNaN(data.price)) {
    return 0; // Eksik veri güvenli çıkış
  }

  const { price, ema20, ema50, sma200, macdHistogram = 0, previousMacdHistogram = 0 } = data;
  
  // Eksik veya NaN gösterge kontrolü
  if (
    ema20 === undefined || isNaN(ema20) ||
    ema50 === undefined || isNaN(ema50) ||
    sma200 === undefined || isNaN(sma200)
  ) {
    return 0;
  }

  let score = 0;

  // Dizilim Kontrolü
  if (price > ema20 && ema20 > ema50 && ema50 > sma200) {
    score += 60; // Tam düzenli boğa dizilimi
  } else if (price > ema50 && ema50 > sma200) {
    score += 35;
  } else if (price < ema20 && ema20 < ema50 && ema50 < sma200) {
    score -= 60; // Tam düzenli ayı dizilimi
  } else if (price < ema50 && ema50 < sma200) {
    score -= 35;
  } else {
    score += 0; // Karışık dizilim, net yön yok
  }

  // MACD Histogram Momentumu (Teyit)
  if (typeof macdHistogram === 'number' && !isNaN(macdHistogram) && typeof previousMacdHistogram === 'number' && !isNaN(previousMacdHistogram)) {
    if (macdHistogram > 0 && macdHistogram > previousMacdHistogram) {
      score += 15; // İvme artıyor, teyit
    } else if (macdHistogram < 0 && macdHistogram < previousMacdHistogram) {
      score -= 15; // Negatif ivme derinleşiyor
    }
  }

  return Math.round(clamp(score, -100, 100));
}

/**
 * BÖLÜM 2.1 — MOMENTUM Skoru (-100 .. +100)
 * RSI(14) seviyesi ve Divergence (Uyumsuzluk) tespiti
 */
export function calculateMomentumScore(
  data: TechnicalIndicatorsData | null | undefined,
  divergence?: DivergenceResult | null
): number {
  if (!data || typeof data.rsi14 !== 'number' || isNaN(data.rsi14)) {
    return 0; // Eksik veya NaN veri güvenli çıkış
  }

  const { rsi14 } = data;
  let score = 0;

  if (rsi14 < 30) {
    score += 25; // Aşırı satım (dip potansiyeli)
  } else if (rsi14 > 70) {
    score -= 25; // Aşırı alım
  }

  if (divergence?.detected) {
    if (divergence.type === 'positive') {
      score += 50; // Pozitif uyumsuzluk (Güçlü dönüş)
    } else if (divergence.type === 'negative') {
      score -= 50; // Negatif uyumsuzluk (Güçlü tepe riski)
    }
  }

  return Math.round(clamp(score, -100, 100));
}

/**
 * BÖLÜM 2.1 — VOLATILITY Skoru (-100 .. +100)
 * Bollinger Bandwidth Sıkışması (Squeeze) ve Hacimli Kırılım Tespiti
 */
export function calculateVolatilityScore(data: TechnicalIndicatorsData | null | undefined): number {
  if (!data || typeof data.bollingerBandWidth !== 'number' || isNaN(data.bollingerBandWidth)) {
    return 0;
  }

  const {
    bollingerBandWidth,
    bollingerBandWidthHistory = [],
    isUpperBandBreakout = false,
    isLowerBandBreakdown = false,
    volume20Avg = 0,
    currentVolume = 0,
  } = data;

  const validHistory = bollingerBandWidthHistory.filter((w) => typeof w === 'number' && !isNaN(w));

  // Yüzdelik dilim hesaplama (Son 1 yıllık / 252 günlük dağılım)
  let bandWidthPercentile = 50;
  if (validHistory.length > 10) {
    const smallerCount = validHistory.filter((w) => w < bollingerBandWidth).length;
    bandWidthPercentile = (smallerCount / validHistory.length) * 100;
  } else {
    // Geçmiş yetersizse nötr değerlendir
    return 0;
  }

  let score = 0;
  const isHighVolume = volume20Avg > 0 && !isNaN(volume20Avg) ? currentVolume > volume20Avg * 1.5 : true;

  if (bandWidthPercentile < 10) {
    // Son dönemin en dar %10'u -> Squeeze
    if (isUpperBandBreakout && isHighVolume) {
      score = 70; // Hacimli yukarı kırılım
    } else if (isLowerBandBreakdown && isHighVolume) {
      score = -70; // Hacimli aşağı kırılım
    } else {
      score = 0; // Sıkışma var ama kırılım henüz yok (bekleme)
    }
  } else {
    score = 0; // Sıkışma yoksa kategori nötr
  }

  return Math.round(clamp(score, -100, 100));
}

/**
 * BÖLÜM 2.1 — VALUE Skoru (-100 .. +100)
 * Sektöre Göre Normalize Edilmiş F/K, PD/DD ve FAVÖK Büyümesi
 */
export function calculateValueScore(
  fundamentals: FundamentalsData | null | undefined
): number {
  if (!fundamentals) return 0;

  const { stockPE, sectorMedianPE, stockPB, sectorMedianPB, ebitdaGrowthYoY = 0 } = fundamentals;

  if (typeof stockPE !== 'number' || typeof sectorMedianPE !== 'number' || sectorMedianPE <= 0 || stockPE <= 0 || isNaN(stockPE) || isNaN(sectorMedianPE)) {
    // F/K mevcut değilse (örn. Altın, Kripto, Zarardaki Şirket)
    if (typeof stockPB === 'number' && typeof sectorMedianPB === 'number' && sectorMedianPB > 0 && !isNaN(stockPB) && !isNaN(sectorMedianPB)) {
      const pbDiscount = ((sectorMedianPB - stockPB) / sectorMedianPB) * 100;
      return Math.round(clamp(pbDiscount, -100, 100));
    }
    return 0;
  }

  const peDiscountPct = ((sectorMedianPE - stockPE) / sectorMedianPE) * 100;
  const pbDiscountPct =
    typeof stockPB === 'number' && typeof sectorMedianPB === 'number' && sectorMedianPB > 0 && !isNaN(stockPB) && !isNaN(sectorMedianPB)
      ? ((sectorMedianPB - stockPB) / sectorMedianPB) * 100
      : 0;

  let score = 0;

  if (peDiscountPct > 30 && (ebitdaGrowthYoY ?? 0) > 0) {
    score += 50; // Sektörden %30+ ucuz ve operasyonel büyüme var
  } else if (peDiscountPct > 30 && (ebitdaGrowthYoY ?? 0) <= 0) {
    score += 15; // Ucuz ama büyüme yok -> Value trap riski
  } else if (peDiscountPct < -30) {
    score -= 40; // Sektöre göre aşırı pahalı
  }

  score += clamp(pbDiscountPct, -30, 30) * 0.5;

  return Math.round(clamp(score, -100, 100));
}

/**
 * BÖLÜM 2.1 — NEWS Skoru (-100 .. +100)
 * Doğrulanmış NLP Çıktıları ve Teyit Çarpanı
 */
export function calculateNewsScore(
  nlpData: ValidatedNlpData | null | undefined,
  newsHitRateLast90Days = 0.65
): number {
  if (!nlpData) return 0;

  // SADECE validation layer'dan ACCEPT veya DOWNGRADE_CONFIDENCE almış çıktılar girebilir
  if (nlpData.validationStatus === 'REJECT_AND_FLAG') {
    return 0; // Doğrulanamayan haber nötr sayılır
  }

  // Kendi kendini devre dışı bırakma mekanizması (Bölüm 7/9)
  if (newsHitRateLast90Days < 0.55) {
    return 0; // Model haber başarısı %55 altındaysa haber skoru sıfırlanır
  }

  const confirmationMultiplier = (nlpData.independentSourcesCount ?? 1) >= 2 ? 1.0 : 0.5;
  const score = (nlpData.sentimentScore || 0) * confirmationMultiplier;

  return Math.round(clamp(score, -100, 100));
}

/**
 * 5 Kategorinin Tümü İçin Toplu Skor Hesaplayıcı
 */
export function calculateAllCategoryScores(params: {
  technicalData?: TechnicalIndicatorsData | null;
  fundamentals?: FundamentalsData | null;
  nlpData?: ValidatedNlpData | null;
  divergence?: DivergenceResult | null;
  newsHitRateLast90Days?: number;
}): CategoryScores {
  const isRsiValid = typeof params.technicalData?.rsi14 === 'number' && !isNaN(params.technicalData.rsi14);
  const isTrendValid = typeof params.technicalData?.ema20 === 'number' && !isNaN(params.technicalData.ema20);

  const trend = calculateTrendScore(params.technicalData);
  const momentum = calculateMomentumScore(params.technicalData, params.divergence);
  const volatility = calculateVolatilityScore(params.technicalData);
  const value = calculateValueScore(params.fundamentals);
  const news = calculateNewsScore(params.nlpData, params.newsHitRateLast90Days);

  const trendReason = !isTrendValid
    ? 'Yetersiz Veri / Isınma Periyodu'
    : trend >= 35
    ? 'Boğa Ortalamalar Dizilimi & MACD İvmesi'
    : trend <= -35
    ? 'Ayı Dizilimi & Düşüş Baskısı'
    : 'Yönsüz / Karışık Trend';

  const momentumReason = !isRsiValid
    ? 'Yetersiz Veri / Isınma Periyodu'
    : momentum >= 25
    ? 'RSI Aşırı Satım / Pozitif Momentum'
    : momentum <= -25
    ? 'RSI Aşırı Alım / Negatif Momentum'
    : 'Nötr Momentum Bölgesi';

  return {
    trend,
    momentum,
    volatility,
    value,
    news,
    categoryDetails: {
      trendReason,
      momentumReason,
      volatilityReason: volatility !== 0 ? (volatility > 0 ? 'Bollinger Squeeze Yukarı Hacimli Kırılım' : 'Bollinger Squeeze Aşağı Kırılım') : 'Standart Volatilite Bandı',
      valueReason: value >= 30 ? 'Sektör Çarpanlarına Göre İskontolu' : value <= -30 ? 'Sektör Ortalamalarının Üzerinde Primli' : 'Dengeli Değerleme',
      newsReason: news !== 0 ? (news > 0 ? 'Çoklu Kaynakla Teyitli Pozitif Akış' : 'Negatif Haber Baskısı') : 'Nötr / Teyitsiz Haber Akışı',
    },
  };
}

/**
 * Stochastic Oscillator
 */
export function calculateStochastic(
  highs: number[],
  lows: number[],
  closes: number[],
  period = 14,
  smoothK = 3
): { kLine: number[]; dLine: number[] } {
  if (closes.length < period) return { kLine: [], dLine: [] };
  
  const kLine = new Array(closes.length).fill(NaN);
  
  for (let i = period - 1; i < closes.length; i++) {
    const currentClose = closes[i];
    let highestHigh = highs[i];
    let lowestLow = lows[i];
    
    for (let j = i - period + 1; j <= i; j++) {
      if (highs[j] > highestHigh) highestHigh = highs[j];
      if (lows[j] < lowestLow) lowestLow = lows[j];
    }
    
    if (highestHigh !== lowestLow) {
      kLine[i] = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
    } else {
      kLine[i] = 50; // default if range is 0
    }
  }
  
  const validIndices = kLine.map((val, idx) => (!isNaN(val) ? idx : -1)).filter(idx => idx !== -1);
  const validValues = validIndices.map(idx => kLine[idx]);
  const smoothedValid = calculateSMA(validValues, smoothK);
  
  const dLine = new Array(closes.length).fill(NaN);
  validIndices.forEach((origIdx, sliceIdx) => {
    dLine[origIdx] = smoothedValid[sliceIdx];
  });
  
  return { kLine, dLine };
}

/**
 * Pivot Points (Classic)
 */
export function calculatePivotPoints(high: number, low: number, close: number) {
  const pp = (high + low + close) / 3;
  const r1 = (2 * pp) - low;
  const s1 = (2 * pp) - high;
  const r2 = pp + (high - low);
  const s2 = pp - (high - low);
  return { pp, r1, s1, r2, s2 };
}

/**
 * Williams %R
 */
export function calculateWilliamsR(
  highs: number[],
  lows: number[],
  closes: number[],
  period = 14
): number[] {
  if (closes.length < period) return [];
  
  const wr = new Array(closes.length).fill(NaN);
  
  for (let i = period - 1; i < closes.length; i++) {
    const currentClose = closes[i];
    let highestHigh = highs[i];
    let lowestLow = lows[i];
    
    for (let j = i - period + 1; j <= i; j++) {
      if (highs[j] > highestHigh) highestHigh = highs[j];
      if (lows[j] < lowestLow) lowestLow = lows[j];
    }
    
    if (highestHigh !== lowestLow) {
      wr[i] = ((highestHigh - currentClose) / (highestHigh - lowestLow)) * -100;
    } else {
      wr[i] = -50;
    }
  }
  
  return wr;
}
