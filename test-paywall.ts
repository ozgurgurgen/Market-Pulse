import { maskIpoData, maskOpportunity, maskWatchlistItems, maskStockAnalysisDetail, maskTefasFunds } from './server/utils/paywallMasker.ts';

console.log("--- PAYWALL MASKER VERIFICATION ---");
console.log("| Function                  | Feature Flag Checked   | Behavior for Free Tier                        |");
console.log("|---------------------------|------------------------|-----------------------------------------------|");
console.log("| maskIpoData               | ipoTracker             | Masks deep financial/valuation metrics        |");
console.log("| maskOpportunity           | opportunityScanner     | Masks opportunities beyond limit (default 3)  |");
console.log("| maskWatchlistItems        | watchlist              | Masks metrics for items beyond limit (5)      |");
console.log("| maskStockAnalysisDetail   | peerComparison         | Masks risk metrics and target prices          |");
console.log("| maskTefasFunds            | advancedFundMetrics    | Masks historic return data for > 3 funds      |");

const mockIpo = { financial_health: 'good', qualitative: { free_float_pct: 20 } };
console.log("\n1. maskIpoData (free tier)");
console.log(maskIpoData(mockIpo, 'free'));

const mockOpp = { id: 1, symbol: 'THYAO', targetPrice: 100 };
console.log("\n2. maskOpportunity (index 4, free tier)");
console.log(maskOpportunity(mockOpp, 4, 'free'));

const mockFunds = [{}, {}, {}, { return1Y: 50 }];
console.log("\n3. maskTefasFunds (4 funds, free tier)");
console.log(maskTefasFunds(mockFunds, 'free')[3]);
