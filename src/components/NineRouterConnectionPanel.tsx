import React, { useState, useEffect, useMemo } from 'react';
import {
  Network,
  Cpu,
  Check,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Search,
  Sparkles,
  Send,
  Clock,
  Key,
  Eye,
  EyeOff,
  Zap,
  HelpCircle,
  CheckCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { AIModelConfig } from '../types';

interface NineRouterConnectionPanelProps {
  config: Partial<AIModelConfig>;
  onChange: (patch: Partial<AIModelConfig>) => void;
  onSave?: (newConfig: AIModelConfig) => void;
}

export interface RouterModelItem {
  id: string;
  name: string;
  owned_by?: string;
}

const COMMON_PRESETS = [
  'local-default',
  'deepseek-r1',
  'llama-3.3-70b',
  'qwen-2.5-coder',
  'mistral-small',
  'phi-4',
];

const URL_PRESETS = [
  { label: 'Varsayılan Port (9999)', url: 'http://localhost:9999/v1' },
  { label: 'IPv4 Doğrudan', url: 'http://127.0.0.1:9999/v1' },
  { label: 'Özel Port (8000)', url: 'http://localhost:8000/v1' },
  { label: 'LM Studio Portu (1234)', url: 'http://localhost:1234/v1' },
  { label: 'Ollama OpenAI Portu (11434)', url: 'http://localhost:11434/v1' },
];

export const NineRouterConnectionPanel: React.FC<NineRouterConnectionPanelProps> = ({
  config,
  onChange,
}) => {
  const baseUrl = config.nineRouterBaseUrl || 'http://localhost:9999/v1';
  const selectedModel = config.nineRouterModel || 'local-default';
  const apiKey = config.nineRouterApiKey || '';
  const timeout = config.nineRouterTimeout || 60;
  const temperature = config.nineRouterTemperature ?? 0.7;
  const maxTokens = config.nineRouterMaxTokens || 4096;
  const fallbackToGemini = config.nineRouterFallbackToGemini !== false;

  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [connectionState, setConnectionState] = useState<'idle' | 'online' | 'offline' | 'warning'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [latency, setLatency] = useState<number | null>(null);

  // Model list
  const [availableModels, setAvailableModels] = useState<RouterModelItem[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Live prompt test
  const [testPrompt, setTestPrompt] = useState('MarketPulse AI 9Router bağlantı testi. Kısa 1 cümlelik teyit ver.');
  const [isSendingPrompt, setIsSendingPrompt] = useState(false);
  const [promptResponse, setPromptResponse] = useState<string | null>(null);
  const [promptError, setPromptError] = useState<string | null>(null);

  // Trigger test and fetch models
  const handleConnectAndFetch = async () => {
    setIsTesting(true);
    setConnectionState('idle');
    setStatusMessage('9Router servisi sorgulanıyor...');
    setPromptResponse(null);
    setPromptError(null);

    try {
      // 1. Fetch available models from 9Router via backend proxy
      const fetchPromise = fetch('/api/ai/fetch-models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'ninerouter',
          baseUrl,
          apiKey,
        }),
      });

      // 2. Perform latency test
      const testPromise = fetch('/api/ai/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelConfig: {
            provider: 'ninerouter',
            nineRouterBaseUrl: baseUrl,
            nineRouterModel: selectedModel,
            nineRouterApiKey: apiKey,
            nineRouterTimeout: timeout,
          },
        }),
      });

      const [fetchRes, testRes] = await Promise.all([fetchPromise, testPromise]);
      const fetchData = await fetchRes.json().catch(() => null);
      const testData = await testRes.json().catch(() => null);

      if (testData?.latencyMs) {
        setLatency(testData.latencyMs);
      }

      if (fetchData?.success && Array.isArray(fetchData.models) && fetchData.models.length > 0) {
        setAvailableModels(fetchData.models);
        setConnectionState('online');
        setStatusMessage(
          `9Router servisine bağlanıldı! ${fetchData.models.length} model listelendi. (${testData?.latencyMs ? `${testData.latencyMs}ms` : 'Aktif'})`
        );
        // If current selectedModel is not set or is local-default, and we got models, suggest the first one or keep if valid
        if (selectedModel === 'local-default' && fetchData.models[0]?.id) {
          onChange({ nineRouterModel: fetchData.models[0].id });
        }
      } else if (testData?.status === 'online') {
        if (Array.isArray(testData.availableModels) && testData.availableModels.length > 0) {
          setAvailableModels(testData.availableModels);
        }
        setConnectionState('online');
        setStatusMessage(testData.message || '9Router servisi çevrimiçi ve yanıt veriyor.');
      } else {
        setConnectionState(testData?.status === 'warning' ? 'warning' : 'offline');
        setStatusMessage(
          testData?.message ||
            `9Router (${baseUrl}) adresine ulaşılamadı. Lütfen 9Router uygulamasının çalıştığından emin olun.`
        );
      }
    } catch (err: any) {
      setConnectionState('offline');
      setStatusMessage(`Bağlantı hatası: ${err.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  // Run live test prompt
  const handleRunLivePrompt = async () => {
    if (!testPrompt.trim()) return;
    setIsSendingPrompt(true);
    setPromptResponse(null);
    setPromptError(null);

    try {
      const res = await fetch('/api/ai/test-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: testPrompt,
          modelConfig: {
            provider: 'ninerouter',
            nineRouterBaseUrl: baseUrl,
            nineRouterModel: selectedModel,
            nineRouterApiKey: apiKey,
            nineRouterTimeout: timeout,
            nineRouterTemperature: temperature,
            nineRouterMaxTokens: maxTokens,
            nineRouterFallbackToGemini: fallbackToGemini,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPromptResponse(data.text || 'Boş yanıt döndü.');
      } else {
        setPromptError(data.error || 'İstek başarısız oldu.');
      }
    } catch (err: any) {
      setPromptError(err.message || 'Sunucu hatası oluştu.');
    } finally {
      setIsSendingPrompt(false);
    }
  };

  // Filtered models
  const filteredModels = useMemo(() => {
    if (!searchFilter.trim()) return availableModels;
    const q = searchFilter.toLowerCase();
    return availableModels.filter(
      (m) => m.id.toLowerCase().includes(q) || m.name.toLowerCase().includes(q)
    );
  }, [availableModels, searchFilter]);

  return (
    <div className="space-y-5">
      {/* 1. Header & Live Status Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/40 via-purple-900/20 to-slate-900/60 border border-violet-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400 shadow-inner">
              <Network size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide">9Router Yerel & Ağ AI Yönlendiricisi</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-semibold border border-violet-500/30">
                  Yerel Gizlilik
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Kendi bilgisayarınızda veya yerel ağınızda koşan 9Router servisini MarketPulse AI motoruyla tam entegre çalıştırın.
              </p>
            </div>
          </div>

          {/* Connection Status Pill */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {connectionState === 'online' && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Çevrimiçi</span>
                {latency !== null && <span className="text-[10px] opacity-75 font-mono">({latency}ms)</span>}
              </div>
            )}
            {connectionState === 'offline' && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                <AlertCircle size={13} />
                <span>Bağlantı Yok</span>
              </div>
            )}
            {connectionState === 'warning' && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                <AlertCircle size={13} />
                <span>Yanıt Alınamadı</span>
              </div>
            )}
            {connectionState === 'idle' && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                <span>Hazır</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Feedback Message */}
        {statusMessage && (
          <div
            className={`mt-3 p-2.5 rounded-xl text-xs flex items-center gap-2 border ${
              connectionState === 'online'
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                : connectionState === 'offline'
                ? 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
            }`}
          >
            {connectionState === 'online' ? (
              <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle size={15} className="shrink-0 text-rose-400" />
            )}
            <span className="flex-1">{statusMessage}</span>
          </div>
        )}
      </div>

      {/* 2. Credentials & Connection URL Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Base URL */}
        <div className="lg:col-span-7 space-y-1.5">
          <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Network size={14} className="text-violet-400" />
              9Router Servis URL Adresi
            </span>
            <span className="text-[10px] text-violet-400 font-mono">OpenAI Uyumlu</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => onChange({ nineRouterBaseUrl: e.target.value })}
              placeholder="http://localhost:9999/v1"
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder:text-slate-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-all"
            />
          </div>

          {/* Quick Preset Port Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {URL_PRESETS.map((p) => (
              <button
                key={p.url}
                type="button"
                onClick={() => onChange({ nineRouterBaseUrl: p.url })}
                className={`text-[10px] px-2 py-0.5 rounded-lg border font-mono transition-all cursor-pointer ${
                  baseUrl === p.url
                    ? 'bg-violet-600/30 text-violet-300 border-violet-500 font-bold'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* API Key / Token */}
        <div className="lg:col-span-5 space-y-1.5">
          <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Key size={14} className="text-violet-400" />
              Erişim Anahtarı / Bearer Token
            </span>
            <span className="text-[10px] text-slate-400 font-medium">(İsteğe Bağlı)</span>
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => onChange({ nineRouterApiKey: e.target.value })}
              placeholder="Varsayılan yerel için boş bırakılabilir"
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white font-mono placeholder:text-slate-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            9Router uygulamanız şifreli parola gerektirmiyorsa bu alanı boş bırakabilirsiniz.
          </p>
        </div>
      </div>

      {/* 3. Primary Connect & Fetch Models Button */}
      <div className="pt-1">
        <button
          type="button"
          onClick={handleConnectAndFetch}
          disabled={isTesting}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:scale-[0.99] text-white font-bold text-xs shadow-lg shadow-violet-900/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
        >
          {isTesting ? (
            <>
              <RefreshCw size={15} className="animate-spin text-white" />
              <span>9Router Servisine Bağlanılıyor ve Modeller Çekiliyor...</span>
            </>
          ) : (
            <>
              <Zap size={15} className="text-amber-300" />
              <span>9Router'a Bağlan & Modelleri Getir</span>
            </>
          )}
        </button>
      </div>

      {/* 4. Model Selection & Dynamic Model Catalog */}
      <div className="space-y-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Cpu size={16} className="text-violet-400" />
              <h4 className="text-xs font-bold text-white">Yönlendirici Model Seçimi</h4>
              {availableModels.length > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-600/20 text-violet-300 font-bold border border-violet-500/30">
                  {availableModels.length} Model Bulundu
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Aktif finansal analiz ve piyasa danışmanlığı için kullanılacak yerel modeli seçin.
            </p>
          </div>

          {/* Current Selection Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-950/60 border border-violet-500/30 text-violet-200 text-xs font-mono font-bold self-start sm:self-auto">
            <span className="text-[10px] text-violet-400 uppercase font-sans font-semibold">Aktif:</span>
            <span>{selectedModel}</span>
          </div>
        </div>

        {/* If Models Were Fetched from 9Router: Rich Model Grid */}
        {availableModels.length > 0 ? (
          <div className="space-y-3">
            {/* Search filter if more than 4 models */}
            {availableModels.length > 4 && (
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Modeller arasında ara (örn: deepseek, llama, qwen, r1)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
              {filteredModels.map((m) => {
                const isSelected = selectedModel === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onChange({ nineRouterModel: m.id })}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-violet-600/20 border-violet-500 text-white shadow-sm ring-1 ring-violet-500'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold font-mono text-white truncate" title={m.name || m.id}>
                        {m.name || m.id}
                      </span>
                      {isSelected ? (
                        <div className="w-4 h-4 rounded-full bg-violet-600 flex items-center justify-center text-white shrink-0">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      ) : null}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="truncate">{m.owned_by || 'Yerel'}</span>
                      {isSelected && (
                        <span className="text-violet-400 font-semibold">Seçili</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Fallback preset pills when models haven't been fetched yet */
          <div className="space-y-2">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span>Hızlı Popüler Yerel Modeller:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onChange({ nineRouterModel: preset })}
                  className={`text-xs px-2.5 py-1 rounded-xl border font-mono transition-all cursor-pointer ${
                    selectedModel === preset
                      ? 'bg-violet-600 text-white border-violet-500 font-bold shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Manual Model Name Input */}
        <div className="pt-2 border-t border-slate-800/80">
          <label className="text-[11px] font-medium text-slate-400 block mb-1">
            Veya Özel Model ID'si Girin:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={selectedModel}
              onChange={(e) => onChange({ nineRouterModel: e.target.value })}
              placeholder="local-default veya deepseek-r1"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:border-violet-500 focus:outline-none"
            />
            {availableModels.length > 0 && (
              <button
                type="button"
                onClick={handleConnectAndFetch}
                title="Modelleri Yenile"
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 cursor-pointer transition-all"
              >
                <RefreshCw size={13} className={isTesting ? 'animate-spin' : ''} />
                <span>Yenile</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 5. Advanced Engine Parameters (Accordion) */}
      <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/60">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white bg-slate-900/90 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Sliders size={14} className="text-violet-400" />
            <span>Gelişmiş 9Router Parametreleri & Canlı Test Konsolu</span>
          </div>
          {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showAdvanced && (
          <div className="p-4 space-y-4 border-t border-slate-800 bg-slate-950/40">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Timeout */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Clock size={13} className="text-violet-400" />
                    Zaman Aşımı (Timeout)
                  </span>
                  <span className="font-mono text-violet-400">{timeout} sn</span>
                </label>
                <select
                  value={timeout}
                  onChange={(e) => onChange({ nineRouterTimeout: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-violet-500 focus:outline-none"
                >
                  <option value={15}>15 saniye (Hızlı Modeller)</option>
                  <option value={30}>30 saniye</option>
                  <option value={60}>60 saniye (Varsayılan)</option>
                  <option value={120}>120 saniye (Derin Muhakeme / R1)</option>
                  <option value={180}>180 saniye (Ağır Yerel Modeller)</option>
                </select>
                <p className="text-[10px] text-slate-500">
                  R1 gibi düşünme modelleri daha uzun süre gerektirebilir.
                </p>
              </div>

              {/* Temperature */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Sparkles size={13} className="text-violet-400" />
                    Sıcaklık (Temperature)
                  </span>
                  <span className="font-mono text-violet-400">{temperature.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => onChange({ nineRouterTemperature: parseFloat(e.target.value) })}
                  className="w-full accent-violet-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0.0 (Deterministik)</span>
                  <span>0.7 (Dengeli)</span>
                  <span>1.0 (Yaratıcı)</span>
                </div>
              </div>

              {/* Max Tokens */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Cpu size={13} className="text-violet-400" />
                    Maksimum Token
                  </span>
                  <span className="font-mono text-violet-400">{maxTokens}</span>
                </label>
                <select
                  value={maxTokens}
                  onChange={(e) => onChange({ nineRouterMaxTokens: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-violet-500 focus:outline-none"
                >
                  <option value={2048}>2,048 token</option>
                  <option value={4096}>4,096 token (Varsayılan)</option>
                  <option value={8192}>8,192 token (Geniş Analiz)</option>
                  <option value={16384}>16,384 token (Uzun Rapor)</option>
                </select>
                <p className="text-[10px] text-slate-500">
                  Tek seferde üretilecek maksimum içerik uzunluğu.
                </p>
              </div>
            </div>

            {/* Fallback to Gemini switch */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-violet-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Google Gemini Otomatik Yedekleme (Fallback)</div>
                  <div className="text-[11px] text-slate-400">
                    9Router servisi kapalıysa veya yerel model hata verirse kesintisiz analiz için Google Gemini otomatik devreye girsin.
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={fallbackToGemini}
                  onChange={(e) => onChange({ nineRouterFallbackToGemini: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600"></div>
              </label>
            </div>

            {/* Live Test Sandbox Console */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Send size={13} className="text-violet-400" />
                  <span>9Router Canlı Yanıt Doğrulama (Sandbox)</span>
                </div>
                <span className="text-[10px] text-slate-400">Aktif Model: {selectedModel}</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  placeholder="Test sorusu girin..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:border-violet-500 focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={handleRunLivePrompt}
                  disabled={isSendingPrompt || !testPrompt.trim()}
                  className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all shadow-sm"
                >
                  {isSendingPrompt ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>İşleniyor...</span>
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      <span>Test Gönder</span>
                    </>
                  )}
                </button>
              </div>

              {promptResponse && (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30 text-xs space-y-1">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <CheckCheck size={12} />
                    9Router'dan Gelen Canlı Yanıt:
                  </div>
                  <div className="text-slate-200 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                    {promptResponse}
                  </div>
                </div>
              )}

              {promptError && (
                <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs space-y-1">
                  <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                    <AlertCircle size={12} />
                    Hata Oluştu:
                  </div>
                  <div className="text-rose-200 font-mono text-[11px]">
                    {promptError}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
