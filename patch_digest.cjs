const fs = require('fs');
let code = fs.readFileSync('server/intelligence/scheduledDigest.ts', 'utf8');

code = code.replace(
  "import { adminDb } from '../services/firebaseAdminService.ts';",
  "import { serverDb } from '../services/firebaseClientService.ts';\nimport { collection, query, where, getDocs } from 'firebase/firestore';"
);

code = code.replace(
`    const usersSnap = await adminDb.collection('users')
      .where('telegramChatId', '!=', null)
      .get();`,
`    const q = query(collection(serverDb, 'users'), where('telegramChatId', '!=', null));
    const usersSnap = await getDocs(q);`
);

fs.writeFileSync('server/intelligence/scheduledDigest.ts', code);
console.log('patched scheduledDigest');
