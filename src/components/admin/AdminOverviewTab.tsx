import React from 'react';
import { 
  Users, 
  Cpu, 
  Crown, 
  ShieldCheck, 
  RefreshCw, 
  Zap, 
  Database, 
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Server
} from 'lucide-react';
import { SubscriptionPlanConfig } from '../../shared/subscriptionPlans';

interface AdminOverviewProps {
  stats: {
    totalUsers: number;
    planDistribution: {
      free: number;
      starter: number;
      pro: number;
      premium: number;
    };
    aiStatus: string;
    activeAiModel: string;
    uptimeSeconds?: number;
    recentAudits?: any[];
  };
  onRefresh: () => void;
  isRefreshing: boolean;
  onSelectTab: (tab: any) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewProps> = ({
  stats,
  onRefresh,
  isRefreshing,
  onSelectTab
}) => {
  const formatUptime = (seconds?: number) => {
    if (!seconds) return '—';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs} saat ${mins} dk`;
  };

  return (
    <div id="admin-overview-tab" className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Users */}
        <div 
          onClick={() => onSelectTab('users')}
          className="p-5 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Toplam Kullanıcı</span>
            <div className="p-2.5 bg-indigo-500/15 text-indigo-400 rounded-xl group-hover:scale-110 transition-transform">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{stats.totalUsers || 0}</span>
            <span className="text-[11px] text-indigo-400 ml-2 font-semibold">Kayıtlı Hesap</span>
          </div>
        </div>

        {/* Paid Users (Starter + Pro + Premium) */}
        <div 
          onClick={() => onSelectTab('subscriptions')}
          className="p-5 bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-2xl shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Ücretli Üyeler</span>
            <div className="p-2.5 bg-purple-500/15 text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
              <Crown size={18} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-purple-300">
              {(stats.planDistribution?.starter || 0) + (stats.planDistribution?.pro || 0) + (stats.planDistribution?.premium || 0)}
            </span>
            <span className="text-[11px] text-purple-400 ml-2 font-semibold">
              / {stats.totalUsers || 0} kullanıcı
            </span>
          </div>
        </div>

        {/* AI Engine Status */}
        <div 
          onClick={() => onSelectTab('ai')}
          className="p-5 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">AI Motor Durumu</span>
            <div className={`p-2.5 rounded-xl ${stats.aiStatus === 'ONLINE' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>
              <Cpu size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className={`text-lg font-black ${stats.aiStatus === 'ONLINE' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {stats.aiStatus === 'ONLINE' ? '🟢 AKTİF (Online)' : '🔴 DEVRE DIŞI'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono mt-1 truncate">{stats.activeAiModel || 'gemini-3.7-flash'}</p>
        </div>

        {/* System Uptime */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Sunucu Çalışma Süresi</span>
            <div className="p-2.5 bg-cyan-500/15 text-cyan-400 rounded-xl">
              <Activity size={18} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl font-black text-cyan-300 font-mono">{formatUptime(stats.uptimeSeconds)}</span>
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
            <CheckCircle2 size={12} /> Kesintisiz Servis
          </p>
        </div>

      </div>

      {/* Live System & Host PC Performance Banner */}
      <div 
        onClick={() => onSelectTab('system_performance')}
        className="p-4 bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 rounded-2xl shadow-lg transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/15 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
            <Activity size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Canlı Sistem, PC Donanım & DB Performans Telemetrisi</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                CANLI METRİKLER
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Host PC CPU & RAM kullanımı, Disk alanı, Node.js V8 Heap, Event Loop gecikmesi ve PostgreSQL tablo boyutlarını anlık izleyin.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 group-hover:text-emerald-300 shrink-0">
          <span>Performans Konsolunu Aç</span>
          <ArrowUpRight size={16} />
        </div>
      </div>

      {/* Plan Distribution Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Crown className="text-purple-400" size={18} />
            <h2 className="text-sm font-bold text-white">Üyelik Planı Dağılımı</h2>
          </div>
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
            Yenile
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          {/* Free Tier */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Ücretsiz (Free)</span>
              <span className="w-2 h-2 rounded-full bg-slate-400" />
            </div>
            <p className="text-2xl font-black text-slate-200">{stats.planDistribution?.free || 0}</p>
            <span className="text-[10px] text-slate-500 font-mono">
              %{stats.totalUsers ? Math.round(((stats.planDistribution?.free || 0) / stats.totalUsers) * 100) : 0} oran
            </span>
          </div>

          {/* Starter Tier */}
          <div className="p-4 bg-slate-950/70 border border-blue-500/20 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400">Başlangıç (Starter)</span>
              <span className="w-2 h-2 rounded-full bg-blue-400" />
            </div>
            <p className="text-2xl font-black text-blue-300">{stats.planDistribution?.starter || 0}</p>
            <span className="text-[10px] text-slate-500 font-mono">
              %{stats.totalUsers ? Math.round(((stats.planDistribution?.starter || 0) / stats.totalUsers) * 100) : 0} oran
            </span>
          </div>

          {/* Pro Tier */}
          <div className="p-4 bg-slate-950/70 border border-purple-500/20 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400">Pro</span>
              <span className="w-2 h-2 rounded-full bg-purple-400" />
            </div>
            <p className="text-2xl font-black text-purple-300">{stats.planDistribution?.pro || 0}</p>
            <span className="text-[10px] text-slate-500 font-mono">
              %{stats.totalUsers ? Math.round(((stats.planDistribution?.pro || 0) / stats.totalUsers) * 100) : 0} oran
            </span>
          </div>

          {/* Premium Tier */}
          <div className="p-4 bg-slate-950/70 border border-amber-500/20 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400">Kurumsal (Premium)</span>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            </div>
            <p className="text-2xl font-black text-amber-300">{stats.planDistribution?.premium || 0}</p>
            <span className="text-[10px] text-slate-500 font-mono">
              %{stats.totalUsers ? Math.round(((stats.planDistribution?.premium || 0) / stats.totalUsers) * 100) : 0} oran
            </span>
          </div>

        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        <div 
          onClick={() => onSelectTab('system_performance')}
          className="p-5 bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-500/40 rounded-2xl hover:border-emerald-400 transition-all cursor-pointer space-y-2 group shadow-lg"
        >
          <div className="flex items-center gap-2">
            <Activity className="text-emerald-400 group-hover:scale-110 transition-transform" size={20} />
            <h3 className="text-sm font-bold text-white">Sistem, PC & DB Performansı</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Host PC CPU & RAM, Disk alanı, Node.js V8 Heap, Event Loop gecikmesi ve canlı SQL tablo boyutları.
          </p>
        </div>

        <div 
          onClick={() => onSelectTab('api_management')}
          className="p-5 bg-gradient-to-br from-slate-900 to-blue-950/40 border border-blue-500/40 rounded-2xl hover:border-blue-400 transition-all cursor-pointer space-y-2 group shadow-lg"
        >
          <div className="flex items-center gap-2">
            <Activity className="text-blue-400 group-hover:scale-110 transition-transform" size={20} />
            <h3 className="text-sm font-bold text-white">API Analiz & Tanı</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            İstek hacimleri, eksik null veriler, yanıt gecikmeleri ve senkron sıklıkları.
          </p>
        </div>

        <div 
          onClick={() => onSelectTab('subscriptions')}
          className="p-5 bg-gradient-to-br from-slate-900 to-purple-950/30 border border-purple-500/30 rounded-2xl hover:border-purple-400 transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center gap-2">
            <Crown className="text-purple-400 group-hover:scale-110 transition-transform" size={20} />
            <h3 className="text-sm font-bold text-white">Üyelik İnce Ayar</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Paket limitlerini, fiyatlandırmaları ve modül izinlerini dinamik olarak değiştirin.
          </p>
        </div>

        <div 
          onClick={() => onSelectTab('database')}
          className="p-5 bg-gradient-to-br from-slate-900 to-blue-950/30 border border-blue-500/30 rounded-2xl hover:border-blue-400 transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center gap-2">
            <Database className="text-blue-400 group-hover:scale-110 transition-transform" size={20} />
            <h3 className="text-sm font-bold text-white">DB & PostgreSQL</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            PostgreSQL (Cloud SQL) ve Firebase veri depolarını yapılandırın ve geçiş yapın.
          </p>
        </div>

        <div 
          onClick={() => onSelectTab('ai')}
          className="p-5 bg-gradient-to-br from-slate-900 to-emerald-950/30 border border-emerald-500/30 rounded-2xl hover:border-emerald-400 transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center gap-2">
            <Cpu className="text-emerald-400 group-hover:scale-110 transition-transform" size={20} />
            <h3 className="text-sm font-bold text-white">AI Motor & Model</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Acil durum kill-switch'i yönetin, her pakete özel Gemini modelini atayın.
          </p>
        </div>

        <div 
          onClick={() => onSelectTab('users')}
          className="p-5 bg-gradient-to-br from-slate-900 to-indigo-950/30 border border-indigo-500/30 rounded-2xl hover:border-indigo-400 transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center gap-2">
            <Users className="text-indigo-400 group-hover:scale-110 transition-transform" size={20} />
            <h3 className="text-sm font-bold text-white">Kullanıcı Yönetimi</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Manuel paket yetkilendirme, kota sıfırlama ve yönetici rolü atamaları yapın.
          </p>
        </div>

      </div>
    </div>
  );
};
