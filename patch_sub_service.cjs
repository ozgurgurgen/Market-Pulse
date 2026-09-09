const fs = require('fs');

let content = fs.readFileSync('server/services/subscriptionService.ts', 'utf8');

const newGetUserSub = `
export async function getUserSubscriptionAndUsage_v2_deprecated(uid: string): Promise<any> {
    return { subscription: DEFAULT_FREE_SUBSCRIPTION, usage: DEFAULT_FREE_USAGE, plan: SUBSCRIPTION_PLANS.free };
}

export async function getUserSubscriptionAndUsage(uid: string): Promise<{
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
      const snap = await adminDb.collection('users').doc(uid).get();
      if (snap.exists) {
        const data = snap.data() || {};
        if (data.role === 'admin' || data.role === 'superadmin') {
          sub = {
            tier: 'premium',
            status: 'manual_grant',
            grantedAt: data.subscription?.grantedAt || new Date().toISOString(),
            expiresAt: null,
            grantedBy: 'system_admin'
          };
        } else if (data.subscription) {
          sub = { ...DEFAULT_FREE_SUBSCRIPTION, ...data.subscription };
        }
        if (data.usage) {
          usage = { ...DEFAULT_FREE_USAGE, ...data.usage };
        }
      }
  } catch (error: any) {
     throw new CriticalSecurityError('CRITICAL: Failed to securely fetch user subscription from Admin Firestore. Local fallback forbidden.', error);
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
`;

const newUpdateUserSub = `
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
    throw new CriticalSecurityError('CRITICAL: Failed to update user subscription via Admin SDK. Local fallback forbidden.', error);
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
    \`Updated subscription for UID \${uid} to \${newSub.tier.toUpperCase()} (status: \${newSub.status}, expires: \${newSub.expiresAt || 'Lifetime'})\`
  );

  return newSub;
}
`;

content = content.replace(/import \{ serverDb \} from '\.\/firebaseClientService';/, 'import { adminDb } from "./firebaseAdminService";\nimport { CriticalSecurityError } from "../utils/securityErrors";');
content = content.replace(/import \{ doc, getDoc, setDoc \} from 'firebase\/firestore';\n/, '');

// Replace old getUserSubscriptionAndUsage
content = content.replace(/export async function getUserSubscriptionAndUsage[\s\S]*?export function checkSubscriptionValidity/m, newGetUserSub + '\n\n/**\n * Check if a subscription has expired */\nexport function checkSubscriptionValidity');

// Replace old updateUserSubscription
content = content.replace(/export async function updateUserSubscription[\s\S]*?export async function recordAndCheckUsage/m, newUpdateUserSub + '\n\n/**\n * Record usage of an action and check limits */\nexport async function recordAndCheckUsage');

// Update recordAndCheckUsage
content = content.replace(/try \{[\s\S]*?const existing = serverLocalDatabase\.get\('users', uid\) \|\| \{\};[\s\S]*?serverLocalDatabase\.upsert\('users', uid, \{ \.\.\.existing, usage: newUsage \}\);[\s\S]*?\} catch \{\}[\s\S]*?setDoc\(doc\(serverDb, 'users', uid\), \{[\s\S]*?usage: newUsage[\s\S]*?\}, \{ merge: true \}\)\.catch\(\(\) => \{\}\);/gm, 
  "adminDb.collection('users').doc(uid).set({ usage: newUsage }, { merge: true }).catch(err => console.error('Failed to sync usage to DB:', err));");

// Update resetUserUsage
content = content.replace(/try \{[\s\S]*?const existing = serverLocalDatabase\.get\('users', uid\) \|\| \{\};[\s\S]*?serverLocalDatabase\.upsert\('users', uid, \{ \.\.\.existing, usage: cleanUsage \}\);[\s\S]*?\} catch \{\}[\s\S]*?await setDoc\(doc\(serverDb, 'users', uid\), \{[\s\S]*?usage: cleanUsage[\s\S]*?\}, \{ merge: true \}\)\.catch\(\(\) => \{\}\);/g,
  "await adminDb.collection('users').doc(uid).set({ usage: cleanUsage }, { merge: true }).catch(err => { throw new CriticalSecurityError('CRITICAL: Failed to reset usage via Admin SDK', err); });");

fs.writeFileSync('server/services/subscriptionService.ts', content);
