# Kök Neden Analizi (Root Cause Analysis)

Önceki API denetim raporunda (Nihai Rapor), `safeFetchJson` kullanan yaklaşık 54 dosyanın büyük çoğunluğunun 'API bağlantısı olmayan dosyalar' (API'siz) listesine yanlışlıkla dahil edilmesinin ana nedeni, konsolidasyon adımında kullanılan **Regex (Düzenli İfade) kalıbının yetersizliği** olarak tespit edilmiştir.

## Detaylı Neden
Python tabanlı otomatik raporlama betiğinde (`generate_final_report2.py`), `safeFetchJson` wrapper'ını yakalamak için şu katı regex kalıbı kullanılmıştı:
`re.compile(r'safeFetchJson\(')`

Bu kalıp, sadece fonksiyon adının **hemen ardından** parantez açılan (`safeFetchJson(`) çağrıları yakalayabiliyordu. Ancak proje TypeScript ile yazıldığı için, bu fonksiyon çağrılarının çok büyük bir kısmında **Generic Tip Parametreleri (Generic Type Parameters)** kullanılmaktaydı:
`await safeFetchJson<{ data: MyType }>('/api/data')`

Regex kalıbı, fonksiyon adı ile parantez arasındaki `<...>` tip parametresini beklemediği için, bu tür çağrıların tamamı gözden kaçmış ve eşleşme (match) başarısız olmuştur. Sadece generic parametre kullanılmayan nadir çağrılar yakalanabilmiştir.

Ayrıca Tur 1 ve Tur 2'nin ham metin çıktılarını birleştirmek (Set Union) yerine, son rapor scriptinde dosyaların sıfırdan ve hatalı bir Regex listesiyle tekrar taranması da bu veri kaybını doğrudan doğurmuştur.

## Geleceğe Yönelik Çözüm
- Konsolidasyon işlemlerinde, regex kalıpları programlama dillerinin (özellikle TypeScript'in) sözdizimi esnekliklerini (generics, boşluklar, satır atlamalar) kapsayacak şekilde esnek tutulacaktır veya doğrudan düz string arama (`in` operatörü) ile ilk aşama filtrelemesi yapılacaktır.
- İki farklı turun çıktıları birleştirilirken, sıfırdan yeni kurallarla taramak yerine, iki listenin gerçek birleşim kümesi (`Set Union: A ∪ B`) algoritmik olarak kullanılmalıdır.
