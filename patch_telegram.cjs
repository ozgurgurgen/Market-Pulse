const fs = require('fs');
const content = fs.readFileSync('server.ts', 'utf8');

const route = `
// ==========================================
// TELEGRAM ENTEGRASYONU
// ==========================================
app.post('/api/portfolio/telegram/test', async (req, res) => {
  try {
    const { botToken, chatId, message } = req.body;
    
    if (!botToken || !chatId) {
      return res.status(400).json({ success: false, message: 'Token veya Chat ID eksik' });
    }

    const response = await fetch(\`https://api.telegram.org/bot\${botToken}/sendMessage\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message || 'MarketPulse AI Test Mesajı',
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();
    
    if (!data.ok) {
      return res.status(400).json({ success: false, message: data.description || 'Telegram API Hatası' });
    }

    res.json({ success: true, message: 'Test bildirimi başarıyla gönderildi!' });
  } catch (error) {
    console.error('Telegram test error:', error);
    res.status(500).json({ success: false, message: 'Sunucu hatası oluştu' });
  }
});
`;

if (!content.includes('/api/portfolio/telegram/test')) {
  const parts = content.split('// ==========================================');
  // insert before the catchall
  const insertIndex = content.lastIndexOf('// Vite middleware for development');
  const newContent = content.substring(0, insertIndex) + route + '\n' + content.substring(insertIndex);
  fs.writeFileSync('server.ts', newContent);
  console.log('patched server.ts');
}
