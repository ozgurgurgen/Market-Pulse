const fs = require('fs');
let text = fs.readFileSync('src/App.tsx', 'utf8');
text = text.replace(
  "fetchOpportunities('ALL');\n    fetchNews();\n\n    const interval = setInterval(() => {",
  "fetchNews();\n\n    const interval = setInterval(() => {"
);
text = text.replace(
  "  }, [fetchQuotes, fetchNews]);",
  "  }, [fetchQuotes, fetchNews]);\n\n  useEffect(() => {\n    fetchOpportunities(selectedCategory);\n  }, [fetchOpportunities]);"
);
fs.writeFileSync('src/App.tsx', text);
