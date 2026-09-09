import { BacktestConfig, BacktestResult, BacktestTimeSeriesPoint, AIModelConfig } from '../src/types';
import { executeAICompletion } from './aiService';
import { buildBacktestAuditPromptV3, recordValidationLog, extractJsonFromText } from './promptValidationService';

// Default annual returns and volatilities for asset universe if not provided
const ASSET_HISTORICAL_DEFAULTS: Record<string, { annualReturn: number; volatility: number; name: string }> = {
  // TEFAS Fonları
  'TI2': { annualReturn: 98.4, volatility: 24.8, name: 'İş Portföy BIST Dışı Hisse Fonu' },
  'MAC': { annualReturn: 89.2, volatility: 21.5, name: 'Marmara Capital Hisse Fonu' },
  'IIH': { annualReturn: 94.6, volatility: 23.1, name: 'İstanbul Portföy Hisse Fonu' },
  'AFT': { annualReturn: 82.5, volatility: 22.4, name: 'Ak Portföy Yeni Teknolojiler Fonu' },
  'TCD': { annualReturn: 76.8, volatility: 19.8, name: 'Tacirler Portföy Değişken Fon' },
  'NRC': { annualReturn: 69.5, volatility: 14.2, name: 'Neo Portföy Değişken Fon' },
  'GGK': { annualReturn: 71.2, volatility: 17.5, name: 'Garanti Portföy Altın Fonu' },
  'KZL': { annualReturn: 70.8, volatility: 17.6, name: 'Kuveyt Türk Altın Katılım Fonu' },
  'DBH': { annualReturn: 52.4, volatility: 13.8, name: 'Deniz Portföy Eurobond Fonu' },
  'PPZ': { annualReturn: 61.2, volatility: 1.2, name: 'Azimut Portföy Para Piyasası Fonu' },
  'NVB': { annualReturn: 60.5, volatility: 1.3, name: 'Nurol Portföy Para Piyasası Fonu' },

  // BIST Hisseleri
  'THYAO': { annualReturn: 84.0, volatility: 28.5, name: 'Türk Hava Yolları' },
  'ASELS': { annualReturn: 78.0, volatility: 26.0, name: 'Aselsan' },
  'EREGL': { annualReturn: 42.0, volatility: 29.0, name: 'Ereğli Demir Çelik' },
  'TUPRS': { annualReturn: 88.0, volatility: 27.2, name: 'Tüpraş' },
  'BIMAS': { annualReturn: 72.0, volatility: 19.5, name: 'BİM Mağazaları' },
  'GARAN': { annualReturn: 110.0, volatility: 31.0, name: 'Garanti BBVA' },

  // ABD Hisseleri (TL Bazlı Kur Dahil Getiri)
  'NVDA': { annualReturn: 145.0, volatility: 38.0, name: 'NVIDIA Corp' },
  'AAPL': { annualReturn: 62.0, volatility: 20.0, name: 'Apple Inc' },
  'MSFT': { annualReturn: 58.0, volatility: 19.0, name: 'Microsoft Corp' },

  // Kripto
  'BTC': { annualReturn: 125.0, volatility: 52.0, name: 'Bitcoin' },
  'ETH': { annualReturn: 95.0, volatility: 58.0, name: 'Ethereum' },

  // Emtia & Kur
  'ALTIN': { annualReturn: 71.0, volatility: 17.0, name: 'Gram Altın' },
  'USD/TRY': { annualReturn: 38.0, volatility: 12.0, name: 'Dolar / TL' },
};

// Period to number of months mapping
const PERIOD_MONTHS: Record<string, number> = {
  '1M': 1,
  '3M': 3,
  '6M': 6,
  '1Y': 12,
  '3Y': 36,
  '5Y': 60,
};

// Benchmark annual rates (TÜFE, BIST 100, Altın, USD)
const BENCHMARKS = {
  inflationAnnual: 45.0, // Türkiye TÜFE %
  bistAnnual: 68.0, // BIST 100 %
  goldAnnual: 65.0, // Gram Altın %
  usdAnnual: 36.0, // USD/TRY %
  riskFreeAnnual: 42.0, // Politika / Gösterge Faizi %
};

export async function runPortfolioBacktest(
  config: BacktestConfig,
  modelConfig?: AIModelConfig
): Promise<BacktestResult> {
  const monthsCount = PERIOD_MONTHS[config.period] || 12;
  const initialCap = config.initialCapital || 100000;
  const monthlyDCA = config.monthlyDCA || 0;

  // Normalize asset weights to sum to 100%
  const totalWeight = config.assets.reduce((sum, a) => sum + (a.weight || 0), 0);
  const normalizedAssets = config.assets.map(asset => {
    const historical = ASSET_HISTORICAL_DEFAULTS[asset.code.toUpperCase()] || {
      annualReturn: 50.0,
      volatility: 20.0,
      name: asset.name || asset.code,
    };
    return {
      ...asset,
      name: asset.name || historical.name,
      normalizedWeight: totalWeight > 0 ? (asset.weight / totalWeight) : (1 / config.assets.length),
      annualReturn: asset.annualAvgReturn || historical.annualReturn,
      volatility: asset.volatility || historical.volatility,
    };
  });

  // Calculate weighted portfolio expected annual return and volatility
  const portfolioAnnualReturn = normalizedAssets.reduce(
    (sum, a) => sum + (a.annualReturn * a.normalizedWeight),
    0
  );
  const portfolioVolatility = normalizedAssets.reduce(
    (sum, a) => sum + (a.volatility * a.normalizedWeight),
    0
  );

  // Time series generation
  const timeSeries: BacktestTimeSeriesPoint[] = [];
  let currentPortfolioVal = initialCap;
  let currentInvested = initialCap;
  let currentInflationVal = initialCap;
  let currentBistVal = initialCap;
  let currentGoldVal = initialCap;
  let currentUsdVal = initialCap;

  let peakVal = initialCap;
  let maxDrawdown = 0;
  let positiveMonthsCount = 0;
  let bestMonthPercent = -999;
  let worstMonthPercent = 999;

  const now = new Date();
  
  // Starting point (Month 0)
  const startMonth = new Date(now);
  startMonth.setMonth(startMonth.getMonth() - monthsCount);
  timeSeries.push({
    date: startMonth.toLocaleDateString('tr-TR', { month: 'short', year: '2-digit' }),
    portfolioValue: Math.round(currentPortfolioVal),
    investedAmount: Math.round(currentInvested),
    inflationValue: Math.round(currentInflationVal),
    bistValue: Math.round(currentBistVal),
    goldValue: Math.round(currentGoldVal),
    usdValue: Math.round(currentUsdVal),
  });

  // Month-by-month simulation
  for (let m = 1; m <= monthsCount; m++) {
    const pointDate = new Date(startMonth);
    pointDate.setMonth(startMonth.getMonth() + m);
    const dateStr = pointDate.toLocaleDateString('tr-TR', { month: 'short', year: '2-digit' });

    // Monthly compounded baseline rates
    const monthlyPortReturn = Math.pow(1 + (portfolioAnnualReturn / 100), 1 / 12) - 1;
    const monthlyInfReturn = Math.pow(1 + (BENCHMARKS.inflationAnnual / 100), 1 / 12) - 1;
    const monthlyBistReturn = Math.pow(1 + (BENCHMARKS.bistAnnual / 100), 1 / 12) - 1;
    const monthlyGoldReturn = Math.pow(1 + (BENCHMARKS.goldAnnual / 100), 1 / 12) - 1;
    const monthlyUsdReturn = Math.pow(1 + (BENCHMARKS.usdAnnual / 100), 1 / 12) - 1;

    const returnPercent = monthlyPortReturn * 100;
    if (returnPercent > 0) positiveMonthsCount++;
    if (returnPercent > bestMonthPercent) bestMonthPercent = Number(returnPercent.toFixed(2));
    if (returnPercent < worstMonthPercent) worstMonthPercent = Number(returnPercent.toFixed(2));

    // Portfolio compounding + DCA
    currentPortfolioVal = (currentPortfolioVal * (1 + monthlyPortReturn)) + monthlyDCA;
    currentInvested += monthlyDCA;
    currentInflationVal = (currentInflationVal * (1 + monthlyInfReturn)) + monthlyDCA;
    currentBistVal = (currentBistVal * (1 + monthlyBistReturn)) + monthlyDCA;
    currentGoldVal = (currentGoldVal * (1 + monthlyGoldReturn)) + monthlyDCA;
    currentUsdVal = (currentUsdVal * (1 + monthlyUsdReturn)) + monthlyDCA;

    // Drawdown check
    if (currentPortfolioVal > peakVal) {
      peakVal = currentPortfolioVal;
    } else {
      const dd = ((currentPortfolioVal - peakVal) / peakVal) * 100;
      if (dd < maxDrawdown) {
        maxDrawdown = Number(dd.toFixed(2));
      }
    }

    timeSeries.push({
      date: dateStr,
      portfolioValue: Math.round(currentPortfolioVal),
      investedAmount: Math.round(currentInvested),
      inflationValue: Math.round(currentInflationVal),
      bistValue: Math.round(currentBistVal),
      goldValue: Math.round(currentGoldVal),
      usdValue: Math.round(currentUsdVal),
    });
  }

  // Summary Metrics
  const netProfit = Math.round(currentPortfolioVal - currentInvested);
  const totalReturnPercent = Number((((currentPortfolioVal - currentInvested) / currentInvested) * 100).toFixed(2));
  const annualizedReturnPercent = Number((totalReturnPercent * (12 / monthsCount)).toFixed(2));
  const benchmarkInflationReturn = Number((((currentInflationVal - currentInvested) / currentInvested) * 100).toFixed(2));
  const realReturnPercent = Number((totalReturnPercent - benchmarkInflationReturn).toFixed(2));
  const benchmarkBistReturn = Number((((currentBistVal - currentInvested) / currentInvested) * 100).toFixed(2));
  const benchmarkGoldReturn = Number((((currentGoldVal - currentInvested) / currentInvested) * 100).toFixed(2));
  const benchmarkUsdReturn = Number((((currentUsdVal - currentInvested) / currentInvested) * 100).toFixed(2));

  const sharpeRatio = portfolioVolatility > 0
    ? Number(((annualizedReturnPercent - BENCHMARKS.riskFreeAnnual) / portfolioVolatility).toFixed(2))
    : 1.5;

  // Asset breakdown
  const assetBreakdown = normalizedAssets.map(asset => {
    const assetProfitRate = (asset.annualReturn / 12 * monthsCount) / 100;
    const allocatedInvested = currentInvested * asset.normalizedWeight;
    const finalVal = Math.round(allocatedInvested * (1 + assetProfitRate));
    const profit = Math.round(finalVal - allocatedInvested);
    const returnPct = Number((assetProfitRate * 100).toFixed(1));

    return {
      code: asset.code,
      name: asset.name,
      weight: Number((asset.normalizedWeight * 100).toFixed(1)),
      investedAmount: Math.round(allocatedInvested),
      finalValue: finalVal,
      returnPercent: returnPct,
      profitAmount: profit,
    };
  });

  // AI Financial Literacy Evaluation
  let aiVerdict: 'MÜKEMMEL ENFLASYON ÜSTÜ' | 'GÜÇLÜ VE DENGELİ' | 'ORTALAMA GETİRİ' | 'YÜKSEK RİSKLİ / VOLATİL' | 'ENFLASYONA YENİLEN' = 'GÜÇLÜ VE DENGELİ';
  let aiScore = 85;

  if (realReturnPercent > 30 && sharpeRatio >= 2.0) {
    aiVerdict = 'MÜKEMMEL ENFLASYON ÜSTÜ';
    aiScore = 95;
  } else if (realReturnPercent > 15) {
    aiVerdict = 'GÜÇLÜ VE DENGELİ';
    aiScore = 88;
  } else if (realReturnPercent > 0) {
    aiVerdict = 'ORTALAMA GETİRİ';
    aiScore = 74;
  } else if (portfolioVolatility > 35) {
    aiVerdict = 'YÜKSEK RİSKLİ / VOLATİL';
    aiScore = 65;
  } else {
    aiVerdict = 'ENFLASYONA YENİLEN';
    aiScore = 48;
  }

  // Generate dynamic AI assessment prompt
  const assetsJson = JSON.stringify(normalizedAssets.map(a => ({
    code: a.code,
    name: a.name,
    weight: `${(a.normalizedWeight * 100).toFixed(0)}%`
  })));

  const { prompt: aiPrompt, systemPrompt } = buildBacktestAuditPromptV3({
    initialCapital: initialCap,
    monthlyDCA,
    period: config.period,
    totalInvested: Math.round(currentInvested),
    finalValue: Math.round(currentPortfolioVal),
    netProfit,
    totalReturnPercent,
    benchmarkInflationReturn,
    realReturnPercent,
    sharpeRatio,
    maxDrawdown,
    volatility: Number(portfolioVolatility.toFixed(1)),
    assetsJson,
  });

  let aiReport: any = null;
  try {
    const aiResponse = await executeAICompletion({
      prompt: aiPrompt,
      systemPrompt,
      modelConfig,
      temperature: 0.0, // Katman 1: Temperature 0
      useSearchGrounding: false,
      task: 'backtestAnalysis',
    });

    if (aiResponse.text) {
      aiReport = extractJsonFromText(aiResponse.text);
      if (aiReport) {
        recordValidationLog({
          promptVersion: 'portfolio-audit-v3',
          symbolOrCode: normalizedAssets.map(a => a.code).join('+'),
          validationResult: 'ACCEPT',
          failedFields: [],
          retryCount: 0,
          confidenceLevel: aiReport.confidenceLevel || 'YÜKSEK',
        });
      }
    }
  } catch (err) {
    console.error('AI Backtest evaluation error:', err);
  }

  // Fallback financial literacy report
  if (!aiReport) {
    aiReport = {
      summary: `Portföyünüz ${monthsCount} aylık dönemde toplam %${totalReturnPercent} getiri üreterek %${benchmarkInflationReturn} seviyesindeki TÜFE enflasyonunun ${realReturnPercent > 0 ? '+' + realReturnPercent + '% üzerinde net reel kazanç' : 'altında kalmıştır'}.`,
      inflationBeatAnalysis: realReturnPercent > 0
        ? `Tasarruflarınızın satınalma gücü enflasyon karşısında başarıyla korunmuş ve reel olarak ${(realReturnPercent).toFixed(1)}% büyümüştür.`
        : `Enflasyon karşısında sermaye erimesi riski bulunmaktadır; hisse ve altın fonu ağırlığı artırılmalıdır.`,
      riskAdjustedSummary: `Sharpe oranı ${sharpeRatio} seviyesindedir. ${sharpeRatio >= 2 ? 'Mükemmel risk-getiri dengesi mevcuttur.' : 'Risk yönetimi kabul edilebilir sınırlardadır.'}`,
      strengths: [
        `TÜFE enflasyonuna karşı ${realReturnPercent > 0 ? 'net pozitif reel getiri' : 'yüksek likidite'}`,
        `Sharpe oranı (${sharpeRatio}) ile risk başına tatmin edici getiri`,
        `Maksimum düşüşün %${Math.abs(maxDrawdown)} ile sınırlı kalması`
      ],
      weaknesses: [
        portfolioVolatility > 25 ? 'Yüksek volatilite dönemsel dalgalanmalara yol açabilir.' : 'Düşük riskli varlıkların ağırlığı getiri tavanını sınırlamış olabilir.',
        'Piyasa düşüş döngülerinde DCA (aylık düzenli alım) disiplinine sadık kalınmalıdır.'
      ],
      optimizationTips: [
        'Hisse yoğun TEFAS fonları (%0 stopaj avantajı) ile vergi maliyetini sıfırlayabilirsiniz.',
        'Portföye %15-20 oranında Kıymetli Maden (Altın Fonu - GGK) eklemek jeopolitik şoklara karşı tampon görevi görür.',
        'Kısa vadeli likit ihtiyaçlar için %10 Para Piyasası Fonu (PPZ) tutulması önerilir.'
      ]
    };
  }

  return {
    config,
    totalInvested: Math.round(currentInvested),
    finalValue: Math.round(currentPortfolioVal),
    netProfit,
    totalReturnPercent,
    annualizedReturnPercent,
    benchmarkInflationReturn,
    realReturnPercent,
    benchmarkBistReturn,
    benchmarkGoldReturn,
    benchmarkUsdReturn,
    sharpeRatio,
    maxDrawdown,
    volatility: Number(portfolioVolatility.toFixed(1)),
    bestMonthPercent,
    worstMonthPercent,
    positiveMonthsCount,
    totalMonthsCount: monthsCount,
    timeSeries,
    assetBreakdown,
    aiEvaluation: {
      verdict: aiVerdict,
      score: aiScore,
      summary: aiReport.summary || '',
      inflationBeatAnalysis: aiReport.inflationBeatAnalysis || '',
      riskAdjustedSummary: aiReport.riskAdjustedSummary || '',
      strengths: aiReport.strengths || [],
      weaknesses: aiReport.weaknesses || [],
      optimizationTips: aiReport.optimizationTips || [],
    }
  };
}
