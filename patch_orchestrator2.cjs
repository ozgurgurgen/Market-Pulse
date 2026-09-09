const fs = require('fs');
let code = fs.readFileSync('server/intelligence/orchestratorAgent.ts', 'utf8');

const newMethod = `
  private async checkAndTriggerTelegramAlerts(report: IntelligenceReport): Promise<void> {
    try {
      const { serverDb } = await import('../services/firebaseClientService.ts');
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      
      const q = query(
        collection(serverDb, 'users'),
        where('telegramChatId', '!=', null)
      );
      
      const usersSnap = await getDocs(q);

      let defaultSent = false;

      for (const doc of usersSnap.docs) {
        const data = doc.data();
        if (data.telegramNotificationsEnabled === false) continue;
        const watchlist = data.favorites || [];
        if (watchlist.includes(report.ticker)) {
           await telegramService.checkAndNotify(report, data.telegramChatId);
           defaultSent = true;
        }
      }
    } catch (e) {
      this.logWarn('Telegram alert check failed silently:', e);
    }
  }
`;

const startIdx = code.indexOf('private async checkAndTriggerTelegramAlerts');
const endIdx = code.indexOf('}', code.indexOf('}', startIdx) + 1) + 1;

if (startIdx !== -1) {
  code = code.substring(0, startIdx) + newMethod.trim() + code.substring(endIdx);
  fs.writeFileSync('server/intelligence/orchestratorAgent.ts', code);
  console.log('patched orchestrator with serverDb');
}
