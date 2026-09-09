import { MarketNewsItem } from '../types';

export interface NewsCategoryOption {
  id: string;
  label: string;
  shortLabel: string;
  icon: string;
  badgeColor: string;
}

export const NEWS_CATEGORIES: NewsCategoryOption[] = [
  { id: 'ALL', label: 'Tüm Haberler', shortLabel: 'Tümü', icon: '🌐', badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  { id: 'BIST', label: 'BIST 100 & Türkiye', shortLabel: 'BIST', icon: '🇹🇷', badgeColor: 'bg-red-500/10 text-red-400 border-red-500/30' },
  { id: 'TEFAS', label: 'TEFAS Fonları', shortLabel: 'TEFAS', icon: '🛡️', badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30' },
  { id: 'US_STOCKS', label: 'ABD & NASDAQ', shortLabel: 'ABD', icon: '🇺🇸', badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  { id: 'CRYPTO', label: 'Kripto Para & Web3', shortLabel: 'Kripto', icon: '🪙', badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  { id: 'COMMODITIES', label: 'Altın & Emtialar', shortLabel: 'Altın/Emtia', icon: '🏆', badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
  { id: 'FOREX', label: 'Döviz & Makro', shortLabel: 'Döviz', icon: '💱', badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  { id: 'KAP', label: 'KAP Bildirimleri', shortLabel: 'KAP', icon: '📋', badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
];

export const INITIAL_MARKET_NEWS: MarketNewsItem[] = [
  // BIST & Türkiye
  {
    id: 'news-bist-1',
    title: 'Borsa İstanbul BIST 100 Endeksinde Havacılık ve Sanayi Hisselerinde Güçlü Kurumsal Alımlar',
    summary: 'Yabancı yatırımcı takas oranındaki artış ve rekor yolcu doluluk oranları THYAO ve PGSUS öncülüğünde endeksi yukarı taşıyor.',
    content: 'Borsa İstanbul haftaya güçlü bir risk iştahıyla başladı. Özellikle Türk Hava Yolları ve Pegasus gibi havacılık hisselerine gelen yoğun yabancı kurumsal emirler, BIST 100 endeksinin kritik direnç seviyelerini test etmesini sağladı. Sanayi endeksinde ASELS ve EREGL hisseleri de hacim liderliğini koruyor.',
    category: 'BIST',
    impact: 'bullish',
    impactScore: 88,
    relatedSymbols: ['THYAO', 'PGSUS', 'ASELS', 'EREGL'],
    source: 'Borsa İstanbul / Google Finance',
    time: '2 dk önce',
    isBreaking: true,
    aiKeyTakeaways: [
      'Havacılık sektöründe yaz sezonu doluluk oranları beklentileri aştı',
      'Yabancı takas oranında 3 haftadır aralıksız net para girişi gözleniyor',
      'EMA 50 seviyesi üzerinde hacimli kapanış yükseliş trendini teyit ediyor'
    ]
  },
  {
    id: 'news-bist-2',
    title: 'Aselsan (ASELS) Yeni Savunma Sanayii İhracat Anlaşmasını Kamuyu Aydınlatma Platformuna Bildirdi',
    summary: 'ASELS, toplamda 48.5 milyon dolarlık yeni elektro-optik ve radar sistemleri ihracat sözleşmesi imzaladığını duyurdu.',
    content: 'ASELS tarafından KAP üzerinden yapılan açıklamada, uluslararası bir müşteriyle imzalanan yeni tedarik anlaşmasının teslimatlarının 2026 yılı içerisinde tamamlanacağı belirtildi. Anlaşma şirketin döviz bazlı sipariş bakiye büyüklüğünü (backlog) tarihi rekor seviyelere çıkardı.',
    category: 'BIST',
    impact: 'bullish',
    impactScore: 92,
    relatedSymbols: ['ASELS'],
    source: 'KAP / Kamuyu Aydınlatma Platformu',
    time: '8 dk önce',
    isBreaking: true,
    aiKeyTakeaways: [
      '48.5 Milyon $ döviz girdisi şirketin nakit akışını güçlendiriyor',
      'Sipariş bakiye büyüklüğü gelecek 3 yılın cirosunu güvence altına alıyor',
      'İhracat oranı şirket toplam gelirlerinin %35\'ine yükseldi'
    ]
  },
  {
    id: 'news-bist-3',
    title: 'Bankacılık Sektöründe Net Faiz Marjlarında Toparlanma ve Sermaye Yeterlilik İyileşmesi',
    summary: 'TCMB politika adımları ve TL mevduat payındaki artış AKBNK ve GARAN kârlılık rasyolarını destekliyor.',
    content: 'BIST Banka Endeksi (XBANK) son dönemde regülasyon sadeleşmeleri ve net faiz marjı toparlanmasıyla endeks üstü getiri sergiliyor. Akbank ve Garanti BBVA sermaye yeterlilik oranlarındaki güçlü duruşla öne çıkıyor.',
    category: 'BIST',
    impact: 'bullish',
    impactScore: 78,
    relatedSymbols: ['AKBNK', 'GARAN', 'ISCTR', 'YKBNK'],
    source: 'Bloomberg HT / BDDK Verileri',
    time: '18 dk önce',
    aiKeyTakeaways: [
      'TL mevduat oranı %58 eşiğini aşarak fonlama maliyetini düşürdü',
      'Takipteki kredi oranları (NPL) tarihsel düşük seviyelerde seyrediyor'
    ]
  },

  // TEFAS Fonları
  {
    id: 'news-tefas-1',
    title: 'TEFAS Fonlarında Hisse Yoğun ve Serbest Fonlara Rekor Yatırımcı Girişi: Enflasyon Kalkanı Stratejisi',
    summary: 'MAC, TI2 ve IDH gibi hisse yoğun fonlar %0 stopaj avantajı ve TÜFE üstü getirileriyle fon büyüklüklerini %40 artırdı.',
    content: 'Bireysel tasarruf sahipleri yüksek enflasyon ortamında satınalma güçlerini korumak için TEFAS hisse senedi yoğun fonlarına akın etti. Stopaj muafiyeti (%0 stopaj) ve portföy yöneticilerinin aktif hisse seçimi sayesinde fonların yıllık getirisi resmi TÜFE oranının 20-30 puan üzerinde gerçekleşti.',
    category: 'TEFAS',
    impact: 'bullish',
    impactScore: 94,
    relatedSymbols: ['MAC', 'TI2', 'IDH', 'BUY'],
    source: 'TEFAS / Portföy Yönetim Birliği',
    time: '5 dk önce',
    isBreaking: true,
    aiKeyTakeaways: [
      'Stopaj avantajı (%0 vergi) reel net getiriyi maksimize ediyor',
      'Yatırımcı sayısı TEFAS genelinde 5.2 milyon kişiye ulaştı',
      'Aktif portföy yönetimi endeks üzeri alfa (Alpha) yaratıyor'
    ]
  },
  {
    id: 'news-tefas-2',
    title: 'Kıymetli Maden ve Altın Fonları (GGK, KZL) Portföylerde Güvenli Liman Rezervi Oluşturuyor',
    summary: 'Fiziki altın taşıma riski olmadan, 7/24 likit şekilde altın getirisini yansıtan TEFAS altın fonları talep patlaması yaşıyor.',
    content: 'Gram altın fiyatlarının ons altın ve döviz kuru etkisiyle yükseldiği dönemde, Garanti Portföy Altın Fonu (GGK) ve Kuveyt Türk Altın Fonu (KZL) yatırımcıların enflasyon kalkanı olarak en çok tercih ettiği fonlar arasına girdi.',
    category: 'TEFAS',
    impact: 'bullish',
    impactScore: 86,
    relatedSymbols: ['GGK', 'KZL', 'ALTIN'],
    source: 'TEFAS Bülteni / Finnet',
    time: '24 dk önce',
    aiKeyTakeaways: [
      'Fiziki altına kıyasla alım-satım makas farkı olmadan işlem kolaylığı',
      'Portföy risk katsayısını dengeleyen negatif korelasyon etkisi'
    ]
  },
  {
    id: 'news-tefas-3',
    title: 'Yabancı Teknoloji Fonları (AFT, YAY) NASDAQ Rallisiyle Yıllık Getiride Zirveye Yerleşti',
    summary: 'Yapay zeka ve yarı iletken devlerine yatırım yapan TEFAS yabancı fonları, döviz bazlı çifte getiri sağlıyor.',
    content: 'Ak Portföy Yeni Teknolojiler Fonu (AFT) ve Yapı Kredi Yabancı Teknoloji Fonu (YAY), portföylerindeki NVIDIA, Apple ve Microsoft ağırlığı ile son 1 yılda %80\'in üzerinde getiri sağlayarak TEFAS getiri liderleri arasına girdi.',
    category: 'TEFAS',
    impact: 'bullish',
    impactScore: 90,
    relatedSymbols: ['AFT', 'YAY', 'NVDA', 'AAPL'],
    source: 'TEFAS Veri Terminali',
    time: '35 dk önce',
    aiKeyTakeaways: [
      'Dolar/TL artışı + NASDAQ hisse priminin bileşik getirisi',
      'Yapay zeka altyapı yatırımlarından doğrudan kâr payı'
    ]
  },

  // US STOCKS & GLOBAL TECH
  {
    id: 'news-us-1',
    title: 'NVIDIA (NVDA) Blackwell Ultra AI Çip Mimarisi İçin Büyük Bulut Sağlayıcılarından Dev Siparişler Geldi',
    summary: 'Microsoft, Google ve Amazon veri merkezleri için yeni nesil AI sunucu teslimatlarının kapasitesini 2027 sonuna kadar kilitledi.',
    content: 'NVIDIA CEO\'su Jensen Huang, yapay zeka hızlandırıcılarına olan kurumsal talebin arzın katbekat üzerinde olduğunu açıkladı. Wall Street analistleri NVDA hedef fiyatlarını 160-175$ bandına revize etti.',
    category: 'US_STOCKS',
    impact: 'bullish',
    impactScore: 96,
    relatedSymbols: ['NVDA', 'MSFT', 'GOOGL', 'AMZN'],
    source: 'Reuters / Bloomberg US Tech',
    time: '10 dk önce',
    isBreaking: true,
    aiKeyTakeaways: [
      'Blackwell mimarisi önceki nesle göre 4 kat daha yüksek enerji verimliliği sunuyor',
      'Şirketin brüt kâr marjı %75 seviyesinin üzerinde seyrediyor',
      'Yarı iletken tedarik zincirinde TSMC üretim kapasitesi tam dolu'
    ]
  },
  {
    id: 'news-us-2',
    title: 'Apple (AAPL) Apple Intelligence Yapay Zeka Özellikleriyle iPhone Yükseltme Döngüsünü Hızlandırdı',
    summary: 'Kurumsal kullanıcılar ve Asya pazarında yeni nesil AI entegrasyonlu cihaz satışları beklenenden %14 daha hızlı büyüyor.',
    content: 'Apple\'ın cihaz üstü (on-device) gizlilik odaklı yapay zeka çözümleri kullanıcı sadakatini artırırken servis gelirleri de rekor seviyeye ulaştı.',
    category: 'US_STOCKS',
    impact: 'bullish',
    impactScore: 82,
    relatedSymbols: ['AAPL'],
    source: 'Wall Street Journal',
    time: '30 dk önce',
    aiKeyTakeaways: [
      'Hizmetler ve App Store komisyon gelirleri çeyreklik bazda %12 arttı',
      'Nakit rezervi 160 milyar dolar ile pay geri alımlarını finanse ediyor'
    ]
  },
  {
    id: 'news-us-3',
    title: 'Tesla (TSLA) Robotaksi ve Otonom Sürüş FSD v13 İçin Düzenleyici Onay Süreçlerinde İlerleme Kaydetti',
    summary: 'Otonom filo testlerinin güvenilirlik katsayısı insan sürücü seviyesinin 6 kat üzerine çıktı.',
    content: 'Tesla hisseleri, şirketin otonom sürüş yazılım lisanslama görüşmelerine başladığına dair haberlerle yükselişe geçti.',
    category: 'US_STOCKS',
    impact: 'bullish',
    impactScore: 75,
    relatedSymbols: ['TSLA'],
    source: 'CNBC Markets',
    time: '42 dk önce',
    aiKeyTakeaways: [
      'FSD abonelik gelirleri yinelenen yazılım geliri (SaaS) modeli yaratıyor',
      'Enerji depolama (Megapack) teslimatları %120 büyüdü'
    ]
  },

  // ALTIN & EMTİA
  {
    id: 'news-comm-1',
    title: 'Ons ve Gram Altında Tarihi Rekor: Küresel Merkez Bankası Rezerv Alımları ve Güvenli Liman Talebi',
    summary: 'Ons altın uluslararası piyasalarda güçlü seyrini sürdürürken, Gram Altın 5.470 TL seviyelerinde işlem görüyor.',
    content: 'Dünya Altın Konseyi (WGC) verilerine göre küresel merkez bankaları son 10 yılın en yüksek fiziki altın alımını gerçekleştirdi. Jeopolitik riskler ve faiz indirim beklentileri değerli metallere yönelik talebi diri tutuyor.',
    category: 'COMMODITIES',
    impact: 'bullish',
    impactScore: 91,
    relatedSymbols: ['ALTIN', 'CEYREK', 'XAU/USD', 'GGK'],
    source: 'World Gold Council / ForexLive',
    time: '4 dk önce',
    isBreaking: true,
    aiKeyTakeaways: [
      'Merkez bankaları rezerv çeşitlendirmesinde altına ağırlık veriyor',
      'Gram altın yatırımcısı için enflasyona karşı birincil kalkan fonksiyonu',
      'Gümüş (XAG/USD) endüstriyel güneş paneli talebiyle altını takip ediyor'
    ]
  },
  {
    id: 'news-comm-2',
    title: 'Brent Ham Petrol Fiyatlarında Arz Kısıtlamaları ve Küresel Rafineri Marjları',
    summary: 'OPEC+ üretim kotalarına uyum ve lojistik hatlardaki gerginlikler varil fiyatını 74.80$ bandında tutuyor.',
    content: 'Petrol piyasasında stok verileri ve küresel ekonomik büyüme tahminleri rafineri şirketlerinin (TUPRS) kârlılık marjlarını doğrudan etkiliyor.',
    category: 'COMMODITIES',
    impact: 'neutral',
    impactScore: 55,
    relatedSymbols: ['BRENT', 'TUPRS'],
    source: 'EIA / Platts Energy',
    time: '50 dk önce',
    aiKeyTakeaways: [
      'Rafineri crack marjları dengeli seyrediyor',
      'Küresel talep görünümü Çin sanayi üretimine bağlı'
    ]
  },

  // KRİPTO PARA
  {
    id: 'news-crypto-1',
    title: 'Bitcoin (BTC) Spot ETF Fonlarına Kurumsal Girişler Yeniden Hızlandı: Kurumsal Hazine Rezervleri Büyüyor',
    summary: 'BlackRock ve Fidelity ETF\'lerine günlük net 420 milyon dolarlık giriş kaydedilirken BTC 94.000$ üzerinde konsolide oluyor.',
    content: 'Kripto para piyasalarında kurumsal benimseme artarken, halka açık şirketlerin bilançolarına Bitcoin ekleme trendi ivme kazandı. Ethereum ve Solana ağ aktivitesinde de rekor işlem hacimleri gözleniyor.',
    category: 'CRYPTO',
    impact: 'bullish',
    impactScore: 89,
    relatedSymbols: ['BTC', 'ETH', 'SOL'],
    source: 'CoinDesk / Cointelegraph',
    time: '12 dk önce',
    isBreaking: true,
    aiKeyTakeaways: [
      'Borsalardaki likit BTC arzı son 5 yılın en düşük seviyesinde',
      'Kurumsal saklama (Custody) varlıkları rekor kırdı'
    ]
  },
  {
    id: 'news-crypto-2',
    title: 'Solana (SOL) ve Ethereum (ETH) Katman-1 Ekosistemlerinde Günlük Aktif Cüzdan Sayısı Yeni Zirve Yaptı',
    summary: 'DeFi likiditesi ve mikro ödeme altyapılarında işlem ücreti optimizasyonları zincir üstü aktiviteyi katladı.',
    content: 'Merkeziyetsiz finans (DeFi) protokollerine kilitlenen toplam değer (TVL) son bir ayda %22 artış gösterdi.',
    category: 'CRYPTO',
    impact: 'bullish',
    impactScore: 84,
    relatedSymbols: ['SOL', 'ETH', 'AVAX'],
    source: 'DeFiLlama / On-Chain Tracker',
    time: '55 dk önce',
    aiKeyTakeaways: [
      'Kilitli Toplam Değer (TVL) güçlü büyüme trendinde',
      'Katman-2 ölçekleme çözümleri gaz ücretlerini %90 düşürdü'
    ]
  },

  // DÖVİZ & MAKRO
  {
    id: 'news-forex-1',
    title: 'TCMB Brüt Rezervlerinde Artış ve Cari Denge Dinamiklerinde İyileşme',
    summary: 'Dolar/TL 36.45 ve Euro/TL 38.10 seviyelerinde kontrollü bantta seyrederken Merkez Bankası net rezervleri güçleniyor.',
    content: 'Türkiye Cumhuriyet Merkez Bankası haftalık bültenine göre swap hariç net rezervler pozitif bölgedeki seyrini koruyor. İhracatçı reeskont kredileri ve turizm gelirleri döviz piyasasında istikrarı destekliyor.',
    category: 'FOREX',
    impact: 'neutral',
    impactScore: 68,
    relatedSymbols: ['USD/TRY', 'EUR/TRY'],
    source: 'TCMB EVDS / Hazine ve Maliye Bakanlığı',
    time: '15 dk önce',
    aiKeyTakeaways: [
      'CDS Türkiye risk primi 260 baz puan civarında dengeli',
      'Döviz kurlarında volatilite tarihsel en düşük seviyelere geriledi'
    ]
  },
  {
    id: 'news-forex-2',
    title: 'ABD Merkez Bankası (Fed) Faiz Patikası ve Dolar Endeksi (DXY) Seyri',
    summary: 'Enflasyon verilerinin hedeflere yakınsamasıyla küresel faiz indirim beklentileri küresel piyasalarda risk iştahını artırıyor.',
    content: 'Fed FOMC tutanakları, ekonomik büyümenin ılımlı seyrettiğini ve faiz indirim döngüsünün kademeli devam edeceğini işaret ediyor.',
    category: 'FOREX',
    impact: 'bullish',
    impactScore: 76,
    relatedSymbols: ['USD/TRY', 'XAU/USD'],
    source: 'Federal Reserve / FRED',
    time: '1 saat önce',
    aiKeyTakeaways: [
      'DXY endeksindeki gevşeme gelişmekte olan piyasalara para girişini artırıyor',
      'Küresel tahvil faizlerinde gerileme hisse senedi değerlemelerini destekliyor'
    ]
  },

  // KAP BİLDİRİMLERİ
  {
    id: 'news-kap-1',
    title: 'Türk Hava Yolları (THYAO) Filo Genişleme Planı ve Yeni Hat Açılışlarını KAP\'a Duyurdu',
    summary: 'THYAO, 2026 yılı hedefleri doğrultusunda 14 yeni geniş gövdeli uçak teslimatı ve Uzak Doğu frekans artışlarını açıkladı.',
    content: 'Kamuyu Aydınlatma Platformuna yapılan özel durum açıklamasında, artan transit yolcu talebini karşılamak üzere filo büyüklüğünün 490 uçağa ulaştığı ve kargo taşımacılığı gelirlerinin %24 büyüdüğü kaydedildi.',
    category: 'KAP',
    impact: 'bullish',
    impactScore: 91,
    relatedSymbols: ['THYAO'],
    source: 'KAP Özel Durum Açıklaması',
    time: '6 dk önce',
    isBreaking: true,
    aiKeyTakeaways: [
      'Kargo ve transit yolcu gelirleri kârlılık marjını destekliyor',
      'Yolcu doluluk oranı %84.2 ile sektör ortalamasının 6 puan üzerinde'
    ]
  },
  {
    id: 'news-kap-2',
    title: 'Ereğli Demir Çelik (EREGL) Güneş Enerjisi (GES) ve Yeşil Çelik Yatırım Teşvik Belgesi Aldı',
    summary: 'EREGL, karbon nötr çelik üretimi için planladığı 3.2 milyar TL\'lik yatırım projesine devlet teşvik onayı aldı.',
    content: 'KAP açıklamasında söz konusu yenilenebilir enerji santralinin tamamlanmasıyla şirketin elektrik giderlerinde yıllık %30 tasarruf sağlanacağı ve AB Sınırda Karbon Düzenlemesi avantajı elde edileceği bildirildi.',
    category: 'KAP',
    impact: 'bullish',
    impactScore: 85,
    relatedSymbols: ['EREGL'],
    source: 'KAP / Sanayi ve Teknoloji Bakanlığı',
    time: '28 dk önce',
    aiKeyTakeaways: [
      'Yıllık enerji maliyetlerinde %30 tasarruf ile FAVÖK marjı artacak',
      'Avrupa pazarında karbon vergisi muafiyeti rekabet gücünü artırıyor'
    ]
  },
  {
    id: 'news-kap-3',
    title: 'Tüpraş (TUPRS) Stratejik Dönüşüm ve Sıfır Karbon Elektrik Üretim Kapasitesini Artırıyor',
    summary: 'TUPRS, Entek Elektrik iştiraki üzerinden 150 MW kurulu gücünde yeni rüzgar ve depolamalı güneş santrali yatırımını duyurdu.',
    content: 'Tüpraş\'ın KAP\'a gönderdiği faaliyet raporunda, katma değerli yeşil hidrojen ve biyoyakıt yatırımlarının planlanan takvimden 6 ay önce devreye alınacağı belirtildi.',
    category: 'KAP',
    impact: 'bullish',
    impactScore: 87,
    relatedSymbols: ['TUPRS'],
    source: 'KAP Faaliyet Raporu Bildirimi',
    time: '40 dk önce',
    aiKeyTakeaways: [
      'Geleneksel rafineri gelirlerine ek sürdürülebilir temiz enerji nakit akışı',
      'Temettü dağıtım potansiyeli yüksek kalmaya devam ediyor'
    ]
  }
];

// Live Breaking Stream Feed Generator pool for continuous streaming
export const STREAMING_HEADLINES_POOL = [
  {
    title: 'KAP: THYAO yolcu doluluk oranında yeni rekor kırdı, transit uçuş gelirleri %22 arttı.',
    category: 'BIST',
    impact: 'bullish' as const,
    symbols: ['THYAO'],
    source: 'KAP Bildirimi'
  },
  {
    title: 'TEFAS Fonlarında Hisse ve Altın fonlarına bugün net 1.8 Milyar ₺ taze nakit girişi oldu.',
    category: 'TEFAS',
    impact: 'bullish' as const,
    symbols: ['MAC', 'TI2', 'GGK'],
    source: 'TEFAS Canlı Veri'
  },
  {
    title: 'NVIDIA yeni nesil Blackwell AI süper bilgisayar teslimatlarının başladığını duyurdu.',
    category: 'US_STOCKS',
    impact: 'bullish' as const,
    symbols: ['NVDA', 'AFT'],
    source: 'Reuters Global Tech'
  },
  {
    title: 'Gram Altın 5.475 ₺ seviyesine ulaşarak güvenli liman talebini teyit etti.',
    category: 'COMMODITIES',
    impact: 'bullish' as const,
    symbols: ['ALTIN', 'GGK'],
    source: 'Piyasa Verileri'
  },
  {
    title: 'ASELS yurt dışı elektro-optik tedarik ihalesini kazandı, teslimatlar 2026\'da başlıyor.',
    category: 'BIST',
    impact: 'bullish' as const,
    symbols: ['ASELS'],
    source: 'Savunma Sanayii / KAP'
  },
  {
    title: 'Bitcoin ETF\'lerine günlük net 510 Milyon $ giriş ile kurumsal talep ivmelendi.',
    category: 'CRYPTO',
    impact: 'bullish' as const,
    symbols: ['BTC'],
    source: 'Bloomberg Crypto'
  },
  {
    title: 'TCMB haftalık rezerv verisinde swap hariç net rezervler 3.1 Milyar $ arttı.',
    category: 'FOREX',
    impact: 'neutral' as const,
    symbols: ['USD/TRY'],
    source: 'TCMB EVDS'
  },
  {
    title: 'EREGL GES teşvik belgesiyle elektrik maliyetlerini yıllık %30 düşürecek.',
    category: 'BIST',
    impact: 'bullish' as const,
    symbols: ['EREGL'],
    source: 'KAP Haber'
  },
  {
    title: 'Apple Intelligence küresel lansmanı sonrasında servis gelirlerinde %16 büyüme öngörülüyor.',
    category: 'US_STOCKS',
    impact: 'bullish' as const,
    symbols: ['AAPL', 'YAY'],
    source: 'Wall Street Journal'
  },
  {
    title: 'KAP: TUPRS Entek üzerinden 150 MW depolamalı GES yatırımını başlattı.',
    category: 'KAP',
    impact: 'bullish' as const,
    symbols: ['TUPRS'],
    source: 'KAP Özel Durum'
  }
];
