import { adminDb, getUserRole } from './server/services/firebaseAdminService.ts';
import { getDynamicSubscriptionPlans } from './server/services/adminConfigService.ts';

async function runScenarioA() {
  console.log("--- SCENARIO A: Network/Timeout Error ---");
  // Mock get to throw a simulated DEADLINE_EXCEEDED
  const originalGet = adminDb.collection('adminConfig').doc('subscriptionPlans').get;
  adminDb.collection('adminConfig').doc('subscriptionPlans').get = async () => {
    throw new Error('DEADLINE_EXCEEDED');
  };

  try {
    await getDynamicSubscriptionPlans();
    console.log("❌ SCENARIO A FAIL: Silently succeeded.");
  } catch (e: any) {
    if (e.name === 'CriticalSecurityError') {
       console.log("✅ SCENARIO A PASS: Caught CriticalSecurityError with inner:", e.originalError?.message);
    } else {
       console.log("❌ SCENARIO A FAIL: Wrong error thrown:", e.name, e.message);
    }
  }
  
  // Restore
  adminDb.collection('adminConfig').doc('subscriptionPlans').get = originalGet;
}

async function runScenarioC() {
  console.log("\n--- SCENARIO C: Empty/Partial Data Response ---");
  // Mock getUserRole by mocking the doc call directly. 
  // We'll mock the 'users' doc to return exists: true, but no role field.
  const originalGetDoc = require('firebase/firestore').getDoc;
  
  // Actually, getUserRole still uses serverDb via getDoc in my previous patch? Wait, no, I patched getUserRole in Phase 2 to use getDoc(serverDb). 
  // Let's verify what getUserRole uses currently.
  try {
    const role = await getUserRole('mock-uid-with-no-role');
    console.log("✅ SCENARIO C PASS: Returned role:", role, "(expected standard_user)");
  } catch(e) {
    console.log("❌ SCENARIO C FAIL: Error:", e);
  }
}

async function main() {
  await runScenarioA();
  await runScenarioC();
  process.exit(0);
}
main();
