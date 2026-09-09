import React, { useState, useEffect } from 'react';
import { 
  Award, 
  TrendingUp, 
  Activity, 
  Scale, 
  CheckCircle2, 
  XCircle, 
  MinusCircle, 
  Info, 
  Download, 
  ShieldCheck,
  Zap,
  Check
} from 'lucide-react';
import { safeFetchJson } from '../../utils/apiClient';
import { FinancialKarne, KarneMetric } from '../../types';
import { exportToCSV } from '../../utils/exportUtils';
import { AcademyTooltip } from '../AcademyTooltip';

interface ScorecardTabProps {
  symbol: string;
}

export const ScorecardTab: React.FC<ScorecardTabProps> = ({ symbol }) => {
  const [karne, setKarne] = useState<FinancialKarne | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'profitability' | 'growth' | 'leverage'>('all');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    safeFetchJson<{ success: boolean; data: FinancialKarne }>(`/api/stock/${symbol}/scorecard`)
      .then(({ data, ok, error }) => {
        if (!isMounted) return;
        if (ok && data?.data) {
          setKarne(data.data);
        } else {
          setError(error ? (typeof error === 'string' ? error : (error as any).message || 'Hata') : 'Karne verisi alınamadı.');
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

  const handleExportKarne = () => {
    if (!karne) return;
    const headers = ['Kategori', 'Kriter', 'Değer', 'Hedef', 'Durum', 'Açıklama'];
    const rows = [
      ...(karne.profitability?.metrics || []).map(m => ['Kârlılık', m.name, m.value, m.benchmark || '', m.status, m.description || m.note || '']),
      ...(karne.growth?.metrics || []).map(m => ['Büyüme', m.name, m.value, m.benchmark || '', m.status, m.description || m.note || '']),
      ...(karne.leverage?.metrics || []).map(m => ['Borçluluk', m.name, m.value, m.benchmark || '', m.status, m.description || m.note || ''])
    ];
    exportToCSV(`${symbol}_18_Kriterli_Karne`, headers, rows);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'PASS' || status === 'POSITIVE') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 size={11} /> Geçti
        </span>
      );
    }
    if (status === 'FAIL' || status === 'NEGATIVE') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
          <XCircle size={11} /> Kaldı
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
        <MinusCircle size={11} /> Nötr
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-400 font-medium">18 Kriterli Finansal Karne hesaplanıyor...</p>
      </div>
    );
  }

  if (error || !karne) {
    return (
      <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl text-center space-y-2">
        <Info className="w-8 h-8 text-amber-400 mx-auto" />
        <p className="text-sm text-slate-300">{error || 'Bu hisse için karne verisi oluşturulamadı.'}</p>
      </div>
    );
  }

  const scorePct = Math.round((karne.overallScore / 18) * 100);

  return (
    <div className="space-y-6">
      {/* 1. Header & Overall Scorecard Summary */}
      <div className="p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-emerald-500/30 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Award size={20} />
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>{symbol} — 18 Kriterli Gelişmiş Sağlık Karnesi</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Kapsamlı Metodoloji
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Kârlılık, Büyüme ve Borçluluk/Kaldıraç boyutlarında 18 katı nesnel finansal test</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 pt-1 leading-relaxed">{karne.summary}</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Büyük Skor Kutusu */}
            <div className="px-5 py-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center shadow-inner">
              <div className="text-3xl font-black text-emerald-400 tracking-tight">
                {karne.overallScore} <span className="text-base font-bold text-slate-400">/ 18</span>
              </div>
              <div className="text-[11px] text-emerald-300/80 font-bold mt-0.5">Genel Not: %{scorePct}</div>
            </div>

            <button
              onClick={handleExportKarne}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer text-xs font-bold gap-1"
              title="Karneyi Excel / CSV olarak indir"
            >
              <Download size={16} className="text-emerald-400" />
              <span>Dışa Aktar</span>
            </button>
          </div>
        </div>

        {/* 3 Pillar Progress Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <TrendingUp size={13} /> Kârlılık
              </span>
              <span className="font-black text-slate-200">{karne.profitability.score} / 6</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${(karne.profitability.score / 6) * 100}%` }} />
            </div>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-cyan-400 flex items-center gap-1">
                <Activity size={13} /> Büyüme
              </span>
              <span className="font-black text-slate-200">{karne.growth.score} / 6</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full transition-all" style={{ width: `${(karne.growth.score / 6) * 100}%` }} />
            </div>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <Scale size={13} /> Borçluluk &amp; Kaldıraç
              </span>
              <span className="font-black text-slate-200">{karne.leverage.score} / 6</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${(karne.leverage.score / 6) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filtre Butonları */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeCategory === 'all' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Tüm Kriterler (18)
        </button>
        <button
          onClick={() => setActiveCategory('profitability')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeCategory === 'profitability' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Kârlılık (6 Kriter)
        </button>
        <button
          onClick={() => setActiveCategory('growth')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeCategory === 'growth' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Büyüme (6 Kriter)
        </button>
        <button
          onClick={() => setActiveCategory('leverage')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeCategory === 'leverage' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Borçluluk (6 Kriter)
        </button>
      </div>

      {/* 3. Karne Kriter Tabloları */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* KÂRLILIK BLOKU */}
        {(activeCategory === 'all' || activeCategory === 'profitability') && (
          <div className={`p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 ${activeCategory === 'profitability' ? 'lg:col-span-3' : ''}`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-emerald-400" size={16} />
                <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                  Kârlılık Kriterleri ({karne.profitability?.score ?? 0}/6)
                </h4>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold">Marj &amp; Getiri</span>
            </div>

            <div className="space-y-2.5">
              {(karne.profitability?.metrics || []).map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-1.5 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">
                      <AcademyTooltip term={m.name}>{m.name}</AcademyTooltip>
                    </span>
                    <span className="font-black text-emerald-400 font-mono">{m.value}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="text-slate-500">Hedef Eşik: <strong className="text-slate-300 font-mono">{m.benchmark || 'Sektör Ort.'}</strong></span>
                    {getStatusBadge(m.status)}
                  </div>
                  {(m.description || m.note) && (
                    <p className="text-[11px] text-slate-400 border-t border-slate-800/60 pt-1 leading-relaxed">
                      {m.description || m.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BÜYÜME BLOKU */}
        {(activeCategory === 'all' || activeCategory === 'growth') && (
          <div className={`p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 ${activeCategory === 'growth' ? 'lg:col-span-3' : ''}`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Activity className="text-cyan-400" size={16} />
                <h4 className="text-xs font-black text-cyan-400 uppercase tracking-wider">
                  Büyüme Kriterleri ({karne.growth?.score ?? 0}/6)
                </h4>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold">Satış &amp; FAVÖK</span>
            </div>

            <div className="space-y-2.5">
              {(karne.growth?.metrics || []).map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-1.5 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">
                      <AcademyTooltip term={m.name}>{m.name}</AcademyTooltip>
                    </span>
                    <span className="font-black text-cyan-400 font-mono">{m.value}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="text-slate-500">Hedef Eşik: <strong className="text-slate-300 font-mono">{m.benchmark || 'Sektör Ort.'}</strong></span>
                    {getStatusBadge(m.status)}
                  </div>
                  {(m.description || m.note) && (
                    <p className="text-[11px] text-slate-400 border-t border-slate-800/60 pt-1 leading-relaxed">
                      {m.description || m.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BORÇLULUK / KALDIRAÇ BLOKU */}
        {(activeCategory === 'all' || activeCategory === 'leverage') && (
          <div className={`p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 ${activeCategory === 'leverage' ? 'lg:col-span-3' : ''}`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Scale className="text-amber-400" size={16} />
                <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider">
                  Borçluluk &amp; Kaldıraç ({karne.leverage?.score ?? 0}/6)
                </h4>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold">Risk &amp; Likidite</span>
            </div>

            <div className="space-y-2.5">
              {(karne.leverage?.metrics || []).map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-1.5 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">
                      <AcademyTooltip term={m.name}>{m.name}</AcademyTooltip>
                    </span>
                    <span className="font-black text-amber-400 font-mono">{m.value}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="text-slate-500">Hedef Eşik: <strong className="text-slate-300 font-mono">{m.benchmark || 'Sektör Ort.'}</strong></span>
                    {getStatusBadge(m.status)}
                  </div>
                  {(m.description || m.note) && (
                    <p className="text-[11px] text-slate-400 border-t border-slate-800/60 pt-1 leading-relaxed">
                      {m.description || m.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
