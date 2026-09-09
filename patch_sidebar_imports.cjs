const fs = require('fs');
let text = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

if (!text.includes('useAuth')) {
  text = text.replace(
    "import { MarketCategory, AIModelConfig } from '../types';",
    "import { MarketCategory, AIModelConfig } from '../types';\nimport { useAuth } from '../contexts/AuthContext';"
  );
}

if (!text.includes('ShieldAlert')) {
  text = text.replace(
    "} from 'lucide-react';",
    "  ShieldAlert,\n} from 'lucide-react';"
  );
}

fs.writeFileSync('src/components/Sidebar.tsx', text);
