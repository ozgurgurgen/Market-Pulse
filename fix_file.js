const fs = require('fs');
let content = fs.readFileSync('src/components/TefasFundsSection.tsx', 'utf8');
content = content.replace(/(\s*)<\/div>\n\s*<\/div>\n\s*<\/div>/g, '$1</div>\n$1</div>');
content = content.replace(/(\s*)<\/div>\n\s*<\/div>\n/g, '$1</div>\n');
content = content.replace(/    <\/div>\n/g, ''); // just drop these weird 4 space ones that are everywhere
fs.writeFileSync('src/components/TefasFundsSection.tsx', content);
