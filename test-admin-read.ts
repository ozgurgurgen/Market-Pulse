import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const app = initializeApp({ projectId: 'famous-phalanx-413107' });
const db = getFirestore(app, 'ai-studio-marketpulseaitef-9befce23-8089-4716-9c4d-feabc89be875');

async function test() {
  try {
    const snap = await db.collection('roles').get();
    console.log("Read success:", snap.size);
  } catch (e) {
    console.error("Read failed:", e);
  }
}
test();
