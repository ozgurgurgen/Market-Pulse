const fs = require('fs');
let text = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

text = text.replace(
  "GraduationCap\n} from 'lucide-react';",
  "GraduationCap,\n  ShieldAlert\n} from 'lucide-react';"
);

fs.writeFileSync('src/components/Sidebar.tsx', text);
