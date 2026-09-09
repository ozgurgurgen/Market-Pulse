import { getLiveQuoteForSymbol } from './server/yahooFinanceService.ts';

async function runLoadTest() {
  console.log("\n🚀 Starting Load Test 1 (40 distinct concurrent requests for new/uncached symbols)");
  // These are not in the universe, will force YF fetch and trigger global limiter
  const fakeSymbols = Array.from({length: 40}, (_, i) => `DUMMY${i}-${Date.now()}`);
  const startTime2 = Date.now();
  let s2 = 0; let f2 = 0;
  
  const promises2 = fakeSymbols.map(async (sym) => {
    try {
      const res = await getLiveQuoteForSymbol(sym);
      if (res) s2++;
      else f2++;
    } catch (e: any) {
      f2++;
    }
  });

  await Promise.all(promises2);
  
  const duration2 = (Date.now() - startTime2) / 1000;
  console.log(`\n📊 LOAD TEST 1 (Distinct Fake) RESULTS:`);
  console.log(`⏱️ Duration: ${duration2} seconds`);
  console.log(`✅ Success: ${s2}`); 
  console.log(`❌ Failed: ${f2}`); 

  console.log("\n🚀 Starting Load Test 2 (40 concurrent requests for the SAME new symbol to test deduplication)");
  const sameSym = `DEDUP-${Date.now()}`;
  const startTime3 = Date.now();
  let s3 = 0; let f3 = 0;
  const promises3 = Array(40).fill(sameSym).map(async (sym) => {
    try {
      const res = await getLiveQuoteForSymbol(sym);
      if (res) s3++;
      else f3++;
    } catch (e: any) {
      f3++;
    }
  });

  await Promise.all(promises3);
  const duration3 = (Date.now() - startTime3) / 1000;
  console.log(`\n📊 LOAD TEST 2 (Deduplication) RESULTS:`);
  console.log(`⏱️ Duration: ${duration3} seconds`);
  console.log(`✅ Success: ${s3}`); 
  console.log(`❌ Failed: ${f3}`);

  process.exit(0);
}

runLoadTest();
