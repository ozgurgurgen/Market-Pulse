# Post-Deploy Doğrulama & Production Readiness Checklist

Bu doküman, uygulamanın production ortamına (Cloud Run / GCP) ilk dağıtımı yapıldıktan sonra **manuel olarak** çalıştırılması gereken doğrulama adımlarını içerir. AI Studio preview ortamında test edilemeyen, gerçek Application Default Credentials (ADC) ve Identity Toolkit'in devrede olduğu production ortamına özel testleri kapsar.

## 1. Firestore Admin SDK Gerçek Bağlantı Testi
Production ortamında ADC devredeyken, `CriticalSecurityError` fırlatılmadan servislerin Firestore'a bağlandığını doğrulayın.
- [ ] Uygulama production URL'sine erişin ve ana sayfayı yükleyin.
- [ ] Admin kullanıcısı (veya yetkili bir test hesabı) ile giriş yapın.
- [ ] Sunucu loglarını (GCP Cloud Logging) açın ve `getUserRole`, `getDynamicSubscriptionPlans`, `getDynamicAiSettings` çağrılarının başarılı olduğunu kontrol edin.
- [ ] Loglarda hiçbir `CriticalSecurityError` (Örn: "CRITICAL: Failed to securely fetch...") **olmadığından** emin olun.

## 2. Firestore Security Rules Gerçek İhlal Testi
Production'da Identity Toolkit tam devredeyken, düşük yetkili bir gerçek test kullanıcısıyla yetki ihlallerinin engellendiğini teyit edin.
- [ ] **Senaryo A (Rol Manipülasyonu):** Standart test kullanıcısı olarak giriş yapın. Tarayıcı DevTools üzerinden `users/{uid}` dokümanındaki `role` alanını `admin` olarak güncellemeye çalışın. İşlemin `PERMISSION_DENIED` ile reddedildiğini doğrulayın.
- [ ] **Senaryo B (Sahte Abonelik):** Standart test kullanıcısıyla `users/{uid}` dokümanındaki `subscription.planId` değerini `pro` veya `premium` olarak güncellemeye çalışın. Firebase Security Rules tarafından reddedildiğini doğrulayın.
- [ ] **Senaryo C (Upgrade Requests Manipülasyonu):** Test kullanıcısıyla `upgrade_requests` koleksiyonuna doğrudan onaylanmış (`status: "approved"`) bir belge yazmaya çalışın. Reddedildiğini doğrulayın. Sadece `status: "pending"` belgelerinin yazılabildiğinden emin olun.

## 3. Rate Limiting Gerçek Trafik Testi
Production yükü altında API sınırlamalarının (429) düzgün çalıştığını doğrulayın.
- [ ] Bir terminalden `curl` veya `ab` (Apache Bench) aracıyla `POST /api/admin/ipo/upsert` endpoint'ine 15 dakika içinde 30'dan fazla istek gönderin.
- [ ] 31. istekten itibaren API'nin HTTP `429 Too Many Requests` ve `Retry-After` header'ı ile yanıt döndüğünü doğrulayın.
- [ ] Yanıt gövdesinde `"error": "Admin endpointleri için çok fazla istek gönderildi..."` (veya ilgili Limiter mesajının) bulunduğunu teyit edin.
- [ ] Bu sırada diğer rate-limit gruplarındaki (örn. genel `/api/*`) trafiğin etkilenmediğini doğrulayın.

## 4. Environment Variables Kontrolü
Production ortamındaki secret ve çevre değişkenlerinin `.env.example` şablonuyla birebir eşleştiğini kontrol edin.
- [ ] Cloud Run (veya ilgili hosting platformu) "Variables & Secrets" sekmesini açın.
- [ ] `GEMINI_API_KEY` değişkeninin GCP Secret Manager üzerinden (veya güvenli env olarak) tanımlandığını doğrulayın.
- [ ] (Varsa) Telegram Bot Token, Stripe/Ödeme secret'ları gibi diğer anahtarların eksiksiz set edildiğini doğrulayın.
- [ ] Hiçbir hassas `process.env` değerinin frontend bundle'ına (örn. `VITE_` önekiyle) sızmadığını kontrol edin.

## 5. Alert Policy Aktivasyonu
RBAC ve güvenlik ihlallerini bildirecek GCP Alert Policy'lerin aktif edildiğini teyit edin.
- [ ] `server/rbac-alert-policy.json` dosyasındaki `[YOUR_PROJECT_ID]` ve `[YOUR_CHANNEL_ID]` yer tutucularının gerçek production değerleriyle (GCP Project ID ve Notification Channel ID) değiştirildiğinden emin olun.
- [ ] İlgili policy'nin GCP Cloud Monitoring Alerting bölümüne başarıyla import edildiğini/deploy edildiğini kontrol edin.
- [ ] Test amaçlı sahte bir `CriticalSecurityError` tetikleyerek (veya manuel log yazarak) uyarı kanalına (örn. Slack/Email) bildirimin düştüğünü teyit edin.

## 6. Rollback (Geri Dönüş) Planı
Kritik bir hata durumunda (örn. ADC çökmesi sonucu tüm kullanıcıların `CriticalSecurityError` alması) sistemi hızlıca geri almak için adımlar.
- [ ] **Acil Durum Teşhisi:** Cloud Logging üzerinden hatanın Firestore kaynaklı mı (kota, yetki, ağ) yoksa kod kaynaklı mı olduğunu belirleyin.
- [ ] **Firestore Sorunları:** Eğer Firestore'da kesinti varsa, GCP Status sayfasını kontrol edin. Yetki hatası ise Service Account'un IAM rollerini (Datastore User/Owner) doğrulayın.
- [ ] **Kod Rollback (Cloud Run):** Sorun deploy edilen yeni koddaysa, Cloud Run "Revisions" sekmesine gidin ve trafiği %100 oranında bir önceki sağlıklı revizyona (Rollback) yönlendirin (Süre: < 1 dakika).
- [ ] **Kilitlenme/Acil Kapatma:** Güvenlik açığı şüphesi varsa, geçici olarak Cloud Run servisine gelen dış trafiği kapatın (Ingress = Internal only) veya Authentication ayarlarını "Require authentication" yaparak izole edin.
