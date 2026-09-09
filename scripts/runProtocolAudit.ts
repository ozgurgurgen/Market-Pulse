import { getLiveQuoteForSymbol, fetchLiveMarketQuotes, findAssetBySymbol } from '../server/yahooFinanceService';
import yahooFinance from 'yahoo-finance2';
import express from 'express';
import { stockDetailRouter } from '../server/routes/stockDetailRouter';
import http from 'http';

const TEST_SYMBOLS = [
  'CANTE', 'THYAO', 'ASELS', 'EREGL', 'GARAN', 
  'TUPRS', 'BIMAS', 'KCHOL', 'SAHOL', 'SISE', 
  'PETKM', 'ASTOR', 'SASA', 'HEKTS', 'GUBRF', 
  'ISCTR', 'AKBNK', 'YKBNK', 'VAKBN', 'HALKB',
  'KMPUR', 'KONTR'
];

interface TestResult {
  symbol: string;
  appPrice: number | null;
  appCurrency: string;
  appChangePercent: number | null;
  directYahooPrice: number | null;
  directYahooCurrency: string;
  directYahooChangePercent: number | null;
  priceMatch: boolean;
  currencyMatch: boolean;
  sanityCheckPassed: boolean;
  detailEndpointsPassed: boolean;
  failedEndpoints: string[];
}

async function runProtocolAudit() {
  console.log('====================================================');
  console.log('🔬 BIST VERİ DOĞRULUĞU & KARARLILIK PROTOKOL TESTİ');
  console.log('Zaman Damgası:', new Date().toISOString());
  console.log('====================================================\n');

  // Test Express Server for Router testing
  const app = express();
  app.use(express.json());
  app.use('/api/stock', stockDetailRouter);
  
  const server = app.listen(3344);
  const baseURL = 'http://127.0.0.1:3344/api/stock';

  const yf = new (yahooFinance as any)();
  const results: TestResult[] = [];

  for (const sym of TEST_SYMBOLS) {
    console.log(`[TEST BAŞLADI] ${sym}...`);
    
    // 1. App Veri Çekimi
    const appQuote = await getLiveQuoteForSymbol(sym);

    // 2. Doğrudan Bağımsız Yahoo Finance API Doğrulaması (.IS)
    let directQuote: any = null;
    try {
      directQuote = await yf.quote(`${sym}.IS`);
    } catch (e: any) {
      console.warn(`  ⚠️ Direct Yahoo fetch error for ${sym}.IS:`, e.message);
    }

    const appPrice = appQuote?.currentPrice ?? null;
    const directPrice = directQuote?.regularMarketPrice ?? null;
    const appCurr = appQuote?.currency ?? '';
    const directCurr = directQuote?.currency ?? '';
    const appChange = appQuote?.change24hPercent ?? null;
    const directChange = directQuote?.regularMarketChangePercent !== undefined 
      ? Number(directQuote.regularMarketChangePercent.toFixed(2)) 
      : null;

    // Fiyat Eşleşmesi ve Makullük Kontrolü (Sanity Check)
    const priceDiff = (appPrice !== null && directPrice !== null) 
      ? Math.abs(appPrice - directPrice) 
      : 999;
    const priceMatch = priceDiff < 0.05 || (appPrice !== null && directPrice !== null && Math.abs(priceDiff / directPrice) < 0.01);
    const currencyMatch = (appCurr === '₺' || appCurr === 'TRY') && (directCurr === 'TRY' || directCurr === '₺');
    const sanityCheckPassed = appPrice !== null && appPrice > 0 && appCurr === '₺';

    // 3. Detay Sayfası Endpoint Testleri (Crash & Null Kontrolü)
    const endpoints = ['thesis', 'technical', 'fairvalue', 'peers'];
    const failedEndpoints: string[] = [];

    for (const ep of endpoints) {
      try {
        const res = await fetch(`${baseURL}/${sym}/${ep}`);
        if (!res.ok) {
          failedEndpoints.push(`${ep} (HTTP ${res.status})`);
        } else {
          const body = await res.json();
          if (!body || body.success === false) {
            failedEndpoints.push(`${ep} (Invalid Body)`);
          }
        }
      } catch (err: any) {
        failedEndpoints.push(`${ep} (CRASH/FetchError: ${err.message})`);
      }
    }

    const result: TestResult = {
      symbol: sym,
      appPrice,
      appCurrency: appCurr,
      appChangePercent: appChange,
      directYahooPrice: directPrice,
      directYahooCurrency: directCurr,
      directYahooChangePercent: directChange,
      priceMatch,
      currencyMatch,
      sanityCheckPassed,
      detailEndpointsPassed: failedEndpoints.length === 0,
      failedEndpoints
    };

    results.push(result);
    console.log(`  -> App: ${appPrice} ${appCurr} (%${appChange}) | Direct Yahoo: ${directPrice} ${directCurr} (%${directChange}) | Detay Endpointleri: ${result.detailEndpointsPassed ? '✅ HATASIZ' : '❌ HATA'}`);
  }

  server.close();

  console.log('\n====================================================');
  console.log('📊 TEST SONUÇLARI ÖZETİ');
  console.log('====================================================');
  console.table(results.map(r => ({
    Sembol: r.symbol,
    'Uygulama Fiyatı': `${r.appPrice} ${r.appCurrency}`,
    'Doğrudan Yahoo': `${r.directYahooPrice} ${r.directYahooCurrency}`,
    'Fiyat Uyumlu': r.priceMatch ? '✅ EVET' : '❌ HAYIR',
    'Sanity Check': r.sanityCheckPassed ? '✅ GEÇTİ' : '❌ KALDI',
    'Detay Crash': r.detailEndpointsPassed ? '✅ 0 CRASH' : `❌ ${r.failedEndpoints.join(', ')}`
  })));

  const total = results.length;
  const priceMatches = results.filter(r => r.priceMatch).length;
  const zeroCrashes = results.filter(r => r.detailEndpointsPassed).length;
  const sanityPassed = results.filter(r => r.sanityCheckPassed).length;

  console.log(`\nToplam Test Edilen Sembol: ${total}`);
  console.log(`Fiyat & Birim Doğruluk Oranı: ${priceMatches}/${total} (%${Math.round((priceMatches/total)*100)})`);
  console.log(`Sanity Check Başarısı: ${sanityPassed}/${total} (%${Math.round((sanityPassed/total)*100)})`);
  console.log(`Crash-Free Detay Oranı: ${zeroCrashes}/${total} (%${Math.round((zeroCrashes/total)*100)})`);

  return results;
}

runProtocolAudit().catch(err => {
  console.error('Fatal Protocol Error:', err);
  process.exit(1);
});
