import { API_ACCESS_LIST } from '../config/apiAccess';

export interface SourceHealth {
  sourceName: string;
  displayName: string;
  status: 'healthy' | 'degraded' | 'down';
  lastSuccessTime: number | null;
  lastErrorTime: number | null;
  consecutiveErrors: number;
  totalRequests: number;
  totalErrors: number;
  lastErrorMessage?: string;
  lastLatencyMs?: number;
}

export class HealthMonitor {
  private sources: Map<string, SourceHealth> = new Map();

  constructor() {
    // API Access listesindeki tüm kaynakları varsayılan olarak tanımla
    for (const api of API_ACCESS_LIST) {
      this.sources.set(api.sourceName, {
        sourceName: api.sourceName,
        displayName: api.displayName,
        status: api.isAccessible ? 'healthy' : 'degraded',
        lastSuccessTime: api.isAccessible ? Date.now() : null,
        lastErrorTime: null,
        consecutiveErrors: 0,
        totalRequests: 0,
        totalErrors: 0,
      });
    }

    // Ek servisler
    if (!this.sources.has('signal_engine')) {
      this.sources.set('signal_engine', {
        sourceName: 'signal_engine',
        displayName: 'SignalEngine v2 (İndikatör & Composite Motoru)',
        status: 'healthy',
        lastSuccessTime: Date.now(),
        lastErrorTime: null,
        consecutiveErrors: 0,
        totalRequests: 0,
        totalErrors: 0,
      });
    }

    if (!this.sources.has('telegram')) {
      this.sources.set('telegram', {
        sourceName: 'telegram',
        displayName: 'Telegram Alarm Botu',
        status: 'healthy',
        lastSuccessTime: Date.now(),
        lastErrorTime: null,
        consecutiveErrors: 0,
        totalRequests: 0,
        totalErrors: 0,
      });
    }
  }

  recordSuccess(sourceName: string, latencyMs?: number): void {
    const health = this.getOrCreate(sourceName);
    health.status = 'healthy';
    health.lastSuccessTime = Date.now();
    health.consecutiveErrors = 0;
    health.totalRequests++;
    if (latencyMs !== undefined) {
      health.lastLatencyMs = latencyMs;
    }
  }

  recordError(sourceName: string, error: any): void {
    const health = this.getOrCreate(sourceName);
    health.lastErrorTime = Date.now();
    health.consecutiveErrors++;
    health.totalErrors++;
    health.totalRequests++;
    health.lastErrorMessage = error?.message || String(error);

    // 3 veya daha fazla ardışık hata -> "down" durumu
    if (health.consecutiveErrors >= 3) {
      health.status = 'down';
    } else {
      health.status = 'degraded';
    }
  }

  recordSkipped(sourceName: string, reason: string): void {
    const health = this.getOrCreate(sourceName);
    health.totalRequests++;
    // Rate limit nedeniyle atlandıysa degraded durumunu koru ama down yapma
    if (reason === 'rate_limit') {
      health.status = 'degraded';
    }
  }

  getSourceHealth(sourceName: string): SourceHealth | undefined {
    return this.sources.get(sourceName);
  }

  getAllSourcesHealth(): SourceHealth[] {
    return Array.from(this.sources.values());
  }

  /**
   * Tüm birincil veri kaynakları (Yahoo Finance, KAP, Reddit) aynı anda çökerse true döner
   */
  isAllSourcesDown(): boolean {
    const primarySources = ['yahoo_finance', 'kap', 'reddit'];
    const activePrimary = primarySources.filter((s) => {
      const h = this.sources.get(s);
      return h && h.status !== 'down';
    });
    return activePrimary.length === 0;
  }

  getDegradedOrDownSources(): SourceHealth[] {
    return Array.from(this.sources.values()).filter((s) => s.status !== 'healthy');
  }

  getSystemSummary(): {
    overallStatus: 'OPERATIONAL' | 'DEGRADED' | 'CRITICAL';
    allSourcesDown: boolean;
    healthyCount: number;
    totalCount: number;
    sources: SourceHealth[];
  } {
    const all = this.getAllSourcesHealth();
    const healthyCount = all.filter((s) => s.status === 'healthy').length;
    const allDown = this.isAllSourcesDown();

    let overallStatus: 'OPERATIONAL' | 'DEGRADED' | 'CRITICAL' = 'OPERATIONAL';
    if (allDown) {
      overallStatus = 'CRITICAL';
    } else if (healthyCount < all.length) {
      overallStatus = 'DEGRADED';
    }

    return {
      overallStatus,
      allSourcesDown: allDown,
      healthyCount,
      totalCount: all.length,
      sources: all,
    };
  }

  private getOrCreate(sourceName: string): SourceHealth {
    if (!this.sources.has(sourceName)) {
      this.sources.set(sourceName, {
        sourceName,
        displayName: sourceName.toUpperCase(),
        status: 'healthy',
        lastSuccessTime: Date.now(),
        lastErrorTime: null,
        consecutiveErrors: 0,
        totalRequests: 0,
        totalErrors: 0,
      });
    }
    return this.sources.get(sourceName)!;
  }
}

export const healthMonitor = new HealthMonitor();
