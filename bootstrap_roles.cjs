const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'famous-phalanx-413107' });
const db = admin.firestore();
const DB_ID = "ai-studio-marketpulseaitef-9befce23-8089-4716-9c4d-feabc89be875";

async function run() {
  const adminDb = db.collection ? db : admin.firestore(admin.app(), DB_ID);
  
  await adminDb.collection('roles').doc('admin').set({
    description: 'Tam yetkili yönetici',
    permissions: ['admin.*']
  });
  
  await adminDb.collection('roles').doc('standard_user').set({
    description: 'Standart kullanıcı',
    permissions: ['academy.access']
  });
  
  await adminDb.collection('roles').doc('premium_user').set({
    description: 'Premium abone',
    permissions: ['academy.access', 'screener.access', 'macro.access']
  });
  
  console.log("Roles bootstrapped.");
}
run();
