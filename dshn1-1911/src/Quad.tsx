// quad-split-parallel-scenes — technique adapted from
// demos/rhythm/quad-split-parallel-scenes/QuadSplitParallelScenes.tsx.
// Kept: 2×2 of quadrants running in parallel, an in-quad "floor" push in every cell,
// heavy events (whip punch-in, sin-envelope blur ≤4px) staggered 6f apart so no two
// quadrants fire together, alternating cell tones behind the grid.
// Changed (user feedback "not enough scenes / accents"): the shot runs ~3.9s, so per the
// card's own note it needs a second round of events —
//   • cells enter staggered (3f apart) instead of all at once,
//   • round 1: 4 clips, each punch-in pops a reaction tag + a gold border flash,
//   • on beat 80 the cells swap one by one (4f apart, in-cell white flash) to 4 NEW clips,
//   • round 2: punch-ins + tags again, in a different cell order.
// 8 different moments in total, none reused elsewhere in the video.
import React from 'react';
import { AbsoluteFill, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { CLAMP, T } from './theme';
import { beatF } from './timeline';

type Cell = { src: string; at: number; origin: string; tag: string };
const ROUND1: Cell[] = [
  { src: 'clips/c2.mp4', at: 20.6, origin: '50% 38%', tag: 'Haha!' },
  { src: 'clips/c7.mp4', at: 29.7, origin: '55% 36%', tag: 'Ối giời ơi' },
  { src: 'clips/c1.mp4', at: 3.4, origin: '50% 45%', tag: 'Hú hồn' },
  { src: 'clips/c6.mp4', at: 5.8, origin: '60% 30%', tag: 'Há miệng nào' },
];
const ROUND2: Cell[] = [
  { src: 'clips/c6.mp4', at: 26.5, origin: '60% 40%', tag: 'Cười xỉu' },
  { src: 'clips/c7.mp4', at: 36.5, origin: '55% 40%', tag: 'Ngước lên nào' },
  { src: 'clips/c7.mp4', at: 44.0, origin: '45% 55%', tag: 'Gục luôn' },
  { src: 'clips/c7.mp4', at: 47.0, origin: '45% 40%', tag: 'Đỉnh nóc' },
];

const GAP = 10;
const CW = (1080 - GAP) / 2;
const CH = (1920 - GAP) / 2;
const SWAP = beatF(80) - beatF(76); // local frame of the swap, on beat 80
// punch frames per cell index (TL, TR, BL, BR): staggered 6f, different order per round
const PUNCH1 = [14, 26, 32, 20];
const PUNCH2 = [SWAP + 29, SWAP + 17, SWAP + 23, SWAP + 35];
const ENTER_FROM = [
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
];

const Clip: React.FC<{ cell: Cell; dur: number; punchAt: number; top: boolean }> = ({ cell, dur, punchAt, top }) => {
  const f = useCurrentFrame();
  const floor = interpolate(f, [0, dur], [1.12, 1.26], { ...CLAMP, easing: Easing.in(Easing.quad) });
  const p = interpolate(f, [punchAt, punchAt + 8], [0, 1], CLAMP);
  const punch = 0.18 * Easing.out(Easing.cubic)(p);
  const blur = Math.sin(Math.PI * p) * 4;
  const tag = interpolate(f, [punchAt + 2, punchAt + 12], [0, 1], { ...CLAMP, easing: Easing.out(Easing.back(1.8)) });
  const ring = interpolate(f, [punchAt, punchAt + 2, punchAt + 12], [0, 1, 0], CLAMP);
  return (
    <AbsoluteFill>
      <div style={{ width: '100%', height: '100%', transform: `scale(${floor + punch})`, transformOrigin: cell.origin, filter: `blur(${blur}px)` }}>
        <OffthreadVideo src={staticFile(cell.src)} startFrom={Math.round(cell.at * 30)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <AbsoluteFill style={{ boxShadow: `inset 0 0 0 ${10 * ring}px ${T.gold}` }} />
      <div
        style={{
          position: 'absolute',
          left: 28,
          // top-row tags sit at the top of the cell so they never meet the centre pill
          ...(top ? { top: 36 } : { bottom: 36 }),
          transform: `scale(${tag}) rotate(-4deg)`,
          transformOrigin: top ? '0% 0%' : '0% 100%',
          opacity: Math.min(1, tag * 1.5),
          background: T.gold,
          color: T.navy,
          fontFamily: T.font,
          fontWeight: 900,
          fontSize: 50,
          padding: '10px 24px',
          borderRadius: 14,
          whiteSpace: 'nowrap',
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
        }}
      >
        {cell.tag}
      </div>
    </AbsoluteFill>
  );
};

const Quadrant: React.FC<{ i: number; dur: number }> = ({ i, dur }) => {
  const f = useCurrentFrame();
  const enter = interpolate(f, [i * 3, i * 3 + 9], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const [dx, dy] = ENTER_FROM[i];
  const swapAt = SWAP + i * 4;
  const flash = interpolate(f, [swapAt, swapAt + 1, swapAt + 5], [0, 0.8, 0], CLAMP);
  return (
    <div
      style={{
        position: 'absolute',
        left: (i % 2) * (CW + GAP),
        top: Math.floor(i / 2) * (CH + GAP),
        width: CW,
        height: CH,
        overflow: 'hidden',
        background: i % 3 === 0 ? T.navySoft : T.navy,
        transform: `translate(${(1 - enter) * dx * CW}px, ${(1 - enter) * dy * CH}px)`,
      }}
    >
      <Sequence durationInFrames={swapAt} layout="none">
        <Clip cell={ROUND1[i]} dur={swapAt} punchAt={PUNCH1[i]} top={i < 2} />
      </Sequence>
      <Sequence from={swapAt} durationInFrames={dur - swapAt} layout="none">
        <Clip cell={ROUND2[i]} dur={dur - swapAt} punchAt={PUNCH2[i] - swapAt} top={i < 2} />
      </Sequence>
      <AbsoluteFill style={{ background: '#fff', opacity: flash }} />
    </div>
  );
};

// Local frames of every punch (for the SFX table).
export const QUAD_PUNCHES = [...PUNCH1, ...PUNCH2].sort((a, b) => a - b);
export const QUAD_SWAP = SWAP;

export const Quad: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const pill = interpolate(f, [10, 22], [0, 1], { ...CLAMP, easing: Easing.out(Easing.back(1.7)) });
  const out = interpolate(f, [dur - 6, dur], [1, 0], CLAMP);
  return (
    <AbsoluteFill style={{ background: T.gold }}>
      {[0, 1, 2, 3].map((i) => (
        <Quadrant key={i} i={i} dur={dur} />
      ))}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            transform: `scale(${pill})`,
            opacity: out,
            background: T.navy,
            border: `6px solid ${T.gold}`,
            color: T.white,
            fontFamily: T.font,
            fontWeight: 900,
            fontSize: 64,
            letterSpacing: 4,
            padding: '20px 44px',
            borderRadius: 999,
            boxShadow: '0 16px 50px rgba(0,0,0,0.45)',
          }}
        >
          DSHN1 <span style={{ color: T.gold }}>·</span> 19.11
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
