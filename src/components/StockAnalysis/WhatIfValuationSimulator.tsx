import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  RotateCcw, 
  Sliders, 
  Target, 
  HelpCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { AcademyTooltip } from '../AcademyTooltip';
import { useSubscription } from '../../hooks/useSubscription';
import { FeatureLockOverlay } from '../Subscription/FeatureLockOverlay';

interface WhatIfValuationSimulatorProps {
  symbol: string;
  currentPrice: number;
  aiFairValue?: number;
  basePE?: number;
}

export const WhatIfValuationSimulator: React.FC<WhatIfValuationSimulatorProps> = ({
  symbol,
  currentPrice,
  aiFairValue = currentPrice * 1.25,
  basePE = 9.5
}) => {
  const { isFeatureLocked, openPricingModal } = useSubscription();
  const isLocked = isFeatureLocked('whatIfSimulator');

  // Input states
  const [profitGrowth, setProfitGrowth] = useState<number>(30); // %30 default growth
  const [targetPE, setTargetPE] = useState<number>(basePE || 10.0); // Target P/E multiple
  const [marginDelta, setMarginDelta] = useState<number>(0); // 0% margin change

  // Base calculated EPS
  const currentEPS = useMemo(() => {
    const pe = basePE > 0 ? basePE : 10;
    return currentPrice / pe;
  }, [currentPrice, basePE]);

  // Simulation calculation
  const simulationResult = useMemo(() => {
    const futureEPS = currentEPS * (1 + profitGrowth / 100) * (1 + marginDelta / 100);
    const targetPrice = Number((futureEPS * targetPE).toFixed(2));
    const potentialReturn = Number((((targetPrice - currentPrice) / currentPrice) * 100).toFixed(1));
    const isUpside = potentialReturn >= 0;

    return {
      futureEPS: Number(futureEPS.toFixed(2)),
      targetPrice,
      potentialReturn,
      isUpside
    };
  }, [currentEPS, profitGrowth, marginDelta, targetPE, currentPrice]);

  // Quick Preset Scenarios
  const applyScenario = (type: 'BEAR' | 'BASE' | 'BULL') => {
    if (type === 'BEAR') {
      setProfitGrowth(10);
      setTargetPE(Math.max(4, Number((basePE * 0.8).toFixed(1))));
      setMarginDelta(-2);
    } else if (type === 'BASE') {
      setProfitGrowth(30);
      setTargetPE(Number(basePE.toFixed(1)));
      setMarginDelta(0);
    } else if (type === 'BULL') {
      setProfitGrowth(60);
      setTargetPE(Number((basePE * 1.35).toFixed(1)));
      setMarginDelta(3);
    }
  };

  const handleReset = () => {
    setProfitGrowth(30);
    setTargetPE(basePE || 10.0);
    setMarginDelta(0);
  };

  return (
    <FeatureLockOverlay
      isLocked={isLocked}
      requiredTier="pro"
      title="What-If Senaryo Değerleme Simülatörü"
      description="Kendi kâr büyümesi ve F/K varsayımlarınızla 12 aylık dinamik hedef fiyat modellemesi yapmak için Pro pakete geçin."
      badgeLabel="PRO PAKET ÖZELLİĞİ"
      onUpgradeClick={() => openPricingModal('What-If Senaryo Simülatörü', 'pro')}
    >
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
      {/* Header & Scenario Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
            <Sliders size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-white">{symbol} "What-If" Hedef Fiyat Simülatörü</h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Dinamik Model
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Kendi kâr büyümesi ve F/K çarpanı varsayımlarınızla 12 aylık adil fiyatı hesaplayın
            </p>
          </div>
        </div>

        {/* Preset Scenario Buttons */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => applyScenario('BEAR')}
            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-rose-300 border border-slate-800 cursor-pointer transition"
          >
            Ayı Senaryosu
          </button>
          <button
            type="button"
            onClick={() => applyScenario('BASE')}
            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 cursor-pointer transition"
          >
            Baz Senaryo
          </button>
          <button
            type="button"
            onClick={() => applyScenario('BULL')}
            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-800 cursor-pointer transition"
          >
            Boğa Senaryosu
          </button>
          <button
            type="button"
            onClick={handleReset}
            title="Sıfırla"
            className="p-1 text-slate-500 hover:text-slate-300 transition cursor-pointer"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Main Grid: Sliders on Left, Live Result on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Sliders Area (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Slider 1: Expected Profit Growth */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-bold flex items-center gap-1">
                Yıllık Kâr Büyüme Beklentisi (%)
              </span>
              <span className={`font-mono font-bold text-xs ${profitGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {profitGrowth >= 0 ? `+${profitGrowth}%` : `${profitGrowth}%`}
              </span>
            </div>
            <input 
              type="range"
              min="-20"
              max="120"
              step="5"
              value={profitGrowth}
              onChange={(e) => setProfitGrowth(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-%20 (Daralma)</span>
              <span>+%30 (Ortalama)</span>
              <span>+%120 (Hiper Büyüme)</span>
            </div>
          </div>

          {/* Slider 2: Target P/E Multiple */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-bold flex items-center gap-1">
                <AcademyTooltip term="pe">Hedef F/K Çarpanı</AcademyTooltip> (x)
              </span>
              <span className="font-mono font-bold text-xs text-purple-400">
                {targetPE.toFixed(1)}x
              </span>
            </div>
            <input 
              type="range"
              min="3.0"
              max="35.0"
              step="0.5"
              value={targetPE}
              onChange={(e) => setTargetPE(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>3.0x (Kelepir)</span>
              <span>Mevcut: {basePE.toFixed(1)}x</span>
              <span>35.0x (Pahalı/Büyüme)</span>
            </div>
          </div>

          {/* Slider 3: Net Profit Margin Delta */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-bold flex items-center gap-1">
                Net Kâr Marjı İyileşme/Kayıp (%)
              </span>
              <span className={`font-mono font-bold text-xs ${marginDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {marginDelta >= 0 ? `+${marginDelta}%` : `${marginDelta}%`}
              </span>
            </div>
            <input 
              type="range"
              min="-5"
              max="10"
              step="1"
              value={marginDelta}
              onChange={(e) => setMarginDelta(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-%5 (Baskılanma)</span>
              <span>%0 (Sabit)</span>
              <span>+%10 (Genişleme)</span>
            </div>
          </div>
        </div>

        {/* Live Calculation Output Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-purple-500/30 space-y-3">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
              <Target size={12} /> Simüle Edilen 12A Hedef Fiyat
            </span>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">₺{simulationResult.targetPrice}</span>
              <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                simulationResult.isUpside 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {simulationResult.isUpside ? `+${simulationResult.potentialReturn}%` : `${simulationResult.potentialReturn}%`}
              </span>
            </div>

            {/* Comparison Bars */}
            <div className="space-y-1.5 pt-2 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Mevcut Piyasa Fiyatı:</span>
                <span className="font-bold text-slate-200">₺{currentPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>AI Konsensüs Adil Değeri:</span>
                <span className="font-bold text-cyan-400">₺{aiFairValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tahmini EPS (Kâr/Hisse):</span>
                <span className="font-mono text-emerald-400">₺{simulationResult.futureEPS}</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-[11px] text-purple-200/90 leading-tight">
            {simulationResult.isUpside 
              ? `Bu senaryoya göre hissede %${simulationResult.potentialReturn} yükseliş potansiyeli (₺${(simulationResult.targetPrice - currentPrice).toFixed(2)} kazanç) hesaplanmaktadır.`
              : `Bu senaryoya göre mevcut fiyat hedef seviyenin üzerinde olup %${Math.abs(simulationResult.potentialReturn)} düzeltme riski taşımaktadır.`}
          </div>
        </div>
      </div>
    </div>
  </FeatureLockOverlay>
  );
};
export default WhatIfValuationSimulator;
