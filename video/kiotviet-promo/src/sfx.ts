// SFX pin table (stage 6). Every `from` is relative to SHOTS / beat grid — never a bare frame number.
// Peaks measured with ffmpeg volumedetect (see public/audio/sfx): all ≈ 0…−7 dB except
// clock-tick-single (−13.9 dB) which therefore gets a ≥1 gain. Big whole-frame accents: only 2
// (qrMask takeover, outro stamp). BGM drums already mark the beats → SFX only on picture-specific actions.
import { SHOTS } from './timeline';

export type Sfx = { from: number; src: string; volume: number; dur?: number; note: string };
const S = SHOTS;

export const SFX: Sfx[] = [
  // S1 logo — soft air as the mark collapses, sparkle as the mark heals/locks (t≈0.37)
  { from: S.logo.from + 2, src: 'transition-soft.mp3', volume: 0.35, dur: 40, note: 'logo collapse' },
  { from: S.logo.from + 46, src: 'sparkle.mp3', volume: 0.28, dur: 70, note: 'mark locks' },
  // S2 odometer — one tick per digit lock (locks at 28 + 7i), final confirm click on the lock pulse
  ...[0, 1, 2, 3, 4, 5].map((i) => ({ from: S.scale.from + 28 + i * 7, src: 'clock-tick-single.mp3', volume: 1.0 - i * 0.06, dur: 10, note: `digit ${i} lock` })),
  { from: S.scale.from + 63, src: 'click-camera.mp3', volume: 0.5, dur: 14, note: '300.000+ confirmed' },
  // S3 text-as-mask — whoosh rides the ×26 takeover, deep impact when the footage owns the frame (big accent #1)
  { from: S.qrMask.from + 98, src: 'whoosh-big.mp3', volume: 0.3, dur: 40, note: 'takeover push' },
  { from: S.qrMask.from + 126, src: 'impact-deep-whoosh.mp3', volume: 0.42, dur: 60, note: 'footage takeover lands' },
  // S4 reticle — frame flies in, mechanical click on the lock frame
  { from: S.qrLock.from + 12, src: 'whoosh-fast.mp3', volume: 0.28, dur: 30, note: 'reticle fly-in' },
  { from: S.qrLock.from + 44, src: 'click-camera.mp3', volume: 0.55, dur: 14, note: 'reticle lock' },
  // S5 doc-park — flash cut swoosh, footage parks, three pills dealt (descending volumes)
  { from: S.benefits.from - 4, src: 'swoosh-quick.mp3', volume: 0.3, dur: 24, note: 'flash cut into benefits' },
  { from: S.benefits.from + 46, src: 'pop.mp3', volume: 0.42, dur: 16, note: 'pill 1' },
  { from: S.benefits.from + 84, src: 'pop.mp3', volume: 0.36, dur: 16, note: 'pill 2' },
  { from: S.benefits.from + 122, src: 'pop.mp3', volume: 0.3, dur: 16, note: 'pill 3' },
  // S6 pill-slot — light swoosh per swap (alternating level), snap when the closing words land
  ...[0, 1, 2, 3, 4].map((k) => ({ from: S.ecosystem.from + Math.round(14 + k * 20.4), src: 'swoosh-quick.mp3', volume: k % 2 ? 0.14 : 0.18, dur: 20, note: `pill swap ${k}` })),
  { from: S.ecosystem.from + 116, src: 'transition-snap.mp3', volume: 0.4, dur: 18, note: 'trọn mọi việc lands' },
  // S7 bento — scene air in, crystal chime only on the MIỄN PHÍ cell (single accent light)
  { from: S.features.from, src: 'transition-soft.mp3', volume: 0.3, dur: 40, note: 'enter features' },
  { from: S.features.from + 93, src: 'chime-crystal.mp3', volume: 0.3, dur: 50, note: 'free cell lights' },
  // S8 runway — cards rain down, one weak hit for the touchdown cluster, big whoosh as the page rises
  { from: S.devices.from + 4, src: 'whoosh-fast.mp3', volume: 0.3, dur: 30, note: 'cards fall' },
  { from: S.devices.from + 17, src: 'hit-weak.mp3', volume: 0.4, dur: 18, note: 'touchdown' },
  { from: S.devices.from + 38, src: 'whoosh-big.mp3', volume: 0.26, dur: 50, note: 'page rises' },
  // S9 spotlight — rise whoosh, beam sparkle, reseat snap (card: each action its own sound)
  { from: S.pricing.from + 46, src: 'whoosh-big.mp3', volume: 0.3, dur: 40, note: 'hero plan rises' },
  { from: S.pricing.from + 60, src: 'sparkle.mp3', volume: 0.3, dur: 60, note: 'perimeter beam' },
  { from: S.pricing.from + 127, src: 'transition-snap.mp3', volume: 0.42, dur: 18, note: 'reseat' },
  // S10 logo wall — flash cut swoosh
  { from: S.customers.from - 4, src: 'swoosh-quick.mp3', volume: 0.3, dur: 24, note: 'flash cut into customers' },
  // S11 outro — fixed sentence: riser into assembly → deep impact on the wordmark stamp (peak) → sparkle on the rule
  { from: S.outro.from + 42 - 146, src: 'riser-cine.mp3', volume: 0.32, dur: 146, note: 'riser into group photo' },
  { from: S.outro.from + 42, src: 'impact-deep-whoosh.mp3', volume: 0.55, dur: 90, note: 'wordmark stamp (mix peak)' },
  { from: S.outro.from + 60, src: 'sparkle.mp3', volume: 0.35, dur: 90, note: 'rule + CTA' },
];
