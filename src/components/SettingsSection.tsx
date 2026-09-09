import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Key, 
  Send, 
  Crown, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Save, 
  Sliders, 
  ShieldCheck, 
  LogOut, 
  Eye, 
  EyeOff,
  ExternalLink,
  Zap,
  Sparkles,
  Layers,
  Bell,
  Cpu,
  Share2,
  Network,
  Terminal,
  Server,
  TrendingUp,
  MessageSquare,
  PieChart,
  Target,
  Compass,
  ShieldAlert
} from 'lucide-react';
import { AIModelConfig, AIProviderType, AITaskType, AITaskRouteConfig } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { safeFetchJson } from '../utils/apiClient';
import { NineRouterConnectionPanel } from './NineRouterConnectionPanel';

interface SettingsSectionProps {
  modelConfig: AIModelConfig;
  onSaveConfig: (newConfig: AIModelConfig) => void;
  onNavigateToPricing?: () => void;
  onNavigateToTab?: (tab: string) => void;
  onOpenModelSettings?: () => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  modelConfig,
  onSaveConfig,
  onNavigateToPricing,
  onNavigateToTab,
  onOpenModelSettings,
}) => {
  const { user, userData, logout } = useAuth();
  const { 
    tier, 
    plan, 
    usage, 
    remainingDailyQueries, 
    remainingAiReports, 
    openPricingModal,
    isAdmin
  } = useSubscription();

  const [activeTab, setActiveTab] = useState<'profile' | 'ai' | 'subscription' | 'view' | 'telegram'>('profile');

  // AI Settings State
  const [provider, setProvider] = useState<AIProviderType>(modelConfig.provider || 'gemini');
  const [geminiModel, setGeminiModel] = useState<string>(modelConfig.geminiModel || 'gemini-3.7-flash');
  const [openRouterApiKey, setOpenRouterApiKey] = useState<string>(modelConfig.openRouterApiKey || '');
  const [openRouterModel, setOpenRouterModel] = useState<string>(modelConfig.openRouterModel || 'deepseek/deepseek-r1');
  const [openRouterBaseUrl, setOpenRouterBaseUrl] = useState<string>(modelConfig.openRouterBaseUrl || 'https://openrouter.ai/api/v1');
  const [showOpenRouterKey, setShowOpenRouterKey] = useState(false);
  const [nineRouterBaseUrl, setNineRouterBaseUrl] = useState<string>(modelConfig.nineRouterBaseUrl || 'http://localhost:9999/v1');
  const [nineRouterModel, setNineRouterModel] = useState<string>(modelConfig.nineRouterModel || 'local-default');
  const [nineRouterApiKey, setNineRouterApiKey] = useState<string>(modelConfig.nineRouterApiKey || '');
  const [showNineRouterKey, setShowNineRouterKey] = useState(false);
  const [ollamaUrl, setOllamaUrl] = useState<string>(modelConfig.ollamaUrl || 'http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState<string>(modelConfig.ollamaModel || 'deepseek-r1:latest');
  const [customBaseUrl, setCustomBaseUrl] = useState<string>(modelConfig.customBaseUrl || '');
  const [customApiKey, setCustomApiKey] = useState<string>(modelConfig.customApiKey || '');
  const [customModelName, setCustomModelName] = useState<string>(modelConfig.customModelName || '');
  const [taskRoutes, setTaskRoutes] = useState<Partial<Record<AITaskType, AITaskRouteConfig>>>(modelConfig.taskRoutes || {});
  const [aiTestStatus, setAiTestStatus] = useState<'idle' | 'testing' | 'online' | 'offline' | 'warning'>('idle');
  const [aiTestMsg, setAiTestMsg] = useState('');
  const [aiSaveMsg, setAiSaveMsg] = useState<string | null>(null);

  // 9Router Advanced States
  const [nineRouterTimeout, setNineRouterTimeout] = useState<number>(modelConfig.nineRouterTimeout || 60);
  const [nineRouterTemperature, setNineRouterTemperature] = useState<number>(modelConfig.nineRouterTemperature ?? 0.7);
  const [nineRouterMaxTokens, setNineRouterMaxTokens] = useState<number>(modelConfig.nineRouterMaxTokens || 4096);
  const [nineRouterFallbackToGemini, setNineRouterFallbackToGemini] = useState<boolean>(modelConfig.nineRouterFallbackToGemini !== false);

  // Other LLM Advanced States
  const [openRouterTemperature, setOpenRouterTemperature] = useState<number>(modelConfig.openRouterTemperature ?? 0.7);
  const [openRouterSiteUrl, setOpenRouterSiteUrl] = useState<string>(modelConfig.openRouterSiteUrl || '');
  const [openRouterAppName, setOpenRouterAppName] = useState<string>(modelConfig.openRouterAppName || '');
  const [openRouterFetchedModels, setOpenRouterFetchedModels] = useState<Array<{ id: string; name: string }>>([]);
  const [isFetchingOpenRouter, setIsFetchingOpenRouter] = useState(false);

  const [geminiTemperature, setGeminiTemperature] = useState<number>(modelConfig.geminiTemperature ?? 0.7);
  const [geminiSearchGrounding, setGeminiSearchGrounding] = useState<boolean>(modelConfig.geminiSearchGrounding !== false);

  const [ollamaTemperature, setOllamaTemperature] = useState<number>(modelConfig.ollamaTemperature ?? 0.7);
  const [ollamaFetchedModels, setOllamaFetchedModels] = useState<Array<{ id: string; name: string }>>([]);
  const [isFetchingOllama, setIsFetchingOllama] = useState(false);

  const [customTemperature, setCustomTemperature] = useState<number>(modelConfig.customTemperature ?? 0.7);
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

  const handleFetchOllamaModels = async () => {
    setIsFetchingOllama(true);
    try {
      const res = await safeFetchJson<{ success: boolean; models: Array<{ id: string; name: string }> }>('/api/ai/fetch-models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'ollama',
          baseUrl: ollamaUrl,
        }),
      });
      if (res.data?.success && res.data.models) {
        setOllamaFetchedModels(res.data.models);
      }
    } catch {}
    finally {
      setIsFetchingOllama(false);
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

  // Appearance & Ticker Settings
  const [tickerSpeed, setTickerSpeed] = useState<number>(modelConfig.tickerSpeed ?? 60);
  const [newsTickerSpeed, setNewsTickerSpeed] = useState<number>(modelConfig.newsTickerSpeed ?? 80);
  const [radarScope, setRadarScope] = useState<'ALL' | 'FAVORITES'>(modelConfig.radarScope ?? 'ALL');
  const [radarLayout, setRadarLayout] = useState<'GRID' | 'LIST'>(modelConfig.radarLayout ?? 'GRID');

  // Telegram States
  const [telegramChatId, setTelegramChatId] = useState<string>(
    localStorage.getItem('marketpulse_telegram_chat_id') || ''
  );
  const [isTelegramLinked, setIsTelegramLinked] = useState<boolean>(
    localStorage.getItem('marketpulse_telegram_linked') === 'true'
  );
  const [telegramStatusMsg, setTelegramStatusMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);

  // Profile Action States
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  // Local Finance API Gateway States
  const [localFinanceEnabled, setLocalFinanceEnabled] = useState<boolean>(false);
  const [isLoadingFinanceSettings, setIsLoadingFinanceSettings] = useState<boolean>(false);
  const [financeApiMsg, setFinanceApiMsg] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchDbSettings = async () => {
      try {
        const res = await safeFetchJson<{ settings: any }>('/api/admin/db-settings');
        if (res.data?.settings?.localFinanceApi) {
          setLocalFinanceEnabled(!!res.data.settings.localFinanceApi.enabled);
        }
      } catch (err) {
        // Silently handle
      }
    };
    fetchDbSettings();
  }, []);

  const handleToggleLocalFinanceApi = async () => {
    setIsLoadingFinanceSettings(true);
    setFinanceApiMsg(null);
    const targetStatus = !localFinanceEnabled;
    try {
      const res = await safeFetchJson<{ settings: any }>('/api/admin/db-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          localFinanceApi: {
            enabled: targetStatus
          }
        })
      });
      if (res.ok) {
        setLocalFinanceEnabled(targetStatus);
        setFinanceApiMsg(
          targetStatus
            ? 'Harici Finans API Gateway (Port 3001) etkinleştirildi. Sunucunuzun açık olduğundan emin olun.'
            : 'Dahili yerel veri motoruna geçildi. Sistem dahili veritabanı ile kesintisiz çalışıyor.'
        );
      }
    } catch (err: any) {
      setFinanceApiMsg('Ayar güncellenirken bir hata oluştu.');
    } finally {
      setIsLoadingFinanceSettings(false);
    }
  };

  // Save State
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const handleSaveAiSettings = () => {
    setIsSaving(true);
    const updated: AIModelConfig = {
      ...modelConfig,
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
    };

    try {
      localStorage.setItem('marketpulse_ai_model_config', JSON.stringify(updated));
    } catch {}

    onSaveConfig(updated);

    setTimeout(() => {
      setIsSaving(false);
      setAiSaveMsg('Yapay zeka sağlayıcı ve model tercihleriniz başarıyla güncellendi.');
      setTimeout(() => setAiSaveMsg(null), 3500);
    }, 200);
  };

  const handleTestAiConnection = async () => {
    setAiTestStatus('testing');
    setAiTestMsg('Seçilen modele bağlantı sınanıyor...');

    const currentConfig: AIModelConfig = {
      ...modelConfig,
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
    };

    try {
      const { data, ok } = await safeFetchJson<{
        success?: boolean;
        status?: 'online' | 'offline' | 'warning' | 'testing';
        provider?: string;
        model?: string;
        latencyMs?: number;
        message?: string;
      }>('/api/ai/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelConfig: currentConfig }),
      });

      const isSuccess = data?.success === true || data?.status === 'online';

      if (ok && isSuccess) {
        setAiTestStatus('online');
        const activeProvider = (data?.provider || provider).toUpperCase();
        const activeModel = data?.model || (provider === 'ninerouter' ? nineRouterModel : provider === 'openrouter' ? openRouterModel : provider === 'ollama' ? ollamaModel : geminiModel);
        const latency = data?.latencyMs ? ` — Gecikme: ${data.latencyMs}ms` : '';
        setAiTestMsg(`✅ Bağlantı Başarılı! Sağlayıcı: ${activeProvider} (${activeModel})${latency}`);
      } else {
        setAiTestStatus(data?.status === 'warning' ? 'warning' : 'offline');
        setAiTestMsg(`❌ Bağlantı Başarısız: ${data?.message || 'Sunucudan yanıt alınamadı.'}`);
      }
    } catch (err: any) {
      setAiTestStatus('offline');
      setAiTestMsg(`❌ Ağ Hatası: ${err.message}`);
    }
  };

  const handleTaskRouteChange = (task: AITaskType, patch: Partial<AITaskRouteConfig>) => {
    setTaskRoutes(prev => {
      const existing = prev[task] || { task, useGlobal: true, provider, model: '' };
      return {
        ...prev,
        [task]: { ...existing, ...patch }
      };
    });
  };

  const handleSaveViewSettings = () => {
    setIsSaving(true);
    const updated: AIModelConfig = {
      ...modelConfig,
      tickerSpeed,
      newsTickerSpeed,
      radarScope,
      radarLayout,
    };

    try {
      localStorage.setItem('marketpulse_ai_model_config', JSON.stringify(updated));
    } catch {}

    onSaveConfig(updated);

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccessMsg('Görünüm ve akış ayarlarınız başarıyla kaydedildi.');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }, 200);
  };

  const handleSendPasswordReset = async () => {
    if (!user?.email) return;
    setIsResettingPassword(true);
    setProfileMsg(null);
    try {
      await sendPasswordResetEmail(auth, user.email);
      setPasswordResetSent(true);
      setProfileMsg(`Şifre sıfırlama bağlantısı ${user.email} adresine gönderildi.`);
    } catch (err: any) {
      setProfileMsg('Şifre sıfırlama bağlantısı gönderilemedi: ' + err.message);
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleSaveTelegram = () => {
    const cleanId = telegramChatId.trim();
    localStorage.setItem('marketpulse_telegram_chat_id', cleanId);
    localStorage.setItem('marketpulse_telegram_linked', cleanId ? 'true' : 'false');
    setIsTelegramLinked(!!cleanId);
    setTelegramStatusMsg({
      text: cleanId ? 'Telegram Chat ID başarıyla kaydedildi.' : 'Telegram bağlantısı kaldırıldı.',
      type: 'success'
    });
    setTimeout(() => setTelegramStatusMsg(null), 4000);
  };

  const handleTestTelegram = async () => {
    if (!telegramChatId.trim()) {
      setTelegramStatusMsg({ text: 'Lütfen önce Telegram Chat ID girin.', type: 'error' });
      return;
    }
    setIsTestingTelegram(true);
    setTelegramStatusMsg(null);
    try {
      const res = await fetch('/api/telegram/test-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: telegramChatId.trim() })
      });
      const data = await res.json();
      if (data.ok || data.success) {
        setTelegramStatusMsg({ text: 'Test mesajı Telegram hesabınıza başarıyla gönderildi!', type: 'success' });
      } else {
        setTelegramStatusMsg({ text: data.error || 'Telegram mesajı iletilemedi. Botu başlattığınızdan (/start) emin olun.', type: 'error' });
      }
    } catch (err: any) {
      setTelegramStatusMsg({ text: 'İletişim hatası: ' + err.message, type: 'error' });
    } finally {
      setIsTestingTelegram(false);
    }
  };

  return (
    <div id="user-settings-section" className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <UserIcon className="text-indigo-400" size={24} />
              Kullanıcı Hesap & Tercih Ayarları
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Kişisel profilinizi, görünüm tercihlerinizi, Telegram bildirimlerinizi ve üyelik paketinizi yönetin.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-slate-300">
              {user?.email}
            </span>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
          
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <UserIcon size={14} />
            Profil & Güvenlik
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ai'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Cpu size={14} className={activeTab === 'ai' ? 'text-emerald-300' : 'text-emerald-400'} />
            Yapay Zeka & Model Seçimi
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 font-mono font-bold">
              {provider === 'openrouter' ? 'OpenRouter' : provider === 'ninerouter' ? '9Router' : provider === 'ollama' ? 'Ollama' : provider === 'custom' ? 'Özel' : 'Gemini'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('subscription')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'subscription'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Crown size={14} className={activeTab === 'subscription' ? 'text-amber-300' : 'text-purple-400'} />
            Üyelik & Kotalarım
          </button>

          <button
            onClick={() => setActiveTab('view')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'view'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Eye size={14} />
            Görünüm & Akış Hızları
          </button>

          <button
            onClick={() => setActiveTab('telegram')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'telegram'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30 font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Send size={14} />
            Telegram Alarmları
          </button>

        </div>
      </div>

      {/* TAB 1: Profil & Güvenlik */}
      {activeTab === 'profile' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="font-bold text-white text-sm flex items-center gap-2">
              <UserIcon className="text-indigo-400" size={18} />
              Hesap Bilgileri & Güvenlik
            </h2>
            <span className="text-[11px] text-slate-500 font-mono">
              UID: {user?.uid || 'Giriş yapılmadı'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Account Details */}
            <div className="space-y-4 p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
              <h3 className="text-xs font-bold text-slate-300">Profil Detayları</h3>
              
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">E-posta Adresi</label>
                <input
                  type="text"
                  disabled
                  value={user?.email || '—'}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 font-mono cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Kullanıcı Adı / İsim</label>
                <input
                  type="text"
                  disabled
                  value={userData?.fullName || user?.displayName || 'Yatırımcı'}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Hesap Türü</label>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/30">
                    {userData?.role === 'admin' ? '🛡️ Sistem Yöneticisi' : '👤 Bireysel Yatırımcı'}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Actions */}
            <div className="space-y-4 p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-300">Şifre & Oturum Güvenliği</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Hesabınızın güvenliği için parolanızı periyodik olarak sıfırlayabilirsiniz.
                </p>

                {profileMsg && (
                  <div className={`p-3 rounded-lg text-xs flex items-center gap-2 border ${
                    passwordResetSent 
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' 
                      : 'bg-rose-950/40 border-rose-800 text-rose-300'
                  }`}>
                    {passwordResetSent ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                    <span>{profileMsg}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleSendPasswordReset}
                  disabled={isResettingPassword || !user?.email}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isResettingPassword ? <RefreshCw className="animate-spin" size={14} /> : <Key size={14} />}
                  Şifre Sıfırlama E-postası Gönder
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold rounded-xl border border-rose-500/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut size={14} />
                  Oturumu Kapat
                </button>
              </div>
            </div>

            {/* Harici API Gateway / Dahili Veri Motoru Modu Card */}
            <div className="bg-slate-950/80 border border-orange-500/30 rounded-2xl p-5 space-y-4 shadow-xl relative overflow-hidden md:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    <Server size={20} className={localFinanceEnabled ? 'animate-pulse text-orange-400' : 'text-slate-400'} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      Finans Veri Akışı & API Gateway Modu
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                        localFinanceEnabled 
                          ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' 
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {localFinanceEnabled ? 'HARİCİ API (Port 3001)' : 'DAHİLİ MOTOR (Etkin)'}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {localFinanceEnabled 
                        ? 'Sistem ikincil finans sunucunuzdan (localhost:3001 veya tünel) veri çekmeye çalışıyor.' 
                        : 'Sistem dahili Yahoo Finance + TEFAS / KAP veri motoru ile sorunsuz ve kesintisiz çalışıyor.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleLocalFinanceApi}
                  disabled={isLoadingFinanceSettings}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md shrink-0 ${
                    localFinanceEnabled
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
                      : 'bg-slate-800 hover:bg-slate-700 text-orange-300 border border-slate-700'
                  }`}
                >
                  <RefreshCw size={13} className={isLoadingFinanceSettings ? 'animate-spin' : ''} />
                  {localFinanceEnabled ? 'Dahili Veri Motoruna Geç (Harici API Devre Dışı)' : 'Harici API Gateway\'i Etkinleştir'}
                </button>
              </div>

              {financeApiMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 size={15} />
                  <span>{financeApiMsg}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-1">
                <span>Port, tünel veya API Key detaylarını yönetmek için:</span>
                {onNavigateToTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateToTab('admin')}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-purple-300 font-semibold rounded-lg border border-slate-700 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <ShieldAlert size={12} /> Yönetim Konsolu (DB & API Entegrasyonu) Sayfasına Git
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB: Yapay Zeka & Model Tercihleri */}
      {activeTab === 'ai' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                <Cpu className="text-emerald-400" size={20} />
                Yapay Zeka Sağlayıcı ve Model Yönetimi
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Seçtiğiniz yapay zeka sağlayıcısı ve modeli; <strong>Hisse Analizi</strong>, <strong>TEFAS Fon Değerlemeleri</strong>, <strong>Yapay Zeka Danışmanı</strong>, <strong>Fırsat Radarı</strong> ve <strong>Portföy Backtest</strong> dahil olmak üzere sistemin tüm analiz motorlarında doğrudan çalışır.
              </p>
            </div>

            {onOpenModelSettings && (
              <button
                type="button"
                onClick={onOpenModelSettings}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
              >
                <Sliders size={14} />
                Modal Olarak Aç
              </button>
            )}
          </div>

          {/* Toast / Notification */}
          {aiSaveMsg && (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>{aiSaveMsg}</span>
            </div>
          )}

          {/* Provider Selection Cards */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Sparkles size={14} className="text-emerald-400" />
              Aktif AI Sağlayıcısı Seçimi
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              
              {/* 1. Google Gemini */}
              <button
                type="button"
                onClick={() => setProvider('gemini')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  provider === 'gemini'
                    ? 'bg-emerald-500/10 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-white flex items-center gap-1.5">
                    <Sparkles size={14} className="text-emerald-400" />
                    Google Gemini
                  </span>
                  {provider === 'gemini' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Google DeepMind modelleri, Google Search zeminlemesi ve yüksek işlem hızı.
                </p>
              </button>

              {/* 2. OpenRouter */}
              <button
                type="button"
                onClick={() => setProvider('openrouter')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  provider === 'openrouter'
                    ? 'bg-indigo-500/10 border-indigo-500/60 shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-white flex items-center gap-1.5">
                    <Share2 size={14} className="text-indigo-400" />
                    OpenRouter
                  </span>
                  {provider === 'openrouter' && (
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  DeepSeek R1/V3, Claude 3.7, LLaMA 3.3 ve GPT modelleri için evrensel bulut yönlendirici.
                </p>
              </button>

              {/* 3. 9Router */}
              <button
                type="button"
                onClick={() => setProvider('ninerouter')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  provider === 'ninerouter'
                    ? 'bg-violet-500/10 border-violet-500/60 shadow-lg shadow-violet-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-white flex items-center gap-1.5">
                    <Network size={14} className="text-violet-400" />
                    9Router (Yerel)
                  </span>
                  {provider === 'ninerouter' && (
                    <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Bilgisayarınızdaki 9Router sunucusu (localhost:9999/v1). Yerel modeller için ideal.
                </p>
              </button>

              {/* 4. Ollama */}
              <button
                type="button"
                onClick={() => setProvider('ollama')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  provider === 'ollama'
                    ? 'bg-cyan-500/10 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-white flex items-center gap-1.5">
                    <Terminal size={14} className="text-cyan-400" />
                    Ollama
                  </span>
                  {provider === 'ollama' && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Yerel Ollama kurulumu (localhost:11434). Tamamen çevrimdışı ve gizlilik odaklı.
                </p>
              </button>

              {/* 5. Custom */}
              <button
                type="button"
                onClick={() => setProvider('custom')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  provider === 'custom'
                    ? 'bg-amber-500/10 border-amber-500/60 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-white flex items-center gap-1.5">
                    <Server size={14} className="text-amber-400" />
                    Özel API
                  </span>
                  {provider === 'custom' && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  OpenAI uyumlu herhangi bir özel proxy, vLLM veya kurumsal LLM sunucusu.
                </p>
              </button>

            </div>
          </div>

          {/* Provider Specific Configuration Panel */}
          <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-4">
            
            {/* Gemini Config */}
            {provider === 'gemini' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-emerald-400" />
                    Google Gemini Modeli
                  </label>
                  <span className="text-[11px] text-emerald-400/90 font-mono flex items-center gap-1">
                    <ShieldCheck size={13} /> Sunucu Güvenli API Anahtarı
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'gemini-3.7-flash', name: 'Gemini 3.7 Flash', desc: 'En yeni nesil & akıllı hibrit hız (Önerilen)' },
                    { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro', desc: 'Karmaşık finansal analizler ve derin muhakeme' },
                    { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash-Lite', desc: 'Ultra düşük gecikme ve anlık sinyal üretimi' },
                    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', desc: 'Yüksek verimli analitik ve hızlı yanıt' },
                    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', desc: 'Geniş bağlam ve derin raporlama' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setGeminiModel(m.id)}
                      className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                        geminiModel === m.id
                          ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{m.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{m.desc}</div>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/60">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-300">Yaratıcılık / Sıcaklık (Temperature)</span>
                      <span className="text-emerald-400 font-mono font-bold">{geminiTemperature}</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.05"
                      value={geminiTemperature}
                      onChange={(e) => setGeminiTemperature(parseFloat(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>0.0 (Tamamen Deterministik / Sayısal)</span>
                      <span>1.0 (Yaratıcı & Yorumlayıcı)</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <Zap size={14} className="text-amber-400" />
                        Google Canlı Arama Grounding
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Gemini analizlerine anlık Google web arama verilerini entegre eder
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={geminiSearchGrounding}
                      onChange={(e) => setGeminiSearchGrounding(e.target.checked)}
                      className="w-4 h-4 accent-emerald-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* OpenRouter Config */}
            {provider === 'openrouter' && (
              <div className="space-y-4">
                <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl text-xs text-cyan-300 leading-relaxed">
                  <strong>OpenRouter Entegrasyonu:</strong> Tek bir API anahtarı ile DeepSeek R1, Claude 3.7 Sonnet, Meta LLaMA 3.3 70B ve yüzlerce global AI modelini doğrudan MarketPulse AI içinde kullanabilirsiniz.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Key size={14} className="text-cyan-400" />
                      OpenRouter API Anahtarı
                    </label>
                    <div className="relative">
                      <input
                        type={showOpenRouterKey ? 'text' : 'password'}
                        value={openRouterApiKey}
                        onChange={(e) => setOpenRouterApiKey(e.target.value)}
                        placeholder="sk-or-v1-..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOpenRouterKey(!showOpenRouterKey)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        {showOpenRouterKey ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      openrouter.ai/keys adresinden temin ettiğiniz API anahtarı.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <Share2 size={14} className="text-cyan-400" />
                        Model Tanımlayıcısı
                      </label>
                      <button
                        type="button"
                        onClick={handleFetchOpenRouterModels}
                        disabled={isFetchingOpenRouter}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw size={11} className={isFetchingOpenRouter ? 'animate-spin' : ''} />
                        Canlı Modelleri Çek
                      </button>
                    </div>
                    <input
                      type="text"
                      value={openRouterModel}
                      onChange={(e) => setOpenRouterModel(e.target.value)}
                      placeholder="deepseek/deepseek-r1"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none"
                    />

                    {openRouterFetchedModels.length > 0 && (
                      <div className="p-2 bg-slate-900/90 border border-cyan-800/50 rounded-lg max-h-32 overflow-y-auto space-y-1">
                        <div className="text-[10px] text-slate-400 font-bold px-1">Seçilebilir OpenRouter Modelleri ({openRouterFetchedModels.length}):</div>
                        <div className="grid grid-cols-2 gap-1">
                          {openRouterFetchedModels.slice(0, 16).map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setOpenRouterModel(m.id)}
                              className={`text-[10px] px-2 py-1 rounded text-left truncate font-mono transition-colors ${
                                openRouterModel === m.id ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              }`}
                            >
                              {m.name || m.id}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[
                        { label: 'DeepSeek R1', id: 'deepseek/deepseek-r1' },
                        { label: 'DeepSeek V3', id: 'deepseek/deepseek-chat' },
                        { label: 'Claude 3.7', id: 'anthropic/claude-3.7-sonnet' },
                        { label: 'LLaMA 3.3 70B', id: 'meta-llama/llama-3.3-70b-instruct' },
                        { label: 'Gemini 2.5 Flash', id: 'google/gemini-2.5-flash' },
                        { label: 'GPT-4o Mini', id: 'openai/gpt-4o-mini' },
                      ].map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setOpenRouterModel(preset.id)}
                          className={`text-[10px] px-2 py-0.5 rounded-md border font-mono transition-all cursor-pointer ${
                            openRouterModel === preset.id
                              ? 'bg-cyan-600 text-white border-cyan-500 font-bold'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/60">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">Sıcaklık (Temperature: {openRouterTemperature})</label>
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.05"
                      value={openRouterTemperature}
                      onChange={(e) => setOpenRouterTemperature(parseFloat(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">Base URL (Opsiyonel)</label>
                    <input
                      type="text"
                      value={openRouterBaseUrl}
                      onChange={(e) => setOpenRouterBaseUrl(e.target.value)}
                      placeholder="https://openrouter.ai/api/v1"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">Uygulama Adı (X-Title)</label>
                    <input
                      type="text"
                      value={openRouterAppName}
                      onChange={(e) => setOpenRouterAppName(e.target.value)}
                      placeholder="MarketPulse Terminal"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 9Router Full Comprehensive Connection Panel */}
            {provider === 'ninerouter' && (
              <NineRouterConnectionPanel
                config={{
                  nineRouterBaseUrl,
                  nineRouterModel,
                  nineRouterApiKey,
                  nineRouterTimeout,
                  nineRouterTemperature,
                  nineRouterMaxTokens,
                  nineRouterFallbackToGemini,
                }}
                onChange={(patch) => {
                  if (patch.nineRouterBaseUrl !== undefined) setNineRouterBaseUrl(patch.nineRouterBaseUrl);
                  if (patch.nineRouterModel !== undefined) setNineRouterModel(patch.nineRouterModel);
                  if (patch.nineRouterApiKey !== undefined) setNineRouterApiKey(patch.nineRouterApiKey);
                  if (patch.nineRouterTimeout !== undefined) setNineRouterTimeout(patch.nineRouterTimeout);
                  if (patch.nineRouterTemperature !== undefined) setNineRouterTemperature(patch.nineRouterTemperature);
                  if (patch.nineRouterMaxTokens !== undefined) setNineRouterMaxTokens(patch.nineRouterMaxTokens);
                  if (patch.nineRouterFallbackToGemini !== undefined) setNineRouterFallbackToGemini(patch.nineRouterFallbackToGemini);
                }}
              />
            )}

            {/* Ollama Config */}
            {provider === 'ollama' && (
              <div className="space-y-4">
                <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl text-xs text-amber-300 leading-relaxed">
                  <strong>Ollama Yerel Yapay Zeka:</strong> Bilgisayarınızda yerel çalışan Ollama servisine doğrudan bağlanır. Tamamen çevrimdışı ve ücretsiz finansal çıkarım sağlar.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Terminal size={14} className="text-amber-400" />
                      Ollama Sunucu URL
                    </label>
                    <input
                      type="text"
                      value={ollamaUrl}
                      onChange={(e) => setOllamaUrl(e.target.value)}
                      placeholder="http://localhost:11434"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-500">Varsayılan yerel port: http://localhost:11434</p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <Cpu size={14} className="text-amber-400" />
                        Ollama Model Adı
                      </label>
                      <button
                        type="button"
                        onClick={handleFetchOllamaModels}
                        disabled={isFetchingOllama}
                        className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw size={11} className={isFetchingOllama ? 'animate-spin' : ''} />
                        Yüklü Modelleri Çek
                      </button>
                    </div>
                    <input
                      type="text"
                      value={ollamaModel}
                      onChange={(e) => setOllamaModel(e.target.value)}
                      placeholder="deepseek-r1:latest"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono focus:border-amber-500 focus:outline-none"
                    />

                    {ollamaFetchedModels.length > 0 && (
                      <div className="p-2 bg-slate-900/90 border border-amber-800/50 rounded-lg max-h-32 overflow-y-auto space-y-1">
                        <div className="text-[10px] text-slate-400 font-bold px-1">Bilgisayarınızda Bulunan Modeller ({ollamaFetchedModels.length}):</div>
                        <div className="grid grid-cols-2 gap-1">
                          {ollamaFetchedModels.map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setOllamaModel(m.id)}
                              className={`text-[10px] px-2 py-1 rounded text-left truncate font-mono transition-colors ${
                                ollamaModel === m.id ? 'bg-amber-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              }`}
                            >
                              {m.name || m.id}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['deepseek-r1:latest', 'llama3.2:latest', 'qwen2.5:latest', 'mistral:latest'].map((name) => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => setOllamaModel(name)}
                          className={`text-[10px] px-2 py-0.5 rounded-md border font-mono transition-all cursor-pointer ${
                            ollamaModel === name
                              ? 'bg-amber-600 text-white border-amber-500 font-bold'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/60">
                  <div className="space-y-1 max-w-sm">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-300">Sıcaklık (Temperature)</span>
                      <span className="text-amber-400 font-mono font-bold">{ollamaTemperature}</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.05"
                      value={ollamaTemperature}
                      onChange={(e) => setOllamaTemperature(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Custom API Config */}
            {provider === 'custom' && (
              <div className="space-y-4">
                <div className="p-3 bg-purple-950/20 border border-purple-800/40 rounded-xl text-xs text-purple-300 leading-relaxed">
                  <strong>Özel / OpenAI Uyumlu Endpoint:</strong> vLLM, LM Studio, Text Generation WebUI veya kurumsal AI sunucularınızın <code>/v1</code> endpoint'ine doğrudan bağlanır.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-200">API Endpoint URL</label>
                    <input
                      type="text"
                      value={customBaseUrl}
                      onChange={(e) => setCustomBaseUrl(e.target.value)}
                      placeholder="https://api.openai.com/v1"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-200">Model İsmi</label>
                      <button
                        type="button"
                        onClick={handleFetchCustomModels}
                        disabled={isFetchingCustom}
                        className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw size={11} className={isFetchingCustom ? 'animate-spin' : ''} />
                        Modelleri Çek
                      </button>
                    </div>
                    <input
                      type="text"
                      value={customModelName}
                      onChange={(e) => setCustomModelName(e.target.value)}
                      placeholder="gpt-4o veya custom-model"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-purple-300 font-mono focus:border-purple-500 focus:outline-none"
                    />

                    {customFetchedModels.length > 0 && (
                      <div className="p-2 bg-slate-900/90 border border-purple-800/50 rounded-lg max-h-32 overflow-y-auto space-y-1">
                        <div className="text-[10px] text-slate-400 font-bold px-1">Algılanan Modeller ({customFetchedModels.length}):</div>
                        <div className="grid grid-cols-2 gap-1">
                          {customFetchedModels.map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setCustomModelName(m.id)}
                              className={`text-[10px] px-2 py-1 rounded text-left truncate font-mono transition-colors ${
                                customModelName === m.id ? 'bg-purple-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              }`}
                            >
                              {m.name || m.id}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-200">API Key (Opsiyonel)</label>
                    <input
                      type="password"
                      value={customApiKey}
                      onChange={(e) => setCustomApiKey(e.target.value)}
                      placeholder="Bearer token"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/60">
                  <div className="space-y-1 max-w-sm">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-300">Sıcaklık (Temperature)</span>
                      <span className="text-purple-400 font-mono font-bold">{customTemperature}</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.05"
                      value={customTemperature}
                      onChange={(e) => setCustomTemperature(parseFloat(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Task-Based AI Routing Matrix (Görev Bazlı AI Yönlendirme) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Layers size={14} className="text-indigo-400" />
                Görev Bazlı AI Yönlendirme Matrisi (Task-Based AI Routing)
              </label>
              <span className="text-[11px] text-slate-400">
                Farklı finansal analiz görevlerine farklı modeller atayabilirsiniz.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { task: 'chatAdvisor' as AITaskType, title: 'Finansal Danışman & Sohbet', icon: MessageSquare, color: 'text-emerald-400', desc: 'Canlı piyasa ve TEFAS soruları' },
                { task: 'stockAnalysis' as AITaskType, title: 'Hisse & Bilanço Analizi', icon: TrendingUp, color: 'text-blue-400', desc: '6 Karne kriteri & değerleme' },
                { task: 'fundAnalysis' as AITaskType, title: 'TEFAS Fon Analizi', icon: PieChart, color: 'text-purple-400', desc: 'Fon metrikleri & Sharpe analizi' },
                { task: 'opportunityRadar' as AITaskType, title: 'Fırsat Radarı & Sinyaller', icon: Target, color: 'text-amber-400', desc: 'Algoritmik piyasa taraması' },
                { task: 'backtestAnalysis' as AITaskType, title: 'Portföy Backtest & Denetim', icon: Sliders, color: 'text-cyan-400', desc: 'Simülasyon stres testi raporu' },
                { task: 'macroAnalysis' as AITaskType, title: 'Makroekonomik Analiz', icon: Compass, color: 'text-rose-400', desc: 'FED & TCMB faiz/enflasyon bülteni' },
              ].map(({ task, title, icon: Icon, color, desc }) => {
                const route = taskRoutes[task] || { task, useGlobal: true, provider, model: '' };
                return (
                  <div key={task} className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon size={14} className={color} />
                        <span className="text-xs font-bold text-white">{title}</span>
                      </div>
                      <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!route.useGlobal}
                          onChange={(e) => handleTaskRouteChange(task, { useGlobal: !e.target.checked })}
                          className="accent-indigo-500 rounded cursor-pointer"
                        />
                        Özel Model
                      </label>
                    </div>
                    <p className="text-[10px] text-slate-500">{desc}</p>

                    {!route.useGlobal ? (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <select
                          value={route.provider || provider}
                          onChange={(e) => handleTaskRouteChange(task, { provider: e.target.value as AIProviderType })}
                          className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none"
                        >
                          <option value="gemini">Gemini</option>
                          <option value="openrouter">OpenRouter</option>
                          <option value="ninerouter">9Router</option>
                          <option value="ollama">Ollama</option>
                          <option value="custom">Özel</option>
                        </select>
                        <input
                          type="text"
                          value={route.model || ''}
                          onChange={(e) => handleTaskRouteChange(task, { model: e.target.value })}
                          placeholder="Model adı / path"
                          className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-white font-mono focus:outline-none"
                        />
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800/80 font-mono">
                        Genel Sağlayıcı: <span className="text-slate-200 font-bold">{provider.toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Test Status Banner */}
          {aiTestStatus !== 'idle' && (
            <div className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 animate-fadeIn ${
              aiTestStatus === 'testing'
                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                : aiTestStatus === 'online'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-semibold'
                : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
            }`}>
              <div className="flex items-center gap-2">
                {aiTestStatus === 'testing' ? (
                  <RefreshCw size={15} className="animate-spin text-indigo-400" />
                ) : aiTestStatus === 'online' ? (
                  <CheckCircle2 size={15} className="text-emerald-400" />
                ) : (
                  <AlertTriangle size={15} className="text-rose-400" />
                )}
                <span>{aiTestMsg}</span>
              </div>
            </div>
          )}

          {/* Save & Test Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleTestAiConnection}
              disabled={aiTestStatus === 'testing'}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={aiTestStatus === 'testing' ? 'animate-spin' : ''} />
              Sağlayıcı Bağlantısını Test Et
            </button>

            <button
              type="button"
              onClick={handleSaveAiSettings}
              disabled={isSaving}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              Yapay Zeka Tercihlerini Kaydet
            </button>
          </div>

        </div>
      )}

      {/* TAB 2: Üyelik & Kotalarım */}
      {activeTab === 'subscription' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
            <div>
              <h2 className="font-bold text-white text-sm flex items-center gap-2">
                {isAdmin ? (
                  <>
                    <ShieldCheck className="text-emerald-400" size={18} />
                    Yönetici Hesabı ve Sistem Durumu
                  </>
                ) : (
                  <>
                    <Crown className="text-purple-400" size={18} />
                    Mevcut Üyelik Paketiniz ve Kota Takibi
                  </>
                )}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isAdmin 
                  ? 'Sistem yöneticisi olduğunuz için herhangi bir pakete, kota ve limit sınırlandırmasına tabi değilsiniz.' 
                  : 'Kullanım haklarınızı ve günlük/haftalık limitlerinizi buradan izleyebilirsiniz.'}
              </p>
            </div>

            {isAdmin ? (
              <div className="px-3.5 py-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-xs rounded-xl flex items-center gap-2 select-none self-start sm:self-auto">
                <ShieldCheck size={14} className="text-emerald-400" />
                Yönetici Yetkisi (Sınırsız)
              </div>
            ) : (
              <button
                onClick={() => {
                  if (onNavigateToPricing) onNavigateToPricing();
                  else openPricingModal();
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <Sparkles size={14} />
                Paketimi Yükselt
              </button>
            )}
          </div>

          {/* Plan Card */}
          <div className={`p-5 rounded-2xl space-y-4 border ${
            isAdmin 
              ? 'bg-gradient-to-br from-slate-950 to-emerald-950/20 border-emerald-500/30' 
              : 'bg-gradient-to-br from-slate-950 to-purple-950/20 border-purple-500/30'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <span className={`text-[10px] font-black uppercase tracking-wider ${isAdmin ? 'text-emerald-400' : 'text-purple-400'}`}>
                  {isAdmin ? 'Hesap Statüsü' : 'Aktif Plan'}
                </span>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  {isAdmin ? 'Admin' : `${plan.displayName} Paketi`}
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    isAdmin 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                      : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  }`}>
                    {isAdmin ? 'PAKETE TABİ DEĞİL' : tier.toUpperCase()}
                  </span>
                </h3>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">{isAdmin ? 'Abonelik Durumu' : 'Fiyatlandırma'}</span>
                <span className="text-base font-black text-emerald-400">
                  {isAdmin ? 'Yönetici Muafiyeti' : (plan.priceMonthlyTRY === 0 ? 'Ücretsiz' : `${plan.priceMonthlyTRY} ₺ / ay`)}
                </span>
              </div>
            </div>

            {/* Quota Progress Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              {/* Daily Analysis Card */}
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Zap size={14} className="text-amber-400" />
                    Günlük Hisse & Teknik Analiz Kotası
                  </span>
                  <span className="font-mono font-bold text-amber-300">
                    {isAdmin ? 'Sınırsız (Admin)' : (plan.limits.dailyAnalysisQueries === -1 ? 'Sınırsız' : `${usage.analysisQueriesToday} / ${plan.limits.dailyAnalysisQueries}`)}
                  </span>
                </div>
                {!isAdmin && plan.limits.dailyAnalysisQueries !== -1 && (
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (usage.analysisQueriesToday / plan.limits.dailyAnalysisQueries) * 100)}%` }}
                    />
                  </div>
                )}
                <p className="text-[11px] text-slate-500">
                  {isAdmin
                    ? 'Yönetici hesabınız analiz sorgu limitlerine tabi değildir.'
                    : plan.limits.dailyAnalysisQueries === -1 
                    ? 'Limitsiz sorgulama hakkı.' 
                    : `Bugün kalan sorgu hakkınız: ${remainingDailyQueries}`}
                </p>
              </div>

              {/* Periodic AI Reports Card */}
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-indigo-400" />
                    AI Karne Raporu ({plan.limits.aiReportsPeriodType === 'day' ? 'Günlük' : 'Haftalık'})
                  </span>
                  <span className="font-mono font-bold text-indigo-300">
                    {isAdmin ? 'Sınırsız (Admin)' : (plan.limits.aiReportsPerPeriod === -1 ? 'Sınırsız' : `${usage.aiReportsThisPeriod} / ${plan.limits.aiReportsPerPeriod}`)}
                  </span>
                </div>
                {!isAdmin && plan.limits.aiReportsPerPeriod !== -1 && (
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (usage.aiReportsThisPeriod / plan.limits.aiReportsPerPeriod) * 100)}%` }}
                    />
                  </div>
                )}
                <p className="text-[11px] text-slate-500">
                  {isAdmin
                    ? 'Yönetici hesabınız yapay zeka istihbarat limitlerine tabi değildir.'
                    : plan.limits.aiReportsPerPeriod === -1 
                    ? 'Limitsiz derin istihbarat hakkı.' 
                    : `Kalan rapor hakkınız: ${remainingAiReports}`}
                </p>
              </div>

            </div>

            {/* Included Features */}
            <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-xl space-y-3">
              <h3 className="text-xs font-bold text-slate-300">
                {isAdmin ? 'Yönetici Hesabına Tanımlı Haklar (Tüm Özellikler Açık):' : 'Paketinizde Bulunan Özellikler:'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {(plan.featureBullets || []).map((bullet, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 size={13} className={bullet.included ? 'text-emerald-400 shrink-0' : 'text-slate-600 shrink-0'} />
                    <span className={bullet.included ? '' : 'line-through text-slate-500'}>{bullet.title}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: Görünüm & Akış Hızları */}
      {activeTab === 'view' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="text-amber-400" size={18} />
              <h2 className="font-bold text-white text-sm">Görünüm, Ticker ve Radar Ayarları</h2>
            </div>
            <button
              onClick={handleSaveViewSettings}
              disabled={isSaving}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
              Ayarları Kaydet
            </button>
          </div>

          {saveSuccessMsg && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 size={14} />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Ticker Speed */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200">
                  Canlı Fiyat Akış Bandı Hızı
                </label>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {tickerSpeed === 0 ? 'Durduruldu' : `${tickerSpeed}s`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={tickerSpeed}
                onChange={(e) => setTickerSpeed(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <p className="text-[11px] text-slate-400">
                Piyasa fiyat ticker bandının kayma hızını ayarlar (Max 5000, 0 = durdur).
              </p>
            </div>

            {/* News Ticker Speed */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200">
                  Canlı Haber Bandı Hızı
                </label>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {newsTickerSpeed === 0 ? 'Durduruldu' : `${newsTickerSpeed}s`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={newsTickerSpeed}
                onChange={(e) => setNewsTickerSpeed(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <p className="text-[11px] text-slate-400">
                Haber bandındaki akış hızını kontrol eder (Max 5000).
              </p>
            </div>

            {/* Radar Scope */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
              <label className="text-xs font-bold text-slate-200 block">
                Fırsat Radarı Varsayılan Kapsamı
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRadarScope('ALL')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                    radarScope === 'ALL'
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  Tüm Varlıklar (BIST/Kripto)
                </button>
                <button
                  type="button"
                  onClick={() => setRadarScope('FAVORITES')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                    radarScope === 'FAVORITES'
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  Sadece Takip Listem
                </button>
              </div>
            </div>

            {/* Radar Layout */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
              <label className="text-xs font-bold text-slate-200 block">
                Fırsat Radarı Varsayılan Düzeni
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRadarLayout('GRID')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                    radarLayout === 'GRID'
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  Izgara (Grid) Kartlar
                </button>
                <button
                  type="button"
                  onClick={() => setRadarLayout('LIST')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                    radarLayout === 'LIST'
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  Kompakt Liste (Table)
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 4: Telegram Alarmları */}
      {activeTab === 'telegram' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="font-bold text-white text-sm flex items-center gap-2">
              <Send className="text-sky-400" size={18} />
              Telegram Bildirim & Alarm Entegrasyonu
            </h2>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              isTelegramLinked 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              {isTelegramLinked ? '● Bağlandı' : '○ Bağlı Değil'}
            </span>
          </div>

          {telegramStatusMsg && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
              telegramStatusMsg.type === 'success' ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' :
              telegramStatusMsg.type === 'error' ? 'bg-rose-950/40 border-rose-800 text-rose-300' :
              'bg-sky-950/40 border-sky-800 text-sky-300'
            }`}>
              {telegramStatusMsg.type === 'success' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
              <span>{telegramStatusMsg.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Form */}
            <div className="space-y-4 p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
              <h3 className="text-xs font-bold text-slate-300">Telegram Botu Bağla</h3>
              
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Telegram Chat ID</label>
                <input
                  type="text"
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  placeholder="Örn: 123456789"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveTelegram}
                  className="flex-1 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save size={14} />
                  Kaydet
                </button>

                <button
                  type="button"
                  onClick={handleTestTelegram}
                  disabled={isTestingTelegram || !telegramChatId.trim()}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isTestingTelegram ? <RefreshCw className="animate-spin" size={14} /> : <Send size={14} />}
                  Test Gönder
                </button>
              </div>
            </div>

            {/* Instruction Card */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3 text-xs text-slate-300">
              <h3 className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                <Bell size={14} />
                Nasıl Bağlanır?
              </h3>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-400 leading-relaxed text-[11px]">
                <li>Telegram'da <strong className="text-white">@userinfobot</strong> veya botumuzu aratın.</li>
                <li>Botu başlatın (<code className="text-sky-300">/start</code>).</li>
                <li>Size verilen <strong className="text-white">ID</strong> numarasını kopyalayın.</li>
                <li>Yukarıdaki alana yapıştırıp <em>Kaydet</em> ve <em>Test Gönder</em> butonlarına tıklayın.</li>
              </ol>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
