// REWRITTEN: Removing all external sources
export class QuoteSourceManager {
  static async getQuote(symbol: string, basePrice?: number, category?: string) {
    return null;
  }
  static async healthCheckAll() {
    return { status: 'disabled' };
  }
}
