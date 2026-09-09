import { Router, Request, Response } from 'express';
import { 
  getUserSubscriptionAndUsage, 
  updateUserSubscription, 
  resetUserUsage 
} from '../services/subscriptionService';
import { requireAdmin } from '../middlewares/requireAdmin';

import { adminDb } from '../services/firebaseAdminService';
import { serverLocalDatabase } from '../services/serverLocalDatabase';
import { 
  SUBSCRIPTION_PLANS, 
  SubscriptionTier, 
  UserSubscription 
} from '../../src/shared/subscriptionPlans';
import { logAudit } from '../services/auditService';
import { 
  getDynamicSubscriptionPlans,
  getCreditCostRules,
  validateCoupon 
} from '../services/adminConfigService';
import { deductUserCredits } from '../services/subscriptionService';

export const subscriptionRouter = Router();

/**
 * GET /api/subscription/credit-costs
 * Returns credit cost rules per AI feature
 */
subscriptionRouter.get('/credit-costs', async (req: Request, res: Response) => {
  try {
    const costs = await getCreditCostRules();
    return res.json({ success: true, creditCosts: costs });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/subscription/validate-coupon
 * Validates a promo coupon code and calculates discount amount
 */
subscriptionRouter.post('/validate-coupon', async (req: Request, res: Response) => {
  try {
    const { code, tier, originalPriceTRY } = req.body || {};
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ valid: false, message: 'Lütfen geçerli bir indirim kodu giriniz.' });
    }

    const price = typeof originalPriceTRY === 'number' ? originalPriceTRY : 0;
    const targetTier: SubscriptionTier = tier || 'pro';

    const result = await validateCoupon(code, targetTier, price);
    return res.json({ success: true, ...result });
  } catch (error: any) {
    return res.status(500).json({ valid: false, message: error.message });
  }
});

/**
 * POST /api/subscription/deduct-credits
 * Deducts AI credits for a feature call
 */
subscriptionRouter.post('/deduct-credits', async (req: Request, res: Response) => {
  try {
    const uid = req.user?.uid || 'guest_user';
    const { amount, featureName } = req.body || {};
    const creditAmount = typeof amount === 'number' && amount > 0 ? amount : 1;
    const feature = typeof featureName === 'string' ? featureName : 'AI Sorgusu';

    const result = await deductUserCredits(uid, creditAmount, feature);
    if (!result.allowed) {
      return res.status(402).json({ success: false, ...result });
    }
    return res.json({ success: true, ...result });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/subscription/me
 * Returns current logged-in user's subscription, usage, and plan details
 */
subscriptionRouter.get('/me', async (req: Request, res: Response) => {
  try {
    const uid = req.user?.uid || 'guest_user';
    const [data, dynamicPlans] = await Promise.all([
      getUserSubscriptionAndUsage(uid, req.idToken),
      getDynamicSubscriptionPlans()
    ]);
    return res.json({
      success: true,
      subscription: data.subscription,
      usage: data.usage,
      plan: dynamicPlans[data.subscription.tier] || data.plan,
      plansConfig: dynamicPlans
    });
  } catch (error: any) {
    console.error('Error fetching user subscription:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/subscription/plans
 * Returns all available subscription plans and their features from dynamic Firestore/local config
 */
subscriptionRouter.get('/plans', async (req: Request, res: Response) => {
  try {
    const plans = await getDynamicSubscriptionPlans();
    return res.json({
      success: true,
      plans
    });
  } catch {
    return res.json({
      success: true,
      plans: SUBSCRIPTION_PLANS
    });
  }
});

/**
 * POST /api/subscription/request-upgrade
 * Allows a user to submit a manual plan upgrade inquiry or contact request
 */
subscriptionRouter.post('/request-upgrade', async (req: Request, res: Response) => {
  try {
    const uid = req.user?.uid || 'guest_user';
    const { requestedTier, note, billingCycle } = req.body || {};

    const validTiers = Object.keys(SUBSCRIPTION_PLANS);
    if (!requestedTier || typeof requestedTier !== 'string' || !validTiers.includes(requestedTier)) {
      return res.status(400).json({ error: 'Geçersiz veya eksik abonelik paketi (requestedTier).' });
    }

    if (billingCycle && !['monthly', 'annually'].includes(billingCycle)) {
      return res.status(400).json({ error: 'Geçersiz faturalandırma dönemi (billingCycle).' });
    }

    const requestRecord = {
      uid,
      email: req.user?.email || 'Bilinmiyor',
      requestedTier,
      billingCycle: billingCycle || 'monthly',
      note: typeof note === 'string' ? note.slice(0, 500) : '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      await adminDb.collection('upgrade_requests').add(requestRecord);
    } catch (e: any) {
      console.warn('[SubscriptionRouter] Failed to record upgrade request in Firestore:', e?.message || e);
    }

    logAudit(
      'UPGRADE_REQUEST_SUBMITTED', 
      uid, 
      `User requested upgrade to ${requestedTier} (${billingCycle})`
    );

    return res.json({
      success: true,
      message: 'Yükseltme talebiniz başarıyla alındı! Yönetici ekibimiz en kısa sürede hesabınızı onaylayacaktır.',
      request: requestRecord
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * ==========================================
 * ADMIN ONLY ENDPOINTS
 * ==========================================
 */

/**
 * POST /api/admin/grant-subscription
 * Admin grants or updates a user's subscription tier
 */
subscriptionRouter.post('/grant-subscription', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { targetUid, tier, durationDays, note } = req.body as {
      targetUid: string;
      tier: SubscriptionTier;
      durationDays?: number;
      note?: string;
    };

    if (!targetUid) {
      return res.status(400).json({ error: 'targetUid parametresi zorunludur.' });
    }

    if (!tier || !SUBSCRIPTION_PLANS[tier]) {
      return res.status(400).json({ error: 'Geçersiz üyelik paketi (tier).' });
    }

    const updatedSub = await updateUserSubscription(targetUid, {
      tier,
      status: 'manual_grant',
      durationDays: durationDays !== undefined ? durationDays : (tier === 'free' ? null : 365),
      grantedBy: req.user?.uid || 'admin',
      note: note || 'Yönetici manuel yükseltme işlemi'
    });

    return res.json({
      success: true,
      message: `Kullanıcı (${targetUid}) üyeliği başarıyla ${tier.toUpperCase()} paketine güncellendi.`,
      subscription: updatedSub
    });
  } catch (error: any) {
    console.error('Admin grant subscription error:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/admin/users-subscriptions
 * Admin lists all users with their current subscriptions and usage stats
 */
subscriptionRouter.get('/users-subscriptions', requireAdmin, async (req: Request, res: Response) => {
  try {
    let users: any[] = [];

    try {
      const snap = await adminDb.collection('users').get();
      snap.forEach(doc => {
        const d = doc.data();
        const userObj = {
          uid: doc.id,
          email: d.email || '—',
          fullName: d.fullName || d.displayName || 'İsimsiz',
          role: d.role || 'standard_user',
          subscription: d.subscription || {
            tier: d.role === 'admin' ? 'premium' : 'free',
            status: 'active',
            grantedAt: d.createdAt || new Date().toISOString(),
            expiresAt: null,
            grantedBy: 'system'
          },
          usage: d.usage || {
            analysisQueriesToday: 0,
            aiReportsThisPeriod: 0,
            lastResetDate: new Date().toISOString().slice(0, 10)
          },
          createdAt: d.createdAt || null
        };
        users.push(userObj);
      });
    } catch (e: any) {
      console.warn('[SubscriptionRouter] Failed to fetch users from Firestore:', e?.message);
    }

    if (users.length === 0) {
      users = [
        {
          uid: 'admin_boschozgur',
          email: 'boschozgur@gmail.com',
          fullName: 'Özgür Bosch (Admin)',
          role: 'admin',
          subscription: { tier: 'premium', status: 'active', grantedAt: new Date().toISOString(), expiresAt: null, grantedBy: 'system' },
          usage: { analysisQueriesToday: 2, aiReportsThisPeriod: 5, lastResetDate: new Date().toISOString().slice(0, 10) },
          createdAt: new Date().toISOString()
        },
        {
          uid: 'user_sample_1',
          email: 'yatirimci1@marketpulse.local',
          fullName: 'Ahmet Yılmaz',
          role: 'standard_user',
          subscription: { tier: 'free', status: 'active', grantedAt: new Date().toISOString(), expiresAt: null, grantedBy: 'system' },
          usage: { analysisQueriesToday: 1, aiReportsThisPeriod: 1, lastResetDate: new Date().toISOString().slice(0, 10) },
          createdAt: new Date().toISOString()
        }
      ];
      for (const u of users) {
        try {
          await adminDb.collection('users').doc(u.uid).set(u, { merge: true });
        } catch {}
      }
    }

    return res.json({
      success: true,
      users
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/admin/reset-user-usage
 * Admin resets daily and weekly usage counters for a user
 */
subscriptionRouter.post('/reset-user-usage', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { targetUid } = req.body;
    if (!targetUid) {
      return res.status(400).json({ error: 'targetUid is required' });
    }

    const newUsage = await resetUserUsage(targetUid);
    logAudit('USAGE_RESET', req.user?.uid || 'admin', `Reset usage for user ${targetUid}`);

    return res.json({
      success: true,
      message: `Kullanıcının (${targetUid}) analiz ve rapor kullanım sayaçları sıfırlandı.`,
      usage: newUsage
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});
