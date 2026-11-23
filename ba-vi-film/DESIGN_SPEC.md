# Ba Vì — weekend film · design spec (autonomous free-creation mode)

## 0. Brief & requirement → execution decisions
| Requirement (user) | Execution decision |
|---|---|
| Use every clip, video and photo | 23 unique clips + 4 photos all placed (duplicates across uploads deduped by byte compare). |
| Weekend travel film at Ba Vì | Chapters: arrival → walking the forest resort → pigeons → night → Sunday morning → farewell. |
| Exploit every angle & emotional moments | Eyeline match (window → valley), reverse-angle match (walk away → photo walking toward camera), speed-ramp on the look-back on the grass, push into laughing face on dad's shoulders, freeze + pull-back ending. |
| Seamless storytelling, not a boring slideshow montage | Every seam has a chosen transition type (cut on action / focus hand-off / flash / whip / light leak / black title card); cuts on the music grid. |
| BGM: use bundled skill music | `cat-walk.mp3` (130 BPM, 124 s, quiet intro → build → full → breakdown → rebuild → full → outro) — best energy arc of the 5; the others are flat tech-house/hip-hop. Song shortened by removing song beats 208–232 (same-energy repeat) at an 8-beat phrase boundary. |
| Language | Vietnamese on-screen text. |
| Format | Footage is all portrait → 1080×1920, 30 fps (deviation from skill default 1920×1080, required by source). |
| Data safety | Private family footage; no third-party personal data added. |

## 1. Visual direction (chosen: "Rừng sương ấm" — warm misty forest)
Footage-derived tokens: forest green, stone grey, cream (child's outfit), amber lamp warmth.
- Title: Playfair Display Italic 500, cream `#F4EFE4`, soft shadow `0 4px 30px rgba(0,0,0,.35)`.
- Captions: Be Vietnam Pro 300, wide tracking 0.18em, ≥56 px (Q11 scaled to 1920 tall frame).
- Motion personality: "calm caring / friendly" preset — ~26–42 f entrances, no overshoot, blur-slide reveals.
- Styleframe skipped: the look is the footage itself; typography verified with `remotion still` frames instead (recorded reason).

## 2. Shot cards used (Gallery names)
- `shot-transitions` · C focus hand-off (FocusHandoffTransition.tsx), D black title card (BlackCardTransition.tsx), E whip-pan (WhipPanReal.tsx), A flash-cut (assets/lib/FlashCut.tsx)
- `transition-hidden-cut` · C light-leak-burn (LightLeakBurn.tsx) — the only warm light effect
- `tension-camera-moves` · C slow-push-in (SlowPushIn.tsx), D pull-back (ending)
- `speed-ramp-freeze` · speed ramp (SpeedRampReal.tsx) — adapted to footage: 2.4× → 0.5× (interpolated slow-mo); 10× contrast not reachable without stutter on 30 fps phone footage (documented deviation)
- `typography/blur-slide` (BlurSlide.tsx) — all titles
Light effects total = 2 (flash at b64, light leak at b140). Whole-frame slams = 2 (b64, b192).

## 3. Storyboard (output beats; beatF(n) = round((0.2464 + n·0.46155)·30))
| # | beats | shot | key motion / seam |
|---|---|---|---|
| A1 | 0–8 | 7253 bear hat looking out the window | fade in from black |
| A2 | 8–26 | 7255 misty valley (eyeline match) | focus hand-off in; slow push 1.00→1.12; title "Ba Vì" + "cuối tuần · 21—22.11.2026" |
| A3 | 26–32 | 7195 face close-up | hard cut at push peak |
| B1 | 32–40 | 7194 lobby, runs to camera | caption "Chiều thứ Bảy · 21.11" |
| B2–B6 | 40–64 | 7254 table · 7196 stairs · 7198 stone path · 7199 · 7235 sits by door | cuts on action every 4–6 beats |
| C1 | 64–76 | 7237 hand in hand down the brick path | **slam 1**: flash-cut on the drop |
| C2 | 76–82 | photo 7200 (reverse angle, walking toward us) | slow push |
| C3–C4 | 82–98 | 7243 carried then set down · 7244 pool deck | cuts |
| C5 | 98–110 | 7249 dancing → lifted up | whip-pan out |
| C6 | 110–114 | 8966 walking to the buggy (4K) | whip-pan in |
| C7 | 114–128 | pigeons 7277·7279·7280·7281·7282·7283 | 2-beat cuts, wing flutter SFX |
| D1 | 128–140 | 7290 alone on the grass, turns back | breakdown; speed ramp to slow-mo |
| D2 | 140–156 | 7303 night reading | light-leak burn in; caption "Tối" |
| D3 | 156–160 | black card "Sáng Chủ nhật · 22.11" | D black card |
| E1–E3 | 160–184 | photos 7313 · 7315 (push into the laugh) · 7317 (7/9/8 beats) | focus hand-offs |
| F1 | 184–210 | 7318 walks to dad in the courtyard; music lifts at b192 mid-shot | cut; push 1.00→1.12 |
| G | 210–228 | F1 freezes on its own last frame (dad + child nose to nose), pull back 1.12→1.0, darken + vignette | end title "Ba Vì" / "hẹn ngày quay lại" (hold ≥1 s) |

## 4. Sound
BGM 0.55 (inputProp `bgm`, default true; no-BGM render delivered too). Clip natural audio 0.32 with 4 f edge fades (child voices, birds, wind). SFX: whoosh on whip, wing flutter on pigeons, soft swoosh under light leak.

## Deliberate rule deviations
- C1 (caption every animated segment): family film — captions limited to chapter markers; footage speaks.
- skill default 1920×1080 → 1080×1920 (portrait source).

## Review round 1 → fixes (independent reviewer)
- M1 freeze jump → F1 freezes itself (`<Freeze active>`), seam RMSE 0.0013.
- M2 whip seam → 1620 px swing (≈1.5 screens), blurred mirror filler strip, 24 samples.
- M3 black card too short → entry gap 3 / window 14, fade only last 6 f.
- S1 natural sound raised (0.7 / 1.0 on emotional shots) + BGM ducks 50 % under A3, C5, D1–D2, F1.
- S2 SFX 0.8. S3 C7e trimmed to 0–0.46 s (stranger child removed). S4 slow-mo handover skips the duplicate first frame.
- S5 Sunday photos 24 beats (was 32). S6 final frame shows child + dad. S7 vignette on slow push, deeper pull-back. S8 text 64/110 px.
- S9 light grade on B2 and F1. S10 final mix loudness-normalised to −14 LUFS, TP ≤ −1 dBTP.
