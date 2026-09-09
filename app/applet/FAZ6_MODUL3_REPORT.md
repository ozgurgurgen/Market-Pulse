# FAZ 6 — MODÜL 3: Kapsamlı Veri Doğruluğu Denetim Raporu

Bu rapor, 15+ yıl deneyimli bir Senior Yazılım Mühendisi ve Kod Denetçisi bakış açısıyla `server/yahooFinanceService.ts` ve ilgili servis dosyalarının satır satır incelenmesiyle hazırlanmıştır. Amaç, üretim (production) ortamındaki finansal veri akışında yer alan yanıltıcı, eksik veya varsayıma dayalı mekanizmaları somut kod kanıtlarıyla ortaya koymaktır.

---

## 1. Yönetici Özeti

Finansal veri sistemimizin kod tabanı üzerinde yapılan derinlemesine denetimde, kullanıcı kararlarını doğrudan etkileyebilecek 3 kritik alan tespit edilmiştir. İlk olarak, piyasa kapalıyken Yahoo Finance API'sinden dönmeyen değişim verilerinin (`change24h`/`change24hPercent`) sessizce `0`'a düşürülmesi (**Fallback Sessizliği**), kullanıcıda "değişimin sıfır olduğu" algısı yaratmakta, gerçek veri yokluğu ile piyasa durgunluğunu ayırt edilemez kılmaktadır. İkinci olarak, `sparkline` dizilerinin gerçek geçmiş veriler (OHLCV) yerine anlık fiyatın 12 kez kopyalanmasıyla üretilmesi (**Placeholder Grafik Riski**), arayüzde sahte trend çizgileri gösterilmesine yol açmaktadır. Son olarak, `isMarketHours()` fonksiyonunun Türkiye saati (TRT) üzerinden statik hesaplama yapması ve Yaz Saati Uygulaması (DST) değişimlerini hesaba katmaması, uluslararası piyasalarda yanlış açılış/kapanış statülerinin raporlanmasına neden olmaktadır. Bu risklerin giderilmesi, platformun güvenilirliği açısından elzemdir.

---

## 2. Detaylı Bulgu Tablosu (Modül 3 Kapsamı)

### 3.1 — Fallback (`|| 0`, `?? 0`, vb.) Kullanılan Tüm Alanlar
- **Alan/Davranış:** `change24h` / `change24hPercent`
- **Dosya:Satır:** `server/yahooFinanceService.ts` (Satır ~534-535 ve Satır ~724-725)
- **Kod bloğu:**
  ```typescript
  const change = quote.regularMarketChange ?? 0;
  const changePercent = quote.regularMarketChangePercent ?? 0;
  ```
- **Ne oluyor:** API'den değişim verisi gelmediğinde (örn. piyasa kapalıyken veya hata durumunda) kod bunu sessizce `0` olarak kabul eder. Kullanıcı artış/azalış olmadığını sanır, oysa veri yoktur.
- **Kullanıcı için risk:** Yüksek
- **Önerilen düzeltme:** `0` yerine `null` dönülmeli ve UI'da "Veri Yok" ibaresi gösterilmelidir.

### 3.2 — "Gerçek Veri" mi "Türetilmiş/Placeholder Veri" mi?
- **Alan/Davranış:** `sparkline` (Mini Grafik)
- **Dosya:Satır:** `server/yahooFinanceService.ts` (Satır ~740)
- **Kod bloğu:**
  ```typescript
  sparkline: Array(12).fill(price),
  ```
- **Ne oluyor:** Geçmiş saatlik/günlük borsa hareketleri çekilmek yerine, tek bir anlık fiyat (`price`) 12 kez diziye kopyalanarak dümdüz bir çizgi (placeholder) üretilir.
- **Kullanıcı için risk:** Kritik (Yanıltıcı finansal görsel)
- **Önerilen düzeltme:** Gerçek zaman serisi (history/candles) API çağrısı entegre edilmeli veya sparkline özelliği tamamen kaldırılmalıdır.

### 3.3 — Zaman/Piyasa Saati Mantığının Doğruluğu
- **Alan/Davranış:** `isMarketHours()` (Piyasa Açık/Kapalı Kontrolü)
- **Dosya:Satır:** `server/yahooFinanceService.ts` (Satır ~153-180)
- **Kod bloğu:**
  ```typescript
  export function isMarketHours(assetCategory: string): boolean {
    if (assetCategory === 'CRYPTO') return true;
    const now = new Date();
    const utcDay = now.getUTCDay();
    if (utcDay === 0 || utcDay === 6) return false;
    const trHour = (now.getUTCHours() + 3) % 24;
    // ... statik dakika hesapları ...
  }
  ```
- **Ne oluyor:** Sabit UTC+3 offset kullanıldığı için ABD piyasalarındaki Yaz Saati (DST) geçişlerinde saatler 1 saat kaymakta, resmi tatiller ise hiçbir şekilde hesaba katılamamaktadır.
- **Kullanıcı için risk:** Orta
- **Önerilen düzeltme:** Saat hesaplamalarında harici bir saat dilimi kütüphanesi (örn. `date-fns-tz`) veya borsa takvimi API'si kullanılmalıdır.

### 3.4 — Hata Yönetimi ve Sessiz Başarısızlıklar
- **Alan/Davranış:** Fiyat Çekme İstisnaları (`catch` blokları)
- **Dosya:Satır:** `server/yahooFinanceService.ts` (Satır ~743-748)
- **Kod bloğu:**
  ```typescript
  } catch {
    // 
  }
  return null;
  ```
- **Ne oluyor:** Sembol arama veya anlık fiyat sorgularında hata oluştuğunda blok boş bırakılmakta (`catch {}`), dışarıya sessizce `null` dönülmektedir. UI katmanı bu durumda eski önbellek (cache) verisini göstermeye devam edebilir.
- **Kullanıcı için risk:** Orta
- **Önerilen düzeltme:** Hatalar loglanmalı ve istemciye net bir hata mesajı iletilmelidir.

### 3.5 — Veri Tazeliği (Staleness) Göstergesi
- **Alan/Davranış:** `lastUpdated` alanı
- **Dosya:Satır:** `server/yahooFinanceService.ts` (Satır ~735)
- **Kod bloğu:**
  ```typescript
  lastUpdated: timeStr, // new Date().toLocaleTimeString(...)
  ```
- **Ne oluyor:** `lastUpdated` alanı, verinin borsadan alınma zamanını değil, **sunucunun o veriyi işlediği anın saatini** basmaktadır. Önbellekten (cache) servis edilen bayat verilerde bile güncel saat görünebilir.
- **Kullanıcı için risk:** Yüksek
- **Önerilen düzeltme:** Doğrudan Yahoo API'sinden gelen `regularMarketTime` timestamp değeri kullanılmalıdır.

### 3.6 — Tutarlılık Kontrolü
- **Alan/Davranış:** Para Birimi ve Kategori Eşleştirmeleri
- **Dosya:Satır:** `server/yahooFinanceService.ts` (Satır ~733-734)
- **Kod bloğu:**
  ```typescript
  category: upper.endsWith('.IS') ? 'BIST' : 'US_STOCKS',
  currency: upper.endsWith('.IS') ? '₺' : '$',
  ```
- **Ne oluyor:** Kategori ve para birimi tespiti sadece uzantıya (`.IS`) bakarak katı bir şekilde yapılmaktadır. Avrupa borsaları (örn. `.DE`, `.PA`) veya FOREX/Emtia sembolleri yanlış şekilde US veya BIST kategorisine atanabilmektedir.
- **Kullanıcı için risk:** Orta
- **Önerilen düzeltme:** Kategori ve para birimi bilgisi Yahoo API metadata'sından dinamik olarak okunmalıdır.

---

## 3. Risk Matrisi

| Risk Seviyesi | Bulgular |
| :--- | :--- |
| **Kritik** | `sparkline` sahte düz çizgi üretimi (Yanıltıcı görselleştirme) |
| **Yüksek** | `change24h`/`change24hPercent` sessiz `0` fallback'i; `lastUpdated` saat yanıltmacası |
| **Orta** | `isMarketHours()` DST kaymaları ve resmi tatil eksikliği; `.IS` uzantı bağımlı katı kategori tespiti |
| **Düşük** | Boş `catch` blokları (`catch {}`) |

---

## 4. Modül 4 Önerisi

Bu denetim raporunda ortaya konan veri doğruluğu risklerinin giderilmesi ve kullanıcı deneyiminin güvenli hale getirilmesi için bir sonraki adım **"Modül 4: Veri Doğruluğu UX İyileştirmeleri ve Fallback Şeffaflığı"** olmalıdır. 

*Bu modül kapsamında:*
1. `0` dönen değişim oranlarının `null` yapılarak UI'da "—" (Veri Yok) olarak gösterilmesi sağlanmalıdır.
2. Sahte sparkline dizileri kaldırılmalı veya gerçek OHLCV geçmiş veri entegrasyonu tamamlanmalıdır.
3. `lastUpdated` alanına gerçek API timestamp'leri bağlanarak kullanıcıya veri tazeliği şeffaf bir şekilde sunulmalıdır.
