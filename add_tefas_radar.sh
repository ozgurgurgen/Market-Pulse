#!/bin/bash
sed -i -e '/app.post('"'"'\/api\/tefas\/analyze'"'"'/i \
app.get("/api/ai/tefas-opportunities", async (req, res) => {\
  try {\
    // Get top performing funds from TEFAS_FUNDS\
    const funds = Array.from(TEFAS_FUNDS).sort((a, b) => b.return1Y - a.return1Y).slice(0, 5);\
    const opportunitiesData = funds.map(fund => {\
      return {\
        id: "opp-" + fund.code.toLowerCase(),\
        symbol: fund.code,\
        name: fund.name,\
        exchange: "TEFAS",\
        category: "FUND",\
        signalType: fund.inflationBeat1Y > 20 ? "STRONG_BUY" : "BUY",\
        strategy: "Enflasyon Üzeri Getiri & Sharpe Rasyosu",\
        confidenceScore: Math.min(99, Math.round(70 + (fund.sharpeRatio * 10))),\
        currentPrice: fund.price,\
        entryPrice: fund.price,\
        targetPrice1: Number((fund.price * 1.2).toFixed(2)),\
        targetPrice2: Number((fund.price * 1.5).toFixed(2)),\
        stopLoss: Number((fund.price * 0.9).toFixed(2)),\
        riskRewardRatio: "1:3.5",\
        timeframe: fund.horizon === "LONG" ? "Uzun Vade (1-5 Yıl)" : "Orta Vade (3-12 Ay)",\
        keyCatalysts: [\
          `${fund.categoryLabel} kategorisinde güçlü konum`,\
          `Yıllık enflasyon üzeri net %${fund.inflationBeat1Y} getiri`,\
          `Stopaj Avantajı: %${fund.withholdingTax}`\
        ],\
        technicalSummary: {\
          rsi: 60,\
          macd: "Trend Devam Ediyor",\
          trend: fund.horizon,\
          support: Number((fund.price * 0.95).toFixed(2)),\
          resistance: Number((fund.price * 1.05).toFixed(2))\
        },\
        newsSentiment: "Pozitif",\
        summary: `${fund.founder} yönetimi altındaki ${fund.code} fonu son 1 yılda %${fund.return1Y} getiri ile güçlü performans sergiledi.`\
      };\
    });\
    return res.json({ opportunities: opportunitiesData, generatedAt: new Date().toISOString(), modelUsed: "TEFAS Kantitatif Motor" });\
  } catch (error: any) {\
    res.status(500).json({ error: error.message });\
  }\
});\
\
' server.ts
