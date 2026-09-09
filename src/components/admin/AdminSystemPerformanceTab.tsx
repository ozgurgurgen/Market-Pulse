import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Cpu,
  Database,
  HardDrive,
  Server,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Wifi,
  ShieldCheck,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Sliders,
  Terminal,
  Play,
  Pause,
  Trash2,
  Info
} from 'lucide-react';
import { safeFetchJson } from '../../utils/apiClient';

interface SystemPerformanceTelemetry {
  timestamp: string;
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
      loadAvg: [number, number, number];
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
      slowestEndpoints: Array<{
        path: string;
        method: string;
        totalCalls: number;
        totalDurationMs: number;
        avgDurationMs: number;
        maxDurationMs: number;
        lastCalledAt: string;
      }>;
    };
  };
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

export const AdminSystemPerformanceTab: React.FC = () => {
  const [telemetry, setTelemetry] = useState<SystemPerformanceTelemetry | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(5); // 0 = paused, 3, 5, 10
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [gcLoading, setGcLoading] = useState<boolean>(false);
  const [activeSubView, setActiveSubView] = useState<'all' | 'host' | 'app' | 'database'>('all');

  const timerRef = useRef<any>(null);

  const fetchTelemetry = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await safeFetchJson<{ success: boolean; telemetry: SystemPerformanceTelemetry }>(
        '/api/admin/system-performance'
      );
      if (res.ok && res.data?.telemetry) {
        setTelemetry(res.data.telemetry);
        setLastUpdated(new Date());
        setError(null);
      } else {
        setError(res.error || 'Performans telemetrisi alınamadı.');
      }
    } catch (err: any) {
      setError(err.message || 'Bağlantı hatası.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (autoRefreshInterval > 0) {
      timerRef.current = setInterval(() => {
        fetchTelemetry(true);
      }, autoRefreshInterval * 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoRefreshInterval]);

  const handleTriggerGc = async () => {
    setGcLoading(true);
    setActionMessage(null);
    try {
      const res = await safeFetchJson<{
        success: boolean;
        message: string;
        beforeHeapUsedMb: number;
        afterHeapUsedMb: number;
      }>('/api/admin/system-performance/gc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok && res.data?.success) {
        setActionMessage({
          type: 'success',
          text: `${res.data.message} (${res.data.beforeHeapUsedMb} MB → ${res.data.afterHeapUsedMb} MB)`
        });
        fetchTelemetry(true);
      } else {
        setActionMessage({
          type: 'error',
          text: res.error || 'Bellek temizliği tamamlanamadı.'
        });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message });
    } finally {
      setGcLoading(false);
    }
  };

  const getCpuColor = (percent: number) => {
    if (percent >= 85) return 'text-rose-400 bg-rose-500/20 border-rose-500/40';
    if (percent >= 60) return 'text-amber-400 bg-amber-500/20 border-amber-500/40';
    return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40';
  };

  const getCpuBarColor = (percent: number) => {
    if (percent >= 85) return 'bg-rose-500';
    if (percent >= 60) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getLagBadge = (lagMs: number) => {
    if (lagMs > 100) {
      return { text: 'Yoğun / Yüksek', color: 'text-rose-400 bg-rose-500/15 border-rose-500/30' };
    }
    if (lagMs > 50) {
      return { text: 'Orta', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' };
    }
    return { text: 'Mükemmel (<50ms)', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' };
  };

  if (loading && !telemetry) {
    return (
      <div className="p-12 flex flex-col items-center justify-center space-y-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <RefreshCw size={36} className="text-indigo-400 animate-spin" />
        <div className="text-center">
          <h3 className="text-base font-bold text-white">Sistem & DB Performans Telemetrisi Toplanıyor</h3>
          <p className="text-xs text-slate-400 mt-1">
            Host işlemci, bellek, disk, Node.js V8 heap ve PostgreSQL sayaçları okunuyor...
          </p>
        </div>
      </div>
    );
  }

  if (error && !telemetry) {
    return (
      <div className="p-8 bg-rose-950/40 border border-rose-800/80 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-rose-400 font-bold">
          <AlertTriangle size={20} />
          <span>Telemetri Verisi Alınamadı</span>
        </div>
        <p className="text-xs text-slate-300">{error}</p>
        <button
          onClick={() => fetchTelemetry()}
          className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl cursor-pointer"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  const { host, app, database } = telemetry!;
  const lagInfo = getLagBadge(app.eventLoop.meanLagMs);

  return (
    <div id="admin-system-performance-view" className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Activity size={22} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                Sistem, Donanım & Veritabanı Performans İzleme Merkezi
                <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  CANLI İZLEME
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Host bilgisayar donanımı (CPU, RAM, Disk, Ağ), Node.js Runtime (V8 Heap, Event Loop, RPM) ve Veritabanı motoru gerçek zamanlı telemetrisi.
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Auto refresh dropdown */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
            <Clock size={13} className="text-indigo-400 mr-2" />
            <span className="text-[11px] text-slate-400 mr-2 font-medium">Yenileme:</span>
            <select
              value={autoRefreshInterval}
              onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
              className="bg-transparent text-white font-semibold text-xs focus:outline-none cursor-pointer"
            >
              <option value={3} className="bg-slate-900 text-white">3 saniyede bir</option>
              <option value={5} className="bg-slate-900 text-white">5 saniyede bir</option>
              <option value={10} className="bg-slate-900 text-white">10 saniyede bir</option>
              <option value={0} className="bg-slate-900 text-white">Duraklatıldı</option>
            </select>
          </div>

          <button
            id="perf-refresh-now-btn"
            onClick={() => fetchTelemetry()}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Yenile
          </button>

          <button
            id="perf-trigger-gc-btn"
            onClick={handleTriggerGc}
            disabled={gcLoading}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20"
            title="Node.js V8 bellek çöp toplayıcısını tetikler"
          >
            <Zap size={13} className={gcLoading ? 'animate-spin' : ''} />
            {gcLoading ? 'Temizleniyor...' : 'Bellek Optimize Et (GC)'}
          </button>
        </div>
      </div>

      {actionMessage && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
            actionMessage.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
              : 'bg-rose-950/60 border-rose-800 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? (
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle size={16} className="text-rose-400 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-slate-400 hover:text-white text-xs px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Sub-view switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubView('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubView === 'all'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          Tüm Metrikler
        </button>
        <button
          onClick={() => setActiveSubView('host')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubView === 'host'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Cpu size={14} />
          Host PC / Donanım
        </button>
        <button
          onClick={() => setActiveSubView('app')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubView === 'app'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Zap size={14} />
          Program (Node.js)
        </button>
        <button
          onClick={() => setActiveSubView('database')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubView === 'database'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Database size={14} />
          Veritabanı (DB)
        </button>

        {lastUpdated && (
          <span className="ml-auto text-[11px] text-slate-500 font-mono">
            Son güncelleme: {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Top 4 KPI Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Host PC CPU & RAM */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Çalıştığı PC (Host) CPU</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Cpu size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">{host.cpu.usagePercent}%</span>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getCpuColor(host.cpu.usagePercent)}`}>
              {host.cpu.cores} Çekirdek
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${getCpuBarColor(host.cpu.usagePercent)}`}
              style={{ width: `${Math.min(100, Math.max(2, host.cpu.usagePercent))}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex justify-between">
            <span>Load: {host.cpu.loadAvg.map(l => l.toFixed(2)).join(', ')}</span>
            <span className="text-slate-500">{host.platform} {host.arch}</span>
          </p>
        </div>

        {/* 2. Physical RAM */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Host Fiziksel RAM</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Server size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">{host.memory.usedGb} GB</span>
            <span className="text-xs text-slate-400 font-mono">/ {host.memory.totalGb} GB</span>
            <span className="text-[10px] font-bold text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
              %{host.memory.usagePercent}
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(2, host.memory.usagePercent))}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex justify-between">
            <span>Boş: {host.memory.freeGb} GB</span>
            <span className="text-slate-500">Uptime: {host.uptimeFormatted}</span>
          </p>
        </div>

        {/* 3. Program V8 Heap & Lag */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Node.js V8 Heap</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Zap size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-400 font-mono">{app.memory.heapUsedMb} MB</span>
            <span className="text-xs text-slate-400 font-mono">/ {app.memory.heapLimitMb} MB</span>
          </div>
          <div className="mt-2 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(2, app.memory.heapUsedPercent))}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex justify-between">
            <span>RSS: {app.memory.rssMb} MB</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${lagInfo.color}`}>
              Lag: {app.eventLoop.meanLagMs}ms
            </span>
          </p>
        </div>

        {/* 4. DB Health & Latency */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Veritabanı Motoru</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Database size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {database.postgres.connected ? `${database.postgres.latencyMs} ms` : 'Firestore'}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {database.postgres.connected ? 'PostgreSQL 16' : database.activeProvider}
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${database.postgres.cacheHitRatio || 100}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex justify-between">
            <span>Cache Hit: %{database.postgres.cacheHitRatio || 100}</span>
            <span className="text-slate-500">Boyut: {database.postgres.databaseSize || '8 MB'}</span>
          </p>
        </div>
      </div>

      {/* SECTION 1: HOST PC & HARDWARE */}
      {(activeSubView === 'all' || activeSubView === 'host') && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                <Cpu size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Çalıştığı PC / Sunucu (Host Machine & Donanım) Değerleri</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Uygulamanın çalıştığı ana makinenin fiziksel işlemci, bellek, depolama ve işletim sistemi değerleri.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
              Host: {host.hostname}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CPU Detailed Card */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Cpu size={14} className="text-blue-400" />
                  İşlemci (CPU) Mimarisi
                </span>
                <span className="text-[11px] font-mono text-blue-400">{host.arch}</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Model:</span>
                  <span className="text-slate-200 font-medium truncate max-w-[180px]">{host.cpu.model || 'Standart Sunucu CPU'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Mantıksal Çekirdek:</span>
                  <span className="text-slate-200 font-bold">{host.cpu.cores} vCPU</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Saat Hızı:</span>
                  <span className="text-slate-200 font-mono">{host.cpu.speedMhz ? `${host.cpu.speedMhz} MHz` : 'Dinamik / VM'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Yük Ortalaması (1/5/15 dk):</span>
                  <span className="text-slate-200 font-mono font-bold">{host.cpu.loadAvg.map(l => l.toFixed(2)).join(' • ')}</span>
                </div>
              </div>
            </div>

            {/* RAM Detailed Card */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Server size={14} className="text-indigo-400" />
                  Fiziksel RAM Dağılımı
                </span>
                <span className="text-[11px] font-mono text-indigo-400 font-bold">%{host.memory.usagePercent}</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Toplam Fiziksel RAM:</span>
                  <span className="text-slate-200 font-mono font-bold">{host.memory.totalGb} GB</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Kullanılan RAM:</span>
                  <span className="text-indigo-300 font-mono font-bold">{host.memory.usedGb} GB</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Boş / Kullanılabilir RAM:</span>
                  <span className="text-emerald-400 font-mono font-bold">{host.memory.freeGb} GB</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Host Çalışma Süresi:</span>
                  <span className="text-slate-200 font-medium">{host.uptimeFormatted}</span>
                </div>
              </div>
            </div>

            {/* Disk & Storage Card */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <HardDrive size={14} className="text-amber-400" />
                  Disk & Depolama Alanı (Root FS)
                </span>
                <span className="text-[11px] font-mono text-amber-400 font-bold">%{host.disk.usagePercent}</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Kök Disk Kapasitesi:</span>
                  <span className="text-slate-200 font-mono font-bold">{host.disk.totalGb} GB</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Kullanılan Alan:</span>
                  <span className="text-slate-200 font-mono">{host.disk.usedGb} GB</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Kullanılabilir Boş Alan:</span>
                  <span className="text-emerald-400 font-mono font-bold">{host.disk.freeGb} GB</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">İşletim Sistemi Çekirdeği:</span>
                  <span className="text-slate-200 font-mono text-[11px] truncate max-w-[150px]">{host.release}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Network Interfaces */}
          {host.networkInterfaces && host.networkInterfaces.length > 0 && (
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <Wifi size={14} className="text-cyan-400" />
                <span>Aktif Ağ Arayüzleri & IP Yapılandırması</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
                {host.networkInterfaces.map((net, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800/80 text-xs">
                    <span className="font-mono text-slate-400 font-semibold">{net.name}</span>
                    <span className="font-mono text-slate-200 text-[11px]">{net.address}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded ${net.internal ? 'bg-slate-800 text-slate-400' : 'bg-cyan-500/20 text-cyan-300'}`}>
                      {net.family} {net.internal ? 'local' : 'ext'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: PROGRAM (NODE.JS RUNTIME) PERFORMANCE */}
      {(activeSubView === 'all' || activeSubView === 'app') && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Zap size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Program (Node.js & Express Uygulama) Çalışma Performansı</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  V8 JavaScript motoru, Heap bellek tahsisi, Event Loop gecikmesi, HTTP istekleri ve gecikme metrikleri.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
              Node {app.nodeVersion} (V8 {app.v8Version}) • PID: {app.pid}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* V8 Memory Breakdown */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>V8 Heap & Bellek Ayak İzi</span>
                <span className="text-amber-400 font-mono">%{app.memory.heapUsedPercent}</span>
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">RSS (Fiziksel RAM):</span>
                  <span className="text-slate-200 font-mono font-bold">{app.memory.rssMb} MB</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Heap Used (Kullanılan Nesneler):</span>
                  <span className="text-amber-300 font-mono font-bold">{app.memory.heapUsedMb} MB</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Heap Total (Tahsis Edilen):</span>
                  <span className="text-slate-200 font-mono">{app.memory.heapTotalMb} MB</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">V8 Heap Limit (Üst Tavan):</span>
                  <span className="text-slate-300 font-mono">{app.memory.heapLimitMb} MB</span>
                </div>
              </div>
            </div>

            {/* Event Loop & Async Handles */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Event Loop Olay Döngüsü Gecikmesi</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${lagInfo.color}`}>
                  {lagInfo.text}
                </span>
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Ortalama Gecikme (Mean Lag):</span>
                  <span className="text-emerald-400 font-mono font-bold">{app.eventLoop.meanLagMs} ms</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">P99 Gecikme (En Yavaş %1):</span>
                  <span className="text-slate-200 font-mono">{app.eventLoop.p99LagMs} ms</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Maksimum Gecikme (Max):</span>
                  <span className="text-slate-200 font-mono">{app.eventLoop.maxLagMs} ms</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Aktif Handles / İstekler:</span>
                  <span className="text-slate-300 font-mono">{app.handles.activeHandlesCount} / {app.handles.activeRequestsCount}</span>
                </div>
              </div>
            </div>

            {/* HTTP Traffic & Throughput */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>HTTP Trafik & Yanıt Oranları</span>
                <span className="text-indigo-400 font-mono">{app.http.currentRpm} RPM</span>
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Toplam İşlenen İstek:</span>
                  <span className="text-slate-200 font-mono font-bold">{app.http.totalRequests}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Ortalama Yanıt Süresi:</span>
                  <span className="text-indigo-300 font-mono font-bold">{app.http.avgLatencyMs} ms</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Şu An İşlenen İstek:</span>
                  <span className="text-emerald-400 font-mono font-bold">{app.http.activeRequests}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Uygulama Uptime:</span>
                  <span className="text-slate-300 font-medium">{app.uptimeFormatted}</span>
                </div>
              </div>
            </div>
          </div>

          {/* HTTP Status Code Distribution */}
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 space-y-2">
            <span className="text-xs font-bold text-slate-300">HTTP Yanıt Durum Kodları Dağılımı</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-xl">
                <span className="text-[10px] text-emerald-400 font-bold">2xx Başarılı</span>
                <div className="text-lg font-black text-emerald-300 font-mono">{app.http.statusCodes.success2xx}</div>
              </div>
              <div className="p-3 bg-blue-950/20 border border-blue-800/40 rounded-xl">
                <span className="text-[10px] text-blue-400 font-bold">3xx Yönlendirme</span>
                <div className="text-lg font-black text-blue-300 font-mono">{app.http.statusCodes.redirect3xx}</div>
              </div>
              <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl">
                <span className="text-[10px] text-amber-400 font-bold">4xx İstemci Hatası</span>
                <div className="text-lg font-black text-amber-300 font-mono">{app.http.statusCodes.clientError4xx}</div>
              </div>
              <div className="p-3 bg-rose-950/20 border border-rose-800/40 rounded-xl">
                <span className="text-[10px] text-rose-400 font-bold">5xx Sunucu Hatası</span>
                <div className="text-lg font-black text-rose-300 font-mono">{app.http.statusCodes.serverError5xx}</div>
              </div>
            </div>
          </div>

          {/* Slowest Endpoints Table */}
          {app.http.slowestEndpoints && app.http.slowestEndpoints.length > 0 && (
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>En Yavaş API Uç Noktaları (Gecikme Takibi)</span>
                <span className="text-[11px] text-slate-500 font-normal">Sıralama: Ortalama Yanıt Süresi</span>
              </span>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                      <th className="py-2 pr-3">METOT</th>
                      <th className="py-2 pr-3">UÇ NOKTA (PATH)</th>
                      <th className="py-2 pr-3 text-right">ÇAĞRI</th>
                      <th className="py-2 pr-3 text-right">ORT. GECİKME</th>
                      <th className="py-2 pr-3 text-right">MAKS. GECİKME</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {app.http.slowestEndpoints.map((ep, i) => (
                      <tr key={i} className="hover:bg-slate-800/40 transition">
                        <td className="py-2 pr-3 font-bold text-indigo-400">{ep.method}</td>
                        <td className="py-2 pr-3 text-slate-200">{ep.path}</td>
                        <td className="py-2 pr-3 text-right text-slate-400">{ep.totalCalls}</td>
                        <td className={`py-2 pr-3 text-right font-bold ${ep.avgDurationMs > 500 ? 'text-rose-400' : ep.avgDurationMs > 200 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {ep.avgDurationMs} ms
                        </td>
                        <td className="py-2 pr-3 text-right text-slate-400">{ep.maxDurationMs} ms</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: DATABASE PERFORMANCE & INVENTORY */}
      {(activeSubView === 'all' || activeSubView === 'database') && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Database size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Veritabanı (DB) Performans ve Tüm Envanter Değerleri</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  PostgreSQL 16 motoru, Buffer Cache Hit oranı, canlı sorgu gecikmesi, tablo boyutları ve DB-First Cache Kalkanı.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${
                database.postgres.connected
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
              }`}>
                {database.postgres.connected ? '● PostgreSQL Bağlı' : '● Firestore / Local Mod'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* DB Engine Stats */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Sorgu Gecikmesi (Ping)</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {database.postgres.connected ? `${database.postgres.latencyMs} ms` : '—'}
              </div>
              <p className="text-[11px] text-slate-500">Doğrudan SQL SELECT 1 testi</p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Buffer Cache Hit</span>
              <div className="text-2xl font-black text-indigo-400 font-mono">
                %{database.postgres.cacheHitRatio ?? 100}
              </div>
              <p className="text-[11px] text-slate-500">pg_stat_database disk/ram</p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Veritabanı Boyutu</span>
              <div className="text-2xl font-black text-amber-400 font-mono">
                {database.postgres.databaseSize || '8.5 MB'}
              </div>
              <p className="text-[11px] text-slate-500">PostgreSQL `{database.postgres.databaseName || 'marketpulse'}`</p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Aktif İstemci Oturumu</span>
              <div className="text-2xl font-black text-cyan-400 font-mono">
                {database.postgres.activeConnections ?? 1}
              </div>
              <p className="text-[11px] text-slate-500">Postgres numbackends</p>
            </div>
          </div>

          {/* PostgreSQL Detailed Information Bar */}
          {database.postgres.version && (
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs space-y-1">
              <div className="text-slate-300 font-medium flex items-center justify-between">
                <span>Motor Sürümü:</span>
                <span className="text-[11px] text-slate-400 font-mono">{database.postgres.version}</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-slate-400 pt-1 border-t border-slate-800/60 font-mono text-[11px]">
                <span>Tamamlanan İşlemler: <strong className="text-slate-200">{database.postgres.transactionsCommitted ?? 0}</strong></span>
                <span>Geri Alınanlar (Rollback): <strong className="text-slate-200">{database.postgres.transactionsRolledBack ?? 0}</strong></span>
                <span>Deadlock (Kilitlenme): <strong className="text-emerald-400">{database.postgres.deadlocks ?? 0}</strong></span>
              </div>
            </div>
          )}

          {/* Live PostgreSQL Tables Inventory Table */}
          {database.postgres.tables && database.postgres.tables.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Layers size={14} className="text-indigo-400" />
                  PostgreSQL Tablo Envanteri ve Boyutları ({database.postgres.tables.length} Tablo)
                </h4>
                <span className="text-[11px] text-slate-400">pg_stat_user_tables canlı verisi</span>
              </div>

              <div className="overflow-x-auto bg-slate-950/50 border border-slate-800/80 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] bg-slate-950">
                      <th className="py-2.5 px-3">TABLO ADI</th>
                      <th className="py-2.5 px-3 text-right">TAHMİNİ SATIR SAYISI</th>
                      <th className="py-2.5 px-3 text-right">TOPLAM BOYUT</th>
                      <th className="py-2.5 px-3 text-right">İNDEKS BOYUTU</th>
                      <th className="py-2.5 px-3 text-right">İNDEKS TARAMASI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {database.postgres.tables.map((t, i) => (
                      <tr key={i} className="hover:bg-slate-800/30 transition">
                        <td className="py-2 px-3 font-bold text-slate-200">{t.tableName}</td>
                        <td className="py-2 px-3 text-right text-indigo-300 font-semibold">{t.rowCount.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-amber-300 font-bold">{t.totalSize}</td>
                        <td className="py-2 px-3 text-right text-slate-400">{t.indexSize}</td>
                        <td className="py-2 px-3 text-right text-emerald-400">{t.idxScan?.toLocaleString() ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DB-First Cache Shield Metrics */}
          <div className="p-4 bg-gradient-to-r from-slate-950 via-indigo-950/20 to-slate-950 border border-indigo-500/20 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                DB-First Kota Tasarruf Kalkanı Durumu
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                %{database.dbCacheShield.hitRatio} Tasarruf
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Kurtarılan API Çağrısı</span>
                <span className="text-base font-bold text-indigo-300 font-mono">{database.dbCacheShield.savedApiCalls}</span>
              </div>
              <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">DB Cache İsabet (Hit)</span>
                <span className="text-base font-bold text-emerald-400 font-mono">{database.dbCacheShield.hitCount}</span>
              </div>
              <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Önbellekteki Fiyatlar</span>
                <span className="text-base font-bold text-amber-400 font-mono">{database.dbCacheShield.cachedQuotesCount}</span>
              </div>
              <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Önbellek Motoru</span>
                <span className="text-xs font-bold text-slate-200 font-mono">{database.dbCacheShield.activeEngine}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
