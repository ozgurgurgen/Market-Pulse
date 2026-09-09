import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, AlertTriangle } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      setShowRestored(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowRestored(true);
      const timer = setTimeout(() => {
        setShowRestored(false);
      }, 3500);
      return () => clearTimeout(timer);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (showRestored) {
    return (
      <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 bg-emerald-500/95 text-slate-950 font-semibold px-4 py-2 rounded-full shadow-lg shadow-emerald-950/40 border border-emerald-300 flex items-center gap-2 text-xs animate-in fade-in slide-in-from-top-2">
        <Wifi className="w-4 h-4 text-slate-950" />
        <span>İnternet Bağlantısı Yeniden Sağlandı — Canlı Veri Akışı Aktif</span>
      </div>
    );
  }

  if (!isOffline) return null;

  return (
    <div className="sticky top-0 z-50 bg-amber-500/90 text-slate-950 font-medium px-4 py-2.5 shadow-md flex items-center justify-center gap-2 text-xs text-center border-b border-amber-600/50 backdrop-blur-md">
      <WifiOff className="w-4 h-4 text-slate-950 shrink-0" />
      <span>
        <strong>Çevrimdışı Mod:</strong> Canlı fiyat güncellemeleri durduruldu. Son yüklenen veriler ve analizler görüntüleniyor.
      </span>
    </div>
  );
};
