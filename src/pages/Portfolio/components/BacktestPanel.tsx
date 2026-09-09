import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Play,
  Calendar,
  Layers,
  RotateCcw,
  TrendingUp,
  Percent,
  ShieldAlert,
  BarChart2,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import {
  PortfolioBacktestResponse,
  PortfolioBacktestRequest,
  PortfolioItem,
} from '../../../types';

interface BacktestPanelProps {
  portfolio: PortfolioItem | null;
  backtestResult: PortfolioBacktestResponse | null;
  isRunning: boolean;
  onRunBacktest: (req: PortfolioBacktestRequest) => void;
}

export const BacktestPanel: React.FC<BacktestPanelProps> = ({
  portfolio,
  backtestResult,
  isRunning,
  onRunBacktest,
}) => {
  // Form durumları
  const [tickersStr, setTickersStr] = useState<string>('THYAO, ASELS, NVDA, SPY, GLD');
  const [weightsStr, setWeightsStr] = useState<string>('25, 20, 20, 20, 15');
  const [startDate, setStartDate] = useState<string>('2023-01-01');
  const [endDate, setEndDate] = useState<string>('2024-12-31');
  const [rebalanceFreq, setRebalanceFreq] = useState<'daily' | 'weekly' | 'monthly' | 'none'>('monthly');
  const [initialCapital, setInitialCapital] = useState<number>(100000);

  // Mevcut portföyden varlıkları otomatik doldur
  const loadFromCurrentPortfolio = () => {
    if (!portfolio || !portfolio.holdings || portfolio.holdings.length === 0) return;
    const t = portfolio.holdings.map((h) => h.ticker).join(', ');
    const equalWeight = (100 / portfolio.holdings.length).toFixed(1);
    const w = portfolio.holdings.map(() => equalWeight).join(', ');
    setTickersStr(t);
    setWeightsStr(w);
    setInitialCapital(portfolio.initialCapital || 100000);
  };

  useEffect(() => {
    if (portfolio && portfolio.holdings && portfolio.holdings.length > 0) {
      loadFromCurrentPortfolio();
    }
  }, [portfolio?.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawTickers = tickersStr
      .split(',')
      .map((t) => t.trim().toUpperCase())
      .filter((t) => t.length > 0);

    const rawWeights = weightsStr
      .split(',')
      .map((w) => parseFloat(w.trim()) || 0)
      .filter((w) => w > 0);

    if (rawTickers.length === 0) {
      alert('Lütfen en az bir varlık sembolü girin.');
      return;
    }

    onRunBacktest({
      tickers: rawTickers,
      weights: rawWeights,
      startDate,
      endDate,
      rebalanceFrequency: rebalanceFreq,
      initialCapital,
      baseCurrency: portfolio?.baseCurrency || 'TRY',
    });
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-6">
      {/* Üst Başlık */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <BarChart2 size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Geçmiş Portföy Performans Backtest Simülasyonu</h3>
            <p className="text-[11px] text-slate-400">
              Varlık sepetini geçmiş piyasa verileri ve rebalancing periyotlarıyla test edin
            </p>
          </div>
        </div>

        {portfolio && (
          <button
            type="button"
            onClick={loadFromCurrentPortfolio}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw size={12} />
            Mevcut Portföy Varlıklarını Doldur
          </button>
        )}
      </div>

      {/* Backtest Parametre Formu */}
      <form onSubmit={handleSubmit} className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60 space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Varlık Sembolleri (Virgülle)</label>
            <input
              type="text"
              value={tickersStr}
              onChange={(e) => setTickersStr(e.target.value)}
              placeholder="THYAO, ASELS, NVDA, SPY"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Ağırlıklar % (Virgülle)</label>
            <input
              type="text"
              value={weightsStr}
              onChange={(e) => setWeightsStr(e.target.value)}
              placeholder="30, 25, 25, 20"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Başlangıç Tarihi</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Bitiş Tarihi</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-700/50">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <span className="text-slate-400 font-semibold mr-2">Rebalancing Sıklığı:</span>
              <select
                value={rebalanceFreq}
                onChange={(e) => setRebalanceFreq(e.target.value as any)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="monthly">Aylık (Önerilen)</option>
                <option value="weekly">Haftalık</option>
                <option value="daily">Günlük</option>
                <option value="none">Yeniden Dengeleme Yok (Buy & Hold)</option>
              </select>
            </div>

            <div>
              <span className="text-slate-400 font-semibold mr-2">Başlangıç Sermayesi:</span>
              <input
                type="number"
                value={initialCapital}
                onChange={(e) => setInitialCapital(Number(e.target.value))}
                className="w-28 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isRunning}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer disabled:opacity-50"
          >
            <Play size={14} className={isRunning ? 'animate-pulse' : ''} />
            {isRunning ? 'Simülasyon Hesaplanıyor...' : 'Backtest Başlat'}
          </button>
        </div>
      </form>

      {/* Backtest Sonuç Paneli */}
      {backtestResult && (
        <div className="space-y-6">
          {/* Metrik Kartları */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/70 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">Toplam Getiri</span>
              <span className={`text-base font-black ${backtestResult.totalReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {backtestResult.totalReturn >= 0 ? '+' : ''}%{backtestResult.totalReturn}
              </span>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/70 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">Yıllık Bileşik (CAGR)</span>
              <span className="text-base font-black text-white">%{backtestResult.annualizedReturn}</span>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/70 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">Max Drawdown</span>
              <span className="text-base font-black text-rose-400">-%{backtestResult.maxDrawdown}</span>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/70 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">Sharpe Oranı</span>
              <span className="text-base font-black text-emerald-400">{backtestResult.sharpeRatio}</span>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/70 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">Sortino Oranı</span>
              <span className="text-base font-black text-cyan-400">{backtestResult.sortinoRatio}</span>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/70 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">Yıllık Volatilite</span>
              <span className="text-base font-black text-amber-400">%{backtestResult.volatility}</span>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/70 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">En İyi Ay</span>
              <span className="text-base font-black text-emerald-300">+{backtestResult.bestMonth}%</span>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/70 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">Kazanma Oranı</span>
              <span className="text-base font-black text-blue-400">%{backtestResult.winRateMonths || 68}</span>
            </div>
          </div>

          {/* Equity Curve Grafiği */}
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Portföy Büyüme Eğrisi vs SPY/Benchmark</span>
              <span className="text-slate-400">Başlangıç: {initialCapital.toLocaleString()} TL/USD</span>
            </div>

            <div className="h-[260px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={backtestResult.equityCurve} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="backtestGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    name="Portföy Değeri"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#backtestGradient)"
                  />
                  <Line
                    type="monotone"
                    dataKey="benchmarkValue"
                    name="Benchmark (SPY/XU100)"
                    stroke="#94a3b8"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Varlık Katkı Performans Tablosu */}
          {backtestResult.assetPerformances && backtestResult.assetPerformances.length > 0 && (
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/90 text-slate-400 font-semibold border-b border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">Varlık</th>
                    <th className="py-2.5 px-3 text-right">Hedef Ağırlık</th>
                    <th className="py-2.5 px-3 text-right">Toplam Getiri</th>
                    <th className="py-2.5 px-3 text-right">Yıllık Getiri</th>
                    <th className="py-2.5 px-3 text-right">Volatilite</th>
                    <th className="py-2.5 px-3 text-right">Portföye Katkı</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                  {backtestResult.assetPerformances.map((a) => (
                    <tr key={a.ticker} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-white">{a.ticker}</span>
                        {a.name && <span className="text-slate-400 text-[11px] ml-2">{a.name}</span>}
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium text-slate-300">%{a.weight}</td>
                      <td className={`py-2.5 px-3 text-right font-bold ${a.totalReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {a.totalReturn >= 0 ? '+' : ''}%{a.totalReturn}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-200 font-semibold">%{a.annualizedReturn}</td>
                      <td className="py-2.5 px-3 text-right text-amber-400 font-medium">%{a.volatility}</td>
                      <td className={`py-2.5 px-3 text-right font-black ${a.contribution >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                        {a.contribution >= 0 ? '+' : ''}%{a.contribution}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Aylık Getiri Matrisi */}
          {backtestResult.monthlyReturns && backtestResult.monthlyReturns.length > 0 && (
            <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60 space-y-2">
              <span className="font-bold text-white text-xs block mb-2">Aylık Getiri Dökümü (%)</span>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-1.5 text-center text-xs">
                {backtestResult.monthlyReturns.slice(-12).map((m) => (
                  <div
                    key={`${m.year}-${m.month}`}
                    className={`p-2 rounded-xl border ${
                      m.returnPct >= 0
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 block">{m.monthName}</span>
                    <span className="font-bold text-xs">{m.returnPct >= 0 ? '+' : ''}%{m.returnPct}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
