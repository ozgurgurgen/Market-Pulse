import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { adminAuth, getUserRole, getRolePermissions } from '../services/firebaseAdminService';
import { logAudit } from '../services/auditService';

// Extend Express Request to include user data
declare global {
  namespace Express {
    interface Request {
      user?: any;
      userRole?: string;
      idToken?: string;
    }
  }
}

const DEFAULT_STANDARD_PERMISSIONS = [
  'screener.access',
  'academy.access',
  'macro.access',
  'tefas.access',
  'portfolio.access',
  'intelligence.access',
];

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = { uid: 'guest_user', email: 'guest@marketpulse.local' };
    req.userRole = 'standard_user';
    return next();
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    req.user = decodedToken;
    req.idToken = idToken;
    req.userRole = await getUserRole(decodedToken.uid, idToken);
    if (decodedToken.email === 'boschozgur@gmail.com' || decodedToken.uid === 'admin_boschozgur') {
      req.userRole = 'admin';
    }
    return next();
  } catch (error) {
    try {
      const decoded: any = jwt.decode(idToken);
      if (decoded && (decoded.user_id || decoded.sub)) {
        const uid = decoded.user_id || decoded.sub;
        req.user = {
          uid,
          email: decoded.email || 'user@marketpulse.local',
          name: decoded.name || 'Kullanıcı',
          ...decoded,
        };
        req.idToken = idToken;
        req.userRole = await getUserRole(uid, idToken);
        if (req.user?.email === 'boschozgur@gmail.com' || uid === 'admin_boschozgur') {
          req.userRole = 'admin';
        }
        return next();
      }
    } catch {
      // Ignore token decode error
    }
    // Fall back to guest mode if token verification fails
    req.user = { uid: 'guest_user', email: 'guest@marketpulse.local' };
    req.userRole = 'standard_user';
    return next();
  }
};

export const requirePermission = (requiredPermission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.userRole) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Admins have access to everything
    if (req.userRole === 'admin' || req.userRole === 'superadmin') {
      return next();
    }

    let hasPermission = false;

    const permissions = await getRolePermissions(req.userRole, req.idToken);
    if (permissions !== null && permissions.length > 0) {
      if (permissions.includes(requiredPermission) || permissions.includes('admin.*')) {
        hasPermission = true;
      }
    } else {
      // If no explicit custom role document exists, allow standard permissions for standard_user / guest_user
      if (DEFAULT_STANDARD_PERMISSIONS.includes(requiredPermission)) {
        hasPermission = true;
      }
    }

    if (!hasPermission) {
      logAudit('AUTHORIZATION_FAILURE', req.user.uid, `Failed to access endpoint requiring ${requiredPermission}`);
      return res.status(403).json({ error: `Forbidden: Requires ${requiredPermission} permission` });
    }

    next();
  };
};
