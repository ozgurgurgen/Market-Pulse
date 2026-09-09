const fs = require('fs');
let text = fs.readFileSync('server.ts', 'utf8');

text = text.replace(
  "validate: { xForwardedForHeader: false, default: true }",
  "validate: { trustProxy: false, xForwardedForHeader: false, default: true }"
);

fs.writeFileSync('server.ts', text);
