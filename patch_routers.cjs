const fs = require('fs');

function patchSubscriptionRouter() {
  let content = fs.readFileSync('server/routes/subscriptionRouter.ts', 'utf8');

  // Replace serverDb import with adminDb
  content = content.replace(/import \{ serverDb \} from '\.\.\/services\/firebaseClientService';/, "import { adminDb } from '../services/firebaseAdminService';");
  
  // POST /request-upgrade
  content = content.replace(/await addDoc\(collection\(serverDb, 'upgrade_requests'\), requestRecord\);/g, 
    "await adminDb.collection('upgrade_requests').add(requestRecord);");

  // GET /users-subscriptions
  content = content.replace(/await getDocs\(collection\(serverDb, 'users'\)\);/g, 
    "await adminDb.collection('users').get();");

  // Fix firestore imports
  content = content.replace(/import \{ collection, addDoc, getDocs \} from 'firebase\/firestore';/, '');

  fs.writeFileSync('server/routes/subscriptionRouter.ts', content);
}

function patchAdminRouter() {
  let content = fs.readFileSync('server/routes/adminRouter.ts', 'utf8');

  // Replace serverDb import with adminDb
  content = content.replace(/import \{ serverDb \} from '\.\.\/services\/firebaseClientService';/, "import { adminDb } from '../services/firebaseAdminService';");
  
  // GET /users
  content = content.replace(/await getDocs\(collection\(serverDb, 'users'\)\);/g, 
    "await adminDb.collection('users').get();");

  // POST /users/role
  content = content.replace(/await setDoc\(doc\(serverDb, 'users', targetUid\), \{[\s\S]*?\}, \{ merge: true \}\);/g, 
    "await adminDb.collection('users').doc(targetUid).set({ role: newRole, updatedAt: new Date().toISOString() }, { merge: true });");

  // POST /users/ban
  content = content.replace(/await setDoc\(doc\(serverDb, 'users', targetUid\), \{[\s\S]*?\}, \{ merge: true \}\);/g, 
    "await adminDb.collection('users').doc(targetUid).set({ isBanned, banReason: reason || '', updatedAt: new Date().toISOString() }, { merge: true });");

  // Fix firestore imports
  content = content.replace(/import \{ collection, getDocs, doc, setDoc \} from 'firebase\/firestore';/, '');

  fs.writeFileSync('server/routes/adminRouter.ts', content);
}

patchSubscriptionRouter();
patchAdminRouter();
