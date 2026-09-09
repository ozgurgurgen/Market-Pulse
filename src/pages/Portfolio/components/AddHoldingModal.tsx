import React, { useState } from 'react';
import { X, Plus, Sparkles, Layers } from 'lucide-react';
import { PortfolioHolding, PortfolioAssetClass } from '../../../types';

interface AddHoldingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHolding: (holding: PortfolioHolding) => Promise<any>;
  baseCurrency: 'TRY' | 'USD';
}

const POPULAR_SUGGESTIONS = [
  { ticker: 'THYAO', name: 'Türk Hava Yolları', class: 'BIST', currency: 'TRY' },
  { ticker: 'ASELS', name: 'Aselsan Elektronik', class: 'BIST', currency: 'TRY' },
  { ticker: 'TUPRS', name: 'Tüpraş Rafineri', class: 'BIST', currency: 'TRY' },
  { ticker: 'NVDA', name: 'NVIDIA Corp', class: 'US_STOCK', currency: 'USD' },
  { ticker: 'AAPL', name: 'Apple Inc', class: 'US_STOCK', currency: 'USD' },
  { ticker: 'SPY', name: 'SPDR S&P 500 ETF', class: 'US_ETF', currency: 'USD' },
  { ticker: 'QQQ', name: 'Invesco Nasdaq 100', class: 'US_ETF', currency: 'USD' },
  { ticker: 'MAC', name: 'Marmara Capital Hisse Fonu', class: 'FUND', currency: 'TRY' },
  { ticker: 'ALTIN', name: 'Gram Altın', class: 'COMMODITY', currency: 'TRY' },
  { ticker: 'BTC', name: 'Bitcoin', class: 'CRYPTO', currency: 'USD' },
];

export const AddHoldingModal: React.FC<AddHoldingModalProps> = ({
  isOpen,
  onClose,
  onAddHolding,
  baseCurrency,
}) => {
  const [ticker, setTicker] = useState('');
  const [name, setName] = useState('');
  const [assetClass, setAssetClass] = useState<PortfolioAssetClass>('BIST');
  const [quantity, setQuantity] = useState('100');
  const [avgBuyPrice, setAvgBuyPrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [currency, setCurrency] = useState<string>(baseCurrency);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const selectSuggestion = (s: typeof POPULAR_SUGGESTIONS[0]) => {
    setTicker(s.ticker);
    setName(s.name);
    setAssetClass(s.class as PortfolioAssetClass);
    setCurrency(s.currency);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim() || !avgBuyPrice || !quantity) return;

    setIsSubmitting(true);
    try {
      await onAddHolding({
        ticker: ticker.trim().toUpperCase(),
        name: name.trim() || ticker.trim().toUpperCase(),
        assetClass,
        quantity: parseFloat(quantity) || 1,
        avgBuyPrice: parseFloat(avgBuyPrice) || 0,
        purchaseDate,
        currency,
        notes: notes.trim(),
      });
      // Sıfırla
      setTicker('');
      setName('');
      setAvgBuyPrice('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Plus size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Portföye Varlık Ekle</h3>
            <p className="text-xs text-slate-400">Hisse, ETF, Fon, Altın veya Kripto pozisyonu kaydedin</p>
          </div>
        </div>

        {/* Hızlı Seçim Hapları */}
        <div className="space-y-1.5">
          <span className="text-[11px] text-slate-400 font-semibold block">Popüler Varlıklar:</span>
          <div className="flex flex-wrap gap-1.5 text-xs">
            {POPULAR_SUGGESTIONS.map((s) => (
              <button
                key={s.ticker}
                type="button"
                onClick={() => selectSuggestion(s)}
                className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  ticker === s.ticker
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'
                }`}
              >
                {s.ticker}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Sembol / Ticker *</label>
              <input
                type="text"
                required
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                placeholder="Örn: THYAO, NVDA, SPY"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Varlık Adı / Açıklama</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Türk Hava Yolları"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Varlık Sınıfı</label>
              <select
                value={assetClass}
                onChange={(e) => setAssetClass(e.target.value as PortfolioAssetClass)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="BIST">BIST 100 Hisseleri</option>
                <option value="US_STOCK">ABD Hisseleri (US Stocks)</option>
                <option value="US_ETF">Borsa Yatırım Fonu (ETF)</option>
                <option value="FUND">TEFAS Yatırım Fonu</option>
                <option value="COMMODITY">Altın & Emtia</option>
                <option value="CRYPTO">Kripto Para</option>
                <option value="FOREX">Döviz / Nakit</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Para Birimi</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="TRY">TRY (₺)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Adet / Miktar *</label>
              <input
                type="number"
                step="any"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="100"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Birim Alış Fiyatı *</label>
              <input
                type="number"
                step="any"
                required
                value={avgBuyPrice}
                onChange={(e) => setAvgBuyPrice(e.target.value)}
                placeholder="250.50"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Alış Tarihi</label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Not / Hedef</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Opsiyonel not"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !ticker.trim() || !avgBuyPrice}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold transition-all shadow-lg shadow-emerald-950/40 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Kaydediliyor...' : 'Varlığı Portföye Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
