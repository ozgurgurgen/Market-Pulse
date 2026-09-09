import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Search, 
  Bookmark, 
  BookmarkCheck, 
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Globe,
  SlidersHorizontal
} from 'lucide-react';
import { StockQuote } from '../types';
import { ValidationBadge } from './ui/ValidationBadge';

export type SortField = 'symbol' | 'name' | 'price' | 'change' | 'volume' | 'range' | 'sector';

interface MarketOverviewProps {
  quotes: StockQuote[];
  onSelectStock: (quote: StockQuote) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string, name: string, price: number, exchange: string) => void;
  selectedCategory: string;
  onSelectCategory?: (category: any) => void;
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({
  quotes,
  onSelectStock,
  watchlist,
  onToggleWatchlist,
  selectedCategory,
  onSelectCategory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<SortField>('change');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  // Category counts
  const bistCount = quotes.filter(q => q.category === 'BIST').length;
  const usCount = quotes.filter(q => q.category === 'US_STOCKS').length;
  const etfCount = quotes.filter(q => q.category === 'ETF').length;
  const cryptoCount = quotes.filter(q => q.category === 'CRYPTO').length;
  const commoditiesCount = quotes.filter(q => q.category === 'COMMODITIES').length;
  const forexCount = quotes.filter(q => q.category === 'FOREX').length;

  const CATEGORY_TABS = [
    { id: 'ALL', label: 'Tüm Piyasalar', count: quotes.length, icon: '🌐' },
    { id: 'BIST', label: 'BIST', count: bistCount, icon: '🇹🇷' },
    { id: 'US_STOCKS', label: 'ABD Hisseleri', count: usCount, icon: '🇺🇸' },
    { id: 'ETF', label: 'ETF Fonları (200+)', count: etfCount, icon: '📊' },
    { id: 'CRYPTO', label: 'Kripto', count: cryptoCount, icon: '🪙' },
    { id: 'COMMODITIES', label: 'Altın & Emtia', count: commoditiesCount, icon: '🏆' },
    { id: 'FOREX', label: 'Döviz', count: forexCount, icon: '💱' },
  ];

  // Benzersiz Sektör Listesi (Aktif Kategoriye Göre)
  const availableSectors = useMemo(() => {
    const sectors = new Set<string>();
    quotes.forEach((q: any) => {
      if (selectedCategory === 'ALL' || q.category === selectedCategory) {
        if (q.sector) sectors.add(q.sector);
      }
    });
    return Array.from(sectors).sort();
  }, [quotes, selectedCategory]);

  // Filtreleme
  const filtered = useMemo(() => {
    return quotes.filter((q: any) => {
      const matchesCategory = selectedCategory === 'ALL' || q.category === selectedCategory;
      const matchesSector = selectedSector === 'ALL' || q.sector === selectedSector;
      const matchesSearch =
        q.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (q.sector && q.sector.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSector && matchesSearch;
    });
  }, [quotes, selectedCategory, selectedSector, searchTerm]);

  // Sıralama
  const sortedQuotes = useMemo(() => {
    return [...filtered].sort((a: any, b: any) => {
      let comparison = 0;
      if (sortBy === 'symbol') {
        comparison = a.symbol.localeCompare(b.symbol);
      } else if (sortBy === 'name') {
        comparison = (a.name || '').localeCompare(b.name || '');
      } else if (sortBy === 'sector') {
        comparison = (a.sector || '').localeCompare(b.sector || '');
      } else if (sortBy === 'price') {
        comparison = (a.currentPrice || 0) - (b.currentPrice || 0);
      } else if (sortBy === 'change') {
        comparison = (a.change24hPercent || 0) - (b.change24hPercent || 0);
      } else if (sortBy === 'volume') {
        const parseVol = (v: any) => {
          if (typeof v === 'number') return v;
          if (!v) return 0;
          const s = String(v).trim().toUpperCase();
          let mult = 1;
          if (s.endsWith('B') || s.endsWith('MR')) mult = 1e9;
          else if (s.endsWith('M') || s.endsWith('MN')) mult = 1e6;
          else if (s.endsWith('K') || s.endsWith('BİN')) mult = 1e3;
          const num = parseFloat(s.replace(/[^0-9.-]/g, '')) || 0;
          return num * mult;
        };
        comparison = parseVol(a.volume) - parseVol(b.volume);
      } else if (sortBy === 'range') {
        const spreadA = (a.high24h || a.currentPrice || 0) - (a.low24h || a.currentPrice || 0);
        const spreadB = (b.high24h || b.currentPrice || 0) - (b.low24h || b.currentPrice || 0);
        comparison = spreadA - spreadB;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filtered, sortBy, sortOrder]);

  // Sayfalama
  const totalPages = Math.ceil(sortedQuotes.length / pageSize) || 1;
  const paginatedQuotes = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedQuotes.slice(start, start + pageSize);
  }, [sortedQuotes, currentPage, pageSize]);

  const toggleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      // Alphabetical or sector defaults to ASC, numerical defaults to DESC
      setSortOrder(field === 'symbol' || field === 'name' || field === 'sector' ? 'asc' : 'desc');
    }
    setCurrentPage(1);
  };

  const renderSortIcon = (field: SortField) => {
    if (sortBy === field) {
      return sortOrder === 'asc' ? (
        <ArrowUp size={13} className="text-emerald-400 font-bold" />
      ) : (
        <ArrowDown size={13} className="text-emerald-400 font-bold" />
      );
    }
    return <ArrowUpDown size={12} className="text-slate-600 opacity-0 group-hover/th:opacity-100 transition-opacity" />;
  };

  return (
    <div id="market-overview-section" className="space-y-4">
      {/* Category Filter Tabs Bar */}
      {onSelectCategory && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORY_TABS.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onSelectCategory(tab.id);
                  setCurrentPage(1);
                  setSelectedSector('ALL');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-950'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-emerald-500/25 text-emerald-300 font-bold'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Universe Info Banner & Search Bar */}
      <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Active Universe Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Globe size={14} className="text-emerald-400" />
              Aktif Takip Havuzu:
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
              BIST ({bistCount})
            </span>
            <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold">
              ABD Hisseleri ({usCount})
            </span>
            <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 font-semibold">
              📊 ETF Fonları ({etfCount})
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold">
              Kripto & Emtia ({cryptoCount + commoditiesCount + forexCount})
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium ml-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Yahoo Finance & Binance Canlı
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 ml-auto">
            <span>Toplam {filtered.length} Varlık Listeleniyor</span>
          </div>
        </div>

        {/* Search, Sector Filter & Sort Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Sembol, şirket veya sektör ara..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700/60 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {availableSectors.length > 0 && (
              <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-700/60 text-xs">
                <SlidersHorizontal size={13} className="text-slate-400" />
                <select
                  value={selectedSector}
                  onChange={(e) => {
                    setSelectedSector(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs"
                >
                  <option value="ALL" className="bg-slate-900">Tüm Sektörler ({availableSectors.length})</option>
                  {availableSectors.map((sector) => (
                    <option key={sector} value={sector} className="bg-slate-900">
                      {sector}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end text-xs text-slate-400">
            <span className="hidden sm:inline">Sırala:</span>
            <button
              onClick={() => toggleSort('change')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                sortBy === 'change' ? 'bg-slate-800 text-emerald-400 font-bold' : 'hover:bg-slate-800'
              }`}
            >
              24s Değişim {renderSortIcon('change')}
            </button>
            <button
              onClick={() => toggleSort('price')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                sortBy === 'price' ? 'bg-slate-800 text-emerald-400 font-bold' : 'hover:bg-slate-800'
              }`}
            >
              Fiyat {renderSortIcon('price')}
            </button>
            <button
              onClick={() => toggleSort('symbol')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                sortBy === 'symbol' ? 'bg-slate-800 text-emerald-400 font-bold' : 'hover:bg-slate-800'
              }`}
            >
              Sembol {renderSortIcon('symbol')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Stock Table */}
      <div className="overflow-x-auto bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider select-none">
              <th 
                onClick={() => toggleSort('symbol')}
                className="py-3 px-4 cursor-pointer hover:text-slate-200 hover:bg-slate-800/50 transition-colors group/th"
                title="Sembol veya Şirket Adına göre sırala"
              >
                <div className="flex items-center gap-1.5">
                  <span className={sortBy === 'symbol' || sortBy === 'name' ? 'text-emerald-400 font-bold' : ''}>Varlık / Şirket</span>
                  {renderSortIcon('symbol')}
                </div>
              </th>
              <th 
                onClick={() => toggleSort('price')}
                className="py-3 px-4 text-right cursor-pointer hover:text-slate-200 hover:bg-slate-800/50 transition-colors group/th"
                title="Fiyata göre sırala"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span className={sortBy === 'price' ? 'text-emerald-400 font-bold' : ''}>Son Fiyat</span>
                  {renderSortIcon('price')}
                </div>
              </th>
              <th 
                onClick={() => toggleSort('change')}
                className="py-3 px-4 text-right cursor-pointer hover:text-slate-200 hover:bg-slate-800/50 transition-colors group/th"
                title="Günlük yüzde değişime göre sırala"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span className={sortBy === 'change' ? 'text-emerald-400 font-bold' : ''}>24s Değişim</span>
                  {renderSortIcon('change')}
                </div>
              </th>
              <th 
                onClick={() => toggleSort('range')}
                className="py-3 px-4 text-center hidden md:table-cell cursor-pointer hover:text-slate-200 hover:bg-slate-800/50 transition-colors group/th"
                title="24 Saatlik Fiyat Aralığına göre sırala"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span className={sortBy === 'range' ? 'text-emerald-400 font-bold' : ''}>24s Aralık (Düşük / Yüksek)</span>
                  {renderSortIcon('range')}
                </div>
              </th>
              <th 
                onClick={() => toggleSort('volume')}
                className="py-3 px-4 text-right hidden lg:table-cell cursor-pointer hover:text-slate-200 hover:bg-slate-800/50 transition-colors group/th"
                title="İşlem Hacmine veya Sektöre göre sırala"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span className={sortBy === 'volume' || sortBy === 'sector' ? 'text-emerald-400 font-bold' : ''}>Hacim / Sektör</span>
                  {renderSortIcon('volume')}
                </div>
              </th>
              <th className="py-3 px-4 text-center">Trend (Mini Grafik)</th>
              <th className="py-3 px-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {paginatedQuotes.map((quote: any, idx: number) => {
              const hasChange = quote.change24h != null && quote.change24hPercent != null;
              const isPositive = hasChange && quote.change24h >= 0;
              const isWatchlisted = watchlist.includes(quote.symbol);

              // Real Sparkline calculation
              const rawPoints = Array.isArray(quote.sparklineReal) 
                ? quote.sparklineReal.filter((v: any): v is number => typeof v === 'number' && !isNaN(v) && v > 0)
                : (Array.isArray(quote.sparkline) ? quote.sparkline.filter((v: any) => typeof v === 'number' && !isNaN(v) && v > 0) : []);

              const hasEnoughPoints = rawPoints.length >= 2;
              const minVal = hasEnoughPoints ? Math.min(...rawPoints) : quote.currentPrice * 0.99;
              const maxVal = hasEnoughPoints ? Math.max(...rawPoints) : quote.currentPrice * 1.01;
              const range = maxVal - minVal > 0 ? maxVal - minVal : (minVal * 0.01 || 1);

              const points = hasEnoughPoints
                ? rawPoints
                    .map((val: number, pointIdx: number) => {
                      const x = (pointIdx / (rawPoints.length - 1)) * 90 + 5;
                      const y = 25 - ((val - minVal) / range) * 20;
                      return `${x},${y}`;
                    })
                    .join(' ')
                : `5,15 95,15`;

              return (
                <tr
                  key={`${quote.symbol}-${quote.exchange || ''}-${idx}`}
                  id={`market-row-${quote.symbol}`}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => onSelectStock(quote)}
                >
                  {/* Symbol & Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWatchlist(quote.symbol, quote.name, quote.currentPrice, quote.exchange);
                        }}
                        className={`p-1 rounded transition-colors cursor-pointer ${
                          isWatchlisted ? 'text-amber-400' : 'text-slate-600 hover:text-slate-300'
                        }`}
                        title={isWatchlisted ? 'Takip listesinden çıkar' : 'Takip listesine ekle'}
                      >
                        {isWatchlisted ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                      </button>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-sm text-slate-100 group-hover:text-emerald-400 transition-colors">
                            {quote.symbol}
                          </span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded">
                            {quote.exchange}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 max-w-[200px] truncate">
                          {quote.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 text-right">
                    <div className="font-bold text-sm text-slate-100">
                      {quote.currency}{quote.currentPrice != null ? quote.currentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '—'}
                    </div>
                    <div className="flex flex-col items-end gap-1 mt-1">
                      <div className="text-[10px] text-slate-500">
                        {quote.lastUpdated}
                      </div>
                      {(quote as any).validationMeta && (
                        <ValidationBadge 
                          status={(quote as any).validationMeta.validation_status}
                          confidence={(quote as any).validationMeta.confidence}
                          sources={(quote as any).validationMeta.sources}
                        />
                      )}
                    </div>
                  </td>

                  {/* Change */}
                  <td className="py-3 px-4 text-right">
                    {hasChange ? (
                      <>
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold text-xs ${
                          isPositive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                        }`}>
                          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {isPositive ? '+' : ''}{quote.change24hPercent}%
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {isPositive ? '+' : ''}{quote.change24h} {quote.currency}
                        </div>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400 bg-slate-800/80 px-2 py-1 rounded">Veri Yok</span>
                    )}
                  </td>

                  {/* Range Low/High */}
                  <td className="py-3 px-4 text-center hidden md:table-cell">
                    <div className="text-slate-300 font-medium">
                      {quote.currency}{quote.low24h} - {quote.currency}{quote.high24h}
                    </div>
                    <div className="w-24 bg-slate-800 h-1.5 rounded-full mx-auto mt-1 overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full"
                        style={{
                          width: `${Math.min(100, Math.max(10, ((quote.currentPrice - quote.low24h) / (quote.high24h - quote.low24h || 1)) * 100))}%`
                        }}
                      />
                    </div>
                  </td>

                  {/* Volume / Sector */}
                  <td className="py-3 px-4 text-right hidden lg:table-cell">
                    <div className="text-slate-200 font-medium">{quote.volume}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[140px] ml-auto">
                      {quote.sector || (quote.peRatio ? `F/K: ${quote.peRatio}` : quote.marketCap || '-')}
                    </div>
                  </td>

                  {/* Mini Sparkline Chart */}
                  <td className="py-3 px-4 text-center">
                    <div className="w-24 h-7 mx-auto">
                      <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                        <polyline
                          fill="none"
                          stroke={isPositive ? '#34d399' : '#f87171'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={points}
                        />
                      </svg>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStock(quote);
                      }}
                      className="px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 font-bold rounded-lg border border-emerald-500/30 transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
                    >
                      <Sparkles size={12} />
                      <span>AI Analizi</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            Arama kriterine uygun varlık bulunamadı.
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span>Sayfa başına göster:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-950 border border-slate-700/60 rounded px-2 py-1 text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-slate-400">
              ({(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, sortedQuotes.length)} / {sortedQuotes.length} varlık)
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft size={14} /> Önceki
            </button>

            <span className="px-3 py-1 font-semibold text-emerald-400 bg-slate-950 rounded border border-slate-800">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
            >
              Sonraki <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
