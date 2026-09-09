#!/bin/bash
sed -i -e 's/if (isOpen &&/if (/g' src/components/StockAnalysisModal.tsx
sed -i -e 's/, isOpen//g' src/components/StockAnalysisModal.tsx
sed -i -e 's/\[isOpen, /\[/g' src/components/StockAnalysisModal.tsx
