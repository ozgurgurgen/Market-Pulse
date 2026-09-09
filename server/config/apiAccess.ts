/**
 * API ERİŞİM KONTROL LİSTESİ & FALLBACK STRATEJİSİ
 * 
 * Her API kaynağı için erişilebilirlik durumu, yetkilendirme gereksinimleri,
 * alternatif kaynak (fallback) ve dayanıklılık kuralları tanımlanmıştır.
 */

export interface APIAccessConfig {
  sourceName: string;
  displayName: string;
  isAccessible: boolean;
  requiresKey: boolean;
  apiKeyEnvVar?: string;
  fallbackSource?: string;
  rateLimitPerHour: number;
  priority: 'primary' | 'secondary' | 'fallback';
  notes: string;
}

export const API_ACCESS_LIST: APIAccessConfig[] = [
  {
    sourceName: 'yahoo_finance',
    displayName: 'Yahoo Finance API',
    isAccessible: true,
    requiresKey: false,
    rateLimitPerHour: 500,
    priority: 'primary',
    notes: 'Ücretsiz, güvenilir, canlı piyasa ve haber akışı için birincil omurga.',
  },
  {
    sourceName: 'kap',
    displayName: 'KAP (Kamuyu Aydınlatma Platformu)',
    isAccessible: true,
    requiresKey: false,
    rateLimitPerHour: 200,
    priority: 'primary',
    notes: 'Resmi BIST şirket bildirimleri, parser ve açık haber beslemesiyle tam erişilebilir.',
  },
  {
    sourceName: 'tefas',
    displayName: 'TEFAS Fon Bilgilendirme',
    isAccessible: true,
    requiresKey: false,
    rateLimitPerHour: 100,
    priority: 'primary',
    notes: 'Açık web sorgusu üzerinden fon portföy dağılımı ve getiri verileri.',
  },
  {
    sourceName: 'reddit',
    displayName: 'Reddit (r/Yatirim & r/WallStreetBets)',
    isAccessible: true,
    requiresKey: false,
    rateLimitPerHour: 3600,
    priority: 'primary',
    notes: 'Açık JSON endpointleri ve topluluk tartışmalarıyla yatırımcı duygu analizi.',
  },
  {
    sourceName: 'trading_economics',
    displayName: 'Trading Economics Macro',
    isAccessible: true,
    requiresKey: false,
    rateLimitPerHour: 300,
    priority: 'secondary',
    notes: 'Makroekonomik faiz, enflasyon ve TCMB veri takvimi.',
  },
  {
    sourceName: 'foreks',
    displayName: 'Foreks Haber Ajansı',
    isAccessible: false, // Kurumsal API lisansı gerekebilir
    requiresKey: true,
    apiKeyEnvVar: 'FOREKS_API_KEY',
    fallbackSource: 'yahoo_finance',
    rateLimitPerHour: 50,
    priority: 'secondary',
    notes: 'Özel anahtar tanımlı değilse otomatik olarak Yahoo Finance + KAP beslemesine devreder.',
  },
  {
    sourceName: 'bloomberg_ht',
    displayName: 'Bloomberg HT',
    isAccessible: false, // Kurumsal feed
    requiresKey: true,
    apiKeyEnvVar: 'BLOOMBERG_HT_API_KEY',
    fallbackSource: 'yahoo_finance',
    rateLimitPerHour: 100,
    priority: 'secondary',
    notes: 'API anahtarı yoksa Yahoo Finance haber özetleri ve açık RSS ile graceful degradation uygulanır.',
  },
  {
    sourceName: 'twitter',
    displayName: 'X / Twitter Finance',
    isAccessible: false, // Ücretli Basic API tier gerektirir
    requiresKey: true,
    apiKeyEnvVar: 'TWITTER_BEARER_TOKEN',
    fallbackSource: 'reddit',
    rateLimitPerHour: 100,
    priority: 'secondary',
    notes: 'Ücretli API gerektirir; anahtar yoksa otomatik olarak Reddit r/Yatirim duygu akışına geçer.',
  },
  {
    sourceName: 'midas_forum',
    displayName: 'Midas Kulak / Topluluk',
    isAccessible: false,
    requiresKey: false,
    fallbackSource: 'reddit',
    rateLimitPerHour: 60,
    priority: 'fallback',
    notes: 'Resmi API mevcut değil; kurallara uygun olarak Reddit ve açık finansal forumlara yönlendirilir.',
  },
];

export function getAccessibleSources(): APIAccessConfig[] {
  return API_ACCESS_LIST.filter((s) => s.isAccessible || (s.requiresKey && s.apiKeyEnvVar && !!process.env[s.apiKeyEnvVar]));
}

export function getInaccessibleSources(): APIAccessConfig[] {
  return API_ACCESS_LIST.filter((s) => !s.isAccessible && (!s.apiKeyEnvVar || !process.env[s.apiKeyEnvVar]));
}

export function getSourceConfig(sourceName: string): APIAccessConfig | undefined {
  return API_ACCESS_LIST.find((s) => s.sourceName.toLowerCase() === sourceName.toLowerCase());
}

export function getEffectiveSource(sourceName: string): string {
  const config = getSourceConfig(sourceName);
  if (!config) return sourceName;
  if (config.isAccessible || (config.requiresKey && config.apiKeyEnvVar && !!process.env[config.apiKeyEnvVar])) {
    return config.sourceName;
  }
  return config.fallbackSource || 'yahoo_finance';
}
