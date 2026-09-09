import React, { useState } from 'react';
import { Search, Sparkles, TrendingUp, X } from 'lucide-react';

interface IntelligenceSearchBarProps {
  currentTicker: string;
  onSearchTicker: (ticker: string) => void;
  isLoading: boolean;
}

const POPULAR_TICKERS = [
  { symbol: 'THYAO', name: 'Türk Hava Yolları', category: 'BIST' },
  { symbol: 'ASELS', name: 'Aselsan', category: 'BIST' },
  { symbol: 'EREGL', name: 'Ereğli Demir', category: 'BIST' },
  { symbol: 'BIMAS', name: 'BİM Mağazaları', category: 'BIST' },
  { symbol: 'KCHOL', name: 'Koç Holding', category: 'BIST' },
  { symbol: 'TUPRS', name: 'Tüpraş', category: 'BIST' },
  { symbol: 'AKBNK', name: 'Akbank', category: 'BIST' },
  { symbol: 'BTC', name: 'Bitcoin', category: 'CRYPTO' },
  { symbol: 'ETH', name: 'Ethereum', category: 'CRYPTO' },
  { symbol: 'ALTIN', name: 'Gram Altın', category: 'COMMODITIES' },
  { symbol: 'NVDA', name: 'NVIDIA', category: 'US_STOCKS' },
  { symbol: 'AAPL', name: 'Apple', category: 'US_STOCKS' },
];

export const IntelligenceSearchBar: React.FC<IntelligenceSearchBarProps> = ({
  currentTicker,
  onSearchTicker,
  isLoading,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearchTicker(query.trim().toUpperCase());
      setQuery('');
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
      {/* Arama Input Formu */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hisse veya Varlık Sembolü Ara (örn: THYAO, ASELS, BTC, ALTIN, NVDA)..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all uppercase"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <Sparkles size={14} />
          <span>İstihbarat Getir</span>
        </button>
      </form>

      {/* Hızlı Önerilen Sembol Butonları */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
          <TrendingUp size={12} className="text-emerald-400" />
          Hızlı Seçim:
        </span>
        <div className="flex items-center gap-1.5">
          {POPULAR_TICKERS.map((item) => {
            const isActive = currentTicker === item.symbol;
            return (
              <button
                key={item.symbol}
                type="button"
                onClick={() => onSearchTicker(item.symbol)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all shrink-0 cursor-pointer border ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700/60'
                }`}
              >
                {item.symbol}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
