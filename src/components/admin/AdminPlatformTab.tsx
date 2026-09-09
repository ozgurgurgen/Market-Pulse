import React, { useState } from 'react';
import { 
  Settings, 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2,
  Activity,
  Layers
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { testFirestoreConnection } from '../../services/firebaseClient';

interface Props {
  onRefreshData?: () => void;
}

export const AdminPlatformTab: React.FC<Props> = ({ onRefreshData }) => {
  const [brandName, setBrandName] = useState('MarketPulse AI');
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const [dbStatus, setDbStatus] = useState<{ testing: boolean; message: string; success?: boolean }>({
    testing: false,
    message: ''
  });
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleTestDatabase = async () => {
    setDbStatus({ testing: true, message: 'Firestore ve Yerel Bellek bağlantısı test ediliyor...' });
    try {
      const res = await testFirestoreConnection();
      if (res.success) {
        setDbStatus({
          testing: false,
          message: `Firestore veritabanı bağlantısı başarıyla doğrulandı (${res.latencyMs}ms).`,
          success: true
        });
      } else {
        setDbStatus({
          testing: false,
          message: 'Firestore bağlantı uyarısı: ' + (res.error || res.message),
          success: false
        });
      }
    } catch (err: any) {
      setDbStatus({
        testing: false,
        message: 'Firestore bağlantı hatası: ' + err.message,
        success: false
      });
    }
  };

  const handleClearCache = async () => {
    if (!window.confirm('Tüm sunucu ve istemci önbelleği temizlensin mi?')) return;
    try {
      localStorage.removeItem('marketpulse_quotes_cache');
      localStorage.removeItem('marketpulse_intelligence_cache');
      setSaveStatus('Önbellek başarıyla temizlendi.');
      if (onRefreshData) onRefreshData();
      setTimeout(() => setSaveStatus(null), 3000);
    } catch {}
  };

  return (
    <div id="admin-platform-tab" className="space-y-6">
      
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <Settings className="text-indigo-400" size={20} />
          Platform, Marka ve Veritabanı Yönetimi
        </h2>
        <p className="text-xs text-slate-400">
          Uygulama genel ayarlarını, veritabanı sağlık kontrollerini ve sistem önbelleğini yönetin.
        </p>
      </div>

      {saveStatus && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{saveStatus}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Brand & Platform Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Layers className="text-indigo-400" size={16} />
            Genel Marka ve Kayıt Ayarları
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Platform Başlığı</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Yeni Kullanıcı Kayıtları</span>
                  <span className="text-[11px] text-slate-500">Kayıt ekranını açık tut veya durdur</span>
                </div>
                <input
                  type="checkbox"
                  checked={allowRegistration}
                  onChange={(e) => setAllowRegistration(e.target.checked)}
                  className="w-4 h-4 accent-indigo-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Bakım Modu (Maintenance Mode)</span>
                  <span className="text-[11px] text-slate-500">Normal kullanıcılar için bakım ekranı göster</span>
                </div>
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="w-4 h-4 accent-rose-500 rounded"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Database Health & Cache Tools */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Database className="text-emerald-400" size={16} />
            Veritabanı & Sistem Sağlığı
          </h3>

          <div className="space-y-3">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Bulut Firestore Sağlık Testi</span>
                <button
                  type="button"
                  onClick={handleTestDatabase}
                  disabled={dbStatus.testing}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {dbStatus.testing ? <RefreshCw className="animate-spin" size={13} /> : <Activity size={13} />}
                  Test Et
                </button>
              </div>

              {dbStatus.message && (
                <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 border ${
                  dbStatus.success
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-800 text-rose-300'
                }`}>
                  {dbStatus.success ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                  <span>{dbStatus.message}</span>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-300 block">Sistem Önbelleğini Temizle</span>
                <span className="text-[11px] text-slate-500">Piyasa kotalarını ve rapor önbelleğini sıfırla</span>
              </div>
              <button
                type="button"
                onClick={handleClearCache}
                className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 size={13} />
                Temizle
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
