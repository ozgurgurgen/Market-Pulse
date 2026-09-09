import React from 'react';
import { Lock, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { SubscriptionTier, SUBSCRIPTION_PLANS } from '../../shared/subscriptionPlans';

interface FeatureLockOverlayProps {
  children?: React.ReactNode;
  isLocked: boolean;
  requiredTier?: SubscriptionTier;
  title?: string;
  description?: string;
  onUpgradeClick?: () => void;
  badgeLabel?: string;
  className?: string;
}

export const FeatureLockOverlay: React.FC<FeatureLockOverlayProps> = ({
  children,
  isLocked,
  requiredTier = 'pro',
  title,
  description,
  onUpgradeClick,
  badgeLabel,
  className = '',
}) => {
  if (!isLocked) {
    return <>{children}</>;
  }

  const targetPlan = SUBSCRIPTION_PLANS[requiredTier] || SUBSCRIPTION_PLANS.pro;
  const displayTitle = title || `${targetPlan.name} Paketi ile Kilidi Açın`;
  const displayDescription = description || `Bu gelişmiş analitik modülü ${targetPlan.name} ve üzeri üyelere sunulmaktadır.`;

  const handleUpgradeClick = () => {
    if (onUpgradeClick) {
      onUpgradeClick();
    } else {
      window.dispatchEvent(new CustomEvent('marketpulse-open-upgrade-modal', {
        detail: { targetFeature: displayTitle, requiredTier }
      }));
    }
  };

  return (
    <div id="feature-lock-container" className={`relative overflow-hidden rounded-xl ${className}`}>
      {/* Blurred background content */}
      <div className="filter blur-[4px] pointer-events-none select-none opacity-40 transition-all duration-300">
        {children}
      </div>

      {/* Lock Overlay */}
      <div 
        id="feature-lock-overlay-content"
        className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-900/60 via-slate-950/85 to-slate-950/95 backdrop-blur-[2px] text-center transition-all animate-fadeIn"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center mb-3.5 shadow-lg shadow-amber-500/10">
          <Lock className="w-6 h-6 text-amber-400 animate-pulse" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3 h-3 text-amber-400" />
          {badgeLabel || `${targetPlan.name.toUpperCase()} ÖZELLİĞİ`}
        </div>

        <h4 className="text-lg font-bold text-white mb-1.5 max-w-md">
          {displayTitle}
        </h4>

        <p className="text-xs text-slate-300 max-w-sm mb-4 leading-relaxed">
          {displayDescription}
        </p>

        <button
          id="btn-feature-lock-upgrade"
          type="button"
          onClick={handleUpgradeClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 transition-all transform active:scale-95"
        >
          <Zap className="w-3.5 h-3.5 fill-slate-950" />
          <span>{targetPlan.name} Planına Yükselt</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Anında Erişim
          </span>
          <span className="text-slate-600">•</span>
          <span>Dilediğiniz Zaman İptal</span>
        </div>
      </div>
    </div>
  );
};
