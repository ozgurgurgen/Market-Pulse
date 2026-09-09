const fs = require('fs');
let text = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

text = text.replace(
  "role: string;",
  "role: string;\n  permissions?: string[];"
);

text = text.replace(
  "const userSnap = await getDoc(userRef);\n        if (userSnap.exists()) {",
  `const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const ud = userSnap.data() as UserData;
          if (ud.role) {
            const roleSnap = await getDoc(doc(db, 'roles', ud.role));
            if (roleSnap.exists()) {
              ud.permissions = roleSnap.data().permissions || [];
            } else {
              ud.permissions = [];
            }
          }
`
);

text = text.replace(
  "setUserData(userSnap.data() as UserData);",
  "setUserData(ud);"
);

fs.writeFileSync('src/contexts/AuthContext.tsx', text);
