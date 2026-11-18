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
  m1: S(20, 28), // c2 blindfold
  m2: S(28, 40), // c5 guessing
  m3: S(40, 56), // c3 red veil
  freeze: S(56, 64), // speed-ramp-freeze (freeze-annotate) on c5
  m5: S(64, 76), // c6 team hug
  quad: S(76, 84), // quad-split reactions
  m6: S(84, 96), // c4 prize
  m7a: S(96, 104), // c7 part 1
  m7b: S(104, 112), // c7 part 2
  outro: S(112, 134), // group photos + marker-underline title
} as const;

export const TOTAL = SHOTS.outro.to + 20;

// Montage shots: source in-points come from Keep Highlights segments
// (notes/keep-highlights.json), trimmed to the beat-locked length.
export const MONTAGE = {
  m1: { clip: { src: 'clips/c2.mp4', at: 0 }, kicker: 'TRÒ CHƠI', line: 'Bịt mắt, đoán xem ai?' },
  m2: { clip: { src: 'clips/c5.mp4', at: 5.2 }, kicker: 'CĂNG NÃO', line: 'Đoán mãi chưa ra' },
  m3: { clip: { src: 'clips/c3.mp4', at: 1.0 }, kicker: 'THỬ THÁCH', line: 'Trùm khăn đỏ, ai đây?' },
  m5: { clip: { src: 'clips/c6.mp4', at: 17.5 }, kicker: 'ANH EM', line: 'Tình đồng đội DSHN1' },
  m6: { clip: { src: 'clips/c4.mp4', at: 0.6 }, kicker: 'CÓ THƯỞNG', line: 'Chơi hết mình, nhận quà liền' },
  m7a: { clip: { src: 'clips/c7.mp4', at: 12.52 }, kicker: 'CẢ PHÒNG', line: 'Cười nghiêng ngả' },
  m7b: { clip: { src: 'clips/c7.mp4', at: 21.62 }, kicker: '', line: '' },
} as const;
