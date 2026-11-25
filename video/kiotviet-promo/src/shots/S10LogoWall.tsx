// S10 · page-waterfall-wall (adapted from demos/ui-entrance/page-waterfall-wall/PageWaterfallWall.tsx +
// assets/lib/VerticalTicker.tsx). Kept: 3 columns, loops 12/9/14s (≥25% apart), middle column
// reversed, rotateX 20° / perspective 1000 / scale 1.2, 200px fade masks, linear outer push 1→1.06.
// Adapted: card-level slices are the 18 confirmed customer logos (6 per column, no repeats across
// columns), light brand background, title band in the top mask.
import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { VerticalTicker, TickerColumn } from '../lib/VerticalTicker';
import { C, FONT } from '../theme';

const LOGOS = [
  '00-masan', '01-vinwonders', '02-grab', '03-vietnampost', '04-5s', '05-vietnhat',
  '06-greenfood', '07-diva', '08-minibao', '09-kafa', '10-thegioisua', '11-hanvico',
  '12-cashion', '13-himalaya', '14-thanhtra', '15-coconails', '16-pierrecardin', '17-thegioithoigian',
];
const tile = (name: string) => (
  <div style={{ height: 250, borderRadius: 28, background: '#fff', boxShadow: '0 14px 36px rgba(12,45,94,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Img src={staticFile(`logos/${name}.png`)} style={{ maxWidth: 380, maxHeight: 180, objectFit: 'contain' }} />
  </div>
);
const cols = (loops: [number, number, number]): TickerColumn[] => [
  { items: LOGOS.filter((_, i) => i % 3 === 0).map(tile), durationInSeconds: loops[0], direction: -1 },
  { items: LOGOS.filter((_, i) => i % 3 === 1).map(tile), durationInSeconds: loops[1], direction: 1 },
  { items: LOGOS.filter((_, i) => i % 3 === 2).map(tile), durationInSeconds: loops[2], direction: -1 },
];

export const S10_DEFAULTS = { title: 'Gian hàng tiêu biểu đang dùng KiotViet' };

export const S10LogoWall: React.FC<Partial<typeof S10_DEFAULTS>> = (p) => {
  const { title } = { ...S10_DEFAULTS, ...p };
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const push = interpolate(frame, [0, durationInFrames], [1, 1.06]);
  const tIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <VerticalTicker columns={cols([12, 9, 14])} backgroundColor={C.bg} columnWidth={520} gap={30} maskHeight={320} />
      </AbsoluteFill>
      <div style={{ position: 'absolute', top: 54, width: '100%', textAlign: 'center', fontFamily: FONT, fontSize: 62, fontWeight: 800, color: C.navy, opacity: tIn, transform: `translateY(${(1 - tIn) * 14}px)`, zIndex: 20 }}>
        {title}
      </div>
    </AbsoluteFill>
  );
};
