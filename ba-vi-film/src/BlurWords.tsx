// typography/blur-slide (BlurSlide.tsx): per-word y + blur + opacity on ONE shared outCubic progress.
// Frame-based port: word gap ≈3.5f (4f here), 20f entrance window; dy/blur scaled ×2.25 (480→1080 design width).
import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';

export const BlurWords: React.FC<{
  text: string; start: number; gap: number; win: number; dy: number; blurMax: number; style: React.CSSProperties;
}> = ({ text, start, gap, win, dy, blurMax, style }) => {
  const f = useCurrentFrame();
  const words = text.split(' ');
  return (
    <div style={{ display: 'flex', gap: '0.32em', justifyContent: 'center', flexWrap: 'nowrap', ...style }}>
      {words.map((w, i) => {
        const p = interpolate(f, [start + i * gap, start + i * gap + win], [0, 1], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic),
        });
        return (
          <span key={i} style={{ opacity: p, transform: `translateY(${(1 - p) * dy}px)`, filter: `blur(${(1 - p) * blurMax}px)`, whiteSpace: 'pre' }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};
