const fs = require('fs');
const content = fs.readFileSync('server.ts', 'utf8');

const newRoutes = `
// Telegram Multi-Tenant Link Token Generation
import { adminDb } from './server/services/firebaseAdminService.ts';
import crypto from 'crypto';
import { bot } from './server/intelligence/telegramBot.ts';

app.post('/api/telegram/link-token', async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) return res.status(400).json({ error: 'UID gerekli' });

    // Generate a 6-character short token
    const token = 'MP-' + crypto.randomBytes(3).toString('hex').toUpperCase();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    await adminDb.collection('telegramTokens').doc(token).set({
      uid,
      expiresAt,
      createdAt: Date.now()
    });

    res.json({ token, botUsername: bot?.botInfo?.username || 'MarketPulseAIBot' });
  } catch (error) {
    console.error('Token generation error:', error);
    res.status(500).json({ error: 'Token üretilemedi' });
  }
});

app.post('/api/telegram/unlink', async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) return res.status(400).json({ error: 'UID gerekli' });

    await adminDb.collection('users').doc(uid).set({
      telegramChatId: null,
      telegramNotificationsEnabled: false
    }, { merge: true });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Bağlantı kaldırılamadı' });
  }
});

app.use(bot?.webhookCallback('/api/telegram/webhook') || ((req, res, next) => next()));
`;

if (!content.includes('/api/telegram/link-token')) {
  const target = "app.post('/api/portfolio/telegram/test', async (req, res) => {";
  const parts = content.split(target);
  if (parts.length === 2) {
    fs.writeFileSync('server.ts', parts[0] + newRoutes + '\n' + target + parts[1]);
    console.log('patched server.ts with link-token');
  }
}
