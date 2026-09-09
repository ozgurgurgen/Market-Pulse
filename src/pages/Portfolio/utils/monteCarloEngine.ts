/**
 * High-performance Monte Carlo Return Forecasting Engine
 * Simulates future portfolio value trajectories using Geometric Brownian Motion (GBM)
 * and regular monthly cash flow contributions (DCA).
 */

export interface MonteCarloParams {
  initialValue: number;          // Current portfolio value (e.g. 500,000 TL)
  expectedAnnualReturn: number;  // % Expected annual return (e.g. 45%)
  annualVolatility: number;      // % Annual volatility (e.g. 24%)
  years: number;                 // Forecast horizon: 1, 3, 5, 10
  simulationsCount: number;      // 1000, 2500, 5000 paths
  monthlyContribution: number;   // Regular monthly deposit (DCA), e.g. 10,000 TL
  annualInflationRate: number;   // % Expected annual inflation (e.g. 35%)
}

export interface MonteCarloStepData {
  month: number;
  year: number;
  label: string;
  totalContributed: number;
  p05: number;  // 5th percentile (Severe Bear)
  p25: number;  // 25th percentile (Bearish)
  p50: number;  // 50th percentile (Median / Most Likely)
  p75: number;  // 75th percentile (Bullish)
  p95: number;  // 95th percentile (Extreme Bull)
  realP50: number; // Inflation-adjusted median purchasing power
  inflationBenchmark: number; // Initial capital grown only at inflation
}

export interface MonteCarloResults {
  params: MonteCarloParams;
  timeSeries: MonteCarloStepData[];
  finalMetrics: {
    medianFinalValue: number;
    p05FinalValue: number;
    p25FinalValue: number;
    p75FinalValue: number;
    p95FinalValue: number;
    totalContributed: number;
    medianNetProfit: number;
    medianRealPurchasingPower: number;
    probabilityOfCapitalLoss: number; // % (final < totalContributed)
    probabilityOfBeatingInflation: number; // % (final > inflationBenchmark)
    probabilityOfDoubling: number; // % (final >= 2 * totalContributed)
    valueAtRisk95Amount: number; // Maximum expected loss at 95% confidence
    valueAtRisk95Pct: number;
    conditionalValueAtRisk95: number; // Average loss in the worst 5% scenarios (CVaR)
  };
  samplePaths: { id: number; data: number[] }[]; // Sample 5 visual trajectory paths
}

/**
 * Standard Normal Random Variable Generator using Box-Muller Transform
 */
function randomNormal(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * Quick percentile extraction from a sorted array
 */
function getPercentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const index = (sorted.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

/**
 * Runs the Monte Carlo stochastic simulation
 */
export function runMonteCarloSimulation(params: MonteCarloParams): MonteCarloResults {
  const {
    initialValue,
    expectedAnnualReturn,
    annualVolatility,
    years,
    simulationsCount,
    monthlyContribution,
    annualInflationRate,
  } = params;

  const totalMonths = Math.round(years * 12);
  const dt = 1 / 12; // 1 month time step
  const mu = expectedAnnualReturn / 100;
  const sigma = annualVolatility / 100;
  const monthlyInflation = Math.pow(1 + annualInflationRate / 100, 1 / 12) - 1;

  // Drift and diffusion terms for monthly GBM
  const drift = (mu - 0.5 * sigma * sigma) * dt;
  const volSqrtDt = sigma * Math.sqrt(dt);

  // Store simulation states: array of simulated paths [simIndex][month]
  // To conserve memory for large paths, we can store values per month
  const monthlyDistributions: number[][] = Array.from({ length: totalMonths + 1 }, () => []);
  
  // Pick 5 random simulation paths for sample trajectory rendering
  const samplePathsCount = 5;
  const samplePathsData: number[][] = Array.from({ length: samplePathsCount }, () => [initialValue]);

  // Run each path
  for (let s = 0; s < simulationsCount; s++) {
    let currentVal = initialValue;
    monthlyDistributions[0].push(currentVal);

    const isSample = s < samplePathsCount;

    for (let m = 1; m <= totalMonths; m++) {
      // Add monthly DCA contribution at the beginning of the period
      currentVal += monthlyContribution;

      // GBM Step
      const z = randomNormal();
      const shock = Math.exp(drift + volSqrtDt * z);
      currentVal = currentVal * shock;

      // Floor at zero (cannot drop below zero liability)
      if (currentVal < 0) currentVal = 0;

      monthlyDistributions[m].push(currentVal);

      if (isSample) {
        samplePathsData[s].push(Math.round(currentVal));
      }
    }
  }

  // Calculate percentiles at each month
  const timeSeries: MonteCarloStepData[] = [];
  let cumulativeContributed = initialValue;
  let cumulativeInflation = initialValue;

  for (let m = 0; m <= totalMonths; m++) {
    if (m > 0) {
      cumulativeContributed += monthlyContribution;
      cumulativeInflation = (cumulativeInflation + monthlyContribution) * (1 + monthlyInflation);
    }

    const values = monthlyDistributions[m];
    values.sort((a, b) => a - b);

    const p05 = getPercentile(values, 0.05);
    const p25 = getPercentile(values, 0.25);
    const p50 = getPercentile(values, 0.50);
    const p75 = getPercentile(values, 0.75);
    const p95 = getPercentile(values, 0.95);

    // Inflation discount factor to get real purchasing power
    const inflationDiscount = Math.pow(1 + monthlyInflation, m);
    const realP50 = p50 / inflationDiscount;

    const yearNum = Math.floor(m / 12);
    const monthRemainder = m % 12;
    const label = m === 0 ? 'Bugün' : monthRemainder === 0 ? `${yearNum}. Yıl` : `${m}. Ay`;

    timeSeries.push({
      month: m,
      year: yearNum,
      label,
      totalContributed: Math.round(cumulativeContributed),
      p05: Math.round(p05),
      p25: Math.round(p25),
      p50: Math.round(p50),
      p75: Math.round(p75),
      p95: Math.round(p95),
      realP50: Math.round(realP50),
      inflationBenchmark: Math.round(cumulativeInflation),
    });
  }

  // Analyze final month outcomes
  const finalValues = monthlyDistributions[totalMonths];
  const finalContributed = cumulativeContributed;
  const finalInflationBenchmark = cumulativeInflation;

  let lossCount = 0;
  let beatInflationCount = 0;
  let doubledCount = 0;

  for (let i = 0; i < finalValues.length; i++) {
    const val = finalValues[i];
    if (val < finalContributed) lossCount++;
    if (val > finalInflationBenchmark) beatInflationCount++;
    if (val >= 2 * finalContributed) doubledCount++;
  }

  const p05Final = getPercentile(finalValues, 0.05);
  const p25Final = getPercentile(finalValues, 0.25);
  const p50Final = getPercentile(finalValues, 0.50);
  const p75Final = getPercentile(finalValues, 0.75);
  const p95Final = getPercentile(finalValues, 0.95);

  // Worst 5% subset for CVaR (Expected Shortfall)
  const worst5PercentCount = Math.max(1, Math.floor(finalValues.length * 0.05));
  const worst5PercentValues = finalValues.slice(0, worst5PercentCount);
  const cVaRValue = worst5PercentValues.reduce((s, v) => s + v, 0) / worst5PercentCount;

  const vaRAmount = Math.max(0, finalContributed - p05Final);
  const vaRPct = finalContributed > 0 ? (vaRAmount / finalContributed) * 100 : 0;

  return {
    params,
    timeSeries,
    finalMetrics: {
      medianFinalValue: Math.round(p50Final),
      p05FinalValue: Math.round(p05Final),
      p25FinalValue: Math.round(p25Final),
      p75FinalValue: Math.round(p75Final),
      p95FinalValue: Math.round(p95Final),
      totalContributed: Math.round(finalContributed),
      medianNetProfit: Math.round(p50Final - finalContributed),
      medianRealPurchasingPower: Math.round(p50Final / Math.pow(1 + annualInflationRate / 100, years)),
      probabilityOfCapitalLoss: Number(((lossCount / simulationsCount) * 100).toFixed(1)),
      probabilityOfBeatingInflation: Number(((beatInflationCount / simulationsCount) * 100).toFixed(1)),
      probabilityOfDoubling: Number(((doubledCount / simulationsCount) * 100).toFixed(1)),
      valueAtRisk95Amount: Math.round(vaRAmount),
      valueAtRisk95Pct: Number(vaRPct.toFixed(1)),
      conditionalValueAtRisk95: Math.round(cVaRValue),
    },
    samplePaths: samplePathsData.map((data, id) => ({ id: id + 1, data })),
  };
}
