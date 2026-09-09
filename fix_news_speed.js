const fs = require('fs');
let content = fs.readFileSync('src/components/MarketNewsSection.tsx', 'utf8');
content = content.replace(/  onSelectSymbol \n\}\) => \{/, '  onSelectSymbol,\n  tickerSpeed = 90\n}) => {');
fs.writeFileSync('src/components/MarketNewsSection.tsx', content);
