const fs = require('fs');
let text = fs.readFileSync('src/App.tsx', 'utf8');

text = text.replace(
  "export default function App() {\n  const { user, loading: authLoading } = useAuth();\n  const [watchlistSynced, setWatchlistSynced] = useState(false);\n\n  if (authLoading) {\n    return <div className=\"min-h-screen bg-slate-950 flex items-center justify-center\"><div className=\"text-amber-500\">Yükleniyor...</div></div>;\n  }\n\n  if (!user) {\n    return <AuthScreen />;\n  }",
  "function MainApp() {\n  const { user } = useAuth();\n  const [watchlistSynced, setWatchlistSynced] = useState(false);"
);

text += `\n\nexport default function App() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="text-amber-500">Yükleniyor...</div></div>;
  }

  if (!user) {
    return <AuthScreen />;
  }

  return <MainApp />;
}
`;

fs.writeFileSync('src/App.tsx', text);
