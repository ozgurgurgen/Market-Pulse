const fs = require('fs');
let text = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

text = text.replace(
  "const filteredMenu = menuItems.filter",
  "const filteredMenu = MAIN_NAVIGATION_TABS.filter"
);

text = text.replace(
  "{MAIN_NAVIGATION_TABS.map((tab) => {",
  "{filteredMenu.map((tab) => {"
);

fs.writeFileSync('src/components/Sidebar.tsx', text);
