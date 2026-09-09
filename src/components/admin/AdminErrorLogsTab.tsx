import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Search, 
  RefreshCw, 
  Trash2, 
  Clock, 
  Terminal, 
  ChevronDown, 
  ChevronRight,
  Globe,
  CheckCircle2,
  XCircle,
  X
} from 'lucide-react';
import { ErrorLogEntry } from '../../types';
import { safeFetchJson } from '../../utils/apiClient';

interface Props {
  errorLogs: ErrorLogEntry[];
  onRefreshLogs: () => void;
  isRefreshing: boolean;
}

export const AdminErrorLogsTab: React.FC<Props> = ({
  errorLogs,
  onRefreshLogs,
  isRefreshing
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  const handleClearErrorLogs = async () => {
    setIsClearing(true);
    setShowConfirmModal(false);
    try {
      const res = await safeFetchJson<{ success: boolean; message?: string }>('/api/admin/error-logs', {
        method: 'DELETE'
      });

      if (res.ok) {
        showNotification('success', 'Tüm hata logları başarıyla silindi ve veritabanı temizlendi.');
        onRefreshLogs();
      } else {
        showNotification('error', 'Hata logları temizlenemedi: ' + (res.error || 'Sunucu hatası'));
      }
    } catch (err: any) {
      showNotification('error', 'Hata logları silinirken bağlantı hatası oluştu: ' + (err.message || 'Bilinmeyen hata'));
    } finally {
      setIsClearing(false);
    }
  };

  const handleDeleteSingleLog = async (e: React.MouseEvent, logId: string) => {
    e.stopPropagation();
    if (!logId) return;

    setDeletingId(logId);
    try {
      const res = await safeFetchJson<{ success: boolean; message?: string }>(`/api/admin/error-logs/${encodeURIComponent(logId)}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        showNotification('success', 'Hata kaydı başarıyla silindi.');
        onRefreshLogs();
      } else {
        showNotification('error', 'Kayıt silinemedi: ' + (res.error || 'Sunucu hatası'));
      }
    } catch (err: any) {
      showNotification('error', 'Silme işlemi sırasında hata: ' + (err.message || 'Bilinmeyen hata'));
    } finally {
      setDeletingId(null);
    }
  };

  const filteredLogs = errorLogs.filter((log) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      (log.message && log.message.toLowerCase().includes(q)) ||
      (log.context && log.context.toLowerCase().includes(q)) ||
      (log.path && log.path.toLowerCase().includes(q)) ||
      (log.userEmail && log.userEmail.toLowerCase().includes(q))
    );
  });

  return (
    <div id="admin-error-logs-view" className="space-y-6">
      
      {/* Feedback Banner */}
      {feedback && (
        <div 
          className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200 ${
            feedback.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            <span>{feedback.message}</span>
          </div>
          <button 
            onClick={() => setFeedback(null)} 
            className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="text-rose-400" size={20} />
              Sistem Hata Logları ({errorLogs.length})
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Program genelinde (API rotaları, veritabanı, işlem motorları) oluşan tüm hatalar ve istisnalar otomatik olarak veritabanına kaydedilir.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                const testMsg = `[TestKonsolHatası] Admin panelinden test hatası tetiklendi (${new Date().toLocaleTimeString('tr-TR')})`;
                console.error(new Error(testMsg));
                setTimeout(() => onRefreshLogs(), 600);
              }}
              className="px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold rounded-xl border border-amber-500/40 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Konsola test hatası yazdırır ve kaydeder"
            >
              <Terminal size={14} />
              Test Hatası Ekle
            </button>

            <button
              onClick={onRefreshLogs}
              disabled={isRefreshing}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              Yenile
            </button>

            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={isClearing || errorLogs.length === 0}
              className="px-3.5 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold rounded-xl border border-rose-500/40 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Trash2 size={14} />
              {isClearing ? 'Temizleniyor...' : 'Logları Temizle'}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Hata mesajı, bağlam (context), URL veya kullanıcı ara..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Error List */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-sm font-bold text-white">Kayıtlı Hata Bulunmuyor</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Sistemde şu ana kadar kaydedilmiş herhangi bir istisna veya hata raporu bulunmamaktadır. Tüm loglar temizlendi.
            </p>
          </div>
        ) : (
          filteredLogs.map((log, index) => {
            const logKey = log.id || String(index);
            const isExpanded = expandedId === logKey;
            const isDeletingThis = deletingId === log.id;

            return (
              <div
                key={logKey}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all shadow-md space-y-2"
              >
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : logKey)}
                  className="flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wide">
                        {log.context || 'ERROR'}
                      </span>
                      {log.method && log.path && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                          <Globe size={11} className="text-cyan-400" />
                          {log.method} {log.path}
                        </span>
                      )}
                      {log.userEmail && (
                        <span className="text-[11px] text-slate-400 font-medium">
                          Kullanıcı: <span className="text-slate-200">{log.userEmail}</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-mono text-rose-200 break-words leading-relaxed">
                      {log.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 text-slate-400">
                    <span className="text-[11px] flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(log.timestamp).toLocaleString('tr-TR')}
                    </span>
                    
                    {log.id && (
                      <button
                        onClick={(e) => handleDeleteSingleLog(e, log.id!)}
                        disabled={isDeletingThis}
                        className="p-1.5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                        title="Bu hata kaydını sil"
                      >
                        {isDeletingThis ? (
                          <RefreshCw size={13} className="animate-spin text-rose-400" />
                        ) : (
                          <Trash2 size={13} />
                        )}
                      </button>
                    )}

                    {log.stack ? (
                      <span className="p-1">
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </span>
                    ) : null}
                  </div>
                </div>

                {isExpanded && log.stack && (
                  <div className="pt-3 border-t border-slate-800 mt-2 space-y-1.5 animate-in fade-in duration-150">
                    <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                      <Terminal size={12} className="text-amber-400" />
                      Stack Trace
                    </div>
                    <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[10px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap max-h-60">
                      {log.stack}
                    </pre>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Trash2 size={24} />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white">
                Tüm Hata Loglarını Temizle
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kayıtlı <strong className="text-rose-300">{errorLogs.length} adet</strong> hata ve istisna raporu veritabanından kalıcı olarak silinecek. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isClearing}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                onClick={handleClearErrorLogs}
                disabled={isClearing}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isClearing ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    Siliniyor...
                  </>
                ) : (
                  <>
                    <Trash2 size={13} />
                    Evet, Tümünü Temizle
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
