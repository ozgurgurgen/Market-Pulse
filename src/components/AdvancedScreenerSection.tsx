import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  Search, 
  Download, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  RefreshCw, 
  SlidersHorizontal,
  Award,
  ArrowUpDown,
  ArrowRight
} from 'lucide-react';
import { safeFetchJson } from '../utils/apiClient';
import { ScreenerStockRow, ScreenerFilterConfig } from '../types';
import { exportToCSV } from '../utils/exportUtils';

interface AdvancedScreenerSectionProps {
  onSelectStock: (symbol: string) => void;
}

export const AdvancedScreenerSection: React.FC<AdvancedScreenerSectionProps> = ({ onSelectStock }) => {
  const [stocks, setStocks] = useState<ScreenerStockRow[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Filters State
  const [filters, setFilters] = useState<ScreenerFilterConfig>({
    searchQuery: '',
    selectedSector: 'TÜMÜ',
    minPe: undefined,
    maxPe: undefined,
    minPb: undefined,
    maxPb: undefined,
    minRoe: undefined,
    minRevenueGrowth: undefined,
    maxNetDebtToEbitda: undefined,
    minDividendYield: undefined,
    minScorecard: undefined,
    sortField: 'scorecardScore',
    sortOrder: 'desc'
  });

  const fetchFilteredStocks = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.searchQuery) params.set('search', filters.searchQuery);
    if (filters.selectedSector && filters.selectedSector !== 'TÜMÜ') params.set('sector', filters.selectedSector);
    if (filters.minPe !== undefined) params.set('minPe', String(filters.minPe));
    if (filters.maxPe !== undefined) params.set('maxPe', String(filters.maxPe));
    if (filters.minPb !== undefined) params.set('minPb', String(filters.minPb));
    if (filters.maxPb !== undefined) params.set('maxPb', String(filters.maxPb));
    if (filters.minRoe !== undefined) params.set('minRoe', String(filters.minRoe));
    if (filters.minRevenueGrowth !== undefined) params.set('minRevenueGrowth', String(filters.minRevenueGrowth));
    if (filters.maxNetDebtToEbitda !== undefined) params.set('maxNetDebtToEbitda', String(filters.maxNetDebtToEbitda));
    if (filters.minDividendYield !== undefined) params.set('minDividendYield', String(filters.minDividendYield));
    if (filters.minScorecard !== undefined) params.set('minScorecard', String(filters.minScorecard));

    safeFetchJson<{ success: boolean; data: ScreenerStockRow[]; availableSectors: string[] }>(`/api/screener/stocks?${params.toString()}`)
      .then(({ data, ok }) => {
        if (ok && data?.data) {
          setStocks(data.data);
          if (data.availableSectors) setSectors(data.availableSectors);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFilteredStocks();
  }, [
    filters.selectedSector, 
    filters.minPe, 
    filters.maxPe, 
    filters.minPb, 
    filters.maxPb, 
    filters.minRoe, 
    filters.minRevenueGrowth, 
    filters.maxNetDebtToEbitda, 
    filters.minDividendYield, 
    filters.minScorecard,
    filters.searchQuery
  ]);

  
  const fetchPresetStocks = async (preset: string) => {
    setActivePreset(preset);
    setLoading(true);
    try {
      const res = await safeFetchJson<{ preset: string, results: ScreenerStockRow[] }>(`/api/screener/${preset}`);
      if (res.ok && res.data) {
        setStocks(res.data.results);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (presetKey: string) => {
    setActivePreset(presetKey);
    if (presetKey === 'value') {
      setFilters(prev => ({
        ...prev,
        maxPe: 8.0,
        maxPb: 2.0,
        minRoe: 30.0,
        minRevenueGrowth: undefined,
        maxNetDebtToEbitda: undefined,
        minDividendYield: undefined,
        minScorecard: undefined
      }));
    } else if (presetKey === 'growth') {
      setFilters(prev => ({
        ...prev,
        minRevenueGrowth: 50.0,
        minRoe: 25.0,
        maxPe: undefined,
        maxPb: undefined,
        maxNetDebtToEbitda: undefined,
        minDividendYield: undefined,
        minScorecard: undefined
      }));
    } else if (presetKey === 'dividend_safe') {
      setFilters(prev => ({
        ...prev,
        minDividendYield: 3.5,
        maxNetDebtToEbitda: 1.0,
        minPe: undefined,
        maxPe: undefined,
        minPb: undefined,
        maxPb: undefined,
        minRoe: undefined,
        minRevenueGrowth: undefined,
        minScorecard: undefined
      }));
    } else if (presetKey === 'scorecard_stars') {
      setFilters(prev => ({
        ...prev,
        minScorecard: 15,
        maxPe: undefined,
        maxPb: undefined,
        minRoe: undefined,
        minRevenueGrowth: undefined,
        maxNetDebtToEbitda: undefined,
        minDividendYield: undefined
      }));
    }
  };

  const handleResetFilters = () => {
    setActivePreset(null);
    setFilters({
      searchQuery: '',
      selectedSector: 'TÜMÜ',
      minPe: undefined,
      maxPe: undefined,
      minPb: undefined,
      maxPb: undefined,
      minRoe: undefined,
      minRevenueGrowth: undefined,
      maxNetDebtToEbitda: undefined,
      minDividendYield: undefined,
      minScorecard: undefined,
      sortField: 'scorecardScore',
      sortOrder: 'desc'
    });
  };

  const handleSort = (field: keyof ScreenerStockRow) => {
    const isAsc = filters.sortField === field && filters.sortOrder === 'asc';
    setFilters(prev => ({
      ...prev,
      sortField: field,
      sortOrder: isAsc ? 'desc' : 'asc'
    }));
  };

  const sortedStocks = [...stocks].sort((a, b) => {
    const field = filters.sortField || 'scorecardScore';
    const valA = (a as any)[field] ?? 0;
    const valB = (b as any)[field] ?? 0;
    if (filters.sortOrder === 'asc') {
      return valA > valB ? 1 : -1;
    }
    return valA < valB ? 1 : -1;
  });

  const handleExport = () => {
    const headers = ['Sembol', 'Şirket', 'Sektör', 'Fiyat (TL)', 'F/K', 'PD/DD', 'FD/FAVÖK', 'ROE (%)', 'Satış Büyümesi YoY (%)', 'Net Borç/FAVÖK', 'Temettü Verimi (%)', 'Karne Skoru (/18)'];
    const rows = sortedStocks.map(s => [
      s.symbol,
      s.name,
      s.sector,
      s.price,
      s.pe,
      s.pb,
      s.evebitda,
      `%${s.roe}`,
      `%${s.revenueGrowthYoY}`,
      `${s.netDebtToEbitda}x`,
      `%${s.dividendYield}`,
      `${s.scorecardScore}/18`
    ]);

    exportToCSV('BIST_Gelismis_Hisse_Tarama_Sonuclari', headers, rows);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Presets */}
      <div className="p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-3xl border border-emerald-500/30 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <SlidersHorizontal size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <span>Gelişmiş Hisse Filtreleme & Temel Analiz Taraması</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Gelişmiş Tarayıcı
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                F/K, PD/DD, ROE, 18 Kriterli Karne Skoru, Net Borç/FAVÖK ve Büyüme filtreleri ile özel portföy taraması
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                exportSuccess ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
              }`}
            >
              <Download size={14} className="text-emerald-400" />
              <span>Excel / CSV Aktar</span>
            </button>
          </div>
        </div>

        {/* Hazır Strateji Filtreleri (Presets) */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-800">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Sparkles size={13} className="text-emerald-400" /> Hazır Filtreler:
          </span>

          <button
            onClick={() => applyPreset('value')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activePreset === 'value' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            💎 Değer Yatırımı (F/K &lt; 8 &amp; ROE &gt; %30)
          </button>

          <button
            onClick={() => applyPreset('growth')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activePreset === 'growth' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            🚀 Yüksek Satış Büyümesi (&gt; %50)
          </button>

          <button
            onClick={() => applyPreset('dividend_safe')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activePreset === 'dividend_safe' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            💰 Temettü Disiplini &amp; Düşük Borç
          </button>

          <button
            onClick={() => applyPreset('scorecard_stars')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activePreset === 'scorecard_stars' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            ⭐ 18 Kriterli Karne Yıldızları (&gt;= 15/18)
          </button>

          <button
            onClick={handleResetFilters}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-950 border border-slate-800 transition cursor-pointer ml-auto"
          >
            Sıfırla
          </button>
        </div>
      </div>

      {/* 2. Filtre Kontrol Paneli */}
      <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Arama & Sektör */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400">Hisse / Şirket Ara:</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                placeholder="Örn: THYAO, Ford..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400">Sektör Seçimi:</label>
            <select
              value={filters.selectedSector || 'TÜMÜ'}
              onChange={(e) => setFilters(prev => ({ ...prev, selectedSector: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {sectors.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* F/K Max & PD/DD Max */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400">Maks. F/K Oranı:</label>
            <input
              type="number"
              value={filters.maxPe ?? ''}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPe: e.target.value ? Number(e.target.value) : undefined }))}
              placeholder="Örn: 10"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400">Maks. PD/DD Oranı:</label>
            <input
              type="number"
              step="0.1"
              value={filters.maxPb ?? ''}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPb: e.target.value ? Number(e.target.value) : undefined }))}
              placeholder="Örn: 2.5"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          {/* Min ROE & Min Satış Büyümesi */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400">Min. Özkaynak Kârlılığı (ROE %):</label>
            <input
              type="number"
              value={filters.minRoe ?? ''}
              onChange={(e) => setFilters(prev => ({ ...prev, minRoe: e.target.value ? Number(e.target.value) : undefined }))}
              placeholder="Örn: 25"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400">Min. Hasılat Büyümesi (% YoY):</label>
            <input
              type="number"
              value={filters.minRevenueGrowth ?? ''}
              onChange={(e) => setFilters(prev => ({ ...prev, minRevenueGrowth: e.target.value ? Number(e.target.value) : undefined }))}
              placeholder="Örn: 40"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          {/* Net Borç/FAVÖK & Min Karne Skoru */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400">Maks. Net Borç / FAVÖK:</label>
            <input
              type="number"
              step="0.1"
              value={filters.maxNetDebtToEbitda ?? ''}
              onChange={(e) => setFilters(prev => ({ ...prev, maxNetDebtToEbitda: e.target.value ? Number(e.target.value) : undefined }))}
              placeholder="Örn: 1.5"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400">Min. 18 Kriterli Karne Skoru:</label>
            <input
              type="number"
              min="0"
              max="18"
              value={filters.minScorecard ?? ''}
              onChange={(e) => setFilters(prev => ({ ...prev, minScorecard: e.target.value ? Number(e.target.value) : undefined }))}
              placeholder="Örn: 14"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

        </div>
      </div>

      {/* 3. Filtreleme Sonuçları Tablosu */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 shadow-xl">
        <table className="w-full text-left text-xs border-collapse min-w-[960px]">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-semibold">
              <th className="py-3 px-4">Hisse & Şirket</th>
              <th className="py-3 px-2">Sektör</th>
              <th className="py-3 px-2 text-right">Fiyat</th>
              <th className="py-3 px-2 text-right cursor-pointer hover:text-white" onClick={() => handleSort('pe')}>
                <div className="flex items-center justify-end gap-1">F/K <ArrowUpDown size={11} /></div>
              </th>
              <th className="py-3 px-2 text-right cursor-pointer hover:text-white" onClick={() => handleSort('pb')}>
                <div className="flex items-center justify-end gap-1">PD/DD <ArrowUpDown size={11} /></div>
              </th>
              <th className="py-3 px-2 text-right cursor-pointer hover:text-white" onClick={() => handleSort('evebitda')}>
                <div className="flex items-center justify-end gap-1">FD/FAVÖK <ArrowUpDown size={11} /></div>
              </th>
              <th className="py-3 px-2 text-right cursor-pointer hover:text-white" onClick={() => handleSort('roe')}>
                <div className="flex items-center justify-end gap-1">ROE <ArrowUpDown size={11} /></div>
              </th>
              <th className="py-3 px-2 text-right cursor-pointer hover:text-white" onClick={() => handleSort('revenueGrowthYoY')}>
                <div className="flex items-center justify-end gap-1">Hasılat Büyüme <ArrowUpDown size={11} /></div>
              </th>
              <th className="py-3 px-2 text-right">Net Borç/FAVÖK</th>
              <th className="py-3 px-2 text-right">Temettü</th>
              <th className="py-3 px-3 text-center cursor-pointer hover:text-white" onClick={() => handleSort('scorecardScore')}>
                <div className="flex items-center justify-center gap-1">Karne Notu <ArrowUpDown size={11} /></div>
              </th>
              <th className="py-3 px-3 text-center">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={12} className="py-12 text-center text-slate-400">
                  <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Kriterlere uygun hisseler taranıyor...
                </td>
              </tr>
            ) : sortedStocks.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-8 text-center text-slate-500">
                  Seçilen filtrelere uyan hisse bulunamadı. Lütfen filtre eşiklerini esnetin.
                </td>
              </tr>
            ) : (
              sortedStocks.map((stock) => (
                <tr 
                  key={stock.symbol}
                  onClick={() => onSelectStock(stock.symbol)}
                  className="hover:bg-slate-900/60 transition cursor-pointer group"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-black text-emerald-400 font-mono text-xs">
                        {stock.symbol}
                      </div>
                      <div>
                        <div className="font-bold text-slate-100 group-hover:text-emerald-400 transition">{stock.name}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-2 text-slate-400 text-[11px] truncate max-w-[120px]">
                    {stock.sector}
                  </td>

                  <td className="py-3 px-2 text-right font-mono font-bold text-slate-100">
                    {stock.price.toFixed(2)} ₺
                  </td>

                  <td className="py-3 px-2 text-right font-mono font-bold text-emerald-400">
                    {stock.pe.toFixed(1)}x
                  </td>

                  <td className="py-3 px-2 text-right font-mono text-slate-300">
                    {stock.pb.toFixed(2)}x
                  </td>

                  <td className="py-3 px-2 text-right font-mono text-cyan-400">
                    {stock.evebitda.toFixed(1)}x
                  </td>

                  <td className="py-3 px-2 text-right font-mono font-bold text-emerald-400">
                    %{stock.roe.toFixed(1)}
                  </td>

                  <td className="py-3 px-2 text-right font-mono text-slate-200">
                    %{stock.revenueGrowthYoY.toFixed(1)}
                  </td>

                  <td className="py-3 px-2 text-right font-mono text-slate-400">
                    {stock.netDebtToEbitda.toFixed(2)}x
                  </td>

                  <td className="py-3 px-2 text-right font-mono text-purple-400">
                    %{stock.dividendYield.toFixed(1)}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {stock.scorecardScore}/18
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStock(stock.symbol);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-emerald-600 text-slate-300 hover:text-white font-bold text-xs transition flex items-center gap-1 mx-auto cursor-pointer"
                    >
                      <span>Rapor</span>
                      <ArrowRight size={11} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
