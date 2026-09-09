const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(/      if \(scope === "FAVORITES" && favorites.length > 0\) \{\n        targetAssets = targetAssets.filter\(a => favorites.includes\(a.symbol\)\);\n      \}\n      \}\n      \}/, '      if (scope === "FAVORITES" && favorites.length > 0) {\n        targetAssets = targetAssets.filter(a => favorites.includes(a.symbol));\n      }');
fs.writeFileSync('server.ts', content);
