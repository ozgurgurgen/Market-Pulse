import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Radio, 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { StockQuote } from '../types';

interface MarketTickerBarProps {
  quotes: StockQuote[];
  onSelectStock: (quote: StockQuote) => void;
  speed?: number;
}

export const MarketTickerBar: React.FC<MarketTickerBarProps> = ({ quotes, onSelectStock, speed = 300 }) => {
  // Curated list of high-priority assets
  const prioritySymbols = ['THYAO', 'NVDA', 'ALTIN', 'USD/TRY', 'BTC', 'ASELS', 'TUPRS', 'AAPL', 'EUR/TRY', 'BRENT', 'ETH', 'BIMAS'];
  
  const tickerQuotes = quotes.filter(q => prioritySymbols.includes(q.symbol)).concat(
    quotes.filter(q => !prioritySymbols.includes(q.symbol))
  );

  const isPaused = speed <= 0;
  const activeDuration = isPaused ? 0 : Math.max(1, speed);

  // Interleave quotes and news items for authentic TV financial news experience
  const renderTickerContent = () => (
    <div className="flex items-center space-x-6 shrink-0 py-0.5">
      {tickerQuotes.map((item, idx) => {
        const hasChange = item.change24h != null && item.change24hPercent != null;
        const isPositive = hasChange && item.change24h! >= 0;

        return (
          <React.Fragment key={`${item.symbol}-${idx}`}>
            {/* Live Asset Quote Item */}
            <button
              type="button"
              id={`ticker-item-${item.symbol}`}
              onClick={() => onSelectStock(item)}
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900/90 hover:bg-slate-800 border border-slate-800/80 hover:border-emerald-500/50 transition-all cursor-pointer group shrink-0"
              title={`${item.name} detaylı analizi için tıklayın`}
            >
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs text-slate-100 group-hover:text-emerald-400 transition-colors">
                  {item.symbol}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {item.currency}{item.currentPrice != null ? item.currentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '—'}
                </span>
              </div>
              <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.2 rounded ${
                !hasChange ? 'text-slate-400 bg-slate-800' : isPositive ? 'text-emerald-400 bg-emerald-950/60' : 'text-rose-400 bg-rose-950/60'
              }`}>
                {hasChange ? (
                  <>
                    {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {isPositive ? '+' : ''}{item.change24hPercent}%
                  </>
                ) : (
                  <span className="text-slate-400">Veri Yok</span>
                )}
              </span>
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );

  return (
    <div 
      id="market-ticker-bar" 
      className="w-full bg-slate-950 border-b border-slate-800/80 flex items-center relative overflow-hidden h-9 sm:h-10 select-none max-w-full"
    >
      {/* Fixed TV-Style Live Headline Badge (Left Side) */}
      <div className="z-20 flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-900/95 px-2.5 sm:px-4 h-full border-r border-slate-800 shrink-0 shadow-lg">
        <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-emerald-500"></span>
        </span>
        <div className="flex items-center gap-1 sm:gap-1.5">
          <Radio size={12} className="text-emerald-400 hidden sm:inline" />
          <span className="text-[10px] sm:text-[11px] font-black tracking-wider text-slate-100 uppercase whitespace-nowrap">
            CANLI AKIŞ
          </span>
          <span className="hidden md:inline-block text-[9px] font-semibold text-emerald-400/90 bg-emerald-950/80 border border-emerald-800/50 px-1.5 py-0.2 rounded">
            Google Finance
          </span>
        </div>
      </div>

      {/* Continuously Smooth Scrolling Marquee Strip */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center min-w-0">
        {/* Left Gradient Shadow */}
        <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-8 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
        
        {/* Infinite Looping Track (Duplicated twice for continuous seamless loop) */}
        <div 
          className="animate-marquee-infinite flex items-center gap-6 hover:[animation-play-state:paused]"
          style={{ 
            animationDuration: `${activeDuration}s`,
            animationPlayState: isPaused ? 'paused' : undefined
          }}
        >
          {renderTickerContent()}
          {renderTickerContent()}
        </div>

        {/* Right Gradient Shadow */}
        <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-8 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />
      </div>

      {/* Speed & Pause info indicator on hover */}
      <div className="hidden xl:flex items-center text-[10px] text-slate-500 font-medium px-3 shrink-0 border-l border-slate-800/60">
        <span>Duraklatmak için üzerine gelin</span>
      </div>
    </div>
  );
};
