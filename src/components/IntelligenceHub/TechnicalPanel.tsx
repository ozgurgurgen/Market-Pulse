import React from 'react';
import { Activity, Gauge, TrendingUp, TrendingDown, Layers, BarChart2, ShieldAlert, Cpu, CheckCircle2 } from 'lucide-react';
import { IntelligenceTechnicalResult } from '../../types';

interface TechnicalPanelProps {
  technical: IntelligenceTechnicalResult;
  isLoading: boolean;
}

export const TechnicalPanel: React.FC<TechnicalPanelProps> = ({ technical, isLoading }) => {
  const { indicators, technical_score, interpretation, rawSignalEngineResult } = technical;

  const getScoreColor = (score: number) => {
    if (score >= 70) return { text: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-500/30', status: 'GÜÇLÜ BOĞA (AL)' };
    if (score >= 50) return { text: 'text-cyan-400', bg: 'bg-cyan-500', border: 'border-cyan-500/30', status: 'ILIMLI POZİTİF' };
    if (score >= 35) return { text: 'text-amber-400', bg: 'bg-amber-500', border: 'border-amber-500/30', status: 'NÖTR / DENGELİ' };
    return { text: 'text-rose-400', bg: 'bg-rose-500', border: 'border-rose-500/30', status: 'GÜÇSÜZ / SAT' };
  };

  const scoreConfig = getScoreColor(technical_score);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col h-full shadow-md space-y-4">
      {/* Panel Başlığı */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Activity size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Teknik İndikatör & Momentum Radarı
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 flex items-center gap-1">
                <Cpu size={10} />
                SignalEngine v2 Entegre
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Tek ve tutarlı kompozit skorlama (RSI, MACD, Bollinger, Stochastic, ATR, EMA)</p>
          </div>
        </div>
      </div>

      {/* 0-100 Genel Teknik Skor Göstergesi */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Gauge size={16} className={scoreConfig.text} />
            <span className="font-bold text-slate-200">SignalEngine v2 Kompozit Skoru</span>
          </div>
          <div className="flex items-center gap-2">
            {rawSignalEngineResult?.signalLabel && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-950/70 text-indigo-300 border border-indigo-700/50">
                {rawSignalEngineResult.signalLabel}
              </span>
            )}
            <span className={`text-xs font-black px-2 py-0.5 rounded-md border ${scoreConfig.border} ${scoreConfig.text} bg-slate-900`}>
              {scoreConfig.status}
            </span>
            <span className={`text-xl font-black font-mono ${scoreConfig.text}`}>
              {technical_score}<span className="text-xs text-slate-500">/100</span>
            </span>
          </div>
        </div>

        {/* Skor Barı */}
        <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            style={{ width: `${Math.max(5, Math.min(100, technical_score))}%` }}
            className={`h-full ${scoreConfig.bg} transition-all duration-700 rounded-full`}
          />
        </div>

        {/* Özet Yorum */}
        <p className="text-xs text-slate-300 pt-1 leading-relaxed border-t border-slate-900">
          💡 {interpretation}
        </p>

        {/* SignalEngine v2 Ek Parametreleri (Rejim, Divergence, R/R) */}
        {rawSignalEngineResult && (
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-900 text-[11px]">
            <div className="bg-slate-900/60 p-1.5 rounded text-center">
              <span className="text-slate-500 block">Piyasa Rejimi</span>
              <span className="font-bold text-slate-200">{rawSignalEngineResult.regime || 'DENGELİ'}</span>
            </div>
            <div className="bg-slate-900/60 p-1.5 rounded text-center">
              <span className="text-slate-500 block">ADX Gücü</span>
              <span className="font-bold text-slate-200">{rawSignalEngineResult.adx?.adx || 24.5}</span>
            </div>
            <div className="bg-slate-900/60 p-1.5 rounded text-center">
              <span className="text-slate-500 block">Risk/Ödül</span>
              <span className="font-bold text-emerald-400">{rawSignalEngineResult.riskRewardRatio || '1:2.4'}</span>
            </div>
          </div>
        )}
      </div>

      {/* 6 İndikatör Kartı (Responsive Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* 1. RSI (14) */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-400">RSI (14)</span>
            <span className={`font-mono font-black text-sm ${indicators.RSI.value >= 70 ? 'text-amber-400' : indicators.RSI.value <= 30 ? 'text-emerald-400' : 'text-slate-200'}`}>
              {indicators.RSI.value}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
            {indicators.RSI.signal}
          </p>
        </div>

        {/* 2. MACD (12, 26, 9) */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-400">MACD (12,26,9)</span>
            <span className="font-mono text-xs font-bold text-slate-300">
              Histo: <span className={indicators.MACD.histogram >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{indicators.MACD.histogram}</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
            {indicators.MACD.signal}
          </p>
        </div>

        {/* 3. Bollinger Bands (20, 2) */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-400">Bollinger (20,2)</span>
            <span className="font-mono text-xs font-bold text-slate-300">
              Genişlik: %{indicators.Bollinger.bandwidthPct}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
            {indicators.Bollinger.signal}
          </p>
        </div>

        {/* 4. Stochastic Oscillator */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-400">Stochastic (14,3)</span>
            <span className="font-mono text-xs font-bold text-cyan-300">
              %K:{indicators.Stochastic.K} / %D:{indicators.Stochastic.D}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
            {indicators.Stochastic.signal}
          </p>
        </div>

        {/* 5. ATR (14) - Volatilite */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-400">ATR (14) Volatilite</span>
            <span className="font-mono text-xs font-bold text-amber-300">
              %{indicators.ATR.atrPct}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
            {indicators.ATR.signal}
          </p>
        </div>

        {/* 6. EMA (20 & 50) */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-400">EMA (20 / 50)</span>
            <span className="font-mono text-[11px] font-bold text-slate-300">
              {indicators.EMA.EMA20 > indicators.EMA.EMA50 ? (
                <span className="text-emerald-400">EMA20 &gt; EMA50</span>
              ) : (
                <span className="text-rose-400">EMA20 &lt; EMA50</span>
              )}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
            {indicators.EMA.signal}
          </p>
        </div>
      </div>
    </div>
  );
};
