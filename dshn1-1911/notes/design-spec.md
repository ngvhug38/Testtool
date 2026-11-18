# DSHN1 · Ngày Quốc tế Đàn ông 19.11 — Design spec

Mode: **autonomous free creation** (video-shotcraft pipeline), user chose
"video-shotcraft + Keep Highlights".

## 1. Brief
- Purpose: internal recap video for the 19/11 International Men's Day party of team DSHN1
  (KiotViet office, visible in footage). Audience: team members, internal social channels.
- Inputs: 7 vertical iPhone clips (720×1280, 30 fps, 5.9–58.3 s; total 2:38) + 2 landscape
  group photos (2568×1926, formal pose / fun pose, everyone wearing medals, red pennant).
- Content: office party games — blindfolded guessing who by touching faces, red-veil
  guessing, lots of laughter, a prize being handed out, hugs, group photos.
- Format: **1080×1920 vertical, 30 fps, 63.6 s** (source is vertical → native for phones).
- Language: Vietnamese on-screen text.
- Audio: no user BGM → library `house-vibez.mp3` (upbeat house, fits a party), original
  clip laughter kept underneath. Two deliverables: with BGM / without BGM (SFX + clip audio kept).
- Data: footage of real colleagues is the content; no extra personal data added; no names.
  Raw media + renders are git-ignored (not pushed).

## 2. Requirement → execution decisions
| Requirement | Decision |
|---|---|
| "Tổng hợp" from user media | Keep Highlights picks key moments per clip; montage uses only those windows |
| Fun party tone | Energy preset "lively/joyful" (~27f entrances, out-back pops 1.6–1.7), house BGM 122 BPM |
| Phone viewing | Vertical; captions 84px bold + 44px kicker on bottom scrim |
| Strong-beat BGM | All shot boundaries = `beatF(n)`; grid 122.00 BPM, phase 0.065 s, onset coverage 97.5 % |
| Group photos | Outro: photo cards with camera-flash swap, then closing title |

## 3. Visual tokens (from the event, not a promo skin)
- navy `#081428` (base), blue `#2F7BFF` / teal `#38D6C4` (KiotViet logo + ceiling light
  sculpture), **gold `#FFC23D` (medals — primary accent)**, red `#D7261E` (pennant/veil).
- Font: Be Vietnam Pro 500/800/900 (full Vietnamese diacritics).
- Motion: lively/joyful preset; hard cuts on beats; whole-frame impacts limited to 2 (R4).
- No styleframe page: footage-driven event recap, look is defined by the footage + 4 tokens
  above (skipped per pipeline stage 1 allowance; rationale recorded here).

## 4. Moment → shot-card mapping
| Moment | Card · variant | Demo source |
|---|---|---|
| Opening title "19.11" with footage inside | `text-as-mask` | demos/opening/text-as-mask/TextAsMask.tsx |
| Hook: footage ↔ word cards | `trailer-grammar-moves` · B card-footage-cadence | demos/rhythm/trailer-grammar-moves/CardFootageCadence.tsx |
| "Expression of the year" | `speed-ramp-freeze` · freeze-annotate | demos/rhythm/speed-ramp-freeze/FreezeAnnotateReal.tsx |
| Reaction burst | `quad-split-parallel-scenes` | demos/rhythm/quad-split-parallel-scenes/QuadSplitParallelScenes.tsx |
| Closing title | `marker-underline-title` | demos/typography/marker-underline-title/MarkerUnderlineTitle.tsx |
| Montage shots | plain footage + lower-third caption (no card) | — |

Adaptations (documented in each component header): inline SVG clipPath instead of data-URI
mask (web font); beat-locked segments; freeze implemented with an exact still + 1.4× unfreeze;
quad gets two staggered punch-in rounds because it runs ~3.9 s (> 2.1 s density limit).

## 5. Storyboard (beats @122 BPM → frames)
| # | Beats | Frames | Shot | Content | Caption / text |
|---|---|---|---|---|---|
| 1 | 0–12 | 0–179 | intro | "19.11" mask over c7 (from 2 s) → takeover at f149 | NGÀY QUỐC TẾ ĐÀN ÔNG · 19.11 · DSHN1 |
| 2 | 12–20 | 179–297 | hook | c6@8.7 / BỊT MẮT / c7@50.5 / ĐOÁN NGƯỜI / c1@0.2 / CƯỜI XỈU (no reuse of montage windows) | word cards (124px) |
| 3 | 20–28 | 297–415 | m1 | c2 0–3.9 s blindfold guessing | (no caption — removed per user) |
| 4 | 28–40 | 415–592 | m2 | c5 5.2–11.1 s | CĂNG NÃO · Đoán mãi chưa ra |
| 5 | 40–56 | 592–828 | m3 | c3 1.0–8.9 s red veil | (no caption — removed per user) |
| 6 | 56–64 | 828–946 | freeze | c5 14.7 s flow (20f, after camera whip) → freeze @15.37 s (65f) → 1.4× | Biểu cảm của năm |
| 7 | 64–76 | 946–1123 | m5 | c6 17.5–23.4 s (incl. hug) | ANH EM · Tình đồng đội DSHN1 |
| 8 | 76–84 | 1123–1241 | quad | c2@20.6 · c6@24.0 · c7@29.7 · c1@3.4 | DSHN1 · 19.11 |
| 9 | 84–96 | 1241–1418 | m6 | c4 0.6–6.5 s prize handed over | CÓ THƯỞNG · Chơi hết mình, nhận quà liền |
| 10 | 96–112 | 1418–1654 | m7a+b | c7 12.5–16.4 s, 21.6–25.5 s | CẢ PHÒNG · Cười nghiêng ngả |
| 11 | 112–128 (+15f) | 1654–1905 | outro | photo formal → card-only flash → photo fun (b116) → title (b120), marker underline, ~2.7 s hold | 19.11 · NGÀY QUỐC TẾ ĐÀN ÔNG / Chúc mừng anh em DSHN1 |

Keep Highlights windows used (notes/keep-highlights.json): every montage in-point lies inside or
starts at a Keep segment; small extensions were made only to reach beat-locked lengths.

## 6. Sound
- BGM 0.30 (fade in 12f, out 50f), wrapped in `bgm` inputProp.
- Clip audio 0.55 on montage shots (laughter), 0.4 on intro takeover, muted in hook/quad/unfreeze.
- SFX table in `src/Main.tsx` (relative frames, annotated): woosh+impact (intro takeover, slam 1),
  swoosh ×3 stepped 0.32→0.22 (hook cards), shutter + marker (freeze), woosh (quad),
  camera clicks ×2 (photos, +12 dB pre-gained), woosh → impact (slam 2, loudest) → shimmer (outro).
- impact-cine-big hits ~65f into the file → started 65f early. Measured after render: intro hit f151
  (visual f149), title hit f1809 (visual settle f1804).
- Final mix normalised: -14.2 LUFS / -0.9 dBTP (with BGM), -14.8 LUFS / -0.5 dBTP (no BGM).
- Full-frame hits: only the two impacts; photo flashes are limited to the photo card (R4).
- Audio offset compensation (S5) not measured for this pipeline — known limitation.

## 7. Known deviations
- Captions describe the games generically (rules were inferred from footage).
- No styleframe (see §3). No workbench manifest (cloud session; localhost workbench unreachable).

## 8. Independent review
A clean-context reviewer flagged 13 issues on v1 (late impacts, riser, inaudible SFX, loudness,
hook footage reuse, card overflow, blurry freeze lead-in, long static ending, full-frame flashes,
small kickers, flash/swap off-by-one, shaky m6, hook word/shot mismatch). All were addressed in v2.
Open note: the freeze singles out one colleague — confirm they are fine with it before wider posting.

## 9. Reaction highlights (v3, user request)
Per user feedback, the "expression of the year" idea is extended: 5 extra moments where the
room laughs loudest (clip-audio RMS peaks inside the used windows), one per person, are marked
with a face-tracked gold marker ellipse + tag while the footage keeps playing (no extra freeze,
so the freeze stays the hero). Tracking: notes/track-faces.py (OpenCV Haar, 7-frame smoothing)
→ src/faces.json.
| Shot | Clip @ s | Frames | Tag |
|---|---|---|---|
| m1 | c2 @2.5–3.7 | 372–408 | Cười banh nóc |
| m5 | c6 @21.4–22.6 | 1063–1099 | Cảm động muốn khóc |
| m6 | c4 @0.6–1.5 | 1241–1268 | Gần lắm rồi! |
| m7a | c7 @14.2–15.4 | 1468–1504 | Nín cười không nổi |
| m7b | c7 @23.6–24.8 | 1595–1631 | Cười trộm |
Captions on m1 and m3 were removed per user feedback.

## 10. Quad split v2 (user feedback: "not enough scenes / accents")
8 moments instead of 4, none reused elsewhere. Cells fly in from their corners (3f stagger);
round 1 (c2@20.6 Haha! · c7@29.7 Ối giời ơi · c1@3.4 Hú hồn · c6@5.8 Há miệng nào) — each
punch-in pops a gold reaction tag + gold border flash; on beat 80 cells swap one by one (4f apart,
in-cell white flash) to round 2 (c6@26.5 Cười xỉu · c7@36.5 Ngước lên nào · c7@44 Gục luôn ·
c7@47 Đỉnh nóc). Punches stay 6f apart and change cell order between rounds.

## 11. Batch 2: four more clips (c8–c11), v5
Frame-by-frame review (1 fps sheets + per-second Laplacian sharpness, frame-diff motion and
loudness, notes in session): blocked/blurred stretches excluded — c8 18–27 s & 79 s, c9 30–45 s,
c10 42–66 s, c11 57–69 s. Keep Highlights segments were sparse (first 30 s only), so selection
combined Keep + local QC + laughter loudness. Camera tilt checked against a level grid: all four
windows level (wall/ceiling line, door and whiteboard verticals) → no rotation applied.
| Shot | Beats | Clip @ s | Content | Treatment |
|---|---|---|---|---|
| n1 | 20–28 | c10 @0.5 | wide establishing shot, whole room | slow push 1→1.12 toward the group; caption DSHN1 · Cả team cùng quẩy |
| n2 | 48–56 | c9 @48.0 | open-mouth laugh (avoids the kiss at 53–56 s — same gag as m6) | reframed 1.15→1.2 anchored left so both faces stay in frame |
| n3 | 92–100 | c11 @5.6 | snack + big smile (avoids hand/body blocking at 10–15 s) | face-tracked tag "Cười tít mắt" |
| n4 | 136–144 | c8 @80.0 | doubled-over laugh (starts after the plaid-shirt block at 79 s) | caption TỚI BẾN · Vui tới phút cuối + tag "Cười gập người" |
Total length now 79.3 s (2378 frames); all other shots shifted by whole bars, cuts stay on the grid.

## 12. Story version — "THỬ THÁCH CẮN NGẮN NHẤT" (composition `Story`, v6)
Real game per user: 6 pairs bite one food item from both ends, shortest piece wins; the
comedy is the guys' reluctance as faces get close. Organised by the women of DSHN1.
Structure: cold open (trailer-bumper, heartbeat, no music) → "19.11" title on the BGM drop
(g-eazy-nba-type, 86.66 BPM, song offset 6.76 s) → organisers (c10 push to the women in red)
→ rules graphic (2 faces + 1 snack biting inward) → "…mặt càng GẦN" → 6 pair acts, each with a
HUD (CẶP n/6, tactic, "MỨC ĐỘ NGẠI" meter 60→72→80→88→93→100 "VỠ!") and a commentary caption →
pair 6 with 0.35× slow-motion → crowd quad → result ("ai cũng dũng cảm" — no ranking claimed,
no measured data) → medal ceremony (zoom into the medals) → title + "Cảm ơn chị em đã tổ chức".
Pair→tactic mapping inferred from clothes; awaiting user confirmation of the winner/food.
Face highlights in the top band (y<520) are skipped here so they never collide with the HUD.
The original montage remains as composition `Recap`.
