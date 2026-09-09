import { Router } from 'express';
import { macroDataAggregator } from '../indicator_fetchers/MacroDataAggregatorService';
import { macroCommentaryService } from '../macroCommentaryService';
import { getImpactsForAsset, INITIAL_ASSET_IMPACT_RULES } from '../indicator_fetchers/impactSeedData';
import { serverLocalDatabase } from '../services/serverLocalDatabase';
import { AIMacroCommentaryRecord } from '../indicator_fetchers/types';

export const macroRouter = Router();

// 1. Tüm Ekonomik Göstergeleri Getir (Opsiyonel region/category filtreleme)
macroRouter.get('/indicators', async (req, res) => {
  try {
    const { region, category, refresh } = req.query;
    
    if (refresh === 'true') {
      await macroDataAggregator.refreshAllIndicators(true);
    }
    
    let indicators = await macroDataAggregator.getAllIndicators();

    if (region && typeof region === 'string') {
      indicators = indicators.filter(i => i.region.toUpperCase() === region.toUpperCase());
    }

    if (category && typeof category === 'string') {
      indicators = indicators.filter(i => i.category.toLowerCase() === category.toLowerCase());
    }

    const trIndicators = indicators.filter(i => i.region === 'TR');
    const globalIndicators = indicators.filter(i => i.region === 'GLOBAL' || i.region === 'US' || i.region === 'EU');

    res.json({
      success: true,
      totalCount: indicators.length,
      staleCount: indicators.filter(i => i.is_stale).length,
      indicators,
      grouped: {
        tr: trIndicators,
        global: globalIndicators
      },
      lastUpdated: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. YZ Destekli Makro Yorum ve Sektör Görünümü Getir
macroRouter.get('/commentary', async (req, res) => {
  try {
    const result = await macroCommentaryService.getLatestCommentary();
    res.json({
      success: true,
      data: result.commentary,
      generatedAt: result.generatedAt,
      isGenerating: result.isGenerating
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. YZ Makro Yorumunu Yeniden Üret (Tetikle)
macroRouter.post('/commentary/refresh', async (req, res) => {
  try {
    const { modelConfig } = req.body || {};
    const commentary = await macroCommentaryService.generateMacroCommentary(true, modelConfig);
    res.json({
      success: true,
      data: commentary,
      generatedAt: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Belirli bir Varlığı Etkileyen Göstergeler (Varlık Detay Sayfası için)
macroRouter.get('/asset-impact/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol;
    const impacts = getImpactsForAsset(symbol);
    
    // Her bir etki kuralı için mevcut gösterge değerini ilişkilendir
    const allIndicators = await macroDataAggregator.getAllIndicators();
    const enrichedImpacts = impacts.map(imp => {
      const matchedInd = allIndicators.find(ind => ind.indicator_code === imp.indicator_code);
      return {
        ...imp,
        current_value: matchedInd?.value,
        previous_value: matchedInd?.previous_value,
        unit: matchedInd?.unit,
        change_direction: matchedInd?.change_direction,
        is_stale: matchedInd?.is_stale || false
      };
    });

    res.json({
      success: true,
      symbol: symbol.toUpperCase(),
      impacts: enrichedImpacts
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Tüm Varlık-Gösterge Etki Matrisi
macroRouter.get('/asset-impacts', (req, res) => {
  res.json({
    success: true,
    totalRules: INITIAL_ASSET_IMPACT_RULES.length,
    impacts: INITIAL_ASSET_IMPACT_RULES
  });
});

// 6. Denetim İzi (Audit Trail) Kayıtları
macroRouter.get('/audit-logs', (req, res) => {
  try {
    const logs = serverLocalDatabase.getAll<AIMacroCommentaryRecord>('ai_macro_commentary');
    res.json({
      success: true,
      totalCount: logs.length,
      logs: logs.slice(0, 50),
      storage: 'server_local_database'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Çoklu Gösterge Zaman Serisi (Grafik Sekmesi için)
macroRouter.get('/timeseries', async (req, res) => {
  try {
    const { indicator_codes, codes, range = '1y' } = req.query;

    let targetCodes: string[] = [];

    if (Array.isArray(indicator_codes)) {
      targetCodes = indicator_codes.map(c => String(c).trim());
    } else if (typeof indicator_codes === 'string') {
      targetCodes = indicator_codes.split(',').map(c => c.trim()).filter(Boolean);
    } else if (typeof codes === 'string') {
      targetCodes = codes.split(',').map(c => c.trim()).filter(Boolean);
    }

    if (targetCodes.length === 0) {
      targetCodes = ['TR_POLICY_RATE', 'US_FED_RATE', 'EU_ECB_RATE'];
    }

    const validRange = (['3m', '6m', '1y', '5y', 'max'].includes(String(range)) 
      ? String(range) 
      : '1y') as any;

    const { timeSeriesService } = await import('../indicator_fetchers/timeSeriesService');
    const result = await timeSeriesService.getTimeSeries(targetCodes, validRange);

    res.json({
      success: true,
      ...result
    });
  } catch (err: any) {
    console.error('[TimeSeries Route Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// EKONOMİK TAKVİM
// ==========================================
import { getEconomicCalendar } from '../services/economicCalendarService';

macroRouter.get('/calendar', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const events = await getEconomicCalendar(startDate as string, endDate as string);
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Takvim verisi alınamadı' });
  }
});
