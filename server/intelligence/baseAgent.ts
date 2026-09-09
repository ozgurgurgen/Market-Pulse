import { rateLimiter } from '../services/rateLimiter';
import { healthMonitor } from '../services/healthMonitor';

export abstract class BaseAgent {
  protected agentName: string;

  constructor(agentName: string) {
    this.agentName = agentName;
  }

  protected logInfo(message: string, ...args: any[]): void {
    console.log(`[${this.agentName}] ℹ️ ${message}`, ...args);
  }

  protected logWarn(message: string, ...args: any[]): void {
    console.warn(`[${this.agentName}] ⚠️ ${message}`, ...args);
  }

  protected logError(message: string, error: any): void {
    console.error(`[${this.agentName}] ❌ ${message}:`, error);
  }

  protected async executeWithRateLimit<T>(
    sourceName: string,
    action: () => Promise<T>,
    fallbackAction: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();
    const canMake = await rateLimiter.canMakeRequest(sourceName);

    if (!canMake) {
      this.logWarn(`Rate limit aşıldı veya backoff aktif (${sourceName}). Alternatif (fallback) kaynağa geçiliyor.`);
      healthMonitor.recordSkipped(sourceName, 'rate_limit');
      return fallbackAction();
    }

    try {
      const result = await action();
      healthMonitor.recordSuccess(sourceName, Date.now() - startTime);
      return result;
    } catch (err: any) {
      this.logError(`${sourceName} isteği başarısız`, err);
      healthMonitor.recordError(sourceName, err);

      // 429 veya benzeri kota hatası ise backoff başlat
      if (err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('rate limit')) {
        rateLimiter.triggerBackoff(sourceName);
      }

      return fallbackAction();
    }
  }
}
