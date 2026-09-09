export class CriticalSecurityError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'CriticalSecurityError';
    
    // Single-line JSON output for GCP Cloud Logging (jsonPayload parsing)
    console.error(JSON.stringify({
      severity: 'CRITICAL',
      type: 'SECURITY_FAILURE',
      message: this.message,
      originalError: originalError?.message || (typeof originalError === 'string' ? originalError : String(originalError)),
      timestamp: new Date().toISOString()
    }));
  }
}
