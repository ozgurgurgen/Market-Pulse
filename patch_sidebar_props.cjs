const fs = require('fs');
let text = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

text = text.replace(
  "activeTab: 'opportunities' | 'latest_financials' | 'screener' | 'academy' | 'intelligence' | 'portfolio' | 'macro' | 'tefas' | 'backtest' | 'markets' | 'chat' | 'watchlist' | 'settings';",
  "activeTab: TabItem['id'];"
);

text = text.replace(
  "setActiveTab: (tab: 'opportunities' | 'latest_financials' | 'screener' | 'academy' | 'intelligence' | 'portfolio' | 'macro' | 'tefas' | 'backtest' | 'markets' | 'chat' | 'watchlist' | 'settings') => void;",
  "setActiveTab: (tab: TabItem['id']) => void;"
);

fs.writeFileSync('src/components/Sidebar.tsx', text);
