# TÜR 1 BULGULARI (API OLANLAR)

### ./app/applet/FAZ5_SECURITY_PROOF.md
- Satır 13: `208:     await adminDb.collection('adminConfig').doc('aiSettings').set(updated, { merge: true });...` -> Firebase Admin DB çağrısı
- Satır 23: `143:     await adminDb.collection('users').doc(uid).set({...` -> Firebase Admin DB çağrısı
- Satır 35: `231:     await adminDb.collection('users').doc(uid).set({ usage: cleanUsage }, { merge: true }).catc...` -> Firebase Admin DB çağrısı

### ./app/applet/FAZ6_MODUL4_EVIDENCE.md
- Satır 142: `const res = await fetch(url, {...` -> fetch çağrısı

### ./bootstrap_roles.cjs
- Satır 7: `const adminDb = db.collection ? db : admin.firestore(admin.app(), DB_ID);...` -> Firestore db referansı
- Satır 9: `await adminDb.collection('roles').doc('admin').set({...` -> Firebase Admin DB çağrısı
- Satır 14: `await adminDb.collection('roles').doc('standard_user').set({...` -> Firebase Admin DB çağrısı
- Satır 19: `await adminDb.collection('roles').doc('premium_user').set({...` -> Firebase Admin DB çağrısı

### ./bootstrap_roles.ts
- Satır 8: `await db.collection('roles').doc('admin').set({...` -> Firestore collection
- Satır 13: `await db.collection('roles').doc('standard_user').set({...` -> Firestore collection
- Satır 18: `await db.collection('roles').doc('premium_user').set({...` -> Firestore collection

### ./FAZ5_SECURITY_PROOF.md
- Satır 24: `30:     const snap = await adminDb.collection('users').doc(uid).get();...` -> Firebase Admin DB çağrısı
- Satır 38: `68:     const planDocRef = adminDb.collection('adminConfig').doc('subscriptionPlans');...` -> Firebase Admin DB çağrısı
- Satır 54: `166:     const snap = await adminDb.collection('adminConfig').doc('aiSettings').get();...` -> Firebase Admin DB çağrısı

### ./get_atr.ts
- Satır 9: `const res = await fetch(url);...` -> fetch çağrısı

### ./get-errors.ts
- Satır 3: `const snap = await adminDb.collection('errorLogs').orderBy('timestamp', 'desc').limit(5).get();...` -> Firebase Admin DB çağrısı

### ./package.json
- Satır 42: `"yahoo-finance2": "^4.0.2"...` -> Yahoo Finance modül kullanımı

### ./patch2.cjs
- Satır 6: `fetch('/api/health?error=' + encodeURIComponent(e.message));...` -> fetch çağrısı
- Satır 9: `fetch('/api/health?error=' + encodeURIComponent(e.reason ? e.reason.stack || e.reason : 'unknown'));...` -> fetch çağrısı

### ./patch_admin_audit.cjs
- Satır 20: `const q = query(collection(db, 'audit_logs'), orderBy('timestamp', 'desc'), limit(50));...` -> Firestore collection
- Satır 21: `const logsSnap = await getDocs(q);...` -> Firestore getDocs

### ./patch_admin_auth.cjs
- Satır 20: `const userRef = doc(serverDb, 'users', uid);...` -> Firestore doc referansı
- Satır 23: `const snapPromise = getDoc(userRef);...` -> Firestore getDoc
- Satır 44: `const res = await fetch(url, {...` -> fetch çağrısı
- Satır 75: `const roleRef = doc(serverDb, 'roles', roleName);...` -> Firestore doc referansı
- Satır 76: `const snapPromise = getDoc(roleRef);...` -> Firestore getDoc

### ./patch_admin_service.cjs
- Satır 18: `const snap = await adminDb.collection('users').doc(uid).get();...` -> Firebase Admin DB çağrısı
- Satır 42: `const snap = await adminDb.collection('roles').doc(roleName).get();...` -> Firebase Admin DB çağrısı

### ./patch_admin_settings.cjs
- Satır 5: `"collection(db, 'settings')",...` -> Firestore collection
- Satır 6: `"collection(db, 'platform_settings')"...` -> Firestore collection
- Satır 10: `"doc(db, 'settings', 'brand')",...` -> Firestore doc referansı
- Satır 11: `"doc(db, 'platform_settings', 'brand')"...` -> Firestore doc referansı

### ./patch_app.cjs
- Satır 9: `const { data, ok } = await safeFetchJson<{ opportunities: OpportunitySignal[] }>(\`/api/ai/opportuni...` -> Özel API fetch wrapper'ı
- Satır 20: `text = text.replace(/  const fetchOpportunities = useCallback\(async \(cat: MarketCategory = selecte...` -> Özel API fetch wrapper'ı

### ./patch_app_modelconfig.cjs
- Satır 18: `getDoc(doc(db, 'user_preferences', user.uid)).then(snap => {...` -> Firestore getDoc
- Satır 36: `setDoc(doc(db, 'user_preferences', user.uid), { modelConfig: newConfig }, { merge: true });...` -> Firestore setDoc

### ./patch_app_radar.sh
- Satır 2: `sed -i -e 's/const res = await fetch(\`\/api\/ai\/opportunities?category=${cat}\`);/const scopeParam...` -> fetch çağrısı

### ./patch_app_watchlist_sync.cjs
- Satır 23: `setDoc(doc(db, 'user_watchlists', user.uid), { items: watchlist }, { merge: true });...` -> Firestore setDoc
- Satır 32: `getDoc(doc(db, 'user_watchlists', user.uid)).then(snap => {...` -> Firestore getDoc

### ./patch_auth_google.cjs
- Satır 23: `await setDoc(doc(db, 'users', user.uid), {...` -> Firestore setDoc

### ./patch_auth_middleware.cjs
- Satır 11: `const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();...` -> Firebase Admin DB çağrısı
- Satır 24: `const res = await fetch(url, { headers: { Authorization: \`Bearer \${idToken}\` } });...` -> fetch çağrısı
- Satır 47: `const roleDoc = await adminDb.collection('roles').doc(req.userRole).get();...` -> Firebase Admin DB çağrısı
- Satır 65: `const res = await fetch(url, { headers: { Authorization: \`Bearer \${req.idToken}\` } });...` -> fetch çağrısı

### ./patch_auth_permissions.cjs
- Satır 10: `"const userSnap = await getDoc(userRef);\n        if (userSnap.exists()) {",...` -> Firestore getDoc
- Satır 11: ``const userSnap = await getDoc(userRef);...` -> Firestore getDoc
- Satır 15: `const roleSnap = await getDoc(doc(db, 'roles', ud.role));...` -> Firestore getDoc

### ./patch_auth_portfolio.cjs
- Satır 22: `"collection(db, `user_portfolios/${auth.currentUser.uid}/portfolios`)",...` -> Firestore collection
- Satır 23: `"collection(db, `users/${user?.uid}/portfolios`)"...` -> Firestore collection

### ./patch_bot.cjs
- Satır 11: ``    const tokenDoc = await adminDb.collection('telegramTokens').doc(token).get();...` -> Firebase Admin DB çağrısı
- Satır 18: `await adminDb.collection('users').doc(uid).set({...` -> Firebase Admin DB çağrısı
- Satır 23: `await adminDb.collection('telegramTokens').doc(token).delete();`,...` -> Firebase Admin DB çağrısı
- Satır 24: ``    const tokenRef = doc(serverDb, 'telegramTokens', token);...` -> Firestore doc referansı
- Satır 25: `const tokenDoc = await getDoc(tokenRef);...` -> Firestore getDoc
- Satır 32: `await setDoc(doc(serverDb, 'users', uid), {...` -> Firestore setDoc
- Satır 41: ``    const snap = await adminDb.collection('users').where('telegramChatId', '==', chatId.toString())...` -> Firebase Admin DB çağrısı
- Satır 44: ``    const q = query(collection(serverDb, 'users'), where('telegramChatId', '==', chatId.toString())...` -> Firestore collection
- Satır 45: `const snap = await getDocs(q);...` -> Firestore getDocs
- Satır 52: ``      const userDoc = await adminDb.collection('users').doc(uid).get();...` -> Firebase Admin DB çağrısı
- Satır 54: ``      const userDoc = await getDoc(doc(serverDb, 'users', uid));...` -> Firestore getDoc
- Satır 60: ``    await adminDb.collection('users').doc(uid).set({ telegramNotificationsEnabled: false }, { merge...` -> Firebase Admin DB çağrısı
- Satır 61: ``    await setDoc(doc(serverDb, 'users', uid), { telegramNotificationsEnabled: false }, { merge: tru...` -> Firestore setDoc
- Satır 66: ``    await adminDb.collection('users').doc(uid).set({ telegramNotificationsEnabled: true }, { merge:...` -> Firebase Admin DB çağrısı
- Satır 67: ``    await setDoc(doc(serverDb, 'users', uid), { telegramNotificationsEnabled: true }, { merge: true...` -> Firestore setDoc

### ./patch_chat2.cjs
- Satır 36: `getDoc(doc(db, 'users', user.uid, 'chatHistories', 'default')).then(snap => {...` -> Firestore getDoc
- Satır 66: `setDoc(doc(db, 'users', user.uid, 'chatHistories', 'default'), { messages }, { merge: true }).catch(...` -> Firestore setDoc

### ./patch_chat_persistence.cjs
- Satır 7: `"import { safeFetchJson } from '../utils/apiClient';",...` -> Özel API fetch wrapper'ı
- Satır 8: `"import { safeFetchJson } from '../utils/apiClient';\nimport { useAuth } from '../contexts/AuthConte...` -> Özel API fetch wrapper'ı
- Satır 41: `getDoc(doc(db, 'user_chat_histories', user.uid)).then(snap => {...` -> Firestore getDoc
- Satır 72: `setDoc(doc(db, 'user_chat_histories', user.uid), { messages }, { merge: true }).catch(e => {...` -> Firestore setDoc

### ./patch_digest.cjs
- Satır 10: ``    const usersSnap = await adminDb.collection('users')...` -> Firebase Admin DB çağrısı
- Satır 13: ``    const q = query(collection(serverDb, 'users'), where('telegramChatId', '!=', null));...` -> Firestore collection
- Satır 14: `const usersSnap = await getDocs(q);`...` -> Firestore getDocs

### ./patch_header_search.sh
- Satır 13: `fetch(`/api/market/search?q=${searchQuery.trim()}`)\...` -> fetch çağrısı

### ./patch_modal_news.sh
- Satır 6: `fetch(`/api/market/news?search=${analysis.symbol}`)\...` -> fetch çağrısı

### ./patch_news.sh
- Satır 6: `const yahooFinance = require("yahoo-finance2").default;\...` -> Yahoo Finance modül kullanımı

### ./patch_orchestrator2.cjs
- Satır 11: `collection(serverDb, 'users'),...` -> Firestore collection
- Satır 15: `const usersSnap = await getDocs(q);...` -> Firestore getDocs

### ./patch_orchestrator.cjs
- Satır 10: `const usersSnap = await adminDb.collection('users')...` -> Firebase Admin DB çağrısı

### ./patch_paths.cjs
- Satır 7: `"doc(db, 'users', user.uid, 'watchlist', user.uid)",...` -> Firestore doc referansı
- Satır 8: `"doc(db, 'users', user.uid, 'watchlist', 'default')"...` -> Firestore doc referansı
- Satır 12: `"doc(db, 'users', user.uid, 'preferences', user.uid)",...` -> Firestore doc referansı
- Satır 13: `"doc(db, 'users', user.uid, 'preferences', 'default')"...` -> Firestore doc referansı
- Satır 21: `"doc(db, 'users', user.uid, 'chatHistories', user.uid)",...` -> Firestore doc referansı
- Satır 22: `"doc(db, 'users', user.uid, 'chatHistories', 'default')"...` -> Firestore doc referansı

### ./patch_paths_fixed.cjs
- Satır 5: `appText = appText.replace(/doc\(db,\s*'users',\s*user\.uid,\s*'preferences',\s*user\.uid\)/g, "doc(d...` -> Firestore doc referansı
- Satır 6: `appText = appText.replace(/doc\(db,\s*'users',\s*user\.uid,\s*'watchlist',\s*user\.uid\)/g, "doc(db,...` -> Firestore doc referansı
- Satır 7: `appText = appText.replace(/doc\(db,\s*'user_preferences',\s*user\.uid\)/g, "doc(db, 'users', user.ui...` -> Firestore doc referansı
- Satır 8: `appText = appText.replace(/doc\(db,\s*'user_watchlists',\s*user\.uid\)/g, "doc(db, 'users', user.uid...` -> Firestore doc referansı
- Satır 14: `chatText = chatText.replace(/doc\(db,\s*'users',\s*user\.uid,\s*'chatHistories',\s*user\.uid\)/g, "d...` -> Firestore doc referansı
- Satır 15: `chatText = chatText.replace(/doc\(db,\s*'user_chat_histories',\s*user\.uid\)/g, "doc(db, 'users', us...` -> Firestore doc referansı

### ./patch_routers.cjs
- Satır 11: `"await adminDb.collection('upgrade_requests').add(requestRecord);");...` -> Firebase Admin DB çağrısı
- Satır 15: `"await adminDb.collection('users').get();");...` -> Firebase Admin DB çağrısı
- Satır 31: `"await adminDb.collection('users').get();");...` -> Firebase Admin DB çağrısı
- Satır 35: `"await adminDb.collection('users').doc(targetUid).set({ role: newRole, updatedAt: new Date().toISOSt...` -> Firebase Admin DB çağrısı
- Satır 39: `"await adminDb.collection('users').doc(targetUid).set({ isBanned, banReason: reason || '', updatedAt...` -> Firebase Admin DB çağrısı

### ./patch-server.cjs
- Satır 12: `/const YahooFinance = require\("yahoo-finance2"\)\.default;\s*const yf = new YahooFinance\(\{ suppre...` -> Yahoo Finance modül kullanımı
- Satır 17: `/const YahooFinance = require\("yahoo-finance2"\)\.default;\s*const yf = new YahooFinance\(\{ suppre...` -> Yahoo Finance modül kullanımı

### ./patch_server.cjs
- Satır 10: ``    await adminDb.collection('telegramTokens').doc(token).set({...` -> Firebase Admin DB çağrısı
- Satır 15: ``    await setDoc(doc(serverDb, 'telegramTokens', token), {...` -> Firestore setDoc
- Satır 23: ``    await adminDb.collection('users').doc(uid).set({...` -> Firebase Admin DB çağrısı
- Satır 27: ``    await setDoc(doc(serverDb, 'users', uid), {...` -> Firestore setDoc

### ./patch_server_search.sh
- Satır 7: `const yahooFinance = require("yahoo-finance2").default;\...` -> Yahoo Finance modül kullanımı

### ./patch_server_telegram.cjs
- Satır 19: `await adminDb.collection('telegramTokens').doc(token).set({...` -> Firebase Admin DB çağrısı
- Satır 37: `await adminDb.collection('users').doc(uid).set({...` -> Firebase Admin DB çağrısı

### ./patch-service.cjs
- Satır 6: `/const YahooFinance = require\("yahoo-finance2"\)\.default;\s*const yf = new YahooFinance\(\{ suppre...` -> Yahoo Finance modül kullanımı

### ./patch_settings_tab.cjs
- Satır 31: `await fetch('/api/telegram/unlink', {...` -> fetch çağrısı
- Satır 51: `const res = await fetch('/api/telegram/link-token', {...` -> fetch çağrısı

### ./patch_sub_service.cjs
- Satır 41: `const snap = await adminDb.collection('users').doc(uid).get();...` -> Firebase Admin DB çağrısı
- Satır 110: `await adminDb.collection('users').doc(uid).set({...` -> Firebase Admin DB çağrısı
- Satır 146: `"adminDb.collection('users').doc(uid).set({ usage: newUsage }, { merge: true }).catch(err => console...` -> Firebase Admin DB çağrısı
- Satır 150: `"await adminDb.collection('users').doc(uid).set({ usage: cleanUsage }, { merge: true }).catch(err =>...` -> Firebase Admin DB çağrısı

### ./patch_telegram.cjs
- Satır 16: `const response = await fetch(\`https://api.telegram.org/bot\${botToken}/sendMessage\`, {...` -> fetch çağrısı

### ./patch_useportfolio.cjs
- Satır 5: `"import { safeFetchJson } from '../../../utils/apiClient';",...` -> Özel API fetch wrapper'ı
- Satır 6: `"import { safeFetchJson } from '../../../utils/apiClient';\nimport { collection, doc, getDocs, setDo...` -> Özel API fetch wrapper'ı
- Satır 13: `const { data, ok } = await safeFetchJson<{ success: boolean; portfolios: PortfolioItem[] }>('/api/po...` -> Özel API fetch wrapper'ı
- Satır 29: `const snapshot = await getDocs(collection(db, \`user_portfolios/\${auth.currentUser.uid}/portfolios\...` -> Firestore getDocs
- Satır 43: `const { data: pData } = await safeFetchJson<{ success: boolean; portfolio: PortfolioItem }>(\`/api/p...` -> Özel API fetch wrapper'ı
- Satır 49: `const { data: perfData } = await safeFetchJson<{...` -> Özel API fetch wrapper'ı
- Satır 64: `const { data: riskData } = await safeFetchJson<{...` -> Özel API fetch wrapper'ı
- Satır 73: `const { data: alertData } = await safeFetchJson<{...` -> Özel API fetch wrapper'ı
- Satır 91: `const { data: perfData } = await safeFetchJson<{...` -> Özel API fetch wrapper'ı
- Satır 110: `const { data: riskData } = await safeFetchJson<{...` -> Özel API fetch wrapper'ı
- Satır 128: `const response = await fetch('/api/portfolio', {...` -> fetch çağrısı
- Satır 165: `await setDoc(doc(db, \`user_portfolios/\${auth.currentUser.uid}/portfolios/\${newId}\`), newPortfoli...` -> Firestore setDoc
- Satır 177: `const addHoldingOriginal = `      const response = await fetch(\`/api/portfolio/\${selectedPortfolio...` -> fetch çağrısı
- Satır 188: `await setDoc(doc(db, \`user_portfolios/\${auth.currentUser.uid}/portfolios/\${selectedPortfolio.id}\...` -> Firestore setDoc
- Satır 194: `const removeHoldingOriginal = `      const response = await fetch(\`/api/portfolio/\${selectedPortfo...` -> fetch çağrısı
- Satır 205: `await setDoc(doc(db, \`user_portfolios/\${auth.currentUser.uid}/portfolios/\${selectedPortfolio.id}\...` -> Firestore setDoc
- Satır 214: `const response = await fetch(\`/api/portfolio/\${id}\`, { method: 'DELETE' });...` -> fetch çağrısı
- Satır 235: `await deleteDoc(doc(db, \`user_portfolios/\${auth.currentUser.uid}/portfolios/\${id}\`));...` -> Firestore doc referansı

### ./patch_yahoo.cjs
- Satır 51: `return await withBackoff(() => yf.quote(ticker));...` -> Yahoo Finance (yf) çağrısı
- Satır 72: `'const quote = await withBackoff(() => yf.quote(asset.yahooTicker)) as any;',...` -> Yahoo Finance (yf) çağrısı
- Satır 78: `'const quote = await yf.quote(upper).catch(() => null) as any;',...` -> Yahoo Finance (yf) çağrısı

### ./rewrite_academy.cjs
- Satır 77: `fetch('/api/academy/topics')...` -> fetch çağrısı

### ./run_v6.1_backtest.ts
- Satır 32: `const res = await fetch(url);...` -> fetch çağrısı

### ./run_v6.3_backtest.ts
- Satır 31: `const res = await fetch(url);...` -> fetch çağrısı

### ./run_v6.4_backtest.ts
- Satır 27: `const res = await fetch(url);...` -> fetch çağrısı

### ./run_v6.5_backtest.ts
- Satır 28: `const res = await fetch(url);...` -> fetch çağrısı

### ./scripts/runProtocolAudit.ts
- Satır 56: `directQuote = await yf.quote(`${sym}.IS`);...` -> Yahoo Finance (yf) çağrısı
- Satır 84: `const res = await fetch(`${baseURL}/${sym}/${ep}`);...` -> fetch çağrısı

### ./seed-admin.ts
- Satır 37: `await setDoc(doc(db, 'users', user.uid), {...` -> Firestore setDoc
- Satır 46: `await setDoc(doc(db, 'roles', 'admin'), { description: 'Tam yetkili yönetici', permissions: ['admin....` -> Firestore setDoc
- Satır 47: `await setDoc(doc(db, 'roles', 'standard_user'), { description: 'Standart kullanıcı', permissions: ['...` -> Firestore setDoc
- Satır 48: `await setDoc(doc(db, 'roles', 'premium_user'), { description: 'Premium abone', permissions: ['academ...` -> Firestore setDoc

### ./server/aiService.ts
- Satır 9: `const apiKey = process.env.GEMINI_API_KEY;...` -> Çevresel değişkenden API key okunması
- Satır 120: `const response = await fetch(`${ollamaUrl}/api/generate`, {...` -> fetch çağrısı
- Satır 150: `if (process.env.GEMINI_API_KEY) {...` -> Çevresel değişkenden API key okunması
- Satır 181: `const response = await fetch(`${baseUrl}/chat/completions`, {...` -> fetch çağrısı
- Satır 286: `if (!process.env.GEMINI_API_KEY) {...` -> Çevresel değişkenden API key okunması

### ./server/backtest/runFullMultiYearBacktest.ts
- Satır 51: `const res = await fetch(url);...` -> fetch çağrısı

### ./server/indicator_fetchers/FrankfurterFetcher.ts
- Satır 22: `const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=TRY,EUR', {...` -> fetch çağrısı

### ./server/indicator_fetchers/timeSeriesService.ts
- Satır 366: `const noise = Math.sin(progress * 10) * (liveValue * 0.05);...` -> Simüle/sahte veri üretimi (Math.sin)

### ./server/intelligence/orchestratorAgent.ts
- Satır 306: `const fetchPromise = adminDb.collection('users').where('telegramChatId', '!=', null).get();...` -> Firebase Admin DB çağrısı

### ./server/intelligence/scheduledDigest.ts
- Satır 15: `const fetchPromise = adminDb.collection('users').where('telegramChatId', '!=', null).get();...` -> Firebase Admin DB çağrısı

### ./server/intelligence/technicalAgent.ts
- Satır 302: `const wave = Math.sin((i + seed) * 0.18) * (currentPrice * 0.015);...` -> Simüle/sahte veri üretimi (Math.sin)

### ./server/intelligence/telegramBot.ts
- Satır 18: `const tokenRef = adminDb.collection('telegramTokens').doc(token);...` -> Firebase Admin DB çağrısı
- Satır 34: `await adminDb.collection('users').doc(uid).set({...` -> Firebase Admin DB çağrısı
- Satır 51: `const snap = await adminDb.collection('users').where('telegramChatId', '==', chatId.toString()).limi...` -> Firebase Admin DB çağrısı
- Satır 125: `const userDoc = await adminDb.collection('users').doc(uid).get();...` -> Firebase Admin DB çağrısı
- Satır 139: `await adminDb.collection('users').doc(uid).set({ telegramNotificationsEnabled: false }, { merge: tru...` -> Firebase Admin DB çağrısı
- Satır 147: `await adminDb.collection('users').doc(uid).set({ telegramNotificationsEnabled: true }, { merge: true...` -> Firebase Admin DB çağrısı

### ./server/intelligence/telegramService.ts
- Satır 202: `const res = await fetch(url, {...` -> fetch çağrısı

### ./server/migrations/migrateIpoDeepAnalysis.ts
- Satır 58: `const snap = await adminDb.collection('ipoListings').get();...` -> Firebase Admin DB çağrısı
- Satır 74: `await adminDb.collection('ipoListings').doc(docSnap.id).set(enriched, { merge: true }).catch((err) =...` -> Firebase Admin DB çağrısı

### ./server/portfolio/portfolioAI.ts
- Satır 176: `p += (Math.sin(i * 0.5) * 0.015 * basePrice) + (0.003 * basePrice);...` -> Simüle/sahte veri üretimi (Math.sin)

### ./server/routes/adminIntegrityRouter.ts
- Satır 13: `const snapshot = await adminDb.collection('data_integrity_audit')...` -> Firebase Admin DB çağrısı
- Satır 52: `await adminDb.collection('data_integrity_audit').doc(req.params.id).set(updates, { merge: true });...` -> Firebase Admin DB çağrısı

### ./server/routes/adminRouter.ts
- Satır 152: `const snap = await adminDb.collection('users').get();...` -> Firebase Admin DB çağrısı
- Satır 197: `await adminDb.collection('users').doc(u.uid).set(u, { merge: true });...` -> Firebase Admin DB çağrısı
- Satır 295: `const userDoc = await adminDb.collection('users').doc(targetUid).get();...` -> Firebase Admin DB çağrısı
- Satır 311: `await adminDb.collection('users').doc(targetUid).set({ role: newRole, updatedAt: new Date().toISOStr...` -> Firebase Admin DB çağrısı
- Satır 352: `await adminDb.collection('users').doc(targetUid).set({ isActive, updatedAt: new Date().toISOString()...` -> Firebase Admin DB çağrısı
- Satır 469: `await adminDb.collection('users').doc(uid).set(newUser, { merge: true });...` -> Firebase Admin DB çağrısı
- Satır 506: `const snap = await adminDb.collection('users').get();...` -> Firebase Admin DB çağrısı

### ./server/routes/subscriptionRouter.ts
- Satır 92: `await adminDb.collection('upgrade_requests').add(requestRecord);...` -> Firebase Admin DB çağrısı
- Satır 177: `const snap = await adminDb.collection('users').get();...` -> Firebase Admin DB çağrısı
- Satır 228: `await adminDb.collection('users').doc(u.uid).set(u, { merge: true });...` -> Firebase Admin DB çağrısı

### ./server/services/adminConfigService.ts
- Satır 68: `const planDocRef = adminDb.collection('adminConfig').doc('subscriptionPlans');...` -> Firebase Admin DB çağrısı
- Satır 73: `return await defaultDb.collection('adminConfig').doc('subscriptionPlans').get();...` -> Firestore collection
- Satır 95: `await adminDb.collection('adminConfig').doc('subscriptionPlans').set({...` -> Firebase Admin DB çağrısı
- Satır 119: `await adminDb.collection('adminConfig').doc('subscriptionPlans').set({...` -> Firebase Admin DB çağrısı
- Satır 167: `const snap = await adminDb.collection('adminConfig').doc('aiSettings').get().catch(async () => {...` -> Firebase Admin DB çağrısı
- Satır 171: `return await defaultDb.collection('adminConfig').doc('aiSettings').get();...` -> Firestore collection
- Satır 189: `await adminDb.collection('adminConfig').doc('aiSettings').set(cachedAiSettings, { merge: true }).cat...` -> Firebase Admin DB çağrısı
- Satır 215: `await adminDb.collection('adminConfig').doc('aiSettings').set(updated, { merge: true });...` -> Firebase Admin DB çağrısı

### ./server/services/apiQuotaService.ts
- Satır 123: `status: process.env.GEMINI_API_KEY ? 'active' : 'warning',...` -> Çevresel değişkenden API key okunması
- Satır 188: `endpointSample: 'firestore.collection("user_watchlists").doc(uid)'...` -> Firestore collection

### ./server/services/auditService.ts
- Satır 67: `await adminDb.collection('auditLogs').doc(logId).set(entry);...` -> Firebase Admin DB çağrısı
- Satır 143: `.collection('errorLogs')...` -> Firestore collection
- Satır 144: `.doc(logId)...` -> Firestore doc referansı
- Satır 180: `await adminDb.collection('errorLogs').doc(logId).set(entry);...` -> Firebase Admin DB çağrısı
- Satır 190: `const snap = await adminDb.collection('auditLogs').orderBy('timestamp', 'desc').limit(limitCount).ge...` -> Firebase Admin DB çağrısı
- Satır 226: `await adminDb.collection('auditLogs').doc(sampleLog.id!).set(sampleLog);...` -> Firebase Admin DB çağrısı
- Satır 239: `const snap = await adminDb.collection('errorLogs').orderBy('timestamp', 'desc').limit(limitCount).ge...` -> Firebase Admin DB çağrısı
- Satır 274: `await adminDb.collection('errorLogs').doc(sampleErr.id!).set(sampleErr);...` -> Firebase Admin DB çağrısı
- Satır 288: `const snap = await adminDb.collection('auditLogs').get();...` -> Firebase Admin DB çağrısı
- Satır 290: `const batch = adminDb.batch();...` -> Firebase Admin DB çağrısı
- Satır 304: `const snap = await adminDb.collection('errorLogs').get();...` -> Firebase Admin DB çağrısı
- Satır 306: `const batch = adminDb.batch();...` -> Firebase Admin DB çağrısı

### ./server/services/dataIntegrityService.ts
- Satır 65: `adminDb.collection('data_integrity_audit').add(entry).catch((err) => {...` -> Firebase Admin DB çağrısı

### ./server/services/dbIntegrationService.ts
- Satır 113: `const docRef = adminDb.collection('adminConfig').doc('databaseIntegration');...` -> Firebase Admin DB çağrısı
- Satır 182: `await adminDb.collection('adminConfig').doc('databaseIntegration').set(updated, { merge: true });...` -> Firebase Admin DB çağrısı
- Satır 336: `const collections = await adminDb.listCollections();...` -> Firebase Admin DB çağrısı
- Satır 346: `const userSnap = await adminDb.collection('users').limit(20).get();...` -> Firebase Admin DB çağrısı

### ./server/services/firebaseAdminService.ts
- Satır 55: `const snap = await safeAdminGet(db => db.collection('users').doc(uid).get());...` -> Firestore collection
- Satır 86: `const snap = await safeAdminGet(db => db.collection('roles').doc(roleName).get());...` -> Firestore collection

### ./server/services/ipoDataService.ts
- Satır 759: `const snapPromise = adminDb.collection('ipoListings').get();...` -> Firebase Admin DB çağrısı
- Satır 948: `await adminDb.collection('ipoListings').doc(id).set(updated, { merge: true });...` -> Firebase Admin DB çağrısı
- Satır 992: `await adminDb.collection('ipoListings').doc(id).delete();...` -> Firebase Admin DB çağrısı
- Satır 1033: `const response = await fetch('https://www.kap.org.tr/tr/api/disclosures', {...` -> fetch çağrısı

### ./server/services/notificationService.ts
- Satır 60: `const response = await fetch(url, {...` -> fetch çağrısı

### ./server/services/subscriptionService.ts
- Satır 91: `const snap = await adminDb.collection('users').doc(uid).get().catch(async () => {...` -> Firebase Admin DB çağrısı
- Satır 96: `return await defaultDb.collection('users').doc(uid).get();...` -> Firestore collection
- Satır 184: `await adminDb.collection('users').doc(uid).set({...` -> Firebase Admin DB çağrısı
- Satır 237: `adminDb.collection('users').doc(uid).set({ usage: newUsage }, { merge: true }).catch(err => {...` -> Firebase Admin DB çağrısı
- Satır 260: `adminDb.collection('users').doc(uid).set({ usage: newUsage }, { merge: true }).catch(err => {...` -> Firebase Admin DB çağrısı
- Satır 283: `await adminDb.collection('users').doc(uid).set({ usage: cleanUsage }, { merge: true }).catch(err => ...` -> Firebase Admin DB çağrısı

### ./server.ts
- Satır 594: `const pingRes = await fetch(`${url}/api/tags`);...` -> fetch çağrısı
- Satır 616: `const apiKey = process.env.GEMINI_API_KEY;...` -> Çevresel değişkenden API key okunması

### ./server/yahooFinanceService.ts
- Satır 57: `return await withBackoff(() => yf.quote(ticker));...` -> Yahoo Finance (yf) çağrısı
- Satır 237: `const res = await fetch('https://api.binance.com/api/v3/ticker/24hr', {...` -> fetch çağrısı
- Satır 280: `const res = await fetch(url, {...` -> fetch çağrısı

### ./src/App.tsx
- Satır 37: `import { safeFetchJson } from './utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 138: `getDoc(doc(db, 'users', user.uid, 'preferences', 'default')).then(snap => {...` -> Firestore getDoc
- Satır 156: `setDoc(doc(db, 'users', user.uid, 'preferences', 'default'), { modelConfig: newConfig }, { merge: tr...` -> Firestore setDoc
- Satır 194: `setDoc(doc(db, 'users', user.uid, 'watchlist', 'default'), { items: watchlist }, { merge: true });...` -> Firestore setDoc
- Satır 203: `getDoc(doc(db, 'users', user.uid, 'watchlist', 'default')).then(snap => {...` -> Firestore getDoc
- Satır 215: `const { data, ok } = await safeFetchJson<{ quotes: StockQuote[]; total: number }>('/api/market/quote...` -> Özel API fetch wrapper'ı
- Satır 238: `const { data, ok } = await safeFetchJson<{ opportunities: OpportunitySignal[] }>(`/api/ai/opportunit...` -> Özel API fetch wrapper'ı
- Satır 252: `const { data, ok } = await safeFetchJson<{ news: MarketNewsItem[] }>('/api/market/news');...` -> Özel API fetch wrapper'ı
- Satır 291: `const { data, ok } = await safeFetchJson<{ analysis: StockAnalysisDetail }>('/api/ai/analyze-stock',...` -> Özel API fetch wrapper'ı
- Satır 314: `const { data, ok } = await safeFetchJson<{ fund: TefasFundDetail }>(`/api/tefas/detail/${fund.code}`...` -> Özel API fetch wrapper'ı

### ./src/components/admin/AdminAiSettingsTab.tsx
- Satır 16: `import { safeFetchJson } from '../../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 60: `const res = await safeFetchJson<{ success: boolean; error?: string }>('/api/admin/ai-settings', {...` -> Özel API fetch wrapper'ı
- Satır 85: `const res = await safeFetchJson<{ response?: string; text?: string; error?: string }>('/api/chat', {...` -> Özel API fetch wrapper'ı

### ./src/components/admin/AdminApiManagementTab.tsx
- Satır 15: `import { safeFetchJson } from '../../utils/apiClient';...` -> Özel API fetch wrapper'ı

### ./src/components/admin/AdminAuditLogsTab.tsx
- Satır 16: `import { safeFetchJson } from '../../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 40: `const res = await safeFetchJson<{ success: boolean }>('/api/admin/audit-logs', {...` -> Özel API fetch wrapper'ı

### ./src/components/admin/AdminDatabaseIntegrationTab.tsx
- Satır 22: `import { safeFetchJson } from '../../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 142: `const res = await safeFetchJson<{ success: boolean; settings: DatabaseSettings }>('/api/admin/db-set...` -> Özel API fetch wrapper'ı
- Satır 159: `const res = await safeFetchJson<{ success: boolean; settings?: DatabaseSettings; error?: string }>(...` -> Özel API fetch wrapper'ı
- Satır 187: `const res = await safeFetchJson<{...` -> Özel API fetch wrapper'ı
- Satır 238: `const res = await safeFetchJson<{...` -> Özel API fetch wrapper'ı
- Satır 292: `const res = await safeFetchJson<{...` -> Özel API fetch wrapper'ı

### ./src/components/admin/AdminErrorLogsTab.tsx
- Satır 14: `import { safeFetchJson } from '../../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 40: `await safeFetchJson<{ success: boolean }>('/api/admin/error-logs', {...` -> Özel API fetch wrapper'ı
- Satır 46: `const snap = await getDocs(collection(db, 'errorLogs'));...` -> Firestore getDocs

### ./src/components/admin/AdminIpoManagementTab.tsx
- Satır 24: `import { safeFetchJson } from '../../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 42: `const res = await safeFetchJson<{ success: boolean; listings: IPOListing[] }>('/api/ipo/listings?ref...` -> Özel API fetch wrapper'ı
- Satır 61: `const res = await safeFetchJson<{ success: boolean; message: string; newCount: number }>('/api/admin...` -> Özel API fetch wrapper'ı
- Satır 126: `const res = await safeFetchJson<{ success: boolean }>(`/api/admin/ipo/${id}`, {...` -> Özel API fetch wrapper'ı
- Satır 150: `const res = await safeFetchJson<{ success: boolean; ipo: IPOListing }>('/api/admin/ipo/upsert', {...` -> Özel API fetch wrapper'ı

### ./src/components/admin/AdminPlatformTab.tsx
- Satır 33: `const q = query(collection(db, 'users'), limit(1));...` -> Firestore collection
- Satır 34: `await getDocs(q);...` -> Firestore getDocs

### ./src/components/admin/AdminSubscriptionTuningTab.tsx
- Satır 23: `import { safeFetchJson } from '../../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 174: `const res = await safeFetchJson<{ success: boolean; error?: string }>('/api/admin/subscription-plans...` -> Özel API fetch wrapper'ı

### ./src/components/admin/AdminUserManagementTab.tsx
- Satır 18: `import { safeFetchJson } from '../../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 89: `const res = await safeFetchJson<{ success: boolean; user?: any; error?: string }>('/api/admin/create...` -> Özel API fetch wrapper'ı
- Satır 103: `setDoc(doc(db, 'users', res.data.user.uid), {...` -> Firestore setDoc
- Satır 155: `const res = await safeFetchJson<{ success: boolean; error?: string }>('/api/admin/grant-subscription...` -> Özel API fetch wrapper'ı
- Satır 168: `updateDoc(doc(db, 'users', selectedUserForGrant.uid), {...` -> Firestore updateDoc
- Satır 199: `const res = await safeFetchJson<{ success: boolean; error?: string }>('/api/admin/reset-user-usage',...` -> Özel API fetch wrapper'ı
- Satır 229: `const res = await safeFetchJson<{ success: boolean; error?: string }>('/api/admin/toggle-user-status...` -> Özel API fetch wrapper'ı
- Satır 236: `updateDoc(doc(db, 'users', targetUid), { isActive: nextStatus }).catch(() => {});...` -> Firestore updateDoc
- Satır 260: `const res = await safeFetchJson<{ success: boolean; error?: string }>('/api/admin/change-user-role',...` -> Özel API fetch wrapper'ı
- Satır 271: `updateDoc(doc(db, 'users', selectedUserForRole.uid), { role: targetRole }).catch(() => {});...` -> Firestore updateDoc

### ./src/components/AdminPanel.tsx
- Satır 15: `import { safeFetchJson } from '../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 69: `safeFetchJson<{ stats: any }>('/api/admin/system-stats').catch(() => ({ ok: false, data: null })),...` -> Özel API fetch wrapper'ı
- Satır 70: `safeFetchJson<{ plans: any }>('/api/admin/subscription-plans').catch(() => ({ ok: false, data: null ...` -> Özel API fetch wrapper'ı
- Satır 71: `safeFetchJson<{ settings: any }>('/api/admin/ai-settings').catch(() => ({ ok: false, data: null })),...` -> Özel API fetch wrapper'ı
- Satır 72: `safeFetchJson<{ users: any[] }>('/api/admin/users').catch(() => ({ ok: false, data: null })),...` -> Özel API fetch wrapper'ı
- Satır 73: `safeFetchJson<{ logs: any[] }>('/api/admin/audit-logs').catch(() => ({ ok: false, data: null })),...` -> Özel API fetch wrapper'ı
- Satır 74: `safeFetchJson<{ logs: any[] }>('/api/admin/error-logs').catch(() => ({ ok: false, data: null }))...` -> Özel API fetch wrapper'ı
- Satır 84: `const usersSnap = await getDocs(collection(db, 'users'));...` -> Firestore getDocs
- Satır 134: `const errorSnap = await getDocs(collection(db, 'errorLogs'));...` -> Firestore getDocs

### ./src/components/AdminSettingsSection.tsx
- Satır 5: `import { safeFetchJson } from '../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 18: `const settingsSnap = await getDoc(doc(db, 'platform_settings', 'general'));...` -> Firestore getDoc
- Satır 26: `const rolesSnap = await getDocs(collection(db, 'roles'));...` -> Firestore getDocs
- Satır 32: `const q = query(collection(db, 'audit_logs'), orderBy('timestamp', 'desc'), limit(50));...` -> Firestore collection
- Satır 33: `const logsSnap = await getDocs(q);...` -> Firestore getDocs
- Satır 47: `await setDoc(doc(db, 'platform_settings', 'general'), {...` -> Firestore setDoc
- Satır 75: `await updateDoc(doc(db, 'roles', roleId), { permissions: currentPerms });...` -> Firestore updateDoc

### ./src/components/AdvancedScreenerSection.tsx
- Satır 16: `import { safeFetchJson } from '../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 63: `safeFetchJson<{ success: boolean; data: ScreenerStockRow[]; availableSectors: string[] }>(`/api/scre...` -> Özel API fetch wrapper'ı

### ./src/components/AIChatAdvisor.tsx
- Satır 20: `import { safeFetchJson } from '../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 85: `const { data, ok } = await safeFetchJson<{ reply: string; sources?: any[]; webResearchUsed?: boolean...` -> Özel API fetch wrapper'ı

### ./src/components/AIModelSettingsModal.tsx
- Satır 17: `import { safeFetchJson } from '../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 53: `const { data, ok } = await safeFetchJson<{ status: any; message: string; availableModels?: string[] ...` -> Özel API fetch wrapper'ı

### ./src/components/AuthScreen.tsx
- Satır 66: `await setDoc(...` -> Firestore setDoc
- Satır 67: `doc(db, 'users', user.uid),...` -> Firestore doc referansı
- Satır 117: `await setDoc(...` -> Firestore setDoc
- Satır 118: `doc(db, 'users', user.uid),...` -> Firestore doc referansı
- Satır 194: `await setDoc(doc(db, 'users', user.uid), {...` -> Firestore setDoc

### ./src/components/BacktestSection.tsx
- Satır 34: `import { safeFetchJson } from '../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 208: `const { data, ok } = await safeFetchJson<{ result: BacktestResult }>('/api/backtest/run', {...` -> Özel API fetch wrapper'ı

### ./src/components/EconomicIndicators/AssetImpactSection.tsx
- Satır 15: `import { safeFetchJson } from '../../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 33: `safeFetchJson<{ success: boolean; impacts: IndicatorAssetImpact[] }>(`/api/macro/asset-impact/${enco...` -> Özel API fetch wrapper'ı

### ./src/components/EconomicIndicators/EconomicIndicatorsPage.tsx
- Satır 26: `import { safeFetchJson } from '../../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 57: `const { data: indData, ok: indOk } = await safeFetchJson<{ success: boolean; indicators: EconomicInd...` -> Özel API fetch wrapper'ı
- Satır 65: `const { data: comData, ok: comOk } = await safeFetchJson<{ success: boolean; data: AIMacroCommentary...` -> Özel API fetch wrapper'ı
- Satır 88: `const { data, ok } = await safeFetchJson<{ success: boolean; data: AIMacroCommentaryOutput; generate...` -> Özel API fetch wrapper'ı

### ./src/components/EconomicIndicators/MultiIndicatorChartCard.tsx
- Satır 26: `import { safeFetchJson } from '../../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 83: `safeFetchJson<TimeSeriesResponse>(url)...` -> Özel API fetch wrapper'ı

### ./src/components/FinancialAcademySection.tsx
- Satır 93: `fetch('/api/academy/topics')...` -> fetch çağrısı

### ./src/components/IntelligenceHub/IntelligenceHub.tsx
- Satır 11: `import { safeFetchJson } from '../../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 60: `const { data, error: fetchErr } = await safeFetchJson<IntelligenceReportData>(url);...` -> Özel API fetch wrapper'ı
- Satır 82: `const { data } = await safeFetchJson<{ configured: boolean; threshold: number; history: any[] }>(...` -> Özel API fetch wrapper'ı
- Satır 97: `const { data } = await safeFetchJson<{ success: boolean; mode: 'LIVE' | 'SIMULATED'; message: string...` -> Özel API fetch wrapper'ı

### ./src/components/IntelligenceHub/SourceHealthBanner.tsx
- Satır 3: `import { safeFetchJson } from '../../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 36: `safeFetchJson<HealthSummary>('/api/intelligence/health'),...` -> Özel API fetch wrapper'ı
- Satır 37: `safeFetchJson<{ limits: any[] }>('/api/intelligence/rate-limits'),...` -> Özel API fetch wrapper'ı

### ./src/components/IPOTracker.tsx
- Satır 44: `import { safeFetchJson } from '../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 72: `safeFetchJson<{ success: boolean; listings: IPOListing[] }>('/api/ipo/listings'),...` -> Özel API fetch wrapper'ı
- Satır 73: `safeFetchJson<{ success: boolean; summaries: IPOSectorSummary[] }>('/api/ipo/sector-analysis')...` -> Özel API fetch wrapper'ı
- Satır 97: `const res = await safeFetchJson<{ success: boolean; ipo: IPOListing; similar: IPOListing[] }>(`/api/...` -> Özel API fetch wrapper'ı

### ./src/components/LatestBalanceSheetsSection.tsx
- Satır 17: `import { safeFetchJson } from '../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 38: `safeFetchJson<{ success: boolean; data: LatestBalanceSheetItem[] }>('/api/financials/latest')...` -> Özel API fetch wrapper'ı
- Satır 92: `await safeFetchJson('/api/notifications/subscribe', {...` -> Özel API fetch wrapper'ı

### ./src/components/OpportunityScanner.tsx
- Satır 27: `import { safeFetchJson } from '../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 60: `safeFetchJson<any>('/api/signals/v2/drift-status').then(({ data, ok }) => {...` -> Özel API fetch wrapper'ı
- Satır 70: `safeFetchJson<{ data: LatestBalanceSheetItem[] }>('/api/financials/latest').then(({ data, ok }) => {...` -> Özel API fetch wrapper'ı

### ./src/components/SettingsSection.tsx
- Satır 133: `const res = await fetch('/api/telegram/test-alert', {...` -> fetch çağrısı

### ./src/components/SignalEngineV2Modal.tsx
- Satır 19: `import { safeFetchJson } from '../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 52: `const { data, ok } = await safeFetchJson<any>('/api/signals/v2/test-suite');...` -> Özel API fetch wrapper'ı
- Satır 66: `const { data, ok } = await safeFetchJson<any>('/api/signals/v2/walk-forward', {...` -> Özel API fetch wrapper'ı
- Satır 83: `const { data, ok } = await safeFetchJson<any>('/api/signals/v2/drift-status');...` -> Özel API fetch wrapper'ı

### ./src/components/StockAnalysis/CompanyThesisTab.tsx
- Satır 15: `import { safeFetchJson } from '../../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 39: `safeFetchJson<{ success: boolean; data: CompanyThesis }>(`/api/stock/${symbol}/thesis`)...` -> Özel API fetch wrapper'ı

### ./src/components/StockAnalysis/CorporateEventsTab.tsx
- Satır 16: `import { safeFetchJson } from '../../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 34: `safeFetchJson<{ success: boolean; data: CorporateEvent[] }>(`/api/stock/${symbol}/events`)...` -> Özel API fetch wrapper'ı

### ./src/components/StockAnalysis/FinancialStatementsTab.tsx
- Satır 13: `import { safeFetchJson } from '../../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 36: `safeFetchJson<{ success: boolean; data: FinancialStatementsData }>(`/api/stock/${symbol}/financials`...` -> Özel API fetch wrapper'ı

### ./src/components/StockAnalysis/FundamentalValuationTab.tsx
- Satır 13: `import { safeFetchJson } from '../../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 32: `safeFetchJson<{ success: boolean; data: FairValueEstimate }>(`/api/stock/${symbol}/fairvalue`)...` -> Özel API fetch wrapper'ı

### ./src/components/StockAnalysis/FundPositionsTab.tsx
- Satır 17: `import { safeFetchJson } from '../../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 40: `safeFetchJson<{ success: boolean; data: { summary: FundPositionSummary; funds: FundDynamicsRow[] } }...` -> Özel API fetch wrapper'ı

### ./src/components/StockAnalysisModal.tsx
- Satır 2: `import { safeFetchJson } from "../utils/apiClient";...` -> Özel API fetch wrapper'ı
- Satır 117: `safeFetchJson<{ news: any[] }>(`/api/market/news?search=${encodeURIComponent(analysis.symbol)}`)...` -> Özel API fetch wrapper'ı
- Satır 132: `await safeFetchJson('/api/notifications/subscribe', {...` -> Özel API fetch wrapper'ı

### ./src/components/StockAnalysis/MultiplesAnalysisTab.tsx
- Satır 22: `import { safeFetchJson } from '../../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 41: `safeFetchJson<{ success: boolean; data: MultipleAnalysisData }>(`/api/stock/${symbol}/multiples`)...` -> Özel API fetch wrapper'ı

### ./src/components/StockAnalysis/PeerComparisonTab.tsx
- Satır 16: `import { safeFetchJson } from '../../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 36: `safeFetchJson<{ success: boolean; data: PeerComparisonData }>(`/api/stock/${symbol}/peers`)...` -> Özel API fetch wrapper'ı

### ./src/components/StockAnalysis/ScorecardTab.tsx
- Satır 16: `import { safeFetchJson } from '../../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 36: `safeFetchJson<{ success: boolean; data: FinancialKarne }>(`/api/stock/${symbol}/scorecard`)...` -> Özel API fetch wrapper'ı

### ./src/components/StockAnalysis/SeasonalityTab.tsx
- Satır 11: `import { safeFetchJson } from '../../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 28: `safeFetchJson<{ success: boolean; data: SeasonalityData }>(`/api/stock/${symbol}/seasonality`)...` -> Özel API fetch wrapper'ı

### ./src/components/StockAnalysis/SubsidiariesAndGovernanceTab.tsx
- Satır 16: `import { safeFetchJson } from '../../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 33: `safeFetchJson<{ success: boolean; data: CompanySubsidiariesData }>(`/api/stock/${symbol}/subsidiarie...` -> Özel API fetch wrapper'ı

### ./src/components/StockAnalysis/TechnicalEngineTab.tsx
- Satır 24: `import { safeFetchJson } from '../../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 148: `const { data, ok, error: fetchErr } = await safeFetchJson<{ success: boolean; data: TechnicalAnalysi...` -> Özel API fetch wrapper'ı
- Satır 226: `const { data, ok, error: aiErr } = await safeFetchJson<{ success: boolean; data: AISignalInterpretat...` -> Özel API fetch wrapper'ı

### ./src/components/Subscription/PricingSection.tsx
- Satır 27: `import { safeFetchJson } from '../../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 62: `const res = await safeFetchJson('/api/subscription/request-upgrade', {...` -> Özel API fetch wrapper'ı

### ./src/components/TefasAiRadarModal.tsx
- Satır 4: `import { safeFetchJson } from '../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 19: `safeFetchJson<{ opportunities: OpportunitySignal[] }>('/api/ai/tefas-opportunities').then(({ data, o...` -> Özel API fetch wrapper'ı

### ./src/components/TefasFundsSection.tsx
- Satır 26: `import { safeFetchJson } from '../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 60: `safeFetchJson<{ funds: TefasFund[] }>('/api/tefas/funds').then(({ data, ok }) => {...` -> Özel API fetch wrapper'ı

### ./src/contexts/AdminConfigContext.tsx
- Satır 23: `doc(db, 'platform_settings', 'general'),...` -> Firestore doc referansı

### ./src/contexts/AuthContext.tsx
- Satır 67: `const userRef = doc(db, 'users', firebaseUser.uid);...` -> Firestore doc referansı
- Satır 68: `const userSnap = await getDoc(userRef);...` -> Firestore getDoc
- Satır 95: `await setDoc(...` -> Firestore setDoc
- Satır 96: `doc(db, 'users', u.uid),...` -> Firestore doc referansı
- Satır 132: `const userRef = doc(db, 'users', currentUser.uid);...` -> Firestore doc referansı
- Satır 133: `getDoc(userRef).then(async (userSnap) => {...` -> Firestore getDoc
- Satır 163: `setDoc(userRef, {...` -> Firestore setDoc

### ./src/data/tefasFundsData.ts
- Satır 772: `price: Number((Math.random() * 25 + 0.1).toFixed(4)),...` -> Simüle/sahte veri üretimi (Math.random)

### ./src/hooks/useSubscription.ts
- Satır 15: `import { safeFetchJson } from '../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 45: `safeFetchJson<{ success: boolean; plans: Record<SubscriptionTier, SubscriptionPlanConfig> }>('/api/s...` -> Özel API fetch wrapper'ı

### ./src/pages/Portfolio/components/TelegramAlertsModal.tsx
- Satır 35: `const res = await fetch('/api/portfolio/telegram/test', {...` -> fetch çağrısı

### ./src/pages/Portfolio/hooks/usePortfolioAI.ts
- Satır 3: `import { safeFetchJson } from '../../../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 15: `const { data, ok } = await safeFetchJson<{...` -> Özel API fetch wrapper'ı

### ./src/pages/Portfolio/hooks/usePortfolioBacktest.ts
- Satır 3: `import { safeFetchJson } from '../../../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 14: `const { data, ok, error: fetchErr } = await safeFetchJson<{ success: boolean; error?: string } & Por...` -> Özel API fetch wrapper'ı

### ./src/pages/Portfolio/hooks/usePortfolio.ts
- Satır 12: `import { safeFetchJson } from '../../../utils/apiClient';...` -> Özel API fetch wrapper'ı
- Satır 56: `const snapshot = await getDocs(collection(db, `users/${user?.uid}/portfolios`));...` -> Firestore getDocs
- Satır 64: `const { data: apiData } = await safeFetchJson<{ success: boolean; portfolios: PortfolioItem[] }>('/a...` -> Özel API fetch wrapper'ı
- Satır 87: `const { data: pData } = await safeFetchJson<{ success: boolean; portfolio: PortfolioItem }>(`/api/po...` -> Özel API fetch wrapper'ı
- Satır 96: `const { data: perfData } = await safeFetchJson<{...` -> Özel API fetch wrapper'ı
- Satır 116: `const { data: txData } = await safeFetchJson<{...` -> Özel API fetch wrapper'ı
- Satır 126: `const { data: riskData } = await safeFetchJson<{...` -> Özel API fetch wrapper'ı
- Satır 136: `const { data: alertData } = await safeFetchJson<{...` -> Özel API fetch wrapper'ı
- Satır 176: `const { data: res } = await safeFetchJson<{ success: boolean; transaction: PortfolioTransaction }>(...` -> Özel API fetch wrapper'ı
- Satır 214: `await setDoc(doc(db, `users/${user?.uid}/portfolios/${newId}`), newPortfolio);...` -> Firestore setDoc
- Satır 220: `await safeFetchJson('/api/portfolio', {...` -> Özel API fetch wrapper'ı
- Satır 253: `await setDoc(doc(db, `users/${user?.uid}/portfolios/${selectedPortfolio.id}`), updatedPortfolio);...` -> Firestore setDoc
- Satır 259: `await safeFetchJson(`/api/portfolio/${selectedPortfolio.id}`, {...` -> Özel API fetch wrapper'ı
- Satır 283: `await setDoc(doc(db, `users/${user?.uid}/portfolios/${selectedPortfolio.id}`), updatedPortfolio);...` -> Firestore setDoc
- Satır 289: `await safeFetchJson(`/api/portfolio/${selectedPortfolio.id}`, {...` -> Özel API fetch wrapper'ı
- Satır 308: `await deleteDoc(doc(db, `users/${user?.uid}/portfolios/${id}`));...` -> Firestore doc referansı
- Satır 314: `await safeFetchJson(`/api/portfolio/${id}`, { method: 'DELETE' });...` -> Özel API fetch wrapper'ı

### ./src/services/firebaseClient.ts
- Satır 46: `await getDocFromServer(doc(db, 'system_health', 'ping'));...` -> Firestore doc referansı
- Satır 51: `const snap = await getDocs(collection(db, 'users'));...` -> Firestore getDocs
- Satır 78: `const snap = await getDocs(collection(db, 'users'));...` -> Firestore getDocs

### ./src/utils/apiClient.ts
- Satır 7: `export async function safeFetchJson<T>(...` -> Özel API fetch wrapper'ı
- Satır 65: `const res = await fetch(url, {...` -> fetch çağrısı

### ./src/utils/clientErrorLogger.ts
- Satır 60: `await setDoc(doc(db, 'errorLogs', logId), errorPayload);...` -> Firestore setDoc
- Satır 67: `fetch('/api/public-log-error', {...` -> fetch çağrısı

### ./test-admin-db.ts
- Satır 5: `await adminDb.collection('auditLogs').add({...` -> Firebase Admin DB çağrısı

### ./test-admin-raw.ts
- Satır 6: `const snap = await adminDb.collection('adminConfig').doc('subscriptionPlans').get();...` -> Firebase Admin DB çağrısı
- Satır 14: `await adminDb.collection('auditLogs').add({ test: 1 });...` -> Firebase Admin DB çağrısı

### ./test-admin-read.ts
- Satır 9: `const snap = await db.collection('roles').get();...` -> Firestore collection

### ./test-admin-rules.sh
- Satır 17: `await setDoc(doc(m.serverDb, 'users', '$USER_UID'), { role: 'admin' }, { merge: true });...` -> Firestore setDoc

### ./test-auth-rules.js
- Satır 23: `await adminDb.collection("users").doc(standardUid).set({ role: "standard_user", email: "test@example...` -> Firebase Admin DB çağrısı
- Satır 31: `const docSnap = await getDoc(doc(clientDb, "users", standardUid));...` -> Firestore getDoc
- Satır 37: `await setDoc(doc(clientDb, "users", standardUid), { updatedByClient: true }, { merge: true });...` -> Firestore setDoc
- Satır 43: `await getDoc(doc(clientDb, "users", "some_other_uid"));...` -> Firestore getDoc
- Satır 49: `await setDoc(doc(clientDb, "adminConfig", "general"), { foo: "bar" }, { merge: true });...` -> Firestore setDoc
- Satır 55: `await adminDb.collection("users").doc(adminUid).set({ role: "admin", email: "admin@example.com" });...` -> Firebase Admin DB çağrısı
- Satır 63: `await getDoc(doc(clientDb, "adminConfig", "general"));...` -> Firestore getDoc
- Satır 69: `await setDoc(doc(clientDb, "adminConfig", "test_rule"), { success: true });...` -> Firestore setDoc
- Satır 74: `await adminDb.collection("users").doc(standardUid).delete();...` -> Firebase Admin DB çağrısı
- Satır 75: `await adminDb.collection("users").doc(adminUid).delete();...` -> Firebase Admin DB çağrısı
- Satır 76: `await adminDb.collection("adminConfig").doc("test_rule").delete();...` -> Firebase Admin DB çağrısı

### ./test-e2e-integrity.ts
- Satır 22: `await adminDb.collection('data_integrity_audit').doc(testDocId).set({...` -> Firebase Admin DB çağrısı
- Satır 31: `const getRes = await fetch(`${baseUrl}/api/admin/integrity/review-queue`);...` -> fetch çağrısı
- Satır 44: `const postRes = await fetch(`${baseUrl}/api/admin/integrity/review-queue/${testDocId}/decision`, {...` -> fetch çağrısı
- Satır 57: `const updatedDoc = await adminDb.collection('data_integrity_audit').doc(testDocId).get();...` -> Firebase Admin DB çağrısı
- Satır 73: `await adminDb.collection('data_integrity_audit').doc(testDocId).delete().catch(() => {});...` -> Firebase Admin DB çağrısı

### ./test-errors.ts
- Satır 3: `const snapshot = await adminDb.collection('errorLogs').orderBy('timestamp', 'desc').limit(5).get();...` -> Firebase Admin DB çağrısı

### ./test-fetch.js
- Satır 1: `fetch('http://example.com', { timeout: 35000 }).then(() => console.log('ok')).catch(console.error);...` -> fetch çağrısı

### ./test-firestore-rules.js
- Satır 14: `await getDoc(doc(db, "adminConfig", "general"));...` -> Firestore getDoc
- Satır 25: `await setDoc(doc(db, "adminConfig", "test"), { foo: "bar" });...` -> Firestore setDoc
- Satır 32: `await addDoc(collection(db, "auditLogs"), { action: "test" });...` -> Firestore addDoc
- Satır 39: `await getDoc(doc(db, "users", "some_other_uid"));...` -> Firestore getDoc
- Satır 46: `await setDoc(doc(db, "users", auth.currentUser.uid), { test: "data" });...` -> Firestore setDoc
- Satır 53: `await getDoc(doc(db, "users", auth.currentUser.uid));...` -> Firestore getDoc

### ./test-mod1-scenarios.ts
- Satır 7: `const originalGet = adminDb.collection('adminConfig').doc('subscriptionPlans').get;...` -> Firebase Admin DB çağrısı
- Satır 8: `adminDb.collection('adminConfig').doc('subscriptionPlans').get = async () => {...` -> Firebase Admin DB çağrısı
- Satır 24: `adminDb.collection('adminConfig').doc('subscriptionPlans').get = originalGet;...` -> Firebase Admin DB çağrısı
- Satır 33: `// Actually, getUserRole still uses serverDb via getDoc in my previous patch? Wait, no, I patched ge...` -> Firestore getDoc

### ./test-mod3-health-runner.ts
- Satır 20: `const req = http.get(`http://127.0.0.1:${port}/api/health`, (res) => {...` -> HTTP(S) get

### ./test-trick.cjs
- Satır 25: `var import_yahoo_finance2 = __toESM(require("yahoo-finance2"), 1);...` -> Yahoo Finance modül kullanımı
- Satır 28: `yf.quote("AAPL").then((res) => console.log(res.regularMarketPrice)).catch(console.error);...` -> Yahoo Finance (yf) çağrısı

### ./test-trick.ts
- Satır 4: `yf.quote("AAPL").then(res => console.log(res.regularMarketPrice)).catch(console.error);...` -> Yahoo Finance (yf) çağrısı

### ./test-tsx.cjs
- Satır 25: `var import_yahoo_finance2 = __toESM(require("yahoo-finance2"), 1);...` -> Yahoo Finance modül kullanımı

### ./test-worker-health-monitor.ts
- Satır 18: `const res = await fetch('http://127.0.0.1:3000/api/health');...` -> fetch çağrısı

### ./test-yf2.cjs
- Satır 1: `const { YahooFinance } = require("yahoo-finance2");...` -> Yahoo Finance modül kullanımı
- Satır 3: `yf.quote("AAPL").then(res => console.log(res.regularMarketPrice)).catch(console.error);...` -> Yahoo Finance (yf) çağrısı

### ./test-yf3.cjs
- Satır 1: `const yfClass = require("yahoo-finance2").default;...` -> Yahoo Finance modül kullanımı
- Satır 3: `yf.quote("AAPL").then(res => console.log(res.regularMarketPrice)).catch(console.error);...` -> Yahoo Finance (yf) çağrısı

### ./test-yf4.cjs
- Satır 1: `const yfClass = require("yahoo-finance2").default;...` -> Yahoo Finance modül kullanımı

### ./test-yf.cjs
- Satır 1: `const yf = require("yahoo-finance2").default;...` -> Yahoo Finance modül kullanımı
- Satır 2: `yf.quote("AAPL").then(res => console.log(res.regularMarketPrice)).catch(console.error);...` -> Yahoo Finance (yf) çağrısı

