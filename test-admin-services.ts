import { getDynamicSubscriptionPlans } from './server/services/adminConfigService.ts';
import { logAudit } from './server/services/auditService.ts';

async function test() {
  console.log("1. Testing getDynamicSubscriptionPlans()...");
  try {
    const plans = await getDynamicSubscriptionPlans();
    console.log("Plans loaded:", Object.keys(plans));
  } catch (e: any) {
    console.error("Failed getDynamicSubscriptionPlans:", e.message);
  }

  console.log("\n2. Testing logAudit()...");
  try {
    await logAudit('TEST_ADMIN', 'admin_123', 'Testing admin SDK audit log');
    console.log("logAudit completed!");
  } catch (e: any) {
    console.error("Failed logAudit:", e.message);
  }
}
test();
