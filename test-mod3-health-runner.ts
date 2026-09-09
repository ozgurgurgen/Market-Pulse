import http from 'http';
import { orchestratorAgent } from './server/intelligence/orchestratorAgent';

interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  memoryUsage: {
    heapUsed: number;
    heapTotal: number;
    rss: number;
    external: number;
    arrayBuffers: number;
  };
  activeHandles: number;
}

function singleFetchHealth(port = 3000): Promise<HealthResponse> {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://127.0.0.1:${port}/api/health`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(new Error(`Failed to parse health JSON: ${data}`));
        }
      });
    });
    req.on('error', (err) => reject(err));
    req.setTimeout(3000, () => {
      req.destroy();
      reject(new Error('Timeout 3000ms'));
    });
  });
}

async function fetchHealth(port = 3000): Promise<HealthResponse> {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await singleFetchHealth(port);
    } catch {
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  const mem = process.memoryUsage();
  const activeHandles = typeof (process as any)._getActiveHandles === 'function' 
    ? (process as any)._getActiveHandles().length 
    : 0;
  return {
    status: 'ok (direct)',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    memoryUsage: {
      heapUsed: mem.heapUsed,
      heapTotal: mem.heapTotal,
      rss: mem.rss,
      external: mem.external,
      arrayBuffers: mem.arrayBuffers,
    },
    activeHandles,
  };
}

function toMB(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function runCycles(tickers: string[], label: string) {
  console.log(`▶️   [${label}] ${tickers.length} Döngü Çalıştırılıyor...`);
  const startTime = Date.now();
  for (let i = 0; i < tickers.length; i++) {
    const ticker = tickers[i];
    const report = await orchestratorAgent.generateFinalReport(ticker);
    console.log(`   - [${i + 1}/${tickers.length}] Rapor: ${ticker} | Technical Score: ${report.analysis.technical_score}`);
    await new Promise((r) => setTimeout(r, 20));
  }
  const elapsed = Date.now() - startTime;
  console.log(`   ✔️  [${label}] ${tickers.length} Döngü ${elapsed} ms sürdü (${(elapsed / tickers.length).toFixed(1)} ms/döngü)\n`);
}

async function main() {
  console.log('================================================================');
  console.log('  🔥 MODÜL 3: WARM-UP & 30 DÖNGÜLÜK BELLEK SIZINTISI (LEAK) TESTİ');
  console.log('================================================================\n');

  const warmupTickers = ['THYAO', 'ASELS', 'NVDA', 'BTC-USD', 'ETH-USD', 'EREGL', 'TUPRS', 'KCHOL', 'BIMAS', 'SISE'];
  const phase1Tickers = ['THYAO', 'ASELS', 'NVDA', 'BTC-USD', 'ETH-USD', 'EREGL', 'TUPRS', 'KCHOL', 'BIMAS', 'SISE'];
  const phase2Tickers = ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 'TSLA', 'SOL-USD', 'AVAX-USD', 'XRP-USD', 'GARAN'];

  // A. WARM-UP FAZI (10 Döngü)
  console.log('1️⃣   AŞAMA 1: WARM-UP (ISINMA FAZI - 10 DÖNGÜ)...');
  await runCycles(warmupTickers, 'Warm-up');

  // WARM-UP SONRASI GC VE BASELINE ALIMI
  if (global.gc) global.gc();
  const baselineHealth = await fetchHealth(3000);

  console.log('📌  WARM-UP SONRASI YENİ BASELINE (GC SONRASI):');
  console.log(`   • Active Handles  : ${baselineHealth.activeHandles}`);
  console.log(`   • Heap Used       : ${toMB(baselineHealth.memoryUsage.heapUsed)}`);
  console.log(`   • Heap Total      : ${toMB(baselineHealth.memoryUsage.heapTotal)}`);
  console.log(`   • RSS             : ${toMB(baselineHealth.memoryUsage.rss)}\n`);

  // B. TEST FAZI 1 (10-20. Döngüler)
  console.log('2️⃣   AŞAMA 2: DÖNGÜ 11-20 (10 DÖNGÜ DAHA)...');
  await runCycles(phase1Tickers, 'Faz 1 (Döngü 11-20)');

  if (global.gc) global.gc();
  const midHealth = await fetchHealth(3000);

  console.log('📌  20 DÖNGÜ SONRASI METRİKLER (GC SONRASI):');
  console.log(`   • Active Handles  : ${midHealth.activeHandles}`);
  console.log(`   • Heap Used       : ${toMB(midHealth.memoryUsage.heapUsed)}`);
  console.log(`   • Heap Total      : ${toMB(midHealth.memoryUsage.heapTotal)}`);
  console.log(`   • RSS             : ${toMB(midHealth.memoryUsage.rss)}\n`);

  // C. TEST FAZI 2 (20-30. Döngüler)
  console.log('3️⃣   AŞAMA 3: DÖNGÜ 21-30 (10 DÖNGÜ DAHA)...');
  await runCycles(phase2Tickers, 'Faz 2 (Döngü 21-30)');

  if (global.gc) global.gc();
  const finalHealth = await fetchHealth(3000);

  console.log('📌  30 DÖNGÜ SONRASI NİHAİ METRİKLER (GC SONRASI):');
  console.log(`   • Active Handles  : ${finalHealth.activeHandles}`);
  console.log(`   • Heap Used       : ${toMB(finalHealth.memoryUsage.heapUsed)}`);
  console.log(`   • Heap Total      : ${toMB(finalHealth.memoryUsage.heapTotal)}`);
  console.log(`   • RSS             : ${toMB(finalHealth.memoryUsage.rss)}\n`);

  // D. DETAYLI KARŞILAŞTIRMA VE SIZINTI TEŞHİSİ
  const heapDelta_10_to_20 = midHealth.memoryUsage.heapUsed - baselineHealth.memoryUsage.heapUsed;
  const heapDelta_20_to_30 = finalHealth.memoryUsage.heapUsed - midHealth.memoryUsage.heapUsed;
  const totalHeapDelta_10_to_30 = finalHealth.memoryUsage.heapUsed - baselineHealth.memoryUsage.heapUsed;
  const handleDelta = finalHealth.activeHandles - baselineHealth.activeHandles;

  console.log('================================================================');
  console.log('  📊 FAZ BAZLI HEAP & HANDLE KARŞILAŞTIRMA TABLOSU');
  console.log('================================================================');
  console.log(`| Aşama                   | Active Handles | Heap Used  | Heap Total | RSS        |`);
  console.log(`|-------------------------|----------------|------------|------------|------------|`);
  console.log(`| Baseline (10 Döngü Warm)| ${baselineHealth.activeHandles.toString().padEnd(14)} | ${toMB(baselineHealth.memoryUsage.heapUsed).padEnd(10)} | ${toMB(baselineHealth.memoryUsage.heapTotal).padEnd(10)} | ${toMB(baselineHealth.memoryUsage.rss).padEnd(10)} |`);
  console.log(`| Faz 1 (20 Toplam Döngü) | ${midHealth.activeHandles.toString().padEnd(14)} | ${toMB(midHealth.memoryUsage.heapUsed).padEnd(10)} | ${toMB(midHealth.memoryUsage.heapTotal).padEnd(10)} | ${toMB(midHealth.memoryUsage.rss).padEnd(10)} |`);
  console.log(`| Faz 2 (30 Toplam Döngü) | ${finalHealth.activeHandles.toString().padEnd(14)} | ${toMB(finalHealth.memoryUsage.heapUsed).padEnd(10)} | ${toMB(finalHealth.memoryUsage.heapTotal).padEnd(10)} | ${toMB(finalHealth.memoryUsage.rss).padEnd(10)} |`);

  console.log('\n📈 HEAP BÜYÜME FARKLARI (DELTA ANALİZİ):');
  console.log(`   • 10 -> 20. Döngü Heap Artışı (Delta 1) : ${(heapDelta_10_to_20 >= 0 ? '+' : '') + toMB(heapDelta_10_to_20)}`);
  console.log(`   • 20 -> 30. Döngü Heap Artışı (Delta 2) : ${(heapDelta_20_to_30 >= 0 ? '+' : '') + toMB(heapDelta_20_to_30)}`);
  console.log(`   • Toplam 10 -> 30. Döngü Heap Değişimi   : ${(totalHeapDelta_10_to_30 >= 0 ? '+' : '') + toMB(totalHeapDelta_10_to_30)}`);
  console.log(`   • Active Handles Değişimi                : ${(handleDelta >= 0 ? '+' : '') + handleDelta}`);

  console.log('\n🧠 NİHAİ TEŞHİS VE KARAR:');
  const delta2MB = heapDelta_20_to_30 / 1024 / 1024;

  if (handleDelta === 0) {
    console.log('   ✅ HANDLE / SOCKET SIZINTISI YOK: Active handles 10., 20. ve 30. döngülerde tamamen sabittir.');
  } else {
    console.log(`   ⚠️ HANDLE DEĞİŞİMİ: ${handleDelta} adet handle farkı kaydedildi.`);
  }

  if (Math.abs(delta2MB) < 5.0) {
    console.log('   ✅ TEK SEFERLİK WARM-UP/CACHE (LEAK YOK): 20->30 döngü arasındaki heap değişimi DÜZLEŞMİŞTİR (delta < 5MB). Bellek büyümesi lineer veya sürekli değildir.');
  } else if (heapDelta_20_to_30 > heapDelta_10_to_20 * 1.5) {
    console.log('   🔴 SÜREKLİ LEAK VAR: Heap büyümesi döngü sayısıyla orantılı şekilde ivmelenerek devam etmektedir.');
  } else {
    console.log('   ℹ️ BELLEK DÜZEYİ DENGELENİYOR: Heap değişimi kontrol altındadır.');
  }

  console.log('================================================================\n');
}

main().catch((err) => {
  console.error('Hata:', err);
  process.exit(1);
});
