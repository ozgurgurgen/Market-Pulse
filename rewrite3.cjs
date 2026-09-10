const fs = require('fs');
let code = fs.readFileSync('server/routes/stockDetailRouter.ts', 'utf8');

function replaceBlock(routePrefix, newCode) {
    const startIdx = code.indexOf(`stockDetailRouter.get('${routePrefix}'`);
    if (startIdx === -1) {
        console.error("NOT FOUND", routePrefix);
        return;
    }
    const endMarker = `// ==========================================`;
    const endIdx = code.indexOf(endMarker, startIdx);
    
    if (endIdx === -1) {
        // if no end marker, assume end of file
        code = code.substring(0, startIdx) + newCode + "\n";
    } else {
        code = code.substring(0, startIdx) + newCode + "\n" + code.substring(endIdx);
    }
}

replaceBlock('/:symbol/multiples', `stockDetailRouter.get('/:symbol/multiples', async (req, res) => {
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
});`);

replaceBlock('/:symbol/events', `stockDetailRouter.get('/:symbol/events', async (req, res) => {
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
});`);

replaceBlock('/:symbol/brokerage-distribution', `stockDetailRouter.get('/:symbol/brokerage-distribution', async (req, res) => {
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
});`);

replaceBlock('/:symbol/funds', `stockDetailRouter.get('/:symbol/funds', async (req, res) => {
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
});`);

replaceBlock('/:symbol/seasonality', `stockDetailRouter.get('/:symbol/seasonality', async (req, res) => {
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
});`);

replaceBlock('/:symbol/fairvalue', `stockDetailRouter.get('/:symbol/fairvalue', async (req, res) => {
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
});`);

replaceBlock('/:symbol/subsidiaries', `stockDetailRouter.get('/:symbol/subsidiaries', async (req, res) => {
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
});`);

replaceBlock('/:symbol/peers', `stockDetailRouter.get('/:symbol/peers', async (req, res) => {
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
});`);

replaceBlock('/:symbol/buffett', `stockDetailRouter.get('/:symbol/buffett', async (req, res) => {
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
});`);

replaceBlock('/:symbol/analyst', `stockDetailRouter.get('/:symbol/analyst', async (req, res) => {
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
});`);

fs.writeFileSync('server/routes/stockDetailRouter.ts', code, 'utf8');
console.log("Rewrite completed.");
