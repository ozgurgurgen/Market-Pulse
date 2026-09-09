const fs = require('fs');
let text = fs.readFileSync('server/middlewares/authMiddleware.ts', 'utf8');

text = text.replace(
  "import { adminAuth, adminDb } from '../services/firebaseAdminService';",
  "import { adminAuth, adminDb } from '../services/firebaseAdminService';\nimport { logAudit } from '../services/auditService';"
);

text = text.replace(
  "return res.status(403).json({ error: `Forbidden: Requires ${requiredPermission} permission` });",
  "logAudit('AUTHORIZATION_FAILURE', req.user.uid, `Failed to access endpoint requiring ${requiredPermission}`);\n        return res.status(403).json({ error: `Forbidden: Requires ${requiredPermission} permission` });"
);

fs.writeFileSync('server/middlewares/authMiddleware.ts', text);
