# Uygulama ikonu + splash (tilki)

Kaynak çizim: `/workspace/mascot/fox/fox_idle@3x.png` (RGBA, 1024 px). Yalnızca kafa kullanıldı; çene hattından kesildi, kenarlar temizlendi (beyaz saçak yok). Ücretli servis yok, görsel üretimi yok; her şey yerelde Python/PIL ile yapıldı (`_work/`: `head.py` → `clean.py` → `build.py` → `preview.py`).
Kullanılmayanlar: `fox_sad_coal`, `fx_smoke`; ateş, duman, buhar ya da sigara yok; yazı ve isim yok.

## Dosyalar
| Dosya | Boyut | Not |
|---|---|---|
| `icon.png` | 1024×1024 RGB | iOS ve genel ikon. Alfa kanalı yok, köşeler kare, zemin kenara kadar dolu |
| `adaptive-foreground.png` | 1024×1024 RGBA | Tilki, 676 px'lik güvenli dairenin içinde (en uzak piksel r=337) |
| `adaptive-background.png` | 1024×1024 RGB | Terracotta radyal zemin, ortada hafif altın ışık |
| `adaptive-monochrome.png` | 1024×1024 RGBA | Beyaz siluet; gözler, burun ve ağız boşluk olarak bırakıldı (Android 13+ temalı ikon) |
| `splash-icon-light.png` / `splash-icon-dark.png` | 1024×1024 RGBA | Şeffaf, ortalı kafa. Android 12'nin daire maskesine sığar |
| `splash-light.png` / `splash-dark.png` | 1284×2778 RGB | Düz zemin üzerinde ortalı tilki (240 pt @3x). Mağaza ya da tasarım için; plugin bunları kullanmaz |
| `preview.png` | — | iOS (açık/koyu), Android maskeleri, temalı ikon, splash'ler. Maskeler yalnızca bu önizlemede |

## Renkler
- Zemin terracotta `#C84F2E`, kenara doğru `#8E3623`
- Işık: altın `#D9AC58` ailesi, sadece süs olarak (`#F0B060` yumuşak parıltı)
- Krem `#F3E3C3` (önizleme yazıları)
- Açık splash zemini `#F8F6F1` (spec: `bg/canvas` = cream/100)
- Koyu splash zemini `#14171B` (obsidian/950)

## app.json (Expo SDK 58)
Bu klasörü `assets/app-icon/` olarak kopyalayın, sonra `npx expo install expo-splash-screen` çalıştırın (paket şu an `package.json`'da yok; önerilen sürüm ~58.0.12).
Koyu splash'in görünmesi için `userInterfaceStyle` değeri `"automatic"` olmalı. Şu an `"light"`; böyle kalırsa `dark` bloğu kullanılmaz.

```json
{
  "expo": {
    "icon": "./assets/app-icon/icon.png",
    "userInterfaceStyle": "automatic",
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.example.smokingcessation",
      "icon": "./assets/app-icon/icon.png"
    },
    "android": {
      "package": "com.example.smokingcessation",
      "adaptiveIcon": {
        "foregroundImage": "./assets/app-icon/adaptive-foreground.png",
        "backgroundImage": "./assets/app-icon/adaptive-background.png",
        "backgroundColor": "#C84F2E",
        "monochromeImage": "./assets/app-icon/adaptive-monochrome.png"
      },
      "predictiveBackGestureEnabled": false
    },
    "plugins": [
      "expo-sqlite",
      "expo-router",
      "expo-secure-store",
      "expo-notifications",
      "@react-native-community/datetimepicker",
      "expo-sharing",
      [
        "expo-splash-screen",
        {
          "image": "./assets/app-icon/splash-icon-light.png",
          "backgroundColor": "#F8F6F1",
          "dark": {
            "image": "./assets/app-icon/splash-icon-dark.png",
            "backgroundColor": "#14171B"
          },
          "imageWidth": 240,
          "resizeMode": "contain"
        }
      ]
    ]
  }
}
```
Bu snippet yalnızca değişen alanları içerir; diğer alanlar (name, slug, scheme, web, experiments…) olduğu gibi kalır. Splash'i bir release build'de test edin: Expo Go ve dev build gerçek splash'i göstermez.
