import { Router } from 'express';
import { localFinanceApi } from '../dataAdapters/adapters/LocalFinanceApiAdapter';
import { serverLocalDatabase } from '../services/serverLocalDatabase';
import { BIST_300_STOCKS } from '../data/bistUniverse';

export const sectorRouter = Router();

sectorRouter.get('/:name', async (req, res) => {
  const sectorName = req.params.name;

  // 1. Pipeline / Yerel Finans API adaptöründen sektör verisi çekmeyi dene
  try {
    const overview = await localFinanceApi.getV1SectorsOverview();
    if (overview && Array.isArray(overview)) {
      const match = overview.find((s: any) => 
        (s.sectorName || s.name || s.sector || '').toLowerCase().includes(sectorName.toLowerCase())
      );
      if (match) {
        return res.json({
          sector: match.sectorName || sectorName,
          industry: match.sectorName || sectorName,
          averagePE: match.averagePE || null,
          averagePB: match.averagePB || null,
          averageROE: match.averageROE || null,
          stockCount: match.stockCount || (match.stocks ? match.stocks.length : 0),
          topCompanies: match.topStocks || match.stocks || []
        });
      }
    }
  } catch (e) {
    console.warn('[sectorRouter] error fetching sectors overview:', e);
  }

  // 2. Gerçek BIST evreninden ve piyasa kotasyonlarından hesapla (Asla sahte matematiksel formül kullanılmaz)
  const quotesDb = serverLocalDatabase.getCollectionDict<any>('market_quotes');
  const matchingStocks = BIST_300_STOCKS.filter((c: any) => 
    c.sector && c.sector.toLowerCase().includes(sectorName.toLowerCase())
  );

  if (matchingStocks.length > 0) {
    const scoredCompanies = matchingStocks.map((c: any) => {
      const clean = c.symbol.replace('.IS', '');
      const qObj = quotesDb[`${clean}.IS`] || quotesDb[clean];
      const q = qObj?.quote || qObj;
      const pe = (typeof q?.peRatio === 'number' && q.peRatio > 0) ? q.peRatio : 0;
      const change = typeof q?.changePercent === 'number' ? q.changePercent : 0;
      const marketCap = typeof q?.marketCap === 'number' ? q.marketCap : 0;

      return {
        symbol: c.symbol.endsWith('.IS') ? c.symbol : `${c.symbol}.IS`,
        name: c.name || c.symbol,
        pe: pe > 0 ? pe : null,
        pb: null,
        roe: null,
        marketCap,
        change24hPercent: change
      };
    });

    const validPes = scoredCompanies.filter(c => c.pe !== null).map(c => c.pe as number);
    const averagePE = validPes.length > 0 
      ? Number((validPes.reduce((a, b) => a + b, 0) / validPes.length).toFixed(2))
      : null;

    return res.json({
      sector: sectorName,
      industry: matchingStocks[0]?.sector || sectorName,
      averagePE,
      averagePB: null,
      averageROE: null,
      stockCount: matchingStocks.length,
      topCompanies: scoredCompanies.slice(0, 10)
    });
  }

  return res.json({
    sector: sectorName,
    industry: sectorName,
    averagePE: null,
    averagePB: null,
    averageROE: null,
    stockCount: 0,
    topCompanies: []
  });
});
