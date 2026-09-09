import { Request, Response, NextFunction } from 'express';
import { 
  getUserSubscriptionAndUsage, 
  recordAndCheckUsage 
} from '../services/subscriptionService';
import { 
  SubscriptionPlanLimits, 
  SubscriptionTier, 
  UserSubscription, 
  UserUsage, 
  getRequiredTierForFeature,
  isFeatureAllowed,
  SUBSCRIPTION_PLANS 
} from '../../src/shared/subscriptionPlans';

// Extend Express Request to include subscription data
declare global {
  namespace Express {
    interface Request {
      subscription?: UserSubscription;
      usage?: UserUsage;
      planTier?: SubscriptionTier;
    }
  }
}

/**
 * Middleware that loads user's subscription and usage into req
 */
export const loadSubscriptionContext = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = req.user?.uid || 'guest_user';
    const { subscription, usage } = await getUserSubscriptionAndUsage(uid, req.idToken);
    req.subscription = subscription;
    req.usage = usage;
    
    const isAdmin = req.userRole === 'admin' || req.userRole === 'superadmin' || req.user?.email === 'boschozgur@gmail.com' || uid === 'admin_boschozgur';
    if (isAdmin) {
      req.planTier = 'premium';
      if (req.subscription) {
        req.subscription.tier = 'premium';
        req.subscription.status = 'active';
      }
    } else {
      req.planTier = subscription.tier || 'free';
    }
    next();
  } catch (err) {
    const isAdmin = req.userRole === 'admin' || req.userRole === 'superadmin' || req.user?.email === 'boschozgur@gmail.com';
    if (isAdmin) {
      req.planTier = 'premium';
      req.subscription = {
        tier: 'premium',
        status: 'active',
        grantedAt: new Date().toISOString(),
        expiresAt: null,
        grantedBy: 'system_admin'
      };
    } else {
      req.planTier = 'free';
    }
    next();
  }
};

/**
 * Guard for stock/fund analysis queries (Free tier max 3/day)
 */
export const checkAnalysisLimit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = req.user?.uid || 'guest_user';
    // Admin always bypasses limit
    if (req.userRole === 'admin' || req.userRole === 'superadmin') {
      return next();
    }

    const check = await recordAndCheckUsage(uid, 'analysis');
    if (!check.allowed) {
      return res.status(403).json({
        error: check.error || 'Günlük analiz sorgu limitinize ulaştınız.',
        code: 'LIMIT_REACHED',
        metric: 'analysisQueriesToday',
        currentCount: check.currentCount,
        limit: check.limit,
        tier: check.tier,
        upgradeRequired: 'starter',
        message: 'Günlük analiz kotanız doldu. Sınırsız analiz için Başlangıç veya Pro pakete geçebilirsiniz.'
      });
    }

    next();
  } catch (err: any) {
    console.error('[SubscriptionGuard] checkAnalysisLimit error:', err);
    next();
  }
};

/**
 * Guard for AI report generation (Free tier 1/week, Starter 3/day, Pro/Premium unlimited)
 */
export const checkAiReportLimit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = req.user?.uid || 'guest_user';
    if (req.userRole === 'admin' || req.userRole === 'superadmin') {
      return next();
    }

    const check = await recordAndCheckUsage(uid, 'ai_report');
    if (!check.allowed) {
      return res.status(403).json({
        error: check.error || 'AI Raporu oluşturma limitinize ulaştınız.',
        code: 'AI_LIMIT_REACHED',
        metric: 'aiReportsThisPeriod',
        currentCount: check.currentCount,
        limit: check.limit,
        tier: check.tier,
        upgradeRequired: check.tier === 'free' ? 'starter' : 'pro',
        message: check.error
      });
    }

    next();
  } catch (err: any) {
    console.error('[SubscriptionGuard] checkAiReportLimit error:', err);
    next();
  }
};

/**
 * Guard factory to require a specific boolean/numeric feature from the subscription
 */
export const requireSubscriptionFeature = (featureKey: keyof SubscriptionPlanLimits) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uid = req.user?.uid || 'guest_user';
      if (req.userRole === 'admin' || req.userRole === 'superadmin') {
        return next();
      }

      const { subscription, plan } = await getUserSubscriptionAndUsage(uid, req.idToken);
      req.subscription = subscription;
      req.planTier = subscription.tier;

      const allowed = isFeatureAllowed(subscription.tier, featureKey);
      if (!allowed) {
        const requiredTier = getRequiredTierForFeature(featureKey);
        return res.status(403).json({
          error: `Bu özellik (${String(featureKey)}) için ${SUBSCRIPTION_PLANS[requiredTier]?.name || 'daha üst'} paket gereklidir.`,
          code: 'FEATURE_LOCKED',
          feature: featureKey,
          currentTier: subscription.tier,
          requiredTier,
          message: `Bu özelliğe erişebilmek için lütfen üyeliğinizi ${SUBSCRIPTION_PLANS[requiredTier]?.name || 'Pro'} pakete yükseltin.`
        });
      }

      next();
    } catch (err: any) {
      console.error(`[SubscriptionGuard] requireSubscriptionFeature(${featureKey}) error:`, err);
      next();
    }
  };
};

/**
 * Guard for Backtest parameters (Years & Multi-Asset limit)
 */
export const checkBacktestPlanLimits = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = req.user?.uid || 'guest_user';
    if (req.userRole === 'admin' || req.userRole === 'superadmin') {
      return next();
    }

    const { subscription, plan } = await getUserSubscriptionAndUsage(uid, req.idToken);
    const { config } = req.body || {};
    
    if (config) {
      // 1. Check Multi-Asset
      const assetCount = (config.assets || []).length;
      if (assetCount > 1 && !plan.limits.backtestMultiAsset) {
        return res.status(403).json({
          error: 'Çoklu varlık portföy backtesti için Başlangıç veya Pro üyelik gereklidir.',
          code: 'FEATURE_LOCKED',
          feature: 'backtestMultiAsset',
          currentTier: subscription.tier,
          requiredTier: 'starter'
        });
      }

      // 2. Check Backtest Years
      const yearsRequested = config.years || (config.period === '5Y' ? 5 : config.period === '3Y' ? 3 : config.period === 'MAX' ? 10 : 1);
      const maxYearsAllowed = plan.limits.backtestMaxYears; // 1, 5, or -1

      if (maxYearsAllowed !== -1 && yearsRequested > maxYearsAllowed) {
        const requiredTier = yearsRequested > 5 ? 'pro' : 'starter';
        return res.status(403).json({
          error: `${yearsRequested} yıllık geriye dönük test için ${SUBSCRIPTION_PLANS[requiredTier].name} paketi gereklidir. Mevcut paketiniz (${plan.name}) maksimum ${maxYearsAllowed} yıla izin vermektedir.`,
          code: 'FEATURE_LOCKED',
          feature: 'backtestMaxYears',
          maxYearsAllowed,
          yearsRequested,
          currentTier: subscription.tier,
          requiredTier
        });
      }
    }

    next();
  } catch (err) {
    console.error('[SubscriptionGuard] checkBacktestPlanLimits error:', err);
    next();
  }
};
