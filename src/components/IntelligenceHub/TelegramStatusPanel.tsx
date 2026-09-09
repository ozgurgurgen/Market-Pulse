import React from 'react';
import { Send, CheckCircle2, AlertTriangle, ShieldCheck, Clock, Bell, Radio } from 'lucide-react';

interface TelegramStatusPanelProps {
  configured: boolean;
  onTestTelegram: () => void;
  isTesting: boolean;
  history: Array<{
    id: string;
    ticker: string;
    title: string;
    impact_score: number;
    severity: string;
    sentAt: string;
    status: 'SENT' | 'SIMULATED' | 'FAILED';
  }>;
}

export const TelegramStatusPanel: React.FC<TelegramStatusPanelProps> = ({
  configured,
  onTestTelegram,
  isTesting,
  history,
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-md space-y-4">
      {/* Panel Başlığı */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Send size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Telegram Entegrasyonu & Alarm Merkezi
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${configured ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'}`}>
                {configured ? 'Canlı Bot' : 'Simüle Alarm'}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Etki puanı ≥ 7.0 olan gelişmeler için anlık bildirim</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onTestTelegram}
          disabled={isTesting}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
        >
          <Send size={12} className={isTesting ? 'animate-spin' : ''} />
          <span>{isTesting ? 'İletiliyor...' : 'Test Bildirimi Gönder'}</span>
        </button>
      </div>

      {/* Durum Bilgi Kartı */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 space-y-1">
          <span className="text-slate-400 text-[11px] font-medium">Bağlantı Modu</span>
          <div className="flex items-center gap-1.5 font-bold text-white">
            <Radio size={13} className={configured ? 'text-emerald-400 animate-pulse' : 'text-slate-400'} />
            <span>{configured ? 'Telegram Bot Canlı' : 'Simülasyon Defteri'}</span>
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 space-y-1">
          <span className="text-slate-400 text-[11px] font-medium">Tetikleme Eşiği</span>
          <div className="flex items-center gap-1.5 font-bold text-amber-400 font-mono">
            <span>⚡ Etki Puanı ≥ 7.0</span>
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 space-y-1">
          <span className="text-slate-400 text-[11px] font-medium">Toplam Alarm Kaydı</span>
          <div className="flex items-center gap-1.5 font-bold text-sky-400 font-mono">
            <Bell size={13} />
            <span>{history.length} Bildirim</span>
          </div>
        </div>
      </div>

      {/* Son Gönderilen Alarmlar Günlüğü */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Clock size={13} className="text-slate-400" />
          Son İletilen Bildirim Günlüğü
        </h4>

        {history.length === 0 ? (
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-4 text-center text-xs text-slate-400">
            Henüz alarm iletilmedi. "Test Bildirimi Gönder" butonunu kullanarak bağlantıyı doğrulayabilirsiniz.
          </div>
        ) : (
          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
            {history.map((rec) => (
              <div
                key={rec.id}
                className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-400">{rec.ticker}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                      ⚡ {rec.impact_score}/10
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${rec.status === 'SENT' ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                      {rec.status === 'SENT' ? 'İLETİLDİ' : 'SİMÜLE'}
                    </span>
                  </div>
                  <p className="text-slate-300 truncate">{rec.title}</p>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                  {new Date(rec.sentAt).toLocaleTimeString('tr-TR')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
