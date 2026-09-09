# FAZ 6 — MODÜL 3: Kesin Kod Kanıtları ve isLiveRealtime Açıklama Raporu

Bu rapor, Kalıcı Doğrulama Protokolü kurallarına tam uygun olarak `isLiveRealtime` mantığının kod düzeyindeki gerekçesini ve Modül 3 bulgularının `grep -n` ile doğrulanmış kesin satır numaralarını içerir.

---

### 1. `isLiveRealtime` Alanının Değer Mantığı (`AAPL` vs `THYAO` / `BTC-USD`)

Bu alanın farklı sonuçlar üretmesinin kök nedeni, koddaki **`isMarketHours()`** fonksiyonudur.

* **Kod Satırı:** `server/yahooFinanceService.ts` satır ~153 - 180 (`isMarketHours`) ve satır ~268 / ~509 / ~566 (`isLiveRealtime: isMarketHours(...)`).
* **Açıklama:**
    * **AAPL (`US_STOCKS`):** `isMarketHours` fonksiyonu, ABD piyasaları için Türkiye saatiyle (TRT) hafta içi **16:30 - 23:00** aralığını baz alır (`trTimeMinutes >= 990 && trTimeMinutes <= 1380`). Testin yapıldığı saatte ABD borsaları kapalı olduğu için fonksiyon `false` döner; bu nedenle `isLiveRealtime: false` olur.
    * **BTC-USD (`CRYPTO`):** Fonksiyonun başında doğrudan `if (assetCategory === 'CRYPTO') return true;` kontrolü vardır. Kripto paralar 7/24 açık olduğu için her zaman `true` döner.
    * **THYAO.IS (`BIST`):** Borsa İstanbul için hafta içi **09:55 - 18:15** aralığı kontrol edilir (`trTimeMinutes >= 595 && trTimeMinutes <= 1095`). Gündüz seans saatlerinde test edildiği için `true` döner.

---

### 2. Modül 3 Bulgularının Kesin Satır Numaraları (`grep -n` Doğrulamalı)

| # | Bulgu / Alan | Dosya ve Kesin Satır Numaraları | İlgili Kod Bloğu Özeti |
|---|---|---|---|
| **3.1** | **Sessiz Fallback (`?? 0`)** | `server/yahooFinanceService.ts` (Satır **534-535**, **724-725**) | `const change = quote.regularMarketChange ?? 0;` |
| **3.2** | **Placeholder `sparkline`** | `server/yahooFinanceService.ts` (Satır **125-149** ve **742**) | `sparkline: Array(12).fill(price),` (Anlık fiyatın kopyalanması) |
| **3.3** | **Statik `isMarketHours`** | `server/yahooFinanceService.ts` (Satır **153-180**) | Sabit UTC+3 offset ve hardcoded dakika aralıkları |
| **3.4** | **Sessiz Hata Yönetimi (`catch {}`)** | `server/yahooFinanceService.ts` (Satır **570**, **748**) | `} catch { // }` (Hataların yutulması ve `null` dönülmesi) |
| **3.5** | **Sunucu Saati `lastUpdated`** | `server/yahooFinanceService.ts` (Satır **222, 343, 563, 741**) | `lastUpdated: new Date().toLocaleTimeString(...)` (Exchange timestamp yerine sunucu saati) |
| **3.6** | **Katı Kategori Heuristiği (`endsWith('.IS')`)** | `server/yahooFinanceService.ts` (Satır **732-736**) | `category: upper.endsWith('.IS') ? 'BIST' : 'US_STOCKS'` |

---
*Bu rapor `/app/applet/FAZ6_MODUL3_CONFIRMED.md` dosyasına kaydedilmiştir. Modül 3 resmi olarak kapanmıştır.*
