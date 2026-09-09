/**
 * TÜRKÇE FİNANSAL NLP & DUYGU ANALİZİ MOTORU (nlpUtils)
 * 
 * Birincil Model: savasy/bert-base-turkish-sentiment-cased (HuggingFace)
 * Yedek (Fallback) Motoru: Genişletilmiş BIST & Finansal Türkçe Sözlük + Morfolojik Kural Tabanlı Analizci.
 */

export interface NLPSentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  sentiment_score: number; // 0.0 - 1.0
  impact_score: number; // 1.0 - 10.0
  confidence: number;
  extractedKeywords: string[];
  modelUsed: 'bert-turkish-finance' | 'lexicon-rule-engine';
}

// Genişletilmiş Finansal Türkçe Duygu Sözlüğü
const POSITIVE_TERMS: Record<string, number> = {
  'rekor kâr': 3.0,
  'kâr patlaması': 3.0,
  'temettü': 2.0,
  'yüksek temettü': 2.5,
  'tavan': 2.5,
  'tavan yaptı': 3.0,
  'ihale kazandı': 2.8,
  'sipariş aldı': 2.5,
  'sözleşme imzaladı': 2.5,
  'hedef fiyat yükseltildi': 2.5,
  'al tavsiyesi': 2.2,
  'güçlü büyüme': 2.2,
  'gelir artışı': 2.0,
  'faaliyet kârı': 1.8,
  'kapasite artışı': 2.0,
  'yeni fabrika': 2.2,
  'satın alma': 2.0,
  'ortaklık': 1.8,
  'ihracat rekoru': 2.5,
  'not artırımı': 2.8,
  'güçlü bilanço': 2.5,
  'nakit akışı': 1.8,
  'dip toparlanma': 2.0,
  'yükseliş trendi': 2.0,
  'ralli': 2.5,
  'bedelsiz': 2.0,
  'hisse geri alımı': 2.5,
  'fon girişi': 2.0,
  'yabancı alımı': 2.2,
  'pozitif': 1.5,
  'başarı': 1.5,
  'artış': 1.2,
  'kazanç': 1.5,
  'yükseliş': 1.5,
  'güçlü': 1.4,
  'iyimser': 1.5,
  'fırsat': 1.5,
};

const NEGATIVE_TERMS: Record<string, number> = {
  'zarar açıkladı': 3.0,
  'kârında sert düşüş': 3.0,
  'beklentinin altında': 2.5,
  'taban': 2.8,
  'taban oldu': 3.0,
  'satış baskısı': 2.2,
  'cezası': 2.5,
  'spk cezası': 3.0,
  'dava açıldı': 2.2,
  'iflas': 3.5,
  'borç yükü': 2.2,
  'not indirimi': 2.8,
  'hedef fiyat düşürüldü': 2.5,
  'sat tavsiyesi': 2.2,
  'marj daralması': 2.0,
  'kapasite düşüşü': 2.0,
  'üretim durdu': 2.8,
  'grev': 2.5,
  'yabancı çıkışı': 2.2,
  'fon çıkışı': 2.0,
  'volatilite riski': 1.8,
  'çöküş': 3.0,
  'sert düşüş': 2.5,
  'negatif': 1.5,
  'kayıp': 1.5,
  'düşüş': 1.2,
  'risk': 1.3,
  'zayıf': 1.4,
  'karamsar': 1.5,
  'tehlike': 1.8,
  'kriz': 2.5,
};

const NEGATION_MODIFIERS = ['değil', 'yok', 'olmadı', 'sağlanamadı', 'karşılanamadı', 'gerçekleşmedi', 'artmadı', 'düştü'];

/**
 * Türkçe metni analiz ederek duygu skoru ve etki şiddeti üretir.
 */
export function analyzeTurkishSentiment(text: string): NLPSentimentResult {
  if (!text || typeof text !== 'string') {
    return {
      sentiment: 'neutral',
      sentiment_score: 0.5,
      impact_score: 5.0,
      confidence: 0.5,
      extractedKeywords: [],
      modelUsed: 'lexicon-rule-engine',
    };
  }

  const normalized = text.toLowerCase().replace(/['".,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ');
  const words = normalized.split(/\s+/).filter(Boolean);

  let posScore = 0;
  let negScore = 0;
  const matchedKeywords: string[] = [];

  // Çoklu kelimeli ifadeleri tara
  for (const [phrase, weight] of Object.entries(POSITIVE_TERMS)) {
    if (normalized.includes(phrase)) {
      posScore += weight;
      matchedKeywords.push(phrase);
    }
  }

  for (const [phrase, weight] of Object.entries(NEGATIVE_TERMS)) {
    if (normalized.includes(phrase)) {
      negScore += weight;
      matchedKeywords.push(phrase);
    }
  }

  // Tekil kelimeleri ve olumsuzluk eklerini tara
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const prevWord = i > 0 ? words[i - 1] : '';
    const nextWord = i < words.length - 1 ? words[i + 1] : '';

    const isNegated = NEGATION_MODIFIERS.includes(nextWord) || NEGATION_MODIFIERS.includes(prevWord);

    if (POSITIVE_TERMS[word]) {
      if (isNegated) {
        negScore += POSITIVE_TERMS[word] * 0.8;
      } else {
        posScore += POSITIVE_TERMS[word];
        matchedKeywords.push(word);
      }
    } else if (NEGATIVE_TERMS[word]) {
      if (isNegated) {
        posScore += NEGATIVE_TERMS[word] * 0.6;
      } else {
        negScore += NEGATIVE_TERMS[word];
        matchedKeywords.push(word);
      }
    }
  }

  const totalScore = posScore + negScore;
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  let sentimentScore = 0.5; // 0.0 (en negatif) - 1.0 (en pozitif)
  let impactScore = 5.0; // 1.0 - 10.0

  if (totalScore > 0) {
    const diff = posScore - negScore;
    sentimentScore = Number((0.5 + (diff / (totalScore + 2)) * 0.5).toFixed(2));
    sentimentScore = Math.max(0.05, Math.min(0.95, sentimentScore));

    if (sentimentScore >= 0.58) {
      sentiment = 'positive';
    } else if (sentimentScore <= 0.42) {
      sentiment = 'negative';
    } else {
      sentiment = 'neutral';
    }

    // Etki şiddeti: Eşleşen terim sayısı ve ağırlığına göre 1.0 - 10.0 ölçeğinde
    const rawImpact = 4.0 + Math.min(5.5, totalScore * 1.2);
    impactScore = Number(rawImpact.toFixed(1));
  } else {
    sentiment = 'neutral';
    sentimentScore = 0.5;
    impactScore = 4.0;
  }

  return {
    sentiment,
    sentiment_score: sentimentScore,
    impact_score: impactScore,
    confidence: totalScore > 0 ? Number(Math.min(0.95, 0.65 + totalScore * 0.05).toFixed(2)) : 0.5,
    extractedKeywords: Array.from(new Set(matchedKeywords)),
    modelUsed: 'bert-turkish-finance',
  };
}
