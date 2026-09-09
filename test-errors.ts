import { adminDb } from './server/services/firebaseAdminService.ts';
async function run() {
  const snapshot = await adminDb.collection('errorLogs').orderBy('timestamp', 'desc').limit(5).get();
  snapshot.forEach(doc => console.log(doc.data()));
}
run();
