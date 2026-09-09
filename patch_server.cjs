const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  "import { adminDb } from './server/services/firebaseAdminService.js';",
  "import { serverDb } from './server/services/firebaseClientService.ts';\nimport { doc, setDoc } from 'firebase/firestore';"
);

code = code.replace(
`    await adminDb.collection('telegramTokens').doc(token).set({
      uid,
      expiresAt,
      createdAt: Date.now()
    });`,
`    await setDoc(doc(serverDb, 'telegramTokens', token), {
      uid,
      expiresAt,
      createdAt: Date.now()
    });`
);

code = code.replace(
`    await adminDb.collection('users').doc(uid).set({
      telegramChatId: null,
      telegramNotificationsEnabled: false
    }, { merge: true });`,
`    await setDoc(doc(serverDb, 'users', uid), {
      telegramChatId: null,
      telegramNotificationsEnabled: false
    }, { merge: true });`
);

fs.writeFileSync('server.ts', code);
console.log('patched server');
