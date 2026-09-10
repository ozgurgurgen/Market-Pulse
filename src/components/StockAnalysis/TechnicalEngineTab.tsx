import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  ShieldAlert, 
  Info, 
  Sparkles, 
  Sliders, 
  RotateCcw, 
  Check, 
  AlertTriangle, 
  HelpCircle, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Layers, 
  Gauge, 
  Zap,
  CheckCheck
} from 'lucide-react';
import { safeFetchJson } from '../../utils/apiClient';
import { 
  TechnicalAnalysisResult, 
  TechnicalEngineParams, 
  TechnicalEnginePreset,
  AISignalInterpretationResult,
  SignalItemSummary
} from '../../types';
import { InteractiveStockPriceChart } from './InteractiveStockPriceChart';

interface TechnicalEngineTabProps {
  symbol: string;
  currentPrice: number;
  historicalChartData?: any[];
}

// Hazır Preset Değerleri (Frontend tarafı senkronize)
const PRESET_CONFIGS: Record<Exclude<TechnicalEnginePreset, 'CUSTOM'>, TechnicalEngineParams> = {
  SHORT_TERM: {
    preset: 'SHORT_TERM',
    fastMaPeriod: 9,
    mediumMaPeriod: 21,
    slowMaPeriod: 50,
    maType: 'EMA',
    rsiPeriod: 9,
    rsiOverbought: 75,
    rsiOversold: 25,
    macdFastPeriod: 6,
    macdSlowPeriod: 13,
    macdSignalPeriod: 5,
    bbPeriod: 14,
    bbStdDev: 2.0,
    atrPeriod: 10,
    riskRewardRatio: 2.0,
    volumeMultiplier: 1.3,
  },
  MEDIUM_TERM: {
    preset: 'MEDIUM_TERM',
    fastMaPeriod: 20,
    mediumMaPeriod: 50,
    slowMaPeriod: 200,
    maType: 'EMA',
    rsiPeriod: 14,
    rsiOverbought: 70,
    rsiOversold: 30,
    macdFastPeriod: 12,
    macdSlowPeriod: 26,
    macdSignalPeriod: 9,
    bbPeriod: 20,
    bbStdDev: 2.0,
    atrPeriod: 14,
    riskRewardRatio: 3.0,
    volumeMultiplier: 1.5,
  },
  LONG_TERM: {
    preset: 'LONG_TERM',
    fastMaPeriod: 50,
    mediumMaPeriod: 100,
    slowMaPeriod: 200,
    maType: 'SMA',
    rsiPeriod: 21,
    rsiOverbought: 65,
    rsiOversold: 35,
    macdFastPeriod: 19,
    macdSlowPeriod: 39,
    macdSignalPeriod: 9,
    bbPeriod: 30,
    bbStdDev: 2.5,
    atrPeriod: 20,
    riskRewardRatio: 4.0,
    volumeMultiplier: 2.0,
  }
};

const STORAGE_KEY_PREFIX = 'marketpulse_tech_params_';

export const TechnicalEngineTab: React.FC<TechnicalEngineTabProps> = ({ symbol, currentPrice, historicalChartData = [] }) => {
  // 1. Parametre Durumu
  const [params, setParams] = useState<TechnicalEngineParams>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}${symbol}`) || localStorage.getItem(`${STORAGE_KEY_PREFIX}default`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return PRESET_CONFIGS.MEDIUM_TERM;
  });

  const [activePreset, setActivePreset] = useState<TechnicalEnginePreset>(params.preset || 'MEDIUM_TERM');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // 2. Veri Durumları
  const [tech, setTech] = useState<TechnicalAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 3. AI Yorumlama Durumları
  const [aiInterpretation, setAiInterpretation] = useState<AISignalInterpretationResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Validasyon Kontrolleri
  const validationErrors = useMemo(() => {
    const errs: string[] = [];
    if (params.rsiOverbought <= params.rsiOversold) {
      errs.push('RSI Aşırı Alım eşiği, Aşırı Satım eşiğinden büyük olmalıdır.');
    }
    if (params.macdFastPeriod >= params.macdSlowPeriod) {
      errs.push('MACD Hızlı periyot, Yavaş periyottan küçük olmalıdır.');
    }
    if (params.fastMaPeriod >= params.mediumMaPeriod) {
      errs.push('Kısa MA periyodu, Orta MA periyodundan küçük olmalıdır.');
    }
    if (params.mediumMaPeriod >= params.slowMaPeriod) {
      errs.push('Orta MA periyodu, Uzun MA periyodundan küçük olmalıdır.');
    }
    return errs;
  }, [params]);

  // Teknik Veri Çekme Fonksiyonu
  const fetchTechnicalAnalysis = useCallback(async (currentParams: TechnicalEngineParams) => {
    setLoading(true);
    setError(null);

    const { data, ok, error: fetchErr } = await safeFetchJson<{ success: boolean; data: TechnicalAnalysisResult; paramHash: string }>(
      `/api/stock/${symbol}/technical`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentParams),
        timeout: 35000
      }
    );

    if (ok && data?.data) {
      setTech(data.data);
    } else {
      setError(fetchErr ? (typeof fetchErr === 'string' ? fetchErr : (fetchErr as any).message || 'Hata') : 'Teknik analiz hesaplanamadı.');
    }
    setLoading(false);
  }, [symbol]);

  // İlk yükleme ve sembol değişiminde çağır
  useEffect(() => {
    fetchTechnicalAnalysis(params);
    // Sembol değiştiğinde AI yorumunu sıfırla
    setAiInterpretation(null);
    setAiError(null);
  }, [symbol, fetchTechnicalAnalysis]);

  // Preset Değişimi
  const handlePresetSelect = (preset: TechnicalEnginePreset) => {
    setActivePreset(preset);
    if (preset === 'CUSTOM') {
      const updated: TechnicalEngineParams = { ...params, preset: 'CUSTOM' };
      setParams(updated);
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${symbol}`, JSON.stringify(updated));
      } catch {}
      return;
    }

    const newParams = { ...PRESET_CONFIGS[preset] };
    setParams(newParams);
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${symbol}`, JSON.stringify(newParams));
    } catch {}
    fetchTechnicalAnalysis(newParams);
    setAiInterpretation(null);
  };

  // Özel Parametre Değiştirme
  const handleParamChange = <K extends keyof TechnicalEngineParams>(field: K, value: TechnicalEngineParams[K]) => {
    setActivePreset('CUSTOM');
    setParams(prev => {
      const next = { ...prev, preset: 'CUSTOM' as const, [field]: value };
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${symbol}`, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Parametreleri Uygula Butonu
  const handleApplyCustomParams = () => {
    if (validationErrors.length === 0) {
      fetchTechnicalAnalysis(params);
      setAiInterpretation(null);
    }
  };

  // Sıfırlama Butonu
  const handleResetToDefault = () => {
    handlePresetSelect('MEDIUM_TERM');
  };

  // AI Sinyal Yorumlama Tetikleme
  const handleTriggerAiInterpretation = async () => {
    if (!tech) return;
    setAiLoading(true);
    setAiError(null);

    const { data, ok, error: aiErr } = await safeFetchJson<{ success: boolean; data: AISignalInterpretationResult }>(
      `/api/stock/${symbol}/interpret-signals`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          technicalData: tech,
          params
        }),
        timeout: 60000
      }
    );

    if (ok && data?.data) {
      setAiInterpretation(data.data);
    } else {
      setAiError(aiErr ? (typeof aiErr === 'string' ? aiErr : (aiErr as any).message || 'Hata') : 'AI sinyal yorumlama servisine ulaşılamadı.');
    }
    setAiLoading(false);
  };

  return (
    <div className="space-y-6">

      {/* Dinamik Teknik Sinyaller (Authentic Data) */}
      <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50 mb-6 mt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-500/20 rounded-xl">
            <Activity className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Gelişmiş Teknik Analiz & Gösterge Konsensüsü</h3>
            <p className="text-slate-400 text-sm">Gerçek zamanlı piyasa verilerinden hesaplanan teknik osilatörler</p>
          </div>
        </div>
        
        {tech ? (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Signal summary */}
            <div className="w-full md:w-1/3 flex flex-col items-center justify-center bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
              <Gauge className={`w-16 h-16 mb-4 ${tech.trendDirection?.includes('BULL') ? 'text-green-400' : tech.trendDirection?.includes('BEAR') ? 'text-red-400' : 'text-slate-400'}`} />
              <div className="text-sm text-slate-400 mb-1">Trend Yönü (Algoritma)</div>
              <div className={`text-4xl font-bold mb-2 ${tech.trendDirection?.includes('BULL') ? 'text-green-400' : tech.trendDirection?.includes('BEAR') ? 'text-red-400' : 'text-slate-400'}`}>
                {tech.trendDirection === 'STRONG_BULLISH' ? 'GÜÇLÜ AL' : tech.trendDirection === 'BULLISH' ? 'AL' : tech.trendDirection === 'STRONG_BEARISH' ? 'GÜÇLÜ SAT' : tech.trendDirection === 'BEARISH' ? 'SAT' : 'NÖTR'}
              </div>
              <div className="text-xs text-slate-500">{tech.signalsList?.length || 0} Gösterge Analizi</div>
            </div>
            
            <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {tech.signalsList?.map((sig, i) => (
                <div key={i} className="flex justify-between items-center border-b border-slate-700/50 pb-2">
                  <div className="flex flex-col">
                    <span className="text-slate-300 font-medium">{sig.name}</span>
                    <span className="text-[10px] text-slate-500">{sig.valueStr}</span>
                  </div>
                  <span className={`font-bold px-2 py-1 rounded text-xs ${
                    sig.condition === 'BULLISH' || sig.condition === 'OVERBOUGHT' ? 'bg-green-500/20 text-green-400' :
                    sig.condition === 'BEARISH' || sig.condition === 'OVERSOLD' ? 'bg-red-500/20 text-red-400' :
                    'bg-slate-700/50 text-slate-300'
                  }`}>
                    {sig.condition === 'BULLISH' ? 'AL' : 
                     sig.condition === 'BEARISH' ? 'SAT' : 
                     sig.condition === 'OVERBOUGHT' ? 'AŞIRI ALIM (SAT)' :
                     sig.condition === 'OVERSOLD' ? 'AŞIRI SATIM (AL)' :
                     'NÖTR'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500">
            {error || 'Teknik veriler yükleniyor...'}
          </div>
        )}
      </div>

      {/* 1. KONTROL ÇUBUĞU: Preset Seçici & Gelişmiş Parametre Düğmesi */}
      <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders size={14} className="text-indigo-400" />
              Teknik Analiz Motoru & Strateji Parametreleri
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              İndikatör periyotlarını yatırım vadenize göre özelleştirin veya hazır şablonları kullanın.
            </p>
          </div>

          {/* Preset Butonları */}
          <div className="flex items-center flex-wrap gap-1.5 bg-slate-950/70 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => handlePresetSelect('SHORT_TERM')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activePreset === 'SHORT_TERM'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              Kısa Vade (Scalp)
            </button>
            <button
              onClick={() => handlePresetSelect('MEDIUM_TERM')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activePreset === 'MEDIUM_TERM'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              Orta Vade (Swing)
            </button>
            <button
              onClick={() => handlePresetSelect('LONG_TERM')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activePreset === 'LONG_TERM'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              Uzun Vade (Trend)
            </button>
            <button
              onClick={() => setShowAdvancedSettings(prev => !prev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                activePreset === 'CUSTOM' || showAdvancedSettings
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sliders size={12} />
              Özel Ayarlar
              {showAdvancedSettings ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          </div>
        </div>

        {/* 1.1 AÇILIR GELİŞMİŞ PARAMETRE AYARLARI PANELİ */}
        {showAdvancedSettings && (
          <div className="pt-3 border-t border-slate-800/80 space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Hareketli Ortalamalar */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2.5">
                <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                  <TrendingUp size={13} />
                  Hareketli Ortalamalar
                </span>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Kısa MA ({params.fastMaPeriod})</span>
                      <span className="text-[10px] text-slate-500">[5-100]</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={100}
                      value={params.fastMaPeriod}
                      onChange={e => handleParamChange('fastMaPeriod', Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Orta MA ({params.mediumMaPeriod})</span>
                      <span className="text-[10px] text-slate-500">[10-200]</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={200}
                      value={params.mediumMaPeriod}
                      onChange={e => handleParamChange('mediumMaPeriod', Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Uzun MA ({params.slowMaPeriod})</span>
                      <span className="text-[10px] text-slate-500">[50-300]</span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={300}
                      value={params.slowMaPeriod}
                      onChange={e => handleParamChange('slowMaPeriod', Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* RSI Göstergesi */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2.5">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <Gauge size={13} />
                  RSI Momentum
                </span>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Periyot ({params.rsiPeriod})</span>
                      <span className="text-[10px] text-slate-500">[2-50]</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={50}
                      value={params.rsiPeriod}
                      onChange={e => handleParamChange('rsiPeriod', Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Aşırı Alım Eşiği ({params.rsiOverbought})</span>
                      <span className="text-[10px] text-slate-500">[50-95]</span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={95}
                      value={params.rsiOverbought}
                      onChange={e => handleParamChange('rsiOverbought', Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Aşırı Satım Eşiği ({params.rsiOversold})</span>
                      <span className="text-[10px] text-slate-500">[5-50]</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={50}
                      value={params.rsiOversold}
                      onChange={e => handleParamChange('rsiOversold', Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* MACD Ayarları */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2.5">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Activity size={13} />
                  MACD Parametreleri
                </span>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Hızlı EMA ({params.macdFastPeriod})</span>
                      <span className="text-[10px] text-slate-500">[2-50]</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={50}
                      value={params.macdFastPeriod}
                      onChange={e => handleParamChange('macdFastPeriod', Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Yavaş EMA ({params.macdSlowPeriod})</span>
                      <span className="text-[10px] text-slate-500">[5-100]</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={100}
                      value={params.macdSlowPeriod}
                      onChange={e => handleParamChange('macdSlowPeriod', Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Sinyal Periyodu ({params.macdSignalPeriod})</span>
                      <span className="text-[10px] text-slate-500">[2-50]</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={50}
                      value={params.macdSignalPeriod}
                      onChange={e => handleParamChange('macdSignalPeriod', Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Bollinger & ATR */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2.5">
                <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                  <Target size={13} />
                  Bollinger & Hedef (ATR)
                </span>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Bollinger Periyot ({params.bbPeriod})</span>
                      <span className="text-[10px] text-slate-500">[5-100]</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={100}
                      value={params.bbPeriod}
                      onChange={e => handleParamChange('bbPeriod', Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>ATR Periyot ({params.atrPeriod})</span>
                      <span className="text-[10px] text-slate-500">[2-50]</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={50}
                      value={params.atrPeriod}
                      onChange={e => handleParamChange('atrPeriod', Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Risk/Ödül Oranı (1:{params.riskRewardRatio})</span>
                      <span className="text-[10px] text-slate-500">[1-10]</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      step={0.5}
                      value={params.riskRewardRatio}
                      onChange={e => handleParamChange('riskRewardRatio', Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Validasyon Hataları Varsa Göster */}
            {validationErrors.length > 0 && (
              <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                  <AlertTriangle size={14} />
                  Geçersiz Parametre Ayarları:
                </div>
                {validationErrors.map((err, i) => (
                  <p key={i} className="text-xs text-rose-300 ml-5">• {err}</p>
                ))}
              </div>
            )}

            {/* Kontrol Butonları */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleResetToDefault}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 flex items-center gap-1.5 transition-all"
              >
                <RotateCcw size={13} />
                Varsayılanlara Sıfırla
              </button>

              <button
                onClick={handleApplyCustomParams}
                disabled={validationErrors.length > 0}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  validationErrors.length === 0
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Check size={14} />
                Özel Parametrelerle Yeniden Hesapla
              </button>
            </div>
          </div>
        )}
      </div>

      {/* YÜKLEME & HATA DURUMLARI */}
      {loading && (
        <div className="p-10 bg-slate-900/60 rounded-2xl border border-slate-800 text-center space-y-4">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-300 font-medium">
            {symbol} için seçilen parametre seti ({params.preset || 'Özel Ayar'}) ile teknik indikatörler hesaplanıyor...
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="p-6 bg-rose-950/30 border border-rose-500/30 rounded-2xl text-center space-y-2">
          <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
          <p className="text-sm text-slate-200">{error}</p>
          <button
            onClick={() => fetchTechnicalAnalysis(params)}
            className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-500"
          >
            Tekrar Dene
          </button>
        </div>
      )}

      {/* 2. TEKNİK ANALİZ SONUÇLARI */}
      {tech && !loading && (
        <div className="space-y-6">
          <InteractiveStockPriceChart 
            symbol={symbol}
            currentPrice={currentPrice}
            initialData={historicalChartData}
            techData={tech}
          />
          {/* 2.1 Header Motor Özeti */}
          <div className="p-5 bg-gradient-to-br from-indigo-950/50 via-slate-900/90 to-slate-900 rounded-2xl border border-indigo-500/30 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <Activity size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-slate-100 text-base">{symbol} — Parametrik Analiz Motoru</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    tech.trendDirection === 'STRONG_BULLISH' || tech.trendDirection === 'BULLISH'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : tech.trendDirection === 'STRONG_BEARISH' || tech.trendDirection === 'BEARISH'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : 'bg-slate-700/40 text-slate-300 border-slate-600/30'
                  }`}>
                    {tech.trendDirection === 'STRONG_BULLISH' ? 'GÜÇLÜ BOĞA TRENDİ' 
                      : tech.trendDirection === 'BULLISH' ? 'POZİTİF TREND' 
                      : tech.trendDirection === 'STRONG_BEARISH' ? 'GÜÇLÜ AYI BASKISI' 
                      : tech.trendDirection === 'BEARISH' ? 'NEGATİF EĞİLİM' 
                      : 'YÖNSÜZ / NÖTR'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
                    Preset: {params.preset || 'ÖZEL'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  RSI({params.rsiPeriod}): <strong className="text-slate-200">{tech.rsi}</strong> • {tech.macdStatus}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-400">Canlı Referans Fiyat</span>
                <div className="text-lg font-bold font-mono text-slate-100">{tech.currentPrice} ₺</div>
              </div>
              <div className="h-8 w-px bg-slate-800 hidden sm:block" />
              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-400">Pivot Seviyesi</span>
                <div className="text-lg font-bold font-mono text-indigo-300">{tech.pivotPoint} ₺</div>
              </div>
            </div>
          </div>

          {/* 2.2 SİNYAL ROZETLERİ (Signals List) */}
          {tech.signalsList && tech.signalsList.length > 0 && (
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} className="text-amber-400" />
                  Aktif Teknik Sinyal Rozetleri & Gösterge Kesişimleri
                </span>
                <span className="text-[11px] text-slate-500">
                  {tech.signalsList.length} İndikatör Değerlendirildi
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {tech.signalsList.map((sig, idx) => {
                  const isBull = sig.condition === 'BULLISH';
                  const isBear = sig.condition === 'BEARISH';
                  const isOverb = sig.condition === 'OVERBOUGHT';
                  const isOvers = sig.condition === 'OVERSOLD';

                  return (
                    <div 
                      key={idx} 
                      className={`p-3 rounded-xl border transition-all ${
                        isBull
                          ? 'bg-emerald-950/20 border-emerald-500/20'
                          : isBear
                          ? 'bg-rose-950/20 border-rose-500/20'
                          : isOverb
                          ? 'bg-amber-950/20 border-amber-500/20'
                          : isOvers
                          ? 'bg-cyan-950/20 border-cyan-500/20'
                          : 'bg-slate-950/40 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-200">{sig.name}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isBull ? 'bg-emerald-500/20 text-emerald-300' :
                          isBear ? 'bg-rose-500/20 text-rose-300' :
                          isOverb ? 'bg-amber-500/20 text-amber-300' :
                          isOvers ? 'bg-cyan-500/20 text-cyan-300' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {sig.condition}
                        </span>
                      </div>
                      <div className="text-xs font-mono font-bold text-slate-300 mb-1">{sig.valueStr}</div>
                      <p className="text-[11px] text-slate-400 leading-tight">{sig.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2.3 OTOMATİK DESTEK & DİRENÇ VE HEDEF BÖLGELERİ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Direnç Seviyeleri */}
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-sm text-emerald-400 flex items-center gap-1.5">
                  <TrendingUp size={16} />
                  Direnç & Hedef Seviyeleri (R)
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Yukarı Kırılım</span>
              </div>

              <div className="space-y-2">
                {tech.resistanceLevels.map((lvl, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-emerald-950/20 rounded-xl border border-emerald-500/20">
                    <span className="text-xs font-bold text-emerald-300">R{idx + 1} Direnci</span>
                    <span className="text-sm font-bold font-mono text-slate-100">{lvl} ₺</span>
                    <span className="text-[11px] font-mono text-emerald-400">
                      +{(((lvl - tech.currentPrice) / tech.currentPrice) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}

                {/* Dinamik ATR Hedefleri */}
                {tech.calculatedTarget1 && (
                  <div className="flex items-center justify-between p-2.5 bg-indigo-950/30 rounded-xl border border-indigo-500/20 mt-1">
                    <span className="text-xs font-bold text-indigo-300 flex items-center gap-1">
                      <Target size={13} />
                      ATR Hedefi (1:{params.riskRewardRatio})
                    </span>
                    <span className="text-sm font-bold font-mono text-indigo-200">{tech.calculatedTarget1} ₺</span>
                    <span className="text-[11px] font-mono text-indigo-400">
                      +{(((tech.calculatedTarget1 - tech.currentPrice) / tech.currentPrice) * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Destek Seviyeleri */}
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-sm text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert size={16} />
                  Destek & Savunma Hatları (S)
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Düzeltme Tabanı</span>
              </div>

              <div className="space-y-2">
                {tech.supportLevels.map((lvl, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-rose-950/20 rounded-xl border border-rose-500/20">
                    <span className="text-xs font-bold text-rose-300">S{idx + 1} Desteği</span>
                    <span className="text-sm font-bold font-mono text-slate-100">{lvl} ₺</span>
                    <span className="text-[11px] font-mono text-rose-400">
                      {(((lvl - tech.currentPrice) / tech.currentPrice) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}

                {/* Dinamik Stop-Loss */}
                {tech.calculatedStopLoss && (
                  <div className="flex items-center justify-between p-2.5 bg-rose-950/40 rounded-xl border border-rose-500/30 mt-1">
                    <span className="text-xs font-bold text-rose-300 flex items-center gap-1">
                      <ShieldAlert size={13} />
                      ATR Stop-Loss (1.5x ATR)
                    </span>
                    <span className="text-sm font-bold font-mono text-rose-200">{tech.calculatedStopLoss} ₺</span>
                    <span className="text-[11px] font-mono text-rose-400">
                      {(((tech.calculatedStopLoss - tech.currentPrice) / tech.currentPrice) * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 2.4 BOĞA VE AYI SENARYOLARI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-emerald-950/30 to-slate-900/80 rounded-2xl border border-emerald-500/30 shadow-md space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm pb-2 border-b border-emerald-500/20">
                <Sparkles size={16} />
                <span>Boğa (Yükseliş) Senaryosu</span>
              </div>
              <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
                {tech.bullishScenario}
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-rose-950/30 to-slate-900/80 rounded-2xl border border-rose-500/30 shadow-md space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm pb-2 border-b border-rose-500/20">
                <ShieldAlert size={16} />
                <span>Ayı (Savunma & Risk) Senaryosu</span>
              </div>
              <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
                {tech.bearishScenario}
              </p>
            </div>
          </div>

          {/* 2.5 HAREKETLİ ORTALAMA TABLOSU */}
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Hesaplanan Hareketli Ortalamalar (Trend Filtresi)
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {tech.movingAverages.map((ma) => (
                <div key={ma.name} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400">{ma.name}</span>
                  <div className="text-sm font-bold font-mono text-slate-100 mt-0.5">{ma.value} ₺</div>
                  <span className={`inline-block mt-1 text-[10px] font-bold ${
                    ma.status === 'ABOVE' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {ma.status === 'ABOVE' ? 'Fiyat Üzerinde (Boğa)' : 'Fiyat Altında (Ayı)'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. AI SİNYAL YORUMLAMA KATMANI (Eğitici & Tarafsız) */}
          <div className="p-5 bg-gradient-to-br from-indigo-950/30 via-slate-900/90 to-purple-950/30 rounded-2xl border border-indigo-500/30 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    AI Sinyal Yorumlama & İndikatör Okuryazarlığı
                    <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] rounded-full font-bold">
                      Eğitim Odaklı
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Hesaplanan bu sinyal kombinasyonunun teorik anlamını ve yatırımcının nelere dikkat etmesi gerektiğini öğrenin.
                  </p>
                </div>
              </div>

              {!aiInterpretation && !aiLoading && (
                <button
                  onClick={handleTriggerAiInterpretation}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all shrink-0"
                >
                  <Sparkles size={14} />
                  AI ile Sinyalleri Yorumla
                </button>
              )}
            </div>

            {/* AI Yükleniyor Durumu */}
            {aiLoading && (
              <div className="p-6 bg-slate-950/50 rounded-xl border border-indigo-500/20 text-center space-y-3">
                <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-300 font-medium">
                  {symbol} teknik indikatör kombinasyonu finansal okuryazarlık ilkelerine göre analiz ediliyor...
                </p>
              </div>
            )}

            {/* AI Hata Durumu */}
            {aiError && !aiLoading && (
              <div className="p-4 bg-rose-950/30 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center justify-between">
                <span>{aiError}</span>
                <button
                  onClick={handleTriggerAiInterpretation}
                  className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-500"
                >
                  Tekrar Dene
                </button>
              </div>
            )}

            {/* AI Yorumlama Sonucu */}
            {aiInterpretation && !aiLoading && (
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* 1. Özet Konsept */}
                <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles size={14} />
                    Teknik Görünümün Teorik Özeti:
                  </span>
                  <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                    {aiInterpretation.educationalAnalysis.summaryConcept}
                  </p>
                </div>

                {/* 2. Sinyal Uyumu & Çelişki Notu */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Layers size={14} />
                      Kesişim Gücü (Confluence):
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {aiInterpretation.educationalAnalysis.confluenceAssessment}
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950/70 rounded-xl border border-amber-500/20 bg-amber-950/10 space-y-1">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle size={14} />
                      Olası Çelişkiler & Ayrışmalar:
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {aiInterpretation.educationalAnalysis.contradictionNote || 'Belirgin bir teknik çelişki tespit edilmemiştir.'}
                    </p>
                  </div>
                </div>

                {/* 3. Yanıltıcı Kırılımlar ve Riskler */}
                <div className="p-3.5 bg-rose-950/10 border border-rose-500/20 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <ShieldAlert size={14} />
                    Tuzak ve Yanıltıcı Sinyal Riskleri:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {aiInterpretation.educationalAnalysis.riskAndFalseBreakoutFactors}
                  </p>
                </div>

                {/* 4. Eğitici Kontrol Listesi */}
                {aiInterpretation.educationalAnalysis.recommendedEducationalChecklist?.length > 0 && (
                  <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                      <CheckCheck size={14} />
                      Yatırımcının Teyit İçin İzlemesi Gerekenler:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                      {aiInterpretation.educationalAnalysis.recommendedEducationalChecklist.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                          <CheckCircle2 size={13} className="text-cyan-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Otomatik & Değişmez Yasal Uyarı */}
                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-start gap-2.5">
                  <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-400 leading-relaxed italic">
                    {aiInterpretation.disclaimer}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
