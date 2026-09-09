# Veri Doğrulama Katmanı (Data Integrity Layer) Özeti

Bu görev kapsamında, uygulamanın finansal veri bütünlüğünü ve güvenilirliğini sağlayan bir Çapraz Doğrulama Motoru eklendi.

### Eklenen / Değiştirilen Dosyalar
1. `server/config/dataIntegrityConfig.ts` - Kaynak öncelik, tölerans, sıçrama (jump) ve yaş (staleness) eşiklerini içeren merkezi config.
2. `server/services/dataIntegrityService.ts` - Çapraz doğrulama motorunu, anomali tespiti ve LLM çift onay mantığını (`llmDoubleParseWithValidation`) içeren ana servis.
3. `server/services/dataIntegrityService.test.ts` - Doğrulama servisi için unit testler.
4. `server/routes/adminIntegrityRouter.ts` - Çelişen/Anomali olan veriler için İnsan Onay Kuyruğu (Human Review Queue) API endpointleri.
5. `server.ts` - Admin Integrity router entegrasyonu sağlandı.
6. `server/yahooFinanceService.ts` - Canlı piyasa verileri (`getLiveQuoteForSymbol` ve toplu çekim noktaları) `validateField` ile sarmalanarak (wrapped) validation metadata'sı ile zenginleştirildi.
7. `src/components/ui/ValidationBadge.tsx` - Doğrulama durumunu (verified, unconfirmed, stale vb.) önyüzde gösterecek rozet (badge) UI componenti eklendi.
8. `src/components/MarketOverview.tsx` - Fiyat verilerinin yanına görsel olarak doğrulama rozeti bağlandı.

### Veri Akışı ve Doğrulama Adımları

| Veri Alanı | Mevcut Kaynak | Uygulanan Doğrulama Adımı | Çıktı / Statü |
| :--- | :--- | :--- | :--- |
| **Piyasa Fiyatı (Quotes)** | Binance, Yahoo Finance | Çift Kaynak Çapraz Kontrol, Anomali (Sıçrama) Tespiti, Yaş (Staleness) Tespiti | `verified`, `unconfirmed`, `conflicting`, `stale` veya `anomaly_flagged` |
| **Finansal Oranlar / Rasyolar** | KAP/BIST APIs, LLM Parse | `llmDoubleParseWithValidation` ile Çift Parse (Farklı promptlar ile). | Consensus varsa `ai_verified`, düşük eşleşme varsa `pending_human_review` (Onay kuyruğuna düşer). |

Tüm bu doğrulama işlemleri doğrudan Firestore `data_integrity_audit` tablosuna loglanmaktadır.
