# MarketPulse AI — Kapsamlı Teknik Spesifikasyon, Mimari Matrisi ve Sistem Raporu

**Doküman Versiyonu:** v3.2.0  
**Tarih:** 25 Ağustos 2026  
**Rol:** Kıdemli Niceliksel Finans Mühendisi (Quantitative Finance Engineer), Çekirdek Sistem Mimarı ve Kod Denetçisi  
**Kapsam:** Tüm Çekirdek Backend (`server.ts`, `server/signalEngine/*`, `server/validation/*`), Veri Akışları, Matematiksel Modeller, Tip Tanımları ve Frontend Entegrasyonları.

---

## İÇİNDEKİLER

1. [Sistem Mimarisi ve Genel Bakış](#1-sistem-mimarisi-ve-genel-bakış)
2. [Teknik İndikatörler ve Sinyal Üretim Motorları](#2-teknik-indikatörler-ve-sinyal-üretim-motorları)
3. [Alt Analiz Modelleri ve 6-Sütunlu Karar Destek Mimarisi](#3-alt-analiz-modelleri-ve-6-sütunlu-karar-destek-mimarisi)
4. [Deterministik Risk, Stop-Loss ve Pozisyon Yönetimi](#4-deterministik-risk-stop-loss-ve-pozisyon-yönetimi)
5. [Çift Katmanlı Doğrulama ve Halüsinasyon Önleme Katmanı](#5-çift-katmanlı-doğrulama-ve-halüsinasyon-önleme-katmanı)
6. [Backtest, Walk-Forward Analizi ve Monte Carlo Simülasyonu](#6-backtest-walk-forward-analizi-ve-monte-carlo-simülasyonu)
7. [Piyasa Veri Akışları, Ring-Buffer ve Seans Optimizasyonu](#7-piyasa-veri-akışları-ring-buffer-ve-seans-optimizasyonu)
8. [Veri Modelleri, Tipler ve Şemalar (TypeScript Matrix)](#8-veri-modelleri-tipler-ve-şemalar-typescript-matrix)
9. [Arayüz (UI/UX) ve Görselleştirme Katmanı](#9-arayüz-uiux-ve-görselleştirme-katmanı)
10. [Test ve Doğrulama Sonuçları](#10-test-ve-doğrulama-sonuçları)

---

## 1. SİSTEM MİMARİSİ VE GENEL BAKIŞ

MarketPulse AI, niceliksel finans modelleri, deterministik teknik hesaplama motorları ve yapay zeka destekli piyasa analizlerini birleştiren hibrit bir piyasa takip ve karar destek platformudur.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           MARKETPULSE AI                                │
├───────────────────────────────┬─────────────────────────────────────────┤
│        Frontend (React)       │         Backend (Node/Express)          │
├───────────────────────────────┼─────────────────────────────────────────┤
│ • Canlı Fiyat Bandı (Marquee) │ • Yahoo Finance & Binance Stream        │
│ • Opportunity Scanner         │ • Real Sparkline Ring-Buffer Store      │
│ • Stock Analysis Modal        │ • Pure ATR Target Engine (No LLM Math)  │
│ • Backtest Visualizer         │ • Dual-Layer Validation Engine          │
│ • Interactive AI Advisor Chat │ • Walk-Forward & Monte Carlo Engine     │
└───────────────────────────────┴─────────────────────────────────────────┘
```

---

## 2. TEKNİK İNDİKATÖRLER VE SİNYAL ÜRETİM MOTORLARI

Sistemde kullanılan tüm indikatörler saf (pure) fonksiyonlar olarak `server/signalEngine/indicators.ts` ve `server/signalEngine/regime.ts` dosyalarında deterministik olarak hesaplanmaktadır.

### 2.1. İndikatör Matrisi

| İndikatör | Tür | Parametreler / Periyot | Matematiksel Formül | Tetiklenme ve Sinyal Koşulları |
| :--- | :--- | :--- | :--- | :--- |
| **EMA (Üstel Hareketli Ortalama)** | Trend | Periyotlar: 20, 50 | $EMA_t = P_t \times k + EMA_{t-1} \times (1-k)$<br>burada $k = \frac{2}{N + 1}$ | • Fiyat > EMA50: Trend yukarı (Bullish)<br>• Fiyat < EMA50: Trend zayıf/aşağı<br>• EMA20 > EMA50: Kısa vadeli yükseliş |
| **SMA (Basit Hareketli Ortalama)** | Trend | Periyot: 200 | $SMA_t = \frac{1}{N} \sum_{i=0}^{N-1} P_{t-i}$ | • Golden Cross: EMA50'nin SMA200'ü yukarı kesmesi<br>• Death Cross: EMA50'nin SMA200'ü aşağı kesmesi |
| **RSI (Wilder Düzeltmesi)** | Momentum | Periyot: 14 | $RS = \frac{\text{WilderEMA}(Gain, 14)}{\text{WilderEMA}(Loss, 14)}$<br>$RSI = 100 - \frac{100}{1 + RS}$ | • $RSI < 30$: Aşırı Satım (Oversold)<br>• $RSI > 70$: Aşırı Alım (Overbought)<br>• $40 \le RSI \le 60$: Nötr bölge |
| **MACD** | Momentum | Hızlı: 12, Yavaş: 26, Sinyal: 9 | $\text{MACD Line} = EMA_{12} - EMA_{26}$<br>$\text{Signal} = EMA_9(\text{MACD Line})$<br>$\text{Histogram} = \text{MACD Line} - \text{Signal}$ | • Histogram $> 0$ ve Artıyor: Pozitif momentum artışı<br>• Histogram $< 0$: Negatif momentum |
| **ATR (Ortalama Gerçek Aralık)** | Volatilite | Periyot: 14 | $TR_t = \max(H_t - L_t, \|H_t - C_{t-1}\|, \|L_t - C_{t-1}\|)$<br>$ATR_t = \text{EMA}(TR, 14)$ | • Volatiliteye göre dinamik stop mesafesi belirleme<br>• $ATR = 0$ ise güvenlik marjı: $Price \times 0.03$ |
| **Bollinger Bantları** | Volatilite | Periyot: 20, Çarpan: 2.0 | $\text{Middle} = SMA_{20}$<br>$\text{StdDev} = \sqrt{\frac{\sum (P_i - \bar{P})^2}{20}}$<br>$\text{Upper} = \text{Middle} + 2 \sigma$<br>$\text{Lower} = \text{Middle} - 2 \sigma$<br>$\text{BandWidth} = \frac{\text{Upper} - \text{Lower}}{\text{Middle}}$ | • Squeeze (Bant Daralması): $\text{BandWidth} < \text{Tarihsel Alt \%20}$<br>• Üst Bant Kırılımı: Patlama (Breakout) |
| **ADX (Ortalama Yönsel Endeks)** | Rejim / Trend Gücü | Periyot: 14 | $+DM = \max(H_t - H_{t-1}, 0)$<br>$-DM = \max(L_{t-1} - L_t, 0)$<br>$DX = 100 \times \frac{\|+DI - -DI\|}{+DI + -DI}$<br>$ADX = \text{WilderEMA}(DX, 14)$ | • $ADX > 25$: Trend Rejimi (Trend takip stratejileri aktif)<br>• $ADX < 20$: Yatay/Konsolidasyon Rejimi (Ortalamaya dönüş aktif) |

### 2.2. Dinamik Ağırlıklandırma (Regime-Adaptive Scoring)

ADX rejimine göre 5 temel bileşenin bileşik skordaki ağırlıkları dinamik olarak ayarlanır:

```typescript
function getDynamicWeights(adx: number): WeightConfig {
  if (adx > 25) {
    // Güçlü Trend Piyasası
    return { trend: 0.45, momentum: 0.15, volatility: 0.10, value: 0.20, news: 0.10 };
  } else if (adx < 20) {
    // Yatay / Konsolidasyon Piyasası
    return { trend: 0.15, momentum: 0.30, volatility: 0.25, value: 0.20, news: 0.10 };
  }
  // Geçiş Rejimi (20 <= ADX <= 25)
  return { trend: 0.30, momentum: 0.20, volatility: 0.15, value: 0.20, news: 0.15 };
}
```

---

## 3. ALT ANALİZ MODELLERİ VE 6-SÜTUNLU KARAR DESTEK MİMARİSİ

Uygulama, finansal değerlendirmeleri **6 Temel Sütun (6-Pillar Architecture)** çerçevesinde yapılandırır:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       6-SÜTUNLU ANALİZ MODELİ                           │
├───────────────┬───────────────┬───────────────┬─────────────────────────┤
│ 1. Karne      │ 2. Sermaye ve │ 3. Pay Geri   │ 4. Yeni İş Sözleşmeleri │
│ (18 Parametre)│    Temettü    │    Alımları   │    (KAP Oranları)       │
├───────────────┼───────────────┼───────────────┼─────────────────────────┤
│ 5. Halka Arz  │ 6. Strateji   │ 7. Endeks     │ 8. Şeffaf Resmi Veri    │
│    ve Fon     │    Karar      │    Katkı Puanı│    Kaynakları           │
│    Kullanımı  │    Matrisi    │    Ağırlığı   │    (KAP/SPK/TCMB/FRED)  │
└───────────────┴───────────────┴───────────────┴─────────────────────────┘
```

1. **18 Parametreli Şirket Karnesi:** Kârlılık (6 parametre), Büyüme (6 parametre) ve Kaldıraç/Borçluluk (6 parametre) metrikleri üzerinden puanlama.
2. **Sermaye ve Temettü Disiplini:** Temettü verimi, dağıtma oranı, bedelsiz sermaye artırım geçmişi ve sulandırma (dilution) riski tespiti.
3. **Pay Geri Alım (Share Buyback) Programları:** Tamamlanma oranı, ortalama geri alım maliyeti ve kurumsal taban fiyat desteği etkisi.
4. **Yeni İş İlişkileri ve Sipariş Katalizörleri:** 
   $$\text{İş İlişkisi Etki Oranı (\%)} = \left(\frac{\text{Sözleşme Tutarı}}{\text{Yıllık Şirket Cirosu}}\right) \times 100$$
5. **Halka Arz & Fon Kullanım Kalitesi:** İzahname fon kullanım raporunda sermayenin Ar-Ge, kapasite artışı veya işletme sermayesine aktarılma oranlarının kalite tespiti.
6. **Strateji Karar Matrisi:** Değer Yatırımı, Büyüme Yatırımı, Momentum veya İzleme kararı.

---

## 4. DETERMINİSTİK RİSK, STOP-LOSS VE POZİSYON YÖNETİMİ

Halüsinasyonu önlemek amacıyla tüm fiyat hedefleri ve stop seviyeleri doğrudan saf kod (`server/signalEngine/indicators.ts`) tarafında hesaplanır.

### 4.1. ATR Tabanlı Hedef ve Stop-Loss Formülleri

$$\text{Stop-Loss} = \text{RoundToTick}(\text{CurrentPrice} - 1.5 \times ATR_{14})$$
$$\text{Risk Mesafesi} = \text{CurrentPrice} - \text{Stop-Loss}$$
$$\text{Hedef (Kısa Vade)} = \text{RoundToTick}(\text{CurrentPrice} + \text{Risk Mesafesi} \times R:R)$$
$$\text{Hedef (Orta Vade)} = \text{RoundToTick}(\text{CurrentPrice} + \text{Risk Mesafesi} \times R:R \times 2)$$

*Varsayılan Risk/Ödül Oranı ($R:R$): 1:3.0*

### 4.2. Portföy Seviyesi Risk Sınırları (`canOpenNewPosition`)

```typescript
export function canOpenNewPosition(
  currentPositions: Position[],
  newCandidate: SignalCandidate,
  limits: PortfolioLimits = DEFAULT_PORTFOLIO_LIMITS
): RiskCheckResult {
  // 1. Sektör Konsantrasyon Limiti: Aynı sektörde maksimum 2 pozisyon
  const sameSectorCount = currentPositions.filter(p => p.sector === newCandidate.sector).length;
  if (sameSectorCount >= limits.maxSectorPositions) {
    return { allowed: false, reason: `Sektör limiti aşıldı (${newCandidate.sector}: maks ${limits.maxSectorPositions})` };
  }

  // 2. Toplam Portföy Açık Risk Limiti: Maksimum %15
  const totalOpenRisk = currentPositions.reduce((acc, p) => acc + (p.riskAmount / p.accountEquity), 0);
  if (totalOpenRisk + newCandidate.riskRatio > limits.maxTotalOpenRisk) {
    return { allowed: false, reason: `Toplam risk limiti aşıldı (Mevcut: %${(totalOpenRisk*100).toFixed(1)}, Maks: %15)` };
  }

  // 3. Günlük Maksimum Yeni Pozisyon: Günde maksimum 3 işlem
  if (todayNewTradesCount >= limits.maxDailyNewTrades) {
    return { allowed: false, reason: `Günlük yeni işlem limiti doldu (Maks: 3)` };
  }

  return { allowed: true };
}
```

---

## 5. ÇİFT KATMANLI DOĞRULAMA VE HALÜSİNASYON ÖNLEME KATMANI

`server/validation/validateAnalysisOutput.ts` modülü, yapay zeka çıktısının ham deterministik kaynak verileriyle tutarlılığını 4 kritik kural ile denetler:

```
   [ Gemini LLM Yanıtı ]
             │
             ▼
┌─────────────────────────────┐
│    1. Sayısal Tolerans      │ ──> |Model Hedef - Kod Hedef| > 0.05 ?  ──> [ DÜZELT / DOWNGRADE ]
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│    2. Sembol / İsim Uyumu   │ ──> Metin sembol/şirket adını içeriyor mu? ──> [ RETRY ]
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│    3. Uydurma Haber Filtresi │ ──> Başlıklar gerçek haber listesinde var mı? ──> [ RETRY ]
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│    4. Deterministik Sabitleme│ ──> Hedef & Stop alanları saf kod ile kilitlenir
└─────────────┬───────────────┘
              ▼
    [ Onaylı Çıktı (ACCEPT) ]
```

---

## 6. BACKTEST, WALK-FORWARD ANALİZİ VE MONTE CARLO SİMÜLASYONU

Sistemin strateji performansı ve aşırı öğrenme (overfitting) denetimi `server/signalEngine/backtestEngine.ts` üzerinden çalıştırılır.

### 6.1. Walk-Forward Analizi
*   **In-Sample (Eğitim) Penceresi:** 100 bar
*   **Out-of-Sample (Doğrulama) Penceresi:** 50 bar
*   **Data Leakage Koruması:** Geleceğe dönük veri sızıntısı guard-clause ile engellenmiştir.

### 6.2. Monte Carlo Simülasyonu
*   **İterasyon Sayısı:** 1.000 simüle edilmiş portföy patikası
*   **Metrikler:** 5. Yüzdelik (Worst Case), 50. Yüzdelik (Medyan), 95. Yüzdelik (Best Case) ve Maksimum Drawdown (MDD) dağılımı.

---

## 7. PİYASA VERİ AKIŞLARI, RING-BUFFER VE SEANS OPTİMİZASYONU

### 7.1. Gerçek Fiyat Halka Tamponu (Ring-Buffer Sparkline)
Sentetik `Array.from` kaldırılmış olup her varlık için son 12 gerçek veri noktası saklanır:

```typescript
export function recordRealPriceTick(symbol: string, price: number): { sparkline: number[]; sparklineReal: (number | null)[] } {
  let history = realSparklineHistoryMap.get(symbol) || [];
  history.push(price);
  if (history.length > 12) history.shift();
  
  const paddedReal: (number | null)[] = Array(Math.max(0, 12 - history.length)).fill(null).concat(history);
  return { sparkline: [...history], sparklineReal: paddedReal };
}
```

### 7.2. Seans Saatleri Denetimi (`isMarketHours`)
Worker'ın kapalı piyasalarda gereksiz sorgu atmasını ve rate-limit oluşturmasını engeller:
*   **Kripto Piyasalar:** 7/24 Kesintisiz aktif.
*   **Borsa İstanbul (BIST):** Hafta içi TR Saatiyle 09:55 – 18:15 arası.
*   **ABD Borsaları (NYSE/NASDAQ):** Hafta içi TR Saatiyle 16:30 – 23:00 arası.

### 7.3. Emtia & Sarrafiye Türetme Formülleri
$$\text{Gram Altın (TL)} = \left(\frac{\text{Ons Altın (USD)}}{31.1034768}\right) \times \text{USD/TRY} \times 0.995$$
$$\text{Çeyrek Altın (TL)} = \text{Gram Altın} \times 1.75 \times (1 + 0.05)$$
$$\text{Yarım Altın (TL)} = \text{Çeyrek Altın} \times 2$$
$$\text{Tam Altın (TL)} = \text{Çeyrek Altın} \times 4$$
$$\text{Gram Gümüş (TL)} = \left(\frac{\text{Ons Gümüş (USD)}}{31.1034768}\right) \times \text{USD/TRY} \times 0.999$$

---

## 8. VERİ MODELLERİ, TİPLER VE ŞEMALAR (TYPESCRIPT MATRIX)

### 8.1. `LiveMarketQuote` (`src/types.ts`)
```typescript
export interface LiveMarketQuote {
  symbol: string;
  name: string;
  category: MarketCategory;
  currentPrice: number;
  change24h: number;
  change24hPercent: number;
  currency: string;
  high24h?: number;
  low24h?: number;
  volume?: string;
  peRatio?: number;
  sparkline: number[];
  sparklineReal?: (number | null)[];
  lastUpdated: string;
  isLiveRealtime?: boolean;
}
```

### 8.2. `AnalysisData` (`src/types.ts`)
```typescript
export interface AnalysisData extends StockAnalysisDetail {
  confidenceLevel: 'YÜKSEK' | 'ORTA' | 'DÜŞÜK';
  promptVersion: string;
  generatedAt: string;
  groundingUsed: boolean;
  calculatedTargets: {
    targetShortTerm: number;
    targetMidTerm: number;
    stopLoss: number;
    riskReward: string;
  };
  validationStatus: 'ACCEPT' | 'RETRY' | 'REJECT_AND_FLAG' | 'DOWNGRADE_CONFIDENCE';
}
```

---

## 9. ARAYÜZ (UI/UX) VE GÖRSELLEŞTİRME KATMANI

1.  **Canlı Fiyat Bandı (`MarketTickerBar.tsx`):**
    *   Hız ölçeği: 10 ile 1000 saniye arasında tam kullanıcı kontrolü.
    *   CSS `animation-duration` değişkeniyle senkronize kayma.
2.  **Flaş Haber Bandı (`MarketNewsSection.tsx`):**
    *   Bağımsız kayma hızı, kategori etiketleri ve duygu rozetleri (Bullish/Neutral/Bearish).
3.  **Fırsat Radarı (`OpportunityScanner.tsx`):**
    *   Bileşik skor progress barları, rejim rozetleri (Trend/Yatay) ve portföy risk kısıt uyarıları ("⚠️ Portföy limiti").
4.  **Hisse Analiz Modalı (`StockAnalysisModal.tsx`):**
    *   6-Sütunlu karne görselleştirmesi, ATR tabanlı hedef kutuları, SPK/KAP doğrulama rozetleri.

---

## 10. TEST VE DOĞRULAMA SONUÇLARI

### 10.1. Sinyal Motoru Test Paketi Çıktısı

```
======================================================================
           Sinyal Motoru v2 — Test Paketi Doğrulama Raporu
======================================================================
Toplam Test Sayısı    : 42
Başarılı Testler      : 42
Başarısız Testler     : 0
Başarı Oranı          : %100.00
Toplam Süre           : 38 ms
======================================================================
[PASS] T-1.01: Veri Doğrulama (Data Integrity)
[PASS] T-2.01 - T-2.17: Teknik İndikatörler (EMA, RSI, MACD, ATR, BB, ADX)
[PASS] T-3.01 - T-3.06: Uyumsuzluk Tespiti (Bullish/Bearish Divergence)
[PASS] T-4.01 - T-4.04: Rejim Tespiti ve Dinamik Ağırlık Dağılımı
[PASS] T-5.01 - T-5.04: Bileşik Skorlama ve Ensemble Karar Mekanizması
[PASS] T-6.01 - T-6.04: Kelly Kriteri ve Dinamik Pozisyon Boyutlandırma
[PASS] T-7.01 - T-7.04: Portföy Kısıtları ve Risk Yönetimi (canOpenNewPosition)
[PASS] T-8.01 - T-8.04: Walk-Forward, Monte Carlo ve Data Leakage Denetimi
======================================================================
```

### 10.2. Derleme ve Tip Denetimi
*   `tsc --noEmit`: **0 Hata** (Temiz)
*   `vite build`: **Başarılı** (Üretim paketi hazır)

---
*Bu teknik dokümantasyon, MarketPulse AI sisteminin tüm algoritmik ve operasyonel bileşenlerini temsil eden resmi sistem referans belgesidir.*
