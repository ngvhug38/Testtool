// "THỬ THÁCH CẮN NGẮN NHẤT" — story version. Single source of truth for timing.
//
// Real game (from the user): 6 pairs each hold one food item between their mouths and bite
// from both ends; the shortest remaining piece wins — but the closer it gets, the more the
// guys flinch at almost kissing each other. Organised by the women of DSHN1.
//
// BGM: g-eazy-nba-type.mp3 — fitted grid 86.66 BPM, phase 0.48 s (onset coverage 84 %);
// the drop is at song 14.756 s. The song is offset so the drop lands on the "19.11"
// takeover: video t = song t − SONG_OFFSET. Shot boundaries sit on song beats n ≡ 2 (mod 4).
export const BPM = 86.66;
export const PHASE_S = 0.48;
export const SONG_OFFSET = 6.76;
export const DROP_F = Math.round(30 * (14.756 - SONG_OFFSET)); // = 240
export const beatF = (n: number) => Math.round(30 * (PHASE_S + (n * 60) / BPM - SONG_OFFSET));

const S = (a: number, b: number) => ({ from: beatF(a), to: beatF(b) });

export const ACT = {
  cold: { from: 0, to: beatF(14) }, // heartbeat cold open, no music
  title: S(14, 22), // text-as-mask "19.11", takeover on the drop
  org: S(22, 30), // organisers: the women of DSHN1
  rules: S(30, 38), // rules graphic
  problem: S(38, 42), // "…but the closer you bite, the closer the faces"
  p1: S(42, 50),
  p2: S(50, 58),
  p3: S(58, 70), // includes the freeze-annotate
  p4: S(70, 78),
  p5: S(78, 86),
  p6: S(86, 98), // the near-kiss climax, slow motion
  quad: S(98, 106), // the crowd
  result: S(106, 110),
  outro: S(110, 122), // medal ceremony photos + closing title
} as const;
export const TOTAL = ACT.outro.to + 15;
export const BGM_START = ACT.cold.to; // music enters with the title

export type Sub = { src: string; at: number; dur: number; rate?: number; push?: [number, number]; origin?: string; volume?: number };
export type Pair = {
  key: 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6';
  n: number;
  tactic: string;
  comment: string;
  ngai: number; // "Mức độ ngại" meter target, %
  subs: Sub[]; // sequential sub-shots (frames); p3 ends with the freeze shot instead
};

const f = (s: number) => Math.round(s * 30);

// Pair → tactic mapping is read from the footage (clothes identify the pairs); windows
// avoid every blocked / blurred stretch found in the frame-by-frame review.
export const PAIRS: Pair[] = [
  {
    key: 'p1', n: 1, tactic: 'KHÔNG NHÌN LÀ ĐƯỢC', comment: 'Che mắt lại là xong!', ngai: 60,
    subs: [
      { src: 'clips/c2.mp4', at: 0, dur: f(3.9) },
      { src: 'clips/c1.mp4', at: 0.2, dur: 0 }, // fills the rest of the act
    ],
  },
  {
    key: 'p2', n: 2, tactic: 'TRÙM KHĂN ĐỎ', comment: 'Không thấy mặt, chắc đỡ ngại?', ngai: 72,
    subs: [
      { src: 'clips/c11.mp4', at: 96.0, dur: f(1.5) },
      { src: 'clips/c3.mp4', at: 1.5, dur: 0 },
    ],
  },
  {
    key: 'p3', n: 3, tactic: 'CƯỜI TRỪ', comment: 'Cười cho đỡ ngượng', ngai: 80,
    subs: [{ src: 'clips/c5.mp4', at: 5.2, dur: f(4.0) }], // + Freeze for the rest
  },
  {
    key: 'p4', n: 4, tactic: 'NHẮM MẮT CHO QUA', comment: 'Nhắm mắt, đếm tới ba…', ngai: 88,
    subs: [
      { src: 'clips/c7.mp4', at: 12.5, dur: f(3.1) },
      { src: 'clips/c6.mp4', at: 20.5, dur: 0 },
    ],
  },
  {
    key: 'p5', n: 5, tactic: 'ĂN VỘI CHO XONG', comment: 'Cắn nhanh, khỏi suy nghĩ', ngai: 93,
    subs: [
      { src: 'clips/c11.mp4', at: 5.9, dur: f(3.1) },
      { src: 'clips/c8.mp4', at: 80.0, dur: 0 },
    ],
  },
  {
    key: 'p6', n: 6, tactic: 'LIỀU THẬT SỰ', comment: 'Cả phòng nín thở…', ngai: 100,
    subs: [
      { src: 'clips/c9.mp4', at: 52.6, dur: f(1.0) },
      { src: 'clips/c9.mp4', at: 53.6, dur: f(2.6), rate: 0.35, volume: 0 }, // slow motion at the closest moment
      { src: 'clips/c4.mp4', at: 0.6, dur: f(2.7) },
      { src: 'clips/c8.mp4', at: 0.0, dur: 0 },
    ],
  },
];

// Resolve dur: 0 → remaining frames of the act.
export const resolveSubs = (p: Pair) => {
  const act = ACT[p.key];
  const total = act.to - act.from;
  const fixed = p.subs.reduce((a, s) => a + s.dur, 0);
  let t = 0;
  return p.subs.map((s) => {
    const dur = s.dur || total - fixed;
    const r = { ...s, dur, from: act.from + t };
    t += dur;
    return r;
  });
};
