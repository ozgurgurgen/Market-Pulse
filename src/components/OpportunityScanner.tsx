import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  ShieldAlert, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck,
  ChevronRight,
  Flame,
  Activity,
  Layers,
  Clock,
  Compass,
  ArrowUpRight,
  ShieldCheck,
  Cpu,
  Percent,
  Sliders,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { OpportunitySignal, StockQuote, LatestBalanceSheetItem } from '../types';
import { SignalEngineV2Modal } from './SignalEngineV2Modal';
import { safeFetchJson } from '../utils/apiClient';
import { LockedField } from './ui/LockedField';
import { useSubscription } from '../hooks/useSubscription';

interface OpportunityScannerProps {
  opportunities: OpportunitySignal[];
  isLoading: boolean;
  onAnalyzeStock: (symbol: string, name: string, exchange: string, category: string) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string, name: string, price: number, exchange: string) => void;
  onSelectCategory: (cat: any) => void;
  radarLayout?: "GRID" | "LIST";
  activeCategory: string;
}

export const OpportunityScanner: React.FC<OpportunityScannerProps> = ({
  opportunities,
  isLoading,
  onAnalyzeStock,
  watchlist,
  onToggleWatchlist,
  onSelectCategory,
  activeCategory,
  radarLayout = "GRID",
}) => {
  const { canAccess, isAdmin, tier } = useSubscription();
  const hasScannerAccess = canAccess('opportunityScanner') || isAdmin || tier === 'premium' || tier === 'pro';
  const [filterSignal, setFilterSignal] = useState<string>('ALL');
  const [isEngineModalOpen, setIsEngineModalOpen] = useState<boolean>(false);
  const [driftStatus, setDriftStatus] = useState<{ isPaused: boolean; message: string; liveWinRate?: number } | null>(null);
  const [latestFinancials, setLatestFinancials] = useState<LatestBalanceSheetItem[]>([]);
  const [isRefreshingFinancials, setIsRefreshingFinancials] = useState<boolean>(false);

  const fetchLatestFinancials = useCallback(() => {
    setIsRefreshingFinancials(true);
    safeFetchJson<{ data: LatestBalanceSheetItem[] }>('/api/financials/latest')
      .then(({ data, ok }) => {
        if (ok && data?.data) {
          setLatestFinancials(data.data.slice(0, 4));
        }
      })
      .finally(() => {
        setIsRefreshingFinancials(false);
      });
  }, []);

  useEffect(() => {
    safeFetchJson<any>('/api/signals/v2/drift-status').then(({ data, ok }) => {
      if (ok && data) {
        setDriftStatus({
          isPaused: !!data.isPaused || !!data.currentStatus?.driftDetected,
          message: data.currentStatus?.message || '',
          liveWinRate: data.currentStatus?.liveWinRate,
        });
      }
    });

    fetchLatestFinancials();
  }, [fetchLatestFinancials]);

  const filteredOpportunities = opportunities.filter((item) => {
    const matchesCat = activeCategory === 'ALL' || item.category === activeCategory;
    const matchesSig = filterSignal === 'ALL' || item.signalType === filterSignal;
    return matchesCat && matchesSig;
  });

  const getSignalBadge = (type: string) => {
    switch (type) {
      case 'STRONG_BUY':
        return {
          bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
          label: 'GÜÇLÜ TERCİH',
          icon: <Flame size={13} className="text-emerald-400" />
        };
      case 'BUY':
        return {
          bg: 'bg-teal-500/15 text-teal-400 border-teal-500/40',
          label: 'KADEMELİ AL',
          icon: <TrendingUp size={13} className="text-teal-400" />
        };
      case 'WATCH':
        return {
          bg: 'bg-amber-500/15 text-amber-400 border-amber-500/40',
          label: 'İZLEMEDE KAL',
          icon: <Clock size={13} className="text-amber-400" />
        };
      case 'TAKE_PROFIT':
        return {
          bg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/40',
          label: 'KAR AL',
          icon: <Target size={13} className="text-indigo-400" />
        };
      default:
        return {
          bg: 'bg-slate-800 text-slate-300 border-slate-700',
          label: type,
          icon: <Activity size={13} />
        };
    }
  };

  return (
    <div id="opportunity-scanner-section" className="space-y-6">
      
      {/* Sinyal Motoru v2 Modal */}
      <SignalEngineV2Modal isOpen={isEngineModalOpen} onClose={() => setIsEngineModalOpen(false)} />

      {/* Banner / Hero Context Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-emerald-500 text-slate-950 rounded-full flex items-center gap-1">
                <Cpu size={12} />
                SİNYAL MOTORU V2
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <ShieldCheck size={13} className="text-emerald-400" />
                5 Kategori Ensemble • Çeyrek Kelly & Risk Kısıtları
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Olasılıksal & Risk Yönetimli Piyasa Sinyalleri
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Trend, Momentum, Volatilite Squeeze, Değerleme ve Doğrulanmış Haber kategorileri birleştirilerek, matematiksel Çeyrek Kelly tavanı ve portföy risk filtreleri ile taranır.
            </p>
          </div>

          {/* Quick Filter & Test Suite Button */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
            <button
              onClick={() => setIsEngineModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Test & Doğrulama Paneli (39/39)</span>
            </button>

            <div className="flex flex-wrap items-center gap-1 bg-slate-950/70 p-1.5 rounded-xl border border-slate-800">
              <button
                onClick={() => setFilterSignal('ALL')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  filterSignal === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tümü
              </button>
              <button
                onClick={() => setFilterSignal('STRONG_BUY')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  filterSignal === 'STRONG_BUY' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🔥 Güçlü Tercih
              </button>
              <button
                onClick={() => setFilterSignal('BUY')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  filterSignal === 'BUY' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                📈 Kademeli Al
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Son Açıklanan Finansal Tablolar (Kısa Liste / Hızlı Bakış) */}
      {latestFinancials.length > 0 && (
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                <span>Son Açıklanan Finansal Tablolar</span>
                <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">(KAP Canlı Akışı)</span>
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                Otomatik Bilanço Alarmları Aktif
              </span>
              <button
                type="button"
                onClick={fetchLatestFinancials}
                disabled={isRefreshingFinancials}
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs"
                title="Tabloları Güncelle"
              >
                <RefreshCw size={13} className={isRefreshingFinancials ? 'animate-spin text-emerald-400' : ''} />
                <span className="text-[10px]">Yenile</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {latestFinancials.map((item, idx) => (
              <button
                key={`latest-fin-${item.symbol}-${item.period || idx}`}
                type="button"
                id={`latest-fin-home-${item.symbol}`}
                onClick={() => onAnalyzeStock(item.symbol, item.companyName, 'BIST', 'BIST')}
                className="p-3 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/80 hover:border-emerald-500/40 rounded-xl text-left transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-xs text-white group-hover:text-emerald-400 transition-colors">
                      {item.symbol}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-semibold">
                      {item.period}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Karne: {item.scorecardScore}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 truncate mb-2">
                  {item.companyName}
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                  <div>
                    <span className="text-slate-500">Net Kâr: </span>
                    <span className="text-slate-200 font-semibold">
                      {item.netProfitFormatted || (item.netIncomeTRY ? `${(item.netIncomeTRY / 1_000_000_000).toFixed(2)} Milyar ₺` : 'N/A')}
                    </span>
                  </div>
                  <span className={`font-bold ${((item.netProfitGrowthYoY ?? item.netIncomeYoYPct ?? 0) >= 0) ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {((item.netProfitGrowthYoY ?? item.netIncomeYoYPct ?? 0) >= 0) ? '+' : ''}{item.netProfitGrowthYoY ?? item.netIncomeYoYPct ?? 0}% YoY
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Model Drift Warning Banner (Madde C) */}
      {driftStatus?.isPaused && (
        <div id="model-drift-alert-banner" className="rounded-2xl border-2 border-rose-500/50 bg-rose-950/40 p-4 sm:p-5 text-rose-100 flex items-start gap-4 shadow-xl backdrop-blur-sm animate-pulse">
          <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 shrink-0">
            <ShieldAlert size={22} />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-500 text-white">
                SİSTEM KORUMA MODU
              </span>
              <h4 className="text-sm sm:text-base font-black text-white">
                ⚠️ Model Sapması Tespit Edildi — Yeni Sinyal Üretimi Duraklatıldı
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-rose-200/90 leading-relaxed">
              {driftStatus.message || 'Canlı sinyal kazanma oranı beklenen istatistiksel eşiğin 2 standart sapma altına düştü. Sermaye güvenliği amacıyla yeni sinyal üretimi otomatik duraklatıldı — re-optimizasyon gerekiyor.'}
            </p>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-64 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse p-6">
              <div className="h-6 w-1/3 bg-slate-800 rounded mb-4"></div>
              <div className="h-4 w-2/3 bg-slate-800/60 rounded mb-6"></div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="h-12 bg-slate-800/40 rounded"></div>
                <div className="h-12 bg-slate-800/40 rounded"></div>
                <div className="h-12 bg-slate-800/40 rounded"></div>
              </div>
              <div className="h-8 bg-slate-800/50 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* Opportunities Grid */}
      {!isLoading && filteredOpportunities.length > 0 && (
        <div className={radarLayout === "LIST" ? "flex flex-col space-y-4" : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"}>
          {filteredOpportunities.map((opp) => {
            const isWatchlisted = watchlist.includes(opp.symbol);
            const badge = getSignalBadge(opp.signalType);
            const currency = opp.category === 'BIST' || opp.symbol === 'ALTIN' || opp.symbol === 'CEYREK' || opp.symbol === 'GUMUS' ? '₺' : '$';

            const isMasked = hasScannerAccess ? false : !!(opp as any)._isMasked;

            return (
              <LockedField 
                key={opp.id} 
                mode="blur" 
                isLocked={isMasked} 
                moduleName="opportunity_scanner"
                ctaText="Tüm Fırsatları ve Hedef Fiyatları Gör"
              >
              <div
                id={`opportunity-card-${opp.symbol}`}
                className="group relative rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800/90 hover:border-emerald-500/40 transition-all duration-200 p-5 shadow-lg flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Symbol, Name, Badge, AI Score */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="min-w-[56px] px-2 py-1.5 rounded-xl bg-slate-950 border border-slate-700/70 flex flex-col items-center justify-center text-center shrink-0">
                        <span className="text-xs font-black text-white tracking-wide whitespace-nowrap">{opp.symbol}</span>
                        <span className="text-[9px] font-semibold text-emerald-400 uppercase tracking-tight whitespace-nowrap">
                          {opp.exchange === 'COMMODITIES' ? 'EMTİA' : opp.exchange}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                            {opp.name}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-400">{opp.category} • {opp.timeframe}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
                        {badge.icon}
                        <span>{badge.label}</span>
                      </div>

                      <button
                        id={`btn-fav-${opp.symbol}`}
                        onClick={() => onToggleWatchlist(opp.symbol, opp.name, opp.currentPrice, opp.exchange)}
                        title={isWatchlisted ? 'İzleme listesinden çıkar' : 'İzleme listesine ekle'}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isWatchlisted
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                            : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {isWatchlisted ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Strategy & Confidence Score */}
                  <div className="mb-4 bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-400 font-medium flex items-center gap-1">
                        <Layers size={13} className="text-amber-400" /> Tespit Edilen Strateji:
                      </span>
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <Sparkles size={12} /> %{opp.confidenceScore} Güven
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-200 leading-snug">
                      {opp.strategy}
                    </p>
                  </div>

                  {/* Price Targets & Risk Management Matrix */}
                  <div className="grid grid-cols-4 gap-2 mb-4 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/60 text-center">
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Mevcut</div>
                      <div className="text-xs font-bold text-slate-100">
                        {opp.currentPrice != null ? `${currency}${opp.currentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` : '—'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-emerald-400/90 font-medium">Hedef 1 (TP1)</div>
                      <div className="text-xs font-bold text-emerald-400">
                        {opp.targetPrice1 != null ? `${currency}${opp.targetPrice1.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` : '—'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-rose-400/90 font-medium">Zarar Kes (SL)</div>
                      <div className="text-xs font-bold text-rose-400">
                        {opp.stopLoss != null ? `${currency}${opp.stopLoss.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` : '—'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-amber-400/90 font-medium">Risk / Ödül</div>
                      <div className="text-xs font-bold text-amber-300">
                        {opp.riskRewardRatio || '—'}
                      </div>
                    </div>
                  </div>

                  {/* Sinyal Motoru v2 Ensemble Gösterge Dağılımı & Kelly Boyutlandırması */}
                  {opp.ensembleV2 && (
                    <div className="mb-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-300 flex items-center gap-1.5">
                          <Sliders size={12} className="text-emerald-400" />
                          Ensemble v2 (Rejim: <span className="text-cyan-400 font-semibold">{opp.ensembleV2.regime || 'Dengeli'}</span>, ADX: {opp.ensembleV2.adx != null ? opp.ensembleV2.adx.toFixed(1) : '—'})
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          Skor: {opp.ensembleV2.compositeScore > 0 ? `+${opp.ensembleV2.compositeScore}` : opp.ensembleV2.compositeScore}
                        </span>
                      </div>

                      {/* 5 Kategori Puanları */}
                      {opp.ensembleV2.categoryScores && (
                        <div className="grid grid-cols-5 gap-1 text-center text-[10px]">
                          <div className="p-1 rounded bg-slate-900 border border-slate-800">
                            <div className="text-slate-500 text-[9px]">Trend</div>
                            <div className={`font-bold ${(opp.ensembleV2.categoryScores.trend || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {(opp.ensembleV2.categoryScores.trend || 0) > 0 ? `+${opp.ensembleV2.categoryScores.trend}` : (opp.ensembleV2.categoryScores.trend || 0)}
                            </div>
                          </div>
                          <div className="p-1 rounded bg-slate-900 border border-slate-800">
                            <div className="text-slate-500 text-[9px]">Momentum</div>
                            <div className={`font-bold ${(opp.ensembleV2.categoryScores.momentum || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {(opp.ensembleV2.categoryScores.momentum || 0) > 0 ? `+${opp.ensembleV2.categoryScores.momentum}` : (opp.ensembleV2.categoryScores.momentum || 0)}
                            </div>
                          </div>
                          <div className="p-1 rounded bg-slate-900 border border-slate-800">
                            <div className="text-slate-500 text-[9px]">Volatilite</div>
                            <div className={`font-bold ${(opp.ensembleV2.categoryScores.volatility || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {(opp.ensembleV2.categoryScores.volatility || 0) > 0 ? `+${opp.ensembleV2.categoryScores.volatility}` : (opp.ensembleV2.categoryScores.volatility || 0)}
                            </div>
                          </div>
                          <div className="p-1 rounded bg-slate-900 border border-slate-800">
                            <div className="text-slate-500 text-[9px]">Değerleme</div>
                            <div className={`font-bold ${(opp.ensembleV2.categoryScores.value || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {(opp.ensembleV2.categoryScores.value || 0) > 0 ? `+${opp.ensembleV2.categoryScores.value}` : (opp.ensembleV2.categoryScores.value || 0)}
                            </div>
                          </div>
                          <div className="p-1 rounded bg-slate-900 border border-slate-800">
                            <div className="text-slate-500 text-[9px]">Haber</div>
                            <div className={`font-bold ${(opp.ensembleV2.categoryScores.news || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {(opp.ensembleV2.categoryScores.news || 0) > 0 ? `+${opp.ensembleV2.categoryScores.news}` : (opp.ensembleV2.categoryScores.news || 0)}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Kelly Position Sizing Badge */}
                      {opp.ensembleV2.positionSizing && (
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80 text-slate-400">
                          <span className="flex items-center gap-1">
                            <Percent size={11} className="text-amber-400" />
                            Önerilen Pozisyon (Çeyrek Kelly):
                          </span>
                          <span className="font-bold text-amber-300">
                            %{((opp.ensembleV2.positionSizing.recommendedPct || 0) >= 1 ? opp.ensembleV2.positionSizing.recommendedPct : (opp.ensembleV2.positionSizing.recommendedPct || 0) * 100).toFixed(0)} Portföy
                            {opp.ensembleV2.positionSizing.isHardCapped && ' (Tavan %8)'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Key Catalysts & Bullets */}
                  <div className="space-y-1.5 mb-4">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Öne Çıkan Katalizörler:
                    </div>
                    {(opp.keyCatalysts || (opp as any).catalysts || []).slice(0, 2).map((cat: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                        <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{cat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Technical Summary Pills */}
                  {opp.technicalSummary && (
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] mb-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        RSI: <strong className="text-amber-400">{opp.technicalSummary.rsi}</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        MACD: <strong className="text-emerald-400">{opp.technicalSummary.macd}</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        Trend: <strong className="text-cyan-400">{opp.technicalSummary.trend}</strong>
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <a
                    href={`https://www.google.com/finance/quote/${opp.symbol}:${opp.exchange === 'BIST' ? 'IST' : 'NASDAQ'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                  >
                    <span>Google Finance</span>
                    <ExternalLink size={12} />
                  </a>

                  <button
                    id={`btn-deep-analyze-${opp.symbol}`}
                    onClick={() => onAnalyzeStock(opp.symbol, opp.name, opp.exchange, opp.category)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <Sparkles size={13} />
                    <span>Derin AI Analizi Yap</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
              </LockedField>
            );
          })}
        </div>
      )}

      {!isLoading && filteredOpportunities.length === 0 && (
        <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
          <Activity size={32} className="mx-auto text-slate-600 mb-2" />
          <h3 className="text-base font-bold text-slate-300">Seçilen filtrede sinyal bulunamadı</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {filterSignal !== 'ALL' ? `"${filterSignal}" filtresi için mevcut sinyal yok. Filtreyi sıfırlayabilirsiniz.` : 'Lütfen kategori veya sinyal filtresini değiştirip yeniden deneyin.'}
          </p>
          {(filterSignal !== 'ALL' || activeCategory !== 'ALL') && (
            <button
              onClick={() => {
                setFilterSignal('ALL');
                onSelectCategory('ALL');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-colors cursor-pointer"
            >
              <span>Tüm Sinyalleri ve Varlıkları Göster</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
