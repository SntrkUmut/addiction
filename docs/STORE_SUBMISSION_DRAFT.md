# App Store Connect mağaza taslağı — Türkçe MVP

**Durum:** Taslak; App Store Connect’e girilmeye veya gönderilmeye hazır değildir. Ürün/şirket adı, yasal bağlantılar, final varlıklar, yaş derecesi, App Privacy ve gerçek mağaza hesabı tamamlanmalıdır.

## Ürün sayfası metinleri

- **Uygulama adı:** `[KESİN AD — 2–30 karakter]`
- **Alt başlık:** `Sigarayı bırakma yolunda` (30 karakter sınırını ve marka kısa listesini son kez kontrol et.)
- **Promosyon metni:** `İstek anında kısa bir adım seç, gününü kaydet ve kendi sığınağını küçük ilerlemelerle kur.`
- **Açıklama (taslak):**

  Sigarayı bırakma yolculuğunu kendi hızında takip et. İstek geldiğinde sana uygun kısa bir baş etme aracı seç; gününü kaydet; ilerlemeni ve tahmini tasarrufunu gör. Bir kayma, önceki emeğini silmez.

  **Uygulamada**
  • Adım adım, düzenlenebilir bir bırakma planı oluştur.
  • İstek anında yavaş nefes, kısa yürüyüş, su içme veya kişisel nedenlerini hatırlama arasından seçim yap.
  • Günlük check-in ile nasıl hissettiğini isteğe bağlı kaydet.
  • Sığınağını tamamladığın küçük adımlarla geliştir.
  • Kayma yaşarsan yargılanmadan kaydet ve yoluna devam et.
  • İstersen cihazında günlük hatırlatma kur; bildirimler varsayılan olarak kapalıdır.
  • Planını hesap açmadan cihazında kullan. Verini dışa aktarma ve cihaz kopyasını silme seçeneklerini Ayarlar’da bul.

  İçilmeyen sigara ve tasarruf değerleri verdiğin bilgilere göre yapılan yaklaşık kişisel hesaplamalardır; sağlık sonucu göstermez veya garanti etmez. Uygulama tıbbi tavsiye, tanı ya da tedavi sunmaz ve profesyonel desteğin yerini tutmaz.

- **Anahtar kelimeler:** `sigara,bırakma,istek,alışkanlık,check-in,nefes,ilerleme`
  - Son ad ve şirket adına göre yinelenen terimleri çıkar; mağaza alanının 100 bayt sınırında olduğunu doğrula.
- **Destek URL'si:** `[HERKESE AÇIK DESTEK SAYFASI — GERÇEK İLETİŞİM BİLGİSİYLE]`
- **Gizlilik politikası URL'si:** `[HERKESE AÇIK HTTPS GİZLİLİK BİLDİRİMİ]`
- **Pazarlama URL'si:** `[İSTEĞE BAĞLI]`
- **Kategori, yaş derecesi, bölgeler, telif ve içerik hakları:** Ürünün son hali ve mağaza anketindeki gerçek cevaplara göre ürün sahibi tamamlayacak.

## Görsel planı

Final uygulama adı, renk paleti ve maskot varlığı seçildikten sonra simülatör/gerçek cihazdan güncel ekran görüntüsü üret. Prototip HTML ekran görüntülerini mağaza varlığı olarak kullanma.

1. **Planını küçük adımlarla kur** — karşılama/plan özeti; hesap zorunlu değil.
2. **İstek anında bir araç seç** — kısa ve kullanıcı kontrollü destek seçenekleri.
3. **Kendi sığınağını geliştir** — ışık/ilerleme kuralını açıkça anlat; gerçek olmayan sağlık iddiası ekleme.
4. **Kayma, yolun sonu değil** — kaydın önceki ilerlemeyi silmediğini göster.
5. **Veri ve hatırlatma kontrolü sende** — hatırlatmanın isteğe bağlı olduğunu ve veri dışa aktarma/silme yolunu göster.

Her görsel gerçek uygulama sürümünden alınmalı; sistem durum çubuğu, küçük metin, marka/karakter, lokalizasyon ve mağazanın güncel cihaz boyutları kontrol edilmeli.

## İnceleme notu taslağı

`[KESİN UYGULAMA ADI]`, yetişkinlere yönelik bir öz-yönetim ve takip aracıdır; klinik tanı, tedavi veya bırakma başarısı garantisi sunmaz. Hesap açmadan kullanılabilir. İstek aracı, check-in, kayma kaydı, cihazda planlanan isteğe bağlı hatırlatma ve veri işlemleri incelemede görülebilir. Supabase eşitlemesi ancak staging/production projesi, doğrulanmış redirect ve inceleme hesabı hazırsa etkinleştirilir. `[TESTFLIGHT HESABI / PAROLA / KULLANILABİLİR İNCELEME ADIMLARI — GÜVENLİ ŞEKİLDE EKLE]`.

## Yayın öncesi kontrol

- [ ] Uygulama adı, marka/alan adı taraması ve bundle ID kesinleşti.
- [ ] App Privacy beyanı gerçek release binary'si, SDK'lar, ağ trafiği ve Supabase ayarlarıyla karşılaştırıldı.
- [ ] Gizlilik bildirimi ve destek sayfası HTTPS üzerinden erişilebilir; gerçek yayıncı/iletişim bilgisi içeriyor.
- [ ] Hesap oluşturma açıksa uygulama içi hesap silme staging ortamında doğrulandı.
- [ ] Tüm ekran görüntüleri final build'den üretildi ve Apple'ın gönderim anındaki güncel teknik özelliklerine uygun.
- [ ] Yaş derecesi ve ülke/bölge beyanları mağaza formunda doğru dolduruldu.
- [ ] İnceleme ekibi gerçek cihazda temel akışları açabiliyor; gerekli test hesabı güvenli biçimde sağlandı.
- [ ] Bağımlılık güvenlik kapısı, gerçek cihaz/erişilebilirlik kontrolleri, hukuki inceleme ve ürün sahibi onayı tamamlandı.

## Resmî Apple referansları

- [App Store Connect uygulama bilgileri](https://developer.apple.com/help/app-store-connect/reference/app-information/app-information/) — ad/alt başlık sınırları ve gizlilik politikası alanı.
- [Platform sürüm bilgileri](https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information) — promosyon/açıklama/anahtar kelime sınırları ve destek URL'si.
- [App Review](https://developer.apple.com/app-store/review/) — gizlilik bildiriminin toplama, kullanım, üçüncü taraf paylaşımı, saklama ve silmeyi açıklaması.
- [Uygulama hesabını silme](https://developer.apple.com/support/offering-account-deletion-in-your-app/) — hesap oluşturan uygulamalarda silme deneyimi.
