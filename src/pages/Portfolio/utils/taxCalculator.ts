import { PortfolioHoldingSnapshot, PortfolioAssetClass } from '../../../types';

export type TaxRegimeType = 
  | 'BIST_EQUITY_EXEMPT'          // %0 Stopaj - GVK Geçici 67
  | 'FUND_EQUITY_HEAVY_EXEMPT'    // %0 Stopaj - Hisse Senedi Yoğun Fonlar (>=%80 hisse)
  | 'FUND_STANDARD_WITHHOLDING'   // %10 - %15 Stopaj (Borçlanma, Para Piyasası, Değişken)
  | 'FOREIGN_EQUITY_INCOME_TAX'   // GVK 80-82 md. Değer Artış Kazancı (%15 - %40 Beyan)
  | 'CRYPTO_TRANSACTION_TAX'      // Kripto İşlem Vergisi / Stopaj Projeksiyonu
  | 'COMMODITY_EXEMPT_OR_TAX'     // Kıymetli Maden & Emtia
  | 'OTHER_WITHHOLDING';

export interface HoldingTaxDetail {
  ticker: string;
  name?: string;
  assetClass: PortfolioAssetClass;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  costValue: number;
  currentValue: number;
  grossGain: number;
  grossGainPct: number;
  taxRegime: TaxRegimeType;
  taxRegimeLabel: string;
  appliedTaxRate: number; // Percentage e.g. 0, 10, 15, 27
  estimatedTaxLiability: number; // Currency amount
  netRealizedCash: number;       // currentValue - estimatedTaxLiability
  netRealizedGain: number;       // grossGain - estimatedTaxLiability
  effectiveTaxPct: number;       // (tax / grossGain) * 100 if gain > 0 else 0
  isLossHarvestable: boolean;    // Gross gain < 0 (can offset gains)
  legalBasisNote: string;
}

export interface TaxHarvestingOpportunity {
  ticker: string;
  name?: string;
  unrealizedLoss: number;
  quantity: number;
  currentValue: number;
  potentialTaxOffset: number; // Tax saved by harvesting this loss against foreign or taxable gains
  recommendation: string;
}

export interface PortfolioTaxSummary {
  totalPortfolioValue: number;
  totalCostValue: number;
  totalGrossGain: number;
  totalEstimatedTax: number;
  totalNetRealizedCash: number;
  totalNetGain: number;
  portfolioEffectiveTaxRate: number; // (totalTax / totalGrossGain) * 100
  exemptGainsTotal: number;          // Kâra geçen ama vergiden muaf (%0) olan kazanç
  taxableGainsTotal: number;         // Vergiye tabi brüt kazanç
  harvestableLossesTotal: number;    // Zarardaki toplam negatif getiri
  liquidationPct: number;            // 25, 50, 75, 100%
  incomeTaxBracketPct: number;       // 15, 20, 27, 35, 40
  fundWithholdingRatePct: number;    // 10 or 15
  holdingsTax: HoldingTaxDetail[];
  taxHarvestingOpportunities: TaxHarvestingOpportunity[];
  taxEfficiencyScore: number;        // 0 - 100 (100 = completely tax-free)
  advisoryNotes: string[];
}

/**
 * Classifies holding into the appropriate Turkish tax regime
 */
export function classifyTaxRegime(holding: PortfolioHoldingSnapshot): {
  regime: TaxRegimeType;
  label: string;
  defaultRate: number;
  legalBasis: string;
} {
  const tickerUpper = (holding.ticker || '').toUpperCase().trim();
  const assetClass = holding.assetClass;

  // 1. BIST Pay Senetleri (GVK Geçici 67. Md) -> %0 Stopaj
  if (assetClass === 'BIST' || tickerUpper.endsWith('.IS') || (!tickerUpper.includes('.') && tickerUpper.length <= 5 && !['USD', 'EUR', 'ALTIN', 'GLD'].includes(tickerUpper) && assetClass !== 'FUND')) {
    return {
      regime: 'BIST_EQUITY_EXEMPT',
      label: 'BIST Pay Senedi (%0 Stopaj)',
      defaultRate: 0,
      legalBasis: 'GVK Geçici 67. Madde kapsamında yerli hisse senedi alım-satım kazançları %0 stopaja tabidir, yıllık beyanname verilmez.',
    };
  }

  // 2. TEFAS Yatırım Fonları
  if (assetClass === 'FUND') {
    // Check if it's Equity Intensive (Hisse Senedi Yoğun) e.g. TCD, MAC, TKF, HKH, TI3, ST1, etc.
    const isEquityIntensive = 
      tickerUpper.includes('HISSE') || 
      ['MAC', 'TCD', 'TKF', 'HKH', 'TI3', 'ST1', 'GMR', 'YZH', 'IDH', 'BUY', 'KPH'].includes(tickerUpper);

    if (isEquityIntensive) {
      return {
        regime: 'FUND_EQUITY_HEAVY_EXEMPT',
        label: 'Hisse Yoğun Fon (%0 Stopaj)',
        defaultRate: 0,
        legalBasis: 'Portföyünün en az %80’i BIST hisse senetlerinden oluşan yerli fonlar stopajdan muaftır (%0 stopaj).',
      };
    }

    // Other TEFAS Funds (Borçlanma, Para Piyasası, Değişken, Kıymetli Madenler) -> %10 veya %15 stopaj
    return {
      regime: 'FUND_STANDARD_WITHHOLDING',
      label: 'Yatırım Fonu (%10 Stopaj)',
      defaultRate: 10,
      legalBasis: 'Para piyasası, borçlanma ve değişken fon kazançlarında kaynakta %10 stopaj kesilir, beyan gerekmez.',
    };
  }

  // 3. Yabancı Hisse & ETF (US Stocks: AAPL, MSFT, NVDA, SPY, QQQ vb.)
  if (assetClass === 'US_STOCK' || assetClass === 'US_ETF') {
    return {
      regime: 'FOREIGN_EQUITY_INCOME_TAX',
      label: 'Yabancı Hisse/ETF (GVK Beyan)',
      defaultRate: 20, // Default average tax bracket (15 - 40%)
      legalBasis: 'GVK 80-82 md. uyarınca yurt dışı hisse değer artış kazançları yıllık gelir vergisi beyannamesi ile beyan edilir.',
    };
  }

  // 4. Kripto Varlıklar
  if (assetClass === 'CRYPTO') {
    return {
      regime: 'CRYPTO_TRANSACTION_TAX',
      label: 'Kripto Varlık (%0.04 İşlem / Projeksiyon)',
      defaultRate: 0.04,
      legalBasis: 'Kripto varlık mevzuatı taslağı uyarınca binde 4 işlem vergisi veya kâr projeksiyonu uygulanır.',
    };
  }

  // 5. Emtia / Altın / Döviz
  if (assetClass === 'COMMODITY' || assetClass === 'FOREX') {
    return {
      regime: 'COMMODITY_EXEMPT_OR_TAX',
      label: 'Emtia / Kıymetli Maden (%0 - %10)',
      defaultRate: 0,
      legalBasis: 'Fiziki altın ve kıymetli maden alım-satım kazançları ticari kazanç sayılmadıkça gelir vergisinden muaftır.',
    };
  }

  return {
    regime: 'OTHER_WITHHOLDING',
    label: 'Diğer Menkul Kıymet (%10)',
    defaultRate: 10,
    legalBasis: 'Genel tevkifat hükümleri uyarınca stopaja tabidir.',
  };
}

/**
 * Calculates complete tax liability and net liquidation cash flow
 */
export function calculatePortfolioTax(
  holdings: PortfolioHoldingSnapshot[],
  options: {
    liquidationPct?: number;           // Percentage of holdings sold (default 100%)
    incomeTaxBracketPct?: number;      // Individual tax bracket for foreign equities (default 20%)
    fundWithholdingRatePct?: number;   // Withholding rate for standard funds (default 10%)
  } = {}
): PortfolioTaxSummary {
  const liquidationPct = options.liquidationPct ?? 100;
  const incomeTaxBracketPct = options.incomeTaxBracketPct ?? 20;
  const fundWithholdingRatePct = options.fundWithholdingRatePct ?? 10;

  const holdingsTax: HoldingTaxDetail[] = [];
  const taxHarvestingOpportunities: TaxHarvestingOpportunity[] = [];

  let totalPortfolioValue = 0;
  let totalCostValue = 0;
  let totalGrossGain = 0;
  let totalEstimatedTax = 0;
  let exemptGainsTotal = 0;
  let taxableGainsTotal = 0;
  let harvestableLossesTotal = 0;

  for (const h of holdings) {
    const fullCurrentValue = h.marketValue || (h.quantity * h.currentPrice) || 0;
    const fullCostValue = h.cost || (h.quantity * h.avgBuyPrice) || 0;
    
    // Scale by liquidation percentage
    const currentValue = fullCurrentValue * (liquidationPct / 100);
    const costValue = fullCostValue * (liquidationPct / 100);
    const grossGain = currentValue - costValue;
    const grossGainPct = costValue > 0 ? (grossGain / costValue) * 100 : 0;

    totalPortfolioValue += currentValue;
    totalCostValue += costValue;
    totalGrossGain += grossGain;

    const classification = classifyTaxRegime(h);
    let appliedRate = classification.defaultRate;

    // Apply custom rates if user adjusted them
    if (classification.regime === 'FOREIGN_EQUITY_INCOME_TAX') {
      appliedRate = incomeTaxBracketPct;
    } else if (classification.regime === 'FUND_STANDARD_WITHHOLDING') {
      appliedRate = fundWithholdingRatePct;
    }

    let estimatedTax = 0;
    if (grossGain > 0) {
      if (appliedRate > 0) {
        estimatedTax = (grossGain * appliedRate) / 100;
        taxableGainsTotal += grossGain;
      } else {
        exemptGainsTotal += grossGain;
      }
    } else if (grossGain < 0) {
      harvestableLossesTotal += Math.abs(grossGain);
      // If taxable regime, loss can be harvested
      if (classification.regime === 'FOREIGN_EQUITY_INCOME_TAX') {
        taxHarvestingOpportunities.push({
          ticker: h.ticker,
          name: h.name,
          unrealizedLoss: Math.abs(grossGain),
          quantity: h.quantity * (liquidationPct / 100),
          currentValue,
          potentialTaxOffset: (Math.abs(grossGain) * appliedRate) / 100,
          recommendation: `Bu pozisyon realize edilirse, diğer yurt dışı kârlarınızdan mahsup edilerek yaklaşık ₺${Math.round((Math.abs(grossGain) * appliedRate) / 100).toLocaleString('tr-TR')} vergi tasarrufu sağlayabilir.`,
        });
      }
    }

    totalEstimatedTax += estimatedTax;
    const netRealizedCash = currentValue - estimatedTax;
    const netRealizedGain = grossGain - estimatedTax;
    const effectiveTaxPct = grossGain > 0 ? (estimatedTax / grossGain) * 100 : 0;

    holdingsTax.push({
      ticker: h.ticker,
      name: h.name,
      assetClass: h.assetClass,
      quantity: h.quantity * (liquidationPct / 100),
      avgBuyPrice: h.avgBuyPrice,
      currentPrice: h.currentPrice,
      costValue,
      currentValue,
      grossGain,
      grossGainPct: Number(grossGainPct.toFixed(2)),
      taxRegime: classification.regime,
      taxRegimeLabel: classification.label,
      appliedTaxRate: appliedRate,
      estimatedTaxLiability: Number(estimatedTax.toFixed(2)),
      netRealizedCash: Number(netRealizedCash.toFixed(2)),
      netRealizedGain: Number(netRealizedGain.toFixed(2)),
      effectiveTaxPct: Number(effectiveTaxPct.toFixed(2)),
      isLossHarvestable: grossGain < 0,
      legalBasisNote: classification.legalBasis,
    });
  }

  // Sort by highest profit descending
  holdingsTax.sort((a, b) => b.grossGain - a.grossGain);

  const totalNetRealizedCash = totalPortfolioValue - totalEstimatedTax;
  const totalNetGain = totalGrossGain - totalEstimatedTax;
  const portfolioEffectiveTaxRate = totalGrossGain > 0 
    ? Number(((totalEstimatedTax / totalGrossGain) * 100).toFixed(2)) 
    : 0;

  // Tax Efficiency Score: 100 means 0% tax, 0 means maximum tax
  const taxEfficiencyScore = Math.max(0, Math.min(100, Math.round(100 - portfolioEffectiveTaxRate * 2.5)));

  // Advisory Notes
  const advisoryNotes: string[] = [];
  if (exemptGainsTotal > 0) {
    advisoryNotes.push(
      `🟢 Portföyünüzdeki ₺${Math.round(exemptGainsTotal).toLocaleString('tr-TR')} tutarındaki kazanç BIST hisse veya hisse yoğun fon muafiyeti (%0 stopaj) ile tamamen vergisizdir.`
    );
  }
  if (taxHarvestingOpportunities.length > 0) {
    const totalPotentialSavings = taxHarvestingOpportunities.reduce((s, o) => s + o.potentialTaxOffset, 0);
    advisoryNotes.push(
      `💡 Vergi Kaybı Hasadı (Tax-Loss Harvesting): Zarardaki ${taxHarvestingOpportunities.length} pozisyonunuzu realize ederek tahmini ₺${Math.round(totalPotentialSavings).toLocaleString('tr-TR')} vergi mahsubu sağlayabilirsiniz.`
    );
  }
  if (taxableGainsTotal > 0 && portfolioEffectiveTaxRate > 12) {
    advisoryNotes.push(
      `⚠️ Yabancı hisse veya standart fon ağırlığınız nedeniyle efektif vergi yükünüz %${portfolioEffectiveTaxRate} seviyesindedir. Hisse senedi yoğun TEFAS fonlarına ağırlık vermek vergi verimliliğinizi artırabilir.`
    );
  } else if (portfolioEffectiveTaxRate <= 5) {
    advisoryNotes.push(
      `🛡️ Portföyünüz yüksek derecede vergi verimlidir (Efektif Vergi Oranı: %${portfolioEffectiveTaxRate}). Kazancınızın büyük kısmı net nakit olarak cebinizde kalacaktır.`
    );
  }

  return {
    totalPortfolioValue: Number(totalPortfolioValue.toFixed(2)),
    totalCostValue: Number(totalCostValue.toFixed(2)),
    totalGrossGain: Number(totalGrossGain.toFixed(2)),
    totalEstimatedTax: Number(totalEstimatedTax.toFixed(2)),
    totalNetRealizedCash: Number(totalNetRealizedCash.toFixed(2)),
    totalNetGain: Number(totalNetGain.toFixed(2)),
    portfolioEffectiveTaxRate,
    exemptGainsTotal: Number(exemptGainsTotal.toFixed(2)),
    taxableGainsTotal: Number(taxableGainsTotal.toFixed(2)),
    harvestableLossesTotal: Number(harvestableLossesTotal.toFixed(2)),
    liquidationPct,
    incomeTaxBracketPct,
    fundWithholdingRatePct,
    holdingsTax,
    taxHarvestingOpportunities,
    taxEfficiencyScore,
    advisoryNotes,
  };
}
