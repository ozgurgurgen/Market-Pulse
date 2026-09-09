#!/bin/bash
sed -i -e '/let targetAssets = category === '"'"'ALL'"'"'/c \
      let targetAssets = category === "ALL" ? MARKET_ASSETS : MARKET_ASSETS.filter(a => a.category === category);\
      if (scope === "FAVORITES" && favorites.length > 0) {\
        targetAssets = targetAssets.filter(a => favorites.includes(a.symbol));\
      }\
' server.ts

sed -i -e '/if (scope === "FAVORITES"/d' server.ts
sed -i -e '/targetAssets = targetAssets.filter(a => favorites.includes(a.symbol))/d' server.ts
sed -i -e '/? MARKET_ASSETS/d' server.ts
sed -i -e '/: MARKET_ASSETS.filter(a => a.category === category);/d' server.ts
