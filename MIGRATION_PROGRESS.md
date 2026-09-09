# 📋 Dış Veri Kaynakları Adaptör Katmanı (ACL) Göç İlerleme Tablosu

Bu dosya, **MarketPulse AI** platformunda dış veri kaynaklarının güvenli göç (Anti-Corruption Layer) adımlarını takip eder.

| Faz / Kaynak Adı | Tip | Öncelik | A/B Test Sonucu | Canary Test | Durum | Notlar |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Faz 0: Envanter & Keşif** | Mimari | P0 | — | — | ✅ TAMAMLANDI | 6 ana dış veri kaynağı tespit edildi ve envanteri çıkarıldı. |
| **Faz 1: Sabit İç Sözleşme (Canonical Schema)** | Tip Tanımı | P0 | — | — | ✅ TAMAMLANDI | `NormalizedQuote`, `NormalizedFund`, `NormalizedIndicator` tipleri `server/dataAdapters/types.ts` altında tanımlandı. |
| **Faz 2: Göç Sıralaması** | Planlama | P0 | — | — | ✅ TAMAMLANDI | 1. Yahoo/BIST, 2. TEFAS, 3. TCMB/FRED/ECB, 4. Binance/Forex/KAP sıralaması onaylandı. |
| **Kaynak 1: Yahoo Finance (BIST & Global)** | API | P1 | 20/20 (%100 Uyumlu) | ✅ Sağlıklı (THYAO.IS) | ✅ TAMAMLANDI | `.IS` sonekleri normalize edildi, TRY para birimi ve fiyat > 0 sanity check sağlandı. |
| **Kaynak 2: Binance Crypto** | API | P2 | 2/2 (%100 Uyumlu) | ✅ Sağlıklı (BTCUSDT) | ✅ TAMAMLANDI | BTC, ETH, SOL çiftleri normalize edilip USD USDT dönüşümü yapıldı. |
| **Kaynak 3: TEFAS (Scraping & API)** | Scraping / API | P1 | 15/15 (%100 Uyumlu) | ✅ Sağlıklı (TI2, MAC, TCD) | ✅ TAMAMLANDI | Canary testi ile HTML/JSON bozulma kontrolü eklendi, `Math.random` üretimi tamamen engellendi. |
| **Kaynak 4: TCMB / FRED / ECB / TUIK** | API / Open Data | P2 | %100 Uyumlu | ✅ Sağlıklı (Politika Faizi, TÜFE) | ✅ TAMAMLANDI | Makro göstergeler tek tip `NormalizedIndicator` sözleşmesine bağlandı. |
| **Kaynak 5: Frankfurter Forex** | API | P3 | %100 Uyumlu | ✅ Sağlıklı (EUR/TRY) | ✅ TAMAMLANDI | ECB referans kurları normalize edildi. |
| **Faz 4: Merkezi Fallback & Yöneticiler** | Yönetim | P1 | — | — | ✅ TAMAMLANDI | `QuoteSourceManager`, `FundSourceManager`, `MacroSourceManager` devrede. |
| **Faz 5: Doğrulama & Regresyon** | Test | P0 | 0 Regresyon | Tüm Testler Geçti | ✅ TAMAMLANDI | `adminIntegrityRouter` ve CLI test motoru ile uçtan uca doğrulandı. |
| **Faz 6: Fresh-Eyes Checklist** | Kalite | P0 | %100 Onaylandı | — | ✅ TAMAMLANDI | Ölü kodlar temizlendi, derleme ve lint hatasız geçti. |
