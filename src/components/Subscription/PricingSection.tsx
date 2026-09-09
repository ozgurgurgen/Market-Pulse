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
  MessageSquare
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

export const PricingSection: React.FC<PricingSectionProps> = ({
  onPlanSelected,
  highlightTier,
  isModalView = false,
}) => {
  const { tier: currentTier, subscription, usage, isAdmin } = useSubscription();
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [requestStatus, setRequestStatus] = useState<{
    tier?: SubscriptionTier;
    loading: boolean;
    success?: boolean;
    message?: string;
  }>({ loading: false });

  const tiers: SubscriptionTier[] = ['free', 'starter', 'pro', 'premium'];

  const handleSelectPlan = async (tier: SubscriptionTier) => {
    if (tier === currentTier) return;

    if (onPlanSelected) {
      onPlanSelected(tier);
      return;
    }

    setRequestStatus({ tier, loading: true });
    try {
      const res = await safeFetchJson('/api/subscription/request-upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestedTier: tier,
          billingCycle,
          note: `${tier.toUpperCase()} paketi için kullanıcı talebi oluşturuldu.`
        })
      });

      if (res && res.ok) {
        setRequestStatus({
          tier,
          loading: false,
          success: true,
          message: `${SUBSCRIPTION_PLANS[tier].name} paketi talebiniz alındı! Yönetici ekibimiz inceleyip yetkilendirmeyi yapacaktır.`
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

        {/* Billing Cycle Switch */}
        <div className="pt-3 flex items-center justify-center">
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
        </div>
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
          const plan = SUBSCRIPTION_PLANS[t];
          const isCurrent = !isAdmin && currentTier === t;
          const isTargetHighlight = highlightTier === t;
          const isPopular = plan.isPopular;

          const price = billingCycle === 'annual' 
            ? (plan.priceAnnualTRY > 0 ? Math.round(plan.priceAnnualTRY / 12) : 0)
            : plan.priceMonthlyTRY;

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
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">
                      ₺{price.toLocaleString('tr-TR')}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      / ay
                    </span>
                  </div>
                  {billingCycle === 'annual' && plan.priceAnnualTRY > 0 && (
                    <p className="text-[11px] text-amber-400 mt-1">
                      Yıllık ₺{plan.priceAnnualTRY.toLocaleString('tr-TR')} faturalandırılır
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
                  onClick={() => !isAdmin && handleSelectPlan(t)}
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
                      <span>{t === 'free' ? 'Ücretsiz Başla' : `${plan.name}'a Geç`}</span>
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
