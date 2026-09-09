import { Router, Request, Response } from 'express';
import {
  getAllPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  calculatePortfolioPerformance,
} from './portfolioService';
import {
  calculateTWRAndBenchmarks,
  getPortfolioTransactions,
  addPortfolioTransaction,
} from './twrService';
import { generatePortfolioRecommendations } from './portfolioAI';
import { runPortfolioBacktest } from './portfolioBacktest';
import { calculateRiskMetrics } from './portfolioRisk';
import {
  getPortfolioAlerts,
  markAlertAsRead,
  sendTelegramMessage,
  getTelegramConfig,
  updateTelegramConfig,
} from '../services/notificationService';
import { getLiveExchangeRates } from '../services/currencyService';

export const portfolioRouter = Router();

/**
 * 1. Tüm Portföyleri Listele
 * GET /api/portfolio
 */
portfolioRouter.get('/', async (req: Request, res: Response) => {
  try {
    const portfolios = getAllPortfolios();
    res.json({ success: true, portfolios, total: portfolios.length });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 2. Yeni Portföy Oluştur
 * POST /api/portfolio
 */
portfolioRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { name, baseCurrency, initialCapital, holdings, notes, riskTolerance, targetReturn } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Portföy adı zorunludur.' });
    }

    const newPortfolio = createPortfolio({
      name,
      baseCurrency: baseCurrency || 'TRY',
      initialCapital: initialCapital ? Number(initialCapital) : undefined,
      holdings: Array.isArray(holdings) ? holdings : [],
      notes,
      riskTolerance,
      targetReturn: targetReturn ? Number(targetReturn) : undefined,
    });

    res.status(201).json({ success: true, portfolio: newPortfolio });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 3. Portföy Detayı
 * GET /api/portfolio/:id
 */
portfolioRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const portfolio = getPortfolioById(id) || req.body?.portfolio;
    if (!portfolio) {
      return res.status(404).json({ success: false, error: 'Portföy bulunamadı' });
    }
    res.json({ success: true, portfolio });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 4. Portföy Güncelle
 * PUT /api/portfolio/:id
 */
portfolioRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = updatePortfolio(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Güncellenecek portföy bulunamadı.' });
    }
    res.json({ success: true, portfolio: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 5. Portföy Sil
 * DELETE /api/portfolio/:id
 */
portfolioRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = deletePortfolio(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Silinecek portföy bulunamadı.' });
    }
    res.json({ success: true, message: 'Portföy başarıyla silindi.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 6. Portföy Günlük Performans, TWR (Time-Weighted Return) ve Benchmark Karşılaştırması
 * POST & GET /api/portfolio/performance
 */
portfolioRouter.post('/performance', async (req: Request, res: Response) => {
  try {
    const { portfolio, range } = req.body;
    if (!portfolio) {
      return res.status(400).json({ success: false, error: 'Portföy verisi gerekli' });
    }

    const performanceResult = await calculateTWRAndBenchmarks(
      portfolio,
      (range as '1M' | '3M' | '1Y' | 'ALL') || 'ALL'
    );

    res.json(performanceResult);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

portfolioRouter.get('/:id/performance', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const range = (req.query.range as '1M' | '3M' | '1Y' | 'ALL') || 'ALL';
    const portfolio = getPortfolioById(id);

    if (!portfolio) {
      return res.status(404).json({ success: false, error: 'Portföy bulunamadı' });
    }

    const performanceResult = await calculateTWRAndBenchmarks(portfolio, range);
    res.json(performanceResult);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 6b. Portföy Nakit / Varlık İşlem Geçmişi (Transactions)
 * GET /api/portfolio/:id/transactions
 * POST /api/portfolio/:id/transactions
 */
portfolioRouter.get('/:id/transactions', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const txs = getPortfolioTransactions(id);
    res.json({ success: true, transactions: txs });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

portfolioRouter.post('/:id/transactions', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type, amount, symbol, quantity, price, date, notes } = req.body;

    if (!type || !amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Geçerli bir işlem türü ve tutar zorunludur.' });
    }

    const newTx = addPortfolioTransaction(id, {
      type,
      amount: Number(amount),
      symbol,
      quantity: quantity ? Number(quantity) : undefined,
      price: price ? Number(price) : undefined,
      date: date || new Date().toISOString().split('T')[0],
      notes,
    });

    res.status(201).json({ success: true, transaction: newTx });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 7. Yapay Zekâ Destekli Portföy Önerileri
 * GET /api/portfolio/:id/recommendations
 * POST /api/portfolio/recommendations
 */
portfolioRouter.get('/:id/recommendations', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const portfolio = getPortfolioById(id);
    if (!portfolio) {
      return res.status(404).json({ success: false, error: 'Portföy bulunamadı' });
    }

    const recommendations = await generatePortfolioRecommendations(portfolio);
    res.json({
      success: true,
      portfolioId: portfolio.id,
      recommendations,
      disclaimer: 'Tüm yapay zekâ analizleri ve sinyal önerileri bilgilendirme amaçlıdır. Yatırım tavsiyesi içermez.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

portfolioRouter.post('/recommendations', async (req: Request, res: Response) => {
  try {
    const { portfolio } = req.body;
    if (!portfolio) {
      return res.status(400).json({ success: false, error: 'Portföy verisi gerekli' });
    }

    const recommendations = await generatePortfolioRecommendations(portfolio);
    res.json({
      success: true,
      portfolioId: portfolio.id,
      recommendations,
      disclaimer: 'Tüm yapay zekâ analizleri ve sinyal önerileri bilgilendirme amaçlıdır. Yatırım tavsiyesi içermez.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 8. Portföy Backtest Simülasyonu
 * POST /api/portfolio/backtest
 */
portfolioRouter.post('/backtest', async (req: Request, res: Response) => {
  try {
    const { tickers, weights, startDate, endDate, rebalanceFrequency, initialCapital } = req.body;
    
    if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
      return res.status(400).json({ success: false, error: 'En az bir varlık seçilmelidir.' });
    }

    const backtestResult = await runPortfolioBacktest({
      tickers,
      weights: Array.isArray(weights) ? weights : tickers.map(() => 1 / tickers.length),
      startDate: startDate || '2023-01-01',
      endDate: endDate || new Date().toISOString().split('T')[0],
      rebalanceFrequency: rebalanceFrequency || 'monthly',
      initialCapital: initialCapital ? Number(initialCapital) : 100000,
    });

    res.json({ success: true, ...backtestResult });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 9. Portföy Risk Analizi ve Metrikleri
 * GET /api/portfolio/:id/risk
 * POST /api/portfolio/risk
 */
portfolioRouter.get('/:id/risk', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const portfolio = getPortfolioById(id);
    if (!portfolio) {
      return res.status(404).json({ success: false, error: 'Portföy bulunamadı' });
    }

    const snapshots = await calculatePortfolioPerformance(portfolio);
    const riskMetrics = calculateRiskMetrics(portfolio, snapshots);

    res.json({
      success: true,
      portfolioId: portfolio.id,
      riskMetrics,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

portfolioRouter.post('/risk', async (req: Request, res: Response) => {
  try {
    const { portfolio } = req.body;
    if (!portfolio) {
      return res.status(400).json({ success: false, error: 'Portföy verisi gerekli' });
    }

    const snapshots = await calculatePortfolioPerformance(portfolio);
    const riskMetrics = calculateRiskMetrics(portfolio, snapshots);

    res.json({
      success: true,
      portfolioId: portfolio.id,
      riskMetrics,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 10. Portföy Bildirimleri ve Uyarıları
 * GET /api/portfolio/:id/alerts
 * POST /api/portfolio/alerts
 */
portfolioRouter.get('/:id/alerts', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const portfolio = getPortfolioById(id);
    if (!portfolio) {
      return res.status(404).json({ success: false, error: 'Portföy bulunamadı' });
    }

    const alerts = getPortfolioAlerts(id);
    res.json({ success: true, alerts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

portfolioRouter.post('/alerts', async (req: Request, res: Response) => {
  try {
    const { id } = req.params || req.body;
    const alerts = getPortfolioAlerts(id);
    res.json({ success: true, alerts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 11. Telegram Bildirim Testi & Ayarları
 * POST /api/portfolio/telegram/test
 */
portfolioRouter.post('/telegram/test', async (req: Request, res: Response) => {
  try {
    const { botToken, chatId, message } = req.body;
    const testMessage = message || `<b>MarketPulse AI</b>\n\n🟢 Test bildirimi başarıyla alındı. Portföy takip motorunuz aktiftir.`;
    const result = await sendTelegramMessage(botToken, chatId, testMessage);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 12. Döviz Kurları
 * GET /api/portfolio/currency/rates
 */
portfolioRouter.get('/currency/rates', async (req: Request, res: Response) => {
  try {
    const rates = await getLiveExchangeRates();
    res.json({ success: true, rates });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
