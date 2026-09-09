import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const app = initializeApp({ projectId: 'famous-phalanx-413107' });
const auth = getAuth(app);

async function test() {
  try {
    const user = await auth.createUser({
      email: 'boschozgur123@gmail.com',
      password: 'password123',
    });
    console.log("Created:", user.uid);
  } catch (e) {
    console.error("Auth failed:", e);
  }
}
test();
