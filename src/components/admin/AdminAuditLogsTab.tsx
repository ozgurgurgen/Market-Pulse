import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  RefreshCw, 
  Trash2, 
  Clock, 
  ChevronDown, 
  ChevronRight,
  CheckCircle2,
  XCircle,
  X
} from 'lucide-react';
import { AuditLogEntry } from '../../types';
import { safeFetchJson } from '../../utils/apiClient';

interface Props {
  logs: AuditLogEntry[];
  onRefreshLogs: () => void;
  isRefreshing: boolean;
}

export const AdminAuditLogsTab: React.FC<Props> = ({
  logs,
  onRefreshLogs,
  isRefreshing
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActionFilter, setSelectedActionFilter] = useState<string>('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
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

  const handleClearAuditLogs = async () => {
    setIsClearing(true);
    setShowConfirmModal(false);
    try {
      const res = await safeFetchJson<{ success: boolean; message?: string }>('/api/admin/audit-logs', {
        method: 'DELETE'
      });
      if (res.ok) {
        showNotification('success', 'Tüm denetim kayıtları başarıyla silindi ve veritabanı temizlendi.');
        onRefreshLogs();
      } else {
        showNotification('error', 'Denetim kayıtları temizlenemedi: ' + (res.error || 'Sunucu hatası'));
      }
    } catch (err: any) {
      showNotification('error', 'Denetim kayıtları silinirken hata oluştu: ' + (err.message || 'Bilinmeyen hata'));
    } finally {
      setIsClearing(false);
    }
  };

  const handleDeleteSingleLog = async (e: React.MouseEvent, logId: string) => {
    e.stopPropagation();
    if (!logId) return;

    setDeletingId(logId);
    try {
      const res = await safeFetchJson<{ success: boolean; message?: string }>(`/api/admin/audit-logs/${encodeURIComponent(logId)}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        showNotification('success', 'Denetim kaydı başarıyla silindi.');
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

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'MANUAL_SUBSCRIPTION_GRANT':
        return { label: '🎁 Paket Tanımlama', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      case 'CHANGE_USER_ROLE':
        return { label: '🛡️ Rol Değişimi', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
      case 'UPDATE_SUBSCRIPTION_PLANS':
        return { label: '👑 Paket İnce Ayar', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' };
      case 'UPDATE_AI_SETTINGS':
        return { label: '🤖 AI Model Ayarı', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'RESET_USER_USAGE':
        return { label: '🔄 Kota Sıfırlama', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'SUSPEND_USER':
      case 'ACTIVATE_USER':
        return { label: '⛔ Hesap Durumu', color: 'bg-slate-700 text-slate-300 border-slate-600' };
      default:
        return { label: action, color: 'bg-slate-800 text-slate-400 border-slate-700' };
    }
  };

  const filteredLogs = logs.filter((log) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q || 
      (log.adminEmail && log.adminEmail.toLowerCase().includes(q)) ||
      (log.targetId && log.targetId.toLowerCase().includes(q)) ||
      (log.details && log.details.toLowerCase().includes(q)) ||
      log.action.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (selectedActionFilter !== 'all' && log.action !== selectedActionFilter) return false;
    return true;
  });

  return (
    <div id="admin-audit-logs-view" className="space-y-6">
      
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

      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <FileText className="text-amber-400" size={20} />
              Sistem ve Yönetici Denetim Kayıtları ({logs.length})
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Yöneticiler tarafından gerçekleştirilen tüm rol, paket, kota ve AI ayar değişiklikleri değiştirilemez şekilde kayıt altına alınır.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
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
              disabled={isClearing || logs.length === 0}
              className="px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold rounded-xl border border-amber-500/40 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Trash2 size={14} />
              {isClearing ? 'Temizleniyor...' : 'Kayıtları Temizle'}
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Admin e-posta, hedef UID veya işlem detayı ara..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <select
            value={selectedActionFilter}
            onChange={(e) => setSelectedActionFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Tüm Eylemler ({logs.length})</option>
            <option value="MANUAL_SUBSCRIPTION_GRANT">🎁 Paket Tanımlamaları</option>
            <option value="CHANGE_USER_ROLE">🛡️ Rol Değişimleri</option>
            <option value="UPDATE_SUBSCRIPTION_PLANS">👑 Paket İnce Ayarları</option>
            <option value="UPDATE_AI_SETTINGS">🤖 AI Model Ayarları</option>
            <option value="RESET_USER_USAGE">🔄 Kota Sıfırlamaları</option>
          </select>
        </div>
      </div>

      {/* Logs Timeline List */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-sm font-bold text-white">Kayıtlı Denetim Verisi Bulunmuyor</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Sistemde şu anda filtrelere uygun veya kayıtlı denetim verisi bulunmamaktadır.
            </p>
          </div>
        ) : (
          filteredLogs.map((log, index) => {
            const badge = getActionBadge(log.action);
            const isExpanded = expandedLogId === (log.id || String(index));
            const logKey = log.id || String(index);
            const isDeletingThis = deletingId === log.id;

            return (
              <div 
                key={logKey}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all"
              >
                <div 
                  onClick={() => setExpandedLogId(isExpanded ? null : logKey)}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer hover:bg-slate-850/50 transition-colors"
                >
                  <div className="flex items-start md:items-center gap-3 flex-1 min-w-0">
                    <button className="text-slate-500 p-1 mt-0.5 md:mt-0 shrink-0">
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.color}`}>
                          {badge.label}
                        </span>
                        <span className="text-xs font-bold text-white">
                          {log.adminEmail || 'Sistem'}
                        </span>
                        {log.targetId && (
                          <span className="text-[11px] text-slate-400 font-mono">
                            Hedef: {log.targetId}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed break-words">
                        {log.details}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 text-[11px] text-slate-400 font-mono shrink-0 pl-8 md:pl-0">
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-slate-500" />
                      {new Date(log.timestamp).toLocaleString('tr-TR')}
                    </span>

                    {log.id && (
                      <button
                        onClick={(e) => handleDeleteSingleLog(e, log.id!)}
                        disabled={isDeletingThis}
                        className="p-1.5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                        title="Bu denetim kaydını sil"
                      >
                        {isDeletingThis ? (
                          <RefreshCw size={13} className="animate-spin text-rose-400" />
                        ) : (
                          <Trash2 size={13} />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Details / Diff Inspector */}
                {isExpanded && (log.oldValue || log.newValue || log.ipAddress) && (
                  <div className="p-4 bg-slate-950 border-t border-slate-800/80 space-y-3 text-xs font-mono">
                    {log.ipAddress && (
                      <div className="text-[11px] text-slate-400">
                        IP Adresi: <span className="text-slate-200">{log.ipAddress}</span>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {log.oldValue && (
                        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                          <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider block">Önceki Değer (Old Value)</span>
                          <pre className="text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap max-h-40">
                            {typeof log.oldValue === 'object' ? JSON.stringify(log.oldValue, null, 2) : String(log.oldValue)}
                          </pre>
                        </div>
                      )}
                      {log.newValue && (
                        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Yeni Değer (New Value)</span>
                          <pre className="text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap max-h-40">
                            {typeof log.newValue === 'object' ? JSON.stringify(log.newValue, null, 2) : String(log.newValue)}
                          </pre>
                        </div>
                      )}
                    </div>
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
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trash2 size={24} />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white">
                Tüm Denetim Kayıtlarını Temizle
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kayıtlı <strong className="text-amber-300">{logs.length} adet</strong> sistem ve yönetici denetim kaydı veritabanından kalıcı olarak silinecek. Devam etmek istiyor musunuz?
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
                onClick={handleClearAuditLogs}
                disabled={isClearing}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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
