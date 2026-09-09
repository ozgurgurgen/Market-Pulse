API_KEY=$(cat firebase-applet-config.json | grep -o '"apiKey": *"[^"]*"' | cut -d'"' -f4)
PROJECT_ID=$(cat firebase-applet-config.json | grep -o '"projectId": *"[^"]*"' | cut -d'"' -f4)
DB_ID=$(cat firebase-applet-config.json | grep -o '"firestoreDatabaseId": *"[^"]*"' | cut -d'"' -f4)

SIGNUP_RES=$(curl -s -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=$API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"escalator_'$(date +%s)'@example.com","password":"password123","returnSecureToken":true}')
ID_TOKEN=$(echo "$SIGNUP_RES" | grep -o '"idToken": *"[^"]*"' | cut -d'"' -f4)
USER_UID=$(echo "$SIGNUP_RES" | grep -o '"localId": *"[^"]*"' | cut -d'"' -f4)

echo "Created user UID: $USER_UID"

echo "Attempting to create doc (Allowed)..."
curl -s -X PATCH -H "Authorization: Bearer $ID_TOKEN" -H "Content-Type: application/json" \
  "https://firestore.googleapis.com/v1/projects/$PROJECT_ID/databases/$DB_ID/documents/users/$USER_UID?updateMask.fieldPaths=name" \
  -d '{"fields": {"name": {"stringValue": "Normal User"}}}' 

echo "Attempting to escalate role to admin (Should fail)..."
curl -s -X PATCH -H "Authorization: Bearer $ID_TOKEN" -H "Content-Type: application/json" \
  "https://firestore.googleapis.com/v1/projects/$PROJECT_ID/databases/$DB_ID/documents/users/$USER_UID?updateMask.fieldPaths=role" \
  -d '{"fields": {"role": {"stringValue": "admin"}}}' | grep -o "PERMISSION_DENIED" || echo "Escalation successful?!"
