import { Portfolio, Recommendation } from './portfolioTypes';
import { getLiveQuoteForSymbol } from '../yahooFinanceService';
import { localFinanceApi } from '../dataAdapters/adapters/LocalFinanceApiAdapter';
import { calculateADX, getDynamicWeights } from '../signalEngine/regime';
import { calculateCompositeScore } from '../signalEngine/ensemble';
import { DEFAULT_SIGNAL_ENGINE_CONFIG } from '../signalEngine/config';

/**
 * Portföy Yapay Zekâ Öneri Motoru
 * Sinyal motoru kompozit skorları, piyasa rejimleri ve portföy ağırlık kısıtlarını kullanarak
 * her varlık için dinamik aksiyon ve gerekçe üretir.
 */
export async function generatePortfolioRecommendations(
  portfolio: Portfolio
): Promise<Recommendation[]> {
  const recommendations: Recommendation[] = [];

  if (!portfolio.holdings || portfolio.holdings.length === 0) {
    return recommendations;
  }

  // Toplam portföy güncel değerini hesapla
  let totalPortfolioValue = 0;
  const holdingValues: { ticker: string; value: number }[] = [];

  for (const holding of portfolio.holdings) {
    let quote = null;
    let liveFundPrice = 0;
    if (holding.assetClass === 'FUND') {
      if (localFinanceApi.isConfigured()) {
        try {
          const liveFund = await localFinanceApi.getFundData(holding.ticker);
          if (liveFund) liveFundPrice = Number(liveFund.current_price || liveFund.price) || 0;
        } catch (e) {}
      }
    } else {
      quote = await getLiveQuoteForSymbol(holding.ticker);
    }
    const currentPrice = quote?.currentPrice || (liveFundPrice > 0 ? liveFundPrice : null) || holding.avgBuyPrice;
    const val = currentPrice * holding.quantity;
    holdingValues.push({ ticker: holding.ticker, value: val });
    totalPortfolioValue += val;
  }

  if (totalPortfolioValue <= 0) {
    totalPortfolioValue = portfolio.initialCapital || 100000;
  }

  for (let i = 0; i < portfolio.holdings.length; i++) {
    const holding = portfolio.holdings[i];
    const holdingVal = holdingValues[i]?.value || (holding.avgBuyPrice * holding.quantity);
    const currentWeight = Number(((holdingVal / totalPortfolioValue) * 100).toFixed(1));

    // 1. Sinyal Skoru ve Rejim Hesaplama
    let quote = null;
    let fund: any = null;
    if (holding.assetClass === 'FUND') {
      if (localFinanceApi.isConfigured()) {
        try {
          fund = await localFinanceApi.getFundData(holding.ticker);
        } catch (e) {}
      }
    } else {
      quote = await getLiveQuoteForSymbol(holding.ticker);
    }
    const currentPrice = quote?.currentPrice || (fund ? Number(fund.current_price || fund.price) : null) || holding.avgBuyPrice;

    let score = 65;
    let regime: 'BULL' | 'BEAR' | 'SIDEWAYS' = 'BULL';
    let technicalReason = '';

    if (holding.assetClass === 'FUND' && fund) {
      // TEFAS Fonu Değerlendirmesi
      const ret1y = Number(fund.return_1y || 50.0);
      const sharpe = Number(fund.sharpe_ratio || 1.8);
      const riskScore = Number(fund.risk_score || 5);
      score = Math.min(95, Math.max(30, Math.round(50 + (ret1y / 2) + (sharpe * 8))));
      regime = ret1y > 50 ? 'BULL' : ret1y > 25 ? 'SIDEWAYS' : 'BEAR';
      technicalReason = `1 Yıllık getiri %${ret1y.toFixed(1)}, Sharpe ${sharpe.toFixed(2)} ve risk skoru ${riskScore}/7.`;
    } else {
      // Hisse, ETF, Kripto ve Emtia için Sinyal Motoru
      const spark = quote?.sparkline && quote.sparkline.length >= 10 
        ? quote.sparkline 
        : [currentPrice * 0.99, currentPrice * 0.995, currentPrice * 1.0, currentPrice];
      
      const highs = spark.map(p => p * 1.01);
      const lows = spark.map(p => p * 0.99);
      const closes = spark;

      const adx = calculateADX(highs, lows, closes);
      const { weights, regime: marketRegime } = getDynamicWeights(adx, DEFAULT_SIGNAL_ENGINE_CONFIG);
      
      const dailyChange = quote?.change24hPercent || 0;
      regime = dailyChange > 1.5 ? 'BULL' : dailyChange < -1.5 ? 'BEAR' : (marketRegime === 'TRENDING' ? 'BULL' : 'SIDEWAYS');

      const trendScore = dailyChange > 0 ? 60 : -40;
      const momentumScore = dailyChange > 2 ? 75 : dailyChange < -2 ? -65 : 20;
      const volScore = 30;
      const valueScore = 40;
      const newsScore = 50;

      const comp = calculateCompositeScore(
        {
          trend: trendScore,
          momentum: momentumScore,
          volatility: volScore,
          value: valueScore,
          news: newsScore,
        },
        weights
      );

      // -100..+100 aralığını 0..100 aralığına ölçekle
      score = Math.round(Math.max(10, Math.min(98, (comp + 100) / 2)));
      
      if (quote?.change24hPercent !== undefined) {
        technicalReason = `Günlük değişim %${quote.change24hPercent >= 0 ? '+' : ''}${quote.change24hPercent.toFixed(2)}, ADX trend gücü ${adx.toFixed(0)}.`;
      }
    }

    // 2. Aksiyon ve Güven Skoru Karar Ağacı
    let action: Recommendation['action'] = 'HOLD';
    let confidence = 50;
    let reason = '';
    let suggestedWeight = currentWeight;

    const pnlPct = holding.avgBuyPrice > 0 
      ? ((currentPrice - holding.avgBuyPrice) / holding.avgBuyPrice) * 100 
      : 0;

    if (score >= 75 && regime === 'BULL') {
      if (currentWeight < 25) {
        action = 'ADD';
        confidence = Math.min(92, score + 5);
        reason = `Güçlü yükseliş ivmesi ve boğa rejimi tespit edildi. Portföy ağırlığı artırılabilir. ${technicalReason}`;
        suggestedWeight = Math.min(25, Number((currentWeight * 1.25).toFixed(1)));
      } else {
        action = 'HOLD';
        confidence = 80;
        reason = `Sinyal skoru yüksek ancak portföy ağırlığı (%${currentWeight}) zaten optimum sınırda. Kâr realizasyonu öncesi pozisyon korunabilir.`;
        suggestedWeight = currentWeight;
      }
    } else if (score >= 75 && regime === 'BEAR') {
      action = 'HOLD';
      confidence = 65;
      reason = `Varlık bazında sinyal güçlü ancak genel piyasa ayı rejiminde. Yeni alım yerine mevcut pozisyonu sıkı stop-loss ile koruyun.`;
      suggestedWeight = currentWeight;
    } else if (score < 42 || (pnlPct < -12 && regime === 'BEAR')) {
      action = 'REDUCE';
      confidence = Math.min(88, 100 - score);
      reason = `Teknik momentum zayıfladı ve negatif uyumsuzluk riski mevcut. Olası kayıpları sınırlamak için pozisyon kademeli azaltılabilir.`;
      suggestedWeight = Math.max(5, Number((currentWeight * 0.6).toFixed(1)));
    } else if (currentWeight > 30) {
      action = 'REDUCE';
      confidence = 72;
      reason = `Tek varlık konsantrasyonu (%${currentWeight}) portföy risk sınırının (%30) üzerinde. Risk dağıtımı için kâr satışı önerilir.`;
      suggestedWeight = 20.0;
    } else if (score >= 58 && score < 75) {
      action = 'HOLD';
      confidence = 60;
      reason = `Fiyat nötr konsolidasyon bölgesinde. Trend kırılımı beklenirken mevcut pozisyon tutulabilir. ${technicalReason}`;
      suggestedWeight = currentWeight;
    } else if (score >= 42 && score < 58) {
      action = 'HOLD';
      confidence = 52;
      reason = `Yatay bant hareketi sürüyor. Destek seviyelerinin korunması durumunda pozisyon taşınabilir.`;
      suggestedWeight = currentWeight;
    } else {
      action = 'HOLD';
      confidence = 50;
      reason = `Dengeli piyasa koşulları. Portföy ağırlığı dengede tutulmalı.`;
      suggestedWeight = currentWeight;
    }

    recommendations.push({
      ticker: holding.ticker,
      name: holding.name || quote?.name || holding.ticker,
      action,
      confidence,
      reason,
      currentScore: score,
      suggestedWeight,
      currentWeight,
      marketRegime: regime,
      disclaimer: 'Yatırım tavsiyesi değildir. Algoritmik piyasa ve sinyal analizi çıktısıdır.',
    });
  }

  // Güven skoruna ve önceliğe göre sırala
  return recommendations.sort((a, b) => b.confidence - a.confidence);
}
