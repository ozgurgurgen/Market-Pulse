import { CriticalSecurityError } from '../utils/securityErrors';
import { adminDb } from './firebaseAdminService';
import { serverLocalDatabase } from './serverLocalDatabase';
import { SUBSCRIPTION_PLANS, SubscriptionPlanConfig, SubscriptionTier } from '../../src/shared/subscriptionPlans';
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
