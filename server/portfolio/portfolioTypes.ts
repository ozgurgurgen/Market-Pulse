export type AssetClass = 'BIST' | 'US_STOCK' | 'US_ETF' | 'CRYPTO' | 'FUND' | 'COMMODITY' | 'FOREX';

export interface Holding {
  id?: string;
  ticker: string;            // Örn: THYAO, AAPL, SPY, BTC, MAC, ALTIN
  name?: string;
  assetClass: AssetClass;
  quantity: number;          // Adet
  avgBuyPrice: number;       // Ortalama alış fiyatı
  purchaseDate: string;      // Alış tarihi (YYYY-MM-DD)
  currency?: string;         // 'TRY' | 'USD' | '₺' | '$'
  notes?: string;
}

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  createdAt: string;         // Oluşturma tarihi — takip bu tarihten başlar
  baseCurrency: 'TRY' | 'USD';
  initialCapital: number;    // Başlangıç sermayesi
  holdings: Holding[];
  isActive: boolean;
  notes?: string;
  riskTolerance?: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
  targetReturn?: number;
  benchmark?: string;        // Örn: 'XU100', 'SPY', 'USDTRY'
}

export type TransactionType = 'deposit' | 'withdrawal' | 'buy' | 'sell';

export interface PortfolioTransaction {
  id: string;
  portfolioId: string;
  type: TransactionType;
  symbol?: string;
  quantity?: number;
  price?: number;
  amount: number; // Cash flow amount in base currency
  date: string;   // YYYY-MM-DD
  timestamp: string;
  notes?: string;
}

export interface BenchmarkSeriesItem {
  date: string;
  value: number; // % return
  rawPrice?: number;
}

export interface BenchmarkResult {
  label: string;
  symbol: string;
  code: string;
  data: BenchmarkSeriesItem[];
}

export interface PortfolioTWRPoint {
  date: string;
  value: number; // TWR % return
  totalValue: number;
  cashFlow: number;
  cumulativePnl: number;
  dailyPnl: number;
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

export interface HoldingSnapshot {
  ticker: string;
  name?: string;
  assetClass: AssetClass;
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

export interface PortfolioSnapshot {
  date: string;              // YYYY-MM-DD
  totalValue: number;        // Toplam piyasa değeri
  totalCost: number;         // Toplam maliyet
  pnl: number;               // Kümülatif Kâr/Zarar (TL veya USD)
  pnlPercentage: number;     // Yüzde kâr/zarar (%)
  dailyPnl: number;          // Günlük Kâr/Zarar
  dailyPnlPercentage: number;// Günlük Yüzde Değişim (%)
  cashFlow?: number;         // Günlük net nakit akışı
  twr?: number;              // Kümülatif TWR (%)
  holdings: HoldingSnapshot[];
}

export interface Recommendation {
  ticker: string;
  name?: string;
  action: 'BUY' | 'SELL' | 'HOLD' | 'ADD' | 'REDUCE';
  confidence: number;          // 0-100
  reason: string;              // İnsan tarafından okunabilir gerekçe
  currentScore: number;        // signalEngine composite score (0-100)
  suggestedWeight: number;     // Önerilen portföy ağırlığı (%)
  currentWeight: number;       // Mevcut portföy ağırlığı (%)
  marketRegime: 'BULL' | 'BEAR' | 'SIDEWAYS';
  disclaimer: string;
}

export interface BacktestRequest {
  tickers: string[];           // Test edilecek varlıklar
  weights: number[];           // Ağırlıklar (toplam 1.0 veya 100)
  startDate: string;           // YYYY-MM-DD
  endDate: string;             // YYYY-MM-DD
  initialCapital?: number;
  rebalanceFrequency: 'daily' | 'weekly' | 'monthly' | 'none';
  baseCurrency?: 'TRY' | 'USD';
}

export interface EquityPoint {
  date: string;
  value: number;
  benchmarkValue?: number;
  pnlPct: number;
  drawdownPct: number;
  dailyReturnPct?: number;
}

export interface AssetBacktestPerformance {
  ticker: string;
  name?: string;
  weight: number;
  totalReturn: number;
  annualizedReturn: number;
  volatility: number;
  contribution: number;
}

export interface MonthlyReturnItem {
  year: number;
  month: number;
  monthName: string;
  returnPct: number;
}

export interface BacktestResult {
  totalReturn: number;         // Toplam getiri %
  annualizedReturn: number;    // Yıllıklandırılmış getiri %
  maxDrawdown: number;         // Maksimum düşüş %
  sharpeRatio: number;
  sortinoRatio: number;
  volatility: number;          // Yıllık volatilite %
  bestMonth: number;           // En iyi ay getirisi %
  worstMonth: number;          // En kötü ay getirisi %
  winRateMonths?: number;      // Pozitif ay oranı %
  calmarRatio?: number;        // Yıllık Getiri / Max Drawdown
  equityCurve: EquityPoint[];  // Günlük portföy değeri serisi
  monthlyReturns?: MonthlyReturnItem[];
  assetPerformances?: AssetBacktestPerformance[];
  disclaimer: string;
}

export interface RiskWarning {
  metric: string;
  value: number;
  formattedValue: string;
  threshold: string;
  severity: 'warning' | 'danger' | 'info' | 'success';
  message: string;
  suggestion: string;
}

export interface RiskMetrics {
  volatility: number;          // % Yıllık volatilite
  sharpeRatio: number;         // Sharpe Oranı
  sortinoRatio: number;        // Sortino Oranı
  maxDrawdown: number;         // % Maksimum Düşüş (Peak-to-Trough)
  beta: number;                // Piyasa Betası (SPY / XU100 karşısında)
  valueAtRisk95: number;       // % Günlük %95 VaR (1 günde kaybedilebilecek maks risk)
  diversificationScore: number;// 0-100 Portföy Çeşitlendirme Skoru
  herfindahlIndex: number;     // HHI Konsantrasyon İndeksi
  assetClassAllocation: { class: AssetClass; label: string; value: number; percentage: number }[];
  topHoldingsConcentration: number; // En büyük 3 varlığın ağırlığı %
  warnings: RiskWarning[];
  recommendations: string[];
}

export interface PortfolioAlert {
  id: string;
  portfolioId: string;
  type: 'LARGE_DROP' | 'LARGE_GAIN' | 'MAX_DRAWDOWN' | 'AI_RECOMMENDATION' | 'REBALANCE_NEEDED';
  severity: 'info' | 'success' | 'warning' | 'danger';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  metadata?: any;
}
