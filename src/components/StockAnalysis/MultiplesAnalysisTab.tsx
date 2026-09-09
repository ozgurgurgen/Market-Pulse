import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Info, 
  Percent, 
  Activity, 
  Layers,
  Scale
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { safeFetchJson } from '../../utils/apiClient';
import { MultipleAnalysisData } from '../../types';
import { AcademyTooltip } from '../AcademyTooltip';

interface MultiplesAnalysisTabProps {
  symbol: string;
}

export const MultiplesAnalysisTab: React.FC<MultiplesAnalysisTabProps> = ({ symbol }) => {
  const [data, setData] = useState<MultipleAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'pe' | 'pb' | 'evebitda'>('pe');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    safeFetchJson<{ success: boolean; data: MultipleAnalysisData }>(`/api/stock/${symbol}/multiples`)
      .then(({ data, ok, error }) => {
        if (!isMounted) return;
        if (ok && data?.data) {
          setData(data.data);
        } else {
          setError(error ? (typeof error === 'string' ? error : (error as any).message || 'Hata') : 'Çarpan verisi alınamadı.');
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

  if (loading) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-400 font-medium">Tarihsel değerleme çarpanları ve percentile analizi yükleniyor...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl text-center space-y-2">
        <Info className="w-8 h-8 text-amber-400 mx-auto" />
        <p className="text-sm text-slate-300">{error || 'Bu hisse için çarpan verisi bulunamadı.'}</p>
      </div>
    );
  }

  const metricLabel = selectedMetric === 'pe' ? 'Fiyat / Kazanç (F/K)' : selectedMetric === 'pb' ? 'Piyasa Değeri / Defter Değeri (PD/DD)' : 'Firma Değeri / FAVÖK (FD/FAVÖK)';
  const currentVal = selectedMetric === 'pe' ? data.currentMultiples.pe : selectedMetric === 'pb' ? data.currentMultiples.pb : data.currentMultiples.evebitda;
  const sectorVal = selectedMetric === 'pe' ? data.sectorAverages.pe : selectedMetric === 'pb' ? data.sectorAverages.pb : data.sectorAverages.evebitda;
  const percentile = selectedMetric === 'pe' ? data.percentiles.pePercentile : selectedMetric === 'pb' ? data.percentiles.pbPercentile : data.percentiles.evebitdaPercentile;

  return (
    <div className="space-y-6">
      {/* 1. KPI Kartları (Mevcut Çarpanlar & Percentile) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <AcademyTooltip term="pe">F/K (Fiyat/Kazanç)</AcademyTooltip>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono text-slate-100">{data.currentMultiples.pe}x</span>
            <span className="text-[10px] text-emerald-400 font-semibold font-mono">(Sektör: {data.sectorAverages.pe}x)</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 font-medium">
            Son 5 yılın %{data.percentiles.pePercentile}'sinden ucuz
          </div>
        </div>

        <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <AcademyTooltip term="pb">PD/DD (Defter Değeri)</AcademyTooltip>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono text-slate-100">{data.currentMultiples.pb}x</span>
            <span className="text-[10px] text-emerald-400 font-semibold font-mono">(Sektör: {data.sectorAverages.pb}x)</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 font-medium">
            Son 5 yılın %{data.percentiles.pbPercentile}'sinden ucuz
          </div>
        </div>

        <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <AcademyTooltip term="evebitda">FD / FAVÖK</AcademyTooltip>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono text-slate-100">{data.currentMultiples.evebitda}x</span>
            <span className="text-[10px] text-emerald-400 font-semibold font-mono">(Sektör: {data.sectorAverages.evebitda}x)</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 font-medium">
            Son 5 yılın %{data.percentiles.evebitdaPercentile}'sinden ucuz
          </div>
        </div>

        <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <AcademyTooltip term="peg">PEG Rasyosu</AcademyTooltip>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono text-emerald-400">{data.currentMultiples.pegRatio}</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {data.currentMultiples.pegRatio < 1 ? '🔥 Yüksek büyüme & iskontolu' : 'Dengeli değerleme'}
          </div>
        </div>
      </div>

      {/* 2. Tarihsel Çarpan Grafiği ve Karşılaştırma */}
      <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h4 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Scale size={16} className="text-indigo-400" />
              <span>{metricLabel} — 5 Yıllık Tarihsel Trend</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Hissenin güncel çarpanı: <strong className="text-slate-200">{currentVal}x</strong>, Sektör ortalaması: <strong className="text-indigo-300">{sectorVal}x</strong>
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setSelectedMetric('pe')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedMetric === 'pe' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              F/K
            </button>
            <button
              onClick={() => setSelectedMetric('pb')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedMetric === 'pb' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              PD/DD
            </button>
            <button
              onClick={() => setSelectedMetric('evebitda')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedMetric === 'evebitda' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              FD/FAVÖK
            </button>
          </div>
        </div>

        <div className="h-[280px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.historicalSeries} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line 
                type="monotone" 
                dataKey={selectedMetric} 
                name={`${symbol} ${selectedMetric.toUpperCase()}`} 
                stroke="#6366f1" 
                strokeWidth={2.5} 
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey={selectedMetric === 'pe' ? 'sectorPe' : selectedMetric === 'pb' ? 'sectorPb' : 'sectorEvebitda'} 
                name="Sektör Ortalaması" 
                stroke="#f59e0b" 
                strokeWidth={2} 
                strokeDasharray="4 4" 
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="p-3 bg-indigo-950/20 rounded-xl border border-indigo-500/20 text-xs text-indigo-200 leading-relaxed">
          🎯 <strong>Değerleme Teşhisi:</strong> {symbol} güncel çarpanlarına göre son 5 yıllık tarihsel ortalamasının <strong>%{percentile}</strong> diliminde işlem görmekte olup, sektörel akranlarına kıyasla <strong>%{(100 - (currentVal / sectorVal) * 100).toFixed(1)}</strong> iskontolu fiyatlanmaktadır.
        </div>
      </div>
    </div>
  );
};
