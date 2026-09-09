import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  Users, 
  Shield, 
  ShieldAlert, 
  Lock, 
  Sparkles, 
  RefreshCw, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Search, 
  Cpu, 
  Key, 
  FileText,
  Sliders,
  Server,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import ReactMarkdown from 'react-markdown';
import { safeFetchJson } from '../../utils/apiClient';

interface Props {
  onRefreshParent?: () => void;
}

const TIER_COLORS: Record<string, string> = {
  FREE: '#64748b',
  STARTER: '#3b82f6',
  PRO: '#6366f1',
  PREMIUM: '#f59e0b',
};

const ASSET_CLASS_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ec4899', '#06b6d4'];

export const AdminUserAnalyticsTab: React.FC<Props> = ({ onRefreshParent }) => {
  const [activeSubTab, setActiveSubTab] = useState<'layer_a' | 'layer_b' | 'layer_c' | 'ai_insights'>('layer_a');
  
  // Data states
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [overviewData, setOverviewData] = useState<any>(null);
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Layer C (Individual Support) states
  const [targetUserId, setTargetUserId] = useState('');
  const [supportReason, setSupportReason] = useState('');
  const [isFetchingSupport, setIsFetchingSupport] = useState(false);
  const [supportUserResult, setSupportUserResult] = useState<any>(null);
  const [supportError, setSupportError] = useState<string | null>(null);

  // AI Insights states & Model Selection
  const [aiProvider, setAiProvider] = useState<'gemini' | 'ollama' | 'custom_local'>('gemini');
  const [selectedAiModel, setSelectedAiModel] = useState<string>('gemini-3.7-flash');
  const [customEndpointUrl, setCustomEndpointUrl] = useState<string>('http://localhost:11434/api/generate');
  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [aiTemperature, setAiTemperature] = useState<number>(0.3);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiReportResult, setAiReportResult] = useState<{ reportMarkdown?: string; modelUsed?: string; executionTimeMs?: number } | null>(null);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const [overviewRes, portfolioRes] = await Promise.all([
        safeFetchJson<{ success: boolean; data: any }>('/api/admin/analytics/overview'),
        safeFetchJson<{ success: boolean; data: any }>('/api/admin/analytics/portfolio')
      ]);

      if (overviewRes.ok && overviewRes.data?.data) {
        setOverviewData(overviewRes.data.data);
      }
      if (portfolioRes.ok && portfolioRes.data?.data) {
        setPortfolioData(portfolioRes.data.data);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Analitik verileri yüklenemedi: ' + err.message });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    setFeedback(null);
    try {
      const res = await safeFetchJson<{ success: boolean; message?: string }>('/api/admin/analytics/refresh', {
        method: 'POST'
      });
      if (res.ok && res.data?.success) {
        setFeedback({ type: 'success', message: 'Analitik özeti başarıyla güncellendi.' });
        await fetchAnalyticsData();
        if (onRefreshParent) onRefreshParent();
      } else {
        setFeedback({ type: 'error', message: 'Yenileme başarısız oldu.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Hata: ' + err.message });
    } finally {
      setIsRefreshing(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleExportCsv = () => {
    window.open('/api/admin/analytics/export', '_blank');
  };

  const handleFetchSupportDetail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId.trim()) {
      setSupportError('Lütfen bir Kullanıcı ID veya E-Posta giriniz.');
      return;
    }
    if (!supportReason.trim() || supportReason.trim().length < 5) {
      setSupportError('KVKK Kuralı: En az 5 karakter uzunluğunda inceleme gerekçesi yazılması zorunludur.');
      return;
    }

    setIsFetchingSupport(true);
    setSupportError(null);
    setSupportUserResult(null);

    try {
      const res = await safeFetchJson<{ success: boolean; data: any; error?: string }>(
        `/api/admin/users/${encodeURIComponent(targetUserId.trim())}/support-detail?reason=${encodeURIComponent(supportReason.trim())}`
      );

      if (res.ok && res.data?.success) {
        setSupportUserResult(res.data.data);
      } else {
        setSupportError(res.data?.error || res.error || 'Kullanıcı detayları alınamadı.');
      }
    } catch (err: any) {
      setSupportError('İstek başarısız: ' + err.message);
    } finally {
      setIsFetchingSupport(false);
    }
  };

  const handleRunAiAnalysis = async () => {
    setIsGeneratingAi(true);
    setAiReportResult(null);
    try {
      const res = await safeFetchJson<{ success: boolean; reportMarkdown?: string; modelUsed?: string; executionTimeMs?: number; error?: string }>(
        '/api/admin/analytics/ai-insights',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider: aiProvider,
            modelName: selectedAiModel,
            customEndpointUrl: aiProvider !== 'gemini' ? customEndpointUrl : undefined,
            customApiKey: customApiKey || undefined,
            temperature: aiTemperature
          })
        }
      );

      if (res.ok && res.data?.success) {
        setAiReportResult(res.data);
      } else {
        alert(res.data?.error || res.error || 'AI Analiz raporu oluşturulamadı.');
      }
    } catch (err: any) {
      alert('AI Rapor Hatası: ' + err.message);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
        <RefreshCw className="animate-spin text-indigo-400" size={30} />
        <span className="text-xs text-slate-400 font-semibold">Kullanıcı & Portföy analitiği snapshot verileri yükleniyor...</span>
      </div>
    );
  }

  const usage = overviewData?.usage || {};
  const portfolio = portfolioData?.portfolio || {};

  return (
    <div id="admin-user-analytics-view" className="space-y-6">
      
      {/* Top Action Ribbon */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[11px] font-black uppercase tracking-wider">
              Kullanıcı İstihbarat & Analitik Motoru
            </span>
            <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
              <Shield size={12} /> K-Anonymity Korumalı
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white mt-1 flex items-center gap-2">
            <BarChart3 className="text-indigo-400" size={20} />
            Kullanıcı Davranışları, Portföy Eğilimleri & AI İçgörüler
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Katman A (Kullanım), Katman B (Portföy Trendleri) ve Katman C (Gerekçeli Destek) modüllerini güvenle inceleyin.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Download size={14} className="text-indigo-400" />
            CSV Dışa Aktar
          </button>

          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            Analitikleri Yenile
          </button>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-2 border ${
          feedback.type === 'success' ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-rose-950/40 border-rose-800 text-rose-300'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Snapshot Meta Badge */}
      <div className="bg-slate-950 border border-slate-800/80 px-4 py-2.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 text-slate-400">
          <span>Snapshot: <strong className="text-slate-200 font-mono">{overviewData?.snapshotId || 'latest'}</strong></span>
          <span>•</span>
          <span>Son Hesaplama: <strong className="text-slate-200">{overviewData?.generatedAt ? new Date(overviewData.generatedAt).toLocaleString('tr-TR') : 'Canlı'}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
          <Lock size={12} />
          <span>Küçük Grup Gizlilik Eşiği: <strong>{'< 5'} kullanıcı maskeleme aktif</strong></span>
        </div>
      </div>

      {/* Sub Tab Navigation Ribbon */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('layer_a')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'layer_a'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <BarChart3 size={15} />
          Katman A: Kullanım & Aktivite
        </button>

        <button
          onClick={() => setActiveSubTab('layer_b')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'layer_b'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <PieIcon size={15} />
          Katman B: Portföy & Varlık Eğilimleri
        </button>

        <button
          onClick={() => setActiveSubTab('layer_c')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'layer_c'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              : 'text-slate-400 hover:text-rose-300 hover:bg-slate-900'
          }`}
        >
          <ShieldAlert size={15} className={activeSubTab === 'layer_c' ? 'text-white' : 'text-rose-400'} />
          Katman C: Bireysel Destek (Gerekçeli)
        </button>

        <button
          onClick={() => setActiveSubTab('ai_insights')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'ai_insights'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-slate-400 hover:text-purple-300 hover:bg-slate-900'
          }`}
        >
          <Sparkles size={15} className={activeSubTab === 'ai_insights' ? 'text-amber-300' : 'text-purple-400'} />
          AI Strateji Motoru & Model Seçimi
        </button>
      </div>

      {/* ========================================================================= */}
      {/* KATMAN A: KULLANIM & AKTİVİTE ANALİTİĞİ */}
      {/* ========================================================================= */}
      {activeSubTab === 'layer_a' && (
        <div className="space-y-6">
          
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
              <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
                <span>Toplam Kayıtlı</span>
                <Users size={16} className="text-indigo-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-2">
                {usage.totalUsers || 0}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Platform geneli hesap</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
              <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
                <span>24s Aktif Kullanıcı</span>
                <TrendingUp size={16} className="text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2">
                {usage.activeUsers24h || 0}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                %{usage.totalUsers ? Math.round((usage.activeUsers24h / usage.totalUsers) * 100) : 0} Günlük Katılım Oranı
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
              <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
                <span>7 Günlük Aktif</span>
                <Layers size={16} className="text-blue-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-blue-400 mt-2">
                {usage.activeUsers7d || 0}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Haftalık Düzenli Ziyaretçi</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
              <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
                <span>30 Günlük Aktif</span>
                <Sparkles size={16} className="text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-2">
                {usage.activeUsers30d || 0}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Aylık Aktif Kullanıcı (MAU)</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Subscription Tier Distribution */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PieIcon size={16} className="text-indigo-400" />
                Üyelik Seviyeleri Dağılımı
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={usage.subscriptionDistribution || []}
                      dataKey="count"
                      nameKey="tier"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry: any) => `${entry.tier || entry.name}: %${entry.percentage || entry.value}`}
                    >
                      {(usage.subscriptionDistribution || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={TIER_COLORS[entry.tier] || '#6366f1'} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Daily Query Volume Trend */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-400" />
                Son 7 Günlük Analiz & AI Rapor Trafiği
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={usage.dailyQueryVolumeTrend || []}>
                    <defs>
                      <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Area type="monotone" dataKey="analysisQueries" name="Sinyal & Tarama Sorgusu" stroke="#6366f1" fillOpacity={1} fill="url(#colorQueries)" />
                    <Area type="monotone" dataKey="aiReports" name="AI Derin Raporlar" stroke="#10b981" fillOpacity={1} fill="url(#colorAi)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Feature Interaction Breakdown */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 size={16} className="text-purple-400" />
              Platform Modülleri Kullanım Yoğunluğu (Haftalık Etkileşim)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {(usage.featureUsageBreakdown || []).map((feat: any, idx: number) => (
                <div key={idx} className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-xl space-y-2">
                  <div className="text-xs text-slate-300 font-bold truncate">{feat.label}</div>
                  <div className="text-lg font-black text-purple-400">
                    %{feat.percentage}
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: `${feat.percentage}%` }} />
                  </div>
                  <div className="text-[10px] text-slate-500">{feat.weeklyInteractions} haftalık etkileşim</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* KATMAN B: PORTFÖY & FİNANSAL EĞİLİMLER (AGREGATİF, SIFIR TEKİL VERİ) */}
      {/* ========================================================================= */}
      {activeSubTab === 'layer_b' && (
        <div className="space-y-6">
          
          {/* Privacy Protection Banner */}
          <div className="p-4 bg-emerald-950/30 border border-emerald-800/50 rounded-2xl flex items-start gap-3">
            <Shield className="text-emerald-400 shrink-0 mt-0.5" size={20} />
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-emerald-300 block text-sm font-bold">K-Anonymity & Gizlilik Korumalı Portföy Trendleri (Katman B)</strong>
              Bu sekmedeki tüm finansal ve portföy göstergeleri tamamen anonimleştirilmiş ve kümelenmiştir. 
              Hiçbir bireysel kullanıcı adı, kimliği veya tekil portföyü gösterilmez. 5'ten az kullanıcının yer aldığı segmentler kimlik ifşasını önlemek amacıyla otomatik olarak korumalı kategoriye alınmıştır.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Top Watchlisted Assets */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp size={16} className="text-amber-400" />
                Platformda En Çok Takip Edilen Varlıklar (Watchlist Trendi)
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={portfolio.topWatchlistedTickers || []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis type="number" stroke="#64748b" fontSize={11} />
                    <YAxis dataKey="symbol" type="category" stroke="#cbd5e1" fontSize={12} width={65} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(val, name, item: any) => [`${val} Takipçi (${item.payload.name})`, 'İzlenme']}
                    />
                    <Bar dataKey="watcherCount" fill="#f59e0b" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Held Assets */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers size={16} className="text-emerald-400" />
                Portföylerde En Çok Yer Alan Hisseler / Varlıklar
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={portfolio.topHeldTickers || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="symbol" stroke="#cbd5e1" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(val, name, item: any) => [`${val} Portföyde Mevcut`, 'Tutulma Sayısı']}
                    />
                    <Bar dataKey="holderCount" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Asset Class Distribution */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PieIcon size={16} className="text-indigo-400" />
                Kullanıcı Portföylerinin Varlık Sınıfı Dağılımı
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={portfolio.assetClassDistribution || []}
                      dataKey="percentage"
                      nameKey="assetClass"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      label={(entry: any) => `${entry.assetClass || entry.name}: %${entry.percentage || entry.value}`}
                    >
                      {(portfolio.assetClassDistribution || []).map((entry: any, index: number) => (
                        <Cell key={`asset-${index}`} fill={ASSET_CLASS_COLORS[index % ASSET_CLASS_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Portfolio Size Brackets */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 size={16} className="text-cyan-400" />
                Portföy Büyüklüğü Aralıkları (Sermaye Dilimleri)
              </h3>
              <div className="space-y-3 pt-2">
                {(portfolio.portfolioSizeBrackets || []).map((b: any, idx: number) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-white">{b.bracket}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Kullanıcı Sayısı: <span className="text-cyan-400 font-semibold">{b.userCount}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-1 bg-cyan-950/60 border border-cyan-800 text-cyan-300 font-mono font-bold rounded-lg">
                        %{b.percentage}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* KATMAN C: BİREYSEL KULLANICI DESTEK GÖRÜNÜMÜ (ZORUNLU GEREKÇE + AUDIT LOG) */}
      {/* ========================================================================= */}
      {activeSubTab === 'layer_c' && (
        <div className="space-y-6">
          
          {/* Strict KVKK & Audit Warning Banner */}
          <div className="p-5 bg-rose-950/40 border border-rose-600/50 rounded-2xl shadow-lg space-y-2">
            <div className="flex items-center gap-2.5 text-rose-400 font-black text-sm">
              <ShieldAlert size={20} />
              <span>DİKKAT: Bireysel Kullanıcı Destek ve Denetim Görünümü (Katman C)</span>
            </div>
            <p className="text-xs text-rose-200/80 leading-relaxed">
              Bu görünüm kişisel veri (PII) ve kullanıcı kullanım detayları içerir. 
              <strong> KVKK, GDPR ve İç Denetim Protokolü gereğince</strong>, yapacağınız her sorgulama girdiğiniz 
              <strong> "İnceleme Gerekçesi"</strong>, sistem yönetici e-postanız ve IP adresinizle birlikte 
              <strong> kalıcı ve silinemez denetim kayıtlarına (Audit Log)</strong> işlenmektedir. Gerekçesiz sorgu yapılamaz.
            </p>
          </div>

          {/* Search with Mandatory Reason Form */}
          <form onSubmit={handleFetchSupportDetail} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Hedef Kullanıcı UID veya E-Posta *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={targetUserId}
                    onChange={(e) => setTargetUserId(e.target.value)}
                    placeholder="Örn: user_sample_1 veya analist@marketpulse.local"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                  <Search size={15} className="absolute right-3.5 top-3 text-slate-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Zorunlu İnceleme Gerekçesi (En az 5 karakter) *
                </label>
                <input
                  type="text"
                  value={supportReason}
                  onChange={(e) => setSupportReason(e.target.value)}
                  placeholder="Örn: #1042 nolu müşteri destek bileti kapsamında abonelik kota incelemesi"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">
                {supportReason.length < 5 ? (
                  <span className="text-amber-400">⚠️ Butonun aktif olması için geçerli bir gerekçe yazınız ({supportReason.length}/5)</span>
                ) : (
                  <span className="text-emerald-400 font-semibold">✓ Gerekçe doğrulandı, denetim kaydı oluşturulacak</span>
                )}
              </span>

              <button
                type="submit"
                disabled={isFetchingSupport || !targetUserId.trim() || supportReason.trim().length < 5}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isFetchingSupport ? <RefreshCw size={14} className="animate-spin" /> : <Lock size={14} />}
                Gerekçeli Destek Verisini Getir
              </button>
            </div>
          </form>

          {supportError && (
            <div className="p-4 bg-rose-950/40 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle size={16} />
              <span>{supportError}</span>
            </div>
          )}

          {/* Support Data Result Card */}
          {supportUserResult && (
            <div className="bg-slate-900 border border-emerald-500/30 p-5 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                    {supportUserResult.fullName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{supportUserResult.fullName}</h3>
                    <p className="text-xs text-slate-400 font-mono">{supportUserResult.email} (UID: {supportUserResult.uid})</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase ${
                    supportUserResult.subscription?.tier === 'premium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    supportUserResult.subscription?.tier === 'pro' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {supportUserResult.subscription?.tier}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    supportUserResult.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {supportUserResult.isActive ? 'Aktif Hesap' : 'Askıda'}
                  </span>
                </div>
              </div>

              {/* Minimal Necessary Support Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 block">Günlük Analiz Kullanımı</span>
                  <span className="text-base font-bold text-white">
                    {supportUserResult.usage?.analysisQueriesToday || 0} Sorgu
                  </span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 block">Dönem AI Rapor Kullanımı</span>
                  <span className="text-base font-bold text-white">
                    {supportUserResult.usage?.aiReportsThisPeriod || 0} Rapor
                  </span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 block">Kayıt Tarihi</span>
                  <span className="text-slate-300 font-mono">
                    {supportUserResult.createdAt ? new Date(supportUserResult.createdAt).toLocaleDateString('tr-TR') : '—'}
                  </span>
                </div>
              </div>

              {/* Audit Receipt Stamp */}
              <div className="p-3 bg-slate-950 border border-indigo-500/20 rounded-xl text-[11px] text-slate-400 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Denetim Makbuzu: Bu erişim <strong>"{supportUserResult.auditNotice?.loggedReason}"</strong> gerekçesiyle Audit Log'a işlendi.</span>
                </div>
                <span className="font-mono text-slate-500">{new Date(supportUserResult.auditNotice?.accessTimestamp).toLocaleTimeString('tr-TR')}</span>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* YAPAY ZEKÂ STRATEJİ MOTORU & MODEL SEÇİMİ (ADMİN ÖZEL) */}
      {/* ========================================================================= */}
      {activeSubTab === 'ai_insights' && (
        <div className="space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Cpu size={18} className="text-purple-400" />
                  Yapay Zekâ Model Seçimi & Yönetici İçgörü Motoru
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Platformdaki anonim kullanıcı ve portföy verilerini dilediğiniz **Gemini** veya **Yerel (Local/Ollama/LM Studio)** modeli ile analiz ettirin.
                </p>
              </div>

              <button
                onClick={handleRunAiAnalysis}
                disabled={isGeneratingAi}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black rounded-xl shadow-lg shadow-purple-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
              >
                {isGeneratingAi ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                Platform Analitiğini AI ile Yorumla
              </button>
            </div>

            {/* Model Configuration Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-800">
              
              {/* Provider Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Yapay Zeka Sağlayıcısı
                </label>
                <select
                  value={aiProvider}
                  onChange={(e) => {
                    const prov = e.target.value as any;
                    setAiProvider(prov);
                    if (prov === 'gemini') setSelectedAiModel('gemini-3.7-flash');
                    if (prov === 'ollama') setSelectedAiModel('deepseek-r1:latest');
                    if (prov === 'custom_local') setSelectedAiModel('custom-model');
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="gemini">Google Cloud (Gemini API)</option>
                  <option value="ollama">Yerel Sunucu (Ollama / Local LLM)</option>
                  <option value="custom_local">Özel Yerel Endpoint (LM Studio / vLLM)</option>
                </select>
              </div>

              {/* Model Name Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Model Adı / Seçimi
                </label>
                {aiProvider === 'gemini' ? (
                  <select
                    value={selectedAiModel}
                    onChange={(e) => setSelectedAiModel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="gemini-3.7-flash">Gemini 3.7 Flash (Önerilen & Hızlı)</option>
                    <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro Preview (İleri Finansal Akıl)</option>
                    <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Hafif)</option>
                    <option value="gemini-2.5-pro">Gemini 2.5 Pro (Geniş Bağlam)</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={selectedAiModel}
                    onChange={(e) => setSelectedAiModel(e.target.value)}
                    placeholder="Örn: deepseek-r1:latest veya llama3.3:70b"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                )}
              </div>

              {/* Temperature Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                  <span>Yaratıcılık / Sıcaklık</span>
                  <span className="text-purple-400 font-mono">{aiTemperature}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.1"
                  value={aiTemperature}
                  onChange={(e) => setAiTemperature(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 mt-2"
                />
              </div>

            </div>

            {/* Custom Local Endpoint Field (If Local Provider) */}
            {aiProvider !== 'gemini' && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300 font-bold">
                  <Server size={14} className="text-purple-400" />
                  <span>Yerel LLM Endpoint URL</span>
                </div>
                <input
                  type="text"
                  value={customEndpointUrl}
                  onChange={(e) => setCustomEndpointUrl(e.target.value)}
                  placeholder="http://localhost:11434/api/generate veya http://localhost:1234/v1/chat/completions"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                />
                <p className="text-[11px] text-slate-500">
                  Ollama için varsayılan: <code className="text-purple-400">http://localhost:11434/api/generate</code>. LM Studio veya OpenAI uyumlu yerel sunucular için: <code className="text-purple-400">http://localhost:1234/v1/chat/completions</code>.
                </p>
              </div>
            )}

          </div>

          {/* Generated AI Executive Report */}
          {aiReportResult && (
            <div className="bg-slate-900 border border-purple-500/30 p-6 rounded-2xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Yönetici Strateji & Trend Raporu</h3>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span>Model: <strong className="text-purple-300 font-mono">{aiReportResult.modelUsed}</strong></span>
                  <span>•</span>
                  <span>Süre: <strong className="text-emerald-400">{aiReportResult.executionTimeMs} ms</strong></span>
                </div>
              </div>

              <div className="prose prose-invert prose-xs sm:prose-sm max-w-none text-slate-300 leading-relaxed bg-slate-950 p-5 rounded-xl border border-slate-800">
                <ReactMarkdown>{aiReportResult.reportMarkdown || ''}</ReactMarkdown>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
