// SFX pin table (stage 6). Every cue is written as the PICTURE action frame (relative to SHOTS) and
// converted with at(): from = action − sourcePeakLag − outputOffset, so the audible peak lands on the
// action (sound-design §4.1 / §4.6; independent review finding A2/A9).
// Peak lags measured from each file's RMS maximum (analysis/sync.md); output offset 42.7 ms ≈ 1.28 f.
// Gains are set from measured peaks vs the BGM bed; clock-tick-single is recorded at −13.9 dB → gain 2.5.
// Whole-frame accents: only 2 (qrMask takeover, outro stamp).
import { SHOTS, FPS, OUTPUT_AUDIO_OFFSET_SEC } from './timeline';

export type Sfx = { from: number; src: string; volume: number; dur?: number; note: string };
const S = SHOTS;

export const PEAK_LAG: Record<string, number> = {
  'chime-crystal.mp3': 6.6,
  'click-camera.mp3': 5.9,
  'clock-tick-single.mp3': 15.0,
  'hit-weak.mp3': 4.7,
  'impact-deep-whoosh.mp3': 16.7,
  'pop.mp3': 1.2,
  'riser-cine.mp3': 35.2,
  'sparkle.mp3': 44.1,
  'swoosh-quick.mp3': 8.5,
  'transition-snap.mp3': 3.3,
  'transition-soft.mp3': 13.2,
  'whoosh-big.mp3': 21.6,
  'whoosh-fast.mp3': 21.9,
};
const OUT = OUTPUT_AUDIO_OFFSET_SEC * FPS;
const at = (action: number, src: string, volume: number, tail: number, note: string): Sfx => {
  const lag = PEAK_LAG[src] ?? 0;
  const from = Math.max(0, Math.round(action - lag - OUT));
  return { from, src, volume, dur: Math.round(action - from + tail), note };
};

export const SFX: Sfx[] = [
  // S1 logo — air as the mark collapses (peak at the brake, t≈0.3), sparkle as the wordmark completes (t≈0.7)
  at(S.logo.from + 38, 'transition-soft.mp3', 0.35, 20, 'logo collapse'),
  at(S.logo.from + 92, 'sparkle.mp3', 0.3, 36, 'wordmark set'),
  // S2 odometer — one tick per digit lock (locks at 22 + 7i), confirm click on the lock pulse (57)
  ...[0, 1, 2, 3, 4, 5].map((i) => at(S.scale.from + 22 + i * 7, 'clock-tick-single.mp3', 2.5 - i * 0.12, 6, `digit ${i} lock`)),
  at(S.scale.from + 57, 'click-camera.mp3', 0.9, 10, '300.000+ confirmed'),
  // S3 text-as-mask — whoosh peaks mid-takeover, deep impact when the footage owns the frame (big accent #1)
  at(S.qrMask.from + 118, 'whoosh-big.mp3', 0.3, 14, 'takeover push'),
  at(S.qrMask.from + 130, 'impact-deep-whoosh.mp3', 0.42, 40, 'footage takeover lands'),
  // S4 reticle — whoosh peaks as the frame arrives (22), mechanical click on the lock frame (44)
  at(S.qrLock.from + 22, 'whoosh-fast.mp3', 0.28, 10, 'reticle fly-in'),
  at(S.qrLock.from + 44, 'click-camera.mp3', 1.0, 10, 'reticle lock'),
  // S5 doc-park — swoosh on the flash cut, three pills dealt (descending volumes)
  at(S.benefits.from, 'swoosh-quick.mp3', 0.3, 12, 'flash cut into benefits'),
  at(S.benefits.from + 46, 'pop.mp3', 0.42, 14, 'pill 1'),
  at(S.benefits.from + 84, 'pop.mp3', 0.36, 14, 'pill 2'),
  at(S.benefits.from + 122, 'pop.mp3', 0.3, 14, 'pill 3'),
  // S6 pill-slot — light swoosh per swap (alternating level), snap when the closing words land
  ...[0, 1, 2, 3, 4].map((k) => at(S.ecosystem.from + Math.round(18 + k * 20.4), 'swoosh-quick.mp3', k % 2 ? 0.14 : 0.18, 10, `pill swap ${k}`)),
  at(S.ecosystem.from + 118, 'transition-snap.mp3', 0.45, 14, 'trọn mọi việc lands'),
  // S7 bento — scene air in, crystal chime only on the MIỄN PHÍ cell (single accent light)
  at(S.features.from + 6, 'transition-soft.mp3', 0.3, 20, 'enter features'),
  at(S.features.from + 93, 'chime-crystal.mp3', 0.3, 40, 'free cell lights'),
  // S8 runway — cards rain down, one weak hit for the touchdown cluster, big whoosh as the page rises
  at(S.devices.from + 14, 'whoosh-fast.mp3', 0.3, 10, 'cards fall'),
  at(S.devices.from + 17, 'hit-weak.mp3', 0.45, 14, 'touchdown'),
  at(S.devices.from + 60, 'whoosh-big.mp3', 0.26, 20, 'page rises'),
  // S9 spotlight — rise whoosh, beam sparkle peaks on lap 1, reseat snap
  at(S.pricing.from + 60, 'whoosh-big.mp3', 0.3, 14, 'hero plan rises'),
  at(S.pricing.from + 76, 'sparkle.mp3', 0.3, 30, 'perimeter beam'),
  at(S.pricing.from + 130, 'transition-snap.mp3', 0.9, 12, 'reseat'),
  // S10 logo wall — swoosh on the flash cut
  at(S.customers.from, 'swoosh-quick.mp3', 0.3, 12, 'flash cut into customers'),
  // S11 outro — riser builds right into the stamp → deep impact (mix peak) → sparkle on rule + CTA
  at(S.outro.from + 40, 'riser-cine.mp3', 0.34, 6, 'riser into wordmark stamp'),
  at(S.outro.from + 46, 'impact-deep-whoosh.mp3', 0.55, 50, 'wordmark stamp (mix peak)'),
  at(S.outro.from + 74, 'sparkle.mp3', 0.35, 50, 'rule + CTA'),
];
