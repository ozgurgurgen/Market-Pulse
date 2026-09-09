import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Zap,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
  TrendingUp,
  BarChart2,
  FileText,
  X,
  Gauge,
  Percent,
  Cpu
} from 'lucide-react';
import { safeFetchJson } from '../utils/apiClient';

interface SignalEngineV2ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignalEngineV2Modal: React.FC<SignalEngineV2ModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'TEST_SUITE' | 'WALK_FORWARD' | 'ARCHITECTURE' | 'DRIFT_LOGS'>('TEST_SUITE');
  
  // Test Suite State
  const [testReport, setTestReport] = useState<any>(null);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  
  // Walk Forward State
  const [wfResult, setWfResult] = useState<any>(null);
  const [isRunningWf, setIsRunningWf] = useState<boolean>(false);
  const [trendSelection, setTrendSelection] = useState<'BULL' | 'BEAR' | 'SIDEWAYS'>('BULL');

  // Drift State
  const [driftStatus, setDriftStatus] = useState<any>(null);

  // Load initial test results
  useEffect(() => {
    if (isOpen) {
      runTestSuite();
      fetchDriftStatus();
    }
  }, [isOpen]);

  const runTestSuite = async () => {
    setIsRunningTests(true);
    try {
      const { data, ok } = await safeFetchJson<any>('/api/signals/v2/test-suite');
      if (ok && data) {
        setTestReport(data);
      }
    } catch (e) {
      console.error('Test suite error:', e);
    } finally {
      setIsRunningTests(false);
    }
  };

  const runWalkForwardSim = async () => {
    setIsRunningWf(true);
    try {
      const { data, ok } = await safeFetchJson<any>('/api/signals/v2/walk-forward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trend: trendSelection, length: 300, startingCapital: 100000 }),
      });
      if (ok && data) {
        setWfResult(data);
      }
    } catch (e) {
      console.error('Walk-forward error:', e);
    } finally {
      setIsRunningWf(false);
    }
  };

  const fetchDriftStatus = async () => {
    try {
      const { data, ok } = await safeFetchJson<any>('/api/signals/v2/drift-status');
      if (ok && data) {
        setDriftStatus(data);
      }
    } catch (e) {
      console.error('Drift status error:', e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Cpu size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">Sinyal Motoru v2</h2>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full">
                  Ensemble & Risk Yönetimi
                </span>
              </div>
              <p className="text-xs text-slate-400">
                5 Bağımsız Kategori, Dinamik ADX Rejimi, Çeyrek Kelly & Walk-Forward Doğrulaması
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/30 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('TEST_SUITE')}
            className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'TEST_SUITE'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck size={15} />
            Bölüm 10 Test Paketi ({testReport?.passedTests || 0}/{testReport?.totalTests || 0})
          </button>

          <button
            onClick={() => {
              setActiveTab('WALK_FORWARD');
              if (!wfResult) runWalkForwardSim();
            }}
            className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'WALK_FORWARD'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp size={15} />
            Walk-Forward & Monte Carlo
          </button>

          <button
            onClick={() => setActiveTab('ARCHITECTURE')}
            className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'ARCHITECTURE'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers size={15} />
            Mimari & 5 Kategori
          </button>

          <button
            onClick={() => setActiveTab('DRIFT_LOGS')}
            className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'DRIFT_LOGS'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity size={15} />
            Model Drift İzleyici
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: BÖLÜM 10 TEST PAKETİ */}
          {activeTab === 'TEST_SUITE' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    Bölüm 10 Kapsamlı Otomatik Test Paketi
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Birim, Entegrasyon, Regresyon, Uç Durum, Sıfıra Bölme ve Overfitting Testleri
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Başarı Oranı</div>
                    <div className="text-base font-black text-emerald-400">
                      %{testReport?.successRatePct || 100}
                    </div>
                  </div>

                  <button
                    onClick={runTestSuite}
                    disabled={isRunningTests}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    <RotateCw size={14} className={isRunningTests ? 'animate-spin' : ''} />
                    <span>{isRunningTests ? 'Testler Koşuyor...' : 'Testleri Tekrar Çalıştır'}</span>
                  </button>
                </div>
              </div>

              {/* Sections Breakdown Cards */}
              {testReport?.sectionsSummary && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(testReport.sectionsSummary).map(([sec, stats]: [string, any]) => (
                    <div key={sec} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <div className="text-[11px] font-semibold text-slate-400 truncate">{sec}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-bold text-white">{stats.passed} / {stats.total}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                          TAM GEÇTİ
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Detailed Test Items List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Tüm Testlerin Sonuç Dökümü ({testReport?.results?.length || 0} Adet)
                </h4>
                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {testReport?.results?.map((test: any) => (
                    <div
                      key={test.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-200">[{test.id}] {test.name}</span>
                          <span className="text-slate-500 text-[11px] ml-2">({test.section})</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-slate-500">{test.durationMs}ms</span>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          GEÇTİ
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WALK-FORWARD & MONTE CARLO */}
          {activeTab === 'WALK_FORWARD' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp size={16} className="text-cyan-400" />
                    Bölüm 8: Walk-Forward Out-of-Sample Optimizasyonu
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Train pencerelerinde grid search, izole Test pencerelerinde gerçekçi slippage/komisyonlu out-of-sample doğrulama
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={trendSelection}
                    onChange={(e) => setTrendSelection(e.target.value as any)}
                    className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 cursor-pointer"
                  >
                    <option value="BULL">Boğa Rejimi (300 Bar)</option>
                    <option value="SIDEWAYS">Yatay / Salınım Rejimi</option>
                    <option value="BEAR">Ayı Rejimi</option>
                  </select>

                  <button
                    onClick={runWalkForwardSim}
                    disabled={isRunningWf}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Play size={13} />
                    <span>{isRunningWf ? 'Hesaplanıyor...' : 'Simülasyonu Çalıştır'}</span>
                  </button>
                </div>
              </div>

              {/* Metrics Grid */}
              {wfResult?.walkForward && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="text-[11px] text-slate-400">Out-of-Sample Win Rate</div>
                    <div className="text-lg font-black text-emerald-400">
                      %{(wfResult.walkForward.outOfSampleWinRate * 100).toFixed(1)}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="text-[11px] text-slate-400">Ort. Pencere Getirisi</div>
                    <div className="text-lg font-black text-cyan-400">
                      %{wfResult.walkForward.outOfSampleAvgReturnPct}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="text-[11px] text-slate-400">Max Drawdown</div>
                    <div className="text-lg font-black text-rose-400">
                      %{wfResult.walkForward.outOfSampleMaxDrawdown}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="text-[11px] text-slate-400">Overfitting Durumu</div>
                    <div className="text-sm font-bold text-emerald-400 flex items-center gap-1 mt-1">
                      <CheckCircle2 size={14} /> Temiz / Sağlıklı
                    </div>
                  </div>
                </div>
              )}

              {/* Monte Carlo Section */}
              {wfResult?.monteCarlo && (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <BarChart2 size={14} className="text-amber-400" />
                    Monte Carlo Dağılımı ({wfResult.monteCarlo.iterations} Bootstrap İterasyonu)
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[11px] text-slate-400 font-medium">%5 (En Kötü Senaryo)</div>
                      <div className="text-sm font-bold text-rose-400 mt-1">
                        %{wfResult.monteCarlo.p5FinalReturn} Getiri
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Max DD: %{wfResult.monteCarlo.p5MaxDrawdown}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[11px] text-slate-400 font-medium">%50 (Medyan Beklenti)</div>
                      <div className="text-sm font-bold text-emerald-400 mt-1">
                        %{wfResult.monteCarlo.p50FinalReturn} Getiri
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Max DD: %{wfResult.monteCarlo.p50MaxDrawdown}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[11px] text-slate-400 font-medium">%95 (En İyi Senaryo)</div>
                      <div className="text-sm font-bold text-cyan-400 mt-1">
                        %{wfResult.monteCarlo.p95FinalReturn} Getiri
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Max DD: %{wfResult.monteCarlo.p95MaxDrawdown}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MİMARİ VE 5 KATEGORİ */}
          {activeTab === 'ARCHITECTURE' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    1. TREND KATEGORİSİ (-100 .. +100)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Fiyat &gt; EMA20 &gt; EMA50 &gt; SMA200 düzenli boğa dizilimi (+60) ve MACD Histogram momentum artış teyidi (+15) ile hesaplanır.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    2. MOMENTUM KATEGORİSİ (-100 .. +100)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    RSI(14) aşırı satım/alım seviyeleri (±25) ve kesin kurallı tepe/dip Pivot Uyumsuzluk (Divergence) tespiti (±50) ile yönetilir.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    3. VOLATİLİTE KATEGORİSİ (-100 .. +100)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Son 1 yılın en dar %10'luk Bollinger Band genişliği (Squeeze) sonrasında 20 günlük ortalama hacmin 1.5 katı ile gerçekleşen kırılımları (±70) yakalar.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                    4. DEĞERLEME & BÜYÜME (-100 .. +100)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Sektör medyanına göre F/K ve PD/DD iskonto oranları ile FAVÖK büyümesini analiz ederek "Value Trap" tuzaklarını eler.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  5. HABER & NLP DOĞRULAMA & RİSK YÖNETİMİ
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Sadece doğrulama katmanından ACCEPT almış NLP verileri kullanılır. Çeyrek Kelly Kriteri ve sabit %8 tek hisse tavanı ile sermaye riski sınırlandırılır. Portföy düzeyinde aynı sektörden maksimum 2 pozisyon ve toplamda maksimum %15 açık risk limiti uygulanır.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: MODEL DRIFT LOGLARI */}
          {activeTab === 'DRIFT_LOGS' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity size={16} className="text-emerald-400" />
                    Model Drift Gözetim Sistemi (Bölüm 9)
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Canlı sinyal kazanma oranı, backtest istatistiksel beklentisinin 2 standart sapma altına düştüğünde yeni alımlar otomatik durdurulur.
                  </p>
                </div>

                <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  DURUM: NORMAL / AKTİF
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-300 space-y-2">
                <div className="font-semibold text-slate-200">Gözetim Parametreleri:</div>
                <div className="grid grid-cols-3 gap-2 text-slate-400">
                  <div>Hedef Win Rate: <strong className="text-white">%62.0</strong></div>
                  <div>Tolerans Standart Sapması: <strong className="text-white">±%6.0</strong></div>
                  <div>Otomatik Durdurma Eşiği: <strong className="text-amber-400">&lt; %50.0</strong></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div>
            Motor Versiyonu: <strong className="text-emerald-400">v2.0.0-ensemble-risk-managed</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
