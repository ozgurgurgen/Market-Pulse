API_KEY=$(cat firebase-applet-config.json | grep -o '"apiKey": *"[^"]*"' | cut -d'"' -f4)
PROJECT_ID=$(cat firebase-applet-config.json | grep -o '"projectId": *"[^"]*"' | cut -d'"' -f4)
DB_ID=$(cat firebase-applet-config.json | grep -o '"firestoreDatabaseId": *"[^"]*"' | cut -d'"' -f4)

echo "Signing in with boschozgur@gmail.com (you must have created this or we will try to login)..."
# Just sign up / sign in
SIGNUP_RES=$(curl -s -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=$API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"boschozgur@gmail.com","password":"password123","returnSecureToken":true}')

if echo "$SIGNUP_RES" | grep -q "EMAIL_EXISTS"; then
  SIGNUP_RES=$(curl -s -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=$API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"email":"boschozgur@gmail.com","password":"password123","returnSecureToken":true}')
fi

ID_TOKEN=$(echo "$SIGNUP_RES" | grep -o '"idToken": *"[^"]*"' | cut -d'"' -f4)
USER_UID=$(echo "$SIGNUP_RES" | grep -o '"localId": *"[^"]*"' | cut -d'"' -f4)

echo "UID: $USER_UID"
echo "Creating user doc as admin..."
curl -s -X PATCH -H "Authorization: Bearer $ID_TOKEN" -H "Content-Type: application/json" \
  "https://firestore.googleapis.com/v1/projects/$PROJECT_ID/databases/$DB_ID/documents/users/$USER_UID?updateMask.fieldPaths=role" \
  -d '{"fields": {"role": {"stringValue": "admin"}}}' | grep -v "idToken"

echo -e "\n--- TEST: WRITE ADMIN CONFIG ---"
curl -s -X PATCH -H "Authorization: Bearer $ID_TOKEN" -H "Content-Type: application/json" \
  "https://firestore.googleapis.com/v1/projects/$PROJECT_ID/databases/$DB_ID/documents/adminConfig/general?updateMask.fieldPaths=test_admin" \
  -d '{"fields": {"test_admin": {"stringValue": "ok"}}}' | grep -v "idToken"
