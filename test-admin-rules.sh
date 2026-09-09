API_KEY=$(cat firebase-applet-config.json | grep -o '"apiKey": *"[^"]*"' | cut -d'"' -f4)
PROJECT_ID=$(cat firebase-applet-config.json | grep -o '"projectId": *"[^"]*"' | cut -d'"' -f4)
DB_ID=$(cat firebase-applet-config.json | grep -o '"firestoreDatabaseId": *"[^"]*"' | cut -d'"' -f4)

SIGNUP_RES=$(curl -s -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=$API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin_'$(date +%s)'@example.com","password":"password123","returnSecureToken":true}')
ID_TOKEN=$(echo "$SIGNUP_RES" | grep -o '"idToken": *"[^"]*"' | cut -d'"' -f4)
USER_UID=$(echo "$SIGNUP_RES" | grep -o '"localId": *"[^"]*"' | cut -d'"' -f4)

echo "Created user UID: $USER_UID"

echo "Setting role to admin..."
node -e "
import('./server/services/firebaseClientService.ts').then(async (m) => {
  const { doc, setDoc } = await import('firebase/firestore');
  await setDoc(doc(m.serverDb, 'users', '$USER_UID'), { role: 'admin' }, { merge: true });
  process.exit(0);
});
"

echo "--- TEST 1: READ ADMIN CONFIG ---"
curl -s -H "Authorization: Bearer $ID_TOKEN" \
  "https://firestore.googleapis.com/v1/projects/$PROJECT_ID/databases/$DB_ID/documents/adminConfig/general" | grep -o "PERMISSION_DENIED" || echo "Read adminConfig successful!"

echo "--- TEST 2: WRITE ADMIN CONFIG ---"
curl -s -X PATCH -H "Authorization: Bearer $ID_TOKEN" -H "Content-Type: application/json" \
  "https://firestore.googleapis.com/v1/projects/$PROJECT_ID/databases/$DB_ID/documents/adminConfig/general?updateMask.fieldPaths=test_admin" \
  -d '{"fields": {"test_admin": {"stringValue": "ok"}}}' | grep -o "PERMISSION_DENIED" || echo "Write adminConfig successful!"

