import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Share, PlusSquare, X, Bell, ShieldCheck, Sparkles } from 'lucide-react';

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  const isIframe = typeof window !== 'undefined' && window.self !== window.top;
  const isDesktop = typeof window !== 'undefined' && window.innerWidth > 768;

  useEffect(() => {
    if (isIframe || isDesktop) return;
    try {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setNotificationPermission(Notification.permission);
      }

      // 1. Check if running in Standalone (PWA) Mode safely
      let isInPWA = false;
      if (typeof window !== 'undefined') {
        const isMatchMediaPWA = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
        const isNavStandalone = (window.navigator as any)?.standalone === true;
        const isAndroidApp = typeof document !== 'undefined' && document.referrer ? document.referrer.includes('android-app://') : false;
        isInPWA = Boolean(isMatchMediaPWA || isNavStandalone || isAndroidApp);
      }
      setIsStandalone(isInPWA);

      // 2. Check if iOS Safari
      const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
      const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
      setIsIOS(isIosDevice);

      // 3. Check dismiss status from localStorage safely
      let dismissed = false;
      try {
        dismissed = localStorage.getItem('marketpulse_pwa_prompt_dismissed') === 'true';
      } catch (e) {
        // Safe catch for iframe sandboxes blocking localStorage
      }

      // 4. Capture beforeinstallprompt for Android / Chromium
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        if (!isInPWA && !dismissed) {
          setShowPrompt(true);
        }
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      if (isIosDevice && !isInPWA && !dismissed) {
        setShowPrompt(true);
      }

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    } catch (err) {
      console.warn('[PWAInstallPrompt] Initialization error caught safely:', err);
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    try {
      localStorage.setItem('marketpulse_pwa_prompt_dismissed', 'true');
    } catch (e) {
      // Safe catch
    }
  };

  const handleRequestNotification = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Tarayıcınız anlık bildirim özelliğini desteklemiyor.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        new Notification('MarketPulse AI Bildirimleri Aktif!', {
          body: 'Bilanço açıklamaları, tavan serisi uyarıları ve portföy sinyalleri anlık olarak cebinize iletilecektir.',
          icon: '/icons/icon-192.png'
        });
      }
    } catch (e) {
      console.error('Bildirim izni alınamadı', e);
    }
  };

  if (isStandalone) {
    return (
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-medium">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>PWA Uygulama Modu Aktif</span>
      </div>
    );
  }

  if (isIframe || isDesktop || !showPrompt) return null;

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 shadow-2xl shadow-cyan-950/50 text-slate-100 transition-all duration-300">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition"
          title="Kapat"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 p-2.5 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
            <Smartphone className="w-7 h-7 text-white" />
          </div>

          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Mağazasız Mobil Yükleme
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-100">MarketPulse'ı Telefonunuza Yükleyin</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Google Play / App Store gerekmeden, tek tıkla doğrudan ana ekranınıza ekleyin ve anlık borsa takibi yapın.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-3">
          {notificationPermission !== 'granted' && (
            <button
              onClick={handleRequestNotification}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 transition"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Bildirim İzni Ver</span>
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 font-medium transition"
            >
              Sonra
            </button>
            <button
              onClick={handleInstallClick}
              className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-xl shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition transform active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Telefonuma Yükle</span>
            </button>
          </div>
        </div>
      </div>

      {showIOSInstructions && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-slate-100 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowIOSInstructions(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                iOS
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-100">iPhone / iPad'e Yükleme</h3>
                <p className="text-xs text-slate-400">Safari tarayıcısı üzerinden 2 adımda ekleyin</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 font-bold">
                  1
                </div>
                <p className="text-slate-300">
                  Safari alt menüsündeki <span className="font-bold text-cyan-400 inline-flex items-center gap-1"><Share className="w-3.5 h-3.5" /> Paylaş</span> butonuna dokunun.
                </p>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 font-bold">
                  2
                </div>
                <p className="text-slate-300">
                  Açılan menüde aşağı kaydırıp <span className="font-bold text-emerald-400 inline-flex items-center gap-1"><PlusSquare className="w-3.5 h-3.5" /> Ana Ekrana Ekle</span> seçeneğine basın.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSInstructions(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition"
            >
              Anladım
            </button>
          </div>
        </div>
      )}
    </>
  );
};
