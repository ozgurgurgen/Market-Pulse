import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  Activity, 
  Percent,
  CheckCircle2,
  Sparkles,
  Loader2
} from 'lucide-react';
import { safeFetchJson } from '../../utils/apiClient';
import { PeerComparisonData } from '../../types';

interface PeerComparisonTabProps {
  symbol: string;
}

export const PeerComparisonTab: React.FC<PeerComparisonTabProps> = ({ symbol }) => {
  const [data, setData] = useState<PeerComparisonData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchPeers = async () => {
      setLoading(true);
      try {
        const cleanSymbol = symbol.replace('.IS', '').replace('^', '');
        const res = await safeFetchJson<{ success: boolean; data: PeerComparisonData }>(
          `/api/stock/${encodeURIComponent(cleanSymbol)}/peers`
        );
        if (isMounted && res.ok && res.data?.data) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('[PeerComparisonTab] fetch error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPeers();
    return () => { isMounted = false; };
  }, [symbol]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
        <span className="text-sm">Sektörel akran verileri ve çarpan karşılaştırmaları yükleniyor...</span>
      </div>
    );
  }

  if (!data || !data.peers || data.peers.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
        Bu varlık için sektörel akran karşılaştırma verisi bulunamadı.
      </div>
    );
  }

  const cleanSymbol = symbol.replace('.IS', '').replace('^', '');
  const currencySymbol = data.peers[0]?.currency || '₺';

  return (
    <div className="space-y-6">
      {/* Sektör Başlığı ve Değerleme Özeti */}
      <div className="bg-slate-900/70 rounded-2xl p-6 border border-slate-800 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">{data.targetTicker} Sektörel Akran Karşılaştırması</h3>
              <p className="text-slate-400 text-xs">Sektör: <span className="text-purple-400 font-bold">{data.sectorName}</span></p>
            </div>
          </div>

          {data.valuationAssessment && (
            <div className="p-3 bg-purple-950/40 border border-purple-800/40 rounded-xl max-w-md">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 mb-1">
                <Sparkles size={14} className="text-purple-400" />
                <span>Akran Değerleme Sentezi</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {data.valuationAssessment.summary}
              </p>
            </div>
          )}
        </div>

        {/* Sektör Medyan / Ortalama Çarpan Kartları */}
        {data.sectorAverage && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-center">
              <div className="text-[10px] text-slate-400 mb-0.5 font-semibold">Sektör Ort. F/K</div>
              <div className="text-lg font-mono font-bold text-white">{data.sectorAverage.pe?.toFixed(1) || '-'}x</div>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-center">
              <div className="text-[10px] text-slate-400 mb-0.5 font-semibold">Sektör Ort. PD/DD</div>
              <div className="text-lg font-mono font-bold text-white">{data.sectorAverage.pb?.toFixed(2) || '-'}x</div>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-center">
              <div className="text-[10px] text-slate-400 mb-0.5 font-semibold">Sektör Ort. FD/FAVÖK</div>
              <div className="text-lg font-mono font-bold text-white">{data.sectorAverage.evebitda?.toFixed(1) || '-'}x</div>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-center">
              <div className="text-[10px] text-slate-400 mb-0.5 font-semibold">Sektör Ort. ROE</div>
              <div className="text-lg font-mono font-bold text-emerald-400">%{data.sectorAverage.roe?.toFixed(1) || '-'}</div>
            </div>
          </div>
        )}

        {/* Akran Tablosu */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-3.5 py-3">Sembol & Şirket</th>
                <th className="px-3 py-3 text-right">Fiyat</th>
                <th className="px-3 py-3 text-right">F/K</th>
                <th className="px-3 py-3 text-right">PD/DD</th>
                <th className="px-3 py-3 text-right">FD/FAVÖK</th>
                <th className="px-3 py-3 text-right">Net Marj</th>
                <th className="px-3 py-3 text-right">ROE</th>
                <th className="px-3 py-3 text-right">Cari Oran</th>
                <th className="px-3 py-3 text-right">Net Borç/FAVÖK</th>
                <th className="px-3.5 py-3 text-right">1Y Getiri</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
              {data.peers.map((p) => {
                const isSelected = p.symbol.toUpperCase() === cleanSymbol || p.isCurrentStock;
                return (
                  <tr 
                    key={p.symbol} 
                    className={`transition-colors ${
                      isSelected 
                        ? 'bg-purple-950/30 font-bold border-l-2 border-purple-500' 
                        : 'hover:bg-slate-800/30'
                    }`}
                  >
                    <td className="px-3.5 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-black ${isSelected ? 'text-purple-400' : 'text-white'}`}>
                          {p.symbol}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1 py-0.2 rounded border border-purple-500/30">
                            Aktif
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{p.name}</div>
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-slate-200">
                      {p.currentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currencySymbol}
                    </td>
                    <td className={`px-3 py-3 text-right font-mono ${p.pe < 10 ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {p.pe.toFixed(1)}x
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-slate-300">
                      {p.pb.toFixed(2)}x
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-slate-300">
                      {p.evebitda.toFixed(1)}x
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-slate-300">
                      %{p.netMargin.toFixed(1)}
                    </td>
                    <td className={`px-3 py-3 text-right font-mono ${p.roe > 25 ? 'text-emerald-400' : 'text-slate-300'}`}>
                      %{p.roe.toFixed(1)}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-slate-300">
                      {p.currentRatio.toFixed(2)}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-slate-300">
                      {p.netDebtToEbitda.toFixed(2)}x
                    </td>
                    <td className={`px-3.5 py-3 text-right font-mono font-bold ${p.return1Y >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {p.return1Y >= 0 ? '+' : ''}%{p.return1Y.toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/60">
          <span className="flex items-center gap-1">
            <ShieldCheck size={13} className="text-emerald-400" />
            Sektör akran verileri son 4 çeyreklik kümülatif finansallara dayanmaktadır.
          </span>
          <span className="text-slate-500">Çarpan Güncelliği: Son Bilanço & Günlük Kapanış</span>
        </div>
      </div>
    </div>
  );
};

export default PeerComparisonTab;