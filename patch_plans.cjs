const fs = require('fs');
let content = fs.readFileSync('src/shared/subscriptionPlans.ts', 'utf8');

// Add properties to interface
content = content.replace(
  'peerComparison: boolean;',
  'peerComparison: boolean;\n  opportunityScanner: boolean;\n  advancedFundMetrics: boolean;'
);

// Add to free
content = content.replace(
  /cronDigest: false,\s*peerComparison: false,\s*portfolioMaxAssets/g,
  'cronDigest: false,\n      peerComparison: false,\n      opportunityScanner: false,\n      advancedFundMetrics: false,\n      portfolioMaxAssets'
);

// Add to starter
content = content.replace(
  /cronDigest: false,\s*peerComparison: false,\s*portfolioMaxAssets/g,
  'cronDigest: false,\n      peerComparison: false,\n      opportunityScanner: false,\n      advancedFundMetrics: false,\n      portfolioMaxAssets'
);

// Add to pro
content = content.replace(
  /cronDigest: true,\s*peerComparison: true,\s*portfolioMaxAssets/g,
  'cronDigest: true,\n      peerComparison: true,\n      opportunityScanner: true,\n      advancedFundMetrics: true,\n      portfolioMaxAssets'
);

// Add to premium
content = content.replace(
  /cronDigest: true,\s*peerComparison: true,\s*portfolioMaxAssets/g,
  'cronDigest: true,\n      peerComparison: true,\n      opportunityScanner: true,\n      advancedFundMetrics: true,\n      portfolioMaxAssets'
);

fs.writeFileSync('src/shared/subscriptionPlans.ts', content);
