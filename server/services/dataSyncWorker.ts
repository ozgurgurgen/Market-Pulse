import { localFinanceApi } from '../dataAdapters/adapters/LocalFinanceApiAdapter';
import { serverLocalDatabase } from './serverLocalDatabase';

class DataSyncWorker {
  private intervalId: NodeJS.Timeout | null = null;
  private isSyncing = false;

  public start(intervalMs: number = 300_000) {
    if (this.intervalId) return;
    
    // Non-blocking background initialization
    setTimeout(() => {
      this.syncAll().catch(err => console.warn('[DataSyncWorker] Initial sync notice:', err?.message || err));
    }, 5000);
    
    this.intervalId = setInterval(() => {
      this.syncAll().catch(err => console.warn('[DataSyncWorker] Periodic sync notice:', err?.message || err));
    }, intervalMs);

    console.log(`[DataSyncWorker] Background sync worker registered (interval: ${intervalMs}ms). Requests will never block.`);
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public async syncAll() {
    if (this.isSyncing) return;
    this.isSyncing = true;
    
    try {
      if (!localFinanceApi.isConfigured()) {
        console.log('[DataSyncWorker] LocalFinanceApi is not configured. Database-first serving active with local cache.');
        return;
      }
      
      console.log('[DataSyncWorker] Starting background sync from local API to database...');
      
      // 1. Fetch BIST Prices and update local database
      const prices = await localFinanceApi.getBistPrices(1000);
      if (prices && Array.isArray(prices)) {
        for (const priceObj of prices) {
          if (priceObj && (priceObj.ticker || priceObj.symbol)) {
             const sym = (priceObj.ticker || priceObj.symbol).toUpperCase();
             serverLocalDatabase.set('market_quotes', sym, {
               symbol: sym,
               name: priceObj.name || sym,
               category: 'BIST',
               exchange: 'BIST',
               currentPrice: priceObj.last_price || priceObj.price || 0,
               change24hPercent: priceObj.change_pct || priceObj.change24hPercent || 0,
               change24h: priceObj.change_val || priceObj.change24h || 0,
               volume: priceObj.volume || 0,
               high24h: priceObj.high_price || priceObj.high24h || 0,
               low24h: priceObj.low_price || priceObj.low24h || 0,
               lastUpdated: priceObj.date || new Date().toISOString(),
               isLiveRealtime: true
             });
          }
        }
      }
      
      // 2. Fetch IPOs and update ipoListings in database
      try {
        const ipos = await localFinanceApi.getIpos(100);
        if (ipos && Array.isArray(ipos)) {
          serverLocalDatabase.set('market_data', 'ipos', ipos);
          for (const ipo of ipos) {
            const id = ipo.id || `ipo-${(ipo.ticker || 'item').toLowerCase()}`;
            serverLocalDatabase.set('ipoListings', id, ipo);
          }
        }
      } catch(e) {}

      // 3. Fetch Macro and update economic_indicators in database
      try {
        const macro = await localFinanceApi.getMacroInflation();
        if (macro) {
          serverLocalDatabase.set('market_data', 'macro', macro);
          if (Array.isArray(macro)) {
            for (const ind of macro) {
              const code = ind.indicator_code || ind.id || ind.code;
              if (code) {
                serverLocalDatabase.set('economic_indicators', code, ind);
              }
            }
          }
        }
      } catch(e) {}

      // 4. Fetch Companies
      const companies = await localFinanceApi.getAllCompanies();
      if (companies && Array.isArray(companies)) {
        for (const comp of companies) {
           if (comp && comp.ticker) {
             serverLocalDatabase.set('companies', comp.ticker, comp);
           }
        }
      }

      // 5. Fetch specific aggregated data for top symbols
      const topSymbols = ['THYAO', 'TUPRS', 'ISCTR', 'AKBNK', 'EREGL', 'KCHOL', 'SAHOL', 'BIMAS', 'ASELS', 'SISE'];
      for (const sym of topSymbols) {
         try {
           const aggData = await localFinanceApi.getAggregatedData(sym);
           if (aggData) {
              serverLocalDatabase.set('aggregated_data', sym, aggData);
           }
         } catch(e) {}
      }

      console.log('[DataSyncWorker] Background sync completed successfully.');
    } catch (error) {
      console.warn('[DataSyncWorker] Sync notice:', error);
    } finally {
      this.isSyncing = false;
    }
  }
}

export const dataSyncWorker = new DataSyncWorker();
