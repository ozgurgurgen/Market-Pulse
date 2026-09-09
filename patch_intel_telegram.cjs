const fs = require('fs');
const content = fs.readFileSync('server.ts', 'utf8');

const route = `
// İstihbarat Paneli Telegram Mock Uç Noktaları
app.get('/api/intelligence/telegram/status', (req, res) => {
  res.json({
    configured: true,
    threshold: 7.0,
    history: [
      { id: 1, timestamp: new Date(Date.now() - 3600000).toISOString(), message: "🚨 Yüksek Volatilite: TSLA", status: "sent" },
      { id: 2, timestamp: new Date(Date.now() - 86400000).toISOString(), message: "🟢 TEFAS AFT Fonu Güncellendi", status: "sent" }
    ]
  });
});

app.post('/api/intelligence/telegram/test', (req, res) => {
  setTimeout(() => {
    res.json({ success: true, message: 'Test istihbarat alarmı Telegram botunuza iletildi.' });
  }, 1000);
});
`;

if (!content.includes('/api/intelligence/telegram/status')) {
  const parts = content.split('// ==========================================');
  // insert before the catchall
  const insertIndex = content.lastIndexOf('// Vite middleware for development');
  const newContent = content.substring(0, insertIndex) + route + '\n' + content.substring(insertIndex);
  fs.writeFileSync('server.ts', newContent);
  console.log('patched intel telegram');
}
