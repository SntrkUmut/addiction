# Product Requirements Document — Smoking Cessation MVP

**Durum:** Kullanıcı tarafından onaylandı — MVP geliştirmesi başladı  
**Tarih:** 20 Ekim 2026  
**Çalışma adı:** TBD (geçici ürün adı; marka, App Store ve alan adı araştırması tamamlanmadı)  
**Platform / teknoloji yönü:** Expo + React Native, Supabase  
**İlk pazar dili:** Türkçe; mimari ve içerik İngilizce yerelleştirmeye hazır  
**MVP alanı:** Yetişkinlere yönelik sigarayı bırakma desteği

## 1. Ürün özeti

Kullanıcının sigarayı bırakma kararını günlük hayatta uygulanabilir küçük adımlara, kriz anında kullanılabilir baş etme araçlarına ve yargılamayan ilerleme takibine dönüştüren bir mobil yardımcı. İlerleme; dumansız süreyi saymanın yanında, kullanıcının tetikleyicilerini fark etmesini, isteğe dayanma veya erteleme denemelerini ve kendi seçtiği sağlıklı alternatifleri de görünür kılar. Oyunlaştırma destekleyicidir; tıbbi tedavi iddiası taşımaz ve kullanıcıyı kusursuz seri baskısına sokmaz.

Uygulama, kullanıcının küçük ve sürdürülebilir adımlarla kurduğu bir Sığınak fikriyle gelişir. Kullanıcıya bir maskot kesinlikle eşlik edecektir. **Maskot türü tilkidir; kullanıcı bu yönü onayladı.** Tilki adı, kişiliğinin son ayrıntıları ve üretim kalitesinde kaynak çizimleri henüz teslim edilmedi. Ürün adı da marka taraması tamamlanana kadar seçilmemiştir.

## 2. Problem ve fırsat

- Bırakma uygulamaları çoğunlukla sayaç, tasarruf ve sağlık dönüm noktaları sunar; kullanıcının tam istek anında ne yapacağını bulması daha zordur.
- Tek başına seri sayacı, kayma yaşandığında önceki emeğin silindiği hissini verebilir.
- Genel amaçlı orman/ağaç ödüllerini kopyalamadan kişisel, işlevsel ve kendi eylemlerine bağlı bir ilerleme dünyası oluşturmak için alan vardır.
- MVP’nin ayırt edici odağı: **kriz anında işe yarayan kısa bir destek akışı + kullanıcının kurduğu baş etme araçları + yargılamayan ilerleme + maskotlu kişisel sığınak**.

## 3. Vizyon ve başarı ilkesi

Kullanıcı zorlandığı anda uygulamayı açtığında, bir dakikadan kısa sürede kendisine uygun bir sonraki küçük adımı bulabilsin. İlerleme, yalnızca sigara içilmeyen gün sayısıyla değil, farkındalık ve baş etme pratiğiyle de temsil edilsin.

**Tasarım ilkeleri**

1. Şefkatli, yetişkin ve suçluluk üretmeyen dil.
2. Bir kayma, kullanıcının geçmiş emeğini silmez; kayıt ve öğrenme devam eder.
3. Ödül, sigarayı bırakmayı ve sağlıklı baş etme davranışlarını destekler; sigara tüketimini ödüllendirmez.
4. Maskot eşlik eder, kullanıcının yerine karar vermez ve klinik uzman gibi davranmaz.
5. Kullanıcı verisi ve mahremiyeti özelliklerin sonradan eklenen parçası değil, ürün gereksinimidir.
6. Erişilebilirlik, düşük bilişsel yük ve tek elle kullanım temel kabul edilir.

## 4. Hedef kullanıcı ve kapsam

### Birincil kullanıcı

Sigarayı bırakmaya karar vermiş veya bırakma tarihini belirlemeye hazırlanan, iOS/Android kullanan yetişkin. Günlük tüketim, tetikleyiciler, bırakma yaklaşımı ve hatırlatma tercihi kişiden kişiye değişir.

### Kullanıcı ihtiyaçları

- Kendi bırakma tarihini/planını belirlemek.
- Bir istek geldiğinde hızlı, yargılamayan ve pratik destek almak.
- Tetikleyicileri ve hangi baş etme yollarının kendisine uyduğunu görmek.
- Geçen süreyi, tahmini tasarrufu ve kişisel hedefleri takip etmek.
- Kayma olursa bunu güvenli ve kolayca kaydedip plana geri dönebilmek.
- Verisini, hesabını ve bildirimlerini kontrol edebilmek.

### MVP kapsamı

- Türkçe arayüz ve içerik; İngilizceye genişleyebilecek yerelleştirme altyapısı.
- Sigarayı bırakma planı ve kişiselleştirilmiş başlangıç kurulumu.
- Ana ekran: bırakma süresi, seçilmiş ilerleme göstergeleri, maskot/sığınak alanı ve belirgin “İstek geldi” erişimi.
- İstek anı akışı: istek şiddeti/bağlamı, kısa süreli nefes/grounding veya erteleme aracı, kullanıcıya ait nedenler ve alternatif eylem seçimi, sonrasında kısa check-in.
- Tetikleyici ve baş etme tercihlerinin kaydı; temel geçmiş/özet.
- Günlük veya isteğe bağlı check-in; duygu/istek/baş etme kaydı.
- Dumansız süre ve kullanıcının girdilerinden hesaplanan **tahmini** tasarruf. Hesap varsayımları kullanıcıya açık olmalı.
- Dönüm noktaları ve bir sığınak/kişisel ilerleme alanının temel evrimi. Ödüller check-in, isteği yönetme denemesi, dumansız zaman ve sağlıklı alternatiflere bağlanmalı; yalnızca uzun seri şartına bağlanmamalı.
- Kayma kaydı ve şefkatli plana dönüş akışı; isteğe bağlı yeni bırakma tarihi/plan ayarı.
- Bildirimler isteğe bağlı ve sessiz varsayılan; izin, bağlam açıklamasından sonra istenir.
- Ayarlar: veri dışa aktarma/silme akışının kapsamı, bildirimler, dil (ilk sürümde TR), gizlilik ve destek bilgileri.
- Supabase kimlik doğrulama/veri saklama; çevrimdışı veya bağlantı hatasında temel kaydın kaybolmaması için açık senkronizasyon davranışı.

### MVP dışında

- Alkol, uyuşturucu, şeker, kumar veya dijital alışkanlık programları. Veri modeli gelecekte farklı hedef türlerini taşıyabilecek şekilde tasarlanabilir, ancak kullanıcıya MVP’de bu programlar sunulmaz.
- Topluluk akışı, mesajlaşma, arkadaş sıralaması veya herkese açık profil.
- Üretken yapay zekâ koçu veya kullanıcı girdilerine dayalı otomatik tıbbi tavsiye.
- Klinik tanı, tedavi veya bırakma başarısı garantisi.
- Apple Health/HealthKit entegrasyonu, giyilebilir cihazlar ve karmaşık biyometrik iddialar.
- Gerçek para cüzdanı, satın alma ödülü veya kullanıcının sigara alımını teşvik edebilecek ödül pazarı.
- Tam kapsamlı maskot animasyon kütüphanesi; ilk sürümde birkaç hafif, performanslı durum illüstrasyonu/animasyonu yeterlidir.

## 5. Temel kullanıcı yolculukları

### A. İlk kurulum ve bırakma planı

1. Uygulamanın destek aracı olduğu ve profesyonel yardımın yerine geçmediği kısa, anlaşılır biçimde açıklanır.
2. Ürün tanıtımı kısa bir ilk ekranda yapılır; kullanıcı hesap açmadan devam edebilir. Supabase ve çoklu cihaz eşitlemesi seçilirse veri/hesap açıklaması açıkça yapılır.
3. Günlük sigara miktarı ve paket fiyatı/adedi adım adım sorulur; tahmin için gereken bu alanlar atlanabilir. Bilgi yokken sıfır/yanıltıcı tasarruf gösterilmez.
4. Kullanıcı bırakma tarihini seçer; isteğe bağlı kişisel neden ekleyebilir. Hatırlatmalar isteğe bağlı tanıtılır; işletim sistemi izni ancak kullanıcı etkinleştirmek istediğinde istenir.
5. İlerleme göstergesi, geri gezinme ve yarım bırakılmış planı geri yükleme sunulur. Ana ekrana geçmeden plan özeti gösterilir; özeti onaylamak dışındaki adımlar düzenlenebilir.

### B. Günlük kullanım

- Ana ekranda kullanıcının ilerlemesi, bir sonraki küçük öneri ve maskotlu sığınak gösterilir.
- Kullanıcı günlük check-in yapar veya kaydı atlar; atlamak ceza üretmez.
- Ödül/ilerleme, sürdürülebilir davranışları görünür kılar; sürekli uygulamaya dönmeyi zorlayan bildirim/ödül döngüsü kurulmaz.

### C. İstek/kriz desteği

1. Ana ekrandaki birincil erişimle “Şu an istek geldi” akışı açılır.
2. Kullanıcı isterse tetikleyici ve şiddet seçer; bu adım atlanabilir.
3. Kısa, güvenli seçeneklerden birini seçer: nefes/grounding, isteği kısa süre erteleme, kişisel nedenleri görme, önceden seçtiği alternatif eylem.
4. Geri sayım bitince başarı iddiası kurmadan “Şu an nasıl?” check-in’i gelir. Kullanıcı “istek azaldı / aynı / sigara içtim / başka” seçeneklerinden birini seçebilir.
5. Deneme, kullanıcının ilerlemesini ve sığınağını besler; sigara içtiği için puan kaybı veya maskota zarar verilmez.

### D. Kayma ve plana dönüş

- Kullanıcı sigara içtiğini kaydedebilir; ekran yargılamaz ve önceki dumansız zamanı geçmişten silmez.
- Kullanıcı isterse tüketim/bağlam ekler, tetikleyici kaydeder ve sonraki küçük adımı seçer.
- Sayaçların nasıl güncellendiği şeffaf olmalıdır: “son sigaradan beri süre” ve “toplam ilerleme/geçmiş” birbirine karıştırılmaz.

## 6. Ürün gereksinimleri ve kabul ölçütleri

### Fonksiyonel

- Kullanıcı bırakma planı ve hesaplama varsayımlarını görebilir/düzenleyebilir.
- Ana ekrandan tek etkileşimle istek desteğine erişebilir.
- İstek oturumu başlatabilir, araç seçebilir, tamamlayabilir veya çıkabilir; kayıtlar tekrar açılışta kaybolmaz.
- Tetikleyici, istek ve kullanılan baş etme yöntemi zaman damgasıyla kaydedilebilir; kullanıcı isteğe bağlı alanları atlayabilir.
- Dumansız zaman, tasarruf ve ödül puanı tek bir doğrulanabilir hesap kuralıyla üretilir; istemciden gelen ödül miktarına güvenilmez.
- Kayma kaydı geçmişi korur ve destek akışına döndürür.
- Kullanıcı kendi kayıtlarını görebilir, silebilir ve ürünün sunduğu veri dışa aktarma yöntemini kullanabilir.
- Giriş, çıkış, şifre/oturum yenileme, hesabı silme ve veri eşitleme hata durumları kullanıcıya anlaşılır biçimde gösterilir.

### Sağlık içeriği ve güvenlik

- Prototipteki “DSÖ biyolojik takip”, “nabız/tansiyon %100”, “akciğer kapasitesi %54” gibi kişiye özel ölçüm izlenimi veren yüzdeler, klinik kaynak/hesaplama/bağlam doğrulanmadan MVP’ye taşınmaz.
- Sağlık kilometre taşları ancak güvenilir kaynak, doğru başlangıç zamanı, belirsizlik/kişisel farklılık açıklaması ve editoryal inceleme ile yayımlanır. Ürün tıbbi sonuç garantisi vermez.
- Nefes/grounding yönergeleri yumuşak ve isteğe bağlıdır; kullanıcı rahatsız hissederse durdurabilir.
- Yerel profesyonel destek ve acil yardım bilgisi içerik sahibi tarafından doğrulanır ve ülkeye göre sunulur. Türkiye’de ALO 171 bilgisi güncel resmî kaynak üzerinden kontrol edilerek eklenebilir.
- İçerik sigara, nikotin replasman tedavisi veya ilaç kullanımı hakkında kişiye özel tedavi talimatı vermez; sağlık profesyoneline yönlendirme sınırı net olur.

### Oyunlaştırma ve maskot

- Tilki maskotu ürün gereksinimidir. Tür kararı verilmiştir; adı, kişiliğinin son ayrıntıları ve nihai çizim/animasyon varlıkları açıktır.
- Maskot kayma yaşandığında ölmez, hastalanmaz, üzülerek kullanıcıyı suçlamaz ve sığınak geriye dönük yıkılmaz.
- Oyunlaştırma dumansız süre yanında check-in, istek yönetimi denemesi ve alternatif eylem pratiğini de ödüllendirir.
- Puanların anlamı açıklanır; rastgele loot box, para yatırma, kayıp korkusu veya zorlayıcı günlük seri mekaniği yoktur.
- Sığınak kozmetik bir dekor yığını değil, kullanıcının seçtiği baş etme araçlarına/ilerleme kilometre taşlarına anlam veren görsel bir alan olmalıdır.

## 7. Ölçüm ve analitik

Ölçüm, minimum veri ve açık amaç prensibiyle yapılır. Sağlık/bağımlılık verisi hassas kabul edilir; analitik olaylarına serbest metin, tetikleyici notu veya kimlik belirleyici içerik konmaz.

**Ürün göstergeleri (başarı garantisi değildir):**

- İlk kurulum tamamlama oranı ve kurulumda terk edilen adımlar.
- İlk 24 saat içinde ilk istek aracı/check-in kullanım oranı.
- İstek oturumu başlatma ve oturum sonrası check-in oranı.
- 7/30 günlük geri dönüş ve check-in kullanımı; tek başına bırakma başarısı olarak sunulmaz.
- Kayma sonrası 24 saat/7 gün içinde uygulamaya dönüş oranı.
- Bildirim açma/kapama ve silme taleplerinin tamamlanması.
- Çökme, eşitleme başarısı, açılış süresi ve erişilebilirlik hataları.

Başarı değerlendirmesinde öz-bildirim ve ürün analitiği klinik sonuçlarla karıştırılmaz. Ürün metrikleri anonimleştirme/izin ve gizlilik politikası incelemesi sonrası belirlenir.

## 8. Teknik ve veri gereksinimleri

### Önerilen yapı

- Expo + React Native + TypeScript; dosya tabanlı yönlendirme ve tasarım sistemi, sürüm güncel kararlılık araştırmasıyla sprint başlangıcında doğrulanır.
- Supabase Auth, Postgres, Row Level Security (RLS), güvenli migration ve gerektiğinde Edge Functions.
- İstemci tarafında hassas tokenların güvenli saklanması; günlüklerin ve hesaplamaların güvenilir, test edilebilir servis katmanlarında tutulması.
- Temel kayıtlar geçici çevrimdışı kuyrukla korunur; eşitleme çatışmalarında açık ve kayıpsız davranış belirlenir.
- Ortamlar ayrılır (local/dev/staging/production); sırlar kaynak koda veya istemciye konmaz.

### Başlangıç veri modeli (taslak)

- `profiles`: kullanıcı tercihleri, dil/saat dilimi, yaş uygunluğu onayı (gerekliyse minimum veri), oluşturulma ve silinme durumu.
- `quit_plans`: bırakma hedefi/tarihi, günlük ve paket varsayımları, plan ayarları.
- `check_ins`: tarih, isteğe bağlı istek/duygu ölçeği ve kısa yapılandırılmış yanıtlar.
- `craving_sessions`: başlangıç/bitiş, tetikleyici kategorisi, seçilen araç, son durum.
- `slips`: zaman, isteğe bağlı miktar ve bağlam; yargısız kayma kaydı.
- `coping_tools`: yerleşik ve kullanıcı seçimi baş etme araçları.
- `progress_events` / `reward_ledger`: sunucu tarafından doğrulanan ödül ve kilometre taşı kayıtları; tekrar eden isteklere karşı idempotent.
- Günlük hatırlatma tercihi MVP’de cihazda tutulur; saat ve planlı bildirim kimliği Supabase’e gönderilmez. Çoklu cihaz bildirim tercihleri ileride ayrıca istenirse kullanıcı onayı ve veri minimizasyonu ile ayrı bir `notification_preferences` tablosu tasarlanır.

Her kullanıcıya ait satırların tümünde RLS, sahiplik politikaları ve negatif erişim incelemesi gerekir. Sağlık verisi erişimi, yedekleme, saklama süresi, silme ve analitik sağlayıcısı lansman öncesi doğrulanır.

## 9. Gizlilik, güvenlik ve uyumluluk

- Yalnızca gereken veriyi topla; amaç, saklama ve silme davranışını gizlilik politikasında ve onboarding’de anlaşılır biçimde açıkla.
- Apple App Privacy / Google Play Data safety beyanları gerçek SDK, ağ istekleri ve veri akışına göre doldurulur; pazarlama metniyle çelişemez.
- Supabase RLS tüm kullanıcı tablolarında etkin ve gözden geçirilmiş olmalı; yönetici anahtarları istemci paketine girmez.
- Hesap silme uygulama içinde bulunmalı ve backend/alt işlemci/yedekleme kapsamı açıklanmalı. Veri dışa aktarma yöntemi belgelenmeli.
- Sağlık ve kişisel veriler için erişim, aktarım, loglama, hata raporlama ve analytics alanları denetlenir; serbest metin hassas veri olarak ele alınır.
- Kullanım koşulları, gizlilik bildirimi, tıbbi olmayan ürün sınırı ve abonelik varsa Apple’ın güncel kuralları profesyonel/hukuki incelemeye sunulur.
- Yaş derecelendirmesi ve hedef pazar beyanları ürünün gerçek içeriğine göre belirlenir; MVP yetişkin kullanıcıya göre tasarlanır.

## 10. Tasarım ve içerik yönü

`prototip.html` sıcak krem zemin, terracotta vurgu, yumuşak kartlar ve tilki karakteri için görsel referanstır. Ürün kararı: MVP maskotu tilkidir; ana ilerleme metaforu ışıklarla adım adım kurulan Sığınaktır. Uygulama tasarımı prototipin terracotta/krem diline yaklaştırılır. HTML’deki irade kristali, kalkan serisi ve klinik dayanağı olmayan sağlık yüzdeleri kapsam dışıdır.

MVP tasarım revizyonunda:

- Uygulama adı açık kalır; kodda geçici ürün adı kullanılmaz. Tilki türü kararı sabittir, tilkinin adı ve son çizim/animasyon varlıkları açık kalır. Görsel sistem terracotta vurgulu, krem zeminli tokenlar üzerinden ilerler.
- “İstek geldi” akışını ve kayma sonrası dönüşü ana prototipte uçtan uca göster.
- “İrade”, “bağımlılıkta başarısızlık”, “kalkan seri koruma” gibi irade/suçlama çağrışımı yapabilecek metinleri kullanıcı araştırmasında doğrula; kaybı cezalandıran kalkan/seri mekaniğini ürün kararına bağlama.
- Sığınak ekranı her parçanın adını ve ışık eşiğini, bir sonraki parçaya kalan ışığı ve ışığın hangi davranışla kazanıldığını açıkça gösterir.
- Tilki maskotun varlığı ve türü kararlaştırılmıştır. `maskot.jpeg` ve `prototip.html` içindeki pozlar uygulama için başlangıç varlıklarıdır; mağaza kalitesinde şeffaf/animasyonlu çizim ve karakter adı hâlâ açık teslimdir.
- Renk kontrastı, Dynamic Type, VoiceOver/TalkBack etiketleri, hareket azaltma ve dokunma hedefleri tasarım kabul ölçütlerine dahil edilir.

## 11. Lansman kabul kapısı

MVP App Store / Google Play incelemesine ancak aşağıdakiler tamamlanınca hazır sayılır:

- Ürün akışları ve TR metinleri onaylı; marka adı, ikon ve maskot nihai veya yayınlanabilir sürümde.
- Gerçek cihazlarda onboarding, kriz desteği, check-in, kayma, veri eşitleme, silme ve izin akışları çalışıyor.
- Supabase production projesi, RLS politikaları, migration/backup ve hata izleme gözden geçirilmiş.
- Store görselleri, açıklama, anahtar kelimeler, destek URL’si, gizlilik politikası ve yaş/sağlık beyanları hazır.
- Uygulama içi hesap silme ve mağaza hesabı/veri açıklamaları doğrulanmış.
- Erişilebilirlik, yerelleştirme, düşük bağlantı, boş/hata durumları ve gizlilik incelemesi tamamlanmış.
- Üçüncü taraf içerikler, sağlık kilometre taşları ve destek kaynakları editoryal olarak onaylanmış.
- TestFlight / internal testing ve mağaza incelemesi için release checklist tamamlanmış.

## 12. Açık kararlar

1. Ürün adı, alan adı, App Store adı ve marka uygunluğu.
2. Maskot adı, kişiliğinin son ayrıntıları ve mağaza kalitesindeki nihai çizim/animasyon teslimi. Tür: tilki (karar verildi).
3. İlk sürümde hesap zorunluluğu ve anonim/hesapsız kullanım seçeneği.
4. Kullanıcı kaydı, kayma, “son sigaradan beri süre” ve “dumansız gün” tanımlarının kesin ürün dili.
5. İlk sürümde tasarruf, sığınak ve ödül ekonomisinin detayları.
6. Fiyatlandırma/abonelik; kullanıcı araştırması yapılmadan ödeme ve ödül ilişkisi kurulmaz.
7. Sağlık dönüm noktalarının kaynak, ülke ve içerik onay süreci.
8. Destek hattı/kriz bilgileri ve ülke kapsamı.
9. Analitik ve çökme raporlama sağlayıcıları, izin ve saklama politikası.
10. İlk mağaza hedefi (iOS, Android veya eş zamanlı) ve yayın ülkeleri.

## 13. Varsayımlar ve riskler

- Expo + Supabase seçimi ürün sahibinin teknoloji yönüdür; güncel SDK, mağaza ve backend kısıtları sprint 0’da doğrulanır.
- MVP, uygulama kullanımını sigarayı bırakmanın klinik kanıtı gibi sunmaz; profesyonel tedaviyi ikame etmez.
- Tilki maskotlu oyunlaştırma bağlılığı artırabilir ancak baskı/utanç üretmemeli ve kriz desteğini oyun bariyerinin arkasına koymamalıdır.
- Supabase hesabı ve bulut eşitlemesi mahremiyet açıklamalarını ve işletim maliyetini etkiler.
- App Store’da kabul veya sıralama garanti edilemez; içerik, privacy label ve review kuralları gönderim tarihinde kontrol edilir.

## 14. Kaynak ve karar notları

- Mevcut kullanıcı girdileri: `prototip.html`, `fikir_studyosu.html`, `maskot.jpeg`; referans olarak kullanılır. 21 Ekim 2026'da kullanıcı tilki maskotu + Sığınak ilerleme fikrini yineledi ve mevcut uygulamanın buna göre görsel/akış revizyonunu istedi.
- 20 Ekim 2026: kullanıcı RPD ve sprint planını onayladı; Expo + React Native uygulama temeli ve ilk uçtan uca prototip geliştirmesi başlatıldı. Ürün adı ve maskot sanatı açık karar olarak kaldı.
- 21 Ekim 2026: günlük hatırlatma yalnızca cihazda tutulan tercih olarak kapsamlandı; ürün ve mağaza taslakları ile katılımcı araştırma rehberi hazırlandı. Bu taslaklar görüşme, hukuki/marka incelemesi ve gerçek Supabase ayarlarının yerine geçmez.
- 21 Ekim 2026: kullanıcı tilki maskot + Sığınak ilerlemesini yeniden onayladı. Ayarlar tek sayfada plan düzenleme, son kaydı geri alma ve uygulama tasarımlı diyaloglar için `DESIGN_REFACTOR_PLAN.md` hazırlandı ve uygulandı. Varsayılan Expo ikonları geçici sıcak tonlu tilki işaretiyle değiştirildi; bu işaret son marka onayı değildir.
- WHO 2024 tütün bırakma klinik rehberi: https://www.who.int/news/item/02-07-2024-who-releases-first-ever-clinical-treatment-guideline-for-tobacco-cessation
- Türkiye ALO 171 resmî bilgilendirme: https://evcileridh.saglik.gov.tr/TR-1595404/alo-171.html
- Smokefree.gov istek ve tetikleyici baş etme bilgisi: https://smokefree.gov/challenges-when-quitting/cravings-triggers/how-manage-cravings
- Rakip ve ad çakışması taraması yön göstericidir; marka/trademark uygunluk araştırması değildir. Örnek olarak QuitHaven’ın gelişen alan ve istek desteği, Ember’ın yargılamayan takip yaklaşımı ve App Store’daki Pip maskotlu alışkanlık uygulaması incelenmiştir. Son isimler ve konumlandırma için güncel mağaza, web alan adı ve resmî marka kayıtları ayrıca taranmalıdır.
