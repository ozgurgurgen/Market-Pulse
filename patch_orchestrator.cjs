const fs = require('fs');
let code = fs.readFileSync('server/intelligence/orchestratorAgent.ts', 'utf8');

const newMethod = `
  private async checkAndTriggerTelegramAlerts(report: IntelligenceReport): Promise<void> {
    try {
      // Modül 3 & 4: Multi-tenant Alarm Gönderimi
      // Sadece bot aktifse ve report.ticker birilerinin takip listesindeyse onlara gönder
      const adminDb = require('../services/firebaseAdminService.js').adminDb;
      const usersSnap = await adminDb.collection('users')
        .where('telegramChatId', '!=', null)
        .where('telegramNotificationsEnabled', '!=', false)
        .get();

      let defaultSent = false;

      for (const doc of usersSnap.docs) {
        const data = doc.data();
        const watchlist = data.favorites || [];
        if (watchlist.includes(report.ticker)) {
           // Bu kullanıcı takip ediyor, ona yolla
           await telegramService.checkAndNotify(report, data.telegramChatId);
           defaultSent = true;
        }
      }

      // Eğer kimse takip etmiyorsa ama bot token varsa default olarak admin'e de atsın istersen:
      // if (!defaultSent && telegramService.isConfigured()) {
      //   await telegramService.checkAndNotify(report);
      // }

    } catch (e) {
      this.logWarn('Telegram alert check failed silently:', e);
    }
  }
`;

// Replace the old method
const startIdx = code.indexOf('private async checkAndTriggerTelegramAlerts');
const endIdx = code.indexOf('}', code.indexOf('}', startIdx) + 1) + 1;

if (startIdx !== -1) {
  code = code.substring(0, startIdx) + newMethod.trim() + code.substring(endIdx);
  fs.writeFileSync('server/intelligence/orchestratorAgent.ts', code);
  console.log('patched checkAndTriggerTelegramAlerts');
}
