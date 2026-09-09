#!/bin/bash
cat src/components/MarketNewsSection.tsx | sed '/\/\/ Live Continuous Stream Flow Interval/,/}, streamSpeed);/d' > temp.tsx
mv temp.tsx src/components/MarketNewsSection.tsx
