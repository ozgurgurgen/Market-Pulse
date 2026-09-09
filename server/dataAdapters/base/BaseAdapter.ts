/**
 * BASE DATA SOURCE ADAPTER
 * MarketPulse AI — Anti-Corruption Layer (ACL)
 */

import { DataSourceAdapter, CanaryHealthResult } from '../types';

export abstract class BaseAdapter<TParams, TResult> implements DataSourceAdapter<TParams, TResult> {
  abstract readonly sourceName: string;
  abstract readonly isScraping: boolean;

  abstract fetch(params: TParams): Promise<TResult>;
  abstract healthCheck(): Promise<CanaryHealthResult>;

  protected logInfo(message: string, meta?: any) {
    console.log(`[ACL Adapter:${this.sourceName}] ${message}`, meta ? JSON.stringify(meta) : '');
  }

  protected logError(message: string, error?: any) {
    console.error(`[ACL Adapter:${this.sourceName}] ERROR: ${message}`, error?.message || error || '');
  }
}
