// S10 · page-waterfall-wall (adapted from demos/ui-entrance/page-waterfall-wall/PageWaterfallWall.tsx +
// assets/lib/VerticalTicker.tsx). Kept: 3 columns, loops 12/9/14s (≥25% apart), middle column
// reversed, rotateX 20° / perspective 1000 / scale 1.2, 200px fade masks, linear outer push 1→1.06.
// Adapted: card-level slices are the 18 confirmed customer logos (6 per column, no repeats across
// columns), light brand background, title band in the top mask.
import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { VerticalTicker, TickerColumn } from '../lib/VerticalTicker';
import { C, FONT } from '../theme';
import { useLayout } from '../layout';

const LOGOS = [
  '00-masan', '01-vinwonders', '02-grab', '03-vietnampost', '04-5s', '05-vietnhat',
  '06-greenfood', '07-diva', '08-minibao', '09-kafa', '10-thegioisua', '11-hanvico',
  '12-cashion', '13-himalaya', '14-thanhtra', '15-coconails', '16-pierrecardin', '17-thegioithoigian',
];
const tile = (name: string, h = 250) => (
  <div style={{ height: h, borderRadius: 28, background: '#fff', boxShadow: '0 14px 36px rgba(12,45,94,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Img src={staticFile(`logos/${name}.png`)} style={{ maxWidth: '84%', maxHeight: 180, objectFit: 'contain' }} />
  </div>
);
const cols = (loops: [number, number, number], h = 250): TickerColumn[] => [ // review: every logo must cross the clear band within the shot
  { items: LOGOS.filter((_, i) => i % 3 === 0).map((n) => tile(n, h)), durationInSeconds: loops[0], direction: -1 },
  { items: LOGOS.filter((_, i) => i % 3 === 1).map((n) => tile(n, h)), durationInSeconds: loops[1], direction: 1 },
  { items: LOGOS.filter((_, i) => i % 3 === 2).map((n) => tile(n, h)), durationInSeconds: loops[2], direction: -1 },
];

// TikTok: 2 columns × 9 logos, 390 px wide inside the safe zone (x 64–956), masks hide everything outside y 480–1440
const tileV = (name: string, h: number) => (
  <div style={{ height: h, borderRadius: 28, background: '#fff', boxShadow: '0 14px 36px rgba(12,45,94,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Img src={staticFile(`logos/${name}.png`)} style={{ width: '78%', height: h * 0.62, objectFit: 'contain' }} />
  </div>
);
const cols2 = (loops: [number, number], h: number): TickerColumn[] => [
  { items: LOGOS.filter((_, i) => i % 2 === 0).map((n) => tileV(n, h)), durationInSeconds: loops[0], direction: -1 },
  { items: LOGOS.filter((_, i) => i % 2 === 1).map((n) => tileV(n, h)), durationInSeconds: loops[1], direction: 1 },
];

export const S10_DEFAULTS = { title: 'Gian hàng tiêu biểu đang dùng KiotViet' };

export const S10LogoWall: React.FC<Partial<typeof S10_DEFAULTS>> = (p) => {
  const { title } = { ...S10_DEFAULTS, ...p };
  const frame = useCurrentFrame();
  const V = useLayout().vertical;
  const { durationInFrames } = useVideoConfig();
  const push = interpolate(frame, [0, durationInFrames], [1, V ? 1.0 : 1.06]);
  const tIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        {V ? (
          <VerticalTicker columns={cols2([7, 5.5], 260)} backgroundColor={C.bg} columnWidth={350} gap={30} maskHeight={480} scale={1} tiltDeg={12} phases={[0.93, 0.0]} />
        ) : (
          <VerticalTicker columns={cols([7.5, 6, 8])} backgroundColor={C.bg} columnWidth={520} gap={30} maskHeight={220} phases={[0.62, 0.9, 0.5]} />
        )}
      </AbsoluteFill>
      {V && <div style={{ position: 'absolute', left: 0, right: 0, top: 1380, bottom: 0, background: `linear-gradient(180deg, rgba(240,242,246,0), ${C.bg} 90px)`, zIndex: 12 }} />}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: V ? 420 : 190, background: `linear-gradient(180deg, ${C.bg} 75%, rgba(240,242,246,0))`, zIndex: 15 }} />
      <div style={{ position: 'absolute', top: V ? 240 : 54, left: V ? 80 : 0, width: V ? 900 : '100%', textAlign: 'center', fontFamily: FONT, lineHeight: 1.15, fontSize: V ? 66 : 62, fontWeight: 800, color: C.navy, opacity: tIn, transform: `translateY(${(1 - tIn) * 14}px)`, zIndex: 20 }}>
        {title}
      </div>
    </AbsoluteFill>
  );
};
