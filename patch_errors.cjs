const fs = require('fs');

function removeClassAndAddImport(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  
  // Find the class definition block (it's exactly known structure based on previous edits)
  const regex = /export class CriticalSecurityError extends Error \{[\s\S]*?\n\}\n/;
  code = code.replace(regex, '');
  
  // Add import at the top
  const importLine = `import { CriticalSecurityError } from '../utils/securityErrors';\n`;
  code = importLine + code;
  
  fs.writeFileSync(filePath, code);
}

removeClassAndAddImport('server/services/adminConfigService.ts');
removeClassAndAddImport('server/services/firebaseAdminService.ts');
