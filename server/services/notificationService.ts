import { PortfolioAlert } from '../portfolio/portfolioTypes';

interface TelegramConfig {
  botToken?: string;
  chatId?: string;
  enabled: boolean;
  notifyLargeDrop: boolean;
  notifyLargeGain: boolean;
  notifyMaxDrawdown: boolean;
  notifyAiRecommendations: boolean;
  dropThresholdPct: number; // varsayılan -3%
  gainThresholdPct: number; // varsayılan +3%
  drawdownThresholdPct: number; // varsayılan 15%
}

const defaultTelegramConfig: TelegramConfig = {
  botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  chatId: process.env.TELEGRAM_CHAT_ID || '',
  enabled: !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
  notifyLargeDrop: true,
  notifyLargeGain: true,
  notifyMaxDrawdown: true,
  notifyAiRecommendations: true,
  dropThresholdPct: -3.0,
  gainThresholdPct: 3.0,
  drawdownThresholdPct: 15.0,
};

// In-Memory Notification Queue (Son 50 Bildirim)
const alertHistory: PortfolioAlert[] = [
  {
    id: 'alert-init-1',
    portfolioId: 'portfolio-default-1',
    type: 'AI_RECOMMENDATION',
    severity: 'info',
    title: '📊 AI Sinyal Güncellemesi',
    message: 'THYAO için EMA 50 desteği ve güçlü alım momentumu tespit edildi (Öneri: ADD)',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    read: false,
  },
  {
    id: 'alert-init-2',
    portfolioId: 'portfolio-default-1',
    type: 'LARGE_GAIN',
    severity: 'success',
    title: '🟢 Günlük Kâr Eşiği Aşıldı',
    message: 'Portföyünüz bugün %3.42 değer kazandı.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: true,
  }
];

export async function sendTelegramMessage(botToken: string, chatId: string, text: string): Promise<{ success: boolean; message: string }> {
  if (!botToken || !chatId) {
    return { success: false, message: 'Telegram Bot Token veya Chat ID eksik.' };
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
      }),
    });

    const data = (await response.json()) as any;
    if (response.ok && data.ok) {
      return { success: true, message: 'Telegram bildirimi başarıyla gönderildi.' };
    } else {
      return { success: false, message: data.description || 'Telegram API hatası' };
    }
  } catch (error: any) {
    return { success: false, message: error.message || 'Telegram bağlantı hatası' };
  }
}

export async function recordPortfolioAlert(alert: Omit<PortfolioAlert, 'id' | 'timestamp' | 'read'>): Promise<PortfolioAlert> {
  const newAlert: PortfolioAlert = {
    ...alert,
    id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    read: false,
  };

  alertHistory.unshift(newAlert);
  if (alertHistory.length > 100) {
    alertHistory.pop();
  }

  // Telegram Konfigürasyonu Varsa Bildirim Gönder
  if (defaultTelegramConfig.enabled && defaultTelegramConfig.botToken && defaultTelegramConfig.chatId) {
    const telegramText = `<b>${newAlert.title}</b>\n\n${newAlert.message}\n\n<i>MarketPulse AI Portföy Takip Motoru</i>`;
    sendTelegramMessage(defaultTelegramConfig.botToken, defaultTelegramConfig.chatId, telegramText).catch((err) => {
      console.warn('Telegram send failed:', err);
    });
  }

  return newAlert;
}

export function getPortfolioAlerts(portfolioId?: string): PortfolioAlert[] {
  if (portfolioId) {
    return alertHistory.filter(a => a.portfolioId === portfolioId || a.portfolioId === 'all');
  }
  return alertHistory;
}

export function markAlertAsRead(alertId: string): boolean {
  const alert = alertHistory.find(a => a.id === alertId);
  if (alert) {
    alert.read = true;
    return true;
  }
  return false;
}

export function getTelegramConfig(): TelegramConfig {
  return { ...defaultTelegramConfig };
}

export function updateTelegramConfig(newConfig: Partial<TelegramConfig>): TelegramConfig {
  Object.assign(defaultTelegramConfig, newConfig);
  defaultTelegramConfig.enabled = !!(defaultTelegramConfig.botToken && defaultTelegramConfig.chatId);
  return { ...defaultTelegramConfig };
}

/**
 * Sends a structured IPO notification via Telegram
 */
export async function sendIpoTelegramNotification(ipo: {
  ticker: string;
  companyName: string;
  offerPrice: number;
  bookBuildingStartDate: string;
  bookBuildingEndDate: string;
  methodLabel?: string;
  prospectusUrl?: string;
}): Promise<{ success: boolean; message: string }> {
  if (!defaultTelegramConfig.enabled || !defaultTelegramConfig.botToken || !defaultTelegramConfig.chatId) {
    return { success: false, message: 'Telegram entegrasyonu yapılandırılmamış.' };
  }

  const message = [
    `🔔 <b>YENİ HALKA ARZ (IPO) DUYURUSU</b>`,
    `━━━━━━━━━━━━━━━━━━━`,
    `🏢 <b>Şirket:</b> ${ipo.companyName}`,
    `🏷️ <b>BIST Kodu:</b> #${ipo.ticker}`,
    `💰 <b>Halka Arz Fiyatı:</b> ₺${ipo.offerPrice.toFixed(2)}`,
    `📅 <b>Talep Toplama:</b> ${ipo.bookBuildingStartDate} — ${ipo.bookBuildingEndDate}`,
    `📊 <b>Dağıtım Modeli:</b> ${ipo.methodLabel || 'Bireysele Eşit'}`,
    ipo.prospectusUrl ? `📄 <a href="${ipo.prospectusUrl}">Resmi KAP İzahnamesini İncele</a>` : '',
    `━━━━━━━━━━━━━━━━━━━`,
    `⚡ <i>MarketPulse AI Halka Arz Takip & İstihbarat Merkezi</i>`
  ].filter(Boolean).join('\n');

  return sendTelegramMessage(defaultTelegramConfig.botToken, defaultTelegramConfig.chatId, message);
}

