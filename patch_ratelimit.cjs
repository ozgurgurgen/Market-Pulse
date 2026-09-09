const fs = require('fs');
let text = fs.readFileSync('server.ts', 'utf8');

text = text.replace(
  "message: { error: \"Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyin.\" }",
  "message: { error: \"Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyin.\" },\n  validate: { xForwardedForHeader: false, default: true }"
);

fs.writeFileSync('server.ts', text);
