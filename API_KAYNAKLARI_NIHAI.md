# API ve Veri Kaynağı Bulunan Dosyalar

| Dosya Yolu | Satır No | Kod Satırı | Bağlandığı Kaynak | Doğrulama Durumu |
|---|---|---|---|---|
| `./bootstrap_roles.cjs` | 9 | `await adminDb.collection('roles').doc('admin').set({` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./bootstrap_roles.cjs` | 14 | `await adminDb.collection('roles').doc('standard_user').set({` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./bootstrap_roles.cjs` | 19 | `await adminDb.collection('roles').doc('premium_user').set({` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./bootstrap_roles.ts` | 8 | `await db.collection('roles').doc('admin').set({` | Firestore İstemci DB İşlemi | İki turda da doğrulandı |
| `./bootstrap_roles.ts` | 13 | `await db.collection('roles').doc('standard_user').set({` | Firestore İstemci DB İşlemi | İki turda da doğrulandı |
| `./bootstrap_roles.ts` | 18 | `await db.collection('roles').doc('premium_user').set({` | Firestore İstemci DB İşlemi | İki turda da doğrulandı |
| `./get-errors.ts` | 3 | `const snap = await adminDb.collection('errorLogs').orderBy('timestamp', 'desc').limit(5).get();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./get_atr.ts` | 9 | `const res = await fetch(url);` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./package.json` | 42 | `"yahoo-finance2": "^4.0.2"` | Yahoo Finance API Paketi | İki turda da doğrulandı |
| `./patch-server.cjs` | 12 | `/const YahooFinance = require\("yahoo-finance2"\)\.default;\s*const yf = new YahooFinance\(\{ suppressNotices: \["yah...` | Yahoo Finance API Paketi | İki turda da doğrulandı |
| `./patch-server.cjs` | 17 | `/const YahooFinance = require\("yahoo-finance2"\)\.default;\s*const yf = new YahooFinance\(\{ suppressNotices: \["yah...` | Yahoo Finance API Paketi | İki turda da doğrulandı |
| `./patch-service.cjs` | 6 | `/const YahooFinance = require\("yahoo-finance2"\)\.default;\s*const yf = new YahooFinance\(\{ suppressNotices: \["yah...` | Yahoo Finance API Paketi | İki turda da doğrulandı |
| `./patch2.cjs` | 6 | `fetch('/api/health?error=' + encodeURIComponent(e.message));` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./patch2.cjs` | 9 | `fetch('/api/health?error=' + encodeURIComponent(e.reason ? e.reason.stack &#124;&#124; e.reason : 'unknown'));` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./patch_admin_audit.cjs` | 21 | `const logsSnap = await getDocs(q);` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./patch_admin_auth.cjs` | 23 | `const snapPromise = getDoc(userRef);` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./patch_admin_auth.cjs` | 44 | `const res = await fetch(url, {` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./patch_admin_auth.cjs` | 76 | `const snapPromise = getDoc(roleRef);` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./patch_admin_service.cjs` | 18 | `const snap = await adminDb.collection('users').doc(uid).get();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./patch_admin_service.cjs` | 42 | `const snap = await adminDb.collection('roles').doc(roleName).get();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./patch_app2.cjs` | 4 | `"fetchOpportunities('ALL');\n    fetchNews();\n\n    const interval = setInterval(() => {",` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | İki turda da doğrulandı |
| `./patch_app2.cjs` | 5 | `"fetchNews();\n\n    const interval = setInterval(() => {"` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | İki turda da doğrulandı |
| `./patch_app_modelconfig.cjs` | 18 | `getDoc(doc(db, 'user_preferences', user.uid)).then(snap => {` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./patch_app_modelconfig.cjs` | 36 | `setDoc(doc(db, 'user_preferences', user.uid), { modelConfig: newConfig }, { merge: true });` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./patch_app_radar.sh` | 2 | `sed -i -e 's/const res = await fetch(\`\/api\/ai\/opportunities?category=${cat}\`);/const scopeParam = modelConfig.ra...` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./patch_app_watchlist_sync.cjs` | 23 | `setDoc(doc(db, 'user_watchlists', user.uid), { items: watchlist }, { merge: true });` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./patch_app_watchlist_sync.cjs` | 32 | `getDoc(doc(db, 'user_watchlists', user.uid)).then(snap => {` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./patch_auth_audit.cjs` | 5 | `"import { adminAuth, adminDb } from '../services/firebaseAdminService';",` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | İki turda da doğrulandı |
| `./patch_auth_audit.cjs` | 6 | `"import { adminAuth, adminDb } from '../services/firebaseAdminService';\nimport { logAudit } from '../services/auditS...` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | İki turda da doğrulandı |
| `./patch_auth_google.cjs` | 23 | `await setDoc(doc(db, 'users', user.uid), {` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./patch_auth_middleware.cjs` | 5 | `"import { adminAuth, adminDb } from '../services/firebaseAdminService';",` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | İki turda da doğrulandı |
| `./patch_auth_middleware.cjs` | 11 | `const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./patch_auth_middleware.cjs` | 24 | `const res = await fetch(url, { headers: { Authorization: \`Bearer \${idToken}\` } });` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./patch_auth_middleware.cjs` | 47 | `const roleDoc = await adminDb.collection('roles').doc(req.userRole).get();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./patch_auth_middleware.cjs` | 65 | `const res = await fetch(url, { headers: { Authorization: \`Bearer \${req.idToken}\` } });` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./patch_auth_permissions.cjs` | 10 | `"const userSnap = await getDoc(userRef);\n        if (userSnap.exists()) {",` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./patch_auth_permissions.cjs` | 11 | ``const userSnap = await getDoc(userRef);` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./patch_auth_permissions.cjs` | 15 | `const roleSnap = await getDoc(doc(db, 'roles', ud.role));` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./patch_bot.cjs` | 5 | `"import { adminDb } from '../services/firebaseAdminService';",` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | İki turda da doğrulandı |
| `./patch_bot.cjs` | 11 | ``    const tokenDoc = await adminDb.collection('telegramTokens').doc(token).get();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./patch_bot.cjs` | 18 | `await adminDb.collection('users').doc(uid).set({` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./patch_bot.cjs` | 23 | `await adminDb.collection('telegramTokens').doc(token).delete();`,` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./patch_bot.cjs` | 25 | `const tokenDoc = await getDoc(tokenRef);` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./patch_bot.cjs` | 32 | `await setDoc(doc(serverDb, 'users', uid), {` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./patch_bot.cjs` | 41 | ``    const snap = await adminDb.collection('users').where('telegramChatId', '==', chatId.toString()).limit(1).get();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./patch_bot.cjs` | 45 | `const snap = await getDocs(q);` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./patch_bot.cjs` | 52 | ``      const userDoc = await adminDb.collection('users').doc(uid).get();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./patch_bot.cjs` | 54 | ``      const userDoc = await getDoc(doc(serverDb, 'users', uid));` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./patch_bot.cjs` | 60 | ``    await adminDb.collection('users').doc(uid).set({ telegramNotificationsEnabled: false }, { merge: true });`,` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./patch_bot.cjs` | 61 | ``    await setDoc(doc(serverDb, 'users', uid), { telegramNotificationsEnabled: false }, { merge: true });`` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./patch_bot.cjs` | 66 | ``    await adminDb.collection('users').doc(uid).set({ telegramNotificationsEnabled: true }, { merge: true });`,` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./patch_bot.cjs` | 67 | ``    await setDoc(doc(serverDb, 'users', uid), { telegramNotificationsEnabled: true }, { merge: true });`` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./patch_chat2.cjs` | 36 | `getDoc(doc(db, 'users', user.uid, 'chatHistories', 'default')).then(snap => {` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./patch_chat2.cjs` | 66 | `setDoc(doc(db, 'users', user.uid, 'chatHistories', 'default'), { messages }, { merge: true }).catch(e => {` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./patch_chat_persistence.cjs` | 41 | `getDoc(doc(db, 'user_chat_histories', user.uid)).then(snap => {` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./patch_chat_persistence.cjs` | 72 | `setDoc(doc(db, 'user_chat_histories', user.uid), { messages }, { merge: true }).catch(e => {` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./patch_digest.cjs` | 5 | `"import { adminDb } from '../services/firebaseAdminService.ts';",` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | İki turda da doğrulandı |
| `./patch_digest.cjs` | 10 | ``    const usersSnap = await adminDb.collection('users')` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./patch_digest.cjs` | 14 | `const usersSnap = await getDocs(q);`` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./patch_header_search.sh` | 13 | `fetch(`/api/market/search?q=${searchQuery.trim()}`)\` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./patch_modal_news.sh` | 6 | `fetch(`/api/market/news?search=${analysis.symbol}`)\` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./patch_news.sh` | 6 | `const yahooFinance = require("yahoo-finance2").default;\` | Yahoo Finance API Paketi | İki turda da doğrulandı |
| `./patch_orchestrator.cjs` | 10 | `const usersSnap = await adminDb.collection('users')` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./patch_orchestrator2.cjs` | 15 | `const usersSnap = await getDocs(q);` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./patch_routers.cjs` | 7 | `content = content.replace(/import \{ serverDb \} from '\.\.\/services\/firebaseClientService';/, "import { adminDb } ...` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | İki turda da doğrulandı |
| `./patch_routers.cjs` | 11 | `"await adminDb.collection('upgrade_requests').add(requestRecord);");` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./patch_routers.cjs` | 15 | `"await adminDb.collection('users').get();");` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./patch_routers.cjs` | 27 | `content = content.replace(/import \{ serverDb \} from '\.\.\/services\/firebaseClientService';/, "import { adminDb } ...` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | İki turda da doğrulandı |
| `./patch_routers.cjs` | 31 | `"await adminDb.collection('users').get();");` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./patch_routers.cjs` | 35 | `"await adminDb.collection('users').doc(targetUid).set({ role: newRole, updatedAt: new Date().toISOString() }, { merge...` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./patch_routers.cjs` | 39 | `"await adminDb.collection('users').doc(targetUid).set({ isBanned, banReason: reason &#124;&#124; '', updatedAt: new D...` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./patch_server.cjs` | 5 | `"import { adminDb } from './server/services/firebaseAdminService.js';",` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | İki turda da doğrulandı |
| `./patch_server.cjs` | 10 | ``    await adminDb.collection('telegramTokens').doc(token).set({` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./patch_server.cjs` | 15 | ``    await setDoc(doc(serverDb, 'telegramTokens', token), {` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./patch_server.cjs` | 23 | ``    await adminDb.collection('users').doc(uid).set({` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./patch_server.cjs` | 27 | ``    await setDoc(doc(serverDb, 'users', uid), {` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./patch_server_search.sh` | 7 | `const yahooFinance = require("yahoo-finance2").default;\` | Yahoo Finance API Paketi | İki turda da doğrulandı |
| `./patch_server_telegram.cjs` | 19 | `await adminDb.collection('telegramTokens').doc(token).set({` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./patch_server_telegram.cjs` | 37 | `await adminDb.collection('users').doc(uid).set({` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./patch_settings_tab.cjs` | 31 | `await fetch('/api/telegram/unlink', {` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./patch_settings_tab.cjs` | 51 | `const res = await fetch('/api/telegram/link-token', {` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./patch_sub_service.cjs` | 41 | `const snap = await adminDb.collection('users').doc(uid).get();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./patch_sub_service.cjs` | 110 | `await adminDb.collection('users').doc(uid).set({` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./patch_sub_service.cjs` | 135 | `content = content.replace(/import \{ serverDb \} from '\.\/firebaseClientService';/, 'import { adminDb } from "./fire...` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | İki turda da doğrulandı |
| `./patch_sub_service.cjs` | 146 | `"adminDb.collection('users').doc(uid).set({ usage: newUsage }, { merge: true }).catch(err => console.error('Failed to...` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./patch_sub_service.cjs` | 150 | `"await adminDb.collection('users').doc(uid).set({ usage: cleanUsage }, { merge: true }).catch(err => { throw new Crit...` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./patch_telegram.cjs` | 16 | `const response = await fetch(\`https://api.telegram.org/bot\${botToken}/sendMessage\`, {` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./patch_useportfolio.cjs` | 29 | `const snapshot = await getDocs(collection(db, \`user_portfolios/\${auth.currentUser.uid}/portfolios\`));` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./patch_useportfolio.cjs` | 128 | `const response = await fetch('/api/portfolio', {` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./patch_useportfolio.cjs` | 165 | `await setDoc(doc(db, \`user_portfolios/\${auth.currentUser.uid}/portfolios/\${newId}\`), newPortfolio);` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./patch_useportfolio.cjs` | 177 | `const addHoldingOriginal = `      const response = await fetch(\`/api/portfolio/\${selectedPortfolio.id}\`, {` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./patch_useportfolio.cjs` | 188 | `await setDoc(doc(db, \`user_portfolios/\${auth.currentUser.uid}/portfolios/\${selectedPortfolio.id}\`), updatedPortfo...` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./patch_useportfolio.cjs` | 194 | `const removeHoldingOriginal = `      const response = await fetch(\`/api/portfolio/\${selectedPortfolio.id}\`, {` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./patch_useportfolio.cjs` | 205 | `await setDoc(doc(db, \`user_portfolios/\${auth.currentUser.uid}/portfolios/\${selectedPortfolio.id}\`), updatedPortfo...` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./patch_useportfolio.cjs` | 214 | `const response = await fetch(\`/api/portfolio/\${id}\`, { method: 'DELETE' });` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./patch_yahoo.cjs` | 51 | `return await withBackoff(() => yf.quote(ticker));` | Yahoo Finance API Çağrısı | İki turda da doğrulandı |
| `./patch_yahoo.cjs` | 65 | `if (!content.includes('fetchFromYahooWithCacheAndLimit')) {` | Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor) | İki turda da doğrulandı |
| `./patch_yahoo.cjs` | 72 | `'const quote = await withBackoff(() => yf.quote(asset.yahooTicker)) as any;',` | Yahoo Finance API Çağrısı | İki turda da doğrulandı |
| `./patch_yahoo.cjs` | 78 | `'const quote = await yf.quote(upper).catch(() => null) as any;',` | Yahoo Finance API Çağrısı | İki turda da doğrulandı |
| `./rewrite_academy.cjs` | 77 | `fetch('/api/academy/topics')` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./run_v6.1_backtest.ts` | 32 | `const res = await fetch(url);` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./run_v6.3_backtest.ts` | 31 | `const res = await fetch(url);` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./run_v6.4_backtest.ts` | 27 | `const res = await fetch(url);` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./run_v6.5_backtest.ts` | 28 | `const res = await fetch(url);` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./scripts/runProtocolAudit.ts` | 56 | `directQuote = await yf.quote(`${sym}.IS`);` | Yahoo Finance API Çağrısı | İki turda da doğrulandı |
| `./scripts/runProtocolAudit.ts` | 84 | `const res = await fetch(`${baseURL}/${sym}/${ep}`);` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./seed-admin.ts` | 37 | `await setDoc(doc(db, 'users', user.uid), {` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./seed-admin.ts` | 46 | `await setDoc(doc(db, 'roles', 'admin'), { description: 'Tam yetkili yönetici', permissions: ['admin.*'] });` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./seed-admin.ts` | 47 | `await setDoc(doc(db, 'roles', 'standard_user'), { description: 'Standart kullanıcı', permissions: ['academy.access'] });` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./seed-admin.ts` | 48 | `await setDoc(doc(db, 'roles', 'premium_user'), { description: 'Premium abone', permissions: ['academy.access', 'scree...` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./server.ts` | 594 | `const pingRes = await fetch(`${url}/api/tags`);` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./server/aiService.ts` | 120 | `const response = await fetch(`${ollamaUrl}/api/generate`, {` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./server/aiService.ts` | 181 | `const response = await fetch(`${baseUrl}/chat/completions`, {` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./server/backtest/runFullMultiYearBacktest.ts` | 51 | `const res = await fetch(url);` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./server/indicator_fetchers/FrankfurterFetcher.ts` | 22 | `const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=TRY,EUR', {` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./server/indicator_fetchers/YahooFinanceMacroFetcher.ts` | 41 | `const quote = await yfClient.quote(sym);` | Yahoo Finance Client Çağrısı | İki turda da doğrulandı |
| `./server/intelligence/orchestratorAgent.ts` | 306 | `const fetchPromise = adminDb.collection('users').where('telegramChatId', '!=', null).get();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/intelligence/scheduledDigest.ts` | 15 | `const fetchPromise = adminDb.collection('users').where('telegramChatId', '!=', null).get();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/intelligence/technicalAgent.ts` | 302 | `const wave = Math.sin((i + seed) * 0.18) * (currentPrice * 0.015);` | Sahte/Simüle Veri Üretimi (Matematiksel) | İki turda da doğrulandı |
| `./server/intelligence/telegramBot.ts` | 18 | `const tokenRef = adminDb.collection('telegramTokens').doc(token);` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/intelligence/telegramBot.ts` | 34 | `await adminDb.collection('users').doc(uid).set({` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/intelligence/telegramBot.ts` | 51 | `const snap = await adminDb.collection('users').where('telegramChatId', '==', chatId.toString()).limit(1).get();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/intelligence/telegramBot.ts` | 125 | `const userDoc = await adminDb.collection('users').doc(uid).get();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/intelligence/telegramBot.ts` | 139 | `await adminDb.collection('users').doc(uid).set({ telegramNotificationsEnabled: false }, { merge: true });` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/intelligence/telegramBot.ts` | 147 | `await adminDb.collection('users').doc(uid).set({ telegramNotificationsEnabled: true }, { merge: true });` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/intelligence/telegramService.ts` | 202 | `const res = await fetch(url, {` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./server/migrations/migrateIpoDeepAnalysis.ts` | 58 | `const snap = await adminDb.collection('ipoListings').get();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/migrations/migrateIpoDeepAnalysis.ts` | 74 | `await adminDb.collection('ipoListings').doc(docSnap.id).set(enriched, { merge: true }).catch((err) => {` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/portfolio/portfolioAI.ts` | 176 | `p += (Math.sin(i * 0.5) * 0.015 * basePrice) + (0.003 * basePrice);` | Sahte/Simüle Veri Üretimi (Matematiksel) | İki turda da doğrulandı |
| `./server/routes/adminIntegrityRouter.ts` | 13 | `const snapshot = await adminDb.collection('data_integrity_audit')` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/routes/adminIntegrityRouter.ts` | 52 | `await adminDb.collection('data_integrity_audit').doc(req.params.id).set(updates, { merge: true });` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/routes/adminRouter.ts` | 152 | `const snap = await adminDb.collection('users').get();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/routes/adminRouter.ts` | 197 | `await adminDb.collection('users').doc(u.uid).set(u, { merge: true });` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/routes/adminRouter.ts` | 295 | `const userDoc = await adminDb.collection('users').doc(targetUid).get();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/routes/adminRouter.ts` | 311 | `await adminDb.collection('users').doc(targetUid).set({ role: newRole, updatedAt: new Date().toISOString() }, { merge:...` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/routes/adminRouter.ts` | 352 | `await adminDb.collection('users').doc(targetUid).set({ isActive, updatedAt: new Date().toISOString() }, { merge: true...` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/routes/adminRouter.ts` | 469 | `await adminDb.collection('users').doc(uid).set(newUser, { merge: true });` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/routes/adminRouter.ts` | 506 | `const snap = await adminDb.collection('users').get();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/routes/subscriptionRouter.ts` | 92 | `await adminDb.collection('upgrade_requests').add(requestRecord);` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/routes/subscriptionRouter.ts` | 177 | `const snap = await adminDb.collection('users').get();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/routes/subscriptionRouter.ts` | 228 | `await adminDb.collection('users').doc(u.uid).set(u, { merge: true });` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/services/adminConfigService.ts` | 68 | `const planDocRef = adminDb.collection('adminConfig').doc('subscriptionPlans');` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/services/adminConfigService.ts` | 95 | `await adminDb.collection('adminConfig').doc('subscriptionPlans').set({` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/services/adminConfigService.ts` | 119 | `await adminDb.collection('adminConfig').doc('subscriptionPlans').set({` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/services/adminConfigService.ts` | 167 | `const snap = await adminDb.collection('adminConfig').doc('aiSettings').get().catch(async () => {` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/services/adminConfigService.ts` | 189 | `await adminDb.collection('adminConfig').doc('aiSettings').set(cachedAiSettings, { merge: true }).catch(() => {});` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/services/adminConfigService.ts` | 215 | `await adminDb.collection('adminConfig').doc('aiSettings').set(updated, { merge: true });` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/services/apiQuotaService.ts` | 116 | `endpointSample: 'https://query1.finance.yahoo.com/v8/finance/chart/THYAO.IS'` | Sahte/Simüle API Quota (Statik Veri) | İki turda da doğrulandı |
| `./server/services/apiQuotaService.ts` | 170 | `endpointSample: 'https://www.tefas.gov.tr/api/DB/BindHistoryInfo'` | Sahte/Simüle API Quota (Statik Veri) | İki turda da doğrulandı |
| `./server/services/apiQuotaService.ts` | 188 | `endpointSample: 'firestore.collection("user_watchlists").doc(uid)'` | Sahte/Simüle API Quota (Statik Veri) | İki turda da doğrulandı |
| `./server/services/apiQuotaService.ts` | 224 | `endpointSample: 'https://evds2.tcmb.gov.tr/service/evds'` | Sahte/Simüle API Quota (Statik Veri) | İki turda da doğrulandı |
| `./server/services/auditService.ts` | 67 | `await adminDb.collection('auditLogs').doc(logId).set(entry);` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/services/auditService.ts` | 180 | `await adminDb.collection('errorLogs').doc(logId).set(entry);` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/services/auditService.ts` | 190 | `const snap = await adminDb.collection('auditLogs').orderBy('timestamp', 'desc').limit(limitCount).get();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/services/auditService.ts` | 226 | `await adminDb.collection('auditLogs').doc(sampleLog.id!).set(sampleLog);` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/services/auditService.ts` | 239 | `const snap = await adminDb.collection('errorLogs').orderBy('timestamp', 'desc').limit(limitCount).get();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/services/auditService.ts` | 274 | `await adminDb.collection('errorLogs').doc(sampleErr.id!).set(sampleErr);` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/services/auditService.ts` | 288 | `const snap = await adminDb.collection('auditLogs').get();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/services/auditService.ts` | 304 | `const snap = await adminDb.collection('errorLogs').get();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/services/dataIntegrityService.ts` | 65 | `adminDb.collection('data_integrity_audit').add(entry).catch((err) => {` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/services/dbIntegrationService.ts` | 113 | `const docRef = adminDb.collection('adminConfig').doc('databaseIntegration');` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/services/dbIntegrationService.ts` | 182 | `await adminDb.collection('adminConfig').doc('databaseIntegration').set(updated, { merge: true });` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/services/dbIntegrationService.ts` | 346 | `const userSnap = await adminDb.collection('users').limit(20).get();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/services/firebaseAdminService.ts` | 55 | `const snap = await safeAdminGet(db => db.collection('users').doc(uid).get());` | Firestore İstemci DB İşlemi | İki turda da doğrulandı |
| `./server/services/firebaseAdminService.ts` | 86 | `const snap = await safeAdminGet(db => db.collection('roles').doc(roleName).get());` | Firestore İstemci DB İşlemi | İki turda da doğrulandı |
| `./server/services/ipoDataService.ts` | 759 | `const snapPromise = adminDb.collection('ipoListings').get();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/services/ipoDataService.ts` | 948 | `await adminDb.collection('ipoListings').doc(id).set(updated, { merge: true });` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/services/ipoDataService.ts` | 992 | `await adminDb.collection('ipoListings').doc(id).delete();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/services/ipoDataService.ts` | 1033 | `const response = await fetch('https://www.kap.org.tr/tr/api/disclosures', {` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./server/services/notificationService.ts` | 60 | `const response = await fetch(url, {` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./server/services/subscriptionService.ts` | 91 | `const snap = await adminDb.collection('users').doc(uid).get().catch(async () => {` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/services/subscriptionService.ts` | 184 | `await adminDb.collection('users').doc(uid).set({` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/services/subscriptionService.ts` | 237 | `adminDb.collection('users').doc(uid).set({ usage: newUsage }, { merge: true }).catch(err => {` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/services/subscriptionService.ts` | 260 | `adminDb.collection('users').doc(uid).set({ usage: newUsage }, { merge: true }).catch(err => {` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/services/subscriptionService.ts` | 283 | `await adminDb.collection('users').doc(uid).set({ usage: cleanUsage }, { merge: true }).catch(err => {` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./server/yahooFinanceService.ts` | 57 | `return await withBackoff(() => yf.quote(ticker));` | Yahoo Finance API Çağrısı | İki turda da doğrulandı |
| `./server/yahooFinanceService.ts` | 237 | `const res = await fetch('https://api.binance.com/api/v3/ticker/24hr', {` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./server/yahooFinanceService.ts` | 280 | `const res = await fetch(url, {` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./src/App.tsx` | 138 | `getDoc(doc(db, 'users', user.uid, 'preferences', 'default')).then(snap => {` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/App.tsx` | 156 | `setDoc(doc(db, 'users', user.uid, 'preferences', 'default'), { modelConfig: newConfig }, { merge: true });` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/App.tsx` | 194 | `setDoc(doc(db, 'users', user.uid, 'watchlist', 'default'), { items: watchlist }, { merge: true });` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/App.tsx` | 203 | `getDoc(doc(db, 'users', user.uid, 'watchlist', 'default')).then(snap => {` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/components/AdminPanel.tsx` | 84 | `const usersSnap = await getDocs(collection(db, 'users'));` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/components/AdminPanel.tsx` | 134 | `const errorSnap = await getDocs(collection(db, 'errorLogs'));` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/components/AdminSettingsSection.tsx` | 18 | `const settingsSnap = await getDoc(doc(db, 'platform_settings', 'general'));` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/components/AdminSettingsSection.tsx` | 26 | `const rolesSnap = await getDocs(collection(db, 'roles'));` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/components/AdminSettingsSection.tsx` | 33 | `const logsSnap = await getDocs(q);` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/components/AdminSettingsSection.tsx` | 47 | `await setDoc(doc(db, 'platform_settings', 'general'), {` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/components/AdminSettingsSection.tsx` | 75 | `await updateDoc(doc(db, 'roles', roleId), { permissions: currentPerms });` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/components/AuthScreen.tsx` | 66 | `await setDoc(` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/components/AuthScreen.tsx` | 117 | `await setDoc(` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/components/AuthScreen.tsx` | 194 | `await setDoc(doc(db, 'users', user.uid), {` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/components/FinancialAcademySection.tsx` | 93 | `fetch('/api/academy/topics')` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./src/components/LatestBalanceSheetsSection.tsx` | 92 | `await safeFetchJson('/api/notifications/subscribe', {` | Özel API fetch wrapper çağrısı | İki turda da doğrulandı |
| `./src/components/SettingsSection.tsx` | 133 | `const res = await fetch('/api/telegram/test-alert', {` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./src/components/StockAnalysis/InteractiveStockPriceChart.tsx` | 85 | `let p = baseP * (1 - (days * 0.0008) + (Math.sin(days) * 0.05));` | Sahte/Simüle Veri Üretimi (Matematiksel) | İki turda da doğrulandı |
| `./src/components/StockAnalysis/InteractiveStockPriceChart.tsx` | 102 | `p = p * (1 - progress * 0.05) + (baseP * 0.95 + (Math.sin(i) * baseP * 0.03)) * (progress * 0.05);` | Sahte/Simüle Veri Üretimi (Matematiksel) | İki turda da doğrulandı |
| `./src/components/StockAnalysis/InteractiveStockPriceChart.tsx` | 138 | `const rsiVal = i === 0 ? targetRSI : Math.max(0, Math.min(100, targetRSI + Math.sin(i * 0.3) * (i / days) * 25));` | Sahte/Simüle Veri Üretimi (Matematiksel) | İki turda da doğrulandı |
| `./src/components/StockAnalysis/InteractiveStockPriceChart.tsx` | 143 | `const macdVal = i === 0 ? targetMacd : targetMacd + Math.sin(i * 0.2) * (i / days) * (baseP * 0.02);` | Sahte/Simüle Veri Üretimi (Matematiksel) | İki turda da doğrulandı |
| `./src/components/StockAnalysis/InteractiveStockPriceChart.tsx` | 144 | `const macdSig = i === 0 ? targetSig : targetSig + Math.sin(i * 0.2 + 0.5) * (i / days) * (baseP * 0.02);` | Sahte/Simüle Veri Üretimi (Matematiksel) | İki turda da doğrulandı |
| `./src/components/StockAnalysis/InteractiveStockPriceChart.tsx` | 150 | `const bbUpper = i === 0 ? targetBbUpper : targetBbUpper + Math.sin(i * 0.1) * (i / days) * (baseP * 0.02);` | Sahte/Simüle Veri Üretimi (Matematiksel) | İki turda da doğrulandı |
| `./src/components/StockAnalysis/InteractiveStockPriceChart.tsx` | 151 | `const bbLower = i === 0 ? targetBbLower : targetBbLower - Math.sin(i * 0.1) * (i / days) * (baseP * 0.02);` | Sahte/Simüle Veri Üretimi (Matematiksel) | İki turda da doğrulandı |
| `./src/components/StockAnalysisModal.tsx` | 132 | `await safeFetchJson('/api/notifications/subscribe', {` | Özel API fetch wrapper çağrısı | İki turda da doğrulandı |
| `./src/components/Subscription/PricingSection.tsx` | 62 | `const res = await safeFetchJson('/api/subscription/request-upgrade', {` | Özel API fetch wrapper çağrısı | İki turda da doğrulandı |
| `./src/components/admin/AdminErrorLogsTab.tsx` | 46 | `const snap = await getDocs(collection(db, 'errorLogs'));` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/components/admin/AdminPlatformTab.tsx` | 34 | `await getDocs(q);` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/components/admin/AdminUserManagementTab.tsx` | 103 | `setDoc(doc(db, 'users', res.data.user.uid), {` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/components/admin/AdminUserManagementTab.tsx` | 168 | `updateDoc(doc(db, 'users', selectedUserForGrant.uid), {` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/components/admin/AdminUserManagementTab.tsx` | 236 | `updateDoc(doc(db, 'users', targetUid), { isActive: nextStatus }).catch(() => {});` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/components/admin/AdminUserManagementTab.tsx` | 271 | `updateDoc(doc(db, 'users', selectedUserForRole.uid), { role: targetRole }).catch(() => {});` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/contexts/AuthContext.tsx` | 68 | `const userSnap = await getDoc(userRef);` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/contexts/AuthContext.tsx` | 95 | `await setDoc(` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/contexts/AuthContext.tsx` | 133 | `getDoc(userRef).then(async (userSnap) => {` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/contexts/AuthContext.tsx` | 163 | `setDoc(userRef, {` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/data/tefasFundsData.ts` | 772 | `price: Number((Math.random() * 25 + 0.1).toFixed(4)),` | Sahte/Simüle Veri Üretimi (Matematiksel) | İki turda da doğrulandı |
| `./src/pages/Portfolio/components/TelegramAlertsModal.tsx` | 35 | `const res = await fetch('/api/portfolio/telegram/test', {` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./src/pages/Portfolio/hooks/usePortfolio.ts` | 56 | `const snapshot = await getDocs(collection(db, `users/${user?.uid}/portfolios`));` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/pages/Portfolio/hooks/usePortfolio.ts` | 214 | `await setDoc(doc(db, `users/${user?.uid}/portfolios/${newId}`), newPortfolio);` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/pages/Portfolio/hooks/usePortfolio.ts` | 220 | `await safeFetchJson('/api/portfolio', {` | Özel API fetch wrapper çağrısı | İki turda da doğrulandı |
| `./src/pages/Portfolio/hooks/usePortfolio.ts` | 253 | `await setDoc(doc(db, `users/${user?.uid}/portfolios/${selectedPortfolio.id}`), updatedPortfolio);` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/pages/Portfolio/hooks/usePortfolio.ts` | 259 | `await safeFetchJson(`/api/portfolio/${selectedPortfolio.id}`, {` | Özel API fetch wrapper çağrısı | İki turda da doğrulandı |
| `./src/pages/Portfolio/hooks/usePortfolio.ts` | 283 | `await setDoc(doc(db, `users/${user?.uid}/portfolios/${selectedPortfolio.id}`), updatedPortfolio);` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/pages/Portfolio/hooks/usePortfolio.ts` | 289 | `await safeFetchJson(`/api/portfolio/${selectedPortfolio.id}`, {` | Özel API fetch wrapper çağrısı | İki turda da doğrulandı |
| `./src/pages/Portfolio/hooks/usePortfolio.ts` | 314 | `await safeFetchJson(`/api/portfolio/${id}`, { method: 'DELETE' });` | Özel API fetch wrapper çağrısı | İki turda da doğrulandı |
| `./src/services/firebaseClient.ts` | 51 | `const snap = await getDocs(collection(db, 'users'));` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/services/firebaseClient.ts` | 78 | `const snap = await getDocs(collection(db, 'users'));` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/utils/apiClient.ts` | 65 | `const res = await fetch(url, {` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./src/utils/clientErrorLogger.ts` | 60 | `await setDoc(doc(db, 'errorLogs', logId), errorPayload);` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./src/utils/clientErrorLogger.ts` | 67 | `fetch('/api/public-log-error', {` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./test-admin-db.ts` | 5 | `await adminDb.collection('auditLogs').add({` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./test-admin-raw.ts` | 6 | `const snap = await adminDb.collection('adminConfig').doc('subscriptionPlans').get();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./test-admin-raw.ts` | 14 | `await adminDb.collection('auditLogs').add({ test: 1 });` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./test-admin-read.ts` | 9 | `const snap = await db.collection('roles').get();` | Firestore İstemci DB İşlemi | İki turda da doğrulandı |
| `./test-admin-rules.sh` | 17 | `await setDoc(doc(m.serverDb, 'users', '$USER_UID'), { role: 'admin' }, { merge: true });` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./test-auth-rules.js` | 23 | `await adminDb.collection("users").doc(standardUid).set({ role: "standard_user", email: "test@example.com" });` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./test-auth-rules.js` | 31 | `const docSnap = await getDoc(doc(clientDb, "users", standardUid));` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./test-auth-rules.js` | 37 | `await setDoc(doc(clientDb, "users", standardUid), { updatedByClient: true }, { merge: true });` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./test-auth-rules.js` | 43 | `await getDoc(doc(clientDb, "users", "some_other_uid"));` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./test-auth-rules.js` | 49 | `await setDoc(doc(clientDb, "adminConfig", "general"), { foo: "bar" }, { merge: true });` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./test-auth-rules.js` | 55 | `await adminDb.collection("users").doc(adminUid).set({ role: "admin", email: "admin@example.com" });` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./test-auth-rules.js` | 63 | `await getDoc(doc(clientDb, "adminConfig", "general"));` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./test-auth-rules.js` | 69 | `await setDoc(doc(clientDb, "adminConfig", "test_rule"), { success: true });` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./test-auth-rules.js` | 74 | `await adminDb.collection("users").doc(standardUid).delete();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./test-auth-rules.js` | 75 | `await adminDb.collection("users").doc(adminUid).delete();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./test-auth-rules.js` | 76 | `await adminDb.collection("adminConfig").doc("test_rule").delete();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./test-e2e-integrity.ts` | 22 | `await adminDb.collection('data_integrity_audit').doc(testDocId).set({` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./test-e2e-integrity.ts` | 31 | `const getRes = await fetch(`${baseUrl}/api/admin/integrity/review-queue`);` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./test-e2e-integrity.ts` | 44 | `const postRes = await fetch(`${baseUrl}/api/admin/integrity/review-queue/${testDocId}/decision`, {` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./test-e2e-integrity.ts` | 57 | `const updatedDoc = await adminDb.collection('data_integrity_audit').doc(testDocId).get();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./test-e2e-integrity.ts` | 73 | `await adminDb.collection('data_integrity_audit').doc(testDocId).delete().catch(() => {});` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./test-errors.ts` | 3 | `const snapshot = await adminDb.collection('errorLogs').orderBy('timestamp', 'desc').limit(5).get();` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./test-fetch.js` | 1 | `fetch('http://example.com', { timeout: 35000 }).then(() => console.log('ok')).catch(console.error);` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./test-firestore-rules.js` | 14 | `await getDoc(doc(db, "adminConfig", "general"));` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./test-firestore-rules.js` | 25 | `await setDoc(doc(db, "adminConfig", "test"), { foo: "bar" });` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./test-firestore-rules.js` | 32 | `await addDoc(collection(db, "auditLogs"), { action: "test" });` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./test-firestore-rules.js` | 39 | `await getDoc(doc(db, "users", "some_other_uid"));` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./test-firestore-rules.js` | 46 | `await setDoc(doc(db, "users", auth.currentUser.uid), { test: "data" });` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./test-firestore-rules.js` | 53 | `await getDoc(doc(db, "users", auth.currentUser.uid));` | Firestore Veri Okuma/Yazma | İki turda da doğrulandı |
| `./test-mod1-scenarios.ts` | 7 | `const originalGet = adminDb.collection('adminConfig').doc('subscriptionPlans').get;` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./test-mod1-scenarios.ts` | 8 | `adminDb.collection('adminConfig').doc('subscriptionPlans').get = async () => {` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./test-mod1-scenarios.ts` | 24 | `adminDb.collection('adminConfig').doc('subscriptionPlans').get = originalGet;` | Firestore Admin DB İşlemi | İki turda da doğrulandı |
| `./test-mod3-health-runner.ts` | 20 | `const req = http.get(`http://127.0.0.1:${port}/api/health`, (res) => {` | HTTP İsteği (Node.js http/https) | İki turda da doğrulandı |
| `./test-trick.cjs` | 25 | `var import_yahoo_finance2 = __toESM(require("yahoo-finance2"), 1);` | Yahoo Finance API Paketi | İki turda da doğrulandı |
| `./test-trick.cjs` | 28 | `yf.quote("AAPL").then((res) => console.log(res.regularMarketPrice)).catch(console.error);` | Yahoo Finance API Çağrısı | İki turda da doğrulandı |
| `./test-trick.ts` | 4 | `yf.quote("AAPL").then(res => console.log(res.regularMarketPrice)).catch(console.error);` | Yahoo Finance API Çağrısı | İki turda da doğrulandı |
| `./test-tsx.cjs` | 25 | `var import_yahoo_finance2 = __toESM(require("yahoo-finance2"), 1);` | Yahoo Finance API Paketi | İki turda da doğrulandı |
| `./test-worker-health-monitor.ts` | 18 | `const res = await fetch('http://127.0.0.1:3000/api/health');` | HTTP İsteği (fetch API) | İki turda da doğrulandı |
| `./test-yf.cjs` | 1 | `const yf = require("yahoo-finance2").default;` | Yahoo Finance API Paketi | İki turda da doğrulandı |
| `./test-yf.cjs` | 2 | `yf.quote("AAPL").then(res => console.log(res.regularMarketPrice)).catch(console.error);` | Yahoo Finance API Çağrısı | İki turda da doğrulandı |
| `./test-yf2.cjs` | 1 | `const { YahooFinance } = require("yahoo-finance2");` | Yahoo Finance API Paketi | İki turda da doğrulandı |
| `./test-yf2.cjs` | 3 | `yf.quote("AAPL").then(res => console.log(res.regularMarketPrice)).catch(console.error);` | Yahoo Finance API Çağrısı | İki turda da doğrulandı |
| `./test-yf3.cjs` | 1 | `const yfClass = require("yahoo-finance2").default;` | Yahoo Finance API Paketi | İki turda da doğrulandı |
| `./test-yf3.cjs` | 3 | `yf.quote("AAPL").then(res => console.log(res.regularMarketPrice)).catch(console.error);` | Yahoo Finance API Çağrısı | İki turda da doğrulandı |
| `./test-yf4.cjs` | 1 | `const yfClass = require("yahoo-finance2").default;` | Yahoo Finance API Paketi | İki turda da doğrulandı |
