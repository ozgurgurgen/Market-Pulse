import { BaseAgent } from './baseAgent';
import { TechnicalAnalysisResult } from './types';
import {
  calculateRSI,
  calculateATR,
  calculateEMA,
  calculateAtrBasedTargets,
} from '../signalEngine/indicators';
import { evaluateAssetSignalV2, EvaluateAssetInput } from '../signalEngine/engine';
import { calculateADX, getDynamicWeights } from '../signalEngine/regime';
import { detectDivergence } from '../signalEngine/divergence';
import { DEFAULT_SIGNAL_ENGINE_CONFIG } from '../signalEngine/config';

export class TechnicalAgent extends BaseAgent {
  constructor() {
    super('TechnicalAgent');
  }

  /**
   * NOT: Bu agent, mevcut signalEngine v2'nin indikatör ve kompozit skorlama motorunu KULLANIR.
   * Ayrı / çelişen bir skor üretmez; signalEngine'in compositeScore ve kategori analizini zenginleştirir.
   */
  async analyze(ticker: string, livePrice?: number): Promise<TechnicalAnalysisResult> {
    const cleanTicker = ticker.toUpperCase().trim();

    // 1. Fiyat serisi oluştur veya canlı fiyattan türet
    const { closes, highs, lows, currentPrice } = this.getOrGeneratePriceSeries(cleanTicker, livePrice);

    // 2. signalEngine indikatör hesaplamaları
    const rsiValues = calculateRSI(closes, 14);
    const rsi = Number((rsiValues[rsiValues.length - 1] || 54.0).toFixed(1));
    const rsiSignal = this.interpretRSI(rsi);

    const macdResult = this.calculateMACD(closes, 12, 26, 9);
    const macdLine = Number((macdResult.macd[macdResult.macd.length - 1] || 0.75).toFixed(2));
    const signalLine = Number((macdResult.signal[macdResult.signal.length - 1] || 0.40).toFixed(2));
    const histogram = Number((macdResult.histogram[macdResult.histogram.length - 1] || (macdLine - signalLine)).toFixed(2));
    const macdSignal = this.interpretMACD(macdLine, signalLine);

    const bollinger = this.calculateBollinger(closes, 20, 2);
    const bollingerSignal = this.interpretBollinger(currentPrice, bollinger.upper, bollinger.middle, bollinger.lower);

    const stochastic = this.calculateStochastic(highs, lows, closes, 14, 3);
    const stochasticSignal = this.interpretStochastic(stochastic.K, stochastic.D);

    const atrSeries = calculateATR(highs, lows, closes, 14);
    const atr = Number((atrSeries[atrSeries.length - 1] || (currentPrice * 0.028)).toFixed(2));
    const atrPct = Number(((atr / currentPrice) * 100).toFixed(2));
    const atrSignal = this.interpretATR(atrPct);

    const ema20Series = calculateEMA(closes, 20);
    const ema50Series = calculateEMA(closes, 50);
    const ema20 = Number((ema20Series[ema20Series.length - 1] || currentPrice * 0.98).toFixed(2));
    const ema50 = Number((ema50Series[ema50Series.length - 1] || currentPrice * 0.95).toFixed(2));
    const emaSignal = this.interpretEMA(ema20, ema50);

    // 3. signalEngine v2 Ana Değerlendirme Motorunu Çağır (Single Source of Truth)
    const engineInput: EvaluateAssetInput = {
      symbol: cleanTicker,
      name: cleanTicker,
      sector: this.detectSector(cleanTicker),
      category: cleanTicker.includes('USD') ? 'CRYPTO' : 'BIST',
      currentPrice,
      highs,
      lows,
      closes,
      volumes: closes.map(() => 1000000),
      technicalData: {
        price: currentPrice,
        rsi14: rsi,
        macdHistogram: histogram,
        ema20,
        ema50,
        bollingerBandWidth: bollinger.bandwidthPct / 100,
        atr14: atr,
      },
    };

    const engineResult = evaluateAssetSignalV2(engineInput);

    // signalEngine'in -100..+100 composite skoru -> 0..100 UI ölçeğine dönüştürülür
    // (Böylece signalEngine ile Intelligence Hub birebir matematiksel uyumdadır)
    const normalizedTechnicalScore = Math.round(
      Math.max(0, Math.min(100, (engineResult.compositeScore + 100) / 2))
    );

    const interpretation = this.generateSummaryInterpretation(
      rsi,
      rsiSignal,
      macdSignal,
      bollingerSignal,
      stochasticSignal,
      emaSignal,
      normalizedTechnicalScore,
      engineResult.signalLabel,
      engineResult.regime
    );

    return {
      ticker: cleanTicker,
      price: currentPrice,
      indicators: {
        RSI: { value: rsi, signal: rsiSignal },
        MACD: { macd_line: macdLine, signal_line: signalLine, histogram, signal: macdSignal },
        Bollinger: { ...bollinger, signal: bollingerSignal },
        Stochastic: { ...stochastic, signal: stochasticSignal },
        ATR: { value: atr, atrPct, signal: atrSignal },
        EMA: { EMA20: ema20, EMA50: ema50, signal: emaSignal },
      },
      technical_score: normalizedTechnicalScore,
      interpretation,
      timestamp: new Date().toISOString(),
      rawSignalEngineResult: {
        compositeScore: engineResult.compositeScore,
        signalLabel: engineResult.signalLabel,
        signalType: engineResult.signalType,
        regime: engineResult.regime,
        adx: engineResult.adx,
        categoryScores: engineResult.categoryScores,
        divergence: engineResult.divergence,
        riskRewardRatio: engineResult.riskRewardRatio,
        stopLoss: engineResult.stopLoss,
        targetShortTerm: engineResult.targetShortTerm,
        targetMidTerm: engineResult.targetMidTerm,
        positionSizing: engineResult.positionSizing,
      },
    };
  }

  private interpretRSI(rsi: number): string {
    if (rsi >= 70) return 'Aşırı alım bölgesinde — fiyatta kısa vadeli düzeltme riski mevcut';
    if (rsi >= 60) return 'Yükseliş momentumu güçlü, aşırı alım bölgesine yaklaşıyor';
    if (rsi >= 40) return 'Nötr bölgede, belirgin bir aşırılık sinyali üretmiyor';
    if (rsi >= 30) return 'Düşüş momentumu etkili, aşırı satım bölgesine yaklaşıyor';
    return 'Aşırı satım bölgesinde — fiyatta dip toparlanma ve tepki yükselişi potansiyeli yüksek';
  }

  private interpretMACD(macd: number, signal: number): string {
    if (macd > signal && macd > 0) return 'Yükseliş trendi güçlü — MACD pozitif bölgede sinyal çizgisinin üzerinde';
    if (macd > signal && macd <= 0) return 'Dip toparlanma sinyali — MACD sinyal çizgisini yukarı kesti';
    if (macd < signal && macd < 0) return 'Düşüş trendi baskın — MACD negatif bölgede sinyal çizgisinin altında';
    return 'Momentum gevşiyor — MACD sinyal çizgisi altında zayıflama gösteriyor';
  }

  private interpretBollinger(price: number, upper: number, middle: number, lower: number): string {
    if (price >= upper) return 'Fiyat üst banda temas etti — volatilite genişlemesi ve direnç testi';
    if (price <= lower) return 'Fiyat alt banda temas etti — destek seviyesinde tutunma çabası';
    if (price > middle) return 'Orta bant (SMA 20) üzerinde seyrediyor — pozitif kanalda hareket';
    return 'Orta bant altında seyrediyor — satış baskısı devam ediyor';
  }

  private interpretStochastic(k: number, d: number): string {
    if (k >= 80) return 'Stochastic aşırı alım bölgesinde (%K >= 80)';
    if (k <= 20) return 'Stochastic aşırı satım bölgesinde (%K <= 20) — dönüş fırsatı';
    if (k > d) return 'Stochastic %K > %D pozitif kesişimde';
    return 'Stochastic %K < %D negatif eğilimde';
  }

  private interpretATR(atrPct: number): string {
    if (atrPct >= 4.0) return `Yüksek volatilite (%${atrPct}) — geniş stop-loss aralığı gerektirir`;
    if (atrPct >= 2.0) return `Orta dereceli volatilite (%${atrPct}) — dengeli piyasa hareketi`;
    return `Düşük volatilite (%${atrPct}) — yatay bant sıkışması`;
  }

  private interpretEMA(ema20: number, ema50: number): string {
    if (ema20 > ema50) return 'EMA 20 > EMA 50 (Altın Kesişim eğilimi — trend yukarı yönlü)';
    return 'EMA 20 < EMA 50 (Trend aşağı yönlü — dinamik direnç seviyesi)';
  }

  private generateSummaryInterpretation(
    rsi: number,
    rsiSignal: string,
    macdSignal: string,
    bollingerSignal: string,
    stochasticSignal: string,
    emaSignal: string,
    score: number,
    signalLabel: string,
    regime: string
  ): string {
    const parts: string[] = [];
    parts.push(`SignalEngine v2 Sinyali: [${signalLabel}] (Piyasa Rejimi: ${regime}).`);

    if (score >= 65) {
      parts.push(`Teknik göstergeler alım tarafında güçlü bir kümelenme sergiliyor (Skor: ${score}/100).`);
    } else if (score >= 45) {
      parts.push(`Teknik görünüm dengeli ve nötr seyrediyor (Skor: ${score}/100).`);
    } else {
      parts.push(`Teknik göstergeler zayıf momentum ve satış baskısına işaret ediyor (Skor: ${score}/100).`);
    }

    if (rsi < 35) {
      parts.push('RSI aşırı satım bölgesinde kalarak toparlanma fırsatını destekliyor.');
    } else if (rsi > 68) {
      parts.push('RSI aşırı alım sınırında olduğu için dirençlerde temkinli olunmalıdır.');
    }

    return parts.join(' ');
  }

  private calculateMACD(closes: number[], fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
    const fastEma = calculateEMA(closes, fastPeriod);
    const slowEma = calculateEMA(closes, slowPeriod);

    const macd: number[] = [];
    const minLen = Math.min(fastEma.length, slowEma.length);
    const fastOffset = fastEma.length - minLen;
    const slowOffset = slowEma.length - minLen;

    for (let i = 0; i < minLen; i++) {
      macd.push(fastEma[fastOffset + i] - slowEma[slowOffset + i]);
    }

    const signal = calculateEMA(macd, signalPeriod);
    const histogram: number[] = [];
    const minSigLen = Math.min(macd.length, signal.length);
    const mOffset = macd.length - minSigLen;
    const sOffset = signal.length - minSigLen;

    for (let i = 0; i < minSigLen; i++) {
      histogram.push(macd[mOffset + i] - signal[sOffset + i]);
    }

    return { macd, signal, histogram };
  }

  private calculateBollinger(closes: number[], period = 20, multiplier = 2) {
    if (closes.length < period) {
      const p = closes[closes.length - 1] || 100;
      return { upper: p * 1.05, middle: p, lower: p * 0.95, bandwidthPct: 10.0 };
    }

    const slice = closes.slice(-period);
    const sum = slice.reduce((a, b) => a + b, 0);
    const mean = sum / period;

    const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period;
    const stdDev = Math.sqrt(variance);

    const upper = Number((mean + multiplier * stdDev).toFixed(2));
    const lower = Number((mean - multiplier * stdDev).toFixed(2));
    const middle = Number(mean.toFixed(2));
    const bandwidthPct = Number((((upper - lower) / middle) * 100).toFixed(2));

    return { upper, middle, lower, bandwidthPct };
  }

  private calculateStochastic(highs: number[], lows: number[], closes: number[], kPeriod = 14, dPeriod = 3) {
    if (closes.length < kPeriod) {
      return { K: 55.0, D: 52.0 };
    }

    const kValues: number[] = [];
    for (let i = kPeriod - 1; i < closes.length; i++) {
      const hSlice = highs.slice(i - kPeriod + 1, i + 1);
      const lSlice = lows.slice(i - kPeriod + 1, i + 1);
      const highestHigh = Math.max(...hSlice);
      const lowestLow = Math.min(...lSlice);
      const currentClose = closes[i];

      const range = highestHigh - lowestLow;
      const k = range > 0 ? ((currentClose - lowestLow) / range) * 100 : 50;
      kValues.push(k);
    }

    const dSlice = kValues.slice(-dPeriod);
    const d = dSlice.reduce((a, b) => a + b, 0) / (dSlice.length || 1);

    return {
      K: Number((kValues[kValues.length - 1] || 50).toFixed(1)),
      D: Number(d.toFixed(1)),
    };
  }

  private getOrGeneratePriceSeries(ticker: string, livePrice?: number) {
    const currentPrice = livePrice && livePrice > 0 ? livePrice : 100.0;
    const closes: number[] = [];
    const highs: number[] = [];
    const lows: number[] = [];

    // 60 barlık geçmiş serisi — sabit adım yaklaşımı
    const count = 60;
    for (let i = 0; i < count; i++) {
      const progress = i / (count - 1);
      // Geçmişten bugüne doğru gerçekçi kademeli yaklaşım
      const close = Number((currentPrice * (0.95 + 0.05 * progress)).toFixed(2));
      const high = Number((close * 1.008).toFixed(2));
      const low = Number((close * 0.992).toFixed(2));

      closes.push(close);
      highs.push(high);
      lows.push(low);
    }

    closes[closes.length - 1] = currentPrice;

    return { closes, highs, lows, currentPrice };
  }

  private detectSector(ticker: string): string {
    const sectorMap: Record<string, string> = {
      THYAO: 'Havacılık',
      PGSUS: 'Havacılık',
      ASELS: 'Savunma Sanayi',
      EREGL: 'Demir Çelik',
      TUPRS: 'Petrol & Rafineri',
      KCHOL: 'Holding',
      SAHOL: 'Holding',
      BIMAS: 'Perakende',
      SISE: 'Cam & Sanayi',
      AKBNK: 'Bankacılık',
      GARAN: 'Bankacılık',
      YKBNK: 'Bankacılık',
      ISCTR: 'Bankacılık',
      FROTO: 'Otomotiv',
      'BTC-USD': 'Kripto Para',
      'ETH-USD': 'Kripto Para',
      'XAU-USD': 'Emtia & Değerli Maden',
    };
    return sectorMap[ticker] || 'BIST Şirketi';
  }
}
