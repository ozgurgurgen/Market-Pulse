import { getLiveQuoteForSymbol } from './server/yahooFinanceService.ts';

async function runLoadTest() {
  console.log("🚀 Starting Load Test (Real Symbols - testing concurrency and dedup)");
  
  const baseSymbols = ['AMD', 'INTC', 'NFLX', 'CRM', 'ADBE'];
  let symbols: string[] = [];
  for (let i = 0; i < 8; i++) {
    symbols = symbols.concat(baseSymbols);
  }

  const startTime = Date.now();
  let successCount = 0;
  let failCount = 0;

  const promises = symbols.map(async (sym) => {
    try {
      const res = await getLiveQuoteForSymbol(sym);
      if (res && res.currentPrice > 0) {
        successCount++;
      } else {
        failCount++;
      }
    } catch (e: any) {
      failCount++;
    }
  });

  await Promise.all(promises);

  const duration = (Date.now() - startTime) / 1000;
  console.log(`\n📊 LOAD TEST RESULTS (REAL SYMBOLS):`);
  console.log(`⏱️ Duration: ${duration} seconds`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  process.exit(0);
}

runLoadTest();
