export interface BuffettValuationInput {
  netIncome: number;
  depreciationAndAmortization: number;
  capitalExpenditures: number;
  marketCap: number;
  currentPrice: number;
  sharesOutstanding: number;
  growthRate1to5: number;
  perpetualGrowthRate: number;
  wacc: number;
  roe: number;
  netMargin: number;
  debtToEquity: number;
}

export interface BuffettValuationResult {
  ownerEarnings: number;
  ownerEarningsPerShare: number;
  oeYield: number;
  intrinsicValuePerShare: number;
  marginOfSafety: number;
  buffettScore: number;
  rating: 'GÜÇLÜ AL' | 'AL' | 'NÖTR' | 'SAT';
}

/**
 * Calculates Buffett Valuation (Owner Earnings, DCF, Margin of Safety, Score)
 */
export function calculateBuffettValuation(data: BuffettValuationInput): BuffettValuationResult {
  // 1. Owner Earnings = Net Income + D&A - CapEx
  const ownerEarnings = data.netIncome + data.depreciationAndAmortization - data.capitalExpenditures;
  const ownerEarningsPerShare = data.sharesOutstanding > 0 ? ownerEarnings / data.sharesOutstanding : 0;
  
  // OE Yield
  const oeYield = data.marketCap > 0 ? (ownerEarnings / data.marketCap) * 100 : 0;

  // 2. DCF based on Owner Earnings
  // Projection for 5 years
  let presentValue = 0;
  let futureOE = ownerEarnings;
  for (let i = 1; i <= 5; i++) {
    futureOE = futureOE * (1 + data.growthRate1to5);
    presentValue += futureOE / Math.pow(1 + data.wacc, i);
  }

  // Terminal Value (Gordon Growth Model)
  const terminalValue = (futureOE * (1 + data.perpetualGrowthRate)) / (data.wacc - data.perpetualGrowthRate);
  const presentTerminalValue = terminalValue / Math.pow(1 + data.wacc, 5);

  const intrinsicValue = presentValue + presentTerminalValue;
  const intrinsicValuePerShare = data.sharesOutstanding > 0 ? intrinsicValue / data.sharesOutstanding : 0;

  // 3. Margin of Safety
  let marginOfSafety = 0;
  if (intrinsicValuePerShare > 0 && data.currentPrice > 0) {
    marginOfSafety = ((intrinsicValuePerShare - data.currentPrice) / intrinsicValuePerShare) * 100;
  }

  // 4. Buffett Score (0 to 100)
  let buffettScore = 0;
  
  // ROE criteria (Max 20 pts)
  if (data.roe > 0.15) buffettScore += 20;
  else if (data.roe > 0.10) buffettScore += 10;
  else if (data.roe > 0.05) buffettScore += 5;

  // Net Margin criteria (Max 20 pts)
  if (data.netMargin > 0.15) buffettScore += 20;
  else if (data.netMargin > 0.10) buffettScore += 10;
  else if (data.netMargin > 0.05) buffettScore += 5;

  // Debt/Equity criteria (Max 20 pts)
  if (data.debtToEquity < 0.5) buffettScore += 20;
  else if (data.debtToEquity < 1.0) buffettScore += 10;

  // Yield criteria (Max 20 pts)
  if (oeYield > 8) buffettScore += 20;
  else if (oeYield > 5) buffettScore += 10;
  else if (oeYield > 3) buffettScore += 5;

  // MoS criteria (Max 20 pts)
  if (marginOfSafety > 30) buffettScore += 20;
  else if (marginOfSafety > 15) buffettScore += 10;
  else if (marginOfSafety > 0) buffettScore += 5;

  // Ensure 0-100 bound
  buffettScore = Math.max(0, Math.min(100, buffettScore));

  // 5. Rating
  let rating: 'GÜÇLÜ AL' | 'AL' | 'NÖTR' | 'SAT' = 'NÖTR';
  if (buffettScore >= 80 && marginOfSafety > 20) {
    rating = 'GÜÇLÜ AL';
  } else if (buffettScore >= 60 && marginOfSafety > 0) {
    rating = 'AL';
  } else if (buffettScore < 40 || marginOfSafety < -10) {
    rating = 'SAT';
  }

  return {
    ownerEarnings,
    ownerEarningsPerShare,
    oeYield,
    intrinsicValuePerShare,
    marginOfSafety,
    buffettScore,
    rating
  };
}
