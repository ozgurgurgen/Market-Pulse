export type AssetType =
  | 'STOCK_INDUSTRIAL'
  | 'STOCK_BANKING'
  | 'STOCK_HOLDING'
  | 'STOCK_RETAIL'
  | 'CRYPTO'
  | 'COMMODITY'
  | 'FOREX';

export function getAssetType(ticker: string): AssetType {
  const clean = ticker.toUpperCase().trim();

  if (clean.endsWith('-USD') || clean.endsWith('-USDT') || ['BTC', 'ETH', 'SOL', 'AVAX', 'XRP'].includes(clean)) {
    if (['XAU-USD', 'XAG-USD', 'BRENT', 'GOLD', 'SILVER'].includes(clean)) {
      return 'COMMODITY';
    }
    return 'CRYPTO';
  }

  if (['USD/TRY', 'EUR/TRY', 'GBP/TRY', 'DXY'].includes(clean)) {
    return 'FOREX';
  }

  if (['AKBNK', 'GARAN', 'ISCTR', 'YKBNK', 'HALKB', 'VAKBN', 'SKBNK', 'TSKB'].includes(clean)) {
    return 'STOCK_BANKING';
  }

  if (['KCHOL', 'SAHOL', 'DOHOL', 'AGHOL', 'TKFEN', 'ALARK'].includes(clean)) {
    return 'STOCK_HOLDING';
  }

  if (['BIMAS', 'MGROS', 'SOKM', 'BIZIM'].includes(clean)) {
    return 'STOCK_RETAIL';
  }

  // Varsayılan sanayi / ihracat / üretim hissesi
  return 'STOCK_INDUSTRIAL';
}

/**
 * Üretilen metnin varlık tipiyle çelişip çelişmediğini kontrol eder.
 * Yanlış jenerik şablonların (örneğin Kripto veya Altın için "kapasite kullanım oranı") engellenmesini sağlar.
 */
export function validateContentMatchesAssetType(text: string, ticker: string): boolean {
  if (!text || typeof text !== 'string') return false;

  const assetType = getAssetType(ticker);
  const lower = text.toLowerCase();

  // Kripto Paralar için Yasaklı Kavramlar
  if (assetType === 'CRYPTO') {
    const forbiddenInCrypto = [
      'kapasite kullanım',
      'ihracat',
      'şirketi',
      'fabrika',
      'kap',
      'faaliyet kârı',
      'kamuyu aydınlatma',
      'temettü',
      'bedelsiz',
      'spk',
    ];
    if (forbiddenInCrypto.some((term) => lower.includes(term))) {
      return false;
    }
  }

  // Emtialar (Altın, Gümüş, Petrol) için Yasaklı Kavramlar
  if (assetType === 'COMMODITY') {
    const forbiddenInCommodities = [
      'kapasite kullanım',
      'şirketi',
      'fabrika',
      'kap',
      'faaliyet kârı',
      'temettü',
      'bedelsiz',
      'yönetim kurulu',
      'faaliyet raporu',
    ];
    if (forbiddenInCommodities.some((term) => lower.includes(term))) {
      return false;
    }
  }

  // Bankalar için Yasaklı Kavramlar
  if (assetType === 'STOCK_BANKING') {
    const forbiddenInBanking = [
      'kapasite kullanım',
      'yerli katma değer',
      'fabrika',
      'ham madde',
      'rafineri marjı',
      'jet yakıtı',
    ];
    if (forbiddenInBanking.some((term) => lower.includes(term))) {
      return false;
    }
  }

  // Döviz Pariteleri için Yasaklı Kavramlar
  if (assetType === 'FOREX') {
    const forbiddenInForex = [
      'kapasite kullanım',
      'şirketi',
      'fabrika',
      'kap',
      'faaliyet kârı',
      'temettü',
      'bedelsiz',
    ];
    if (forbiddenInForex.some((term) => lower.includes(term))) {
      return false;
    }
  }

  return true;
}
