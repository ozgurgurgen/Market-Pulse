/**
 * GELİŞMİŞ ÖNBELLEK SERVİSİ (CacheService)
 * 
 * Redis uyumlu API arayüzü ile yüksek hızlı bellek içi (in-memory) depolama.
 * TTL bazlı zaman aşımı yönetimi ve otomatik bellek temizleme sunar.
 */

interface CacheEntry<T = any> {
  value: T;
  expiresAt: number;
  createdAt: number;
  hits: number;
}

export class CacheService {
  private store: Map<string, CacheEntry> = new Map();
  private cleanupInterval: any = null;
  private totalHits = 0;
  private totalMisses = 0;

  constructor() {
    // 60 saniyede bir zaman aşımına uğramış anahtarları temizle
    this.cleanupInterval = setInterval(() => {
      this.purgeExpired();
    }, 60000);
  }

  /**
   * Önbellekten değer okur. Süresi geçmişse null döner ve siler.
   */
  async get<T = any>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) {
      this.totalMisses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.totalMisses++;
      return null;
    }

    entry.hits++;
    this.totalHits++;
    return entry.value as T;
  }

  /**
   * Senkron okuma versiyonu
   */
  getSync<T = any>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry || Date.now() > entry.expiresAt) {
      if (entry) this.store.delete(key);
      this.totalMisses++;
      return null;
    }
    entry.hits++;
    this.totalHits++;
    return entry.value as T;
  }

  /**
   * Değeri belirtilen TTL (saniye) süresince önbelleğe yazar.
   */
  async set<T = any>(key: string, value: T, ttlSeconds: number = 300): Promise<void> {
    const now = Date.now();
    this.store.set(key, {
      value,
      expiresAt: now + ttlSeconds * 1000,
      createdAt: now,
      hits: 0,
    });
  }

  setSync<T = any>(key: string, value: T, ttlSeconds: number = 300): void {
    const now = Date.now();
    this.store.set(key, {
      value,
      expiresAt: now + ttlSeconds * 1000,
      createdAt: now,
      hits: 0,
    });
  }

  async has(key: string): Promise<boolean> {
    const entry = this.store.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return false;
    }
    return true;
  }

  async delete(key: string): Promise<boolean> {
    return this.store.delete(key);
  }

  /**
   * Önbellekteki tüm aktif İstihbarat Raporlarını döndürür (WebSocket ve toplu UI için).
   */
  async getAllIntelligenceData(): Promise<Record<string, any>> {
    const now = Date.now();
    const result: Record<string, any> = {};

    for (const [key, entry] of this.store.entries()) {
      if (key.startsWith('intelligence:') || key.startsWith('intel_')) {
        if (now <= entry.expiresAt) {
          const ticker = key.replace(/^(intelligence:|intel_)/, '');
          result[ticker] = entry.value;
        } else {
          this.store.delete(key);
        }
      }
    }

    return result;
  }

  getStats(): { totalKeys: number; hits: number; misses: number; hitRatio: string } {
    const total = this.totalHits + this.totalMisses;
    const ratio = total > 0 ? `${((this.totalHits / total) * 100).toFixed(1)}%` : '0%';
    return {
      totalKeys: this.store.size,
      hits: this.totalHits,
      misses: this.totalMisses,
      hitRatio: ratio,
    };
  }

  private purgeExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store.clear();
  }
}

export const cacheService = new CacheService();
