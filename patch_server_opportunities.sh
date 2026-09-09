#!/bin/bash
sed -i -e '/const category = /a \
    const scope = req.query.scope as string || "ALL";\
    const favorites = (req.query.favorites as string || "").split(",").filter(Boolean);\
' server.ts

sed -i -e 's/const targetAssets = category === '"'"'ALL'"'"'/let targetAssets = category === '"'"'ALL'"'"'/' server.ts

sed -i -e '/targetAssets = category === '"'"'ALL'"'"'/a \
      if (scope === "FAVORITES" && favorites.length > 0) {\
        targetAssets = targetAssets.filter(a => favorites.includes(a.symbol));\
      }\
' server.ts
