import { isFeatureAllowed, SubscriptionTier } from '../../src/shared/subscriptionPlans';
export const paywallConfig = {
  WATCHLIST_FREE_LIMIT: 5,
  OPPORTUNITY_SCANNER_FREE_LIMIT: 3,
};

export function maskIpoData(ipo: any, tier: SubscriptionTier | undefined) {
  const hasFeature = isFeatureAllowed(tier, 'ipoTracker');
  if (hasFeature) return ipo;
  return {
    ...ipo,
    financial_health: null,
    valuation_label: null,
    relative_performance: null,
    demand_breakdown: null,
    // Note: qualitative.free_float_pct and qualitative.dividend_policy remain unmasked (kept intact if nested properly, but we'll mask the rest)
    qualitative: ipo.qualitative ? {
      free_float_pct: ipo.qualitative.free_float_pct,
      dividend_policy: ipo.qualitative.dividend_policy,
      sharia_compliant: null,
      _source: ipo.qualitative._source
    } : null,
    _isMasked: true
  };
}

export function maskOpportunity(opp: any, index: number, tier: SubscriptionTier | undefined) {
  const hasFeature = isFeatureAllowed(tier, 'opportunityScanner'); // Or another advanced feature
  if (hasFeature) return opp;
  if (index < paywallConfig.OPPORTUNITY_SCANNER_FREE_LIMIT) return opp;
  
  return {
    id: opp.id,
    symbol: 'LOCKED',
    companyName: 'Premium Fırsat',
    sector: opp.sector,
    confidenceScore: opp.confidenceScore,
    expectedReturnPct: opp.expectedReturnPct,
    timeframe: opp.timeframe,
    // Mask sensitive details
    currentPrice: null,
    targetPrice: null,
    stopLoss: null,
    catalysts: ['Bu fırsatın detaylarını görmek için Pro plana geçin.'],
    risks: [],
    _isMasked: true
  };
}

export function maskWatchlistItems(items: any[], tier: SubscriptionTier | undefined) {
  const hasFeature = isFeatureAllowed(tier, 'watchlist');
  if (hasFeature) return items;
  return items.map((item, idx) => {
    if (idx < paywallConfig.WATCHLIST_FREE_LIMIT) return item;
    return {
      ...item,
      currentPrice: null,
      changePct: null,
      _isMasked: true
    };
  });
}

export function maskStockAnalysisDetail(analysis: any, tier: SubscriptionTier | undefined) {
  const hasFeature = isFeatureAllowed(tier, 'advancedStockMetrics');
  if (hasFeature) {
    return analysis;
  }
  
  return {
    ...analysis,
    targetShortTerm: null,
    targetMidTerm: null,
    stopLoss: null,
    riskReward: null,
    institutionalInOutScore: null,
    riskScore: null,
    _isMasked: true
  };
}

export function maskTefasFunds(funds: any[], tier: SubscriptionTier | undefined) {
  const hasFeature = isFeatureAllowed(tier, 'advancedFundMetrics');
  if (hasFeature) return funds;
  return funds.map((fund, idx) => {
    if (idx < 3) return fund;
    return {
      ...fund,
      return1M: null,
      return3M: null,
      return6M: null,
      return1Y: null,
      return3Y: null,
      return5Y: null,
      _isMasked: true
    };
  });
}
