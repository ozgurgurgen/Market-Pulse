import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  Sparkles,
  BarChart2,
  ShieldCheck,
  Bell,
  Plus,
  RefreshCw,
  Trash2,
  Sliders,
  ChevronDown,
  Layers,
  Scale,
  Receipt,
  Activity,
} from 'lucide-react';
import { usePortfolio } from './hooks/usePortfolio';
import { usePortfolioAI } from './hooks/usePortfolioAI';
import { usePortfolioBacktest } from './hooks/usePortfolioBacktest';

import { PortfolioSummary } from './components/PortfolioSummary';
import { PortfolioChart } from './components/PortfolioChart';
import { HoldingsTable } from './components/HoldingsTable';
import { AIRecommendations } from './components/AIRecommendations';
import { BacktestPanel } from './components/BacktestPanel';
import { RiskPanel } from './components/RiskPanel';
import { RebalancePanel } from './components/RebalancePanel';
import { TaxSimulatorPanel } from './components/TaxSimulatorPanel';
import { MonteCarloPanel } from './components/MonteCarloPanel';
import { CreatePortfolioModal } from './components/CreatePortfolioModal';
import { AddHoldingModal } from './components/AddHoldingModal';
import { TelegramAlertsModal } from './components/TelegramAlertsModal';

export const PortfolioPage: React.FC = () => {
  const {
    portfolios,
    selectedPortfolioId,
    setSelectedPortfolioId,
    selectedPortfolio,
    selectedRange,
    setSelectedRange,
    performanceData,
    riskMetrics,
    alerts,
    transactions,
    isLoading,
    isRefreshing,
    error,
    refreshPortfolio,
    addTransaction,
    createNewPortfolio,
    addOrUpdateHolding,
    removeHolding,
    deleteCurrentPortfolio,
  } = usePortfolio();

  const {
    recommendations,
    isLoading: isAILoading,
    refreshRecommendations,
  } = usePortfolioAI(selectedPortfolioId);

  const {
    backtestResult,
    isRunning: isBacktestRunning,
    runBacktest,
  } = usePortfolioBacktest();

  // Aktif Sekme (Tab)
  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'AI_RECOMMENDATIONS' | 'BACKTEST' | 'RISK' | 'REBALANCE' | 'TAX_SIMULATOR' | 'MONTE_CARLO'
  >('OVERVIEW');

  // Modal durumları
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddHoldingModalOpen, setIsAddHoldingModalOpen] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. Üst Başlık & Portföy Seçim Çubuğu */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md shadow-emerald-950/40">
            <Wallet size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white tracking-tight">Portföy Yönetim Sistemi</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-extrabold uppercase">
                v1.0 Pro
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Canlı kâr/zarar takibi, yapay zekâ varlık önerileri ve deterministik backtest motoru
            </p>
          </div>
        </div>

        {/* Portföy Seçici & Eylemler */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Portföy Dropdown */}
          <div className="relative">
            <select
              value={selectedPortfolioId}
              onChange={(e) => setSelectedPortfolioId(e.target.value)}
              className="appearance-none bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 pr-9 text-xs font-bold text-white focus:outline-none focus:border-emerald-500 cursor-pointer shadow-sm"
            >
              {portfolios.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.baseCurrency})
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Yenile */}
          <button
            onClick={() => refreshPortfolio()}
            disabled={isRefreshing}
            title="Verileri Yenile"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
          >
            <RefreshCw size={15} className={isRefreshing ? 'animate-spin text-emerald-400' : ''} />
          </button>

          {/* Telegram Ayarları */}
          <button
            onClick={() => setIsTelegramModalOpen(true)}
            title="Telegram Bildirimleri"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer relative"
          >
            <Bell size={15} />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Yeni Portföy Ekle */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950/40 cursor-pointer"
          >
            <Plus size={14} />
            Yeni Portföy
          </button>

          {/* Portföy Sil */}
          {selectedPortfolio && portfolios.length > 1 && (
            <button
              onClick={() => {
                if (confirm(`${selectedPortfolio.name} portföyünü silmek istediğinize emin misiniz?`)) {
                  deleteCurrentPortfolio(selectedPortfolio.id);
                }
              }}
              title="Portföyü Sil"
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all cursor-pointer"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Portföy Özet Kartları */}
      <PortfolioSummary
        portfolio={selectedPortfolio}
        summary={performanceData?.summary || null}
        riskMetrics={riskMetrics}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenAddHoldingModal={() => setIsAddHoldingModalOpen(true)}
      />

      {/* 3. Sekme Başlıkları (Tab Navigation) */}
      <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar text-xs">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'OVERVIEW'
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-950/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <TrendingUp size={15} />
          Genel Bakış & Varlıklar
        </button>

        <button
          onClick={() => setActiveTab('REBALANCE')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'REBALANCE'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-950/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Scale size={15} />
          Rebalance & Eşik Uyarıları
        </button>

        <button
          onClick={() => setActiveTab('TAX_SIMULATOR')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'TAX_SIMULATOR'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-950/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Receipt size={15} />
          Vergi Simülatörü
        </button>

        <button
          onClick={() => setActiveTab('MONTE_CARLO')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'MONTE_CARLO'
              ? 'bg-cyan-500 text-white shadow-md shadow-cyan-950/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Activity size={15} />
          Monte Carlo Tahmini
        </button>

        <button
          onClick={() => setActiveTab('AI_RECOMMENDATIONS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'AI_RECOMMENDATIONS'
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-950/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Sparkles size={15} />
          Yapay Zekâ Önerileri
        </button>

        <button
          onClick={() => setActiveTab('BACKTEST')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'BACKTEST'
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-950/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BarChart2 size={15} />
          Portföy Backtest Simülatörü
        </button>

        <button
          onClick={() => setActiveTab('RISK')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'RISK'
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-950/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <ShieldCheck size={15} />
          Risk & Çeşitlendirme Raporu
        </button>
      </div>

      {/* 4. Sekme İçerikleri */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Equity Curve Grafiği (TWR & Benchmarks) */}
          <PortfolioChart
            portfolioTWR={performanceData?.portfolioTWR || []}
            benchmarks={performanceData?.benchmarks || []}
            snapshots={performanceData?.snapshots || []}
            transactions={transactions}
            holdings={performanceData?.holdings || []}
            baseCurrency={selectedPortfolio?.baseCurrency || 'TRY'}
            initialCost={performanceData?.summary?.totalCost || selectedPortfolio?.initialCapital || 100000}
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
            onAddTransaction={addTransaction}
          />

          {/* Varlıklar Tablosu */}
          <HoldingsTable
            holdings={performanceData?.holdings || []}
            baseCurrency={selectedPortfolio?.baseCurrency || 'TRY'}
            onAddHolding={() => setIsAddHoldingModalOpen(true)}
            onRemoveHolding={removeHolding}
          />
        </div>
      )}

      {activeTab === 'REBALANCE' && (
        <RebalancePanel
          portfolioId={selectedPortfolioId}
          portfolioName={selectedPortfolio?.name || 'Portföy'}
          holdings={performanceData?.holdings || []}
          baseCurrency={selectedPortfolio?.baseCurrency || 'TRY'}
          onRefreshPortfolio={refreshPortfolio}
          onAddTransaction={addTransaction}
        />
      )}

      {activeTab === 'TAX_SIMULATOR' && (
        <TaxSimulatorPanel
          holdings={performanceData?.holdings || []}
          baseCurrency={selectedPortfolio?.baseCurrency || 'TRY'}
          portfolioName={selectedPortfolio?.name || 'Portföy'}
        />
      )}

      {activeTab === 'MONTE_CARLO' && (
        <MonteCarloPanel
          initialCapital={selectedPortfolio?.initialCapital || 100000}
          totalPortfolioValue={performanceData?.summary?.totalValue || selectedPortfolio?.initialCapital || 100000}
          riskMetrics={riskMetrics}
          baseCurrency={selectedPortfolio?.baseCurrency || 'TRY'}
          portfolioName={selectedPortfolio?.name || 'Portföy'}
        />
      )}

      {activeTab === 'AI_RECOMMENDATIONS' && (
        <AIRecommendations
          recommendations={recommendations}
          isLoading={isAILoading}
          onRefresh={refreshRecommendations}
        />
      )}

      {activeTab === 'BACKTEST' && (
        <BacktestPanel
          portfolio={selectedPortfolio}
          backtestResult={backtestResult}
          isRunning={isBacktestRunning}
          onRunBacktest={runBacktest}
        />
      )}

      {activeTab === 'RISK' && (
        <RiskPanel
          riskMetrics={riskMetrics}
          baseCurrency={selectedPortfolio?.baseCurrency || 'TRY'}
        />
      )}

      {/* 5. Modallar */}
      <CreatePortfolioModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={createNewPortfolio}
      />

      <AddHoldingModal
        isOpen={isAddHoldingModalOpen}
        onClose={() => setIsAddHoldingModalOpen(false)}
        onAddHolding={addOrUpdateHolding}
        baseCurrency={selectedPortfolio?.baseCurrency || 'TRY'}
      />

      <TelegramAlertsModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
      />
    </div>
  );
};
export default PortfolioPage;
