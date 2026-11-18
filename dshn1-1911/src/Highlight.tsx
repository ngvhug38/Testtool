// Reaction highlights: a hand-drawn gold ellipse that follows a tracked face for ~1 s
// plus a tilted label tag. Same marker vocabulary as the freeze-annotate shot (8f
// strokeDashoffset draw, feTurbulence scale 7 wobble) but WITHOUT freezing — the
// footage keeps playing, so the one freeze stays the hero ("Biểu cảm của năm").
// Face tracks come from notes/track-faces.py (OpenCV Haar, 7-frame smoothing),
// stored in src/faces.json as [x, y, r] per frame in 1080×1920 space.
import React, { useId } from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import faces from './faces.json';
import { CLAMP, T } from './theme';

export type FaceTrack = { key: string; clip: string; t0: number; t1: number; label: string; track: number[][] };
export const FACES = faces as FaceTrack[];

const clampR = (r: number) => Math.max(80, Math.min(150, r));

export const Highlight: React.FC<{ face: FaceTrack }> = ({ face }) => {
  const f = useCurrentFrame();
  const roughId = `hl-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const n = face.track.length;
  const [x, y, r0] = face.track[Math.min(n - 1, Math.max(0, f))];
  const r = clampR(r0);
  const rx = r * 1.25;
  const ry = r * 1.5;
  const draw = interpolate(f, [2, 10], [0, 1], CLAMP);
  const tag = interpolate(f, [6, 16], [0, 1], { ...CLAMP, easing: Easing.out(Easing.back(1.7)) });
  const out = interpolate(f, [n - 6, n], [1, 0], CLAMP);
  const C = 2 * Math.PI * Math.sqrt((rx * rx + ry * ry) / 2);

  // Tag below the face (over the subject's own body, so it never covers a bystander's
  // face); above only when the face sits so low the tag would reach the caption band.
  const below = y < 1100;
  const tagY = below ? y + ry + 36 : y - ry - 120;
  // Keep the whole tag ≥50px inside the frame: half-width estimated from the label
  // length at 60px/900 (≈32px per glyph incl. padding).
  const half = face.label.length * 16 + 40;
  const tagX = Math.max(50 + half, Math.min(1030 - half, x));

  return (
    <AbsoluteFill style={{ opacity: out, pointerEvents: 'none' }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id={roughId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="11" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="7" />
          </filter>
        </defs>
        <ellipse
          cx={x}
          cy={y}
          rx={rx}
          ry={ry}
          fill="none"
          stroke={T.gold}
          strokeWidth={11}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - draw)}
          transform={`rotate(-8 ${x} ${y})`}
          filter={`url(#${roughId})`}
          style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.35))' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: tagX,
          top: tagY,
          transform: `translateX(-50%) scale(${0.8 + 0.2 * tag}) rotate(${below ? 3 : -3}deg)`,
          opacity: Math.min(1, tag * 1.4),
          background: T.gold,
          color: T.navy,
          fontFamily: T.font,
          fontWeight: 900,
          fontSize: 60,
          whiteSpace: 'nowrap',
          padding: '14px 30px',
          borderRadius: 16,
          boxShadow: '0 10px 32px rgba(0,0,0,0.35)',
        }}
      >
        {face.label}
      </div>
    </AbsoluteFill>
  );
};
