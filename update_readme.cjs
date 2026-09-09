const fs = require('fs');
let content = fs.readFileSync('server/README_DEPLOYMENT.md', 'utf8');

const replacement = `
## 🚨 Critical Security Alerts & Log-Based Metrics (Manual Verification Required)

The \`CriticalSecurityError\` (now unified across all RBAC and billing paths) outputs structured single-line JSON logs with \`severity: 'CRITICAL'\`. 
To ensure no silent RBAC or billing failures occur in production, you **MUST** set up a Log-Based Alert in GCP after deployment.

### Setup Instructions (GCP Cloud Logging)

*Note: This configuration is prepared in the source code but must be actively applied and verified in your GCP Production Environment.*

**1. Locate your Notification Channel ID**
Find your preferred notification channel (e.g., Slack, Email) in GCP:
\`\`\`bash
gcloud beta monitoring channels list
# Note the channel name (e.g., projects/YOUR_PROJECT/notificationChannels/123456789)
\`\`\`

**2. Update the Policy JSON File**
Edit \`server/rbac-alert-policy.json\` and replace \`[YOUR_PROJECT_ID]\` and \`[YOUR_CHANNEL_ID]\` with your actual values.

**3. Create the Alerting Policy**
Configure the alert using the JSON file to notify your team immediately when a structured critical log is emitted:
\`\`\`bash
gcloud alpha monitoring policies create --policy-from-file=server/rbac-alert-policy.json
\`\`\`

**4. Post-Deploy Verification**
After deploying to production:
1. Temporarily revoke the Datastore read/write IAM permission from your Cloud Run service account.
2. Hit an admin route.
3. Verify that a \`CRITICAL\` alert is sent to your Slack/Email channel.
4. Restore the IAM permission.
`;

const startIndex = content.indexOf('## 🚨 Critical Security Alerts & Log-Based Metrics');
if (startIndex !== -1) {
    content = content.substring(0, startIndex) + replacement;
    fs.writeFileSync('server/README_DEPLOYMENT.md', content);
} else {
    fs.appendFileSync('server/README_DEPLOYMENT.md', replacement);
}
