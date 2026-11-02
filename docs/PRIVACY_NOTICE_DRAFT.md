# Gizlilik bildirimi taslağı — yayın öncesi tamamlanmalı

> **Taslak — yayımlanamaz.** Köşeli parantez içindeki alanları gerçek ürün sahibi/şirket ve altyapı bilgileriyle doldur; yasal inceleme ve App Store/Google Play beyanlarıyla eşleştir. Supabase projesi henüz kurulmadığı için bölge, sağlayıcı ayarları ve saklama süreleri bu metinde kesinleştirilmemiştir.

**Son güncelleme:** [TARİH]  
**Uygulama:** [KESİN UYGULAMA ADI]  
**Veri sorumlusu / yayıncı:** [ŞİRKETİN VEYA ÜRÜN SAHİBİNİN TAM YASAL ADI]  
**Gizlilik iletişim adresi:** [İZLENEN E-POSTA ADRESİ]  
**Gizlilik bildirimi URL'si:** [HERKESE AÇIK HTTPS ADRESİ]

## Kısa açıklama

[UYGULAMA ADI], sigarayı bırakma hedefini kişisel olarak takip etmeye ve istek anlarında kısa baş etme araçları denemeye yardımcı olan bir öz-yönetim uygulamasıdır. Uygulama tıbbi tanı, tedavi veya profesyonel danışmanlık sunmaz.

Uygulama hesapsız ve yerel-first kullanılabilir. Planını, ilerleme kayıtlarını veya isteğe bağlı hatırlatma tercihlerini uygulama içinden silmediğin sürece cihazında tutarsın. Supabase hesabıyla eşitlemeyi ayrıca açarsan seçili plan ve ilerleme kayıtların bu hesaba yedeklenir.

## Uygulamanın kullandığı bilgiler

- İsteğe bağlı görünen ad ve bırakma nedeni.
- Bırakma tarihi, günlük sigara adedi, paket fiyatı ve paket içeriği. Bu girdiler yaklaşık sayaç/tasarruf değerlerini hesaplamak için kullanılır.
- Check-in seçimi, kullandığın baş etme aracının türü ve süresi, istek sonrası seçtiğin yanıt ve kayma kaydı ile bunların zamanları.
- İsteğe bağlı hesap açarsan e-posta adresi ve Supabase Auth tarafından oluşturulan hesap/oturum bilgileri.
- Hatırlatmayı açmayı seçersen cihazdaki tercih ettiğin saat ve işletim sisteminde planlanan genel check-in bildirimi.

Günlük hatırlatma tercihi ve bildirimin planlı kimliği cihazda tutulur; Supabase hesabına gönderilmez. Hatırlatma içeriğinde sigara, bağımlılık, sağlık durumu veya kişisel plan bilgisi yer almaz.

## Depolama ve sağlayıcılar

- Hesap açmadan kullanırken plan ve geçmiş cihazda, Expo SQLite tabanlı yerel depoda saklanır. Plan içeriği uygulama tarafından ayrıca şifrelenmez; cihaz şifresi ve işletim sistemi güvenlik ayarlarını kullan.
- Hesapla eşitlemeyi açarsan plan ve ilerleme snapshot'ı [SUPABASE PROJE BÖLGESİ] bölgesindeki Supabase hizmetine gönderilir. Auth oturumu iOS Keychain / Android Keystore tabanlı korumayla cihazda şifreli tutulur. **Bu paragrafı gerçek Supabase projesi, bölge, yedekleme ve log saklama ayarlarıyla doğrula.**
- Hata analitiği veya reklam SDK'sı uygulamada yapılandırılmış değildir. Bağlantı durumuna cihazda bakılır; bu bilgi analitik hizmetine gönderilmez.
- Verini dışa aktarmayı seçtiğinde JSON kopyası işletim sisteminin paylaşım menüsüne açılır. Hangi uygulamayla paylaştığını ve sonraki kullanımını sen seçersin.
- Apple, Google, e-posta sağlayıcısı veya işletim sistemi tarafından alınan veriler onların kendi gizlilik bildirimlerine tabidir. [KULLANILAN GERÇEK ALT İŞLEMCİLERİ VE LİNKLERİNİ EKLE.]

## Seçimler ve silme

- Hesap açmak isteğe bağlıdır; temel planı cihazında hesap olmadan kullanabilirsin.
- Bildirimler kapalı başlar. Günlük saat belirleyip Hatırlatmalar bölümünde **Aç** düğmesine dokunursan işletim sistemi bildirim izni ister. Uygulama ayarlarından kapatabilir, cihaz Ayarları'ndan da izni geri alabilirsin.
- Ayarlar → **Verilerimi dışa aktar**, uygulamadaki plan ve geçmiş snapshot'ını paylaşım menüsüne verir.
- Ayarlar → **Bu cihazdaki kayıtları sil**, yerel planı, geçmişi ve bekleyen eşitleme işaretini kaldırır; bu işlem varsa bulut yedeğini silmez.
- Hesabınla giriş yaptıysan Ayarlar → **Hesabımı ve verilerimi sil** hesabı silme isteğini Supabase'e iletir ve uygulamadaki cihaz kopyasını da temizler. **Bulut yedeklerinin, e-posta sağlayıcısı kayıtlarının ve yedeklerin silinme/sona erme sürelerini gerçek proje ayarlarıyla burada açıkla.**
- Oturumu kapatmak hesap oturumunu kaldırır; cihazdaki plan ve geçmişi olduğu gibi bırakır.

## Saklama, güvenlik ve haklar

- Cihazdaki kopyayı uygulama içinden istediğin zaman silebilirsin. Uygulamayı cihazdan kaldırmanın yerel SQLite verisini silip silmediğini hedeflenen iOS/Android sürümlerinde doğrula ve bu metni buna göre güncelle.
- Bulut hesabı ve snapshot saklama süresi: **[SÜRE VEYA SİLME KRİTERİ]**.
- İsteğe bağlı hesap ve veri hakları, uygulanacak ülke/bölge kurallarına göre değişebilir. Başvuru ve kimlik doğrulama yolu: **[GERÇEK İLETİŞİM VE İŞLEM SÜRECİ]**.
- Makul teknik ve idari önlemler kullanırız; internet üzerinden aktarım veya cihaz depolaması için mutlak güvenlik garantisi veremeyiz. Gerçek tehdit modeli ve olay iletişim sürecini ürün sahibiyle tamamla.

## Çocuklar ve hedef kullanıcı

Bu MVP yetişkin kullanıcılar için tasarlanmıştır. **[YAŞ SINIRINI, HEDEF ÜLKELERİ VE ÇOCUK VERİSİNE İLİŞKİN GERÇEK UYGULAMAYI YASAL İNCELEMEYLE TAMAMLA.]**

## Bildirimler ve ürün sınırı

Bildirimler cihazda zamanlanmış, genel içerikli hatırlatmalardır. Uygulama tıbbi tavsiye, tanı, tedavi veya bırakma başarısı garantisi sunmaz. Profesyonel destek ve acil yardım bilgileri uygulama içinde ayrıca gösterilir.

## Değişiklik ve iletişim

Bu bildirim güncellenirse yeni tarih bu sayfada gösterilir. Gizlilik soruları, veri talepleri ve şikâyetler için: **[İZLENEN E-POSTA VEYA BAŞVURU ADRESİ]**.

---

## Yayın sahibinin tamamlaması gerekenler

- [ ] Yasal yayıncı adı, iletişim adresi, hedef ülkeler ve geçerli hukuki inceleme.
- [ ] Supabase bölgesi, e-posta sağlayıcısı, yedekleme/log saklama süreleri, veri silme davranışı ve sözleşmeler.
- [ ] iOS/Android kaldırma, export, cihaz temizleme, hesap silme ve yeniden giriş davranışını staging/gerçek cihazda doğrulama.
- [ ] Final uygulama adı, ikon, gizlilik HTTPS URL'si ve destek sayfası.
- [ ] App Store App Privacy / Google Play Data safety formunu gerçek release binary'si, ağ trafiği, native SDK'lar ve sağlayıcı ayarlarıyla eşleştirme.
- [ ] Bu taslağı yayımlanabilir bildirim olarak onaylatma; tamamlanana kadar mağaza sürümünü gönderme.
