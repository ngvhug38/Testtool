// transition-hidden-cut C · light-leak-burn (LightLeakBurn.tsx), scaled to a 1080×1920 frame.
// ease-in rise 27f → peak frame = hidden cut → ease-out fall 43f.
import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { beatF } from './timeline';

export const LEAK_RISE = 27;
export const LEAK_FALL = 43;
export const LEAK_PEAK = beatF(140);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export const leakIntensity = (g: number) => {
  if (g < LEAK_PEAK - LEAK_RISE || g > LEAK_PEAK + LEAK_FALL) return 0;
  return g <= LEAK_PEAK
    ? interpolate(g, [LEAK_PEAK - LEAK_RISE, LEAK_PEAK], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) })
    : interpolate(g, [LEAK_PEAK, LEAK_PEAK + LEAK_FALL], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
};

const BLOBS = [0, 1, 2].map((i) => {
  const j1 = (Math.sin(i * 127.3) * 43758) % 1;
  const j2 = (Math.sin(i * 311.7) * 27183) % 1;
  return {
    dx: i * 200 - 200 + j1 * 70,
    dy: i * 260 - 260 + j2 * 90,
    d: 1500 + i * 450,
    color: ['#f6c878', '#e8a44a', '#d98a2b'][i],
    alpha: [0.95, 0.8, 0.55][i],
  };
});

export const LightLeak: React.FC = () => {
  const f = useCurrentFrame();
  const g = LEAK_PEAK - LEAK_RISE + f;
  const intensity = leakIntensity(g);
  const sweep = interpolate(f, [0, LEAK_RISE + LEAK_FALL], [0, 1], { ...clamp, easing: Easing.bezier(0.4, 0, 0.3, 1) });
  // top-right → bottom-left diagonal across the portrait frame
  const cx = interpolate(sweep, [0, 1], [1500, -420]);
  const cy = interpolate(sweep, [0, 1], [-560, 2480]);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ background: '#e8a44a', opacity: intensity * 0.08, mixBlendMode: 'screen' }} />
      {BLOBS.map((b, i) => (
        <div key={i} style={{
          position: 'absolute', left: cx + b.dx - b.d / 2, top: cy + b.dy - b.d / 2, width: b.d, height: b.d,
          borderRadius: '50%', background: `radial-gradient(circle, ${b.color} 0%, ${b.color}cc 30%, transparent 68%)`,
          filter: 'blur(90px)', mixBlendMode: 'screen', opacity: b.alpha * intensity,
        }} />
      ))}
      <div style={{
        position: 'absolute', left: cx - 550, top: cy - 550, width: 1100, height: 1100, borderRadius: '50%',
        background: 'radial-gradient(circle, #fff3dd 0%, #f6c878aa 45%, transparent 70%)', filter: 'blur(80px)',
        mixBlendMode: 'screen', opacity: intensity * intensity,
      }} />
    </AbsoluteFill>
  );
};
