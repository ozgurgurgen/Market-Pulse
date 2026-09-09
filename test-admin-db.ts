import { adminDb } from './server/services/firebaseAdminService.ts';

async function test() {
  try {
    await adminDb.collection('auditLogs').add({
      action: 'TEST_ADMIN_SDK',
      timestamp: new Date().toISOString()
    });
    console.log("Admin SDK write successful!");
  } catch (e: any) {
    console.error("Admin SDK write failed:", e.message);
  }
}

test();
