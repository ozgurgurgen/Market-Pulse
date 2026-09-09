import { KeyDevelopment, IntelligenceReport } from './types';
import { validateContentMatchesAssetType } from './assetClassifier';

export interface TelegramNotificationRecord {
  id: string;
  ticker: string;
  title: string;
  impact_score: number;
  severity: string;
  sentAt: string;
  status: 'SENT' | 'SIMULATED' | 'FAILED' | 'SKIPPED_COOLDOWN' | 'SKIPPED_VALIDATION';
}

export class TelegramService {
  private botToken: string;
  private chatId: string;
  private threshold: number = 7.0; // Bildirim eşiği (Etki Puanı >= 7.0)
  private sentHistory: TelegramNotificationRecord[] = [];
  
  // Soğuma (Cooldown) & Tekilleştirme Hafızası
  private symbolLastNotification: Map<string, number> = new Map(); // ticker -> timestamp
  private recentContentHashes: Set<string> = new Set();
  private symbolWeeklyCriticalCount: Map<string, { count: number; weekStart: number }> = new Map();

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    this.chatId = process.env.TELEGRAM_CHAT_ID || '';
  }

  isConfigured(): boolean {
    return Boolean(this.botToken && this.chatId);
  }

  getNotificationHistory(): TelegramNotificationRecord[] {
    return this.sentHistory;
  }

  /**
   * İstihbarat raporundan bildirimleri kontrol eder, doğrular, soğuma süresini (cooldown) ve tekilleştirmeyi uygular.
   */
  async checkAndNotify(report: IntelligenceReport, chatIdOverride?: string): Promise<boolean> {
    const notifyDevelopments = report.key_developments.filter((d) => {
      // 1. Bildirim işareti ve etki puanı kontrolü
      if (d.impact_score < this.threshold || !d.notify) return false;

      // 2. Varlık Tipi & Metin Doğrulaması (Kriptoda KAP/fabrika saçmalığını engelle)
      const isContentValid = validateContentMatchesAssetType(
        `${d.title} ${d.details || ''}`,
        report.ticker
      );
      if (!isContentValid) {
        console.warn(`[TelegramService] Validation failed for ${report.ticker}: "${d.title}". Notification suppressed.`);
        this.recordHistory(report.ticker, d.title, d.impact_score, d.severity, 'SKIPPED_VALIDATION');
        return false;
      }

      return true;
    });

    if (notifyDevelopments.length === 0) return false;

    // 3. Sembol Bazlı Soğuma Süresi (6 Saat Cooldown Kontrolü)
    const now = Date.now();
    const lastSentTime = this.symbolLastNotification.get(report.ticker) || 0;
    const COOLDOWN_MS = 6 * 60 * 60 * 1000; // 6 saat

    // Eğer son 6 saat içinde bu sembolden bildirim gönderildiyse ve etki skoru ekstrem (>= 9.5) değilse atla
    if (now - lastSentTime < COOLDOWN_MS && notifyDevelopments[0].impact_score < 9.5) {
      console.log(`[TelegramService] Cooldown active for ${report.ticker}. Notification suppressed.`);
      this.recordHistory(
        report.ticker,
        notifyDevelopments[0].title,
        notifyDevelopments[0].impact_score,
        notifyDevelopments[0].severity,
        'SKIPPED_COOLDOWN'
      );
      return false;
    }

    // 4. İçerik Hash Tekilleştirme
    const topDev = notifyDevelopments[0];
    const contentHash = `${report.ticker}_${topDev.title.toLowerCase().replace(/\s+/g, '')}`;
    if (this.recentContentHashes.has(contentHash)) {
      console.log(`[TelegramService] Duplicate content hash for ${report.ticker}. Suppressed.`);
      return false;
    }

    // 5. CRITICAL Limit Kontrolü (Haftada en fazla 2 CRITICAL, aşılırsa HIGH'a düşür)
    let finalSeverity = topDev.severity;
    if (finalSeverity === 'CRITICAL') {
      const weeklyData = this.getWeeklyCriticalData(report.ticker);
      if (weeklyData.count >= 2) {
        finalSeverity = 'HIGH';
      } else {
        weeklyData.count += 1;
      }
    }

    // 6. Başarılı Gönderim Kaydı
    const success = await this.sendDevelopmentAlert(report.ticker, {
      ...topDev,
      severity: finalSeverity as any,
    }, chatIdOverride);

    if (success) {
      this.symbolLastNotification.set(report.ticker, now);
      this.recentContentHashes.add(contentHash);
      if (this.recentContentHashes.size > 200) {
        const first = this.recentContentHashes.values().next().value;
        if (first) this.recentContentHashes.delete(first);
      }
    }

    return success;
  }

  /**
   * Birden fazla sembol tek bir tarama döngüsünde taranıyorsa Toplu Özet (Digest) Mesajı Gönderir.
   */
  async sendDigestAlert(reports: IntelligenceReport[], chatIdOverride?: string): Promise<boolean> {
    const validSignals: { ticker: string; title: string; impact: number; severity: string }[] = [];

    for (const report of reports) {
      const dev = report.key_developments.find((d) => d.impact_score >= this.threshold && d.notify);
      if (dev && validateContentMatchesAssetType(`${dev.title} ${dev.details || ''}`, report.ticker)) {
        validSignals.push({
          ticker: report.ticker,
          title: dev.title,
          impact: dev.impact_score,
          severity: dev.severity,
        });
      }
    }

    if (validSignals.length === 0) return false;

    if (validSignals.length === 1) {
      const singleReport = reports.find((r) => r.ticker === validSignals[0].ticker);
      if (singleReport) return this.checkAndNotify(singleReport, chatIdOverride);
    }

    // Çoklu Sinyal Özet Mesajı
    let digestText = `📊 *MarketPulse AI | ${validSignals.length} Yeni İstihbarat Sinyali*\n\n`;
    for (const sig of validSignals) {
      const emoji = sig.severity === 'CRITICAL' ? '🔴' : '🟠';
      digestText += `${emoji} *${sig.ticker}* — ${sig.title} _(Etki: ${sig.impact}/10)_\n`;
    }
    digestText += `\n---
🔗 _Detaylı analiz için MarketPulse platformunu açabilirsiniz._`;

    return this.sendMessage(digestText, 'BIST_DIGEST', 'Toplu Piyasa İstihbarat Özeti', 8.0, 'HIGH', chatIdOverride);
  }

  /**
   * Tekil Gelişme Alarmını Telegram Formatında Gönderir.
   */
  async sendDevelopmentAlert(ticker: string, dev: KeyDevelopment, chatIdOverride?: string): Promise<boolean> {
    const severityEmoji = dev.severity === 'CRITICAL' ? '🔴' : dev.severity === 'HIGH' ? '🟠' : '🟡';
    const typeEmoji = dev.type === 'news' ? '📰' : dev.type === 'technical' ? '📊' : '💬';

    const message = `
${severityEmoji} ${typeEmoji} *MarketPulse AI | ${ticker} İstihbarat Alarmı*

📌 *Gelişme:* ${dev.title}
⚡ *Etki Puanı:* ${dev.impact_score}/10 (${dev.severity})
🕐 *Zaman:* ${new Date().toLocaleTimeString('tr-TR')}

${dev.details ? `📝 ${dev.details}\n` : ''}
---
⚠️ _Bu bildirim yapay zeka istihbarat motoru tarafından üretilmiştir ve yatırım tavsiyesi niteliği taşımaz._
`.trim();

    return this.sendMessage(message, ticker, dev.title, dev.impact_score, dev.severity, chatIdOverride);
  }

  /**
   * Telegram API'sine mesaj gönderir veya yapılandırılmamışsa yerel simülasyon defterine kaydeder.
   */
  async sendMessage(
    text: string,
    ticker: string = 'SİSTEM',
    title: string = 'Bildirim',
    impact: number = 7.5,
    severity: string = 'HIGH',
    chatIdOverride?: string
  ): Promise<boolean> {
    const record: TelegramNotificationRecord = {
      id: `tg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ticker,
      title,
      impact_score: impact,
      severity,
      sentAt: new Date().toISOString(),
      status: 'SIMULATED',
    };

    const targetChatId = chatIdOverride || this.chatId;

    if (this.botToken && targetChatId) {
      try {
        const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: targetChatId,
            text,
            parse_mode: 'Markdown',
          }),
        });

        if (res.ok) {
          record.status = 'SENT';
          this.sentHistory.unshift(record);
          if (this.sentHistory.length > 50) this.sentHistory.pop();
          return true;
        } else {
          record.status = 'FAILED';
          this.sentHistory.unshift(record);
          return false;
        }
      } catch (err) {
        console.error('Telegram send error:', err);
        record.status = 'FAILED';
        this.sentHistory.unshift(record);
        return false;
      }
    } else {
      // Simülasyon mod (Geliştirme / Yerel Test)
      record.status = 'SIMULATED';
      this.sentHistory.unshift(record);
      if (this.sentHistory.length > 50) this.sentHistory.pop();
      return true;
    }
  }

  /**
   * Test mesajı gönderimi
   */
  async sendTestMessage(): Promise<{ success: boolean; mode: 'LIVE' | 'SIMULATED'; message: string }> {
    const testText = `
✅ *MarketPulse AI — Telegram Entegrasyonu Aktif*

Finansal İstihbarat Merkezi (Intelligence Hub) bildirimleri başarıyla doğrulandı.
⚡ *Alarm Eşiği:* Etki Puanı $\\ge$ ${this.threshold}/10
🛡️ *Güvenlik & Filtre:* Varlık tipi doğrulaması ve 6 saatlik spam engelleyici aktif.

---
⚠️ _Bu bir yatırım tavsiyesi değildir. Sadece piyasa istihbaratı bilgilendirmesidir._
`.trim();

    const isLive = this.isConfigured();
    const success = await this.sendMessage(testText, 'TEST', 'Bağlantı Doğrulama Testi', 9.0, 'HIGH');

    return {
      success,
      mode: isLive ? 'LIVE' : 'SIMULATED',
      message: isLive
        ? 'Telegram botuna gerçek canlı test mesajı başarıyla iletildi.'
        : 'Telegram bot token ayarlı olmadığı için bildirim simülasyon modunda yerel alarm defterine kaydedildi.',
    };
  }

  private recordHistory(
    ticker: string,
    title: string,
    impact_score: number,
    severity: string,
    status: TelegramNotificationRecord['status']
  ) {
    this.sentHistory.unshift({
      id: `tg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ticker,
      title,
      impact_score,
      severity,
      sentAt: new Date().toISOString(),
      status,
    });
    if (this.sentHistory.length > 50) this.sentHistory.pop();
  }

  private getWeeklyCriticalData(ticker: string) {
    const now = Date.now();
    const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
    const existing = this.symbolWeeklyCriticalCount.get(ticker);

    if (!existing || now - existing.weekStart > ONE_WEEK_MS) {
      const fresh = { count: 0, weekStart: now };
      this.symbolWeeklyCriticalCount.set(ticker, fresh);
      return fresh;
    }

    return existing;
  }
}

export const telegramService = new TelegramService();
