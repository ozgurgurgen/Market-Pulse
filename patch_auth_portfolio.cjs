const fs = require('fs');
let text = fs.readFileSync('src/pages/Portfolio/hooks/usePortfolio.ts', 'utf8');

if (!text.includes("import { useAuth }")) {
  text = text.replace(
    "import { db, auth } from '../../../lib/firebase';",
    "import { db, auth } from '../../../lib/firebase';\nimport { useAuth } from '../../../contexts/AuthContext';"
  );
  text = text.replace(
    "export function usePortfolio(portfolioId?: string) {",
    "export function usePortfolio(portfolioId?: string) {\n  const { user } = useAuth();"
  );
  text = text.replace(
    "const fetchPortfolios = useCallback(async () => {",
    "const fetchPortfolios = useCallback(async () => {\n    if (!user) return;"
  );
  text = text.replace(
    "if (!auth.currentUser) return;",
    "" // removed the old check
  );
  text = text.replace(
    "collection(db, `user_portfolios/${auth.currentUser.uid}/portfolios`)",
    "collection(db, `users/${user?.uid}/portfolios`)"
  );
  // fix remaining auth.currentUser usages
  text = text.replace(/auth\.currentUser\.uid/g, "user?.uid");
  text = text.replace(/!auth\.currentUser/g, "!user");
  
  // add user to dependency array of fetchPortfolios
  text = text.replace(
    "}, [selectedPortfolioId]);",
    "}, [selectedPortfolioId, user]);"
  );
}

fs.writeFileSync('src/pages/Portfolio/hooks/usePortfolio.ts', text);
