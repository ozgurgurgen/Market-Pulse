const fs = require('fs');
let code = fs.readFileSync('server/yahooFinanceService.ts', 'utf8');

// Replace old fix attempt with the working ESM/CJS trick
code = code.replace(
  /const YahooFinance = require\("yahoo-finance2"\)\.default;\s*const yf = new YahooFinance\(\{ suppressNotices: \["yahooSurvey"\] \}\);/g,
  "import yfAny from 'yahoo-finance2';\nconst YFClass = (yfAny as any).default || yfAny;\nconst yf = new YFClass({ suppressNotices: ['yahooSurvey'] });"
);

fs.writeFileSync('server/yahooFinanceService.ts', code);
