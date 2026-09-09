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
  Compass
} from 'lucide-react';
import { AIModelConfig, AIProviderType, AITaskType, AITaskRouteConfig } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { safeFetchJson } from '../utils/apiClient';

interface SettingsSectionProps {
  modelConfig: AIModelConfig;
  onSaveConfig: (newConfig: AIModelConfig) => void;
  onNavigateToPricing?: () => void;
  onOpenModelSettings?: () => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  modelConfig,
  onSaveConfig,
  onNavigateToPricing,
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

  // Save State
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const handleSaveAiSettings = () => {
    setIsSaving(true);
    const updated: AIModelConfig = {
      ...modelConfig,
      provider,
      geminiModel,
      openRouterApiKey,
      openRouterModel,
      openRouterBaseUrl,
      nineRouterBaseUrl,
      nineRouterModel,
      nineRouterApiKey,
      ollamaUrl,
      ollamaModel,
      customBaseUrl,
      customApiKey,
      customModelName,
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
      openRouterApiKey,
      openRouterModel,
      openRouterBaseUrl,
      nineRouterBaseUrl,
      nineRouterModel,
      nineRouterApiKey,
      ollamaUrl,
      ollamaModel,
      customBaseUrl,
      customApiKey,
      customModelName,
      taskRoutes,
    };

    try {
      const { data, ok } = await safeFetchJson<{
        success: boolean;
        provider: string;
        model: string;
        latencyMs: number;
        message: string;
      }>('/api/ai/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelConfig: currentConfig }),
      });

      if (ok && data?.success) {
        setAiTestStatus('online');
        setAiTestMsg(`✅ Bağlantı Başarılı! Sağlayıcı: ${data.provider.toUpperCase()} (${data.model}) — Gecikme: ${data.latencyMs}ms`);
      } else {
        setAiTestStatus('offline');
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
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-emerald-400" />
                    Google Gemini Modeli
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    API Key: Sistem Sunucusu Tarafından Sağlanır
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'gemini-3.7-flash', name: 'Gemini 3.7 Flash', desc: 'En hızlı ve yüksek doğruluklu genel model (Önerilen)' },
                    { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro', desc: 'Karmaşık finansal analizler ve derin muhakeme' },
                    { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash-Lite', desc: 'Ultra düşük gecikme ve hızlı sinyal üretimi' }
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
              </div>
            )}

            {/* OpenRouter Config */}
            {provider === 'openrouter' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Key size={14} className="text-indigo-400" />
                      OpenRouter API Anahtarı
                    </label>
                    <div className="relative">
                      <input
                        type={showOpenRouterKey ? 'text' : 'password'}
                        value={openRouterApiKey}
                        onChange={(e) => setOpenRouterApiKey(e.target.value)}
                        placeholder="sk-or-v1-..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none pr-10"
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
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Share2 size={14} className="text-indigo-400" />
                      Model Tanımlayıcısı
                    </label>
                    <input
                      type="text"
                      value={openRouterModel}
                      onChange={(e) => setOpenRouterModel(e.target.value)}
                      placeholder="deepseek/deepseek-r1"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                    />
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[
                        { label: 'DeepSeek R1', id: 'deepseek/deepseek-r1' },
                        { label: 'DeepSeek V3', id: 'deepseek/deepseek-chat' },
                        { label: 'Claude 3.7', id: 'anthropic/claude-3.7-sonnet' },
                        { label: 'LLaMA 3.3', id: 'meta-llama/llama-3.3-70b-instruct' },
                        { label: 'Gemini 2.5', id: 'google/gemini-2.5-flash' },
                        { label: 'GPT-4o Mini', id: 'openai/gpt-4o-mini' },
                      ].map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setOpenRouterModel(preset.id)}
                          className={`text-[10px] px-2 py-0.5 rounded-md border font-mono transition-all cursor-pointer ${
                            openRouterModel === preset.id
                              ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 9Router Config */}
            {provider === 'ninerouter' && (
              <div className="space-y-4">
                <div className="p-3 bg-violet-500/10 border border-violet-500/30 rounded-xl text-[11px] text-violet-300 leading-relaxed">
                  <strong>9Router Yerel Entegrasyonu:</strong> Bilgisayarınızda veya yerel sunucunuzda koşan 9Router servisini kullanır. Varsayılan olarak <code>http://localhost:9999/v1</code> portunu dinler.
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Network size={14} className="text-violet-400" />
                      9Router URL
                    </label>
                    <input
                      type="text"
                      value={nineRouterBaseUrl}
                      onChange={(e) => setNineRouterBaseUrl(e.target.value)}
                      placeholder="http://localhost:9999/v1"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-violet-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Cpu size={14} className="text-violet-400" />
                      Model Adı
                    </label>
                    <input
                      type="text"
                      value={nineRouterModel}
                      onChange={(e) => setNineRouterModel(e.target.value)}
                      placeholder="local-default"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-violet-500 focus:outline-none"
                    />
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['local-default', 'deepseek-r1', 'llama-3.3-70b', 'qwen-2.5-coder', 'mistral-small'].map((name) => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => setNineRouterModel(name)}
                          className={`text-[10px] px-2 py-0.5 rounded-md border font-mono transition-all cursor-pointer ${
                            nineRouterModel === name
                              ? 'bg-violet-600 text-white border-violet-500 font-bold'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Ollama Config */}
            {provider === 'ollama' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Terminal size={14} className="text-cyan-400" />
                      Ollama Sunucu URL
                    </label>
                    <input
                      type="text"
                      value={ollamaUrl}
                      onChange={(e) => setOllamaUrl(e.target.value)}
                      placeholder="http://localhost:11434"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Cpu size={14} className="text-cyan-400" />
                      Ollama Model Adı
                    </label>
                    <input
                      type="text"
                      value={ollamaModel}
                      onChange={(e) => setOllamaModel(e.target.value)}
                      placeholder="deepseek-r1:latest"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Custom API Config */}
            {provider === 'custom' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-200">API Endpoint URL</label>
                    <input
                      type="text"
                      value={customBaseUrl}
                      onChange={(e) => setCustomBaseUrl(e.target.value)}
                      placeholder="https://api.openai.com/v1"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-200">Model İsmi</label>
                    <input
                      type="text"
                      value={customModelName}
                      onChange={(e) => setCustomModelName(e.target.value)}
                      placeholder="gpt-4o"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-200">API Key (Opsiyonel)</label>
                    <input
                      type="password"
                      value={customApiKey}
                      onChange={(e) => setCustomApiKey(e.target.value)}
                      placeholder="Bearer token"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
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
