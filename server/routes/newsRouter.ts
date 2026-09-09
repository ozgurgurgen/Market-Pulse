import { Router, Request, Response } from 'express';
import { localFinanceApi } from '../dataAdapters/adapters/LocalFinanceApiAdapter';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    if (localFinanceApi.isConfigured()) {
      const disclosures = await localFinanceApi.getKapDisclosures(50);
      if (Array.isArray(disclosures) && disclosures.length > 0) {
        // Transform KAP disclosures to MarketNewsItem format
        const newsList = disclosures.map((d: any, i: number) => {
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
        
        return res.json({ success: true, news: newsList });
      }
    }
    
    // Offline / No data fallback (empty array, NO fake data)
    return res.json({ success: true, news: [] });
  } catch (error: any) {
    console.error('[newsRouter] Error fetching news:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch news', news: [] });
  }
});

export default router;
