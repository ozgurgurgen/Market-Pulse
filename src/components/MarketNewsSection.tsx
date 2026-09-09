import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Newspaper, 
  Radio, 
  Play, 
  Pause, 
  Flame, 
  Sparkles, 
  Search, 
  ArrowUpRight, 
  Clock, 
  RefreshCw, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  ExternalLink, 
  SlidersHorizontal, 
  Globe, 
  CheckCircle2,
  X,
  Layers,
  LayoutGrid,
  List
} from 'lucide-react';
import { MarketNewsItem, MarketCategory } from '../types';
import { NEWS_CATEGORIES } from '../data/newsData';
import { safeFetchJson } from '../utils/apiClient';

interface MarketNewsSectionProps {
  tickerSpeed?: number;

  news?: MarketNewsItem[];
  onSelectSymbol: (symbol: string) => void;
}

export const MarketNewsSection: React.FC<MarketNewsSectionProps> = ({ 
  news: initialNewsProp, 
  onSelectSymbol,
  tickerSpeed = 90
}) => {
  // Master news list state initialized with full rich dataset
  const [newsList, setNewsList] = useState<MarketNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Category & Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedImpact, setSelectedImpact] = useState<'ALL' | 'bullish' | 'bearish' | 'neutral'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'stream'>('grid');

  // Live Auto-Streaming flow states
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [streamSpeed, setStreamSpeed] = useState<number>(8000); // 8 seconds default
  const [lastStreamTime, setLastStreamTime] = useState<Date>(new Date());
  const [newNewsFlashId, setNewNewsFlashId] = useState<string | null>(null);

  // Selected News for Modal View
  const [selectedNewsDetail, setSelectedNewsDetail] = useState<MarketNewsItem | null>(null);

  // Synchronize if prop updates with substantial data
  useEffect(() => {
    let mounted = true;
    const fetchNews = async () => {
      setIsLoading(true);
      if (initialNewsProp && initialNewsProp.length > 4) {
        setNewsList(initialNewsProp);
        setIsLoading(false);
        return;
      }
      try {
        const res = await safeFetchJson<{ success: boolean; news: MarketNewsItem[] }>('/api/market/news');
        if (mounted && res?.data?.news && res.data.news.length > 0) {
          setNewsList(res.data.news);
        } else if (mounted) {
           setNewsList([]);
        }
      } catch (err) {
        console.error('Failed to fetch news', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchNews();
    return () => { mounted = false; };
  }, [initialNewsProp]);

  // Filtered news calculation
  const filteredNews = useMemo(() => {
    return newsList.filter(item => {
      // Category filter
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }
      // Impact filter
      if (selectedImpact !== 'ALL' && item.impact !== selectedImpact) {
        return false;
      }
      // Search filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesSummary = item.summary.toLowerCase().includes(q);
        const matchesSymbol = item.relatedSymbols.some(s => s.toLowerCase().includes(q));
        const matchesSource = item.source.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSummary && !matchesSymbol && !matchesSource) {
          return false;
        }
      }
      return true;
    });
  }, [newsList, selectedCategory, selectedImpact, searchQuery]);

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: newsList.length };
    NEWS_CATEGORIES.forEach(cat => {
      if (cat.id !== 'ALL') {
        counts[cat.id] = newsList.filter(n => n.category === cat.id).length;
      }
    });
    return counts;
  }, [newsList]);

  // Helper for Category Badge
  const getCategoryMeta = (catId: string) => {
    const found = NEWS_CATEGORIES.find(c => c.id === catId);
    return found || {
      id: catId,
      label: catId,
      shortLabel: catId,
      icon: '📊',
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700'
    };
  };

  return (
    <div id="market-news-terminal-section" className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden transition-all">
      
      {/* 1. Header & Live Status Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-800/90 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Radio size={18} className={isLiveStreaming ? "animate-pulse" : ""} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  Canlı Piyasa Haber Akışı
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  CANLI AKIŞ
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                BIST 100, TEFAS Fonları, KAP Bildirimleri, NASDAQ, Altın ve Kripto için anlık haber akışı
              </p>
            </div>
          </div>
        </div>

        {/* Live Stream Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Stream Play / Pause Button */}
          <button
            type="button"
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
              isLiveStreaming
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60 shadow-sm shadow-emerald-950'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title={isLiveStreaming ? 'Otomatik canlı akışı duraklat' : 'Canlı haber akışını başlat'}
          >
            {isLiveStreaming ? (
              <>
                <Pause size={13} className="text-emerald-400" />
                <span>Akış Aktif</span>
              </>
            ) : (
              <>
                <Play size={13} className="text-slate-400" />
                <span>Akışı Başlat</span>
              </>
            )}
          </button>

          {/* View Mode Toggle (Grid vs Stream List) */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Kart Izgarası Görünümü"
            >
              <LayoutGrid size={14} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('stream')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'stream' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Kesintisiz Akış Listesi Görünümü"
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Kesintisiz Kayan Canlı Haber Bandı (Marquee Streamer) */}
      <div className="bg-slate-950/90 border-b border-slate-800/80 py-2 px-3 overflow-hidden relative flex items-center group">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-extrabold uppercase tracking-wider shrink-0 z-10 mr-2 shadow-sm">
          <Zap size={11} className="animate-pulse" />
          <span>Flaş Bant</span>
        </div>

        {/* Continuous Flowing Marquee Items */}
        <div className="overflow-hidden flex-1 relative">
          <div className="animate-marquee-infinite flex items-center gap-8 py-0.5 text-xs" style={{ animationDuration: `${tickerSpeed}s` }}>
            {newsList.slice(0, 10).map((item, idx) => (
              <div 
                key={`marquee-${item.id}-${idx}`} 
                className="inline-flex items-center gap-2 cursor-pointer text-slate-300 hover:text-emerald-400 transition-colors whitespace-nowrap"
                onClick={() => setSelectedNewsDetail(item)}
              >
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  {getCategoryMeta(item.category).shortLabel}
                </span>
                <span className="font-medium hover:underline">
                  {item.title}
                </span>
                {item.relatedSymbols.length > 0 && (
                  <span className="text-emerald-400 font-bold text-[11px]">
                    (${item.relatedSymbols[0]})
                  </span>
                )}
                <span className="text-slate-600 font-bold">•</span>
              </div>
            ))}
            {/* Duplicate for smooth infinite loop */}
            {newsList.slice(0, 10).map((item, idx) => (
              <div 
                key={`marquee-dup-${item.id}-${idx}`} 
                className="inline-flex items-center gap-2 cursor-pointer text-slate-300 hover:text-emerald-400 transition-colors whitespace-nowrap"
                onClick={() => setSelectedNewsDetail(item)}
              >
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  {getCategoryMeta(item.category).shortLabel}
                </span>
                <span className="font-medium hover:underline">
                  {item.title}
                </span>
                {item.relatedSymbols.length > 0 && (
                  <span className="text-emerald-400 font-bold text-[11px]">
                    (${item.relatedSymbols[0]})
                  </span>
                )}
                <span className="text-slate-600 font-bold">•</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hover Pause hint */}
        <span className="text-[10px] text-slate-500 hidden sm:inline ml-3 shrink-0">
          (Durdurmak için üzerine gelin)
        </span>
      </div>

      {/* 3. Category Filter Tabs Bar */}
      <div className="p-4 bg-slate-950/40 border-b border-slate-800/60 space-y-3">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1.5 shrink-0">
            {NEWS_CATEGORIES.map(cat => {
              const count = categoryCounts[cat.id] || 0;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Sentiment Filters Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Haber başlığı, sembol ($THYAO, $NVDA) veya kaynak ara..."
              className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Sentiment Filter Tabs */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
            <span className="text-[11px] text-slate-400 mr-1 hidden md:inline">Duygu:</span>
            <button
              onClick={() => setSelectedImpact('ALL')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                selectedImpact === 'ALL' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setSelectedImpact('bullish')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                selectedImpact === 'bullish' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🚀 Pozitif (Boğa)
            </button>
            <button
              onClick={() => setSelectedImpact('neutral')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                selectedImpact === 'neutral' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ⚖️ Nötr / Denge
            </button>
            <button
              onClick={() => setSelectedImpact('bearish')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                selectedImpact === 'bearish' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ⚠️ Risk / Ayı
            </button>
          </div>
        </div>
      </div>

      {/* 4. Main News Content: Grid View or Stream List View */}
      <div className="p-4 sm:p-5">
        {filteredNews.length === 0 ? (
          <div className="text-center py-12 space-y-3 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
            <Newspaper size={32} className="mx-auto text-slate-600" />
            <p className="text-sm font-semibold text-slate-400">
              Seçilen kategori ve filtreye uygun haber bulunamadı.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedImpact('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              Filtreleri Temizle
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredNews.map((item) => {
              const catMeta = getCategoryMeta(item.category);
              const isFlashNew = newNewsFlashId === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl bg-slate-950/80 border transition-all duration-300 flex flex-col justify-between hover:border-slate-700 hover:shadow-lg ${
                    isFlashNew 
                      ? 'border-emerald-500/80 ring-2 ring-emerald-500/30 bg-emerald-950/20' 
                      : 'border-slate-800/80'
                  }`}
                >
                  <div>
                    {/* Top Row: Category + Impact Badge + Time */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1 ${catMeta.badgeColor}`}>
                          <span>{catMeta.icon}</span>
                          <span>{catMeta.shortLabel}</span>
                        </span>
                        
                        {item.isBreaking && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 uppercase animate-pulse">
                            SON DAKİKA
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Clock size={11} />
                        <span>{item.time}</span>
                      </div>
                    </div>

                    {/* News Title */}
                    <h4 
                      onClick={() => setSelectedNewsDetail(item)}
                      className="text-sm font-bold text-slate-100 hover:text-emerald-400 transition-colors leading-snug mb-2 cursor-pointer line-clamp-2"
                    >
                      {item.title}
                    </h4>

                    {/* Summary */}
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-3">
                      {item.summary}
                    </p>

                    {/* AI Impact Indicator */}
                    <div className="mb-3 flex items-center gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-800/70 text-[11px]">
                      <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <Sparkles size={12} />
                        <span>{item.impact === 'bullish' ? 'Piyasa Etkisi:' : 'Risk Durumu:'}</span>
                      </div>
                      <span className={`font-bold ${
                        item.impact === 'bullish' ? 'text-emerald-300' : item.impact === 'bearish' ? 'text-rose-400' : 'text-slate-300'
                      }`}>
                        {item.impact === 'bullish' ? '🚀 Pozitif (Katalizör)' : item.impact === 'bearish' ? '⚠️ Düzeltme / Baskı' : '⚖️ Nötr / Denge'}
                      </span>
                      {item.impactScore && (
                        <span className="ml-auto text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                          %{item.impactScore}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Source & Clickable Symbols */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                    <span className="text-[11px] text-slate-500 truncate max-w-[140px]" title={item.source}>
                      {item.source}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {item.relatedSymbols.map((sym) => (
                        <button
                          key={sym}
                          type="button"
                          onClick={() => onSelectSymbol(sym)}
                          className="font-bold px-2 py-1 rounded-lg bg-slate-800 hover:bg-emerald-900/60 text-slate-200 hover:text-emerald-300 border border-slate-700/80 hover:border-emerald-500/40 transition-colors cursor-pointer text-[11px] flex items-center gap-1"
                          title={`${sym} detaylı analizini ve canlı grafiğini aç`}
                        >
                          <span>${sym}</span>
                          <ArrowUpRight size={10} />
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() => setSelectedNewsDetail(item)}
                        className="p-1 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Detaylı haberi oku"
                      >
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Stream List View */
          <div className="space-y-2.5">
            {filteredNews.map((item) => {
              const catMeta = getCategoryMeta(item.category);
              const isFlashNew = newNewsFlashId === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl bg-slate-950/80 border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-slate-700 ${
                    isFlashNew 
                      ? 'border-emerald-500/80 ring-2 ring-emerald-500/30 bg-emerald-950/20' 
                      : 'border-slate-800/80'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${catMeta.badgeColor}`}>
                        <span>{catMeta.icon}</span>
                        <span>{catMeta.shortLabel}</span>
                      </span>

                      {item.isBreaking && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 uppercase">
                          FLAŞ
                        </span>
                      )}

                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock size={11} />
                        {item.time}
                      </span>

                      <span className="text-slate-600">•</span>
                      <span className="text-[11px] text-slate-400">{item.source}</span>
                    </div>

                    <h4 
                      onClick={() => setSelectedNewsDetail(item)}
                      className="text-xs sm:text-sm font-bold text-slate-100 hover:text-emerald-400 transition-colors cursor-pointer line-clamp-1"
                    >
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {item.summary}
                    </p>
                  </div>

                  {/* Actions & Symbols */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <div className="flex items-center gap-1">
                      {item.relatedSymbols.map((sym) => (
                        <button
                          key={sym}
                          type="button"
                          onClick={() => onSelectSymbol(sym)}
                          className="font-bold px-2 py-1 rounded-lg bg-slate-800 hover:bg-emerald-900/60 text-slate-200 hover:text-emerald-300 border border-slate-700/80 hover:border-emerald-500/40 transition-colors cursor-pointer text-xs flex items-center gap-1"
                        >
                          <span>${sym}</span>
                          <ArrowUpRight size={11} />
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedNewsDetail(item)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                    >
                      Detay
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Detailed News & AI Impact Modal */}
      {selectedNewsDetail && (
        <div 
          id="news-detail-modal" 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedNewsDetail(null)}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border flex items-center gap-1 ${getCategoryMeta(selectedNewsDetail.category).badgeColor}`}>
                    <span>{getCategoryMeta(selectedNewsDetail.category).icon}</span>
                    <span>{getCategoryMeta(selectedNewsDetail.category).label}</span>
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={12} />
                    {selectedNewsDetail.time}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {selectedNewsDetail.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedNewsDetail(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* AI Strategic Impact Box */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <Sparkles size={14} />
                  <span>MarketPulse Yapay Zeka Etki Değerlendirmesi</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  selectedNewsDetail.impact === 'bullish' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'
                }`}>
                  {selectedNewsDetail.impact === 'bullish' ? '🚀 Güçlü Pozitif' : '⚖️ Nötr'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedNewsDetail.summary}
              </p>
            </div>

            {/* Full News Content */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Haber Detayı & Rapor</h4>
              <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
                {selectedNewsDetail.content || selectedNewsDetail.summary}
              </div>
            </div>

            {/* Key AI Takeaways if available */}
            {selectedNewsDetail.aiKeyTakeaways && selectedNewsDetail.aiKeyTakeaways.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Önemli Çıkarımlar & Katalizörler</h4>
                <div className="space-y-1.5">
                  {selectedNewsDetail.aiKeyTakeaways.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Symbols Action Row */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">İlgili Varlıklar:</span>
                <div className="flex items-center gap-1.5">
                  {selectedNewsDetail.relatedSymbols.map((sym) => (
                    <button
                      key={sym}
                      onClick={() => {
                        setSelectedNewsDetail(null);
                        onSelectSymbol(sym);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                    >
                      <span>${sym} Analizini Aç</span>
                      <ArrowUpRight size={12} />
                    </button>
                  ))}
                </div>
              </div>

              <span className="text-xs text-slate-500">
                Kaynak: {selectedNewsDetail.source}
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
