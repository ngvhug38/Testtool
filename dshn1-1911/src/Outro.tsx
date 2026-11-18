// Outro: two group photos ("formal" → white flash → "fun pose"), then the closing
// title with marker-underline-title — adapted from
// demos/typography/marker-underline-title/MarkerUnderlineTitle.tsx.
// Kept from the demo: title block rises 36px with out-cubic over 22f, the underline
// starts after the title has settled (+10f), draws left→right in 10f with
// ease-out (1-(1-t)^2.2), variable-width rough stroke from a seeded mulberry32,
// mid-axis rising left-low → right-high, hugging the glyph bottom (≈-0.1em).
// Title holds static well over 1 s before the end (R1).
import React, { useId } from 'react';
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { CLAMP, T } from './theme';
import { beatF } from './timeline';

const mulberry32 = (a: number) => () => {
  let t = (a += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Scaled up from the demo's 118px title (stroke ~14–20px wide) to a 120px title.
const buildStroke = (len: number, seed: number) => {
  const rand = mulberry32(seed);
  const N = 48;
  const top: string[] = [];
  const bot: string[] = [];
  const wob = Array.from({ length: N + 1 }, () => rand() - 0.5);
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = t * len;
    const mid = 22 - t * 10 + Math.sin(t * Math.PI * 1.6 + 0.4) * 2.8 + wob[i] * 1.8;
    const wBase = 16 + Math.sin(t * Math.PI) * 7 - Math.max(0, t - 0.86) * 52;
    const w = Math.max(2.5, wBase + wob[i] * 3.2);
    top.push(`${x.toFixed(1)},${(mid - w / 2).toFixed(1)}`);
    bot.push(`${x.toFixed(1)},${(mid + w / 2).toFixed(1)}`);
  }
  return `M${top.join('L')}L${bot.reverse().join('L')}Z`;
};

// Local frames, beat-locked: photo swap on beat 116, title move on beat 120.
export const OUTRO = { swap: beatF(116) - beatF(112), titleMove: beatF(120) - beatF(112) } as const;

export const Outro: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const revealId = `reveal-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const { swap, titleMove } = OUTRO;

  const cardIn = interpolate(f, [0, 16], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const flash1 = interpolate(f, [0, 2, 8], [0.85, 0.85, 0], CLAMP);
  const flash2 = interpolate(f, [swap, swap + 1, swap + 7], [0, 0.95, 0], CLAMP);
  const photo = f < swap ? 'photos/group-formal.jpg' : 'photos/group-fun.jpg';
  const drift = interpolate(f, [0, dur], [1, 1.06], CLAMP); // slow push on the photo itself

  const move = interpolate(f, [titleMove, titleMove + 24], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const cardY = interpolate(move, [0, 1], [0, -250]) + (1 - cardIn) * 120;
  const cardS = interpolate(move, [0, 1], [1, 0.92]) * (0.94 + 0.06 * cardIn);

  const tIn = interpolate(f, [titleMove + 10, titleMove + 32], [0, 1], CLAMP);
  const eo = 1 - Math.pow(1 - tIn, 3);
  const settle = titleMove + 32;
  const draw = interpolate(f, [settle + 10, settle + 20], [0, 1], CLAMP);
  const drawE = 1 - Math.pow(1 - draw, 2.2);
  const LEN = 430;
  const path = buildStroke(LEN, 77);

  return (
    <AbsoluteFill style={{ background: T.navy, overflow: 'hidden' }}>
      {/* blurred, darkened copy of the photo as the backdrop */}
      <AbsoluteFill style={{ transform: 'scale(1.25)' }}>
        <Img src={staticFile(photo)} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(38px) brightness(0.45) saturate(1.2)' }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: 'linear-gradient(to bottom, rgba(8,20,40,0.15), rgba(8,20,40,0.75))' }} />

      {/* the photo, printed-card style */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            width: 1000,
            height: 750,
            transform: `translateY(${cardY - 60}px) scale(${cardS}) rotate(${(1 - cardIn) * -2}deg)`,
            opacity: cardIn,
            borderRadius: 28,
            border: '10px solid #fff',
            overflow: 'hidden',
            boxShadow: '0 40px 110px rgba(0,0,0,0.55)',
            background: '#fff',
          }}
        >
          <Img src={staticFile(photo)} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${drift})` }} />
        </div>
      </AbsoluteFill>

      {/* closing title */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1170,
          textAlign: 'center',
          fontFamily: T.font,
          opacity: Math.min(1, tIn * 1.6),
          transform: `translateY(${(1 - eo) * 36}px)`,
        }}
      >
        <div style={{ color: T.gold, fontWeight: 800, fontSize: 42, letterSpacing: 7, marginBottom: 26 }}>19.11 · NGÀY QUỐC TẾ ĐÀN ÔNG</div>
        <div style={{ color: T.white, fontWeight: 900, fontSize: 120, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          <div>Chúc mừng</div>
          <div>
            anh em{' '}
            <span style={{ position: 'relative', display: 'inline-block' }}>
              DSHN1
              <svg width={LEN} height={52} viewBox={`0 0 ${LEN} 52`} style={{ position: 'absolute', left: -14, bottom: -18, overflow: 'visible' }}>
                <defs>
                  <clipPath id={revealId}>
                    <rect x={0} y={-20} width={drawE * (LEN + 6)} height={80} />
                  </clipPath>
                </defs>
                {draw > 0 && <path d={path} fill={T.gold} clipPath={`url(#${revealId})`} />}
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* camera flashes on each photo */}
      <AbsoluteFill style={{ background: '#fff', opacity: Math.max(flash1, flash2) }} />
    </AbsoluteFill>
  );
};
