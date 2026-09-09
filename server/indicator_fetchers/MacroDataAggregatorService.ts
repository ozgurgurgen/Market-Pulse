import { BaseFetcher } from './BaseFetcher';
import { EconomicIndicator } from './types';
import { TcmbEvdsFetcher } from './TcmbEvdsFetcher';
import { FredFetcher } from './FredFetcher';
import { EcbFetcher } from './EcbFetcher';
import { FrankfurterFetcher } from './FrankfurterFetcher';
import { YahooFinanceMacroFetcher } from './YahooFinanceMacroFetcher';
import { TuikMacroFetcher } from './TuikMacroFetcher';
import { LocalFinanceMacroFetcher } from './LocalFinanceMacroFetcher';
import { serverLocalDatabase } from '../services/serverLocalDatabase';

export class MacroDataAggregatorService {
  private fetchers: BaseFetcher[] = [];
  private memoryCache: Map<string, EconomicIndicator> = new Map();
  private lastFetchTimes: Map<string, number> = new Map();

  // TTL Politikaları:
  // Piyasa verisi (kurlar, emtialar, borsa endeksleri, VIX): 15 dakika
  private readonly MARKET_TTL_MS = 15 * 60 * 1000;
  // Makro ekonomik veriler (faiz kararları, TÜFE, GSYH, işsizlik): 15 dakika (Kısıtlandı)
  private readonly MACRO_TTL_MS = 15 * 60 * 1000;

  constructor() {
    this.fetchers = [
      new LocalFinanceMacroFetcher(),
      new TcmbEvdsFetcher(),
      new FredFetcher(),
      new EcbFetcher(),
      new FrankfurterFetcher(),
      new YahooFinanceMacroFetcher(),
      new TuikMacroFetcher(),
    ];
  }

  public async initialize(): Promise<void> {
    // 1. Önce yerel veritabanından son bilinen göstergeleri belleğe yükle
    try {
      const persisted = serverLocalDatabase.getAll<EconomicIndicator>('economic_indicators');
      if (persisted && persisted.length > 0) {
        for (const item of persisted) {
          this.memoryCache.set(item.indicator_code, item);
        }
        console.log(`✅ [MacroAggregator] Yerel veritabanından ${persisted.length} ekonomik gösterge yüklendi.`);
      }
    } catch (e) {
      console.warn('[MacroAggregator] Başlangıç veritabanı okuma uyarısı:', e);
    }

    // 2. İlk açılışta taze verileri arka planda çek (açılışı bloke etmemesi için)
    this.refreshAllIndicators(false).catch(err => {
      console.warn('[MacroAggregator] Başlangıç arka plan yenileme uyarısı:', err?.message || err);
    });
  }

  public async refreshAllIndicators(force: boolean = false): Promise<EconomicIndicator[]> {
    const now = Date.now();

    for (const fetcher of this.fetchers) {
      const lastFetch = this.lastFetchTimes.get(fetcher.name) || 0;
      const isMarketFetcher = fetcher.sourceApi === 'YAHOO_FINANCE' || fetcher.sourceApi === 'FRANKFURTER';
      const requiredTtl = isMarketFetcher ? this.MARKET_TTL_MS : this.MACRO_TTL_MS;

      if (!force && (now - lastFetch < requiredTtl)) {
        continue; // Cache hala geçerli
      }

      try {
        const indicators = await fetcher.fetchIndicators();
        for (const ind of indicators) {
          this.memoryCache.set(ind.indicator_code, ind);
          // Veritabanına yedekle (Kalıcı ve Stale fallback için)
          serverLocalDatabase.set('economic_indicators', ind.indicator_code, ind);
        }
        this.lastFetchTimes.set(fetcher.name, now);
      } catch (err: any) {
        console.error(`❌ [MacroAggregator] ${fetcher.name} çekilirken hata oluştu:`, err.message);
        // Hata durumunda mevcut kaydı 'is_stale = true' yaparak koru (Asla boş döndürme)
        for (const [code, ind] of this.memoryCache.entries()) {
          if (ind.source_api === fetcher.sourceApi) {
            const staleInd: EconomicIndicator = { ...ind, is_stale: true };
            this.memoryCache.set(code, staleInd);
          }
        }
      }
    }

    return Array.from(this.memoryCache.values());
  }

  public async getAllIndicators(): Promise<EconomicIndicator[]> {
    if (this.memoryCache.size === 0) {
      await this.refreshAllIndicators(true);
    }
    return Array.from(this.memoryCache.values());
  }

  public getIndicatorByCode(code: string): EconomicIndicator | undefined {
    return this.memoryCache.get(code);
  }

  public getIndicatorsByRegion(region: 'TR' | 'GLOBAL' | 'US' | 'EU'): EconomicIndicator[] {
    return Array.from(this.memoryCache.values()).filter(i => i.region === region);
  }
}

export const macroDataAggregator = new MacroDataAggregatorService();
