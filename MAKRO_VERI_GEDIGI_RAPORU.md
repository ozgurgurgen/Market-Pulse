# Makro Veri Gediği (Macro Data Blindspot) Düzeltme Raporu

## Sorun Tespiti
Kullanıcı tarafından `server/indicator_fetchers/` dizini altındaki Makro Ekonomik gösterge dosyalarının (TCMB, ECB, FRED, TÜİK) eksik/API'siz listesinde yer aldığı bildirilmiştir.

Yapılan kod incelemesinde şu saptanmıştır:
1. Bu dosyalar (`EcbFetcher.ts`, `FredFetcher.ts`, `TuikMacroFetcher.ts`, `TcmbEvdsFetcher.ts`) gerçek bir dış ağ çağrısı (HTTP request) yapmamaktadır. **Bunun yerine, doğrudan statik/hardcoded (sabitlenmiş) veri dizileri (array) döndürmektedirler.** Örneğin, ECB faizi doğrudan koda `3.25` olarak yazılmış, FRED işsizlik oranı `4.1` olarak mock'lanmıştır.
2. `timeSeriesService.ts` ve benzeri dosyalar ise, grafik verisini gerçek API'lerden çekmek yerine `Math.sin()` ve `Math.cos()` formüllerini kullanarak simüle edilmiş dalgalı zaman serileri (Mock Zaman Serisi) üretmektedir.
3. Önceki denetimlerde, `Math.sin` yakalayıcısı sadece fiyat (`price`) veya hedef (`target`) gibi kısıtlı değişken adlarına duyarlıydı. Bu sebeple ekonomik grafik üreten mock'lar bu filtreye takılmadan "API'siz" listesine sızmıştır.
4. Benzer şekilde, koda doğrudan statik diziler (hardcoded data) olarak gömülmüş simüle API dosyaları da, `fetch` veya `axios` içermedikleri için ilk turlarda teknik olarak haklı, fakat iş mantığı olarak "yanıltıcı biçimde" atlanmıştır.

## Alınan Aksiyonlar ve Düzeltme (Fix)
Önceki tüm ham doğrulamalar kayıpsız korunarak, raporlama script'ine şu yeni algılayıcılar (Dedektörler) eklendi:

- **Mock Zaman Serisi Dedektörü:** `Math.sin` veya `Math.random` kullanan herhangi bir "zaman serisi" veya "grafik/çizim" dosyası artık istisnasız **"Sahte/Simüle Veri Üretimi (Matematiksel Zaman Serisi)"** olarak damgalandı (Böylece `timeSeriesService.ts` yakalandı).
- **Simüle Makro Veri Dedektörü:** Doğrudan koda gömülü sahte/sabit ekonomik veriler döndüren modüller (`const indicators: EconomicIndicator[] = [...]` kalıbı) **"Sahte/Simüle Makro Veri Kaynağı (Hardcoded)"** olarak tespit edildi (Böylece `EcbFetcher.ts`, `FredFetcher.ts`, `TcmbEvdsFetcher.ts`, `TuikMacroFetcher.ts` yakalandı).
- **Yerel Cache/Fallback Dedektörü:** API ulaşılamadığında veya simüle modda kullanıldığında yerel veritabanı yedeğini (fallback) okuyan orkestratör servisler (`MacroDataAggregatorService.ts` vb.) listeye **"Makro Veri Çekirdek/Yönetici Modülü"** etiketiyle dahil edildi.

## Sonuç
- Makro veri ve ekonomik gösterge üreten, yöneten ve simüle eden (TCMB, ECB, FRED, TUIK, Yahoo Finance Macro ve Aggregator servisleri) **7 yeni kritik dosya**, `API_KAYNAKLARI_NIHAI_DUZELTILMIS.md` listesine eklendi.
- Böylece projedeki "Gerçek veri çekmiyor ama öyleymiş gibi sahte (simüle) veri basıyor" şeklindeki veri kirliliği (CANTE örneğindeki gibi) tamamen gün yüzüne çıkarılmıştır.

Toplam API'li / Veri bağlantılı / Simüle dosya sayısı **144'ten 151'e** çıkmıştır.
