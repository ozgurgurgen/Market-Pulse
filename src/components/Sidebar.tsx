import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  BarChart3, 
  Bot, 
  Bookmark, 
  Cpu, 
  RefreshCw, Settings, 
  SlidersHorizontal,
  X,
  Pin,
  PinOff,
  Zap,
  Wallet,
  Landmark,
  FileSpreadsheet,
  GraduationCap,
  ShieldAlert,
  LogOut,
  User as UserIcon,
  Crown,
  Building2,
  LayoutGrid
} from 'lucide-react';
import { MarketCategory, AIModelConfig } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';


export interface TabItem {
  id: 'opportunities' | 'latest_financials' | 'screener' | 'heatmap' | 'ipo' | 'academy' | 'intelligence' | 'portfolio' | 'macro' | 'tefas' | 'backtest' | 'markets' | 'chat' | 'watchlist' | 'settings' | 'admin' | 'pricing';
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
  description?: string;
  permission?: string;
}

export const MAIN_NAVIGATION_TABS: TabItem[] = [
  {
    id: "admin",
    label: "Admin Panel",
    shortLabel: "Admin",
    icon: ShieldAlert,
    description: "Yetki, Roller ve Platform Ayarları",
    permission: 'admin.panel'
  },
  {
    id: "pricing",
    label: "Üyelik Paketleri",
    shortLabel: "Paketler",
    icon: Crown,
    badge: "PRO",
    description: "Ücretsiz, Başlangıç, Pro ve Premium Planlar"
  },
  { 
    id: 'opportunities', 
    label: 'AI Fırsat Radarı', 
    shortLabel: 'Fırsatlar',
    icon: Sparkles,
    description: 'Yapay zeka sinyalleri ve taramalar'
  },
  { 
    id: 'heatmap', 
    label: 'Sektörel Isı Haritası', 
    shortLabel: 'Isı Haritası',
    icon: LayoutGrid,
    badge: 'BIST Canlı',
    description: 'Sektörel piyasa değeri ve değişim treemap matrisi'
  },
  { 
    id: 'ipo', 
    label: 'Halka Arz Takip', 
    shortLabel: 'Halka Arz',
    icon: Building2,
    badge: 'KAP',
    description: 'KAP onaylı takvim, talep ve sektör analizi'
  },
  { 
    id: 'latest_financials', 
    label: 'Son Bilançolar', 
    shortLabel: 'Bilançolar',
    icon: FileSpreadsheet,
    badge: 'KAP Canlı',
    description: 'Açıklanan son finansal tablolar ve karne skorları'
  },
  { 
    id: 'screener', 
    label: 'Gelişmiş Tarama', 
    shortLabel: 'Filtrele',
    icon: SlidersHorizontal,
    badge: 'Pro',
    description: 'F/K, PD/DD, ROE, 18 Kriterli Karne filtresi'
  },
  { 
    id: 'academy', 
    label: 'Analiz Akademisi', 
    shortLabel: 'Akademi',
    icon: GraduationCap,
    badge: 'Rehber',
    description: 'Finansal rasyolar ve enflasyon muhasebesi kılavuzu'
  },
  { 
    id: 'macro', 
    label: 'Ekonomik Göstergeler', 
    shortLabel: 'Makro',
    icon: Landmark,
    badge: 'TCMB/FED',
    description: 'Faiz, enflasyon, kurlar ve YZ makro yorumu'
  },
  { 
    id: 'portfolio', 
    label: 'Portföy Yönetimi', 
    shortLabel: 'Portföy',
    icon: Wallet,
    badge: 'v1.0',
    description: 'Canlı takip, kâr/zarar, AI önerileri'
  },
  { 
    id: 'intelligence', 
    label: 'Finansal İstihbarat', 
    shortLabel: 'İstihbarat',
    icon: Zap,
    badge: '4-Agent',
    description: 'Haber, duygu, teknik ve Telegram istihbaratı'
  },
  { 
    id: 'tefas', 
    label: 'TEFAS Fonları', 
    shortLabel: 'TEFAS',
    icon: ShieldCheck, 
    badge: 'TÜFE+',
    description: 'Enflasyon korumalı fon analizi'
  },
  { 
    id: 'backtest', 
    label: 'Portföy Backtest', 
    shortLabel: 'Backtest',
    icon: TrendingUp,
    description: 'Monte Carlo & Sharpe simülasyonu'
  },
  { 
    id: 'markets', 
    label: 'Canlı Piyasalar', 
    shortLabel: 'Piyasalar',
    icon: BarChart3,
    description: 'BIST 100, NASDAQ, Kripto, Altın'
  },
  { 
    id: 'chat', 
    label: 'AI Danışman', 
    shortLabel: 'Danışman',
    icon: Bot,
    description: 'Kıdemli finansal analiz asistanı'
  },
  {
    id: "settings",
    label: "Ayarlar",
    shortLabel: "Ayarlar",
    icon: Settings,
    description: "Uygulama tercihleri"
  },
  {
    id: "watchlist", 
    label: 'İzleme Listesi', 
    shortLabel: 'İzleme',
    icon: Bookmark,
    description: 'Kişisel takip ve alarmlarınız'
  },
];

export const MARKET_CATEGORIES: { id: MarketCategory; label: string; icon: string }[] = [
  { id: 'ALL', label: 'Tüm Piyasalar', icon: '🌐' },
  { id: 'BIST', label: 'BIST 100', icon: '🇹🇷' },
  { id: 'US_STOCKS', label: 'ABD & NASDAQ', icon: '🇺🇸' },
  { id: 'ETF', label: 'ETF Fonları (200+)', icon: '📊' },
  { id: 'CRYPTO', label: 'Kripto Para', icon: '🪙' },
  { id: 'COMMODITIES', label: 'Altın & Emtia', icon: '🏆' },
  { id: 'FOREX', label: 'Döviz', icon: '💱' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabItem['id'];
  setActiveTab: (tab: TabItem['id']) => void;
  selectedCategory: MarketCategory;
  setSelectedCategory: (cat: MarketCategory) => void;
  watchlistCount: number;
  modelConfig: AIModelConfig;
  onOpenModelSettings: () => void;
  onRefreshAll: () => void;
  isRefreshing: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  watchlistCount,
  modelConfig,
  onOpenModelSettings,
  onRefreshAll,
  isRefreshing,
}) => {
  const { hasPermission, user, userData, logout } = useAuth();
  const { tier, plan, openPricingModal, isAdmin } = useSubscription();

  const getModelBadgeText = () => {
    if (modelConfig.provider === 'ollama') {
      const name = modelConfig.ollamaModel.split(':')[0];
      return `Ollama: ${name}`;
    }
    if (modelConfig.provider === 'custom') {
      return modelConfig.customModelName || 'Özel API';
    }
    const shortName = modelConfig.geminiModel.replace('gemini-', '');
    return `Gemini ${shortName}`;
  };

  const handleTabClick = (tabId: TabItem['id']) => {
    setActiveTab(tabId);
    onClose();
  };

  const filteredMenu = MAIN_NAVIGATION_TABS.filter(item => {
    if (item.id === 'admin') {
      return userData?.role === 'admin' || userData?.role === 'superadmin' || user?.email === 'boschozgur@gmail.com';
    }
    if ((item as any).permission) {
      return hasPermission((item as any).permission);
    }
    return true;
  });

  return (
    <>
      {/* 1. Backdrop Overlay */}
      {isOpen && (
        <div 
          id="sidebar-backdrop"
          className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* 2. Slide-out Drawer Container */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-900 border-r border-slate-800 shadow-2xl transition-all duration-300 ease-in-out select-none w-80 max-w-[85vw] ${
          isOpen ? 'translate-x-0 opacity-100 visible' : '-translate-x-full opacity-0 pointer-events-none invisible'
        }`}
      >
        {/* Header with Brand & Close Button */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800 bg-slate-950/70 shrink-0">
          <div 
            onClick={() => handleTabClick('opportunities')}
            className="flex items-center gap-3 cursor-pointer group"
            title="MarketPulse AI Ana Sayfa"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-cyan-500 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-white">
                  MarketPulse <span className="text-emerald-400">AI</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/80 shrink-0">
                  Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Finans & Portföy Zekası</p>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            id="sidebar-close-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Menüyü Kapat"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            ANA MODÜLLER
          </div>

          {filteredMenu.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isWatchlistTab = tab.id === 'watchlist';

            return (
              <button
                key={tab.id}
                type="button"
                id={`sidebar-tab-${tab.id}`}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 transition-colors ${
                  isActive 
                    ? 'bg-slate-950/20 text-slate-950' 
                    : 'bg-slate-800/80 text-slate-400 group-hover:text-emerald-400 group-hover:bg-slate-800'
                }`}>
                  <Icon size={18} className={isActive ? 'text-slate-950' : undefined} />
                </div>

                <div className="flex-1 text-left truncate">
                  <div className="flex items-center justify-between">
                    <span className="truncate">{tab.label}</span>
                    
                    {tab.badge && (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-black ${
                        isActive 
                          ? 'bg-slate-950 text-emerald-300' 
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {tab.badge}
                      </span>
                    )}

                    {isWatchlistTab && watchlistCount > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                        isActive 
                          ? 'bg-slate-950 text-amber-300' 
                          : 'bg-amber-500 text-slate-950'
                      }`}>
                        {watchlistCount}
                      </span>
                    )}
                  </div>
                  {tab.description && (
                    <p className={`text-[10px] truncate ${isActive ? 'text-slate-900/80' : 'text-slate-500'}`}>
                      {tab.description}
                    </p>
                  )}
                </div>
              </button>
            );
          })}

          {/* Category Filter Selector (For quick access) */}
          <div className="pt-4 mt-3 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <span className="flex items-center gap-1">
                <SlidersHorizontal size={11} className="text-emerald-400" />
                Piyasa Filtresi
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-1.5 px-1">
              {MARKET_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    id={`sidebar-cat-filter-${cat.id}`}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      if (activeTab !== 'opportunities' && activeTab !== 'markets') {
                        setActiveTab('opportunities');
                      }
                      onClose();
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer text-left truncate ${
                      isSelected
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 font-bold'
                        : 'text-slate-400 hover:text-slate-200 bg-slate-950/40 hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <span className="shrink-0">{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer: User Account, AI Engine Status & Refresh */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 shrink-0 space-y-2">
          
          {/* Active User Info & Sign Out */}
          <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <UserIcon size={16} />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-xs font-bold text-slate-100 truncate">
                    {userData?.fullName || user?.displayName || user?.email?.split('@')[0] || 'Kullanıcı'}
                  </span>
                  <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full border ${
                    isAdmin ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                    tier === 'premium' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                    tier === 'pro' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                    tier === 'starter' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                    'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {isAdmin ? 'Admin' : plan.displayName}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {user?.email || (user?.isAnonymous ? 'Misafir Hesabı' : 'Giriş Yapıldı')}
                </div>
              </div>
            </div>

            <button
              type="button"
              id="sidebar-logout-btn"
              onClick={() => {
                logout();
                onClose();
              }}
              className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl transition-colors cursor-pointer shrink-0 flex items-center gap-1 text-[11px] font-bold"
              title="Oturumu Kapat"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Çıkış</span>
            </button>
          </div>

          {/* Subscription Upgrade / Plan Button or Admin Exemption Badge */}
          {isAdmin ? (
            <div
              id="sidebar-admin-status-box"
              className="w-full p-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 flex items-center justify-between text-xs select-none"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span className="font-bold">Yönetici (Admin)</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-black border border-emerald-500/30">
                PAKETE TABİ DEĞİL
              </span>
            </div>
          ) : (
            <button
              type="button"
              id="sidebar-subscription-btn"
              onClick={() => {
                setActiveTab('pricing');
                onClose();
              }}
              className={`w-full p-2.5 rounded-2xl border transition-all flex items-center justify-between text-xs cursor-pointer ${
                tier === 'free'
                  ? 'bg-gradient-to-r from-purple-900/30 to-amber-900/30 border-purple-500/30 hover:border-purple-500/50 text-purple-200'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Crown size={14} className={tier === 'free' ? 'text-amber-400 animate-pulse' : 'text-purple-400'} />
                <span className="font-bold">{tier === 'free' ? 'Pro\'ya Yükselt' : 'Paketleri Yönet'}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                {tier.toUpperCase()}
              </span>
            </button>
          )}

          <button
            type="button"
            id="sidebar-ai-config-btn"
            onClick={() => {
              onOpenModelSettings();
              onClose();
            }}
            className="w-full p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer"
            title="Yapay Zeka Motorunu Yapılandır"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
              <Cpu size={16} className={modelConfig.provider === 'ollama' ? 'text-cyan-400' : 'text-emerald-400'} />
            </div>

            <div className="flex-1 text-left truncate">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">AI Motoru</div>
              <div className="text-xs font-bold text-slate-200 truncate">{getModelBadgeText()}</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              onRefreshAll();
              onClose();
            }}
            disabled={isRefreshing}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-emerald-400' : 'text-slate-400'} />
            <span>{isRefreshing ? 'Veriler Güncelleniyor...' : 'Piyasayı Yenile'}</span>
          </button>
        </div>

      </aside>
    </>
  );
};
