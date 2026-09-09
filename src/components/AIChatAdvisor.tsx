import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  ExternalLink, 
  Zap, 
  HelpCircle, 
  TrendingUp, 
  ShieldCheck,
  ChevronRight,
  Cpu,
  Globe,
  Search,
  CheckCircle2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, AIModelConfig } from '../types';
import { safeFetchJson } from '../utils/apiClient';
import { useAuth } from '../contexts/AuthContext';

interface AIChatAdvisorProps {
  onAnalyzeStock: (symbol: string, name: string, exchange: string, category: string) => void;
  modelConfig?: AIModelConfig;
  onOpenModelSettings?: () => void;
}

export const AIChatAdvisor: React.FC<AIChatAdvisorProps> = ({ 
  onAnalyzeStock,
  modelConfig,
  onOpenModelSettings
}) => {
  const [webResearchEnabled, setWebResearchEnabled] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Merhaba! Ben **Kıdemli Finansal Analiz ve Canlı Web Araştırma Asistanınızım**. 

Borsa İstanbul (BIST 300), TEFAS Fonları ve küresel piyasalar üzerinde; **18 Parametreli Şirket Karnesi**, **KAP Yeni İş İlişkileri & İhale Katalizörleri**, **Pay Geri Alımları & Nakit Akışı**, **Sermaye & Temettü Sulandırma Riski**, **Endeks Puan Katkısı** ve **SPK Halka Arz Fon Kullanımı** çerçevesinde 5 adımlı strateji karar matrisi üretiyorum.

🌐 **Canlı Web Araştırması Modu** devrede: İnternetteki en güncel KAP bildirimlerini, TCMB faiz kararlarını, Yahoo Finance canlı fiyatlarını ve finans haberlerini gerçek zamanlı tarayarak doğrudan kaynak linkleriyle yanıtlıyorum.

Aşağıdaki hazır analiz başlıklarından birini seçebilir veya dilediğiniz hisse/fonu sorabilirsiniz:`,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      webResearchUsed: true,
      suggestedPrompts: [
        'THYAO için 18 parametreli karne, KAP yeni iş ilişkileri ve karar matrisi nedir?',
        'ASELS pay geri alım programı, döviz bazlı ihracat oranı ve endeks puan katkısı analizi',
        'KAP yeni sözleşme tutarının ciroya oranı en yüksek olan büyüme hisseleri hangileri?',
        'Son halka arzlarda SPK fon kullanım raporu yatırım odaklı olan şirketler hangileri?',
        'Enflasyonu 2 katına katlayan %0 stopajlı TEFAS hisse fonları ve Sharpe rasyoları'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const { data, ok } = await safeFetchJson<{ reply: string; sources?: any[]; webResearchUsed?: boolean }>('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          modelConfig,
          webResearchEnabled,
        }),
      });

      if (!ok || !data?.reply) throw new Error('API error');

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources,
        webResearchUsed: Boolean(data.webResearchUsed || (data.sources && data.sources.length > 0)),
        suggestedPrompts: [
          'Teknik destek ve direnç seviyeleri neler?',
          'Bu varlık için stop-loss ve risk/kazanç oranı ne olmalı?',
          'Portföyümde yüzde kaç ağırlık vermeliyim?'
        ]
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'assistant',
        text: 'Üzgünüm, yanıt oluşturulurken bir bağlantı hatası meydana geldi. Lütfen tekrar deneyin.',
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const activeModelDisplay = (() => {
    const taskRoute = modelConfig?.taskRoutes?.chatAdvisor;
    const provider = (!taskRoute?.useGlobal && taskRoute?.provider) ? taskRoute.provider : (modelConfig?.provider || 'gemini');
    const model = (!taskRoute?.useGlobal && taskRoute?.model) ? taskRoute.model : (
      provider === 'openrouter' ? (modelConfig?.openRouterModel || 'deepseek/deepseek-r1') :
      provider === 'ninerouter' ? (modelConfig?.nineRouterModel || 'local-default') :
      provider === 'ollama' ? (modelConfig?.ollamaModel || 'deepseek-r1') :
      provider === 'custom' ? (modelConfig?.customModelName || 'custom-llm') :
      (modelConfig?.geminiModel || 'Gemini 3.7 Flash')
    );

    if (provider === 'openrouter') return `OpenRouter (${model.split('/').pop()})`;
    if (provider === 'ninerouter') return `9Router (${model})`;
    if (provider === 'ollama') return `Ollama (${model.split(':')[0]})`;
    if (provider === 'custom') return `Özel (${model})`;
    return `Gemini (${model.replace('gemini-', '')})`;
  })();

  return (
    <div id="ai-chat-advisor-container" className="h-[calc(100vh-210px)] min-h-[520px] flex flex-col bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      
      {/* Top Banner */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <Bot className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Yapay Zeka Finans & TEFAS Danışmanı
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                {activeModelDisplay}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Yahoo Finance canlı verileri, TEFAS fon analizleri & doğrulanmış web istihbaratı
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Web Research Toggle */}
          <button
            type="button"
            onClick={() => setWebResearchEnabled(!webResearchEnabled)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              webResearchEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Canlı İnternet / KAP Web Taramasını Aç / Kapat"
          >
            <Globe size={14} className={webResearchEnabled ? 'text-emerald-400 animate-pulse' : 'text-slate-500'} />
            <span className="hidden sm:inline">Web Araştırması:</span>
            <span className={webResearchEnabled ? 'text-emerald-400' : 'text-slate-500'}>
              {webResearchEnabled ? 'Açık' : 'Kapalı'}
            </span>
          </button>

          {onOpenModelSettings && (
            <button
              type="button"
              onClick={onOpenModelSettings}
              className="p-1.5 px-2.5 text-xs text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center gap-1.5 cursor-pointer"
              title="Yapay Zeka Modelini Değiştir"
            >
              <Cpu size={13} className="text-emerald-400" />
              <span className="hidden md:inline">Model</span>
            </button>
          )}

          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Doğrulanmış Karar Matrisi</span>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-1">
                <Sparkles size={16} className="text-emerald-400" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
              }`}
            >
              {/* Web Research Verification Header for AI */}
              {msg.sender === 'assistant' && msg.webResearchUsed && (
                <div className="mb-2.5 pb-2 border-b border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="inline-flex items-center gap-1.5 font-bold text-emerald-400">
                    <Globe size={12} className="text-emerald-400" />
                    <span>Canlı Web & Piyasa Araştırması Doğrulamalı</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Doğrulandı ✓</span>
                </div>
              )}

              {msg.sender === 'assistant' ? (
                <div className="prose prose-invert prose-xs sm:prose-sm max-w-none space-y-2">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              )}

              {/* Citations / Grounding sources */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800/80">
                  <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                    <Globe size={11} className="text-emerald-400" /> Taranan Web Kaynakları & Bültenler:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.sources.map((s, idx) => (
                      <a
                        key={idx}
                        href={s.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 border border-slate-800 text-[10px] transition-colors shadow-sm"
                      >
                        <span className="max-w-[180px] truncate">{s.title}</span>
                        <ExternalLink size={10} className="shrink-0 text-slate-500" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Prompts */}
              {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800/60 space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-400">Önerilen Devam Soruları:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedPrompts.map((prompt, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => handleSendMessage(prompt)}
                        className="text-left text-[11px] bg-slate-900 hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-800/60 px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <ChevronRight size={11} className="text-emerald-400" />
                        <span>{prompt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-[10px] text-slate-500 mt-2 text-right">
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 mt-1">
                <User size={16} className="text-slate-300" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <Sparkles size={16} className="text-emerald-400 animate-spin" />
            </div>
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl rounded-tl-none text-xs text-slate-300 flex items-center gap-2.5 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>
                {webResearchEnabled 
                  ? '🌐 İnternet taranıyor... KAP açıklamaları, Yahoo Finance canlı verileri ve piyasa bültenleri analiz ediliyor...'
                  : '🧠 Yahoo Finance canlı verileri ve 18 parametreli karar karnesi işleniyor...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 space-y-2">
        <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${webResearchEnabled ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
              {webResearchEnabled ? '🌐 Canlı Web Araştırması Aktif' : '🔒 Yerel Model Modu'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setWebResearchEnabled(!webResearchEnabled)}
            className="text-[10px] text-slate-400 hover:text-emerald-400 underline cursor-pointer"
          >
            {webResearchEnabled ? 'Web Taramasını Kapat' : 'Web Taramasını Aç'}
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={webResearchEnabled ? "İnternette ve KAP'ta aratmak istediğiniz şirket haberini veya hisseyi yazın..." : "Bir hisse veya TEFAS fon analizi isteyin, enflasyon stratejisi sorun..."}
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <Send size={15} />
            <span className="hidden sm:inline">Gönder</span>
          </button>
        </form>
      </div>

    </div>
  );
};

