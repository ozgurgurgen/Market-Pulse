import cron from 'node-cron';
import { adminDb } from '../services/firebaseAdminService';
import { orchestratorAgent } from './orchestratorAgent';
import { telegramService } from './telegramService';
import { IntelligenceReport } from './types';

async function generateAndSendDigest(type: 'MORNING' | 'EVENING') {
  console.log(`[ScheduledDigest] Starting ${type} digest generation...`);
  
  try {
    const usersWithTelegram: Array<{ uid: string; telegramChatId: string; telegramNotificationsEnabled?: boolean; favorites?: string[] }> = [];

    // Get from Firestore
    try {
      const fetchPromise = adminDb.collection('users').where('telegramChatId', '!=', null).get();
      const timeoutPromise = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Firebase DB timeout')), 300));
      const usersSnap = await Promise.race([fetchPromise, timeoutPromise]);
      for (const doc of usersSnap.docs) {
        const data = doc.data() as any;
        if (data?.telegramChatId && !usersWithTelegram.some(u => u.uid === doc.id)) {
          usersWithTelegram.push({ uid: doc.id, ...data });
        }
      }
    } catch {
      // Ignored for unauthenticated background crons
    }
      
    if (usersWithTelegram.length === 0) {
      console.log('[ScheduledDigest] No users with Telegram linked.');
      return;
    }
    
    // Yalnızca bildirimleri açık olan kullanıcıları filtrele
    const activeUsers = usersWithTelegram.filter(u => u.telegramNotificationsEnabled !== false);

    for (const userData of activeUsers) {
      const uid = userData.uid;
      const chatId = userData.telegramChatId;
      let watchlist: string[] = userData.favorites || [];
      
      if (watchlist.length === 0) continue;
      
      // Limit to max 5 assets to not exhaust API/AI limits
      if (watchlist.length > 5) {
        watchlist = watchlist.slice(0, 5);
      }
      
      let digestText = `📊 *MarketPulse AI | ${type === 'MORNING' ? 'Sabah Bülteni' : 'Akşam Kapanış Özeti'}*\n\n`;
      digestText += `Takip Listenizdeki ${watchlist.length} varlık için özet:\n\n`;
      
      const reports: IntelligenceReport[] = [];
      for (const ticker of watchlist) {
        try {
          const report = await orchestratorAgent.generateFinalReport(ticker);
          reports.push(report);
        } catch (e) {
          console.warn(`[ScheduledDigest] Error analyzing ${ticker} for user ${uid}`);
        }
      }
      
      if (reports.length > 0) {
        for (const r of reports) {
          // Kısa özet için sadece ilk cümleyi veya başlığı alalım.
          let assetSummary = (r.summary || '').split('. ')[0] + '.';
          digestText += `🔹 *${r.ticker}*: ${assetSummary}\n`;
        }
      } else {
        digestText += "Herhangi bir veri alınamadı.\n";
      }
      
      digestText += `\n🔗 _Daha fazla detay için MarketPulse uygulamasına girin._`;
      
      // Send message to this specific user
      await telegramService.sendMessage(
        digestText, 
        'DIGEST', 
        type === 'MORNING' ? 'Sabah Bülteni' : 'Akşam Özeti', 
        8.0, 
        'HIGH', 
        chatId
      );
    }
    console.log(`[ScheduledDigest] ${type} digest completed successfully.`);
  } catch (err) {
    console.error(`[ScheduledDigest] Error in ${type} digest:`, err);
  }
}

// Hafta içi her sabah 09:15
cron.schedule('15 9 * * 1-5', () => {
  generateAndSendDigest('MORNING');
}, {
  timezone: 'Europe/Istanbul'
});

// Hafta içi her akşam 18:15
cron.schedule('15 18 * * 1-5', () => {
  generateAndSendDigest('EVENING');
}, {
  timezone: 'Europe/Istanbul'
});

console.log('[ScheduledDigest] Cron jobs initialized for 09:15 and 18:15 (Europe/Istanbul)');
