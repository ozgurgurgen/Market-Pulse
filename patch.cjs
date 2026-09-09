const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const script = `
<script>
window.addEventListener('error', function(e) {
  document.body.innerHTML += '<div style="color:red; background:white; position:fixed; top:0; left:0; z-index:9999; padding:20px; width:100%; white-space:pre-wrap;">' + e.message + '\\n' + (e.error ? e.error.stack : '') + '</div>';
});
window.addEventListener('unhandledrejection', function(e) {
  document.body.innerHTML += '<div style="color:red; background:white; position:fixed; top:50%; left:0; z-index:9999; padding:20px; width:100%; white-space:pre-wrap;">Unhandled Promise: ' + (e.reason ? e.reason.stack || e.reason : 'unknown') + '</div>';
});
</script>
`;
html = html.replace('</head>', script + '</head>');
fs.writeFileSync('index.html', html);
