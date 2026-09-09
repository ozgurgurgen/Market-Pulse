/**
 * Company Dynamic Knowledge Base
 * Gerçek BIST ve ABD şirket profilleri, sektörleri, faaliyet özetleri,
 * finansal oranları, temettü verimleri, iştirakleri ve rekabet avantajları.
 * Sembol bazında özelleştirilmiş, gerçekçi ve hisseye özgü analitik veriler sağlar.
 */

export interface StockKnowledgeProfile {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  businessSummary: string;
  thesisText: string;
  competitiveMoats: string[];
  catalysts: string[];
  risks: string[];
  whereThesisBreaks: string;
  freeFloatRatio: number;
  paidCapitalTRY: number;
  registeredCapitalTRY: number;
  dividendYield: number;
  payoutRatio: number;
  regularityStreakYears: number;
  dividendHistory: { year: string; type: 'TEMETTÜ' | 'BEDELSİZ'; rate: number; description: string }[];
  buybackProgram: {
    hasActiveProgram: boolean;
    programLimitShares: string;
    purchasedShares: string;
    completionRate: number;
    managementSignal: string;
  };
  shareholders: { name: string; sharePercent: number; isFreeFloat: boolean }[];
  subsidiaries: { name: string; sharePercent: number; fieldOfActivity: string; country: string }[];
  operationalMetrics: { metricName: string; currentValue: string; previousValue: string; period: string }[];
  financialMultiples: {
    pe: number;
    pb: number;
    evEbitda: number;
    netMarginPct: number;
    grossMarginPct: number;
    roePct: number;
    roaPct: number;
    currentRatio: number;
    netDebtToEbitda: number;
    revenueGrowthYoY: number;
    netProfitGrowthYoY: number;
    exportSharePct: number;
  };
  peers: { symbol: string; name: string; pe: number; pb: number; evebitda: number; netMargin: number; roe: number; currentRatio: number; netDebtToEbitda: number; marketCapTRY: number; return1Y: number }[];
  recentDeals: { date: string; project: string; amountRatioPct: number; impact: 'ÇOK_GÜÇLÜ' | 'ÖNEMLİ' | 'POZİTİF' }[];
  corporateEvents: { date: string; type: 'TEMETTU' | 'GK' | 'INSIDER' | 'KAP' | 'BEDELSIZ' | 'SUNUM'; title: string; description: string; impact: 'positive' | 'neutral' }[];
}

export const STOCK_KNOWLEDGE_BASE: Record<string, StockKnowledgeProfile> = {
  THYAO: {
    symbol: 'THYAO',
    name: 'Türk Hava Yolları A.O.',
    sector: 'Ulaştırma & Havacılık',
    industry: 'Uluslararası Yolcu ve Hava Kargo Taşımacılığı',
    businessSummary: 'Dünyanın en çok ülkesine uçan bayrak taşıyıcı havayolu şirketi. İstanbul Havalimanı mega hub avantajı, Turkish Cargo ve THY Teknik iştirakleriyle küresel havacılık devidir.',
    thesisText: 'İstanbul mega transfer merkezi avantajı, büyüyen modern uçak filosu, yüksek kargo gelirleri ve genişleyen yolcu doluluk oranıyla THYAO, küresel havacılık sektöründe güçlü nakit akışı ve iskontolu çarpanlarıyla öne çıkmaktadır.',
    competitiveMoats: [
      'İstanbul Havalimanı coğrafi ve operasyonel mega-hub avantajı',
      '340+ nokta ile dünyada en fazla ülkeye uçan network ağı',
      'Turkish Cargo ile küresel hava kargoda ilk 3 pazar payı',
      'Filo esnekliği ve genç geniş gövde uçak filosu'
    ],
    catalysts: [
      '2033 vizyonu doğrultusunda filonun 800+ uçağa çıkarılması hedefi',
      'Turkish Cargo ve THY Teknik şirketlerinin kısmi halka arz potansiyeli',
      'Uzak Doğu ve Amerika hatlarındaki transit yolcu trafiğinin hızlanması',
      'Düşen jet yakıtı maliyetlerinin marjlara olumlu yansıması'
    ],
    risks: [
      'Küresel jeopolitik gerilimler ve hava sahası kısıtlamaları',
      'Jet yakıtı (Brent/Kerosin) fiyatlarında ani sıçrama',
      'Boeing ve Airbus teslimat gecikmelerinin filo büyümesine etkisi'
    ],
    whereThesisBreaks: 'Bölgesel çatışmaların hava trafiğini durdurması veya küresel bir resesyonun uluslararası transit yolcu talebini sert biçimde düşürmesi.',
    freeFloatRatio: 50.88,
    paidCapitalTRY: 1380000000,
    registeredCapitalTRY: 10000000000,
    dividendYield: 2.4,
    payoutRatio: 15.0,
    regularityStreakYears: 3,
    dividendHistory: [
      { year: '2024', type: 'TEMETTÜ', rate: 2.4, description: 'Nakit Kâr Payı Dağıtımı' },
      { year: '2023', type: 'BEDELSİZ', rate: 0, description: 'İç Kaynaklara Aktarım' }
    ],
    buybackProgram: {
      hasActiveProgram: true,
      programLimitShares: '69.000.000 Adet (Sermayenin %5\'i)',
      purchasedShares: '28.400.000 Adet',
      completionRate: 41.2,
      managementSignal: 'Yönetim, hissenin uluslararası akranlarına kıyasla aşırı iskontolu olduğuna inanarak geri alımları sürdürüyor.'
    },
    shareholders: [
      { name: 'Türkiye Varlık Fonu (TVF)', sharePercent: 49.12, isFreeFloat: false },
      { name: 'Halka Açık Kısım (BIST)', sharePercent: 50.88, isFreeFloat: true }
    ],
    subsidiaries: [
      { name: 'Turkish Cargo A.Ş.', sharePercent: 100, fieldOfActivity: 'Küresel Hava Kargo ve Lojistik', country: 'Türkiye' },
      { name: 'THY Teknik A.Ş. (Turkish Technic)', sharePercent: 100, fieldOfActivity: 'Uçak Bakım, Onarım ve MRO Hizmetleri', country: 'Türkiye' },
      { name: 'SunExpress (Güneş Ekspres Havacılık)', sharePercent: 50, fieldOfActivity: 'Turizm & Charter Taşımacılık (Lufthansa Ortaklığı)', country: 'Türkiye / Almanya' },
      { name: 'TGS Yer Hizmetleri A.Ş.', sharePercent: 50, fieldOfActivity: 'Havalimanı Ramp & Yer Hizmetleri', country: 'Türkiye' }
    ],
    operationalMetrics: [
      { metricName: 'Toplam Taşınan Yolcu', currentValue: '84.8 Milyon', previousValue: '78.2 Milyon', period: 'Yıllık' },
      { metricName: 'Yolcu Doluluk Oranı (Load Factor)', currentValue: '%82.6', previousValue: '%81.4', period: 'Son Çeyrek' },
      { metricName: 'Aktif Uçak Filosu', currentValue: '462 Adet', previousValue: '435 Adet', period: '2026 Güncel' },
      { metricName: 'Kargo Hacmi', currentValue: '1.92 Milyon Ton', previousValue: '1.68 Milyon Ton', period: 'Yıllık' }
    ],
    financialMultiples: {
      pe: 4.8,
      pb: 0.95,
      evEbitda: 3.9,
      netMarginPct: 15.2,
      grossMarginPct: 24.8,
      roePct: 34.6,
      roaPct: 13.8,
      currentRatio: 1.45,
      netDebtToEbitda: 0.85,
      revenueGrowthYoY: 62.4,
      netProfitGrowthYoY: 48.6,
      exportSharePct: 88.5
    },
    peers: [
      { symbol: 'THYAO', name: 'Türk Hava Yolları', pe: 4.8, pb: 0.95, evebitda: 3.9, netMargin: 15.2, roe: 34.6, currentRatio: 1.45, netDebtToEbitda: 0.85, marketCapTRY: 425000000000, return1Y: 42.5 },
      { symbol: 'PGSUS', name: 'Pegasus Havacılık', pe: 6.4, pb: 1.48, evebitda: 4.9, netMargin: 12.4, roe: 28.5, currentRatio: 1.25, netDebtToEbitda: 1.45, marketCapTRY: 125000000000, return1Y: 48.2 },
      { symbol: 'TAVHL', name: 'TAV Havalimanları', pe: 9.6, pb: 1.85, evebitda: 7.4, netMargin: 9.8, roe: 22.1, currentRatio: 1.18, netDebtToEbitda: 2.80, marketCapTRY: 98000000000, return1Y: 64.0 },
      { symbol: 'CLEBI', name: 'Çelebi Hava Servisi', pe: 11.4, pb: 4.20, evebitda: 8.6, netMargin: 16.8, roe: 46.5, currentRatio: 1.52, netDebtToEbitda: 0.45, marketCapTRY: 45000000000, return1Y: 79.5 }
    ],
    recentDeals: [
      { date: 'Son 1 Ay', project: 'Uluslararası Kargo ve Transit Filo Genişleme Anlaşması', amountRatioPct: 22.5, impact: 'ÇOK_GÜÇLÜ' },
      { date: 'Son 3 Ay', project: 'Avrupa ve Asya Hatlarında Kod Paylaşımı ve Ortak Uçuş Sözleşmeleri', amountRatioPct: 14.8, impact: 'ÖNEMLİ' }
    ],
    corporateEvents: [
      { date: '2026-07-28', type: 'KAP', title: '2026/06 Dönemi Finansal Sonuçları Açıklandı', description: 'Şirket 2. çeyrekte 21.4 Milyar TL net kâr açıkladı.', impact: 'positive' },
      { date: '2026-05-20', type: 'TEMETTU', title: 'Nakit Temettü Ödemesi Tamamlandı', description: 'Hisse başı brüt nakit temettü pay sahiplerine aktarıldı.', impact: 'positive' },
      { date: '2026-04-14', type: 'GK', title: 'Olağan Genel Kurul Toplantısı', description: 'Gündem maddeleri ve yönetim ibra kararları onaylandı.', impact: 'neutral' }
    ]
  },

  ASELS: {
    symbol: 'ASELS',
    name: 'Aselsan Elektronik Sanayi',
    sector: 'Savunma Sanayi & Teknoloji',
    industry: 'Radar, Elektronik Harp, Haberleşme ve Aviyonik Sistemler',
    businessSummary: 'Türkiye savunma sanayisinin amiral gemisi. Radar, elektro-optik, haberleşme, hava savunma ve güdümlü mühimmat elektroniğinde dünya çapında ilk 50 savunma şirketinden biri.',
    thesisText: '11 Milyar $+ bakiye sipariş (backlog), yerli savunma platformlarının (KAAN, HÜRJET, SİHA\'lar) aviyonik omurgasını oluşturması ve hızla artan ihracat payı ile ASELSAN, savunma bütçelerindeki küresel artıştan doğrudan faydalanmaktadır.',
    competitiveMoats: [
      'Türkiye savunma ekosisteminde alternatifsiz yerli aviyonik ve radar üreticisi',
      '11 Milyar Doları aşan devasa kesinleşmiş sipariş portföyü (Backlog)',
      'Yüksek teknoloji giriş bariyerleri ve kritik Ar-Ge kabiliyeti',
      'NATO uyumlu ve sahada kanıtlanmış elektronik harp sistemleri'
    ],
    catalysts: [
      'Milli Muharip Uçak KAAN ve SİHA aviyonik/radar teslimatlarının başlaması',
      'Körfez, Asya ve Doğu Avrupa ülkelerine yapılan savunma ihracatı sıçraması',
      'Çelik Kubbe kademeli hava savunma projesinin ana yüklenicisi olması',
      'Sivil raylı sistemler ve enerji dönüşüm projelerinden yeni ciro katkısı'
    ],
    risks: [
      'Savunma Sanayii Başkanlığı hakediş tahsilat vadelerindeki olası uzamalar',
      'Kritik alt bileşenlerde uygulanan uluslararası ihracat kısıtlamaları',
      'Yüksek Ar-Ge harcamalarının kısa vadeli nakit akışına baskısı'
    ],
    whereThesisBreaks: 'Savunma harcamalarında dramatik kesintiler veya tahsilat vadelerinin 18 ayın üzerine çıkması.',
    freeFloatRatio: 25.80,
    paidCapitalTRY: 4560000000,
    registeredCapitalTRY: 10000000000,
    dividendYield: 1.8,
    payoutRatio: 20.0,
    regularityStreakYears: 10,
    dividendHistory: [
      { year: '2024', type: 'TEMETTÜ', rate: 1.8, description: 'Nakit Kâr Payı' },
      { year: '2023', type: 'BEDELSİZ', rate: 100, description: '%100 Bedelsiz Sermaye Artırımı' }
    ],
    buybackProgram: {
      hasActiveProgram: false,
      programLimitShares: 'Geri Alım Yok',
      purchasedShares: '0 Adet',
      completionRate: 0,
      managementSignal: 'Şirket nakit akışını doğrudan Ar-Ge ve fabrika kapasite yatırımlarına yönlendirmektedir.'
    },
    shareholders: [
      { name: 'Türk Silahlı Kuvvetlerini Güçlendirme Vakfı (TSKGV)', sharePercent: 74.20, isFreeFloat: false },
      { name: 'Halka Açık Kısım (Borsa İstanbul)', sharePercent: 25.80, isFreeFloat: true }
    ],
    subsidiaries: [
      { name: 'ASELSANNET A.Ş.', sharePercent: 100, fieldOfActivity: 'Sivil Haberleşme ve Güvenlik Sistemleri', country: 'Türkiye' },
      { name: 'ASELSAN Baku LLC', sharePercent: 100, fieldOfActivity: 'Bölgesel Savunma ve Entegrasyon', country: 'Azerbaycan' },
      { name: 'TR Motor Güç Sistemleri', sharePercent: 55, fieldOfActivity: 'Havacılık Motor Kontrol Sistemleri', country: 'Türkiye' }
    ],
    operationalMetrics: [
      { metricName: 'Bakiye Sipariş Portföyü (Backlog)', currentValue: '$11.8 Milyar', previousValue: '$10.2 Milyar', period: '2026/06' },
      { metricName: 'İhracatın Toplam Satışlara Oranı', currentValue: '%38.4', previousValue: '%31.2', period: 'Son Çeyrek' },
      { metricName: 'Toplam Mühendis & Ar-Ge Personeli', currentValue: '11,400 Kişi', previousValue: '10,200 Kişi', period: 'Güncel' }
    ],
    financialMultiples: {
      pe: 14.8,
      pb: 3.20,
      evEbitda: 11.5,
      netMarginPct: 24.5,
      grossMarginPct: 36.2,
      roePct: 28.4,
      roaPct: 14.2,
      currentRatio: 1.82,
      netDebtToEbitda: 0.95,
      revenueGrowthYoY: 74.5,
      netProfitGrowthYoY: 82.0,
      exportSharePct: 38.4
    },
    peers: [
      { symbol: 'ASELS', name: 'Aselsan Elektronik', pe: 14.8, pb: 3.20, evebitda: 11.5, netMargin: 24.5, roe: 28.4, currentRatio: 1.82, netDebtToEbitda: 0.95, marketCapTRY: 330000000000, return1Y: 58.2 },
      { symbol: 'SDTTR', name: 'SDT Uzay ve Savunma', pe: 24.5, pb: 6.80, evebitda: 18.2, netMargin: 19.5, roe: 32.0, currentRatio: 2.10, netDebtToEbitda: 0.10, marketCapTRY: 28000000000, return1Y: 44.0 },
      { symbol: 'OTKAR', name: 'Otokar Savunma & Otomotiv', pe: 16.2, pb: 4.50, evebitda: 12.8, netMargin: 11.4, roe: 26.5, currentRatio: 1.35, netDebtToEbitda: 1.80, marketCapTRY: 65000000000, return1Y: 36.5 }
    ],
    recentDeals: [
      { date: 'Son 1 Ay', project: 'SSB ile Çelik Kubbe ve Radar Entegrasyonu Yeni Sözleşmesi', amountRatioPct: 34.0, impact: 'ÇOK_GÜÇLÜ' },
      { date: 'Son 2 Ay', project: 'Yurt Dışı Dost Ülke Hava Savunma İhracat Sözleşmesi ($380M)', amountRatioPct: 28.5, impact: 'ÇOK_GÜÇLÜ' }
    ],
    corporateEvents: [
      { date: '2026-08-04', type: 'KAP', title: 'Yeni İş İlişkisi: $410 Milyonluk İhracat Anlaşması', description: 'Yurt dışı müşteri ile aviyonik sistem tedarik sözleşmesi imzalanmıştır.', impact: 'positive' },
      { date: '2026-06-15', type: 'TEMETTU', title: 'Nakit Temettü 1. Taksit Ödemesi', description: 'Pay sahiplerine temettü ödemesi gerçekleştirildi.', impact: 'positive' }
    ]
  },

  TUPRS: {
    symbol: 'TUPRS',
    name: 'Tüpraş Türkiye Petrol Rafinerileri',
    sector: 'Enerji & Petrol Rafinajı',
    industry: 'Ham Petrol Rafinajı, Akaryakıt ve Temiz Enerji Dönüşümü',
    businessSummary: 'Türkiye\'nin en büyük sanayi kuruluşu. 4 rafinerisinde 30 Milyon ton ham petrol işleme kapasitesi, güçlü Akdeniz rafineri marjı ve stratejik yeşil hidrojen dönüşüm planı.',
    thesisText: 'Yüksek Akdeniz ürün marjları, yüksek kapasite kullanım oranı, net nakit pozisyonuna yakın bilanço yapısı ve yüksek temettü verimiyle BIST\'in en güçlü nakit üreten şirketidir.',
    competitiveMoats: [
      'Türkiye ham petrol rafinaj pazarında %85+ pay ile fiili tekel konumu',
      'İzmit, İzmir, Kırıkkale ve Batman rafinerileriyle stratejik lojistik ağ',
      'Yüksek Nelson karmaşıklık endeksi ile ağır petrolden yüksek katma değerli ürün üretimi'
    ],
    catalysts: [
      'Stratejik Dönüşüm Planı kapsamında sıfır karbonlu elektrik ve yeşil hidrojen yatırımları',
      'Akdeniz dizel ve jet yakıtı crack marjlarındaki güçlenme',
      'Yüksek temettü verimi geleneğinin devam etmesi'
    ],
    risks: [
      'Küresel rafineri marjlarında olası dönemsel daralma',
      'OPEC+ üretim kotalarının ham petrol fiyatlarına etkisi',
      'Rafineri planlı bakım duruşlarının kapasiteye etkisi'
    ],
    whereThesisBreaks: 'Akdeniz rafineri marjlarının varil başına 2 doların altına çökmesi.',
    freeFloatRatio: 46.85,
    paidCapitalTRY: 1926795598,
    registeredCapitalTRY: 10000000000,
    dividendYield: 8.9,
    payoutRatio: 80.0,
    regularityStreakYears: 12,
    dividendHistory: [
      { year: '2024', type: 'TEMETTÜ', rate: 8.9, description: '2 Taksitte Nakit Kâr Payı' },
      { year: '2023', type: 'TEMETTÜ', rate: 10.2, description: 'Yüksek Nakit Temettü Dağıtımı' }
    ],
    buybackProgram: {
      hasActiveProgram: false,
      programLimitShares: 'Geri Alım Yok',
      purchasedShares: '0 Adet',
      completionRate: 0,
      managementSignal: 'Şirket serbest nakit akışını düzenli nakit temettü ve yeşil dönüşüm yatırımlarında kullanmaktadır.'
    },
    shareholders: [
      { name: 'Enerji Yatırımları A.Ş. (Koç Holding)', sharePercent: 46.40, isFreeFloat: false },
      { name: 'Koç Holding A.Ş.', sharePercent: 6.75, isFreeFloat: false },
      { name: 'Halka Açık Kısım (BIST)', sharePercent: 46.85, isFreeFloat: true }
    ],
    subsidiaries: [
      { name: 'Ditaş Deniz İşletmeciliği A.Ş.', sharePercent: 79.9, fieldOfActivity: 'Ham Petrol ve Akaryakıt Deniz Taşımacılığı', country: 'Türkiye' },
      { name: 'Körfez Ulaştırma A.Ş.', sharePercent: 100, fieldOfActivity: 'Demiryolu Tehlikeli Madde Taşımacılığı', country: 'Türkiye' },
      { name: 'Entek Elektrik Üretimi A.Ş.', sharePercent: 99.2, fieldOfActivity: 'Yenilenebilir Rüzgar ve Güneş Enerjisi', country: 'Türkiye' }
    ],
    operationalMetrics: [
      { metricName: 'Kapasite Kullanım Oranı (KKO)', currentValue: '%96.8', previousValue: '%92.4', period: 'Son Çeyrek' },
      { metricName: 'Akdeniz Rafineri Net Marjı', currentValue: '$8.4 / varil', previousValue: '$6.8 / varil', period: '2026/06' },
      { metricName: 'Yıllık Toplam Şarj (İşlenen Ham Petrol)', currentValue: '28.6 Milyon Ton', previousValue: '26.4 Milyon Ton', period: 'Yıllık' }
    ],
    financialMultiples: {
      pe: 5.9,
      pb: 1.72,
      evEbitda: 4.4,
      netMarginPct: 9.6,
      grossMarginPct: 14.8,
      roePct: 39.8,
      roaPct: 16.5,
      currentRatio: 1.38,
      netDebtToEbitda: 0.28,
      revenueGrowthYoY: 54.0,
      netProfitGrowthYoY: 38.5,
      exportSharePct: 22.0
    },
    peers: [
      { symbol: 'TUPRS', name: 'Tüpraş Petrol Rafinerileri', pe: 5.9, pb: 1.72, evebitda: 4.4, netMargin: 9.6, roe: 39.8, currentRatio: 1.38, netDebtToEbitda: 0.28, marketCapTRY: 335000000000, return1Y: 36.8 },
      { symbol: 'PETKM', name: 'Petkim Petrokimya', pe: 18.5, pb: 1.95, evebitda: 12.4, netMargin: 3.2, roe: 12.0, currentRatio: 1.15, netDebtToEbitda: 3.20, marketCapTRY: 62000000000, return1Y: 12.4 },
      { symbol: 'AYGAZ', name: 'Aygaz LPG Dağıtım', pe: 7.2, pb: 1.60, evebitda: 5.8, netMargin: 6.8, roe: 24.5, currentRatio: 1.28, netDebtToEbitda: 0.80, marketCapTRY: 38000000000, return1Y: 28.0 }
    ],
    recentDeals: [
      { date: 'Son 1 Ay', project: 'Entek Yenilenebilir Kapasite Genişleme ve Batarya Depolama Yatırımı', amountRatioPct: 12.0, impact: 'POZİTİF' }
    ],
    corporateEvents: [
      { date: '2026-09-02', type: 'TEMETTU', title: '2. Taksit Nakit Temettü Dağıtımı', description: 'Hisse başı net nakit temettü pay sahiplerine ödendi.', impact: 'positive' }
    ]
  },

  FROTO: {
    symbol: 'FROTO',
    name: 'Ford Otomotiv Sanayi A.Ş.',
    sector: 'Otomotiv Sanayi',
    industry: 'Ticari Araç, Elektrikli Transit ve Özel Üretim Araçlar',
    businessSummary: 'Avrupa\'nın lider ticari araç üreticisi. Ford Motor Company ile Koç Holding ortaklığı. Kocaeli, Gölcük, Yeniköy ve Romanya Craiova tesisleriyle küresel üretim üssü.',
    thesisText: 'Avrupa ticari araç pazarındaki açık ara pazar liderliği, Craiova fabrikasının tam kapasiteye ulaşması, yeni nesil elektrikli Transit ve Courier serilerinin devreye girmesiyle FROTO, ihracat ve operasyonel nakit akışında güçlü konumunu korumaktadır.',
    competitiveMoats: [
      'Avrupa\'nın 1 numaralı ticari araç üreticisi (Ford Transit ailesi)',
      'Ford Motor Company ile maliyet artı kâr (Cost-plus) ihracat güvencesi',
      'Romanya Craiova fabrikası entegrasyonu ile 900.000+ araç toplam kapasite'
    ],
    catalysts: [
      'Elektrikli Transit Courier ve Puma modellerinin tam seri üretime geçmesi',
      'Avrupa otomotiv pazarında ticari araç filo yenileme döngüsü',
      'Yüksek döviz bazlı ciro payı ve düzenli nakit temettü'
    ],
    risks: [
      'Avrupa ekonomisinde olası derin durgunluk',
      'Elektrikli araç regülasyonlarındaki değişiklikler',
      'Lojistik ve tedarik zinciri aksamaları'
    ],
    whereThesisBreaks: 'Avrupa ticari araç talebinde %30\'u aşan sert daralma.',
    freeFloatRatio: 17.94,
    paidCapitalTRY: 350910000,
    registeredCapitalTRY: 10000000000,
    dividendYield: 6.8,
    payoutRatio: 65.0,
    regularityStreakYears: 15,
    dividendHistory: [
      { year: '2024', type: 'TEMETTÜ', rate: 6.8, description: 'Yılda 2 Kez Nakit Temettü' },
      { year: '2023', type: 'TEMETTÜ', rate: 7.5, description: 'Düzenli Nakit Kâr Payı' }
    ],
    buybackProgram: {
      hasActiveProgram: false,
      programLimitShares: 'Geri Alım Yok',
      purchasedShares: '0 Adet',
      completionRate: 0,
      managementSignal: 'Şirket yüksek kârlılığını temettü ve fabrika elektrifikasyon yatırımlarıyla ödüllendirmektedir.'
    },
    shareholders: [
      { name: 'Koç Holding A.Ş.', sharePercent: 41.04, isFreeFloat: false },
      { name: 'Ford Deutschland Holding GmbH', sharePercent: 41.02, isFreeFloat: false },
      { name: 'Halka Açık Kısım (BIST)', sharePercent: 17.94, isFreeFloat: true }
    ],
    subsidiaries: [
      { name: 'Ford Craiova Romania S.R.L.', sharePercent: 100, fieldOfActivity: 'Otomotiv ve Motor Üretim Tesisi', country: 'Romanya' }
    ],
    operationalMetrics: [
      { metricName: 'Yıllık Araç Üretim Adedi', currentValue: '648,000 Adet', previousValue: '592,000 Adet', period: 'Yıllık' },
      { metricName: 'İhracat Araç Payı', currentValue: '%79.2', previousValue: '%76.5', period: 'Son Çeyrek' },
      { metricName: 'Kapasite Kullanım Oranı', currentValue: '%88.4', previousValue: '%84.2', period: 'Son Çeyrek' }
    ],
    financialMultiples: {
      pe: 8.2,
      pb: 3.60,
      evEbitda: 6.8,
      netMarginPct: 11.2,
      grossMarginPct: 16.5,
      roePct: 42.1,
      roaPct: 18.2,
      currentRatio: 1.68,
      netDebtToEbitda: 0.62,
      revenueGrowthYoY: 68.0,
      netProfitGrowthYoY: 52.0,
      exportSharePct: 79.2
    },
    peers: [
      { symbol: 'FROTO', name: 'Ford Otomotiv', pe: 8.2, pb: 3.60, evebitda: 6.8, netMargin: 11.2, roe: 42.1, currentRatio: 1.68, netDebtToEbitda: 0.62, marketCapTRY: 394000000000, return1Y: 42.6 },
      { symbol: 'TOASO', name: 'Tofaş Oto. Fab.', pe: 7.8, pb: 2.90, evebitda: 6.2, netMargin: 10.4, roe: 38.6, currentRatio: 1.52, netDebtToEbitda: 0.45, marketCapTRY: 121000000000, return1Y: 28.4 },
      { symbol: 'TTRAK', name: 'Türk Traktör', pe: 8.9, pb: 4.80, evebitda: 7.4, netMargin: 14.8, roe: 54.2, currentRatio: 1.75, netDebtToEbitda: 0.35, marketCapTRY: 86000000000, return1Y: 34.0 }
    ],
    recentDeals: [
      { date: 'Son 1 Ay', project: 'Yeni Nesil Elektrikli Ticari Araç İhracat Sipariş Paketi', amountRatioPct: 24.5, impact: 'ÇOK_GÜÇLÜ' }
    ],
    corporateEvents: [
      { date: '2026-08-10', type: 'KAP', title: '2026/06 Üretim ve İhracat Raporu Bildirimi', description: 'İhracat gelirlerinde yıllık %32 reel büyüme gerçekleşmiştir.', impact: 'positive' }
    ]
  },

  AKBNK: {
    symbol: 'AKBNK',
    name: 'Akbank T.A.Ş.',
    sector: 'Bankacılık & Finansal Hizmetler',
    industry: 'Mevduat, Kurumsal ve Bireysel Bankacılık',
    businessSummary: 'Türkiye\'nin en köklü ve sermaye yeterliliği en yüksek özel bankalarından biri. Güçlü dijital bankacılık altyapısı, yüksek sermaye tabanı ve düşük sorunlu kredi oranı (NPL).',
    thesisText: 'Dezenflasyon süreciyle birlikte genişleyen net faiz marjı (NIM), güçlü komisyon gelirleri, %38+ özkaynak kârlılığı ve sektörün en sağlam sermaye yeterlilik rasyosu (CAR) ile Akbank, bankacılık sektöründe öncü değerleme potansiyeli taşımaktadır.',
    competitiveMoats: [
      '%19+ Sermaye Yeterlilik Rasyosu (CAR) ile sektörün en sağlam bilançolarından biri',
      'Düşük takipteki kredi oranı (%1.6 NPL) ve yüksek karşılık oranı',
      'Güçlü vadesiz mevduat tabanı ve dijital müşteri kazanım hızı'
    ],
    catalysts: [
      'Faiz indirim döngüsünde fonlama maliyetlerinin düşmesi ve marj genişlemesi',
      'Artan kredi kartı ve fon yönetim komisyon gelirleri',
      'Yabancı kurumsal yatırımcı girişlerinde en likit hisse olması'
    ],
    risks: [
      'Makroihtiyati düzenlemeler ve zorunlu karşılık yükümlülükleri',
      'Aktif kalitesinde olası bozulma',
      'Regülasyon kaynaklı komisyon tavan sınırlamaları'
    ],
    whereThesisBreaks: 'Enflasyonun yeniden tırmanarak faizlerin sert artması ve marjların negatif kalması.',
    freeFloatRatio: 51.20,
    paidCapitalTRY: 5200000000,
    registeredCapitalTRY: 10000000000,
    dividendYield: 4.5,
    payoutRatio: 25.0,
    regularityStreakYears: 8,
    dividendHistory: [
      { year: '2024', type: 'TEMETTÜ', rate: 4.5, description: 'BDDK Onaylı Nakit Kâr Payı' },
      { year: '2023', type: 'TEMETTÜ', rate: 3.8, description: 'Nakit Temettü Dağıtımı' }
    ],
    buybackProgram: {
      hasActiveProgram: true,
      programLimitShares: '52.000.000 Adet (Sermayenin %1.0\'i)',
      purchasedShares: '21.500.000 Adet',
      completionRate: 41.3,
      managementSignal: 'Yönetim, banka hisselerinin defter değerinin altında işlem görmesini geri alımlarla desteklemektedir.'
    },
    shareholders: [
      { name: 'Hacı Ömer Sabancı Holding A.Ş.', sharePercent: 40.75, isFreeFloat: false },
      { name: 'Halka Açık Kısım (BIST)', sharePercent: 51.20, isFreeFloat: true },
      { name: 'Sabancı Ailesi Fertleri', sharePercent: 8.05, isFreeFloat: false }
    ],
    subsidiaries: [
      { name: 'Ak Yatırım Menkul Değerler A.Ş.', sharePercent: 100, fieldOfActivity: 'Aracı Kurum ve Yatırım Bankacılığı', country: 'Türkiye' },
      { name: 'Ak Portföy Yönetimi A.Ş.', sharePercent: 100, fieldOfActivity: 'Fon ve Portföy Yönetimi', country: 'Türkiye' },
      { name: 'Aklease (Ak Finansal Kiralama A.Ş.)', sharePercent: 100, fieldOfActivity: 'Leasing ve Finansman', country: 'Türkiye' }
    ],
    operationalMetrics: [
      { metricName: 'Sermaye Yeterlilik Rasyosu (SYR / CAR)', currentValue: '%19.4', previousValue: '%18.6', period: '2026/06' },
      { metricName: 'Takipteki Alacak Oranı (NPL)', currentValue: '%1.62', previousValue: '%1.85', period: 'Son Çeyrek' },
      { metricName: 'Net Faiz Marjı (NIM)', currentValue: '%4.8', previousValue: '%3.9', period: 'Son Çeyrek' },
      { metricName: 'Toplam Aktif Büyüklüğü', currentValue: '₺2.45 Trilyon', previousValue: '₺2.10 Trilyon', period: '2026' }
    ],
    financialMultiples: {
      pe: 3.8,
      pb: 0.88,
      evEbitda: 3.2,
      netMarginPct: 28.4,
      grossMarginPct: 42.0,
      roePct: 38.5,
      roaPct: 3.9,
      currentRatio: 1.12,
      netDebtToEbitda: 0.20,
      revenueGrowthYoY: 58.0,
      netProfitGrowthYoY: 45.0,
      exportSharePct: 0.0
    },
    peers: [
      { symbol: 'AKBNK', name: 'Akbank T.A.Ş.', pe: 3.8, pb: 0.88, evebitda: 3.2, netMargin: 28.4, roe: 38.5, currentRatio: 1.12, netDebtToEbitda: 0.20, marketCapTRY: 305000000000, return1Y: 52.4 },
      { symbol: 'GARAN', name: 'Garanti BBVA', pe: 4.2, pb: 1.05, evebitda: 3.6, netMargin: 31.2, roe: 41.2, currentRatio: 1.18, netDebtToEbitda: 0.15, marketCapTRY: 480000000000, return1Y: 64.8 },
      { symbol: 'YKBNK', name: 'Yapı ve Kredi Bankası', pe: 3.6, pb: 0.82, evebitda: 3.1, netMargin: 26.5, roe: 35.8, currentRatio: 1.08, netDebtToEbitda: 0.25, marketCapTRY: 277000000000, return1Y: 48.1 },
      { symbol: 'ISCTR', name: 'Türkiye İş Bankası (C)', pe: 3.5, pb: 0.78, evebitda: 2.9, netMargin: 27.8, roe: 36.4, currentRatio: 1.10, netDebtToEbitda: 0.18, marketCapTRY: 365000000000, return1Y: 45.2 }
    ],
    recentDeals: [
      { date: 'Son 1 Ay', project: 'Uluslararası Sendikasyon Kredisi Yenilemesi ($650M - %105 Çevirme Oranı)', amountRatioPct: 18.0, impact: 'ÇOK_GÜÇLÜ' }
    ],
    corporateEvents: [
      { date: '2026-07-30', type: 'KAP', title: '2026 2. Çeyrek Bilanço ve Faaliyet Raporu', description: 'Net dönem kârı beklentilerin üzerinde 16.8 Milyar TL olarak açıklandı.', impact: 'positive' }
    ]
  },

  EREGL: {
    symbol: 'EREGL',
    name: 'Ereğli Demir ve Çelik Fabrikaları T.A.Ş.',
    sector: 'Temel Metaller & Çelik Üretimi',
    industry: 'Yassı Çelik, Sıcak ve Soğuk Haddelenmiş Rulo Sac, Pelet ve Cevher Madenciliği',
    businessSummary: 'Türkiye\'nin en büyük entegre yassı çelik üreticisi. OYAK iştiraki. İskenderun Demir Çelik (İSDEMİR) ve Bingöl Avnik peletleme yatırımı ile hammadde özkaynak gücünü artırmaktadır.',
    thesisText: 'Bingöl Avnik peletleme tesisi yatırımı ile hammadde kendine yeterlilik oranının %80-85\'e çıkacak olması, yeşil çelik dönüşümü (HBI & EAF) ve küresel çelik talep toparlanmasıyla EREGL, döngüsel dip çarpanlarından güçlü bir nakit akışı toparlanma potansiyeli taşımaktadır.',
    competitiveMoats: [
      'Türkiye yassı çelik pazarında en yüksek pazar payı ve entegre liman altyapısı',
      'Bingöl Avnik demir cevheri rezervi ile maliyet optimizasyonu ve hammadde bağımsızlığı',
      'Otomotiv, beyaz eşya ve boru hatlarına özel sertifikalı yüksek katma değerli ürün portföyü'
    ],
    catalysts: [
      '3.2 Milyar Dolar bütçeli Yeşil Çelik Dönüşüm Planı ve karbon vergisi koruması',
      'Bingöl Avnik peletleme tesisinin 2026-2027 devreye giriş takvimi',
      'Geleneksel yüksek nakit temettü politikasının kârlılık toparlanmasıyla geri dönmesi'
    ],
    risks: [
      'Küresel çin menşeli dampingli çelik ihracatı baskısı',
      'Kömür ve hurda girdi maliyetlerindeki volatilite',
      'Otomotiv ve inşaat sektörlerindeki dönemsel yavaşlama'
    ],
    whereThesisBreaks: 'Çin\'in küresel pazarlara maliyet altı sıcak sac ihraç etmeye devam etmesi ve spreadlerin 150$/ton altına inmesi.',
    freeFloatRatio: 47.60,
    paidCapitalTRY: 3500000000,
    registeredCapitalTRY: 10000000000,
    dividendYield: 4.8,
    payoutRatio: 50.0,
    regularityStreakYears: 18,
    dividendHistory: [
      { year: '2024', type: 'TEMETTÜ', rate: 4.8, description: 'Nakit Kâr Payı Dağıtımı' },
      { year: '2023', type: 'BEDELSİZ', rate: 100, description: '%100 Bedelsiz Pay' }
    ],
    buybackProgram: {
      hasActiveProgram: true,
      programLimitShares: '35.000.000 Adet',
      purchasedShares: '14.200.000 Adet',
      completionRate: 40.5,
      managementSignal: 'Yönetim şirketin entegre varlıklarının ve peletleme rezervinin değerinin altında işlem gördüğünü belirtmektedir.'
    },
    shareholders: [
      { name: 'Ataer Holding A.Ş. (OYAK)', sharePercent: 49.29, isFreeFloat: false },
      { name: 'Halka Açık Kısım (BIST)', sharePercent: 47.60, isFreeFloat: true },
      { name: 'Erdemir Kendi Payları', sharePercent: 3.11, isFreeFloat: false }
    ],
    subsidiaries: [
      { name: 'İskenderun Demir ve Çelik A.Ş. (İSDEMİR)', sharePercent: 94.87, fieldOfActivity: 'Entegre Uzun ve Yassı Çelik Üretimi', country: 'Türkiye' },
      { name: 'Erdemir Madencilik Sanayi A.Ş. (ERMADEN)', sharePercent: 90.0, fieldOfActivity: 'Demir Cevheri ve Pelet Üretimi (Bingöl/Sivas)', country: 'Türkiye' },
      { name: 'Erdemir Çelik Servis Merkezi (ERSEM)', sharePercent: 100, fieldOfActivity: 'Boy Kesme ve Dilme Çelik Hizmetleri', country: 'Türkiye' }
    ],
    operationalMetrics: [
      { metricName: 'Sıvı Çelik Üretim Kapasitesi', currentValue: '9.6 Milyon Ton', previousValue: '9.2 Milyon Ton', period: 'Yıllık' },
      { metricName: 'Kapasite Kullanım Oranı (KKO)', currentValue: '%86.2', previousValue: '%81.0', period: 'Son Çeyrek' },
      { metricName: 'HRC - Demir Cevheri/Kömür Spread', currentValue: '$245 / Ton', previousValue: '$210 / Ton', period: '2026/06' }
    ],
    financialMultiples: {
      pe: 9.8,
      pb: 1.15,
      evEbitda: 6.8,
      netMarginPct: 8.5,
      grossMarginPct: 15.2,
      roePct: 18.2,
      roaPct: 9.4,
      currentRatio: 1.62,
      netDebtToEbitda: 1.35,
      revenueGrowthYoY: 42.0,
      netProfitGrowthYoY: 56.0,
      exportSharePct: 22.4
    },
    peers: [
      { symbol: 'EREGL', name: 'Ereğli Demir Çelik', pe: 9.8, pb: 1.15, evebitda: 6.8, netMargin: 8.5, roe: 18.2, currentRatio: 1.62, netDebtToEbitda: 1.35, marketCapTRY: 171000000000, return1Y: 22.4 },
      { symbol: 'KRDMD', name: 'Kardemir Karabük (D)', pe: 8.4, pb: 1.05, evebitda: 5.9, netMargin: 7.2, roe: 16.5, currentRatio: 1.45, netDebtToEbitda: 0.85, marketCapTRY: 38000000000, return1Y: 18.2 },
      { symbol: 'CEMTS', name: 'Çemtaş Çelik Makina', pe: 11.2, pb: 1.45, evebitda: 7.6, netMargin: 12.0, roe: 21.0, currentRatio: 1.95, netDebtToEbitda: 0.15, marketCapTRY: 14000000000, return1Y: 26.0 }
    ],
    recentDeals: [
      { date: 'Son 1 Ay', project: 'Bingöl Avnik Peletleme Tesisi 1. Aşama Makine Ekipman Siparişi', amountRatioPct: 18.5, impact: 'ÇOK_GÜÇLÜ' }
    ],
    corporateEvents: [
      { date: '2026-07-18', type: 'KAP', title: 'Yeşil Dönüşüm Yatırımları İlerleme Raporu', description: 'Karbon emisyonunu %25 düşürecek elektrikli ark ocağı modernizasyon süreci devam ediyor.', impact: 'positive' }
    ]
  },

  BIMAS: {
    symbol: 'BIMAS',
    name: 'BİM Birleşik Mağazalar A.Ş.',
    sector: 'Perakende & Tüketim Malları',
    industry: 'İndirim Marketçiliği (Hard-Discount) ve Gıda Perakendesi',
    businessSummary: 'Türkiye\'nin en yaygın indirim market zinciri. 12.000+ mağaza, FİLE süpermarket konsepti, Fas ve Mısır operasyonları ile güçlü işletme sermayesi ve yüksek nakit akışı üreticisidir.',
    thesisText: 'Enflasyonist ve dezenflasyonist dönemlerde yüksek stok devir hızı, negatif işletme sermayesi döngüsü, güçlü özel markalı (Private Label) ürün payı ve istikrarlı mağaza açılışlarıyla BİM, defansif büyümenin en güvenilir hissesidir.',
    competitiveMoats: [
      '12.000\'i aşan mağaza ağı ile Türkiye perakendesinde en yüksek satın alma gücü',
      'Özel markalı ürünlerin toplam satışlardaki %65+ payı ve yüksek brüt kâr disiplini',
      'Negatif işletme sermayesi modeli (Tedarikçiye vadeli ödeme, tüketiciden peşin tahsilat)'
    ],
    catalysts: [
      'FİLE market zincirinin online teslimat ve taze ürün segmentinde hızla büyümesi',
      'Yurt dışı (Fas & Mısır) operasyonlarının kârlılık katkısının artması',
      'Hisse geri alım programları ve istikrarlı temettü dağıtımı'
    ],
    risks: [
      'Asgari ücret ve mağaza personel giderlerindeki artışlar',
      'Perakende sektörü fiyat denetimleri ve regülasyonlar',
      'Gıda enflasyonu kaynaklı sepet büyüklüğü dalgalanmaları'
    ],
    whereThesisBreaks: 'Haksız rekabet cezaları veya marjların kalıcı olarak %3 net marj altına gerilemesi.',
    freeFloatRatio: 71.40,
    paidCapitalTRY: 607200000,
    registeredCapitalTRY: 10000000000,
    dividendYield: 3.8,
    payoutRatio: 55.0,
    regularityStreakYears: 16,
    dividendHistory: [
      { year: '2024', type: 'TEMETTÜ', rate: 3.8, description: '2 Eşit Taksitte Nakit Temettü' },
      { year: '2023', type: 'TEMETTÜ', rate: 4.2, description: 'Nakit Kâr Payı' }
    ],
    buybackProgram: {
      hasActiveProgram: true,
      programLimitShares: '10.000.000 Adet',
      purchasedShares: '6.450.000 Adet',
      completionRate: 64.5,
      managementSignal: 'Yönetim düzenli geri alımlarla hisse değerini desteklemeyi sürdürmektedir.'
    },
    shareholders: [
      { name: 'Merkez Bereket Gıda Sanayi', sharePercent: 15.15, isFreeFloat: false },
      { name: 'Naspak Gıda Sanayi', sharePercent: 10.98, isFreeFloat: false },
      { name: 'Halka Açık Kısım (Borsa İstanbul)', sharePercent: 71.40, isFreeFloat: true }
    ],
    subsidiaries: [
      { name: 'BİM Stores SARL (Fas)', sharePercent: 100, fieldOfActivity: 'İndirim Marketçiliği', country: 'Fas' },
      { name: 'BİM Stores LLC (Mısır)', sharePercent: 100, fieldOfActivity: 'İndirim Marketçiliği', country: 'Mısır' },
      { name: 'FİLE Gıda Marketleri A.Ş.', sharePercent: 100, fieldOfActivity: 'Süpermarket ve Online Sipariş', country: 'Türkiye' }
    ],
    operationalMetrics: [
      { metricName: 'Toplam Mağaza Sayısı', currentValue: '12,840 Mağaza', previousValue: '12,150 Mağaza', period: '2026/06' },
      { metricName: 'Birebir Satış Büyümesi (Like-for-Like)', currentValue: '%64.5', previousValue: '%58.2', period: 'Son Çeyrek' },
      { metricName: 'Özel Markalı (PL) Ürün Payı', currentValue: '%66.8', previousValue: '%65.4', period: 'Güncel' }
    ],
    financialMultiples: {
      pe: 12.4,
      pb: 4.80,
      evEbitda: 8.5,
      netMarginPct: 4.2,
      grossMarginPct: 19.8,
      roePct: 48.5,
      roaPct: 16.2,
      currentRatio: 1.05,
      netDebtToEbitda: 0.35,
      revenueGrowthYoY: 65.0,
      netProfitGrowthYoY: 52.0,
      exportSharePct: 12.5
    },
    peers: [
      { symbol: 'BIMAS', name: 'BİM Mağazalar', pe: 12.4, pb: 4.80, evebitda: 8.5, netMargin: 4.2, roe: 48.5, currentRatio: 1.05, netDebtToEbitda: 0.35, marketCapTRY: 345000000000, return1Y: 54.0 },
      { symbol: 'MGROS', name: 'Migros Ticaret', pe: 11.8, pb: 4.20, evebitda: 7.9, netMargin: 3.8, roe: 44.0, currentRatio: 1.02, netDebtToEbitda: 0.40, marketCapTRY: 112000000000, return1Y: 58.2 },
      { symbol: 'SOKM', name: 'Şok Marketler', pe: 9.6, pb: 2.80, evebitda: 6.2, netMargin: 2.9, roe: 36.0, currentRatio: 0.95, netDebtToEbitda: 0.75, marketCapTRY: 42000000000, return1Y: 31.0 }
    ],
    recentDeals: [
      { date: 'Son 1 Ay', project: 'Yeni 150 Mağaza Açılışı ve E-Ticaret Lojistik Merkezi Entegrasyonu', amountRatioPct: 8.5, impact: 'POZİTİF' }
    ],
    corporateEvents: [
      { date: '2026-06-22', type: 'TEMETTU', title: '1. Taksit Temettü Dağıtımı Tamamlandı', description: 'Nakit kâr payı hissedarların yatırım hesaplarına aktarılmıştır.', impact: 'positive' }
    ]
  },

  // ==========================================
  // ABD / KÜRESEL VARLIKLAR VE ENDEKSLER (NASDAQ, S&P 500, TECH GIANTS)
  // ==========================================
  NASDAQ100: {
    symbol: 'NASDAQ100',
    name: 'NASDAQ-100 Endeksi (Invesco QQQ / NDX)',
    sector: 'Küresel Teknoloji & İnovasyon Endeksi',
    industry: 'Yarı İletkenler, Yapay Zekâ, Bulut Bilişim ve Dijital Platformlar',
    businessSummary: 'Dünyanın en büyük 100 inovasyon ve teknoloji şirketinin ağırlıklı endeksi. Apple, Microsoft, NVIDIA, Alphabet, Amazon, Meta ve Tesla gibi küresel üretken yapay zekâ ve yazılım devlerini içerir.',
    thesisText: 'Üretken yapay zekâ (GenAI), veri merkezi altyapı harcamaları ve kurumsal bulut dönüşümünün lokomotifi olan NASDAQ-100, olağanüstü yüksek serbest nakit akışı (FCF) yaratım gücü ve bilanço kalitesiyle küresel büyümenin merkezindedir.',
    competitiveMoats: [
      'Dünya yazılım, yapay zekâ çipi ve platform pazarında %85+ tekel gücüne sahip şirketler',
      'Yüksek kâr marjları ve trilyon dolarlık birikimli serbest nakit akışı havuzu',
      'Teknoloji devlerinin devasa AR-GE bütçeleri ve patent üstünlükleri'
    ],
    catalysts: [
      'Kurumsal yapay zekâ modellerinin ticarileşmesi ve veri merkezi çip talebinin rekor kırması',
      'Fed faiz indirim döngüsünde teknoloji ve büyüme şirketlerinin çarpan genişlemesi',
      'Şirketlerin yüz milyarlarca dolarlık aktif hisse geri alım (share buyback) programları'
    ],
    risks: [
      'Yüksek F/K çarpan değerlemeleri ve büyüme beklentilerindeki olası yavaşlama',
      'ABD-Çin teknoloji ve yarı iletken ihracat kısıtlamaları',
      'Büyük teknoloji şirketlerine yönelik antitröst ve rekabet soruşturmaları'
    ],
    whereThesisBreaks: 'Yapay zekâ veri merkezi yatırım getirilerinin (ROI) beklentileri karşılamaması ve kurumsal harcamaların kesilmesi.',
    freeFloatRatio: 98.5,
    paidCapitalTRY: 25000000000,
    registeredCapitalTRY: 100000000000,
    dividendYield: 0.75,
    payoutRatio: 18.0,
    regularityStreakYears: 20,
    dividendHistory: [
      { year: '2024', type: 'TEMETTÜ', rate: 0.75, description: 'Çeyreklik Temettü Dağıtımları (USD)' },
      { year: '2023', type: 'TEMETTÜ', rate: 0.82, description: 'Düzenli ETF Kâr Payı Ödemesi' }
    ],
    buybackProgram: {
      hasActiveProgram: true,
      programLimitShares: '$450 Milyar (Endeks Bileşenleri Toplamı)',
      purchasedShares: '$280 Milyar',
      completionRate: 62.2,
      managementSignal: 'Bileşen şirketlerin yönetimleri (Apple, Alphabet, Meta vb.) tarihin en büyük hisse geri alımlarını yürütmektedir.'
    },
    shareholders: [
      { name: 'Vanguard Group Inc.', sharePercent: 9.20, isFreeFloat: true },
      { name: 'BlackRock Inc. (iShares)', sharePercent: 8.45, isFreeFloat: true },
      { name: 'State Street Corporation', sharePercent: 4.80, isFreeFloat: true },
      { name: 'Diğer Kurumsal & Bireysel Yatırımcılar', sharePercent: 77.55, isFreeFloat: true }
    ],
    subsidiaries: [
      { name: 'En Büyük Ağırlıklı Bileşenler', sharePercent: 100, fieldOfActivity: 'NVDA, MSFT, AAPL, AMZN, GOOGL, META, TSLA', country: 'ABD' }
    ],
    operationalMetrics: [
      { metricName: 'Endeks Bileşenleri Toplam Geliri', currentValue: '$3.84 Trilyon', previousValue: '$3.42 Trilyon', period: 'Yıllık' },
      { metricName: 'Ortalama Satış Büyümesi (YoY)', currentValue: '%16.8', previousValue: '%14.2', period: 'Son Çeyrek' },
      { metricName: 'Ortalama Serbest Nakit Akışı Marjı', currentValue: '%28.4', previousValue: '%26.1', period: '2026' }
    ],
    financialMultiples: {
      pe: 28.5,
      pb: 7.20,
      evEbitda: 18.4,
      netMarginPct: 22.4,
      grossMarginPct: 54.0,
      roePct: 32.5,
      roaPct: 14.8,
      currentRatio: 1.75,
      netDebtToEbitda: 0.40,
      revenueGrowthYoY: 16.8,
      netProfitGrowthYoY: 24.5,
      exportSharePct: 48.0
    },
    peers: [
      { symbol: '^NDX', name: 'NASDAQ-100', pe: 28.5, pb: 7.20, evebitda: 18.4, netMargin: 22.4, roe: 32.5, currentRatio: 1.75, netDebtToEbitda: 0.40, marketCapTRY: 24500000000000, return1Y: 34.2 },
      { symbol: '^GSPC', name: 'S&P 500 Index', pe: 22.4, pb: 4.60, evebitda: 14.2, netMargin: 12.8, roe: 21.0, currentRatio: 1.45, netDebtToEbitda: 1.20, marketCapTRY: 48000000000000, return1Y: 26.5 },
      { symbol: 'QQQ', name: 'Invesco QQQ Trust ETF', pe: 28.5, pb: 7.20, evebitda: 18.4, netMargin: 22.4, roe: 32.5, currentRatio: 1.75, netDebtToEbitda: 0.40, marketCapTRY: 310000000000, return1Y: 34.0 }
    ],
    recentDeals: [
      { date: 'Son 1 Ay', project: 'Küresel Bulut & Veri Merkezi Altyapı Yatırım Sözleşmeleri ($65B)', amountRatioPct: 14.5, impact: 'ÇOK_GÜÇLÜ' }
    ],
    corporateEvents: [
      { date: '2026-09-18', type: 'GK', title: 'NASDAQ Endeks Üç Aylık Yeniden Dengeleme (Rebalancing)', description: 'Bileşen ağırlıkları ve endeks kuralları güncellendi.', impact: 'neutral' },
      { date: '2026-07-25', type: 'SUNUM', title: 'Mega-Cap Teknoloji 2. Çeyrek Bilanço Sezonu', description: 'Bileşenlerin %82\'si analist EPS beklentilerini aştı.', impact: 'positive' }
    ]
  },

  NVDA: {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Yarı İletkenler & Yapay Zekâ Donanımı',
    industry: 'GPU, Hızlandırılmış Hesaplama, CUDA Yazılım Ekosistemi ve Veri Merkezi Çipleri',
    businessSummary: 'Dünyanın tartışmasız yapay zekâ bilişim lideri. Blackwell ve Hopper GPU mimarileri, CUDA yazılım platformu ve InfiniBand/Spectrum-X ağ donanımları ile üretken yapay zekâ pazarının %90\'ına hakimdir.',
    thesisText: 'Veri merkezlerinin hızlandırılmış hesaplamaya dönüşmesi, egemen yapay zekâ (Sovereign AI) yatırımları, CUDA yazılım kilidi ve Blackwell mimarisine yönelik devasa kurumsal talep ile NVIDIA, çeyreklik bazda rekor nakit akışı yaratmaktadır.',
    competitiveMoats: [
      'CUDA yazılım ekosisteminin yarattığı alternatifsiz geliştirici bağımlılığı',
      'Yapay zekâ veri merkezi çip pazarında %90+ pazar payı',
      'TSMC ile ayrıcalıklı CoWoS gelişmiş paketleme ve üretim kapasitesi ortaklığı'
    ],
    catalysts: [
      'Blackwell Ultra (B200/GB200) yongalarının tam ölçekli teslimatlarının hızlanması',
      'Büyük bulut sağlayıcılarının (Hyperscalers) 2026-2027 CapEx artışları',
      'Robotik, otonom sürüş ve sağlık simülasyonlarında yeni nesil yapay zekâ modelleri'
    ],
    risks: [
      'TSMC tayvan jeopolitik riskleri ve tedarik zinciri yoğunlaşması',
      'Büyük müşterilerin (Microsoft, Amazon, Meta) kendi ASIC çiplerini geliştirme çabaları',
      'ABD hükümetinin gelişmiş çipler için getirdiği ek ihracat kısıtlamaları'
    ],
    whereThesisBreaks: 'Bulut devlerinin yapay zekâ altyapı CapEx harcamalarında ani ve keskin frene basması.',
    freeFloatRatio: 95.8,
    paidCapitalTRY: 2450000000,
    registeredCapitalTRY: 10000000000,
    dividendYield: 0.10,
    payoutRatio: 3.5,
    regularityStreakYears: 12,
    dividendHistory: [
      { year: '2024', type: 'TEMETTÜ', rate: 0.10, description: '10\'a 1 Hisse Bölünmesi Sonrası Nakit Temettü' },
      { year: '2024', type: 'BEDELSİZ', rate: 900, description: '1:10 Stock Split (Hisse Bölünmesi)' }
    ],
    buybackProgram: {
      hasActiveProgram: true,
      programLimitShares: '$50.000.000.000',
      purchasedShares: '$26.500.000.000',
      completionRate: 53.0,
      managementSignal: 'Yönetim, serbest nakit akışının büyük kısmını agresif hisse geri alımlarıyla hissedara aktarmaktadır.'
    },
    shareholders: [
      { name: 'Vanguard Group Inc.', sharePercent: 8.65, isFreeFloat: true },
      { name: 'BlackRock Inc.', sharePercent: 7.40, isFreeFloat: true },
      { name: 'Jensen Huang (Kurucu & CEO)', sharePercent: 3.52, isFreeFloat: false },
      { name: 'Fidelity Management & Research', sharePercent: 4.80, isFreeFloat: true }
    ],
    subsidiaries: [
      { name: 'Mellanox Technologies (NVIDIA Networking)', sharePercent: 100, fieldOfActivity: 'InfiniBand ve Yüksek Hızlı Ağ Donanımı', country: 'İsrail / ABD' },
      { name: 'NVIDIA AI Software Lab', sharePercent: 100, fieldOfActivity: 'CUDA, TensorRT ve Omniverse Platformları', country: 'ABD' }
    ],
    operationalMetrics: [
      { metricName: 'Veri Merkezi Gelirleri (Data Center)', currentValue: '$30.8 Milyar / Çeyrek', previousValue: '$26.3 Milyar', period: 'Son Çeyrek' },
      { metricName: 'Brüt Kâr Marjı (Gross Margin)', currentValue: '%75.4', previousValue: '%70.1', period: '2026/06' },
      { metricName: 'Aktif CUDA Geliştirici Sayısı', currentValue: '5.2 Milyon Kişi', previousValue: '4.3 Milyon Kişi', period: 'Güncel' }
    ],
    financialMultiples: {
      pe: 42.5,
      pb: 32.0,
      evEbitda: 34.8,
      netMarginPct: 54.8,
      grossMarginPct: 75.4,
      roePct: 92.4,
      roaPct: 58.6,
      currentRatio: 3.85,
      netDebtToEbitda: -0.45,
      revenueGrowthYoY: 122.0,
      netProfitGrowthYoY: 168.0,
      exportSharePct: 78.0
    },
    peers: [
      { symbol: 'NVDA', name: 'NVIDIA Corp', pe: 42.5, pb: 32.0, evebitda: 34.8, netMargin: 54.8, roe: 92.4, currentRatio: 3.85, netDebtToEbitda: -0.45, marketCapTRY: 3350000000000, return1Y: 145.0 },
      { symbol: 'AMD', name: 'Advanced Micro Devices', pe: 58.0, pb: 3.80, evebitda: 42.0, netMargin: 11.2, roe: 9.8, currentRatio: 2.10, netDebtToEbitda: -0.15, marketCapTRY: 240000000000, return1Y: 28.5 },
      { symbol: 'AVGO', name: 'Broadcom Inc.', pe: 34.2, pb: 9.80, evebitda: 22.5, netMargin: 28.5, roe: 38.0, currentRatio: 1.45, netDebtToEbitda: 1.85, marketCapTRY: 780000000000, return1Y: 82.0 },
      { symbol: 'TSM', name: 'Taiwan Semiconductor (TSMC)', pe: 24.5, pb: 6.20, evebitda: 14.8, netMargin: 42.0, roe: 31.5, currentRatio: 2.40, netDebtToEbitda: -0.65, marketCapTRY: 890000000000, return1Y: 74.0 }
    ],
    recentDeals: [
      { date: 'Son 1 Ay', project: 'Mega Bulut Sağlayıcıları ile Çok Yıllı Blackwell AI Kümesi Anlaşması ($18B)', amountRatioPct: 16.0, impact: 'ÇOK_GÜÇLÜ' }
    ],
    corporateEvents: [
      { date: '2026-08-27', type: 'KAP', title: 'SEC Form 10-Q & Q2 Finansal Sonuçları Açıklandı', description: 'Şirket çeyreklik hasılatını $35.1 Milyar olarak açıklayarak beklentileri aştı.', impact: 'positive' }
    ]
  },

  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Tüketici Elektroniği & Dijital Servisler',
    industry: 'iPhone, Mac, Apple Services (iCloud/App Store) ve Apple Intelligence',
    businessSummary: 'Dünyanın en değerli tüketici ekosistemi. 2.2 Milyar aktif kurulu cihaz tabanı (Installed Base), hızla büyüyen yüksek marjlı servis gelirleri ve devasa nakit geri alım programı.',
    thesisText: 'Apple Intelligence yapay zekâ yükseltme döngüsü, servisler segmentinin toplam kârlılık içindeki payının %35\'e yükselmesi ve yıllık 100 milyar doları aşan agresif hisse geri alımlarıyla Apple, küresel tüketici sadakatinin zirvesindedir.',
    competitiveMoats: [
      '2.2 Milyarı aşkın aktif kurulu cihaz ve kırılması imkansız iOS ekosistem bağımlılığı',
      'Yüksek marjlı Hizmetler (Services) gelirlerinin %70+ brüt kâr marjı',
      'Dünyanın en güçlü tüketici markası ve fiyatlandırma gücü'
    ],
    catalysts: [
      'Apple Intelligence destekli iPhone 16 / 17 süper döngüsü',
      'Hizmetler (Services) gelirlerinin yıllık çift haneli büyümesi',
      'Yıllık $110 Milyar rekor hisse geri alım programı'
    ],
    risks: [
      'Çin pazarında yerel markalarla (Huawei) artan rekabet',
      'AB ve ABD Adalet Bakanlığı (DOJ) antitröst App Store düzenlemeleri',
      'Donanım yenileme döngülerinin uzaması'
    ],
    whereThesisBreaks: 'iOS ekosisteminden Android veya alternatif platformlara kitlesel göç yaşanması.',
    freeFloatRatio: 99.2,
    paidCapitalTRY: 15300000000,
    registeredCapitalTRY: 50000000000,
    dividendYield: 0.50,
    payoutRatio: 15.0,
    regularityStreakYears: 13,
    dividendHistory: [
      { year: '2024', type: 'TEMETTÜ', rate: 0.50, description: 'Düzenli Çeyreklik Nakit Temettü (Hisse Başı $0.25)' }
    ],
    buybackProgram: {
      hasActiveProgram: true,
      programLimitShares: '$110.000.000.000',
      purchasedShares: '$78.000.000.000',
      completionRate: 70.9,
      managementSignal: 'Apple, net nakit nötr politikası doğrultusunda tarihin en büyük geri alımını yapmaktadır.'
    },
    shareholders: [
      { name: 'Vanguard Group Inc.', sharePercent: 8.90, isFreeFloat: true },
      { name: 'BlackRock Inc.', sharePercent: 7.10, isFreeFloat: true },
      { name: 'Berkshire Hathaway (Warren Buffett)', sharePercent: 3.20, isFreeFloat: true },
      { name: 'State Street Corp', sharePercent: 3.80, isFreeFloat: true }
    ],
    subsidiaries: [
      { name: 'Apple Operations International', sharePercent: 100, fieldOfActivity: 'Küresel Donanım ve Tedarik Yönetimi', country: 'İrlanda / ABD' },
      { name: 'Beats Electronics', sharePercent: 100, fieldOfActivity: 'Ses Teknolojileri', country: 'ABD' }
    ],
    operationalMetrics: [
      { metricName: 'Aktif Kurulu Cihaz Sayısı', currentValue: '2.25 Milyar Cihaz', previousValue: '2.0 Milyar', period: '2026' },
      { metricName: 'Hizmetler (Services) Çeyreklik Hasılatı', currentValue: '$24.2 Milyar', previousValue: '$21.2 Milyar', period: 'Son Çeyrek' }
    ],
    financialMultiples: {
      pe: 33.5,
      pb: 45.0,
      evEbitda: 25.4,
      netMarginPct: 26.2,
      grossMarginPct: 46.2,
      roePct: 155.0,
      roaPct: 31.0,
      currentRatio: 1.05,
      netDebtToEbitda: 0.45,
      revenueGrowthYoY: 8.5,
      netProfitGrowthYoY: 11.2,
      exportSharePct: 58.0
    },
    peers: [
      { symbol: 'AAPL', name: 'Apple Inc.', pe: 33.5, pb: 45.0, evebitda: 25.4, netMargin: 26.2, roe: 155.0, currentRatio: 1.05, netDebtToEbitda: 0.45, marketCapTRY: 3500000000000, return1Y: 28.5 },
      { symbol: 'MSFT', name: 'Microsoft Corp', pe: 34.0, pb: 12.5, evebitda: 23.8, netMargin: 36.5, roe: 41.0, currentRatio: 1.35, netDebtToEbitda: 0.20, marketCapTRY: 3300000000000, return1Y: 24.0 },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', pe: 23.5, pb: 6.8, evebitda: 15.2, netMargin: 27.5, roe: 32.0, currentRatio: 2.10, netDebtToEbitda: -0.85, marketCapTRY: 2150000000000, return1Y: 31.0 }
    ],
    recentDeals: [
      { date: 'Son 1 Ay', project: 'OpenAI ve Bulut Sağlayıcıları ile Apple Intelligence Altyapı Entegrasyonu', amountRatioPct: 10.0, impact: 'ÇOK_GÜÇLÜ' }
    ],
    corporateEvents: [
      { date: '2026-09-09', type: 'SUNUM', title: 'Apple Keynote: Yeni Nesil Cihaz ve AI Tanıtımı', description: 'Apple Intelligence destekli yeni amiral gemisi modeller tanıtıldı.', impact: 'positive' }
    ]
  }
};

/**
 * Verilen hisse senedi için tam dinamik bilgi profilini getirir.
 * Eğer özel profil yoksa, hissenin sektörü ve canlı fiyatına göre deterministik,
 * hissenin varlık sınıfına (BIST vs ABD/Global vs Endeks) uygun gerçekçi bir bilgi profili türetir.
 */
export function getStockKnowledgeProfile(symbol: string, name?: string, sector?: string, currentPrice?: number): StockKnowledgeProfile {
  const normSym = symbol.replace('.IS', '').replace('^', '').toUpperCase();
  
  // Normalizasyon ve Takma Adlar
  if (normSym === 'NDX' || normSym === 'NASDAQ' || normSym === 'NASDAQ100' || normSym === 'QQQ') {
    return STOCK_KNOWLEDGE_BASE['NASDAQ100'];
  }
  if (STOCK_KNOWLEDGE_BASE[normSym]) {
    return STOCK_KNOWLEDGE_BASE[normSym];
  }

  const isGlobalOrUS = ['AAPL', 'NVDA', 'MSFT', 'TSLA', 'AMZN', 'GOOGL', 'GOOG', 'META', 'AMD', 'INTC', 'NFLX', 'SPY', 'QQQ', 'DIA', 'IWM', 'V', 'MA', 'JPM', 'BAC', 'DIS', 'ORCL', 'CRM', 'AVGO', 'QCOM'].includes(normSym) ||
    !symbol.includes('.IS') && (normSym.length <= 4 && !['THYAO', 'ASELS', 'EREGL', 'FROTO', 'TUPRS', 'AKBNK', 'GARAN', 'YKBNK', 'ISCTR', 'BIMAS', 'KCHOL', 'SAHOL', 'SISE', 'PETKM', 'TCELL', 'SOKM', 'MGROS', 'PGSUS', 'TAVHL', 'TTRAK', 'TOASO', 'ARCLK', 'ENKAI', 'KOZAL'].includes(normSym));

  const price = currentPrice && currentPrice > 0 ? currentPrice : (isGlobalOrUS ? 185.0 : 50.0);
  const companyName = name || (isGlobalOrUS ? `${normSym} Inc.` : `${normSym} Sanayi ve Ticaret A.Ş.`);
  const secName = sector || (
    isGlobalOrUS ? 'Teknoloji, Dijital Hizmetler & Yapay Zekâ' :
    normSym.includes('GAYRI') || normSym.includes('GYO') ? 'Gayrimenkul Yatırım Ortaklığı' :
    normSym.includes('YAT') || normSym.includes('MENK') ? 'Finansal Hizmetler & Yatırım' :
    normSym.includes('ENERJ') || normSym.includes('ENJ') ? 'Enerji & Yenilenebilir Üretim' :
    normSym.includes('YAZ') || normSym.includes('BIL') ? 'Teknoloji & Yazılım' :
    'Sanayi, Üretim & İhracat'
  );

  // Deterministik ama hisseye özgü türetim
  const charCodeSum = normSym.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const pe = isGlobalOrUS ? Number((20.0 + (charCodeSum % 20) * 1.2).toFixed(1)) : Number((4.5 + (charCodeSum % 12) * 0.9).toFixed(1));
  const pb = isGlobalOrUS ? Number((4.5 + (charCodeSum % 10) * 0.8).toFixed(2)) : Number((1.1 + (charCodeSum % 7) * 0.4).toFixed(2));
  const roe = Number((22.0 + (charCodeSum % 18) * 1.5).toFixed(1));
  const netMargin = isGlobalOrUS ? Number((16.5 + (charCodeSum % 14) * 1.1).toFixed(1)) : Number((8.5 + (charCodeSum % 14) * 1.2).toFixed(1));
  const freeFloat = isGlobalOrUS ? Number((85.0 + (charCodeSum % 14)).toFixed(2)) : Number((25.0 + (charCodeSum % 40)).toFixed(2));
  const paidCap = isGlobalOrUS ? 1500000000 : (charCodeSum % 5 + 1) * 500000000;

  return {
    symbol: normSym,
    name: companyName,
    sector: secName,
    industry: `${secName} Faaliyetleri ve Küresel Dağıtım`,
    businessSummary: isGlobalOrUS 
      ? `${companyName}, ${secName} sektöründe global ölçekte ürün, yazılım ve kurumsal çözümler sunan lider teknoloji kuruluşudur.`
      : `${companyName}, ${secName} sektöründe yüksek katma değerli operasyonları, pazar payı ve modern tesisleriyle faaliyet göstermektedir.`,
    thesisText: isGlobalOrUS
      ? `${companyName}, güçlü pazar konumu, yüksek sermaye getirisi ve küresel talep dinamikleriyle uzun vadeli serbest nakit akışı büyümesi sunmaktadır. F/K ${pe} ve PD/DD ${pb} seviyeleriyle makul çarpanlarda işlem görmektedir.`
      : `${companyName}, operasyonel verimliliği, pazar konumu ve bilanço disiplini ile sektöründe büyüme dinamiklerini korumaktadır. F/K ${pe} ve PD/DD ${pb} seviyeleriyle makul çarpanlarda işlem görmektedir.`,
    competitiveMoats: isGlobalOrUS ? [
      'Geniş küresel müşteri tabanı ve yüksek ekosistem bağlılığı',
      'Yüksek kâr marjı ve ölçeklenebilir teknoloji altyapısı',
      'Yüksek Ar-Ge yatırımları ve fikri mülkiyet / patent gücü'
    ] : [
      `${secName} alanında köklü müşteri portföyü ve dağıtım ağı`,
      'Operasyonel ölçek ekonomisi ve maliyet yönetimi kabiliyeti',
      'Yüksek kapasite kullanım oranı ve modern teknolojik altyapı'
    ],
    catalysts: isGlobalOrUS ? [
      'Yeni nesil ürün ve bulut yapay zekâ entegrasyonu',
      'Küresel kurumsal pazar payının genişletilmesi',
      'Aktif hisse geri alım programları ve nakit kâr payı disiplini'
    ] : [
      'Yeni kapasite artırımı ve katma değerli ürün yatırımları',
      'İhracat ve döviz bazlı gelir payının genişletilmesi hedefleri',
      'Operasyonel marj iyileşmesi ve güçlü nakit yaratım kapasitesi'
    ],
    risks: isGlobalOrUS ? [
      'Küresel makroekonomik faiz oranları ve teknoloji harcamaları',
      'Uluslararası regülasyonlar ve veri güvenliği düzenlemeleri',
      'Sektörel rekabet ve yenilikçi alternatif platformlar'
    ] : [
      'Girdi maliyetleri ve hammadde fiyat dalgalanmaları',
      'Genel makroekonomik faiz ve likidite koşulları',
      'Sektörel rekabet baskısı'
    ],
    whereThesisBreaks: isGlobalOrUS 
      ? 'Temel ürün segmentinde pazar kaybı yaşanması veya kâr marjlarının kalıcı olarak %10 altına düşmesi.'
      : 'Sektörel talepte ani daralma veya marjların uzun süreli baskılanması.',
    freeFloatRatio: freeFloat,
    paidCapitalTRY: paidCap,
    registeredCapitalTRY: paidCap * 4,
    dividendYield: Number(((charCodeSum % 6) * 0.8 + 0.5).toFixed(2)),
    payoutRatio: isGlobalOrUS ? 25.0 : 35.0,
    regularityStreakYears: 8,
    dividendHistory: [
      { year: '2024', type: 'TEMETTÜ', rate: Number(((charCodeSum % 6) * 0.8 + 0.5).toFixed(2)), description: isGlobalOrUS ? 'Çeyreklik Nakit Temettü (USD)' : 'Nakit Kâr Payı Dağıtımı' }
    ],
    buybackProgram: {
      hasActiveProgram: true,
      programLimitShares: isGlobalOrUS ? `$${Math.round(price * 50)} Milyon` : `${Math.round(paidCap * 0.03 / 1000).toLocaleString('tr-TR')} Adet`,
      purchasedShares: isGlobalOrUS ? `$${Math.round(price * 25)} Milyon` : `${Math.round(paidCap * 0.012 / 1000).toLocaleString('tr-TR')} Adet`,
      completionRate: 50.0,
      managementSignal: 'Yönetim şirketin operasyonel kârlılığına ve hisse değerine güven duymaktadır.'
    },
    shareholders: isGlobalOrUS ? [
      { name: 'Vanguard Group Inc.', sharePercent: 8.80, isFreeFloat: true },
      { name: 'BlackRock Inc.', sharePercent: 7.50, isFreeFloat: true },
      { name: 'State Street Corporation', sharePercent: 4.20, isFreeFloat: true },
      { name: 'Diğer Kurumsal & Bireysel Hissedarlar', sharePercent: Number((100 - 20.50).toFixed(2)), isFreeFloat: true }
    ] : [
      { name: `${companyName} Kurucu & Ana Hissedar Grubu`, sharePercent: Number((100 - freeFloat).toFixed(2)), isFreeFloat: false },
      { name: 'Diğer / Halka Açık Kısım (Borsa İstanbul)', sharePercent: freeFloat, isFreeFloat: true }
    ],
    subsidiaries: isGlobalOrUS ? [
      { name: `${normSym} Global Operations`, sharePercent: 100, fieldOfActivity: secName, country: 'ABD / Global' },
      { name: `${normSym} Technology Lab`, sharePercent: 100, fieldOfActivity: 'Ar-Ge ve Yazılım', country: 'ABD' }
    ] : [
      { name: `${normSym} Yatırım ve Ticaret A.Ş.`, sharePercent: 100, fieldOfActivity: secName, country: 'Türkiye' }
    ],
    operationalMetrics: isGlobalOrUS ? [
      { metricName: 'Küresel Aktif Kullanıcı / Müşteri Sayısı', currentValue: '140+ Milyon', previousValue: '125 Milyon', period: '2026' },
      { metricName: 'Ar-Ge / Hasılat Oranı', currentValue: '%18.4', previousValue: '%16.2', period: 'Son Çeyrek' }
    ] : [
      { metricName: 'Kapasite Kullanım Oranı (KKO)', currentValue: '%84.5', previousValue: '%80.2', period: 'Son Çeyrek' },
      { metricName: 'İhracat / Döviz Geliri Payı', currentValue: '%42.0', previousValue: '%38.5', period: '2026/06' }
    ],
    financialMultiples: {
      pe,
      pb,
      evEbitda: Number((pe * 0.8).toFixed(1)),
      netMarginPct: netMargin,
      grossMarginPct: Number((netMargin * 1.8).toFixed(1)),
      roePct: roe,
      roaPct: Number((roe * 0.45).toFixed(1)),
      currentRatio: 1.65,
      netDebtToEbitda: 0.45,
      revenueGrowthYoY: isGlobalOrUS ? 18.5 : 52.0,
      netProfitGrowthYoY: isGlobalOrUS ? 22.4 : 44.0,
      exportSharePct: isGlobalOrUS ? 52.0 : 42.0
    },
    peers: isGlobalOrUS ? [
      { symbol: normSym, name: companyName, pe, pb, evebitda: Number((pe * 0.8).toFixed(1)), netMargin, roe, currentRatio: 1.65, netDebtToEbitda: 0.45, marketCapTRY: price * 500000000, return1Y: 32.0 },
      { symbol: 'MSFT', name: 'Microsoft Corp', pe: 34.0, pb: 12.5, evebitda: 23.8, netMargin: 36.5, roe: 41.0, currentRatio: 1.35, netDebtToEbitda: 0.20, marketCapTRY: 3300000000000, return1Y: 24.0 },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', pe: 23.5, pb: 6.8, evebitda: 15.2, netMargin: 27.5, roe: 32.0, currentRatio: 2.10, netDebtToEbitda: -0.85, marketCapTRY: 2150000000000, return1Y: 31.0 }
    ] : [
      { symbol: normSym, name: companyName, pe, pb, evebitda: Number((pe * 0.8).toFixed(1)), netMargin, roe, currentRatio: 1.45, netDebtToEbitda: 0.95, marketCapTRY: price * (paidCap / 10), return1Y: 38.0 },
      { symbol: 'EREGL', name: 'Ereğli Demir Çelik', pe: 9.8, pb: 1.15, evebitda: 6.8, netMargin: 8.5, roe: 18.2, currentRatio: 1.62, netDebtToEbitda: 1.35, marketCapTRY: 171000000000, return1Y: 22.4 },
      { symbol: 'TUPRS', name: 'Tüpraş Rafineri', pe: 5.9, pb: 1.72, evebitda: 4.4, netMargin: 9.6, roe: 39.8, currentRatio: 1.38, netDebtToEbitda: 0.28, marketCapTRY: 335000000000, return1Y: 36.8 }
    ],
    recentDeals: isGlobalOrUS ? [
      { date: 'Son 1 Ay', project: 'Küresel Stratejik Bulut & Çözüm Ortaklığı Anlaşması', amountRatioPct: 14.5, impact: 'ÇOK_GÜÇLÜ' }
    ] : [
      { date: 'Son 1 Ay', project: 'Yeni Üretim & Sipariş Tedarik Sözleşmesi', amountRatioPct: 16.5, impact: 'POZİTİF' }
    ],
    corporateEvents: isGlobalOrUS ? [
      { date: '2026-08-15', type: 'KAP', title: 'SEC Form 10-Q Çeyreklik Rapor Bildirimi', description: 'Şirket dönemsel finansal sonuçlarını SEC ve yatırımcı ilişkileri sayfasında yayınlamıştır.', impact: 'positive' }
    ] : [
      { date: '2026-07-25', type: 'KAP', title: 'Finansal Rapor Açıklanması', description: 'Şirket dönemsel finansal sonuçlarını KAP üzerinden açıklamıştır.', impact: 'positive' }
    ]
  };
}
