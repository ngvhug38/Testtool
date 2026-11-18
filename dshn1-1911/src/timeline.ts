// Single source of truth for the timeline. Every boundary is a beat number.
//
// BGM: house-vibez.mp3 — grid fitted by onset-strength search:
//   122.00 BPM, phase 0.065 s, onset coverage 97.5 % (passes music-beat-sync acceptance).
//   Downbeats fall on n % 4 === 0.
export const BPM = 122;
export const PHASE_S = 0.065;
export const beatF = (n: number) => Math.round(30 * (PHASE_S + (n * 60) / BPM));

export type ClipRef = { src: string; at: number }; // at = source seconds

type Shot = { from: number; to: number };
const S = (a: number, b: number): Shot => ({ from: beatF(a), to: beatF(b) });

export const SHOTS = {
  intro: { from: 0, to: beatF(12) }, // text-as-mask "19.11" over the crowd laughing
  hook: S(12, 20), // card-footage-cadence
  n1: S(20, 28), // NEW c10 wide establishing shot of the whole room
  m1: S(28, 36), // c2 blindfold
  m2: S(36, 48), // c5 guessing
  n2: S(48, 56), // NEW c9 open-mouth laugh
  m3: S(56, 72), // c3 red veil
  freeze: S(72, 80), // speed-ramp-freeze (freeze-annotate) on c5
  m5: S(80, 92), // c6 team hug
  n3: S(92, 100), // NEW c11 snack + big smile
  quad: S(100, 108), // quad-split reactions
  m6: S(108, 120), // c4 prize
  m7a: S(120, 128), // c7 part 1
  m7b: S(128, 136), // c7 part 2
  n4: S(136, 144), // NEW c8 doubled-over laugh, last montage beat
  outro: S(144, 160), // group photos + marker-underline title
} as const;

export const TOTAL = SHOTS.outro.to + 15;

// Montage shots: source in-points come from Keep Highlights segments
// (notes/keep-highlights.json), trimmed to the beat-locked length.
type Mont = { clip: ClipRef; kicker: string; line: string; push?: [number, number]; origin?: string };
export type MontKey = 'n1' | 'n2' | 'n3' | 'n4' | 'm1' | 'm2' | 'm3' | 'm5' | 'm6' | 'm7a' | 'm7b';
export const MONTAGE: { [K in MontKey]: Mont } = {
  // NEW shots from the second batch of clips (c8–c11), checked frame by frame:
  // windows avoid blocked / blurred stretches (c9 30–45 s, c10 42–66 s, c11 57–69 s, c8 18–27 s & 79 s).
  n1: { clip: { src: 'clips/c10.mp4', at: 0.5 }, kicker: 'DSHN1', line: 'Cả team cùng quẩy', push: [1, 1.12], origin: '40% 55%' },
  n2: { clip: { src: 'clips/c9.mp4', at: 48.0 }, kicker: '', line: '', push: [1.15, 1.2], origin: '0% 40%' },
  n3: { clip: { src: 'clips/c11.mp4', at: 5.6 }, kicker: '', line: '' },
  n4: { clip: { src: 'clips/c8.mp4', at: 80.0 }, kicker: 'TỚI BẾN', line: 'Vui tới phút cuối' },
  m1: { clip: { src: 'clips/c2.mp4', at: 0 }, kicker: '', line: '' },
  m2: { clip: { src: 'clips/c5.mp4', at: 5.2 }, kicker: 'CĂNG NÃO', line: 'Đoán mãi chưa ra' },
  m3: { clip: { src: 'clips/c3.mp4', at: 1.0 }, kicker: '', line: '' },
  m5: { clip: { src: 'clips/c6.mp4', at: 17.5 }, kicker: 'ANH EM', line: 'Tình đồng đội DSHN1' },
  m6: { clip: { src: 'clips/c4.mp4', at: 0.6 }, kicker: 'CÓ THƯỞNG', line: 'Chơi hết mình, nhận quà liền' },
  m7a: { clip: { src: 'clips/c7.mp4', at: 12.52 }, kicker: 'CẢ PHÒNG', line: 'Cười nghiêng ngả' },
  m7b: { clip: { src: 'clips/c7.mp4', at: 21.62 }, kicker: '', line: '' },
};
