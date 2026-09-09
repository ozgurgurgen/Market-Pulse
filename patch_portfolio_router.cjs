const fs = require('fs');
let text = fs.readFileSync('server/portfolio/portfolioRouter.ts', 'utf8');

// Replace /:id/performance
text = text.replace(
  "portfolioRouter.get('/:id/performance', async (req: Request, res: Response) => {",
  "portfolioRouter.post('/performance', async (req: Request, res: Response) => {"
);
text = text.replace(
  "const { id } = req.params;\n    const portfolio = getPortfolioById(id);",
  "const { portfolio } = req.body;"
);
text = text.replace(
  "if (!portfolio) {\n      return res.status(404).json({ success: false, error: 'Portföy bulunamadı' });\n    }",
  "if (!portfolio) {\n      return res.status(400).json({ success: false, error: 'Portföy verisi gerekli' });\n    }"
);

// Replace /:id/recommendations
text = text.replace(
  "portfolioRouter.get('/:id/recommendations', async (req: Request, res: Response) => {",
  "portfolioRouter.post('/recommendations', async (req: Request, res: Response) => {"
);
text = text.replace(
  "const { id } = req.params;\n    const portfolio = getPortfolioById(id);",
  "const { portfolio } = req.body;"
);

// Replace /:id/risk
text = text.replace(
  "portfolioRouter.get('/:id/risk', async (req: Request, res: Response) => {",
  "portfolioRouter.post('/risk', async (req: Request, res: Response) => {"
);
text = text.replace(
  "const { id } = req.params;\n    const portfolio = getPortfolioById(id);",
  "const { portfolio } = req.body;"
);

// Replace /:id/alerts
text = text.replace(
  "portfolioRouter.get('/:id/alerts', async (req: Request, res: Response) => {",
  "portfolioRouter.post('/alerts', async (req: Request, res: Response) => {"
);
text = text.replace(
  "const { id } = req.params;\n    const portfolio = getPortfolioById(id);",
  "const { portfolio } = req.body;"
);

fs.writeFileSync('server/portfolio/portfolioRouter.ts', text);
