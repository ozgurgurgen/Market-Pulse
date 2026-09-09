#!/bin/bash
sed -i -e '/const { message, modelConfig } = req.body;/a \
\
    const { quotes: liveQuotes } = await fetchLiveMarketQuotes({});\
    const marketContext = liveQuotes.map(q => `${q.symbol}: ${q.currentPrice} ${q.currency} (%${q.change24hPercent})`).join(", ");\
\
    const dynamicPrompt = CHATBOT_SYSTEM_PROMPT_V3 + "\\n\\n# CANLI PİYASA VERİLERİ (GÜNCEL DURUM)\\nŞu anki aktif fiyatlamalar: " + marketContext;\
' server.ts
sed -i -e 's/systemPrompt: CHATBOT_SYSTEM_PROMPT_V3,/systemPrompt: dynamicPrompt,/g' server.ts
