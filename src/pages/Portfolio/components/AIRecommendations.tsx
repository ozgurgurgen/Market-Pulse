import React from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  MinusCircle, 
  PlusCircle, 
  AlertTriangle, 
  ShieldCheck, 
  HelpCircle,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { PortfolioAIRecommendation } from '../../../types';

interface AIRecommendationsProps {
  recommendations: PortfolioAIRecommendation[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  recommendations,
  isLoading,
  onRefresh,
}) => {
  const getActionBadge = (action: PortfolioAIRecommendation['action']) => {
    switch (action) {
      case 'ADD':
      case 'BUY':
        return {
          label: action === 'ADD' ? 'AĞIRLIK ARTIR (ADD)' : 'GÜÇLÜ AL (BUY)',
          bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
          icon: <PlusCircle size={14} className="text-emerald-400" />,
        };
      case 'REDUCE':
      case 'SELL':
        return {
          label: action === 'REDUCE' ? 'AĞIRLIK AZALT (REDUCE)' : 'KÂR AL / SAT (SELL)',
          bg: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
          icon: <MinusCircle size={14} className="text-rose-400" />,
        };
      case 'HOLD':
      default:
        return {
          label: 'POZİSYONU KORU (HOLD)',
          bg: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
          icon: <ShieldCheck size={14} className="text-blue-400" />,
        };
    }
  };

  const getRegimeBadge = (regime: PortfolioAIRecommendation['marketRegime']) => {
    switch (regime) {
      case 'BULL':
        return <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">🟢 Boğa Rejimi</span>;
      case 'BEAR':
        return <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">🔴 Ayı Rejimi</span>;
      case 'SIDEWAYS':
      default:
        return <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">🟡 Yatay Bant</span>;
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-4">
      {/* Başlık ve Yenileme */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Yapay Zekâ Destekli Portföy Önerileri & Dinamik Ağırlık</h3>
            <p className="text-[11px] text-slate-400">Teknik göstergeler, ADX rejim tespiti ve portföy risk kısıtları sentezi</p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw size={13} className={isLoading ? 'animate-spin text-emerald-400' : ''} />
          {isLoading ? 'Analiz Ediliyor...' : 'Önerileri Güncelle'}
        </button>
      </div>

      {/* Öneri Kartları Grid */}
      {recommendations.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-xs">
          Portföyde varlık bulunmadığından yapay zekâ önerisi üretilemedi.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec) => {
            const badge = getActionBadge(rec.action);

            return (
              <div
                key={rec.ticker}
                className="bg-slate-800/50 border border-slate-700/70 hover:border-slate-600 rounded-2xl p-4 transition-all space-y-3 relative overflow-hidden"
              >
                {/* Kart Üst Başlık */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-white">{rec.ticker}</span>
                      {getRegimeBadge(rec.marketRegime)}
                    </div>
                    {rec.name && <p className="text-xs text-slate-400 line-clamp-1">{rec.name}</p>}
                  </div>

                  <div className={`px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 shadow-sm ${badge.bg}`}>
                    {badge.icon}
                    <span>{badge.label}</span>
                  </div>
                </div>

                {/* Gerekçe Metni */}
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                  {rec.reason}
                </div>

                {/* Sinyal Skoru ve Ağırlık Karşılaştırması */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-700/50 text-xs">
                  <div>
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span>Sinyal Motoru Skoru:</span>
                      <span className="font-bold text-white">{rec.currentScore}/100</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          rec.currentScore >= 70
                            ? 'bg-emerald-400'
                            : rec.currentScore >= 45
                            ? 'bg-blue-400'
                            : 'bg-rose-400'
                        }`}
                        style={{ width: `${rec.currentScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span>Ağırlık (Mevcut → Hedef):</span>
                      <span className="font-bold text-slate-200">
                        %{rec.currentWeight} → <span className="text-emerald-400 font-extrabold">%{rec.suggestedWeight}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <span>AI Güven:</span>
                      <span className="font-bold text-emerald-300">%{rec.confidence}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Yasal Uyarı */}
      <div className="flex items-center gap-2 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-amber-300/80 text-[11px]">
        <AlertTriangle size={14} className="shrink-0 text-amber-400" />
        <span>
          <strong>Önemli Uyarı:</strong> Burada sunulan yapay zekâ analizleri ve sinyal motoru değerlendirmeleri yalnızca bilgilendirme ve istatistiksel simülasyon amaçlıdır. Hiçbir şekilde yatırım tavsiyesi (YTD) niteliği taşımaz.
        </span>
      </div>
    </div>
  );
};
