import { serverLocalDatabase } from '../services/serverLocalDatabase';
import { adminDb } from '../services/firebaseAdminService';
import { enrichIpoDeepAnalysis } from '../../src/utils/ipoAnalysisUtils';
const INITIAL_VERIFIED_IPOS: any[] = [];

import { IPOListing } from '../../src/types';

/**
 * Migration Script: Migrate IPO Listings to include Additive Deep Analysis Schema
 * Ensures all existing local DB and Firestore records have the new nullable sub-schemas without overwriting custom data.
 */
export async function runIpoDeepAnalysisMigration(): Promise<{
  localMigrated: number;
  firestoreMigrated: number;
  success: boolean;
}> {
  console.log('[Migration] Starting IPO Deep Analysis schema migration...');
  let localCount = 0;
  let firestoreCount = 0;

  try {
    // 1. Local Database Migration
    const localRecords = serverLocalDatabase.list('ipoListings');
    const seedMap = new Map<string, IPOListing>();
    INITIAL_VERIFIED_IPOS.forEach(seed => seedMap.set(seed.id, seed));

    if (localRecords && localRecords.length > 0) {
      for (const item of localRecords) {
        if (item && item.id && item.data) {
          const existing = item.data as IPOListing;
          const matchingSeed = seedMap.get(item.id);

          // Additively merge deep analysis if missing
          const updated: IPOListing = {
            ...existing,
            financial_health: existing.financial_health ?? matchingSeed?.financial_health ?? null,
            structural_risk: existing.structural_risk ?? matchingSeed?.structural_risk ?? null,
            relative_performance: existing.relative_performance ?? matchingSeed?.relative_performance ?? null,
            demand_breakdown: existing.demand_breakdown ?? matchingSeed?.demand_breakdown ?? null,
            qualitative: existing.qualitative ?? matchingSeed?.qualitative ?? null
          };

          const enriched = enrichIpoDeepAnalysis(updated);
          serverLocalDatabase.set('ipoListings', item.id, enriched);
          localCount++;
        }
      }
    } else {
      // Seed local database with enriched initial verified IPOs
      for (const seed of INITIAL_VERIFIED_IPOS) {
        const enriched = enrichIpoDeepAnalysis(seed);
        serverLocalDatabase.set('ipoListings', seed.id, enriched);
        localCount++;
      }
    }

    // 2. Firestore Migration (if accessible)
    try {
      const snap = await adminDb.collection('ipoListings').get();
      if (!snap.empty) {
        for (const docSnap of snap.docs) {
          const existing = docSnap.data() as IPOListing;
          const matchingSeed = seedMap.get(docSnap.id);

          const updated: IPOListing = {
            ...existing,
            financial_health: existing.financial_health ?? matchingSeed?.financial_health ?? null,
            structural_risk: existing.structural_risk ?? matchingSeed?.structural_risk ?? null,
            relative_performance: existing.relative_performance ?? matchingSeed?.relative_performance ?? null,
            demand_breakdown: existing.demand_breakdown ?? matchingSeed?.demand_breakdown ?? null,
            qualitative: existing.qualitative ?? matchingSeed?.qualitative ?? null
          };

          const enriched = enrichIpoDeepAnalysis(updated);
          await adminDb.collection('ipoListings').doc(docSnap.id).set(enriched, { merge: true }).catch((err) => {
            console.warn('[Migration] Failed to sync document to Firestore:', docSnap.id, err?.message || err);
          });
          firestoreCount++;
        }
      }
    } catch (err: any) {
      console.warn('[Migration] Non-blocking Firestore migration skipped or failed:', err?.message || err);
    }

    console.log(`[Migration] Completed IPO Deep Analysis migration. Local: ${localCount}, Firestore: ${firestoreCount}`);
    return {
      localMigrated: localCount,
      firestoreMigrated: firestoreCount,
      success: true
    };
  } catch (err: any) {
    console.error('[Migration] Migration error:', err.message);
    return {
      localMigrated: localCount,
      firestoreMigrated: firestoreCount,
      success: false
    };
  }
}
