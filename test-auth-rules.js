import { initializeApp as initAdmin } from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { getFirestore as getAdminDb } from "firebase-admin/firestore";
import { initializeApp as initClient } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const adminApp = initAdmin();
const adminAuth = getAdminAuth(adminApp);
const adminDb = getAdminDb(adminApp);

const clientApp = initClient(config);
const clientAuth = getAuth(clientApp);
const clientDb = getFirestore(clientApp);

async function run() {
  try {
    console.log("--- MODÜL A: YETKİLİ ERİŞİM TESTLERİ ---");
    // 1. Create a mock standard user
    const standardUid = "test_user_" + Date.now();
    await adminDb.collection("users").doc(standardUid).set({ role: "standard_user", email: "test@example.com" });
    const standardToken = await adminAuth.createCustomToken(standardUid);
    
    await signInWithCustomToken(clientAuth, standardToken);
    console.log(`✅ Giriş yapıldı (Normal Kullanıcı). UID: ${clientAuth.currentUser.uid}`);
    
    // Normal user read own doc
    try {
      const docSnap = await getDoc(doc(clientDb, "users", standardUid));
      console.log(`✅ Normal kullanıcı kendi dokümanını okudu. Rol: ${docSnap.data().role}`);
    } catch(e) { console.log(`❌ HATA (Okuma): ${e.message}`); }
    
    // Normal user write own doc
    try {
      await setDoc(doc(clientDb, "users", standardUid), { updatedByClient: true }, { merge: true });
      console.log(`✅ Normal kullanıcı kendi dokümanını güncelledi.`);
    } catch(e) { console.log(`❌ HATA (Yazma): ${e.message}`); }
    
    // Normal user read other doc (Should Fail)
    try {
      await getDoc(doc(clientDb, "users", "some_other_uid"));
      console.log(`❌ HATA: Normal kullanıcı başkasının dokümanını okuyabildi!`);
    } catch(e) { console.log(`✅ Normal kullanıcı başkasının dokümanını okuyamadı (Beklenen: ${e.code}).`); }

    // Normal user write adminConfig (Should Fail)
    try {
      await setDoc(doc(clientDb, "adminConfig", "general"), { foo: "bar" }, { merge: true });
      console.log(`❌ HATA: Normal kullanıcı adminConfig yazabildi!`);
    } catch(e) { console.log(`✅ Normal kullanıcı adminConfig yazamadı (Beklenen: ${e.code}).`); }
    
    console.log("\n--- ADMIN TESTİ ---");
    const adminUid = "test_admin_" + Date.now();
    await adminDb.collection("users").doc(adminUid).set({ role: "admin", email: "admin@example.com" });
    const adminToken = await adminAuth.createCustomToken(adminUid);
    
    await signInWithCustomToken(clientAuth, adminToken);
    console.log(`✅ Giriş yapıldı (Admin Kullanıcı). UID: ${clientAuth.currentUser.uid}`);
    
    // Admin read adminConfig
    try {
      await getDoc(doc(clientDb, "adminConfig", "general"));
      console.log(`✅ Admin, adminConfig okuyabildi.`);
    } catch(e) { console.log(`❌ HATA (Admin Okuma): ${e.message}`); }
    
    // Admin write adminConfig
    try {
      await setDoc(doc(clientDb, "adminConfig", "test_rule"), { success: true });
      console.log(`✅ Admin, adminConfig yazabildi.`);
    } catch(e) { console.log(`❌ HATA (Admin Yazma): ${e.message}`); }
    
    // Cleanup
    await adminDb.collection("users").doc(standardUid).delete();
    await adminDb.collection("users").doc(adminUid).delete();
    await adminDb.collection("adminConfig").doc("test_rule").delete();

  } catch(e) {
    console.error(e);
  }
  process.exit(0);
}
run();
