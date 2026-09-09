import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "famous-phalanx-413107",
  appId: "1:292796514931:web:bd4e79c904c423852f6006",
  apiKey: "AIzaSyB2q6hwQte852V5De-cDbJBNoRBDKeMmXE",
  authDomain: "famous-phalanx-413107.firebaseapp.com",
  storageBucket: "famous-phalanx-413107.firebasestorage.app",
  messagingSenderId: "292796514931",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app, "ai-studio-marketpulseaitef-9befce23-8089-4716-9c4d-feabc89be875");

async function seedUser() {
  try {
    let user;
    try {
      const cred = await createUserWithEmailAndPassword(auth, 'boschozgur@gmail.com', 'ozgur9615');
      user = cred.user;
      console.log("Created new user.");
    } catch (e: any) {
      if (e.code === 'auth/email-already-in-use') {
         console.log("User exists, logging in...");
         const cred = await signInWithEmailAndPassword(auth, 'boschozgur@gmail.com', 'ozgur9615');
         user = cred.user;
      } else {
         throw e;
      }
    }
    
    // Write user doc (Allowed by uid == userId)
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      fullName: 'Özgür',
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString()
    }, { merge: true });
    
    // Now this user is admin, they can write to roles!
    await setDoc(doc(db, 'roles', 'admin'), { description: 'Tam yetkili yönetici', permissions: ['admin.*'] });
    await setDoc(doc(db, 'roles', 'standard_user'), { description: 'Standart kullanıcı', permissions: ['academy.access'] });
    await setDoc(doc(db, 'roles', 'premium_user'), { description: 'Premium abone', permissions: ['academy.access', 'screener.access', 'macro.access', 'tefas.access'] });

    console.log("User and roles successfully set as admin.");
    process.exit(0);
  } catch (error: any) {
    console.error("Error:", error);
    process.exit(1);
  }
}
seedUser();
