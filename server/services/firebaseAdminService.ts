import { CriticalSecurityError } from '../utils/securityErrors';
import { initializeApp, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { serverLocalDatabase } from './serverLocalDatabase';

export const PROJECT_ID = firebaseConfig.projectId || 'famous-phalanx-413107';
export const DB_ID = firebaseConfig.firestoreDatabaseId || 'ai-studio-marketpulseaitef-9befce23-8089-4716-9c4d-feabc89be875';
export const API_KEY = firebaseConfig.apiKey || '';

const app = getApps().length === 0 ? initializeApp({ projectId: PROJECT_ID }) : getApp();

let primaryAdminDb = getFirestore(app, DB_ID);
let defaultAdminDb = getFirestore(app);

export async function safeAdminGet(operation: (dbInstance: any) => Promise<any>): Promise<any> {
  try {
    return await operation(primaryAdminDb);
  } catch (err: any) {
    try {
      return await operation(defaultAdminDb);
    } catch {
      throw err;
    }
  }
}

export async function safeAdminWrite(operation: (dbInstance: any) => Promise<any>): Promise<any> {
  try {
    return await operation(primaryAdminDb);
  } catch (err: any) {
    try {
      return await operation(defaultAdminDb);
    } catch {
      throw err;
    }
  }
}

export const adminDb = primaryAdminDb;

export const adminAuth = getAuth(app);

export async function getUserRole_v2_deprecated(uid: string, idToken?: string): Promise<string> {
   return 'standard_user'; // Mocked out deprecated logic
}

export async function getUserRole(uid: string, idToken?: string): Promise<string> {
  if (!uid || uid === 'guest_user' || uid.startsWith('guest-')) {
    return 'standard_user';
  }
  
  if (uid === 'admin_boschozgur') {
    return 'admin';
  }

  try {
    const localUser = serverLocalDatabase.get<any>('users', uid);
    if (localUser && (localUser.role === 'admin' || localUser.role === 'superadmin' || localUser.email === 'boschozgur@gmail.com')) {
      return 'admin';
    }
  } catch {}

  // CRITICAL PATH: Using Admin SDK to fetch user role bypassing Security Rules limitations on server.
  try {
    const snap = await safeAdminGet(db => db.collection('users').doc(uid).get());
    if (snap.exists) {
      const d = snap.data();
      if (d?.email === 'boschozgur@gmail.com' || d?.role === 'admin' || d?.role === 'superadmin') {
        return 'admin';
      }
      return d?.role || 'standard_user';
    }
  } catch (error: any) {
    console.warn('Warning: Could not fetch user role from Admin Firestore, falling back to standard_user:', error?.message);
  }

  try {
    const userRecord = await adminAuth.getUser(uid);
    if (userRecord.email === 'boschozgur@gmail.com') {
      return 'admin';
    }
  } catch {}

  return 'standard_user';
}

export async function getRolePermissions_v2_deprecated(roleName: string, idToken?: string): Promise<string[] | null> {
    return null;
}

export async function getRolePermissions(roleName: string, idToken?: string): Promise<string[] | null> {
  if (!roleName || roleName === 'standard_user' || roleName === 'guest_user') {
    return null;
  }
  try {
    const snap = await safeAdminGet(db => db.collection('roles').doc(roleName).get());
    if (snap.exists) {
      return snap.data()?.permissions || [];
    }
    return null;
  } catch (error: any) {
    console.warn('Warning: Could not fetch role permissions from Admin Firestore:', error?.message);
    return null;
  }
}

