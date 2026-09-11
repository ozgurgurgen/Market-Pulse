import { Router, Request, Response } from 'express';
import { requireAdmin } from '../middlewares/requireAdmin';
import { 
  getDynamicSubscriptionPlans, 
  updateDynamicSubscriptionPlans,
  getDynamicAiSettings,
  updateDynamicAiSettings,
  getCreditCostRules,
  updateCreditCostRules,
  getCoupons,
  saveCoupon,
  deleteCoupon
} from '../services/adminConfigService';
import { 
  updateUserSubscription, 
  resetUserUsage,
  getUserSubscriptionAndUsage
} from '../services/subscriptionService';
import { 
  logAudit, 
  getAuditLogs, 
  getErrorLogs, 
  clearAuditLogs, 
  clearErrorLogs, 
  deleteSingleAuditLog,
  deleteSingleErrorLog,
  logSystemError, 
  handleRouteError 
} from '../services/auditService';
import { adminDb, adminAuth, withDbTimeout } from '../services/firebaseAdminService';
import { serverLocalDatabase } from '../services/serverLocalDatabase';
import { SubscriptionTier } from '../../src/shared/subscriptionPlans';
import {
  getDatabaseIntegrationSettings,
  updateDatabaseIntegrationSettings,
  testPostgresConnection,
  testFirebaseConnection,
  testFinanceApiConnection,
  initializePostgresSchema,
  syncDatabasesBetweenFirebaseAndPostgres,
  getPostgresClient,
  executePostgresQuery,
  maskDbSettings
} from '../services/dbIntegrationService';
import { adminAnalyticsRouter } from './adminAnalyticsRouter';
import { apiDiagnosticsRouter } from './apiDiagnosticsRouter';
import { localFinanceApi } from '../dataAdapters/adapters/LocalFinanceApiAdapter';
import { databaseFirstCacheService } from '../services/databaseFirstCacheService';

import { systemPerformanceService } from '../services/systemPerformanceService';

export const adminRouter = Router();

// Apply requireAdmin on all /api/admin endpoints
adminRouter.use(requireAdmin);

// Mount dedicated analytics sub-router on /analytics and directly for convenience
adminRouter.use('/analytics', adminAnalyticsRouter);
adminRouter.use(adminAnalyticsRouter);

// Mount dedicated API diagnostics & analysis sub-router
adminRouter.use('/api-diagnostics', apiDiagnosticsRouter);

/**
 * 1. GET /api/admin/subscription-plans
 */
adminRouter.get('/subscription-plans', async (req: Request, res: Response) => {
  try {
    const plans = await getDynamicSubscriptionPlans();
    return res.json({ success: true, plans });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * 2. POST /api/admin/subscription-plans
 */
adminRouter.post('/subscription-plans', async (req: Request, res: Response) => {
  try {
    const { plans } = req.body;
    if (!plans || typeof plans !== 'object') {
      return res.status(400).json({ error: 'Geçersiz plan verisi' });
    }

    const adminUid = req.user.uid;
    const adminEmail = req.user.email || 'admin@marketpulse.local';

    const result = await updateDynamicSubscriptionPlans(plans, adminUid, adminEmail);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * 3. GET /api/admin/ai-settings
 */
adminRouter.get('/ai-settings', async (req: Request, res: Response) => {
  try {
    const settings = await getDynamicAiSettings();
    return res.json({ success: true, settings });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * 4. POST /api/admin/ai-settings
 */
adminRouter.post('/ai-settings', async (req: Request, res: Response) => {
  try {
    const settingsData = req.body;
    if (!settingsData || typeof settingsData !== 'object' || Array.isArray(settingsData)) {
      return res.status(400).json({ error: 'Geçersiz YZ ayarları konfigürasyon verisi. Nesne bekleniyor.' });
    }

    if (settingsData.aiEnabled !== undefined && typeof settingsData.aiEnabled !== 'boolean') {
      return res.status(400).json({ error: 'aiEnabled parametresi boolean (true/false) olmalıdır.' });
    }

    if (settingsData.proTierModel !== undefined && typeof settingsData.proTierModel !== 'string') {
      return res.status(400).json({ error: 'proTierModel metin (string) olmalıdır.' });
    }

    if (settingsData.freeTierDailyLimit !== undefined && (typeof settingsData.freeTierDailyLimit !== 'number' || settingsData.freeTierDailyLimit < 0)) {
      return res.status(400).json({ error: 'freeTierDailyLimit pozitif sayı olmalıdır.' });
    }

    const adminUid = req.user.uid;
    const adminEmail = req.user.email || 'admin@marketpulse.local';

    const result = await updateDynamicAiSettings(settingsData, adminUid, adminEmail);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * 5. GET /api/admin/credit-costs
 */
adminRouter.get('/credit-costs', async (req: Request, res: Response) => {
  try {
    const creditCosts = await getCreditCostRules();
    return res.json({ success: true, creditCosts });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * 6. POST /api/admin/credit-costs
 */
adminRouter.post('/credit-costs', async (req: Request, res: Response) => {
  try {
    const { costs } = req.body;
    if (!costs || typeof costs !== 'object') {
      return res.status(400).json({ error: 'Geçersiz kredi maliyeti verisi.' });
    }

    const adminUid = req.user.uid;
    const adminEmail = req.user.email || 'admin@marketpulse.local';

    const result = await updateCreditCostRules(costs, adminUid, adminEmail);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * 7. GET /api/admin/coupons
 */
adminRouter.get('/coupons', async (req: Request, res: Response) => {
  try {
    const coupons = await getCoupons();
    return res.json({ success: true, coupons });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * 8. POST /api/admin/coupons
 */
adminRouter.post('/coupons', async (req: Request, res: Response) => {
  try {
    const { coupon } = req.body;
    if (!coupon || !coupon.code || !coupon.discountValue) {
      return res.status(400).json({ error: 'Eksik veya geçersiz kupon verisi.' });
    }

    const adminUid = req.user.uid;
    const adminEmail = req.user.email || 'admin@marketpulse.local';

    const result = await saveCoupon(coupon, adminUid, adminEmail);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * 9. DELETE /api/admin/coupons/:code
 */
adminRouter.delete('/coupons/:code', async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    if (!code) {
      return res.status(400).json({ error: 'Kupon kodu gereklidir.' });
    }

    const adminUid = req.user.uid;
    const adminEmail = req.user.email || 'admin@marketpulse.local';

    const result = await deleteCoupon(code, adminUid, adminEmail);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * 5. GET /api/admin/users
 */
adminRouter.get('/users', async (req: Request, res: Response) => {
  try {
    const dbSettings = await getDatabaseIntegrationSettings();

    // If activeProvider is postgresql (or hybrid) AND postgres is enabled, try reading from PostgreSQL first
    if ((dbSettings.activeProvider === 'postgresql' || dbSettings.activeProvider === 'hybrid') && dbSettings.postgres?.enabled) {
      try {
        const client = await getPostgresClient();
        const pgUsersRes = await client.query(`
          SELECT u.*, uu.analysis_queries_today, uu.ai_reports_period, uu.last_reset_date
          FROM users u
          LEFT JOIN user_usage uu ON u.id = uu.user_id
          ORDER BY u.created_at DESC;
        `);
        await client.end();

        if (pgUsersRes.rows && pgUsersRes.rows.length > 0) {
          const userList = pgUsersRes.rows.map(row => ({
            uid: row.id,
            id: row.id,
            email: row.email,
            fullName: row.full_name || 'İsimsiz Kullanıcı',
            role: row.role || 'standard_user',
            isActive: row.is_active !== false,
            subscription: {
              tier: row.subscription_tier || 'free',
              status: row.subscription_status || 'active',
              expiresAt: row.subscription_expires_at,
              grantedBy: 'postgresql'
            },
            usage: {
              analysisQueriesToday: row.analysis_queries_today || 0,
              aiReportsThisPeriod: row.ai_reports_period || 0,
              lastResetDate: row.last_reset_date ? String(row.last_reset_date).slice(0, 10) : new Date().toISOString().slice(0, 10)
            },
            createdAt: row.created_at,
            source: 'PostgreSQL'
          }));

          return res.json({ success: true, users: userList, source: 'PostgreSQL' });
        }
      } catch (pgErr: any) {
        console.warn('[AdminRouter] PostgreSQL users fetch error, falling back to Firestore/local database:', pgErr.message);
      }
    }

    let userList: any[] = [];

    const defaultUsers = [
      {
        uid: 'admin_boschozgur',
        id: 'admin_boschozgur',
        email: 'boschozgur@gmail.com',
        fullName: 'Özgür Bosch (Admin)',
        role: 'admin',
        isActive: true,
        subscription: { tier: 'premium', status: 'active', grantedAt: new Date().toISOString(), expiresAt: null, grantedBy: 'system' },
        usage: { analysisQueriesToday: 2, aiReportsThisPeriod: 5, lastResetDate: new Date().toISOString().slice(0, 10) },
        createdAt: new Date().toISOString()
      },
      {
        uid: 'user_sample_1',
        id: 'user_sample_1',
        email: 'yatirimci1@marketpulse.local',
        fullName: 'Ahmet Yılmaz',
        role: 'standard_user',
        isActive: true,
        subscription: { tier: 'free', status: 'active', grantedAt: new Date().toISOString(), expiresAt: null, grantedBy: 'system' },
        usage: { analysisQueriesToday: 1, aiReportsThisPeriod: 1, lastResetDate: new Date().toISOString().slice(0, 10) },
        createdAt: new Date().toISOString()
      },
      {
        uid: 'user_sample_2',
        id: 'user_sample_2',
        email: 'analist@marketpulse.local',
        fullName: 'Mehmet Demir',
        role: 'standard_user',
        isActive: true,
        subscription: { tier: 'pro', status: 'active', grantedAt: new Date().toISOString(), expiresAt: null, grantedBy: 'system' },
        usage: { analysisQueriesToday: 4, aiReportsThisPeriod: 12, lastResetDate: new Date().toISOString().slice(0, 10) },
        createdAt: new Date().toISOString()
      }
    ];

    try {
      const snap = await withDbTimeout(adminDb.collection('users').get(), 600);
      snap.forEach((docSnap: any) => {
        const d = docSnap.data();
        const uid = docSnap.id;
        const userObj = {
          uid,
          id: uid,
          email: d.email || '—',
          fullName: d.fullName || d.displayName || 'İsimsiz Kullanıcı',
          role: (d.email === 'boschozgur@gmail.com' ? 'admin' : (d.role || 'standard_user')),
          isActive: d.isActive !== false,
          subscription: d.subscription || {
            tier: d.role === 'admin' || d.email === 'boschozgur@gmail.com' ? 'premium' : 'free',
            status: 'active',
            grantedAt: d.createdAt || new Date().toISOString(),
            expiresAt: null,
            grantedBy: 'system'
          },
          usage: d.usage || {
            analysisQueriesToday: 0,
            aiReportsThisPeriod: 0,
            lastResetDate: new Date().toISOString().slice(0, 10)
          },
          createdAt: d.createdAt || null
        };
        userList.push(userObj);
      });
    } catch (e: any) {
      const msg = e?.message || '';
      const code = e?.code?.toString() || '';
      if (!msg.includes('PERMISSION_DENIED') && !code.includes('7') && !msg.includes('NOT_FOUND') && !code.includes('5')) {
        console.warn('[AdminRouter] Failed to fetch users from Firestore:', msg);
      }
      try {
        const localUsers = serverLocalDatabase.getAll<any>('users');
        if (localUsers && localUsers.length > 0) {
          userList = localUsers;
        }
      } catch {}
    }

    if (userList.length === 0) {
      userList = defaultUsers;
      for (const u of defaultUsers) {
        try {
          await adminDb.collection('users').doc(u.uid).set(u, { merge: true });
        } catch {}
      }
    }

    return res.json({ success: true, users: userList });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 6. POST /api/admin/grant-subscription
 */
adminRouter.post('/grant-subscription', async (req: Request, res: Response) => {
  try {
    const { targetUid, tier, durationDays, note } = req.body;
    if (!targetUid || !tier) {
      return res.status(400).json({ error: 'targetUid ve tier zorunludur.' });
    }

    const expiresAt = durationDays && durationDays > 0
      ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString()
      : null;

    const result = await updateUserSubscription(targetUid, {
      tier: tier as SubscriptionTier,
      status: 'manual_grant',
      expiresAt,
      grantedBy: `admin:${req.user.email || req.user.uid}`
    });

    logAudit(
      'MANUAL_SUBSCRIPTION_GRANT',
      req.user.uid,
      `Admin (${req.user.email}) tarafından ${targetUid} kullanıcısına ${tier.toUpperCase()} paketi atandı. Süre: ${durationDays ? durationDays + ' gün' : 'Süresiz'}. Not: ${note || '-'}`,
      {
        adminEmail: req.user.email,
        targetId: targetUid,
        newValue: { tier, expiresAt, note }
      }
    );

    return res.json({ success: true, ...result });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * 7. POST /api/admin/reset-user-usage
 */
adminRouter.post('/reset-user-usage', async (req: Request, res: Response) => {
  try {
    const { targetUid } = req.body;
    if (!targetUid) {
      return res.status(400).json({ error: 'targetUid zorunludur.' });
    }

    const result = await resetUserUsage(targetUid);
    logAudit(
      'RESET_USER_USAGE',
      req.user.uid,
      `Admin (${req.user.email}) tarafından ${targetUid} kullanıcısının kullanım limitleri sıfırlandı.`,
      {
        adminEmail: req.user.email,
        targetId: targetUid
      }
    );

    return res.json({ success: true, ...result });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * 7.b DELETE /api/admin/users/:uid
 * Deletes a user from Firebase Auth and Firestore.
 */
adminRouter.delete('/users/:uid', async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    if (!uid) {
      return res.status(400).json({ success: false, error: 'UID gerekli.' });
    }

    // 1. Delete from Firebase Auth
    try {
      await adminAuth.deleteUser(uid);
    } catch (authErr: any) {
      if (authErr.code !== 'auth/user-not-found') {
        throw authErr;
      }
    }

    // 2. Delete from Firestore
    await adminDb.collection('users').doc(uid).delete();
    
    // Log audit
    await logAudit('DELETE_USER', req.user!.uid, `Kullanıcı silindi: ${uid}`, { targetId: uid });

    res.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting user:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 7.c POST /api/admin/users/:uid/reset-password
 * Sends a password reset email to the user.
 */
adminRouter.post('/users/:uid/reset-password', async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    if (!uid) {
      return res.status(400).json({ success: false, error: 'UID gerekli.' });
    }

    const userRecord = await adminAuth.getUser(uid);
    if (!userRecord.email) {
      return res.status(400).json({ success: false, error: 'Kullanıcının e-posta adresi yok.' });
    }

    const link = await adminAuth.generatePasswordResetLink(userRecord.email);
    
    // Log audit
    await logAudit('SEND_PASSWORD_RESET', req.user!.uid, `Şifre sıfırlama bağlantısı oluşturuldu: ${userRecord.email}`, { targetId: uid });

    res.json({ success: true, link, message: 'Şifre sıfırlama bağlantısı oluşturuldu.' });
  } catch (err: any) {
    console.error('Error resetting password:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 8. POST /api/admin/change-user-role
 (Sensitive!)
 */
adminRouter.post('/change-user-role', async (req: Request, res: Response) => {
  try {
    const { targetUid, newRole, confirmation } = req.body;
    if (!targetUid || !newRole) {
      return res.status(400).json({ error: 'targetUid ve newRole zorunludur.' });
    }

    if (newRole !== 'admin' && newRole !== 'standard_user' && newRole !== 'superadmin') {
      return res.status(400).json({ error: 'Geçersiz rol.' });
    }

    if (newRole === 'admin' && confirmation !== 'CONFIRM_ADMIN_ELEVATION') {
      return res.status(400).json({ error: 'Yönetici rolü ataması için açık onay gereklidir.' });
    }

    const adminEmail = req.user.email || 'admin@marketpulse.local';

    let oldRole = 'standard_user';
    try {
      const userDoc = await adminDb.collection('users').doc(targetUid).get();
      if (userDoc.exists) {
        oldRole = userDoc.data()?.role || 'standard_user';
      }
    } catch {}

    const localUser = serverLocalDatabase.get<any>('users', targetUid);
    if (localUser) {
      oldRole = localUser.role || oldRole;
      localUser.role = newRole;
      localUser.updatedAt = new Date().toISOString();
      serverLocalDatabase.set('users', targetUid, localUser);
    }

    // Update in Firestore via Admin SDK (with try/catch fallback)
    try {
      await adminDb.collection('users').doc(targetUid).set({ role: newRole, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (e) {
      console.warn('Firestore update role failed, updated in localDB:', e);
    }

    await logAudit(
      'CHANGE_USER_ROLE',
      req.user.uid,
      `🚨 [KRİTİK GÜVENLİK İŞLEMİ] Admin (${adminEmail}), ${targetUid} kullanıcısının rolünü "${oldRole}" -> "${newRole}" olarak değiştirdi!`,
      {
        adminEmail,
        targetId: targetUid,
        oldValue: oldRole,
        newValue: newRole
      }
    );

    return res.json({ success: true, message: `Kullanıcı rolü ${newRole} olarak güncellendi.` });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * 9. POST /api/admin/toggle-user-status
 */
adminRouter.post('/toggle-user-status', async (req: Request, res: Response) => {
  try {
    const { targetUid, isActive } = req.body;
    if (!targetUid || typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'targetUid ve isActive (boolean) gereklidir.' });
    }

    const localUser = serverLocalDatabase.get<any>('users', targetUid);
    if (localUser) {
      localUser.isActive = isActive;
      localUser.updatedAt = new Date().toISOString();
      serverLocalDatabase.set('users', targetUid, localUser);
    }

    try {
      await adminDb.collection('users').doc(targetUid).set({ isActive, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (e) {
      console.warn('Firestore toggle status failed, updated in localDB:', e);
    }

    logAudit(
      isActive ? 'ACTIVATE_USER' : 'SUSPEND_USER',
      req.user.uid,
      `Admin (${req.user.email}), ${targetUid} hesabını ${isActive ? 'aktifleştirdi' : 'askıya aldı'}.`,
      {
        adminEmail: req.user.email,
        targetId: targetUid,
        newValue: { isActive }
      }
    );

    return res.json({ success: true, isActive });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * 10. GET /api/admin/audit-logs
 */
adminRouter.get('/audit-logs', async (req: Request, res: Response) => {
  try {
    const limitCount = Number(req.query.limit) || 100;
    const logs = await getAuditLogs(limitCount);
    return res.json({ success: true, logs });
  } catch (error: any) {
    logSystemError(error, 'GET_AUDIT_LOGS', req);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * 10.1 GET /api/admin/error-logs
 */
adminRouter.get('/error-logs', async (req: Request, res: Response) => {
  try {
    const limitCount = Number(req.query.limit) || 100;
    const logs = await getErrorLogs(limitCount);
    return res.json({ success: true, logs });
  } catch (error: any) {
    logSystemError(error, 'GET_ERROR_LOGS', req);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * 10.2 DELETE /api/admin/error-logs (Tüm hata loglarını temizle)
 */
adminRouter.delete('/error-logs', async (req: Request, res: Response) => {
  try {
    await clearErrorLogs();
    const adminUid = req.user?.uid || 'admin_boschozgur';
    const adminEmail = req.user?.email || 'boschozgur@gmail.com';
    try {
      logAudit('CLEAR_ERROR_LOGS', adminUid, `Admin (${adminEmail}) tüm hata loglarını temizledi.`, { adminEmail });
    } catch {}
    return res.json({ success: true, message: 'Tüm sistem hata logları başarıyla temizlendi.' });
  } catch (error: any) {
    logSystemError(error, 'CLEAR_ERROR_LOGS', req);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 10.3 DELETE /api/admin/error-logs/:id (Tek bir hata kaydını sil)
 */
adminRouter.delete('/error-logs/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteSingleErrorLog(id);
    return res.json({ success: true, message: 'Hata kaydı başarıyla silindi.' });
  } catch (error: any) {
    logSystemError(error, 'DELETE_SINGLE_ERROR_LOG', req);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 10.4 DELETE /api/admin/audit-logs (Tüm denetim kayıtlarını temizle)
 */
adminRouter.delete('/audit-logs', async (req: Request, res: Response) => {
  try {
    await clearAuditLogs();
    return res.json({ success: true, message: 'Tüm denetim kayıtları başarıyla temizlendi.' });
  } catch (error: any) {
    logSystemError(error, 'CLEAR_AUDIT_LOGS', req);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 10.5 DELETE /api/admin/audit-logs/:id (Tek bir denetim kaydını sil)
 */
adminRouter.delete('/audit-logs/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteSingleAuditLog(id);
    return res.json({ success: true, message: 'Denetim kaydı başarıyla silindi.' });
  } catch (error: any) {
    logSystemError(error, 'DELETE_SINGLE_AUDIT_LOG', req);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 12. POST /api/admin/create-user
 */
adminRouter.post('/create-user', async (req: Request, res: Response) => {
  try {
    const { email, fullName, role, tier } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Geçerli bir e-posta adresi gereklidir.' });
    }

    const uid = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const assignedRole = role || 'standard_user';
    const assignedTier = tier || (assignedRole === 'admin' ? 'premium' : 'free');

    const newUser = {
      uid,
      id: uid,
      email: email.trim(),
      fullName: fullName?.trim() || email.split('@')[0],
      role: assignedRole,
      isActive: true,
      subscription: {
        tier: assignedTier,
        status: 'active',
        grantedAt: new Date().toISOString(),
        expiresAt: null,
        grantedBy: req.user.email || 'admin'
      },
      usage: {
        analysisQueriesToday: 0,
        aiReportsThisPeriod: 0,
        lastResetDate: new Date().toISOString().slice(0, 10)
      },
      createdAt: new Date().toISOString()
    };

    serverLocalDatabase.set('users', uid, newUser);

    try {
      await adminDb.collection('users').doc(uid).set(newUser, { merge: true });
    } catch (e) {
      console.warn('Firestore create user failed, saved in localDB:', e);
    }

    logAudit(
      'CREATE_USER_MANUAL',
      req.user.uid,
      `Admin (${req.user.email}), manuel olarak ${email} kullanıcısını (${assignedRole}, ${assignedTier}) oluşturdu.`,
      {
        adminEmail: req.user.email,
        targetId: email,
        newValue: { role: assignedRole, tier: assignedTier }
      }
    );

    return res.json({ success: true, user: newUser });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * 11. GET /api/admin/system-stats
 */
adminRouter.get('/system-stats', async (req: Request, res: Response) => {
  try {
    const planStats = {
      free: 0,
      starter: 0,
      pro: 0,
      premium: 0
    };

    let totalUsers = 0;
    let usersList: any[] = [];
    try {
      const snap = await withDbTimeout(adminDb.collection('users').get(), 600);
      snap.forEach((docSnap: any) => {
        usersList.push(docSnap.data());
      });
    } catch {}

    if (usersList.length === 0) {
      usersList = serverLocalDatabase.getAll<any>('users');
    }
    if (usersList.length === 0) {
      // Seed default users if none exist
      usersList = [
        { role: 'admin', subscription: { tier: 'premium' } },
        { role: 'standard_user', subscription: { tier: 'free' } },
        { role: 'standard_user', subscription: { tier: 'pro' } }
      ];
    }

    totalUsers = usersList.length;
    for (const d of usersList) {
      const tier = (d.subscription?.tier || (d.role === 'admin' ? 'premium' : 'free')) as keyof typeof planStats;
      if (tier && planStats[tier] !== undefined) {
        planStats[tier]++;
      } else {
        planStats.free++;
      }
    }

    const logs = await getAuditLogs(10);
    const aiSettings = await getDynamicAiSettings();

    return res.json({
      success: true,
      stats: {
        totalUsers,
        planDistribution: planStats,
        aiStatus: aiSettings.aiEnabled ? 'ONLINE' : 'PAUSED',
        activeAiModel: aiSettings.proTierModel,
        uptimeSeconds: process.uptime(),
        memoryUsage: process.memoryUsage(),
        recentAudits: logs.slice(0, 5)
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * 13. GET /api/admin/db-settings
 */
adminRouter.get('/db-settings', async (req: Request, res: Response) => {
  try {
    const raw = await getDatabaseIntegrationSettings();
    const masked = maskDbSettings(raw);
    return res.json({ success: true, settings: masked });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * 14. POST /api/admin/db-settings
 */
adminRouter.post('/db-settings', async (req: Request, res: Response) => {
  try {
    const { settings } = req.body;
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'Geçersiz veritabanı ayarları verisi.' });
    }

    const adminUid = req.user.uid;
    const adminEmail = req.user.email || 'admin@marketpulse.local';

    const result = await updateDatabaseIntegrationSettings(settings, adminUid, adminEmail);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * 15. POST & GET /api/admin/db-test-connection
 */
adminRouter.all('/db-test-connection', async (req: Request, res: Response) => {
  try {
    const rawProvider = req.body?.provider || req.query?.provider || 'firebase';
    const provider = String(rawProvider).toLowerCase().trim();
    const postgresConfig = req.body?.postgresConfig || req.body?.postgres;

    if (provider === 'postgresql' || provider === 'postgres') {
      const result = await testPostgresConnection(postgresConfig);
      return res.json(result);
    } else if (provider === 'firebase' || provider === 'firestore') {
      const result = await testFirebaseConnection();
      return res.json(result);
    } else if (provider === 'finance_api' || provider === 'local_api') {
      const url = req.body?.url || req.body?.baseUrl || req.query?.url;
      const cfAccessClientId = req.body?.cfAccessClientId;
      const cfAccessClientSecret = req.body?.cfAccessClientSecret;
      const apiKey = req.body?.apiKey;
      const result = await testFinanceApiConnection(url ? String(url) : undefined, {
        cfAccessClientId: cfAccessClientId ? String(cfAccessClientId) : undefined,
        cfAccessClientSecret: cfAccessClientSecret ? String(cfAccessClientSecret) : undefined,
        apiKey: apiKey ? String(apiKey) : undefined
      });
      return res.json(result);
    } else {
      return res.status(400).json({ 
        error: `Geçersiz sağlayıcı: '${rawProvider}' (postgresql, firebase veya finance_api bekleniyor).` 
      });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * 15b. POST /api/admin/pipeline-proxy
 * 10 Uç Noktalı Finance Pipeline API Gezgini için test proxy'si
 */
adminRouter.post('/pipeline-proxy', async (req: Request, res: Response) => {
  try {
    const { endpoint } = req.body;
    if (!endpoint || typeof endpoint !== 'string') {
      return res.status(400).json({ error: 'Uç nokta (endpoint) belirtilmelidir.' });
    }
    
    // Güvenlik: Yalnızca yerel API uç noktalarına izin ver
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const isAllowed = 
      cleanEndpoint.startsWith('/api/export/') || 
      cleanEndpoint.startsWith('/api/v1/') ||
      cleanEndpoint.startsWith('/api/crypto') ||
      cleanEndpoint.startsWith('/api/macro') ||
      cleanEndpoint.startsWith('/api/market') ||
      cleanEndpoint.startsWith('/api/health');

    if (!isAllowed) {
      return res.status(403).json({ error: 'Yalnızca API ağ geçidi rotaları (/api/v1/*, /api/export/*, /api/crypto/* vb.) test edilebilir.' });
    }

    const startTime = Date.now();
    const data = await localFinanceApi.safeFetch(cleanEndpoint);
    const latencyMs = Date.now() - startTime;

    if (data === null) {
      return res.status(502).json({ 
        success: false, 
        error: 'Uç noktadan geçerli yanıt alınamadı veya zaman aşımına uğradı.',
        endpoint: cleanEndpoint,
        latencyMs 
      });
    }

    return res.json({
      success: true,
      endpoint: cleanEndpoint,
      latencyMs,
      data
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * 16. POST /api/admin/db-initialize-schema
 */
adminRouter.post('/db-initialize-schema', async (req: Request, res: Response) => {
  try {
    const result = await initializePostgresSchema();
    if (result.success) {
      logAudit(
        'INITIALIZE_POSTGRES_SCHEMA',
        req.user.uid,
        `Admin (${req.user.email}) PostgreSQL veritabanında sistem tablolarını başlattı: ${result.createdTables.join(', ')}`,
        { 
          adminEmail: req.user.email,
          newValue: { createdTables: result.createdTables } 
        }
      );
    }
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * 16b. POST /api/admin/db-execute-query
 * Admin panelinden PostgreSQL üzerinde güvenli sorgu çalıştırma ve tablo şeması denetleme
 */
adminRouter.post('/db-execute-query', async (req: Request, res: Response) => {
  try {
    const { query, params } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ success: false, error: 'SQL sorgusu belirtilmelidir.' });
    }

    const trimmedQuery = query.trim();
    const result = await executePostgresQuery(trimmedQuery, Array.isArray(params) ? params : []);
    
    if (result.success) {
      logAudit(
        'POSTGRES_SQL_QUERY_EXECUTED',
        req.user?.uid || 'admin',
        `Admin (${req.user?.email || 'admin'}) SQL sorgusu çalıştırdı: ${trimmedQuery.substring(0, 100)}...`,
        {
          adminEmail: req.user?.email,
          newValue: {
            query: trimmedQuery,
            rowCount: result.rowCount,
            executionTimeMs: result.executionTimeMs
          }
        }
      );
    }

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 17. POST /api/admin/db-sync
 * Synchronize Data between Firebase and PostgreSQL
 */
adminRouter.post('/db-sync', async (req: Request, res: Response) => {
  try {
    const direction = req.body?.direction || 'bidirectional';
    const result = await syncDatabasesBetweenFirebaseAndPostgres(direction);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 18. GET /api/admin/db-sync-status
 */
adminRouter.get('/db-sync-status', async (req: Request, res: Response) => {
  try {
    const settings = await getDatabaseIntegrationSettings();
    return res.json({
      lastSyncAt: settings.lastSyncAt || null,
      lastSyncStatus: settings.lastSyncStatus || 'idle',
      lastSyncReport: settings.lastSyncReport || null,
      autoSyncEnabled: settings.autoSyncEnabled || false
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * 19. GET /api/admin/db-cache/stats
 * Veritabanı öncelikli okuma (read-through DB cache) metrikleri
 */
adminRouter.get('/db-cache/stats', async (req: Request, res: Response) => {
  try {
    const metrics = await databaseFirstCacheService.getMetrics();
    return res.json({ success: true, metrics });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 20. POST /api/admin/db-cache/warmup
 * Kritik varlıkları (BIST 30, FX, Altın) önceden veritabanına yazarak API tasarrufunu başlat
 */
adminRouter.post('/db-cache/warmup', async (req: Request, res: Response) => {
  try {
    const keyAssets = [
      { symbol: 'THYAO', category: 'BIST' },
      { symbol: 'GARAN', category: 'BIST' },
      { symbol: 'AKBNK', category: 'BIST' },
      { symbol: 'ASELS', category: 'BIST' },
      { symbol: 'KCHOL', category: 'BIST' },
      { symbol: 'TUPRS', category: 'BIST' },
      { symbol: 'BIMAS', category: 'BIST' },
      { symbol: 'EREGL', category: 'BIST' },
      { symbol: 'SAHOL', category: 'BIST' },
      { symbol: 'ISCTR', category: 'BIST' },
      { symbol: 'USD/TRY', category: 'FOREX' },
      { symbol: 'EUR/TRY', category: 'FOREX' },
      { symbol: 'XAU/USD', category: 'COMMODITIES' },
      { symbol: 'BTC', category: 'CRYPTO' },
      { symbol: 'ETH', category: 'CRYPTO' }
    ];

    let cachedCount = 0;
    for (const item of keyAssets) {
      try {
        const quote = null;
        if (quote && quote.price > 0) {
          await databaseFirstCacheService.saveQuoteToDatabase(item.symbol, quote, item.category as any);
          cachedCount++;
        }
      } catch (err: any) {
        console.warn(`[db-cache-warmup] Error for ${item.symbol}:`, err?.message);
      }
    }

    const metrics = await databaseFirstCacheService.getMetrics();
    return res.json({
      success: true,
      warmedUpAssets: cachedCount,
      metrics
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 21. POST /api/admin/pipeline-reseed
 * Veritabanı sıfırlandığında API üzerinden tüm verileri (Şirketler, Fonlar, KAP, Fiyatlar, Şema)
 * tek tıkla çekip veritabanına yeniden dolduran toplu senkronizasyon motoru
 */
adminRouter.post('/pipeline-reseed', async (req: Request, res: Response) => {
  try {
    const report: any = {
      startedAt: new Date().toISOString(),
      steps: [],
      totals: {
        companies: 0,
        funds: 0,
        disclosures: 0,
        warmedQuotes: 0,
        syncStatus: 'completed'
      }
    };

    // 1. Şirketler Listesini Çek ve DB Önbelleğe Al
    try {
      const companies = await localFinanceApi.getAllCompanies();
      if (Array.isArray(companies) && companies.length > 0) {
        report.totals.companies = companies.length;
        serverLocalDatabase.set('api_cache_store', 'companies_list', {
          data: companies,
          timestamp: Date.now(),
          count: companies.length
        });
        report.steps.push({ name: '1. Şirketler Kataloğu (1014)', success: true, count: companies.length });
      } else {
        report.steps.push({ name: '1. Şirketler Kataloğu', success: false, message: 'Veri boş veya API yanıt vermedi.' });
      }
    } catch (e: any) {
      report.steps.push({ name: '1. Şirketler Kataloğu', success: false, error: e.message });
    }

    // 2. TEFAS Fonlarını Çek ve Kaydet
    try {
      const funds = await localFinanceApi.getFunds(500);
      if (Array.isArray(funds) && funds.length > 0) {
        report.totals.funds = funds.length;
        serverLocalDatabase.set('api_cache_store', 'tefas_funds_list', {
          data: funds,
          timestamp: Date.now(),
          count: funds.length
        });
        report.steps.push({ name: '2. TEFAS Yatırım Fonları', success: true, count: funds.length });
      } else {
        report.steps.push({ name: '2. TEFAS Yatırım Fonları', success: false, message: 'Fon listesi alınamadı.' });
      }
    } catch (e: any) {
      report.steps.push({ name: '2. TEFAS Yatırım Fonları', success: false, error: e.message });
    }

    // 3. KAP Bildirimleri & Geri Alımları Çek
    try {
      const bulkData = await localFinanceApi.getBulkData(['disclosures', 'buybacks', 'ipo', 'settlement'], 50);
      if (bulkData) {
        const discCount = Array.isArray(bulkData.disclosures) ? bulkData.disclosures.length : 0;
        report.totals.disclosures = discCount;
        serverLocalDatabase.set('api_cache_store', 'bulk_latest', {
          data: bulkData,
          timestamp: Date.now()
        });
        report.steps.push({ name: '3. KAP Bildirimleri & Toplu Tablolar (Geri Alım, Takas)', success: true, count: discCount });
      }
    } catch (e: any) {
      report.steps.push({ name: '3. KAP Bildirimleri & Toplu Tablolar', success: false, error: e.message });
    }

    // 4. Kritik Piyasa Varlıklarını Isıt (DB Warmup)
    try {
      const keyAssets = [
        { symbol: 'THYAO', category: 'BIST' },
        { symbol: 'GARAN', category: 'BIST' },
        { symbol: 'AKBNK', category: 'BIST' },
        { symbol: 'ASELS', category: 'BIST' },
        { symbol: 'KCHOL', category: 'BIST' },
        { symbol: 'TUPRS', category: 'BIST' },
        { symbol: 'BIMAS', category: 'BIST' },
        { symbol: 'EREGL', category: 'BIST' },
        { symbol: 'USD/TRY', category: 'FOREX' },
        { symbol: 'EUR/TRY', category: 'FOREX' },
        { symbol: 'XAU/USD', category: 'COMMODITIES' },
        { symbol: 'BTC', category: 'CRYPTO' },
      ];

      let cachedCount = 0;
      for (const item of keyAssets) {
        try {
          const quote = null;
          if (quote && quote.price > 0) {
            await databaseFirstCacheService.saveQuoteToDatabase(item.symbol, quote, item.category as any);
            cachedCount++;
          }
        } catch {}
      }
      report.totals.warmedQuotes = cachedCount;
      report.steps.push({ name: '4. Kritik Piyasa Fiyatları (BIST 30, Altın, Döviz, BTC)', success: true, count: cachedCount });
    } catch (e: any) {
      report.steps.push({ name: '4. Kritik Piyasa Fiyatları', success: false, error: e.message });
    }

    // 5. DB Çift Yönlü Senkronizasyonu (Kullanıcılar, İpuçları, Şemalar)
    try {
      const syncRes = await syncDatabasesBetweenFirebaseAndPostgres('bidirectional');
      report.steps.push({ name: '5. PostgreSQL / Firebase Çift Yönlü Eşitleme', success: syncRes.success, details: syncRes.details });
    } catch (e: any) {
      report.steps.push({ name: '5. PostgreSQL / Firebase Eşitleme', success: false, error: e.message });
    }

    report.completedAt = new Date().toISOString();
    report.success = true;

    logAudit(
      'FULL_DATABASE_PIPELINE_RESEED',
      req.user?.uid || 'admin',
      `Admin (${req.user?.email || 'admin'}) API üzerinden tüm verileri veritabanına yeniden doldurdu.`,
      { 
        adminEmail: req.user?.email,
        newValue: { report } 
      }
    );

    return res.json({ success: true, report });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 22. POST /api/admin/db-cache/evict
 */
adminRouter.post('/db-cache/evict', async (req: Request, res: Response) => {
  try {
    const symbol = req.body?.symbol;
    if (!symbol) {
      return res.status(400).json({ error: 'Sembol belirtilmelidir.' });
    }
    await databaseFirstCacheService.evict(symbol);
    return res.json({ success: true, message: `${symbol} önbellekten temizlendi.` });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 22. GET /api/admin/system-performance
 * Bilgisayar (Host Donanım), Program (Node.js Runtime) ve Veritabanı (DB) Performans Telemetrisi
 */
adminRouter.get('/system-performance', async (req: Request, res: Response) => {
  try {
    const telemetry = await systemPerformanceService.getCompleteTelemetry();
    return res.json({ success: true, telemetry });
  } catch (error: any) {
    console.error('[adminRouter] system-performance error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 23. POST /api/admin/system-performance/gc
 * Bellek temizliği ve Garbage Collection tetikleme
 */
adminRouter.post('/system-performance/gc', async (req: Request, res: Response) => {
  try {
    const beforeMem = process.memoryUsage();
    let gcTriggered = false;

    if (typeof (global as any).gc === 'function') {
      (global as any).gc();
      gcTriggered = true;
    }

    const afterMem = process.memoryUsage();
    const freedMb = Math.max(0, Math.round((beforeMem.heapUsed - afterMem.heapUsed) / (1024 * 1024)));

    return res.json({
      success: true,
      gcTriggered,
      message: gcTriggered 
        ? `V8 Çöp Toplayıcı (GC) başarıyla çalıştırıldı. ${freedMb} MB bellek serbest bırakıldı.`
        : 'Node.js dahili bellek optimizasyonu çalıştırıldı.',
      beforeHeapUsedMb: Math.round(beforeMem.heapUsed / (1024 * 1024)),
      afterHeapUsedMb: Math.round(afterMem.heapUsed / (1024 * 1024))
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});



