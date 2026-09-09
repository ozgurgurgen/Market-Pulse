#!/bin/bash
sed -i -e '/interface MarketNewsSectionProps {/a \
  tickerSpeed?: number;\
' src/components/MarketNewsSection.tsx

sed -i -e 's/onSelectSymbol }/onSelectSymbol, tickerSpeed = 90 }/g' src/components/MarketNewsSection.tsx

sed -i -e 's/<div className="animate-marquee-infinite flex items-center gap-8 py-0.5 text-xs">/<div className="animate-marquee-infinite flex items-center gap-8 py-0.5 text-xs" style={{ animationDuration: `${tickerSpeed}s` }}>/g' src/components/MarketNewsSection.tsx

sed -i -e 's/<MarketNewsSection news={news} onSelectSymbol={handleSelectSymbolFromNews} \/>/<MarketNewsSection news={news} onSelectSymbol={handleSelectSymbolFromNews} tickerSpeed={modelConfig.tickerSpeed || 90} \/>/g' src/App.tsx
