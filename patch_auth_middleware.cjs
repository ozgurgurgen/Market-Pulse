const fs = require('fs');
let text = fs.readFileSync('server/middlewares/authMiddleware.ts', 'utf8');

text = text.replace(
  "import { adminAuth, adminDb } from '../services/firebaseAdminService';",
  "import { adminAuth } from '../services/firebaseAdminService';"
);

// We need to replace the db logic inside requireAuth
const requireAuthOriginal = `    // Also attach user role
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    if (userDoc.exists) {
      req.userRole = userDoc.data()?.role || 'standard_user';
    } else {
      req.userRole = 'standard_user';
    }`;

const requireAuthNew = `    // Also attach user role via REST API
    const PROJECT_ID = 'famous-phalanx-413107';
    const DB_ID = 'ai-studio-marketpulseaitef-9befce23-8089-4716-9c4d-feabc89be875';
    const url = \`https://firestore.googleapis.com/v1/projects/\${PROJECT_ID}/databases/\${DB_ID}/documents/users/\${decodedToken.uid}\`;
    
    try {
      const res = await fetch(url, { headers: { Authorization: \`Bearer \${idToken}\` } });
      if (res.ok) {
        const data = await res.json();
        req.userRole = data.fields?.role?.stringValue || 'standard_user';
      } else {
        req.userRole = 'standard_user';
      }
    } catch(e) {
      req.userRole = 'standard_user';
    }
    req.idToken = idToken; // Save token for role fetching
`;

text = text.replace(requireAuthOriginal, requireAuthNew);

// Add idToken to global Express Request
text = text.replace(
  "userRole?: string;\n    }",
  "userRole?: string;\n      idToken?: string;\n    }"
);

// We need to replace the db logic inside requirePermission
const requirePermOriginal = `      // Get role permissions
      const roleDoc = await adminDb.collection('roles').doc(req.userRole).get();
      
      let hasPermission = false;
      if (roleDoc.exists) {
        const roleData = roleDoc.data();
        const permissions = roleData?.permissions || [];
        if (permissions.includes(requiredPermission) || permissions.includes('admin.*')) {
          hasPermission = true;
        }
      }`;

const requirePermNew = `      // Get role permissions via REST API
      const PROJECT_ID = 'famous-phalanx-413107';
      const DB_ID = 'ai-studio-marketpulseaitef-9befce23-8089-4716-9c4d-feabc89be875';
      const url = \`https://firestore.googleapis.com/v1/projects/\${PROJECT_ID}/databases/\${DB_ID}/documents/roles/\${req.userRole}\`;
      
      let hasPermission = false;
      try {
        const res = await fetch(url, { headers: { Authorization: \`Bearer \${req.idToken}\` } });
        if (res.ok) {
          const data = await res.json();
          const permissionsArray = data.fields?.permissions?.arrayValue?.values || [];
          const permissions = permissionsArray.map((v: any) => v.stringValue);
          
          if (permissions.includes(requiredPermission) || permissions.includes('admin.*')) {
            hasPermission = true;
          }
        }
      } catch(e) {
        console.error('REST API Role fetch error', e);
      }`;

text = text.replace(requirePermOriginal, requirePermNew);

fs.writeFileSync('server/middlewares/authMiddleware.ts', text);
