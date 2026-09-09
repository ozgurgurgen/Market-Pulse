import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Calendar, 
  TrendingUp, 
  Flame, 
  ExternalLink, 
  FileText, 
  PieChart as PieIcon, 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Lock, 
  Sparkles, 
  ChevronRight, 
  Search, 
  Filter, 
  Info, 
  Layers, 
  ArrowUpRight, 
  DollarSign, 
  ShieldCheck, 
  Crown,
  RefreshCw,
  X,
  Share2,
  Percent,
  Briefcase
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  CartesianGrid,
  Legend
} from 'recharts';
import { IPOListing, IPOSectorSummary, IPOStatus } from '../types';
import { useSubscription } from '../hooks/useSubscription';
import { safeFetchJson } from '../utils/apiClient';
import { LockedField } from './ui/LockedField';

interface Props {
  onOpenUpgradeModal: (featureName?: string) => void;
}

export const IPOTracker: React.FC<Props> = ({ onOpenUpgradeModal }) => {
  const { canAccess, subscription, plan } = useSubscription();
  const hasAccess = canAccess('ipoTracker');

  const [listings, setListings] = useState<IPOListing[]>([]);
  const [sectorSummaries, setSectorSummaries] = useState<IPOSectorSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIpo, setSelectedIpo] = useState<IPOListing | null>(null);
  const [modalTab, setModalTab] = useState<'overview' | 'financials' | 'structural' | 'alpha' | 'demand_qualitative'>('overview');
  const [similarIpos, setSimilarIpos] = useState<IPOListing[]>([]);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Filters
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'upcoming' | 'completed' | 'sector'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [listingsRes, sectorRes] = await Promise.all([
        safeFetchJson<{ success: boolean; listings: IPOListing[] }>('/api/ipo/listings'),
        safeFetchJson<{ success: boolean; summaries: IPOSectorSummary[] }>('/api/ipo/sector-analysis')
      ]);

      if (listingsRes.data?.listings) {
        setListings(listingsRes.data.listings);
      }
      if (sectorRes.data?.summaries) {
        setSectorSummaries(sectorRes.data.summaries);
      }
    } catch (err) {
      console.error('Failed to load IPO data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectIpo = async (ipo: IPOListing) => {
    setSelectedIpo(ipo);
    setIsLoadingDetail(true);
    try {
      const res = await safeFetchJson<{ success: boolean; ipo: IPOListing; similar: IPOListing[] }>(`/api/ipo/listings/${ipo.id}`);
      if (res.data?.similar) {
        setSimilarIpos(res.data.similar);
      }
    } catch (err) {
      console.error('Failed to load IPO details:', err);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // Distinct sectors
  const allSectors = Array.from(new Set(listings.map(i => i.sector).filter(Boolean)));

  // Filtered listings
  const filteredListings = listings.filter(item => {
    const matchesSearch = item.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.sector.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = sectorFilter === 'ALL' || item.sector === sectorFilter;
    const matchesTab = activeTab === 'all' || 
                       (activeTab === 'sector') || 
                       (activeTab === 'active' && item.status === 'active') ||
                       (activeTab === 'upcoming' && item.status === 'upcoming') ||
                       (activeTab === 'completed' && item.status === 'completed');

    return matchesSearch && matchesSector && matchesTab;
  });

  const activeCount = listings.filter(i => i.status === 'active').length;
  const upcomingCount = listings.filter(i => i.status === 'upcoming').length;
  const completedCount = listings.filter(i => i.status === 'completed').length;

  const totalCapitalRaised = listings
    .filter(i => i.status === 'completed')
    .reduce((acc, curr) => acc + (curr.marketCapTRY || 0), 0);

  const avgFirstDayReturn = (() => {
    const valid = listings.filter(i => i.status === 'completed' && i.performance?.day1ReturnPct != null);
    if (valid.length === 0) return 0;
    const sum = valid.reduce((acc, curr) => acc + (curr.performance.day1ReturnPct || 0), 0);
    return Number((sum / valid.length).toFixed(1));
  })();

  // Paywall Masking (for Free & Starter)
  if (!hasAccess) {
    return (
      <div id="ipo-tracker-locked" className="space-y-6">
        {/* Teaser Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/20 p-8 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
              <Crown size={14} className="text-amber-400" />
              Pro & Premium Özel Modül
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Halka Arz (IPO) Takip & Derin İstihbarat Merkezi
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              SPK haftalık bültenleri ve KAP onaylı izahnameler üzerinden doğrulanmış halka arz takvimi, talep karşılama çarpanları, sektörel tavan analizleri ve geçmiş benzer halka arz kıyaslamaları.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                type="button"
                onClick={() => onOpenUpgradeModal('Halka Arz Takip & Analiz')}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-cyan-500/25 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Crown size={18} className="text-amber-300" />
                Hemen Pro'ya Yükselt ve Kilidi Aç
              </button>
            </div>
          </div>
        </div>

        {/* Blurred Teaser Grid */}
        <div className="relative">
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6 text-center rounded-3xl border border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 shadow-xl">
              <Lock size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Halka Arz İstihbaratına Erişin</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6">
              Mevcut paketiniz (<span className="text-cyan-400 font-bold uppercase">{plan.name}</span>) bu modülü kapsamamaktadır. Pro ve Premium paketlerde sınırsız izahname metrikleri ve sektörel kıyaslamalar aktiftir.
            </p>
            <button
              type="button"
              onClick={() => onOpenUpgradeModal('Halka Arz Takip')}
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/40 cursor-pointer"
            >
              Planları İncele & Yükselt
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-30 select-none pointer-events-none filter blur-sm">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                <div className="h-6 w-24 bg-slate-800 rounded" />
                <div className="h-10 w-full bg-slate-800 rounded" />
                <div className="h-20 w-full bg-slate-800 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="ipo-tracker-main" className="space-y-6">
      {/* Top Banner & Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Building2 size={22} />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  Halka Arz (IPO) Takip & Analiz Merkezi
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    KAP Canlı
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  SPK onaylı bültenler, talep toplama takvimi, karşılama oranları ve sektörel ilk gün performans analizi.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={fetchData}
              disabled={isLoading}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin text-cyan-400' : ''} />
              Yenile
            </button>
          </div>
        </div>

        {/* Hero Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl">
            <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <Flame size={13} className="text-amber-400" />
              Talep Toplamada
            </div>
            <div className="text-xl font-black text-white font-mono">{activeCount} Şirket</div>
            <div className="text-[10px] text-emerald-400 mt-0.5 font-medium">Aktif talep girişi açık</div>
          </div>

          <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl">
            <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <Clock size={13} className="text-blue-400" />
              Yaklaşan Halka Arzlar
            </div>
            <div className="text-xl font-black text-white font-mono">{upcomingCount} Şirket</div>
            <div className="text-[10px] text-slate-400 mt-0.5">SPK onaylı takvim</div>
          </div>

          <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl">
            <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <TrendingUp size={13} className="text-emerald-400" />
              Ort. 1. Gün Getirisi
            </div>
            <div className="text-xl font-black text-emerald-400 font-mono">+{avgFirstDayReturn}%</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Son tamamlanan arzlar</div>
          </div>

          <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl">
            <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <DollarSign size={13} className="text-cyan-400" />
              Toplam Arz Hacmi
            </div>
            <div className="text-xl font-black text-white font-mono">
              ₺{(totalCapitalRaised / 1000000000).toFixed(1)} Mlr
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Borsa İstanbul piyasası</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs & Search Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'all' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tüm Halka Arzlar ({listings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'active' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Talep Toplamada ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upcoming')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'upcoming' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Yaklaşanlar ({upcomingCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'completed' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tamamlananlar ({completedCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sector')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'sector' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 size={14} />
            Sektörel Getiri Analizi
          </button>
        </div>

        {/* Search & Sector Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Şirket veya BIST kodu..."
              className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-colors"
            />
          </div>

          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500/60"
          >
            <option value="ALL">Tüm Sektörler</option>
            {allSectors.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'sector' ? (
        /* Sektörel Dağılım ve Analiz Görünümü (Module 4) */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Sektör Başına Halka Arz Adedi */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <BarChart3 size={16} className="text-cyan-400" />
                    Sektörel Halka Arz Yoğunluğu (Son 12 Ay)
                  </h3>
                  <p className="text-[11px] text-slate-400">Sektör başına gerçekleşen ve planlanan halka arz adedi</p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sectorSummaries} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis 
                      dataKey="sector" 
                      tick={{ fill: '#94a3b8', fontSize: 10 }} 
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                    />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                      formatter={(value: any) => [`${value} Adet Halka Arz`, 'Yoğunluk']}
                    />
                    <Bar dataKey="ipoCount" fill="#06b6d4" radius={[6, 6, 0, 0]}>
                      {sectorSummaries.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#06b6d4' : '#3b82f6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Sektör Bazlı Ortalama 1. Gün Getirisi */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp size={16} className="text-emerald-400" />
                    Sektörel Ortalama 1. Gün Tavan Performansı (%)
                  </h3>
                  <p className="text-[11px] text-slate-400">Halka arz fiyatına kıyasla 1. gün kapanış primi</p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sectorSummaries} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis 
                      dataKey="sector" 
                      tick={{ fill: '#94a3b8', fontSize: 10 }} 
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                    />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} unit="%" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                      formatter={(value: any) => [`%+${value}`, 'Ortalama 1. Gün']}
                    />
                    <Bar dataKey="avgDay1Return" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Sektör Detay Tablosu */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white">Sektörel Sermaye Piyasası Özeti</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Sektör</th>
                    <th className="py-3 px-4">Halka Arz Adedi</th>
                    <th className="py-3 px-4">Ortalama 1. Gün Getirisi</th>
                    <th className="py-3 px-4">Ortalama 1. Ay Getirisi</th>
                    <th className="py-3 px-4 text-right">Toplam Halka Arz Büyüklüğü (₺)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {sectorSummaries.map((sec, idx) => (
                    <tr key={idx} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-white">{sec.sector}</td>
                      <td className="py-3 px-4 font-mono font-semibold">{sec.ipoCount} Şirket</td>
                      <td className="py-3 px-4 font-mono text-emerald-400 font-bold">
                        {sec.avgDay1Return > 0 ? `%+${sec.avgDay1Return}` : '—'}
                      </td>
                      <td className="py-3 px-4 font-mono text-cyan-400">
                        {sec.avgMonth1Return > 0 ? `%+${sec.avgMonth1Return}` : '—'}
                      </td>
                      <td className="py-3 px-4 font-mono text-right text-slate-200 font-bold">
                        ₺{sec.totalRaisedTRY ? sec.totalRaisedTRY.toLocaleString('tr-TR') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Halka Arz Kartları Grid Görünümü */
        <div>
          {isLoading ? (
            <div className="min-h-[300px] flex items-center justify-center p-12 bg-slate-900/50 border border-slate-800 rounded-3xl">
              <div className="flex items-center gap-3 text-slate-400 text-xs font-semibold">
                <RefreshCw size={18} className="animate-spin text-cyan-400" />
                Resmi halka arz veritabanı yükleniyor...
              </div>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="min-h-[250px] flex flex-col items-center justify-center p-12 bg-slate-900/40 border border-slate-800 rounded-3xl text-center">
              <Building2 size={36} className="text-slate-600 mb-3" />
              <h4 className="text-sm font-bold text-slate-300">Seçili Kriterlere Uygun Halka Arz Bulunamadı</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">Filtrelerinizi temizleyebilir veya tüm halka arzlar sekmesine geçebilirsiniz.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredListings.map(ipo => {
                const isHighDemand = ipo.demandMultiplier != null && ipo.demandMultiplier >= 50;

                return (
                  <div
                    key={ipo.id}
                    className="group bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 rounded-3xl p-5 sm:p-6 transition-all duration-200 shadow-xl flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Top Row: Badge & Ticker */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center font-mono font-black text-cyan-400 text-xs">
                            {ipo.ticker}
                          </span>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              {ipo.sector}
                            </span>
                            <h3 className="text-sm font-bold text-white line-clamp-1" title={ipo.companyName}>
                              {ipo.companyName}
                            </h3>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                          ipo.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse'
                            : ipo.status === 'upcoming'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {ipo.status === 'active' && 'Talep Toplamada'}
                          {ipo.status === 'upcoming' && 'Yaklaşan'}
                          {ipo.status === 'completed' && 'Tamamlandı'}
                          {ipo.status === 'draft' && 'Taslak'}
                        </span>
                      </div>

                      {/* Main Metrics Box */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl my-3.5 text-xs">
                        <div>
                          <span className="text-[10px] font-semibold text-slate-500 block">Halka Arz Fiyatı</span>
                          <span className="font-mono font-black text-white text-sm">
                            ₺{ipo.offerPrice.toFixed(2)}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-semibold text-slate-500 block">Dağıtım Modeli</span>
                          <span className="font-semibold text-slate-200 text-[11px] truncate block" title={ipo.methodLabel}>
                            {ipo.methodLabel}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-semibold text-slate-500 block">Talep Tarihleri</span>
                          <span className="font-mono text-slate-300 text-[11px]">
                            {ipo.bookBuildingStartDate.slice(5)} / {ipo.bookBuildingEndDate.slice(5)}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-semibold text-slate-500 block">Toplam Lot / Büyüklük</span>
                          <span className="font-mono text-slate-300 text-[11px]">
                            {ipo.totalLot ? `${(ipo.totalLot / 1000000).toFixed(1)}M Lot` : '—'}
                            {ipo.marketCapTRY ? ` (₺${(ipo.marketCapTRY / 1000000000).toFixed(1)}B)` : ''}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-semibold text-slate-500 block">Bireysel Tahsisat</span>
                          <span className="font-mono text-cyan-400 font-bold text-[11px]">
                            {ipo.allocationIndividualRatio != null ? `%${ipo.allocationIndividualRatio}` : '—'}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-semibold text-slate-500 block">Karşılama Oranı</span>
                          {ipo.demandMultiplier != null ? (
                            <span className={`inline-flex items-center gap-1 font-mono font-bold text-[11px] ${
                              isHighDemand ? 'text-amber-400' : 'text-cyan-400'
                            }`}>
                              {isHighDemand && <Flame size={12} />}
                              {ipo.demandMultiplier} Kat
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 italic">Açıklanmadı</span>
                          )}
                        </div>
                      </div>

                      {/* Performance & Alpha Summary (If completed) */}
                      {ipo.status === 'completed' && ipo.performance && (
                        <div className="space-y-1.5 mb-3 font-mono">
                          <div className="flex items-center justify-between p-2.5 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-xs">
                            <span className="text-[10px] text-emerald-300 font-semibold flex items-center gap-1">
                              <TrendingUp size={12} />
                              1. Gün / Güncel Getiri
                            </span>
                            <span className="font-bold text-emerald-400">
                              {ipo.performance.day1ReturnPct != null ? `%+${ipo.performance.day1ReturnPct}` : '—'}
                              {' / '}
                              <span className={ipo.performance.currentReturnPct && ipo.performance.currentReturnPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                                {ipo.performance.currentReturnPct != null ? `${ipo.performance.currentReturnPct > 0 ? '+' : ''}${ipo.performance.currentReturnPct}%` : '—'}
                              </span>
                            </span>
                          </div>

                          {ipo.relative_performance?.relative_alpha_day1_pct != null && (
                            <div className="flex items-center justify-between px-2.5 py-1.5 bg-cyan-950/20 border border-cyan-500/20 rounded-lg text-[11px]">
                              <span className="text-[10px] text-cyan-300 font-medium">BIST100'e Göre 1. Gün Alfa:</span>
                              <span className="font-bold text-cyan-400">
                                {ipo.relative_performance.relative_alpha_day1_pct > 0 ? '+' : ''}%{ipo.relative_performance.relative_alpha_day1_pct.toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Deep Analysis Quick Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        {ipo.financial_health?.valuation_label && (
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            ipo.financial_health.valuation_label === 'ucuz'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : ipo.financial_health.valuation_label === 'makul'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            Değerleme: {ipo.financial_health.valuation_label === 'ucuz' ? 'Ucuz' : ipo.financial_health.valuation_label === 'makul' ? 'Makul' : 'Pahalı'}
                          </span>
                        )}

                        {ipo.structural_risk?.market_segment && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-semibold">
                            {ipo.structural_risk.market_segment}
                          </span>
                        )}

                        {ipo.qualitative?.sharia_compliant && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-950/50 text-emerald-400 border border-emerald-600/30 text-[10px] font-semibold flex items-center gap-1">
                            <ShieldCheck size={10} />
                            Katılım Uyumlu
                          </span>
                        )}

                        {ipo.financial_health?.implied_pe != null && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-mono">
                            Zımni F/K: {ipo.financial_health.implied_pe}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                      <a
                        href={ipo.prospectusUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 text-xs transition-colors flex items-center justify-center cursor-pointer"
                        title="Resmi KAP İzahnamesini Aç"
                      >
                        <ExternalLink size={14} />
                      </a>

                      <button
                        type="button"
                        onClick={() => handleSelectIpo(ipo)}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Derin Analiz & Kıyaslama</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Deep IPO Detail Modal / Drawer (Module 2 & 3 Integration) */}
      {selectedIpo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="max-w-3xl w-full bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center font-mono font-black text-cyan-400 text-sm">
                  {selectedIpo.ticker}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{selectedIpo.companyName}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      {selectedIpo.sector}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">KAP Onaylı İzahname & Geçmiş Akran Karşılaştırması</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedIpo(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-1.5 px-6 pt-3 bg-slate-950 border-b border-slate-800 overflow-x-auto">
              <button
                type="button"
                onClick={() => setModalTab('overview')}
                className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  modalTab === 'overview'
                    ? 'border-cyan-400 text-cyan-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <PieIcon size={14} />
                Genel & Fon Dağılımı
              </button>

              <button
                type="button"
                onClick={() => setModalTab('financials')}
                className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  modalTab === 'financials'
                    ? 'border-cyan-400 text-cyan-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <BarChart3 size={14} />
                Finansal Röntgen & Çarpanlar
              </button>

              <button
                type="button"
                onClick={() => setModalTab('structural')}
                className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  modalTab === 'structural'
                    ? 'border-cyan-400 text-cyan-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Lock size={14} />
                Yapısal Risk & Taahhütler
              </button>

              <button
                type="button"
                onClick={() => setModalTab('alpha')}
                className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  modalTab === 'alpha'
                    ? 'border-cyan-400 text-cyan-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <TrendingUp size={14} />
                BIST Rölatif Alfa & Zirve/Dip
              </button>

              <button
                type="button"
                onClick={() => setModalTab('demand_qualitative')}
                className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  modalTab === 'demand_qualitative'
                    ? 'border-cyan-400 text-cyan-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck size={14} />
                Talep & Katılım Finansı
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[72vh] overflow-y-auto">
              {/* TAB 1: OVERVIEW */}
              {modalTab === 'overview' && (
                <>
                  {/* Key Highlights Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl">
                      <div className="text-[10px] text-slate-500 font-semibold mb-0.5">Halka Arz Fiyatı</div>
                      <div className="text-base font-black text-white font-mono">₺{selectedIpo.offerPrice.toFixed(2)}</div>
                    </div>

                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl">
                      <div className="text-[10px] text-slate-500 font-semibold mb-0.5">Karşılama Oranı</div>
                      <div className="text-base font-black text-amber-400 font-mono">
                        {selectedIpo.demandMultiplier ? `${selectedIpo.demandMultiplier} Kat` : 'Bekleniyor'}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl">
                      <div className="text-[10px] text-slate-500 font-semibold mb-0.5">Halka Arz Büyüklüğü</div>
                      <div className="text-base font-black text-cyan-400 font-mono">
                        {selectedIpo.marketCapTRY ? `₺${(selectedIpo.marketCapTRY / 1000000).toFixed(0)} Milyon` : '—'}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl">
                      <div className="text-[10px] text-slate-500 font-semibold mb-0.5">Konsorsiyum Lideri</div>
                      <div className="text-xs font-bold text-slate-200 truncate" title={selectedIpo.leadBroker || ''}>
                        {selectedIpo.leadBroker || 'Açıklanmadı'}
                      </div>
                    </div>
                  </div>

                  {/* Extended Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950/60 border border-slate-800 rounded-2xl text-xs">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 block">Dağıtım Yöntemi</span>
                      <span className="font-bold text-slate-200 text-xs">{selectedIpo.methodLabel}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 block">Bireysel Tahsisat</span>
                      <span className="font-mono font-bold text-emerald-400 text-xs">
                        {selectedIpo.allocationIndividualRatio != null ? `%${selectedIpo.allocationIndividualRatio}` : 'Belirtilmedi'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 block">Yurt İçi Kurumsal</span>
                      <span className="font-mono font-bold text-blue-400 text-xs">
                        {selectedIpo.allocationInstitutionalRatio != null ? `%${selectedIpo.allocationInstitutionalRatio}` : 'Belirtilmedi'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 block">Yurt Dışı Kurumsal Payı</span>
                      <span className="font-mono font-bold text-purple-400 text-xs">
                        {selectedIpo.allocationForeignInstitutionalPct != null ? `%${selectedIpo.allocationForeignInstitutionalPct}` : '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 block">Sermaye Artırımı / Ortak Satışı</span>
                      <span className="font-mono font-bold text-slate-200 text-xs">
                        {selectedIpo.capitalIncreaseRatioPct != null ? `%${selectedIpo.capitalIncreaseRatioPct} Ser. Art.` : '—'}
                        {selectedIpo.shareholderSaleRatioPct != null ? ` / %${selectedIpo.shareholderSaleRatioPct} Ortak` : ''}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 block">T1-T2 Bakiye Kullanımı</span>
                      <span className={`font-bold text-xs ${
                        selectedIpo.t1t2BalanceUsable === true
                          ? 'text-emerald-400'
                          : selectedIpo.t1t2BalanceUsable === false
                          ? 'text-rose-400'
                          : 'text-slate-400'
                      }`}>
                        {selectedIpo.t1t2BalanceUsable === true ? '✅ Kullanılabilir' : selectedIpo.t1t2BalanceUsable === false ? '❌ Kullanılamaz (Nakit Kalmalı)' : 'Belirtilmedi'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 block">Kişi Başı Düşen Lot</span>
                      <span className="font-mono font-bold text-amber-400 text-xs">
                        {selectedIpo.estimatedLotPerPerson != null ? `${selectedIpo.estimatedLotPerPerson} Lot` : '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 block">Başvuran Yatırımcı Sayısı</span>
                      <span className="font-mono font-bold text-cyan-400 text-xs">
                        {selectedIpo.totalApplicantCount != null ? `${selectedIpo.totalApplicantCount.toLocaleString('tr-TR')} Kişi` : '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 block">Toplam Dağıtılan Lot</span>
                      <span className="font-mono font-bold text-slate-200 text-xs">
                        {selectedIpo.totalLot ? `${selectedIpo.totalLot.toLocaleString('tr-TR')} Lot` : 'Açıklanmadı'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 block">Talep Toplama Tarihleri</span>
                      <span className="font-mono text-slate-300 text-xs">
                        {selectedIpo.bookBuildingStartDate} / {selectedIpo.bookBuildingEndDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 block">Borsada İşlem Tarihi</span>
                      <span className="font-mono text-cyan-300 text-xs">
                        {selectedIpo.marketListingDate || 'Henüz İşlem Görmedi'}
                      </span>
                    </div>
                    {selectedIpo.performance && selectedIpo.performance.ceilingDaysCount != null && (
                      <div>
                        <span className="text-[10px] font-semibold text-slate-500 block">Tavan Serisi</span>
                        <span className="font-mono font-bold text-amber-400 text-xs">
                          {selectedIpo.performance.ceilingDaysCount} Gün Tavan
                        </span>
                      </div>
                    )}
                    {selectedIpo.performance && selectedIpo.performance.currentPrice != null && (
                      <div>
                        <span className="text-[10px] font-semibold text-slate-500 block">Son BIST Fiyatı</span>
                        <span className="font-mono font-bold text-emerald-400 text-xs">
                          ₺{selectedIpo.performance.currentPrice.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Fonun Kullanım Yerleri */}
                  {selectedIpo.useOfProceeds && selectedIpo.useOfProceeds.length > 0 && (
                    <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <PieIcon size={14} className="text-cyan-400" />
                        Halka Arz Gelirinin Kullanım Alanları (İzahname Özeti)
                      </h4>
                      <div className="space-y-2">
                        {selectedIpo.useOfProceeds.map((item, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-300 font-medium">{item.purpose}</span>
                              <span className="text-cyan-400 font-mono font-bold">%{item.ratioPct}</span>
                            </div>
                            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                                style={{ width: `${item.ratioPct}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Benzer Akran Kıyaslaması */}
                  <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <TrendingUp size={14} className="text-emerald-400" />
                        Benzer Geçmiş Halka Arzlar Nasıl Performans Gösterdi?
                      </h4>
                      <span className="text-[10px] text-slate-400">Aynı sektör ve dağıtım modeli</span>
                    </div>

                    {isLoadingDetail ? (
                      <div className="py-6 text-center text-xs text-slate-500">Kıyaslama verisi yükleniyor...</div>
                    ) : similarIpos.length === 0 ? (
                      <div className="py-4 text-center text-xs text-slate-500">Kıyaslanacak tamamlanmış halka arz bulunamadı.</div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {similarIpos.map(sim => (
                          <div key={sim.id} className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-white text-xs">{sim.ticker}</span>
                              <span className="text-[10px] text-slate-400">{sim.sector}</span>
                            </div>
                            <div className="text-[11px] text-slate-300 truncate">{sim.companyName}</div>
                            <div className="grid grid-cols-3 gap-1 pt-1 text-[10px] font-mono border-t border-slate-800">
                              <div>
                                <span className="text-slate-500 block">1. Gün</span>
                                <span className="text-emerald-400 font-bold">
                                  {sim.performance?.day1ReturnPct != null ? `%+${sim.performance.day1ReturnPct}` : '—'}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-500 block">1. Hafta</span>
                                <span className="text-emerald-400">
                                  {sim.performance?.week1ReturnPct != null ? `%+${sim.performance.week1ReturnPct}` : '—'}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-500 block">Talep Katı</span>
                                <span className="text-amber-400 font-bold">
                                  {sim.demandMultiplier ? `${sim.demandMultiplier}x` : '—'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* TAB 2: FINANCIAL HEALTH & MULTIPLES */}
              {modalTab === 'financials' && (
                <LockedField mode="blur" isLocked={!!(selectedIpo as any)._isMasked} moduleName="ipo_financials" onUpgradeClick={() => onOpenUpgradeModal('ipo_tracker')} ctaText="Halka Arz Finansal Analizleri Görmek İçin Pro'ya Geçin">
                <div className="space-y-6">
                  {/* Valuation Label Card */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">İzahname Değerleme Değerlendirmesi</span>
                      <h4 className="text-sm font-bold text-white mt-0.5">Sektör Çarpanlarına Göre Göreceli Fiyat</h4>
                    </div>
                    {selectedIpo.financial_health?.valuation_label ? (
                      <span className={`px-4 py-1.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider ${
                        selectedIpo.financial_health.valuation_label === 'ucuz'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : selectedIpo.financial_health.valuation_label === 'makul'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {selectedIpo.financial_health.valuation_label === 'ucuz' ? '🎯 UCUZ (İskontolu)' : selectedIpo.financial_health.valuation_label === 'makul' ? '⚖️ MAKUL (Piyasa Dengeli)' : '⚠️ PAHALI (Primli)'}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500 italic">Veri Bekleniyor</span>
                    )}
                  </div>

                  {/* Multiples Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                      <div className="text-[10px] text-slate-500 font-semibold mb-0.5">Zımni F/K (P/E)</div>
                      <div className="text-base font-black text-white font-mono">
                        {selectedIpo.financial_health?.implied_pe != null ? selectedIpo.financial_health.implied_pe : '—'}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Sektör Ort: <span className="font-mono text-cyan-400">{selectedIpo.financial_health?.sector_avg_pe ?? '—'}</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                      <div className="text-[10px] text-slate-500 font-semibold mb-0.5">Zımni PD/DD (P/B)</div>
                      <div className="text-base font-black text-white font-mono">
                        {selectedIpo.financial_health?.implied_pb != null ? selectedIpo.financial_health.implied_pb : '—'}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">Piyasa / Defter Değeri</div>
                    </div>

                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                      <div className="text-[10px] text-slate-500 font-semibold mb-0.5">FD / FAVÖK (EV/EBITDA)</div>
                      <div className="text-base font-black text-white font-mono">
                        {selectedIpo.financial_health?.implied_ev_ebitda != null ? selectedIpo.financial_health.implied_ev_ebitda : '—'}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Sektör Ort: <span className="font-mono text-cyan-400">{selectedIpo.financial_health?.sector_avg_ev_ebitda ?? '—'}</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                      <div className="text-[10px] text-slate-500 font-semibold mb-0.5">Borç / Özsermaye (D/E)</div>
                      <div className="text-base font-black text-white font-mono">
                        {selectedIpo.financial_health?.debt_to_equity != null ? selectedIpo.financial_health.debt_to_equity : '—'}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {selectedIpo.financial_health?.debt_to_equity != null && selectedIpo.financial_health.debt_to_equity < 1.0 ? 'Sağlıklı Borçluluk' : 'Yüksek Borçluluk'}
                      </div>
                    </div>
                  </div>

                  {/* 3-Year Historical Financials Table */}
                  <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <BarChart3 size={14} className="text-cyan-400" />
                      Son 3 Yıllık Finansal Büyüme Trendi (Hasılat / Net Kâr / FAVÖK)
                    </h4>

                    {selectedIpo.financial_health?.revenue_3y && selectedIpo.financial_health.revenue_3y.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono">
                          <thead>
                            <tr className="text-[10px] text-slate-500 border-b border-slate-800 uppercase">
                              <th className="pb-2">Yıl</th>
                              <th className="pb-2">Hasılat (TRY)</th>
                              <th className="pb-2">Net Kâr (TRY)</th>
                              <th className="pb-2">FAVÖK (TRY)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60">
                            {selectedIpo.financial_health.revenue_3y.map((rev, idx) => {
                              const net = selectedIpo.financial_health?.net_income_3y?.[idx];
                              const ebitda = selectedIpo.financial_health?.ebitda_3y?.[idx];
                              return (
                                <tr key={idx} className="hover:bg-slate-900/50">
                                  <td className="py-2.5 font-bold text-slate-300">{rev.year ?? '—'}</td>
                                  <td className="py-2.5 text-cyan-400">
                                    {rev.value_try != null ? `₺${(rev.value_try / 1000000).toLocaleString('tr-TR', { maximumFractionDigits: 1 })}M` : '—'}
                                  </td>
                                  <td className="py-2.5 text-emerald-400">
                                    {net?.value_try != null ? `₺${(net.value_try / 1000000).toLocaleString('tr-TR', { maximumFractionDigits: 1 })}M` : '—'}
                                  </td>
                                  <td className="py-2.5 text-blue-400">
                                    {ebitda?.value_try != null ? `₺${(ebitda.value_try / 1000000).toLocaleString('tr-TR', { maximumFractionDigits: 1 })}M` : '—'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="py-4 text-center text-xs text-slate-500">3 yıllık finansal tablo detayı izahnameden henüz çekilmedi.</div>
                    )}

                    {selectedIpo.financial_health?._source && (
                      <div className="text-[10px] text-slate-500 italic pt-2 border-t border-slate-800/60">
                        Kaynak: {selectedIpo.financial_health._source}
                      </div>
                    )}
                  </div>
                </div>
                </LockedField>
              )}

              {/* TAB 3: STRUCTURAL RISK & LOCKUP */}
              {modalTab === 'structural' && (
                <LockedField mode="blur" isLocked={!!(selectedIpo as any)._isMasked} moduleName="ipo_structural" onUpgradeClick={() => onOpenUpgradeModal('ipo_tracker')} ctaText="Halka Arz Taahhüt Detaylarını Görmek İçin Pro'ya Geçin">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Yüklenim Türü</span>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <ShieldCheck size={16} className="text-cyan-400 shrink-0" />
                        <span>{selectedIpo.structural_risk?.underwriting_type || 'Bakiye / En İyi Gayret Yüklenimi'}</span>
                      </div>
                      <p className="text-xs text-slate-400">Aracı kurumların satılmayan payları satın alma taahhüdü durumu.</p>
                    </div>

                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Pazar Segmenti</span>
                      <div className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                        <Building2 size={16} className="text-emerald-400 shrink-0" />
                        <span>{selectedIpo.structural_risk?.market_segment || 'Yıldız Pazar / Ana Pazar'}</span>
                      </div>
                      <p className="text-xs text-slate-400">BIST kotasyon kriterlerine göre işlem göreceği pazar grubu.</p>
                    </div>

                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Satmama Taahhüdü (Lockup)</span>
                      <div className="text-sm font-bold text-amber-400 flex items-center gap-2">
                        <Lock size={16} className="text-amber-400 shrink-0" />
                        <span>{selectedIpo.structural_risk?.lockup_period_days ? `${selectedIpo.structural_risk.lockup_period_days} Gün` : '180-365 Gün Taahhüt'}</span>
                      </div>
                      <div className="text-xs text-slate-400">
                        Kilit Bitiş Tarihi: <span className="font-mono text-slate-200">{selectedIpo.structural_risk?.lockup_expiry_date || 'Açıklanacak'}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Fiyat İstikrarı (Greenshoe)</span>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        {selectedIpo.structural_risk?.greenshoe_option ? (
                          <>
                            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                            <span className="text-emerald-400">Planlanıyor {selectedIpo.structural_risk.greenshoe_percent ? `(%${selectedIpo.structural_risk.greenshoe_percent})` : ''}</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle size={16} className="text-slate-500 shrink-0" />
                            <span className="text-slate-400">Fiyat İstikrarı Planlanmıyor</span>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">İşlem başladıktan sonraki ilk 15-30 gün aracı kurum destek alımları.</p>
                    </div>
                  </div>

                  {selectedIpo.structural_risk?._source && (
                    <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-[11px] text-slate-400">
                      Kaynak: <span className="italic">{selectedIpo.structural_risk._source}</span>
                    </div>
                  )}
                </div>
                </LockedField>
              )}

              {/* TAB 4: BIST RELATIVE ALPHA & PERFORMANCE */}
              {modalTab === 'alpha' && (
                <LockedField mode="blur" isLocked={!!(selectedIpo as any)._isMasked} moduleName="ipo_alpha" onUpgradeClick={() => onOpenUpgradeModal('ipo_tracker')} ctaText="Endekse Göre Performans Analizini Görmek İçin Pro'ya Geçin">
                <div className="space-y-6">
                  {/* Alpha Highlight Box */}
                  <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">BIST100 Karşılaştırmalı Alfa Analizi</span>
                        <h4 className="text-sm font-bold text-white mt-0.5">İlk Gün BIST Endeksine Göre Üretilen Ek Getiri</h4>
                      </div>
                      {selectedIpo.relative_performance?.relative_alpha_day1_pct != null && (
                        <span className="text-xl font-black font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-xl">
                          {selectedIpo.relative_performance.relative_alpha_day1_pct > 0 ? '+' : ''}%{selectedIpo.relative_performance.relative_alpha_day1_pct.toFixed(2)} Alfa
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                        <span className="text-[10px] text-slate-500 block">Hisse 1. Gün Getirisi</span>
                        <span className="text-sm font-bold text-emerald-400 font-mono">
                          {selectedIpo.relative_performance?.day1_return_pct != null ? `%+${selectedIpo.relative_performance.day1_return_pct}` : (selectedIpo.performance?.day1ReturnPct != null ? `%+${selectedIpo.performance.day1ReturnPct}` : '—')}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                        <span className="text-[10px] text-slate-500 block">BIST100 Aynı Gün Getirisi</span>
                        <span className="text-sm font-bold text-slate-200 font-mono">
                          {selectedIpo.relative_performance?.bist100_return_same_day_pct != null ? `${selectedIpo.relative_performance.bist100_return_same_day_pct > 0 ? '+' : ''}%${selectedIpo.relative_performance.bist100_return_same_day_pct}` : '—'}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                        <span className="text-[10px] text-slate-500 block">Halka Arz Anı BIST Endeksi</span>
                        <span className="text-sm font-bold text-cyan-300 font-mono">
                          {selectedIpo.relative_performance?.bist100_level_at_ipo ? selectedIpo.relative_performance.bist100_level_at_ipo.toLocaleString('tr-TR') : '—'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Post Listing ATH & ATL Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Tarihi Zirve (ATH) & Zirveye Mesafe</span>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-black text-white font-mono">
                          {selectedIpo.relative_performance?.post_listing_ath ? `₺${selectedIpo.relative_performance.post_listing_ath.toFixed(2)}` : '—'}
                        </span>
                        <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-lg">
                          {selectedIpo.relative_performance?.distance_from_ath_pct != null ? `${selectedIpo.relative_performance.distance_from_ath_pct}%` : '—'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">İşlem görmeye başladığından bu yana gördüğü en yüksek seviyeden iskonto.</p>
                    </div>

                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Tarihi Dip (ATL) & Dipten Uzaklık</span>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-black text-white font-mono">
                          {selectedIpo.relative_performance?.post_listing_atl ? `₺${selectedIpo.relative_performance.post_listing_atl.toFixed(2)}` : '—'}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
                          {selectedIpo.relative_performance?.distance_from_atl_pct != null ? `+${selectedIpo.relative_performance.distance_from_atl_pct}%` : '—'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">İşlem görmeye başladığından bu yana gördüğü en dip seviyeden primlenme.</p>
                    </div>
                  </div>
                </div>
                </LockedField>
              )}

              {/* TAB 5: DEMAND BREAKDOWN & QUALITATIVE */}
              {modalTab === 'demand_qualitative' && (
                <div className="space-y-6">
                  {/* Demand Breakdown by Category */}
                  <LockedField mode="blur" isLocked={!!(selectedIpo as any)._isMasked} moduleName="ipo_demand" onUpgradeClick={() => onOpenUpgradeModal('ipo_tracker')} ctaText="Talep Bilgilerini Görmek İçin Pro'ya Geçin">
                  <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Flame size={14} className="text-amber-400" />
                      Yatırımcı Grubu Bazında Talep Karşılama Oranları
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                        <span className="text-[10px] text-slate-500 block">Yurt İçi Bireysel</span>
                        <span className="text-base font-black text-emerald-400 font-mono">
                          {selectedIpo.demand_breakdown?.domestic_retail_coverage_ratio != null ? `${selectedIpo.demand_breakdown.domestic_retail_coverage_ratio}x` : '—'}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                        <span className="text-[10px] text-slate-500 block">Yurt İçi Kurumsal</span>
                        <span className="text-base font-black text-blue-400 font-mono">
                          {selectedIpo.demand_breakdown?.domestic_institutional_coverage_ratio != null ? `${selectedIpo.demand_breakdown.domestic_institutional_coverage_ratio}x` : '—'}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                        <span className="text-[10px] text-slate-500 block">Yurt Dışı Kurumsal</span>
                        <span className="text-base font-black text-purple-400 font-mono">
                          {selectedIpo.demand_breakdown?.foreign_institutional_coverage_ratio != null ? `${selectedIpo.demand_breakdown.foreign_institutional_coverage_ratio}x` : '—'}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                        <span className="text-[10px] text-slate-500 block">Toplam Katlama</span>
                        <span className="text-base font-black text-amber-400 font-mono">
                          {selectedIpo.demand_breakdown?.total_coverage_ratio != null ? `${selectedIpo.demand_breakdown.total_coverage_ratio}x` : (selectedIpo.demandMultiplier ? `${selectedIpo.demandMultiplier}x` : '—')}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Başvuran Yatırımcı Sayısı</span>
                        <div className="text-base font-black text-white font-mono">
                          {selectedIpo.totalApplicantCount != null ? selectedIpo.totalApplicantCount.toLocaleString('tr-TR') : 'Açıklanmadı'}
                        </div>
                      </div>
                      <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Kişi Başı Düşen Lot (Tahmini/Kesin)</span>
                        <div className="text-base font-black text-emerald-400 font-mono">
                          {selectedIpo.estimatedLotPerPerson != null ? `~ ${selectedIpo.estimatedLotPerPerson} Lot` : 'Açıklanmadı'}
                        </div>
                      </div>
                    </div>
                  </div>
                  </LockedField>

                  {/* Qualitative & Sharia Compliance */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Katılım Finansı & Şeriat Uygunluğu</span>
                      <div className="flex items-center gap-2">
                        {selectedIpo.qualitative?.sharia_compliant ? (
                          <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5">
                            <ShieldCheck size={14} />
                            Katılım Endeksi Standartlarına UYGUN
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-400 text-xs font-medium">
                            Katılım Endeksi Uygunluk Bilgisi Bulunmuyor
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">Faizsiz finans ve BIST Katılım Endeksi kuralları çerçevesinde izahname incelemesi.</p>
                    </div>

                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Halka Açıklık Oranı</span>
                      <div className="text-base font-black text-white font-mono">
                        {selectedIpo.qualitative?.free_float_pct != null ? `%${selectedIpo.qualitative.free_float_pct.toFixed(2)}` : '—'}
                      </div>
                      <p className="text-[11px] text-slate-400">Sermaye piyasalarında işlem görecek serbest dolaşımdaki pay oranı.</p>
                    </div>
                  </div>

                  {/* Dividend Policy Statement */}
                  {selectedIpo.qualitative?.dividend_policy && (
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                      <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider block">Temettü / Kâr Payı Dağıtım Politikası</span>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        "{selectedIpo.qualitative.dividend_policy}"
                      </p>
                    </div>
                  )}

                  {selectedIpo.qualitative?._source && (
                    <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-[11px] text-slate-400">
                      Kaynak: <span className="italic">{selectedIpo.qualitative._source}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Official Source & Verification Notice Footer */}
              <div className="flex items-center justify-between p-3.5 bg-cyan-950/20 border border-cyan-500/20 rounded-xl text-xs text-cyan-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-cyan-400 shrink-0" />
                  <span>Resmi KAP / SPK bülteni referanslı izahname verisidir.</span>
                </div>
                <a
                  href={selectedIpo.prospectusUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors"
                >
                  <ExternalLink size={12} />
                  KAP İzahnamesini Aç
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
