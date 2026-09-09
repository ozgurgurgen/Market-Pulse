#!/bin/bash
sed -i -e '/app.get('"'"'\/api\/market\/quotes'"'"', async (req, res) => {/i \
app.get("/api/market/search", async (req, res) => {\
  try {\
    const query = req.query.q as string;\
    if (!query) return res.json({ quotes: [] });\
    const yahooFinance = require("yahoo-finance2").default;\
    const result = await yahooFinance.search(query);\
    const symbols = result.quotes.filter((q: any) => q.isYahooFinance).slice(0, 5).map((q: any) => q.symbol);\
    if (symbols.length === 0) return res.json({ quotes: [] });\
    const quotesMap = await fetchLiveMarketQuotes({ symbols });\
    res.json({ quotes: quotesMap.quotes });\
  } catch (error: any) {\
    res.status(500).json({ error: error.message });\
  }\
});\
' server.ts
