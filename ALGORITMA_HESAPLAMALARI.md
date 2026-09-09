# Gelişmiş Algoritma ve Hesaplama Modelleri

Bu belge, MarketPulse platformunda kullanılan **Buffett Değerleme Modeli**, **Gelişmiş Teknik Analiz İndikatörleri** ve **Makroekonomik Analiz** sistemlerinin arkasındaki matematiksel formülleri ve mantığı açıklamaktadır.

---

## 1. 🎯 Buffett Değerleme Analizi (Value Investing Model)

Warren Buffett'ın değer yatırımı prensiplerine dayalı olarak şirketin içsel değerini (Intrinsic Value) ve güvenli marjını (Margin of Safety) hesaplayan modeldir.

### a) Owner Earnings (Hissedar Kazancı)
Şirketin hissedarlarına yaratabileceği gerçek nakit akışını temsil eder. Sadece net kâra odaklanmak yerine amortismanları geri ekler ve sermaye harcamalarını çıkarır.
* **Formül:** `Owner Earnings (OE) = Net Income + Depreciation & Amortization - Capital Expenditures (CapEx)`
* **OE Yield:** `(Owner Earnings / Market Cap) * 100`

### b) İndirgenmiş Nakit Akışı (DCF - Discounted Cash Flow) Değerlemesi
Gelecekteki nakit akışlarını (OE) bugünkü değere (Present Value) indirgeyerek şirketin adil değerini bulur.
* **1-5 Yıl Projeksiyonu (PV):** `Σ (OE * (1 + g)^t) / (1 + WACC)^t` 
  *(t = 1'den 5'e kadar, g = 5 Yıllık Büyüme Beklentisi)*
* **Uç Değer (Terminal Value - TV):** `(OE_Year5 * (1 + tg)) / (WACC - tg)`
  *(tg = Kalıcı Büyüme Oranı, genelde %2-3 uzun vadeli enflasyon)*
* **İndirgenmiş Uç Değer (PTV):** `TV / (1 + WACC)^5`
* **İçsel Değer (Intrinsic Value):** `PV + PTV`

### c) Güvenli Marj (Margin of Safety)
İçsel değerin güncel fiyattan ne kadar yüksek olduğunu yüzde olarak gösterir.
* **Formül:** `((Intrinsic Value Per Share - Current Price) / Intrinsic Value Per Share) * 100`
* *Not:* %20'nin üzeri güçlü bir güvenlik marjı kabul edilir.

### d) Buffett Skoru (0-100)
Şirketin temel rasyoları (ROE, Kâr Marjı, Borçluluk) ve değerleme sonuçları baz alınarak oluşturulan 100 üzerinden bir puandır.
* **ROE (Özkaynak Kârlılığı) (>%15):** 20 Puan
* **Net Kâr Marjı (>%15):** 20 Puan
* **Borç / Özkaynak (<0.5):** 20 Puan
* **OE Yield (>8%):** 20 Puan
* **Margin of Safety (>30%):** 20 Puan

---

## 2. 📊 Gelişmiş Teknik Analiz Hesaplamaları

### a) RSI (Relative Strength Index)
Fiyatın ne kadar hızlı ve büyük değiştiğini ölçerek aşırı alım/satım bölgelerini belirler.
* **Formül:** `RSI = 100 - (100 / (1 + RS))`
* `RS = (Ortalama Kazanç / Ortalama Kayıp)` - (Varsayılan 14 Periyot)

### b) MACD (Moving Average Convergence Divergence)
İki hareketli ortalama arasındaki ilişkiyi gösterir. Trend yönünü ve gücünü ölçer.
* **MACD Çizgisi:** `12 Günlük EMA - 26 Günlük EMA`
* **Sinyal Çizgisi:** `MACD Çizgisinin 9 Günlük EMA'sı`
* **Histogram:** `MACD Çizgisi - Sinyal Çizgisi`

### c) Bollinger Bantları
Fiyatın volatilitesini ölçer.
* **Orta Bant:** `20 Günlük SMA`
* **Üst Bant:** `20 Günlük SMA + (20 Günlük Standart Sapma * 2)`
* **Alt Bant:** `20 Günlük SMA - (20 Günlük Standart Sapma * 2)`

### d) Stochastic Oscillator
Kapanış fiyatının belirli bir dönemdeki en yüksek ve en düşük fiyatlara göre konumunu gösterir.
* **%K:** `(Current Close - Lowest Low(14)) / (Highest High(14) - Lowest Low(14)) * 100`
* **%D:** `%K'nın 3 periyotluk SMA'sı`

### e) Pivot Noktaları (Klasik Pivot)
Destek ve direnç seviyelerini belirlemek için kullanılır.
* **Pivot Noktası (PP):** `(High + Low + Close) / 3`
* **Direnç 1 (R1):** `(2 * PP) - Low`
* **Destek 1 (S1):** `(2 * PP) - High`
* **Direnç 2 (R2):** `PP + (High - Low)`
* **Destek 2 (S2):** `PP - (High - Low)`

### f) SuperTrend
Fiyat trendini belirlemek için Average True Range (ATR) kullanan takipçi indikatör.
* **Temel Üst Bant:** `((High + Low) / 2) + (Multiplier * ATR)`
* **Temel Alt Bant:** `((High + Low) / 2) - (Multiplier * ATR)`
* Kapanış fiyatına göre yön değiştirir (Trend Up / Trend Down).

---

## 3. 📅 Ekonomik Takvim ve Makroekonomik Modeller

Ekonomik takvim (TR, US, EU, vb.) verileri öncelik (Yüksek/Orta/Düşük) seviyelerine göre sınıflandırılır.
* **Yüksek Öncelikli (3 Puan):** Faiz kararları (FED, TCMB, ECB), TÜFE (Enflasyon), Tarımdışı İstihdam (NFP), Büyüme (GSYH).
* **Orta Öncelikli (2 Puan):** ÜFE, Perakende Satışlar, İmalat PMI.
* **Düşük Öncelikli (1 Puan):** İşsizlik Başvuruları, Konut Satışları vb.

Karşılaştırma Algoritması: `Gerçekleşen Veri > Beklenti` durumu olay tipine göre yorumlanır. Örneğin; enflasyonun beklentiden yüksek gelmesi piyasa için negatifken, büyümenin yüksek gelmesi pozitiftir.

---

## 4. 🇺🇸 ABD Piyasası (NYSE/NASDAQ) & Analist Puanlamaları

Tüm hisseler Yahoo Finance adaptörü üzerinden çekilir. Analist görüşleri ve hedef fiyatlar (Target Price) üzerinden "Upside Potential" hesaplanır.
* **Upside Potansiyeli:** `((Analist Hedef Fiyat Ortalaması - Güncel Fiyat) / Güncel Fiyat) * 100`
