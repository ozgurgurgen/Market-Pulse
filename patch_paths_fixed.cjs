const fs = require('fs');

// 1. App.tsx
let appText = fs.readFileSync('src/App.tsx', 'utf8');
appText = appText.replace(/doc\(db,\s*'users',\s*user\.uid,\s*'preferences',\s*user\.uid\)/g, "doc(db, 'users', user.uid, 'preferences', 'default')");
appText = appText.replace(/doc\(db,\s*'users',\s*user\.uid,\s*'watchlist',\s*user\.uid\)/g, "doc(db, 'users', user.uid, 'watchlist', 'default')");
appText = appText.replace(/doc\(db,\s*'user_preferences',\s*user\.uid\)/g, "doc(db, 'users', user.uid, 'preferences', 'default')");
appText = appText.replace(/doc\(db,\s*'user_watchlists',\s*user\.uid\)/g, "doc(db, 'users', user.uid, 'watchlist', 'default')");

fs.writeFileSync('src/App.tsx', appText);

// 2. AIChatAdvisor.tsx
let chatText = fs.readFileSync('src/components/AIChatAdvisor.tsx', 'utf8');
chatText = chatText.replace(/doc\(db,\s*'users',\s*user\.uid,\s*'chatHistories',\s*user\.uid\)/g, "doc(db, 'users', user.uid, 'chatHistories', 'default')");
chatText = chatText.replace(/doc\(db,\s*'user_chat_histories',\s*user\.uid\)/g, "doc(db, 'users', user.uid, 'chatHistories', 'default')");
fs.writeFileSync('src/components/AIChatAdvisor.tsx', chatText);

