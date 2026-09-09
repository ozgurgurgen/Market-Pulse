import React, { useState, useEffect } from 'react';
import { X, Sparkles, Flame, TrendingUp, ShieldCheck } from 'lucide-react';
import { OpportunitySignal, TefasFund } from '../types';
import { safeFetchJson } from '../utils/apiClient';

interface TefasAiRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFund: (fund: TefasFund) => void;
}

export const TefasAiRadarModal: React.FC<TefasAiRadarModalProps> = ({ isOpen, onClose, onSelectFund }) => {
  const [opportunities, setOpportunities] = useState<OpportunitySignal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      safeFetchJson<{ opportunities: OpportunitySignal[] }>('/api/ai/tefas-opportunities').then(({ data, ok }) => {
        if (ok && data?.opportunities) {
          setOpportunities(data.opportunities);
        }
        setLoading(false);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                AI TEFAS Fon Radarı
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Flame size={10} className="inline mr-1" /> FIRSAT AVCISI
                </span>
              </h2>
              <p className="text-xs text-slate-400">Yapay Zeka destekli enflasyon üzeri getiri sağlayan fon taraması</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Sparkles className="w-12 h-12 text-emerald-500 animate-pulse mb-4" />
              <p className="text-emerald-400 font-medium">Yapay Zeka fon verilerini analiz ediyor...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {opportunities.map((opp) => (
                <div key={opp.id} className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl hover:border-emerald-500/30 transition-all cursor-pointer" onClick={() => {
                  onSelectFund({ code: opp.symbol, name: opp.name } as any);
                  onClose();
                }}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-emerald-400 text-lg">{opp.symbol}</h3>
                      <p className="text-slate-300 text-sm font-medium line-clamp-1">{opp.name}</p>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center">
                      <span className="text-[10px] text-emerald-400 font-medium">Güven Skoru</span>
                      <span className="text-lg font-black text-emerald-300">%{opp.confidenceScore}</span>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 p-2 rounded">
                      <TrendingUp size={14} className="text-amber-400" />
                      <span>{opp.strategy}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 p-2 rounded">
                      <ShieldCheck size={14} className="text-blue-400" />
                      <span>Kısa Özet: {opp.summary}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs border-t border-slate-800 pt-3">
                    <div>
                      <span className="block text-slate-500 mb-0.5">Fiyat</span>
                      <span className="text-slate-200 font-medium font-mono">{opp.currentPrice}₺</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 mb-0.5">Hedef</span>
                      <span className="text-emerald-400 font-bold font-mono">{opp.targetPrice1}₺</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 mb-0.5">Risk/Ödül</span>
                      <span className="text-slate-300 font-medium font-mono">{opp.riskRewardRatio}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
