import { adminDb } from './server/services/firebaseAdminService.ts';
async function readErrors() {
    const snap = await adminDb.collection('errorLogs').orderBy('timestamp', 'desc').limit(5).get();
    snap.forEach(doc => console.log(doc.data()));
}
readErrors().catch(console.error);
