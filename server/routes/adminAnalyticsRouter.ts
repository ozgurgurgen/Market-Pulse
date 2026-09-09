import { Router, Request, Response } from 'express';
import { requireAdmin } from '../middlewares/requireAdmin';
import { 
  getLatestAnalyticsSnapshot, 
  computeAnalyticsSnapshot, 
  generateAiAnalyticsInsights,
  AiModelConfig 
} from '../services/analyticsSnapshotService';
import { logAudit, logSystemError } from '../services/auditService';
import { adminDb } from '../services/firebaseAdminService';
import { serverLocalDatabase } from '../services/serverLocalDatabase';

export const adminAnalyticsRouter = Router();

// Apply requireAdmin on all analytics routes
adminAnalyticsRouter.use(requireAdmin);

/**
 * 1. GET /api/admin/analytics/overview
 * Layer A: Aggregated Usage & Activity Analytics
 * Fast read from pre-computed snapshot. Zero PII.
 */
adminAnalyticsRouter.get('/overview', async (req: Request, res: Response) => {
  try {
    const snapshot = await getLatestAnalyticsSnapshot();
    return res.json({
      success: true,
      data: {
        snapshotId: snapshot.id,
        generatedAt: snapshot.generatedAt,
        privacyThresholdApplied: snapshot.privacyThresholdApplied,
        usage: snapshot.usage
      }
    });
  } catch (error: any) {
    logSystemError(error, 'GET_ANALYTICS_OVERVIEW', req);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 2. GET /api/admin/analytics/portfolio
 * Layer B: Aggregated Portfolio & Financial Trends
 * Enforces K-Anonymity privacy threshold (<5 user segments suppressed/grouped).
 * Fast read from pre-computed snapshot. Zero PII.
 */
adminAnalyticsRouter.get('/portfolio', async (req: Request, res: Response) => {
  try {
    const snapshot = await getLatestAnalyticsSnapshot();
    return res.json({
      success: true,
      data: {
        snapshotId: snapshot.id,
        generatedAt: snapshot.generatedAt,
        privacyThresholdApplied: snapshot.privacyThresholdApplied,
        portfolio: snapshot.portfolio
      }
    });
  } catch (error: any) {
    logSystemError(error, 'GET_ANALYTICS_PORTFOLIO', req);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 3. POST /api/admin/analytics/refresh
 * Manually recalculates analytics snapshot.
 */
adminAnalyticsRouter.post('/refresh', async (req: Request, res: Response) => {
  try {
    const adminEmail = req.user?.email || 'admin@marketpulse.local';
    const snapshot = await computeAnalyticsSnapshot(`manual_refresh:${adminEmail}`);

    await logAudit(
      'REFRESH_ANALYTICS_SNAPSHOT',
      req.user.uid,
      `Admin (${adminEmail}) kullanıcı ve portföy analitik özetini (snapshot) manuel olarak yeniden hesapladı.`,
      {
        adminEmail,
        newValue: { snapshotId: snapshot.id, totalUsers: snapshot.usage.totalUsers }
      }
    );

    return res.json({
      success: true,
      message: 'Analitik verileri başarıyla yeniden hesaplandı ve kaydedildi.',
      snapshot
    });
  } catch (error: any) {
    logSystemError(error, 'REFRESH_ANALYTICS_SNAPSHOT', req);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 4. POST /api/admin/analytics/ai-insights
 * Runs AI-powered Strategic Analysis on aggregated trends.
 * Supports dynamic selection of Gemini models OR Local LLM (Ollama / custom endpoints).
 */
adminAnalyticsRouter.post('/ai-insights', async (req: Request, res: Response) => {
  try {
    const { provider, modelName, customEndpointUrl, customApiKey, temperature } = req.body || {};
    
    const config: AiModelConfig = {
      provider: provider || 'gemini',
      modelName: modelName || 'gemini-3.7-flash',
      customEndpointUrl: customEndpointUrl || '',
      customApiKey: customApiKey || '',
      temperature: typeof temperature === 'number' ? temperature : 0.3
    };

    const adminEmail = req.user?.email || 'admin@marketpulse.local';
    const result = await generateAiAnalyticsInsights(config, adminEmail);

    return res.json(result);
  } catch (error: any) {
    logSystemError(error, 'GENERATE_AI_ANALYTICS_INSIGHTS', req);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 5. GET /api/admin/users/:userId/support-detail
 * Layer C: Individual User Support View
 * RESTRICTED: Mandatory Reason required.
 * UNCONDITIONAL AUDIT LOGGING on every single read.
 * Returns only minimal necessary data for customer support.
 */
adminAnalyticsRouter.get('/users/:userId/support-detail', async (req: Request, res: Response) => {
  const { userId } = req.params;
  const reason = (req.query.reason as string || '').trim();
  const adminEmail = req.user?.email || 'admin@marketpulse.local';
  const adminUid = req.user?.uid || 'unknown_admin';

  // Strict Validation: Reason MUST be provided and meaningful (>= 5 chars)
  if (!reason || reason.length < 5) {
    return res.status(400).json({
      success: false,
      error: 'KVKK ve Denetim Kuralı: Bireysel kullanıcı destek detayını görüntülemek için en az 5 karakterlik geçerli bir gerekçe (reason) belirtilmesi zorunludur.',
      code: 'REASON_REQUIRED'
    });
  }

  // Unconditional Audit Logging before serving data
  await logAudit(
    'VIEW_INDIVIDUAL_USER_DATA',
    adminUid,
    `Admin (${adminEmail}), "${userId}" kullanıcısının destek detaylarını inceledi. Gerekçe: "${reason}"`,
    {
      adminEmail,
      targetId: userId,
      ipAddress: req.ip,
      newValue: { reason, requestedAt: new Date().toISOString() }
    }
  );

  try {
    let userData: any = null;

    // Fetch user from Firestore
    try {
      const docSnap = await adminDb.collection('users').doc(userId).get();
      if (docSnap.exists) {
        userData = { ...docSnap.data(), uid: docSnap.id };
      }
    } catch {}

    // Fallback to local DB
    if (!userData) {
      userData = serverLocalDatabase.get<any>('users', userId);
    }

    if (!userData) {
      return res.status(404).json({
        success: false,
        error: `"${userId}" ID'li kullanıcı veritabanında bulunamadı.`
      });
    }

    // Filter to MINIMAL NECESSARY FIELDS for support purpose
    const supportView = {
      uid: userData.uid || userId,
      email: userData.email || '—',
      fullName: userData.fullName || '—',
      role: userData.role || 'standard_user',
      isActive: userData.isActive !== false,
      createdAt: userData.createdAt || null,
      lastLoginAt: userData.lastLoginAt || userData.updatedAt || null,
      subscription: userData.subscription || {
        tier: 'free',
        status: 'active',
        grantedAt: null,
        expiresAt: null
      },
      usage: userData.usage || {
        analysisQueriesToday: 0,
        aiReportsThisPeriod: 0,
        lastResetDate: new Date().toISOString().slice(0, 10)
      },
      auditNotice: {
        accessLogged: true,
        loggedReason: reason,
        accessTimestamp: new Date().toISOString(),
        auditedBy: adminEmail
      }
    };

    return res.json({
      success: true,
      data: supportView
    });
  } catch (error: any) {
    logSystemError(error, 'VIEW_INDIVIDUAL_USER_SUPPORT_DETAIL', req);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 6. GET /api/admin/analytics/export
 * Downloads aggregate analytics in CSV format
 */
adminAnalyticsRouter.get('/export', async (req: Request, res: Response) => {
  try {
    const snapshot = await getLatestAnalyticsSnapshot();
    
    let csvContent = 'Kategori,Metrik,Deger,Oran/Detay\n';
    
    // Usage section
    csvContent += `Kullanim,Toplam Kayitli Kullanici,${snapshot.usage.totalUsers},-\n`;
    csvContent += `Kullanim,Aktif Kullanici (24s),${snapshot.usage.activeUsers24h},-\n`;
    csvContent += `Kullanim,Aktif Kullanici (7g),${snapshot.usage.activeUsers7d},-\n`;
    
    // Subscription section
    for (const sub of snapshot.usage.subscriptionDistribution) {
      csvContent += `Uyelik Paketi,${sub.tier},${sub.count},%${sub.percentage}\n`;
    }

    // Top Watchlist
    for (const w of snapshot.portfolio.topWatchlistedTickers) {
      csvContent += `En Cok Takip Edilen,${w.symbol},${w.watcherCount},${w.name}\n`;
    }

    // Asset Classes
    for (const a of snapshot.portfolio.assetClassDistribution) {
      csvContent += `Varlik Sinifi,${a.assetClass},%${a.percentage},${a.estimatedValueShare}\n`;
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="MarketPulse_Analytics_${new Date().toISOString().slice(0,10)}.csv"`);
    return res.send('\uFEFF' + csvContent);
  } catch (error: any) {
    logSystemError(error, 'EXPORT_ANALYTICS_CSV', req);
    return res.status(500).json({ success: false, error: error.message });
  }
});
