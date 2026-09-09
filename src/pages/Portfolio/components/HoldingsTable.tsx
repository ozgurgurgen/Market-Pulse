import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Layers,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Activity,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { PortfolioHoldingSnapshot, PortfolioAssetClass } from '../../../types';

interface HoldingsTableProps {
  holdings: PortfolioHoldingSnapshot[];
  baseCurrency: 'TRY' | 'USD';
  onAddHolding: () => void;
  onRemoveHolding: (ticker: string) => void;
  onSelectTicker?: (ticker: string) => void;
}

export const HoldingsTable: React.FC<HoldingsTableProps> = ({
  holdings,
  baseCurrency,
  onAddHolding,
  onRemoveHolding,
  onSelectTicker,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssetClass, setSelectedAssetClass] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'marketValue' | 'pnlPercentage' | 'weightPercentage' | 'ticker'>('marketValue');
  const [sortAsc, setSortAsc] = useState(false);
  const [expandedTicker, setExpandedTicker] = useState<string | null>(null);

  const currencySymbol = baseCurrency === 'USD' ? '$' : '₺';

  const toggleExpand = (ticker: string) => {
    setExpandedTicker((prev) => (prev === ticker ? null : ticker));
  };

  const assetClassBadges: Record<PortfolioAssetClass, { label: string; bg: string; text: string; border: string }> = {
    BIST: { label: 'BIST 100', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    US_STOCK: { label: 'ABD Hisse', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    US_ETF: { label: '📊 ETF', bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
    FUND: { label: 'TEFAS Fonu', bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20' },
    CRYPTO: { label: 'Kripto', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    COMMODITY: { label: 'Altın/Emtia', bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
    FOREX: { label: 'Döviz', bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
  };

  const filteredHoldings = useMemo(() => {
    return holdings
      .filter((h) => {
        const matchesClass = selectedAssetClass === 'ALL' || h.assetClass === selectedAssetClass;
        const matchesSearch =
          h.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (h.name && h.name.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesClass && matchesSearch;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') {
          return sortAsc
            ? (valA as string).localeCompare(valB as string)
            : (valB as string).localeCompare(valA as string);
        }
        return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      });
  }, [holdings, searchTerm, selectedAssetClass, sortField, sortAsc]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-4">
      {/* Üst Filtreleme & Arama Barı */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Layers size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Portföy Varlıkları & Pozisyon Dağılımı</h3>
            <p className="text-[11px] text-slate-400">Canlı fiyat ve kâr/zarar marjlarıyla pozisyon listesi</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Arama */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Varlık veya sembol ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-800/80 border border-slate-700 text-xs rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-44 sm:w-56"
            />
          </div>

          {/* Varlık Ekle Butonu */}
          <button
            onClick={onAddHolding}
            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
          >
            <Plus size={14} />
            + Varlık Ekle
          </button>
        </div>
      </div>

      {/* Varlık Sınıfı Filtre Hapları */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => setSelectedAssetClass('ALL')}
          className={`px-3 py-1 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer border ${
            selectedAssetClass === 'ALL'
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
              : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
          }`}
        >
          Tüm Varlıklar ({holdings.length})
        </button>
        {Object.entries(assetClassBadges).map(([cls, badge]) => {
          const count = holdings.filter((h) => h.assetClass === cls).length;
          if (count === 0) return null;
          return (
            <button
              key={cls}
              onClick={() => setSelectedAssetClass(cls)}
              className={`px-3 py-1 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer border ${
                selectedAssetClass === cls
                  ? `${badge.bg} ${badge.text} ${badge.border} font-bold`
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              {badge.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Tablo */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/90 text-slate-400 font-semibold border-b border-slate-700">
            <tr>
              <th
                onClick={() => handleSort('ticker')}
                className="py-3 px-3.5 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Varlık / Sembol</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th className="py-3 px-3.5">Tür</th>
              <th className="py-3 px-3.5 text-right">Adet</th>
              <th className="py-3 px-3.5 text-right">Ort. Alış</th>
              <th className="py-3 px-3.5 text-right">Canlı Fiyat</th>
              <th className="py-3 px-3.5 text-center">Zaman Serisi (Trend)</th>
              <th
                onClick={() => handleSort('marketValue')}
                className="py-3 px-3.5 text-right cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Toplam Değer</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th
                onClick={() => handleSort('pnlPercentage')}
                className="py-3 px-3.5 text-right cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Kâr / Zarar</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th
                onClick={() => handleSort('weightPercentage')}
                className="py-3 px-3.5 text-right cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Portföy Payı</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th className="py-3 px-3.5 text-center">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
            {filteredHoldings.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-500">
                  Bu filtreye uygun varlık bulunamadı.
                </td>
              </tr>
            ) : (
              filteredHoldings.map((h) => {
                const badge = assetClassBadges[h.assetClass] || {
                  label: h.assetClass,
                  bg: 'bg-slate-800',
                  text: 'text-slate-400',
                  border: 'border-slate-700',
                };
                const isProfitable = h.pnl >= 0;
                const isExpanded = expandedTicker === h.ticker;
                const chartColor = isProfitable ? '#10b981' : '#f43f5e';
                const seriesData = h.timeSeries && h.timeSeries.length > 0 ? h.timeSeries : [];

                return (
                  <React.Fragment key={h.ticker}>
                    <tr className="hover:bg-slate-800/40 transition-colors group">
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleExpand(h.ticker)}
                            title={isExpanded ? 'Grafiği Gizle' : 'Dinamik Zaman Serisi Grafiğini Aç'}
                            className="text-slate-500 hover:text-emerald-400 p-1 rounded-md transition-colors cursor-pointer"
                          >
                            {isExpanded ? <ChevronUp size={14} className="text-emerald-400" /> : <ChevronDown size={14} />}
                          </button>
                          <button
                            onClick={() => toggleExpand(h.ticker)}
                            className="font-bold text-white hover:text-emerald-400 transition-colors text-sm cursor-pointer"
                          >
                            {h.ticker}
                          </button>
                          {h.name && (
                            <span className="text-slate-400 text-[11px] truncate max-w-[130px] hidden sm:inline-block">
                              {h.name}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          {badge.label}
                        </span>
                      </td>

                      <td className="py-3 px-3.5 text-right font-medium text-slate-300">
                        {h.quantity.toLocaleString('tr-TR')}
                      </td>

                      <td className="py-3 px-3.5 text-right text-slate-400">
                        {currencySymbol}
                        {h.avgBuyPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-3 px-3.5 text-right font-bold text-white">
                        {currencySymbol}
                        {h.currentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Mini Recharts Sparkline Zaman Serisi */}
                      <td className="py-2 px-2 text-center">
                        <div
                          onClick={() => toggleExpand(h.ticker)}
                          className="w-24 h-9 mx-auto cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
                          title="Detaylı zaman serisi grafiği için tıklayın"
                        >
                          {seriesData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={seriesData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                                <defs>
                                  <linearGradient id={`spark_${h.ticker}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.4} />
                                    <stop offset="95%" stopColor={chartColor} stopOpacity={0.0} />
                                  </linearGradient>
                                </defs>
                                <Area
                                  type="monotone"
                                  dataKey="price"
                                  stroke={chartColor}
                                  strokeWidth={1.8}
                                  fill={`url(#spark_${h.ticker})`}
                                  dot={false}
                                  isAnimationActive={false}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="text-[10px] text-slate-600 flex items-center justify-center h-full">
                              Veri yok
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3.5 text-right font-bold text-white">
                        {currencySymbol}
                        {h.marketValue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-3 px-3.5 text-right">
                        <div className="flex flex-col items-end">
                          <span
                            className={`font-bold flex items-center gap-0.5 ${
                              isProfitable ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {isProfitable ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {isProfitable ? '+' : ''}
                            {currencySymbol}
                            {h.pnl.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                          </span>
                          <span
                            className={`text-[10px] font-semibold ${
                              isProfitable ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {isProfitable ? '+' : ''}%{h.pnlPercentage.toFixed(2)}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-semibold text-slate-300">%{h.weightPercentage.toFixed(1)}</span>
                          <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${Math.min(100, h.weightPercentage)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => toggleExpand(h.ticker)}
                            title="Zaman Serisi Grafiğini Aç"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all cursor-pointer"
                          >
                            <Activity size={14} />
                          </button>
                          <button
                            onClick={() => onRemoveHolding(h.ticker)}
                            title="Varlığı portföyden çıkar"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-70 group-hover:opacity-100 cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Genişletilmiş Dinamik Recharts Zaman Serisi Grafiği */}
                    {isExpanded && (
                      <tr className="bg-slate-950/70 border-b border-slate-800">
                        <td colSpan={10} className="p-4">
                          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColor }} />
                                <h4 className="font-bold text-white text-sm">
                                  {h.ticker} - {h.name || badge.label} Dinamik Zaman Serisi & Fiyat Geçmişi
                                </h4>
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono border border-slate-700">
                                  Recharts Dinamik Veri
                                </span>
                              </div>

                              <div className="flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-1.5 text-slate-400">
                                  <span className="w-2.5 h-0.5 bg-amber-400 inline-block border-b border-dashed border-amber-400" />
                                  <span>Ort. Alış Maliyeti: <strong className="text-amber-300">{currencySymbol}{h.avgBuyPrice.toFixed(2)}</strong></span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-400">
                                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: chartColor }} />
                                  <span>Canlı Fiyat: <strong className={isProfitable ? 'text-emerald-400' : 'text-rose-400'}>{currencySymbol}{h.currentPrice.toFixed(2)}</strong></span>
                                </div>
                              </div>
                            </div>

                            {/* Detaylı Recharts Grafiği */}
                            <div className="h-44 w-full pt-1">
                              {seriesData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={seriesData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                                    <defs>
                                      <linearGradient id={`detail_grad_${h.ticker}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartColor} stopOpacity={0.35} />
                                        <stop offset="95%" stopColor={chartColor} stopOpacity={0.0} />
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.25} vertical={false} />
                                    <XAxis
                                      dataKey="date"
                                      stroke="#64748b"
                                      fontSize={10}
                                      tickLine={false}
                                      axisLine={{ stroke: '#334155' }}
                                      tickFormatter={(v) => {
                                        const parts = v.split('-');
                                        return parts.length >= 3 ? `${parts[2]}/${parts[1]}` : v;
                                      }}
                                    />
                                    <YAxis
                                      stroke="#64748b"
                                      fontSize={10}
                                      tickLine={false}
                                      axisLine={{ stroke: '#334155' }}
                                      domain={['auto', 'auto']}
                                      tickFormatter={(val) => `${currencySymbol}${val.toFixed(0)}`}
                                    />
                                    <ReferenceLine
                                      y={h.avgBuyPrice}
                                      stroke="#f59e0b"
                                      strokeDasharray="4 4"
                                      label={{
                                        value: `Maliyet: ${currencySymbol}${h.avgBuyPrice.toFixed(1)}`,
                                        fill: '#f59e0b',
                                        fontSize: 10,
                                        position: 'insideTopLeft'
                                      }}
                                    />
                                    <Tooltip
                                      content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                          const d = payload[0].payload;
                                          return (
                                            <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs space-y-1 text-white">
                                              <div className="text-slate-400 text-[10px] flex items-center gap-1">
                                                <Calendar size={11} />
                                                {d.date}
                                              </div>
                                              <div className="font-bold text-sm">
                                                Fiyat: {currencySymbol}{d.price?.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                              </div>
                                              <div className="text-slate-300 text-[11px] flex justify-between gap-3">
                                                <span>Piyasa Değeri:</span>
                                                <span className="font-semibold">{currencySymbol}{d.marketValue?.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                              </div>
                                              <div className="text-[11px] flex justify-between gap-3 pt-0.5 border-t border-slate-800">
                                                <span>Net Getiri:</span>
                                                <span className={`font-bold ${d.pnlPercentage >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                  {d.pnlPercentage >= 0 ? '+' : ''}%{d.pnlPercentage?.toFixed(2)}
                                                </span>
                                              </div>
                                            </div>
                                          );
                                        }
                                        return null;
                                      }}
                                    />
                                    <Area
                                      type="monotone"
                                      dataKey="price"
                                      stroke={chartColor}
                                      strokeWidth={2.2}
                                      fill={`url(#detail_grad_${h.ticker})`}
                                      activeDot={{ r: 5, fill: chartColor, stroke: '#022c22', strokeWidth: 2 }}
                                    />
                                  </AreaChart>
                                </ResponsiveContainer>
                              ) : (
                                <div className="h-full flex items-center justify-center text-xs text-slate-500">
                                  Bu varlık için zaman serisi verisi hesaplanıyor...
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
