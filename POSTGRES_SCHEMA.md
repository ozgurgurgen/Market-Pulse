# MarketPulse PostgreSQL İlişkisel Veritabanı Haritası (ERD)

MarketPulse ve yerel finans veri hattınız (Local Finance Pipeline) için tasarlanan **PostgreSQL İlişkisel Veritabanı Haritası (ERD)**, tablo ilişkileri ve doğrudan local veritabanınızda çalıştırabileceğiniz **hazır SQL DDL şeması** aşağıda yapılandırılmıştır.

---

## 1. İlişkisel Veritabanı Haritası (ERD Genel Bakış)

```text
               ┌───────────────────────┐
               │         users         │
               │  (id [PK], email...)  │
               └───────────┬───────────┘
                           │ 1
        ┌──────────────────┼──────────────────┬─────────────────┐
        │ 1:1              │ 1:N              │ 1:N             │ 1:N
        ▼                  ▼                  ▼                 ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌──────────────┐
│  user_usage   │  │  watchlists   │  │user_portfolios│  │ price_alerts │
│ (user_id[FK]) │  │ (user_id[FK]) │  │ (user_id[FK]) │  │(user_id[FK]) │
└───────────────┘  └───────────────┘  └───────┬───────┘  └──────────────┘
                                              │ 1
                                              │ 1:N
                                              ▼
                                      ┌───────────────┐
                                      │portfolio_items│
                                      │(portfolio_id) │
                                      └───────┬───────┘
                                              │ N:1 (symbol)
                                              ▼
┌───────────────────────────────────────────────────────────────────────┐
│                          BIST & KAP MODÜLÜ                            │
│                                                                       │
│                      ┌───────────────────────┐                        │
│                      │       companies       │                        │
│                      │(ticker [PK], unvan...)│                        │
│                      └───────────┬───────────┘                        │
│                                  │ 1                                  │
│         ┌────────────────┬───────┴────────┬───────────────┐           │
│         │ 1:N            │ 1:N            │ 1:N           │ 1:N       │
│         ▼                ▼                ▼               ▼           │
│ ┌───────────────┐┌───────────────┐┌───────────────┐┌───────────────┐  │
│ │  financials   ││ stock_prices  ││kap_disclosures││ share_buybacks│  │
│ │ (ticker [FK]) ││ (ticker [FK]) ││ (ticker [FK]) ││ (ticker [FK]) │  │
│ └───────────────┘└───────────────┘└───────────────┘└───────────────┘  │
│                                  │ 1:N                                │
│                                  ▼                                    │
│                          ┌───────────────┐                            │
│                          │  settlement   │ (Takas & Yabancı Payı)     │
│                          │ (ticker [FK]) │                            │
│                          └───────────────┘                            │
└───────────────────────────────────────────────────────────────────────┘
                                  ▲
                                  │ N:1 (Opsiyonel hisse eşleşmesi)
┌─────────────────────────────────┴─────────────────────────────────────┐
│                          TEFAS FON MODÜLÜ                             │
│                                                                       │
│                      ┌───────────────────────┐                        │
│                      │      tefas_funds      │                        │
│                      │ (code [PK], name...)  │                        │
│                      └───────────┬───────────┘                        │
│                                  │ 1                                  │
│                 ┌────────────────┼────────────────┐                   │
│                 │ 1:N            │ 1:N            │ 1:N               │
│                 ▼                ▼                ▼                   │
│         ┌───────────────┐┌───────────────┐┌───────────────┐           │
│         │  fund_prices  ││fund_allocation││ fund_holdings │           │
│         │(fund_code[FK])││(fund_code[FK])││(fund_code[FK])│           │
│         └───────────────┘└───────────────┘└───────────────┘           │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 2. Modül ve Tablo İlişkileri

1. **BIST Şirketler (`companies`)**: Ana varlık tablosudur. `ticker` (ör: `THYAO`) birincil anahtardır (PK).
   - `financials`: Şirketin çeyreklik bilanço, gelir ve nakit akım tablosu (1:N, `ticker`).
   - `stock_prices`: Günlük/anlık OHLCV fiyat geçmişi (1:N, `ticker`).
   - `kap_disclosures`: KAP bildirimleri ve haber akışı (1:N, `ticker`).
   - `share_buybacks`: Şirket hisse geri alım programları (1:N, `ticker`).
   - `settlement`: Yabancı saklama oranı ve aracı kurum takas dağılımı (1:N, `ticker`).

2. **TEFAS Fonları (`tefas_funds`)**: Fon ana künyesidir. `code` (ör: `TAU`, `MAC`) birincil anahtardır (PK).
   - `fund_prices`: Tarihsel fon fiyatları ve getiri zaman serisi (1:N, `fund_code`).
   - `fund_allocations`: Varlık dağılım yüzdeleri (Hisse, Ters Repo, Eurobond vb.) (1:N, `fund_code`).
   - `fund_holdings`: Fon portföyündeki en yüksek ağırlıklı hisseler (1:N, `fund_code`).

3. **Kullanıcı & Portföy Katmanı**:
   - `users`: Kullanıcı hesapları ve abonelik paketi (Free/Pro/Enterprise).
   - `user_usage`: Günlük analiz ve yapay zekâ rapor kotaları (1:1, `user_id`).
   - `watchlists`: Kullanıcı favori takip listeleri (1:N, `user_id`).
   - `user_portfolios` & `portfolio_items`: Kullanıcı canlı ve sanal portföyleri (1:N, `portfolio_id`).
   - `price_alerts`: Fiyat ve oran tetikleyicileri (1:N, `user_id`).

---

## 3. PostgreSQL Hazır DDL SQL Scripti (`schema.sql`)

Yerel veritabanınızda (DBeaver, pgAdmin veya `psql` üzerinden) tek seferde çalıştırabileceğiniz tablo tanımları:

```sql
-- Gerekli eklentiler (UUID ve metin arama optimizasyonu)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. BIST & PİYASA VERİ MODÜLÜ
-- ============================================================

-- 1.1 BIST Şirketleri (1,014 Şirket)
CREATE TABLE IF NOT EXISTS companies (
    ticker VARCHAR(16) PRIMARY KEY,              -- örn: 'THYAO'
    title VARCHAR(255) NOT NULL,                 -- örn: 'TÜRK HAVA YOLLARI A.O.'
    sector VARCHAR(100),                         -- örn: 'Ulaştırma'
    sub_sector VARCHAR(100),                     -- örn: 'Hava Taşımacılığı'
    city VARCHAR(64),
    indices VARCHAR(64)[],                       -- örn: ARRAY['XU100', 'XU030']
    market_cap NUMERIC(20, 2),                   -- Piyasa Değeri (TL)
    free_float_rate NUMERIC(6, 2),               -- Fiili Dolaşım Oranı %
    paid_capital NUMERIC(20, 2),                 -- Ödenmiş Sermaye (TL)
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 1.2 Finansal Tablolar (36 Sütunluk Bilanço & Gelir Tablosu)
CREATE TABLE IF NOT EXISTS financials (
    id BIGSERIAL PRIMARY KEY,
    ticker VARCHAR(16) NOT NULL REFERENCES companies(ticker) ON DELETE CASCADE,
    fiscal_year INT NOT NULL,                    -- örn: 2024
    fiscal_period VARCHAR(4) NOT NULL,           -- örn: 'Q1', 'Q2', 'Q3', 'Q4'
    currency VARCHAR(4) DEFAULT 'TRY',
    revenue NUMERIC(20, 2),                      -- Net Satışlar
    gross_profit NUMERIC(20, 2),                 -- Brüt Kâr
    operating_profit NUMERIC(20, 2),             -- Faaliyet Kârı
    ebitda NUMERIC(20, 2),                       -- FAVÖK
    net_income NUMERIC(20, 2),                   -- Net Dönem Kârı
    total_assets NUMERIC(20, 2),                 -- Toplam Varlıklar
    current_assets NUMERIC(20, 2),               -- Dönen Varlıklar
    short_term_liabilities NUMERIC(20, 2),       -- Kısa Vadeli Yükümlülükler
    long_term_liabilities NUMERIC(20, 2),        -- Uzun Vadeli Yükümlülükler
    total_equity NUMERIC(20, 2),                 -- Özkaynaklar
    net_debt NUMERIC(20, 2),                     -- Net Borç
    free_cash_flow NUMERIC(20, 2),               -- Serbest Nakit Akışı
    eps NUMERIC(10, 4),                          -- Hisse Başına Kâr
    pe_ratio NUMERIC(10, 2),                     -- F/K Oranı
    pb_ratio NUMERIC(10, 2),                     -- PD/DD Oranı
    roe NUMERIC(8, 4),                           -- Özkaynak Kârlılığı %
    roa NUMERIC(8, 4),                           -- Aktif Kârlılığı %
    net_margin NUMERIC(8, 4),                    -- Net Kâr Marjı %
    raw_data JSONB,                              -- Ham dipnotlar ve ekstra rasyolar
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_company_period UNIQUE (ticker, fiscal_year, fiscal_period)
);

-- 1.3 Günlük Fiyat Geçmişi (OHLCV)
CREATE TABLE IF NOT EXISTS stock_prices (
    id BIGSERIAL PRIMARY KEY,
    ticker VARCHAR(16) NOT NULL REFERENCES companies(ticker) ON DELETE CASCADE,
    trade_date DATE NOT NULL,
    open_price NUMERIC(14, 4) NOT NULL,
    high_price NUMERIC(14, 4) NOT NULL,
    low_price NUMERIC(14, 4) NOT NULL,
    close_price NUMERIC(14, 4) NOT NULL,
    volume BIGINT DEFAULT 0,
    turnover NUMERIC(20, 2) DEFAULT 0,           -- Hacim (TL)
    change_rate NUMERIC(8, 4),                   -- Günlük Değişim %
    CONSTRAINT uq_ticker_trade_date UNIQUE (ticker, trade_date)
);

-- 1.4 KAP Bildirimleri (Disclosures)
CREATE TABLE IF NOT EXISTS kap_disclosures (
    id VARCHAR(64) PRIMARY KEY,                  -- örn: KAP bildirim ID
    ticker VARCHAR(16) REFERENCES companies(ticker) ON DELETE SET NULL,
    title TEXT NOT NULL,
    disclosure_type VARCHAR(100),                -- Özel Durum, Finansal Rapor vb.
    publish_date TIMESTAMPTZ NOT NULL,
    summary TEXT,
    kap_url TEXT,
    sentiment_score NUMERIC(5, 2),               -- AI Duygu Skoru (-1.0 ile +1.0)
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 1.5 Hisse Geri Alımları (Buybacks)
CREATE TABLE IF NOT EXISTS share_buybacks (
    id BIGSERIAL PRIMARY KEY,
    ticker VARCHAR(16) NOT NULL REFERENCES companies(ticker) ON DELETE CASCADE,
    transaction_date DATE NOT NULL,
    shares_count BIGINT NOT NULL,                -- Alınan Lot Adedi
    total_cost NUMERIC(16, 2) NOT NULL,          -- Toplam Tutar (TL)
    avg_price NUMERIC(12, 4) NOT NULL,           -- Ortalama Alış Fiyatı
    capital_ratio NUMERIC(6, 4),                 -- Sermayeye Oranı %
    announcement_link TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 1.6 Yabancı Takas & Saklama Oranları (Settlement)
CREATE TABLE IF NOT EXISTS settlement (
    id BIGSERIAL PRIMARY KEY,
    ticker VARCHAR(16) NOT NULL REFERENCES companies(ticker) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    foreign_ratio NUMERIC(6, 2) NOT NULL,        -- Yabancı Payı %
    foreign_shares BIGINT,
    broker_distribution JSONB,                   -- Aracı kurum bazlı saklama dağılımı
    CONSTRAINT uq_ticker_settlement_date UNIQUE (ticker, record_date)
);

-- 1.7 Halka Arz Takvimi (IPO)
CREATE TABLE IF NOT EXISTS ipo_listings (
    id VARCHAR(64) PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    code VARCHAR(32) NOT NULL,
    offer_price NUMERIC(12, 2),
    total_shares BIGINT,
    offer_date_start DATE,
    offer_date_end DATE,
    distribution_type VARCHAR(64),               -- 'Eşit Dağıtım', 'Oransal'
    status VARCHAR(50) DEFAULT 'upcoming',       -- 'upcoming', 'active', 'completed'
    analysis_data JSONB,                         -- AI İzahname analizi ve konsorsiyum
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. TEFAS FONLARI MODÜLÜ
-- ============================================================

-- 2.1 TEFAS Fon Ana Künyesi
CREATE TABLE IF NOT EXISTS tefas_funds (
    code VARCHAR(16) PRIMARY KEY,                -- örn: 'TAU', 'MAC', 'TCD'
    name VARCHAR(255) NOT NULL,
    founder VARCHAR(255) NOT NULL,               -- Portföy Yönetim Şirketi (PYŞ)
    category VARCHAR(64) NOT NULL,               -- 'HISSE_YOGUN', 'DEGISKEN', 'KIYMETLI_MADEN' vb.
    risk_score INT CHECK (risk_score BETWEEN 1 AND 7),
    horizon VARCHAR(32) DEFAULT 'MEDIUM',        -- 'SHORT', 'MEDIUM', 'LONG'
    current_price NUMERIC(16, 6) NOT NULL,
    daily_return NUMERIC(8, 4),
    aum NUMERIC(20, 2),                          -- Fon Toplam Değeri (TL)
    investor_count INT DEFAULT 0,
    shares_outstanding BIGINT,                   -- Tedavüldeki Pay Sayısı
    management_fee NUMERIC(6, 2),                -- Yıllık Yönetim Ücreti %
    withholding_tax NUMERIC(5, 2) DEFAULT 0.0,   -- Stopaj Oranı %
    settlement_buy VARCHAR(8) DEFAULT 'T+1',     -- Alış Valörü
    settlement_sell VARCHAR(8) DEFAULT 'T+2',    -- Satış Valörü
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2.2 Fon Fiyat Geçmişi (2+ Milyon Satırlık Zaman Serisi)
CREATE TABLE IF NOT EXISTS fund_prices (
    id BIGSERIAL PRIMARY KEY,
    fund_code VARCHAR(16) NOT NULL REFERENCES tefas_funds(code) ON DELETE CASCADE,
    price_date DATE NOT NULL,
    price NUMERIC(16, 6) NOT NULL,
    daily_return NUMERIC(8, 4),
    aum NUMERIC(20, 2),
    investor_count INT,
    CONSTRAINT uq_fund_price_date UNIQUE (fund_code, price_date)
);

-- 2.3 Fon Portföy Varlık Dağılımı (Hisse, Ters Repo vb.)
CREATE TABLE IF NOT EXISTS fund_allocations (
    id BIGSERIAL PRIMARY KEY,
    fund_code VARCHAR(16) NOT NULL REFERENCES tefas_funds(code) ON DELETE CASCADE,
    report_date DATE NOT NULL,
    asset_type VARCHAR(64) NOT NULL,             -- 'Hisse Senedi', 'Ters Repo', 'Eurobond' vb.
    allocation_ratio NUMERIC(6, 2) NOT NULL,     -- % Oran
    CONSTRAINT uq_fund_asset_date UNIQUE (fund_code, report_date, asset_type)
);

-- ============================================================
-- 3. KULLANICI, PORTFÖY & SİSTEM MODÜLÜ
-- ============================================================

-- 3.1 Kullanıcılar
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(128) PRIMARY KEY,                 -- Firebase UID veya UUID
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'standard_user',    -- 'standard_user', 'analyst', 'admin'
    is_active BOOLEAN DEFAULT TRUE,
    subscription_tier VARCHAR(50) DEFAULT 'free',-- 'free', 'pro', 'enterprise'
    subscription_status VARCHAR(50) DEFAULT 'active',
    subscription_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3.2 Kullanıcı Günlük Kullanım Kotaları
CREATE TABLE IF NOT EXISTS user_usage (
    user_id VARCHAR(128) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    analysis_queries_today INT DEFAULT 0,
    ai_reports_period INT DEFAULT 0,
    last_reset_date DATE DEFAULT CURRENT_DATE
);

-- 3.3 Takip Listesi (Watchlist)
CREATE TABLE IF NOT EXISTS watchlists (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(128) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(32) NOT NULL,                 -- Hisse (THYAO) veya Fon (TAU)
    target_price NUMERIC(14, 4),
    notes TEXT,
    added_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_symbol UNIQUE (user_id, symbol)
);

-- 3.4 Kullanıcı Portföyleri
CREATE TABLE IF NOT EXISTS user_portfolios (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(128) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    portfolio_name VARCHAR(100) NOT NULL,
    currency VARCHAR(4) DEFAULT 'TRY',
    initial_cash NUMERIC(16, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3.5 Portföy Varlıkları
CREATE TABLE IF NOT EXISTS portfolio_items (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    portfolio_id VARCHAR(64) NOT NULL REFERENCES user_portfolios(id) ON DELETE CASCADE,
    symbol VARCHAR(32) NOT NULL,
    asset_type VARCHAR(32) NOT NULL,             -- 'STOCK_BIST', 'TEFAS_FUND', 'COMMODITY'
    quantity NUMERIC(16, 4) NOT NULL,
    avg_buy_price NUMERIC(14, 4) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3.6 Fiyat Alarmları
CREATE TABLE IF NOT EXISTS price_alerts (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(128) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(32) NOT NULL,
    target_price NUMERIC(14, 4) NOT NULL,
    condition VARCHAR(16) NOT NULL,              -- 'ABOVE', 'BELOW'
    is_active BOOLEAN DEFAULT TRUE,
    triggered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3.7 Sistem Denetim Günlüğü (Audit Log)
CREATE TABLE IF NOT EXISTS system_audit_logs (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    action VARCHAR(100) NOT NULL,
    performed_by VARCHAR(128) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    metadata JSONB,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 4. PERFORMANS VE ARAMA İNDEKSLERİ
-- ============================================================

-- Zaman serileri ve hızlı filtreleme indeksleri
CREATE INDEX IF NOT EXISTS idx_stock_prices_ticker_date ON stock_prices (ticker, trade_date DESC);
CREATE INDEX IF NOT EXISTS idx_fund_prices_code_date ON fund_prices (fund_code, price_date DESC);
CREATE INDEX IF NOT EXISTS idx_financials_ticker_period ON financials (ticker, fiscal_year DESC, fiscal_period);
CREATE INDEX IF NOT EXISTS idx_disclosures_publish_date ON kap_disclosures (publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_disclosures_ticker ON kap_disclosures (ticker);
CREATE INDEX IF NOT EXISTS idx_buybacks_ticker_date ON share_buybacks (ticker, transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_settlement_ticker_date ON settlement (ticker, record_date DESC);
CREATE INDEX IF NOT EXISTS idx_watchlists_user ON watchlists (user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_pid ON portfolio_items (portfolio_id);
```

---

## 4. Local Ortamda Kurulum İpuçları

1. **Toplu Veri Yükleme (Bulk Copy):**
   - Python veya Node.js ile Cloudflare tünelinizdeki `/api/export/bulk` veya `/api/export/csv/*` uç noktalarından veri çekerken PostgreSQL'in `COPY ... FROM STDIN WITH (FORMAT csv)` veya `INSERT ... ON CONFLICT (ticker, trade_date) DO UPDATE` komutunu kullanarak milyonlarca satırı saniyeler içinde içeri aktarabilirsiniz.

2. **Zaman Serisi Boyutlandırma:**
   - `stock_prices` ve `fund_prices` tabloları yıllar içinde milyonlarca satıra ulaşacağı için tarih bazlı (yıllık/aylık) **PostgreSQL Table Partitioning** (`PARTITION BY RANGE (trade_date)`) uygulanabilir.

3. **Uygulama ile Bağlantı:**
   - Yerel veritabanınızı oluşturduktan sonra MarketPulse arayüzünde **Yönetici Paneli > Veritabanı Entegrasyonu** sekmesine girip `PostgreSQL Host`, `Port (5432)`, `Kullanıcı Adı` ve `Şifre` bilgilerinizi girerek **"PostgreSQL Şemasını Başlat / Doğrula"** butonuna basarak tüm tabloların hazır olduğunu anında doğrulayabilirsiniz.
