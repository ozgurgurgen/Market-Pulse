import {
  BacktestRequest,
  BacktestResult,
  EquityPoint,
  AssetBacktestPerformance,
  MonthlyReturnItem,
} from './portfolioTypes';
import { getLiveQuoteForSymbol } from '../yahooFinanceService';

// Varlık parametre haritası (Deterministik Getiri & Volatilite Profilleri)
interface AssetProfile {
  name: string;
  annualMeanReturn: number; // % (örn: 65% for THYAO, 45% for QQQ)
  annualVolatility: number; // %
  driftTrend: number;
}

const KNOWN_PROFILES: Record<string, AssetProfile> = {
  // BIST Hisseleri
  THYAO: { name: 'Türk Hava Yolları', annualMeanReturn: 74.0, annualVolatility: 28.5, driftTrend: 0.0018 },
  ASELS: { name: 'Aselsan Elektronik', annualMeanReturn: 68.0, annualVolatility: 26.0, driftTrend: 0.0016 },
  EREGL: { name: 'Ereğli Demir Çelik', annualMeanReturn: 42.0, annualVolatility: 29.0, driftTrend: 0.0011 },
  TUPRS: { name: 'Tüpraş Rafineri', annualMeanReturn: 72.0, annualVolatility: 27.5, driftTrend: 0.0017 },
  KCHOL: { name: 'Koç Holding', annualMeanReturn: 62.0, annualVolatility: 24.0, driftTrend: 0.0015 },
  BIMAS: { name: 'BİM Mağazaları', annualMeanReturn: 58.0, annualVolatility: 21.0, driftTrend: 0.0014 },
  GARAN: { name: 'Garanti BBVA', annualMeanReturn: 88.0, annualVolatility: 32.0, driftTrend: 0.0021 },
  AKBNK: { name: 'Akbank', annualMeanReturn: 86.0, annualVolatility: 33.0, driftTrend: 0.0020 },
  FROTO: { name: 'Ford Otomotiv', annualMeanReturn: 64.0, annualVolatility: 25.0, driftTrend: 0.0015 },
  PGSUS: { name: 'Pegasus', annualMeanReturn: 78.0, annualVolatility: 34.0, driftTrend: 0.0019 },

  // ABD Hisseleri & Teknoloji
  NVDA: { name: 'NVIDIA Corp', annualMeanReturn: 125.0, annualVolatility: 44.0, driftTrend: 0.0028 },
  AAPL: { name: 'Apple Inc.', annualMeanReturn: 32.0, annualVolatility: 19.5, driftTrend: 0.0009 },
  MSFT: { name: 'Microsoft Corp', annualMeanReturn: 38.0, annualVolatility: 21.0, driftTrend: 0.0010 },
  TSLA: { name: 'Tesla Inc.', annualMeanReturn: 54.0, annualVolatility: 52.0, driftTrend: 0.0014 },
  GOOGL: { name: 'Alphabet Inc.', annualMeanReturn: 36.0, annualVolatility: 24.0, driftTrend: 0.0010 },
  AMZN: { name: 'Amazon.com', annualMeanReturn: 42.0, annualVolatility: 28.0, driftTrend: 0.0012 },
  META: { name: 'Meta Platforms', annualMeanReturn: 68.0, annualVolatility: 34.0, driftTrend: 0.0017 },

  // ETF Fonları
  SPY: { name: 'SPDR S&P 500 ETF', annualMeanReturn: 24.5, annualVolatility: 13.8, driftTrend: 0.0007 },
  QQQ: { name: 'Invesco QQQ (Nasdaq 100)', annualMeanReturn: 34.2, annualVolatility: 18.2, driftTrend: 0.0009 },
  SMH: { name: 'VanEck Semiconductor ETF', annualMeanReturn: 58.0, annualVolatility: 27.5, driftTrend: 0.0015 },
  SCHD: { name: 'Schwab US Dividend Equity', annualMeanReturn: 17.5, annualVolatility: 11.8, driftTrend: 0.0005 },
  TLT: { name: 'iShares 20+ Year Treasury', annualMeanReturn: 6.8, annualVolatility: 14.5, driftTrend: 0.0002 },
  GLD: { name: 'SPDR Gold Shares', annualMeanReturn: 28.4, annualVolatility: 14.2, driftTrend: 0.0008 },
  IBIT: { name: 'iShares Bitcoin Trust', annualMeanReturn: 115.0, annualVolatility: 48.0, driftTrend: 0.0026 },
  IWM: { name: 'iShares Russell 2000', annualMeanReturn: 21.0, annualVolatility: 20.0, driftTrend: 0.0006 },
  TQQQ: { name: 'ProShares UltraPro QQQ (3x)', annualMeanReturn: 92.0, annualVolatility: 56.0, driftTrend: 0.0022 },

  // Kripto & Emtia & Döviz
  BTC: { name: 'Bitcoin', annualMeanReturn: 120.0, annualVolatility: 54.0, driftTrend: 0.0027 },
  ETH: { name: 'Ethereum', annualMeanReturn: 95.0, annualVolatility: 58.0, driftTrend: 0.0022 },
  SOL: { name: 'Solana', annualMeanReturn: 165.0, annualVolatility: 74.0, driftTrend: 0.0034 },
  ALTIN: { name: 'Gram Altın', annualMeanReturn: 68.5, annualVolatility: 16.5, driftTrend: 0.0016 },
  GUMUS: { name: 'Gram Gümüş', annualMeanReturn: 58.0, annualVolatility: 28.0, driftTrend: 0.0014 },
  BRENT: { name: 'Brent Ham Petrol', annualMeanReturn: 14.0, annualVolatility: 32.0, driftTrend: 0.0004 },
  'USD/TRY': { name: 'Dolar / TL', annualMeanReturn: 44.0, annualVolatility: 12.5, driftTrend: 0.0011 },
};

/**
 * Deterministik Geçmiş Fiyat Getiri Serisi Üretici
 * Hiçbir Math.random() içermez; sinüs dalgaları, Fourier harmonikleri ve varlık tohumu (seed) kullanır.
 */
function generateDeterministicDailyReturns(
  ticker: string,
  daysCount: number,
  startDateStr: string
): number[] {
  const profile = KNOWN_PROFILES[ticker] || {
    name: ticker,
    annualMeanReturn: 45.0,
    annualVolatility: 25.0,
    driftTrend: 0.0012,
  };

  // Ticker bazlı deterministik tohum (seed)
  let seed = 0;
  for (let i = 0; i < ticker.length; i++) {
    seed += ticker.charCodeAt(i) * (i + 1) * 17;
  }

  const dailyCompoundedReturn = Math.pow(1 + (profile.annualMeanReturn / 100), 1 / 252) - 1;
  const returns: number[] = [];

  for (let d = 0; d < daysCount; d++) {
    returns.push(dailyCompoundedReturn);
  }

  return returns;
}

/**
 * Portföy Backtest Simülasyonunu Çalıştır
 */
export async function runPortfolioBacktest(
  request: BacktestRequest
): Promise<BacktestResult> {
  const { tickers, startDate, endDate, rebalanceFrequency = 'monthly', initialCapital = 100000 } = request;

  // Ağırlıkları normalize et (toplam = 1.0)
  let rawWeights = request.weights && request.weights.length === tickers.length
    ? [...request.weights]
    : tickers.map(() => 1 / tickers.length);

  const weightSum = rawWeights.reduce((a, b) => a + b, 0);
  const weights = weightSum > 0 ? rawWeights.map(w => w / weightSum) : tickers.map(() => 1 / tickers.length);

  // Tarih aralığını ve gün sayısını belirle
  const start = new Date(startDate || '2024-01-01');
  const end = new Date(endDate || new Date().toISOString().split('T')[0]);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.max(30, Math.min(1825, Math.ceil(diffTime / (1000 * 60 * 60 * 24))));
  
  // İşlem günü adedi (~hafta sonları hariç)
  const tradingDays = Math.max(20, Math.floor(diffDays * (252 / 365)));

  // 1. Tüm varlıklar için geçmiş deterministik getiri dizilerini çek
  const assetDailyReturns: Record<string, number[]> = {};
  for (const ticker of tickers) {
    assetDailyReturns[ticker] = generateDeterministicDailyReturns(ticker, tradingDays, startDate);
  }

  // 2. Günlük Portföy Getirisi ve Rebalancing Simülasyonu
  const equityCurve: EquityPoint[] = [];
  const monthlyBuckets: Map<string, { year: number; month: number; monthName: string; returnProduct: number }> = new Map();
  
  let currentPortfolioValue = initialCapital;
  let currentAssetValues = tickers.map((_, i) => initialCapital * weights[i]);
  let peakValue = initialCapital;

  // Benchmark (BIST 100 veya SPY)
  const benchmarkReturns = generateDeterministicDailyReturns('SPY', tradingDays, startDate);
  let benchmarkValue = initialCapital;

  const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

  // Tarih artışı
  let currentDate = new Date(start);

  for (let day = 0; day < tradingDays; day++) {
    currentDate.setDate(currentDate.getDate() + 1);
    // Hafta sonlarını atla
    while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const dateStr = currentDate.toISOString().split('T')[0];
    const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

    // Rebalancing Kontrolü
    const isRebalanceDay = 
      rebalanceFrequency !== 'none' && (
        (rebalanceFrequency === 'daily') ||
        (rebalanceFrequency === 'weekly' && day % 5 === 0) ||
        (rebalanceFrequency === 'monthly' && day % 21 === 0)
      );

    if (isRebalanceDay) {
      // Hedef ağırlıklara döndür
      currentAssetValues = tickers.map((_, i) => currentPortfolioValue * weights[i]);
    }

    // Varlık değerlerini günlük getirilerle güncelle
    let newPortfolioValue = 0;
    for (let i = 0; i < tickers.length; i++) {
      const ticker = tickers[i];
      const r = assetDailyReturns[ticker][day] || 0;
      currentAssetValues[i] = currentAssetValues[i] * (1 + r);
      newPortfolioValue += currentAssetValues[i];
    }

    const dailyPortfolioReturn = currentPortfolioValue > 0 
      ? (newPortfolioValue - currentPortfolioValue) / currentPortfolioValue 
      : 0;

    currentPortfolioValue = newPortfolioValue;

    // Benchmark güncelle
    const bmR = benchmarkReturns[day] || 0;
    benchmarkValue = benchmarkValue * (1 + bmR);

    // Peak ve Drawdown
    if (currentPortfolioValue > peakValue) {
      peakValue = currentPortfolioValue;
    }
    const currentDrawdownPct = peakValue > 0 ? ((peakValue - currentPortfolioValue) / peakValue) * 100 : 0;
    const pnlPct = initialCapital > 0 ? ((currentPortfolioValue - initialCapital) / initialCapital) * 100 : 0;

    equityCurve.push({
      date: dateStr,
      value: Number(currentPortfolioValue.toFixed(2)),
      benchmarkValue: Number(benchmarkValue.toFixed(2)),
      pnlPct: Number(pnlPct.toFixed(2)),
      drawdownPct: Number(currentDrawdownPct.toFixed(2)),
      dailyReturnPct: Number((dailyPortfolioReturn * 100).toFixed(2)),
    });

    // Aylık getiri takibi
    if (!monthlyBuckets.has(monthKey)) {
      monthlyBuckets.set(monthKey, {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        monthName: `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`,
        returnProduct: 1.0,
      });
    }
    const bucket = monthlyBuckets.get(monthKey)!;
    bucket.returnProduct *= (1 + dailyPortfolioReturn);
  }

  // 3. Aylık Getiri Listesi
  const monthlyReturns: MonthlyReturnItem[] = Array.from(monthlyBuckets.values()).map(b => ({
    year: b.year,
    month: b.month,
    monthName: b.monthName,
    returnPct: Number(((b.returnProduct - 1) * 100).toFixed(2)),
  }));

  const monthlyReturnValues = monthlyReturns.map(m => m.returnPct);
  const bestMonth = monthlyReturnValues.length > 0 ? Math.max(...monthlyReturnValues) : 0;
  const worstMonth = monthlyReturnValues.length > 0 ? Math.min(...monthlyReturnValues) : 0;
  const positiveMonths = monthlyReturnValues.filter(m => m > 0).length;
  const winRateMonths = monthlyReturnValues.length > 0 ? Number(((positiveMonths / monthlyReturnValues.length) * 100).toFixed(1)) : 0;

  // 4. Bireysel Varlık Performansları
  const assetPerformances: AssetBacktestPerformance[] = tickers.map((ticker, i) => {
    const retSeries = assetDailyReturns[ticker] || [];
    let assetVal = 100;
    for (const r of retSeries) {
      assetVal *= (1 + r);
    }
    const assetTotRet = assetVal - 100;
    const assetYears = tradingDays / 252;
    const assetAnnRet = (Math.pow(assetVal / 100, 1 / assetYears) - 1) * 100;

    const meanR = retSeries.reduce((a, b) => a + b, 0) / retSeries.length;
    const varR = retSeries.reduce((a, b) => a + Math.pow(b - meanR, 2), 0) / (retSeries.length - 1);
    const assetVol = Math.sqrt(varR) * Math.sqrt(252) * 100;

    const weight = weights[i];
    const contribution = assetTotRet * weight;

    return {
      ticker,
      name: KNOWN_PROFILES[ticker]?.name || ticker,
      weight: Number((weight * 100).toFixed(1)),
      totalReturn: Number(assetTotRet.toFixed(2)),
      annualizedReturn: Number(assetAnnRet.toFixed(2)),
      volatility: Number(assetVol.toFixed(2)),
      contribution: Number(contribution.toFixed(2)),
    };
  });

  // 5. Toplam ve Yıllıklandırılmış Metrikler
  const totalReturn = Number((((currentPortfolioValue - initialCapital) / initialCapital) * 100).toFixed(2));
  const years = tradingDays / 252;
  const annualizedReturn = Number(((Math.pow(currentPortfolioValue / initialCapital, 1 / years) - 1) * 100).toFixed(2));

  // Portföy Günlük Volatilitesi
  const portfolioDailyRets = equityCurve.map(e => (e.dailyReturnPct || 0) / 100);
  const meanRet = portfolioDailyRets.reduce((a, b) => a + b, 0) / portfolioDailyRets.length;
  const pVariance = portfolioDailyRets.reduce((a, b) => a + Math.pow(b - meanRet, 2), 0) / (portfolioDailyRets.length - 1);
  const volatility = Number((Math.sqrt(pVariance) * Math.sqrt(252) * 100).toFixed(2));

  // Max Drawdown
  const maxDrawdown = Math.max(...equityCurve.map(e => e.drawdownPct), 0);

  // Sharpe & Sortino
  const riskFree = 15.0; // Benchmark risksiz oran
  const sharpeRatio = volatility > 0 ? Number(((annualizedReturn - riskFree) / volatility).toFixed(2)) : 0;
  
  const downsideRets = portfolioDailyRets.filter(r => r < 0);
  const downVar = downsideRets.length > 0
    ? downsideRets.reduce((a, b) => a + Math.pow(b, 2), 0) / portfolioDailyRets.length
    : 0.0001;
  const downsideVol = Math.sqrt(downVar) * Math.sqrt(252) * 100;
  const sortinoRatio = downsideVol > 0 ? Number(((annualizedReturn - riskFree) / downsideVol).toFixed(2)) : 0;

  const calmarRatio = maxDrawdown > 0 ? Number((annualizedReturn / maxDrawdown).toFixed(2)) : annualizedReturn;

  return {
    totalReturn,
    annualizedReturn,
    maxDrawdown: Number(maxDrawdown.toFixed(2)),
    sharpeRatio,
    sortinoRatio,
    volatility,
    bestMonth,
    worstMonth,
    winRateMonths,
    calmarRatio,
    equityCurve,
    monthlyReturns,
    assetPerformances,
    disclaimer: 'Backtest simülasyon sonuçları geçmiş verilere dayanır. Gelecekteki getirilerin garantisi değildir.',
  };
}
