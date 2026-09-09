const fs = require('fs');
let content = fs.readFileSync('server/utils/paywallMasker.ts', 'utf8');

content = content.replace(
  /export function maskOpportunity\(opp: any, index: number, tier: SubscriptionTier \| undefined\) {\n  const hasFeature = isFeatureAllowed\(tier, 'peerComparison'\);/g,
  `export function maskOpportunity(opp: any, index: number, tier: SubscriptionTier | undefined) {
  const hasFeature = isFeatureAllowed(tier, 'opportunityScanner');`
);

content = content.replace(
  /export function maskTefasFunds\(funds: any\[\], tier: SubscriptionTier \| undefined\) {\n  const hasFeature = isFeatureAllowed\(tier, 'peerComparison'\);/g,
  `export function maskTefasFunds(funds: any[], tier: SubscriptionTier | undefined) {
  const hasFeature = isFeatureAllowed(tier, 'advancedFundMetrics');`
);

fs.writeFileSync('server/utils/paywallMasker.ts', content);
