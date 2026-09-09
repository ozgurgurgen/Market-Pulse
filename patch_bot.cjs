const fs = require('fs');
let code = fs.readFileSync('server/intelligence/telegramBot.ts', 'utf8');

code = code.replace(
  "import { adminDb } from '../services/firebaseAdminService';",
  "import { serverDb } from '../services/firebaseClientService.ts';\nimport { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';"
);

// update linkTelegramAccount
code = code.replace(
`    const tokenDoc = await adminDb.collection('telegramTokens').doc(token).get();
    if (!tokenDoc.exists) return null;
    
    const data = tokenDoc.data();
    if (!data || data.expiresAt < Date.now()) return null;
    
    const uid = data.uid;
    await adminDb.collection('users').doc(uid).set({
      telegramChatId: chatId.toString()
    }, { merge: true });
    
    // Tokeni sil
    await adminDb.collection('telegramTokens').doc(token).delete();`,
`    const tokenRef = doc(serverDb, 'telegramTokens', token);
    const tokenDoc = await getDoc(tokenRef);
    if (!tokenDoc.exists()) return null;
    
    const data = tokenDoc.data();
    if (!data || data.expiresAt < Date.now()) return null;
    
    const uid = data.uid;
    await setDoc(doc(serverDb, 'users', uid), {
      telegramChatId: chatId.toString()
    }, { merge: true });
    
    await deleteDoc(tokenRef);`
);

// update getUidFromChatId
code = code.replace(
`    const snap = await adminDb.collection('users').where('telegramChatId', '==', chatId.toString()).limit(1).get();
    if (snap.empty) return null;
    return snap.docs[0].id;`,
`    const q = query(collection(serverDb, 'users'), where('telegramChatId', '==', chatId.toString()), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].id;`
);

// update takip
code = code.replace(
`      const userDoc = await adminDb.collection('users').doc(uid).get();
      const userData = userDoc.data();`,
`      const userDoc = await getDoc(doc(serverDb, 'users', uid));
      const userData = userDoc.data();`
);

// update durdur
code = code.replace(
`    await adminDb.collection('users').doc(uid).set({ telegramNotificationsEnabled: false }, { merge: true });`,
`    await setDoc(doc(serverDb, 'users', uid), { telegramNotificationsEnabled: false }, { merge: true });`
);

// update basla
code = code.replace(
`    await adminDb.collection('users').doc(uid).set({ telegramNotificationsEnabled: true }, { merge: true });`,
`    await setDoc(doc(serverDb, 'users', uid), { telegramNotificationsEnabled: true }, { merge: true });`
);

fs.writeFileSync('server/intelligence/telegramBot.ts', code);
console.log('patched telegramBot');
