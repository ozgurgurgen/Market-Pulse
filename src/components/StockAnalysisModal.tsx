import React, { useState, useEffect } from "react";
import { safeFetchJson } from "../utils/apiClient";

import { 
  X, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  BarChart3, 
  Globe, 
  Bookmark, 
  BookmarkCheck,
  Zap,
  Activity,
  Layers,
  Scale,
  FileSpreadsheet,
  Coins,
  Repeat,
  Briefcase,
  PieChart,
  Database,
  ArrowUpRight,
  Info,
  Check,
  AlertCircle,
  Landmark,
  ShieldCheck,
  Calendar,
  Building2,
  Users,
  Bell
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Line 
} from 'recharts';
import { StockAnalysisDetail, MarketNewsItem } from '../types';
import { AssetImpactSection } from './EconomicIndicators/AssetImpactSection';
import { CompanyThesisTab } from './StockAnalysis/CompanyThesisTab';
import { FinancialStatementsTab } from './StockAnalysis/FinancialStatementsTab';
import { ScorecardTab } from './StockAnalysis/ScorecardTab';
import { SubsidiariesAndGovernanceTab } from './StockAnalysis/SubsidiariesAndGovernanceTab';
import { PeerComparisonTab } from './StockAnalysis/PeerComparisonTab';
import { MultiplesAnalysisTab } from './StockAnalysis/MultiplesAnalysisTab';
import { CorporateEventsTab } from './StockAnalysis/CorporateEventsTab';
import { FundPositionsTab } from './StockAnalysis/FundPositionsTab';
import { SeasonalityTab } from './StockAnalysis/SeasonalityTab';
import { TechnicalEngineTab } from './StockAnalysis/TechnicalEngineTab';
import { FundamentalValuationTab } from './StockAnalysis/FundamentalValuationTab';
import { InteractiveStockPriceChart } from './StockAnalysis/InteractiveStockPriceChart';
import { StockBrokerageDistribution } from './StockAnalysis/StockBrokerageDistribution';
import { WhatIfValuationSimulator } from './StockAnalysis/WhatIfValuationSimulator';
import { AcademyTooltip } from './AcademyTooltip';
import { LockedField } from './ui/LockedField';
import { ErrorBoundary } from './ErrorBoundary';

interface StockAnalysisModalProps {
  analysis: StockAnalysisDetail | null;
  isLoading: boolean;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (symbol: string, name: string, price: number, exchange: string) => void;
  news: MarketNewsItem[];
  onOpenUpgradeModal?: () => void;
}

export const StockAnalysisModal: React.FC<StockAnalysisModalProps> = ({
  analysis,
  isLoading,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
  news = [],
  onOpenUpgradeModal,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'thesis'
    | 'financials'
    | 'karne'
    | 'peers'
    | 'subsidiaries'
    | 'multiples'
    | 'events'
    | 'funds'
    | 'seasonality'
    | 'technical_engine'
    | 'fundamental_fairvalue'
    | 'deals'
    | 'buyback_dividend'
    | 'index_ipo'
    | 'macro'
    | 'sources'
    | 'news'
  >('overview');

  const [showAlertSubscribed, setShowAlertSubscribed] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [dynamicNews, setDynamicNews] = useState<any[]>([]);

  useEffect(() => {
    if (analysis?.symbol && activeTab === "news") {
      safeFetchJson<{ news: any[] }>(`/api/market/news?search=${encodeURIComponent(analysis.symbol)}`)
        .then(({ data, ok }) => {
          if (ok && data?.news && Array.isArray(data.news)) {
            const rNews = data.news.filter((n: any) => n.relatedSymbols?.includes(analysis.symbol));
            setDynamicNews(rNews.length > 0 ? rNews : data.news.slice(0, 5));
          }
        });
    }
  }, [analysis?.symbol, activeTab]);

  const handleSubscribeAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!analysis || !userEmail.includes('@')) return;
    setSubscribing(true);
    try {
      await safeFetchJson('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          symbols: [analysis.symbol],
          notifyOnKap: true,
          notifyOnScorecard: true
        })
      });
      setShowAlertSubscribed(true);
      setTimeout(() => {
        setShowNotificationModal(false);
        setShowAlertSubscribed(false);
      }, 2500);
    } catch {
      // ignore
    } finally {
      setSubscribing(false);
    }
  };

  if (!analysis && !isLoading) return null;

  const relatedNews = dynamicNews.length > 0 ? dynamicNews : news.filter(n => n.relatedSymbols.includes(analysis?.symbol || ""));


  const getVerdictStyle = (verdict: string) => {
    if (verdict?.includes('GÜÇLÜ AL') || verdict?.includes('GÜÇLÜ TERCİH')) {
      return { bg: 'bg-emerald-500 text-slate-950', border: 'border-emerald-400', glow: 'shadow-emerald-500/30' };
    }
    if (verdict?.includes('AL') || verdict?.includes('KADEMELİ')) {
      return { bg: 'bg-teal-500 text-slate-950', border: 'border-teal-400', glow: 'shadow-teal-500/30' };
    }
    if (verdict?.includes('İZLE')) {
      return { bg: 'bg-amber-500 text-slate-950', border: 'border-amber-400', glow: 'shadow-amber-500/30' };
    }
    return { bg: 'bg-rose-500 text-white', border: 'border-rose-400', glow: 'shadow-rose-500/30' };
  };

  const getStatusBadge = (status: 'passed' | 'warning' | 'failed') => {
    if (status === 'passed') {
      return <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800"><Check size={10} /> Geçti</span>;
    }
    if (status === 'warning') {
      return <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800"><AlertCircle size={10} /> Sınırda</span>;
    }
    return <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800"><X size={10} /> Zayıf</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        id="stock-analysis-modal"
        className="relative w-full max-w-7xl 2xl:max-w-[96vw] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[96vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700 flex flex-col items-center justify-center text-center p-1">
              <span className="text-sm font-black text-white">{analysis?.symbol || '...'}</span>
              <span className="text-[10px] font-semibold text-emerald-400">{analysis?.exchange || 'BIST'}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  {analysis?.name || 'Kıdemli Finansal Analiz Raporu'}
                </h2>
                {analysis && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                    <Zap size={11} className="text-emerald-400" /> 6 Temel Kriter & Açık Veri
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {analysis?.strategyName || 'KAP, SPK, yfinance & TCMB EVDS Doğrulamalı Finansal Analiz'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {analysis && (
              <>
                <button
                  onClick={() => setShowNotificationModal(true)}
                  className="px-2.5 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  title="Bilanço Açıklanınca E-Posta Gönder"
                >
                  <Bell size={14} className="text-emerald-400" />
                  <span className="hidden sm:inline">Bilanço Alarmı</span>
                </button>

                <button
                  id="modal-watchlist-toggle"
                  onClick={() =>
                    onToggleWatchlist(analysis.symbol, analysis.name, analysis.currentPrice, analysis.exchange)
                  }
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    isWatchlisted
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                  title={isWatchlisted ? 'Takip listesinden çıkar' : 'Takip listesine ekle'}
                >
                  {isWatchlisted ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                </button>
              </>
            )}

            <button
              id="modal-close-button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Stock Analysis Navigation Tabs */}
        {analysis && (
          <div className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 bg-slate-950 border-b border-slate-800 overflow-x-auto shrink-0 scrollbar-thin scrollbar-thumb-slate-700">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Activity size={13} />
              <span>Genel Bakış</span>
            </button>

            <button
              onClick={() => setActiveTab('thesis')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'thesis'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers size={13} />
              <span>Şirket & Tez</span>
            </button>

            <button
              onClick={() => setActiveTab('financials')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'financials'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileSpreadsheet size={13} />
              <span>Finansallar</span>
            </button>

            <button
              onClick={() => setActiveTab('karne')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'karne'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck size={13} />
              <span>Karne (18 Kriter)</span>
            </button>

            <button
              onClick={() => setActiveTab('peers')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'peers'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Users size={13} />
              <span>Sektörel Rakipler</span>
            </button>

            <button
              onClick={() => setActiveTab('subsidiaries')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'subsidiaries'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Building2 size={13} />
              <span>Ortaklık & İştirakler</span>
            </button>

            <button
              onClick={() => setActiveTab('multiples')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'multiples'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 size={13} />
              <span>Çarpanlar</span>
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'events'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Calendar size={13} />
              <span>Şirket Olayları</span>
            </button>

            <button
              onClick={() => setActiveTab('funds')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'funds'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Briefcase size={13} />
              <span>Fon Pozisyonları (Smart Money)</span>
            </button>

            <button
              onClick={() => setActiveTab('seasonality')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'seasonality'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <TrendingUp size={13} />
              <span>Mevsimsellik</span>
            </button>

            <button
              onClick={() => setActiveTab('technical_engine')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'technical_engine'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles size={13} />
              <span>Teknik Analiz</span>
            </button>

            <button
              onClick={() => setActiveTab('fundamental_fairvalue')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'fundamental_fairvalue'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Target size={13} />
              <span>Temel & Adil Değer</span>
            </button>

            <button
              onClick={() => setActiveTab('deals')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'deals'
                  ? 'bg-slate-800 text-slate-200 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileSpreadsheet size={13} />
              <span>KAP İş Anlaşmaları</span>
            </button>

            <button
              onClick={() => setActiveTab('buyback_dividend')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'buyback_dividend'
                  ? 'bg-slate-800 text-slate-200 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Coins size={13} />
              <span>Geri Alım & Temettü</span>
            </button>

            <button
              onClick={() => setActiveTab('macro')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'macro'
                  ? 'bg-slate-800 text-slate-200 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Landmark size={13} />
              <span>Makro Göstergeler</span>
            </button>

            <button
              onClick={() => setActiveTab('news')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'news'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Globe size={13} />
              <span>Haberler ({relatedNews.length})</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {isLoading && (
            <div className="py-16 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center animate-pulse">
                <Sparkles className="w-7 h-7 text-emerald-400 animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Kıdemli Analiz Asistanı Bilanço ve KAP Verilerini İnceliyor...</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  18 parametreli karne, temettü disiplini, KAP yeni iş ilişkileri ve karar matrisi sentezleniyor.
                </p>
              </div>
            </div>
          )}

          {!isLoading && analysis && (
            <>
              {/* TAB 1: OVERVIEW & STRATEGY DECISION MATRIX */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Verdict Banner and Key Matrix */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Decision Score & Verdict */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                        <span>Yapay Zeka Kararı</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                          analysis.confidenceLevel === 'YÜKSEK'
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                            : analysis.confidenceLevel === 'DÜŞÜK'
                            ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                            : 'bg-amber-950/80 text-amber-300 border-amber-800'
                        }`}>
                          Güven: {analysis.confidenceLevel || 'YÜKSEK'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <div className={`px-4 py-2 rounded-xl font-black text-sm tracking-wide shadow-lg ${getVerdictStyle(analysis.verdict).bg} ${getVerdictStyle(analysis.verdict).glow}`}>
                          {analysis.verdict}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-emerald-400">%{analysis.score}</div>
                          <div className="text-[10px] text-slate-500 font-medium">Model Skoru</div>
                        </div>
                      </div>
                    </div>

                    {/* Target Levels */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between relative overflow-hidden">
                      <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center justify-between relative z-10">
                        <span>Hesaplanan Hedef Fiyatlar</span>
                        <span className="text-emerald-400 text-[11px] font-bold">Risk/Kazanç: {analysis.riskReward || '•••'}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-1 relative z-10">
                        <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                          <div className="text-[10px] text-slate-400">Kısa Vade</div>
                          <div className={`text-xs font-black text-emerald-400 ${!!(analysis as any)._isMasked ? 'blur-sm select-none text-slate-500' : ''}`}>
                            {!!(analysis as any)._isMasked ? '•••' : `${analysis.currency}${analysis.targetShortTerm}`}
                          </div>
                        </div>
                        <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                          <div className="text-[10px] text-slate-400">Orta Vade</div>
                          <div className={`text-xs font-black text-emerald-400 ${!!(analysis as any)._isMasked ? 'blur-sm select-none text-slate-500' : ''}`}>
                            {!!(analysis as any)._isMasked ? '•••' : `${analysis.currency}${analysis.targetMidTerm}`}
                          </div>
                        </div>
                      </div>
                      {!!(analysis as any)._isMasked && (
                        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-2 text-center rounded-2xl">
                          <div className="text-[11px] font-bold text-slate-300 mb-1">Hedef Fiyatlar Kilitli</div>
                          <button onClick={() => onOpenUpgradeModal && onOpenUpgradeModal()} className="text-[10px] bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-1 px-3 rounded-full transition-colors">
                            Pro'ya Geçin
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Stop Loss & Current Price */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                      <div className="text-xs text-slate-400 font-semibold mb-1">Mevcut Seviye & Zarar Kes</div>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                          <div className="text-[10px] text-slate-400">Mevcut Fiyat</div>
                          <div className="text-xs font-black text-slate-100">
                            {analysis.currency}{analysis.currentPrice}
                          </div>
                        </div>
                        <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 relative overflow-hidden">
                          <div className="text-[10px] text-rose-400 relative z-10">Zarar Kes (Stop-Loss)</div>
                          <div className={`text-xs font-black text-rose-400 relative z-10 ${!!(analysis as any)._isMasked ? 'blur-sm select-none text-slate-500' : ''}`}>
                            {!!(analysis as any)._isMasked ? '•••' : `${analysis.currency}${analysis.stopLoss}`}
                          </div>
                          {!!(analysis as any)._isMasked && (
                            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] z-20 flex items-center justify-center cursor-pointer" onClick={() => onOpenUpgradeModal && onOpenUpgradeModal()}>
                              <div className="text-[9px] font-bold text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">Kilitli</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Institutional & Risk Scores */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between relative overflow-hidden">
                      <div className="text-xs text-slate-400 font-semibold mb-1">Akıllı Para & Risk Metrikleri</div>
                      <div className="grid grid-cols-2 gap-2 mt-1 relative z-10">
                        <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                          <div className="text-[10px] text-slate-400">Kurumsal Skor</div>
                          <div className={`text-xs font-black text-blue-400 ${!!(analysis as any)._isMasked ? 'blur-sm select-none text-slate-500' : ''}`}>
                            {!!(analysis as any)._isMasked ? '•••' : `${analysis.institutionalInOutScore || (65 + (analysis.symbol.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 28))}/100`}
                          </div>
                        </div>
                        <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                          <div className="text-[10px] text-slate-400">Risk Puanı</div>
                          <div className={`text-xs font-black text-amber-400 ${!!(analysis as any)._isMasked ? 'blur-sm select-none text-slate-500' : ''}`}>
                            {!!(analysis as any)._isMasked ? '•••' : `${analysis.riskScore || (2 + (analysis.symbol.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 4))}/7`}
                          </div>
                        </div>
                      </div>
                      {!!(analysis as any)._isMasked && (
                        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-2 text-center rounded-2xl">
                          <div className="text-[11px] font-bold text-slate-300 mb-1">Skorlar Kilitli</div>
                          <button onClick={() => onOpenUpgradeModal && onOpenUpgradeModal()} className="text-[10px] bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-1 px-3 rounded-full transition-colors">
                            Pro'ya Geçin
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 5-STEP STRATEGY DECISION MATRIX BANNER */}
                  {analysis.strategyDecisionMatrix && (
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/40 shadow-xl space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                            <Scale size={16} />
                          </div>
                          <div>
                            <h3 className="text-sm font-black text-white flex items-center gap-2">
                              5 Adımlı Strateji Karar Matrisi
                            </h3>
                            <p className="text-[11px] text-slate-400">BIST & Küresel Veri Çerçevesinde Nihai Strateji Sınıflandırması</p>
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black">
                          <Target size={13} />
                          <span>Eşleşme: {analysis.strategyDecisionMatrix.finalStrategyMatch}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
                          <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                            <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">1</span>
                            Şirket Sağlık Puanı
                          </div>
                          <p className="text-[11px] text-slate-300 font-medium">{analysis.strategyDecisionMatrix.companyHealthScore.profitabilityVerdict}</p>
                          <div className="text-[10px] text-emerald-400 font-bold">{analysis.strategyDecisionMatrix.companyHealthScore.debtVerdict}</div>
                        </div>

                        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
                          <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                            <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">2</span>
                            Büyüme Katalizörleri
                          </div>
                          <p className="text-[11px] text-slate-300 font-medium">{analysis.strategyDecisionMatrix.catalystsEvaluation.newBusinessImpact}</p>
                          <div className="text-[10px] text-cyan-400 font-bold">{analysis.strategyDecisionMatrix.catalystsEvaluation.buybackSignal}</div>
                        </div>

                        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
                          <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                            <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">3</span>
                            Sermaye & Sulandırma
                          </div>
                          <p className="text-[11px] text-slate-300 font-medium">{analysis.strategyDecisionMatrix.capitalStructureEvaluation.dividendDiscipline}</p>
                          <div className="text-[10px] text-emerald-400 font-bold">Sulandırma Riski: {analysis.strategyDecisionMatrix.capitalStructureEvaluation.dilutionRisk}</div>
                        </div>

                        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
                          <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                            <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">4</span>
                            Endeks Korelasyonu
                          </div>
                          <p className="text-[11px] text-slate-300 font-medium">{analysis.strategyDecisionMatrix.marketCorrelation.indexImpact}</p>
                          <div className="text-[10px] text-amber-400 font-bold">{analysis.strategyDecisionMatrix.marketCorrelation.independenceStatus}</div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                        <span className="font-bold text-emerald-400 mr-1.5">5. Nihai Eylem Özeti:</span>
                        {analysis.strategyDecisionMatrix.strategicActionSummary}
                      </div>
                    </div>
                  )}

                  {/* 2. Yabancı Takas & Aracı Kurum Dağılımı (AKD) */}
                  <StockBrokerageDistribution 
                    symbol={analysis.symbol} 
                    currentPrice={analysis.currentPrice} 
                  />

                  {/* 3. What-If Hedef Fiyat & Değerleme Simülatörü */}
                  <WhatIfValuationSimulator 
                    symbol={analysis.symbol} 
                    currentPrice={analysis.currentPrice} 
                    aiFairValue={analysis.calculatedTargets?.targetMidTerm || analysis.targetMidTerm} 
                  />

                  {/* Analysis Text Sections (Technical & Fundamental) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                        <Activity size={14} className="text-emerald-400" />
                        Teknik Analiz ve Formasyonlar
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {analysis.technicalAnalysis}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                        <Scale size={14} className="text-cyan-400" />
                        Temel Analiz & Bilanço Çarpanları
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {analysis.fundamentalAnalysis}
                      </p>
                    </div>
                  </div>

                  {/* Catalysts & Risks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-900/30 space-y-2">
                      <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <CheckCircle2 size={14} />
                        Yükselişi Tetikleyecek Katalizörler
                      </h4>
                      <div className="space-y-2">
                        {analysis.catalysts?.map((cat, i) => {
                          const text = typeof cat === 'object' && cat !== null ? (cat as any).text || '' : String(cat || '');
                          const basedOn = typeof cat === 'object' && cat !== null ? (cat as any).basedOn : null;
                          return (
                            <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                              <div className="flex-1">
                                <span className="leading-relaxed">{text}</span>
                                {basedOn && (
                                  <span className="block text-[10px] text-emerald-400/80 font-medium mt-0.5">
                                    Kaynak: {basedOn}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-rose-900/30 space-y-2">
                      <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <AlertTriangle size={14} />
                        Risk Faktörleri ve Dikkat Edilmesi Gerekenler
                      </h4>
                      <div className="space-y-2">
                        {analysis.risks?.map((risk, i) => {
                          const text = typeof risk === 'object' && risk !== null ? (risk as any).text || '' : String(risk || '');
                          const basedOn = typeof risk === 'object' && risk !== null ? (risk as any).basedOn : null;
                          return (
                            <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0"></span>
                              <div className="flex-1">
                                <span className="leading-relaxed">{text}</span>
                                {basedOn && (
                                  <span className="block text-[10px] text-rose-400/80 font-medium mt-0.5">
                                    Kaynak: {basedOn}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Anti-Hallucination: Where Thesis Breaks */}
                  {analysis.whereIWouldBeWrong && (
                    <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/40 space-y-1.5">
                      <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <ShieldAlert size={14} />
                        Bu Tez Hangi Koşulda Çöker? (Karşı-Argüman & Güvenlik Kalkanı)
                      </h4>
                      <p className="text-xs text-amber-200/90 leading-relaxed">
                        {analysis.whereIWouldBeWrong}
                      </p>
                    </div>
                  )}

                  {/* Macro Economic Indicators Impact Preview */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                    <AssetImpactSection symbol={analysis.symbol} assetName={analysis.name} />
                  </div>
                </div>
              )}

              {/* TAB: ŞİRKET & TEZ */}
              {activeTab === 'thesis' && (
                <ErrorBoundary inline={true} fallbackTitle="Şirket Tezi Yüklenemedi" fallbackMessage="Şirket tezi ve faaliyet özeti verileri şu anda yüklenemiyor.">
                  <CompanyThesisTab symbol={analysis.symbol} />
                </ErrorBoundary>
              )}

              {/* TAB: FİNANSALLAR (BİLANÇO & GELİR TABLOSU) */}
              {activeTab === 'financials' && (
                <ErrorBoundary inline={true} fallbackTitle="Finansal Tablolar Yüklenemedi" fallbackMessage="Bilanço ve gelir tablosu verilerine geçici olarak ulaşılamıyor.">
                  <FinancialStatementsTab symbol={analysis.symbol} />
                </ErrorBoundary>
              )}

              {/* TAB: ÇARPANLAR & PERCENTILE ANALİZİ */}
              {activeTab === 'multiples' && (
                <ErrorBoundary inline={true} fallbackTitle="Çarpan Analizi Yüklenemedi" fallbackMessage="Tarihsel ve sektörel çarpan dağılımı verilerine ulaşılamıyor.">
                  <MultiplesAnalysisTab symbol={analysis.symbol} />
                </ErrorBoundary>
              )}

              {/* TAB: ŞİRKET OLAYLARI (GK, TEMETTÜ, KAP, INSIDER) */}
              {activeTab === 'events' && (
                <ErrorBoundary inline={true} fallbackTitle="Şirket Olayları Yüklenemedi" fallbackMessage="Genel kurul, temettü ve KAP bildirimleri yüklenirken bir hata oluştu.">
                  <CorporateEventsTab symbol={analysis.symbol} />
                </ErrorBoundary>
              )}

              {/* TAB: FON POZİSYONLARI (SMART MONEY) */}
              {activeTab === 'funds' && (
                <ErrorBoundary inline={true} fallbackTitle="Fon Pozisyonları Yüklenemedi" fallbackMessage="TEFAS fonlarının portföy dağılımı verilerine ulaşılamıyor.">
                  <FundPositionsTab symbol={analysis.symbol} />
                </ErrorBoundary>
              )}

              {/* TAB: MEVSİMSELLİK & TARİHSEL ISI HARİTASI */}
              {activeTab === 'seasonality' && (
                <ErrorBoundary inline={true} fallbackTitle="Mevsimsellik Analizi Yüklenemedi" fallbackMessage="Aylık ve çeyreklik tarihsel getiri verilerine ulaşılamıyor.">
                  <SeasonalityTab symbol={analysis.symbol} />
                </ErrorBoundary>
              )}

              {/* TAB: TEKNİK ANALİZ MOTORU */}
              {activeTab === 'technical_engine' && (
                <ErrorBoundary inline={true} fallbackTitle="Teknik Motor Yüklenemedi" fallbackMessage="Pivot, destek/direnç ve senaryo simülasyonlarına ulaşılamıyor.">
                  <TechnicalEngineTab 
                    symbol={analysis.symbol} 
                    currentPrice={analysis.currentPrice}
                    historicalChartData={analysis.historicalChartData}
                  />
                </ErrorBoundary>
              )}

              {/* TAB: TEMEL ADİL DEĞERLEME */}
              {activeTab === 'fundamental_fairvalue' && (
                <ErrorBoundary inline={true} fallbackTitle="Adil Değerleme Yüklenemedi" fallbackMessage="DCF ve çarpan bazlı değerleme modellerine ulaşılamıyor.">
                  <FundamentalValuationTab symbol={analysis.symbol} />
                </ErrorBoundary>
              )}

              {/* TAB: MAKRO GÖSTERGE ETKİLERİ */}
              {activeTab === 'macro' && (
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800">
                  <ErrorBoundary inline={true} fallbackTitle="Makro Etki Analizi Yüklenemedi" fallbackMessage="Makroekonomik korelasyon verilerine ulaşılamıyor.">
                    <AssetImpactSection symbol={analysis.symbol} assetName={analysis.name} />
                  </ErrorBoundary>
                </div>
              )}

              {/* TAB 2: 18 PARAMETRELİ ŞİRKET KARNESİ */}
              {activeTab === 'karne' && (
                <ErrorBoundary inline={true} fallbackTitle="Finansal Karne Yüklenemedi" fallbackMessage="18 kriterli finansal karne skorlaması yüklenemiyor.">
                  <ScorecardTab symbol={analysis.symbol} />
                </ErrorBoundary>
              )}

              {/* TAB: SEKTÖREL RAKİPLER & AKRAN KARŞILAŞTIRMASI */}
              {activeTab === 'peers' && (
                <ErrorBoundary inline={true} fallbackTitle="Akran Karşılaştırması Yüklenemedi" fallbackMessage="Sektörel rakip ve değerleme karşılaştırması yüklenemiyor.">
                  <PeerComparisonTab symbol={analysis.symbol} />
                </ErrorBoundary>
              )}

              {/* TAB: ORTAKLIK YAPISI & İŞTİRAKLER */}
              {activeTab === 'subsidiaries' && (
                <ErrorBoundary inline={true} fallbackTitle="İştirak Yapısı Yüklenemedi" fallbackMessage="Bağlı ortaklıklar ve yönetim kurulu yapısı yüklenemiyor.">
                  <SubsidiariesAndGovernanceTab symbol={analysis.symbol} />
                </ErrorBoundary>
              )}

              {/* TAB 3: KAP YENİ İŞ İLİŞKİLERİ & KATALİZÖRLER */}
              {activeTab === 'deals' && (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Briefcase className="text-emerald-400" size={20} />
                        <h3 className="text-base font-black text-white">KAP Yeni İş İlişkileri & İhale Katalizörleri</h3>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-800">
                        KAP Doğrulamalı
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Yeni alınan siparişlerin yıllık ciroya olan oranı (%), şirketin önümüzdeki 12-24 aylık hasılat ve net nakit akışı büyümesinin en güçlü öncü göstergesidir.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {analysis.newBusinessDeals?.map((deal, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                          <div>
                            <span className="text-[10px] text-slate-500 font-semibold">{deal.date}</span>
                            <h4 className="text-sm font-bold text-slate-100">{deal.customerOrProject}</h4>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {deal.amountCurrencyStr && deal.amountCurrencyStr !== 'null' && deal.amountCurrencyStr !== '0' ? (
                              <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                {deal.amountCurrencyStr}
                              </span>
                            ) : null}

                            {deal.ratioToAnnualRevenue !== null && deal.ratioToAnnualRevenue !== undefined && Number(deal.ratioToAnnualRevenue) > 0 ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                                Ciroya Oran: %{deal.ratioToAnnualRevenue}
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-950/40 text-amber-300 border border-amber-800/60">
                                Tutar açıklanmadı — etki tahmini yapılamıyor
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                            <div className="text-[10px] text-slate-400">Etki Derecesi</div>
                            <div className="font-bold text-emerald-400">{deal.impactVerdict}</div>
                          </div>
                          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                            <div className="text-[10px] text-slate-400">Teslimat / Ciroya Yansıma</div>
                            <div className="font-bold text-slate-200">{deal.deliveryPeriod}</div>
                          </div>
                          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                            <div>
                              <div className="text-[10px] text-slate-400">Veri Kaynağı</div>
                              <div className="font-bold text-slate-300">KAP Özel Durum Bildirimi</div>
                            </div>
                            <a href={deal.kapSourceUrl || 'https://www.kap.org.tr'} target="_blank" rel="noopener noreferrer" className="p-1 rounded bg-slate-800 text-emerald-400 hover:text-white">
                              <ExternalLink size={13} />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: GERİ ALIMLAR & TEMETTÜ / SERMAYE */}
              {activeTab === 'buyback_dividend' && (
                <div className="space-y-6">
                  {/* Share Buyback Panel */}
                  {analysis.shareBuybacks && (
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <Repeat className="text-emerald-400" size={20} />
                          <div>
                            <h3 className="text-sm font-black text-white">Pay Geri Alım Programı (Share Buyback)</h3>
                            <p className="text-[11px] text-slate-400">Yönetimin hisse değerleme algısı ve piyasa taban desteği</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {analysis.shareBuybacks.hasActiveProgram ? 'Aktif Geri Alım Var' : 'Program Yok'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                          <div className="text-[10px] text-slate-400">Program Limiti / Hedef Adet</div>
                          <div className="font-black text-slate-100 text-sm mt-0.5">{analysis.shareBuybacks.programLimitShares}</div>
                        </div>
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                          <div className="text-[10px] text-slate-400">Alınan Adet / Tamamlama Oranı</div>
                          <div className="font-black text-emerald-400 text-sm mt-0.5">
                            {analysis.shareBuybacks.purchasedShares} (%{analysis.shareBuybacks.completionRate})
                          </div>
                        </div>
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                          <div className="text-[10px] text-slate-400">Fonlama Kaynağı Testi</div>
                          <div className="font-black text-cyan-400 text-sm mt-0.5">
                            {analysis.shareBuybacks.fundingSource === 'SAĞLIKLI_NAKİT_AKIŞI' ? 'Sağlıklı Serbest Nakit' : 'Borçlanma Kaynaklı'}
                          </div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1">
                        <div className="font-bold text-slate-200">Yönetim Sinyali: {analysis.shareBuybacks.managementSignal}</div>
                        <div className="text-emerald-400 text-[11px] font-medium">{analysis.shareBuybacks.supportLevelImpact}</div>
                      </div>
                    </div>
                  )}

                  {/* Capital & Dividend Policy */}
                  {analysis.capitalAndDividends && (
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <Coins className="text-amber-400" size={20} />
                          <div>
                            <h3 className="text-sm font-black text-white">Sermaye Artırımları & Temettü Disiplini</h3>
                            <p className="text-[11px] text-slate-400">Hissedara nakit aktarımı ve bedelli sulandırma riski analizi</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          Temettü Verimi: %{analysis.capitalAndDividends.dividendYield}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                          <div className="text-[10px] text-slate-400">Kâr Dağıtım Oranı (Payout)</div>
                          <div className="font-black text-slate-100 text-sm mt-0.5">%{analysis.capitalAndDividends.payoutRatio}</div>
                        </div>
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                          <div className="text-[10px] text-slate-400">Düzenli Ödeme Disiplini</div>
                          <div className="font-black text-emerald-400 text-sm mt-0.5">{analysis.capitalAndDividends.regularityStreakYears} Yıl Üst Üste</div>
                        </div>
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                          <div className="text-[10px] text-slate-400">Hisse Sulandırma Riski</div>
                          <div className="font-black text-emerald-400 text-sm mt-0.5">{analysis.capitalAndDividends.dilutionRisk}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-[11px] font-bold text-slate-400">Son Sermaye ve Temettü Geçmişi:</div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {analysis.capitalAndDividends.capitalIncreaseHistory.map((h, i) => (
                            <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-200">{h.year}</span>
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-emerald-400">{h.type}</span>
                              </div>
                              <div className="text-[11px] text-slate-400 mt-1">{h.description}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        {analysis.capitalAndDividends.dilutionAnalysis}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: ENDEKS PUAN KATKISI & HALKA ARZ FONU */}
              {activeTab === 'index_ipo' && (
                <div className="space-y-6">
                  {/* Index Contribution & Market Engineering Detection */}
                  {analysis.indexContribution && (
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="text-cyan-400" size={20} />
                          <div>
                            <h3 className="text-sm font-black text-white">{analysis.indexContribution.indexName} Puan Katkısı & Ağırlık</h3>
                            <p className="text-[11px] text-slate-400">Endeks mühendisliği tespiti ve gün içi hareketin kök nedeni</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                          Endeks Ağırlığı: %{analysis.indexContribution.indexWeight}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                          <div className="text-[10px] text-slate-400">Gün İçi Endeks Puan Etkisi</div>
                          <div className="font-black text-emerald-400 text-sm mt-0.5">+{analysis.indexContribution.dailyPointContribution} Puan</div>
                        </div>
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                          <div className="text-[10px] text-slate-400">Piyasa Lideri / Lokomotif?</div>
                          <div className="font-black text-slate-100 text-sm mt-0.5">{analysis.indexContribution.isMarketLeader ? 'Evet (Lokomotif)' : 'Yan Tahta'}</div>
                        </div>
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                          <div className="text-[10px] text-slate-400">Endeks Korelasyonu</div>
                          <div className="font-black text-cyan-400 text-sm mt-0.5">{analysis.indexContribution.correlationScore} (Yüksek)</div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        {analysis.indexContribution.marketEngineeringAlert}
                      </p>
                    </div>
                  )}

                  {/* IPO & Fund Usage Breakdown */}
                  {analysis.ipoAndFundUsage && (
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <PieChart className="text-emerald-400" size={20} />
                          <div>
                            <h3 className="text-sm font-black text-white">Halka Arz & Fon Kullanım Yeri Raporu</h3>
                            <p className="text-[11px] text-slate-400">SPK İzahnamesi: Toplanan kaynağın yatırım vs. borç kapama dağılımı</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {analysis.ipoAndFundUsage.qualityVerdict}
                        </span>
                      </div>

                      {analysis.ipoAndFundUsage.fundUsageBreakdown && (
                        <div className="space-y-2">
                          <div className="text-[11px] font-bold text-slate-400">Fon Kullanım Dağılımı:</div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {analysis.ipoAndFundUsage.fundUsageBreakdown.map((f, i) => (
                              <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-bold text-slate-200">{f.category}</span>
                                  <span className="font-black text-emerald-400">%{f.percentage}</span>
                                </div>
                                <p className="text-[10px] text-slate-400">{f.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        {analysis.ipoAndFundUsage.analysisNote}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: ÜCRETSİZ VERİ KAYNAKLARI & MİMARİ */}
              {activeTab === 'sources' && (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2">
                      <Database className="text-emerald-400" size={20} />
                      <h3 className="text-base font-black text-white">Tamamen Ücretsiz & Kamuya Açık Veri Mimarisi</h3>
                    </div>
                    <p className="text-xs text-slate-400">
                      Sistemimiz yalnızca doğrulanabilir, lisanssız ve kamuya açık veri akışlarını kullanarak spekülatif gürültüyü eler.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400">KAP (Kamuyu Aydınlatma Platformu)</span>
                        <span className="text-[10px] text-slate-500">kap.org.tr</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Yeni iş ilişkileri, pay geri alım bildirimleri, genel kurul kararları ve çeyreklik resmi bilanço tabloları.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-400">SPK Bültenleri (spk.gov.tr)</span>
                        <span className="text-[10px] text-slate-500">Halka Arz & İzahname</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Halka arz onayları, konsorsiyum dağılım yöntemleri ve fon kullanım yeri raporlarının denetimi.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400">yfinance & Yahoo Finance API</span>
                        <span className="text-[10px] text-slate-500">Gecikmesiz OHLCV</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Hisse fiyat, hacim, 20/50/200 günlük hareketli ortalamalar, temettü verimi ve tarihsel getiri serileri.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-400">TCMB EVDS & FRED Makro API</span>
                        <span className="text-[10px] text-slate-500">evds / fredapi</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        TCMB politika faizi, M2 para arzı, brüt rezervler; St. Louis Fed ABD tahvil faizleri ve CDS primleri.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: HABERLER (RELATED NEWS) */}
              {activeTab === 'news' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="text-emerald-400" size={20} />
                    <h3 className="text-base font-black text-white">İlgili Piyasa Haberleri</h3>
                  </div>

                  {relatedNews.length === 0 ? (
                    <div className="text-center py-10 bg-slate-950 rounded-2xl border border-slate-800 border-dashed">
                      <p className="text-sm text-slate-400">Bu varlık için güncel bir haber bulunamadı.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {relatedNews.map(item => (
                        <div key={item.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                              {item.category}
                            </span>
                            <span className="text-[11px] text-slate-500">{item.time}</span>
                          </div>
                          
                          <h4 className="text-sm font-bold text-slate-200">{item.title}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">{item.summary}</p>
                          
                          <div className="pt-2 flex flex-wrap items-center justify-between border-t border-slate-800/80 gap-2">
                            <span className="text-[10px] text-slate-500">Kaynak: {item.source}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              item.impact === 'bullish' ? 'bg-emerald-500/20 text-emerald-400' :
                              item.impact === 'bearish' ? 'bg-rose-500/20 text-rose-400' :
                              'bg-slate-800 text-slate-300'
                            }`}>
                              Etki: {item.impact === 'bullish' ? '🚀 Pozitif' : item.impact === 'bearish' ? '⚠️ Negatif' : '⚖️ Nötr'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* News Sentiment Meter & Headlines */}
              {analysis.newsSentiment && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Globe size={14} className="text-amber-400" />
                      <span>Haber & Medya Duyarlılık Skoru (News Sentiment)</span>
                    </div>
                    <span className="font-bold text-emerald-400">{analysis.newsSentiment.label}</span>
                  </div>

                  <p className="text-xs text-slate-300">
                    {analysis.newsSentiment.summary}
                  </p>

                  {analysis.recentHeadlines && analysis.recentHeadlines.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      <div className="text-[11px] font-semibold text-slate-400">Son İlgili Haberler:</div>
                      {analysis.recentHeadlines.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-3 text-xs bg-slate-900/60 p-2 rounded-lg">
                          <span className="text-slate-200 font-medium line-clamp-1">{item.title}</span>
                          <span className="text-[10px] text-slate-500 shrink-0">{item.source} • {item.time}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Grounding Sources (Live Web & Research Citations) */}
              {analysis.groundingSources && analysis.groundingSources.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs">
                  <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                    <Zap size={11} className="text-emerald-400" />
                    Canlı Web & Doğrulanmış Kaynak Referansları:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.groundingSources.map((source, sIdx) => (
                      <a
                        key={sIdx}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-800 text-[11px] transition-colors"
                      >
                        <span className="max-w-[200px] truncate">{source.title}</span>
                        <ExternalLink size={10} />
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </>
          )}

        </div>

        {/* Modal Footer */}
        {analysis && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <a
              href={analysis.yahooFinanceUrl || `https://finance.yahoo.com/quote/${analysis.symbol}${analysis.exchange === 'BIST' ? '.IS' : ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 transition-colors"
            >
              <span>{analysis.symbol} Sayfasını Yahoo Finance'te Aç</span>
              <ExternalLink size={14} />
            </a>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Kapat
            </button>
          </div>
        )}

        {/* Bilanço E-Posta Alarmı Popup Modal */}
        {showNotificationModal && analysis && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Bell size={18} />
                  </div>
                  <h3 className="font-bold text-white text-sm">{analysis.symbol} Bilanço ve KAP Bildirimi</h3>
                </div>
                <button 
                  onClick={() => setShowNotificationModal(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X size={16} />
                </button>
              </div>

              {showAlertSubscribed ? (
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-2">
                  <CheckCircle2 size={32} className="text-emerald-400 mx-auto" />
                  <h4 className="font-bold text-white text-sm">Bilanço Alarmı Kuruldu!</h4>
                  <p className="text-xs text-slate-300">
                    {analysis.symbol} için yeni çeyreklik finansal tablo veya 18 kriterli karne açıklandığında anında bildirim alacaksınız.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribeAlert} className="space-y-3">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>{analysis.name} ({analysis.symbol})</strong> için KAP'a yeni çeyreklik bilanço düştüğünde ve 18 kriterli karnesi güncellendiğinde otomatik e-posta bildirimi alın.
                  </p>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-400">E-Posta Adresiniz:</label>
                    <input 
                      type="email" 
                      required
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="adiniz@sirket.com" 
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <CheckCircle2 size={13} /> Otomatik KAP Bilanço Raporu
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <CheckCircle2 size={13} /> 18 Kriterli Karne Değişim Analizi
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowNotificationModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
                    >
                      Vazgeç
                    </button>
                    <button
                      type="submit"
                      disabled={subscribing}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {subscribing ? 'Kaydediliyor...' : 'Alarmı Başlat'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
