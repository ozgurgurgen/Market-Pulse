import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  Sparkles, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Server, 
  Shield, 
  Sliders, 
  Share2, 
  Network, 
  Layers, 
  Eye, 
  EyeOff,
  HelpCircle,
  TrendingUp,
  MessageSquare,
  PieChart,
  Target,
  FlaskConical,
  Compass
} from 'lucide-react';
import { AIModelConfig, AIProviderType, AITaskType, AITaskRouteConfig } from '../types';
import { safeFetchJson } from '../utils/apiClient';
import { NineRouterConnectionPanel } from './NineRouterConnectionPanel';

interface AIModelSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AIModelConfig;
  onSaveConfig: (newConfig: AIModelConfig) => void;
}

interface TaskMeta {
  key: AITaskType;
  label: string;
  description: string;
  icon: React.ReactNode;
  defaultModel: string;
}

const AI_TASKS_METADATA: TaskMeta[] = [
  {
    key: 'chatAdvisor',
    label: 'Finansal Danışman & Sohbet',
    description: 'Canlı piyasa verileri ve soru-cevap analizi',
    icon: <MessageSquare className="w-4 h-4 text-cyan-400" />,
    defaultModel: 'gemini-3.7-flash',
  },
  {
    key: 'stockAnalysis',
    label: 'Hisse & Bilanço Analizi',
    description: 'BIST / ABD hisseleri, 6 karne kriteri ve değerleme',
    icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
    defaultModel: 'gemini-3.7-flash',
  },
  {
    key: 'fundAnalysis',
    label: 'TEFAS Fon Analizi',
    description: 'TEFAS fonları karne puanı, Sharpe ve enflasyon koruması',
    icon: <PieChart className="w-4 h-4 text-blue-400" />,
    defaultModel: 'gemini-3.7-flash',
  },
  {
    key: 'opportunityRadar',
    label: 'Fırsat Radarı & Algoritmik Sinyaller',
    description: 'Trend dönüşümleri ve dinamik alım-satım fırsatları',
    icon: <Target className="w-4 h-4 text-amber-400" />,
    defaultModel: 'gemini-3.7-flash',
  },
  {
    key: 'backtestAnalysis',
    label: 'Portföy Backtest & Denetim',
    description: 'Portföy simülasyonu, Sharpe ve stres testi değerlendirmesi',
    icon: <FlaskConical className="w-4 h-4 text-purple-400" />,
    defaultModel: 'gemini-3.7-flash',
  },
  {
    key: 'macroAnalysis',
    label: 'Makroekonomik Analiz & Bülten',
    description: 'TCMB, FED, enflasyon ve faiz göstergeleri',
    icon: <Compass className="w-4 h-4 text-rose-400" />,
    defaultModel: 'gemini-3.7-flash',
  },
];

export const AIModelSettingsModal: React.FC<AIModelSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'provider' | 'task_routes' | 'system'>('provider');

  // Main Provider Settings
  const [provider, setProvider] = useState<AIProviderType>(config.provider || 'gemini');
  const [geminiModel, setGeminiModel] = useState(config.geminiModel || 'gemini-3.7-flash');
  
  // OpenRouter Settings
  const [openRouterApiKey, setOpenRouterApiKey] = useState(config.openRouterApiKey || '');
  const [openRouterModel, setOpenRouterModel] = useState(config.openRouterModel || 'deepseek/deepseek-r1');
  const [openRouterBaseUrl, setOpenRouterBaseUrl] = useState(config.openRouterBaseUrl || 'https://openrouter.ai/api/v1');
  const [showOpenRouterKey, setShowOpenRouterKey] = useState(false);

  // 9Router Settings (Yerel AI Yönlendirici)
  const [nineRouterBaseUrl, setNineRouterBaseUrl] = useState(config.nineRouterBaseUrl || 'http://localhost:9999/v1');
  const [nineRouterModel, setNineRouterModel] = useState(config.nineRouterModel || 'local-default');
  const [nineRouterApiKey, setNineRouterApiKey] = useState(config.nineRouterApiKey || '');
  const [nineRouterTimeout, setNineRouterTimeout] = useState<number>(config.nineRouterTimeout || 60);
  const [nineRouterTemperature, setNineRouterTemperature] = useState<number>(config.nineRouterTemperature ?? 0.7);
  const [nineRouterMaxTokens, setNineRouterMaxTokens] = useState<number>(config.nineRouterMaxTokens || 4096);
  const [nineRouterFallbackToGemini, setNineRouterFallbackToGemini] = useState<boolean>(config.nineRouterFallbackToGemini !== false);
  const [showNineRouterKey, setShowNineRouterKey] = useState(false);

  // Other Provider Advanced Settings
  const [openRouterTemperature, setOpenRouterTemperature] = useState<number>(config.openRouterTemperature ?? 0.7);
  const [openRouterSiteUrl, setOpenRouterSiteUrl] = useState<string>(config.openRouterSiteUrl || '');
  const [openRouterAppName, setOpenRouterAppName] = useState<string>(config.openRouterAppName || '');
  const [openRouterFetchedModels, setOpenRouterFetchedModels] = useState<Array<{ id: string; name: string }>>([]);
  const [isFetchingOpenRouter, setIsFetchingOpenRouter] = useState(false);

  const [geminiTemperature, setGeminiTemperature] = useState<number>(config.geminiTemperature ?? 0.7);
  const [geminiSearchGrounding, setGeminiSearchGrounding] = useState<boolean>(config.geminiSearchGrounding !== false);

  const [ollamaTemperature, setOllamaTemperature] = useState<number>(config.ollamaTemperature ?? 0.7);

  const [customTemperature, setCustomTemperature] = useState<number>(config.customTemperature ?? 0.7);
  const [customFetchedModels, setCustomFetchedModels] = useState<Array<{ id: string; name: string }>>([]);
  const [isFetchingCustom, setIsFetchingCustom] = useState(false);

  const handleFetchOpenRouterModels = async () => {
    setIsFetchingOpenRouter(true);
    try {
      const res = await safeFetchJson<{ success: boolean; models: Array<{ id: string; name: string }> }>('/api/ai/fetch-models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'openrouter',
          baseUrl: openRouterBaseUrl,
          apiKey: openRouterApiKey,
        }),
      });
      if (res.data?.success && res.data.models) {
        setOpenRouterFetchedModels(res.data.models);
      }
    } catch {}
    finally {
      setIsFetchingOpenRouter(false);
    }
  };

  const handleFetchCustomModels = async () => {
    setIsFetchingCustom(true);
    try {
      const res = await safeFetchJson<{ success: boolean; models: Array<{ id: string; name: string }> }>('/api/ai/fetch-models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'custom',
          baseUrl: customBaseUrl,
          apiKey: customApiKey,
        }),
      });
      if (res.data?.success && res.data.models) {
        setCustomFetchedModels(res.data.models);
      }
    } catch {}
    finally {
      setIsFetchingCustom(false);
    }
  };

  // Ollama Settings
  const [ollamaUrl, setOllamaUrl] = useState(config.ollamaUrl || 'http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState(config.ollamaModel || 'deepseek-r1:latest');

  // Custom Endpoint
  const [customBaseUrl, setCustomBaseUrl] = useState(config.customBaseUrl || '');
  const [customApiKey, setCustomApiKey] = useState(config.customApiKey || '');
  const [customModelName, setCustomModelName] = useState(config.customModelName || '');

  // Task-Specific AI Routing State
  const [taskRoutes, setTaskRoutes] = useState<Partial<Record<AITaskType, AITaskRouteConfig>>>(
    config.taskRoutes || {}
  );

  // Global UI & Feature Settings
  const [radarScope, setRadarScope] = useState(config.radarScope || 'ALL');
  const [radarLayout, setRadarLayout] = useState(config.radarLayout || 'GRID');

  // Connection Test State
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'online' | 'offline' | 'warning'>('idle');
  const [testMessage, setTestMessage] = useState('');
  const [availableOllamaModels, setAvailableOllamaModels] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setTestMessage('Seçilen yapay zeka servisine bağlanılıyor...');

    try {
      const { data, ok } = await safeFetchJson<{ status: any; message: string; availableModels?: string[]; latencyMs?: number }>('/api/ai/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelConfig: {
            provider,
            geminiModel,
            geminiTemperature,
            geminiSearchGrounding,
            openRouterApiKey,
            openRouterModel,
            openRouterBaseUrl,
            openRouterTemperature,
            openRouterSiteUrl,
            openRouterAppName,
            nineRouterBaseUrl,
            nineRouterModel,
            nineRouterApiKey,
            nineRouterTimeout,
            nineRouterTemperature,
            nineRouterMaxTokens,
            nineRouterFallbackToGemini,
            ollamaUrl,
            ollamaModel,
            ollamaTemperature,
            customBaseUrl,
            customApiKey,
            customModelName,
            customTemperature,
          }
        }),
      });

      if (ok && data) {
        setTestStatus(data.status || 'online');
        setTestMessage(data.message || 'Bağlantı başarılı!');
        if (data.availableModels && Array.isArray(data.availableModels)) {
          setAvailableOllamaModels(data.availableModels);
        }
      } else {
        setTestStatus('offline');
        setTestMessage(data?.message || 'Bağlantı kurulamadı.');
      }
    } catch (err: any) {
      setTestStatus('offline');
      setTestMessage(`Hata: ${err?.message || 'Bağlantı hatası'}`);
    }
  };

  const handleTaskRouteToggle = (taskKey: AITaskType, enabled: boolean) => {
    setTaskRoutes(prev => {
      const copy = { ...prev };
      if (!enabled) {
        delete copy[taskKey];
      } else {
        copy[taskKey] = {
          useGlobal: false,
          provider: provider,
          model: provider === 'gemini' ? geminiModel : provider === 'openrouter' ? openRouterModel : provider === 'ninerouter' ? nineRouterModel : ollamaModel,
        };
      }
      return copy;
    });
  };

  const updateTaskRoute = (taskKey: AITaskType, partial: Partial<AITaskRouteConfig>) => {
    setTaskRoutes(prev => ({
      ...prev,
      [taskKey]: {
        ...(prev[taskKey] || { useGlobal: false, provider: 'gemini', model: 'gemini-3.7-flash' }),
        ...partial,
      }
    }));
  };

  const handleSave = () => {
    const updated: AIModelConfig = {
      provider,
      geminiModel,
      geminiTemperature,
      geminiSearchGrounding,
      openRouterApiKey,
      openRouterModel,
      openRouterBaseUrl,
      openRouterTemperature,
      openRouterSiteUrl,
      openRouterAppName,
      nineRouterBaseUrl,
      nineRouterModel,
      nineRouterApiKey,
      nineRouterTimeout,
      nineRouterTemperature,
      nineRouterMaxTokens,
      nineRouterFallbackToGemini,
      ollamaUrl,
      ollamaModel,
      ollamaTemperature,
      customBaseUrl,
      customApiKey,
      customModelName,
      customTemperature,
      taskRoutes,
      tickerSpeed: config.tickerSpeed,
      newsTickerSpeed: config.newsTickerSpeed,
      radarScope,
      radarLayout
    };
    onSaveConfig(updated);
    onClose();
  };

  const openRouterPresetModels = [
    { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1', tag: 'Derin Muhakeme' },
    { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3', tag: 'Hızlı & Güçlü' },
    { id: 'anthropic/claude-3.7-sonnet', name: 'Claude 3.7 Sonnet', tag: 'İleri Seviye Zeka' },
    { id: 'meta-llama/llama-3.3-70b-instruct', name: 'LLaMA 3.3 70B', tag: 'Meta Açık Kaynak' },
    { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash', tag: 'Google Cloud' },
    { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', tag: 'Ekonomik & Çevik' },
    { id: 'qwen/qwen-2.5-72b-instruct', name: 'Qwen 2.5 72B', tag: 'Finans & Analiz' },
  ];

  const nineRouterPresetModels = [
    { id: 'local-default', name: '9Router Varsayılan', tag: 'Yönlendirilen Model' },
    { id: 'deepseek-r1', name: 'DeepSeek R1 (Yerel)', tag: 'Muhakeme' },
    { id: 'llama-3.3-70b', name: 'LLaMA 3.3 (Yerel)', tag: 'Açık Kaynak' },
    { id: 'qwen-2.5-coder', name: 'Qwen 2.5 Coder', tag: 'Matematik & Kod' },
    { id: 'mistral-small', name: 'Mistral Small', tag: 'Düşük Kaynak' },
  ];

  const popularOllamaModels = [
    { id: 'deepseek-r1:latest', name: 'DeepSeek-R1', desc: 'Gelişmiş Finansal & Matematiksel Muhakeme' },
    { id: 'llama3.2:latest', name: 'Llama 3.2 (Meta)', desc: 'Hızlı & Dengeli Genel Zeka' },
    { id: 'qwen2.5:latest', name: 'Qwen 2.5 (Alibaba)', desc: 'Yüksek Türkçe ve Veri Analitiği' },
    { id: 'mistral:latest', name: 'Mistral 7B', desc: 'Hafif & Hızlı Yanıt' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-emerald-500 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Yapay Zeka & Çoklu Model Yönlendirici
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                  9Router & OpenRouter
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Bulut, Açık Kaynak ve Yerel AI yönlendiricileri arasından dilediğiniz göreve dilediğiniz modeli atayın
              </p>
            </div>
          </div>
          <button
            id="close-ai-model-modal"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 border-b border-slate-800 bg-slate-950/20 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('provider')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'provider'
                ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu size={14} />
            Ana Sağlayıcı Yapılandırması
          </button>

          <button
            type="button"
            id="task-routing-tab-btn"
            onClick={() => setActiveTab('task_routes')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer relative ${
              activeTab === 'task_routes'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers size={14} />
            Görev Bazlı AI Yönlendirme
            {Object.keys(taskRoutes).length > 0 && (
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 font-bold">
                {Object.keys(taskRoutes).length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'system'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders size={14} />
            Sistem Ayarları
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[68vh] overflow-y-auto">

          {/* TAB 1: PROVIDER SELECTION & SETTINGS */}
          {activeTab === 'provider' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                  Varsayılan AI Sağlayıcısı Seçin
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                  
                  {/* 1. Google Gemini */}
                  <button
                    type="button"
                    id="provider-gemini-btn"
                    onClick={() => setProvider('gemini')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                      provider === 'gemini'
                        ? 'border-emerald-500/80 bg-emerald-500/15 shadow-md shadow-emerald-500/10 text-white'
                        : 'border-slate-800 bg-slate-950/50 hover:bg-slate-800/50 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Sparkles size={15} className={provider === 'gemini' ? 'text-emerald-400' : 'text-slate-500'} />
                      <span className="text-xs font-bold text-white">Google Gemini</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      Google Search Grounding & Canlı Fiyat
                    </p>
                    {provider === 'gemini' && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </button>

                  {/* 2. OpenRouter (Universal AI Cloud) */}
                  <button
                    type="button"
                    id="provider-openrouter-btn"
                    onClick={() => setProvider('openrouter')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                      provider === 'openrouter'
                        ? 'border-cyan-500/80 bg-cyan-500/15 shadow-md shadow-cyan-500/10 text-white'
                        : 'border-slate-800 bg-slate-950/50 hover:bg-slate-800/50 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Share2 size={15} className={provider === 'openrouter' ? 'text-cyan-400' : 'text-slate-500'} />
                      <span className="text-xs font-bold text-white">OpenRouter</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      DeepSeek R1, Claude, LLaMA, GPT
                    </p>
                    {provider === 'openrouter' && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </button>

                  {/* 3. 9Router (Local AI Router) */}
                  <button
                    type="button"
                    id="provider-ninerouter-btn"
                    onClick={() => setProvider('ninerouter')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                      provider === 'ninerouter'
                        ? 'border-indigo-500/80 bg-indigo-500/15 shadow-md shadow-indigo-500/10 text-white'
                        : 'border-slate-800 bg-slate-950/50 hover:bg-slate-800/50 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Network size={15} className={provider === 'ninerouter' ? 'text-indigo-400' : 'text-slate-500'} />
                      <span className="text-xs font-bold text-white">9Router</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      Yerel AI Yönlendirici (Port 9999)
                    </p>
                    {provider === 'ninerouter' && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                    )}
                  </button>

                  {/* 4. Ollama (Local LLM) */}
                  <button
                    type="button"
                    id="provider-ollama-btn"
                    onClick={() => setProvider('ollama')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                      provider === 'ollama'
                        ? 'border-amber-500/80 bg-amber-500/15 shadow-md shadow-amber-500/10 text-white'
                        : 'border-slate-800 bg-slate-950/50 hover:bg-slate-800/50 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Terminal size={15} className={provider === 'ollama' ? 'text-amber-400' : 'text-slate-500'} />
                      <span className="text-xs font-bold text-white">Ollama</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      Yerel Çevrimdışı LLM (Port 11434)
                    </p>
                    {provider === 'ollama' && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    )}
                  </button>

                  {/* 5. Custom / OpenAI */}
                  <button
                    type="button"
                    id="provider-custom-btn"
                    onClick={() => setProvider('custom')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                      provider === 'custom'
                        ? 'border-purple-500/80 bg-purple-500/15 shadow-md shadow-purple-500/10 text-white'
                        : 'border-slate-800 bg-slate-950/50 hover:bg-slate-800/50 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Server size={15} className={provider === 'custom' ? 'text-purple-400' : 'text-slate-500'} />
                      <span className="text-xs font-bold text-white">Özel Endpoint</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      Özel URL veya OpenAI Uyumlu
                    </p>
                    {provider === 'custom' && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    )}
                  </button>

                </div>
              </div>

              {/* Provider Config Detail Panels */}

              {/* 1. Google Gemini Config */}
              {provider === 'gemini' && (
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">Gemini Model Seçimi</label>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <Shield size={12} /> Google Search Grounding Aktif
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setGeminiModel('gemini-3.7-flash')}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                        geminiModel === 'gemini-3.7-flash' || geminiModel === 'gemini-3.6-flash'
                          ? 'border-emerald-500 bg-emerald-500/15 text-white'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="font-semibold text-xs text-emerald-300">gemini-3.7-flash</div>
                      <div className="text-[10px] text-slate-400">En Yeni Nesil & Akıllı Hız</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGeminiModel('gemini-3.1-pro-preview')}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                        geminiModel === 'gemini-3.1-pro-preview'
                          ? 'border-emerald-500 bg-emerald-500/15 text-white'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="font-semibold text-xs text-cyan-300">gemini-3.1-pro-preview</div>
                      <div className="text-[10px] text-slate-400">Derin Muhakeme & Mantık</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGeminiModel('gemini-3.1-flash-lite')}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                        geminiModel === 'gemini-3.1-flash-lite'
                          ? 'border-emerald-500 bg-emerald-500/15 text-white'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="font-semibold text-xs text-indigo-300">gemini-3.1-flash-lite</div>
                      <div className="text-[10px] text-slate-400">Ultra Düşük Gecikme</div>
                    </button>
                  </div>

                  {/* Gemini Temperature & Search Grounding */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-slate-300 font-medium">Sıcaklık (Temperature):</span>
                        <span className="font-mono text-emerald-400 font-bold">{geminiTemperature}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={geminiTemperature}
                        onChange={(e) => setGeminiTemperature(parseFloat(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                      <span className="text-[10px] text-slate-500">0.0 (Kesin & Matematiksel) - 1.0 (Yaratıcı)</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-slate-900/80 border border-slate-800 rounded-lg">
                      <div>
                        <div className="text-xs font-medium text-slate-200">Google Search Grounding</div>
                        <div className="text-[10px] text-slate-400">Güncel web ve finans verileriyle zenginleştir</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={geminiSearchGrounding}
                        onChange={(e) => setGeminiSearchGrounding(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-500 focus:ring-0 cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. OpenRouter Config */}
              {provider === 'openrouter' && (
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-4 animate-in fade-in duration-150">
                  <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-lg text-xs text-cyan-300 leading-relaxed">
                    <strong>OpenRouter Entegrasyonu:</strong> Tek bir API anahtarı ile DeepSeek R1, Claude 3.7 Sonnet, Meta LLaMA 3.3 70B ve yüzlerce global AI modelini doğrudan MarketPulse AI içinde kullanabilirsiniz.
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      OpenRouter API Anahtarı (API Key)
                    </label>
                    <div className="relative">
                      <input
                        type={showOpenRouterKey ? 'text' : 'password'}
                        value={openRouterApiKey}
                        onChange={(e) => setOpenRouterApiKey(e.target.value)}
                        placeholder="sk-or-v1-..."
                        className="w-full pl-3 pr-10 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOpenRouterKey(!showOpenRouterKey)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
                      >
                        {showOpenRouterKey ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      openrouter.ai/keys adresinden ücretsiz oluşturabileceğiniz kişisel anahtar.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Model Seçimi
                      </label>
                      <button
                        type="button"
                        onClick={handleFetchOpenRouterModels}
                        disabled={isFetchingOpenRouter}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw size={11} className={isFetchingOpenRouter ? 'animate-spin' : ''} />
                        {isFetchingOpenRouter ? 'Taranıyor...' : 'OpenRouter Modellerini Canlı Getir'}
                      </button>
                    </div>

                    {openRouterFetchedModels.length > 0 && (
                      <div className="mb-2 p-2.5 bg-slate-900 border border-cyan-500/30 rounded-lg">
                        <div className="text-[11px] text-cyan-300 font-medium mb-1">
                          Aktif Hesabınızdan Çekilen Modeller ({openRouterFetchedModels.length}):
                        </div>
                        <select
                          value={openRouterModel}
                          onChange={(e) => setOpenRouterModel(e.target.value)}
                          className="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                        >
                          {openRouterFetchedModels.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name || m.id} ({m.id})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                      {openRouterPresetModels.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setOpenRouterModel(m.id)}
                          className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                            openRouterModel === m.id
                              ? 'border-cyan-500 bg-cyan-500/15 text-white'
                              : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <div className="font-semibold text-xs text-cyan-300">{m.name}</div>
                          <div className="text-[10px] text-slate-500">{m.tag}</div>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 whitespace-nowrap">Özel Model Adı:</span>
                      <input
                        type="text"
                        value={openRouterModel}
                        onChange={(e) => setOpenRouterModel(e.target.value)}
                        placeholder="deepseek/deepseek-r1"
                        className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-cyan-400 font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        OpenRouter Base URL (Opsiyonel)
                      </label>
                      <input
                        type="text"
                        value={openRouterBaseUrl}
                        onChange={(e) => setOpenRouterBaseUrl(e.target.value)}
                        placeholder="https://openrouter.ai/api/v1"
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-slate-300 font-medium">Sıcaklık (Temperature):</span>
                        <span className="font-mono text-cyan-400 font-bold">{openRouterTemperature}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={openRouterTemperature}
                        onChange={(e) => setOpenRouterTemperature(parseFloat(e.target.value))}
                        className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Site URL (HTTP-Referer)</label>
                      <input
                        type="text"
                        value={openRouterSiteUrl}
                        onChange={(e) => setOpenRouterSiteUrl(e.target.value)}
                        placeholder="https://yourdomain.com"
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Uygulama Başlığı (X-Title)</label>
                      <input
                        type="text"
                        value={openRouterAppName}
                        onChange={(e) => setOpenRouterAppName(e.target.value)}
                        placeholder="MarketPulse Terminal"
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. 9Router Full Comprehensive Connection Panel */}
              {provider === 'ninerouter' && (
                <NineRouterConnectionPanel
                  config={{
                    nineRouterBaseUrl,
                    nineRouterApiKey,
                    nineRouterModel,
                    nineRouterTimeout,
                    nineRouterTemperature,
                    nineRouterMaxTokens,
                    nineRouterFallbackToGemini,
                  }}
                  onChange={(patch) => {
                    if (patch.nineRouterBaseUrl !== undefined) setNineRouterBaseUrl(patch.nineRouterBaseUrl);
                    if (patch.nineRouterApiKey !== undefined) setNineRouterApiKey(patch.nineRouterApiKey);
                    if (patch.nineRouterModel !== undefined) setNineRouterModel(patch.nineRouterModel);
                    if (patch.nineRouterTimeout !== undefined) setNineRouterTimeout(patch.nineRouterTimeout);
                    if (patch.nineRouterTemperature !== undefined) setNineRouterTemperature(patch.nineRouterTemperature);
                    if (patch.nineRouterMaxTokens !== undefined) setNineRouterMaxTokens(patch.nineRouterMaxTokens);
                    if (patch.nineRouterFallbackToGemini !== undefined) setNineRouterFallbackToGemini(patch.nineRouterFallbackToGemini);
                  }}
                />
              )}

              {/* 4. Ollama Config */}
              {provider === 'ollama' && (
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-4 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Ollama Servis URL Adresi
                    </label>
                    <input
                      type="text"
                      value={ollamaUrl}
                      onChange={(e) => setOllamaUrl(e.target.value)}
                      placeholder="http://localhost:11434"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Kullanılacak Yerel Model
                    </label>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {popularOllamaModels.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setOllamaModel(m.id)}
                          className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                            ollamaModel === m.id
                              ? 'border-amber-500 bg-amber-500/15 text-white'
                              : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <div className="font-semibold text-xs text-amber-300">{m.name}</div>
                          <div className="text-[10px] text-slate-500">{m.desc}</div>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 whitespace-nowrap">Özel Model Adı:</span>
                      <input
                        type="text"
                        value={ollamaModel}
                        onChange={(e) => setOllamaModel(e.target.value)}
                        placeholder="deepseek-r1:latest"
                        className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-amber-400 font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-slate-300 font-medium">Sıcaklık (Temperature):</span>
                      <span className="font-mono text-amber-400 font-bold">{ollamaTemperature}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={ollamaTemperature}
                      onChange={(e) => setOllamaTemperature(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    />
                  </div>

                  {availableOllamaModels.length > 0 && (
                    <div className="p-2.5 bg-amber-950/30 border border-amber-800/40 rounded-lg">
                      <div className="text-[11px] font-semibold text-amber-300 mb-1">
                        Ollama'da Tespit Edilen Yüklü Modelleriniz:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {availableOllamaModels.map((mod) => (
                          <button
                            key={mod}
                            type="button"
                            onClick={() => setOllamaModel(mod)}
                            className={`px-2 py-0.5 text-[10px] rounded font-mono cursor-pointer ${
                              ollamaModel === mod
                                ? 'bg-amber-500 text-slate-950 font-bold'
                                : 'bg-slate-800 text-amber-400 hover:bg-slate-700'
                            }`}
                          >
                            {mod}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 5. Custom Config */}
              {provider === 'custom' && (
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Base API URL
                    </label>
                    <input
                      type="text"
                      value={customBaseUrl}
                      onChange={(e) => setCustomBaseUrl(e.target.value)}
                      placeholder="https://api.openai.com/v1 veya http://localhost:8000/v1"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-300">
                          Model Adı
                        </label>
                        <button
                          type="button"
                          onClick={handleFetchCustomModels}
                          disabled={isFetchingCustom}
                          className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          <RefreshCw size={10} className={isFetchingCustom ? 'animate-spin' : ''} />
                          {isFetchingCustom ? 'Taranıyor...' : 'Modelleri Getir'}
                        </button>
                      </div>
                      {customFetchedModels.length > 0 ? (
                        <select
                          value={customModelName}
                          onChange={(e) => setCustomModelName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 font-mono focus:outline-none focus:border-purple-500"
                        >
                          {customFetchedModels.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name || m.id}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={customModelName}
                          onChange={(e) => setCustomModelName(e.target.value)}
                          placeholder="gpt-4o, claude-3-5-sonnet vb."
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 font-mono focus:outline-none focus:border-purple-500"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        API Anahtarı (Opsiyonel)
                      </label>
                      <input
                        type="password"
                        value={customApiKey}
                        onChange={(e) => setCustomApiKey(e.target.value)}
                        placeholder="sk-..."
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 font-mono focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-slate-300 font-medium">Sıcaklık (Temperature):</span>
                      <span className="font-mono text-purple-400 font-bold">{customTemperature}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={customTemperature}
                      onChange={(e) => setCustomTemperature(parseFloat(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TASK-BASED AI ROUTING (Görev Bazlı Yapay Zeka Yönlendirme) */}
          {activeTab === 'task_routes' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-xs text-emerald-300 flex items-start gap-2.5">
                <Layers className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                <div>
                  <strong className="block font-semibold mb-0.5">Görev Bazlı AI Yönlendirme Matrisi</strong>
                  Her finansal analitik görevine en uygun modeli atayabilirsiniz. Örneğin: Sohbet için hızlı Gemini, hisse ve fon analizleri için derin muhakemeli DeepSeek R1 (OpenRouter / 9Router), bülten için Claude veya yerel model belirleyebilirsiniz.
                </div>
              </div>

              <div className="space-y-3">
                {AI_TASKS_METADATA.map((task) => {
                  const isCustomized = Boolean(taskRoutes[task.key]);
                  const routeConfig = taskRoutes[task.key];
                  const currentProvider = routeConfig?.provider || provider;
                  const currentModel = routeConfig?.model || (
                    currentProvider === 'gemini' ? geminiModel :
                    currentProvider === 'openrouter' ? openRouterModel :
                    currentProvider === 'ninerouter' ? nineRouterModel :
                    ollamaModel
                  );

                  return (
                    <div
                      key={task.key}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isCustomized 
                          ? 'border-emerald-500/60 bg-emerald-950/10' 
                          : 'border-slate-800 bg-slate-950/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                            {task.icon}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-2">
                              {task.label}
                              {isCustomized ? (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                                  Özel Yönlendirildi
                                </span>
                              ) : (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-medium">
                                  Varsayılan Sağlayıcı
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">{task.description}</div>
                          </div>
                        </div>

                        {/* Toggle Custom Routing for Task */}
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isCustomized}
                            onChange={(e) => handleTaskRouteToggle(task.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </div>

                      {/* Custom Routing Config Inputs */}
                      {isCustomized && (
                        <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-150">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                              Özel AI Sağlayıcısı
                            </label>
                            <select
                              value={currentProvider}
                              onChange={(e) => {
                                const newP = e.target.value as AIProviderType;
                                const defaultM = newP === 'gemini' ? 'gemini-3.7-flash' :
                                  newP === 'openrouter' ? 'deepseek/deepseek-r1' :
                                  newP === 'ninerouter' ? 'local-default' :
                                  newP === 'ollama' ? 'deepseek-r1:latest' : 'custom-model';
                                updateTaskRoute(task.key, { provider: newP, model: defaultM });
                              }}
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                            >
                              <option value="gemini">Google Gemini (Bulut)</option>
                              <option value="openrouter">OpenRouter (Evrensel Bulut Yönlendirici)</option>
                              <option value="ninerouter">9Router (Yerel AI Yönlendirici)</option>
                              <option value="ollama">Ollama (Yerel LLM)</option>
                              <option value="custom">Özel Endpoint</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                              Kullanılacak Model Adı
                            </label>
                            <input
                              type="text"
                              value={currentModel}
                              onChange={(e) => updateTaskRoute(task.key, { model: e.target.value })}
                              placeholder="Model adı girin..."
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-emerald-400 font-mono focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: SYSTEM SETTINGS */}
          {activeTab === 'system' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-4">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Sliders size={14} className="text-indigo-400" />
                  Arayüz ve Tarayıcı Ayarları
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Fırsat Radarı Kapsamı</label>
                    <select
                      value={radarScope}
                      onChange={(e) => setRadarScope(e.target.value as 'ALL' | 'FAVORITES')}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="ALL">Tüm Varlıklar (Market Assets)</option>
                      <option value="FAVORITES">Sadece Favoriler (Watchlist)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Fırsat Radarı Görünümü</label>
                    <select
                      value={radarLayout}
                      onChange={(e) => setRadarLayout(e.target.value as 'GRID' | 'LIST')}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="GRID">Kart Görünümü (Grid)</option>
                      <option value="LIST">Liste Görünümü (Table)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Connection Test Result Banner */}
          {testStatus !== 'idle' && (
            <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
              testStatus === 'online'
                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                : testStatus === 'testing'
                ? 'bg-slate-950 border-slate-700 text-slate-300'
                : testStatus === 'warning'
                ? 'bg-amber-950/40 border-amber-800 text-amber-300'
                : 'bg-rose-950/40 border-rose-800 text-rose-300'
            }`}>
              <div className="flex items-center gap-2">
                {testStatus === 'testing' && <RefreshCw size={14} className="animate-spin text-cyan-400" />}
                {testStatus === 'online' && <CheckCircle2 size={15} className="text-emerald-400" />}
                {testStatus === 'warning' && <AlertTriangle size={15} className="text-amber-400" />}
                {testStatus === 'offline' && <AlertTriangle size={15} className="text-rose-400" />}
                <span className="font-medium">{testMessage}</span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            type="button"
            id="test-ai-connection-btn"
            onClick={handleTestConnection}
            disabled={testStatus === 'testing'}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={13} className={testStatus === 'testing' ? 'animate-spin' : ''} />
            <span>Sağlayıcı Bağlantısını Test Et</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              İptal
            </button>
            <button
              type="button"
              id="save-ai-model-config-btn"
              onClick={handleSave}
              className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              Ayarları Kaydet & Uygula
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIModelSettingsModal;

