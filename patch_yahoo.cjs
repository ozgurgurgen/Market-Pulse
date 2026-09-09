const fs = require('fs');
let content = fs.readFileSync('server/yahooFinanceService.ts', 'utf8');

// Insert concurrency limiter and cache at the top right after imports
const limiterCode = `
// --- MODULE 3: Global Concurrency Limiter & De-duplication Cache ---
const CONCURRENT_LIMIT = 5;
let activeRequests = 0;
const requestQueue: (() => void)[] = [];

async function acquireToken(): Promise<void> {
  if (activeRequests < CONCURRENT_LIMIT) {
    activeRequests++;
    return;
  }
  return new Promise(resolve => {
    requestQueue.push(resolve);
  });
}

function releaseToken() {
  if (requestQueue.length > 0) {
    const next = requestQueue.shift();
    if (next) {
      next();
    } else {
      activeRequests--;
    }
  } else {
    activeRequests--;
  }
}

// 60-second memoization cache to prevent overlapping redundant requests
const fetchPromises = new Map<string, { promise: Promise<any>, timestamp: number }>();
const CACHE_TTL_MS = 60_000;

async function fetchFromYahooWithCacheAndLimit(ticker: string, skipQueue = false): Promise<any> {
  const now = Date.now();
  const existing = fetchPromises.get(ticker);
  
  if (existing && (now - existing.timestamp < CACHE_TTL_MS)) {
     return existing.promise;
  }
  
  const promise = (async () => {
     if (!skipQueue) {
       await acquireToken();
     }
     try {
       return await withBackoff(() => yf.quote(ticker));
     } finally {
       if (!skipQueue) {
         releaseToken();
       }
     }
  })();
  
  fetchPromises.set(ticker, { promise, timestamp: now });
  return promise;
}
// -------------------------------------------------------------------
`;

if (!content.includes('fetchFromYahooWithCacheAndLimit')) {
  content = content.replace('const yf = new YFClass({ suppressNotices: [\'yahooSurvey\'] });', 
    'const yf = new YFClass({ suppressNotices: [\'yahooSurvey\'] });\n' + limiterCode);
}

// Replace in processBatchUpdate
content = content.replace(
  'const quote = await withBackoff(() => yf.quote(asset.yahooTicker)) as any;',
  'const quote = await fetchFromYahooWithCacheAndLimit(asset.yahooTicker, true) as any; // skip global queue here since runWithLimit is already wrapping it'
);

// Replace in _getLiveQuoteForSymbol
content = content.replace(
  'const quote = await yf.quote(upper).catch(() => null) as any;',
  'const quote = await fetchFromYahooWithCacheAndLimit(upper).catch(() => null) as any;'
);

fs.writeFileSync('server/yahooFinanceService.ts', content);
