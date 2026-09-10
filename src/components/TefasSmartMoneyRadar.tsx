import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  Search, 
  RefreshCw, 
  Building, 
  ChevronRight, 
  ExternalLink,
  Award,
  Zap,
  ArrowUpRight,
  Info,
  DollarSign,
  PieChart
} from 'lucide-react';
import { safeFetchJson } from '../utils/apiClient';

export interface TopHeldStock {
  symbol: string;
  name: string;
  sector: string;
  fundsCount: number;
  totalHoldingsTRY: number;
  totalHoldingsFormatted: string;
  averageWeightPct: number;
  quarterlyFlow: 'NET_GİRİŞ' | 'ARTIŞ' | 'SABİT';
  flowAmountFormatted: string;
  sentiment: 'GÜÇLÜ AL' | 'KURUMSAL FAVORİ' | 'DENGELİ';
  topFunds: Array<{
    code: string;
    name: string;
    weight: number;
    fundSizeFormatted: string;
  }>;
}

interface TefasSmartMoneyRadarProps {
  onSelectStock?: (symbol: string) => void;
  onSelectFundCode?: (code: string) => void;
}

export const TefasSmartMoneyRadar: React.FC<TefasSmartMoneyRadarProps> = ({ 
  onSelectStock,
  onSelectFundCode 
}) => {
  const [stocks, setStocks] = useState<TopHeldStock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');

  const fetchRadarData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await safeFetchJson<{ success: boolean; count: number; data: TopHeldStock[] }>('/api/v1/tefas/top-held-stocks');
      if (res.ok && res.data?.data && Array.isArray(res.data.data)) {
        setStocks(res.data.data);
      } else {
        setError('Kurumsal fon radarı verisi alınamadı.');
      }
    } catch (err: any) {
      setError(err.message || 'Veri yükleme hatası.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRadarData();
  }, []);

  const sectors = Array.from(new Set(stocks.map(s => s.sector))).filter(Boolean);

  const filteredStocks = stocks.filter(stock => {
    const matchQuery = !searchQuery || 
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
      stock.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchSector = selectedSector === 'ALL' || stock.sector === selectedSector;
    return matchQuery && matchSector;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30 text-indigo-400">
              <ShieldCheck size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-100">
                  Kurumsal Fon Radarı & Akıllı Para (Smart Money)
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                  TEFAS PORTFÖYLERİ
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-0.5">
                Türkiye'nin en başarılı fon yöneticilerinin portföylerinde en çok ağırlık verdiği ve alım yaptığı ilk 20 hisse
              </p>
            </div>
          </div>

          <button
            onClick={fetchRadarData}
            disabled={loading}
            className="self-start md:self-auto px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 rounded-xl text-sm font-medium border border-slate-700/60 transition-all flex items-center gap-2"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin text-indigo-400' : ''} />
            Güncelle
          </button>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Hisse veya şirket adı filtrele..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setSelectedSector('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedSector === 'ALL'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800/60'
            }`}
          >
            Tüm Sektörler
          </button>
          {sectors.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedSector === sec
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800/60'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-16 flex flex-col items-center justify-center text-center">
          <RefreshCw size={32} className="text-indigo-400 animate-spin mb-3" />
          <p className="text-slate-300 font-medium">TEFAS Fon Portföyleri Taranıyor...</p>
          <p className="text-xs text-slate-500 mt-1">Hisse dağılımları ve kurumsal akışlar analiz ediliyor</p>
        </div>
      ) : error ? (
        <div className="bg-rose-950/30 border border-rose-800/40 rounded-2xl p-8 text-center text-rose-300">
          <Info size={32} className="mx-auto text-rose-400 mb-2" />
          <p className="font-semibold">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredStocks.map((stock, idx) => (
            <div
              key={stock.symbol}
              className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-lg hover:border-indigo-500/50 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 pb-3 mb-3 border-b border-slate-800/70">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center font-extrabold text-sm text-indigo-300">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span 
                          onClick={() => onSelectStock && onSelectStock(stock.symbol)}
                          className="text-lg font-bold text-slate-100 hover:text-indigo-400 cursor-pointer transition-colors"
                        >
                          {stock.symbol}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60 font-medium">
                          {stock.sector}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {stock.name}
                      </p>
                    </div>
                  </div>

                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                    stock.sentiment === 'GÜÇLÜ AL'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                      : 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/50'
                  }`}>
                    {stock.sentiment}
                  </span>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-3 gap-2.5 my-3">
                  <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/60">
                    <span className="text-[11px] text-slate-400 block">Tutan Fon Sayısı</span>
                    <span className="text-sm font-bold text-slate-100 block mt-0.5">
                      {stock.fundsCount} Fon
                    </span>
                  </div>
                  <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/60">
                    <span className="text-[11px] text-slate-400 block">Kurumsal Yatırım</span>
                    <span className="text-sm font-bold text-indigo-300 block mt-0.5">
                      {stock.totalHoldingsFormatted}
                    </span>
                  </div>
                  <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/60">
                    <span className="text-[11px] text-slate-400 block">Ort. Portföy Payı</span>
                    <span className="text-sm font-bold text-emerald-400 block mt-0.5">
                      %{stock.averageWeightPct}
                    </span>
                  </div>
                </div>

                {/* Top Funds List */}
                <div className="mt-3.5 space-y-1.5">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">
                    En Yüksek Ağırlığa Sahip Fonlar:
                  </span>
                  {stock.topFunds.map((fund) => (
                    <div
                      key={fund.code}
                      onClick={() => onSelectFundCode && onSelectFundCode(fund.code)}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 hover:bg-slate-800/60 border border-slate-800/40 transition-all cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="font-bold text-indigo-400 font-mono">
                          {fund.code}
                        </span>
                        <span className="text-slate-300 truncate">
                          {fund.name}
                        </span>
                      </div>
                      <span className="font-bold text-emerald-400 font-mono whitespace-nowrap">
                        %{fund.weight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  Son Çeyrek Akışı: <strong className="text-emerald-400 font-semibold">{stock.flowAmountFormatted} ({stock.quarterlyFlow})</strong>
                </span>
                <button
                  onClick={() => onSelectStock && onSelectStock(stock.symbol)}
                  className="px-3.5 py-1.5 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
                >
                  360° Analiz Et
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
