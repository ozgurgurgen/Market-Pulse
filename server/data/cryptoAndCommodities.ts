export interface MacroAssetDefinition {
  symbol: string;
  name: string;
  exchange: string;
  category: 'CRYPTO' | 'COMMODITIES' | 'FOREX';
  currency: string;
  yahooTicker?: string;
  sector: string;
  basePrice: number;
}

// 150+ Lider Kripto Varlık + Emtialar + Döviz Kurları
export const MACRO_AND_CRYPTO_ASSETS: MacroAssetDefinition[] = [
  {
    "symbol": "XAU/USD",
    "name": "Ons Altın (USD)",
    "exchange": "COMMODITIES",
    "category": "COMMODITIES",
    "currency": "$",
    "yahooTicker": "GC=F",
    "sector": "Kıymetli Maden",
    "basePrice": 4650.78
  },
  {
    "symbol": "ALTIN",
    "name": "Gram Altın (TL)",
    "exchange": "COMMODITIES",
    "category": "COMMODITIES",
    "currency": "₺",
    "sector": "Fiziki Altın",
    "basePrice": 5472.5
  },
  {
    "symbol": "CEYREK",
    "name": "Çeyrek Altın (TL)",
    "exchange": "COMMODITIES",
    "category": "COMMODITIES",
    "currency": "₺",
    "sector": "Sarrafiye",
    "basePrice": 8947.5
  },
  {
    "symbol": "YARIM",
    "name": "Yarım Altın (TL)",
    "exchange": "COMMODITIES",
    "category": "COMMODITIES",
    "currency": "₺",
    "sector": "Sarrafiye",
    "basePrice": 17895
  },
  {
    "symbol": "TAM",
    "name": "Tam / Cumhuriyet Altını (TL)",
    "exchange": "COMMODITIES",
    "category": "COMMODITIES",
    "currency": "₺",
    "sector": "Sarrafiye",
    "basePrice": 35790
  },
  {
    "symbol": "ATA",
    "name": "Ata Altın (TL)",
    "exchange": "COMMODITIES",
    "category": "COMMODITIES",
    "currency": "₺",
    "sector": "Sarrafiye",
    "basePrice": 36700
  },
  {
    "symbol": "XAG/USD",
    "name": "Ons Gümüş (USD)",
    "exchange": "COMMODITIES",
    "category": "COMMODITIES",
    "currency": "$",
    "yahooTicker": "SI=F",
    "sector": "Kıymetli Maden",
    "basePrice": 31.85
  },
  {
    "symbol": "GUMUS",
    "name": "Gram Gümüş (TL)",
    "exchange": "COMMODITIES",
    "category": "COMMODITIES",
    "currency": "₺",
    "sector": "Fiziki Gümüş",
    "basePrice": 37.5
  },
  {
    "symbol": "BRENT",
    "name": "Brent Ham Petrol",
    "exchange": "COMMODITIES",
    "category": "COMMODITIES",
    "currency": "$",
    "yahooTicker": "BZ=F",
    "sector": "Enerji Emtiası",
    "basePrice": 74.8
  },
  {
    "symbol": "CRUDE_OIL",
    "name": "WTI Ham Petrol (USD)",
    "exchange": "COMMODITIES",
    "category": "COMMODITIES",
    "currency": "$",
    "yahooTicker": "CL=F",
    "sector": "Enerji Emtiası",
    "basePrice": 71.2
  },
  {
    "symbol": "NATGAS",
    "name": "Doğal Gaz (USD)",
    "exchange": "COMMODITIES",
    "category": "COMMODITIES",
    "currency": "$",
    "yahooTicker": "NG=F",
    "sector": "Enerji Emtiası",
    "basePrice": 3.25
  },
  {
    "symbol": "COPPER",
    "name": "Bakır (USD)",
    "exchange": "COMMODITIES",
    "category": "COMMODITIES",
    "currency": "$",
    "yahooTicker": "HG=F",
    "sector": "Sanayi Metali",
    "basePrice": 4.15
  },
  {
    "symbol": "PLATINUM",
    "name": "Platin (USD)",
    "exchange": "COMMODITIES",
    "category": "COMMODITIES",
    "currency": "$",
    "yahooTicker": "PL=F",
    "sector": "Kıymetli Maden",
    "basePrice": 965
  },
  {
    "symbol": "USD/TRY",
    "name": "Dolar / Türk Lirası",
    "exchange": "FOREX",
    "category": "FOREX",
    "currency": "₺",
    "yahooTicker": "TRY=X",
    "sector": "Döviz Kuru",
    "basePrice": 36.45
  },
  {
    "symbol": "EUR/TRY",
    "name": "Euro / Türk Lirası",
    "exchange": "FOREX",
    "category": "FOREX",
    "currency": "₺",
    "yahooTicker": "EURTRY=X",
    "sector": "Döviz Kuru",
    "basePrice": 38.1
  },
  {
    "symbol": "GBP/TRY",
    "name": "İngiliz Sterlini / Türk Lirası",
    "exchange": "FOREX",
    "category": "FOREX",
    "currency": "₺",
    "yahooTicker": "GBPTRY=X",
    "sector": "Döviz Kuru",
    "basePrice": 46.2
  },
  {
    "symbol": "EUR/USD",
    "name": "Euro / Amerikan Doları",
    "exchange": "FOREX",
    "category": "FOREX",
    "currency": "$",
    "yahooTicker": "EURUSD=X",
    "sector": "Majör Parite",
    "basePrice": 1.045
  },
  {
    "symbol": "GBP/USD",
    "name": "Sterlin / Amerikan Doları",
    "exchange": "FOREX",
    "category": "FOREX",
    "currency": "$",
    "yahooTicker": "GBPUSD=X",
    "sector": "Majör Parite",
    "basePrice": 1.265
  },
  {
    "symbol": "USD/JPY",
    "name": "Amerikan Doları / Japon Yeni",
    "exchange": "FOREX",
    "category": "FOREX",
    "currency": "¥",
    "yahooTicker": "USDJPY=X",
    "sector": "Majör Parite",
    "basePrice": 154.2
  },
  {
    "symbol": "DXY",
    "name": "ABD Dolar Endeksi",
    "exchange": "FOREX",
    "category": "FOREX",
    "currency": "$",
    "yahooTicker": "DX-Y.NYB",
    "sector": "Makro Dolar Endeksi",
    "basePrice": 106.8
  },
  {
    "symbol": "BTC",
    "name": "Bitcoin",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "BTC-USD",
    "sector": "Dijital Altın / Layer-1",
    "basePrice": 94250
  },
  {
    "symbol": "ETH",
    "name": "Ethereum",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "ETH-USD",
    "sector": "Akıllı Sözleşme Platformu L1",
    "basePrice": 3420
  },
  {
    "symbol": "SOL",
    "name": "Solana",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "SOL-USD",
    "sector": "Yüksek Hızlı Layer-1",
    "basePrice": 184.5
  },
  {
    "symbol": "BNB",
    "name": "BNB (Binance Coin)",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "BNB-USD",
    "sector": "Borsa & BSC Ağı",
    "basePrice": 650
  },
  {
    "symbol": "XRP",
    "name": "Ripple (XRP)",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "XRP-USD",
    "sector": "Sınır Ötesi Ödeme Ağı",
    "basePrice": 2.45
  },
  {
    "symbol": "DOGE",
    "name": "Dogecoin",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "DOGE-USD",
    "sector": "Meme & Ödeme Ağı",
    "basePrice": 0.28
  },
  {
    "symbol": "ADA",
    "name": "Cardano (ADA)",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "ADA-USD",
    "sector": "Proof-of-Stake Katman-1",
    "basePrice": 0.92
  },
  {
    "symbol": "AVAX",
    "name": "Avalanche (AVAX)",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "AVAX-USD",
    "sector": "Alt Ağlar & Ölçeklenebilirlik",
    "basePrice": 32.4
  },
  {
    "symbol": "SUI",
    "name": "Sui Network",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "SUI20947-USD",
    "sector": "Move Tabanlı Katman-1",
    "basePrice": 3.45
  },
  {
    "symbol": "LINK",
    "name": "Chainlink",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "LINK-USD",
    "sector": "Merkeziyetsiz Veri Kahini (Oracle)",
    "basePrice": 18.2
  },
  {
    "symbol": "NEAR",
    "name": "NEAR Protocol",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "NEAR-USD",
    "sector": "Kullanıcı Odaklı Sharding L1",
    "basePrice": 6.2
  },
  {
    "symbol": "APT",
    "name": "Aptos",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "APT21794-USD",
    "sector": "Paralel Yürütme Katman-1",
    "basePrice": 9.8
  },
  {
    "symbol": "DOT",
    "name": "Polkadot",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "DOT-USD",
    "sector": "Çok Zincirli Birlikte Çalışabilirlik",
    "basePrice": 8.5
  },
  {
    "symbol": "LTC",
    "name": "Litecoin",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "LTC-USD",
    "sector": "Eşler Arası Dijital Para",
    "basePrice": 98
  },
  {
    "symbol": "BCH",
    "name": "Bitcoin Cash",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "BCH-USD",
    "sector": "Ölçeklenebilir Ödeme Ağı",
    "basePrice": 440
  },
  {
    "symbol": "UNI",
    "name": "Uniswap",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "UNI7083-USD",
    "sector": "Merkeziyetsiz Borsa (DEX)",
    "basePrice": 12.4
  },
  {
    "symbol": "RENDER",
    "name": "Render Token",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "RENDER-USD",
    "sector": "Merkeziyetsiz GPU Hesaplama",
    "basePrice": 7.4
  },
  {
    "symbol": "TAO",
    "name": "Bittensor (TAO)",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "TAO22974-USD",
    "sector": "Merkeziyetsiz Yapay Zeka Ağı",
    "basePrice": 480
  },
  {
    "symbol": "FET",
    "name": "Artificial Superintelligence Alliance",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "FET-USD",
    "sector": "AI Ajanları & Veri",
    "basePrice": 1.45
  },
  {
    "symbol": "ICP",
    "name": "Internet Computer",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "ICP-USD",
    "sector": "Merkeziyetsiz Bulut Hesaplama",
    "basePrice": 11.2
  },
  {
    "symbol": "PEPE",
    "name": "Pepe",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "PEPE24478-USD",
    "sector": "Meme Token Kültürü",
    "basePrice": 0.0000185
  },
  {
    "symbol": "SHIB",
    "name": "Shiba Inu",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "SHIB-USD",
    "sector": "Meme & Shibarium Ekosistemi",
    "basePrice": 0.0000245
  },
  {
    "symbol": "XLM",
    "name": "Stellar Lumens",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "XLM-USD",
    "sector": "Global Ödeme Ağı",
    "basePrice": 0.48
  },
  {
    "symbol": "TRX",
    "name": "TRON",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "TRX-USD",
    "sector": "Yüksek Hızlı İçerik & Stablecoin Ağı",
    "basePrice": 0.22
  },
  {
    "symbol": "HBAR",
    "name": "Hedera Hashgraph",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "HBAR-USD",
    "sector": "Kurumsal DLT & Hashgraph",
    "basePrice": 0.28
  },
  {
    "symbol": "KAS",
    "name": "Kaspa (KAS)",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "KAS-USD",
    "sector": "BlockDAG Tabanlı PoW L1",
    "basePrice": 0.165
  },
  {
    "symbol": "ATOM",
    "name": "Cosmos Hub",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "ATOM-USD",
    "sector": "Blokzincirler Arası İletişim (IBC)",
    "basePrice": 8.2
  },
  {
    "symbol": "ETC",
    "name": "Ethereum Classic",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "ETC-USD",
    "sector": "Orijinal PoW Ethereum",
    "basePrice": 28.5
  },
  {
    "symbol": "VET",
    "name": "VeChain",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "VET-USD",
    "sector": "Tedarik Zinciri & Kurumsal L1",
    "basePrice": 0.045
  },
  {
    "symbol": "FIL",
    "name": "Filecoin",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "FIL-USD",
    "sector": "Merkeziyetsiz Depolama Ağı",
    "basePrice": 5.6
  },
  {
    "symbol": "IMX",
    "name": "Immutable X",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "IMX10603-USD",
    "sector": "NFT & Web3 Oyun Katman-2",
    "basePrice": 1.65
  },
  {
    "symbol": "STX",
    "name": "Stacks",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "STX4847-USD",
    "sector": "Bitcoin Akıllı Sözleşme L2",
    "basePrice": 1.85
  },
  {
    "symbol": "ARB",
    "name": "Arbitrum",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "ARB11841-USD",
    "sector": "Ethereum Optimistic Rollup L2",
    "basePrice": 0.85
  },
  {
    "symbol": "OP",
    "name": "Optimism",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "OP-USD",
    "sector": "Ethereum L2 & Süperzincir",
    "basePrice": 1.95
  },
  {
    "symbol": "TIA",
    "name": "Celestia",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "TIA22861-USD",
    "sector": "Modüler Veri Erişilebilirlik Ağı",
    "basePrice": 5.8
  },
  {
    "symbol": "INJ",
    "name": "Injective Protocol",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "INJ-USD",
    "sector": "Finans İçin Optimize Katman-1",
    "basePrice": 24.5
  },
  {
    "symbol": "FTM",
    "name": "Fantom (Sonic)",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "FTM-USD",
    "sector": "Yüksek Verimli Directed Acyclic Graph",
    "basePrice": 0.88
  },
  {
    "symbol": "ALGO",
    "name": "Algorand",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "ALGO-USD",
    "sector": "Pure Proof-of-Stake L1",
    "basePrice": 0.38
  },
  {
    "symbol": "THETA",
    "name": "Theta Network",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "THETA-USD",
    "sector": "Merkeziyetsiz Video Akış Ağı",
    "basePrice": 1.85
  },
  {
    "symbol": "GRT",
    "name": "The Graph",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "GRT6719-USD",
    "sector": "Blokzincir Veri İndeksleme Protokolü",
    "basePrice": 0.26
  },
  {
    "symbol": "SEI",
    "name": "Sei Network",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "SEI-USD",
    "sector": "DEX Odaklı Hızlı Katman-1",
    "basePrice": 0.54
  },
  {
    "symbol": "JUP",
    "name": "Jupiter (JUP)",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "JUP29210-USD",
    "sector": "Solana Likidite ve DEX Toplayıcı",
    "basePrice": 1.15
  },
  {
    "symbol": "PYTH",
    "name": "Pyth Network",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "PYTH-USD",
    "sector": "Düşük Gecikmeli Finansal Oracle",
    "basePrice": 0.42
  },
  {
    "symbol": "WIF",
    "name": "dogwifhat",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "WIF-USD",
    "sector": "Solana Meme Token",
    "basePrice": 2.85
  },
  {
    "symbol": "BONK",
    "name": "Bonk (BONK)",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "BONK-USD",
    "sector": "Solana Topluluk Meme Coini",
    "basePrice": 0.000032
  },
  {
    "symbol": "FLOKI",
    "name": "Floki",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "FLOKI-USD",
    "sector": "Meme & Web3 Oyun Ekosistemi",
    "basePrice": 0.00021
  },
  {
    "symbol": "POL",
    "name": "Polygon (POL/MATIC)",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "MATIC-USD",
    "sector": "Ethereum Yan Zincir & ZK-Rollup",
    "basePrice": 0.52
  },
  {
    "symbol": "AAVE",
    "name": "Aave",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "AAVE-USD",
    "sector": "Merkeziyetsiz Borç Alma/Verme",
    "basePrice": 195
  },
  {
    "symbol": "MKR",
    "name": "Maker (Sky)",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "MKR-USD",
    "sector": "Dai Stablecoin Yönetişim",
    "basePrice": 1850
  },
  {
    "symbol": "LDO",
    "name": "Lido DAO",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "LDO-USD",
    "sector": "Ethereum Likit Staking Protokolü",
    "basePrice": 1.65
  },
  {
    "symbol": "QNT",
    "name": "Quant Network",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "QNT-USD",
    "sector": "Kurumsal Blokzincir Birlikte Çalışabilirlik",
    "basePrice": 115
  },
  {
    "symbol": "CRV",
    "name": "Curve DAO Token",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "CRV-USD",
    "sector": "Stablecoin DEX & Likidite",
    "basePrice": 0.65
  },
  {
    "symbol": "ENA",
    "name": "Ethena (ENA)",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "ENA-USD",
    "sector": "Sentetik Dolar & Getiri Protokolü",
    "basePrice": 0.82
  },
  {
    "symbol": "ONDO",
    "name": "Ondo Finance",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "ONDO-USD",
    "sector": "Gerçek Dünya Varlıkları (RWA)",
    "basePrice": 1.28
  },
  {
    "symbol": "STRK",
    "name": "Starknet",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "STRK22691-USD",
    "sector": "ZK-STARK Tabanlı Ethereum L2",
    "basePrice": 0.55
  },
  {
    "symbol": "WLD",
    "name": "Worldcoin",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "WLD-USD",
    "sector": "Biyometrik Kimlik Doğrulama & AI",
    "basePrice": 2.65
  },
  {
    "symbol": "GALA",
    "name": "Gala Games",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "GALA-USD",
    "sector": "Web3 Oyun ve Eğlence Ekosistemi",
    "basePrice": 0.038
  },
  {
    "symbol": "SAND",
    "name": "The Sandbox",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "SAND-USD",
    "sector": "Metaverse Sanal Dünya & NFT",
    "basePrice": 0.48
  },
  {
    "symbol": "MANA",
    "name": "Decentraland",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "MANA-USD",
    "sector": "Sanal Gerçeklik & Metaverse L1",
    "basePrice": 0.45
  },
  {
    "symbol": "CHZ",
    "name": "Chiliz",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "CHZ-USD",
    "sector": "Spor Fan Token Ekosistemi L1",
    "basePrice": 0.082
  },
  {
    "symbol": "AXS",
    "name": "Axie Infinity",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "AXS-USD",
    "sector": "NFT Tabanlı Oyna-Kazan Oyunu",
    "basePrice": 7.4
  },
  {
    "symbol": "RUNE",
    "name": "THORChain",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "RUNE-USD",
    "sector": "Çapraz Zincir Likidite Protokolü",
    "basePrice": 5.8
  },
  {
    "symbol": "BEAM",
    "name": "Beam (Merit Circle)",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "BEAM28298-USD",
    "sector": "Web3 Oyun Altyapı Ağı",
    "basePrice": 0.024
  },
  {
    "symbol": "BLUR",
    "name": "Blur",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "BLUR-USD",
    "sector": "Profesyonel NFT Pazaryeri",
    "basePrice": 0.32
  },
  {
    "symbol": "ENS",
    "name": "Ethereum Name Service",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "ENS-USD",
    "sector": "Web3 Alan Adı ve Kimlik",
    "basePrice": 28.5
  },
  {
    "symbol": "DYDX",
    "name": "dYdX",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "DYDX-USD",
    "sector": "Türev İşlemler & Sürekli Vadeli DEX",
    "basePrice": 1.45
  },
  {
    "symbol": "PENDLE",
    "name": "Pendle Finance",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "PENDLE-USD",
    "sector": "Gelecek Getiri Alım Satım Protokolü",
    "basePrice": 4.8
  },
  {
    "symbol": "1INCH",
    "name": "1inch Network",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "1INCH-USD",
    "sector": "DEX Likidite Toplayıcı",
    "basePrice": 0.42
  },
  {
    "symbol": "COMP",
    "name": "Compound",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "COMP5692-USD",
    "sector": "Otomatik Faiz Getirisi Protokolü",
    "basePrice": 62
  },
  {
    "symbol": "SNX",
    "name": "Synthetix Network",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "SNX-USD",
    "sector": "Sentetik Varlıklar & Türevler",
    "basePrice": 1.85
  },
  {
    "symbol": "CAKE",
    "name": "PancakeSwap",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "CAKE-USD",
    "sector": "BSC Lider DEX ve Launchpad",
    "basePrice": 2.45
  },
  {
    "symbol": "SUSHI",
    "name": "SushiSwap",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "SUSHI-USD",
    "sector": "Çok Zincirli Otomatik Piyasa Yapıcı",
    "basePrice": 1.1
  },
  {
    "symbol": "ZEC",
    "name": "Zcash",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "ZEC-USD",
    "sector": "Sıfır Bilgi İspatlı Gizlilik Parası",
    "basePrice": 48
  },
  {
    "symbol": "DASH",
    "name": "Dash",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "DASH-USD",
    "sector": "Hızlı ve Gizli Ödeme Parası",
    "basePrice": 34
  },
  {
    "symbol": "XMR",
    "name": "Monero",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "XMR-USD",
    "sector": "Tamamen İzlenemez Gizlilik Parası",
    "basePrice": 165
  },
  {
    "symbol": "EOS",
    "name": "EOS Network",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "EOS-USD",
    "sector": "Düşük Gecikmeli DApp Katman-1",
    "basePrice": 0.78
  },
  {
    "symbol": "NEO",
    "name": "NEO",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "NEO-USD",
    "sector": "Akıllı Ekonomi & Sözleşmeler L1",
    "basePrice": 14.5
  },
  {
    "symbol": "IOTA",
    "name": "IOTA (MIOTA)",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "IOTA-USD",
    "sector": "Nesnelerin İnterneti (IoT) Tangle",
    "basePrice": 0.28
  },
  {
    "symbol": "KAVA",
    "name": "Kava",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "KAVA-USD",
    "sector": "Cosmos ve Ethereum Hibrit L1",
    "basePrice": 0.54
  },
  {
    "symbol": "ROSE",
    "name": "Oasis Network",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "ROSE-USD",
    "sector": "Gizlilik Odaklı Katman-1",
    "basePrice": 0.088
  },
  {
    "symbol": "AKT",
    "name": "Akash Network",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "AKT-USD",
    "sector": "Merkeziyetsiz Bulut GPU Pazarı",
    "basePrice": 3.8
  },
  {
    "symbol": "GNO",
    "name": "Gnosis",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "GNO-USD",
    "sector": "Merkeziyetsiz Tahmin & Altyapı",
    "basePrice": 285
  },
  {
    "symbol": "SUPER",
    "name": "SuperVerse",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "SUPER-USD",
    "sector": "Web3 Oyun ve NFT Ekosistemi",
    "basePrice": 1.35
  },
  {
    "symbol": "WAXP",
    "name": "WAX Protocol",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "WAXP-USD",
    "sector": "NFT ve Dijital Koleksiyon Ağı",
    "basePrice": 0.048
  },
  {
    "symbol": "HOT",
    "name": "Holo (HOT)",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "HOT-USD",
    "sector": "Eşler Arası Dağıtık Ağ",
    "basePrice": 0.0022
  },
  {
    "symbol": "ZIL",
    "name": "Zilliqa",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "ZIL-USD",
    "sector": "Sharding Tabanlı Katman-1",
    "basePrice": 0.024
  },
  {
    "symbol": "ENJ",
    "name": "Enjin Coin",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "ENJ-USD",
    "sector": "Web3 Oyun Varlıkları Protokolü",
    "basePrice": 0.22
  },
  {
    "symbol": "BAT",
    "name": "Basic Attention Token",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "BAT-USD",
    "sector": "Brave Tarayıcı Dijital Reklam",
    "basePrice": 0.24
  },
  {
    "symbol": "MINA",
    "name": "Mina Protocol",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "MINA-USD",
    "sector": "Dünyanın En Hafif ZK Blokzinciri",
    "basePrice": 0.68
  },
  {
    "symbol": "FLOW",
    "name": "Flow",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "FLOW-USD",
    "sector": "Yeni Nesil Oyun & Tüketici L1",
    "basePrice": 0.72
  },
  {
    "symbol": "CELO",
    "name": "Celo",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "CELO-USD",
    "sector": "Mobil Odaklı Ödeme Katman-2",
    "basePrice": 0.78
  },
  {
    "symbol": "CFX",
    "name": "Conflux Network",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "CFX-USD",
    "sector": "Tree-Graph Konsensüs Katman-1",
    "basePrice": 0.18
  },
  {
    "symbol": "JASMY",
    "name": "JasmyCoin",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "JASMY-USD",
    "sector": "IoT & Kişisel Veri Güvenliği",
    "basePrice": 0.026
  },
  {
    "symbol": "QTUM",
    "name": "Qtum",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "QTUM-USD",
    "sector": "UTXO ve EVM Hibrit Katman-1",
    "basePrice": 3.6
  },
  {
    "symbol": "ONT",
    "name": "Ontology",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "ONT-USD",
    "sector": "Merkeziyetsiz Kimlik ve Veri Ağı",
    "basePrice": 0.28
  },
  {
    "symbol": "RVN",
    "name": "Ravencoin",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "RVN-USD",
    "sector": "Varlık Transferi PoW Blokzinciri",
    "basePrice": 0.022
  },
  {
    "symbol": "SC",
    "name": "Siacoin",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "SC-USD",
    "sector": "Merkeziyetsiz Bulut Depolama",
    "basePrice": 0.0058
  },
  {
    "symbol": "RAY",
    "name": "Raydium",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "RAY-USD",
    "sector": "Solana Otomatik Piyasa Yapıcı (AMM)",
    "basePrice": 4.6
  },
  {
    "symbol": "ORDI",
    "name": "Ordinals (ORDI)",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "ORDI-USD",
    "sector": "Bitcoin BRC-20 Protokolü",
    "basePrice": 38
  },
  {
    "symbol": "SATS",
    "name": "1000SATS",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "SATS-USD",
    "sector": "Bitcoin Satoshileri BRC-20",
    "basePrice": 0.00028
  },
  {
    "symbol": "BOME",
    "name": "BOOK OF MEME",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "BOME-USD",
    "sector": "Solana Meme & Depolama",
    "basePrice": 0.0094
  },
  {
    "symbol": "MEW",
    "name": "cat in a dogs world",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "MEW-USD",
    "sector": "Solana Kedi Meme Tokeni",
    "basePrice": 0.0078
  },
  {
    "symbol": "NOT",
    "name": "Notcoin",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "NOT-USD",
    "sector": "Telegram Tap-to-Earn Oyunu",
    "basePrice": 0.0084
  },
  {
    "symbol": "TON",
    "name": "Toncoin",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "TON11419-USD",
    "sector": "Telegram Entegre Katman-1 Ağı",
    "basePrice": 5.8
  },
  {
    "symbol": "AEVO",
    "name": "Aevo",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "AEVO-USD",
    "sector": "Yüksek Performanslı L2 Opsiyon DEX",
    "basePrice": 0.46
  },
  {
    "symbol": "ETHFI",
    "name": "ether.fi",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "ETHFI-USD",
    "sector": "Merkeziyetsiz Likit Yeniden Staking",
    "basePrice": 1.85
  },
  {
    "symbol": "EIGEN",
    "name": "EigenLayer",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "EIGEN-USD",
    "sector": "Ethereum Yeniden Staking (Restaking)",
    "basePrice": 3.4
  },
  {
    "symbol": "IO",
    "name": "io.net",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "IO-USD",
    "sector": "Merkeziyetsiz AI Hesaplama & GPU",
    "basePrice": 2.45
  },
  {
    "symbol": "SAFE",
    "name": "Safe (Gnosis Safe)",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "SAFE-USD",
    "sector": "Çoklu İmzalı Akıllı Cüzdan Altyapısı",
    "basePrice": 1.15
  },
  {
    "symbol": "BB",
    "name": "BounceBit",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "BB-USD",
    "sector": "BTC Yeniden Staking Katman-1",
    "basePrice": 0.38
  },
  {
    "symbol": "LISTA",
    "name": "Lista DAO",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "LISTA-USD",
    "sector": "Likit Staking & Stablecoin Borçlanma",
    "basePrice": 0.44
  },
  {
    "symbol": "ZRO",
    "name": "LayerZero",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "ZRO-USD",
    "sector": "Her Şeyi Birbirine Bağlayan Zincirlerarası İletişim",
    "basePrice": 4.8
  },
  {
    "symbol": "DRIFT",
    "name": "Drift Protocol",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "DRIFT-USD",
    "sector": "Solana Tabanlı Sürekli Vadeli DEX",
    "basePrice": 1.45
  },
  {
    "symbol": "TNSR",
    "name": "Tensor",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "TNSR-USD",
    "sector": "Solana Lider NFT Pazaryeri",
    "basePrice": 0.62
  },
  {
    "symbol": "OMNI",
    "name": "Omni Network",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "OMNI-USD",
    "sector": "Ethereum Rollup Birlikte Çalışabilirlik",
    "basePrice": 8.5
  },
  {
    "symbol": "REZ",
    "name": "Renzo",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "REZ-USD",
    "sector": "Cross-chain Likit Yeniden Staking",
    "basePrice": 0.048
  },
  {
    "symbol": "SAGA",
    "name": "Saga",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "SAGA-USD",
    "sector": "Özel Uygulama Blokzincirleri (Chainlets)",
    "basePrice": 1.95
  },
  {
    "symbol": "W",
    "name": "Wormhole",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "W-USD",
    "sector": "Çok Zincirli Birlikte Çalışabilirlik Köprüsü",
    "basePrice": 0.28
  },
  {
    "symbol": "PIXEL",
    "name": "Pixels",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "PIXEL-USD",
    "sector": "Web3 Sosyal Çiftçilik Oyunu",
    "basePrice": 0.18
  },
  {
    "symbol": "ALT",
    "name": "AltLayer",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "ALT-USD",
    "sector": "Rollup Hizmeti ve Yeniden Staking",
    "basePrice": 0.12
  },
  {
    "symbol": "MANTA",
    "name": "Manta Network",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "MANTA-USD",
    "sector": "Modüler ZK-Rollup Katman-2",
    "basePrice": 0.85
  },
  {
    "symbol": "AI",
    "name": "Sleepless AI",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "AI-USD",
    "sector": "Yapay Zeka & Sanal Arkadaşlık Oyunu",
    "basePrice": 0.52
  },
  {
    "symbol": "XAI",
    "name": "Xai",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "XAI-USD",
    "sector": "Arbitrum Tabanlı Web3 Oyun Katman-3",
    "basePrice": 0.26
  },
  {
    "symbol": "NFP",
    "name": "NFPrompt",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "NFP-USD",
    "sector": "AI Destekli Web3 İçerik Platformu",
    "basePrice": 0.24
  },
  {
    "symbol": "ACE",
    "name": "Fusionist (ACE)",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "ACE-USD",
    "sector": "Yüksek Kaliteli Web3 Bilimkurgu Oyunu",
    "basePrice": 2.4
  },
  {
    "symbol": "JTO",
    "name": "Jito",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "JTO-USD",
    "sector": "Solana MEV & Likit Staking Protokolü",
    "basePrice": 3.1
  },
  {
    "symbol": "AUCTION",
    "name": "Bounce Token",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "AUCTION-USD",
    "sector": "Merkeziyetsiz Müzayede Protokolü",
    "basePrice": 16.5
  },
  {
    "symbol": "TRB",
    "name": "Tellor",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "TRB-USD",
    "sector": "Merkeziyetsiz Oracle Katmanı",
    "basePrice": 68
  },
  {
    "symbol": "BIGTIME",
    "name": "Big Time",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "BIGTIME-USD",
    "sector": "Oynaması Ücretsiz Web3 MMORPG",
    "basePrice": 0.16
  },
  {
    "symbol": "LOOM",
    "name": "Loom Network",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "LOOM-USD",
    "sector": "Yüksek Performanslı DApp Zinciri",
    "basePrice": 0.068
  },
  {
    "symbol": "BLZ",
    "name": "Bluzelle",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "BLZ-USD",
    "sector": "Web3 Oyun ve Merkeziyetsiz Depolama",
    "basePrice": 0.14
  },
  {
    "symbol": "CYBER",
    "name": "CyberConnect",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "CYBER-USD",
    "sector": "Web3 Sosyal Grafik Protokolü",
    "basePrice": 3.8
  },
  {
    "symbol": "ARK",
    "name": "Ark",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "ARK-USD",
    "sector": "Kullanımı Kolay Blokzincir Ekosistemi",
    "basePrice": 0.58
  },
  {
    "symbol": "MAV",
    "name": "Maverick Protocol",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "MAV-USD",
    "sector": "Dinamik Dağıtım AMM Protokolü",
    "basePrice": 0.22
  },
  {
    "symbol": "RAD",
    "name": "Radicle",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "RAD-USD",
    "sector": "Merkeziyetsiz Kod İşbirliği & Git",
    "basePrice": 1.45
  },
  {
    "symbol": "ID",
    "name": "SPACE ID",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "ID-USD",
    "sector": "Evrensel Web3 Alan Adı Hizmeti",
    "basePrice": 0.44
  },
  {
    "symbol": "RDNT",
    "name": "Radiant Capital",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "RDNT-USD",
    "sector": "Çok Zincirli Para Piyasası Protokolü",
    "basePrice": 0.068
  },
  {
    "symbol": "GNS",
    "name": "Gains Network",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "GNS-USD",
    "sector": "Merkeziyetsiz Kaldıraçlı Alım Satım",
    "basePrice": 2.1
  },
  {
    "symbol": "SSV",
    "name": "SSV Network",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "SSV-USD",
    "sector": "Merkeziyetsiz Ethereum Doğrulayıcı Ağı",
    "basePrice": 24
  },
  {
    "symbol": "LQTY",
    "name": "Liquity",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "LQTY-USD",
    "sector": "Faizsiz Borçlanma Protokolü",
    "basePrice": 1.15
  },
  {
    "symbol": "ACH",
    "name": "Alchemy Pay",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "ACH-USD",
    "sector": "Kripto-Fiat Hibrit Ödeme Ağ Geçidi",
    "basePrice": 0.024
  },
  {
    "symbol": "HOOK",
    "name": "Hooked Protocol",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "HOOK-USD",
    "sector": "Web3 Öğrenme ve Katılım Platformu",
    "basePrice": 0.48
  },
  {
    "symbol": "MAGIC",
    "name": "Treasure (MAGIC)",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "MAGIC-USD",
    "sector": "Arbitrum Web3 Oyun Ekosistemi",
    "basePrice": 0.42
  },
  {
    "symbol": "HFT",
    "name": "Hashflow",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "HFT-USD",
    "sector": "Sıfır Slippage DEX Protokolü",
    "basePrice": 0.18
  },
  {
    "symbol": "OSMO",
    "name": "Osmosis",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "OSMO-USD",
    "sector": "Cosmos IBC Lider DEX ve Likidite",
    "basePrice": 0.58
  },
  {
    "symbol": "GMX",
    "name": "GMX",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "GMX-USD",
    "sector": "Merkeziyetsiz Sürekli Vadeli Alım Satım",
    "basePrice": 28
  },
  {
    "symbol": "STG",
    "name": "Stargate Finance",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "STG-USD",
    "sector": "Çapraz Zincir Likidite Taşıyıcı",
    "basePrice": 0.34
  },
  {
    "symbol": "AERO",
    "name": "Aerodrome Finance",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "AERO-USD",
    "sector": "Base Ağı Merkezi Likidite Motoru",
    "basePrice": 1.35
  },
  {
    "symbol": "VIRTUAL",
    "name": "Virtuals Protocol",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "VIRTUAL-USD",
    "sector": "Yapay Zeka ve Oyun Ajanları Protokolü",
    "basePrice": 1.85
  },
  {
    "symbol": "AI16Z",
    "name": "ai16z",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "AI16Z-USD",
    "sector": "Merkeziyetsiz AI Fon ve Ajan DAO",
    "basePrice": 0.48
  },
  {
    "symbol": "FARTCOIN",
    "name": "Fartcoin",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "FARTCOIN-USD",
    "sector": "Viral AI & Meme Token",
    "basePrice": 0.65
  },
  {
    "symbol": "GOAT",
    "name": "Goatseus Maximus",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "GOAT-USD",
    "sector": "AI Ajanı Tabanlı Meme Token",
    "basePrice": 0.78
  },
  {
    "symbol": "GRASS",
    "name": "Grass",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "GRASS-USD",
    "sector": "Merkeziyetsiz Web Kazıma ve AI Veri Ağı",
    "basePrice": 2.65
  },
  {
    "symbol": "PNUT",
    "name": "Peanut the Squirrel",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "PNUT-USD",
    "sector": "Topluluk Meme Tokeni",
    "basePrice": 0.88
  },
  {
    "symbol": "ACT",
    "name": "Act I: The AI Prophecy",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "ACT-USD",
    "sector": "Açık Kaynak AI ve Ajan Ekosistemi",
    "basePrice": 0.42
  },
  {
    "symbol": "CHILLGUY",
    "name": "Just a Chill Guy",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "CHILLGUY-USD",
    "sector": "Viral Karakter Meme Tokeni",
    "basePrice": 0.38
  },
  {
    "symbol": "MOODENG",
    "name": "Moo Deng",
    "exchange": "CRYPTO",
    "category": "CRYPTO",
    "currency": "$",
    "yahooTicker": "MOODENG-USD",
    "sector": "Viral Su Aygırı Meme Tokeni",
    "basePrice": 0.32
  }
];
