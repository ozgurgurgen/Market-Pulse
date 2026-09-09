import React, { useState, useEffect, useMemo } from 'react';
import { 
  Play, 
  RotateCcw, 
  Sparkles, 
  TrendingUp, 
  Flame, 
  ShieldCheck, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Scale, 
  Sliders, 
  Layers, 
  CheckCircle, 
  PieChart as PieIcon,
  HelpCircle,
  Zap,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { BacktestConfig, BacktestResult, BacktestAsset, AIModelConfig, TefasFund } from '../types';
import { safeFetchJson } from '../utils/apiClient';

interface BacktestSectionProps {
  initialAssetToAdd?: BacktestAsset | null;
  onClearInitialAsset?: () => void;
  modelConfig: AIModelConfig;
  onOpenModelSettings: () => void;
}

// Piyasa Varlıkları
const BASE_MARKET_ASSETS = [
  // BIST Hisseleri
  { code: 'THYAO', name: 'Türk Hava Yolları', type: 'STOCK_BIST' as const, annualAvgReturn: 84.0, volatility: 28.5 },
  { code: 'ASELS', name: 'Aselsan', type: 'STOCK_BIST' as const, annualAvgReturn: 78.0, volatility: 26.0 },
  { code: 'TUPRS', name: 'Tüpraş', type: 'STOCK_BIST' as const, annualAvgReturn: 88.0, volatility: 27.2 },
  { code: 'BIMAS', name: 'BİM Mağazaları', type: 'STOCK_BIST' as const, annualAvgReturn: 72.0, volatility: 19.5 },
  { code: 'GARAN', name: 'Garanti BBVA', type: 'STOCK_BIST' as const, annualAvgReturn: 110.0, volatility: 31.0 },

  // ABD Hisseleri & Kripto & Emtia
  { code: 'NVDA', name: 'NVIDIA Corporation', type: 'STOCK_US' as const, annualAvgReturn: 145.0, volatility: 38.0 },
  { code: 'MSFT', name: 'Microsoft Corporation', type: 'STOCK_US' as const, annualAvgReturn: 58.0, volatility: 19.0 },
  { code: 'ALTIN', name: 'Gram Altın', type: 'COMMODITY' as const, annualAvgReturn: 71.0, volatility: 17.0 },
  { code: 'BTC', name: 'Bitcoin', type: 'CRYPTO' as const, annualAvgReturn: 125.0, volatility: 52.0 },

  // Borsa Yatırım Fonları (ETF)
  { code: 'SPY', name: 'SPDR S&P 500 ETF Trust', type: 'ETF' as const, annualAvgReturn: 28.5, volatility: 13.2 },
  { code: 'QQQ', name: 'Invesco QQQ Trust (Nasdaq 100)', type: 'ETF' as const, annualAvgReturn: 36.4, volatility: 18.5 },
  { code: 'SMH', name: 'VanEck Semiconductor ETF', type: 'ETF' as const, annualAvgReturn: 64.2, volatility: 28.4 },
  { code: 'SCHD', name: 'Schwab U.S. Dividend Equity ETF', type: 'ETF' as const, annualAvgReturn: 18.2, volatility: 11.4 },
  { code: 'TLT', name: 'iShares 20+ Year Treasury Bond ETF', type: 'ETF' as const, annualAvgReturn: 6.8, volatility: 15.6 },
  { code: 'GLD', name: 'SPDR Gold Shares ETF', type: 'ETF' as const, annualAvgReturn: 32.4, volatility: 14.2 },
  { code: 'IBIT', name: 'iShares Bitcoin Trust (BlackRock)', type: 'ETF' as const, annualAvgReturn: 118.0, volatility: 48.0 },
  { code: 'IWM', name: 'iShares Russell 2000 Small-Cap ETF', type: 'ETF' as const, annualAvgReturn: 22.6, volatility: 20.4 },
];

export const BacktestSection: React.FC<BacktestSectionProps> = ({
  initialAssetToAdd,
  onClearInitialAsset,
  modelConfig,
  onOpenModelSettings,
}) => {
  const [liveFunds, setLiveFunds] = useState<TefasFund[]>([]);

  useEffect(() => {
    safeFetchJson<{ funds: TefasFund[] }>('/api/tefas/funds')
      .then(({ data, ok }) => {
        if (ok && data?.funds && Array.isArray(data.funds)) {
          setLiveFunds(data.funds);
        }
      })
      .catch(() => {});
  }, []);

  const availableAssetOptions = useMemo(() => {
    const fundOptions = liveFunds.map(f => ({
      code: f.code,
      name: `${f.code} - ${f.name} (${f.withholdingTax === 0 ? '%0 Stopaj' : f.categoryLabel || 'Fon'})`,
      type: 'TEFAS_FUND' as const,
      annualAvgReturn: f.return1Y || 0,
      volatility: f.standardDeviation || 15,
    }));
    return [...fundOptions, ...BASE_MARKET_ASSETS];
  }, [liveFunds]);

  // Backtest Configuration State
  const [initialCapital, setInitialCapital] = useState<number>(100000);
  const [monthlyDCA, setMonthlyDCA] = useState<number>(5000);
  const [period, setPeriod] = useState<'1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y'>('1Y');
  
  // Assets in Portfolio
  const [assets, setAssets] = useState<BacktestAsset[]>([
    { code: 'TI2', name: 'İş Portföy BIST Dışı Hisse Fonu (%0 Stopaj)', type: 'TEFAS_FUND', weight: 35, annualAvgReturn: 98.4, volatility: 24.8 },
    { code: 'GGK', name: 'Garanti Portföy Altın Fonu', type: 'TEFAS_FUND', weight: 25, annualAvgReturn: 71.2, volatility: 17.5 },
    { code: 'NRC', name: 'Neo Portföy Birinci Değişken Fon', type: 'TEFAS_FUND', weight: 20, annualAvgReturn: 69.5, volatility: 14.2 },
    { code: 'PPZ', name: 'Azimut Portföy Para Piyasası Fonu', type: 'TEFAS_FUND', weight: 20, annualAvgReturn: 61.2, volatility: 1.2 },
  ]);

  const [selectedAssetToAdd, setSelectedAssetToAdd] = useState<string>('MAC');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<BacktestResult | null>(null);

  // Handle incoming asset to add
  useEffect(() => {
    if (initialAssetToAdd) {
      const exists = assets.some(a => a.code.toUpperCase() === initialAssetToAdd.code.toUpperCase());
      if (!exists) {
        setAssets(prev => [...prev, { ...initialAssetToAdd, weight: 10 }]);
        distributeWeightsEqually([...assets, { ...initialAssetToAdd, weight: 10 }]);
      }
      if (onClearInitialAsset) onClearInitialAsset();
    }
  }, [initialAssetToAdd]);

  // Distribute weights equally
  const distributeWeightsEqually = (currentAssets = assets) => {
    if (currentAssets.length === 0) return;
    const equalWeight = Number((100 / currentAssets.length).toFixed(1));
    setAssets(currentAssets.map((a, i) => ({
      ...a,
      weight: i === currentAssets.length - 1 ? Number((100 - equalWeight * (currentAssets.length - 1)).toFixed(1)) : equalWeight
    })));
  };

  // Update asset weight
  const handleWeightChange = (index: number, newWeight: number) => {
    const updated = [...assets];
    updated[index].weight = Number(newWeight);
    setAssets(updated);
  };

  // Remove asset
  const handleRemoveAsset = (index: number) => {
    const updated = assets.filter((_, i) => i !== index);
    setAssets(updated);
    distributeWeightsEqually(updated);
  };

  // Add new asset
  const handleAddAsset = () => {
    const found = availableAssetOptions.find(a => a.code === selectedAssetToAdd);
    if (!found) return;
    if (assets.some(a => a.code === found.code)) return;

    const newAssets: BacktestAsset[] = [
      ...assets,
      {
        code: found.code,
        name: found.name,
        type: found.type as any,
        weight: 10,
        annualAvgReturn: found.annualAvgReturn,
        volatility: found.volatility,
      }
    ];
    setAssets(newAssets);
    distributeWeightsEqually(newAssets);
  };

  // Strategy Presets
  const applyPreset = (presetName: string) => {
    if (presetName === 'ENFLASYON_KORUMALI') {
      const preset: BacktestAsset[] = [
        { code: 'TI2', name: 'İş Portföy BIST Dışı Hisse (%0 Stopaj)', type: 'TEFAS_FUND', weight: 35, annualAvgReturn: 98.4, volatility: 24.8 },
        { code: 'GGK', name: 'Garanti Portföy Altın Fonu', type: 'TEFAS_FUND', weight: 25, annualAvgReturn: 71.2, volatility: 17.5 },
        { code: 'NRC', name: 'Neo Portföy Değişken Fon', type: 'TEFAS_FUND', weight: 20, annualAvgReturn: 69.5, volatility: 14.2 },
        { code: 'PPZ', name: 'Azimut Portföy Para Piyasası Fonu', type: 'TEFAS_FUND', weight: 20, annualAvgReturn: 61.2, volatility: 1.2 },
      ];
      setAssets(preset);
    } else if (presetName === 'YUKSEK_BUYUME') {
      const preset: BacktestAsset[] = [
        { code: 'TI2', name: 'İş Portföy BIST Dışı Hisse Fonu', type: 'TEFAS_FUND', weight: 40, annualAvgReturn: 98.4, volatility: 24.8 },
        { code: 'MAC', name: 'Marmara Capital Hisse Fonu', type: 'TEFAS_FUND', weight: 30, annualAvgReturn: 89.2, volatility: 21.5 },
        { code: 'AFT', name: 'Ak Portföy Yeni Teknolojiler (NASDAQ)', type: 'TEFAS_FUND', weight: 30, annualAvgReturn: 82.5, volatility: 22.4 },
      ];
      setAssets(preset);
    } else if (presetName === 'ALTIN_DOVIZ') {
      const preset: BacktestAsset[] = [
        { code: 'GGK', name: 'Garanti Portföy Altın Fonu', type: 'TEFAS_FUND', weight: 40, annualAvgReturn: 71.2, volatility: 17.5 },
        { code: 'DBH', name: 'Deniz Portföy Eurobond Fonu (USD)', type: 'TEFAS_FUND', weight: 30, annualAvgReturn: 52.4, volatility: 13.8 },
        { code: 'PPZ', name: 'Azimut Portföy Para Piyasası Fonu', type: 'TEFAS_FUND', weight: 30, annualAvgReturn: 61.2, volatility: 1.2 },
      ];
      setAssets(preset);
    } else if (presetName === 'BIST_HISSE') {
      const preset: BacktestAsset[] = [
        { code: 'THYAO', name: 'Türk Hava Yolları', type: 'STOCK_BIST', weight: 25, annualAvgReturn: 84.0, volatility: 28.5 },
        { code: 'ASELS', name: 'Aselsan', type: 'STOCK_BIST', weight: 25, annualAvgReturn: 78.0, volatility: 26.0 },
        { code: 'TUPRS', name: 'Tüpraş', type: 'STOCK_BIST', weight: 25, annualAvgReturn: 88.0, volatility: 27.2 },
        { code: 'BIMAS', name: 'BİM Mağazaları', type: 'STOCK_BIST', weight: 25, annualAvgReturn: 72.0, volatility: 19.5 },
      ];
      setAssets(preset);
    }
  };

  // Run Backtest
  const runBacktest = async () => {
    if (assets.length === 0) return;
    setIsRunning(true);

    try {
      const config: BacktestConfig = {
        initialCapital,
        monthlyDCA,
        period,
        assets,
      };

      const { data, ok } = await safeFetchJson<{ result: BacktestResult }>('/api/backtest/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config, modelConfig }),
      });

      if (ok && data?.result) {
        setResult(data.result);
      }
    } catch (err) {
      console.error('Backtest error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  // Run initial backtest on load
  useEffect(() => {
    runBacktest();
  }, []);

  const totalCurrentWeight = assets.reduce((sum, a) => sum + (Number(a.weight) || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-2xl shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                <TrendingUp size={12} /> Geçmiş Veri & Algoritmik Simülasyon
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Sparkles size={12} /> Model: {modelConfig.provider === 'ollama' ? `Ollama (${modelConfig.ollamaModel})` : modelConfig.geminiModel}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Portföy Backtest & Enflasyon Kıyaslama Motoru
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              TEFAS fonları, BIST hisseleri ve değerli madenlerle oluşturduğunuz sepeti geçmişte test edin; TÜFE enflasyonuna karşı net reel kazancınızı ve risk-getiri dengesini yapay zeka ile denetleyin.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenModelSettings}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
          >
            <Zap size={14} className="text-amber-400" />
            <span>AI Model Seç</span>
          </button>
        </div>

        {/* Preset Strategies */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Sliders size={13} /> Hazır Şablonlar:
          </span>

          <button
            type="button"
            onClick={() => applyPreset('ENFLASYON_KORUMALI')}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all cursor-pointer"
          >
            🛡️ Enflasyon Kalkanı (%0 Stopaj + Altın)
          </button>

          <button
            type="button"
            onClick={() => applyPreset('YUKSEK_BUYUME')}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all cursor-pointer"
          >
            🚀 Yüksek Büyüme & Teknoloji (TI2, MAC, AFT)
          </button>

          <button
            type="button"
            onClick={() => applyPreset('ALTIN_DOVIZ')}
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all cursor-pointer"
          >
            💎 Altın & Eurobond Döviz Sepeti
          </button>

          <button
            type="button"
            onClick={() => applyPreset('BIST_HISSE')}
            className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all cursor-pointer"
          >
            🇹🇷 BIST 30 Lider Şirketler (THYAO, ASELS, TUPRS)
          </button>
        </div>
      </div>

      {/* Main Grid: Left Config Panel, Right Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Settings & Asset Builder (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders size={14} className="text-emerald-400" />
              1. Simülasyon Parametreleri
            </h2>

            {/* Initial Capital & Monthly DCA */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Başlangıç Sermayesi (₺)
                </label>
                <input
                  type="number"
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(Math.max(1000, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Aylık Düzenli Alım / DCA (₺)
                </label>
                <input
                  type="number"
                  value={monthlyDCA}
                  onChange={(e) => setMonthlyDCA(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Test Period Buttons */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                Geriye Dönük Test Süresi
              </label>
              <div className="grid grid-cols-6 gap-1.5">
                {(['1M', '3M', '6M', '1Y', '3Y', '5Y'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPeriod(p)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      period === p
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Asset Allocation Builder */}
            <div className="pt-3 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <PieIcon size={14} className="text-cyan-400" />
                  2. Portföy Varlıkları (%{totalCurrentWeight})
                </h2>
                <button
                  type="button"
                  onClick={() => distributeWeightsEqually()}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                >
                  Eşit Dağıt
                </button>
              </div>

              {/* Asset List with sliders */}
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {assets.map((asset, idx) => (
                  <div key={asset.code} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                          {asset.code}
                        </span>
                        <span className="text-xs font-medium text-slate-200 truncate max-w-[180px]">
                          {asset.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-100 font-mono">
                          %{asset.weight}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAsset(idx)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Weight Slider */}
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={asset.weight}
                      onChange={(e) => handleWeightChange(idx, Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                ))}
              </div>

              {/* Add New Asset Dropdown */}
              <div className="flex items-center gap-2 pt-1">
                <select
                  value={selectedAssetToAdd}
                  onChange={(e) => setSelectedAssetToAdd(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {availableAssetOptions.map((opt) => (
                    <option key={opt.code} value={opt.code}>
                      {opt.code} - {opt.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  id="add-asset-to-backtest-list-btn"
                  onClick={handleAddAsset}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Ekle
                </button>
              </div>

              {/* Run Backtest Button */}
              <button
                type="button"
                id="run-backtest-btn"
                onClick={runBacktest}
                disabled={isRunning || assets.length === 0}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
              >
                <Play size={15} className={isRunning ? 'animate-spin' : 'fill-slate-950'} />
                <span>{isRunning ? 'Backtest Hesaplanıyor & AI Denetliyor...' : 'Backtest’i Başlat & AI Denetimi Al'}</span>
              </button>

            </div>

          </div>
        </div>

        {/* Right Dashboard: Charts & Financial Audit Report (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {isRunning ? (
            <div className="p-16 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-3">
              <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="text-sm font-bold text-slate-200">Algoritmik Portföy Backtest Çalışıyor...</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Geçmiş piyasa döngüleri, kümülatif TÜFE enflasyonu, BIST 100 ve Sharpe rasyoları analiz ediliyor.
              </p>
            </div>
          ) : result ? (
            <div className="space-y-5">
              
              {/* Executive Summary Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                
                {/* Total Return */}
                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="text-[11px] text-slate-400">Toplam Portföy Getirisi</div>
                  <div className="text-lg font-black text-emerald-400 mt-0.5">
                    +{result.totalReturnPercent}%
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Yıllıklandırılmış: %{result.annualizedReturnPercent}
                  </div>
                </div>

                {/* Net Real Profit Over Inflation */}
                <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/40 rounded-xl">
                  <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <Flame size={12} /> Net Reel Kazanç (TÜFE+)
                  </div>
                  <div className="text-lg font-black text-emerald-300 mt-0.5">
                    +{result.realReturnPercent}%
                  </div>
                  <div className="text-[10px] text-emerald-400/80">
                    Enflasyon ({result.benchmarkInflationReturn}%) üstü alım gücü
                  </div>
                </div>

                {/* Final Value & Net Profit */}
                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="text-[11px] text-slate-400">Nihai Değer (Net Kar)</div>
                  <div className="text-base font-bold text-slate-100 mt-0.5 truncate">
                    ₺{result.finalValue.toLocaleString('tr-TR')}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-semibold truncate">
                    +₺{result.netProfit.toLocaleString('tr-TR')}
                  </div>
                </div>

                {/* Sharpe & Max Drawdown */}
                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="text-[11px] text-slate-400">Sharpe / Maks. Düşüş</div>
                  <div className="text-base font-bold text-cyan-400 mt-0.5">
                    Sharpe: {result.sharpeRatio}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Max DD: <span className="text-rose-400 font-semibold">%{result.maxDrawdown}</span>
                  </div>
                </div>

              </div>

              {/* Recharts Time Series Performance vs Benchmarks */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp size={14} className="text-emerald-400" />
                      Kümülatif Portföy vs TÜFE Enflasyonu vs BIST 100
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Yatırılan sermayenin zaman içindeki büyümesi (₺)
                    </p>
                  </div>
                  <div className="text-xs text-slate-400">
                    Sermaye: <span className="font-bold text-slate-200">₺{result.totalInvested.toLocaleString('tr-TR')}</span>
                  </div>
                </div>

                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={result.timeSeries} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={(val) => `₺${(val / 1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                        formatter={(val: any) => [`₺${Number(val).toLocaleString('tr-TR')}`, '']}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      
                      {/* Portfolio Line */}
                      <Line
                        type="monotone"
                        dataKey="portfolioValue"
                        name="Benim Portföyüm"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ r: 3, fill: '#10b981' }}
                        activeDot={{ r: 6 }}
                      />

                      {/* Inflation Line */}
                      <Line
                        type="monotone"
                        dataKey="inflationValue"
                        name="TÜFE Enflasyonu"
                        stroke="#f43f5e"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={false}
                      />

                      {/* BIST 100 Line */}
                      <Line
                        type="monotone"
                        dataKey="bistValue"
                        name="BIST 100 Endeksi"
                        stroke="#38bdf8"
                        strokeWidth={1.5}
                        strokeDasharray="2 2"
                        dot={false}
                      />

                      {/* Gold Line */}
                      <Line
                        type="monotone"
                        dataKey="goldValue"
                        name="Gram Altın"
                        stroke="#eab308"
                        strokeWidth={1.5}
                        strokeDasharray="2 2"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AI Financial Literacy Audit Card */}
              {result.aiEvaluation && (
                <div className="p-5 bg-gradient-to-r from-emerald-950/20 via-slate-900 to-cyan-950/20 border border-emerald-500/30 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-emerald-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Finansal Okuryazarlık Yapay Zeka Denetimi
                      </span>
                    </div>

                    <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-slate-950">
                      {result.aiEvaluation.verdict}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {result.aiEvaluation.summary}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* Strengths */}
                    <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-xl space-y-1.5">
                      <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle size={13} /> Güçlü Noktalar
                      </div>
                      <ul className="space-y-1 text-slate-300 text-[11px]">
                        {result.aiEvaluation.strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-emerald-400">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Optimization Tips */}
                    <div className="p-3 bg-cyan-950/20 border border-cyan-900/40 rounded-xl space-y-1.5">
                      <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                        <Zap size={13} /> İyileştirme Tavsiyeleri
                      </div>
                      <ul className="space-y-1 text-slate-300 text-[11px]">
                        {result.aiEvaluation.optimizationTips.map((t, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-cyan-400">•</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Asset Performance Breakdown Table */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2.5">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Varlık Bazında Nihai Getiri Dağılımı
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="text-[10px] font-semibold text-slate-500 uppercase border-b border-slate-800">
                      <tr>
                        <th className="pb-2">Varlık</th>
                        <th className="pb-2 text-right">Ağırlık</th>
                        <th className="pb-2 text-right">Yatırılan</th>
                        <th className="pb-2 text-right">Nihai Değer</th>
                        <th className="pb-2 text-right">Net Kar</th>
                        <th className="pb-2 text-right">Getiri %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {result.assetBreakdown.map((item) => (
                        <tr key={item.code} className="hover:bg-slate-800/30">
                          <td className="py-2.5 font-bold text-slate-100 flex items-center gap-1.5">
                            <span className="text-emerald-400 font-mono">{item.code}</span>
                            <span className="text-slate-400 font-normal truncate max-w-[140px]">{item.name}</span>
                          </td>
                          <td className="py-2.5 text-right font-mono font-semibold text-slate-200">
                            %{item.weight}
                          </td>
                          <td className="py-2.5 text-right font-mono text-slate-400">
                            ₺{item.investedAmount.toLocaleString('tr-TR')}
                          </td>
                          <td className="py-2.5 text-right font-mono font-bold text-slate-100">
                            ₺{item.finalValue.toLocaleString('tr-TR')}
                          </td>
                          <td className="py-2.5 text-right font-mono font-bold text-emerald-400">
                            +₺{item.profitAmount.toLocaleString('tr-TR')}
                          </td>
                          <td className="py-2.5 text-right font-mono font-bold text-emerald-400">
                            +{item.returnPercent}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          ) : null}
        </div>

      </div>

    </div>
  );
};
