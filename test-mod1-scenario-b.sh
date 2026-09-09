PROJECT_ID=$(cat firebase-applet-config.json | grep -o '"projectId": *"[^"]*"' | cut -d'"' -f4)
DB_ID=$(cat firebase-applet-config.json | grep -o '"firestoreDatabaseId": *"[^"]*"' | cut -d'"' -f4)

echo "--- SCENARIO B: UNAUTHORIZED CLIENT ATTEMPTING ADMIN WRITE ---"
echo "Attempting to WRITE adminConfig (General user without token)"
curl -s -X PATCH -H "Content-Type: application/json" \
  "https://firestore.googleapis.com/v1/projects/$PROJECT_ID/databases/$DB_ID/documents/adminConfig/subscriptionPlans?updateMask.fieldPaths=testField" \
  -d '{"fields": {"testField": {"stringValue": "hack"}}}' 

echo -e "\nAttempting to WRITE roles (General user without token)"
curl -s -X PATCH -H "Content-Type: application/json" \
  "https://firestore.googleapis.com/v1/projects/$PROJECT_ID/databases/$DB_ID/documents/roles/admin?updateMask.fieldPaths=permissions" \
  -d '{"fields": {"permissions": {"arrayValue": {"values": [{"stringValue": "ALL"}]}}}}'
