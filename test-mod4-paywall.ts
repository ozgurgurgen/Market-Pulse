import { isFeatureAllowed, SUBSCRIPTION_PLANS, SubscriptionTier, SubscriptionPlanLimits } from './src/shared/subscriptionPlans.ts';
import { maskStockAnalysisDetail, maskOpportunity, maskWatchlistItems, maskTefasFunds, maskIpoData } from './server/utils/paywallMasker.ts';

async function runPaywallTest() {
  console.log("--- MODÜL 4: PAYWALL FLAG - FEATURE MAPPING TABLOSU ---");
  const tiers: SubscriptionTier[] = ['free', 'starter', 'pro', 'premium'];
  
  // Table 1: Feature vs Tier Matrix
  console.log("\n| Özellik / Flag             | FREE  | STARTER | PRO   | PREMIUM |");
  console.log("|----------------------------|-------|---------|-------|---------|");
  
  // Extract all limit keys from the premium plan
  const premiumLimits = SUBSCRIPTION_PLANS['premium'].limits;
  const features = Object.keys(premiumLimits) as (keyof SubscriptionPlanLimits)[];
  
  for (const feature of features) {
    const row = tiers.map(tier => {
      const val = SUBSCRIPTION_PLANS[tier].limits[feature];
      if (typeof val === 'boolean') return val ? '✅' : '❌';
      if (val === -1) return '∞ ';
      return val.toString().padEnd(2, ' ');
    });
    console.log(`| ${feature.padEnd(26)} | ${row.join('    | ')}    |`);
  }

  console.log("\n--- MASKING (PAYWALL) TESTS ---");

  const mockStockAnalysis = {
    targetShortTerm: 150,
    targetMidTerm: 180,
    stopLoss: 120,
    riskReward: 2.5,
    institutionalInOutScore: 8,
    riskScore: 3,
    basicInfo: "Visible"
  };

  for (const tier of tiers) {
    const isAllowed = isFeatureAllowed(tier, 'advancedStockMetrics');
    const masked = maskStockAnalysisDetail(mockStockAnalysis, tier);
    
    // Test for expected masking
    const isActuallyMasked = masked._isMasked === true && masked.targetShortTerm === null;
    
    console.log(`[${tier.toUpperCase()}] advancedStockMetrics Expected: ${isAllowed ? 'VISIBLE' : 'MASKED'} -> Actual behavior: ${isActuallyMasked ? 'MASKED' : 'VISIBLE'}`);
    
    if (isAllowed === isActuallyMasked) {
      console.log(`❌ TEST FAILED: Logic mismatch for ${tier}`);
    } else {
      console.log(`✅ TEST PASSED for ${tier}`);
    }
  }

  process.exit(0);
}

runPaywallTest();
