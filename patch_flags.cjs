const fs = require('fs');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/peerComparison/g, 'advancedStockMetrics');
  fs.writeFileSync(filePath, content);
}

replaceInFile('src/types.ts');
replaceInFile('src/shared/subscriptionPlans.ts');
replaceInFile('src/components/admin/AdminSubscriptionTuningTab.tsx');
replaceInFile('server/utils/paywallMasker.ts');
