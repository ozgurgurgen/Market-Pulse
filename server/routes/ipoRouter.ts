import { Router, Request, Response } from 'express';
import { ipoDataService } from '../services/ipoDataService';
import { requireAdmin } from '../middlewares/requireAdmin';
import { requirePermission } from '../middlewares/authMiddleware';
import { parseIpoDeepAnalysisDocument } from '../../src/utils/ipoAnalysisUtils';

import { requireAuth } from '../middlewares/authMiddleware';
import { loadSubscriptionContext } from '../middlewares/subscriptionGuard';
import { maskIpoData } from '../utils/paywallMasker';

export const ipoRouter = Router();

/**
 * POST /api/ipo/parse-deep-analysis
 * Parses unstructured or raw JSON prospectus/KAP text into the standard 5-part deep analysis schema
 */
ipoRouter.post('/parse-deep-analysis', async (req: Request, res: Response) => {
  try {
    const { documentText, rawJson } = req.body;
    const input = documentText || rawJson || req.body;
    const parsed = parseIpoDeepAnalysisDocument(input);
    return res.json({ success: true, analysis: parsed });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/ipo/listings
 * Retrieves all active, upcoming, and completed IPO listings
 */
ipoRouter.get('/listings', requireAuth, loadSubscriptionContext, async (req: Request, res: Response) => {
  try {
    const listings = await ipoDataService.getAllIpos({
      status: req.query.status as string,
      search: req.query.search as string,
      sector: req.query.sector as string
    });
    const maskedListings = (listings.data || []).map(ipo => maskIpoData(ipo, req.planTier));
    return res.json({ success: true, count: maskedListings.length, listings: maskedListings });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/ipo/sector-analysis
 * Computes sector distribution & return metrics
 */
ipoRouter.get('/sector-analysis', async (req: Request, res: Response) => {
  try {
    const summaries = await ipoDataService.getSectorAnalysis();
    return res.json({ success: true, summaries });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/ipo/listings/:id
 * Retrieves a single IPO and similar past IPOs for comparison
 */
ipoRouter.get('/listings/:id', requireAuth, loadSubscriptionContext, async (req: Request, res: Response) => {
  try {
    const ipo = await ipoDataService.getIpoById(req.params.id);
    if (!ipo) {
      return res.status(404).json({ success: false, error: 'Halka arz kaydı bulunamadı' });
    }
    const similar = await ipoDataService.getSimilarIpos(req.params.id);
    const maskedIpo = maskIpoData(ipo, req.planTier);
    const maskedSimilar = similar.map(s => maskIpoData(s, req.planTier));
    return res.json({ success: true, ipo: maskedIpo, similar: maskedSimilar });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// ADMIN IPO MANAGEMENT ENDPOINTS
// ==========================================

export const adminIpoRouter = Router();
adminIpoRouter.use(requireAdmin);

/**
 * POST /api/admin/ipo/upsert
 */
adminIpoRouter.post('/upsert', async (req: Request, res: Response) => {
  try {
    const ipoData = req.body;
    if (!ipoData || typeof ipoData !== 'object' || Array.isArray(ipoData)) {
      return res.status(400).json({ success: false, error: 'Geçersiz Halka Arz verisi. Nesne bekleniyor.' });
    }

    if (!ipoData.companyName || typeof ipoData.companyName !== 'string' || !ipoData.companyName.trim()) {
      return res.status(400).json({ success: false, error: 'Halka arz kaydı için şirket adı (companyName) zorunludur.' });
    }

    if (!ipoData.ticker || typeof ipoData.ticker !== 'string' || !ipoData.ticker.trim()) {
      return res.status(400).json({ success: false, error: 'Halka arz kaydı için hisse kodu (ticker) zorunludur.' });
    }

    if (ipoData.offerPrice !== undefined && (typeof ipoData.offerPrice !== 'number' || ipoData.offerPrice < 0)) {
      return res.status(400).json({ success: false, error: 'Halka arz fiyatı (offerPrice) pozitif sayı olmalıdır.' });
    }

    const adminUid = req.user.uid;
    const adminEmail = req.user.email || 'admin@marketpulse.local';

    const saved = await ipoDataService.upsertIpo(req.body);
    return res.json({ success: true, ipo: saved });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/admin/ipo/:id
 */
adminIpoRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const adminUid = req.user.uid;
    const adminEmail = req.user.email || 'admin@marketpulse.local';

    const success = await ipoDataService.deleteIpo(req.params.id);
    return res.json({ success });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/admin/ipo/sync
 */
adminIpoRouter.post('/sync', async (req: Request, res: Response) => {
  try {
    const result = await ipoDataService.syncWithOfficialSources();
    return res.json({ success: true, ...result });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
