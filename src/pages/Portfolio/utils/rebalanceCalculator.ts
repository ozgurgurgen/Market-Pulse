import { PortfolioHoldingSnapshot, PortfolioAssetClass } from '../../../types';

export interface RebalanceTarget {
  ticker: string;
  name?: string;
  assetClass?: PortfolioAssetClass;
  targetWeight: number; // percentage (0 - 100)
}

export interface RebalanceConfig {
  portfolioId: string;
  thresholdPct: number; // e.g. 5 means ±5% drift tolerance
  checkFrequency: 'daily' | 'weekly';
  telegramAlertsEnabled: boolean;
  targets: Record<string, number>; // ticker -> targetWeight (0-100)
}

export interface RebalanceOrder {
  ticker: string;
  name?: string;
  assetClass?: PortfolioAssetClass;
  currentQuantity: number;
  currentPrice: number;
  currentValue: number;
  currentWeight: number; // % (0 - 100)
  targetWeight: number;  // % (0 - 100)
  targetValue: number;
  driftPct: number;      // currentWeight - targetWeight (positive = overweight, negative = underweight)
  isDrifted: boolean;    // Math.abs(driftPct) >= thresholdPct
  action: 'BUY' | 'SELL' | 'HOLD';
  orderValue: number;    // Absolute TL/USD amount
  orderQuantity: number; // Shares/units to trade
  projectedValue: number;
  projectedWeight: number;
}

export interface RebalanceSummary {
  totalPortfolioValue: number;
  thresholdPct: number;
  hasDrift: boolean;
  driftedCount: number;
  totalSellValue: number;
  totalBuyValue: number;
  netCashRequired: number;
  maxDriftAsset: { ticker: string; driftPct: number } | null;
  orders: RebalanceOrder[];
}

/**
 * Calculates drift and recommended rebalancing orders for each holding
 */
export function calculateRebalance(
  holdings: PortfolioHoldingSnapshot[],
  targets: Record<string, number>,
  thresholdPct: number = 5.0
): RebalanceSummary {
  const totalValue = holdings.reduce((sum, h) => sum + (h.marketValue || 0), 0);

  if (totalValue <= 0 || holdings.length === 0) {
    return {
      totalPortfolioValue: 0,
      thresholdPct,
      hasDrift: false,
      driftedCount: 0,
      totalSellValue: 0,
      totalBuyValue: 0,
      netCashRequired: 0,
      maxDriftAsset: null,
      orders: [],
    };
  }

  // Normalize targets if sum does not equal 100
  const targetSum = Object.values(targets).reduce((s, w) => s + (w || 0), 0);
  const normalizedTargets: Record<string, number> = {};
  
  holdings.forEach((h) => {
    const rawTarget = targets[h.ticker];
    if (targetSum > 0 && typeof rawTarget === 'number') {
      normalizedTargets[h.ticker] = (rawTarget / targetSum) * 100;
    } else {
      // Default fallback: equal weight among all holdings
      normalizedTargets[h.ticker] = 100 / holdings.length;
    }
  });

  const orders: RebalanceOrder[] = [];
  let totalSellValue = 0;
  let totalBuyValue = 0;
  let maxDrift = 0;
  let maxDriftAsset: { ticker: string; driftPct: number } | null = null;
  let driftedCount = 0;

  for (const h of holdings) {
    const currentValue = h.marketValue || (h.quantity * h.currentPrice) || 0;
    const currentWeight = totalValue > 0 ? (currentValue / totalValue) * 100 : 0;
    const targetWeight = normalizedTargets[h.ticker] ?? (100 / holdings.length);
    const targetValue = (targetWeight / 100) * totalValue;
    
    // Drift = Current - Target
    const driftPct = Number((currentWeight - targetWeight).toFixed(2));
    const isDrifted = Math.abs(driftPct) >= thresholdPct;

    if (isDrifted) {
      driftedCount++;
    }

    if (Math.abs(driftPct) > Math.abs(maxDrift)) {
      maxDrift = driftPct;
      maxDriftAsset = { ticker: h.ticker, driftPct };
    }

    const valueDiff = targetValue - currentValue;
    const unitPrice = h.currentPrice > 0 ? h.currentPrice : (currentValue / (h.quantity || 1)) || 1;

    let action: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    let orderValue = 0;
    let orderQuantity = 0;

    if (isDrifted) {
      if (valueDiff < 0) {
        // Overweight -> Sell excess
        action = 'SELL';
        orderValue = Math.abs(valueDiff);
        orderQuantity = Math.floor(orderValue / unitPrice);
        totalSellValue += orderValue;
      } else if (valueDiff > 0) {
        // Underweight -> Buy deficit
        action = 'BUY';
        orderValue = valueDiff;
        orderQuantity = Math.floor(orderValue / unitPrice);
        totalBuyValue += orderValue;
      }
    }

    const projectedValue = action === 'SELL' 
      ? currentValue - (orderQuantity * unitPrice)
      : action === 'BUY'
      ? currentValue + (orderQuantity * unitPrice)
      : currentValue;

    const projectedWeight = totalValue > 0 ? (projectedValue / totalValue) * 100 : 0;

    orders.push({
      ticker: h.ticker,
      name: h.name,
      assetClass: h.assetClass,
      currentQuantity: h.quantity,
      currentPrice: unitPrice,
      currentValue,
      currentWeight: Number(currentWeight.toFixed(2)),
      targetWeight: Number(targetWeight.toFixed(2)),
      targetValue,
      driftPct,
      isDrifted,
      action,
      orderValue: Number(orderValue.toFixed(2)),
      orderQuantity,
      projectedValue,
      projectedWeight: Number(projectedWeight.toFixed(2)),
    });
  }

  // Sort orders: drifted ones first, then highest absolute drift
  orders.sort((a, b) => Math.abs(b.driftPct) - Math.abs(a.driftPct));

  return {
    totalPortfolioValue: totalValue,
    thresholdPct,
    hasDrift: driftedCount > 0,
    driftedCount,
    totalSellValue: Number(totalSellValue.toFixed(2)),
    totalBuyValue: Number(totalBuyValue.toFixed(2)),
    netCashRequired: Number((totalBuyValue - totalSellValue).toFixed(2)),
    maxDriftAsset,
    orders,
  };
}

/**
 * Helper to generate preset target distributions
 */
export function generatePresetTargets(
  holdings: PortfolioHoldingSnapshot[],
  preset: 'EQUAL' | 'CURRENT' | 'BALANCED' | 'EQUITY_HEAVY' | 'DEFENSIVE'
): Record<string, number> {
  const result: Record<string, number> = {};
  if (holdings.length === 0) return result;

  if (preset === 'EQUAL') {
    const w = Number((100 / holdings.length).toFixed(2));
    holdings.forEach((h) => { result[h.ticker] = w; });
    return result;
  }

  if (preset === 'CURRENT') {
    holdings.forEach((h) => {
      result[h.ticker] = Number((h.weightPercentage || 0).toFixed(2));
    });
    return result;
  }

  if (preset === 'BALANCED') {
    // Equities & Funds get balanced weight, commodities/crypto get lower risk caps
    let equityWeight = 0;
    let fundWeight = 0;
    let otherWeight = 0;

    const equities = holdings.filter(h => h.assetClass === 'BIST' || h.assetClass === 'US_STOCK');
    const funds = holdings.filter(h => h.assetClass === 'FUND' || h.assetClass === 'US_ETF');
    const others = holdings.filter(h => !equities.includes(h) && !funds.includes(h));

    const totalCategories = (equities.length > 0 ? 1 : 0) + (funds.length > 0 ? 1 : 0) + (others.length > 0 ? 1 : 0);
    if (totalCategories === 0) return generatePresetTargets(holdings, 'EQUAL');

    const catShare = 100 / totalCategories;
    equities.forEach(h => { result[h.ticker] = Number((catShare / equities.length).toFixed(2)); });
    funds.forEach(h => { result[h.ticker] = Number((catShare / funds.length).toFixed(2)); });
    others.forEach(h => { result[h.ticker] = Number((catShare / others.length).toFixed(2)); });
    return result;
  }

  if (preset === 'EQUITY_HEAVY') {
    // 70% equities, 30% others
    const equities = holdings.filter(h => h.assetClass === 'BIST' || h.assetClass === 'US_STOCK');
    const nonEquities = holdings.filter(h => h.assetClass !== 'BIST' && h.assetClass !== 'US_STOCK');

    if (equities.length > 0 && nonEquities.length > 0) {
      equities.forEach(h => { result[h.ticker] = Number((70 / equities.length).toFixed(2)); });
      nonEquities.forEach(h => { result[h.ticker] = Number((30 / nonEquities.length).toFixed(2)); });
    } else {
      return generatePresetTargets(holdings, 'EQUAL');
    }
    return result;
  }

  if (preset === 'DEFENSIVE') {
    // Emphasize Funds & Commodities/Cash
    const defensive = holdings.filter(h => h.assetClass === 'FUND' || h.assetClass === 'COMMODITY' || h.assetClass === 'FOREX');
    const aggressive = holdings.filter(h => !defensive.includes(h));

    if (defensive.length > 0 && aggressive.length > 0) {
      defensive.forEach(h => { result[h.ticker] = Number((70 / defensive.length).toFixed(2)); });
      aggressive.forEach(h => { result[h.ticker] = Number((30 / aggressive.length).toFixed(2)); });
    } else {
      return generatePresetTargets(holdings, 'EQUAL');
    }
    return result;
  }

  return generatePresetTargets(holdings, 'EQUAL');
}

/**
 * Creates Telegram-ready alert notification string
 */
export function generateRebalanceTelegramMessage(
  summary: RebalanceSummary,
  portfolioName: string
): string {
  const drifted = summary.orders.filter(o => o.isDrifted);
  if (drifted.length === 0) {
    return `⚖️ <b>${portfolioName}</b>\nPortföyünüz belirlenen hedef ağırlıklarda dengelidir (Sapma eşiği: ±%${summary.thresholdPct}).`;
  }

  let text = `⚖️ <b>${portfolioName} — Dengeleme Uyarısı</b>\n\n`;
  text += `Toplam <b>${drifted.length}</b> varlıkta hedef ağırlıktan sapma tespit edildi (Tolerans: ±%${summary.thresholdPct}):\n\n`;

  drifted.slice(0, 5).forEach(o => {
    const icon = o.action === 'SELL' ? '🔻 SAT' : '🔺 AL';
    text += `${icon} <b>${o.ticker}</b>: Mevcut %${o.currentWeight} ➔ Hedef %${o.targetWeight} (Sapma: %${o.driftPct > 0 ? '+' : ''}${o.driftPct})\n`;
    text += `   Öneri: ${o.orderQuantity.toLocaleString('tr-TR')} adet (~${Math.round(o.orderValue).toLocaleString('tr-TR')} ₺)\n`;
  });

  if (summary.totalSellValue > 0) {
    text += `\n💵 Toplam Satış Hacmi: ${Math.round(summary.totalSellValue).toLocaleString('tr-TR')} ₺`;
  }
  if (summary.totalBuyValue > 0) {
    text += `\n🛒 Toplam Alış Hacmi: ${Math.round(summary.totalBuyValue).toLocaleString('tr-TR')} ₺`;
  }

  return text;
}
