const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Add import at the top
code = code.replace(
  "import express from 'express';",
  "import express from 'express';\nimport yfAny from 'yahoo-finance2';\nconst YFClass = (yfAny as any).default || yfAny;\nconst yfClient = new YFClass({ suppressNotices: ['yahooSurvey'] });"
);

// Replace local usages
code = code.replace(
  /const YahooFinance = require\("yahoo-finance2"\)\.default;\s*const yf = new YahooFinance\(\{ suppressNotices: \["yahooSurvey"\] \}\);\s*const result = await yf\.search\(query\);/g,
  'const result = await yfClient.search(query);'
);

code = code.replace(
  /const YahooFinance = require\("yahoo-finance2"\)\.default;\s*const yf = new YahooFinance\(\{ suppressNotices: \["yahooSurvey"\] \}\);\s*const yfNews = await yf\.search\(search, \{ newsCount: 5 \}\);/g,
  'const yfNews = await yfClient.search(search, { newsCount: 5 });'
);

fs.writeFileSync('server.ts', code);
