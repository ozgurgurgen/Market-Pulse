import { API_ACCESS_LIST } from '../config/apiAccess';

export interface RateLimitConfig {
  sourceName: string;
  maxRequestsPerHour: number;
  currentRequests: number;
  lastResetTime: number;
  backoffUntil: number | null;
  totalRequestsServed: number;
  totalThrottled: number;
}

export class RateLimiter {
  private limits: Map<string, RateLimitConfig> = new Map();

  constructor() {
    // API_ACCESS_LIST'ten limitleri otomatik yükle
    for (const source of API_ACCESS_LIST) {
      this.limits.set(source.sourceName, {
        sourceName: source.sourceName,
        maxRequestsPerHour: source.rateLimitPerHour,
        currentRequests: 0,
        lastResetTime: Date.now(),
        backoffUntil: null,
        totalRequestsServed: 0,
        totalThrottled: 0,
      });
    }

    // Ek varsayılanlar
    if (!this.limits.has('telegram')) {
      this.limits.set('telegram', {
        sourceName: 'telegram',
        maxRequestsPerHour: 60,
        currentRequests: 0,
        lastResetTime: Date.now(),
        backoffUntil: null,
        totalRequestsServed: 0,
        totalThrottled: 0,
      });
    }
  }

  /**
   * İlgili kaynak için yeni istek yapılıp yapılamayacağını kontrol eder ve sayacı artırır.
   */
  async canMakeRequest(sourceName: string): Promise<boolean> {
    const config = this.getOrCreate(sourceName);
    const now = Date.now();

    // 1. Backoff kontrolü
    if (config.backoffUntil && now < config.backoffUntil) {
      config.totalThrottled++;
      return false;
    }

    // 2. Saatlik pencere sıfırlama (1 saat = 3,600,000 ms)
    if (now - config.lastResetTime > 3600000) {
      config.currentRequests = 0;
      config.lastResetTime = now;
      config.backoffUntil = null;
    }

    // 3. Limit kontrolü
    if (config.currentRequests >= config.maxRequestsPerHour) {
      // 15 dakika bekleme (backoff)
      config.backoffUntil = now + 900000;
      config.totalThrottled++;
      console.warn(`[RateLimiter] ⚠️ ${sourceName} saatlik limiti (${config.maxRequestsPerHour}) aşıldı. 15 dk backoff başlatıldı.`);
      return false;
    }

    config.currentRequests++;
    config.totalRequestsServed++;
    return true;
  }

  /**
   * Harici servis 429 dönerse manuel backoff tetikler
   */
  triggerBackoff(sourceName: string, durationMs: number = 900000): void {
    const config = this.getOrCreate(sourceName);
    config.backoffUntil = Date.now() + durationMs;
    config.totalThrottled++;
    console.warn(`[RateLimiter] 🛑 ${sourceName} için manuel backoff tetiklendi (${Math.round(durationMs / 1000)}s).`);
  }

  getRemainingQuota(sourceName: string): number {
    const config = this.limits.get(sourceName);
    if (!config) return 1000;

    // Reset kontrolü
    if (Date.now() - config.lastResetTime > 3600000) {
      return config.maxRequestsPerHour;
    }
    return Math.max(0, config.maxRequestsPerHour - config.currentRequests);
  }

  getBackoffRemaining(sourceName: string): number {
    const config = this.limits.get(sourceName);
    if (!config || !config.backoffUntil) return 0;
    return Math.max(0, config.backoffUntil - Date.now());
  }

  getAllLimits(): RateLimitConfig[] {
    return Array.from(this.limits.values());
  }

  private getOrCreate(sourceName: string): RateLimitConfig {
    if (!this.limits.has(sourceName)) {
      this.limits.set(sourceName, {
        sourceName,
        maxRequestsPerHour: 100,
        currentRequests: 0,
        lastResetTime: Date.now(),
        backoffUntil: null,
        totalRequestsServed: 0,
        totalThrottled: 0,
      });
    }
    return this.limits.get(sourceName)!;
  }
}

export const rateLimiter = new RateLimiter();
