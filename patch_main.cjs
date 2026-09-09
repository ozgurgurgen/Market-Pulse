const fs = require('fs');
let text = fs.readFileSync('src/main.tsx', 'utf8');

text = text.replace(
  "import App from './App.tsx'",
  "import App from './App.tsx'\nimport { AuthProvider } from './contexts/AuthContext';"
);
text = text.replace(
  "<App />",
  "<AuthProvider><App /></AuthProvider>"
);
fs.writeFileSync('src/main.tsx', text);
