import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MarketTickerBar } from './components/MarketTickerBar';
import { OpportunityScanner } from './components/OpportunityScanner';
import { useAuth } from './contexts/AuthContext';
import { AuthScreen } from './components/AuthScreen';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from './lib/firebase';
import { AdminSettingsSection } from './components/AdminSettingsSection';
import { TefasFundsSection } from './components/TefasFundsSection';
import { TefasFundDetailModal } from './components/TefasFundDetailModal';
import { BacktestSection } from './components/BacktestSection';
import { MarketOverview } from './components/MarketOverview';
import { StockAnalysisModal } from './components/StockAnalysisModal';
import { AIChatAdvisor } from './components/AIChatAdvisor';
import { WatchlistManager } from './components/WatchlistManager';
import { AdminPanel } from './components/AdminPanel';
import { MarketNewsSection } from './components/MarketNewsSection';
import { AIModelSettingsModal } from './components/AIModelSettingsModal';
import { SettingsSection } from "./components/SettingsSection";
import { IntelligenceHub } from './components/IntelligenceHub/IntelligenceHub';
import { PortfolioPage } from './pages/Portfolio';
import { EconomicIndicatorsPage } from './components/EconomicIndicators/EconomicIndicatorsPage';
import { LatestBalanceSheetsSection } from './components/LatestBalanceSheetsSection';
import { AdvancedScreenerSection } from './components/AdvancedScreenerSection';
import { FinancialAcademySection } from './components/FinancialAcademySection';
import { IPOTracker } from './components/IPOTracker';
import { PricingSection } from './components/Subscription/PricingSection';
import { UpgradeModal } from './components/Subscription/UpgradeModal';
import { SubscriptionTier } from './shared/subscriptionPlans';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { ErrorBoundary } from './components/ErrorBoundary';

import { INITIAL_DEFAULT_QUOTES } from './data/defaultQuotesData';
import { INITIAL_DEFAULT_OPPORTUNITIES } from './data/defaultOpportunitiesData';
import { INITIAL_MARKET_NEWS } from './data/newsData';
import { safeFetchJson } from './utils/apiClient';
import { 
  StockQuote, 
  OpportunitySignal, 
  StockAnalysisDetail, 
  MarketCategory, 
  WatchlistItem, 
  MarketNewsItem, 
  TefasFund, 
  TefasFundDetail, 
  BacktestAsset,
  AIModelConfig 
} from './types';

function MainApp() {
  const { user, userData, token } = useAuth();
  const isFreePlan = userData?.subscription?.tier === 'free' || !userData?.subscription;
  const [watchlistSynced, setWatchlistSynced] = useState(false);

  const [activeTab, setActiveTab] = useState<'opportunities' | 'latest_financials' | 'screener' | 'ipo' | 'academy' | 'intelligence' | 'portfolio' | 'macro' | 'tefas' | 'backtest' | 'markets' | 'chat' | 'watchlist' | 'settings' | 'admin' | 'pricing'>('opportunities');
  const [selectedCategory, setSelectedCategory] = useState<MarketCategory>('ALL');
  
  // Slide-out Drawer State
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Upgrade Modal State
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const [upgradeModalFeature, setUpgradeModalFeature] = useState<string | undefined>();
  const [upgradeModalTier, setUpgradeModalTier] = useState<SubscriptionTier | undefined>();
  
  const [quotes, setQuotes] = useState<StockQuote[]>(INITIAL_DEFAULT_QUOTES);
  const [opportunities, setOpportunities] = useState<OpportunitySignal[]>(INITIAL_DEFAULT_OPPORTUNITIES);
  const [news, setNews] = useState<MarketNewsItem[]>(INITIAL_MARKET_NEWS);
  
  const [isQuotesLoading, setIsQuotesLoading] = useState(false);
  const [isOpportunitiesLoading, setIsOpportunitiesLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // AI Model Configuration State (Local / Cloud / Custom)
  const [modelConfig, setModelConfig] = useState<AIModelConfig>(() => {
    try {
      const saved = localStorage.getItem('marketpulse_ai_model_config') || localStorage.getItem('marketpulse_aiconfig');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.geminiModel === 'gemini-3.6-flash' || !parsed.geminiModel) {
          parsed.geminiModel = 'gemini-3.7-flash';
        }
        return parsed;
      }
      return {
        provider: 'gemini',
        geminiModel: 'gemini-3.7-flash',
        ollamaUrl: 'http://localhost:11434',
        ollamaModel: 'deepseek-r1:latest',
        tickerSpeed: 300,
        newsTickerSpeed: 300,
        radarScope: 'ALL',
        radarLayout: 'GRID'
      };
    } catch {
      return {
        provider: 'gemini',
        geminiModel: 'gemini-3.7-flash',
        ollamaUrl: 'http://localhost:11434',
        ollamaModel: 'deepseek-r1:latest',
        tickerSpeed: 300,
        newsTickerSpeed: 300,
        radarScope: 'ALL',
        radarLayout: 'GRID'
      };
    }
  });

  const [isModelModalOpen, setIsModelModalOpen] = useState<boolean>(false);
  useEffect(() => {
    const handleNavToAcademy = () => {
      setIsAnalysisModalOpen(false);
      setIsTefasModalOpen(false);
      setActiveTab('academy');
    };

    const handleOpenUpgradeModal = (e: Event) => {
      const customEvent = e as CustomEvent<{ targetFeature?: string; requiredTier?: SubscriptionTier }>;
      setUpgradeModalFeature(customEvent.detail?.targetFeature);
      setUpgradeModalTier(customEvent.detail?.requiredTier);
      setIsUpgradeModalOpen(true);
    };

    window.addEventListener('navigate-to-academy', handleNavToAcademy);
    window.addEventListener('marketpulse-open-upgrade-modal', handleOpenUpgradeModal);
    return () => {
      window.removeEventListener('navigate-to-academy', handleNavToAcademy);
      window.removeEventListener('marketpulse-open-upgrade-modal', handleOpenUpgradeModal);
    };
  }, []);


  const [modelConfigSynced, setModelConfigSynced] = useState(false);
  
  useEffect(() => {
    if (user && !modelConfigSynced) {
      if (auth.currentUser && !auth.currentUser.isAnonymous && user.uid === auth.currentUser.uid && !user.uid.startsWith('guest-') && !user.uid.startsWith('admin-')) {
        getDoc(doc(db, 'users', user.uid, 'preferences', 'default'))
          .then((snap) => {
            if (snap.exists() && snap.data()?.modelConfig) {
              setModelConfig(snap.data().modelConfig);
            }
            setModelConfigSynced(true);
          })
          .catch((e) => {
            console.warn('Preferences load notice (using default AI config):', e?.message || e);
            setModelConfigSynced(true);
          });
      } else {
        setModelConfigSynced(true);
      }
    }
  }, [user, modelConfigSynced]);

  const handleSaveModelConfig = useCallback((newConfig: AIModelConfig) => {
    setModelConfig(newConfig);
    try {
      localStorage.setItem('marketpulse_ai_model_config', JSON.stringify(newConfig));
      localStorage.setItem('marketpulse_aiconfig', JSON.stringify(newConfig));
      if (user && user.uid && auth.currentUser && user.uid === auth.currentUser.uid && !user.uid.startsWith('guest-') && !user.uid.startsWith('admin-')) {
        setDoc(doc(db, 'users', user.uid, 'preferences', 'default'), { modelConfig: newConfig }, { merge: true })
          .catch((err) => console.warn('Sync AI config to Firestore warning:', err?.message || err));
      }
    } catch (e) {
      console.warn('Save AI config warning:', e);
    }
  }, [user]);

  // TEFAS Modal State
  const [selectedTefasFund, setSelectedTefasFund] = useState<TefasFundDetail | null>(null);
  const [isTefasModalOpen, setIsTefasModalOpen] = useState(false);
  const [isTefasLoading, setIsTefasLoading] = useState(false);

  // Backtest Initial Asset to add
  const [backtestAssetToAdd, setBacktestAssetToAdd] = useState<BacktestAsset | null>(null);

  // Deep Stock Analysis Modal State
  const [selectedAnalysis, setSelectedAnalysis] = useState<StockAnalysisDetail | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

  // Watchlist Local Storage Persistence
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('marketpulse_watchlist');
      return saved ? JSON.parse(saved) : [
        { symbol: 'THYAO', name: 'Türk Hava Yolları', exchange: 'BIST', addedPrice: 310.00, addedDate: new Date().toISOString(), targetPrice: 345, stopLoss: 295, notes: 'EMA 50 desteği ve turizm talebi' },
        { symbol: 'MAC', name: 'Marmara Capital Hisse Fonu (%0 Stopaj)', exchange: 'TEFAS', addedPrice: 38.64, addedDate: new Date().toISOString(), targetPrice: 48, stopLoss: 34, notes: 'Enflasyon kalkanı hisse fonu' },
        { symbol: 'NVDA', name: 'NVIDIA Corp', exchange: 'NASDAQ', addedPrice: 136.50, addedDate: new Date().toISOString(), targetPrice: 160, stopLoss: 125, notes: 'Blackwell AI çip talebi' }
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('marketpulse_watchlist', JSON.stringify(watchlist));
      if (user && watchlistSynced && auth.currentUser && user.uid === auth.currentUser.uid && !user.uid.startsWith('guest-') && !user.uid.startsWith('admin-')) {
        setDoc(doc(db, 'users', user.uid, 'watchlist', 'default'), { items: watchlist }, { merge: true })
          .catch((err) => console.warn('Failed to save watchlist to cloud:', err?.message || err));
      }
    } catch (e) {
      console.error('Failed to save watchlist', e);
    }
  }, [watchlist, user, watchlistSynced]);

  useEffect(() => {
    if (user && !watchlistSynced) {
      if (auth.currentUser && user.uid === auth.currentUser.uid && !user.uid.startsWith('guest-') && !user.uid.startsWith('admin-')) {
        getDoc(doc(db, 'users', user.uid, 'watchlist', 'default')).then(snap => {
          if (snap.exists() && snap.data()?.items) {
            setWatchlist(snap.data().items);
          }
          setWatchlistSynced(true);
        }).catch((err) => {
          console.warn('Watchlist cloud load notice:', err?.message || err);
          setWatchlistSynced(true);
        });
      } else {
        setWatchlistSynced(true);
      }
    }
  }, [user, watchlistSynced]);

  // 1. Fetch Market Quotes
  const fetchQuotes = useCallback(async () => {
    try {
      const { data, ok } = await safeFetchJson<{ quotes: StockQuote[]; total: number }>('/api/market/quotes');
      if (ok && data?.quotes && Array.isArray(data.quotes) && data.quotes.length > 0) {
        const seen = new Set<string>();
        const uniqueQuotes = data.quotes.filter(q => {
          if (!q?.symbol || seen.has(q.symbol)) return false;
          seen.add(q.symbol);
          return true;
        });
        setQuotes(uniqueQuotes);
      }
    } catch {
      // Retain existing default quotes
    } finally {
      setIsQuotesLoading(false);
    }
  }, []);

  // 2. Fetch AI Opportunities
  const fetchOpportunities = useCallback(async (cat: MarketCategory = selectedCategory) => {
    setIsOpportunitiesLoading(true);
    try {
      const scopeParam = modelConfig.radarScope || 'ALL';
      const favoritesParam = watchlist.map(w => w.symbol).join(',');
      const { data, ok } = await safeFetchJson<{ opportunities: OpportunitySignal[] }>(`/api/ai/opportunities?category=${cat}&scope=${scopeParam}&favorites=${favoritesParam}`);
      if (ok && data?.opportunities && Array.isArray(data.opportunities) && data.opportunities.length > 0) {
        setOpportunities(data.opportunities);
      } else if (cat !== 'ALL') {
        const fallbackForCat = INITIAL_DEFAULT_OPPORTUNITIES.filter(o => o.category === cat);
        if (fallbackForCat.length > 0) {
          setOpportunities(prev => {
            const others = prev.filter(o => o.category !== cat);
            return [...fallbackForCat, ...others];
          });
        }
      }
    } catch {
      // Keep existing opportunities
    } finally {
      setIsOpportunitiesLoading(false);
    }
  }, [selectedCategory, modelConfig.radarScope, watchlist]);

  // 3. Fetch News
  const fetchNews = useCallback(async () => {
    try {
      const { data, ok } = await safeFetchJson<{ news: MarketNewsItem[] }>('/api/market/news');
      if (ok && data?.news && Array.isArray(data.news)) {
        setNews(data.news);
      }
    } catch {
      // fallback
    }
  }, []);

  // Initial Load & polling for quotes
  useEffect(() => {
    fetchQuotes();
    fetchNews();

    const interval = setInterval(() => {
      fetchQuotes();
    }, 15000); // 15s live refresh

    return () => clearInterval(interval);
  }, [fetchQuotes, fetchNews]);

  useEffect(() => {
    fetchOpportunities(selectedCategory);
  }, [fetchOpportunities, user?.uid, userData?.subscription?.tier, token]);

  // Refresh All Trigger
  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchQuotes(), fetchOpportunities(selectedCategory), fetchNews()]);
    setIsRefreshing(false);
  };

  // Trigger Deep Stock Analysis Modal
  const handleAnalyzeStock = async (symbol: string, name: string, exchange: string, category: string) => {
    setIsAnalysisModalOpen(true);
    setIsAnalysisLoading(true);
    setSelectedAnalysis(null);

    try {
      const { data, ok } = await safeFetchJson<{ analysis: StockAnalysisDetail }>('/api/ai/analyze-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, name, exchange, category, modelConfig }),
      });

      if (ok && data?.analysis) {
        setSelectedAnalysis(data.analysis);
      }
    } catch {
      // Handled cleanly
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  // Trigger Deep TEFAS Fund Analysis Modal
  const handleSelectTefasFund = async (fund: TefasFund) => {
    setIsTefasModalOpen(true);
    setIsTefasLoading(true);
    setSelectedTefasFund(null);

    try {
      const { data, ok } = await safeFetchJson<{ fund: TefasFundDetail }>(`/api/tefas/detail/${fund.code}`);
      if (ok && data?.fund) {
        setSelectedTefasFund(data.fund);
      } else {
        // Fallback to minimal state based on the passed fund object
        setSelectedTefasFund({
          ...fund,
          managerProfile: `${fund.founder || 'Portföy'} Yönetim Ekibi`,
          stressTestScore: fund.sharpeRatio ? Math.min(100, Math.round(70 + fund.sharpeRatio * 10)) : 75,
          inflationSimulation: [
            { period: '1 Yıl', nominalFundGain: fund.return1Y || 0, inflationRate: 45, netRealGain: Number(((fund.return1Y || 0) - 45).toFixed(2)), purchasingPowerProtection: (fund.return1Y || 0) >= 45 ? 'TAM KORUMA' : 'ENFLASYON ALTI' },
            { period: '3 Yıl', nominalFundGain: fund.return3Y || 0, inflationRate: 160, netRealGain: Number(((fund.return3Y || 0) - 160).toFixed(2)), purchasingPowerProtection: (fund.return3Y || 0) >= 160 ? 'YÜKSEK REEL KAZANÇ' : 'ENFLASYON ALTI' }
          ],
          monthlyPerformance: [],
          aiLiteracyDeepReport: {
            pros: [`1 Yıllık nominal getiri: %${fund.return1Y || 0}`, `Yıllık Yönetim Ücreti: %${fund.managementFee || 2.0}`],
            cons: [`Risk Değeri: ${fund.riskScore}/7`],
            suitability: fund.horizon === 'LONG' ? 'Uzun vadeli birikim hedefleyen yatırımcılar için uygundur.' : 'Orta/kısa vadeli likit yönetim için uygundur.',
            taxAdvice: fund.withholdingTax === 0 ? '%0 Stopaj avantajına sahiptir.' : '%10 Stopaj kesintisi uygulanır.',
            idealEntryExitStrategy: 'Düzenli periyotlarla alım yaparak maliyet ortalaması oluşturulması önerilir.'
          }
        });
      }
    } catch {
      // Fallback
    } finally {
      setIsTefasLoading(false);
    }
  };

  // Add TEFAS or Asset to Backtest
  const handleAddFundToBacktest = (fund: TefasFund | TefasFundDetail) => {
    setBacktestAssetToAdd({
      code: fund.code,
      name: fund.name,
      type: 'TEFAS_FUND',
      weight: 20,
      annualAvgReturn: fund.return1Y || 75.0,
      volatility: fund.standardDeviation || 20.0,
    });
    setActiveTab('backtest');
  };

  // Watchlist Toggle
  const handleToggleWatchlist = (symbol: string, name: string, currentPrice: number, exchange: string) => {
    setWatchlist((prev) => {
      const exists = prev.some((item) => item.symbol === symbol);
      if (exists) {
        return prev.filter((item) => item.symbol !== symbol);
      } else {
        return [
          ...prev,
          {
            symbol,
            name,
            exchange,
            addedPrice: currentPrice,
            addedDate: new Date().toISOString(),
          },
        ];
      }
    });
  };

  const handleRemoveFromWatchlist = (symbol: string) => {
    setWatchlist((prev) => prev.filter((item) => item.symbol !== symbol));
  };

  const handleUpdateItemNotes = (symbol: string, notes: string, targetPrice?: number, stopLoss?: number) => {
    setWatchlist((prev) =>
      prev.map((item) =>
        item.symbol === symbol ? { ...item, notes, targetPrice, stopLoss } : item
      )
    );
  };

  const handleSelectStockFromQuote = (quote: StockQuote) => {
    handleAnalyzeStock(quote.symbol, quote.name, quote.exchange, quote.category);
  };

  const handleSelectSymbolFromNews = (symbol: string) => {
    const found = quotes.find((q) => q.symbol.toUpperCase() === symbol.toUpperCase());
    if (found) {
      handleAnalyzeStock(found.symbol, found.name, found.exchange, found.category);
    } else {
      handleAnalyzeStock(symbol, symbol, 'Piyasa', 'BIST');
    }
  };

  const watchlistSymbols = watchlist.map((w) => w.symbol);

  const activeModelDisplay = modelConfig.provider === 'ollama' 
    ? `Ollama (${modelConfig.ollamaModel})` 
    : modelConfig.provider === 'custom'
    ? `Custom (${modelConfig.customModelName || 'LLM'})`
    : modelConfig.geminiModel;

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 w-full max-w-full overflow-x-hidden relative">
      
      {/* Offline Connectivity Banner */}
      <OfflineIndicator />

      {/* Floating PWA Install Prompt */}
      <PWAInstallPrompt />

      {/* 1. Left Slide-out Drawer / Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCategory={selectedCategory}
        setSelectedCategory={(cat) => {
          setSelectedCategory(cat);
          fetchOpportunities(cat);
        }}
        watchlistCount={watchlist.length}
        modelConfig={modelConfig}
        onOpenModelSettings={() => setIsModelModalOpen(true)}
        onRefreshAll={handleRefreshAll}
        isRefreshing={isRefreshing}
      />

      {/* Sticky Top Bar (Header + Live Market Ticker) */}
      <div className="sticky top-0 z-40 w-full flex flex-col shrink-0 shadow-lg bg-[#0b0f17]">
        {/* Top Clean Header with Menu Toggle */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          quotes={quotes}
          onSelectStock={handleSelectStockFromQuote}
          onRefreshAll={handleRefreshAll}
          isRefreshing={isRefreshing}
          watchlistCount={watchlist.length}
          modelConfig={modelConfig}
          onOpenModelSettings={() => setIsModelModalOpen(true)}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />

        {/* Live Market Ticker Bar */}
        <MarketTickerBar 
          quotes={quotes} 
          onSelectStock={handleSelectStockFromQuote} 
          speed={modelConfig.tickerSpeed !== undefined ? modelConfig.tickerSpeed : 300} 
        />
      </div>

      {/* Main Content Body */}
      <main className="flex-1 w-full max-w-[98vw] 2xl:max-w-[99vw] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        
        {/* Tab 1: AI Opportunities & Signals */}
        {activeTab === 'opportunities' && (
          <div className="space-y-6">
            <OpportunityScanner
              radarLayout={modelConfig.radarLayout}

              opportunities={opportunities}
              isLoading={isOpportunitiesLoading}
              onAnalyzeStock={handleAnalyzeStock}
              watchlist={watchlistSymbols}
              onToggleWatchlist={handleToggleWatchlist}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                fetchOpportunities(cat);
              }}
              activeCategory={selectedCategory}
            />

            {/* News Section below opportunities */}
            <MarketNewsSection news={news} onSelectSymbol={handleSelectSymbolFromNews} tickerSpeed={modelConfig.newsTickerSpeed !== undefined ? modelConfig.newsTickerSpeed : 300} />
          </div>
        )}

        {/* Tab: Halka Arz (IPO) Takip & Analiz Modülü */}
        {activeTab === 'ipo' && (
          <IPOTracker onOpenUpgradeModal={(feature) => {
            setUpgradeModalFeature(feature || 'Halka Arz Takip & Analiz');
            setIsUpgradeModalOpen(true);
          }} />
        )}

        {/* Tab: Son Açıklanan Bilanço Akışı */}
        {activeTab === 'latest_financials' && (
          <LatestBalanceSheetsSection onSelectStock={handleSelectSymbolFromNews} />
        )}

        {/* Tab: Gelişmiş Hisse Tarayıcı & Filtreleme */}
        {activeTab === 'screener' && (
          <AdvancedScreenerSection onSelectStock={handleSelectSymbolFromNews} />
        )}

        {/* Tab: Temel Analiz & Rasyolar Akademisi */}
        {activeTab === 'academy' && (
          <FinancialAcademySection />
        )}

        {/* Tab 2: Portfolio Management System Module */}
        {activeTab === 'portfolio' && (
          <PortfolioPage />
        )}

        {/* Tab: Macro & Economic Indicators Dashboard */}
        {activeTab === 'macro' && (
          <EconomicIndicatorsPage />
        )}

        {/* Tab 3: Finansal İstihbarat Merkezi (4-Agent Intelligence Hub) */}
        {activeTab === 'intelligence' && (
          <IntelligenceHub 
            initialTicker="THYAO" 
            onSelectStock={handleSelectSymbolFromNews} 
          />
        )}

        {/* Tab 3: TEFAS Funds Explorer & Inflation Protection */}
        {activeTab === 'tefas' && (
          <div className="space-y-6">
            <TefasFundsSection
              onSelectFund={handleSelectTefasFund}
              onAddToBacktest={handleAddFundToBacktest}
              onOpenModelSettings={() => setIsModelModalOpen(true)}
              activeModelName={activeModelDisplay}
            />
          </div>
        )}

        {/* Tab 3: Portfolio Backtest Simulation Engine */}
        {activeTab === 'backtest' && (
          <div className="space-y-6">
            <BacktestSection
              initialAssetToAdd={backtestAssetToAdd}
              onClearInitialAsset={() => setBacktestAssetToAdd(null)}
              modelConfig={modelConfig}
              onOpenModelSettings={() => setIsModelModalOpen(true)}
            />
          </div>
        )}

        {/* Tab 4: Live Market Quotes Table & Charts */}
        {activeTab === 'markets' && (
          <div className="space-y-6">
            <MarketOverview
              quotes={quotes}
              onSelectStock={handleSelectStockFromQuote}
              watchlist={watchlistSymbols}
              onToggleWatchlist={handleToggleWatchlist}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            <MarketNewsSection news={news} onSelectSymbol={handleSelectSymbolFromNews} tickerSpeed={modelConfig.newsTickerSpeed !== undefined ? modelConfig.newsTickerSpeed : 300} />
          </div>
        )}

        {/* Tab 5: AI Financial Strategist Chat */}
        {activeTab === 'chat' && (
          <div className="space-y-6">
            <AIChatAdvisor 
              onAnalyzeStock={handleAnalyzeStock}
              modelConfig={modelConfig}
              onOpenModelSettings={() => setIsModelModalOpen(true)}
            />
          </div>
        )}

        {/* Tab 6: Settings Management */}
        {activeTab === "settings" && (
          <SettingsSection 
            modelConfig={modelConfig} 
            onSaveConfig={handleSaveModelConfig}
            onNavigateToPricing={() => setActiveTab('pricing')}
            onOpenModelSettings={() => setIsModelModalOpen(true)}
          />
        )}

        
        {/* Tab: Admin Panel */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <AdminPanel />
          </div>
        )}

        {/* Tab: Pricing & Subscription Packages */}
        {activeTab === 'pricing' && (
          <div className="space-y-6 animate-fadeIn">
            <PricingSection />
          </div>
        )}

        {activeTab === 'watchlist' && (
          <div className="space-y-6">
            <WatchlistManager
              watchlistItems={watchlist}
              quotes={quotes}
              onRemoveFromWatchlist={handleRemoveFromWatchlist}
              onAnalyzeStock={handleAnalyzeStock}
              onUpdateItemNotes={handleUpdateItemNotes}
              isFreePlan={isFreePlan}
            />
          </div>
        )}

      </main>

      {/* Modals */}
      {/* Membership & Subscription Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        targetFeature={upgradeModalFeature}
        requiredTier={upgradeModalTier}
      />
      {isTefasModalOpen && (
        <TefasFundDetailModal
          fund={selectedTefasFund}
          isLoading={isTefasLoading}
          onClose={() => setIsTefasModalOpen(false)}
          onAddToBacktest={handleAddFundToBacktest}
          onToggleWatchlist={handleToggleWatchlist}
          isWatchlisted={selectedTefasFund ? watchlistSymbols.includes(selectedTefasFund.code) : false}
          onSelectFund={(code) => {
            handleSelectTefasFund({ code: code.toUpperCase(), name: code.toUpperCase() } as any);
          }}
        />
      )}

      {/* Deep Stock Analysis Modal with Google Finance & Recharts */}
      {isAnalysisModalOpen && (
        <StockAnalysisModal
          analysis={selectedAnalysis}
          isLoading={isAnalysisLoading}
          onClose={() => setIsAnalysisModalOpen(false)}
          isWatchlisted={selectedAnalysis ? watchlistSymbols.includes(selectedAnalysis.symbol) : false}
          onToggleWatchlist={handleToggleWatchlist}
          news={news}
        />
      )}

      {/* AI Model Switcher & Ollama Settings Modal */}
      <AIModelSettingsModal
        isOpen={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
        config={modelConfig}
        onSaveConfig={handleSaveModelConfig}
      />

      {/* Global Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 py-4 px-4 text-center text-xs text-slate-500">
        <div className="w-full max-w-[98vw] 2xl:max-w-[99vw] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-bold text-slate-400">MarketPulse AI</span> • TEFAS Fonları, Backtest ve Google Finance Platformu
          </div>
          <div className="text-[11px] text-slate-600">
            * Veriler bilgilendirme ve finansal okuryazarlık amaçlıdır. Yatırım tavsiyesi (YTD) niteliği taşımaz.
          </div>
        </div>
      </footer>

    </div>
  );
}


export default function App() {
  const { user } = useAuth();

  if (!user) {
    return (
      <ErrorBoundary fallbackTitle="Giriş Ekranı Yükleme Hatası">
        <AuthScreen />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary fallbackTitle="Ana Ekran Yükleme Hatası">
      <MainApp />
    </ErrorBoundary>
  );
}
