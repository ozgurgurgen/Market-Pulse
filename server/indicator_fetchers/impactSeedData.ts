import { IndicatorAssetImpact } from './types';

/**
 * Gösterge <-> Varlık Etki İlişkileri (Seed & Kural Bazlı Matris)
 * 15+ temel makro-mikro finansal etki kuralı
 */
export const INITIAL_ASSET_IMPACT_RULES: IndicatorAssetImpact[] = [
  // 1. USD/TRY -> THYAO (Türk Hava Yolları)
  {
    id: 'imp-thyao-usdtry',
    indicator_code: 'TR_USDTRY',
    indicator_name: 'Dolar / TL Kuru (USD/TRY)',
    asset_symbol: 'THYAO',
    asset_name: 'Türk Hava Yolları',
    correlation_type: 'pozitif',
    strength: 'güçlü',
    lag_days: 0,
    rationale: 'Gelirlerinin %85+ döviz (EUR/USD) cinsinden olması sebebiyle kur artışı ciro ve net kâr marjını doğrudan genişletir.',
    is_ai_generated: false,
  },
  // 2. Brent Petrol -> THYAO
  {
    id: 'imp-thyao-brent',
    indicator_code: 'BZ_FUT',
    indicator_name: 'Brent Ham Petrol',
    asset_symbol: 'THYAO',
    asset_name: 'Türk Hava Yolları',
    correlation_type: 'negatif',
    strength: 'güçlü',
    lag_days: 30,
    rationale: 'Jet yakıtı operasyonel giderlerin yaklaşık %35-40\'ını oluşturur. Petrol fiyatındaki artış kâr marjını baskılar.',
    is_ai_generated: false,
  },
  // 3. TCMB Politika Faizi -> AKBNK / Bankalar
  {
    id: 'imp-akbnk-policy-rate',
    indicator_code: 'TR_POLICY_RATE',
    indicator_name: 'TCMB Politika Faizi',
    asset_symbol: 'AKBNK',
    asset_name: 'Akbank',
    correlation_type: 'kosullu',
    strength: 'güçlü',
    lag_days: 15,
    rationale: 'Faiz indirim döngüsü fonlama maliyetlerini (mevduat) hızla düşürüp net faiz marjını (NIM) ve kredi büyümesini pozitif etkiler.',
    is_ai_generated: false,
  },
  // 4. TCMB Politika Faizi -> GARAN
  {
    id: 'imp-garan-policy-rate',
    indicator_code: 'TR_POLICY_RATE',
    indicator_name: 'TCMB Politika Faizi',
    asset_symbol: 'GARAN',
    asset_name: 'Garanti BBVA',
    correlation_type: 'kosullu',
    strength: 'güçlü',
    lag_days: 15,
    rationale: 'Yüksek faiz kredi talebini frenlerken, faiz indirimleri menkul kıymet portföy değerlemesini ve banka kârlılığını artırır.',
    is_ai_generated: false,
  },
  // 5. USD/TRY -> ASELS (Aselsan)
  {
    id: 'imp-asels-usdtry',
    indicator_code: 'TR_USDTRY',
    indicator_name: 'Dolar / TL Kuru (USD/TRY)',
    asset_symbol: 'ASELS',
    asset_name: 'Aselsan',
    correlation_type: 'pozitif',
    strength: 'orta',
    lag_days: 0,
    rationale: 'Yurtdışı savunma sanayi ihracat sözleşmeleri döviz endekslidir; kur artışı bakiye siparişlerin TL karşılığını büyütür.',
    is_ai_generated: false,
  },
  // 6. Brent Petrol -> TUPRS (Tüpraş)
  {
    id: 'imp-tuprs-brent',
    indicator_code: 'BZ_FUT',
    indicator_name: 'Brent Ham Petrol',
    asset_symbol: 'TUPRS',
    asset_name: 'Tüpraş Rafineri',
    correlation_type: 'pozitif',
    strength: 'orta',
    lag_days: 10,
    rationale: 'Petrol fiyatlarındaki yukarı yönlü trend rafineri stok kârlarını ve ürün crack marjlarını dönemsel olarak destekler.',
    is_ai_generated: false,
  },
  // 7. Bakır / Küresel Emtia -> EREGL (Ereğli)
  {
    id: 'imp-eregl-copper',
    indicator_code: 'HG_FUT',
    indicator_name: 'Doktor Bakır / Sanayi Emtiası',
    asset_symbol: 'EREGL',
    asset_name: 'Ereğli Demir Çelik',
    correlation_type: 'pozitif',
    strength: 'güçlü',
    lag_days: 20,
    rationale: 'Küresel sanayi metallerine olan talep artışı yassı çelik (HRC) fiyatlarını yukarı çekerek satış kârlılığını yükseltir.',
    is_ai_generated: false,
  },
  // 8. TÜFE Enflasyon -> BIMAS (BİM)
  {
    id: 'imp-bimas-cpi',
    indicator_code: 'TR_CPI_YOY',
    indicator_name: 'TÜFE Enflasyon Oranı',
    asset_symbol: 'BIMAS',
    asset_name: 'BİM Mağazaları',
    correlation_type: 'pozitif',
    strength: 'güçlü',
    lag_days: 0,
    rationale: 'Gıda perakendesi yüksek fiyat geçişkenliğine sahiptir; enflasyon ciroyu ve sepet büyüklüğünü doğrudan nominal olarak büyütür.',
    is_ai_generated: false,
  },
  // 9. EUR/USD Paritesi -> FROTO (Ford Otosan)
  {
    id: 'imp-froto-eurusd',
    indicator_code: 'GLOBAL_EURUSD',
    indicator_name: 'EUR / USD Paritesi',
    asset_symbol: 'FROTO',
    asset_name: 'Ford Otosan',
    correlation_type: 'pozitif',
    strength: 'güçlü',
    lag_days: 0,
    rationale: 'İhracat gelirlerinin ağırlıklı Euro, girdi maliyetlerinin bir kısmının Dolar olması sebebiyle EUR/USD yükselişi marjları pozitif etkiler.',
    is_ai_generated: false,
  },
  // 10. Fed Faiz Oranı -> NVDA (NVIDIA)
  {
    id: 'imp-nvda-fed-rate',
    indicator_code: 'US_FED_RATE',
    indicator_name: 'ABD Fed Faiz Oranı',
    asset_symbol: 'NVDA',
    asset_name: 'NVIDIA Corp',
    correlation_type: 'negatif',
    strength: 'güçlü',
    lag_days: 5,
    rationale: 'Yüksek büyüme potansiyeline sahip teknoloji hisselerinin indirgenmiş nakit akımı (DCF) değerlemeleri düşük faiz ortamında katlanarak yükselir.',
    is_ai_generated: false,
  },
  // 11. ABD 10 Yıllık Tahvil Getirisi -> GC_FUT (Ons Altın)
  {
    id: 'imp-gold-us10y',
    indicator_code: 'US_10Y_YIELD',
    indicator_name: 'ABD 10Y Tahvil Getirisi',
    asset_symbol: 'ALTIN',
    asset_name: 'Ons / Gram Altın',
    correlation_type: 'negatif',
    strength: 'güçlü',
    lag_days: 0,
    rationale: 'Getirisi olmayan altının fırsat maliyeti, ABD reel tahvil getirileri düştükçe azalır ve altın talebi artar.',
    is_ai_generated: false,
  },
  // 12. VIX Volatilite Endeksi -> S&P 500 & Küresel Hisse Senetleri
  {
    id: 'imp-spy-vix',
    indicator_code: 'VIX',
    indicator_name: 'CBOE VIX Korku Endeksi',
    asset_symbol: 'SPY',
    asset_name: 'S&P 500 ETF',
    correlation_type: 'negatif',
    strength: 'güçlü',
    lag_days: 0,
    rationale: 'VIX endeksindeki sert sıçramalar piyasada panik satışını ve riskli varlıklardan nakde/tahvile kaçışı işaret eder.',
    is_ai_generated: false,
  },
  // 13. TCMB Rezervleri -> BIST 100 Endeksi (XU100)
  {
    id: 'imp-bist-reserves',
    indicator_code: 'TR_GROSS_RESERVES',
    indicator_name: 'TCMB Brüt Rezervleri',
    asset_symbol: 'XU100',
    asset_name: 'BIST 100 Endeksi',
    correlation_type: 'pozitif',
    strength: 'güçlü',
    lag_days: 7,
    rationale: 'Merkez Bankası rezerv birikimi Türkiye CDS risk primini düşürür, yabancı fon girişlerini ve BIST 100 çarpanlarını destekler.',
    is_ai_generated: false,
  },
  // 14. Fed Faiz Oranı -> BTC (Bitcoin)
  {
    id: 'imp-btc-fed-rate',
    indicator_code: 'US_FED_RATE',
    indicator_name: 'ABD Fed Faiz Oranı',
    asset_symbol: 'BTC-USD',
    asset_name: 'Bitcoin',
    correlation_type: 'negatif',
    strength: 'orta',
    lag_days: 7,
    rationale: 'Küresel merkez bankası parasal gevşeme ve likidite genişleme dönemleri kripto varlık rallilerinin ana itici gücüdür.',
    is_ai_generated: false,
  },
  // 15. USD/TRY -> SISE (Şişecam)
  {
    id: 'imp-sise-usdtry',
    indicator_code: 'TR_USDTRY',
    indicator_name: 'Dolar / TL Kuru (USD/TRY)',
    asset_symbol: 'SISE',
    asset_name: 'Şişecam',
    correlation_type: 'pozitif',
    strength: 'orta',
    lag_days: 0,
    rationale: 'Yüksek ihracat oranı ve uluslararası operasyonları sayesinde kur artışı konsolide gelirleri olumlu etkiler.',
    is_ai_generated: false,
  }
];

export function getImpactsForAsset(symbol: string): IndicatorAssetImpact[] {
  const cleanSymbol = symbol.toUpperCase().replace('.IS', '').replace('TRY', '').trim();
  const directMatches = INITIAL_ASSET_IMPACT_RULES.filter(
    (imp) => imp.asset_symbol.toUpperCase() === cleanSymbol || 
             (cleanSymbol.includes(imp.asset_symbol.toUpperCase()) && imp.asset_symbol.length > 2)
  );

  if (directMatches.length > 0) {
    return directMatches;
  }

  // Genel Kategori / Sektör bazlı varsayılan eşleştirmeler
  return [
    {
      id: `gen-${cleanSymbol}-usdtry`,
      indicator_code: 'TR_USDTRY',
      indicator_name: 'Dolar / TL Kuru (USD/TRY)',
      asset_symbol: cleanSymbol,
      correlation_type: 'kosullu',
      strength: 'orta',
      lag_days: 0,
      rationale: 'Döviz kuru hareketleri şirketin borçluluk yapısı ve ihracat/ithalat oranına göre maliyet ve gelir kalemlerini etkiler.',
      is_ai_generated: false,
    },
    {
      id: `gen-${cleanSymbol}-policy-rate`,
      indicator_code: 'TR_POLICY_RATE',
      indicator_name: 'TCMB Politika Faizi',
      asset_symbol: cleanSymbol,
      correlation_type: 'negatif',
      strength: 'orta',
      lag_days: 15,
      rationale: 'Faiz seviyeleri genel tüketici harcamalarını, kredi maliyetlerini ve hisse senedi alternatif getiri rekabetini belirler.',
      is_ai_generated: false,
    },
    {
      id: `gen-${cleanSymbol}-cpi`,
      indicator_code: 'TR_CPI_YOY',
      indicator_name: 'TÜFE Enflasyon Oranı',
      asset_symbol: cleanSymbol,
      correlation_type: 'kosullu',
      strength: 'orta',
      lag_days: 0,
      rationale: 'Enflasyon ortamı şirketlerin nihai ürün fiyatlama gücü ve operasyonel marj dinamiklerini şekillendirir.',
      is_ai_generated: false,
    }
  ];
}
