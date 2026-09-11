import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Zap, 
  DollarSign, 
  Sliders,
  Plus,
  Trash2,
  ShieldCheck,
  Layers,
  Coins,
  Ticket,
  Percent,
  Tag,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { 
  SubscriptionTier, 
  SubscriptionPlanConfig, 
  SubscriptionPlanLimits,
  SUBSCRIPTION_PLANS,
  CreditCostRules,
  DEFAULT_CREDIT_COSTS,
  CouponCode
} from '../../shared/subscriptionPlans';
import { safeFetchJson } from '../../utils/apiClient';

interface Props {
  plans: Record<SubscriptionTier, SubscriptionPlanConfig>;
  onPlansUpdated: (newPlans: Record<SubscriptionTier, SubscriptionPlanConfig>) => void;
}

export const AdminSubscriptionTuningTab: React.FC<Props> = ({
  plans: initialPlans,
  onPlansUpdated
}) => {
  const [plans, setPlans] = useState<Record<SubscriptionTier, SubscriptionPlanConfig>>(initialPlans);
  const [activeTier, setActiveTier] = useState<SubscriptionTier>('pro');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [newBulletText, setNewBulletText] = useState('');

  // Credit Costs state
  const [creditCosts, setCreditCosts] = useState<CreditCostRules>(DEFAULT_CREDIT_COSTS);
  const [isSavingCosts, setIsSavingCosts] = useState(false);

  // Coupons state
  const [coupons, setCoupons] = useState<CouponCode[]>([]);
  const [isCouponsLoading, setIsCouponsLoading] = useState(false);
  const [isAddCouponModalOpen, setIsAddCouponModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Partial<CouponCode>>({
    code: '',
    discountType: 'percentage',
    discountValue: 20,
    applicableTiers: ['starter', 'pro', 'premium'],
    maxUses: 100,
    isActive: true,
    description: ''
  });

  // Add New Plan state
  const [isAddPlanModalOpen, setIsAddPlanPlanModalOpen] = useState(false);
  const [newPlanId, setNewPlanId] = useState('');
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanPriceMonthly, setNewPlanPriceMonthly] = useState<number>(499);
  const [newPlanPriceAnnual, setNewPlanPriceAnnual] = useState<number>(4990);
  const [newPlanDesc, setNewPlanDesc] = useState('');

  // Load Credit Costs & Coupons on Mount
  useEffect(() => {
    fetchCreditCosts();
    fetchCoupons();
  }, []);

  const fetchCreditCosts = async () => {
    try {
      const res = await safeFetchJson<{ success: boolean; creditCosts: CreditCostRules }>('/api/admin/credit-costs');
      if (res.ok && res.data?.creditCosts) {
        setCreditCosts(res.data.creditCosts);
      }
    } catch (err) {
      console.warn('Failed to load credit costs:', err);
    }
  };

  const fetchCoupons = async () => {
    setIsCouponsLoading(true);
    try {
      const res = await safeFetchJson<{ success: boolean; coupons: CouponCode[] }>('/api/admin/coupons');
      if (res.ok && res.data?.coupons) {
        setCoupons(res.data.coupons);
      }
    } catch (err) {
      console.warn('Failed to load coupons:', err);
    } finally {
      setIsCouponsLoading(false);
    }
  };

  const handleSaveCreditCosts = async () => {
    setIsSavingCosts(true);
    try {
      const res = await safeFetchJson<{ success: boolean }>('/api/admin/credit-costs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ costs: creditCosts })
      });
      if (res.ok && res.data?.success) {
        setSaveStatus({ type: 'success', message: 'Yapay Zeka Kredi maliyet kuralları başarıyla kaydedildi.' });
      } else {
        setSaveStatus({ type: 'error', message: 'Kredi maliyetleri kaydedilemedi.' });
      }
    } catch (err: any) {
      setSaveStatus({ type: 'error', message: 'Kredi maliyetleri kaydetme hatası: ' + err.message });
    } finally {
      setIsSavingCosts(false);
      setTimeout(() => setSaveStatus(null), 5000);
    }
  };

  const handleSaveCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code?.trim() || !newCoupon.discountValue) {
      alert('Lütfen kupon kodu ve indirim değerini doldurunuz.');
      return;
    }

    const couponPayload: CouponCode = {
      code: newCoupon.code.trim().toUpperCase(),
      discountType: newCoupon.discountType || 'percentage',
      discountValue: Number(newCoupon.discountValue) || 10,
      applicableTiers: newCoupon.applicableTiers || ['starter', 'pro', 'premium'],
      maxUses: Number(newCoupon.maxUses) ?? -1,
      usedCount: newCoupon.usedCount || 0,
      expiresAt: newCoupon.expiresAt || null,
      isActive: newCoupon.isActive ?? true,
      description: newCoupon.description || ''
    };

    try {
      const res = await safeFetchJson<{ success: boolean; error?: string }>('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coupon: couponPayload })
      });

      if (res.ok && res.data?.success) {
        setSaveStatus({ type: 'success', message: `"${couponPayload.code}" indirim kuponu başarıyla kaydedildi.` });
        setIsAddCouponModalOpen(false);
        setNewCoupon({
          code: '',
          discountType: 'percentage',
          discountValue: 20,
          applicableTiers: ['starter', 'pro', 'premium'],
          maxUses: 100,
          isActive: true,
          description: ''
        });
        fetchCoupons();
      } else {
        alert(res.data?.error || 'Kupon kaydedilemedi.');
      }
    } catch (err: any) {
      alert('Hata: ' + err.message);
    }
  };

  const handleDeleteCoupon = async (code: string) => {
    if (!window.confirm(`"${code}" kuponunu silmek istediğinize emin misiniz?`)) return;
    try {
      const res = await safeFetchJson<{ success: boolean }>(
        `/api/admin/coupons/${encodeURIComponent(code)}`,
        { method: 'DELETE' }
      );
      if (res.ok) {
        setCoupons(prev => prev.filter(c => c.code !== code));
        setSaveStatus({ type: 'success', message: `"${code}" kuponu başarıyla silindi.` });
      }
    } catch (err: any) {
      alert('Kupon silinemedi: ' + err.message);
    }
  };

  const handleToggleCouponActive = async (coupon: CouponCode) => {
    const updated = { ...coupon, isActive: !coupon.isActive };
    try {
      const res = await safeFetchJson<{ success: boolean }>('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coupon: updated })
      });
      if (res.ok) {
        setCoupons(prev => prev.map(c => c.code === coupon.code ? updated : c));
      }
    } catch (err) {
      console.warn('Failed to toggle coupon active:', err);
    }
  };

  const handleAddNewPlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const idKey = newPlanId.toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
    if (!idKey || !newPlanName.trim()) {
      alert('Lütfen geçerli bir paket ID ve görünen ad girin.');
      return;
    }
    if (plans[idKey as SubscriptionTier]) {
      alert('Bu ID ile bir paket zaten mevcut.');
      return;
    }

    const newPlanConfig: SubscriptionPlanConfig = {
      id: idKey as SubscriptionTier,
      name: newPlanName.trim(),
      displayName: newPlanName.trim(),
      badge: 'Özel Paket',
      description: newPlanDesc.trim() || 'Yatırımcılar için özel olarak tanımlanmış özel abonelik paketi.',
      priceMonthlyTRY: Number(newPlanPriceMonthly) || 0,
      priceAnnualTRY: Number(newPlanPriceAnnual) || 0,
      limits: {
        dailyAnalysisQueries: -1,
        monthlyAiCredits: 1000,
        ratioDepth: 'full',
        backtestMaxYears: -1,
        backtestMultiAsset: true,
        aiReportsPerPeriod: 10,
        aiReportsPeriodType: 'day',
        whatIfSimulator: true,
        ipoTracker: true,
        telegramTier: 'full_command_center',
        cronDigest: true,
        advancedStockMetrics: true,
        opportunityScanner: true,
        advancedFundMetrics: true,
        portfolioMaxAssets: -1,
        watchlist: true,
        multiPortfolio: true,
        priorityAiModel: true,
        earlyAccess: true,
      },
      featureBullets: [
        { title: 'Sınırsız Günlük Analiz', included: true },
        { title: 'Tüm Gelişmiş Özellikler ve Modüller', included: true },
      ]
    };

    setPlans(prev => ({
      ...prev,
      [idKey as SubscriptionTier]: newPlanConfig
    }));
    setActiveTier(idKey as SubscriptionTier);
    setIsAddPlanPlanModalOpen(false);
    setNewPlanId('');
    setNewPlanName('');
    setSaveStatus({ type: 'success', message: `"${newPlanName}" paketi başarıyla eklendi. Değişiklikleri kalıcı kaydetmek için "Tüm Paket Ayarlarını Kaydet" butonuna basınız.` });
  };

  const currentPlan = plans[activeTier] || SUBSCRIPTION_PLANS[activeTier];

  const handleFieldChange = <K extends keyof SubscriptionPlanConfig>(
    field: K,
    value: SubscriptionPlanConfig[K]
  ) => {
    setPlans(prev => ({
      ...prev,
      [activeTier]: {
        ...prev[activeTier],
        [field]: value
      }
    }));
  };

  const handleLimitChange = <K extends keyof SubscriptionPlanLimits>(
    limitKey: K,
    value: SubscriptionPlanLimits[K]
  ) => {
    setPlans(prev => ({
      ...prev,
      [activeTier]: {
        ...prev[activeTier],
        limits: {
          ...prev[activeTier].limits,
          [limitKey]: value
        }
      }
    }));
  };

  const handleAddBullet = () => {
    if (!newBulletText.trim()) return;
    const updatedBullets = [
      ...(currentPlan.featureBullets || []),
      { title: newBulletText.trim(), included: true, highlight: false }
    ];
    handleFieldChange('featureBullets', updatedBullets);
    setNewBulletText('');
  };

  const handleRemoveBullet = (index: number) => {
    const updated = (currentPlan.featureBullets || []).filter((_, i) => i !== index);
    handleFieldChange('featureBullets', updated);
  };

  const handleToggleBulletIncluded = (index: number) => {
    const updated = [...(currentPlan.featureBullets || [])];
    if (updated[index]) {
      updated[index] = { ...updated[index], included: !updated[index].included };
      handleFieldChange('featureBullets', updated);
    }
  };

  const handleResetToDefault = () => {
    if (!window.confirm(`${currentPlan.displayName} paketi için fabrika varsayılanlarına dönmek istediğinize emin misiniz?`)) {
      return;
    }
    setPlans(prev => ({
      ...prev,
      [activeTier]: { ...SUBSCRIPTION_PLANS[activeTier] }
    }));
    setSaveStatus({ type: 'success', message: `${currentPlan.displayName} paketi varsayılan değerlere sıfırlandı.` });
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const res = await safeFetchJson<{ success: boolean; error?: string }>('/api/admin/subscription-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plans })
      });

      if (res.ok && res.data?.success) {
        setSaveStatus({ type: 'success', message: 'Tüm üyelik paketlerinin ince ayarları başarıyla kaydedildi ve anında yayına alındı.' });
        onPlansUpdated(plans);
      } else {
        setSaveStatus({ type: 'error', message: res.data?.error || res.error || 'Paket ayarları kaydedilemedi.' });
      }
    } catch (err: any) {
      setSaveStatus({ type: 'error', message: 'Sunucu iletişim hatası: ' + err.message });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 5000);
    }
  };

  return (
    <div id="admin-subscription-tuning-view" className="space-y-6">
      
      {/* Header & Global Save */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Sliders className="text-purple-400" size={20} />
            Üyelik Paketleri İnce Ayar ve Limit Yönetimi
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Her üyelik seviyesinin günlük/haftalık analiz limitlerini, fiyatlarını ve özellik bayraklarını yönetin.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsAddPlanPlanModalOpen(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-600/25 shrink-0"
          >
            <Plus size={14} />
            Yeni Paket Ekle
          </button>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw size={14} />
            Bu Paketi Sıfırla
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
            Tüm Paket Ayarlarını Kaydet
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-2 border ${
          saveStatus.type === 'success'
            ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
            : 'bg-rose-950/40 border-rose-800 text-rose-300'
        }`}>
          {saveStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          <span>{saveStatus.message}</span>
        </div>
      )}

      {/* Tier Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['free', 'starter', 'pro', 'premium'] as SubscriptionTier[]).map((tierKey) => {
          const p = plans[tierKey] || SUBSCRIPTION_PLANS[tierKey];
          const isSelected = activeTier === tierKey;
          return (
            <button
              key={tierKey}
              type="button"
              onClick={() => setActiveTier(tierKey)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? tierKey === 'premium'
                    ? 'bg-amber-500/15 border-amber-500 shadow-lg shadow-amber-500/10 text-white'
                    : tierKey === 'pro'
                    ? 'bg-purple-500/15 border-purple-500 shadow-lg shadow-purple-500/10 text-white'
                    : tierKey === 'starter'
                    ? 'bg-blue-500/15 border-blue-500 shadow-lg shadow-blue-500/10 text-white'
                    : 'bg-slate-800 border-slate-600 text-white'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider">{p.displayName}</span>
                <Crown size={14} className={
                  tierKey === 'premium' ? 'text-amber-400' :
                  tierKey === 'pro' ? 'text-purple-400' :
                  tierKey === 'starter' ? 'text-blue-400' : 'text-slate-500'
                } />
              </div>
              <p className="text-sm font-black text-white">
                {p.priceMonthlyTRY === 0 ? 'Ücretsiz' : `${p.priceMonthlyTRY} ₺ / ay`}
              </p>
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                {p.limits.dailyAnalysisQueries === -1 ? 'Sınırsız Analiz' : `${p.limits.dailyAnalysisQueries} Analiz/Gün`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Tier Fine-Tuning Workspace */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Crown size={16} className="text-purple-400" />
            <span className="uppercase">{currentPlan.displayName}</span> Paketi Parametreleri
          </h3>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[11px] font-mono">
            id: {activeTier}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Section 1: Basic & Pricing */}
          <div className="space-y-4 p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 border-b border-slate-800/80 pb-2">
              <DollarSign size={14} className="text-emerald-400" />
              Görünüm & Fiyatlandırma
            </h4>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Paket Başlığı (Görünen İsim)</label>
              <input
                type="text"
                value={currentPlan.displayName}
                onChange={(e) => handleFieldChange('displayName', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Paket Rozeti / Sloganı</label>
              <input
                type="text"
                value={currentPlan.badge || ''}
                onChange={(e) => handleFieldChange('badge', e.target.value)}
                placeholder="Örn: 'En Popüler', 'Kurumsal Güç'..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Aylık Fiyat (₺)</label>
                <input
                  type="number"
                  min="0"
                  value={currentPlan.priceMonthlyTRY}
                  onChange={(e) => handleFieldChange('priceMonthlyTRY', Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Yıllık Fiyat (₺/ay)</label>
                <input
                  type="number"
                  min="0"
                  value={currentPlan.priceAnnualTRY}
                  onChange={(e) => handleFieldChange('priceAnnualTRY', Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono"
                />
              </div>
            </div>

            {/* Campaign Discount Configuration */}
            <div className="p-3 bg-slate-900/90 border border-purple-900/40 rounded-lg space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-300 flex items-center gap-1">
                  <Percent size={12} />
                  Kampanya İndirimi
                </span>
                <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-300">
                  <input
                    type="checkbox"
                    checked={currentPlan.discountActive ?? false}
                    onChange={(e) => handleFieldChange('discountActive', e.target.checked)}
                    className="w-3.5 h-3.5 accent-purple-500 rounded"
                  />
                  İndirim Aktif
                </label>
              </div>

              {currentPlan.discountActive && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">İndirim Oranı (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={currentPlan.discountPercent ?? 20}
                      onChange={(e) => handleFieldChange('discountPercent', Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">İndirim Etiketi</label>
                    <input
                      type="text"
                      value={currentPlan.discountBadge ?? ''}
                      onChange={(e) => handleFieldChange('discountBadge', e.target.value)}
                      placeholder="%20 İNDİRİM"
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Rasyo ve Teknik Derinlik</label>
              <select
                value={currentPlan.limits.ratioDepth}
                onChange={(e) => handleLimitChange('ratioDepth', e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="basic">Temel Rasyolar (F/K, PD/DD, FD/FAVÖK)</option>
                <option value="full">Tam Derinlik (Tüm 18+ Finansal & Bilanço Rasyosu)</option>
              </select>
            </div>
          </div>

          {/* Section 2: Quotas & Limits */}
          <div className="space-y-4 p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 border-b border-slate-800/80 pb-2">
              <Zap size={14} className="text-amber-400" />
              Kullanım Kotaları ve Limitler
            </h4>

            {/* AI Monthly Credits Limit */}
            <div className="space-y-2 p-3 bg-purple-950/30 border border-purple-800/40 rounded-lg">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-purple-300 flex items-center gap-1">
                  <Coins size={12} className="text-amber-400" />
                  Aylık AI & Ajan Kredi Limiti
                </label>
                <button
                  type="button"
                  onClick={() => handleLimitChange(
                    'monthlyAiCredits',
                    (currentPlan.limits.monthlyAiCredits ?? 50) === -1 ? 1000 : -1
                  )}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded cursor-pointer ${
                    (currentPlan.limits.monthlyAiCredits ?? 50) === -1
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-black'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {(currentPlan.limits.monthlyAiCredits ?? 50) === -1 ? 'Sınırsız (Aktif)' : 'Sınırsız Yap'}
                </button>
              </div>
              {(currentPlan.limits.monthlyAiCredits ?? 50) !== -1 && (
                <input
                  type="number"
                  min="0"
                  max="1000000"
                  value={currentPlan.limits.monthlyAiCredits ?? 50}
                  onChange={(e) => handleLimitChange('monthlyAiCredits', Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono font-bold"
                  placeholder="Aylık Toplam Kredi Sayısı"
                />
              )}
              <p className="text-[10px] text-slate-400">
                Kullanıcılar sohbet, otonom ajan, derin araştırma ve simülasyonlarda bu kredileri harcar.
              </p>
            </div>

            {/* Daily Queries Limit */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-400">Günlük Analiz Sorgu Limiti</label>
                <button
                  type="button"
                  onClick={() => handleLimitChange(
                    'dailyAnalysisQueries', 
                    currentPlan.limits.dailyAnalysisQueries === -1 ? 20 : -1
                  )}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded cursor-pointer ${
                    currentPlan.limits.dailyAnalysisQueries === -1 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-black'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {currentPlan.limits.dailyAnalysisQueries === -1 ? 'Sınırsız (Aktif)' : 'Sınırsız Yap'}
                </button>
              </div>
              {currentPlan.limits.dailyAnalysisQueries !== -1 && (
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={currentPlan.limits.dailyAnalysisQueries}
                  onChange={(e) => handleLimitChange('dailyAnalysisQueries', Math.max(1, Number(e.target.value) || 1))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono"
                />
              )}
            </div>

            {/* AI Reports Limit */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-400">Dönem Başına AI Karne Limiti</label>
                <button
                  type="button"
                  onClick={() => handleLimitChange(
                    'aiReportsPerPeriod', 
                    currentPlan.limits.aiReportsPerPeriod === -1 ? 5 : -1
                  )}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded cursor-pointer ${
                    currentPlan.limits.aiReportsPerPeriod === -1 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-black'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {currentPlan.limits.aiReportsPerPeriod === -1 ? 'Sınırsız (Aktif)' : 'Sınırsız Yap'}
                </button>
              </div>
              {currentPlan.limits.aiReportsPerPeriod !== -1 && (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={currentPlan.limits.aiReportsPerPeriod}
                    onChange={(e) => handleLimitChange('aiReportsPerPeriod', Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono"
                  />
                  <select
                    value={currentPlan.limits.aiReportsPeriodType}
                    onChange={(e) => handleLimitChange('aiReportsPeriodType', e.target.value as any)}
                    className="w-full px-2 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200"
                  >
                    <option value="day">Günlük</option>
                    <option value="week">Haftalık</option>
                    <option value="unlimited">Süresiz</option>
                  </select>
                </div>
              )}
            </div>

            {/* Backtest Max Years */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Backtest Maksimum Yıl Geçmişi</label>
              <select
                value={currentPlan.limits.backtestMaxYears}
                onChange={(e) => handleLimitChange('backtestMaxYears', Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono"
              >
                <option value={1}>1 Yıl</option>
                <option value={3}>3 Yıl</option>
                <option value={5}>5 Yıl</option>
                <option value={10}>10 Yıl</option>
                <option value={-1}>Sınırsız (Tüm Geçmiş)</option>
              </select>
            </div>
          </div>

          {/* Section 3: Feature Flags & Permissions */}
          <div className="space-y-4 p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 border-b border-slate-800/80 pb-2">
              <ShieldCheck size={14} className="text-indigo-400" />
              Modül ve Özellik İzinleri
            </h4>

            <div className="space-y-2 text-xs">
              
              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:bg-slate-850">
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 font-medium">Halka Arz (IPO) Takip & Analiz</span>
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded font-mono">YENİ</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentPlan.limits.ipoTracker ?? false}
                  onChange={(e) => handleLimitChange('ipoTracker', e.target.checked)}
                  className="w-4 h-4 accent-cyan-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:bg-slate-850">
                <span className="text-slate-300 font-medium">Çoklu Varlık Backtest (Multi-Asset)</span>
                <input
                  type="checkbox"
                  checked={currentPlan.limits.backtestMultiAsset ?? false}
                  onChange={(e) => handleLimitChange('backtestMultiAsset', e.target.checked)}
                  className="w-4 h-4 accent-purple-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:bg-slate-850">
                <span className="text-slate-300 font-medium">What-If Simülatörü</span>
                <input
                  type="checkbox"
                  checked={currentPlan.limits.whatIfSimulator ?? false}
                  onChange={(e) => handleLimitChange('whatIfSimulator', e.target.checked)}
                  className="w-4 h-4 accent-purple-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:bg-slate-850">
                <span className="text-slate-300 font-medium">Öncelikli AI Modeli Desteği</span>
                <input
                  type="checkbox"
                  checked={currentPlan.limits.priorityAiModel ?? false}
                  onChange={(e) => handleLimitChange('priorityAiModel', e.target.checked)}
                  className="w-4 h-4 accent-purple-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:bg-slate-850">
                <span className="text-slate-300 font-medium">Sektörel Eşlenik Kıyaslama (Peer)</span>
                <input
                  type="checkbox"
                  checked={currentPlan.limits.advancedStockMetrics ?? true}
                  onChange={(e) => handleLimitChange('advancedStockMetrics', e.target.checked)}
                  className="w-4 h-4 accent-purple-500 rounded"
                />
              </label>

              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 block">Telegram Entegrasyon Düzeyi</label>
                <select
                  value={currentPlan.limits.telegramTier}
                  onChange={(e) => handleLimitChange('telegramTier', e.target.value as any)}
                  className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200"
                >
                  <option value="price_only">Yalnızca Fiyat Alarmları</option>
                  <option value="price_and_news">Fiyat + Haber & KAP Bildirimleri</option>
                  <option value="full_command_center">Tam Komuta Merkezi & İnteraktif Bot</option>
                </select>
              </div>

            </div>
          </div>

        </div>

        {/* Section 4: Public Feature List (Bullet points displayed to user) */}
        <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Layers size={14} className="text-cyan-400" />
              Kullanıcıya Gösterilen Özellik Maddeleri ({(currentPlan.featureBullets || []).length})
            </h4>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newBulletText}
              onChange={(e) => setNewBulletText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddBullet(); }}
              placeholder="Yeni özellik maddesi ekle (örn: '15 Dakikalık Canlı Veri Akışı')..."
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              type="button"
              onClick={handleAddBullet}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} /> Ekle
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-2">
            {(currentPlan.featureBullets || []).map((bullet, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 group"
              >
                <div 
                  onClick={() => handleToggleBulletIncluded(idx)}
                  className="flex items-center gap-2 truncate pr-2 cursor-pointer select-none"
                  title="Dahil/Hariç Durumunu Değiştir"
                >
                  <CheckCircle2 
                    size={13} 
                    className={bullet.included ? 'text-emerald-400 shrink-0' : 'text-slate-600 shrink-0'} 
                  />
                  <span className={`truncate ${!bullet.included ? 'line-through text-slate-500' : ''}`}>
                    {bullet.title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveBullet(idx)}
                  className="text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                  title="Özelliği Sil"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Global AI Credit Cost Rules Management */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Coins size={16} className="text-amber-400" />
              Yapay Zeka & Ajan Kredi Harcama Maliyetleri
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Her bir yapay zeka işleminde kullanıcının bakiyesinden düşülecek kredi miktarını belirleyin.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSaveCreditCosts}
            disabled={isSavingCosts}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            {isSavingCosts ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
            Kredi Maliyetlerini Kaydet
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-300 block">Sohbet & Borsa Sorusu</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={creditCosts.chatQuery}
                onChange={(e) => setCreditCosts(prev => ({ ...prev, chatQuery: Math.max(1, Number(e.target.value) || 1) }))}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono font-bold"
              />
              <span className="text-xs text-amber-400 font-mono shrink-0">Kredi</span>
            </div>
            <span className="text-[10px] text-slate-500 block">Standart sohbet ve analiz sorusu</span>
          </div>

          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-300 block">Derin Ajan Araştırması</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={creditCosts.deepResearch}
                onChange={(e) => setCreditCosts(prev => ({ ...prev, deepResearch: Math.max(1, Number(e.target.value) || 1) }))}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono font-bold"
              />
              <span className="text-xs text-amber-400 font-mono shrink-0">Kredi</span>
            </div>
            <span className="text-[10px] text-slate-500 block">Canlı web taramalı derin borsa araştırması</span>
          </div>

          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-300 block">Çoklu Ajan Raporu (Multi-Agent)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={creditCosts.multiAgentReport}
                onChange={(e) => setCreditCosts(prev => ({ ...prev, multiAgentReport: Math.max(1, Number(e.target.value) || 1) }))}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono font-bold"
              />
              <span className="text-xs text-amber-400 font-mono shrink-0">Kredi</span>
            </div>
            <span className="text-[10px] text-slate-500 block">Makro, Temel, Teknik ortak kurul karnesi</span>
          </div>

          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-300 block">What-If Simülasyonu</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={creditCosts.whatIfSimulator}
                onChange={(e) => setCreditCosts(prev => ({ ...prev, whatIfSimulator: Math.max(1, Number(e.target.value) || 1) }))}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono font-bold"
              />
              <span className="text-xs text-amber-400 font-mono shrink-0">Kredi</span>
            </div>
            <span className="text-[10px] text-slate-500 block">Senaryo analizi ve portföy şok testi</span>
          </div>
        </div>
      </div>

      {/* Promosyon & İndirim Kuponları Yönetimi */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Ticket size={16} className="text-purple-400" />
              Promosyon ve İndirim Kuponu Yönetimi
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Kullanıcıların satın alma ve paket yükseltme ekranında kullanabileceği promosyon kodlarını yönetin.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddCouponModalOpen(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/20 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus size={14} /> Yeni İndirim Kuponu
          </button>
        </div>

        {isCouponsLoading ? (
          <div className="p-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="animate-spin" size={14} /> Kuponlar yükleniyor...
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
            Henüz tanımlanmış bir indirim kuponu bulunmuyor. Yeni bir kupon eklemek için yukarıdaki butona tıklayın.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {coupons.map((coupon) => (
              <div
                key={coupon.code}
                className={`p-4 rounded-xl border text-xs space-y-2 transition-all ${
                  coupon.isActive
                    ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-sm text-purple-300 bg-purple-950/50 px-2.5 py-1 rounded-md border border-purple-800/50">
                    {coupon.code}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleCouponActive(coupon)}
                      title={coupon.isActive ? 'Kuponu Pasifleştir' : 'Kuponu Aktifleştir'}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {coupon.isActive ? (
                        <ToggleRight size={20} className="text-emerald-400" />
                      ) : (
                        <ToggleLeft size={20} className="text-slate-600" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCoupon(coupon.code)}
                      title="Kuponu Sil"
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p className="text-slate-300 font-medium">
                  {coupon.description || 'Promosyon İndirim Kodu'}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-mono text-slate-400 border-t border-slate-850">
                  <div>
                    İndirim: <span className="text-emerald-400 font-bold">
                      {coupon.discountType === 'percentage' ? `%${coupon.discountValue}` : `${coupon.discountValue} ₺`}
                    </span>
                  </div>
                  <div>
                    Kullanım: <span className="text-white font-bold">{coupon.usedCount}</span> / {coupon.maxUses === -1 ? 'Sınırsız' : coupon.maxUses}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>Geçerli Paketler: {(coupon.applicableTiers || ['starter', 'pro', 'premium']).join(', ').toUpperCase()}</span>
                  <span className={`font-bold ${coupon.isActive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {coupon.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Coupon Modal */}
      {isAddCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Ticket className="text-purple-400" size={18} />
                Yeni İndirim Kuponu Tanımla
              </h3>
              <button 
                type="button" 
                onClick={() => setIsAddCouponModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCouponSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Kupon Kodu *</label>
                <input
                  type="text"
                  required
                  value={newCoupon.code || ''}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  placeholder="örn: BORSA2026, BAHAR30"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-purple-300 font-mono font-bold focus:outline-none focus:border-purple-500 uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">İndirim Tipi</label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon(prev => ({ ...prev, discountType: e.target.value as any }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="percentage">Yüzde (%) İndirim</option>
                    <option value="fixed_try">Sabit Tutar (TL) İndirimi</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">İndirim Değeri *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newCoupon.discountValue || ''}
                    onChange={(e) => setNewCoupon(prev => ({ ...prev, discountValue: Number(e.target.value) }))}
                    placeholder={newCoupon.discountType === 'percentage' ? '% (örn: 25)' : 'TL (örn: 100)'}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Maksimum Kullanım Limiti (-1 = Sınırsız)</label>
                <input
                  type="number"
                  value={newCoupon.maxUses}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, maxUses: Number(e.target.value) }))}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Açıklama</label>
                <input
                  type="text"
                  value={newCoupon.description || ''}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Kupon kampanyasının kısa özeti..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddCouponModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black rounded-xl shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Ticket size={14} />
                  Kuponu Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Plan Modal */}
      {isAddPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Crown className="text-purple-400" size={18} />
                Yeni Üyelik Paketi Tanımla
              </h3>
              <button 
                type="button" 
                onClick={() => setIsAddPlanPlanModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewPlanSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Paket ID / Kod *</label>
                  <input
                    type="text"
                    required
                    value={newPlanId}
                    onChange={(e) => setNewPlanId(e.target.value)}
                    placeholder="örn: vip, enterprise, ultra"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Görünen Ad *</label>
                  <input
                    type="text"
                    required
                    value={newPlanName}
                    onChange={(e) => setNewPlanName(e.target.value)}
                    placeholder="örn: VIP Kurumsal"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Aylık Fiyat (TRY)</label>
                  <input
                    type="number"
                    value={newPlanPriceMonthly}
                    onChange={(e) => setNewPlanPriceMonthly(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Yıllık Fiyat (TRY)</label>
                  <input
                    type="number"
                    value={newPlanPriceAnnual}
                    onChange={(e) => setNewPlanPriceAnnual(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Paket Açıklaması</label>
                <textarea
                  value={newPlanDesc}
                  onChange={(e) => setNewPlanDesc(e.target.value)}
                  placeholder="Bu paket kimler için uygundur ve ne sunar..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddPlanPlanModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black rounded-xl shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Crown size={14} />
                  Paketi Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
