import {
  IPOListing,
  IPOFinancialHealth,
  IPOStructuralRisk,
  IPORelativePerformance,
  IPODemandBreakdown,
  IPOQualitative,
  IPOValuationLabel
} from '../types';

/**
 * Pure calculation function for relative Day-1 alpha against BIST 100 benchmark.
 * Formula: relative_alpha_day1_pct = day1_return_pct - bist100_return_same_day_pct
 */
export function calculateRelativeAlphaDay1(
  day1ReturnPct: number | null | undefined,
  bist100ReturnSameDayPct: number | null | undefined
): number | null {
  if (day1ReturnPct == null || bist100ReturnSameDayPct == null) return null;
  if (isNaN(day1ReturnPct) || isNaN(bist100ReturnSameDayPct)) return null;
  return Number((day1ReturnPct - bist100ReturnSameDayPct).toFixed(2));
}

/**
 * Pure calculation function for percentage distance from All-Time-High (ATH).
 * Formula: ((currentPrice - post_listing_ath) / post_listing_ath) * 100
 */
export function calculateDistanceFromATH(
  currentPrice: number | null | undefined,
  postListingATH: number | null | undefined
): number | null {
  if (currentPrice == null || postListingATH == null) return null;
  if (postListingATH <= 0 || isNaN(currentPrice) || isNaN(postListingATH)) return null;
  return Number((((currentPrice - postListingATH) / postListingATH) * 100).toFixed(2));
}

/**
 * Pure calculation function for percentage distance from All-Time-Low (ATL).
 * Formula: ((currentPrice - post_listing_atl) / post_listing_atl) * 100
 */
export function calculateDistanceFromATL(
  currentPrice: number | null | undefined,
  postListingATL: number | null | undefined
): number | null {
  if (currentPrice == null || postListingATL == null) return null;
  if (postListingATL <= 0 || isNaN(currentPrice) || isNaN(postListingATL)) return null;
  return Number((((currentPrice - postListingATL) / postListingATL) * 100).toFixed(2));
}

/**
 * Pure valuation label determination according to sector average PE ratio.
 * Rule: Sector Avg ±15% => "makul", < -15% => "ucuz", > +15% => "pahalı"
 */
export function calculateValuationLabel(
  impliedPe: number | null | undefined,
  sectorAvgPe: number | null | undefined
): IPOValuationLabel | null {
  if (impliedPe == null || sectorAvgPe == null) return null;
  if (impliedPe <= 0 || sectorAvgPe <= 0 || isNaN(impliedPe) || isNaN(sectorAvgPe)) return null;

  const lowerBound = sectorAvgPe * 0.85;
  const upperBound = sectorAvgPe * 1.15;

  if (impliedPe < lowerBound) return 'ucuz';
  if (impliedPe > upperBound) return 'pahalı';
  return 'makul';
}

/**
 * Additive pure enrichment utility to calculate missing computed metrics for any IPO listing safely.
 */
export function enrichIpoDeepAnalysis(ipo: IPOListing): IPOListing {
  const currentPrice = ipo.performance?.currentPrice || ipo.offerPrice;

  // 1. Enrich relative performance
  let relPerf: IPORelativePerformance | null = ipo.relative_performance ? { ...ipo.relative_performance } : null;
  if (relPerf) {
    const day1Return = relPerf.day1_return_pct ?? ipo.performance?.day1ReturnPct;
    if (relPerf.relative_alpha_day1_pct == null && day1Return != null && relPerf.bist100_return_same_day_pct != null) {
      relPerf.relative_alpha_day1_pct = calculateRelativeAlphaDay1(day1Return, relPerf.bist100_return_same_day_pct);
    }
    if (relPerf.distance_from_ath_pct == null && currentPrice && relPerf.post_listing_ath) {
      relPerf.distance_from_ath_pct = calculateDistanceFromATH(currentPrice, relPerf.post_listing_ath);
    }
    if (relPerf.distance_from_atl_pct == null && currentPrice && relPerf.post_listing_atl) {
      relPerf.distance_from_atl_pct = calculateDistanceFromATL(currentPrice, relPerf.post_listing_atl);
    }
  }

  // 2. Enrich financial health valuation label
  let finHealth: IPOFinancialHealth | null = ipo.financial_health ? { ...ipo.financial_health } : null;
  if (finHealth) {
    if (!finHealth.valuation_label && finHealth.implied_pe != null && finHealth.sector_avg_pe != null) {
      finHealth.valuation_label = calculateValuationLabel(finHealth.implied_pe, finHealth.sector_avg_pe);
    }
  }

  // 3. Enrich demand breakdown total if empty
  let demand: IPODemandBreakdown | null = ipo.demand_breakdown ? { ...ipo.demand_breakdown } : null;
  if (demand && demand.total_coverage_ratio == null && ipo.demandMultiplier != null) {
    demand.total_coverage_ratio = ipo.demandMultiplier;
  }

  return {
    ...ipo,
    financial_health: finHealth,
    structural_risk: ipo.structural_risk ? { ...ipo.structural_risk } : null,
    relative_performance: relPerf,
    demand_breakdown: demand,
    qualitative: ipo.qualitative ? { ...ipo.qualitative } : null
  };
}

/**
 * Structured document parser for Gemini/LLM or Prospectus JSON extraction.
 * Extracts the 5 deep analysis blocks and merges them safely without modifying original fields.
 */
export function parseIpoDeepAnalysisDocument(
  rawInput: string | Record<string, any>
): {
  financial_health: IPOFinancialHealth | null;
  structural_risk: IPOStructuralRisk | null;
  relative_performance: IPORelativePerformance | null;
  demand_breakdown: IPODemandBreakdown | null;
  qualitative: IPOQualitative | null;
} {
  let parsed: any = {};
  if (typeof rawInput === 'string') {
    try {
      // Remove any markdown code block wrap if present
      const cleaned = rawInput.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = {};
    }
  } else if (typeof rawInput === 'object' && rawInput !== null) {
    parsed = rawInput;
  }

  const fh = parsed.financial_health || {};
  const sr = parsed.structural_risk || {};
  const rp = parsed.relative_performance || {};
  const db = parsed.demand_breakdown || {};
  const ql = parsed.qualitative || {};

  // Financial Health
  const financial_health: IPOFinancialHealth = {
    revenue_3y: Array.isArray(fh.revenue_3y) ? fh.revenue_3y : null,
    net_income_3y: Array.isArray(fh.net_income_3y) ? fh.net_income_3y : null,
    ebitda_3y: Array.isArray(fh.ebitda_3y) ? fh.ebitda_3y : null,
    implied_pe: typeof fh.implied_pe === 'number' ? fh.implied_pe : null,
    implied_pb: typeof fh.implied_pb === 'number' ? fh.implied_pb : null,
    implied_ev_ebitda: typeof fh.implied_ev_ebitda === 'number' ? fh.implied_ev_ebitda : null,
    sector_avg_pe: typeof fh.sector_avg_pe === 'number' ? fh.sector_avg_pe : null,
    sector_avg_ev_ebitda: typeof fh.sector_avg_ev_ebitda === 'number' ? fh.sector_avg_ev_ebitda : null,
    valuation_label: fh.valuation_label || calculateValuationLabel(fh.implied_pe, fh.sector_avg_pe),
    debt_to_equity: typeof fh.debt_to_equity === 'number' ? fh.debt_to_equity : null,
    _source: fh._source || null
  };

  // Structural Risk
  const structural_risk: IPOStructuralRisk = {
    underwriting_type: sr.underwriting_type || null,
    lockup_period_days: typeof sr.lockup_period_days === 'number' ? sr.lockup_period_days : null,
    lockup_expiry_date: sr.lockup_expiry_date || null,
    greenshoe_option: typeof sr.greenshoe_option === 'boolean' ? sr.greenshoe_option : null,
    greenshoe_percent: typeof sr.greenshoe_percent === 'number' ? sr.greenshoe_percent : null,
    market_segment: sr.market_segment || null,
    _source: sr._source || null
  };

  // Relative Performance
  const day1Return = typeof rp.day1_return_pct === 'number' ? rp.day1_return_pct : null;
  const bistDay1 = typeof rp.bist100_return_same_day_pct === 'number' ? rp.bist100_return_same_day_pct : null;
  const relative_performance: IPORelativePerformance = {
    day1_return_pct: day1Return,
    bist100_return_same_day_pct: bistDay1,
    relative_alpha_day1_pct: typeof rp.relative_alpha_day1_pct === 'number'
      ? rp.relative_alpha_day1_pct
      : calculateRelativeAlphaDay1(day1Return, bistDay1),
    bist100_level_at_ipo: typeof rp.bist100_level_at_ipo === 'number' ? rp.bist100_level_at_ipo : null,
    post_listing_ath: typeof rp.post_listing_ath === 'number' ? rp.post_listing_ath : null,
    post_listing_atl: typeof rp.post_listing_atl === 'number' ? rp.post_listing_atl : null,
    distance_from_ath_pct: typeof rp.distance_from_ath_pct === 'number' ? rp.distance_from_ath_pct : null,
    distance_from_atl_pct: typeof rp.distance_from_atl_pct === 'number' ? rp.distance_from_atl_pct : null
  };

  // Demand Breakdown
  const demand_breakdown: IPODemandBreakdown = {
    domestic_retail_coverage_ratio: typeof db.domestic_retail_coverage_ratio === 'number' ? db.domestic_retail_coverage_ratio : null,
    domestic_institutional_coverage_ratio: typeof db.domestic_institutional_coverage_ratio === 'number' ? db.domestic_institutional_coverage_ratio : null,
    foreign_institutional_coverage_ratio: typeof db.foreign_institutional_coverage_ratio === 'number' ? db.foreign_institutional_coverage_ratio : null,
    total_coverage_ratio: typeof db.total_coverage_ratio === 'number' ? db.total_coverage_ratio : null
  };

  // Qualitative
  const qualitative: IPOQualitative = {
    free_float_pct: typeof ql.free_float_pct === 'number' ? ql.free_float_pct : null,
    dividend_policy: ql.dividend_policy || null,
    sharia_compliant: typeof ql.sharia_compliant === 'boolean' ? ql.sharia_compliant : null,
    _source: ql._source || null
  };

  return {
    financial_health,
    structural_risk,
    relative_performance,
    demand_breakdown,
    qualitative
  };
}
