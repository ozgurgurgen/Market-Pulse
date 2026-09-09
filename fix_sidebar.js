const fs = require('fs');
let content = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
content = content.replace(/  \{ \n  \{ \n    id: "settings",/g, '  {\n    id: "settings",');
fs.writeFileSync('src/components/Sidebar.tsx', content);
