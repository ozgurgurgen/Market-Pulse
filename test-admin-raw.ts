import { adminDb } from './server/services/firebaseAdminService.ts';

async function test() {
  console.log("Raw adminDb read:");
  try {
    const snap = await adminDb.collection('adminConfig').doc('subscriptionPlans').get();
    console.log("Exists:", snap.exists);
  } catch (e: any) {
    console.error("Read Error:", e.message);
  }

  console.log("\nRaw adminDb write:");
  try {
    await adminDb.collection('auditLogs').add({ test: 1 });
    console.log("Write success");
  } catch (e: any) {
    console.error("Write Error:", e.message);
  }
}
test();
