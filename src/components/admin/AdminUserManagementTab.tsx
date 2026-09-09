import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Crown, 
  ShieldCheck, 
  RotateCcw, 
  Gift, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  UserX, 
  UserCheck, 
  Key, 
  Mail,
  Trash2,
  X
} from 'lucide-react';
import { SubscriptionTier, SUBSCRIPTION_PLANS } from '../../shared/subscriptionPlans';
import { safeFetchJson } from '../../utils/apiClient';
import { db } from '../../lib/firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

interface UserData {
  uid: string;
  id?: string;
  email: string;
  fullName?: string;
  role: string;
  isActive: boolean;
  subscription?: {
    tier: SubscriptionTier;
    status: string;
    grantedAt: string;
    expiresAt: string | null;
    grantedBy: string;
  };
  usage?: {
    analysisQueriesToday: number;
    aiReportsThisPeriod: number;
  };
  createdAt?: string;
}

interface Props {
  users: UserData[];
  onRefreshUsers: () => void;
  isRefreshing: boolean;
}

export const AdminUserManagementTab: React.FC<Props> = ({
  users,
  onRefreshUsers,
  isRefreshing
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'pro_premium' | 'suspended'>('all');

  // Action Modals state
  const [selectedUserForGrant, setSelectedUserForGrant] = useState<UserData | null>(null);
  const [grantTier, setGrantTier] = useState<SubscriptionTier>('pro');
  const [grantDays, setGrantDays] = useState<number>(30);
  const [grantNote, setGrantNote] = useState('');

  // Role Elevation Modal state
  const [selectedUserForRole, setSelectedUserForRole] = useState<UserData | null>(null);
  const [targetRole, setTargetRole] = useState<'admin' | 'standard_user'>('admin');
  const [roleConfirmationInput, setRoleConfirmationInput] = useState('');

  // Processing indicators
  const [processingUid, setProcessingUid] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Add User Modal state
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'standard_user'>('standard_user');
  const [newTier, setNewTier] = useState<SubscriptionTier>('free');
  const [isAddingUser, setIsAddingUser] = useState(false);

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes('@')) {
      alert('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }
    setIsAddingUser(true);
    setFeedback(null);
    try {
      const res = await safeFetchJson<{ success: boolean; user?: any; error?: string }>('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newEmail.trim(),
          fullName: newFullName.trim() || newEmail.split('@')[0],
          role: newRole,
          tier: newTier
        })
      });

      if (res.ok && res.data?.success) {
        // Direct sync with Firestore
        if (res.data?.user?.uid) {
          setDoc(doc(db, 'users', res.data.user.uid), {
            email: newEmail.trim(),
            fullName: newFullName.trim() || newEmail.split('@')[0],
            role: newRole,
            isActive: true,
            subscription: res.data.user.subscription || { tier: newTier, status: 'active', grantedAt: new Date().toISOString(), expiresAt: null, grantedBy: 'admin' },
            usage: { analysisQueriesToday: 0, aiReportsThisPeriod: 0 },
            createdAt: new Date().toISOString()
          }, { merge: true }).catch(() => {});
        }

        setFeedback({ type: 'success', message: `${newEmail} kullanıcısı başarıyla oluşturuldu.` });
        setIsAddUserModalOpen(false);
        setNewEmail('');
        setNewFullName('');
        setNewRole('standard_user');
        setNewTier('free');
        onRefreshUsers();
      } else {
        setFeedback({ type: 'error', message: res.data?.error || res.error || 'Kullanıcı oluşturulamadı.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Hata: ' + err.message });
    } finally {
      setIsAddingUser(false);
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q || 
      (u.email && u.email.toLowerCase().includes(q)) || 
      (u.fullName && u.fullName.toLowerCase().includes(q)) || 
      (u.uid && u.uid.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (filterRole === 'admin') return u.role === 'admin' || u.role === 'superadmin';
    if (filterRole === 'suspended') return u.isActive === false;
    if (filterRole === 'pro_premium') {
      const t = u.subscription?.tier;
      return t === 'pro' || t === 'premium' || t === 'starter';
    }
    return true;
  });

  const handleGrantSubmit = async () => {
    if (!selectedUserForGrant) return;
    setProcessingUid(selectedUserForGrant.uid);
    setFeedback(null);
    try {
      const res = await safeFetchJson<{ success: boolean; error?: string }>('/api/admin/grant-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUid: selectedUserForGrant.uid,
          tier: grantTier,
          durationDays: grantDays === -1 ? null : grantDays,
          note: grantNote || `Admin tarafından manuel ${grantTier.toUpperCase()} tanımlandı.`
        })
      });

      if (res.ok && res.data?.success) {
        // Direct Firestore Sync
        updateDoc(doc(db, 'users', selectedUserForGrant.uid), {
          subscription: {
            tier: grantTier,
            status: 'active',
            grantedAt: new Date().toISOString(),
            expiresAt: grantDays === -1 ? null : new Date(Date.now() + grantDays * 24 * 60 * 60 * 1000).toISOString(),
            grantedBy: 'admin'
          }
        }).catch(() => {});

        setFeedback({ type: 'success', message: `${selectedUserForGrant.email} kullanıcısına ${grantTier.toUpperCase()} paketi başarıyla tanımlandı.` });
        setSelectedUserForGrant(null);
        onRefreshUsers();
      } else {
        setFeedback({ type: 'error', message: res.data?.error || res.error || 'Abonelik atanamadı.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Hata: ' + err.message });
    } finally {
      setProcessingUid(null);
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  const handleResetUsage = async (targetUid: string, email: string) => {
    if (!window.confirm(`${email} kullanıcısının tüm günlük/haftalık kullanım limitleri sıfırlansın mı?`)) {
      return;
    }
    setProcessingUid(targetUid);
    setFeedback(null);
    try {
      const res = await safeFetchJson<{ success: boolean; error?: string }>('/api/admin/reset-user-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUid })
      });

      if (res.ok && res.data?.success) {
        setFeedback({ type: 'success', message: `${email} kullanıcısının kotaları sıfırlandı.` });
        onRefreshUsers();
      } else {
        setFeedback({ type: 'error', message: res.data?.error || res.error || 'Kotalar sıfırlanamadı.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Hata: ' + err.message });
    } finally {
      setProcessingUid(null);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleToggleUserStatus = async (targetUid: string, currentStatus: boolean, email: string) => {
    const nextStatus = !currentStatus;
    const actionName = nextStatus ? 'aktifleştirmek' : 'askıya almak';
    if (!window.confirm(`${email} hesabını ${actionName} istediğinize emin misiniz?`)) {
      return;
    }

    setProcessingUid(targetUid);
    setFeedback(null);
    try {
      const res = await safeFetchJson<{ success: boolean; error?: string }>('/api/admin/toggle-user-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUid, isActive: nextStatus })
      });

      if (res.ok && res.data?.success) {
        updateDoc(doc(db, 'users', targetUid), { isActive: nextStatus }).catch(() => {});
        setFeedback({ type: 'success', message: `Hesap durumu güncellendi: ${nextStatus ? 'Aktif' : 'Askıda'}` });
        onRefreshUsers();
      } else {
        setFeedback({ type: 'error', message: res.data?.error || res.error || 'İşlem başarısız.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Hata: ' + err.message });
    } finally {
      setProcessingUid(null);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleDeleteUser = async (targetUid: string, email: string) => {
    if (!window.confirm(`DİKKAT: ${email} kullanıcısını tamamen SİLMEK istediğinize emin misiniz? Bu işlem geri alınamaz.`)) {
      return;
    }
    setProcessingUid(targetUid);
    setFeedback(null);
    try {
      const res = await safeFetchJson<{ success: boolean; error?: string }>(`/api/admin/users/${targetUid}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok && res.data?.success) {
        setFeedback({ type: 'success', message: `${email} başarıyla silindi.` });
        onRefreshUsers();
      } else {
        setFeedback({ type: 'error', message: res.data?.error || res.error || 'İşlem başarısız.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Hata: ' + err.message });
    } finally {
      setProcessingUid(null);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleResetPassword = async (targetUid: string, email: string) => {
    if (!window.confirm(`${email} için şifre sıfırlama e-postası göndermek istiyor musunuz?`)) {
      return;
    }
    setProcessingUid(targetUid);
    setFeedback(null);
    try {
      const res = await safeFetchJson<{ success: boolean; link?: string; error?: string }>(`/api/admin/users/${targetUid}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok && res.data?.success) {
        setFeedback({ type: 'success', message: `${email} adresine şifre sıfırlama bağlantısı gönderildi.` });
      } else {
        setFeedback({ type: 'error', message: res.data?.error || res.error || 'İşlem başarısız.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Hata: ' + err.message });
    } finally {
      setProcessingUid(null);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleRoleElevationSubmit = async () => {
    if (!selectedUserForRole) return;
    if (targetRole === 'admin' && roleConfirmationInput !== 'CONFIRM_ADMIN_ELEVATION') {
      alert('Yönetici rolü atamak için lütfen onay kutusuna CONFIRM_ADMIN_ELEVATION yazınız.');
      return;
    }

    setProcessingUid(selectedUserForRole.uid);
    setFeedback(null);
    try {
      const res = await safeFetchJson<{ success: boolean; error?: string }>('/api/admin/change-user-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUid: selectedUserForRole.uid,
          newRole: targetRole,
          confirmation: roleConfirmationInput
        })
      });

      if (res.ok && res.data?.success) {
        updateDoc(doc(db, 'users', selectedUserForRole.uid), { role: targetRole }).catch(() => {});
        setFeedback({ type: 'success', message: `Kullanıcı rolü "${targetRole}" olarak güncellendi.` });
        setSelectedUserForRole(null);
        setRoleConfirmationInput('');
        onRefreshUsers();
      } else {
        setFeedback({ type: 'error', message: res.data?.error || res.error || 'Rol değiştirilemedi.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Hata: ' + err.message });
    } finally {
      setProcessingUid(null);
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  return (
    <div id="admin-user-management-view" className="space-y-6">
      
      {/* Search & Action Bar */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Users className="text-indigo-400" size={20} />
              Kullanıcı ve Yetki Yönetimi ({users.length} Kayıtlı Kullanıcı)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Kullanıcıların aboneliklerini manuel atayın, kotalarını sıfırlayın veya yönetici yetkisi verin.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddUserModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/25 shrink-0"
            >
              <Users size={14} />
              Yeni Kullanıcı Ekle
            </button>

            <button
              type="button"
              onClick={onRefreshUsers}
              disabled={isRefreshing}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              Listeyi Yenile
            </button>
          </div>
        </div>

        {/* Search Bar & Filter Chips */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="E-posta, İsim veya UID ile filtrele..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: `Tümü (${users.length})` },
              { id: 'admin', label: '🛡️ Yöneticiler' },
              { id: 'pro_premium', label: '👑 Ücretli Planlar' },
              { id: 'suspended', label: '⛔ Askıdakiler' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterRole(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                  filterRole === tab.id
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-2 border ${
          feedback.type === 'success'
            ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
            : 'bg-rose-950/40 border-rose-800 text-rose-300'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* User Cards / Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-4">Kullanıcı / E-posta</th>
                <th className="p-4">Rol</th>
                <th className="p-4">Aktif Paket</th>
                <th className="p-4">Kullanım Durumu</th>
                <th className="p-4">Durum</th>
                <th className="p-4 text-right">Eylemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Arama kriterinize uygun kullanıcı bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, idx) => {
                  const currentTier = u.subscription?.tier || 'free';
                  const planMeta = SUBSCRIPTION_PLANS[currentTier] || SUBSCRIPTION_PLANS.free;
                  const isProcessing = processingUid === u.uid;
                  const userKey = u.uid || u.email || String(idx);

                  return (
                    <tr key={userKey} className="hover:bg-slate-850/50 transition-colors">
                      
                      {/* User Info */}
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{u.email}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono select-all truncate max-w-[200px]">
                            {u.uid}
                          </div>
                          {u.fullName && <div className="text-[11px] text-slate-400">{u.fullName}</div>}
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="p-4">
                        {u.role === 'admin' || u.role === 'superadmin' ? (
                          <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1 w-max">
                            <ShieldCheck size={12} />
                            Yönetici
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 text-[11px] font-medium w-max block">
                            Standart
                          </span>
                        )}
                      </td>

                      {/* Subscription Tier */}
                      <td className="p-4">
                        {u.role === 'admin' || u.role === 'superadmin' || u.email === 'boschozgur@gmail.com' ? (
                          <div className="space-y-1">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              <ShieldCheck size={11} className="text-emerald-400" />
                              Admin
                            </span>
                            <p className="text-[10px] text-emerald-400 font-medium">
                              Pakete Tabi Değil
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider inline-flex items-center gap-1 ${
                              currentTier === 'premium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                              currentTier === 'pro' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                              currentTier === 'starter' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                              'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}>
                              <Crown size={11} />
                              {planMeta.displayName}
                            </span>
                            {u.subscription?.expiresAt && (
                              <p className="text-[10px] text-slate-400 font-mono">
                                Bitiş: {new Date(u.subscription.expiresAt).toLocaleDateString('tr-TR')}
                              </p>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Usage */}
                      <td className="p-4">
                        <div className="space-y-1 text-[11px] font-mono">
                          <div className="text-slate-300">
                            Analiz: <span className="font-bold text-amber-400">{u.usage?.analysisQueriesToday || 0}</span>
                          </div>
                          <div className="text-slate-400">
                            AI Rapor: <span className="font-bold text-indigo-400">{u.usage?.aiReportsThisPeriod || 0}</span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {u.isActive !== false ? (
                          <span className="text-emerald-400 flex items-center gap-1 font-semibold text-[11px]">
                            <CheckCircle2 size={13} /> Aktif
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-1 font-semibold text-[11px]">
                            <UserX size={13} /> Askıda
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Grant Package Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUserForGrant(u);
                              setGrantTier(u.subscription?.tier || 'pro');
                            }}
                            disabled={isProcessing}
                            title="Manuel Paket Tanımla"
                            className="p-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Gift size={14} />
                          </button>

                          {/* Reset Usage Button */}
                          <button
                            type="button"
                            onClick={() => handleResetUsage(u.uid, u.email)}
                            disabled={isProcessing}
                            title="Kotaları Sıfırla"
                            className="p-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <RotateCcw size={14} />
                          </button>

                          {/* Change Role Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUserForRole(u);
                              setTargetRole(u.role === 'admin' ? 'standard_user' : 'admin');
                              setRoleConfirmationInput('');
                            }}
                            disabled={isProcessing}
                            title="Rol Değiştir (Admin/Standart)"
                            className="p-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Key size={14} />
                          </button>

                          {/* Suspend / Activate Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleUserStatus(u.uid, u.isActive !== false, u.email)}
                            disabled={isProcessing}
                            title={u.isActive !== false ? 'Hesabı Askıya Al' : 'Hesabı Aktifleştir'}
                            className={`p-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50 border ${
                              u.isActive !== false
                                ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30'
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            }`}
                          >
                            {u.isActive !== false ? <UserX size={14} /> : <UserCheck size={14} />}
                          </button>

                          {/* Reset Password Button */}
                          <button
                            type="button"
                            onClick={() => handleResetPassword(u.uid, u.email)}
                            disabled={isProcessing}
                            title="Şifre Sıfırlama Bağlantısı Gönder"
                            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Mail size={14} />
                          </button>

                          {/* Delete User Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.uid, u.email)}
                            disabled={isProcessing}
                            title="Kullanıcıyı Sil"
                            className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Grant Subscription Modal */}
      {selectedUserForGrant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-purple-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
            <button
              type="button"
              onClick={() => setSelectedUserForGrant(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2">
              <Gift className="text-purple-400" size={20} />
              <h3 className="text-sm font-bold text-white">Manuel Üyelik Paketi Tanımla</h3>
            </div>

            <p className="text-xs text-slate-400">
              <span className="text-slate-200 font-semibold">{selectedUserForGrant.email}</span> kullanıcısı için paket ve geçerlilik süresi belirleyin.
            </p>

            <div className="space-y-3 pt-2">
              
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Paket Seviyesi</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['free', 'starter', 'pro', 'premium'] as SubscriptionTier[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setGrantTier(t)}
                      className={`p-2.5 rounded-xl border text-xs font-bold uppercase transition-all cursor-pointer ${
                        grantTier === t
                          ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Geçerlilik Süresi</label>
                <select
                  value={grantDays}
                  onChange={(e) => setGrantDays(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value={7}>7 Gün (Deneme)</option>
                  <option value={30}>30 Gün (1 Ay)</option>
                  <option value={90}>90 Gün (3 Ay)</option>
                  <option value={365}>365 Gün (1 Yıl)</option>
                  <option value={-1}>Süresiz (Ömür Boyu)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Yönetici Notu (Opsiyonel)</label>
                <input
                  type="text"
                  value={grantNote}
                  onChange={(e) => setGrantNote(e.target.value)}
                  placeholder="Örn: 'Beta test kullanıcısı hediye paket'..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

            </div>

            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={() => setSelectedUserForGrant(null)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleGrantSubmit}
                disabled={processingUid === selectedUserForGrant.uid}
                className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {processingUid === selectedUserForGrant.uid ? <RefreshCw className="animate-spin" size={14} /> : <Gift size={14} />}
                Paketi Yetkilendir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Change Role (Elevate to Admin) Modal */}
      {selectedUserForRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
            <button
              type="button"
              onClick={() => setSelectedUserForRole(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle size={22} />
              <h3 className="text-sm font-bold text-white">Güvenlik: Kullanıcı Rol Değişikliği</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white">{selectedUserForRole.email}</strong> kullanıcısının rolünü 
              <span className="text-amber-400 font-bold ml-1">
                {targetRole === 'admin' ? '🛡️ YÖNETİCİ (ADMIN)' : '👤 STANDART KULLANICI'}
              </span> olarak değiştirmek üzeresiniz.
            </p>

            {targetRole === 'admin' ? (
              <div className="p-3 bg-amber-950/40 border border-amber-700/60 rounded-xl space-y-2 text-xs">
                <p className="text-amber-300 font-semibold">
                  ⚠️ Yönetici rolü verilen kullanıcı sistemin tüm paket limitlerini, veritabanını ve kullanıcı kayıtlarını düzenleyebilir.
                </p>
                <p className="text-slate-400 text-[11px]">
                  Onaylamak için aşağıdaki kutucuğa <span className="font-mono text-amber-300 select-all font-bold">CONFIRM_ADMIN_ELEVATION</span> yazınız:
                </p>
                <input
                  type="text"
                  value={roleConfirmationInput}
                  onChange={(e) => setRoleConfirmationInput(e.target.value)}
                  placeholder="CONFIRM_ADMIN_ELEVATION"
                  className="w-full px-3 py-2 bg-slate-950 border border-amber-600/50 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            ) : (
              <div className="p-3 bg-slate-950 rounded-xl text-xs text-slate-400">
                Bu kullanıcının admin yetkisi kaldırılacak ve standart kullanıcı seviyesine düşürülecektir.
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedUserForRole(null)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleRoleElevationSubmit}
                disabled={targetRole === 'admin' && roleConfirmationInput !== 'CONFIRM_ADMIN_ELEVATION'}
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                {processingUid === selectedUserForRole.uid ? <RefreshCw className="animate-spin" size={14} /> : <Key size={14} />}
                Rolü Güncelle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="text-indigo-400" size={18} />
                Sisteme Manuel Kullanıcı Ekle
              </h3>
              <button 
                type="button" 
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Kullanıcı E-posta Adresi *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="yatirimci@ornek.com"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Ad Soyad / Görünen İsim</label>
                <input
                  type="text"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="Ahmet Yılmaz"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Sistem Rolü</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="standard_user">Standart Kullanıcı</option>
                    <option value="admin">Yönetici (Admin)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Başlangıç Paketi</label>
                  <select
                    value={newTier}
                    onChange={(e) => setNewTier(e.target.value as SubscriptionTier)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="free">Ücretsiz (Free)</option>
                    <option value="starter">Başlangıç (Starter)</option>
                    <option value="pro">Pro</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isAddingUser}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isAddingUser ? <RefreshCw className="animate-spin" size={14} /> : <Users size={14} />}
                  Kullanıcıyı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
