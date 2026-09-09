const fs = require('fs');
let text = fs.readFileSync('src/components/Header.tsx', 'utf8');

text = text.replace(
  "activeTab: 'opportunities' | 'latest_financials' | 'screener' | 'academy' | 'intelligence' | 'portfolio' | 'macro' | 'tefas' | 'backtest' | 'markets' | 'chat' | 'watchlist' | 'settings';",
  "activeTab: 'opportunities' | 'latest_financials' | 'screener' | 'academy' | 'intelligence' | 'portfolio' | 'macro' | 'tefas' | 'backtest' | 'markets' | 'chat' | 'watchlist' | 'settings' | 'admin';"
);

text = text.replace(
  "setActiveTab: (tab: 'opportunities' | 'latest_financials' | 'screener' | 'academy' | 'intelligence' | 'portfolio' | 'macro' | 'tefas' | 'backtest' | 'markets' | 'chat' | 'watchlist' | 'settings') => void;",
  "setActiveTab: (tab: 'opportunities' | 'latest_financials' | 'screener' | 'academy' | 'intelligence' | 'portfolio' | 'macro' | 'tefas' | 'backtest' | 'markets' | 'chat' | 'watchlist' | 'settings' | 'admin') => void;"
);

fs.writeFileSync('src/components/Header.tsx', text);
