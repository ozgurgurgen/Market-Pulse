import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  PieChart,
  Activity,
  CheckCircle2,
  TrendingDown,
  Info,
  Layers,
} from 'lucide-react';
import { PortfolioRiskMetrics } from '../../../types';

interface RiskPanelProps {
  riskMetrics: PortfolioRiskMetrics | null;
  baseCurrency: 'TRY' | 'USD';
}

export const RiskPanel: React.FC<RiskPanelProps> = ({ riskMetrics, baseCurrency }) => {
  if (!riskMetrics) {
    return (
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 text-center text-slate-500 text-xs">
        Risk analizi için henüz yeterli veri oluşmadı.
      </div>
    );
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'danger':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'warning':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'success':
      default:
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-6">
      {/* Başlık */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
          <ShieldCheck size={16} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Portföy Risk Analizi & İstatistiksel Metrikler</h3>
          <p className="text-[11px] text-slate-400">
            Volatilite, Sharpe, Sortino, VaR (%95) ve yoğunlaşma katsayısı analizi
          </p>
        </div>
      </div>

      {/* 6 Ana Risk Göstergesi */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Volatilite */}
        <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/70 text-center">
          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-1">
            <span>Yıllık Volatilite</span>
          </div>
          <div className="text-xl font-black text-amber-400">%{riskMetrics.volatility}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Eşik: &lt; %25</span>
        </div>

        {/* Sharpe Oranı */}
        <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/70 text-center">
          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-1">
            <span>Sharpe Oranı</span>
          </div>
          <div className={`text-xl font-black ${riskMetrics.sharpeRatio >= 1.0 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {riskMetrics.sharpeRatio}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Hedef: &gt; 1.0</span>
        </div>

        {/* Sortino Oranı */}
        <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/70 text-center">
          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-1">
            <span>Sortino Oranı</span>
          </div>
          <div className={`text-xl font-black ${riskMetrics.sortinoRatio >= 1.5 ? 'text-emerald-400' : 'text-blue-400'}`}>
            {riskMetrics.sortinoRatio}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Hedef: &gt; 1.5</span>
        </div>

        {/* Max Drawdown */}
        <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/70 text-center">
          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-1">
            <span>Max Drawdown</span>
          </div>
          <div className={`text-xl font-black ${riskMetrics.maxDrawdown <= 15 ? 'text-emerald-400' : 'text-rose-400'}`}>
            -%{riskMetrics.maxDrawdown}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Limit: &lt; %15</span>
        </div>

        {/* Beta */}
        <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/70 text-center">
          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-1">
            <span>Piyasa Betası</span>
          </div>
          <div className="text-xl font-black text-cyan-400">{riskMetrics.beta}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">0.8 - 1.2 dengeli</span>
        </div>

        {/* VaR 95% */}
        <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/70 text-center">
          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-1">
            <span>Günlük VaR (%95)</span>
          </div>
          <div className="text-xl font-black text-rose-300">%{riskMetrics.valueAtRisk95}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Günde maks kayıp</span>
        </div>
      </div>

      {/* Varlık Sınıfı Dağılım Barları ve Çeşitlendirme */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Varlık Dağılımı */}
        <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <PieChart size={14} className="text-emerald-400" />
              Varlık Sınıfı Ağırlık Dağılımı
            </span>
            <span className="text-slate-400">Toplam 100%</span>
          </div>

          <div className="space-y-2 text-xs">
            {riskMetrics.assetClassAllocation.map((item) => (
              <div key={item.class} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">{item.label}</span>
                  <span className="text-white font-bold">%{item.percentage}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Konsantrasyon ve Çeşitlendirme */}
        <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Layers size={14} className="text-blue-400" />
              Yoğunlaşma & Çeşitlendirme Skoru
            </span>
            <span className="text-emerald-400 font-bold">{riskMetrics.diversificationScore}/100</span>
          </div>

          <div className="space-y-3 text-xs pt-1">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400">İlk 3 Varlık Konsantrasyonu:</span>
              <span className="font-bold text-white">%{riskMetrics.topHoldingsConcentration}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400">Herfindahl-Hirschman (HHI):</span>
              <span className="font-bold text-white">{riskMetrics.herfindahlIndex}</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              HHI endeksi 1500 altında olduğunda portföy ideal derecede çeşitlendirilmiş sayılır.
            </p>
          </div>
        </div>
      </div>

      {/* Risk Uyarıları ve Aksiyon Önerileri */}
      {riskMetrics.warnings && riskMetrics.warnings.length > 0 && (
        <div className="space-y-3">
          <span className="text-xs font-bold text-white block">Risk Denetim Raporu & Tavsiyeler</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {riskMetrics.warnings.map((w, idx) => (
              <div
                key={idx}
                className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/70 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{w.metric}</span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getSeverityBadge(w.severity)}`}>
                    {w.formattedValue} ({w.threshold})
                  </span>
                </div>
                <p className="text-slate-300 text-[11px]">{w.message}</p>
                <p className="text-emerald-400/90 text-[11px] font-medium pt-1 border-t border-slate-700/40">
                  💡 Öneri: {w.suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
