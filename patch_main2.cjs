const fs = require('fs');
let text = fs.readFileSync('src/main.tsx', 'utf8');

text = text.replace(
  "import { AuthProvider } from './contexts/AuthContext';",
  "import { AuthProvider } from './contexts/AuthContext';\nimport { AdminConfigProvider } from './contexts/AdminConfigContext';"
);
text = text.replace(
  "<AuthProvider><App /></AuthProvider>",
  "<AuthProvider><AdminConfigProvider><App /></AdminConfigProvider></AuthProvider>"
);
fs.writeFileSync('src/main.tsx', text);
