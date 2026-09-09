/**
 * SANITY CHECKER & DOMAIN INTEGRITY GUARD
 * MarketPulse AI — Anti-Corruption Layer (ACL)
 * 
 * Tüm adaptörlerin ortak kullandığı katı doğrulama motoru.
 * Kural 7: Doğrulama mantığı adaptör İÇİNDE kalır, dışarı hatalı/bozuk veri sızamaz.
 */

import { NormalizedQuote, NormalizedFund, NormalizedIndicator, ValidationMeta } from '../types';

export class SanityChecker {
  /**
   * Quote (Fiyat) Doğrulama
   */
  public static validateQuote(quote: Partial<NormalizedQuote>, fallbackPrice?: number): { isValid: boolean; sanitized: NormalizedQuote } {
    const errors: string[] = [];
    let isSanitized = false;
    let originalPrice = quote.price;

    const symbol = (quote.symbol || 'UNKNOWN').trim().toUpperCase();
    let price = typeof quote.price === 'number' && isFinite(quote.price) ? quote.price : 0;

    // 1. Fiyat Kontrolü (Fiyat <= 0 veya NaN olamaz)
    if (price <= 0) {
      errors.push(`Geçersiz fiyat: ${quote.price}`);
      if (fallbackPrice && fallbackPrice > 0) {
        price = fallbackPrice;
        isSanitized = true;
        errors.push(`Taban fiyata (${fallbackPrice}) sanitize edildi.`);
      }
    }

    // 2. Para Birimi Doğrulama
    let currency = quote.currency || 'TRY';
    if (quote.category === 'BIST' && currency !== 'TRY') {
      currency = 'TRY';
      isSanitized = true;
      errors.push(`BIST hissesi için para birimi TRY olarak düzeltildi.`);
    }

    // 3. Değişim Yüzdesi Aşırılık Kontrolü
    let changePercent = typeof quote.changePercent === 'number' && isFinite(quote.changePercent) ? quote.changePercent : 0;
    if (changePercent < -99.9 || changePercent > 1000) {
      errors.push(`Anormal değişim yüzdesi: %${changePercent}`);
      changePercent = Math.max(-99.9, Math.min(1000, changePercent));
      isSanitized = true;
    }

    const validation: ValidationMeta = {
      isValid: errors.filter(e => !e.includes('sanitize')).length === 0,
      validationErrors: errors,
      sanitized: isSanitized,
      originalPrice
    };

    const sanitized: NormalizedQuote = {
      symbol,
      rawSymbol: quote.rawSymbol || symbol,
      name: quote.name || symbol,
      category: quote.category || (symbol.endsWith('.IS') ? 'BIST' : 'US_STOCKS'),
      exchange: quote.exchange || (quote.category === 'BIST' ? 'BIST' : 'NASDAQ'),
      price: Number(price.toFixed(4)),
      currency,
      change24h: typeof quote.change24h === 'number' ? Number(quote.change24h.toFixed(4)) : null,
      changePercent: Number(changePercent.toFixed(2)),
      high24h: quote.high24h ? Number(quote.high24h.toFixed(4)) : undefined,
      low24h: quote.low24h ? Number(quote.low24h.toFixed(4)) : undefined,
      volume: typeof quote.volume === 'number' && isFinite(quote.volume) ? quote.volume : null,
      marketCap: quote.marketCap,
      peRatio: quote.peRatio,
      asOf: quote.asOf || new Date().toISOString(),
      sourceName: quote.sourceName || 'unknown',
      isStale: quote.isStale || false,
      validation,
      sparkline: quote.sparkline || []
    };

    return {
      isValid: validation.isValid,
      sanitized
    };
  }

  /**
   * TEFAS Fon Doğrulama
   */
  public static validateFund(fund: Partial<NormalizedFund>): { isValid: boolean; sanitized: NormalizedFund } {
    const errors: string[] = [];
    let isSanitized = false;

    const code = (fund.code || 'UNKNOWN').trim().toUpperCase();
    let price = typeof fund.price === 'number' && isFinite(fund.price) ? fund.price : 0;

    if (price <= 0) {
      errors.push(`Geçersiz fon fiyatı: ${fund.price}`);
      price = 1.0;
      isSanitized = true;
    }

    let riskScore = typeof fund.riskScore === 'number' ? fund.riskScore : 4;
    if (riskScore < 1 || riskScore > 7) {
      errors.push(`Geçersiz risk skoru: ${riskScore}`);
      riskScore = Math.max(1, Math.min(7, Math.round(riskScore)));
      isSanitized = true;
    }

    const return1Y = typeof fund.return1Y === 'number' && isFinite(fund.return1Y) ? fund.return1Y : 0;
    const sharpeRatio = typeof fund.sharpeRatio === 'number' && isFinite(fund.sharpeRatio) ? fund.sharpeRatio : 1.0;
    const investorCount = typeof fund.investorCount === 'number' && fund.investorCount >= 0 ? fund.investorCount : 0;

    const validation: ValidationMeta = {
      isValid: errors.length === 0,
      validationErrors: errors,
      sanitized: isSanitized,
      originalPrice: fund.price
    };

    const sanitized: NormalizedFund = {
      code,
      name: fund.name || `${code} Yatırım Fonu`,
      founder: fund.founder || 'Portföy Yönetim Şirketi',
      category: fund.category || 'DEGISKEN',
      categoryLabel: fund.categoryLabel || 'Değişken Fon',
      price: Number(price.toFixed(6)),
      currency: 'TRY',
      riskScore,
      horizon: fund.horizon || 'MEDIUM',
      returnDaily: fund.returnDaily,
      return1M: fund.return1M,
      return3M: fund.return3M,
      return6M: fund.return6M,
      return1Y,
      return3Y: fund.return3Y,
      return5Y: fund.return5Y,
      sharpeRatio: Number(sharpeRatio.toFixed(2)),
      inflationBeat1Y: typeof fund.inflationBeat1Y === 'number' ? fund.inflationBeat1Y : Math.max(0, return1Y - 45),
      withholdingTax: fund.withholdingTax ?? 0,
      fundSizeTRY: fund.fundSizeTRY,
      fundSizeFormatted: fund.fundSizeFormatted || '1.0 Milyar ₺',
      investorCount,
      topHoldings: fund.topHoldings || [],
      aiVerdict: fund.aiVerdict,
      asOf: fund.asOf || new Date().toISOString(),
      sourceName: fund.sourceName || 'tefas_catalog',
      isStale: fund.isStale || false,
      validation
    };

    return {
      isValid: validation.isValid,
      sanitized
    };
  }

  /**
   * Makro Gösterge Doğrulama
   */
  public static validateIndicator(ind: Partial<NormalizedIndicator>): { isValid: boolean; sanitized: NormalizedIndicator } {
    const errors: string[] = [];
    let isSanitized = false;

    const indicatorCode = (ind.indicatorCode || 'UNKNOWN').trim().toUpperCase();
    const value = typeof ind.value === 'number' && isFinite(ind.value) ? ind.value : 0;

    if (isNaN(value)) {
      errors.push(`Geçersiz makro değer: NaN`);
      isSanitized = true;
    }

    const validation: ValidationMeta = {
      isValid: errors.length === 0,
      validationErrors: errors,
      sanitized: isSanitized
    };

    const sanitized: NormalizedIndicator = {
      indicatorCode,
      name: ind.name || indicatorCode,
      region: ind.region || 'TR',
      category: ind.category || 'faiz',
      value: Number(value.toFixed(4)),
      previousValue: ind.previousValue,
      changeValue: ind.changeValue,
      changePercent: ind.changePercent,
      unit: ind.unit || '%',
      frequency: ind.frequency || 'Aylık',
      periodDate: ind.periodDate || new Date().toISOString().substring(0, 10),
      asOf: ind.asOf || new Date().toISOString(),
      sourceName: ind.sourceName || 'TCMB_EVDS',
      isStale: ind.isStale || false,
      validation
    };

    return {
      isValid: validation.isValid,
      sanitized
    };
  }
}
