// Single source of truth for timing. All shot boundaries are musical beats.
// Grid: analysis/grid.json — bgm-tech-house.mp3, 123.995 BPM, beat0 @ 0.0100s,
// kick-onset match 98.5%, mean |err| 4.6ms (window 7–70s).
export const FPS = 30;
export const BEAT_INT = 0.4838904794548185; // T, seconds
export const SOURCE_BEAT0 = 0.01; // source analysis t0 (seconds), never mixed with render offsets
export const SOURCE_START_BEAT = 16; // excerpt starts at source bar 4; drop = source beat 32 = video beat 16
export const AUDIO_START_FRAME = Math.round((SOURCE_BEAT0 + SOURCE_START_BEAT * BEAT_INT) * FPS); // 233
// residual between the exact source beat and the frame-quantised audio start
const START_RESIDUAL = SOURCE_BEAT0 + SOURCE_START_BEAT * BEAT_INT - AUDIO_START_FRAME / FPS; // ≈ -0.0144s
export const OUTPUT_AUDIO_OFFSET_SEC = 0; // set from post-render measurement if a constant offset shows up

export const beatT = (n: number) => START_RESIDUAL + OUTPUT_AUDIO_OFFSET_SEC + n * BEAT_INT;
export const beatF = (n: number) => Math.max(0, Math.round(beatT(n) * FPS));

const shot = (a: number, b: number) => ({ beatFrom: a, beatTo: b, from: beatF(a), dur: beatF(b) - beatF(a) });

export const SHOTS = {
  logo: shot(0, 9),
  scale: shot(9, 16),
  qrMask: shot(16, 28),
  qrLock: shot(28, 36),
  benefits: shot(36, 48),
  ecosystem: shot(48, 60),
  features: shot(60, 70),
  devices: shot(70, 78),
  pricing: shot(78, 88),
  customers: shot(88, 98),
  outro: shot(98, 112),
} as const;
export type ShotKey = keyof typeof SHOTS;
export const TOTAL = beatF(112);

/** local frame of musical beat n (video beats) inside a shot */
export const localBeat = (key: ShotKey, n: number) => beatF(n) - SHOTS[key].from;
