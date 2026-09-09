import React, { useState } from 'react';
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
  Layers
} from 'lucide-react';
import { 
  SubscriptionTier, 
  SubscriptionPlanConfig, 
  SubscriptionPlanLimits,
  SUBSCRIPTION_PLANS 
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

  // Add New Plan state
  const [isAddPlanModalOpen, setIsAddPlanPlanModalOpen] = useState(false);
  const [newPlanId, setNewPlanId] = useState('');
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanPriceMonthly, setNewPlanPriceMonthly] = useState<number>(499);
  const [newPlanPriceAnnual, setNewPlanPriceAnnual] = useState<number>(4990);
  const [newPlanDesc, setNewPlanDesc] = useState('');

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
