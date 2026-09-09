import express from 'express';
import { adminIntegrityRouter } from './server/routes/adminIntegrityRouter';
import { adminDb } from './server/services/firebaseAdminService';
import http from 'http';

async function testIntegrityRouterE2E() {
  console.log("=== 🧪 TEST: adminIntegrityRouter.ts E2E Real Test ===");
  
  const app = express();
  app.use(express.json());
  app.use('/api/admin/integrity', adminIntegrityRouter);

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address() as any;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  const testDocId = 'test_integrity_doc_' + Date.now();

  try {
    // 1. Seed a doc in Firestore
    await adminDb.collection('data_integrity_audit').doc(testDocId).set({
      ticker: 'TEST_TICKER',
      validation_status: 'pending_human_review',
      fetched_at: new Date().toISOString(),
      issue_type: 'PRICE_OUTLIER'
    });
    console.log("1. Firestore'a test verisi eklendi:", testDocId);

    // 2. GET /api/admin/integrity/review-queue
    const getRes = await fetch(`${baseUrl}/api/admin/integrity/review-queue`);
    const getBody: any = await getRes.json();
    console.log("2. GET /review-queue HTTP Status:", getRes.status);
    console.log("   HTTP Response Body:", JSON.stringify(getBody).slice(0, 150));

    if (getRes.status !== 200) throw new Error(`GET 200 bekleniyordu, ${getRes.status} alındı.`);
    if (!Array.isArray(getBody.queue)) throw new Error("Yanıtta queue dizisi bulunamadı!");
    const foundDoc = getBody.queue.find((item: any) => item.id === testDocId);
    if (!foundDoc) throw new Error("Eklenen doküman queue içerisinde bulunamadı!");

    console.log("   ✅ GET /review-queue başarıyla dokümanı listeledi:", foundDoc.id);

    // 3. POST /api/admin/integrity/review-queue/:id/decision
    const postRes = await fetch(`${baseUrl}/api/admin/integrity/review-queue/${testDocId}/decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision: 'APPROVED', notes: 'Verified by unit test' })
    });
    const postBody: any = await postRes.json();
    console.log("3. POST /decision HTTP Status:", postRes.status);
    console.log("   HTTP Response Body:", JSON.stringify(postBody));

    if (postRes.status !== 200) throw new Error(`POST 200 bekleniyordu, ${postRes.status} alındı.`);
    if (!postBody.success) throw new Error("POST success: true dönmedi!");

    // 4. Verify in Firestore
    const updatedDoc = await adminDb.collection('data_integrity_audit').doc(testDocId).get();
    const data = updatedDoc.data();
    console.log("4. Güncellenmiş Firestore Verisi:", JSON.stringify(data));

    if (data?.validation_status !== 'APPROVED') {
      throw new Error(`validation_status APPROVED bekleniyordu, ${data?.validation_status} alındı.`);
    }

    console.log("   ✅ POST decision Firestore'da validation_status = 'APPROVED' yaptı.");
    console.log("✅ adminIntegrityRouter E2E testi TAM BAŞARILI!");

  } catch (err: any) {
    console.error("❌ INTEGRITY TEST BAŞARISIZ:", err.message);
    process.exitCode = 1;
  } finally {
    server.close();
    await adminDb.collection('data_integrity_audit').doc(testDocId).delete().catch(() => {});
  }
}

testIntegrityRouterE2E();
