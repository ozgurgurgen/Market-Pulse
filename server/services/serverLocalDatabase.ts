/**
 * Sunucu Tarafı Yerel Veritabanı Servisi (Server-Side Local Embedded Database)
 * 
 * Tarayıcıyı (Client Browser) ASLA şişirmez, DOM veya tarayıcı belleğini yavaşlatmaz.
 * Tüm sinyaller, fiyat geçmişleri ve loglar sunucu tarafında (Backend Node/Express)
 * yüksek performanslı JSON/File/Memory KV motorunda saklanır ve istemciye sadece
 * anlık ihtiyaç duyulan filtrelenmiş veriler (sayfalama ile) aktarılır.
 */

import fs from 'fs';
import path from 'path';
import { INITIAL_DEFAULT_OPPORTUNITIES } from '../../src/data/defaultOpportunitiesData';
import { INITIAL_DEFAULT_QUOTES } from '../../src/data/defaultQuotesData';

interface ServerDbRecord {
  id: string;
  collection: string;
  data: any;
  createdAt: number;
  updatedAt: number;
}

class ServerLocalDatabaseService {
  private dataDir: string;
  private memoryCache: Map<string, Map<string, any>> = new Map();
  private isInitialized = false;

  constructor() {
    this.dataDir = path.join(process.cwd(), 'server', 'data', 'local_db');
  }

  public init() {
    if (this.isInitialized) return;
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      this.isInitialized = true;
      
      // Flush pending debounced writes on exit
      process.on('beforeExit', () => this.flushAll());
      process.on('SIGINT', () => {
        this.flushAll();
      });
      process.on('SIGTERM', () => {
        this.flushAll();
      });

      console.log('✅ [ServerLocalDB] Sunucu tarafı yerel veritabanı motoru başlatıldı:', this.dataDir);
      this.seedInitialDataIfEmpty();
    } catch (err) {
      console.error('❌ [ServerLocalDB] Dizin oluşturulamadı:', err);
    }
  }

  private seedInitialDataIfEmpty() {
    try {
      // 1. ai_opportunities
      const existingOpps = this.getAll('ai_opportunities');
      if (!existingOpps || existingOpps.length === 0) {
        for (const opp of INITIAL_DEFAULT_OPPORTUNITIES) {
          this.set('ai_opportunities', opp.id, opp);
        }
        console.log(`[ServerLocalDB] Seeded ${INITIAL_DEFAULT_OPPORTUNITIES.length} default opportunities.`);
      }

      // 2. market_quotes
      const existingQuotes = this.getAll('market_quotes');
      if (!existingQuotes || existingQuotes.length < 10) {
        for (const q of INITIAL_DEFAULT_QUOTES) {
          this.set('market_quotes', q.symbol, q);
        }
        console.log(`[ServerLocalDB] Seeded ${INITIAL_DEFAULT_QUOTES.length} default market quotes.`);
      }
    } catch (err) {
      console.warn('[ServerLocalDB] Seed notice:', err);
    }
  }

  private getCollectionPath(collection: string): string {
    return path.join(this.dataDir, `${collection}.json`);
  }

  // Maximum items allowed per collection to prevent disk & memory bloat
  private static readonly COLLECTION_LIMITS: Record<string, number> = {
    data_integrity_audit: 300,
    auditLogs: 300,
    errorLogs: 300,
    analyticsSnapshots: 100,
  };
  private static readonly DEFAULT_MAX_ITEMS = 2000;

  private loadCollection(collection: string): Map<string, any> {
    if (this.memoryCache.has(collection)) {
      return this.memoryCache.get(collection)!;
    }

    const colMap = new Map<string, any>();
    const filePath = this.getCollectionPath(collection);

    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const trimmed = raw.trim();
        if (trimmed) {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) {
            for (const item of parsed) {
              const key = item.id || item.symbol || item.ticker || String(Date.now());
              colMap.set(key, item);
            }
          } else if (typeof parsed === 'object' && parsed !== null) {
            for (const [k, v] of Object.entries(parsed)) {
              colMap.set(k, v);
            }
          }
        }
      }
    } catch (e: any) {
      console.warn(`[ServerLocalDB] ${collection} okunamadı veya bozuk, yedeklenip sıfırdan oluşturuluyor:`, e?.message || e);
      // Backup corrupted file to prevent recurring parse failures
      try {
        if (fs.existsSync(filePath)) {
          const corruptBackup = `${filePath}.corrupted.${Date.now()}`;
          fs.renameSync(filePath, corruptBackup);
          console.warn(`[ServerLocalDB] Bozuk dosya güvenle arşivlendi: ${corruptBackup}`);
        }
      } catch (backupErr) {
        console.error(`[ServerLocalDB] Bozuk dosya taşınamadı:`, backupErr);
      }
      // Re-initialize clean empty file atomically
      try {
        const tempPath = `${filePath}.${Date.now()}.tmp`;
        fs.writeFileSync(tempPath, '{}', 'utf-8');
        fs.renameSync(tempPath, filePath);
      } catch {}
    }

    this.memoryCache.set(collection, colMap);
    return colMap;
  }

  private persistTimers: Map<string, NodeJS.Timeout> = new Map();

  private pruneCollectionIfNeeded(collection: string, colMap: Map<string, any>) {
    const limit = ServerLocalDatabaseService.COLLECTION_LIMITS[collection] || ServerLocalDatabaseService.DEFAULT_MAX_ITEMS;
    if (colMap.size > limit) {
      const excess = colMap.size - limit;
      let removed = 0;
      for (const key of colMap.keys()) {
        colMap.delete(key);
        removed++;
        if (removed >= excess) break;
      }
    }
  }

  private persistCollection(collection: string, immediate: boolean = false) {
    if (immediate) {
      const existingTimer = this.persistTimers.get(collection);
      if (existingTimer) {
        clearTimeout(existingTimer);
        this.persistTimers.delete(collection);
      }
      this.doPersist(collection);
      return;
    }

    if (this.persistTimers.has(collection)) {
      return;
    }

    const timer = setTimeout(() => {
      this.persistTimers.delete(collection);
      this.doPersist(collection);
    }, 300);

    this.persistTimers.set(collection, timer);
  }

  private doPersist(collection: string) {
    try {
      const colMap = this.memoryCache.get(collection);
      if (!colMap) return;

      this.pruneCollectionIfNeeded(collection, colMap);

      const filePath = this.getCollectionPath(collection);
      const dataObj: Record<string, any> = {};
      colMap.forEach((v, k) => {
        dataObj[k] = v;
      });

      // Atomic write via temporary file then rename
      const tempPath = `${filePath}.${process.pid}.${Date.now()}.${Math.random().toString(36).substring(2, 6)}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(dataObj, null, 2), 'utf-8');
      fs.renameSync(tempPath, filePath);
    } catch (e) {
      console.error(`[ServerLocalDB] ${collection} diske kaydedilirken hata:`, e);
    }
  }

  public flushAll(): void {
    for (const [collection, timer] of this.persistTimers.entries()) {
      clearTimeout(timer);
      this.persistTimers.delete(collection);
      this.doPersist(collection);
    }
  }

  public set(collection: string, key: string, data: any, immediate: boolean = false): void {
    this.init();
    const col = this.loadCollection(collection);
    col.set(key, {
      ...data,
      updatedAt: Date.now(),
    });
    this.pruneCollectionIfNeeded(collection, col);
    this.persistCollection(collection, immediate);
  }

  public upsert(collection: string, key: string, data: any, immediate: boolean = false): void {
    this.set(collection, key, data, immediate);
  }

  public get<T = any>(collection: string, key: string): T | null {
    this.init();
    const col = this.loadCollection(collection);
    return (col.get(key) as T) || null;
  }

  public getAll<T = any>(collection: string): T[] {
    this.init();
    const col = this.loadCollection(collection);
    return Array.from(col.values()) as T[];
  }

  public getCollectionDict<T = any>(collection: string): Record<string, T> {
    this.init();
    const col = this.loadCollection(collection);
    const dict: Record<string, T> = {};
    col.forEach((v, k) => {
      dict[k] = v;
    });
    return dict;
  }

  public list<T = any>(collection: string): { id: string; data: T }[] {
    this.init();
    const col = this.loadCollection(collection);
    const results: { id: string; data: T }[] = [];
    col.forEach((v, k) => {
      results.push({ id: k, data: v });
    });
    return results;
  }

  public delete(collection: string, key: string): boolean {
    this.init();
    const col = this.loadCollection(collection);
    const deleted = col.delete(key);
    if (deleted) {
      this.persistCollection(collection);
    }
    return deleted;
  }

  public clear(collection: string): void {
    this.init();
    const col = this.loadCollection(collection);
    col.clear();
    this.persistCollection(collection);
  }

  public getStats() {
    this.init();
    let totalSize = 0;
    let fileCount = 0;
    const collections: { name: string; records: number; sizeBytes: number }[] = [];

    try {
      if (fs.existsSync(this.dataDir)) {
        const files = fs.readdirSync(this.dataDir);
        for (const file of files) {
          if (file.endsWith('.json')) {
            const filePath = path.join(this.dataDir, file);
            const stats = fs.statSync(filePath);
            totalSize += stats.size;
            fileCount++;
            const colName = file.replace('.json', '');
            const col = this.loadCollection(colName);
            collections.push({
              name: colName,
              records: col.size,
              sizeBytes: stats.size,
            });
          }
        }
      }
    } catch (e) {
      console.error('[ServerLocalDB] Stats hesaplanamadı:', e);
    }

    return {
      type: 'Server-Side Embedded Storage (Node.js Engine)',
      location: 'Sunucu Diski (/server/data/local_db)',
      browserImpact: '0 MB (Tarayıcı RAM/DOM tüketimi YOK)',
      totalSizeBytes: totalSize,
      fileCount,
      collections,
      status: 'ACTIVE_SERVER_ENGINE',
    };
  }

  public clearCollection(collection: string): void {
    this.init();
    if (this.memoryCache.has(collection)) {
      this.memoryCache.get(collection)!.clear();
    }
    const filePath = this.getCollectionPath(collection);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {}
    }
  }
}

export const serverLocalDatabase = new ServerLocalDatabaseService();
