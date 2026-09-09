const fs = require('fs');
let text = fs.readFileSync('firestore.rules', 'utf8');

const originalRules = `    match /user_watchlists/{userId} {
      allow read, write: if request.auth != null && (request.auth.uid == userId || isAdmin());
    }`;

const newRules = `    match /user_watchlists/{userId} {
      allow read, write: if request.auth != null && (request.auth.uid == userId || isAdmin());
    }
    match /user_portfolios/{userId}/portfolios/{document=**} {
      allow read, write: if request.auth != null && (request.auth.uid == userId || isAdmin());
    }
    match /user_chat_histories/{userId} {
      allow read, write: if request.auth != null && (request.auth.uid == userId || isAdmin());
    }
    match /user_preferences/{userId} {
      allow read, write: if request.auth != null && (request.auth.uid == userId || isAdmin());
    }`;

text = text.replace(originalRules, newRules);
fs.writeFileSync('firestore.rules', text);
