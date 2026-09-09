import React, { useEffect } from 'react';
import { Lock } from 'lucide-react';
import { paywallConfig } from '../../config/paywallConfig';
import { useSubscription } from '../../hooks/useSubscription';

interface LockedFieldProps {
  mode: 'blur' | 'mask' | 'hidden';
  ctaText?: string;
  moduleName: string;
  onUpgradeClick?: () => void;
  children: React.ReactNode;
  isLocked: boolean;
  className?: string;
}

export const LockedField: React.FC<LockedFieldProps> = ({
  mode,
  ctaText = 'Pro\'ya Geçin',
  moduleName,
  onUpgradeClick,
  children,
  isLocked,
  className = ''
}) => {
  const { isAdmin, tier } = useSubscription();
  const effectiveLocked = (isAdmin || tier === 'premium') ? false : isLocked;

  useEffect(() => {
    if (effectiveLocked) {
      // Track impression
      console.log(`[Analytics] ${paywallConfig.ANALYTICS_EVENTS.IMPRESSION}`, { module: moduleName });
    }
  }, [effectiveLocked, moduleName]);

  const handleUpgradeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log(`[Analytics] ${paywallConfig.ANALYTICS_EVENTS.CLICK}`, { module: moduleName });
    if (onUpgradeClick) {
      onUpgradeClick();
    } else {
      window.dispatchEvent(new CustomEvent('marketpulse-open-upgrade-modal', {
        detail: { targetFeature: moduleName }
      }));
    }
  };

  if (!effectiveLocked) return <>{children}</>;

  if (mode === 'hidden') {
    return (
      <div className={`flex flex-col items-center justify-center p-6 border border-slate-800 rounded-xl bg-slate-900/50 ${className}`}>
        <Lock className="text-slate-500 mb-2" size={24} />
        <p className="text-sm text-slate-400 mb-4 text-center">{ctaText}</p>
        <button
          onClick={handleUpgradeClick}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-bold rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all"
        >
          Kilidi Aç
        </button>
      </div>
    );
  }

  return (
    <div className={`relative group overflow-hidden ${className}`}>
      {/* Underlying content with blur/mask */}
      <div className={`transition-all duration-300 ${mode === 'blur' ? 'blur-md opacity-40 select-none' : 'opacity-30 grayscale select-none pointer-events-none'}`}>
        {children}
      </div>
      
      {/* Lock Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/20 backdrop-blur-[2px]">
        <div className="bg-slate-900/90 border border-slate-700/50 p-4 rounded-xl shadow-2xl flex flex-col items-center transform transition-transform group-hover:scale-105 max-w-[80%] mx-auto text-center">
          <div className="bg-slate-800 p-2 rounded-full mb-2">
            <Lock size={16} className="text-cyan-400" />
          </div>
          <span className="text-[11px] font-semibold text-slate-200 mb-3">{ctaText}</span>
          <button
            onClick={handleUpgradeClick}
            className="px-4 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-[10px] uppercase tracking-wider font-bold rounded-lg shadow-lg shadow-cyan-900/50 hover:shadow-cyan-900/80 transition-all"
          >
            Yükselt
          </button>
        </div>
      </div>
    </div>
  );
};
