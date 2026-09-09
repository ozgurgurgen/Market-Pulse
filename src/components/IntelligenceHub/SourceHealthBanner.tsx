import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, RefreshCw, Cpu, Server, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { safeFetchJson } from '../../utils/apiClient';

interface SourceHealth {
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

interface HealthSummary {
  overallStatus: 'OPERATIONAL' | 'DEGRADED' | 'CRITICAL';
  allSourcesDown: boolean;
  healthyCount: number;
  totalCount: number;
  sources: SourceHealth[];
}

export const SourceHealthBanner: React.FC = () => {
  const [health, setHealth] = useState<HealthSummary | null>(null);
  const [rateLimits, setRateLimits] = useState<any[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchHealthData = async () => {
    try {
      setIsLoading(true);
      const [hRes, rRes] = await Promise.all([
        safeFetchJson<HealthSummary>('/api/intelligence/health'),
        safeFetchJson<{ limits: any[] }>('/api/intelligence/rate-limits'),
      ]);

      if (hRes.data) setHealth(hRes.data);
      if (rRes.data?.limits) setRateLimits(rRes.data.limits);
    } catch (e) {
      console.warn('Failed to fetch source health:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
    const interval = setInterval(fetchHealthData, 30000); // 30 sn'de bir güncelle
    return () => clearInterval(interval);
  }, []);

  if (!health) return null;

  const isCritical = health.allSourcesDown || health.overallStatus === 'CRITICAL';
  const isDegraded = health.overallStatus === 'DEGRADED';

  return (
    <div className="w-full space-y-2">
      {/* 1. Kritik Hata Bannerı (Tüm kaynaklar kapalıysa) */}
      {isCritical && (
        <div className="bg-rose-950/80 border border-rose-500/50 rounded-xl p-4 text-rose-200 flex items-start gap-3 shadow-lg animate-pulse">
          <AlertOctagon className="text-rose-400 shrink-0 mt-0.5" size={20} />
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-rose-100 text-sm">Veri Kaynakları Şu Anda Kullanılamıyor</h4>
            <p>
              Dış haber ve sosyal medya API bağlantılarında kesinti yaşanmaktadır. Sistem yerel güvenlik kipi ve son önbellek verileriyle hizmet vermektedir.
            </p>
          </div>
        </div>
      )}

      {/* 2. Kompakt Sağlık ve API Limit Çubuğu */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-300">
            {isCritical ? (
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            ) : isDegraded ? (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            )}
            <span>Veri Altyapısı:</span>
            <span
              className={`font-mono font-bold uppercase px-2 py-0.5 rounded text-[11px] ${
                isCritical
                  ? 'bg-rose-900/50 text-rose-300 border border-rose-700/50'
                  : isDegraded
                  ? 'bg-amber-900/50 text-amber-300 border border-amber-700/50'
                  : 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50'
              }`}
            >
              {isCritical ? 'KESİNTİ / FALLBACK' : isDegraded ? 'KADEMELİ AKTİF (FALLBACK DEVREDE)' : 'TÜM KAYNAKLAR ÇALIŞIYOR'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-400 border-l border-slate-800 pl-3">
            <Cpu size={14} className="text-cyan-400" />
            <span>SignalEngine v2:</span>
            <span className="text-cyan-300 font-bold">Aktif & Senkron</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-slate-400 border-l border-slate-800 pl-3">
            <Server size={14} className="text-indigo-400" />
            <span>Kademeli Scheduler:</span>
            <span className="text-slate-300">5 / 10 / 15 dk (92 istek/saat)</span>
          </div>
        </div>

        {/* Sağ Taraf: Detay Açma / Kapatma ve Yenileme Butonları */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700/60 transition-colors"
          >
            <Activity size={12} className="text-indigo-400" />
            <span>Kaynak Detayları & Rate Limitler</span>
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <button
            onClick={fetchHealthData}
            disabled={isLoading}
            className="p-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Sağlık durumunu yenile"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin text-cyan-400' : ''} />
          </button>
        </div>
      </div>

      {/* 3. Genişletilmiş Kaynak Sağlık & Rate Limit Matrisi */}
      {isExpanded && (
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3 text-xs animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h5 className="font-bold text-slate-200 flex items-center gap-2">
              <Server size={14} className="text-indigo-400" />
              API Kaynak Matrisi, Rate Limit Kotası ve Fallback Rotaları
            </h5>
            <span className="text-[11px] text-slate-400">
              {health.healthyCount}/{health.totalCount} Servis Aktif
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {health.sources.map((src) => {
              const limitConfig = rateLimits.find((r) => r.sourceName === src.sourceName);
              const remaining = limitConfig
                ? Math.max(0, limitConfig.maxRequestsPerHour - limitConfig.currentRequests)
                : null;

              return (
                <div
                  key={src.sourceName}
                  className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-2.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-300 truncate" title={src.displayName}>
                      {src.displayName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        src.status === 'healthy'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                          : src.status === 'degraded'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800/50'
                          : 'bg-rose-950 text-rose-400 border border-rose-800/50'
                      }`}
                    >
                      {src.status === 'healthy' ? 'AKTİF' : src.status === 'degraded' ? 'FALLBACK' : 'DOWN'}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 space-y-0.5">
                    {limitConfig && (
                      <div className="flex justify-between">
                        <span>Saatlik Kota:</span>
                        <span className="font-mono text-slate-200">
                          {remaining}/{limitConfig.maxRequestsPerHour}
                        </span>
                      </div>
                    )}
                    {src.lastLatencyMs !== undefined && (
                      <div className="flex justify-between">
                        <span>Son Gecikme:</span>
                        <span className="font-mono text-slate-300">{src.lastLatencyMs}ms</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>İstek / Hata:</span>
                      <span className="font-mono text-slate-300">
                        {src.totalRequests} / <span className={src.totalErrors > 0 ? 'text-rose-400' : 'text-slate-400'}>{src.totalErrors}</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
            <span>
              ℹ️ Foreks ve Bloomberg HT için kurumsal anahtar girilmediğinde sistem otomatik olarak <b>Yahoo Finance & KAP</b> haber omurgasına yönlenir.
            </span>
            <span className="text-slate-400 font-mono">
              Önbellek (In-Memory / Redis): 5 Dk TTL
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
