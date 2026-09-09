# API ve Veri Kaynağı Bulunan Dosyalar (Düzeltilmiş ve Genişletilmiş)

| Dosya Yolu | Satır No | Kod Satırı | Bağlandığı Kaynak | Doğrulama Durumu |
|---|---|---|---|---|
| `./bootstrap_roles.cjs` | 9 | `await adminDb.collection('roles').doc('admin').set({` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./bootstrap_roles.cjs` | 14 | `await adminDb.collection('roles').doc('standard_user').set({` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./bootstrap_roles.cjs` | 19 | `await adminDb.collection('roles').doc('premium_user').set({` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./bootstrap_roles.ts` | 5 | `const db = getFirestore(app, 'ai-studio-marketpulseaitef-9befce23-8089-4716-9c4d-feabc89be875');` | Firestore Başlatma | Makro veri tespitiyle onarıldı |
| `./bootstrap_roles.ts` | 8 | `await db.collection('roles').doc('admin').set({` | Firestore İstemci DB İşlemi | Makro veri tespitiyle onarıldı |
| `./bootstrap_roles.ts` | 13 | `await db.collection('roles').doc('standard_user').set({` | Firestore İstemci DB İşlemi | Makro veri tespitiyle onarıldı |
| `./bootstrap_roles.ts` | 18 | `await db.collection('roles').doc('premium_user').set({` | Firestore İstemci DB İşlemi | Makro veri tespitiyle onarıldı |
| `./consolidate.py` | 19 | `# WRAPPER: safeFetchJson with optional <T>` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./consolidate.py` | 20 | `(re.compile(r'\bsafeFetchJson(?:<[^>]+>)?\s*\('), "Özel API fetch wrapper çağrısı (safeFetchJson)"),` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./consolidate.py` | 62 | `if 'safeFetchJson' in pattern.pattern:` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./consolidate.py` | 110 | `print(f"Total safeFetchJson files: {len(wrapper_usages)}")` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./consolidate.py` | 116 | `f.write("## `safeFetchJson` (Özel Fetch Yöneticisi)\n")` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./fix_macro.py` | 21 | `(re.compile(r'\badminDb\.(collection&#124;doc)\s*\('), "Firestore Admin DB İşlemi"),` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | Makro veri tespitiyle onarıldı |
| `./fix_macro.py` | 28 | `(re.compile(r'["\'](.*adminDb.*&#124;.*fetch[A-Z(].*&#124;.*db\..*)'), "Yama dosyası (API bağlantısı içeren kod satır...` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | Makro veri tespitiyle onarıldı |
| `./fix_macro.py` | 52 | `'desc': "Özel API fetch wrapper çağrısı (safeFetchJson)"` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./fix_macro.py` | 101 | `elif 'const indicators: economicindicator[]' in l_lower:` | Sahte/Simüle Makro Veri Kaynağı (Hardcoded) | Makro veri tespitiyle onarıldı |
| `./fix_macro.py` | 136 | `elif 'serverLocalDatabase.get(' in line_str or 'serverLocalDatabase.getAll(' in line_str:` | Simüle Edilmiş Yerel DB/Önbellek Erişimi | Makro veri tespitiyle onarıldı |
| `./fix_search.sh` | 2 | `sed -i -e '/const quotesMap = await fetchLiveMarketQuotes({ symbols });/c \` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | Makro veri tespitiyle onarıldı |
| `./get-errors.ts` | 3 | `const snap = await adminDb.collection('errorLogs').orderBy('timestamp', 'desc').limit(5).get();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./get_atr.ts` | 9 | `const res = await fetch(url);` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./package.json` | 42 | `"yahoo-finance2": "^4.0.2"` | Yahoo Finance API Paketi | Makro veri tespitiyle onarıldı |
| `./patch-server.cjs` | 12 | `/const YahooFinance = require\("yahoo-finance2"\)\.default;\s*const yf = new YahooFinance\(\{ suppressNotices: \["yah...` | Yahoo Finance API Paketi | Makro veri tespitiyle onarıldı |
| `./patch-server.cjs` | 13 | `'const result = await yfClient.search(query);'` | Yahoo Finance Client Çağrısı | Makro veri tespitiyle onarıldı |
| `./patch-server.cjs` | 17 | `/const YahooFinance = require\("yahoo-finance2"\)\.default;\s*const yf = new YahooFinance\(\{ suppressNotices: \["yah...` | Yahoo Finance API Paketi | Makro veri tespitiyle onarıldı |
| `./patch-server.cjs` | 18 | `'const yfNews = await yfClient.search(search, { newsCount: 5 });'` | Yahoo Finance Client Çağrısı | Makro veri tespitiyle onarıldı |
| `./patch-service.cjs` | 6 | `/const YahooFinance = require\("yahoo-finance2"\)\.default;\s*const yf = new YahooFinance\(\{ suppressNotices: \["yah...` | Yahoo Finance API Paketi | Makro veri tespitiyle onarıldı |
| `./patch2.cjs` | 6 | `fetch('/api/health?error=' + encodeURIComponent(e.message));` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./patch2.cjs` | 9 | `fetch('/api/health?error=' + encodeURIComponent(e.reason ? e.reason.stack &#124;&#124; e.reason : 'unknown'));` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./patch_admin_audit.cjs` | 21 | `const logsSnap = await getDocs(q);` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_admin_auth.cjs` | 23 | `const snapPromise = getDoc(userRef);` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_admin_auth.cjs` | 44 | `const res = await fetch(url, {` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./patch_admin_auth.cjs` | 76 | `const snapPromise = getDoc(roleRef);` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_admin_service.cjs` | 18 | `const snap = await adminDb.collection('users').doc(uid).get();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./patch_admin_service.cjs` | 42 | `const snap = await adminDb.collection('roles').doc(roleName).get();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./patch_app.cjs` | 9 | `const { data, ok } = await safeFetchJson<{ opportunities: OpportunitySignal[] }>(\`/api/ai/opportunities?category=\${...` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./patch_app.cjs` | 20 | `text = text.replace(/  const fetchOpportunities = useCallback\(async \(cat: MarketCategory = selectedCategory\) => \{...` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./patch_app2.cjs` | 4 | `"fetchOpportunities('ALL');\n    fetchNews();\n\n    const interval = setInterval(() => {",` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | Makro veri tespitiyle onarıldı |
| `./patch_app2.cjs` | 5 | `"fetchNews();\n\n    const interval = setInterval(() => {"` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | Makro veri tespitiyle onarıldı |
| `./patch_app2.cjs` | 8 | `"  }, [fetchQuotes, fetchNews]);",` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | Makro veri tespitiyle onarıldı |
| `./patch_app2.cjs` | 9 | `"  }, [fetchQuotes, fetchNews]);\n\n  useEffect(() => {\n    fetchOpportunities(selectedCategory);\n  }, [fetchOpport...` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | Makro veri tespitiyle onarıldı |
| `./patch_app_modelconfig.cjs` | 18 | `getDoc(doc(db, 'user_preferences', user.uid)).then(snap => {` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_app_modelconfig.cjs` | 36 | `setDoc(doc(db, 'user_preferences', user.uid), { modelConfig: newConfig }, { merge: true });` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_app_radar.sh` | 2 | `sed -i -e 's/const res = await fetch(\`\/api\/ai\/opportunities?category=${cat}\`);/const scopeParam = modelConfig.ra...` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./patch_app_watchlist_sync.cjs` | 23 | `setDoc(doc(db, 'user_watchlists', user.uid), { items: watchlist }, { merge: true });` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_app_watchlist_sync.cjs` | 32 | `getDoc(doc(db, 'user_watchlists', user.uid)).then(snap => {` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_auth_audit.cjs` | 5 | `"import { adminAuth, adminDb } from '../services/firebaseAdminService';",` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | Makro veri tespitiyle onarıldı |
| `./patch_auth_audit.cjs` | 6 | `"import { adminAuth, adminDb } from '../services/firebaseAdminService';\nimport { logAudit } from '../services/auditS...` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | Makro veri tespitiyle onarıldı |
| `./patch_auth_google.cjs` | 23 | `await setDoc(doc(db, 'users', user.uid), {` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_auth_middleware.cjs` | 5 | `"import { adminAuth, adminDb } from '../services/firebaseAdminService';",` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | Makro veri tespitiyle onarıldı |
| `./patch_auth_middleware.cjs` | 11 | `const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./patch_auth_middleware.cjs` | 24 | `const res = await fetch(url, { headers: { Authorization: \`Bearer \${idToken}\` } });` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./patch_auth_middleware.cjs` | 47 | `const roleDoc = await adminDb.collection('roles').doc(req.userRole).get();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./patch_auth_middleware.cjs` | 65 | `const res = await fetch(url, { headers: { Authorization: \`Bearer \${req.idToken}\` } });` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./patch_auth_permissions.cjs` | 10 | `"const userSnap = await getDoc(userRef);\n        if (userSnap.exists()) {",` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_auth_permissions.cjs` | 11 | ``const userSnap = await getDoc(userRef);` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_auth_permissions.cjs` | 15 | `const roleSnap = await getDoc(doc(db, 'roles', ud.role));` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_auth_portfolio.cjs` | 14 | `"const fetchPortfolios = useCallback(async () => {",` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | Makro veri tespitiyle onarıldı |
| `./patch_auth_portfolio.cjs` | 15 | `"const fetchPortfolios = useCallback(async () => {\n    if (!user) return;"` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | Makro veri tespitiyle onarıldı |
| `./patch_bot.cjs` | 5 | `"import { adminDb } from '../services/firebaseAdminService';",` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | Makro veri tespitiyle onarıldı |
| `./patch_bot.cjs` | 11 | ``    const tokenDoc = await adminDb.collection('telegramTokens').doc(token).get();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./patch_bot.cjs` | 18 | `await adminDb.collection('users').doc(uid).set({` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./patch_bot.cjs` | 23 | `await adminDb.collection('telegramTokens').doc(token).delete();`,` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./patch_bot.cjs` | 25 | `const tokenDoc = await getDoc(tokenRef);` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_bot.cjs` | 32 | `await setDoc(doc(serverDb, 'users', uid), {` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_bot.cjs` | 36 | `await deleteDoc(tokenRef);`` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_bot.cjs` | 41 | ``    const snap = await adminDb.collection('users').where('telegramChatId', '==', chatId.toString()).limit(1).get();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./patch_bot.cjs` | 45 | `const snap = await getDocs(q);` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_bot.cjs` | 52 | ``      const userDoc = await adminDb.collection('users').doc(uid).get();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./patch_bot.cjs` | 54 | ``      const userDoc = await getDoc(doc(serverDb, 'users', uid));` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_bot.cjs` | 60 | ``    await adminDb.collection('users').doc(uid).set({ telegramNotificationsEnabled: false }, { merge: true });`,` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./patch_bot.cjs` | 61 | ``    await setDoc(doc(serverDb, 'users', uid), { telegramNotificationsEnabled: false }, { merge: true });`` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_bot.cjs` | 66 | ``    await adminDb.collection('users').doc(uid).set({ telegramNotificationsEnabled: true }, { merge: true });`,` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./patch_bot.cjs` | 67 | ``    await setDoc(doc(serverDb, 'users', uid), { telegramNotificationsEnabled: true }, { merge: true });`` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_chat2.cjs` | 36 | `getDoc(doc(db, 'users', user.uid, 'chatHistories', 'default')).then(snap => {` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_chat2.cjs` | 66 | `setDoc(doc(db, 'users', user.uid, 'chatHistories', 'default'), { messages }, { merge: true }).catch(e => {` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_chat_persistence.cjs` | 7 | `"import { safeFetchJson } from '../utils/apiClient';",` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./patch_chat_persistence.cjs` | 8 | `"import { safeFetchJson } from '../utils/apiClient';\nimport { useAuth } from '../contexts/AuthContext';\nimport { do...` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./patch_chat_persistence.cjs` | 41 | `getDoc(doc(db, 'user_chat_histories', user.uid)).then(snap => {` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_chat_persistence.cjs` | 72 | `setDoc(doc(db, 'user_chat_histories', user.uid), { messages }, { merge: true }).catch(e => {` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_digest.cjs` | 5 | `"import { adminDb } from '../services/firebaseAdminService.ts';",` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | Makro veri tespitiyle onarıldı |
| `./patch_digest.cjs` | 10 | ``    const usersSnap = await adminDb.collection('users')` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./patch_digest.cjs` | 14 | `const usersSnap = await getDocs(q);`` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_header_search.sh` | 13 | `fetch(`/api/market/search?q=${searchQuery.trim()}`)\` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./patch_modal_news.sh` | 6 | `fetch(`/api/market/news?search=${analysis.symbol}`)\` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./patch_news.sh` | 6 | `const yahooFinance = require("yahoo-finance2").default;\` | Yahoo Finance API Paketi | Makro veri tespitiyle onarıldı |
| `./patch_orchestrator.cjs` | 9 | `const adminDb = require('../services/firebaseAdminService.js').adminDb;` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | Makro veri tespitiyle onarıldı |
| `./patch_orchestrator.cjs` | 10 | `const usersSnap = await adminDb.collection('users')` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./patch_orchestrator2.cjs` | 15 | `const usersSnap = await getDocs(q);` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_routers.cjs` | 7 | `content = content.replace(/import \{ serverDb \} from '\.\.\/services\/firebaseClientService';/, "import { adminDb } ...` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | Makro veri tespitiyle onarıldı |
| `./patch_routers.cjs` | 11 | `"await adminDb.collection('upgrade_requests').add(requestRecord);");` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./patch_routers.cjs` | 15 | `"await adminDb.collection('users').get();");` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./patch_routers.cjs` | 27 | `content = content.replace(/import \{ serverDb \} from '\.\.\/services\/firebaseClientService';/, "import { adminDb } ...` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | Makro veri tespitiyle onarıldı |
| `./patch_routers.cjs` | 31 | `"await adminDb.collection('users').get();");` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./patch_routers.cjs` | 35 | `"await adminDb.collection('users').doc(targetUid).set({ role: newRole, updatedAt: new Date().toISOString() }, { merge...` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./patch_routers.cjs` | 39 | `"await adminDb.collection('users').doc(targetUid).set({ isBanned, banReason: reason &#124;&#124; '', updatedAt: new D...` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./patch_server.cjs` | 5 | `"import { adminDb } from './server/services/firebaseAdminService.js';",` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | Makro veri tespitiyle onarıldı |
| `./patch_server.cjs` | 10 | ``    await adminDb.collection('telegramTokens').doc(token).set({` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./patch_server.cjs` | 15 | ``    await setDoc(doc(serverDb, 'telegramTokens', token), {` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_server.cjs` | 23 | ``    await adminDb.collection('users').doc(uid).set({` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./patch_server.cjs` | 27 | ``    await setDoc(doc(serverDb, 'users', uid), {` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_server_search.sh` | 7 | `const yahooFinance = require("yahoo-finance2").default;\` | Yahoo Finance API Paketi | Makro veri tespitiyle onarıldı |
| `./patch_server_telegram.cjs` | 19 | `await adminDb.collection('telegramTokens').doc(token).set({` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./patch_server_telegram.cjs` | 37 | `await adminDb.collection('users').doc(uid).set({` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./patch_settings_tab.cjs` | 31 | `await fetch('/api/telegram/unlink', {` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./patch_settings_tab.cjs` | 51 | `const res = await fetch('/api/telegram/link-token', {` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./patch_sub_service.cjs` | 41 | `const snap = await adminDb.collection('users').doc(uid).get();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./patch_sub_service.cjs` | 110 | `await adminDb.collection('users').doc(uid).set({` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./patch_sub_service.cjs` | 135 | `content = content.replace(/import \{ serverDb \} from '\.\/firebaseClientService';/, 'import { adminDb } from "./fire...` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | Makro veri tespitiyle onarıldı |
| `./patch_sub_service.cjs` | 146 | `"adminDb.collection('users').doc(uid).set({ usage: newUsage }, { merge: true }).catch(err => console.error('Failed to...` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./patch_sub_service.cjs` | 150 | `"await adminDb.collection('users').doc(uid).set({ usage: cleanUsage }, { merge: true }).catch(err => { throw new Crit...` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./patch_telegram.cjs` | 16 | `const response = await fetch(\`https://api.telegram.org/bot\${botToken}/sendMessage\`, {` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./patch_useportfolio.cjs` | 5 | `"import { safeFetchJson } from '../../../utils/apiClient';",` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./patch_useportfolio.cjs` | 6 | `"import { safeFetchJson } from '../../../utils/apiClient';\nimport { collection, doc, getDocs, setDoc, deleteDoc } fr...` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./patch_useportfolio.cjs` | 13 | `const { data, ok } = await safeFetchJson<{ success: boolean; portfolios: PortfolioItem[] }>('/api/portfolio');` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./patch_useportfolio.cjs` | 29 | `const snapshot = await getDocs(collection(db, \`user_portfolios/\${auth.currentUser.uid}/portfolios\`));` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_useportfolio.cjs` | 43 | `const { data: pData } = await safeFetchJson<{ success: boolean; portfolio: PortfolioItem }>(\`/api/portfolio/\${id}\`);` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./patch_useportfolio.cjs` | 49 | `const { data: perfData } = await safeFetchJson<{` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./patch_useportfolio.cjs` | 64 | `const { data: riskData } = await safeFetchJson<{` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./patch_useportfolio.cjs` | 73 | `const { data: alertData } = await safeFetchJson<{` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./patch_useportfolio.cjs` | 91 | `const { data: perfData } = await safeFetchJson<{` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./patch_useportfolio.cjs` | 110 | `const { data: riskData } = await safeFetchJson<{` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./patch_useportfolio.cjs` | 128 | `const response = await fetch('/api/portfolio', {` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./patch_useportfolio.cjs` | 165 | `await setDoc(doc(db, \`user_portfolios/\${auth.currentUser.uid}/portfolios/\${newId}\`), newPortfolio);` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_useportfolio.cjs` | 177 | `const addHoldingOriginal = `      const response = await fetch(\`/api/portfolio/\${selectedPortfolio.id}\`, {` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./patch_useportfolio.cjs` | 188 | `await setDoc(doc(db, \`user_portfolios/\${auth.currentUser.uid}/portfolios/\${selectedPortfolio.id}\`), updatedPortfo...` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_useportfolio.cjs` | 194 | `const removeHoldingOriginal = `      const response = await fetch(\`/api/portfolio/\${selectedPortfolio.id}\`, {` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./patch_useportfolio.cjs` | 205 | `await setDoc(doc(db, \`user_portfolios/\${auth.currentUser.uid}/portfolios/\${selectedPortfolio.id}\`), updatedPortfo...` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_useportfolio.cjs` | 214 | `const response = await fetch(\`/api/portfolio/\${id}\`, { method: 'DELETE' });` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./patch_useportfolio.cjs` | 235 | `await deleteDoc(doc(db, \`user_portfolios/\${auth.currentUser.uid}/portfolios/\${id}\`));` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./patch_yahoo.cjs` | 51 | `return await withBackoff(() => yf.quote(ticker));` | Yahoo Finance API Çağrısı | Makro veri tespitiyle onarıldı |
| `./patch_yahoo.cjs` | 65 | `if (!content.includes('fetchFromYahooWithCacheAndLimit')) {` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | Makro veri tespitiyle onarıldı |
| `./patch_yahoo.cjs` | 72 | `'const quote = await withBackoff(() => yf.quote(asset.yahooTicker)) as any;',` | Yahoo Finance API Çağrısı | Makro veri tespitiyle onarıldı |
| `./patch_yahoo.cjs` | 73 | `'const quote = await fetchFromYahooWithCacheAndLimit(asset.yahooTicker, true) as any; // skip global queue here since...` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | Makro veri tespitiyle onarıldı |
| `./patch_yahoo.cjs` | 78 | `'const quote = await yf.quote(upper).catch(() => null) as any;',` | Yahoo Finance API Çağrısı | Makro veri tespitiyle onarıldı |
| `./patch_yahoo.cjs` | 79 | `'const quote = await fetchFromYahooWithCacheAndLimit(upper).catch(() => null) as any;'` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | Makro veri tespitiyle onarıldı |
| `./rewrite_academy.cjs` | 77 | `fetch('/api/academy/topics')` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./run_v6.1_backtest.ts` | 32 | `const res = await fetch(url);` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./run_v6.3_backtest.ts` | 31 | `const res = await fetch(url);` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./run_v6.4_backtest.ts` | 27 | `const res = await fetch(url);` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./run_v6.5_backtest.ts` | 28 | `const res = await fetch(url);` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./scripts/runProtocolAudit.ts` | 56 | `directQuote = await yf.quote(`${sym}.IS`);` | Yahoo Finance API Çağrısı | Makro veri tespitiyle onarıldı |
| `./scripts/runProtocolAudit.ts` | 84 | `const res = await fetch(`${baseURL}/${sym}/${ep}`);` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./seed-admin.ts` | 17 | `const db = getFirestore(app, "ai-studio-marketpulseaitef-9befce23-8089-4716-9c4d-feabc89be875");` | Firestore Başlatma | Makro veri tespitiyle onarıldı |
| `./seed-admin.ts` | 37 | `await setDoc(doc(db, 'users', user.uid), {` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./seed-admin.ts` | 46 | `await setDoc(doc(db, 'roles', 'admin'), { description: 'Tam yetkili yönetici', permissions: ['admin.*'] });` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./seed-admin.ts` | 47 | `await setDoc(doc(db, 'roles', 'standard_user'), { description: 'Standart kullanıcı', permissions: ['academy.access'] });` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./seed-admin.ts` | 48 | `await setDoc(doc(db, 'roles', 'premium_user'), { description: 'Premium abone', permissions: ['academy.access', 'scree...` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./server.ts` | 594 | `const pingRes = await fetch(`${url}/api/tags`);` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./server.ts` | 737 | `const result = await yfClient.search(query);` | Yahoo Finance Client Çağrısı | Makro veri tespitiyle onarıldı |
| `./server.ts` | 1567 | `const yfNews = await yfClient.search(search, { newsCount: 5 });` | Yahoo Finance Client Çağrısı | Makro veri tespitiyle onarıldı |
| `./server/aiService.ts` | 120 | `const response = await fetch(`${ollamaUrl}/api/generate`, {` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./server/aiService.ts` | 181 | `const response = await fetch(`${baseUrl}/chat/completions`, {` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./server/backtest/runFullMultiYearBacktest.ts` | 51 | `const res = await fetch(url);` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./server/indicator_fetchers/BaseFetcher.ts` | 6 | `fetchIndicators(): Promise<EconomicIndicator[]>;` | Makro Veri Çekirdek/Yönetici Modülü | Makro veri tespitiyle onarıldı |
| `./server/indicator_fetchers/EcbFetcher.ts` | 12 | `async fetchIndicators(): Promise<EconomicIndicator[]> {` | Makro Veri Çekirdek/Yönetici Modülü | Makro veri tespitiyle onarıldı |
| `./server/indicator_fetchers/EcbFetcher.ts` | 16 | `const indicators: EconomicIndicator[] = [` | Sahte/Simüle Makro Veri Kaynağı (Hardcoded) | Makro veri tespitiyle onarıldı |
| `./server/indicator_fetchers/FrankfurterFetcher.ts` | 12 | `async fetchIndicators(): Promise<EconomicIndicator[]> {` | Makro Veri Çekirdek/Yönetici Modülü | Makro veri tespitiyle onarıldı |
| `./server/indicator_fetchers/FrankfurterFetcher.ts` | 22 | `const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=TRY,EUR', {` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./server/indicator_fetchers/FrankfurterFetcher.ts` | 41 | `const indicators: EconomicIndicator[] = [` | Sahte/Simüle Makro Veri Kaynağı (Hardcoded) | Makro veri tespitiyle onarıldı |
| `./server/indicator_fetchers/FredFetcher.ts` | 12 | `async fetchIndicators(): Promise<EconomicIndicator[]> {` | Makro Veri Çekirdek/Yönetici Modülü | Makro veri tespitiyle onarıldı |
| `./server/indicator_fetchers/FredFetcher.ts` | 16 | `const indicators: EconomicIndicator[] = [` | Sahte/Simüle Makro Veri Kaynağı (Hardcoded) | Makro veri tespitiyle onarıldı |
| `./server/indicator_fetchers/MacroDataAggregatorService.ts` | 11 | `export class MacroDataAggregatorService {` | Makro Veri Çekirdek/Yönetici Modülü | Makro veri tespitiyle onarıldı |
| `./server/indicator_fetchers/MacroDataAggregatorService.ts` | 64 | `const indicators = await fetcher.fetchIndicators();` | Makro Veri Çekirdek/Yönetici Modülü | Makro veri tespitiyle onarıldı |
| `./server/indicator_fetchers/TcmbEvdsFetcher.ts` | 12 | `async fetchIndicators(): Promise<EconomicIndicator[]> {` | Makro Veri Çekirdek/Yönetici Modülü | Makro veri tespitiyle onarıldı |
| `./server/indicator_fetchers/TcmbEvdsFetcher.ts` | 21 | `const indicators: EconomicIndicator[] = [` | Sahte/Simüle Makro Veri Kaynağı (Hardcoded) | Makro veri tespitiyle onarıldı |
| `./server/indicator_fetchers/TuikMacroFetcher.ts` | 12 | `async fetchIndicators(): Promise<EconomicIndicator[]> {` | Makro Veri Çekirdek/Yönetici Modülü | Makro veri tespitiyle onarıldı |
| `./server/indicator_fetchers/TuikMacroFetcher.ts` | 16 | `const indicators: EconomicIndicator[] = [` | Sahte/Simüle Makro Veri Kaynağı (Hardcoded) | Makro veri tespitiyle onarıldı |
| `./server/indicator_fetchers/YahooFinanceMacroFetcher.ts` | 16 | `async fetchIndicators(): Promise<EconomicIndicator[]> {` | Makro Veri Çekirdek/Yönetici Modülü | Makro veri tespitiyle onarıldı |
| `./server/indicator_fetchers/YahooFinanceMacroFetcher.ts` | 32 | `const indicators: EconomicIndicator[] = [];` | Sahte/Simüle Makro Veri Kaynağı (Hardcoded) | Makro veri tespitiyle onarıldı |
| `./server/indicator_fetchers/YahooFinanceMacroFetcher.ts` | 41 | `const quote = await yfClient.quote(sym);` | Yahoo Finance Client Çağrısı | Makro veri tespitiyle onarıldı |
| `./server/indicator_fetchers/timeSeriesService.ts` | 212 | `if (year <= 2021) val = 17.5 + Math.sin(month) * 1.5;` | Sahte/Simüle Veri Üretimi (Matematiksel Zaman Serisi) | Makro veri tespitiyle onarıldı |
| `./server/indicator_fetchers/timeSeriesService.ts` | 301 | `else if (year === 2023) val = 103.5 + Math.sin(month) * 2.5;` | Sahte/Simüle Veri Üretimi (Matematiksel Zaman Serisi) | Makro veri tespitiyle onarıldı |
| `./server/indicator_fetchers/timeSeriesService.ts` | 303 | `else if (year === 2025) val = 104.5 + Math.sin(month * 0.8) * 1.5;` | Sahte/Simüle Veri Üretimi (Matematiksel Zaman Serisi) | Makro veri tespitiyle onarıldı |
| `./server/indicator_fetchers/timeSeriesService.ts` | 310 | `const wave = Math.sin(progress * 18) * 4.5 + Math.cos(progress * 7) * 2.0;` | Sahte/Simüle Veri Üretimi (Matematiksel Zaman Serisi) | Makro veri tespitiyle onarıldı |
| `./server/indicator_fetchers/timeSeriesService.ts` | 319 | `else if (year === 2024) val = 4.4 + Math.sin(month) * 0.3;` | Sahte/Simüle Veri Üretimi (Matematiksel Zaman Serisi) | Makro veri tespitiyle onarıldı |
| `./server/indicator_fetchers/timeSeriesService.ts` | 328 | `else if (year === 2022) val = 1820 + Math.sin(month) * 80;` | Sahte/Simüle Veri Üretimi (Matematiksel Zaman Serisi) | Makro veri tespitiyle onarıldı |
| `./server/indicator_fetchers/timeSeriesService.ts` | 340 | `else if (year === 2023) val = 82.0 + Math.sin(month) * 9.0;` | Sahte/Simüle Veri Üretimi (Matematiksel Zaman Serisi) | Makro veri tespitiyle onarıldı |
| `./server/indicator_fetchers/timeSeriesService.ts` | 342 | `else if (year === 2025) val = 77.0 + Math.sin(month) * 3.0;` | Sahte/Simüle Veri Üretimi (Matematiksel Zaman Serisi) | Makro veri tespitiyle onarıldı |
| `./server/indicator_fetchers/timeSeriesService.ts` | 360 | `val = 4.2 + Math.sin(progress * 12) * 1.2;` | Sahte/Simüle Veri Üretimi (Matematiksel Zaman Serisi) | Makro veri tespitiyle onarıldı |
| `./server/indicator_fetchers/timeSeriesService.ts` | 366 | `const noise = Math.sin(progress * 10) * (liveValue * 0.05);` | Sahte/Simüle Veri Üretimi (Matematiksel Zaman Serisi) | Makro veri tespitiyle onarıldı |
| `./server/intelligence/orchestratorAgent.ts` | 306 | `const fetchPromise = adminDb.collection('users').where('telegramChatId', '!=', null).get();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/intelligence/scheduledDigest.ts` | 15 | `const fetchPromise = adminDb.collection('users').where('telegramChatId', '!=', null).get();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/intelligence/telegramBot.ts` | 18 | `const tokenRef = adminDb.collection('telegramTokens').doc(token);` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/intelligence/telegramBot.ts` | 34 | `await adminDb.collection('users').doc(uid).set({` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/intelligence/telegramBot.ts` | 51 | `const snap = await adminDb.collection('users').where('telegramChatId', '==', chatId.toString()).limit(1).get();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/intelligence/telegramBot.ts` | 125 | `const userDoc = await adminDb.collection('users').doc(uid).get();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/intelligence/telegramBot.ts` | 139 | `await adminDb.collection('users').doc(uid).set({ telegramNotificationsEnabled: false }, { merge: true });` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/intelligence/telegramBot.ts` | 147 | `await adminDb.collection('users').doc(uid).set({ telegramNotificationsEnabled: true }, { merge: true });` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/intelligence/telegramService.ts` | 202 | `const res = await fetch(url, {` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./server/migrations/migrateIpoDeepAnalysis.ts` | 58 | `const snap = await adminDb.collection('ipoListings').get();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/migrations/migrateIpoDeepAnalysis.ts` | 74 | `await adminDb.collection('ipoListings').doc(docSnap.id).set(enriched, { merge: true }).catch((err) => {` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/routes/adminIntegrityRouter.ts` | 13 | `const snapshot = await adminDb.collection('data_integrity_audit')` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/routes/adminIntegrityRouter.ts` | 52 | `await adminDb.collection('data_integrity_audit').doc(req.params.id).set(updates, { merge: true });` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/routes/adminIntegrityRouter.ts` | 56 | `const existing = serverLocalDatabase.get('data_integrity_audit', req.params.id) &#124;&#124; {};` | Simüle Edilmiş Yerel DB/Önbellek Erişimi | Makro veri tespitiyle onarıldı |
| `./server/routes/adminRouter.ts` | 152 | `const snap = await adminDb.collection('users').get();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/routes/adminRouter.ts` | 197 | `await adminDb.collection('users').doc(u.uid).set(u, { merge: true });` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/routes/adminRouter.ts` | 295 | `const userDoc = await adminDb.collection('users').doc(targetUid).get();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/routes/adminRouter.ts` | 311 | `await adminDb.collection('users').doc(targetUid).set({ role: newRole, updatedAt: new Date().toISOString() }, { merge:...` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/routes/adminRouter.ts` | 352 | `await adminDb.collection('users').doc(targetUid).set({ isActive, updatedAt: new Date().toISOString() }, { merge: true...` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/routes/adminRouter.ts` | 469 | `await adminDb.collection('users').doc(uid).set(newUser, { merge: true });` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/routes/adminRouter.ts` | 506 | `const snap = await adminDb.collection('users').get();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/routes/subscriptionRouter.ts` | 92 | `await adminDb.collection('upgrade_requests').add(requestRecord);` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/routes/subscriptionRouter.ts` | 177 | `const snap = await adminDb.collection('users').get();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/routes/subscriptionRouter.ts` | 228 | `await adminDb.collection('users').doc(u.uid).set(u, { merge: true });` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/services/adminConfigService.ts` | 68 | `const planDocRef = adminDb.collection('adminConfig').doc('subscriptionPlans');` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/services/adminConfigService.ts` | 72 | `const defaultDb = getFirestore(getApp());` | Firestore Başlatma | Makro veri tespitiyle onarıldı |
| `./server/services/adminConfigService.ts` | 95 | `await adminDb.collection('adminConfig').doc('subscriptionPlans').set({` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/services/adminConfigService.ts` | 119 | `await adminDb.collection('adminConfig').doc('subscriptionPlans').set({` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/services/adminConfigService.ts` | 167 | `const snap = await adminDb.collection('adminConfig').doc('aiSettings').get().catch(async () => {` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/services/adminConfigService.ts` | 170 | `const defaultDb = getFirestore(getApp());` | Firestore Başlatma | Makro veri tespitiyle onarıldı |
| `./server/services/adminConfigService.ts` | 189 | `await adminDb.collection('adminConfig').doc('aiSettings').set(cachedAiSettings, { merge: true }).catch(() => {});` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/services/adminConfigService.ts` | 215 | `await adminDb.collection('adminConfig').doc('aiSettings').set(updated, { merge: true });` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/services/apiQuotaService.ts` | 116 | `endpointSample: 'https://query1.finance.yahoo.com/v8/finance/chart/THYAO.IS'` | Sahte/Simüle API Quota (Statik Veri) | Makro veri tespitiyle onarıldı |
| `./server/services/apiQuotaService.ts` | 170 | `endpointSample: 'https://www.tefas.gov.tr/api/DB/BindHistoryInfo'` | Sahte/Simüle API Quota (Statik Veri) | Makro veri tespitiyle onarıldı |
| `./server/services/apiQuotaService.ts` | 188 | `endpointSample: 'firestore.collection("user_watchlists").doc(uid)'` | Sahte/Simüle API Quota (Statik Veri) | Makro veri tespitiyle onarıldı |
| `./server/services/apiQuotaService.ts` | 224 | `endpointSample: 'https://evds2.tcmb.gov.tr/service/evds'` | Sahte/Simüle API Quota (Statik Veri) | Makro veri tespitiyle onarıldı |
| `./server/services/auditService.ts` | 67 | `await adminDb.collection('auditLogs').doc(logId).set(entry);` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/services/auditService.ts` | 180 | `await adminDb.collection('errorLogs').doc(logId).set(entry);` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/services/auditService.ts` | 190 | `const snap = await adminDb.collection('auditLogs').orderBy('timestamp', 'desc').limit(limitCount).get();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/services/auditService.ts` | 226 | `await adminDb.collection('auditLogs').doc(sampleLog.id!).set(sampleLog);` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/services/auditService.ts` | 239 | `const snap = await adminDb.collection('errorLogs').orderBy('timestamp', 'desc').limit(limitCount).get();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/services/auditService.ts` | 274 | `await adminDb.collection('errorLogs').doc(sampleErr.id!).set(sampleErr);` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/services/auditService.ts` | 288 | `const snap = await adminDb.collection('auditLogs').get();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/services/auditService.ts` | 304 | `const snap = await adminDb.collection('errorLogs').get();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/services/dataIntegrityService.ts` | 65 | `adminDb.collection('data_integrity_audit').add(entry).catch((err) => {` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/services/dbIntegrationService.ts` | 113 | `const docRef = adminDb.collection('adminConfig').doc('databaseIntegration');` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/services/dbIntegrationService.ts` | 182 | `await adminDb.collection('adminConfig').doc('databaseIntegration').set(updated, { merge: true });` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/services/dbIntegrationService.ts` | 346 | `const userSnap = await adminDb.collection('users').limit(20).get();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/services/firebaseAdminService.ts` | 14 | `let primaryAdminDb = getFirestore(app, DB_ID);` | Firestore Başlatma | Makro veri tespitiyle onarıldı |
| `./server/services/firebaseAdminService.ts` | 15 | `let defaultAdminDb = getFirestore(app);` | Firestore Başlatma | Makro veri tespitiyle onarıldı |
| `./server/services/firebaseAdminService.ts` | 55 | `const snap = await safeAdminGet(db => db.collection('users').doc(uid).get());` | Firestore İstemci DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/services/firebaseAdminService.ts` | 86 | `const snap = await safeAdminGet(db => db.collection('roles').doc(roleName).get());` | Firestore İstemci DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/services/ipoDataService.ts` | 759 | `const snapPromise = adminDb.collection('ipoListings').get();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/services/ipoDataService.ts` | 948 | `await adminDb.collection('ipoListings').doc(id).set(updated, { merge: true });` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/services/ipoDataService.ts` | 992 | `await adminDb.collection('ipoListings').doc(id).delete();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/services/ipoDataService.ts` | 1033 | `const response = await fetch('https://www.kap.org.tr/tr/api/disclosures', {` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./server/services/notificationService.ts` | 60 | `const response = await fetch(url, {` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./server/services/subscriptionService.ts` | 91 | `const snap = await adminDb.collection('users').doc(uid).get().catch(async () => {` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/services/subscriptionService.ts` | 95 | `const defaultDb = getFirestore(getApp());` | Firestore Başlatma | Makro veri tespitiyle onarıldı |
| `./server/services/subscriptionService.ts` | 184 | `await adminDb.collection('users').doc(uid).set({` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/services/subscriptionService.ts` | 237 | `adminDb.collection('users').doc(uid).set({ usage: newUsage }, { merge: true }).catch(err => {` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/services/subscriptionService.ts` | 260 | `adminDb.collection('users').doc(uid).set({ usage: newUsage }, { merge: true }).catch(err => {` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/services/subscriptionService.ts` | 283 | `await adminDb.collection('users').doc(uid).set({ usage: cleanUsage }, { merge: true }).catch(err => {` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./server/yahooFinanceService.ts` | 57 | `return await withBackoff(() => yf.quote(ticker));` | Yahoo Finance API Çağrısı | Makro veri tespitiyle onarıldı |
| `./server/yahooFinanceService.ts` | 237 | `const res = await fetch('https://api.binance.com/api/v3/ticker/24hr', {` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./server/yahooFinanceService.ts` | 280 | `const res = await fetch(url, {` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./src/App.tsx` | 138 | `getDoc(doc(db, 'users', user.uid, 'preferences', 'default')).then(snap => {` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/App.tsx` | 156 | `setDoc(doc(db, 'users', user.uid, 'preferences', 'default'), { modelConfig: newConfig }, { merge: true });` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/App.tsx` | 194 | `setDoc(doc(db, 'users', user.uid, 'watchlist', 'default'), { items: watchlist }, { merge: true });` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/App.tsx` | 203 | `getDoc(doc(db, 'users', user.uid, 'watchlist', 'default')).then(snap => {` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/App.tsx` | 215 | `const { data, ok } = await safeFetchJson<{ quotes: StockQuote[]; total: number }>('/api/market/quotes');` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/App.tsx` | 238 | `const { data, ok } = await safeFetchJson<{ opportunities: OpportunitySignal[] }>(`/api/ai/opportunities?category=${ca...` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/App.tsx` | 252 | `const { data, ok } = await safeFetchJson<{ news: MarketNewsItem[] }>('/api/market/news');` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/App.tsx` | 291 | `const { data, ok } = await safeFetchJson<{ analysis: StockAnalysisDetail }>('/api/ai/analyze-stock', {` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/App.tsx` | 314 | `const { data, ok } = await safeFetchJson<{ fund: TefasFundDetail }>(`/api/tefas/detail/${fund.code}`);` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/AIChatAdvisor.tsx` | 85 | `const { data, ok } = await safeFetchJson<{ reply: string; sources?: any[]; webResearchUsed?: boolean }>('/api/ai/chat...` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/AIModelSettingsModal.tsx` | 53 | `const { data, ok } = await safeFetchJson<{ status: any; message: string; availableModels?: string[] }>('/api/ai/test-...` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/AdminPanel.tsx` | 69 | `safeFetchJson<{ stats: any }>('/api/admin/system-stats').catch(() => ({ ok: false, data: null })),` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/AdminPanel.tsx` | 70 | `safeFetchJson<{ plans: any }>('/api/admin/subscription-plans').catch(() => ({ ok: false, data: null })),` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/AdminPanel.tsx` | 71 | `safeFetchJson<{ settings: any }>('/api/admin/ai-settings').catch(() => ({ ok: false, data: null })),` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/AdminPanel.tsx` | 72 | `safeFetchJson<{ users: any[] }>('/api/admin/users').catch(() => ({ ok: false, data: null })),` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/AdminPanel.tsx` | 73 | `safeFetchJson<{ logs: any[] }>('/api/admin/audit-logs').catch(() => ({ ok: false, data: null })),` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/AdminPanel.tsx` | 74 | `safeFetchJson<{ logs: any[] }>('/api/admin/error-logs').catch(() => ({ ok: false, data: null }))` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/AdminPanel.tsx` | 84 | `const usersSnap = await getDocs(collection(db, 'users'));` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/components/AdminPanel.tsx` | 134 | `const errorSnap = await getDocs(collection(db, 'errorLogs'));` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/components/AdminSettingsSection.tsx` | 18 | `const settingsSnap = await getDoc(doc(db, 'platform_settings', 'general'));` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/components/AdminSettingsSection.tsx` | 26 | `const rolesSnap = await getDocs(collection(db, 'roles'));` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/components/AdminSettingsSection.tsx` | 33 | `const logsSnap = await getDocs(q);` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/components/AdminSettingsSection.tsx` | 47 | `await setDoc(doc(db, 'platform_settings', 'general'), {` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/components/AdminSettingsSection.tsx` | 75 | `await updateDoc(doc(db, 'roles', roleId), { permissions: currentPerms });` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/components/AdvancedScreenerSection.tsx` | 63 | `safeFetchJson<{ success: boolean; data: ScreenerStockRow[]; availableSectors: string[] }>(`/api/screener/stocks?${par...` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/AuthScreen.tsx` | 66 | `await setDoc(` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/components/AuthScreen.tsx` | 117 | `await setDoc(` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/components/AuthScreen.tsx` | 194 | `await setDoc(doc(db, 'users', user.uid), {` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/components/BacktestSection.tsx` | 208 | `const { data, ok } = await safeFetchJson<{ result: BacktestResult }>('/api/backtest/run', {` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/EconomicIndicators/AssetImpactSection.tsx` | 33 | `safeFetchJson<{ success: boolean; impacts: IndicatorAssetImpact[] }>(`/api/macro/asset-impact/${encodeURIComponent(sy...` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/EconomicIndicators/EconomicIndicatorsPage.tsx` | 57 | `const { data: indData, ok: indOk } = await safeFetchJson<{ success: boolean; indicators: EconomicIndicator[] }>(` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/EconomicIndicators/EconomicIndicatorsPage.tsx` | 65 | `const { data: comData, ok: comOk } = await safeFetchJson<{ success: boolean; data: AIMacroCommentaryOutput; generated...` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/EconomicIndicators/EconomicIndicatorsPage.tsx` | 88 | `const { data, ok } = await safeFetchJson<{ success: boolean; data: AIMacroCommentaryOutput; generatedAt: string }>(` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/EconomicIndicators/MultiIndicatorChartCard.tsx` | 83 | `safeFetchJson<TimeSeriesResponse>(url)` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/FinancialAcademySection.tsx` | 93 | `fetch('/api/academy/topics')` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./src/components/IPOTracker.tsx` | 72 | `safeFetchJson<{ success: boolean; listings: IPOListing[] }>('/api/ipo/listings'),` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/IPOTracker.tsx` | 73 | `safeFetchJson<{ success: boolean; summaries: IPOSectorSummary[] }>('/api/ipo/sector-analysis')` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/IPOTracker.tsx` | 97 | `const res = await safeFetchJson<{ success: boolean; ipo: IPOListing; similar: IPOListing[] }>(`/api/ipo/listings/${ip...` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/IntelligenceHub/IntelligenceHub.tsx` | 60 | `const { data, error: fetchErr } = await safeFetchJson<IntelligenceReportData>(url);` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/IntelligenceHub/IntelligenceHub.tsx` | 82 | `const { data } = await safeFetchJson<{ configured: boolean; threshold: number; history: any[] }>(` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/IntelligenceHub/IntelligenceHub.tsx` | 97 | `const { data } = await safeFetchJson<{ success: boolean; mode: 'LIVE' &#124; 'SIMULATED'; message: string }>(` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/IntelligenceHub/SourceHealthBanner.tsx` | 36 | `safeFetchJson<HealthSummary>('/api/intelligence/health'),` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/IntelligenceHub/SourceHealthBanner.tsx` | 37 | `safeFetchJson<{ limits: any[] }>('/api/intelligence/rate-limits'),` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/LatestBalanceSheetsSection.tsx` | 38 | `safeFetchJson<{ success: boolean; data: LatestBalanceSheetItem[] }>('/api/financials/latest')` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/LatestBalanceSheetsSection.tsx` | 92 | `await safeFetchJson('/api/notifications/subscribe', {` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/OpportunityScanner.tsx` | 60 | `safeFetchJson<any>('/api/signals/v2/drift-status').then(({ data, ok }) => {` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/OpportunityScanner.tsx` | 70 | `safeFetchJson<{ data: LatestBalanceSheetItem[] }>('/api/financials/latest').then(({ data, ok }) => {` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/SettingsSection.tsx` | 133 | `const res = await fetch('/api/telegram/test-alert', {` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./src/components/SignalEngineV2Modal.tsx` | 52 | `const { data, ok } = await safeFetchJson<any>('/api/signals/v2/test-suite');` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/SignalEngineV2Modal.tsx` | 66 | `const { data, ok } = await safeFetchJson<any>('/api/signals/v2/walk-forward', {` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/SignalEngineV2Modal.tsx` | 83 | `const { data, ok } = await safeFetchJson<any>('/api/signals/v2/drift-status');` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/StockAnalysis/CompanyThesisTab.tsx` | 39 | `safeFetchJson<{ success: boolean; data: CompanyThesis }>(`/api/stock/${symbol}/thesis`)` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/StockAnalysis/CorporateEventsTab.tsx` | 34 | `safeFetchJson<{ success: boolean; data: CorporateEvent[] }>(`/api/stock/${symbol}/events`)` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/StockAnalysis/FinancialStatementsTab.tsx` | 36 | `safeFetchJson<{ success: boolean; data: FinancialStatementsData }>(`/api/stock/${symbol}/financials`)` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/StockAnalysis/FundPositionsTab.tsx` | 40 | `safeFetchJson<{ success: boolean; data: { summary: FundPositionSummary; funds: FundDynamicsRow[] } }>(`/api/stock/${s...` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/StockAnalysis/FundamentalValuationTab.tsx` | 32 | `safeFetchJson<{ success: boolean; data: FairValueEstimate }>(`/api/stock/${symbol}/fairvalue`)` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/StockAnalysis/InteractiveStockPriceChart.tsx` | 85 | `let p = baseP * (1 - (days * 0.0008) + (Math.sin(days) * 0.05));` | Sahte/Simüle Veri Üretimi (Matematiksel Zaman Serisi) | Makro veri tespitiyle onarıldı |
| `./src/components/StockAnalysis/InteractiveStockPriceChart.tsx` | 98 | `const changePct = (Math.sin(i * 0.25) * 0.015) + ((Math.random() - 0.48) * 0.02);` | Sahte/Simüle Veri Üretimi (Matematiksel Zaman Serisi) | Makro veri tespitiyle onarıldı |
| `./src/components/StockAnalysis/InteractiveStockPriceChart.tsx` | 102 | `p = p * (1 - progress * 0.05) + (baseP * 0.95 + (Math.sin(i) * baseP * 0.03)) * (progress * 0.05);` | Sahte/Simüle Veri Üretimi (Matematiksel Zaman Serisi) | Makro veri tespitiyle onarıldı |
| `./src/components/StockAnalysis/InteractiveStockPriceChart.tsx` | 134 | `const vol = Math.round(500000 + Math.abs(Math.sin(i * 1.5)) * 3000000);` | Sahte/Simüle Veri Üretimi (Matematiksel Zaman Serisi) | Makro veri tespitiyle onarıldı |
| `./src/components/StockAnalysis/InteractiveStockPriceChart.tsx` | 138 | `const rsiVal = i === 0 ? targetRSI : Math.max(0, Math.min(100, targetRSI + Math.sin(i * 0.3) * (i / days) * 25));` | Sahte/Simüle Veri Üretimi (Matematiksel Zaman Serisi) | Makro veri tespitiyle onarıldı |
| `./src/components/StockAnalysis/InteractiveStockPriceChart.tsx` | 143 | `const macdVal = i === 0 ? targetMacd : targetMacd + Math.sin(i * 0.2) * (i / days) * (baseP * 0.02);` | Sahte/Simüle Veri Üretimi (Matematiksel Zaman Serisi) | Makro veri tespitiyle onarıldı |
| `./src/components/StockAnalysis/InteractiveStockPriceChart.tsx` | 144 | `const macdSig = i === 0 ? targetSig : targetSig + Math.sin(i * 0.2 + 0.5) * (i / days) * (baseP * 0.02);` | Sahte/Simüle Veri Üretimi (Matematiksel Zaman Serisi) | Makro veri tespitiyle onarıldı |
| `./src/components/StockAnalysis/InteractiveStockPriceChart.tsx` | 150 | `const bbUpper = i === 0 ? targetBbUpper : targetBbUpper + Math.sin(i * 0.1) * (i / days) * (baseP * 0.02);` | Sahte/Simüle Veri Üretimi (Matematiksel Zaman Serisi) | Makro veri tespitiyle onarıldı |
| `./src/components/StockAnalysis/InteractiveStockPriceChart.tsx` | 151 | `const bbLower = i === 0 ? targetBbLower : targetBbLower - Math.sin(i * 0.1) * (i / days) * (baseP * 0.02);` | Sahte/Simüle Veri Üretimi (Matematiksel Zaman Serisi) | Makro veri tespitiyle onarıldı |
| `./src/components/StockAnalysis/MultiplesAnalysisTab.tsx` | 41 | `safeFetchJson<{ success: boolean; data: MultipleAnalysisData }>(`/api/stock/${symbol}/multiples`)` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/StockAnalysis/PeerComparisonTab.tsx` | 36 | `safeFetchJson<{ success: boolean; data: PeerComparisonData }>(`/api/stock/${symbol}/peers`)` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/StockAnalysis/ScorecardTab.tsx` | 36 | `safeFetchJson<{ success: boolean; data: FinancialKarne }>(`/api/stock/${symbol}/scorecard`)` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/StockAnalysis/SeasonalityTab.tsx` | 28 | `safeFetchJson<{ success: boolean; data: SeasonalityData }>(`/api/stock/${symbol}/seasonality`)` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/StockAnalysis/SubsidiariesAndGovernanceTab.tsx` | 33 | `safeFetchJson<{ success: boolean; data: CompanySubsidiariesData }>(`/api/stock/${symbol}/subsidiaries`)` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/StockAnalysis/TechnicalEngineTab.tsx` | 148 | `const { data, ok, error: fetchErr } = await safeFetchJson<{ success: boolean; data: TechnicalAnalysisResult; paramHas...` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/StockAnalysis/TechnicalEngineTab.tsx` | 226 | `const { data, ok, error: aiErr } = await safeFetchJson<{ success: boolean; data: AISignalInterpretationResult }>(` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/StockAnalysisModal.tsx` | 117 | `safeFetchJson<{ news: any[] }>(`/api/market/news?search=${encodeURIComponent(analysis.symbol)}`)` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/StockAnalysisModal.tsx` | 132 | `await safeFetchJson('/api/notifications/subscribe', {` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/Subscription/PricingSection.tsx` | 62 | `const res = await safeFetchJson('/api/subscription/request-upgrade', {` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/TefasAiRadarModal.tsx` | 19 | `safeFetchJson<{ opportunities: OpportunitySignal[] }>('/api/ai/tefas-opportunities').then(({ data, ok }) => {` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/TefasAnalysis/TefasFundComparisonChart.tsx` | 96 | `const noiseFund = Math.sin(i * 1.7) * (fundEnd * 0.04);` | Sahte/Simüle Veri Üretimi (Matematiksel Zaman Serisi) | Makro veri tespitiyle onarıldı |
| `./src/components/TefasAnalysis/TefasFundComparisonChart.tsx` | 98 | `const noiseGold = Math.sin(i * 1.3) * (goldEnd * 0.03);` | Sahte/Simüle Veri Üretimi (Matematiksel Zaman Serisi) | Makro veri tespitiyle onarıldı |
| `./src/components/TefasFundsSection.tsx` | 60 | `safeFetchJson<{ funds: TefasFund[] }>('/api/tefas/funds').then(({ data, ok }) => {` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/admin/AdminAiSettingsTab.tsx` | 60 | `const res = await safeFetchJson<{ success: boolean; error?: string }>('/api/admin/ai-settings', {` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/admin/AdminAiSettingsTab.tsx` | 85 | `const res = await safeFetchJson<{ response?: string; text?: string; error?: string }>('/api/chat', {` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/admin/AdminAuditLogsTab.tsx` | 40 | `const res = await safeFetchJson<{ success: boolean }>('/api/admin/audit-logs', {` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/admin/AdminDatabaseIntegrationTab.tsx` | 142 | `const res = await safeFetchJson<{ success: boolean; settings: DatabaseSettings }>('/api/admin/db-settings');` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/admin/AdminDatabaseIntegrationTab.tsx` | 159 | `const res = await safeFetchJson<{ success: boolean; settings?: DatabaseSettings; error?: string }>(` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/admin/AdminDatabaseIntegrationTab.tsx` | 187 | `const res = await safeFetchJson<{` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/admin/AdminDatabaseIntegrationTab.tsx` | 238 | `const res = await safeFetchJson<{` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/admin/AdminDatabaseIntegrationTab.tsx` | 292 | `const res = await safeFetchJson<{` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/admin/AdminErrorLogsTab.tsx` | 40 | `await safeFetchJson<{ success: boolean }>('/api/admin/error-logs', {` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/admin/AdminErrorLogsTab.tsx` | 46 | `const snap = await getDocs(collection(db, 'errorLogs'));` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/components/admin/AdminErrorLogsTab.tsx` | 47 | `const deletePromises = snap.docs.map(d => deleteDoc(d.ref));` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/components/admin/AdminIpoManagementTab.tsx` | 42 | `const res = await safeFetchJson<{ success: boolean; listings: IPOListing[] }>('/api/ipo/listings?refresh=true');` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/admin/AdminIpoManagementTab.tsx` | 61 | `const res = await safeFetchJson<{ success: boolean; message: string; newCount: number }>('/api/admin/ipo/sync', {` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/admin/AdminIpoManagementTab.tsx` | 126 | `const res = await safeFetchJson<{ success: boolean }>(`/api/admin/ipo/${id}`, {` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/admin/AdminIpoManagementTab.tsx` | 150 | `const res = await safeFetchJson<{ success: boolean; ipo: IPOListing }>('/api/admin/ipo/upsert', {` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/admin/AdminPlatformTab.tsx` | 34 | `await getDocs(q);` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/components/admin/AdminSubscriptionTuningTab.tsx` | 174 | `const res = await safeFetchJson<{ success: boolean; error?: string }>('/api/admin/subscription-plans', {` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/admin/AdminUserManagementTab.tsx` | 89 | `const res = await safeFetchJson<{ success: boolean; user?: any; error?: string }>('/api/admin/create-user', {` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/admin/AdminUserManagementTab.tsx` | 103 | `setDoc(doc(db, 'users', res.data.user.uid), {` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/components/admin/AdminUserManagementTab.tsx` | 155 | `const res = await safeFetchJson<{ success: boolean; error?: string }>('/api/admin/grant-subscription', {` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/admin/AdminUserManagementTab.tsx` | 168 | `updateDoc(doc(db, 'users', selectedUserForGrant.uid), {` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/components/admin/AdminUserManagementTab.tsx` | 199 | `const res = await safeFetchJson<{ success: boolean; error?: string }>('/api/admin/reset-user-usage', {` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/admin/AdminUserManagementTab.tsx` | 229 | `const res = await safeFetchJson<{ success: boolean; error?: string }>('/api/admin/toggle-user-status', {` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/admin/AdminUserManagementTab.tsx` | 236 | `updateDoc(doc(db, 'users', targetUid), { isActive: nextStatus }).catch(() => {});` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/components/admin/AdminUserManagementTab.tsx` | 260 | `const res = await safeFetchJson<{ success: boolean; error?: string }>('/api/admin/change-user-role', {` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/components/admin/AdminUserManagementTab.tsx` | 271 | `updateDoc(doc(db, 'users', selectedUserForRole.uid), { role: targetRole }).catch(() => {});` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/contexts/AuthContext.tsx` | 68 | `const userSnap = await getDoc(userRef);` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/contexts/AuthContext.tsx` | 95 | `await setDoc(` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/contexts/AuthContext.tsx` | 133 | `getDoc(userRef).then(async (userSnap) => {` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/contexts/AuthContext.tsx` | 163 | `setDoc(userRef, {` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/hooks/useSubscription.ts` | 45 | `safeFetchJson<{ success: boolean; plans: Record<SubscriptionTier, SubscriptionPlanConfig> }>('/api/subscription/plans')` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/pages/Portfolio/components/TelegramAlertsModal.tsx` | 35 | `const res = await fetch('/api/portfolio/telegram/test', {` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./src/pages/Portfolio/hooks/usePortfolio.ts` | 56 | `const snapshot = await getDocs(collection(db, `users/${user?.uid}/portfolios`));` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/pages/Portfolio/hooks/usePortfolio.ts` | 64 | `const { data: apiData } = await safeFetchJson<{ success: boolean; portfolios: PortfolioItem[] }>('/api/portfolio');` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/pages/Portfolio/hooks/usePortfolio.ts` | 87 | `const { data: pData } = await safeFetchJson<{ success: boolean; portfolio: PortfolioItem }>(`/api/portfolio/${id}`);` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/pages/Portfolio/hooks/usePortfolio.ts` | 96 | `const { data: perfData } = await safeFetchJson<{` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/pages/Portfolio/hooks/usePortfolio.ts` | 116 | `const { data: txData } = await safeFetchJson<{` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/pages/Portfolio/hooks/usePortfolio.ts` | 126 | `const { data: riskData } = await safeFetchJson<{` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/pages/Portfolio/hooks/usePortfolio.ts` | 136 | `const { data: alertData } = await safeFetchJson<{` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/pages/Portfolio/hooks/usePortfolio.ts` | 176 | `const { data: res } = await safeFetchJson<{ success: boolean; transaction: PortfolioTransaction }>(` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/pages/Portfolio/hooks/usePortfolio.ts` | 214 | `await setDoc(doc(db, `users/${user?.uid}/portfolios/${newId}`), newPortfolio);` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/pages/Portfolio/hooks/usePortfolio.ts` | 220 | `await safeFetchJson('/api/portfolio', {` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/pages/Portfolio/hooks/usePortfolio.ts` | 253 | `await setDoc(doc(db, `users/${user?.uid}/portfolios/${selectedPortfolio.id}`), updatedPortfolio);` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/pages/Portfolio/hooks/usePortfolio.ts` | 259 | `await safeFetchJson(`/api/portfolio/${selectedPortfolio.id}`, {` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/pages/Portfolio/hooks/usePortfolio.ts` | 283 | `await setDoc(doc(db, `users/${user?.uid}/portfolios/${selectedPortfolio.id}`), updatedPortfolio);` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/pages/Portfolio/hooks/usePortfolio.ts` | 289 | `await safeFetchJson(`/api/portfolio/${selectedPortfolio.id}`, {` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/pages/Portfolio/hooks/usePortfolio.ts` | 308 | `await deleteDoc(doc(db, `users/${user?.uid}/portfolios/${id}`));` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/pages/Portfolio/hooks/usePortfolio.ts` | 314 | `await safeFetchJson(`/api/portfolio/${id}`, { method: 'DELETE' });` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/pages/Portfolio/hooks/usePortfolioAI.ts` | 15 | `const { data, ok } = await safeFetchJson<{` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/pages/Portfolio/hooks/usePortfolioBacktest.ts` | 14 | `const { data, ok, error: fetchErr } = await safeFetchJson<{ success: boolean; error?: string } & PortfolioBacktestRes...` | Özel API fetch wrapper çağrısı (safeFetchJson) | Makro veri tespitiyle onarıldı |
| `./src/services/firebaseClient.ts` | 16 | `export const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId &#124;&#124; '(default)');` | Firestore Başlatma | Makro veri tespitiyle onarıldı |
| `./src/services/firebaseClient.ts` | 51 | `const snap = await getDocs(collection(db, 'users'));` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/services/firebaseClient.ts` | 78 | `const snap = await getDocs(collection(db, 'users'));` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/utils/apiClient.ts` | 65 | `const res = await fetch(url, {` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./src/utils/clientErrorLogger.ts` | 60 | `await setDoc(doc(db, 'errorLogs', logId), errorPayload);` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./src/utils/clientErrorLogger.ts` | 67 | `fetch('/api/public-log-error', {` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./test-admin-db.ts` | 5 | `await adminDb.collection('auditLogs').add({` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./test-admin-raw.ts` | 6 | `const snap = await adminDb.collection('adminConfig').doc('subscriptionPlans').get();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./test-admin-raw.ts` | 14 | `await adminDb.collection('auditLogs').add({ test: 1 });` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./test-admin-read.ts` | 5 | `const db = getFirestore(app, 'ai-studio-marketpulseaitef-9befce23-8089-4716-9c4d-feabc89be875');` | Firestore Başlatma | Makro veri tespitiyle onarıldı |
| `./test-admin-read.ts` | 9 | `const snap = await db.collection('roles').get();` | Firestore İstemci DB İşlemi | Makro veri tespitiyle onarıldı |
| `./test-admin-rules.sh` | 17 | `await setDoc(doc(m.serverDb, 'users', '$USER_UID'), { role: 'admin' }, { merge: true });` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./test-auth-rules.js` | 16 | `const clientDb = getFirestore(clientApp);` | Firestore Başlatma | Makro veri tespitiyle onarıldı |
| `./test-auth-rules.js` | 23 | `await adminDb.collection("users").doc(standardUid).set({ role: "standard_user", email: "test@example.com" });` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./test-auth-rules.js` | 31 | `const docSnap = await getDoc(doc(clientDb, "users", standardUid));` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./test-auth-rules.js` | 37 | `await setDoc(doc(clientDb, "users", standardUid), { updatedByClient: true }, { merge: true });` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./test-auth-rules.js` | 43 | `await getDoc(doc(clientDb, "users", "some_other_uid"));` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./test-auth-rules.js` | 49 | `await setDoc(doc(clientDb, "adminConfig", "general"), { foo: "bar" }, { merge: true });` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./test-auth-rules.js` | 55 | `await adminDb.collection("users").doc(adminUid).set({ role: "admin", email: "admin@example.com" });` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./test-auth-rules.js` | 63 | `await getDoc(doc(clientDb, "adminConfig", "general"));` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./test-auth-rules.js` | 69 | `await setDoc(doc(clientDb, "adminConfig", "test_rule"), { success: true });` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./test-auth-rules.js` | 74 | `await adminDb.collection("users").doc(standardUid).delete();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./test-auth-rules.js` | 75 | `await adminDb.collection("users").doc(adminUid).delete();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./test-auth-rules.js` | 76 | `await adminDb.collection("adminConfig").doc("test_rule").delete();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./test-e2e-integrity.ts` | 22 | `await adminDb.collection('data_integrity_audit').doc(testDocId).set({` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./test-e2e-integrity.ts` | 31 | `const getRes = await fetch(`${baseUrl}/api/admin/integrity/review-queue`);` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./test-e2e-integrity.ts` | 44 | `const postRes = await fetch(`${baseUrl}/api/admin/integrity/review-queue/${testDocId}/decision`, {` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./test-e2e-integrity.ts` | 57 | `const updatedDoc = await adminDb.collection('data_integrity_audit').doc(testDocId).get();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./test-e2e-integrity.ts` | 73 | `await adminDb.collection('data_integrity_audit').doc(testDocId).delete().catch(() => {});` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./test-errors.ts` | 3 | `const snapshot = await adminDb.collection('errorLogs').orderBy('timestamp', 'desc').limit(5).get();` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./test-fetch.js` | 1 | `fetch('http://example.com', { timeout: 35000 }).then(() => console.log('ok')).catch(console.error);` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./test-firestore-rules.js` | 8 | `const db = getFirestore(app);` | Firestore Başlatma | Makro veri tespitiyle onarıldı |
| `./test-firestore-rules.js` | 14 | `await getDoc(doc(db, "adminConfig", "general"));` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./test-firestore-rules.js` | 25 | `await setDoc(doc(db, "adminConfig", "test"), { foo: "bar" });` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./test-firestore-rules.js` | 32 | `await addDoc(collection(db, "auditLogs"), { action: "test" });` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./test-firestore-rules.js` | 39 | `await getDoc(doc(db, "users", "some_other_uid"));` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./test-firestore-rules.js` | 46 | `await setDoc(doc(db, "users", auth.currentUser.uid), { test: "data" });` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./test-firestore-rules.js` | 53 | `await getDoc(doc(db, "users", auth.currentUser.uid));` | Firestore Veri Okuma/Yazma | Makro veri tespitiyle onarıldı |
| `./test-mod1-scenarios.ts` | 7 | `const originalGet = adminDb.collection('adminConfig').doc('subscriptionPlans').get;` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./test-mod1-scenarios.ts` | 8 | `adminDb.collection('adminConfig').doc('subscriptionPlans').get = async () => {` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./test-mod1-scenarios.ts` | 24 | `adminDb.collection('adminConfig').doc('subscriptionPlans').get = originalGet;` | Firestore Admin DB İşlemi | Makro veri tespitiyle onarıldı |
| `./test-mod3-health-runner.ts` | 20 | `const req = http.get(`http://127.0.0.1:${port}/api/health`, (res) => {` | HTTP İsteği (Node.js http/https) | Makro veri tespitiyle onarıldı |
| `./test-trick.cjs` | 25 | `var import_yahoo_finance2 = __toESM(require("yahoo-finance2"), 1);` | Yahoo Finance API Paketi | Makro veri tespitiyle onarıldı |
| `./test-trick.cjs` | 28 | `yf.quote("AAPL").then((res) => console.log(res.regularMarketPrice)).catch(console.error);` | Yahoo Finance API Çağrısı | Makro veri tespitiyle onarıldı |
| `./test-trick.ts` | 4 | `yf.quote("AAPL").then(res => console.log(res.regularMarketPrice)).catch(console.error);` | Yahoo Finance API Çağrısı | Makro veri tespitiyle onarıldı |
| `./test-tsx.cjs` | 25 | `var import_yahoo_finance2 = __toESM(require("yahoo-finance2"), 1);` | Yahoo Finance API Paketi | Makro veri tespitiyle onarıldı |
| `./test-worker-health-monitor.ts` | 18 | `const res = await fetch('http://127.0.0.1:3000/api/health');` | HTTP İsteği (fetch API) | Makro veri tespitiyle onarıldı |
| `./test-yf.cjs` | 1 | `const yf = require("yahoo-finance2").default;` | Yahoo Finance API Paketi | Makro veri tespitiyle onarıldı |
| `./test-yf.cjs` | 2 | `yf.quote("AAPL").then(res => console.log(res.regularMarketPrice)).catch(console.error);` | Yahoo Finance API Çağrısı | Makro veri tespitiyle onarıldı |
| `./test-yf2.cjs` | 1 | `const { YahooFinance } = require("yahoo-finance2");` | Yahoo Finance API Paketi | Makro veri tespitiyle onarıldı |
| `./test-yf2.cjs` | 3 | `yf.quote("AAPL").then(res => console.log(res.regularMarketPrice)).catch(console.error);` | Yahoo Finance API Çağrısı | Makro veri tespitiyle onarıldı |
| `./test-yf3.cjs` | 1 | `const yfClass = require("yahoo-finance2").default;` | Yahoo Finance API Paketi | Makro veri tespitiyle onarıldı |
| `./test-yf3.cjs` | 3 | `yf.quote("AAPL").then(res => console.log(res.regularMarketPrice)).catch(console.error);` | Yahoo Finance API Çağrısı | Makro veri tespitiyle onarıldı |
| `./test-yf4.cjs` | 1 | `const yfClass = require("yahoo-finance2").default;` | Yahoo Finance API Paketi | Makro veri tespitiyle onarıldı |
