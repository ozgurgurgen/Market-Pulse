export interface StockDefinition {
  symbol: string;
  name: string;
  exchange: string;
  category: 'BIST';
  currency: '₺';
  yahooTicker: string;
  sector: string;
  basePrice: number;
}

// BIST 300+ Hisse Senedi Takip Havuzu (Gerçek BIST Şirketleri)
export const BIST_300_STOCKS: StockDefinition[] = [
  {
    "symbol": "THYAO",
    "name": "Türk Hava Yolları",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "THYAO.IS",
    "sector": "Havacılık",
    "basePrice": 308.5
  },
  {
    "symbol": "ASELS",
    "name": "Aselsan Savunma Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ASELS.IS",
    "sector": "Savunma Sanayi",
    "basePrice": 72.8
  },
  {
    "symbol": "TUPRS",
    "name": "Tüpraş Petrol Rafinerileri",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TUPRS.IS",
    "sector": "Enerji & Petrol",
    "basePrice": 154.6
  },
  {
    "symbol": "KCHOL",
    "name": "Koç Holding",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KCHOL.IS",
    "sector": "Holding",
    "basePrice": 202.4
  },
  {
    "symbol": "EREGL",
    "name": "Ereğli Demir Çelik",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "EREGL.IS",
    "sector": "Demir Çelik",
    "basePrice": 49.6
  },
  {
    "symbol": "BIMAS",
    "name": "BİM Birleşik Mağazalar",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "BIMAS.IS",
    "sector": "Perakende",
    "basePrice": 486
  },
  {
    "symbol": "SISE",
    "name": "Şişecam Cam Sanayii",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SISE.IS",
    "sector": "Cam & Sanayi",
    "basePrice": 47.3
  },
  {
    "symbol": "AKBNK",
    "name": "Akbank T.A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "AKBNK.IS",
    "sector": "Bankacılık",
    "basePrice": 58.9
  },
  {
    "symbol": "GARAN",
    "name": "Garanti BBVA",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "GARAN.IS",
    "sector": "Bankacılık",
    "basePrice": 114.8
  },
  {
    "symbol": "YKBNK",
    "name": "Yapı ve Kredi Bankası",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "YKBNK.IS",
    "sector": "Bankacılık",
    "basePrice": 32.9
  },
  {
    "symbol": "ISCTR",
    "name": "Türkiye İş Bankası (C)",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ISCTR.IS",
    "sector": "Bankacılık",
    "basePrice": 14.75
  },
  {
    "symbol": "SAHOL",
    "name": "Sabancı Holding",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SAHOL.IS",
    "sector": "Holding",
    "basePrice": 94.5
  },
  {
    "symbol": "FROTO",
    "name": "Ford Otomotiv Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "FROTO.IS",
    "sector": "Otomotiv",
    "basePrice": 1130
  },
  {
    "symbol": "PGSUS",
    "name": "Pegasus Hava Taşımacılığı",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "PGSUS.IS",
    "sector": "Havacılık",
    "basePrice": 239
  },
  {
    "symbol": "TOASO",
    "name": "Tofaş Türk Otomobil Fabrikası",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TOASO.IS",
    "sector": "Otomotiv",
    "basePrice": 245
  },
  {
    "symbol": "TCELL",
    "name": "Turkcell İletişim Hizmetleri",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TCELL.IS",
    "sector": "Telekomünikasyon",
    "basePrice": 98.4
  },
  {
    "symbol": "TTKOM",
    "name": "Türk Telekomünikasyon",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TTKOM.IS",
    "sector": "Telekomünikasyon",
    "basePrice": 52.6
  },
  {
    "symbol": "ENKAI",
    "name": "Enka İnşaat ve Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ENKAI.IS",
    "sector": "İnşaat & Taahhüt",
    "basePrice": 46.8
  },
  {
    "symbol": "EKGYO",
    "name": "Emlak Konut Gayrimenkul Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "EKGYO.IS",
    "sector": "Gayrimenkul",
    "basePrice": 11.85
  },
  {
    "symbol": "PETKM",
    "name": "Petkim Petrokimya Holding",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "PETKM.IS",
    "sector": "Kimya & Petrokimya",
    "basePrice": 21.4
  },
  {
    "symbol": "ASTOR",
    "name": "Astor Enerji A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ASTOR.IS",
    "sector": "Enerji & Ekipman",
    "basePrice": 96.2
  },
  {
    "symbol": "KONTG",
    "name": "Kontrolmatik Teknoloji Enerji",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KONTG.IS",
    "sector": "Teknoloji & Enerji",
    "basePrice": 58.4
  },
  {
    "symbol": "SASA",
    "name": "SASA Polyester Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SASA.IS",
    "sector": "Kimya & Tekstil",
    "basePrice": 4.85
  },
  {
    "symbol": "HEKTS",
    "name": "Hektaş Ticaret T.A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "HEKTS.IS",
    "sector": "Tarım & Kimya",
    "basePrice": 3.95
  },
  {
    "symbol": "CCOLA",
    "name": "Coca-Cola İçecek A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "CCOLA.IS",
    "sector": "Gıda & İçecek",
    "basePrice": 68.5
  },
  {
    "symbol": "MGROS",
    "name": "Migros Ticaret A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MGROS.IS",
    "sector": "Perakende",
    "basePrice": 512
  },
  {
    "symbol": "KOZAL",
    "name": "Koza Altın İşletmeleri",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KOZAL.IS",
    "sector": "Madencilik",
    "basePrice": 23.4
  },
  {
    "symbol": "KOZAA",
    "name": "Koza Anadolu Metal Madencilik",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KOZAA.IS",
    "sector": "Madencilik",
    "basePrice": 62.5
  },
  {
    "symbol": "IPEKE",
    "name": "İpek Doğal Enerji Kaynakları",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "IPEKE.IS",
    "sector": "Madencilik & Enerji",
    "basePrice": 44.8
  },
  {
    "symbol": "ALARK",
    "name": "Alarko Holding",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ALARK.IS",
    "sector": "Holding & Enerji",
    "basePrice": 104.2
  },
  {
    "symbol": "ARCLK",
    "name": "Arçelik A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ARCLK.IS",
    "sector": "Dayanıklı Tüketim",
    "basePrice": 162
  },
  {
    "symbol": "VESTL",
    "name": "Vestel Elektronik Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "VESTL.IS",
    "sector": "Elektronik & Tüketim",
    "basePrice": 78.4
  },
  {
    "symbol": "VESBE",
    "name": "Vestel Beyaz Eşya Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "VESBE.IS",
    "sector": "Dayanıklı Tüketim",
    "basePrice": 21.6
  },
  {
    "symbol": "OYAKC",
    "name": "OYAK Çimento Fabrikaları",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "OYAKC.IS",
    "sector": "Çimento & Yapı",
    "basePrice": 68.3
  },
  {
    "symbol": "CIMSA",
    "name": "Çimsa Çimento Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "CIMSA.IS",
    "sector": "Çimento & Yapı",
    "basePrice": 35.8
  },
  {
    "symbol": "AKCNS",
    "name": "Akçansa Çimento Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "AKCNS.IS",
    "sector": "Çimento & Yapı",
    "basePrice": 158
  },
  {
    "symbol": "SOKM",
    "name": "Şok Marketler Ticaret",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SOKM.IS",
    "sector": "Perakende",
    "basePrice": 51.5
  },
  {
    "symbol": "BIZIM",
    "name": "Bizim Toptan Satış Mağazaları",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "BIZIM.IS",
    "sector": "Perakende",
    "basePrice": 39.2
  },
  {
    "symbol": "TAVHL",
    "name": "TAV Havalimanları Holding",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TAVHL.IS",
    "sector": "Havacılık & Liman",
    "basePrice": 242
  },
  {
    "symbol": "CLEBI",
    "name": "Çelebi Hava Servisi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "CLEBI.IS",
    "sector": "Havacılık Hizmetleri",
    "basePrice": 1840
  },
  {
    "symbol": "GUBRF",
    "name": "Gübre Fabrikaları T.A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "GUBRF.IS",
    "sector": "Tarım & Gübre",
    "basePrice": 178
  },
  {
    "symbol": "BAGFS",
    "name": "Bağfaş Bandırma Gübre Fabrikaları",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "BAGFS.IS",
    "sector": "Tarım & Gübre",
    "basePrice": 28.5
  },
  {
    "symbol": "EGEEN",
    "name": "Ege Endüstri ve Ticaret",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "EGEEN.IS",
    "sector": "Otomotiv Yan Sanayi",
    "basePrice": 12450
  },
  {
    "symbol": "BRISA",
    "name": "Brisa Bridgestone Lastik Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "BRISA.IS",
    "sector": "Otomotiv & Lastik",
    "basePrice": 118
  },
  {
    "symbol": "GOODY",
    "name": "Goodyear Lastikleri T.A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "GOODY.IS",
    "sector": "Otomotiv & Lastik",
    "basePrice": 22.4
  },
  {
    "symbol": "OTKAR",
    "name": "Otokar Otomotiv ve Savunma",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "OTKAR.IS",
    "sector": "Otomotiv & Savunma",
    "basePrice": 525
  },
  {
    "symbol": "DOAS",
    "name": "Doğuş Otomotiv Servis",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "DOAS.IS",
    "sector": "Otomotiv & Dağıtım",
    "basePrice": 284
  },
  {
    "symbol": "TMSN",
    "name": "Tümosan Motor ve Traktör",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TMSN.IS",
    "sector": "Otomotiv & Makine",
    "basePrice": 126
  },
  {
    "symbol": "KARSN",
    "name": "Karsan Otomotiv Sanayii",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KARSN.IS",
    "sector": "Otomotiv & Ulaşım",
    "basePrice": 12.8
  },
  {
    "symbol": "ASUZU",
    "name": "Anadolu Isuzu Otomotiv",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ASUZU.IS",
    "sector": "Otomotiv & Ticari Araç",
    "basePrice": 212
  },
  {
    "symbol": "KRDMD",
    "name": "Kardemir Karabük Demir Çelik (D)",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KRDMD.IS",
    "sector": "Demir Çelik",
    "basePrice": 27.8
  },
  {
    "symbol": "KRDMA",
    "name": "Kardemir Karabük Demir Çelik (A)",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KRDMA.IS",
    "sector": "Demir Çelik",
    "basePrice": 25.4
  },
  {
    "symbol": "KRDMB",
    "name": "Kardemir Karabük Demir Çelik (B)",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KRDMB.IS",
    "sector": "Demir Çelik",
    "basePrice": 24.6
  },
  {
    "symbol": "CEMTS",
    "name": "Çemtaş Çelik Makina Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "CEMTS.IS",
    "sector": "Demir Çelik & Makine",
    "basePrice": 11.9
  },
  {
    "symbol": "BUCIM",
    "name": "Bursa Çimento Fabrikası",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "BUCIM.IS",
    "sector": "Çimento & Yapı",
    "basePrice": 8.45
  },
  {
    "symbol": "NUHCM",
    "name": "Nuh Çimento Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "NUHCM.IS",
    "sector": "Çimento & Yapı",
    "basePrice": 315
  },
  {
    "symbol": "AFYON",
    "name": "Afyon Çimento Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "AFYON.IS",
    "sector": "Çimento & Yapı",
    "basePrice": 13.8
  },
  {
    "symbol": "BTCIM",
    "name": "Batıçim Batı Anadolu Çimento",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "BTCIM.IS",
    "sector": "Çimento & Yapı",
    "basePrice": 142
  },
  {
    "symbol": "CANTE",
    "name": "Çan2 Termik A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "CANTE.IS",
    "sector": "Enerji & Üretim",
    "basePrice": 16.5
  },
  {
    "symbol": "ODAS",
    "name": "Odaş Elektrik Üretim",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ODAS.IS",
    "sector": "Enerji & Madencilik",
    "basePrice": 7.95
  },
  {
    "symbol": "AKSEN",
    "name": "Aksa Enerji Üretim",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "AKSEN.IS",
    "sector": "Enerji & Üretim",
    "basePrice": 41.6
  },
  {
    "symbol": "ZOREN",
    "name": "Zorlu Enerji Elektrik Üretim",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ZOREN.IS",
    "sector": "Enerji & Yenilenebilir",
    "basePrice": 4.85
  },
  {
    "symbol": "GWIND",
    "name": "Galata Wind Enerji A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "GWIND.IS",
    "sector": "Yenilenebilir Enerji",
    "basePrice": 28.9
  },
  {
    "symbol": "ENJSA",
    "name": "Enerjisa Enerji A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ENJSA.IS",
    "sector": "Enerji Dağıtım",
    "basePrice": 63.4
  },
  {
    "symbol": "AKENR",
    "name": "Akenerji Elektrik Üretim",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "AKENR.IS",
    "sector": "Enerji & Üretim",
    "basePrice": 17.2
  },
  {
    "symbol": "CWENE",
    "name": "CW Enerji Mühendislik",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "CWENE.IS",
    "sector": "Güneş Enerjisi & Teknoloji",
    "basePrice": 210
  },
  {
    "symbol": "EUPWR",
    "name": "Europower Enerji ve Otomasyon",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "EUPWR.IS",
    "sector": "Elektrik & Otomasyon",
    "basePrice": 92.5
  },
  {
    "symbol": "ALFAS",
    "name": "Alfa Solar Enerji Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ALFAS.IS",
    "sector": "Güneş Enerjisi",
    "basePrice": 74.8
  },
  {
    "symbol": "KOPOL",
    "name": "Koza Polyester Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KOPOL.IS",
    "sector": "Kimya & Tekstil",
    "basePrice": 42.5
  },
  {
    "symbol": "SDTTR",
    "name": "SDT Uzay ve Savunma Teknolojileri",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SDTTR.IS",
    "sector": "Savunma & Uzay",
    "basePrice": 285
  },
  {
    "symbol": "MIATK",
    "name": "Mia Teknoloji A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MIATK.IS",
    "sector": "Yazılım & Bilişim",
    "basePrice": 58.2
  },
  {
    "symbol": "REEDR",
    "name": "Reeder Teknoloji Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "REEDR.IS",
    "sector": "Elektronik & Teknoloji",
    "basePrice": 23.9
  },
  {
    "symbol": "VBTYZ",
    "name": "VBT Yazılım A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "VBTYZ.IS",
    "sector": "Yazılım & Bilişim",
    "basePrice": 38.6
  },
  {
    "symbol": "ARDYZ",
    "name": "Ard Grup Bilişim Teknolojileri",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ARDYZ.IS",
    "sector": "Bilişim Teknolojileri",
    "basePrice": 46.2
  },
  {
    "symbol": "PAPIL",
    "name": "Papilon Savunma Güvenlik",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "PAPIL.IS",
    "sector": "Biyometri & Savunma",
    "basePrice": 94
  },
  {
    "symbol": "AGESA",
    "name": "Agesa Hayat ve Emeklilik",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "AGESA.IS",
    "sector": "Sigortacılık",
    "basePrice": 118
  },
  {
    "symbol": "ANSGR",
    "name": "Anadolu Anonim Türk Sigorta",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ANSGR.IS",
    "sector": "Sigortacılık",
    "basePrice": 96.5
  },
  {
    "symbol": "AKGRT",
    "name": "Aksigorta A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "AKGRT.IS",
    "sector": "Sigortacılık",
    "basePrice": 8.2
  },
  {
    "symbol": "TURSG",
    "name": "Türkiye Sigorta A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TURSG.IS",
    "sector": "Sigortacılık",
    "basePrice": 64
  },
  {
    "symbol": "ANHYT",
    "name": "Anadolu Hayat Emeklilik",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ANHYT.IS",
    "sector": "Sigortacılık",
    "basePrice": 98
  },
  {
    "symbol": "ISGYO",
    "name": "İş Gayrimenkul Yatırım Ortaklığı",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ISGYO.IS",
    "sector": "Gayrimenkul",
    "basePrice": 16.4
  },
  {
    "symbol": "TRGYO",
    "name": "Torunlar Gayrimenkul Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TRGYO.IS",
    "sector": "Gayrimenkul",
    "basePrice": 48.6
  },
  {
    "symbol": "OZKGY",
    "name": "Özak Gayrimenkul Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "OZKGY.IS",
    "sector": "Gayrimenkul",
    "basePrice": 10.2
  },
  {
    "symbol": "DGGYO",
    "name": "Doğuş Gayrimenkul Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "DGGYO.IS",
    "sector": "Gayrimenkul",
    "basePrice": 52
  },
  {
    "symbol": "SNGYO",
    "name": "Sinpaş Gayrimenkul Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SNGYO.IS",
    "sector": "Gayrimenkul",
    "basePrice": 4.6
  },
  {
    "symbol": "KLGYO",
    "name": "Kiler Gayrimenkul Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KLGYO.IS",
    "sector": "Gayrimenkul",
    "basePrice": 4.9
  },
  {
    "symbol": "HLGYO",
    "name": "Halk Gayrimenkul Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "HLGYO.IS",
    "sector": "Gayrimenkul",
    "basePrice": 5.4
  },
  {
    "symbol": "VAKKO",
    "name": "Vakko Tekstil ve Hazır Giyim",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "VAKKO.IS",
    "sector": "Tekstil & Lüks Giyim",
    "basePrice": 94
  },
  {
    "symbol": "MAVI",
    "name": "Mavi Giyim Sanayi ve Ticaret",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MAVI.IS",
    "sector": "Tekstil & Moda",
    "basePrice": 92.5
  },
  {
    "symbol": "YATAS",
    "name": "Yataş Yatak ve Yorgan Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "YATAS.IS",
    "sector": "Mobilya & Tekstil",
    "basePrice": 34.8
  },
  {
    "symbol": "DESA",
    "name": "Desa Deri Sanayi ve Ticaret",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "DESA.IS",
    "sector": "Deri & Moda",
    "basePrice": 21.4
  },
  {
    "symbol": "DERIM",
    "name": "Derimod Konfeksiyon Ayakkabı",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "DERIM.IS",
    "sector": "Deri & Ayakkabı",
    "basePrice": 36.8
  },
  {
    "symbol": "BRKO",
    "name": "Birko Birleşik Koyunlular Mensucat",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "BRKO.IS",
    "sector": "Tekstil",
    "basePrice": 7.4
  },
  {
    "symbol": "SKBNK",
    "name": "Şekerbank T.A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SKBNK.IS",
    "sector": "Bankacılık",
    "basePrice": 4.95
  },
  {
    "symbol": "TSKB",
    "name": "Türkiye Sınai Kalkınma Bankası",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TSKB.IS",
    "sector": "Bankacılık",
    "basePrice": 12.8
  },
  {
    "symbol": "ALBRK",
    "name": "Albaraka Türk Katılım Bankası",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ALBRK.IS",
    "sector": "Katılım Bankacılığı",
    "basePrice": 5.85
  },
  {
    "symbol": "SELEC",
    "name": "Selçuk Ecza Deposu Ticaret",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SELEC.IS",
    "sector": "İlaç Dağıtım",
    "basePrice": 64.5
  },
  {
    "symbol": "LOGO",
    "name": "Logo Yazılım Sanayi ve Ticaret",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "LOGO.IS",
    "sector": "Kurumsal Yazılım",
    "basePrice": 96
  },
  {
    "symbol": "NETAS",
    "name": "Netaş Telekomünikasyon",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "NETAS.IS",
    "sector": "Telekom Altyapı",
    "basePrice": 72
  },
  {
    "symbol": "INDES",
    "name": "İndeks Bilgisayar Sistemleri",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "INDES.IS",
    "sector": "Bilişim Dağıtım",
    "basePrice": 8.9
  },
  {
    "symbol": "ARENA",
    "name": "Arena Bilgisayar Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ARENA.IS",
    "sector": "Bilişim Dağıtım",
    "basePrice": 42
  },
  {
    "symbol": "DGATE",
    "name": "Datagate Bilgisayar Malzemeleri",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "DGATE.IS",
    "sector": "Bilişim Ekipmanları",
    "basePrice": 39.5
  },
  {
    "symbol": "PKART",
    "name": "Plastikkart Akıllı Kart İletişim",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "PKART.IS",
    "sector": "Akıllı Kart Teknolojileri",
    "basePrice": 124
  },
  {
    "symbol": "LINK",
    "name": "Link Bilgisayar Sistemleri",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "LINK.IS",
    "sector": "Yazılım & ERP",
    "basePrice": 485
  },
  {
    "symbol": "DESPC",
    "name": "Despec Bilgisayar Pazarlama",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "DESPC.IS",
    "sector": "Bilişim Sarf Malzemeleri",
    "basePrice": 41.5
  },
  {
    "symbol": "FONET",
    "name": "Fonet Bilgi Teknolojileri",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "FONET.IS",
    "sector": "Sağlık Bilişimi",
    "basePrice": 26.8
  },
  {
    "symbol": "SMART",
    "name": "Smartiks Yazılım A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SMART.IS",
    "sector": "Yazılım & Veri",
    "basePrice": 64
  },
  {
    "symbol": "MOBTL",
    "name": "Mobiltel İletişim Hizmetleri",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MOBTL.IS",
    "sector": "Telekom Dağıtım",
    "basePrice": 4.4
  },
  {
    "symbol": "KRONT",
    "name": "Kron Telekomünikasyon",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KRONT.IS",
    "sector": "Siber Güvenlik & Ağ",
    "basePrice": 26.5
  },
  {
    "symbol": "FORTE",
    "name": "Forte Bilgi İletişim Teknolojileri",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "FORTE.IS",
    "sector": "Savunma Bilişim",
    "basePrice": 68
  },
  {
    "symbol": "TABGD",
    "name": "TAB Gıda Sanayi ve Ticaret",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TABGD.IS",
    "sector": "Hızlı Servis Restoran",
    "basePrice": 148
  },
  {
    "symbol": "OBAMS",
    "name": "Oba Makarnacılık Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "OBAMS.IS",
    "sector": "Gıda Sanayi",
    "basePrice": 37.8
  },
  {
    "symbol": "TATGD",
    "name": "Tat Gıda Sanayi A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TATGD.IS",
    "sector": "Gıda & Konserve",
    "basePrice": 26.4
  },
  {
    "symbol": "ULUUN",
    "name": "Ulusoy Un Sanayi ve Ticaret",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ULUUN.IS",
    "sector": "Gıda & Un Sanayi",
    "basePrice": 28.5
  },
  {
    "symbol": "TUKAS",
    "name": "Tukaş Gıda Sanayi ve Ticaret",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TUKAS.IS",
    "sector": "Gıda Sanayi",
    "basePrice": 7.45
  },
  {
    "symbol": "BANVT",
    "name": "Banvit Bandırma Vitaminli Yem",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "BANVT.IS",
    "sector": "Gıda & Kanatlı",
    "basePrice": 380
  },
  {
    "symbol": "DARDL",
    "name": "Dardanel Önentaş Gıda Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "DARDL.IS",
    "sector": "Gıda & Su Ürünleri",
    "basePrice": 5.6
  },
  {
    "symbol": "SELVA",
    "name": "Selva Gıda Sanayi A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SELVA.IS",
    "sector": "Gıda Ürünleri",
    "basePrice": 14.8
  },
  {
    "symbol": "PETUN",
    "name": "Pınar Entegre Et ve Un",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "PETUN.IS",
    "sector": "Gıda & Et Ürünleri",
    "basePrice": 94
  },
  {
    "symbol": "PNSUT",
    "name": "Pınar Süt Mamülleri Sanayii",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "PNSUT.IS",
    "sector": "Gıda & Süt Ürünleri",
    "basePrice": 86.5
  },
  {
    "symbol": "PINSU",
    "name": "Pınar Su ve İçecek Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "PINSU.IS",
    "sector": "Gıda & İçecek",
    "basePrice": 22.8
  },
  {
    "symbol": "AEFES",
    "name": "Anadolu Efes Biracılık ve Malt",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "AEFES.IS",
    "sector": "İçecek Sanayi",
    "basePrice": 198
  },
  {
    "symbol": "TBORG",
    "name": "Türk Tuborg Bira ve Malt",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TBORG.IS",
    "sector": "İçecek Sanayi",
    "basePrice": 112
  },
  {
    "symbol": "YYLGD",
    "name": "Yayla Agro Gıda Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "YYLGD.IS",
    "sector": "Gıda & Bakliyat",
    "basePrice": 13.6
  },
  {
    "symbol": "GOKNR",
    "name": "Göknur Gıda Maddeleri Enerji",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "GOKNR.IS",
    "sector": "Meyve Suyu Sanayi",
    "basePrice": 28.4
  },
  {
    "symbol": "KAYSE",
    "name": "Kayseri Şeker Fabrikası",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KAYSE.IS",
    "sector": "Şeker Sanayi",
    "basePrice": 29.5
  },
  {
    "symbol": "MEKAG",
    "name": "Meka Beton Santralleri İmalat",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MEKAG.IS",
    "sector": "Makine İmalatı",
    "basePrice": 64
  },
  {
    "symbol": "ENERY",
    "name": "Enerya Enerji A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ENERY.IS",
    "sector": "Doğalgaz Dağıtım",
    "basePrice": 184
  },
  {
    "symbol": "AHGAZ",
    "name": "Ahlatcı Doğal Gaz Dağıtım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "AHGAZ.IS",
    "sector": "Doğalgaz & Finans",
    "basePrice": 14.2
  },
  {
    "symbol": "MANAS",
    "name": "Manas Enerji Yönetimi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MANAS.IS",
    "sector": "Enerji Sayaç & Yönetim",
    "basePrice": 11.2
  },
  {
    "symbol": "SAYAS",
    "name": "Say Yenilenebilir Enerji",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SAYAS.IS",
    "sector": "Rüzgar & Güneş Ekipman",
    "basePrice": 72
  },
  {
    "symbol": "YEOTK",
    "name": "YEO Teknoloji Enerji",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "YEOTK.IS",
    "sector": "Enerji Mühendislik & Otomasyon",
    "basePrice": 196
  },
  {
    "symbol": "BIOEN",
    "name": "Biotrend Çevre ve Enerji",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "BIOEN.IS",
    "sector": "Biyokütle Enerji",
    "basePrice": 18.9
  },
  {
    "symbol": "CONSE",
    "name": "Consus Enerji İşletmeciliği",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "CONSE.IS",
    "sector": "Biyokütle & Güneş",
    "basePrice": 6.8
  },
  {
    "symbol": "HUNER",
    "name": "Hun Yenilenebilir Enerji",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "HUNER.IS",
    "sector": "Yenilenebilir Enerji",
    "basePrice": 4.9
  },
  {
    "symbol": "MAGEN",
    "name": "Margün Trend Enerji Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MAGEN.IS",
    "sector": "Güneş Santralleri",
    "basePrice": 12.8
  },
  {
    "symbol": "ESEN",
    "name": "Esenboğa Elektrik Üretim",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ESEN.IS",
    "sector": "Güneş Enerjisi",
    "basePrice": 22.4
  },
  {
    "symbol": "NATEN",
    "name": "Naturel Yenilenebilir Enerji",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "NATEN.IS",
    "sector": "Güneş Yatırımları",
    "basePrice": 54
  },
  {
    "symbol": "PAMEL",
    "name": "Pamel Yenilenebilir Elektrik",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "PAMEL.IS",
    "sector": "Hidroelektrik Santral",
    "basePrice": 142
  },
  {
    "symbol": "AYDEM",
    "name": "Aydem Yenilenebilir Enerji",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "AYDEM.IS",
    "sector": "Yenilenebilir Enerji",
    "basePrice": 24.6
  },
  {
    "symbol": "KAREL",
    "name": "Karel Elektronik Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KAREL.IS",
    "sector": "Elektronik & Telekom",
    "basePrice": 14.8
  },
  {
    "symbol": "ESCOM",
    "name": "Escort Teknoloji Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ESCOM.IS",
    "sector": "Bilişim Yatırımları",
    "basePrice": 44
  },
  {
    "symbol": "KFEIN",
    "name": "Kafein Yazılım Hizmetleri",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KFEIN.IS",
    "sector": "Yazılım Hizmetleri",
    "basePrice": 114
  },
  {
    "symbol": "TMPOL",
    "name": "Temapol Polimer Plastik",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TMPOL.IS",
    "sector": "Plastik & Polimer",
    "basePrice": 84
  },
  {
    "symbol": "BRMEN",
    "name": "Birlik Mensucat Ticaret",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "BRMEN.IS",
    "sector": "Tekstil & Dokuma",
    "basePrice": 7.1
  },
  {
    "symbol": "BRKSN",
    "name": "Berkosan Yalıtım ve Tecrit",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "BRKSN.IS",
    "sector": "Yalıtım & İzolasyon",
    "basePrice": 34.5
  },
  {
    "symbol": "BRSAN",
    "name": "Borusan Birleşik Boru",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "BRSAN.IS",
    "sector": "Çelik Boru Sanayi",
    "basePrice": 580
  },
  {
    "symbol": "ERBOS",
    "name": "Erbosan Erciyas Boru Sanayii",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ERBOS.IS",
    "sector": "Çelik Boru İmalat",
    "basePrice": 192
  },
  {
    "symbol": "BMSCH",
    "name": "BMS Çelik Hasır Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "BMSCH.IS",
    "sector": "Çelik Hasır",
    "basePrice": 22.4
  },
  {
    "symbol": "TUCLK",
    "name": "Tuğçelik Alüminyum ve Metal",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TUCLK.IS",
    "sector": "Alüminyum Metal",
    "basePrice": 14.2
  },
  {
    "symbol": "DMSAS",
    "name": "Demisaş Döküm Emaye",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "DMSAS.IS",
    "sector": "Otomotiv Döküm",
    "basePrice": 10.8
  },
  {
    "symbol": "SARKY",
    "name": "Sarkuysan Elektrolitik Bakır",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SARKY.IS",
    "sector": "Bakır & Tel Sanayi",
    "basePrice": 34.2
  },
  {
    "symbol": "CELHA",
    "name": "Çelik Halat ve Tel Sanayii",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "CELHA.IS",
    "sector": "Çelik Halat & Tel",
    "basePrice": 42
  },
  {
    "symbol": "PARSN",
    "name": "Parsan Ezme Çelik Dövme",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "PARSN.IS",
    "sector": "Otomotiv Dövme Çelik",
    "basePrice": 124
  },
  {
    "symbol": "JANTS",
    "name": "Jantsa Jant Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "JANTS.IS",
    "sector": "Otomotiv Jant Sanayi",
    "basePrice": 32.5
  },
  {
    "symbol": "DITAS",
    "name": "Ditaş Doğan Yedek Parça",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "DITAS.IS",
    "sector": "Otomotiv Yedek Parça",
    "basePrice": 28
  },
  {
    "symbol": "MAKTK",
    "name": "Makina Takım Endüstrisi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MAKTK.IS",
    "sector": "Kesici Takım & Makine",
    "basePrice": 8.9
  },
  {
    "symbol": "KLMSN",
    "name": "Klimasan Klima Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KLMSN.IS",
    "sector": "Soğutma Sistemleri",
    "basePrice": 28.4
  },
  {
    "symbol": "EGSER",
    "name": "Ege Seramik Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "EGSER.IS",
    "sector": "Seramik & Karo",
    "basePrice": 6.8
  },
  {
    "symbol": "QUAGR",
    "name": "Qua Granite Hayal Yapı",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "QUAGR.IS",
    "sector": "Granit & Seramik",
    "basePrice": 3.4
  },
  {
    "symbol": "BIENY",
    "name": "Bien Yapı Ürünleri Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "BIENY.IS",
    "sector": "Yapı Malzemeleri & Seramik",
    "basePrice": 34
  },
  {
    "symbol": "KMPUR",
    "name": "Kimteks Poliüretan Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KMPUR.IS",
    "sector": "Poliüretan Sistemleri",
    "basePrice": 24.8
  },
  {
    "symbol": "INVES",
    "name": "Investco Holding A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "INVES.IS",
    "sector": "Girişim Sermayesi",
    "basePrice": 340
  },
  {
    "symbol": "GENIL",
    "name": "Gen İlaç ve Sağlık Ürünleri",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "GENIL.IS",
    "sector": "İlaç & Biyoteknoloji",
    "basePrice": 78.5
  },
  {
    "symbol": "TRILC",
    "name": "Türk İlaç ve Serum Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TRILC.IS",
    "sector": "İlaç & Aşı Üretimi",
    "basePrice": 23.4
  },
  {
    "symbol": "ONCSM",
    "name": "Oncosem Onkolojik Sistemler",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ONCSM.IS",
    "sector": "Tıbbi Cihaz & Onkoloji",
    "basePrice": 186
  },
  {
    "symbol": "RNPOL",
    "name": "Rainbow Polikarbonat Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "RNPOL.IS",
    "sector": "Plastik Polikarbonat",
    "basePrice": 28.9
  },
  {
    "symbol": "POLHO",
    "name": "Polisan Holding A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "POLHO.IS",
    "sector": "Boya, Kimya & Liman",
    "basePrice": 14.8
  },
  {
    "symbol": "DYOBY",
    "name": "Dyo Boya Fabrikaları",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "DYOBY.IS",
    "sector": "Boya & Kaplama",
    "basePrice": 42.5
  },
  {
    "symbol": "MRSHL",
    "name": "Marshall Boya ve Vernik",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MRSHL.IS",
    "sector": "Boya Sanayi",
    "basePrice": 2140
  },
  {
    "symbol": "DEVA",
    "name": "Deva Holding A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "DEVA.IS",
    "sector": "İlaç Üretimi",
    "basePrice": 84
  },
  {
    "symbol": "RTALB",
    "name": "RTA Laboratuvarları Biyolojik",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "RTALB.IS",
    "sector": "Biyolojik Tanı Ürünleri",
    "basePrice": 14.2
  },
  {
    "symbol": "ECZYT",
    "name": "Eczacıbaşı Yatırım Holding",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ECZYT.IS",
    "sector": "Holding & Yatırım",
    "basePrice": 275
  },
  {
    "symbol": "ECILC",
    "name": "Eczacıbaşı İlaç Sınai Finansal",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ECILC.IS",
    "sector": "İlaç & Sağlık",
    "basePrice": 54
  },
  {
    "symbol": "KARTN",
    "name": "Kartonsan Karton Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KARTN.IS",
    "sector": "Karton & Ambalaj",
    "basePrice": 114
  },
  {
    "symbol": "ALKIM",
    "name": "Alkim Alkali Kimya A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ALKIM.IS",
    "sector": "Kimya Sanayi",
    "basePrice": 32.8
  },
  {
    "symbol": "ALKA",
    "name": "Alkim Kağıt Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ALKA.IS",
    "sector": "Kağıt Sanayii",
    "basePrice": 27.5
  },
  {
    "symbol": "BAKAB",
    "name": "Bak Ambalaj Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "BAKAB.IS",
    "sector": "Ambalaj Sanayi",
    "basePrice": 48
  },
  {
    "symbol": "GEDZA",
    "name": "Gediz Ambalaj Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "GEDZA.IS",
    "sector": "Oluklu Plastik Kutu",
    "basePrice": 38.4
  },
  {
    "symbol": "PRKAB",
    "name": "Türk Prysmian Kablo",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "PRKAB.IS",
    "sector": "Kablo & İletişim Sistemleri",
    "basePrice": 36.2
  },
  {
    "symbol": "OZSUB",
    "name": "Özsu Balık Üretimi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "OZSUB.IS",
    "sector": "Su Ürünleri",
    "basePrice": 24.5
  },
  {
    "symbol": "SMRTG",
    "name": "Smart Güneş Enerjisi Teknoloji",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SMRTG.IS",
    "sector": "Güneş Panelleri",
    "basePrice": 48.2
  },
  {
    "symbol": "CVKMD",
    "name": "CVK Maden İşletmeleri",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "CVKMD.IS",
    "sector": "Maden İşletmeciliği",
    "basePrice": 460
  },
  {
    "symbol": "KZBGY",
    "name": "Kuzugrup Gayrimenkul Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KZBGY.IS",
    "sector": "Gayrimenkul",
    "basePrice": 28.5
  },
  {
    "symbol": "KZGYO",
    "name": "Kuzey Boru A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KZGYO.IS",
    "sector": "Boru Sistemleri",
    "basePrice": 118
  },
  {
    "symbol": "SURGY",
    "name": "Sur Tatil Evleri GYO",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SURGY.IS",
    "sector": "Turizm & GYO",
    "basePrice": 46
  },
  {
    "symbol": "DMRGD",
    "name": "DMR Unlu Mamuller",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "DMRGD.IS",
    "sector": "Gıda & Unlu Mamul",
    "basePrice": 16.8
  },
  {
    "symbol": "BSOKE",
    "name": "Batısöke Söke Çimento",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "BSOKE.IS",
    "sector": "Çimento Sanayi",
    "basePrice": 38
  },
  {
    "symbol": "BASGZ",
    "name": "Başkent Doğalgaz Dağıtım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "BASGZ.IS",
    "sector": "Doğalgaz & Altyapı",
    "basePrice": 19.5
  },
  {
    "symbol": "BEYAZ",
    "name": "Beyaz Filo Oto Kiralama",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "BEYAZ.IS",
    "sector": "Filo Kiralama",
    "basePrice": 24
  },
  {
    "symbol": "BVSAN",
    "name": "Bülbüloğlu Vinç Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "BVSAN.IS",
    "sector": "Endüstriyel Vinç",
    "basePrice": 98
  },
  {
    "symbol": "CEMAS",
    "name": "Çemaş Döküm Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "CEMAS.IS",
    "sector": "Döküm & Taşlama",
    "basePrice": 4.9
  },
  {
    "symbol": "CMBTN",
    "name": "Çimbeton Hazırbeton",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "CMBTN.IS",
    "sector": "Hazır Beton",
    "basePrice": 2650
  },
  {
    "symbol": "CRFSA",
    "name": "CarrefourSA Sabancı",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "CRFSA.IS",
    "sector": "Perakende & Market",
    "basePrice": 128
  },
  {
    "symbol": "CUSAN",
    "name": "Çuhadaroğlu Metal Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "CUSAN.IS",
    "sector": "Alüminyum Metal",
    "basePrice": 22
  },
  {
    "symbol": "DERHL",
    "name": "Derlüks Yatırım Holding",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "DERHL.IS",
    "sector": "Holding & Yatırım",
    "basePrice": 14.5
  },
  {
    "symbol": "DNISI",
    "name": "Dinamik Isı Makina",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "DNISI.IS",
    "sector": "Yalıtım & İzolasyon",
    "basePrice": 11.8
  },
  {
    "symbol": "DOGUB",
    "name": "Doğusan Boru Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "DOGUB.IS",
    "sector": "Boru Sanayi",
    "basePrice": 12.4
  },
  {
    "symbol": "DOCO",
    "name": "DO & CO Aktiengesellschaft",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "DOCO.IS",
    "sector": "İkram Hizmetleri",
    "basePrice": 5940
  },
  {
    "symbol": "EDATA",
    "name": "E-Data Teknoloji Pazarlama",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "EDATA.IS",
    "sector": "Siber Güvenlik Dağıtım",
    "basePrice": 21.6
  },
  {
    "symbol": "EGGUB",
    "name": "Ege Gübre Sanayii",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "EGGUB.IS",
    "sector": "Gübre & Liman",
    "basePrice": 56.5
  },
  {
    "symbol": "EGPRO",
    "name": "Ege Profil Ticaret Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "EGPRO.IS",
    "sector": "PVC Profil",
    "basePrice": 214
  },
  {
    "symbol": "EMKEL",
    "name": "Emek Elektrik Endüstrisi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "EMKEL.IS",
    "sector": "Elektrik İmalatı",
    "basePrice": 38.5
  },
  {
    "symbol": "EPLAS",
    "name": "Egeplast Ege Plastik",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "EPLAS.IS",
    "sector": "Plastik Boru",
    "basePrice": 9.8
  },
  {
    "symbol": "ERSU",
    "name": "Ersu Meyve Suları",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ERSU.IS",
    "sector": "Meyve Suyu",
    "basePrice": 7.8
  },
  {
    "symbol": "ESCAR",
    "name": "Escar Turizm Taşımacılık",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ESCAR.IS",
    "sector": "Filo Kiralama",
    "basePrice": 248
  },
  {
    "symbol": "ETILR",
    "name": "Etiler Gıda Ticari Yatırımlar",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ETILR.IS",
    "sector": "Restoran Zinciri",
    "basePrice": 24
  },
  {
    "symbol": "EYGYO",
    "name": "EYG Gayrimenkul Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "EYGYO.IS",
    "sector": "Gayrimenkul Projeleri",
    "basePrice": 8.9
  },
  {
    "symbol": "FADE",
    "name": "Fade Gıda Yatırım Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "FADE.IS",
    "sector": "Gıda Ürünleri",
    "basePrice": 14.5
  },
  {
    "symbol": "FMIZP",
    "name": "Federal-Mogul İzmit Piston",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "FMIZP.IS",
    "sector": "Piston & Motor Parça",
    "basePrice": 285
  },
  {
    "symbol": "FORMT",
    "name": "Formet Metal ve Cam",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "FORMT.IS",
    "sector": "Metal Eşya",
    "basePrice": 3.6
  },
  {
    "symbol": "FRIGO",
    "name": "Frigo-Pak Gıda Maddeleri",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "FRIGO.IS",
    "sector": "Konserve Gıda",
    "basePrice": 7.4
  },
  {
    "symbol": "FZLGY",
    "name": "Fuzul Gayrimenkul Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "FZLGY.IS",
    "sector": "Gayrimenkul",
    "basePrice": 16.8
  },
  {
    "symbol": "GEDIK",
    "name": "Gedik Yatırım Menkul",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "GEDIK.IS",
    "sector": "Aracı Kurum",
    "basePrice": 14.2
  },
  {
    "symbol": "GENTS",
    "name": "Gentaş Dekoratif Yüzeyler",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "GENTS.IS",
    "sector": "Laminat & Yapı",
    "basePrice": 8.9
  },
  {
    "symbol": "GEREL",
    "name": "Gersan Elektrik Ticaret",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "GEREL.IS",
    "sector": "Elektrik Sistemleri",
    "basePrice": 32
  },
  {
    "symbol": "GLBMD",
    "name": "Global Menkul Değerler",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "GLBMD.IS",
    "sector": "Aracı Kurum",
    "basePrice": 68
  },
  {
    "symbol": "GLCVY",
    "name": "Gelecek Varlık Yönetimi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "GLCVY.IS",
    "sector": "Varlık Yönetimi",
    "basePrice": 38.4
  },
  {
    "symbol": "GLRYH",
    "name": "Güler Yatırım Holding",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "GLRYH.IS",
    "sector": "Yatırım Holding",
    "basePrice": 12.9
  },
  {
    "symbol": "GLYHO",
    "name": "Global Yatırım Holding",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "GLYHO.IS",
    "sector": "Liman & Enerji",
    "basePrice": 14.6
  },
  {
    "symbol": "GOZDE",
    "name": "Gözde Girişim Sermayesi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "GOZDE.IS",
    "sector": "Girişim Sermayesi",
    "basePrice": 28.5
  },
  {
    "symbol": "GSDDE",
    "name": "GSD Denizcilik Gayrimenkul",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "GSDDE.IS",
    "sector": "Deniz Taşımacılığı",
    "basePrice": 11.2
  },
  {
    "symbol": "GSDHO",
    "name": "GSD Holding A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "GSDHO.IS",
    "sector": "Denizcilik & Finans",
    "basePrice": 4.4
  },
  {
    "symbol": "GZNMI",
    "name": "Gezinomi Seyahat Turizm",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "GZNMI.IS",
    "sector": "Online Seyahat",
    "basePrice": 48
  },
  {
    "symbol": "HALKB",
    "name": "Türkiye Halk Bankası",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "HALKB.IS",
    "sector": "Bankacılık",
    "basePrice": 16.8
  },
  {
    "symbol": "HATEK",
    "name": "Hateks Hatay Tekstil",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "HATEK.IS",
    "sector": "İplik & Dokuma",
    "basePrice": 14.6
  },
  {
    "symbol": "HDFGS",
    "name": "Hedef Girişim Sermayesi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "HDFGS.IS",
    "sector": "Girişim Sermayesi",
    "basePrice": 2.8
  },
  {
    "symbol": "HEDEF",
    "name": "Hedef Holding A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "HEDEF.IS",
    "sector": "Finans & Teknoloji",
    "basePrice": 26.5
  },
  {
    "symbol": "HUBVC",
    "name": "Hub Girişim Sermayesi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "HUBVC.IS",
    "sector": "Teknoloji Girişim",
    "basePrice": 8.4
  },
  {
    "symbol": "ICBCT",
    "name": "ICBC Turkey Bank",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ICBCT.IS",
    "sector": "Ticari Bankacılık",
    "basePrice": 12.6
  },
  {
    "symbol": "IEYHO",
    "name": "Işıklar Enerji Yapı Holding",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "IEYHO.IS",
    "sector": "Enerji & Ambalaj",
    "basePrice": 4.2
  },
  {
    "symbol": "IHEVA",
    "name": "İhlas Ev Aletleri",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "IHEVA.IS",
    "sector": "Ev Aletleri İmalatı",
    "basePrice": 3.8
  },
  {
    "symbol": "IHGZV",
    "name": "İhlas Gazetecilik",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "IHGZV.IS",
    "sector": "Medya Hizmetleri",
    "basePrice": 3.4
  },
  {
    "symbol": "IHLAS",
    "name": "İhlas Holding A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "IHLAS.IS",
    "sector": "Holding Hizmetleri",
    "basePrice": 1.45
  },
  {
    "symbol": "IHLGM",
    "name": "İhlas Gayrimenkul Proje",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "IHLGM.IS",
    "sector": "İnşaat Projeleri",
    "basePrice": 1.85
  },
  {
    "symbol": "IHMAD",
    "name": "İhlas Madencilik Enerji",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "IHMAD.IS",
    "sector": "Madencilik",
    "basePrice": 11.2
  },
  {
    "symbol": "IMASM",
    "name": "İmaş Makina Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "IMASM.IS",
    "sector": "Makine İmalatı",
    "basePrice": 16.5
  },
  {
    "symbol": "INFO",
    "name": "İnfo Yatırım Menkul",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "INFO.IS",
    "sector": "Aracı Kurum",
    "basePrice": 13.8
  },
  {
    "symbol": "ISBIR",
    "name": "İşbir Holding A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ISBIR.IS",
    "sector": "Sünger & Sentetik",
    "basePrice": 184
  },
  {
    "symbol": "ISDMR",
    "name": "İskenderun Demir ve Çelik",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ISDMR.IS",
    "sector": "Demir Çelik Sanayi",
    "basePrice": 39.4
  },
  {
    "symbol": "ISFIN",
    "name": "İş Finansal Kiralama",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ISFIN.IS",
    "sector": "Finansal Kiralama",
    "basePrice": 14.2
  },
  {
    "symbol": "ISGSY",
    "name": "İş Girişim Sermayesi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ISGSY.IS",
    "sector": "Girişim Sermayesi",
    "basePrice": 24
  },
  {
    "symbol": "ISKPL",
    "name": "Işık Plastik Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ISKPL.IS",
    "sector": "Plastik Levha",
    "basePrice": 8.8
  },
  {
    "symbol": "ISMEN",
    "name": "İş Yatırım Menkul Değerler",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ISMEN.IS",
    "sector": "Yatırım Bankacılığı",
    "basePrice": 34.6
  },
  {
    "symbol": "ISSEN",
    "name": "İşbir Sentetik Dokuma",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ISSEN.IS",
    "sector": "Sentetik Dokuma",
    "basePrice": 12.8
  },
  {
    "symbol": "ISYAT",
    "name": "İş Yatırım Ortaklığı",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ISYAT.IS",
    "sector": "Yatırım Ortaklığı",
    "basePrice": 9.6
  },
  {
    "symbol": "ITTFH",
    "name": "İttifak Holding",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ITTFH.IS",
    "sector": "Holding",
    "basePrice": 3.6
  },
  {
    "symbol": "IZMDC",
    "name": "İzmir Demir Çelik",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "IZMDC.IS",
    "sector": "Demir Çelik",
    "basePrice": 6.4
  },
  {
    "symbol": "KAPLM",
    "name": "Kaplamin Ambalaj Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KAPLM.IS",
    "sector": "Ambalaj & Kutu",
    "basePrice": 142
  },
  {
    "symbol": "KARYA",
    "name": "Kartal Yenilenebilir Enerji",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KARYA.IS",
    "sector": "Güneş Enerjisi",
    "basePrice": 28
  },
  {
    "symbol": "KATMR",
    "name": "Katmerciler Araç Üstü Ekipman",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KATMR.IS",
    "sector": "Savunma Araçları",
    "basePrice": 2.45
  },
  {
    "symbol": "KCAER",
    "name": "Kocaer Çelik Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KCAER.IS",
    "sector": "Çelik Profil",
    "basePrice": 48
  },
  {
    "symbol": "KERVT",
    "name": "Kerevitaş Gıda Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KERVT.IS",
    "sector": "Dondurulmuş Gıda",
    "basePrice": 14.8
  },
  {
    "symbol": "KIMMR",
    "name": "Ersin Kim Market",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KIMMR.IS",
    "sector": "Market Zinciri",
    "basePrice": 8.2
  },
  {
    "symbol": "KLNMA",
    "name": "Kalkınma ve Yatırım Bankası",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KLNMA.IS",
    "sector": "Kalkınma Bankacılığı",
    "basePrice": 34
  },
  {
    "symbol": "KLRHO",
    "name": "Kiler Holding A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KLRHO.IS",
    "sector": "Holding",
    "basePrice": 38
  },
  {
    "symbol": "KNFRT",
    "name": "Konfrut Tarım A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KNFRT.IS",
    "sector": "Meyve Konsantre",
    "basePrice": 11.4
  },
  {
    "symbol": "KONKA",
    "name": "Konya Kağıt Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KONKA.IS",
    "sector": "Kağıt İmalatı",
    "basePrice": 49
  },
  {
    "symbol": "KONYA",
    "name": "Konya Çimento Sanayii",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KONYA.IS",
    "sector": "Çimento Sanayi",
    "basePrice": 11200
  },
  {
    "symbol": "KORDS",
    "name": "Kordsa Teknik Tekstil",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KORDS.IS",
    "sector": "Kompozit & Lastik",
    "basePrice": 94
  },
  {
    "symbol": "KRGYO",
    "name": "Körfez Gayrimenkul Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KRGYO.IS",
    "sector": "Gayrimenkul",
    "basePrice": 28
  },
  {
    "symbol": "KRPLS",
    "name": "Koroplast Temizlik Ambalaj",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KRPLS.IS",
    "sector": "Temizlik & Ambalaj",
    "basePrice": 9.2
  },
  {
    "symbol": "KRSTL",
    "name": "Kristal Kola ve Meşrubat",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KRSTL.IS",
    "sector": "İçecek Sanayi",
    "basePrice": 9.8
  },
  {
    "symbol": "KRTEK",
    "name": "Karsu Tekstil Sanayii",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KRTEK.IS",
    "sector": "İplik Sanayi",
    "basePrice": 24
  },
  {
    "symbol": "KRVGD",
    "name": "Kervan Gıda Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KRVGD.IS",
    "sector": "Şekerleme Sanayi",
    "basePrice": 2.65
  },
  {
    "symbol": "KSTUR",
    "name": "Kuştur Kuşadası Turizm",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KSTUR.IS",
    "sector": "Otelcilik",
    "basePrice": 5600
  },
  {
    "symbol": "KTLEV",
    "name": "Katılımevim Tasarruf Finans",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KTLEV.IS",
    "sector": "Tasarruf Finansman",
    "basePrice": 68
  },
  {
    "symbol": "KTSKR",
    "name": "Kütahya Şeker Fabrikası",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KTSKR.IS",
    "sector": "Şeker Sanayi",
    "basePrice": 58
  },
  {
    "symbol": "KUTPO",
    "name": "Kütahya Porselen Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KUTPO.IS",
    "sector": "Porselen Ürünleri",
    "basePrice": 74
  },
  {
    "symbol": "KUVVA",
    "name": "Kuvva Gıda Ticaret",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KUVVA.IS",
    "sector": "Gıda Ticareti",
    "basePrice": 46
  },
  {
    "symbol": "KUYAS",
    "name": "Kuvva Kuyumcukent Gayrimenkul",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KUYAS.IS",
    "sector": "Gayrimenkul Projeleri",
    "basePrice": 54
  },
  {
    "symbol": "LIDER",
    "name": "Lider Filo Kiralama",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "LIDER.IS",
    "sector": "Filo Kiralama",
    "basePrice": 68
  },
  {
    "symbol": "LILAK",
    "name": "Lila Kağıt Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "LILAK.IS",
    "sector": "Temizlik Kağıdı",
    "basePrice": 26.5
  },
  {
    "symbol": "LKMNH",
    "name": "Lokman Hekim Engürüsağ",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "LKMNH.IS",
    "sector": "Özel Hastane",
    "basePrice": 18.2
  },
  {
    "symbol": "LUKSK",
    "name": "Lüks Kadife Ticaret Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "LUKSK.IS",
    "sector": "Kadife Kumaş",
    "basePrice": 68
  },
  {
    "symbol": "MAALT",
    "name": "Marmaris Altınyunus Turistik",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MAALT.IS",
    "sector": "Turizm & Otel",
    "basePrice": 980
  },
  {
    "symbol": "MACKO",
    "name": "Maçkolik İnternet Hizmetleri",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MACKO.IS",
    "sector": "Spor Medyası",
    "basePrice": 94
  },
  {
    "symbol": "MAKIM",
    "name": "Makim Makina Teknolojileri",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MAKIM.IS",
    "sector": "Hassas Döküm",
    "basePrice": 42
  },
  {
    "symbol": "MARBL",
    "name": "Tureks Turunç Madencilik",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MARBL.IS",
    "sector": "Doğaltaş & Mermer",
    "basePrice": 14.8
  },
  {
    "symbol": "MARKA",
    "name": "Marka Yatırım Holding",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MARKA.IS",
    "sector": "Yatırım Holding",
    "basePrice": 84
  },
  {
    "symbol": "MARTI",
    "name": "Martı Otel İşletmeleri",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MARTI.IS",
    "sector": "Otelcilik",
    "basePrice": 4.8
  },
  {
    "symbol": "MEDTR",
    "name": "Meditera Tıbbi Malzeme",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MEDTR.IS",
    "sector": "Tıbbi Malzemeler",
    "basePrice": 38
  },
  {
    "symbol": "MEGAP",
    "name": "Mega Polietilen Köpük",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MEGAP.IS",
    "sector": "Polietilen Köpük",
    "basePrice": 4.9
  },
  {
    "symbol": "MEGSP",
    "name": "Mega Metal Sanayi Ticaret",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MEGSP.IS",
    "sector": "Bakır Tel Sanayi",
    "basePrice": 42
  },
  {
    "symbol": "MENGD",
    "name": "MNG Havayolları Kargo",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MENGD.IS",
    "sector": "Kargo Taşımacılığı",
    "basePrice": 86
  },
  {
    "symbol": "MERCN",
    "name": "Mercan Kimya Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MERCN.IS",
    "sector": "Kimya Sanayi",
    "basePrice": 12.8
  },
  {
    "symbol": "MERIT",
    "name": "Merit Turizm Yatırımları",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MERIT.IS",
    "sector": "Turizm & Otelcilik",
    "basePrice": 128
  },
  {
    "symbol": "MERKO",
    "name": "Merko Gıda Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MERKO.IS",
    "sector": "Salça & Konserve",
    "basePrice": 9.4
  },
  {
    "symbol": "METRO",
    "name": "Metro Ticari Mali Yatırımlar",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "METRO.IS",
    "sector": "Ulaşım & Turizm",
    "basePrice": 2.8
  },
  {
    "symbol": "METUR",
    "name": "Metemtur Otelcilik",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "METUR.IS",
    "sector": "Turizm & Otel",
    "basePrice": 14.2
  },
  {
    "symbol": "MHRGY",
    "name": "MHR Gayrimenkul Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MHRGY.IS",
    "sector": "Gayrimenkul",
    "basePrice": 4.9
  },
  {
    "symbol": "MNDRS",
    "name": "Menderes Tekstil Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MNDRS.IS",
    "sector": "Ev Tekstili",
    "basePrice": 9.8
  },
  {
    "symbol": "MNDTR",
    "name": "Mondi Turkey Oluklu Mukavva",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MNDTR.IS",
    "sector": "Mukavva & Ambalaj",
    "basePrice": 16.5
  },
  {
    "symbol": "MOGAN",
    "name": "Mogan Enerji Yatırım Holding",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MOGAN.IS",
    "sector": "Yenilenebilir Enerji",
    "basePrice": 12.8
  },
  {
    "symbol": "MPARK",
    "name": "MLP Sağlık Hizmetleri",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MPARK.IS",
    "sector": "Özel Hastane Zinciri",
    "basePrice": 342
  },
  {
    "symbol": "MRGYO",
    "name": "Martı Gayrimenkul Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MRGYO.IS",
    "sector": "Gayrimenkul",
    "basePrice": 7.4
  },
  {
    "symbol": "MSGYO",
    "name": "Mistral Gayrimenkul Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MSGYO.IS",
    "sector": "Gayrimenkul",
    "basePrice": 8.2
  },
  {
    "symbol": "MTRKS",
    "name": "Matriks Bilgi Dağıtım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MTRKS.IS",
    "sector": "Finansal Veri",
    "basePrice": 54
  },
  {
    "symbol": "MTRYO",
    "name": "Metro Yatırım Ortaklığı",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MTRYO.IS",
    "sector": "Portföy Yönetimi",
    "basePrice": 7.8
  },
  {
    "symbol": "NIBAS",
    "name": "Niğde Beton Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "NIBAS.IS",
    "sector": "Prefabrik Beton",
    "basePrice": 18.5
  },
  {
    "symbol": "NTHOL",
    "name": "Net Holding A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "NTHOL.IS",
    "sector": "Turizm & Şans Oyunları",
    "basePrice": 46
  },
  {
    "symbol": "NUGYO",
    "name": "Nurol Gayrimenkul Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "NUGYO.IS",
    "sector": "Gayrimenkul Projeleri",
    "basePrice": 4.8
  },
  {
    "symbol": "OASIS",
    "name": "Oasis Rezidans GYO",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "OASIS.IS",
    "sector": "Gayrimenkul",
    "basePrice": 14.5
  },
  {
    "symbol": "OFSYM",
    "name": "Ofis Yem Gıda Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "OFSYM.IS",
    "sector": "Hayvan Yemi Sanayi",
    "basePrice": 48
  },
  {
    "symbol": "ORGE",
    "name": "Orge Enerji Elektrik Taahhüt",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ORGE.IS",
    "sector": "Elektrik Taahhüt",
    "basePrice": 78
  },
  {
    "symbol": "ORMA",
    "name": "Orma Orman Mamulleri",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ORMA.IS",
    "sector": "Orman Ürünleri",
    "basePrice": 168
  },
  {
    "symbol": "OSMEN",
    "name": "Osmanlı Yatırım Menkul",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "OSMEN.IS",
    "sector": "Aracı Kurum",
    "basePrice": 186
  },
  {
    "symbol": "OSTIM",
    "name": "Ostim Endüstriyel Yatırımlar",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "OSTIM.IS",
    "sector": "Sanayi Yatırımları",
    "basePrice": 8.4
  },
  {
    "symbol": "OYAYO",
    "name": "Oyak Yatırım Ortaklığı",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "OYAYO.IS",
    "sector": "Yatırım Ortaklığı",
    "basePrice": 34
  },
  {
    "symbol": "OYLUM",
    "name": "Oylum Sınai Yatırımlar",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "OYLUM.IS",
    "sector": "Bisküvi & Gıda",
    "basePrice": 9.2
  },
  {
    "symbol": "OYYAT",
    "name": "Oyak Yatırım Menkul",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "OYYAT.IS",
    "sector": "Aracı Kurum",
    "basePrice": 48
  },
  {
    "symbol": "OZGYO",
    "name": "Özderici Gayrimenkul Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "OZGYO.IS",
    "sector": "Gayrimenkul",
    "basePrice": 5.6
  },
  {
    "symbol": "OZRDN",
    "name": "Özerden Plastik Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "OZRDN.IS",
    "sector": "Ambalaj Ürünleri",
    "basePrice": 38
  },
  {
    "symbol": "PAGYO",
    "name": "Panora Gayrimenkul Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "PAGYO.IS",
    "sector": "AVM & Gayrimenkul",
    "basePrice": 44
  },
  {
    "symbol": "PANVE",
    "name": "Panelsan Çatı Cephe",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "PANVE.IS",
    "sector": "Sandviç Panel",
    "basePrice": 68
  },
  {
    "symbol": "PASTV",
    "name": "Pasifik Teknoloji Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "PASTV.IS",
    "sector": "Teknoloji & Siber Güvenlik",
    "basePrice": 74
  },
  {
    "symbol": "PCILT",
    "name": "PC İletişim Medya Sistemleri",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "PCILT.IS",
    "sector": "Medya & Reklam",
    "basePrice": 16.8
  },
  {
    "symbol": "PEGYO",
    "name": "Pera Gayrimenkul Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "PEGYO.IS",
    "sector": "Gayrimenkul",
    "basePrice": 8.4
  },
  {
    "symbol": "PEKGY",
    "name": "Peker Gayrimenkul Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "PEKGY.IS",
    "sector": "Gayrimenkul",
    "basePrice": 28
  },
  {
    "symbol": "PENGD",
    "name": "Penguen Gıda Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "PENGD.IS",
    "sector": "Konserve & Gıda",
    "basePrice": 7.4
  },
  {
    "symbol": "PENTA",
    "name": "Penta Teknoloji Ürünleri",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "PENTA.IS",
    "sector": "Bilişim Dağıtımı",
    "basePrice": 14.8
  },
  {
    "symbol": "PKENT",
    "name": "Petrokent Turizm A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "PKENT.IS",
    "sector": "Tatil Köyü",
    "basePrice": 198
  },
  {
    "symbol": "PLTUR",
    "name": "Platform Turizm Taşımacılık",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "PLTUR.IS",
    "sector": "Taşımacılık & Servis",
    "basePrice": 16.5
  },
  {
    "symbol": "PNLSN",
    "name": "Panel Sistemleri Çatı",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "PNLSN.IS",
    "sector": "Yalıtım Panelleri",
    "basePrice": 58
  },
  {
    "symbol": "POLTK",
    "name": "Politeknik Metal Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "POLTK.IS",
    "sector": "Metal Kimyasalları",
    "basePrice": 14200
  },
  {
    "symbol": "PRDGS",
    "name": "Pardus Girişim Sermayesi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "PRDGS.IS",
    "sector": "Girişim Yatırımları",
    "basePrice": 6.8
  },
  {
    "symbol": "PRKME",
    "name": "Park Elektrik Üretim Maden",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "PRKME.IS",
    "sector": "Madencilik & Enerji",
    "basePrice": 24.5
  },
  {
    "symbol": "PRZMA",
    "name": "Prizma Pres Matbaacılık",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "PRZMA.IS",
    "sector": "Matbaacılık",
    "basePrice": 38
  },
  {
    "symbol": "PSDTC",
    "name": "Pasifik Donanım ve Yazılım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "PSDTC.IS",
    "sector": "Bilişim Donanım",
    "basePrice": 64
  },
  {
    "symbol": "PSGYO",
    "name": "Pasifik Gayrimenkul Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "PSGYO.IS",
    "sector": "Gayrimenkul Projeleri",
    "basePrice": 7.9
  },
  {
    "symbol": "QNBFB",
    "name": "QNB Finansbank A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "QNBFB.IS",
    "sector": "Bankacılık Hizmetleri",
    "basePrice": 285
  },
  {
    "symbol": "QNBFL",
    "name": "QNB Finans Finansal Kiralama",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "QNBFL.IS",
    "sector": "Finansal Kiralama",
    "basePrice": 142
  },
  {
    "symbol": "RALYH",
    "name": "Ral Yatırım Holding",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "RALYH.IS",
    "sector": "İnşaat & Enerji",
    "basePrice": 184
  },
  {
    "symbol": "RAYSG",
    "name": "Ray Sigorta A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "RAYSG.IS",
    "sector": "Sigortacılık",
    "basePrice": 380
  },
  {
    "symbol": "RODRF",
    "name": "Rodrigo Tekstil Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "RODRF.IS",
    "sector": "Tekstil & Giyim",
    "basePrice": 84
  },
  {
    "symbol": "ROYAL",
    "name": "Royal Halı İplik Tekstil",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ROYAL.IS",
    "sector": "Halı Sanayi",
    "basePrice": 16.5
  },
  {
    "symbol": "RUBNS",
    "name": "Rubenis Tekstil Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "RUBNS.IS",
    "sector": "Tekstil & İplik",
    "basePrice": 34
  },
  {
    "symbol": "RUZGR",
    "name": "Rönesans Gayrimenkul Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "RUZGR.IS",
    "sector": "AVM & GYO",
    "basePrice": 138
  },
  {
    "symbol": "RYGYO",
    "name": "Reysaş Gayrimenkul Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "RYGYO.IS",
    "sector": "Lojistik Depolama",
    "basePrice": 42
  },
  {
    "symbol": "RYSAS",
    "name": "Reysaş Taşımacılık Lojistik",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "RYSAS.IS",
    "sector": "Lojistik Hizmetleri",
    "basePrice": 48
  },
  {
    "symbol": "SAFKR",
    "name": "Safkar Ege Soğutmacılık",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SAFKR.IS",
    "sector": "Klima & Soğutma",
    "basePrice": 46
  },
  {
    "symbol": "SAMAT",
    "name": "Saray Matbaacılık Kağıtçılık",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SAMAT.IS",
    "sector": "Matbaacılık & Kağıt",
    "basePrice": 42
  },
  {
    "symbol": "SANEL",
    "name": "San-El Mühendislik Elektrik",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SANEL.IS",
    "sector": "Elektrik Panoları",
    "basePrice": 24
  },
  {
    "symbol": "SANFM",
    "name": "Sanifoam Sünger Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SANFM.IS",
    "sector": "Teknik Sünger",
    "basePrice": 28
  },
  {
    "symbol": "SANKO",
    "name": "Sanko Pazarlama İthalat",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SANKO.IS",
    "sector": "Tekstil Pazarlama",
    "basePrice": 36
  },
  {
    "symbol": "SEKFK",
    "name": "Şeker Finansal Kiralama",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SEKFK.IS",
    "sector": "Leasing Çözümleri",
    "basePrice": 16.8
  },
  {
    "symbol": "SEKUR",
    "name": "Sekuro Plastik Ambalaj",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SEKUR.IS",
    "sector": "Plastik Ambalaj",
    "basePrice": 14.5
  },
  {
    "symbol": "SELGD",
    "name": "Selçuk Gıda Endüstri",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SELGD.IS",
    "sector": "Kuru Meyve İhracat",
    "basePrice": 26
  },
  {
    "symbol": "SEYKM",
    "name": "Seyitler Kimya Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SEYKM.IS",
    "sector": "Tıbbi Malzeme",
    "basePrice": 9.8
  },
  {
    "symbol": "SILVR",
    "name": "Silverline Endüstri Ticaret",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SILVR.IS",
    "sector": "Ankastre Mutfak",
    "basePrice": 18.2
  },
  {
    "symbol": "SKTAS",
    "name": "Söktaş Tekstil Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SKTAS.IS",
    "sector": "Lüks Gömleklik Kumaş",
    "basePrice": 4.8
  },
  {
    "symbol": "SKYMD",
    "name": "Şeker Yatırım Menkul",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SKYMD.IS",
    "sector": "Aracı Kurum",
    "basePrice": 11.4
  },
  {
    "symbol": "SNDUR",
    "name": "Sanica Isı Sanayi (D)",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SNDUR.IS",
    "sector": "Radyatör & Isıtma",
    "basePrice": 32
  },
  {
    "symbol": "SNICA",
    "name": "Sanica Isı Sanayi A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SNICA.IS",
    "sector": "Isıtma Sistemleri",
    "basePrice": 6.8
  },
  {
    "symbol": "SNKRN",
    "name": "Senkron Siber Güvenlik",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SNKRN.IS",
    "sector": "Siber Güvenlik",
    "basePrice": 38
  },
  {
    "symbol": "SOKE",
    "name": "Söke Değirmencilik Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SOKE.IS",
    "sector": "Paketli Un Sanayi",
    "basePrice": 13.8
  },
  {
    "symbol": "SONME",
    "name": "Sönmez Filament İplik",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SONME.IS",
    "sector": "Sentetik İplik",
    "basePrice": 74
  },
  {
    "symbol": "SRVGY",
    "name": "Servet Gayrimenkul Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SRVGY.IS",
    "sector": "Gayrimenkul",
    "basePrice": 480
  },
  {
    "symbol": "SUMAS",
    "name": "Sumaş Saraylı Mdf Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SUMAS.IS",
    "sector": "MDF & Sunta",
    "basePrice": 490
  },
  {
    "symbol": "SUNTK",
    "name": "Sun Tekstil Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SUNTK.IS",
    "sector": "Hazır Giyim İhracatı",
    "basePrice": 18.6
  },
  {
    "symbol": "SUWEN",
    "name": "Suwen Tekstil Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "SUWEN.IS",
    "sector": "İç Giyim & Moda",
    "basePrice": 21
  },
  {
    "symbol": "TARKM",
    "name": "Tarkim Bitki Koruma",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TARKM.IS",
    "sector": "Zirai İlaç Üretimi",
    "basePrice": 580
  },
  {
    "symbol": "TATEN",
    "name": "Tatlıpınar Enerji Üretim",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TATEN.IS",
    "sector": "Rüzgar Santralleri",
    "basePrice": 28.5
  },
  {
    "symbol": "TDGYO",
    "name": "Trend Gayrimenkul Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TDGYO.IS",
    "sector": "Gayrimenkul",
    "basePrice": 14.2
  },
  {
    "symbol": "TEKTU",
    "name": "Tek-Art Turizm Tesisleri",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TEKTU.IS",
    "sector": "Turizm & Otelcilik",
    "basePrice": 3.8
  },
  {
    "symbol": "TERA",
    "name": "Tera Yatırım Menkul",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TERA.IS",
    "sector": "Aracı Kurum",
    "basePrice": 38
  },
  {
    "symbol": "TEZOL",
    "name": "Europap Tezol Kağıt",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TEZOL.IS",
    "sector": "Temizlik Kağıtları",
    "basePrice": 16.4
  },
  {
    "symbol": "TGSAS",
    "name": "TGS Dış Ticaret A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TGSAS.IS",
    "sector": "Dış Ticaret Hizmetleri",
    "basePrice": 26
  },
  {
    "symbol": "TKFEN",
    "name": "Tekfen Holding A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TKFEN.IS",
    "sector": "Müteahhitlik & Tarım",
    "basePrice": 74
  },
  {
    "symbol": "TKNSA",
    "name": "Teknosa İç ve Dış Ticaret",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TKNSA.IS",
    "sector": "Elektronik Perakende",
    "basePrice": 34
  },
  {
    "symbol": "TLMAN",
    "name": "Trabzon Liman İşletmeciliği",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TLMAN.IS",
    "sector": "Liman İşletmeciliği",
    "basePrice": 114
  },
  {
    "symbol": "TNZTP",
    "name": "Tapdi Oksijen Sağlık",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TNZTP.IS",
    "sector": "Özel Hastanecilik",
    "basePrice": 8.2
  },
  {
    "symbol": "TRCAS",
    "name": "Turcas Petrol A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TRCAS.IS",
    "sector": "Akaryakıt & Enerji",
    "basePrice": 24.5
  },
  {
    "symbol": "TSPOR",
    "name": "Trabzonspor Sportif Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TSPOR.IS",
    "sector": "Spor & Futbol",
    "basePrice": 1.85
  },
  {
    "symbol": "TTRAK",
    "name": "Türk Traktör ve Ziraat",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TTRAK.IS",
    "sector": "Traktör İmalatı",
    "basePrice": 780
  },
  {
    "symbol": "TUREX",
    "name": "Tureks Turizm Taşımacılık",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TUREX.IS",
    "sector": "Yolcu Taşımacılığı",
    "basePrice": 46
  },
  {
    "symbol": "TURGG",
    "name": "Türker Proje Gayrimenkul",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "TURGG.IS",
    "sector": "Arazi Geliştirme",
    "basePrice": 780
  },
  {
    "symbol": "UFUK",
    "name": "Ufuk Yatırım Yönetim",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "UFUK.IS",
    "sector": "Yatırım Yönetimi",
    "basePrice": 184
  },
  {
    "symbol": "ULUFA",
    "name": "Ulusal Faktoring A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ULUFA.IS",
    "sector": "Faktoring Çözümleri",
    "basePrice": 11.2
  },
  {
    "symbol": "ULUSE",
    "name": "Ulusoy Elektrik İmalat",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ULUSE.IS",
    "sector": "Elektrik Ekipmanları",
    "basePrice": 194
  },
  {
    "symbol": "UNLU",
    "name": "Ünlü Yatırım Holding",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "UNLU.IS",
    "sector": "Yatırım Bankacılığı",
    "basePrice": 16.8
  },
  {
    "symbol": "VAKBN",
    "name": "Türkiye Vakıflar Bankası",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "VAKBN.IS",
    "sector": "Bankacılık Hizmetleri",
    "basePrice": 21.4
  },
  {
    "symbol": "VAKFN",
    "name": "Vakıf Finansal Kiralama",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "VAKFN.IS",
    "sector": "Finansal Kiralama",
    "basePrice": 4.8
  },
  {
    "symbol": "VANGD",
    "name": "Vanet Gıda Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "VANGD.IS",
    "sector": "Et & Şarküteri",
    "basePrice": 28
  },
  {
    "symbol": "VERTU",
    "name": "Verusaturk Girişim Sermayesi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "VERTU.IS",
    "sector": "Girişim Sermayesi",
    "basePrice": 48
  },
  {
    "symbol": "VERUS",
    "name": "Verusa Holding A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "VERUS.IS",
    "sector": "Maden, Enerji & Teknoloji",
    "basePrice": 315
  },
  {
    "symbol": "VKFYO",
    "name": "Vakıf Menkul Kıymet Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "VKFYO.IS",
    "sector": "Menkul Kıymetler",
    "basePrice": 26
  },
  {
    "symbol": "VKGYO",
    "name": "Vakıf Gayrimenkul Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "VKGYO.IS",
    "sector": "Gayrimenkul Projeleri",
    "basePrice": 2.4
  },
  {
    "symbol": "VKING",
    "name": "Viking Kağıt ve Selüloz",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "VKING.IS",
    "sector": "Kağıt & Selüloz",
    "basePrice": 36
  },
  {
    "symbol": "YAPRK",
    "name": "Yaprak Süt ve Besi Çiftliği",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "YAPRK.IS",
    "sector": "Süt & Hayvancılık",
    "basePrice": 74
  },
  {
    "symbol": "YAYLA",
    "name": "Yayla Enerji Üretim",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "YAYLA.IS",
    "sector": "Yenilenebilir Enerji",
    "basePrice": 18.4
  },
  {
    "symbol": "YGGYO",
    "name": "Yeni Gimat Gayrimenkul",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "YGGYO.IS",
    "sector": "AVM & Gayrimenkul",
    "basePrice": 48
  },
  {
    "symbol": "YGYO",
    "name": "Yeşil Gayrimenkul Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "YGYO.IS",
    "sector": "Gayrimenkul Projeleri",
    "basePrice": 8.2
  },
  {
    "symbol": "YONGA",
    "name": "Yonga Mobilya Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "YONGA.IS",
    "sector": "Mobilya İhracatı",
    "basePrice": 68
  },
  {
    "symbol": "YUNSA",
    "name": "Yünlü Sanayi ve Ticaret",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "YUNSA.IS",
    "sector": "Yünlü Dokuma Kumaş",
    "basePrice": 64
  },
  {
    "symbol": "YYAPI",
    "name": "Yeşil Yapı Endüstrisi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "YYAPI.IS",
    "sector": "İnşaat Taahhüt",
    "basePrice": 4.9
  },
  {
    "symbol": "ZEDUR",
    "name": "Zedur Enerji Elektrik",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ZEDUR.IS",
    "sector": "Yenilenebilir Enerji",
    "basePrice": 14.8
  },
  {
    "symbol": "ZRGYO",
    "name": "Ziraat Gayrimenkul Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ZRGYO.IS",
    "sector": "Finans Merkezi GYO",
    "basePrice": 6.4
  },
  {
    "symbol": "AVHOL",
    "name": "Avrupa Yatırım Holding",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "AVHOL.IS",
    "sector": "Sağlık & Turizm Yatırımları",
    "basePrice": 24.5
  },
  {
    "symbol": "BURCE",
    "name": "Bursa Çelik Döküm Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "BURCE.IS",
    "sector": "Çelik Döküm İmalatı",
    "basePrice": 215
  },
  {
    "symbol": "BURVA",
    "name": "Burçelik Vana Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "BURVA.IS",
    "sector": "Endüstriyel Vana İmalatı",
    "basePrice": 185
  },
  {
    "symbol": "DAGHL",
    "name": "Dagi Yatırım Holding",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "DAGHL.IS",
    "sector": "Holding Yatırımları",
    "basePrice": 28.4
  },
  {
    "symbol": "DAGI",
    "name": "Dagi Giyim Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "DAGI.IS",
    "sector": "İç Giyim & Mayo Perakende",
    "basePrice": 12.8
  },
  {
    "symbol": "DIRIT",
    "name": "Diriteks Diriliş Tekstil",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "DIRIT.IS",
    "sector": "Battaniye & Tekstil",
    "basePrice": 14.2
  },
  {
    "symbol": "DURDO",
    "name": "Duran Doğan Basım ve Ambalaj",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "DURDO.IS",
    "sector": "Karton Ambalaj & Baskı",
    "basePrice": 16.4
  },
  {
    "symbol": "EMNIS",
    "name": "Eminiş Ambalaj Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "EMNIS.IS",
    "sector": "Plastik & Metal Kova",
    "basePrice": 142
  },
  {
    "symbol": "GMTAS",
    "name": "Gimat Mağazacılık Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "GMTAS.IS",
    "sector": "Gıda Perakendeciliği",
    "basePrice": 11.2
  },
  {
    "symbol": "IDGYO",
    "name": "İdealist Gayrimenkul Yatırım",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "IDGYO.IS",
    "sector": "Gayrimenkul Projeleri",
    "basePrice": 5.6
  },
  {
    "symbol": "KENT",
    "name": "Kent Gıda Maddeleri Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "KENT.IS",
    "sector": "Şekerleme & Sakız Üretimi",
    "basePrice": 740
  },
  {
    "symbol": "LIDFA",
    "name": "Lider Faktoring A.Ş.",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "LIDFA.IS",
    "sector": "Faktoring Hizmetleri",
    "basePrice": 11.8
  },
  {
    "symbol": "MMCPS",
    "name": "MMC Sanayi ve Ticari Yatırımlar",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MMCPS.IS",
    "sector": "Yatırım & Ticaret",
    "basePrice": 8.2
  },
  {
    "symbol": "MZHLD",
    "name": "Mazhar Zorlu Holding",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "MZHLD.IS",
    "sector": "Holding Yatırımları",
    "basePrice": 7.4
  },
  {
    "symbol": "ORCA",
    "name": "Orçay Ortaköy Çay Sanayi",
    "exchange": "BIST",
    "category": "BIST",
    "currency": "₺",
    "yahooTicker": "ORCA.IS",
    "sector": "Çay İmalatı & Pazarlama",
    "basePrice": 14.6
  }
];
