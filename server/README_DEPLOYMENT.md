# Deployment Checklist & Security Guidelines

## ⚠️ CRITICAL SECURITY WARNING: Admin SDK Connectivity

During development in the AI Studio preview environment (or any environment lacking GCP Application Default Credentials), the Firebase Admin SDK (`adminDb`) **cannot authenticate to Firestore** automatically. 

**This environment lacks a valid `serviceAccountKey.json`.**

As a strict security measure (Phase 2 constraint), our auth and billing services (`adminConfigService.ts`, `firebaseAdminService.ts`) are programmed to **FAIL LOUDLY (throw `CriticalSecurityError`)** if they cannot reach Firestore. They will **NOT** silently fall back to `serverLocalDatabase` for critical operations like `getUserRole` or `getDynamicSubscriptionPlans`. 

### Why?
If a user's role is demoted in Firestore but the local cache is stale, falling back to local cache would allow an unauthorized user to retain privileges.

### Deployment Requirements
Before or immediately after deploying to a production/staging GCP environment (like Cloud Run):
1. Ensure the compute instance has a **Service Account** attached that has `roles/datastore.user` (or equivalent Firestore read/write permissions).
2. Or provide the `GOOGLE_APPLICATION_CREDENTIALS` environment variable pointing to a valid service account JSON file.
3. **MANDATORY VERIFICATION**: After initial deployment, verify that the server logs do NOT show `CriticalSecurityError` and that admin configuration is successfully read from and written to Firestore.

### Non-Critical Services
Services that purely log data or analytics (like `auditService.ts`, `dataIntegrityService.ts`) are allowed to use `serverLocalDatabase` as a fallback buffer to prevent data loss. They do not dictate access control, so silent fallback here is permitted.


## 🚨 Critical Security Alerts & Log-Based Metrics (Manual Verification Required)

The `CriticalSecurityError` (now unified across all RBAC and billing paths) outputs structured single-line JSON logs with `severity: 'CRITICAL'`. 
To ensure no silent RBAC or billing failures occur in production, you **MUST** set up a Log-Based Alert in GCP after deployment.

### Setup Instructions (GCP Cloud Logging)

*Note: This configuration is prepared in the source code but must be actively applied and verified in your GCP Production Environment.*

**1. Locate your Notification Channel ID**
Find your preferred notification channel (e.g., Slack, Email) in GCP:
```bash
gcloud beta monitoring channels list
# Note the channel name (e.g., projects/YOUR_PROJECT/notificationChannels/123456789)
```

**2. Update the Policy JSON File**
Edit `server/rbac-alert-policy.json` and replace `[YOUR_PROJECT_ID]` and `[YOUR_CHANNEL_ID]` with your actual values.

**3. Create the Alerting Policy**
Configure the alert using the JSON file to notify your team immediately when a structured critical log is emitted:
```bash
gcloud alpha monitoring policies create --policy-from-file=server/rbac-alert-policy.json
```

**4. Post-Deploy Verification**
After deploying to production:
1. Temporarily revoke the Datastore read/write IAM permission from your Cloud Run service account.
2. Hit an admin route.
3. Verify that a `CRITICAL` alert is sent to your Slack/Email channel.
4. Restore the IAM permission.
