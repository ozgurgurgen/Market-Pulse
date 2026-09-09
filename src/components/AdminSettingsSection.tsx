import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, collection, getDocs, updateDoc, query, orderBy, limit } from 'firebase/firestore';
import { Settings, Image as ImageIcon, Save, ShieldCheck } from 'lucide-react';
import { safeFetchJson } from '../utils/apiClient';

export const AdminSettingsSection: React.FC = () => {
  const [platformName, setPlatformName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [roles, setRoles] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Platform general settings
      try {
        const settingsSnap = await getDoc(doc(db, 'platform_settings', 'general'));
        if (settingsSnap.exists()) {
          const data = settingsSnap.data();
          setPlatformName(data.platformName || 'AI Market Pulse');
          setLogoUrl(data.logoUrl || '');
        }
      } catch {}

      // Fetch roles
      try {
        const rolesSnap = await getDocs(collection(db, 'roles'));
        const fetchedRoles = rolesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (fetchedRoles.length > 0) {
          setRoles(fetchedRoles);
        } else {
          setRoles([
            { id: 'admin', permissions: ['screener.access', 'academy.access', 'macro.access', 'tefas.access', 'admin.panel'] },
            { id: 'standard_user', permissions: ['screener.access', 'academy.access', 'macro.access', 'tefas.access'] },
            { id: 'pro', permissions: ['screener.access', 'academy.access', 'macro.access', 'tefas.access'] }
          ]);
        }
      } catch {
        setRoles([
          { id: 'admin', permissions: ['screener.access', 'academy.access', 'macro.access', 'tefas.access', 'admin.panel'] },
          { id: 'standard_user', permissions: ['screener.access', 'academy.access', 'macro.access', 'tefas.access'] },
          { id: 'pro', permissions: ['screener.access', 'academy.access', 'macro.access', 'tefas.access'] }
        ]);
      }
      
      // Fetch audit logs via API first with fallback
      try {
        const res = await safeFetchJson<{ success: boolean; logs: any[] }>('/api/admin/audit-logs?limit=50');
        if (res?.data?.logs && res.data.logs.length > 0) {
          setAuditLogs(res.data.logs);
        } else {
          const q = query(collection(db, 'auditLogs'), orderBy('timestamp', 'desc'), limit(50));
          const logsSnap = await getDocs(q);
          setAuditLogs(logsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } catch {
        // Fallback to local state or empty
      }
      
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSavePlatform = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'platform_settings', 'general'), {
        platformName,
        logoUrl
      }, { merge: true });
      alert('Genel ayarlar kaydedildi.');
    } catch (e) {
      console.error(e);
      alert('Hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const togglePermission = async (roleId: string, permission: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;
    
    let currentPerms = role.permissions || [];
    if (currentPerms.includes(permission)) {
      currentPerms = currentPerms.filter((p: string) => p !== permission);
    } else {
      currentPerms.push(permission);
    }

    // Optimistic UI
    setRoles(roles.map(r => r.id === roleId ? { ...r, permissions: currentPerms } : r));

    try {
      await updateDoc(doc(db, 'roles', roleId), { permissions: currentPerms });
    } catch (e) {
      console.error(e);
      alert('İzin güncellenemedi.');
    }
  };

  const menuPermissions = [
    { code: 'screener.access', label: 'Tarayıcı' },
    { code: 'academy.access', label: 'Akademi' },
    { code: 'macro.access', label: 'Makro' },
    { code: 'tefas.access', label: 'Tefas' },
    { code: 'admin.panel', label: 'Admin Paneli' }
  ];

  if (loading) return <div className="text-white p-4">Yükleniyor...</div>;

  return (
    <div className="space-y-8">
      {/* Brand Customization */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6">
          <Settings className="text-amber-400" size={18} />
          <h2 className="font-bold text-slate-100">Platform Marka Ayarları</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Platform Adı</label>
            <input
              type="text"
              value={platformName}
              onChange={e => setPlatformName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:border-amber-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Logo URL (Boş bırakılabilir)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ImageIcon size={16} className="text-slate-500" />
              </div>
              <input
                type="text"
                value={logoUrl}
                onChange={e => setLogoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:border-amber-500 outline-none"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button 
            onClick={handleSavePlatform} 
            disabled={saving}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2 rounded-lg font-bold text-sm transition-colors"
          >
            <Save size={16} />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>

      {/* RBAC Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg overflow-x-auto">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6">
          <ShieldCheck className="text-emerald-400" size={18} />
          <h2 className="font-bold text-slate-100">Rol Bazlı Yetki Yönetimi (RBAC Matrix)</h2>
        </div>

        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">Rol Adı</th>
              {menuPermissions.map(p => (
                <th key={p.code} className="px-4 py-3 text-center">{p.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roles.map((role, idx) => (
              <tr key={role.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                <td className="px-4 py-3 font-medium text-amber-400 capitalize">{role.id.replace('_', ' ')}</td>
                {menuPermissions.map(p => {
                  const hasPerm = (role.permissions || []).includes(p.code);
                  return (
                    <td key={p.code} className="px-4 py-3 text-center">
                      <input 
                        type="checkbox"
                        checked={hasPerm}
                        onChange={() => togglePermission(role.id, p.code)}
                        disabled={role.id === 'admin'} // Admin has all permissions
                        className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    
      {/* Audit Logs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg overflow-x-auto">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6">
          <ShieldCheck className="text-red-400" size={18} />
          <h2 className="font-bold text-slate-100">Güvenlik Denetim Günlüğü (Audit Logs)</h2>
        </div>
        
        <table className="w-full text-xs text-left text-slate-300">
          <thead className="bg-slate-800 text-slate-400">
            <tr>
              <th className="px-4 py-2 rounded-tl-lg">Tarih</th>
              <th className="px-4 py-2">İşlem</th>
              <th className="px-4 py-2">Kullanıcı (UID)</th>
              <th className="px-4 py-2 rounded-tr-lg">Detay</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                <td className="px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-4 py-2 text-amber-400">{log.action}</td>
                <td className="px-4 py-2 font-mono text-[10px]">{log.user_id}</td>
                <td className="px-4 py-2">{log.details}</td>
              </tr>
            ))}
            {auditLogs.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-4 text-center text-slate-500">Kayıt bulunamadı.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
