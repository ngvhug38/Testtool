// text-as-mask (opening) — adapted from demos/opening/text-as-mask/TextAsMask.tsx
// for a 1080×1920 vertical frame and real footage.
// Kept from the demo: hold → in-letter drift → single-bezier(0.4,0,0.2,1) 30f takeover,
// mask wrapper scales while the content layer counter-scales by 1/S, origin pinned
// inside a solid stroke, and an unmasked cover layer that shares the same motion
// transform fades in over endT 0.25–0.9. Static ≥20f after takeover (R1).
// Change: the mask is an inline SVG <clipPath> instead of a data-URI mask image so
// the glyphs use the event font (data-URI SVG images cannot load web fonts).
import React from 'react';
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { CLAMP, H, T, W } from './theme';

const CLIP_ID = 'intro-1911';
// Origin on the stem of the first "1" (measured from rendered stills).
const ORIGIN = '233px 955px'; // stem spans x 200–266, y 833–1078 at frame 20
const SRC = 'clips/c7.mp4';
const AT = 2.0; // takeover lands on c7 @ ~7 s: the whole room laughing

export const Intro: React.FC<{ dur: number; takeoverEnd: number }> = ({ dur, takeoverEnd }) => {
  const f = useCurrentFrame();
  const tStart = takeoverEnd - 30;
  const endT = interpolate(f, [tStart, takeoverEnd], [0, 1], { ...CLAMP, easing: Easing.bezier(0.4, 0, 0.2, 1) });

  const driftX = interpolate(f, [20, tStart], [70, -70], CLAMP);
  const dx = f < tStart ? driftX : interpolate(endT, [0, 1], [-70, 0]);
  const contentS = interpolate(endT, [0, 1], [1.15, 1]);
  const maskS = interpolate(endT, [0, 1], [1, 26]);
  const cover = interpolate(endT, [0.25, 0.9], [0, 1], CLAMP);

  const titleIn = interpolate(f, [0, 16], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const titleOut = interpolate(f, [tStart, tStart + 12], [1, 0], CLAMP);
  const labels = titleIn * titleOut;

  const motion: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    transform: `translateX(${dx}px) scale(${contentS})`,
    transformOrigin: '50% 50%',
  };
  const video = (muted: boolean) => (
    <OffthreadVideo
      src={staticFile(SRC)}
      startFrom={Math.round(AT * 30)}
      muted={muted}
      volume={muted ? 0 : 0.4}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );

  return (
    <AbsoluteFill style={{ background: T.navy, overflow: 'hidden' }}>
      <svg width={0} height={0} style={{ position: 'absolute' }}>
        <defs>
          <clipPath id={CLIP_ID} clipPathUnits="userSpaceOnUse">
            <text
              x={W / 2}
              y={1092}
              textAnchor="middle"
              fontFamily={T.font}
              fontWeight={900}
              fontSize={350}
              letterSpacing={-10}
            >
              19.11
            </text>
          </clipPath>
        </defs>
      </svg>

      {/* masked layer: wrapper clips + scales, inner counter-scales */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: W,
          height: H,
          transform: `scale(${maskS})`,
          transformOrigin: ORIGIN,
          clipPath: `url(#${CLIP_ID})`,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${1 / maskS})`, transformOrigin: ORIGIN }}>
          <div style={motion}>{video(true)}</div>
        </div>
      </div>

      {/* takeover layer: same motion transform, unmasked — carries the clip audio */}
      <div style={{ position: 'absolute', inset: 0, opacity: cover }}>
        <div style={motion}>{video(false)}</div>
      </div>

      {/* labels around the number */}
      <div
        style={{
          position: 'absolute',
          top: 640,
          width: '100%',
          textAlign: 'center',
          fontFamily: T.font,
          fontWeight: 800,
          fontSize: 50,
          letterSpacing: 8,
          color: T.gold,
          opacity: labels,
          transform: `translateY(${(1 - titleIn) * 24}px)`,
        }}
      >
        NGÀY QUỐC TẾ ĐÀN ÔNG
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1150,
          width: '100%',
          textAlign: 'center',
          fontFamily: T.font,
          fontWeight: 800,
          fontSize: 72,
          letterSpacing: 22,
          color: T.white,
          opacity: labels,
          transform: `translateY(${(1 - titleIn) * -24}px)`,
        }}
      >
        DSHN1
      </div>
    </AbsoluteFill>
  );
};
