import React, { useState } from 'react';
import { 
  Cpu, 
  Save, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Power, 
  Sliders, 
  Clock, 
  Sparkles, 
  ShieldAlert,
  Send
} from 'lucide-react';
import { safeFetchJson } from '../../utils/apiClient';

interface AiSettingsData {
  aiEnabled: boolean;
  freeTierModel: string;
  starterTierModel: string;
  proTierModel: string;
  premiumTierModel: string;
  defaultTemperature: number;
  maxTokens: number;
  updatedAt?: string;
  updatedBy?: string;
}

interface Props {
  settings: AiSettingsData;
  onSettingsUpdated: (newSettings: AiSettingsData) => void;
}

const AVAILABLE_MODELS = [
  { id: 'gemini-3.7-flash', name: 'Gemini 3.7 Flash (Google Cloud - Hızlı, Güncel & Yüksek Performans)', provider: 'Google Cloud' },
  { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro Preview (Google Cloud - İleri Mantık & Muhakeme)', provider: 'Google Cloud' },
  { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite (Google Cloud - Ultra Düşük Gecikme)', provider: 'Google Cloud' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro (Google Cloud - Geniş Bağlam)', provider: 'Google Cloud' },
  { id: 'deepseek-r1:latest', name: 'DeepSeek R1 (Yerel / Ollama / Muhakeme)', provider: 'Ollama / Local' },
  { id: 'llama3.3:70b', name: 'LLaMA 3.3 70B (Yerel / Ollama)', provider: 'Ollama / Local' },
  { id: 'qwen2.5:latest', name: 'Qwen 2.5 (Yerel / Ollama / Çok Dilli)', provider: 'Ollama / Local' },
  { id: 'mistral:latest', name: 'Mistral (Yerel / Ollama)', provider: 'Ollama / Local' },
];

export const AdminAiSettingsTab: React.FC<Props> = ({
  settings: initialSettings,
  onSettingsUpdated
}) => {
  const [settings, setSettings] = useState<AiSettingsData>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Live Test states
  const [testPrompt, setTestPrompt] = useState('THYAO hissesi için kısa teknik ve makro görünüm değerlendirmesi yap.');
  const [testModel, setTestModel] = useState(settings.proTierModel || 'gemini-3.7-flash');
  const [testResult, setTestResult] = useState<{ text?: string; durationMs?: number; error?: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const res = await safeFetchJson<{ success: boolean; error?: string }>('/api/admin/ai-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (res.ok && res.data?.success) {
        setSaveStatus({ type: 'success', message: 'AI motor ve model atamaları başarıyla kaydedildi ve yürürlüğe girdi.' });
        onSettingsUpdated(settings);
      } else {
        setSaveStatus({ type: 'error', message: res.data?.error || res.error || 'Ayarlar kaydedilemedi.' });
      }
    } catch (err: any) {
      setSaveStatus({ type: 'error', message: 'Hata: ' + err.message });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  const handleTestInference = async () => {
    setIsTesting(true);
    setTestResult(null);
    const start = performance.now();
    try {
      const res = await safeFetchJson<{ response?: string; text?: string; error?: string }>('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: testPrompt,
          modelConfig: {
            provider: testModel.startsWith('deepseek') ? 'ollama' : 'gemini',
            geminiModel: testModel,
            ollamaModel: testModel
          }
        })
      });

      const end = performance.now();
      const durationMs = Math.round(end - start);

      if (res.ok && (res.data?.response || res.data?.text)) {
        setTestResult({ text: res.data?.response || res.data?.text, durationMs });
      } else {
        setTestResult({ error: res.data?.error || res.error || 'AI yanıt üretemedi.', durationMs });
      }
    } catch (err: any) {
      const durationMs = Math.round(performance.now() - start);
      setTestResult({ error: 'İstek başarısız: ' + err.message, durationMs });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div id="admin-ai-settings-view" className="space-y-6">
      
      {/* Top Header & Save */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="text-emerald-400" size={20} />
            AI Motoru, Model Atamaları & Acil Durum Kontrolü
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Her üyelik seviyesine özel AI modellerini seçin, küresel AI şalterini (Kill-Switch) ve çıkarım parametrelerini yönetin.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
        >
          {isSaving ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
          AI Ayarlarını Kaydet
        </button>
      </div>

      {saveStatus && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-2 border ${
          saveStatus.type === 'success'
            ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
            : 'bg-rose-950/40 border-rose-800 text-rose-300'
        }`}>
          {saveStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          <span>{saveStatus.message}</span>
        </div>
      )}

      {/* Emergency AI Kill Switch Card */}
      <div className={`p-5 rounded-2xl border transition-all ${
        settings.aiEnabled
          ? 'bg-slate-900 border-slate-800'
          : 'bg-rose-950/30 border-rose-600/50 shadow-xl shadow-rose-950/40'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${settings.aiEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              <Power size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Küresel AI Servis Şalteri (Global Emergency Kill-Switch)
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                  settings.aiEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {settings.aiEnabled ? 'AKTİF (ONLINE)' : 'KAPALI (DURDURULDU)'}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Acil bir durumda veya kota aşımında tek bir tıkla tüm kullanıcıların ve agent'ların AI çağrılarını durdurun.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSettings(prev => ({ ...prev, aiEnabled: !prev.aiEnabled }))}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              settings.aiEnabled
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
            }`}
          >
            <Power size={14} />
            {settings.aiEnabled ? 'AI Servisini Kapat (Durdur)' : 'AI Servisini Aç (Devreye Al)'}
          </button>
        </div>
      </div>

      {/* Grid: Tier Model Assignments & Hyperparameters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Tier Model Mapping Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles size={16} className="text-purple-400" />
            Üyelik Paketine Özel AI Model Atamaları
          </h3>
          <p className="text-xs text-slate-400">
            Kullanıcılar analiz veya karne raporu istediğinde, sahip oldukları pakete göre bu model otomatik devreye girer.
          </p>

          <div className="space-y-3 pt-2">
            
            {/* Free */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Ücretsiz (Free) Paketi Modeli</span>
                <span className="text-[10px] text-slate-500 font-mono">Standart Yanıt</span>
              </label>
              <select
                value={settings.freeTierModel}
                onChange={(e) => setSettings(prev => ({ ...prev, freeTierModel: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              >
                {AVAILABLE_MODELS.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            {/* Starter */}
            <div className="p-3 bg-slate-950/70 border border-blue-500/20 rounded-xl space-y-1.5">
              <label className="text-xs font-bold text-blue-300 flex items-center justify-between">
                <span>Başlangıç (Starter) Paketi Modeli</span>
                <span className="text-[10px] text-blue-400 font-mono">Hızlı & Zengin</span>
              </label>
              <select
                value={settings.starterTierModel}
                onChange={(e) => setSettings(prev => ({ ...prev, starterTierModel: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              >
                {AVAILABLE_MODELS.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            {/* Pro */}
            <div className="p-3 bg-slate-950/70 border border-purple-500/20 rounded-xl space-y-1.5">
              <label className="text-xs font-bold text-purple-300 flex items-center justify-between">
                <span>Pro Paketi Modeli</span>
                <span className="text-[10px] text-purple-400 font-mono">Ensemble V2 & Kelly</span>
              </label>
              <select
                value={settings.proTierModel}
                onChange={(e) => setSettings(prev => ({ ...prev, proTierModel: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              >
                {AVAILABLE_MODELS.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            {/* Premium */}
            <div className="p-3 bg-slate-950/70 border border-amber-500/20 rounded-xl space-y-1.5">
              <label className="text-xs font-bold text-amber-300 flex items-center justify-between">
                <span>Kurumsal (Premium) Paketi Modeli</span>
                <span className="text-[10px] text-amber-400 font-mono">En Üst Seviye Muhakeme</span>
              </label>
              <select
                value={settings.premiumTierModel}
                onChange={(e) => setSettings(prev => ({ ...prev, premiumTierModel: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              >
                {AVAILABLE_MODELS.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Hyperparameters & AI Playground Test */}
        <div className="space-y-6">
          
          {/* Temperature & Token Settings */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders size={16} className="text-cyan-400" />
              Çıkarım Parametreleri (Hyperparameters)
            </h3>

            {/* Temperature */}
            <div className="space-y-2 p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200">Sıcaklık (Temperature - Yaratıcılık / Tutarlılık)</label>
                <span className="text-xs font-mono font-bold text-cyan-400">{settings.defaultTemperature}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={settings.defaultTemperature}
                onChange={(e) => setSettings(prev => ({ ...prev, defaultTemperature: Number(e.target.value) }))}
                className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <p className="text-[10px] text-slate-400">
                Finansal analizler için önerilen değer: <span className="text-cyan-300 font-mono">0.2 - 0.3</span> (halüsinasyonları önler).
              </p>
            </div>

            {/* Max Output Tokens */}
            <div className="space-y-2 p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
              <label className="text-xs font-bold text-slate-200 block">Maksimum Token Çıktısı (Max Tokens)</label>
              <div className="grid grid-cols-4 gap-2">
                {[1024, 2048, 4096, 8192].map((tokens) => (
                  <button
                    key={tokens}
                    type="button"
                    onClick={() => setSettings(prev => ({ ...prev, maxTokens: tokens }))}
                    className={`py-1.5 text-xs font-mono font-bold rounded-lg border transition-colors cursor-pointer ${
                      settings.maxTokens === tokens
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    {tokens}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Test Inference Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Zap size={16} className="text-amber-400" />
              Canlı AI Çıkarım Testi (Live Playground)
            </h3>

            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleTestInference}
                  disabled={isTesting || !testPrompt.trim()}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {isTesting ? <RefreshCw className="animate-spin" size={13} /> : <Send size={13} />}
                  Test Et
                </button>
              </div>

              {testResult && (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800/80 pb-1">
                    <span className="font-mono text-emerald-400">Model: {testModel}</span>
                    <span className="font-mono text-amber-400 flex items-center gap-1">
                      <Clock size={10} /> {testResult.durationMs} ms
                    </span>
                  </div>
                  {testResult.text && (
                    <p className="text-slate-200 leading-relaxed text-[11px] whitespace-pre-wrap">
                      {testResult.text}
                    </p>
                  )}
                  {testResult.error && (
                    <p className="text-rose-400 font-medium">{testResult.error}</p>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
