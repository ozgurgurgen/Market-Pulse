import admin from "firebase-admin";
admin.initializeApp();
async function test() {
  try {
    const token = await admin.auth().createCustomToken("test-uid-123", { role: "standard_user" });
    console.log("Token:", token.substring(0, 20) + "...");
  } catch (e) {
    console.error(e);
  }
}
test();
