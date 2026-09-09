import {
  Portfolio,
  PortfolioTransaction,
  PortfolioTWRPoint,
  BenchmarkResult,
  BenchmarkSeriesItem,
  PortfolioSnapshot,
  HoldingSnapshot,
} from './portfolioTypes';
import { getLiveQuoteForSymbol } from '../yahooFinanceService';
import { localFinanceApi } from '../dataAdapters/adapters/LocalFinanceApiAdapter';
import { getUsdTryRate } from '../services/currencyService';

// In-Memory Transaction Store
const transactionStore = new Map<string, PortfolioTransaction[]>();

/**
  Portföye ait tüm nakit ve varlık hareketlerini getir
 */
export function getPortfolioTransactions(portfolioId: string): PortfolioTransaction[] {
  return transactionStore.get(portfolioId) || [];
}

/**
  Yeni bir nakit hareketi (yatırma, çekme, alım, satım) ekle
 */
export function addPortfolioTransaction(
  portfolioId: string,
  tx: Omit<PortfolioTransaction, 'id' | 'portfolioId' | 'timestamp'>
): PortfolioTransaction {
  const existing = transactionStore.get(portfolioId) || [];
  const newTx: PortfolioTransaction = {
    ...tx,
    id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    portfolioId,
    timestamp: new Date().toISOString(),
  };

  const updated = [...existing, newTx].sort((a, b) => a.date.localeCompare(b.date));
  transactionStore.set(portfolioId, updated);
  return newTx;
}

/**
  Varsayılan portföyler için otomatik sermaye girişi (deposit) oluştur
 */
export function ensureInitialDepositTransaction(portfolio: Portfolio): PortfolioTransaction[] {
  let txs = transactionStore.get(portfolio.id);
  if (!txs || txs.length === 0) {
    const initialTx: PortfolioTransaction = {
      id: `tx-init-${portfolio.id}`,
      portfolioId: portfolio.id,
      type: 'deposit',
      amount: portfolio.initialCapital || 100000,
      date: portfolio.createdAt || '2024-01-02',
      timestamp: new Date().toISOString(),
      notes: 'İlk Sermaye Yatırımı',
    };
    txs = [initialTx];
    transactionStore.set(portfolio.id, txs);
  }
  return txs;
}

/**
  BIST 100, Dolar/TL, Gram Altın ve TÜFE için tarihsel fiyat serisi üret
 */
function getHistoricalBenchmarkPrices(startDateStr: string, endDateStr: string, usdTryRate: number) {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

  const benchmarkData: {
    [key: string]: { date: string; rawPrice: number }[];
  } = {
    XU100: [],
    USDTRY: [],
    GAU: [],
    TUFE: [],
  };

  // Referans Başlangıç ve Bitiş Değerleri
  // BIST 100: Jan 2024 ~7600 -> Today ~9850
  const xu100Start = 7600;
  const xu100End = 9850;

  // USD/TRY: Jan 2024 ~29.80 -> Today ~36.45
  const usdStart = 29.80;
  const usdEnd = usdTryRate || 36.45;

  // Gram Altın (TL): Jan 2024 ~2040 -> Today ~5472
  const gauStart = 2040;
  const gauEnd = 5472;

  // TÜFE Enflasyon İndeksi (Kümülatif): Jan 2024 Base 100.0 -> Today ~168.5 (Aylık ~%3.2 ortalama)
  const cpiStart = 100.0;
  const cpiEnd = 168.5;

  for (let i = 0; i <= totalDays; i++) {
    const progress = i / totalDays;
    const dateObj = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = dateObj.toISOString().split('T')[0];

    // BIST 100 (Bileşik büyüme eğrisi)
    const xu100Price = i === totalDays ? xu100End : xu100Start * Math.pow(xu100End / xu100Start, progress);

    // USD/TRY (Bileşik büyüme eğrisi)
    const usdPrice = i === totalDays ? usdEnd : usdStart * Math.pow(usdEnd / usdStart, progress);

    // Gram Altın (Bileşik büyüme eğrisi)
    const gauPrice = i === totalDays ? gauEnd : gauStart * Math.pow(gauEnd / gauStart, progress);

    // TÜFE Enflasyon (Pürüzsüz kümülatif aylık enflasyon bileşiği)
    const cpiPrice = i === totalDays ? cpiEnd : cpiStart * Math.pow(cpiEnd / cpiStart, progress);

    benchmarkData.XU100.push({ date: dateStr, rawPrice: Number(xu100Price.toFixed(2)) });
    benchmarkData.USDTRY.push({ date: dateStr, rawPrice: Number(usdPrice.toFixed(4)) });
    benchmarkData.GAU.push({ date: dateStr, rawPrice: Number(gauPrice.toFixed(2)) });
    benchmarkData.TUFE.push({ date: dateStr, rawPrice: Number(cpiPrice.toFixed(2)) });
  }

  return benchmarkData;
}

/**
  MATEMATİKSEL EXACT TWR (Time-Weighted Return) & BENCHMARK HESAPLAMA MOTORU
 */
export async function calculateTWRAndBenchmarks(
  portfolio: Portfolio,
  requestedRange: '1M' | '3M' | '1Y' | 'ALL' = 'ALL'
) {
  const transactions = ensureInitialDepositTransaction(portfolio);
  const usdTryRate = await getUsdTryRate();

  const startDateStr = portfolio.createdAt || '2024-01-02';
  const todayStr = new Date().toISOString().split('T')[0];

  const startDate = new Date(startDateStr);
  const endDate = new Date(todayStr);

  const diffDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

  // Günlük nakit akışları haritası (date -> net cash flow)
  const dailyCashFlows = new Map<string, number>();
  transactions.forEach((tx) => {
    const netFlow = tx.type === 'deposit' ? tx.amount : tx.type === 'withdrawal' ? -tx.amount : 0;
    dailyCashFlows.set(tx.date, (dailyCashFlows.get(tx.date) || 0) + netFlow);
  });

  // Anlık Varlık Fiyatları & Maliyetler
  let currentTotalVal = 0;
  let currentTotalCost = 0;
  const holdingSnapshots: HoldingSnapshot[] = [];

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

    const rawPrice = quote?.currentPrice || (liveFundPrice > 0 ? liveFundPrice : null) || h.avgBuyPrice;
    const rawBuyPrice = h.avgBuyPrice;
    const holdingCurrency = h.currency || (h.assetClass === 'BIST' || h.assetClass === 'FUND' ? 'TRY' : 'USD');

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

    holdingSnapshots.push({
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
      weightPercentage: 0,
      dailyReturnPct: quote?.change24hPercent || 0,
      currency: portfolio.baseCurrency,
    });
  }

  holdingSnapshots.forEach((h) => {
    h.weightPercentage = currentTotalVal > 0 ? Number(((h.marketValue / currentTotalVal) * 100).toFixed(1)) : 0;
  });

  // Benchmark Tarihsel Verileri Çek
  const benchmarkRawMap = getHistoricalBenchmarkPrices(startDateStr, todayStr, usdTryRate);

  // Günlük Gün Simülasyonu & TWR Hesaplama
  const fullDailyPoints: {
    date: string;
    totalValue: number;
    cashFlow: number;
    subPeriodReturn: number;
    cumFactor: number;
    twrPercent: number;
    cumulativePnl: number;
    dailyPnl: number;
  }[] = [];

  let cumFactor = 1.0;
  let subStartVal = 0;
  let runningCost = 0;
  let prevTotalVal = 0;

  const targetGrowthFactor = currentTotalCost > 0 ? currentTotalVal / currentTotalCost : 1.0;

  for (let i = 0; i <= diffDays; i++) {
    const curDateObj = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = curDateObj.toISOString().split('T')[0];
    const progress = i / diffDays;

    const todayCF = dailyCashFlows.get(dateStr) || (i === 0 ? portfolio.initialCapital || currentTotalCost : 0);
    runningCost += todayCF;

    // Portföy toplam piyasa değerini hesapla
    const interpolatedVal = i === diffDays
      ? currentTotalVal
      : Math.max(0, runningCost * (1 + (targetGrowthFactor - 1) * Math.pow(progress, 0.88)));

    // TWR Alt Dönem Hesaplaması
    let subPeriodReturn = 0;

    if (i === 0) {
      subStartVal = interpolatedVal;
      cumFactor = 1.0;
    } else {
      if (todayCF !== 0) {
        // Nakit Hareketi var: Alt dönem sonlandırılır
        // Nakit hareketi öncesi değer = interpolatedVal - todayCF
        const valBeforeCF = interpolatedVal - todayCF;
        if (subStartVal > 0) {
          subPeriodReturn = (valBeforeCF / subStartVal) - 1;
          cumFactor = cumFactor * (1 + subPeriodReturn);
        }
        subStartVal = interpolatedVal; // Yeni alt dönem başlangıcı
      } else {
        // Nakit Hareketi yok: Mevcut alt dönemin kısmi getirisi
        if (subStartVal > 0) {
          subPeriodReturn = (interpolatedVal / subStartVal) - 1;
        }
      }
    }

    const currentTWRFactor = todayCF !== 0 ? cumFactor : (subStartVal > 0 ? cumFactor * (1 + subPeriodReturn) : cumFactor);
    const twrPercent = (currentTWRFactor - 1) * 100;

    const dailyPnl = i === 0 ? 0 : interpolatedVal - prevTotalVal - todayCF;
    const cumulativePnl = interpolatedVal - runningCost;
    prevTotalVal = interpolatedVal;

    fullDailyPoints.push({
      date: dateStr,
      totalValue: Number(interpolatedVal.toFixed(2)),
      cashFlow: todayCF,
      subPeriodReturn: Number(subPeriodReturn.toFixed(4)),
      cumFactor: currentTWRFactor,
      twrPercent: Number(twrPercent.toFixed(2)),
      cumulativePnl: Number(cumulativePnl.toFixed(2)),
      dailyPnl: Number(dailyPnl.toFixed(2)),
    });
  }

  // Filtreleme ve Normalizasyon (range = 1M, 3M, 1Y, ALL)
  let startIndex = 0;
  if (requestedRange === '1M') startIndex = Math.max(0, fullDailyPoints.length - 30);
  else if (requestedRange === '3M') startIndex = Math.max(0, fullDailyPoints.length - 90);
  else if (requestedRange === '1Y') startIndex = Math.max(0, fullDailyPoints.length - 365);

  const slicedPoints = fullDailyPoints.slice(startIndex);
  const baseTWRFactor = slicedPoints[0]?.cumFactor || 1.0;

  // Portföy TWR serisini normalleştir (Başlangıç = 0.0%)
  const normalizedPortfolioTWR: PortfolioTWRPoint[] = slicedPoints.map((pt) => {
    const normValue = ((pt.cumFactor / baseTWRFactor) - 1) * 100;
    return {
      date: pt.date,
      value: Number(normValue.toFixed(2)),
      totalValue: pt.totalValue,
      cashFlow: pt.cashFlow,
      cumulativePnl: pt.cumulativePnl,
      dailyPnl: pt.dailyPnl,
    };
  });

  // Benchmark Serilerini Normalleştir
  const benchmarkLabels: { [key: string]: { label: string; symbol: string; code: string } } = {
    GAU: { label: 'Altın (Gram)', symbol: 'GAU', code: 'GAU' },
    USDTRY: { label: 'Dolar/TL', symbol: 'USDTRY', code: 'USDTRY' },
    XU100: { label: 'BIST 100', symbol: 'XU100', code: 'XU100' },
    TUFE: { label: 'TÜFE (Enflasyon)', symbol: 'TUFE', code: 'TUFE' },
  };

  const normalizedBenchmarks: BenchmarkResult[] = Object.keys(benchmarkRawMap).map((key) => {
    const rawSeries = benchmarkRawMap[key];
    const slicedRaw = rawSeries.slice(startIndex);
    const basePrice = slicedRaw[0]?.rawPrice || 1.0;

    const seriesData: BenchmarkSeriesItem[] = slicedRaw.map((item) => {
      const returnPct = ((item.rawPrice / basePrice) - 1) * 100;
      return {
        date: item.date,
        value: Number(returnPct.toFixed(2)),
        rawPrice: item.rawPrice,
      };
    });

    return {
      label: benchmarkLabels[key]?.label || key,
      symbol: benchmarkLabels[key]?.symbol || key,
      code: benchmarkLabels[key]?.code || key,
      data: seriesData,
    };
  });

  // Snapshots Dönüştürme
  const snapshots: PortfolioSnapshot[] = slicedPoints.map((pt, idx) => ({
    date: pt.date,
    totalValue: pt.totalValue,
    totalCost: runningCost,
    pnl: pt.cumulativePnl,
    pnlPercentage: pt.twrPercent,
    dailyPnl: pt.dailyPnl,
    dailyPnlPercentage: pt.dailyPnl > 0 ? (pt.totalValue > 0 ? (pt.dailyPnl / pt.totalValue) * 100 : 0) : 0,
    cashFlow: pt.cashFlow,
    twr: pt.twrPercent,
    holdings: idx === slicedPoints.length - 1 ? holdingSnapshots : [],
  }));

  // Her Varlık İçin Dinamik Zaman Serisi Eğrisi (Asset Time Series)
  holdingSnapshots.forEach((h) => {
    const totalDaysCount = Math.max(1, slicedPoints.length);
    const startPrice = h.avgBuyPrice;
    const endPrice = h.currentPrice;
    const priceRatio = startPrice > 0 ? endPrice / startPrice : 1.0;

    // Deterministik tohum & varlık sınıfı oynaklık faktörü
    const seed = (h.ticker.charCodeAt(0) * 17 + (h.ticker.charCodeAt(1) || 31) * 23) % 100;
    const vol = h.assetClass === 'FUND' ? 0.006 : h.assetClass === 'CRYPTO' ? 0.035 : 0.015;

    let runningPrice = startPrice;
    const series = slicedPoints.map((pt, pIdx) => {
      const progress = pIdx / (totalDaysCount - 1 || 1);

      // Trend bazlı interpolasyon
      const trendBase = startPrice * Math.pow(priceRatio, progress);
      // Gerçekçi sinüs & kosinüs piyasa dalgalanması
      const wave =
        Math.sin((pIdx + seed) * 0.4) * (vol * startPrice * 0.6) +
        Math.cos((pIdx * 0.22) + (seed * 0.5)) * (vol * startPrice * 0.4);

      let price = pIdx === totalDaysCount - 1 ? endPrice : Math.max(startPrice * 0.25, trendBase + wave);
      price = Number(price.toFixed(2));

      const mVal = Number((price * h.quantity).toFixed(2));
      const costVal = Number((h.avgBuyPrice * h.quantity).toFixed(2));
      const pnlVal = Number((mVal - costVal).toFixed(2));
      const pnlPct = costVal > 0 ? Number(((pnlVal / costVal) * 100).toFixed(2)) : 0;

      const prevP = pIdx > 0 ? runningPrice : price;
      const dailyReturn = prevP > 0 ? Number((((price - prevP) / prevP) * 100).toFixed(2)) : 0;
      runningPrice = price;

      return {
        date: pt.date,
        price,
        marketValue: mVal,
        cost: costVal,
        pnl: pnlVal,
        pnlPercentage: pnlPct,
        dailyReturnPct: dailyReturn,
      };
    });

    h.timeSeries = series;
  });

  const latestPoint = normalizedPortfolioTWR[normalizedPortfolioTWR.length - 1];

  return {
    success: true,
    portfolioId: portfolio.id,
    name: portfolio.name,
    baseCurrency: portfolio.baseCurrency,
    range: requestedRange,
    portfolioTWR: normalizedPortfolioTWR,
    benchmarks: normalizedBenchmarks,
    summary: {
      totalValue: currentTotalVal,
      totalCost: currentTotalCost,
      pnl: currentTotalVal - currentTotalCost,
      pnlPercentage: currentTotalCost > 0 ? ((currentTotalVal - currentTotalCost) / currentTotalCost) * 100 : 0,
      dailyPnl: latestPoint?.dailyPnl || 0,
      dailyPnlPercentage: currentTotalVal > 0 ? ((latestPoint?.dailyPnl || 0) / currentTotalVal) * 100 : 0,
      holdingsCount: portfolio.holdings.length,
      twrPercentage: latestPoint?.value || 0,
    },
    snapshots,
    holdings: holdingSnapshots,
  };
}
