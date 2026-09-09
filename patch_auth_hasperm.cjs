const fs = require('fs');
let text = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

text = text.replace(
  "token: string | null;\n}",
  "token: string | null;\n  hasPermission: (perm: string) => boolean;\n}"
);

text = text.replace(
  "logout: async () => {},",
  "logout: async () => {},\n  hasPermission: () => false,"
);

text = text.replace(
  "const logout = async () => {\n    await signOut(auth);\n  };",
  "const logout = async () => {\n    await signOut(auth);\n  };\n\n  const hasPermission = (perm: string) => {\n    if (userData?.role === 'admin') return true;\n    return userData?.permissions?.includes(perm) || false;\n  };"
);

text = text.replace(
  "<AuthContext.Provider value={{ user, userData, loading, logout, token }}>",
  "<AuthContext.Provider value={{ user, userData, loading, logout, token, hasPermission }}>"
);

fs.writeFileSync('src/contexts/AuthContext.tsx', text);
