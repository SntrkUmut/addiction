# Ürün arayüzü revizyon planı

**Durum:** Sprint A ve B uygulandı; Sprint C cihaz/erişilebilirlik ve marka sonlandırma kapılarıyla sürüyor. Kullanıcı 21 Ekim 2026'da mevcut akış ve tasarım için düzeltme istedi.  
**Kaynaklar:** `prototip.html`, `maskot.jpeg` ve mevcut Expo uygulaması.  
**Kapsam:** Ayarlar, kayıt geçmişi, Sığınak/ödül ilerlemesi, uygulama içi bilgilendirme ve uygulama genelindeki görsel dil.

## Sabit ürün kararları

- Maskot tilki olacak. `maskot.jpeg` içindeki aynı karakterin farklı durumları başlangıç sanat yönüdür; uygulamada yeşil yıldız/ateş böceği karakteri kalmayacak.
- İlerleme, Sığınak alanını küçük ve anlaşılır parçalarla kuracak. Her parça hangi davranışla, kaç ışıkla açılıyor kullanıcıya önceden gösterilecek.
- Check-in günde en fazla bir ışık; tamamlanan her ayrı baş etme oturumu bir ışık kazandırır. Çift kayıt oluşmaz. Kayma, ışık veya açılmış parçaları geri almaz. Kullanıcı yanlış bir check-in/baş etme kaydını özellikle kaldırırsa ilgili ışık ve eşik görünümü yeniden hesaplanır.
- Görsel dil `prototip.html` içindeki sıcak krem/obsidyen/terracotta ve dokunsal kart yaklaşımını benimser; kod prototipindeki eski ekonomi mekanikleri benimsenmez.
- Eski prototipteki “irade kristali”, seri kalkanı, sağlık yüzdeleri ve harcama/loot ekonomisi MVP kapsamına girmez. **Maskot efekt katmanları** (kalkan, kristaller, elmas vb.) **yalnızca görsel dekorasyon**; puan, seri, veya oyunlaştırma ekonomisine bağlı değil. Klinik dayanağı olmayan sağlık iddiaları gösterilmez.
- Maskotun adı hâlâ seçilmedi; kodda geçici bir özel isim kullanılmaz.
- Varsayılan Expo ikonları geliştirme önizlemesinde geçici tilki işaretiyle değiştirildi. Kaynak `mobile/assets/brand/fox-mark.svg`; PNG türevleri iOS, Android ve web tarafından kullanılıyor. Ürün adı, maskot adı ve son karakter illüstrasyonu onaylandığında ikon yeniden incelenip gerekirse yenilenecek.

## Sprint A — Temel kullanılabilirlik düzeltmeleri

1. Plan düzenlemeyi onboarding sihirbazından çıkarıp tek sayfalı, bölümlere ayrılmış forma dönüştür. Kaydetmeden çıkma ve doğrulama durumları açık olsun.
2. Son kayıtları satır bazında geri alınabilir yap. Silme yalnızca seçilen yerel olayı kaldırır; ilgili bugünkü sayaç ve ödül tekrar hesaplanır. Kullanıcıya geri alma onayı ver.
3. Uygulama içi bildirim/uyarı yüzeyi oluştur. Bilgi ve başarı mesajları iOS sistem Alert'i yerine uygulamanın tipografi, renk, kenarlık ve düğmeleriyle görünür. Onay gerektiren işlemler de aynı tasarımlı diyalog kullanır; işletim sistemi izin pencereleri hariç.

**Kabul:** Ayarlar'dan tek ekranda her plan alanı düzenlenir; kayıt silme/geri alma sonrası Rotam ve ışık sayısı doğru güncellenir; bilgi ve onay arayüzleri uygulama dilinde görünür.

## Sprint B — Tilki ve Sığınak ilerleme sistemi

1. Maskot illüstrasyonunu mevcut kaynaklardan uygulamaya taşı; onboarding, Yuva, Sığınak ve istek akışında aynı karakteri kullan.
2. Sığınak ödül döngüsünü bir görsel ilerleme haritası, açılmış/açılacak parçalar, açık maliyet/ilerleme ve bir sonraki eşik olarak açıkla.
3. Bir ışık kazanmanın neye karşılık geldiğini (check-in veya ayrı baş etme oturumu) ödül ekranında göster. Ödül için kullanıcıyı kayma/günlük seri kaybıyla cezalandırma.
4. Paleti, bileşenleri ve ikonları prototipin sıcak krem + terracotta yaklaşımına taşı. Yeşili tek başına ürün markası gibi kullanma; doğal çevre illüstrasyonlarında ikincil destek rengi olabilir.

**Kabul:** İlk kullanımda kullanıcı “ne yaptım, ne kazandım, sırada ne var?” sorularını ek açıklama olmadan yanıtlayabilir; tilki bütün ana akışlarda aynı görsel kimliğe sahiptir.

## Sprint C — Görsel ve etkileşimli kontrol

- iPhone simülatöründe onboarding, tek sayfalı plan düzenleme, check-in, kayma, geri alma, Sığınak eşikleri ve uygulama içi diyalogları gözden geçir.
- Küçük ekran, klavye, VoiceOver odak sırası ve kaydırma taşmalarını kontrol et.
- Sprint dokümanında kalan Supabase, gerçek cihaz, marka adı/mağaza varlıkları ve güvenlik kapılarını ayrı tut. Bu UI işi Supabase hesabı olmadan yerel-first tamamlanabilir.

## Bilinen sınırlamalar ve devam kararları

- `maskot.jpeg` dört pozu tek koyu arka planlı görselde birleştiriyor. Önce pozlar kırpılıp uygulamada görsel olarak incelenecek; yayın kalitesinde şeffaf/animasyonlu karakter gerekirse ayrıca çizim teslimi açılacak.
- `prototip.html` bir tasarım konseptidir. İçindeki örnek puan/tasarruf sayıları, simüle edilmiş butonlar ve eski özellikler çalışan ürün verisi kabul edilmez.
- Herhangi bir klinik sağlık kilometre taşı yayımlanmadan önce güvenilir kaynak ve editoryal onay gerekir.
