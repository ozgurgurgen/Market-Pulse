const fs = require('fs');

// 1. App.tsx (Watchlist and Preferences)
let appText = fs.readFileSync('src/App.tsx', 'utf8');
appText = appText.replace(/user_watchlists/g, 'users\', user.uid, \'watchlist');
appText = appText.replace(
  "doc(db, 'users', user.uid, 'watchlist', user.uid)", 
  "doc(db, 'users', user.uid, 'watchlist', 'default')"
);
appText = appText.replace(/user_preferences/g, 'users\', user.uid, \'preferences');
appText = appText.replace(
  "doc(db, 'users', user.uid, 'preferences', user.uid)", 
  "doc(db, 'users', user.uid, 'preferences', 'default')"
);
fs.writeFileSync('src/App.tsx', appText);

// 2. AIChatAdvisor.tsx (Chat Histories)
let chatText = fs.readFileSync('src/components/AIChatAdvisor.tsx', 'utf8');
chatText = chatText.replace(/user_chat_histories/g, 'users\', user.uid, \'chatHistories');
chatText = chatText.replace(
  "doc(db, 'users', user.uid, 'chatHistories', user.uid)",
  "doc(db, 'users', user.uid, 'chatHistories', 'default')"
);
fs.writeFileSync('src/components/AIChatAdvisor.tsx', chatText);

// 3. usePortfolio.ts (Portfolios)
let portText = fs.readFileSync('src/pages/Portfolio/hooks/usePortfolio.ts', 'utf8');
portText = portText.replace(/user_portfolios\/\$\{auth\.currentUser\.uid\}\/portfolios/g, 'users/${auth.currentUser.uid}/portfolios');
fs.writeFileSync('src/pages/Portfolio/hooks/usePortfolio.ts', portText);

