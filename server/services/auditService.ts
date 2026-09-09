import { adminDb, safeAdminGet, safeAdminWrite } from './firebaseAdminService';
import { serverLocalDatabase } from './serverLocalDatabase';

export interface AuditLogEntry {
  id?: string;
  adminUid?: string;
  adminEmail?: string;
  user_id?: string; // backwards compatibility
  action: string;
  targetId?: string;
  details?: string;
  oldValue?: any;
  newValue?: any;
  timestamp: string;
  ipAddress?: string;
}

export interface ErrorLogEntry {
  id?: string;
  message: string;
  stack?: string;
  context?: string;
  path?: string;
  method?: string;
  userEmail?: string;
  timestamp: string;
}

export const logAudit = async (
  action: string,
  userOrAdminId: string,
  details: string,
  extra?: {
    adminEmail?: string;
    targetId?: string;
    oldValue?: any;
    newValue?: any;
    ipAddress?: string;
  }
) => {
  const logId = 'audit_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const entry: AuditLogEntry = {
    id: logId,
    adminUid: userOrAdminId,
    user_id: userOrAdminId,
    adminEmail: extra?.adminEmail || 'system@marketpulse.local',
    action,
    targetId: extra?.targetId || '',
    details,
    oldValue: extra?.oldValue ?? null,
    newValue: extra?.newValue ?? null,
    timestamp: new Date().toISOString(),
    ipAddress: extra?.ipAddress || '',
  };

  try {
    serverLocalDatabase.set('auditLogs', logId, entry);
  } catch {}

  try {
    await safeAdminWrite(db => db.collection('auditLogs').doc(logId).set(entry));
  } catch {}
};

// Preserve original console functions to prevent recursive traps
export const originalConsoleError = console.error.bind(console);
export const originalConsoleWarn = console.warn.bind(console);

let isConsoleInterceptorInitialized = false;

export const setupBackendConsoleInterceptor = () => {
  if (isConsoleInterceptorInitialized) return;
  isConsoleInterceptorInitialized = true;

  console.error = (...args: any[]) => {
    // 1. Always call the original console.error for terminal/debugger visibility
    originalConsoleError(...args);

    // 2. Format string representation of the error
    try {
      const combinedMessage = args
        .map((arg) => {
          if (arg instanceof Error) {
            return `${arg.message}\n${arg.stack || ''}`;
          } else if (typeof arg === 'object' && arg !== null) {
            try {
              return JSON.stringify(arg);
            } catch {
              return String(arg);
            }
          }
          return String(arg);
        })
        .join(' ');

      // 3. Filter out recursive logger internal calls or standard ignorable noise
      if (
        combinedMessage.includes('[SystemErrorLog]') ||
        combinedMessage.includes('[AuditService]') ||
        combinedMessage.includes('Failed to save error log') ||
        combinedMessage.includes('Vite') ||
        combinedMessage.includes('failed to connect to websocket')
      ) {
        return;
      }

      // 4. Capture stack from Error objects if present
      let extractedStack = '';
      for (const a of args) {
        if (a instanceof Error && a.stack) {
          extractedStack = a.stack;
          break;
        }
      }

      const logId = 'err_console_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
      const entry: ErrorLogEntry = {
        id: logId,
        message: combinedMessage.slice(0, 1500),
        stack: extractedStack ? extractedStack.slice(0, 2500) : '',
        context: 'BACKEND_CONSOLE_ERROR',
        path: 'server/console.error',
        method: 'INTERNAL',
        userEmail: 'backend@marketpulse.local',
        timestamp: new Date().toISOString()
      };

      // Write to local cache
      try {
        serverLocalDatabase.set('errorLogs', logId, entry);
      } catch {}

      // Write directly to Firestore errorLogs
      adminDb
        .collection('errorLogs')
        .doc(logId)
        .set(entry)
        .catch(() => {});
    } catch {
      // Fail silently to avoid breaking server runtime
    }
  };
};

export const logSystemError = async (error: any, context?: string, req?: any) => {
  const logId = 'err_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const errorMessage = error?.message || (typeof error === 'string' ? error : JSON.stringify(error));
  const errorStack = error?.stack || '';
  
  const entry: ErrorLogEntry = {
    id: logId,
    message: errorMessage,
    stack: errorStack,
    context: context || 'GENERAL_SYSTEM_ERROR',
    path: req?.originalUrl || req?.path || '',
    method: req?.method || '',
    userEmail: req?.user?.email || 'guest@marketpulse.local',
    timestamp: new Date().toISOString()
  };

  originalConsoleError(`[SystemErrorLog] [${entry.context}] ${errorMessage}`, errorStack);

  // 1. Write to local backend DB
  try {
    serverLocalDatabase.set('errorLogs', logId, entry);
  } catch (localErr) {
    originalConsoleWarn('[AuditService] Local DB write error:', localErr);
  }

  // 2. Write directly to Firestore errorLogs collection
  try {
    await safeAdminWrite(db => db.collection('errorLogs').doc(logId).set(entry));
  } catch {}
};

export const getAuditLogs = async (limitCount: number = 100): Promise<AuditLogEntry[]> => {
  const logsMap = new Map<string, AuditLogEntry>();

  try {
    const snap = await safeAdminGet(db => db.collection('auditLogs').orderBy('timestamp', 'desc').limit(limitCount).get());
    if (snap && snap.forEach) {
      snap.forEach((doc: any) => {
        const data = doc.data() as AuditLogEntry;
        logsMap.set(doc.id, { id: doc.id, ...data });
      });
    }
  } catch {}

  // Merge with local db
  try {
    const localLogs = serverLocalDatabase.getAll<AuditLogEntry>('auditLogs');
    for (const log of localLogs) {
      if (log.id && !logsMap.has(log.id)) {
        logsMap.set(log.id, log);
      }
    }
  } catch {}

  return Array.from(logsMap.values()).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, limitCount);
};

export const getErrorLogs = async (limitCount: number = 100): Promise<ErrorLogEntry[]> => {
  const errorsMap = new Map<string, ErrorLogEntry>();

  try {
    const snap = await safeAdminGet(db => db.collection('errorLogs').orderBy('timestamp', 'desc').limit(limitCount).get());
    if (snap && snap.forEach) {
      snap.forEach((doc: any) => {
        const data = doc.data() as ErrorLogEntry;
        errorsMap.set(doc.id, { id: doc.id, ...data });
      });
    }
  } catch {}

  // Merge with local db
  try {
    const localErrors = serverLocalDatabase.getAll<ErrorLogEntry>('errorLogs');
    for (const err of localErrors) {
      if (err.id && !errorsMap.has(err.id)) {
        errorsMap.set(err.id, err);
      }
    }
  } catch {}

  return Array.from(errorsMap.values()).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, limitCount);
};

export const deleteSingleAuditLog = async (logId: string): Promise<boolean> => {
  try {
    serverLocalDatabase.delete('auditLogs', logId);
  } catch {}
  try {
    await safeAdminWrite(async db => {
      await db.collection('auditLogs').doc(logId).delete();
      await db.collection('audit_logs').doc(logId).delete();
    });
  } catch {}
  return true;
};

export const deleteSingleErrorLog = async (logId: string): Promise<boolean> => {
  try {
    serverLocalDatabase.delete('errorLogs', logId);
  } catch {}
  try {
    await safeAdminWrite(async db => {
      await db.collection('errorLogs').doc(logId).delete();
      await db.collection('error_logs').doc(logId).delete();
    });
  } catch {}
  return true;
};

export const clearAuditLogs = async () => {
  try {
    serverLocalDatabase.clear('auditLogs');
    serverLocalDatabase.clearCollection('auditLogs');
  } catch {}
  try {
    await safeAdminWrite(async db => {
      for (const colName of ['auditLogs', 'audit_logs']) {
        const snap = await db.collection(colName).get();
        if (!snap.empty) {
          for (let i = 0; i < snap.docs.length; i += 400) {
            const batch = db.batch();
            const chunk = snap.docs.slice(i, i + 400);
            chunk.forEach((doc: any) => batch.delete(doc.ref));
            await batch.commit();
          }
        }
      }
    });
  } catch (err) {
    console.error('[AuditService] Failed to clear audit logs from firestore:', err);
  }
};

export const clearErrorLogs = async () => {
  try {
    serverLocalDatabase.clear('errorLogs');
    serverLocalDatabase.clearCollection('errorLogs');
  } catch {}
  try {
    await safeAdminWrite(async db => {
      for (const colName of ['errorLogs', 'error_logs']) {
        const snap = await db.collection(colName).get();
        if (!snap.empty) {
          for (let i = 0; i < snap.docs.length; i += 400) {
            const batch = db.batch();
            const chunk = snap.docs.slice(i, i + 400);
            chunk.forEach((doc: any) => batch.delete(doc.ref));
            await batch.commit();
          }
        }
      }
    });
  } catch (err) {
    console.error('[AuditService] Failed to clear error logs from firestore:', err);
  }
};

export const logRouteError = (error: any, req?: any) => {
  try {
    logSystemError(error, req?.path ? `ROUTE_${req.path}` : 'API_ERROR', req);
  } catch (err) {
    originalConsoleWarn('[AuditService] Failed to log route error:', err);
  }
};

export const handleRouteError = (res: any, error: any, context = 'API_ROUTE_ERROR', req?: any) => {
  try {
    logSystemError(error, context, req);
  } catch (err) {
    originalConsoleWarn('[AuditService] Failed to record error log:', err);
  }
  const status = typeof error?.status === 'number' && error.status >= 400 && error.status < 600 ? error.status : 500;
  return res.status(status).json({
    success: false,
    error: error?.message || 'Sunucuda beklenmeyen bir hata oluştu.'
  });
};

export const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    try {
      logSystemError(error, 'EXPRESS_ASYNC_ERROR', req);
    } catch {}
    const status = typeof error?.status === 'number' && error.status >= 400 && error.status < 600 ? error.status : 500;
    if (!res.headersSent) {
      res.status(status).json({ success: false, error: error?.message || 'Sunucuda beklenmeyen bir hata oluştu.' });
    }
  });
};




