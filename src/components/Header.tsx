import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  Bookmark, 
  RefreshCw, 
  Cpu, 
  X,
  Menu,
  ArrowLeft,
  LogOut,
  User as UserIcon,
  Crown,
  ShieldCheck
} from 'lucide-react';
import { StockQuote, AIModelConfig } from '../types';
import { MAIN_NAVIGATION_TABS } from './Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';


interface HeaderProps {
  activeTab: 'opportunities' | 'latest_financials' | 'screener' | 'heatmap' | 'ipo' | 'academy' | 'intelligence' | 'portfolio' | 'macro' | 'tefas' | 'backtest' | 'markets' | 'chat' | 'watchlist' | 'settings' | 'admin' | 'pricing';
  setActiveTab: (tab: 'opportunities' | 'latest_financials' | 'screener' | 'heatmap' | 'ipo' | 'academy' | 'intelligence' | 'portfolio' | 'macro' | 'tefas' | 'backtest' | 'markets' | 'chat' | 'watchlist' | 'settings' | 'admin' | 'pricing') => void;
  quotes: StockQuote[];
  onSelectStock: (quote: StockQuote) => void;
  onRefreshAll: () => void;
  isRefreshing: boolean;
  watchlistCount: number;
  modelConfig: AIModelConfig;
  onOpenModelSettings: () => void;
  onOpenSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  quotes,
  onSelectStock,
  onRefreshAll,
  isRefreshing,
  watchlistCount,
  modelConfig,
  onOpenModelSettings,
  onOpenSidebar,
}) => {
  const { logout, user } = useAuth();
  const { tier, plan, openPricingModal, isAdmin } = useSubscription();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement>(null);


  const filteredSearchResults = searchQuery.trim()
    ? quotes.filter(
        (q) =>
          q.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const currentTabInfo = MAIN_NAVIGATION_TABS.find((t) => t.id === activeTab) || MAIN_NAVIGATION_TABS[0];
  const CurrentIcon = currentTabInfo.icon;

  const getModelBadgeText = () => {
    if (modelConfig.provider === 'openrouter') {
      const name = (modelConfig.openRouterModel || 'deepseek/deepseek-r1').split('/').pop();
      return `🌐 OpenRouter: ${name}`;
    }
    if (modelConfig.provider === 'ninerouter') {
      const name = modelConfig.nineRouterModel || 'local-default';
      return `⚡ 9Router: ${name}`;
    }
    if (modelConfig.provider === 'ollama') {
      const name = (modelConfig.ollamaModel || 'deepseek-r1').split(':')[0];
      return `🦙 Ollama: ${name}`;
    }
    if (modelConfig.provider === 'custom') {
      return `⚙️ ${modelConfig.customModelName || 'Özel API'}`;
    }
    const shortName = (modelConfig.geminiModel || 'gemini-3.7-flash').replace('gemini-', '');
    return `✨ Gemini ${shortName}`;
  };

  useEffect(() => {
    if (isMobileSearchActive && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [isMobileSearchActive]);

  return (
    <header id="main-header" className="z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-sm w-full">
      <div className="w-full max-w-[98vw] 2xl:max-w-[99vw] mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5">
        
        {/* Mobile Full-Width Search Bar Mode */}
        {isMobileSearchActive ? (
          <div className="flex items-center h-10 gap-2 sm:hidden relative">
            <button
              type="button"
              onClick={() => {
                setIsMobileSearchActive(false);
                setIsSearchOpen(false);
                setSearchQuery('');
              }}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl cursor-pointer"
              title="Aramayı Kapat"
            >
              <ArrowLeft size={16} />
            </button>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
              <input
                ref={mobileInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                placeholder="Hisse veya Fon Ara..."
                className="w-full pl-8 pr-8 py-1.5 bg-slate-950 border border-emerald-500/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Mobile Search Dropdown */}
            {isSearchOpen && filteredSearchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 bg-slate-950 border-b border-slate-800 flex justify-between">
                  <span>Arama Sonuçları</span>
                  <span>{filteredSearchResults.length} kayıt</span>
                </div>
                {filteredSearchResults.map((quote, idx) => (
                  <button
                    key={`search-mobile-${quote.symbol}-${quote.exchange || ''}-${idx}`}
                    type="button"
                    onClick={() => {
                      onSelectStock(quote);
                      setIsSearchOpen(false);
                      setIsMobileSearchActive(false);
                      setSearchQuery('');
                    }}
                    className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-slate-800 transition-colors text-left border-b border-slate-800/40 last:border-0 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 text-xs px-1.5 py-0.5 bg-slate-800 rounded">
                        {quote.symbol}
                      </span>
                      <div className="truncate max-w-[150px]">
                        <div className="text-xs font-medium text-slate-200 truncate">{quote.name}</div>
                        <div className="text-[10px] text-slate-500">{quote.exchange}</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-semibold text-slate-200">
                        {quote.currency}{quote.currentPrice != null ? quote.currentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '—'}
                      </div>
                      {(() => {
                        const hasChange = quote.change24h != null && quote.change24hPercent != null;
                        const isPositive = hasChange && quote.change24h! >= 0;
                        return hasChange ? (
                          <div className={`text-[10px] font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isPositive ? '+' : ''}{quote.change24hPercent}%
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-400">Veri Yok</div>
                        );
                      })()}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Standard Header Mode */
          <div className="flex items-center justify-between h-10 sm:h-11 gap-1.5 sm:gap-4">
            
            {/* 1. Left: Menu Trigger & Current Tab */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 min-w-0">
              
              {/* Prominent Sidebar Menu Toggle Button */}
              <button
                type="button"
                id="main-menu-toggle-btn"
                onClick={onOpenSidebar}
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-slate-100 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 rounded-xl transition-all cursor-pointer shadow-sm group shrink-0"
                title="Menüyü Aç"
              >
                <Menu size={16} className="text-emerald-400 group-hover:scale-110 transition-transform sm:w-[18px] sm:h-[18px]" />
                <span className="text-xs font-bold tracking-wide">Menü</span>
              </button>

              {/* Brand Logo & Name (Desktop) */}
              <div 
                onClick={() => setActiveTab('opportunities')}
                className="hidden lg:flex items-center gap-2 cursor-pointer group pl-1 shrink-0"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-cyan-500 p-0.5 shadow-sm">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
                <span className="font-black text-sm tracking-tight text-white">
                  MarketPulse <span className="text-emerald-400">AI</span>
                </span>
              </div>

              {/* Current Active Section Badge */}
              <div className="flex items-center gap-1 sm:gap-1.5 pl-1 sm:pl-2 border-l border-slate-800 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0" title={currentTabInfo.label}>
                  <CurrentIcon size={13} />
                </div>
                <span className="text-xs sm:text-sm font-bold text-white truncate hidden sm:inline max-w-[160px] md:max-w-none">
                  {currentTabInfo.label}
                </span>
                {currentTabInfo.badge && (
                  <span className="hidden md:inline text-[9px] px-1.5 py-0.2 rounded font-black bg-emerald-950 text-emerald-300 border border-emerald-800 shrink-0">
                    {currentTabInfo.badge}
                  </span>
                )}
              </div>

            </div>

            {/* 2. Right: Search & Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              
              {/* Mobile Search Button (Compact Trigger for < sm screens) */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileSearchActive(true);
                  setIsSearchOpen(true);
                }}
                className="flex sm:hidden p-2 text-slate-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all cursor-pointer"
                title="Hisse / Fon Ara"
              >
                <Search size={14} className="text-slate-300" />
              </button>

              {/* Desktop/Tablet Inline Search Input (>= sm screens) */}
              <div className="relative hidden sm:block">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
                  <input
                    id="stock-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchOpen(true);
                    }}
                    onFocus={() => setIsSearchOpen(true)}
                    placeholder="Hisse / Fon Ara..."
                    className="w-36 sm:w-44 md:w-56 lg:w-64 pl-8 pr-7 py-1.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setIsSearchOpen(false);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Search Dropdown (Desktop) */}
                {isSearchOpen && filteredSearchResults.length > 0 && (
                  <div className="absolute top-full right-0 mt-1.5 w-72 sm:w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
                    <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 bg-slate-950 border-b border-slate-800 flex justify-between">
                      <span>Arama Sonuçları</span>
                      <span>{filteredSearchResults.length} kayıt</span>
                    </div>
                    {filteredSearchResults.map((quote, idx) => (
                      <button
                        key={`search-desktop-${quote.symbol}-${quote.exchange || ''}-${idx}`}
                        type="button"
                        id={`search-item-${quote.symbol}`}
                        onClick={() => {
                          onSelectStock(quote);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-slate-800 transition-colors text-left border-b border-slate-800/40 last:border-0 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-100 text-xs px-1.5 py-0.5 bg-slate-800 rounded">
                            {quote.symbol}
                          </span>
                          <div className="truncate max-w-[140px]">
                            <div className="text-xs font-medium text-slate-200 truncate">{quote.name}</div>
                            <div className="text-[10px] text-slate-500">{quote.exchange}</div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs font-semibold text-slate-200">
                            {quote.currency}{quote.currentPrice != null ? quote.currentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '—'}
                          </div>
                          {(() => {
                            const hasChange = quote.change24h != null && quote.change24hPercent != null;
                            const isPositive = hasChange && quote.change24h! >= 0;
                            return hasChange ? (
                              <div className={`text-[10px] font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {isPositive ? '+' : ''}{quote.change24hPercent}%
                              </div>
                            ) : (
                              <div className="text-[10px] text-slate-400">Veri Yok</div>
                            );
                          })()}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Watchlist Tab Button */}
              <button
                type="button"
                id="nav-watchlist-button"
                onClick={() => setActiveTab('watchlist')}
                className={`flex items-center gap-1 sm:gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                  activeTab === 'watchlist'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800'
                }`}
                title="İzleme Listeniz"
              >
                <Bookmark size={14} className={watchlistCount > 0 ? 'text-amber-400' : 'text-slate-400'} />
                <span className="hidden sm:inline">İzleme</span>
                {watchlistCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black leading-none">
                    {watchlistCount}
                  </span>
                )}
              </button>

              {/* Subscription Tier Badge or Admin Badge */}
              {isAdmin ? (
                <div
                  id="header-admin-badge"
                  className="flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm select-none"
                  title="Yönetici Hesabı - Herhangi bir pakete tabi değildir"
                >
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span className="text-[11px] font-black uppercase tracking-wider">Admin</span>
                </div>
              ) : (
                <button
                  type="button"
                  id="header-subscription-badge-btn"
                  onClick={() => setActiveTab('pricing')}
                  className={`flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                    activeTab === 'pricing'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-lg shadow-purple-950/40'
                      : tier === 'premium'
                      ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/40'
                      : tier === 'pro'
                      ? 'bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border-purple-500/40'
                      : tier === 'starter'
                      ? 'bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border-blue-500/40'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/80 hover:border-purple-500/40'
                  }`}
                  title={`Mevcut Paketiniz: ${plan.displayName} - Paketleri İncele`}
                >
                  <Crown size={14} className={tier === 'premium' ? 'text-amber-400' : tier === 'pro' ? 'text-purple-400' : 'text-slate-400'} />
                  <span className="text-[11px] font-black uppercase tracking-wider">{plan.displayName}</span>
                </button>
              )}

              {/* AI Model Settings Chip */}
              <button
                type="button"
                id="header-ai-model-btn"
                onClick={onOpenModelSettings}
                className="p-2 sm:px-2.5 sm:py-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer text-slate-200"
                title="Yapay Zeka Motorunu Yapılandır"
              >
                <Cpu size={14} className={modelConfig.provider === 'ollama' ? 'text-cyan-400' : 'text-emerald-400'} />
                <span className="text-[11px] font-bold hidden md:inline">{getModelBadgeText()}</span>
              </button>

              {/* Refresh Data Button */}
              <button
                type="button"
                id="refresh-data-button"
                onClick={onRefreshAll}
                disabled={isRefreshing}
                title="Piyasa ve AI Verilerini Yenile"
                className="p-2 text-slate-400 hover:text-emerald-400 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-emerald-400' : ''} />
              </button>

              {/* Sign Out / Logout Button */}
              <button
                type="button"
                id="header-logout-button"
                onClick={() => logout()}
                title={`Oturumu Kapat (${user?.email || 'Kullanıcı'})`}
                className="flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                <LogOut size={14} className="text-rose-400" />
                <span className="hidden lg:inline text-[11px] font-bold">Çıkış Yap</span>
              </button>

            </div>
          </div>
        )}
      </div>
    </header>
  );
};

