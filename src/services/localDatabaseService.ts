/**
 * Yerel Tarayıcı Veritabanı Servisi (IndexedDB + LocalStorage Fallback)
 * Varlık geçmişleri, yerel notlar ve offline önbellek için kullanılır.
 */

const DB_NAME = 'MarketPulse_LocalDB';
const DB_VERSION = 1;
const STORE_WATCHLIST = 'watchlist';
const STORE_INTELLIGENCE = 'intelligence_cache';
const STORE_BACKTESTS = 'saved_backtests';

class LocalDatabaseService {
  private db: IDBDatabase | null = null;
  private isSupported = typeof window !== 'undefined' && 'indexedDB' in window;

  async init(): Promise<boolean> {
    if (!this.isSupported) return false;

    return new Promise((resolve) => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event: any) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(STORE_WATCHLIST)) {
            db.createObjectStore(STORE_WATCHLIST, { keyPath: 'symbol' });
          }
          if (!db.objectStoreNames.contains(STORE_INTELLIGENCE)) {
            db.createObjectStore(STORE_INTELLIGENCE, { keyPath: 'ticker' });
          }
          if (!db.objectStoreNames.contains(STORE_BACKTESTS)) {
            db.createObjectStore(STORE_BACKTESTS, { keyPath: 'id', autoIncrement: true });
          }
        };

        request.onsuccess = (event: any) => {
          this.db = event.target.result;
          resolve(true);
        };

        request.onerror = () => {
          console.warn('IndexedDB başlatılamadı, LocalStorage fallback kullanılacak.');
          resolve(false);
        };
      } catch {
        resolve(false);
      }
    });
  }

  async getStorageStats(): Promise<{
    storageType: string;
    usedBytes: number;
    quotaBytes: number;
    itemCount: number;
    tables: string[];
  }> {
    let usedBytes = 0;
    let quotaBytes = 0;

    if (navigator.storage && navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        usedBytes = estimate.usage || 0;
        quotaBytes = estimate.quota || 0;
      } catch (e) {
        // Fallback calculation
      }
    }

    // LocalStorage boyutu
    let lsBytes = 0;
    try {
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          lsBytes += (localStorage[key].length + key.length) * 2;
        }
      }
    } catch {}

    return {
      storageType: this.isSupported ? 'IndexedDB + LocalStorage' : 'LocalStorage',
      usedBytes: usedBytes || lsBytes,
      quotaBytes: quotaBytes || 10 * 1024 * 1024, // 10MB default
      itemCount: localStorage.length,
      tables: ['watchlist', 'intelligence_cache', 'saved_backtests', 'app_config'],
    };
  }

  async clearAllLocalData(): Promise<void> {
    try {
      localStorage.clear();
      if (this.db) {
        const stores = [STORE_WATCHLIST, STORE_INTELLIGENCE, STORE_BACKTESTS];
        for (const storeName of stores) {
          const tx = this.db.transaction(storeName, 'readwrite');
          tx.objectStore(storeName).clear();
        }
      }
    } catch (e) {
      console.error('Local data temizlenirken hata oluştu:', e);
    }
  }
}

export const localDatabaseService = new LocalDatabaseService();
