const fs = require('fs');
let text = fs.readFileSync('src/pages/Portfolio/hooks/usePortfolio.ts', 'utf8');

text = text.replace(
  "}, []);",
  "}, [portfolios]);"
);

fs.writeFileSync('src/pages/Portfolio/hooks/usePortfolio.ts', text);
