import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  Users, 
  Coins, 
  PieChart, 
  Search, 
  Filter, 
  Info,
  DollarSign,
  ArrowUpDown,
  Building2
} from 'lucide-react';
import { safeFetchJson } from '../../utils/apiClient';
import { FundPositionSummary, FundDynamicsRow } from '../../types';

interface FundPositionsTabProps {
  symbol: string;
}

export const FundPositionsTab: React.FC<FundPositionsTabProps> = ({ symbol }) => {
  const [summary, setSummary] = useState<FundPositionSummary | null>(null);
  const [funds, setFunds] = useState<FundDynamicsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'currentWeight' | 'netWeightChange' | 'positionValueTRY'>('currentWeight');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currency, setCurrency] = useState<'TRY' | 'USD'>('TRY');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    safeFetchJson<{ success: boolean; data: { summary: FundPositionSummary; funds: FundDynamicsRow[] } }>(`/api/stock/${symbol}/funds`)
      .then(({ data, ok, error }) => {
        if (!isMounted) return;
        if (ok && data?.data) {
          setSummary(data.data.summary);
          setFunds(data.data.funds);
        } else {
          setError(error ? (typeof error === 'string' ? error : (error as any).message || 'Hata') : 'Fon pozisyonları verisi alınamadı.');
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Bağlantı hatası.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [symbol]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredFunds = funds
    .filter(f => {
      if (!f) return false;
      const q = (searchQuery || '').trim().toLowerCase();
      const code = (f.fundCode || '').toLowerCase();
      const name = (f.fundName || '').toLowerCase();
      const mgt = (f.managementCompany || '').toLowerCase();
      const matchQuery = !q || code.includes(q) || name.includes(q) || mgt.includes(q);
      const matchCat = selectedCategory === 'ALL' || f.category === selectedCategory;
      return matchQuery && matchCat;
    })
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      return sortOrder === 'desc' ? (bVal - aVal) : (aVal - bVal);
    });

  if (loading) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-400 font-medium">Kurumsal fon pozisyonları ve Smart Money akışı yükleniyor...</p>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl text-center space-y-2">
        <Info className="w-8 h-8 text-amber-400 mx-auto" />
        <p className="text-sm text-slate-300">{error || 'Bu hisse için fon pozisyon verisi bulunamadı.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Makro Özet Paneli (Header KPI Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Tutan Fon Sayısı */}
        <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 font-medium">Tutan Fon Sayısı</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-bold font-mono text-slate-100">{summary.holdingFundCount}</span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center">
              <TrendingUp size={11} /> +{summary.holdingFundCountChange}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">Önceki döneme göre</span>
        </div>

        {/* Toplam Fon Pozisyonu */}
        <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 font-medium">Toplam Fon Pozisyonu</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-lg font-bold font-mono text-indigo-300">
              {currency === 'TRY' ? `${(summary.totalPositionTRY / 1e9).toFixed(2)} Mr ₺` : `${(summary.totalPositionUSD / 1e6).toFixed(0)} M $`}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">Kurumsal sermaye</span>
        </div>

        {/* Şirketteki Fon Payı */}
        <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 font-medium">Şirketteki Fon Payı</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-bold font-mono text-emerald-400">%{summary.sharePercentOfCompany}</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">Toplam sermayeye oranı</span>
        </div>

        {/* Ağırlık Artıranlar */}
        <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 font-medium">Ağırlık Artıran Fon</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-bold font-mono text-emerald-400">{summary.fundsIncreasingWeight}</span>
            <span className="text-[10px] text-slate-400">Fon</span>
          </div>
          <span className="text-[10px] text-emerald-400/90 mt-1">Net Alım Tarafı</span>
        </div>

        {/* Ağırlık Azaltanlar */}
        <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 font-medium">Ağırlık Azaltan Fon</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-bold font-mono text-rose-400">{summary.fundsDecreasingWeight}</span>
            <span className="text-[10px] text-slate-400">Fon</span>
          </div>
          <span className="text-[10px] text-rose-400/90 mt-1">Net Satış Tarafı</span>
        </div>

        {/* Yeni Giren / Çıkan */}
        <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 font-medium">Yeni Giren / Çıkan</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-sm font-bold font-mono text-emerald-400">+{summary.newEntries}</span>
            <span className="text-slate-500">/</span>
            <span className="text-sm font-bold font-mono text-rose-400">-{summary.fullExits}</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">İlk kez pozisyon açan</span>
        </div>
      </div>

      {/* 2. Filtreleme & Arama Çubuğu */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <Search size={14} className="text-slate-400" />
          <input
            type="text"
            placeholder="Fon kodu veya portföy şirketi ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-200 outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            {['ALL', 'Hisse Senedi', 'Değişken'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'Tüm Kategoriler' : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setCurrency('TRY')}
              className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer ${
                currency === 'TRY' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              ₺
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer ${
                currency === 'USD' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              $
            </button>
          </div>
        </div>
      </div>

      {/* 3. Fon Dinamikleri Tablosu (Data Grid) */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg">
        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-semibold">
              <th className="py-3 px-4 min-w-[200px]">Fon / Sembol</th>
              <th className="py-3 px-3">Kategori</th>
              <th className="py-3 px-3 text-right">Önceki Ağırlık</th>
              <th 
                className="py-3 px-3 text-right cursor-pointer hover:text-indigo-400 transition"
                onClick={() => handleSort('currentWeight')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Portföy Ağırlığı</span>
                  <ArrowUpDown size={11} />
                </div>
              </th>
              <th 
                className="py-3 px-3 text-right cursor-pointer hover:text-indigo-400 transition"
                onClick={() => handleSort('netWeightChange')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Ağırlık Değişimi</span>
                  <ArrowUpDown size={11} />
                </div>
              </th>
              <th 
                className="py-3 px-4 text-right cursor-pointer hover:text-indigo-400 transition"
                onClick={() => handleSort('positionValueTRY')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Pozisyon Değeri</span>
                  <ArrowUpDown size={11} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredFunds.map((row) => (
              <tr key={row.fundCode} className="hover:bg-slate-800/40 transition">
                {/* Fon Kodu & Adı */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-500/30 flex items-center justify-center font-bold font-mono text-indigo-300 text-[11px]">
                      {row.fundCode}
                    </div>
                    <div>
                      <div className="font-bold text-slate-100 text-xs">{row.fundCode}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[240px]">{row.fundName}</div>
                    </div>
                  </div>
                </td>

                {/* Kategori */}
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    {row.category}
                  </span>
                </td>

                {/* Önceki Ağırlık */}
                <td className="py-3 px-3 text-right font-mono text-slate-400">
                  %{row.previousWeight.toFixed(1)}
                </td>

                {/* Güncel Portföy Ağırlığı */}
                <td className="py-3 px-3 text-right font-mono font-bold text-slate-100">
                  %{row.currentWeight.toFixed(1)}
                </td>

                {/* Net Ağırlık Değişimi */}
                <td className="py-3 px-3 text-right font-mono">
                  <span className={`inline-flex items-center gap-0.5 font-bold ${
                    row.netWeightChange > 0 ? 'text-emerald-400' : row.netWeightChange < 0 ? 'text-rose-400' : 'text-slate-400'
                  }`}>
                    {row.netWeightChange > 0 ? `+${row.netWeightChange.toFixed(1)}` : row.netWeightChange.toFixed(1)} pp
                  </span>
                </td>

                {/* Pozisyon Değeri */}
                <td className="py-3 px-4 text-right font-mono font-bold text-indigo-300">
                  {currency === 'TRY' 
                    ? `${(row.positionValueTRY / 1e6).toFixed(1)} M ₺`
                    : `${(row.positionValueUSD / 1e6).toFixed(1)} M $`
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 text-xs text-slate-400 text-center">
        ⚡ Smart Money Verisi: Fon pozisyon verileri TEFAS ve KAP aylık portföy dağılım raporlarından (PDR) derlenmiştir.
      </div>
    </div>
  );
};
