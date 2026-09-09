import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

interface PlatformConfig {
  platformName: string;
  logoUrl?: string;
}

const AdminConfigContext = createContext<{ config: PlatformConfig, loading: boolean }>({
  config: { platformName: 'AI Market Pulse' },
  loading: true
});

export const useAdminConfig = () => useContext(AdminConfigContext);

export const AdminConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<PlatformConfig>({ platformName: 'AI Market Pulse' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'platform_settings', 'general'), 
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setConfig({
            platformName: data.platformName || 'AI Market Pulse',
            logoUrl: data.logoUrl
          });
        }
        setLoading(false);
      },
      (err) => {
        console.warn('AdminConfigContext snapshot notice (using defaults):', err?.message || err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  return (
    <AdminConfigContext.Provider value={{ config, loading }}>
      {children}
    </AdminConfigContext.Provider>
  );
};
