// speed-ramp-freeze · freeze-annotate — adapted from
// demos/rhythm/speed-ramp-freeze/FreezeAnnotateReal.tsx for real footage.
// Kept: flow → hard freeze (slope 0, no ease-in) → unfreeze at >1× to compensate;
// freeze ≥45f; amber/gold marker ellipse drawn in 8f via strokeDashoffset with
// feTurbulence (scale 7) hand-drawn wobble, arrow 6f after, annotations fade 8f.
// Changed: the "card rail" is a video. Freeze = pre-extracted still of the exact
// frame (public/stills/c5-freeze.jpg, c5 @ 15.367 s); unfreeze plays at 1.4×.
import React, { useId } from 'react';
import { AbsoluteFill, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { Footage } from './components';
import { CLAMP, T } from './theme';

export const FREEZE = { flowEnd: 20, freezeEnd: 85 } as const;
const SRC = 'clips/c5.mp4';
const AT = 14.7; // in-point right after the camera whip; 14.7 s + 20f = 15.367 s = still frame
const FACE = { cx: 880, cy: 730, rx: 140, ry: 200 }; // rx keeps the ellipse ≥40px inside the frame

export const Freeze: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const roughId = `rough-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const { flowEnd, freezeEnd } = FREEZE;
  const draw = interpolate(f, [flowEnd + 7, flowEnd + 15], [0, 1], CLAMP);
  const arrow = interpolate(f, [flowEnd + 15, flowEnd + 21], [0, 1], CLAMP);
  const label = interpolate(f, [flowEnd + 17, flowEnd + 27], [0, 1], { ...CLAMP, easing: Easing.out(Easing.back(1.6)) });
  const fade = interpolate(f, [freezeEnd - 4, freezeEnd + 4], [1, 0], CLAMP);
  const dim = interpolate(f, [flowEnd, flowEnd + 6, freezeEnd - 2, freezeEnd + 4], [0, 0.32, 0.32, 0], CLAMP);
  const C = 1400; // ellipse perimeter (approx.)
  const { cx, cy, rx, ry } = FACE;
  return (
    <AbsoluteFill style={{ background: T.navy }}>
      <Sequence durationInFrames={flowEnd}>
        <Footage src={SRC} at={AT} dur={flowEnd} push={[1, 1]} volume={0.6} />
      </Sequence>
      <Sequence from={flowEnd} durationInFrames={freezeEnd - flowEnd}>
        <Img src={staticFile('stills/c5-freeze.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </Sequence>
      <Sequence from={freezeEnd} durationInFrames={dur - freezeEnd}>
        <Footage src={SRC} at={AT + flowEnd / 30} dur={dur - freezeEnd} push={[1, 1]} muted playbackRate={1.4} />
      </Sequence>

      {/* dim everything during the freeze so the circled face pops */}
      <AbsoluteFill style={{ background: `rgba(8,20,40,${dim})` }} />

      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: fade }}>
        <defs>
          <filter id={roughId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="7" />
          </filter>
        </defs>
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill="none"
          stroke={T.gold}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - draw)}
          transform={`rotate(-8 ${cx} ${cy})`}
          filter={`url(#${roughId})`}
        />
        <path
          d={`M 380 1250 Q 520 1060 ${cx - 140} ${cy + 200}`}
          fill="none"
          stroke={T.gold}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={520}
          strokeDashoffset={520 * (1 - arrow)}
          filter={`url(#${roughId})`}
        />
      </svg>

      <div
        style={{
          position: 'absolute',
          left: 70,
          top: 1270,
          opacity: Math.min(1, label * 1.3) * fade,
          transform: `scale(${0.85 + 0.15 * label}) rotate(-3deg)`,
          transformOrigin: '20% 50%',
          background: T.gold,
          color: T.navy,
          fontFamily: T.font,
          fontWeight: 900,
          fontSize: 76,
          padding: '18px 34px',
          borderRadius: 18,
          boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
        }}
      >
        Biểu cảm của năm
      </div>
    </AbsoluteFill>
  );
};
