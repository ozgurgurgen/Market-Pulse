import { TefasFund, TefasFundDetail, TefasCategory } from '../types';

export interface FundSeed {
  code: string;
  name: string;
  founder: string;
  category: TefasCategory;
  categoryLabel: string;
  riskScore: number;
  horizon: 'SHORT' | 'MEDIUM' | 'LONG';
  basePrice: number;
  return1Y: number;
  return3Y?: number;
  return5Y?: number;
  sharpe: number;
  withholdingTax: number;
  fundSize: string;
  investorCount: number;
  topHoldings: string[];
  aiVerdict: 'ENFLASYON KALKANI' | 'GÜÇLÜ AL' | 'DENGELİ BİRİKİM' | 'KISA VADE LİKİT' | 'YÜKSEK BÜYÜME' | 'İZLEMEDE KAL';
  aiStrategyNote: string;
}

export const TEFAS_FUNDS: TefasFund[] = [
  {
    code: 'MAC',
    name: 'Marmara Capital Portföy Hisse Senedi Fonu',
    founder: 'Marmara Capital Portföy Yönetimi A.Ş.',
    category: 'HISSE_YOGUN',
    categoryLabel: 'Hisse Senedi (Değer & Alpha)',
    riskScore: 7,
    horizon: 'LONG',
    price: 38.641,
    dailyReturn: 0.27,
    return1M: 7.14,
    return3M: 21.41,
    return6M: 42.82,
    return1Y: 89.2,
    return3Y: 338.96,
    return5Y: 847.4,
    annualizedReturn: 89.2,
    inflationBeat1Y: 44.2,
    sharpeRatio: 2.62,
    standardDeviation: 27.4,
    maxDrawdown: -20.6,
    negativeDaysPercent: 42.5,
    managementFee: 2.7,
    withholdingTax: 0,
    settlementBuy: 'T+1',
    settlementSell: 'T+2',
    fundSize: '8.9 Milyar ₺',
    investorCount: 36400,
    assetAllocation: [
      { label: 'Hisse Senedi (Değer & Alpha)', ratio: 85, color: '#10b981' },
      { label: 'Ters Repo / Takasbank', ratio: 10, color: '#3b82f6' },
      { label: 'Nakit / Diğer', ratio: 5, color: '#f59e0b' }
    ],
    topHoldings: ['THYAO', 'TUPRS', 'BIMAS', 'KCHOL'],
    aiVerdict: 'ENFLASYON KALKANI',
    aiLiteracyScore: 92,
    aiStrategyNote: 'Disiplinli Değer Yatırımı ve Güçlü Nakit Akışı.',
    aiReasoning: 'Marmara Capital Portföy Yönetimi tarafından yönetilen MAC fonu, BIST hisselerinde yüksek alfa ve düzenli getiri performansı sergilemektedir.',
    sparkline: [100, 105, 108, 112, 115, 122, 128, 134, 142, 158, 172, 189]
  },
  {
    code: 'TI3',
    name: 'İş Portföy BIST Teknoloji Ağırlıklı Sınırlı Hisse Fonu',
    founder: 'İş Portföy Yönetimi A.Ş.',
    category: 'HISSE_YOGUN',
    categoryLabel: 'Teknoloji & İnovasyon Hisse Fonu',
    riskScore: 7,
    horizon: 'LONG',
    price: 14.285,
    dailyReturn: 0.85,
    return1M: 9.40,
    return3M: 26.10,
    return6M: 54.80,
    return1Y: 108.6,
    return3Y: 412.30,
    return5Y: 980.0,
    annualizedReturn: 108.6,
    inflationBeat1Y: 63.6,
    sharpeRatio: 2.55,
    standardDeviation: 31.2,
    maxDrawdown: -24.1,
    negativeDaysPercent: 44.0,
    managementFee: 2.5,
    withholdingTax: 0,
    settlementBuy: 'T+1',
    settlementSell: 'T+2',
    fundSize: '6.4 Milyar ₺',
    investorCount: 48200,
    assetAllocation: [
      { label: 'BIST Teknoloji Hisseleri', ratio: 88, color: '#06b6d4' },
      { label: 'Ters Repo', ratio: 8, color: '#3b82f6' },
      { label: 'Nakit', ratio: 4, color: '#f59e0b' }
    ],
    topHoldings: ['ASELS', 'KFEIN', 'LOGO', 'MIATK'],
    aiVerdict: 'YÜKSEK BÜYÜME',
    aiLiteracyScore: 90,
    aiStrategyNote: 'Teknoloji Sektörü ve Dijital Dönüşüm Şirketleri.',
    aiReasoning: 'Yerli yazılım ve teknoloji şirketlerinin büyüme ivmesini portföyüne yansıtan yüksek getirili hisse fonu.',
    sparkline: [100, 107, 114, 120, 129, 140, 155, 170, 188, 208]
  },
  {
    code: 'TCD',
    name: 'Tacirler Portföy Değişken Fon',
    founder: 'Tacirler Portföy Yönetimi A.Ş.',
    category: 'DEGISKEN',
    categoryLabel: 'Dinamik Çoklu Varlık Fonu',
    riskScore: 6,
    horizon: 'MEDIUM',
    price: 24.19,
    dailyReturn: 0.42,
    return1M: 6.80,
    return3M: 19.50,
    return6M: 38.40,
    return1Y: 84.5,
    return3Y: 310.20,
    return5Y: 790.0,
    annualizedReturn: 84.5,
    inflationBeat1Y: 39.5,
    sharpeRatio: 2.40,
    standardDeviation: 24.8,
    maxDrawdown: -18.2,
    negativeDaysPercent: 41.0,
    managementFee: 2.8,
    withholdingTax: 10,
    settlementBuy: 'T+1',
    settlementSell: 'T+2',
    fundSize: '5.2 Milyar ₺',
    investorCount: 29500,
    assetAllocation: [
      { label: 'Hisse Senedi', ratio: 65, color: '#10b981' },
      { label: 'Eurobond / Tahvil', ratio: 20, color: '#8b5cf6' },
      { label: 'Ters Repo & Nakit', ratio: 15, color: '#3b82f6' }
    ],
    topHoldings: ['SAHOL', 'FROTO', 'TCELL', 'Devlet Tahvili'],
    aiVerdict: 'DENGELİ BİRİKİM',
    aiLiteracyScore: 89,
    aiStrategyNote: 'Konjonktüre Göre Varlık Dağılımı Yönetimi.',
    aiReasoning: 'Piyasa döngülerine dinamik uyum sağlayan, esnek varlık tahsis stratejisine sahip popüler değişken fon.',
    sparkline: [100, 104, 109, 116, 122, 131, 142, 158, 172, 184]
  },
  {
    code: 'IIH',
    name: 'İstanbul Portföy Üçüncü Hisse Senedi Fonu',
    founder: 'İstanbul Portföy Yönetimi A.Ş.',
    category: 'HISSE_YOGUN',
    categoryLabel: 'Seçici BIST Hisse Fonu',
    riskScore: 7,
    horizon: 'LONG',
    price: 19.85,
    dailyReturn: 0.35,
    return1M: 8.20,
    return3M: 24.50,
    return6M: 48.90,
    return1Y: 96.4,
    return3Y: 365.0,
    return5Y: 880.0,
    annualizedReturn: 96.4,
    inflationBeat1Y: 51.4,
    sharpeRatio: 2.58,
    standardDeviation: 26.5,
    maxDrawdown: -19.4,
    negativeDaysPercent: 41.5,
    managementFee: 2.6,
    withholdingTax: 0,
    settlementBuy: 'T+1',
    settlementSell: 'T+2',
    fundSize: '11.8 Milyar ₺',
    investorCount: 52000,
    assetAllocation: [
      { label: 'BIST 100 Dışı & İhracatçı Hisseler', ratio: 86, color: '#10b981' },
      { label: 'Ters Repo', ratio: 9, color: '#3b82f6' },
      { label: 'Nakit', ratio: 5, color: '#f59e0b' }
    ],
    topHoldings: ['CCOLA', 'MAVI', 'ENKAI', 'OTKAR'],
    aiVerdict: 'ENFLASYON KALKANI',
    aiLiteracyScore: 94,
    aiStrategyNote: 'İhracat Ağırlıklı ve Döviz Geliri Olan Şirketler.',
    aiReasoning: 'Güçlü bilançolara sahip ihracat şampiyonu şirketlere yatırım yaparak enflasyon ve kur dalgalanmalarına karşı koruma sağlar.',
    sparkline: [100, 106, 112, 121, 130, 142, 156, 173, 196]
  },
  {
    code: 'AFT',
    name: 'Ak Portföy Yeni Teknolojiler Yabancı Hisse Fonu',
    founder: 'Ak Portföy Yönetimi A.Ş.',
    category: 'YABANCI',
    categoryLabel: 'Küresel Teknoloji & Yapay Zeka',
    riskScore: 7,
    horizon: 'LONG',
    price: 0.842,
    dailyReturn: 1.15,
    return1M: 6.40,
    return3M: 18.20,
    return6M: 39.50,
    return1Y: 78.4,
    return3Y: 285.0,
    return5Y: 690.0,
    annualizedReturn: 78.4,
    inflationBeat1Y: 33.4,
    sharpeRatio: 2.15,
    standardDeviation: 25.8,
    maxDrawdown: -22.5,
    negativeDaysPercent: 43.0,
    managementFee: 2.9,
    withholdingTax: 10,
    settlementBuy: 'T+1',
    settlementSell: 'T+3',
    fundSize: '14.2 Milyar ₺',
    investorCount: 94000,
    assetAllocation: [
      { label: 'ABD & Global Teknoloji Devleri', ratio: 92, color: '#3b82f6' },
      { label: 'Nakit & Teminat', ratio: 8, color: '#64748b' }
    ],
    topHoldings: ['NVDA', 'MSFT', 'AAPL', 'GOOGL', 'AMZN'],
    aiVerdict: 'YÜKSEK BÜYÜME',
    aiLiteracyScore: 91,
    aiStrategyNote: 'Yapay Zeka, Bulut Bilişim ve Yarı İletken Liderleri.',
    aiReasoning: 'Nasdaq ve global teknoloji devlerine TL bazında yatırım imkanı sunan, yapay zeka devrimini portföye taşıyan öncü fon.',
    sparkline: [100, 105, 111, 119, 128, 139, 152, 168, 178]
  },
  {
    code: 'VGA',
    name: 'ALTIN KATILIM EMEKLİLİK',
    founder: 'Katılım Emeklilik',
    category: 'KIYMETLI_MADEN',
    categoryLabel: 'Altın & Değerli Madenler',
    riskScore: 4,
    horizon: 'MEDIUM',
    price: 0.7817,
    dailyReturn: 0.21,
    return1M: 5.47,
    return3M: 16.42,
    return6M: 32.83,
    return1Y: 68.4,
    return3Y: 259.92,
    return5Y: 649.8,
    annualizedReturn: 68.4,
    inflationBeat1Y: 23.4,
    sharpeRatio: 2.10,
    standardDeviation: 20.8,
    maxDrawdown: -15.2,
    negativeDaysPercent: 38.0,
    managementFee: 1.9,
    withholdingTax: 0,
    settlementBuy: 'T+1',
    settlementSell: 'T+2',
    fundSize: '254.8 M ₺',
    investorCount: 1990757,
    assetAllocation: [
      { label: 'Altın & Kıymetli Madenler', ratio: 85, color: '#eab308' },
      { label: 'Takasbank Katılım', ratio: 10, color: '#10b981' },
      { label: 'Nakit', ratio: 5, color: '#f59e0b' }
    ],
    topHoldings: ['Fiziki Altın', 'Kira Sertifikaları'],
    aiVerdict: 'ENFLASYON KALKANI',
    aiLiteracyScore: 88,
    aiStrategyNote: 'Faizsiz Değerli Maden ve Portföy Koruma.',
    aiReasoning: 'Altın ve kıymetli madenlere katılım esasları çerçevesinde yatırım yaparak güvenli liman koruması sağlar.',
    sparkline: [100, 105, 108, 112, 115, 122, 130, 142, 155, 168]
  },
  {
    code: 'KZL',
    name: 'Kuveyt Türk Portföy Altın Fonu',
    founder: 'Kuveyt Türk Portföy Yönetimi A.Ş.',
    category: 'KIYMETLI_MADEN',
    categoryLabel: 'Altın & Kıymetli Maden',
    riskScore: 4,
    horizon: 'MEDIUM',
    price: 0.528,
    dailyReturn: 0.18,
    return1M: 5.20,
    return3M: 15.80,
    return6M: 31.40,
    return1Y: 66.8,
    return3Y: 252.0,
    return5Y: 630.0,
    annualizedReturn: 66.8,
    inflationBeat1Y: 21.8,
    sharpeRatio: 2.05,
    standardDeviation: 19.5,
    maxDrawdown: -14.8,
    negativeDaysPercent: 37.5,
    managementFee: 1.8,
    withholdingTax: 0,
    settlementBuy: 'T+1',
    settlementSell: 'T+2',
    fundSize: '7.8 Milyar ₺',
    investorCount: 68000,
    assetAllocation: [
      { label: 'Fiziki Altın / Altına Dayalı Kira Sertifikası', ratio: 88, color: '#eab308' },
      { label: 'Katılım Hesabı & Nakit', ratio: 12, color: '#10b981' }
    ],
    topHoldings: ['Altın Hesabı', 'Hazine Altın Tahvili'],
    aiVerdict: 'ENFLASYON KALKANI',
    aiLiteracyScore: 87,
    aiStrategyNote: 'Ons Altın ve Dolar/TL Getirisinden Faydalanma.',
    aiReasoning: 'Altın fiyatlarındaki yükselişi gram altın bazında yatırımcısına tam olarak yansıtır.',
    sparkline: [100, 104, 107, 111, 116, 124, 132, 145, 166]
  },
  {
    code: 'PPZ',
    name: 'Azimut Portföy Para Piyasası Fonu',
    founder: 'Azimut Portföy Yönetimi A.Ş.',
    category: 'PARA_PIYASASI',
    categoryLabel: 'Para Piyasası (Günlük Likit)',
    riskScore: 1,
    horizon: 'SHORT',
    price: 3.421,
    dailyReturn: 0.14,
    return1M: 4.25,
    return3M: 13.10,
    return6M: 27.20,
    return1Y: 56.4,
    return3Y: 145.0,
    return5Y: 310.0,
    annualizedReturn: 56.4,
    inflationBeat1Y: 11.4,
    sharpeRatio: 3.85,
    standardDeviation: 1.2,
    maxDrawdown: -0.05,
    negativeDaysPercent: 0.1,
    managementFee: 1.5,
    withholdingTax: 10,
    settlementBuy: 'T+0',
    settlementSell: 'T+0',
    fundSize: '18.5 Milyar ₺',
    investorCount: 112000,
    assetAllocation: [
      { label: 'Ters Repo / Takasbank Para Piyasası', ratio: 70, color: '#3b82f6' },
      { label: 'Mevduat / Katılma Hesabı', ratio: 20, color: '#10b981' },
      { label: 'Kısa Vadeli Borçlanma Araçları', ratio: 10, color: '#f59e0b' }
    ],
    topHoldings: ['Takasbank TPP', 'Özel Sektör Bonoları'],
    aiVerdict: 'KISA VADE LİKİT',
    aiLiteracyScore: 95,
    aiStrategyNote: 'Günlük Bileşik Faiz Getirisi ve Anında Likidite (T+0).',
    aiReasoning: 'Sıfıra yakın riskle günlük yüksek faiz getirisi sunan, aynı gün nakde dönebilen likit fon.',
    sparkline: [100, 104, 108, 113, 118, 124, 131, 139, 147, 156]
  }
];

export function getFundDetailByCode(code: string): TefasFundDetail | null {
  const cleanCode = (code || '').trim().toUpperCase();
  const fund = TEFAS_FUNDS.find(f => f.code === cleanCode);
  if (!fund) return null;

  return {
    ...fund,
    managerProfile: `${fund.founder} Profesyonel Portföy Yönetim Ekibi`,
    stressTestScore: Math.round(Math.min(98, Math.max(50, 100 - (fund.riskScore * 8) + (fund.sharpeRatio * 6)))),
    inflationSimulation: [
      { period: '1 Ay', nominalFundGain: fund.return1M, inflationRate: 3.2, netRealGain: Number((fund.return1M - 3.2).toFixed(2)), purchasingPowerProtection: fund.return1M >= 3.2 ? 'YÜKSEK REEL KAZANÇ' : 'KISMİ KORUMA' },
      { period: '3 Ay', nominalFundGain: fund.return3M, inflationRate: 9.8, netRealGain: Number((fund.return3M - 9.8).toFixed(2)), purchasingPowerProtection: fund.return3M >= 9.8 ? 'YÜKSEK REEL KAZANÇ' : 'KISMİ KORUMA' },
      { period: '6 Ay', nominalFundGain: fund.return6M, inflationRate: 19.5, netRealGain: Number((fund.return6M - 19.5).toFixed(2)), purchasingPowerProtection: fund.return6M >= 19.5 ? 'TAM KORUMA' : 'ENFLASYON ALTI' },
      { period: '1 Yıl', nominalFundGain: fund.return1Y, inflationRate: 44.0, netRealGain: Number((fund.return1Y - 44.0).toFixed(2)), purchasingPowerProtection: fund.return1Y >= 44.0 ? 'TAM KORUMA' : 'ENFLASYON ALTI' }
    ],
    monthlyPerformance: [
      { month: 'Oca', fundReturn: 6.8, inflationRate: 4.5, bistReturn: 5.2 },
      { month: 'Şub', fundReturn: 7.4, inflationRate: 3.9, bistReturn: 6.8 },
      { month: 'Mar', fundReturn: 5.1, inflationRate: 3.2, bistReturn: 4.1 },
      { month: 'Nis', fundReturn: 8.2, inflationRate: 3.1, bistReturn: 7.5 },
      { month: 'May', fundReturn: 9.6, inflationRate: 3.4, bistReturn: 8.9 },
      { month: 'Haz', fundReturn: 6.4, inflationRate: 2.8, bistReturn: 5.8 }
    ],
    aiLiteracyDeepReport: {
      pros: [
        `Yıllık %${fund.return1Y} getiri ile enflasyon üzerinde %${fund.inflationBeat1Y} net reel alfa üretimi`,
        `Sharpe Oranı: ${fund.sharpeRatio} ile yüksek risk-ayarlı getiri verimliliği`,
        `${fund.withholdingTax === 0 ? '%0 Stopaj Muafiyeti avantajı' : `%${fund.withholdingTax} Stopaj Oranı`}`
      ],
      cons: [
        `Risk Derecesi: ${fund.riskScore}/7`,
        `Yıllık %${fund.managementFee} yönetim ücreti`
      ],
      suitability: `${fund.horizon === 'LONG' ? 'Uzun Vadeli (1-5 Yıl)' : fund.horizon === 'SHORT' ? 'Kısa Vadeli (1-3 Ay)' : 'Orta Vadeli (3-12 Ay)'} büyüme ve reel getiri hedefleri için uygundur.`,
      taxAdvice: fund.withholdingTax === 0 ? 'Mevzuat gereği hisse yoğun fonlar %0 stopaj avantajına sahiptir.' : `Kazançlar üzerinden yasal %${fund.withholdingTax} stopaj uygulanır.`,
      idealEntryExitStrategy: fund.aiStrategyNote
    }
  };
}

export const getTefasFundDetail = getFundDetailByCode;

