const fs = require('fs');
const file = 'server/services/firebaseAdminService.ts';
let code = fs.readFileSync(file, 'utf8');

const target = `export async function getUserRole(uid: string, idToken?: string): Promise<string> {`;
const replace = `export class CriticalSecurityError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'CriticalSecurityError';
  }
}

export async function getUserRole(uid: string, idToken?: string): Promise<string> {
  if (!uid || uid === 'guest_user' || uid.startsWith('guest-')) {
    return 'standard_user';
  }

  // CRITICAL PATH: We MUST NOT silently fallback to local cache first without trying the network.
  try {
    const userRef = doc(serverDb, 'users', uid);
    
    // We race with a reasonable timeout so we don't hang, but if it fails/times out, we throw.
    const snapPromise = getDoc(userRef);
    const timeoutPromise = new Promise<null>((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 1000));
    
    const snap = await Promise.race([snapPromise, timeoutPromise]) as any;
    
    if (snap && snap.exists()) {
      const role = snap.data()?.role || 'standard_user';
      // Optimistically update local cache
      try { serverLocalDatabase.upsert('users', uid, { role }); } catch (e) {}
      return role;
    } else {
      return 'standard_user';
    }
  } catch (error: any) {
    // 2. Fallback to REST API if we have an idToken (still a network check)
    if (idToken) {
      try {
        const url = \`https://firestore.googleapis.com/v1/projects/\${PROJECT_ID}/databases/\${DB_ID}/documents/users/\${uid}\`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000);
        
        const res = await fetch(url, {
          headers: { Authorization: \`Bearer \${idToken}\` },
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (res.ok) {
          const data = await res.json();
          return data?.fields?.role?.stringValue || 'standard_user';
        } else if (res.status === 404) {
           return 'standard_user';
        } else {
           throw new Error(\`REST Error: \${res.status}\`);
        }
      } catch (restError: any) {
         throw new CriticalSecurityError('CRITICAL: Failed to securely verify user role via network. Local fallback forbidden.', restError);
      }
    }
    
    // If we have no token and the first network call failed, we MUST fail loudly.
    throw new CriticalSecurityError('CRITICAL: Failed to securely fetch user role from Firestore. Local fallback forbidden.', error);
  }
}

export async function getRolePermissions(roleName: string, idToken?: string): Promise<string[] | null> {
  if (!roleName || roleName === 'standard_user' || roleName === 'guest_user') {
    return null;
  }

  // 1. Try serverDb for source of truth
  try {
    const roleRef = doc(serverDb, 'roles', roleName);
    const snapPromise = getDoc(roleRef);
    const timeoutPromise = new Promise<null>((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 1000));
    
    const snap = await Promise.race([snapPromise, timeoutPromise]) as any;
    
    if (snap && snap.exists()) {
      const perms = snap.data()?.permissions || [];
      try { serverLocalDatabase.upsert('roles', roleName, { permissions: perms }); } catch {}
      return perms;
    } else {
      return null;
    }
  } catch (error: any) {
    throw new CriticalSecurityError('CRITICAL: Failed to securely fetch role permissions from Firestore. Local fallback forbidden.', error);
  }
}
`;

const startIndex = code.indexOf(target);
code = code.substring(0, startIndex) + replace;
fs.writeFileSync(file, code);
