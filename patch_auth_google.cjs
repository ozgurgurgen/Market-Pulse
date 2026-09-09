const fs = require('fs');
let text = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

text = text.replace(
  "import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';",
  "import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';"
);

text = text.replace(
  "const [loading, setLoading] = useState(false);",
  `const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      
      // Define role based on email
      const assignedRole = user.email === 'boschozgur@gmail.com' ? 'admin' : 'standard_user';
      
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        fullName: user.displayName || 'İsimsiz Kullanıcı',
        role: assignedRole,
        isActive: true,
        createdAt: new Date().toISOString()
      }, { merge: true });
      
    } catch (err: any) {
      setError(err.message || 'Google girişi sırasında hata oluştu.');
    } finally {
      setLoading(false);
    }
  };`
);

const googleBtn = `
        <div className="mt-4 flex items-center justify-between">
          <span className="w-1/5 border-b border-slate-700 lg:w-1/4"></span>
          <span className="text-xs text-center text-slate-500 uppercase">VEYA</span>
          <span className="w-1/5 border-b border-slate-700 lg:w-1/4"></span>
        </div>
        
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full mt-4 py-2.5 bg-white hover:bg-gray-100 text-slate-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google ile Devam Et
        </button>
        
        <div className="mt-6 text-center">`;

text = text.replace('<div className="mt-6 text-center">', googleBtn);

text = text.replace(
  "role: 'standard_user',",
  "role: email === 'boschozgur@gmail.com' ? 'admin' : 'standard_user',"
);

fs.writeFileSync('src/components/AuthScreen.tsx', text);
