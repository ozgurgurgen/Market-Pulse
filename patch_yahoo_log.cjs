const fs = require('fs');
let content = fs.readFileSync('server/yahooFinanceService.ts', 'utf8');

content = content.replace(
  'async function acquireToken(): Promise<void> {',
  'async function acquireToken(): Promise<void> {\n  console.log(`[Yahoo Limiter] Acquiring token. Active: ${activeRequests}, Queue: ${requestQueue.length}`);'
);
fs.writeFileSync('server/yahooFinanceService.ts', content);
