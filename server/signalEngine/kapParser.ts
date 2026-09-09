/**
 * BÖLÜM 6 & MADDE E — KAP Yeni İş İlişkileri ve Sözleşme Tutar Ayrıştırıcısı
 * KAP metinlerinden deterministik sayısal tutar çıkarma ve etki hesaplama.
 * Para birimi belirtilmeyen durumlarda varsayım yapılmaz, kesin olarak null döner.
 */

/**
 * KAP bildirim metninden sayısal tutarı TL cinsinden çıkarır.
 * Para birimi eki (TL, USD, EUR vb.) açıkça belirtilmemişse veya tutar belirsizse ASLA tahmin yürütmez, null döner.
 */
export function extractNumericAmount(text: string, usdTryRate = 36.5): number | null {
  if (!text || typeof text !== 'string') return null;

  const cleanText = text.trim();
  const lower = cleanText.toLowerCase();

  // Belirsiz / net tutar içermeyen ifadeler
  const vaguePhrases = [
    'önemli miktarda',
    'belirsiz',
    'tutar açıklanmadı',
    'gizlilik gereği',
    'ticari sır',
    'bedelsiz',
    'kapsam dahilinde',
    'tutar belirtilmemiştir'
  ];
  if (vaguePhrases.some((phrase) => lower.includes(phrase))) {
    return null;
  }

  // Regex 1: Milyar / Milyon Türkçe kalıpları — PARA BİRİMİ ZORUNLU (tl|try|usd|\$|€|eur|₺)
  const billionMatch = cleanText.match(/([\d.,]+)\s*(?:milyar|billion|b)\s*(tl|try|usd|\$|€|eur|₺)/i);
  if (billionMatch) {
    const rawNum = parseFloat(billionMatch[1].replace(/\./g, '').replace(',', '.'));
    if (!isNaN(rawNum) && billionMatch[2]) {
      const currencyStr = billionMatch[2].toLowerCase();
      const isUSD = currencyStr === 'usd' || currencyStr === '$';
      const isEUR = currencyStr === 'eur' || currencyStr === '€';
      const multiplier = isUSD ? usdTryRate : isEUR ? usdTryRate * 1.08 : 1;
      return Math.round(rawNum * 1_000_000_000 * multiplier);
    }
  }

  const millionMatch = cleanText.match(/([\d.,]+)\s*(?:milyon|million|m)\s*(tl|try|usd|\$|€|eur|₺)/i);
  if (millionMatch) {
    const rawNum = parseFloat(millionMatch[1].replace(/\./g, '').replace(',', '.'));
    if (!isNaN(rawNum) && millionMatch[2]) {
      const currencyStr = millionMatch[2].toLowerCase();
      const isUSD = currencyStr === 'usd' || currencyStr === '$';
      const isEUR = currencyStr === 'eur' || currencyStr === '€';
      const multiplier = isUSD ? usdTryRate : isEUR ? usdTryRate * 1.08 : 1;
      return Math.round(rawNum * 1_000_000 * multiplier);
    }
  }

  // Regex 2: Tam Sayısal Tutar — PARA BİRİMİ ZORUNLU (başta veya sonda)
  const fullNumberMatch = cleanText.match(/(?:(tl|try|usd|\$|€|eur|₺)\s*)?([\d]{1,3}(?:[.,]\d{3})+(?:[.,]\d{1,2})?)\s*(tl|try|usd|\$|€|eur|₺)?/i);
  if (fullNumberMatch) {
    const currencyTag = fullNumberMatch[1] || fullNumberMatch[3];
    // Para birimi yoksa varsayım yapma, null dön
    if (!currencyTag) {
      return null;
    }
    const digitsOnly = fullNumberMatch[2].replace(/[.,](?=\d{3})/g, '').replace(',', '.');
    const rawNum = parseFloat(digitsOnly);
    if (!isNaN(rawNum) && rawNum > 0) {
      const isUSD = /usd|\$/i.test(currencyTag);
      const isEUR = /eur|€/i.test(currencyTag);
      const multiplier = isUSD ? usdTryRate : isEUR ? usdTryRate * 1.08 : 1;
      return Math.round(rawNum * multiplier);
    }
  }

  // Sayısal değer ve para birimi net tespit edilemediyse null dön
  return null;
}

/**
 * İş İlişkisinin Yıllık Ciroya Oranını Hesaplar
 * Eğer tutar null ise, sonuç da null döner (ASLA 0 dönmez).
 */
export function calculateDealImpact(dealAmountText: string, annualRevenue: number, usdTryRate = 36.5): number | null {
  if (!annualRevenue || annualRevenue <= 0) return null;
  const parsedAmount = extractNumericAmount(dealAmountText, usdTryRate);
  if (parsedAmount === null) {
    return null;
  }
  return Number(((parsedAmount / annualRevenue) * 100).toFixed(2));
}

/**
 * Karne Puanlama Davranışı Açıklaması:
 * Null olan metrikler paydadan (denominator) hariç tutulur. 
 * Örneğin 18 kriterden 1'i null ise toplam puan 17 üzerinden hesaplanır.
 * 0 vermek haksız bir ceza puanı olacağından hariç tutma (exclusion) yöntemi seçilmiştir.
 */
export function evaluatePillarScore(scores: (number | null)[]): { finalScore: number; evaluatedMetricsCount: number } {
  const validScores = scores.filter((s): s is number => s !== null && typeof s === 'number' && !isNaN(s));
  if (validScores.length === 0) return { finalScore: 50, evaluatedMetricsCount: 0 };
  const sum = validScores.reduce((a, b) => a + b, 0);
  return {
    finalScore: Number((sum / validScores.length).toFixed(1)),
    evaluatedMetricsCount: validScores.length,
  };
}
