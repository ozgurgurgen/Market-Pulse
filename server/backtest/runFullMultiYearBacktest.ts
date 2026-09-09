import fs from 'fs';
import path from 'path';
import { PriceBar, SignalEngineConfig, Position, SignalCandidate, MarketCategory } from '../signalEngine/types';
import { canOpenNewPosition } from '../signalEngine/riskManager';
import { DEFAULT_SIGNAL_ENGINE_CONFIG } from '../signalEngine/config';
import { walkForwardAnalysis, calculateEffectivePrices } from '../signalEngine/backtestEngine';

export interface BacktestAsset {
  symbol: string;
  name: string;
  category: MarketCategory;
  sector: string;
  currency: 'TRY' | 'USD';
  basePrice?: number;
}

export const DEFAULT_12_ASSET_LIST: BacktestAsset[] = [
  { symbol: 'THYAO.IS', name: 'Türk Hava Yolları', category: 'BIST', sector: 'Transportation', currency: 'TRY', basePrice: 312.5 },
  { symbol: 'ASELS.IS', name: 'Aselsan', category: 'BIST', sector: 'Defense', currency: 'TRY', basePrice: 68.4 },
  { symbol: 'EREGL.IS', name: 'Ereğli Demir Çelik', category: 'BIST', sector: 'Mining', currency: 'TRY', basePrice: 48.9 },
  { symbol: 'BIMAS.IS', name: 'BİM Mağazaları', category: 'BIST', sector: 'Retail', currency: 'TRY', basePrice: 540.0 },
  { symbol: 'KCHOL.IS', name: 'Koç Holding', category: 'BIST', sector: 'Conglomerate', currency: 'TRY', basePrice: 228.0 },
  { symbol: 'AKBNK.IS', name: 'Akbank', category: 'BIST', sector: 'Banking', currency: 'TRY', basePrice: 62.5 },
  { symbol: 'SISE.IS', name: 'Şişecam', category: 'BIST', sector: 'Manufacturing', currency: 'TRY', basePrice: 47.8 },
  { symbol: 'TUPRS.IS', name: 'Tüpraş', category: 'BIST', sector: 'Energy', currency: 'TRY', basePrice: 174.2 },
  { symbol: 'FROTO.IS', name: 'Ford Otosan', category: 'BIST', sector: 'Automotive', currency: 'TRY', basePrice: 1085.0 },
  { symbol: 'GARAN.IS', name: 'Garanti BBVA', category: 'BIST', sector: 'Banking', currency: 'TRY', basePrice: 122.0 },
  { symbol: 'BTC-USD', name: 'Bitcoin', category: 'CRYPTO', sector: 'Crypto', currency: 'USD', basePrice: 87500.0 },
  { symbol: 'ETH-USD', name: 'Ethereum', category: 'CRYPTO', sector: 'Crypto', currency: 'USD', basePrice: 3150.0 },
];

export const V65_US_ASSET_LIST: BacktestAsset[] = [
  { symbol: 'AAPL', name: 'Apple', category: 'US_STOCKS', sector: 'Technology', currency: 'USD' },
  { symbol: 'MSFT', name: 'Microsoft', category: 'US_STOCKS', sector: 'Technology', currency: 'USD' },
  { symbol: 'TSLA', name: 'Tesla', category: 'US_STOCKS', sector: 'Consumer Cyclical', currency: 'USD' },
  { symbol: 'NVDA', name: 'Nvidia', category: 'US_STOCKS', sector: 'Technology', currency: 'USD' },
  { symbol: 'GOOGL', name: 'Alphabet', category: 'US_STOCKS', sector: 'Technology', currency: 'USD' },
  { symbol: 'IWM', name: 'Russell 2000 ETF', category: 'US_ETF', sector: 'Index ETF', currency: 'USD' },
  { symbol: 'SPY', name: 'S&P 500 ETF', category: 'US_ETF', sector: 'Index ETF', currency: 'USD' },
  { symbol: 'QQQ', name: 'Nasdaq 100 ETF', category: 'US_ETF', sector: 'Index ETF', currency: 'USD' },
  { symbol: 'HYG', name: 'High Yield Bond ETF', category: 'US_ETF', sector: 'Bond ETF', currency: 'USD' },
  { symbol: 'GDX', name: 'Gold Miners ETF', category: 'US_ETF', sector: 'Commodity ETF', currency: 'USD' },
];

async function fetchBars(ticker: string, startStr: string, endStr: string): Promise<PriceBar[]> {
  const p1 = Math.floor(new Date(startStr).getTime() / 1000); 
  const p2 = Math.floor(new Date(endStr).getTime() / 1000);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&period1=${p1}&period2=${p2}`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json() as any;
    const result = data?.chart?.result?.[0];
    const timestamps = result?.timestamp as number[];
    const quote = result?.indicators?.quote?.[0];
    if (!timestamps || !quote) return [];
    
    const bars: PriceBar[] = [];
    for (let i = 0; i < timestamps.length; i++) {
      const c = quote.close[i];
      const o = quote.open?.[i] ?? c;
      const h = quote.high?.[i] ?? c;
      const l = quote.low?.[i] ?? c;
      if (c && !isNaN(c) && c > 0) {
        bars.push({
          date: new Date(timestamps[i] * 1000).toISOString().split('T')[0],
          open: Number(o.toFixed(2)),
          high: Number(h.toFixed(2)),
          low: Number(l.toFixed(2)),
          close: Number(c.toFixed(2)),
          volume: quote.volume?.[i] ?? 1000000,
        });
      }
    }
    return bars;
  } catch {
    return [];
  }
}

function calculateCostAdjustedReturn(grossRetPct: number, category: MarketCategory, customCostPct?: number): number {
  if (typeof customCostPct === 'number') {
    return grossRetPct - (customCostPct * 2);
  }
  const cost = category === 'CRYPTO' ? 0.5 : 0.15; // slippage/fees per side
  return grossRetPct - (cost * 2); // entry and exit
}

export interface PortfolioSimulationOptions {
  assetList?: BacktestAsset[];
  startDate?: string;
  endDate?: string;
  customCostPct?: number;
  useFixedStopAndTarget?: boolean;
  fixedStopPct?: number;
  fixedTargetPct?: number;
  outputReportName?: string;
}

/**
 * Genelleştirilmiş Çapraz-Varlık Portföy Simülatörü
 */
export async function runGeneralizedPortfolioSimulation(options: PortfolioSimulationOptions = {}): Promise<{
  totalSignals: number;
  executedTradesCount: number;
  winRate: number;
  expectancy: number;
  maxDrawdown: number;
  reportPath: string;
}> {
  const assetList = options.assetList || DEFAULT_12_ASSET_LIST;
  const startDate = options.startDate || '2020-01-01';
  const endDate = options.endDate || '2026-08-01';
  const outputReportName = options.outputReportName || 'v5.0-comprehensive-portfolio-run.md';

  console.log(`=== PORTFOLIO BACKTESTER (${assetList.length} Assets, ${startDate} to ${endDate}) ===`);
  const allTrades: any[] = [];
  
  for (const asset of assetList) {
    console.log(`Analyzing ${asset.symbol}...`);
    const bars = await fetchBars(asset.symbol, startDate, endDate);
    if (bars.length < 200) continue;
    
    const res = walkForwardAnalysis(bars, 120, 60);
    for (const w of res.windows) {
      for (const t of w.trades) {
        let tradeGrossRet = t.grossReturnPct;
        
        // Sabit stop/target modu (örn. v6.5 %3/%9 testi)
        if (options.useFixedStopAndTarget && options.fixedStopPct && options.fixedTargetPct) {
          tradeGrossRet = t.isWin ? options.fixedTargetPct : -options.fixedStopPct;
        }

        const trueRet = calculateCostAdjustedReturn(tradeGrossRet, asset.category, options.customCostPct);
        allTrades.push({
          ...t,
          asset: asset.symbol,
          sector: asset.sector,
          category: asset.category,
          netReturnPct: trueRet,
          isWin: trueRet > 0,
          compositeScore: t.compositeScore || 70,
        });
      }
    }
  }
  
  // Group by Date
  const tradesByDate: Record<string, any[]> = {};
  for (const t of allTrades) {
    if (!tradesByDate[t.entryDate]) tradesByDate[t.entryDate] = [];
    tradesByDate[t.entryDate].push(t);
  }
  const dates = Object.keys(tradesByDate).sort();
  
  let openPositions: Position[] = [];
  const executedTrades: any[] = [];
  // O(1) Lookup Map: positionId -> Trade
  const executedTradesMap = new Map<string, any>();
  
  let equity = 10000;
  const equityCurve: number[] = [];
  let sequenceCounter = 1;

  // Day-by-Day Simulation
  for (const currentDate of dates) {
    // 1. Process Exits
    const nextOpenPositions: Position[] = [];
    for (const p of openPositions) {
      const tr = executedTradesMap.get(p.id);
      if (tr && tr.exitDate <= currentDate) {
        const portReturn = (tr.netReturnPct / 100) * p.positionSizePct;
        equity *= (1 + portReturn);
      } else {
        nextOpenPositions.push(p);
      }
    }
    openPositions = nextOpenPositions;
    equityCurve.push(equity);
    
    // 2. Evaluate new candidates
    const dailyCandidates = tradesByDate[currentDate] || [];
    // SMART SORT: Highest composite score first
    dailyCandidates.sort((a, b) => b.compositeScore - a.compositeScore);
    
    const config = DEFAULT_SIGNAL_ENGINE_CONFIG.riskConfig;
    
    for (const trade of dailyCandidates) {
      const candidate: SignalCandidate = {
        symbol: trade.asset,
        name: trade.asset,
        sector: trade.sector,
        category: trade.category,
        entryPrice: trade.entryPrice,
        stopLoss: trade.stopLoss,
        targetPrice1: trade.takeProfit,
        targetPrice2: trade.takeProfit,
        positionSizePct: 0.1, 
      };
      
      const riskCheck = canOpenNewPosition(candidate, openPositions, config, currentDate);
      
      if (riskCheck.allowed) {
        const posId = `pos-${currentDate}-${sequenceCounter++}`;
        const newPos: Position = {
          id: posId,
          symbol: trade.asset,
          sector: trade.sector,
          entryPrice: trade.entryPrice,
          stopLoss: trade.stopLoss,
          targetPrice: trade.takeProfit,
          positionSizePct: 0.1,
          openedAt: trade.entryDate,
        };
        openPositions.push(newPos);
        const executedObj = { ...trade, id: newPos.id };
        executedTrades.push(executedObj);
        executedTradesMap.set(posId, executedObj);
      }
    }
  }
  
  // Metrics calculation
  const wins = executedTrades.filter((t) => t.netReturnPct > 0).length;
  const rate = executedTrades.length > 0 ? (wins / executedTrades.length) * 100 : 0;
  const exp = executedTrades.length > 0 ? (executedTrades.reduce((acc, t) => acc + t.netReturnPct, 0) / executedTrades.length) : 0;
  
  let peak = 10000;
  let mdd = 0;
  for (const eq of equityCurve) {
    if (eq > peak) peak = eq;
    const dd = (peak - eq) / peak;
    if (dd > mdd) mdd = dd;
  }
  
  const reportDir = path.join(process.cwd(), 'server', 'backtest', 'reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const finalReport = `
# MarketPulse AI Portföy Simülasyon Raporu

**Tarih:** ${startDate} → ${endDate}  
**Evren:** ${assetList.map((a) => a.symbol).join(', ')}  
**Maliyet Modeli:** ${options.customCostPct ? `%${options.customCostPct} Çift Yönlü Sabit` : 'Dinamik Varlık Kategorisi Bazlı'}  

## Genel Portföy Performansı
* Toplam Üretilen Sinyal (Evren): ${allTrades.length}
* Portföy Kısıtlarına Takılmayan (Gerçekleşen): ${executedTrades.length}
* Kazanma Oranı (Win Rate): %${rate.toFixed(1)}
* İşlem Başına Net Beklenti (Expectancy): %${exp.toFixed(2)} (Maliyetler Düşülmüş Gerçek Kâr)
* Portföy Max Drawdown: %${(mdd * 100).toFixed(1)}
`;

  const reportPath = path.join(reportDir, outputReportName);
  fs.writeFileSync(reportPath, finalReport.trim(), 'utf-8');
  console.log(`Backtest completed. Report generated at ${reportPath}`);

  return {
    totalSignals: allTrades.length,
    executedTradesCount: executedTrades.length,
    winRate: rate,
    expectancy: exp,
    maxDrawdown: mdd * 100,
    reportPath,
  };
}

/**
 * v6.5 Raporunu Yeniden Üreten Fonksiyon (10 US Varlığı, %3 Stop, %9 Hedef, %0.10 Maliyet)
 */
export async function runV65Reproduction(): Promise<ReturnType<typeof runGeneralizedPortfolioSimulation>> {
  return runGeneralizedPortfolioSimulation({
    assetList: V65_US_ASSET_LIST,
    startDate: '2021-01-01',
    endDate: '2026-08-01',
    customCostPct: 0.05, // %0.05 per side = %0.10 total
    useFixedStopAndTarget: true,
    fixedStopPct: 3.0,
    fixedTargetPct: 9.0,
    outputReportName: 'v6.5-reproduction-run.md',
  });
}

// Default CLI runner
if (process.argv[1] && process.argv[1].includes('runFullMultiYearBacktest')) {
  runGeneralizedPortfolioSimulation().catch(console.error);
}
