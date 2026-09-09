/**
 * Validation Layer — validateAnalysisOutput.ts
 * LLM çıktılarının deterministik doğrulaması, halüsinasyon engelleme ve güvenlik filtresi.
 */
export interface ValidationResult {
  isValid: boolean;
  failedFields: string[];
  action: 'ACCEPT' | 'RETRY' | 'REJECT_AND_FLAG' | 'DOWNGRADE_CONFIDENCE';
  confidenceLevel: 'YÜKSEK' | 'ORTA' | 'DÜŞÜK';
  note?: string;
  sanitizedOutput?: any;
}

// 1. Sayısal hedef ve stop-loss tolerans kontrolü (%0.05 yüzdesel tolerans, epsilon korumalı)
export const TOLERANCE_PCT = 0.0005; // %0.05

export function isWithinTolerance(val: number, expected: number, tolerancePct = TOLERANCE_PCT): boolean {
  if (expected === 0 || Math.abs(expected) < 1e-6) {
    return Math.abs(val - expected) < 1e-4; // sıfıra bölme ve sıfır etrafı koruma
  }
  const deviation = Math.abs(val - expected) / Math.abs(expected);
  return deviation <= tolerancePct;
}

export function isOutOfTolerance(val: number, expected: number, tolerancePct = TOLERANCE_PCT): boolean {
  return !isWithinTolerance(val, expected, tolerancePct);
}

export function validateAnalysisOutput(
  llmOutput: any,
  sourceData: {
    symbol: string;
    name: string;
    calculatedTargetShortTerm: number;
    calculatedTargetMidTerm: number;
    calculatedStopLoss: number;
    calculatedRiskReward: string;
    peRatio?: number;
    newsHeadlines?: { title: string; source: string; time: string }[];
  }
): ValidationResult {
  const failed: string[] = [];

  if (!llmOutput || typeof llmOutput !== 'object') {
    return {
      isValid: false,
      failedFields: ['invalid_json_structure'],
      action: 'RETRY',
      confidenceLevel: 'DÜŞÜK',
      note: 'JSON yapısı geçersiz veya eksik döndü.',
    };
  }

  if (
    typeof llmOutput.targetShortTerm === 'number' &&
    isOutOfTolerance(llmOutput.targetShortTerm, sourceData.calculatedTargetShortTerm)
  ) {
    const devPct = sourceData.calculatedTargetShortTerm !== 0 
      ? ((Math.abs(llmOutput.targetShortTerm - sourceData.calculatedTargetShortTerm) / Math.abs(sourceData.calculatedTargetShortTerm)) * 100).toFixed(3)
      : 'N/A';
    failed.push(`targetShortTerm_mismatch: got ${llmOutput.targetShortTerm}, expected ${sourceData.calculatedTargetShortTerm} (sapma: %${devPct})`);
  }

  if (
    typeof llmOutput.targetMidTerm === 'number' &&
    isOutOfTolerance(llmOutput.targetMidTerm, sourceData.calculatedTargetMidTerm)
  ) {
    const devPct = sourceData.calculatedTargetMidTerm !== 0
      ? ((Math.abs(llmOutput.targetMidTerm - sourceData.calculatedTargetMidTerm) / Math.abs(sourceData.calculatedTargetMidTerm)) * 100).toFixed(3)
      : 'N/A';
    failed.push(`targetMidTerm_mismatch: got ${llmOutput.targetMidTerm}, expected ${sourceData.calculatedTargetMidTerm} (sapma: %${devPct})`);
  }

  if (
    typeof llmOutput.stopLoss === 'number' &&
    isOutOfTolerance(llmOutput.stopLoss, sourceData.calculatedStopLoss)
  ) {
    const devPct = sourceData.calculatedStopLoss !== 0
      ? ((Math.abs(llmOutput.stopLoss - sourceData.calculatedStopLoss) / Math.abs(sourceData.calculatedStopLoss)) * 100).toFixed(3)
      : 'N/A';
    failed.push(`stopLoss_mismatch: got ${llmOutput.stopLoss}, expected ${sourceData.calculatedStopLoss} (sapma: %${devPct})`);
  }

  // 2. Sembol / İsim Eşleşme Kontrolü
  const fullText = (
    (llmOutput.companyOverview || '') + ' ' +
    (llmOutput.strategyName || '') + ' ' +
    (llmOutput.technicalAnalysis || '') + ' ' +
    (llmOutput.fundamentalAnalysis || '') + ' ' +
    (llmOutput.whereIWouldBeWrong || '')
  ).toLowerCase();

  const searchTerms = [
    sourceData.symbol.toLowerCase(),
    ...sourceData.name.toLowerCase().split(/[\s-]+/).filter((t: string) => t.length > 2),
  ];
  const matchedTerm = searchTerms.some((term: string) => fullText.includes(term));
  if (!matchedTerm && searchTerms.length > 0) {
    failed.push('companyOverview_symbol_mismatch');
  }

  // 3. Uydurma Haber Kontrolü
  const realTitles = (sourceData.newsHeadlines || []).map((h) => h.title.toLowerCase().trim());
  if (Array.isArray(llmOutput.recentHeadlines) && llmOutput.recentHeadlines.length > 0 && realTitles.length > 0) {
    llmOutput.recentHeadlines.forEach((headline: any) => {
      const title = (headline.title || '').toLowerCase().trim();
      const isKnown = realTitles.some((rt) => rt.includes(title) || title.includes(rt) || title.length < 5);
      if (!isKnown) {
        failed.push(`recentHeadlines_fabricated: ${headline.title}`);
      }
    });
  }

  // 4. Deterministik Değerlerle Çıktıyı Sabitle
  const sanitized = {
    ...llmOutput,
    targetShortTerm: sourceData.calculatedTargetShortTerm,
    targetMidTerm: sourceData.calculatedTargetMidTerm,
    stopLoss: sourceData.calculatedStopLoss,
    riskReward: sourceData.calculatedRiskReward,
  };

  if (failed.length === 0) {
    return {
      isValid: true,
      failedFields: [],
      action: 'ACCEPT',
      confidenceLevel: 'YÜKSEK',
      sanitizedOutput: sanitized,
    };
  }

  const hasFabrication = failed.some((f) => f.includes('fabricated') || f.includes('symbol_mismatch'));
  if (hasFabrication) {
    return {
      isValid: false,
      failedFields: failed,
      action: 'RETRY',
      confidenceLevel: 'DÜŞÜK',
      note: 'Model kaynakta olmayan bilgi/varlık üretti.',
      sanitizedOutput: sanitized,
    };
  }

  return {
    isValid: true,
    failedFields: failed,
    action: 'DOWNGRADE_CONFIDENCE',
    confidenceLevel: 'ORTA',
    sanitizedOutput: sanitized,
    note: 'Sayısal hedefler kod seviyesinde senkronize edildi.',
  };
}
