# TÜR 2 BULGULARI (API OLANLAR)

### ./app/applet/FAZ5_SECURITY_PROOF.md
- Satır 13: `208:     await adminDb.collection('adminConfig').doc('aiSettings').set(updated, { merge: true });...` -> Firestore DB İşlemi
- Satır 23: `143:     await adminDb.collection('users').doc(uid).set({...` -> Firestore DB İşlemi
- Satır 35: `231:     await adminDb.collection('users').doc(uid).set({ usage: cleanUsage }, { merge: true }).catc...` -> Firestore DB İşlemi

### ./app/applet/FAZ6_MODUL4_EVIDENCE.md
- Satır 142: `const res = await fetch(url, {...` -> HTTP İsteği

### ./bootstrap_roles.cjs
- Satır 7: `const adminDb = db.collection ? db : admin.firestore(admin.app(), DB_ID);...` -> Firestore DB İşlemi
- Satır 9: `await adminDb.collection('roles').doc('admin').set({...` -> Firestore DB İşlemi
- Satır 14: `await adminDb.collection('roles').doc('standard_user').set({...` -> Firestore DB İşlemi
- Satır 19: `await adminDb.collection('roles').doc('premium_user').set({...` -> Firestore DB İşlemi

### ./FAZ5_SECURITY_PROOF.md
- Satır 24: `30:     const snap = await adminDb.collection('users').doc(uid).get();...` -> Firestore DB İşlemi
- Satır 38: `68:     const planDocRef = adminDb.collection('adminConfig').doc('subscriptionPlans');...` -> Firestore DB İşlemi
- Satır 54: `166:     const snap = await adminDb.collection('adminConfig').doc('aiSettings').get();...` -> Firestore DB İşlemi

### ./get_atr.ts
- Satır 9: `const res = await fetch(url);...` -> HTTP İsteği

### ./get-errors.ts
- Satır 1: `import { adminDb } from './server/services/firebaseAdminService.ts';...` -> Firestore DB İşlemi
- Satır 3: `const snap = await adminDb.collection('errorLogs').orderBy('timestamp', 'desc').limit(5).get();...` -> Firestore DB İşlemi

### ./package.json
- Satır 42: `"yahoo-finance2": "^4.0.2"...` -> Yahoo Finance

### ./patch2.cjs
- Satır 6: `fetch('/api/health?error=' + encodeURIComponent(e.message));...` -> HTTP İsteği
- Satır 9: `fetch('/api/health?error=' + encodeURIComponent(e.reason ? e.reason.stack || e.reason : 'unknown'));...` -> HTTP İsteği

### ./patch_admin_audit.cjs
- Satır 5: `"import { doc, getDoc, setDoc, collection, getDocs, updateDoc } from 'firebase/firestore';",...` -> Firestore DB İşlemi
- Satır 6: `"import { doc, getDoc, setDoc, collection, getDocs, updateDoc, query, orderBy, limit } from 'firebas...` -> Firestore DB İşlemi
- Satır 21: `const logsSnap = await getDocs(q);...` -> Firestore DB İşlemi

### ./patch_admin_auth.cjs
- Satır 23: `const snapPromise = getDoc(userRef);...` -> Firestore DB İşlemi
- Satır 44: `const res = await fetch(url, {...` -> HTTP İsteği
- Satır 76: `const snapPromise = getDoc(roleRef);...` -> Firestore DB İşlemi

### ./patch_admin_service.cjs
- Satır 18: `const snap = await adminDb.collection('users').doc(uid).get();...` -> Firestore DB İşlemi
- Satır 42: `const snap = await adminDb.collection('roles').doc(roleName).get();...` -> Firestore DB İşlemi

### ./patch_app.cjs
- Satır 9: `const { data, ok } = await safeFetchJson<{ opportunities: OpportunitySignal[] }>(\`/api/ai/opportuni...` -> API/Veri Kaynağı
- Satır 20: `text = text.replace(/  const fetchOpportunities = useCallback\(async \(cat: MarketCategory = selecte...` -> API/Veri Kaynağı

### ./patch_app_modelconfig.cjs
- Satır 18: `getDoc(doc(db, 'user_preferences', user.uid)).then(snap => {...` -> Firestore DB İşlemi
- Satır 36: `setDoc(doc(db, 'user_preferences', user.uid), { modelConfig: newConfig }, { merge: true });...` -> Firestore DB İşlemi

### ./patch_app_persistence.cjs
- Satır 8: `"import { db, auth } from './lib/firebase';\nimport { doc, setDoc, getDoc } from 'firebase/firestore...` -> Firestore DB İşlemi

### ./patch_app_radar.sh
- Satır 2: `sed -i -e 's/const res = await fetch(\`\/api\/ai\/opportunities?category=${cat}\`);/const scopeParam...` -> HTTP İsteği

### ./patch_app_watchlist_sync.cjs
- Satır 6: `"import { AuthScreen } from './components/AuthScreen';\nimport { doc, getDoc, setDoc } from 'firebas...` -> Firestore DB İşlemi
- Satır 23: `setDoc(doc(db, 'user_watchlists', user.uid), { items: watchlist }, { merge: true });...` -> Firestore DB İşlemi
- Satır 32: `getDoc(doc(db, 'user_watchlists', user.uid)).then(snap => {...` -> Firestore DB İşlemi

### ./patch_auth_audit.cjs
- Satır 5: `"import { adminAuth, adminDb } from '../services/firebaseAdminService';",...` -> Firestore DB İşlemi
- Satır 6: `"import { adminAuth, adminDb } from '../services/firebaseAdminService';\nimport { logAudit } from '....` -> Firestore DB İşlemi

### ./patch_auth_google.cjs
- Satır 23: `await setDoc(doc(db, 'users', user.uid), {...` -> Firestore DB İşlemi

### ./patch_auth_middleware.cjs
- Satır 5: `"import { adminAuth, adminDb } from '../services/firebaseAdminService';",...` -> Firestore DB İşlemi
- Satır 11: `const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();...` -> Firestore DB İşlemi
- Satır 24: `const res = await fetch(url, { headers: { Authorization: \`Bearer \${idToken}\` } });...` -> HTTP İsteği
- Satır 47: `const roleDoc = await adminDb.collection('roles').doc(req.userRole).get();...` -> Firestore DB İşlemi
- Satır 65: `const res = await fetch(url, { headers: { Authorization: \`Bearer \${req.idToken}\` } });...` -> HTTP İsteği

### ./patch_auth_permissions.cjs
- Satır 10: `"const userSnap = await getDoc(userRef);\n        if (userSnap.exists()) {",...` -> Firestore DB İşlemi
- Satır 11: ``const userSnap = await getDoc(userRef);...` -> Firestore DB İşlemi
- Satır 15: `const roleSnap = await getDoc(doc(db, 'roles', ud.role));...` -> Firestore DB İşlemi

### ./patch_bot.cjs
- Satır 5: `"import { adminDb } from '../services/firebaseAdminService';",...` -> Firestore DB İşlemi
- Satır 6: `"import { serverDb } from '../services/firebaseClientService.ts';\nimport { doc, getDoc, setDoc, del...` -> Firestore DB İşlemi
- Satır 11: ``    const tokenDoc = await adminDb.collection('telegramTokens').doc(token).get();...` -> Firestore DB İşlemi
- Satır 18: `await adminDb.collection('users').doc(uid).set({...` -> Firestore DB İşlemi
- Satır 23: `await adminDb.collection('telegramTokens').doc(token).delete();`,...` -> Firestore DB İşlemi
- Satır 25: `const tokenDoc = await getDoc(tokenRef);...` -> Firestore DB İşlemi
- Satır 32: `await setDoc(doc(serverDb, 'users', uid), {...` -> Firestore DB İşlemi
- Satır 41: ``    const snap = await adminDb.collection('users').where('telegramChatId', '==', chatId.toString())...` -> Firestore DB İşlemi
- Satır 45: `const snap = await getDocs(q);...` -> Firestore DB İşlemi
- Satır 52: ``      const userDoc = await adminDb.collection('users').doc(uid).get();...` -> Firestore DB İşlemi
- Satır 54: ``      const userDoc = await getDoc(doc(serverDb, 'users', uid));...` -> Firestore DB İşlemi
- Satır 60: ``    await adminDb.collection('users').doc(uid).set({ telegramNotificationsEnabled: false }, { merge...` -> Firestore DB İşlemi
- Satır 61: ``    await setDoc(doc(serverDb, 'users', uid), { telegramNotificationsEnabled: false }, { merge: tru...` -> Firestore DB İşlemi
- Satır 66: ``    await adminDb.collection('users').doc(uid).set({ telegramNotificationsEnabled: true }, { merge:...` -> Firestore DB İşlemi
- Satır 67: ``    await setDoc(doc(serverDb, 'users', uid), { telegramNotificationsEnabled: true }, { merge: true...` -> Firestore DB İşlemi

### ./patch_chat2.cjs
- Satır 36: `getDoc(doc(db, 'users', user.uid, 'chatHistories', 'default')).then(snap => {...` -> Firestore DB İşlemi
- Satır 66: `setDoc(doc(db, 'users', user.uid, 'chatHistories', 'default'), { messages }, { merge: true }).catch(...` -> Firestore DB İşlemi

### ./patch_chat_persistence.cjs
- Satır 7: `"import { safeFetchJson } from '../utils/apiClient';",...` -> API/Veri Kaynağı
- Satır 8: `"import { safeFetchJson } from '../utils/apiClient';\nimport { useAuth } from '../contexts/AuthConte...` -> Firestore DB İşlemi
- Satır 41: `getDoc(doc(db, 'user_chat_histories', user.uid)).then(snap => {...` -> Firestore DB İşlemi
- Satır 72: `setDoc(doc(db, 'user_chat_histories', user.uid), { messages }, { merge: true }).catch(e => {...` -> Firestore DB İşlemi

### ./patch_digest.cjs
- Satır 5: `"import { adminDb } from '../services/firebaseAdminService.ts';",...` -> Firestore DB İşlemi
- Satır 6: `"import { serverDb } from '../services/firebaseClientService.ts';\nimport { collection, query, where...` -> Firestore DB İşlemi
- Satır 10: ``    const usersSnap = await adminDb.collection('users')...` -> Firestore DB İşlemi
- Satır 14: `const usersSnap = await getDocs(q);`...` -> Firestore DB İşlemi

### ./patch_header_search.sh
- Satır 13: `fetch(`/api/market/search?q=${searchQuery.trim()}`)\...` -> HTTP İsteği

### ./patch_modal_news.sh
- Satır 6: `fetch(`/api/market/news?search=${analysis.symbol}`)\...` -> HTTP İsteği

### ./patch_news.sh
- Satır 6: `const yahooFinance = require("yahoo-finance2").default;\...` -> Yahoo Finance

### ./patch_orchestrator2.cjs
- Satır 8: `const { collection, query, where, getDocs } = await import('firebase/firestore');...` -> Firestore DB İşlemi
- Satır 15: `const usersSnap = await getDocs(q);...` -> Firestore DB İşlemi

### ./patch_orchestrator.cjs
- Satır 9: `const adminDb = require('../services/firebaseAdminService.js').adminDb;...` -> Firestore DB İşlemi
- Satır 10: `const usersSnap = await adminDb.collection('users')...` -> Firestore DB İşlemi

### ./patch_routers.cjs
- Satır 7: `content = content.replace(/import \{ serverDb \} from '\.\.\/services\/firebaseClientService';/, "im...` -> Firestore DB İşlemi
- Satır 11: `"await adminDb.collection('upgrade_requests').add(requestRecord);");...` -> Firestore DB İşlemi
- Satır 15: `"await adminDb.collection('users').get();");...` -> Firestore DB İşlemi
- Satır 27: `content = content.replace(/import \{ serverDb \} from '\.\.\/services\/firebaseClientService';/, "im...` -> Firestore DB İşlemi
- Satır 31: `"await adminDb.collection('users').get();");...` -> Firestore DB İşlemi
- Satır 35: `"await adminDb.collection('users').doc(targetUid).set({ role: newRole, updatedAt: new Date().toISOSt...` -> Firestore DB İşlemi
- Satır 39: `"await adminDb.collection('users').doc(targetUid).set({ isBanned, banReason: reason || '', updatedAt...` -> Firestore DB İşlemi

### ./patch-server.cjs
- Satır 7: `"import express from 'express';\nimport yfAny from 'yahoo-finance2';\nconst YFClass = (yfAny as any)...` -> Yahoo Finance
- Satır 12: `/const YahooFinance = require\("yahoo-finance2"\)\.default;\s*const yf = new YahooFinance\(\{ suppre...` -> Yahoo Finance
- Satır 17: `/const YahooFinance = require\("yahoo-finance2"\)\.default;\s*const yf = new YahooFinance\(\{ suppre...` -> Yahoo Finance

### ./patch_server.cjs
- Satır 5: `"import { adminDb } from './server/services/firebaseAdminService.js';",...` -> Firestore DB İşlemi
- Satır 6: `"import { serverDb } from './server/services/firebaseClientService.ts';\nimport { doc, setDoc } from...` -> Firestore DB İşlemi
- Satır 10: ``    await adminDb.collection('telegramTokens').doc(token).set({...` -> Firestore DB İşlemi
- Satır 15: ``    await setDoc(doc(serverDb, 'telegramTokens', token), {...` -> Firestore DB İşlemi
- Satır 23: ``    await adminDb.collection('users').doc(uid).set({...` -> Firestore DB İşlemi
- Satır 27: ``    await setDoc(doc(serverDb, 'users', uid), {...` -> Firestore DB İşlemi

### ./patch_server_search.sh
- Satır 7: `const yahooFinance = require("yahoo-finance2").default;\...` -> Yahoo Finance

### ./patch_server_telegram.cjs
- Satır 6: `import { adminDb } from './server/services/firebaseAdminService.ts';...` -> Firestore DB İşlemi
- Satır 19: `await adminDb.collection('telegramTokens').doc(token).set({...` -> Firestore DB İşlemi
- Satır 37: `await adminDb.collection('users').doc(uid).set({...` -> Firestore DB İşlemi

### ./patch-service.cjs
- Satır 6: `/const YahooFinance = require\("yahoo-finance2"\)\.default;\s*const yf = new YahooFinance\(\{ suppre...` -> Yahoo Finance
- Satır 7: `"import yfAny from 'yahoo-finance2';\nconst YFClass = (yfAny as any).default || yfAny;\nconst yf = n...` -> Yahoo Finance

### ./patch_settings_tab.cjs
- Satır 31: `await fetch('/api/telegram/unlink', {...` -> HTTP İsteği
- Satır 51: `const res = await fetch('/api/telegram/link-token', {...` -> HTTP İsteği

### ./patch_sub_service.cjs
- Satır 41: `const snap = await adminDb.collection('users').doc(uid).get();...` -> Firestore DB İşlemi
- Satır 110: `await adminDb.collection('users').doc(uid).set({...` -> Firestore DB İşlemi
- Satır 135: `content = content.replace(/import \{ serverDb \} from '\.\/firebaseClientService';/, 'import { admin...` -> Firestore DB İşlemi
- Satır 146: `"adminDb.collection('users').doc(uid).set({ usage: newUsage }, { merge: true }).catch(err => console...` -> Firestore DB İşlemi
- Satır 150: `"await adminDb.collection('users').doc(uid).set({ usage: cleanUsage }, { merge: true }).catch(err =>...` -> Firestore DB İşlemi

### ./patch_telegram.cjs
- Satır 16: `const response = await fetch(\`https://api.telegram.org/bot\${botToken}/sendMessage\`, {...` -> HTTP İsteği

### ./patch_useportfolio.cjs
- Satır 5: `"import { safeFetchJson } from '../../../utils/apiClient';",...` -> API/Veri Kaynağı
- Satır 6: `"import { safeFetchJson } from '../../../utils/apiClient';\nimport { collection, doc, getDocs, setDo...` -> Firestore DB İşlemi
- Satır 13: `const { data, ok } = await safeFetchJson<{ success: boolean; portfolios: PortfolioItem[] }>('/api/po...` -> API/Veri Kaynağı
- Satır 29: `const snapshot = await getDocs(collection(db, \`user_portfolios/\${auth.currentUser.uid}/portfolios\...` -> Firestore DB İşlemi
- Satır 43: `const { data: pData } = await safeFetchJson<{ success: boolean; portfolio: PortfolioItem }>(\`/api/p...` -> API/Veri Kaynağı
- Satır 49: `const { data: perfData } = await safeFetchJson<{...` -> API/Veri Kaynağı
- Satır 64: `const { data: riskData } = await safeFetchJson<{...` -> API/Veri Kaynağı
- Satır 73: `const { data: alertData } = await safeFetchJson<{...` -> API/Veri Kaynağı
- Satır 91: `const { data: perfData } = await safeFetchJson<{...` -> API/Veri Kaynağı
- Satır 110: `const { data: riskData } = await safeFetchJson<{...` -> API/Veri Kaynağı
- Satır 128: `const response = await fetch('/api/portfolio', {...` -> HTTP İsteği
- Satır 165: `await setDoc(doc(db, \`user_portfolios/\${auth.currentUser.uid}/portfolios/\${newId}\`), newPortfoli...` -> Firestore DB İşlemi
- Satır 177: `const addHoldingOriginal = `      const response = await fetch(\`/api/portfolio/\${selectedPortfolio...` -> HTTP İsteği
- Satır 188: `await setDoc(doc(db, \`user_portfolios/\${auth.currentUser.uid}/portfolios/\${selectedPortfolio.id}\...` -> Firestore DB İşlemi
- Satır 194: `const removeHoldingOriginal = `      const response = await fetch(\`/api/portfolio/\${selectedPortfo...` -> HTTP İsteği
- Satır 205: `await setDoc(doc(db, \`user_portfolios/\${auth.currentUser.uid}/portfolios/\${selectedPortfolio.id}\...` -> Firestore DB İşlemi
- Satır 214: `const response = await fetch(\`/api/portfolio/\${id}\`, { method: 'DELETE' });...` -> HTTP İsteği

### ./patch_yahoo.cjs
- Satır 51: `return await withBackoff(() => yf.quote(ticker));...` -> Yahoo Finance
- Satır 72: `'const quote = await withBackoff(() => yf.quote(asset.yahooTicker)) as any;',...` -> Yahoo Finance
- Satır 78: `'const quote = await yf.quote(upper).catch(() => null) as any;',...` -> Yahoo Finance

### ./rewrite_academy.cjs
- Satır 77: `fetch('/api/academy/topics')...` -> HTTP İsteği

### ./run_v6.1_backtest.ts
- Satır 32: `const res = await fetch(url);...` -> HTTP İsteği

### ./run_v6.3_backtest.ts
- Satır 31: `const res = await fetch(url);...` -> HTTP İsteği

### ./run_v6.4_backtest.ts
- Satır 27: `const res = await fetch(url);...` -> HTTP İsteği

### ./run_v6.5_backtest.ts
- Satır 28: `const res = await fetch(url);...` -> HTTP İsteği

### ./scripts/runProtocolAudit.ts
- Satır 2: `import yahooFinance from 'yahoo-finance2';...` -> Yahoo Finance
- Satır 56: `directQuote = await yf.quote(`${sym}.IS`);...` -> Yahoo Finance
- Satır 84: `const res = await fetch(`${baseURL}/${sym}/${ep}`);...` -> HTTP İsteği

### ./seed-admin.ts
- Satır 3: `import { getFirestore, doc, setDoc } from 'firebase/firestore';...` -> Firestore DB İşlemi
- Satır 37: `await setDoc(doc(db, 'users', user.uid), {...` -> Firestore DB İşlemi
- Satır 46: `await setDoc(doc(db, 'roles', 'admin'), { description: 'Tam yetkili yönetici', permissions: ['admin....` -> Firestore DB İşlemi
- Satır 47: `await setDoc(doc(db, 'roles', 'standard_user'), { description: 'Standart kullanıcı', permissions: ['...` -> Firestore DB İşlemi
- Satır 48: `await setDoc(doc(db, 'roles', 'premium_user'), { description: 'Premium abone', permissions: ['academ...` -> Firestore DB İşlemi

### ./server/aiService.ts
- Satır 120: `const response = await fetch(`${ollamaUrl}/api/generate`, {...` -> HTTP İsteği
- Satır 181: `const response = await fetch(`${baseUrl}/chat/completions`, {...` -> HTTP İsteği

### ./server/backtest/runFullMultiYearBacktest.ts
- Satır 51: `const res = await fetch(url);...` -> HTTP İsteği

### ./server/indicator_fetchers/FrankfurterFetcher.ts
- Satır 22: `const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=TRY,EUR', {...` -> HTTP İsteği

### ./server/indicator_fetchers/timeSeriesService.ts
- Satır 212: `if (year <= 2021) val = 17.5 + Math.sin(month) * 1.5;...` -> Simüle Veri (Sahte)
- Satır 301: `else if (year === 2023) val = 103.5 + Math.sin(month) * 2.5;...` -> Simüle Veri (Sahte)
- Satır 303: `else if (year === 2025) val = 104.5 + Math.sin(month * 0.8) * 1.5;...` -> Simüle Veri (Sahte)
- Satır 319: `else if (year === 2024) val = 4.4 + Math.sin(month) * 0.3;...` -> Simüle Veri (Sahte)
- Satır 328: `else if (year === 2022) val = 1820 + Math.sin(month) * 80;...` -> Simüle Veri (Sahte)
- Satır 340: `else if (year === 2023) val = 82.0 + Math.sin(month) * 9.0;...` -> Simüle Veri (Sahte)
- Satır 342: `else if (year === 2025) val = 77.0 + Math.sin(month) * 3.0;...` -> Simüle Veri (Sahte)
- Satır 360: `val = 4.2 + Math.sin(progress * 12) * 1.2;...` -> Simüle Veri (Sahte)
- Satır 366: `const noise = Math.sin(progress * 10) * (liveValue * 0.05);...` -> Simüle Veri (Sahte)

### ./server/indicator_fetchers/YahooFinanceMacroFetcher.ts
- Satır 3: `import yfAny from 'yahoo-finance2';...` -> Yahoo Finance

### ./server/intelligence/orchestratorAgent.ts
- Satır 305: `const { adminDb } = await import('../services/firebaseAdminService');...` -> Firestore DB İşlemi
- Satır 306: `const fetchPromise = adminDb.collection('users').where('telegramChatId', '!=', null).get();...` -> Firestore DB İşlemi

### ./server/intelligence/scheduledDigest.ts
- Satır 2: `import { adminDb } from '../services/firebaseAdminService';...` -> Firestore DB İşlemi
- Satır 15: `const fetchPromise = adminDb.collection('users').where('telegramChatId', '!=', null).get();...` -> Firestore DB İşlemi

### ./server/intelligence/technicalAgent.ts
- Satır 302: `const wave = Math.sin((i + seed) * 0.18) * (currentPrice * 0.015);...` -> Simüle Veri (Sahte)

### ./server/intelligence/telegramBot.ts
- Satır 2: `import { adminDb } from '../services/firebaseAdminService';...` -> Firestore DB İşlemi
- Satır 18: `const tokenRef = adminDb.collection('telegramTokens').doc(token);...` -> Firestore DB İşlemi
- Satır 34: `await adminDb.collection('users').doc(uid).set({...` -> Firestore DB İşlemi
- Satır 51: `const snap = await adminDb.collection('users').where('telegramChatId', '==', chatId.toString()).limi...` -> Firestore DB İşlemi
- Satır 125: `const userDoc = await adminDb.collection('users').doc(uid).get();...` -> Firestore DB İşlemi
- Satır 139: `await adminDb.collection('users').doc(uid).set({ telegramNotificationsEnabled: false }, { merge: tru...` -> Firestore DB İşlemi
- Satır 147: `await adminDb.collection('users').doc(uid).set({ telegramNotificationsEnabled: true }, { merge: true...` -> Firestore DB İşlemi

### ./server/intelligence/telegramService.ts
- Satır 202: `const res = await fetch(url, {...` -> HTTP İsteği

### ./server_logs2.txt
- Satır 31: `[AuditService] Failed to save error log to Firestore via adminDb: Error: 5 NOT_FOUND:...` -> Firestore DB İşlemi

### ./server/migrations/migrateIpoDeepAnalysis.ts
- Satır 2: `import { adminDb } from '../services/firebaseAdminService';...` -> Firestore DB İşlemi
- Satır 58: `const snap = await adminDb.collection('ipoListings').get();...` -> Firestore DB İşlemi
- Satır 74: `await adminDb.collection('ipoListings').doc(docSnap.id).set(enriched, { merge: true }).catch((err) =...` -> Firestore DB İşlemi

### ./server/portfolio/portfolioAI.ts
- Satır 176: `p += (Math.sin(i * 0.5) * 0.015 * basePrice) + (0.003 * basePrice);...` -> Simüle Veri (Sahte)

### ./server/README_DEPLOYMENT.md
- Satır 5: `During development in the AI Studio preview environment (or any environment lacking GCP Application ...` -> Firestore DB İşlemi

### ./server/routes/adminIntegrityRouter.ts
- Satır 2: `import { adminDb } from '../services/firebaseAdminService';...` -> Firestore DB İşlemi
- Satır 13: `const snapshot = await adminDb.collection('data_integrity_audit')...` -> Firestore DB İşlemi
- Satır 52: `await adminDb.collection('data_integrity_audit').doc(req.params.id).set(updates, { merge: true });...` -> Firestore DB İşlemi

### ./server/routes/adminRouter.ts
- Satır 15: `import { adminDb } from '../services/firebaseAdminService';...` -> Firestore DB İşlemi
- Satır 152: `const snap = await adminDb.collection('users').get();...` -> Firestore DB İşlemi
- Satır 197: `await adminDb.collection('users').doc(u.uid).set(u, { merge: true });...` -> Firestore DB İşlemi
- Satır 295: `const userDoc = await adminDb.collection('users').doc(targetUid).get();...` -> Firestore DB İşlemi
- Satır 311: `await adminDb.collection('users').doc(targetUid).set({ role: newRole, updatedAt: new Date().toISOStr...` -> Firestore DB İşlemi
- Satır 352: `await adminDb.collection('users').doc(targetUid).set({ isActive, updatedAt: new Date().toISOString()...` -> Firestore DB İşlemi
- Satır 469: `await adminDb.collection('users').doc(uid).set(newUser, { merge: true });...` -> Firestore DB İşlemi
- Satır 506: `const snap = await adminDb.collection('users').get();...` -> Firestore DB İşlemi

### ./server/routes/subscriptionRouter.ts
- Satır 8: `import { adminDb } from '../services/firebaseAdminService';...` -> Firestore DB İşlemi
- Satır 92: `await adminDb.collection('upgrade_requests').add(requestRecord);...` -> Firestore DB İşlemi
- Satır 177: `const snap = await adminDb.collection('users').get();...` -> Firestore DB İşlemi
- Satır 228: `await adminDb.collection('users').doc(u.uid).set(u, { merge: true });...` -> Firestore DB İşlemi

### ./server/services/adminConfigService.ts
- Satır 2: `import { adminDb } from './firebaseAdminService';...` -> Firestore DB İşlemi
- Satır 68: `const planDocRef = adminDb.collection('adminConfig').doc('subscriptionPlans');...` -> Firestore DB İşlemi
- Satır 95: `await adminDb.collection('adminConfig').doc('subscriptionPlans').set({...` -> Firestore DB İşlemi
- Satır 119: `await adminDb.collection('adminConfig').doc('subscriptionPlans').set({...` -> Firestore DB İşlemi
- Satır 167: `const snap = await adminDb.collection('adminConfig').doc('aiSettings').get().catch(async () => {...` -> Firestore DB İşlemi
- Satır 189: `await adminDb.collection('adminConfig').doc('aiSettings').set(cachedAiSettings, { merge: true }).cat...` -> Firestore DB İşlemi
- Satır 215: `await adminDb.collection('adminConfig').doc('aiSettings').set(updated, { merge: true });...` -> Firestore DB İşlemi

### ./server/services/auditService.ts
- Satır 1: `import { adminDb } from './firebaseAdminService';...` -> Firestore DB İşlemi
- Satır 67: `await adminDb.collection('auditLogs').doc(logId).set(entry);...` -> Firestore DB İşlemi
- Satır 142: `adminDb...` -> Firestore DB İşlemi
- Satır 180: `await adminDb.collection('errorLogs').doc(logId).set(entry);...` -> Firestore DB İşlemi
- Satır 182: `originalConsoleError('[AuditService] Failed to save error log to Firestore via adminDb:', err);...` -> Firestore DB İşlemi
- Satır 190: `const snap = await adminDb.collection('auditLogs').orderBy('timestamp', 'desc').limit(limitCount).ge...` -> Firestore DB İşlemi
- Satır 226: `await adminDb.collection('auditLogs').doc(sampleLog.id!).set(sampleLog);...` -> Firestore DB İşlemi
- Satır 239: `const snap = await adminDb.collection('errorLogs').orderBy('timestamp', 'desc').limit(limitCount).ge...` -> Firestore DB İşlemi
- Satır 274: `await adminDb.collection('errorLogs').doc(sampleErr.id!).set(sampleErr);...` -> Firestore DB İşlemi
- Satır 288: `const snap = await adminDb.collection('auditLogs').get();...` -> Firestore DB İşlemi
- Satır 290: `const batch = adminDb.batch();...` -> Firestore DB İşlemi
- Satır 304: `const snap = await adminDb.collection('errorLogs').get();...` -> Firestore DB İşlemi
- Satır 306: `const batch = adminDb.batch();...` -> Firestore DB İşlemi

### ./server/services/dataIntegrityService.ts
- Satır 2: `import { adminDb } from './firebaseAdminService';...` -> Firestore DB İşlemi
- Satır 63: `if (isImportant && adminDb?.collection) {...` -> Firestore DB İşlemi
- Satır 65: `adminDb.collection('data_integrity_audit').add(entry).catch((err) => {...` -> Firestore DB İşlemi

### ./server/services/dbIntegrationService.ts
- Satır 2: `import { adminDb } from './firebaseAdminService';...` -> Firestore DB İşlemi
- Satır 113: `const docRef = adminDb.collection('adminConfig').doc('databaseIntegration');...` -> Firestore DB İşlemi
- Satır 182: `await adminDb.collection('adminConfig').doc('databaseIntegration').set(updated, { merge: true });...` -> Firestore DB İşlemi
- Satır 335: `if (typeof adminDb.listCollections === 'function') {...` -> Firestore DB İşlemi
- Satır 336: `const collections = await adminDb.listCollections();...` -> Firestore DB İşlemi
- Satır 346: `const userSnap = await adminDb.collection('users').limit(20).get();...` -> Firestore DB İşlemi

### ./server/services/firebaseAdminService.ts
- Satır 29: `export const adminDb = primaryAdminDb;...` -> Firestore DB İşlemi

### ./server/services/ipoDataService.ts
- Satır 1: `import { adminDb } from './firebaseAdminService';...` -> Firestore DB İşlemi
- Satır 759: `const snapPromise = adminDb.collection('ipoListings').get();...` -> Firestore DB İşlemi
- Satır 948: `await adminDb.collection('ipoListings').doc(id).set(updated, { merge: true });...` -> Firestore DB İşlemi
- Satır 992: `await adminDb.collection('ipoListings').doc(id).delete();...` -> Firestore DB İşlemi
- Satır 1033: `const response = await fetch('https://www.kap.org.tr/tr/api/disclosures', {...` -> HTTP İsteği

### ./server/services/notificationService.ts
- Satır 60: `const response = await fetch(url, {...` -> HTTP İsteği

### ./server/services/subscriptionService.ts
- Satır 1: `import { adminDb } from "./firebaseAdminService";...` -> Firestore DB İşlemi
- Satır 91: `const snap = await adminDb.collection('users').doc(uid).get().catch(async () => {...` -> Firestore DB İşlemi
- Satır 184: `await adminDb.collection('users').doc(uid).set({...` -> Firestore DB İşlemi
- Satır 237: `adminDb.collection('users').doc(uid).set({ usage: newUsage }, { merge: true }).catch(err => {...` -> Firestore DB İşlemi
- Satır 260: `adminDb.collection('users').doc(uid).set({ usage: newUsage }, { merge: true }).catch(err => {...` -> Firestore DB İşlemi
- Satır 283: `await adminDb.collection('users').doc(uid).set({ usage: cleanUsage }, { merge: true }).catch(err => ...` -> Firestore DB İşlemi

### ./server.ts
- Satır 7: `import yfAny from 'yahoo-finance2';...` -> Yahoo Finance
- Satır 594: `const pingRes = await fetch(`${url}/api/tags`);...` -> HTTP İsteği

### ./server/yahooFinanceService.ts
- Satır 7: `import yfAny from 'yahoo-finance2';...` -> Yahoo Finance
- Satır 57: `return await withBackoff(() => yf.quote(ticker));...` -> Yahoo Finance
- Satır 237: `const res = await fetch('https://api.binance.com/api/v3/ticker/24hr', {...` -> HTTP İsteği
- Satır 280: `const res = await fetch(url, {...` -> HTTP İsteği

### ./src/App.tsx
- Satır 8: `import { doc, getDoc, setDoc } from 'firebase/firestore';...` -> Firestore DB İşlemi
- Satır 37: `import { safeFetchJson } from './utils/apiClient';...` -> API/Veri Kaynağı
- Satır 138: `getDoc(doc(db, 'users', user.uid, 'preferences', 'default')).then(snap => {...` -> Firestore DB İşlemi
- Satır 156: `setDoc(doc(db, 'users', user.uid, 'preferences', 'default'), { modelConfig: newConfig }, { merge: tr...` -> Firestore DB İşlemi
- Satır 194: `setDoc(doc(db, 'users', user.uid, 'watchlist', 'default'), { items: watchlist }, { merge: true });...` -> Firestore DB İşlemi
- Satır 203: `getDoc(doc(db, 'users', user.uid, 'watchlist', 'default')).then(snap => {...` -> Firestore DB İşlemi
- Satır 215: `const { data, ok } = await safeFetchJson<{ quotes: StockQuote[]; total: number }>('/api/market/quote...` -> API/Veri Kaynağı
- Satır 238: `const { data, ok } = await safeFetchJson<{ opportunities: OpportunitySignal[] }>(`/api/ai/opportunit...` -> API/Veri Kaynağı
- Satır 252: `const { data, ok } = await safeFetchJson<{ news: MarketNewsItem[] }>('/api/market/news');...` -> API/Veri Kaynağı
- Satır 291: `const { data, ok } = await safeFetchJson<{ analysis: StockAnalysisDetail }>('/api/ai/analyze-stock',...` -> API/Veri Kaynağı
- Satır 314: `const { data, ok } = await safeFetchJson<{ fund: TefasFundDetail }>(`/api/tefas/detail/${fund.code}`...` -> API/Veri Kaynağı

### ./src/components/admin/AdminAiSettingsTab.tsx
- Satır 16: `import { safeFetchJson } from '../../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 60: `const res = await safeFetchJson<{ success: boolean; error?: string }>('/api/admin/ai-settings', {...` -> API/Veri Kaynağı
- Satır 85: `const res = await safeFetchJson<{ response?: string; text?: string; error?: string }>('/api/chat', {...` -> API/Veri Kaynağı

### ./src/components/admin/AdminApiManagementTab.tsx
- Satır 15: `import { safeFetchJson } from '../../utils/apiClient';...` -> API/Veri Kaynağı

### ./src/components/admin/AdminAuditLogsTab.tsx
- Satır 16: `import { safeFetchJson } from '../../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 40: `const res = await safeFetchJson<{ success: boolean }>('/api/admin/audit-logs', {...` -> API/Veri Kaynağı

### ./src/components/admin/AdminDatabaseIntegrationTab.tsx
- Satır 22: `import { safeFetchJson } from '../../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 142: `const res = await safeFetchJson<{ success: boolean; settings: DatabaseSettings }>('/api/admin/db-set...` -> API/Veri Kaynağı
- Satır 159: `const res = await safeFetchJson<{ success: boolean; settings?: DatabaseSettings; error?: string }>(...` -> API/Veri Kaynağı
- Satır 187: `const res = await safeFetchJson<{...` -> API/Veri Kaynağı
- Satır 238: `const res = await safeFetchJson<{...` -> API/Veri Kaynağı
- Satır 292: `const res = await safeFetchJson<{...` -> API/Veri Kaynağı

### ./src/components/admin/AdminErrorLogsTab.tsx
- Satır 14: `import { safeFetchJson } from '../../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 16: `import { collection, getDocs, deleteDoc } from 'firebase/firestore';...` -> Firestore DB İşlemi
- Satır 40: `await safeFetchJson<{ success: boolean }>('/api/admin/error-logs', {...` -> API/Veri Kaynağı
- Satır 46: `const snap = await getDocs(collection(db, 'errorLogs'));...` -> Firestore DB İşlemi

### ./src/components/admin/AdminIpoManagementTab.tsx
- Satır 24: `import { safeFetchJson } from '../../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 42: `const res = await safeFetchJson<{ success: boolean; listings: IPOListing[] }>('/api/ipo/listings?ref...` -> API/Veri Kaynağı
- Satır 61: `const res = await safeFetchJson<{ success: boolean; message: string; newCount: number }>('/api/admin...` -> API/Veri Kaynağı
- Satır 126: `const res = await safeFetchJson<{ success: boolean }>(`/api/admin/ipo/${id}`, {...` -> API/Veri Kaynağı
- Satır 150: `const res = await safeFetchJson<{ success: boolean; ipo: IPOListing }>('/api/admin/ipo/upsert', {...` -> API/Veri Kaynağı

### ./src/components/admin/AdminPlatformTab.tsx
- Satır 13: `import { collection, getDocs, limit, query } from 'firebase/firestore';...` -> Firestore DB İşlemi
- Satır 34: `await getDocs(q);...` -> Firestore DB İşlemi

### ./src/components/admin/AdminSubscriptionTuningTab.tsx
- Satır 23: `import { safeFetchJson } from '../../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 174: `const res = await safeFetchJson<{ success: boolean; error?: string }>('/api/admin/subscription-plans...` -> API/Veri Kaynağı

### ./src/components/admin/AdminUserManagementTab.tsx
- Satır 18: `import { safeFetchJson } from '../../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 20: `import { doc, setDoc, updateDoc } from 'firebase/firestore';...` -> Firestore DB İşlemi
- Satır 89: `const res = await safeFetchJson<{ success: boolean; user?: any; error?: string }>('/api/admin/create...` -> API/Veri Kaynağı
- Satır 103: `setDoc(doc(db, 'users', res.data.user.uid), {...` -> Firestore DB İşlemi
- Satır 155: `const res = await safeFetchJson<{ success: boolean; error?: string }>('/api/admin/grant-subscription...` -> API/Veri Kaynağı
- Satır 168: `updateDoc(doc(db, 'users', selectedUserForGrant.uid), {...` -> Firestore DB İşlemi
- Satır 199: `const res = await safeFetchJson<{ success: boolean; error?: string }>('/api/admin/reset-user-usage',...` -> API/Veri Kaynağı
- Satır 229: `const res = await safeFetchJson<{ success: boolean; error?: string }>('/api/admin/toggle-user-status...` -> API/Veri Kaynağı
- Satır 236: `updateDoc(doc(db, 'users', targetUid), { isActive: nextStatus }).catch(() => {});...` -> Firestore DB İşlemi
- Satır 260: `const res = await safeFetchJson<{ success: boolean; error?: string }>('/api/admin/change-user-role',...` -> API/Veri Kaynağı
- Satır 271: `updateDoc(doc(db, 'users', selectedUserForRole.uid), { role: targetRole }).catch(() => {});...` -> Firestore DB İşlemi

### ./src/components/AdminPanel.tsx
- Satır 15: `import { safeFetchJson } from '../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 17: `import { collection, getDocs } from 'firebase/firestore';...` -> Firestore DB İşlemi
- Satır 69: `safeFetchJson<{ stats: any }>('/api/admin/system-stats').catch(() => ({ ok: false, data: null })),...` -> API/Veri Kaynağı
- Satır 70: `safeFetchJson<{ plans: any }>('/api/admin/subscription-plans').catch(() => ({ ok: false, data: null ...` -> API/Veri Kaynağı
- Satır 71: `safeFetchJson<{ settings: any }>('/api/admin/ai-settings').catch(() => ({ ok: false, data: null })),...` -> API/Veri Kaynağı
- Satır 72: `safeFetchJson<{ users: any[] }>('/api/admin/users').catch(() => ({ ok: false, data: null })),...` -> API/Veri Kaynağı
- Satır 73: `safeFetchJson<{ logs: any[] }>('/api/admin/audit-logs').catch(() => ({ ok: false, data: null })),...` -> API/Veri Kaynağı
- Satır 74: `safeFetchJson<{ logs: any[] }>('/api/admin/error-logs').catch(() => ({ ok: false, data: null }))...` -> API/Veri Kaynağı
- Satır 84: `const usersSnap = await getDocs(collection(db, 'users'));...` -> Firestore DB İşlemi
- Satır 134: `const errorSnap = await getDocs(collection(db, 'errorLogs'));...` -> Firestore DB İşlemi

### ./src/components/AdminSettingsSection.tsx
- Satır 3: `import { doc, getDoc, setDoc, collection, getDocs, updateDoc, query, orderBy, limit } from 'firebase...` -> Firestore DB İşlemi
- Satır 5: `import { safeFetchJson } from '../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 18: `const settingsSnap = await getDoc(doc(db, 'platform_settings', 'general'));...` -> Firestore DB İşlemi
- Satır 26: `const rolesSnap = await getDocs(collection(db, 'roles'));...` -> Firestore DB İşlemi
- Satır 33: `const logsSnap = await getDocs(q);...` -> Firestore DB İşlemi
- Satır 47: `await setDoc(doc(db, 'platform_settings', 'general'), {...` -> Firestore DB İşlemi
- Satır 75: `await updateDoc(doc(db, 'roles', roleId), { permissions: currentPerms });...` -> Firestore DB İşlemi

### ./src/components/AdvancedScreenerSection.tsx
- Satır 16: `import { safeFetchJson } from '../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 63: `safeFetchJson<{ success: boolean; data: ScreenerStockRow[]; availableSectors: string[] }>(`/api/scre...` -> API/Veri Kaynağı

### ./src/components/AIChatAdvisor.tsx
- Satır 20: `import { safeFetchJson } from '../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 85: `const { data, ok } = await safeFetchJson<{ reply: string; sources?: any[]; webResearchUsed?: boolean...` -> API/Veri Kaynağı

### ./src/components/AIModelSettingsModal.tsx
- Satır 17: `import { safeFetchJson } from '../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 53: `const { data, ok } = await safeFetchJson<{ status: any; message: string; availableModels?: string[] ...` -> API/Veri Kaynağı

### ./src/components/AuthScreen.tsx
- Satır 13: `import { doc, setDoc } from 'firebase/firestore';...` -> Firestore DB İşlemi
- Satır 66: `await setDoc(...` -> Firestore DB İşlemi
- Satır 117: `await setDoc(...` -> Firestore DB İşlemi
- Satır 194: `await setDoc(doc(db, 'users', user.uid), {...` -> Firestore DB İşlemi

### ./src/components/BacktestSection.tsx
- Satır 34: `import { safeFetchJson } from '../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 208: `const { data, ok } = await safeFetchJson<{ result: BacktestResult }>('/api/backtest/run', {...` -> API/Veri Kaynağı

### ./src/components/EconomicIndicators/AssetImpactSection.tsx
- Satır 15: `import { safeFetchJson } from '../../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 33: `safeFetchJson<{ success: boolean; impacts: IndicatorAssetImpact[] }>(`/api/macro/asset-impact/${enco...` -> API/Veri Kaynağı

### ./src/components/EconomicIndicators/EconomicIndicatorsPage.tsx
- Satır 26: `import { safeFetchJson } from '../../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 57: `const { data: indData, ok: indOk } = await safeFetchJson<{ success: boolean; indicators: EconomicInd...` -> API/Veri Kaynağı
- Satır 65: `const { data: comData, ok: comOk } = await safeFetchJson<{ success: boolean; data: AIMacroCommentary...` -> API/Veri Kaynağı
- Satır 88: `const { data, ok } = await safeFetchJson<{ success: boolean; data: AIMacroCommentaryOutput; generate...` -> API/Veri Kaynağı

### ./src/components/EconomicIndicators/MultiIndicatorChartCard.tsx
- Satır 26: `import { safeFetchJson } from '../../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 83: `safeFetchJson<TimeSeriesResponse>(url)...` -> API/Veri Kaynağı

### ./src/components/FinancialAcademySection.tsx
- Satır 93: `fetch('/api/academy/topics')...` -> HTTP İsteği

### ./src/components/IntelligenceHub/IntelligenceHub.tsx
- Satır 11: `import { safeFetchJson } from '../../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 60: `const { data, error: fetchErr } = await safeFetchJson<IntelligenceReportData>(url);...` -> API/Veri Kaynağı
- Satır 82: `const { data } = await safeFetchJson<{ configured: boolean; threshold: number; history: any[] }>(...` -> API/Veri Kaynağı
- Satır 97: `const { data } = await safeFetchJson<{ success: boolean; mode: 'LIVE' | 'SIMULATED'; message: string...` -> API/Veri Kaynağı

### ./src/components/IntelligenceHub/SourceHealthBanner.tsx
- Satır 3: `import { safeFetchJson } from '../../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 36: `safeFetchJson<HealthSummary>('/api/intelligence/health'),...` -> API/Veri Kaynağı
- Satır 37: `safeFetchJson<{ limits: any[] }>('/api/intelligence/rate-limits'),...` -> API/Veri Kaynağı

### ./src/components/IPOTracker.tsx
- Satır 44: `import { safeFetchJson } from '../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 72: `safeFetchJson<{ success: boolean; listings: IPOListing[] }>('/api/ipo/listings'),...` -> API/Veri Kaynağı
- Satır 73: `safeFetchJson<{ success: boolean; summaries: IPOSectorSummary[] }>('/api/ipo/sector-analysis')...` -> API/Veri Kaynağı
- Satır 97: `const res = await safeFetchJson<{ success: boolean; ipo: IPOListing; similar: IPOListing[] }>(`/api/...` -> API/Veri Kaynağı

### ./src/components/LatestBalanceSheetsSection.tsx
- Satır 17: `import { safeFetchJson } from '../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 38: `safeFetchJson<{ success: boolean; data: LatestBalanceSheetItem[] }>('/api/financials/latest')...` -> API/Veri Kaynağı
- Satır 92: `await safeFetchJson('/api/notifications/subscribe', {...` -> API/Veri Kaynağı

### ./src/components/OpportunityScanner.tsx
- Satır 27: `import { safeFetchJson } from '../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 60: `safeFetchJson<any>('/api/signals/v2/drift-status').then(({ data, ok }) => {...` -> API/Veri Kaynağı
- Satır 70: `safeFetchJson<{ data: LatestBalanceSheetItem[] }>('/api/financials/latest').then(({ data, ok }) => {...` -> API/Veri Kaynağı

### ./src/components/SettingsSection.tsx
- Satır 133: `const res = await fetch('/api/telegram/test-alert', {...` -> HTTP İsteği

### ./src/components/SignalEngineV2Modal.tsx
- Satır 19: `import { safeFetchJson } from '../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 52: `const { data, ok } = await safeFetchJson<any>('/api/signals/v2/test-suite');...` -> API/Veri Kaynağı
- Satır 66: `const { data, ok } = await safeFetchJson<any>('/api/signals/v2/walk-forward', {...` -> API/Veri Kaynağı
- Satır 83: `const { data, ok } = await safeFetchJson<any>('/api/signals/v2/drift-status');...` -> API/Veri Kaynağı

### ./src/components/StockAnalysis/CompanyThesisTab.tsx
- Satır 15: `import { safeFetchJson } from '../../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 39: `safeFetchJson<{ success: boolean; data: CompanyThesis }>(`/api/stock/${symbol}/thesis`)...` -> API/Veri Kaynağı

### ./src/components/StockAnalysis/CorporateEventsTab.tsx
- Satır 16: `import { safeFetchJson } from '../../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 34: `safeFetchJson<{ success: boolean; data: CorporateEvent[] }>(`/api/stock/${symbol}/events`)...` -> API/Veri Kaynağı

### ./src/components/StockAnalysis/FinancialStatementsTab.tsx
- Satır 13: `import { safeFetchJson } from '../../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 36: `safeFetchJson<{ success: boolean; data: FinancialStatementsData }>(`/api/stock/${symbol}/financials`...` -> API/Veri Kaynağı

### ./src/components/StockAnalysis/FundamentalValuationTab.tsx
- Satır 13: `import { safeFetchJson } from '../../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 32: `safeFetchJson<{ success: boolean; data: FairValueEstimate }>(`/api/stock/${symbol}/fairvalue`)...` -> API/Veri Kaynağı

### ./src/components/StockAnalysis/FundPositionsTab.tsx
- Satır 17: `import { safeFetchJson } from '../../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 40: `safeFetchJson<{ success: boolean; data: { summary: FundPositionSummary; funds: FundDynamicsRow[] } }...` -> API/Veri Kaynağı

### ./src/components/StockAnalysis/InteractiveStockPriceChart.tsx
- Satır 138: `const rsiVal = i === 0 ? targetRSI : Math.max(0, Math.min(100, targetRSI + Math.sin(i * 0.3) * (i / ...` -> Simüle Veri (Sahte)
- Satır 143: `const macdVal = i === 0 ? targetMacd : targetMacd + Math.sin(i * 0.2) * (i / days) * (baseP * 0.02);...` -> Simüle Veri (Sahte)

### ./src/components/StockAnalysisModal.tsx
- Satır 2: `import { safeFetchJson } from "../utils/apiClient";...` -> API/Veri Kaynağı
- Satır 117: `safeFetchJson<{ news: any[] }>(`/api/market/news?search=${encodeURIComponent(analysis.symbol)}`)...` -> API/Veri Kaynağı
- Satır 132: `await safeFetchJson('/api/notifications/subscribe', {...` -> API/Veri Kaynağı

### ./src/components/StockAnalysis/MultiplesAnalysisTab.tsx
- Satır 22: `import { safeFetchJson } from '../../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 41: `safeFetchJson<{ success: boolean; data: MultipleAnalysisData }>(`/api/stock/${symbol}/multiples`)...` -> API/Veri Kaynağı

### ./src/components/StockAnalysis/PeerComparisonTab.tsx
- Satır 16: `import { safeFetchJson } from '../../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 36: `safeFetchJson<{ success: boolean; data: PeerComparisonData }>(`/api/stock/${symbol}/peers`)...` -> API/Veri Kaynağı

### ./src/components/StockAnalysis/ScorecardTab.tsx
- Satır 16: `import { safeFetchJson } from '../../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 36: `safeFetchJson<{ success: boolean; data: FinancialKarne }>(`/api/stock/${symbol}/scorecard`)...` -> API/Veri Kaynağı

### ./src/components/StockAnalysis/SeasonalityTab.tsx
- Satır 11: `import { safeFetchJson } from '../../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 28: `safeFetchJson<{ success: boolean; data: SeasonalityData }>(`/api/stock/${symbol}/seasonality`)...` -> API/Veri Kaynağı

### ./src/components/StockAnalysis/SubsidiariesAndGovernanceTab.tsx
- Satır 16: `import { safeFetchJson } from '../../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 33: `safeFetchJson<{ success: boolean; data: CompanySubsidiariesData }>(`/api/stock/${symbol}/subsidiarie...` -> API/Veri Kaynağı

### ./src/components/StockAnalysis/TechnicalEngineTab.tsx
- Satır 24: `import { safeFetchJson } from '../../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 148: `const { data, ok, error: fetchErr } = await safeFetchJson<{ success: boolean; data: TechnicalAnalysi...` -> API/Veri Kaynağı
- Satır 226: `const { data, ok, error: aiErr } = await safeFetchJson<{ success: boolean; data: AISignalInterpretat...` -> API/Veri Kaynağı

### ./src/components/Subscription/PricingSection.tsx
- Satır 27: `import { safeFetchJson } from '../../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 62: `const res = await safeFetchJson('/api/subscription/request-upgrade', {...` -> API/Veri Kaynağı

### ./src/components/TefasAiRadarModal.tsx
- Satır 4: `import { safeFetchJson } from '../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 19: `safeFetchJson<{ opportunities: OpportunitySignal[] }>('/api/ai/tefas-opportunities').then(({ data, o...` -> API/Veri Kaynağı

### ./src/components/TefasFundsSection.tsx
- Satır 26: `import { safeFetchJson } from '../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 60: `safeFetchJson<{ funds: TefasFund[] }>('/api/tefas/funds').then(({ data, ok }) => {...` -> API/Veri Kaynağı

### ./src/contexts/AdminConfigContext.tsx
- Satır 3: `import { doc, getDoc, onSnapshot } from 'firebase/firestore';...` -> Firestore DB İşlemi

### ./src/contexts/AuthContext.tsx
- Satır 4: `import { doc, getDoc, setDoc } from 'firebase/firestore';...` -> Firestore DB İşlemi
- Satır 68: `const userSnap = await getDoc(userRef);...` -> Firestore DB İşlemi
- Satır 95: `await setDoc(...` -> Firestore DB İşlemi
- Satır 133: `getDoc(userRef).then(async (userSnap) => {...` -> Firestore DB İşlemi
- Satır 163: `setDoc(userRef, {...` -> Firestore DB İşlemi

### ./src/data/tefasFundsData.ts
- Satır 772: `price: Number((Math.random() * 25 + 0.1).toFixed(4)),...` -> Simüle Veri (Sahte)

### ./src/hooks/useSubscription.ts
- Satır 15: `import { safeFetchJson } from '../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 45: `safeFetchJson<{ success: boolean; plans: Record<SubscriptionTier, SubscriptionPlanConfig> }>('/api/s...` -> API/Veri Kaynağı

### ./src/pages/Portfolio/components/TelegramAlertsModal.tsx
- Satır 35: `const res = await fetch('/api/portfolio/telegram/test', {...` -> HTTP İsteği

### ./src/pages/Portfolio/hooks/usePortfolioAI.ts
- Satır 3: `import { safeFetchJson } from '../../../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 15: `const { data, ok } = await safeFetchJson<{...` -> API/Veri Kaynağı

### ./src/pages/Portfolio/hooks/usePortfolioBacktest.ts
- Satır 3: `import { safeFetchJson } from '../../../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 14: `const { data, ok, error: fetchErr } = await safeFetchJson<{ success: boolean; error?: string } & Por...` -> API/Veri Kaynağı

### ./src/pages/Portfolio/hooks/usePortfolio.ts
- Satır 12: `import { safeFetchJson } from '../../../utils/apiClient';...` -> API/Veri Kaynağı
- Satır 13: `import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';...` -> Firestore DB İşlemi
- Satır 56: `const snapshot = await getDocs(collection(db, `users/${user?.uid}/portfolios`));...` -> Firestore DB İşlemi
- Satır 64: `const { data: apiData } = await safeFetchJson<{ success: boolean; portfolios: PortfolioItem[] }>('/a...` -> API/Veri Kaynağı
- Satır 87: `const { data: pData } = await safeFetchJson<{ success: boolean; portfolio: PortfolioItem }>(`/api/po...` -> API/Veri Kaynağı
- Satır 96: `const { data: perfData } = await safeFetchJson<{...` -> API/Veri Kaynağı
- Satır 116: `const { data: txData } = await safeFetchJson<{...` -> API/Veri Kaynağı
- Satır 126: `const { data: riskData } = await safeFetchJson<{...` -> API/Veri Kaynağı
- Satır 136: `const { data: alertData } = await safeFetchJson<{...` -> API/Veri Kaynağı
- Satır 176: `const { data: res } = await safeFetchJson<{ success: boolean; transaction: PortfolioTransaction }>(...` -> API/Veri Kaynağı
- Satır 214: `await setDoc(doc(db, `users/${user?.uid}/portfolios/${newId}`), newPortfolio);...` -> Firestore DB İşlemi
- Satır 220: `await safeFetchJson('/api/portfolio', {...` -> API/Veri Kaynağı
- Satır 253: `await setDoc(doc(db, `users/${user?.uid}/portfolios/${selectedPortfolio.id}`), updatedPortfolio);...` -> Firestore DB İşlemi
- Satır 259: `await safeFetchJson(`/api/portfolio/${selectedPortfolio.id}`, {...` -> API/Veri Kaynağı
- Satır 283: `await setDoc(doc(db, `users/${user?.uid}/portfolios/${selectedPortfolio.id}`), updatedPortfolio);...` -> Firestore DB İşlemi
- Satır 289: `await safeFetchJson(`/api/portfolio/${selectedPortfolio.id}`, {...` -> API/Veri Kaynağı
- Satır 314: `await safeFetchJson(`/api/portfolio/${id}`, { method: 'DELETE' });...` -> API/Veri Kaynağı

### ./src/services/firebaseClient.ts
- Satır 2: `import { getFirestore, doc, getDocFromServer, collection, getDocs } from 'firebase/firestore';...` -> Firestore DB İşlemi
- Satır 51: `const snap = await getDocs(collection(db, 'users'));...` -> Firestore DB İşlemi
- Satır 78: `const snap = await getDocs(collection(db, 'users'));...` -> Firestore DB İşlemi

### ./src/utils/apiClient.ts
- Satır 7: `export async function safeFetchJson<T>(...` -> API/Veri Kaynağı
- Satır 65: `const res = await fetch(url, {...` -> HTTP İsteği

### ./src/utils/clientErrorLogger.ts
- Satır 2: `import { doc, setDoc } from 'firebase/firestore';...` -> Firestore DB İşlemi
- Satır 60: `await setDoc(doc(db, 'errorLogs', logId), errorPayload);...` -> Firestore DB İşlemi
- Satır 67: `fetch('/api/public-log-error', {...` -> HTTP İsteği

### ./test-admin-db.ts
- Satır 1: `import { adminDb } from './server/services/firebaseAdminService.ts';...` -> Firestore DB İşlemi
- Satır 5: `await adminDb.collection('auditLogs').add({...` -> Firestore DB İşlemi

### ./test-admin-raw.ts
- Satır 1: `import { adminDb } from './server/services/firebaseAdminService.ts';...` -> Firestore DB İşlemi
- Satır 4: `console.log("Raw adminDb read:");...` -> Firestore DB İşlemi
- Satır 6: `const snap = await adminDb.collection('adminConfig').doc('subscriptionPlans').get();...` -> Firestore DB İşlemi
- Satır 12: `console.log("\nRaw adminDb write:");...` -> Firestore DB İşlemi
- Satır 14: `await adminDb.collection('auditLogs').add({ test: 1 });...` -> Firestore DB İşlemi

### ./test-admin-rules.sh
- Satır 16: `const { doc, setDoc } = await import('firebase/firestore');...` -> Firestore DB İşlemi
- Satır 17: `await setDoc(doc(m.serverDb, 'users', '$USER_UID'), { role: 'admin' }, { merge: true });...` -> Firestore DB İşlemi

### ./test-auth-rules.js
- Satır 6: `import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";...` -> Firestore DB İşlemi
- Satır 12: `const adminDb = getAdminDb(adminApp);...` -> Firestore DB İşlemi
- Satır 23: `await adminDb.collection("users").doc(standardUid).set({ role: "standard_user", email: "test@example...` -> Firestore DB İşlemi
- Satır 31: `const docSnap = await getDoc(doc(clientDb, "users", standardUid));...` -> Firestore DB İşlemi
- Satır 37: `await setDoc(doc(clientDb, "users", standardUid), { updatedByClient: true }, { merge: true });...` -> Firestore DB İşlemi
- Satır 43: `await getDoc(doc(clientDb, "users", "some_other_uid"));...` -> Firestore DB İşlemi
- Satır 49: `await setDoc(doc(clientDb, "adminConfig", "general"), { foo: "bar" }, { merge: true });...` -> Firestore DB İşlemi
- Satır 55: `await adminDb.collection("users").doc(adminUid).set({ role: "admin", email: "admin@example.com" });...` -> Firestore DB İşlemi
- Satır 63: `await getDoc(doc(clientDb, "adminConfig", "general"));...` -> Firestore DB İşlemi
- Satır 69: `await setDoc(doc(clientDb, "adminConfig", "test_rule"), { success: true });...` -> Firestore DB İşlemi
- Satır 74: `await adminDb.collection("users").doc(standardUid).delete();...` -> Firestore DB İşlemi
- Satır 75: `await adminDb.collection("users").doc(adminUid).delete();...` -> Firestore DB İşlemi
- Satır 76: `await adminDb.collection("adminConfig").doc("test_rule").delete();...` -> Firestore DB İşlemi

### ./test-e2e-integrity.ts
- Satır 3: `import { adminDb } from './server/services/firebaseAdminService';...` -> Firestore DB İşlemi
- Satır 22: `await adminDb.collection('data_integrity_audit').doc(testDocId).set({...` -> Firestore DB İşlemi
- Satır 31: `const getRes = await fetch(`${baseUrl}/api/admin/integrity/review-queue`);...` -> HTTP İsteği
- Satır 44: `const postRes = await fetch(`${baseUrl}/api/admin/integrity/review-queue/${testDocId}/decision`, {...` -> HTTP İsteği
- Satır 57: `const updatedDoc = await adminDb.collection('data_integrity_audit').doc(testDocId).get();...` -> Firestore DB İşlemi
- Satır 73: `await adminDb.collection('data_integrity_audit').doc(testDocId).delete().catch(() => {});...` -> Firestore DB İşlemi

### ./test-errors.ts
- Satır 1: `import { adminDb } from './server/services/firebaseAdminService.ts';...` -> Firestore DB İşlemi
- Satır 3: `const snapshot = await adminDb.collection('errorLogs').orderBy('timestamp', 'desc').limit(5).get();...` -> Firestore DB İşlemi

### ./test-fetch.js
- Satır 1: `fetch('http://example.com', { timeout: 35000 }).then(() => console.log('ok')).catch(console.error);...` -> HTTP İsteği

### ./test-firestore-rules.js
- Satır 2: `import { getFirestore, doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";...` -> Firestore DB İşlemi
- Satır 14: `await getDoc(doc(db, "adminConfig", "general"));...` -> Firestore DB İşlemi
- Satır 25: `await setDoc(doc(db, "adminConfig", "test"), { foo: "bar" });...` -> Firestore DB İşlemi
- Satır 32: `await addDoc(collection(db, "auditLogs"), { action: "test" });...` -> Firestore DB İşlemi
- Satır 39: `await getDoc(doc(db, "users", "some_other_uid"));...` -> Firestore DB İşlemi
- Satır 46: `await setDoc(doc(db, "users", auth.currentUser.uid), { test: "data" });...` -> Firestore DB İşlemi
- Satır 53: `await getDoc(doc(db, "users", auth.currentUser.uid));...` -> Firestore DB İşlemi

### ./test-mod1-scenarios.ts
- Satır 1: `import { adminDb, getUserRole } from './server/services/firebaseAdminService.ts';...` -> Firestore DB İşlemi
- Satır 7: `const originalGet = adminDb.collection('adminConfig').doc('subscriptionPlans').get;...` -> Firestore DB İşlemi
- Satır 8: `adminDb.collection('adminConfig').doc('subscriptionPlans').get = async () => {...` -> Firestore DB İşlemi
- Satır 24: `adminDb.collection('adminConfig').doc('subscriptionPlans').get = originalGet;...` -> Firestore DB İşlemi
- Satır 31: `const originalGetDoc = require('firebase/firestore').getDoc;...` -> Firestore DB İşlemi

### ./test-trick.cjs
- Satır 25: `var import_yahoo_finance2 = __toESM(require("yahoo-finance2"), 1);...` -> Yahoo Finance
- Satır 28: `yf.quote("AAPL").then((res) => console.log(res.regularMarketPrice)).catch(console.error);...` -> Yahoo Finance

### ./test-trick.ts
- Satır 1: `import yfAny from 'yahoo-finance2';...` -> Yahoo Finance
- Satır 4: `yf.quote("AAPL").then(res => console.log(res.regularMarketPrice)).catch(console.error);...` -> Yahoo Finance

### ./test-tsx.cjs
- Satır 25: `var import_yahoo_finance2 = __toESM(require("yahoo-finance2"), 1);...` -> Yahoo Finance

### ./test-tsx.ts
- Satır 1: `import yf from 'yahoo-finance2';...` -> Yahoo Finance
- Satır 3: `console.log(yf.search);...` -> Yahoo Finance

### ./test-worker-health-monitor.ts
- Satır 18: `const res = await fetch('http://127.0.0.1:3000/api/health');...` -> HTTP İsteği

### ./test-yf2.cjs
- Satır 1: `const { YahooFinance } = require("yahoo-finance2");...` -> Yahoo Finance
- Satır 3: `yf.quote("AAPL").then(res => console.log(res.regularMarketPrice)).catch(console.error);...` -> Yahoo Finance

### ./test-yf3.cjs
- Satır 1: `const yfClass = require("yahoo-finance2").default;...` -> Yahoo Finance
- Satır 3: `yf.quote("AAPL").then(res => console.log(res.regularMarketPrice)).catch(console.error);...` -> Yahoo Finance

### ./test-yf4.cjs
- Satır 1: `const yfClass = require("yahoo-finance2").default;...` -> Yahoo Finance

### ./test-yf.cjs
- Satır 1: `const yf = require("yahoo-finance2").default;...` -> Yahoo Finance
- Satır 2: `yf.quote("AAPL").then(res => console.log(res.regularMarketPrice)).catch(console.error);...` -> Yahoo Finance

