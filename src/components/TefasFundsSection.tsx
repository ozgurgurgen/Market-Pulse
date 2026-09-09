import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldCheck, 
  Flame, 
  TrendingUp, 
  Sparkles, 
  Zap, 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronLeft,
  ArrowUpDown, 
  Percent, 
  SlidersHorizontal,
  Layers,
  Award,
  CheckCircle2,
  ExternalLink,
  PlusCircle,
  BarChart3,
  HelpCircle
} from 'lucide-react';
import { TefasFund, TefasCategory } from '../types';
import { TefasAiRadarModal } from './TefasAiRadarModal';
import { safeFetchJson } from '../utils/apiClient';

interface TefasFundsSectionProps {
  onSelectFund: (fund: TefasFund) => void;
  onAddToBacktest: (fund: TefasFund) => void;
  onOpenModelSettings: () => void;
  activeModelName: string;
}

type SortField = 'return1Y' | 'return6M' | 'return3Y' | 'dailyReturn' | 'sharpeRatio' | 'riskScore' | 'price';
type SortDirection = 'asc' | 'desc';

export const TefasFundsSection: React.FC<TefasFundsSectionProps> = ({
  onSelectFund,
  onAddToBacktest,
  onOpenModelSettings,
  activeModelName,
}) => {
  const [funds, setFunds] = useState<TefasFund[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRadarOpen, setIsRadarOpen] = useState(false);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TefasCategory | 'ALL'>('ALL');
  const [quickFilter, setQuickFilter] = useState<'ALL' | 'TOP_GAINERS' | 'INFLATION_BEAT' | 'ZERO_TAX' | 'HIGH_SHARPE' | 'LOW_RISK'>('ALL');
  const [sortField, setSortField] = useState<SortField>('return1Y');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(25);

  useEffect(() => {
    setLoading(true);
    safeFetchJson<{ funds: TefasFund[] }>('/api/tefas/funds')
      .then(({ data, ok }) => {
        if (ok && data?.funds && Array.isArray(data.funds)) {
          setFunds(data.funds);
        } else {
          setFunds([]);
        }
      })
      .catch(() => {
        setFunds([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filter & Sort Logic
  const filteredFunds = useMemo(() => {
    let result = [...funds];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(f => 
        f.code.toLowerCase().includes(q) ||
        f.name.toLowerCase().includes(q) ||
        f.founder.toLowerCase().includes(q) ||
        f.categoryLabel.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'ALL') {
      result = result.filter(f => f.category === selectedCategory);
    }

    // Quick filter presets
    if (quickFilter === 'TOP_GAINERS') {
      result = result.filter(f => f.return1Y >= 90);
    } else if (quickFilter === 'INFLATION_BEAT') {
      result = result.filter(f => f.inflationBeat1Y >= 35);
    } else if (quickFilter === 'ZERO_TAX') {
      result = result.filter(f => f.withholdingTax === 0);
    } else if (quickFilter === 'HIGH_SHARPE') {
      result = result.filter(f => f.sharpeRatio >= 2.3);
    } else if (quickFilter === 'LOW_RISK') {
      result = result.filter(f => f.riskScore <= 3);
    }

    // Sorting
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'desc' ? valB - valA : valA - valB;
      }
      return 0;
    });

    return result;
  }, [funds, searchQuery, selectedCategory, quickFilter, sortField, sortDirection]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, quickFilter, sortField, sortDirection, pageSize]);

  // Paginated funds
  const totalPages = Math.ceil(filteredFunds.length / pageSize) || 1;
  const paginatedFunds = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredFunds.slice(start, start + pageSize);
  }, [filteredFunds, currentPage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case 'ENFLASYON KALKANI':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
      case 'YÜKSEK BÜYÜME':
        return 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30';
      case 'GÜÇLÜ AL':
        return 'bg-emerald-400/15 text-emerald-300 border border-emerald-400/30';
      case 'DENGELİ BİRİKİM':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
      case 'KISA VADE LİKİT':
        return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  const getRiskScoreBadge = (score: number) => {
    if (score <= 2) return 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40';
    if (score <= 4) return 'bg-blue-950/80 text-blue-400 border-blue-500/40';
    if (score <= 6) return 'bg-amber-950/80 text-amber-400 border-amber-500/40';
    return 'bg-rose-950/80 text-rose-400 border-rose-500/40';
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: funds.length };
    funds.forEach(f => {
      counts[f.category] = (counts[f.category] || 0) + 1;
    });
    return counts;
  }, [funds]);

  return (
    <>
      <div className="space-y-6">
        
        {/* Top Hero Banner */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {funds.length} Aktif TEFAS Fonu Canlı İzleniyor
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium">
                  %0 Stopaj Taraması
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                TEFAS Yatırım Fonları Merkezi
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Takasbank ve SPK standartlarında tüm yatırım fonlarını inceleyin, yapay zeka destekli Sharpe, enflasyon kalkanı ve stopaj avantajı analizleriyle en doğru portföyü oluşturun.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
              <button
                type="button"
                onClick={() => setIsRadarOpen(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 border border-emerald-400/50 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-950/50 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Flame size={15} className="text-amber-300" />
                <span>AI Fırsat Avcısı</span>
              </button>

              <button
                type="button"
                onClick={onOpenModelSettings}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Zap size={14} className="text-amber-400" />
                <span>{activeModelName || 'Model Seç'}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
              <div className="text-[11px] text-slate-400 font-medium">Toplam Fon Havuzu</div>
              <div className="text-lg font-black text-white mt-0.5">{funds.length > 0 ? `${funds.length} Fon` : '0 Fon'}</div>
            </div>
            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
              <div className="text-[11px] text-slate-400 font-medium">Ortalama 1Y Getiri</div>
              <div className="text-lg font-black text-emerald-400 mt-0.5">
                {funds.length > 0 ? `+%${(funds.reduce((acc, f) => acc + (f.return1Y || 0), 0) / funds.length).toFixed(1)}` : '+%0.0'}
              </div>
            </div>
            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
              <div className="text-[11px] text-slate-400 font-medium">%0 Stopaj Avantajlı</div>
              <div className="text-lg font-black text-cyan-400 mt-0.5">
                {funds.filter(f => f.withholdingTax === 0).length} Hisse Fonu
              </div>
            </div>
            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
              <div className="text-[11px] text-slate-400 font-medium">Enflasyon Üstü Başarı</div>
              <div className="text-lg font-black text-amber-400 mt-0.5">
                {funds.length > 0 ? `%${((funds.filter(f => f.inflationBeat1Y > 0).length / funds.length) * 100).toFixed(1)} Oran` : '%0.0 Oran'}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          {/* Search and Sort controls */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Fon Kodu (TI2, MAC, AFT) veya İsim, Portföy Şirketi ara..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs text-slate-200 placeholder-slate-500 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Temizle
                </button>
              )}
            </div>

            {/* Quick Sort Dropdown & Page Size */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300">
                <SlidersHorizontal size={14} className="text-slate-400" />
                <span className="text-slate-500">Sırala:</span>
                <select
                  value={sortField}
                  onChange={(e) => handleSort(e.target.value as SortField)}
                  className="bg-transparent text-slate-200 font-medium outline-none cursor-pointer"
                >
                  <option value="return1Y" className="bg-slate-900">1 Yıllık Getiri</option>
                  <option value="return6M" className="bg-slate-900">6 Aylık Getiri</option>
                  <option value="return3Y" className="bg-slate-900">3 Yıllık Getiri</option>
                  <option value="dailyReturn" className="bg-slate-900">Günlük Değişim</option>
                  <option value="sharpeRatio" className="bg-slate-900">Sharpe Rasyosu</option>
                  <option value="riskScore" className="bg-slate-900">Risk Seviyesi</option>
                  <option value="price" className="bg-slate-900">Birim Fiyat</option>
                </select>
                <button
                  type="button"
                  onClick={() => setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')}
                  className="ml-1 text-slate-400 hover:text-emerald-400"
                  title="Sıralama Yönü"
                >
                  <ArrowUpDown size={13} />
                </button>
              </div>

              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-300 outline-none cursor-pointer"
              >
                <option value={25} className="bg-slate-900">25 / sayfa</option>
                <option value={50} className="bg-slate-900">50 / sayfa</option>
                <option value={100} className="bg-slate-900">100 / sayfa</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {[
              { key: 'ALL', label: 'Tüm Fonlar' },
              { key: 'HISSE_YOGUN', label: 'Hisse Yoğun (%0 Stopaj)' },
              { key: 'DEGISKEN', label: 'Değişken & Karma' },
              { key: 'SERBEST', label: 'Serbest Fonlar' },
              { key: 'KIYMETLI_MADEN', label: 'Kıymetli Madenler (Altın)' },
              { key: 'EUROBOND', label: 'Eurobond & Döviz' },
              { key: 'FON_SEPETI', label: 'Fon Sepeti / Global' },
              { key: 'PARA_PIYASASI', label: 'Para Piyasası (T+0)' },
            ].map((tab) => {
              const isSelected = selectedCategory === tab.key;
              const count = categoryCounts[tab.key] || 0;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSelectedCategory(tab.key as any)}
                  className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected 
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/80'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-slate-950/30 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* AI Quick Filter Presets */}
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-800/60 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Sparkles size={13} className="text-emerald-400" />
              <span>Hızlı AI Filtreleri:</span>
            </span>

            {[
              { key: 'ALL', label: 'Filtresiz' },
              { key: 'TOP_GAINERS', label: '🔥 En Çok Kazandıranlar (>%90)' },
              { key: 'INFLATION_BEAT', label: '🛡️ Enflasyon Kalkanı' },
              { key: 'ZERO_TAX', label: '💰 %0 Stopaj Muafiyeti' },
              { key: 'HIGH_SHARPE', label: '⚡ Yüksek Sharpe (>2.3)' },
              { key: 'LOW_RISK', label: '💧 0 Risk Likit (1-3)' },
            ].map((preset) => (
              <button
                key={preset.key}
                type="button"
                onClick={() => setQuickFilter(preset.key as any)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  quickFilter === preset.key
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {preset.label}
              </button>
            ))}

            <div className="ml-auto text-[11px] text-slate-400">
              <span className="text-emerald-400 font-bold">{filteredFunds.length}</span> fon bulundu
            </div>
          </div>
        </div>

        {/* Funds Table */}
        {loading ? (
          <div className="p-16 text-center text-emerald-400 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-3" />
            <div className="font-semibold text-sm">520+ TEFAS Fon Verisi Yükleniyor...</div>
          </div>
        ) : filteredFunds.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <div className="text-slate-400 text-sm">Arama kriterlerinize uygun TEFAS fonu bulunamadı.</div>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); setQuickFilter('ALL'); }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all"
            >
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 select-none">
                  <tr>
                    <th className="p-3.5 font-bold">Fon Kodu & İsim</th>
                    <th className="p-3.5 font-bold">Kategori & Stopaj</th>
                    <th className="p-3.5 font-bold cursor-pointer hover:text-white" onClick={() => handleSort('price')}>
                      <div className="flex items-center gap-1">
                        <span>Fiyat</span>
                        {sortField === 'price' && <ArrowUpDown size={12} className="text-emerald-400" />}
                      </div>
                    </th>
                    <th className="p-3.5 font-bold text-right cursor-pointer hover:text-white" onClick={() => handleSort('dailyReturn')}>
                      <div className="flex items-center justify-end gap-1">
                        <span>Günlük</span>
                        {sortField === 'dailyReturn' && <ArrowUpDown size={12} className="text-emerald-400" />}
                      </div>
                    </th>
                    <th className="p-3.5 font-bold text-right cursor-pointer hover:text-white" onClick={() => handleSort('return1Y')}>
                      <div className="flex items-center justify-end gap-1">
                        <span>1 Yıl Getiri</span>
                        {sortField === 'return1Y' && <ArrowUpDown size={12} className="text-emerald-400" />}
                      </div>
                    </th>
                    <th className="p-3.5 font-bold text-right cursor-pointer hover:text-white" onClick={() => handleSort('return3Y')}>
                      <div className="flex items-center justify-end gap-1">
                        <span>3 Yıl Getiri</span>
                        {sortField === 'return3Y' && <ArrowUpDown size={12} className="text-emerald-400" />}
                      </div>
                    </th>
                    <th className="p-3.5 font-bold text-center cursor-pointer hover:text-white" onClick={() => handleSort('sharpeRatio')}>
                      <div className="flex items-center justify-center gap-1">
                        <span>Sharpe / Risk</span>
                        {sortField === 'sharpeRatio' && <ArrowUpDown size={12} className="text-emerald-400" />}
                      </div>
                    </th>
                    <th className="p-3.5 font-bold">Yapay Zeka Kararı</th>
                    <th className="p-3.5 font-bold text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {paginatedFunds.map((fund, idx) => {
                    const isZeroTax = fund.withholdingTax === 0;
                    return (
                      <tr 
                        key={`tefas-fund-${fund.code}-${idx}`} 
                        onClick={() => onSelectFund(fund)} 
                        className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                      >
                        {/* Fund Code & Name */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-black text-xs text-emerald-400 group-hover:border-emerald-500/50 transition-colors">
                              {fund.code}
                            </div>
                            <div className="max-w-xs sm:max-w-sm">
                              <div className="font-bold text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-1">
                                {fund.name}
                              </div>
                              <div className="text-[11px] text-slate-400 line-clamp-1">
                                {fund.founder}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category & Tax */}
                        <td className="p-3.5">
                          <div className="space-y-1">
                            <div className="text-[11px] font-medium text-slate-300 line-clamp-1">
                              {fund.categoryLabel}
                            </div>
                            <div>
                              {isZeroTax ? (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                  %0 Stopaj
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                                  %{fund.withholdingTax} Stopaj
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="p-3.5 font-semibold text-slate-200">
                          {fund.price.toLocaleString('tr-TR', { minimumFractionDigits: 3, maximumFractionDigits: 4 })} ₺
                        </td>

                        {/* Daily Return */}
                        <td className="p-3.5 text-right font-semibold">
                          <span className={fund.dailyReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                            {fund.dailyReturn >= 0 ? `+${fund.dailyReturn}%` : `${fund.dailyReturn}%`}
                          </span>
                        </td>

                        {/* 1 Year Return */}
                        <td className="p-3.5 text-right">
                          <div className={`font-black ${!!(fund as any)._isMasked ? 'text-slate-500 blur-sm select-none' : 'text-emerald-400'} text-sm`}>
                            +{!!(fund as any)._isMasked ? '•••' : fund.return1Y}%
                          </div>
                          <div className={`text-[10px] ${!!(fund as any)._isMasked ? 'text-slate-600 blur-sm select-none' : 'text-slate-400'}`}>
                            Reel: +{!!(fund as any)._isMasked ? '•••' : fund.inflationBeat1Y}%
                          </div>
                        </td>

                        {/* 3 Year Return */}
                        <td className={`p-3.5 text-right font-bold ${!!(fund as any)._isMasked ? 'text-slate-600 blur-sm select-none' : 'text-slate-200'}`}>
                          +{!!(fund as any)._isMasked ? '•••' : fund.return3Y}%
                        </td>

                        {/* Sharpe & Risk Score */}
                        <td className="p-3.5 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            <span className={`font-bold ${!!(fund as any)._isMasked ? 'text-slate-600 blur-sm select-none' : 'text-slate-200'}`}>{!!(fund as any)._isMasked ? '•••' : fund.sharpeRatio}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getRiskScoreBadge(fund.riskScore)}`}>
                              R:{fund.riskScore}
                            </span>
                          </div>
                        </td>

                        {/* AI Verdict */}
                        <td className="p-3.5">
                          <span className={`px-2 py-1 rounded-lg text-[10px] font-bold inline-block whitespace-nowrap ${getVerdictStyle(fund.aiVerdict)}`}>
                            {fund.aiVerdict}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => onAddToBacktest(fund)}
                              className="p-1.5 bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                              title="Portföy Backtestine Ekle"
                            >
                              <PlusCircle size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => onSelectFund(fund)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                              title="Derinlemesine Raporu Aç"
                            >
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <div>
                Toplam <span className="text-white font-bold">{filteredFunds.length}</span> fon içerisinden{' '}
                <span className="text-white font-bold">{(currentPage - 1) * pageSize + 1}</span> -{' '}
                <span className="text-white font-bold">{Math.min(currentPage * pageSize, filteredFunds.length)}</span> arası gösteriliyor
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 disabled:opacity-40 rounded-lg hover:bg-slate-800 text-slate-200 transition-all flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} />
                  <span>Önceki</span>
                </button>

                <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 font-bold">
                  {currentPage} / {totalPages}
                </div>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 disabled:opacity-40 rounded-lg hover:bg-slate-800 text-slate-200 transition-all flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>Sonraki</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
      <TefasAiRadarModal isOpen={isRadarOpen} onClose={() => setIsRadarOpen(false)} onSelectFund={onSelectFund} />
    </>
  );
};
