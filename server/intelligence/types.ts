import { StockQuote } from '../../src/types';

export interface NewsItem {
  id: string;
  headline: string;
  source: 'Bloomberg HT' | 'Foreks' | 'Yahoo Finance' | 'Trading Economics' | 'KAP';
  url: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentiment_score: number; // 0.0 - 1.0
  impact_score: number; // 1.0 - 10.0
  news_type: 'earnings' | 'merger_acquisition' | 'regulatory' | 'macro_economic' | 'general';
  published_at: string;
  summary: string;
}

export interface CommentItem {
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

export interface SentimentDistribution {
  positive: number;
  negative: number;
  neutral: number;
}

export interface IndicatorDetail {
  value?: number;
  signal: string;
  [key: string]: any;
}

export interface TechnicalAnalysisResult {
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
  technical_score: number; // 0-100
  interpretation: string;
  timestamp: string;
  rawSignalEngineResult?: any;
}

export interface CrossSignal {
  signal: 'DIVERGENCE' | 'ALIGNED' | 'STRONG' | 'TECHNICAL_ONLY' | 'NEWS_ONLY' | 'WEAK';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface KeyDevelopment {
  type: 'news' | 'technical' | 'sentiment' | 'macro';
  title: string;
  impact_score: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  notify: boolean;
  timestamp: string;
  details?: string;
}

export interface IntelligenceReport {
  ticker: string;
  assetName?: string;
  category?: string;
  price?: number;
  currency?: string;
  change24h?: number;
  timestamp: string;
  summary: string;
  key_developments: KeyDevelopment[];
  news: NewsItem[];
  top_comments: CommentItem[];
  sentiment_distribution: SentimentDistribution;
  technical: TechnicalAnalysisResult;
  analysis: {
    news_sentiment: { positive_ratio: number; negative_ratio: number; neutral_ratio: number };
    investor_sentiment: { positive_ratio: number; negative_ratio: number; neutral_ratio: number };
    technical_score: number;
    cross_signals: CrossSignal[];
  };
  telegram_status?: {
    configured: boolean;
    last_notified?: string;
    threshold: number;
  };
  disclaimer: string;
}
