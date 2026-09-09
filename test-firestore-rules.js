import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const app = initializeApp(config);
const db = getFirestore(app);
const auth = getAuth(app);

async function runTests() {
  console.log("--- TEST 1: UNAUTHENTICATED ---");
  try {
    await getDoc(doc(db, "adminConfig", "general"));
    console.log("❌ Unauthenticated can read adminConfig");
  } catch (e) {
    console.log("✅ Unauthenticated blocked from reading adminConfig:", e.code);
  }

  console.log("\n--- TEST 2: ANONYMOUS AUTH ---");
  await signInAnonymously(auth);
  console.log("Signed in anonymously. UID:", auth.currentUser.uid);
  
  try {
    await setDoc(doc(db, "adminConfig", "test"), { foo: "bar" });
    console.log("❌ Anon can write adminConfig");
  } catch (e) {
    console.log("✅ Anon blocked from writing adminConfig:", e.code);
  }

  try {
    await addDoc(collection(db, "auditLogs"), { action: "test" });
    console.log("❌ Anon can write auditLogs");
  } catch (e) {
    console.log("✅ Anon blocked from writing auditLogs:", e.code);
  }

  try {
    await getDoc(doc(db, "users", "some_other_uid"));
    console.log("❌ Anon can read other user doc");
  } catch (e) {
    console.log("✅ Anon blocked from reading other user doc:", e.code);
  }
  
  try {
    await setDoc(doc(db, "users", auth.currentUser.uid), { test: "data" });
    console.log("✅ Anon can write OWN user doc");
  } catch (e) {
    console.log("❌ Anon blocked from writing OWN user doc:", e.code);
  }
  
  try {
    await getDoc(doc(db, "users", auth.currentUser.uid));
    console.log("✅ Anon can read OWN user doc");
  } catch (e) {
    console.log("❌ Anon blocked from reading OWN user doc:", e.code);
  }

  process.exit(0);
}

runTests();
