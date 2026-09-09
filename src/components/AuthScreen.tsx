import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signInWithPopup, 
  signInWithRedirect,
  GoogleAuthProvider, 
  signInAnonymously,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Lock, Mail, User, AlertCircle, Zap, Smartphone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const AuthScreen: React.FC = () => {
  const { loginAsGuest } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMobileRedirectBtn, setShowMobileRedirectBtn] = useState(false);

  // Translate Firebase Auth error codes into clear Turkish messages
  const translateAuthError = (err: any): string => {
    const code = err?.code || '';
    const message = err?.message || '';

    if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
      return 'E-posta veya şifre hatalı. Lütfen bilgilerinizi kontrol ediniz.';
    }
    if (code === 'auth/email-already-in-use') {
      return 'Bu e-posta adresi ile kayıtlı bir hesap zaten var. Giriş yapmayı deneyin.';
    }
    if (code === 'auth/invalid-email') {
      return 'Geçerli bir e-posta adresi giriniz.';
    }
    if (code === 'auth/weak-password') {
      return 'Şifreniz çok zayıf. Lütfen en az 8 karakterli güvenli bir şifre belirleyin.';
    }
    if (code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-this-environment') {
      return 'Mobil tarayıcınız açılır pencereleri engelledi. Yönlendirme sayfasına aktarılıyorsunuz...';
    }
    if (code === 'auth/network-request-failed') {
      return 'İnternet bağlantısı kurulamadı. İnternet bağlantınızı veya mobil verinizi kontrol edip tekrar deneyin.';
    }
    if (code === 'auth/unauthorized-domain') {
      return 'Bu etki alanı (domain) Firebase Yetkili Alan Adları listesinde kayıtlı değil.';
    }
    if (code === 'auth/too-many-requests') {
      return 'Çok fazla başarısız deneme yapıldı. Lütfen biraz bekleyip tekrar deneyin.';
    }
    return message || 'Bir hata oluştu. Lütfen tekrar deneyiniz.';
  };

  const handleGuestLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const { user } = await signInAnonymously(auth);
      await setDoc(
        doc(db, 'users', user.uid),
        {
          email: 'guest@marketpulse.ai',
          fullName: 'Misafir Kullanıcı',
          role: 'standard_user',
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      ).catch((err) => console.warn('Guest doc creation warning:', err));
    } catch (err: any) {
      console.warn('signInAnonymously failed, using fallback guest session:', err);
      // Fail-safe guest login for mobile environments
      loginAsGuest();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      const isMobileDevice = typeof window !== 'undefined' && (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        ('ontouchstart' in window && window.innerWidth < 1024)
      );
      const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

      // On standalone mobile browsers (like Mobile Chrome), direct redirect is the smooth native flow
      if (isMobileDevice && !isInIframe) {
        try {
          await signInWithRedirect(auth, provider);
          return;
        } catch (redirectErr) {
          console.warn('Direct signInWithRedirect error, trying popup fallback:', redirectErr);
        }
      }

      // Try popup first (desktop or iframe environments)
      try {
        const userCredential = await signInWithPopup(auth, provider);
        if (userCredential?.user) {
          const user = userCredential.user;
          const assignedRole = user.email === 'boschozgur@gmail.com' ? 'admin' : 'standard_user';

          await setDoc(
            doc(db, 'users', user.uid),
            {
              email: user.email,
              fullName: user.displayName || 'İsimsiz Kullanıcı',
              role: assignedRole,
              isActive: true,
              createdAt: new Date().toISOString(),
            },
            { merge: true }
          ).catch((e) => console.warn('User doc update warning:', e));
        }
      } catch (popupErr: any) {
        console.warn('signInWithPopup error:', popupErr);

        // If popup fails on non-iframe environments, fallback seamlessly to signInWithRedirect
        if (!isInIframe) {
          try {
            await signInWithRedirect(auth, provider);
            return;
          } catch (redirectErr: any) {
            console.error('Redirect fallback error:', redirectErr);
            setShowMobileRedirectBtn(true);
            throw redirectErr;
          }
        } else {
          // Inside preview iframe
          if (popupErr.code === 'auth/popup-closed-by-user') {
            setShowMobileRedirectBtn(true);
            setError('Giriş penceresi kapatıldı veya engellendi. Aşağıdaki alternatif butonu deneyebilirsiniz.');
          } else {
            throw popupErr;
          }
        }
      }
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setShowMobileRedirectBtn(true);
      }
      setError(translateAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetMessage('');
    if (!email) {
      setError('Lütfen e-posta adresinizi giriniz.');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu (ve spam klasörünü) kontrol edin.');
    } catch (err: any) {
      setError(translateAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, cleanEmail, password);
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        await updateProfile(user, { displayName: fullName.trim() });
        await setDoc(doc(db, 'users', user.uid), {
          email: cleanEmail,
          fullName: fullName.trim(),
          role: cleanEmail === 'boschozgur@gmail.com' ? 'admin' : 'standard_user',
          isActive: true,
          createdAt: new Date().toISOString()
        });
      }
    } catch (err: any) {
      setError(translateAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-2 text-center">
          {isResetMode ? 'Şifremi Unuttum' : (isLogin ? 'Hoş Geldiniz' : 'Hesap Oluşturun')}
        </h1>
        <p className="text-slate-400 text-sm mb-6 text-center">
          {isResetMode 
            ? 'Şifrenizi sıfırlamak için e-posta adresinizi girin.' 
            : (isLogin ? 'Devam etmek için giriş yapın.' : 'Yeni bir hesap oluşturarak başlayın.')}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-xl flex items-start gap-2.5 text-red-400 text-xs sm:text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {resetMessage && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/50 rounded-xl flex items-start gap-2.5 text-emerald-400 text-xs sm:text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{resetMessage}</span>
          </div>
        )}

        {isResetMode ? (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">E-posta</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-slate-500" />
                </div>
                <input
                  type="email"
                  inputMode="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  placeholder="boschozgur@gmail.com"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl transition-colors mt-2 text-sm cursor-pointer"
            >
              {loading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}
            </button>
            
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(false);
                  setError('');
                  setResetMessage('');
                }}
                className="text-sm text-amber-500 hover:text-amber-400 font-medium cursor-pointer"
              >
                Giriş ekranına dön
              </button>
            </div>
          </form>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Ad Soyad</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={16} className="text-slate-500" />
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                      placeholder="Özgür Bosch"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">E-posta</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-slate-500" />
                  </div>
                  <input
                    type="email"
                    inputMode="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    placeholder="boschozgur@gmail.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-slate-400">Şifre</label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsResetMode(true);
                        setError('');
                      }}
                      className="text-xs text-amber-500 hover:text-amber-400 focus:outline-none"
                    >
                      Şifremi unuttum
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-slate-500" />
                  </div>
                  <input
                    type="password"
                    autoCapitalize="none"
                    autoCorrect="off"
                    required
                    minLength={8}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    placeholder="En az 8 karakter"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl transition-colors mt-2 text-sm cursor-pointer"
              >
                {loading ? 'Bekleniyor...' : isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
              </button>
            </form>

            <div className="mt-4 flex items-center justify-between">
              <span className="w-1/5 border-b border-slate-700 lg:w-1/4"></span>
              <span className="text-xs text-center text-slate-500 uppercase">VEYA</span>
              <span className="w-1/5 border-b border-slate-700 lg:w-1/4"></span>
            </div>
            
            <div className="mt-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-2.5 bg-white hover:bg-gray-100 text-slate-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google ile Devam Et
              </button>

              {showMobileRedirectBtn && (
                <button
                  type="button"
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const provider = new GoogleAuthProvider();
                      provider.setCustomParameters({ prompt: 'select_account' });
                      await signInWithRedirect(auth, provider);
                    } catch (e: any) {
                      setError(translateAuthError(e));
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <Smartphone size={16} className="shrink-0" />
                  Google Yönlendirme (Mobil Hata Çözümü)
                </button>
              )}

              <button
                type="button"
                onClick={handleGuestLogin}
                disabled={loading}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Zap size={16} className="text-amber-400 shrink-0" />
                Hızlı Demo / Misafir Girişi
              </button>
            </div>

            <div className="mt-4 p-2.5 bg-slate-950 border border-slate-800/80 rounded-xl flex items-center gap-2 text-[11px] text-slate-400">
              <Smartphone size={14} className="text-amber-400 shrink-0" />
              <span>Mobil tarayıcılarda e-posta veya Hızlı Demo / Misafir Girişi ile anında erişim sağlayabilirsiniz.</span>
            </div>
            
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-amber-500 hover:text-amber-400 font-medium cursor-pointer"
              >
                {isLogin ? 'Hesabınız yok mu? Kayıt olun.' : 'Zaten hesabınız var mı? Giriş yapın.'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
