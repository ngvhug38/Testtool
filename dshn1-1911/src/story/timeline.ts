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
  p1: S(42, 50), // pair A
  p2: S(50, 62), // pair B, ends with the freeze-annotate
  p3: S(62, 70), // pair F
  p4: S(70, 78), // pair E
  p5: S(78, 90), // pair D
  p6: S(90, 102), // pair C — near-kiss climax, slow motion
  quad: S(102, 110), // the crowd
  result: S(110, 114),
  outro: S(114, 126), // medal ceremony photos + closing title
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

// Pairs identified by clothing across all 11 clips (frame-by-frame check, user-corrected):
//  A brown sweater+glasses / grey striped sweater ........ c1, c2
//  B curly hair black top+white pants / white shirt+glasses c3 (veil), c5, c11 1:18–1:40
//  C brown leather jacket / "Same Fight Different" hoodie . c4, c8 0–3 s, c9 48–57 s
//  D "KINGKONG" sweatshirt / dark turtleneck .............. c6, c7, c8 34–90 s, c9 84–95 s, c11 3–54 s
//  E yellow jacket+glasses / black tee with tattoo ........ c9 0–27 s, c10 69–80 s
//  F plaid shirt / white tee+beige trousers ............... c10 0–40 s
// Ordered so the "ngại" meter escalates. Windows avoid every blocked/blurred stretch.
// c9/c10 are wide shots → reframed (≤1.45×) onto the pair.
export const PAIRS: Pair[] = [
  {
    key: 'p1', n: 1, tactic: 'KHÔNG NHÌN LÀ ĐƯỢC', comment: 'Che mắt lại là xong!', ngai: 60,
    subs: [
      { src: 'clips/c2.mp4', at: 0, dur: f(3.9) },
      { src: 'clips/c1.mp4', at: 0.2, dur: 0 },
    ],
  },
  {
    key: 'p2', n: 2, tactic: 'TRÙM KHĂN ĐỎ', comment: 'Không thấy mặt, chắc đỡ ngại?', ngai: 70,
    subs: [
      { src: 'clips/c11.mp4', at: 96.0, dur: f(1.5) },
      { src: 'clips/c3.mp4', at: 1.5, dur: f(2.8) },
    ], // + Freeze (c5, same pair) for the rest
  },
  {
    key: 'p3', n: 3, tactic: 'NÉ CÀNG XA CÀNG TỐT', comment: 'Né được bao nhiêu thì né!', ngai: 78,
    subs: [
      { src: 'clips/c10.mp4', at: 7.5, dur: f(2.8), push: [1.4, 1.45], origin: '22% 60%' },
      { src: 'clips/c10.mp4', at: 28.0, dur: 0, push: [1.4, 1.45], origin: '22% 60%' },
    ],
  },
  {
    key: 'p4', n: 4, tactic: 'KÉO ĐẦU VÀO LUÔN', comment: 'Một tay kéo đầu, khỏi suy nghĩ', ngai: 86,
    subs: [
      { src: 'clips/c9.mp4', at: 2.0, dur: f(3.4), push: [1.4, 1.45], origin: '20% 60%' },
      { src: 'clips/c10.mp4', at: 70.5, dur: 0, push: [1.4, 1.45], origin: '30% 62%' },
    ],
  },
  {
    key: 'p5', n: 5, tactic: 'CƯỜI RA NƯỚC MẮT', comment: 'Cười trước, cắn sau', ngai: 93,
    subs: [
      { src: 'clips/c11.mp4', at: 5.9, dur: f(3.1) },
      { src: 'clips/c6.mp4', at: 20.5, dur: f(2.4) },
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
