// S6 · pill-slot-cycle (adapted from demos/typography/pill-slot-cycle/PillSlotCycle.tsx)
// Kept: stem absolutely left-anchored (no flex centring), per-word beat with an 8f swap window,
// incoming translateY 120→0 + blur 14→4→0 out-cubic, outgoing 0→-130 + blur 0→10 in-cubic,
// invisible placeholder pill sizes the slot, finale: last pill flies up (7f) and the closing words
// land with Easing.back(1.4) over 14f (the only overshoot), stem and finale share 96px/800, ≥44f hold.
// Adapted: beat = (8 musical beats − intro)/5 ≈ 20.4f so the finale lands on local beat 8;
// Vietnamese copy; inline SVG icons; brand colours.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { C, FONT } from '../theme';
import { useLayout } from '../layout';

type IK = 'cart' | 'receipt' | 'qr' | 'globe' | 'users';
const IconSvg: React.FC<{ k: IK }> = ({ k }) => (
  <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    {k === 'cart' && (<><path d="M3 4h2l2.4 11h10.2L20 8H6.2" /><circle cx={9} cy={19} r={1.4} /><circle cx={17} cy={19} r={1.4} /></>)}
    {k === 'receipt' && (<><path d="M6 3h12v18l-3-2-3 2-3-2-3 2Z" /><path d="M9 8h6M9 12h6" /></>)}
    {k === 'qr' && (<><rect x={3} y={3} width={7} height={7} rx={1} /><rect x={14} y={3} width={7} height={7} rx={1} /><rect x={3} y={14} width={7} height={7} rx={1} /><path d="M14 14h3v3M21 14v7h-7" /></>)}
    {k === 'globe' && (<><circle cx={12} cy={12} r={9} /><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" /></>)}
    {k === 'users' && (<><circle cx={9} cy={8} r={3.2} /><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6" /><path d="M16 4.5a3 3 0 0 1 0 6M18 14c2 .8 3 2.8 3 6" /></>)}
  </svg>
);

const Pill: React.FC<{ label: string; icon: IK; style?: React.CSSProperties }> = ({ label, icon, style }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 16,
      padding: '14px 38px 14px 22px',
      borderRadius: 999,
      background: '#fff',
      border: `3px solid ${C.line}`,
      boxShadow: '0 8px 22px rgba(12,45,94,0.10)',
      fontFamily: FONT,
      fontWeight: 800,
      fontSize: 64,
      color: C.navy,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    <span style={{ width: 60, height: 60, borderRadius: 16, background: '#E6F0FF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <IconSvg k={icon} />
    </span>
    {label}
  </div>
);

export const S6_DEFAULTS = {
  stem: 'Một phần mềm lo',
  pills: [
    { label: 'Bán hàng', icon: 'cart' as IK },
    { label: 'Kế toán & Thuế', icon: 'receipt' as IK },
    { label: 'Thanh toán QR', icon: 'qr' as IK },
    { label: 'Bán online', icon: 'globe' as IK },
    { label: 'Nhân viên', icon: 'users' as IK },
  ],
  finale: 'trọn mọi việc.',
  finaleLandFrame: 116, // local beat 8
};

export const S6PillSlot: React.FC<Partial<typeof S6_DEFAULTS>> = (p) => {
  const { stem, pills: PILLS, finale, finaleLandFrame } = { ...S6_DEFAULTS, ...p };
  const frame = useCurrentFrame();
  const V = useLayout().vertical;
  const INTRO = 14;
  const CYCLES = PILLS.length;
  const BEAT = (finaleLandFrame - INTRO) / CYCLES;
  const SWAP = 8;
  const stemT = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const cycleEnd = INTRO + CYCLES * BEAT;
  const rel = frame - INTRO;
  const idx = Math.max(0, Math.min(Math.floor(rel / BEAT), CYCLES - 1));
  const beatFrame = rel - idx * BEAT;
  const isFinale = frame >= cycleEnd;
  const finT = interpolate(frame, [cycleEnd, cycleEnd + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.4)) });

  let slot: React.ReactNode = null;
  if (!isFinale && rel >= 0) {
    const incoming = PILLS[idx];
    const outgoing = idx > 0 ? PILLS[idx - 1] : null;
    const inT = interpolate(beatFrame, [0, SWAP], [0, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
    const inY = interpolate(inT, [0, 1], [120, 0]);
    const inBlur = interpolate(inT, [0, 0.7, 1], [14, 4, 0]);
    const outT = interpolate(beatFrame, [0, SWAP - 1], [0, 1], { extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) });
    const outY = interpolate(outT, [0, 1], [0, -130]);
    slot = (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <Pill label={incoming.label} icon={incoming.icon} style={{ visibility: 'hidden' }} />
        {outgoing && outT < 1 && (
          <div style={{ position: 'absolute', left: 0, top: 0, transform: `translateY(${outY}px)`, opacity: 1 - outT, filter: `blur(${outT * 10}px)` }}>
            <Pill label={outgoing.label} icon={outgoing.icon} />
          </div>
        )}
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `translateY(${inY}px)`, opacity: idx === 0 ? inT : Math.min(1, inT * 1.6), filter: `blur(${inBlur}px)` }}>
          <Pill label={incoming.label} icon={incoming.icon} />
        </div>
      </div>
    );
  } else if (isFinale) {
    const lastOutT = interpolate(frame, [cycleEnd, cycleEnd + 7], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) });
    slot = (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <span
          style={{
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 96,
            color: C.blue,
            letterSpacing: -1,
            display: 'inline-block',
            opacity: finT,
            transform: `translateY(${(1 - finT) * 90}px)`,
            filter: `blur(${Math.max(0, 1 - finT) * 8}px)`,
            whiteSpace: 'nowrap',
          }}
        >
          {finale}
        </span>
        {lastOutT < 1 && (
          <div style={{ position: 'absolute', left: 0, top: -8, transform: `translateY(${-130 * lastOutT}px)`, opacity: 1 - lastOutT, filter: `blur(${lastOutT * 10}px)` }}>
            <Pill label={PILLS[CYCLES - 1].label} icon={PILLS[CYCLES - 1].icon} />
          </div>
        )}
      </div>
    );
  }

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <div style={{ position: 'absolute', width: 900, height: 900, left: V ? 100 : 600, top: V ? 500 : 200, borderRadius: '50%', background: '#CFE2FF', filter: 'blur(140px)', opacity: 0.55 }} />
      <div
        style={{
          position: 'absolute',
          left: V ? 96 : 205,
          top: V ? 830 : 540,
          transform: `translateY(calc(-50% + ${(1 - stemT) * 50}px))`,
          display: 'flex',
          flexDirection: V ? 'column' : 'row',
          alignItems: V ? 'flex-start' : 'center',
          gap: V ? 28 : 32,
          opacity: stemT,
        }}
      >
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 96, color: C.navy, letterSpacing: -1, whiteSpace: 'nowrap' }}>{stem}</span>
        {slot}
      </div>
    </AbsoluteFill>
  );
};
