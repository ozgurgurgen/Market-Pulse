import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  TrendingUp, 
  Flame, 
  Sparkles, 
  Calendar, 
  Percent, 
  Scale, 
  Layers, 
  BookOpen, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Bookmark, 
  PieChart as PieIcon,
  HelpCircle,
  BarChart3,
  Clock,
  Users,
  Wallet
} from 'lucide-react';
import { TefasFundDetail } from '../types';
import { TefasFundComparisonChart } from './TefasAnalysis/TefasFundComparisonChart';
import { TefasFundRiskMetrics } from './TefasAnalysis/TefasFundRiskMetrics';
import { TefasFundAumTrend } from './TefasAnalysis/TefasFundAumTrend';
import { TefasFundOperationalInfo } from './TefasAnalysis/TefasFundOperationalInfo';
import { TefasFundPeerComparison } from './TefasAnalysis/TefasFundPeerComparison';

interface TefasFundDetailModalProps {
  fund: TefasFundDetail | null;
  isLoading: boolean;
  onClose: () => void;
  onAddToBacktest?: (fund: TefasFundDetail) => void;
  onToggleWatchlist?: (symbol: string, name: string, currentPrice: number, exchange: string) => void;
  isWatchlisted?: boolean;
  onSelectFund?: (code: string) => void;
}

type ModalTab = 'overview' | 'risk_aum' | 'operations_peers' | 'portfolio_strategy';

export const TefasFundDetailModal: React.FC<TefasFundDetailModalProps> = ({
  fund,
  isLoading,
  onClose,
  onAddToBacktest,
  onToggleWatchlist,
  isWatchlisted = false,
  onSelectFund
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('overview');

  if (!fund && !isLoading) return null;

  const getRiskColor = (risk: number) => {
    if (risk <= 2) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (risk <= 4) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (risk <= 6) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
  };

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'ENFLASYON KALKANI':
        return 'bg-emerald-500 text-slate-950';
      case 'YÜKSEK BÜYÜME':
        return 'bg-cyan-500 text-slate-950';
      case 'GÜÇLÜ AL':
        return 'bg-emerald-400 text-slate-950';
      case 'DENGELİ BİRİKİM':
        return 'bg-amber-400 text-slate-950';
      case 'KISA VADE LİKİT':
        return 'bg-blue-400 text-slate-950';
      default:
        return 'bg-slate-700 text-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-5xl w-full shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-start justify-between bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-cyan-500 p-0.5 shadow-lg shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-base text-emerald-400">
                {fund?.code || '...'}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-black text-white tracking-tight">
                  {fund?.name}
                </h2>
                {fund && (
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getVerdictBadge(fund.aiVerdict)}`}>
                    {fund.aiVerdict}
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5 flex-wrap">
                <span>{fund?.founder}</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">{fund?.categoryLabel}</span>
                <span>•</span>
                <span className="text-slate-500 font-mono">ISIN: TRY{fund?.code}0001</span>
              </div>
            </div>
          </div>
          <button
            id="close-tefas-modal-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        {fund && !isLoading && (
          <div className="px-6 border-b border-slate-800 bg-slate-950/40 flex items-center gap-2 overflow-x-auto shrink-0 py-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'overview'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 size={14} />
              <span>Genel Bakış &amp; Kıyaslama</span>
            </button>

            <button
              onClick={() => setActiveTab('risk_aum')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'risk_aum'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck size={14} />
              <span>Risk, Sharpe &amp; AUM Trendi</span>
            </button>

            <button
              onClick={() => setActiveTab('operations_peers')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'operations_peers'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Scale size={14} />
              <span>Yönetim Ücreti &amp; Akran Kıyaslama</span>
            </button>

            <button
              onClick={() => setActiveTab('portfolio_strategy')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'portfolio_strategy'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <PieIcon size={14} />
              <span>Varlık Dağılımı &amp; Strateji</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        {isLoading || !fund ? (
          <div className="p-16 text-center space-y-4 my-auto">
            <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="text-sm font-medium text-slate-300">TEFAS Fon Veritabanı ve Risk Metrikleri Hesaplanıyor...</div>
            <p className="text-xs text-slate-500">MKK ve Takasbank güncel verileri taranıyor</p>
          </div>
        ) : (
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            
            {/* Top Quick Stats Grid (Always Visible) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
                <div className="text-[11px] text-slate-500">Fon Pay Fiyatı</div>
                <div className="text-lg font-black text-slate-100 mt-0.5 font-mono">
                  ₺{fund.price.toLocaleString('tr-TR', { minimumFractionDigits: 3 })}
                </div>
                <div className={`text-xs font-bold font-mono ${fund.dailyReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {fund.dailyReturn >= 0 ? '+' : ''}{fund.dailyReturn}% (Günlük)
                </div>
              </div>

              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
                <div className="text-[11px] text-slate-500">1 Yıllık Net Getiri</div>
                <div className="text-lg font-black text-emerald-400 mt-0.5 font-mono">
                  +{fund.return1Y}%
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  3Y: +{fund.return3Y || Math.round(fund.return1Y * 2.8)}% • 5Y: +{fund.return5Y || Math.round(fund.return1Y * 5.2)}%
                </div>
              </div>

              <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/40 rounded-xl">
                <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <Flame size={12} /> Enflasyon Farkı (Reel)
                </div>
                <div className="text-lg font-black text-emerald-300 mt-0.5 font-mono">
                  +{fund.inflationBeat1Y}%
                </div>
                <div className="text-[10px] text-emerald-400/80">TÜFE karşısında net reel kazanç</div>
              </div>

              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
                <div className="text-[11px] text-slate-500">Risk Değeri &amp; Stopaj</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getRiskColor(fund.riskScore)}`}>
                    Risk: {fund.riskScore}/7
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    fund.withholdingTax === 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-300'
                  }`}>
                    %{fund.withholdingTax} Stopaj
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Alış: {fund.settlementBuy} • Satış: {fund.settlementSell} Valör
                </div>
              </div>
            </div>

            {/* TAB 1: GENEL BAKIŞ & KIYASLAMA */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* B1. İnteraktif Kıyaslama Grafiği */}
                <TefasFundComparisonChart fund={fund} />

                {/* AI Financial Literacy Intelligence Assessment Card */}
                <div className="p-4 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-cyan-950/30 border border-emerald-500/30 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-emerald-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Finansal Okuryazar Yapay Zeka Karne Notu
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Skor:</span>
                      <span className="text-sm font-black text-emerald-400 px-2.5 py-0.5 bg-emerald-950 border border-emerald-800 rounded-lg font-mono">
                        {fund.aiLiteracyScore}/100
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {fund.aiStrategyNote}
                  </p>
                  <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 text-xs text-slate-300 space-y-1">
                    <div className="font-semibold text-emerald-400">Yapay Zeka Analiz Gerekçesi:</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {fund.aiReasoning}
                    </p>
                  </div>
                </div>

                {/* Risk Preview Snippet */}
                <TefasFundRiskMetrics fund={fund} />
              </div>
            )}

            {/* TAB 2: RISK, SHARPE & AUM TRENDI */}
            {activeTab === 'risk_aum' && (
              <div className="space-y-6">
                {/* B2. Gelişmiş Risk & Verimlilik Metrikleri */}
                <TefasFundRiskMetrics fund={fund} />

                {/* B3. Fon Büyüklüğü (AUM) ve Yatırımcı Sayısı Trendi */}
                <TefasFundAumTrend fund={fund} />
              </div>
            )}

            {/* TAB 3: YÖNETİM ÜCRETİ & AKRAN KIYASLAMA */}
            {activeTab === 'operations_peers' && (
              <div className="space-y-6">
                {/* B4. Yıllık Yönetim Ücreti ve Operasyonel Bilgiler */}
                <TefasFundOperationalInfo fund={fund} />

                {/* B5. Kategori Akran Kıyaslaması */}
                <TefasFundPeerComparison 
                  fund={fund} 
                  onSelectFund={onSelectFund}
                />
              </div>
            )}

            {/* TAB 4: PORTFÖY VARLIK DAĞILIMI & STRATEJİ */}
            {activeTab === 'portfolio_strategy' && (
              <div className="space-y-6">
                {/* Asset Allocation Breakdown */}
                <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl shadow-xl space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <PieIcon size={14} className="text-cyan-400" />
                    Fon Portföy Varlık Dağılımı
                  </h3>

                  {/* Progress bar */}
                  <div className="h-3.5 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                    {fund.assetAllocation.map((asset, i) => (
                      <div
                        key={i}
                        style={{ width: `${asset.ratio}%`, backgroundColor: asset.color }}
                        title={`${asset.label}: %${asset.ratio}`}
                        className="h-full transition-all"
                      />
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    {fund.assetAllocation.map((asset, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-slate-300">
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: asset.color }} />
                        <span>{asset.label}</span>
                        <span className="font-bold text-slate-100 font-mono">(%{asset.ratio})</span>
                      </div>
                    ))}
                  </div>

                  {/* Top Holdings */}
                  {fund.topHoldings && fund.topHoldings.length > 0 && (
                    <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center gap-2 flex-wrap text-xs mt-3">
                      <span className="text-slate-400 font-medium">Öne Çıkan Portföy Varlıkları:</span>
                      {fund.topHoldings.map((h, i) => (
                        <span key={i} className="px-2.5 py-1 bg-slate-800 border border-slate-700/80 rounded-lg font-semibold text-slate-200">
                          {h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Inflation Protection Simulation (Purchasing Power) */}
                <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl shadow-xl space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    Enflasyon Karşısında Satınalma Gücü Simülasyonu
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {fund.inflationSimulation.map((sim, i) => (
                      <div key={i} className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-300">{sim.period}</span>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                            {sim.purchasingPowerProtection}
                          </span>
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between text-slate-400">
                            <span>Fon Getirisi:</span>
                            <span className="font-bold text-slate-200 font-mono">+{sim.nominalFundGain}%</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>Kümülatif TÜFE:</span>
                            <span className="text-rose-400 font-medium font-mono">%{sim.inflationRate}</span>
                          </div>
                          <div className="flex justify-between pt-1 border-t border-slate-800 font-bold">
                            <span className="text-emerald-400">Net Reel Kazanç:</span>
                            <span className="text-emerald-300 font-mono">+{sim.netRealGain}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Literacy Guide (Pros & Cons) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Pros & Advantages */}
                  <div className="p-4 bg-emerald-950/10 border border-emerald-900/40 rounded-2xl space-y-2">
                    <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle size={14} /> Güçlü Yönler &amp; Avantajlar
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {fund.aiLiteracyDeepReport.pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cons & Risk Points */}
                  <div className="p-4 bg-amber-950/10 border border-amber-900/40 rounded-2xl space-y-2">
                    <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <AlertCircle size={14} /> Risk Faktörleri &amp; Dikkat Edilecekler
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {fund.aiLiteracyDeepReport.cons.map((con, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Suitability & Tax Strategy Advice */}
                <div className="p-5 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-3">
                  <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <BookOpen size={14} /> Finansal Strateji ve Alım Taktikleri
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                      <span className="text-slate-400 font-medium block">Kime / Hangi Profile Uygundur?</span>
                      <p className="text-slate-200 mt-1 leading-relaxed">{fund.aiLiteracyDeepReport.suitability}</p>
                    </div>

                    <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                      <span className="text-slate-400 font-medium block">Vergi ve Stopaj Avantajı:</span>
                      <p className="text-slate-200 mt-1 leading-relaxed">{fund.aiLiteracyDeepReport.taxAdvice}</p>
                    </div>

                    <div className="sm:col-span-2 p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                      <span className="text-slate-400 font-medium block">İdeal Birikim &amp; Alım Metodu (DCA):</span>
                      <p className="text-slate-200 mt-1 leading-relaxed">{fund.aiLiteracyDeepReport.idealEntryExitStrategy}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500 text-center sm:text-left">
            * TEFAS fonları tüm Türk bankalarından ve aracı kurumlardan serbestçe alınıp satılabilir.
          </div>
          <div className="flex items-center gap-2">
            {fund && onToggleWatchlist && (
              <button
                type="button"
                onClick={() => onToggleWatchlist(fund.code, fund.name, fund.price, 'TEFAS')}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isWatchlisted
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                <Bookmark size={14} />
                <span>{isWatchlisted ? 'Listede' : 'İzlemeye Al'}</span>
              </button>
            )}

            {fund && onAddToBacktest && (
              <button
                type="button"
                id="add-fund-to-backtest-btn"
                onClick={() => {
                  onAddToBacktest(fund);
                  onClose();
                }}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={15} />
                <span>Backtest'e Ekle</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
