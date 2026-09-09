import { GoogleGenAI } from '@google/genai';
import { AIModelConfig, AIProviderType, AITaskType } from '../src/types';
import { getDynamicAiSettings } from './services/adminConfigService';

let geminiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined. Running in fallback mode.');
    }
    geminiClient = new GoogleGenAI({ 
      apiKey: apiKey || 'dummy-key',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return geminiClient;
}

export interface AICallOptions {
  prompt: string;
  systemPrompt?: string;
  modelConfig?: AIModelConfig;
  temperature?: number;
  useSearchGrounding?: boolean;
  task?: AITaskType; // Context task for task-based AI routing
}

export interface AICallResponse {
  text: string;
  modelUsed: string;
  provider: 'gemini' | 'openrouter' | 'ninerouter' | 'ollama' | 'custom' | 'fallback';
  sources?: { title: string; uri: string }[];
  isFallback?: boolean;
  warning?: string;
}

// In-memory cache for responses to conserve API quota and reduce latency
const responseCache = new Map<string, { timestamp: number; data: AICallResponse }>();
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes

export function normalizeGeminiModel(modelName?: string): string {
  if (!modelName) return 'gemini-3.7-flash';
  const clean = modelName.trim().toLowerCase();
  
  // Map legacy, typo or non-existent models to official Gemini models
  if (
    clean === 'gemini-3.6-flash' || 
    clean === 'gemini-1.5-flash' || 
    clean === 'gemini-2.0-flash' || 
    clean === 'gemini-flash' || 
    clean === 'flash'
  ) {
    return 'gemini-3.7-flash';
  }
  if (
    clean === 'gemini-pro' || 
    clean === 'gemini-1.5-pro' || 
    clean === 'gemini-2.0-pro' ||
    clean === 'gemini-3.0-pro'
  ) {
    return 'gemini-3.1-pro-preview';
  }
  if (clean.includes('3.7-flash')) return 'gemini-3.7-flash';
  if (clean.includes('3.1-pro')) return 'gemini-3.1-pro-preview';
  if (clean.includes('3.1-flash-lite')) return 'gemini-3.1-flash-lite';
  if (clean.includes('flash-latest')) return 'gemini-flash-latest';
  
  return clean.startsWith('gemini-') ? clean : 'gemini-3.7-flash';
}

function getCacheKey(prompt: string, modelName: string, provider: string, task?: string): string {
  const normModel = provider === 'gemini' ? normalizeGeminiModel(modelName) : modelName;
  return `${task || 'global'}:${provider}:${normModel}:${prompt.slice(0, 150)}`;
}

function isQuotaOrPermissionError(msg: string): boolean {
  if (!msg) return false;
  return (
    msg.includes('429') ||
    msg.includes('403') ||
    msg.includes('quota') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('PERMISSION_DENIED') ||
    msg.includes('dunning') ||
    msg.includes('deny')
  );
}

export async function executeAICompletion(options: AICallOptions): Promise<AICallResponse> {
  const { prompt, systemPrompt, modelConfig, temperature = 0.3, useSearchGrounding = false, task } = options;

  // 1. Resolve Effective Provider & Model from Task-Specific Routing
  let effectiveProvider: AIProviderType = modelConfig?.provider || 'gemini';
  let effectiveModelName = '';
  let effectiveBaseUrl = '';
  let effectiveApiKey = '';
  let effectiveTemperature = temperature;

  if (task && modelConfig?.taskRoutes?.[task]) {
    const taskRoute = modelConfig.taskRoutes[task]!;
    if (!taskRoute.useGlobal && taskRoute.provider) {
      effectiveProvider = taskRoute.provider;
      effectiveModelName = taskRoute.model;
      if (taskRoute.temperature !== undefined) effectiveTemperature = taskRoute.temperature;
      if (taskRoute.customBaseUrl) effectiveBaseUrl = taskRoute.customBaseUrl;
      if (taskRoute.customApiKey) effectiveApiKey = taskRoute.customApiKey;
    }
  }

  // Check global kill switch
  try {
    const aiSettings = await getDynamicAiSettings();
    if (!aiSettings.aiEnabled && effectiveProvider === 'gemini') {
      return {
        text: 'Sistem bakımı: AI analiz servisi sistem yöneticisi tarafından geçici olarak durdurulmuştur.',
        modelUsed: 'Devre Dışı (Admin Kill-Switch)',
        provider: 'fallback',
        isFallback: true,
        warning: 'AI analiz servisi yönetici tarafından kapatılmıştır.'
      };
    }
  } catch {}

  // Check cache first
  const activeModel = effectiveProvider === 'gemini' 
    ? normalizeGeminiModel(effectiveModelName || modelConfig?.geminiModel) 
    : (effectiveModelName || 
       (effectiveProvider === 'openrouter' ? (modelConfig?.openRouterModel || 'deepseek/deepseek-r1') : 
        effectiveProvider === 'ninerouter' ? (modelConfig?.nineRouterModel || 'local-default') : 
        effectiveProvider === 'ollama' ? (modelConfig?.ollamaModel || 'deepseek-r1:latest') : 
        (modelConfig?.customModelName || 'custom-llm')));

  const cacheKey = getCacheKey(prompt, activeModel, effectiveProvider, task);
  const cached = responseCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // ----------------------------------------------------
  // 2. OpenRouter Universal Cloud Router Inference
  // ----------------------------------------------------
  if (effectiveProvider === 'openrouter') {
    const openRouterUrl = (effectiveBaseUrl || modelConfig?.openRouterBaseUrl || 'https://openrouter.ai/api/v1').replace(/\/$/, '');
    const apiKey = effectiveApiKey || modelConfig?.openRouterApiKey || process.env.OPENROUTER_API_KEY;
    const model = effectiveModelName || modelConfig?.openRouterModel || 'deepseek/deepseek-r1';

    if (!apiKey) {
      console.warn('OpenRouter API Key tanımlanmamış. Fallback devreye alınıyor.');
      if (process.env.GEMINI_API_KEY) {
        const geminiRes = await runGeminiWithFallback(prompt, systemPrompt, 'gemini-3.7-flash', effectiveTemperature, useSearchGrounding);
        return {
          ...geminiRes,
          warning: `⚠️ OpenRouter API anahtarı girilmediği için Google Gemini devreye alındı. Ayarlardan OpenRouter API Key ekleyebilirsiniz.`,
        };
      }
      return {
        text: '',
        modelUsed: `OpenRouter (${model}) - API Key Eksik`,
        provider: 'fallback',
        isFallback: true,
        warning: 'OpenRouter API anahtarı bulunamadı. Lütfen Ayarlar > Yapay Zeka menüsünden API anahtarınızı girin.',
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s for deep reasoning models

      const messages: Array<{ role: string; content: string }> = [];
      if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
      messages.push({ role: 'user', content: prompt });

      const response = await fetch(`${openRouterUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.APP_URL || 'https://marketpulse.ai',
          'X-Title': 'MarketPulse AI',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: effectiveTemperature,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const choice = data.choices?.[0];
        let content = choice?.message?.content || '';
        if (!content && choice?.message?.reasoning) {
          content = choice.message.reasoning;
        }

        if (content) {
          const res: AICallResponse = {
            text: content,
            modelUsed: `OpenRouter (${model})`,
            provider: 'openrouter',
          };
          responseCache.set(cacheKey, { timestamp: Date.now(), data: res });
          return res;
        }
      } else {
        const errBody = await response.text();
        throw new Error(`OpenRouter HTTP ${response.status}: ${errBody}`);
      }
    } catch (err: any) {
      console.warn(`OpenRouter (${model}) hatası:`, err.message);
      if (process.env.GEMINI_API_KEY) {
        const geminiRes = await runGeminiWithFallback(prompt, systemPrompt, 'gemini-3.7-flash', effectiveTemperature, useSearchGrounding);
        return {
          ...geminiRes,
          warning: `⚠️ OpenRouter servisine ulaşılamadı (${err.message?.slice(0, 60)}). Google Gemini devreye alındı.`,
        };
      }
      return {
        text: '',
        modelUsed: `OpenRouter (${model}) - Bağlantı Hatası`,
        provider: 'fallback',
        isFallback: true,
        warning: `OpenRouter servisi yanıt vermedi: ${err.message}`,
      };
    }
  }

  // ----------------------------------------------------
  // 3. 9Router (Yerel AI Yönlendirici / Local Router)
  // ----------------------------------------------------
  if (effectiveProvider === 'ninerouter') {
    let nineUrl = (effectiveBaseUrl || modelConfig?.nineRouterBaseUrl || 'http://localhost:9999/v1').replace(/\/$/, '');
    const apiKey = effectiveApiKey || modelConfig?.nineRouterApiKey || process.env.NINEROUTER_API_KEY;
    const model = effectiveModelName || modelConfig?.nineRouterModel || 'local-default';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const messages: Array<{ role: string; content: string }> = [];
      if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
      messages.push({ role: 'user', content: prompt });

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      // 9Router endpoints: standard /chat/completions or /v1/chat/completions
      const targetEndpoint = nineUrl.endsWith('/chat/completions')
        ? nineUrl
        : nineUrl.endsWith('/v1')
        ? `${nineUrl}/chat/completions`
        : `${nineUrl}/v1/chat/completions`;

      let response = await fetch(targetEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model,
          messages,
          temperature: effectiveTemperature,
        }),
        signal: controller.signal,
      }).catch(async (e) => {
        // Fallback endpoint if /v1/ was duplicated or missing
        if (targetEndpoint.includes('/v1/chat/completions')) {
          const altEndpoint = `${nineUrl}/chat/completions`;
          return fetch(altEndpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify({ model, messages, temperature: effectiveTemperature }),
            signal: controller.signal,
          });
        }
        throw e;
      });
      clearTimeout(timeoutId);

      if (response && response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || data.response || '';
        if (content) {
          const res: AICallResponse = {
            text: content,
            modelUsed: `9Router (${model})`,
            provider: 'ninerouter',
          };
          responseCache.set(cacheKey, { timestamp: Date.now(), data: res });
          return res;
        }
      } else {
        const errText = response ? await response.text() : 'Yanıt yok';
        throw new Error(`9Router HTTP ${response?.status || 'ERR'}: ${errText}`);
      }
    } catch (err: any) {
      console.warn(`9Router (${nineUrl} - ${model}) hatası:`, err.message);
      if (process.env.GEMINI_API_KEY) {
        const geminiRes = await runGeminiWithFallback(prompt, systemPrompt, 'gemini-3.7-flash', effectiveTemperature, useSearchGrounding);
        return {
          ...geminiRes,
          warning: `⚠️ 9Router yerel yönlendiricisine (${nineUrl}) ulaşılamadı. Google Gemini devreye alındı.`,
        };
      }
      return {
        text: '',
        modelUsed: `9Router (${model}) - Bağlantı Yok`,
        provider: 'fallback',
        isFallback: true,
        warning: `9Router yerel yönlendiricisine (${nineUrl}) bağlanılamadı. Lütfen 9Router uygulamasının çalıştığından emin olun.`,
      };
    }
  }

  // ----------------------------------------------------
  // 4. Ollama / Local LLM Inference
  // ----------------------------------------------------
  if (effectiveProvider === 'ollama') {
    const ollamaUrl = (effectiveBaseUrl || modelConfig?.ollamaUrl || 'http://localhost:11434').replace(/\/$/, '');
    const ollamaModel = effectiveModelName || modelConfig?.ollamaModel || 'deepseek-r1:latest';

    try {
      const fullPrompt = systemPrompt ? `${systemPrompt}\n\nKullanıcı İstemi: ${prompt}` : prompt;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout for local model

      const response = await fetch(`${ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: ollamaModel,
          prompt: fullPrompt,
          stream: false,
          options: {
            temperature: effectiveTemperature,
          }
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const res: AICallResponse = {
          text: data.response || '',
          modelUsed: `Ollama (${ollamaModel})`,
          provider: 'ollama',
        };
        responseCache.set(cacheKey, { timestamp: Date.now(), data: res });
        return res;
      } else {
        throw new Error(`Ollama HTTP ${response.status}: ${await response.text()}`);
      }
    } catch (err: any) {
      console.warn(`Local Ollama connection failed (${ollamaUrl} - ${ollamaModel}):`, err.message);
      if (process.env.GEMINI_API_KEY) {
        const geminiRes = await runGemini(prompt, systemPrompt, activeModel, effectiveTemperature, useSearchGrounding);
        return {
          ...geminiRes,
          warning: `⚠️ Yerel Ollama (${ollamaModel}) servisine ulaşılamadı. Google Gemini AI devreye alındı.`,
        };
      }
      return {
        text: '',
        modelUsed: `Ollama (${ollamaModel}) - Bağlantı Yok`,
        provider: 'fallback',
        warning: `Yerel Ollama servisine (${ollamaUrl}) ulaşılamadı. Lütfen 'ollama serve' komutunun çalıştığından emin olun.`,
        isFallback: true,
      };
    }
  }

  // ----------------------------------------------------
  // 5. Custom OpenAI-Compatible Inference
  // ----------------------------------------------------
  if (effectiveProvider === 'custom' && (effectiveBaseUrl || modelConfig?.customBaseUrl)) {
    try {
      const baseUrl = (effectiveBaseUrl || modelConfig?.customBaseUrl || '').replace(/\/$/, '');
      const modelName = effectiveModelName || modelConfig?.customModelName || 'custom-llm';
      const apiKey = effectiveApiKey || modelConfig?.customApiKey;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const messages = [];
      if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
      messages.push({ role: 'user', content: prompt });

      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: modelName,
          messages,
          temperature: effectiveTemperature,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        const res: AICallResponse = {
          text: content,
          modelUsed: `Custom (${modelName})`,
          provider: 'custom',
        };
        responseCache.set(cacheKey, { timestamp: Date.now(), data: res });
        return res;
      }
    } catch (err: any) {
      console.warn('Custom API endpoint error:', err.message);
    }
  }

  // ----------------------------------------------------
  // 6. Default: Google Gemini AI with Fallback Cascade
  // ----------------------------------------------------
  const requestedGeminiModel = normalizeGeminiModel(effectiveModelName || modelConfig?.geminiModel);
  const result = await runGeminiWithFallback(prompt, systemPrompt, requestedGeminiModel, effectiveTemperature, useSearchGrounding);
  
  if (result.text) {
    responseCache.set(cacheKey, { timestamp: Date.now(), data: result });
  }
  return result;
}

async function runGeminiWithFallback(
  prompt: string,
  systemPrompt: string | undefined,
  primaryModel: string,
  temperature: number,
  useSearchGrounding: boolean
): Promise<AICallResponse> {
  const sanitizedPrimary = normalizeGeminiModel(primaryModel);
  const secondaryModel = sanitizedPrimary === 'gemini-3.7-flash' ? 'gemini-3.1-pro-preview' : 'gemini-3.7-flash';
  const modelsToTry = [sanitizedPrimary, secondaryModel];

  let lastErrorMsg = '';
  let isQuotaExhausted = false;

  for (const model of modelsToTry) {
    try {
      const res = await runGemini(prompt, systemPrompt, model, temperature, useSearchGrounding);
      if (res.text && !res.isFallback) {
        return res;
      }
      if (res.warning) {
        lastErrorMsg = res.warning;
        if (isQuotaOrPermissionError(lastErrorMsg)) {
          isQuotaExhausted = true;
          break; // Stop immediately if API key quota or permission is restricted
        }
      }
    } catch (err: any) {
      lastErrorMsg = err.message || String(err);
      if (isQuotaOrPermissionError(lastErrorMsg)) {
        isQuotaExhausted = true;
        break;
      }
    }
  }

  // If search grounding was on and not a quota/permission error, try once without search grounding
  if (useSearchGrounding && !isQuotaExhausted) {
    try {
      const res = await runGemini(prompt, systemPrompt, 'gemini-3.7-flash', temperature, false);
      if (res.text && !res.isFallback) {
        return res;
      }
    } catch (err: any) {
      lastErrorMsg = err.message || String(err);
    }
  }

  return {
    text: '',
    modelUsed: `${sanitizedPrimary} (Akıllı Yedek Motor)`,
    provider: 'fallback',
    isFallback: true,
    warning: isQuotaExhausted || isQuotaOrPermissionError(lastErrorMsg)
      ? 'Google Gemini API kotası veya erişim izni (403/Dunning/Quota) sınırına ulaşıldı. Kesintisiz işlem için Akıllı Finans Analiz Motoru devreye alındı.'
      : (lastErrorMsg ? `Gemini API: ${lastErrorMsg}` : undefined),
  };
}

async function runGemini(
  prompt: string,
  systemPrompt: string | undefined,
  modelName: string,
  temperature: number,
  useSearchGrounding: boolean
): Promise<AICallResponse> {
  const ai = getGeminiClient();
  const validModel = normalizeGeminiModel(modelName);

  if (!process.env.GEMINI_API_KEY) {
    return {
      text: '',
      modelUsed: `${validModel} (Demo Modu)`,
      provider: 'fallback',
      isFallback: true,
    };
  }

  try {
    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
    const config: any = { temperature };
    if (useSearchGrounding) {
      config.tools = [{ googleSearch: {} }];
    }

    // Wrap generateContent in a 25-second timeout
    const generatePromise = ai.models.generateContent({
      model: validModel,
      contents: fullPrompt,
      config,
    });

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Gemini request timeout (25s) on ${validModel}`)), 25000);
    });

    const response = await Promise.race([generatePromise, timeoutPromise]);

    const text = response.text || '';
    let sources: { title: string; uri: string }[] = [];

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && Array.isArray(chunks)) {
      sources = chunks
        .filter((c: any) => c.web?.uri && c.web?.title)
        .map((c: any) => ({ title: c.web.title, uri: c.web.uri }))
        .slice(0, 6);
    }

    return {
      text,
      modelUsed: validModel,
      provider: 'gemini',
      sources,
    };
  } catch (err: any) {
    const errMsg = err.message || String(err);
    const isQuota = isQuotaOrPermissionError(errMsg);
    if (isQuota) {
      console.warn(`Gemini quota or permission limit for ${validModel}. Switching to intelligent fallback.`);
    } else {
      console.warn(`Gemini error (${validModel}):`, errMsg);
    }

    return {
      text: '',
      modelUsed: validModel,
      provider: 'fallback',
      isFallback: true,
      warning: errMsg,
    };
  }
}

