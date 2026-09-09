import React, { useState } from 'react';
import { X, Wallet, Sparkles } from 'lucide-react';
import { PortfolioItem } from '../../../types';

interface CreatePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (portfolio: Partial<PortfolioItem>) => Promise<any>;
}

export const CreatePortfolioModal: React.FC<CreatePortfolioModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [baseCurrency, setBaseCurrency] = useState<'TRY' | 'USD'>('TRY');
  const [initialCapital, setInitialCapital] = useState('100000');
  const [riskTolerance, setRiskTolerance] = useState<'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE'>('MODERATE');
  const [targetReturn, setTargetReturn] = useState('45');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onCreate({
        name: name.trim(),
        baseCurrency,
        initialCapital: parseFloat(initialCapital) || 100000,
        riskTolerance,
        targetReturn: parseFloat(targetReturn) || 35,
        notes: notes.trim(),
        createdAt: new Date().toISOString().split('T')[0],
        holdings: [],
      });
      setName('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Wallet size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Yeni Portföy Oluştur</h3>
            <p className="text-xs text-slate-400">Canlı ve tarih bazlı varlık takibi başlatın</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Portföy Adı *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: BIST Büyüme & ABD Teknoloji"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Temel Para Birimi</label>
              <select
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="TRY">TRY (Türk Lirası ₺)</option>
                <option value="USD">USD (Amerikan Doları $)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Başlangıç Sermayesi</label>
              <input
                type="number"
                value={initialCapital}
                onChange={(e) => setInitialCapital(e.target.value)}
                placeholder="100000"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Risk Toleransı</label>
              <select
                value={riskTolerance}
                onChange={(e) => setRiskTolerance(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="CONSERVATIVE">Defansif (Düşük Risk)</option>
                <option value="MODERATE">Dengeli (Orta Risk)</option>
                <option value="AGGRESSIVE">Agresif Büyüme</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Hedef Yıllık Getiri (%)</label>
              <input
                type="number"
                value={targetReturn}
                onChange={(e) => setTargetReturn(e.target.value)}
                placeholder="45"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Portföy Notu (Opsiyonel)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Strateji hedefleri, koruma planı veya hedefler..."
              rows={2}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold transition-all shadow-lg shadow-emerald-950/40 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Oluşturuluyor...' : 'Portföyü Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
