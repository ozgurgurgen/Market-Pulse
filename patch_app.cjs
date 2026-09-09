const fs = require('fs');
let text = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `  const fetchOpportunities = useCallback(async (cat: MarketCategory = selectedCategory) => {
    setIsOpportunitiesLoading(true);
    try {
      const scopeParam = modelConfig.radarScope || 'ALL';
      const favoritesParam = watchlist.map(w => w.symbol).join(',');
      const { data, ok } = await safeFetchJson<{ opportunities: OpportunitySignal[] }>(\`/api/ai/opportunities?category=\${cat}&scope=\${scopeParam}&favorites=\${favoritesParam}\`);
      if (ok && data?.opportunities && Array.isArray(data.opportunities)) {
        setOpportunities(data.opportunities);
      }
    } catch {
      // fallback
    } finally {
      setIsOpportunitiesLoading(false);
    }
  }, [selectedCategory, modelConfig.radarScope, watchlist]);`;

text = text.replace(/  const fetchOpportunities = useCallback\(async \(cat: MarketCategory = selectedCategory\) => \{\n    setIsOpportunitiesLoading\(true\);\n    try \{\n      const \{ data, ok \} = await safeFetchJson<\{ opportunities: OpportunitySignal\[\] \}>\(`\/api\/ai\/opportunities\?category=\$\{cat\}`\);\n      if \(ok && data\?\.opportunities && Array\.isArray\(data\.opportunities\)\) \{\n        setOpportunities\(data\.opportunities\);\n      \}\n    \} catch \{\n      \/\/ fallback\n    \} finally \{\n      setIsOpportunitiesLoading\(false\);\n    \}\n  \}, \[selectedCategory\]\);/, replacement);
fs.writeFileSync('src/App.tsx', text);
