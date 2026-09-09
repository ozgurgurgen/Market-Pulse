import { useState, useCallback, useMemo, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  SubscriptionTier, 
  SubscriptionPlanLimits, 
  SubscriptionPlanConfig, 
  UserSubscription, 
  UserUsage,
  SUBSCRIPTION_PLANS,
  DEFAULT_FREE_SUBSCRIPTION,
  DEFAULT_FREE_USAGE,
  isFeatureAllowed as checkIsFeatureAllowed,
  getRequiredTierForFeature
} from '../shared/subscriptionPlans';
import { safeFetchJson } from '../utils/apiClient';

export interface UseSubscriptionReturn {
  tier: SubscriptionTier;
  subscription: UserSubscription;
  usage: UserUsage;
  plan: SubscriptionPlanConfig;
  isAdmin: boolean;
  canAccess: (feature: keyof SubscriptionPlanLimits) => boolean;
  isFeatureLocked: (feature: keyof SubscriptionPlanLimits) => boolean;
  getRequiredTier: (feature: keyof SubscriptionPlanLimits) => SubscriptionTier;
  remainingDailyQueries: number;
  remainingAiReports: number;
  openPricingModal: (targetFeature?: string, requiredTier?: SubscriptionTier) => void;
  isUpgradeModalOpen: boolean;
  setIsUpgradeModalOpen: (open: boolean) => void;
  upgradeTargetFeature?: string;
  upgradeRequiredTier?: SubscriptionTier;
  promptUpgrade: (featureName?: string, requiredTier?: SubscriptionTier) => void;
  refreshSubscription: () => Promise<void>;
}

// Module-level cache and promise deduplication to prevent hundreds of concurrent requests
let cachedPlans: Record<SubscriptionTier, SubscriptionPlanConfig> | null = null;
let plansFetchPromise: Promise<Record<SubscriptionTier, SubscriptionPlanConfig> | null> | null = null;
const planListeners = new Set<(plans: Record<SubscriptionTier, SubscriptionPlanConfig>) => void>();

function fetchPlansOnce(): Promise<Record<SubscriptionTier, SubscriptionPlanConfig> | null> {
  if (cachedPlans) return Promise.resolve(cachedPlans);
  if (plansFetchPromise) return plansFetchPromise;

  plansFetchPromise = safeFetchJson<{ success: boolean; plans: Record<SubscriptionTier, SubscriptionPlanConfig> }>('/api/subscription/plans')
    .then(({ ok, data }) => {
      if (ok && data?.plans) {
        cachedPlans = data.plans;
        planListeners.forEach(fn => fn(data.plans));
        return data.plans;
      }
      return null;
    })
    .catch(() => null)
    .finally(() => {
      plansFetchPromise = null;
    });

  return plansFetchPromise;
}

export function useSubscription(): UseSubscriptionReturn {
  const { user, userData, refreshUserData } = useAuth();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeTargetFeature, setUpgradeTargetFeature] = useState<string | undefined>();
  const [upgradeRequiredTier, setUpgradeRequiredTier] = useState<SubscriptionTier | undefined>();
  const [dynamicPlans, setDynamicPlans] = useState<Record<SubscriptionTier, SubscriptionPlanConfig>>(cachedPlans || SUBSCRIPTION_PLANS);

  useEffect(() => {
    if (cachedPlans) {
      setDynamicPlans(cachedPlans);
      return;
    }
    planListeners.add(setDynamicPlans);
    fetchPlansOnce();
    return () => {
      planListeners.delete(setDynamicPlans);
    };
  }, []);

  const isAdmin = userData?.role === 'admin' || 
                  userData?.role === 'superadmin' || 
                  userData?.email === 'boschozgur@gmail.com' || 
                  user?.email === 'boschozgur@gmail.com';

  const subscription: UserSubscription = useMemo(() => {
    if (isAdmin) {
      return {
        tier: 'admin',
        status: 'active',
        grantedAt: new Date().toISOString(),
        expiresAt: null,
        grantedBy: 'system_admin'
      };
    }
    return userData?.subscription || DEFAULT_FREE_SUBSCRIPTION;
  }, [userData?.subscription, isAdmin]);

  const usage: UserUsage = useMemo(() => {
    return userData?.usage || DEFAULT_FREE_USAGE;
  }, [userData?.usage]);

  const tier: SubscriptionTier = isAdmin ? 'admin' : (subscription.tier || 'free');
  const plansMap = dynamicPlans || SUBSCRIPTION_PLANS;
  const plan: SubscriptionPlanConfig = isAdmin 
    ? (plansMap.admin || SUBSCRIPTION_PLANS.admin) 
    : (plansMap[tier] || plansMap.free || SUBSCRIPTION_PLANS[tier] || SUBSCRIPTION_PLANS.free);

  const canAccess = useCallback((feature: keyof SubscriptionPlanLimits): boolean => {
    if (isAdmin || tier === 'admin') return true;
    const currentPlansMap = dynamicPlans || SUBSCRIPTION_PLANS;
    const currentPlan = currentPlansMap[tier] || currentPlansMap.free || SUBSCRIPTION_PLANS[tier];
    const val = currentPlan?.limits[feature];
    if (typeof val === 'boolean') return val;
    if (typeof val === 'number') return val !== 0;
    return checkIsFeatureAllowed(tier, feature);
  }, [tier, isAdmin, dynamicPlans]);

  const isFeatureLocked = useCallback((feature: keyof SubscriptionPlanLimits): boolean => {
    if (isAdmin || tier === 'admin') return false;
    return !canAccess(feature);
  }, [isAdmin, tier, canAccess]);

  const getRequiredTier = useCallback((feature: keyof SubscriptionPlanLimits): SubscriptionTier => {
    return getRequiredTierForFeature(feature);
  }, []);

  const remainingDailyQueries = useMemo(() => {
    if (isAdmin || plan.limits.dailyAnalysisQueries === -1) return Infinity;
    return Math.max(0, plan.limits.dailyAnalysisQueries - (usage.analysisQueriesToday || 0));
  }, [plan.limits.dailyAnalysisQueries, usage.analysisQueriesToday, isAdmin]);

  const remainingAiReports = useMemo(() => {
    if (isAdmin || plan.limits.aiReportsPerPeriod === -1) return Infinity;
    return Math.max(0, plan.limits.aiReportsPerPeriod - (usage.aiReportsThisPeriod || 0));
  }, [plan.limits.aiReportsPerPeriod, usage.aiReportsThisPeriod, isAdmin]);

  const openPricingModal = useCallback((targetFeature?: string, requiredTier?: SubscriptionTier) => {
    setUpgradeTargetFeature(targetFeature);
    setUpgradeRequiredTier(requiredTier);
    setIsUpgradeModalOpen(true);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('marketpulse-open-upgrade-modal', {
        detail: { targetFeature, requiredTier }
      }));
    }
  }, []);

  const promptUpgrade = useCallback((featureName?: string, requiredTier?: SubscriptionTier) => {
    openPricingModal(featureName, requiredTier);
  }, [openPricingModal]);

  const refreshSubscription = useCallback(async () => {
    await refreshUserData();
  }, [refreshUserData]);

  return {
    tier,
    subscription,
    usage,
    plan,
    isAdmin,
    canAccess,
    isFeatureLocked,
    getRequiredTier,
    remainingDailyQueries,
    remainingAiReports,
    openPricingModal,
    isUpgradeModalOpen,
    setIsUpgradeModalOpen,
    upgradeTargetFeature,
    upgradeRequiredTier,
    promptUpgrade,
    refreshSubscription,
  };
}
