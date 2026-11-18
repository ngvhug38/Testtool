// quad-split-parallel-scenes — technique adapted from
// demos/rhythm/quad-split-parallel-scenes/QuadSplitParallelScenes.tsx.
// Kept: hard cut into a 2×2, four quadrants run in parallel, every cell has an
// in-quad slow "floor" push, and the heavy events (whip punch-in with a sin-envelope
// blur peaking at 4px) are staggered so no two quadrants fire together; alternating
// cell tones keep the grid lines readable.
// Changed: cell content = four reaction clips. At ~3.9s (two bars) the card asks for
// a second round of events, so each cell punches in twice on staggered times.
import React from 'react';
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { CLAMP, T } from './theme';

const CELLS = [
  { src: 'clips/c2.mp4', at: 20.6, origin: '50% 38%', hits: [0.1, 0.56] },
  { src: 'clips/c6.mp4', at: 24.0, origin: '50% 40%', hits: [0.27, 0.73] },
  { src: 'clips/c7.mp4', at: 29.7, origin: '55% 36%', hits: [0.18, 0.64] },
  { src: 'clips/c1.mp4', at: 3.4, origin: '50% 45%', hits: [0.36, 0.84] },
];
const GAP = 10;
const CW = (1080 - GAP) / 2;
const CH = (1920 - GAP) / 2;

const Cell: React.FC<{ i: number; dur: number }> = ({ i, dur }) => {
  const f = useCurrentFrame();
  const c = CELLS[i];
  const t = f / dur;
  const floor = interpolate(t, [0, 1], [1.12, 1.3], { ...CLAMP, easing: Easing.in(Easing.quad) });
  let punch = 0;
  let blur = 0;
  for (const h of c.hits) {
    const p = interpolate(t, [h, h + 0.07], [0, 1], CLAMP);
    punch += p > 0 ? 0.16 * Easing.out(Easing.cubic)(p) : 0;
    blur += Math.sin(Math.PI * p) * 4;
  }
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
      }}
    >
      <div style={{ width: '100%', height: '100%', transform: `scale(${floor + punch})`, transformOrigin: c.origin, filter: `blur(${blur}px)` }}>
        <OffthreadVideo src={staticFile(c.src)} startFrom={Math.round(c.at * 30)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </div>
  );
};

export const Quad: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const pill = interpolate(f, [4, 16], [0, 1], { ...CLAMP, easing: Easing.out(Easing.back(1.7)) });
  const out = interpolate(f, [dur - 6, dur], [1, 0], CLAMP);
  return (
    <AbsoluteFill style={{ background: T.gold }}>
      {CELLS.map((_, i) => (
        <Cell key={i} i={i} dur={dur} />
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
