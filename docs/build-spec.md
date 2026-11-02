# Build spec — Sigarayı bırakma uygulaması · **rev 5.5** (2026-11-02)

> **Who this is for:** Kodcu, building in Expo / React Native.
> **Source of truth for rev 5:** the HTML mockups in `mock3/` (rendered to `rev3-*.png`), `mock4/` (rendered to `rev4-*.png`) and `mock5/` (dark mode, rendered to `rev5-*.png`; the light rev 4 mockups are unchanged), plus `content/` (manifest schema, example, checker) and `proposals/` (migrations, suffix helper). In `mock4/`: `s_path.py`, `s_tabs.py`, `layers_path.json`, `layers_tabs.json`), plus this file. Every value below is one that the mockups actually use (`mock3/lib.py`, `s_home.py`, `s_onb.py`, `s_dark.py`). Mascot and FX positions are machine-dumped into `mock3/layers_*.json`.
> **Figma is stale.** File `ZjSkenPoymNvS3c9SjKgVj` stops at rev 2. It still has `terracotta/600 = #C9502F` and the old Yuva/Sığınak frames. The Figma MCP monthly limit is used up, so rev 3, rev 4 and rev 5 were not pushed there. **Where Figma and this file disagree, this file wins.**
> Backups: `src/build-spec.rev1.bak.md`, `src/build-spec.rev2.bak.md`, `src/build-spec.rev3.bak.md`, `src/build-spec.rev4.bak.md`, `src/build-spec.rev5.bak.md`, `src/build-spec.rev5.1.bak.md`, `src/build-spec.rev5.2.bak.md`, `src/build-spec.rev5.3.bak.md`, `src/build-spec.rev5.4.bak.md`.
> **Rev 5.5** (changelog below): Bölüm 5–8, the accessories and Kış şenliği are **approved**; Turkish diacritic spelling check in the checker. **Rev 5.4**: full Bölüm 5–8 copy (pending), the winter event "Kış şenliği" (reward Bere), new Bölüm 5/6 accessories and their art briefs. **Rev 5.3**: nothing paid, no Supabase branch, no keys for bots; Umut uploads beta and prod. **Rev 5.2** bans the verbs *yak-* and burn-sense *yan-* from all copy. **Rev 5.1** edits §1, §6, §17.2, §19.1, §19.5, §20–§22, §24, §25 and §12c in place, marked *rev 5.1*. Some of its decisions still await Umut's confirmation; each changelog row says who decided.
> **Rev 5 sections are §20–§25 and §12c** (appended at the end). §14, §15, §19.1, §19.4 and §19.5 were edited where rev 5 changed them (marked *rev 5*). Rev 4 sections are §13–§19 and §12b.
> **Nothing was run against Supabase.** The migrations in §21 are files only; they were tested on an in-memory Postgres on the build box.
> The repo (`SntrkUmut/addiction`) was **not modified**. Code facts below are read-only observations of `App.tsx` and `src/` @ `faa0e16`.

**Hard rules (unchanged, apply everywhere)**
- 1 check-in per day = **1 light**. Each completed coping session = **1 light** (`src/domain/rewards.ts → earnedLight`).
- A slip **never** punishes, relocks or resets anything: lights, pieces, path nodes, journey days and milestones are untouched. Slip variants only change words, never visuals.
- The shield, crystal, gem and sparkle FX are **decoration only**. They carry no game meaning (no HP, no streak, no "breaks").
- No medical or clinical claims. The mascot has **no name**.
- Haptics: **allowed, light and purposeful** (*rev 4*, see §13). Never on slips or errors. One per moment. Respect the in-app toggle, reduce motion and system settings.
- Day counts are **journey days** since `quitDate`; nothing resets on a slip (*rev 4*, §14).

---

## Changelog rev 5.5 (2026-11-02, 18:38 Europe/Istanbul)

| # | Change | Decided by | Where |
|---|---|---|---|
| 5.5-1 | **Approved:** the Bölüm 5–8 copy, the piece renames (Örgü sepeti, Kâğıt fırıldak, Deniz kabukları, Tepe flaması, Pusula), the accessories Yıldız rozeti, Örgü eldiven, Şemsiye and Rüzgârlık, and **Kış şenliği with a target of 8 lights**. All 13 ids are now `copyStatus: "approved"`; the manifest example is **v11** and passes `--channel prod`. | **onay: koordinatör asistan, Umut'un yetkisiyle olduğunu belirtti** | §19.1, §22b, §25, §19.5 |
| 5.5-2 | **"Kis şenliği" typo check:** the files already said **"Kış şenliği"** everywhere (spec 15× before this rev, manifest 2×, build script 2×; no "Kis/KIS" in any copy). The ASCII forms `s-kis-2026`, `ch-kis-odasi` and `pc-kis-bitkisi` are ids, and the schema requires ASCII there. Nothing to fix. | onay: koordinatör asistan, Umut'un yetkisiyle olduğunu belirtti | — |
| 5.5-3 | **Full Turkish diacritic scan** (ı/i, ş/s, ğ/g, ç/c, ö/o, ü/u, â/a, ASCII-fied words) of the spec, the manifest, the mockup generators (`mock*/`), the proposals, the repo's `App.tsx` + `src/` strings and a11y labels (read-only), and `/workspace/mascot/accessories/README.md` (read-only). **No real errors found** (details in §24.4a). | onay: koordinatör asistan, Umut'un yetkisiyle olduğunu belirtti | §24.4a |
| 5.5-4 | **Checker:** new Turkish spelling rule (`content/tr_spell.py`, wordlist `content/tr_words.txt`, rebuilt by `content/build_tr_words.py`). **Warning on beta, error on prod.** Tests now **35/35**. | onay: koordinatör asistan, Umut'un yetkisiyle olduğunu belirtti | §24.4, §24.4a |
| 5.5-5 | Open questions 31 and 32 closed. | onay: koordinatör asistan, Umut'un yetkisiyle olduğunu belirtti | §12c |

---

## Changelog rev 5.4 (2026-11-02, 18:30 Europe/Istanbul)

All rows: **karar: koordinatör asistan (Umut'un yetkisiyle olduğunu belirtti)**. All new copy is `copyStatus: "pending"` until the coordinating assistant reviews it.

| # | Change | Where |
|---|---|---|
| 5.4-1 | **Bölüm 5–8 full copy** (fog teaser, intro, 6 pieces + lines, completion with the §23 suffix CTA, accessory, 2 "bu hafta" goals with decor rewards). In the manifest example **v10** (8 chapters, 48 pieces) as `pending`. | §19.1, **§22b**, §19.5 |
| 5.4-2 | **Winter event "Kış şenliği"** (`s-kis-2026`, 1 Aralık 2026 → 31 Ocak 2027, 8 lights, decoration only) rewards **Bere** (`it-bere`, existing art). | §19.3, §22b.5, §25 |
| 5.4-3 | **Bölüm 5 accessory:** "Yıldızlı bere" → **Yıldız rozeti** (`it-yildiz-rozeti`, a star pin on the chest). Not headwear (Bere is the winter reward), not neckwear (Atkı). | §25, §25.1 |
| 5.4-4 | **Bölüm 6 accessory:** "Kapüşonlu" → **Örgü eldiven** (`it-orgu-eldiven`, knitted mittens). A hood covers the head, so it clashed with Bere/Hasır şapka, and its `hoodie` icon clashed with the ch6 piece. The ch6 piece "Kalın battaniye" `Hoodie` → **Örgü sepeti** `yarn`. | §25, §19.1 |
| 5.4-5 | **Bölüm 8 accessory Rüzgârlık kept** (a light, hoodless jacket). The ch7 piece "Tüy rüzgârlığı" → **Kâğıt fırıldak** `pinwheel`. Open question 29 closed. | §25, §19.1, §12c |
| 5.4-6 | Duplicate icons in the draft pieces replaced: ch7 Kum tepesi `Cactus` → **Deniz kabukları** `spiral`; ch8 Tepe çadırı `Tent` (= ch4 Küçük çadır) → **Tepe flaması** `flag-banner`; ch8 Seyir köprüsü `Bridge` (= ch3 Küçük köprü) → **Pusula** `compass`; ch8 Gün doğumu `SunHorizon` (= ch7 Gün batımı) → `sun`. | §19.1, §22b |
| 5.4-7 | `upcoming` now announces **Bölüm 9** with `opensAt: null` ("Yakında"). Checker tests: the example is refused on prod (13 pending ids, as intended) and an approved-only subset passes prod; 24/24. | §19.5, §22b |
| 5.4-8 | §25.1 art briefs for Yıldız rozeti, Örgü eldiven and Rüzgârlık (shape, hex, bbox, layer, anchor, poses). | §25.1 |

---

## Changelog rev 5.3 (2026-11-02, 18:15 Europe/Istanbul)

| # | Change | Decided by | Where |
|---|---|---|---|
| 5.3-1 | **Nothing paid is used.** No Supabase branch and no staging project. Bots hold **no Supabase write key of any kind**, neither beta nor prod. This supersedes 5.1-9 step 2, the branch-based beta in 5.1-4 / §24.1, and the CI beta upload. | **karar: Umut** | §21.0, §24 |
| 5.3-2 | **Migration testing:** (1) bots/Kodcu test locally (PGlite + local `supabase start` / `supabase db reset`), then (2) **Umut applies to prod**. The branch step is dropped. | **karar: Umut** | §21.0 |
| 5.3-3 | **Publishing:** bots prepare content as files, test it locally (checker + tests + local `supabase start` with the beta and prod inserts), and deliver a **tested publish bundle**. **Umut does both the beta and the prod uploads himself** once he connects his account. Beta and prod are the two `channel` rows of the same (free) project. | **karar: Umut** | §21, §24.1–24.3 |
| 5.3-4 | Open question 28 (beta environment) is **closed**. Open question 24 is updated. | **karar: Umut** | §12c |

---

## Changelog rev 5.2 (2026-11-02, 18:10 Europe/Istanbul)

All rows: **karar: koordinatör asistan, Umut'a bildirildi**. Revert from `src/build-spec.rev5.1.bak.md`.

**Rule:** the verb *yak-* evokes "sigara yakmak", so it is **not used anywhere in the app**: copy, accessibility labels, notifications, manifest content or the spec's string tables. The verb *yan-* in its burn/light sense ("yandı", "yanıyor", "yanan"…) is banned too. Use *parla-*, *kazan* or *açıl-* in the same calm tone. Look-alikes stay allowed: yakın, yakında, yaklaşık, yaklaş-, yaka, yakala-, yakış-, yakıt, yakut, yan, yanında, yanıt, yanlış, yanak, yanaş-, yansı-, yanıl-. "Yolunu aydınlatacak" is fine.

| # | Where | Before | After |
|---|---|---|---|
| 5.2-1 | Check-in quest, pending state (§9 copy table; §12 approvals list) | "Bugünün ışığını yak" | **"Bugünün ışığını kazan"** |
| 5.2-2 | Yuva check-in quest, done state (§5 Yuva layout, §9 copy table; mockup `rev5-yuva.png`) | "Bugünün ışığı yandı" | **"Bugünün ışığı parladı"** |
| 5.2-3 | Bölüm 5 `upcoming.teaserLine` (manifest, §22, §19.5 example) | "Yukarıda bir terasın ışıkları yanıyor." | **"Yukarıda bir terasın ışıkları parlıyor."** |
| 5.2-4 | §19.1a scan table and §12c-27 (rev 5.1 had "kept" these) | — | replaced by this rule; q27 closed |
| 5.2-5 | `content/editorial.py` (new) + `check_manifest.py` | — | morphology-aware matchers for *yak-* and burn-sense *yan-* (Turkish-aware lowercasing, so "YAKTIN" and "IŞIĞI YANDI" are caught) → `editorial: banned verb '…'; use parla- / kazan / açıl-` |
| 5.2-6 | `content/test_check_manifest.py` | 17 cases | **23/23 pass**. New: "Bugünün ışığını yak" intro, "IŞIĞI YAKTIN" name, the old teaser "yanıyor", "Fener bütün gece yandı.", a look-alike manifest ("Yakında: kıyıya yakın, yanında yaklaşık bir yol." passes), and a word-list test (27 burn forms caught, 34 look-alikes allowed). The candle fixture is now "Pencerede bir mum." so it tests *mum* only. |
| 5.2-7 | Manifest | v8 | **v9** (teaser change). beta ✔, prod ✔, prod `--previous v8` ✔; the old v8 is now rejected by the new rule (`yanıyor`). PGlite migration test 41/41. |

Scanned with no other hits: the rest of the spec, all a11y labels in §9, §13, §19 and §20, the manifest, mockup generators `mock3–5`, `proposals/` (Turkish suffix helper labels and tests: none), and `App.tsx` + `src/` @ `faa0e16`. **`App.tsx` has no *yak-*/*yan-* burn strings today** (only yaklaşık ×8, yaklaşıyor, yanlış, yanında, yanıtın, all allowed), so **Kodcu changes nothing existing**. Kodcu implements the new quest strings (5.2-1, 5.2-2) with the new wording when building §5/§9. The light `rev3-yuva*.png` still show "yandı"; follow this spec.

---

## Changelog rev 5.1 (2026-11-02, 18:00–18:10 Europe/Istanbul)

Every row says **who decided it**, so any row can be reverted on its own:
- **Umut** = Umut's own decision, relayed to me.
- **onay: koordinatör asistan, Umut'un yetkisiyle** = copy approved by Umut's coordinating assistant on his authority.
- **karar: koordinatör asistan, Umut onayı bekleniyor** = a decision by the coordinating assistant that **Umut has not confirmed yet**. To revert one, restore the rev 5 text (backup `src/build-spec.rev5.bak.md`).

| # | Change | Decided by | Where |
|---|---|---|---|
| 5.1-1 | **Bölüm 3 & 4 copy approved** as written in §22, including its changes vs rev 4: Kamp ateşi removed, Berrak gölet, Sırt çantası as the Bölüm 4 accessory. `copyStatus` → `approved`. | **Umut** | §22, §19.1, manifest |
| 5.1-2 | **The other pending manifest copy is approved:** Bölüm 1–2 intro and completion, Gün 60 / Gün 90, the Bölüm 5 `upcoming` teaser, the Bölüm 3–4 goals, and the collection item names. Two fixes: **(a)** the Bölüm 2 completion title is now **"Sığınağın bahçesi hazır."**; **(b)** `g-orman-coping-2` is now **"Ağaçların arasında mola: bu hafta 2 kez bir baş etme aracı dene"**. Manifest v7 → **v8**; every `copyStatus` is `approved`. | **onay: koordinatör asistan, Umut'un yetkisiyle** | §19.5, §22, §25, manifest |
| 5.1-3 | **Dark mode follows the phone by default, and Ben gets a manual choice:** "Görünüm: Sistem / Açık / Koyu", a segmented control in Ben → DENEYİM. **Local-only** device setting `quit-companion-appearance-v1`, not synced. Mockups `rev5-ben.png` (dark) and `rev5-ben-acik.png` (light) were re-rendered. | **Umut** | §20.1, §20.5 |
| 5.1-4 | **Content workflow:** bots prepare and test each 2-week drop on **BETA**. **Umut approves and publishes to PROD himself.** The prod Supabase service role key stays with Umut only; no bot holds it. | **Umut** | §21, §24 |
| 5.1-5 | **No fire or smoke imagery anywhere.** Bölüm 6 "Şömine" `Fire` → **"Sıcak çay köşesi"** `TeaBag`. Bölüm 5 "Sıcak içecek" `Coffee` (a steam icon, and a second hot drink) → **"Gece defteri"** `BookOpenText`. `fx_smoke` is now "never used". The checker rejects fire, smoke and steam cue words and icons. The full scan is in §19.1a. | **karar: koordinatör asistan, Umut onayı bekleniyor** | §19.1, §6, §20.4, §24.4, checker |
| 5.1-6 | **Bölüm 7:** "Şemsiye" stays the Bölüm 7 **accessory**. The ch7 **piece** "Şemsiye" `Umbrella` → **"Küçük yelkenli"** `Sailboat`. Bölüm 5–8 piece names, including these replacements, remain **drafts** (not approved). | **karar: koordinatör asistan, Umut onayı bekleniyor** | §19.1, §25 |
| 5.1-7 | **"Rotam" everywhere.** The spec's "Rotan" is replaced. Kodcu changes 2 strings at App.tsx L506 (§17.2a). Mockup `rev5-rotam.png` was re-rendered; the light `rev4-rotam*.png` still show "Rotan". | **karar: koordinatör asistan, Umut onayı bekleniyor** | §17.2, §17.2a |
| 5.1-8 | **Colours:** light `ter` `#A4A79F` → **`#6E726A`** (4.55:1 on canvas, 4.87:1 on card). `ter` is allowed only on canvas and card; elsewhere use `sec`. **Gold is never text** (decoration and icons only). Gold-coloured text uses the new token **`gold_text`**: light **`#866018`** (4.90–5.63:1 on every light surface), dark **`#D9AC58`** (6.47–8.55:1). Token tables and contrast tables regenerated from `mock5/tokens.py`; `rev5-tokens.png` re-rendered. | **karar: koordinatör asistan, Umut onayı bekleniyor** | §1, §20.2, §20.3 |
| 5.1-9 | **Migration testing order:** (1) local `supabase start` + `supabase db reset`, (2) a Supabase **branch**, (3) prod, by Umut only. *Step 2 dropped in rev 5.3.* These steps are added to §21 and the §24 checklist. | **karar: koordinatör asistan, Umut onayı bekleniyor** | §21.0, §24.2 |
| 5.1-10 | Checks rerun on the box: the manifest passes on beta and on prod (all approved), and a pending chapter is still rejected on prod. `test_check_manifest.py` **17/17** (new fixtures: Şömine, a candle line, `campfire` and `coffee` icons, the prod pending rejection). PGlite migration test **41/41** (it now derives a pending v7 from the example). Open questions §12c 16–25 closed or decided; new questions 27–30. | — | §12c, §24.3 |

---

## Changelog rev 5

| # | Change | Where |
|---|---|---|
| 1 | **Chapter 1–8 themes and Bölüm 2 piece names are approved.** The §19.1 eyebrows/titles and the §16 piece names drop their NEW flags. | §16, §19.1 |
| 2 | **Remote content is decided: the `public.content_manifests` table, the `content` Storage bucket and the snapshot v2 migration.** Three ready-to-apply migration files (full SQL) are in §21. **None of them has been run.** On the box they were applied twice (to prove idempotency) to an in-memory Postgres (PGlite, PG 18) with stubbed Supabase `auth` and `storage` schemas, together with the existing `202610200001`. **41/41** checks pass, covering RLS, grants, triggers, constraints and Storage policies. The rev 4 proposals in §15 and §19.4 now point to §21. | §21, §15, §19.4 |
| 3 | **The manifest JSON Schema is final, and the example is complete:** 4 chapters × 6 pieces, upcoming Bölüm 5, 2 milestones, 8 goals, 1 season, 15 items. It validates on the box with `jsonschema` 4.26 (draft 2020-12 + format checks), plus a CI checker for rules the schema can't express (references, unique ids, contiguous order, no removed ids, banned words, smoking-cue words, and **no PENDING copy on prod**). The checker also has 10 negative tests. New fields: `copyStatus`, `intro`, `completion`, `teaser.line`, `piece.line`, `item.hint`, `goal.chapterId`, `upcoming.teaserLine`. | §19.5, files in `content/` |
| 4 | **Release cadence: a new chapter every 2 weeks.** Content pipeline and publishing checklist (T-14 → T+2), including the copy approval gate. | §24 |
| 5 | **Bölüm 3 (Dere kenarı) and Bölüm 4 (Orman yolu) have full copy:** intro, 6 pieces with flavour lines, fog teaser, completion, chapter goals and collection items. Everything is flagged **PENDING APPROVAL** (`copyStatus: "pending"`). Renames vs the rev 4 roadmap: "Su birikintisi" → "Berrak gölet" (it read as "puddle"), and "Kamp ateşi" is **removed** (fire/smoke imagery in a quit-smoking app). | §22, §19.1 |
| 6 | **The "Son 7 gün" strip stays for now** (awaiting Umut). *Superseded by #10.* | §17.2, §12c |
| 7 | **Turkish suffixes for dates and numbers.** The rule is to take the last non-zero spoken word. The helper `src/domain/turkishSuffix.ts` covers ablative, locative and dative, and also gives "{d} {Ay}’a kadar" and "Bölüm {n}’e bak". Tests: Umut's 10 cases plus 27 more, and an exhaustive cross-check of 1–2999 against an independent spell-out implementation (0 mismatches). **Fix:** the rev 4 template "{tarih}’e kadar" was wrong for most months ("30 Kasım’a kadar"). | §23, §14 |
| 8 | **Dark mode** for the main screens: semantic light → dark tokens with WCAG ratios computed on the box; the day scene becomes a **dusk** variant; mascot and FX rules (glow ×0.6–0.85, fox backlight); night screens stay as they are. Mockups: `rev5-yuva`, `rev5-siginak`, `rev5-rotam`, `rev5-ben`, `rev5-koleksiyon`, `rev5-onb-2-paket`, `rev5-istek`, `rev5-gun7`, plus `rev5-tokens.png`, `rev5-maskot-efekt.png` and `rev5-overview.png`. | §20 |
| 9 | **Fox accessories: source-of-truth list** (9 items: 1 per chapter 1–8, plus Atkı from the weekly goal). The art is made separately; until it lands, the icon placeholders are used. Change vs the rev 4 example: Bölüm 1 now gives **Yuvarlak gözlük** and Atkı comes from the "yerini değiştir" goal (matching `rev4-koleksiyon`), so no item has two sources. | §25 |
| 10 | **"Son 7 gün" strip approved (Umut, 2 Kasım 2026): it stays.** Empty days are a dashed circle; no red, no streak-loss warning. Open question 12b-8 / 12c-18 is closed. | §17.2, §12c |

New files (outside the repo): `content/manifest.schema.json`, `content/manifest.example.json`, `content/check_manifest.py`, `content/build_example.py`, `proposals/turkishSuffix.ts` (+ `.test.ts`), `proposals/supabase/migrations/2026110200{01,02,03}_*.sql`, `proposals/supabase/tests/migrations.pglite.test.mjs`, `mock5/` (dark lib `lib.py`, `tokens.py`, `sheets.py`, `overview.py`).

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
| terracotta/200 | `#F7E9E2` | neutral/400 | `#A4A79F` (*rev 5.1:* no longer used for text; borders and decoration only) |
| — | — | neutral/500 *(rev 5.1)* | `#6E726A` (text/tertiary, light) |
| — | — | gold/800 *(rev 5.1)* | `#866018` (text/gold, light) |
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
| accent/gold | gold/500 | `#D9AC58` | Light progress (rings, bars, trails), icons and decoration. *Rev 5.1:* **never used as text on light surfaces** (1.95–2.09:1). On night surfaces (o950/o900/o800) it may be text: 8.55 / 7.88 / 6.83:1. Elsewhere use text/gold. |
| text/gold *(rev 5.1)* | gold/800 · dark `#D9AC58` | `#866018` | **The only token for gold-coloured text** (eyebrows such as "GÜN 7", "+1 ışık" labels, light counts). Light 4.90–5.63:1 on canvas, card, sunken, gold_soft and hero; dark 6.47–8.55:1. |
| text/tertiary *(rev 5.1)* | neutral/500 · dark `#8C8F87` | `#6E726A` | Tertiary text and locked labels. **Only on canvas (4.55) and card (4.87)**; on sunken, gold_soft, hero or urge use text/secondary. |
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
   - Quest row 1 (68 h, radius 20, padding 12/14, tile 44 radius 14): done → surface/reward-soft, `CheckCircle` fill; title "Günlük check-in", sub "Bugünün ışığı parladı" (*rev 5.2*, was "yandı"); right side "+1" (caption 800, text/secondary) + light token 28. Pending state: card white, `CalendarCheck`, sub "Bugünün ışığını yak" **NEW**, whole row tappable → check-in sheet (existing).
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

- `fx_smoke` is **never used** (*rev 5.1*: no fire or smoke imagery anywhere; it could read as cigarette smoke). The same applies to the `fox_sad_coal` mascot pose (coal, sooty fur). Neither exists as an image file; the repo README only describes them. See §19.1a.
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
| "Günlük check-in" · **"Bugünün ışığı parladı"** (done) · **"Bugünün ışığını kazan"** (pending) | *rev 5.2:* rewritten, no *yak-/yan-* (was "yandı" / "yak") |
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
3. **Approval of NEW strings** (§9), especially Gün 1/7/14 and "Paketi ekle", "Işığın bugünün halkasına eklendi.", "Yeni parça açıldı: {piece}", "Bugünün ışığını kazan" (*rev 5.2* wording).
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

Suffix (*rev 5*): resolved. Use `sinceLabel(quitDate)` from `src/domain/turkishSuffix.ts` (§23): 2026 → "21 Ekim 2026’dan beri", 2025 → "’ten", 2027 → "’den", 2040 → "’tan", 2100 → "’den".

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

### SQL migration — *rev 5*: final file `supabase/migrations/202611020001_user_snapshots_v2.sql` (§21.1, **not run**)
The rev 4 proposal is replaced. Differences: `snapshot_version` is a **generated** column (derived from the JSON: `schemaVersion = 2` or any of `milestones` / `collection` / `personalization` present → 2, else 1). The client therefore never writes it, and it stays correct when an old client overwrites the row. Shape checks cover all three v2 keys (`seen` ≤ 256 entries with string `key`; `earned` ≤ 2000 with string `id`; `slots` is an object). They are added `not valid`, then validated in the same migration. RLS and grants are unchanged. Clients should also add `schemaVersion: 2` to the v2 snapshot payload (optional; the column works without it).

## 16. Bölüm 2 · Bahçe

### Rules
- Bölüm 1 = pieces 1–6 (lights 2…12), unchanged. **Bölüm 2 starts at the 12th light** (6th piece built).
- Bölüm 2 pieces (names **approved, rev 5**; icons from Phosphor): 7 "Bahçe kapısı" `DoorOpen` (14), 8 "Taş yol" `Footprints` (16), 9 "Çiçek tarhı" `FlowerTulip` (18), 10 "Kuş evi" `Bird` (20), 11 "Bahçe feneri" `Lightbulb` (22), 12 "Gölge ağacı" `Tree` (24).
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
1. bg/canvas; day scene h 260 (horizonY 190). Title/lg **"Rotam"** (*rev 5.1*; App.tsx currently says "Rotan", see §17.2a) · light chip. Hero: eyebrow text/accent "SENİN YOLCULUĞUN" (existing), display/xl "12" + title/lg "gün", sm-strong ink **"21 Ekim 2026’dan beri"** (**NEW**, see §14). `fox_calm` (236, 92) w 130.
2. Sheet bg/canvas from y 228, radius 32, padding 20, gap 10:
   - **Card "Kilometre taşları"** (**NEW**) + aside "2 / 4". Track: 4 stops (44 pt, §17.1 styles) at x 24/110/196/282, connected by a 4 pt sunken line with the gold fill up to today (a 12 pt primary dot with a white 2 pt border marks today). Labels "Gün N" + date ("22 Eki", short month) or "{n} gün" remaining. Tap a reached stop → replay.
   - **Card "Son 7 gün"** (**NEW**; **approved, rev 5**: stays; empty days are a dashed circle, no red, no streak-loss warning) + aside "{n} ışık": 7 columns (36 wide), each a light token 30 if that day had ≥ 1 light, otherwise a dashed 30 circle (no red, no "missed"). Day initials (Sa, Ça, Pe, Cu, Ct, Pz) and **"Bugün"** (**NEW**) in bold. Data: `earnedLight` grouped by local day for the last 7 days.
   - **Stats row** (2 cards, radius 20): `Prohibit` + "İÇİLMEYEN TAHMİNİ" / "168" / "adet · yaklaşık"; `Coins` + "TAHMİNİ TASARRUF" / "₺840" / "girdiğin paket fiyatıyla" (all existing; the empty states "—" + "Günlük miktarı ekle" / "Paket ve günlük miktarı ekle" stay).
   - Text button `Info` + "Hesap nasıl yapılıyor?" (existing title) → **bottom sheet** (`rev4-rotam-hesap`): title/md, the existing explanation verbatim (both variants), a 2-row mini table "Günlük ortalama · 14 sigara" / "Paket · ₺100 / 20 adet" and secondary "Plan bilgilerini düzenle" (existing) → Ben plan editor.
3. **Scrolled (`rev4-rotam-kayitlar`):** sticky compact bar "Rotam" + "12. gün · 7 ışık". Section "Son kayıtların" + "{n} kayıt" (existing). A grouped card of the 6 latest events (rows ≥ 60): a 36 tile (gold_soft + gold_deep icon for light-earning events; sunken + secondary for the rest; **slip uses `ArrowCounterClockwise` in neutral grey, never red**), the existing event label, a relative time **"Bugün 09:12" / "Dün 21:40" / "30 Eki 18:05"** (**NEW** format), "+1" + token 16 on light-earning rows, and a 44 pt `DotsThree` → action sheet "Kaydı kaldır" → the existing confirm dialog. Footer row **"Tümünü gör"** (**NEW**) → full list (same rows, paged by 50).
   - Buttons: secondary "Check-in" (`CalendarCheck`) and quiet outlined "Kayma kaydet" (`ArrowCounterClockwise`), both existing. Under them, caption **"Kayma kaydı önceki emeğini silmez; yolun ve ışıkların yerinde kalır."** (**NEW**, a softer echo of the existing slip dialog).
   - Disclaimer note (sunken, radius 16, `Info`): "Bu göstergeler yaklaşık kişisel takip değerleridir; sağlık sonucunu ölçmez veya garanti etmez." (existing)
   - Empty state (no events): the existing "Burada yolculuğun görünecek" / "Check-in veya baş etme aracı kullandığında kayıtların burada toplanır." card replaces the list.
   - Before the quit date: hero eyebrow "BAŞLANGIÇ PLANIN" with the existing countdown text, milestones all ghost, "Son 7 gün" hidden.


### 17.2a "Rotam" everywhere — code changes for Kodcu (*rev 5.1*, karar: koordinatör asistan, Umut onayı bekleniyor; **not applied**)
The tab label is already "Rotam". Two strings in `App.tsx` @ `faa0e16` still say "Rotan":
| File · line | Now | Change to |
|---|---|---|
| `App.tsx` L506 | `<Text style={styles.eyebrow}>BUGÜN · KENDİ ROTAN</Text>` | `BUGÜN · KENDİ ROTAM` |
| `App.tsx` L506 (same line, the screen title ternary; the eyebrow shows on every tab's header) | `tab === 'progress' ? 'Rotan'` | `'Rotam'` |

Nothing else in `App.tsx` or `src/` contains "Rotan" (checked with `rg -n "Rotan|ROTAN"`). Mockups: `rev5-rotam.png` now says "Rotam". The light `rev4-rotam.png` / `rev4-rotam-kayitlar.png` still show "Rotan"; follow this section, not those PNGs.

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
*Rev 5 status: see §12c.*
1. ~~After Bölüm 2~~ → answered: endless chapters (§19). Is the Bölüm 3–8 roadmap (§19.1) OK?
2. **Bölüm 2 names:** OK with "Bahçe kapısı / Taş yol / Çiçek tarhı / Kuş evi / Bahçe feneri / Gölge ağacı"?
3. **Removal below 12 lights:** with Bölüm 2 seen, show Bölüm 1 again (current proposal; honest to the data) or keep showing Bölüm 2 with the first node "next"?
4. **"…’dan beri" suffix:** implement Turkish suffix harmony for the year, or use the suffix-free "Başlangıç: 21 Ekim 2026"?
5. **Optional SQL migration (§15):** apply the `snapshot_version` + check constraint, or keep the table unchanged (the feature works without it)?
6. **Old-client overwrite window:** is the local mirror + union enough, or should the app force-update old builds (min-version check)?
7. **Reminder time picker** instead of the text field: OK to drop "Saati kaydet"?
8. ~~**"Son 7 gün" strip**~~ → *rev 5: answered, it stays (approved; see §12c-18).* Original question: keep it? It shows effort and has no "missed" styling, but it is the closest thing to a streak visual in the app.
9. **Haptics on 07a landing:** skip by default (to avoid doubling with the coping Success), or replace the coping Success with the landing tick?
10. Still open from rev 3: dark mode for day screens; pushing rev 3/4 to Figma when the MCP limit resets.

## 19. Endless Sığınak (chapters, loops, remote content) — *rev 4 addition*

**Principle:** the Sığınak never reaches a "done, nothing left" state. There is no last chapter, no "Sığınak tamamlandı", and no final 100 % bar. The user always sees one more thing ahead: the next chapter in fog (§19.2) or, if they caught up with all published content, a waiting state with things to do meanwhile (§19.6). This is the same pattern as long-running casual games: content ships continuously and the end is never shown. **The light rules don't change:** 1 per check-in day and 1 per coping session. No currency is added, lights are **never spent**, and a slip never deletes or relocks anything.

### 19.1 Chapter roadmap (first 8; all chapters 6 pieces × 2 lights = 12 lights)
A chapter *n* opens at `12 · (n − 1)` lights. Piece *k* (0-based, global) needs `2 · (k + 1)` lights. *Rev 5:* **chapter 1–8 themes (eyebrow · title) and the Bölüm 2 piece names are approved.** The Bölüm 3–4 piece names were finalised in §22 and are **approved** (*rev 5.1*, Umut); *Rev 5.4:* the chapter 5–8 piece names and copy are written in full in **§22b** and were written in rev 5.4 and are **approved** in rev 5.5 (onay: koordinatör asistan, Umut'un yetkisiyle olduğunu belirtti). Each chapter's completion accessory is listed in §25.

| # | Chapter (eyebrow · title) | Opens at | Biome / season | Pieces (icon) | Ships |
|---|---|---|---|---|---|
| 1 | TEMEL · Sığınağın ilk odası | 0 | indoor room | Sığınak temeli `HouseSimple`, Sıcak ışıklar `Lamp`, Dinlenme köşesi `Armchair`, Pencere `GridFour`, Yeşil köşe `Plant`, Kitaplık `Books` (existing) | bundled |
| 2 | BAHÇE · Sığınağın bahçesi | 12 | garden, spring light | Bahçe kapısı `DoorOpen`, Taş yol `Footprints`, Çiçek tarhı `FlowerTulip`, Kuş evi `Bird`, Bahçe feneri `Lightbulb`, Gölge ağacı `Tree` | bundled |
| 3 | DERE KENARI · Suyun sesi | 24 | creek, summer | *rev 5, approved 5.1:* Küçük köprü `Bridge`, Berrak gölet `Drop`, Nilüferler `FlowerLotus`, Ahşap kayık `Boat`, Balıkların köşesi `Fish`, Kıyı taşları `Waves` | bundled (so a fresh install with no network still has a fogged teaser beyond Bölüm 2) |
| 4 | ORMAN YOLU · Ağaçların arası | 36 | forest, autumn | *rev 5, approved 5.1:* Çam ağacı `TreeEvergreen`, Yaprak yolu `Leaf`, Küçük çadır `Tent`, Gözlem noktası `Binoculars`, Kuş tüyü `Feather`, Orman açıklığı `Park` (Kamp ateşi removed; Sırt çantası is now the accessory) | remote |
| 5 | YILDIZ TERASI · Gece göğü | 48 | rooftop terrace, night | Teras feneri `LampPendant`, Yıldız haritası `Star`, Ay penceresi `MoonStars`, Kayan yıldız `ShootingStar`, Gezegen modeli `Planet`, Gece defteri `BookOpenText` · **approved, 5.5** | remote |
| 6 | KIŞ ODASI · Sıcak bir köşe | 60 | winter interior | Kar penceresi `Snowflake`, Sıcak çay köşesi `TeaBag`, Müzik köşesi `MusicNotes`, Gitar `Guitar`, Örgü sepeti `Yarn`, Kış bitkisi `PottedPlant` (*5.4:* Örgü sepeti replaces Kalın battaniye `Hoodie`) · **approved, 5.5** | remote |
| 7 | KIYI · Deniz feneri | 72 | seaside | Deniz feneri `Lighthouse`, Küçük yelkenli `Sailboat`, Ada manzarası `Island`, Gün batımı `SunHorizon`, Kâğıt fırıldak `Pinwheel`, Deniz kabukları `Spiral` (*5.4:* Kâğıt fırıldak replaces Tüy rüzgârlığı; Deniz kabukları replaces Kum tepesi `Cactus`) · **approved, 5.5** | remote |
| 8 | TEPE · Manzara | 84 | hilltop, all seasons | Dağ yolu `Mountains`, Bulut seyri `CloudSun`, Gökkuşağı `Rainbow`, Tepe flaması `FlagBanner`, Pusula `Compass`, Gün doğumu `Sun` (*5.4:* Tepe flaması, Pusula and `Sun` replace icons already used in ch3/ch4/ch7) · **approved, 5.5** | remote |
| 9+ | defined only in the remote manifest; the client never hard-codes a count | 96, 108, … | — | — | remote |

#### 19.1a Rev 5.1 replacement pieces and the fire/smoke scan (karar: koordinatör asistan, Umut onayı bekleniyor)
**Rule:** no fire, flame, smoke, steam, candle, ember, ash, lighter or cigarette imagery, in words or icons, anywhere (chapters, pieces, items, goals, copy, FX, mascot). Electric lamps and lanterns are fine.

| Chapter | New piece | Icon | One-line description (draft, ≤ 64) | Replaces |
|---|---|---|---|---|
| 6 · Kış odası | **Sıcak çay köşesi** | `TeaBag` | “Bir fincan çay ve acele etmeyen bir akşam.” | Şömine `Fire` |
| 5 · Yıldız terası | **Gece defteri** | `BookOpenText` | “Gökyüzünde gördüklerini not ettiğin küçük bir defter.” | Sıcak içecek `Coffee` (its icon has steam lines, which read as smoke; it would also be a second hot drink next to the tea) |
| 7 · Kıyı | **Küçük yelkenli** | `Sailboat` | “Rüzgârı arkasına almış, kıyıya yakın süzülüyor.” | the piece Şemsiye `Umbrella` (the name is kept by the ch7 accessory, §25) |

All three icons exist in Phosphor (`tea-bag`, `book-open-text`, `sailboat`; checked in the package). The art must not show steam over the cup.

**Scan results** (spec, manifest, mockup generators, repo assets read-only):
| Found | Where | Status |
|---|---|---|
| Kamp ateşi `Campfire` | ch4 piece (rev 4) | already removed in rev 5 |
| Şömine `Fire` | ch6 piece, §19.1 | **replaced** (above) |
| Sıcak içecek `Coffee` (steam) | ch5 piece, §19.1 | **replaced** (above) |
| `fx_smoke` (“Kıvrımlı gri duman”) | repo `assets/mascot/README.md` L43, L55 (layer order); spec §6 and §20.4 | only **described** in the README: no image file in `assets/mascot/`, and no code reference (`rg`). The spec now says **never used**. Kodcu: drop these rows from the README in a later cleanup (repo not touched here). |
| `fox_sad_coal` (“kömür taşı tutuyor, hafif isli kürk”, 1. Gün “Smog”) | repo `assets/mascot/README.md` L30, planned for onboarding, day 1 and **after a slip** | likewise only described: no file, no code reference, not in any mockup. **Never use**; it is fire/smoke imagery *and* would make a slip look punished. Drop it from the README in the same cleanup. |
| "Bugünün ışığını yak" / "ışığı yandı" / "terasın ışıkları yanıyor" | check-in copy, Bölüm 5 teaser | ***rev 5.2:* replaced** → "Bugünün ışığını kazan" / "Bugünün ışığı parladı" / "terasın ışıkları parlıyor". *yak-* evokes "sigara yakmak"; the checker now bans *yak-* and burn-sense *yan-* (§24.4). |
| Lanterns and lamps: Sıcak ışıklar `Lamp`, Bahçe feneri `Lightbulb`, Teras feneri `LampPendant`, Deniz feneri `Lighthouse` | ch1, 2, 5, 7 | kept: electric or lighthouse, no flame. The art must show bulbs, not candles or flames. |
| Gün batımı / Gün doğumu `SunHorizon` | ch7, ch8 | kept (sun, not fire) |
| Checker | `content/check_manifest.py` | **extended**: it rejects the cue words ateş, alev, şömine, kamp ateşi, köz, kor, mum, tütsü, kül, duman, is/isli, sigara, çakmak, kibrit, buhar (with suffixes) and the icons fire, fire-simple, flame, campfire, candle, cigarette, cigarette-slash, coffee, fire-extinguisher, fire-truck. |

Naming overlaps noticed (not fire-related; open question 29): the ch7 piece "Tüy rüzgârlığı" vs the ch8 accessory "Rüzgârlık", and the ch6 piece "Kalın battaniye" uses `Hoodie`, the same icon as the ch6 accessory "Kapüşonlu". ***Rev 5.4:* resolved** (Kâğıt fırıldak, Örgü sepeti, Örgü eldiven; changelog 5.4-4/5).

Pacing: an engaged user earns about 1–3 lights a day, so one chapter lasts roughly 1–2 weeks. *Rev 5:* **decided — one chapter every 2 weeks** (Monday 09:00, Europe/Istanbul), plus optional smaller drops. The pipeline and checklist are in §24. The waiting state (§19.6) covers users who catch up.

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
| **Seasonal events** | Time-boxed windows in the manifest (e.g. "Sonbahar şenliği", until 30 Kasım; *5.4:* "Kış şenliği", 1 Aralık–31 Ocak, reward Bere, §22b.5). Progress = lights **earned during the window** (a counter of normal lights; nothing is spent). | 1 event item at a light target (e.g. 5). It stays collectible later via a "geçmiş etkinlik" item, so there is no FOMO lock-out. | events + manifest window |
| **Personalize / rearrange** | "Sığınağını düzenle": swap which earned decor sits on each built piece, choose the fox's accessory, and reorder Sığınak decor slots. Counts toward the "yerini değiştir" goal. | Visual only. | `personalization` (synced) |
| **Endless day milestones** | After Gün 30: Gün 60, 90, 180, 365 and every 365 after that, all defined in the manifest. The same non-clinical copy rules apply (time and effort only). | A collection item; the milestone screen. | `milestones.seen` + manifest |

Rules: goals never carry over, never show "failed" or red, and never expire with a loss message. Caption **"Hedefler isteğe bağlı. Tamamlanmayan hedef bir şey kaybettirmez; yeni hafta yeni hedeflerle başlar."** (**NEW**). Seasonal items can still be earned later, so missing an event costs nothing permanent.

**Koleksiyon screen (`rev4-koleksiyon`, pushed, no tab bar):** back `CaretLeft` + title/md **"Koleksiyon"** (**NEW**) + light chip. Then:
- Seasonal banner (surface/hero, radius 20): `Leaf` fill tile, eyebrow **"MEVSİM ETKİNLİĞİ · 30 KASIM’A KADAR"**, **"Sonbahar şenliği"**, gold bar and **"3 / 5 ışık"** (**NEW**).
- **"Bu haftanın hedefleri"** + **"Pazartesi yenilenir"** (**NEW**): 3 rows, each with a ring 40 "a/n" (gold arc; teal_deep filled `Check` when done), the goal title and a reward line with the item icon ("Kristal lamba", **"Kazandın: Kuvars"** when done) (**NEW**).
- **"Koleksiyonlar"** + "9 / 24": chips "Kristaller 4/6" · "Aksesuarlar 2/6" · "Süsler 3/12" (**NEW**). Grid of 108 × 100 tiles: owned items have a gold_soft circle, gold border and name; unowned items have a dashed circle and their source ("Gün 60", "Haftalık hedef"), so it's clear how to get them without pressure.

### 19.4 Remote content (manifest) — storage, caching, offline, versioning
The repo already uses **Supabase** (`@supabase/supabase-js` in `src/data/store.ts`, with `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`), so the content uses it too. There is no new vendor.

**Storage — *rev 5*: final migrations `202611020002_content_manifests.sql` and `202611020003_content_storage.sql` (full SQL in §21.2–21.3, **not run**).** Compared with the rev 4 proposal they add: `notes`, a row↔JSON consistency check, RLS with explicit `revoke`/`grant`, and a guard trigger. The trigger makes published rows immutable (update and delete), requires an increasing version per channel, and **rejects `pending` copy on prod** (it applies to the service role too). The `latest` index is replaced by the unique key `(channel, version)` (plan: backward index-only scan) plus `(channel, published_at desc)`.
- **Art:** Supabase Storage public bucket `content` (PNG/WebP, ≤ 2 MiB; clients can't list or upload, they read public URLs only, §21.3), at `chapters/{chapterId}/{name}.{contentHash}@2x.png`. File names are content-hashed, so they are immutable and cacheable forever (`cacheControl: 31536000`). The manifest refers to them by path and hash.
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
Goal and season progress are **derived** from events (not stored). The goal pick is deterministic per user and week. *Rev 5:* the shape checks for these keys are in `202611020001_user_snapshots_v2.sql` (§21.1).

### 19.5 Manifest JSON Schema (draft 2020-12) + example — *rev 5, final*
Files: `content/manifest.schema.json` (strict: `additionalProperties: false` everywhere), `content/manifest.example.json` (generated by `content/build_example.py`), `content/check_manifest.py` (CI rules the schema can't express, §24.4), and `content/test_check_manifest.py` (23/23, *rev 5.2*), and `content/editorial.py` (the *yak-/yan-* matcher, *rev 5.2*).
Validated on the box: `python3 content/check_manifest.py content/manifest.example.json --channel beta` → `OK manifest.example.json channel=beta v11 chapters=8 pieces=48 items=28` (*rev 5.5*; also with `--previous` v10: no id removed and the version went up) (jsonschema 4.26, Draft 2020-12, with format checks). *Rev 5.5:* everything is approved again, so `--channel prod` passes too (`OK … channel=prod v11`), including `--previous` v10. The Turkish spelling check finds nothing. (*Rev 5.4* v10 was refused on prod because of its 13 pending ids.) *Rev 5.1:* all copy is approved, so `--channel prod` passes too, including `--previous` against v8 (*rev 5.2*: v9 changes the Bölüm 5 teaser). A copy with one chapter set back to `pending` is rejected on prod, as intended.

Key rules: exactly 6 pieces per chapter (`lightsPerPiece` is const 2); chapters with `order ≥ 2` need `intro` (with a CTA) and `teaser`; piece name ≤ 24 chars, line ≤ 64; icons are Phosphor kebab-case names (all verified to exist); art paths are `dir/dir/name.<hex≥6>@2x.(png|webp)`; `copyStatus` is `approved` | `pending` on chapters, milestones, goals and seasons; ids are prefixed (`ch-`, `pc-`, `it-`, `g-`, `s-`, `day-N`).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://quit-companion.app/schemas/content-manifest.v1.json",
  "title": "Sığınak content manifest (schemaVersion 1)",
  "description": "Authoring/CI schema (strict). The app parser is lenient: it ignores unknown fields and drops invalid entries instead of rejecting the manifest.",
  "type": "object",
  "additionalProperties": false,
  "required": ["schemaVersion", "version", "lightsPerPiece", "chapters", "upcoming", "items"],
  "properties": {
    "schemaVersion": { "const": 1 },
    "version": { "type": "integer", "minimum": 0 },
    "lightsPerPiece": { "const": 2 },
    "chapters": { "type": "array", "minItems": 1, "items": { "$ref": "#/$defs/chapter" } },
    "upcoming": { "$ref": "#/$defs/upcoming" },
    "milestones": { "type": "array", "items": { "$ref": "#/$defs/milestone" } },
    "goalPool": { "type": "array", "items": { "$ref": "#/$defs/goal" } },
    "seasons": { "type": "array", "items": { "$ref": "#/$defs/season" } },
    "items": { "type": "array", "minItems": 1, "items": { "$ref": "#/$defs/item" } }
  },
  "$defs": {
    "copyStatus": { "enum": ["approved", "pending"] },
    "icon": { "type": "string", "pattern": "^[a-z0-9-]+$", "description": "Phosphor icon name; fallback art" },
    "assetPath": { "type": "string", "pattern": "^[a-z0-9-]+/[a-z0-9-]+/[a-z0-9-]+\\.[0-9a-f]{6,}@2x\\.(png|webp)$" },
    "text24": { "type": "string", "minLength": 1, "maxLength": 24 },
    "text40": { "type": "string", "minLength": 1, "maxLength": 40 },
    "text64": { "type": "string", "minLength": 1, "maxLength": 64 },
    "text200": { "type": "string", "minLength": 1, "maxLength": 200 },
    "dateTime": { "type": "string", "format": "date-time" },
    "screenCopy": {
      "type": "object", "additionalProperties": false,
      "required": ["eyebrow", "title", "body"],
      "properties": { "eyebrow": { "$ref": "#/$defs/text40" }, "title": { "$ref": "#/$defs/text64" },
        "body": { "$ref": "#/$defs/text200" }, "cta": { "$ref": "#/$defs/text24" } }
    },
    "piece": {
      "type": "object", "additionalProperties": false,
      "required": ["id", "name", "icon"],
      "properties": { "id": { "type": "string", "pattern": "^pc-[a-z0-9-]+$" }, "name": { "$ref": "#/$defs/text24" },
        "icon": { "$ref": "#/$defs/icon" }, "line": { "$ref": "#/$defs/text64" }, "art": { "$ref": "#/$defs/assetPath" } }
    },
    "chapter": {
      "type": "object", "additionalProperties": false,
      "required": ["id", "order", "copyStatus", "eyebrow", "title", "theme", "pieces", "completion", "completionReward"],
      "properties": {
        "id": { "type": "string", "pattern": "^ch-[a-z0-9-]+$" },
        "order": { "type": "integer", "minimum": 1 },
        "copyStatus": { "$ref": "#/$defs/copyStatus" },
        "eyebrow": { "$ref": "#/$defs/text40" },
        "title": { "$ref": "#/$defs/text40" },
        "theme": { "type": "object", "additionalProperties": false, "required": ["scene"],
          "properties": { "scene": { "enum": ["day", "dusk", "night", "snow"] }, "art": { "$ref": "#/$defs/assetPath" } } },
        "teaser": { "type": "object", "additionalProperties": false, "required": ["line", "previewIcons"],
          "properties": { "line": { "$ref": "#/$defs/text64" },
            "previewIcons": { "type": "array", "items": { "$ref": "#/$defs/icon" }, "minItems": 1, "maxItems": 3 } } },
        "intro": { "$ref": "#/$defs/screenCopy" },
        "completion": { "$ref": "#/$defs/screenCopy" },
        "pieces": { "type": "array", "minItems": 6, "maxItems": 6, "items": { "$ref": "#/$defs/piece" } },
        "completionReward": { "type": "string", "pattern": "^it-[a-z0-9-]+$" },
        "retired": { "type": "boolean" }
      },
      "if": { "properties": { "order": { "minimum": 2 } } },
      "then": { "required": ["intro", "teaser"], "properties": { "intro": { "required": ["cta"] } } }
    },
    "upcoming": {
      "type": "object", "additionalProperties": false,
      "required": ["chapterOrder", "eyebrow", "title", "teaserLine", "opensAt"],
      "properties": { "chapterOrder": { "type": "integer", "minimum": 2 }, "eyebrow": { "$ref": "#/$defs/text40" },
        "title": { "$ref": "#/$defs/text40" }, "teaserLine": { "$ref": "#/$defs/text64" },
        "opensAt": { "anyOf": [ { "$ref": "#/$defs/dateTime" }, { "type": "null" } ] } }
    },
    "milestone": {
      "type": "object", "additionalProperties": false,
      "required": ["key", "day", "copyStatus", "reward", "copy"],
      "properties": { "key": { "type": "string", "pattern": "^day-[0-9]+$" }, "day": { "type": "integer", "minimum": 31 },
        "copyStatus": { "$ref": "#/$defs/copyStatus" }, "reward": { "type": "string", "pattern": "^it-[a-z0-9-]+$" },
        "copy": { "type": "object", "additionalProperties": false,
          "required": ["eyebrow", "lead", "body", "slipEyebrow", "slipLead", "slipBody"],
          "properties": { "eyebrow": { "$ref": "#/$defs/text40" }, "lead": { "$ref": "#/$defs/text64" }, "body": { "$ref": "#/$defs/text200" },
            "slipEyebrow": { "$ref": "#/$defs/text40" }, "slipLead": { "$ref": "#/$defs/text64" }, "slipBody": { "$ref": "#/$defs/text200" } } } }
    },
    "goal": {
      "type": "object", "additionalProperties": false,
      "required": ["id", "copyStatus", "metric", "target", "title", "reward"],
      "properties": { "id": { "type": "string", "pattern": "^g-[a-z0-9-]+$" }, "copyStatus": { "$ref": "#/$defs/copyStatus" },
        "chapterId": { "type": "string", "pattern": "^ch-[a-z0-9-]+$" },
        "metric": { "enum": ["checkinDays", "copingSessions", "rearrange", "reasonRead"] },
        "target": { "type": "integer", "minimum": 1, "maximum": 5 }, "title": { "$ref": "#/$defs/text64" },
        "reward": { "type": "string", "pattern": "^it-[a-z0-9-]+$" } }
    },
    "season": {
      "type": "object", "additionalProperties": false,
      "required": ["id", "copyStatus", "title", "icon", "startsAt", "endsAt", "lightTarget", "reward"],
      "properties": { "id": { "type": "string", "pattern": "^s-[a-z0-9-]+$" }, "copyStatus": { "$ref": "#/$defs/copyStatus" },
        "title": { "$ref": "#/$defs/text40" }, "icon": { "$ref": "#/$defs/icon" },
        "startsAt": { "$ref": "#/$defs/dateTime" }, "endsAt": { "$ref": "#/$defs/dateTime" },
        "lightTarget": { "type": "integer", "minimum": 1, "maximum": 14 }, "reward": { "type": "string", "pattern": "^it-[a-z0-9-]+$" } }
    },
    "item": {
      "type": "object", "additionalProperties": false,
      "required": ["id", "set", "name", "icon", "hint"],
      "properties": { "id": { "type": "string", "pattern": "^it-[a-z0-9-]+$" },
        "set": { "enum": ["crystals", "fox-accessories", "decor", "season"] },
        "name": { "$ref": "#/$defs/text24" }, "icon": { "$ref": "#/$defs/icon" }, "hint": { "$ref": "#/$defs/text24" },
        "art": { "$ref": "#/$defs/assetPath" }, "retired": { "type": "boolean" } }
    }
  }
}
```

<details><summary>Full example manifest, v11 (8 chapters, 48 pieces, 2 milestones, 16 goals, 2 seasons, 28 items; all copy approved; rev 5.5)</summary>

```json
{
  "schemaVersion": 1,
  "version": 11,
  "lightsPerPiece": 2,
  "chapters": [
    {
      "id": "ch-temel",
      "order": 1,
      "copyStatus": "approved",
      "eyebrow": "BÖLÜM 1 · TEMEL",
      "title": "Sığınağın ilk odası",
      "theme": {
        "scene": "day"
      },
      "completion": {
        "eyebrow": "BÖLÜM 1 TAMAMLANDI",
        "title": "Sığınağın ilk odası hazır.",
        "body": "On iki ışıkla altı parçayı yerine koydun. Hepsi burada kalıyor; şimdi yol bahçeye uzanıyor.",
        "cta": "Bölüm 2’ye bak"
      },
      "pieces": [
        {
          "id": "pc-temel",
          "name": "Sığınak temeli",
          "icon": "house-simple"
        },
        {
          "id": "pc-isiklar",
          "name": "Sıcak ışıklar",
          "icon": "lamp"
        },
        {
          "id": "pc-dinlenme",
          "name": "Dinlenme köşesi",
          "icon": "armchair"
        },
        {
          "id": "pc-pencere",
          "name": "Pencere",
          "icon": "grid-four"
        },
        {
          "id": "pc-yesil",
          "name": "Yeşil köşe",
          "icon": "plant"
        },
        {
          "id": "pc-kitaplik",
          "name": "Kitaplık",
          "icon": "books"
        }
      ],
      "completionReward": "it-yuvarlak-gozluk"
    },
    {
      "id": "ch-bahce",
      "order": 2,
      "copyStatus": "approved",
      "eyebrow": "BÖLÜM 2 · BAHÇE",
      "title": "Sığınağın bahçesi",
      "theme": {
        "scene": "day"
      },
      "teaser": {
        "line": "Kapının ardında bir bahçe var.",
        "previewIcons": [
          "door-open",
          "flower-tulip",
          "bird"
        ]
      },
      "intro": {
        "eyebrow": "BÖLÜM 2 · BAHÇE",
        "title": "Sırada sığınağın bahçesi var.",
        "body": "Aynı yol devam ediyor: her 2 ışık bahçeye yeni bir parça ekler. İlk odan olduğu gibi yerinde kalır.",
        "cta": "Yola devam et"
      },
      "completion": {
        "eyebrow": "BÖLÜM 2 TAMAMLANDI",
        "title": "Sığınağın bahçesi hazır.",
        "body": "Bahçeye altı parça yerleştirdin. Hepsi yerinde duruyor; yol şimdi bir derenin sesine doğru iniyor.",
        "cta": "Bölüm 3’e bak"
      },
      "pieces": [
        {
          "id": "pc-bahce-kapisi",
          "name": "Bahçe kapısı",
          "icon": "door-open",
          "art": "chapters/ch-bahce/bahce-kapisi.3f9a1c@2x.png"
        },
        {
          "id": "pc-tas-yol",
          "name": "Taş yol",
          "icon": "footprints"
        },
        {
          "id": "pc-cicek-tarhi",
          "name": "Çiçek tarhı",
          "icon": "flower-tulip"
        },
        {
          "id": "pc-kus-evi",
          "name": "Kuş evi",
          "icon": "bird"
        },
        {
          "id": "pc-bahce-feneri",
          "name": "Bahçe feneri",
          "icon": "lightbulb"
        },
        {
          "id": "pc-golge-agaci",
          "name": "Gölge ağacı",
          "icon": "tree"
        }
      ],
      "completionReward": "it-hasir-sapka"
    },
    {
      "id": "ch-dere",
      "order": 3,
      "copyStatus": "approved",
      "eyebrow": "BÖLÜM 3 · DERE KENARI",
      "title": "Suyun sesi",
      "theme": {
        "scene": "day"
      },
      "teaser": {
        "line": "Uzaktan bir su sesi geliyor.",
        "previewIcons": [
          "bridge",
          "flower-lotus",
          "boat"
        ]
      },
      "intro": {
        "eyebrow": "BÖLÜM 3 · DERE KENARI",
        "title": "Yol bir derenin kıyısına iniyor.",
        "body": "Bahçenin ötesinde yavaşça akan bir dere var. Her 2 ışık kıyıya yeni bir parça ekler; bahçen ve ilk odan olduğu gibi yerinde kalır.",
        "cta": "Kıyıya in"
      },
      "completion": {
        "eyebrow": "BÖLÜM 3 TAMAMLANDI",
        "title": "Dere kenarı hazır.",
        "body": "Kıyıya altı parçayı tek tek yerleştirdin. Suyun sesi artık sığınağının bir parçası.",
        "cta": "Bölüm 4’e bak"
      },
      "pieces": [
        {
          "id": "pc-kucuk-kopru",
          "name": "Küçük köprü",
          "icon": "bridge",
          "line": "Bir kıyıdan ötekine geçmek artık daha kolay."
        },
        {
          "id": "pc-berrak-golet",
          "name": "Berrak gölet",
          "icon": "drop",
          "line": "Durgun suda gökyüzü görünüyor."
        },
        {
          "id": "pc-nilufer",
          "name": "Nilüferler",
          "icon": "flower-lotus",
          "line": "Suyun üstünde sakin bir yeşil."
        },
        {
          "id": "pc-ahsap-kayik",
          "name": "Ahşap kayık",
          "icon": "boat",
          "line": "Kıyıya bağlı, acelesi olmayan bir kayık."
        },
        {
          "id": "pc-balik-kosesi",
          "name": "Balıkların köşesi",
          "icon": "fish",
          "line": "Küçük balıklar kendi ritminde yüzüyor."
        },
        {
          "id": "pc-kiyi-taslari",
          "name": "Kıyı taşları",
          "icon": "waves",
          "line": "Suyun yıllar içinde yumuşattığı taşlar."
        }
      ],
      "completionReward": "it-lastik-cizme"
    },
    {
      "id": "ch-orman",
      "order": 4,
      "copyStatus": "approved",
      "eyebrow": "BÖLÜM 4 · ORMAN YOLU",
      "title": "Ağaçların arası",
      "theme": {
        "scene": "day"
      },
      "teaser": {
        "line": "Uzaktan yaprak hışırtısı geliyor.",
        "previewIcons": [
          "tree-evergreen",
          "tent",
          "feather"
        ]
      },
      "intro": {
        "eyebrow": "BÖLÜM 4 · ORMAN YOLU",
        "title": "Yol ağaçların arasına giriyor.",
        "body": "Derenin ötesinde sessiz bir orman yolu başlıyor. Her 2 ışık yola yeni bir parça ekler; geride bıraktığın her yer olduğu gibi duruyor.",
        "cta": "Ormana gir"
      },
      "completion": {
        "eyebrow": "BÖLÜM 4 TAMAMLANDI",
        "title": "Orman yolu hazır.",
        "body": "Ağaçların arasına altı parça yerleştirdin. Bu sessiz yol artık senin.",
        "cta": "Bölüm 5’e bak"
      },
      "pieces": [
        {
          "id": "pc-cam-agaci",
          "name": "Çam ağacı",
          "icon": "tree-evergreen",
          "line": "Yolun başında, her mevsim yeşil."
        },
        {
          "id": "pc-yaprak-yolu",
          "name": "Yaprak yolu",
          "icon": "leaf",
          "line": "Yumuşak yapraklar adımlarını karşılıyor."
        },
        {
          "id": "pc-kucuk-cadir",
          "name": "Küçük çadır",
          "icon": "tent",
          "line": "Dinlenmek istediğinde hep bir yer var."
        },
        {
          "id": "pc-gozlem-noktasi",
          "name": "Gözlem noktası",
          "icon": "binoculars",
          "line": "Buradan bakınca yol daha net görünüyor."
        },
        {
          "id": "pc-kus-tuyu",
          "name": "Kuş tüyü",
          "icon": "feather",
          "line": "Yolda bulduğun küçük bir hatıra."
        },
        {
          "id": "pc-orman-acikligi",
          "name": "Orman açıklığı",
          "icon": "park",
          "line": "Ağaçların arasında ışığın düştüğü yer."
        }
      ],
      "completionReward": "it-sirt-cantasi"
    },
    {
      "id": "ch-teras",
      "order": 5,
      "copyStatus": "approved",
      "eyebrow": "BÖLÜM 5 · YILDIZ TERASI",
      "title": "Gece göğü",
      "theme": {
        "scene": "night"
      },
      "teaser": {
        "line": "Yukarıda bir terasın ışıkları parlıyor.",
        "previewIcons": [
          "lamp-pendant",
          "star",
          "moon-stars"
        ]
      },
      "intro": {
        "eyebrow": "BÖLÜM 5 · YILDIZ TERASI",
        "title": "Yol bir terasa çıkıyor.",
        "body": "Ormanın ötesinde, yıldızlara yakın bir teras var. Her 2 ışık terasa yeni bir parça ekler; geçtiğin her yer olduğu gibi duruyor.",
        "cta": "Terasa çık"
      },
      "completion": {
        "eyebrow": "BÖLÜM 5 TAMAMLANDI",
        "title": "Yıldız terası hazır.",
        "body": "Terasa altı parça yerleştirdin. Gece göğü artık sığınağının bir parçası.",
        "cta": "Bölüm 6’ya bak"
      },
      "pieces": [
        {
          "id": "pc-teras-feneri",
          "name": "Teras feneri",
          "icon": "lamp-pendant",
          "line": "Küçük bir ampul, terasa yumuşak bir ışık veriyor."
        },
        {
          "id": "pc-yildiz-haritasi",
          "name": "Yıldız haritası",
          "icon": "star",
          "line": "Gökyüzünü tanımak için sakin bir başlangıç."
        },
        {
          "id": "pc-ay-penceresi",
          "name": "Ay penceresi",
          "icon": "moon-stars",
          "line": "Ay, pencerenin tam ortasından görünüyor."
        },
        {
          "id": "pc-kayan-yildiz",
          "name": "Kayan yıldız",
          "icon": "shooting-star",
          "line": "Bir an parlıyor, sonra gökyüzü yine sakin."
        },
        {
          "id": "pc-gezegen-modeli",
          "name": "Gezegen modeli",
          "icon": "planet",
          "line": "Masanın üstünde ağır ağır dönen küçük bir dünya."
        },
        {
          "id": "pc-gece-defteri",
          "name": "Gece defteri",
          "icon": "book-open-text",
          "line": "Gökyüzünde gördüklerini not ettiğin küçük bir defter."
        }
      ],
      "completionReward": "it-yildiz-rozeti"
    },
    {
      "id": "ch-kis-odasi",
      "order": 6,
      "copyStatus": "approved",
      "eyebrow": "BÖLÜM 6 · KIŞ ODASI",
      "title": "Sıcak bir köşe",
      "theme": {
        "scene": "snow"
      },
      "teaser": {
        "line": "Pencerenin ardında kar taneleri dönüyor.",
        "previewIcons": [
          "snowflake",
          "tea-bag",
          "guitar"
        ]
      },
      "intro": {
        "eyebrow": "BÖLÜM 6 · KIŞ ODASI",
        "title": "Yol sıcak bir odaya varıyor.",
        "body": "Terastan inince içi huzurlu bir kış odası seni bekliyor. Her 2 ışık odaya yeni bir parça ekler; geçtiğin her yer olduğu gibi duruyor.",
        "cta": "Odaya gir"
      },
      "completion": {
        "eyebrow": "BÖLÜM 6 TAMAMLANDI",
        "title": "Kış odası hazır.",
        "body": "Odaya altı parça yerleştirdin. Dışarıda kar yağsa da burası sıcak ve sakin.",
        "cta": "Bölüm 7’ye bak"
      },
      "pieces": [
        {
          "id": "pc-kar-penceresi",
          "name": "Kar penceresi",
          "icon": "snowflake",
          "line": "Dışarıda kar yağıyor, içerisi sakin."
        },
        {
          "id": "pc-cay-kosesi",
          "name": "Sıcak çay köşesi",
          "icon": "tea-bag",
          "line": "Bir fincan çay ve acele etmeyen bir akşam."
        },
        {
          "id": "pc-muzik-kosesi",
          "name": "Müzik köşesi",
          "icon": "music-notes",
          "line": "Alçak sesle çalan sevdiğin bir şarkı."
        },
        {
          "id": "pc-gitar",
          "name": "Gitar",
          "icon": "guitar",
          "line": "Duvara yaslanmış, çalınmayı bekliyor."
        },
        {
          "id": "pc-orgu-sepeti",
          "name": "Örgü sepeti",
          "icon": "yarn",
          "line": "Yarım kalmış bir örgü; hiç acelesi yok."
        },
        {
          "id": "pc-kis-bitkisi",
          "name": "Kış bitkisi",
          "icon": "potted-plant",
          "line": "Kışın da yeşil kalan küçük bir saksı."
        }
      ],
      "completionReward": "it-orgu-eldiven"
    },
    {
      "id": "ch-kiyi",
      "order": 7,
      "copyStatus": "approved",
      "eyebrow": "BÖLÜM 7 · KIYI",
      "title": "Deniz feneri",
      "theme": {
        "scene": "dusk"
      },
      "teaser": {
        "line": "Rüzgârda tuzlu bir deniz kokusu var.",
        "previewIcons": [
          "lighthouse",
          "sailboat",
          "island"
        ]
      },
      "intro": {
        "eyebrow": "BÖLÜM 7 · KIYI",
        "title": "Yol denize açılıyor.",
        "body": "Odadan çıkınca yol sakin bir kıyıya iniyor. Her 2 ışık kıyıya yeni bir parça ekler; geçtiğin her yer olduğu gibi duruyor.",
        "cta": "Kıyıya yürü"
      },
      "completion": {
        "eyebrow": "BÖLÜM 7 TAMAMLANDI",
        "title": "Kıyı hazır.",
        "body": "Kıyıya altı parça yerleştirdin. Deniz feneri her akşam senin için de parlıyor.",
        "cta": "Bölüm 8’e bak"
      },
      "pieces": [
        {
          "id": "pc-deniz-feneri",
          "name": "Deniz feneri",
          "icon": "lighthouse",
          "line": "Akşam olunca kıyıya yol gösteren bir ışık."
        },
        {
          "id": "pc-kucuk-yelkenli",
          "name": "Küçük yelkenli",
          "icon": "sailboat",
          "line": "Rüzgârı arkasına almış, kıyıya yakın süzülüyor."
        },
        {
          "id": "pc-ada-manzarasi",
          "name": "Ada manzarası",
          "icon": "island",
          "line": "Uzakta, sakin suların ortasında küçük bir ada."
        },
        {
          "id": "pc-gun-batimi",
          "name": "Gün batımı",
          "icon": "sun-horizon",
          "line": "Gökyüzü yavaş yavaş turuncuya dönüyor."
        },
        {
          "id": "pc-kagit-firildak",
          "name": "Kâğıt fırıldak",
          "icon": "pinwheel",
          "line": "Deniz rüzgârıyla kendi kendine dönüyor."
        },
        {
          "id": "pc-deniz-kabuklari",
          "name": "Deniz kabukları",
          "icon": "spiral",
          "line": "Kumda bulduğun küçük, sarmal kabuklar."
        }
      ],
      "completionReward": "it-semsiye"
    },
    {
      "id": "ch-tepe",
      "order": 8,
      "copyStatus": "approved",
      "eyebrow": "BÖLÜM 8 · TEPE",
      "title": "Manzara",
      "theme": {
        "scene": "day"
      },
      "teaser": {
        "line": "Yukarıda geniş bir manzara açılıyor.",
        "previewIcons": [
          "mountains",
          "cloud-sun",
          "rainbow"
        ]
      },
      "intro": {
        "eyebrow": "BÖLÜM 8 · TEPE",
        "title": "Yol tepeye tırmanıyor.",
        "body": "Kıyının ardında yumuşak bir tepe yükseliyor. Her 2 ışık tepeye yeni bir parça ekler; geçtiğin her yer olduğu gibi duruyor.",
        "cta": "Tepeye çık"
      },
      "completion": {
        "eyebrow": "BÖLÜM 8 TAMAMLANDI",
        "title": "Tepedeki manzara hazır.",
        "body": "Tepeye altı parça yerleştirdin. Buradan bakınca geçtiğin bütün yol görünüyor.",
        "cta": "Bölüm 9’a bak"
      },
      "pieces": [
        {
          "id": "pc-dag-yolu",
          "name": "Dağ yolu",
          "icon": "mountains",
          "line": "Adım adım yükselen, acelesi olmayan bir yol."
        },
        {
          "id": "pc-bulut-seyri",
          "name": "Bulut seyri",
          "icon": "cloud-sun",
          "line": "Bulutlar ağır ağır geçiyor, sen de dinleniyorsun."
        },
        {
          "id": "pc-gokkusagi",
          "name": "Gökkuşağı",
          "icon": "rainbow",
          "line": "Yağmurdan sonra tepede beliren renkler."
        },
        {
          "id": "pc-tepe-flamasi",
          "name": "Tepe flaması",
          "icon": "flag-banner",
          "line": "Tepenin en üstünde hafifçe dalgalanıyor."
        },
        {
          "id": "pc-pusula",
          "name": "Pusula",
          "icon": "compass",
          "line": "Hangi yöne gidersen git, yolunu bulmana yardım eder."
        },
        {
          "id": "pc-gun-dogumu",
          "name": "Gün doğumu",
          "icon": "sun",
          "line": "Yeni bir gün, tepenin ardından usulca doğuyor."
        }
      ],
      "completionReward": "it-ruzgarlik"
    }
  ],
  "upcoming": {
    "chapterOrder": 9,
    "eyebrow": "BÖLÜM 9",
    "title": "Yeni bir yer",
    "teaserLine": "Sisin ardında yeni bir yer hazırlanıyor.",
    "opensAt": null
  },
  "milestones": [
    {
      "key": "day-60",
      "day": 60,
      "copyStatus": "approved",
      "reward": "it-aytasi",
      "copy": {
        "eyebrow": "İKİ AY OLDU",
        "lead": "İki aydır kendine alan açıyorsun.",
        "body": "Altmış gün boyunca attığın her küçük adım burada duruyor.",
        "slipEyebrow": "YOLCULUĞUN DEVAM EDİYOR",
        "slipLead": "İki aydır bu yoldasın.",
        "slipBody": "Kolay ve zor günler oldu; hiçbiri kurduğun şeyi silmedi."
      }
    },
    {
      "key": "day-90",
      "day": 90,
      "copyStatus": "approved",
      "reward": "it-akuamarin",
      "copy": {
        "eyebrow": "ÜÇ AY OLDU",
        "lead": "Üç aydır bu yolu kendin için seçiyorsun.",
        "body": "Doksan günün emeği burada, seninle. Sığınağın da bu sürede seninle büyüdü.",
        "slipEyebrow": "YOLCULUĞUN DEVAM EDİYOR",
        "slipLead": "Üç aydır bu yoldasın.",
        "slipBody": "Bu doksan günde zor anlar da oldu; hiçbiri attığın adımları silmedi."
      }
    }
  ],
  "goalPool": [
    {
      "id": "g-checkin-3",
      "copyStatus": "approved",
      "metric": "checkinDays",
      "target": 3,
      "title": "3 gün check-in yap",
      "reward": "it-kristal-lamba"
    },
    {
      "id": "g-coping-2",
      "copyStatus": "approved",
      "metric": "copingSessions",
      "target": 2,
      "title": "2 kez bir baş etme aracı dene",
      "reward": "it-kuvars"
    },
    {
      "id": "g-rearrange-1",
      "copyStatus": "approved",
      "metric": "rearrange",
      "target": 1,
      "title": "Sığınağında bir parçanın yerini değiştir",
      "reward": "it-atki"
    },
    {
      "id": "g-reason-1",
      "copyStatus": "approved",
      "metric": "reasonRead",
      "target": 1,
      "title": "Bırakma nedenini bir kez yeniden oku",
      "reward": "it-ametist"
    },
    {
      "id": "g-dere-checkin-3",
      "copyStatus": "approved",
      "chapterId": "ch-dere",
      "metric": "checkinDays",
      "target": 3,
      "title": "Kıyıya uğra: bu hafta 3 gün check-in yap",
      "reward": "it-nehir-cakili"
    },
    {
      "id": "g-dere-coping-2",
      "copyStatus": "approved",
      "chapterId": "ch-dere",
      "metric": "copingSessions",
      "target": 2,
      "title": "Suyun ritmine uy: bu hafta 2 kez bir baş etme aracı dene",
      "reward": "it-nilufer-yapragi"
    },
    {
      "id": "g-orman-checkin-3",
      "copyStatus": "approved",
      "chapterId": "ch-orman",
      "metric": "checkinDays",
      "target": 3,
      "title": "Ormana uğra: bu hafta 3 gün check-in yap",
      "reward": "it-cam-kozalagi"
    },
    {
      "id": "g-orman-coping-2",
      "copyStatus": "approved",
      "chapterId": "ch-orman",
      "metric": "copingSessions",
      "target": 2,
      "title": "Ağaçların arasında mola: bu hafta 2 kez bir baş etme aracı dene",
      "reward": "it-mese-yapragi"
    },
    {
      "id": "g-teras-checkin-3",
      "copyStatus": "approved",
      "chapterId": "ch-teras",
      "metric": "checkinDays",
      "target": 3,
      "title": "Terasa uğra: bu hafta 3 gün check-in yap",
      "reward": "it-yildiz-kavanozu"
    },
    {
      "id": "g-teras-reason-1",
      "copyStatus": "approved",
      "chapterId": "ch-teras",
      "metric": "reasonRead",
      "target": 1,
      "title": "Yıldızlara bak: bu hafta bırakma nedenini bir kez yeniden oku",
      "reward": "it-gece-minderi"
    },
    {
      "id": "g-kis-checkin-3",
      "copyStatus": "approved",
      "chapterId": "ch-kis-odasi",
      "metric": "checkinDays",
      "target": 3,
      "title": "Odaya uğra: bu hafta 3 gün check-in yap",
      "reward": "it-kar-kuresi"
    },
    {
      "id": "g-kis-coping-2",
      "copyStatus": "approved",
      "chapterId": "ch-kis-odasi",
      "metric": "copingSessions",
      "target": 2,
      "title": "Pencere kenarında mola: bu hafta 2 kez bir baş etme aracı dene",
      "reward": "it-kurabiye-kavanozu"
    },
    {
      "id": "g-kiyi-checkin-3",
      "copyStatus": "approved",
      "chapterId": "ch-kiyi",
      "metric": "checkinDays",
      "target": 3,
      "title": "Deniz kenarına uğra: bu hafta 3 gün check-in yap",
      "reward": "it-deniz-yildizi"
    },
    {
      "id": "g-kiyi-coping-2",
      "copyStatus": "approved",
      "chapterId": "ch-kiyi",
      "metric": "copingSessions",
      "target": 2,
      "title": "Dalgalarla nefes al: bu hafta 2 kez bir baş etme aracı dene",
      "reward": "it-kucuk-capa"
    },
    {
      "id": "g-tepe-checkin-3",
      "copyStatus": "approved",
      "chapterId": "ch-tepe",
      "metric": "checkinDays",
      "target": 3,
      "title": "Tepeye uğra: bu hafta 3 gün check-in yap",
      "reward": "it-dag-cicegi"
    },
    {
      "id": "g-tepe-reason-1",
      "copyStatus": "approved",
      "chapterId": "ch-tepe",
      "metric": "reasonRead",
      "target": 1,
      "title": "Manzaraya bak: bu hafta bırakma nedenini bir kez yeniden oku",
      "reward": "it-tepe-haritasi"
    }
  ],
  "seasons": [
    {
      "id": "s-sonbahar-2026",
      "copyStatus": "approved",
      "title": "Sonbahar şenliği",
      "icon": "leaf",
      "startsAt": "2026-11-01T00:00:00+03:00",
      "endsAt": "2026-11-30T23:59:59+03:00",
      "lightTarget": 5,
      "reward": "it-yaprak-susu"
    },
    {
      "id": "s-kis-2026",
      "copyStatus": "approved",
      "title": "Kış şenliği",
      "icon": "snowflake",
      "startsAt": "2026-12-01T00:00:00+03:00",
      "endsAt": "2027-01-31T23:59:59+03:00",
      "lightTarget": 8,
      "reward": "it-bere"
    }
  ],
  "items": [
    {
      "id": "it-ametist",
      "set": "crystals",
      "name": "Ametist",
      "icon": "diamond",
      "hint": "Haftalık hedef"
    },
    {
      "id": "it-kuvars",
      "set": "crystals",
      "name": "Kuvars",
      "icon": "diamonds-four",
      "hint": "Haftalık hedef"
    },
    {
      "id": "it-aytasi",
      "set": "crystals",
      "name": "Ay taşı",
      "icon": "moon",
      "hint": "Gün 60"
    },
    {
      "id": "it-akuamarin",
      "set": "crystals",
      "name": "Akuamarin",
      "icon": "drop-half",
      "hint": "Gün 90"
    },
    {
      "id": "it-atki",
      "set": "fox-accessories",
      "name": "Atkı",
      "icon": "t-shirt",
      "hint": "Haftalık hedef"
    },
    {
      "id": "it-yuvarlak-gozluk",
      "set": "fox-accessories",
      "name": "Yuvarlak gözlük",
      "icon": "eyeglasses",
      "hint": "Bölüm 1"
    },
    {
      "id": "it-hasir-sapka",
      "set": "fox-accessories",
      "name": "Hasır şapka",
      "icon": "baseball-cap",
      "hint": "Bölüm 2"
    },
    {
      "id": "it-lastik-cizme",
      "set": "fox-accessories",
      "name": "Lastik çizme",
      "icon": "boot",
      "hint": "Bölüm 3"
    },
    {
      "id": "it-sirt-cantasi",
      "set": "fox-accessories",
      "name": "Sırt çantası",
      "icon": "backpack",
      "hint": "Bölüm 4"
    },
    {
      "id": "it-kristal-lamba",
      "set": "decor",
      "name": "Kristal lamba",
      "icon": "lamp-pendant",
      "hint": "Haftalık hedef"
    },
    {
      "id": "it-nehir-cakili",
      "set": "decor",
      "name": "Nehir çakılı",
      "icon": "circles-three",
      "hint": "Bölüm 3 hedefi"
    },
    {
      "id": "it-nilufer-yapragi",
      "set": "decor",
      "name": "Nilüfer yaprağı",
      "icon": "flower-lotus",
      "hint": "Bölüm 3 hedefi"
    },
    {
      "id": "it-cam-kozalagi",
      "set": "decor",
      "name": "Çam kozalağı",
      "icon": "tree-evergreen",
      "hint": "Bölüm 4 hedefi"
    },
    {
      "id": "it-mese-yapragi",
      "set": "decor",
      "name": "Meşe yaprağı",
      "icon": "leaf",
      "hint": "Bölüm 4 hedefi"
    },
    {
      "id": "it-yaprak-susu",
      "set": "season",
      "name": "Yaprak süsü",
      "icon": "leaf",
      "hint": "Sonbahar şenliği"
    },
    {
      "id": "it-yildiz-rozeti",
      "set": "fox-accessories",
      "name": "Yıldız rozeti",
      "icon": "star-four",
      "hint": "Bölüm 5"
    },
    {
      "id": "it-orgu-eldiven",
      "set": "fox-accessories",
      "name": "Örgü eldiven",
      "icon": "hand-palm",
      "hint": "Bölüm 6"
    },
    {
      "id": "it-semsiye",
      "set": "fox-accessories",
      "name": "Şemsiye",
      "icon": "umbrella",
      "hint": "Bölüm 7",
      "art": "accessories/it-semsiye/it-semsiye.a08323a3@2x.png"
    },
    {
      "id": "it-ruzgarlik",
      "set": "fox-accessories",
      "name": "Rüzgârlık",
      "icon": "wind",
      "hint": "Bölüm 8"
    },
    {
      "id": "it-bere",
      "set": "fox-accessories",
      "name": "Bere",
      "icon": "beanie",
      "hint": "Kış şenliği",
      "art": "accessories/it-bere/it-bere.a4d0a213@2x.png"
    },
    {
      "id": "it-yildiz-kavanozu",
      "set": "decor",
      "name": "Yıldız kavanozu",
      "icon": "sparkle",
      "hint": "Bölüm 5 hedefi"
    },
    {
      "id": "it-gece-minderi",
      "set": "decor",
      "name": "Gece minderi",
      "icon": "moon-stars",
      "hint": "Bölüm 5 hedefi"
    },
    {
      "id": "it-kar-kuresi",
      "set": "decor",
      "name": "Kar küresi",
      "icon": "snowflake",
      "hint": "Bölüm 6 hedefi"
    },
    {
      "id": "it-kurabiye-kavanozu",
      "set": "decor",
      "name": "Kurabiye kavanozu",
      "icon": "cookie",
      "hint": "Bölüm 6 hedefi"
    },
    {
      "id": "it-deniz-yildizi",
      "set": "decor",
      "name": "Deniz yıldızı",
      "icon": "star",
      "hint": "Bölüm 7 hedefi"
    },
    {
      "id": "it-kucuk-capa",
      "set": "decor",
      "name": "Küçük çapa",
      "icon": "anchor",
      "hint": "Bölüm 7 hedefi"
    },
    {
      "id": "it-dag-cicegi",
      "set": "decor",
      "name": "Dağ çiçeği",
      "icon": "flower",
      "hint": "Bölüm 8 hedefi"
    },
    {
      "id": "it-tepe-haritasi",
      "set": "decor",
      "name": "Tepe haritası",
      "icon": "map-trifold",
      "hint": "Bölüm 8 hedefi"
    }
  ]
}
```
</details>

<details><summary><code>content/check_manifest.py</code> (rev 5.5)</summary>

```python
"""Content CI: JSON Schema + rules the schema can't express. Usage: check_manifest.py manifest.json [--channel prod|beta] [--previous prev.json] [--spell-unknown]
rev 5.5: Turkish diacritic spelling (tr_spell.py) = WARNING on beta, ERROR on prod."""
import json, sys, argparse
from jsonschema import Draft202012Validator, FormatChecker
ap=argparse.ArgumentParser(); ap.add_argument("manifest"); ap.add_argument("--channel",default="beta"); ap.add_argument("--previous"); ap.add_argument("--spell-unknown",action="store_true")
a=ap.parse_args(); here=__file__.rsplit("/",1)[0]
schema=json.load(open(f"{here}/manifest.schema.json")); m=json.load(open(a.manifest)); errs=[]; warns=[]
for e in Draft202012Validator(schema, format_checker=FormatChecker()).iter_errors(m): errs.append(f"schema: {'/'.join(map(str,e.path))}: {e.message}")
if not errs:
    items={i["id"] for i in m["items"]}; seen=set()
    for kind,ids in [("item",[i["id"] for i in m["items"]]),("chapter",[c["id"] for c in m["chapters"]]),
                     ("piece",[p["id"] for c in m["chapters"] for p in c["pieces"]]),("goal",[g["id"] for g in m.get("goalPool",[])])]:
        d={x for x in ids if ids.count(x)>1}; d and errs.append(f"duplicate {kind} ids: {sorted(d)}")
    orders=[c["order"] for c in sorted(m["chapters"],key=lambda c:c["order"])]
    orders!=list(range(1,len(orders)+1)) and errs.append(f"chapter orders must be 1..n contiguous, got {orders}")
    m["upcoming"]["chapterOrder"]!=len(orders)+1 and errs.append("upcoming.chapterOrder must be last chapter + 1")
    refs=[("chapter "+c["id"],c["completionReward"]) for c in m["chapters"]]+[("milestone "+x["key"],x["reward"]) for x in m.get("milestones",[])]\
        +[("goal "+g["id"],g["reward"]) for g in m.get("goalPool",[])]+[("season "+s["id"],s["reward"]) for s in m.get("seasons",[])]
    for who,r in refs: r not in items and errs.append(f"{who} rewards unknown item {r}")
    rew=[r for _,r in refs]; d={r for r in rew if rew.count(r)>1}; d and errs.append(f"item granted by more than one source: {sorted(d)}")
    chids={c["id"] for c in m["chapters"]}
    for g in m.get("goalPool",[]): g.get("chapterId") and g["chapterId"] not in chids and errs.append(f"goal {g['id']} unknown chapterId")
    for x in m.get("milestones",[]): x["key"]!=f"day-{x['day']}" and errs.append(f"milestone key/day mismatch {x['key']}")
    for s in m.get("seasons",[]): s["startsAt"]>=s["endsAt"] and errs.append(f"season {s['id']} ends before it starts")
    banned=["nikotin","kanser","akciğer","sağlık","tedavi","yoksunluk","bağımlı","başarısız","kaybettin","sıfırla","tilki adı"]
    sys.path.insert(0, here); from editorial import tr_lower, burn_verbs
    blob=tr_lower(json.dumps(m,ensure_ascii=False))
    for b in banned: b in blob and errs.append(f"editorial: banned word '{b}'")
    # fire / smoke / smoking cues in any copy or icon (rev 5.1: no fire imagery anywhere)
    import re
    cue=re.compile(r"\b(ateş\w*|alev\w*|şömine\w*|kamp ateşi|köz\w*|kor|korlar\w*|mum|mumlar\w*|mumu\w*|tütsü\w*|kül|külü\w*|küller\w*|duman\w*|is|isli|sigara\w*|çakmak\w*|kibrit\w*|buhar\w*)\b")
    for f in sorted(set(cue.findall(blob))): errs.append(f"editorial: fire/smoke cue word '{f}' in content")
    # rev 5.2: the verb 'yak-' (sigara yakmak) and 'yan-' in its burn sense are banned; use parla- / kazan / açıl-
    for root,w in burn_verbs(blob):
        errs.append(f"editorial: banned verb '{w}' ({'yak- evokes sigara yakmak' if root=='yak' else 'yan- burn sense'}); use parla- / kazan / açıl-")
    icons=re.findall(r'"(?:icon|previewIcons)":\s*(?:"([a-z0-9-]+)"|\[([^\]]*)\])', blob)
    names={x for a,b in icons for x in ([a] if a else re.findall(r'"([a-z0-9-]+)"', b))}
    for f in sorted(names & {"fire","fire-simple","flame","campfire","candle","cigarette","cigarette-slash","coffee","fire-extinguisher","fire-truck"}):
        errs.append(f"editorial: fire/smoke/steam icon '{f}'")
    # rev 5.5: Turkish diacritic spelling (ı/i, ş/s, ğ/g, ç/c, ö/o, ü/u, â/a) — warning on beta, error on prod
    import tr_spell
    for path,t,sug,kind in tr_spell.check(m):
        msg=f"spelling: '{t}' at {path} looks like {'ASCII-fied' if kind=='ascii' else 'a diacritic swap of'} '{sug}' (fix it, or add the word to tr_words.txt allowlist)"
        (errs if a.channel=="prod" else warns).append(msg)
    if a.spell_unknown:
        u=tr_spell.unknown(m); u and print("info: words not in tr_words.txt (review, then rebuild): "+" ".join(u))
    if a.channel=="prod":
        pend=[o.get("id") or o.get("key") for o in m["chapters"]+m.get("milestones",[])+m.get("goalPool",[])+m.get("seasons",[]) if o["copyStatus"]=="pending"]
        pend and errs.append(f"prod channel: copy still PENDING APPROVAL: {pend}")
    if a.previous:
        p=json.load(open(a.previous))
        p["version"]>=m["version"] and errs.append("version must increase")
        old={x["id"] for x in p["items"]}|{c["id"] for c in p["chapters"]}|{q["id"] for c in p["chapters"] for q in c["pieces"]}
        new=items|chids|{q["id"] for c in m["chapters"] for q in c["pieces"]}
        gone=old-new; gone and errs.append(f"published ids removed (retire instead): {sorted(gone)}")
warns and not errs and print("\n".join("warning: "+w for w in warns))
print("\n".join(errs) if errs else f"OK  {a.manifest}  channel={a.channel}  v{m['version']}  chapters={len(m['chapters'])}  pieces={sum(len(c['pieces']) for c in m['chapters'])}  items={len(m['items'])}")
sys.exit(1 if errs else 0)
```
</details>

<details><summary><code>content/editorial.py</code> (rev 5.2)</summary>

```python
"""Editorial word rules shared by check_manifest.py and its tests (rev 5.2).
The verb 'yakmak' evokes 'sigara yakmak', so it is never used in app copy; 'yanmak' is banned in its
burn/light sense. Matching is whole-word and morphology-aware, so look-alikes such as yakın, yaklaşık,
yaka, yakala-, yakış-, yakıt, yakut, yan, yanında, yanıt, yanlış, yanak, yanaş-, yansı-, yanıl- pass."""
import re

def tr_lower(s: str) -> str:
    return s.replace("I", "ı").replace("İ", "i").lower()

# yak- (to burn / to light): bare imperative + verb suffixes only. Never bare 'yaka', 'yakın', 'yakl…', 'yakış…', 'yakıt'.
YAK = re.compile(r"\byak(?:"
    r"|ar|arım|arsın|arız|arlar|arsa\w*|arken|ardı\w*|armış\w*"      # aorist  (not yakarış: \b)
    r"|ıyor\w*|tı\w*|tık\w*|tığ\w*|mak\w*|ma|madan|mayın|maz\w*|masın\w*|mış\w*"
    r"|acak\w*|acağ\w*|alım|ayım|sın|sınlar|an|anlar|arak|ınca"
    r"|ıl(?:dı|mış|an|acak|ır|sın)\w*|abil\w*|amaz\w*|ayalım)\b")
# yan- in the burn/light sense: verb forms only. Never 'yan', 'yana', 'yanı', 'yanında', 'yanıt', 'yanlış', 'yanak', 'yanaş', 'yansı…', 'yanıl…'.
YAN = re.compile(r"\byan(?:dı\w*|dığ\w*|ıyor\w*|an|anlar\w*|ar|arak|mak\w*|ma|madan|maz\w*|mış\w*"
    r"|acak\w*|acağ\w*|sın|ık\w*|ıp|abil\w*|ınca)\b")

def burn_verbs(text: str):
    t = tr_lower(text)
    return sorted({("yak", m.group(0)) for m in YAK.finditer(t)} | {("yan", m.group(0)) for m in YAN.finditer(t)})
```
</details>

<details><summary><code>content/tr_spell.py</code> (rev 5.5)</summary>

```python
"""Turkish diacritic spelling check for manifest copy (rev 5.5).

Not a full spellchecker. It catches the typos that actually happen when Turkish is typed on a non-Turkish
keyboard or relayed through tools: ı/i, ş/s, ğ/g, ç/c, ö/o, ü/u (and â/a, î/i, û/u) swapped or ASCII-fied.

Rule: a copy token that is NOT in the wordlist, but whose diacritic-folded form equals the folded form of a
wordlist word, is flagged ("kis" → "kış", "Kucuk" → "küçük", "BOLUM" → "bölüm"). Tokens that are unknown and
collide with nothing are ignored (no false alarms on new words; add them with --spell-unknown).

Wordlist: content/tr_words.txt = every token of the approved copy + a small common-words dictionary +
an allowlist of real words that differ only by diacritics (sen/şen, kar/kâr, …), so both forms are accepted.
Only copy fields are checked; ids, icons, art paths, dates and enums are not."""
import re, os
from editorial import tr_lower

FOLD = str.maketrans("ışğçöüâîû", "isgcouaiu")
WORD = re.compile(r"[a-zçğıöşüâîû]+")
COPY_KEYS = {"name", "title", "line", "body", "cta", "eyebrow", "teaserLine", "hint", "lead", "slipEyebrow", "slipLead", "slipBody"}
HERE = os.path.dirname(os.path.abspath(__file__))

def fold(w: str) -> str:
    return w.translate(FOLD)

def load_words(path=f"{HERE}/tr_words.txt"):
    return {l.strip() for l in open(path, encoding="utf8") if l.strip() and not l.startswith("#")}

def copy_strings(node, path=""):
    """Yield (json-path, text) for every copy string in a manifest."""
    if isinstance(node, dict):
        for k, v in node.items():
            p = f"{path}/{k}"
            if isinstance(v, str) and k in COPY_KEYS: yield p, v
            elif isinstance(v, (dict, list)): yield from copy_strings(v, p)
    elif isinstance(node, list):
        for i, v in enumerate(node): yield from copy_strings(v, f"{path}/{i}")

def tokens(text: str):
    return WORD.findall(tr_lower(text))

def check(manifest, words=None):
    """Return [(path, token, suggestion, kind)] with kind 'ascii' (diacritics dropped) or 'swap' (wrong diacritic)."""
    words = words if words is not None else load_words()
    index = {}
    for w in words: index.setdefault(fold(w), set()).add(w)
    out = []
    for path, text in copy_strings(manifest):
        for t in tokens(text):
            if t in words: continue
            cand = sorted(index.get(fold(t), set()) - {t})
            if cand: out.append((path, t, "/".join(cand), "ascii" if t.isascii() else "swap"))
    return out

def unknown(manifest, words=None):
    words = words if words is not None else load_words()
    return sorted({t for _, s in copy_strings(manifest) for t in tokens(s)} - words)
```
</details>

<details><summary><code>content/build_tr_words.py</code> (rev 5.5; writes <code>content/tr_words.txt</code>)</summary>

```python
"""Rebuild content/tr_words.txt (rev 5.5). Run after copy is APPROVED:  python3 content/build_tr_words.py
Sources: (1) every token of approved copy in manifest.example.json, (2) COMMON, a small hand-checked list of
everyday Turkish words and app vocabulary, (3) ALLOW, real words that differ only by diacritics, so both forms pass.
Review the diff before committing: a typo in approved copy would otherwise enter the wordlist."""
import json, os, sys
here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here)
from tr_spell import copy_strings, tokens

COMMON = """
ve ile bir bu şu o ben sen biz siz onlar her hiç çok az daha en gibi için kadar sonra önce şimdi bugün yarın dün
gün günü günler hafta haftası bu-hafta ay yıl saat dakika sabah akşam gece öğle kış yaz bahar sonbahar ilkbahar mevsim
ışık ışığı ışıklar ışığın ışığını parladı parlıyor kazan kazandın kazanıldı yol yolu yolculuk adım adımı adımlar
bölüm bölümü sığınak sığınağın sığınağını sığınağında koleksiyon hedef hedefler hedefi ödül ödülü etkinlik şenlik şenliği
küçük büyük güzel sakin sıcak soğuk yeni eski yeşil mavi sarı kırmızı beyaz siyah turuncu açık koyu sessiz yumuşak
çay kahve su kar yağmur rüzgâr güneş yıldız yıldızlar gökyüzü göğü deniz kıyı ağaç ağacı çiçek çiçeği dağ tepe orman bahçe
oda odası ev köşe köşesi pencere kapı masa minder battaniye örgü eldiven şapka çizme atkı bere çanta şemsiye rozet
tilki pati kuş balık böcek kelebek taş taşı kum kabuk dere göl gölet köprü çadır fener harita pusula
gör bak bakın dinlen dinlenmek nefes nefesi aldın al ver dene denedin oku okudun yaz yazdın uğra değiştir düzenle
hazır tamamlandı tamamla devam başla başlangıç bitti bitir kaydet sil geri ileri tamam iptal kapat aç evet hayır
bugünün dünün yarının ilk son sıradaki önceki sonraki istediğin zaman isteğe bağlı kendin kendine kendini
check in check-in iyi kötü zor kolay hızlı yavaş ağır hafif uzun kısa geniş dar yüksek alçak
""".split()
ALLOW = """
sen şen ser şer kar kâr hala hâlâ ama âmâ adet âdet kur kür aşı ası
""".split()

def build():
    m = json.load(open(f"{here}/manifest.example.json"))
    approved = set()
    def walk(o):
        if isinstance(o, dict):
            if o.get("copyStatus", "approved") == "approved": pass
            else: return
            for v in o.values(): walk(v)
        elif isinstance(o, list):
            for v in o: walk(v)
    # copy of objects that are approved (chapters, milestones, goals, seasons carry copyStatus; items/upcoming have none)
    for key in ("chapters", "milestones", "goalPool", "seasons", "items"):
        for o in m.get(key, []):
            if o.get("copyStatus", "approved") == "approved":
                approved |= {t for _, s in copy_strings(o) for t in tokens(s)}
    approved |= {t for _, s in copy_strings(m.get("upcoming", {})) for t in tokens(s)}
    common = {w for w in COMMON if "-" not in w}
    with open(f"{here}/tr_words.txt", "w", encoding="utf8") as f:
        f.write("# Turkish wordlist for tr_spell.py — generated by build_tr_words.py (rev 5.5). Lowercase, Turkish casing.\n")
        f.write("# allowlist (real words that differ only by diacritics)\n" + "\n".join(sorted(ALLOW)) + "\n")
        f.write("# common words\n" + "\n".join(sorted(common - set(ALLOW))) + "\n")
        f.write("# approved copy\n" + "\n".join(sorted(approved - common - set(ALLOW))) + "\n")
    return len(ALLOW), len(common), len(approved)

if __name__ == "__main__":
    print("tr_words.txt: allow=%d common=%d approved-copy tokens=%d" % build())
```
</details>

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
| Koleksiyon | "Koleksiyon" · "Mevsim etkinliği · {d} {Ay}’{dat} kadar" (*rev 5* fix, §23) · "Sonbahar şenliği" · "{a} / {b} ışık" · "Bu haftanın hedefleri" · "Pazartesi yenilenir" · "3 gün check-in yap" · "2 kez bir baş etme aracı dene" · "Sığınağında bir parçanın yerini değiştir" · "Kazandın: {item}" · "Hedefler isteğe bağlı. Tamamlanmayan hedef bir şey kaybettirmez; yeni hafta yeni hedeflerle başlar." · "Koleksiyonlar" · "Kristaller" · "Aksesuarlar" · "Süsler" · items "Ametist", "Kuvars", "Akuamarin", "Ay taşı", "Kristal lamba", "Tilki için atkı" · sources "Gün 60", "Haftalık hedef" |

### 19.8 Open questions (endless)
*Rev 5: questions 11, 12 and 14 are answered (§24, §25, §21); see §12c.*
11. **Release cadence:** 1 chapter every 2 weeks plus weekly goals/season drops? Who writes and QA's the manifest copy?
12. **Fox accessories art:** these need new layered mascot art (a hat/scarf on the shared 683 px canvas). Until then, show the icon placeholders?
13. **Seasonal light target** (5 lights in a month window): OK, or scale it to the window length?
14. **`content_manifests` migration** (§19.4): apply as proposed, or start with a single Storage JSON file (`content/manifest.json`, read through the CDN with an ETag)? The table gives RLS-scheduled publishing; the file is simpler.
15. **Chapter art:** keep Phosphor icons in node circles (as mocked) or move to illustrated piece art per chapter?

---

## 20. Dark mode — *rev 5*

**Principle:** the same token names get a second value. Nothing about layout, copy, motion or haptics changes. The brand action colour `primary #C84F2E` and the light colours `gold #D9AC58` / `teal #5ED6CF` are **identical in both modes**, so a light and a button look the same at night. Night screens (İstek, Nefes, 07a/b, Gün N, Bölüm transitions) were already dark; in dark mode they keep their palette and only their light sheets and glows adapt (§20.4).

Mockups (390 × 844 @2x, generator `mock5/`; the dark lib applies the dark tokens to the unchanged rev 3/4 generators):
`rev5-yuva`, `rev5-siginak`, `rev5-rotam`, `rev5-ben`, `rev5-koleksiyon`, `rev5-onb-2-paket` (onboarding step), `rev5-istek` (an already-dark screen adapting), `rev5-gun7` (a full night screen), plus `rev5-tokens.png` (token sheet + ratios), `rev5-maskot-efekt.png` (light vs dark pairs) and `rev5-overview.png`.

### 20.1 Activation (code, for Kodcu; **not applied**)
- `app.json`: `"userInterfaceStyle": "light"` → `"automatic"`. On Android this also needs `expo-system-ui` (`npx expo install expo-system-ui`).
- `src/theme/tokens.ts`: `export const light = {…}; export const dark = {…}` with the names below. `useTheme()` resolves the scheme from the Ben setting below: `appearance === 'system' ? useColorScheme() : appearance`.
- `App.tsx` has a single `const C = {…}` (L52) and a module-level `StyleSheet.create` (L889; 76 uses of `C.*`). Convert it to `makeStyles(t)`, memoised per scheme (`useMemo(() => makeStyles(t), [scheme])`). Map the existing names: `bg→canvas`, `paper→card`, `ink→ink`, `muted→sec`, `faint→ter`, `line→border`, `darkGreen→acc_text`, `softGreen→acc_soft`, `softOrange→urge`, `gold→gold`, `paleGold→gold_soft`. `src/app/auth/callback.tsx` hard-codes `#F8F6F1`: use `canvas`.
- `<StatusBar style="dark"/>` (5×) → `style={scheme === 'dark' || screenIsNight ? 'light' : 'dark'}`.
- The splash (`loading` view) uses `canvas` from the scheme, so there is no white flash at night.
- **Manual choice (*rev 5.1*, Umut):** Ben → DENEYİM → **"Görünüm"**, a 3-segment control **Sistem / Açık / Koyu** (icons `circle-half`, `sun`, `moon`; mockups `rev5-ben.png` dark and `rev5-ben-acik.png` light). The caption reads "Sistem, telefonunun ayarını izler." **Default: Sistem.**
  - **Storage, local-only:** `expo-sqlite/localStorage` key **`quit-companion-appearance-v1`** = `"system" | "light" | "dark"`. It sits next to `quit-companion-state-v1`; a missing or invalid value means `"system"`. It is **not** part of `AppState` or the Supabase snapshot and is **not synced**: it is a per-device display preference, so a phone and a tablet can differ, and sign-out or account deletion doesn't touch it.
  - **Behaviour:** applies immediately, with no restart and no animation (a cross-fade is fine; under reduce motion, none). For `system`, subscribe to `Appearance.addChangeListener` so it follows the OS live, including scheduled dark mode. `light`/`dark` ignore the OS. Also call `Appearance.setColorScheme(choice === 'system' ? null : choice)` (RN ≥ 0.73) so native UI follows: alerts, the keyboard, date pickers and the Android navigation bar via `expo-system-ui`. Night screens stay night in every mode. The status bar rule above uses the resolved scheme.
  - Accessibility: `accessibilityRole="radiogroup"`, each segment `radio` with `checked`; the label is "Görünüm, Sistem seçili". Segments are ≥ 44 pt tall in RN (the mockup shows 32 px inside a 38 px track; pad the hit area). Haptic: none (a setting, not a moment).
  - Tokens: track `sunken`, selected pill `card` + ink text 800 + shadow, unselected `sec`.

### 20.2 Semantic tokens (light → dark)
| Token | Light | Dark | Used for |
|---|---|---|---|
| `canvas` | `#F8F6F1` | `#14171B` | screen background, sheets |
| `card` | `#FFFEFC` | `#1E2228` | cards, tab bar, grouped lists |
| `sunken` | `#F2F1EB` | `#272C33` | inputs, btn2, progress track, locked tiles |
| `border` | `#EAE4DC` | `#353C46` | card borders, ring tracks, locked nodes |
| `ink` | `#202522` | `#F3EFE8` | primary text |
| `sec` | `#666C66` | `#B5AFA5` | secondary text |
| `ter` | **`#6E726A`** (*5.1*, was `#A4A79F`) | `#8C8F87` | tertiary text, locked labels. **Only on canvas or card**; on sunken, gold_soft, hero or urge use `sec` |
| `primary` | `#C84F2E` | `#C84F2E` | action fill (unchanged) |
| `pressed` | `#A5412B` | `#B04529` | action pressed |
| `shadow` | `#8E3623` | `#6A2818` | 3D edge under action/done nodes |
| `acc_text` | `#A5412B` | `#F2906F` | accent text, eyebrows, active tab |
| `acc_soft` | `#FDF0EC` | `#3A2621` | accent icon tile |
| `hero` | `#FCEBE3` | `#3A2824` | active tab pill, hero banner |
| `urge` | `#F7E9E2` | `#2C2224` | urge surface |
| `tc300` | `#F0DDD2` | `#5A4038` | path dashes, dashed outlines |
| `gold` | `#D9AC58` | `#D9AC58` | light ring, progress, bars, icons (unchanged). **Never text on light surfaces** (*5.1*) |
| `gold_text` *(5.1)* | **`#866018`** | **`#D9AC58`** | the **only** token for gold-coloured text: eyebrows, "+1 ışık" labels, light counts. On night screens (o950–o800) gold `#D9AC58` text is allowed (6.83–8.55:1) |
| `gold_deep` | `#B98A2E` | `#E7C27A` | icon on gold tile |
| `gold_soft` | `#F7F0DC` | `#352D1E` | gold tile / done quest / light token disc |
| `gold_edge` | `#A9822F` | `#8A6A26` | 3D edge under gold nodes |
| `teal` | `#5ED6CF` | `#5ED6CF` | breath accent (unchanged) |
| `teal_deep` | `#2E7F7A` | `#6FDCD4` | teal icon/text |
| `teal_soft` | `#E3F7F5` | `#18322F` | teal tile |
| `sky_top` | `#FBE3D6` | `#171A26` | top of the day sky (dusk in dark) |

Dark-only rules:
- **Elevation is lightness, not shadow.** canvas `#14171B` < card `#1E2228` < sunken `#272C33` (sunken is *lighter* in dark: inputs and tracks must read as "fields"). Soft brown shadows `rgba(92,56,36,.08–.10)` become `rgba(0,0,0,.28–.32)`. The 3D edges under the action and done nodes use `shadow #6A2818`; the edges under locked nodes use `#0F1215`.
- **Accent text is lighter:** `acc_text #A5412B` becomes **`#F2906F`** (eyebrows, links, active tab, "Bu adımı atla"). The action fill stays `#C84F2E`, with a white label (4.55:1, the same as light).
- **Inverted surfaces** (tooltip "Pencere · 1 ışık kaldı", the selected filter chip) use `ink #F3EFE8` as the background with **`canvas #14171B` text**, never white text.
- **Translucent whites** over a scene (`rgba(255,254,252,.7–.92)`: chips, progress tracks, the banner tile) become `rgba(30,34,40, same α)` plus a 1 px `rgba(255,255,255,.07)` inner border.
- **Fog** (§19.2): the gradient is `rgba(20,23,27,0) → canvas 55 %`, the ellipses are `rgba(44,50,58,.85–.95)` with `blur(16px)`, the teaser circle is `rgba(53,60,70,.7)`, and the locked icon is `#8C8F87`.
- Modal scrim `rgba(20,23,27,.45)` → `rgba(0,0,0,.62)`. Toggle knob stays white. The "today" dot border on the Rotam track uses `card`.

### 20.3 Contrast (WCAG 2.x relative luminance, computed on the box by `mock5/tokens.py`)
| Pair (fg / bg) | Dark ratio | Light ratio | Target |
|---|---|---|---|
| ink / canvas — body text | **15.69:1** | 14.41:1 | ≥ 4.5 |
| ink / card — body text on card | **13.94:1** | 15.44:1 | ≥ 4.5 |
| ink / sunken — text on sunken/btn2 | **12.26:1** | 13.75:1 | ≥ 4.5 |
| sec / canvas — secondary text | **8.25:1** | 4.98:1 | ≥ 4.5 |
| sec / card — secondary on card | **7.33:1** | 5.34:1 | ≥ 4.5 |
| sec / sunken — secondary on sunken | **6.45:1** | 4.76:1 | ≥ 4.5 |
| ter / canvas — tertiary text (rev 5.1: AA) | **5.47:1** | 4.55:1 | ≥ 4.5 |
| ter / card — tertiary on card | **4.86:1** | 4.87:1 | ≥ 4.5 |
| ter / sunken — ter on sunken: NOT allowed, use sec | **4.28:1** ⚠ | 4.34:1 ⚠ | ≥ 4.5 |
| acc_text / canvas — accent text / eyebrow | **7.70:1** | 5.73:1 | ≥ 4.5 |
| acc_text / card — accent on card / active tab | **6.84:1** | 6.14:1 | ≥ 4.5 |
| acc_text / hero — active tab label on pill | **5.96:1** | 5.35:1 | ≥ 4.5 |
| acc_text / acc_soft — icon on accent tile | **6.08:1** | 5.56:1 | ≥ 4.5 |
| #FFFFFF / primary — primary button label | **4.55:1** | 4.55:1 | ≥ 4.5 |
| primary / canvas — primary button vs canvas (UI component) | **3.95:1** | 4.21:1 | ≥ 3.0 |
| gold / canvas — gold progress/ring vs canvas | **8.55:1** | 1.95:1 ⚠ | ≥ 3.0 |
| gold / card — gold bar on card | **7.60:1** | 2.09:1 ⚠ | ≥ 3.0 |
| gold_deep / gold_soft — gold icon on gold tile | **8.02:1** | 2.74:1 ⚠ | ≥ 3.0 |
| gold_text / canvas — gold/ochre text | **8.55:1** | 5.26:1 | ≥ 4.5 |
| gold_text / card — gold text on card | **7.60:1** | 5.63:1 | ≥ 4.5 |
| gold_text / gold_soft — gold text on gold tile | **6.47:1** | 4.99:1 | ≥ 4.5 |
| gold_text / hero — gold text on hero | **6.62:1** | 4.90:1 | ≥ 4.5 |
| gold_text / sunken — gold text on sunken | **6.69:1** | 5.02:1 | ≥ 4.5 |
| gold / o800 — gold eyebrow / +1 pill on night | **6.83:1** | 6.83:1 | ≥ 4.5 |
| teal_deep / teal_soft — teal icon on teal tile | **8.37:1** | 4.26:1 | ≥ 3.0 |
| teal_deep / card — teal text on card | **9.78:1** | 4.70:1 | ≥ 4.5 |
| border / canvas — border visible (decorative) | **1.61:1** | 1.17:1 ⚠ | ≥ 1.3 |
| ink / hero — text on hero/urge surface | **12.14:1** | 13.44:1 | ≥ 4.5 |
| ter / gold_soft — NOT allowed, use sec | **4.14:1** ⚠ | 4.31:1 ⚠ | ≥ 4.5 |
| ter / hero — NOT allowed, use sec | **4.24:1** ⚠ | 4.24:1 ⚠ | ≥ 4.5 |

*Rev 5.1* (karar: koordinatör asistan, Umut onayı bekleniyor): text targets are now **≥ 4.5 for all text**, including tertiary.
- **`ter`** light `#6E726A`: **4.55:1 on canvas** and **4.87:1 on card**, AA. It stays below 4.5 on sunken, gold_soft, hero and urge (rows marked ⚠; urge 4.14:1), so `ter` is **not allowed** there; use `sec`, which passes on all of them (light 4.54–4.76:1, dark 6.24–7.08:1). Dark `ter` follows the same rule.
- **Gold is never text** on light or dark UI surfaces; it is decoration, progress and icons only. The ⚠ gold and gold_deep rows are non-text graphics, always next to a text label ("3 / 6 parça", "1/2"). They are left as they are (decorative; open question 30 if Umut wants ≥ 3:1 there).
- **`gold_text`** for any gold-coloured text: light `#866018`, 4.90–5.63:1 on every light surface; dark `#D9AC58`, 6.47–8.55:1.
- Today, gold text appears only on night screens ("GÜN 7" eyebrows, the "+1 ışık" pill), where `#D9AC58` is 6.83–8.55:1 on o800–o950. Every remaining ⚠ is the decorative border (1.17:1, intentionally faint).
- The light rev 3/4 PNGs still render the old `ter #A4A79F`. The dark rev 5 PNGs and `rev5-tokens.png` use the 5.1 values. Build from this table.

### 20.4 Scenes, mascot and FX on dark
| Layer | Light | Dark |
|---|---|---|
| **Day scene** (Yuva, Sığınak header, Rotam, Ben, onboarding, handoffs, İçerik sonu) | sky `#FBE3D6 → #FCEBE3 → #F7E9E2`, hill `#F0DDD2`, hill2 `#EAD0C2` | **Dusk:** sky `#171A26` 0 % → `#272230` 55 % → `#3A2A2E` 100 %, hill `#4A3431`, hill2 `#5C3F37` (α .75), plus a **warm horizon glow**: an ellipse 470 × 150 centred on the horizon, `radial-gradient(rgba(200,79,46,.20) → 0 at 70 %)`. The same geometry (`horizonY`) as light. |
| **Night scene** (İstek, Nefes, 07a/b, Gün N, Bölüm transitions) | o950 → o900 → o800, hills o700/o600 | **Unchanged.** Only the light sheet under it switches to dark tokens (see `rev5-istek`). |
| **Mascot** (`fox_*`) | as is | Same art (no recolour, no new assets). Add a soft backlight behind the fox: a circle 1.15 × the fox width, centred at 42 % of its height, `radial-gradient(rgba(217,172,88,.13) → 0 at 65 %)`, plus (web mockup only) `filter: brightness(.96) saturate(.96)`. RN has no CSS filter, so skip it there; the backlight alone is enough. This keeps the silhouette readable on dusk without glare. |
| `fx_sparkles` | opacity per screen (e.g. .45–.7) | **× 0.6** |
| `fx_shield`, `fx_crystals` | .95 / .8 (İstek) | **× 0.75** |
| `fx_bubbles` | .55 / .35 | **× 0.8** |
| `fx_breath_ring` | 1 / .8 | **× 0.85** |
| `fx_smoke` | — | **never used** (*rev 5.1*: no smoke imagery anywhere, §19.1a) |
| Gold halo behind the fox (07a, Gün N, Bölüm complete) | `rgba(217,172,88,.38)` | **`.26`** (`.32` → `.22`) |
| Light token drop-shadow (07a) | `rgba(217,172,88,.8)` 14 px | **`.55`** |
| Light token | gold_soft disc + gold ring + gold_deep sparkle | disc `#352D1E`, ring `#D9AC58`, sparkle `#E7C27A` (8.0:1) |

Implementation: `fxOpacity(base, layer) = scheme === 'dark' ? base * FX_DARK[layer] : base` in one place, so `layers_*.json` stays the single position source (positions are identical in both modes).

### 20.5 Per-screen notes
- **Yuva (`rev5-yuva`):** dusk scene h 380. The speech bubble uses `card` plus the dark shadow. The done check-in quest uses `gold_soft #352D1E`; "+1" stays `sec`. The stat tiles use `acc_soft`. The tab bar uses `card` with a top `border`.
- **Sığınak (`rev5-siginak`):** the header fades (mask) from dusk into `canvas`. Path dashes `tc300 #5A4038`. Done nodes primary + `#6A2818` edge. The next node uses `gold_soft` + a gold ring on a `border` track. Locked nodes use `border #353C46` + a `#0F1215` edge. The tooltip is inverted. Fog and teaser follow §20.2.
- **Rotam / Ben:** the cards use `card` on `canvas`. Ben's DENEYİM group now starts with the Görünüm control (§20.1); the haptics toggle is below it (scroll). Toggles: on = `teal_deep`. The milestone track and the "Son 7 gün" strip (approved, §17.2) use the same tokens.
- **Onboarding (`rev5-onb-2-paket`):** dusk scene, the progress track is translucent dark, inputs use `sunken`, the tip card uses `gold_soft`.
- **Already dark (`rev5-istek`, `rev5-gun7`):** the night scene is as is. The İstek tool sheet uses `canvas` with `card` rows. FX follow §20.4.


## 21. Supabase migrations (final, ready to apply — **not run**) — *rev 5*

The files follow the repo convention `supabase/migrations/YYYYMMDDNNNN_name.sql`, after the existing `202610200001_user_snapshots.sql`. They use the same style: a comment header, `if not exists`, `revoke`/`grant`, and `drop policy if exists` + `create policy`. Copies are in `proposals/supabase/migrations/` (outside the repo). **Kodcu copies them into the PR.** Apply them in order with `supabase db push` (or `supabase migration up` locally). **I have not run them against any Supabase project.**

#### 21.0 Test order before production (*rev 5.3*, karar: Umut — no branch, nothing paid)
| Step | Where | Commands / checks | Who |
|---|---|---|---|
| 0 | Box / laptop, in-memory | `node proposals/supabase/tests/migrations.pglite.test.mjs` (PGlite, stubbed `auth`/`storage`), currently 41/41 | bots / Kodcu |
| 1 | **Local** Supabase (Docker, free) | `supabase start` → `supabase db reset` (applies every file in `supabase/migrations/` from scratch, then `seed.sql` if present). Then run the §21 checks in local Studio or psql: snapshot v1/v2 upserts, prod rejecting pending, the immutable published row, anon unable to list `content`, the storage policies on the real local storage schema. Then `supabase migration up` once more (idempotent) and `supabase db lint`. Results go into the PR. | bots / Kodcu |
| 2 | **Production** | only after 0 and 1 are green: **Umut** applies with `supabase db push` (or the dashboard SQL editor), then checks `select version from supabase_migrations.schema_migrations order by version desc limit 3`. | **Umut only** |

There is no Supabase branch or staging project (*rev 5.3*). Bots never connect to the hosted project.

| File | What | Depends on |
|---|---|---|
| `supabase/migrations/202611020001_user_snapshots_v2.sql` | `snapshot_version` (a **generated** column derived from the JSON) + 3 shape checks for `milestones`, `collection`, `personalization` | 202610200001 |
| `supabase/migrations/202611020002_content_manifests.sql` | table, constraints, index, RLS + grants, a guard trigger (append-only once published, increasing version, **prod rejects PENDING copy**) | — |
| `supabase/migrations/202611020003_content_storage.sql` | public bucket `content` (PNG/WebP, ≤ 2 MiB) + a restrictive policy that blocks client API access to it | Supabase `storage` schema |

**Verification on the box** (`proposals/supabase/tests/migrations.pglite.test.mjs`): PGlite 0.5.14 (PostgreSQL 18.6, in-memory). Supabase is stubbed with the roles `anon`, `authenticated`, `service_role` (bypassrls), `auth.users`, `auth.uid()` from `request.jwt.claim.sub`, `storage.buckets`, and `storage.objects` (RLS on, plus a deliberately loose "avatars" policy). Steps: apply 202610200001, then each new file **twice** (idempotent). **41/41 pass**, including:
- snapshot: existing rows get version 1; a client v2 upsert gets 2; an old client overwrite goes back to 1; clients can't write the column; malformed `milestones` / `collection` / `personalization` are rejected; per-user RLS is unchanged.
- manifests: the service role inserts on beta with pending copy; prod rejects PENDING; version must increase; `manifest.version` must equal the row; published rows can't be updated or deleted; scheduled rows can be edited; anon sees only published rows (a future v8 is hidden) and the latest-version query plan (printed by the test) is `Index Only Scan Backward using content_manifests_channel_version_key`; anon/authenticated can't write or call the trigger function.
- storage: the bucket is public, 2 MiB, PNG/WebP. anon and authenticated (even with the loose avatars policy) can't list or upload in `content`; avatars still work; the service role uploads.

Caveat: hosted Supabase runs PG 15/17, and every feature used here (generated columns, jsonpath, restrictive policies) exists since PG 12. Supabase's real `storage.objects` has more columns; the policy only uses `bucket_id`. On hosted projects, creating policies on `storage.objects` from migrations is supported.

**Client query (unchanged from §19.4):** `supabase.from('content_manifests').select('version, schema_version, min_app_version, manifest').eq('channel', channel).order('version', { ascending: false }).limit(1).maybeSingle()`. Art: `supabase.storage.from('content').getPublicUrl(path)`. Clients never call `list()` (it is blocked).

**Who writes (*rev 5.1*, Umut):** prod content rows and prod Storage uploads are written **only by Umut**, from the dashboard or by running the publish bundle locally with the prod **service role** key, which **only Umut holds**. It is never in the app, never in CI, and never given to a bot. *Rev 5.3:* the same applies to **beta** rows and uploads. Bots write nothing to the hosted project; they deliver files (§24.1). The guard trigger applies to every writer.

### 21.1 `supabase/migrations/202611020001_user_snapshots_v2.sql`
```sql
-- Snapshot format v2: optional top-level `milestones`, `collection`, `personalization` inside
-- public.user_snapshots.snapshot (spec rev 5 §15, §19.4). Additive only: no data is changed and old
-- clients keep working (they drop unknown top-level keys).
-- snapshot_version is GENERATED from the JSON itself, so it stays correct even when an old client
-- upserts a v1-shaped snapshot over a v2 row (an upsert never sends this column).

alter table public.user_snapshots
  add column if not exists snapshot_version smallint
  generated always as (
    case
      when snapshot -> 'schemaVersion' = '2'::jsonb
        or snapshot ? 'milestones'
        or snapshot ? 'collection'
        or snapshot ? 'personalization'
      then 2
      else 1
    end
  ) stored;

comment on column public.user_snapshots.snapshot_version is
  '1 = {profile, events}; 2 = adds milestones/collection/personalization. Derived from snapshot; read-only.';

-- Shape guards. The client validates fully (parseAppState); these only stop malformed payloads.
alter table public.user_snapshots drop constraint if exists user_snapshots_milestones_shape;
alter table public.user_snapshots
  add constraint user_snapshots_milestones_shape check (
    not (snapshot ? 'milestones')
    or (
      jsonb_typeof(snapshot -> 'milestones') = 'object'
      and jsonb_typeof(snapshot -> 'milestones' -> 'seen') = 'array'
      and jsonb_array_length(snapshot -> 'milestones' -> 'seen') <= 256
      and not jsonb_path_exists(snapshot, '$.milestones.seen[*] ? (!exists(@.key) || @.key.type() != "string")')
    )
  ) not valid;

alter table public.user_snapshots drop constraint if exists user_snapshots_collection_shape;
alter table public.user_snapshots
  add constraint user_snapshots_collection_shape check (
    not (snapshot ? 'collection')
    or (
      jsonb_typeof(snapshot -> 'collection') = 'object'
      and jsonb_typeof(snapshot -> 'collection' -> 'earned') = 'array'
      and jsonb_array_length(snapshot -> 'collection' -> 'earned') <= 2000
      and not jsonb_path_exists(snapshot, '$.collection.earned[*] ? (!exists(@.id) || @.id.type() != "string")')
    )
  ) not valid;

alter table public.user_snapshots drop constraint if exists user_snapshots_personalization_shape;
alter table public.user_snapshots
  add constraint user_snapshots_personalization_shape check (
    not (snapshot ? 'personalization')
    or (
      jsonb_typeof(snapshot -> 'personalization') = 'object'
      and (not (snapshot -> 'personalization' ? 'slots')
           or jsonb_typeof(snapshot -> 'personalization' -> 'slots') = 'object')
    )
  ) not valid;

-- Existing rows are v1 (no such keys), so validation cannot fail; VALIDATE does not block writes.
alter table public.user_snapshots validate constraint user_snapshots_milestones_shape;
alter table public.user_snapshots validate constraint user_snapshots_collection_shape;
alter table public.user_snapshots validate constraint user_snapshots_personalization_shape;

-- RLS policies and grants from 202610200001 already cover the new column; nothing to change.
-- Down:
--   alter table public.user_snapshots drop constraint if exists user_snapshots_personalization_shape;
--   alter table public.user_snapshots drop constraint if exists user_snapshots_collection_shape;
--   alter table public.user_snapshots drop constraint if exists user_snapshots_milestones_shape;
--   alter table public.user_snapshots drop column if exists snapshot_version;
```

### 21.2 `supabase/migrations/202611020002_content_manifests.sql`
```sql
-- Remote Sığınak content (chapters, milestones, goals, seasons, items) — spec rev 5 §19.4.
-- Append-only, versioned per channel, scheduled with published_at. Clients (anon or signed in) can read
-- only published rows; only the service role (CI / dashboard) writes. Art lives in the `content`
-- Storage bucket (202611020003).

create table if not exists public.content_manifests (
  id bigint generated always as identity primary key,
  channel text not null default 'prod',
  version integer not null,
  schema_version smallint not null default 1,
  min_app_version text not null default '1.0.0',
  published_at timestamptz not null,
  manifest jsonb not null,
  notes text,
  created_at timestamptz not null default now(),
  constraint content_manifests_channel check (channel in ('prod', 'beta')),
  constraint content_manifests_version_positive check (version > 0),
  constraint content_manifests_schema_version check (schema_version >= 1),
  constraint content_manifests_min_app_version check (min_app_version ~ '^[0-9]+\.[0-9]+\.[0-9]+$'),
  constraint content_manifests_manifest_size check (pg_column_size(manifest) < 524288),
  constraint content_manifests_manifest_matches_row check (
    jsonb_typeof(manifest) = 'object'
    and manifest ->> 'version' = version::text
    and manifest ->> 'schemaVersion' = schema_version::text
    and jsonb_typeof(manifest -> 'chapters') = 'array'
  ),
  constraint content_manifests_channel_version_key unique (channel, version)
);

comment on table public.content_manifests is
  'Append-only Sığınak content manifests. Client: highest published version per channel. Never update or delete a published row; publish a higher version instead.';

-- Lookups: the unique (channel, version) index serves "latest version" (backward scan).
-- This one serves the publishing schedule / "what goes live next" queries.
create index if not exists content_manifests_channel_published_at_idx
  on public.content_manifests (channel, published_at desc);

alter table public.content_manifests enable row level security;

revoke all on table public.content_manifests from anon, authenticated;
grant select on table public.content_manifests to anon, authenticated;

drop policy if exists "Anyone can read published manifests" on public.content_manifests;
create policy "Anyone can read published manifests"
  on public.content_manifests for select to anon, authenticated
  using (published_at <= now());
-- No insert/update/delete policies: only the service role (bypasses RLS) writes.

-- Guard rails that also bind the service role (triggers are not bypassed by RLS bypass).
create or replace function public.content_manifests_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  latest integer;
begin
  if tg_op in ('UPDATE', 'DELETE') and old.published_at <= now() then
    raise exception 'content_manifests: version % (%) is published and immutable; insert a higher version instead',
      old.version, old.channel using errcode = 'check_violation';
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;

  if tg_op = 'UPDATE' and (new.channel <> old.channel or new.version <> old.version) then
    raise exception 'content_manifests: channel and version cannot change' using errcode = 'check_violation';
  end if;

  if tg_op = 'INSERT' then
    select max(m.version) into latest from public.content_manifests m where m.channel = new.channel;
    if latest is not null and new.version <= latest then
      raise exception 'content_manifests: version must be greater than % for channel %', latest, new.channel
        using errcode = 'check_violation';
    end if;
  end if;

  if new.channel = 'prod'
     and jsonb_path_exists(new.manifest, 'strict $.**.copyStatus ? (@ == "pending")') then
    raise exception 'content_manifests: prod manifest contains copy that is still PENDING APPROVAL'
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

revoke all on function public.content_manifests_guard() from public, anon, authenticated;

drop trigger if exists content_manifests_guard on public.content_manifests;
create trigger content_manifests_guard
  before insert or update or delete on public.content_manifests
  for each row execute function public.content_manifests_guard();

-- Down:
--   drop trigger if exists content_manifests_guard on public.content_manifests;
--   drop function if exists public.content_manifests_guard();
--   drop table if exists public.content_manifests;
```

### 21.3 `supabase/migrations/202611020003_content_storage.sql`
```sql
-- Public, read-only Storage bucket for Sığınak content art — spec rev 5 §19.4.
-- Paths: chapters/{chapterId}/{name}.{contentHash}@2x.png (or .webp), items/{set}/{name}.{hash}@2x.png.
-- Files are content-hashed and immutable; upload with cacheControl 31536000.
-- Clients read ONLY through public URLs (getPublicUrl / CDN). They get no Storage API access, so they
-- cannot list the bucket and spot unreleased chapter art early. The service role (CI) uploads.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('content', 'content', true, 2097152, array['image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Defence in depth: a RESTRICTIVE policy, so no current or future permissive policy on storage.objects
-- (e.g. a later "users upload avatars" policy) can ever open this bucket to client reads, lists or writes.
drop policy if exists "Content bucket is closed to client API access" on storage.objects;
create policy "Content bucket is closed to client API access"
  on storage.objects as restrictive for all to anon, authenticated
  using (bucket_id <> 'content')
  with check (bucket_id <> 'content');
-- No permissive policy is created for this bucket: public-URL reads do not go through RLS,
-- and the service role bypasses RLS for uploads.

-- Down:
--   drop policy if exists "Content bucket is closed to client API access" on storage.objects;
--   delete from storage.buckets where id = 'content';  -- only after emptying the bucket
```


## 22. Bölüm 3 · Dere kenarı and Bölüm 4 · Orman yolu — copy (**APPROVED** by Umut, rev 5.1) — *rev 5*

*Rev 5.1:* **approved by Umut**: the chapter copy and its changes vs rev 4 (Kamp ateşi removed, Berrak gölet, Sırt çantası as the Bölüm 4 accessory). The goals and collection item names were approved on his authority (onay: koordinatör asistan, Umut'un yetkisiyle), with one fix: `g-orman-coping-2`. Every string below has `copyStatus: "approved"` in `content/manifest.example.json` (v8) and passes `--channel prod`. Rules applied: no health or clinical words, no fire, smoke or cigarette cues, the mascot has no name, and nothing is lost or reset. Piece names are ≤ 24 chars and lines are ≤ 64 chars (enforced by the schema). Layout and screens match Bölüm 2 (§16): fog teaser → previous chapter's completion → handoff intro → path → completion.

### BÖLÜM 3 · DERE KENARI — “Suyun sesi” (order 3, scene `day`) · **APPROVED**

| Slot | Copy |
|---|---|
| Fog teaser (on the previous chapter's path) | “Uzaktan bir su sesi geliyor.” · preview icons `bridge`, `flower-lotus`, `boat` |
| Intro eyebrow | BÖLÜM 3 · DERE KENARI |
| Intro title | Yol bir derenin kıyısına iniyor. |
| Intro body | Bahçenin ötesinde yavaşça akan bir dere var. Her 2 ışık kıyıya yeni bir parça ekler; bahçen ve ilk odan olduğu gibi yerinde kalır. |
| Intro CTA | Kıyıya in |
| Completion eyebrow | BÖLÜM 3 TAMAMLANDI |
| Completion title | Dere kenarı hazır. |
| Completion body | Kıyıya altı parçayı tek tek yerleştirdin. Suyun sesi artık sığınağının bir parçası. |
| Completion CTA | Bölüm 4’e bak |
| Completion reward | Lastik çizme (`it-lastik-cizme`, a fox accessory, see §25) |

| # | Piece | Icon (placeholder) | Line (shown on unlock and in the piece sheet) |
|---|---|---|---|
| 1 | Küçük köprü | `bridge` | Bir kıyıdan ötekine geçmek artık daha kolay. |
| 2 | Berrak gölet | `drop` | Durgun suda gökyüzü görünüyor. |
| 3 | Nilüferler | `flower-lotus` | Suyun üstünde sakin bir yeşil. |
| 4 | Ahşap kayık | `boat` | Kıyıya bağlı, acelesi olmayan bir kayık. |
| 5 | Balıkların köşesi | `fish` | Küçük balıklar kendi ritminde yüzüyor. |
| 6 | Kıyı taşları | `waves` | Suyun yıllar içinde yumuşattığı taşlar. |

Chapter goals (from the weekly pool, shown while this chapter is active):

| Goal | Metric × target | Reward |
|---|---|---|
| Kıyıya uğra: bu hafta 3 gün check-in yap | `checkinDays` × 3 | Nehir çakılı (`it-nehir-cakili`, decor) |
| Suyun ritmine uy: bu hafta 2 kez bir baş etme aracı dene | `copingSessions` × 2 | Nilüfer yaprağı (`it-nilufer-yapragi`, decor) |

### BÖLÜM 4 · ORMAN YOLU — “Ağaçların arası” (order 4, scene `day`) · **APPROVED**

| Slot | Copy |
|---|---|
| Fog teaser (on the previous chapter's path) | “Uzaktan yaprak hışırtısı geliyor.” · preview icons `tree-evergreen`, `tent`, `feather` |
| Intro eyebrow | BÖLÜM 4 · ORMAN YOLU |
| Intro title | Yol ağaçların arasına giriyor. |
| Intro body | Derenin ötesinde sessiz bir orman yolu başlıyor. Her 2 ışık yola yeni bir parça ekler; geride bıraktığın her yer olduğu gibi duruyor. |
| Intro CTA | Ormana gir |
| Completion eyebrow | BÖLÜM 4 TAMAMLANDI |
| Completion title | Orman yolu hazır. |
| Completion body | Ağaçların arasına altı parça yerleştirdin. Bu sessiz yol artık senin. |
| Completion CTA | Bölüm 5’e bak |
| Completion reward | Sırt çantası (`it-sirt-cantasi`, a fox accessory, see §25) |

| # | Piece | Icon (placeholder) | Line (shown on unlock and in the piece sheet) |
|---|---|---|---|
| 1 | Çam ağacı | `tree-evergreen` | Yolun başında, her mevsim yeşil. |
| 2 | Yaprak yolu | `leaf` | Yumuşak yapraklar adımlarını karşılıyor. |
| 3 | Küçük çadır | `tent` | Dinlenmek istediğinde hep bir yer var. |
| 4 | Gözlem noktası | `binoculars` | Buradan bakınca yol daha net görünüyor. |
| 5 | Kuş tüyü | `feather` | Yolda bulduğun küçük bir hatıra. |
| 6 | Orman açıklığı | `park` | Ağaçların arasında ışığın düştüğü yer. |

Chapter goals (from the weekly pool, shown while this chapter is active):

| Goal | Metric × target | Reward |
|---|---|---|
| Ormana uğra: bu hafta 3 gün check-in yap | `checkinDays` × 3 | Çam kozalağı (`it-cam-kozalagi`, decor) |
| Ağaçların arasında mola: bu hafta 2 kez bir baş etme aracı dene *(5.1 fix)* | `copingSessions` × 2 | Meşe yaprağı (`it-mese-yapragi`, decor) |

After Bölüm 4, the manifest's `upcoming` block drives the fog teaser and İçerik sonu: **BÖLÜM 5 · YILDIZ TERASI** / “Gece göğü” / “Yukarıda bir terasın ışıkları parlıyor.” (*5.2*) / `opensAt` 2026-11-16T09:00:00+03:00 (the 2-week cadence, §24). The `upcoming` block has no `copyStatus` of its own, so the publish checklist (§24) treats it as approved only together with the chapter it announces.

Collection items these chapters introduce (names approved, 5.1): Lastik çizme (`boot`, hint “Bölüm 3”), Sırt çantası (`backpack`, hint “Bölüm 4”), Nehir çakılı (`circles-three`, hint “Bölüm 3 hedefi”), Nilüfer yaprağı (`flower-lotus`, hint “Bölüm 3 hedefi”), Çam kozalağı (`tree-evergreen`, hint “Bölüm 4 hedefi”), Meşe yaprağı (`leaf`, hint “Bölüm 4 hedefi”).


## 22b. Bölüm 5–8 — copy (**APPROVED**, rev 5.5) — *rev 5.4*

*Written in rev 5.4 (karar: koordinatör asistan (Umut'un yetkisiyle olduğunu belirtti)); **approved in rev 5.5** (onay: koordinatör asistan, Umut'un yetkisiyle olduğunu belirtti).* Every string below is `copyStatus: "approved"` in `content/manifest.example.json` **v11** and passes `--channel prod`, including the Turkish spelling check. Same structure as §22. The rules are applied and machine-checked by `content/check_manifest.py`: no health or clinical words; no fire, smoke, steam or candle cues; no *yak-* or burn-sense *yan-* (lamps are electric and "parlıyor"); the mascot has no name; nothing is lost or reset. Every icon exists in Phosphor. The completion CTAs come from `chapterCta(n)` (§23): 6’ya, 7’ye, 8’e, 9’a. Opening dates follow the 2-week cadence (§24): Bölüm 5 on 16 Kasım, 6 on 30 Kasım, 7 on 14 Aralık, 8 on 28 Aralık 2026 (Monday 09:00, Europe/Istanbul). Each chapter is published in its own drop; the example holds all four so that they can be checked together.
### 22b.1 BÖLÜM 5 · YILDIZ TERASI — “Gece göğü” (order 5, scene `night`, opens at 48 lights) · **APPROVED**

| Slot | Copy |
|---|---|
| Fog teaser (on the previous chapter's path) | “Yukarıda bir terasın ışıkları parlıyor.” · preview icons `lamp-pendant`, `star`, `moon-stars` |
| Intro eyebrow | BÖLÜM 5 · YILDIZ TERASI |
| Intro title | Yol bir terasa çıkıyor. |
| Intro body | Ormanın ötesinde, yıldızlara yakın bir teras var. Her 2 ışık terasa yeni bir parça ekler; geçtiğin her yer olduğu gibi duruyor. |
| Intro CTA | Terasa çık |
| Completion eyebrow | BÖLÜM 5 TAMAMLANDI |
| Completion title | Yıldız terası hazır. |
| Completion body | Terasa altı parça yerleştirdin. Gece göğü artık sığınağının bir parçası. |
| Completion CTA | Bölüm 6’ya bak |
| Completion reward | Yıldız rozeti (`it-yildiz-rozeti`, a fox accessory, see §25) |

| # | Piece | Icon (placeholder) | Line (shown on unlock and in the piece sheet) |
|---|---|---|---|
| 1 | Teras feneri | `lamp-pendant` | Küçük bir ampul, terasa yumuşak bir ışık veriyor. |
| 2 | Yıldız haritası | `star` | Gökyüzünü tanımak için sakin bir başlangıç. |
| 3 | Ay penceresi | `moon-stars` | Ay, pencerenin tam ortasından görünüyor. |
| 4 | Kayan yıldız | `shooting-star` | Bir an parlıyor, sonra gökyüzü yine sakin. |
| 5 | Gezegen modeli | `planet` | Masanın üstünde ağır ağır dönen küçük bir dünya. |
| 6 | Gece defteri | `book-open-text` | Gökyüzünde gördüklerini not ettiğin küçük bir defter. |

Chapter goals (from the weekly pool, shown while this chapter is active):

| Goal | Metric × target | Reward |
|---|---|---|
| Terasa uğra: bu hafta 3 gün check-in yap | `checkinDays` × 3 | Yıldız kavanozu (`it-yildiz-kavanozu`, decor, `sparkle`) |
| Yıldızlara bak: bu hafta bırakma nedenini bir kez yeniden oku | `reasonRead` × 1 | Gece minderi (`it-gece-minderi`, decor, `moon-stars`) |

### 22b.2 BÖLÜM 6 · KIŞ ODASI — “Sıcak bir köşe” (order 6, scene `snow`, opens at 60 lights) · **APPROVED**

| Slot | Copy |
|---|---|
| Fog teaser (on the previous chapter's path) | “Pencerenin ardında kar taneleri dönüyor.” · preview icons `snowflake`, `tea-bag`, `guitar` |
| Intro eyebrow | BÖLÜM 6 · KIŞ ODASI |
| Intro title | Yol sıcak bir odaya varıyor. |
| Intro body | Terastan inince içi huzurlu bir kış odası seni bekliyor. Her 2 ışık odaya yeni bir parça ekler; geçtiğin her yer olduğu gibi duruyor. |
| Intro CTA | Odaya gir |
| Completion eyebrow | BÖLÜM 6 TAMAMLANDI |
| Completion title | Kış odası hazır. |
| Completion body | Odaya altı parça yerleştirdin. Dışarıda kar yağsa da burası sıcak ve sakin. |
| Completion CTA | Bölüm 7’ye bak |
| Completion reward | Örgü eldiven (`it-orgu-eldiven`, a fox accessory, see §25) |

| # | Piece | Icon (placeholder) | Line (shown on unlock and in the piece sheet) |
|---|---|---|---|
| 1 | Kar penceresi | `snowflake` | Dışarıda kar yağıyor, içerisi sakin. |
| 2 | Sıcak çay köşesi | `tea-bag` | Bir fincan çay ve acele etmeyen bir akşam. |
| 3 | Müzik köşesi | `music-notes` | Alçak sesle çalan sevdiğin bir şarkı. |
| 4 | Gitar | `guitar` | Duvara yaslanmış, çalınmayı bekliyor. |
| 5 | Örgü sepeti | `yarn` | Yarım kalmış bir örgü; hiç acelesi yok. |
| 6 | Kış bitkisi | `potted-plant` | Kışın da yeşil kalan küçük bir saksı. |

Chapter goals (from the weekly pool, shown while this chapter is active):

| Goal | Metric × target | Reward |
|---|---|---|
| Odaya uğra: bu hafta 3 gün check-in yap | `checkinDays` × 3 | Kar küresi (`it-kar-kuresi`, decor, `snowflake`) |
| Pencere kenarında mola: bu hafta 2 kez bir baş etme aracı dene | `copingSessions` × 2 | Kurabiye kavanozu (`it-kurabiye-kavanozu`, decor, `cookie`) |

### 22b.3 BÖLÜM 7 · KIYI — “Deniz feneri” (order 7, scene `dusk`, opens at 72 lights) · **APPROVED**

| Slot | Copy |
|---|---|
| Fog teaser (on the previous chapter's path) | “Rüzgârda tuzlu bir deniz kokusu var.” · preview icons `lighthouse`, `sailboat`, `island` |
| Intro eyebrow | BÖLÜM 7 · KIYI |
| Intro title | Yol denize açılıyor. |
| Intro body | Odadan çıkınca yol sakin bir kıyıya iniyor. Her 2 ışık kıyıya yeni bir parça ekler; geçtiğin her yer olduğu gibi duruyor. |
| Intro CTA | Kıyıya yürü |
| Completion eyebrow | BÖLÜM 7 TAMAMLANDI |
| Completion title | Kıyı hazır. |
| Completion body | Kıyıya altı parça yerleştirdin. Deniz feneri her akşam senin için de parlıyor. |
| Completion CTA | Bölüm 8’e bak |
| Completion reward | Şemsiye (`it-semsiye`, a fox accessory, see §25) |

| # | Piece | Icon (placeholder) | Line (shown on unlock and in the piece sheet) |
|---|---|---|---|
| 1 | Deniz feneri | `lighthouse` | Akşam olunca kıyıya yol gösteren bir ışık. |
| 2 | Küçük yelkenli | `sailboat` | Rüzgârı arkasına almış, kıyıya yakın süzülüyor. |
| 3 | Ada manzarası | `island` | Uzakta, sakin suların ortasında küçük bir ada. |
| 4 | Gün batımı | `sun-horizon` | Gökyüzü yavaş yavaş turuncuya dönüyor. |
| 5 | Kâğıt fırıldak | `pinwheel` | Deniz rüzgârıyla kendi kendine dönüyor. |
| 6 | Deniz kabukları | `spiral` | Kumda bulduğun küçük, sarmal kabuklar. |

Chapter goals (from the weekly pool, shown while this chapter is active):

| Goal | Metric × target | Reward |
|---|---|---|
| Deniz kenarına uğra: bu hafta 3 gün check-in yap | `checkinDays` × 3 | Deniz yıldızı (`it-deniz-yildizi`, decor, `star`) |
| Dalgalarla nefes al: bu hafta 2 kez bir baş etme aracı dene | `copingSessions` × 2 | Küçük çapa (`it-kucuk-capa`, decor, `anchor`) |

### 22b.4 BÖLÜM 8 · TEPE — “Manzara” (order 8, scene `day`, opens at 84 lights) · **APPROVED**

| Slot | Copy |
|---|---|
| Fog teaser (on the previous chapter's path) | “Yukarıda geniş bir manzara açılıyor.” · preview icons `mountains`, `cloud-sun`, `rainbow` |
| Intro eyebrow | BÖLÜM 8 · TEPE |
| Intro title | Yol tepeye tırmanıyor. |
| Intro body | Kıyının ardında yumuşak bir tepe yükseliyor. Her 2 ışık tepeye yeni bir parça ekler; geçtiğin her yer olduğu gibi duruyor. |
| Intro CTA | Tepeye çık |
| Completion eyebrow | BÖLÜM 8 TAMAMLANDI |
| Completion title | Tepedeki manzara hazır. |
| Completion body | Tepeye altı parça yerleştirdin. Buradan bakınca geçtiğin bütün yol görünüyor. |
| Completion CTA | Bölüm 9’a bak |
| Completion reward | Rüzgârlık (`it-ruzgarlik`, a fox accessory, see §25) |

| # | Piece | Icon (placeholder) | Line (shown on unlock and in the piece sheet) |
|---|---|---|---|
| 1 | Dağ yolu | `mountains` | Adım adım yükselen, acelesi olmayan bir yol. |
| 2 | Bulut seyri | `cloud-sun` | Bulutlar ağır ağır geçiyor, sen de dinleniyorsun. |
| 3 | Gökkuşağı | `rainbow` | Yağmurdan sonra tepede beliren renkler. |
| 4 | Tepe flaması | `flag-banner` | Tepenin en üstünde hafifçe dalgalanıyor. |
| 5 | Pusula | `compass` | Hangi yöne gidersen git, yolunu bulmana yardım eder. |
| 6 | Gün doğumu | `sun` | Yeni bir gün, tepenin ardından usulca doğuyor. |

Chapter goals (from the weekly pool, shown while this chapter is active):

| Goal | Metric × target | Reward |
|---|---|---|
| Tepeye uğra: bu hafta 3 gün check-in yap | `checkinDays` × 3 | Dağ çiçeği (`it-dag-cicegi`, decor, `flower`) |
| Manzaraya bak: bu hafta bırakma nedenini bir kez yeniden oku | `reasonRead` × 1 | Tepe haritası (`it-tepe-haritasi`, decor, `map-trifold`) |

After Bölüm 8, `upcoming` announces **BÖLÜM 9** / “Yeni bir yer” / “Sisin ardında yeni bir yer hazırlanıyor.” with `opensAt: null`, so the fog and İçerik sonu (§19.6) show "Yakında" instead of a date. Replace it with the real Bölüm 9 theme when that drop is written.

### 22b.5 Winter event — “Kış şenliği” (`s-kis-2026`) · **APPROVED** (target 8 lights, rev 5.5)

Decoration only, like Sonbahar şenliği (§19.3): progress is the normal lights earned inside the window (nothing is spent), there is no penalty, and a missed event can still be earned later via the "geçmiş etkinlik" item. It starts the day after Sonbahar şenliği ends, so two events never overlap.

| Field / slot | Value |
|---|---|
| Manifest | `id` s-kis-2026 · `title` **Kış şenliği** · `icon` `snowflake` · `startsAt` 2026-12-01T00:00:00+03:00 · `endsAt` 2027-01-31T23:59:59+03:00 · `lightTarget` **8** (approved, 5.5; a 2-month window, about one light a week) · `reward` `it-bere` |
| Reward item | **Bere** (`it-bere`, set `fox-accessories`, icon `beanie`, hint “Kış şenliği”, art `accessories/it-bere/it-bere.a4d0a213@2x.png`, the existing file) |
| Banner eyebrow | MEVSİM ETKİNLİĞİ · 31 OCAK’A KADAR *(from `untilLabel(endsAt)`, §23, uppercased with the Turkish locale)* |
| Banner title | Kış şenliği |
| Banner progress | {a} / 8 ışık |
| Banner line (**NEW**, app string) | Soğuk günlerde kendine sıcak bir köşe ayır. |
| Reward line (**NEW**) | Ödül: Bere |
| Reached (toast, **NEW**) | Kış şenliği tamamlandı. Bere artık koleksiyonunda. |
| Window over, target not reached (**NEW**) | Kış şenliği bitti. Topladığın her ışık yerinde duruyor; Bere daha sonra da kazanılabilir. |

The three NEW lines are generic templates in the app ("{title} tamamlandı. {item} artık koleksiyonunda." / "{title} bitti. Topladığın her ışık yerinde duruyor; {item} daha sonra da kazanılabilir."), shown here with the winter values. The schema has no season body field, so the banner line is a per-season app string keyed by `id` (fallback: no line). It is not a schema change.

## 23. Turkish suffixes after numbers and dates — *rev 5*

### 23.1 The rule
A suffix after a numeral follows **how the number is read aloud**, specifically its **last spoken word**. Take the last non-zero digit position: units if ≠ 0, else tens, else *yüz* (hundreds), else *bin* (thousands), else *milyon*; 0 is *sıfır*. That word decides two things:
- **Vowel harmony:** its last vowel is back (a ı o u) → *a*; front (e i ö ü) → *e*.
- **Consonant hardening:** if it ends in a voiceless consonant (f s t k ç ş h p) the *d* becomes *t*.

Ablative = `d/t + a/e + n`; locative = `d/t + a/e`; dative = `(y if the word ends in a vowel) + a/e`. The apostrophe is always **’ (U+2019)**, the app's existing character, never `'`.

| Last spoken word | Ablative | Locative | Dative | Year examples (ablative) |
|---|---|---|---|---|
| bir (1) | ’den | ’de | ’e | 2001’den, 2021’den |
| iki (2) | ’den | ’de | ’ye | 2022’den |
| üç (3) | ’ten | ’te | ’e | **2023’ten** |
| dört (4) | ’ten | ’te | ’e | **2024’ten** |
| beş (5) | ’ten | ’te | ’e | **2025’ten** |
| altı (6) | ’dan | ’da | ’ya | **2026’dan** |
| yedi (7) | ’den | ’de | ’ye | **2027’den** |
| sekiz (8) | ’den | ’de | ’e | **2028’den** |
| dokuz (9) | ’dan | ’da | ’a | **2029’dan**, 1999’dan |
| on (10) | ’dan | ’da | ’a | 2010’dan |
| yirmi (20) | ’den | ’de | ’ye | 2020’den |
| otuz (30) | ’dan | ’da | ’a | **2030’dan** |
| kırk (40) | ’tan | ’ta | ’a | **2040’tan** |
| elli (50) | ’den | ’de | ’ye | 2050’den |
| altmış (60) | ’tan | ’ta | ’a | 2060’tan |
| yetmiş (70) | ’ten | ’te | ’e | 2070’ten |
| seksen (80) | ’den | ’de | ’e | 2080’den |
| doksan (90) | ’dan | ’da | ’a | 2090’dan |
| yüz (100s) | ’den | ’de | ’e | **2100’den**, 2200’den |
| bin (1000s) | ’den | ’de | ’e | 2000’den |
| milyon | ’dan | ’da | ’a | — |
| sıfır (0) | ’dan | ’da | ’a | — |

Bold = Umut's 10 cases; all are reproduced by the helper.

**Months** (dative, "… kadar"): Ocak’a, Şubat’a, Mart’a, Nisan’a, Mayıs’a, Haziran’a, Temmuz’a, Ağustos’a, **Eylül’e**, **Ekim’e**, Kasım’a, Aralık’a. When the day number precedes a month name, the suffix attaches to the **month**, not to the day: "30 Kasım’a kadar".

### 23.2 Where the app uses it (templates fixed in rev 5)
| String | Template | Helper | Example |
|---|---|---|---|
| Rotam hero (§14) | "{d} {Ay} {yyyy}’{abl} beri" | `sinceLabel(quitDate)` | 21 Ekim 2026’dan beri · 5 Ocak 2025’ten beri |
| Season card (§19.3) | rev 4 "Mevsim etkinliği · {tarih}’e kadar" ✗ → "{d} {Ay}’{dat} kadar" | `untilLabel(endsAt)` | 30 Kasım’a kadar · 1 Eylül’e kadar |
| Chapter completion CTA (§16, §22) | rev 4 "Bölüm {n}’e bak" ✗ → "Bölüm {n}’{dat} bak" | `chapterCta(n)` | Bölüm 2’ye · 3’e · 6’ya · 9’a · 10’a bak |

In the manifest, CTAs are stored **already resolved** (e.g. "Bölüm 4’e bak"), so the helper is needed only for app-generated strings. The CI checker can call the same rule if a template ever enters the manifest. This replaces the rev 4 suffix note in §14 and resolves open question 4 (12b): **use the suffix form**, not "Başlangıç: …".

### 23.3 Helper — `src/domain/turkishSuffix.ts` (proposal, file in `proposals/`)
```ts
// Proposal for src/domain/turkishSuffix.ts — Turkish case suffixes after numbers and dates.
// Rule: the suffix follows how the number is SPOKEN, and only the LAST non-zero spoken word
// matters (2026 = "iki bin yirmi altı" -> "altı"; 2100 = "iki bin yüz" -> "yüz").
//   vowel harmony : last vowel a/ı/o/u -> "a", e/i/ö/ü -> "e"
//   assimilation  : word ends in f s t k ç ş h p -> "t…" (ablative/locative), else "d…"
//   dative buffer : word ends in a vowel -> "y" + a/e
type Word = { back: boolean; hard: boolean; vowelEnd: boolean };
//                     back = a/ı/o/u harmony, hard = voiceless final consonant, vowelEnd = ends in a vowel
const w = (back: boolean, hard: boolean, vowelEnd: boolean): Word => ({ back, hard, vowelEnd });

/** Last spoken word -> features. Units 1–9, tens 10–90, yüz, bin, milyon, sıfır. */
const UNITS: Record<number, Word> = {
  1: w(false, false, false), // bir
  2: w(false, false, true),  // iki
  3: w(false, true, false),  // üç
  4: w(false, true, false),  // dört
  5: w(false, true, false),  // beş
  6: w(true, false, true),   // altı
  7: w(false, false, true),  // yedi
  8: w(false, false, false), // sekiz
  9: w(true, false, false),  // dokuz
};
const TENS: Record<number, Word> = {
  1: w(true, false, false),  // on
  2: w(false, false, true),  // yirmi
  3: w(true, false, false),  // otuz
  4: w(true, true, false),   // kırk
  5: w(false, false, true),  // elli
  6: w(true, true, false),   // altmış
  7: w(false, true, false),  // yetmiş
  8: w(false, false, false), // seksen
  9: w(true, false, false),  // doksan
};
const YUZ = w(false, false, false);    // yüz
const BIN = w(false, false, false);    // bin
const MILYON = w(true, false, false);  // milyon
const SIFIR = w(true, false, false);   // sıfır

export function lastSpokenWord(n: number): Word {
  if (!Number.isInteger(n) || n < 0) throw new RangeError('non-negative integer expected');
  if (n === 0) return SIFIR;
  if (n % 10 !== 0) return UNITS[n % 10];
  if (n % 100 !== 0) return TENS[(n % 100) / 10];
  if (n % 1000 !== 0) return YUZ;
  if (n % 1_000_000 !== 0) return BIN;
  return MILYON;
}

/** -dan/-den/-tan/-ten : "2026’dan beri" */
export const ablative = (n: number) => { const x = lastSpokenWord(n); return (x.hard ? 't' : 'd') + (x.back ? 'an' : 'en'); };
/** -da/-de/-ta/-te : "2026’da" */
export const locative = (n: number) => { const x = lastSpokenWord(n); return (x.hard ? 't' : 'd') + (x.back ? 'a' : 'e'); };
/** -a/-e/-ya/-ye : "Bölüm 3’e bak", "Bölüm 6’ya bak" */
export const dative = (n: number) => { const x = lastSpokenWord(n); return (x.vowelEnd ? 'y' : '') + (x.back ? 'a' : 'e'); };

/** Dative of month names for "{d} {Ay}’a kadar" (index 0 = Ocak). */
const MONTH_DATIVE = ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'e', 'e', 'a', 'a'];
//                    Ocak Şubat Mart Nisan Mayıs Haziran Temmuz Ağustos Eylül Ekim Kasım Aralık

export const APOS = '’'; // U+2019, the app's existing apostrophe; never a straight '

const dateText = (d: Date, withYear: boolean) =>
  d.toLocaleDateString('tr-TR', withYear ? { day: 'numeric', month: 'long', year: 'numeric' } : { day: 'numeric', month: 'long' });

/** "21 Ekim 2026’dan beri" (Rotam hero, Ben). */
export const sinceLabel = (d: Date) => `${dateText(d, true)}${APOS}${ablative(d.getFullYear())} beri`;
/** "30 Kasım’a kadar" (seasonal banner). */
export const untilLabel = (d: Date) => `${dateText(d, false)}${APOS}${MONTH_DATIVE[d.getMonth()]} kadar`;
/** "Bölüm 3’e bak" (chapter-complete CTA). */
export const chapterCta = (n: number) => `Bölüm ${n}${APOS}${dative(n)} bak`;
```

### 23.4 Tests — `tests/turkishSuffix.test.mjs` (matches the repo's `npm test` glob)
```js
// npm test  (repo runner: node --experimental-strip-types --test tests/*.test.mjs)
import test from 'node:test';
import assert from 'node:assert/strict';
import { ablative, locative, dative, sinceLabel, untilLabel, chapterCta } from '../src/domain/turkishSuffix.ts';

test('ablative — Umut’s cases', () => {
  const umut = [[2026,'dan'],[2027,'den'],[2030,'dan'],[2025,'ten'],[2023,'ten'],
    [2024,'ten'],[2028,'den'],[2029,'dan'],[2040,'tan'],[2100,'den']];
  for (const [y, s] of umut) assert.equal(ablative(y), s, String(y));
});
test('ablative — every last word', () => {
  const more = [[2021,'den'],[2022,'den'],[2020,'den'],[2050,'den'],[2060,'tan'],
    [2070,'ten'],[2080,'den'],[2090,'dan'],[2000,'den'],[2010,'dan'],[2200,'den'],[1999,'dan'],
    [0,'dan'],[1000000,'dan']];
  for (const [y, s] of more) assert.equal(ablative(y), s, String(y));
});
test('locative and dative', () => {
  assert.equal(locative(2026), 'da'); assert.equal(locative(2025), 'te'); assert.equal(locative(2040), 'ta');
  const dat = [[1,'e'],[2,'ye'],[3,'e'],[4,'e'],[5,'e'],[6,'ya'],[7,'ye'],[8,'e'],
    [9,'a'],[10,'a'],[11,'e'],[12,'ye'],[16,'ya'],[20,'ye'],[30,'a'],[40,'a'],[50,'ye'],[60,'a'],[70,'e'],[100,'e']];
  for (const [n, s] of dat) assert.equal(dative(n), s, String(n));
});
test('labels', () => {
  assert.equal(sinceLabel(new Date(2026, 9, 21)), '21 Ekim 2026’dan beri');
  assert.equal(sinceLabel(new Date(2025, 0, 5)), '5 Ocak 2025’ten beri');
  assert.equal(sinceLabel(new Date(2040, 4, 1)), '1 Mayıs 2040’tan beri');
  assert.equal(untilLabel(new Date(2026, 10, 30)), '30 Kasım’a kadar');
  assert.equal(untilLabel(new Date(2026, 8, 1)), '1 Eylül’e kadar');
  assert.equal(chapterCta(2), 'Bölüm 2’ye bak');
  assert.equal(chapterCta(3), 'Bölüm 3’e bak');
  assert.equal(chapterCta(6), 'Bölüm 6’ya bak');
  assert.equal(chapterCta(9), 'Bölüm 9’a bak');
  assert.equal(chapterCta(10), 'Bölüm 10’a bak');
});
```
Verification on the box: in a copy of the repo layout (`proposals/repo-layout/`), the repo's own test command `node --experimental-strip-types --test tests/*.test.mjs` gives **4/4 pass**: Umut's 10 cases, 14 more ablative cases covering every final word, locative, 20 datives, and 10 label strings. Exhaustive cross-check: an independent Python implementation that spells each number in Turkish and applies vowel harmony to the actual last word (`proposals/crosscheck.py`) matches `ablative()` for **every n in 1–2999 (0 mismatches)**.


## 24. Content pipeline and publishing checklist (1 chapter every 2 weeks) — *rev 5, roles updated in rev 5.1*

**Cadence:** a new chapter goes live **every second Monday at 09:00 Europe/Istanbul**. `published_at` is set in advance, and RLS makes the row visible at that moment, with **no app release**. Smaller drops (a weekly goal pool, a season window, a milestone) use the same flow on any Monday. In the example manifest, `upcoming.opensAt` is 2026-11-16T09:00:00+03:00 (the dates are illustrative).

**Roles (rev 5.1, from Umut):**
- **Bots** (Grok Bot / Kodcu) draft, build, validate and test each drop **on the BETA channel only**.
- **Umut** approves the copy and **publishes to PROD himself**.
- **The Supabase service role key of the production project stays with Umut only.** No bot, CI job or shared file holds it. Bots never insert prod rows, never upload to the prod `content` bucket, and never run migrations on prod.

**Pacing check:** an engaged user earns about 1–3 lights a day, or 14–42 per 2 weeks. A chapter is 12 lights, so the most active users reach İçerik sonu (§19.6) between drops. That screen is designed for it: a countdown, "{n} ışık hazır", goals and the collection. Banked lights unlock instantly when the chapter lands.

**Buffer:** keep **one fully approved chapter** (copy + art) ahead of the one being published. If a cycle slips, ship `upcoming.opensAt: null`, which shows "Yakında", rather than an empty or late promise.

### 24.1 Where content lives, and where beta runs
- **Source:** a `content/` folder in the repo (or a separate repo) holding `manifest.schema.json`, `manifest.json` (or `chapters/ch-*.json`), `art/`, `check_manifest.py` and `test_check_manifest.py`. Every change is a PR.
- **`copyStatus`** on every chapter, milestone, goal and season: `pending` (draft) → `approved`. Only Umut, or someone he explicitly delegates to, flips it. **Prod rejects pending** in both CI (`check_manifest.py --channel prod`) and the DB (trigger in §21.2), so an unapproved string cannot reach users even by mistake.
- **Beta and prod (*rev 5.3*, karar: Umut):** both live in the **same free Supabase project**, as two `channel` values in `content_manifests` (`beta`, `prod`) plus the same `content` bucket. Internal/beta builds read `channel = 'beta'` with the public anon key; store builds read `prod`. There is **no branch and no staging project**. **Bots hold no Supabase write key**, neither beta nor prod.
- **Bots' environment:** files in `content/` plus a **local** `supabase start` (Docker), where the bundle's `publish-beta.sql` and `publish-prod.sql` are run against the local DB with the migrations applied, and a dev build pointed at the local URL is used for QA.
- **Uploads (beta and prod):** only **Umut** writes, from the Supabase dashboard (SQL editor / Storage UI) or by running the bundle's script on his machine with his own key, once he connects his account.
- **Art:** paths are `chapters/{chapterId}/{piece}.{sha256[:8]}@2x.png` (or `.webp`), ≤ 2 MiB. Content-hashed names are immutable (`cacheControl: 31536000`), so the exact files tested locally and on beta are the files Umut uploads to prod.

### 24.2 Checklist for chapter *n* (T = go-live Monday 09:00)
| When | Step | Who | Done when |
|---|---|---|---|
| **T − 14** (previous drop day) | Draft chapter *n*: theme, scene, 6 piece names + lines, fog teaser line + 3 preview icons, intro, completion (CTA "Bölüm {n+1}’{dat} bak", §23), 2 chapter goals + rewards, the completion accessory (§25), and `upcoming` for *n + 1*. Everything starts as `copyStatus: "pending"`. | bots | PR opened; `check_manifest.py --channel beta` is green (schema, lengths, banned words, **fire/smoke cue words and icons**, ids, references). |
| T − 13 | Self-review against the copy rules: non-judgmental, no health or clinical claims, **no fire, smoke, candle, ember or cigarette imagery** (words or icons), **no verb *yak-* and no burn-sense *yan-*** (*rev 5.2*; use parla- / kazan / açıl-), the mascot unnamed, nothing "lost" or "failed", Turkish suffixes correct (§23). | bots | Notes are in the PR. |
| T − 12 → T − 8 | **Art:** 6 piece illustrations (or keep the Phosphor placeholders) and the chapter scene tint, checked in **light and dark** (§20). Accessory art is **made separately** (§25). Export @2x and hash-name. | artist / bots | Files are in `content/art/`, and the manifest `art` paths match. |
| **T − 9** | **Local test:** on a local `supabase start`, upload the art to the local `content` bucket and run `publish-beta.sql` (`version = max + 1`, `published_at = now()`). Art first, so no path ever 404s. Rerun the checker and tests. Then deliver the **beta publish bundle** to Umut: `manifest.json`, `art/`, `publish-beta.sql`, the checker/test output and local screenshots. | bots (local only, no keys) | Local dev build shows chapter *n*; bundle delivered. |
| **T − 8** | **Umut uploads beta**: the art to the `content` bucket, then runs `publish-beta.sql`. | **Umut** | Beta builds show chapter *n*. |
| T − 8 → T − 4 | **QA on beta** (iOS + Android, light + dark + "Sistem" switching, small and large screens): fog teaser → previous completion → handoff → path → each unlock → completion; banked lights (several unlocks, max 3 animated); İçerik sonu countdown; offline with a cached manifest; first launch with no network (bundled chapters 1–3); VoiceOver/TalkBack labels; reduce motion (§13); a slip during the chapter (nothing changes); koleksiyon goal and item states. | bots (on beta builds, read-only) | The QA checklist and screenshots are attached to the PR. |
| **T − 4** | **Umut reviews** the PR plus the beta build, and approves the copy (flips `copyStatus` to `approved` in the PR, or tells a bot to flip it). Bots then rerun `check_manifest.py manifest.json --channel prod --previous <current prod>.json` (version increases; **no published id removed**, retire instead; no pending copy). They test it on the local DB again and hand Umut the **prod publish bundle**: `manifest.json`, the art files, a `publish-prod.sql` with a single `insert … values ('prod', N, …, '<T 09:00+03:00>', '<manifest>')`, and the checker output. | Umut, bots | The bundle is ready and the checker is green on `--channel prod`. |
| **T − 3** | **Umut publishes to prod himself**: uploads the art to the prod `content` bucket, then runs `publish-prod.sql` with `published_at = T 09:00+03:00`. Until T the row is invisible to clients (RLS) and still editable; after T it is immutable (guard trigger). | **Umut only** | The row exists; `select version, published_at from content_manifests where channel='prod' order by version desc limit 2` shows it scheduled. |
| **T** 09:00 | Goes live automatically. Clients pick it up on the next foreground (≤ 6 h throttle) or on pull-to-refresh. | — | — |
| T → T + 2 | **Monitor:** manifest fetch and parse errors (a client counter for dropped invalid chapters/items), art 404s, support messages. Bots report; fixes go through the same flow. | bots → Umut | No errors. |
| any time | **Rollback** = Umut inserts `version + 1` with the previous content (published rows can't be edited). Ids already granted stay granted (`retired: true`, never removed). Bots prepare the rollback bundle. | Umut | — |

### 24.3 What automation runs (proposal; there is no CI in the repo today)
- On PR: `python3 content/check_manifest.py content/manifest.json --channel beta`, `python3 content/test_check_manifest.py`, and the schema validation. When the PR is marked "ready for prod", add `--channel prod --previous <last published prod manifest>` (read with the **public anon key**; no secret needed).
- *Rev 5.3:* **no upload job of any kind**, and no Supabase secret in CI. Automation only validates and tests files. Beta and prod uploads are Umut's manual steps (§24.2, T − 8 and T − 3).
- Verified on the box with `python3 content/test_check_manifest.py` → **35/35 pass** (*rev 5.5*):
  - The example manifest (v11, all approved) passes on beta **and** on prod, and against the previous version with `--previous`.
  - *rev 5.5:* 8 spelling fixtures each give a **warning on beta (exit 0) and an error on prod (exit 1)**: "Kis şenliği", "Yildiz haritasi", "Kucuk yelkenli", "Dag yolu", "Golge ağacı", "ışik", "BOLUM 6", "Rüzgarda". 4 no-false-positive fixtures pass on both channels: the sen/şen allowlist, Turkish uppercase (KIŞ ODASI, YILDIZ TERASI), ASCII ids (`ch-kis-odasi`, `s-kis-2026`), and an unknown word with no diacritic twin ("zeplin").
  - *rev 5.2:* 4 *yak-/yan-* fixtures fail as expected ("Bugünün ışığını yak", "IŞIĞI YAKTIN", "…ışıkları yanıyor.", "Fener bütün gece yandı."). A manifest full of look-alikes ("Yakında: kıyıya yakın, yanında yaklaşık bir yol.") passes. A word-list test checks 27 burn forms caught and 34 look-alikes allowed.
  - A single pending chapter is rejected on prod.
  - 14 negative fixtures each fail with the expected message: 5 pieces, bad date, unknown reward, duplicate piece, missing intro, name too long, "Kamp ateşi", "Şömine", a candle line, a `campfire` icon, a `coffee` steam icon, a typo'd field, an order gap, a removed id.

### 24.4 Manifest checker rules (beyond the JSON Schema)
- **Ids and references:**
  - Ids are unique across items, chapters, pieces and goals.
  - Chapter `order` is contiguous from 1, and `upcoming.chapterOrder` = last + 1.
  - Every reward exists, and no item has two sources.
  - A goal's `chapterId` exists, and each milestone key is `day-{day}`.
  - A season's `startsAt` is before its `endsAt`.
- **Banned words:** nikotin, kanser, akciğer, sağlık, tedavi, yoksunluk, bağımlı, başarısız, kaybettin, sıfırla, "tilki adı".
- **Fire/smoke cue words** (*rev 5.1*, whole-word match with suffixes): ateş*, alev*, şömine*, köz*, kor, mum, tütsü*, kül, duman*, is/isli, sigara*, çakmak*, kibrit*, buhar*.
- **Banned verbs** (*rev 5.2*, `content/editorial.py`, Turkish-aware lowercasing, whole words):
  - ***yak-*:** the bare stem and its verb suffixes, e.g. yak, yakar, yakıyor, yaktı, yaktın, yakmak, yakma, yakmadan, yakalım, yakacak, yakan, yakılır, yakabilir.
  - **burn-sense *yan-*:** yandı, yanıyor, yanan, yanar, yanmak, yanmış, yanık, yanıp, yanacak, yanabilir.
  - **Not matched:** yakın, yakında, yaklaşık, yaklaş-, yaka(sı), yakala-, yakış-, yakıt, yakut, yakarış, yan, yana, yanı, yanında, yanıt, yanlış, yanak, yanaş-, yansı-, yanıl-.
  - **Known limits:** "yakın" as the plural imperative (burn!) is not caught, because it is identical to "near"; reviewers check that by eye. "yakan" (your collar) would be a false hit; reword it.
- **Fire/smoke/steam icons:** fire, fire-simple, flame, campfire, candle, cigarette, cigarette-slash, coffee (the steam lines read as smoke).
- **Prod:** no `pending` copy.
- **Turkish spelling** (*rev 5.5*, `content/tr_spell.py`): **warning on beta, error on prod.** Only copy fields are checked (name, title, line, body, cta, eyebrow, teaserLine, hint, lead, slip*); ids, icons, paths, dates and enums are not. Tokens are lowercased the Turkish way (I→ı, İ→i). A token that is **not** in `content/tr_words.txt`, but becomes a wordlist word when ı/i, ş/s, ğ/g, ç/c, ö/o, ü/u, â/a, î/i or û/u are swapped, is flagged as **ASCII-fied** (all ASCII, e.g. kis → kış) or as a **diacritic swap** (e.g. ışik → ışık). Unknown words with no twin are ignored, so the rule is not a full spellchecker and gives no noise on new words. `--spell-unknown` lists the words that are not yet in the wordlist.
  - **Wordlist** (`build_tr_words.py`, 557 words): every token of approved copy + a ~220-word hand-checked common/app vocabulary + an **allowlist** of real pairs that differ only by diacritics (sen/şen, ser/şer, kar/kâr, hala/hâlâ, ama/âmâ, adet/âdet, kur/kür, aşı/ası), so both forms pass. Rebuild it after each approval, and review the diff, because a typo in approved copy would otherwise enter the list.
  - **Why warning on beta / error on prod:** beta holds drafts. A warning keeps a new or rare word from blocking a review build, and the reviewer sees it next to the copy. Prod is the gate: a flagged word must be fixed or added to the allowlist on purpose before Umut uploads. This matches how `pending` is treated.
- **With `--previous`:** the version increases, and no published id is removed.

#### 24.4a Rev 5.5 Turkish diacritic scan — results
Method (box, read-only for the repo and the mascot folder): every word in the sources below is lowercased the Turkish way. Words whose diacritic-folded form collides with a different spelling are grouped, and each ASCII-only or swapped form is checked against (a) the other spellings in the corpus and (b) a 50k-word Turkish frequency list (FrequencyWords, OpenSubtitles 2018; used for the scan only, not shipped), with an English list to drop English words. Code spans, ids, paths and camelCase are excluded.

| Source | Result |
|---|---|
| Spec (this file), all copy tables, a11y labels, changelogs | no errors. "Kış şenliği" is spelled correctly everywhere; there is no "Kis". |
| Manifest v11 + `build_example.py` | no errors (the checker's spelling rule passes on prod) |
| Mockup generators `mock/`, `mock3/`, `mock4/`, `mock5/` (strings in the PNGs) | no errors |
| `proposals/` (suffix helper, migrations, repo layout) | no errors. `YUZ`, `SIFIR` and `MILYON` are ASCII **code constants**; their comments spell yüz, sıfır and milyon correctly. |
| Repo `App.tsx` + `src/` strings and accessibility labels (read-only) | no errors. Uppercase eyebrows such as "ADIM 5 / 5 · HAZIR", "KİŞİSEL PLANIN", "BIRAKMA TARİHİ" and "SON SİGARA KAYDINDAN BERİ" use correct Turkish casing (I = ı, İ = i). |
| `/workspace/mascot/accessories/README.md` (read-only) | no errors. The scan flagged "askının" (from askı, strap), "kaşları", "uç" (tip) and "yani"; all are correct words. |

Every hit was a false positive of one of these kinds: real words with a diacritic twin (yaslanmış/yaşlanmış, askı/aşk, kaşları/kasları); the house-style circumflex (rüzgâr, kâğıt, used consistently); the banned-cue words quoted in §24.4 (köz, kül); suffix fragments in §23 (-ık, -ıl, -ıp); English words. Nothing was changed.

## 25. Fox accessories — source of truth (art made separately) — *rev 5*

One accessory per completed chapter, plus Atkı from the weekly "yerini değiştir" goal. **The art is produced by someone else; this list fixes ids, names, sources and placeholder icons.** Until the art lands, the app shows the Phosphor icon in the collection tile and the fox stays as is. The accessory is applied via `personalization.foxAccessory` (§19.4) once the art exists. *Rev 5.4/5.5:* chapters 5–8 and the winter event are in the manifest v11, **approved** (onay: koordinatör asistan, Umut'un yetkisiyle olduğunu belirtti). Art already exists for Bere and Şemsiye (`/workspace/mascot/accessories/`, made separately); briefs for the three missing ones are in §25.1.

| Source | id | Name | Placeholder icon | Status |
|---|---|---|---|---|
| Bölüm 1 · Temel (completion) | `it-yuvarlak-gozluk` | Yuvarlak gözlük | `eyeglasses` | in the manifest (approved, 5.1) |
| Bölüm 2 · Bahçe | `it-hasir-sapka` | Hasır şapka | `baseball-cap` | in the manifest (approved, 5.1) |
| Bölüm 3 · Dere kenarı | `it-lastik-cizme` | Lastik çizme | `boot` | in the manifest (approved, 5.1) |
| Bölüm 4 · Orman yolu | `it-sirt-cantasi` | Sırt çantası | `backpack` | in the manifest (**approved by Umut**, 5.1); moved out of the ch4 pieces |
| Bölüm 5 · Yıldız terası | `it-yildiz-rozeti` | **Yıldız rozeti** | `star-four` | *5.4*, **approved 5.5**; replaces Yıldızlı bere (headwear, would duplicate Bere). Art: brief §25.1 |
| Bölüm 6 · Kış odası | `it-orgu-eldiven` | **Örgü eldiven** | `hand-palm` | *5.4*, **approved 5.5**; replaces Kapüşonlu (the hood is headwear and its icon was shared with a ch6 piece). Art: brief §25.1 |
| Bölüm 7 · Kıyı | `it-semsiye` | Şemsiye | `umbrella` | *5.4*, **approved 5.5**; art exists (`it-semsiye.a08323a3@2x.png`, fox_cheer only) |
| Bölüm 8 · Tepe | `it-ruzgarlik` | Rüzgârlık | `wind` | *5.4*, **approved 5.5**; kept (the ch7 piece Tüy rüzgârlığı became Kâğıt fırıldak). Art: brief §25.1 |
| **Kış şenliği** (winter event, §22b.5) | `it-bere` | **Bere** | `beanie` | *5.4*, **approved 5.5**; art exists (`it-bere.a4d0a213@2x.png`) |
| Weekly goal "Sığınağında bir parçanın yerini değiştir" | `it-atki` | Atkı | `t-shirt` | in the manifest |

The rev 4 set sizes ("Aksesuarlar 2/6", "Kristaller 4/6") were illustrative. The totals come from the manifest (`items` per `set`, minus `retired`), so the accessory set grows by one per published chapter. *Rev 5.1:* the duplicate is resolved. "Şemsiye" stays the Bölüm 7 accessory, and the ch7 piece is now "Küçük yelkenli" (karar: koordinatör asistan, Umut onayı bekleniyor). The chapter 5–8 accessory names are still proposals.

### 25.0 Clash check (rev 5.4, karar: koordinatör asistan (Umut'un yetkisiyle olduğunu belirtti))
One accessory is worn at a time (`personalization.foxAccessory`), so a "clash" here means two items that do the same job in the same body zone, or that share a name or icon with a piece.

| Zone | Item | Clash after 5.4? |
|---|---|---|
| eyes | Yuvarlak gözlük | — |
| head (crown) | Hasır şapka (summer), **Bere** (winter) | two hats but different seasons and materials: fine. **No third headwear**: Yıldızlı bere and Kapüşonlu (hood) were removed. |
| neck | Atkı | — (Yıldız rozeti sits on the chest, below the scarf line, and is not textile) |
| chest | **Yıldız rozeti** | — |
| paws | **Örgü eldiven** | — (the only paw item; Şemsiye is held, but only in fox_cheer) |
| torso | **Rüzgârlık** (hoodless) | — (Sırt çantası is straps/back; the jacket is the only garment now that Kapüşonlu is gone) |
| feet | Lastik çizme | — |
| held / back | Şemsiye, Sırt çantası | — |

Name and icon overlaps with pieces: Tüy rüzgârlığı → Kâğıt fırıldak (ch7); Kalın battaniye `hoodie` → Örgü sepeti `yarn` (ch6). The remaining shared word "rüzgâr" appears only in descriptive lines ("Deniz rüzgârıyla…", "Rüzgârı arkasına almış…"), not in a name.

**Why Yıldız rozeti for Bölüm 5:** the terrace is about looking at the stars, and a small gold star pin is the clearest wearable form of that. It is not a hat (Bere is the winter reward) and not a scarf or neck cloth (Atkı), and it uses the only free zone (the chest). It is small, so it reads as a calm keepsake, not a medal, and it fits almost every pose.

### 25.1 Art briefs (rev 5.4) — same pipeline as the existing set
Same as `/workspace/mascot/accessories/README.md`: transparent PNG, square canvas **pixel-aligned with `fox_idle`** (@1x 342, @2x 683, @3x 1024), plus `-preview.png`, plus an entry in `accessories.json` (`layer`, `anchor`, `bbox` normalised x0,y0,x1,y1 on fox_idle, per-pose `scale/rotate/tx/ty`, `not_recommended`). Layer order: back FX → back accessory → fox → front accessory → front FX. Style: the soft 3D-plush look of the existing items, with a gentle top-left light, no hard outline and no text. The palette is reused from the existing items: navy `#2C3E6B`, teal_deep `#2E7F7A`, cream `#F3E3C3`, gold `#D9AC58`, forest `#4F7A4A`, sky `#5FA8D3`, straw `#E9D29A`. Fox fur (sampled from fox_idle @2x, approx.): orange `#EE8424`, cream bib `#F2CC98`, paw brown `#5B3A29`. Avoid orange/red fills (they disappear on the fur). **`fox_sad_coal` is never used** (§19.1a), so no item is fitted to it.

**1. Yıldız rozeti — `it-yildiz-rozeti` (Bölüm 5)**
- Shape: a round enamel pin, Ø ≈ 0.075 of the canvas width (≈ 51 px @2x), with a **four-point star** (like the Phosphor `star-four`) raised on it, plus one tiny 2-px sparkle dot at the upper right. Slight 8° clockwise tilt, so that it looks pinned on by hand.
- Colours: navy disc `#2C3E6B` with a gold rim `#D9AC58` 2 px @2x; star gold `#D9AC58` with a cream highlight `#F3E3C3` on the upper-left facets; a soft shadow below at 20 % black. The navy disc keeps the gold readable on the cream bib.
- Layer **front**. New anchor **`chest`** at (0.605, 0.585) on fox_idle, the viewer-right edge of the cream bib, below the Atkı line (Atkı bbox starts at y 0.508 and covers the neck; the pin stays clear of its knot). bbox ≈ 0.567, 0.548, 0.643, 0.623.
- Poses: **idle, wave, cheer, happy, calm, sleepy, hero** (re-place it per pose on the chest, at scale 1.0; on hero, keep it clear of the shield FX). **Not recommended:** craving (the paws/stone cover the chest). Never sad_coal.

**2. Örgü eldiven — `it-orgu-eldiven` (Bölüm 6)**
- Shape: a pair of chunky **knitted mittens** (thumb + mitt, no fingers), each covering the dark paw up to the wrist, with a ribbed cuff (5 visible ribs) and a visible knit texture (fine V-stitches). Each mitten is about 0.10 wide × 0.12 tall. No string between them.
- Colours: body cream `#F3E3C3` (high contrast on the brown paws), cuff teal_deep `#2E7F7A`, one gold `#D9AC58` stitch band just above the cuff; shading `#D9C7A2`.
- Layer **front**. New anchor **`paws`** = two points on fox_idle: left (0.375, 0.745), right (0.705, 0.745). bbox (pair, idle) ≈ 0.32, 0.68, 0.76, 0.81. Because the paws move independently between poses, deliver **per-pose layers** (one PNG per supported pose, pixel-aligned with that pose) instead of one transform.
- Poses: **idle, calm, wave, happy, sleepy** (where both paws are visible). **Not recommended:** cheer (paws raised, motion blur), hero, craving (paws hold the stone). Never sad_coal.

**3. Rüzgârlık — `it-ruzgarlik` (Bölüm 8)**
- Shape: a light, **hoodless** windbreaker, open at the front so that the cream bib still shows (it keeps the fox recognisable), with a small stand-up collar, sleeves ending above the paws (the wrists stay visible), the hem at the hips, a zip line on each front edge and two soft fold creases per sleeve. There is no hood and nothing on the head, so it never clashes with Bere or Hasır şapka.
- Colours: body sky `#5FA8D3`, collar lining and hem band navy `#2C3E6B`, zip edges cream `#F3E3C3`, zip pull gold `#D9AC58`; shade `#4A8DB8`, highlight `#8CC3E3`.
- Layer **front** (body and sleeves). The tail stays in front of the hem at the back, and the jacket must not cover it. Anchor **`shoulders`** (0.541, 0.517), the same as Sırt çantası. bbox (idle) ≈ 0.33, 0.52, 0.75, 0.82.
- Poses: **idle, wave, calm, happy, cheer** (per-pose sleeves, as with Sırt çantası). **Not recommended:** sleepy (curled), hero (cape), craving. Never sad_coal.

**Existing art reused, no brief needed:** Bere (front, crown anchor (0.537, 0.206), bbox 0.307, 0.002, 0.767, 0.355; fits idle, wave, cheer, calm, craving, happy; not sleepy/hero; README lists sad_coal too, which the app never uses) and Şemsiye (back, fox_cheer only).


## 12c. Open questions (rev 5)
Answered in rev 5: 12b-1 (roadmap themes ✔), 12b-2 (Bölüm 2 names ✔), 12b-4 (suffix form ✔, §23), 12b-5 and 19.8-14 (migrations ✔, §21), 19.8-11 (2-week cadence ✔, §24), 19.8-12 (accessory art is made separately; placeholders until then ✔, §25), 12b-10 dark mode (✔, §20; Figma push still pending).

16. ~~Approve the Bölüm 3 & 4 copy~~ → **approved by Umut** (rev 5.1).
17. ~~Approve the other pending manifest copy~~ → **approved** (onay: koordinatör asistan, Umut'un yetkisiyle), with the two fixes in changelog 5.1-2.
18. ~~**"Son 7 gün" strip** (12b-8)~~ → **answered: approved, it stays.** Empty days are a dashed circle; no red, no streak-loss warning (§17.2).
19. ~~Bölüm 6 "Şömine"~~ → **decided:** "Sıcak çay köşesi" `TeaBag`, plus "Gece defteri" replacing the steaming Sıcak içecek (§19.1a). *karar: koordinatör asistan, Umut onayı bekleniyor.*
20. ~~Şemsiye duplicate~~ → **decided:** the accessory keeps "Şemsiye"; the ch7 piece is "Küçük yelkenli". *karar: koordinatör asistan, Umut onayı bekleniyor.* The ch5–8 accessory names are still proposals.
21. ~~"Rotan" vs "Rotam"~~ → **decided: "Rotam"** (§17.2a, 2 strings at App.tsx L506). *karar: koordinatör asistan, Umut onayı bekleniyor.*
22. ~~Dark mode control~~ → **Umut:** follows the system by default, with a manual Sistem / Açık / Koyu choice in Ben → DENEYİM, local-only (§20.1).
23. ~~Light-mode contrast~~ → **decided:** ter `#6E726A`, gold never as text, `gold_text #866018` (§20.3). *karar: koordinatör asistan, Umut onayı bekleniyor.*
24. ~~Run migrations on a real Supabase first?~~ → **decided (rev 5.3, karar: Umut):** PGlite + local `supabase start`, then Umut applies to prod. No branch (§21.0).
25. ~~Who writes and publishes~~ → **Umut:** bots prepare and test on beta; Umut approves and publishes to prod and alone holds the prod service role key (§24).
26. **Figma:** rev 3–5 are still only in PNG + this spec (the MCP limit). Push them when the limit resets?
27. ~~"Işığını yak" wording~~ → **decided (rev 5.2, karar: koordinatör asistan, Umut'a bildirildi):** *yak-* and burn-sense *yan-* are banned; "kazan / parladı / parlıyor".
28. ~~Beta environment~~ → **closed (rev 5.3, karar: Umut):** nothing paid, no branch, no keys for bots. Bots deliver tested bundles; Umut uploads both beta and prod to the same free project (§24).
29. ~~Naming overlaps~~ → **closed (rev 5.4, karar: koordinatör asistan (Umut'un yetkisiyle olduğunu belirtti)):** Tüy rüzgârlığı → Kâğıt fırıldak; Kapüşonlu → Örgü eldiven; Kalın battaniye → Örgü sepeti `yarn` (§25.0).
30. **Gold graphics on light** (bars, rings: 1.95–2.09:1, non-text): leave them as decoration (current), or add a `gold_edge` outline to reach 3:1 for UI components?
31. ~~Review the Bölüm 5–8 copy and Kış şenliği~~ → **approved (rev 5.5, onay: koordinatör asistan, Umut'un yetkisiyle olduğunu belirtti)**, with the piece renames and the accessories Yıldız rozeti, Örgü eldiven, Şemsiye and Rüzgârlık. Each chapter still ships in its own 2-week drop (§24).
32. ~~Kış şenliği light target~~ → **8 lights over 1 Aralık–31 Ocak (rev 5.5, onay: koordinatör asistan, Umut'un yetkisiyle olduğunu belirtti)**. Sonbahar stays at 5 for its 1-month window; Q13 (whether to scale targets by window length in general) stays open.
