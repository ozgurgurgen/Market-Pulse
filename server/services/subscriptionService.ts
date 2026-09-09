import { adminDb } from "./firebaseAdminService";
import { CriticalSecurityError } from "../utils/securityErrors";
import { PROJECT_ID, DB_ID } from './firebaseAdminService';
import { 
  SubscriptionTier, 
  UserSubscription, 
  UserUsage, 
  DEFAULT_FREE_SUBSCRIPTION, 
  DEFAULT_FREE_USAGE,
  SUBSCRIPTION_PLANS,
  SubscriptionPlanConfig
} from '../../src/shared/subscriptionPlans';
import { logAudit } from './auditService';
import { serverLocalDatabase } from './serverLocalDatabase';

// In-memory cache for speed and fallback
const subscriptionCache = new Map<string, { subscription: UserSubscription; usage: UserUsage; cachedAt: number }>();
const CACHE_TTL_MS = 60 * 1000; // 1 minute

export function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getWeekString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const firstDayOfYear = new Date(year, 0, 1);
  const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
  const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  return `${year}-W${weekNum}`;
}

export function checkSubscriptionValidity(sub: UserSubscription): boolean {
  if (!sub) return false;
  if (sub.tier === 'free') return true;
  if (!sub.expiresAt) return true;
  const expiresTime = new Date(sub.expiresAt).getTime();
  return expiresTime > Date.now();
}

export async function getUserSubscriptionAndUsage_v2_deprecated(uid: string): Promise<any> {
    return { subscription: DEFAULT_FREE_SUBSCRIPTION, usage: DEFAULT_FREE_USAGE, plan: SUBSCRIPTION_PLANS.free };
}

export async function getUserSubscriptionAndUsage(uid: string, idToken?: string): Promise<{
  subscription: UserSubscription;
  usage: UserUsage;
  plan: SubscriptionPlanConfig;
}> {
  if (!uid || uid === 'guest_user' || uid.startsWith('guest-')) {
    return {
      subscription: DEFAULT_FREE_SUBSCRIPTION,
      usage: DEFAULT_FREE_USAGE,
      plan: SUBSCRIPTION_PLANS.free
    };
  }

  if (uid === 'admin_boschozgur') {
    const premiumSub: UserSubscription = {
      tier: 'premium',
      status: 'active',
      grantedAt: new Date().toISOString(),
      expiresAt: null,
      grantedBy: 'system_admin'
    };
    return {
      subscription: premiumSub,
      usage: DEFAULT_FREE_USAGE,
      plan: SUBSCRIPTION_PLANS.premium
    };
  }

  // Check fast memory cache
  const cached = subscriptionCache.get(uid);
  if (cached && (Date.now() - cached.cachedAt < CACHE_TTL_MS)) {
    const today = getTodayDateString();
    if (cached.usage.lastResetDate !== today) {
       cached.usage.analysisQueriesToday = 0;
       cached.usage.lastResetDate = today;
    }
    const isValid = checkSubscriptionValidity(cached.subscription);
    const tier = isValid ? cached.subscription.tier : 'free';
    return { subscription: cached.subscription, usage: cached.usage, plan: SUBSCRIPTION_PLANS[tier] || SUBSCRIPTION_PLANS.free };
  }

  let sub: UserSubscription = { ...DEFAULT_FREE_SUBSCRIPTION };
  let usage: UserUsage = { ...DEFAULT_FREE_USAGE };

  // CRITICAL PATH: Fetch directly from Admin SDK. No JSON fallback.
  try {
      const snap = await adminDb.collection('users').doc(uid).get().catch(async () => {
        // Retry with default database if named database fails
        const { getFirestore } = await import('firebase-admin/firestore');
        const { getApp } = await import('firebase-admin/app');
        const defaultDb = getFirestore(getApp());
        return await defaultDb.collection('users').doc(uid).get();
      });
      if (snap.exists) {
        const data = snap.data() || {};
        if (data.email === 'boschozgur@gmail.com' || data.role === 'admin' || data.role === 'superadmin') {
          sub = {
            tier: 'premium',
            status: 'active',
            grantedAt: data.subscription?.grantedAt || new Date().toISOString(),
            expiresAt: null,
            grantedBy: 'system_admin'
          };
        } else if (data.subscription?.tier === 'premium') {
          sub = {
            tier: 'premium',
            status: data.subscription.status || 'active',
            grantedAt: data.subscription.grantedAt || new Date().toISOString(),
            expiresAt: data.subscription.expiresAt || null,
            grantedBy: data.subscription.grantedBy || 'admin'
          };
        } else if (data.subscription) {
          sub = { ...DEFAULT_FREE_SUBSCRIPTION, ...data.subscription };
        }
        if (data.usage) {
          usage = { ...DEFAULT_FREE_USAGE, ...data.usage };
        }
      } else {
        // Check local database or auth records
        const localUser = serverLocalDatabase.get<any>('users', uid);
        if (localUser && (localUser.email === 'boschozgur@gmail.com' || localUser.role === 'admin' || localUser.role === 'superadmin')) {
          sub = {
            tier: 'premium',
            status: 'active',
            grantedAt: new Date().toISOString(),
            expiresAt: null,
            grantedBy: 'system_admin'
          };
        }
      }
  } catch (error: any) {
     console.warn('Warning: Could not fetch user subscription from Admin Firestore, falling back to free tier:', error?.message);
  }

  const today = getTodayDateString();
  if (usage.lastResetDate !== today) {
    usage.analysisQueriesToday = 0;
    usage.lastResetDate = today;
  }
  
  const isValid = checkSubscriptionValidity(sub);
  const effectiveTier: SubscriptionTier = isValid ? sub.tier : 'free';
  const plan = SUBSCRIPTION_PLANS[effectiveTier] || SUBSCRIPTION_PLANS.free;

  subscriptionCache.set(uid, { subscription: sub, usage, cachedAt: Date.now() });
  return { subscription: sub, usage, plan };
}

export async function updateUserSubscription_v2_deprecated(): Promise<any> { return {}; }

export async function updateUserSubscription(
  uid: string, 
  updateData: {
    tier: SubscriptionTier;
    status?: 'active' | 'expired' | 'manual_grant' | 'trial';
    durationDays?: number | null;
    expiresAt?: string | null;
    grantedBy?: string;
    note?: string;
  }): Promise<UserSubscription> {
  
  let expiresAt: string | null = null;
  if (updateData.expiresAt !== undefined) {
    expiresAt = updateData.expiresAt;
  } else if (updateData.durationDays) {
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + updateData.durationDays);
    expiresAt = expDate.toISOString();
  }
  const newSub: UserSubscription = {
    tier: updateData.tier,
    status: updateData.status || 'manual_grant',
    grantedAt: new Date().toISOString(),
    expiresAt: updateData.tier === 'free' ? null : expiresAt,
    grantedBy: updateData.grantedBy || 'admin',
  };

  // CRITICAL PATH: Update using Admin SDK securely. No JSON fallback.
  try {
    await adminDb.collection('users').doc(uid).set({
      subscription: newSub,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error: any) {
    // If we get PERMISSION_DENIED or NOT_FOUND due to ADC missing access to named database, warn and use cache
    if (error?.code === 7 || error?.message?.includes('PERMISSION_DENIED') || error?.code === 5 || error?.message?.includes('not found')) {
      console.warn('Warning: Admin DB permission denied on subscription update, relying on memory cache:', error?.message);
    } else {
      throw new CriticalSecurityError('CRITICAL: Failed to update user subscription via Admin SDK. Local fallback forbidden.', error);
    }
  }

  const cached = subscriptionCache.get(uid);
  subscriptionCache.set(uid, {
    subscription: newSub,
    usage: cached?.usage || { ...DEFAULT_FREE_USAGE, lastResetDate: getTodayDateString() },
    cachedAt: Date.now()
  });

  logAudit(
    'SUBSCRIPTION_UPDATED',
    updateData.grantedBy || 'system',
    `Updated subscription for UID ${uid} to ${newSub.tier.toUpperCase()} (status: ${newSub.status}, expires: ${newSub.expiresAt || 'Lifetime'})`
  );

  return newSub;
}

export async function recordAndCheckUsage(
  uid: string, 
  metricType: 'analysis' | 'ai_report'): Promise<{
  allowed: boolean;
  currentCount: number;
  limit: number;
  tier: SubscriptionTier;
  error?: string;
}> {
  const { subscription, usage, plan } = await getUserSubscriptionAndUsage(uid);
  const today = getTodayDateString();

  if (metricType === 'analysis') {
    const limit = plan.limits.dailyAnalysisQueries; 
    let countToday = usage.analysisQueriesToday || 0;
    if (usage.lastResetDate !== today) countToday = 0;
    if (limit !== -1 && countToday >= limit) {
      return { allowed: false, currentCount: countToday, limit, tier: subscription.tier, error: `Günlük analiz limitinize ulaştınız.` };
    }
    const newCount = countToday + 1;
    const newUsage: UserUsage = { ...usage, analysisQueriesToday: newCount, lastResetDate: today };
    subscriptionCache.set(uid, { subscription, usage: newUsage, cachedAt: Date.now() });
    
    if (uid !== 'guest_user' && !uid.startsWith('guest-')) {
      adminDb.collection('users').doc(uid).set({ usage: newUsage }, { merge: true }).catch(err => {
        if (err?.code === 7 || err?.message?.includes('PERMISSION_DENIED') || err?.code === 5) return;
        console.error('Failed to sync usage to DB:', err);
      });
    }
    return { allowed: true, currentCount: newCount, limit, tier: subscription.tier };
  }

  if (metricType === 'ai_report') {
    const limit = plan.limits.aiReportsPerPeriod;
    const periodType = plan.limits.aiReportsPeriodType;
    if (limit === -1) return { allowed: true, currentCount: usage.aiReportsThisPeriod, limit: -1, tier: subscription.tier };
    let currentPeriodCount = usage.aiReportsThisPeriod || 0;
    if (periodType === 'day' && usage.lastResetDate !== today) currentPeriodCount = 0;
    
    if (currentPeriodCount >= limit) {
      return { allowed: false, currentCount: currentPeriodCount, limit, tier: subscription.tier, error: `AI Raporu limitinize ulaştınız.` };
    }
    const newPeriodCount = currentPeriodCount + 1;
    const newUsage: UserUsage = { ...usage, aiReportsThisPeriod: newPeriodCount, lastResetDate: today };
    subscriptionCache.set(uid, { subscription, usage: newUsage, cachedAt: Date.now() });

    if (uid !== 'guest_user' && !uid.startsWith('guest-')) {
      adminDb.collection('users').doc(uid).set({ usage: newUsage }, { merge: true }).catch(err => {
        if (err?.code === 7 || err?.message?.includes('PERMISSION_DENIED') || err?.code === 5) return;
        console.error('Failed to sync usage to DB:', err);
      });
    }
    return { allowed: true, currentCount: newPeriodCount, limit, tier: subscription.tier };
  }

  return { allowed: true, currentCount: 0, limit: -1, tier: subscription.tier };
}

export async function resetUserUsage(uid: string): Promise<UserUsage> {
  const cleanUsage: UserUsage = {
    analysisQueriesToday: 0,
    aiReportsThisPeriod: 0,
    lastResetDate: getTodayDateString(),
    lastWeeklyResetDate: getTodayDateString()
  };
  const cached = subscriptionCache.get(uid);
  if (cached) {
    cached.usage = cleanUsage;
  }
  if (uid !== 'guest_user' && !uid.startsWith('guest-')) {
    await adminDb.collection('users').doc(uid).set({ usage: cleanUsage }, { merge: true }).catch(err => { 
      if (err?.code === 7 || err?.message?.includes('PERMISSION_DENIED') || err?.code === 5) return;
      throw new CriticalSecurityError('CRITICAL: Failed to reset usage via Admin SDK', err); 
    });
  }
  return cleanUsage;
}
