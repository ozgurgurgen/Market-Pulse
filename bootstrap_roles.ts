import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const app = initializeApp({ projectId: 'famous-phalanx-413107' });
const db = getFirestore(app, 'ai-studio-marketpulseaitef-9befce23-8089-4716-9c4d-feabc89be875');

async function run() {
  await db.collection('roles').doc('admin').set({
    description: 'Tam yetkili yönetici',
    permissions: ['admin.*']
  });
  
  await db.collection('roles').doc('standard_user').set({
    description: 'Standart kullanıcı',
    permissions: ['academy.access']
  });
  
  await db.collection('roles').doc('premium_user').set({
    description: 'Premium abone',
    permissions: ['academy.access', 'screener.access', 'macro.access', 'tefas.access']
  });
  
  console.log("Roles bootstrapped.");
}
run();
