const fs = require('fs');
let text = fs.readFileSync('server.ts', 'utf8');

text = text.replace(
  "import { requireAuth } from './server/middlewares/authMiddleware';",
  "import { requireAuth, requirePermission } from './server/middlewares/authMiddleware';"
);

text = text.replace(
  "app.use('/api/stock', stockDetailRouter);",
  "app.use('/api/stock', requirePermission('screener.access'), stockDetailRouter);"
);

text = text.replace(
  "app.use('/api', advancedFeaturesRouter);",
  "app.use('/api/academy', requirePermission('academy.access'));\napp.use('/api/screener', requirePermission('screener.access'));\napp.use('/api', advancedFeaturesRouter);"
);

fs.writeFileSync('server.ts', text);
