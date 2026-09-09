import { orchestratorAgent } from '../intelligence/orchestratorAgent';
import { cacheService } from './cacheService';
import { rateLimiter } from './rateLimiter';
import { healthMonitor } from './healthMonitor';
import { SCHEDULER_CONFIG } from '../config/constants';
import { macroCommentaryService } from '../macroCommentaryService';
import { macroDataAggregator } from '../indicator_fetchers/MacroDataAggregatorService';

export interface TickerPriorityConfig {
  ticker: string;
  name: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  refreshIntervalMinutes: number;
}

export const TICKER_PRIORITIES: TickerPriorityConfig[] = [
  // HIGH ÖNCELİK (5 dakikada bir — 12 istek/saat/varlık = 48 istek/saat)
  { ticker: 'THYAO', name: 'Türk Hava Yolları', priority: 'HIGH', refreshIntervalMinutes: SCHEDULER_CONFIG.HIGH_PRIORITY_INTERVAL_MINUTES },
  { ticker: 'ASELS', name: 'Aselsan Elektronik', priority: 'HIGH', refreshIntervalMinutes: SCHEDULER_CONFIG.HIGH_PRIORITY_INTERVAL_MINUTES },
  { ticker: 'BTC-USD', name: 'Bitcoin', priority: 'HIGH', refreshIntervalMinutes: SCHEDULER_CONFIG.HIGH_PRIORITY_INTERVAL_MINUTES },
  { ticker: 'ETH-USD', name: 'Ethereum', priority: 'HIGH', refreshIntervalMinutes: SCHEDULER_CONFIG.HIGH_PRIORITY_INTERVAL_MINUTES },

  // MEDIUM ÖNCELİK (10 dakikada bir — 6 istek/saat/varlık = 24 istek/saat)
  { ticker: 'EREGL', name: 'Ereğli Demir Çelik', priority: 'MEDIUM', refreshIntervalMinutes: SCHEDULER_CONFIG.MEDIUM_PRIORITY_INTERVAL_MINUTES },
  { ticker: 'BIMAS', name: 'BİM Mağazaları', priority: 'MEDIUM', refreshIntervalMinutes: SCHEDULER_CONFIG.MEDIUM_PRIORITY_INTERVAL_MINUTES },
  { ticker: 'KCHOL', name: 'Koç Holding', priority: 'MEDIUM', refreshIntervalMinutes: SCHEDULER_CONFIG.MEDIUM_PRIORITY_INTERVAL_MINUTES },
  { ticker: 'AKBNK', name: 'Akbank', priority: 'MEDIUM', refreshIntervalMinutes: SCHEDULER_CONFIG.MEDIUM_PRIORITY_INTERVAL_MINUTES },

  // LOW ÖNCELİK (15 dakikada bir — 4 istek/saat/varlık = 20 istek/saat)
  { ticker: 'SISE', name: 'Şişecam', priority: 'LOW', refreshIntervalMinutes: SCHEDULER_CONFIG.LOW_PRIORITY_INTERVAL_MINUTES },
  { ticker: 'TUPRS', name: 'Tüpraş Rafineri', priority: 'LOW', refreshIntervalMinutes: SCHEDULER_CONFIG.LOW_PRIORITY_INTERVAL_MINUTES },
  { ticker: 'FROTO', name: 'Ford Otomotiv', priority: 'LOW', refreshIntervalMinutes: SCHEDULER_CONFIG.LOW_PRIORITY_INTERVAL_MINUTES },
  { ticker: 'GARAN', name: 'Garanti BBVA', priority: 'LOW', refreshIntervalMinutes: SCHEDULER_CONFIG.LOW_PRIORITY_INTERVAL_MINUTES },
  { ticker: 'XAU-USD', name: 'Ons Altın', priority: 'LOW', refreshIntervalMinutes: SCHEDULER_CONFIG.LOW_PRIORITY_INTERVAL_MINUTES },
];

class SchedulerService {
  private activeTimers: any[] = [];
  private isRunning = false;

  /**
   * Kademeli ve Güvenli Scheduler Başlatıcı
   * Toplam istek bütçesi: 48 + 24 + 20 = 92 istek/saat (Yahoo limitinin %18.4'ü)
   */
  startScheduler(): void {
    if (this.isRunning) return;
    this.isRunning = true;

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 [SchedulerService] Kademeli Finansal İstihbarat Zamanlayıcısı Başlatıldı');
    console.log('📊 Toplam İstek Bütçesi: ~92 istek/saat (Rate limit güvenlik sınırı altında)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // İlk açılışta yüksek öncelikli varlıkları ön yükle
    this.initialWarmup();

    // Her varlık grubu için periyodik interval timer oluştur
    for (const config of TICKER_PRIORITIES) {
      const intervalMs = config.refreshIntervalMinutes * 60 * 1000;

      // İlk çalıştırmayı hafif kademeli (staggered) yaymak için rastgele 5-30 saniye gecikme ver
      const jitterMs = Math.floor(Math.random() * 25000) + 5000;

      const timerId = setTimeout(() => {
        // İlk periyot
        this.refreshSingleTicker(config.ticker);

        // Ardından sürekli interval
        const recurringTimer = setInterval(() => {
          this.refreshSingleTicker(config.ticker);
        }, intervalMs);

        this.activeTimers.push(recurringTimer);
      }, jitterMs);

      this.activeTimers.push(timerId);
    }
    // Makro Ekonomik YZ Yorum Zamanlayıcısı (Günde 2 kez / 12 saatte bir)
    const macroIntervalMs = 12 * 60 * 60 * 1000;
    const macroTimerId = setInterval(() => {
      macroCommentaryService.generateMacroCommentary(false).catch(err => {
        console.warn('[SchedulerService] Makro yorum otomatik güncelleme uyarısı:', err.message);
      });
    }, macroIntervalMs);
    this.activeTimers.push(macroTimerId);

    // Kullanıcı & Portföy Analitik Snapshot Hesaplayıcısı (6 Saatte bir ve açılışta 15sn sonra)
    setTimeout(async () => {
      try {
        const { computeAnalyticsSnapshot } = await import('./analyticsSnapshotService');
        await computeAnalyticsSnapshot('startup_warmup');
        console.log('✅ [SchedulerService] İlk kullanıcı & portföy analitik snapshotı başarıyla hesaplandı.');
      } catch (err: any) {
        console.warn('[SchedulerService] Analitik snapshot ilk hesaplama uyarısı:', err?.message);
      }
    }, 15000);

    const analyticsIntervalMs = 6 * 60 * 60 * 1000;
    const analyticsTimerId = setInterval(async () => {
      try {
        const { computeAnalyticsSnapshot } = await import('./analyticsSnapshotService');
        await computeAnalyticsSnapshot('scheduled_interval');
        console.log('📊 [SchedulerService] Periyodik analitik snapshot güncellendi.');
      } catch (err: any) {
        console.warn('[SchedulerService] Analitik snapshot periyodik güncelleme uyarısı:', err?.message);
      }
    }, analyticsIntervalMs);
    this.activeTimers.push(analyticsTimerId);
  }

  stopScheduler(): void {
    for (const timer of this.activeTimers) {
      clearTimeout(timer);
      clearInterval(timer);
    }
    this.activeTimers = [];
    this.isRunning = false;
    console.log('[SchedulerService] ⏹️ İstihbarat zamanlayıcısı durduruldu.');
  }

  async refreshSingleTicker(ticker: string, force = false): Promise<any> {
    try {
      const startTime = Date.now();

      // Rate limit kontrolü
      const canFetch = await rateLimiter.canMakeRequest('yahoo_finance');
      if (!canFetch && !force) {
        console.warn(`[SchedulerService] ⚠️ ${ticker} için Yahoo Finance rate limit aşıldı, döngü atlanıyor.`);
        healthMonitor.recordSkipped(ticker, 'rate_limit');
        return null;
      }

      // Veriyi üret
      const report = await orchestratorAgent.generateFinalReport(ticker);

      // Önbelleğe yaz (5 dakika TTL = 300s)
      await cacheService.set(`intelligence:${ticker}`, report, SCHEDULER_CONFIG.CACHE_DEFAULT_TTL_SECONDS);
      await cacheService.set(`intel_${ticker}`, report, SCHEDULER_CONFIG.CACHE_DEFAULT_TTL_SECONDS);

      // Sağlık durumunu kaydet
      healthMonitor.recordSuccess(ticker, Date.now() - startTime);

      return report;
    } catch (error: any) {
      console.error(`[SchedulerService] ❌ ${ticker} için yenileme hatası:`, error?.message || error);
      healthMonitor.recordError(ticker, error);
      return null;
    }
  }

  private async initialWarmup(): Promise<void> {
    // Sadece ilk 2 varlığı (THYAO ve ASELS) hemen yükle, gerisini kademelendir
    const warmupList = ['THYAO', 'ASELS'];
    for (const ticker of warmupList) {
      this.refreshSingleTicker(ticker).catch((e) => {
        console.warn(`Warmup failed for ${ticker}:`, e);
      });
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      activeJobsCount: TICKER_PRIORITIES.length,
      staggeredConfig: TICKER_PRIORITIES,
    };
  }
}

export const schedulerService = new SchedulerService();
