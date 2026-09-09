import { updateUserSubscription, getUserSubscriptionAndUsage } from './server/services/subscriptionService';

async function runTest() {
  const fakeUid = 'migration_test_user_123';
  
  console.log('--- TEST 1: Grant Premium via Admin SDK ---');
  try {
    const updatedSub = await updateUserSubscription(fakeUid, {
      tier: 'premium',
      durationDays: 30,
      note: 'Admin Migration Test'
    });
    console.log('✅ updateUserSubscription output:', updatedSub.tier);
    
    // Verify it actually saved via reading it back
    const { subscription } = await getUserSubscriptionAndUsage(fakeUid);
    if (subscription.tier === 'premium') {
      console.log('✅ Successfully granted and verified premium via Admin SDK to Firestore!');
    } else {
      console.log('❌ Failed: Tier was not premium when reading back.');
    }
  } catch (err: any) {
    console.error('❌ Test failed with error:', err.message);
  }

  // To simulate failure, let's call it with undefined? 
  // Admin SDK bypasses security rules, but let's try something that errors (e.g. invalid document path like empty uid if we bypass the validation)
  console.log('\n--- TEST 2: Invalid/Missing Permissions / Network error ---');
  try {
    // Empty UID usually throws an error in Firestore path 
    await updateUserSubscription('', { tier: 'pro' });
  } catch (err: any) {
    if (err.name === 'CriticalSecurityError') {
      console.log('✅ Caught expected CriticalSecurityError on invalid op:', err.message);
    } else {
      console.log('❌ Caught unexpected error type:', err.message);
    }
  }

  process.exit(0);
}

runTest();
