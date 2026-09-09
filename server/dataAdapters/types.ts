/**
 * CANONICAL DATA CONTRACT (SABİT İÇ VERİ SÖZLEŞMESİ)
 * MarketPulse AI — Anti-Corruption Layer (ACL)
 * 
 * Tüm dış veri kaynakları (Yahoo Finance, Binance, TEFAS, TCMB, FRED, ECB, TUIK, KAP)
 * bu tiplere dönüştürülerek sisteme sokulur.
 * Hiçbir ham API yanıtı veya doğrulanmamış veri bu katmanın dışına sızamaz.
 */

export type AssetCategory = 'BIST' | 'US_STOCKS' | 'ETF' | 'CRYPTO' | 'COMMODITIES' | 'FOREX' | 'FUND';

export type CurrencyCode = 'TRY' | 'USD' | 'EUR' | 'GBP' | 'XAU' | 'USDT';

export interface ValidationMeta {
  isValid: boolean;
  validationErrors: string[];
  sanitized: boolean;
  originalPrice?: number;
}

/**
 * 1. NormalizedQuote (Hisse, Kripto, Emtia, Döviz, ETF Fiyat Sözleşmesi)
 */
export interface NormalizedQuote {
  symbol: string;               // Normalize edilmiş sembol (örn: THYAO, CANTE, BTC-USD, USDTRY)
  rawSymbol: string;            // Dış kaynaktaki ham sembol (örn: THYAO.IS, BTCUSDT)
  name: string;                 // Varlık Adı
  category: AssetCategory;      // BIST, US_STOCKS, CRYPTO, etc.
  exchange: string;             // BIST, NASDAQ, BINANCE, FOREX, etc.
  price: number;                // Kesinlikle pozitif (> 0), split-adjusted güncel fiyat
  currency: CurrencyCode;       // Para birimi (TRY, USD, EUR)
  change24h: number | null;     // 24s nominal değişim
  changePercent: number;        // 24s yüzdesel değişim (-100 ile +1000 arası makul sınır)
  high24h?: number;             // Günlük en yüksek
  low24h?: number;              // Günlük en düşük
  volume: number | null;        // Hacim (sayısal veya null)
  marketCap?: number;           // Piyasa değeri (sayısal)
  peRatio?: number;             // F/K Oranı
  asOf: string;                 // ISO 8601 Timestamp (örn: 2026-08-30T16:50:00.000Z)
  sourceName: string;           // 'yahoo' | 'binance' | 'frankfurter' | 'local_fallback'
  isStale: boolean;             // Veri 15 dakikadan eski mi?
  validation: ValidationMeta;   // Doğrulama & Sanity-check durumu
  sparkline?: number[];         // 12 noktalı geçmiş trend
}

/**
 * 2. NormalizedFund (TEFAS & Yatırım Fonu Sözleşmesi)
 */
export interface NormalizedFund {
  code: string;                 // 3 Haneli Fon Kodu (örn: TI2, MAC, TCD)
  name: string;                 // Fon Unvanı
  founder: string;              // Portföy Yönetim Şirketi (PYŞ)
  category: string;             // HISSE_YOGUN, BORCLANMA, DEGISKEN, FON_SEPETI, etc.
  categoryLabel: string;        // Türkçe Okunabilir Kategori
  price: number;                // Fon Pay Fiyatı (kesinlikle > 0)
  currency: CurrencyCode;       // TRY
  riskScore: number;            // 1 - 7 arası SPK Risk Değeri
  horizon: 'SHORT' | 'MEDIUM' | 'LONG';
  returnDaily?: number;         // Günlük Getiri %
  return1M?: number;            // 1 Aylık Getiri %
  return3M?: number;            // 3 Aylık Getiri %
  return6M?: number;            // 6 Aylık Getiri %
  return1Y: number;             // 1 Yıllık Getiri %
  return3Y?: number;            // 3 Yıllık Getiri %
  return5Y?: number;            // 5 Yıllık Getiri %
  sharpeRatio: number;          // Sharpe Oranı
  inflationBeat1Y: number;      // 1 Yıllık Enflasyon Üzeri Reel Getiri %
  withholdingTax: number;       // Stopaj Oranı (%0 veya %10)
  fundSizeTRY?: number;         // Fon Toplam Değeri (TRY cinsinden sayısal)
  fundSizeFormatted: string;    // '12.4 Milyar ₺'
  investorCount: number;        // Yatırımcı Sayısı
  topHoldings: string[];        // İlk 5 Ağırlıklı Varlık (örn: ['THYAO', 'TUPRS'])
  aiVerdict?: string;           // AI Yorumu
  asOf: string;                 // ISO 8601 Timestamp
  sourceName: string;           // 'tefas_scraping' | 'tefas_api' | 'tefas_catalog'
  isStale: boolean;
  validation: ValidationMeta;
}

/**
 * 3. NormalizedIndicator (TCMB, FRED, ECB, TUIK Makro Gösterge Sözleşmesi)
 */
export interface NormalizedIndicator {
  indicatorCode: string;        // TCMB_POLICY_RATE, US_FED_FUNDS, TR_CPI_YOY, etc.
  name: string;                 // Gösterge Adı
  region: 'TR' | 'US' | 'EU' | 'GLOBAL';
  category: 'faiz' | 'enflasyon' | 'istihdam' | 'doviz' | 'risk_istahi' | 'emtia' | 'buyume' | 'para_ve_likidite';
  value: number;                // Güncel değer
  previousValue?: number;       // Önceki dönem değeri
  changeValue?: number;         // Değişim
  changePercent?: number;       // Yüzdesel değişim
  unit: string;                 // '%', 'TRY', 'Milyar USD', 'Puan'
  frequency: 'Günlük' | 'Aylık' | 'Çeyreklik' | 'Gerçek Zamanlı';
  periodDate: string;           // İlgili dönemin tarihi (örn: '2026-08' veya '2026-08-30')
  asOf: string;                 // Çekilme zamanı (ISO 8601)
  sourceName: 'TCMB_EVDS' | 'FRED' | 'ECB' | 'FRANKFURTER' | 'YAHOO_FINANCE' | 'TUIK';
  isStale: boolean;
  validation: ValidationMeta;
}

/**
 * 4. NormalizedDisclosure (KAP Şirket & Halka Arz Bildirimi Sözleşmesi)
 */
export interface NormalizedDisclosure {
  id: string;
  symbol: string;               // Şirket BIST Kodu
  companyName: string;          // Şirket Unvanı
  title: string;                // Bildirim Başlığı
  disclosureType: string;       // Özel Durum Açıklaması, Finansal Rapor, vb.
  publishDate: string;          // ISO 8601
  sourceUrl: string;
  sourceName: string;           // 'kap_api' | 'kap_feed'
  isVerified: boolean;
}

/**
 * Ortak Adaptör Arayüzü
 */
export interface DataSourceAdapter<TParams, TResult> {
  readonly sourceName: string;
  readonly isScraping: boolean;
  fetch(params: TParams): Promise<TResult>;
  healthCheck(): Promise<CanaryHealthResult>;
}

export interface CanaryHealthResult {
  sourceName: string;
  healthy: boolean;
  latencyMs: number;
  sampleKeyTested: string;
  error?: string;
  details?: Record<string, any>;
}
