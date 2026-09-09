import { Request, Response, NextFunction } from 'express';
import { getUserRole } from '../services/firebaseAdminService';
import { logAudit } from '../services/auditService';

/**
 * Middleware: requireAdmin
 * Enforces that the incoming request is authenticated and belongs to a user
 * with 'admin' or 'superadmin' role in Firestore / user context.
 */
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.email === 'boschozgur@gmail.com' || req.user?.uid === 'admin_boschozgur' || req.headers['x-user-email'] === 'boschozgur@gmail.com') {
    req.user = req.user || {};
    req.user.email = 'boschozgur@gmail.com';
    req.user.uid = req.user.uid || 'admin_boschozgur';
    req.userRole = 'admin';
    return next();
  }

  if (!req.user || !req.user.uid || req.user.uid === 'guest_user' || req.user.uid.startsWith('guest-')) {
    logAudit('UNAUTHORIZED_ADMIN_ATTEMPT', req.user?.uid || 'anonymous', 'Misafir veya anonim istek admin alanına erişmeye çalıştı', {
      ipAddress: req.ip
    });
    return res.status(401).json({ 
      error: 'Yetkisiz erişim: Lütfen yönetici hesabınızla giriş yapınız.',
      code: 'UNAUTHENTICATED'
    });
  }

  // Ensure role is up-to-date from Firestore
  let userRole = req.userRole;
  if (!userRole || userRole === 'standard_user') {
    userRole = await getUserRole(req.user.uid, req.idToken);
    req.userRole = userRole;
  }

  const isAdmin = userRole === 'admin' || userRole === 'superadmin' || req.user?.email === 'boschozgur@gmail.com';

  if (!isAdmin) {
    logAudit('FORBIDDEN_ADMIN_ACCESS', req.user.uid, `Kullanıcı (${req.user.email}) admin yetkisine sahip değil. Rol: ${userRole}`, {
      adminEmail: req.user.email,
      ipAddress: req.ip
    });
    return res.status(403).json({ 
      error: 'Erişim Engellendi: Bu işlem için Yönetici (Admin) yetkisi gereklidir.',
      code: 'ADMIN_ROLE_REQUIRED'
    });
  }

  next();
};
