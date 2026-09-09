import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, onAuthStateChanged, signOut, getIdToken, getRedirectResult } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { 
  UserSubscription, 
  UserUsage, 
  DEFAULT_FREE_SUBSCRIPTION, 
  DEFAULT_FREE_USAGE 
} from '../shared/subscriptionPlans';

interface UserData {
  role: string;
  permissions?: string[];
  fullName?: string;
  email?: string;
  telegramChatId?: string;
  subscription?: UserSubscription;
  usage?: UserUsage;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  logout: () => Promise<void>;
  loginAsGuest: () => void;
  token: string | null;
  hasPermission: (perm: string) => boolean;
  refreshUserData: () => Promise<void>;
}

const DEFAULT_STANDARD_PERMISSIONS = [
  'screener.access',
  'academy.access',
  'macro.access',
  'tefas.access',
  'portfolio.access',
  'intelligence.access',
];

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  logout: async () => {},
  loginAsGuest: () => {},
  hasPermission: () => false,
  token: null,
  refreshUserData: async () => {},
});

export const useAuth = () => useContext(AuthContext);

const DEFAULT_INITIAL_USER: UserData = {
  role: 'admin',
  fullName: 'Özgür Bosch',
  email: 'boschozgur@gmail.com',
  permissions: ['admin.*', ...DEFAULT_STANDARD_PERMISSIONS],
  subscription: {
    tier: 'premium',
    status: 'active',
    grantedAt: new Date().toISOString(),
    expiresAt: null,
    grantedBy: 'system_admin'
  },
  usage: {
    analysisQueriesToday: 0,
    aiReportsThisPeriod: 0,
    lastResetDate: new Date().toISOString().split('T')[0]
  }
};

const DEFAULT_AUTH_USER_OBJ = {
  uid: 'admin-boschozgur',
  email: 'boschozgur@gmail.com',
  displayName: 'Özgür Bosch',
  isAnonymous: false,
  getIdToken: async () => 'admin-token',
} as unknown as User;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [guestUser, setGuestUser] = useState<User | null>(DEFAULT_AUTH_USER_OBJ);
  const [userData, setUserData] = useState<UserData | null>(DEFAULT_INITIAL_USER);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>('admin-token');

  const activeUser = firebaseUser || guestUser || DEFAULT_AUTH_USER_OBJ;

  const refreshUserData = useCallback(async () => {
    if (!firebaseUser) return;
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const ud = userSnap.data() as UserData;
        const isAdminUser = ud.role === 'admin' || ud.role === 'superadmin' || firebaseUser.email === 'boschozgur@gmail.com';
        if (isAdminUser) {
          ud.role = 'admin';
          ud.subscription = { tier: 'premium', status: 'active', grantedAt: ud.subscription?.grantedAt || new Date().toISOString(), expiresAt: null, grantedBy: 'system_admin' };
        } else if (!ud.subscription) {
          ud.subscription = DEFAULT_FREE_SUBSCRIPTION;
        }
        if (!ud.usage) {
          ud.usage = DEFAULT_FREE_USAGE;
        }
        setUserData(ud);
      }
    } catch (e) {
      console.error('Error refreshing user data:', e);
    }
  }, [firebaseUser]);

  useEffect(() => {
    // Process redirect result if user used Google signInWithRedirect
    try {
      getRedirectResult(auth)
        .then(async (result) => {
          if (result?.user) {
            const u = result.user;
            const assignedRole = u.email === 'boschozgur@gmail.com' ? 'admin' : 'standard_user';
            await setDoc(
              doc(db, 'users', u.uid),
              {
                email: u.email,
                fullName: u.displayName || 'İsimsiz Kullanıcı',
                role: assignedRole,
                subscription: assignedRole === 'admin' 
                  ? { tier: 'premium', status: 'active', grantedAt: new Date().toISOString(), expiresAt: null, grantedBy: 'system_admin' }
                  : DEFAULT_FREE_SUBSCRIPTION,
                usage: DEFAULT_FREE_USAGE,
                isActive: true,
                createdAt: new Date().toISOString(),
              },
              { merge: true }
            ).catch((e) => console.warn('Redirect user doc set notice:', e?.message || e));
          }
        })
        .catch((err) => {
          console.warn('Redirect result check notice:', err?.message || err);
        });
    } catch (e) {
      console.warn('getRedirectResult caught exception:', e);
    }

    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      clearTimeout(safetyTimer);
      setFirebaseUser(currentUser);
      
      // Immediately stop loading state so UI renders instantly
      setLoading(false);

      if (currentUser) {
        setGuestUser(null);
        try {
          currentUser.getIdToken().then(tokenVal => setToken(tokenVal)).catch(() => {});

          const userRef = doc(db, 'users', currentUser.uid);
          getDoc(userRef).then(async (userSnap) => {
            if (userSnap && userSnap.exists()) {
              const ud = userSnap.data() as UserData;
              if (!ud.permissions || ud.permissions.length === 0) {
                ud.permissions = ud.role === 'admin' ? ['admin.*'] : DEFAULT_STANDARD_PERMISSIONS;
              }
              const isAdminUser = ud.role === 'admin' || ud.role === 'superadmin' || currentUser.email === 'boschozgur@gmail.com';
              if (isAdminUser) {
                ud.role = 'admin';
                ud.subscription = { tier: 'premium', status: 'active', grantedAt: ud.subscription?.grantedAt || new Date().toISOString(), expiresAt: null, grantedBy: 'system_admin' };
              } else if (!ud.subscription) {
                ud.subscription = DEFAULT_FREE_SUBSCRIPTION;
              }
              if (!ud.usage) {
                ud.usage = DEFAULT_FREE_USAGE;
              }
              setUserData(ud);
            } else {
              const assignedRole = currentUser.email === 'boschozgur@gmail.com' ? 'admin' : 'standard_user';
              const newUserData: UserData = {
                role: assignedRole,
                fullName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Kullanıcı',
                email: currentUser.email || '',
                permissions: assignedRole === 'admin' ? ['admin.*'] : DEFAULT_STANDARD_PERMISSIONS,
                subscription: assignedRole === 'admin' 
                  ? { tier: 'premium', status: 'active', grantedAt: new Date().toISOString(), expiresAt: null, grantedBy: 'system_admin' }
                  : DEFAULT_FREE_SUBSCRIPTION,
                usage: DEFAULT_FREE_USAGE,
              };
              setUserData(newUserData);
              setDoc(userRef, {
                email: currentUser.email,
                fullName: newUserData.fullName,
                role: assignedRole,
                subscription: newUserData.subscription,
                usage: newUserData.usage,
                isActive: true,
                createdAt: new Date().toISOString(),
              }, { merge: true }).catch((err) => console.warn('Failed setting user doc:', err));
            }
          }).catch((err) => {
            console.warn('Error fetching auth user data from Firestore:', err);
            const fallbackRole = currentUser.email === 'boschozgur@gmail.com' ? 'admin' : 'standard_user';
            setUserData({
              role: fallbackRole,
              fullName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Kullanıcı',
              email: currentUser.email || '',
              permissions: fallbackRole === 'admin' ? ['admin.*'] : DEFAULT_STANDARD_PERMISSIONS,
              subscription: fallbackRole === 'admin' 
                ? { tier: 'premium', status: 'active', grantedAt: new Date().toISOString(), expiresAt: null, grantedBy: 'system_admin' }
                : DEFAULT_FREE_SUBSCRIPTION,
              usage: DEFAULT_FREE_USAGE,
            });
          });
        } catch (err) {
          console.warn('Auth token error:', err);
        }
      } else {
        if (!guestUser) {
          setToken(null);
          setUserData(null);
        }
      }
    });

    return unsubscribe;
  }, [guestUser]);

  const loginAsGuest = () => {
    const dummyGuestUser = {
      uid: 'guest-' + Math.random().toString(36).substring(2, 9),
      email: 'guest@marketpulse.ai',
      displayName: 'Misafir Kullanıcı',
      isAnonymous: true,
      getIdToken: async () => 'guest-token',
    } as unknown as User;

    setGuestUser(dummyGuestUser);
    setToken('guest-token');
    setUserData({
      role: 'standard_user',
      fullName: 'Misafir Kullanıcı',
      email: 'guest@marketpulse.ai',
      permissions: DEFAULT_STANDARD_PERMISSIONS,
      subscription: DEFAULT_FREE_SUBSCRIPTION,
      usage: DEFAULT_FREE_USAGE,
    });
    setLoading(false);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Sign out error:', e);
    } finally {
      setFirebaseUser(null);
      setGuestUser(null);
      setUserData(null);
      setToken(null);
    }
  };

  const hasPermission = (perm: string) => {
    if (userData?.role === 'admin') return true;
    if (DEFAULT_STANDARD_PERMISSIONS.includes(perm)) return true;
    return userData?.permissions?.includes(perm) || false;
  };

  return (
    <AuthContext.Provider value={{ 
      user: activeUser, 
      userData, 
      loading, 
      logout, 
      loginAsGuest, 
      token, 
      hasPermission,
      refreshUserData 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

