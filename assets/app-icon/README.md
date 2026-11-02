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

## Ayarlar

Ayarların kaynağı `app.json` (`icon`, `android.adaptiveIcon` ve `expo-splash-screen` eklenti kaydı). Splash yalnızca release derlemede görünür; Expo Go ve geliştirme derlemeleri göstermez.
