import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  DollarSign, 
  PieChart, 
  ShieldAlert, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  Calendar
} from 'lucide-react';
import { PortfolioItem, PortfolioRiskMetrics } from '../../../types';

interface PortfolioSummaryProps {
  portfolio: PortfolioItem | null;
  summary: {
    totalValue: number;
    totalCost: number;
    pnl: number;
    pnlPercentage: number;
    dailyPnl: number;
    dailyPnlPercentage: number;
    holdingsCount: number;
  } | null;
  riskMetrics: PortfolioRiskMetrics | null;
  onOpenCreateModal: () => void;
  onOpenAddHoldingModal: () => void;
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({
  portfolio,
  summary,
  riskMetrics,
  onOpenCreateModal,
  onOpenAddHoldingModal,
}) => {
  if (!portfolio || !summary) {
    return (
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
          <Wallet size={32} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Henüz Bir Portföy Seçilmedi veya Oluşturulmadı</h3>
        <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
          Kişisel hisse, ETF, fon ve kripto varlıklarınızı canlı takip etmek, kâr/zarar marjlarını hesaplamak ve AI önerileri almak için hemen portföy oluşturun.
        </p>
        <button
          onClick={onOpenCreateModal}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg shadow-emerald-950/40 hover:brightness-110 transition-all cursor-pointer"
        >
          + Yeni Portföy Oluştur
        </button>
      </div>
    );
  }

  const currencySymbol = portfolio.baseCurrency === 'USD' ? '$' : '₺';
  const isDailyPositive = summary.dailyPnl >= 0;
  const isTotalPositive = summary.pnl >= 0;

  return (
    <div className="space-y-4">
      {/* Üst Bilgi Barı */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Wallet size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{portfolio.name}</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                {portfolio.baseCurrency}
              </span>
              {portfolio.riskTolerance && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                  {portfolio.riskTolerance === 'AGGRESSIVE' ? 'Agresif Büyüme' : portfolio.riskTolerance === 'CONSERVATIVE' ? 'Defansif' : 'Dengeli'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <Calendar size={12} />
              Takip Başlangıcı: <span className="text-slate-300 font-medium">{portfolio.createdAt}</span>
              {portfolio.benchmark && (
                <span className="ml-2 text-slate-500">| Karşılaştırma: <span className="text-slate-400">{portfolio.benchmark}</span></span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAddHoldingModal}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Sparkles size={14} />
            + Varlık Ekle
          </button>
          <button
            onClick={onOpenCreateModal}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all cursor-pointer"
          >
            + Yeni Portföy
          </button>
        </div>
      </div>

      {/* 4 Ana Metrik Kartı */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Kart 1: Toplam Portföy Değeri */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Toplam Portföy Değeri</span>
            <Wallet size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {currencySymbol}{summary.totalValue.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
            <span>Maliyet:</span>
            <span className="font-semibold text-slate-300">
              {currencySymbol}{summary.totalCost.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Kart 2: Günlük Kâr / Zarar */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Günlük Kâr / Zarar</span>
            {isDailyPositive ? (
              <ArrowUpRight size={16} className="text-emerald-400" />
            ) : (
              <ArrowDownRight size={16} className="text-rose-400" />
            )}
          </div>
          <div className={`text-2xl font-black tracking-tight ${isDailyPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isDailyPositive ? '+' : ''}{currencySymbol}{summary.dailyPnl.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
              isDailyPositive ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
            }`}>
              {isDailyPositive ? '+' : ''}%{summary.dailyPnlPercentage.toFixed(2)}
            </span>
            <span className="text-slate-500">24s değişim</span>
          </div>
        </div>

        {/* Kart 3: Kümülatif Net Kâr / Zarar */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Toplam Kâr / Zarar Marjı</span>
            <TrendingUp size={16} className={isTotalPositive ? 'text-emerald-400' : 'text-rose-400'} />
          </div>
          <div className={`text-2xl font-black tracking-tight ${isTotalPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isTotalPositive ? '+' : ''}{currencySymbol}{summary.pnl.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
              isTotalPositive ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
            }`}>
              {isTotalPositive ? '+' : ''}%{summary.pnlPercentage.toFixed(2)}
            </span>
            <span className="text-slate-500">başlangıçtan bu yana</span>
          </div>
        </div>

        {/* Kart 4: Çeşitlendirme & Risk Skoru */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Çeşitlendirme & Sharpe</span>
            <PieChart size={16} className="text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">
              {riskMetrics ? riskMetrics.diversificationScore : 82}/100
            </span>
            <span className="text-xs text-slate-400">
              ({summary.holdingsCount} Varlık)
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span>Sharpe:</span>
            <span className="font-bold text-emerald-400">
              {riskMetrics ? riskMetrics.sharpeRatio : '1.45'}
            </span>
            <span className="text-slate-600">|</span>
            <span>Volatilite:</span>
            <span className="font-bold text-amber-400">
              %{riskMetrics ? riskMetrics.volatility : '18.5'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
