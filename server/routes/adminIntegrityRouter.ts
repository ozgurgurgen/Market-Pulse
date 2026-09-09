import { Router } from 'express';
import { adminDb } from '../services/firebaseAdminService';
import { serverLocalDatabase } from '../services/serverLocalDatabase';
import { CanaryTestRunner } from '../dataAdapters/testing/CanaryTestRunner';
import { ABComparisonHarness } from '../dataAdapters/testing/ABComparisonHarness';
import { QuoteSourceManager } from '../dataAdapters/managers/QuoteSourceManager';
import { FundSourceManager, MacroSourceManager } from '../dataAdapters/managers/FundAndMacroSourceManagers';

export const adminIntegrityRouter = Router();

// ==========================================
// ANTI-CORRUPTION LAYER (ACL) HEALTH & A/B TEST
// ==========================================

// 1. Run all Canary Health Checks
adminIntegrityRouter.get('/adapters/health', async (req, res) => {
  try {
    const report = await CanaryTestRunner.runAllCanaryTests();
    res.json({ success: true, ...report });
  } catch (error: any) {
    console.error('[AdminIntegrityRouter] Canary test error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Run A/B Comparison Diff Tests
adminIntegrityRouter.get('/adapters/ab-test', async (req, res) => {
  try {
    const [stockTest, fundTest] = await Promise.all([
      ABComparisonHarness.runStockABTest(),
      ABComparisonHarness.runFundABTest()
    ]);
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      stockTest,
      fundTest
    });
  } catch (error: any) {
    console.error('[AdminIntegrityRouter] A/B test error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Test Single Normalized Quote
adminIntegrityRouter.get('/adapters/quote/:symbol', async (req, res) => {
  try {
    const quote = await QuoteSourceManager.getQuote(req.params.symbol);
    res.json({ success: true, quote });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Test Single Normalized Fund
adminIntegrityRouter.get('/adapters/fund/:code', async (req, res) => {
  try {
    const fund = await FundSourceManager.getFund(req.params.code);
    res.json({ success: true, fund });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Test Normalized Macro Indicators
adminIntegrityRouter.get('/adapters/macro', async (req, res) => {
  try {
    const indicators = await MacroSourceManager.getAllIndicators();
    res.json({ success: true, count: indicators.length, indicators });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Minimal human review queue endpoint
adminIntegrityRouter.get('/review-queue', async (req, res) => {
  try {
    let queue: any[] = [];
    let storage = 'firestore';
    try {
      const snapshot = await adminDb.collection('data_integrity_audit')
        .where('validation_status', 'in', ['pending_human_review', 'anomaly_flagged'])
        .orderBy('fetched_at', 'desc')
        .limit(50)
        .get();

      queue = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e: any) {
      console.warn('[AdminIntegrityRouter] Firestore fetch fallback to local:', e?.message || e);
      storage = 'server_local_database';
      const local = serverLocalDatabase.list('data_integrity_audit');
      queue = local
        .filter((l: any) => l.data?.validation_status === 'pending_human_review' || l.data?.validation_status === 'anomaly_flagged')
        .sort((a: any, b: any) => new Date(b.data?.fetched_at || 0).getTime() - new Date(a.data?.fetched_at || 0).getTime())
        .slice(0, 50)
        .map((l: any) => ({ id: l.id, ...l.data }));
    }
    res.json({ queue, storage });
  } catch (error: any) {
    console.error('[AdminIntegrityRouter] Failed to fetch review queue:', error);
    res.status(500).json({ error: error?.message || 'Internal server error' });
  }
});

// Endpoint to approve/reject
adminIntegrityRouter.post('/review-queue/:id', async (req, res) => {
  try {
    const { action, reviewed_by } = req.body; // action: 'approve' or 'reject'
    if (!action || !['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Geçersiz işlem. action "approve" veya "reject" olmalıdır.' });
    }
    const updates = {
      validation_status: action === 'approve' ? 'verified' : 'rejected_human',
      reviewed_by: reviewed_by || 'admin_user',
      reviewed_at: new Date().toISOString()
    };
    
    let updatedInFirestore = false;
    try {
      await adminDb.collection('data_integrity_audit').doc(req.params.id).set(updates, { merge: true });
      updatedInFirestore = true;
    } catch (e: any) {
      console.warn('[AdminIntegrityRouter] Firestore write notice, falling back to local storage:', e?.message || e);
      const existing = serverLocalDatabase.get('data_integrity_audit', req.params.id) || {};
      serverLocalDatabase.upsert('data_integrity_audit', req.params.id, { ...existing, ...updates });
    }
    
    res.json({
      success: true,
      updatedInFirestore,
      storage: updatedInFirestore ? 'firestore' : 'server_local_database'
    });
  } catch (error: any) {
    console.error('[AdminIntegrityRouter] Review decision error:', error);
    res.status(500).json({ error: error?.message || 'Internal server error' });
  }
});

