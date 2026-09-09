const fs = require('fs');
let text = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

text = text.replace(
  "id: 'opportunities' | 'latest_financials' | 'screener' | 'academy' | 'intelligence' | 'portfolio' | 'macro' | 'tefas' | 'backtest' | 'markets' | 'chat' | 'watchlist' | 'settings';",
  "id: 'opportunities' | 'latest_financials' | 'screener' | 'academy' | 'intelligence' | 'portfolio' | 'macro' | 'tefas' | 'backtest' | 'markets' | 'chat' | 'watchlist' | 'settings' | 'admin';"
);

text = text.replace(
  "description?: string;\n}",
  "description?: string;\n  permission?: string;\n}"
);

fs.writeFileSync('src/components/Sidebar.tsx', text);
