const fs = require('fs');
let text = fs.readFileSync('src/App.tsx', 'utf8');

// Add Firestore imports if missing
if (!text.includes("import { doc, setDoc, getDoc }")) {
  text = text.replace(
    "import { db } from './lib/firebase';",
    "import { db, auth } from './lib/firebase';\nimport { doc, setDoc, getDoc } from 'firebase/firestore';"
  );
}

// Watchlist effect
const wlOriginal = `  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('marketpulse_watchlist');
      return saved ? JSON.parse(saved) : [`;
const wlNew = `  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([`;

text = text.replace(wlOriginal, wlNew);
// Note: removing the localStorage init requires removing the ending `] : [` logic.
