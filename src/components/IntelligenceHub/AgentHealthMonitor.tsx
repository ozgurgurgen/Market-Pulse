import React, { useState, useEffect, useCallback } from 'react';
import {
  Cpu,
  Activity,
  Terminal,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Zap,
  HardDrive,
  Layers,
  ChevronDown,
  ChevronUp,
  LineChart,
  PieChart,
  Landmark,
  ShieldCheck,
  Search,
  Filter,
  Copy,
  Check
} from 'lucide-react';
import { safeFetchJson } from '../../utils/apiClient';
import { AgentSparklineChart } from './AgentSparklineChart';

export interface AgentLogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warn' | 'error';
  message: string;
  details?: string;
  executionTimeMs?: number;
}

export interface AgentHourlyMetric {
  time: string;
  uptimePercent: number;
  errorRatePercent: number;
  latencyMs: number;
}

export interface FinancialAgentHealth {
  id: 'market_agent' | 'fund_agent' | 'macro_agent' | 'portfolio_agent';
  name: 'MarketAgent' | 'FundAgent' | 'MacroAgent' | 'PortfolioAgent';
  displayName: string;
  roleDescription: string;
  engine: string;
  status: 'active' | 'busy' | 'idle' | 'degraded' | 'error';
  lastExecutionTime: string;
  latencyMs: number;
  successRatePercent: number;
  memoryUsageMb: number;
  totalInvocations: number;
  errorCount: number;
  currentTask: string;
  activeThreads: number;
  logs: AgentLogEntry[];
  hourlyMetrics: AgentHourlyMetric[];
}

export interface AgentHealthSummary {
  overallStatus: 'OPTIMAL' | 'DEGRADED' | 'ATTENTION';
  totalAgents: number;
  activeAgentsCount: number;
  avgLatencyMs: number;
  totalInvocationsToday: number;
  lastSyncTime: string;
  agents: FinancialAgentHealth[];
}

export const AgentHealthMonitor: React.FC = () => {
  const [data, setData] = useState<AgentHealthSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | 'ALL'>('ALL');
  const [selectedLogLevel, setSelectedLogLevel] = useState<string>('ALL');
  const [isLogPanelExpanded, setIsLogPanelExpanded] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [copiedLogId, setCopiedLogId] = useState<string | null>(null);

  const fetchAgentHealth = useCallback(async (manual = false) => {
    try {
      if (manual) setIsRefreshing(true);
      else if (!data) setIsLoading(true);

      const endpoint = manual ? '/api/intelligence/agents/refresh' : '/api/intelligence/agents/health';
      const method = manual ? 'POST' : 'GET';

      const res = await safeFetchJson<AgentHealthSummary & { success: boolean }>(endpoint, { method });

      if (res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.warn('Agent health monitor fetch error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [data]);

  useEffect(() => {
    fetchAgentHealth();
    const interval = setInterval(() => fetchAgentHealth(false), 20000); // 20 saniyede bir periyodik tarama
    return () => clearInterval(interval);
  }, [fetchAgentHealth]);

  const handleCopyLog = (log: AgentLogEntry) => {
    const text = `[${new Date(log.timestamp).toLocaleTimeString('tr-TR')}] [${log.level.toUpperCase()}] ${log.message} ${log.details ? `\nDetails: ${log.details}` : ''}`;
    navigator.clipboard.writeText(text);
    setCopiedLogId(log.id);
    setTimeout(() => setCopiedLogId(null), 2000);
  };

  const getAgentIcon = (id: string) => {
    switch (id) {
      case 'market_agent':
        return <LineChart size={18} className="text-cyan-400" />;
      case 'fund_agent':
        return <PieChart size={18} className="text-purple-400" />;
      case 'macro_agent':
        return <Landmark size={18} className="text-amber-400" />;
      case 'portfolio_agent':
        return <ShieldCheck size={18} className="text-emerald-400" />;
      default:
        return <Cpu size={18} className="text-blue-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Aktif (Çalışıyor)
          </span>
        );
      case 'busy':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            İşlemde
          </span>
        );
      case 'degraded':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <AlertTriangle size={12} />
            Degrade
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold">
            <XCircle size={12} />
            Hata
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-bold">
            Boşta
          </span>
        );
    }
  };

  const allLogs: (AgentLogEntry & { agentName: string; agentId: string })[] = [];
  if (data?.agents) {
    for (const agent of data.agents) {
      for (const log of agent.logs) {
        allLogs.push({
          ...log,
          agentName: agent.name,
          agentId: agent.id,
        });
      }
    }
  }

  // Tarihe gore sirala
  allLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const filteredLogs = allLogs.filter((log) => {
    if (selectedAgentId !== 'ALL' && log.agentId !== selectedAgentId) return false;
    if (selectedLogLevel !== 'ALL' && log.level !== selectedLogLevel) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        log.message.toLowerCase().includes(q) ||
        (log.details && log.details.toLowerCase().includes(q)) ||
        log.agentName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-6">
      {/* 1. Üst Başlık & Sistem Özet Metrikleri */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Activity size={20} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Finansal Ajan Sağlık ve Çalışma Paneli (Agent Health Monitor)
                <span className="text-xs px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-800/60 text-purple-300 font-mono font-bold">
                  v3.4 Live
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Otonom finansal ajanların (MarketAgent, FundAgent, MacroAgent, PortfolioAgent) anlık durumu, işlem süreleri ve çalışma logları.
              </p>
            </div>
          </div>
        </div>

        {/* Aksiyon Butonları & Canlı DurumRozeti */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-xs">
            <span className="text-slate-400">Genel Durum:</span>
            {data?.overallStatus === 'OPTIMAL' ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 size={13} /> OPTİMAL
              </span>
            ) : (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <AlertTriangle size={13} /> DİKKAT
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => fetchAgentHealth(true)}
            disabled={isRefreshing}
            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Taranıyor...' : 'Tanılama Çalıştır'}
          </button>
        </div>
      </div>

      {/* 2. Sistem İstatistik Barı */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 space-y-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Cpu size={12} className="text-purple-400" /> Toplam Ajan Sayısı
          </span>
          <div className="text-base font-black text-white font-mono">
            {data?.activeAgentsCount || 4} / {data?.totalAgents || 4} <span className="text-xs text-emerald-400 font-normal">Aktif</span>
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 space-y-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Zap size={12} className="text-amber-400" /> Ort. Yanıt Süresi (Latency)
          </span>
          <div className="text-base font-black text-amber-300 font-mono">
            {data?.avgLatencyMs || 165} <span className="text-xs text-slate-400 font-normal">ms</span>
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 space-y-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Layers size={12} className="text-cyan-400" /> Günlük Toplam İşlem
          </span>
          <div className="text-base font-black text-cyan-300 font-mono">
            {(data?.totalInvocationsToday || 3884).toLocaleString('tr-TR')} <span className="text-xs text-slate-400 font-normal">çağrı</span>
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 space-y-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Clock size={12} className="text-emerald-400" /> Son Senkronizasyon
          </span>
          <div className="text-xs font-bold text-slate-200 font-mono pt-1">
            {data?.lastSyncTime ? new Date(data.lastSyncTime).toLocaleTimeString('tr-TR') : 'Şimdi'}
          </div>
        </div>
      </div>

      {/* 3. Ajanlar Kart Grid (4 Finansal Ajan) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-slate-950/80 border border-slate-800/90 hover:border-slate-700/90 rounded-xl p-4 space-y-3 transition-all shadow-md group"
          >
            {/* Kart Header */}
            <div className="flex items-start justify-between gap-2 border-b border-slate-850 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-purple-500/40 transition-colors">
                  {getAgentIcon(agent.id)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      {agent.name}
                    </h4>
                    <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {agent.displayName}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{agent.roleDescription}</p>
                </div>
              </div>
              <div>{getStatusBadge(agent.status)}</div>
            </div>

            {/* Motor ve Güncel Görev */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Cpu size={11} className="text-purple-400" /> Motor / Model:
                </span>
                <span className="text-purple-300 font-mono font-bold bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/40">
                  {agent.engine}
                </span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-lg space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Anlık Görev Statusü</span>
                <p className="text-xs text-slate-200 font-medium line-clamp-2 leading-relaxed flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"></span>
                  {agent.currentTask}
                </p>
              </div>
            </div>

            {/* 1 Saatlik Sparkline Trend Grafiği (Uptime & Hata Oranı) */}
            <AgentSparklineChart metrics={agent.hourlyMetrics} agentName={agent.name} />

            {/* Performans ve Metrik Çizelgesi */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-850 text-[11px] font-mono">
              <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
                <span className="text-slate-500 text-[10px] block">Yanıt Süresi</span>
                <span className="font-bold text-amber-300">{agent.latencyMs} ms</span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
                <span className="text-slate-500 text-[10px] block">Başarı Oranı</span>
                <span className="font-bold text-emerald-400">%{agent.successRatePercent}</span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
                <span className="text-slate-500 text-[10px] block">Kullanılan Bellek</span>
                <span className="font-bold text-cyan-300">{agent.memoryUsageMb} MB</span>
              </div>
            </div>

            {/* Alt Bilgi: Son Çağrı & Log İnceleme Butonu */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Son İşlem: {new Date(agent.lastExecutionTime).toLocaleTimeString('tr-TR')}</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedAgentId(agent.id);
                  setIsLogPanelExpanded(true);
                }}
                className="text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Terminal size={12} /> Logları İncele ({agent.logs.length})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Canlı Çalışma Logları Paneli (Expandable Console Stream) */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div
          onClick={() => setIsLogPanelExpanded(!isLogPanelExpanded)}
          className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-850 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-emerald-400" />
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              Ajan Canlı Konsol Logları (Agent Execution Log Stream)
              <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-mono text-[10px]">
                {filteredLogs.length} kayit
              </span>
            </h4>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <span>{isLogPanelExpanded ? 'Gizle' : 'Genişlet ve Filtrele'}</span>
            {isLogPanelExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>

        {isLogPanelExpanded && (
          <div className="p-4 space-y-4">
            {/* Log Filtre Barı */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-400 text-xs font-medium flex items-center gap-1 shrink-0">
                  <Filter size={12} /> Ajan Filtresi:
                </span>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1 font-mono focus:outline-none focus:border-purple-500"
                >
                  <option value="ALL">Tüm Ajanlar (Tümü)</option>
                  <option value="market_agent">MarketAgent (BİST)</option>
                  <option value="fund_agent">FundAgent (TEFAS)</option>
                  <option value="macro_agent">MacroAgent (Makro)</option>
                  <option value="portfolio_agent">PortfolioAgent (Portföy)</option>
                </select>

                <select
                  value={selectedLogLevel}
                  onChange={(e) => setSelectedLogLevel(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1 font-mono focus:outline-none focus:border-purple-500"
                >
                  <option value="ALL">Seviye: Tümü</option>
                  <option value="success">Başarılı (Success)</option>
                  <option value="info">Bilgi (Info)</option>
                  <option value="warn">Uyarı (Warn)</option>
                  <option value="error">Hata (Error)</option>
                </select>
              </div>

              {/* Arama Kutusu */}
              <div className="relative flex-1 max-w-xs">
                <Search size={13} className="absolute left-2.5 top-2.5 text-slate-500" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Loglarda ara (RSI, TEFAS, CDS...)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Terminal Konsol Görünümü */}
            <div className="bg-black/90 border border-slate-800 rounded-xl p-3 font-mono text-xs max-h-80 overflow-y-auto space-y-2 divide-y divide-slate-900 scrollbar-thin scrollbar-thumb-slate-800">
              {filteredLogs.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs">
                  Arama veya filtreye uygun log kaydı bulunamadı.
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div key={log.id} className="pt-2 first:pt-0 flex items-start justify-between gap-3 group">
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-slate-500 text-[10px]">
                          {new Date(log.timestamp).toLocaleTimeString('tr-TR')}
                        </span>

                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-900 border border-slate-800 text-purple-300">
                          {log.agentName}
                        </span>

                        {log.level === 'success' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                            SUCCESS
                          </span>
                        )}
                        {log.level === 'info' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                            INFO
                          </span>
                        )}
                        {log.level === 'warn' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800">
                            WARN
                          </span>
                        )}
                        {log.level === 'error' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-400 border border-rose-800">
                            ERROR
                          </span>
                        )}

                        {log.executionTimeMs && (
                          <span className="text-[10px] text-slate-500">{log.executionTimeMs}ms</span>
                        )}
                      </div>

                      <p className="text-slate-200 text-xs font-mono leading-relaxed">{log.message}</p>

                      {log.details && (
                        <p className="text-[11px] text-emerald-400/90 bg-emerald-950/20 p-1.5 rounded border border-emerald-900/30">
                          ↳ {log.details}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyLog(log)}
                      title="Logu Kopyala"
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-white transition-all cursor-pointer rounded bg-slate-900 border border-slate-800"
                    >
                      {copiedLogId === log.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
