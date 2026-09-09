import fs from 'fs';
import path from 'path';

/**
 * Genel Kalıcılık Katmanı Arayüzü
 * Stateless Cloud Run ortamlarında dosya veya veritabanı tabanlı depolamayı soyutlar.
 */
export interface PersistentStore<T> {
  load(): Promise<T[]>;
  append(item: T): Promise<void>;
  saveAll(items: T[]): Promise<void>;
}

/**
 * Dosya Tabanlı (JSON) Kalıcılık Uygulaması
 */
export class JsonFileStore<T> implements PersistentStore<T> {
  private filePath: string;
  private memoryCache: T[] | null = null;

  constructor(fileName: string, private initialData: T[] = []) {
    const dataDir = path.join(process.cwd(), 'server', 'data');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch {
        // Fallback for restricted file systems
      }
    }
    this.filePath = path.join(dataDir, fileName);
  }

  async load(): Promise<T[]> {
    if (this.memoryCache !== null) {
      return [...this.memoryCache];
    }

    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.memoryCache = parsed;
          return [...this.memoryCache];
        }
      }
    } catch {
      // Dosya okunamadıysa bellek içi varsayılanlara geç
    }

    this.memoryCache = [...this.initialData];
    return [...this.memoryCache];
  }

  async append(item: T): Promise<void> {
    const current = await this.load();
    current.unshift(item);
    if (current.length > 500) {
      current.pop();
    }
    this.memoryCache = current;

    try {
      fs.writeFileSync(this.filePath, JSON.stringify(current, null, 2), 'utf-8');
    } catch {
      // Stateless environment file write fallback
    }
  }

  async saveAll(items: T[]): Promise<void> {
    this.memoryCache = [...items];
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(items, null, 2), 'utf-8');
    } catch {
      // Fallback
    }
  }
}
