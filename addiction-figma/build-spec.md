# Build spec — Sigarayı bırakma uygulaması · **rev 4** (2026-11-02)

> **Who this is for:** Kodcu, building in Expo / React Native.
> **Source of truth for rev 4:** the HTML mockups in `mock3/` (rendered to `rev3-*.png`) and `mock4/` (rendered to `rev4-*.png`; `s_path.py`, `s_tabs.py`, `layers_path.json`, `layers_tabs.json`), plus this file. Every value below is one that the mockups actually use (`mock3/lib.py`, `s_home.py`, `s_onb.py`, `s_dark.py`). Mascot and FX positions are machine-dumped into `mock3/layers_*.json`.
> **Figma is stale.** File `ZjSkenPoymNvS3c9SjKgVj` stops at rev 2. It still has `terracotta/600 = #C9502F` and the old Yuva/Sığınak frames. The Figma MCP monthly limit is used up, so rev 3 and rev 4 were not pushed there. **Where Figma and this file disagree, this file wins.**
> Backups: `src/build-spec.rev1.bak.md`, `src/build-spec.rev2.bak.md`, `src/build-spec.rev3.bak.md`.
> **Rev 4 sections are §13–§18 and §12b** (appended at the end). Earlier sections were edited where rev 4 changed them (marked *rev 4*).
> The repo (`SntrkUmut/addiction`) was **not modified**. Code facts below are read-only observations of `App.tsx` and `src/` @ `faa0e16`.

**Hard rules (unchanged, apply everywhere)**
- 1 check-in per day = **1 light**. Each completed coping session = **1 light** (`src/domain/rewards.ts → earnedLight`).
- A slip **never** punishes, relocks or resets anything: lights, pieces, path nodes, journey days and milestones are untouched. Slip variants only change words, never visuals.
- The shield, crystal, gem and sparkle FX are **decoration only**. They carry no game meaning (no HP, no streak, no "breaks").
- No medical or clinical claims. The mascot has **no name**.
- Haptics: **allowed, light and purposeful** (*rev 4*, see §13). Never on slips or errors. One per moment. Respect the in-app toggle, reduce motion and system settings.
- Day counts are **journey days** since `quitDate`; nothing resets on a slip (*rev 4*, §14).

---

## Changelog rev 4

| # | Change | Where |
|---|---|---|
| 1 | **All rev 3 NEW strings approved.** The "NEW" flags from rev 3 now read "approved (rev 4)". Only strings added in rev 4 are flagged **NEW**. | §9 |
| 2 | **Haptics allowed again** (this overrides rev 3 changelog item 8, §8.1 and the milestone/Nefes notes). The 3 existing calls stay. Light haptics are proposed for check-in, earning a light, piece unlock, milestone reveal, the Nefes al/ver switch and the Bölüm 2 transition. There is an in-app toggle in Ben. | §8.1, §13 |
| 3 | **Reset-on-slip counter removed.** Journey days (since `quitDate`, never reset) are used everywhere. The code and string changes are listed. | §14 |
| 4 | **Milestones ("seen") sync to the cloud** via a new optional `milestones` field in the snapshot JSON. The concrete migration is proposed, **not run**. The local-only key `quit-milestones-seen-v1` from rev 3 is dropped, with a one-time import. | §15, §5.9, §10 |
| 5 | **Bölüm 2 · Bahçe:** 6 new pieces at 14–24 lights; a celebration screen, a handoff screen and the Sığınak path in Bölüm 2. | §16 |
| 6 | **Milestone stops** (Gün 1/7/14/30) on the Sığınak path and in Rotam. | §5.2, §17 |
| 7 | **Rotam and Ben tabs** designed in the merged language, built from what those tabs contain in the code today. | §17, §18 |
| 8 | Next-node ring: **honest 1/2** (rev 3 open question 6 resolved in the mockups; the tooltip says "1 ışık kaldı"). | §5.2 |
| 9 | **Endless Sığınak.** There is no last chapter and no "Sığınak tamamlandı". Chapters of 12 lights (roadmap for 8 chapters), and the next chapter always waits in **fog**. | §19.1, §19.2 |
| 10 | **Loops outside chapters:** weekly goals, collections (crystals, fox accessories, decor), seasonal events, personalizing, and endless day milestones (Gün 60/90/180/365…). Decoration only; no currency; lights are never spent. | §19.3 |
| 11 | **Remote content manifest** in Supabase (`content_manifests` table + `content` Storage bucket; proposal, **not applied**), with a JSON Schema, an example, caching, an offline bundle and versioning. | §19.4, §19.5 |
| 12 | **"End of current content" waiting state** (countdown, banked lights, things to do meanwhile) instead of "finished". | §19.6 |

New mockups (390 × 844 @2x, generator `mock4/`: `s_path.py`, `s_tabs.py`, `s_endless.py`, `fog.py`): `rev4-siginak` (auto-scrolled path + fogged Bölüm 2 teaser), `rev4-siginak-taslar` (top of the path, milestone stops), `rev4-icerik-sonu`, `rev4-koleksiyon`, `rev4-bolum2-1-tamam`, `rev4-bolum2-2-bahce`, `rev4-siginak-bolum2`, `rev4-rotam`, `rev4-rotam-kayitlar`, `rev4-rotam-hesap`, `rev4-ben`, `rev4-ben-2`, `rev4-ben-bulut`, and `rev4-overview.png`.

---

## Changelog rev 3

| # | Change | Where |
|---|---|---|
| 1 | **Action color #C84F2E** replaces #C9502F everywhere (white label 4.55:1, which passes AA for 16 pt ExtraBold). Hard button shadow stays **#8E3623** (it still reads as a darker edge; no change needed). Pressed fill is #A5412B. | §1, all mockups |
| 2 | **Merged visual language.** Yuva = Concept A (Yaşayan Yuva) and Sığınak = Concept B (yol / path). Both, plus every other screen, now share one *world*: the same sky + horizon scene, the same light token, the same ring, cards, 3D pill buttons and motion. Day scene on light screens, night scene on focus and celebration screens. | §4, §5 |
| 3 | Yuva and Sığınak rebuilt (supersedes rev 1 frames 02/05 and both rev 2 concepts). | §5.1, §5.2 |
| 4 | **NEW milestone screens** Gün 1 / 7 / 14 with after-slip variants, built on the Gün 30 layout. Gün 30 and 06b copy kept verbatim as approved. | §5.9, §9 |
| 5 | **07 Craving-end flow** drawn: 07a the light floats into today's ring, then 07b "İstek şimdi nasıl?" chips plus an optional "new piece" card. | §5.8 |
| 6 | **Onboarding** redrawn in the new language. 6 frames; the pack-price step (Adım 2) is specified in full, including skip behavior. | §5.3 |
| 7 | İstek and Nefes (al / ver) adapted to the night scene. | §5.6, §5.7 |
| 8 | Haptics: none. This includes the Gün 30 entrance (rev 2 had proposed one success haptic; **removed**). *Superseded by Changelog rev 4 #2.* | §7, §8 |
| 9 | Contrast fixes found in rev 3 review: "+1" labels use text/secondary (gold text failed at 3.52:1); text sitting on the top of the day sky uses text/primary (secondary is 4.37:1 on #FBE3D6). | §1 |

---

## 1. Color tokens

Define the primitives once in `src/theme/colors.ts` and point semantic names at them.

### Primitives
| Token | Hex | Token | Hex |
|---|---|---|---|
| cream/50 | `#FFFEFC` | obsidian/950 | `#14171B` |
| cream/100 | `#F8F6F1` | obsidian/900 | `#1B1F24` |
| cream/200 | `#F2F1EB` | obsidian/800 | `#202B37` |
| cream/300 | `#EAE4DC` | obsidian/700 | `#2C3440` |
| terracotta/50 | `#FDF0EC` | obsidian/600 | `#3A4350` |
| terracotta/100 | `#FCEBE3` | ink/900 | `#202522` |
| terracotta/150 *(rev 3, sky top)* | `#FBE3D6` | neutral/500 | `#666C66` |
| terracotta/200 | `#F7E9E2` | neutral/400 | `#A4A79F` |
| terracotta/300 | `#F0DDD2` | neutral/200 | `#C9C3B8` |
| terracotta/350 *(rev 3, inner hill)* | `#EAD0C2` | gold/100 | `#F7F0DC` |
| **terracotta/600 (rev 3)** | **`#C84F2E`** (was `#C9502F`) | gold/500 | `#D9AC58` |
| terracotta/700 | `#A5412B` | gold/600 *(rev 3)* | `#B98A2E` |
| terracotta/800 *(shadow)* | `#8E3623` | gold/700 *(rev 3)* | `#A9822F` |
| teal/100 | `#E3F7F5` | teal/400 | `#5ED6CF` |
| teal/700 *(rev 3)* | `#2E7F7A` | white | `#FFFFFF` |

### Semantic
| Token | → Primitive | Hex | Use |
|---|---|---|---|
| bg/canvas | cream/100 | `#F8F6F1` | Light screens, bottom sheets |
| bg/dark | obsidian/900 | `#1B1F24` | Under every night scene |
| surface/card | cream/50 | `#FFFEFC` | Cards, tab bar, chips |
| surface/sunken | cream/200 | `#F2F1EB` | Inputs, progress tracks |
| surface/hero | terracotta/100 | `#FCEBE3` | Active tab pill, feature tiles, accent icon tiles |
| surface/reward-soft | gold/100 | `#F7F0DC` | Light token disc, done quest row, "new piece" card |
| surface/calm-soft | teal/100 | `#E3F7F5` | Teal icon tiles (breath, water) |
| surface/glass-dark | white @ 10% | — | Chips, today card and secondary buttons on night scenes |
| border/default | cream/300 | `#EAE4DC` | 1 pt card strokes |
| border/accent | terracotta/300 | `#F0DDD2` | Chips (feeling chips, "Bugün başlamak istiyorum"), path dots |
| border/glass-dark | white @ 22% | — | 1.5 pt stroke on dark secondary buttons |
| text/primary | ink/900 | `#202522` | Also used for any text on the upper day sky |
| text/secondary | neutral/500 | `#666C66` | canvas 4.98, card 5.34, hero 4.65, urge 4.54, sunken 4.76, reward-soft 4.73. **Not on** terracotta/300 (4.10) or the sky top `#FBE3D6` (4.37). |
| text/accent | terracotta/700 | `#A5412B` | Eyebrows, text links, active tab (5.73 on canvas) |
| text/on-accent | white | `#FFFFFF` | Primary button label (**4.55:1** on #C84F2E) |
| text/on-dark | cream/50 | `#FFFEFC` | 12.46 on obsidian/700 |
| text/on-dark-muted | neutral/200 | `#C9C3B8` | 9.45 on bg/dark |
| action/primary | terracotta/600 | **`#C84F2E`** | Primary buttons, done path nodes |
| action/primary-pressed | terracotta/700 | `#A5412B` | Pressed fill |
| action/primary-edge | terracotta/800 | `#8E3623` | Hard 3D edge under primary buttons and done nodes |
| action/secondary | cream/200 | `#F2F1EB` | Secondary button on light |
| accent/gold | gold/500 | `#D9AC58` | Light progress (rings, bars, trails), milestone eyebrow (7.88 on bg/dark) |
| accent/gold-deep | gold/600 | `#B98A2E` | Sparkle glyph inside the light token; next-node icon. Decorative only (2.74 on gold/100). |
| accent/gold-edge | gold/700 | `#A9822F` | 1 pt stroke on the "+1 ışık" pill on dark. **Not for text on light** (3.52). |
| accent/teal | teal/400 | `#5ED6CF` | Nefes cue and timer arc (9.46 on bg/dark) |
| accent/teal-deep | teal/700 | `#2E7F7A` | Glyphs on teal tiles |

### Effects
- **shadow/button (3D edge):** y 4, blur 0, `#8E3623` 100%. RN: wrap the button in a View with `backgroundColor:'#8E3623'`, `borderRadius:999`, `paddingBottom:4`. On press, translateY the face by +4 and drop the padding (80 ms).
- **shadow/node:** the same idea on path nodes: y 6, blur 0 (done `#8E3623`; next gold/700 `#A9822F`; locked `#D6CEC2`).
- **shadow/float:** y 6, blur 18, `#5C3824` at 8–10 %. Only on floating cards over the scene (speech bubble, Sığınak unit card).
- **glow/gold:** a radial gradient circle, `rgba(217,172,88,.38)` at the center → 0 at 68–70 %. Use `react-native-svg` `RadialGradient`, or a pre-rendered PNG.

## 2. Typography

Nunito via `npx expo install @expo-google-fonts/nunito expo-font`. Load 400/600/700/800/900 and use `fontFamily` per weight (`Nunito_800ExtraBold`), not `fontWeight`. Keep the splash screen up until the fonts load. Turkish casing: always uppercase with `toLocaleUpperCase('tr-TR')` (İ, I).

| Style | Family | Size / LH | Tracking (pt) | Used for |
|---|---|---|---|---|
| display/xl | Nunito_900Black | 48 / 52 | −0.96 | Milestone number "7 gün" |
| display/lg | Nunito_800ExtraBold | 32 / 38 | −0.48 | Welcome title |
| title/lg | Nunito_800ExtraBold | 26 / 32 | −0.26 | Screen titles, "Küçük adımların", "Sığınağın" |
| title/md | Nunito_800ExtraBold | 22 / 28 | −0.11 | Nefes cue, stat values, input values |
| title/sm | Nunito_700Bold | 17 / 22 | 0 | Row titles, milestone lead |
| body/lg | Nunito_400Regular | 16 / 24 | 0 | Milestone body |
| body/md | Nunito_400Regular | 14 / 20 | 0 | Descriptions |
| sm-strong | Nunito_600SemiBold (800 for values) | 13 / 18 | 0 | Chip labels, summary values |
| label/button | Nunito_800ExtraBold | 16 / 20 | 0 | Buttons |
| label/textbutton | Nunito_800ExtraBold | 15 / 20 | 0 | "Şimdi değil", "Bu adımı atla" |
| eyebrow | Nunito_800ExtraBold | 11 / 14 | +0.88, uppercase | Eyebrows |
| caption | Nunito_600SemiBold | 12 / 16 | 0 | Meta, tab labels (tab labels 11/14 Bold) |
| numeric/timer | Nunito_900Black | 56 / 60 | −1.12, `tabular-nums` | "02:48" |

`maxFontSizeMultiplier` ≈ 1.4 on display/title styles.

## 3. Spacing, radii, touch targets
- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40. Screen side padding is **20** (milestones **24**).
- Radii: small stat tile 12; icon tile 14; input / note / tooltip 12–16; row card 20; card **24**; bottom sheet top corners **32**; pill 999.
- Heights: primary button **56** (+4 edge); dark/secondary button **52**; chip **36**; feeling chip **48**; quest row **68**; tool row **68**; input **64**; text button **44**; close button **44 × 44**; tab bar **84**.

## 4. The merged language (shared components)

The idea: **one small world that changes light, not place.** Yuva, Sığınak and onboarding happen in the warm *day* version of the world. İstek, Nefes, the end of the craving flow and milestones happen in the *night* version: calmer, focused, with sparkles. The same objects show up everywhere: the **light token** (what you earn), the **ring** (today / progress), the **3D pill button** (what you do), and the **sheet** (where the details sit).

| Component | Spec (from `mock3/lib.py`) |
|---|---|
| **Scene / day** | Full-width block, height per screen. Sky `linear-gradient(180°, #FBE3D6 0%, #FCEBE3 55%, #F7E9E2 100%)`. Horizon hill: ellipse 550 × 260 at x −80, y = `horizonY`, fill #F0DDD2. Inner hill: ellipse 290 × 54 at x 50, y = horizonY + 22, #EAD0C2 at 75 %. Optional `fx_sparkles` layer. Sığınak fades the bottom of its scene out (mask from 70 % to 100 %). |
| **Scene / night** | Same geometry. Sky `linear-gradient(180°, #14171B, #1B1F24 55%, #202B37)`; hill obsidian/700, inner hill obsidian/600 at 75 %. bg/dark behind it. |
| **Sheet** | bg/canvas, top radius 32, padding 22–24 / 20. It overlaps the scene's horizon. |
| **Card** | surface/card, 1 pt border/default, radius 24 (large cards); rows inside sheets (quest rows, stat cards) use radius 20. |
| **Light token (ışık)** | Circle `size` (16 / 24 / 28 / 44), fill gold/100, 1.5 pt ring gold/500 (no ring at 16), Phosphor `Sparkle` **fill** at 62 % of size in gold/600. It is the *only* symbol for a light: chips, "+1", tooltips, the floating light in 07. |
| **Light chip** | Height 36, pill, left padding 6, gap 6: token 24 + "N ışık" (sm-strong 800). Day: white @ 92 % with text/primary; night: glass-dark with text/on-dark. |
| **Day chip** | Same chip, left padding 10: Phosphor `Path` 18 (text/accent; on dark text/on-dark) + "N. gün". |
| **Ring** | SVG circle, `stroke-linecap: round`, starting at 12 o'clock. Gold/500 arc on a track (cream/200 on light, obsidian/600 on dark). Uses: today's lights (48 pt, stroke 6, label "1/2"); today card on dark (40 pt, stroke 5); next path node (84 pt, stroke 6); Nefes timer (300 pt, stroke 6, **teal** arc on obsidian/700, the only non-gold ring). |
| **Primary button** | 56 h pill, action/primary, label/button white, 3D edge #8E3623. Optional trailing icon 20 (e.g. `ArrowRight`), gap 10. |
| **Dark secondary button** | 52 h pill, glass-dark fill, 1.5 pt border/glass-dark, label text/on-dark. |
| **Text button** | 44 h, label/textbutton, text/accent (on light), or text/secondary for "Şimdi değil". |
| **Close button** | 44 circle, obsidian/700, Phosphor `X` 22 on-dark. |
| **Path node** | 68 circle with a hard 6 pt bottom edge. Done: action/primary, white glyph 30, edge #8E3623. Next: surface/reward-soft, 3 pt gold/500 border, gold/600 glyph, edge gold/700, wrapped in a gold ring 84 (fraction = progress to the next piece). Locked: cream/300 `#EAE4DC`, `LockSimple` 26 in `#8A8F88`, edge `#D6CEC2`. Dots between nodes: 4 pt round dotted stroke #F0DDD2. |
| **Tab bar** | 84 h, surface/card, top border. Tabs: Yuva `House`, Sığınak `Tent`, Rotam `Path`, Ben `UserCircle`, 24 pt. Active: **fill** weight in text/accent on a 56 × 30 surface/hero pill; inactive regular text/secondary. Labels 11/14 Bold. |
| **Status bar** | Use the system bar (`expo-status-bar`): `dark` on day screens, `light` on night screens. |

## 4a. Icons — Phosphor (`phosphor-react-native` + `react-native-svg`)

Default size 24, weight regular; **fill** = active or done. All icons are decorative (`accessible={false}`); labels carry meaning.

| Usage | Icon | Weight / size / color |
|---|---|---|
| Tabs | `House`, `Tent`, `Path`, `UserCircle` | regular / fill active, 24 |
| Light token | `Sparkle` | fill, 62 % of token, gold/600 |
| Day chip | `Path` | regular 18, text/accent (dark: on-dark) |
| Quest: check-in done | `CheckCircle` | fill 24, gold/600, on a white 44 tile |
| Quest: check-in pending | `CalendarCheck` | regular 24, text/accent, surface/hero tile |
| Quest: support session | `Wind` | regular 24, teal/700 on surface/calm-soft tile |
| Stat: içilmeyen | `Prohibit` | regular 20, text/accent on a 36 accent-soft tile |
| Stat: cebinde kalan | `Coins` | regular 20, text/accent on a 36 accent-soft tile |
| Craving button | `Waves` | regular 22, white |
| Sığınak nodes | `HouseSimple`, `Lamp`, `Armchair`, `GridFour`, `Plant`, `Books` | regular 30 (white when done, gold/600 when next) |
| Locked node | `LockSimple` | regular 26, `#8A8F88` |
| Slip reassurance note | `Heart` | regular 18, text/accent |
| Onboarding: back | `CaretLeft` | regular 20, text/primary |
| Welcome features | `Lifebuoy`, `Tent`, `Path` | regular 22, text/accent on surface/hero |
| Spending example | `Coins` | regular 18, gold/600 |
| Quit date field | `CalendarCheck` | regular 22, text/accent |
| "Bugün başlamak istiyorum" | `Check` | regular 18, text/accent |
| Tools | `Wind` (teal), `PersonSimpleWalk` (accent), `Drop` (teal), `Heart` (accent) | regular 24 on 44 tiles |
| Close | `X` | regular 22 on-dark |
| "Sığınağı gör →" | `ArrowRight` | regular 20, white |
| New-piece card | `GridFour` (or the unlocked piece's icon) + `CaretRight` | 24 gold/600; chevron 20 text/secondary |

## 5. Per-screen layout

Frame 390 × 844 pt. Coordinates are (x, y) from the top-left. Mockups: `/workspace/addiction-figma/rev3-*.png` (2× renders).

### 5.1 Yuva — `rev3-yuva.png`, `rev3-yuva-paket-yok.png` (Concept A in the merged language)
1. Day scene, h 380, horizonY 268, sparkles (55, 96) w 280 @ 50 %.
2. Top row at y 54, x 20 → 370, space-between: **day chip** "12. gün" · **light chip** "7 ışık".
3. Speech bubble (surface/card, radius 20/20/20/6 with the tail corner bottom-left, padding 11/14, shadow/float, sm-strong, width 190) at (22, 104): "Bugün nasıl gidiyor? Kısa bir check-in yeter."
4. Mascot `fox_idle` (100, 118) w 200.
5. Sheet from y 340 (radius 32, padding 20) with:
   - Header row: eyebrow "BUGÜN" (text/accent) over title/lg "Küçük adımların" · **ring 48** (today's lights, label "1/2").
   - Quest row 1 (68 h, radius 20, padding 12/14, tile 44 radius 14): done → surface/reward-soft, `CheckCircle` fill; title "Günlük check-in", sub "Bugünün ışığı yandı"; right side "+1" (caption 800, text/secondary) + light token 28. Pending state: card white, `CalendarCheck`, sub "Bugünün ışığını yak" **NEW**, whole row tappable → check-in sheet (existing).
   - Quest row 2: `Wind` teal tile; "Bir destek oturumu" / "Her oturum 1 ışık"; "+1" + token (ring faded while 0 today). Tap → İstek.
   - Stats row (2 cards, 64 h, radius 20, flex 1, `minWidth:0`, gap 10; tile 36 radius 12 surface/accent-soft `#FDF0EC`, icon 20): `Prohibit` "168" / "içilmeyen"; `Coins` "₺840" / "cebinde kalan". *No package data* (`rev3-yuva-paket-yok`): "—" / "Paketi ekle" (text/accent); tap → plan editing at the spending step.
   - Primary button "Şu an bir istek var" with `Waves`.
6. Tab bar, Yuva active.
- Ring rule: `todayLights = (checkedInToday ? 1 : 0) + copingSessionsToday`; the ring shows `min(todayLights, 2) / 2`. Extra sessions still add lights; the ring just stays full.

### 5.2 Sığınak — `rev3-siginak.png` (Concept B path) · *rev 4: superseded in layout by `rev4-siginak.png` (milestone stops, §17.1) and `rev4-siginak-bolum2.png` (§16); the component values below still apply*
1. bg/canvas full screen, then day scene h 250 (horizonY 176, sparkles (70, 10) w 260 @ 45 %, fade bottom).
2. Title/lg "Sığınağın" at (20, 54) · light chip right. Caption (text/primary) at y 92: "Her 2 ışık yolda yeni bir durak açar."
3. Unit card (card + shadow/float, padding 14/16) at y 120, x 20–370: eyebrow "BÖLÜM 1 · TEMEL", title/sm 800 "Sığınağın ilk odası", right "3 / 6 parça", gold progress bar 8 pt at 50 %.
4. Path: node centers at (204, 246) done `HouseSimple`, (130, 334) done `Lamp`, (104, 422) done `Armchair`, (186, 512) **next** `GridFour` (ring 84 at 7/8), (272, 612) locked. Labels in caption text/secondary next to nodes: "Sığınak temeli" (right), "Sıcak ışıklar" (left, right-aligned in a 88 pt box), "Dinlenme köşesi" (right), "Yeşil köşe" (right, text/tertiary). Tooltip above the next node (ink/900 fill, radius 12, padding 5/10/5/5, white caption, light token 20 without ring): "Pencere · 1 ışık kaldı" at (140, 472).
5. Mascot `fox_happy` (252, 494) w 116, next to the next node.
6. Note card (surface/sunken, radius 16, padding 10/14) at y 696: `Heart` 18 + "Kayma yolu geri sarmaz; açtığın duraklar hep yerinde kalır."
7. Tab bar, Sığınak active.
- Data: `pieces = ['Sığınak temeli','Sıcak ışıklar','Dinlenme köşesi','Pencere','Yeşil köşe','Kitaplık']`, `builtPieces = min(6, floor(lights / 2))`, `nextThreshold = min(12, (builtPieces + 1) * 2)` (all already in `App.tsx`). Node *i* is done if `i < builtPieces`, next if `i === builtPieces`, otherwise locked. Ring fraction on the next node = `(lights − 2·builtPieces) / 2`; the mockup shows 7/8 as a visual proposal of "almost". **Build it as 1/2 for 7 lights** (*rev 4: decided; the rev 4 mockups show 1/2*). Scroll vertically; auto-scroll so the next node sits at about 60 % of the viewport.

### 5.3 Onboarding — `rev3-onb-0…5.png` (6 frames)
Shared frame (steps 1–5):
- Day scene h 270, horizonY 190, sparkles (110, 100) w 170 @ 45 %.
- Header y 50: back (`CaretLeft` + "Geri") left; eyebrow "ADIM n / 5" in **text/primary** right. Progress bar y 98, x 20–370, 8 pt, white @ 70 % track, gold fill n/5.
- Mascot in the scene (see §6). Sheet from y 236 with eyebrow (text/accent) / title/lg / body-md secondary / content card.
- Footer pinned bottom 30: primary button; optional text button; caption hint (text/secondary, centered).

| Step | Content | Footer |
|---|---|---|
| 0 Hoş geldin | Scene h 400 (horizonY 300). Eyebrow centered y 62 "YENİ BİR BAŞLANGIÇ". `fox_wave` (95, 96) w 200. Sheet y 330: display/lg "Bırakma yolun\nsana ait.", body, 3 feature rows (44 tile + title/sm + caption). | "Küçük adımlarla başla"; hint "Hesap açman gerekmez. Planın önce bu cihazda saklanır." |
| 1 Günlük sigara | Input "GÜNLÜK ORTALAMA" with value "14" and unit "sigara / gün"; helper caption. Numeric keypad. | "Devam et" · "Bu alanı daha sonra doldur" |
| **2 Paket fiyatı** | Input "PAKET FİYATI" with prefix "₺" (currency fixed to `TRY`), placeholder "Örn. 100", decimal keypad. Input "PAKETTE KAÇ SİGARA VAR?" (half width) unit "adet", placeholder "Örn. 20". Live example strip (surface/reward-soft, `Coins`): **NEW** "Örnek: günde {cpd} sigarayla haftada yaklaşık ₺{weekly}". Hide the strip until all three values (cpd, price, size) are > 0. | "Devam et" · "Bu adımı atla" |
| 3 Bırakma günü | Field "BAŞLANGIÇ TARİHİ" (date, `CalendarCheck`) + outline chip "Bugün başlamak istiyorum". | "Devam et" |
| 4 Kendi nedenin | Multiline 104 h on surface/sunken; placeholder "Örneğin: Daha özgür hissetmek…"; caption "İsteğe bağlı · en fazla 240 karakter". | "Devam et" · "Bu adımı atla" |
| 5 Özet | Card with rows "Günlük ortalama", "Bırakma günü", "Tasarruf hesabı" (value "₺100 / 20 adet", or "Şimdilik eklenmedi" if skipped); disclaimer caption below. | "Planımı oluştur"; hint "Planın bu cihazda saklanır. Hesap ve bulut eşitlemesi isteğe bağlıdır." |

**Pack price step: data and skip behavior (decision 3).**
- The money stat needs exactly what the code already stores: `cigarettesPerDay` (step 1), `packPrice` and `packSize` (step 2), `currency: 'TRY'` (fixed default, no picker), and `quitDate` (step 3). Nothing new is added to `Profile` (`src/data/schema.ts` already validates all of these).
- Validation (as in the code today): both pack fields or neither. A value of 0 means "not set". `packPrice` ≤ 10 000 000, `packSize` 1–100.
- Formula (existing): `avoided = floor(daysSince(quitDate) · cigarettesPerDay) − slipsSincePlan`; `saved = avoided · packPrice / packSize`. Format with `Intl.NumberFormat('tr-TR', {style:'currency', currency:'TRY', maximumFractionDigits:0})`.
- **If skipped:** `savedEstimate = null`. Yuva's stat card shows "—" with the link "Paketi ekle" (**NEW**, a shorter form of the existing "Paket bilgisini eklersen hesaplanır", which still fits in the Progress/Rotam view). Tapping opens plan editing at step 2. The summary row shows "Şimdilik eklenmedi". Nothing else changes; no nagging and no badge.
- If step 1 was skipped, "içilmeyen" also shows "—" (existing behavior), and the step 2 example strip stays hidden.

### 5.4 Check-in
Unchanged functionally (existing mood sheet: "Şu an nasıl hissediyorsun?" İyi / Karışık / Zor). Restyle it as a canvas sheet (radius 32) with 48 h feeling chips. On save, run the **light float** from the sheet to the Yuva ring (§7).

### 5.5 (removed) — rev 1 "Progress" is now the Rotam tab; not part of rev 3.

### 5.6 İstek — `rev3-istek.png`
1. bg/dark + night scene h 330 (horizonY 250, sparkles (40, 40) w 310 @ 35 %).
2. Top row y 52: close button · light chip (dark).
3. Shield stage (§6): fox_craving inside the shield.
4. Sheet from y 296: title/lg "Şu an bir sonraki küçük adımı seç.", body-md secondary, 4 tool rows (68 h, gap 8): tile 44 · title/sm + caption detail (1 line, ellipsis) · right column "N dk" (caption secondary) over "+1" + token 16. Then text button "Şimdi değil" (text/secondary).

### 5.7 Nefes — `rev3-nefes-al.png`, `rev3-nefes-ver.png`
1. bg/dark + night scene full height (horizonY 710).
2. Top row y 52: close · eyebrow "YAVAŞ NEFES" centered (on-dark-muted) · 44 spacer.
3. title/lg "Sadece bu ana odaklan." centered at y 108.
4. Stage 300 × 300 at (45, 160): timer **ring** (teal arc, elapsed fraction) → `fx_breath_ring` + `fx_bubbles` (scale 1.0 on inhale, 0.85 on exhale) → `fox_calm` (125, 230) w 140.
5. Cue title/md teal at y 482: "Nefes al" / "Nefes ver" (crossfade).
6. Timer "02:48" numeric/timer on-dark at y 520 + caption "kendine ayırdığın süre".
7. Body at y 608 (on-dark-muted, centered): "Rahat ettiğin bir ritimde nefes al. Saymak zorunda değilsin; istediğin an durabilirsin."
8. Bottom 34: primary "Bu adımı tamamladım"; dark secondary "Başka bir araç seç".
- Haptic (*rev 4*): `impactAsync(Soft)` (fallback Light) at each al/ver switch; off with reduce motion or the toggle (§13).
- Other tools use the same frame with the tool's title as the eyebrow and `selected.detail` (or the user's reason) as the body; no breath ring and no cue; fox_calm at w 180 centered.

### 5.8 07 · End of the craving flow — `rev3-07a-isik.png`, `rev3-07b-istek-nasil.png`
Triggered by "Bu adımı tamamladım". `completeCoping()` writes a `coping` event, which gives **+1 light**.
- **07a (moment, ~1.6 s, no controls; tap anywhere to skip):** bg/dark + night scene full (horizonY 660, sparkles (10, 120) w 370 @ 70 %). **Today card** (glass pill: ring 40 "2/2" + "Bugünün ışıkları" / "8 ışık") centered at y 56. Gold glow 200 at (95, 240); `fox_cheer` (80, 220) w 230. Light token 44 with a gold glow travels along a curve from the fox (200, 300) to the today ring (156, 82); the mockup freezes it mid-flight at (236, 150) with a "+1 ışık" pill. title/lg centered y 500 "Bu an için kendine alan açtın."; body y 574: "Işığın bugünün halkasına eklendi." **NEW**.
- **07b (question):** night scene h 380 (horizonY 300). Today card at y 56; glow 160 + `fox_cheer` (110, 122) w 170. Sheet from y 330: title/lg "Bu an için kendine alan açtın.", title/sm secondary "İstek şimdi nasıl?", 3 feeling chips (48 h, flex 1, gap 8): "Azaldı" / "Aynı" / "Geri geldi". Each writes an `urge_result` event (existing) and does **not** give a light. Optional card if this light unlocked a piece (`floor(after/2) > floor(before/2)` and before < 12): surface/reward-soft, node icon in a gold-ringed white circle, "Yeni parça açıldı: Pencere" **NEW** / "Sığınağında seni bekliyor." **NEW**, chevron → Sığınak. Bottom: primary "Ana ekrana dön".
- Choosing a chip highlights it (fill surface/hero, border text/accent); it does not auto-close.

### 5.9 Milestones — `rev3-gun{1,7,14,30}[-kayma].png`
Shared layout (the Gün 30 layout from rev 2):
1. bg/dark + night scene full (horizonY 700).
2. Top row y 52: close · day chip (dark) "N. gün".
3. Stage 350 at (20, 103): gold glow → `fx_sparkles` 100 % → fox (76, 173) w 238 → `fx_sparkles` 35 % (front).
4. Text column (x 24–366, starts y 457, gap 6, centered): eyebrow gold, display/xl on-dark, title/sm on-dark lead, body/lg on-dark-muted.
5. Bottom 34, gap 10: primary "Sığınağı gör" + `ArrowRight`; dark secondary "Ana ekrana dön".
- Poses: Gün 1 `fox_wave`, Gün 7 `fox_happy`, Gün 14 `fox_cheer`, Gün 30 `fox_hero`. The **same pose and the same FX** are used in the slip variant (no sad pose, no dimming).
- Trigger: `journeyDay = floor((startOfDay(now) − startOfDay(quitDate)) / 1 day)`. It is **never reset by a slip**. Show the milestone once, on the first app open on or after the day it is reached, when `journeyDay ∈ {1, 7, 14, 30}` and that day has not been shown yet. If the app is opened late (e.g. day 9), show only the latest unseen milestone (7). Variant: `hasLoggedSlip` (any `slip` event since `quitDate`) → `-kayma` copy.
- Milestones give **no lights** and unlock nothing; they are recognition only.
- Data (*rev 4*): seen state is stored in the synced snapshot field `milestones.seen` with keys `day-1|day-7|day-14|day-30` (§15). The rev 3 local key `quit-milestones-seen-v1` is **dropped** (imported once if present).
- Haptic (*rev 4*): `notificationAsync(Success)` at the end of the count-up, for both variants (§13).
- Milestones also appear as stops on the path and in Rotam (§17).
- Copy: §9.

## 6. Mascot and FX placement (from `layers_*.json`)

All PNGs are square, transparent and share one canvas, so layered images line up when given the same box. Use `assets/mascot/{fox,fx}/*@2x.png` (683 px) or `@3x`, with `resizeMode="contain"`. Order = draw order (back → front).

| Screen | Layers (x, y, width · opacity) | Mascot scale |
|---|---|---|
| Yuva | fx_sparkles (55, 96) 280 · 50 % (in scene) → fox_idle (100, 118) 200 | 200 / 390 = 51 % of width |
| Sığınak | fx_sparkles (70, 10) 260 · 45 % → fox_happy (252, 494) 116 | 30 % |
| Onb 0 | fx_sparkles (60, 70) 270 · 50 % → fox_wave (95, 96) 200 | 51 % |
| Onb 1 | sparkles (110, 100) 170 · 45 % → fox_idle (135, 112) 120 | 31 % |
| Onb 2 | → fox_happy (135, 108) 124 | 32 % |
| Onb 3 | → fox_calm (135, 110) 120 | 31 % |
| Onb 4 | → fox_wave (135, 108) 124 | 32 % |
| Onb 5 | sparkles (70, 40) 250 · 60 % → fox_cheer (130, 104) 130 | 33 % |
| İstek | fx_shield (85, 60) 220 · 95 % → fx_crystals (70, 120) 250 · 80 % → fox_craving (125, 100) 140 → fx_shield (85, 60) 220 · **35 %** (front) | 36 % |
| Nefes al | timer ring 300 (45, 160) → fx_breath_ring (59, 174) 272 · 100 % → fx_bubbles (59, 174) 272 · 55 % → fox_calm (125, 230) 140 | 36 % |
| Nefes ver | fx_breath_ring (80, 194) 231 · 80 % → fx_bubbles 231 · 35 % → fox_calm (125, 230) 140 | 36 % |
| 07a | fx_sparkles (10, 120) 370 · 70 % → glow 200 (95, 240) → fox_cheer (80, 220) 230 → trail + light token 44 | 59 % |
| 07b | sparkles (40, 90) 310 · 55 % → glow 160 (115, 140) → fox_cheer (110, 122) 170 | 44 % |
| Milestones | glow 350 (20, 103) → fx_sparkles (20, 103) 350 · 100 % → fox (76, 173) 238 → fx_sparkles 350 · 35 % | 61 % |

- `fx_smoke` is **not used** in rev 3 (it could read as cigarette smoke).
- Effect layering rule: back FX → glow → fox → front FX at 35 %. Never put FX over text.
- Accessibility: the fox and FX are `accessible={false}`; screens get a single `accessibilityLabel` on the title.

## 7. Motion (proposals) — Reanimated 3

| Motion | Spec | Reduced motion |
|---|---|---|
| **Light float** (shared) | Token 44 scales 0.6 → 1 (150 ms), travels a quadratic Bezier from the source (tool card / check-in sheet / fox) to the target (today ring, light chip or path node) over **700 ms** `Easing.inOut(Easing.cubic)`, scales to 0.5 at the end; target ring arc animates +1/2 (400 ms) and the light chip count ticks +1 with a 1.0 → 1.12 → 1.0 pop (240 ms). | Token fades in at the target (200 ms); counters update without a pop. |
| Fox enter | translateY 16 → 0 + opacity 0 → 1, 360 ms `Easing.out(Easing.back(1.4))`. | Opacity only. |
| Fox idle | translateY 0 ↔ −4, 2.4 s, sin in-out, loop. | Off. |
| Sparkles twinkle | Back/front copies: opacity 0.4 ↔ 1 and scale 0.95 ↔ 1.05, 1.5 s yoyo, half a phase apart. | Static at the listed opacity. |
| Nefes | Inhale 4 s (ring scale 0.85 → 1.0, bubbles opacity 0.35 → 0.55), exhale 4 s (reverse), `Easing.inOut(Easing.sin)`; cue text crossfade 300 ms at each turn. Timer arc linear over the session. | Ring static at 1.0; cue alternates text only (no scale). |
| 07a → 07b | 07a holds 1.6 s after the light lands, then the sheet slides up (320 ms, `Easing.out(Easing.cubic)`) and the fox shrinks/moves to its 07b box (same duration). Tap skips. | Crossfade 200 ms. |
| Milestone entrance | Glow opacity 0 → 1 (600 ms), fox enter, number count-up 0 → N (800 ms, `Easing.out(Easing.cubic)`), 120 ms stagger for the text lines. *rev 4:* `notificationAsync(Success)` at the end of the count-up (§13). | Everything appears at once (fade 200 ms). |
| Path | When a node unlocks: lock fades out, node fills primary (300 ms), then the next node's gold ring draws (500 ms). Locked → never animates backwards. *rev 4:* `impactAsync(Medium)` at fill start. | Instant (haptic kept). |
| Bölüm 2 celebration *(rev 4)* | Glow 600 ms, fox enter, 6 piece icons pop 0.6 → 1 with 80 ms stagger, then `notificationAsync(Success)`; text lines 120 ms stagger. | Fade 200 ms; haptic kept. |
| Milestone stop *(rev 4)* | Ghost → reached: dashed ring fades to solid gold, flag scales 0.8 → 1 (240 ms) when the path is next shown. | Instant. |
| Buttons | Pressed: face translateY +4, edge hidden, 80 ms. | Same. |

## 8. Decisions

- **8.0 Decoration only.** Shield, crystal, gem and sparkles are mood, never mechanics.
- **8.1 Haptics (*rev 4*, replaces "No haptics").** The 3 existing calls stay (plan start Success, coping Success, check-in Light). New light haptics are listed in §13 (light lands, piece unlock, milestone reveal, Nefes al/ver, Bölüm 2). None on slips, removals or errors; user toggle in Ben.
- **8.2 Journey days, not streaks.** The hero/day chip and milestones count days since `quitDate` and never reset. The code's current "SON SİGARA KAYDINDAN BERİ" elapsed counter (resets to the last slip) is **removed** (*rev 4*, decided; code and string changes in §14).
- **8.3 Non-clinical milestones.** The day milestones state only time and effort. They contain no health facts, so the docs' requirement of sources and editorial approval for health milestones does not apply. Do not add health facts to them.
- **8.4 Night = focus.** Dark scenes are used for moments (craving, breath, rewards, milestones), never for "something went wrong".
- **8.5 Gold = lights, terracotta = actions, teal = breath.** No other meaning is attached to color.

## 9. Copy — verbatim

*rev 4:* **every string flagged NEW in rev 3 is approved** (shown below as "approved (rev 4)"). New strings added in rev 4 are listed in §18 "Rev 4 copy".

### Milestones
| Screen | Eyebrow | Number | Lead | Body | Status |
|---|---|---|---|---|---|
| Gün 1 | İLK GÜN | 1 gün | İlk günü geride bıraktın. | Bir başlangıç yaptın ve bugün buradasın. Attığın her küçük adım burada duruyor. | approved (rev 4) |
| Gün 1 · kayma sonrası | YOLA ÇIKTIN | 1 gün | İlk günün geride kaldı. | Bugün kolay geçmemiş olabilir; bu da yolun bir parçası. Burada olman yeterli bir adım. | approved (rev 4) |
| Gün 7 | BİR HAFTA OLDU | 7 gün | Bir haftadır kendine alan açıyorsun. | Yedi gün boyunca küçük adımlar attın. Sığınağın da seninle birlikte büyüyor. | approved (rev 4) |
| Gün 7 · kayma sonrası | YOLCULUĞUN DEVAM EDİYOR | 7 gün | Bir haftadır bu yoldasın. | Kaymalar oldu ama yolun kesilmedi. Her yeniden başlayış da sayılır. | approved (rev 4) |
| Gün 14 | İKİ HAFTA OLDU | 14 gün | İki haftadır kendi ritmini buluyorsun. | Zor anlarda bile bir sonraki küçük adımı seçtin. Bu birikim senin. | approved (rev 4) |
| Gün 14 · kayma sonrası | YOLCULUĞUN DEVAM EDİYOR | 14 gün | İki haftadır bu yoldasın. | Bazı günler daha zor geçti; yine de buradasın. Açtığın hiçbir ışık sönmedi. | approved (rev 4) |
| Gün 30 | BİR AY OLDU | 30 gün | Otuz gün boyunca kendine alan açtın. | Her gün küçük bir adım attın ve bu adımlar birikti. Bugün durup bunu fark etmeye değer. | approved (rev 2) |
| Gün 30 · kayma sonrası | YOLCULUĞUN DEVAM EDİYOR | 30 gün | 30 gündür bu yoldasın. | Yol boyunca kaymalar da oldu; hiçbiri kurduğun şeyi silmedi. Önemli olan, her seferinde yeniden devam etmen. | approved (rev 2) |

Buttons on every milestone: "Sığınağı gör →" (the arrow is the `ArrowRight` icon) and "Ana ekrana dön" (approved rev 2). Day chip "{N}. gün" (approved rev 4 format).

### Yuva
| String | Status |
|---|---|
| "Bugün nasıl gidiyor? Kısa bir check-in yeter." | approved (rev 4) |
| "BUGÜN" · "Küçük adımların" | rev 2 concept copy |
| "Günlük check-in" · "Bugünün ışığı yandı" (done) · **"Bugünün ışığını yak"** (pending) | first two from rev 2; pending approved (rev 4) |
| "Bir destek oturumu" · "Her oturum 1 ışık" | rev 2 concept copy |
| "+1" · "{N} ışık" · "{N}. gün" · "{a}/2" | UI |
| "içilmeyen" · "cebinde kalan" | shortened from the code's "İÇİLMEYEN TAHMİNİ" / "CEBİNDE KALAN" (approved rev 4 short forms; values are still estimates; the full explanation stays in Rotam) |
| **"Paketi ekle"** | approved (rev 4) |
| "Şu an bir istek var" | rev 2 concept copy |
| Tabs "Yuva", "Sığınak", "Rotam", "Ben" | existing |

### Sığınak
| String | Status |
|---|---|
| "Sığınağın" | existing (shortened from "Sığınağın, adım adım") |
| "Her 2 ışık yolda yeni bir durak açar." | rev 2 concept B |
| "BÖLÜM 1 · TEMEL" · "Sığınağın ilk odası" · "3 / 6 parça" | rev 2 concept B |
| Piece names "Sığınak temeli", "Sıcak ışıklar", "Dinlenme köşesi", "Pencere", "Yeşil köşe", "Kitaplık" | existing |
| "{piece} · {n} ışık kaldı" | existing pattern ("{n} ışık kaldı") |
| "Kayma yolu geri sarmaz; açtığın duraklar hep yerinde kalır." | rev 2 concept B |

### Onboarding (all existing unless marked)
- 0: "YENİ BİR BAŞLANGIÇ" · "Bırakma yolun\nsana ait." · "Her şeyi bugün çözmek zorunda değilsin. Sana iyi gelecek bir sonraki küçük adımı bulmana yardım edeceğiz." · "İstek geldiğinde yanında" / "Kısa, uygulanabilir baş etme araçları." · "Kendi sığınağını kur" / "Küçük adımlarınla yaşayan bir alan." · "Yolun kesilmez" / "Bir kayma önceki emeğini silmez." · "Küçük adımlarla başla" · "Hesap açman gerekmez. Planın önce bu cihazda saklanır."
- Header: "Geri" · "ADIM {n} / 5" (format approved rev 4; the code uses its own eyebrows such as "ADIM 1 · BAŞLANGIÇ NOKTAN", which stay in the sheet).
- 1: "ADIM 1 · BAŞLANGIÇ NOKTAN" · "Günde yaklaşık kaç sigara içiyorsun?" · "Yaklaşık bir sayı yeterli. Bu bilgi, kişisel ilerleme tahminini oluşturur." · "GÜNLÜK ORTALAMA" · "Örn. 10" · "sigara / gün" · "Yaklaşık değer yeterli; bu alanı daha sonra da doldurabilirsin." · "Devam et" · "Bu alanı daha sonra doldur"
- 2: "ADIM 2 · İSTEĞE BAĞLI" · "Tasarrufunu da takip edelim mi?" · "Paket fiyatını bilirsen yaklaşık tasarrufunu gösterebiliriz. Emin değilsen bu adımı geçebilirsin." · "PAKET FİYATI" · "Örn. 100" · "PAKETTE KAÇ SİGARA VAR?" · "Örn. 20" · "adet" · **"Örnek: günde {cpd} sigarayla haftada yaklaşık ₺{weekly}"** (approved rev 4; `weekly = round(cpd · 7 · packPrice / packSize)`) · "Bu adımı atla"
- 3: "ADIM 3 · KENDİ ZAMANIN" · "Bırakma gününü seç." · "Bugün başlayabilir ya da hazırlanmak için kendine bir tarih belirleyebilirsin. Bu kararı daha sonra değiştirebilirsin." · "BAŞLANGIÇ TARİHİ" · "Bugün başlamak istiyorum"
- 4: "ADIM 4 · KENDİ NEDENİN" · "Bırakma kararın sana ne ifade ediyor?" · "İstersen kısa bir not ekle. Zorlandığın bir anda sana kendi nedenini hatırlatabiliriz." · "KENDİNE NOTUN" · "Örneğin: Daha özgür hissetmek…" · "İsteğe bağlı · en fazla 240 karakter" (the mockup shows sample user text)
- 5: "ADIM 5 / 5 · HAZIR" · "İlk adımın hazır." · "İstediğin zaman plan bilgilerini ayarlardan düzenleyebilirsin." · "Günlük ortalama" · "Bırakma günü" · "Tasarruf hesabı" · "Şimdilik eklenmedi" · "Uygulama öz yönetim desteği sunar; sağlık profesyonelinin önerilerinin veya tedavinin yerine geçmez." · "Planımı oluştur" · "Planın bu cihazda saklanır. Hesap ve bulut eşitlemesi isteğe bağlıdır."
- Footer hint for steps 1–4: "İlerleme kaydedilir · Dilediğinde geri dönebilirsin" (existing).

### İstek / Nefes / 07 (existing unless marked)
- İstek: "Şu an bir sonraki küçük adımı seç." · "Bu anı hemen çözmek zorunda değilsin. Sana uygun bir araç seçebilir ya da nedenlerini hatırlayabilirsin." · Tools: "Yavaş nefes" / "Ritmi yumuşat, omuzlarını bırak." / 3 dk · "Kısa bir yürüyüş" / "Bulunduğun yeri değiştir ve biraz hareket et." / 5 dk · "Su iç" / "Bir bardak su alıp yavaşça iç." / 2 dk · "Nedenlerimi hatırla" / "Bırakmaya karar verdiğin nedeni yeniden oku." / 1 dk · "{n} dk" (unit format approved (rev 4)) · "+1" · "Şimdi değil"
- Nefes: "YAVAŞ NEFES" · "Sadece bu ana odaklan." · "Nefes al" / "Nefes ver" (rev 2 cue) · "kendine ayırdığın süre" · "Rahat ettiğin bir ritimde nefes al. Saymak zorunda değilsin; istediğin an durabilirsin." · "Bu adımı tamamladım" · "Başka bir araç seç"
- 07a: "Bugünün ışıkları" (approved rev 4) · "{N} ışık" · "+1 ışık" (approved rev 4) · "Bu an için kendine alan açtın." · **"Işığın bugünün halkasına eklendi."** (approved rev 4)
- 07b: "Bu an için kendine alan açtın." · "İstek şimdi nasıl?" · "Azaldı" · "Aynı" · "Geri geldi" · **"Yeni parça açıldı: {piece}"** (approved rev 4) · **"Sığınağında seni bekliyor."** (approved rev 4) · "Ana ekrana dön"

### Accessibility labels (approved rev 4)
- Light chip: "Biriktirdiğin ışık: {N}" (existing pattern). Day chip: "Yolculuğunun {N}. günü" approved (rev 4). Today ring: "Bugün {a} / 2 ışık" approved (rev 4). Path node: "{piece}, açıldı" / "{piece}, {n} ışık kaldı" / "{piece}, kilitli" approved (rev 4).

## 10. Data per screen

| Screen | Reads | Writes |
|---|---|---|
| Onboarding | draft key `quit-onboarding-draft-v1` (existing) | `Profile {name, cigarettesPerDay, packPrice, packSize, quitDate, reason, currency:'TRY'}` via `saveAppState` (existing; nothing new) |
| Yuva | profile, events → `lights = earnedLight(events)`, `checkedInToday`, `copingToday` (count of `coping` events with a local date of today), `journeyDay`, `cigarettesAvoided`, `savedEstimate` | `checkin` event (existing) |
| Sığınak | `lights`, `builtPieces`, `nextThreshold` (existing derivations) | — |
| İstek / Nefes | `selected` tool, remaining seconds, `profile.reason` (for "Nedenlerimi hatırla") | `craving` event when opened (existing), `coping` event on completion |
| 07a/b | `lightsBefore`, `lightsAfter`, `builtPieces` before and after, `todayLights` | `urge_result` event `{result:'Azaldı'|'Aynı'|'Geri geldi'}` (existing) |
| Milestones | `journeyDay`, `hasLoggedSlip`, `milestones.seen` (*rev 4*) | add `day-N` to `milestones.seen` (synced snapshot field, §15) |
| Slip (existing dialog) | — | `slip` event; **must not** change lights, pieces, journeyDay or the milestones already seen |

Derived helpers to add in `src/domain/` (pure, unit-testable): `journeyDay(quitDate, now)`, `todayLights(events, now)`, `pieceUnlocked(before, after)`, `dueMilestone(journeyDay, seen)`.

## 11. Superseded
- rev 1 frames 02 Yuva and 05 Sığınak, and rev 2 Concept A/B files (`konsept-*.png`, `konseptler-overview.png`, `0X-*-rev2-preview.png`): **superseded** by the rev 3 merged design. Keep them for reference only.
- The rev 2 Gün 30 haptic proposal: removed in rev 3, **reinstated in rev 4** as part of the milestone reveal (§13).
- *rev 4:* the "SON SİGARA KAYDINDAN BERİ" counter, the rev 3 "no haptics" rule and the local key `quit-milestones-seen-v1`: **superseded**.
- The token `#C9502F`: **replaced** by `#C84F2E` (still present in the stale Figma file).

## 12. Open questions (rev 3) — *answered in rev 4: 1 (keep + add haptics), 2 (drop reset counter), 3 (approved), 4 (cloud sync), 5 (stops on path + Rotam), 6 (1/2), 7 (designed), 10 (Bölüm 2). See §12b for rev 4 questions.*
1. **Haptics in existing code.** Remove the 3 existing haptic calls (plan start, coping done, check-in) to match "none anywhere"?
2. **Counter after a slip.** The code's elapsed counter resets to the last slip ("SON SİGARA KAYDINDAN BERİ"). Rev 3 shows journey days (never reset). OK to drop the reset counter from Yuva (keep it, if at all, only inside Rotam)?
3. **Approval of NEW strings** (§9), especially Gün 1/7/14 and "Paketi ekle", "Işığın bugünün halkasına eklendi.", "Yeni parça açıldı: {piece}", "Bugünün ışığını yak".
4. **Milestone storage.** Is a local-only key `quit-milestones-seen-v1` OK, or should "seen" sync with the cloud snapshot (that would be a schema change)?
5. **Milestones on the path.** Should Gün 7/14/30 also appear as special nodes on the Sığınak path or in Rotam, or stay as screens only?
6. **Next-node ring.** Is progress to the next piece shown as 0/2 → 1/2 (honest, 2 steps), or with the softer "almost" visual from the mockup?
7. **Rotam and Ben tabs** are not designed in rev 3.
8. **Dark mode** for the day screens: not designed yet.
9. **Figma sync.** When the MCP limit resets, should rev 3 be pushed to the Figma file (tokens + frames)?
10. **After 12 lights** (all 6 pieces built): is there a "Bölüm 2", or does the path end with "Sığınak tamamlandı" (existing string)?

---

# Rev 4 additions

## 13. Haptics (`expo-haptics` ~58, already a dependency)

All calls go through one helper, so the toggle and failures are handled in one place:

```ts
// src/ui/haptics.ts (proposal)
export async function haptic(kind: 'selection'|'light'|'soft'|'medium'|'success') {
  if (!hapticsEnabled) return;                 // Ben → "Titreşimli geri bildirim", local key `quit-haptics-enabled-v1`, default true, NOT synced
  if (Platform.OS === 'web') return;           // no-op on web
  const run = { selection: () => Haptics.selectionAsync(),
    light:  () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
    soft:   () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft),
    medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
    success:() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success) }[kind];
  run().catch(() => {});                        // never block UI, never surface errors
}
```

| Moment | Trigger point | Call | Status |
|---|---|---|---|
| Plan created (onboarding "Planımı oluştur") | after `saveAppState` succeeds (`startPlan`, App.tsx:348) | `notificationAsync(Success)` | **existing, keep** |
| Coping session completed ("Bu adımı tamamladım") | `completeCoping` (App.tsx:365), which starts 07a | `notificationAsync(Success)` | **existing, keep** (this is the "earning a light" haptic for coping; 07a adds no second one) |
| Check-in saved | `checkIn` (App.tsx:498) | `impactAsync(Light)` | **existing, keep** (earning a light by check-in) |
| Light lands in the today ring (07a, end of the 700 ms float) | float `onEnd` | `selectionAsync` | NEW proposal. **Skip if** the Success from completeCoping fired < 1 s ago (default: skip, so only one haptic per moment) |
| Feeling chip selected (07b, check-in mood chips) | `onPress` | `selectionAsync` | NEW |
| Nefes cue switch "Nefes al" ↔ "Nefes ver" | every 4 s turn, in sync with the 300 ms cue crossfade | `impactAsync(Soft)` (fallback `Light` where Soft is not available) | NEW. **Off when reduce motion is on** |
| Piece unlock (path node fills, 07b "Yeni parça açıldı" card appears) | node-fill animation start | `impactAsync(Medium)` | NEW |
| Milestone reveal (Gün 1/7/14/30, default **and** -kayma variant) | end of the 0 → N count-up (800 ms) | `notificationAsync(Success)` | NEW (replaces rev 3 "No haptic") |
| Bölüm 2 celebration (`rev4-bolum2-1-tamam`) | entrance, when the 6 piece icons have popped in | `notificationAsync(Success)` | NEW |
| Bölüm 2 handoff → path (first Bölüm 2 node gets its gold ring) | ring draw start | `impactAsync(Medium)` | NEW |
| Tapping a reached milestone stop on the path / in Rotam | `onPress` | `selectionAsync` | NEW |

**Never haptic:** slip saving ("Kayma kaydet"), record removal, sync errors, validation errors, notifications. No `Warning`/`Error` notification types anywhere, because a slip or error must not feel like a buzz of failure.

**Rules**
- One haptic per moment. Never chain two in < 1 s; the later one is dropped.
- **Reduce motion** (`AccessibilityInfo.isReduceMotionEnabled()` plus the `reduceMotionChanged` listener): keep the discrete confirmations (check-in, Success, unlock), but **turn off the rhythmic Nefes haptic** and the 07a landing tick.
- **System settings:** iOS ignores calls when System Haptics are off or in Low Power Mode, and the Taptic Engine is unavailable while the camera/mic records. Android follows the system "touch feedback / vibration" setting (expo-haptics uses `performHapticFeedback` / Vibrator). We don't detect either state, so the app toggle is the only in-app control. Web: no-op.
- Default on. The toggle lives in Ben → DENEYİM and is local to the device (a device preference, not plan data).

## 14. Journey days everywhere (reset-on-slip counter removed)

**Rule:** the only day count shown is `journeyDay` (days since `startOfDay(quitDate)`). A slip never resets it. `hasLoggedSlip` is kept only to pick the milestone `-kayma` copy.

Code changes (App.tsx @ faa0e16, **not applied**, for Kodcu):

| Where | Today | Change to |
|---|---|---|
| L304–313 | `lastSlipAt`, `lastSlipTime`, `trackingStart = quitStarted ? max(plannedStart, lastSlipTime) : plannedStart`, `elapsed = formatDuration(clock − trackingStart …)` | `journeyStart = plannedStart`; `elapsed = formatDuration(clock − journeyStart …)`. Delete `lastSlipTime`/`trackingStart`. Keep `lastSlipAt` only if still used elsewhere; `hasLoggedSlip` stays (milestone variant). Add a pure `journeyDay(quitDate, now)` in `src/domain/` plus a unit test: a slip event does not change the result. |
| L703 (Yuva hero eyebrow) | `quitStarted ? hasLoggedSlip ? 'SON SİGARA KAYDINDAN BERİ' : 'YOLCULUĞUN BAŞLAYALI' : 'BAŞLANGICA KALAN SÜRE'` | `quitStarted ? 'YOLCULUĞUN BAŞLAYALI' : 'BAŞLANGICA KALAN SÜRE'` (in the rev 3/4 Yuva the hero is the day chip "{N}. gün"; the string stays for the accessibility label) |
| L821 (Rotam hero eyebrow) | `'SON SİGARA KAYDINDAN BERİ' : 'SENİN YOLCULUĞUN' : 'BAŞLANGIÇ PLANIN'` | `quitStarted ? 'SENİN YOLCULUĞUN' : 'BAŞLANGIÇ PLANIN'` |
| Rotam hero body | "Sayaç, son sigara kaydından sonra yeniden başlar. Önceki ilerlemen ve sığınak adımların korunur." (slip case) | **removed**. Every quit-started user sees "{d} Ekim {yyyy}’dan beri" **NEW** (`toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})` plus the suffix "’dan/’den beri", with vowel harmony, see note) |
| Slip dialog (L356) | "Bir sigara içtin mi?" / "Bu kayıt önceki emeğini silmez. Yalnızca bugünkü durumu not ederiz." | unchanged (already non-resetting) |
| `cigarettesAvoided` | already subtracts recorded slips from `journeyDays × cpd` | unchanged; base it on `journeyStart` (it already is, via plannedStart) |
| Tests | — | `tests/journey.test.mjs`: (a) day 0 on the quit date, (b) +1 after local midnight, (c) a slip on day 5 still yields day 12 on day 12, (d) a future quitDate gives a countdown, not negative days |

Strings removed from the app: **"SON SİGARA KAYDINDAN BERİ"** (2×) and **"Sayaç, son sigara kaydından sonra yeniden başlar. Önceki ilerlemen ve sığınak adımların korunur."**

Suffix note: the ablative suffix follows the last spoken word of the year (2026 "…yirmi altı" → "’dan"; 2027 "…yirmi yedi" → "’den"; 2030 "…otuz" → "’dan"). Implement a small `yearAblative(y)` from the last non-zero digit/tens word, or use the suffix-free form "Başlangıç: 21 Ekim 2026" (open question 4).

## 15. Milestones sync — schema change (proposal; **no migration has been run**)

### How the app persists today (read from the repo)
- Local: `expo-sqlite/localStorage` key `quit-companion-state-v1` = `AppState {profile, events}`; the pending-sync flag is `quit-companion-pending-sync-v1`.
- Cloud: `public.user_snapshots (user_id uuid PK → auth.users ON DELETE CASCADE, snapshot jsonb NOT NULL, updated_at timestamptz DEFAULT now())`, with `CHECK (pg_column_size(snapshot) < 1048576)` and RLS limiting all four ops to the owner (migration `202610200001_user_snapshots.sql`). `saveAppState` writes local first, then upserts the **whole** snapshot.
- Login with both sides populated → dialog "Buluttakini al" / "Bu cihazı yükle": **the whole snapshot wins; no merge.**
- `parseAppState` (src/data/schema.ts) **rejects the whole state on an unknown event `kind`**, but **silently drops unknown top-level keys** (it rebuilds `{profile, events}`).

### Decision: a top-level JSON field, not a new event kind
A new `EventKind` like `milestone_seen` would make every **older client reject the entire snapshot** after a pull. A top-level field is ignored by old clients. The table does not need a new column, because `snapshot` is jsonb.

```ts
// src/data/schema.ts (proposal)
export type MilestoneKey = 'day-1' | 'day-7' | 'day-14' | 'day-30' | 'chapter-2';
export type MilestoneSeen = { key: MilestoneKey; seenAt: string /* ISO */; variant: 'default' | 'slip' };
export type AppState = {
  schemaVersion?: 2;                 // absent = 1
  profile: Profile | null;
  events: ProgressEvent[];
  milestones?: { seen: MilestoneSeen[] };   // NEW, optional
};
```
- **Keys:** stable strings (not numbers), so new milestones can be added later (`day-60`, `chapter-3`) without a format change. `chapter-2` stores that the Bölüm 2 celebration was shown.
- **Validation** in `parseAppState`: `milestones` absent → `{seen: []}`. Otherwise `seen` must be an array of ≤ 64 entries. Drop entries with an unknown `key` (do **not** reject the state, for forward compatibility), entries with an invalid `seenAt`, or an unknown `variant` (→ `'default'`). Dedupe by `key`, keeping the earliest `seenAt`. The size stays far below `MAX_STATE_BYTES 700000`.
- **Derived, not stored:** where a stop sits on the path (§17.1) is computed from events plus `quitDate`, so nothing about positions is synced.

### Conflict rule
"Seen" is a grow-only set. Whatever the user picks in "Buluttakini al" / "Bu cihazı yükle", **`milestones.seen` = union(local, remote)**, keeping the earliest `seenAt` per key. Profile and events keep the existing whole-snapshot rule. Result: a celebration that was shown on any device is never shown again, and switching devices can never re-fire Gün 7. Same union on every background push/pull.

### Backward compatibility
1. **Old client pulls a v2 snapshot:** it drops `milestones` and works normally (unknown top-level key). Nothing breaks.
2. **Old client then pushes:** the upsert overwrites the snapshot **without** `milestones`. Mitigation: the new client also keeps a local mirror `quit-milestones-v2-cache` (same shape) and **unions it in on every pull**, so seen state comes back on the next push from a new client. Worst case (only old clients for a while): a milestone may be shown once more on an old client, which has no milestone screens anyway.
3. **rev 3 key `quit-milestones-seen-v1`:** the rev 3 spec proposed it but it was never shipped. If a build with it exists, then on first load map `number[]` → `day-N` keys with `seenAt = now`, `variant` from `hasLoggedSlip`, union them into the state, save, and **delete the old key**. This is idempotent.
4. **Users who are already past a milestone when v2 ships** (e.g. day 20, no record): show only the latest due milestone once (existing "latest unseen" rule), then also mark the earlier keys seen with `seenAt = now`, so the path stops for 1/7 still render as "reached" (the path uses journeyDay, not `seen`).
5. **Export:** bump `src/domain/export.ts` to `formatVersion: 2` and include `milestones`. Import of `formatVersion 1` remains valid (`milestones` absent → empty). `tests/export.test.mjs`, `tests/schema.test.mjs`: add cases for an unknown key being dropped, dedupe, union and v1 import.
6. **Delete account:** no change. `delete-account` removes the row, and the field lives inside it.

### Optional SQL migration (proposal only, **do not run**)
Not required for the feature. It helps ops tell versions apart and guards the field shape:

```sql
-- supabase/migrations/202611020001_snapshot_v2_milestones.sql  (PROPOSAL — not applied)
alter table public.user_snapshots
  add column if not exists snapshot_version smallint not null default 1;

alter table public.user_snapshots
  add constraint user_snapshots_milestones_shape
  check (
    not (snapshot ? 'milestones')
    or (jsonb_typeof(snapshot->'milestones') = 'object'
        and jsonb_typeof(snapshot->'milestones'->'seen') = 'array'
        and jsonb_array_length(snapshot->'milestones'->'seen') <= 64)
  ) not valid;               -- existing rows are not re-checked
-- later, after verifying: alter table public.user_snapshots validate constraint user_snapshots_milestones_shape;
```
The client writes `snapshot_version = 2` in the upsert payload once it sends v2. Existing RLS policies cover the new column; no grants change. Down migration: drop the constraint and the column.

## 16. Bölüm 2 · Bahçe

### Rules
- Bölüm 1 = pieces 1–6 (lights 2…12), unchanged. **Bölüm 2 starts at the 12th light** (6th piece built).
- Bölüm 2 pieces (**NEW** names, icons from Phosphor): 7 "Bahçe kapısı" `DoorOpen` (14), 8 "Taş yol" `Footprints` (16), 9 "Çiçek tarhı" `FlowerTulip` (18), 10 "Kuş evi" `Bird` (20), 11 "Bahçe feneri" `Lightbulb` (22), 12 "Gölge ağacı" `Tree` (24).
- Code: `pieces` grows to 12 entries (plus `chapters = [{title:'Temel', from:0, to:6}, {title:'Bahçe', from:6, to:12}]`); `builtPieces = min(12, floor(lights/2))`; `nextThreshold = min(24, (builtPieces+1)*2)`; 07b "new piece" card condition `before < 24`. *Superseded by §19*: there is no final state. Formulas come from the manifest and are uncapped (§19.4), and "Sığınak tamamlandı" is removed (§19.7).
- Same non-judgmental rules: a slip never relocks. Only deleting a record (the existing dialog: "…parça eşikleri yeniden hesaplanır") can lower lights. If that drops a user below 12, the path simply shows Bölüm 1 again; `chapter-2` stays seen and the celebration never re-fires.

### Flow
Trigger: the light that makes `lights` go from 11 → 12 (a check-in or coping) **and** `chapter-2` is not in `milestones.seen`. Order: the normal confirmation (07a/07b or the check-in sheet) → **`rev4-bolum2-1-tamam`** → (CTA) **`rev4-bolum2-2-bahce`** → (CTA) Sığınak in Bölüm 2. If a day milestone is due on the same open, the day milestone shows first and Bölüm 2 on the next app foreground. Users who already have ≥ 12 lights on update see it once on the next open.

### `rev4-bolum2-1-tamam` (celebration, night)
1. bg/dark + night scene full (horizonY 700). Top row y 52: close (→ Yuva, marks seen) · light chip dark "12 ışık".
2. Stage 330 at (30, 100): gold radial glow (rgba(217,172,88,.38) → 0 at 68 %) → `fx_sparkles` 100 % → `fox_cheer` (90, 140) w 210 → `fx_sparkles` 35 %.
3. The 6 Bölüm 1 piece icons in a centered row at y 420: 44 pt primary circles with a 4 pt shadow edge, white icons 22, gap 10. Motion: pop in 1 → 6 (scale 0.6 → 1, 80 ms stagger); the Success haptic fires after the 6th.
4. Text (x 24–366, y 494, centered, gap 6): eyebrow gold **"BÖLÜM 1 TAMAMLANDI"**, title/lg on-dark **"Sığınağın ilk odası hazır."**, body/lg on-dark-muted **"On iki ışıkla altı parçayı yerine koydun. Hepsi burada kalıyor; şimdi yol bahçeye uzanıyor."**
5. Bottom 34, gap 10: primary **"Bölüm 2’ye bak"** + `ArrowRight`; dark secondary "Ana ekrana dön" (existing). Both mark `chapter-2` seen (`variant` = `hasLoggedSlip ? 'slip' : 'default'`; copy is the same for both variants because it is about the effort, not about days).

### `rev4-bolum2-2-bahce` (handoff, day)
1. Day scene h 330 (horizonY 240, sparkles (60, 40) w 270 @ 50 %). Light chip right. `fox_wave` (110, 72) w 170.
2. Sheet bg/canvas from y 296, radius 32 top. Eyebrow text/accent **"BÖLÜM 2 · BAHÇE"**, title/lg **"Sırada sığınağın bahçesi var."**, body-md secondary **"Aynı yol devam ediyor: her 2 ışık bahçeye yeni bir parça ekler. İlk odan olduğu gibi yerinde kalır."**
3. Preview grid 3 × 2, tiles 108 × 124, radius 20, gap 9: the next tile ("Bahçe kapısı") has a gold 1.5 border, a gold_soft 52 circle with a gold_deep icon and the caption **"2 ışık kaldı"** (existing pattern "{n} ışık kaldı"). The other 5 have sunken circles, `#8A8F88` icons and the name only.
4. Bottom: primary **"Yola devam et"** → Sığınak, which auto-scrolls to the first Bölüm 2 node; its ring draws (Medium haptic).

### `rev4-siginak-bolum2` (path in Bölüm 2, sample: day 26, 15 lights)
- Header as in §5.2, then a **collapsed Bölüm 1 bar** at y 118 (h 44, radius 16, white 85 % + border): `SealCheck` fill text/accent 20 · "Bölüm 1 · Temel" (sm-strong 800) · 6 mini piece circles 22 (primary, icon 12) · `CaretDown` 16. Tap expands the whole Bölüm 1 path, including its milestone stops, above.
- Unit card at y 172: eyebrow **"BÖLÜM 2 · BAHÇE"**, title **"Sığınağın bahçesi"**, "1 / 6 parça", gold bar 1/6.
- Path nodes (same component as §5.2): (200, 296) done `DoorOpen` "Bahçe kapısı" · (120, 384) **next** `Footprints` (ring 1/2) with tooltip "Taş yol · 1 ışık kaldı" at (174, 374) · stop ghost Gün 30 (260, 452) "4 gün sonra" · (180, 560) locked "Çiçek tarhı" · (280, 650) locked "Kuş evi". `fox_happy` (6, 440) w 104.
- Same day scene and palette. "Bahçe" is expressed by the piece icons and copy, not by new colors.

## 17. Milestone stops (Sığınak path + Rotam)

### 17.1 On the path (`rev4-siginak-taslar` top of path; `rev4-siginak` auto-scrolled with the fog teaser; sample day 12, 7 lights, quit 21 Ekim 2026)
- **Stop component:** a 44 pt circle (24 smaller than a piece node, so it never reads as a piece).
  - Reached: fill gold_soft, 2 pt border gold, 4 pt edge gold_edge, `Flag` fill gold_deep 22.
  - Upcoming (ghost): card fill, 2 pt **dashed** border tc300, `FlagBanner` `#8A8F88` 22.
- **Label:** caption 800 "Gün N" (ink when reached, secondary when ghost), plus a caption secondary line: the date reached ("22 Ekim", `tr-TR` day + month) or "{n} gün sonra" (**NEW**).
- **Placement rule (derived, nothing stored):** each piece's unlock time = the `at` of the light event that brought lights to 2·(i+1) (using `earnedLight` order: the first check-in per local day plus every coping). Each milestone time = `startOfDay(quitDate) + N days`. Merge the two lists chronologically; stops sit on the dotted path between nodes. **Only the next upcoming milestone** shows as a ghost, placed directly after the "next" piece node. Later ones are hidden until they become next.
- Mockup coordinates (centers): Temel (200, 260) · Gün 1 (130, 328) · Sıcak ışıklar (110, 396) · Gün 7 (170, 466) · Dinlenme köşesi (270, 528) · **Pencere next** (170, 634), ring 1/2, tooltip "Pencere · 1 ışık kaldı" at (70, 556) · ghost Gün 14 (290, 712) "2 gün sonra" · Yeşil köşe locked (200, 774, under the tab bar → scroll). `fox_happy` (8, 612) w 104. (These are the `rev4-siginak-taslar` coordinates; the auto-scrolled `rev4-siginak` is in §19.2.) Dotted path: stroke tc300 6, dasharray 2 12.
- The rev 3 note card ("Kayma yolu geri sarmaz; açtığın duraklar hep yerinde kalır.") moves to the end of the scroll content (below the last node).
- **Tap a reached stop** → reopens that milestone screen in replay mode: the same layout, no count-up, no haptic, close → back to the path. Tap a ghost → tooltip "Gün 14 · 2 gün sonra". Accessibility: "Gün 7 kilometre taşı, 28 Ekim’de ulaştın" / "Gün 14 kilometre taşı, 2 gün sonra" (**NEW**).
- Milestones still give **no lights** and unlock nothing.

### 17.2 Rotam (`rev4-rotam`, `rev4-rotam-kayitlar`, `rev4-rotam-hesap`)
Built from the existing `Progress` tab (hero, 2 stats, "Hesap nasıl yapılıyor?", "Son kayıtların", Check-in / Kayma kaydet, disclaimer, remove dialog), reordered so the most motivating, non-judgmental information comes first and the long explanation moves into a sheet.
1. bg/canvas; day scene h 260 (horizonY 190). Title/lg **"Rotan"** (existing topTitle) · light chip. Hero: eyebrow text/accent "SENİN YOLCULUĞUN" (existing), display/xl "12" + title/lg "gün", sm-strong ink **"21 Ekim 2026’dan beri"** (**NEW**, see §14). `fox_calm` (236, 92) w 130.
2. Sheet bg/canvas from y 228, radius 32, padding 20, gap 10:
   - **Card "Kilometre taşları"** (**NEW**) + aside "2 / 4". Track: 4 stops (44 pt, §17.1 styles) at x 24/110/196/282, connected by a 4 pt sunken line with the gold fill up to today (a 12 pt primary dot with a white 2 pt border marks today). Labels "Gün N" + date ("22 Eki", short month) or "{n} gün" remaining. Tap a reached stop → replay.
   - **Card "Son 7 gün"** (**NEW**) + aside "{n} ışık": 7 columns (36 wide), each a light token 30 if that day had ≥ 1 light, otherwise a dashed 30 circle (no red, no "missed"). Day initials (Sa, Ça, Pe, Cu, Ct, Pz) and **"Bugün"** (**NEW**) in bold. Data: `earnedLight` grouped by local day for the last 7 days.
   - **Stats row** (2 cards, radius 20): `Prohibit` + "İÇİLMEYEN TAHMİNİ" / "168" / "adet · yaklaşık"; `Coins` + "TAHMİNİ TASARRUF" / "₺840" / "girdiğin paket fiyatıyla" (all existing; the empty states "—" + "Günlük miktarı ekle" / "Paket ve günlük miktarı ekle" stay).
   - Text button `Info` + "Hesap nasıl yapılıyor?" (existing title) → **bottom sheet** (`rev4-rotam-hesap`): title/md, the existing explanation verbatim (both variants), a 2-row mini table "Günlük ortalama · 14 sigara" / "Paket · ₺100 / 20 adet" and secondary "Plan bilgilerini düzenle" (existing) → Ben plan editor.
3. **Scrolled (`rev4-rotam-kayitlar`):** sticky compact bar "Rotan" + "12. gün · 7 ışık". Section "Son kayıtların" + "{n} kayıt" (existing). A grouped card of the 6 latest events (rows ≥ 60): a 36 tile (gold_soft + gold_deep icon for light-earning events; sunken + secondary for the rest; **slip uses `ArrowCounterClockwise` in neutral grey, never red**), the existing event label, a relative time **"Bugün 09:12" / "Dün 21:40" / "30 Eki 18:05"** (**NEW** format), "+1" + token 16 on light-earning rows, and a 44 pt `DotsThree` → action sheet "Kaydı kaldır" → the existing confirm dialog. Footer row **"Tümünü gör"** (**NEW**) → full list (same rows, paged by 50).
   - Buttons: secondary "Check-in" (`CalendarCheck`) and quiet outlined "Kayma kaydet" (`ArrowCounterClockwise`), both existing. Under them, caption **"Kayma kaydı önceki emeğini silmez; yolun ve ışıkların yerinde kalır."** (**NEW**, a softer echo of the existing slip dialog).
   - Disclaimer note (sunken, radius 16, `Info`): "Bu göstergeler yaklaşık kişisel takip değerleridir; sağlık sonucunu ölçmez veya garanti etmez." (existing)
   - Empty state (no events): the existing "Burada yolculuğun görünecek" / "Check-in veya baş etme aracı kullandığında kayıtların burada toplanır." card replaces the list.
   - Before the quit date: hero eyebrow "BAŞLANGIÇ PLANIN" with the existing countdown text, milestones all ghost, "Son 7 gün" hidden.

## 18. Ben (`rev4-ben`, `rev4-ben-2`, `rev4-ben-bulut`)
Built from the existing `Settings` tab, restructured as an iOS/Material-style **grouped list**: section header (eyebrow secondary) → white card radius 20 → rows ≥ 56 pt with a 36 icon tile (radius 12, acc_soft / text/accent icon), title 15/700, an optional caption, and a right value or chevron/toggle. Destructive rows use text/accent (5.7:1 on card), never a red fill.
1. Header: day scene h 220 (horizonY 150, fade). Title/lg **"Ben"** (**NEW**; replaces the topTitle "Ayarlar" to match the tab label) · chips "12. gün" + "7 ışık" · `fox_wave` (250, 44) w 120.
2. **PLANIN** (**NEW** short header for "Bırakma planın"): "Günlük ortalama · 14 sigara" (`ChartLine`) / "Paket · ₺100 / 20 adet" (`Coins`) / "Bırakma günü · 21 Ekim 2026" (`CalendarCheck`) / "Kendine notun · “Daha özgür hissetmek…”" (`Heart`, ellipsis) / text button `PencilSimple` "Plan bilgilerini düzenle" (existing). Empty values: "Günlük miktar eklenmedi", "tasarruf hesabı eklenmedi" (existing).
3. **HATIRLATMALAR** · aside "İsteğe bağlı" (existing): "Günlük kısa check-in" (`Bell`) + toggle (teal_deep when on), caption "Her gün 19:00 için açık." / "Kapalı. Aç seçeneğine dokununca bildirim izni istenir." (existing). Row **"Saat"** (**NEW** label) `Clock` "19:00" → native time picker (replaces the free-text input and "Saati kaydet"; it saves on change). The caption "Hatırlatma yalnızca cihazında planlanır. İstediğin zaman kapatabilirsin." (existing) goes under the group.
4. **DENEYİM** (**NEW**): `Vibrate` tile (teal) **"Titreşimli geri bildirim"** (**NEW**) + caption **"Işık kazandığında ve nefes ritminde hafif titreşim."** (**NEW**) + toggle (§13).
5. **Scrolled (`rev4-ben-2`): VERİ VE EŞİTLEME** · aside "Önce gizlilik" (existing): "Bu cihazda saklanıyor" (existing, `DeviceMobile` teal) + caption **"Hesap açmadan kullanabilirsin."** (**NEW** short form) / **"Bulut eşitlemesi"** (**NEW** row label) `Cloud` · value "Kapalı" or the e-mail when signed in ("Bulut hesabı: {email}" existing in the sheet) → sheet / "Verilerimi dışa aktar" (existing) `DownloadSimple` / "Bu cihazdaki kayıtları sil" (existing) `Trash`, accent text, with the existing confirm. When signed in, the sync-issue text "Son kayıt buluta eşitlenemedi; …" + "Eşitlemeyi yeniden dene" (existing) appears as a row with `CloudArrowUp`.
6. **DESTEK VE BİLGİ** (existing): a card with a `Lifebuoy` tile on surface/hero, "Profesyonel destek", the ALO 171 text, secondary button `Phone` "171’i ara" (tel:171; existing label without "↗"), text button "Resmî destek bilgilerini aç" + `ArrowUpRight` (existing), disclaimer "Bu uygulama tıbbi tavsiye, tanı veya tedavi sunmaz. Acil durumda yerel acil yardım hizmetlerine başvur." (existing). The footer "Çalışma adı · MVP önizlemesi · …" (existing) is centered at the bottom.
7. **`rev4-ben-bulut` (sheet, from y 120):** title/md **"Bulut eşitlemesi"** (**NEW**) + close; the existing explanation "Uygulamayı hesap açmadan kullanabilirsin. Supabase bulut eşitlemesi için hesabınla giriş yap; e-posta doğrulaması ayarına bağlı olabilir."; info strip (gold_soft, `CloudCheck`) **"Eşitlenenler: planın, kayıtların ve gördüğün kilometre taşları."** (**NEW**; reflects §15); inputs "E-posta" (`Envelope`) and "Parola (en az 8 karakter)" (`LockSimple`); primary "Hesap oluştur ve eşitle"; text button "Zaten hesabın var mı? Giriş yap" (all existing). Signed-in state: "Bulut hesabı: {email}" + "Bulut hesabından çıkış" + "Hesabımı ve verilerimi sil" (existing; the latter keeps its existing confirm and the delete-account edge function).

### Rev 4 copy — NEW strings (verbatim)
| Screen | String |
|---|---|
| Bölüm 2 kutlama | "BÖLÜM 1 TAMAMLANDI" · "Sığınağın ilk odası hazır." · "On iki ışıkla altı parçayı yerine koydun. Hepsi burada kalıyor; şimdi yol bahçeye uzanıyor." · "Bölüm 2’ye bak" |
| Bölüm 2 geçiş | "BÖLÜM 2 · BAHÇE" · "Sırada sığınağın bahçesi var." · "Aynı yol devam ediyor: her 2 ışık bahçeye yeni bir parça ekler. İlk odan olduğu gibi yerinde kalır." · "Yola devam et" |
| Bölüm 2 path | "Sığınağın bahçesi" · "Bölüm 1 · Temel" · pieces "Bahçe kapısı", "Taş yol", "Çiçek tarhı", "Kuş evi", "Bahçe feneri", "Gölge ağacı" |
| Stops | "Gün {N}" · "{n} gün sonra" · a11y "Gün {N} kilometre taşı, {tarih}’de ulaştın" / "Gün {N} kilometre taşı, {n} gün sonra" |
| Rotam | "{d} {Ay} {yyyy}’dan beri" · "Kilometre taşları" · "Son 7 gün" · "Bugün" · "{n} gün" · "Tümünü gör" · "Bugün {hh:mm}" / "Dün {hh:mm}" · "Kayma kaydı önceki emeğini silmez; yolun ve ışıkların yerinde kalır." |
| Ben | "Ben" · "Planın" · "Saat" · "Deneyim" · "Titreşimli geri bildirim" · "Işık kazandığında ve nefes ritminde hafif titreşim." · "Hesap açmadan kullanabilirsin." · "Bulut eşitlemesi" · "Eşitlenenler: planın, kayıtların ve gördüğün kilometre taşları." |

### Rev 4 data per screen
| Screen | Reads | Writes |
|---|---|---|
| Sığınak (stops) | events, `quitDate`, `journeyDay`, `lights` | — |
| Bölüm 2 kutlama/geçiş | `lightsBefore/After`, `milestones.seen` | `milestones.seen += chapter-2` (synced) |
| Milestones | `journeyDay`, `hasLoggedSlip`, `milestones.seen` | `milestones.seen += day-N` (synced; replaces `quit-milestones-seen-v1`) |
| Rotam | profile, events, `journeyDay`, last-7-day lights, `cigarettesAvoided`, `savedEstimate` | `checkin`, `slip` (existing); remove event (existing) |
| Ben | profile, reminder state, auth state, `quit-haptics-enabled-v1` | profile edits, reminder (existing), haptics toggle (local) |

## 12b. Open questions (rev 4)
1. ~~After Bölüm 2~~ → answered: endless chapters (§19). Is the Bölüm 3–8 roadmap (§19.1) OK?
2. **Bölüm 2 names:** OK with "Bahçe kapısı / Taş yol / Çiçek tarhı / Kuş evi / Bahçe feneri / Gölge ağacı"?
3. **Removal below 12 lights:** with Bölüm 2 seen, show Bölüm 1 again (current proposal; honest to the data) or keep showing Bölüm 2 with the first node "next"?
4. **"…’dan beri" suffix:** implement Turkish suffix harmony for the year, or use the suffix-free "Başlangıç: 21 Ekim 2026"?
5. **Optional SQL migration (§15):** apply the `snapshot_version` + check constraint, or keep the table unchanged (the feature works without it)?
6. **Old-client overwrite window:** is the local mirror + union enough, or should the app force-update old builds (min-version check)?
7. **Reminder time picker** instead of the text field: OK to drop "Saati kaydet"?
8. **"Son 7 gün" strip:** keep it? It shows effort and has no "missed" styling, but it is the closest thing to a streak visual in the app.
9. **Haptics on 07a landing:** skip by default (to avoid doubling with the coping Success), or replace the coping Success with the landing tick?
10. Still open from rev 3: dark mode for day screens; pushing rev 3/4 to Figma when the MCP limit resets.

## 19. Endless Sığınak (chapters, loops, remote content) — *rev 4 addition*

**Principle:** the Sığınak never reaches a "done, nothing left" state. There is no last chapter, no "Sığınak tamamlandı", and no final 100 % bar. The user always sees one more thing ahead: the next chapter in fog (§19.2) or, if they caught up with all published content, a waiting state with things to do meanwhile (§19.6). This is the same pattern as long-running casual games: content ships continuously and the end is never shown. **The light rules don't change:** 1 per check-in day and 1 per coping session. No currency is added, lights are **never spent**, and a slip never deletes or relocks anything.

### 19.1 Chapter roadmap (first 8; all chapters 6 pieces × 2 lights = 12 lights)
A chapter *n* opens at `12 · (n − 1)` lights. Piece *k* (0-based, global) needs `2 · (k + 1)` lights. All names are **NEW** (chapters 1–2 also appear in §16).

| # | Chapter (eyebrow · title) | Opens at | Biome / season | Pieces (icon) | Ships |
|---|---|---|---|---|---|
| 1 | TEMEL · Sığınağın ilk odası | 0 | indoor room | Sığınak temeli `HouseSimple`, Sıcak ışıklar `Lamp`, Dinlenme köşesi `Armchair`, Pencere `GridFour`, Yeşil köşe `Plant`, Kitaplık `Books` (existing) | bundled |
| 2 | BAHÇE · Sığınağın bahçesi | 12 | garden, spring light | Bahçe kapısı `DoorOpen`, Taş yol `Footprints`, Çiçek tarhı `FlowerTulip`, Kuş evi `Bird`, Bahçe feneri `Lightbulb`, Gölge ağacı `Tree` | bundled |
| 3 | DERE KENARI · Suyun sesi | 24 | creek, summer | Küçük köprü `Bridge`, Su birikintisi `Drop`, Nilüfer `FlowerLotus`, Kayık `Boat`, Balık havuzu `Fish`, Dalga taşları `Waves` | bundled (so a fresh install with no network still has a fogged teaser beyond Bölüm 2) |
| 4 | ORMAN YOLU · Ağaçların arası | 36 | forest, autumn | Çam `TreeEvergreen`, Çadır `Tent`, Kamp ateşi `Campfire`, Dürbün `Binoculars`, Yaprak yolu `Leaf`, Sırt çantası `Backpack` | remote |
| 5 | YILDIZ TERASI · Gece göğü | 48 | rooftop terrace, night | Teras feneri `LampPendant`, Yıldız haritası `Star`, Ay penceresi `MoonStars`, Kayan yıldız `ShootingStar`, Gezegen modeli `Planet`, Sıcak içecek `Coffee` | remote |
| 6 | KIŞ ODASI · Sıcak bir köşe | 60 | winter interior | Kar penceresi `Snowflake`, Şömine `Fire`, Müzik köşesi `MusicNotes`, Gitar `Guitar`, Kalın battaniye `Hoodie`, Kış bitkisi `PottedPlant` | remote |
| 7 | KIYI · Deniz feneri | 72 | seaside | Deniz feneri `Lighthouse`, Şemsiye `Umbrella`, Ada manzarası `Island`, Gün batımı `SunHorizon`, Tüy rüzgârlığı `Feather`, Kum tepesi `Cactus` | remote |
| 8 | TEPE · Manzara | 84 | hilltop, all seasons | Dağ yolu `Mountains`, Bulut seyri `CloudSun`, Gökkuşağı `Rainbow`, Tepe çadırı `Tent`, Seyir köprüsü `Bridge`, Gün doğumu `SunHorizon` | remote |
| 9+ | defined only in the remote manifest; the client never hard-codes a count | 96, 108, … | — | — | remote |

Pacing: an engaged user earns about 1–3 lights a day, so one chapter lasts roughly 1–2 weeks. Publishing **one chapter every ~2 weeks** (or a smaller weekly drop: goals, a season item, a collection set) keeps ahead of most users. The waiting state (§19.6) covers the rest.

### 19.2 Next-chapter teaser in fog (`rev4-siginak`, `rev4-siginak-bolum2`)
- The path always ends with **exactly one** fogged teaser: the next chapter. The one after it is never shown, and nothing says "last".
- **Fog component:** a band 150–200 pt tall at the end of the path. It uses a linear gradient from `canvas` at 0 % alpha to `canvas` at 55 %, plus 5 white ellipses (rgba(255,254,252,.85–.95), `blur(16px)`; in RN use `expo-blur` or a pre-rendered fog PNG) over the last 1–2 locked nodes. Inside it is the teaser: a 52 pt dashed circle with the chapter's gate icon in grey (`#8A8F88`), a `CloudFog` 16 + eyebrow secondary **"BÖLÜM {n} · {TITLE}"**, sm-strong 800 **"Sisin ardında yeni bir yer var"** (**NEW**), and caption **"{threshold}. ışıkta açılır · {n} ışık kaldı"** (**NEW**).
- Mockup `rev4-siginak` (day 12, 7 lights, auto-scrolled so "Pencere" sits at ~45 %): Gün 7 stop (150, 236) · Dinlenme köşesi (260, 296) · **Pencere next** (160, 384) with tooltip at (36, 304) · Gün 14 ghost (280, 454) · Yeşil köşe (190, 516) · Kitaplık (100, 586, fading into the fog) · fog from y 560 · teaser at y 612 "BÖLÜM 2 · BAHÇE / Sisin ardında yeni bir yer var / 12. ışıkta açılır · 5 ışık kaldı". The top of the same scroll (Temel, Gün 1, Sıcak ışıklar) is `rev4-siginak-taslar`.
- Header (*rev 4*): a 40 pt round button `DiamondsFour` (a11y "Koleksiyon ve hedefler" **NEW**) left of the light chip → `rev4-koleksiyon`.
- Tapping the teaser opens a small sheet: the chapter title, a 3-icon preview from the manifest `teaser.previewIcons`, and "{n} ışık kaldı". Haptic `selectionAsync`.

### 19.3 Loops outside chapters (decoration only; no points, no shop, no spending)
| Loop | How it works | What it gives | Source of truth |
|---|---|---|---|
| **Weekly goals** (`rev4-koleksiyon`) | 3 small, optional goals per ISO week (Mon 00:00 local), picked from a manifest pool by `hash(userId‖week) mod n` (stable per user/week, works offline). Examples: "3 gün check-in yap" (3), "2 kez bir baş etme aracı dene" (2), "Sığınağında bir parçanın yerini değiştir" (1). Progress is derived from events in the week. | 1 collection item each, granted automatically on completion (no "claim" button). **No lights**: the light rules stay exactly as they are. | events + manifest |
| **Collections** | Sets: Kristaller (6), Tilki aksesuarları (6), Sığınak süsleri (12), plus seasonal sets. Items come from milestones (`day-60`, `day-90`, … from the manifest), weekly goals, chapter completion (1 accessory per finished chapter) and seasonal events. | Cosmetics only: place a decor item on a piece slot, or put an accessory on the fox. | `collection.earned` (synced, grow-only) |
| **Seasonal events** | Time-boxed windows in the manifest (e.g. "Sonbahar şenliği", until 30 Kasım). Progress = lights **earned during the window** (a counter of normal lights; nothing is spent). | 1 event item at a light target (e.g. 5). It stays collectible later via a "geçmiş etkinlik" item, so there is no FOMO lock-out. | events + manifest window |
| **Personalize / rearrange** | "Sığınağını düzenle": swap which earned decor sits on each built piece, choose the fox's accessory, and reorder Sığınak decor slots. Counts toward the "yerini değiştir" goal. | Visual only. | `personalization` (synced) |
| **Endless day milestones** | After Gün 30: Gün 60, 90, 180, 365 and every 365 after that, all defined in the manifest. The same non-clinical copy rules apply (time and effort only). | A collection item; the milestone screen. | `milestones.seen` + manifest |

Rules: goals never carry over, never show "failed" or red, and never expire with a loss message. Caption **"Hedefler isteğe bağlı. Tamamlanmayan hedef bir şey kaybettirmez; yeni hafta yeni hedeflerle başlar."** (**NEW**). Seasonal items can still be earned later, so missing an event costs nothing permanent.

**Koleksiyon screen (`rev4-koleksiyon`, pushed, no tab bar):** back `CaretLeft` + title/md **"Koleksiyon"** (**NEW**) + light chip. Then:
- Seasonal banner (surface/hero, radius 20): `Leaf` fill tile, eyebrow **"MEVSİM ETKİNLİĞİ · 30 KASIM’A KADAR"**, **"Sonbahar şenliği"**, gold bar and **"3 / 5 ışık"** (**NEW**).
- **"Bu haftanın hedefleri"** + **"Pazartesi yenilenir"** (**NEW**): 3 rows, each with a ring 40 "a/n" (gold arc; teal_deep filled `Check` when done), the goal title and a reward line with the item icon ("Kristal lamba", **"Kazandın: Kuvars"** when done) (**NEW**).
- **"Koleksiyonlar"** + "9 / 24": chips "Kristaller 4/6" · "Aksesuarlar 2/6" · "Süsler 3/12" (**NEW**). Grid of 108 × 100 tiles: owned items have a gold_soft circle, gold border and name; unowned items have a dashed circle and their source ("Gün 60", "Haftalık hedef"), so it's clear how to get them without pressure.

### 19.4 Remote content (manifest) — storage, caching, offline, versioning
The repo already uses **Supabase** (`@supabase/supabase-js` in `src/data/store.ts`, with `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`), so the content uses it too. There is no new vendor.

**Storage (proposal; not applied):**
```sql
-- supabase/migrations/202611020002_content_manifests.sql  (PROPOSAL — not applied)
create table public.content_manifests (
  id               bigint generated always as identity primary key,
  channel          text not null default 'prod' check (channel in ('prod','beta')),
  version          integer not null,                 -- monotonically increasing per channel
  schema_version   smallint not null default 1,      -- manifest JSON schema major
  min_app_version  text not null default '1.0.0',    -- clients below this ignore the row
  published_at     timestamptz not null,             -- schedule drops in advance
  manifest         jsonb not null check (pg_column_size(manifest) < 524288),
  created_at       timestamptz not null default now(),
  unique (channel, version)
);
alter table public.content_manifests enable row level security;
create policy "read published manifests" on public.content_manifests
  for select to anon, authenticated using (published_at <= now());
-- no insert/update/delete policies: only the dashboard / service role (CI) writes.
create index content_manifests_latest on public.content_manifests (channel, version desc);
```
- **Art:** Supabase Storage public bucket `content`, at `chapters/{chapterId}/{name}.{contentHash}@2x.png`. File names are content-hashed, so they are immutable and cacheable forever (`cacheControl: 31536000`). The manifest refers to them by path and hash.
- **Publishing:** the team (or CI from a `content/` repo folder) inserts a new row with `version = last + 1` and a future `published_at`. This needs **no app update**. Rollback means inserting a new higher version that restores the old content (rows are append-only).

**Client fetch and cache:**
1. On cold start and on foreground (throttled to once per 6 h; also from the existing pull-to-refresh / sync), run `select version, schema_version, min_app_version, manifest from content_manifests where channel = $1 order by version desc limit 1`. RLS hides unpublished rows.
2. If `version` > cached version, `schema_version` is supported, and `min_app_version` ≤ app: validate with `parseManifest` (hand-written, like `parseAppState`: unknown fields are ignored; an invalid chapter or item is dropped, not the whole manifest; piece and item ids are unique). Then store it as `quit-content-manifest-v1 = {version, fetchedAt, manifest}` in `expo-sqlite/localStorage`.
3. **Prefetch** art only for the current chapter, the next (teaser) chapter and the current goals/season (`expo-image` `Image.prefetch`, disk cache). Fallback while art is missing: the Phosphor icon from the manifest (`icon` field). This is exactly what the mockups show, so the UI is complete without bitmaps.
4. **Offline / first launch:** the bundled `src/content/manifest.bundled.json` (chapters 1–3, 1 goal pool, no seasons, `version: 0`) is used whenever there is no valid cache. The effective manifest is max(bundled, cached) by version.
5. **Never downgrade.** A lower remote version is ignored. **Never remove progress:** once a chapter/piece/item id has been published it must stay in later manifests (retire it with `"retired": true` so new users don't get it). The client keeps `collection.earned` regardless of the manifest, and unknown ids render as a generic gift icon.
6. **Versioning:** `version` is the content revision (an integer). `schema_version` is the JSON shape (a major bump means old clients keep using their last compatible cache; additive fields don't bump it). `min_app_version` gates content that needs new client features.

**Derived progress (no new sync for chapters):** `builtPieces = min(totalPublishedPieces, floor(lights / 2))`. The chapter and piece states are a pure function of `lights` and the manifest, so a new chapter instantly shows banked lights as built pieces (several unlocks are played one after another, max 3 animated, the rest appear built). This replaces the §16 formulas `min(12…)/min(24…)`; there is **no cap**.

**User-side synced state (same pattern as `milestones`, §15; top-level optional fields that old clients drop):**
```ts
collection?: { earned: { id: string; at: string; source: 'goal'|'milestone'|'chapter'|'season' }[] }  // grow-only, union on conflict, cap 2000
personalization?: { foxAccessory?: string; slots?: Record<string /*pieceId*/, string /*itemId*/>; updatedAt: string } // last-writer-wins by updatedAt
```
Goal and season progress are **derived** from events (not stored). The goal pick is deterministic per user and week. The optional SQL CHECK from §15 can extend to these keys.

### 19.5 Manifest JSON Schema (draft 2020-12) + example
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://quit-companion/content-manifest.schema.json",
  "title": "Sığınak content manifest",
  "type": "object",
  "required": ["schemaVersion", "version", "chapters"],
  "properties": {
    "schemaVersion": { "const": 1 },
    "version": { "type": "integer", "minimum": 0 },
    "lightsPerPiece": { "type": "integer", "const": 2 },
    "chapters": {
      "type": "array", "minItems": 1,
      "items": {
        "type": "object",
        "required": ["id", "order", "eyebrow", "title", "pieces"],
        "properties": {
          "id": { "type": "string", "pattern": "^ch-[a-z0-9-]+$" },
          "order": { "type": "integer", "minimum": 1 },
          "eyebrow": { "type": "string", "maxLength": 24 },
          "title": { "type": "string", "maxLength": 40 },
          "theme": { "type": "object", "properties": {
            "scene": { "enum": ["day", "dusk", "night", "snow"] },
            "art": { "type": "string" } } },
          "teaser": { "type": "object", "properties": {
            "previewIcons": { "type": "array", "items": { "type": "string" }, "maxItems": 3 },
            "opensAt": { "type": "string", "format": "date-time" } } },
          "pieces": { "type": "array", "minItems": 6, "maxItems": 6, "items": { "$ref": "#/$defs/piece" } },
          "completionReward": { "type": "string" },
          "retired": { "type": "boolean" }
        }
      }
    },
    "upcoming": { "type": "object", "description": "Shown when the user has built every published piece",
      "properties": { "chapterOrder": { "type": "integer" }, "eyebrow": { "type": "string" }, "title": { "type": "string" },
        "opensAt": { "type": ["string", "null"], "format": "date-time" } } },
    "milestones": { "type": "array", "items": { "type": "object", "required": ["key", "day"],
      "properties": { "key": { "type": "string", "pattern": "^day-[0-9]+$" }, "day": { "type": "integer", "minimum": 1 },
        "reward": { "type": "string" }, "copy": { "$ref": "#/$defs/milestoneCopy" } } } },
    "goalPool": { "type": "array", "items": { "type": "object", "required": ["id", "metric", "target", "title", "reward"],
      "properties": { "id": { "type": "string" },
        "metric": { "enum": ["checkinDays", "copingSessions", "rearrange", "reasonRead"] },
        "target": { "type": "integer", "minimum": 1, "maximum": 5 },
        "title": { "type": "string", "maxLength": 48 }, "reward": { "type": "string" } } } },
    "seasons": { "type": "array", "items": { "type": "object", "required": ["id", "title", "startsAt", "endsAt", "lightTarget", "reward"],
      "properties": { "id": { "type": "string" }, "title": { "type": "string" }, "icon": { "type": "string" },
        "startsAt": { "type": "string", "format": "date-time" }, "endsAt": { "type": "string", "format": "date-time" },
        "lightTarget": { "type": "integer", "minimum": 1, "maximum": 14 }, "reward": { "type": "string" } } } },
    "items": { "type": "array", "items": { "type": "object", "required": ["id", "set", "name", "icon"],
      "properties": { "id": { "type": "string" }, "set": { "enum": ["crystals", "fox-accessories", "decor", "season"] },
        "name": { "type": "string", "maxLength": 24 }, "icon": { "type": "string" }, "art": { "type": "string" },
        "retired": { "type": "boolean" } } } }
  },
  "$defs": {
    "piece": { "type": "object", "required": ["id", "name", "icon"],
      "properties": { "id": { "type": "string", "pattern": "^pc-[a-z0-9-]+$" }, "name": { "type": "string", "maxLength": 24 },
        "icon": { "type": "string", "description": "Phosphor name, used as fallback art" }, "art": { "type": "string" } } },
    "milestoneCopy": { "type": "object", "required": ["eyebrow", "lead", "body", "slipEyebrow", "slipLead", "slipBody"],
      "properties": { "eyebrow": { "type": "string" }, "lead": { "type": "string" }, "body": { "type": "string" },
        "slipEyebrow": { "type": "string" }, "slipLead": { "type": "string" }, "slipBody": { "type": "string" } } }
  }
}
```
Example (abridged; `version 7`, with chapters 1–4 published and 5 upcoming):
```json
{
  "schemaVersion": 1, "version": 7, "lightsPerPiece": 2,
  "chapters": [
    { "id": "ch-temel", "order": 1, "eyebrow": "BÖLÜM 1 · TEMEL", "title": "Sığınağın ilk odası", "theme": { "scene": "day" },
      "pieces": [ { "id": "pc-temel", "name": "Sığınak temeli", "icon": "house-simple" }, { "id": "pc-isiklar", "name": "Sıcak ışıklar", "icon": "lamp" },
                  { "id": "pc-dinlenme", "name": "Dinlenme köşesi", "icon": "armchair" }, { "id": "pc-pencere", "name": "Pencere", "icon": "grid-four" },
                  { "id": "pc-yesil", "name": "Yeşil köşe", "icon": "plant" }, { "id": "pc-kitaplik", "name": "Kitaplık", "icon": "books" } ],
      "completionReward": "it-atki" },
    { "id": "ch-bahce", "order": 2, "eyebrow": "BÖLÜM 2 · BAHÇE", "title": "Sığınağın bahçesi", "theme": { "scene": "day" },
      "teaser": { "previewIcons": ["door-open", "flower-tulip", "bird"] },
      "pieces": [ { "id": "pc-bahce-kapisi", "name": "Bahçe kapısı", "icon": "door-open",
                    "art": "chapters/ch-bahce/bahce-kapisi.3f9a1c.png" }, "…5 more" ] },
    { "id": "ch-dere", "order": 3, "eyebrow": "BÖLÜM 3 · DERE KENARI", "title": "Suyun sesi", "pieces": ["…6"] },
    { "id": "ch-orman", "order": 4, "eyebrow": "BÖLÜM 4 · ORMAN YOLU", "title": "Ağaçların arası", "pieces": ["…6"] }
  ],
  "upcoming": { "chapterOrder": 5, "eyebrow": "BÖLÜM 5 · YILDIZ TERASI", "title": "Gece göğü", "opensAt": "2026-11-06T09:00:00+03:00" },
  "milestones": [ { "key": "day-60", "day": 60, "reward": "it-aytasi", "copy": { "eyebrow": "İKİ AY OLDU", "lead": "…", "body": "…",
                    "slipEyebrow": "YOLCULUĞUN DEVAM EDİYOR", "slipLead": "…", "slipBody": "…" } } ],
  "goalPool": [ { "id": "g-checkin-3", "metric": "checkinDays", "target": 3, "title": "3 gün check-in yap", "reward": "it-kristal-lamba" },
                { "id": "g-coping-2", "metric": "copingSessions", "target": 2, "title": "2 kez bir baş etme aracı dene", "reward": "it-kuvars" },
                { "id": "g-rearrange-1", "metric": "rearrange", "target": 1, "title": "Sığınağında bir parçanın yerini değiştir", "reward": "it-atki" } ],
  "seasons": [ { "id": "s-sonbahar-2026", "title": "Sonbahar şenliği", "icon": "leaf", "startsAt": "2026-11-01T00:00:00+03:00",
                 "endsAt": "2026-11-30T23:59:59+03:00", "lightTarget": 5, "reward": "it-yaprak-susu" } ],
  "items": [ { "id": "it-ametist", "set": "crystals", "name": "Ametist", "icon": "diamond" },
             { "id": "it-kuvars", "set": "crystals", "name": "Kuvars", "icon": "diamonds-four" },
             { "id": "it-atki", "set": "fox-accessories", "name": "Atkı", "icon": "t-shirt" } ]
}
```
Copy in the manifest has to follow the same editorial rules as the app (no clinical claims, no mascot name, slip variants for milestones). Content QA checks this before `published_at`.

### 19.6 Reached the end of current content (`rev4-icerik-sonu`)
Shown in place of the path's fog teaser when `builtPieces === totalPublishedPieces` (sample: 50 lights, chapters 1–4 published, so 48 are used and 2 are banked). It is **never** called "bitti" or "tamamlandı".
1. Day scene h 290 (horizonY 210) · title "Sığınağın" · collection button · light chip "50 ışık" · `fox_calm` (120, 96) w 150 · fog band at y 196 over the horizon.
2. Sheet from y 266, radius 32:
   - `CloudFog` + eyebrow text/accent **"BÖLÜM 5 · YILDIZ TERASI"** (from `upcoming`), title/lg **"Sisin ardında yeni bir yer hazırlanıyor."** (**NEW**), body-md **"Şu an açık olan her parçayı yerine koydun. Işıkların birikmeye devam ediyor; yeni bölüm açılınca yolunu hemen aydınlatacak."** (**NEW**)
   - Countdown card: `Hourglass` gold tile · **"Açılmasına"** / **"4 gün"** (**NEW**; from `upcoming.opensAt`, day granularity, no seconds ticking; if `opensAt` is null → **"Yakında"** **NEW**) · right **"2 ışık hazır"** / **"ilk parçaya gider"** (**NEW**; `lights − 2·totalPublishedPieces`).
   - Eyebrow **"BU ARADA"** (**NEW**) · 2 cards **"Haftalık hedefler"** "1 / 3 tamam" and **"Koleksiyon"** "9 / 24 parça" (**NEW**) → `rev4-koleksiyon` · secondary button `PaintBrush` **"Sığınağını düzenle"** (**NEW**).
3. When the chapter publishes, the next manifest fetch makes `builtPieces` jump. On the next Sığınak open, play the chapter handoff (as in §16 `rev4-bolum2-2-bahce`, with chapter data), then the banked unlocks. Haptics follow §13.
- Slip during waiting: nothing changes. Removing a record still recalculates honestly (existing dialog).

### 19.7 Updates to earlier rev 4 sections
- §16 "Sığınak tamamlandı" now means **nothing**. Remove the string from `App.tsx` L809 (`builtPieces === pieces.length ? 'Sığınak tamamlandı' : …`). With an endless manifest that state only occurs as §19.6.
- §16 `builtPieces = min(12…)`, `nextThreshold = min(24…)` and "07b card when before < 24" are replaced by the manifest-driven formulas (§19.4). Bölüm 2's celebration and handoff become the generic **chapter transition** (key `chapter-{n}` in `milestones.seen`). The milestone key pattern widens to `^(day-\d+|chapter-\d+)$`, which still applies the unknown-key drop rule.
- §15 export `formatVersion 2` also includes `collection` and `personalization`.

### Rev 4 copy — NEW strings (endless additions)
| Screen | String |
|---|---|
| Fog teaser | "Sisin ardında yeni bir yer var" · "{threshold}. ışıkta açılır · {n} ışık kaldı" · a11y "Koleksiyon ve hedefler" |
| Chapter names | as in §19.1 (eyebrows "BÖLÜM 3 · DERE KENARI" … "BÖLÜM 8 · TEPE", titles "Suyun sesi", "Ağaçların arası", "Gece göğü", "Sıcak bir köşe", "Deniz feneri", "Manzara", and all piece names) |
| İçerik sonu | "Sisin ardında yeni bir yer hazırlanıyor." · "Şu an açık olan her parçayı yerine koydun. Işıkların birikmeye devam ediyor; yeni bölüm açılınca yolunu hemen aydınlatacak." · "Açılmasına" · "{n} gün" · "Yakında" · "{n} ışık hazır" · "ilk parçaya gider" · "Bu arada" · "Haftalık hedefler" · "{a} / {b} tamam" · "Koleksiyon" · "{a} / {b} parça" · "Sığınağını düzenle" |
| Koleksiyon | "Koleksiyon" · "Mevsim etkinliği · {tarih}’e kadar" · "Sonbahar şenliği" · "{a} / {b} ışık" · "Bu haftanın hedefleri" · "Pazartesi yenilenir" · "3 gün check-in yap" · "2 kez bir baş etme aracı dene" · "Sığınağında bir parçanın yerini değiştir" · "Kazandın: {item}" · "Hedefler isteğe bağlı. Tamamlanmayan hedef bir şey kaybettirmez; yeni hafta yeni hedeflerle başlar." · "Koleksiyonlar" · "Kristaller" · "Aksesuarlar" · "Süsler" · items "Ametist", "Kuvars", "Akuamarin", "Ay taşı", "Kristal lamba", "Tilki için atkı" · sources "Gün 60", "Haftalık hedef" |

### 19.8 Open questions (endless)
11. **Release cadence:** 1 chapter every 2 weeks plus weekly goals/season drops? Who writes and QA's the manifest copy?
12. **Fox accessories art:** these need new layered mascot art (a hat/scarf on the shared 683 px canvas). Until then, show the icon placeholders?
13. **Seasonal light target** (5 lights in a month window): OK, or scale it to the window length?
14. **`content_manifests` migration** (§19.4): apply as proposed, or start with a single Storage JSON file (`content/manifest.json`, read through the CDN with an ETag)? The table gives RLS-scheduled publishing; the file is simpler.
15. **Chapter art:** keep Phosphor icons in node circles (as mocked) or move to illustrated piece art per chapter?
