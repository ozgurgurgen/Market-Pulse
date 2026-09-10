import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  Search, 
  RefreshCw, 
  BarChart3, 
  LayoutGrid, 
  PieChart, 
  Filter, 
  Info,
  Maximize2,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { safeFetchJson } from '../utils/apiClient';

export interface HeatmapStock {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change24hPercent: number;
  marketCap: number;
  volume24h: number;
  peRatio?: number;
  pbRatio?: number;
}

export interface HeatmapSector {
  sectorName: string;
  stockCount: number;
  totalMarketCap: number;
  totalVolume24h: number;
  weightedChange24hPercent: number;
  stocks: HeatmapStock[];
}

export interface HeatmapData {
  totalMarketCap: number;
  totalVolume24h: number;
  advancingCount: number;
  decliningCount: number;
  unchangedCount: number;
  topPerformingSector: { sectorName: string; change24hPercent: number };
  worstPerformingSector: { sectorName: string; change24hPercent: number };
  sectors: HeatmapSector[];
  generatedAt: string;
}

interface SectorsHeatmapSectionProps {
  onSelectStock?: (symbol: string) => void;
}

type ViewMode = 'TREEMAP' | 'GRID' | 'SECTOR_LIST';
type FilterDirection = 'ALL' | 'GAINERS' | 'LOSERS';

export const SectorsHeatmapSection: React.FC<SectorsHeatmapSectionProps> = ({ onSelectStock }) => {
  const [data, setData] = useState<HeatmapData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<ViewMode>('TREEMAP');
  const [filterDirection, setFilterDirection] = useState<FilterDirection>('ALL');
  const [hoveredStock, setHoveredStock] = useState<HeatmapStock | null>(null);

  const fetchHeatmapData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await safeFetchJson<{ success: boolean; data: HeatmapData }>('/api/v1/sectors/stocks-heatmap');
      if (res.ok && res.data?.data?.sectors) {
        setData(res.data.data);
      } else {
        // Fallback endpoint
        const fbRes = await safeFetchJson<{ success: boolean; data: HeatmapData }>('/api/sector/stocks-heatmap');
        if (fbRes.ok && fbRes.data?.data?.sectors) {
          setData(fbRes.data.data);
        } else {
          setError('Sektörel ısı haritası verisi yüklenemedi.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Veri bağlantı hatası oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeatmapData();
  }, []);

  // Format Helpers
  const formatTRY = (num: number) => {
    if (!num || isNaN(num)) return '0 ₺';
    if (num >= 1_000_000_000_000) return `${(num / 1_000_000_000_000).toFixed(2)} Trilyon ₺`;
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)} Milyar ₺`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)} Milyon ₺`;
    return `${num.toLocaleString('tr-TR')} ₺`;
  };

  const getChangeBgColor = (change: number) => {
    if (change >= 5) return 'bg-emerald-600 hover:bg-emerald-500 text-white';
    if (change >= 2.5) return 'bg-emerald-700/90 hover:bg-emerald-600 text-emerald-50';
    if (change > 0.5) return 'bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100';
    if (change > 0) return 'bg-emerald-950/70 hover:bg-emerald-900 text-emerald-200 border border-emerald-800/40';
    if (change === 0) return 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/50';
    if (change > -0.5) return 'bg-rose-950/70 hover:bg-rose-900 text-rose-200 border border-rose-800/40';
    if (change > -2.5) return 'bg-rose-900/80 hover:bg-rose-800 text-rose-100';
    if (change > -5) return 'bg-rose-700/90 hover:bg-rose-600 text-rose-50';
    return 'bg-rose-600 hover:bg-rose-500 text-white';
  };

  // Filtered Sectors
  const filteredSectors = useMemo(() => {
    if (!data?.sectors) return [];
    
    return data.sectors
      .map(sec => {
        // Sector filter
        if (selectedSector !== 'ALL' && sec.sectorName !== selectedSector) {
          return null;
        }

        // Filter stocks
        const matchingStocks = sec.stocks.filter(st => {
          const matchQuery = !searchQuery || 
            st.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
            st.name.toLowerCase().includes(searchQuery.toLowerCase());
          
          const matchDirection = 
            filterDirection === 'ALL' ? true :
            filterDirection === 'GAINERS' ? st.change24hPercent > 0 :
            st.change24hPercent < 0;

          return matchQuery && matchDirection;
        });

        if (matchingStocks.length === 0) return null;

        return {
          ...sec,
          stocks: matchingStocks
        };
      })
      .filter((s): s is HeatmapSector => s !== null);
  }, [data, selectedSector, searchQuery, filterDirection]);

  // Sector list for filter pill buttons
  const availableSectors = useMemo(() => {
    if (!data?.sectors) return [];
    return data.sectors.map(s => s.sectorName);
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 rounded-xl border border-indigo-500/30 text-emerald-400">
                <LayoutGrid size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
                  BIST Sektörel Isı Haritası
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                    CANLI PİYASA
                  </span>
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Borsa İstanbul hisselerinin piyasa değeri büyüklükleri ve 24 saatlik fiyat değişimleri
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchHeatmapData}
              disabled={loading}
              className="px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 rounded-xl text-sm font-medium border border-slate-700/60 transition-all flex items-center gap-2"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin text-indigo-400' : ''} />
              Yenile
            </button>
            <div className="bg-slate-950/60 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
              <button
                onClick={() => setViewMode('TREEMAP')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  viewMode === 'TREEMAP' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <PieChart size={13} />
                Treemap
              </button>
              <button
                onClick={() => setViewMode('GRID')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  viewMode === 'GRID' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutGrid size={13} />
                Kutu Matrisi
              </button>
              <button
                onClick={() => setViewMode('SECTOR_LIST')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  viewMode === 'SECTOR_LIST' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers size={13} />
                Sektör Listesi
              </button>
            </div>
          </div>
        </div>

        {/* Global Market Overview Badges */}
        {data && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-slate-800/70">
            <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800/60">
              <span className="text-xs text-slate-400 block">Toplam Piyasa Değeri</span>
              <span className="text-sm font-bold text-slate-100 mt-0.5 block">
                {formatTRY(data.totalMarketCap)}
              </span>
            </div>
            <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800/60">
              <span className="text-xs text-slate-400 block">24s Toplam Hacim</span>
              <span className="text-sm font-bold text-slate-100 mt-0.5 block">
                {formatTRY(data.totalVolume24h)}
              </span>
            </div>
            <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800/60">
              <span className="text-xs text-slate-400 block">Yükselen / Düşen</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs font-bold text-emerald-400 flex items-center">
                  <ArrowUpRight size={13} /> {data.advancingCount}
                </span>
                <span className="text-xs text-slate-500">/</span>
                <span className="text-xs font-bold text-rose-400 flex items-center">
                  <ArrowDownRight size={13} /> {data.decliningCount}
                </span>
                <span className="text-xs text-slate-500">({data.unchangedCount} nötr)</span>
              </div>
            </div>
            <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800/60">
              <span className="text-xs text-slate-400 block">Lider Sektör</span>
              <span className="text-xs font-bold text-emerald-400 mt-0.5 block truncate">
                {data.topPerformingSector.sectorName} (+%{data.topPerformingSector.change24hPercent})
              </span>
            </div>
            <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800/60">
              <span className="text-xs text-slate-400 block">En Çok Gerileyen</span>
              <span className="text-xs font-bold text-rose-400 mt-0.5 block truncate">
                {data.worstPerformingSector.sectorName} (%{data.worstPerformingSector.change24hPercent})
              </span>
            </div>
            <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800/60">
              <span className="text-xs text-slate-400 block">Renk Skalası</span>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-3 h-3 rounded bg-rose-600" title="-3% ve altı" />
                <div className="w-3 h-3 rounded bg-rose-900" title="-1%" />
                <div className="w-3 h-3 rounded bg-slate-700" title="0%" />
                <div className="w-3 h-3 rounded bg-emerald-900" title="+1%" />
                <div className="w-3 h-3 rounded bg-emerald-600" title="+3% ve üzeri" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Hisse kodu veya şirket adı ara (Örn: THYAO, ASELS, Tüpraş)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setFilterDirection('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterDirection === 'ALL' ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setFilterDirection('GAINERS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                filterDirection === 'GAINERS' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50' : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              <ArrowUpRight size={13} />
              Yükselenler
            </button>
            <button
              onClick={() => setFilterDirection('LOSERS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                filterDirection === 'LOSERS' ? 'bg-rose-950/80 text-rose-300 border border-rose-800/50' : 'text-slate-400 hover:text-rose-300'
              }`}
            >
              <ArrowDownRight size={13} />
              Düşenler
            </button>
          </div>
        </div>

        {/* Sector Quick Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setSelectedSector('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedSector === 'ALL'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800/60'
            }`}
          >
            Tüm Sektörler
          </button>
          {availableSectors.map((secName) => (
            <button
              key={secName}
              onClick={() => setSelectedSector(secName)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedSector === secName
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800/60'
              }`}
            >
              {secName}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-16 flex flex-col items-center justify-center text-center">
          <RefreshCw size={32} className="text-indigo-400 animate-spin mb-3" />
          <p className="text-slate-300 font-medium">BIST Sektörel Isı Haritası Hesaplanıyor...</p>
          <p className="text-xs text-slate-500 mt-1">Canlı fiyat kotasyonları ve piyasa değerleri birleştiriliyor</p>
        </div>
      ) : error ? (
        <div className="bg-rose-950/30 border border-rose-800/40 rounded-2xl p-8 text-center text-rose-300">
          <Info size={32} className="mx-auto text-rose-400 mb-2" />
          <p className="font-semibold">{error}</p>
          <button
            onClick={fetchHeatmapData}
            className="mt-4 px-4 py-2 bg-rose-900/60 hover:bg-rose-800/80 text-rose-200 rounded-xl text-sm font-medium transition-all"
          >
            Tekrar Dene
          </button>
        </div>
      ) : filteredSectors.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-400">
          <Search size={32} className="mx-auto text-slate-500 mb-2" />
          <p className="font-medium">Arama kriterlerine uygun hisse veya sektör bulunamadı.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedSector('ALL'); setFilterDirection('ALL'); }}
            className="mt-3 px-4 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-700"
          >
            Filtreleri Temizle
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* View Mode: Treemap Style (Sector Clusters) */}
          {viewMode === 'TREEMAP' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredSectors.map((sector) => (
                <div
                  key={sector.sectorName}
                  className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between shadow-lg hover:border-slate-700/80 transition-all"
                >
                  {/* Sector Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/60">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                      <h3 className="text-sm font-bold text-slate-200 tracking-wide">
                        {sector.sectorName}
                      </h3>
                      <span className="text-xs text-slate-500 font-mono">({sector.stocks.length})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        sector.weightedChange24hPercent >= 0 
                          ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/40' 
                          : 'text-rose-400 bg-rose-950/60 border border-rose-800/40'
                      }`}>
                        {sector.weightedChange24hPercent >= 0 ? '+' : ''}%{sector.weightedChange24hPercent}
                      </span>
                    </div>
                  </div>

                  {/* Stock Treemap Cells */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 min-h-[160px]">
                    {sector.stocks.map((stock, idx) => {
                      // Calculate relative weight for box span
                      const isHeavyweight = idx === 0 && stock.marketCap > 100_000_000_000;
                      const isMediumWeight = idx < 3 && stock.marketCap > 40_000_000_000;

                      return (
                        <div
                          key={stock.symbol}
                          onClick={() => onSelectStock && onSelectStock(stock.symbol)}
                          onMouseEnter={() => setHoveredStock(stock)}
                          onMouseLeave={() => setHoveredStock(null)}
                          className={`cursor-pointer rounded-xl p-2.5 flex flex-col justify-between transition-all transform hover:scale-[1.03] active:scale-[0.98] shadow-md select-none ${
                            getChangeBgColor(stock.change24hPercent)
                          } ${
                            isHeavyweight ? 'col-span-2 row-span-2 min-h-[110px]' : 
                            isMediumWeight ? 'col-span-2 min-h-[75px]' : 'min-h-[70px]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-extrabold text-sm tracking-wide">
                              {stock.symbol}
                            </span>
                            <span className="text-[11px] font-semibold opacity-90">
                              {stock.price} ₺
                            </span>
                          </div>

                          <div className="mt-1 flex items-end justify-between">
                            <span className="text-xs font-bold">
                              {stock.change24hPercent >= 0 ? '+' : ''}%{stock.change24hPercent}
                            </span>
                            {isHeavyweight && (
                              <span className="text-[10px] opacity-80 font-mono hidden sm:inline">
                                {formatTRY(stock.marketCap)}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View Mode: Grid Matrix */}
          {viewMode === 'GRID' && (
            <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2.5">
                {filteredSectors.flatMap(s => s.stocks).map((stock) => (
                  <div
                    key={stock.symbol}
                    onClick={() => onSelectStock && onSelectStock(stock.symbol)}
                    className={`cursor-pointer rounded-xl p-3 flex flex-col justify-between transition-all transform hover:scale-[1.04] active:scale-[0.98] shadow-md select-none ${
                      getChangeBgColor(stock.change24hPercent)
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{stock.symbol}</span>
                    </div>
                    <div className="mt-2 text-right">
                      <div className="text-[11px] opacity-90 font-mono">{stock.price} ₺</div>
                      <div className="text-xs font-extrabold">
                        {stock.change24hPercent >= 0 ? '+' : ''}%{stock.change24hPercent}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View Mode: Sector List Detailed Table */}
          {viewMode === 'SECTOR_LIST' && (
            <div className="space-y-4">
              {filteredSectors.map((sector) => (
                <div
                  key={sector.sectorName}
                  className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800/70">
                    <div>
                      <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                        {sector.sectorName}
                        <span className="text-xs text-slate-400 font-normal">({sector.stocks.length} Hisse)</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Piyasa Değeri: {formatTRY(sector.totalMarketCap)} • 24s Hacim: {formatTRY(sector.totalVolume24h)}
                      </p>
                    </div>
                    <span className={`text-sm font-bold px-3 py-1 rounded-xl self-start sm:self-auto ${
                      sector.weightedChange24hPercent >= 0 
                        ? 'text-emerald-400 bg-emerald-950/80 border border-emerald-800/40' 
                        : 'text-rose-400 bg-rose-950/80 border border-rose-800/40'
                    }`}>
                      Sektör Değişimi: {sector.weightedChange24hPercent >= 0 ? '+' : ''}%{sector.weightedChange24hPercent}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                      <thead className="text-xs text-slate-400 uppercase bg-slate-950/50 rounded-xl">
                        <tr>
                          <th className="py-2.5 px-4 rounded-l-xl">Hisse / Şirket</th>
                          <th className="py-2.5 px-4 text-right">Fiyat</th>
                          <th className="py-2.5 px-4 text-right">24s Değişim</th>
                          <th className="py-2.5 px-4 text-right">Piyasa Değeri</th>
                          <th className="py-2.5 px-4 text-right">F/K</th>
                          <th className="py-2.5 px-4 text-center rounded-r-xl">Aksiyon</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40">
                        {sector.stocks.map((st) => (
                          <tr 
                            key={st.symbol}
                            className="hover:bg-slate-800/40 transition-all cursor-pointer"
                            onClick={() => onSelectStock && onSelectStock(st.symbol)}
                          >
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-100 flex items-center gap-2">
                                {st.symbol}
                                <span className="text-xs text-slate-400 font-normal truncate max-w-[180px]">
                                  {st.name}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-medium text-slate-200">
                              {st.price.toFixed(2)} ₺
                            </td>
                            <td className="py-3 px-4 text-right font-bold">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs ${
                                st.change24hPercent >= 0
                                  ? 'text-emerald-400 bg-emerald-950/60'
                                  : 'text-rose-400 bg-rose-950/60'
                              }`}>
                                {st.change24hPercent >= 0 ? '+' : ''}%{st.change24hPercent.toFixed(2)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-xs text-slate-400">
                              {formatTRY(st.marketCap)}
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-xs text-slate-300">
                              {st.peRatio ? st.peRatio.toFixed(1) : '-'}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectStock && onSelectStock(st.symbol);
                                }}
                                className="px-3 py-1 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold transition-all"
                              >
                                Analiz
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
