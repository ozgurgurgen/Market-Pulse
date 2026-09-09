import { DATA_INTEGRITY_CONFIG } from '../config/dataIntegrityConfig';
import { adminDb } from './firebaseAdminService';
import { serverLocalDatabase } from './serverLocalDatabase';

export type ValidationStatus = 
  | 'verified' 
  | 'unconfirmed' 
  | 'conflicting' 
  | 'single_source' 
  | 'stale' 
  | 'anomaly_flagged'
  | 'pending_human_review'
  | 'ai_verified'
  | 'rejected_market_closed';

export interface ValidationMetadata {
  validation_status: ValidationStatus;
  confidence: number;
  sources: string[];
  fetched_at: string; // ISO String
}

export interface ValidatedValue<T> extends ValidationMetadata {
  value: T;
  raw_results?: any; // Internal only for debugging
}

export async function logAuditTrail(
  field: string,
  value: any,
  validation_status: ValidationStatus,
  sources: string[],
  confidence: number,
  compared_against?: any[],
  reviewed_by?: string
) {
  const isImportant = validation_status === 'anomaly_flagged' || validation_status === 'conflicting' || validation_status === 'pending_human_review' || validation_status === 'rejected_market_closed';
  
  // Skip logging for routine single_source validations to maintain microsecond performance
  if (!isImportant && Math.random() > 0.01) {
    return;
  }

  const entry = {
    field,
    value,
    validation_status,
    sources,
    confidence,
    fetched_at: new Date().toISOString(),
    compared_against: compared_against || [],
    reviewed_by: reviewed_by || null,
    timestamp: new Date().toISOString()
  };

  // 1. Local Database (fast in-memory/file storage)
  try {
    const logKey = `integrity_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    serverLocalDatabase.upsert('data_integrity_audit', logKey, entry);
  } catch {}

  // 2. Firestore write (only for critical anomalies or conflicts, fire-and-forget background execution)
  if (isImportant && adminDb?.collection) {
    try {
      adminDb.collection('data_integrity_audit').add(entry).catch((err) => {
        console.warn('[DataIntegrity] Firestore write suppressed:', err.message);
      });
    } catch {}
  }
}

export async function validateField(
  fieldName: keyof typeof DATA_INTEGRITY_CONFIG,
  primaryResult: { value: number; source: string; timestamp?: string },
  secondaryResult?: { value: number; source: string; timestamp?: string },
  previousValue?: number
): Promise<ValidatedValue<number | null>> {
  const config = DATA_INTEGRITY_CONFIG[fieldName];
  const now = new Date();
  
  // Base metadata
  let metadata: ValidationMetadata = {
    validation_status: 'single_source',
    confidence: 0,
    sources: [primaryResult.source],
    fetched_at: primaryResult.timestamp || now.toISOString()
  };

  // 1. Check Staleness
  const fetchedTime = new Date(metadata.fetched_at).getTime();
  const ageSeconds = (now.getTime() - fetchedTime) / 1000;
  if (ageSeconds > config.max_age_seconds) {
    metadata.validation_status = 'stale';
    logAuditTrail(fieldName, primaryResult.value, metadata.validation_status, metadata.sources, 0);
    return { ...metadata, value: primaryResult.value }; // STILL RETURN VALUE but flagged
  }

  // 2. Anomaly / Jump Detection
  if (previousValue != null) {
    const jumpPct = Math.abs((primaryResult.value - previousValue) / previousValue);
    if (jumpPct > config.max_jump_pct) {
      metadata.validation_status = 'anomaly_flagged';
      logAuditTrail(fieldName, primaryResult.value, metadata.validation_status, metadata.sources, 0);
      return { ...metadata, value: null }; // DO NOT SHOW
    }
  }

  // 3. Cross Validation
  if (!secondaryResult) {
    metadata.validation_status = 'single_source';
    metadata.confidence = 0.5;
    logAuditTrail(fieldName, primaryResult.value, metadata.validation_status, metadata.sources, metadata.confidence);
    return { ...metadata, value: primaryResult.value };
  }

  metadata.sources.push(secondaryResult.source);
  
  const A = primaryResult.value;
  const B = secondaryResult.value;
  
  if (A === 0 && B === 0) {
      metadata.validation_status = 'verified';
      metadata.confidence = 1;
      logAuditTrail(fieldName, A, metadata.validation_status, metadata.sources, metadata.confidence, [B]);
      return { ...metadata, value: A };
  }
  
  const diffPct = Math.abs((A - B) / ((A + B) / 2 || 1)); // Handle div by 0 safely
  
  if (diffPct <= config.tolerance_green) {
    metadata.validation_status = 'verified';
    metadata.confidence = 1 - diffPct;
  } else if (diffPct <= config.tolerance_yellow) {
    metadata.validation_status = 'unconfirmed';
    metadata.confidence = 0.7 - diffPct;
  } else {
    metadata.validation_status = 'conflicting';
    metadata.confidence = 0;
    logAuditTrail(fieldName, null, metadata.validation_status, metadata.sources, metadata.confidence, [B]);
    return { ...metadata, value: null }; // HIDE
  }

  logAuditTrail(fieldName, primaryResult.value, metadata.validation_status, metadata.sources, metadata.confidence, [B]);
  return { ...metadata, value: primaryResult.value };
}

export async function llmDoubleParseWithValidation<T>(
  documentText: string,
  basePrompt: string,
  parseFunction: (doc: string, prompt: string) => Promise<T>,
  compareFunction: (a: T, b: T) => number // returns similarity 0 to 1
): Promise<{ status: ValidationStatus, data: T | null, confidence: number }> {
  
  const promptV1 = basePrompt + "\\n(Extract data focusing on exact numbers presented in the document.)";
  const promptV2 = basePrompt + "\\n(Double check the document critically, cross-reference tables and text to ensure absolute accuracy of extracted values.)";

  // Çift Parse
  const [extractV1, extractV2] = await Promise.all([
    parseFunction(documentText, promptV1),
    parseFunction(documentText, promptV2)
  ]);

  if (!extractV1 || !extractV2) {
    return { status: 'conflicting', data: null, confidence: 0 };
  }

  const similarity = compareFunction(extractV1, extractV2);
  const threshold = DATA_INTEGRITY_CONFIG.financial_ratio.llm_confidence_threshold || 0.85;

  if (similarity >= threshold) {
    // Eşleşiyor, Onaylandı
    return { status: 'ai_verified', data: extractV1, confidence: similarity };
  } else {
    // Eşleşmiyor, Human Review'a at (Kuyruğa Ekle)
    await logAuditTrail('llm_extract_discrepancy', extractV1, 'pending_human_review', ['llm_v1', 'llm_v2'], similarity, [extractV2]);
    return { status: 'pending_human_review', data: null, confidence: similarity };
  }
}
