// S4 · fui-hud-moves · reticle-lock-on (adapted from demos/effects/fui-hud-moves/ReticleLockOn.tsx)
// Kept: frame-of-reference flies in from off-screen (≥1000px, 10f out-cubic), shrink decoupled
// 2.2× → 1.06 → 0.94 → 1 (inOutCubic) for the "click" overshoot, lock frame = target flash
// 0.55 → rest 0.28 + label back-pop in the same beat, L arms 56px / 10px, no freeze.
// Adapted: target = the VietQR code on the KiotViet POS screen (real footage, still moving),
// lock frame pinned to local beat 3, HUD colour from the approved styleframe (#7CF5C4),
// left navy scrim + headline (direction B).
import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, interpolate, Easing } from 'remotion';
import { C, FONT } from '../theme';

const CARD_X = 930;
const CARD_Y = 250;
const CARD_W = 270;
const CARD_H = 410;
const PAD = 16;
const TCX = CARD_X + CARD_W / 2;
const TCY = CARD_Y + CARD_H / 2;
const ARM = 56;
const THICK = 10;
const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

export const S4_DEFAULTS = {
  lockFrame: 44,
  title: ['Khách trong nước', '& quốc tế đều quét được'],
  chips: ['VietQRPay', 'VietQRGlobal', 'NAPAS'],
  label: 'VietQR · quét là trả',
};

export const S4ReticleLock: React.FC<Partial<typeof S4_DEFAULTS>> = (p) => {
  const { lockFrame: LOCK_END, title, chips, label } = { ...S4_DEFAULTS, ...p };
  const FLY_IN = LOCK_END - 32;
  const FLY_END = LOCK_END - 22;
  const LABEL_END = LOCK_END + 10;
  const frame = useCurrentFrame();
  const flyT = interpolate(frame, [FLY_IN, FLY_END], [0, 1], { easing: Easing.out(Easing.cubic), ...clamp });
  const flyDX = (1 - flyT) * 1100;
  const flyDY = (1 - flyT) * 620;
  const shrink = interpolate(frame, [FLY_END, LOCK_END - 8, LOCK_END - 3, LOCK_END], [2.2, 1.06, 0.94, 1], { easing: Easing.inOut(Easing.cubic), ...clamp });
  const hw = (CARD_W / 2 + PAD) * shrink;
  const hh = (CARD_H / 2 + PAD) * shrink;
  const glow = interpolate(frame, [LOCK_END, LOCK_END + 3, LOCK_END + 10], [0, 0.55, 0.28], clamp);
  const labelT = interpolate(frame, [LOCK_END + 2, LABEL_END], [0, 1], { easing: Easing.out(Easing.back(1.8)), ...clamp });
  const showReticle = frame >= FLY_IN;
  const locked = frame >= LOCK_END;
  const textIn = (d: number) => interpolate(frame, [d, d + 10], [0, 1], { easing: Easing.out(Easing.cubic), ...clamp });
  const corners = [
    { x: TCX - hw, y: TCY - hh, sx: 1, sy: 1 },
    { x: TCX + hw, y: TCY - hh, sx: -1, sy: 1 },
    { x: TCX - hw, y: TCY + hh, sx: 1, sy: -1 },
    { x: TCX + hw, y: TCY + hh, sx: -1, sy: -1 },
  ];
  return (
    <AbsoluteFill style={{ background: '#000', overflow: 'hidden', fontFamily: FONT }}>
      <OffthreadVideo src={staticFile('footage/qrlock-slow.mp4')} muted style={{ width: 1920, height: 1080, objectFit: 'cover' }} />
      <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(8,26,56,.9) 0%, rgba(8,26,56,.72) 34%, rgba(8,26,56,0) 52%)' }} />
      {locked && (
        <div style={{ position: 'absolute', left: CARD_X, top: CARD_Y, width: CARD_W, height: CARD_H, borderRadius: 18, background: '#E9FFF6', opacity: glow * 0.6, mixBlendMode: 'screen' }} />
      )}
      {showReticle && (
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `translate(${flyDX}px, ${flyDY}px)` }}>
          {corners.map((c, i) => (
            <div key={i} style={{ position: 'absolute', left: c.x, top: c.y, transform: `scale(${c.sx}, ${c.sy})`, transformOrigin: '0 0', filter: 'drop-shadow(0 0 10px rgba(124,245,196,.6))' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: ARM, height: THICK, background: C.hud, borderRadius: 2 }} />
              <div style={{ position: 'absolute', left: 0, top: 0, width: THICK, height: ARM, background: C.hud, borderRadius: 2 }} />
            </div>
          ))}
          {frame >= LOCK_END + 2 && (
            <div
              style={{
                position: 'absolute',
                left: TCX + hw + 22,
                top: TCY - hh - 8,
                transform: `scale(${labelT})`,
                transformOrigin: '0 50%',
                background: C.hud,
                color: C.navyDeep,
                fontWeight: 800,
                fontSize: 30,
                padding: '12px 22px',
                borderRadius: 10,
                whiteSpace: 'nowrap',
                opacity: Math.min(1, labelT * 1.5),
              }}
            >
              {label}
            </div>
          )}
        </div>
      )}
      <div style={{ position: 'absolute', left: 110, top: 330, width: 820 }}>
        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 6, color: C.sky, opacity: textIn(2) }}>THANH TOÁN QR</div>
        {title.map((l, i) => (
          <div key={i} style={{ fontSize: 62, fontWeight: 800, color: '#fff', lineHeight: 1.15, whiteSpace: 'nowrap', marginTop: i === 0 ? 18 : 0, opacity: textIn(5 + i * 4), transform: `translateY(${(1 - textIn(5 + i * 4)) * 18}px)` }}>
            {l}
          </div>
        ))}
        <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
          {chips.map((c, i) => (
            <div key={c} style={{ padding: '12px 26px', borderRadius: 999, background: 'rgba(255,255,255,.14)', border: '2px solid rgba(255,255,255,.4)', color: '#fff', fontSize: 32, fontWeight: 700, opacity: textIn(14 + i * 3) }}>
              {c}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
