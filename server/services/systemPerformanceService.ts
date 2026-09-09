import os from 'os';
import fs from 'fs';
import v8 from 'v8';
import { monitorEventLoopDelay } from 'perf_hooks';
import { Request, Response, NextFunction } from 'express';
import { getDatabaseIntegrationSettings, getPostgresClient } from './dbIntegrationService';
import { databaseFirstCacheService } from './databaseFirstCacheService';
import { safeAdminGet } from './firebaseAdminService';

interface CpuSnapshot {
  idle: number;
  total: number;
  timestamp: number;
}

interface EndpointMetric {
  path: string;
  method: string;
  totalCalls: number;
  totalDurationMs: number;
  avgDurationMs: number;
  maxDurationMs: number;
  lastCalledAt: string;
}

export interface SystemPerformanceTelemetry {
  timestamp: string;
  
  // 1. Host / PC Donanım Performansı
  host: {
    hostname: string;
    platform: string;
    osType: string;
    release: string;
    arch: string;
    uptimeSeconds: number;
    uptimeFormatted: string;
    cpu: {
      model: string;
      cores: number;
      speedMhz: number;
      usagePercent: number;
      loadAvg: [number, number, number]; // 1m, 5m, 15m
    };
    memory: {
      totalBytes: number;
      freeBytes: number;
      usedBytes: number;
      totalGb: number;
      freeGb: number;
      usedGb: number;
      usagePercent: number;
    };
    disk: {
      totalBytes: number;
      freeBytes: number;
      usedBytes: number;
      totalGb: number;
      freeGb: number;
      usedGb: number;
      usagePercent: number;
      isAvailable: boolean;
    };
    networkInterfaces: Array<{
      name: string;
      family: string;
      address: string;
      internal: boolean;
    }>;
  };

  // 2. Program / Node.js Uygulama Performansı
  app: {
    nodeVersion: string;
    v8Version: string;
    pid: number;
    uptimeSeconds: number;
    uptimeFormatted: string;
    startedAt: string;
    memory: {
      rssMb: number;
      heapTotalMb: number;
      heapUsedMb: number;
      heapLimitMb: number;
      heapUsedPercent: number;
      externalMb: number;
      arrayBuffersMb: number;
    };
    eventLoop: {
      meanLagMs: number;
      maxLagMs: number;
      minLagMs: number;
      p99LagMs: number;
    };
    handles: {
      activeHandlesCount: number;
      activeRequestsCount: number;
    };
    http: {
      totalRequests: number;
      activeRequests: number;
      currentRpm: number;
      avgLatencyMs: number;
      statusCodes: {
        success2xx: number;
        redirect3xx: number;
        clientError4xx: number;
        serverError5xx: number;
      };
      slowestEndpoints: EndpointMetric[];
    };
  };

  // 3. Veritabanı (DB) Performansı ve Envanteri
  database: {
    activeProvider: string;
    fallbackToFirestore: boolean;
    postgres: {
      configured: boolean;
      connected: boolean;
      latencyMs: number;
      version?: string;
      databaseName?: string;
      databaseSize?: string;
      cacheHitRatio?: number;
      activeConnections?: number;
      transactionsCommitted?: number;
      transactionsRolledBack?: number;
      deadlocks?: number;
      tablesCount?: number;
      tables: Array<{
        tableName: string;
        rowCount: number;
        totalSize: string;
        indexSize: string;
        totalBytes: number;
        seqScan?: number;
        idxScan?: number;
      }>;
      error?: string;
    };
    firestore: {
      configured: boolean;
      connected: boolean;
      latencyMs: number;
      error?: string;
    };
    dbCacheShield: {
      hitCount: number;
      missCount: number;
      savedApiCalls: number;
      hitRatio: string;
      cachedQuotesCount: number;
      cachedApiItemsCount: number;
      activeEngine: string;
    };
  };
}

class SystemPerformanceService {
  private lastCpuSnapshot: CpuSnapshot | null = null;
  private currentCpuPercent = 0;
  private loopHistogram = monitorEventLoopDelay({ resolution: 20 });
  private processStartedAt = new Date().toISOString();

  // HTTP Traffic metrics
  private totalRequests = 0;
  private activeRequests = 0;
  private totalLatencySum = 0;
  private status2xx = 0;
  private status3xx = 0;
  private status4xx = 0;
  private status5xx = 0;
  private requestTimestamps: number[] = [];
  private endpointStats: Map<string, EndpointMetric> = new Map();

  constructor() {
    this.loopHistogram.enable();
    this.takeCpuSnapshot();

    // CPU sampling every 3 seconds for smooth real-time tracking
    setInterval(() => {
      this.updateCpuUsage();
    }, 3000);

    // Clean up old request timestamps (older than 60s) every 10s
    setInterval(() => {
      const oneMinuteAgo = Date.now() - 60000;
      this.requestTimestamps = this.requestTimestamps.filter(t => t > oneMinuteAgo);
    }, 10000);
  }

  /**
   * Express HTTP Tracking Middleware
   */
  public httpMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Skip static asset files from heavy metrics tracking
    const path = req.path || '';
    if (path.startsWith('/@') || path.startsWith('/src/') || path.endsWith('.js') || path.endsWith('.css') || path.endsWith('.ico') || path.endsWith('.png') || path.endsWith('.svg')) {
      return next();
    }

    const start = Date.now();
    this.totalRequests++;
    this.activeRequests++;
    this.requestTimestamps.push(start);

    res.on('finish', () => {
      this.activeRequests = Math.max(0, this.activeRequests - 1);
      const duration = Date.now() - start;
      this.totalLatencySum += duration;

      const code = res.statusCode;
      if (code >= 200 && code < 300) this.status2xx++;
      else if (code >= 300 && code < 400) this.status3xx++;
      else if (code >= 400 && code < 500) this.status4xx++;
      else if (code >= 500) this.status5xx++;

      // Track endpoint performance
      const routeKey = `${req.method} ${this.normalizeRoute(path)}`;
      let stat = this.endpointStats.get(routeKey);
      if (!stat) {
        stat = {
          path: this.normalizeRoute(path),
          method: req.method,
          totalCalls: 0,
          totalDurationMs: 0,
          avgDurationMs: 0,
          maxDurationMs: 0,
          lastCalledAt: new Date().toISOString()
        };
        this.endpointStats.set(routeKey, stat);
      }

      stat.totalCalls++;
      stat.totalDurationMs += duration;
      stat.avgDurationMs = Math.round(stat.totalDurationMs / stat.totalCalls);
      if (duration > stat.maxDurationMs) {
        stat.maxDurationMs = duration;
      }
      stat.lastCalledAt = new Date().toISOString();
    });

    next();
  };

  private normalizeRoute(path: string): string {
    // Normalize dynamic paths like /api/stocks/THYAO/thesis to /api/stocks/:symbol/thesis
    return path
      .replace(/\/api\/stocks\/[A-Za-z0-9._-]+/g, '/api/stocks/:symbol')
      .replace(/\/api\/admin\/users\/[A-Za-z0-9._-]+/g, '/api/admin/users/:uid')
      .replace(/\/api\/ipo\/[A-Za-z0-9._-]+/g, '/api/ipo/:id');
  }

  private takeCpuSnapshot(): CpuSnapshot {
    const cpus = os.cpus();
    let idle = 0;
    let total = 0;
    for (const cpu of cpus) {
      for (const type in cpu.times) {
        total += (cpu.times as any)[type];
      }
      idle += cpu.times.idle;
    }
    const snap: CpuSnapshot = { idle, total, timestamp: Date.now() };
    this.lastCpuSnapshot = snap;
    return snap;
  }

  private updateCpuUsage() {
    const prev = this.lastCpuSnapshot;
    const current = this.takeCpuSnapshot();

    if (!prev) return;

    const idleDiff = current.idle - prev.idle;
    const totalDiff = current.total - prev.total;

    if (totalDiff > 0) {
      const percent = (1 - idleDiff / totalDiff) * 100;
      this.currentCpuPercent = Math.max(0, Math.min(100, Math.round(percent * 10) / 10));
    }
  }

  private formatDuration(seconds: number): string {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const parts: string[] = [];
    if (d > 0) parts.push(`${d}g`);
    if (h > 0 || d > 0) parts.push(`${h}s`);
    if (m > 0 || h > 0 || d > 0) parts.push(`${m}dk`);
    parts.push(`${s}sn`);
    return parts.join(' ');
  }

  /**
   * Toplu sistem, donanım, uygulama ve veritabanı performans telemetrisini derler
   */
  public async getCompleteTelemetry(): Promise<SystemPerformanceTelemetry> {
    // 1. Host Donanım
    const cpus = os.cpus();
    const primaryCpu = cpus[0] || { model: 'Generic CPU', speed: 2400 };
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const hostUptime = os.uptime();
    const loadAvg = os.loadavg() as [number, number, number];

    // Disk
    let diskStats = {
      totalBytes: 0,
      freeBytes: 0,
      usedBytes: 0,
      totalGb: 0,
      freeGb: 0,
      usedGb: 0,
      usagePercent: 0,
      isAvailable: false
    };

    try {
      if (typeof fs.statfsSync === 'function') {
        const rootFs = fs.statfsSync('/');
        const total = rootFs.blocks * rootFs.bsize;
        const free = rootFs.bfree * rootFs.bsize;
        const avail = rootFs.bavail * rootFs.bsize;
        const used = total - free;
        diskStats = {
          totalBytes: total,
          freeBytes: avail,
          usedBytes: used,
          totalGb: Math.round((total / 1e9) * 10) / 10,
          freeGb: Math.round((avail / 1e9) * 10) / 10,
          usedGb: Math.round((used / 1e9) * 10) / 10,
          usagePercent: total > 0 ? Math.round((used / total) * 100) : 0,
          isAvailable: true
        };
      }
    } catch (diskErr) {
      console.warn('[SystemPerformanceService] statfs error:', diskErr);
    }

    // Network Interfaces
    const netInterfacesRaw = os.networkInterfaces();
    const networkInterfaces: Array<{ name: string; family: string; address: string; internal: boolean }> = [];
    for (const [name, list] of Object.entries(netInterfacesRaw)) {
      if (list) {
        for (const item of list) {
          networkInterfaces.push({
            name,
            family: item.family,
            address: item.address,
            internal: item.internal
          });
        }
      }
    }

    // 2. Program / Node.js Runtime
    const memUsage = process.memoryUsage();
    const heapStats = v8.getHeapStatistics();
    const processUptime = process.uptime();
    const avgLatency = this.totalRequests > 0 
      ? Math.round(this.totalLatencySum / this.totalRequests) 
      : 0;

    // RPM (son 60 saniyedeki istek sayısı)
    const oneMinuteAgo = Date.now() - 60000;
    const currentRpm = this.requestTimestamps.filter(t => t > oneMinuteAgo).length;

    // En yavaş 8 endpoint
    const sortedEndpoints = Array.from(this.endpointStats.values())
      .sort((a, b) => b.avgDurationMs - a.avgDurationMs)
      .slice(0, 8);

    // Active handles & requests
    const activeHandlesCount = (process as any)._getActiveHandles ? (process as any)._getActiveHandles().length : 0;
    const activeRequestsCount = (process as any)._getActiveRequests ? (process as any)._getActiveRequests().length : 0;

    // 3. Veritabanı Telemetrisi
    const dbSettings = await getDatabaseIntegrationSettings();
    let pgStats: any = {
      configured: Boolean(dbSettings.postgres.connectionUrl || dbSettings.postgres.host),
      connected: false,
      latencyMs: 0,
      tables: []
    };

    if (pgStats.configured) {
      const pgStart = Date.now();
      let pgClient: any = null;
      try {
        pgClient = await getPostgresClient();
        const pingDuration = Math.max(1, Date.now() - pgStart);
        pgStats.connected = true;
        pgStats.latencyMs = pingDuration;

        // DB genel özellikleri
        const [verRes, sizeRes, statsRes, tablesRes] = await Promise.all([
          pgClient.query('SELECT version(), current_database() as db;'),
          pgClient.query('SELECT pg_size_pretty(pg_database_size(current_database())) as db_size;'),
          pgClient.query(`
            SELECT 
              numbackends,
              xact_commit,
              xact_rollback,
              blks_read,
              blks_hit,
              deadlocks
            FROM pg_stat_database 
            WHERE datname = current_database();
          `),
          pgClient.query(`
            SELECT 
              relname as table_name,
              n_live_tup as row_count,
              pg_size_pretty(pg_total_relation_size(relid)) as total_size,
              pg_size_pretty(pg_indexes_size(relid)) as index_size,
              pg_total_relation_size(relid) as total_bytes,
              seq_scan,
              idx_scan
            FROM pg_stat_user_tables
            ORDER BY pg_total_relation_size(relid) DESC
            LIMIT 15;
          `)
        ]);

        pgStats.version = verRes.rows[0]?.version || 'PostgreSQL';
        pgStats.databaseName = verRes.rows[0]?.db || dbSettings.postgres.database;
        pgStats.databaseSize = sizeRes.rows[0]?.db_size || '—';

        if (statsRes.rows[0]) {
          const row = statsRes.rows[0];
          pgStats.activeConnections = Number(row.numbackends) || 0;
          pgStats.transactionsCommitted = Number(row.xact_commit) || 0;
          pgStats.transactionsRolledBack = Number(row.xact_rollback) || 0;
          pgStats.deadlocks = Number(row.deadlocks) || 0;

          const blksHit = Number(row.blks_hit) || 0;
          const blksRead = Number(row.blks_read) || 0;
          const totalBlks = blksHit + blksRead;
          pgStats.cacheHitRatio = totalBlks > 0 ? Math.round((blksHit / totalBlks) * 1000) / 10 : 100;
        }

        pgStats.tablesCount = tablesRes.rows.length;
        pgStats.tables = tablesRes.rows.map((r: any) => ({
          tableName: r.table_name,
          rowCount: Number(r.row_count) || 0,
          totalSize: r.total_size,
          indexSize: r.index_size,
          totalBytes: Number(r.total_bytes) || 0,
          seqScan: Number(r.seq_scan) || 0,
          idxScan: Number(r.idx_scan) || 0
        }));
      } catch (err: any) {
        pgStats.connected = false;
        pgStats.error = err.message;
      } finally {
        if (pgClient) {
          try {
            await pgClient.end();
          } catch {}
        }
      }
    }

    // Firestore durumu
    let firestoreStats = {
      configured: true,
      connected: false,
      latencyMs: 0,
      error: undefined as string | undefined
    };
    try {
      const fsStart = Date.now();
      await safeAdminGet(db => db.collection('adminConfig').doc('databaseIntegration').get());
      firestoreStats.connected = true;
      firestoreStats.latencyMs = Math.max(1, Date.now() - fsStart);
    } catch (fsErr: any) {
      firestoreStats.connected = false;
      firestoreStats.error = fsErr.message;
    }

    // DB Cache Shield metrikleri
    let cacheMetrics = {
      hitCount: 0,
      missCount: 0,
      savedApiCalls: 0,
      hitRatio: '100%',
      cachedQuotesCount: 0,
      cachedApiItemsCount: 0,
      activeEngine: 'Memory / PG'
    };
    try {
      const m = await databaseFirstCacheService.getMetrics();
      cacheMetrics = {
        hitCount: m.totalHits,
        missCount: m.totalMisses,
        savedApiCalls: m.totalHits,
        hitRatio: `${m.savingsRatioPercent}%`,
        cachedQuotesCount: m.totalCachedQuotes,
        cachedApiItemsCount: m.totalCachedApiKeys,
        activeEngine: m.activeStorage
      };
    } catch {}

    return {
      timestamp: new Date().toISOString(),
      host: {
        hostname: os.hostname(),
        platform: os.platform(),
        osType: os.type(),
        release: os.release(),
        arch: os.arch(),
        uptimeSeconds: Math.floor(hostUptime),
        uptimeFormatted: this.formatDuration(hostUptime),
        cpu: {
          model: primaryCpu.model,
          cores: cpus.length,
          speedMhz: primaryCpu.speed,
          usagePercent: this.currentCpuPercent,
          loadAvg
        },
        memory: {
          totalBytes: totalMem,
          freeBytes: freeMem,
          usedBytes: usedMem,
          totalGb: Math.round((totalMem / (1024 * 1024 * 1024)) * 10) / 10,
          freeGb: Math.round((freeMem / (1024 * 1024 * 1024)) * 10) / 10,
          usedGb: Math.round((usedMem / (1024 * 1024 * 1024)) * 10) / 10,
          usagePercent: Math.round((usedMem / totalMem) * 100)
        },
        disk: diskStats,
        networkInterfaces
      },
      app: {
        nodeVersion: process.version,
        v8Version: process.versions.v8,
        pid: process.pid,
        uptimeSeconds: Math.floor(processUptime),
        uptimeFormatted: this.formatDuration(processUptime),
        startedAt: this.processStartedAt,
        memory: {
          rssMb: Math.round(memUsage.rss / (1024 * 1024)),
          heapTotalMb: Math.round(memUsage.heapTotal / (1024 * 1024)),
          heapUsedMb: Math.round(memUsage.heapUsed / (1024 * 1024)),
          heapLimitMb: Math.round(heapStats.heap_size_limit / (1024 * 1024)),
          heapUsedPercent: Math.round((memUsage.heapUsed / heapStats.heap_size_limit) * 100),
          externalMb: Math.round(memUsage.external / (1024 * 1024)),
          arrayBuffersMb: Math.round((memUsage.arrayBuffers || 0) / (1024 * 1024))
        },
        eventLoop: {
          meanLagMs: Math.round((this.loopHistogram.mean / 1e6) * 100) / 100,
          maxLagMs: Math.round((this.loopHistogram.max / 1e6) * 100) / 100,
          minLagMs: Math.round((this.loopHistogram.min / 1e6) * 100) / 100,
          p99LagMs: Math.round((this.loopHistogram.percentile(99) / 1e6) * 100) / 100
        },
        handles: {
          activeHandlesCount,
          activeRequestsCount
        },
        http: {
          totalRequests: this.totalRequests,
          activeRequests: this.activeRequests,
          currentRpm,
          avgLatencyMs: avgLatency,
          statusCodes: {
            success2xx: this.status2xx,
            redirect3xx: this.status3xx,
            clientError4xx: this.status4xx,
            serverError5xx: this.status5xx
          },
          slowestEndpoints: sortedEndpoints
        }
      },
      database: {
        activeProvider: dbSettings.activeProvider,
        fallbackToFirestore: dbSettings.fallbackToFirestore,
        postgres: pgStats,
        firestore: firestoreStats,
        dbCacheShield: cacheMetrics
      }
    };
  }
}

export const systemPerformanceService = new SystemPerformanceService();
