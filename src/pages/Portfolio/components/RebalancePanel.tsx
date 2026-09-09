import React, { useState, useEffect, useMemo } from 'react';
import {
  Scale,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Send,
  Sliders,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Info,
  Layers,
} from 'lucide-react';
import { PortfolioHoldingSnapshot } from '../../../types';
import {
  calculateRebalance,
  generatePresetTargets,
  generateRebalanceTelegramMessage,
  RebalanceOrder,
  RebalanceSummary,
} from '../utils/rebalanceCalculator';
import { safeFetchJson } from '../../../utils/apiClient';

interface RebalancePanelProps {
  portfolioId: string;
  portfolioName: string;
  holdings: PortfolioHoldingSnapshot[];
  baseCurrency?: string;
  onRefreshPortfolio?: () => void;
  onAddTransaction?: (tx: {
    type: 'buy' | 'sell';
    symbol: string;
    quantity: number;
    price: number;
    amount: number;
    date: string;
    notes?: string;
  }) => Promise<void>;
}

export const RebalancePanel: React.FC<RebalancePanelProps> = ({
  portfolioId,
  portfolioName,
  holdings,
  baseCurrency = 'TRY',
  onRefreshPortfolio,
  onAddTransaction,
}) => {
  // Threshold setting (default 5%)
  const [thresholdPct, setThresholdPct] = useState<number>(() => {
    const saved = localStorage.getItem(`rebalance_threshold_${portfolioId}`);
    return saved ? parseFloat(saved) : 5.0;
  });

  // Target weights (ticker -> weight 0-100)
  const [targets, setTargets] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem(`rebalance_targets_${portfolioId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return generatePresetTargets(holdings, 'CURRENT');
  });

  // Re-sync targets if holdings change and no saved targets
  useEffect(() => {
    const saved = localStorage.getItem(`rebalance_targets_${portfolioId}`);
    if (!saved && holdings.length > 0) {
      setTargets(generatePresetTargets(holdings, 'CURRENT'));
    }
  }, [holdings, portfolioId]);

  // Status message
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isSendingTelegram, setIsSendingTelegram] = useState(false);

  // Save targets to localStorage
  const handleSaveConfig = () => {
    localStorage.setItem(`rebalance_threshold_${portfolioId}`, thresholdPct.toString());
    localStorage.setItem(`rebalance_targets_${portfolioId}`, JSON.stringify(targets));
    setStatusMessage({ type: 'success', text: 'Hedef dağılım ve sapma eşiği başarıyla kaydedildi.' });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Change single target weight
  const handleTargetChange = (ticker: string, value: number) => {
    setTargets(prev => ({
      ...prev,
      [ticker]: Math.max(0, Math.min(100, value)),
    }));
  };

  // Apply preset
  const handleApplyPreset = (preset: 'EQUAL' | 'CURRENT' | 'BALANCED' | 'EQUITY_HEAVY' | 'DEFENSIVE') => {
    const newTargets = generatePresetTargets(holdings, preset);
    setTargets(newTargets);
    setStatusMessage({ type: 'info', text: `"${preset}" hedef dağılım şablonu uygulandı.` });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Auto-normalize targets to 100%
  const handleNormalize = () => {
    const sum = Object.values(targets).reduce((s, w) => s + (w || 0), 0);
    if (sum === 0) return;
    const normalized: Record<string, number> = {};
    for (const [ticker, w] of Object.entries(targets)) {
      normalized[ticker] = Number(((w / sum) * 100).toFixed(1));
    }
    setTargets(normalized);
    setStatusMessage({ type: 'info', text: 'Hedef oranlar toplamı %100 olarak eşitlendi.' });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Calculate summary
  const summary: RebalanceSummary = useMemo(() => {
    return calculateRebalance(holdings, targets, thresholdPct);
  }, [holdings, targets, thresholdPct]);

  // Check target sum
  const targetSum = useMemo(() => {
    return Number(Object.values(targets).reduce((s, w) => s + (w || 0), 0).toFixed(1));
  }, [targets]);

  // Send Telegram Rebalance Alert
  const handleSendTelegram = async () => {
    setIsSendingTelegram(true);
    try {
      const tgConfigRaw = localStorage.getItem('portfolio_telegram_config');
      if (!tgConfigRaw) {
        setStatusMessage({
          type: 'error',
          text: 'Telegram bot token veya chat ID bulunamadı. Lütfen üstteki zil simgesinden Telegram ayarlarınızı yapın.',
        });
        setIsSendingTelegram(false);
        return;
      }
      const tgConfig = JSON.parse(tgConfigRaw);
      if (!tgConfig.botToken || !tgConfig.chatId) {
        setStatusMessage({
          type: 'error',
          text: 'Telegram bilgileri eksik. Lütfen Telegram bildirim ayarlarını güncelleyin.',
        });
        setIsSendingTelegram(false);
        return;
      }

      const message = generateRebalanceTelegramMessage(summary, portfolioName);
      const { data, error } = await safeFetchJson<{ success: boolean; error?: string }>('/api/portfolio/telegram/test', {
        method: 'POST',
        body: JSON.stringify({
          botToken: tgConfig.botToken,
          chatId: tgConfig.chatId,
          message,
        }),
      });

      if (error || !data?.success) {
        setStatusMessage({ type: 'error', text: `Telegram uyarısı gönderilemedi: ${error || data?.error}` });
      } else {
        setStatusMessage({ type: 'success', text: 'Rebalance durum uyarısı Telegram kanalınıza başarıyla gönderildi!' });
      }
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: `Hata oluştu: ${e.message}` });
    } finally {
      setIsSendingTelegram(false);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  // Execute Rebalancing Orders
  const handleExecuteRebalance = async () => {
    if (!onAddTransaction) {
      setStatusMessage({ type: 'error', text: 'İşlem yürütme arayüzü bağlanamadı.' });
      return;
    }

    const driftedOrders = summary.orders.filter(o => o.isDrifted && o.action !== 'HOLD' && o.orderQuantity > 0);
    if (driftedOrders.length === 0) {
      setStatusMessage({ type: 'info', text: 'Yürütülecek dengeleme emri bulunmamaktadır.' });
      return;
    }

    const confirmMsg = `${driftedOrders.length} adet dengeleme işlemini portföye uygulamak istediğinize emin misiniz?\n\n` +
      driftedOrders.map(o => `${o.action === 'SELL' ? 'SAT' : 'AL'}: ${o.orderQuantity} ${o.ticker} (~${Math.round(o.orderValue).toLocaleString('tr-TR')} ${baseCurrency})`).join('\n');

    if (!confirm(confirmMsg)) return;

    setIsApplying(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      for (const order of driftedOrders) {
        await onAddTransaction({
          type: order.action === 'SELL' ? 'sell' : 'buy',
          symbol: order.ticker,
          quantity: order.orderQuantity,
          price: order.currentPrice,
          amount: Math.round(order.orderValue),
          date: today,
          notes: `Otomatik Rebalance: Hedef %${order.targetWeight} seviyesine dengeleme`,
        });
      }

      setStatusMessage({ type: 'success', text: `${driftedOrders.length} adet dengeleme işlemi başarıyla kaydedildi ve portföy güncellendi!` });
      if (onRefreshPortfolio) onRefreshPortfolio();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `İşlemler uygulanırken hata: ${err.message}` });
    } finally {
      setIsApplying(false);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  const currencySymbol = baseCurrency === 'USD' ? '$' : '₺';

  return (
    <div className="space-y-6">
      {/* 1. Üst Başlık & Kontrol Çubuğu */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md shadow-amber-950/30">
              <Scale size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight">Otomatik Rebalance & Eşik Uyarıları</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-extrabold uppercase">
                  Drift Guard v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Hedef portföy ağırlıklarınızı tanımlayın, tolerans sapmalarını canlı izleyin ve otomatik dengeleme emirleri üretin.
              </p>
            </div>
          </div>

          {/* Eşik Değeri Seçici & Aksiyon Butonları */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
              <span className="text-slate-400 font-medium">Sapma Eşiği:</span>
              {[2, 5, 10].map(val => (
                <button
                  key={val}
                  onClick={() => setThresholdPct(val)}
                  className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    thresholdPct === val
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ±%{val}
                </button>
              ))}
            </div>

            <button
              onClick={handleSaveConfig}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Hedef dağılımı ve eşiği kaydet"
            >
              <Sliders size={14} className="text-amber-400" />
              Ayarları Kaydet
            </button>

            <button
              onClick={handleSendTelegram}
              disabled={isSendingTelegram}
              className="px-3.5 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Telegram botuna dengeleme durumu gönder"
            >
              <Send size={14} className={isSendingTelegram ? 'animate-spin' : ''} />
              Telegram Uyarısı
            </button>
          </div>
        </div>

        {/* Durum Mesajı */}
        {statusMessage && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : statusMessage.type === 'error'
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
            }`}
          >
            <Info size={15} />
            {statusMessage.text}
          </div>
        )}

        {/* 2. Özet Metrik Kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Portföy Değeri</span>
            <div className="text-xl font-black text-white mt-1">
              {currencySymbol}{Math.round(summary.totalPortfolioValue).toLocaleString('tr-TR')}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">{holdings.length} Aktif Varlık</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Dengeleme Durumu</span>
            <div className="flex items-center gap-2 mt-1">
              {summary.hasDrift ? (
                <>
                  <AlertTriangle size={20} className="text-amber-400" />
                  <span className="text-lg font-black text-amber-400">{summary.driftedCount} Varlık Saptı</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} className="text-emerald-400" />
                  <span className="text-lg font-black text-emerald-400">Portföy Dengede</span>
                </>
              )}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Tolerans Sınırı: ±%{summary.thresholdPct}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Gereken Satış Hacmi</span>
            <div className="text-xl font-black text-rose-400 mt-1">
              {currencySymbol}{Math.round(summary.totalSellValue).toLocaleString('tr-TR')}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Aşırı ağırlıklı varlıkların satışı</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Gereken Alış Hacmi</span>
            <div className="text-xl font-black text-emerald-400 mt-1">
              {currencySymbol}{Math.round(summary.totalBuyValue).toLocaleString('tr-TR')}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Eksik ağırlıklı varlıkların alımı</span>
          </div>
        </div>
      </div>

      {/* 3. Hedef Dağılım Belirleme ve Ayarlama Kartı */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-sm font-black text-white tracking-tight flex items-center gap-2">
              <Sliders size={16} className="text-amber-400" />
              Hedef Portföy Ağırlıkları
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Her bir varlık için hedef ağırlığı (%) ayarlayın. Toplam hedefin %100 olması önerilir.
            </p>
          </div>

          {/* Hızlı Şablonlar (Presets) */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-500 font-semibold mr-1">Şablonlar:</span>
            <button
              onClick={() => handleApplyPreset('EQUAL')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
            >
              Eşit Dağıt
            </button>
            <button
              onClick={() => handleApplyPreset('CURRENT')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
            >
              Mevcutu Koru
            </button>
            <button
              onClick={() => handleApplyPreset('BALANCED')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
            >
              Dengeli
            </button>
            <button
              onClick={() => handleApplyPreset('EQUITY_HEAVY')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
            >
              Hisse Yoğun (%70)
            </button>
            <button
              onClick={() => handleApplyPreset('DEFENSIVE')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
            >
              Defansif / Fon
            </button>
          </div>
        </div>

        {/* Toplam Ağırlık Uyarısı / Normalize */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/40 border border-slate-800 mb-5">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Toplam Hedef Ağırlık:</span>
            <span
              className={`font-black px-2 py-0.5 rounded-md ${
                Math.abs(targetSum - 100) < 0.5
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              %{targetSum}
            </span>
            {Math.abs(targetSum - 100) >= 0.5 && (
              <span className="text-amber-400/90 text-[11px]">
                (Hedef toplamı %100 değil, hesaplamada otomatik oranlanacaktır)
              </span>
            )}
          </div>

          {Math.abs(targetSum - 100) >= 0.5 && (
            <button
              onClick={handleNormalize}
              className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 font-bold transition-all cursor-pointer"
            >
              %100'e Eşitle
            </button>
          )}
        </div>

        {/* Varlık Ağırlık Çubukları & Sliders */}
        <div className="space-y-4">
          {summary.orders.map(order => {
            const currentW = order.currentWeight;
            const targetW = targets[order.ticker] ?? order.targetWeight;
            const drift = order.driftPct;
            const isDrifted = order.isDrifted;

            return (
              <div
                key={order.ticker}
                className={`p-4 rounded-2xl border transition-all ${
                  isDrifted
                    ? 'bg-slate-800/50 border-amber-500/30'
                    : 'bg-slate-800/20 border-slate-800/80'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-black text-white text-sm tracking-tight">{order.ticker}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-semibold">
                      {order.assetClass || 'VARLIK'}
                    </span>
                    {order.name && (
                      <span className="text-xs text-slate-400 hidden sm:inline truncate max-w-xs">{order.name}</span>
                    )}
                  </div>

                  {/* Sapma Rozeti */}
                  <div className="flex items-center gap-2">
                    {isDrifted ? (
                      <span
                        className={`text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 ${
                          drift > 0
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {drift > 0 ? (
                          <>
                            <TrendingUp size={13} /> Aşırı Ağırlık (+%{drift})
                          </>
                        ) : (
                          <>
                            <TrendingDown size={13} /> Düşük Ağırlık (%{drift})
                          </>
                        )}
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 font-medium">
                        Dengede (%{drift > 0 ? `+${drift}` : drift})
                      </span>
                    )}
                  </div>
                </div>

                {/* Karşılaştırma Çubukları: Mevcut vs Hedef */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mt-3">
                  {/* Görsel Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Mevcut: <strong className="text-white">%{currentW}</strong> ({currencySymbol}{Math.round(order.currentValue).toLocaleString('tr-TR')})</span>
                      <span>Hedef: <strong className="text-amber-400">%{targetW}</strong></span>
                    </div>

                    <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden relative">
                      {/* Mevcut Ağırlık Barı */}
                      <div
                        className={`h-full transition-all duration-300 ${
                          isDrifted ? (drift > 0 ? 'bg-rose-500' : 'bg-emerald-500') : 'bg-slate-400'
                        }`}
                        style={{ width: `${Math.min(100, currentW)}%` }}
                      />
                      {/* Hedef Marker Çizgisi */}
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-amber-400 z-10"
                        style={{ left: `${Math.min(99, targetW)}%` }}
                        title={`Hedef: %${targetW}`}
                      />
                    </div>
                  </div>

                  {/* Slider ve Manuel Input */}
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="0.5"
                      value={targetW}
                      onChange={(e) => handleTargetChange(order.ticker, parseFloat(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg appearance-none"
                    />
                    <div className="flex items-center gap-1 w-20 shrink-0">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.5"
                        value={targetW}
                        onChange={(e) => handleTargetChange(order.ticker, parseFloat(e.target.value) || 0)}
                        className="w-16 bg-slate-800 border border-slate-700 text-amber-400 font-bold text-xs px-2 py-1 rounded-lg text-right focus:outline-none focus:border-amber-400"
                      />
                      <span className="text-xs text-slate-400 font-bold">%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Dengeleme Emirleri ve Eylemler Tablosu */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-sm font-black text-white tracking-tight flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-400" />
              Önerilen Dengeleme Emirleri & Eylemler
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Portföyü belirlenen hedef ağırlıklara getirmek için uygulanması gereken minimum işlem hacimli al/sat emirleri.
            </p>
          </div>

          {summary.hasDrift && onAddTransaction && (
            <button
              onClick={handleExecuteRebalance}
              disabled={isApplying}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-emerald-950/40 cursor-pointer"
            >
              <RefreshCw size={14} className={isApplying ? 'animate-spin' : ''} />
              Dengeleme İşlemlerini Portföye Uygula
            </button>
          )}
        </div>

        {summary.orders.filter(o => o.isDrifted).length === 0 ? (
          <div className="text-center py-10 px-4 bg-slate-800/20 border border-slate-800/80 rounded-2xl">
            <CheckCircle2 size={36} className="mx-auto text-emerald-400 mb-2" />
            <h4 className="text-sm font-bold text-white">Tüm Varlıklar Tolerans Sınırları İçinde</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Portföyünüz belirlenen ±%{summary.thresholdPct} tolerans aralığında dengeli durumdadır. Herhangi bir alım ya da satım yapmanıza gerek yoktur.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3 pl-2">Varlık</th>
                  <th className="pb-3">İşlem Eylemi</th>
                  <th className="pb-3 text-right">Adet</th>
                  <th className="pb-3 text-right">Birim Fiyat</th>
                  <th className="pb-3 text-right">İşlem Tutarı</th>
                  <th className="pb-3 text-right">Mevcut Ağırlık</th>
                  <th className="pb-3 text-right">İşlem Sonrası</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {summary.orders.map(order => {
                  if (!order.isDrifted || order.action === 'HOLD') return null;

                  return (
                    <tr key={order.ticker} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 pl-2">
                        <div className="font-black text-white text-xs">{order.ticker}</div>
                        <div className="text-[10px] text-slate-500">{order.assetClass}</div>
                      </td>

                      <td className="py-3">
                        {order.action === 'SELL' ? (
                          <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 font-black text-xs inline-flex items-center gap-1">
                            <TrendingDown size={13} /> SAT
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-black text-xs inline-flex items-center gap-1">
                            <TrendingUp size={13} /> AL
                          </span>
                        )}
                      </td>

                      <td className="py-3 text-right font-bold text-white">
                        {order.orderQuantity.toLocaleString('tr-TR')} adet
                      </td>

                      <td className="py-3 text-right text-slate-300">
                        {currencySymbol}{order.currentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-3 text-right font-black text-white">
                        {currencySymbol}{Math.round(order.orderValue).toLocaleString('tr-TR')}
                      </td>

                      <td className="py-3 text-right text-slate-400 font-semibold">
                        %{order.currentWeight}
                      </td>

                      <td className="py-3 text-right font-black text-amber-400">
                        %{order.projectedWeight} (Hedef: %{order.targetWeight})
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
