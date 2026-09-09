import React, { useState, useEffect } from 'react';
import { 
  Landmark, 
  TrendingUp, 
  TrendingDown, 
  HelpCircle, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  Info,
  Layers,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { safeFetchJson } from '../../utils/apiClient';
import { IndicatorAssetImpact } from '../../types';

interface AssetImpactSectionProps {
  symbol: string;
  assetName?: string;
}

export const AssetImpactSection: React.FC<AssetImpactSectionProps> = ({ symbol, assetName }) => {
  const [impacts, setImpacts] = useState<IndicatorAssetImpact[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    safeFetchJson<{ success: boolean; impacts: IndicatorAssetImpact[] }>(`/api/macro/asset-impact/${encodeURIComponent(symbol)}`)
      .then(({ data, ok }) => {
        if (!isMounted) return;
        if (ok && data?.impacts) {
          setImpacts(data.impacts);
        } else {
          setError('Makro etki verileri alınamadı.');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Veri bağlantısı hatası');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [symbol]);

  const getCorrelationBadge = (type: string) => {
    switch (type) {
      case 'pozitif':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <TrendingUp size={12} className="text-emerald-400" />
            Pozitif Korelasyon
          </span>
        );
      case 'negatif':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <TrendingDown size={12} className="text-rose-400" />
            Negatif Korelasyon
          </span>
        );
      case 'kosullu':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <HelpCircle size={12} className="text-amber-400" />
            Koşullu / Karma
          </span>
        );
    }
  };

  const getStrengthBadge = (strength: string) => {
    switch (strength) {
      case 'güçlü':
        return <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Güçlü Etki</span>;
      case 'orta':
        return <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-700 text-slate-300 border border-slate-600">Orta Etki</span>;
      case 'zayıf':
      default:
        return <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-800 text-slate-400 border border-slate-700">Zayıf Etki</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center bg-slate-900/50 rounded-xl border border-slate-800 animate-pulse">
        <Landmark size={24} className="mx-auto mb-2 text-indigo-400 animate-spin" />
        <p className="text-sm text-slate-400 font-medium">{symbol} için makro ekonomik etki modelleri yükleniyor...</p>
      </div>
    );
  }

  if (error || impacts.length === 0) {
    return (
      <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/80 text-center">
        <Info size={20} className="mx-auto mb-1 text-slate-400" />
        <p className="text-xs text-slate-400">Bu varlık için özel tanımlanmış makro gösterge kuralı bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Landmark size={18} className="text-indigo-400" />
          <h4 className="text-sm font-bold text-white">Bu Varlığı Etkileyen Ekonomik Göstergeler</h4>
        </div>
        <span className="text-xs text-slate-400">Kural Bazlı Makro Matris ({impacts.length} Gösterge)</span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {impacts.map((imp) => (
          <div 
            key={imp.id}
            className="p-3.5 bg-slate-900/70 hover:bg-slate-900 border border-slate-800 rounded-xl transition-all duration-200"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-100 text-sm">{imp.indicator_name}</span>
                {imp.current_value !== undefined && (
                  <span className="px-2 py-0.5 text-xs font-mono font-bold bg-slate-800 text-indigo-300 rounded border border-slate-700">
                    {imp.current_value} {imp.unit || ''}
                  </span>
                )}
                {imp.is_stale && (
                  <span className="text-[10px] text-amber-400 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800">Gecikmeli</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {getStrengthBadge(imp.strength)}
                {getCorrelationBadge(imp.correlation_type)}
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
              {imp.rationale}
            </p>

            {imp.lag_days > 0 && (
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                <Clock size={12} className="text-slate-400" />
                <span>Etki Gecikmesi: ~{imp.lag_days} gün sonra fiyatlara yansıma eğilimi gösterir.</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/60 flex items-start gap-2">
        <ShieldCheck size={14} className="text-slate-400 mt-0.5 shrink-0" />
        <p className="text-[11px] text-slate-400 leading-normal">
          Makro ilişkiler şirketlerin gelir modeli, girdi maliyetleri ve faiz duyarlılıklarına göre kural bazlı modellenmiştir. 
          Piyasa koşullarına göre sapmalar yaşanabilir. Yatırım tavsiyesi değildir.
        </p>
      </div>
    </div>
  );
};
