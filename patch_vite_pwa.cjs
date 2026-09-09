const fs = require('fs');
let content = fs.readFileSync('vite.config.ts', 'utf8');

if (content.includes('VitePWA({') && !content.includes('maximumFileSizeToCacheInBytes')) {
  content = content.replace(
    'VitePWA({',
    `VitePWA({
        workbox: {
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        },`
  );
  fs.writeFileSync('vite.config.ts', content);
  console.log('patched vite.config.ts');
}
