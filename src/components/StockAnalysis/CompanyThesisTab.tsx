import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Target, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Layers, 
  PieChart as PieIcon, 
  Info, 
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { safeFetchJson } from '../../utils/apiClient';
import { CompanyThesis } from '../../types';

interface CompanyThesisTabProps {
  symbol: string;
}

export const CompanyThesisTab: React.FC<CompanyThesisTabProps> = ({ symbol }) => {
  const [thesis, setThesis] = useState<CompanyThesis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    thesis: true,
    moat: true,
    catalysts: true,
    risks: true,
    segments: true
  });

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    safeFetchJson<{ success: boolean; data: CompanyThesis }>(`/api/stock/${symbol}/thesis`)
      .then(({ data, ok, error }) => {
        if (!isMounted) return;
        if (ok && data?.data) {
          setThesis(data.data);
        } else {
          setError(error ? (typeof error === 'string' ? error : (error as any).message || 'Hata') : 'Şirket & Tez verisi alınamadı.');
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

  const toggleSection = (sec: string) => {
    setExpandedSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  if (loading) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-400 font-medium">Şirket iş modeli ve yatırım tezi yükleniyor...</p>
      </div>
    );
  }

  if (error || !thesis) {
    return (
      <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl text-center space-y-2">
        <Info className="w-8 h-8 text-amber-400 mx-auto" />
        <p className="text-sm text-slate-300">{error || 'Bu hisse için henüz yatırım tezi girilmemiş.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Card */}
      <div className="p-5 bg-gradient-to-br from-indigo-950/30 via-slate-900/80 to-slate-900/90 rounded-2xl border border-indigo-500/20 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Building2 size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-base">{symbol} — Şirket & Yatırım Tezi</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {thesis.sector}
                </span>
              </div>
              <p className="text-xs text-slate-400">{thesis.industry}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/40 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
            <Calendar size={13} className="text-indigo-400" />
            <span>Son Güncelleme: {thesis.lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* 2. Yatırım Tezi (Zengin Metin Kartı) */}
      <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
        <button 
          onClick={() => toggleSection('thesis')}
          className="w-full flex items-center justify-between font-bold text-sm text-slate-200 pb-3 border-b border-slate-800 cursor-pointer"
        >
          <div className="flex items-center gap-2 text-indigo-300">
            <Sparkles size={16} />
            <span>Stratejik Yatırım Tezi</span>
          </div>
          {expandedSections.thesis ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {expandedSections.thesis && (
          <div className="mt-4 space-y-3 text-sm text-slate-300 leading-relaxed">
            <p className="p-4 bg-indigo-950/20 rounded-xl border border-indigo-500/20 text-indigo-100 font-medium">
              {thesis.thesisText}
            </p>
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">İş Modeli ve Gelir Üretimi</h4>
              <p className="text-slate-300 text-xs md:text-sm bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
                {thesis.businessModelSummary}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Gelir Segmentleri Dağılımı */}
      <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
        <button 
          onClick={() => toggleSection('segments')}
          className="w-full flex items-center justify-between font-bold text-sm text-slate-200 pb-3 border-b border-slate-800 cursor-pointer"
        >
          <div className="flex items-center gap-2 text-emerald-400">
            <PieIcon size={16} />
            <span>Gelir Segmentleri ve Faaliyet Dağılımı</span>
          </div>
          {expandedSections.segments ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {expandedSections.segments && (
          <div className="mt-4 space-y-4">
            <div className="space-y-2.5">
              {thesis.revenueSegments.map((seg, idx) => (
                <div key={idx} className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <div>
                      <span className="text-xs md:text-sm font-semibold text-slate-200">{seg.name}</span>
                      <span className="ml-2 text-xs text-slate-400">({(seg.amountTRY / 1e9).toFixed(1)} Milyar ₺)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 min-w-[140px] justify-end">
                    <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${seg.sharePct}%` }} />
                    </div>
                    <span className="text-xs font-bold text-emerald-300 w-10 text-right">%{seg.sharePct}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Rekabet Avantajları (Moat), Katalizörler ve Riskler (3 Kolonlu Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Rekabet Avantajları */}
        <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs md:text-sm mb-3 pb-2 border-b border-slate-800">
            <ShieldCheck size={16} />
            <span>Rekabet Avantajları (Moat)</span>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300 flex-1">
            {thesis.competitiveMoat.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-blue-950/20 p-2.5 rounded-xl border border-blue-500/20">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Katalizörler */}
        <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs md:text-sm mb-3 pb-2 border-b border-slate-800">
            <Target size={16} />
            <span>Büyüme Katalizörleri</span>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300 flex-1">
            {thesis.catalysts.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/20">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risk Faktörleri */}
        <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs md:text-sm mb-3 pb-2 border-b border-slate-800">
            <AlertTriangle size={16} />
            <span>Temel Risk Faktörleri</span>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300 flex-1">
            {thesis.risks.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-rose-950/20 p-2.5 rounded-xl border border-rose-500/20">
                <span className="text-rose-400 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
