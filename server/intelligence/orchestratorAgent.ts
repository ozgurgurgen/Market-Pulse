import { BaseAgent } from './baseAgent';
import { NewsAgent } from './newsAgent';
import { SentimentAgent } from './sentimentAgent';
import { TechnicalAgent } from './technicalAgent';
import { telegramService } from './telegramService';
import {
  IntelligenceReport,
  CrossSignal,
  KeyDevelopment,
  NewsItem,
  CommentItem,
  TechnicalAnalysisResult,
  SentimentDistribution,
} from './types';

export class OrchestratorAgent extends BaseAgent {
  private newsAgent = new NewsAgent();
  private sentimentAgent = new SentimentAgent();
  private technicalAgent = new TechnicalAgent();

  constructor() {
    super('OrchestratorAgent');
  }

  /**
   * 3 Uzman Agent'ı (News, Sentiment, Technical [signalEngine tabanlı]) paralel koordine ederek
   * tutarlı ve zengin Finansal İstihbarat Raporu üretir.
   */
  async generateFinalReport(ticker: string, livePrice?: number, assetName?: string): Promise<IntelligenceReport> {
    const cleanTicker = ticker.toUpperCase().trim();

    // 1. Paralel Veri Toplama
    const [news, topComments, technical] = await Promise.all([
      this.newsAgent.fetchNews(cleanTicker, 15),
      this.sentimentAgent.getTopComments(cleanTicker, 10),
      this.technicalAgent.analyze(cleanTicker, livePrice),
    ]);

    // 2. Duygu ve İstatistik Toplulaştırma
    const newsSentimentAgg = this.aggregateNewsSentiment(news);
    const investorSentimentDist = this.sentimentAgent.analyzeSentimentDistribution(topComments);

    // 3. Çapraz Analiz (Cross-Analysis)
    const crossSignals = this.performCrossAnalysis(
      newsSentimentAgg,
      investorSentimentDist,
      technical.technical_score,
      news
    );

    // 4. Önem Derecesine Göre Gelişmeleri Sınıflandırma (Key Developments)
    const keyDevelopments = this.classifyDevelopments(news, technical, investorSentimentDist, topComments);

    // 5. İnsan Tarafından Okunabilir Sentezlenmiş Özet
    const summary = this.generateSynthesizedSummary(
      cleanTicker,
      newsSentimentAgg,
      investorSentimentDist,
      technical,
      crossSignals
    );

    const report: IntelligenceReport = {
      ticker: cleanTicker,
      assetName: assetName || this.getAssetReadableName(cleanTicker),
      price: technical.price,
      timestamp: new Date().toISOString(),
      summary,
      key_developments: keyDevelopments,
      news,
      top_comments: topComments,
      sentiment_distribution: investorSentimentDist,
      technical,
      analysis: {
        news_sentiment: newsSentimentAgg,
        investor_sentiment: {
          positive_ratio: investorSentimentDist.positive,
          negative_ratio: investorSentimentDist.negative,
          neutral_ratio: investorSentimentDist.neutral,
        },
        technical_score: technical.technical_score, // SignalEngine v2 tabanlı
        cross_signals: crossSignals,
      },
      telegram_status: {
        configured: telegramService.isConfigured(),
        threshold: 7.0,
      },
      disclaimer: 'Bu istihbarat raporu algoritmik veri işleme ve SignalEngine v2 ile üretilmiştir. Yatırım tavsiyesi niteliği taşımaz.',
    };

    // 6. Kritik Gelişme Varsa Telegram Bildirimini Tetikle (Non-blocking)
    this.checkAndTriggerTelegramAlerts(report);

    return report;
  }

  private aggregateNewsSentiment(news: NewsItem[]) {
    if (!news || news.length === 0) {
      return { positive_ratio: 50, negative_ratio: 20, neutral_ratio: 30 };
    }

    let pos = 0;
    let neg = 0;
    let neu = 0;

    for (const item of news) {
      if (item.sentiment === 'positive') pos += item.impact_score;
      else if (item.sentiment === 'negative') neg += item.impact_score;
      else neu += item.impact_score;
    }

    const total = pos + neg + neu;
    if (total === 0) return { positive_ratio: 45, negative_ratio: 25, neutral_ratio: 30 };

    const posRatio = Math.round((pos / total) * 100);
    const negRatio = Math.round((neg / total) * 100);
    const neuRatio = Math.max(0, 100 - posRatio - negRatio);

    return {
      positive_ratio: posRatio,
      negative_ratio: negRatio,
      neutral_ratio: neuRatio,
    };
  }

  private performCrossAnalysis(
    newsSentiment: { positive_ratio: number; negative_ratio: number; neutral_ratio: number },
    investorSentiment: SentimentDistribution,
    technicalScore: number,
    news: NewsItem[]
  ): CrossSignal[] {
    const signals: CrossSignal[] = [];

    const isNewsBullish = newsSentiment.positive_ratio >= 55;
    const isNewsBearish = newsSentiment.negative_ratio >= 45;
    const isTechBullish = technicalScore >= 65;
    const isTechBearish = technicalScore <= 38;
    const isCommunityBullish = investorSentiment.positive >= 60;
    const isCommunityBearish = investorSentiment.negative >= 45;

    // 1. Pozitif Uyum (Kuvvetli Alım / Boğa Konsensüsü)
    if (isNewsBullish && isTechBullish && isCommunityBullish) {
      signals.push({
        signal: 'STRONG',
        title: 'Tam Uyumlu Boğa Konsensüsü (Triple Alignment)',
        description: 'Haber akışı, topluluk duygu durumu ve SignalEngine v2 kompozit skoru aynı anda güçlü alım yönünü teyit ediyor.',
        severity: 'high',
      });
    }

    // 2. Ayı Uyumsuzluğu (Kritik Uyarı)
    if (isNewsBearish && isTechBearish) {
      signals.push({
        signal: 'STRONG',
        title: 'Negatif Trend & Haber Baskısı',
        description: 'Haber akışındaki olumsuz gelişmeler SignalEngine v2 satış göstergeleriyle örtüşüyor.',
        severity: 'high',
      });
    }

    // 3. Teknik / Haber Uyumsuzluğu (DIVERGENCE)
    if (isNewsBullish && isTechBearish) {
      signals.push({
        signal: 'DIVERGENCE',
        title: 'Pozitif Haber / Zayıf Teknik Uyumsuzluğu',
        description: 'Şirket/varlık hakkında olumlu haberler akarken teknik göstergeler henüz toparlanamadı veya satış baskısı sürüyor.',
        severity: 'medium',
      });
    } else if (isNewsBearish && isTechBullish) {
      signals.push({
        signal: 'DIVERGENCE',
        title: 'Negatif Haber / Güçlü Teknik Ayrışması',
        description: 'Olumsuz haberlere rağmen fiyat ve momentum indikatörleri güçlü kalmaya devam ediyor (Güçlü Göreceli Performans).',
        severity: 'critical',
      });
    }

    // 4. Bireysel Yatırımcı vs Kurumsal Haber Ayrışması
    if (isCommunityBearish && isNewsBullish) {
      signals.push({
        signal: 'DIVERGENCE',
        title: 'Bireysel Yatırımcı Karamsarlığı & Kurumsal Altyapı',
        description: 'Sosyal medyada panik ve karamsarlık hakimken kurumsal haberler ve resmi KAP bildirimleri pozitif kalıyor (Ters İndikatör Potansiyeli).',
        severity: 'medium',
      });
    }

    // Genel fallback
    if (signals.length === 0) {
      signals.push({
        signal: 'ALIGNED',
        title: 'Dengeli & Nötr Piyasa Görünümü',
        description: 'Teknik ve temel istihbarat göstergeleri birbirini dengeliyor; olağandışı bir ayrışma saptanmadı.',
        severity: 'low',
      });
    }

    return signals;
  }

  private classifyDevelopments(
    news: NewsItem[],
    technical: TechnicalAnalysisResult,
    sentiment: SentimentDistribution,
    comments: CommentItem[]
  ): KeyDevelopment[] {
    const developments: KeyDevelopment[] = [];
    const now = new Date().toISOString();

    // 1. Haber Gelişmeleri
    news.slice(0, 2).forEach((n) => {
      let severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
      if (n.impact_score >= 9.0) severity = 'CRITICAL';
      else if (n.impact_score >= 7.0) severity = 'HIGH';
      else if (n.impact_score >= 5.0) severity = 'MEDIUM';

      // Jenerik fallback haberler asla bildirim tetiklemez
      const isFallback = (n as any).isFallback || n.impact_score <= 4.5;
      const shouldNotify = n.impact_score >= 7.0 && !isFallback;

      developments.push({
        type: 'news',
        title: n.headline,
        impact_score: n.impact_score,
        severity,
        notify: shouldNotify,
        timestamp: n.published_at || now,
        details: `${n.source} — ${n.summary}`,
      });
    });

    // 2. Teknik Gelişmeler (SignalEngine v2 verileri)
    const rawEngine = technical.rawSignalEngineResult;
    if (rawEngine?.divergence?.detected) {
      developments.push({
        type: 'technical',
        title: `SignalEngine v2: ${rawEngine.divergence.type} Uyumsuzluğu Tespit Edildi`,
        impact_score: 8.4,
        severity: 'HIGH',
        notify: true,
        timestamp: now,
        details: rawEngine.divergence.description,
      });
    } else if (technical.indicators.RSI.value >= 72 || technical.indicators.RSI.value <= 28) {
      developments.push({
        type: 'technical',
        title: `RSI Ekstrem Seviyede (${technical.indicators.RSI.value})`,
        impact_score: 7.2,
        severity: 'HIGH',
        notify: true,
        timestamp: now,
        details: technical.indicators.RSI.signal,
      });
    }

    // 3. Topluluk / Sosyal Gelişme
    const viralComment = comments.find((c) => c.engagement_score >= 80);
    if (viralComment) {
      developments.push({
        type: 'sentiment',
        title: `Yüksek Etkileşimli Topluluk Analizi (${viralComment.user})`,
        impact_score: 6.8,
        severity: 'MEDIUM',
        notify: false,
        timestamp: viralComment.timestamp,
        details: viralComment.text,
      });
    }

    return developments.sort((a, b) => b.impact_score - a.impact_score);
  }

  private generateSynthesizedSummary(
    ticker: string,
    newsSentiment: { positive_ratio: number; negative_ratio: number; neutral_ratio: number },
    investorSentiment: SentimentDistribution,
    technical: TechnicalAnalysisResult,
    crossSignals: CrossSignal[]
  ): string {
    const dominantSignal = crossSignals[0];
    const techScore = technical.technical_score;

    let sentimentOverview = 'piyasa genelinde dengeli bir hava hakim.';
    if (newsSentiment.positive_ratio >= 60) {
      sentimentOverview = 'haber akışı güçlü pozitif katalizörler barındırıyor.';
    } else if (newsSentiment.negative_ratio >= 50) {
      sentimentOverview = 'haber akışında temkinli ve satış baskısı yaratan unsurlar öne çıkıyor.';
    }

    let techOverview = 'orta momentum bandında ilerliyor.';
    if (techScore >= 70) {
      techOverview = 'SignalEngine v2 bileşik göstergelerinde güçlü boğa trendi sergiliyor.';
    } else if (techScore <= 35) {
      techOverview = 'SignalEngine v2 göstergelerinde zayıflama ve aşırı satım baskısı gözleniyor.';
    }

    return `${ticker} için yapılan çoklu ajan değerlendirmesinde ${sentimentOverview} Varlık teknik olarak ${techOverview} Bireysel yatırımcı duyarlılığı %${investorSentiment.positive} pozitif, %${investorSentiment.negative} negatif olarak ölçümlenmiştir. Çapraz analiz sonucu: "${dominantSignal.title}" (${dominantSignal.description}).`;
  }

  private async checkAndTriggerTelegramAlerts(report: IntelligenceReport): Promise<void> {
    try {
      const usersWithTelegram: Array<{ uid?: string; telegramChatId?: string; telegramNotificationsEnabled?: boolean; favorites?: string[] }> = [];

      try {
        const { adminDb } = await import('../services/firebaseAdminService');
        const fetchPromise = adminDb.collection('users').where('telegramChatId', '!=', null).get();
        const timeoutPromise = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Firebase DB timeout')), 300));
        const usersSnap = await Promise.race([fetchPromise, timeoutPromise]);
        for (const doc of usersSnap.docs) {
          const data = doc.data();
          if (data?.telegramChatId && !usersWithTelegram.some(u => u.telegramChatId === data.telegramChatId)) {
            usersWithTelegram.push({ uid: doc.id, ...data });
          }
        }
      } catch (err) {
        // Expected when server background agent fails
      }

      for (const data of usersWithTelegram) {
        if (data.telegramNotificationsEnabled === false) continue;
        const watchlist = data.favorites || [];
        if (watchlist.includes(report.ticker) && data.telegramChatId) {
          await telegramService.checkAndNotify(report, data.telegramChatId).catch(() => {});
        }
      }
    } catch {
      // Graceful fallback for background notifications
    }
  }

  private getAssetReadableName(ticker: string): string {
    const names: Record<string, string> = {
      THYAO: 'Türk Hava Yolları',
      ASELS: 'Aselsan Elektronik',
      EREGL: 'Ereğli Demir Çelik',
      TUPRS: 'Tüpraş Rafineri',
      KCHOL: 'Koç Holding',
      BIMAS: 'BİM Mağazaları',
      SISE: 'Şişecam',
      AKBNK: 'Akbank',
      GARAN: 'Garanti BBVA',
      FROTO: 'Ford Otomotiv',
      'BTC-USD': 'Bitcoin (Spot USD)',
      'ETH-USD': 'Ethereum (Spot USD)',
      'XAU-USD': 'Ons Altın (USD)',
    };
    return names[ticker] || ticker;
  }
}

export const orchestratorAgent = new OrchestratorAgent();
