import { Telegraf } from 'telegraf';
import { adminDb } from '../services/firebaseAdminService';
import { telegramService } from './telegramService';
import { orchestratorAgent } from './orchestratorAgent';
import { getAssetType } from './assetClassifier';
import crypto from 'crypto';

const botToken = process.env.TELEGRAM_BOT_TOKEN;
export const bot = botToken ? new Telegraf(botToken) : null;

export async function linkTelegramAccount(token: string, chatId: number): Promise<string | null> {
  try {
    let uid: string | null = null;

    // Firestore Check
    if (!uid) {
      try {
        const tokenRef = adminDb.collection('telegramTokens').doc(token);
        const tokenDoc = await tokenRef.get();
        if (tokenDoc.exists) {
          const data = tokenDoc.data();
          if (data && data.expiresAt >= Date.now()) {
            uid = data.uid;
            await tokenRef.delete().catch(() => {});
          }
        }
      } catch {}
    }

    if (!uid) return null;

    
    try {
      await adminDb.collection('users').doc(uid).set({
        telegramChatId: chatId.toString(),
        telegramNotificationsEnabled: true
      }, { merge: true });
    } catch {}
    
    return uid;
  } catch (err) {
    console.error('linkTelegramAccount error:', err);
    return null;
  }
}

export async function getUidFromChatId(chatId: string | number): Promise<string | null> {
  try {
    // Firestore Check
    try {
      const snap = await adminDb.collection('users').where('telegramChatId', '==', chatId.toString()).limit(1).get();
      if (!snap.empty) return snap.docs[0].id;
    } catch {}
    
    return null;
  } catch (err) {
    return null;
  }
}

if (bot) {
  bot.command('start', async (ctx) => {
    const args = ctx.message.text.split(' ');
    const token = args[1];
    if (token) {
      const uid = await linkTelegramAccount(token, ctx.chat.id);
      if (uid) {
        ctx.reply('✅ Harika! Telegram hesabınız MarketPulse AI ile eşleştirildi. Artık anlık istihbarat bildirimlerini buradan alacaksınız.\n\nKullanabileceğiniz komutları görmek için /yardim yazabilirsiniz.');
      } else {
        ctx.reply('❌ Geçersiz veya süresi dolmuş bir eşleştirme kodu kullandınız. Lütfen web uygulamasından yeni bir kod oluşturun.');
      }
    } else {
      ctx.reply('👋 MarketPulse AI Telegram Botuna hoş geldiniz!\n\nBu botu kullanabilmek için web uygulamasındaki "Ayarlar" sayfasından hesabınızı bağlamanız gerekmektedir.\n\n1. MarketPulse AI uygulamasına girin.\n2. Ayarlar (Telegram Bildirimleri) sekmesine tıklayın.\n3. "Telegram Bağla" butonuna basarak aldığınız kodu buraya gönderin (örn: /start MP-XYZ)');
    }
  });

  bot.command('rapor', async (ctx) => {
    const uid = await getUidFromChatId(ctx.chat.id);
    if (!uid) return ctx.reply('⚠️ Lütfen önce hesabınızı eşleştirin. Uygulamadan aldığınız kodu /start <kod> şeklinde gönderin.');

    const args = ctx.message.text.split(' ');
    const ticker = args[1]?.toUpperCase();
    if (!ticker) return ctx.reply('⚠️ Lütfen bir sembol girin. Örnek: /rapor TSLA');

    const type = getAssetType(ticker);
    // Asset type check
    if (!type) return ctx.reply(`❌ "${ticker}" desteklenen bir varlık tipi değil. Geçerli bir Hisse (BIST/US), TEFAS Fonu veya Kripto girin.`);

    const msg = await ctx.reply('⏳ Yapay Zeka analiz ediyor, lütfen bekleyin...');
    try {
      const report = await orchestratorAgent.generateFinalReport(ticker);
      
      let replyText = `📊 *${ticker} - MarketPulse AI Analizi*\n`;
      replyText += `Varlık Tipi: ${type}\n\n`;
      replyText += `*AI Yorumu:*\n${report.summary}\n\n`;
      
      if (report.key_developments.length > 0) {
        replyText += `*Son Gelişmeler:*\n`;
        report.key_developments.slice(0,2).forEach(d => {
          replyText += `• ${d.title} (Etki: ${d.impact_score})\n`;
        });
      }
      replyText += `\n🔗 Daha fazlası için uygulamayı ziyaret edin.`;

      await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, undefined, replyText, { parse_mode: 'Markdown' });
    } catch (err) {
      console.error(err);
      await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, undefined, '❌ Analiz sırasında bir hata oluştu.');
    }
  });

  bot.command('portfoy', async (ctx) => {
    const uid = await getUidFromChatId(ctx.chat.id);
    if (!uid) return ctx.reply('⚠️ Lütfen önce hesabınızı eşleştirin.');
    
    // Basit bir placeholder veya veritabanından çekilebilir.
    ctx.reply('📈 Portföy özeti özelliği şu an bakımda. Çok yakında eklenecek!');
  });

  bot.command('takip', async (ctx) => {
    const uid = await getUidFromChatId(ctx.chat.id);
    if (!uid) return ctx.reply('⚠️ Lütfen önce hesabınızı eşleştirin.');
    
    try {
      const userDoc = await adminDb.collection('users').doc(uid).get();
      const userData = userDoc.data();
      const watchlist = userData?.favorites || [];
      if (watchlist.length === 0) return ctx.reply('📋 Takip listeniz boş. Uygulamadan varlık ekleyebilirsiniz.');
      ctx.reply(`📋 *Takip Listeniz:* \n\n${watchlist.join(', ')}`, { parse_mode: 'Markdown' });
    } catch (err) {
      ctx.reply('❌ Takip listesi alınamadı.');
    }
  });

  bot.command('durdur', async (ctx) => {
    const uid = await getUidFromChatId(ctx.chat.id);
    if (!uid) return ctx.reply('⚠️ Lütfen önce hesabınızı eşleştirin.');
    
    await adminDb.collection('users').doc(uid).set({ telegramNotificationsEnabled: false }, { merge: true });
    ctx.reply('🔕 Bildirimleriniz durduruldu. Tekrar açmak için /basla yazabilirsiniz.');
  });

  bot.command('basla', async (ctx) => {
    const uid = await getUidFromChatId(ctx.chat.id);
    if (!uid) return ctx.reply('⚠️ Lütfen önce hesabınızı eşleştirin.');
    
    await adminDb.collection('users').doc(uid).set({ telegramNotificationsEnabled: true }, { merge: true });
    ctx.reply('🔔 Bildirimleriniz tekrar aktif edildi.');
  });

  bot.command('yardim', (ctx) => {
    ctx.reply(
      '🤖 *MarketPulse AI Telegram Botu*\n\n' +
      'Kullanabileceğiniz Komutlar:\n' +
      '/rapor <SEMBOL> - Bir hisse veya fonun anlık AI analizini getirir.\n' +
      '/takip - Takip listenizdeki varlıkları gösterir.\n' +
      '/portfoy - Portföyünüzün özetini gösterir (Yakında).\n' +
      '/durdur - Anlık bildirimleri geçici olarak durdurur.\n' +
      '/basla - Anlık bildirimleri tekrar açar.\n' +
      '/yardim - Bu menüyü gösterir.\n',
      { parse_mode: 'Markdown' }
    );
  });

  // Start polling in dev
  if (process.env.NODE_ENV !== 'production') {
    bot.launch()
      .then(() => console.log('Telegram Bot polling started.'))
      .catch((err) => console.warn('[TelegramBot] Launch suppressed:', err?.message || err));
  }
}
