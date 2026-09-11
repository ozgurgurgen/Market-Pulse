import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Sparkles, 
  Zap, 
  Crown, 
  ShieldCheck, 
  ArrowRight, 
  Bot, 
  BarChart3, 
  LineChart, 
  Layers, 
  Clock, 
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Ticket,
  Percent,
  Coins,
  Tag
} from 'lucide-react';
import { 
  SUBSCRIPTION_PLANS, 
  SubscriptionTier, 
  SubscriptionPlanConfig 
} from '../../shared/subscriptionPlans';
import { useSubscription } from '../../hooks/useSubscription';
import { useAuth } from '../../contexts/AuthContext';
import { safeFetchJson } from '../../utils/apiClient';

interface PricingSectionProps {
  onPlanSelected?: (tier: SubscriptionTier) => void;
  highlightTier?: SubscriptionTier;
  isModalView?: boolean;
}

interface AppliedCouponInfo {
  code: string;
  discountType: 'percentage' | 'fixed_try';
  discountValue: number;
  applicableTiers?: SubscriptionTier[];
  message: string;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onPlanSelected,
  highlightTier,
  isModalView = false,
}) => {
  const { tier: currentTier, subscription, usage, isAdmin, plans } = useSubscription();
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [requestStatus, setRequestStatus] = useState<{
    tier?: SubscriptionTier;
    loading: boolean;
    success?: boolean;
    message?: string;
  }>({ loading: false });

  // Coupon Code state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCouponInfo | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const tiers: SubscriptionTier[] = ['free', 'starter', 'pro', 'premium'];

  const handleApplyCouponCode = async (codeToApply: string) => {
    const code = (codeToApply || '').trim().toUpperCase();
    if (!code) return;

    setIsValidatingCoupon(true);
    setCouponError(null);

    try {
      const res = await safeFetchJson<{
        success: boolean;
        valid: boolean;
        coupon?: {
          code: string;
          discountType: 'percentage' | 'fixed_try';
          discountValue: number;
          applicableTiers?: SubscriptionTier[];
          description?: string;
        };
        discountedPriceTRY: number;
        discountAmountTRY: number;
        message: string;
      }>('/api/subscription/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code
        })
      });

      if (res.ok && res.data?.valid && res.data.coupon) {
        setAppliedCoupon({
          code: res.data.coupon.code.toUpperCase(),
          discountType: res.data.coupon.discountType || 'percentage',
          discountValue: res.data.coupon.discountValue || 20,
          applicableTiers: res.data.coupon.applicableTiers || ['starter', 'pro', 'premium'],
          message: res.data.message || `"%${res.data.coupon.discountValue}" indirim kodu uygulandı.`
        });
        setCouponInput(code);
        setCouponError(null);
      } else {
        setCouponError(res.data?.message || 'Geçersiz veya süresi dolmuş indirim kodu.');
        setAppliedCoupon(null);
      }
    } catch (err: any) {
      setCouponError('Kupon doğrulama hatası: ' + err.message);
      setAppliedCoupon(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    await handleApplyCouponCode(couponInput);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError(null);
  };

  const handleSelectPlan = async (tier: SubscriptionTier, calculatedPriceTRY: number) => {
    if (tier === currentTier) return;

    if (onPlanSelected) {
      onPlanSelected(tier);
      return;
    }

    const currentPlans = plans || SUBSCRIPTION_PLANS;
    const planConfig = currentPlans[tier] || SUBSCRIPTION_PLANS[tier];

    setRequestStatus({ tier, loading: true });
    try {
      const res = await safeFetchJson('/api/subscription/request-upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestedTier: tier,
          billingCycle,
          couponCode: appliedCoupon?.code || undefined,
          discountedPriceTRY: calculatedPriceTRY,
          note: `${tier.toUpperCase()} paketi için kullanıcı talebi oluşturuldu.${appliedCoupon ? ` (Kupon: ${appliedCoupon.code})` : ''}`
        })
      });

      if (res && res.ok) {
        setRequestStatus({
          tier,
          loading: false,
          success: true,
          message: `${planConfig.name} paketi talebiniz alındı! Yönetici ekibimiz inceleyip yetkilendirmeyi yapacaktır.`
        });
      } else {
        setRequestStatus({
          tier,
          loading: false,
          success: false,
          message: 'Talep iletilirken bir sorun oluştu.'
        });
      }
    } catch (e: any) {
      setRequestStatus({
        tier,
        loading: false,
        success: false,
        message: e.message || 'İstek başarısız oldu.'
      });
    }
  };

  return (
    <div id="pricing-section-container" className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header / Intro */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <Crown className="w-3.5 h-3.5" />
          <span>Şeffaf & Esnek Üyelik Planları</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Yatırım Stratejinize Uygun Gücü Seçin
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Temel analizden derin yapay zeka istihbaratına ve What-If simülatörüne kadar her seviye için profesyonel araçlar.
        </p>

        {/* Billing Cycle Switch & Promo Code Row */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
          {/* Monthly / Annual Toggle */}
          <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex items-center shadow-inner">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Aylık Ödeme
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                billingCycle === 'annual'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Yıllık Ödeme</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                billingCycle === 'annual' ? 'bg-slate-950 text-amber-300' : 'bg-amber-500/20 text-amber-400'
              }`}>
                %20 İndirim
              </span>
            </button>
          </div>

          {/* Coupon Code Input & Status */}
          {appliedCoupon ? (
            <div className="flex items-center gap-2 bg-purple-950/40 border border-purple-500/40 py-1 px-3 rounded-xl shadow-inner animate-fadeIn">
              <Ticket size={14} className="text-purple-400 shrink-0" />
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-mono font-bold text-white bg-purple-900/60 px-2 py-0.5 rounded border border-purple-500/30">
                  {appliedCoupon.code}
                </span>
                <span className="text-purple-300 font-semibold">
                  {appliedCoupon.discountType === 'percentage' 
                    ? `(%${appliedCoupon.discountValue} İndirim Aktif)` 
                    : `(${appliedCoupon.discountValue} ₺ İndirim Aktif)`}
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="p-1 hover:bg-purple-900/60 text-purple-300 hover:text-white rounded-lg transition-colors cursor-pointer ml-1"
                title="Kuponu Kaldır"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner">
              <div className="flex items-center gap-1.5 px-2 text-slate-400">
                <Ticket size={14} className="text-purple-400" />
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="İndirim Kodu Girin..."
                  className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-mono font-bold w-36 uppercase"
                />
              </div>
              <button
                type="submit"
                disabled={isValidatingCoupon || !couponInput.trim()}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0 flex items-center gap-1"
              >
                {isValidatingCoupon ? 'Kontrol...' : 'Uygula'}
              </button>
            </form>
          )}
        </div>

        {/* Quick Sample Coupon Pills */}
        {!appliedCoupon && (
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
            <span className="text-slate-500">Hızlı Kodlar:</span>
            <button
              type="button"
              onClick={() => handleApplyCouponCode('BORSA2026')}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 hover:text-white transition-colors cursor-pointer"
            >
              <Tag size={10} />
              <span className="font-mono font-bold">BORSA2026</span>
              <span className="text-purple-400">(%25)</span>
            </button>
            <button
              type="button"
              onClick={() => handleApplyCouponCode('WELCOME50')}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 hover:text-white transition-colors cursor-pointer"
            >
              <Tag size={10} />
              <span className="font-mono font-bold">WELCOME50</span>
              <span className="text-purple-400">(100 ₺)</span>
            </button>
          </div>
        )}

        {/* Coupon Feedback Message */}
        {appliedCoupon && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs font-medium animate-fadeIn">
            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
            <span>Kupon Uygulandı (<strong>{appliedCoupon.code}</strong>): {appliedCoupon.message} Fiyatlar doğrudan indirimli olarak güncellendi.</span>
          </div>
        )}
        {couponError && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs font-medium animate-fadeIn">
            <AlertCircle size={14} className="text-rose-400 shrink-0" />
            <span>{couponError}</span>
          </div>
        )}
      </div>

      {/* Status banner if request submitted */}
      {requestStatus.message && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 max-w-2xl mx-auto text-sm animate-fadeIn ${
          requestStatus.success 
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
            : 'bg-red-950/40 border-red-500/40 text-red-300'
        }`}>
          {requestStatus.success ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span>{requestStatus.message}</span>
        </div>
      )}

      {/* Admin Exemption Banner */}
      {isAdmin && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3 text-emerald-300 text-sm max-w-4xl mx-auto shadow-lg">
          <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold">Yönetici (Admin) Hesabı: </span>
            <span>Sistem yöneticisi olduğunuz için herhangi bir pakete veya abonelik kısıtlamasına tabi değilsiniz. Aşağıdaki paketler platform kullanıcıları için belirlenen planlardır.</span>
          </div>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((t) => {
          const currentPlans = plans || SUBSCRIPTION_PLANS;
          const plan = currentPlans[t] || SUBSCRIPTION_PLANS[t];
          const isCurrent = !isAdmin && currentTier === t;
          const isTargetHighlight = highlightTier === t;
          const isPopular = plan.isPopular;

          // Check if coupon applies to this tier
          const isCouponApplicable = Boolean(
            appliedCoupon &&
            t !== 'free' &&
            plan.priceMonthlyTRY > 0 &&
            (!appliedCoupon.applicableTiers || 
              appliedCoupon.applicableTiers.length === 0 || 
              appliedCoupon.applicableTiers.some(tierName => {
                const normalized = (tierName || '').trim().toLowerCase();
                return normalized === t.toLowerCase() || normalized === 'all';
              }))
          );

          const baseMonthly = plan.priceMonthlyTRY || 0;
          const baseAnnual = plan.priceAnnualTRY || 0;

          // Calculate discounted monthly and annual values
          let discountedMonthly = baseMonthly;
          let discountedAnnual = baseAnnual;

          if (isCouponApplicable && appliedCoupon) {
            if (appliedCoupon.discountType === 'percentage') {
              const discountRatio = Math.min(100, Math.max(0, appliedCoupon.discountValue)) / 100;
              discountedMonthly = Math.max(0, Math.round(baseMonthly * (1 - discountRatio)));
              discountedAnnual = Math.max(0, Math.round(baseAnnual * (1 - discountRatio)));
            } else {
              // Fixed TRY coupon
              discountedMonthly = Math.max(0, baseMonthly - appliedCoupon.discountValue);
              discountedAnnual = Math.max(0, baseAnnual - (appliedCoupon.discountValue >= 200 ? appliedCoupon.discountValue : appliedCoupon.discountValue * 12));
            }
          }

          const displayMonthlyPrice = isCouponApplicable ? discountedMonthly : baseMonthly;
          const displayAnnualPrice = isCouponApplicable ? discountedAnnual : baseAnnual;

          const currentPricePerMonth = billingCycle === 'annual'
            ? (displayAnnualPrice > 0 ? Math.round(displayAnnualPrice / 12) : 0)
            : displayMonthlyPrice;

          const originalPricePerMonth = billingCycle === 'annual'
            ? (baseAnnual > 0 ? Math.round(baseAnnual / 12) : 0)
            : baseMonthly;

          const hasActiveDiscount = isCouponApplicable && (
            billingCycle === 'annual' 
              ? displayAnnualPrice < baseAnnual 
              : displayMonthlyPrice < baseMonthly
          );

          return (
            <div
              key={t}
              id={`pricing-card-${t}`}
              className={`relative rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${
                isPopular
                  ? 'bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-2 border-amber-500/60 shadow-xl shadow-amber-500/10 scale-[1.02]'
                  : isCurrent
                  ? 'bg-slate-900/90 border-2 border-emerald-500/50 shadow-lg'
                  : 'bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Badge on Top */}
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[11px] font-extrabold shadow-md uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-slate-950" />
                  {plan.badge || 'En Popüler'}
                </div>
              )}

              {isCurrent && !isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[11px] font-extrabold shadow-md uppercase tracking-wider">
                  Mevcut Planınız
                </div>
              )}

              <div>
                {/* Plan Header */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {t === 'premium' && <Crown className="w-4 h-4 text-purple-400" />}
                    {t === 'pro' && <Zap className="w-4 h-4 text-amber-400" />}
                    {plan.name}
                  </h3>
                  {plan.badge && !isPopular && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 min-h-[36px] mb-4">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="mb-6 pb-6 border-b border-slate-800">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    {hasActiveDiscount && (
                      <span className="text-lg font-bold text-slate-500 line-through">
                        ₺{originalPricePerMonth.toLocaleString('tr-TR')}
                      </span>
                    )}
                    <span className={`text-3xl font-extrabold ${hasActiveDiscount ? 'text-emerald-400' : 'text-white'}`}>
                      ₺{currentPricePerMonth.toLocaleString('tr-TR')}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      / ay
                    </span>
                    {hasActiveDiscount && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 ml-auto">
                        <Percent size={10} />
                        {appliedCoupon?.discountType === 'percentage' 
                          ? `-%${appliedCoupon.discountValue} Kupon` 
                          : `-${appliedCoupon?.discountValue} ₺`}
                      </span>
                    )}
                  </div>

                  {/* Subtitle / Annual Note */}
                  {billingCycle === 'annual' && baseAnnual > 0 && (
                    <div className="mt-1.5 space-y-0.5">
                      {hasActiveDiscount ? (
                        <p className="text-[11px] text-emerald-400 font-semibold">
                          Yıllık <span className="line-through text-slate-500">₺{baseAnnual.toLocaleString('tr-TR')}</span> yerine <span className="underline font-bold">₺{displayAnnualPrice.toLocaleString('tr-TR')}</span> faturalandırılır (₺{(baseAnnual - displayAnnualPrice).toLocaleString('tr-TR')} tasarruf)
                        </p>
                      ) : (
                        <p className="text-[11px] text-amber-400">
                          Yıllık ₺{baseAnnual.toLocaleString('tr-TR')} faturalandırılır
                        </p>
                      )}
                    </div>
                  )}

                  {billingCycle === 'monthly' && hasActiveDiscount && (
                    <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                      Kupon ile ayda ₺{(baseMonthly - displayMonthlyPrice).toLocaleString('tr-TR')} indirim uygulandı
                    </p>
                  )}

                  {plan.priceMonthlyTRY === 0 && (
                    <p className="text-[11px] text-slate-500 mt-1">
                      Süresiz ücretsiz kullanım
                    </p>
                  )}
                </div>

                {/* Feature Bullets */}
                <div className="space-y-2.5 mb-6">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Özellikler & Limitler
                  </p>
                  <ul className="space-y-2 text-xs">
                    {plan.featureBullets.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        {f.included ? (
                          <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            f.highlight ? 'text-amber-400 font-bold' : 'text-emerald-400'
                          }`} />
                        ) : (
                          <X className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
                        )}
                        <span className={
                          f.included 
                            ? (f.highlight ? 'text-white font-medium' : 'text-slate-300')
                            : 'text-slate-500 line-through'
                        }>
                          {f.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  id={`btn-plan-select-${t}`}
                  disabled={isAdmin || isCurrent || requestStatus.loading}
                  onClick={() => !isAdmin && handleSelectPlan(t, billingCycle === 'annual' ? displayAnnualPrice : displayMonthlyPrice)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    isAdmin
                      ? 'bg-slate-850 text-slate-300 border border-slate-700 hover:border-slate-600'
                      : isCurrent
                      ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-default'
                      : isPopular
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 shadow-lg shadow-orange-500/20 active:scale-95'
                      : t === 'premium'
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/20 active:scale-95'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 active:scale-95'
                  }`}
                >
                  {isAdmin ? (
                    <span>Paket Özellikleri</span>
                  ) : isCurrent ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Aktif Planınız</span>
                    </>
                  ) : requestStatus.loading && requestStatus.tier === t ? (
                    <span>İşleniyor...</span>
                  ) : (
                    <>
                      <span>
                        {t === 'free' ? 'Ücretsiz Başla' : hasActiveDiscount ? `${plan.name} İndirimli Seç` : `${plan.name}'a Geç`}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className="mt-12 bg-slate-900/60 rounded-2xl border border-slate-800 p-6 overflow-hidden">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-400" />
          <span>Detaylı Paket Karşılaştırma Matrisi</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-4 font-semibold">Özellik / Modül</th>
                <th className="py-3 px-3 font-semibold text-center">Ücretsiz</th>
                <th className="py-3 px-3 font-semibold text-center">Başlangıç</th>
                <th className="py-3 px-3 font-semibold text-center text-amber-400">Pro (Popüler)</th>
                <th className="py-3 px-3 font-semibold text-center text-purple-400">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-3 px-4 font-medium text-white">Günlük Analiz Sorguları</td>
                <td className="py-3 px-3 text-center text-slate-400">Günde 3 Adet</td>
                <td className="py-3 px-3 text-center text-emerald-400 font-bold">Sınırsız</td>
                <td className="py-3 px-3 text-center text-emerald-400 font-bold">Sınırsız</td>
                <td className="py-3 px-3 text-center text-emerald-400 font-bold">Sınırsız</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Finansal Rasyolar Derinliği</td>
                <td className="py-3 px-3 text-center text-slate-400">Temel (F/K, PD/DD)</td>
                <td className="py-3 px-3 text-center text-emerald-400">Tüm Rasyolar</td>
                <td className="py-3 px-3 text-center text-emerald-400">Tüm Rasyolar</td>
                <td className="py-3 px-3 text-center text-emerald-400">Tüm Rasyolar</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Backtest Süresi & Varlık Sayısı</td>
                <td className="py-3 px-3 text-center text-slate-400">1 Yıl / Tek Varlık</td>
                <td className="py-3 px-3 text-center text-slate-300">5 Yıl / Çoklu</td>
                <td className="py-3 px-3 text-center text-emerald-400 font-bold">Sınırsız / Çoklu</td>
                <td className="py-3 px-3 text-center text-emerald-400 font-bold">Sınırsız / Çoklu</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Haftalık/Günlük AI Raporları</td>
                <td className="py-3 px-3 text-center text-slate-400">1 Rapor / Hafta</td>
                <td className="py-3 px-3 text-center text-slate-300">3 Rapor / Gün</td>
                <td className="py-3 px-3 text-center text-emerald-400 font-bold">Sınırsız</td>
                <td className="py-3 px-3 text-center text-emerald-400 font-bold">Sınırsız + Öncelikli</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">What-If Değerleme Simülatörü</td>
                <td className="py-3 px-3 text-center"><X className="w-4 h-4 text-slate-600 mx-auto" /></td>
                <td className="py-3 px-3 text-center"><X className="w-4 h-4 text-slate-600 mx-auto" /></td>
                <td className="py-3 px-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto font-bold" /></td>
                <td className="py-3 px-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto font-bold" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">18 Kriterli Şirket Sağlık Karnesi</td>
                <td className="py-3 px-3 text-center text-slate-400">Özet Skor</td>
                <td className="py-3 px-3 text-center text-slate-300">Tam Detay</td>
                <td className="py-3 px-3 text-center text-emerald-400 font-bold">Tam Detay + CSV İndir</td>
                <td className="py-3 px-3 text-center text-emerald-400 font-bold">Tam Detay + CSV İndir</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">TEFAS Akran Kıyaslama & Sharpe</td>
                <td className="py-3 px-3 text-center"><X className="w-4 h-4 text-slate-600 mx-auto" /></td>
                <td className="py-3 px-3 text-center"><X className="w-4 h-4 text-slate-600 mx-auto" /></td>
                <td className="py-3 px-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto font-bold" /></td>
                <td className="py-3 px-3 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto font-bold" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Telegram İstihbarat & Botu</td>
                <td className="py-3 px-3 text-center text-slate-400">Fiyat Alarmları</td>
                <td className="py-3 px-3 text-center text-slate-300">Fiyat + Haber</td>
                <td className="py-3 px-3 text-center text-emerald-400 font-bold">Tam Komuta (/rapor, /portfoy)</td>
                <td className="py-3 px-3 text-center text-emerald-400 font-bold">Tam Komuta + VIP</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Portföy Varlık Kapasitesi</td>
                <td className="py-3 px-3 text-center text-slate-400">Maksimum 5 Varlık</td>
                <td className="py-3 px-3 text-center text-slate-300">Maksimum 20 Varlık</td>
                <td className="py-3 px-3 text-center text-emerald-400 font-bold">Sınırsız</td>
                <td className="py-3 px-3 text-center text-emerald-400 font-bold">Sınırsız Çoklu Hesap</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Çoklu Portföy Yönetimi</td>
                <td className="py-3 px-3 text-center"><X className="w-4 h-4 text-slate-600 mx-auto" /></td>
                <td className="py-3 px-3 text-center"><X className="w-4 h-4 text-slate-600 mx-auto" /></td>
                <td className="py-3 px-3 text-center"><X className="w-4 h-4 text-slate-600 mx-auto" /></td>
                <td className="py-3 px-3 text-center"><Check className="w-4 h-4 text-purple-400 mx-auto font-bold" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Info notice about current manual grant phase */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Ödeme altyapısı hazırlık aşamasındadır. Paket yükseltme talepleri yönetici tarafından anında onaylanmaktadır.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-mono text-slate-500">Mevcut Durum: {currentTier.toUpperCase()} ({subscription.status})</span>
        </div>
      </div>
    </div>
  );
};
