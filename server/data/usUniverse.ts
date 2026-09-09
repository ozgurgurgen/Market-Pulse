export interface StockDefinition {
  symbol: string;
  name: string;
  exchange: string;
  category: 'US_STOCKS';
  currency: '$';
  yahooTicker: string;
  sector: string;
  basePrice: number;
}

// ABD S&P 500 & NASDAQ 100 En Büyük 500+ Şirket Listesi
export const US_500_STOCKS: StockDefinition[] = [
  {
    "symbol": "NVDA",
    "name": "NVIDIA Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "NVDA",
    "sector": "Yarı İletken & AI Hızlandırıcılar",
    "basePrice": 142.5
  },
  {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "AAPL",
    "sector": "Tüketici Elektroniği & Ekosistem",
    "basePrice": 242
  },
  {
    "symbol": "MSFT",
    "name": "Microsoft Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "MSFT",
    "sector": "Bulut & Kurumsal Yazılım / AI",
    "basePrice": 448
  },
  {
    "symbol": "AMZN",
    "name": "Amazon.com Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "AMZN",
    "sector": "E-Ticaret & AWS Bulut Bilişim",
    "basePrice": 214
  },
  {
    "symbol": "GOOGL",
    "name": "Alphabet Inc. (Class A)",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "GOOGL",
    "sector": "Arama, Dijital Reklam & AI",
    "basePrice": 188
  },
  {
    "symbol": "GOOG",
    "name": "Alphabet Inc. (Class C)",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "GOOG",
    "sector": "Arama, Dijital Reklam & AI",
    "basePrice": 189.5
  },
  {
    "symbol": "META",
    "name": "Meta Platforms Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "META",
    "sector": "Sosyal Medya & Yapay Zeka",
    "basePrice": 594
  },
  {
    "symbol": "TSLA",
    "name": "Tesla Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "TSLA",
    "sector": "Elektrikli Araç & Otonom Sürüş",
    "basePrice": 345
  },
  {
    "symbol": "BRK-B",
    "name": "Berkshire Hathaway Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "BRK-B",
    "sector": "Finansal Holding & Sigorta",
    "basePrice": 472
  },
  {
    "symbol": "LLY",
    "name": "Eli Lilly and Company",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "LLY",
    "sector": "İlaç & Biyoteknoloji / GLP-1",
    "basePrice": 785
  },
  {
    "symbol": "AVGO",
    "name": "Broadcom Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "AVGO",
    "sector": "Özel AI Çipleri & Ağ Donanımı",
    "basePrice": 168
  },
  {
    "symbol": "JPM",
    "name": "JPMorgan Chase & Co.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "JPM",
    "sector": "Yatırım & Ticari Bankacılık",
    "basePrice": 248
  },
  {
    "symbol": "V",
    "name": "Visa Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "V",
    "sector": "Küresel Dijital Ödeme Ağı",
    "basePrice": 315
  },
  {
    "symbol": "UNH",
    "name": "UnitedHealth Group Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "UNH",
    "sector": "Sağlık Sigortası & Hizmetleri",
    "basePrice": 595
  },
  {
    "symbol": "XOM",
    "name": "Exxon Mobil Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "XOM",
    "sector": "Entegre Petrol & Doğalgaz",
    "basePrice": 118
  },
  {
    "symbol": "MA",
    "name": "Mastercard Incorporated",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "MA",
    "sector": "Ödeme Sistemleri & Fintek",
    "basePrice": 525
  },
  {
    "symbol": "COST",
    "name": "Costco Wholesale Corp.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "COST",
    "sector": "Toptan & Üyelikli Perakende",
    "basePrice": 945
  },
  {
    "symbol": "PG",
    "name": "Procter & Gamble Co.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "PG",
    "sector": "Tüketici Ürünleri & Temizlik",
    "basePrice": 174
  },
  {
    "symbol": "HD",
    "name": "The Home Depot Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "HD",
    "sector": "Ev Geliştirme & Yapı Perakende",
    "basePrice": 412
  },
  {
    "symbol": "JNJ",
    "name": "Johnson & Johnson",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "JNJ",
    "sector": "İlaç & Medikal Cihazlar",
    "basePrice": 158
  },
  {
    "symbol": "NFLX",
    "name": "Netflix Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "NFLX",
    "sector": "Dijital Yayın & Medya Eğlence",
    "basePrice": 890
  },
  {
    "symbol": "ABBV",
    "name": "AbbVie Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ABBV",
    "sector": "Biyofarmasötik & İmmünoloji",
    "basePrice": 178
  },
  {
    "symbol": "WMT",
    "name": "Walmart Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "WMT",
    "sector": "Perakende & Süpermarketler",
    "basePrice": 88
  },
  {
    "symbol": "CRM",
    "name": "Salesforce Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CRM",
    "sector": "Bulut Tabanlı CRM & Ajanlar",
    "basePrice": 335
  },
  {
    "symbol": "BAC",
    "name": "Bank of America Corp.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "BAC",
    "sector": "Bankacılık & Finansal Hizmetler",
    "basePrice": 46.5
  },
  {
    "symbol": "KO",
    "name": "The Coca-Cola Company",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "KO",
    "sector": "Alkolsüz İçecek & Meşrubat",
    "basePrice": 64.5
  },
  {
    "symbol": "ORCL",
    "name": "Oracle Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ORCL",
    "sector": "Veritabanı & Bulut Altyapısı",
    "basePrice": 192
  },
  {
    "symbol": "CVX",
    "name": "Chevron Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CVX",
    "sector": "Entegre Enerji & Akaryakıt",
    "basePrice": 158
  },
  {
    "symbol": "MRK",
    "name": "Merck & Co. Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "MRK",
    "sector": "Onkoloji & İlaç Geliştirme",
    "basePrice": 104
  },
  {
    "symbol": "AMD",
    "name": "Advanced Micro Devices",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "AMD",
    "sector": "Yarı İletken & Veri Merkezi Çipleri",
    "basePrice": 138
  },
  {
    "symbol": "PEP",
    "name": "PepsiCo Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "PEP",
    "sector": "İçecek & Atıştırmalık Gıda",
    "basePrice": 162
  },
  {
    "symbol": "TMO",
    "name": "Thermo Fisher Scientific",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "TMO",
    "sector": "Analitik Cihazlar & Laboratuvar",
    "basePrice": 525
  },
  {
    "symbol": "LIN",
    "name": "Linde plc",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "LIN",
    "sector": "Endüstriyel Gazlar & Kimya",
    "basePrice": 455
  },
  {
    "symbol": "ACN",
    "name": "Accenture plc",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ACN",
    "sector": "BT Danışmanlığı & Dijital Dönüşüm",
    "basePrice": 365
  },
  {
    "symbol": "ADBE",
    "name": "Adobe Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ADBE",
    "sector": "Yaratıcı Yazılım & Üretken AI",
    "basePrice": 510
  },
  {
    "symbol": "MCD",
    "name": "McDonald's Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "MCD",
    "sector": "Hızlı Servis Restoran Zinciri",
    "basePrice": 295
  },
  {
    "symbol": "QCOM",
    "name": "Qualcomm Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "QCOM",
    "sector": "Mobil Yonga & 5G İletişim",
    "basePrice": 165
  },
  {
    "symbol": "CSCO",
    "name": "Cisco Systems Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CSCO",
    "sector": "Ağ Donanımı & Kurumsal Güvenlik",
    "basePrice": 58
  },
  {
    "symbol": "DIS",
    "name": "The Walt Disney Company",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "DIS",
    "sector": "Medya, Eğlence & Tema Parkları",
    "basePrice": 114
  },
  {
    "symbol": "IBM",
    "name": "International Business Machines",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "IBM",
    "sector": "Hibrit Bulut & Kurumsal AI",
    "basePrice": 228
  },
  {
    "symbol": "GE",
    "name": "GE Aerospace",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "GE",
    "sector": "Havacılık Motorları & Sistemleri",
    "basePrice": 188
  },
  {
    "symbol": "TXN",
    "name": "Texas Instruments Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "TXN",
    "sector": "Analog Yarı İletkenler",
    "basePrice": 215
  },
  {
    "symbol": "CAT",
    "name": "Caterpillar Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CAT",
    "sector": "İş Makineleri & Ağır Ekipman",
    "basePrice": 395
  },
  {
    "symbol": "PM",
    "name": "Philip Morris International",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "PM",
    "sector": "Tütün & Dumansız Alternatifler",
    "basePrice": 132
  },
  {
    "symbol": "WFC",
    "name": "Wells Fargo & Company",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "WFC",
    "sector": "Bankacılık & Tüketici Kredileri",
    "basePrice": 74
  },
  {
    "symbol": "VZ",
    "name": "Verizon Communications",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "VZ",
    "sector": "Telekomünikasyon & Kablosuz Ağ",
    "basePrice": 42.5
  },
  {
    "symbol": "AMAT",
    "name": "Applied Materials Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "AMAT",
    "sector": "Yarı İletken Üretim Ekipmanları",
    "basePrice": 185
  },
  {
    "symbol": "INTU",
    "name": "Intuit Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "INTU",
    "sector": "Mali ve Muhasebe Yazılımları",
    "basePrice": 665
  },
  {
    "symbol": "NOW",
    "name": "ServiceNow Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "NOW",
    "sector": "Kurumsal İş Akışı Otomasyonu",
    "basePrice": 1040
  },
  {
    "symbol": "CMG",
    "name": "Chipotle Mexican Grill",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CMG",
    "sector": "Hızlı Rahat Restoranlar",
    "basePrice": 62
  },
  {
    "symbol": "ISRG",
    "name": "Intuitive Surgical Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ISRG",
    "sector": "Robotik Cerrahi Sistemleri",
    "basePrice": 535
  },
  {
    "symbol": "BKNG",
    "name": "Booking Holdings Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "BKNG",
    "sector": "Online Seyahat & Konaklama",
    "basePrice": 4850
  },
  {
    "symbol": "AMGN",
    "name": "Amgen Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "AMGN",
    "sector": "Biyoteknoloji & Terapötikler",
    "basePrice": 285
  },
  {
    "symbol": "COP",
    "name": "ConocoPhillips",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "COP",
    "sector": "Petrol & Doğalgaz Arama/Üretim",
    "basePrice": 108
  },
  {
    "symbol": "HON",
    "name": "Honeywell International",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "HON",
    "sector": "Endüstriyel Otomasyon & Havacılık",
    "basePrice": 225
  },
  {
    "symbol": "UNP",
    "name": "Union Pacific Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "UNP",
    "sector": "Demiryolu Taşımacılığı & Lojistik",
    "basePrice": 238
  },
  {
    "symbol": "AXP",
    "name": "American Express Company",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "AXP",
    "sector": "Ödeme Kartları & Finansal Hizmetler",
    "basePrice": 285
  },
  {
    "symbol": "LOW",
    "name": "Lowe's Companies Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "LOW",
    "sector": "Ev Geliştirme Perakendeciliği",
    "basePrice": 265
  },
  {
    "symbol": "BLK",
    "name": "BlackRock Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "BLK",
    "sector": "Global Varlık & Portföy Yönetimi",
    "basePrice": 1025
  },
  {
    "symbol": "NEE",
    "name": "NextEra Energy Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "NEE",
    "sector": "Yenilenebilir & Temiz Enerji",
    "basePrice": 78
  },
  {
    "symbol": "TJX",
    "name": "The TJX Companies Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "TJX",
    "sector": "İndirimli Giyim & Ev Modası",
    "basePrice": 122
  },
  {
    "symbol": "SPGI",
    "name": "S&P Global Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "SPGI",
    "sector": "Finansal Derecelendirme & Veri",
    "basePrice": 510
  },
  {
    "symbol": "SYK",
    "name": "Stryker Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "SYK",
    "sector": "Tıbbi Teknoloji & Ortopedi",
    "basePrice": 385
  },
  {
    "symbol": "GS",
    "name": "The Goldman Sachs Group",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "GS",
    "sector": "Yatırım Bankacılığı & Aracılık",
    "basePrice": 585
  },
  {
    "symbol": "BA",
    "name": "The Boeing Company",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "BA",
    "sector": "Ticari & Askeri Uçak Üretimi",
    "basePrice": 158
  },
  {
    "symbol": "DHR",
    "name": "Danaher Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "DHR",
    "sector": "Yaşam Bilimleri & Tanı Cihazları",
    "basePrice": 242
  },
  {
    "symbol": "ETN",
    "name": "Eaton Corporation plc",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ETN",
    "sector": "Güç Yönetimi & Elektrik Sistemleri",
    "basePrice": 365
  },
  {
    "symbol": "MDT",
    "name": "Medtronic plc",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "MDT",
    "sector": "Tıbbi Cihazlar & Sağlık Çözümleri",
    "basePrice": 88
  },
  {
    "symbol": "REGN",
    "name": "Regeneron Pharmaceuticals",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "REGN",
    "sector": "Biyoteknoloji & Antikor İlaçları",
    "basePrice": 765
  },
  {
    "symbol": "MS",
    "name": "Morgan Stanley",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "MS",
    "sector": "Yatırım Bankacılığı & Varlık Yönetimi",
    "basePrice": 128
  },
  {
    "symbol": "VRTX",
    "name": "Vertex Pharmaceuticals",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "VRTX",
    "sector": "Kistik Fibrozis & Gen Düzenleme",
    "basePrice": 465
  },
  {
    "symbol": "BSX",
    "name": "Boston Scientific Corp.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "BSX",
    "sector": "Girişimsel Tıp Cihazları",
    "basePrice": 88.5
  },
  {
    "symbol": "PANW",
    "name": "Palo Alto Networks Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "PANW",
    "sector": "Yeni Nesil Siber Güvenlik",
    "basePrice": 392
  },
  {
    "symbol": "PLTR",
    "name": "Palantir Technologies Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "PLTR",
    "sector": "Büyük Veri Analitiği & AI Platformu",
    "basePrice": 68.5
  },
  {
    "symbol": "MMC",
    "name": "Marsh & McLennan Companies",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "MMC",
    "sector": "Sigorta Aracılığı & Risk Danışmanlığı",
    "basePrice": 228
  },
  {
    "symbol": "CB",
    "name": "Chubb Limited",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CB",
    "sector": "Mülk ve Kaza Sigortacılığı",
    "basePrice": 285
  },
  {
    "symbol": "PGR",
    "name": "The Progressive Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "PGR",
    "sector": "Oto & Mülk Sigortacılığı",
    "basePrice": 255
  },
  {
    "symbol": "DE",
    "name": "Deere & Company",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "DE",
    "sector": "Tarım Makineleri & Hassas Tarım",
    "basePrice": 415
  },
  {
    "symbol": "CI",
    "name": "The Cigna Group",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CI",
    "sector": "Küresel Sağlık Hizmetleri & Eczane",
    "basePrice": 320
  },
  {
    "symbol": "LMT",
    "name": "Lockheed Martin Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "LMT",
    "sector": "Havacılık, Savunma & Füze Sistemleri",
    "basePrice": 545
  },
  {
    "symbol": "LRCX",
    "name": "Lam Research Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "LRCX",
    "sector": "Yarı İletken Aşındırma Ekipmanları",
    "basePrice": 78.5
  },
  {
    "symbol": "ELV",
    "name": "Elevance Health Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ELV",
    "sector": "Sağlık Planları & Medikal Hizmetler",
    "basePrice": 420
  },
  {
    "symbol": "ADP",
    "name": "Automatic Data Processing",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ADP",
    "sector": "Bordro & İnsan Kaynakları Yazılımı",
    "basePrice": 295
  },
  {
    "symbol": "GILD",
    "name": "Gilead Sciences Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "GILD",
    "sector": "Biyofarmasötik & Antiviral Tedaviler",
    "basePrice": 92
  },
  {
    "symbol": "ADI",
    "name": "Analog Devices Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ADI",
    "sector": "Sinyal İşleme & Analog Çipler",
    "basePrice": 222
  },
  {
    "symbol": "MU",
    "name": "Micron Technology Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "MU",
    "sector": "Bellek Çipleri (DRAM & NAND)",
    "basePrice": 104
  },
  {
    "symbol": "KLAC",
    "name": "KLA Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "KLAC",
    "sector": "Yarı İletken Süreç Kontrolü",
    "basePrice": 665
  },
  {
    "symbol": "FI",
    "name": "Fiserv Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "FI",
    "sector": "Ödemeler & Finansal Teknoloji",
    "basePrice": 215
  },
  {
    "symbol": "SNPS",
    "name": "Synopsys Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "SNPS",
    "sector": "Elektronik Tasarım Otomasyonu (EDA)",
    "basePrice": 540
  },
  {
    "symbol": "CDNS",
    "name": "Cadence Design Systems",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CDNS",
    "sector": "Çip Tasarım Yazılımları (EDA)",
    "basePrice": 295
  },
  {
    "symbol": "BDX",
    "name": "Becton Dickinson and Co.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "BDX",
    "sector": "Tıbbi Malzemeler & Teşhis",
    "basePrice": 242
  },
  {
    "symbol": "ICE",
    "name": "Intercontinental Exchange",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ICE",
    "sector": "Finansal Borsalar & Mortgage Verisi",
    "basePrice": 158
  },
  {
    "symbol": "CRWD",
    "name": "CrowdStrike Holdings Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CRWD",
    "sector": "Bulut Tabanlı Uç Nokta Güvenliği",
    "basePrice": 355
  },
  {
    "symbol": "APH",
    "name": "Amphenol Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "APH",
    "sector": "Konnektörler & Fiber Optik Sensörler",
    "basePrice": 68
  },
  {
    "symbol": "CMCSA",
    "name": "Comcast Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CMCSA",
    "sector": "Genişbant İnternet & Medya Eğlence",
    "basePrice": 42
  },
  {
    "symbol": "WM",
    "name": "Waste Management Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "WM",
    "sector": "Atık Yönetimi & Geri Dönüşüm",
    "basePrice": 218
  },
  {
    "symbol": "SO",
    "name": "The Southern Company",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "SO",
    "sector": "Elektrik & Kamu Hizmetleri",
    "basePrice": 88
  },
  {
    "symbol": "MCO",
    "name": "Moody's Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "MCO",
    "sector": "Kredi Derecelendirme & Risk Analitiği",
    "basePrice": 475
  },
  {
    "symbol": "MO",
    "name": "Altria Group Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "MO",
    "sector": "Tütün & Tüketim Ürünleri",
    "basePrice": 54
  },
  {
    "symbol": "EOG",
    "name": "EOG Resources Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "EOG",
    "sector": "Kayaç Petrolü & Doğalgaz Üretimi",
    "basePrice": 132
  },
  {
    "symbol": "ITW",
    "name": "Illinois Tool Works Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ITW",
    "sector": "Endüstriyel Ekipman & Malzemeler",
    "basePrice": 265
  },
  {
    "symbol": "SHW",
    "name": "The Sherwin-Williams Company",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "SHW",
    "sector": "Boya & Kaplama Ürünleri",
    "basePrice": 375
  },
  {
    "symbol": "PYPL",
    "name": "PayPal Holdings Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "PYPL",
    "sector": "Dijital Cüzdan & Ödeme Çözümleri",
    "basePrice": 84.5
  },
  {
    "symbol": "T",
    "name": "AT&T Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "T",
    "sector": "Telekomünikasyon & 5G Altyapısı",
    "basePrice": 22.8
  },
  {
    "symbol": "CVS",
    "name": "CVS Health Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CVS",
    "sector": "Eczane Zinciri & Sağlık Sigortası",
    "basePrice": 58
  },
  {
    "symbol": "ECL",
    "name": "Ecolab Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ECL",
    "sector": "Su Arıtma, Hijyen & Enfeksiyon Önleme",
    "basePrice": 248
  },
  {
    "symbol": "SLB",
    "name": "Schlumberger Limited",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "SLB",
    "sector": "Petrol Sahası Hizmetleri & Teknoloji",
    "basePrice": 42
  },
  {
    "symbol": "CTAS",
    "name": "Cintas Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CTAS",
    "sector": "Kurumsal Üniforma & Tesis Hizmetleri",
    "basePrice": 198
  },
  {
    "symbol": "DUK",
    "name": "Duke Energy Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "DUK",
    "sector": "Elektrik & Gaz Dağıtımı",
    "basePrice": 114
  },
  {
    "symbol": "PH",
    "name": "Parker-Hannifin Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "PH",
    "sector": "Hareket ve Kontrol Teknolojileri",
    "basePrice": 645
  },
  {
    "symbol": "CL",
    "name": "Colgate-Palmolive Company",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CL",
    "sector": "Ağız Bakımı & Kişisel Hijyen",
    "basePrice": 96
  },
  {
    "symbol": "MCK",
    "name": "McKesson Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "MCK",
    "sector": "İlaç Dağıtımı & Sağlık Tedarik",
    "basePrice": 580
  },
  {
    "symbol": "AON",
    "name": "Aon plc",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "AON",
    "sector": "Risk Yönetimi & Sigorta Danışmanlığı",
    "basePrice": 375
  },
  {
    "symbol": "CSX",
    "name": "CSX Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CSX",
    "sector": "Yük Demiryolu Taşımacılığı",
    "basePrice": 35
  },
  {
    "symbol": "TDG",
    "name": "TransDigm Group Incorporated",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "TDG",
    "sector": "Havacılık Yedek Parçaları & Sistemler",
    "basePrice": 1280
  },
  {
    "symbol": "HCA",
    "name": "HCA Healthcare Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "HCA",
    "sector": "Hastane & Cerrahi Merkezleri",
    "basePrice": 335
  },
  {
    "symbol": "BMY",
    "name": "Bristol-Myers Squibb Company",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "BMY",
    "sector": "Biyofarmasötik & İmmüno-onkoloji",
    "basePrice": 56
  },
  {
    "symbol": "NXPI",
    "name": "NXP Semiconductors N.V.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "NXPI",
    "sector": "Otomotiv & Endüstriyel Çipler",
    "basePrice": 235
  },
  {
    "symbol": "MAR",
    "name": "Marriott International Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "MAR",
    "sector": "Küresel Otel & Konaklama Zinciri",
    "basePrice": 278
  },
  {
    "symbol": "ABNB",
    "name": "Airbnb Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ABNB",
    "sector": "Online Konaklama & Deneyim Pazarı",
    "basePrice": 138
  },
  {
    "symbol": "COIN",
    "name": "Coinbase Global Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "COIN",
    "sector": "Kripto Para Borsası & Web3 Altyapı",
    "basePrice": 315
  },
  {
    "symbol": "MSTR",
    "name": "MicroStrategy Incorporated",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "MSTR",
    "sector": "Bitcoin Rezerv Şirketi & İş Zekası",
    "basePrice": 385
  },
  {
    "symbol": "ARM",
    "name": "Arm Holdings plc",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ARM",
    "sector": "Yarı İletken Mimari & IP Tasarımı",
    "basePrice": 138
  },
  {
    "symbol": "SMCI",
    "name": "Super Micro Computer Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "SMCI",
    "sector": "AI Sunucuları & Sıvı Soğutma",
    "basePrice": 38.5
  },
  {
    "symbol": "DELL",
    "name": "Dell Technologies Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "DELL",
    "sector": "AI Sunucuları & Kurumsal Donanım",
    "basePrice": 134
  },
  {
    "symbol": "INTC",
    "name": "Intel Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "INTC",
    "sector": "Mikroişlemciler & Dökümhane (Foundry)",
    "basePrice": 22.5
  },
  {
    "symbol": "ROST",
    "name": "Ross Stores Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ROST",
    "sector": "İndirimli Giyim Perakendesi",
    "basePrice": 148
  },
  {
    "symbol": "FDX",
    "name": "FedEx Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "FDX",
    "sector": "Küresel Ekspres Kargo & Lojistik",
    "basePrice": 285
  },
  {
    "symbol": "EMR",
    "name": "Emerson Electric Co.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "EMR",
    "sector": "Endüstriyel Otomasyon & Süreç Kontrol",
    "basePrice": 128
  },
  {
    "symbol": "NSC",
    "name": "Norfolk Southern Corp.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "NSC",
    "sector": "Demiryolu Taşımacılığı",
    "basePrice": 265
  },
  {
    "symbol": "COR",
    "name": "Cencora Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "COR",
    "sector": "İlaç Dağıtımı & Sağlık Çözümleri",
    "basePrice": 242
  },
  {
    "symbol": "PNC",
    "name": "The PNC Financial Services",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "PNC",
    "sector": "Bölgesel Bankacılık & Varlık",
    "basePrice": 198
  },
  {
    "symbol": "USB",
    "name": "U.S. Bancorp",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "USB",
    "sector": "Finansal Hizmetler & Bankacılık",
    "basePrice": 51
  },
  {
    "symbol": "GD",
    "name": "General Dynamics Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "GD",
    "sector": "Savunma Sanayi, Denizaltı & Havacılık",
    "basePrice": 302
  },
  {
    "symbol": "RTX",
    "name": "RTX Corporation (Raytheon)",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "RTX",
    "sector": "Havacılık & Savunma Sistemleri",
    "basePrice": 124
  },
  {
    "symbol": "NOC",
    "name": "Northrop Grumman Corp.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "NOC",
    "sector": "Hayalet Bombardıman & Uzay Sistemleri",
    "basePrice": 512
  },
  {
    "symbol": "HLT",
    "name": "Hilton Worldwide Holdings",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "HLT",
    "sector": "Otelcilik & Tatil Köyleri",
    "basePrice": 245
  },
  {
    "symbol": "ORLY",
    "name": "O'Reilly Automotive Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ORLY",
    "sector": "Otomotiv Yedek Parça Perakende",
    "basePrice": 1210
  },
  {
    "symbol": "AZO",
    "name": "AutoZone Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "AZO",
    "sector": "Oto Yedek Parça & Aksesuar",
    "basePrice": 3140
  },
  {
    "symbol": "ADSK",
    "name": "Autodesk Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ADSK",
    "sector": "CAD & 3D Tasarım Yazılımları",
    "basePrice": 312
  },
  {
    "symbol": "ROP",
    "name": "Roper Technologies Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ROP",
    "sector": "Niş Yazılım & Medikal Sistemler",
    "basePrice": 565
  },
  {
    "symbol": "CPRT",
    "name": "Copart Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CPRT",
    "sector": "Online Araç İhale & Müzayede",
    "basePrice": 56
  },
  {
    "symbol": "PCAR",
    "name": "PACCAR Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "PCAR",
    "sector": "Ağır Hizmet Kamyonları (Kenworth/Peterbilt)",
    "basePrice": 112
  },
  {
    "symbol": "MNST",
    "name": "Monster Beverage Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "MNST",
    "sector": "Enerji İçecekleri & Meşrubat",
    "basePrice": 52
  },
  {
    "symbol": "ODFL",
    "name": "Old Dominion Freight Line",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ODFL",
    "sector": "LTL Kargo Taşımacılığı",
    "basePrice": 204
  },
  {
    "symbol": "PAYX",
    "name": "Paychex Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "PAYX",
    "sector": "İK, Bordro & Yan Haklar Hizmeti",
    "basePrice": 142
  },
  {
    "symbol": "FAST",
    "name": "Fastenal Company",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "FAST",
    "sector": "Endüstriyel Bağlantı Elemanları",
    "basePrice": 82
  },
  {
    "symbol": "CTSH",
    "name": "Cognizant Technology Solutions",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CTSH",
    "sector": "BT Danışmanlığı & Yazılım",
    "basePrice": 76
  },
  {
    "symbol": "VRSK",
    "name": "Verisk Analytics Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "VRSK",
    "sector": "Veri Analitiği & Risk Değerlendirme",
    "basePrice": 274
  },
  {
    "symbol": "GEHC",
    "name": "GE HealthCare Technologies",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "GEHC",
    "sector": "Tıbbi Görüntüleme & Tanı Cihazları",
    "basePrice": 88
  },
  {
    "symbol": "FANG",
    "name": "Diamondback Energy Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "FANG",
    "sector": "Permian Havzası Petrol Üretimi",
    "basePrice": 184
  },
  {
    "symbol": "KDP",
    "name": "Keurig Dr Pepper Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "KDP",
    "sector": "Kahve Makineleri & Gazlı İçecekler",
    "basePrice": 34
  },
  {
    "symbol": "CHTR",
    "name": "Charter Communications Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CHTR",
    "sector": "Kablolu TV & Genişbant İnternet",
    "basePrice": 385
  },
  {
    "symbol": "EXC",
    "name": "Exelon Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "EXC",
    "sector": "Elektrik Dağıtım & İletim",
    "basePrice": 39.5
  },
  {
    "symbol": "XEL",
    "name": "Xcel Energy Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "XEL",
    "sector": "Elektrik & Doğalgaz Hizmetleri",
    "basePrice": 68
  },
  {
    "symbol": "KMB",
    "name": "Kimberly-Clark Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "KMB",
    "sector": "Kişisel Bakım & Hijyen Ürünleri",
    "basePrice": 138
  },
  {
    "symbol": "STZ",
    "name": "Constellation Brands Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "STZ",
    "sector": "Bira, Şarap & Alkollü İçecekler",
    "basePrice": 242
  },
  {
    "symbol": "MET",
    "name": "MetLife Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "MET",
    "sector": "Hayat Sigortası & Emeklilik",
    "basePrice": 84
  },
  {
    "symbol": "AIG",
    "name": "American International Group",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "AIG",
    "sector": "Global Sigorta & Finans",
    "basePrice": 76
  },
  {
    "symbol": "PRU",
    "name": "Prudential Financial Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "PRU",
    "sector": "Sigorta & Finansal Danışmanlık",
    "basePrice": 122
  },
  {
    "symbol": "TRV",
    "name": "The Travelers Companies",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "TRV",
    "sector": "Ticari & Bireysel Sigortacılık",
    "basePrice": 265
  },
  {
    "symbol": "ALL",
    "name": "The Allstate Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ALL",
    "sector": "Kişisel Hatlar Sigortacılığı",
    "basePrice": 198
  },
  {
    "symbol": "AFL",
    "name": "Aflac Incorporated",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "AFL",
    "sector": "Tamamlayıcı Sağlık Sigortası",
    "basePrice": 112
  },
  {
    "symbol": "AMP",
    "name": "Ameriprise Financial Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "AMP",
    "sector": "Varlık Yönetimi & Finansal Planlama",
    "basePrice": 545
  },
  {
    "symbol": "TROW",
    "name": "T. Rowe Price Group Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "TROW",
    "sector": "Yatırım Yönetimi & Emeklilik Fonları",
    "basePrice": 114
  },
  {
    "symbol": "BK",
    "name": "The Bank of New York Mellon",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "BK",
    "sector": "Saklama Bankacılığı & Varlık Yönetimi",
    "basePrice": 78
  },
  {
    "symbol": "STT",
    "name": "State Street Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "STT",
    "sector": "Kurumsal Yatırımcı Hizmetleri & ETF",
    "basePrice": 98
  },
  {
    "symbol": "NTRS",
    "name": "Northern Trust Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "NTRS",
    "sector": "Özel Bankacılık & Varlık Saklama",
    "basePrice": 104
  },
  {
    "symbol": "FITB",
    "name": "Fifth Third Bancorp",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "FITB",
    "sector": "Bölgesel Ticari Bankacılık",
    "basePrice": 44
  },
  {
    "symbol": "RF",
    "name": "Regions Financial Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "RF",
    "sector": "Güneydoğu ABD Bölgesel Bankacılık",
    "basePrice": 24.5
  },
  {
    "symbol": "CFG",
    "name": "Citizens Financial Group",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CFG",
    "sector": "Bireysel & Ticari Bankacılık",
    "basePrice": 46
  },
  {
    "symbol": "KEY",
    "name": "KeyCorp",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "KEY",
    "sector": "Bölgesel Finansal Hizmetler",
    "basePrice": 18.5
  },
  {
    "symbol": "HBAN",
    "name": "Huntington Bancshares Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "HBAN",
    "sector": "Orta Batı Bölgesel Bankacılığı",
    "basePrice": 16.8
  },
  {
    "symbol": "MTB",
    "name": "M&T Bank Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "MTB",
    "sector": "Topluluk & Ticari Bankacılık",
    "basePrice": 212
  },
  {
    "symbol": "C",
    "name": "Citigroup Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "C",
    "sector": "Global Yatırım Bankacılığı",
    "basePrice": 68
  },
  {
    "symbol": "MSI",
    "name": "Motorola Solutions Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "MSI",
    "sector": "Kamu Güvenliği & Telsiz Sistemleri",
    "basePrice": 485
  },
  {
    "symbol": "ANET",
    "name": "Arista Networks Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ANET",
    "sector": "Bulut Ağ Anahtarları & Yazılım",
    "basePrice": 412
  },
  {
    "symbol": "TEL",
    "name": "TE Connectivity Ltd.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "TEL",
    "sector": "Sensörler & Bağlantı Elemanları",
    "basePrice": 154
  },
  {
    "symbol": "KEYS",
    "name": "Keysight Technologies Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "KEYS",
    "sector": "Elektronik Ölçüm & Test Cihazları",
    "basePrice": 162
  },
  {
    "symbol": "FTNT",
    "name": "Fortinet Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "FTNT",
    "sector": "Ağ Güvenliği & Güvenlik Duvarı",
    "basePrice": 96
  },
  {
    "symbol": "GEN",
    "name": "Gen Digital Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "GEN",
    "sector": "Bireysel Siber Güvenlik (Norton/Avast)",
    "basePrice": 28.5
  },
  {
    "symbol": "WDAY",
    "name": "Workday Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "WDAY",
    "sector": "Kurumsal Bulut İK & Finans",
    "basePrice": 274
  },
  {
    "symbol": "TEAM",
    "name": "Atlassian Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "TEAM",
    "sector": "Yazılım Geliştirme & İşbirliği (Jira)",
    "basePrice": 248
  },
  {
    "symbol": "DDOG",
    "name": "Datadog Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "DDOG",
    "sector": "Bulut İzleme & Güvenlik Analitiği",
    "basePrice": 142
  },
  {
    "symbol": "SNOW",
    "name": "Snowflake Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "SNOW",
    "sector": "Bulut Veri Ambarı & AI Platformu",
    "basePrice": 178
  },
  {
    "symbol": "NET",
    "name": "Cloudflare Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "NET",
    "sector": "Web Performansı & CDN / Zero Trust",
    "basePrice": 114
  },
  {
    "symbol": "ZS",
    "name": "Zscaler Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ZS",
    "sector": "Bulut Güvenliği & SASE Çözümleri",
    "basePrice": 214
  },
  {
    "symbol": "MDB",
    "name": "MongoDB Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "MDB",
    "sector": "Modern Belge Tabanlı Veritabanı",
    "basePrice": 320
  },
  {
    "symbol": "HUBS",
    "name": "HubSpot Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "HUBS",
    "sector": "Pazarlama & Müşteri Etkileşimi",
    "basePrice": 680
  },
  {
    "symbol": "APP",
    "name": "AppLovin Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "APP",
    "sector": "Mobil Uygulama Pazarlama & AI",
    "basePrice": 345
  },
  {
    "symbol": "TTD",
    "name": "The Trade Desk Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "TTD",
    "sector": "Programatik Dijital Reklam Alımı",
    "basePrice": 124
  },
  {
    "symbol": "SHOP",
    "name": "Shopify Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "SHOP",
    "sector": "E-Ticaret Altyapısı & Mağaza Çözümleri",
    "basePrice": 114
  },
  {
    "symbol": "SE",
    "name": "Sea Limited",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "SE",
    "sector": "Güneydoğu Asya E-Ticaret & Oyun",
    "basePrice": 112
  },
  {
    "symbol": "MELI",
    "name": "MercadoLibre Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "MELI",
    "sector": "Latin Amerika E-Ticaret & Fintek",
    "basePrice": 2150
  },
  {
    "symbol": "CP",
    "name": "Canadian Pacific Kansas City",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CP",
    "sector": "Trans-Kıta Demiryolu Ağı",
    "basePrice": 84
  },
  {
    "symbol": "CNI",
    "name": "Canadian National Railway",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CNI",
    "sector": "Kuzey Amerika Demiryolu Taşımacılığı",
    "basePrice": 112
  },
  {
    "symbol": "DAL",
    "name": "Delta Air Lines Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "DAL",
    "sector": "Küresel Havayolu Taşımacılığı",
    "basePrice": 62
  },
  {
    "symbol": "UAL",
    "name": "United Airlines Holdings",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "UAL",
    "sector": "Uluslararası Havayolu Taşımacılığı",
    "basePrice": 94
  },
  {
    "symbol": "LUV",
    "name": "Southwest Airlines Co.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "LUV",
    "sector": "Düşük Maliyetli İç Hat Uçuşları",
    "basePrice": 32
  },
  {
    "symbol": "AAL",
    "name": "American Airlines Group",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "AAL",
    "sector": "Yolcu & Kargo Havayolu Hizmetleri",
    "basePrice": 15.8
  },
  {
    "symbol": "GM",
    "name": "General Motors Company",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "GM",
    "sector": "Otomotiv & Elektrikli Araçlar",
    "basePrice": 54
  },
  {
    "symbol": "F",
    "name": "Ford Motor Company",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "F",
    "sector": "Kamyonet, SUV & Otomotiv",
    "basePrice": 11.2
  },
  {
    "symbol": "RIVN",
    "name": "Rivian Automotive Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "RIVN",
    "sector": "Elektrikli Kamyonet & SUV",
    "basePrice": 12.4
  },
  {
    "symbol": "LCID",
    "name": "Lucid Group Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "LCID",
    "sector": "Lüks Elektrikli Sedanlar",
    "basePrice": 2.45
  },
  {
    "symbol": "ON",
    "name": "ON Semiconductor Corp.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ON",
    "sector": "Güç Yönetimi & Otomotiv Çipleri",
    "basePrice": 74
  },
  {
    "symbol": "MPWR",
    "name": "Monolithic Power Systems",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "MPWR",
    "sector": "Yüksek Performanslı Güç Çipleri",
    "basePrice": 640
  },
  {
    "symbol": "SWKS",
    "name": "Skyworks Solutions Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "SWKS",
    "sector": "Kablosuz İletişim RF Yarı İletkenleri",
    "basePrice": 88
  },
  {
    "symbol": "QRVO",
    "name": "Qorvo Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "QRVO",
    "sector": "RF Çözümleri & Mobil Bağlantı",
    "basePrice": 74
  },
  {
    "symbol": "WDC",
    "name": "Western Digital Corp.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "WDC",
    "sector": "HDD & Flash Bellek Depolama",
    "basePrice": 68
  },
  {
    "symbol": "STX_US",
    "name": "Seagate Technology Holdings",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "STX",
    "sector": "Kurumsal Veri Depolama (HDD)",
    "basePrice": 104
  },
  {
    "symbol": "HPE",
    "name": "Hewlett Packard Enterprise",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "HPE",
    "sector": "Kurumsal Sunucular & Edge Bulut",
    "basePrice": 21.5
  },
  {
    "symbol": "HPQ",
    "name": "HP Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "HPQ",
    "sector": "Kişisel Bilgisayarlar & Yazıcılar",
    "basePrice": 36.5
  },
  {
    "symbol": "NTAP",
    "name": "NetApp Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "NTAP",
    "sector": "Akıllı Veri Altyapısı & Depolama",
    "basePrice": 128
  },
  {
    "symbol": "PSTG",
    "name": "Pure Storage Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "PSTG",
    "sector": "Tüm Flash Veri Depolama Sistemleri",
    "basePrice": 54
  },
  {
    "symbol": "FFIV",
    "name": "F5 Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "FFIV",
    "sector": "Uygulama Güvenliği & Dağıtımı",
    "basePrice": 242
  },
  {
    "symbol": "AKAM",
    "name": "Akamai Technologies Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "AKAM",
    "sector": "CDN, Bulut Bilişim & Siber Güvenlik",
    "basePrice": 94
  },
  {
    "symbol": "TER",
    "name": "Teradyne Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "TER",
    "sector": "Otomatik Test Ekipmanları & Robotik",
    "basePrice": 122
  },
  {
    "symbol": "ENTG",
    "name": "Entegris Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ENTG",
    "sector": "Yarı İletken Saflık & Malzeme Çözümleri",
    "basePrice": 108
  },
  {
    "symbol": "MKSI",
    "name": "MKS Instruments Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "MKSI",
    "sector": "Vakum & Lazer Proses Ekipmanları",
    "basePrice": 118
  },
  {
    "symbol": "COHR",
    "name": "Coherent Corp.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "COHR",
    "sector": "Optik İletişim & Lazer Malzemeleri",
    "basePrice": 104
  },
  {
    "symbol": "LITE",
    "name": "Lumentum Holdings Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "LITE",
    "sector": "Optik & Fotonik Bileşenler",
    "basePrice": 84
  },
  {
    "symbol": "CIEN",
    "name": "Ciena Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CIEN",
    "sector": "Optik Ağ Sistemleri & Yazılım",
    "basePrice": 68
  },
  {
    "symbol": "JNPR",
    "name": "Juniper Networks Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "JNPR",
    "sector": "Yapay Zeka Destekli Ağ Çözümleri",
    "basePrice": 38
  },
  {
    "symbol": "SMTC",
    "name": "Semtech Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "SMTC",
    "sector": "LoRa & Yüksek Performanslı Analog",
    "basePrice": 54
  },
  {
    "symbol": "ALAB",
    "name": "Astera Labs Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ALAB",
    "sector": "AI ve Bulut Bağlantı Çipleri",
    "basePrice": 98
  },
  {
    "symbol": "CAVA",
    "name": "CAVA Group Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CAVA",
    "sector": "Akdeniz Mutfağı Restoran Zinciri",
    "basePrice": 142
  },
  {
    "symbol": "WING",
    "name": "Wingstop Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "WING",
    "sector": "Tavuk Kanadı Restoran Franchise",
    "basePrice": 365
  },
  {
    "symbol": "DPZ",
    "name": "Domino's Pizza Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "DPZ",
    "sector": "Global Pizza Teslimat Zinciri",
    "basePrice": 445
  },
  {
    "symbol": "YUM",
    "name": "YUM! Brands Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "YUM",
    "sector": "KFC, Pizza Hut, Taco Bell",
    "basePrice": 138
  },
  {
    "symbol": "DRI",
    "name": "Darden Restaurants Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "DRI",
    "sector": "Olive Garden & LongHorn Steakhouse",
    "basePrice": 178
  },
  {
    "symbol": "SBUX",
    "name": "Starbucks Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "SBUX",
    "sector": "Özel Kahve & Mağazacılık",
    "basePrice": 98.5
  },
  {
    "symbol": "QSR",
    "name": "Restaurant Brands International",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "QSR",
    "sector": "Burger King, Tim Hortons, Popeyes",
    "basePrice": 72
  },
  {
    "symbol": "EXPE",
    "name": "Expedia Group Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "EXPE",
    "sector": "Online Seyahat & Rezervasyon",
    "basePrice": 178
  },
  {
    "symbol": "TRIP",
    "name": "Tripadvisor Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "TRIP",
    "sector": "Seyahat İnceleme & Rezervasyon",
    "basePrice": 16.5
  },
  {
    "symbol": "RCL",
    "name": "Royal Caribbean Cruises Ltd.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "RCL",
    "sector": "Lüks Kruvaziyer Tatil Turları",
    "basePrice": 235
  },
  {
    "symbol": "CCL",
    "name": "Carnival Corporation & plc",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CCL",
    "sector": "Dünya Çapında Kruvaziyer Hatları",
    "basePrice": 25.4
  },
  {
    "symbol": "NCLH",
    "name": "Norwegian Cruise Line Holdings",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "NCLH",
    "sector": "Kruvaziyer Seyahatleri",
    "basePrice": 26.8
  },
  {
    "symbol": "WYNN",
    "name": "Wynn Resorts Limited",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "WYNN",
    "sector": "Lüks Casino & Otel Kompleksleri",
    "basePrice": 94
  },
  {
    "symbol": "LVS",
    "name": "Las Vegas Sands Corp.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "LVS",
    "sector": "Asya ve ABD Casino & Tatil Köyleri",
    "basePrice": 54
  },
  {
    "symbol": "MGM",
    "name": "MGM Resorts International",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "MGM",
    "sector": "Casino, Otel & Eğlence Merkezleri",
    "basePrice": 38.5
  },
  {
    "symbol": "DKNG",
    "name": "DraftKings Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "DKNG",
    "sector": "Online Spor Bahisleri & İ-Gaming",
    "basePrice": 44
  },
  {
    "symbol": "PENN",
    "name": "PENN Entertainment Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "PENN",
    "sector": "Kumarhane & Dijital Bahis",
    "basePrice": 21
  },
  {
    "symbol": "TTWO",
    "name": "Take-Two Interactive Software",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "TTWO",
    "sector": "GTA, 2K Sports Video Oyunları",
    "basePrice": 184
  },
  {
    "symbol": "EA",
    "name": "Electronic Arts Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "EA",
    "sector": "EA Sports FC, Apex Legends",
    "basePrice": 162
  },
  {
    "symbol": "RBLX",
    "name": "Roblox Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "RBLX",
    "sector": "Kullanıcı Üretimi Oyun & Metaverse",
    "basePrice": 54
  },
  {
    "symbol": "U",
    "name": "Unity Software Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "U",
    "sector": "Gerçek Zamanlı 3D Oyun Motoru",
    "basePrice": 24.5
  },
  {
    "symbol": "PLNT",
    "name": "Planet Fitness Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "PLNT",
    "sector": "Düşük Ücretli Fitness Salonları",
    "basePrice": 98
  },
  {
    "symbol": "NKE",
    "name": "NIKE Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "NKE",
    "sector": "Spor Ayakkabı, Giyim & Ekipman",
    "basePrice": 78
  },
  {
    "symbol": "LULU",
    "name": "Lululemon Athletica Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "LULU",
    "sector": "Yoga & Teknik Spor Giyim",
    "basePrice": 345
  },
  {
    "symbol": "DECK",
    "name": "Deckers Outdoor Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "DECK",
    "sector": "HOKA, UGG Spor Ayakkabıları",
    "basePrice": 198
  },
  {
    "symbol": "ONON",
    "name": "On Holding AG",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ONON",
    "sector": "Premium Koşu Ayakkabıları (On Cloud)",
    "basePrice": 54
  },
  {
    "symbol": "CROX",
    "name": "Crocs Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CROX",
    "sector": "Rahat Ayakkabılar & HEYDUDE",
    "basePrice": 114
  },
  {
    "symbol": "SKX",
    "name": "Skechers U.S.A. Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "SKX",
    "sector": "Yaşam Tarzı & Performans Ayakkabıları",
    "basePrice": 64
  },
  {
    "symbol": "ELF",
    "name": "e.l.f. Beauty Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ELF",
    "sector": "Temiz & Uygun Fiyatlı Kozmetik",
    "basePrice": 128
  },
  {
    "symbol": "ULTA",
    "name": "Ulta Beauty Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ULTA",
    "sector": "Güzellik Ürünleri & Salon Hizmetleri",
    "basePrice": 395
  },
  {
    "symbol": "EL",
    "name": "The Estée Lauder Companies",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "EL",
    "sector": "Lüks Cilt Bakımı & Parfüm",
    "basePrice": 68
  },
  {
    "symbol": "COTY",
    "name": "Coty Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "COTY",
    "sector": "Kozmetik & Parfüm Markaları",
    "basePrice": 7.4
  },
  {
    "symbol": "KSS",
    "name": "Kohl's Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "KSS",
    "sector": "Büyük Mağazacılık Zinciri",
    "basePrice": 16.5
  },
  {
    "symbol": "M",
    "name": "Macy's Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "M",
    "sector": "Lüks & Moda Büyük Mağazacılık",
    "basePrice": 16.8
  },
  {
    "symbol": "JWN",
    "name": "Nordstrom Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "JWN",
    "sector": "Lüks Moda & Giyim Mağazaları",
    "basePrice": 24
  },
  {
    "symbol": "BBY",
    "name": "Best Buy Co. Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "BBY",
    "sector": "Tüketici Elektroniği Perakendecisi",
    "basePrice": 92
  },
  {
    "symbol": "TGT",
    "name": "Target Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "TGT",
    "sector": "Genel Mağazacılık & Perakende",
    "basePrice": 134
  },
  {
    "symbol": "DG",
    "name": "Dollar General Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "DG",
    "sector": "İndirimli Mahalle Perakendecisi",
    "basePrice": 76
  },
  {
    "symbol": "DLTR",
    "name": "Dollar Tree Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "DLTR",
    "sector": "İndirimli Çeşit Mağazaları",
    "basePrice": 74
  },
  {
    "symbol": "FIVE",
    "name": "Five Below Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "FIVE",
    "sector": "Gençler İçin İndirimli Trend Ürünler",
    "basePrice": 104
  },
  {
    "symbol": "OLLI",
    "name": "Ollie's Bargain Outlet Holdings",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "OLLI",
    "sector": "İndirimli İhraç Fazlası Perakende",
    "basePrice": 94
  },
  {
    "symbol": "WBA",
    "name": "Walgreens Boots Alliance",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "WBA",
    "sector": "Eczane & Sağlık Perakendecisi",
    "basePrice": 9.8
  },
  {
    "symbol": "KR",
    "name": "The Kroger Co.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "KR",
    "sector": "Süpermarket & Çoklu Format Perakende",
    "basePrice": 58
  },
  {
    "symbol": "SYY",
    "name": "Sysco Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "SYY",
    "sector": "Restoran & Otel Gıda Dağıtımı",
    "basePrice": 78
  },
  {
    "symbol": "USFD",
    "name": "US Foods Holding Corp.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "USFD",
    "sector": "Gıda Servisi Distribütörü",
    "basePrice": 64
  },
  {
    "symbol": "PFGC",
    "name": "Performance Food Group Co.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "PFGC",
    "sector": "Ticari Gıda Hizmeti Dağıtımı",
    "basePrice": 84
  },
  {
    "symbol": "GIS",
    "name": "General Mills Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "GIS",
    "sector": "Kahvaltılık Gevrek & Paketli Gıda",
    "basePrice": 64
  },
  {
    "symbol": "K",
    "name": "Kellanova",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "K",
    "sector": "Pringles, Cheez-It Atıştırmalıklar",
    "basePrice": 81
  },
  {
    "symbol": "MDLZ",
    "name": "Mondelez International Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "MDLZ",
    "sector": "Oreo, Milka, Cadbury Atıştırmalık",
    "basePrice": 66
  },
  {
    "symbol": "HSY",
    "name": "The Hershey Company",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "HSY",
    "sector": "Çikolata & Şekerleme Ürünleri",
    "basePrice": 178
  },
  {
    "symbol": "CPB",
    "name": "Campbell Soup Company",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CPB",
    "sector": "Çorba, Sos & Kraker Ürünleri",
    "basePrice": 44
  },
  {
    "symbol": "CAG",
    "name": "Conagra Brands Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CAG",
    "sector": "Dondurulmuş & Paketli Gıdalar",
    "basePrice": 28
  },
  {
    "symbol": "SJM",
    "name": "The J. M. Smucker Company",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "SJM",
    "sector": "Reçel, Fıstık Ezmesi & Kahve",
    "basePrice": 114
  },
  {
    "symbol": "HRL",
    "name": "Hormel Foods Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "HRL",
    "sector": "Et Ürünleri & Konserve Gıdalar",
    "basePrice": 31
  },
  {
    "symbol": "TSN",
    "name": "Tyson Foods Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "TSN",
    "sector": "Tavuk, Sığır & Domuz Eti İşleme",
    "basePrice": 58
  },
  {
    "symbol": "PPC",
    "name": "Pilgrim's Pride Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "PPC",
    "sector": "Kanatlı Hayvan Üretimi",
    "basePrice": 48
  },
  {
    "symbol": "CALM",
    "name": "Cal-Maine Foods Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CALM",
    "sector": "Yumurta Üretimi & Dağıtımı",
    "basePrice": 92
  },
  {
    "symbol": "ADM",
    "name": "Archer-Daniels-Midland Co.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ADM",
    "sector": "Tarımsal Emtia İşleme & Tahıl",
    "basePrice": 54
  },
  {
    "symbol": "BG",
    "name": "Bunge Global SA",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "BG",
    "sector": "Yağlı Tohum İşleme & Tarım İhracatı",
    "basePrice": 88
  },
  {
    "symbol": "DAR",
    "name": "Darling Ingredients Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "DAR",
    "sector": "Biyo-besin & Sürdürülebilir Yakıt",
    "basePrice": 42
  },
  {
    "symbol": "MOS",
    "name": "The Mosaic Company",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "MOS",
    "sector": "Fosfat & Potas Gübre Üretimi",
    "basePrice": 26.5
  },
  {
    "symbol": "NTR",
    "name": "Nutrien Ltd.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "NTR",
    "sector": "Azot, Potas & Tarımsal Çözümler",
    "basePrice": 48
  },
  {
    "symbol": "CF",
    "name": "CF Industries Holdings Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CF",
    "sector": "Azotlu Gübre & Temiz Amonyak",
    "basePrice": 88
  },
  {
    "symbol": "FMC",
    "name": "FMC Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "FMC",
    "sector": "Zirai İlaç & Bitki Sağlığı Kimyası",
    "basePrice": 58
  },
  {
    "symbol": "CTVA",
    "name": "Corteva Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CTVA",
    "sector": "Tohum Teknolojileri & Tarım Kimyası",
    "basePrice": 58
  },
  {
    "symbol": "ALB",
    "name": "Albemarle Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ALB",
    "sector": "Lityum Üretimi & Özel Kimyasallar",
    "basePrice": 98
  },
  {
    "symbol": "SQM",
    "name": "Sociedad Química y Minera",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "SQM",
    "sector": "Lityum & Özel Bitki Besleme",
    "basePrice": 38.5
  },
  {
    "symbol": "FCX",
    "name": "Freeport-McMoRan Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "FCX",
    "sector": "Bakır & Altın Madenciliği",
    "basePrice": 44
  },
  {
    "symbol": "SCCO",
    "name": "Southern Copper Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "SCCO",
    "sector": "Bakır Madenciliği & İzabe",
    "basePrice": 108
  },
  {
    "symbol": "NEM",
    "name": "Newmont Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "NEM",
    "sector": "Dünyanın En Büyük Altın Madencisi",
    "basePrice": 42
  },
  {
    "symbol": "GOLD",
    "name": "Barrick Gold Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "GOLD",
    "sector": "Küresel Altın ve Bakır Madenciliği",
    "basePrice": 18.2
  },
  {
    "symbol": "AEM",
    "name": "Agnico Eagle Mines Limited",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "AEM",
    "sector": "Kıymetli Maden & Altın Üretimi",
    "basePrice": 84
  },
  {
    "symbol": "WPM",
    "name": "Wheaton Precious Metals Corp.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "WPM",
    "sector": "Değerli Metal Telif Hakları (Streaming)",
    "basePrice": 64
  },
  {
    "symbol": "FNV",
    "name": "Franco-Nevada Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "FNV",
    "sector": "Altın Telif & Royalty Şirketi",
    "basePrice": 128
  },
  {
    "symbol": "RGLD",
    "name": "Royal Gold Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "RGLD",
    "sector": "Kıymetli Madenler Telif Portföyü",
    "basePrice": 142
  },
  {
    "symbol": "AA",
    "name": "Alcoa Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "AA",
    "sector": "Boksit, Alümina & Alüminyum İmalatı",
    "basePrice": 42
  },
  {
    "symbol": "CENX",
    "name": "Century Aluminum Company",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CENX",
    "sector": "Birincil Alüminyum Üretimi",
    "basePrice": 18.5
  },
  {
    "symbol": "X",
    "name": "United States Steel Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "X",
    "sector": "Entegre Yassı Çelik İmalatı",
    "basePrice": 39
  },
  {
    "symbol": "NUE",
    "name": "Nucor Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "NUE",
    "sector": "Mini-Mill Elektrik Ark Ocaklı Çelik",
    "basePrice": 148
  },
  {
    "symbol": "STLD",
    "name": "Steel Dynamics Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "STLD",
    "sector": "Karbon Çelik & Geri Dönüşüm",
    "basePrice": 134
  },
  {
    "symbol": "CLF",
    "name": "Cleveland-Cliffs Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CLF",
    "sector": "Otomotiv Yassı Çelik & Demir Cevheri",
    "basePrice": 12.8
  },
  {
    "symbol": "VALE",
    "name": "Vale S.A.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "VALE",
    "sector": "Demir Cevheri, Nikel & Pelet",
    "basePrice": 9.8
  },
  {
    "symbol": "BHP",
    "name": "BHP Group Limited",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "BHP",
    "sector": "Çeşitlendirilmiş Küresel Madencilik",
    "basePrice": 52
  },
  {
    "symbol": "RIO",
    "name": "Rio Tinto Group",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "RIO",
    "sector": "Demir Cevheri, Alüminyum & Bakır",
    "basePrice": 62
  },
  {
    "symbol": "GLNCY",
    "name": "Glencore plc",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "GLNCY",
    "sector": "Doğal Kaynaklar & Emtia Ticareti",
    "basePrice": 9.8
  },
  {
    "symbol": "OXY",
    "name": "Occidental Petroleum Corp.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "OXY",
    "sector": "Petrol, Gaz & Karbon Yakalama",
    "basePrice": 51
  },
  {
    "symbol": "HES",
    "name": "Hess Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "HES",
    "sector": "Guyana Derin Deniz Petrol Üretimi",
    "basePrice": 148
  },
  {
    "symbol": "DVN",
    "name": "Devon Energy Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "DVN",
    "sector": "ABD Karasal Petrol & Sıvı Gaz",
    "basePrice": 39
  },
  {
    "symbol": "MRO",
    "name": "Marathon Oil Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "MRO",
    "sector": "Unconventional Petrol & Doğalgaz",
    "basePrice": 28.5
  },
  {
    "symbol": "APA",
    "name": "APA Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "APA",
    "sector": "Küresel Enerji Arama & Üretim",
    "basePrice": 24
  },
  {
    "symbol": "VLO",
    "name": "Valero Energy Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "VLO",
    "sector": "Petrol Rafinerisi & Yenilenebilir Dizel",
    "basePrice": 138
  },
  {
    "symbol": "MPC",
    "name": "Marathon Petroleum Corp.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "MPC",
    "sector": "Rafineri, Pazarlama & Lojistik",
    "basePrice": 154
  },
  {
    "symbol": "PSX",
    "name": "Phillips 66",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "PSX",
    "sector": "Rafineri, Kimyasallar & Orta Akım",
    "basePrice": 128
  },
  {
    "symbol": "HESM",
    "name": "Hess Midstream LP",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "HESM",
    "sector": "Petrol Boru Hatları & Terminal",
    "basePrice": 38
  },
  {
    "symbol": "WMB",
    "name": "The Williams Companies Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "WMB",
    "sector": "Doğalgaz Boru Hattı Altyapısı",
    "basePrice": 54
  },
  {
    "symbol": "KMI",
    "name": "Kinder Morgan Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "KMI",
    "sector": "Kuzey Amerika Enerji Altyapısı",
    "basePrice": 26.5
  },
  {
    "symbol": "OKE",
    "name": "ONEOK Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "OKE",
    "sector": "Doğalgaz Sıvıları Toplama & Taşıma",
    "basePrice": 104
  },
  {
    "symbol": "TRGP",
    "name": "Targa Resources Corp.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "TRGP",
    "sector": "Orta Akım Doğalgaz Hizmetleri",
    "basePrice": 188
  },
  {
    "symbol": "ET",
    "name": "Energy Transfer LP",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ET",
    "sector": "Ham Petrol & Gaz Boru Hatları",
    "basePrice": 18.2
  },
  {
    "symbol": "EPD",
    "name": "Enterprise Products Partners",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "EPD",
    "sector": "Entegre Enerji Orta Akım Hizmetleri",
    "basePrice": 31
  },
  {
    "symbol": "MPLX",
    "name": "MPLX LP",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "MPLX",
    "sector": "Yakıt Toplama, İşleme & Taşıma",
    "basePrice": 46
  },
  {
    "symbol": "HAL",
    "name": "Halliburton Company",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "HAL",
    "sector": "Kuyu Tamamlama & Sondaj Hizmetleri",
    "basePrice": 29.5
  },
  {
    "symbol": "BKR",
    "name": "Baker Hughes Company",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "BKR",
    "sector": "Petrol Sahası Teknolojileri & Turbomakine",
    "basePrice": 42
  },
  {
    "symbol": "NOV",
    "name": "NOV Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "NOV",
    "sector": "Petrol Sondaj Ekipmanları & Kuleler",
    "basePrice": 15.8
  },
  {
    "symbol": "FTI",
    "name": "TechnipFMC plc",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "FTI",
    "sector": "Denizaltı Enerji Sistemleri",
    "basePrice": 28
  },
  {
    "symbol": "FSLR",
    "name": "First Solar Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "FSLR",
    "sector": "İnce Film Güneş Enerjisi Panelleri",
    "basePrice": 198
  },
  {
    "symbol": "ENPH",
    "name": "Enphase Energy Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ENPH",
    "sector": "Mikroinverter & Ev Batarya Sistemleri",
    "basePrice": 68
  },
  {
    "symbol": "SEDG",
    "name": "SolarEdge Technologies Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "SEDG",
    "sector": "Solar Optimize Edici & İnverter",
    "basePrice": 14.5
  },
  {
    "symbol": "RUN",
    "name": "Sunrun Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "RUN",
    "sector": "Konut Tipi Güneş Enerjisi & Depolama",
    "basePrice": 11.2
  },
  {
    "symbol": "BE",
    "name": "Bloom Energy Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "BE",
    "sector": "Katı Oksit Yakıt Pilleri & Hidrojen",
    "basePrice": 22
  },
  {
    "symbol": "PLUG",
    "name": "Plug Power Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "PLUG",
    "sector": "Yeşil Hidrojen & Yakıt Hücreleri",
    "basePrice": 2.15
  },
  {
    "symbol": "CWEN",
    "name": "Clearway Energy Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CWEN",
    "sector": "Temiz Enerji Üretim Tesisleri",
    "basePrice": 26.5
  },
  {
    "symbol": "HASI",
    "name": "Hannon Armstrong Sustainable",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "HASI",
    "sector": "İklim Çözümleri Finansmanı",
    "basePrice": 28
  },
  {
    "symbol": "CEG",
    "name": "Constellation Energy Corp.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CEG",
    "sector": "Nükleer Enerji & AI Veri Merkezi Gücü",
    "basePrice": 235
  },
  {
    "symbol": "VST",
    "name": "Vistra Corp.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "VST",
    "sector": "Nükleer, Gaz & Güneş Elektrik Üretimi",
    "basePrice": 154
  },
  {
    "symbol": "NRG",
    "name": "NRG Energy Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "NRG",
    "sector": "Tüketici Enerji Hizmetleri",
    "basePrice": 94
  },
  {
    "symbol": "TLN",
    "name": "Talen Energy Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "TLN",
    "sector": "Nükleer Güç & Bulut Veri Merkezi",
    "basePrice": 215
  },
  {
    "symbol": "AEE",
    "name": "Ameren Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "AEE",
    "sector": "Elektrik & Gaz Kamu Hizmeti",
    "basePrice": 88
  },
  {
    "symbol": "AEP",
    "name": "American Electric Power Co.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "AEP",
    "sector": "Bölgesel Elektrik Dağıtımı",
    "basePrice": 98
  },
  {
    "symbol": "D",
    "name": "Dominion Energy Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "D",
    "sector": "Temiz Enerji & Elektrik Şebekesi",
    "basePrice": 56
  },
  {
    "symbol": "ED",
    "name": "Consolidated Edison Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ED",
    "sector": "New York Elektrik & Gaz Şebekesi",
    "basePrice": 98
  },
  {
    "symbol": "EIX",
    "name": "Edison International",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "EIX",
    "sector": "Güney Kaliforniya Elektrik Hizmeti",
    "basePrice": 84
  },
  {
    "symbol": "ES",
    "name": "Eversource Energy",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ES",
    "sector": "New England Enerji Dağıtımı",
    "basePrice": 64
  },
  {
    "symbol": "ETR",
    "name": "Entergy Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ETR",
    "sector": "Güney Eyaletleri Elektrik Üretimi",
    "basePrice": 88
  },
  {
    "symbol": "FE",
    "name": "FirstEnergy Corp.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "FE",
    "sector": "Orta Atlantik Elektrik Şebekesi",
    "basePrice": 42
  },
  {
    "symbol": "PPL",
    "name": "PPL Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "PPL",
    "sector": "Düzenlemeye Tabi Elektrik Şirketi",
    "basePrice": 32
  },
  {
    "symbol": "PEG",
    "name": "Public Service Enterprise Group",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "PEG",
    "sector": "Nükleer & Gaz Kamu Hizmeti",
    "basePrice": 86
  },
  {
    "symbol": "SRE",
    "name": "Sempra",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "SRE",
    "sector": "LNG İhracatı & Altyapı Şebekesi",
    "basePrice": 88
  },
  {
    "symbol": "WEC",
    "name": "WEC Energy Group Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "WEC",
    "sector": "Midwest Elektrik & Gaz Sağlayıcısı",
    "basePrice": 94
  },
  {
    "symbol": "AWK",
    "name": "American Water Works Co.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "AWK",
    "sector": "Su ve Atıksu Hizmetleri",
    "basePrice": 134
  },
  {
    "symbol": "WTRG",
    "name": "Essential Utilities Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "WTRG",
    "sector": "Su ve Doğalgaz Dağıtımı",
    "basePrice": 38
  },
  {
    "symbol": "XYL",
    "name": "Xylem Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "XYL",
    "sector": "Su Teknolojileri & Akıllı Sayaçlar",
    "basePrice": 128
  },
  {
    "symbol": "PLD",
    "name": "Prologis Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "PLD",
    "sector": "Lojistik & E-Ticaret Depo GYO",
    "basePrice": 118
  },
  {
    "symbol": "AMT",
    "name": "American Tower Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "AMT",
    "sector": "Kablosuz İletişim Kuleleri GYO",
    "basePrice": 198
  },
  {
    "symbol": "CCI",
    "name": "Crown Castle Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CCI",
    "sector": "Hücresel Kuleler & Küçük Hücre Ağı",
    "basePrice": 104
  },
  {
    "symbol": "EQIX",
    "name": "Equinix Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "EQIX",
    "sector": "Küresel Taşıyıcı Bağımsız Veri Merkezleri",
    "basePrice": 945
  },
  {
    "symbol": "DLR",
    "name": "Digital Realty Trust Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "DLR",
    "sector": "Bulut & AI Veri Merkezleri GYO",
    "basePrice": 178
  },
  {
    "symbol": "PSA",
    "name": "Public Storage",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "PSA",
    "sector": "Bireysel Kiralık Depolama GYO",
    "basePrice": 315
  },
  {
    "symbol": "EXR",
    "name": "Extra Space Storage Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "EXR",
    "sector": "Kişisel Depolama Tesisleri",
    "basePrice": 158
  },
  {
    "symbol": "O",
    "name": "Realty Income Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "O",
    "sector": "Aylık Temettü Ödeyen Perakende GYO",
    "basePrice": 54
  },
  {
    "symbol": "NNN",
    "name": "NNN REIT Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "NNN",
    "sector": "Tek Kiracılı Net Kiralık Mülkler",
    "basePrice": 42.5
  },
  {
    "symbol": "SPG",
    "name": "Simon Property Group Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "SPG",
    "sector": "Lüks Alışveriş Merkezleri & Outletler",
    "basePrice": 174
  },
  {
    "symbol": "VICI",
    "name": "VICI Properties Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "VICI",
    "sector": "Las Vegas Casino & Otel Mülkleri",
    "basePrice": 32
  },
  {
    "symbol": "GLPI",
    "name": "Gaming and Leisure Properties",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "GLPI",
    "sector": "Kumarhane & Eğlence Gayrimenkulleri",
    "basePrice": 49
  },
  {
    "symbol": "WELL",
    "name": "Welltower Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "WELL",
    "sector": "Kıdemli Yaşam Evleri & Sağlık GYO",
    "basePrice": 134
  },
  {
    "symbol": "VTR",
    "name": "Ventas Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "VTR",
    "sector": "Sağlık Tesisleri & Yaşlı Bakım Evleri",
    "basePrice": 64
  },
  {
    "symbol": "AVB",
    "name": "AvalonBay Communities Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "AVB",
    "sector": "Lüks Çok Aileli Konut Daireleri",
    "basePrice": 228
  },
  {
    "symbol": "EQR",
    "name": "Equity Residential",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "EQR",
    "sector": "Şehir İçi Yüksek Kaliteli Apartmanlar",
    "basePrice": 74
  },
  {
    "symbol": "INVH",
    "name": "Invitation Homes Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "INVH",
    "sector": "Tek Aileli Kiralık Konut Portföyü",
    "basePrice": 34
  },
  {
    "symbol": "AMH",
    "name": "American Homes 4 Rent",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "AMH",
    "sector": "Kiralık Müstakil Evler",
    "basePrice": 38
  },
  {
    "symbol": "CPT",
    "name": "Camden Property Trust",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CPT",
    "sector": "Güneş Kuşağı Konut Toplulukları",
    "basePrice": 114
  },
  {
    "symbol": "MAA",
    "name": "Mid-America Apartment Communities",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "MAA",
    "sector": "Güneydoğu ABD Çok Aileli Konutlar",
    "basePrice": 158
  },
  {
    "symbol": "UDR",
    "name": "UDR Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "UDR",
    "sector": "Apartman Konut Geliştirme & Yönetim",
    "basePrice": 42
  },
  {
    "symbol": "BXP",
    "name": "BXP Inc. (Boston Properties)",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "BXP",
    "sector": "A Sınıfı Ofis Gökdelenleri GYO",
    "basePrice": 78
  },
  {
    "symbol": "KRC",
    "name": "Kilroy Realty Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "KRC",
    "sector": "Batı Yakası Ofis & Yaşam Bilimleri",
    "basePrice": 39
  },
  {
    "symbol": "ARE",
    "name": "Alexandria Real Estate Equities",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ARE",
    "sector": "Yaşam Bilimleri & Laboratuvar Kampüsleri",
    "basePrice": 108
  },
  {
    "symbol": "SBAC",
    "name": "SBA Communications Corp.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "SBAC",
    "sector": "Kablosuz İletişim Altyapısı",
    "basePrice": 225
  },
  {
    "symbol": "CBRE",
    "name": "CBRE Group Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CBRE",
    "sector": "Ticari Gayrimenkul Hizmetleri & Aracılık",
    "basePrice": 138
  },
  {
    "symbol": "JLL",
    "name": "Jones Lang LaSalle Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "JLL",
    "sector": "Küresel Emlak Danışmanlığı & Değerleme",
    "basePrice": 265
  },
  {
    "symbol": "CWK",
    "name": "Cushman & Wakefield plc",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CWK",
    "sector": "Gayrimenkul Yönetimi & Kiralama",
    "basePrice": 14.5
  },
  {
    "symbol": "ABT",
    "name": "Abbott Laboratories",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ABT",
    "sector": "Tanı, Tıbbi Cihazlar & Beslenme",
    "basePrice": 118
  },
  {
    "symbol": "ACGL",
    "name": "Arch Capital Group Ltd.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ACGL",
    "sector": "Özel Sigorta & Reasürans",
    "basePrice": 102
  },
  {
    "symbol": "AEE_US",
    "name": "Ameren Corporation Energy",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "AEE",
    "sector": "Bölgesel Elektrik & Gaz",
    "basePrice": 84
  },
  {
    "symbol": "AES",
    "name": "The AES Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "AES",
    "sector": "Küresel Enerji & Yenilenebilir",
    "basePrice": 14.2
  },
  {
    "symbol": "AJG",
    "name": "Arthur J. Gallagher & Co.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "AJG",
    "sector": "Sigorta Aracılığı & Risk Yönetimi",
    "basePrice": 295
  },
  {
    "symbol": "AKAM_US",
    "name": "Akamai Technologies",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "AKAM",
    "sector": "Güvenlik & CDN",
    "basePrice": 94.5
  },
  {
    "symbol": "ALGN",
    "name": "Align Technology Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ALGN",
    "sector": "Invisalign Şeffaf Plak & 3D Tarayıcı",
    "basePrice": 215
  },
  {
    "symbol": "AME",
    "name": "AMETEK Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "AME",
    "sector": "Elektronik Aletler & Elektromekanik",
    "basePrice": 184
  },
  {
    "symbol": "AMCR",
    "name": "Amcor plc",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "AMCR",
    "sector": "Küresel Ambalaj Çözümleri",
    "basePrice": 10.4
  },
  {
    "symbol": "ANSS",
    "name": "ANSYS Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ANSS",
    "sector": "Mühendislik Simülasyon Yazılımları",
    "basePrice": 340
  },
  {
    "symbol": "AOS",
    "name": "A. O. Smith Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "AOS",
    "sector": "Su Isıtıcıları & Kazan Sistemleri",
    "basePrice": 78
  },
  {
    "symbol": "APTV",
    "name": "Aptiv PLC",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "APTV",
    "sector": "Otomotiv Elektroniği & Otonom Sistemler",
    "basePrice": 68
  },
  {
    "symbol": "ATO",
    "name": "Atmos Energy Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ATO",
    "sector": "Doğalgaz Dağıtım Şebekesi",
    "basePrice": 142
  },
  {
    "symbol": "BALL",
    "name": "Ball Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "BALL",
    "sector": "Alüminyum İçecek Kutuları",
    "basePrice": 62
  },
  {
    "symbol": "BAX",
    "name": "Baxter International Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "BAX",
    "sector": "Diyaliz & Hastane Medikal Ürünleri",
    "basePrice": 34
  },
  {
    "symbol": "BBY_US",
    "name": "Best Buy Retail",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "BBY",
    "sector": "Tüketici Elektroniği",
    "basePrice": 91
  },
  {
    "symbol": "BEN",
    "name": "Franklin Resources Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "BEN",
    "sector": "Franklin Templeton Varlık Yönetimi",
    "basePrice": 22.4
  },
  {
    "symbol": "BIO",
    "name": "Bio-Rad Laboratories Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "BIO",
    "sector": "Yaşam Bilimi Araştırma & Klinik Tanı",
    "basePrice": 345
  },
  {
    "symbol": "BLDR",
    "name": "Builders FirstSource Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "BLDR",
    "sector": "Yapı Malzemeleri & Prefabrik Çözümler",
    "basePrice": 184
  },
  {
    "symbol": "BMRN",
    "name": "BioMarin Pharmaceutical",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "BMRN",
    "sector": "Nadir Genetik Hastalık Tedavileri",
    "basePrice": 68
  },
  {
    "symbol": "BR",
    "name": "Broadridge Financial Solutions",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "BR",
    "sector": "Yatırımcı İletişimi & Fintek",
    "basePrice": 224
  },
  {
    "symbol": "BRO",
    "name": "Brown & Brown Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "BRO",
    "sector": "Sigorta Aracılığı & Risk Yönetimi",
    "basePrice": 104
  },
  {
    "symbol": "BWA",
    "name": "BorgWarner Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "BWA",
    "sector": "Otomotiv Güç Aktarım & Turbo",
    "basePrice": 34
  },
  {
    "symbol": "CBOE",
    "name": "Cboe Global Markets Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CBOE",
    "sector": "Opsiyon & Volatilite Borsaları",
    "basePrice": 214
  },
  {
    "symbol": "CDW",
    "name": "CDW Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CDW",
    "sector": "Kurumsal BT Çözümleri & Donanım",
    "basePrice": 225
  },
  {
    "symbol": "CE",
    "name": "Celanese Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CE",
    "sector": "Özel Malzemeler & Kimyasallar",
    "basePrice": 82
  },
  {
    "symbol": "CINF",
    "name": "Cincinnati Financial Corp.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CINF",
    "sector": "Mülk & Kaza Sigortası",
    "basePrice": 142
  },
  {
    "symbol": "CLX",
    "name": "The Clorox Company",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CLX",
    "sector": "Temizlik & Tüketici Ürünleri",
    "basePrice": 165
  },
  {
    "symbol": "CMA",
    "name": "Comerica Incorporated",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CMA",
    "sector": "Ticari & Bireysel Bankacılık",
    "basePrice": 64
  },
  {
    "symbol": "CME",
    "name": "CME Group Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CME",
    "sector": "Dünyanın En Büyük Türev Borsası",
    "basePrice": 234
  },
  {
    "symbol": "CMS",
    "name": "CMS Energy Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CMS",
    "sector": "Michigan Elektrik & Gaz Hizmeti",
    "basePrice": 68
  },
  {
    "symbol": "CNP",
    "name": "CenterPoint Energy Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CNP",
    "sector": "Elektrik İletim & Gaz Dağıtımı",
    "basePrice": 31
  },
  {
    "symbol": "COO",
    "name": "The Cooper Companies Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "COO",
    "sector": "Kontakt Lensler & Kadın Sağlığı",
    "basePrice": 104
  },
  {
    "symbol": "CPAY",
    "name": "Corpay Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CPAY",
    "sector": "Kurumsal Ödemeler & Yakıt Kartları",
    "basePrice": 365
  },
  {
    "symbol": "CPB_US",
    "name": "Campbell Soup Products",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CPB",
    "sector": "Paketli Gıda Ürünleri",
    "basePrice": 43.5
  },
  {
    "symbol": "CPT_US",
    "name": "Camden Property",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CPT",
    "sector": "Çok Aileli Konutlar",
    "basePrice": 114.5
  },
  {
    "symbol": "CRL",
    "name": "Charles River Laboratories",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CRL",
    "sector": "İlaç Keşfi & Klinik Öncesi Test",
    "basePrice": 198
  },
  {
    "symbol": "CTRA",
    "name": "Coterra Energy Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CTRA",
    "sector": "Permian & Marcellus Petrol/Gaz",
    "basePrice": 26.5
  },
  {
    "symbol": "CZR",
    "name": "Caesars Entertainment Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "CZR",
    "sector": "Casino & Eğlence Merkezleri",
    "basePrice": 42
  },
  {
    "symbol": "DAY",
    "name": "Dayforce Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "DAY",
    "sector": "Bulut Bordro & İK Yönetimi",
    "basePrice": 74
  },
  {
    "symbol": "DECK_US",
    "name": "Deckers Brands",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "DECK",
    "sector": "Ayakkabı & Giyim",
    "basePrice": 198.5
  },
  {
    "symbol": "DFS",
    "name": "Discover Financial Services",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "DFS",
    "sector": "Kredi Kartı & Tüketici Bankacılığı",
    "basePrice": 168
  },
  {
    "symbol": "DGX",
    "name": "Quest Diagnostics Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "DGX",
    "sector": "Klinik Tanı & Laboratuvar Testleri",
    "basePrice": 158
  },
  {
    "symbol": "DHI",
    "name": "D.R. Horton Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "DHI",
    "sector": "Amerika'nın En Büyük Konut İnşaatçısı",
    "basePrice": 178
  },
  {
    "symbol": "DLR_US",
    "name": "Digital Realty",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "DLR",
    "sector": "Veri Merkezi GYO",
    "basePrice": 178.5
  },
  {
    "symbol": "DLTR_US",
    "name": "Dollar Tree Stores",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "DLTR",
    "sector": "İndirimli Perakende",
    "basePrice": 74.5
  },
  {
    "symbol": "DOC",
    "name": "Healthpeak Properties Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "DOC",
    "sector": "Sağlık Gayrimenkulleri & Laboratuvarlar",
    "basePrice": 21
  },
  {
    "symbol": "DOV",
    "name": "Dover Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "DOV",
    "sector": "Endüstriyel Ürünler & Mühendislik",
    "basePrice": 198
  },
  {
    "symbol": "DOW",
    "name": "Dow Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "DOW",
    "sector": "Temel Kimyasallar & Plastikler",
    "basePrice": 51
  },
  {
    "symbol": "DTE",
    "name": "DTE Energy Company",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "DTE",
    "sector": "Detroit Elektrik & Gaz Hizmeti",
    "basePrice": 124
  },
  {
    "symbol": "DXCM",
    "name": "DexCom Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "DXCM",
    "sector": "Sürekli Glikoz İzleme (CGM) Cihazları",
    "basePrice": 74
  },
  {
    "symbol": "EA_US",
    "name": "Electronic Arts Games",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "EA",
    "sector": "Video Oyunları & Eğlence",
    "basePrice": 162.5
  },
  {
    "symbol": "EBAY",
    "name": "eBay Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "EBAY",
    "sector": "Online Pazar Yeri & E-Ticaret",
    "basePrice": 64
  },
  {
    "symbol": "EG",
    "name": "Everest Group Ltd.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "EG",
    "sector": "Reasürans & Özel Sigorta",
    "basePrice": 385
  },
  {
    "symbol": "EMN",
    "name": "Eastman Chemical Company",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "EMN",
    "sector": "Özel Kimyasallar & Malzemeler",
    "basePrice": 104
  },
  {
    "symbol": "EPAM",
    "name": "EPAM Systems Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "EPAM",
    "sector": "Dijital Platform Mühendisliği",
    "basePrice": 234
  },
  {
    "symbol": "EQT",
    "name": "EQT Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "EQT",
    "sector": "ABD'nin En Büyük Doğalgaz Üreticisi",
    "basePrice": 44
  },
  {
    "symbol": "ERIE",
    "name": "Erie Indemnity Company",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ERIE",
    "sector": "Mülk & Kaza Sigorta Yönetimi",
    "basePrice": 412
  },
  {
    "symbol": "ESS",
    "name": "Essex Property Trust Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ESS",
    "sector": "Batı Yakası Konut Apartmanları",
    "basePrice": 295
  },
  {
    "symbol": "ETR_US",
    "name": "Entergy Power",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ETR",
    "sector": "Elektrik Üretimi & İletimi",
    "basePrice": 88.5
  },
  {
    "symbol": "EVRG",
    "name": "Evergy Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "EVRG",
    "sector": "Kansas & Missouri Elektrik Şebekesi",
    "basePrice": 61
  },
  {
    "symbol": "EW",
    "name": "Edwards Lifesciences Corp.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "EW",
    "sector": "Kalp Kapakçığı & Hemodinamik İzleme",
    "basePrice": 72
  },
  {
    "symbol": "EXPD",
    "name": "Expeditors International",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "EXPD",
    "sector": "Küresel Lojistik & Nakliye Aracılığı",
    "basePrice": 124
  },
  {
    "symbol": "EXPE_US",
    "name": "Expedia Travel Group",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "EXPE",
    "sector": "Online Seyahat Platformu",
    "basePrice": 178.5
  },
  {
    "symbol": "EXR_US",
    "name": "Extra Space REIT",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "EXR",
    "sector": "Kiralık Depolama",
    "basePrice": 158.5
  },
  {
    "symbol": "FDS",
    "name": "FactSet Research Systems",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "FDS",
    "sector": "Finansal Veri & Analitik Terminali",
    "basePrice": 485
  },
  {
    "symbol": "FE_US",
    "name": "FirstEnergy Ohio",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "FE",
    "sector": "Elektrik Dağıtım Ağı",
    "basePrice": 42.5
  },
  {
    "symbol": "FFIV_US",
    "name": "F5 Networks",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "FFIV",
    "sector": "Siber Güvenlik & Uygulama Dağıtım",
    "basePrice": 242.5
  },
  {
    "symbol": "FICO",
    "name": "Fair Isaac Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "FICO",
    "sector": "FICO Kredi Puanlama & Karar Analitiği",
    "basePrice": 2140
  },
  {
    "symbol": "FMC_US",
    "name": "FMC Agrochemical",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "FMC",
    "sector": "Tarım Kimyasalları",
    "basePrice": 58.5
  },
  {
    "symbol": "FOX",
    "name": "Fox Corporation (Class B)",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "FOX",
    "sector": "Haber & Canlı Spor Yayıncılığı",
    "basePrice": 42
  },
  {
    "symbol": "FOXA",
    "name": "Fox Corporation (Class A)",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "FOXA",
    "sector": "Haber & Eğlence Medyası",
    "basePrice": 44
  },
  {
    "symbol": "FRT",
    "name": "Federal Realty Investment Trust",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "FRT",
    "sector": "Lüks AVM & Karma Yaşam GYO",
    "basePrice": 108
  },
  {
    "symbol": "FSLR_US",
    "name": "First Solar Panels",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "FSLR",
    "sector": "Güneş Paneli Üretimi",
    "basePrice": 198.5
  },
  {
    "symbol": "FTNT_US",
    "name": "Fortinet Network Security",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "FTNT",
    "sector": "Güvenlik Duvarı & SASE",
    "basePrice": 96.5
  },
  {
    "symbol": "FTV",
    "name": "Fortive Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "FTV",
    "sector": "Endüstriyel Teknoloji & Ölçüm Cihazları",
    "basePrice": 78
  },
  {
    "symbol": "GD_US",
    "name": "General Dynamics Defense",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "GD",
    "sector": "Savunma Sanayi & Denizaltı",
    "basePrice": 302.5
  },
  {
    "symbol": "GEHC_US",
    "name": "GE HealthCare Imaging",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "GEHC",
    "sector": "Medikal Cihazlar & Tanı",
    "basePrice": 88.5
  },
  {
    "symbol": "GEN_US",
    "name": "Gen Digital Cyber",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "GEN",
    "sector": "Tüketici Güvenlik Yazılımı",
    "basePrice": 28.6
  },
  {
    "symbol": "GL",
    "name": "Globe Life Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "GL",
    "sector": "Hayat ve Ek Sağlık Sigortası",
    "basePrice": 108
  },
  {
    "symbol": "GLW",
    "name": "Corning Incorporated",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "GLW",
    "sector": "Özel Cam, Seramik & Gorilla Glass",
    "basePrice": 48
  },
  {
    "symbol": "GPC",
    "name": "Genuine Parts Company",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "GPC",
    "sector": "NAPA Otomotiv & Sanayi Yedek Parça",
    "basePrice": 128
  },
  {
    "symbol": "GPN",
    "name": "Global Payments Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "GPN",
    "sector": "Ticari Ödeme İşleme Teknolojileri",
    "basePrice": 104
  },
  {
    "symbol": "GRMN",
    "name": "Garmin Ltd.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "GRMN",
    "sector": "GPS Navigasyon, Akıllı Saat & Havacılık",
    "basePrice": 212
  },
  {
    "symbol": "GWW",
    "name": "W.W. Grainger Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "GWW",
    "sector": "Bakım, Onarım & İşletme (MRO) Tedarik",
    "basePrice": 1040
  },
  {
    "symbol": "HES_US",
    "name": "Hess Oil & Gas",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "HES",
    "sector": "Derin Deniz Petrol Üretimi",
    "basePrice": 148.5
  },
  {
    "symbol": "HIG",
    "name": "The Hartford Financial Services",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "HIG",
    "sector": "Mülk, Kaza & Grup Yan Hakları Sigortası",
    "basePrice": 118
  },
  {
    "symbol": "HII",
    "name": "Huntington Ingalls Industries",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "HII",
    "sector": "Nükleer Askeri Gemi & Denizaltı İnşası",
    "basePrice": 242
  },
  {
    "symbol": "HOLX",
    "name": "Hologic Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "HOLX",
    "sector": "Kadın Sağlığı & Mamografi Teşhis",
    "basePrice": 78
  },
  {
    "symbol": "HON_US",
    "name": "Honeywell Aerospace",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "HON",
    "sector": "Havacılık & Otomasyon",
    "basePrice": 225.5
  },
  {
    "symbol": "HPE_US",
    "name": "Hewlett Packard Servers",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "HPE",
    "sector": "Kurumsal Bulut & Sunucu",
    "basePrice": 21.6
  },
  {
    "symbol": "HPQ_US",
    "name": "HP Personal Systems",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "HPQ",
    "sector": "PC & Yazıcı Donanımı",
    "basePrice": 36.6
  },
  {
    "symbol": "HRL_US",
    "name": "Hormel Foods Meat",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "HRL",
    "sector": "Paketli Et & Gıda",
    "basePrice": 31.2
  },
  {
    "symbol": "HSIC",
    "name": "Henry Schein Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "HSIC",
    "sector": "Diş & Medikal Sağlık Malzemeleri",
    "basePrice": 74
  },
  {
    "symbol": "HST",
    "name": "Host Hotels & Resorts Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "HST",
    "sector": "Lüks Otel & Tatil Köyü GYO",
    "basePrice": 18.2
  },
  {
    "symbol": "HUBB",
    "name": "Hubbell Incorporated",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "HUBB",
    "sector": "Elektrik ve Şebeke Altyapı Ürünleri",
    "basePrice": 435
  },
  {
    "symbol": "HUM",
    "name": "Humana Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "HUM",
    "sector": "Medicare Sağlık Sigortası & Bakım",
    "basePrice": 278
  },
  {
    "symbol": "HWM",
    "name": "Howmet Aerospace Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "HWM",
    "sector": "Havacılık Motor Parçaları & Titanyum",
    "basePrice": 114
  },
  {
    "symbol": "IBM_US",
    "name": "IBM Cloud & AI",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "IBM",
    "sector": "Kurumsal Bilişim",
    "basePrice": 228.5
  },
  {
    "symbol": "IDXX",
    "name": "IDEXX Laboratories Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "IDXX",
    "sector": "Veterinerlik Tanı & Hayvan Sağlığı",
    "basePrice": 440
  },
  {
    "symbol": "IEX",
    "name": "IDEX Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "IEX",
    "sector": "Akışkan Kontrol & Hassas Pompalar",
    "basePrice": 218
  },
  {
    "symbol": "IFF",
    "name": "International Flavors & Fragrances",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "IFF",
    "sector": "Tatlar, Kokular & Biyo-malzemeler",
    "basePrice": 88
  },
  {
    "symbol": "INCY",
    "name": "Incyte Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "INCY",
    "sector": "Biyofarmasötik & Hematoloji İlaçları",
    "basePrice": 72
  },
  {
    "symbol": "INSM",
    "name": "Insmed Incorporated",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "INSM",
    "sector": "Nadir Akciğer Hastalıkları Tedavisi",
    "basePrice": 74
  },
  {
    "symbol": "IP",
    "name": "International Paper Company",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "IP",
    "sector": "Endüstriyel Ambalaj & Selüloz",
    "basePrice": 54
  },
  {
    "symbol": "IPG",
    "name": "The Interpublic Group of Companies",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "IPG",
    "sector": "Küresel Reklamcılık & Pazarlama",
    "basePrice": 29.5
  },
  {
    "symbol": "IQV",
    "name": "IQVIA Holdings Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "IQV",
    "sector": "Klinik Araştırma & Sağlık Verisi Analitiği",
    "basePrice": 215
  },
  {
    "symbol": "IR",
    "name": "Ingersoll Rand Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "IR",
    "sector": "Endüstriyel Kompresör & Hava Sistemleri",
    "basePrice": 98
  },
  {
    "symbol": "IRM",
    "name": "Iron Mountain Incorporated",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "IRM",
    "sector": "Veri Depolama & Bilgi Yönetimi GYO",
    "basePrice": 114
  },
  {
    "symbol": "ISRG_US",
    "name": "Intuitive Surgical Robot",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ISRG",
    "sector": "Robotik Ameliyat Sistemleri",
    "basePrice": 535.5
  },
  {
    "symbol": "IT",
    "name": "Gartner Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "IT",
    "sector": "BT & Teknoloji Pazar Araştırması",
    "basePrice": 525
  },
  {
    "symbol": "ITT",
    "name": "ITT Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "ITT",
    "sector": "Mühendislik Kritik Bileşenleri",
    "basePrice": 148
  },
  {
    "symbol": "JBHT",
    "name": "J.B. Hunt Transport Services",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "JBHT",
    "sector": "Intermodal Taşımacılık & Kamyon Filosu",
    "basePrice": 178
  },
  {
    "symbol": "JKHY",
    "name": "Jack Henry & Associates Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "JKHY",
    "sector": "Bankacılık & Fintek Yazılımları",
    "basePrice": 178
  },
  {
    "symbol": "JNJ_US",
    "name": "Johnson & Johnson Healthcare",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "JNJ",
    "sector": "İlaç & Sağlık",
    "basePrice": 158.5
  },
  {
    "symbol": "JNPR_US",
    "name": "Juniper AI Networks",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "JNPR",
    "sector": "Ağ Altyapısı",
    "basePrice": 38.2
  },
  {
    "symbol": "JPM_US",
    "name": "JPMorgan Chase Bank",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "JPM",
    "sector": "Bankacılık & Finans",
    "basePrice": 248.5
  },
  {
    "symbol": "K_US",
    "name": "Kellanova Snacks",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "K",
    "sector": "Atıştırmalık Gıda",
    "basePrice": 81.2
  },
  {
    "symbol": "KDP_US",
    "name": "Keurig Dr Pepper Beverages",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "KDP",
    "sector": "Kahve & İçecekler",
    "basePrice": 34.2
  },
  {
    "symbol": "KEY_US",
    "name": "KeyCorp Banking",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "KEY",
    "sector": "Ticari Bankacılık",
    "basePrice": 18.6
  },
  {
    "symbol": "KEYS_US",
    "name": "Keysight Test Systems",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "KEYS",
    "sector": "Elektronik Test Ekipmanı",
    "basePrice": 162.5
  },
  {
    "symbol": "KIM",
    "name": "Kimco Realty Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "KIM",
    "sector": "Açık Hava Alışveriş Merkezleri GYO",
    "basePrice": 23.5
  },
  {
    "symbol": "KKR",
    "name": "KKR & Co. Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "KKR",
    "sector": "Özel Sermaye (Private Equity) & Varlık",
    "basePrice": 152
  },
  {
    "symbol": "KLAC_US",
    "name": "KLA Semiconductor Inspection",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "KLAC",
    "sector": "Yarı İletken Denetim",
    "basePrice": 665.5
  },
  {
    "symbol": "KMB_US",
    "name": "Kimberly-Clark Hygiene",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "KMB",
    "sector": "Kişisel Bakım",
    "basePrice": 138.5
  },
  {
    "symbol": "KMI_US",
    "name": "Kinder Morgan Pipeline",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "KMI",
    "sector": "Enerji Boru Hatları",
    "basePrice": 26.6
  },
  {
    "symbol": "KMX",
    "name": "CarMax Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "KMX",
    "sector": "İkinci El Otomobil Perakende Lideri",
    "basePrice": 78
  },
  {
    "symbol": "KO_US",
    "name": "Coca-Cola Beverage",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "KO",
    "sector": "Meşrubat Sanayi",
    "basePrice": 64.6
  },
  {
    "symbol": "KR_US",
    "name": "Kroger Supermarkets",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "KR",
    "sector": "Perakende Market",
    "basePrice": 58.2
  },
  {
    "symbol": "L",
    "name": "Loews Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "L",
    "sector": "Mülk Sigortası & Enerji Taşımacılığı",
    "basePrice": 84
  },
  {
    "symbol": "LDOS",
    "name": "Leidos Holdings Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "LDOS",
    "sector": "Savunma, İstihbarat & Bilişim",
    "basePrice": 178
  },
  {
    "symbol": "LEN",
    "name": "Lennar Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "LEN",
    "sector": "Konut Geliştirme & İnşaat",
    "basePrice": 168
  },
  {
    "symbol": "LH",
    "name": "Laboratory Corp. of America (LabCorp)",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "LH",
    "sector": "Klinik Laboratuvar & Tanı Hizmetleri",
    "basePrice": 235
  },
  {
    "symbol": "LHX",
    "name": "L3Harris Technologies Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "LHX",
    "sector": "Savunma Elektroniği, İletişim & C4ISR",
    "basePrice": 248
  },
  {
    "symbol": "LIN_US",
    "name": "Linde Industrial Gas",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "LIN",
    "sector": "Endüstriyel Gazlar",
    "basePrice": 455.5
  },
  {
    "symbol": "LKQ",
    "name": "LKQ Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "LKQ",
    "sector": "Geri Dönüşümlü & Yan Sanayi Oto Parçası",
    "basePrice": 38
  },
  {
    "symbol": "LLY_US",
    "name": "Eli Lilly Pharma",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "LLY",
    "sector": "İlaç & Biyoteknoloji",
    "basePrice": 785.5
  },
  {
    "symbol": "LNT",
    "name": "Alliant Energy Corporation",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "LNT",
    "sector": "Elektrik & Doğalgaz Kamu Hizmeti",
    "basePrice": 61
  },
  {
    "symbol": "LRCX_US",
    "name": "Lam Research Semiconductor",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "LRCX",
    "sector": "Çip Üretim Ekipmanı",
    "basePrice": 78.6
  },
  {
    "symbol": "LULU_US",
    "name": "Lululemon Athletic Apparel",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "LULU",
    "sector": "Spor Giyim & Moda",
    "basePrice": 345.5
  },
  {
    "symbol": "LUV_US",
    "name": "Southwest Airlines Flight",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "LUV",
    "sector": "Havacılık",
    "basePrice": 32.2
  },
  {
    "symbol": "LVS_US",
    "name": "Las Vegas Sands Casino",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "LVS",
    "sector": "Casino & Konaklama",
    "basePrice": 54.2
  },
  {
    "symbol": "LW",
    "name": "Lamb Weston Holdings Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "LW",
    "sector": "Dondurulmuş Patates Ürünleri",
    "basePrice": 78
  },
  {
    "symbol": "LYB",
    "name": "LyondellBasell Industries N.V.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "LYB",
    "sector": "Plastik, Kimyasallar & Polimerler",
    "basePrice": 88
  },
  {
    "symbol": "LYV",
    "name": "Live Nation Entertainment Inc.",
    "exchange": "NASDAQ/NYSE",
    "category": "US_STOCKS",
    "currency": "$",
    "yahooTicker": "LYV",
    "sector": "Canlı Müzik Konserleri & Ticketmaster",
    "basePrice": 128
  }
];
