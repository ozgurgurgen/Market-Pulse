const fs = require('fs');
let code = fs.readFileSync('server/intelligence/telegramService.ts', 'utf8');

code = code.replace(
  'async checkAndNotify(report: IntelligenceReport): Promise<boolean> {',
  'async checkAndNotify(report: IntelligenceReport, chatIdOverride?: string): Promise<boolean> {'
);

code = code.replace(
  'const success = await this.sendDevelopmentAlert(report.ticker, {',
  'const success = await this.sendDevelopmentAlert(report.ticker, {'
); // oops

code = code.replace(
  'async sendDevelopmentAlert(ticker: string, dev: KeyDevelopment): Promise<boolean> {',
  'async sendDevelopmentAlert(ticker: string, dev: KeyDevelopment, chatIdOverride?: string): Promise<boolean> {'
);

code = code.replace(
  'return this.sendMessage(message, ticker, dev.title, dev.impact_score, dev.severity);',
  'return this.sendMessage(message, ticker, dev.title, dev.impact_score, dev.severity, chatIdOverride);'
);

// wait, in checkAndNotify:
code = code.replace(
  '    const success = await this.sendDevelopmentAlert(report.ticker, {',
  '    const success = await this.sendDevelopmentAlert(report.ticker, {'
); 
// I need to properly regex replace checkAndNotify calls inside.
fs.writeFileSync('server/intelligence/telegramService.ts', code);
