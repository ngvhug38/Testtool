// S4 · fui-hud-moves · reticle-lock-on (adapted from demos/effects/fui-hud-moves/ReticleLockOn.tsx)
// Kept: frame-of-reference flies in from off-screen (≥1000px, 10f out-cubic), shrink decoupled
// 2.2× → 1.06 → 0.94 → 1 (inOutCubic) for the "click" overshoot, lock frame = target flash
// 0.55 → rest 0.28 + label back-pop in the same beat, L arms 56px / 10px, no freeze.
// Adapted: target = the VietQR code on the KiotViet POS screen. The four L corners ride the code's
// tracked corner quad (src/data/qrTrack.json: OpenCV QR detection + optical-flow gap fill, Gaussian
// smoothed), so the reticle rotates/skews with the code's real orientation (client feedback round 3).
// Lock frame pinned to local beat 3; HUD colour #7CF5C4; navy scrim + headline (direction B).
// Vertical (TikTok) layout: footage is cover-cropped, the track is mapped through footageMap, the
// headline moves to the lower safe zone.
import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, interpolate, Easing } from 'remotion';
import { C, FONT } from '../theme';
import { useLayout, footageMap } from '../layout';
import TRACK from '../data/qrTrack.json';

const PAD = 30; // outset of the reticle around the code (px, footage space)
const ARM = 56;
const THICK = 10;
const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
type P = [number, number];

export const S4_DEFAULTS = {
  lockFrame: 44,
  eyebrow: 'THANH TOÁN XUYÊN QUỐC GIA',
  title: ['Khách trong nước', '& quốc tế đều quét được'],
  chips: ['VietQRPay', 'VietQRGlobal', 'NAPAS'],
  label: 'VietQR · quét là trả',
};

export const S4ReticleLock: React.FC<Partial<typeof S4_DEFAULTS>> = (p) => {
  const { lockFrame: LOCK_END, eyebrow, title, chips, label } = { ...S4_DEFAULTS, ...p };
  const L = useLayout();
  const map = footageMap(L);
  const FLY_IN = LOCK_END - 32;
  const FLY_END = LOCK_END - 22;
  const LABEL_END = LOCK_END + 10;
  const frame = useCurrentFrame();
  const q = (TRACK as number[][][])[Math.min(TRACK.length - 1, Math.max(0, frame))].map(([x, y]) => map(x, y)) as P[];
  const cx = q.reduce((s, v) => s + v[0], 0) / 4;
  const cy = q.reduce((s, v) => s + v[1], 0) / 4;
  const sideLen = Math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1]);
  const scaleK = L.vertical ? L.H / 1080 : 1;
  const out = 1 + (2 * PAD * scaleK) / sideLen;

  const flyT = interpolate(frame, [FLY_IN, FLY_END], [0, 1], { easing: Easing.out(Easing.cubic), ...clamp });
  const flyDX = (1 - flyT) * 1100;
  const flyDY = (1 - flyT) * 620;
  const shrink = interpolate(frame, [FLY_END, LOCK_END - 8, LOCK_END - 3, LOCK_END], [2.2, 1.06, 0.94, 1], { easing: Easing.inOut(Easing.cubic), ...clamp });
  const glow = interpolate(frame, [LOCK_END, LOCK_END + 3, LOCK_END + 10], [0, 0.55, 0.28], clamp);
  const labelT = interpolate(frame, [LOCK_END + 2, LABEL_END], [0, 1], { easing: Easing.out(Easing.back(1.8)), ...clamp });
  const showReticle = frame >= FLY_IN;
  const locked = frame >= LOCK_END;
  const textIn = (d: number) => interpolate(frame, [d, d + 10], [0, 1], { easing: Easing.out(Easing.cubic), ...clamp });

  // reticle corners = tracked quad expanded around its centre, then shrink overshoot, then fly offset
  const corner = (v: P): P => [cx + (v[0] - cx) * out * shrink + flyDX, cy + (v[1] - cy) * out * shrink + flyDY];
  const R = q.map(corner);
  const unit = (a: P, b: P): P => {
    const d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return [(b[0] - a[0]) / d, (b[1] - a[1]) / d];
  };
  const glowPoly = q.map((v) => `${cx + (v[0] - cx) * out},${cy + (v[1] - cy) * out}`).join(' ');
  const tr = R[1];

  const textBlock = L.vertical
    ? { position: 'absolute' as const, left: L.safe.l + 16, top: 1075, width: L.safe.r - L.safe.l - 32 }
    : { position: 'absolute' as const, left: 110, top: 330, width: 820 };
  const titleSize = L.vertical ? 64 : 62;

  return (
    <AbsoluteFill style={{ background: '#000', overflow: 'hidden', fontFamily: FONT }}>
      <OffthreadVideo src={staticFile('footage/qrlock-slow.mp4')} muted style={{ width: L.W, height: L.H, objectFit: 'cover' }} />
      <AbsoluteFill
        style={{
          background: L.vertical
            ? 'linear-gradient(180deg, rgba(8,26,56,0) 40%, rgba(8,26,56,.78) 56%, rgba(8,26,56,.9) 100%)'
            : 'linear-gradient(90deg, rgba(8,26,56,.9) 0%, rgba(8,26,56,.72) 34%, rgba(8,26,56,0) 52%)',
        }}
      />
      <svg width={L.W} height={L.H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {locked && <polygon points={glowPoly} fill="#E9FFF6" opacity={glow * 0.6} style={{ mixBlendMode: 'screen' }} />}
        {showReticle &&
          R.map((v, i) => {
            const a = unit(v, R[(i + 1) % 4]);
            const b = unit(v, R[(i + 3) % 4]);
            const arm = ARM * (L.vertical ? 1.2 : 1);
            return (
              <polyline
                key={i}
                points={`${v[0] + a[0] * arm},${v[1] + a[1] * arm} ${v[0]},${v[1]} ${v[0] + b[0] * arm},${v[1] + b[1] * arm}`}
                fill="none"
                stroke={C.hud}
                strokeWidth={THICK}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: 'drop-shadow(0 0 10px rgba(124,245,196,.6))' }}
              />
            );
          })}
      </svg>
      {showReticle && frame >= LOCK_END + 2 && (
        <div
          style={{
            position: 'absolute',
            left: L.vertical ? Math.min(tr[0] - 120, L.safe.r - 440) : tr[0] + 22,
            top: L.vertical ? tr[1] - 110 : tr[1] - 30,
            transform: `scale(${labelT})`,
            transformOrigin: '0 50%',
            background: C.hud,
            color: C.navyDeep,
            fontWeight: 800,
            fontSize: L.vertical ? 36 : 30,
            padding: '12px 22px',
            borderRadius: 10,
            whiteSpace: 'nowrap',
            opacity: Math.min(1, labelT * 1.5),
          }}
        >
          {label}
        </div>
      )}
      <div style={textBlock}>
        <div style={{ fontSize: L.vertical ? 34 : 30, fontWeight: 800, letterSpacing: L.vertical ? 4 : 6, color: C.sky, opacity: textIn(2) }}>{eyebrow}</div>
        {title.map((l, i) => (
          <div key={i} style={{ fontSize: titleSize, fontWeight: 800, color: '#fff', lineHeight: 1.15, whiteSpace: 'nowrap', marginTop: i === 0 ? 18 : 0, opacity: textIn(5 + i * 4), transform: `translateY(${(1 - textIn(5 + i * 4)) * 18}px)` }}>
            {l}
          </div>
        ))}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 40 }}>
          {chips.map((c, i) => (
            <div key={c} style={{ padding: '12px 26px', borderRadius: 999, background: 'rgba(255,255,255,.14)', border: '2px solid rgba(255,255,255,.4)', color: '#fff', fontSize: L.vertical ? 36 : 32, fontWeight: 700, opacity: textIn(14 + i * 3) }}>
              {c}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
