API_KEY=$(cat firebase-applet-config.json | grep -o '"apiKey": *"[^"]*"' | cut -d'"' -f4)
PROJECT_ID=$(cat firebase-applet-config.json | grep -o '"projectId": *"[^"]*"' | cut -d'"' -f4)
DB_ID=$(cat firebase-applet-config.json | grep -o '"firestoreDatabaseId": *"[^"]*"' | cut -d'"' -f4)

SIGNUP_RES=$(curl -s -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=$API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"test_'$(date +%s)'@example.com","password":"password123","returnSecureToken":true}')

ID_TOKEN=$(echo "$SIGNUP_RES" | grep -o '"idToken": *"[^"]*"' | cut -d'"' -f4)
USER_UID=$(echo "$SIGNUP_RES" | grep -o '"localId": *"[^"]*"' | cut -d'"' -f4)

if [ -z "$ID_TOKEN" ]; then
  echo "Failed to sign up."
  echo "$SIGNUP_RES"
  exit 1
fi

echo "Created user UID: $USER_UID"

echo "--- TEST 1: READ OWN DOC ---"
curl -s -H "Authorization: Bearer $ID_TOKEN" \
  "https://firestore.googleapis.com/v1/projects/$PROJECT_ID/databases/$DB_ID/documents/users/$USER_UID" | grep -o "PERMISSION_DENIED" || echo "Read own doc successful!"

echo "--- TEST 2: WRITE OWN DOC ---"
curl -s -X PATCH -H "Authorization: Bearer $ID_TOKEN" -H "Content-Type: application/json" \
  "https://firestore.googleapis.com/v1/projects/$PROJECT_ID/databases/$DB_ID/documents/users/$USER_UID?updateMask.fieldPaths=role" \
  -d '{"fields": {"role": {"stringValue": "standard_user"}}}' | grep -o "PERMISSION_DENIED" || echo "Write own doc successful!"

echo "--- TEST 3: READ OTHER DOC ---"
curl -s -H "Authorization: Bearer $ID_TOKEN" \
  "https://firestore.googleapis.com/v1/projects/$PROJECT_ID/databases/$DB_ID/documents/users/some_other_uid" | grep -o "PERMISSION_DENIED" || echo "Read other doc allowed?!"

echo "--- TEST 4: WRITE ADMIN CONFIG ---"
curl -s -X PATCH -H "Authorization: Bearer $ID_TOKEN" -H "Content-Type: application/json" \
  "https://firestore.googleapis.com/v1/projects/$PROJECT_ID/databases/$DB_ID/documents/adminConfig/general" \
  -d '{"fields": {"foo": {"stringValue": "bar"}}}' | grep -o "PERMISSION_DENIED" || echo "Write adminConfig allowed?!"

