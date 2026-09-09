import { updateUserSubscription } from './server/services/subscriptionService';

async function runTest() {
  console.log('\n--- TEST 1: Real IAM Permission Denied (Admin SDK) ---');
  try {
    await updateUserSubscription('valid_user_123', { tier: 'pro' });
  } catch (err: any) {
    const errorStr = err.originalError ? String(err.originalError) : err.message;
    if (errorStr.includes('PERMISSION_DENIED')) {
      console.log('✅ Caught TRUE Permission Denied (gRPC 7). Service Account lacks Firestore Write IAM role.');
      console.log('Error Log Detail:', errorStr);
    } else {
      console.log('❌ Caught unexpected error type:', errorStr);
    }
  }

  console.log('\n--- TEST 2: Malformed Path (Validation Error) ---');
  try {
    await updateUserSubscription('', { tier: 'pro' });
  } catch (err: any) {
    const errorStr = err.originalError ? String(err.originalError) : err.message;
    if (errorStr.includes('valid resource path')) {
      console.log('✅ Caught expected Malformed Path (Input Validation) error.');
      console.log('Error Log Detail:', errorStr);
    } else {
      console.log('❌ Caught unexpected error type:', errorStr);
    }
  }
  process.exit(0);
}

runTest();
