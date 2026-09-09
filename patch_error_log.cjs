const fs = require('fs');
const file = 'server/services/adminConfigService.ts';
let code = fs.readFileSync(file, 'utf8');

const target = `export class CriticalSecurityError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'CriticalSecurityError';
  }
}`;

const replace = `export class CriticalSecurityError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'CriticalSecurityError';
    
    // MODÜL 2: Structured Logging for Critical Alerts (e.g. for GCP Cloud Logging)
    console.error(JSON.stringify({
      severity: 'CRITICAL',
      type: 'SECURITY_FAILURE',
      message: this.message,
      originalError: originalError?.message || originalError?.toString(),
      timestamp: new Date().toISOString()
    }));
  }
}`;

const newCode = code.replace(target, replace);
fs.writeFileSync(file, newCode);
