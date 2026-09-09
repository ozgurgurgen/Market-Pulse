const fs = require('fs');
let text = fs.readFileSync('server.ts', 'utf8');

text = text.replace(
  "import { requireAuth, requirePermission } from './server/middlewares/authMiddleware';",
  "import { requireAuth, requirePermission } from './server/middlewares/authMiddleware';\nimport helmet from 'helmet';\nimport rateLimit from 'express-rate-limit';"
);

text = text.replace(
  "app.use(express.json());",
  `app.use(express.json());

// E: Güvenlik Sertleştirmesi (Security Hardening)
// 1. Helmet: Güvenlik başlıkları ekler, XSS ve clickjacking koruması sağlar.
app.use(helmet({
  contentSecurityPolicy: false, // Vite/React requires inline scripts in dev
}));

// 2. Rate Limiting: Brute-force ve DDoS koruması (IP bazlı, 15 dakikada 500 istek limiti)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyin." }
});
app.use('/api', apiLimiter);
`
);

fs.writeFileSync('server.ts', text);
