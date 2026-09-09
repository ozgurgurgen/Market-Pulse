#!/bin/bash
sed -i -e '/if (!opportunitiesData || opportunitiesData.length === 0) {/a \
      let targetAssets = category === "ALL" ? MARKET_ASSETS : MARKET_ASSETS.filter(a => a.category === category);\
      if (scope === "FAVORITES" && favorites.length > 0) {\
        targetAssets = targetAssets.filter(a => favorites.includes(a.symbol));\
      }\
' server.ts
