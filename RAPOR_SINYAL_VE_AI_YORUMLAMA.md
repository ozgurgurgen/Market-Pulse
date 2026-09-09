# Uçtan Uca Rapor: Ayarlanabilir Teknik Sinyal Parametreleri + AI Sinyal Yorumlama Katmanı

## 1. Yönetici Özeti (Executive Summary)

MarketPulse AI platformunda teknik analiz motoru ve kullanıcı etkileşimi, modern finans mühendisliği standartlarına ve regülasyon uyumluluğuna göre iki temel aşamada uçtan uca yükseltilmiştir:

1. **Kullanıcı Tarafından Ayarlanabilir Parametrik Sinyal Motoru:**
   - Önceden sabit (hardcoded) olan hareketli ortalamalar, RSI, MACD, Bollinger Bantları ve ATR parametreleri; 3 katmanlı (Sistem Varsayılanı / Hazır Presetler / Gelişmiş Özel Ayarlar) dinamik bir mimariye kavuşturulmuştur.
   - Backend seviyesinde giriş doğrulama (validation) katmanı ve `symbol + paramHash` izolasyonlu önbellek (cache) mimarisi kurulmuştur.

2. **AI Sinyal Yorumlama ve İndikatör Okuryazarlığı Katmanı:**
   - AI, tahmin veya al/sat tavsiyesi üretmek yerine, hesaplanmış teknik indikatörlerin teorik olarak ne anlama geldiğini, birbirini nasıl teyit ettiğini (confluence), çelişkileri ve tuzakları (false breakouts) kullanıcıya öğreten tarafsız bir finansal okuryazarlık eğitmeni olarak konumlandırılmıştır.
   - Sıkı prompt kuralları, prompt injection savunması, yasaklı ifade filtre katmanı ve backend tarafından kod seviyesinde zorunlu eklenen yasal uyarı (disclaimer) ile tam uyumluluk garanti altına alınmıştır.

---

## 2. FAZ 1 & FAZ 2 — Keşif, Envanter ve Parametre Şeması

### 2.1 Eski Durum vs Yeni Parametrik Yapı

| İndikatör / Alan | Eski Durum (Sabit Değerler) | Yeni Parametrik Şema (Ayarlanabilir) | Mantıksal Sınırlar & Validasyon |
| :--- | :--- | :--- | :--- |
| **Hareketli Ortalamalar** | EMA 20, EMA 50, SMA 200 (Sabit) | `fastMaPeriod`, `mediumMaPeriod`, `slowMaPeriod`, `maType` (EMA/SMA) | Kısa [5-100], Orta [10-200], Uzun [50-300] (Kısa < Orta < Uzun) |
| **RSI (Momentum)** | 14 periyot, 70/30 eşik (Sabit) | `rsiPeriod`, `rsiOverbought`, `rsiOversold` | Periyot [2-50], Aşırı Alım [50-95], Aşırı Satım [5-50] (Alım > Satım) |
| **MACD** | 12 / 26 / 9 (Sabit) | `macdFastPeriod`, `macdSlowPeriod`, `macdSignalPeriod` | Hızlı [2-50], Yavaş [5-100], Sinyal [2-50] (Hızlı < Yavaş) |
| **Bollinger Bantları** | 20 periyot, 2.0σ (Sabit) | `bbPeriod`, `bbStdDev` | Periyot [5-100], Standart Sapma [1.0 - 4.0] |
| **ATR & Hedef/Stop** | Sabit oran | `atrPeriod`, `riskRewardRatio` | ATR [2-50], R:R [1.0 - 10.0] |
| **Hacim Çarpanı** | 1.5x (Sabit) | `volumeMultiplier` | [1.0 - 10.0] |

### 2.2 Üç Katmanlı Preset Mimarisi

1. **Kısa Vadeli / Scalping & Day Trade (`SHORT_TERM`):**
   - Hızlı tepki veren, kırılımlara duyarlı: EMA 9 / EMA 21 / SMA 50, RSI 9 (Aşırı Alım: 75, Aşırı Satım: 25), MACD 6/13/5, BB 14/2.0, ATR 10, R:R 1:2.0.
2. **Orta Vadeli / Swing Trade (`MEDIUM_TERM` - Varsayılan):**
   - Dengeli piyasa döngüleri ve gürültü filtresi: EMA 20 / EMA 50 / SMA 200, RSI 14 (Aşırı Alım: 70, Aşırı Satım: 30), MACD 12/26/9, BB 20/2.0, ATR 14, R:R 1:3.0.
3. **Uzun Vadeli / Pozisyon & Değer (`LONG_TERM`):**
   - Makro trend takibi: SMA 50 / SMA 100 / SMA 200, RSI 21 (Aşırı Alım: 65, Aşırı Satım: 35), MACD 19/39/9, BB 30/2.5, ATR 20, R:R 1:4.0.
4. **Özel Ayarlar (`CUSTOM`):**
   - Kullanıcının slider ve inputlarla bağımsız olarak tüm parametreleri belirleyebildiği esnek mod.

---

## 3. FAZ 3 & FAZ 4 — Parametrik Sinyal Motoru İmplementasyonu

### 3.1 Backend Mimarisi
- **Modüller:**
  - `server/signalEngine/technicalParameters.ts`: Parametre tanımları, sınır kontrolleri, presetler ve MD5 hash üreticisi (`getParamHash`).
  - `server/signalEngine/technicalCalculation.ts`: Dinamik teknik hesaplama motoru, pivot/destek/direnç formülasyonu, senaryo türetimi ve sinyal rozetleri (`SignalItemSummary[]`).
  - `server/routes/stockDetailRouter.ts`: `GET /:symbol/technical` (Query params) ve `POST /:symbol/technical` (JSON body) rotaları.
- **Cache Ayrışımı:**
  - Önbellek anahtarı: `${symbol}:${paramHash}`. Farklı parametre kullanan kullanıcıların veya farklı presetlerin sonuçları birbirine karışmaz.

### 3.2 Frontend ve Kullanıcı Deneyimi
- **Bileşen:** `src/components/StockAnalysis/TechnicalEngineTab.tsx`
- **Özellikler:**
  - Tek tıkla Preset değişimi (Kısa, Orta, Uzun Vade).
  - Açılır/kapanır "Gelişmiş Özel Ayarlar" paneli (range slider'lar, tam sayı kısıtları, anlık doğrulama hataları).
  - Canlı Destek/Direnç (R1, R2, R3 / S1, S2, S3), Pivot noktası, ATR dinamik hedefi ve ATR Stop-Loss hatları.
  - Aktif teknik sinyal rozetleri (Trend, Momentum, Volatilite ve Destek-Direnç durumları).
  - `localStorage` kalıcılığı ile kullanıcının belirlediği özel ayarların korunması.

---

## 4. FAZ 5 & FAZ 6 — AI Sinyal Yorumlama Katmanı

### 4.1 Mimari ve Güvenlik İlkeleri

```
[Kullanıcı Arayüzü] 
        │ (İstek: Sinyalleri Yorumla)
        ▼
[Backend Deterministik Motor] ──> Sadece İndikatör & Sinyal JSON'ı üretir
        │
        ▼
[Gemini 3.7 Flash + Sıkı Sistem Promptu] ──> Eğitici, Olasılıksal Yorum Üretir
        │
        ▼
[Yasaklı Kelime Filtre Katmanı] ──> Al/Sat/Garanti İfadelerini Denetler
        │ (Geçti / Fallback)
        ▼
[Zorunlu Yasal Uyarı Ekleme] ──> Backend kod seviyesinde disclaimer ekler
        │
        ▼
[İstemciye Güvenli Sunum & Önbellek]
```

### 4.2 Güvenlik ve Uyumluluk Tedbirleri
1. **Yatırım Tavsiyesi ve Fiyat Öngörüsü Yasağı:**
   - AI'ya verilen sistem promptu "al", "sat", "fiyat yükselecek" gibi doğrudan/dolaylı hiçbir ifade üretmemesi üzere kilitlenmiştir.
2. **Çelişen Sinyallerin Vurgulanması:**
   - RSI aşırı alımdayken MACD pozitifse, AI birini gizlemek yerine "Trend güçlü ancak düzeltme ve oynaklık riski artabilir" şeklinde iki yönlü analiz sunar.
3. **Otomatik Filtre ve Güvenli Fallback:**
   - `FORBIDDEN_PHRASES_REGEX` filtresi al/sat/tavsiye ifadelerini tespit eder; ihlal durumunda `buildDeterministicEducationalFallback` fonksiyonu devreye girer.
4. **Kod Seviyesinde Değişmez Yasal Uyarı:**
   - `MANDATORY_LEGAL_DISCLAIMER` metni doğrudan backend kodu tarafından her cevaba enjekte edilir.
5. **Prompt Injection Direnci:**
   - Girdi JSON salt okunur veri olarak etiketlenmiş olup, kullanıcı girdisindeki hiçbir metin talimat olarak algılanmaz.

---

## 5. FAZ 7 & FAZ 8 — Doğrulama Döngüsü ve Bağımsız Denetim Sonuçları

`scripts/testTechnicalParamsAndAi.ts` üzerinden çalıştırılan bağımsız denetim sonuçları:

```
====================================================
🧪 AYARLANABİLİR TEKNİK ANALİZ & AI YORUMLAMA TESTLERİ
====================================================

--- TEST 1: Preset ve Validasyon Katmanı ---
✅ [GEÇTİ] MEDIUM_TERM preseti geçerli olmalı
✅ [GEÇTİ] SHORT_TERM preseti RSI 9 ile geçerli olmalı
✅ [GEÇTİ] LONG_TERM preseti geçerli olmalı
✅ [GEÇTİ] RSI Aşırı Alım <= Aşırı Satım olduğunda hata üretmeli
✅ [GEÇTİ] MACD Hızlı >= Yavaş olduğunda hata üretmeli
✅ [GEÇTİ] Sınır dışı periyotlarda validation hatası üretmeli

--- TEST 2: Parametrik Hesaplama ve Cache Ayrışımı ---
✅ [GEÇTİ] Farklı presetler farklı paramHash üretmeli
✅ [GEÇTİ] SHORT_TERM hızlı ortalamayı 9 periyot hesaplamalı
✅ [GEÇTİ] LONG_TERM hızlı ortalamayı 50 periyot hesaplamalı
✅ [GEÇTİ] Sinyal rozetleri listesi üretilmeli
✅ [GEÇTİ] Aynı parametrelerle cache hash eşleşmeli

--- TEST 3: AI Sinyal Yorumlama ve Güvenlik Filtreleri ---
✅ [GEÇTİ] Eğitici özet metin üretilmeli
✅ [GEÇTİ] Eğitici kontrol listesi üretilmeli
✅ [GEÇTİ] Yasaklı ifade filtresi tavsiye cümlelerini yakalamalı
✅ [GEÇTİ] Eğitici ve olasılıksal cümleler filtreye takılmamalı

--- TEST 4: Canlı AI Sinyal Yorumlama Entegrasyonu ---
✅ [GEÇTİ] AI yorumunda sembol doğru dönmeli
✅ [GEÇTİ] Değişmez yasal uyarı çıktıda mutlaka bulunmalı
✅ [GEÇTİ] Özet konsept açıklaması mevcut olmalı
✅ [GEÇTİ] AI çıktısı tavsiye yasağı kurallarına uymalı

--- TEST 5: Prompt Injection Savunması ---
✅ [GEÇTİ] Prompt injection metni çıktıyı bozamamalı
✅ [GEÇTİ] Yasal uyarı her koşulda korunmalı

====================================================
📊 TEST SONUCU: 21/21 (%100.0) BAŞARILI
====================================================
```

- **TypeScript Lint (`tsc --noEmit`):** 0 Hata (Tam Tip Güvenliği)
- **Production Build (`npm run build`):** Başarılı

---

## 6. Canlı Kullanım Kılavuzu ve Geliştirici Referansı

### 6.1 API Endpoint'leri

#### `POST /api/stock/:symbol/technical`
- **İstek Body:**
  ```json
  {
    "preset": "SHORT_TERM",
    "fastMaPeriod": 9,
    "mediumMaPeriod": 21,
    "slowMaPeriod": 50,
    "rsiPeriod": 9,
    "rsiOverbought": 75,
    "rsiOversold": 25,
    "macdFastPeriod": 6,
    "macdSlowPeriod": 13,
    "macdSignalPeriod": 5
  }
  ```
- **Yanıt:**
  ```json
  {
    "success": true,
    "data": {
      "ticker": "THYAO",
      "currentPrice": 318.5,
      "trendDirection": "STRONG_BULLISH",
      "pivotPoint": 317.2,
      "supportLevels": [312.4, 305.8, 298.1],
      "resistanceLevels": [324.5, 331.2, 340.0],
      "rsi": 68.5,
      "signalsList": [...],
      "paramHash": "a1b2c3d4e5"
    }
  }
  ```

#### `POST /api/stock/:symbol/interpret-signals`
- **İstek Body:** `{ "technicalData": { ... }, "params": { ... } }`
- **Yanıt:**
  ```json
  {
    "success": true,
    "data": {
      "symbol": "THYAO",
      "paramPreset": "SHORT_TERM",
      "educationalAnalysis": {
        "summaryConcept": "...",
        "confluenceAssessment": "...",
        "contradictionNote": "...",
        "riskAndFalseBreakoutFactors": "...",
        "recommendedEducationalChecklist": [...]
      },
      "disclaimer": "⚠️ Yasal Uyarı: Bu içerik tamamen teknik indikatör okuryazarlığı ve eğitim amaçlıdır...",
      "validationStatus": "PASSED"
    }
  }
  ```
