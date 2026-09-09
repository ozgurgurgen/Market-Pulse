import React, { useState } from 'react';
import { Newspaper, ExternalLink, ChevronDown, ChevronUp, AlertCircle, Clock } from 'lucide-react';
import { IntelligenceNewsItem } from '../../types';

interface NewsFeedPanelProps {
  news: IntelligenceNewsItem[];
  isLoading: boolean;
}

export const NewsFeedPanel: React.FC<NewsFeedPanelProps> = ({ news, isLoading }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getSentimentBadge = (sentiment: IntelligenceNewsItem['sentiment'], score: number) => {
    const pct = Math.round(score * 100);
    if (sentiment === 'positive') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Pozitif %{pct}
        </span>
      );
    }
    if (sentiment === 'negative') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
          Negatif %{pct}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-500/10 text-slate-400 border border-slate-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
        Nötr %{pct}
      </span>
    );
  };

  const getImpactBadge = (score: number) => {
    let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';
    if (score >= 8.0) {
      colorClasses = 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-950';
    } else if (score >= 7.0) {
      colorClasses = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    } else if (score >= 5.0) {
      colorClasses = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
    }

    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-black px-2 py-0.5 rounded-md border ${colorClasses}`}>
        ⚡ Etki: {score.toFixed(1)}/10
      </span>
    );
  };

  const getNewsTypeLabel = (type: IntelligenceNewsItem['news_type']) => {
    const map: Record<IntelligenceNewsItem['news_type'], { label: string; bg: string }> = {
      earnings: { label: 'Bilanço / Finansal', bg: 'bg-emerald-950/60 text-emerald-300 border-emerald-800' },
      merger_acquisition: { label: 'Satın Alma / Ortaklık', bg: 'bg-indigo-950/60 text-indigo-300 border-indigo-800' },
      regulatory: { label: 'KAP / Düzenleme', bg: 'bg-cyan-950/60 text-cyan-300 border-cyan-800' },
      macro_economic: { label: 'Makro Ekonomi', bg: 'bg-amber-950/60 text-amber-300 border-amber-800' },
      general: { label: 'Sektörel / Genel', bg: 'bg-slate-800/80 text-slate-300 border-slate-700' },
    };
    return map[type] || map.general;
  };

  const formatTimeAgo = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMins = Math.max(1, Math.floor((Date.now() - date.getTime()) / 60000));
      if (diffMins < 60) return `${diffMins} dk önce`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} sa önce`;
      return `${Math.floor(diffHours / 24)} gün önce`;
    } catch {
      return 'Yakın zamanda';
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col h-full shadow-md">
      {/* Panel Başlığı */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Newspaper size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Haber Akışı & NLP Analizi
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                NewsAgent
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Duygu skoru ve etki puanlamalı haber akışı</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-slate-400">
          {news.length} Haber
        </span>
      </div>

      {/* İçerik / Haber Listesi */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 max-h-[440px] scrollbar-thin">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-950/60 rounded-xl p-3.5 space-y-2 border border-slate-800/60">
                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                <div className="h-3 bg-slate-800/60 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400">
            <AlertCircle size={24} className="text-slate-500 mb-2" />
            <p className="text-xs">Bu varlık için güncel haber bulunamadı.</p>
          </div>
        ) : (
          news.map((item) => {
            const isExpanded = expandedId === item.id;
            const typeConfig = getNewsTypeLabel(item.news_type);

            return (
              <div
                key={item.id}
                className="bg-slate-950/70 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-700/90 rounded-xl p-3.5 transition-all space-y-2.5 group"
              >
                {/* Üst Satır: Rozetler ve Zaman */}
                <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                      {item.source}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${typeConfig.bg}`}>
                      {typeConfig.label}
                    </span>
                    {getSentimentBadge(item.sentiment, item.sentiment_score)}
                    {getImpactBadge(item.impact_score)}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
                    <Clock size={11} />
                    <span>{formatTimeAgo(item.published_at)}</span>
                  </div>
                </div>

                {/* Başlık */}
                <h4
                  onClick={() => toggleExpand(item.id)}
                  className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors cursor-pointer leading-snug"
                >
                  {item.headline}
                </h4>

                {/* Özet ve Genişleme */}
                {isExpanded ? (
                  <div className="pt-2 border-t border-slate-800/60 text-xs text-slate-300 space-y-2">
                    <p className="leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                      {item.summary}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        <span>Kaynağa Git</span>
                        <ExternalLink size={11} />
                      </a>
                      <button
                        type="button"
                        onClick={() => toggleExpand(item.id)}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>Kapat</span>
                        <ChevronUp size={12} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <p className="line-clamp-1 text-slate-400 pr-2">{item.summary}</p>
                    <button
                      type="button"
                      onClick={() => toggleExpand(item.id)}
                      className="text-slate-400 hover:text-emerald-400 flex items-center gap-0.5 shrink-0 cursor-pointer"
                    >
                      <span>Detay</span>
                      <ChevronDown size={12} />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
