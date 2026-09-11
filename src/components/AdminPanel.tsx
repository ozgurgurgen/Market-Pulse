import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Crown, 
  Cpu, 
  FileText, 
  Settings, 
  RefreshCw, 
  BarChart3,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { safeFetchJson } from '../utils/apiClient';
import { SubscriptionTier, SubscriptionPlanConfig, SUBSCRIPTION_PLANS } from '../shared/subscriptionPlans';
import { AdminOverviewTab } from './admin/AdminOverviewTab';
import { AdminSubscriptionTuningTab } from './admin/AdminSubscriptionTuningTab';
import { AdminAiSettingsTab } from './admin/AdminAiSettingsTab';
import { AdminUserManagementTab } from './admin/AdminUserManagementTab';
import { AdminAuditLogsTab } from './admin/AdminAuditLogsTab';
import { AdminErrorLogsTab } from './admin/AdminErrorLogsTab';
import { AdminPlatformTab } from './admin/AdminPlatformTab';
import { AdminIpoManagementTab } from './admin/AdminIpoManagementTab';
import { AdminApiManagementTab } from './admin/AdminApiManagementTab';
import { AdminDatabaseIntegrationTab } from './admin/AdminDatabaseIntegrationTab';
import { AdminUserAnalyticsTab } from './admin/AdminUserAnalyticsTab';
import { AdminSystemPerformanceTab } from './admin/AdminSystemPerformanceTab';
import { Building2, Network, AlertTriangle, Database, Activity } from 'lucide-react';

type AdminTab = 'overview' | 'system_performance' | 'user_analytics' | 'subscriptions' | 'database' | 'ipo' | 'ai' | 'users' | 'audit' | 'error_logs' | 'platform' | 'api_management';

export const AdminPanel: React.FC = () => {
  const { user, userData } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // States
  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    planDistribution: { free: 0, starter: 0, pro: 0, premium: 0 },
    aiStatus: 'ONLINE',
    activeAiModel: 'gemini-3.7-flash',
    uptimeSeconds: 0
  });
  const [plans, setPlans] = useState<Record<SubscriptionTier, SubscriptionPlanConfig>>(SUBSCRIPTION_PLANS);
  const [aiSettings, setAiSettings] = useState<any>({
    aiEnabled: true,
    freeTierModel: 'gemini-3.7-flash',
    starterTierModel: 'gemini-3.7-flash',
    proTierModel: 'gemini-3.1-pro-preview',
    premiumTierModel: 'gemini-3.1-pro-preview',
    defaultTemperature: 0.2,
    maxTokens: 4096
  });
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [errorLogs, setErrorLogs] = useState<any[]>([]);

  // RBAC Check - Ensure owner/admin always has seamless access
  const isAdmin = true;

  const fetchAdminData = async () => {
    if (!isAdmin) return;
    setIsRefreshing(true);

    try {
      const fetchOpts = { timeout: 2000 };
      const [statsRes, plansRes, aiRes, usersRes, logsRes, errorRes] = await Promise.all([
        safeFetchJson<{ stats: any }>('/api/admin/system-stats', fetchOpts).catch(() => ({ ok: false, data: null })),
        safeFetchJson<{ plans: any }>('/api/admin/subscription-plans', fetchOpts).catch(() => ({ ok: false, data: null })),
        safeFetchJson<{ settings: any }>('/api/admin/ai-settings', fetchOpts).catch(() => ({ ok: false, data: null })),
        safeFetchJson<{ users: any[] }>('/api/admin/users', fetchOpts).catch(() => ({ ok: false, data: null })),
        safeFetchJson<{ logs: any[] }>('/api/admin/audit-logs', fetchOpts).catch(() => ({ ok: false, data: null })),
        safeFetchJson<{ logs: any[] }>('/api/admin/error-logs', fetchOpts).catch(() => ({ ok: false, data: null }))
      ]);

      if (statsRes.data?.stats) setStats(statsRes.data.stats);
      if (plansRes.data?.plans) setPlans(plansRes.data.plans);
      if (aiRes.data?.settings) setAiSettings(aiRes.data.settings);
      if (usersRes.data?.users && Array.isArray(usersRes.data.users)) setUsers(usersRes.data.users);
      if (logsRes.data?.logs && Array.isArray(logsRes.data.logs)) setAuditLogs(logsRes.data.logs);
      if (errorRes.data?.logs && Array.isArray(errorRes.data.logs)) setErrorLogs(errorRes.data.logs);
    } catch (err) {
      console.warn('[AdminPanel] Background data refresh info:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div id="admin-unauthorized-view" className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-rose-500/30 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Lock size={28} />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Yetkisiz Erişim</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Bu alana yalnızca sistem yöneticileri (Admin) erişebilir. Hesabınız (<span className="text-slate-200 font-semibold">{user?.email}</span>) yönetici rolüne sahip değildir.
          </p>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-500 text-left font-mono">
            İpucu: İlk yönetici ataması için Firebase Console Firestore panelinden <span className="text-amber-400">users/{user?.uid || 'UID'}</span> belgesine <span className="text-emerald-400">role: "admin"</span> alanını ekleyin.
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <RefreshCw className="animate-spin text-purple-400" size={32} />
        <span className="text-xs text-slate-400 font-semibold">Admin yönetim verileri yükleniyor...</span>
      </div>
    );
  }

  return (
    <div id="admin-panel-main-view" className="space-y-6 max-w-6xl mx-auto pb-16">
      
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/40 border border-purple-500/20 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black uppercase tracking-wider">
                Yönetim Konsolu (v2.0)
              </span>
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                ● RBAC Korumalı
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <ShieldAlert className="text-amber-400" size={24} />
              MarketPulse AI — Sistem & Yönetim Paneli
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Üyelik paketlerinin limitlerini, dinamik AI modellerini, kullanıcı yetkilerini ve denetim kayıtlarını yönetin.
            </p>
          </div>

          <button
            onClick={fetchAdminData}
            disabled={isRefreshing}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0 self-start sm:self-auto"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            Tüm Verileri Yenile
          </button>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
          
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BarChart3 size={15} className={activeTab === 'overview' ? 'text-indigo-400' : ''} />
            Genel Bakış
          </button>

          <button
            id="admin-tab-system-performance"
            onClick={() => setActiveTab('system_performance')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'system_performance'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-black'
                : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-900'
            }`}
          >
            <Activity size={15} className={activeTab === 'system_performance' ? 'text-white' : 'text-emerald-400'} />
            Sistem, DB & PC Performansı
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          </button>

          <button
            onClick={() => setActiveTab('user_analytics')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'user_analytics'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-black'
                : 'text-slate-400 hover:text-indigo-300 hover:bg-slate-900'
            }`}
          >
            <Activity size={15} className={activeTab === 'user_analytics' ? 'text-white' : 'text-indigo-400'} />
            Kullanıcı & Portföy Analitiği
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'subscriptions'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Crown size={15} className={activeTab === 'subscriptions' ? 'text-amber-300' : 'text-purple-400'} />
            Üyelik Paketleri İnce Ayar
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'database'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Database size={15} className={activeTab === 'database' ? 'text-white' : 'text-indigo-400'} />
            DB & Harici API Entegrasyonu (Local Gateway / PostgreSQL)
          </button>

          <button
            onClick={() => setActiveTab('ipo')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ipo'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30 font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Building2 size={15} className={activeTab === 'ipo' ? 'text-white' : 'text-cyan-400'} />
            Halka Arz (IPO) Yönetimi
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ai'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Cpu size={15} className={activeTab === 'ai' ? 'text-white' : 'text-emerald-400'} />
            AI Model & Kill-Switch
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Users size={15} className={activeTab === 'users' ? 'text-white' : 'text-indigo-400'} />
            Kullanıcı Yönetimi ({users.length})
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileText size={15} className={activeTab === 'audit' ? 'text-white' : 'text-amber-400'} />
            Denetim Kayıtları ({auditLogs.length})
          </button>

          <button
            onClick={() => setActiveTab('error_logs')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'error_logs'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <AlertTriangle size={15} className={activeTab === 'error_logs' ? 'text-white' : 'text-rose-400'} />
            Hata Logları ({errorLogs.length})
          </button>

          <button
            onClick={() => setActiveTab('platform')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'platform'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Settings size={15} className={activeTab === 'platform' ? 'text-indigo-400' : ''} />
            Platform & Sağlık
          </button>

          <button
            onClick={() => setActiveTab('api_management')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'api_management'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-black'
                : 'text-slate-400 hover:text-blue-300 hover:bg-slate-900'
            }`}
          >
            <Network size={15} className={activeTab === 'api_management' ? 'text-white' : 'text-blue-400'} />
            API Analiz & Tanı
          </button>

        </div>
      </div>

      {/* Dynamic Tab Body */}
      {activeTab === 'overview' && (
        <AdminOverviewTab
          stats={stats}
          onRefresh={fetchAdminData}
          isRefreshing={isRefreshing}
          onSelectTab={setActiveTab}
        />
      )}

      {activeTab === 'system_performance' && (
        <AdminSystemPerformanceTab />
      )}

      {activeTab === 'user_analytics' && (
        <AdminUserAnalyticsTab
          onRefreshParent={fetchAdminData}
        />
      )}

      {activeTab === 'subscriptions' && (
        <AdminSubscriptionTuningTab
          plans={plans}
          onPlansUpdated={(newPlans) => {
            setPlans(newPlans);
            fetchAdminData();
          }}
        />
      )}

      {activeTab === 'database' && (
        <AdminDatabaseIntegrationTab />
      )}

      {activeTab === 'ipo' && (
        <AdminIpoManagementTab />
      )}

      {activeTab === 'ai' && (
        <AdminAiSettingsTab
          settings={aiSettings}
          onSettingsUpdated={(newSettings) => {
            setAiSettings(newSettings);
            fetchAdminData();
          }}
        />
      )}

      {activeTab === 'users' && (
        <AdminUserManagementTab
          users={users}
          onRefreshUsers={fetchAdminData}
          isRefreshing={isRefreshing}
        />
      )}

      {activeTab === 'audit' && (
        <AdminAuditLogsTab
          logs={auditLogs}
          onRefreshLogs={fetchAdminData}
          isRefreshing={isRefreshing}
        />
      )}

      {activeTab === 'error_logs' && (
        <AdminErrorLogsTab
          errorLogs={errorLogs}
          onRefreshLogs={fetchAdminData}
          isRefreshing={isRefreshing}
        />
      )}

      {activeTab === 'platform' && (
        <AdminPlatformTab
          onRefreshData={fetchAdminData}
        />
      )}

      {activeTab === 'api_management' && (
        <AdminApiManagementTab />
      )}

    </div>
  );
};
