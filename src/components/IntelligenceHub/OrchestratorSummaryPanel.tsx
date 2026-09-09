import React from 'react';
import { Network, GitCompare, ShieldAlert, Sparkles, AlertOctagon, CheckCircle, BellRing, Info } from 'lucide-react';
import { IntelligenceCrossSignal, IntelligenceKeyDevelopment } from '../../types';

interface OrchestratorSummaryPanelProps {
  summary: string;
  crossSignals: IntelligenceCrossSignal[];
  keyDevelopments: IntelligenceKeyDevelopment[];
  disclaimer: string;
  isLoading: boolean;
}

export const OrchestratorSummaryPanel: React.FC<OrchestratorSummaryPanelProps> = ({
  summary,
  crossSignals,
  keyDevelopments,
  disclaimer,
  isLoading,
}) => {
  const getSeverityBadge = (severity: IntelligenceKeyDevelopment['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
            🔴 KRİTİK
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
            🟠 YÜKSEK
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            🟡 ORTA
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            ⚪ DÜŞÜK
          </span>
        );
    }
  };

  const getCrossSignalConfig = (sig: IntelligenceCrossSignal['signal']) => {
    switch (sig) {
      case 'DIVERGENCE':
        return {
          bg: 'bg-amber-950/40 border-amber-800/80 text-amber-300',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: GitCompare,
        };
      case 'STRONG':
        return {
          bg: 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: Sparkles,
        };
      case 'WEAK':
        return {
          bg: 'bg-slate-950/40 border-slate-800 text-slate-300',
          badgeBg: 'bg-slate-800 text-slate-400 border-slate-700',
          icon: AlertOctagon,
        };
      default:
        return {
          bg: 'bg-cyan-950/40 border-cyan-800/80 text-cyan-300',
          badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          icon: CheckCircle,
        };
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-md space-y-4">
      {/* Başlık */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Network size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Organizatör & Çapraz Analiz Sentezi
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                OrchestratorAgent
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">3 Ajanın çıktısını harmanlayan nihai istihbarat özeti</p>
          </div>
        </div>
      </div>

      {/* Doğal Dil Sentezlenmiş Özet Kartı */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
          <Sparkles size={14} />
          <span>Bileşik Durum Raporu (Yapay Zeka Konsensüsü)</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
          {summary}
        </p>
      </div>

      {/* Çapraz Sinyaller (Cross-Analysis) */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <GitCompare size={13} className="text-cyan-400" />
          Çapraz İstihbarat Sinyalleri
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {crossSignals.map((sig, idx) => {
            const config = getCrossSignalConfig(sig.signal);
            const Icon = config.icon;

            return (
              <div
                key={idx}
                className={`border rounded-xl p-3 space-y-1.5 ${config.bg}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Icon size={14} />
                    <span className="text-xs font-bold text-white">{sig.title}</span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${config.badgeBg}`}>
                    {sig.signal}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {sig.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Önem Derecesine Göre Kritik Gelişmeler */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <BellRing size={13} className="text-amber-400" />
            Önem Derecesine Göre Sıralı Gelişmeler
          </h4>
          <span className="text-[10px] text-slate-400">
            Etki Puanı ≥ 7.0 Telegram'a Otomatik İletilir
          </span>
        </div>

        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
          {keyDevelopments.slice(0, 5).map((dev, idx) => (
            <div
              key={idx}
              className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {getSeverityBadge(dev.severity)}
                  <span className="font-mono text-[10px] text-amber-400 font-bold">
                    ⚡ {dev.impact_score}/10
                  </span>
                  {dev.notify && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-950 text-sky-300 border border-sky-800">
                      Telegram Alarmı
                    </span>
                  )}
                </div>
                <p className="font-medium text-slate-200">{dev.title}</p>
                {dev.details && (
                  <p className="text-[11px] text-slate-400 line-clamp-1">{dev.details}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zorunlu Yasal Uyarı / Disclaimer */}
      <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-200/90">
        <ShieldAlert size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300">Yasal Bilgilendirme: </span>
          <span>{disclaimer}</span>
        </div>
      </div>
    </div>
  );
};
