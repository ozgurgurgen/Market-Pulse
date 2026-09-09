const fs = require('fs');
let text = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

text = text.replace(
  "import { db } from '../firebase';",
  "import { db } from '../lib/firebase';"
);

fs.writeFileSync('src/components/AdminPanel.tsx', text);
