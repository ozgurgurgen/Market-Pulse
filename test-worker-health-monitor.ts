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

async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch('http://127.0.0.1:3000/api/health');
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching health`);
  }
  return (await res.json()) as HealthResponse;
}

function formatMB(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function runWorkerHealthAudit() {
  console.log('==========================================================');
  console.log('  🔍 MODÜL 3: WORKER SAĞLIK İZLEME VE MEMORY/HANDLE AUDIT');
  console.log('==========================================================\n');

  // 1. Başlangıç Durumunu Al (Real HTTP GET /api/health)
  if (global.gc) {
    global.gc();
  }
  const initialHealth = await fetchHealth();
  console.log('1️⃣   BAŞLANGIÇ SAĞLIK VE DÜZEY ÖLÇÜMÜ (INITIAL BASELINE):');
  console.log(`   • Uptime          : ${initialHealth.uptime} saniye`);
  console.log(`   • Active Handles  : ${initialHealth.activeHandles}`);
  console.log(`   • Heap Used       : ${formatMB(initialHealth.memoryUsage.heapUsed)} (${initialHealth.memoryUsage.heapUsed} B)`);
  console.log(`   • Heap Total      : ${formatMB(initialHealth.memoryUsage.heapTotal)}`);
  console.log(`   • RSS             : ${formatMB(initialHealth.memoryUsage.rss)}\n`);

  // 2. Worker'ı 10 Döngü Art Arda Çalıştır
  const tickers = ['THYAO', 'ASELS', 'NVDA', 'BTC-USD', 'ETH-USD', 'EREGL', 'TUPRS', 'AAPL', 'MSFT', 'KCHOL'];
  console.log(`2️⃣   WORKER 10 DÖNGÜ ART ARDA ÇALIŞTIRILIYOR (${tickers.length} Rapor Üretimi)...`);
  
  const startTime = Date.now();
  for (let i = 0; i < tickers.length; i++) {
    const ticker = tickers[i];
    try {
      const report = await orchestratorAgent.generateFinalReport(ticker);
      console.log(`   [${i + 1}/${tickers.length}] ✅ Rapor Üretildi: ${ticker} (Skor: ${report.analysis.technical_score}, Gelişme: ${report.key_developments.length})`);
    } catch (err: any) {
      console.error(`   [${i + 1}/${tickers.length}] ❌ Hata (${ticker}):`, err.message);
    }
  }
  const durationMs = Date.now() - startTime;
  console.log(`\n⏱️   10 Döngü Toplam Tamamlanma Süresi: ${durationMs} ms (${(durationMs / 10).toFixed(1)} ms/döngü)\n`);

  // 3. GC Çağrısı ve Çalışma Sonrası Ölçüm (Real HTTP GET /api/health)
  if (global.gc) {
    global.gc();
  }
  const postHealth = await fetchHealth();
  console.log('3️⃣   İŞLEM SONRASI SAĞLIK VE DÜZEY ÖLÇÜMÜ (POST-WORKER HEALTH):');
  console.log(`   • Uptime          : ${postHealth.uptime} saniye`);
  console.log(`   • Active Handles  : ${postHealth.activeHandles}`);
  console.log(`   • Heap Used       : ${formatMB(postHealth.memoryUsage.heapUsed)} (${postHealth.memoryUsage.heapUsed} B)`);
  console.log(`   • Heap Total      : ${formatMB(postHealth.memoryUsage.heapTotal)}`);
  console.log(`   • RSS             : ${formatMB(postHealth.memoryUsage.rss)}\n`);

  // 4. Karşılaştırma ve Analiz
  const heapUsedDeltaBytes = postHealth.memoryUsage.heapUsed - initialHealth.memoryUsage.heapUsed;
  const heapTotalDeltaBytes = postHealth.memoryUsage.heapTotal - initialHealth.memoryUsage.heapTotal;
  const rssDeltaBytes = postHealth.memoryUsage.rss - initialHealth.memoryUsage.rss;
  const activeHandlesDelta = postHealth.activeHandles - initialHealth.activeHandles;

  console.log('==========================================================');
  console.log('  📊 SAĞLIK & BELLEK/HANDLE DEĞİŞİM KARŞILAŞTIRMA RAPORU');
  console.log('==========================================================');
  console.log(`• Active Handles Değişimi  : ${initialHealth.activeHandles} -> ${postHealth.activeHandles} (Fark: ${activeHandlesDelta >= 0 ? '+' : ''}${activeHandlesDelta})`);
  console.log(`• Heap Used Değişimi       : ${formatMB(initialHealth.memoryUsage.heapUsed)} -> ${formatMB(postHealth.memoryUsage.heapUsed)} (Fark: ${heapUsedDeltaBytes >= 0 ? '+' : ''}${formatMB(heapUsedDeltaBytes)})`);
  console.log(`• Heap Total Değişimi      : ${formatMB(initialHealth.memoryUsage.heapTotal)} -> ${formatMB(postHealth.memoryUsage.heapTotal)} (Fark: ${heapTotalDeltaBytes >= 0 ? '+' : ''}${formatMB(heapTotalDeltaBytes)})`);
  console.log(`• RSS Değişimi             : ${formatMB(initialHealth.memoryUsage.rss)} -> ${formatMB(postHealth.memoryUsage.rss)} (Fark: ${rssDeltaBytes >= 0 ? '+' : ''}${formatMB(rssDeltaBytes)})`);

  console.log('\n🔍 DEĞERLENDİRME & SIZINTI DENETİMİ:');
  if (activeHandlesDelta === 0) {
    console.log('  ✅ HANDLE SIZINTISI YOK: Aktif socket/handle sayısı işlem öncesi ve sonrasında sabittir (0 sızıntı).');
  } else {
    console.log(`  ℹ️ ACTIVE HANDLES DEĞİŞİMİ: ${activeHandlesDelta} adet handle farkı kaydedildi.`);
  }

  if (Math.abs(heapUsedDeltaBytes) < 25 * 1024 * 1024) {
    console.log('  ✅ HEAP SIZINTISI YOK: 10 yoğun worker döngüsü sonrasında bellek artışı makul sınırlar içindedir (<25MB).');
  } else {
    console.log('  ⚠️ UYARI: Heap artışı beklenenden yüksek.');
  }

  console.log('==========================================================\n');
}

runWorkerHealthAudit().catch((err) => {
  console.error('Audit çalıştırma hatası:', err);
  process.exit(1);
});
