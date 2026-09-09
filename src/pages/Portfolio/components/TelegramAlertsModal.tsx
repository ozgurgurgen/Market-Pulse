import React, { useState } from 'react';
import { X, Send, Bell, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface TelegramAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TelegramAlertsModal: React.FC<TelegramAlertsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Bildirim Ayarları
  const [notifyDrop, setNotifyDrop] = useState(true);
  const [notifyGain, setNotifyGain] = useState(true);
  const [notifyDrawdown, setNotifyDrawdown] = useState(true);
  const [notifyAI, setNotifyAI] = useState(true);

  if (!isOpen) return null;

  const handleTestNotification = async () => {
    if (!botToken || !chatId) {
      setTestStatus({ success: false, message: 'Lütfen Telegram Bot Token ve Chat ID girin.' });
      return;
    }

    setIsTesting(true);
    setTestStatus(null);
    try {
      const res = await fetch('/api/portfolio/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken,
          chatId,
          message: `<b>MarketPulse AI — Portföy Bildirim Motoru</b>\n\n🟢 Test bildirimi başarıyla bağlandı!\n\n<i>Günlük %3+ düşüş/yükseliş ve kritik AI önerileri bu kanaldan iletilecektir.</i>`,
        }),
      });
      const data = await res.json();
      setTestStatus(data);
    } catch (err: any) {
      setTestStatus({ success: false, message: err.message || 'Bağlantı hatası' });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <Bell size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Telegram Bildirim Ayarları</h3>
            <p className="text-xs text-slate-400">Portföy hareketlerini Telegram üzerinden anlık takip edin</p>
          </div>
        </div>

        <div className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Telegram Bot Token</label>
            <input
              type="password"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              placeholder="Örn: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Telegram Chat ID</label>
            <input
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="Örn: 987654321 veya @kanal_adi"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Bildirim Seçenekleri */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-slate-400 font-semibold block">Bildirim Tetikleyicileri:</span>

            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 cursor-pointer">
              <span className="text-slate-300">🔴 Günlük Düşüş Eşiği (&gt; -%3)</span>
              <input
                type="checkbox"
                checked={notifyDrop}
                onChange={(e) => setNotifyDrop(e.target.checked)}
                className="accent-emerald-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 cursor-pointer">
              <span className="text-slate-300">🟢 Günlük Yükseliş Eşiği (&gt; +%3)</span>
              <input
                type="checkbox"
                checked={notifyGain}
                onChange={(e) => setNotifyGain(e.target.checked)}
                className="accent-emerald-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 cursor-pointer">
              <span className="text-slate-300">⚠️ Maksimum Drawdown Uyarısı (&gt; %15)</span>
              <input
                type="checkbox"
                checked={notifyDrawdown}
                onChange={(e) => setNotifyDrawdown(e.target.checked)}
                className="accent-emerald-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 cursor-pointer">
              <span className="text-slate-300">📊 Yüksek Güvenli AI Önerileri (ADD/REDUCE)</span>
              <input
                type="checkbox"
                checked={notifyAI}
                onChange={(e) => setNotifyAI(e.target.checked)}
                className="accent-emerald-500 rounded"
              />
            </label>
          </div>

          {testStatus && (
            <div
              className={`p-3 rounded-xl border flex items-center gap-2 text-xs ${
                testStatus.success
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {testStatus.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{testStatus.message}</span>
            </div>
          )}

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={handleTestNotification}
              disabled={isTesting}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send size={13} />
              {isTesting ? 'Gönderiliyor...' : 'Test Bildirimi Gönder'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-all cursor-pointer"
            >
              Tamam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
