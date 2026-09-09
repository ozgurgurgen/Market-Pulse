const fs = require('fs');
let text = fs.readFileSync('server.ts', 'utf8');

text = text.replace(
  "app.use(express.json());",
  "app.use(express.json());\n\nimport { requireAuth } from './server/middlewares/authMiddleware';\napp.use('/api', requireAuth);"
);

fs.writeFileSync('server.ts', text);
