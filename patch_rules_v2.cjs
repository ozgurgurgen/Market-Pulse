const fs = require('fs');
let text = fs.readFileSync('firestore.rules', 'utf8');

const newRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
  
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // 1. KULLANICI VE ALT KOLEKSIYONLARI (Subcollections)
    match /users/{userId} {
      allow read, write: if request.auth != null && (request.auth.uid == userId || isAdmin());
      
      // Kullanıcının altındaki tüm verilere (portfolios, watchlist, preferences, chatHistories vb.) tek kural
      match /{document=**} {
        allow read, write: if request.auth != null && (request.auth.uid == userId || isAdmin());
      }
    }

    // 2. SISTEM VE GLOBAL AYARLAR
    match /platform_settings/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /roles/{document=**} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
    match /audit_logs/{document=**} {
      allow read: if isAdmin();
      allow write: if false; // Only backend admin SDK can write audit logs
    }
    
    // 3. FINANSAL REFERANS VE PIYASA VERILERI (Sadece okuma, admin yazabilir)
    match /symbols/{document=**} { allow read: if true; allow write: if isAdmin(); }
    match /market_data_snapshots/{document=**} { allow read: if true; allow write: if isAdmin(); }
    match /companies/{document=**} { allow read: if true; allow write: if isAdmin(); }
    match /signals/{document=**} { allow read: if true; allow write: if isAdmin(); }
    match /funds/{document=**} { allow read: if true; allow write: if isAdmin(); }
    match /macro_indicators/{document=**} { allow read: if true; allow write: if isAdmin(); }

    // Default fallback
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
`;

fs.writeFileSync('firestore.rules', newRules);
