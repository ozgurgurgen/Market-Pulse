const { JSDOM } = require('jsdom');
const fs = require('fs');
const html = fs.readFileSync('dist/index.html', 'utf8');
const jsdom = new JSDOM(html, {
  url: 'http://localhost:3000',
  runScripts: 'dangerously',
  resources: 'usable',
});
jsdom.window.console.error = (...args) => console.log('BROWSER ERROR:', ...args);
jsdom.window.console.warn = (...args) => console.log('BROWSER WARN:', ...args);
jsdom.window.console.log = (...args) => console.log('BROWSER LOG:', ...args);
jsdom.window.addEventListener('error', (event) => {
  console.log('UNCAUGHT EXCEPTION:', event.error);
});
jsdom.window.addEventListener('unhandledrejection', (event) => {
  console.log('UNHANDLED REJECTION:', event.reason);
});
setTimeout(() => {
  console.log('Done waiting.');
  process.exit(0);
}, 5000);
