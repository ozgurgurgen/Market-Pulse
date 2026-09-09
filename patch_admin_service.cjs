const fs = require('fs');

let content = fs.readFileSync('server/services/firebaseAdminService.ts', 'utf8');

// Replace getUserRole to use adminDb
const newGetUserRole = `
export async function getUserRole_v2_deprecated(uid: string, idToken?: string): Promise<string> {
   return 'standard_user'; // Mocked out deprecated logic
}

export async function getUserRole(uid: string, idToken?: string): Promise<string> {
  if (!uid || uid === 'guest_user' || uid.startsWith('guest-')) {
    return 'standard_user';
  }
  
  // CRITICAL PATH: Using Admin SDK to fetch user role bypassing Security Rules limitations on server.
  try {
    const snap = await adminDb.collection('users').doc(uid).get();
    if (snap.exists) {
      return snap.data()?.role || 'standard_user';
    } else {
      return 'standard_user';
    }
  } catch (error: any) {
    throw new CriticalSecurityError('CRITICAL: Failed to securely fetch user role from Admin Firestore. Local fallback forbidden.', error);
  }
}
`;
content = content.replace(/export async function getUserRole[\s\S]*?export async function getRolePermissions/m, newGetUserRole + '\nexport async function getRolePermissions');

// Replace getRolePermissions
const newGetRolePerms = `
export async function getRolePermissions_v2_deprecated(roleName: string, idToken?: string): Promise<string[] | null> {
    return null;
}

export async function getRolePermissions(roleName: string, idToken?: string): Promise<string[] | null> {
  if (!roleName || roleName === 'standard_user' || roleName === 'guest_user') {
    return null;
  }
  try {
    const snap = await adminDb.collection('roles').doc(roleName).get();
    if (snap.exists) {
      return snap.data()?.permissions || [];
    }
    return null;
  } catch (error: any) {
    throw new CriticalSecurityError('CRITICAL: Failed to securely fetch role permissions from Admin Firestore. Local fallback forbidden.', error);
  }
}
`;
content = content.replace(/export async function getRolePermissions[\s\S]*?\n\}/m, newGetRolePerms);

// Remove unused imports like serverDb, setDoc etc
content = content.replace(/import \{ doc, getDoc, setDoc \} from 'firebase\/firestore';\n/, '');
content = content.replace(/import \{ serverDb \} from '\.\/firebaseClientService';\n/, '');
content = content.replace(/import \{ serverLocalDatabase \} from '\.\/serverLocalDatabase';\n/, '');

fs.writeFileSync('server/services/firebaseAdminService.ts', content);
