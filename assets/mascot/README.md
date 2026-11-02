# Tilki Maskot Asset Paketi (React Native / Expo)

Onaylanan karakter sayfasına birebir uyumlu tilki maskotu + ayrı efekt (FX) katmanları.
Tüm dosyalar **şeffaf PNG (RGBA)**, kare tuval, içerik ortalı ve küçük kenar boşluklu.

**NOT:** Paket boyutunu azaltmak için, şu anda kullanılmayan pozlar ve efektler `src/components/Mascot.tsx`'ten kaldırıldı. Tüm dosyalar repoda mevcut; kullanılmaya hazırlar. Yeniden etkinleştirmek için:
1. `Mascot.tsx` içinde `MascotPose` veya `MascotEffect` type'ına ekle
2. `POSE_ASSETS` veya efekt için yeni map oluştur ve ilgili `require()` ekle
3. Efektler için bileşen kodunu git history'den geri getir

## Klasör yapısı ve Expo adlandırması

```
mascot/
  fox/   9 poz × 3 çözünürlük
  fx/    6 efekt × 3 çözünürlük
  preview.png   (tüm asset'lerin ve örnek katmanlamaların önizlemesi, #1b1f24 zemin)
```

| Ek | Boyut | Kullanım |
|---|---|---|
| `name.png` | 342×342 | @1x |
| `name@2x.png` | 683×683 | @2x |
| `name@3x.png` | 1024×1024 | @3x |

Expo/Metro doğru yoğunluğu otomatik seçer: `require('../assets/mascot/fox/fox_idle.png')` yazmanız yeterli (@2x/@3x'i kendisi bulur).

## Tilki pozları (`fox/`)

| Dosya | Poz | Önerilen ekran / kullanım |
|---|---|---|
| `fox_idle` | Nötr, ayakta gülümseme | **Yuva (ana sayfa)** varsayılan durum, boş durumlar |
| `fox_wave` | El sallayarak merhaba | **Onboarding** karşılama, günlük ilk açılış selamı |
| `fox_happy` | Zıplayarak sevinç, kollar yukarıda | Hedef tamamlandı, seri (streak) artışı, **Sığınak ödülleri** kazanımı |
| `fox_sad_coal` | Üzgün, kömür taşı tutuyor, hafif isli kürk (1. Gün "Smog") | Onboarding "başlangıç noktası", 1. gün, kayma (relapse) sonrası şefkatli ekran |
| `fox_craving` | Kararlı, mavi kristal çatlaklı kömür taşı | **Craving (istek) akışı**: "Dayan, dönüştürüyorsun" adımları |
| `fox_calm` | Bağdaş kurmuş meditasyon, gözler kapalı | **Nefes egzersizi** ekranı |
| `fox_cheer` | Başparmak yukarı, cesaretlendirme | Craving akışı sonu ("Başardın!"), bildirim/teşvik kartları |
| `fox_sleepy` | Esneyen, uykulu | Gece modu / uyku hatırlatıcısı, gece geç saat craving girişleri |
| `fox_hero` | 30. Gün kahraman: pilot gözlüğü, yıldızlı lacivert pelerin, mavi elmas | **30. gün kilometre taşı**, Sığınak'ta en üst ödül rozeti |

## Efekt katmanları (`fx/`)

Siyah zeminde üretildi; alfa parlaklıktan türetildi (renkler un-premultiply edildi), yani koyu ve açık zeminlerde temiz görünür. Tilkiden **ayrı** katmanlardır; üst üste `position: 'absolute'` ile bindirin.

| Dosya | İçerik | Kullanım | Katman sırası | Önerilen animasyon (react-native-reanimated) |
|---|---|---|---|---|
| `fx_smoke` | Kıvrımlı gri duman | `fox_sad_coal` (1. gün) | Tilkinin **üstünde**, başın üzerine kaydırılmış (~%55 ölçek, translateY ≈ -%27) | `translateY` 0 → -24px ve `opacity` 0.9 → 0, 3–4 sn, `withRepeat`; 2 kopyayı faz farkıyla oynatın (drift up + fade) |
| `fx_shield` | Altın-mavi enerji kalkanı halkası (orta boş) | `fox_craving` | Arkada %100 + isteğe bağlı önde %35 opaklıkta 2. kopya ("içinde" hissi) | `rotate` 0 → 360° 20 sn linear sonsuz; `scale` 1 → 1.04 pulse 1.2 sn `withRepeat(..., -1, true)` |
| `fx_breath_ring` | Turkuaz parlayan halka (orta boş) | `fox_calm`, nefes ekranı | Tilkinin **arkasında**, tilki ~%62 ölçekte ortada | Nefes ritmi: `scale` 0.85 → 1.0 **4 sn al**, 1.0 → 0.85 **4 sn ver** (`Easing.inOut(Easing.sin)`), opacity 0.7 ↔ 1 |
| `fx_bubbles` | Dağınık küçük turkuaz baloncuklar | Nefes ekranı | Halkanın üstünde, tilkinin arkasında | `translateY` 0 → -40px + `opacity` 1 → 0, 5–6 sn döngü; iki kopyayı yarım faz kaydırın (float up) |
| `fx_sparkles` | Altın/beyaz pırıltı yıldızları | `fox_hero`, `fox_happy`, ödül ekranları | Tilkinin arkasında (veya önde düşük opaklık) | Twinkle: `opacity` 0.4 ↔ 1 ve `scale` 0.95 ↔ 1.05, 1.5 sn, iki kopya farklı fazda; çok yavaş `rotate` (±3°) |
| `fx_crystals` | Yüzen küçük mavi kristal kırıkları | `fox_craving` (kalkanla), dönüşüm anı | Kalkanla tilki arasında | Hafif süzülme: `translateY` ±6px 2.5 sn yoyo + `rotate` ±4° |

### Önerilen katman sırası (arkadan öne)
1. Arka plan (ör. `#1b1f24`)
2. Arka FX (`fx_breath_ring`, `fx_shield`, `fx_sparkles`)
3. Orta FX (`fx_bubbles`, `fx_crystals`)
4. Tilki (`fox_*`, konteynerin ~%60–68'i)
5. Ön FX (`fx_smoke`, isteğe bağlı yarı saydam `fx_shield` kopyası)

### Örnek (Reanimated – nefes halkası)
```tsx
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

const s = useSharedValue(0.85);
useEffect(() => {
  s.value = withRepeat(withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.sin) }), -1, true); // 4 sn al / 4 sn ver
}, []);
const ringStyle = useAnimatedStyle(() => ({ transform: [{ scale: s.value }], opacity: 0.7 + (s.value - 0.85) * 2 }));

<View style={{ width: 300, height: 300 }}>
  <Animated.Image source={require('./mascot/fx/fx_breath_ring.png')} style={[StyleSheet.absoluteFill, ringStyle]} />
  <Image source={require('./mascot/fx/fx_bubbles.png')} style={StyleSheet.absoluteFill} />
  <Image source={require('./mascot/fox/fox_calm.png')} style={{ position: 'absolute', width: '62%', height: '62%', left: '19%', top: '23%' }} />
</View>
```

### Örnek (kalkan dönüşü + nabız)
```tsx
const rot = useSharedValue(0), pulse = useSharedValue(1);
useEffect(() => {
  rot.value = withRepeat(withTiming(360, { duration: 20000, easing: Easing.linear }), -1);
  pulse.value = withRepeat(withTiming(1.04, { duration: 1200 }), -1, true);
}, []);
const shieldStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rot.value}deg` }, { scale: pulse.value }] }));
```

## Notlar
- Tilki dekupajı rembg (isnet-general-use) ile yapıldı; kenarlar beyaz zeminden arındırıldı (decontamination), kol-gövde arası beyaz cepler temizlendi.
- Kaynak görüntüler 1024 px idi; tilki içeriği ~750–850 px olduğundan @3x hafif (≈1.2–1.35×) Lanczos büyütme içerir. Telefon ekranlarında fark edilmez.
- Tüm efektler tek renkli/additive yapıdadır; koyu temada en iyi sonuç verir. Açık temada `opacity` artırılabilir.
- Animasyonlarda `useReducedMotion()` ile hareket azaltma tercihine saygı gösterin.
