import { getUserRole } from './server/services/firebaseAdminService.ts';
import { getDynamicSubscriptionPlans } from './server/services/adminConfigService.ts';

async function test() {
  console.log("--- TEST 1: getUserRole (should throw CriticalSecurityError) ---");
  try {
    await getUserRole('some_uid');
    console.log("FAIL: getUserRole succeeded silently!");
  } catch (e: any) {
    if (e.name === 'CriticalSecurityError') {
      console.log("SUCCESS: getUserRole failed loudly as expected!");
      console.error(e.message);
    } else {
      console.log("Unexpected error:", e);
    }
  }

  console.log("\n--- TEST 2: getDynamicSubscriptionPlans (should throw CriticalSecurityError) ---");
  try {
    await getDynamicSubscriptionPlans();
    console.log("FAIL: getDynamicSubscriptionPlans succeeded silently!");
  } catch (e: any) {
    if (e.name === 'CriticalSecurityError') {
      console.log("SUCCESS: getDynamicSubscriptionPlans failed loudly as expected!");
      console.error(e.message);
    } else {
      console.log("Unexpected error:", e);
    }
  }
}
test();
