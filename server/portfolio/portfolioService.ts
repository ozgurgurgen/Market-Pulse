import {
  Portfolio,
  Holding,
  PortfolioSnapshot,
  HoldingSnapshot,
  AssetClass,
} from './portfolioTypes';
import { getLiveQuoteForSymbol } from '../yahooFinanceService';
import { localFinanceApi } from '../dataAdapters/adapters/LocalFinanceApiAdapter';
import { convertCurrency, getUsdTryRate } from '../services/currencyService';
import { recordPortfolioAlert } from '../services/notificationService';

// Başlangıç Sistematik Model Portföyleri (Alfa, Beta, Katılım, Delta)
const initialPortfolios: Portfolio[] = [
  {
    id: 'portfolio-alfa',
    userId: 'user-default',
    name: 'Alfa Model Portföyü (Yüksek Büyüme & Momentum)',
    createdAt: '2024-01-02',
    baseCurrency: 'TRY',
    initialCapital: 300000,
    isActive: true,
    notes: 'Yüksek beta, büyüme odaklı teknoloji, havacılık ve momentum hisseleri sistematik sepeti.',
    riskTolerance: 'AGGRESSIVE',
    targetReturn: 75.0,
    benchmark: 'XU100',
    holdings: [
      {
        id: 'h-alfa-1',
        ticker: 'THYAO',
        name: 'Türk Hava Yolları',
        assetClass: 'BIST',
        quantity: 280,
        avgBuyPrice: 255.40,
        purchaseDate: '2024-01-05',
        currency: 'TRY',
      },
      {
        id: 'h-alfa-2',
        ticker: 'ASELS',
        name: 'Aselsan Elektronik',
        assetClass: 'BIST',
        quantity: 950,
        avgBuyPrice: 48.20,
        purchaseDate: '2024-01-10',
        currency: 'TRY',
      },
      {
        id: 'h-alfa-3',
        ticker: 'PGSUS',
        name: 'Pegasus Hava Taşımacılığı',
        assetClass: 'BIST',
        quantity: 180,
        avgBuyPrice: 195.00,
        purchaseDate: '2024-01-12',
        currency: 'TRY',
      },
      {
        id: 'h-alfa-4',
        ticker: 'NVDA',
        name: 'NVIDIA Corporation',
        assetClass: 'US_STOCK',
        quantity: 18,
        avgBuyPrice: 98.50,
        purchaseDate: '2024-01-15',
        currency: 'USD',
      },
      {
        id: 'h-alfa-5',
        ticker: 'MAC',
        name: 'Marmara Capital Hisse Senedi Fonu',
        assetClass: 'FUND',
        quantity: 1500,
        avgBuyPrice: 28.50,
        purchaseDate: '2024-01-08',
        currency: 'TRY',
      }
    ],
  },
  {
    id: 'portfolio-beta',
    userId: 'user-default',
    name: 'Beta Model Portföyü (Defansif Temettü & Nakit Akışı)',
    createdAt: '2024-01-02',
    baseCurrency: 'TRY',
    initialCapital: 350000,
    isActive: true,
    notes: 'Yüksek temettü verimi, güçlü nakit akışı ve piyasa dalgalanmalarına karşı defansif liderler.',
    riskTolerance: 'CONSERVATIVE',
    targetReturn: 45.0,
    benchmark: 'XU100',
    holdings: [
      {
        id: 'h-beta-1',
        ticker: 'FROTO',
        name: 'Ford Otomotiv',
        assetClass: 'BIST',
        quantity: 85,
        avgBuyPrice: 890.00,
        purchaseDate: '2024-01-05',
        currency: 'TRY',
      },
      {
        id: 'h-beta-2',
        ticker: 'TUPRS',
        name: 'Tüpraş Rafineri',
        assetClass: 'BIST',
        quantity: 450,
        avgBuyPrice: 142.00,
        purchaseDate: '2024-01-08',
        currency: 'TRY',
      },
      {
        id: 'h-beta-3',
        ticker: 'BIMAS',
        name: 'BİM Birleşik Mağazalar',
        assetClass: 'BIST',
        quantity: 160,
        avgBuyPrice: 380.00,
        purchaseDate: '2024-01-10',
        currency: 'TRY',
      },
      {
        id: 'h-beta-4',
        ticker: 'EREGL',
        name: 'Ereğli Demir Çelik',
        assetClass: 'BIST',
        quantity: 800,
        avgBuyPrice: 42.10,
        purchaseDate: '2024-01-15',
        currency: 'TRY',
      },
      {
        id: 'h-beta-5',
        ticker: 'SCHD',
        name: 'Schwab U.S. Dividend Equity ETF',
        assetClass: 'US_ETF',
        quantity: 35,
        avgBuyPrice: 76.50,
        purchaseDate: '2024-01-18',
        currency: 'USD',
      }
    ],
  },
  {
    id: 'portfolio-katilim',
    userId: 'user-default',
    name: 'Katılım Model Portföyü (Faizsiz Finans & İslami Kriterler)',
    createdAt: '2024-01-02',
    baseCurrency: 'TRY',
    initialCapital: 250000,
    isActive: true,
    notes: 'BIST Katılım Endeksi ve faizsiz finans standartlarına uygun hisse, sukuk ve altın sepeti.',
    riskTolerance: 'MODERATE',
    targetReturn: 52.0,
    benchmark: 'XU100',
    holdings: [
      {
        id: 'h-katilim-1',
        ticker: 'BIMAS',
        name: 'BİM Mağazaları',
        assetClass: 'BIST',
        quantity: 180,
        avgBuyPrice: 385.00,
        purchaseDate: '2024-01-05',
        currency: 'TRY',
      },
      {
        id: 'h-katilim-2',
        ticker: 'ASELS',
        name: 'Aselsan Elektronik',
        assetClass: 'BIST',
        quantity: 850,
        avgBuyPrice: 47.90,
        purchaseDate: '2024-01-08',
        currency: 'TRY',
      },
      {
        id: 'h-katilim-3',
        ticker: 'ALTIN',
        name: 'Gram Altın (Fiziki Karşılıklı)',
        assetClass: 'COMMODITY',
        quantity: 25,
        avgBuyPrice: 2040.00,
        purchaseDate: '2024-01-05',
        currency: 'TRY',
      },
      {
        id: 'h-katilim-4',
        ticker: 'SISE',
        name: 'Şişecam Cam Sanayi',
        assetClass: 'BIST',
        quantity: 600,
        avgBuyPrice: 44.50,
        purchaseDate: '2024-01-12',
        currency: 'TRY',
      }
    ],
  },
  {
    id: 'portfolio-delta',
    userId: 'user-default',
    name: 'Delta Model Portföyü (Global Çoklu Varlık & Makro Hedge)',
    createdAt: '2024-01-02',
    baseCurrency: 'USD',
    initialCapital: 25000,
    isActive: true,
    notes: 'Dolar bazlı Nasdaq, S&P 500, Yarı İletken, Altın ve Dijital Varlık rotasyonu.',
    riskTolerance: 'MODERATE',
    targetReturn: 28.0,
    benchmark: 'SPY',
    holdings: [
      {
        id: 'h-delta-1',
        ticker: 'QQQ',
        name: 'Invesco QQQ Trust (Nasdaq 100)',
        assetClass: 'US_ETF',
        quantity: 16,
        avgBuyPrice: 405.00,
        purchaseDate: '2024-01-05',
        currency: 'USD',
      },
      {
        id: 'h-delta-2',
        ticker: 'SPY',
        name: 'SPDR S&P 500 ETF Trust',
        assetClass: 'US_ETF',
        quantity: 12,
        avgBuyPrice: 472.00,
        purchaseDate: '2024-01-05',
        currency: 'USD',
      },
      {
        id: 'h-delta-3',
        ticker: 'SMH',
        name: 'VanEck Semiconductor ETF',
        assetClass: 'US_ETF',
        quantity: 15,
        avgBuyPrice: 175.00,
        purchaseDate: '2024-01-10',
        currency: 'USD',
      },
      {
        id: 'h-delta-4',
        ticker: 'GLD',
        name: 'SPDR Gold Shares ETF',
        assetClass: 'US_ETF',
        quantity: 18,
        avgBuyPrice: 190.00,
        purchaseDate: '2024-01-15',
        currency: 'USD',
      },
      {
        id: 'h-delta-5',
        ticker: 'BTC',
        name: 'Bitcoin',
        assetClass: 'CRYPTO',
        quantity: 0.05,
        avgBuyPrice: 43500.00,
        purchaseDate: '2024-01-15',
        currency: 'USD',
      }
    ],
  }
];

// In-memory Global Portföy Deposu
const portfolioStore = new Map<string, Portfolio>();
initialPortfolios.forEach(p => portfolioStore.set(p.id, p));

/**
 * Tüm Portföyleri Getir
 */
export function getAllPortfolios(): Portfolio[] {
  return Array.from(portfolioStore.values());
}

/**
 * ID ile Portföy Getir
 */
export function getPortfolioById(id: string): Portfolio | undefined {
  return portfolioStore.get(id);
}

/**
 * Yeni Portföy Oluştur
 */
export function createPortfolio(data: Partial<Portfolio>): Portfolio {
  const baseCurrency = data.baseCurrency || 'TRY';
  const holdings = data.holdings || [];

  // Başlangıç sermayesini otomatik hesapla
  let initialCost = 0;
  holdings.forEach(h => {
    initialCost += h.quantity * h.avgBuyPrice;
  });

  const newPortfolio: Portfolio = {
    id: `portfolio-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId: data.userId || 'user-default',
    name: data.name || 'Yeni Portföy',
    createdAt: data.createdAt || new Date().toISOString().split('T')[0],
    baseCurrency,
    initialCapital: data.initialCapital || Math.max(initialCost, 10000),
    holdings: holdings.map(h => ({
      ...h,
      id: h.id || `h-${Math.random().toString(36).substring(2, 9)}`,
      currency: h.currency || (h.assetClass === 'BIST' || h.assetClass === 'FUND' ? 'TRY' : 'USD'),
      purchaseDate: h.purchaseDate || data.createdAt || new Date().toISOString().split('T')[0],
    })),
    isActive: true,
    notes: data.notes || '',
    riskTolerance: data.riskTolerance || 'MODERATE',
    targetReturn: data.targetReturn || 35.0,
    benchmark: data.benchmark || (baseCurrency === 'TRY' ? 'XU100' : 'SPY'),
  };

  portfolioStore.set(newPortfolio.id, newPortfolio);
  return newPortfolio;
}

/**
 * Portföy Güncelle
 */
export function updatePortfolio(id: string, data: Partial<Portfolio>): Portfolio | null {
  const existing = portfolioStore.get(id);
  if (!existing) return null;

  const updated: Portfolio = {
    ...existing,
    ...data,
    holdings: data.holdings ? data.holdings.map(h => ({
      ...h,
      id: h.id || `h-${Math.random().toString(36).substring(2, 9)}`,
      currency: h.currency || (h.assetClass === 'BIST' || h.assetClass === 'FUND' ? 'TRY' : 'USD'),
      purchaseDate: h.purchaseDate || existing.createdAt,
    })) : existing.holdings,
  };

  portfolioStore.set(id, updated);
  return updated;
}

/**
 * Portföy Sil
 */
export function deletePortfolio(id: string): boolean {
  return portfolioStore.delete(id);
}

/**
 * Günlük Portföy Performansı ve Zaman Serisi Snapshot Hesaplama
 */
export async function calculatePortfolioPerformance(
  portfolio: Portfolio
): Promise<PortfolioSnapshot[]> {
  const snapshots: PortfolioSnapshot[] = [];
  const usdTryRate = await getUsdTryRate();

  const startDate = new Date(portfolio.createdAt || '2024-01-01');
  const today = new Date();

  // Gün farkını hesapla
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const totalDays = Math.max(1, Math.min(730, Math.ceil(diffTime / (1000 * 60 * 60 * 24))));

  // Anlık fiyatları ve maliyetleri çek
  const latestHoldingSnapshots: HoldingSnapshot[] = [];
  let currentTotalVal = 0;
  let currentTotalCost = 0;

  for (const h of portfolio.holdings) {
    let quote = null;
    let liveFundPrice = 0;
    
    if (h.assetClass === 'FUND') {
      if (localFinanceApi.isConfigured()) {
        try {
          const liveFund = await localFinanceApi.getFundData(h.ticker);
          if (liveFund) liveFundPrice = Number(liveFund.current_price || liveFund.price) || 0;
        } catch (e) {}
      }
    } else {
      quote = await getLiveQuoteForSymbol(h.ticker);
    }
    
    let rawPrice = quote?.currentPrice || (liveFundPrice > 0 ? liveFundPrice : null) || h.avgBuyPrice;
    let rawBuyPrice = h.avgBuyPrice;

    // Varlık para birimi dönüşümü
    const holdingCurrency = h.currency || (h.assetClass === 'BIST' || h.assetClass === 'FUND' ? 'TRY' : 'USD');
    
    // Değerleri temel para birimine dönüştür
    let priceInBase = rawPrice;
    let buyPriceInBase = rawBuyPrice;

    if (holdingCurrency === 'USD' && portfolio.baseCurrency === 'TRY') {
      priceInBase = rawPrice * usdTryRate;
      buyPriceInBase = rawBuyPrice * usdTryRate;
    } else if (holdingCurrency === 'TRY' && portfolio.baseCurrency === 'USD') {
      priceInBase = rawPrice / usdTryRate;
      buyPriceInBase = rawBuyPrice / usdTryRate;
    }

    const marketValue = priceInBase * h.quantity;
    const cost = buyPriceInBase * h.quantity;
    const pnl = marketValue - cost;
    const pnlPercentage = cost > 0 ? (pnl / cost) * 100 : 0;

    currentTotalVal += marketValue;
    currentTotalCost += cost;

    latestHoldingSnapshots.push({
      ticker: h.ticker,
      name: h.name || quote?.name || h.ticker,
      assetClass: h.assetClass,
      quantity: h.quantity,
      avgBuyPrice: Number(buyPriceInBase.toFixed(2)),
      currentPrice: Number(priceInBase.toFixed(2)),
      marketValue: Number(marketValue.toFixed(2)),
      cost: Number(cost.toFixed(2)),
      pnl: Number(pnl.toFixed(2)),
      pnlPercentage: Number(pnlPercentage.toFixed(2)),
      weightPercentage: 0, // Aşağıda hesaplanacak
      dailyReturnPct: quote?.change24hPercent || 0,
      currency: portfolio.baseCurrency,
    });
  }

  // Ağırlıkları normalize et
  latestHoldingSnapshots.forEach(h => {
    h.weightPercentage = currentTotalVal > 0 ? Number(((h.marketValue / currentTotalVal) * 100).toFixed(1)) : 0;
  });

  // Tarih serisi simülasyonu (Oluşturma gününden bugüne kadar gerçekçi eğri)
  const steps = Math.min(totalDays, 120);
  let runningCost = currentTotalCost;
  let runningVal = currentTotalCost; // Başlangıçta maliyete eşit

  // Kümülatif hedef büyüme oranı
  const finalGrowthFactor = currentTotalCost > 0 ? currentTotalVal / currentTotalCost : 1.0;
  let prevVal = runningVal;

  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    const dateObj = new Date(startDate.getTime() + progress * diffTime);
    const dateStr = dateObj.toISOString().split('T')[0];

    // İlerleme doğrultusunda bileşik büyüme
    const interpolatedVal = i === steps 
      ? currentTotalVal 
      : currentTotalCost * (1 + (finalGrowthFactor - 1) * Math.pow(progress, 0.85));

    const dayPnl = i === 0 ? 0 : interpolatedVal - prevVal;
    const dayPnlPct = prevVal > 0 ? (dayPnl / prevVal) * 100 : 0;
    prevVal = interpolatedVal;

    const cumPnl = interpolatedVal - runningCost;
    const cumPnlPct = runningCost > 0 ? (cumPnl / runningCost) * 100 : 0;

    snapshots.push({
      date: dateStr,
      totalValue: Number(interpolatedVal.toFixed(2)),
      totalCost: Number(runningCost.toFixed(2)),
      pnl: Number(cumPnl.toFixed(2)),
      pnlPercentage: Number(cumPnlPct.toFixed(2)),
      dailyPnl: Number(dayPnl.toFixed(2)),
      dailyPnlPercentage: Number(dayPnlPct.toFixed(2)),
      holdings: i === steps ? latestHoldingSnapshots : [],
    });
  }

  // En son günün snapshot'ını kontrol et ve eşik uyarılarını tetikle
  if (snapshots.length > 0) {
    const latest = snapshots[snapshots.length - 1];
    
    // Günlük Düşüş Bildirimi Eşiği (-3%)
    if (latest.dailyPnlPercentage < -3.0) {
      recordPortfolioAlert({
        portfolioId: portfolio.id,
        type: 'LARGE_DROP',
        severity: 'danger',
        title: '🔴 Yüksek Günlük Değer Kaybı',
        message: `${portfolio.name} portföyünüz bugün %${Math.abs(latest.dailyPnlPercentage).toFixed(2)} değer kaybetti.`,
      });
    }

    // Günlük Yükseliş Bildirimi Eşiği (+3%)
    if (latest.dailyPnlPercentage > 3.0) {
      recordPortfolioAlert({
        portfolioId: portfolio.id,
        type: 'LARGE_GAIN',
        severity: 'success',
        title: '🟢 Güçlü Günlük Değer Kazancı',
        message: `${portfolio.name} portföyünüz bugün %${latest.dailyPnlPercentage.toFixed(2)} değer kazandı.`,
      });
    }
  }

  return snapshots;
}
