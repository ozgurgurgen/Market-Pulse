import React from 'react';
import { X, Sparkles, Crown, CheckCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { PricingSection } from './PricingSection';
import { SubscriptionTier } from '../../shared/subscriptionPlans';
import { useSubscription } from '../../hooks/useSubscription';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetFeature?: string;
  requiredTier?: SubscriptionTier;
}

const FEATURE_TITLES: Record<string, string> = {
  opportunity_scanner: 'AI Fırsat Radarı & Sinyal Analizleri',
  opportunityScanner: 'AI Fırsat Radarı & Sinyal Analizleri',
  ipo_tracker: 'Halka Arz (IPO) Derinlemesine Analiz',
  ipo_financials: 'Halka Arz Finansal & Bilanço Analizi',
  ipo_structural: 'Halka Arz Taahhüt & Tahsisat Detayları',
  ipo_alpha: 'Halka Arz Alfa & Endeks Performansı',
  ipo_demand: 'Halka Arz Talep ve Katılım Verileri',
  whatIfSimulator: 'What-If Değerleme Simülatörü',
  advancedStockMetrics: 'Gelişmiş Hisse & Hedef Fiyat Metrikleri',
  tefas_advanced: 'TEFAS Fon & İleri Düzey Analitikler',
};

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  targetFeature,
  requiredTier,
}) => {
  const { tier, isAdmin, refreshSubscription } = useSubscription();

  if (!isOpen) return null;

  const isAlreadyPremium = tier === 'premium';
  const friendlyFeatureName = targetFeature 
    ? (FEATURE_TITLES[targetFeature] || targetFeature.replace(/_/g, ' '))
    : undefined;

  const handleSync = async () => {
    await refreshSubscription();
    onClose();
  };

  return (
    <div 
      id="upgrade-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="upgrade-modal-dialog"
        className="relative w-full max-w-6xl max-h-[92vh] bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-y-auto custom-scrollbar p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          id="btn-close-upgrade-modal"
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-400 hover:text-white transition-all z-30"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User is Admin or already on Premium status message */}
        {isAdmin ? (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-emerald-300 text-xs sm:text-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold block sm:inline">Yönetici (Admin) Hesabı: </span>
                <span>Sistem yöneticisi olduğunuz için herhangi bir pakete tabi değilsiniz. Tüm özellikler, analizler ve veriler sınırsız olarak kullanımınıza açıktır.</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-2 text-xs transition-all shrink-0 shadow-lg shadow-emerald-600/20 cursor-pointer"
            >
              Pencereyi Kapat
            </button>
          </div>
        ) : isAlreadyPremium ? (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-emerald-300 text-xs sm:text-sm">
            <div className="flex items-center gap-3">
              <Crown className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold block sm:inline">Hesabınız Premium Paketindedir: </span>
                <span>Tüm özellikler ve sinyal radarı üyeliğinize tam erişimle dahildir.</span>
              </div>
            </div>
            <button
              onClick={handleSync}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-2 text-xs transition-all shrink-0 shadow-lg shadow-emerald-600/20 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Verileri Yenile ve Kapat
            </button>
          </div>
        ) : (
          /* Feature Specific Alert if opened via a locked feature */
          friendlyFeatureName && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-300 text-xs sm:text-sm">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold">Özel Özellik: </span>
                <span>
                  <strong>{friendlyFeatureName}</strong> özelliğini kullanabilmek için lütfen üyeliğinizi yükseltin.
                </span>
              </div>
            </div>
          )
        )}

        {/* Pricing Component */}
        <PricingSection 
          highlightTier={requiredTier} 
          isModalView={true} 
          onPlanSelected={() => {
            // keep modal open with success feedback
          }} 
        />
      </div>
    </div>
  );
};
