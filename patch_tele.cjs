const fs = require('fs');
let code = fs.readFileSync('server/intelligence/telegramService.ts', 'utf8');

code = code.replace(
  'async checkAndNotify(report: IntelligenceReport): Promise<boolean> {',
  'async checkAndNotify(report: IntelligenceReport, chatIdOverride?: string): Promise<boolean> {'
);

code = code.replace(
  `const success = await this.sendDevelopmentAlert(report.ticker, {
      ...topDev,
      severity: finalSeverity as any,
    });`,
  `const success = await this.sendDevelopmentAlert(report.ticker, {
      ...topDev,
      severity: finalSeverity as any,
    }, chatIdOverride);`
);

code = code.replace(
  'async sendDigestAlert(reports: IntelligenceReport[]): Promise<boolean> {',
  'async sendDigestAlert(reports: IntelligenceReport[], chatIdOverride?: string): Promise<boolean> {'
);
code = code.replace(
  'return this.checkAndNotify(singleReport);',
  'return this.checkAndNotify(singleReport, chatIdOverride);'
);
code = code.replace(
  `return this.sendMessage(digestText, 'BIST_DIGEST', 'Toplu Piyasa İstihbarat Özeti', 8.0, 'HIGH');`,
  `return this.sendMessage(digestText, 'BIST_DIGEST', 'Toplu Piyasa İstihbarat Özeti', 8.0, 'HIGH', chatIdOverride);`
);


code = code.replace(
  'async sendDevelopmentAlert(ticker: string, dev: KeyDevelopment): Promise<boolean> {',
  'async sendDevelopmentAlert(ticker: string, dev: KeyDevelopment, chatIdOverride?: string): Promise<boolean> {'
);
code = code.replace(
  'return this.sendMessage(message, ticker, dev.title, dev.impact_score, dev.severity);',
  'return this.sendMessage(message, ticker, dev.title, dev.impact_score, dev.severity, chatIdOverride);'
);

fs.writeFileSync('server/intelligence/telegramService.ts', code);
