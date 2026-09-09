export const DATA_INTEGRITY_CONFIG = {
  price: {
    tiers: [
      { tier: 0, source: 'bist_api' },
      { tier: 1, source: 'binance_api' },
      { tier: 2, source: 'yahoo_finance' },
    ],
    max_age_seconds: 60, // 1 minute
    max_jump_pct: 0.15, // 15% jump max for prices (unless penny stock)
    tolerance_green: 0.005, // 0.5% diff between sources -> verified
    tolerance_yellow: 0.03, // 3% diff between sources -> unconfirmed
  },
  financial_ratio: {
    tiers: [
      { tier: 0, source: 'kap_official' },
      { tier: 1, source: 'third_party_api' },
      { tier: 2, source: 'llm_parsed' },
    ],
    max_age_seconds: 86400 * 3, // 3 days
    max_jump_pct: 0.5, // 50% jump in a single day might be anomalous for ratios like P/E
    tolerance_green: 0.01,
    tolerance_yellow: 0.05,
    llm_consensus_required: true,
    llm_confidence_threshold: 0.85
  }
};
