export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'premium' | 'admin';
export type SubscriptionStatus = 'active' | 'expired' | 'manual_grant' | 'trial';
export type TelegramTier = 'price_only' | 'price_and_news' | 'full_command_center';
export type RatioDepth = 'basic' | 'full';

export interface UserSubscription {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  grantedAt: string;
  expiresAt: string | null; // null = süresiz (lifetime or until changed)
  grantedBy: string; // "system" | "admin" | uid
}

export interface UserUsage {
  analysisQueriesToday: number;
  aiReportsThisPeriod: number;
  lastResetDate: string; // YYYY-MM-DD format for daily tracking
  lastWeeklyResetDate?: string; // YYYY-MM-DD or week number
}

export interface SubscriptionPlanLimits {
  dailyAnalysisQueries: number; // 3 or -1 (unlimited)
  ratioDepth: RatioDepth; // 'basic' (F/K, PD/DD) or 'full' (all 18+ ratios)
  backtestMaxYears: number; // 1, 5, or -1 (unlimited)
  backtestMultiAsset: boolean;
  aiReportsPerPeriod: number; // 1, 3, or -1 (unlimited)
  aiReportsPeriodType: 'day' | 'week' | 'unlimited';
  whatIfSimulator: boolean;
  ipoTracker: boolean; // Halka Arz Takip & Analiz Modülü (Pro & Premium)
  telegramTier: TelegramTier;
  cronDigest: boolean;
  advancedStockMetrics: boolean;
  opportunityScanner: boolean;
  advancedFundMetrics: boolean;
  portfolioMaxAssets: number; // 5, 20, or -1 (unlimited)
  watchlist: boolean;
  multiPortfolio: boolean;
  priorityAiModel: boolean;
  earlyAccess: boolean;
}

export interface SubscriptionPlanConfig {
  id: SubscriptionTier;
  name: string;
  displayName: string;
  badge?: string;
  description: string;
  priceMonthlyTRY: number;
  priceAnnualTRY: number;
  isPopular?: boolean;
  limits: SubscriptionPlanLimits;
  featureBullets: {
    title: string;
    included: boolean;
    highlight?: boolean;
  }[];
}

export const DEFAULT_FREE_SUBSCRIPTION: UserSubscription = {
  tier: 'free',
  status: 'active',
  grantedAt: new Date().toISOString(),
  expiresAt: null,
  grantedBy: 'system',
};

export const DEFAULT_FREE_USAGE: UserUsage = {
  analysisQueriesToday: 0,
  aiReportsThisPeriod: 0,
  lastResetDate: new Date().toISOString().slice(0, 10),
  lastWeeklyResetDate: new Date().toISOString().slice(0, 10),
};

export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, SubscriptionPlanConfig> = {
  free: {
    id: 'free',
    name: 'Ücretsiz',
    displayName: 'Ücretsiz',
    badge: 'Temel Erişim',
    description: 'Piyasa verilerini ve temel analizleri keşfetmek isteyen bireysel yatırımcılar için.',
    priceMonthlyTRY: 0,
    priceAnnualTRY: 0,
    limits: {
      dailyAnalysisQueries: 3,
      ratioDepth: 'basic',
      backtestMaxYears: 1,
      backtestMultiAsset: false,
      aiReportsPerPeriod: 1,
      aiReportsPeriodType: 'week',
      whatIfSimulator: false,
      ipoTracker: false,
      telegramTier: 'price_only',
      cronDigest: false,
      advancedStockMetrics: false,
      opportunityScanner: false,
      advancedFundMetrics: false,
      portfolioMaxAssets: 5,
      watchlist: false,
      multiPortfolio: false,
      priorityAiModel: false,
      earlyAccess: false,
    },
    featureBullets: [
      { title: 'Günde 3 Hisse / Fon Analizi', included: true },
      { title: 'Temel Rasyolar (F/K, PD/DD)', included: true },
      { title: '1 Yıllık Tekil Backtest', included: true },
      { title: 'Haftada 1 Derin AI Raporu', included: true },
      { title: '5 Varlığa Kadar Portföy Takibi', included: true },
      { title: 'Telegram Fiyat Alarmları', included: true },
      { title: 'Halka Arz (IPO) Takvim & İstihbarat', included: false },
      { title: 'What-If Değerleme Simülatörü', included: false },
      { title: 'Akran Kıyaslama & 18 Kriterli Karne', included: false },
      { title: 'Kişisel Takip Listesi (Watchlist)', included: false },
      { title: 'Sabah/Akşam Telegram Bülteni (Digest)', included: false },
      { title: 'Çoklu Portföy Yönetimi', included: false },
    ],
  },
  starter: {
    id: 'starter',
    name: 'Başlangıç',
    displayName: 'Başlangıç',
    badge: 'Yatırımcı',
    description: 'Bilinçli kararlar almak ve portföyünü aktif büyütmek isteyen yatırımcılar için.',
    priceMonthlyTRY: 299,
    priceAnnualTRY: 2990,
    limits: {
      dailyAnalysisQueries: -1, // Unlimited
      ratioDepth: 'full',
      backtestMaxYears: 5,
      backtestMultiAsset: true,
      aiReportsPerPeriod: 3,
      aiReportsPeriodType: 'day',
      whatIfSimulator: false,
      ipoTracker: false,
      telegramTier: 'price_and_news',
      cronDigest: false,
      advancedStockMetrics: false,
      opportunityScanner: false,
      advancedFundMetrics: false,
      portfolioMaxAssets: 20,
      watchlist: true,
      multiPortfolio: false,
      priorityAiModel: false,
      earlyAccess: false,
    },
    featureBullets: [
      { title: 'Sınırsız Günlük Analiz Sorgusu', included: true, highlight: true },
      { title: 'Tüm Gelişmiş Finansal Rasyolar', included: true },
      { title: '5 Yıla Kadar Çoklu Varlık Backtest', included: true },
      { title: 'Günde 3 Derin AI Raporu', included: true },
      { title: '20 Varlığa Kadar Portföy & Takip Listesi', included: true },
      { title: 'Telegram Fiyat + Haber Alarmları', included: true },
      { title: 'Halka Arz (IPO) Takvim & İstihbarat', included: false },
      { title: 'What-If Değerleme Simülatörü', included: false },
      { title: 'TEFAS Akran Kıyaslama & Risk Matrisi', included: false },
      { title: 'Sabah/Akşam Otomatik Telegram Bülteni', included: false },
      { title: 'Çoklu Portföy Yönetimi', included: false },
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    displayName: 'Pro',
    badge: 'En Popüler',
    isPopular: true,
    description: 'Profesyonel traderlar, fon takipçileri ve derin değerleme arayanlar için tam cephane.',
    priceMonthlyTRY: 699,
    priceAnnualTRY: 6990,
    limits: {
      dailyAnalysisQueries: -1,
      ratioDepth: 'full',
      backtestMaxYears: -1,
      backtestMultiAsset: true,
      aiReportsPerPeriod: -1,
      aiReportsPeriodType: 'unlimited',
      whatIfSimulator: true,
      ipoTracker: true,
      telegramTier: 'full_command_center',
      cronDigest: true,
      advancedStockMetrics: true,
      opportunityScanner: true,
      advancedFundMetrics: true,
      portfolioMaxAssets: -1,
      watchlist: true,
      multiPortfolio: false,
      priorityAiModel: false,
      earlyAccess: false,
    },
    featureBullets: [
      { title: 'Sınırsız Günlük Analiz & AI Raporları', included: true, highlight: true },
      { title: 'Halka Arz (IPO) Takvim & Derin İstihbarat', included: true, highlight: true },
      { title: 'What-If Dinamik Değerleme Simülatörü', included: true, highlight: true },
      { title: 'Sınırsız Geçmiş & Çoklu Varlık Backtest', included: true },
      { title: 'TEFAS Fon Akran Kıyaslaması & Sharpe Analizi', included: true },
      { title: '18 Kriterli Şirket Sağlık Karnesi & İndirme', included: true },
      { title: 'Telegram Tam Komuta Merkezi (/rapor, /portfoy)', included: true, highlight: true },
      { title: 'Sabah 08:30 & Akşam 18:30 Otomatik Telegram Özeti', included: true },
      { title: 'Sınırsız Varlık Portföyü & Takip Listesi', included: true },
      { title: 'Çoklu Portföy Yönetimi (BIST, Fon, Emtia)', included: false },
    ],
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    displayName: 'Premium',
    badge: 'Kurumsal & VIP',
    description: 'Çoklu portföy yöneten, en yüksek işlem önceliği ve erken erişim isteyen üst düzey yatırımcılar.',
    priceMonthlyTRY: 1299,
    priceAnnualTRY: 12990,
    limits: {
      dailyAnalysisQueries: -1,
      ratioDepth: 'full',
      backtestMaxYears: -1,
      backtestMultiAsset: true,
      aiReportsPerPeriod: -1,
      aiReportsPeriodType: 'unlimited',
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
      { title: 'Pro Paketindeki Tüm Özellikler + Halka Arz Modülü', included: true },
      { title: 'Çoklu Portföy Yönetimi (Ayrı Fon, Hisse, Emtia Hesapları)', included: true, highlight: true },
      { title: 'Öncelikli AI Model Kuyruğu & En Düşük Gecikme', included: true, highlight: true },
      { title: 'Yeni Geliştirilen Modüllere Erken Erişim (Beta)', included: true },
      { title: 'VIP Destek & Özel Analiz İstekleri', included: true },
      { title: 'Sınırsız Telegram Komutları & Otomasyonlar', included: true },
    ],
  },
  admin: {
    id: 'admin',
    name: 'Admin',
    displayName: 'Admin',
    badge: 'Yönetici',
    description: 'Sistem Yöneticisi hesabı. Herhangi bir pakete veya kota sınırlandırmasına tabi değildir.',
    priceMonthlyTRY: 0,
    priceAnnualTRY: 0,
    limits: {
      dailyAnalysisQueries: -1,
      ratioDepth: 'full',
      backtestMaxYears: -1,
      backtestMultiAsset: true,
      aiReportsPerPeriod: -1,
      aiReportsPeriodType: 'unlimited',
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
      { title: 'Pakete Tabi Değil (Sınırsız Yönetici Yetkisi)', included: true, highlight: true },
      { title: 'Sınırsız Hisse & Fon Analizi', included: true },
      { title: 'Sınırsız AI Karne ve İstihbarat', included: true },
      { title: 'What-If Simülatörü ve IPO Radarı Açık', included: true },
      { title: 'Tüm Yönetici ve Telemetri Araçlarına Tam Erişim', included: true, highlight: true },
    ],
  },
};

/**
 * Helper to check if a specific feature is allowed for a given tier
 */
export function isFeatureAllowed(
  tier: SubscriptionTier | undefined | null,
  featureName: keyof SubscriptionPlanLimits
): boolean {
  if (tier === 'admin') return true;
  const currentTier = tier || 'free';
  const plan = SUBSCRIPTION_PLANS[currentTier] || SUBSCRIPTION_PLANS.free;
  const val = plan.limits[featureName];
  if (typeof val === 'boolean') return val;
  if (typeof val === 'number') return val !== 0;
  return true;
}

/**
 * Returns required minimum tier for a given feature
 */
export function getRequiredTierForFeature(featureName: keyof SubscriptionPlanLimits): SubscriptionTier {
  const tiers: SubscriptionTier[] = ['free', 'starter', 'pro', 'premium'];
  for (const tier of tiers) {
    const plan = SUBSCRIPTION_PLANS[tier];
    const val = plan.limits[featureName];
    if (typeof val === 'boolean' && val === true) return tier;
    if (typeof val === 'number' && val === -1) return tier;
    if (val === 'full' || val === 'full_command_center') return tier;
  }
  return 'pro';
}
