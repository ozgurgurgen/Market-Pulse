# Eksik Veri Kaynakları & Entegrasyon Yol Haritası (Faz 4)

Bu belge, finans platformumuzda doğrudan kamuya açık veya ücretsiz API'si bulunmayan, gelecekte lisanslı entegrasyon ile zenginleştirilebilecek veri alanlarını ve şu anki şeffaf durumlarını listeler.

---

## 1. Takasbank Saklama ve Aracı Kurum Net İşlem Dengesi (AKD / Brokerage Clearing)
- **Mevcut Durum**: Borsa İstanbul ve Takasbank nezdindeki anlık AKD (Aracı Kurum Dağılımı) verileri BIST lisansına tabidir.
- **İzlenen Yol**: Veri kaynağı olmadığında sahte/rastgele veri uydurulması kesinlikle yasaklanmış, kullanıcıya doğrudan `Takasbank & AKD lisanslı veri akışı bekleniyor` veya şirketin resmi KAP pay dağılımı / fiili dolaşım oranı sunulmaktadır.
- **Önerilen Entegrasyon**: Matriks Veri Terminali / Foreks BIST AKD API veya Takasbank kurumsal veri servisi.

## 2. KAP (Kamuyu Aydınlatma Platformu) Anlık XBRL Bilanço Akışı
- **Mevcut Durum**: Bilanço verileri, BIST 300 şirketleri için çeyreksel finansal raporlar (`server/dataAdapters/adapters/LocalFinanceApiAdapter.ts`) üzerinden tam doğrulanmış bilanço kalemleriyle sunulmaktadır.
- **İzlenen Yol**: Bilançosu henüz açıklanmamış veya halka arzı yeni gerçekleşmiş şirketler için tahmini/uydurma rakam basılmaz; `Bilanço Henüz Açıklanmadı / Veri Yok` durumu gösterilir.
- **Önerilen Entegrasyon**: KAP API veya MKK Doğrudan Veri Servisi.

## 3. Gün İçi Derinlik ve Kademe Analizi (Level 2 / Order Book)
- **Mevcut Durum**: 10 kademe ve derinlik verisi anlık BIST veri aboneliği gerektirmektedir.
- **İzlenen Yol**: Yapay emir kademesi veya rastgele alıcı-satıcı lotu simülasyonu kaldırılmıştır.
- **Önerilen Entegrasyon**: Borsa İstanbul Doğrudan Bağlantı (ITCH/OUCH) veya Lisanslı BIST Veri Dağıtıcısı.
