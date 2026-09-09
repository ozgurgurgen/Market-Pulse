/**
 * CLI RUNNER FOR ADAPTER A/B COMPARISONS & CANARY TESTS
 */

import { CanaryTestRunner } from './CanaryTestRunner';
import { ABComparisonHarness } from './ABComparisonHarness';

async function main() {
  console.log('====================================================');
  console.log('1. CANARY HEALTH CHECK (TÜM ADAPTÖRLER)');
  console.log('====================================================');
  const canaryReport = await CanaryTestRunner.runAllCanaryTests();
  console.log(`Zaman: ${canaryReport.timestamp}`);
  console.log(`Genel Sağlık: ${canaryReport.overallHealthy ? '✅ SAĞLIKLI' : '⚠️ UYARI'}`);
  console.log(`Test Edilen: ${canaryReport.totalAdaptersTested}, Sağlıklı: ${canaryReport.healthyCount}`);
  canaryReport.results.forEach(r => {
    console.log(`  - [${r.sourceName}] Healthy: ${r.healthy ? '✅' : '❌'} | Latency: ${r.latencyMs}ms | Sample: ${r.sampleKeyTested} ${r.error ? '| Error: ' + r.error : ''}`);
  });

  console.log('\n====================================================');
  console.log('2. A/B DIFF KARŞILAŞTIRMA TESTİ (20 HİSSE / EMTİA)');
  console.log('====================================================');
  const stockAB = await ABComparisonHarness.runStockABTest();
  console.log(`Özet: ${stockAB.summary}`);
  console.table(stockAB.results.map(r => ({
    Sembol: r.symbol,
    Tip: r.sourceType,
    EskiFiyat: r.oldPrice,
    YeniFiyat: r.newPrice,
    ParaBirimi: r.newCurrency,
    FarkPct: `%${r.priceDiffPct}`,
    Uyum: r.match ? '✅ UYUMLU' : '❌ FARK',
    Notlar: r.notes
  })));

  console.log('\n====================================================');
  console.log('3. A/B DIFF KARŞILAŞTIRMA TESTİ (15 TEFAS FONU)');
  console.log('====================================================');
  const fundAB = await ABComparisonHarness.runFundABTest();
  console.log(`Özet: ${fundAB.summary}`);
  console.table(fundAB.results.map(r => ({
    Kod: r.symbol,
    EskiFiyat: r.oldPrice,
    YeniFiyat: r.newPrice,
    FarkPct: `%${r.priceDiffPct}`,
    Uyum: r.match ? '✅ UYUMLU' : '❌ FARK',
    Notlar: r.notes
  })));
}

main().catch(err => {
  console.error('Test çalıştırma hatası:', err);
  process.exit(1);
});
