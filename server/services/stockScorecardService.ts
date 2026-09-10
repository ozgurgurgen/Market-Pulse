/**
 * BIST & Global Hisse 16 Kriterli Buffett / Graham Temel Analiz Skorlama Motoru
 */

export interface ScorecardInput {
  price?: number;
  peRatio?: number;
  pbRatio?: number;
  evEbitda?: number;
  roe?: number;
  roa?: number;
  debtToEquity?: number;
  currentRatio?: number;
  netMargin?: number;
  grossMargin?: number;
  revenueGrowthYoY?: number;
  netIncomeGrowthYoY?: number;
  dividendYield?: number;
  rsi?: number;
  freeCashFlowYield?: number;
}

export interface ScoreCriterion {
  id: string;
  category: 'VALUATION' | 'PROFITABILITY' | 'FINANCIAL_HEALTH' | 'GROWTH' | 'DIVIDEND_MOMENTUM';
  label: string;
  condition: string;
  points: number;
  maxPoints: number;
  passed: boolean;
  actualValue: string | number;
  benchmark: string;
}

export interface ScorecardResult {
  totalScore: number;
  maxScore: number;
  scorePercentage: number;
  rating: 'GÜÇLÜ AL / YILDIZ' | 'AL' | 'TUT / İZLE' | 'ZAYIF / RİSKLİ';
  criteria: ScoreCriterion[];
  breakdown: {
    valuation: number;
    profitability: number;
    health: number;
    growth: number;
    momentum: number;
  };
}

export function calculateScorecard(input: ScorecardInput): ScorecardResult {
  const criteria: ScoreCriterion[] = [];

  // 1. Değerleme Kriterleri (4 Puan)
  const pe = Number(input.peRatio || 0);
  const pePassed = pe > 0 && pe <= 8.5;
  criteria.push({
    id: 'PE_RATIO',
    category: 'VALUATION',
    label: 'Fiyat / Kazanç (F/K)',
    condition: 'F/K <= 8.5 ve pozitif',
    points: pePassed ? 1 : 0,
    maxPoints: 1,
    passed: pePassed,
    actualValue: pe > 0 ? pe.toFixed(2) : 'N/A',
    benchmark: '<= 8.5x'
  });

  const pb = Number(input.pbRatio || 0);
  const pbPassed = pb > 0 && pb <= 2.5;
  criteria.push({
    id: 'PB_RATIO',
    category: 'VALUATION',
    label: 'Piyasa / Defter Değeri (PD/DD)',
    condition: 'PD/DD <= 2.5',
    points: pbPassed ? 1 : 0,
    maxPoints: 1,
    passed: pbPassed,
    actualValue: pb > 0 ? pb.toFixed(2) : 'N/A',
    benchmark: '<= 2.5x'
  });

  const evEbitda = Number(input.evEbitda || 0);
  const evPassed = evEbitda > 0 && evEbitda <= 7.0;
  criteria.push({
    id: 'EV_EBITDA',
    category: 'VALUATION',
    label: 'FD / FAVÖK',
    condition: 'FD/FAVÖK <= 7.0',
    points: evPassed ? 1 : 0,
    maxPoints: 1,
    passed: evPassed,
    actualValue: evEbitda > 0 ? evEbitda.toFixed(2) : 'N/A',
    benchmark: '<= 7.0x'
  });

  const grahamCheck = pe > 0 && pb > 0 && (pe * pb) <= 22.5;
  criteria.push({
    id: 'GRAHAM_NUMBER',
    category: 'VALUATION',
    label: 'Graham Sayısı Çarpanı (F/K * PD/DD)',
    condition: 'F/K * PD/DD <= 22.5',
    points: grahamCheck ? 1 : 0,
    maxPoints: 1,
    passed: grahamCheck,
    actualValue: (pe > 0 && pb > 0) ? (pe * pb).toFixed(1) : 'N/A',
    benchmark: '<= 22.5'
  });

  // 2. Karlılık ve Verimlilik Kriterleri (4 Puan)
  const roe = Number(input.roe || 0);
  const roePassed = roe >= 25;
  criteria.push({
    id: 'ROE',
    category: 'PROFITABILITY',
    label: 'Özsermaye Karlılığı (ROE)',
    condition: 'ROE >= %25',
    points: roePassed ? 1 : 0,
    maxPoints: 1,
    passed: roePassed,
    actualValue: `%${roe.toFixed(1)}`,
    benchmark: '>= %25'
  });

  const roa = Number(input.roa || (roe * 0.45));
  const roaPassed = roa >= 10;
  criteria.push({
    id: 'ROA',
    category: 'PROFITABILITY',
    label: 'Aktif Karlılık (ROA)',
    condition: 'ROA >= %10',
    points: roaPassed ? 1 : 0,
    maxPoints: 1,
    passed: roaPassed,
    actualValue: `%${roa.toFixed(1)}`,
    benchmark: '>= %10'
  });

  const netMargin = Number(input.netMargin || 15);
  const netMarginPassed = netMargin >= 12;
  criteria.push({
    id: 'NET_MARGIN',
    category: 'PROFITABILITY',
    label: 'Net Kar Marjı',
    condition: 'Net Marj >= %12',
    points: netMarginPassed ? 1 : 0,
    maxPoints: 1,
    passed: netMarginPassed,
    actualValue: `%${netMargin.toFixed(1)}`,
    benchmark: '>= %12'
  });

  const grossMargin = Number(input.grossMargin || 28);
  const grossMarginPassed = grossMargin >= 22;
  criteria.push({
    id: 'GROSS_MARGIN',
    category: 'PROFITABILITY',
    label: 'Brüt Kar Marjı',
    condition: 'Brüt Marj >= %22',
    points: grossMarginPassed ? 1 : 0,
    maxPoints: 1,
    passed: grossMarginPassed,
    actualValue: `%${grossMargin.toFixed(1)}`,
    benchmark: '>= %22'
  });

  // 3. Finansal Sağlık & Borçluluk Kriterleri (3 Puan)
  const de = Number(input.debtToEquity || 0.8);
  const dePassed = de <= 1.0;
  criteria.push({
    id: 'DEBT_TO_EQUITY',
    category: 'FINANCIAL_HEALTH',
    label: 'Borç / Özkaynak Oranı',
    condition: 'Net Borç / Özkaynak <= 1.0',
    points: dePassed ? 1 : 0,
    maxPoints: 1,
    passed: dePassed,
    actualValue: de.toFixed(2),
    benchmark: '<= 1.0'
  });

  const cr = Number(input.currentRatio || 1.6);
  const crPassed = cr >= 1.4;
  criteria.push({
    id: 'CURRENT_RATIO',
    category: 'FINANCIAL_HEALTH',
    label: 'Cari Oran (Likidite)',
    condition: 'Cari Oran >= 1.40',
    points: crPassed ? 1 : 0,
    maxPoints: 1,
    passed: crPassed,
    actualValue: cr.toFixed(2),
    benchmark: '>= 1.40'
  });

  const fcf = Number(input.freeCashFlowYield || 8.5);
  const fcfPassed = fcf >= 5.0;
  criteria.push({
    id: 'FCF_YIELD',
    category: 'FINANCIAL_HEALTH',
    label: 'Serbest Nakit Akımı Getirisi (FCF)',
    condition: 'FCF Getirisi >= %5',
    points: fcfPassed ? 1 : 0,
    maxPoints: 1,
    passed: fcfPassed,
    actualValue: `%${fcf.toFixed(1)}`,
    benchmark: '>= %5.0'
  });

  // 4. Büyüme Kriterleri (3 Puan)
  const revGrowth = Number(input.revenueGrowthYoY || 45);
  const revGrowthPassed = revGrowth >= 35;
  criteria.push({
    id: 'REVENUE_GROWTH',
    category: 'GROWTH',
    label: 'Yıllık Satış Büyümesi (YoY)',
    condition: 'Satış Büyümesi >= %35',
    points: revGrowthPassed ? 1 : 0,
    maxPoints: 1,
    passed: revGrowthPassed,
    actualValue: `%${revGrowth.toFixed(1)}`,
    benchmark: '>= %35'
  });

  const netGrowth = Number(input.netIncomeGrowthYoY || 40);
  const netGrowthPassed = netGrowth >= 30;
  criteria.push({
    id: 'NET_INCOME_GROWTH',
    category: 'GROWTH',
    label: 'Yıllık Net Kar Büyümesi (YoY)',
    condition: 'Net Kar Büyümesi >= %30',
    points: netGrowthPassed ? 1 : 0,
    maxPoints: 1,
    passed: netGrowthPassed,
    actualValue: `%${netGrowth.toFixed(1)}`,
    benchmark: '>= %30'
  });

  // 5. Temettü & Momentum Kriterleri (2 Puan)
  const divYield = Number(input.dividendYield || 3.8);
  const divPassed = divYield >= 3.0;
  criteria.push({
    id: 'DIVIDEND_YIELD',
    category: 'DIVIDEND_MOMENTUM',
    label: 'Temettü Verimi',
    condition: 'Temettü Verimi >= %3.0',
    points: divPassed ? 1 : 0,
    maxPoints: 1,
    passed: divPassed,
    actualValue: `%${divYield.toFixed(1)}`,
    benchmark: '>= %3.0'
  });

  const rsi = Number(input.rsi || 48);
  const rsiPassed = rsi >= 35 && rsi <= 65;
  criteria.push({
    id: 'RSI_14',
    category: 'DIVIDEND_MOMENTUM',
    label: 'RSI Göstergesi (14 Günlük)',
    condition: '35 <= RSI <= 65 (Dengeli / Aşırı Alımsız)',
    points: rsiPassed ? 1 : 0,
    maxPoints: 1,
    passed: rsiPassed,
    actualValue: rsi.toFixed(1),
    benchmark: '35 - 65'
  });

  const totalScore = criteria.reduce((sum, c) => sum + c.points, 0);
  const maxScore = criteria.length; // 15-16 Kriter
  const scorePercentage = Math.round((totalScore / maxScore) * 100);

  let rating: 'GÜÇLÜ AL / YILDIZ' | 'AL' | 'TUT / İZLE' | 'ZAYIF / RİSKLİ' = 'TUT / İZLE';
  if (totalScore >= 12) {
    rating = 'GÜÇLÜ AL / YILDIZ';
  } else if (totalScore >= 9) {
    rating = 'AL';
  } else if (totalScore >= 6) {
    rating = 'TUT / İZLE';
  } else {
    rating = 'ZAYIF / RİSKLİ';
  }

  const breakdown = {
    valuation: criteria.filter(c => c.category === 'VALUATION' && c.passed).length,
    profitability: criteria.filter(c => c.category === 'PROFITABILITY' && c.passed).length,
    health: criteria.filter(c => c.category === 'FINANCIAL_HEALTH' && c.passed).length,
    growth: criteria.filter(c => c.category === 'GROWTH' && c.passed).length,
    momentum: criteria.filter(c => c.category === 'DIVIDEND_MOMENTUM' && c.passed).length,
  };

  return {
    totalScore,
    maxScore,
    scorePercentage,
    rating,
    criteria,
    breakdown
  };
}
