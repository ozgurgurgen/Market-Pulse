const fs = require('fs');
let text = fs.readFileSync('src/components/AIChatAdvisor.tsx', 'utf8');

// Add imports
if (!text.includes("import { useAuth }")) {
  text = text.replace(
    "import { safeFetchJson } from '../utils/apiClient';",
    "import { safeFetchJson } from '../utils/apiClient';\nimport { useAuth } from '../contexts/AuthContext';\nimport { doc, getDoc, setDoc } from 'firebase/firestore';\nimport { db } from '../lib/firebase';"
  );
}

const originalState = `  const [webResearchEnabled, setWebResearchEnabled] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: \`Merhaba! Ben **Kıdemli Finansal Analiz ve Canlı Web Araştırma Asistanınızım**. 

Sistemdeki gerçek zamanlı BIST, NASDAQ, TEFAS Fonları verileri ile entegre çalışıyorum. Canlı veriler üzerinden teknik analiz yapabilir, şirket bilançolarını yorumlayabilir veya doğrudan web üzerinde araştırma yaparak sorularınızı yanıtlayabilirim.

*Nasıl yardımcı olabilirim?*\`,
      timestamp: new Date().toISOString(),
      suggestions: [
        'THYAO için son canlı piyasa verilerini ve teknik görünümleri özetle',
        'Son halka arzlarda SPK fon kullanım raporu yatırım odaklı olan şirketler hangileri?',
        'Enflasyonu 2 katına katlayan %0 stopajlı TEFAS hisse fonları ve Sharpe rasyoları'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');`;

const newState = `  const { user } = useAuth();
  const [webResearchEnabled, setWebResearchEnabled] = useState(true);
  const [chatSynced, setChatSynced] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  // Initial load
  useEffect(() => {
    if (user && !chatSynced) {
      getDoc(doc(db, 'user_chat_histories', user.uid)).then(snap => {
        if (snap.exists() && snap.data().messages && snap.data().messages.length > 0) {
          setMessages(snap.data().messages);
        } else {
          setMessages([{
            id: 'welcome-msg',
            sender: 'assistant',
            text: \`Merhaba! Ben **Kıdemli Finansal Analiz ve Canlı Web Araştırma Asistanınızım**. 
          
Sistemdeki gerçek zamanlı BIST, NASDAQ, TEFAS Fonları verileri ile entegre çalışıyorum. Canlı veriler üzerinden teknik analiz yapabilir, şirket bilançolarını yorumlayabilir veya doğrudan web üzerinde araştırma yaparak sorularınızı yanıtlayabilirim.
          
*Nasıl yardımcı olabilirim?*\`,
            timestamp: new Date().toISOString(),
            suggestions: [
              'THYAO için son canlı piyasa verilerini ve teknik görünümleri özetle',
              'Son halka arzlarda SPK fon kullanım raporu yatırım odaklı olan şirketler hangileri?',
              'Enflasyonu 2 katına katlayan %0 stopajlı TEFAS hisse fonları ve Sharpe rasyoları'
            ]
          }]);
        }
        setChatSynced(true);
      }).catch(e => {
        console.error('Failed to load chat history', e);
        setChatSynced(true);
      });
    }
  }, [user, chatSynced]);

  // Save on change
  useEffect(() => {
    if (user && chatSynced && messages.length > 1) { // Only save if more than welcome message
      setDoc(doc(db, 'user_chat_histories', user.uid), { messages }, { merge: true }).catch(e => {
        console.error('Failed to save chat history', e);
      });
    }
  }, [messages, user, chatSynced]);`;

text = text.replace(originalState, newState);
fs.writeFileSync('src/components/AIChatAdvisor.tsx', text);
