import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Legend,
} from 'recharts';
import {
  Activity,
  TrendingUp,
  ShieldAlert,
  Flame,
  Calendar,
  Layers,
  Sparkles,
  HelpCircle,
  Percent,
  Play,
  Info,
  DollarSign,
  Award,
} from 'lucide-react';
import { runMonteCarloSimulation, MonteCarloParams, MonteCarloResults } from '../utils/monteCarloEngine';
import { PortfolioRiskMetrics, PortfolioHoldingSnapshot } from '../../../types';

interface MonteCarloPanelProps {
  initialCapital?: number;
  totalPortfolioValue?: number;
  riskMetrics?: PortfolioRiskMetrics | null;
  baseCurrency?: string;
  portfolioName?: string;
}

export const MonteCarloPanel: React.FC<MonteCarloPanelProps> = ({
  initialCapital = 100000,
  totalPortfolioValue = 100000,
  riskMetrics,
  baseCurrency = 'TRY',
  portfolioName = 'Portföy',
}) => {
  // Current portfolio starting value
  const startingValue = totalPortfolioValue > 0 ? totalPortfolioValue : initialCapital;

  // Derive initial values from riskMetrics if available
  const defaultReturn = 48.0; // Typical BIST nominal expected return
  const defaultVol = riskMetrics?.volatility && riskMetrics.volatility > 5 ? riskMetrics.volatility : 24.0;

  // Simulation parameters
  const [years, setYears] = useState<number>(3);
  const [simulationsCount, setSimulationsCount] = useState<number>(1000);
  const [expectedReturn, setExpectedReturn] = useState<number>(defaultReturn);
  const [volatility, setVolatility] = useState<number>(defaultVol);
  const [monthlyDCA, setMonthlyDCA] = useState<number>(0);
  const [inflationRate, setInflationRate] = useState<number>(35.0);
  const [runKey, setRunKey] = useState<number>(0);

  // Run simulation
  const results: MonteCarloResults = useMemo(() => {
    // runKey allows forced recalculation on "Yeniden Çalıştır"
    const _ = runKey;
    const params: MonteCarloParams = {
      initialValue: startingValue,
      expectedAnnualReturn: expectedReturn,
      annualVolatility: volatility,
      years,
      simulationsCount,
      monthlyContribution: monthlyDCA,
      annualInflationRate: inflationRate,
    };
    return runMonteCarloSimulation(params);
  }, [startingValue, expectedReturn, volatility, years, simulationsCount, monthlyDCA, inflationRate, runKey]);

  const currencySymbol = baseCurrency === 'USD' ? '$' : '₺';
  const { finalMetrics, timeSeries } = results;

  // Format big currency numbers compactly
  const formatCurrencyCompact = (val: number) => {
    if (val >= 1_000_000) {
      return `${(val / 1_000_000).toFixed(2)}M ${currencySymbol}`;
    }
    if (val >= 1_000) {
      return `${Math.round(val / 1_000).toLocaleString('tr-TR')}K ${currencySymbol}`;
    }
    return `${Math.round(val).toLocaleString('tr-TR')} ${currencySymbol}`;
  };

  return (
    <div className="space-y-6">
      {/* 1. Üst Başlık ve Parametre Kontrolleri */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-950/30">
              <Activity size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight">Monte Carlo Getiri & Risk Simülatörü</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-extrabold uppercase">
                  Stochastic GBM Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Geometrik Brown Hareketi ve stokastik simülasyonlarla portföyünüzün gelecekteki olası getiri aralıklarını ve risklerini modelleyin.
              </p>
            </div>
          </div>

          <button
            onClick={() => setRunKey(prev => prev + 1)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-cyan-950/40 cursor-pointer"
          >
            <Play size={14} fill="currentColor" />
            Simülasyonu Yeniden Koş
          </button>
        </div>

        {/* Parametre Giriş Izgarası */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mt-6">
          {/* Projeksiyon Vadesi */}
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 block">Projeksiyon Vadesi</span>
            <div className="flex items-center gap-1 mt-1">
              {[1, 3, 5, 10].map(y => (
                <button
                  key={y}
                  onClick={() => setYears(y)}
                  className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    years === y
                      ? 'bg-cyan-500 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {y} Yıl
                </button>
              ))}
            </div>
          </div>

          {/* Simülasyon Sayısı */}
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 block">Yol Sayısı (İterasyon)</span>
            <div className="flex items-center gap-1 mt-1">
              {[1000, 2500, 5000].map(cnt => (
                <button
                  key={cnt}
                  onClick={() => setSimulationsCount(cnt)}
                  className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    simulationsCount === cnt
                      ? 'bg-cyan-500 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cnt >= 1000 ? `${cnt / 1000}k` : cnt}
                </button>
              ))}
            </div>
          </div>

          {/* Beklenen Yıllık Getiri (Mu) */}
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="font-semibold text-slate-400">Beklenen Getiri (μ)</span>
              <span className="font-bold text-cyan-400">%{expectedReturn}</span>
            </div>
            <input
              type="range"
              min="10"
              max="120"
              step="1"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg appearance-none mt-2"
            />
          </div>

          {/* Yıllık Volatilite (Sigma) */}
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="font-semibold text-slate-400">Yıllık Volatilite (σ)</span>
              <span className="font-bold text-amber-400">%{volatility}</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="1"
              value={volatility}
              onChange={(e) => setVolatility(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg appearance-none mt-2"
            />
          </div>

          {/* Aylık Katkı Payı (DCA) */}
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="font-semibold text-slate-400">Aylık Tasarruf (DCA)</span>
              <span className="font-bold text-emerald-400">{currencySymbol}{monthlyDCA.toLocaleString('tr-TR')}</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              {[0, 5000, 15000, 30000].map(amt => (
                <button
                  key={amt}
                  onClick={() => setMonthlyDCA(amt)}
                  className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    monthlyDCA === amt
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {amt === 0 ? '0' : `${amt / 1000}k`}
                </button>
              ))}
            </div>
          </div>

          {/* Yıllık Enflasyon (TÜFE) */}
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="font-semibold text-slate-400">Yıllık Enflasyon</span>
              <span className="font-bold text-rose-400">%{inflationRate}</span>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              step="1"
              value={inflationRate}
              onChange={(e) => setInflationRate(parseFloat(e.target.value))}
              className="w-full accent-rose-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg appearance-none mt-2"
            />
          </div>
        </div>

        {/* 2. Olasılık & Özet Başarı Kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-6">
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Medyan Büyüklük (%50)</span>
            <div className="text-xl font-black text-cyan-400 mt-1">
              {formatCurrencyCompact(finalMetrics.medianFinalValue)}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Yatırılan: {formatCurrencyCompact(finalMetrics.totalContributed)}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Enflasyonu Yenme İhtimali</span>
            <div className="text-xl font-black text-emerald-400 mt-1">
              %{finalMetrics.probabilityOfBeatingInflation}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Reel Satın Alma Gücü Artışı</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Portföyü 2 Katına Çıkarma</span>
            <div className="text-xl font-black text-white mt-1">
              %{finalMetrics.probabilityOfDoubling}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Sermaye Katlama Olasılığı</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Sermaye Kaybı Riski</span>
            <div
              className={`text-xl font-black mt-1 ${
                finalMetrics.probabilityOfCapitalLoss <= 5
                  ? 'text-emerald-400'
                  : finalMetrics.probabilityOfCapitalLoss <= 15
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              %{finalMetrics.probabilityOfCapitalLoss}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Nihai Değer &lt; Yatırılan Anapara</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Riske Maruz Değer (VaR %95)</span>
            <div className="text-xl font-black text-rose-400 mt-1">
              {finalMetrics.valueAtRisk95Amount > 0
                ? `-${formatCurrencyCompact(finalMetrics.valueAtRisk95Amount)}`
                : '₺0'}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">En kötü %5 olasılıktaki risk</span>
          </div>
        </div>
      </div>

      {/* 3. Ana Grafik: Stokastik Olasılık Yelpazesi (Fan Chart) */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-sm font-black text-white tracking-tight flex items-center gap-2">
              <TrendingUp size={16} className="text-cyan-400" />
              Gelecek Projeksiyon Yelpazesi (Confidence Cone)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              5. Persentil (Ayı) ile 95. Persentil (Boğa) arasındaki stokastik getiri dağılımı.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-slate-300">Medyan Getiri (%50)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span className="text-slate-300">Enflasyon Eşiği</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-slate-300">Reel Satın Alma Gücü</span>
            </div>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={timeSeries} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="p95p05Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="p75p25Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis
                dataKey="label"
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                interval={Math.max(0, Math.floor(timeSeries.length / 8))}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                tickFormatter={(val) => formatCurrencyCompact(val)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '16px',
                  fontSize: '12px',
                }}
                formatter={(val: any, name: string) => {
                  const numVal = Number(val);
                  const labels: Record<string, string> = {
                    p95: '95. Persentil (Agresif Boğa)',
                    p75: '75. Persentil (İyimser)',
                    p50: '50. Persentil (Medyan)',
                    p25: '25. Persentil (Kötümser)',
                    p05: '5. Persentil (Şiddetli Ayı)',
                    realP50: 'Reel Satın Alma Gücü (Enflasyondan Arındırılmış)',
                    inflationBenchmark: 'Kümülatif Enflasyon Maliyeti',
                    totalContributed: 'Yatırılan Toplam Anapara',
                  };
                  return [`${formatCurrencyCompact(numVal)}`, labels[name] || name];
                }}
              />

              {/* Dış Yelpaze: p95 ve p05 */}
              <Area
                type="monotone"
                dataKey="p95"
                stroke="#06b6d4"
                strokeWidth={1}
                strokeDasharray="4 4"
                fill="url(#p95p05Grad)"
                name="p95"
              />
              <Area
                type="monotone"
                dataKey="p05"
                stroke="#64748b"
                strokeWidth={1}
                strokeDasharray="4 4"
                fill="#0f172a"
                name="p05"
              />

              {/* İç Yelpaze: p75 ve p25 */}
              <Area
                type="monotone"
                dataKey="p75"
                stroke="#3b82f6"
                strokeWidth={1.5}
                fill="url(#p75p25Grad)"
                name="p75"
              />

              {/* Medyan Beklenti Çizgisi */}
              <Line
                type="monotone"
                dataKey="p50"
                stroke="#22d3ee"
                strokeWidth={3}
                dot={false}
                name="p50"
              />

              {/* Enflasyon Eşiği Çizgisi */}
              <Line
                type="monotone"
                dataKey="inflationBenchmark"
                stroke="#f43f5e"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="inflationBenchmark"
              />

              {/* Reel Satın Alma Gücü Çizgisi */}
              <Line
                type="monotone"
                dataKey="realP50"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="realP50"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Senaryo Kırılım Tablosu & Matematiksel Açıklama */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Senaryolar Tablosu */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl backdrop-blur-md">
          <h3 className="text-sm font-black text-white tracking-tight flex items-center gap-2 mb-4">
            <Award size={16} className="text-amber-400" />
            {years} Yıl Sonundaki Senaryo Olasılıkları
          </h3>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3 pl-2">Senaryo</th>
                  <th className="pb-3 text-right">Nihai Portföy Değeri</th>
                  <th className="pb-3 text-right">Toplam Net Kâr</th>
                  <th className="pb-3 text-right">Reel Alım Gücü</th>
                  <th className="pb-3 text-right pr-2">Olasılık Bandı</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 pl-2 font-bold text-cyan-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    %95 Agresif Boğa
                  </td>
                  <td className="py-3 text-right font-black text-white">
                    {formatCurrencyCompact(finalMetrics.p95FinalValue)}
                  </td>
                  <td className="py-3 text-right font-bold text-emerald-400">
                    +{formatCurrencyCompact(finalMetrics.p95FinalValue - finalMetrics.totalContributed)}
                  </td>
                  <td className="py-3 text-right text-slate-300">
                    {formatCurrencyCompact(finalMetrics.p95FinalValue / Math.pow(1 + inflationRate / 100, years))}
                  </td>
                  <td className="py-3 text-right pr-2 text-slate-400 font-semibold">
                    En iyi %5
                  </td>
                </tr>

                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 pl-2 font-bold text-blue-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    %75 İyimser Senaryo
                  </td>
                  <td className="py-3 text-right font-black text-white">
                    {formatCurrencyCompact(finalMetrics.p75FinalValue)}
                  </td>
                  <td className="py-3 text-right font-bold text-emerald-400">
                    +{formatCurrencyCompact(finalMetrics.p75FinalValue - finalMetrics.totalContributed)}
                  </td>
                  <td className="py-3 text-right text-slate-300">
                    {formatCurrencyCompact(finalMetrics.p75FinalValue / Math.pow(1 + inflationRate / 100, years))}
                  </td>
                  <td className="py-3 text-right pr-2 text-slate-400 font-semibold">
                    Üst Çeyrek
                  </td>
                </tr>

                <tr className="hover:bg-slate-800/30 transition-colors bg-cyan-950/20">
                  <td className="py-3 pl-2 font-black text-cyan-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-300" />
                    %50 Medyan (En Olası)
                  </td>
                  <td className="py-3 text-right font-black text-cyan-300 text-sm">
                    {formatCurrencyCompact(finalMetrics.medianFinalValue)}
                  </td>
                  <td className="py-3 text-right font-black text-emerald-400">
                    +{formatCurrencyCompact(finalMetrics.medianNetProfit)}
                  </td>
                  <td className="py-3 text-right font-bold text-white">
                    {formatCurrencyCompact(finalMetrics.medianRealPurchasingPower)}
                  </td>
                  <td className="py-3 text-right pr-2 text-cyan-400 font-extrabold">
                    Orta Nokta
                  </td>
                </tr>

                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 pl-2 font-bold text-slate-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    %25 Kötümser Senaryo
                  </td>
                  <td className="py-3 text-right font-black text-white">
                    {formatCurrencyCompact(finalMetrics.p25FinalValue)}
                  </td>
                  <td className="py-3 text-right font-bold text-slate-300">
                    +{formatCurrencyCompact(finalMetrics.p25FinalValue - finalMetrics.totalContributed)}
                  </td>
                  <td className="py-3 text-right text-slate-300">
                    {formatCurrencyCompact(finalMetrics.p25FinalValue / Math.pow(1 + inflationRate / 100, years))}
                  </td>
                  <td className="py-3 text-right pr-2 text-slate-400 font-semibold">
                    Alt Çeyrek
                  </td>
                </tr>

                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 pl-2 font-bold text-rose-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    %5 Şiddetli Ayı / Stres
                  </td>
                  <td className="py-3 text-right font-black text-white">
                    {formatCurrencyCompact(finalMetrics.p05FinalValue)}
                  </td>
                  <td
                    className={`py-3 text-right font-bold ${
                      finalMetrics.p05FinalValue >= finalMetrics.totalContributed ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {finalMetrics.p05FinalValue >= finalMetrics.totalContributed ? '+' : ''}
                    {formatCurrencyCompact(finalMetrics.p05FinalValue - finalMetrics.totalContributed)}
                  </td>
                  <td className="py-3 text-right text-slate-300">
                    {formatCurrencyCompact(finalMetrics.p05FinalValue / Math.pow(1 + inflationRate / 100, years))}
                  </td>
                  <td className="py-3 text-right pr-2 text-rose-400 font-semibold">
                    En Kötü %5 (VaR)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Metodoloji & Stokastik Modelleme Bilgi Kartı */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl backdrop-blur-md flex flex-col justify-between space-y-4 text-xs">
          <div>
            <h3 className="text-sm font-black text-white tracking-tight flex items-center gap-2 mb-3">
              <Info size={16} className="text-cyan-400" />
              Stokastik Modelleme Metodolojisi
            </h3>
            <p className="text-slate-400 leading-relaxed mb-3">
              Bu simülasyon, finansal ekonometride standart kabul edilen <strong>Geometrik Brown Hareketi (Geometric Brownian Motion - GBM)</strong> difüzyon diferansiyel denklemini uygular:
            </p>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 font-mono text-[11px] text-cyan-300 text-center">
              dS<sub>t</sub> = μ S<sub>t</sub> dt + σ S<sub>t</sub> dW<sub>t</sub>
            </div>
          </div>

          <div className="space-y-2 text-slate-400 text-[11px] leading-relaxed">
            <p>
              • <strong>Box-Muller Dönüşümü:</strong> Her adımda bağımsız standart normal rassal şoklar (Z ~ N(0,1)) üretilerek rastgele yürüyüş yolları simüle edilir.
            </p>
            <p>
              • <strong>DCA (Düzenli Tasarruf):</strong> Belirlediğiniz aylık katkı payı her periyot başında anaparaya bileşik getiri ile eklenir.
            </p>
            <p>
              • <strong>Reel Satın Alma Gücü:</strong> Nominal getiriler, TÜFE enflasyonu ile iskonto edilerek günümüzün reel alım gücüne indirgenir.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px]">
            💡 <strong>İpucu:</strong> Volatiliteyi düşürmek, getiri yelpazesini daraltarak en kötü senaryodaki anapara kaybı riskini dramatik ölçüde azaltır.
          </div>
        </div>
      </div>
    </div>
  );
};
