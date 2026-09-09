import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Info, 
  Percent, 
  Award,
  Zap
} from 'lucide-react';
import { safeFetchJson } from '../../utils/apiClient';
import { SeasonalityData } from '../../types';

interface SeasonalityTabProps {
  symbol: string;
}

export const SeasonalityTab: React.FC<SeasonalityTabProps> = ({ symbol }) => {
  const [data, setData] = useState<SeasonalityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    safeFetchJson<{ success: boolean; data: SeasonalityData }>(`/api/stock/${symbol}/seasonality`)
      .then(({ data, ok, error }) => {
        if (!isMounted) return;
        if (ok && data?.data) {
          setData(data.data);
        } else {
          setError(error ? (typeof error === 'string' ? error : (error as any).message || 'Hata') : 'Mevsimsellik analizi alınamadı.');
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

  const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

  const getHeatmapColor = (val: number | undefined) => {
    if (val === undefined) return 'bg-slate-900/40 text-slate-600';
    if (val > 10) return 'bg-emerald-600/80 text-white font-bold';
    if (val > 5) return 'bg-emerald-600/50 text-emerald-100 font-semibold';
    if (val > 0) return 'bg-emerald-950/60 text-emerald-300';
    if (val === 0) return 'bg-slate-900/60 text-slate-400';
    if (val > -5) return 'bg-rose-950/60 text-rose-300';
    if (val > -10) return 'bg-rose-600/50 text-rose-100 font-semibold';
    return 'bg-rose-600/80 text-white font-bold';
  };

  if (loading) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-400 font-medium">11 Yıllık mevsimsellik ve aylık getiri matrisi hesaplanıyor...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl text-center space-y-2">
        <Info className="w-8 h-8 text-amber-400 mx-auto" />
        <p className="text-sm text-slate-300">{error || 'Bu hisse için mevsimsellik verisi bulunamadı.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header & Özet İpuçları */}
      <div className="p-4 bg-gradient-to-br from-indigo-950/30 via-slate-900/80 to-slate-900/90 rounded-2xl border border-indigo-500/20 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Calendar size={16} className="text-indigo-400" />
              <span>{symbol} — 11 Yıllık Tarihsel Mevsimsellik Matrisi</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Hissenin 2016-2026 yılları arasındaki aylık getiri dağılımı ve istatistiksel başarı olasılığı (Win Rate)
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
            <span className="text-slate-400">En Güçlü Ay:</span>
            <span className="font-bold text-emerald-400 font-mono">Kasım (%7.4 Ort.)</span>
          </div>
        </div>
      </div>

      {/* 2. Yıl x Ay Heatmap Tablosu */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg">
        <table className="w-full text-center text-xs border-collapse min-w-[750px]">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-semibold">
              <th className="py-3 px-3 text-left">Yıl</th>
              {monthNames.map((m) => (
                <th key={m} className="py-3 px-2 font-mono">{m}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 font-mono">
            {data.years.map((year) => (
              <tr key={year} className="hover:bg-slate-800/30 transition">
                <td className="py-2.5 px-3 text-left font-bold text-slate-300 bg-slate-950/30">
                  {year}
                </td>
                {monthNames.map((_, idx) => {
                  const m = idx + 1;
                  const item = data.monthlyReturns.find(r => r.year === year && r.month === m);
                  const val = item?.returnPct;
                  const colorClass = getHeatmapColor(val);

                  return (
                    <td key={m} className="py-2 px-1">
                      <div className={`py-1.5 px-1 rounded-lg transition text-[11px] ${colorClass}`}>
                        {val !== undefined ? `${val > 0 ? '+' : ''}${val}%` : '-'}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Alt Toplam İstatistik Satırları */}
            <tr className="border-t-2 border-slate-700 bg-slate-950/90 font-bold text-slate-100">
              <td className="py-3 px-3 text-left text-indigo-300">Ortalama</td>
              {data.monthlyStats.map((st) => (
                <td key={st.month} className="py-3 px-1">
                  <span className={`text-[11px] ${st.avgReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {st.avgReturn >= 0 ? '+' : ''}{st.avgReturn}%
                  </span>
                </td>
              ))}
            </tr>

            <tr className="bg-slate-950/70 text-slate-300 font-medium">
              <td className="py-2.5 px-3 text-left text-slate-400">Medyan</td>
              {data.monthlyStats.map((st) => (
                <td key={st.month} className="py-2.5 px-1 text-[11px] text-slate-300">
                  {st.medianReturn >= 0 ? '+' : ''}{st.medianReturn}%
                </td>
              ))}
            </tr>

            <tr className="bg-slate-950/80 text-slate-200 font-bold">
              <td className="py-2.5 px-3 text-left text-emerald-400">Win Rate %</td>
              {data.monthlyStats.map((st) => (
                <td key={st.month} className="py-2.5 px-1">
                  <span className={`text-[11px] px-1.5 py-0.5 rounded ${
                    st.winRate >= 65 ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 
                    st.winRate <= 40 ? 'bg-rose-500/20 text-rose-300 font-bold' : 'text-slate-400'
                  }`}>
                    %{st.winRate}
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* 3. Ay Bazlı İstatistik Kartları */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {data.monthlyStats.map((st) => (
          <div key={st.month} className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 text-xs">{st.monthName}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                st.winRate >= 60 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
              }`}>
                %{st.winRate} Win
              </span>
            </div>
            <div className="mt-2">
              <div className="text-sm font-bold font-mono text-slate-100">
                {st.avgReturn >= 0 ? '+' : ''}{st.avgReturn}% Ort.
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                Medyan: {st.medianReturn}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
