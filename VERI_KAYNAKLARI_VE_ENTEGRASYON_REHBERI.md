# MarketPulse AI - Kapsamlı Veri Kaynakları, Eksik Veri Envanteri ve Entegrasyon Rehberi

Bu belge, **MarketPulse AI** platformunda kullanılan tüm dış veri kaynaklarını, canlı çekilen/çekilemeyen veri alanlarını, dahili simülasyon ve bilgi tabanı yedeklerini ve harici veri sağlayıcılardan beklenen **JSON / REST / PostgreSQL veri şemalarını** eksiksiz olarak listeler.

---

## 1. Veri Kaynakları & Genel Durum Matrisi

| Kategori | Veri Alanı | Mevcut Durum | Aktif Çekilen Kaynak | Eksik / Yedekleme (Fallback) Durumu | Öncelik / Kritiklik |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BIST Piyasa Verisi** | Canlı & Gecikmeli Fiyatlar | ✅ Aktif | Yahoo Finance (`/v8/finance/chart`) / Local API | 15 dk gecikmeli; anlık kademe/derinlik eksik | Yüksek |
| **BIST Piyasa Verisi** | Piyasa Çarpanları (F/K, PD/DD, FD/FAVÖK) | ⚠️ Kısmi | Yahoo Finance / Bilgi Tabanı | Banka dışı sektörlerde FAVÖK/Borç oranları bazı hisselerde null | Yüksek |
| **BIST Piyasa Verisi** | Para Giriş - Çıkış & Aracı Kurum Dağılımı (AKD) | ❌ Eksik | Yok | Simüle algoritma kullanılıyor | Orta |
| **BIST Finansallar** | Çeyreklik / Yıllık Bilanço (KAP) | ⚠️ Kısmi | Local Finance API (`financials`) / Bilgi Tabanı | 35 hissenin bilançosu çekiliyor, 300+ BIST hissesi için eksik | Kritik |
| **BIST Finansallar** | Gelir Tablosu, Marjlar & Esas Faaliyet Kârı | ⚠️ Kısmi | Local Finance API (`financials`) | Çeyreklik brüt/FAVÖK marj geçmişi eksik | Kritik |
| **BIST Finansallar** | Nakit Akım Tablosu (FCF, CAPEX) | ❌ Eksik | Bilgi Tabanı / Tahmini | Serbest Nakit Akımı doğrudan çekilemiyor | Yüksek |
| **TEFAS Fonları** | Fon Fiyatları & Geçmiş Getiriler | ⚠️ Kısmi | Local Finance API (`funds`) | 600+ aktif fonun günlük getiri geçmişi eksik | Yüksek |
| **TEFAS Fonları** | Fon Portföy Dağılımı (Hisse/Tahvil/Döviz) | ⚠️ Kısmi | Local Finance API | 200 fon için var, kalanlar için Takasbank verisi gecikmeli | Orta |
| **TEFAS Fonları** | Fon Portföyündeki İlk 10 Hisse | ❌ Eksik | Yok | Takasbank KAP portföy dağıtım raporları eksik | Orta |
| **SPK / Halka Arz** | Onaylanan & Taslak Halka Arzlar | ✅ Aktif | `ipoListings` / Local API (`ipo`) | 15 halka arz güncel; yeni bültenler manuel/otomatik tetikleniyor | Orta |
| **SPK / Halka Arz** | Konsorsiyum, Dağıtım & Katılımcı Sayısı | ⚠️ Kısmi | Local API (`ipo`) | Sonuç bülteni açıklamaları kısmi | Düşük |
| **Makroekonomi** | TCMB Politika Faizi, TÜFE/ÜFE Enflasyon | ✅ Aktif | TCMB EVDS (`/service/evds`) | Tam entegre | Tamamlandı |
| **Döviz & Emtia** | USD/TRY, EUR/TRY, Gram Altın, Brent Petrol | ✅ Aktif | Frankfurter / Binance / Yahoo | Spot gram altın BIST yerine XAUUSD*USDTRY olarak türetiliyor | Tamamlandı |
| **Kripto Varlıklar** | BTC/USDT, ETH/USDT vb. | ✅ Aktif | Binance REST API (`/api/v3/ticker/24hr`) | Tam entegre | Tamamlandı |
| **KAP & Şirket Haberleri** | Özel Durum Açıklamaları, İhale, Geri Alım | ⚠️ Kısmi | Local API (`disclosures`, `buybacks`) | Anlık KAP RSS/WebSocket akışı eksik | Orta |

---

## 2. Detaylı Veri Alanları ve Beklenen JSON / REST Şemaları

Harici veri sağlayıcınızdan (`Local Finance API`, `Cloudflare Tunnel`, `PostgreSQL` veya `REST API`) beklenen veri modelleri aşağıdadır:

---

### 2.1. Borsa İstanbul Hisse Senedi & Screener Verisi
- **Endpoint**: `GET /api/export/companies` veya `GET /api/screener/stocks`
- **Tablo Adı**: `companies` & `prices`

```json
[
  {
    "ticker": "THYAO",
    "company_name": "Türk Hava Yolları A.O.",
    "sector": "Ulaştırma / Havacılık",
    "current_price": 318.50,
    "daily_change_pct": 2.45,
    "volume_try": 4850000000,
    "market_cap_try": 439530000000,
    "pe_ratio": 6.85,
    "pb_ratio": 1.42,
    "ev_ebitda": 4.90,
    "net_debt_ebitda": 0.65,
    "current_ratio": 1.35,
    "roe": 34.2,
    "dividend_yield": 2.8,
    "beta_5y": 0.92,
    "money_inflow_net_try": 145000000,
    "top_buyers": ["İş Yatırım", "Bank of America", "Garanti BBVA"],
    "top_sellers": ["Yapı Kredi", "QNB Finansinvest"],
    "updated_at": "2026-09-06T18:30:00Z"
  }
]
```

---

### 2.2. KAP Bilanço, Gelir Tablosu & Finansal Kalemler (36 Sütun)
- **Endpoint**: `GET /api/export/financials/{ticker}` veya `GET /api/export/bulk?tables=financials`
- **Tablo Adı**: `financials`

```json
{
  "ticker": "EREGL",
  "year": 2026,
  "period": 6,
  "announced_date": "2026-08-15",
  "revenue": 85000000000,
  "revenue_yoy": 38.5,
  "gross_profit": 14200000000,
  "gross_margin": 16.7,
  "operating_profit": 11500000000,
  "operating_margin": 13.5,
  "ebitda": 13800000000,
  "ebitda_margin": 16.2,
  "net_profit": 9200000000,
  "net_profit_yoy": 44.2,
  "net_margin": 10.8,
  "total_assets": 195000000000,
  "current_assets": 78000000000,
  "short_term_liabilities": 45000000000,
  "long_term_liabilities": 38000000000,
  "net_debt": 6400000000,
  "equity": 112000000000,
  "working_capital": 33000000000,
  "free_cash_flow": 5600000000,
  "operating_cash_flow": 9800000000,
  "capex": 4200000000,
  "paid_capital": 3500000000,
  "retained_earnings": 65000000000,
  "disclosure_id": "1655968"
}
```

---

### 2.3. TEFAS & Takasbank Yatırım Fonları Verisi
- **Endpoint**: `GET /api/export/funds` & `GET /api/export/fund/{code}`
- **Tablo Adı**: `funds` & `fund_allocations`

```json
{
  "code": "TI2",
  "name": "İş Portföy BIST 100 Dışı Şirketler Hisse Senedi Fonu",
  "category": "Hisse Senedi Şemsiye Fonu",
  "price": 14.852400,
  "daily_return": 1.25,
  "return_1m": 8.40,
  "return_3m": 22.10,
  "return_6m": 48.30,
  "return_1y": 94.50,
  "return_ytd": 41.20,
  "total_value": 4500000000,
  "outstanding_shares": 303000000,
  "investor_count": 34200,
  "management_fee": 2.90,
  "sharpe_ratio": 2.14,
  "standard_deviation": 18.5,
  "loss_days_ratio": 38.2,
  "allocation": {
    "hisse_senedi": 88.50,
    "para_piyasasi": 6.20,
    "kamu_borclanma": 0.0,
    "ozel_sektor_borclanma": 0.0,
    "diger": 5.30
  },
  "top_holdings": [
    { "ticker": "ASTOR", "weight_pct": 8.40 },
    { "ticker": "MIATK", "weight_pct": 7.10 },
    { "ticker": "ALFAS", "weight_pct": 6.80 },
    { "ticker": "KCAER", "weight_pct": 5.90 },
    { "ticker": "KONTR", "weight_pct": 5.40 }
  ],
  "price_history": [
    { "date": "2026-09-01", "price": 14.45 },
    { "date": "2026-09-02", "price": 14.58 },
    { "date": "2026-09-03", "price": 14.62 },
    { "date": "2026-09-04", "price": 14.71 },
    { "date": "2026-09-05", "price": 14.85 }
  ]
}
```

---

### 2.4. SPK Halka Arz (IPO) Listesi & Dağıtım Bilgileri
- **Endpoint**: `GET /api/export/bulk?tables=ipo` veya `GET /api/admin/ipo`
- **Tablo Adı**: `ipo`

```json
[
  {
    "ticker": "KARYE",
    "company_name": "Kartal Yenilenebilir Enerji A.Ş.",
    "status": "APPROVED",
    "offer_price": 42.50,
    "total_shares": 30000000,
    "ipo_size_try": 1275000000,
    "dates": "12-13-14 Eylül 2026",
    "distribution_type": "Eşit Dağıtım",
    "consortium_leader": "Gedik Yatırım Menkul Değerler A.Ş.",
    "bist_market": "Yıldız Pazar",
    "p_e_ratio_ipo": 7.8,
    "discount_rate": 22.5,
    "prospectus_url": "https://www.kap.org.tr/tr/Bildirim/1655968",
    "fund_usage": [
      { "area": "Güneş Enerjisi Santral Yatırımı", "percentage": 55 },
      { "area": "İşletme Sermayesi Finansmanı", "percentage": 30 },
      { "area": "Kısa Vadeli Banka Kredi Ödemesi", "percentage": 15 }
    ],
    "allotment_result": {
      "total_applicants": 2450000,
      "shares_per_investor": 12,
      "allotment_try": 510
    }
  }
]
```

---

### 2.5. Şirket Geri Alımları (Share Buybacks)
- **Endpoint**: `GET /api/export/bulk?tables=buybacks`
- **Tablo Adı**: `buybacks`

```json
[
  {
    "ticker": "THYAO",
    "date": "2026-09-04",
    "shares_bought": 250000,
    "price_paid": 316.40,
    "total_try": 79100000,
    "cumulative_shares": 14200000,
    "percentage_of_capital": 1.03,
    "program_authorized_try": 5000000000,
    "disclosure_id": "1654890"
  }
]
```

---

### 2.6. KAP Özel Durum Açıklamaları & Şirket Bildirimleri
- **Endpoint**: `GET /api/export/bulk?tables=disclosures`
- **Tablo Adı**: `disclosures`

```json
[
  {
    "disclosure_id": "1655968",
    "ticker": "ASELS",
    "company_name": "Aselsan Elektronik Sanayi ve Ticaret A.Ş.",
    "title": "Yeni İş İlişkisi: Savunma Sanayii Başkanlığı ile Sözleşme İmzalanması",
    "category": "Özel Durum Açıklaması (Genel)",
    "summary": "Şirketimiz ile Savunma Sanayii Başkanlığı arasında 450 Milyon USD tutarında yeni nesil radar ve haberleşme sistemleri tedarik sözleşmesi imzalanmıştır.",
    "publish_date": "2026-09-06T17:45:00Z",
    "impact_level": "VERY_HIGH",
    "sentiment": "POSITIVE",
    "kap_url": "https://www.kap.org.tr/tr/Bildirim/1655968"
  }
]
```

---

## 3. Verileri Sisteme Bağlama ve Aktarma Yöntemleri

### Yöntem 1: Local Finance API / Cloudflare Tunnel (Önerilen Canlı Yöntem)
1. Python (FastAPI/Flask) veya Node.js ile yukarıdaki rotaları sağlayan bir servis çalıştırın.
2. Cloudflare Tunnel veya sabit IP vererek URL üretin (örn: `https://bobby-layout-circles-reform.trycloudflare.com`).
3. MarketPulse AI platformunda **Admin Paneli > Veritabanı Entegrasyonu** sayfasına gidip **Base URL** alanına bu adresi kaydedin.
4. Sistem `/api/export/*` rotalarını otomatik periyotlarla sorgulayarak önbelleği ve veritabanını günceller.

### Yöntem 2: Doğrudan PostgreSQL / SQL Veritabanı
1. PostgreSQL sunucunuzda aşağıdaki tabloları oluşturun:
   - `companies`
   - `prices`
   - `financials`
   - `funds`
   - `fund_allocations`
   - `ipo`
   - `buybacks`
   - `disclosures`
   - `macro_indicators`
2. **Admin Paneli > Veritabanı Entegrasyonu** sekmesine `Host`, `Port`, `Database`, `User`, `Password` bilgilerini girin veya `.env` üzerinden `POSTGRES_URL` parametresi tanımlayın.
3. Sistem senkronizasyon motoru doğrudan SQL üzerinden verileri çeker.

### Yöntem 3: Admin Paneli Toplu JSON / CSV İçe Aktarma
1. Yukarıdaki JSON formatlarına uygun dosyaları hazırlayın.
2. Admin panelinde ilgili modülün yükleyicisine sürükleyip bırakarak anlık içe aktarım yapabilirsiniz.
