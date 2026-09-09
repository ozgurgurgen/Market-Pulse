export type MarketCategory = 'ALL' | 'BIST' | 'US_STOCKS' | 'ETF' | 'CRYPTO' | 'COMMODITIES' | 'FOREX';

// AI Model Provider Settings (Gemini, OpenRouter, 9Router, Ollama, Custom)
export type AIProviderType = 'gemini' | 'openrouter' | 'ninerouter' | 'ollama' | 'custom';

// Supported AI Task Types for Task-Based AI Routing
export type AITaskType = 
  | 'chatAdvisor'        // Piyasa Danışmanı & Sohbet Asistanı
  | 'stockAnalysis'       // Hisse Senetleri & Bilanço Analizi
  | 'fundAnalysis'        // TEFAS Fon Analizi & Karne Değerlendirmesi
  | 'opportunityRadar'    // Fırsat Radarı & Canlı Sinyaller
  | 'backtestAnalysis'    // Backtest & Portföy Strateji Yorumu
  | 'macroAnalysis';      // Makro Ekonomi & Piyasa Bülteni

export interface AITaskRouteConfig {
  useGlobal: boolean; // if true, uses root provider & model
  provider: AIProviderType;
  model: string; // Model identifier for this specific task
  temperature?: number;
  customBaseUrl?: string;
  customApiKey?: string;
}

export interface AIModelConfig {
  provider: AIProviderType;
  geminiModel: string; // 'gemini-3.7-flash' | 'gemini-2.5-pro' | 'gemini-2.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite'
  geminiTemperature?: number; // 0.0 to 1.0 (default 0.7)
  geminiSearchGrounding?: boolean; // Google search live grounding
  geminiThinkingBudget?: number; // Reasoning token budget
  
  // OpenRouter (Universal AI Cloud Router)
  openRouterApiKey?: string;
  openRouterModel?: string; // e.g. 'deepseek/deepseek-r1', 'anthropic/claude-3.7-sonnet', 'meta-llama/llama-3.3-70b-instruct'
  openRouterBaseUrl?: string; // default 'https://openrouter.ai/api/v1'
  openRouterTemperature?: number; // 0.0 to 1.0
  openRouterSiteUrl?: string; // HTTP-Referer for rankings
  openRouterAppName?: string; // X-Title for rankings

  // 9Router (Yerel & Ağ AI Yönlendirici / Local AI Router)
  nineRouterBaseUrl?: string; // default 'http://localhost:9999/v1' or 'http://127.0.0.1:9999/v1'
  nineRouterModel?: string; // e.g. 'local-default', 'deepseek-r1', 'llama-3.3-70b'
  nineRouterApiKey?: string; // Optional local/network bearer authorization token
  nineRouterTimeout?: number; // Request timeout in seconds (default: 60)
  nineRouterTemperature?: number; // 0.0 to 1.0 (default: 0.7)
  nineRouterMaxTokens?: number; // Max generation tokens (e.g. 4096, 8192)
  nineRouterFallbackToGemini?: boolean; // If 9Router fails, fallback to Gemini (default: true)

  // Ollama (Yerel LLM)
  ollamaUrl: string; // e.g. 'http://localhost:11434'
  ollamaModel: string; // e.g. 'deepseek-r1:latest', 'llama3.2:latest', 'qwen2.5:latest'
  ollamaTemperature?: number; // 0.0 to 1.0

  // Custom OpenAI-compatible Endpoint
  customBaseUrl?: string;
  customApiKey?: string;
  customModelName?: string;
  customTemperature?: number;

  // Task-specific AI Model Routing (Görev Bazlı Yapay Zeka Matrisi)
  taskRoutes?: Partial<Record<AITaskType, AITaskRouteConfig>>;

  // Global UI & Feature Settings
  tickerSpeed?: number; // Speed of top market ticker in seconds
  newsTickerSpeed?: number; // Speed of news ticker in seconds
  radarScope?: 'ALL' | 'FAVORITES'; // Scope of AI Opportunity Radar
  radarLayout?: 'GRID' | 'LIST'; // Layout of Opportunity Radar
}

// TEFAS Fund Category & Types
export type TefasCategory = 
  | 'ALL'
  | 'HISSE_YOGUN' 
  | 'DEGISKEN' 
  | 'SERBEST' 
  | 'KIYMETLI_MADEN' 
  | 'EUROBOND' 
  | 'PARA_PIYASASI' 
  | 'FON_SEPETI'
  | 'YABANCI';

export type TefasFundCategory = TefasCategory;
export type InvestmentHorizon = 'ALL' | 'SHORT' | 'MEDIUM' | 'LONG';
export type TefasFundHorizon = 'ALL' | 'SHORT' | 'MEDIUM' | 'LONG';
export type RiskLevelFilter = 'ALL' | 'LOW' | 'BALANCED' | 'HIGH' | 'AGGRESSIVE';
export type TefasRiskLevel = RiskLevelFilter;

export interface TefasFund {
  code: string;
  name: string;
  founder: string; // Portföy Yönetim Şirketi
  category: TefasCategory;
  categoryLabel: string;
  riskScore: number; // 1 to 7
  horizon: 'SHORT' | 'MEDIUM' | 'LONG'; // SHORT: 1-3 ay, MEDIUM: 3-12 ay, LONG: 1-5 yıl
  price: number;
  dailyReturn: number;
  return1M: number;
  return3M: number;
  return6M: number;
  return1Y: number;
  return3Y: number;
  return5Y: number;
  annualizedReturn: number;
  inflationBeat1Y: number; // Reel Getiri Farkı % (örn: +24.5%)
  sharpeRatio: number;
  standardDeviation: number; // Volatilite %
  maxDrawdown: number; // Maksimum Kayıp %
  negativeDaysPercent: number; // Kayıp Yaşanan Gün Oranı %
  managementFee: number; // Yıllık Yönetim Ücreti %
  withholdingTax: number; // Stopaj Oranı % (%0 veya %10)
  settlementBuy: string; // Valör Alış örn: 'T+1'
  settlementSell: string; // Valör Satış örn: 'T+2'
  fundSize: string;
  aum?: number; // Fon Büyüklüğü örn: '14.8 Milyar ₺'
  investorCount: number;
  assetAllocation: { label: string; ratio: number; color: string }[];
  topHoldings: string[];
  aiVerdict: 'ENFLASYON KALKANI' | 'GÜÇLÜ AL' | 'DENGELİ BİRİKİM' | 'KISA VADE LİKİT' | 'YÜKSEK BÜYÜME' | 'İZLEMEDE KAL';
  aiLiteracyScore: number; // 0 - 100
  aiStrategyNote: string;
  aiReasoning: string;
  sparkline: number[];
}

export interface TefasFundDetail extends TefasFund {
  managerProfile: string;
  stressTestScore: number;
  inflationSimulation: {
    period: string;
    nominalFundGain: number;
    inflationRate: number;
    netRealGain: number;
    purchasingPowerProtection: 'TAM KORUMA' | 'YÜKSEK REEL KAZANÇ' | 'KISMİ KORUMA' | 'ENFLASYON ALTI';
  }[];
  monthlyPerformance: { month: string; fundReturn: number; inflationRate: number; bistReturn: number }[];
  aiLiteracyDeepReport: {
    pros: string[];
    cons: string[];
    suitability: string;
    taxAdvice: string;
    idealEntryExitStrategy: string;
  };
}

// Backtest System Types
export interface BacktestAsset {
  code: string;
  name: string;
  type: 'TEFAS_FUND' | 'STOCK_BIST' | 'STOCK_US' | 'ETF' | 'CRYPTO' | 'COMMODITY' | 'FOREX';
  weight: number; // 0 - 100
  annualAvgReturn: number;
  volatility: number;
}

export type BacktestAssetSelection = BacktestAsset;

export interface BacktestConfig {
  initialCapital: number; // ₺
  monthlyDCA: number; // ₺
  period: '1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y';
  rebalanceFrequency?: 'NONE' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  assets: BacktestAsset[];
}

export interface BacktestTimeSeriesPoint {
  date: string;
  portfolioValue: number;
  investedAmount: number;
  inflationValue: number; // TÜFE karşılaştırması
  bistValue: number;
  goldValue: number;
  usdValue: number;
}

export interface BacktestResult {
  config: BacktestConfig;
  totalInvested: number;
  finalValue: number;
  netProfit: number;
  totalReturnPercent: number;
  annualizedReturnPercent: number;
  benchmarkInflationReturn: number; // TÜFE kümülatif getiri %
  realReturnPercent: number; // Enflasyondan arındırılmış net getiri %
  benchmarkBistReturn: number;
  benchmarkGoldReturn: number;
  benchmarkUsdReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  bestMonthPercent: number;
  worstMonthPercent: number;
  positiveMonthsCount: number;
  totalMonthsCount: number;
  timeSeries: BacktestTimeSeriesPoint[];
  assetBreakdown: {
    code: string;
    name: string;
    weight: number;
    investedAmount: number;
    finalValue: number;
    returnPercent: number;
    profitAmount: number;
  }[];
  aiEvaluation: {
    verdict: 'MÜKEMMEL ENFLASYON ÜSTÜ' | 'GÜÇLÜ VE DENGELİ' | 'ORTALAMA GETİRİ' | 'YÜKSEK RİSKLİ / VOLATİL' | 'ENFLASYONA YENİLEN';
    score: number;
    summary: string;
    inflationBeatAnalysis: string;
    riskAdjustedSummary: string;
    strengths: string[];
    weaknesses: string[];
    optimizationTips: string[];
  };
}

export interface StockQuote {
  symbol: string;
  name: string;
  exchange: string;
  category: MarketCategory;
  currentPrice: number;
  change24h: number | null;
  change24hPercent: number | null;
  currency: string;
  high24h: number;
  low24h: number;
  volume: string;
  sector?: string;
  marketCap?: string;
  peRatio?: number;
  yahooTicker?: string;
  yahooFinanceUrl?: string;
  googleFinanceTicker?: string;
  sparkline: number[];
  sparklineReal?: (number | null)[];
  lastUpdated: string;
  isLiveRealtime?: boolean;
}

export type SignalType = 'STRONG_BUY' | 'BUY' | 'WATCH' | 'TAKE_PROFIT' | 'SELL';

export interface OpportunitySignal {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  category: MarketCategory;
  signalType: SignalType;
  strategy: string;
  confidenceScore: number;
  currentPrice: number;
  entryPrice: number;
  targetPrice1: number;
  targetPrice2: number;
  stopLoss: number;
  riskRewardRatio: string;
  timeframe: string;
  keyCatalysts: string[];
  technicalSummary: {
    rsi: number;
    macd: string;
    trend: string;
    support: number;
    resistance: number;
  };
  newsSentiment: 'Çok Olumlu' | 'Pozitif' | 'Nötr' | 'Riskli';
  summary: string;
  sources?: { title: string; uri: string }[];
  detectedAt: string;
  
  // Sinyal Motoru v2 Ensemble & Risk Alanları
  ensembleV2?: {
    regime: 'TRENDING' | 'RANGING' | 'NEUTRAL';
    adx: number;
    compositeScore: number;
    signalLabel: string;
    categoryScores: {
      trend: number;
      momentum: number;
      volatility: number;
      value: number;
      news: number;
      reasons?: {
        trend?: string;
        momentum?: string;
        volatility?: string;
        value?: string;
        news?: string;
      };
    };
    weights: {
      trend: number;
      momentum: number;
      volatility: number;
      value: number;
      news: number;
    };
    positionSizing: {
      recommendedPct: number;
      recommendedAmount: number;
      quarterKellyPct: number;
      fullKellyPct: number;
      isHardCapped: boolean;
    };
    portfolioApproval: {
      approved: boolean;
      rejectionReason?: string;
    };
    divergence?: {
      detected: boolean;
      type?: 'positive' | 'negative';
      details?: string;
    };
  };
}

export interface FinancialKarneMetric {
  name: string;
  description?: string;
  value: string | number;
  benchmark?: string;
  status: 'passed' | 'warning' | 'failed';
  score: number; // 0 to 10
  note?: string;
}

export interface FinancialKarne {
  overallScore: number; // e.g. 14/18
  profitability: {
    score: number; // 0 to 6
    metrics: FinancialKarneMetric[]; // 6 metrics: Brüt Marj, FAVÖK Marjı, Net Kâr Marjı, ROE (Özsermaye Kârlılığı), ROA (Aktif Kârlılık), Faaliyet Kâr Marjı
  };
  growth: {
    score: number; // 0 to 6
    metrics: FinancialKarneMetric[]; // 6 metrics: Satış Geliri Artışı (YoY), FAVÖK Artışı, Net Kâr Büyümesi, İhracat Oranı, Faaliyet Kârı Büyümesi, Özkaynak Büyümesi
  };
  leverage: {
    score: number; // 0 to 6
    metrics: FinancialKarneMetric[]; // 6 metrics: Finansal Kaldıraç Oranı, Net Borç / FAVÖK, Cari Oran, Likidite Oranı (Asit-Test), Borç / Özsermaye, Faiz Karşılama Oranı
  };
  summary: string;
}

export interface CapitalAndDividends {
  dividendYield: number; // %
  payoutRatio: number; // % Dağıtma Oranı
  regularityStreakYears: number; // Düzenli Temettü Yılı
  capitalIncreaseHistory: {
    year: string;
    type: 'BEDELLİ' | 'BEDELSİZ' | 'TEMETTÜ';
    rate: number; // %
    description: string;
  }[];
  dilutionRisk: 'DÜŞÜK' | 'ORTA' | 'YÜKSEK';
  dilutionAnalysis: string;
}

export interface ShareBuybackData {
  hasActiveProgram: boolean;
  programLimitShares: string;
  purchasedShares: string;
  completionRate: number; // %
  averageCost: number;
  fundingSource: 'SAĞLIKLI_NAKİT_AKIŞI' | 'BORÇLANMA_KAYNAKLI' | 'YOK';
  managementSignal: string;
  supportLevelImpact: string;
}

export interface NewBusinessDeal {
  date: string;
  customerOrProject: string;
  amountTRY: number;
  amountCurrencyStr: string;
  ratioToAnnualRevenue: number; // % Ciroya Oranı
  impactVerdict: 'ÇOK_GÜÇLÜ' | 'ÖNEMLİ' | 'RUTİN';
  deliveryPeriod: string;
  kapSourceUrl?: string;
}

export interface IndexContributionData {
  indexName: 'BIST 100' | 'BIST 30' | 'BIST TÜM-100' | 'S&P 500' | 'NASDAQ 100';
  indexWeight: number; // %
  dailyPointContribution: number; // +4.2 puan veya -2.1 puan
  isMarketLeader: boolean;
  marketEngineeringAlert?: string;
  correlationScore: number; // -1 to +1
}

export interface IPOAndFundUsageData {
  isRecentIPO: boolean;
  ipoDate?: string;
  ipoSize?: string;
  distributionMethod?: string;
  consortiumLeader?: string;
  discountRate?: number;
  fundUsageBreakdown?: {
    category: 'Yeni Yatırım & Kapasite Artışı' | 'Ar-Ge & Teknoloji' | 'İşletme Sermayesi' | 'Borç Kapatma / Finansman' | 'Ortak Satışı';
    percentage: number;
    description: string;
  }[];
  qualityVerdict?: 'YÜKSEK KALİTE (BÜYÜME ODAKLI)' | 'ORTALAMA (DENGELİ)' | 'YÜKSEK RİSK (BORÇ/ORTAK SATIŞI)';
  analysisNote?: string;
}

export interface StrategyDecisionMatrix {
  companyHealthScore: {
    score: number; // 0-100
    profitabilityVerdict: string;
    growthVerdict: string;
    debtVerdict: string;
  };
  catalystsEvaluation: {
    newBusinessImpact: string;
    buybackSignal: string;
    ipoFundQuality?: string;
  };
  capitalStructureEvaluation: {
    dividendDiscipline: string;
    dilutionRisk: string;
  };
  marketCorrelation: {
    indexImpact: string;
    independenceStatus: string;
  };
  finalStrategyMatch: 'DEĞER YATIRIMI' | 'BÜYÜME & MOMENTUM' | 'TEMETTÜ & GELİR' | 'MOMENTUM & KISA VADE TRADE' | 'UZAK DURULMALI (YÜKSEK RİSK)';
  strategicActionSummary: string;
}

export interface StockAnalysisDetail {
  symbol: string;
  name: string;
  exchange: string;
  currentPrice: number;
  currency: string;
  verdict: 'GÜÇLÜ AL' | 'KADEMELİ AL' | 'İZLEMEDE KAL' | 'DÜZELTME BEKLE' | 'ZARAR KES / SAT';
  score: number; // 0 - 100
  targetShortTerm?: number;
  targetMidTerm?: number;
  stopLoss?: number;
  riskReward?: string;
  institutionalInOutScore?: number;
  riskScore?: number;
  _isMasked?: boolean;
  strategyName: string;
  companyOverview: string;
  technicalAnalysis: string;
  fundamentalAnalysis: string;
  catalysts: (string | { text: string; basedOn?: string })[];
  risks: (string | { text: string; basedOn?: string })[];
  newsSentiment: {
    score: number; // -100 to 100
    label: string;
    summary: string;
  };
  recentHeadlines: {
    title: string;
    source: string;
    time: string;
    sentiment: 'positive' | 'negative' | 'neutral';
  }[];
  yahooFinanceUrl?: string;
  googleFinanceUrl?: string;
  confidenceLevel?: 'YÜKSEK' | 'ORTA' | 'DÜŞÜK';
  promptVersion?: string;
  generatedAt?: string; // ISO 8601
  groundingUsed?: boolean;
  calculatedTargets?: {
    targetShortTerm: number;
    targetMidTerm: number;
    stopLoss: number;
    riskReward: string;
  };
  validationStatus?: 'ACCEPT' | 'RETRY' | 'REJECT_AND_FLAG' | 'DOWNGRADE_CONFIDENCE';
  whereIWouldBeWrong?: string;
  citations?: Record<string, string>;
  groundingSources?: { title: string; uri: string }[];
  historicalChartData?: { date: string; price: number; ma20: number; ma50: number; volume: number }[];

  // 6 Temel Analiz Göstergesi & Kriter Seti + Strateji Matrisi
  karne?: FinancialKarne;
  capitalAndDividends?: CapitalAndDividends;
  shareBuybacks?: ShareBuybackData;
  newBusinessDeals?: NewBusinessDeal[];
  indexContribution?: IndexContributionData;
  ipoAndFundUsage?: IPOAndFundUsageData;
  strategyDecisionMatrix?: StrategyDecisionMatrix;
  freeDataSources?: {
    kap: string;
    spk: string;
    yfinance: string;
    bistIndex: string;
    tcmbEvds: string;
    fred: string;
  };
}

export interface AnalysisData extends StockAnalysisDetail {
  confidenceLevel: 'YÜKSEK' | 'ORTA' | 'DÜŞÜK';
  promptVersion: string;
  generatedAt: string;
  groundingUsed: boolean;
  calculatedTargets: {
    targetShortTerm: number;
    targetMidTerm: number;
    stopLoss: number;
    riskReward: string;
  };
  validationStatus: 'ACCEPT' | 'RETRY' | 'REJECT_AND_FLAG' | 'DOWNGRADE_CONFIDENCE';
}

export type MarketNewsCategory = MarketCategory | 'TEFAS' | 'KAP' | 'MACRO';

export interface MarketNewsItem {
  id: string;
  title: string;
  summary: string;
  content?: string;
  category: MarketCategory | 'TEFAS' | 'KAP' | 'MACRO';
  impact: 'bullish' | 'bearish' | 'neutral';
  impactScore?: number;
  relatedSymbols: string[];
  source: string;
  time: string;
  timestamp?: number;
  url?: string;
  isBreaking?: boolean;
  aiKeyTakeaways?: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
  relatedSymbols?: string[];
  suggestedPrompts?: string[];
  sources?: { title: string; uri: string }[];
  webResearchUsed?: boolean;
  modelUsed?: string;
}

export interface ApiQuotaInfo {
  id: string;
  name: string;
  provider: string;
  category: 'MARKET_DATA' | 'AI_LLM' | 'SEARCH_RESEARCH' | 'DATABASE' | 'MACRO_DATA' | 'REGULATORY';
  status: 'active' | 'warning' | 'exhausted' | 'ready';
  requestCountToday: number;
  dailyLimit: number | 'UNLIMITED';
  hourlyLimit?: number | 'UNLIMITED';
  remainingToday: number | 'UNLIMITED';
  usedPercentage: number;
  averageLatencyMs: number;
  lastSuccessTimestamp: string;
  resetTime: string;
  tier: string;
  description: string;
  endpointSample: string;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  exchange: string;
  addedPrice: number;
  addedDate: string;
  targetPrice?: number;
  stopLoss?: number;
  notes?: string;
}

// ----------------------------------------------------
// FİNANSAL İSTİHBARAT MERKEZİ (INTELLIGENCE HUB) TYPES
// ----------------------------------------------------

export interface IntelligenceNewsItem {
  id: string;
  headline: string;
  source: 'Bloomberg HT' | 'Foreks' | 'Yahoo Finance' | 'Trading Economics' | 'KAP';
  url: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentiment_score: number;
  impact_score: number;
  news_type: 'earnings' | 'merger_acquisition' | 'regulatory' | 'macro_economic' | 'general';
  published_at: string;
  summary: string;
}

export interface IntelligenceCommentItem {
  id: string;
  user: string;
  text: string;
  source: 'twitter' | 'midas_forum' | 'reddit' | 'bist100_forum';
  sentiment: 'positive' | 'negative' | 'neutral' | 'cautious';
  engagement_score: number;
  likes: number;
  retweets: number;
  replies: number;
  timestamp: string;
}

export interface IntelligenceSentimentDistribution {
  positive: number;
  negative: number;
  neutral: number;
}

export interface IntelligenceTechnicalResult {
  ticker: string;
  price?: number;
  indicators: {
    RSI: { value: number; signal: string };
    MACD: { macd_line: number; signal_line: number; histogram: number; signal: string };
    Bollinger: { upper: number; middle: number; lower: number; bandwidthPct: number; signal: string };
    Stochastic: { K: number; D: number; signal: string };
    ATR: { value: number; atrPct: number; signal: string };
    EMA: { EMA20: number; EMA50: number; signal: string };
  };
  technical_score: number;
  interpretation: string;
  timestamp: string;
  rawSignalEngineResult?: {
    compositeScore?: number;
    signalLabel?: string;
    signalType?: string;
    regime?: string;
    adx?: any;
    categoryScores?: any;
    divergence?: any;
    riskRewardRatio?: string;
    stopLoss?: number;
    targetShortTerm?: number;
    targetMidTerm?: number;
    positionSizing?: any;
  };
}

export interface IntelligenceCrossSignal {
  signal: 'DIVERGENCE' | 'ALIGNED' | 'STRONG' | 'TECHNICAL_ONLY' | 'NEWS_ONLY' | 'WEAK';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface IntelligenceKeyDevelopment {
  type: 'news' | 'technical' | 'sentiment' | 'macro';
  title: string;
  impact_score: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  notify: boolean;
  timestamp: string;
  details?: string;
}

export interface IntelligenceReportData {
  ticker: string;
  assetName?: string;
  category?: string;
  price?: number;
  currency?: string;
  change24h?: number;
  timestamp: string;
  summary: string;
  key_developments: IntelligenceKeyDevelopment[];
  news: IntelligenceNewsItem[];
  top_comments: IntelligenceCommentItem[];
  sentiment_distribution: IntelligenceSentimentDistribution;
  technical: IntelligenceTechnicalResult;
  analysis: {
    news_sentiment: { positive_ratio: number; negative_ratio: number; neutral_ratio: number };
    investor_sentiment: { positive_ratio: number; negative_ratio: number; neutral_ratio: number };
    technical_score: number;
    cross_signals: IntelligenceCrossSignal[];
  };
  telegram_status?: {
    configured: boolean;
    last_notified?: string;
    threshold: number;
  };
  disclaimer: string;
  fromCache?: boolean;
}

// ----------------------------------------------------
// PORTFOLIO MANAGEMENT MODULE TYPES (v1.0)
// ----------------------------------------------------

export type PortfolioAssetClass = 'BIST' | 'US_STOCK' | 'US_ETF' | 'CRYPTO' | 'FUND' | 'COMMODITY' | 'FOREX';

export interface PortfolioHolding {
  id?: string;
  ticker: string;
  name?: string;
  assetClass: PortfolioAssetClass;
  quantity: number;
  avgBuyPrice: number;
  purchaseDate: string;
  currency?: string;
  notes?: string;
}

export interface PortfolioItem {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  baseCurrency: 'TRY' | 'USD';
  initialCapital: number;
  holdings: PortfolioHolding[];
  isActive: boolean;
  notes?: string;
  riskTolerance?: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
  targetReturn?: number;
  benchmark?: string;
}

export interface AssetTimeSeriesPoint {
  date: string;
  price: number;
  marketValue: number;
  cost: number;
  pnl: number;
  pnlPercentage: number;
  dailyReturnPct?: number;
}

export interface PortfolioHoldingSnapshot {
  ticker: string;
  name?: string;
  assetClass: PortfolioAssetClass;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  marketValue: number;
  cost: number;
  pnl: number;
  pnlPercentage: number;
  weightPercentage: number;
  dailyReturnPct?: number;
  currency?: string;
  timeSeries?: AssetTimeSeriesPoint[];
}

export interface PortfolioPerformanceSnapshot {
  date: string;
  totalValue: number;
  totalCost: number;
  pnl: number;
  pnlPercentage: number;
  dailyPnl: number;
  dailyPnlPercentage: number;
  cashFlow?: number;
  twr?: number;
  holdings: PortfolioHoldingSnapshot[];
}

export interface PortfolioTWRPoint {
  date: string;
  value: number; // TWR % return
  totalValue: number;
  cashFlow: number;
  cumulativePnl: number;
  dailyPnl: number;
}

export interface BenchmarkSeriesItem {
  date: string;
  value: number; // % return relative to range anchor
  rawPrice?: number;
}

export interface BenchmarkResult {
  label: string;
  symbol: string;
  code: string;
  data: BenchmarkSeriesItem[];
}

export type PortfolioTransactionType = 'deposit' | 'withdrawal' | 'buy' | 'sell';

export interface PortfolioTransaction {
  id: string;
  portfolioId: string;
  type: PortfolioTransactionType;
  symbol?: string;
  quantity?: number;
  price?: number;
  amount: number;
  date: string;
  timestamp: string;
  notes?: string;
}

export interface PortfolioAIRecommendation {
  ticker: string;
  name?: string;
  action: 'BUY' | 'SELL' | 'HOLD' | 'ADD' | 'REDUCE';
  confidence: number;
  reason: string;
  currentScore: number;
  suggestedWeight: number;
  currentWeight: number;
  marketRegime: 'BULL' | 'BEAR' | 'SIDEWAYS';
  disclaimer: string;
}

export interface PortfolioBacktestRequest {
  tickers: string[];
  weights: number[];
  startDate: string;
  endDate: string;
  initialCapital?: number;
  rebalanceFrequency: 'daily' | 'weekly' | 'monthly' | 'none';
  baseCurrency?: 'TRY' | 'USD';
}

export interface PortfolioEquityPoint {
  date: string;
  value: number;
  benchmarkValue?: number;
  pnlPct: number;
  drawdownPct: number;
  dailyReturnPct?: number;
}

export interface PortfolioMonthlyReturn {
  year: number;
  month: number;
  monthName: string;
  returnPct: number;
}

export interface PortfolioAssetPerformance {
  ticker: string;
  name?: string;
  weight: number;
  totalReturn: number;
  annualizedReturn: number;
  volatility: number;
  contribution: number;
}

export interface PortfolioBacktestResponse {
  totalReturn: number;
  annualizedReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  sortinoRatio: number;
  volatility: number;
  bestMonth: number;
  worstMonth: number;
  winRateMonths?: number;
  calmarRatio?: number;
  equityCurve: PortfolioEquityPoint[];
  monthlyReturns?: PortfolioMonthlyReturn[];
  assetPerformances?: PortfolioAssetPerformance[];
  disclaimer: string;
}

export interface PortfolioRiskWarning {
  metric: string;
  value: number;
  formattedValue: string;
  threshold: string;
  severity: 'warning' | 'danger' | 'info' | 'success';
  message: string;
  suggestion: string;
}

export interface PortfolioRiskMetrics {
  volatility: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  beta: number;
  valueAtRisk95: number;
  diversificationScore: number;
  herfindahlIndex: number;
  assetClassAllocation: { class: PortfolioAssetClass; label: string; value: number; percentage: number }[];
  topHoldingsConcentration: number;
  warnings: PortfolioRiskWarning[];
  recommendations: string[];
}

export interface PortfolioAlertItem {
  id: string;
  portfolioId: string;
  type: 'LARGE_DROP' | 'LARGE_GAIN' | 'MAX_DRAWDOWN' | 'AI_RECOMMENDATION' | 'REBALANCE_NEEDED';
  severity: 'info' | 'success' | 'warning' | 'danger';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// ----------------------------------------------------
// EKONOMİK GÖSTERGELER & MAKRO İSTİHBARAT TİPLERİ
// ----------------------------------------------------
export type IndicatorRegion = 'TR' | 'GLOBAL' | 'US' | 'EU';
export type IndicatorCategory = 
  | 'faiz' 
  | 'enflasyon' 
  | 'istihdam' 
  | 'doviz' 
  | 'risk_istahi' 
  | 'emtia' 
  | 'buyume'
  | 'para_ve_likidite';

export type CorrelationType = 'pozitif' | 'negatif' | 'kosullu';
export type ImpactStrength = 'zayıf' | 'orta' | 'güçlü';

export interface EconomicIndicator {
  id: string;
  indicator_code: string;
  indicator_name: string;
  region: IndicatorRegion;
  category: IndicatorCategory;
  value: number;
  previous_value?: number;
  change_value?: number;
  change_pct?: number;
  change_direction?: 'up' | 'down' | 'neutral';
  unit: string;
  source_api: 'TCMB_EVDS' | 'FRED' | 'ECB' | 'FRANKFURTER' | 'YAHOO_FINANCE' | 'TUIK' | 'ALPHA_VANTAGE';
  fetched_at: string;
  period_date: string;
  is_stale: boolean;
  is_delayed?: boolean;
  frequency?: 'Günlük' | 'Aylık' | 'Çeyreklik' | 'Gerçek Zamanlı';
  description?: string;
}

export interface IndicatorAssetImpact {
  id: string;
  indicator_code: string;
  indicator_name: string;
  asset_symbol: string;
  asset_name?: string;
  correlation_type: CorrelationType;
  strength: ImpactStrength;
  lag_days: number;
  rationale: string;
  is_ai_generated: boolean;
  current_value?: number;
  previous_value?: number;
  unit?: string;
  change_direction?: 'up' | 'down' | 'neutral';
  is_stale?: boolean;
}

export interface SectorOutlook {
  sektor: string;
  egilim: 'pozitif' | 'negatif' | 'notr';
  gerekce: string;
  guven_seviyesi: 'düşük' | 'orta' | 'yüksek';
  destekleyen_gosterge_sayisi: number;
}

export interface AIMacroCommentaryOutput {
  analiz_tarihi: string;
  kullanilan_gostergeler: string[];
  eksik_veri: string[];
  makro_rejim_ozeti: string;
  sektor_gorunumu: SectorOutlook[];
  uyari: string;
}

export type TimeSeriesRange = '3m' | '6m' | '1y' | '5y' | 'max';

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface TimeSeriesIndicator {
  indicator_code: string;
  indicator_name: string;
  unit: string;
  points: TimeSeriesPoint[];
}

export interface EventMarker {
  date: string;
  label: string;
  description?: string;
  type?: 'rate_decision' | 'inflation_peak' | 'policy_shift' | 'macro_event';
}

export interface TimeSeriesResponse {
  range: TimeSeriesRange;
  series: TimeSeriesIndicator[];
  event_markers?: EventMarker[];
  generated_at: string;
}

// ==========================================
// ADVANCED STOCK ANALYSIS - EXTENDED DATA MODELS
// ==========================================

// FAZ 1 & FAZ 8: Şirket & Tez
export interface CompanyThesis {
  ticker: string;
  lastUpdated: string;
  thesisText: string;
  businessModelSummary: string;
  sector: string;
  industry: string;
  competitiveMoat: string[];
  catalysts: string[];
  risks: string[];
  revenueSegments: { name: string; sharePct: number; amountTRY: number }[];
}

// FAZ 1: Finansallar (Bilanço, Gelir Tablosu, Nakit Akımı)
export interface FinancialLineItem {
  key: string;
  label: string;
  values: Record<string, number>; // period -> value
  yoyChanges?: Record<string, number>;
  isHeader?: boolean;
}

export interface FinancialStatementsData {
  ticker: string;
  periods: string[]; // ['2026/06', '2026/03', '2025/12', '2025/09', '2025/06', '2024/12']
  periodType: 'quarterly' | 'annual';
  balanceSheet: FinancialLineItem[];
  incomeStatement: FinancialLineItem[];
  cashFlowStatement: FinancialLineItem[];
}

// FAZ 1: Çarpanlar Tarihçesi
export interface MultipleHistoryPoint {
  date: string;
  pe?: number; // F/K
  pb?: number; // PD/DD
  evebitda?: number; // FD/FAVÖK
  evsales?: number; // FD/Satış
  sectorPe?: number;
  sectorPb?: number;
  sectorEvebitda?: number;
}

export interface MultipleAnalysisData {
  ticker: string;
  currentMultiples: {
    pe: number;
    pb: number;
    evebitda: number;
    evsales: number;
    pegRatio: number;
  };
  percentiles: {
    pePercentile: number; // e.g. 72 (Son 5 yılın %72'sinden ucuz)
    pbPercentile: number;
    evebitdaPercentile: number;
  };
  sectorAverages: {
    sectorName: string;
    pe: number;
    pb: number;
    evebitda: number;
  };
  historicalSeries: MultipleHistoryPoint[];
}

// FAZ 1: Şirket Olayları
export interface CorporateEvent {
  id: string;
  ticker: string;
  date: string;
  type: 'GK' | 'BEDELLI' | 'BEDELSIZ' | 'TEMETTU' | 'KAP' | 'INSIDER' | 'SUNUM';
  title: string;
  description: string;
  sourceUrl?: string;
  impact?: 'positive' | 'neutral' | 'negative';
}

// FAZ 1 & FAZ 8: Mevsimsellik (Seasonality)
export interface MonthlySeasonalityStat {
  month: number;
  monthName: string;
  avgReturn: number;
  medianReturn: number;
  winRate: number; // % pozitif kapanma oranı
  bestYear: { year: number; returnPct: number };
  worstYear: { year: number; returnPct: number };
}

export interface SeasonalityData {
  ticker: string;
  years: number[];
  monthlyReturns: { year: number; month: number; returnPct: number }[];
  monthlyStats: MonthlySeasonalityStat[];
}

// FAZ 2: Fon Pozisyonları (Smart Money / Kurumsal Para Akışı)
export interface FundPositionSummary {
  ticker: string;
  periodDate: string;
  holdingFundCount: number;
  holdingFundCountChange: number;
  totalPositionTRY: number;
  totalPositionUSD: number;
  sharePercentOfCompany: number; // fonların toplam hisseye oranı %
  fundsIncreasingWeight: number;
  fundsDecreasingWeight: number;
  newEntries: number;
  fullExits: number;
}

export interface FundDynamicsRow {
  fundCode: string;
  fundName: string;
  fundLogo?: string;
  category: 'Serbest' | 'Hisse Senedi' | 'Değişken' | 'Karma' | 'Katılım' | 'Fon Sepeti' | string;
  previousWeight: number; // %
  currentWeight: number; // %
  netWeightChange: number; // % puan
  positionValueTRY: number;
  positionValueUSD: number;
  managementCompany: string;
}

// FAZ 8: Algoritmik Teknik & Temel Adil Değerleme
export type TechnicalEnginePreset = 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM' | 'CUSTOM';

export interface TechnicalEngineParams {
  preset?: TechnicalEnginePreset;
  // Hareketli Ortalamalar
  fastMaPeriod: number;       // min: 5, max: 100, default: 20
  mediumMaPeriod: number;     // min: 10, max: 200, default: 50
  slowMaPeriod: number;       // min: 50, max: 300, default: 200
  maType: 'EMA' | 'SMA';
  
  // RSI
  rsiPeriod: number;          // min: 2, max: 50, default: 14
  rsiOverbought: number;      // min: 50, max: 95, default: 70
  rsiOversold: number;        // min: 5, max: 50, default: 30
  
  // MACD
  macdFastPeriod: number;     // min: 2, max: 50, default: 12
  macdSlowPeriod: number;     // min: 5, max: 100, default: 26
  macdSignalPeriod: number;   // min: 2, max: 50, default: 9
  
  // Bollinger Bantları
  bbPeriod: number;           // min: 5, max: 100, default: 20
  bbStdDev: number;           // min: 1.0, max: 4.0, default: 2.0
  
  // ATR & Risk/Ödül
  atrPeriod: number;          // min: 2, max: 50, default: 14
  riskRewardRatio: number;    // min: 1.0, max: 10.0, default: 3.0
  
  // Hacim Anomali Eşiği
  volumeMultiplier: number;   // min: 1.0, max: 10.0, default: 1.5
}

export interface SignalItemSummary {
  name: string;
  category: 'TREND' | 'MOMENTUM' | 'VOLATILITY' | 'SUPPORT_RESISTANCE';
  valueStr: string;
  condition: 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'OVERBOUGHT' | 'OVERSOLD';
  description: string;
}

export interface TechnicalAnalysisResult {
  ticker: string;
  currentPrice: number;
  trendDirection: 'STRONG_BULLISH' | 'BULLISH' | 'NEUTRAL' | 'BEARISH' | 'STRONG_BEARISH';
  supportLevels: number[];
  resistanceLevels: number[];
  bullishScenario: string;
  bearishScenario: string;
  pivotPoint: number;
  rsi: number;
  rsiStatus?: string;
  macdStatus: string;
  macdDetails?: {
    macdLine: number;
    signalLine: number;
    histogram: number;
  };
  bollingerDetails?: {
    upper: number;
    middle: number;
    lower: number;
    bandWidthPct: number;
  };
  atrValue?: number;
  calculatedStopLoss?: number;
  calculatedTarget1?: number;
  calculatedTarget2?: number;
  movingAverages: { name: string; value: number; status: 'ABOVE' | 'BELOW' }[];
  appliedParams?: TechnicalEngineParams;
  paramHash?: string;
  signalsList?: SignalItemSummary[];
  generatedDate: string;
  algorithmVersion: string;
  isCustomParamCalculated?: boolean;
}

export interface AISignalInterpretationResult {
  symbol: string;
  timestamp: string;
  paramPreset: TechnicalEnginePreset;
  activeSignals: SignalItemSummary[];
  educationalAnalysis: {
    summaryConcept: string;
    confluenceAssessment: string; // Sinyallerin birbirini destekleme veya çelişme durumu
    contradictionNote?: string;   // Varsa çelişkili sinyal analizi
    riskAndFalseBreakoutFactors: string; // Hangi koşullarda bu sinyal yanıltıcı/tuzak olabilir
    recommendedEducationalChecklist: string[]; // Yatırımcının teyit için bakması gerekenler
  };
  disclaimer: string;
  modelUsed: string;
  fromCache?: boolean;
  validationStatus: 'PASSED' | 'FILTERED_FALLBACK';
}

export interface FairValueEstimate {
  ticker: string;
  currentPrice: number;
  fairValueEstimate: number;
  upsidePotentialPct: number;
  methodology: string; // örn: "DCF + Sektörel Çarpan Ağırlıklı Model"
  confidenceScore: number; // 0-100
  valuationModels: {
    modelName: string;
    targetPrice: number;
    weight: number;
  }[];
  generatedDate: string;
}

// ----------------------------------------------------
// 1. KURUMSAL YÖNETİM, ORTAKLIK VE İŞTİRAKLER (SUBSIDIARIES & GOVERNANCE)
// ----------------------------------------------------
export interface ShareholderItem {
  name: string;
  sharePercent: number; // %
  nominalValueTRY: number;
  votingPowerPercent: number;
  isFreeFloat?: boolean;
}

export interface SubsidiaryItem {
  companyName: string;
  ownershipPercent: number; // %
  fieldOfActivity: string;
  country: string;
  totalAssetsTRY?: number;
  netIncomeTRY?: number;
  isConsolidated: boolean;
}

export interface OperationalMetricItem {
  metricName: string;
  currentValue: string;
  previousValue: string;
  unit: string;
  changePct: number;
  period: string;
}

export interface CompanySubsidiariesData {
  ticker: string;
  freeFloatRatio: number; // Halka Açıklık Oranı %
  paidCapitalTRY: number; // Ödenmiş Sermaye
  registeredCapitalCeilingTRY?: number; // Kayıtlı Sermaye Tavanı
  shareholders: ShareholderItem[];
  subsidiaries: SubsidiaryItem[];
  operationalData: {
    sectorType: string; // örn: 'Havacılık', 'Bankacılık', 'Otomotiv', 'Sanayi'
    metrics: OperationalMetricItem[];
    exportSharePct: number; // % Cirodaki İhracat Payı
    capacityUtilizationRatePct?: number; // Kapasite Kullanım Oranı %
    totalEmployees: number;
    productionCapacitySummary: string;
  };
}

// ----------------------------------------------------
// 2. SEKTÖREL RAKİP KARŞILAŞTIRMA (PEER COMPARISON)
// ----------------------------------------------------
export interface PeerCompanyRow {
  symbol: string;
  name: string;
  currentPrice: number;
  currency: string;
  pe: number; // F/K
  pb: number; // PD/DD
  evebitda: number; // FD/FAVÖK
  netMargin: number; // Net Kâr Marjı %
  roe: number; // Özkaynak Kârlılığı %
  currentRatio: number; // Cari Oran
  netDebtToEbitda: number; // Net Borç / FAVÖK
  marketCapTRY: number; // Piyasa Değeri
  return1Y: number; // 1 Yıllık Getiri %
  isCurrentStock?: boolean;
}

export interface PeerComparisonData {
  targetTicker: string;
  sectorName: string;
  peers: PeerCompanyRow[];
  sectorAverage: {
    pe: number;
    pb: number;
    evebitda: number;
    netMargin: number;
    roe: number;
    currentRatio: number;
    netDebtToEbitda: number;
  };
  valuationAssessment: {
    isUndervaluedVsPeers: boolean;
    strongestMetric: string;
    weakestMetric: string;
    summary: string;
  };
}

export type KarneMetric = FinancialKarneMetric;
export type KarneMetricStatus = 'passed' | 'warning' | 'failed' | 'pass' | 'fail' | 'neutral';

// ----------------------------------------------------
// 3. GELİŞMİŞ HİSSE FİLTRELEME & SCREENER (ADVANCED SCREENER)
// ----------------------------------------------------
export interface ScreenerFilterConfig {
  searchQuery: string;
  selectedSector: string;
  sector?: string;
  minPe?: number;
  maxPe?: number;
  minPb?: number;
  maxPb?: number;
  minEvebitda?: number;
  maxEvebitda?: number;
  minRoe?: number;
  minNetMargin?: number;
  maxNetDebtToEbitda?: number;
  minRevenueGrowth?: number;
  minDividendYield?: number;
  minScorecardOverall?: number;
  minScorecard?: number;
  minMarketCapTRY?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ScreenerStockRow {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  currency: string;
  change24hPercent: number;
  pe: number;
  pb: number;
  evebitda: number;
  netMargin: number;
  roe: number;
  revenueGrowthYoY: number;
  netDebtToEbitda: number;
  currentRatio: number;
  dividendYield: number;
  scorecardScore: number; // e.g. 15 (out of 18)
  marketCapTRY: number;
  signalType: SignalType;
}

// ----------------------------------------------------
// 4. SON AÇIKLANAN FİNANSAL TABLOLAR (LATEST BALANCE SHEETS)
// ----------------------------------------------------
export interface LatestBalanceSheetItem {
  id: string;
  symbol: string;
  name: string;
  companyName?: string;
  sector: string;
  period: string; // '2026/06'
  announcedAt: string; // '2026-08-24 18:35'
  revenueTRY: number;
  revenueYoYPct: number;
  netIncomeTRY: number;
  netIncomeYoYPct: number;
  netProfitFormatted?: string;
  netProfitGrowthYoY?: number;
  ebitdaTRY: number;
  ebitdaYoYPct: number;
  netDebtTRY: number;
  equityTRY: number;
  scorecardScore: number; // 18 üzerinden
  quarterlyChangeVerdict: 'BEKLENTİ ÜSTÜ' | 'BEKLENTİLERE PARALEL' | 'ZAYIF / DÜŞÜŞ';
  kapLink?: string;
}

// ----------------------------------------------------
// 5. TEMEL ANALİZ AKADEMİSİ (FINANCIAL ACADEMY)
// ----------------------------------------------------
export interface AcademyTopic {
  id: string;
  title: string;
  category: 'temel_oranlar' | 'bilanco_okuma' | 'degerleme_modelleri' | 'fonlar_ve_makro' | 'strateji_ve_risk' | 'likidite_oranlari' | 'borcluluk' | 'karlilik';
  categoryLabel: string;
  shortDescription: string;
  description?: string;
  formula?: string;
  interpretationGuide?: string;
  interpretation?: string;
  idealRange?: string;
  practicalExample?: string;
  example?: string;
  commonMistakes?: string[];
  pitfalls?: string[];
  proTip?: string;
  iconName: string;
}

// ----------------------------------------------------
// 6. BİLANÇO E-POSTA VE BİLDİRİM ABONELİĞİ (BALANCE SHEET ALERTS)
// ----------------------------------------------------
export interface BalanceSheetAlertSubscription {
  email: string;
  subscribedSymbols: string[];
  notifyOnKapDisclosure: boolean;
  notifyOnScorecardUpdate: boolean;
  createdAt: string;
  isActive: boolean;
}

// ----------------------------------------------------
// 7. ÜYELİK VE ABONELİK SİSTEMİ (SUBSCRIPTION & FEATURE GATING)
// ----------------------------------------------------
export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'premium' | 'admin';
export type SubscriptionStatus = 'active' | 'expired' | 'manual_grant' | 'trial';
export type TelegramTier = 'price_only' | 'price_and_news' | 'full_command_center';
export type RatioDepth = 'basic' | 'full';

export interface UserSubscription {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  grantedAt: string;
  expiresAt: string | null;
  grantedBy: string;
}

export interface UserUsage {
  analysisQueriesToday: number;
  aiReportsThisPeriod: number;
  lastResetDate: string;
  lastWeeklyResetDate?: string;
}

export interface SubscriptionPlanLimits {
  dailyAnalysisQueries: number;
  ratioDepth: RatioDepth;
  backtestMaxYears: number;
  backtestMultiAsset: boolean;
  aiReportsPerPeriod: number;
  aiReportsPeriodType: 'day' | 'week' | 'unlimited';
  whatIfSimulator: boolean;
  ipoTracker: boolean; // Halka Arz Takip & Analiz Modülü (Pro & Premium)
  telegramTier: TelegramTier;
  cronDigest: boolean;
  advancedStockMetrics: boolean;
  portfolioMaxAssets: number;
  watchlist: boolean;
  multiPortfolio: boolean;
  priorityAiModel: boolean;
  earlyAccess: boolean;
}

export interface SubscriptionPlanConfig {
  id: SubscriptionTier;
  name: string;
  badge?: string;
  description: string;
  priceMonthlyTRY: number;
  priceAnnualTRY: number;
  isPopular?: boolean;
  limits: SubscriptionPlanLimits;
  featureBullets: {
    title: string;
    included: boolean;
    highlight?: boolean;
  }[];
}

// ==========================================
// HALKA ARZ (IPO) TAKİP & ANALİZ MODÜLÜ TİPLERİ
// ==========================================

export type IPOStatus = 'upcoming' | 'active' | 'completed' | 'draft';
export type IPODistributionMethod = 'equal' | 'proportional' | 'mixed' | 'bist_sale';
export type IPOSource = 'KAP_OFFICIAL' | 'BIST_OFFICIAL' | 'SPK_BULLETIN' | 'MANUAL_ADMIN';

export interface IPOPerformance {
  day1ReturnPct: number | null;
  week1ReturnPct: number | null;
  month1ReturnPct: number | null;
  currentReturnPct: number | null;
  currentPrice: number | null;
  ceilingDaysCount?: number; // Kaç gün tavan serisi yaptığı
  lastUpdated: string;
}

export interface IPOProceedsUse {
  purpose: string;
  ratioPct: number;
}

// ------------------------------------------
// HALKA ARZ (IPO) DERİN ANALİZ ALTLARI
// ------------------------------------------

export interface IPOFinancialMetric3Y {
  year: number | string | null;
  value_try: number | null;
}

export type IPOValuationLabel = 'ucuz' | 'makul' | 'pahalı';
export type IPOUnderwritingType = 'Aracılık Yüklenimi (Garantili)' | 'En İyi Gayret Aracılığı (Garantisiz)';
export type IPOMarketSegment = 'Yıldız Pazar' | 'Ana Pazar' | 'Gelişen İşletmeler Pazarı';

export interface IPOFinancialHealth {
  revenue_3y?: IPOFinancialMetric3Y[] | null;
  net_income_3y?: IPOFinancialMetric3Y[] | null;
  ebitda_3y?: IPOFinancialMetric3Y[] | null;
  implied_pe?: number | null;
  implied_pb?: number | null;
  implied_ev_ebitda?: number | null;
  sector_avg_pe?: number | null;
  sector_avg_ev_ebitda?: number | null;
  valuation_label?: IPOValuationLabel | null;
  debt_to_equity?: number | null;
  _source?: string | null;
}

export interface IPOStructuralRisk {
  underwriting_type?: IPOUnderwritingType | null;
  lockup_period_days?: number | null;
  lockup_expiry_date?: string | null;
  greenshoe_option?: boolean | null;
  greenshoe_percent?: number | null;
  market_segment?: IPOMarketSegment | null;
  _source?: string | null;
}

export interface IPORelativePerformance {
  day1_return_pct?: number | null;
  bist100_return_same_day_pct?: number | null;
  relative_alpha_day1_pct?: number | null;
  bist100_level_at_ipo?: number | null;
  post_listing_ath?: number | null;
  post_listing_atl?: number | null;
  distance_from_ath_pct?: number | null;
  distance_from_atl_pct?: number | null;
}

export interface IPODemandBreakdown {
  domestic_retail_coverage_ratio?: number | null;
  domestic_institutional_coverage_ratio?: number | null;
  foreign_institutional_coverage_ratio?: number | null;
  total_coverage_ratio?: number | null;
}

export interface IPOQualitative {
  free_float_pct?: number | null;
  dividend_policy?: string | null;
  sharia_compliant?: boolean | null;
  _source?: string | null;
}

export interface IPOListing {
  id: string;
  companyName: string;
  ticker: string;
  sector: string;
  method: IPODistributionMethod;
  methodLabel: string;
  bookBuildingStartDate: string; // YYYY-MM-DD
  bookBuildingEndDate: string; // YYYY-MM-DD
  offerPrice: number;
  offerPriceMin?: number;
  offerPriceMax?: number;
  marketListingDate: string | null; // YYYY-MM-DD
  status: IPOStatus;
  prospectusUrl: string; // Resmi KAP İzahname linki
  prospectusTitle: string;
  demandMultiplier: number | null; // Karşılama oranı (örn: 84.5 kat)
  demandMultiplierText: string | null;
  allocationIndividualRatio: number | null; // Bireysel tahsisat %
  allocationInstitutionalRatio: number | null; // Kurumsal tahsisat %
  totalLot: number | null; // Dağıtılan toplam lot
  capitalIncreaseRatioPct?: number | null; // Sermaye artırımı oranı (%)
  shareholderSaleRatioPct?: number | null; // Ortak satışı oranı (%)
  t1t2BalanceUsable?: boolean | null; // T1-T2 bakiye kullanılabilir mi
  estimatedLotPerPerson?: number | null; // Kişi başı düşen tahmini/kesinleşen lot
  allocationForeignInstitutionalPct?: number | null; // İlk tahsisatta yurt dışı kurumsal payı (%)
  totalApplicantCount?: number | null; // Başvuran toplam yatırımcı sayısı
  marketCapTRY: number | null; // Toplam Halka Arz Büyüklüğü (₺)
  leadBroker: string | null; // Konsorsiyum Lideri
  useOfProceeds: IPOProceedsUse[]; // Fonun kullanım alanları
  performance: IPOPerformance;
  source: IPOSource;
  notes?: string;
  createdAt: string;
  updatedAt: string;

  // Yeni Halka Arz Derin Analiz Alanları (Additive & Nullable)
  financial_health?: IPOFinancialHealth | null;
  structural_risk?: IPOStructuralRisk | null;
  relative_performance?: IPORelativePerformance | null;
  demand_breakdown?: IPODemandBreakdown | null;
  qualitative?: IPOQualitative | null;
}

export interface AuditLogEntry {
  id?: string;
  adminUid?: string;
  adminEmail?: string;
  user_id?: string;
  action: string;
  targetId?: string;
  details?: string;
  oldValue?: any;
  newValue?: any;
  timestamp: string;
  ipAddress?: string;
}

export interface ErrorLogEntry {
  id?: string;
  message: string;
  stack?: string;
  context?: string;
  path?: string;
  method?: string;
  userEmail?: string;
  timestamp: string;
}

export interface IPOSectorSummary {
  sector: string;
  ipoCount: number;
  avgDay1Return: number;
  avgMonth1Return: number;
  totalRaisedTRY: number;
}






