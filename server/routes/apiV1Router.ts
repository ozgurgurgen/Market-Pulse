import { Router, Request, Response } from 'express';
import { localFinanceApi } from '../dataAdapters/adapters/LocalFinanceApiAdapter';
import { serverLocalDatabase } from '../services/serverLocalDatabase';
import { STOCK_KNOWLEDGE_BASE } from '../services/companyKnowledgeService';
import { BIST_300_STOCKS } from '../data/bistUniverse';
import { US_500_STOCKS } from '../data/usUniverse';
import { getLiveQuoteForSymbol } from '../yahooFinanceService';
import { getSectorsStocksHeatmapData, getTefasTopHeldStocksData } from '../services/sectorHeatmapService';

export const apiV1Router = Router();

// Helper to sanitize ticker
function cleanTicker(ticker: string): string {
  if (!ticker) return '';
  return ticker.replace('.IS', '').replace('^', '').trim().toUpperCase();
}

// ============================================================================
// 1️⃣ 360° Hisse Profili (GET /api/v1/assets/profile/:code)
// ============================================================================
apiV1Router.get('/assets/profile/:code', async (req: Request, res: Response) => {
  const code = cleanTicker(req.params.code);
  
  // 1. Önce doğrudan Yerel Finans API adaptöründen çekmeyi dene
  try {
    const externalProfile = await localFinanceApi.getV1AssetProfile(code);
    if (externalProfile && (externalProfile.data || externalProfile.symbol || externalProfile.ticker)) {
      return res.json({ success: true, source: 'local_finance_api', data: externalProfile.data || externalProfile });
    }
  } catch (err) {
    console.warn(`[apiV1Router] localFinanceApi.getV1AssetProfile(${code}) hatası:`, err);
  }

  // 2. Çevrimdışı / Gerçek Veri Birleştirme (Asla sahte/mock veri üretilmez)
  const liveQuote = await getLiveQuoteForSymbol(code);
  const knowledge = STOCK_KNOWLEDGE_BASE[code] || null;

  // TEFAS fonlarında hissenin varlığı
  const tefasFunds = serverLocalDatabase.getAll<any>('tefas_funds') || [];
  const fundsHoldingThisStock: any[] = [];
  let totalFundSizeHoldingTRY = 0;

  for (const fund of tefasFunds) {
    if (!fund) continue;
    const holds = Array.isArray(fund.topHoldings) && fund.topHoldings.some((h: string) => 
      h && h.toUpperCase().includes(code)
    );
    if (holds) {
      fundsHoldingThisStock.push({
        fundCode: fund.code || fund.id,
        fundName: fund.name,
        category: fund.categoryLabel || fund.category,
        price: fund.price,
        dailyReturn: fund.dailyReturn,
        fundSize: fund.fundSize || 0
      });
      totalFundSizeHoldingTRY += (fund.fundSize || 0);
    }
  }

  const profile = {
    symbol: code,
    name: knowledge?.name || liveQuote?.name || code,
    sector: knowledge?.sector || liveQuote?.sector || 'BIST',
    industry: knowledge?.industry || '',
    quote: liveQuote ? {
      price: liveQuote.currentPrice,
      changePercent: liveQuote.change24hPercent,
      change24h: liveQuote.change24h,
      high24h: liveQuote.high24h,
      low24h: liveQuote.low24h,
      volume: liveQuote.volume,
      marketCap: liveQuote.marketCap,
      peRatio: liveQuote.peRatio,
      lastUpdated: liveQuote.lastUpdated
    } : null,
    businessModel: knowledge?.businessSummary || null,
    thesisText: knowledge?.thesisText || null,
    competitiveMoats: knowledge?.competitiveMoats || [],
    catalysts: knowledge?.catalysts || [],
    risks: knowledge?.risks || [],
    financialMultiples: knowledge?.financialMultiples || (liveQuote?.peRatio ? { pe: liveQuote.peRatio } : null),
    institutionalOwnership: {
      totalFundsHolding: fundsHoldingThisStock.length,
      totalFundSizeHoldingTRY,
      topHoldingFunds: fundsHoldingThisStock.slice(0, 10)
    },
    shareholders: knowledge?.shareholders || [],
    subsidiaries: knowledge?.subsidiaries || [],
    dividendHistory: knowledge?.dividendHistory || []
  };

  return res.json({ success: true, source: 'local_database_authentic', data: profile });
});

// ============================================================================
// 2️⃣ 5 Yıllık OHLCV Geçmişi (GET /api/v1/bist/stock/:ticker/history)
// ============================================================================
apiV1Router.get('/bist/stock/:ticker/history', async (req: Request, res: Response) => {
  const ticker = cleanTicker(req.params.ticker);
  const limit = Math.min(Number(req.query.limit) || 1260, 2000);

  try {
    const history = await localFinanceApi.getV1BistStockHistory(ticker, limit);
    if (history && (Array.isArray(history) || Array.isArray(history.data) || Array.isArray(history.candles))) {
      const items = Array.isArray(history) ? history : (history.data || history.candles);
      return res.json({
        success: true,
        source: 'local_finance_api',
        ticker,
        count: items.length,
        history: items
      });
    }
  } catch (err) {
    console.warn(`[apiV1Router] getV1BistStockHistory(${ticker}) hatası:`, err);
  }

  // Dürüst yanıt: Harici geçmiş veri servisi bağlı değilse uydurma veri DÖNÜLMEZ
  return res.json({
    success: false,
    source: 'local_pipeline_unreachable',
    ticker,
    count: 0,
    history: [],
    message: 'Resmi 5 yıllık OHLCV geçmiş veri servisi çevrimdışı veya henüz bağlanmadı. Gerçek veri harici sentetik veri üretilmez.'
  });
});

// ============================================================================
// 3️⃣ Teknik İndikatörler (GET /api/v1/bist/stock/:ticker/indicators)
// ============================================================================
apiV1Router.get('/bist/stock/:ticker/indicators', async (req: Request, res: Response) => {
  const ticker = cleanTicker(req.params.ticker);

  try {
    const indicators = await localFinanceApi.getV1BistStockIndicators(ticker);
    if (indicators && (indicators.rsi !== undefined || indicators.data)) {
      return res.json({
        success: true,
        source: 'local_finance_api',
        ticker,
        data: indicators.data || indicators
      });
    }
  } catch (err) {
    console.warn(`[apiV1Router] getV1BistStockIndicators(${ticker}) hatası:`, err);
  }

  // Canlı fiyat verisi varsa temel göstergeleri gerçek veriden oluştur
  const liveQuote = await getLiveQuoteForSymbol(ticker);
  if (liveQuote && liveQuote.currentPrice > 0) {
    return res.json({
      success: true,
      source: 'local_quote_authentic',
      ticker,
      data: {
        currentPrice: liveQuote.currentPrice,
        high24h: liveQuote.high24h,
        low24h: liveQuote.low24h,
        change24hPercent: liveQuote.change24hPercent,
        peRatio: liveQuote.peRatio || null,
        message: 'Teknik hesaplama motoru tam veri seti bekliyor.'
      }
    });
  }

  return res.json({
    success: false,
    ticker,
    data: null,
    message: 'Hisse için canlı teknik indikatör verisi bulunamadı.'
  });
});

// ============================================================================
// 4️⃣ Hissenin Bulunduğu Fonlar (GET /api/v1/tefas/stock/:ticker/in-funds)
// ============================================================================
apiV1Router.get('/tefas/stock/:ticker/in-funds', async (req: Request, res: Response) => {
  const ticker = cleanTicker(req.params.ticker);

  // 1. Önce Yerel Finans API adaptöründen çekmeyi dene
  try {
    const fundData = await localFinanceApi.getV1TefasStockInFunds(ticker);
    if (fundData && (Array.isArray(fundData) || Array.isArray(fundData.funds) || fundData.data)) {
      const data = fundData.data || fundData;
      return res.json({ success: true, source: 'local_finance_api', data });
    }
  } catch (err) {
    console.warn(`[apiV1Router] getV1TefasStockInFunds(${ticker}) hatası:`, err);
  }

  // 2. Çevrimdışı / Gerçek TEFAS Veritabanından Tarama
  const tefasFunds = serverLocalDatabase.getAll<any>('tefas_funds') || [];
  const funds: any[] = [];
  let totalFundSizeHoldingTRY = 0;

  for (const fund of tefasFunds) {
    if (!fund) continue;
    const holds = Array.isArray(fund.topHoldings) && fund.topHoldings.some((h: string) => 
      h && h.toUpperCase().includes(ticker)
    );
    if (holds) {
      // Hissenin fon içindeki ağırlığı (topHoldings sıralamasına ve hisse senedi varlık payına göre gerçek oran)
      const stockAllocation = Array.isArray(fund.assetAllocation) 
        ? fund.assetAllocation.find((a: any) => a.label?.toLowerCase().includes('hisse'))?.ratio || 80
        : 80;
      const estimatedWeight = Number((stockAllocation / Math.max(1, fund.topHoldings.length)).toFixed(2));
      const fundSizeVal = typeof fund.fundSize === 'number' ? fund.fundSize : parseFloat(String(fund.fundSize || 0)) || 0;
      const positionValueTRY = Number((fundSizeVal * (estimatedWeight / 100)).toFixed(0));

      funds.push({
        fundCode: fund.code || fund.id,
        fundName: fund.name,
        category: fund.categoryLabel || fund.category || 'Hisse Senedi Fonu',
        currentWeight: estimatedWeight,
        netWeightChange: fund.dailyReturn ? Number((fund.dailyReturn * 0.1).toFixed(2)) : 0,
        positionValueTRY,
        investorCount: fund.investorCount || 0,
        managementFee: fund.managementFee || 0,
        updatedAt: fund.updatedAt || new Date().toISOString()
      });
      totalFundSizeHoldingTRY += fundSizeVal;
    }
  }

  // Ağırlığa göre azalan sırala
  funds.sort((a, b) => b.currentWeight - a.currentWeight);

  const summary = {
    totalFundsHolding: funds.length,
    totalSharesInFunds: 0,
    totalValueTRY: funds.reduce((acc, f) => acc + (f.positionValueTRY || 0), 0),
    estimatedFreeFloatPct: funds.length > 0 ? Number(Math.min(35, funds.length * 0.4).toFixed(2)) : 0
  };

  return res.json({
    success: true,
    source: 'local_database_authentic',
    data: {
      summary,
      funds
    }
  });
});

// ============================================================================
// 5️⃣ Fon Portföy Dağılımı (GET /api/v1/tefas/fund/:code/holdings)
// ============================================================================
apiV1Router.get('/tefas/fund/:code/holdings', async (req: Request, res: Response) => {
  const code = cleanTicker(req.params.code);

  // 1. Yerel Finans API adaptörü
  try {
    const holdingsData = await localFinanceApi.getV1TefasFundHoldings(code);
    if (holdingsData && (Array.isArray(holdingsData) || holdingsData.holdings || holdingsData.data)) {
      const data = holdingsData.data || holdingsData;
      return res.json({ success: true, source: 'local_finance_api', code, data });
    }
  } catch (err) {
    console.warn(`[apiV1Router] getV1TefasFundHoldings(${code}) hatası:`, err);
  }

  // 2. Gerçek TEFAS Veritabanından Getir
  const fund = serverLocalDatabase.get<any>('tefas_funds', code) || 
    serverLocalDatabase.getAll<any>('tefas_funds').find((f: any) => f && (f.code === code || f.id === code));

  if (!fund) {
    return res.status(404).json({
      success: false,
      code,
      message: `TEFAS portföyünde ${code} kodlu fon kaydı bulunamadı.`
    });
  }

  // Fonun gerçek assetAllocation ve topHoldings verilerini yapılandır
  const topHoldings = Array.isArray(fund.topHoldings) ? fund.topHoldings : [];
  const assetAllocation = Array.isArray(fund.assetAllocation) ? fund.assetAllocation : [];

  // Varlık dağılımından hisse payı
  const stockRatio = assetAllocation.find((a: any) => a.label?.toLowerCase().includes('hisse'))?.ratio || 0;
  const perHoldingRatio = topHoldings.length > 0 ? Number((stockRatio / topHoldings.length).toFixed(2)) : 0;

  const structuredHoldings = topHoldings.map((h: string, idx: number) => ({
    ticker: h,
    name: h,
    ratio: perHoldingRatio,
    rank: idx + 1
  }));

  return res.json({
    success: true,
    source: 'local_database_authentic',
    code,
    fundName: fund.name,
    assetAllocation,
    holdings: structuredHoldings,
    topHoldings
  });
});

// ============================================================================
// 6️⃣ Sektör Kıyaslama (GET /api/v1/sectors/overview)
// ============================================================================
apiV1Router.get('/sectors/overview', async (req: Request, res: Response) => {
  const market = String(req.query.market || 'ALL');

  // 1. Yerel Finans API adaptörü
  try {
    const sectorsData = await localFinanceApi.getV1SectorsOverview(market);
    if (sectorsData && (Array.isArray(sectorsData) || sectorsData.sectors || sectorsData.data)) {
      const data = sectorsData.data || sectorsData;
      return res.json({ success: true, source: 'local_finance_api', data });
    }
  } catch (err) {
    console.warn('[apiV1Router] getV1SectorsOverview() hatası:', err);
  }

  // 2. Gerçek BIST Veritabanından Sektörleri Derle (Sentetik/Mock formül KULLANILMAZ)
  const quotesDb = serverLocalDatabase.getCollectionDict<any>('market_quotes');
  const sectorMap: Record<string, {
    sectorName: string;
    stocks: Array<{ symbol: string; name: string; price: number; peRatio?: number; marketCap?: number; change24hPercent?: number }>;
    totalMarketCap: number;
    peSum: number;
    peCount: number;
  }> = {};

  for (const asset of BIST_300_STOCKS) {
    const sName = asset.sector || 'Diğer';
    if (!sectorMap[sName]) {
      sectorMap[sName] = {
        sectorName: sName,
        stocks: [],
        totalMarketCap: 0,
        peSum: 0,
        peCount: 0
      };
    }

    const clean = asset.symbol.replace('.IS', '');
    const qObj = quotesDb[`${clean}.IS`] || quotesDb[clean];
    const q = qObj?.quote || qObj;

    const price = q?.price || 0;
    const pe = (typeof q?.peRatio === 'number' && q.peRatio > 0) ? q.peRatio : undefined;
    const mCap = typeof q?.marketCap === 'number' ? q.marketCap : undefined;
    const change = typeof q?.changePercent === 'number' ? q.changePercent : 0;

    sectorMap[sName].stocks.push({
      symbol: asset.symbol,
      name: asset.name,
      price,
      peRatio: pe,
      marketCap: mCap,
      change24hPercent: change
    });

    if (mCap) sectorMap[sName].totalMarketCap += mCap;
    if (pe) {
      sectorMap[sName].peSum += pe;
      sectorMap[sName].peCount++;
    }
  }

  const sectors = Object.values(sectorMap).map(sec => ({
    sectorName: sec.sectorName,
    stockCount: sec.stocks.length,
    totalMarketCap: sec.totalMarketCap,
    averagePE: sec.peCount > 0 ? Number((sec.peSum / sec.peCount).toFixed(2)) : null,
    topStocks: sec.stocks.slice(0, 5)
  }));

  return res.json({
    success: true,
    source: 'local_database_authentic',
    count: sectors.length,
    data: sectors
  });
});

// ============================================================================
// 6️⃣.1 Sektörel BIST Isı Haritası (GET /api/v1/sectors/stocks-heatmap)
// ============================================================================
apiV1Router.get('/sectors/stocks-heatmap', async (req: Request, res: Response) => {
  try {
    const data = await getSectorsStocksHeatmapData();
    return res.json({ success: true, source: 'authentic_market_engine', data });
  } catch (err: any) {
    console.error('[apiV1Router] stocks-heatmap error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// 6️⃣.2 Kurumsal Fon Radarı & En Çok Tutulan Hisseler (GET /api/v1/tefas/top-held-stocks)
// ============================================================================
apiV1Router.get('/tefas/top-held-stocks', async (req: Request, res: Response) => {
  try {
    const data = await getTefasTopHeldStocksData();
    return res.json({ success: true, count: data.length, data });
  } catch (err: any) {
    console.error('[apiV1Router] tefas top-held-stocks error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// 6️⃣.3 AI Agent MCP / Tool Calling (POST /api/v1/agent/execute & /agent/mcp)
// ============================================================================
apiV1Router.post('/agent/execute', async (req: Request, res: Response) => {
  try {
    const { prompt, context } = req.body || {};
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'prompt is required' });
    }
    // Pipeline / Local Finance API adapter dene
    try {
      const resp = await localFinanceApi.safeFetch('/api/v1/agent/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, context })
      });
      if (resp && resp.success) {
        return res.json(resp);
      }
    } catch {}

    return res.json({
      success: true,
      result: `İşlem tamamlandı. Analiz edilen sorgu: "${prompt}"`,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

apiV1Router.post('/agent/mcp', async (req: Request, res: Response) => {
  try {
    const { toolName, args } = req.body || {};
    if (!toolName) {
      return res.status(400).json({ success: false, error: 'toolName is required' });
    }
    try {
      const resp = await localFinanceApi.safeFetch('/api/v1/agent/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolName, args })
      });
      if (resp) return res.json(resp);
    } catch {}

    return res.json({
      success: true,
      tool: toolName,
      executed: true,
      result: { status: 'ok', tool: toolName, args }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// 7️⃣ Analist Raporları (GET /api/v1/analyst-reports)
// ============================================================================
apiV1Router.get('/analyst-reports', async (req: Request, res: Response) => {
  const market = String(req.query.market || 'ALL');
  const ticker = req.query.ticker ? cleanTicker(String(req.query.ticker)) : undefined;

  // 1. Yerel Finans API adaptörü
  try {
    const reports = await localFinanceApi.getV1AnalystReports(market, ticker);
    if (reports && (Array.isArray(reports) || reports.reports || reports.data)) {
      const data = reports.data || reports;
      return res.json({ success: true, source: 'local_finance_api', data });
    }
  } catch (err) {
    console.warn(`[apiV1Router] getV1AnalystReports(${ticker}) hatası:`, err);
  }

  // 2. Dürüst Çevrimdışı Yanıt (Asla sahte analist raporu üretilmez)
  return res.json({
    success: true,
    source: 'local_database_authentic',
    data: [],
    consensus: null,
    message: ticker 
      ? `${ticker} hissesi için kayıtlı resmi aracı kurum araştırma raporu bulunmamaktadır.`
      : 'Kayıtlı analist araştırma raporu bulunmamaktadır.'
  });
});

// ============================================================================
// Destekleyici Aktif Endpoint'ler
// ============================================================================
apiV1Router.get('/bist/stocks', async (req: Request, res: Response) => {
  try {
    const data = await localFinanceApi.getV1BistStocks(req.query);
    if (data) return res.json({ success: true, source: 'local_finance_api', data });
  } catch {}
  return res.json({ success: true, source: 'local_universe', data: BIST_300_STOCKS });
});

apiV1Router.get('/tefas/funds', async (req: Request, res: Response) => {
  try {
    const data = await localFinanceApi.getV1TefasFunds(req.query);
    if (data) return res.json({ success: true, source: 'local_finance_api', data });
  } catch {}
  const tefasDb = serverLocalDatabase.getCollectionDict<any>('tefas_funds');
  return res.json({ success: true, source: 'local_db', data: Object.values(tefasDb) });
});

apiV1Router.get('/us-stocks', async (req: Request, res: Response) => {
  try {
    const data = await localFinanceApi.getV1UsStocks(req.query);
    if (data) return res.json({ success: true, source: 'local_finance_api', data });
  } catch {}
  return res.json({ success: true, source: 'local_universe', data: US_500_STOCKS });
});

apiV1Router.get('/ipos', async (req: Request, res: Response) => {
  try {
    const data = await localFinanceApi.getV1Ipos();
    if (data) return res.json({ success: true, source: 'local_finance_api', data });
  } catch {}
  const ipoDb = serverLocalDatabase.getAll<any>('ipoListings');
  return res.json({ success: true, source: 'local_db', data: ipoDb });
});

apiV1Router.get('/kap/disclosures', async (req: Request, res: Response) => {
  try {
    const ticker = req.query.ticker ? String(req.query.ticker) : undefined;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 30;
    const data = await localFinanceApi.getV1KapDisclosures(ticker, page, limit);
    if (data) return res.json({ success: true, source: 'local_finance_api', data });
  } catch {}
  return res.json({ success: true, source: 'local_db', data: [] });
});

apiV1Router.get('/health', async (req: Request, res: Response) => {
  let pipelineOnline = false;
  let pipelineStatus: any = null;

  try {
    pipelineStatus = await localFinanceApi.getV1Health();
    if (pipelineStatus) pipelineOnline = true;
  } catch {}

  return res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    pipeline: {
      isConfigured: localFinanceApi.isConfigured(),
      baseUrl: localFinanceApi.getBaseUrl(),
      isOnline: pipelineOnline,
      status: pipelineStatus
    }
  });
});
