const fs = require('fs');
let text = fs.readFileSync('src/App.tsx', 'utf8');

text = text.replace(
  "import { WatchlistManager } from './components/WatchlistManager';",
  "import { WatchlistManager } from './components/WatchlistManager';\nimport { AdminPanel } from './components/AdminPanel';"
);

const adminSection = `
        {/* Tab: Admin Panel */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <AdminPanel />
          </div>
        )}
`;

text = text.replace(
  "{activeTab === 'watchlist' && (",
  adminSection + "\n        {activeTab === 'watchlist' && ("
);

fs.writeFileSync('src/App.tsx', text);
