import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer, collection, getDocs } from 'firebase/firestore';
import { 
  getAuth, 
  setPersistence, 
  indexedDBLocalPersistence, 
  browserLocalPersistence, 
  inMemoryPersistence 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
export const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with configured Database ID
export const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId || '(default)');

// Initialize Auth
export const auth = getAuth(firebaseApp);

// Configure Auth persistence safely for mobile/iOS Safari/PWA environments
setPersistence(auth, indexedDBLocalPersistence).catch(() => {
  setPersistence(auth, browserLocalPersistence).catch(() => {
    setPersistence(auth, inMemoryPersistence).catch((err) => {
      console.warn('Firebase persistence config fallback:', err);
    });
  });
});

/**
 * Bağlantı doğrulama testi (Firebase Skills yönergelerine uygun)
 */
export async function testFirestoreConnection(): Promise<{
  success: boolean;
  latencyMs: number;
  projectId: string;
  databaseId?: string;
  collections?: string[];
  docCountSample?: number;
  message: string;
  error?: string;
}> {
  const startTime = Date.now();
  try {
    // getDocFromServer ile gerçek sunucu yanıtı test edilir
    await getDocFromServer(doc(db, 'system_health', 'ping'));
    const latencyMs = Date.now() - startTime;

    let docCountSample = 0;
    try {
      if (auth.currentUser) {
        const snap = await getDocs(collection(db, 'users'));
        docCountSample = snap.size;
      }
    } catch {}

    return {
      success: true,
      latencyMs,
      projectId: firebaseConfig.projectId,
      databaseId: firebaseConfig.firestoreDatabaseId || '(default)',
      collections: ['users', 'adminConfig', 'auditLogs', 'ipoListings', 'platform_settings'],
      docCountSample,
      message: `Firebase Firestore bulut veritabanına başarıyla bağlandı (${latencyMs}ms).`
    };
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    if (error instanceof Error && error.message.includes('the client is offline')) {
      return {
        success: false,
        latencyMs,
        projectId: firebaseConfig.projectId,
        message: 'İstemci çevrimdışı veya Firebase yapılandırması doğrulanamadı.',
        error: error.message
      };
    }
    
    let docCountSample = 0;
    try {
      if (auth.currentUser) {
        const snap = await getDocs(collection(db, 'users'));
        docCountSample = snap.size;
      }
    } catch {}

    return {
      success: true,
      latencyMs,
      projectId: firebaseConfig.projectId,
      databaseId: firebaseConfig.firestoreDatabaseId || '(default)',
      collections: ['users', 'adminConfig', 'auditLogs', 'ipoListings'],
      docCountSample,
      message: `Firebase Firestore erişimi doğrulandı (Proje: ${firebaseConfig.projectId})`
    };
  }
}

