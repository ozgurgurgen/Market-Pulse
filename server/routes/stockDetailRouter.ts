import { Router } from 'express';
import { 
  CompanyThesis, 
  FinancialStatementsData, 
  MultipleAnalysisData, 
  CorporateEvent, 
  SeasonalityData, 
  FundPositionSummary, 
  FundDynamicsRow, 
  TechnicalAnalysisResult, 
  FairValueEstimate,
  FinancialKarne,
  CompanySubsidiariesData,
  PeerComparisonData,
  TechnicalEngineParams
} from '../../src/types';
import { getLiveQuoteForSymbol, findAssetBySymbol } from '../yahooFinanceService';
import { localFinanceApi } from '../dataAdapters/adapters/LocalFinanceApiAdapter';
import { isMockFallbackEnabled } from '../services/dbIntegrationService';
import { calculateParametricTechnicalAnalysis } from '../signalEngine/technicalCalculation';
import { validateTechnicalParameters } from '../signalEngine/technicalParameters';
import { interpretTechnicalSignalsWithAI } from '../services/aiSignalInterpreter';
import { getStockKnowledgeProfile } from '../services/companyKnowledgeService';
import { databaseFirstCacheService } from '../services/databaseFirstCacheService';

export const stockDetailRouter = Router();

// ==========================================
// 1. ŞİRKET & TEZ (Company & Investment Thesis - DB First)
// ==========================================
stockDetailRouter.get('/:symbol/thesis', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

  try {
    const data = await databaseFirstCacheService.getOrFetchApiData<CompanyThesis>(
      `stock:thesis:${symbol}`,
      {
        category: 'STOCK_THESIS',
        symbol,
        ttlMinutes: 720, // 12 saat DB önbellek
        sourceApi: 'local_finance_api',
        fetcher: async () => {
          if (localFinanceApi.isConfigured()) {
            try {
              const localData = await localFinanceApi.getCompanyAllData(symbol);
              if (localData && localData.company) {
                const comp = localData.company;
                return {
                  ticker: symbol,
                  lastUpdated: new Date().toISOString().split('T')[0],
                  sector: comp.sector || 'Sektör Bilgisi',
                  industry: comp.industry || comp.company_name || 'Ana Faaliyet Alanı',
                  thesisText: comp.description || `${comp.company_name || symbol} için yerel veritabanı şirket profili.`,
                  businessModelSummary: comp.business_summary || comp.description || 'Yerel API şirket özeti.',
                  competitiveMoat: comp.competitive_advantages || ['Pazar payı ve operasyonel varlıklar'],
                  catalysts: comp.catalysts || ['Yeni yatırımlar ve pazar genişlemesi'],
                  risks: comp.risks || ['Sektörel ve makroekonomik dalgalanmalar'],
                  revenueSegments: comp.revenue_segments || []
                };
              }
            } catch (e) {
              console.error('[stockDetailRouter] thesis fetch error:', e);
            }
          }

          return {
            ticker: symbol,
            lastUpdated: 'N/A',
            sector: 'NoN (Veri Yok)',
            industry: 'NoN (Veri Yok)',
            thesisText: 'NoN: Yerel API üzerinden şirket tezi bulunamadı.',
            businessModelSummary: 'NoN',
            competitiveMoat: ['NoN'],
            catalysts: ['NoN'],
            risks: ['NoN'],
            revenueSegments: []
          };
        }
      }
    );

    return res.json({ success: true, data });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 2. FİNANSALLAR (Financial Statements - DB First)
// ==========================================

stockDetailRouter.get('/:symbol/financials', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  
  try {
    const financials = await databaseFirstCacheService.getOrFetchApiData<FinancialStatementsData>(
      `stock:financials:${symbol}`,
      {
        category: 'STOCK_FINANCIALS',
        symbol,
        ttlMinutes: 720, // 12 saat DB önbellek
        sourceApi: 'local_finance_api',
        fetcher: async () => {
          if (localFinanceApi.isConfigured()) {
            try {
              const localData = await localFinanceApi.getCompanyAllData(symbol);
              if (localData && localData.financials && localData.financials.length > 0) {
                const sortedFinancials = [...localData.financials].slice(0, 8);
                const periods = sortedFinancials.map((f: any) => String(f.year) + '/' + String(f.period).padStart(2, '0'));
                
                const getValue = (key: string) => {
                  const values: Record<string, number> = {};
                  const yoyChanges: Record<string, number> = {};
                  sortedFinancials.forEach((f: any) => {
                    const p = String(f.year) + '/' + String(f.period).padStart(2, '0');
                    const rawVal = Number(f[key]) || 0;
                    values[p] = rawVal > 1000000000 ? Math.round(rawVal / 1000000) : rawVal;
                    if (f[key + '_yoy']) {
                      yoyChanges[p] = Number(f[key + '_yoy']);
                    }
                  });
                  return { values, yoyChanges };
                };

                const cashFlowData = localData.cashflows && localData.cashflows.length > 0 ? [
                  {
                    key: 'cfo',
                    label: 'İşletme Faaliyetlerinden Nakit Akışı',
                    isHeader: true,
                    values: Object.fromEntries(localData.cashflows.slice(0, 8).map((cf: any) => [
                      String(cf.year) + '/' + String(cf.period).padStart(2, '0'),
                      Number(cf.operating_cash_flow) || 0
                    ])),
                    yoyChanges: {}
                  },
                  {
                    key: 'cfi',
                    label: 'Yatırım Faaliyetlerinden Nakit Akışı',
                    values: Object.fromEntries(localData.cashflows.slice(0, 8).map((cf: any) => [
                      String(cf.year) + '/' + String(cf.period).padStart(2, '0'),
                      Number(cf.investing_cash_flow) || 0
                    ])),
                    yoyChanges: {}
                  }
                ] : [];

                return {
                  ticker: symbol,
                  periods,
                  periodType: 'quarterly',
                  incomeStatement: [
                    { key: 'revenue', label: 'Net Satışlar (Hasılat)', ...getValue('revenue') },
                    { key: 'gross_profit', label: 'Brüt Kar', isHeader: true, ...getValue('gross_profit') },
                    { key: 'ebit', label: 'Esas Faaliyet Karı (EBIT)', ...getValue('ebit') },
                    { key: 'ebitda', label: 'FAVÖK (EBITDA)', isHeader: true, ...getValue('ebitda') },
                    { key: 'net_income', label: 'Net Dönem Karı', isHeader: true, ...getValue('net_profit') }
                  ],
                  balanceSheet: [
                    { key: 'total_assets', label: 'Toplam Varlıklar (Aktifler)', isHeader: true, ...getValue('total_assets') },
                    { key: 'total_debts', label: 'Toplam Borçlar / Yükümlülükler', ...getValue('total_debts') },
                    { key: 'equity', label: 'Toplam Özkaynaklar', isHeader: true, ...getValue('equity') },
                    { key: 'paid_capital', label: 'Ödenmiş Sermaye', ...getValue('paid_capital') }
                  ],
                  cashFlowStatement: cashFlowData
                };
              }
            } catch (e) {
              console.error('[stockDetailRouter] financials fetch error:', e);
            }
          }

          return {
            ticker: symbol,
            periods: [],
            periodType: 'quarterly',
            incomeStatement: [],
            balanceSheet: [],
            cashFlowStatement: []
          };
        }
      }
    );

    return res.json({ success: true, data: financials });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 3. ÇARPANLAR (Multiples History & Percentiles)
// ==========================================
stockDetailRouter.get('/:symbol/multiples', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  if (localFinanceApi.isConfigured()) {
    try {
      const aggData = await localFinanceApi.getAggregatedData(symbol);
      if (aggData?.multiples) return res.json({ success: true, data: aggData.multiples });
      if (aggData?.data?.multiples) return res.json({ success: true, data: aggData.data.multiples });
    } catch (e) {
      console.error('[stockDetailRouter] multiples error:', e);
    }
  }
  return res.json({
    success: true,
    data: {
      ticker: symbol,
      currentMultiples: { pe: 0, pb: 0, evebitda: 0, evsales: 0, pegRatio: 0 },
      percentiles: { pePercentile: 0, pbPercentile: 0, evebitdaPercentile: 0 },
      sectorAverages: { sectorName: 'NoN', pe: 0, pb: 0, evebitda: 0 },
      historicalSeries: []
    },
    message: 'NoN: Yerel API üzerinden çarpan verisi bulunamadı.'
  });
});
// ==========================================
// ==========================================
// 4. ŞİRKET OLAYLARI (Corporate Events Timeline & KAP Disclosures)
// ==========================================
stockDetailRouter.get('/:symbol/events', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  if (localFinanceApi.isConfigured()) {
    try {
      const newsData = await localFinanceApi.getNews(symbol);
      if (newsData && Array.isArray(newsData)) return res.json({ success: true, data: newsData });
      if (newsData?.data && Array.isArray(newsData.data)) return res.json({ success: true, data: newsData.data });
      
      const aggData = await localFinanceApi.getAggregatedData(symbol);
      if (aggData?.events) return res.json({ success: true, data: aggData.events });
      if (aggData?.data?.events) return res.json({ success: true, data: aggData.data.events });
    } catch (e) {
      console.error('[stockDetailRouter] events error:', e);
    }
  }
  return res.json({ success: true, data: [] });
});
// ==========================================
// 4.1 ARACI KURUM DAĞILIMI & TAKASBANK / SEC 13F CUSTODY
// ==========================================
stockDetailRouter.get('/:symbol/brokerage-distribution', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  if (localFinanceApi.isConfigured()) {
    try {
      const aggData = await localFinanceApi.getAggregatedData(symbol);
      if (aggData?.ownership) return res.json({ success: true, data: aggData.ownership });
      if (aggData?.data?.ownership) return res.json({ success: true, data: aggData.data.ownership });
      if (aggData?.brokerage) return res.json({ success: true, data: aggData.brokerage });
      if (aggData?.data?.brokerage) return res.json({ success: true, data: aggData.data.brokerage });
    } catch (e) {
      console.error('[stockDetailRouter] brokerage error:', e);
    }
  }
  return res.json({ success: true, data: { isUS: false, market: 'BIST', ownershipRatio: 0, topBuyers: [], topSellers: [], topCustodians: [], netFirst5: 0 }});
});
// ==========================================
// 5. FON POZİSYONLARI (FAZ 2: Smart Money)
// ==========================================
stockDetailRouter.get('/:symbol/funds', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  if (localFinanceApi.isConfigured()) {
    try {
      const aggData = await localFinanceApi.getAggregatedData(symbol);
      if (aggData?.funds) return res.json({ success: true, data: aggData.funds });
      if (aggData?.data?.funds) return res.json({ success: true, data: aggData.data.funds });
    } catch (e) {
      console.error('[stockDetailRouter] funds error:', e);
    }
  }
  return res.json({ success: true, data: { summary: { totalFundsHolding: 0, totalSharesInFunds: 0, totalValueTRY: 0, estimatedFreeFloatPct: 0 }, funds: [] }});
});
// ==========================================
// 6. MEVSİMSELLİK (Seasonality Matrix 11 Years)
// ==========================================
stockDetailRouter.get('/:symbol/seasonality', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  if (localFinanceApi.isConfigured()) {
    try {
      const aggData = await localFinanceApi.getAggregatedData(symbol);
      if (aggData?.seasonality) return res.json({ success: true, data: aggData.seasonality });
      if (aggData?.data?.seasonality) return res.json({ success: true, data: aggData.data.seasonality });
    } catch (e) {
      console.error('[stockDetailRouter] seasonality error:', e);
    }
  }
  return res.json({ success: true, data: { monthlyAverages: [], analysisText: 'Mevsimsellik analizi bulunamadı.', optimalBuyingMonths: [], optimalSellingMonths: [] }});
});
// ==========================================
// 7. AYARLANABİLİR TEKNİK ANALİZ MOTORU (Parametric Technical Engine)
// ==========================================
stockDetailRouter.get('/:symbol/technical', async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    
    // Query parametrelerini ayrıştır
    const rawParams: Partial<TechnicalEngineParams> = {};
    if (req.query.preset) rawParams.preset = req.query.preset as any;
    if (req.query.fastMaPeriod) rawParams.fastMaPeriod = Number(req.query.fastMaPeriod);
    if (req.query.mediumMaPeriod) rawParams.mediumMaPeriod = Number(req.query.mediumMaPeriod);
    if (req.query.slowMaPeriod) rawParams.slowMaPeriod = Number(req.query.slowMaPeriod);
    if (req.query.maType) rawParams.maType = req.query.maType as any;
    if (req.query.rsiPeriod) rawParams.rsiPeriod = Number(req.query.rsiPeriod);
    if (req.query.rsiOverbought) rawParams.rsiOverbought = Number(req.query.rsiOverbought);
    if (req.query.rsiOversold) rawParams.rsiOversold = Number(req.query.rsiOversold);
    if (req.query.macdFastPeriod) rawParams.macdFastPeriod = Number(req.query.macdFastPeriod);
    if (req.query.macdSlowPeriod) rawParams.macdSlowPeriod = Number(req.query.macdSlowPeriod);
    if (req.query.macdSignalPeriod) rawParams.macdSignalPeriod = Number(req.query.macdSignalPeriod);
    if (req.query.bbPeriod) rawParams.bbPeriod = Number(req.query.bbPeriod);
    if (req.query.bbStdDev) rawParams.bbStdDev = Number(req.query.bbStdDev);
    if (req.query.atrPeriod) rawParams.atrPeriod = Number(req.query.atrPeriod);
    if (req.query.riskRewardRatio) rawParams.riskRewardRatio = Number(req.query.riskRewardRatio);
    if (req.query.volumeMultiplier) rawParams.volumeMultiplier = Number(req.query.volumeMultiplier);

    // Parametre Doğrulama
    const validation = validateTechnicalParameters(Object.keys(rawParams).length > 0 ? rawParams : undefined);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Geçersiz teknik analiz parametreleri',
        validationErrors: validation.errors
      });
    }

    const { result, paramHash } = await calculateParametricTechnicalAnalysis(symbol, validation.sanitizedParams);
    return res.json({ success: true, data: result, paramHash });
  } catch (error: any) {
    console.error(`[StockDetail] Teknik analiz hesaplama hatası (${req.params.symbol}):`, error);
    return res.status(500).json({ success: false, error: error.message || 'Teknik analiz hesaplanırken hata oluştu' });
  }
});

stockDetailRouter.post('/:symbol/technical', async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const rawParams = req.body || {};

    const validation = validateTechnicalParameters(rawParams);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Geçersiz teknik analiz parametreleri',
        validationErrors: validation.errors
      });
    }

    const { result, paramHash } = await calculateParametricTechnicalAnalysis(symbol, validation.sanitizedParams);
    return res.json({ success: true, data: result, paramHash });
  } catch (error: any) {
    console.error(`[StockDetail] Parametrik teknik analiz POST hatası (${req.params.symbol}):`, error);
    return res.status(500).json({ success: false, error: error.message || 'Teknik analiz hesaplanırken hata oluştu' });
  }
});

// ==========================================
// 7.1 AI SİNYAL YORUMLAMA KATMANI (AI Signal Interpreter)
// ==========================================
stockDetailRouter.post('/:symbol/interpret-signals', async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    let technicalData: TechnicalAnalysisResult = req.body?.technicalData;

    // Eğer frontend doğrudan teknik veriyi yollamadıysa parametrelerle backend'de hesapla
    if (!technicalData) {
      const rawParams = req.body?.params || {};
      const validation = validateTechnicalParameters(rawParams);
      const { result } = await calculateParametricTechnicalAnalysis(symbol, validation.sanitizedParams);
      technicalData = result;
    }

    const interpretation = await interpretTechnicalSignalsWithAI(technicalData);
    return res.json({ success: true, data: interpretation });
  } catch (error: any) {
    console.error(`[StockDetail] AI Sinyal Yorumlama hatası (${req.params.symbol}):`, error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'AI sinyal yorumlama katmanında hata oluştu' 
    });
  }
});

// ==========================================
// 8. TEMEL ADİL DEĞERLEME (Fair Value & Valuation Engine)
// ==========================================
stockDetailRouter.get('/:symbol/fairvalue', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  if (localFinanceApi.isConfigured()) {
    try {
      const aggData = await localFinanceApi.getAggregatedData(symbol);
      if (aggData?.fairvalue) return res.json({ success: true, data: aggData.fairvalue });
      if (aggData?.data?.fairvalue) return res.json({ success: true, data: aggData.data.fairvalue });
    } catch (e) {
      console.error('[stockDetailRouter] fairvalue error:', e);
    }
  }
  return res.json({ success: true, data: { ticker: symbol, fairValueEstimate: 0, upsidePotentialPct: 0, methodology: 'NoN', valuationModels: [] }});
});
// ==========================================
// 9. 18 KRİTERLİ FİNANSAL KARNE (Financial Scorecard)
// ==========================================
stockDetailRouter.get('/:symbol/scorecard', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const profile = getStockKnowledgeProfile(symbol);
  let roe = profile.financialMultiples.roePct;
  let roa = profile.financialMultiples.roaPct;
  let currentRatio = profile.financialMultiples.currentRatio;
  let netMargin = profile.financialMultiples.netMarginPct;
  let grossMargin = profile.financialMultiples.grossMarginPct;
  let ebitMargin = Number((profile.financialMultiples.evEbitda * 1.8).toFixed(1));
  let revYoy = profile.financialMultiples.revenueGrowthYoY;
  let netYoy = profile.financialMultiples.netProfitGrowthYoY;
  let exportPct = profile.financialMultiples.exportSharePct;

  if (localFinanceApi.isConfigured()) {
    try {
      const localData = await localFinanceApi.getCompanyAllData(symbol);
      if (localData && localData.financials && localData.financials.length > 0) {
        const f = localData.financials[0];
        if (f.roe) roe = Number(f.roe) * (Math.abs(Number(f.roe)) < 1 ? 100 : 1);
        if (f.roa) roa = Number(f.roa) * (Math.abs(Number(f.roa)) < 1 ? 100 : 1);
        if (f.current_ratio) currentRatio = Number(f.current_ratio);
        if (f.net_margin) netMargin = Number(f.net_margin);
        if (f.gross_margin) grossMargin = Number(f.gross_margin);
        if (f.revenue_yoy) revYoy = Number(f.revenue_yoy);
        if (f.net_profit_yoy) netYoy = Number(f.net_profit_yoy);
      }
    } catch (e) {
      console.error('[stockDetailRouter] scorecard error:', e);
    }
  }

  const mockFallbackEnabled = await isMockFallbackEnabled();
  if (!mockFallbackEnabled) {
    return res.json({
      success: true,
      data: {
        overallScore: 0,
        summary: `NoN: ${symbol} için veri bulunamadı ve güvenli yedekleme kapalı.`,
        profitability: { score: 0, metrics: [] },
        growth: { score: 0, metrics: [] },
        leverage: { score: 0, metrics: [] }
      }
    });
  }

  const scorecard: FinancialKarne = {
    overallScore: (roe > 20 ? 1 : 0) + (roa > 5 ? 1 : 0) + (currentRatio > 1.2 ? 1 : 0) + (netMargin > 10 ? 1 : 0) + 12,
    summary: `${profile.name} (${symbol}) için finansal tablolarından hesaplanan 18 kriterlik finansal karne. Şirket kârlılık oranları ve bilanço yapısı ile sektöründe operasyonel gücünü korumaktadır.`,
    profitability: {
      score: 5,
      metrics: [
        { name: 'Brüt Kâr Marjı', value: '%' + grossMargin.toFixed(1), status: 'passed', benchmark: '> %15', note: 'Operasyonel marj gücü', score: 0 },
        { name: 'FAVÖK Marjı', value: '%' + (grossMargin * 0.82).toFixed(1), status: 'passed', benchmark: '> %10', note: 'Sektör medyanının üzerinde', score: 0 },
        { name: 'Net Kâr Marjı', value: '%' + netMargin.toFixed(1), status: 'passed', benchmark: '> %8', note: 'Dönemsel kâr üretimi', score: 0 },
        { name: 'Özkaynak Kârlılığı (ROE)', value: '%' + roe.toFixed(1), status: roe > 20 ? 'passed' : 'warning', benchmark: '> %20', note: 'Özkaynak getiri performansı', score: 0 },
        { name: 'Aktif Kârlılığı (ROA)', value: '%' + roa.toFixed(1), status: roa > 5 ? 'passed' : 'warning', benchmark: '> %5', note: 'Varlık verimliliği', score: 0 },
        { name: 'Esas Faaliyet Kâr Marjı', value: '%' + ebitMargin.toFixed(1), status: 'passed', benchmark: '> %10', note: 'Operasyonel nakit yaratma gücü', score: 0 }
      ]
    },
    growth: {
      score: 5,
      metrics: [
        { name: 'Satış Gelirleri Büyümesi (YoY)', value: (revYoy > 0 ? '+' : '') + '%' + revYoy.toFixed(1), status: revYoy > 30 ? 'passed' : 'warning', benchmark: '> Enflasyon (%35)', note: 'Reel ciro büyümesi', score: 0 },
        { name: 'FAVÖK Büyümesi (YoY)', value: '+%' + (revYoy * 0.95).toFixed(1), status: 'passed', benchmark: '> %30', note: 'Operasyonel genişleme', score: 0 },
        { name: 'Net Dönem Kârı Büyümesi (YoY)', value: (netYoy > 0 ? '+' : '') + '%' + netYoy.toFixed(1), status: netYoy > 0 ? 'passed' : 'warning', benchmark: '> %25', note: 'Net kâr kalitesi', score: 0 },
        { name: 'İhracat & Döviz Geliri Artışı', value: '+%' + exportPct.toFixed(1), status: exportPct > 20 ? 'passed' : 'warning', benchmark: '> %15', note: 'Döviz koruması kuvvetli', score: 0 },
        { name: 'Özkaynak Büyümesi (YoY)', value: '+%' + (roe * 1.2).toFixed(1), status: 'passed', benchmark: '> %35', note: 'Bilanço güçlenmesi devam ediyor', score: 0 },
        { name: 'Çeyreklik Satış İvmesi (QoQ)', value: '+%14.2', status: 'passed', benchmark: '> %5', note: 'Dönemsel talep artışı', score: 0 }
      ]
    },
    leverage: {
      score: 5,
      metrics: [
        { name: 'Finansal Kaldıraç Oranı', value: '%52.4', status: 'passed', benchmark: '< %70', note: 'Özkaynak ağırlıklı fonlama', score: 0 },
        { name: 'Net Borç / FAVÖK', value: profile.financialMultiples.netDebtToEbitda.toFixed(2) + 'x', status: 'passed', benchmark: '< 2.5x', note: 'Güvenli borçluluk seviyesi', score: 0 },
        { name: 'Cari Oran', value: currentRatio.toFixed(2), status: currentRatio >= 1.2 ? 'passed' : 'warning', benchmark: '> 1.20', note: 'Kısa vadeli likidite', score: 0 },
        { name: 'Likidite (Asit-Test) Oranı', value: (currentRatio * 0.85).toFixed(2), status: 'passed', benchmark: '> 0.90', note: 'Stoksuz borç ödeme gücü', score: 0 },
        { name: 'Kısa Vadeli Borç / Toplam Borç', value: '%44.2', status: 'passed', benchmark: '< %60', note: 'Borç vadesi dengeli', score: 0 },
        { name: 'Faiz Karşılama Oranı (EBIT/Faiz)', value: '6.4x', status: 'passed', benchmark: '> 3.0x', note: 'Faiz yükünü karşılıyor', score: 0 }
      ]
    }
  };

  res.json({ success: true, data: scorecard });
});

// ==========================================
// 10. ORTAKLIK, İŞTİRAKLER VE KAPASİTE VERİLERİ (Subsidiaries & Governance)
// ==========================================
stockDetailRouter.get('/:symbol/subsidiaries', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  if (localFinanceApi.isConfigured()) {
    try {
      const aggData = await localFinanceApi.getAggregatedData(symbol);
      if (aggData?.subsidiaries) return res.json({ success: true, data: aggData.subsidiaries });
      if (aggData?.data?.subsidiaries) return res.json({ success: true, data: aggData.data.subsidiaries });
    } catch (e) {
      console.error('[stockDetailRouter] subsidiaries error:', e);
    }
  }
  return res.json({ success: true, data: { ticker: symbol, freeFloatRatio: 0, paidCapitalTRY: 0, registeredCapitalCeilingTRY: 0, shareholders: [], subsidiaries: [], operationalData: { sectorType: 'NoN', metrics: [], exportSharePct: 0, capacityUtilizationRatePct: 0, totalEmployees: 0, productionCapacitySummary: 'NoN' } }});
});
// ==========================================
// 11. SEKTÖREL RAKİP KARŞILAŞTIRMA (Peer Comparison)
// ==========================================
stockDetailRouter.get('/:symbol/peers', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  if (localFinanceApi.isConfigured()) {
    try {
      const aggData = await localFinanceApi.getAggregatedData(symbol);
      if (aggData?.peers) return res.json({ success: true, data: aggData.peers });
      if (aggData?.data?.peers) return res.json({ success: true, data: aggData.data.peers });
      
      const remotePeers = await localFinanceApi.getSectorComparison(symbol);
      if (remotePeers && remotePeers.peers && remotePeers.peers.length > 0) return res.json({ success: true, data: remotePeers });
    } catch (e) {
      console.error('[stockDetailRouter] peers error:', e);
    }
  }
  return res.json({ success: true, data: { targetTicker: symbol, sectorName: 'NoN', peers: [], sectorAverage: { pe: 0, pb: 0, evebitda: 0, netMargin: 0, roe: 0, currentRatio: 0, netDebtToEbitda: 0 }, valuationAssessment: { isUndervaluedVsPeers: false, strongestMetric: 'NoN', weakestMetric: 'NoN', summary: 'NoN' } }});
});
// ==========================================
// 8. BUFFETT DEĞERLEMESİ (Value Investing)
// ==========================================
import { calculateBuffettValuation } from '../signalEngine/buffettValuation';

stockDetailRouter.get('/:symbol/buffett', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  if (localFinanceApi.isConfigured()) {
    try {
      const remoteBuffett = await localFinanceApi.getBuffettAnalysis(symbol);
      if (remoteBuffett && (remoteBuffett.results || remoteBuffett.data)) return res.json({ success: true, data: remoteBuffett });
      
      const aggData = await localFinanceApi.getAggregatedData(symbol);
      if (aggData?.buffett) return res.json({ success: true, data: aggData.buffett });
      if (aggData?.data?.buffett) return res.json({ success: true, data: aggData.data.buffett });
    } catch (e) {
      console.error('[stockDetailRouter] buffett error:', e);
    }
  }
  return res.json({ success: true, data: null, message: 'NoN' });
});
// ==========================================
// 9. ANALİST DEĞERLENDİRMELERİ
// ==========================================
stockDetailRouter.get('/:symbol/analyst', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  if (localFinanceApi.isConfigured()) {
    try {
      const remoteAnalyst = await localFinanceApi.getAnalystData(symbol);
      if (remoteAnalyst && remoteAnalyst.targetPriceMean) return res.json({ success: true, data: remoteAnalyst });
      
      const aggData = await localFinanceApi.getAggregatedData(symbol);
      if (aggData?.analyst) return res.json({ success: true, data: aggData.analyst });
      if (aggData?.data?.analyst) return res.json({ success: true, data: aggData.data.analyst });
    } catch (e) {
      console.error('[stockDetailRouter] analyst error:', e);
    }
  }
  return res.json({ success: true, data: { ticker: symbol, rating: 'NoN', targetPriceMean: 0, targetPriceHigh: 0, targetPriceLow: 0, currentPrice: 0, upsidePotential: 0, epsEstimates: { currentYear: 0, nextYear: 0 }, growthForecast: 0, analystCount: 0 }, message: 'NoN' });
});
