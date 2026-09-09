/**
 * CANARY TEST RUNNER (ALL ADAPTERS HEALTH & INTEGRITY)
 * MarketPulse AI — Anti-Corruption Layer (ACL)
 */

import { QuoteSourceManager } from '../managers/QuoteSourceManager';
import { FundSourceManager, MacroSourceManager } from '../managers/FundAndMacroSourceManagers';
import { CanaryHealthResult } from '../types';

export class CanaryTestRunner {
  public static async runAllCanaryTests(): Promise<{
    timestamp: string;
    overallHealthy: boolean;
    totalAdaptersTested: number;
    healthyCount: number;
    results: CanaryHealthResult[];
  }> {
    const quoteHealth = await QuoteSourceManager.healthCheckAll();
    const fundHealth = await FundSourceManager.healthCheck();
    const macroHealth = await MacroSourceManager.healthCheckAll();

    const results: CanaryHealthResult[] = [
      quoteHealth.yahoo,
      quoteHealth.binance,
      fundHealth,
      macroHealth.tcmb,
      macroHealth.fred,
      macroHealth.frankfurter
    ];

    const healthyCount = results.filter(r => r.healthy).length;

    return {
      timestamp: new Date().toISOString(),
      overallHealthy: healthyCount === results.length,
      totalAdaptersTested: results.length,
      healthyCount,
      results
    };
  }
}
