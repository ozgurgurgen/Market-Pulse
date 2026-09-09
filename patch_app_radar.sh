#!/bin/bash
sed -i -e 's/const res = await fetch(\`\/api\/ai\/opportunities?category=${cat}\`);/const scopeParam = modelConfig.radarScope === "FAVORITES" ? "\&scope=FAVORITES\&favorites=" + watchlist.map(w => w.symbol).join(",") : "";\n      const res = await fetch(\`\/api\/ai\/opportunities?category=${cat}${scopeParam}\`);/' src/App.tsx

sed -i -e '/<OpportunityScanner/a \
              radarLayout={modelConfig.radarLayout}\
' src/App.tsx
