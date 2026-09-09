import { Router, Request, Response } from 'express';
import { apiDiagnosticsService } from '../services/apiDiagnosticsService';
import { logAudit } from '../services/auditService';

export const apiDiagnosticsRouter = Router();

/**
 * GET /api/admin/api-diagnostics
 * Returns full diagnostics overview, sources, null-data audits, and recent logs
 */
apiDiagnosticsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const summary = apiDiagnosticsService.getGlobalSummary();
    const sources = apiDiagnosticsService.getAllSources();
    const nullAudits = apiDiagnosticsService.generateNullDataAudit();
    const recentLogs = apiDiagnosticsService.getRecentLogs(60);

    return res.json({
      success: true,
      summary,
      sources,
      nullAudits,
      recentLogs
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/admin/api-diagnostics/intervals
 * Update API sync / update frequency intervals
 */
apiDiagnosticsRouter.post('/intervals', async (req: Request, res: Response) => {
  try {
    const { configs } = req.body;
    if (!configs || typeof configs !== 'object') {
      return res.status(400).json({ success: false, error: 'Geçersiz aralık konfigürasyon nesnesi.' });
    }

    const adminEmail = (req as any).user?.email || 'admin';
    const adminUid = (req as any).user?.uid || 'admin';

    const result = apiDiagnosticsService.updateIntervals(configs, adminEmail);

    logAudit(
      'UPDATE_API_SYNC_INTERVALS',
      adminUid,
      `Admin (${adminEmail}) API güncelleme ve senkronizasyon sıklıklarını güncelledi (${result.updatedCount} API).`,
      { adminEmail, newValue: { configs } }
    );

    return res.json({
      success: true,
      message: `${result.updatedCount} adet API senkronizasyon sıklığı başarıyla kaydedildi.`,
      sources: apiDiagnosticsService.getAllSources()
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/admin/api-diagnostics/test-api
 * Run live ping and health check on a specific API
 */
apiDiagnosticsRouter.post('/test-api', async (req: Request, res: Response) => {
  try {
    const { apiId } = req.body;
    if (!apiId) {
      return res.status(400).json({ success: false, error: 'apiId zorunludur.' });
    }

    const result = await apiDiagnosticsService.runApiHealthCheck(apiId);
    return res.json({
      success: true,
      result,
      sources: apiDiagnosticsService.getAllSources()
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/admin/api-diagnostics/sync-now
 * Force immediate data pipeline sync for an API or all APIs
 */
apiDiagnosticsRouter.post('/sync-now', async (req: Request, res: Response) => {
  try {
    const { apiId } = req.body;
    const adminEmail = (req as any).user?.email || 'admin';
    const adminUid = (req as any).user?.uid || 'admin';

    if (apiId === 'ALL' || !apiId) {
      const sources = apiDiagnosticsService.getAllSources();
      const results = [];
      for (const s of sources) {
        const syncRes = await apiDiagnosticsService.triggerDataSync(s.id);
        results.push(syncRes);
      }

      logAudit(
        'MANUAL_GLOBAL_API_SYNC',
        adminUid,
        `Admin (${adminEmail}) tüm veri boru hatları ve API'ler için manuel senkronizasyon tetikledi.`,
        { adminEmail, newValue: { totalSynced: results.length } }
      );

      return res.json({
        success: true,
        message: 'Tüm API ve veri kaynakları başarıyla senkronize edildi.',
        results,
        sources: apiDiagnosticsService.getAllSources(),
        summary: apiDiagnosticsService.getGlobalSummary()
      });
    }

    const result = await apiDiagnosticsService.triggerDataSync(apiId);

    logAudit(
      'MANUAL_API_SYNC',
      adminUid,
      `Admin (${adminEmail}) ${apiId} kaynağı için anlık senkronizasyon tetikledi.`,
      { adminEmail, targetId: apiId, newValue: { result } }
    );

    return res.json({
      success: true,
      result,
      sources: apiDiagnosticsService.getAllSources(),
      summary: apiDiagnosticsService.getGlobalSummary()
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
