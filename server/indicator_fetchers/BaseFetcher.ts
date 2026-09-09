import { EconomicIndicator } from './types';

export interface BaseFetcher {
  readonly name: string;
  readonly sourceApi: EconomicIndicator['source_api'];
  fetchIndicators(): Promise<EconomicIndicator[]>;
}
