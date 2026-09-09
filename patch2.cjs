const fs = require('fs');
let html = fs.readFileSync('dist/index.html', 'utf8');
const script = `
<script>
window.addEventListener('error', function(e) {
  fetch('/api/health?error=' + encodeURIComponent(e.message));
});
window.addEventListener('unhandledrejection', function(e) {
  fetch('/api/health?error=' + encodeURIComponent(e.reason ? e.reason.stack || e.reason : 'unknown'));
});
</script>
`;
html = html.replace('</head>', script + '</head>');
fs.writeFileSync('dist/index.html', html);
