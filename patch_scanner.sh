#!/bin/bash
sed -i -e '/activeCategory: string;/i \  radarLayout?: "GRID" | "LIST";' src/components/OpportunityScanner.tsx
sed -i -e '/activeCategory,/a \  radarLayout = "GRID",' src/components/OpportunityScanner.tsx
