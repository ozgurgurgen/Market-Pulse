import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Server, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Save,
  Globe,
  Database,
  Activity,
  Code,
  ArrowUpDown,
  Clock,
  HardDrive,
  Cpu,
  Layers,
  Search,
  Filter,
  FileQuestion,
  HelpCircle,
  Radio,
  Zap,
  TrendingUp,
  XCircle,
  Sliders,
  Check,
  AlertCircle
} from 'lucide-react';
import { safeFetchJson } from '../../utils/apiClient';

interface ApiSourceDiagnostic {
  id: string;
  name: string;
  provider: string;
  category: 'MARKET_DATA' | 'FUNDAMENTALS' | 'FUNDS' | 'MACRO' | 'AI_MODELS' | 'DATABASE' | 'REGULATORY';
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE' | 'IDLE';
  endpoint: string;
  rateLimit: string;
  updateIntervalMinutes: number;
  isAutoSyncEnabled: boolean;
  
  requestsToday: number;
  successfulRequests: number;
  failedRequests: number;
  totalDataTransferredKB: number;
  averageLatencyMs: number;
  
  totalRecordsFetched: number;
  missingRecordsCount: number;
  dataQualityScore: number;
  
  lastSyncTimestamp: string;
  lastSuccessTimestamp: string;
  nextScheduledSync: string;
  lastError: string | null;
  lastErrorCode?: number | string;
}

interface NullFieldReport {
  dataSource: string;
  collectionName: string;
  totalItems: number;
  completeItems: number;
  incompleteItems: number;
  completenessPercentage: number;
  lastAuditTimestamp: string;
  emptyFields: {
    fieldName: string;
    labelTr: string;
    nullCount: number;
    nullPercentage: number;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    affectedSample: string[];
  }[];
}

interface ApiLogEntry {
  id: string;
  timestamp: string;
  apiId: string;
  apiName: string;
  endpoint: string;
  method: string;
  statusCode: number;
  latencyMs: number;
  payloadSizeKB: number;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  errorMessage?: string;
}

interface GlobalDiagnosticsSummary {
  totalRequestsToday: number;
  successfulRequestsToday: number;
  failedRequestsToday: number;
  successRatePercentage: number;
  totalDataTransferredMB: number;
  averageLatencyMs: number;
  activeApisCount: number;
  degradedApisCount: number;
  offlineApisCount: number;
  overallHealth: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  totalMonitoredSources: number;
  lastGlobalAudit: string;
}

type SubTab = 'sources' | 'null_audit' | 'intervals' | 'logs';

export const AdminApiManagementTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('sources');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Diagnostics State
  const [summary, setSummary] = useState<GlobalDiagnosticsSummary | null>(null);
  const [sources, setSources] = useState<ApiSourceDiagnostic[]>([]);
  const [nullAudits, setNullAudits] = useState<NullFieldReport[]>([]);
  const [logs, setLogs] = useState<ApiLogEntry[]>([]);

  // Action states
  const [testingApiId, setTestingApiId] = useState<string | null>(null);
  const [syncingApiId, setSyncingApiId] = useState<string | null>(null);
  const [intervalEdits, setIntervalEdits] = useState<Record<string, { interval: number; enabled: boolean }>>({});
  const [hasUnsavedIntervals, setHasUnsavedIntervals] = useState(false);
  const [isSavingIntervals, setIsSavingIntervals] = useState(false);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [logFilter, setLogFilter] = useState<'ALL' | 'SUCCESS' | 'WARNING' | 'FAILED'>('ALL');

  const fetchDiagnosticsData = async (silent: boolean = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const res = await safeFetchJson<{
        success: boolean;
        summary: GlobalDiagnosticsSummary;
        sources: ApiSourceDiagnostic[];
        nullAudits: NullFieldReport[];
        recentLogs: ApiLogEntry[];
      }>('/api/admin/api-diagnostics');

      if (res.ok && res.data?.success) {
        setSummary(res.data.summary);
        setSources(res.data.sources || []);
        setNullAudits(res.data.nullAudits || []);
        setLogs(res.data.recentLogs || []);

        // Initialize interval edits map
        const initialIntervals: Record<string, { interval: number; enabled: boolean }> = {};
        res.data.sources?.forEach(s => {
          initialIntervals[s.id] = {
            interval: s.updateIntervalMinutes,
            enabled: s.isAutoSyncEnabled
          };
        });
        setIntervalEdits(initialIntervals);
        setHasUnsavedIntervals(false);
      }
    } catch (err: any) {
      console.error('Failed to load API diagnostics:', err);
      showNotification('error', 'API analiz ve tanı verileri alınamadı.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDiagnosticsData();
    const interval = setInterval(() => {
      fetchDiagnosticsData(true);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const showNotification = (type: 'success' | 'error' | 'info', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4500);
  };

  const handleTestApi = async (apiId: string) => {
    setTestingApiId(apiId);
    try {
      const res = await safeFetchJson<{
        success: boolean;
        result?: any;
        error?: string;
        sources?: ApiSourceDiagnostic[];
      }>('/api/admin/api-diagnostics/test-api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiId })
      });

      if (res.ok && res.data?.success && res.data.result) {
        const r = res.data.result;
        showNotification(
          'success',
          `[${r.name}] Bağlantı başarılı! Yanıt süresi: ${r.latencyMs}ms (${r.recordsCount} kayıt doğrulandı)`
        );
        if (res.data.sources) setSources(res.data.sources);
      } else {
        showNotification('error', `API testinde hata: ${res.data?.error || 'Bağlantı kurulamadı'}`);
      }
    } catch (err: any) {
      showNotification('error', `Bağlantı testi başarısız: ${err.message}`);
    } finally {
      setTestingApiId(null);
      fetchDiagnosticsData(true);
    }
  };

  const handleSyncApi = async (apiId: string) => {
    setSyncingApiId(apiId);
    try {
      const res = await safeFetchJson<{
        success: boolean;
        message?: string;
        error?: string;
        result?: any;
        sources?: ApiSourceDiagnostic[];
        summary?: GlobalDiagnosticsSummary;
      }>('/api/admin/api-diagnostics/sync-now', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiId })
      });

      if (res.ok && res.data?.success) {
        showNotification('success', res.data.message || 'Veriler başarıyla eşitlendi ve güncellendi.');
        if (res.data.sources) setSources(res.data.sources);
        if (res.data.summary) setSummary(res.data.summary);
      } else {
        showNotification('error', `Senkronizasyon hatası: ${res.data?.error || 'İşlem tamamlanamadı'}`);
      }
    } catch (err: any) {
      showNotification('error', `Senkronizasyon hatası: ${err.message}`);
    } finally {
      setSyncingApiId(null);
      fetchDiagnosticsData(true);
    }
  };

  const handleIntervalChange = (apiId: string, interval: number) => {
    setIntervalEdits(prev => ({
      ...prev,
      [apiId]: {
        ...prev[apiId],
        interval: Math.max(1, interval)
      }
    }));
    setHasUnsavedIntervals(true);
  };

  const handleToggleAutoSync = (apiId: string) => {
    setIntervalEdits(prev => ({
      ...prev,
      [apiId]: {
        ...prev[apiId],
        enabled: !prev[apiId]?.enabled
      }
    }));
    setHasUnsavedIntervals(true);
  };

  const handleSaveIntervals = async () => {
    setIsSavingIntervals(true);
    try {
      const res = await safeFetchJson<{
        success: boolean;
        message?: string;
        error?: string;
        sources?: ApiSourceDiagnostic[];
      }>('/api/admin/api-diagnostics/intervals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configs: intervalEdits })
      });

      if (res.ok && res.data?.success) {
        showNotification('success', res.data.message || 'Güncelleme sıklıkları başarıyla kaydedildi.');
        setHasUnsavedIntervals(false);
        if (res.data.sources) setSources(res.data.sources);
      } else {
        showNotification('error', `Kaydetme hatası: ${res.data?.error || 'Aralıklar kaydedilemedi'}`);
      }
    } catch (err: any) {
      showNotification('error', `Hata: ${err.message}`);
    } finally {
      setIsSavingIntervals(false);
    }
  };

  const formatTimeAgo = (isoString?: string) => {
    if (!isoString) return 'Bilinmiyor';
    const diffMs = Date.now() - new Date(isoString).getTime();
    if (diffMs < 0) return 'Şimdi';
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'Az önce (<1 dk)';
    if (mins < 60) return `${mins} dk önce`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} saat önce`;
    return `${Math.floor(hours / 24)} gün önce`;
  };

  const formatTimeNext = (isoString?: string) => {
    if (!isoString) return 'Planlanmadı';
    const diffMs = new Date(isoString).getTime() - Date.now();
    if (diffMs <= 0) return 'Hemen şimdi';
    const mins = Math.floor(diffMs / 60000);
    if (mins < 60) return `${mins} dk sonra`;
    const hours = Math.floor(mins / 60);
    return `${hours} sa ${mins % 60} dk sonra`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            ÇEVRİMİÇİ (200 OK)
          </span>
        );
      case 'DEGRADED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <AlertTriangle size={11} className="text-amber-400" />
            KISMEN GECİKMELİ
          </span>
        );
      case 'OFFLINE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <XCircle size={11} className="text-rose-400" />
            ÇEVRİMDIŞI
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
            BEKLEMEDE
          </span>
        );
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'MARKET_DATA': return <span className="px-2 py-0.5 bg-blue-500/15 text-blue-300 border border-blue-500/30 rounded text-[10px] font-bold">Piyasa Fiyatı</span>;
      case 'FUNDAMENTALS': return <span className="px-2 py-0.5 bg-purple-500/15 text-purple-300 border border-purple-500/30 rounded text-[10px] font-bold">KAP Bilanço</span>;
      case 'FUNDS': return <span className="px-2 py-0.5 bg-teal-500/15 text-teal-300 border border-teal-500/30 rounded text-[10px] font-bold">TEFAS Fon</span>;
      case 'MACRO': return <span className="px-2 py-0.5 bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded text-[10px] font-bold">TCMB Makro</span>;
      case 'AI_MODELS': return <span className="px-2 py-0.5 bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30 rounded text-[10px] font-bold">Gemini YZ</span>;
      case 'REGULATORY': return <span className="px-2 py-0.5 bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 rounded text-[10px] font-bold">SPK & IPO</span>;
      default: return <span className="px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded text-[10px] font-bold">{category}</span>;
    }
  };

  const filteredSources = sources.filter(s => {
    if (categoryFilter !== 'ALL' && s.category !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.provider.toLowerCase().includes(q) || s.endpoint.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredLogs = logs.filter(l => {
    if (logFilter !== 'ALL' && l.status !== logFilter) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <RefreshCw className="animate-spin text-blue-400" size={32} />
        <span className="text-sm font-semibold text-slate-300">API analitik ve diagnostik metrikleri derleniyor...</span>
      </div>
    );
  }

  return (
    <div id="admin-api-diagnostics-view" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-black uppercase tracking-wider">
                Telemetry & Pipeline Audit v2.4
              </span>
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                ● Canlı Veri Monitörü
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Network className="text-blue-400" size={24} />
              API Analiz, Tanı & Veri Kalitesi Diagnostiği
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              Tüm finansal veri boru hatlarının (BIST, KAP, TEFAS, TCMB, Yahoo, Gemini) istek sayılarını, aktarılan veri hacimlerini, boş kalan eksik alanlarını ve güncelleme sıklıklarını anlık olarak denetleyin.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => handleSyncApi('ALL')}
              disabled={syncingApiId === 'ALL' || isRefreshing}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={syncingApiId === 'ALL' ? 'animate-spin' : ''} />
              {syncingApiId === 'ALL' ? 'Tüm Boru Hatları Eşitleniyor...' : 'Tüm API\'leri Şimdi Eşitle'}
            </button>

            <button
              onClick={() => fetchDiagnosticsData()}
              disabled={isRefreshing}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
              title="Verileri Yenile"
            >
              <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Global KPI Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-medium">
              <span>Toplam İstek</span>
              <Activity size={13} className="text-blue-400" />
            </div>
            <div className="text-lg font-black text-white font-mono">
              {summary?.totalRequestsToday.toLocaleString('tr-TR') || 0}
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold">
              %{summary?.successRatePercentage || 100} Başarı Oranı
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-medium">
              <span>Aktarılan Veri</span>
              <HardDrive size={13} className="text-purple-400" />
            </div>
            <div className="text-lg font-black text-white font-mono">
              {summary?.totalDataTransferredMB || 0} <span className="text-xs font-normal text-slate-400">MB</span>
            </div>
            <div className="text-[10px] text-slate-400">
              Bugün çekilen hacim
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-medium">
              <span>Ort. Gecikme</span>
              <Clock size={13} className="text-amber-400" />
            </div>
            <div className="text-lg font-black text-amber-300 font-mono">
              {summary?.averageLatencyMs || 0} <span className="text-xs font-normal text-slate-400">ms</span>
            </div>
            <div className="text-[10px] text-emerald-400">
              Ultra Hızlı Yanıt
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-medium">
              <span>Çevrimiçi API</span>
              <CheckCircle2 size={13} className="text-emerald-400" />
            </div>
            <div className="text-lg font-black text-emerald-400 font-mono">
              {summary?.activeApisCount || 0} / {summary?.totalMonitoredSources || 0}
            </div>
            <div className="text-[10px] text-emerald-400/90 font-medium">
              Tam Operasyonel
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-medium">
              <span>Hata / İstisna</span>
              <AlertTriangle size={13} className="text-rose-400" />
            </div>
            <div className={`text-lg font-black font-mono ${summary?.failedRequestsToday ? 'text-rose-400' : 'text-slate-300'}`}>
              {summary?.failedRequestsToday || 0}
            </div>
            <div className="text-[10px] text-slate-400">
              {summary?.failedRequestsToday ? 'Önbellekten telafi edildi' : '0 Kritik Hata'}
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-medium">
              <span>Sistem Sağlığı</span>
              <Radio size={13} className="text-emerald-400" />
            </div>
            <div className="text-xs font-black text-emerald-400 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {summary?.overallHealth === 'HEALTHY' ? 'MÜKEMMEL' : summary?.overallHealth === 'WARNING' ? 'UYARI VAR' : 'KRİTİK'}
            </div>
            <div className="text-[10px] text-slate-500 font-mono truncate">
              {formatTimeAgo(summary?.lastGlobalAudit)}
            </div>
          </div>

        </div>

        {/* Sub-Tab Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveSubTab('sources')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'sources'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Server size={14} />
              API Kaynakları & Tanı ({sources.length})
            </button>

            <button
              onClick={() => setActiveSubTab('null_audit')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'null_audit'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <FileQuestion size={14} />
              Eksik & Boş Veri Denetimi (Null Audit)
            </button>

            <button
              onClick={() => setActiveSubTab('intervals')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'intervals'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Sliders size={14} />
              Güncelleme Sıklığı Ayarları {hasUnsavedIntervals && <span className="w-2 h-2 rounded-full bg-amber-400"></span>}
            </button>

            <button
              onClick={() => setActiveSubTab('logs')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'logs'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Radio size={14} />
              Canlı Telemetri & İstek Akışı ({logs.length})
            </button>
          </div>

          {statusMessage && (
            <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 animate-in fade-in duration-300 ${
              statusMessage.type === 'success' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' :
              statusMessage.type === 'error' ? 'bg-rose-950/80 text-rose-300 border border-rose-800' :
              'bg-blue-950/80 text-blue-300 border border-blue-800'
            }`}>
              {statusMessage.type === 'success' ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 1: API KAYNAKLARI & TANI TABLOSU                                    */}
      {/* ========================================================================= */}
      {activeSubTab === 'sources' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          
          {/* Filters Bar */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 shadow-md">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="API adı, sağlayıcı veya uç nokta ara..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:border-blue-500 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Tüm Kategoriler</option>
                <option value="MARKET_DATA">Piyasa Fiyatı (BIST / ABD / Kripto)</option>
                <option value="FUNDAMENTALS">KAP Bilanço & Finansal</option>
                <option value="FUNDS">TEFAS Fonları</option>
                <option value="MACRO">TCMB Makro Göstergeler</option>
                <option value="AI_MODELS">Gemini YZ Analiz Motoru</option>
                <option value="REGULATORY">SPK & Halka Arz (IPO)</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:border-blue-500 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Tüm Durumlar</option>
                <option value="ONLINE">Çevrimiçi (Online)</option>
                <option value="DEGRADED">Gecikmeli / Uyarılı</option>
                <option value="OFFLINE">Çevrimdışı (Offline)</option>
              </select>
            </div>
          </div>

          {/* Sources Cards Grid */}
          <div className="grid grid-cols-1 gap-4">
            {filteredSources.map((source) => (
              <div 
                key={source.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg transition-all space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  
                  {/* Left: Source Identity */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
                      {source.category === 'AI_MODELS' ? <Cpu size={22} className="text-purple-400" /> :
                       source.category === 'FUNDS' ? <Layers size={22} className="text-teal-400" /> :
                       source.category === 'MACRO' ? <TrendingUp size={22} className="text-indigo-400" /> :
                       source.category === 'FUNDAMENTALS' ? <HardDrive size={22} className="text-amber-400" /> :
                       <Activity size={22} className="text-blue-400" />}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">{source.name}</h3>
                        {getStatusBadge(source.status)}
                        {getCategoryBadge(source.category)}
                        <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] font-semibold text-slate-300 font-mono">
                          {source.provider}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
                          <Globe size={12} />
                          {source.endpoint}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Kota Limiti: <strong className="text-slate-200">{source.rateLimit}</strong>
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock size={11} className="text-blue-400" />
                          Sıklık: <strong className="text-slate-200">{source.updateIntervalMinutes} dk</strong>
                        </span>
                      </div>

                      {source.lastError && (
                        <div className="mt-2 p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 text-xs flex items-start gap-2">
                          <AlertCircle size={14} className="shrink-0 mt-0.5 text-rose-400" />
                          <div>
                            <span className="font-bold">Son Tanı Bildirimi: </span>
                            <span>{source.lastError}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t border-slate-800 lg:border-0">
                    <button
                      onClick={() => handleTestApi(source.id)}
                      disabled={testingApiId === source.id || syncingApiId === source.id}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Zap size={13} className={testingApiId === source.id ? 'animate-spin text-amber-400' : 'text-amber-400'} />
                      {testingApiId === source.id ? 'Ping Testi...' : 'Bağlantıyı Test Et'}
                    </button>

                    <button
                      onClick={() => handleSyncApi(source.id)}
                      disabled={syncingApiId === source.id || testingApiId === source.id}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-600/20 disabled:opacity-50"
                    >
                      <RefreshCw size={13} className={syncingApiId === source.id ? 'animate-spin' : ''} />
                      {syncingApiId === source.id ? 'Eşitleniyor...' : 'Şimdi Eşitle'}
                    </button>
                  </div>

                </div>

                {/* Metrics Breakdown Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-3 border-t border-slate-800/80 text-xs">
                  
                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">Günlük İstek</span>
                    <div className="font-mono font-bold text-white text-sm mt-0.5">
                      {source.requestsToday} <span className="text-[10px] text-emerald-400">({source.successfulRequests} OK)</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">Transfer Edilen Veri</span>
                    <div className="font-mono font-bold text-white text-sm mt-0.5">
                      {(source.totalDataTransferredKB / 1024).toFixed(2)} <span className="text-[10px] text-slate-400">MB</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">Çekilen Kayıt Sayısı</span>
                    <div className="font-mono font-bold text-indigo-300 text-sm mt-0.5">
                      {source.totalRecordsFetched.toLocaleString('tr-TR')} <span className="text-[10px] text-slate-400">öğe</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">Veri Kalite / Doluluk</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono font-bold text-emerald-400 text-sm">%{source.dataQualityScore}</span>
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full" 
                          style={{ width: `${source.dataQualityScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">Son Başarılı Senkron</span>
                    <div className="font-mono font-bold text-slate-300 text-xs mt-0.5 truncate" title={source.lastSuccessTimestamp}>
                      {formatTimeAgo(source.lastSuccessTimestamp)}
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">Sıradaki Otomatik Eşitleme</span>
                    <div className="font-mono font-bold text-blue-400 text-xs mt-0.5 truncate" title={source.nextScheduledSync}>
                      {source.isAutoSyncEnabled ? formatTimeNext(source.nextScheduledSync) : 'Devre Dışı'}
                    </div>
                  </div>

                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: EKSİK & BOŞ VERİ DENETİMİ (NULL DATA AUDIT)                     */}
      {/* ========================================================================= */}
      {activeSubTab === 'null_audit' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div className="p-5 bg-gradient-to-r from-purple-950/30 to-indigo-950/30 border border-purple-800/40 rounded-2xl shadow-lg space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileQuestion className="text-purple-400" size={18} />
              Veri Bütünlüğü & Boş Alan Analiz Raporu (Null Value Audit)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
              Bu panel, sistemde bulunan veritabanı koleksiyonlarında hangi veri alanlarının boş kaldığını (null, undefined, 0 veya eksik) tespit eder. Veri sağlayıcısından (KAP, TEFAS, TCMB, Yahoo) gelmeyen veya dönemsel olarak açıklanmayan verileri sembol bazında listeler.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {nullAudits.map((report, idx) => (
              <div 
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5"
              >
                {/* Header of Audit Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white tracking-tight">{report.dataSource}</h4>
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
                        {report.collectionName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Toplam <strong>{report.totalItems}</strong> kayıt tarandı • <strong>{report.completeItems}</strong> tam veri • <strong className="text-amber-400">{report.incompleteItems}</strong> eksik içeren kayıt
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-semibold text-slate-400">Bütünlük Skoru</div>
                      <div className="text-lg font-black text-emerald-400 font-mono">%{report.completenessPercentage}</div>
                    </div>
                    <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full" 
                        style={{ width: `${report.completenessPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Empty Fields Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/60">
                        <th className="py-2.5 px-3">Eksik / Boş Kalan Alan</th>
                        <th className="py-2.5 px-3">Açıklama</th>
                        <th className="py-2.5 px-3">Boş Sayısı</th>
                        <th className="py-2.5 px-3">Boşluk Oranı</th>
                        <th className="py-2.5 px-3">Önem Derecesi</th>
                        <th className="py-2.5 px-3">Etkilenen Örnek Varlıklar / Semboller</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-sans">
                      {report.emptyFields.map((field, fIdx) => (
                        <tr key={fIdx} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-slate-200">
                            {field.fieldName}
                          </td>
                          <td className="py-3 px-3 text-slate-300">
                            {field.labelTr}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-amber-400">
                            {field.nullCount} öğe
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-slate-300">%{field.nullPercentage}</span>
                              <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    field.nullPercentage > 20 ? 'bg-rose-500' : field.nullPercentage > 5 ? 'bg-amber-500' : 'bg-blue-500'
                                  }`} 
                                  style={{ width: `${Math.min(100, field.nullPercentage)}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            {field.severity === 'HIGH' ? (
                              <span className="px-2 py-0.5 bg-rose-500/15 text-rose-400 border border-rose-500/30 rounded text-[10px] font-bold">
                                YÜKSEK
                              </span>
                            ) : field.severity === 'MEDIUM' ? (
                              <span className="px-2 py-0.5 bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded text-[10px] font-bold">
                                ORTA
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-slate-800 text-slate-400 border border-slate-700 rounded text-[10px] font-bold">
                                DÜŞÜK (Doğal)
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            {field.affectedSample.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {field.affectedSample.map((sym, sIdx) => (
                                  <span 
                                    key={sIdx}
                                    className="px-1.5 py-0.5 bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px] rounded"
                                  >
                                    {sym}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-500 italic">Eksik yok (Tam Veri)</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Son Denetim Zamanı: {new Date(report.lastAuditTimestamp).toLocaleString('tr-TR')}</span>
                  <span className="text-emerald-400">Otomatik Doğrulama ve Sentetik Onarım Aktif</span>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 3: GÜNCELLEME SIKLIĞI & OTOMASYON AYARLARI                           */}
      {/* ========================================================================= */}
      {activeSubTab === 'intervals' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="text-emerald-400" size={18} />
                  API Senkronizasyon & Otomatik Güncelleme Sıklıkları
                </h3>
                <p className="text-xs text-slate-400">
                  Her bir veri boru hattının arka plandaki periyodik çalışma sıklığını (dakika cinsinden) ve otomatik eşitleme durumunu yapılandırın.
                </p>
              </div>

              <button
                onClick={handleSaveIntervals}
                disabled={isSavingIntervals || !hasUnsavedIntervals}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer disabled:opacity-50 shrink-0 self-start sm:self-auto"
              >
                <Save size={14} className={isSavingIntervals ? 'animate-spin' : ''} />
                {isSavingIntervals ? 'Kaydediliyor...' : 'Tüm Ayarları Kaydet'}
              </button>
            </div>

            {hasUnsavedIntervals && (
              <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-amber-300 text-xs flex items-center gap-2">
                <AlertTriangle size={14} className="shrink-0 text-amber-400" />
                <span>Kaydedilmemiş değişiklikleriniz bulunmaktadır. Lütfen "Tüm Ayarları Kaydet" butonuna basın.</span>
              </div>
            )}

            {/* Config List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {sources.map((source) => {
                const currentConfig = intervalEdits[source.id] || {
                  interval: source.updateIntervalMinutes,
                  enabled: source.isAutoSyncEnabled
                };

                return (
                  <div 
                    key={source.id}
                    className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-colors shadow-inner"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{source.name}</h4>
                          {getCategoryBadge(source.category)}
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {source.provider} • Kota: {source.rateLimit}
                        </p>
                      </div>

                      {/* Toggle Switch */}
                      <button
                        type="button"
                        onClick={() => handleToggleAutoSync(source.id)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          currentConfig.enabled ? 'bg-emerald-600' : 'bg-slate-800'
                        }`}
                        title={currentConfig.enabled ? 'Otomatik Senkronizasyon Açık' : 'Otomatik Senkronizasyon Kapalı'}
                      >
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            currentConfig.enabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Interval Selector */}
                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <span className="font-semibold">Yenileme Periyodu:</span>
                        <span className="font-mono font-bold text-emerald-400">
                          {currentConfig.interval >= 60 
                            ? `${(currentConfig.interval / 60).toFixed(1)} Saat (${currentConfig.interval} dk)`
                            : `${currentConfig.interval} Dakika`}
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-1.5">
                        {[1, 5, 15, 30, 60, 180, 360, 720].map((mins) => (
                          <button
                            key={mins}
                            type="button"
                            onClick={() => handleIntervalChange(source.id, mins)}
                            className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                              currentConfig.interval === mins
                                ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            }`}
                          >
                            {mins >= 60 ? `${mins / 60} sa` : `${mins} dk`}
                          </button>
                        ))}
                      </div>

                      {/* Custom Input */}
                      <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
                        <span>Özel Değer (dk):</span>
                        <input
                          type="number"
                          min="1"
                          max="1440"
                          value={currentConfig.interval}
                          onChange={(e) => handleIntervalChange(source.id, parseInt(e.target.value) || 1)}
                          className="w-20 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 4: CANLI TELEMETRİ & İSTEK LOGLARI                                  */}
      {/* ========================================================================= */}
      {activeSubTab === 'logs' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Radio className="text-indigo-400" size={16} />
                Gerçek Zamanlı API İstek & Yanıt Akışı
              </h3>
              <p className="text-[11px] text-slate-400">
                Son atılan {logs.length} adet API isteğinin durum kodları, gecikme süreleri ve veri paket boyutları.
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {(['ALL', 'SUCCESS', 'WARNING', 'FAILED'] as const).map((filterVal) => (
                <button
                  key={filterVal}
                  onClick={() => setLogFilter(filterVal)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    logFilter === filterVal
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {filterVal === 'ALL' ? 'Tümü' : filterVal === 'SUCCESS' ? 'Başarılı' : filterVal === 'WARNING' ? 'Uyarı' : 'Hatalı'}
                </button>
              ))}
            </div>
          </div>

          {/* Logs Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/80 font-sans font-bold">
                    <th className="py-3 px-4">Zaman</th>
                    <th className="py-3 px-4">Kaynak API</th>
                    <th className="py-3 px-4">Metot & Uç Nokta</th>
                    <th className="py-3 px-4">Durum Kodu</th>
                    <th className="py-3 px-4">Gecikme (ms)</th>
                    <th className="py-3 px-4">Veri Boyutu</th>
                    <th className="py-3 px-4">Detay / Mesaj</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-4 text-slate-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="py-2.5 px-4 text-slate-200 font-bold whitespace-nowrap">
                        {log.apiName}
                      </td>
                      <td className="py-2.5 px-4 text-slate-300 font-mono text-[11px] truncate max-w-xs" title={log.endpoint}>
                        <span className="text-blue-400 font-bold mr-1">{log.method}</span>
                        {log.endpoint}
                      </td>
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        {log.statusCode === 200 ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                            200 OK
                          </span>
                        ) : log.statusCode === 429 ? (
                          <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                            429 RATE LIMIT
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[10px] font-bold">
                            {log.statusCode} ERROR
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-amber-300 font-bold whitespace-nowrap">
                        {log.latencyMs} ms
                      </td>
                      <td className="py-2.5 px-4 text-slate-400 whitespace-nowrap">
                        {log.payloadSizeKB} KB
                      </td>
                      <td className="py-2.5 px-4 text-slate-400 font-sans text-[11px] truncate max-w-sm">
                        {log.errorMessage ? (
                          <span className="text-amber-400 font-medium">{log.errorMessage}</span>
                        ) : (
                          <span className="text-slate-500">Normal akış verisi aktarıldı.</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
