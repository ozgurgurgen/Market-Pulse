import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  Layers, 
  PieChart as PieIcon, 
  Globe, 
  Briefcase, 
  Info, 
  Percent, 
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Factory
} from 'lucide-react';
import { safeFetchJson } from '../../utils/apiClient';
import { CompanySubsidiariesData } from '../../types';

interface SubsidiariesAndGovernanceTabProps {
  symbol: string;
}

export const SubsidiariesAndGovernanceTab: React.FC<SubsidiariesAndGovernanceTabProps> = ({ symbol }) => {
  const [data, setData] = useState<CompanySubsidiariesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    safeFetchJson<{ success: boolean; data: CompanySubsidiariesData }>(`/api/stock/${symbol}/subsidiaries`)
      .then(({ data, ok, error }) => {
        if (!isMounted) return;
        if (ok && data?.data) {
          setData(data.data);
        } else {
          setError(error ? (typeof error === 'string' ? error : (error as any).message || 'Hata') : 'Ortaklık ve iştirak verisi alınamadı.');
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

  const formatCurrency = (val: number | undefined) => {
    if (val === undefined || isNaN(val)) return '-';
    if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(2)} Milyar ₺`;
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)} Milyon ₺`;
    return `${val.toLocaleString('tr-TR')} ₺`;
  };

  if (loading) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-400 font-medium">Ortaklık yapısı, iştirakler ve operasyonel veriler yükleniyor...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl text-center space-y-2">
        <Info className="w-8 h-8 text-amber-400 mx-auto" />
        <p className="text-sm text-slate-300">{error || 'Bu hisse için kurumsal ortaklık verisi bulunamadı.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header & Sermaye Özeti */}
      <div className="p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Building2 size={22} />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">{symbol} — Ortaklık Yapısı & İştirakler</h3>
              <p className="text-xs text-slate-400">KAP ve MKK Kayıtlı Hissedarlık, İştirak Portföyü ve Sektörel Üretim Kapasitesi</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-right">
              <span className="text-slate-400 text-[10px]">Halka Açıklık Oranı</span>
              <div className="text-base font-black text-emerald-400 font-mono">%{data.freeFloatRatio}</div>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-right">
              <span className="text-slate-400 text-[10px]">Ödenmiş Sermaye</span>
              <div className="text-base font-black text-slate-200 font-mono">{formatCurrency(data.paidCapitalTRY)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Ortaklık Yapısı (Shareholders Table & Visual Distribution) */}
      <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Users className="text-cyan-400" size={18} />
            <h4 className="text-sm font-bold text-slate-100">Ortaklık ve Pay Dağılımı</h4>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">KAP Resmi Pay Defteri</span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden flex">
          {data.shareholders.map((sh, idx) => (
            <div 
              key={idx} 
              className={`h-full ${idx === 0 ? 'bg-emerald-500' : idx === 1 ? 'bg-cyan-500' : 'bg-slate-600'}`}
              style={{ width: `${sh.sharePercent}%` }}
              title={`${sh.name}: %${sh.sharePercent}`}
            />
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-900/60">
                <th className="py-2.5 px-3">Ortak / Hissedar Unvanı</th>
                <th className="py-2.5 px-3 text-right">Sermaye Payı (%)</th>
                <th className="py-2.5 px-3 text-right">Nominal Tutar (TL)</th>
                <th className="py-2.5 px-3 text-right">Oy Hakkı Oranı (%)</th>
                <th className="py-2.5 px-3 text-center">Tür</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data.shareholders.map((sh, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition">
                  <td className="py-2.5 px-3 font-semibold text-slate-200 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-emerald-400' : idx === 1 ? 'bg-cyan-400' : 'bg-slate-500'}`} />
                    <span>{sh.name}</span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">%{sh.sharePercent}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-300">{formatCurrency(sh.nominalValueTRY)}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-300">%{sh.votingPowerPercent}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sh.isFreeFloat ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-300'}`}>
                      {sh.isFreeFloat ? 'Halka Açık' : 'Hakim Ortak'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Bağlı Ortaklıklar ve İştirakler (Subsidiaries) */}
      <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="text-emerald-400" size={18} />
            <h4 className="text-sm font-bold text-slate-100">Bağlı Ortaklıklar, İştirakler ve Faaliyet Alanları</h4>
          </div>
          <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
            {data.subsidiaries.length} İştirak
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.subsidiaries.map((sub, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-slate-700 transition">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h5 className="text-xs font-bold text-slate-100">{sub.companyName}</h5>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                    <Globe size={12} className="text-slate-500" />
                    <span>{sub.country} • {sub.fieldOfActivity}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded text-[11px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    %{sub.ownershipPercent} Pay
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                <div>
                  <span className="text-slate-500">Konsolidasyon:</span>
                  <div className="font-bold text-slate-300">{sub.isConsolidated ? 'Tam Konsolide' : 'Özsermaye Yöntemi'}</div>
                </div>
                {sub.netIncomeTRY && (
                  <div className="text-right">
                    <span className="text-slate-500">Net Kâr Katkısı:</span>
                    <div className="font-bold text-emerald-400 font-mono">{formatCurrency(sub.netIncomeTRY)}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Sektörel Operasyonel & Kapasite Verileri */}
      <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Factory className="text-amber-400" size={18} />
            <div>
              <h4 className="text-sm font-bold text-slate-100">Sektörel ve Operasyonel Kapasite Göstergeleri</h4>
              <p className="text-[11px] text-slate-400">Faaliyet raporlarından derlenen üretim, kapasite ve ihracat hacimleri</p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-800">
            {data.operationalData.sectorType}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {data.operationalData.metrics.map((m, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400">{m.metricName}</span>
              <div className="text-base font-black text-slate-100 font-mono">{m.currentValue}</div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                <span>{m.period}</span>
                <span className="font-bold text-emerald-400">+{m.changePct}% YoY</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            <span className="text-slate-400">İhracat / Döviz Geliri Payı:</span>
            <div className="text-lg font-black text-emerald-400 mt-0.5">%{data.operationalData.exportSharePct}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            <span className="text-slate-400">Kapasite Kullanım Oranı:</span>
            <div className="text-lg font-black text-cyan-400 mt-0.5">%{data.operationalData.capacityUtilizationRatePct}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            <span className="text-slate-400">Toplam Çalışan Sayısı:</span>
            <div className="text-lg font-black text-slate-200 mt-0.5">{data.operationalData.totalEmployees.toLocaleString('tr-TR')} Kişi</div>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-800">
          💡 <span className="font-bold text-slate-200">Operasyonel Değerlendirme:</span> {data.operationalData.productionCapacitySummary}
        </p>
      </div>
    </div>
  );
};
