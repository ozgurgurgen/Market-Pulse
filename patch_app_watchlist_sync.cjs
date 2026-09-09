const fs = require('fs');
let text = fs.readFileSync('src/App.tsx', 'utf8');

text = text.replace(
  "import { AuthScreen } from './components/AuthScreen';",
  "import { AuthScreen } from './components/AuthScreen';\nimport { doc, getDoc, setDoc } from 'firebase/firestore';\nimport { db } from './lib/firebase';"
);

// We need to fetch watchlist from firestore on auth
text = text.replace(
  "export default function App() {",
  `export default function App() {
  const { user, loading: authLoading } = useAuth();
  const [watchlistSynced, setWatchlistSynced] = useState(false);`
);

text = text.replace(
  "  useEffect(() => {\n    try {\n      localStorage.setItem('marketpulse_watchlist', JSON.stringify(watchlist));\n    } catch (e) {\n      console.error('Failed to save watchlist to localStorage', e);\n    }\n  }, [watchlist]);",
  `  useEffect(() => {
    try {
      localStorage.setItem('marketpulse_watchlist', JSON.stringify(watchlist));
      if (user && watchlistSynced) {
        setDoc(doc(db, 'user_watchlists', user.uid), { items: watchlist }, { merge: true });
      }
    } catch (e) {
      console.error('Failed to save watchlist', e);
    }
  }, [watchlist, user, watchlistSynced]);

  useEffect(() => {
    if (user && !watchlistSynced) {
      getDoc(doc(db, 'user_watchlists', user.uid)).then(snap => {
        if (snap.exists() && snap.data().items) {
          setWatchlist(snap.data().items);
        }
        setWatchlistSynced(true);
      }).catch(() => setWatchlistSynced(true));
    }
  }, [user, watchlistSynced]);`
);

fs.writeFileSync('src/App.tsx', text);
