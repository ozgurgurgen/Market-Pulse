#!/bin/bash
sed -i -e 's/className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"/className={radarLayout === "LIST" ? "flex flex-col space-y-4" : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"}/' src/components/OpportunityScanner.tsx
