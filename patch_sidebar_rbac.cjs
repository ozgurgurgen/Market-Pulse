const fs = require('fs');
let text = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

text = text.replace(
  "import { Target, Activity, Search, Shield, BookOpen, LineChart, MessageSquare, ListTodo, Settings, ChevronRight, X, Radar, Globe } from 'lucide-react';",
  "import { Target, Activity, Search, Shield, BookOpen, LineChart, MessageSquare, ListTodo, Settings, ChevronRight, X, Radar, Globe, ShieldAlert } from 'lucide-react';\nimport { useAuth } from '../contexts/AuthContext';"
);

text = text.replace(
  "export const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose, watchlistCount }: SidebarProps) => {",
  "export const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose, watchlistCount }: SidebarProps) => {\n  const { hasPermission } = useAuth();"
);

text = text.replace(
  "id: 'settings', label: 'Ayarlar', icon: Settings }",
  "id: 'settings', label: 'Ayarlar', icon: Settings },\n    { id: 'admin', label: 'Admin Panel', icon: ShieldAlert, permission: 'admin.panel' }"
);

text = text.replace(
  "return (",
  `const filteredMenu = menuItems.filter(item => {
    if ((item as any).permission) {
      return hasPermission((item as any).permission);
    }
    return true;
  });\n\n  return (`
);

text = text.replace(
  "menuItems.map((item)",
  "filteredMenu.map((item)"
);

fs.writeFileSync('src/components/Sidebar.tsx', text);
