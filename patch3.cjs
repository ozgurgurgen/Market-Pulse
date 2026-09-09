const fs = require('fs');
let html = fs.readFileSync('dist/index.html', 'utf8');
const script = `
<script>
console.log('HTML ROOT SCRIPT EXECUTED');
window.addEventListener('load', () => {
  setTimeout(() => {
    console.log('ROOT CHECK:', document.getElementById('root').innerHTML.substring(0, 50));
  }, 2000);
});
</script>
`;
html = html.replace('</head>', script + '</head>');
fs.writeFileSync('dist/index.html', html);
