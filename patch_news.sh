#!/bin/bash
sed -i -e '/let newsList = \[...INITIAL_MARKET_NEWS\];/c \
    let newsList = [...INITIAL_MARKET_NEWS];\
    if (search) {\
      try {\
        const yahooFinance = require("yahoo-finance2").default;\
        const yfNews = await yahooFinance.search(search, { newsCount: 5 });\
        if (yfNews.news && yfNews.news.length > 0) {\
          const dynamicNews = yfNews.news.map((item: any, i: number) => ({\
            id: `yf-news-${Date.now()}-${i}`,\
            title: item.title,\
            summary: item.publisher,\
            source: item.publisher || "Yahoo Finance",\
            time: "Yeni",\
            url: item.link,\
            relatedSymbols: [search],\
            impact: "NEUTRAL",\
            category: "GLOBAL"\
          }));\
          newsList = [...dynamicNews, ...newsList];\
        }\
      } catch (e) {}\
    }\
' server.ts
