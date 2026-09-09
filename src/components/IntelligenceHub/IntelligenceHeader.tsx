import React from 'react';
import { RefreshCw, Send, CheckCircle2, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

interface IntelligenceHeaderProps {
  ticker: string;
  assetName?: string;
  price?: number;
  lastUpdated: string;
  countdown: number;
  isRefreshing: boolean;
  onRefresh: () => void;
  telegramConfigured: boolean;
  onTestTelegram: () => void;
  isTestingTelegram: boolean;
  telegramTestResult: { success: boolean; mode: 'LIVE' | 'SIMULATED'; message: string } | null;
}

export const IntelligenceHeader: React.FC<IntelligenceHeaderProps> = ({
  ticker,
  assetName,
  price,
  lastUpdated,
  countdown,
  isRefreshing,
  onRefresh,
  telegramConfigured,
  onTestTelegram,
  isTestingTelegram,
  telegramTestResult,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Sol Taraf: Başlık & Varlık Bilgisi */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-emerald-500 to-indigo-500 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Finansal İstihbarat Merkezi
                </h1>
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  4 Özel AI Ajanı
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  v1.0 Canlı Radar
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Seçili Varlık: <span className="text-white font-bold">{ticker}</span>
                {assetName && <span className="text-slate-400"> — {assetName}</span>}
                {price !== undefined && (
                  <span className="text-emerald-400 font-mono font-bold ml-2">
                    {price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Sağ Taraf: Canlı Durum, 15dk Sayacı, Yenile ve Telegram */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full lg:w-auto justify-start lg:justify-end">
          
          {/* Canlı Gösterge & Countdown */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="text-[11px] text-slate-300">
              <span className="font-semibold text-white">Canlı İstihbarat</span>
              <span className="text-slate-500 mx-1">•</span>
              <span className="text-slate-400">{countdown}s sonra</span>
            </div>
          </div>

          {/* Telegram Alarm Butonu */}
          <button
            type="button"
            id="test-telegram-btn"
            onClick={onTestTelegram}
            disabled={isTestingTelegram}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              telegramConfigured
                ? 'bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border-sky-500/30'
                : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
            }`}
            title="Telegram bildirim testini çalıştır"
          >
            <Send size={13} className={isTestingTelegram ? 'animate-spin text-sky-400' : 'text-sky-400'} />
            <span>{isTestingTelegram ? 'Gönderiliyor...' : 'Telegram Test'}</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700">
              {telegramConfigured ? 'Bot Aktif' : 'Simüle'}
            </span>
          </button>

          {/* Manuel Yenile Butonu */}
          <button
            type="button"
            id="refresh-intelligence-btn"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-100 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-all cursor-pointer shadow-sm shadow-emerald-950"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'Taranıyor...' : 'Hemen Yenile'}</span>
          </button>
        </div>

      </div>

      {/* Telegram Test Sonucu Bildirimi (Varsa) */}
      {telegramTestResult && (
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
            <span>{telegramTestResult.message}</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
            Eşik: Etki Puanı ≥ 7.0
          </span>
        </div>
      )}
    </div>
  );
};
