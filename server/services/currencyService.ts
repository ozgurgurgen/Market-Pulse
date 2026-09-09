import { getLiveQuoteForSymbol } from '../yahooFinanceService';

interface CurrencyCache {
  usdTry: number;
  eurTry: number;
  gbpTry: number;
  lastUpdated: number;
}

const currencyCache: CurrencyCache = {
  usdTry: 36.45,
  eurTry: 38.10,
  gbpTry: 45.80,
  lastUpdated: 0,
};

const CACHE_TTL_MS = 60 * 1000; // 1 dakika cache

/**
 * Güncel Döviz Kurlarını Getir ve Önbellekle
 */
export async function getLiveExchangeRates(): Promise<{ usdTry: number; eurTry: number; gbpTry: number }> {
  const now = Date.now();
  if (now - currencyCache.lastUpdated < CACHE_TTL_MS && currencyCache.usdTry > 0) {
    return {
      usdTry: currencyCache.usdTry,
      eurTry: currencyCache.eurTry,
      gbpTry: currencyCache.gbpTry,
    };
  }

  try {
    const usdQuote = (await getLiveQuoteForSymbol('USD/TRY')) || (await getLiveQuoteForSymbol('USDTRY=X'));
    if (usdQuote && usdQuote.currentPrice > 0) {
      currencyCache.usdTry = usdQuote.currentPrice;
    }

    const eurQuote = (await getLiveQuoteForSymbol('EUR/TRY')) || (await getLiveQuoteForSymbol('EURTRY=X'));
    if (eurQuote && eurQuote.currentPrice > 0) {
      currencyCache.eurTry = eurQuote.currentPrice;
    }

    const gbpQuote = (await getLiveQuoteForSymbol('GBPTRY=X')) || (await getLiveQuoteForSymbol('GBP/TRY'));
    if (gbpQuote && gbpQuote.currentPrice > 0) {
      currencyCache.gbpTry = gbpQuote.currentPrice;
    }

    currencyCache.lastUpdated = now;
  } catch (error) {
    console.warn('Currency fetch warning, retaining last known exchange rates:', error);
  }

  return {
    usdTry: currencyCache.usdTry,
    eurTry: currencyCache.eurTry,
    gbpTry: currencyCache.gbpTry,
  };
}

/**
 * USD/TRY Anlık Kuru
 */
export async function getUsdTryRate(): Promise<number> {
  const rates = await getLiveExchangeRates();
  return rates.usdTry;
}

/**
 * Para birimini hedef temel para birimine (TRY veya USD) dönüştür
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  targetCurrency: 'TRY' | 'USD'
): Promise<number> {
  if (!amount || isNaN(amount)) return 0;
  
  const normFrom = fromCurrency?.toUpperCase().trim() || 'TRY';
  const normTarget = targetCurrency?.toUpperCase().trim() || 'TRY';

  if (normFrom === normTarget || (normFrom === '₺' && normTarget === 'TRY') || (normFrom === '$' && normTarget === 'USD')) {
    return amount;
  }

  const rates = await getLiveExchangeRates();

  // From USD to TRY
  if ((normFrom === 'USD' || normFrom === '$') && normTarget === 'TRY') {
    return amount * rates.usdTry;
  }

  // From TRY to USD
  if ((normFrom === 'TRY' || normFrom === '₺' || normFrom === 'TL') && normTarget === 'USD') {
    return amount / rates.usdTry;
  }

  // From EUR to TRY
  if (normFrom === 'EUR' && normTarget === 'TRY') {
    return amount * rates.eurTry;
  }

  // From EUR to USD
  if (normFrom === 'EUR' && normTarget === 'USD') {
    return (amount * rates.eurTry) / rates.usdTry;
  }

  return amount;
}
