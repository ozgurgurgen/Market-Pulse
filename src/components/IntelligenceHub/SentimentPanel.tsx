import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Repeat2, MessageCircle, Info, Sparkles } from 'lucide-react';
import { IntelligenceCommentItem, IntelligenceSentimentDistribution } from '../../types';

interface SentimentPanelProps {
  comments: IntelligenceCommentItem[];
  distribution: IntelligenceSentimentDistribution;
  isLoading: boolean;
}

export const SentimentPanel: React.FC<SentimentPanelProps> = ({
  comments: initialComments,
  distribution,
  isLoading,
}) => {
  const [comments, setComments] = useState<IntelligenceCommentItem[]>(initialComments);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  // Prop güncellendiğinde senkronize et
  React.useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      const isLiked = next.has(id);
      if (isLiked) {
        next.delete(id);
      } else {
        next.add(id);
      }

      setComments((curr) =>
        curr.map((c) =>
          c.id === id
            ? {
                ...c,
                likes: isLiked ? c.likes - 1 : c.likes + 1,
                engagement_score: isLiked ? c.engagement_score - 1 : c.engagement_score + 1,
              }
            : c
        )
      );

      return next;
    });
  };

  const getSourceBadge = (source: IntelligenceCommentItem['source']) => {
    const config: Record<IntelligenceCommentItem['source'], { label: string; bg: string }> = {
      twitter: { label: 'Twitter/X (3.0x)', bg: 'bg-sky-950/60 text-sky-300 border-sky-800' },
      midas_forum: { label: 'Midas Forum (2.5x)', bg: 'bg-emerald-950/60 text-emerald-300 border-emerald-800' },
      reddit: { label: 'Reddit r/Yatirim (2.0x)', bg: 'bg-orange-950/60 text-orange-300 border-orange-800' },
      bist100_forum: { label: 'BIST100 Forum (1.5x)', bg: 'bg-purple-950/60 text-purple-300 border-purple-800' },
    };
    return config[source] || { label: source, bg: 'bg-slate-800 text-slate-300 border-slate-700' };
  };

  const getSentimentChip = (sentiment: IntelligenceCommentItem['sentiment']) => {
    if (sentiment === 'positive') {
      return <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Pozitif</span>;
    }
    if (sentiment === 'negative') {
      return <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">Negatif</span>;
    }
    if (sentiment === 'cautious') {
      return <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">Temkinli</span>;
    }
    return <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-500/10 text-slate-400 border border-slate-500/30">Nötr</span>;
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col h-full shadow-md">
      {/* Panel Başlığı */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <MessageSquare size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Yatırımcı Duygusu & Yorumlar
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                SentimentAgent
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Ağırlıklı etkileşim skorlu topluluk analizi</p>
          </div>
        </div>
      </div>

      {/* Duygu Dağılım Çubuğu (Sentiment Bar) */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 mb-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300 flex items-center gap-1">
            <Sparkles size={12} className="text-amber-400" />
            Topluluk Duygu Dağılımı
          </span>
          <div className="flex items-center gap-3 text-[11px] font-bold">
            <span className="text-emerald-400">%{distribution.positive} Pozitif</span>
            <span className="text-amber-400">%{distribution.neutral} Nötr/Temkinli</span>
            <span className="text-rose-400">%{distribution.negative} Negatif</span>
          </div>
        </div>

        {/* 3 Renkli İlerleme Çubuğu */}
        <div className="h-2 w-full bg-slate-800 rounded-full flex overflow-hidden">
          <div
            style={{ width: `${distribution.positive}%` }}
            className="h-full bg-emerald-500 transition-all duration-500"
            title={`Pozitif: %${distribution.positive}`}
          />
          <div
            style={{ width: `${distribution.neutral}%` }}
            className="h-full bg-amber-500 transition-all duration-500"
            title={`Nötr: %${distribution.neutral}`}
          />
          <div
            style={{ width: `${distribution.negative}%` }}
            className="h-full bg-rose-500 transition-all duration-500"
            title={`Negatif: %${distribution.negative}`}
          />
        </div>

        {/* Formül Bilgilendirme Notu */}
        <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-0.5">
          <Info size={10} className="shrink-0" />
          <span>Skor = (Beğeni × 1 + Retweet × 1.5 + Yanıt × 2) × Platform Ağırlığı</span>
        </div>
      </div>

      {/* Yorumlar Listesi */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 max-h-[350px] scrollbar-thin">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-950/60 rounded-xl p-3.5 space-y-2 border border-slate-800/60">
                <div className="h-3 bg-slate-800 rounded w-1/3"></div>
                <div className="h-4 bg-slate-800/60 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            Henüz yatırımcı yorumu kaydedilmedi.
          </div>
        ) : (
          comments.map((item, idx) => {
            const isLiked = likedIds.has(item.id);
            const srcConfig = getSourceBadge(item.source);

            return (
              <div
                key={`sentiment-comment-${item.id || idx}`}
                className="bg-slate-950/70 border border-slate-800/80 hover:border-slate-700/80 rounded-xl p-3.5 space-y-2.5 transition-all"
              >
                {/* Kullanıcı & Platform & Etkileşim Skoru */}
                <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{item.user}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${srcConfig.bg}`}>
                      {srcConfig.label}
                    </span>
                    {getSentimentChip(item.sentiment)}
                  </div>
                  <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-800/60">
                    🏆 {item.engagement_score} Puan
                  </span>
                </div>

                {/* Yorum Metni */}
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/50">
                  {item.text}
                </p>

                {/* Etkileşim Butonları / Sayaçlar */}
                <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                  <button
                    type="button"
                    onClick={() => handleLike(item.id)}
                    className={`flex items-center gap-1 transition-colors cursor-pointer ${
                      isLiked ? 'text-emerald-400 font-bold' : 'hover:text-slate-200'
                    }`}
                  >
                    <ThumbsUp size={12} className={isLiked ? 'fill-emerald-400' : ''} />
                    <span>{item.likes}</span>
                  </button>

                  <div className="flex items-center gap-1 text-slate-400 hover:text-slate-200">
                    <Repeat2 size={12} />
                    <span>{item.retweets}</span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-400 hover:text-slate-200">
                    <MessageCircle size={12} />
                    <span>{item.replies}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
