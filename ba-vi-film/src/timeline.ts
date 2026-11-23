// Single source of truth for the Ba Vì film timeline.
// Beat grid from analysis/beat_data.json (cat-walk.mp3): 129.997 BPM.
export const FPS = 30;
export const W = 1080;
export const H = 1920;

export const SOURCE_BEAT0 = 0.2464; // s, analysis t0 (never mix render offsets in here)
export const BEAT_INT = 0.46155; // s
export const OUTPUT_AUDIO_OFFSET_SEC = 0;
export const beatT = (n: number) => SOURCE_BEAT0 + OUTPUT_AUDIO_OFFSET_SEC + n * BEAT_INT;
export const beatF = (n: number) => Math.round(beatT(n) * FPS);

// Song edit: output beats < SPLICE play song beats 1:1; from SPLICE on the song
// jumps forward SKIP beats (removes a same-energy repeat at a phrase boundary).
export const SPLICE_BEAT = 208;
export const SKIP_BEATS = 24;
export const END_BEAT = 228;
export const DURATION = beatF(END_BEAT) + 6;

export type Seam = 'cut' | 'fadeBlack' | 'focus' | 'flash' | 'whip' | 'leak' | 'settle';
export type Move =
  | { kind: 'none' }
  | { kind: 'push'; from: number; to: number; ox?: number; oy?: number; ease?: 'in' | 'inOut' }
  | { kind: 'ramp'; fastRate: number; fastFrames: number; slowSrc: string; slowStart: number };

export type Shot = {
  id: string;
  src: string; // clips/cNNNN.mp4 or photos/pNNNN.jpg
  photo?: boolean;
  b0: number; // start beat
  b1: number; // end beat
  srcStart: number; // seconds into source
  seamIn: Seam; // transition used to enter this shot
  move: Move;
  vol?: number; // natural audio level
  objY?: number; // object-position y % for cover crop
  grade?: string; // light per-shot CSS colour correction
};

const none: Move = { kind: 'none' };

export const SHOTS: Shot[] = [
  // ── Intro (song b0–32): window → eyeline match to the valley → face
  { id: 'A1', src: 'clips/c7253.mp4', b0: 0, b1: 8, srcStart: 0.2, seamIn: 'fadeBlack', move: none, vol: 0.7 },
  { id: 'A2', src: 'clips/c7255.mp4', b0: 8, b1: 26, srcStart: 0.2, seamIn: 'focus', move: { kind: 'push', from: 1.0, to: 1.12, ease: 'in' }, vol: 0.7 },
  { id: 'A3', src: 'clips/c7195.mp4', b0: 26, b1: 32, srcStart: 0.1, seamIn: 'cut', move: none, vol: 1.0 },
  // ── Build (b32–64): arriving & exploring, cuts on action
  { id: 'B1', src: 'clips/c7194.mp4', b0: 32, b1: 40, srcStart: 1.9, seamIn: 'cut', move: none, vol: 0.7 },
  { id: 'B2', src: 'clips/c7254.mp4', b0: 40, b1: 44, srcStart: 0.1, seamIn: 'cut', move: none, vol: 0.7, grade: 'saturate(0.85) hue-rotate(-5deg)' },
  { id: 'B3', src: 'clips/c7196.mp4', b0: 44, b1: 50, srcStart: 2.0, seamIn: 'cut', move: none, vol: 0.7 },
  { id: 'B4', src: 'clips/c7198.mp4', b0: 50, b1: 54, srcStart: 0.3, seamIn: 'cut', move: none, vol: 0.7 },
  { id: 'B5', src: 'clips/c7199.mp4', b0: 54, b1: 58, srcStart: 0.1, seamIn: 'cut', move: none, vol: 0.7 },
  { id: 'B6', src: 'clips/c7235.mp4', b0: 58, b1: 64, srcStart: 2.6, seamIn: 'cut', move: none, vol: 0.7 },
  // ── Full 1 (b64–128): walking together → pigeons
  { id: 'C1', src: 'clips/c7237.mp4', b0: 64, b1: 76, srcStart: 0.2, seamIn: 'flash', move: none, vol: 0.7 },
  { id: 'C2', src: 'photos/p7200.jpg', photo: true, b0: 76, b1: 82, srcStart: 0, seamIn: 'cut', move: { kind: 'push', from: 1.0, to: 1.06, ox: 50, oy: 60, ease: 'inOut' } },
  { id: 'C3', src: 'clips/c7243.mp4', b0: 82, b1: 90, srcStart: 3.1, seamIn: 'cut', move: none, vol: 0.7 },
  { id: 'C4', src: 'clips/c7244.mp4', b0: 90, b1: 98, srcStart: 0.3, seamIn: 'cut', move: none, vol: 0.7 },
  { id: 'C5', src: 'clips/c7249.mp4', b0: 98, b1: 110, srcStart: 4.0, seamIn: 'cut', move: none, vol: 1.0 },
  { id: 'C6', src: 'clips/c8966.mp4', b0: 110, b1: 114, srcStart: 0.1, seamIn: 'whip', move: none, vol: 0.7 },
  { id: 'C7a', src: 'clips/c7277.mp4', b0: 114, b1: 116, srcStart: 0.3, seamIn: 'cut', move: none, vol: 0.7 },
  { id: 'C7b', src: 'clips/c7279.mp4', b0: 116, b1: 118, srcStart: 0.6, seamIn: 'cut', move: none, vol: 0.7 },
  { id: 'C7c', src: 'clips/c7280.mp4', b0: 118, b1: 120, srcStart: 0.1, seamIn: 'cut', move: none, vol: 0.7 },
  { id: 'C7d', src: 'clips/c7281.mp4', b0: 120, b1: 123, srcStart: 0.2, seamIn: 'cut', move: none, vol: 0.7 },
  { id: 'C7e', src: 'clips/c7282.mp4', b0: 123, b1: 124, srcStart: 0.0, seamIn: 'cut', move: none, vol: 0.7 },
  { id: 'C7f', src: 'clips/c7283.mp4', b0: 124, b1: 128, srcStart: 7.6, seamIn: 'cut', move: none, vol: 0.7 },
  // ── Breakdown (b128–160): alone on the grass → night
  { id: 'D1', src: 'clips/c7290.mp4', b0: 128, b1: 140, srcStart: 0.2, seamIn: 'cut', move: { kind: 'ramp', fastRate: 2, fastFrames: 51, slowSrc: 'clips/c7290slow.mp4', slowStart: 1 }, vol: 1.0 },
  { id: 'D2', src: 'clips/c7303.mp4', b0: 140, b1: 156, srcStart: 0.3, seamIn: 'leak', move: none, vol: 1.0 },
  // D3 = black title card, b156–160 (rendered by BlackCard)
  // ── Rebuild (b160–192): Sunday morning photos
  { id: 'E1', src: 'photos/p7313.jpg', photo: true, b0: 160, b1: 167, srcStart: 0, seamIn: 'fadeBlack', move: { kind: 'push', from: 1.02, to: 1.08, ox: 52, oy: 62, ease: 'inOut' } },
  { id: 'E2', src: 'photos/p7315.jpg', photo: true, b0: 167, b1: 176, srcStart: 0, seamIn: 'focus', move: { kind: 'push', from: 1.0, to: 1.14, ox: 50, oy: 33, ease: 'inOut' } },
  { id: 'E3', src: 'photos/p7317.jpg', photo: true, b0: 176, b1: 184, srcStart: 0, seamIn: 'focus', move: { kind: 'push', from: 1.1, to: 1.0, ox: 55, oy: 68, ease: 'inOut' } },
  // ── Full 2 (b192–216): back to dad in the courtyard; G = freeze/pull-back end
  { id: 'F1', src: 'clips/c7318.mp4', b0: 184, b1: 210, srcStart: 0.15, seamIn: 'cut', move: { kind: 'push', from: 1.0, to: 1.12, ox: 45, oy: 62, ease: 'inOut' }, vol: 1.0, grade: 'saturate(1.1) sepia(0.08) brightness(1.03)' },
];

export const BLACK_CARD = { b0: 156, b1: 160, text: 'Sáng Chủ nhật', sub: '22 . 11' };
export const ENDING = { b0: 210, b1: END_BEAT };

// On-screen text (Vietnamese)
export const TITLE = { b0: 10, b1: 24, text: 'Ba Vì', sub: 'cuối tuần · 21 — 22.11.2026' };
export const CHAPTERS = [
  { b0: 32.5, b1: 39.5, text: 'Chiều thứ Bảy' },
  { b0: 141, b1: 150, text: 'Tối' },
];
export const END_TITLE = { b0: 213, text: 'Ba Vì', sub: 'hẹn ngày quay lại' };

// Whole-frame impacts (≤3, R4): flash-cut on b64 only (b192 lands mid-F1 as the music lifts).
// Light effects (≤2, Q4): flash b64, light-leak b140.

export const SFX: { from: number; src: string; volume: number; dur?: number; note: string }[] = [
  { from: beatF(110) - 7, src: 'audio/air-woosh-quick.mp3', volume: 0.45, note: 'whip-pan C5→C6' },
  { from: beatF(114) - 2, src: 'audio/wing-flutter-norm.mp3', volume: 0.8, dur: 70, note: 'pigeons take the stage' },
  { from: beatF(140) - 27, src: 'audio/swoosh-slow.mp3', volume: 0.8, dur: 60, note: 'warm light leak into night' },
];

// BGM ducking (S1): dip under emotional natural-sound moments.
export const DUCK: [number, number][] = [[26, 32], [98, 110], [128, 156], [184, 210]];
