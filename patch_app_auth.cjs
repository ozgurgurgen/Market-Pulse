const fs = require('fs');
let text = fs.readFileSync('src/App.tsx', 'utf8');

text = text.replace(
  "import { OpportunityScanner } from './components/OpportunityScanner';",
  "import { OpportunityScanner } from './components/OpportunityScanner';\nimport { useAuth } from './contexts/AuthContext';\nimport { AuthScreen } from './components/AuthScreen';"
);

text = text.replace(
  "export default function App() {\n",
  "export default function App() {\n  const { user, loading: authLoading } = useAuth();\n\n  if (authLoading) {\n    return <div className=\"min-h-screen bg-slate-950 flex items-center justify-center\"><div className=\"text-amber-500\">Yükleniyor...</div></div>;\n  }\n\n  if (!user) {\n    return <AuthScreen />;\n  }\n\n"
);
fs.writeFileSync('src/App.tsx', text);
