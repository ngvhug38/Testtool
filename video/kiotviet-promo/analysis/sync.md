# Audio sync record

- Render output audio offset (AAC priming): +42.3 ms (maker, cross-correlation BGM render vs source) and +42.3…43.0 ms (independent review, 9 SFX). Applied as `OUTPUT_AUDIO_OFFSET_SEC = 0.0427` in `src/timeline.ts` (shifts picture cuts and SFX together; source analysis values untouched).
- Design cut error before compensation: −1.64…+1.85 f (all ≤3 f).
- SFX source peak lags (RMS max, frames @30fps): chime-crystal 6.6 · click-camera 5.9 · clock-tick-single 15.0 · hit-weak 4.7 · impact-deep-whoosh 16.7 · pop 1.2 · riser-cine 35.2 · sparkle 44.1 · swoosh-quick 8.5 · transition-snap 3.3 · transition-soft 13.2 · whoosh-big 21.6 · whoosh-fast 21.9. `src/sfx.ts` pins cues by picture action frame and subtracts lag + output offset.
- Loudness: final deliverables normalised with ffmpeg loudnorm (I = −15 LUFS, TP = −1.5 dB).
