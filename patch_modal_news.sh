#!/bin/bash
sed -i -e '/const relatedNews = news/c \
  const [dynamicNews, setDynamicNews] = useState<any[]>([]);\
  useEffect(() => {\
    if (isOpen && analysis?.symbol && activeTab === "news") {\
      fetch(`/api/market/news?search=${analysis.symbol}`)\
        .then(res => res.json())\
        .then(data => {\
           const rNews = data.news.filter((n: any) => n.relatedSymbols.includes(analysis.symbol));\
           setDynamicNews(rNews.length > 0 ? rNews : data.news.slice(0, 5));\
        });\
    }\
  }, [isOpen, analysis?.symbol, activeTab]);\
\
  const relatedNews = dynamicNews.length > 0 ? dynamicNews : news.filter(n => n.relatedSymbols.includes(analysis?.symbol || ""));\
' src/components/StockAnalysisModal.tsx
