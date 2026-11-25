// S2 · odometer-digit-roll (adapted from demos/data/odometer-digit-roll/OdometerDigitRoll.tsx)
// Kept: ROW 210 / DW 126 / FS 190 fw800 tabular-nums, SPIN 0.85 row/f, per-digit 16f out-cubic decel
// to +0.5 row overshoot then 6f snap back, left→right 7f stagger, 2 velocity-gated ghost strips
// (0.25/0.12), lock pulse (deepen + 1.035 scale, 8f), label fade after lock, ≥30f true hold.
// Adapted: real value 300.000+ (6 rolling digits = card max), decel starts at 6f (shot is 7 beats),
// brand navy ink, Vietnamese label + fact chips.
import React from 'react';
import { useCurrentFrame, interpolate, interpolateColors, Easing } from 'remotion';
import { C, FONT } from '../theme';

const ROW = 210;
const DW = 126;
const FS = 190;
const SPIN = 0.85;
const DIGITS = [3, 0, 0, 0, 0, 0];
const S0 = 6; // first decel frame
const STEP = 7;
const LOCK = S0 + (DIGITS.length - 1) * STEP + 22; // 63

const posAt = (f: number, i: number): number => {
  const d = DIGITS[i];
  const s = S0 + i * STEP;
  const p0 = SPIN * s;
  const T = Math.ceil((p0 + 6 - d) / 10) * 10 + d;
  if (f < s) return SPIN * Math.max(f, 0);
  if (f < s + 16)
    return interpolate(f, [s, s + 16], [p0, T + 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  if (f < s + 22)
    return interpolate(f, [s + 16, s + 22], [T + 0.5, T], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  return T;
};

const Strip: React.FC<{ pos: number; color: string; opacity?: number; dy?: number }> = ({ pos, color, opacity = 1, dy = 0 }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: DW, transform: `translateY(${-(pos % 10) * ROW + dy}px)`, opacity }}>
    {Array.from({ length: 20 }).map((_, k) => (
      <div key={k} style={{ width: DW, height: ROW, lineHeight: `${ROW}px`, textAlign: 'center', fontSize: FS, fontWeight: 800, fontVariantNumeric: 'tabular-nums', color }}>
        {k % 10}
      </div>
    ))}
  </div>
);

const DigitReel: React.FC<{ frame: number; i: number; color: string }> = ({ frame, i, color }) => {
  const pos = posAt(frame, i);
  const speed = Math.abs(pos - posAt(frame - 1, i));
  const gate = interpolate(speed, [0.06, 0.5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'relative', width: DW, height: ROW, overflow: 'hidden' }}>
      {gate > 0.001 && (
        <>
          <Strip pos={pos} color={color} opacity={0.25 * gate} dy={ROW * 0.5} />
          <Strip pos={pos} color={color} opacity={0.12 * gate} dy={-ROW * 0.5} />
        </>
      )}
      <Strip pos={pos} color={color} />
    </div>
  );
};

const Glyph: React.FC<{ ch: string; color: string; w?: number }> = ({ ch, color, w }) => (
  <div style={{ width: w, height: ROW, lineHeight: `${ROW}px`, textAlign: 'center', fontSize: FS, fontWeight: 800, color }}>{ch}</div>
);

export const S2_DEFAULTS = {
  label: 'nhà bán hàng tin dùng',
  chips: ['25 văn phòng', 'Bán lẻ 75%', 'F&B 20%', 'Đặt chỗ 5%'],
};

export const S2Odometer: React.FC<Partial<typeof S2_DEFAULTS>> = (p) => {
  const { label, chips } = { ...S2_DEFAULTS, ...p };
  const frame = useCurrentFrame();
  const ink = interpolateColors(frame, [LOCK, LOCK + 4, LOCK + 8], [C.navy, '#061634', C.navy]);
  const pulse = interpolate(frame, [LOCK, LOCK + 4, LOCK + 8], [1, 1.035, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad) });
  const labelOp = interpolate(frame, [LOCK - 3, LOCK + 13], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });
  const enter = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <div style={{ width: 1920, height: 1080, background: C.bg, position: 'relative', overflow: 'hidden', fontFamily: FONT }}>
      <div style={{ position: 'absolute', width: 900, height: 900, left: -250, top: -380, borderRadius: '50%', background: '#BFD9FF', filter: 'blur(120px)', opacity: 0.5 }} />
      <div style={{ position: 'absolute', width: 800, height: 800, right: -220, bottom: -380, borderRadius: '50%', background: '#C9F2D2', filter: 'blur(120px)', opacity: 0.5 }} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 300,
          width: 1920,
          display: 'flex',
          justifyContent: 'center',
          transform: `scale(${pulse})`,
          transformOrigin: '960px 105px',
          opacity: enter,
        }}
      >
        <DigitReel frame={frame} i={0} color={ink} />
        <DigitReel frame={frame} i={1} color={ink} />
        <DigitReel frame={frame} i={2} color={ink} />
        <Glyph ch="." color={ink} w={64} />
        <DigitReel frame={frame} i={3} color={ink} />
        <DigitReel frame={frame} i={4} color={ink} />
        <DigitReel frame={frame} i={5} color={ink} />
        <Glyph ch="+" color={C.blue} w={130} />
      </div>
      <div style={{ position: 'absolute', left: 0, top: 560, width: 1920, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40, opacity: labelOp }}>
        <div style={{ fontSize: 64, fontWeight: 800, color: C.navy, transform: `translateY(${(1 - labelOp) * 12}px)` }}>{label}</div>
        <div style={{ display: 'flex', gap: 20 }}>
          {chips.map((c) => (
            <div key={c} style={{ padding: '16px 32px', borderRadius: 999, background: '#fff', boxShadow: '0 10px 30px rgba(12,45,94,.08)', fontSize: 32, fontWeight: 700, color: C.navy }}>
              {c}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
