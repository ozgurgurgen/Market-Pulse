#!/bin/bash
sed -i -e '/const quotesMap = await fetchLiveMarketQuotes({ symbols });/c \
    const quotes = await Promise.all(symbols.map((s: string) => getLiveQuoteForSymbol(s)));\
    res.json({ quotes: quotes.filter(Boolean) });\
' server.ts
