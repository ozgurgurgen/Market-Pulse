import React, { useState } from 'react';
import { 
  Bookmark, 
  Trash2, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  ExternalLink, 
  Plus, 
  Target, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { WatchlistItem, StockQuote } from '../types';
import { LockedField } from './ui/LockedField';

interface WatchlistManagerProps {
  watchlistItems: WatchlistItem[];
  quotes: StockQuote[];
  isFreePlan: boolean;
  onRemoveFromWatchlist: (symbol: string) => void;
  onAnalyzeStock: (symbol: string, name: string, exchange: string, category: string) => void;
  onUpdateItemNotes: (symbol: string, notes: string, targetPrice?: number, stopLoss?: number) => void;
}

export const WatchlistManager: React.FC<WatchlistManagerProps> = ({
  watchlistItems,
  quotes,
  onRemoveFromWatchlist,
  onAnalyzeStock,
  onUpdateItemNotes,
  isFreePlan,
}) => {
  const [editingSymbol, setEditingSymbol] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');
  const [tempTarget, setTempTarget] = useState<number | undefined>(undefined);
  const [tempSL, setTempSL] = useState<number | undefined>(undefined);

  const startEdit = (item: WatchlistItem) => {
    setEditingSymbol(item.symbol);
    setTempNotes(item.notes || '');
    setTempTarget(item.targetPrice);
    setTempSL(item.stopLoss);
  };

  const saveEdit = (symbol: string) => {
    onUpdateItemNotes(symbol, tempNotes, tempTarget, tempSL);
    setEditingSymbol(null);
  };

  return (
    <div id="watchlist-manager-section" className="space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Bookmark className="text-amber-400" size={20} />
            Kişisel İzleme & Portföy Takip Listem
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Eklediğiniz hisselerin canlı fiyat değişimlerini ve belirlediğiniz kar alma / zarar kes seviyelerini takip edin.
          </p>
        </div>
        <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 shrink-0">
          Toplam Takip: {watchlistItems.length} Varlık
        </div>
      </div>

      {/* Empty State */}
      {watchlistItems.length === 0 && (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 p-6">
          <Bookmark size={40} className="mx-auto text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-slate-200">Henüz İzleme Listeniz Boş</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Fırsat Radarı veya Canlı Piyasalar sekmesindeki yer işareti ikonuna tıklayarak beğendiğiniz hisseleri buraya ekleyebilirsiniz.
          </p>
        </div>
      )}

      {/* Watchlist Grid */}
      {watchlistItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {watchlistItems.map((item, index) => {
            const isLocked = isFreePlan && index >= 5;
            const currentQuote = quotes.find((q) => q.symbol === item.symbol);
            const currentPrice = (currentQuote && currentQuote.currentPrice != null) ? currentQuote.currentPrice : (item.addedPrice || 0);
            const currency = currentQuote ? currentQuote.currency : '₺';
            const addedPrice = item.addedPrice || currentPrice || 1;
            const plAmount = Number((currentPrice - addedPrice).toFixed(2));
            const plPercent = Number(((plAmount / addedPrice) * 100).toFixed(2));
            const isProfit = plAmount >= 0;

            const isEditing = editingSymbol === item.symbol;

            const displayPrice = isLocked || currentPrice == null ? '₺•••,••' : `${currency}${currentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`;
            const displayAdded = isLocked || item.addedPrice == null ? '₺•••,••' : `${currency}${item.addedPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`;
            const displayPnL = isLocked ? '•••' : `${isProfit ? '+' : ''}${plPercent}%`;

            return (
              <LockedField
                key={item.symbol}
                mode="blur"
                isLocked={isLocked}
                moduleName="watchlist"
                ctaText="Kalan Varlıklarınızı Görmek İçin Pro'ya Geçin"
              >
              <div
                id={`watchlist-card-${item.symbol}`}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Symbol, Name, Trash */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-700 flex flex-col items-center justify-center text-center p-1">
                        <span className="text-xs font-black text-white">{item.symbol}</span>
                        <span className="text-[9px] font-semibold text-emerald-400">{item.exchange}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{item.name}</h4>
                        <div className="text-[10px] text-slate-500">
                          Eklendiği Tarih: {new Date(item.addedDate).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveFromWatchlist(item.symbol)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Listeden Kaldır"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Price & PnL Performance */}
                  <div className="grid grid-cols-3 gap-2 mb-4 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
                    <div>
                      <div className="text-[10px] text-slate-400">Eklenen Fiyat</div>
                      <div className="text-xs font-bold text-slate-300">
                        {displayAdded}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Canlı Fiyat</div>
                      <div className="text-xs font-bold text-slate-100">
                        {displayPrice}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Potansiyel Getiri</div>
                      <div className={`text-xs font-black ${isProfit && !isLocked ? 'text-emerald-400' : isLocked ? 'text-slate-400' : 'text-rose-400'}`}>
                        {displayPnL}
                      </div>
                    </div>
                  </div>

                  {/* Target & Stop-loss Notes Section */}
                  {isEditing ? (
                    <div className="space-y-2 mb-4 bg-slate-950 p-3 rounded-xl border border-slate-700">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-emerald-400 font-semibold block mb-0.5">Hedef Fiyat ({currency})</label>
                          <input
                            type="number"
                            value={tempTarget || ''}
                            onChange={(e) => setTempTarget(Number(e.target.value) || undefined)}
                            placeholder="Örn: 350"
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-rose-400 font-semibold block mb-0.5">Stop-Loss ({currency})</label>
                          <input
                            type="number"
                            value={tempSL || ''}
                            onChange={(e) => setTempSL(Number(e.target.value) || undefined)}
                            placeholder="Örn: 290"
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Kişisel Notunuz</label>
                        <input
                          type="text"
                          value={tempNotes}
                          onChange={(e) => setTempNotes(e.target.value)}
                          placeholder="Örn: 50 EMA kırılınca ekleme yap..."
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => setEditingSymbol(null)}
                          className="px-2.5 py-1 text-[11px] text-slate-400 hover:text-white"
                        >
                          İptal
                        </button>
                        <button
                          onClick={() => saveEdit(item.symbol)}
                          className="px-3 py-1 bg-emerald-500 text-slate-950 text-[11px] font-bold rounded"
                        >
                          Kaydet
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => startEdit(item)}
                      className="mb-4 bg-slate-950/50 hover:bg-slate-950 p-2.5 rounded-xl border border-slate-800 cursor-pointer transition-colors text-xs text-slate-300"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                        <span>Hedefler & Notlar (Düzenlemek için tıkla)</span>
                        <span className="text-emerald-400 font-medium">Düzenle ✎</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-semibold">
                        {item.targetPrice && (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <Target size={12} /> Hedef: {currency}{item.targetPrice}
                          </span>
                        )}
                        {item.stopLoss && (
                          <span className="text-rose-400 flex items-center gap-1">
                            <ShieldAlert size={12} /> SL: {currency}{item.stopLoss}
                          </span>
                        )}
                        {!item.targetPrice && !item.stopLoss && (
                          <span className="text-slate-500 italic">+ Hedef veya Stop belirleyin</span>
                        )}
                      </div>
                      {item.notes && (
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">"{item.notes}"</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Trigger Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <a
                    href={`https://www.google.com/finance/quote/${item.symbol}:${item.exchange === 'BIST' ? 'IST' : 'NASDAQ'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                  >
                    <span>Google Finance</span>
                    <ExternalLink size={12} />
                  </a>

                  <button
                    onClick={() => onAnalyzeStock(item.symbol, item.name, item.exchange, currentQuote?.category || 'BIST')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Sparkles size={13} />
                    <span>Yapay Zeka Analizini Yenile</span>
                  </button>
                </div>
              </div>
              </LockedField>
            );
          })}
        </div>
      )}

    </div>
  );
};
