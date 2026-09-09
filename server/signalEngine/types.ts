export type MarketCategory = 'BIST' | 'CRYPTO' | 'US_STOCKS' | 'US_ETF' | 'FUND' | 'COMMODITY' | 'FOREX';

export interface PriceBar {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicatorsData {
  price: number;
  ema20?: number;
  ema50?: number;
  sma200?: number;
  macdHistogram?: number;
  previousMacdHistogram?: number;
  rsi14?: number;
  bollingerBandWidth?: number; // (Upper - Lower) / Middle
  bollingerBandWidthHistory?: number[]; // Son 252 gün
  isUpperBandBreakout?: boolean;
  isLowerBandBreakdown?: boolean;
  volume20Avg?: number;
  currentVolume?: number;
  atr14?: number;
}

export interface FundamentalsData {
  stockPE?: number | null;
  sectorMedianPE?: number | null;
  stockPB?: number | null;
  sectorMedianPB?: number | null;
  ebitdaGrowthYoY?: number | null;
  evToEbitda?: number | null;
  sectorMedianEvToEbitda?: number | null;
}

export interface ValidatedNlpData {
  validationStatus: 'ACCEPT' | 'DOWNGRADE_CONFIDENCE' | 'REJECT_AND_FLAG';
  sentimentScore: number; // -100 to 100
  independentSourcesCount: number;
  summary?: string;
}

export interface CategoryScores {
  trend: number; // -100 to 100
  momentum: number; // -100 to 100
  volatility: number; // -100 to 100
  value: number; // -100 to 100
  news: number; // -100 to 100
  categoryDetails?: {
    trendReason: string;
    momentumReason: string;
    volatilityReason: string;
    valueReason: string;
    newsReason: string;
  };
}

export interface WeightConfig {
  trend: number;
  momentum: number;
  volatility: number;
  value: number;
  news: number;
}

export type MarketRegime = 'TRENDING' | 'RANGING' | 'NEUTRAL';

export type SignalLabel = 'GÜÇLÜ TERCİH' | 'KADEMELİ AL' | 'İZLEMEDE KAL' | 'UZAK DUR / ÇIK';
export type SignalTypeCode = 'STRONG_BUY' | 'BUY' | 'WATCH' | 'SELL';

export interface SignalThresholds {
  strongBuyThreshold: number; // default 60
  buyThreshold: number; // default 30
  exitThreshold: number; // default -30
}

export interface KellyPositionConfig {
  hardCapPct: number; // default 0.08 (8%)
  kellyMultiplier: number; // default 0.25 (Quarter Kelly)
}

export interface PortfolioRiskConfig {
  maxSameSectorPositions: number; // default 2
  maxTotalOpenRiskPct: number; // default 0.15 (15%)
  maxDailyNewPositions: number; // default 3
}

export interface SignalEngineConfig {
  version: string;
  weightsTrending: WeightConfig;
  weightsRanging: WeightConfig;
  weightsNeutral: WeightConfig;
  thresholds: SignalThresholds;
  kellyConfig: KellyPositionConfig;
  riskConfig: PortfolioRiskConfig;
  minDataPointsRequired: number;
  adxTrendThreshold: number; // default 25
  adxRangeThreshold: number; // default 20
  baseSlippage: number; // default 0.001 (10 bps)
  baseCommission: number; // default 0.0005 (5 bps)
  defaultRiskRewardRatio: number; // default 3.0
}

export interface Position {
  id: string;
  symbol: string;
  sector: string;
  entryPrice: number;
  stopLoss: number;
  targetPrice: number;
  positionSizePct: number; // e.g. 0.06
  openedAt: string; // ISO date
}

export interface SignalCandidate {
  symbol: string;
  name: string;
  sector: string;
  category: MarketCategory;
  entryPrice: number;
  stopLoss: number;
  targetPrice1: number;
  targetPrice2: number;
  positionSizePct: number;
}

export interface DivergenceResult {
  detected: boolean;
  type?: 'positive' | 'negative';
  strength?: number;
  details?: string;
}

export interface SignalEngineResult {
  symbol: string;
  name: string;
  sector: string;
  category: MarketCategory;
  currentPrice: number;
  adx: number;
  regime: MarketRegime;
  categoryScores: CategoryScores;
  weightsUsed: WeightConfig;
  compositeScore: number;
  dataQuality: 'OK' | 'INSUFFICIENT_DATA';
  signalLabel: SignalLabel;
  signalType: SignalTypeCode;
  positionSizing: {
    recommendedPct: number;
    recommendedAmount: number;
    quarterKellyPct: number;
    fullKellyPct: number;
    isHardCapped: boolean;
    equityUsed: number;
  };
  divergence: DivergenceResult;
  riskRewardRatio: string;
  stopLoss: number;
  targetShortTerm: number;
  targetMidTerm: number;
  isPortfolioApproved: boolean;
  portfolioRejectionReason?: string;
  expectedValueMetrics?: {
    winRate: number;
    avgWinLossRatio: number;
    expectancyPct: number;
  };
  generatedAt: string;
}

export interface SignalOutcome {
  id: string;
  symbol: string;
  entryPrice: number;
  exitPrice: number;
  returnPct: number;
  wasWin: boolean;
  holdingDays: number;
  closedAt: string;
}

export interface ExpectedStats {
  winRate: number; // e.g. 0.412
  winRateStdDev: number; // e.g. 0.045
  avgReturn?: number;
  profitFactor?: number;
}

export interface DriftResult {
  driftDetected: boolean;
  action: 'NORMAL' | 'PAUSE_NEW_SIGNALS';
  liveWinRate: number;
  expectedWinRate: number;
  threshold: number;
  message: string;
  evaluatedAt: string;
}
