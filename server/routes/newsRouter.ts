import { Router, Request, Response } from 'express';
import { localFinanceApi } from '../dataAdapters/adapters/LocalFinanceApiAdapter';
import { serverLocalDatabase } from '../services/serverLocalDatabase';
import { INITIAL_MARKET_NEWS } from '../../src/data/newsData';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, search, limit } = req.query;

    let newsList: any[] = [];

    // 1. Try local finance API KAP disclosures if configured
    if (localFinanceApi.isConfigured()) {
      try {
        const disclosures = await localFinanceApi.getKapDisclosures(50);
        if (Array.isArray(disclosures) && disclosures.length > 0) {
          newsList = disclosures.map((d: any, i: number) => {
            let impact: 'bullish' | 'bearish' | 'neutral' = 'neutral';
            let score = 50;
            const contentStr = (d.title + " " + d.description).toLowerCase();
            
            if (contentStr.includes('temettü') || contentStr.includes('kâr') || contentStr.includes('ihale') || contentStr.includes('büyüme')) {
              impact = 'bullish';
              score = 80;
            } else if (contentStr.includes('zarar') || contentStr.includes('ceza') || contentStr.includes('dava') || contentStr.includes('istifa')) {
              impact = 'bearish';
              score = 20;
            }

            return {
              id: d.id || `kap-${Date.now()}-${i}`,
              title: d.title || 'KAP Bildirimi',
              summary: d.description || 'Şirket tarafından Kamuyu Aydınlatma Platformuna bildirim yapıldı.',
              content: d.content || d.description || '',
              category: 'KAP',
              impact,
              impactScore: score,
              relatedSymbols: d.ticker ? [d.ticker] : [],
              source: 'KAP',
              time: d.date ? new Date(d.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : 'Bugün',
              timestamp: d.date ? new Date(d.date).getTime() : Date.now(),
              isBreaking: i < 3,
              url: d.link || null
            };
          });
        }
      } catch (err) {
        console.warn('[newsRouter] Local API notice:', err);
      }
    }

    // 2. If empty, pull from server database or initial verified market news
    if (newsList.length === 0) {
      const dbNews = serverLocalDatabase.getAll('market_news');
      if (dbNews && dbNews.length > 0) {
        newsList = dbNews;
      } else {
        newsList = [...INITIAL_MARKET_NEWS];
      }
    }

    // 3. Apply category and search filters
    if (category && category !== 'ALL') {
      newsList = newsList.filter(item => item.category === category);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      newsList = newsList.filter(item => 
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.summary && item.summary.toLowerCase().includes(q)) ||
        (item.relatedSymbols && item.relatedSymbols.some((s: string) => s.toLowerCase().includes(q))) ||
        (item.source && item.source.toLowerCase().includes(q))
      );
    }

    const maxItems = limit ? parseInt(limit as string, 10) : newsList.length;
    return res.json({ 
      success: true, 
      news: newsList.slice(0, maxItems),
      total: newsList.length 
    });
  } catch (error: any) {
    console.error('[newsRouter] Error fetching news:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch news', news: INITIAL_MARKET_NEWS });
  }
});

export default router;
