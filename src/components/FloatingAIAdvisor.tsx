import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  Globe, 
  MessageSquare,
  TrendingUp,
  Maximize2,
  ChevronDown,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, AIModelConfig } from '../types';
import { safeFetchJson } from '../utils/apiClient';

interface FloatingAIAdvisorProps {
  modelConfig?: AIModelConfig;
  onNavigateToFullChat?: () => void;
  initialStockSymbol?: string;
}

export const FloatingAIAdvisor: React.FC<FloatingAIAdvisorProps> = ({
  modelConfig,
  onNavigateToFullChat,
  initialStockSymbol
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [webResearchEnabled, setWebResearchEnabled] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'floating-welcome',
      sender: 'assistant',
      text: `Merhaba! Ben **Dijital Finansal Danışmanınızım**. 

Borsa İstanbul (BIST), TEFAS Fonları, KAP bildirimleri ve küresel piyasalar hakkında 7/24 sorularınızı yanıtlamak ve web'de canlı araştırma yapmak için buradayım.`,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      webResearchUsed: true,
      suggestedPrompts: [
        'THYAO için 18 parametreli karne ve KAP katalizör analizi',
        'Enflasyona karşı koruyan %0 stopajlı TEFAS hisse fonları',
        'BIST 100 bugün neden yükseldi/düştü?',
        'Dolar/TL ve Altın için son faiz kararı yorumu'
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  useEffect(() => {
    if (initialStockSymbol && isOpen) {
      handleSendMessage(`${initialStockSymbol} hissesi için 18 parametreli karne, KAP haber katalizörleri ve strateji kararı nedir?`);
    }
  }, [initialStockSymbol]);

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

      if (!ok || !data?.reply) throw new Error('API Error');

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources,
        webResearchUsed: Boolean(data.webResearchUsed || (data.sources && data.sources.length > 0)),
        suggestedPrompts: [
          'Teknik destek/direnç seviyeleri neler?',
          'Risk/kazanç oranı ne olmalı?'
        ]
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'assistant',
        text: 'Üzgünüm, yanıt oluşturulurken bir bağlantı hatası oluştu. Lütfen tekrar deneyin.',
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      
      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="pointer-events-auto w-[380px] sm:w-[420px] h-[540px] bg-slate-900/95 backdrop-blur-xl border border-emerald-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <Bot className="w-4.5 h-4.5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white">Dijital Yatırım Danışmanı</h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-slate-400">Canlı Veri & Google Web Taraması</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setWebResearchEnabled(!webResearchEnabled)}
                className={`p-1.5 rounded-lg border text-[10px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                  webResearchEnabled 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
                title="Canlı İnternet Arama Modu"
              >
                <Globe size={12} className={webResearchEnabled ? 'animate-spin-slow' : ''} />
                <span>Web Search</span>
              </button>

              {onNavigateToFullChat && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onNavigateToFullChat();
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Tam Ekran Aç"
                >
                  <Maximize2 size={14} />
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 text-xs custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-md bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={13} className="text-emerald-400" />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none shadow-md'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/70 rounded-tl-none'
                }`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>

                  {/* Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-700/60 text-[10px] space-y-1">
                      <span className="text-slate-400 font-semibold block">Kaynaklar:</span>
                      {msg.sources.slice(0, 3).map((src, i) => (
                        <a
                          key={i}
                          href={src.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-emerald-400 hover:underline truncate"
                        >
                          <ExternalLink size={10} />
                          <span className="truncate">{src.title || src.uri}</span>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Suggested Prompts */}
                  {msg.suggestedPrompts && (
                    <div className="mt-2.5 pt-2 border-t border-slate-700/50 space-y-1">
                      {msg.suggestedPrompts.map((prompt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendMessage(prompt)}
                          className="w-full text-left p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-700/60 border border-slate-700/40 text-[10px] text-slate-300 hover:text-emerald-300 transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <span className="truncate">{prompt}</span>
                          <Sparkles size={10} className="text-emerald-400 shrink-0 ml-1" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs p-2 bg-slate-800/40 rounded-lg w-fit border border-slate-700/40">
                <RefreshCw size={13} className="animate-spin text-emerald-400" />
                <span>Yapay zeka analiz ediyor ve canlı web taraması yapıyor...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-950 border-t border-slate-800">
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
                placeholder="Hisse, TEFAS fonu veya piyasa sor..."
                className="flex-1 bg-slate-900 text-white placeholder-slate-500 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500/60"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-slate-950 font-bold transition-all cursor-pointer shrink-0"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toggle Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 font-bold text-xs shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 cursor-pointer border border-emerald-300/40"
      >
        <div className="relative">
          <Bot size={18} className="text-slate-950" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-300 border-2 border-slate-950 animate-ping" />
        </div>
        <span className="hidden sm:inline font-bold tracking-tight">Dijital Yatırım Danışmanı</span>
        <Sparkles size={14} className="text-slate-950" />
      </button>

    </div>
  );
};
