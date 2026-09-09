const fs = require('fs');
let text = fs.readFileSync('src/App.tsx', 'utf8');

const originalConfig = `  const handleSaveModelConfig = useCallback((newConfig: AIModelConfig) => {
    setModelConfig(newConfig);
    try {
      localStorage.setItem('marketpulse_ai_model_config', JSON.stringify(newConfig));
      localStorage.setItem('marketpulse_aiconfig', JSON.stringify(newConfig));
    } catch (e) {
      console.error('Failed to save AI config to localStorage', e);
    }
  }, []);`;

const newConfig = `  const [modelConfigSynced, setModelConfigSynced] = useState(false);
  
  useEffect(() => {
    if (user && !modelConfigSynced) {
      getDoc(doc(db, 'user_preferences', user.uid)).then(snap => {
        if (snap.exists() && snap.data().modelConfig) {
          setModelConfig(snap.data().modelConfig);
        }
        setModelConfigSynced(true);
      }).catch(e => {
        console.error('Failed to load user preferences', e);
        setModelConfigSynced(true);
      });
    }
  }, [user, modelConfigSynced]);

  const handleSaveModelConfig = useCallback((newConfig: AIModelConfig) => {
    setModelConfig(newConfig);
    try {
      localStorage.setItem('marketpulse_ai_model_config', JSON.stringify(newConfig));
      localStorage.setItem('marketpulse_aiconfig', JSON.stringify(newConfig));
      if (user) {
        setDoc(doc(db, 'user_preferences', user.uid), { modelConfig: newConfig }, { merge: true });
      }
    } catch (e) {
      console.error('Failed to save AI config', e);
    }
  }, [user]);`;

text = text.replace(originalConfig, newConfig);
fs.writeFileSync('src/App.tsx', text);
