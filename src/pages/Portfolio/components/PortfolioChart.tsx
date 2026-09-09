import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  BarChart2,
  Calendar,
  Layers,
  CheckSquare,
  Square,
  PlusCircle,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  DollarSign,
  Info,
} from 'lucide-react';
import {
  PortfolioPerformanceSnapshot,
  PortfolioTWRPoint,
  BenchmarkResult,
  PortfolioTransaction,
  PortfolioHoldingSnapshot,
} from '../../../types';

interface PortfolioChartProps {
  portfolioTWR?: PortfolioTWRPoint[];
  benchmarks?: BenchmarkResult[];
  snapshots?: PortfolioPerformanceSnapshot[];
  transactions?: PortfolioTransaction[];
  holdings?: PortfolioHoldingSnapshot[];
  baseCurrency: 'TRY' | 'USD';
  initialCost: number;
  selectedRange: '1M' | '3M' | '1Y' | 'ALL';
  onRangeChange: (range: '1M' | '3M' | '1Y' | 'ALL') => void;
  onAddTransaction?: (tx: {
    type: 'deposit' | 'withdrawal' | 'buy' | 'sell';
    amount: number;
    symbol?: string;
    quantity?: number;
    price?: number;
    date?: string;
    notes?: string;
  }) => void;
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({
  portfolioTWR = [],
  benchmarks = [],
  snapshots = [],
  transactions = [],
  holdings = [],
  baseCurrency,
  initialCost,
  selectedRange,
  onRangeChange,
  onAddTransaction,
}) => {
  const [metricMode, setMetricMode] = useState<'VALUE_LINE' | 'ASSET_SERIES' | 'TWR' | 'DAILY'>('VALUE_LINE');
  const [assetMetricType, setAssetMetricType] = useState<'PERCENT' | 'VALUE'>('PERCENT');

  // Benchmark Görünürlük Durumları
  const [visibleBenchmarks, setVisibleBenchmarks] = useState<{ [key: string]: boolean }>({
    GAU: true,
    USDTRY: true,
    XU100: true,
    TUFE: true,
  });

  // Varlık Çizgi Grafiği Görünürlük Durumları
  const [visibleAssets, setVisibleAssets] = useState<{ [ticker: string]: boolean }>({});

  // Renk Paleti (Varlıklar için)
  const assetColors = useMemo(() => [
    '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899',
    '#06b6d4', '#14b8a6', '#6366f1', '#f97316', '#84cc16'
  ], []);

  // Varlıklar ilk geldiğinde veya değiştiğinde görünürlükleri varsayılan true yap
  React.useEffect(() => {
    if (holdings && holdings.length > 0) {
      setVisibleAssets((prev) => {
        const next = { ...prev };
        holdings.forEach((h) => {
          if (next[h.ticker] === undefined) {
            next[h.ticker] = true;
          }
        });
        return next;
      });
    }
  }, [holdings]);

  const toggleAsset = (ticker: string) => {
    setVisibleAssets((prev) => ({ ...prev, [ticker]: !prev[ticker] }));
  };

  const selectOnlyAsset = (ticker: string) => {
    const next: { [key: string]: boolean } = {};
    holdings.forEach((h) => {
      next[h.ticker] = h.ticker === ticker;
    });
    setVisibleAssets(next);
  };

  const selectAllAssets = () => {
    const next: { [key: string]: boolean } = {};
    holdings.forEach((h) => {
      next[h.ticker] = true;
    });
    setVisibleAssets(next);
  };

  // Transaction Ekleme Modal Durumu
  const [showTxModal, setShowTxModal] = useState(false);
  const [txType, setTxType] = useState<'deposit' | 'withdrawal' | 'buy' | 'sell'>('deposit');
  const [txAmount, setTxAmount] = useState('');
  const [txNotes, setTxNotes] = useState('');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);

  const currencySymbol = baseCurrency === 'USD' ? '$' : '₺';

  const benchmarkConfig: { [key: string]: { label: string; color: string; bg: string } } = {
    GAU: { label: 'Gram Altın', color: '#f59e0b', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    USDTRY: { label: 'Dolar/TL', color: '#06b6d4', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
    XU100: { label: 'BIST 100', color: '#a855f7', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
    TUFE: { label: 'TÜFE (Enflasyon)', color: '#f43f5e', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
  };

  const toggleBenchmark = (code: string) => {
    setVisibleBenchmarks((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  // Birleşik Grafik Veri Seti Hazırlama
  const combinedChartData = useMemo(() => {
    if (!portfolioTWR || portfolioTWR.length === 0) return [];

    const benchmarkMap: { [code: string]: { [date: string]: number } } = {};
    benchmarks.forEach((bm) => {
      benchmarkMap[bm.code] = {};
      bm.data.forEach((d) => {
        benchmarkMap[bm.code][d.date] = d.value;
      });
    });

    // Snapshots maliyet haritası
    const costMap: { [date: string]: number } = {};
    snapshots.forEach((s) => {
      costMap[s.date] = s.totalCost;
    });

    // Varlık zaman serisi haritası: ticker -> date -> point
    const assetMap: { [ticker: string]: { [date: string]: { price: number; value: number; pnlPct: number } } } = {};
    holdings.forEach((h) => {
      assetMap[h.ticker] = {};
      if (h.timeSeries && h.timeSeries.length > 0) {
        h.timeSeries.forEach((pt) => {
          assetMap[h.ticker][pt.date] = {
            price: pt.price,
            value: pt.marketValue,
            pnlPct: pt.pnlPercentage,
          };
        });
      }
    });

    let runningCost = initialCost;

    return portfolioTWR.map((pt) => {
      if (costMap[pt.date] !== undefined) {
        runningCost = costMap[pt.date];
      }

      const totalVal = pt.totalValue;
      const netPnl = totalVal - runningCost;
      const netPnlPct = runningCost > 0 ? (netPnl / runningCost) * 100 : 0;

      const row: any = {
        date: pt.date,
        portfolioTWR: pt.value,
        totalValue: totalVal,
        totalCost: runningCost,
        netPnl,
        netPnlPct,
        cashFlow: pt.cashFlow,
        dailyPnl: pt.dailyPnl,
        cumulativePnl: pt.cumulativePnl,
      };

      benchmarks.forEach((bm) => {
        row[bm.code] = benchmarkMap[bm.code]?.[pt.date] ?? 0;
      });

      // Her varlık için değer ve yüzde getiriyi ekle
      holdings.forEach((h) => {
        const ptData = assetMap[h.ticker]?.[pt.date];
        if (ptData) {
          row[`${h.ticker}_val`] = ptData.value;
          row[`${h.ticker}_price`] = ptData.price;
          row[`${h.ticker}_pct`] = ptData.pnlPct;
        } else {
          row[`${h.ticker}_val`] = h.marketValue;
          row[`${h.ticker}_price`] = h.currentPrice;
          row[`${h.ticker}_pct`] = h.pnlPercentage;
        }
      });

      return row;
    });
  }, [portfolioTWR, benchmarks, snapshots, holdings, initialCost]);

  // Portföy Toplam Değeri İstatistikleri (ATH, Dip, Büyüme)
  const portfolioStats = useMemo(() => {
    if (combinedChartData.length === 0) return null;
    let maxVal = -Infinity;
    let minVal = Infinity;
    let maxDate = '';
    let minDate = '';

    combinedChartData.forEach((row) => {
      const v = row.totalValue || 0;
      if (v > maxVal) {
        maxVal = v;
        maxDate = row.date;
      }
      if (v < minVal) {
        minVal = v;
        minDate = row.date;
      }
    });

    const first = combinedChartData[0];
    const last = combinedChartData[combinedChartData.length - 1];
    const startVal = first?.totalValue || initialCost;
    const endVal = last?.totalValue || 0;
    const currentCost = last?.totalCost || initialCost;
    const totalPnl = endVal - currentCost;
    const totalPnlPct = currentCost > 0 ? (totalPnl / currentCost) * 100 : 0;

    return {
      ath: maxVal > 0 ? maxVal : endVal,
      athDate: maxDate,
      atl: minVal < Infinity ? minVal : startVal,
      atlDate: minDate,
      startVal,
      endVal,
      currentCost,
      totalPnl,
      totalPnlPct,
    };
  }, [combinedChartData, initialCost]);

  // Alfa & Göreli Performans Metrikleri
  const latestRow = useMemo(() => {
    if (combinedChartData.length === 0) return null;
    return combinedChartData[combinedChartData.length - 1];
  }, [combinedChartData]);

  const handleTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txAmount || Number(txAmount) <= 0) return;

    if (onAddTransaction) {
      onAddTransaction({
        type: txType,
        amount: Number(txAmount),
        date: txDate,
        notes: txNotes || (txType === 'deposit' ? 'Nakit Yatırma' : 'Nakit Çekme'),
      });
    }

    setShowTxModal(false);
    setTxAmount('');
    setTxNotes('');
  };

  if (!portfolioTWR || portfolioTWR.length === 0) {
    return (
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 text-center text-slate-500 space-y-2">
        <Layers className="mx-auto text-slate-600 mb-2" size={32} />
        <p className="text-sm font-semibold text-slate-300">Portföy Performans Verisi Hazırlanıyor...</p>
        <p className="text-xs text-slate-500">TWR ve benchmark analizi oluşturuluyor.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-5 shadow-2xl">
      {/* Header & Mode Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-inner">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                {metricMode === 'VALUE_LINE' && 'Portföy Toplam Değeri Geçmiş Performansı (Çizgi Grafik)'}
                {metricMode === 'ASSET_SERIES' && 'Portföy Varlıkları Dinamik Zaman Serisi Analizi'}
                {metricMode === 'TWR' && 'Portföy Performans Grafiği (TWR) & Benchmark Kıyası'}
                {metricMode === 'DAILY' && 'Portföy Günlük Kâr / Zarar Dağılımı'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {metricMode === 'VALUE_LINE' && 'Değer Eğrisi'}
                {metricMode === 'ASSET_SERIES' && `${holdings.length} Varlık`}
                {metricMode === 'TWR' && 'TWR Standardı'}
                {metricMode === 'DAILY' && 'Günlük PnL'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {metricMode === 'VALUE_LINE' && 'Toplam portföy piyasa değeri ile yatırılan sermaye maliyeti çizgi grafiği'}
              {metricMode === 'ASSET_SERIES' && 'Hisse senetleri ve yatırım fonlarının geçmiş fiyat ve getiri eğrileri'}
              {metricMode === 'TWR' && 'Nakit giriş/çıkışlarından (Cash Flows) arındırılmış gerçek zaman ağırlıklı getiri'}
              {metricMode === 'DAILY' && 'Günlük gerçekleşen net portföy kâr ve zarar dalgalanmaları'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Nakit Hareketi Ekle Button */}
          <button
            onClick={() => setShowTxModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/80 transition-all cursor-pointer shadow-sm"
          >
            <PlusCircle size={14} className="text-emerald-400" />
            <span>Nakit / Varlık Ekle</span>
          </button>

          {/* Metric Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setMetricMode('VALUE_LINE')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                metricMode === 'VALUE_LINE'
                  ? 'bg-emerald-500 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Portföy Değeri (Çizgi)
            </button>
            <button
              onClick={() => setMetricMode('ASSET_SERIES')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                metricMode === 'ASSET_SERIES'
                  ? 'bg-emerald-500 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Varlık Zaman Serileri
            </button>
            <button
              onClick={() => setMetricMode('TWR')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                metricMode === 'TWR'
                  ? 'bg-emerald-500 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              TWR Getiri (%)
            </button>
            <button
              onClick={() => setMetricMode('DAILY')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                metricMode === 'DAILY'
                  ? 'bg-emerald-500 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Günlük PnL
            </button>
          </div>

          {/* Range Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            {(['1M', '3M', '1Y', 'ALL'] as const).map((r) => (
              <button
                key={r}
                onClick={() => onRangeChange(r)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedRange === r
                    ? 'bg-slate-800 text-emerald-400 font-bold border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r === '1M' ? '1A' : r === '3M' ? '3A' : r === '1Y' ? '1Y' : 'TÜMÜ'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* VALUE_LINE Modunda İstatistik Özet Kartları */}
      {metricMode === 'VALUE_LINE' && portfolioStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400 font-medium">Toplam Portföy Değeri</span>
            <div className="text-base font-black text-emerald-400">
              {currencySymbol}{portfolioStats.endVal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400 font-medium">Toplam Yatırılan Maliyet</span>
            <div className="text-base font-bold text-slate-300">
              {currencySymbol}{portfolioStats.currentCost.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400 font-medium">Net Kâr / Zarar</span>
            <div className={`text-base font-black ${portfolioStats.totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {portfolioStats.totalPnl >= 0 ? '+' : ''}
              {currencySymbol}{portfolioStats.totalPnl.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-xs font-semibold ml-1.5 opacity-90">
                (%{portfolioStats.totalPnlPct.toFixed(2)})
              </span>
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400 font-medium">Tüm Zamanların Zirvesi (ATH)</span>
            <div className="text-base font-bold text-amber-400 flex items-center gap-1.5">
              <span>{currencySymbol}{portfolioStats.ath.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                ATH
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ASSET_SERIES Modunda Varlık Filtreleri & Metrik Seçici */}
      {metricMode === 'ASSET_SERIES' && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Layers size={14} className="text-emerald-400" />
              <span>Varlık Çizgileri:</span>
            </div>
            <button
              onClick={selectAllAssets}
              className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer border border-slate-700"
            >
              Tümünü Göster
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Metrik Türü: % Getiri vs Tutar */}
            <div className="flex items-center bg-slate-900 p-0.5 rounded-xl border border-slate-800 text-[11px] mr-2">
              <button
                onClick={() => setAssetMetricType('PERCENT')}
                className={`px-2.5 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                  assetMetricType === 'PERCENT'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Getiri (%)
              </button>
              <button
                onClick={() => setAssetMetricType('VALUE')}
                className={`px-2.5 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                  assetMetricType === 'VALUE'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Piyasa Değeri ({currencySymbol})
              </button>
            </div>

            {/* Varlık Toggle Rozetleri */}
            {holdings.map((h, idx) => {
              const color = assetColors[idx % assetColors.length];
              const isChecked = visibleAssets[h.ticker] ?? true;

              return (
                <div key={h.ticker} className="flex items-center">
                  <button
                    onClick={() => toggleAsset(h.ticker)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                      isChecked
                        ? 'bg-slate-800 text-white border-slate-700 shadow-sm'
                        : 'bg-slate-900/60 text-slate-500 border-slate-800/80 opacity-60'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: isChecked ? color : '#64748b' }}
                    />
                    <span className="font-bold">{h.ticker}</span>
                    <span className={`text-[10px] ${h.pnlPercentage >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      %{h.pnlPercentage.toFixed(1)}
                    </span>
                  </button>
                  <button
                    onClick={() => selectOnlyAsset(h.ticker)}
                    title="Yalnızca bu varlığı incele"
                    className="ml-0.5 px-1 py-1 text-[9px] text-slate-500 hover:text-emerald-400 cursor-pointer"
                  >
                    tek
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Benchmark Interactive Toggles (Only visible in TWR mode) */}
      {metricMode === 'TWR' && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Layers size={14} className="text-slate-400" />
            <span>Karşılaştırma Göstergeleri:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Primary Portfolio Line Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm" />
              <span>Portföy TWR</span>
            </div>

            {/* Benchmark Toggle Checkboxes */}
            {benchmarks.map((bm) => {
              const cfg = benchmarkConfig[bm.code] || {
                label: bm.label,
                color: '#94a3b8',
                bg: 'bg-slate-800 text-slate-300',
              };
              const isChecked = visibleBenchmarks[bm.code] ?? true;

              return (
                <button
                  key={bm.code}
                  onClick={() => toggleBenchmark(bm.code)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                    isChecked
                      ? cfg.bg
                      : 'bg-slate-900/60 text-slate-500 border-slate-800 hover:text-slate-400'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare size={13} className="text-current" />
                  ) : (
                    <Square size={13} className="text-slate-600" />
                  )}
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: isChecked ? cfg.color : '#64748b' }}
                  />
                  <span>{cfg.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Chart Canvas */}
      <div className="h-[340px] w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          {metricMode === 'VALUE_LINE' ? (
            /* Portföy Toplam Değeri Geçmiş Performansı Çizgi Grafiği */
            <LineChart data={combinedChartData} margin={{ top: 12, right: 15, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.25} vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                tickFormatter={(v) => {
                  const parts = v.split('-');
                  return parts.length >= 3 ? `${parts[2]}/${parts[1]}` : v;
                }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                domain={['auto', 'auto']}
                tickFormatter={(val) => {
                  if (val >= 1000000) return `${currencySymbol}${(val / 1000000).toFixed(1)}M`;
                  if (val >= 1000) return `${currencySymbol}${(val / 1000).toFixed(0)}K`;
                  return `${currencySymbol}${val}`;
                }}
              />
              {portfolioStats && (
                <ReferenceLine
                  y={portfolioStats.ath}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  opacity={0.7}
                  label={{
                    value: `ATH: ${currencySymbol}${(portfolioStats.ath / 1000).toFixed(0)}K`,
                    position: 'insideTopRight',
                    fill: '#f59e0b',
                    fontSize: 10,
                  }}
                />
              )}
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-slate-900/95 border border-slate-700 p-3.5 rounded-2xl shadow-2xl text-xs space-y-2.5 min-w-[240px] backdrop-blur-md">
                        <div className="text-slate-400 font-bold flex items-center justify-between pb-1.5 border-b border-slate-800">
                          <span className="flex items-center gap-1.5 text-slate-300">
                            <Calendar size={13} className="text-emerald-400" />
                            {d.date}
                          </span>
                          {d.cashFlow !== 0 && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 font-black border border-cyan-500/30">
                              {d.cashFlow > 0 ? `+${d.cashFlow} TL Giriş` : `${d.cashFlow} TL Çıkış`}
                            </span>
                          )}
                        </div>

                        {/* Toplam Portföy Değeri */}
                        <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-white">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm" />
                            <span className="font-semibold text-emerald-300">Toplam Portföy Değeri:</span>
                          </div>
                          <span className="font-black text-sm text-emerald-400">
                            {currencySymbol}{d.totalValue?.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>

                        {/* Toplam Maliyet */}
                        <div className="flex items-center justify-between px-2 text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-sm bg-slate-400" />
                            <span className="text-slate-400">Yatırılan Sermaye (Maliyet):</span>
                          </div>
                          <span className="font-semibold text-slate-200">
                            {currencySymbol}{d.totalCost?.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>

                        {/* Net Kâr / Zarar */}
                        <div className="flex items-center justify-between px-2 pt-1 border-t border-slate-800/80">
                          <span className="text-slate-400">Net Kâr / Zarar:</span>
                          <div className="text-right">
                            <span className={`font-bold ${d.netPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {d.netPnl >= 0 ? '+' : ''}{currencySymbol}{d.netPnl?.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <span className={`text-[10px] ml-1.5 font-bold ${d.netPnlPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              (%{d.netPnlPct?.toFixed(2)})
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Portföy Toplam Değeri Ana Çizgisi */}
              <Line
                type="monotone"
                dataKey="totalValue"
                name="Toplam Portföy Değeri"
                stroke="#10b981"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#10b981', stroke: '#022c22', strokeWidth: 2 }}
              />
              {/* Toplam Maliyet Çizgisi */}
              <Line
                type="monotone"
                dataKey="totalCost"
                name="Toplam Yatırılan Maliyet"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 4, fill: '#94a3b8' }}
              />
            </LineChart>
          ) : metricMode === 'ASSET_SERIES' ? (
            /* Varlıklar Dinamik Zaman Serisi Çizgi Grafiği */
            <LineChart data={combinedChartData} margin={{ top: 12, right: 15, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.25} vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                tickFormatter={(v) => {
                  const parts = v.split('-');
                  return parts.length >= 3 ? `${parts[2]}/${parts[1]}` : v;
                }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                domain={['auto', 'auto']}
                tickFormatter={(val) => {
                  if (assetMetricType === 'PERCENT') return `%${val.toFixed(0)}`;
                  if (val >= 1000000) return `${currencySymbol}${(val / 1000000).toFixed(1)}M`;
                  if (val >= 1000) return `${currencySymbol}${(val / 1000).toFixed(0)}K`;
                  return `${currencySymbol}${val}`;
                }}
              />
              {assetMetricType === 'PERCENT' && (
                <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" opacity={0.8} />
              )}
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-slate-900/95 border border-slate-700 p-3.5 rounded-2xl shadow-2xl text-xs space-y-2 min-w-[240px] max-h-[300px] overflow-y-auto">
                        <div className="text-slate-400 font-bold flex items-center justify-between pb-1.5 border-b border-slate-800">
                          <span className="flex items-center gap-1.5 text-slate-300">
                            <Calendar size={13} className="text-emerald-400" />
                            {d.date}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {assetMetricType === 'PERCENT' ? 'Net Getiri %' : `Piyasa Değeri (${currencySymbol})`}
                          </span>
                        </div>

                        {/* Her Varlığın O Günkü Değeri / Getirisi */}
                        <div className="space-y-1.5">
                          {holdings.map((h, idx) => {
                            if (!visibleAssets[h.ticker]) return null;
                            const color = assetColors[idx % assetColors.length];
                            const pctVal = d[`${h.ticker}_pct`] ?? h.pnlPercentage;
                            const curVal = d[`${h.ticker}_val`] ?? h.marketValue;
                            const priceVal = d[`${h.ticker}_price`] ?? h.currentPrice;

                            return (
                              <div key={h.ticker} className="flex items-center justify-between text-slate-200">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                                  <span className="font-bold">{h.ticker}</span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    ({currencySymbol}{priceVal?.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                                  </span>
                                </div>
                                <div className="text-right">
                                  {assetMetricType === 'PERCENT' ? (
                                    <span className={`font-bold ${pctVal >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                      {pctVal >= 0 ? '+' : ''}{pctVal.toFixed(2)}%
                                    </span>
                                  ) : (
                                    <span className="font-bold text-slate-200">
                                      {currencySymbol}{curVal?.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Her Görünür Varlık İçin Ayrı Bir Çizgi */}
              {holdings.map((h, idx) => {
                if (!visibleAssets[h.ticker]) return null;
                const color = assetColors[idx % assetColors.length];
                const key = assetMetricType === 'PERCENT' ? `${h.ticker}_pct` : `${h.ticker}_val`;

                return (
                  <Line
                    key={h.ticker}
                    type="monotone"
                    dataKey={key}
                    name={h.ticker}
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5, fill: color, stroke: '#0f172a', strokeWidth: 2 }}
                  />
                );
              })}
            </LineChart>
          ) : metricMode === 'TWR' ? (
            /* TWR & Benchmark Karşılaştırma Çizgi Grafiği */
            <LineChart data={combinedChartData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.25} vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                tickFormatter={(v) => {
                  const parts = v.split('-');
                  return parts.length >= 3 ? `${parts[2]}/${parts[1]}` : v;
                }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                tickFormatter={(val) => `%${val.toFixed(0)}`}
              />
              <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" opacity={0.8} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-3.5 rounded-2xl shadow-2xl text-xs space-y-2 min-w-[210px]">
                        <div className="text-slate-400 font-bold flex items-center justify-between pb-1.5 border-b border-slate-800">
                          <span className="flex items-center gap-1">
                            <Calendar size={13} />
                            {d.date}
                          </span>
                          {d.cashFlow !== 0 && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 font-extrabold border border-cyan-500/30">
                              {d.cashFlow > 0 ? `+${d.cashFlow} TL Nakit` : `${d.cashFlow} TL Çekim`}
                            </span>
                          )}
                        </div>

                        {/* Portfolio TWR Row */}
                        <div className="flex items-center justify-between text-white font-bold text-sm bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20">
                          <div className="flex items-center gap-1.5 text-emerald-400">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                            <span>Portföy (TWR):</span>
                          </div>
                          <span className={d.portfolioTWR >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                            {d.portfolioTWR >= 0 ? '+' : ''}
                            {d.portfolioTWR.toFixed(2)}%
                          </span>
                        </div>

                        {/* Active Benchmark Rows */}
                        <div className="space-y-1 pt-1 border-t border-slate-800/80">
                          {benchmarks.map((bm) => {
                            if (!visibleBenchmarks[bm.code]) return null;
                            const val = d[bm.code] ?? 0;
                            const cfg = benchmarkConfig[bm.code];

                            return (
                              <div key={bm.code} className="flex items-center justify-between text-slate-300">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: cfg?.color || '#94a3b8' }}
                                  />
                                  <span className="text-slate-400">{cfg?.label || bm.label}:</span>
                                </div>
                                <span className={val >= 0 ? 'text-slate-200 font-semibold' : 'text-rose-400'}>
                                  {val >= 0 ? '+' : ''}
                                  {val.toFixed(2)}%
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="pt-1.5 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
                          <span>Portföy Değeri:</span>
                          <span className="text-slate-200 font-semibold">
                            {currencySymbol}
                            {d.totalValue?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Portföy TWR Çizgisi */}
              <Line
                type="monotone"
                dataKey="portfolioTWR"
                stroke="#10b981"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#10b981', stroke: '#022c22', strokeWidth: 2 }}
              />
              {/* Benchmark Çizgileri */}
              {benchmarks.map((bm) => {
                if (!visibleBenchmarks[bm.code]) return null;
                const cfg = benchmarkConfig[bm.code];
                return (
                  <Line
                    key={bm.code}
                    type="monotone"
                    dataKey={bm.code}
                    stroke={cfg?.color || '#94a3b8'}
                    strokeWidth={1.8}
                    strokeDasharray="4 2"
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                );
              })}
            </LineChart>
          ) : (
            /* Günlük PnL Alan Grafiği */
            <AreaChart data={combinedChartData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="dailyPnlGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.25} vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                tickFormatter={(v) => {
                  const parts = v.split('-');
                  return parts.length >= 3 ? `${parts[2]}/${parts[1]}` : v;
                }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                tickFormatter={(val) => `${val >= 0 ? '+' : ''}${currencySymbol}${val.toFixed(0)}`}
              />
              <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" opacity={0.8} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl text-xs space-y-1 text-white">
                        <div className="text-slate-400">{d.date}</div>
                        <div className="font-bold text-sm">
                          Günlük PnL: {d.dailyPnl >= 0 ? '+' : ''}{currencySymbol}{d.dailyPnl?.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="dailyPnl"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#dailyPnlGradient)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Relative Performance & Outperformance Cards */}
      {latestRow && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {benchmarks.map((bm) => {
            const pReturn = latestRow.portfolioTWR ?? 0;
            const bmReturn = latestRow[bm.code] ?? 0;
            const alpha = pReturn - bmReturn;
            const isOutperforming = alpha >= 0;
            const cfg = benchmarkConfig[bm.code] || { label: bm.label, color: '#94a3b8' };

            return (
              <div
                key={bm.code}
                className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 space-y-1.5 transition-all hover:border-slate-700"
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                    <span>vs {cfg.label}</span>
                  </span>
                  <span className={isOutperforming ? 'text-emerald-400' : 'text-rose-400'}>
                    {isOutperforming ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400">Getiri Farkı:</span>
                  <span className={`text-sm font-extrabold ${isOutperforming ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isOutperforming ? '+' : ''}
                    {alpha.toFixed(2)}%
                  </span>
                </div>

                <div className="text-[10px] text-slate-500 flex justify-between pt-1 border-t border-slate-900">
                  <span>Gösterge: %{bmReturn.toFixed(1)}</span>
                  <span className={isOutperforming ? 'text-emerald-400/80 font-bold' : 'text-slate-400'}>
                    {isOutperforming ? 'Üstün Başarı (Alfa)' : 'Geride Kaldı'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Adding Transactions */}
      {showTxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <DollarSign size={18} />
                </div>
                <h3 className="text-base font-bold text-white">Nakit / Varlık Hareketi Ekle</h3>
              </div>
              <button
                onClick={() => setShowTxModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTxSubmit} className="space-y-4">
              {/* Type selector */}
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">İşlem Türü</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTxType('deposit')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      txType === 'deposit'
                        ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    🟢 Nakit Yatırma (+CF)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxType('withdrawal')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      txType === 'withdrawal'
                        ? 'bg-rose-500 text-white border-rose-400 shadow-sm'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    🔴 Nakit Çekme (-CF)
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">
                  Tutar ({currencySymbol})
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="Örn: 25000"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Date */}
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">İşlem Tarihi</label>
                <input
                  type="date"
                  required
                  value={txDate}
                  onChange={(e) => setTxDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Açıklama / Not</label>
                <input
                  type="text"
                  placeholder="Örn: Maaş sonrası nakit ekleme"
                  value={txNotes}
                  onChange={(e) => setTxNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-[11px] text-emerald-300 flex items-start gap-2">
                <Info size={14} className="mt-0.5 shrink-0" />
                <p>
                  TWR algoritması bu nakit hareketini alt döneme ayırarak işler. Portföy getiriniz nakit girişinden etkilenmeden saf yatırım performansı olarak hesaplanır.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTxModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-400 shadow-md cursor-pointer"
                >
                  İşlemi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
