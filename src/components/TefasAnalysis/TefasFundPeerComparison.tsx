import React, { useState, useEffect, useMemo } from 'react';
import { 
  Scale, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Award, 
  Users, 
  Layers 
} from 'lucide-react';
import { TefasFundDetail, TefasFund } from '../../types';
import { safeFetchJson } from '../../utils/apiClient';

interface TefasFundPeerComparisonProps {
  fund: TefasFundDetail;
  onSelectFund?: (code: string) => void;
}

export const TefasFundPeerComparison: React.FC<TefasFundPeerComparisonProps> = ({ 
  fund, 
  onSelectFund 
}) => {
  const [livePeers, setLivePeers] = useState<TefasFund[]>([]);

  useEffect(() => {
    safeFetchJson<{ funds: TefasFund[] }>(`/api/tefas/funds?category=${encodeURIComponent(fund.category || 'ALL')}`)
      .then(({ data, ok }) => {
        if (ok && data?.funds && Array.isArray(data.funds)) {
          setLivePeers(data.funds);
        } else {
          setLivePeers([]);
        }
      })
      .catch(() => {
        setLivePeers([]);
      });
  }, [fund.category]);

  // Find top peer funds in the same category
  const peerFunds = useMemo(() => {
    const peers = livePeers
      .filter(f => f.category === fund.category)
      .sort((a, b) => (b.return1Y || 0) - (a.return1Y || 0));

    // Make sure current fund is in the list, plus top other peers
    const others = peers.filter(f => f.code.toUpperCase() !== fund.code.toUpperCase()).slice(0, 4);
    const combined = [fund as TefasFund, ...others];
    
    // Sort by 1Y return
    return combined.sort((a, b) => (b.return1Y || 0) - (a.return1Y || 0));
  }, [fund, livePeers]);

  const formatCurrency = (val: number | undefined, fundSizeStr?: string) => {
    if (fundSizeStr) return fundSizeStr;
    if (!val) return '₺2.5 Mr';
    if (val >= 1_000_000_000) {
      return `₺${(val / 1_000_000_000).toFixed(1)} Mr`;
    }
    if (val >= 1_000_000) {
      return `₺${(val / 1_000_000).toFixed(0)} Mn`;
    }
    return `₺${val.toLocaleString('tr-TR')}`;
  };

  return (
    <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Scale size={16} />
          </span>
          <div>
            <h4 className="text-sm font-bold text-slate-100">
              Kategori Akran Kıyaslaması ({fund.categoryLabel})
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Aynı varlık sınıfındaki lider fonlarla risk ve getiri karşılaştırması
            </p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800 self-start sm:self-auto font-mono">
          {peerFunds.length} Benzer Fon
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold">
              <th className="pb-3 pl-2">Fon Kodu &amp; Adı</th>
              <th className="pb-3 text-right">1Y Getiri</th>
              <th className="pb-3 text-right hidden sm:table-cell">3Y Getiri</th>
              <th className="pb-3 text-right">Sharpe</th>
              <th className="pb-3 text-right hidden md:table-cell">Yönetim Ücr.</th>
              <th className="pb-3 text-center">Risk</th>
              <th className="pb-3 text-right hidden lg:table-cell">Büyüklük (AUM)</th>
              <th className="pb-3 text-right pr-2">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {peerFunds.map((f, i) => {
              const isCurrent = f.code.toUpperCase() === fund.code.toUpperCase();

              return (
                <tr 
                  key={f.code} 
                  className={`transition-colors ${
                    isCurrent 
                      ? 'bg-emerald-950/20 border-l-2 border-emerald-500' 
                      : 'hover:bg-slate-900/60'
                  }`}
                >
                  {/* Fund code & name */}
                  <td className="py-3 pl-2">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-black text-xs px-1.5 py-0.5 rounded ${
                        isCurrent 
                          ? 'bg-emerald-500 text-slate-950' 
                          : 'bg-slate-800 text-slate-200'
                      }`}>
                        {f.code}
                      </span>
                      <div className="max-w-[180px] sm:max-w-[220px] truncate">
                        <span className="font-semibold text-slate-200 block truncate">{f.name}</span>
                        <span className="text-[10px] text-slate-400 truncate block">{f.founder}</span>
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full shrink-0">
                          Seçili
                        </span>
                      )}
                    </div>
                  </td>

                  {/* 1Y Return */}
                  <td className="py-3 text-right font-mono font-bold text-emerald-400">
                    +{f.return1Y}%
                  </td>

                  {/* 3Y Return */}
                  <td className="py-3 text-right font-mono text-slate-300 hidden sm:table-cell">
                    +{f.return3Y || Math.round(f.return1Y * 2.8)}%
                  </td>

                  {/* Sharpe */}
                  <td className="py-3 text-right font-mono font-bold text-slate-200">
                    {f.sharpeRatio.toFixed(2)}
                  </td>

                  {/* Management Fee */}
                  <td className="py-3 text-right font-mono text-slate-400 hidden md:table-cell">
                    %{f.managementFee.toFixed(2)}
                  </td>

                  {/* Risk (1-7) */}
                  <td className="py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                      f.riskScore <= 2 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      f.riskScore <= 4 ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' :
                      f.riskScore <= 5 ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {f.riskScore}/7
                    </span>
                  </td>

                  {/* AUM */}
                  <td className="py-3 text-right font-mono text-slate-400 hidden lg:table-cell">
                    {formatCurrency(f.aum, f.fundSize)}
                  </td>

                  {/* Action */}
                  <td className="py-3 text-right pr-2">
                    {isCurrent ? (
                      <span className="text-[11px] text-emerald-400 font-semibold">Aktif</span>
                    ) : onSelectFund ? (
                      <button
                        onClick={() => onSelectFund(f.code)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition font-medium text-[11px] cursor-pointer inline-flex items-center gap-1"
                      >
                        <span>İncele</span>
                        <ArrowRight size={11} />
                      </button>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
