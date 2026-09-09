const fs = require('fs');
const content = fs.readFileSync('server.ts', 'utf8');

if (!content.includes('import \'./server/intelligence/scheduledDigest.ts\';') && !content.includes('import "./server/intelligence/scheduledDigest.ts";')) {
  const target = "app.post('/api/telegram/link-token'";
  const parts = content.split(target);
  
  if (parts.length === 2) {
    fs.writeFileSync('server.ts', parts[0] + "import './server/intelligence/scheduledDigest.ts';\n\n" + target + parts[1]);
    console.log('patched server.ts with scheduledDigest');
  } else {
    // maybe try replacing the startServer function call
    const startStr = "async function startServer() {";
    const newContent = content.replace(startStr, "import './server/intelligence/scheduledDigest.ts';\n" + startStr);
    fs.writeFileSync('server.ts', newContent);
    console.log('patched server.ts with scheduledDigest at startServer');
  }
}
