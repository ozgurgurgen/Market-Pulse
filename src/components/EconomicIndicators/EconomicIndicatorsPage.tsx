import React, { useState, useEffect, useMemo } from 'react';
import { 
  Landmark, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Globe, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  Percent, 
  BarChart3, 
  Layers, 
  Search, 
  Filter,
  CheckCircle2,
  Info,
  ExternalLink,
  ChevronRight,
  Zap,
  Activity,
  Flame
} from 'lucide-react';
import { safeFetchJson } from '../../utils/apiClient';
import { EconomicIndicator, AIMacroCommentaryOutput, IndicatorRegion, IndicatorCategory } from '../../types';
import { AssetImpactSection } from './AssetImpactSection';
import { MacroChartsSection } from './MacroChartsSection';

export const EconomicIndicatorsPage: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState<'overview' | 'charts' | 'calendar'>('overview');
  const [indicators, setIndicators] = useState<EconomicIndicator[]>([]);
  const [commentary, setCommentary] = useState<AIMacroCommentaryOutput | null>(null);
  const [commentaryDate, setCommentaryDate] = useState<string | null>(null);
  const [isCommentaryLoading, setIsCommentaryLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Filtreleme State'leri
  const [selectedRegion, setSelectedRegion] = useState<'ALL' | 'TR' | 'GLOBAL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | IndicatorCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Varlık Etki Arama Seçimi
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState<string>('THYAO');

  const popularSymbols = ['THYAO', 'ASELS', 'AKBNK', 'EREGL', 'TUPRS', 'BIMAS', 'FROTO', 'NVDA', 'ALTIN', 'BTC-USD'];

  // 1. Verileri Çek
  const fetchMacroData = async (forceRefresh: boolean = false) => {
    if (forceRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      // Göstergeleri Getir
      const { data: indData, ok: indOk } = await safeFetchJson<{ success: boolean; indicators: EconomicIndicator[] }>(
        `/api/macro/indicators${forceRefresh ? '?refresh=true' : ''}`
      );
      if (indOk && indData?.indicators) {
        setIndicators(indData.indicators);
      }

      // YZ Yorumunu Getir
      const { data: comData, ok: comOk } = await safeFetchJson<{ success: boolean; data: AIMacroCommentaryOutput; generatedAt: string }>(
        '/api/macro/commentary'
      );
      if (comOk && comData?.data) {
        setCommentary(comData.data);
        setCommentaryDate(comData.generatedAt);
      }
    } catch (err) {
      console.error('Makro veriler çekilirken hata:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMacroData(false);
  }, []);

  // YZ Yorumunu Yeniden Tetikle
  const handleRefreshCommentary = async () => {
    setIsCommentaryLoading(true);
    try {
      const { data, ok } = await safeFetchJson<{ success: boolean; data: AIMacroCommentaryOutput; generatedAt: string }>(
        '/api/macro/commentary/refresh',
        { method: 'POST' }
      );
      if (ok && data?.data) {
        setCommentary(data.data);
        setCommentaryDate(data.generatedAt);
      }
    } catch (err) {
      console.error('Makro yorum yenileme hatası:', err);
    } finally {
      setIsCommentaryLoading(false);
    }
  };

  // Filtrelenmiş Göstergeler
  const filteredIndicators = useMemo(() => {
    return indicators.filter((ind) => {
      // Bölge Filtresi
      if (selectedRegion === 'TR' && ind.region !== 'TR') return false;
      if (selectedRegion === 'GLOBAL' && ind.region === 'TR') return false;

      // Kategori Filtresi
      if (selectedCategory !== 'ALL' && ind.category !== selectedCategory) return false;

      // Arama Filtresi
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          ind.indicator_name.toLowerCase().includes(q) ||
          ind.indicator_code.toLowerCase().includes(q) ||
          ind.source_api.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [indicators, selectedRegion, selectedCategory, searchQuery]);

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'TCMB_EVDS':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">TCMB EVDS</span>;
      case 'FRED':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">FRED St. Louis</span>;
      case 'ECB':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">ECB Avrupa</span>;
      case 'FRANKFURTER':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">Frankfurter FX</span>;
      case 'TUIK':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">TÜİK</span>;
      case 'YAHOO_FINANCE':
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-700 text-slate-300 border border-slate-600">Yahoo Market</span>;
    }
  };

  const getCategoryLabel = (cat: IndicatorCategory | 'ALL') => {
    switch (cat) {
      case 'faiz': return 'Faiz & Para Politikası';
      case 'enflasyon': return 'Enflasyon';
      case 'doviz': return 'Döviz & Kurlar';
      case 'emtia': return 'Emtialar & Enerji';
      case 'risk_istahi': return 'Risk İştahı & Borsalar';
      case 'buyume': return 'Büyüme & Cari Denge';
      case 'istihdam': return 'İstihdam';
      case 'para_ve_likidite': return 'Rezervler & Para Arzı';
      case 'ALL': default: return 'Tüm Kategoriler';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Üst Başlık & Kontroller */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 backdrop-blur-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Landmark size={22} />
            </div>
            <h1 className="text-xl font-black tracking-tight text-white">Ekonomik Göstergeler & Makro İstihbarat</h1>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Canlı Akış
            </span>
          </div>
          <p className="text-xs text-slate-400">
            TCMB, Federal Reserve (FRED), ECB, TÜİK ve küresel piyasa faiz, enflasyon, kur ve likidite verileri.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchMacroData(true)}
            disabled={isRefreshing || isLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition disabled:opacity-50"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-indigo-400' : ''} />
            <span>{isRefreshing ? 'Yenileniyor...' : 'Verileri Güncelle'}</span>
          </button>
        </div>
      </div>

      {/* 2. Ana Sekme Seçici (Genel Bakış vs Grafikler) */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-1">
        <button
          onClick={() => setActiveMainTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition cursor-pointer ${
            activeMainTab === 'overview'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Activity size={16} />
          <span>Genel Bakış</span>
        </button>

        <button
          onClick={() => setActiveMainTab('charts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition cursor-pointer ${
            activeMainTab === 'charts'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <BarChart3 size={16} />
          <span>Grafikler & Zaman Serileri</span>
          <span className="px-1.5 py-0.2 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Yeni
          </span>
        </button>
      </div>

      {/* 3. SEKME İÇERİKLERİ */}
      {activeMainTab === 'charts' ? (
        <MacroChartsSection />
      ) : (
        <div className="space-y-6">
          {/* YZ Destekli Makro Yorum ve Sektör Önerisi Kartı (Bölüm 4 & 6) */}
          <div className="p-5 md:p-6 bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-slate-900/90 rounded-2xl border border-indigo-500/30 shadow-xl shadow-indigo-950/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-4 border-b border-indigo-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                YZ Destekli Makro Rejim & Sektör Görünümü
                <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Halüsinasyonsuz AI
                </span>
              </h2>
              {commentaryDate && (
                <p className="text-[11px] text-slate-400">
                  Son Analiz: {new Date(commentaryDate).toLocaleString('tr-TR')}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={handleRefreshCommentary}
            disabled={isCommentaryLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 transition disabled:opacity-50"
          >
            <Sparkles size={13} className={isCommentaryLoading ? 'animate-spin' : ''} />
            <span>{isCommentaryLoading ? 'Yapay Zeka Analiz Ediyor...' : 'Yeniden Analiz Et'}</span>
          </button>
        </div>

        {commentary ? (
          <div className="space-y-4">
            {/* Makro Rejim Özeti */}
            <div className="p-4 bg-slate-900/80 rounded-xl border border-indigo-500/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                Makroekonomik Rejim Özeti
              </span>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {commentary.makro_rejim_ozeti}
              </p>
            </div>

            {/* Sektör Görünümü Grid */}
            {commentary.sektor_gorunumu && commentary.sektor_gorunumu.length > 0 && (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                  Öne Çıkan Sektör Eğilimleri ({commentary.sektor_gorunumu.length} Sektör)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {commentary.sektor_gorunumu.map((sec, idx) => {
                    const isPos = sec.egilim === 'pozitif';
                    const isNeg = sec.egilim === 'negatif';
                    return (
                      <div 
                        key={idx}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isPos 
                            ? 'bg-emerald-950/20 border-emerald-500/30' 
                            : isNeg 
                            ? 'bg-rose-950/20 border-rose-500/30' 
                            : 'bg-slate-900/60 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <h4 className="font-bold text-sm text-white">{sec.sektor}</h4>
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                            isPos ? 'bg-emerald-500/20 text-emerald-300' : isNeg ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {sec.egilim.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
                          {sec.gerekce}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800/60">
                          <span>Güven: <strong className="text-slate-200 capitalize">{sec.guven_seviyesi}</strong></span>
                          <span>{sec.destekleyen_gosterge_sayisi} Destekleyen Gösterge</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Kullanılan Göstergeler Rozetleri */}
            {commentary.kullanilan_gostergeler && commentary.kullanilan_gostergeler.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 mr-1">Dayanak Göstergeler:</span>
                {commentary.kullanilan_gostergeler.map((kg, idx) => (
                  <span key={idx} className="px-2 py-0.5 text-[10px] bg-slate-800/80 text-slate-300 rounded border border-slate-700">
                    {kg}
                  </span>
                ))}
              </div>
            )}

            {/* Yasal Uyarı */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-950/40 px-3 py-2 rounded-lg border border-slate-800/60">
              <ShieldCheck size={14} className="text-indigo-400 shrink-0" />
              <span>{commentary.uyari}</span>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-sm animate-pulse">
            Makroekonomik YZ analizi yükleniyor...
          </div>
        )}
      </div>

      {/* 3. Filtreleme & Bölge Sekmeleri (Türkiye vs Küresel) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Bölge Butonları */}
        <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setSelectedRegion('ALL')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition ${
              selectedRegion === 'ALL' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tüm Piyasalar ({indicators.length})
          </button>
          <button
            onClick={() => setSelectedRegion('TR')}
            className={`flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold rounded-lg transition ${
              selectedRegion === 'TR' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🇹🇷 Türkiye</span>
            <span className="text-[10px] opacity-75">({indicators.filter(i => i.region === 'TR').length})</span>
          </button>
          <button
            onClick={() => setSelectedRegion('GLOBAL')}
            className={`flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold rounded-lg transition ${
              selectedRegion === 'GLOBAL' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🌐 Küresel & ABD/AB</span>
            <span className="text-[10px] opacity-75">({indicators.filter(i => i.region !== 'TR').length})</span>
          </button>
        </div>

        {/* Arama Kutusu */}
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Gösterge adı, kod veya kaynak ara (örn: TÜFE, Fed, Brent)..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Kategori Filtre Butonları */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(['ALL', 'faiz', 'enflasyon', 'doviz', 'emtia', 'risk_istahi', 'buyume', 'istihdam', 'para_ve_likidite'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition border ${
              selectedCategory === cat
                ? 'bg-slate-800 text-white border-indigo-500/50'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      {/* 4. Göstergeler Grid Listesi (Bölüm 4) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Gösterilen Göstergeler ({filteredIndicators.length})</span>
          <span>Değerler resmi merkez bankası ve piyasa kotalarıyla eşzamanlıdır</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredIndicators.map((ind) => {
            const isPositive = (ind.change_value || 0) > 0;
            const isNegative = (ind.change_value || 0) < 0;

            return (
              <div
                key={ind.id}
                className="p-4 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider bg-slate-800 px-1.5 py-0.5 rounded">
                      {ind.indicator_code}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {getSourceBadge(ind.source_api)}
                      {ind.is_stale && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Gecikmeli
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-slate-100 mb-2 leading-snug">
                    {ind.indicator_name}
                  </h3>

                  {ind.description && (
                    <p className="text-[11px] text-slate-400 mb-3 line-clamp-2">
                      {ind.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <div className="flex items-baseline justify-between mb-1.5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black tracking-tight text-white font-mono">
                        {ind.value.toLocaleString('tr-TR')}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        {ind.unit}
                      </span>
                    </div>

                    {ind.change_value !== undefined && ind.change_value !== 0 && (
                      <div className={`flex items-center gap-1 text-xs font-bold ${
                        isPositive ? 'text-emerald-400' : isNegative ? 'text-rose-400' : 'text-slate-400'
                      }`}>
                        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        <span>{isPositive ? '+' : ''}{ind.change_value}</span>
                        {ind.change_pct !== undefined && (
                          <span className="text-[10px] opacity-80">({isPositive ? '+' : ''}{ind.change_pct}%)</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Önceki: <strong className="text-slate-300">{ind.previous_value ?? 'N/A'} {ind.unit}</strong></span>
                    <span>Sıklık: <strong className="text-slate-300">{ind.frequency || 'Aylık'}</strong></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Varlık Etki Keşif Paneli (Bölüm 5 Entegrasyonu) */}
      <div className="p-5 md:p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers size={18} className="text-indigo-400" />
              Varlık Bazlı Makroekonomik Etki Matrisi
            </h3>
            <p className="text-xs text-slate-400">
              Bir varlık seçerek faiz, döviz ve emtia değişimlerinin bu varlığı nasıl etkilediğini inceleyin.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {popularSymbols.map((sym) => (
              <button
                key={sym}
                onClick={() => setSelectedAssetSymbol(sym)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                  selectedAssetSymbol === sym
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>

        <AssetImpactSection symbol={selectedAssetSymbol} />
      </div>
    </div>
  )}

      {/* 6. Alt Bilgi & Yasal Uyarı */}
      <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center space-y-1 text-xs text-slate-400">
        <p className="font-semibold text-slate-400">
          ⚠️ Önemli Yasal Uyarı & Bilgilendirme
        </p>
        <p className="text-[11px] leading-relaxed">
          Bu sayfada sunulan tüm ekonomik veriler, makro rejim özetleri ve sektör görünümleri bilgilendirme amaçlıdır. 
          Hiçbir şekilde yatırım tavsiyesi, portföy yönetim önerisi veya alım-satım taahhüdü niteliği taşımaz. 
          Yatırım kararlarınızı SPK lisanslı yetkili kuruluşlar ve yatırım danışmanları rehberliğinde alınız.
        </p>
      </div>
    </div>
  );
};
