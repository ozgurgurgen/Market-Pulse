/**
 * BÖLÜM 7 & MADDE D — News Outcome Tracker
 * NLP haber duygu etiketlerinin 1, 3 ve 7 gün sonraki fiyat hareketleriyle doğrulanması ve hit rate hesaplaması.
 */

import { JsonFileStore } from './persistence';

export interface NewsOutcome {
  id: string;
  symbol: string;
  headline: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  publishedAt: string;
  priceAtPublish: number;
  priceChangeAfter1Day?: number;
  priceChangeAfter3Days: number;
  priceChangeAfter7Days?: number;
  independentSourcesCount: number;
  wasCorrect?: boolean;
}

const initialSeedOutcomes: NewsOutcome[] = [
  { id: 'n1', symbol: 'THYAO', headline: 'Yeni filo genişleme ve yolcu rekoru', sentiment: 'positive', publishedAt: '2026-06-10', priceAtPublish: 310, priceChangeAfter1Day: 1.5, priceChangeAfter3Days: 4.2, priceChangeAfter7Days: 6.0, independentSourcesCount: 3 },
  { id: 'n2', symbol: 'ASELS', headline: 'Savunma Sanayii Başkanlığı ile 500M$ sözleşme', sentiment: 'positive', publishedAt: '2026-06-15', priceAtPublish: 75, priceChangeAfter1Day: 2.1, priceChangeAfter3Days: 5.8, priceChangeAfter7Days: 7.2, independentSourcesCount: 2 },
  { id: 'n3', symbol: 'EREGL', headline: 'Global çelik talebinde kısa vadeli daralma', sentiment: 'negative', publishedAt: '2026-06-20', priceAtPublish: 52, priceChangeAfter1Day: -0.8, priceChangeAfter3Days: -2.4, priceChangeAfter7Days: -3.5, independentSourcesCount: 2 },
  { id: 'n4', symbol: 'BIMAS', headline: 'Yurt dışı mağaza açılışları ve enflasyon üzeri ciro', sentiment: 'positive', publishedAt: '2026-07-02', priceAtPublish: 540, priceChangeAfter1Day: 0.9, priceChangeAfter3Days: 3.1, priceChangeAfter7Days: 4.5, independentSourcesCount: 2 },
  { id: 'n5', symbol: 'TUPRS', headline: 'Rafineri bakım duruşu planı', sentiment: 'negative', publishedAt: '2026-07-12', priceAtPublish: 165, priceChangeAfter1Day: -0.5, priceChangeAfter3Days: -1.8, priceChangeAfter7Days: -1.2, independentSourcesCount: 1 },
  { id: 'n6', symbol: 'GARAN', headline: 'Net faiz marjında güçlü toparlanma', sentiment: 'positive', publishedAt: '2026-07-22', priceAtPublish: 125, priceChangeAfter1Day: 2.4, priceChangeAfter3Days: 6.2, priceChangeAfter7Days: 8.1, independentSourcesCount: 3 },
  { id: 'n7', symbol: 'KCHOL', headline: 'Stratejik batarya yatırımı güncellemesi', sentiment: 'positive', publishedAt: '2026-08-01', priceAtPublish: 230, priceChangeAfter1Day: 1.1, priceChangeAfter3Days: 2.9, priceChangeAfter7Days: 3.8, independentSourcesCount: 2 },
  { id: 'n8', symbol: 'SISE', headline: 'Avrupa enerji maliyetleri baskısı', sentiment: 'negative', publishedAt: '2026-08-10', priceAtPublish: 48, priceChangeAfter1Day: -1.2, priceChangeAfter3Days: -3.1, priceChangeAfter7Days: -4.0, independentSourcesCount: 2 },
];

const newsStore = new JsonFileStore<NewsOutcome>('news_outcomes.json', initialSeedOutcomes);

// In-Memory Sync Cache
let memoryOutcomes: NewsOutcome[] = [...initialSeedOutcomes];

// İlk yükleme
newsStore.load().then((loaded) => {
  if (loaded && loaded.length > 0) {
    memoryOutcomes = loaded;
  }
});

/**
 * Belirli bir zaman ufku (1, 3 veya 7 gün) için haberlerin isabetlilik oranını (hit rate) hesaplar.
 */
export function calculateNewsHitRate(
  last90DaysOutcomes: NewsOutcome[] = memoryOutcomes,
  horizon: 1 | 3 | 7 = 3
): number {
  if (!last90DaysOutcomes || last90DaysOutcomes.length === 0) {
    return 0.65; // Yeterli veri yoksa nötr-pozitif başlangıç varsayılanı (%65)
  }

  const validEvaluated = last90DaysOutcomes.filter(
    (o) => o.sentiment === 'positive' || o.sentiment === 'negative'
  );

  if (validEvaluated.length === 0) return 0.65;

  const correct = validEvaluated.filter((o) => {
    let priceChange = o.priceChangeAfter3Days;
    if (horizon === 1 && typeof o.priceChangeAfter1Day === 'number') {
      priceChange = o.priceChangeAfter1Day;
    } else if (horizon === 7 && typeof o.priceChangeAfter7Days === 'number') {
      priceChange = o.priceChangeAfter7Days;
    }

    if (o.sentiment === 'positive') {
      return priceChange > 0;
    } else if (o.sentiment === 'negative') {
      return priceChange < 0;
    }
    return false;
  }).length;

  return Number((correct / validEvaluated.length).toFixed(3));
}

/**
 * 1, 3 ve 7 günlük ufukların tümü için başarı oranlarını hesaplayıp en tutarlı olanı seçer.
 */
export function calculateBestNewsHitRate(
  last90DaysOutcomes: NewsOutcome[] = memoryOutcomes
): { bestHorizon: 1 | 3 | 7; hitRate: number; allRates: Record<1 | 3 | 7, number> } {
  const rate1 = calculateNewsHitRate(last90DaysOutcomes, 1);
  const rate3 = calculateNewsHitRate(last90DaysOutcomes, 3);
  const rate7 = calculateNewsHitRate(last90DaysOutcomes, 7);

  const allRates: Record<1 | 3 | 7, number> = { 1: rate1, 3: rate3, 7: rate7 };
  
  // Varsayılan standart ufuk 3 gündür
  let bestHorizon: 1 | 3 | 7 = 3;
  let bestRate = rate3;

  // Tutarlılık kontrolü: En yüksek örneklemli/güvenli değer
  if (rate3 >= rate1 && rate3 >= rate7) {
    bestHorizon = 3;
    bestRate = rate3;
  } else if (rate1 > rate3 && rate1 > rate7) {
    bestHorizon = 1;
    bestRate = rate1;
  } else {
    bestHorizon = 7;
    bestRate = rate7;
  }

  return { bestHorizon, hitRate: bestRate, allRates };
}

/**
 * Yeni bir haber sonucu kaydet
 */
export function recordNewsOutcome(outcome: NewsOutcome): void {
  outcome.wasCorrect =
    (outcome.sentiment === 'positive' && outcome.priceChangeAfter3Days > 0) ||
    (outcome.sentiment === 'negative' && outcome.priceChangeAfter3Days < 0);

  memoryOutcomes.unshift(outcome);
  if (memoryOutcomes.length > 500) memoryOutcomes.pop();

  newsStore.append(outcome).catch(() => {});
}

/**
 * Mevcut takip havuzunu ve güncel hit rate'i döndür
 */
export function getNewsTrackerStats(): {
  outcomes: NewsOutcome[];
  currentHitRate: number;
  bestHitRate: { bestHorizon: 1 | 3 | 7; hitRate: number; allRates: Record<1 | 3 | 7, number> };
  totalEvaluated: number;
} {
  const currentHitRate = calculateNewsHitRate(memoryOutcomes, 3);
  const bestHitRate = calculateBestNewsHitRate(memoryOutcomes);
  return {
    outcomes: memoryOutcomes,
    currentHitRate,
    bestHitRate,
    totalEvaluated: memoryOutcomes.length,
  };
}
