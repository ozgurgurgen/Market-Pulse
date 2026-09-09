const fs = require('fs');
let text = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

const adminTab = `  {
    id: "admin",
    label: "Admin Panel",
    shortLabel: "Admin",
    icon: ShieldAlert,
    description: "Yetki, Roller ve Platform Ayarları",
    permission: 'admin.panel'
  },
`;

text = text.replace(
  "export const MAIN_NAVIGATION_TABS: TabItem[] = [",
  "export const MAIN_NAVIGATION_TABS: TabItem[] = [\n" + adminTab
);

fs.writeFileSync('src/components/Sidebar.tsx', text);
