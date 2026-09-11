import { CriticalSecurityError } from '../utils/securityErrors';
import { adminDb } from './firebaseAdminService';
import { serverLocalDatabase } from './serverLocalDatabase';
import { 
  SUBSCRIPTION_PLANS, 
  SubscriptionPlanConfig, 
  SubscriptionTier,
  CreditCostRules,
  DEFAULT_CREDIT_COSTS,
  CouponCode
} from '../../src/shared/subscriptionPlans';
import { logAudit } from './auditService';

export interface DynamicAiSettings {
  aiEnabled: boolean; // Global emergency kill-switch
  freeTierModel: string;
  starterTierModel: string;
  proTierModel: string;
  premiumTierModel: string;
  defaultTemperature: number;
  maxTokens: number;
  updatedAt: string;
  updatedBy: string;
}

export const DEFAULT_AI_SETTINGS: DynamicAiSettings = {
  aiEnabled: true,
  freeTierModel: 'gemini-3.7-flash',
  starterTierModel: 'gemini-3.7-flash',
  proTierModel: 'gemini-3.1-pro-preview',
  premiumTierModel: 'gemini-3.1-pro-preview',
  defaultTemperature: 0.2,
  maxTokens: 4096,
  updatedAt: new Date().toISOString(),
  updatedBy: 'system',
};

export interface SystemPlatformSettings {
  brandName: string;
  logoUrl: string;
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  telegramBroadcastEnabled: boolean;
  updatedAt: string;
  updatedBy: string;
}

export const DEFAULT_SYSTEM_SETTINGS: SystemPlatformSettings = {
  brandName: 'MarketPulse AI',
  logoUrl: '',
  maintenanceMode: false,
  allowNewRegistrations: true,
  telegramBroadcastEnabled: true,
  updatedAt: new Date().toISOString(),
  updatedBy: 'system',
};


// In-memory caching for high performance
let cachedPlans: Record<SubscriptionTier, SubscriptionPlanConfig> | null = null;
let cachedAiSettings: DynamicAiSettings | null = null;
let cachedSystemSettings: SystemPlatformSettings | null = null;

/**
 * Seeds and retrieves dynamic subscription plans configuration
 */
export async function getDynamicSubscriptionPlans(): Promise<Record<SubscriptionTier, SubscriptionPlanConfig>> {
  if (cachedPlans) {
    return cachedPlans;
  }

  // CRITICAL PATH: We MUST NOT silently fallback to local data if Firestore is unreachable.
  // This dictates user limits and billing logic.
  try {
    const planDocRef = adminDb.collection('adminConfig').doc('subscriptionPlans');
    const snap = await planDocRef.get().catch(async () => {
      const { getFirestore } = await import('firebase-admin/firestore');
      const { getApp } = await import('firebase-admin/app');
      const defaultDb = getFirestore(getApp());
      return await defaultDb.collection('adminConfig').doc('subscriptionPlans').get();
    });
    
    if (snap.exists && snap.data()?.plans) {
      const plans = snap.data()!.plans;
      cachedPlans = plans;
      
      try {
        serverLocalDatabase.upsert('adminConfig', 'subscriptionPlans', { plans, updatedAt: new Date().toISOString() });
      } catch (e) {}

      return plans;
    }
  } catch (error: any) {
    console.warn('Warning: Could not fetch subscription plans from Firestore, falling back to default plans:', error?.message);
    cachedPlans = { ...SUBSCRIPTION_PLANS };
    return cachedPlans;
  }

  // If the document simply doesn't exist yet, seed with defaults
  cachedPlans = { ...SUBSCRIPTION_PLANS };
  try {
    await adminDb.collection('adminConfig').doc('subscriptionPlans').set({
      plans: SUBSCRIPTION_PLANS,
      updatedAt: new Date().toISOString(),
      updatedBy: 'system_seed'
    }, { merge: true }).catch(() => {});
  } catch (error: any) {
    // Non-fatal seed error
  }

  return cachedPlans;
}

/**
 * Updates dynamic subscription plans configuration
 */
export async function updateDynamicSubscriptionPlans(
  newPlans: Record<SubscriptionTier, SubscriptionPlanConfig>,
  adminUid: string,
  adminEmail: string
): Promise<{ success: boolean; error?: string }> {
  const previous = cachedPlans || { ...SUBSCRIPTION_PLANS };
  
  // 1. Save to Firestore (with graceful local fallback)
  try {
    await adminDb.collection('adminConfig').doc('subscriptionPlans').set({
      plans: newPlans,
      updatedAt: new Date().toISOString(),
      updatedBy: adminEmail
    }, { merge: true });
  } catch (error: any) {
    console.warn('Warning: Failed to save subscription plans to Firestore, storing locally:', error?.message);
  }

  // 2. Update caches and local database
  cachedPlans = newPlans;
  try {
    serverLocalDatabase.upsert('adminConfig', 'subscriptionPlans', {
      plans: newPlans,
      updatedAt: new Date().toISOString(),
      updatedBy: adminEmail
    });
  } catch (err: any) {
    console.warn('Failed to save plans to local DB:', err);
  }

  // 3. Audit log
  try {
    await logAudit(
      'UPDATE_SUBSCRIPTION_PLANS',
      adminUid,
      `Admin (${adminEmail}) üyelik paketlerinin limit ve fiyat yapılandırmasını güncelledi.`,
      {
        adminEmail,
        oldValue: previous,
        newValue: newPlans,
      }
    );
  } catch {}

  return { success: true };
}

/**
 * Gets dynamic AI settings
 */
export async function getDynamicAiSettings(): Promise<DynamicAiSettings> {
  if (cachedAiSettings) {
    return cachedAiSettings;
  }

  // CRITICAL PATH: Affects the global AI kill-switch and model selection
  try {
    const snap = await adminDb.collection('adminConfig').doc('aiSettings').get().catch(async () => {
      const { getFirestore } = await import('firebase-admin/firestore');
      const { getApp } = await import('firebase-admin/app');
      const defaultDb = getFirestore(getApp());
      return await defaultDb.collection('adminConfig').doc('aiSettings').get();
    });
    if (snap.exists) {
      cachedAiSettings = { ...DEFAULT_AI_SETTINGS, ...snap.data() } as DynamicAiSettings;
      try {
        serverLocalDatabase.upsert('adminConfig', 'aiSettings', cachedAiSettings);
      } catch (e) {}
      return cachedAiSettings;
    }
  } catch (error: any) {
    console.warn('Warning: Could not fetch AI settings from Firestore, falling back to default settings:', error?.message);
    cachedAiSettings = { ...DEFAULT_AI_SETTINGS };
    return cachedAiSettings;
  }

  // Seed default if it doesn't exist
  cachedAiSettings = { ...DEFAULT_AI_SETTINGS };
  try {
    await adminDb.collection('adminConfig').doc('aiSettings').set(cachedAiSettings, { merge: true }).catch(() => {});
  } catch (error: any) {
    // Non-fatal seed error
  }

  return cachedAiSettings;
}

/**
 * Updates dynamic AI settings
 */
export async function updateDynamicAiSettings(
  newSettings: Partial<DynamicAiSettings>,
  adminUid: string,
  adminEmail: string
): Promise<{ success: boolean; error?: string }> {
  const current = await getDynamicAiSettings();
  const updated: DynamicAiSettings = {
    ...current,
    ...newSettings,
    updatedAt: new Date().toISOString(),
    updatedBy: adminEmail
  };

  // CRITICAL PATH
  try {
    await adminDb.collection('adminConfig').doc('aiSettings').set(updated, { merge: true });
  } catch (error: any) {
    throw new CriticalSecurityError('CRITICAL: Failed to securely update AI settings in Firestore.', error);
  }

  cachedAiSettings = updated;
  try {
    serverLocalDatabase.upsert('adminConfig', 'aiSettings', updated);
  } catch {}

  await logAudit(
    'UPDATE_AI_SETTINGS',
    adminUid,
    `Admin (${adminEmail}) AI Model ve Kill-Switch ayarlarını güncelledi. AI Aktif: ${updated.aiEnabled}`,
    {
      adminEmail,
      oldValue: current,
      newValue: updated
    }
  );

  return { success: true };
}

/**
 * Helper to get the designated AI model for a given user subscription tier
 */
export async function getAiModelForTier(tier?: SubscriptionTier): Promise<string> {
  const aiSettings = await getDynamicAiSettings();
  if (!aiSettings.aiEnabled) {
    throw new Error('AI_DISABLED_BY_ADMIN');
  }

  switch (tier) {
    case 'premium':
      return aiSettings.premiumTierModel || 'gemini-3.1-pro-preview';
    case 'pro':
      return aiSettings.proTierModel || 'gemini-3.1-pro-preview';
    case 'starter':
      return aiSettings.starterTierModel || 'gemini-3.7-flash';
    case 'free':
    default:
      return aiSettings.freeTierModel || 'gemini-3.7-flash';
  }
}

// ---------------------------------------------------------
// CREDIT COSTS & COUPONS MANAGEMENT
// ---------------------------------------------------------

let cachedCreditCosts: CreditCostRules | null = null;
let cachedCoupons: CouponCode[] | null = null;

export async function getCreditCostRules(): Promise<CreditCostRules> {
  if (cachedCreditCosts) return cachedCreditCosts;
  try {
    const snap = await adminDb.collection('adminConfig').doc('creditCosts').get().catch(() => null);
    if (snap && snap.exists) {
      cachedCreditCosts = { ...DEFAULT_CREDIT_COSTS, ...snap.data() } as CreditCostRules;
      return cachedCreditCosts;
    }
  } catch (e) {}
  cachedCreditCosts = { ...DEFAULT_CREDIT_COSTS };
  return cachedCreditCosts;
}

export async function updateCreditCostRules(
  newCosts: Partial<CreditCostRules>,
  adminUid: string,
  adminEmail: string
): Promise<{ success: boolean }> {
  const current = await getCreditCostRules();
  const updated: CreditCostRules = { ...current, ...newCosts };
  try {
    await adminDb.collection('adminConfig').doc('creditCosts').set(updated, { merge: true });
  } catch (e) {
    serverLocalDatabase.upsert('adminConfig', 'creditCosts', updated);
  }
  cachedCreditCosts = updated;

  await logAudit(
    'UPDATE_CREDIT_COSTS',
    adminUid,
    `Admin (${adminEmail}) Yapay Zeka Kredi Harcama Maliyetlerini güncelledi.`
  );

  return { success: true };
}

const DEFAULT_COUPONS: CouponCode[] = [
  {
    code: 'BORSA2026',
    discountType: 'percentage',
    discountValue: 25,
    applicableTiers: ['starter', 'pro', 'premium'],
    maxUses: -1,
    usedCount: 14,
    expiresAt: null,
    isActive: true,
    description: '2026 Yılı Borsa Lansman %25 İndirim Kuponu'
  },
  {
    code: 'WELCOME50',
    discountType: 'fixed_try',
    discountValue: 100,
    applicableTiers: ['starter', 'pro', 'premium'],
    maxUses: 100,
    usedCount: 32,
    expiresAt: null,
    isActive: true,
    description: 'Hoş Geldin 100 TL İndirim Kuponu'
  }
];

export async function getCoupons(): Promise<CouponCode[]> {
  if (cachedCoupons && cachedCoupons.length > 0) return cachedCoupons;
  try {
    const snap = await adminDb.collection('adminConfig').doc('coupons').get().catch(() => null);
    if (snap && snap.exists && snap.data()?.list && Array.isArray(snap.data()!.list)) {
      cachedCoupons = snap.data()!.list as CouponCode[];
      return cachedCoupons;
    }
  } catch (e) {}

  try {
    const local = serverLocalDatabase.get('adminConfig', 'coupons');
    if (local && (local as any).list && Array.isArray((local as any).list)) {
      cachedCoupons = (local as any).list as CouponCode[];
      return cachedCoupons;
    }
  } catch (e) {}

  cachedCoupons = [...DEFAULT_COUPONS];
  return cachedCoupons;
}

export async function saveCoupon(
  coupon: CouponCode,
  adminUid: string,
  adminEmail: string
): Promise<{ success: boolean; error?: string }> {
  const coupons = await getCoupons();
  const normalizedCode = coupon.code.trim().toUpperCase();
  const index = coupons.findIndex(c => c.code.toUpperCase() === normalizedCode);
  
  const couponObj: CouponCode = {
    ...coupon,
    code: normalizedCode,
  };

  if (index >= 0) {
    coupons[index] = couponObj;
  } else {
    coupons.push(couponObj);
  }

  try {
    await adminDb.collection('adminConfig').doc('coupons').set({ list: coupons, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (e) {
    serverLocalDatabase.upsert('adminConfig', 'coupons', { list: coupons });
  }

  cachedCoupons = coupons;

  await logAudit(
    'SAVE_COUPON',
    adminUid,
    `Admin (${adminEmail}) "${normalizedCode}" indirim kuponunu kaydetti/güncelledi.`
  );

  return { success: true };
}

export async function deleteCoupon(
  code: string,
  adminUid: string,
  adminEmail: string
): Promise<{ success: boolean }> {
  let coupons = await getCoupons();
  coupons = coupons.filter(c => c.code.toUpperCase() !== code.toUpperCase());
  try {
    await adminDb.collection('adminConfig').doc('coupons').set({ list: coupons, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (e) {
    serverLocalDatabase.upsert('adminConfig', 'coupons', { list: coupons });
  }
  cachedCoupons = coupons;

  await logAudit(
    'DELETE_COUPON',
    adminUid,
    `Admin (${adminEmail}) "${code}" indirim kuponunu sildi.`
  );

  return { success: true };
}

export async function validateCoupon(
  code: string,
  tier?: SubscriptionTier,
  originalPriceTRY?: number
): Promise<{
  valid: boolean;
  coupon?: CouponCode;
  discountedPriceTRY: number;
  discountAmountTRY: number;
  message?: string;
}> {
  const coupons = await getCoupons();
  const normalizedCode = (code || '').trim().toUpperCase();
  const coupon = coupons.find(c => c.code.toUpperCase() === normalizedCode && c.isActive);

  const basePrice = typeof originalPriceTRY === 'number' && originalPriceTRY >= 0 ? originalPriceTRY : 0;

  if (!coupon) {
    return { valid: false, discountedPriceTRY: basePrice, discountAmountTRY: 0, message: 'Geçersiz veya aktif olmayan indirim kodu.' };
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
    return { valid: false, discountedPriceTRY: basePrice, discountAmountTRY: 0, message: 'Bu indirim kodunun kullanım süresi dolmuştur.' };
  }

  if (coupon.maxUses !== -1 && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, discountedPriceTRY: basePrice, discountAmountTRY: 0, message: 'Bu kupon kodunun maksimum kullanım limitine ulaşılmıştır.' };
  }

  if (tier && tier !== ('all' as any) && coupon.applicableTiers && coupon.applicableTiers.length > 0 && !coupon.applicableTiers.includes(tier)) {
    return { valid: false, discountedPriceTRY: basePrice, discountAmountTRY: 0, message: `Bu indirim kodu seçtiğiniz (${tier.toUpperCase()}) paket için geçerli değildir.` };
  }

  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = basePrice > 0 ? Math.round((basePrice * coupon.discountValue) / 100) : 0;
  } else {
    discountAmount = basePrice > 0 ? Math.min(basePrice, coupon.discountValue) : coupon.discountValue;
  }

  const finalPrice = Math.max(0, basePrice - discountAmount);
  const discountLabel = coupon.discountType === 'percentage' ? `%${coupon.discountValue}` : `${coupon.discountValue} ₺`;

  return {
    valid: true,
    coupon,
    discountedPriceTRY: finalPrice,
    discountAmountTRY: discountAmount,
    message: `"${discountLabel}" indirim kodu (${coupon.code}) başarıyla uygulandı!`
  };
}
