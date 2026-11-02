# MVP Sprint Planı — Sigara Bırakma Mobil Uygulaması

**Durum:** Onaylı yerel-first MVP uygulanıyor; gerçek servis, marka ve yayın sahibi girdileri bekleniyor  
**Hedef:** Expo + React Native ve Supabase ile Türkçe, mağaza incelemesine gönderilebilir sigarayı bırakma MVP’si.  
**Çalışma adı:** TBD. Ürün adı ve maskot adı kesinleştirilmedi. Tilki maskot türü ile Sığınak ilerleme yaklaşımı onaylandı; nihai sanat dosyaları hâlâ teslim edilecek.  
**Planlama varsayımı:** 1–2 haftalık sprintler, küçük ürün ekibi; süreler ekip kapasitesi ve kullanıcı araştırmasıyla yeniden tahmin edilir. Kullanıcı 20 Ekim 2026 tarihinde planı onaylayıp geliştirme talimatı verdi. Bu onay App Store/Google Play’e gönderim veya yayın onayı değildir.

## İlerleme kaydı — 20 Ekim 2026

- Expo SDK 58, TypeScript ve Expo Router temeli kuruldu; Expo-native paketler SDK ile eşlendi.
- Yerel-first onboarding, ana ekran, istek araçları ve zamanlayıcısı, check-in, sığınak, ilerleme/kayma kaydı, ayarlar, veri dışa aktarma ve yerel silme akışları uygulanmış durumda. Crescent projesindeki adım göstergesi, kısa ürün tanıtımı, geri gezinme ve taslak kurtarma örüntülerinden esinlenerek onboarding tek konuya odaklanan ekranlara bölündü; alanlar MVP için yeniden yazıldı.
- Onboarding girdileri: günlük tüketim (atlanabilir), paket fiyatı/adedi (atlanabilir), bırakma tarihi ve kişisel neden (atlanabilir); özet adımı, taslak kaydı ve geri düzenleme mevcut. Atlanan tahmin verileri uygulamada sıfır gibi sunulmuyor.
- Bırakma tarihi bugüne veya ileri bir güne ayarlanabilir; gün bazlı tarih saklama saat dilimi kaymasını önler. Düzenleme iptali ve kayma sonrası son sigara sayacı eklendi.
- Supabase snapshot migration/RLS ve hesap silme Edge Function hazırlandı. Mobil auth oturumu AES-GCM ile şifrelenip anahtarı SecureStore’da tutuluyor; eski AES-CTR oturumları ilk okumada sessizce taşınıyor. Staging projesi ve gerçek ortam bilgileri henüz sağlanmadı.
- iOS 27.0 simülatöründe native development build başarıyla alındı ve onboarding ekranı açılarak görüntülendi. Tarih alanı platforma uygun native date picker kullanıyor. Lint, TypeScript kontrolü ve Expo Doctor 20/20 başarılı.
- Sprint 0 ve 1’in kullanıcı araştırması, prototip kullanılabilirlik oturumları ve marka/mascot kararları henüz tamamlanmadı. Bu nedenle ilgili sprintler çıkış ölçütleriyle tamamlanmış sayılmıyor.
- Sprint 2 devam ediyor: hata/log gizliliği, auth/deep link, schema doğrulama, offline eşitleme ve veri yaşam döngüsü iyileştirmeleri sırada.
- Bağımlılık güvenliği takibi: npm 28 advisory buldu (21 yüksek, 7 orta). Önerilen otomatik düzeltme SDK dışı sürüm düşürdüğü için uygulanmadı; SDK ile uyumlu alternatifler yayın hattından önce incelenecek.
- Sprint 2 sertleştirmesi: oturum şifrelemesi doğrulamalı AES-GCM'e geçirildi, eski AES-CTR oturumları ilk okumada taşınıyor; yerel ve Supabase snapshot JSON'u durum olarak kullanılmadan önce doğrulanıyor.
- Sprint 2: kayıt e-postaları `quit-companion://auth/callback` bağlantısıyla uygulamaya döner; PKCE kodu uygulamada Supabase oturumuna çevrilir. Başarısız bulut yazımı, hesap kimliğine bağlı son snapshot olarak yerelde saklanır ve bağlantı geri geldiğinde/uygulama öne geldiğinde yeniden denenir. Gerçek e-posta ve ağ kesintisi uçtan uca staging hesabıyla doğrulanmayı bekliyor.
- Sprint 2: uygulamanın bugünkü veri alanları, yerel/bulut depolama ve kullanıcı silme/export yolları `mobile/PRIVACY_DATA_INVENTORY.md` içinde kayda alındı. Bu mühendislik envanteri yayımlanmış gizlilik bildirimi yerine geçmiyor.
- Sprint 2 doğrulaması: TypeScript, lint, Expo Doctor (20/20), Expo web export ve iOS 27.0 development build başarılı. `quit-companion` şemasının native Info.plist'e yazıldığı görüldü. Simülatör deep-link açılış onayı gösterdi; staging olmadığı için gerçek PKCE e-posta dönüşü henüz uçtan uca denenmedi.
- Güvenlik kapısı: `npm audit --omit=dev` 28 transitif uyarı (21 yüksek, 7 orta) raporluyor. `npm audit fix --dry-run`, güvenli semver aralığında bu uyarıları kapatmadı; zorunlu çözüm Expo'yu SDK 44'e düşürüyor. Sürüm öncesi uygun SDK yaması/üst sürümüne geçişle ele alınmalı.
- Supabase çalışma sırası ürün sahibiyle netleştirildi: hesap/proje henüz açılmadı. Migration ve function dosyaları repoda hazırlanmaya devam edecek; SQL çalıştırma, Auth redirect ayarı ve gerçek eşitleme doğrulaması proje açılınca yapılacak. Şu an yerel-first geliştirme bunun ön koşulu değil.
- Sprint 5/6 sağlamlaştırması: istek sayacı artık sabit bitiş zamanına göre ilerliyor ve uygulama arka plandan dönünce kalan süreyi güncelliyor. Eşitleme kuyruğu çevrimdışıyken de yerel oturum kimliğine bağlanıyor; Ayarlar'da elle yeniden deneme düğmesi var.
- Sprint 7 erişilebilirlik ilk dilimi: ana düğmeler, gezinme sekmeleri, form alanları, istek/check-in seçimleri ve riskli veri işlemleri için ekran okuyucu etiketleri/durumları eklendi; dokunma alanları en az 44–48 pt hedeflerine yaklaştırıldı ve varsayılan font ölçekleme korunuyor. TypeScript, lint ve web export başarılı. VoiceOver/TalkBack, gerçek Dynamic Type boyutları, kontrast/renk körlüğü ve küçük ekranlarda görsel taşma denetimi cihaz üzerinde hâlâ yapılmalı; sprint kapanış ölçütü değil.
- Sprint 2 araç zinciri: `.github/workflows/quality.yml` pull request ve push için Node 22.13 üzerinde `npm ci`, lint, TypeScript ve Expo Doctor adımlarını çalıştıracak şekilde hazırlandı. Depoda uzak Git remote olmadığı için hosted CI henüz tetiklenemiyor; aynı kalite adımları yerelde doğrulandı (lint, typecheck, Expo Doctor 20/20). iOS development build de SDK 58 ile başarılı; Xcode iki upstream script/module uyarısı verdi, build hatası yok.
- Güncel üretim ağacı taraması yine 28 uyarı (21 yüksek, 7 orta) bildiriyor. İki yüksek önemli advisory `braces <= 3.0.3` ve `node-forge <= 1.4.0` için GitHub Advisory Database şu anda yamalı sürüm listelemiyor: https://github.com/advisories/GHSA-vfj7-8cjw-p6xm ve https://github.com/advisories/GHSA-86w9-cpqp-85rv. Sadece `npm audit fix --force` çözüm önerisi Expo 44'e düşürdüğü için kullanılmadı. Uygun upstream yama/SDK yükseltmesi bulunana kadar yayın adayı güvenlik kapısı açık.
- Sprint 2 güvenlik incelemesi: hesap silme Edge Function artık Supabase admin API hata detaylarını kullanıcıya döndürmüyor; istemciye genel hata veriyor. Gerçek servis/RLS/silme davranışı için staging doğrulaması bekliyor.
- Sprint 4 ilerleme/ödül düzeltmesi: tahmini içilmeyen sigara sayısı artık yalnızca mevcut bırakma planından sonra kaydedilen tekil kayma kayıtlarını düşüyor; gelecekteki zaman damgaları sayaç başlangıcını geriye/ileriye taşımıyor. Yerel ödül kuralı domain katmanına taşındı: yerel takvim gününde en fazla bir check-in ışığı, tamamlanmış her ayrı istek oturumu için bir coping ışığı; aynı oturumda araç değiştirip iki kere tamamlamak yeni ışık oluşturmuyor. Kayma ödülü azaltmıyor. Bu yerel-first kuraldır; ürün sahibi Supabase projesini oluşturunca sunucu doğrulamalı ledger/RPC ile güçlendirilecek, mevcut snapshot migration henüz uygulanmadı.
- Sprint 6/7 destek kaynağı: ALO 171 metni ve telefonu Sağlık Bakanlığının resmî sayfasından doğrulandı; Ayarlar’a `tel:171` arama bağlantısı ve resmî destek bilgisi eklendi. Kaynak: https://alo171.saglik.gov.tr/TR-66752/nasil-destek-alabilirim-.html (kontrol: 20 Ekim 2026).
- Sprint 2/4 çevrimdışı kayıt akışı: yerel depolama yazımı artık UI durumunu güncellemeden önce tamamlanıyor; yazım hatasında plan/check-in/baş etme tamamlandı olarak gösterilmiyor. Authenticated snapshot yazımları seri kuyruğa alınıyor ve son cihaz durumu için hesap bağlı yeniden deneme işareti korunuyor. Bu akış, Supabase staging olmadan ağ kesintisi senaryosunda uçtan uca doğrulanmış sayılmaz.
- Bu çevrimdışı kayıt değişikliğinden sonra TypeScript, lint, Expo Doctor (20/20), Expo web export ve iOS simülatör build/kurulum/açılışı başarılı. Xcode build'i 0 hata ve 2 araç zinciri uyarısıyla tamamlandı.
- Sprint 6 bildirim dilimi: SDK 58 uyumlu Expo Notifications ile cihazda günlük check-in hatırlatması eklendi. Kullanıcı kapalı başlar, saati seçip Aç dediğinde izin istenir; kapatma mevcut yerel bildirimi iptal eder. Tercih cihazda tutulur ve Supabase'e gönderilmez. TypeScript/lint/Expo Doctor/web export ve iOS native build/kurulum/açılışı geçti. Bildirim gerçek cihazda ve izin ret/geri alma senaryolarında henüz manuel denenmedi.

## İlerleme kaydı — 21 Ekim 2026

- Kullanıcı mevcut ekranları inceledi: bilgilendirme pencerelerinin uygulama stiline taşınması, plan bilgilerinin onboarding sihirbazı yerine tek ekranda düzenlenmesi ve yanlışlıkla oluşturulan geçmiş kayıtlarının silinebilmesi istendi.
- Görsel karar yinelendi: tilki maskotu + Sığınak yaklaşımı. `maskot.jpeg` ve `prototip.html` görsel/akış kaynağı; terracotta-krem tema uygulanacak. HTML prototipindeki irade kristali, seri kalkanı ve sağlık yüzdeleri MVP kapsamı değildir.
- Revizyon `DESIGN_REFACTOR_PLAN.md` içinde üç adımda belgelendi. İlk dilimde tek sayfa plan düzenleme, kayıt geri alma, Sığınak eşikleri/ödül açıklaması ve tilkinin ana ekranlarda kullanımı uygulanıyor. Bu yerel-first işler Supabase projesini beklemiyor.
- İlk dilim uygulandı: plan ayarları tek ekranda düzenleniyor; Rotam'da son sekiz kaydın her biri için özel tasarımlı geri alma onayı var; bilgi/işlem mesajları native `Alert` yerine uygulama içi diyalog bileşeni kullanıyor. Kayıt silinince sayaç ve ödül toplamı olay listesinden yeniden türetiliyor.
- Sığınak açıklaması 2 ışık/parça eşiğini, sıradaki parçaya kalan ışığı ve ışık kazanma eylemlerini gösteriyor. Tilki maskotu `assets/mascot/` paketindeki 9 poz + 6 efekt katmanıyla uygulamaya entegre edildi; yeniden kullanılabilir `Mascot` bileşeni (`src/components/Mascot.tsx`) Yuva, onboarding, istek desteği ve Sığınak'ta kullanılıyor. Ana vurgu sıcak krem/terracotta oldu; ışık ödülü ve temel ilerleme kuralı korundu.
- Revizyon doğrulaması: `npx tsc --noEmit`, `npx expo lint`, `git diff --check` geçti. iOS 27.0 simülatör build/kurulum/açılış 0 build hatasıyla başarılı; iki bilinen upstream Xcode uyarısı sürüyor. Yuva, Sığınak, tek sayfa plan formu ve özel kayıt kaldırma diyaloğu simülatörde görsel/erişilebilirlik ağacı üzerinden kontrol edildi. Yanlışlıkla silmemek için test cihazındaki kullanıcı kayıtları değiştirilmedi. VoiceOver ve gerçek cihaz kontrolü hâlâ sonraki dilimde.

- Sprint 6 isteğe bağlı günlük hatırlatma UI'si eklendi; varsayılan kapalı, cihaz üstü izin ve programlı yerel bildirim, saat güncelleme ve kapatma/iptal mevcut.
- Expo Notifications native modül ve config plugin eklendi. TypeScript, lint, Expo Doctor (20/20), web export ve iOS simülatör build/kurulum/açılışı geçti; ekranda onboarding ilk adımı açıldı.
- Xcode çıktısında 0 hata ve iki araç zinciri uyarısı (Dev Launcher build-phase bağımlılığı ve Expo CoreModule görünürlüğü) var. Native build ürün kodu hatası vermedi.
- Bildirim gizliliği: planlı check-in hatırlatmaları uygulama öndeyken sessizce bastırılıyor; hesap/yerel veri silme sırasında cihazdaki planlı hatırlatma iptal ediliyor. `PRIVACY_DATA_INVENTORY.md` güncellendi; tercih ve zaman Supabase'e gönderilmiyor.
- Settings ekranı için `any` prop yüzeyi kaldırılarak profil, auth, sync, silme, export ve reminder callback sözleşmeleri açık TypeScript tiplerine geçirildi; typecheck/lint temiz.
- Sprint 5 akış düzeltmesi: baş etme aracı tamamlandı düğmesi oturumu hemen kaydediyor; istek sonucunu seçmek ayrı ve isteğe bağlı. Böylece kullanıcı sonuç sorusunu atlayıp ana ekrana dönse de tamamlanan araç oturumu/ışığı kaybolmuyor. Sonuç kaydı cihazda yazılamazsa başarı mesajı ve kapanış gösterilmiyor.
- Sprint 0/1 araştırma hazırlığı: yetişkin hedef kullanıcılarla 5–8 erken kullanılabilirlik oturumu için moderatör rehberi `USER_RESEARCH_GUIDE.md` içinde hazır. Katılımcı, oturum veya bulgu yok; görüşme ve düzeltme turu halen ürün sahibi/katılımcı erişimi gerektiriyor.
- Sprint 8 mağaza/gizlilik hazırlığı: `STORE_SUBMISSION_DRAFT.md` Türkçe ürün sayfası metni, gerçek uygulamadan alınacak screenshot planı ve submission checklist'ini içeriyor; `PRIVACY_NOTICE_DRAFT.md` mevcut veri akışına dayalı, bilinmeyen şirket/Supabase/saklama alanları işaretli iç taslak. İkisi de mağazaya yüklenebilir/yayımlanabilir son varlık değildir. Apple alan sınırları ve hesap silme/gizlilik yönlendirmesi resmi dokümanlardan kontrol edildi.
- 21 Ekim güvenlik taraması: `npm audit --omit=dev` 28 bulgu (21 yüksek, 7 orta); `npx expo install --check` SDK bağımlılıklarını uyumlu/güncel bildiriyor. GitHub advisory'leri `braces <=3.0.3` ve `node-forge <=1.4.0` için henüz yamalı sürüm listelemiyor; npm latest da bu sürümler. Otomatik Expo 44 düşüşü uygulanmadı. Kaynaklar: https://github.com/advisories/GHSA-vfj7-8cjw-p6xm ve https://github.com/advisories/GHSA-86w9-cpqp-85rv.
- 21 Ekim devam çalışması: doküman-kod uyumsuzluğu giderildi. README ve RPD artık tilki türü kararını, geçici kırpılmış çizim ve geliştirme ikonu sınırlarını doğru anlatıyor. Varsayılan Expo mavi ikonları, ürün adı uydurmayan sıcak tonlu tilki işaretiyle değiştirildi; SVG kaynak ve iOS/Android/web çıktıları uygulamaya eklendi.
- Ürün sahibi kapıları açıkça listelenmeye devam ediyor: ürün/tilki adı ve final sanat onayı, 5–8 kullanıcı görüşmesi, Supabase projesi/staging ve RLS doğrulaması, yasal yayıncı/iletişim/gizlilik URL'leri, gerçek cihaz erişilebilirlik incelemesi ve mağaza geliştirici hesabı. Bu işler için bilgi/hesap erişimi gelene kadar yerel-first iş, release checklist ve kullanılabilirlik düzeltmeleri devam edecek; mevcut uygulama mağazaya gönderime hazır kabul edilmiyor.
- Geçici uygulama işareti `mobile/assets/brand/fox-mark.svg` kaynak dosyasından üretildi; iOS ikon, Android adaptive foreground/background/monochrome, splash ve web favicon çıktıları güncellendi. Expo Doctor 20/20, iOS 27.0 native build/kurulum ve web export başarılı; simülatörde Yuva görseli yeniden açıldı. Geçici ikon gerçek ürün/karakter kimliği onayı değildir.
- `mobile/tests/rewards.test.mjs` ve `npm test` eklendi: check-in günlük tekil ödülü, yerel takvim günü, coping oturumu tekilliği, kayma/yarım istek davranışı ve bozuk tarih senaryoları kapsanıyor (5/5 geçti). CI kalite işine domain test adımı eklendi.
- Dışa aktarım metin paylaşımından gerçek veri dosyasına çevrildi: native uygulama versioned JSON'u cache'te oluşturup iOS/Android paylaşım menüsüne verir; web preview tarayıcıdan indirir. Dosya şeması için iki test eklendi. Kişisel verinin alıcı uygulamaya aktarılacağına dair mevcut Ayarlar açıklaması korunuyor.
- Dışa aktarım dilimi kontrol edildi: TypeScript/lint/Expo Doctor (20/20), web export ve iOS native build/kurulum başarılı; ödül ve export testleri 7/7. iPhone simülatöründe JSON dosyasının adı/türü/boyutu paylaşım menüsünde göründü; veri hedefi seçmeden pencere kapatıldı, yerel veriler değiştirilmedi. iOS build 0 hata, iki bilinen Expo/Xcode uyarısı verdi.
- Yeni SDK 58 export modülleri sonrası güncel `npm audit --omit=dev`: 29 bulgu (21 yüksek, 8 orta; kritik yok). `npm audit fix --force` hâlâ Expo 44'e düşürmeyi öneriyor; uyumlu SDK yaması yayınlanana/incelemeye alınana kadar release security gate açık. Ayrıntı `mobile/PRIVACY_DATA_INVENTORY.md` içinde.
- Yerel ve bulut JSON doğrulaması `src/data/schema.ts` içine ayrıldı; desteklenen profil alanları normalize ediliyor, geçersiz tarih/tür/değer ve 700 KB üstü snapshot reddediliyor. Sığınak ödül/JSON export/plan şema testleri toplam 12/12. Son refactor sonrası typecheck, lint, Expo Doctor (20/20) ve web export geçti; iOS simülatöründe Settings ekranı çalışır durumda.

## Ürün sahibi girdisine kadar açık yayın kapıları

- **Supabase:** proje/region oluşturma, `.env` gerçek değerleri, migration uygulama, Auth redirect/e-posta ayarı, Edge Function deploy ve staging RLS/silme/eşitleme denemeleri.
- **Marka:** ürün ve maskot adını seçme/onaylama; geçici ikon ve kırpılmış karakter çizimini final sanatla değiştirme; bundle ID, mağaza adı ve yayıncı kimliğini kesinleştirme.
- **İnsan doğrulaması:** 5–8 yetişkinle rehberli kullanılabilirlik oturumu; TR sağlık/destek metni ve yasal gizlilik/koşul incelemesi; VoiceOver/TalkBack ve büyük metni gerçek cihazlarda kontrol.
- **Mağaza/yayın:** yayıncı iletişimi, destek/gizlilik sayfalarının HTTPS adresleri, App Store/Play geliştirici hesapları, final ekran görüntüleri, veri beyanı ve TestFlight/internal testing.

Bu maddeler olmadan yayın adayı ilan edilmeyecek. Bunların dışındaki kod, içerik ve kalite işleri sprint planına göre sürdürülecek.

## Sürüm hedefi

Kullanıcı onboarding’de sigara bırakma planını kurar; ana ekranda ilerlemesini görür; istek geldiğinde kısa destek aracını açar; tetikleyici/sonucu kaydedebilir; kayma yaşarsa geçmiş emeği silinmeden plana döner. Sığınak ve maskot bu faydayı anlatır ve destekler. Veri/gizlilik, erişilebilirlik ve mağaza hazırlığı yayın kalitesinin parçasıdır.

## Sprint 0 — Ürün keşfi ve karar kilitleri

**Amaç:** Geliştirmeden önce belirsizlikleri ve riskli iddiaları kapatmak.

**İşler**
- RPD’yi ürün sahibiyle incele; MVP kapsamı, hedef yetişkin kullanıcı ve ilk mağaza hedefini onayla.
- Mevcut HTML prototip ve maskot varlıklarını ekran/akış bazında envanterle; referans içerik ile üretim kararı ayrımını kaydet.
- 5–8 hedef kullanıcıyla kısa görüşme/konsept testi planla; kriz anı, kayma dili, mahremiyet, oyunlaştırma ve sığınak metaforunu araştır.
- Uygulama adı/marka, App Store ve alan adı için kısa liste ve resmi marka taraması iş akışını oluştur; geçici isimleri üretim varlığına gömme.
- Maskot kesin gereksinim olarak kayda alınır; tilki ve özgün kurgusal karakter yönlerini aynı brief ve kullanım bağlamlarıyla karşılaştır. Nihai tür/ad/çizim için karar ölçütlerini belirle.
- Tasarruf hesabı, bırakma sayacı, kayma semantiği, kaynaklı sağlık kilometre taşları ve ödül kurallarını kesinleştir.
- Ücretsiz/ücretli model, hesapsız kullanım ve hedef ülkeleri karar kaydına geçir.

**Çıkış ölçütleri**
- RPD’deki P0 açık kararlar sahibi/tarihiyle kayıtlı.
- Onaylanan uçtan uca kullanıcı akışları ve içerik ilkeleri.
- Sağlık içeriği kaynak ve editoryal onay sahibi tanımlı.
- Uygulama adı ve maskot sanat üretimi için karar/araştırma takvimi.

## Sprint 1 — UX akışları ve görsel prototip

**Amaç:** Koddan önce kritik akışların kullanılabilirliğini doğrulamak.

**İşler**
- Onboarding, plan özeti, ana ekran, istek desteği, günlük check-in, kayma ve plana dönüş, ilerleme/sığınak, ayarlar/silme için wireframe ve tıklanabilir mobil prototip.
- Türkçe metinleri yargılamayan tonla yaz; erişilebilirlik ve boş/yükleniyor/hata durumlarını dahil et.
- Maskot için geçici nötr yer tutucu; tür seçimi araştırma sonucu netleştiyse karakter brief’i ve asset gereksinimleri oluştur. Görsel sanat işini kod tamamlanana kadar belirsiz bırakma: çizim/animasyon sprintleriyle paralel başlat.
- Kritik görevlerle 5–8 kişi üzerinde moderatörlü kullanılabilirlik testi; sorunları önem derecesine göre düzelt.

**Çıkış ölçütleri**
- Kullanıcı testlerinde ana işe giden yollar anlaşılır; kritik kullanılabilirlik engelleri kapatılmış.
- Ekran, içerik, etkileşim ve erişilebilirlik teslim ölçütleri tanımlı.
- İlk yayın için maskot/marka varlık takvimi belli.

## Sprint 2 — Teknik temel, Supabase ve gizlilik

**Amaç:** Güvenli, sürdürülebilir uygulama temelini kurmak.

**İşler**
- Expo + React Native + TypeScript projesi, navigation, tema tokenları, lint/format, environment ayrımı ve CI build hattı.
- Supabase dev/staging kurulumu; schema migration, Auth seçenekleri, RLS politikaları, session yönetimi ve güvenli secrets. **Beklemede (bilinçli):** ürün sahibi Supabase projesini MVP kodu hazırlandıktan sonra oluşturacak; bu sprintte migration ve yönergeler hazırlanır, projeye uygulanmaz.
- Profil, quit plan, check-in, craving session, slip, coping tool, notification preference ve reward ledger şemaları.
- Offline-first kapsamı kararlaştır; kritik kayıtların geçici saklama, yeniden deneme ve çakışma davranışını uygula. **Kısmi:** yerel-first kayıt ve hesap-bağlı yeniden deneme kuyruğu hazır; gerçek staging ortamındaki retry ve çakışma doğrulaması açık.
- Gizlilik veri envanteri, üçüncü taraf SDK listesi, log redaction ve silme/export tasarımı. **Kısmi:** teknik envanter ve loglarda hata nesnesi redaction'ı tamam; yasal bildirim, staging veri yaşam döngüsü kontrolü ve mağaza beyanı açık.

**Çıkış ölçütleri**
- Temiz kurulum ve CI ile dahili build üretilebilir.
- RLS her kullanıcı verisinde uygulanmış; başka kullanıcı verisine erişim denemesi reddediliyor.
- Migration ve ortam kurulum adımları belgeli; sırlar repoda bulunmuyor. **Kısmi:** snapshot migration ve yerel kurulum yönergesi var; staging projesi/kimlik bilgileri ve release secret yönetimi açık.
- Hesap/veri saklama ve silme akışı teknik olarak uygulanabilir.

## Sprint 3 — Onboarding ve bırakma planı

**Amaç:** Kullanıcıyı kişisel, düzenlenebilir bırakma planıyla ana ekrana ulaştırmak.

**İşler**
- Gerekli minimum sorular, atlanabilir alanlar ve anlaşılır hesap varsayımları.
- Quit date, günlük tüketim, paket içeriği/fiyatı, para birimi ve zaman dilimi yönetimi.
- Auth ve onboarding yarıda kalma/geri dönme durumları.
- Hesapsız kullanım kararı çıktıysa anonim başlangıç ve sonradan hesap bağlama; çıkmadıysa minimum veriyle kayıt.
- Hatırlatma izin öncesi açıklama ve tercihler.

**Çıkış ölçütleri**
- Kullanıcı planı oluşturup düzenleyebilir; sıfır/eksik/gerçek dışı değerler güvenli ele alınır.
- Para/zaman hesabı birim testleri ve UI açıklamasıyla tutarlı.
- Eşitleme ve yarım onboarding durumu veri kaybetmiyor.

## Sprint 4 — Ana ekran, ilerleme ve sığınak

**Amaç:** Günlük ilerlemeyi anlaşılır ve baskısız sunmak.

**İşler**
- Dumansız süre ve tarih hesabı; tasarruf tahmini; kullanılan varsayımlara erişim.
- Check-in ve ilerleme geçmişinin temel görünümü.
- Sığınak evreleri ve ödül ekonomisi: baş etme pratiği ve check-in’ler dahil; kayma ceza/geriye yıkım üretmez.
- Maskot varlığı için ilk yayın seviyesinde temel statik/az animasyonlu pozlar, içerik fallback’i ve VoiceOver metni. Nihai karakter kararı Sprint 0/1’den çıkar; asset teslimi gecikirse yayın kapısı olarak takip edilir.
- İlerleme kuralları sunucu/servis katmanında doğrulanır, yinelenen ödül kaydı engellenir.

**Çıkış ölçütleri**
- Ana ekrandaki sayaçlar timezone, tarih değişimi ve plan düzenlemesinde tutarlı.
- Kullanıcı kayma yaşasa da sığınak/ödül geçmişi korunur.
- Ödül kuralları açıklanabilir ve kötüye kullanıma karşı idempotent.

## Sprint 5 — İstek desteği ve baş etme araçları

**Amaç:** MVP’nin en kritik anını uçtan uca çalıştırmak.

**İşler**
- Ana ekrandan tek dokunuşla açılan istek akışı.
- İsteğe bağlı tetikleyici/şiddet seçimi; kısa nefes/grounding, erteleme, kişisel nedenler ve alternatif eylem araçları.
- Oturum sonrası kısa check-in, geçmiş kaydı ve kullanıcıya göre araçları tekrar sunma.
- Uygulamadan çıkma, telefon kilidi, kesinti, düşük bağlantı ve zamanlayıcı davranışı.
- Yerel destek kaynakları ve uygun bilgilendirme metinleri.

**Çıkış ölçütleri**
- İstek akışı hızlıca başlatılabiliyor; kayıt kaybı yok; kullanıcı aracı istediği an durdurabiliyor.
- Nefes içeriği zorunlu değil; rahat etmeyen kullanıcı alternatif seçebiliyor.
- Ürün klinik destek/tedavi iddiası oluşturmuyor.

## Sprint 6 — Kayma, geçmiş, ayarlar ve bildirim

**Amaç:** Gerçek yaşam dalgalanmalarını desteklemek ve kullanıcı kontrolünü tamamlamak.

**İşler**
- Yargılamayan kayma kaydı, geçmişi koruma ve plana yeniden bağlanma.
- Bildirim tercihleri, zaman penceresi, sessize alma ve izin reddedildiğinde açıklama.
- Hesap/profil ayarları, veri dışa aktarma, hesap silme ve uygulama içi destek/gizlilik bağlantıları.
- Eşitleme/çevrimdışı durum göstergeleri; kullanıcıya tekrar deneme ve hata çözümü.

**Çıkış ölçütleri**
- Kayma geçmişi dumansız sayaç semantiğiyle çelişmiyor.
- Kullanıcı bildirim almadan ürünü kullanabiliyor ve izni geri alabiliyor.
- Silme talebi uygulamadan başlatılıp backend’de tamamlanıyor; veri dışa aktarma anlaşılır.

## Sprint 7 — Yerelleştirme, erişilebilirlik ve içerik/mascot polish

**Amaç:** Yayına uygun, tutarlı ve kapsayıcı deneyim.

**İşler**
- TR içerik editoryal incelemesi; para birimi, tarih, saat dilimi ve dinamik metinler.
- İngilizce yerelleştirme altyapısı; MVP İngilizce yayını ürün kararı değilse çevrilecek kapsam ayrıca belirlenir.
- VoiceOver/TalkBack, Dynamic Type, kontrast, hit target, Reduce Motion, klavye ve ekran okuyucu kontrolleri.
- Nihai maskot çizim/animasyonlarının tüm gerekli ölçü ve durumlara aktarımı; geçici varlık kalmadığının kontrolü.
- App icon, launch screen, empty states ve hata görselleri.

**Çıkış ölçütleri**
- Temel akışlar ekran okuyucu ve büyük metinle kullanılabilir.
- Maskot ve marka varlıklarının lisans/telif sahipliği ve kaynak dosyaları belgeli.
- Yerelleştirme dizgileri taşma/kesilme sorunlarından arındırılmış.

## Sprint 8 — Kalite, mağaza hazırlığı ve yayın adayı

**Amaç:** App Store / Google Play gönderimine hazır sürüm adayı.

**İşler**
- Kritik akışların otomatik ve gerçek cihaz doğrulaması: onboarding, auth, sayaç, istek, check-in, kayma, offline/online sync, export/delete ve izinler.
- Çökme, performans, ağ hatası, güvenlik/RLS ve gizlilik regresyon incelemesi.
- Sağlık kilometre taşları ve destek kaynaklarının kaynak/yerelleştirme doğrulaması.
- Gizlilik politikası, kullanım koşulları, destek sayfası, mağaza metinleri, ekran görüntüleri, yaş derecesi, privacy/data safety beyanları.
- TestFlight ve Play internal testing; geri bildirim, kritik hata düzeltme ve release notes.
- Store review notları, demo hesap/inceleme erişimi gerekiyorsa güvenli biçimde sağlama, sürüm numarası ve rollback planı.

**Çıkış ölçütleri**
- P0/P1 hata yok; bilinen sorunlar yayın sahibi tarafından kabul edilmiş.
- Production backend, RLS, backup, monitoring ve destek süreçleri hazır.
- Mağaza metadata ve yasal/gizlilik beyanları uygulamayla birebir tutarlı.
- Yayın adayı iki platformun güncel gönderim checklist’ini karşılıyor.

## Sonraki aşama — gönderim ve ilk yayın sonrası

- Kullanıcı onaylı release candidate mağazalara yüklenir; inceleme geri dönüşleri ele alınır.
- Yayına çıkış, mağaza kabulü ve geliştirici hesabı erişimi gerektirdiği için ürün sahibinin onayıyla yapılır.
- İlk 2–4 haftada hata, eşitleme, onboarding, kriz aracı kullanımı, kayma sonrası dönüş ve kullanıcı geri bildirimleri izlenir.
- İlk sürüm verisiyle onboarding ve istek desteği iyileştirilir; sonraki alışkanlık türleri ayrı araştırma ve güvenlik değerlendirmesi olmadan eklenmez.

## Test stratejisi

Testler bir sprint kapısında değil, özellik tamamlandığında ve release sprintinde yürütülür. Sağlık verisi/ödül/hesaplama mantığı için birim testleri; Supabase RLS ve auth için entegrasyon testleri; kritik kullanıcı akışları için cihaz üzerinde uçtan uca doğrulama gerekir. Otomasyon erişilebilirliği tek başına kanıtlamaz; VoiceOver/TalkBack ve büyük metin manuel kontrol edilir. Test hesabı ve örnek veri gerçek kişisel/sağlık verisi içermez.

## Risk ve bağımlılıklar

- Marka/karakter kararı veya sanat teslimi gecikmesi App Store varlıklarını geciktirebilir; Sprint 0’da sahip/tarih belirlenir.
- Supabase bulut hesabı ve analitik tercihi gizlilik yükümlülüklerini ve maliyeti etkiler.
- Sağlık kilometre taşları yanlış/abartılı görünürse kullanıcı güvenini zedeler; kaynaklı içerik onayı yayın kapısıdır.
- Gamification kullanıcıyı suçlarsa bırakma deneyimine zarar verebilir; kayma akışı ve kullanıcı testi P0 gereksinimidir.
- Mağaza kuralları değişebilir; güncel resmi yönergeler release sprintinde kontrol edilir.
- Takvim, ekip büyüklüğü, kullanıcı testi erişimi, mağaza hesapları ve hukuki inceleme hazır olmasına göre yeniden tahmin edilir.

## Değişiklik ve onay akışı

1. Kullanıcı RPD ve sprint planını gözden geçirir.
2. Kullanıcı planı 20 Ekim 2026 tarihinde onayladı; ilk uygulama dilimi başlatıldı.
3. Her sprint sonunda çalışan build, kapsam değişiklikleri, kalan riskler ve sonraki sprint önerisi sunulur.
