#!/bin/bash
sed -i -e '/id: '"'"'watchlist'"'"', /i \
  { \
    id: "settings", \
    label: "Ayarlar", \
    shortLabel: "Ayarlar", \
    icon: Settings, \
    description: "Uygulama tercihleri" \
  },' src/components/Sidebar.tsx
