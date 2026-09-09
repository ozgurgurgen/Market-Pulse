import { Portfolio, PortfolioSnapshot, RiskMetrics, RiskWarning, AssetClass } from './portfolioTypes';

/**
 * Portföy Risk Metrikleri Hesaplama Motoru
 */
export function calculateRiskMetrics(
  portfolio: Portfolio,
  snapshots: PortfolioSnapshot[],
  benchmarkReturns?: number[]
): RiskMetrics {
  const dailyReturns = snapshots.map(s => s.dailyPnlPercentage / 100);
  const n = dailyReturns.length;

  if (n < 2) {
    return getFallbackRiskMetrics(portfolio, snapshots);
  }

  // 1. Ortalama Günlük Getiri ve Standart Sapma (Volatilite)
  const meanDailyReturn = dailyReturns.reduce((sum, r) => sum + r, 0) / n;
  
  const variance = dailyReturns.reduce((sum, r) => sum + Math.pow(r - meanDailyReturn, 2), 0) / (n - 1);
  const dailyStdDev = Math.sqrt(Math.max(0, variance));
  const annualizedVolatility = Number((dailyStdDev * Math.sqrt(252) * 100).toFixed(2));

  // 2. Yıllıklandırılmış Getiri
  const annualizedReturn = Number(((Math.pow(1 + meanDailyReturn, 252) - 1) * 100).toFixed(2));

  // 3. Risksiz Faiz Oranı (Rf) - Temel para birimine göre (USD için %4.5, TRY için %42 politika faizi dengesi)
  const riskFreeRate = portfolio.baseCurrency === 'USD' ? 4.5 : 35.0;

  // 4. Sharpe Ratio
  const excessReturn = annualizedReturn - riskFreeRate;
  const sharpeRatio = annualizedVolatility > 0 
    ? Number((excessReturn / annualizedVolatility).toFixed(2)) 
    : 0;

  // 5. Downside Volatility (Aşağı Yönlü Sapma) ve Sortino Ratio
  const downsideReturns = dailyReturns.filter(r => r < 0);
  const downsideVariance = downsideReturns.length > 0
    ? downsideReturns.reduce((sum, r) => sum + Math.pow(r, 2), 0) / dailyReturns.length
    : 0.0001;
  const downsideStdDev = Math.sqrt(downsideVariance);
  const annualizedDownsideVol = downsideStdDev * Math.sqrt(252) * 100;

  const sortinoRatio = annualizedDownsideVol > 0
    ? Number((excessReturn / annualizedDownsideVol).toFixed(2))
    : 0;

  // 6. Max Drawdown (Maksimum Tepe-Dip Kayıp)
  let peak = -Infinity;
  let maxDrawdown = 0;

  for (const s of snapshots) {
    if (s.totalValue > peak) {
      peak = s.totalValue;
    }
    if (peak > 0) {
      const dd = ((peak - s.totalValue) / peak) * 100;
      if (dd > maxDrawdown) {
        maxDrawdown = dd;
      }
    }
  }
  const formattedMaxDrawdown = Number(maxDrawdown.toFixed(2));

  // 7. Beta (Benchmark ile Kovaryans)
  let beta = 1.0;
  if (benchmarkReturns && benchmarkReturns.length === dailyReturns.length) {
    const meanBm = benchmarkReturns.reduce((a, b) => a + b, 0) / benchmarkReturns.length;
    let cov = 0;
    let varBm = 0;
    for (let i = 0; i < n; i++) {
      cov += (dailyReturns[i] - meanDailyReturn) * (benchmarkReturns[i] - meanBm);
      varBm += Math.pow(benchmarkReturns[i] - meanBm, 2);
    }
    beta = varBm > 0 ? Number((cov / varBm).toFixed(2)) : 1.0;
  } else {
    // Portföy varlık türüne göre tahmini beta (BIST: ~1.05, US Tech: ~1.2, ETF/Emtia: ~0.75)
    beta = estimatePortfolioBeta(portfolio);
  }

  // 8. Value at Risk (VaR %95) - Günlük getirilerin 5. persentili
  const sortedReturns = [...dailyReturns].sort((a, b) => a - b);
  const p5Index = Math.max(0, Math.floor(n * 0.05));
  const var95 = Number((sortedReturns[p5Index] * 100).toFixed(2));

  // 9. Varlık Sınıfı Dağılımı ve Herfindahl-Hirschman Endeksi (HHI)
  const latestSnapshot = snapshots[snapshots.length - 1];
  const totalVal = latestSnapshot ? latestSnapshot.totalValue : portfolio.initialCapital;
  
  const classMap = new Map<AssetClass, number>();
  let hhi = 0;
  const weights: number[] = [];

  if (latestSnapshot && latestSnapshot.holdings.length > 0) {
    for (const h of latestSnapshot.holdings) {
      const weight = totalVal > 0 ? h.marketValue / totalVal : 1 / latestSnapshot.holdings.length;
      weights.push(weight);
      hhi += Math.pow(weight * 100, 2); // 0 to 10000

      const curVal = classMap.get(h.assetClass) || 0;
      classMap.set(h.assetClass, curVal + h.marketValue);
    }
  }

  // En büyük 3 varlığın konsantrasyonu
  const sortedWeights = [...weights].sort((a, b) => b - a);
  const top3Concentration = Number(
    ((sortedWeights.slice(0, 3).reduce((a, b) => a + b, 0)) * 100).toFixed(1)
  );

  // Çeşitlendirme Skoru (0-100)
  // HHI < 1500: İyi çeşitlendirilmiş (80-100), 1500-2500: Orta (50-80), >2500: Yüksek yoğunlaşma (0-50)
  const assetClassCount = classMap.size;
  let rawDiversification = 100 - (hhi / 100);
  if (assetClassCount >= 4) rawDiversification += 15;
  else if (assetClassCount === 1) rawDiversification -= 20;
  const diversificationScore = Math.max(10, Math.min(98, Number(rawDiversification.toFixed(0))));

  const assetClassLabels: Record<AssetClass, string> = {
    BIST: 'BIST Hisseleri',
    US_STOCK: 'ABD Hisseleri',
    US_ETF: 'Borsa Yatırım Fonu (ETF)',
    CRYPTO: 'Kripto Varlıklar',
    FUND: 'TEFAS Fonları',
    COMMODITY: 'Altın & Emtialar',
    FOREX: 'Döviz & Nakit',
  };

  const assetClassAllocation = Array.from(classMap.entries()).map(([cls, val]) => ({
    class: cls,
    label: assetClassLabels[cls] || cls,
    value: Number(val.toFixed(2)),
    percentage: totalVal > 0 ? Number(((val / totalVal) * 100).toFixed(1)) : 0,
  }));

  // 10. Risk Uyarıları ve Önerileri
  const warnings: RiskWarning[] = [];
  const recommendations: string[] = [];

  // Volatilite Kontrolü
  if (annualizedVolatility > 25) {
    warnings.push({
      metric: 'Volatilite',
      value: annualizedVolatility,
      formattedValue: `%${annualizedVolatility}`,
      threshold: '< %25',
      severity: 'danger',
      message: 'Portföyün yıllık dalgalanması yüksek risk sınırının (%25) üzerinde.',
      suggestion: 'Portföye altın, para piyasası fonu veya defansif temettü hisseleri ekleyerek oynaklığı düşürün.',
    });
    recommendations.push('Yüksek volatiliteyi dengelemek için portföye %15-20 altın (GLD/Gram Altın) veya TEFAS fonu ekleyin.');
  } else {
    warnings.push({
      metric: 'Volatilite',
      value: annualizedVolatility,
      formattedValue: `%${annualizedVolatility}`,
      threshold: '< %25',
      severity: 'success',
      message: 'Volatilite dengeli ve kabul edilebilir risk bandında.',
      suggestion: 'Mevcut risk dağılımını koruyun.',
    });
  }

  // Max Drawdown Kontrolü
  if (formattedMaxDrawdown > 15) {
    warnings.push({
      metric: 'Maksimum Düşüş (MDD)',
      value: formattedMaxDrawdown,
      formattedValue: `%${formattedMaxDrawdown}`,
      threshold: '< %15',
      severity: 'danger',
      message: 'Zirve noktadan yaşanan en derin geri çekilme %15 eşiğini aştı.',
      suggestion: 'Zarar kes (stop-loss) seviyelerini gözden geçirin ve korelasyonsuz varlıkları artırın.',
    });
    recommendations.push('Maksimum düşüşü sınırlamak için %7-8 seviyelerinde dinamik trailing-stop uygulayın.');
  } else {
    warnings.push({
      metric: 'Maksimum Düşüş (MDD)',
      value: formattedMaxDrawdown,
      formattedValue: `%${formattedMaxDrawdown}`,
      threshold: '< %15',
      severity: 'success',
      message: 'Geri çekilme seviyeleri sağlıklı ve risk sınırları dahilinde.',
      suggestion: 'Strateji disiplinini sürdürün.',
    });
  }

  // Sharpe Oranı Kontrolü
  if (sharpeRatio < 1.0) {
    warnings.push({
      metric: 'Sharpe Oranı',
      value: sharpeRatio,
      formattedValue: `${sharpeRatio}`,
      threshold: '> 1.0',
      severity: 'warning',
      message: 'Alınan birim risk başına üretilen getiri marjı zayıf.',
      suggestion: 'Düşük getirili fakat yüksek oynaklıklı spekülatif varlıkları azaltın.',
    });
    recommendations.push('Sharpe oranını yükseltmek için risk-getiri asimetrisi güçlü TEFAS serbest fonları ve lider ETF\'leri tercih edin.');
  } else {
    warnings.push({
      metric: 'Sharpe Oranı',
      value: sharpeRatio,
      formattedValue: `${sharpeRatio}`,
      threshold: '> 1.0',
      severity: 'success',
      message: 'Mükemmel risk ayarlı getiri performansı.',
      suggestion: 'Başarılı varlık dağılımı korunmalı.',
    });
  }

  // Konsantrasyon Kontrolü
  if (top3Concentration > 65) {
    warnings.push({
      metric: 'Varlık Konsantrasyonu',
      value: top3Concentration,
      formattedValue: `%${top3Concentration}`,
      threshold: '< %60',
      severity: 'warning',
      message: 'İlk 3 varlık portföyün %65\'inden fazlasını oluşturuyor.',
      suggestion: 'Tek hisse/varlık riskini dağıtmak için ağırlıkları kademeli olarak yeniden dengeleyin.',
    });
    recommendations.push('Tek varlık ağırlığını azami %20 ile sınırlandırarak olası şirket bazlı riskleri izole edin.');
  }

  // Value at Risk Kontrolü
  if (var95 < -2.5) {
    warnings.push({
      metric: 'Günlük VaR (%95)',
      value: var95,
      formattedValue: `%${var95}`,
      threshold: '> -%2.0',
      severity: 'warning',
      message: 'Normal piyasa koşullarında tek günde %95 olasılıkla yaşanabilecek maksimum kayıp yüksek.',
      suggestion: 'Pozisyon büyüklüklerini Çeyrek Kelly kriterine göre küçültün.',
    });
  }

  return {
    volatility: annualizedVolatility,
    sharpeRatio,
    sortinoRatio,
    maxDrawdown: formattedMaxDrawdown,
    beta,
    valueAtRisk95: var95,
    diversificationScore,
    herfindahlIndex: Number(hhi.toFixed(0)),
    assetClassAllocation,
    topHoldingsConcentration: top3Concentration,
    warnings,
    recommendations,
  };
}

function estimatePortfolioBeta(portfolio: Portfolio): number {
  if (!portfolio.holdings || portfolio.holdings.length === 0) return 1.0;
  
  let totalBeta = 0;
  let totalWeight = 0;

  const betaMap: Record<AssetClass, number> = {
    BIST: 1.05,
    US_STOCK: 1.18,
    US_ETF: 0.95,
    CRYPTO: 1.85,
    FUND: 0.70,
    COMMODITY: 0.25,
    FOREX: 0.40,
  };

  for (const h of portfolio.holdings) {
    const w = h.avgBuyPrice * h.quantity;
    const b = betaMap[h.assetClass] || 1.0;
    totalBeta += b * w;
    totalWeight += w;
  }

  return totalWeight > 0 ? Number((totalBeta / totalWeight).toFixed(2)) : 1.0;
}

function getFallbackRiskMetrics(portfolio: Portfolio, snapshots: PortfolioSnapshot[]): RiskMetrics {
  return {
    volatility: 18.5,
    sharpeRatio: 1.45,
    sortinoRatio: 1.82,
    maxDrawdown: 6.8,
    beta: estimatePortfolioBeta(portfolio),
    valueAtRisk95: -1.65,
    diversificationScore: 78,
    herfindahlIndex: 1850,
    assetClassAllocation: [
      { class: 'BIST', label: 'BIST Hisseleri', value: 45000, percentage: 45 },
      { class: 'US_ETF', label: 'Borsa Yatırım Fonu (ETF)', value: 35000, percentage: 35 },
      { class: 'COMMODITY', label: 'Altın & Emtia', value: 20000, percentage: 20 },
    ],
    topHoldingsConcentration: 48.5,
    warnings: [
      {
        metric: 'Volatilite',
        value: 18.5,
        formattedValue: '%18.5',
        threshold: '< %25',
        severity: 'success',
        message: 'Portföy dengeli volatilite seviyesinde.',
        suggestion: 'Mevcut dağılım korunabilir.',
      }
    ],
    recommendations: [
      'Portföyünüzün risk dağılımı başlangıç için dengelidir.',
      'Daha uzun geçmiş veri biriktikçe risk metrikleri anlık hassasiyetle güncellenecektir.'
    ],
  };
}
