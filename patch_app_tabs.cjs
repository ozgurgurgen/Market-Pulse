const fs = require('fs');
let text = fs.readFileSync('src/App.tsx', 'utf8');

text = text.replace(
  "| 'watchlist' | 'settings'>('opportunities');",
  "| 'watchlist' | 'settings' | 'admin'>('opportunities');"
);

text = text.replace(
  "import { AuthScreen } from './components/AuthScreen';",
  "import { AuthScreen } from './components/AuthScreen';\nimport { AdminSettingsSection } from './components/AdminSettingsSection';"
);

text = text.replace(
  "{/* TAB 2: Gelişmiş Hisse Tarayıcı & Filtreleme */}",
  "{activeTab === 'admin' && (\n          <AdminSettingsSection />\n        )}\n\n        {/* TAB 2: Gelişmiş Hisse Tarayıcı & Filtreleme */}"
);

fs.writeFileSync('src/App.tsx', text);
