# 📊 MarketPulse AI — Yönetici Analitik, Portföy Trendleri & AI Model Seçim Sistemi Raporu

Bu belge, **MarketPulse AI** platformunda hayata geçirilen **Yönetici Kullanıcı & Portföy Analitiği Motoru (Katman A, B, C)** ile **Dinamik Yapay Zeka Model Seçim Sistemi**'nin mimarisini, güvenlik ve KVKK uyum kurallarını ve teknik detaylarını özetler.

---

## 🏗️ 1. Mimarî Yapı & 3 Katmanlı Analiz Modeli

Sistem, kullanıcı verilerinin hassasiyeti ve KVKK/GDPR prensipleri gözetilerek **3 ayrı katmanda** tasarlanmıştır:

```
+-----------------------------------------------------------------------------------+
|                        ADMIN PANELİ: ANALİTİK & İSTİHBARAT                        |
+-----------------------------------------------------------------------------------+
       |                                |                                   |
       v                                v                                   v
+-----------------------+   +-----------------------+   +---------------------------+
|   KATMAN A: KULLANIM  |   |  KATMAN B: PORTFÖY    |   |  KATMAN C: BİREYSEL       |
|   & AKTİVİTE ANALİTİĞİ|   |  & FİNANSAL EĞİLİMLER |   |  DESTEK (GEREKÇELİ)       |
+-----------------------+   +-----------------------+   +---------------------------+
| • Toplam Kullanıcı    |   | • En Çok İzlenenler   |   | • KVKK Uyarı Başlığı      |
| • 24s/7g/30g Aktiflik |   | • En Çok Tutulanlar   |   | • Zorunlu İnceleme Nedeni |
| • Üyelik Dağılımı     |   | • Varlık Sınıfı Dağılım|  | • Kaçınılmaz Audit Log    |
| • 7 Günlük Sorgu Trend|   | • Portföy Dilimleri   |   | • Minimum Gerekli Veri    |
| • Modül Kullanım Oranı|   | • K-Anonymity (N < 5) |   | • Kota & Üyelik Durumu    |
| • SIFIR PII (Anonim)  |   | • SIFIR PII (Anonim)  |   |                           |
+-----------------------+   +-----------------------+   +---------------------------+
                                        |
                                        v
                    +---------------------------------------+
                    |    🤖 YAPAY ZEKA STRATEJİ MOTORU      |
                    +---------------------------------------+
                    | • Google Cloud (Gemini 3.7 / 3.1)     |
                    | • Yerel LLM / Ollama (DeepSeek / LLaMA|
                    | • Özel LM Studio / vLLM Endpoint      |
                    | • Anlık Yönetim Kurulu İçgörü Raporu  |
                    +---------------------------------------+
```

---

## 🛡️ 2. Gizlilik, Güvenlik ve K-Anonymity Protokolü

1. **Katman A & Katman B (Sıfır PII Garantisi)**:
   - Bu katmanlar hiçbir kullanıcı kimliği (UID), e-posta, ad-soyad veya bireysel hesap detayı içermez.
   - **K-Anonymity Eşiği (< 5 Kullanıcı Kuralı)**: 5'ten az kullanıcının yer aldığı küçük finansal segmentler veya sermaye dilimleri, tersine mühendislikle kimlik tespitini önlemek amacıyla otomatik olarak `"< 5 (Gizlilik Korumalı)"` şeklinde maskelenir.
2. **Katman C (Bireysel Destek Görünümü - Zorunlu Gerekçe & Audit Kaydı)**:
   - Destek amaçlı tekil kullanıcı incelemesinde **en az 5 karakterlik geçerli bir gerekçe** (`reason`) yazılması zorunludur.
   - Gerekçesiz istekler backend tarafında `400 Bad Request` ile doğrudan engellenir.
   - Başarılı her sorgulama anında `{ adminUid, targetUserId, action: 'VIEW_INDIVIDUAL_USER_DATA', details: reason, ipAddress, timestamp }` bilgileriyle **silinemez denetim kütüğüne (Audit Log)** işlenir.

---

## 🤖 3. Yapay Zekâ Model Seçimi & Yerel (Local) Model Entegrasyonu

Admin Panelinde hem genel sistem hem de analitik raporlama için dilediğiniz yapay zekâ modelini seçebilir ve test edebilirsiniz:

| Sağlayıcı (Provider) | Desteklenen Modeller | Kullanım Alanı & Avantajı |
| :--- | :--- | :--- |
| **Google Cloud (Gemini)** | `gemini-3.7-flash`<br>`gemini-3.1-pro-preview`<br>`gemini-3.1-flash-lite`<br>`gemini-2.5-pro` | Bulut tabanlı, anlık ve yüksek çıkarım hızı. Güncel piyasa verileri ve makro analizler için optimize. |
| **Yerel (Ollama / Local LLM)** | `deepseek-r1:latest`<br>`llama3.3:70b`<br>`qwen2.5:latest`<br>`mistral:latest` | Tamamen kendi bilgisayarınızda / sunucunuzda çalışan, sıfır API maliyetli ve tam veri gizliliği sağlayan yerel modeller. |
| **Özel Yerel Endpoint** | LM Studio (`http://localhost:1234/v1`), vLLM, Text Generation WebUI | OpenAI API uyumlu yerel sunucular ile dilediğiniz özel ince ayarlı (fine-tuned) modeli bağlama imkanı. |

---

## 📡 4. Backend API Endpointleri

| Metot | Yol | Erişim Yetkisi | Açıklama |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/analytics/overview` | Admin (`requireAdmin`) | Katman A: Agregatif kullanım ve aktivite metrikleri (Snapshot'tan hızlı okuma). |
| `GET` | `/api/admin/analytics/portfolio` | Admin (`requireAdmin`) | Katman B: Agregatif portföy ve finansal eğilimler (K-Anonymity korumalı). |
| `POST` | `/api/admin/analytics/refresh` | Admin (`requireAdmin`) | Analitik snapshot verilerini arka planda anında yeniden hesaplar. |
| `POST` | `/api/admin/analytics/ai-insights` | Admin (`requireAdmin`) | Seçilen modelle (Gemini veya Yerel LLM) Yönetici Strateji Raporu üretir. |
| `GET` | `/api/admin/users/:id/support-detail` | Admin (`requireAdmin`) | Katman C: Bireysel destek detayı (**`?reason=...` parametresi zorunludur**). |
| `GET` | `/api/admin/analytics/export` | Admin (`requireAdmin`) | Agregatif analitik verilerini UTF-8 CSV olarak indirir. |

---

## ⚡ 5. Otomatik Zamanlayıcı (Scheduler) & Performans Optimizasyonu

- **Snapshot Caching**: Admin paneli açıldığında binlerce kullanıcı kaydı tek tek taranmaz. Veriler `analyticsSnapshots` koleksiyonunda ve yerel veritabanında önceden derlenmiş olarak saklanır; bu sayede sayfalar **milisaniyeler içinde** açılır.
- **Arka Plan Görevi**: `schedulerService.ts` her 6 saatte bir ve sunucu ilk başladığında analitik özetini otomatik günceller.
