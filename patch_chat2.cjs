const fs = require('fs');
let text = fs.readFileSync('src/components/AIChatAdvisor.tsx', 'utf8');

const originalInit = `  const [webResearchEnabled, setWebResearchEnabled] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: \`Merhaba! Ben **Kıdemli Finansal Analiz ve Canlı Web Araştırma Asistanınızım**. Borsa İstanbul (BIST 300), TEFAS Fonları ve küresel piyasalar üzerinde; **18 Parametreli Şirket Karnesi**, **KAP Yeni İş İlişkileri & İhale Katalizörleri**, **Pay Geri Alımları & Nakit Akışı**, **Sermaye & Temettü Sulandırma Riski**, **Endeks Puan Katkısı** ve **SPK Halka Arz Fon Kullanımı** çerçevesinde 5 adımlı strateji karar matrisi üretiyorum.

🌐 **Canlı Web Araştırması Modu** devrede: İnternetteki en güncel KAP bildirimlerini, TCMB faiz kararlarını, Yahoo Finance canlı fiyatlarını ve finans haberlerini gerçek zamanlı tarayarak doğrudan kaynak linkleriyle yanıtlıyorum.

Aşağıdaki hazır analiz başlıklarından birini seçebilir veya dilediğiniz hisse/fonu sorabilirsiniz:\`,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      webResearchUsed: true,
      suggestedPrompts: [
        'THYAO için 18 parametreli karne, KAP yeni iş ilişkileri ve karar matrisi nedir?',
        'ASELS pay geri alım programı, döviz bazlı ihracat oranı ve endeks puan katkısı analizi',
        'KAP yeni sözleşme tutarının ciroya oranı en yüksek olan büyüme hisseleri hangileri?',
        'Son halka arzlarda SPK fon kullanım raporu yatırım odaklı olan şirketler hangileri?',
        'Enflasyonu 2 katına katlayan %0 stopajlı TEFAS hisse fonları ve Sharpe rasyoları'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');`;

const newInit = `  const { user } = useAuth();
  const [webResearchEnabled, setWebResearchEnabled] = useState(true);
  const [chatSynced, setChatSynced] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  // Initial load
  useEffect(() => {
    if (user && !chatSynced) {
      getDoc(doc(db, 'users', user.uid, 'chatHistories', 'default')).then(snap => {
        if (snap.exists() && snap.data().messages && snap.data().messages.length > 0) {
          setMessages(snap.data().messages);
        } else {
          setMessages([{
            id: 'welcome-msg',
            sender: 'assistant',
            text: \`Merhaba! Ben **Kıdemli Finansal Analiz ve Canlı Web Araştırma Asistanınızım**. Borsa İstanbul (BIST 300), TEFAS Fonları ve küresel piyasalar üzerinde; **18 Parametreli Şirket Karnesi**, **KAP Yeni İş İlişkileri & İhale Katalizörleri**, **Pay Geri Alımları & Nakit Akışı**, **Sermaye & Temettü Sulandırma Riski**, **Endeks Puan Katkısı** ve **SPK Halka Arz Fon Kullanımı** çerçevesinde 5 adımlı strateji karar matrisi üretiyorum.\\n\\n🌐 **Canlı Web Araştırması Modu** devrede: İnternetteki en güncel KAP bildirimlerini, TCMB faiz kararlarını, Yahoo Finance canlı fiyatlarını ve finans haberlerini gerçek zamanlı tarayarak doğrudan kaynak linkleriyle yanıtlıyorum.\\n\\nAşağıdaki hazır analiz başlıklarından birini seçebilir veya dilediğiniz hisse/fonu sorabilirsiniz:\`,
            timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
            webResearchUsed: true,
            suggestedPrompts: [
              'THYAO için 18 parametreli karne, KAP yeni iş ilişkileri ve karar matrisi nedir?',
              'ASELS pay geri alım programı, döviz bazlı ihracat oranı ve endeks puan katkısı analizi',
              'KAP yeni sözleşme tutarının ciroya oranı en yüksek olan büyüme hisseleri hangileri?',
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
      setDoc(doc(db, 'users', user.uid, 'chatHistories', 'default'), { messages }, { merge: true }).catch(e => {
        console.error('Failed to save chat history', e);
      });
    }
  }, [messages, user, chatSynced]);`;

text = text.replace(originalInit, newInit);
fs.writeFileSync('src/components/AIChatAdvisor.tsx', text);
