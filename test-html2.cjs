const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`Console Error: ${msg.text()}`);
    } else {
      console.log(`Page log: ${msg.text()}`);
    }
  });
  page.on('pageerror', error => {
    errors.push(`Page Error: ${error.message}`);
  });
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
  
  const rootHtml = await page.evaluate(() => document.getElementById('root')?.innerHTML || 'NO_ROOT');
  console.log('Root HTML length:', rootHtml.length);
  if (rootHtml.length < 50) {
    console.log('Root HTML:', rootHtml);
  }
  
  console.log('Errors caught:', errors);
  
  await browser.close();
})();
