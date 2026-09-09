const fs = require('fs');
let text = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

text = text.replace(
  "collection(db, 'settings')",
  "collection(db, 'platform_settings')"
);

text = text.replace(
  "doc(db, 'settings', 'brand')",
  "doc(db, 'platform_settings', 'brand')"
);

fs.writeFileSync('src/components/AdminPanel.tsx', text);
