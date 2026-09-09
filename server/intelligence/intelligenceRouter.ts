import express, { Request, Response } from 'express';
import { orchestratorAgent } from './orchestratorAgent';
import { NewsAgent } from './newsAgent';
import { SentimentAgent } from './sentimentAgent';
import { TechnicalAgent } from './technicalAgent';
import { telegramService } from './telegramService';
import { cacheService } from '../services/cacheService';
import { rateLimiter } from '../services/rateLimiter';
import { healthMonitor } from '../services/healthMonitor';
import { API_ACCESS_LIST, getAccessibleSources, getInaccessibleSources } from '../config/apiAccess';
import { SOURCE_WEIGHTS } from '../config/constants';

export const intelligenceRouter = express.Router();

const newsAgent = new NewsAgent();
const sentimentAgent = new SentimentAgent();
const technicalAgent = new TechnicalAgent();

/**
 * GET /api/intelligence/search?ticker=...&refresh=...
 * Önbellekten okur; veri yoksa veya zorunlu yenileme istenirse RateLimiter kontrolüyle üretir.
 */
intelligenceRouter.get('/search', async (req: Request, res: Response) => {
  try {
    const ticker = ((req.query.ticker as string) || 'THYAO').trim().toUpperCase();
    const forceRefresh = req.query.refresh === 'true';

    const cacheKey = `intelligence:${ticker}`;
    const cached = await cacheService.get(cacheKey);

    if (!forceRefresh && cached) {
      return res.json({
        ...cached,
        fromCache: true,
      });
    }

    // Rate limit kontrolü
    const canMake = await rateLimiter.canMakeRequest('yahoo_finance');
    if (!canMake && cached) {
      return res.json({
        ...cached,
        fromCache: true,
        rateLimited: true,
        warning: 'Yahoo Finance rate limiti nedeniyle önbellekteki son veri sunuldu.',
      });
    }

    const report = await orchestratorAgent.generateFinalReport(ticker);

    // 5 dakika (300 sn) TTL ile önbelleğe yaz
    await cacheService.set(cacheKey, report, 300);
    await cacheService.set(`intel_${ticker}`, report, 300);

    return res.json({
      ...report,
      fromCache: false,
    });
  } catch (error: any) {
    console.error('Intelligence search error:', error);
    return res.status(500).json({
      error: 'İstihbarat analizi oluşturulurken hata meydana geldi.',
      message: error?.message || 'Bilinmeyen hata',
    });
  }
});

/**
 * GET /api/intelligence/all-cached
 * WebSocket / Canlı Polling için: ASLA doğrudan API'ye gitmez, sadece bellek içi cache'ten döner.
 */
intelligenceRouter.get('/all-cached', async (_req: Request, res: Response) => {
  try {
    const data = await cacheService.getAllIntelligenceData();
    return res.json({
      success: true,
      data,
      count: Object.keys(data).length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/intelligence/health
 * Tüm veri kaynaklarının sağlık durumu, hata sayıları ve genel durum özeti
 */
intelligenceRouter.get('/health', (_req: Request, res: Response) => {
  try {
    const summary = healthMonitor.getSystemSummary();
    return res.json(summary);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/intelligence/rate-limits
 * Kaynak bazında anlık saatlik kotalar, harcanan istekler ve backoff sayaçları
 */
intelligenceRouter.get('/rate-limits', (_req: Request, res: Response) => {
  try {
    const limits = rateLimiter.getAllLimits();
    const cacheStats = cacheService.getStats();
    return res.json({
      limits,
      cacheStats,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/intelligence/sources
 * API erişim matrisi, açık/erişilebilir durumlar ve fallback rotaları
 */
intelligenceRouter.get('/sources', (_req: Request, res: Response) => {
  try {
    return res.json({
      allSources: API_ACCESS_LIST,
      accessibleSources: getAccessibleSources(),
      inaccessibleSources: getInaccessibleSources(),
      calibratedWeights: SOURCE_WEIGHTS,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/intelligence/news/:ticker
 */
intelligenceRouter.get('/news/:ticker', async (req: Request, res: Response) => {
  try {
    const ticker = req.params.ticker.toUpperCase().trim();
    const limit = Number(req.query.limit) || 20;
    const news = await newsAgent.fetchNews(ticker, limit);
    return res.json({ ticker, news, count: news.length });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/intelligence/sentiment/:ticker
 */
intelligenceRouter.get('/sentiment/:ticker', async (req: Request, res: Response) => {
  try {
    const ticker = req.params.ticker.toUpperCase().trim();
    const limit = Number(req.query.limit) || 10;
    const topComments = await sentimentAgent.getTopComments(ticker, limit);
    const distribution = sentimentAgent.analyzeSentimentDistribution(topComments);
    return res.json({ ticker, top_comments: topComments, distribution });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/intelligence/technical/:ticker
 * SignalEngine v2 ile tam entegre teknik analiz verisi
 */
intelligenceRouter.get('/technical/:ticker', async (req: Request, res: Response) => {
  try {
    const ticker = req.params.ticker.toUpperCase().trim();
    const technical = await technicalAgent.analyze(ticker);
    return res.json(technical);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/intelligence/telegram/test
 */
intelligenceRouter.post('/telegram/test', async (_req: Request, res: Response) => {
  try {
    const result = await telegramService.sendTestMessage();
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/intelligence/telegram/status
 */
intelligenceRouter.get('/telegram/status', (_req: Request, res: Response) => {
  return res.json({
    configured: telegramService.isConfigured(),
    threshold: 7.0,
    history: telegramService.getNotificationHistory(),
  });
});
